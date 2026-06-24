import csv
import io
import json
from datetime import datetime, timezone, timedelta
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, WebSocket, WebSocketDisconnect
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from db_mongo import col_workboard_members, col_workboard_posts, col_users, col_fcm_tokens, sid, oid, now
from deps import current_user
from utils.firebase import send_to_tokens

router = APIRouter()

IST = timezone(timedelta(hours=5, minutes=30))


def ist_today() -> str:
    return datetime.now(IST).strftime("%Y-%m-%d")


# ── WebSocket connection manager ──────────────────────────────────────────────

class ConnectionManager:
    def __init__(self):
        self.active: dict = {}  # {ws: user_info}

    async def connect(self, ws: WebSocket, user_info: dict):
        await ws.accept()
        self.active[ws] = user_info

    def disconnect(self, ws: WebSocket):
        self.active.pop(ws, None)

    async def broadcast(self, data: dict):
        dead = []
        for ws in list(self.active.keys()):
            try:
                await ws.send_json(data)
            except Exception:
                dead.append(ws)
        for ws in dead:
            self.disconnect(ws)

    def get_active_users(self):
        """Returns list of active users, deduped by userId"""
        users_map = {}
        for user_info in self.active.values():
            uid = user_info.get("id")
            if uid and uid not in users_map:
                users_map[uid] = {
                    "id": uid,
                    "name": user_info.get("name", "Unknown"),
                }
        return list(users_map.values())


manager = ConnectionManager()


async def _broadcast_online_count():
    users = manager.get_active_users()
    await manager.broadcast({"type": "online_count", "count": len(users), "users": users})


@router.websocket("/ws")
async def workboard_ws(ws: WebSocket, user_id: str = None, user_name: str = None):
    user_info = {"id": user_id or "anonymous", "name": user_name or "Guest"}
    await manager.connect(ws, user_info)
    # Tell everyone (including new joiner) the updated count
    await _broadcast_online_count()
    try:
        while True:
            await ws.receive_text()  # keep alive
    except WebSocketDisconnect:
        manager.disconnect(ws)
        # Tell remaining users the count dropped
        await _broadcast_online_count()


# ── Member endpoints ──────────────────────────────────────────────────────────

def _is_admin(user) -> bool:
    return user.get("role") in ("admin", "sub_admin")


@router.get("/status")
async def my_status(user=Depends(current_user)):
    if _is_admin(user):
        return {"status": "active"}
    member = await col_workboard_members().find_one({"userId": user["id"]})
    if not member:
        return {"status": "none"}
    return {"status": member.get("status", "pending")}


@router.get("/active-users")
async def get_active_users(user=Depends(current_user)):
    """Returns list of currently active users viewing the workboard"""
    return manager.get_active_users()


@router.post("/join")
async def request_join(user=Depends(current_user)):
    existing = await col_workboard_members().find_one({"userId": user["id"]})
    if existing:
        raise HTTPException(400, f"Already {existing.get('status', 'pending')}")
    await col_workboard_members().insert_one({
        "userId":    user["id"],
        "userName":  user.get("name", ""),
        "userEmail": user.get("email", ""),
        "status":    "pending",
        "joinedAt":  now(),
    })
    # Notify admins
    admins = await col_users().find({"role": {"$in": ["admin", "sub_admin"]}}).to_list(20)
    for admin in admins:
        tokens_docs = await col_fcm_tokens().find({"userId": str(admin["_id"])}).to_list(10)
        tokens = [t["token"] for t in tokens_docs]
        if tokens:
            await send_to_tokens(tokens,
                title="👥 Work Board Join Request",
                body=f"{user.get('name')} wants to join the Daily Work Board.",
                data={"type": "workboard_join", "path": "/admin"},
            )
    return {"message": "Join request sent. Awaiting admin approval."}


@router.get("/pending-members")
async def pending_members(user=Depends(current_user)):
    if user.get("role") not in ("admin", "sub_admin"):
        raise HTTPException(403, "Admin only")
    docs = await col_workboard_members().find({"status": "pending"}).to_list(100)
    return [sid(d) for d in docs]


@router.patch("/members/{uid}/approve")
async def approve_member(uid: str, user=Depends(current_user)):
    if user.get("role") not in ("admin", "sub_admin"):
        raise HTTPException(403, "Admin only")
    await col_workboard_members().update_one({"userId": uid}, {"$set": {"status": "active"}})
    tokens_docs = await col_fcm_tokens().find({"userId": uid}).to_list(10)
    tokens = [t["token"] for t in tokens_docs]
    if tokens:
        await send_to_tokens(tokens,
            title="✅ Work Board Access Granted",
            body="You've been approved to join the Daily Work Board!",
            data={"type": "workboard_approved", "path": "/workboard"},
        )
    return {"message": "Approved"}


@router.patch("/members/{uid}/reject")
async def reject_member(uid: str, user=Depends(current_user)):
    if user.get("role") not in ("admin", "sub_admin"):
        raise HTTPException(403, "Admin only")
    await col_workboard_members().delete_one({"userId": uid})
    return {"message": "Rejected"}


@router.get("/members")
async def list_members(user=Depends(current_user)):
    if not _is_admin(user):
        member = await col_workboard_members().find_one({"userId": user["id"]})
        if not member or member.get("status") != "active":
            raise HTTPException(403, "Members only")
    docs = await col_workboard_members().find({"status": "active"}).to_list(200)
    return [{"userId": d["userId"], "userName": d["userName"]} for d in docs]


# ── Posts endpoints ───────────────────────────────────────────────────────────

async def _get_wb_config() -> dict:
    from db_mongo import col_app_config
    doc = await col_app_config().find_one({"_id": "config"}) or {}
    return {
        "edit_window_minutes": int(doc.get("wb_edit_window_minutes", 30)),
        "reminder_time": doc.get("wb_reminder_time", "09:30"),
    }


def _can_edit(post: dict, window_minutes: int = 30) -> bool:
    posted_at = post.get("postedAt")
    if not posted_at:
        return False
    if posted_at.tzinfo is None:
        posted_at = posted_at.replace(tzinfo=timezone.utc)
    return (datetime.now(timezone.utc) - posted_at).total_seconds() < (window_minutes * 60)


@router.get("/posts")
async def today_posts(user=Depends(current_user), date: Optional[str] = Query(None)):
    if not _is_admin(user):
        member = await col_workboard_members().find_one({"userId": user["id"]})
        if not member or member.get("status") != "active":
            raise HTTPException(403, "Members only")
    # If date provided, fetch that date. Otherwise fetch today's posts
    target_date = date or ist_today()
    wb_cfg = await _get_wb_config()
    docs = await col_workboard_posts().find({"date": target_date}).sort("postedAt", 1).to_list(200)
    result = []
    for d in docs:
        d["id"] = str(d.pop("_id"))
        can_edit = d["userId"] == user["id"] and _can_edit(d, wb_cfg["edit_window_minutes"])
        d["postedAt"] = d["postedAt"].strftime("%Y-%m-%dT%H:%M:%S.%f") + "Z" if isinstance(d.get("postedAt"), datetime) else d.get("postedAt")
        d["canEdit"] = can_edit
        result.append(d)
    return result


@router.get("/config")
async def get_wb_config():
    """Public: returns workboard settings for display"""
    return await _get_wb_config()


class PostBody(BaseModel):
    message: str


@router.post("/posts")
async def create_post(body: PostBody, user=Depends(current_user)):
    if not _is_admin(user):
        member = await col_workboard_members().find_one({"userId": user["id"]})
        if not member or member.get("status") != "active":
            raise HTTPException(403, "Members only")
    if not body.message.strip():
        raise HTTPException(400, "Message cannot be empty")
    today = ist_today()
    existing = await col_workboard_posts().find_one({"userId": user["id"], "date": today})
    if existing:
        raise HTTPException(400, "You've already posted today")
    posted_at = now()
    result = await col_workboard_posts().insert_one({
        "userId":   user["id"],
        "userName": user.get("name", ""),
        "message":  body.message.strip(),
        "date":     today,
        "postedAt": posted_at,
    })
    post_data = {
        "id":       str(result.inserted_id),
        "userId":   user["id"],
        "userName": user.get("name", ""),
        "message":  body.message.strip(),
        "date":     today,
        "postedAt": posted_at.strftime("%Y-%m-%dT%H:%M:%S.%f") + "Z",
        "canEdit":  True,
    }
    # Broadcast via WebSocket
    await manager.broadcast({"type": "new_post", "post": post_data})
    # Push to all active members (except poster)
    members = await col_workboard_members().find({"status": "active", "userId": {"$ne": user["id"]}}).to_list(200)
    all_tokens = []
    for m in members:
        t_docs = await col_fcm_tokens().find({"userId": m["userId"]}).to_list(5)
        all_tokens += [t["token"] for t in t_docs]
    if all_tokens:
        await send_to_tokens(
            list(set(all_tokens)),
            title=f"📝 {user.get('name')} posted",
            body=body.message.strip()[:80],
            data={"type": "workboard_post", "path": "/workboard"},
        )
    return post_data


@router.put("/posts/{post_id}")
async def edit_post(post_id: str, body: PostBody, user=Depends(current_user)):
    post = await col_workboard_posts().find_one({"_id": oid(post_id)})
    if not post:
        raise HTTPException(404, "Post not found")
    if post["userId"] != user["id"]:
        raise HTTPException(403, "Not your post")
    wb_cfg = await _get_wb_config()
    if not _can_edit(post, wb_cfg["edit_window_minutes"]):
        raise HTTPException(400, f"Edit window ({wb_cfg['edit_window_minutes']} min) has expired")
    if not body.message.strip():
        raise HTTPException(400, "Message cannot be empty")
    await col_workboard_posts().update_one(
        {"_id": oid(post_id)},
        {"$set": {"message": body.message.strip(), "editedAt": now()}}
    )
    updated = {
        "id":      post_id,
        "userId":  user["id"],
        "userName": post["userName"],
        "message": body.message.strip(),
        "date":    post["date"],
        "postedAt": post["postedAt"].strftime("%Y-%m-%dT%H:%M:%S.%f") + "Z" if isinstance(post.get("postedAt"), datetime) else post.get("postedAt"),
        "canEdit": True,
    }
    await manager.broadcast({"type": "edit_post", "post": updated})
    return updated


@router.get("/dates")
async def get_available_dates(user=Depends(current_user)):
    """Get all dates with posts (for history view)"""
    if not _is_admin(user):
        member = await col_workboard_members().find_one({"userId": user["id"]})
        if not member or member.get("status") != "active":
            raise HTTPException(403, "Members only")

    # Get distinct dates, sorted newest first
    dates = await col_workboard_posts().distinct("date")
    dates.sort(reverse=True)

    # Get post count and member count per date
    result = []
    for date in dates:
        posts = await col_workboard_posts().find({"date": date}).to_list(1000)
        member_count = len(set(p["userId"] for p in posts))
        result.append({
            "date": date,
            "postCount": len(posts),
            "memberCount": member_count,
        })
    return result


@router.get("/missing-today")
async def missing_today(user=Depends(current_user)):
    if not _is_admin(user):
        member = await col_workboard_members().find_one({"userId": user["id"]})
        if not member or member.get("status") != "active":
            raise HTTPException(403, "Members only")
    today = ist_today()
    members = await col_workboard_members().find({"status": "active"}).to_list(200)
    posted_docs = await col_workboard_posts().find({"date": today}).to_list(200)
    posted_ids = {d["userId"] for d in posted_docs}
    missing = [
        {"userId": m["userId"], "userName": m["userName"]}
        for m in members if m["userId"] not in posted_ids
    ]
    return missing


@router.get("/export")
async def export_posts(
    user=Depends(current_user),
    date: Optional[str] = Query(None, description="YYYY-MM-DD for a specific day"),
    all: bool = Query(False, description="Export all posts"),
):
    if not _is_admin(user):
        raise HTTPException(403, "Admin only")

    query = {}
    if not all:
        query["date"] = date or ist_today()

    docs = await col_workboard_posts().find(query).sort([("date", 1), ("postedAt", 1)]).to_list(5000)

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["Date", "Name", "Message", "Posted At", "Edited"])
    for d in docs:
        posted_at = d.get("postedAt")
        if isinstance(posted_at, datetime):
            posted_at = posted_at.astimezone(IST).strftime("%Y-%m-%d %H:%M IST")
        edited = "Yes" if d.get("editedAt") else "No"
        writer.writerow([d.get("date", ""), d.get("userName", ""), d.get("message", ""), posted_at, edited])

    output.seek(0)
    filename = f"workboard_{date or ('all' if all else ist_today())}.csv"
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )
