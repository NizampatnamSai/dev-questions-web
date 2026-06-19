from datetime import datetime
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from db_mongo import col_comments, col_questions, col_fcm_tokens, sid, oid, now
from deps import current_user
from utils.firebase import send_to_tokens

router = APIRouter()


def _ser(doc: dict) -> dict:
    return {
        "id":         str(doc["_id"]),
        "qid":        doc.get("questionId"),
        "userId":     doc.get("userId"),
        "authorName": doc.get("authorName", "Unknown"),
        "text":       doc.get("text"),
        "createdAt":  doc["createdAt"].isoformat() if isinstance(doc.get("createdAt"), datetime) else str(doc.get("createdAt", "")),
        "author": {"id": doc.get("userId"), "name": doc.get("authorName", "Unknown")},
    }


@router.get("/{qid}/comments")
async def list_comments(qid: str, user=Depends(current_user)):
    cursor = col_comments().find({"questionId": qid}).sort("createdAt", 1)
    docs   = await cursor.to_list(length=500)
    return [_ser(d) for d in docs]


class CommentBody(BaseModel):
    text: str


@router.post("/{qid}/comments")
async def add_comment(qid: str, body: CommentBody, user=Depends(current_user)):
    text = body.text.strip()
    if not text:
        raise HTTPException(400, "Comment cannot be empty")
    if len(text) > 1000:
        raise HTTPException(400, "Comment too long (max 1000 chars)")

    q = await col_questions().find_one({"_id": oid(qid)})
    if not q:
        raise HTTPException(404, "Question not found")

    doc = {
        "questionId": qid,
        "userId":     user["id"],
        "authorName": user.get("name", "Unknown"),
        "text":       text,
        "createdAt":  now(),
    }
    result  = await col_comments().insert_one(doc)
    await col_questions().update_one({"_id": oid(qid)}, {"$inc": {"commentCount": 1}})
    created = await col_comments().find_one({"_id": result.inserted_id})

    try:
        rows   = await col_fcm_tokens().find({}).to_list(length=1000)
        tokens = [r["token"] for r in rows]
        short_q = q.get("question", "")[:60] + ("…" if len(q.get("question", "")) > 60 else "")
        short_c = text[:80]
        await send_to_tokens(
            tokens,
            f"💬 {user['name']} commented",
            f'On "{short_q}": {short_c}',
            {"questionId": qid},
        )
    except Exception:
        pass

    return _ser(created)


@router.delete("/comments/{cid}")
async def delete_comment(cid: str, user=Depends(current_user)):
    doc = await col_comments().find_one({"_id": oid(cid)})
    if not doc:
        raise HTTPException(404, "Comment not found")
    if doc["userId"] != user["id"] and user.get("role") != "admin":
        raise HTTPException(403, "Not allowed")
    qid = doc.get("questionId")
    await col_comments().delete_one({"_id": oid(cid)})
    if qid:
        await col_questions().update_one({"_id": oid(qid)}, {"$inc": {"commentCount": -1}})
    return {"message": "Deleted"}
