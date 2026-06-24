from datetime import datetime
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from db_mongo import col_feedback, col_users, col_fcm_tokens, col_user_notifications, sid, oid, now
from deps import current_user
from utils.firebase import send_to_tokens

router = APIRouter()


class FeedbackBody(BaseModel):
    type: str  # "bug", "feature", "improvement", "other"
    title: str
    message: str
    email: str = ""
    rating: int = 5  # 1-5


@router.post("")
async def submit_feedback(body: FeedbackBody, user=Depends(current_user)):
    """Submit feedback from a user"""
    doc = {
        "userId": user["id"],
        "userName": user.get("name", "Anonymous"),
        "userEmail": user.get("email", ""),
        "type": body.type,
        "title": body.title,
        "message": body.message,
        "rating": max(1, min(5, body.rating)),
        "createdAt": now(),
        "read": False,
    }
    result = await col_feedback().insert_one(doc)

    # Notify all admins — in-app notification + FCM push
    type_emoji = {"bug": "🐛", "feature": "✨", "improvement": "⚡", "other": "💬"}.get(body.type, "💬")
    admins = await col_users().find({"role": {"$in": ["admin", "sub_admin"]}}).to_list(20)
    for admin in admins:
        admin_id = str(admin["_id"])
        # In-app notification
        await col_user_notifications().insert_one({
            "userId": admin_id,
            "title": f"{type_emoji} New Feedback: {body.title}",
            "body": f"{user.get('name')} submitted {body.type} feedback",
            "type": "feedback",
            "path": "/admin/feedback",
            "read": False,
            "createdAt": now(),
        })
        # FCM push
        token_docs = await col_fcm_tokens().find({"userId": admin_id}).to_list(10)
        tokens = [t["token"] for t in token_docs]
        if tokens:
            await send_to_tokens(
                tokens,
                title=f"{type_emoji} New Feedback from {user.get('name')}",
                body=f"{body.title}: {body.message[:80]}",
                data={"type": "feedback", "path": "/admin/feedback"},
            )

    return {"id": str(result.inserted_id), "message": "Thank you for your feedback!"}


@router.get("/my")
async def my_feedback(user=Depends(current_user)):
    """Get feedback submitted by current user"""
    docs = await col_feedback().find({"userId": user["id"]}).sort("createdAt", -1).to_list(50)
    return [sid(d) for d in docs]


@router.get("/admin/all")
async def admin_get_all_feedback(user=Depends(current_user)):
    """Get all feedback (admin only)"""
    if user.get("role") not in ("admin", "sub_admin"):
        from fastapi import HTTPException
        raise HTTPException(403, "Admin only")
    docs = await col_feedback().find({}).sort("createdAt", -1).to_list(500)
    return [sid(d) for d in docs]


@router.patch("/admin/{feedback_id}/read")
async def mark_feedback_read(feedback_id: str, user=Depends(current_user)):
    """Mark feedback as read (admin only)"""
    if user.get("role") not in ("admin", "sub_admin"):
        from fastapi import HTTPException
        raise HTTPException(403, "Admin only")
    await col_feedback().update_one({"_id": oid(feedback_id)}, {"$set": {"read": True}})
    return {"message": "Marked as read"}


@router.delete("/admin/{feedback_id}")
async def delete_feedback(feedback_id: str, user=Depends(current_user)):
    """Delete feedback (admin only)"""
    if user.get("role") not in ("admin", "sub_admin"):
        from fastapi import HTTPException
        raise HTTPException(403, "Admin only")
    await col_feedback().delete_one({"_id": oid(feedback_id)})
    return {"message": "Deleted"}


class ReplyBody(BaseModel):
    message: str


@router.post("/admin/{feedback_id}/reply")
async def reply_to_feedback(feedback_id: str, body: ReplyBody, user=Depends(current_user)):
    """Send reply to user who submitted feedback"""
    from fastapi import HTTPException
    if user.get("role") not in ("admin", "sub_admin"):
        raise HTTPException(403, "Admin only")
    if not body.message.strip():
        raise HTTPException(400, "Reply cannot be empty")

    fb = await col_feedback().find_one({"_id": oid(feedback_id)})
    if not fb:
        raise HTTPException(404, "Feedback not found")

    target_user_id = fb.get("userId")
    admin_name = user.get("name", "Admin")

    # Save reply on feedback doc
    await col_feedback().update_one(
        {"_id": oid(feedback_id)},
        {"$set": {
            "reply": body.message.strip(),
            "replyBy": admin_name,
            "repliedAt": now(),
            "read": True,
        }}
    )

    # In-app notification to the user
    await col_user_notifications().insert_one({
        "userId": target_user_id,
        "title": f"💬 Reply to your feedback: {fb.get('title', '')}",
        "body": body.message.strip()[:120],
        "type": "feedback_reply",
        "path": "/my-feedback",
        "read": False,
        "createdAt": now(),
    })

    # FCM push to user
    token_docs = await col_fcm_tokens().find({"userId": target_user_id}).to_list(10)
    tokens = [t["token"] for t in token_docs]
    if tokens:
        await send_to_tokens(
            tokens,
            title=f"💬 {admin_name} replied to your feedback",
            body=body.message.strip()[:100],
            data={"type": "feedback_reply", "path": "/my-feedback"},
        )

    return {"message": "Reply sent"}
