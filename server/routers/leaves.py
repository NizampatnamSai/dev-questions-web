"""User-submitted leave/holiday days. A user marks themselves out for a date
range; WorkBoard reminders skip them on those days, and if it's their
scheduled Community-posting day, admins get notified to cover for them
instead (scheduler_tasks.py's fire_community_reminder + fire_workboard_*
read this via utils/leaves.is_user_on_leave)."""
from datetime import date, datetime
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from db_mongo import col_user_leaves, col_users, col_fcm_tokens, col_user_notifications, sid, oid, now, notifications_enabled
from deps import current_user
from utils.firebase import send_to_tokens

router = APIRouter()

MAX_LEAVE_DAYS = 30  # sanity cap on a single leave request


def _parse_date(s: str) -> date:
    try:
        return datetime.strptime(s, "%Y-%m-%d").date()
    except ValueError:
        raise HTTPException(400, "Dates must be in YYYY-MM-DD format")


class LeaveBody(BaseModel):
    startDate: str
    endDate: str
    reason: str = ""


@router.post("")
async def submit_leave(body: LeaveBody, user=Depends(current_user)):
    start = _parse_date(body.startDate)
    end = _parse_date(body.endDate)
    if end < start:
        raise HTTPException(400, "End date must be on or after the start date")
    if (end - start).days + 1 > MAX_LEAVE_DAYS:
        raise HTTPException(400, f"A single leave request can't span more than {MAX_LEAVE_DAYS} days")

    doc = {
        "userId": user["id"],
        "userName": user.get("name", "Someone"),
        "startDate": body.startDate,
        "endDate": body.endDate,
        "reason": body.reason.strip()[:300],
        "createdAt": now(),
    }
    result = await col_user_leaves().insert_one(doc)

    # Notify admins so they know to expect the gap (WorkBoard/Community-wise).
    date_range = body.startDate if body.startDate == body.endDate else f"{body.startDate} to {body.endDate}"
    title = f"🏖️ {doc['userName']} will be on leave"
    body_text = f"{date_range}" + (f" — {doc['reason']}" if doc["reason"] else "")
    if await notifications_enabled():
        admins = await col_users().find({"role": {"$in": ["admin", "sub_admin"]}}).to_list(20)
        admin_ids = [str(a["_id"]) for a in admins]
        if admin_ids:
            token_docs = await col_fcm_tokens().find({"userId": {"$in": admin_ids}}).to_list(200)
            tokens = [t["token"] for t in token_docs]
            if tokens:
                await send_to_tokens(tokens, title=title, body=body_text, data={"type": "leave_submitted", "path": "/profile"})
            for admin_id in admin_ids:
                await col_user_notifications().insert_one({
                    "userId": admin_id, "title": title, "body": body_text,
                    "type": "leave_submitted", "path": "/profile", "read": False, "createdAt": now(),
                })

    created = await col_user_leaves().find_one({"_id": result.inserted_id})
    return sid(created)


@router.get("/my")
async def my_leaves(user=Depends(current_user)):
    docs = await col_user_leaves().find({"userId": user["id"]}).sort("startDate", -1).to_list(200)
    return [sid(d) for d in docs]


@router.delete("/{leave_id}")
async def cancel_leave(leave_id: str, user=Depends(current_user)):
    doc = await col_user_leaves().find_one({"_id": oid(leave_id)})
    if not doc:
        raise HTTPException(404, "Leave not found")
    if doc["userId"] != user["id"] and user.get("role") not in ("admin", "sub_admin"):
        raise HTTPException(403, "Not your leave request")
    await col_user_leaves().delete_one({"_id": oid(leave_id)})
    return {"message": "Cancelled"}


@router.get("/admin/upcoming")
async def upcoming_leaves(user=Depends(current_user)):
    """Admin-only — leaves that are active today or still in the future, for
    a quick 'who's out' glance."""
    if user.get("role") not in ("admin", "sub_admin"):
        raise HTTPException(403, "Admin only")
    today_str = date.today().isoformat()
    docs = await col_user_leaves().find({"endDate": {"$gte": today_str}}).sort("startDate", 1).to_list(200)
    return [sid(d) for d in docs]
