import os
from datetime import date, timezone, datetime, timedelta
from typing import Optional
from fastapi import APIRouter, HTTPException, Depends, Header
from pydantic import BaseModel
from db_mongo import col_questions, col_comments, col_ai_usage, col_users, col_fcm_tokens, col_community_schedule, col_user_answers, sid, oid, now
from deps import current_user
from utils.ai import generate_questions, generate_answer, ai_text_action, check_answer
from utils.firebase import send_to_all, send_to_tokens

router = APIRouter()

IST = timezone(timedelta(hours=5, minutes=30))

DEFAULT_COMMUNITY_SCHEDULE = {
    0: "vikash.jangid.eps@gmail.com",
    1: "bhavya_joshi@eplanetsoft.com",
    2: "rishabh_swami@eplanetsoft.com",
    3: "badal_varshney@eplanetsoft.com",
    4: "priyanka_kumawat@eplanetsoft.com",
    5: None,
    6: None,
}

def _is_even_saturday(dt: datetime) -> bool:
    if dt.weekday() != 5:
        return False
    return ((dt.day - 1) // 7 + 1) in (2, 4)

async def _load_community_schedule() -> dict:
    docs = await col_community_schedule().find({}).to_list(10)
    if not docs:
        return DEFAULT_COMMUNITY_SCHEDULE
    schedule = dict(DEFAULT_COMMUNITY_SCHEDULE)
    for doc in docs:
        wd = doc.get("weekday")
        if wd is not None:
            schedule[int(wd)] = doc.get("email") or None
    return schedule

async def get_community_allowed_email() -> Optional[str]:
    now_ist = datetime.now(IST)
    wd = now_ist.weekday()
    if wd == 6:
        return None
    if wd == 5:
        return "ADMIN_ONLY" if not _is_even_saturday(now_ist) else None
    schedule = await _load_community_schedule()
    return schedule.get(wd)

DAY_NAMES = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

@router.get("/community-today")
async def community_today(user=Depends(current_user)):
    """Returns who is allowed to post today + which day the current user is scheduled."""
    allowed_email = await get_community_allowed_email()
    schedule = await _load_community_schedule()

    # Find current user's scheduled day
    user_email = user.get("email", "")
    my_day = None
    for wd, email in schedule.items():
        if email and email.lower() == user_email.lower():
            my_day = DAY_NAMES[wd]
            break

    if allowed_email is None:
        return {"allowed": False, "allowedEmail": None, "allowedName": None, "myDay": my_day}
    if allowed_email == "ADMIN_ONLY":
        return {"allowed": True, "allowedEmail": None, "allowedName": "Admin", "adminOnly": True, "myDay": my_day}
    user_doc = await col_users().find_one({"email": allowed_email})
    return {
        "allowed": True,
        "allowedEmail": allowed_email,
        "allowedName": user_doc.get("name") if user_doc else allowed_email,
        "adminOnly": False,
        "myDay": my_day,
    }

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
    # Count AI-generated questions today (col_ai_usage tracks every generation)
    ai_used = await _get_ai_usage(uid)
    # Also count manually posted questions today (in case user wrote their own)
    today_start = datetime.combine(date.today(), datetime.min.time()).replace(tzinfo=timezone.utc)
    posted = await col_questions().count_documents({"userId": uid, "createdAt": {"$gte": today_start}})
    used  = ai_used + posted
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
    category: str  # single category, comma-separated list, or empty string for random
    level:    str
    type:     str = "Technical"
    count:    int


def resolve_category(raw: str) -> str:
    """Accept single, comma-separated, or empty — returns one valid category."""
    import random as _r
    parts = [p.strip() for p in raw.split(",") if p.strip()]
    valid = [p for p in parts if p in CATEGORIES]
    if not valid:
        if parts:  # non-empty but nothing valid
            raise HTTPException(400, "Invalid category")
        return _r.choice(CATEGORIES)   # empty = pick random
    return _r.choice(valid)


@router.post("/generate")
async def gen_questions(body: GenBody, user=Depends(current_user)):
    category = resolve_category(body.category)
    if body.level not in LEVELS: raise HTTPException(400, "Invalid level")
    if body.type  not in TYPES:  raise HTTPException(400, "Invalid type")
    if body.count not in [1,3,5,10]: raise HTTPException(400, "count must be 1, 3, 5, or 10")
    # Fetch recent existing questions for this category+level to avoid duplicates
    existing_docs = await col_questions().find(
        {"category": category, "level": body.level},
        {"question": 1}
    ).sort("createdAt", -1).limit(30).to_list(30)
    existing_titles = [d["question"][:80] for d in existing_docs]
    result = await generate_questions(category, body.level, body.type, body.count, existing_titles)
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
    category = resolve_category(body.category)
    if body.level not in LEVELS: raise HTTPException(400, "Invalid level")
    if body.type  not in TYPES:  raise HTTPException(400, "Invalid type")
    result = await generate_answer(body.question.strip(), category, body.level, body.type)
    return result


# ── Community feed ────────────────────────────────────────────────────────────

@router.get("/community")
async def community(
    category:  Optional[str] = None,
    level:     Optional[str] = None,
    type:      Optional[str] = None,
    tag:       Optional[str] = None,
    search:    Optional[str] = None,
    page:      int = 1,
    page_size: int = 15,
    x_user_id: Optional[str] = Header(default=None),
):
    page      = max(1, page)
    page_size = max(1, min(page_size, 50))
    skip      = (page - 1) * page_size

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
    total  = await col_questions().count_documents(filt)
    cursor = col_questions().find(filt).sort("createdAt", -1).skip(skip).limit(page_size)
    docs   = await cursor.to_list(length=page_size)
    return {
        "items":    [_ser(d, x_user_id) for d in docs],
        "total":    total,
        "page":     page,
        "pages":    (total + page_size - 1) // page_size,
        "has_more": page * page_size < total,
    }


# ── My saved answers (all) — must be before /{qid} routes ───────────────────

class SaveAnswerBody(BaseModel):
    answer: str

@router.get("/my-answers/all")
async def get_all_my_answers(user=Depends(current_user)):
    pipeline = [
        {"$match": {"userId": user["id"]}},
        {"$sort": {"savedAt": -1}},
        {"$group": {
            "_id": "$questionId",
            "latestAnswer": {"$first": "$answer"},
            "savedAt": {"$first": "$savedAt"},
            "count": {"$sum": 1},
        }},
    ]
    groups = [d async for d in col_user_answers().aggregate(pipeline)]
    result = []
    for g in groups:
        qid = g["_id"]
        try:
            qdoc = await col_questions().find_one({"_id": oid(qid)})
        except Exception:
            continue
        if not qdoc:
            continue
        result.append({
            "questionId": qid,
            "question": qdoc.get("question", ""),
            "category": qdoc.get("category", ""),
            "level": qdoc.get("level", ""),
            "latestAnswer": g["latestAnswer"],
            "savedAt": g["savedAt"].isoformat() + "Z",
            "count": g["count"],
        })
    return result


# ── My questions ──────────────────────────────────────────────────────────────

@router.get("/mine")
async def mine(user=Depends(current_user)):
    cursor = col_questions().find({"userId": user["id"]}).sort("createdAt", -1)
    docs   = await cursor.to_list(length=500)
    return [_ser(d, user["id"]) for d in docs]


@router.get("/mine/drafts")
async def mine_drafts(user=Depends(current_user)):
    cursor = col_questions().find({"userId": user["id"], "status": "draft"}).sort("createdAt", -1)
    docs   = await cursor.to_list(length=200)
    return [_ser(d, user["id"]) for d in docs]


@router.patch("/{qid}/publish")
async def publish_draft(qid: str, user=Depends(current_user)):
    doc = await col_questions().find_one({"_id": oid(qid)})
    if not doc: raise HTTPException(404, "Not found")
    if doc["userId"] != user["id"]:
        raise HTTPException(403, "Not allowed")
    # Enforce community posting schedule
    if user.get("role") not in ("admin", "sub_admin"):
        allowed_email = await get_community_allowed_email()
        user_email = user.get("email", "")
        if allowed_email is None:
            raise HTTPException(403, "Community is closed today — no posts scheduled.")
        if allowed_email != "ADMIN_ONLY" and allowed_email.lower() != user_email.lower():
            raise HTTPException(403, f"Today is not your posting day.")
    await col_questions().update_one({"_id": oid(qid)}, {"$set": {"status": "published"}})
    updated = await col_questions().find_one({"_id": oid(qid)})
    return _ser(updated, user["id"])


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


@router.post("", include_in_schema=True)
@router.post("/")
async def create(body: CreateBody, user=Depends(current_user)):
    body.category = resolve_category(body.category)
    if body.level not in LEVELS: raise HTTPException(400, "Invalid level")
    if body.type  not in TYPES:  raise HTTPException(400, "Invalid type")
    if not body.question or not body.answer: raise HTTPException(400, "question and answer required")

    # Enforce community posting schedule (admins bypass)
    if user.get("role") not in ("admin", "sub_admin"):
        allowed_email = await get_community_allowed_email()
        user_email = user.get("email", "")
        if allowed_email is None:
            raise HTTPException(403, "Community is closed today.")
        if allowed_email == "ADMIN_ONLY":
            raise HTTPException(403, "Only admin can post to community today.")
        if user_email != allowed_email:
            # Find who is allowed today
            u_doc = await col_users().find_one({"email": allowed_email})
            allowed_name = u_doc.get("name", allowed_email) if u_doc else allowed_email
            raise HTTPException(403, f"Today is {allowed_name}'s day to post. Check back on your scheduled day.")

    # Enforce per-user daily post limit
    uid = user["id"]
    today_start = datetime.combine(date.today(), datetime.min.time()).replace(tzinfo=timezone.utc)
    today_count = await col_questions().count_documents({"userId": uid, "createdAt": {"$gte": today_start}})
    daily_limit = user.get("dailyLimit", 25)
    if today_count >= daily_limit:
        # Notify admins that user hit their limit
        admins = await col_users().find({"role": {"$in": ["admin", "sub_admin"]}}).to_list(20)
        for admin_doc in admins:
            toks = await col_fcm_tokens().find({"userId": str(admin_doc["_id"])}).to_list(10)
            tokens = [t["token"] for t in toks]
            if tokens:
                await send_to_tokens(tokens,
                    title="⚠️ User Hit Daily Limit",
                    body=f"{user.get('name')} has reached their {daily_limit}/day limit. Tap to increase.",
                    data={"type": "limit_exceeded", "path": "/admin"},
                )
        raise HTTPException(429, f"Daily limit reached ({daily_limit}/day). Admin has been notified to increase your limit.")

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
        await send_to_tokens(tokens, f"New question by {user['name']}", short_q, {
            "questionId": str(result.inserted_id),
            "type": "community_post",
            "path": "/community",
        })

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
    is_admin = user.get("role") in ("admin", "sub_admin")
    if doc["userId"] != user["id"] and not is_admin:
        raise HTTPException(403, "Not allowed")
    owner_uid = doc.get("userId")
    await col_questions().delete_one({"_id": oid(qid)})
    await col_comments().delete_many({"questionId": qid})
    # Notify question owner if deleted by admin
    if is_admin and owner_uid and owner_uid != user["id"]:
        toks = await col_fcm_tokens().find({"userId": owner_uid}).to_list(10)
        tokens = [t["token"] for t in toks]
        if tokens:
            q_preview = doc.get("question", "")[:60]
            await send_to_tokens(tokens,
                title="🗑️ Your question was removed",
                body=f'"{q_preview}…" was removed by an admin.',
                data={"type": "question_deleted", "path": "/my-questions"},
            )
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
    if category:
        cats = [c.strip() for c in category.split(",") if c.strip()]
        if len(cats) > 1:
            filt["category"] = {"$in": cats}
        elif cats:
            filt["category"] = cats[0]
    if level:    filt["level"] = level
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


# ── User saved answers (per question) ─────────────────────────────────────────

@router.post("/{qid}/my-answer")
async def save_my_answer(qid: str, body: SaveAnswerBody, user=Depends(current_user)):
    if not body.answer.strip():
        raise HTTPException(400, "Answer cannot be empty")
    doc = await col_user_answers().insert_one({
        "questionId": qid,
        "userId": user["id"],
        "answer": body.answer.strip(),
        "savedAt": now(),
    })
    return {"id": str(doc.inserted_id), "savedAt": now().isoformat() + "Z"}

@router.get("/{qid}/my-answer")
async def get_my_answers_for_q(qid: str, user=Depends(current_user)):
    docs = await col_user_answers().find(
        {"questionId": qid, "userId": user["id"]}
    ).sort("savedAt", -1).to_list(20)
    return [{"id": str(d["_id"]), "answer": d["answer"], "savedAt": d["savedAt"].isoformat() + "Z"} for d in docs]

@router.delete("/{qid}/my-answer/{aid}")
async def delete_my_answer(qid: str, aid: str, user=Depends(current_user)):
    await col_user_answers().delete_one({"_id": oid(aid), "userId": user["id"]})
    return {"ok": True}


# ── Admin auto-post helpers ────────────────────────────────────────────────────

@router.get("/admin/random-suggestions")
async def random_suggestions(category: str = "", type: str = "", level: str = "", user=Depends(current_user)):
    if user.get("role") not in ("admin", "sub_admin"):
        raise HTTPException(403, "Admins only")
    filt: dict = {}
    if category: filt["category"] = category
    if type:     filt["type"]     = type
    if level:    filt["level"]    = level
    pipeline = [{"$match": filt}, {"$sample": {"size": 5}}]
    docs = [d async for d in col_questions().aggregate(pipeline)]
    return [_ser(d) for d in docs]

class AutoPostBody(BaseModel):
    question_id: str
    on_behalf_of_user_id: str  # userId to post as

@router.post("/admin/auto-post")
async def admin_auto_post(body: AutoPostBody, admin=Depends(current_user)):
    if admin.get("role") not in ("admin", "sub_admin"):
        raise HTTPException(403, "Admins only")
    q_doc = await col_questions().find_one({"_id": oid(body.question_id)})
    if not q_doc:
        raise HTTPException(404, "Question not found")
    behalf_user = await col_users().find_one({"_id": oid(body.on_behalf_of_user_id)})
    if not behalf_user:
        raise HTTPException(404, "User not found")

    uid = str(behalf_user["_id"])
    author_name = behalf_user.get("name", "Unknown")
    display_name = f"Admin (on behalf of {author_name})"

    new_doc = {
        "userId":       uid,
        "authorName":   display_name,
        "category":     q_doc.get("category"),
        "level":        q_doc.get("level"),
        "type":         q_doc.get("type", "Technical"),
        "question":     q_doc.get("question"),
        "answer":       q_doc.get("answer"),
        "hints":        q_doc.get("hints", []),
        "tags":         q_doc.get("tags", []),
        "status":       "published",
        "createdAt":    now(),
        "upvotes":      [],
        "bookmarks":    [],
        "highlights":   [],
        "commentCount": 0,
    }
    result = await col_questions().insert_one(new_doc)

    # Notify all users
    rows = await col_fcm_tokens().find({}).to_list(1000)
    tokens = [r["token"] for r in rows]
    short_q = q_doc.get("question", "")[:80]
    await send_to_tokens(tokens, f"New question by {display_name}", short_q,
                         {"type": "community_post", "path": "/community"})
    return {"id": str(result.inserted_id), "message": "Posted successfully"}
