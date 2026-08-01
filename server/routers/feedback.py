import re
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from db_mongo import col_feedback, col_users, col_fcm_tokens, col_user_notifications, col_app_config, sid, oid, now, notifications_enabled
from deps import current_user, optional_user
from utils.firebase import send_to_tokens

router = APIRouter()


def _strip_html(html: str) -> str:
    """Plain-text preview of rich-text (Quill HTML) content, for push notification bodies."""
    return re.sub(r"<[^>]*>", " ", html or "").strip()


async def _guest_feedback_enabled() -> bool:
    doc = await col_app_config().find_one({"_id": "config"})
    return (doc or {}).get("guest_feedback_enabled", False)


MAX_IMAGES = 4


class FeedbackBody(BaseModel):
    type: str  # "bug", "feature", "improvement", "other"
    title: str
    message: str
    email: str = ""
    rating: int = 5  # 1-5
    guestName: str = ""  # only used when submitting without an account
    # Cloudinary URLs from POST /api/uploads/image — a screenshot says more about
    # a bug than a paragraph does. Only URLs are stored, never image bytes, so
    # feedback documents stay small.
    images: list[str] = []


@router.post("")
async def submit_feedback(body: FeedbackBody, user=Depends(optional_user)):
    """Submit feedback — from a logged-in user, or a guest if the admin has
    guest feedback enabled (App Config)."""
    is_guest = user is None
    if is_guest and not await _guest_feedback_enabled():
        raise HTTPException(403, "Guest feedback isn't enabled right now — please log in to submit feedback.")

    guest_name = body.guestName.strip()[:60] or "Guest"
    doc = {
        "userId": user["id"] if user else None,
        "userName": user.get("name", "Anonymous") if user else guest_name,
        "userEmail": user.get("email", "") if user else body.email.strip(),
        "isGuest": is_guest,
        "type": body.type,
        "title": body.title,
        "message": body.message,
        "rating": max(1, min(5, body.rating)),
        # Only our own Cloudinary URLs — the field is client-supplied, so an
        # arbitrary URL here would otherwise render in the admin's browser.
        "images": [u for u in body.images if isinstance(u, str) and u.startswith("https://res.cloudinary.com/")][:MAX_IMAGES],
        "createdAt": now(),
        "read": False,
        "status": "pending",
    }
    result = await col_feedback().insert_one(doc)

    # Notify all admins — in-app notification + FCM push
    type_emoji = {"bug": "🐛", "feature": "✨", "improvement": "⚡", "other": "💬"}.get(body.type, "💬")
    submitter_name = doc["userName"]
    admins = await col_users().find({"role": {"$in": ["admin", "sub_admin"]}}).to_list(20) if await notifications_enabled() else []
    for admin in admins:
        admin_id = str(admin["_id"])
        # In-app notification
        await col_user_notifications().insert_one({
            "userId": admin_id,
            "title": f"{type_emoji} New Feedback: {body.title}",
            "body": f"{submitter_name}{' (guest)' if is_guest else ''} submitted {body.type} feedback",
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
                title=f"{type_emoji} New Feedback from {submitter_name}",
                body=f"{body.title}: {_strip_html(body.message)[:80]}",
                data={"type": "feedback", "path": "/admin/feedback"},
            )

    return {"id": str(result.inserted_id), "message": "Thank you for your feedback!"}


@router.get("/guest-enabled")
async def guest_feedback_status():
    """Public — lets the feedback form know whether to show guests the form at all."""
    return {"enabled": await _guest_feedback_enabled()}


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

    # Guest submissions have no real account to notify — nothing to do there.
    if target_user_id and await notifications_enabled():
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


@router.patch("/admin/{feedback_id}/complete")
async def complete_feedback(feedback_id: str, user=Depends(current_user)):
    """Mark feedback as completed (admin only) — notifies the submitting user,
    unless it came from a guest (no real account to notify)."""
    if user.get("role") not in ("admin", "sub_admin"):
        raise HTTPException(403, "Admin only")

    fb = await col_feedback().find_one({"_id": oid(feedback_id)})
    if not fb:
        raise HTTPException(404, "Feedback not found")

    await col_feedback().update_one(
        {"_id": oid(feedback_id)},
        {"$set": {"status": "completed", "completedAt": now(), "completedBy": user.get("name", "Admin")}},
    )

    target_user_id = fb.get("userId")
    if target_user_id and not fb.get("isGuest") and await notifications_enabled():
        await col_user_notifications().insert_one({
            "userId": target_user_id,
            "title": f"✅ Feedback completed: {fb.get('title', '')}",
            "body": "An admin marked your feedback as completed. Thanks for helping improve Dev Life!",
            "type": "feedback_completed",
            "path": "/my-feedback",
            "read": False,
            "createdAt": now(),
        })
        token_docs = await col_fcm_tokens().find({"userId": target_user_id}).to_list(10)
        tokens = [t["token"] for t in token_docs]
        if tokens:
            await send_to_tokens(
                tokens,
                title="✅ Your feedback was completed",
                body=fb.get("title", ""),
                data={"type": "feedback_completed", "path": "/my-feedback"},
            )

    return {"message": "Marked as completed"}
