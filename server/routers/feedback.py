from datetime import datetime
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from db_mongo import col_feedback, col_users, sid, oid, now
from deps import current_user

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
