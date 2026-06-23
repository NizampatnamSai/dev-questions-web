import bcrypt
from datetime import datetime
from typing import Optional
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from db_mongo import col_users, col_fcm_tokens, col_notifications, col_notify_schedules, sid, oid, now
from deps import current_user
from utils.firebase import send_to_tokens

router = APIRouter()


def _require_admin(user=Depends(current_user)):
    if user.get("role") != "admin":
        raise HTTPException(403, "Admin only")
    return user


def _safe_user(doc: dict) -> dict:
    return {
        "id":           doc.get("id", str(doc.get("_id", ""))),
        "name":         doc.get("name"),
        "email":        doc.get("email"),
        "role":         doc.get("role", "user"),
        "dailyLimit":   doc.get("dailyLimit", 10),
        "createdAt":    doc["createdAt"].isoformat() if isinstance(doc.get("createdAt"), datetime) else str(doc.get("createdAt", "")),
        "questionCount": doc.get("questionCount", 0),
    }


# ── List all users ────────────────────────────────────────────────────────────

@router.get("/users")
async def list_users(admin=Depends(_require_admin)):
    from db_mongo import col_questions
    cursor = col_users().find({}).sort("createdAt", -1)
    docs   = await cursor.to_list(length=500)
    result = []
    for doc in docs:
        u = sid(doc)
        uid = u["id"]
        qcount = await col_questions().count_documents({"userId": uid})
        u["questionCount"] = qcount
        result.append(_safe_user(u))
    return result


# ── Create user ───────────────────────────────────────────────────────────────

class CreateUserBody(BaseModel):
    name:        str
    email:       str
    password:    str
    role:        str = "user"
    dailyLimit:  int = 10


@router.post("/users")
async def create_user(body: CreateUserBody, admin=Depends(_require_admin)):
    if body.role not in ("user", "sub_admin", "admin"):
        raise HTTPException(400, "role must be user, sub_admin, or admin")
    if body.dailyLimit < 1:
        raise HTTPException(400, "dailyLimit must be >= 1")
    email = body.email.lower().strip()
    if await col_users().find_one({"email": email}):
        raise HTTPException(409, "Email already exists")
    hashed = bcrypt.hashpw(body.password[:72].encode(), bcrypt.gensalt()).decode()
    result = await col_users().insert_one({
        "name":       body.name.strip(),
        "email":      email,
        "password":   hashed,
        "role":       body.role,
        "dailyLimit": body.dailyLimit,
        "createdAt":  now(),
    })
    doc = sid(await col_users().find_one({"_id": result.inserted_id}))
    return _safe_user(doc)


# ── Update user ───────────────────────────────────────────────────────────────

class UpdateUserBody(BaseModel):
    name:       Optional[str] = None
    role:       Optional[str] = None
    dailyLimit: Optional[int] = None
    password:   Optional[str] = None


@router.put("/users/{uid}")
async def update_user(uid: str, body: UpdateUserBody, admin=Depends(_require_admin)):
    doc = await col_users().find_one({"_id": oid(uid)})
    if not doc:
        raise HTTPException(404, "User not found")
    patch = {}
    if body.name       is not None: patch["name"]       = body.name.strip()
    if body.role       is not None:
        if body.role not in ("user", "sub_admin", "admin"): raise HTTPException(400, "Invalid role")
        patch["role"] = body.role
    if body.dailyLimit is not None:
        if body.dailyLimit < 1: raise HTTPException(400, "dailyLimit must be >= 1")
        patch["dailyLimit"] = body.dailyLimit
    if body.password   is not None:
        patch["password"] = bcrypt.hashpw(body.password[:72].encode(), bcrypt.gensalt()).decode()
    if patch:
        await col_users().update_one({"_id": oid(uid)}, {"$set": patch})
    updated = sid(await col_users().find_one({"_id": oid(uid)}))
    return _safe_user(updated)


# ── Delete user ───────────────────────────────────────────────────────────────

@router.delete("/users/{uid}")
async def delete_user(uid: str, admin=Depends(_require_admin)):
    if uid == admin["id"]:
        raise HTTPException(400, "Cannot delete yourself")
    target = await col_users().find_one({"_id": oid(uid)})
    if not target:
        raise HTTPException(404, "User not found")
    if target.get("role") == "admin":
        raise HTTPException(403, "Cannot delete an admin account")
    await col_users().delete_one({"_id": oid(uid)})
    return {"message": "Deleted"}


# ── Daily limit shortcut ──────────────────────────────────────────────────────

class LimitBody(BaseModel):
    daily_limit: int


@router.patch("/users/{uid}/limit")
async def set_limit(uid: str, body: LimitBody, admin=Depends(_require_admin)):
    if body.daily_limit < 1:
        raise HTTPException(400, "daily_limit must be >= 1")
    if not await col_users().find_one({"_id": oid(uid)}):
        raise HTTPException(404, "User not found")
    await col_users().update_one({"_id": oid(uid)}, {"$set": {"dailyLimit": body.daily_limit}})
    return {"message": "Updated", "daily_limit": body.daily_limit}


# ── Push Notifications ────────────────────────────────────────────────────────

class NotifyBody(BaseModel):
    title:    str
    body:     str
    user_ids: Optional[list[str]] = None  # None = all users


@router.post("/notify")
async def send_notification(nb: NotifyBody, admin=Depends(_require_admin)):
    if nb.user_ids:
        rows = []
        for uid in nb.user_ids:
            rows += await col_fcm_tokens().find({"userId": uid}).to_list(length=50)
        target = "users"
        # resolve names
        names = []
        for uid in nb.user_ids:
            try:
                u = await col_users().find_one({"_id": oid(uid)})
                names.append(u.get("name", uid) if u else uid)
            except Exception:
                names.append(uid)
        target_name = ", ".join(names)
    else:
        rows = await col_fcm_tokens().find({}).to_list(length=1000)
        target = "all"
        target_name = None

    tokens = list({r["token"] for r in rows})  # deduplicate
    sent   = await send_to_tokens(tokens, nb.title, nb.body, {})
    await col_notifications().insert_one({
        "title":      nb.title,
        "body":       nb.body,
        "sentBy":     admin["id"],
        "sentByName": admin.get("name", "Admin"),
        "target":     target,
        "targetName": target_name,
        "sentCount":  sent,
        "createdAt":  now(),
    })
    col = col_notifications()
    total = await col.count_documents({})
    if total > 100:
        oldest = await col.find({}).sort("createdAt", 1).limit(total - 100).to_list(length=total - 100)
        await col.delete_many({"_id": {"$in": [d["_id"] for d in oldest]}})
    return {"message": "Sent", "sent_count": sent}


@router.get("/notify/history")
async def notify_history(admin=Depends(_require_admin)):
    cursor = col_notifications().find({}).sort("createdAt", -1).limit(100)
    docs   = await cursor.to_list(length=100)
    result = []
    for d in docs:
        d["id"]        = str(d.pop("_id"))
        d["createdAt"] = d["createdAt"].isoformat() if isinstance(d.get("createdAt"), datetime) else str(d.get("createdAt", ""))
        result.append(d)
    return result


# ── FCM Token Registration ────────────────────────────────────────────────────

class TokenBody(BaseModel):
    token:    str
    platform: str = "android"


@router.post("/fcm-token")
async def register_token(body: TokenBody, user=Depends(current_user)):
    await col_fcm_tokens().update_one(
        {"userId": user["id"], "token": body.token},
        {"$set": {"userId": user["id"], "token": body.token, "platform": body.platform, "updatedAt": now()}},
        upsert=True,
    )
    return {"message": "Token registered"}


@router.delete("/fcm-token")
async def remove_token(body: TokenBody, user=Depends(current_user)):
    await col_fcm_tokens().delete_one({"userId": user["id"], "token": body.token})
    return {"message": "Token removed"}


# ── Weekly Notification Schedules ─────────────────────────────────────────────

DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]

class ScheduleBody(BaseModel):
    user_id:    str
    day:        str        # "monday" … "sunday"
    hour:       int        # 0-23 UTC
    minute:     int = 0    # 0-59 UTC
    message:    Optional[str] = None
    enabled:    bool = True


@router.get("/schedules")
async def list_schedules(admin=Depends(_require_admin)):
    docs = await col_notify_schedules().find({}).to_list(length=500)
    result = []
    for d in docs:
        d["id"] = str(d.pop("_id"))
        result.append(d)
    return result


@router.put("/schedules")
async def upsert_schedule(body: ScheduleBody, admin=Depends(_require_admin)):
    if body.day not in DAYS:
        raise HTTPException(400, f"day must be one of {DAYS}")
    if not (0 <= body.hour <= 23):
        raise HTTPException(400, "hour must be 0-23")
    if not (0 <= body.minute <= 59):
        raise HTTPException(400, "minute must be 0-59")
    u = await col_users().find_one({"_id": oid(body.user_id)})
    if not u:
        raise HTTPException(404, "User not found")
    await col_notify_schedules().update_one(
        {"userId": body.user_id},
        {"$set": {
            "userId":    body.user_id,
            "userName":  u.get("name", ""),
            "day":       body.day,
            "hour":      body.hour,
            "minute":    body.minute,
            "message":   body.message,
            "enabled":   body.enabled,
            "updatedAt": now(),
        }},
        upsert=True,
    )
    return {"message": "Schedule saved"}


@router.delete("/schedules/{uid}")
async def delete_schedule(uid: str, admin=Depends(_require_admin)):
    await col_notify_schedules().delete_one({"userId": uid})
    return {"message": "Deleted"}


# ── User approval ────────────────────────────────────────────────────────────

@router.get("/pending-users")
async def pending_users(admin=Depends(_require_admin)):
    docs = await col_users().find({"status": "pending"}).to_list(200)
    return [sid(d) for d in docs]


@router.patch("/users/{uid}/approve")
async def approve_user(uid: str, admin=Depends(_require_admin)):
    await col_users().update_one({"_id": oid(uid)}, {"$set": {"status": "approved"}})
    tokens_docs = await col_fcm_tokens().find({"userId": uid}).to_list(20)
    tokens = [t["token"] for t in tokens_docs]
    if tokens:
        await send_to_tokens(
            tokens,
            title="✅ Account Approved!",
            body="Your DevQuiz account has been approved. Tap to log in.",
            data={"type": "account_approved", "path": "/login"},
        )
    return {"message": "User approved"}


class RejectBody(BaseModel):
    reason: str


@router.patch("/users/{uid}/reject")
async def reject_user(uid: str, body: RejectBody, admin=Depends(_require_admin)):
    if not body.reason.strip():
        raise HTTPException(400, "Rejection reason is required")
    await col_users().update_one(
        {"_id": oid(uid)},
        {"$set": {"status": "rejected", "rejectionReason": body.reason.strip()}},
    )
    tokens_docs = await col_fcm_tokens().find({"userId": uid}).to_list(20)
    tokens = [t["token"] for t in tokens_docs]
    if tokens:
        await send_to_tokens(
            tokens,
            title="❌ Account Not Approved",
            body=f"Reason: {body.reason.strip()}",
            data={"type": "account_rejected", "path": "/register"},
        )
    return {"message": "User rejected"}


@router.patch("/users/{uid}/block")
async def block_user(uid: str, admin=Depends(_require_admin)):
    await col_users().update_one({"_id": oid(uid)}, {"$set": {"status": "blocked"}})
    return {"message": "User blocked"}


# ── Debug / manual trigger ────────────────────────────────────────────────────

@router.get("/schedules/debug")
async def debug_schedules(admin=Depends(_require_admin)):
    """Show all schedules and current UTC time — useful for diagnosing missed notifications."""
    from datetime import datetime, timezone
    now = datetime.now(timezone.utc)
    docs = await col_notify_schedules().find({}).to_list(500)
    return {
        "server_utc": now.isoformat(),
        "day": now.strftime("%A").lower(),
        "hour": now.hour,
        "minute": now.minute,
        "schedules": [sid(d) for d in docs],
    }


@router.post("/schedules/trigger-now")
async def trigger_notifications_now(admin=Depends(_require_admin)):
    """Fire ALL enabled schedules immediately, ignoring day/time — for testing."""
    from scheduler_tasks import MOTIVATION_MESSAGES
    import random

    schedules = await col_notify_schedules().find({"enabled": {"$ne": False}}).to_list(500)
    print(f"[trigger-now] firing {len(schedules)} schedule(s)", flush=True)

    sent_total = 0
    for sched in schedules:
        uid         = sched["userId"]
        tokens_docs = await col_fcm_tokens().find({"userId": uid}).to_list(50)
        tokens      = [t["token"] for t in tokens_docs]
        if not tokens:
            print(f"[trigger-now] no FCM tokens for userId={uid}", flush=True)
            continue
        body = sched.get("message") or random.choice(MOTIVATION_MESSAGES)
        from utils.firebase import send_to_tokens
        sent = await send_to_tokens(tokens, title="📚 DevQuiz — Study Time!", body=body, data={"type": "weekly_motivation"})
        print(f"[trigger-now] sent to userId={uid}, tokens={len(tokens)}, delivered={sent}", flush=True)
        sent_total += sent

    return {"message": "Triggered", "schedules_found": len(schedules), "sent_total": sent_total}
