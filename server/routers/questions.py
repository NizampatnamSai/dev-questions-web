import os
from datetime import date, timezone, datetime
from typing import Optional
from fastapi import APIRouter, HTTPException, Depends, Header
from pydantic import BaseModel
from db_mongo import col_questions, col_comments, col_ai_usage, sid, oid, now
from deps import current_user
from utils.ai import generate_questions, generate_answer, ai_text_action, check_answer
from utils.firebase import send_to_all

router = APIRouter()

CATEGORIES = ["HTML/CSS", "JavaScript", "React", "Next.js", "React Native"]
LEVELS     = ["Low", "Medium", "High"]
TYPES      = ["Technical", "Coding"]
AI_LIMIT   = int(os.getenv("AI_DAILY_LIMIT", "10"))
VALID_ACTIONS = {"improve", "summarize", "correct", "explain"}


# ── Serialize question doc → API dict ─────────────────────────────────────────

def _ser(doc: dict, uid: str = None) -> dict:
    qid = str(doc["_id"])
    upvotes    = doc.get("upvotes",    [])
    bookmarks  = doc.get("bookmarks",  [])
    highlights = doc.get("highlights", [])
    return {
        "id":             qid,
        "userId":         doc.get("userId"),
        "category":       doc.get("category"),
        "level":          doc.get("level"),
        "type":           doc.get("type", "Technical"),
        "question":       doc.get("question"),
        "answer":         doc.get("answer"),
        "hints":          doc.get("hints", []),
        "tags":           doc.get("tags", []),
        "status":         doc.get("status", "published"),
        "createdAt":      doc["createdAt"].isoformat() if isinstance(doc.get("createdAt"), datetime) else str(doc.get("createdAt", "")),
        "upvoteCount":    len(upvotes),
        "highlightCount": len(highlights),
        "commentCount":   doc.get("commentCount", 0),
        "isUpvoted":      uid in upvotes    if uid else False,
        "isBookmarked":   uid in bookmarks  if uid else False,
        "isHighlighted":  uid in highlights if uid else False,
        "author": {"id": doc.get("userId"), "name": doc.get("authorName", "Unknown")},
    }


# ── AI usage helpers ──────────────────────────────────────────────────────────

async def _get_ai_usage(uid: str) -> int:
    today = date.today().isoformat()
    doc = await col_ai_usage().find_one({"userId": uid, "date": today})
    return doc["questionsGenerated"] if doc else 0


async def _inc_ai_usage(uid: str, count: int = 1):
    today = date.today().isoformat()
    await col_ai_usage().update_one(
        {"userId": uid, "date": today},
        {"$inc": {"questionsGenerated": count}},
        upsert=True,
    )


# ── Daily post status ─────────────────────────────────────────────────────────

@router.get("/daily-status")
async def daily_status(user=Depends(current_user)):
    uid = user["id"]
    today_start = datetime.combine(date.today(), datetime.min.time()).replace(tzinfo=timezone.utc)
    used = await col_questions().count_documents({"userId": uid, "createdAt": {"$gte": today_start}})
    limit = user.get("dailyLimit", 10)
    return {"used": used, "limit": limit, "remaining": max(0, limit - used)}


# ── AI generate usage ─────────────────────────────────────────────────────────

@router.get("/generate/usage")
async def gen_usage(user=Depends(current_user)):
    used = await _get_ai_usage(user["id"])
    return {"used": used, "limit": AI_LIMIT, "remaining": max(0, AI_LIMIT - used)}


# ── AI Text Tools ─────────────────────────────────────────────────────────────

class HelperBody(BaseModel):
    input:  str = ""
    text:   str = ""
    action: str = "improve"


@router.post("/ai-helper")
async def question_helper(body: HelperBody, user=Depends(current_user)):
    raw = (body.input or body.text).strip()
    if not raw:
        raise HTTPException(400, "Input cannot be empty")
    if len(raw) > 2000:
        raise HTTPException(400, "Input too long (max 2000 chars)")
    action = body.action if body.action in VALID_ACTIONS else "improve"
    result = await ai_text_action(action, raw)
    return {"question": result, "result": result, "action": action}


# ── AI Generate questions ─────────────────────────────────────────────────────

class GenBody(BaseModel):
    category: str
    level:    str
    type:     str = "Technical"
    count:    int


@router.post("/generate")
async def gen_questions(body: GenBody, user=Depends(current_user)):
    if body.category not in CATEGORIES: raise HTTPException(400, "Invalid category")
    if body.level    not in LEVELS:     raise HTTPException(400, "Invalid level")
    if body.type     not in TYPES:      raise HTTPException(400, "Invalid type")
    if body.count    not in [1,3,5,10]: raise HTTPException(400, "count must be 1, 3, 5, or 10")
    result = await generate_questions(body.category, body.level, body.type, body.count)
    return result


# ── AI Generate answer ────────────────────────────────────────────────────────

class GenAnswerBody(BaseModel):
    question: str
    category: str
    level:    str
    type:     str = "Technical"


@router.post("/generate/answer")
async def gen_answer(body: GenAnswerBody, user=Depends(current_user)):
    if len(body.question.strip()) < 10: raise HTTPException(400, "Question too short")
    if body.category not in CATEGORIES: raise HTTPException(400, "Invalid category")
    if body.level    not in LEVELS:     raise HTTPException(400, "Invalid level")
    if body.type     not in TYPES:      raise HTTPException(400, "Invalid type")
    result = await generate_answer(body.question.strip(), body.category, body.level, body.type)
    return result


# ── Community feed ────────────────────────────────────────────────────────────

@router.get("/community")
async def community(
    category:  Optional[str] = None,
    level:     Optional[str] = None,
    type:      Optional[str] = None,
    tag:       Optional[str] = None,
    search:    Optional[str] = None,
    x_user_id: Optional[str] = Header(default=None),
):
    filt: dict = {"status": "published"}
    if category: filt["category"] = category
    if level:    filt["level"]    = level
    if type:     filt["type"]     = type
    if tag:      filt["tags"]     = tag
    if search:
        filt["$or"] = [
            {"question": {"$regex": search, "$options": "i"}},
            {"answer":   {"$regex": search, "$options": "i"}},
        ]
    cursor = col_questions().find(filt).sort("createdAt", -1).limit(200)
    docs   = await cursor.to_list(length=200)
    return [_ser(d, x_user_id) for d in docs]


# ── My questions ──────────────────────────────────────────────────────────────

@router.get("/mine")
async def mine(user=Depends(current_user)):
    cursor = col_questions().find({"userId": user["id"]}).sort("createdAt", -1)
    docs   = await cursor.to_list(length=500)
    return [_ser(d, user["id"]) for d in docs]


# ── Bookmarks ─────────────────────────────────────────────────────────────────

@router.get("/bookmarks")
async def bookmarks(user=Depends(current_user)):
    uid    = user["id"]
    cursor = col_questions().find({"bookmarks": uid}).sort("createdAt", -1)
    docs   = await cursor.to_list(length=500)
    return [_ser(d, uid) for d in docs]


# ── Create question ───────────────────────────────────────────────────────────

class CreateBody(BaseModel):
    category: str
    level:    str
    type:     str = "Technical"
    question: str
    answer:   str
    hints:    list = []
    tags:     list = []
    status:   str  = "published"


@router.post("/")
async def create(body: CreateBody, user=Depends(current_user)):
    if body.category not in CATEGORIES: raise HTTPException(400, "Invalid category")
    if body.level    not in LEVELS:     raise HTTPException(400, "Invalid level")
    if body.type     not in TYPES:      raise HTTPException(400, "Invalid type")
    if not body.question or not body.answer: raise HTTPException(400, "question and answer required")

    # Enforce per-user daily post limit
    uid = user["id"]
    today_start = datetime.combine(date.today(), datetime.min.time()).replace(tzinfo=timezone.utc)
    today_count = await col_questions().count_documents({"userId": uid, "createdAt": {"$gte": today_start}})
    daily_limit = user.get("dailyLimit", 10)
    if today_count >= daily_limit:
        raise HTTPException(429, f"Daily posting limit reached ({daily_limit}/day). Ask admin to increase your limit.")

    status = "draft" if body.status == "draft" else "published"
    doc = {
        "userId":       uid,
        "authorName":   user.get("name", "Unknown"),
        "category":     body.category,
        "level":        body.level,
        "type":         body.type,
        "question":     body.question,
        "answer":       body.answer,
        "hints":        body.hints,
        "tags":         body.tags,
        "status":       status,
        "createdAt":    now(),
        "upvotes":      [],
        "bookmarks":    [],
        "highlights":   [],
        "commentCount": 0,
    }
    result = await col_questions().insert_one(doc)
    created = await col_questions().find_one({"_id": result.inserted_id})

    if status == "published":
        short_q = body.question[:80] + ("…" if len(body.question) > 80 else "")
        from db_mongo import col_fcm_tokens
        rows = await col_fcm_tokens().find({}).to_list(length=1000)
        from utils.firebase import send_to_tokens
        tokens = [r["token"] for r in rows]
        await send_to_tokens(tokens, f"New question by {user['name']}", short_q, {"questionId": str(result.inserted_id)})

    return _ser(created, uid)


# ── Update question ───────────────────────────────────────────────────────────

class UpdateBody(BaseModel):
    category: Optional[str] = None
    level:    Optional[str] = None
    type:     Optional[str] = None
    question: Optional[str] = None
    answer:   Optional[str] = None
    hints:    Optional[list] = None
    tags:     Optional[list] = None
    status:   Optional[str] = None


@router.put("/{qid}")
async def update(qid: str, body: UpdateBody, user=Depends(current_user)):
    doc = await col_questions().find_one({"_id": oid(qid)})
    if not doc: raise HTTPException(404, "Not found")
    if doc["userId"] != user["id"] and user.get("role") != "admin":
        raise HTTPException(403, "Not allowed")
    patch = {k: v for k, v in body.dict().items() if v is not None}
    if patch:
        await col_questions().update_one({"_id": oid(qid)}, {"$set": patch})
    updated = await col_questions().find_one({"_id": oid(qid)})
    return _ser(updated, user["id"])


# ── Delete question ───────────────────────────────────────────────────────────

@router.delete("/{qid}")
async def delete(qid: str, user=Depends(current_user)):
    doc = await col_questions().find_one({"_id": oid(qid)})
    if not doc: raise HTTPException(404, "Not found")
    if doc["userId"] != user["id"] and user.get("role") != "admin":
        raise HTTPException(403, "Not allowed")
    await col_questions().delete_one({"_id": oid(qid)})
    await col_comments().delete_many({"questionId": qid})
    return {"message": "Deleted"}


# ── Upvote toggle ─────────────────────────────────────────────────────────────

@router.post("/{qid}/upvote")
async def upvote(qid: str, user=Depends(current_user)):
    uid = user["id"]
    doc = await col_questions().find_one({"_id": oid(qid)})
    if not doc: raise HTTPException(404, "Not found")
    if uid in doc.get("upvotes", []):
        await col_questions().update_one({"_id": oid(qid)}, {"$pull": {"upvotes": uid}})
        action = "removed"
    else:
        await col_questions().update_one({"_id": oid(qid)}, {"$addToSet": {"upvotes": uid}})
        action = "added"
    updated = await col_questions().find_one({"_id": oid(qid)})
    return {**_ser(updated, uid), "action": action}


# ── Bookmark toggle ───────────────────────────────────────────────────────────

@router.post("/{qid}/bookmark")
async def bookmark(qid: str, user=Depends(current_user)):
    uid = user["id"]
    doc = await col_questions().find_one({"_id": oid(qid)})
    if not doc: raise HTTPException(404, "Not found")
    if uid in doc.get("bookmarks", []):
        await col_questions().update_one({"_id": oid(qid)}, {"$pull": {"bookmarks": uid}})
    else:
        await col_questions().update_one({"_id": oid(qid)}, {"$addToSet": {"bookmarks": uid}})
    updated = await col_questions().find_one({"_id": oid(qid)})
    return _ser(updated, uid)


# ── Highlight toggle ──────────────────────────────────────────────────────────

@router.post("/{qid}/highlight")
async def highlight(qid: str, user=Depends(current_user)):
    uid = user["id"]
    doc = await col_questions().find_one({"_id": oid(qid)})
    if not doc: raise HTTPException(404, "Not found")
    if uid in doc.get("highlights", []):
        await col_questions().update_one({"_id": oid(qid)}, {"$pull": {"highlights": uid}})
    else:
        await col_questions().update_one({"_id": oid(qid)}, {"$addToSet": {"highlights": uid}})
    updated = await col_questions().find_one({"_id": oid(qid)})
    return _ser(updated, uid)


# ── Single question (for detail page & quiz) ──────────────────────────────────

@router.get("/{qid}")
async def get_question(qid: str, user=Depends(current_user)):
    doc = await col_questions().find_one({"_id": oid(qid)})
    if not doc: raise HTTPException(404, "Not found")
    return _ser(doc, user["id"])


# ── Quiz: random questions ────────────────────────────────────────────────────

@router.get("/quiz/random")
async def quiz_random(
    category: Optional[str] = None,
    level:    Optional[str] = None,
    count:    int = 10,
    user=Depends(current_user),
):
    if count > 20: count = 20
    filt: dict = {"status": "published"}
    if category: filt["category"] = category
    if level:    filt["level"]    = level
    pipeline = [
        {"$match": filt},
        {"$sample": {"size": count}},
    ]
    docs = [d async for d in col_questions().aggregate(pipeline)]
    return [_ser(d, user["id"]) for d in docs]


# ── AI Answer Checker ─────────────────────────────────────────────────────────

class CheckAnswerBody(BaseModel):
    user_answer: str


@router.post("/{qid}/check-answer")
async def check_answer_endpoint(qid: str, body: CheckAnswerBody, user=Depends(current_user)):
    if not body.user_answer.strip():
        raise HTTPException(400, "Answer cannot be empty")
    doc = await col_questions().find_one({"_id": oid(qid)})
    if not doc: raise HTTPException(404, "Not found")
    result = await check_answer(
        question=doc.get("question", ""),
        ideal_answer=doc.get("answer", ""),
        user_answer=body.user_answer.strip(),
    )
    return result
