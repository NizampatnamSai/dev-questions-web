import bcrypt
from datetime import datetime
from typing import Optional
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from db_mongo import col_users, col_fcm_tokens, col_notifications, col_notify_schedules, col_community_schedule, col_user_notifications, col_app_config, sid, oid, now
from deps import current_user
from utils.firebase import send_to_tokens

router = APIRouter()


def _require_admin(user=Depends(current_user)):
    if user.get("role") not in ("admin", "sub_admin"):
        raise HTTPException(403, "Admin only")
    return user


def _safe_user(doc: dict) -> dict:
    return {
        "id":           doc.get("id", str(doc.get("_id", ""))),
        "name":         doc.get("name"),
        "email":        doc.get("email"),
        "role":         doc.get("role", "user"),
        "dailyLimit":   doc.get("dailyLimit", 25),
        "createdAt":    doc["createdAt"].isoformat() if isinstance(doc.get("createdAt"), datetime) else str(doc.get("createdAt", "")),
        "questionCount": doc.get("questionCount", 0),
    }


# ── List all users ────────────────────────────────────────────────────────────

@router.get("/users")
async def list_users(admin=Depends(_require_admin)):
    from db_mongo import col_questions
    cursor = col_users().find({"status": {"$ne": "rejected"}}).sort("createdAt", -1)
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
    dailyLimit:  int = 25


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
    ts = now()
    sent   = await send_to_tokens(tokens, nb.title, nb.body, {"type": "broadcast", "path": "/notifications"})
    await col_notifications().insert_one({
        "title":      nb.title,
        "body":       nb.body,
        "sentBy":     admin["id"],
        "sentByName": admin.get("name", "Admin"),
        "target":     target,
        "targetName": target_name,
        "sentCount":  sent,
        "createdAt":  ts,
    })
    # Log per-user
    uid_set = set(r["userId"] for r in rows)
    if uid_set:
        await col_user_notifications().insert_many([
            {"userId": uid, "title": nb.title, "body": nb.body, "type": "broadcast",
             "sentBy": admin["id"], "sentByName": admin.get("name","Admin"), "read": False, "createdAt": ts}
            for uid in uid_set
        ])
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
    await col_users().update_one({"_id": oid(uid)}, {"$set": {"status": "approved", "approvedAt": now()}})

    # Store notification in database
    await col_notifications().insert_one({
        "userId": uid,
        "type": "account_approved",
        "title": "✅ Account Approved!",
        "body": "Your DevQuiz account has been approved. You can now log in!",
        "data": {"path": "/login"},
        "read": False,
        "createdAt": now(),
    })

    # Send push notification
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
    reason = body.reason.strip()
    await col_users().update_one(
        {"_id": oid(uid)},
        {"$set": {"status": "rejected", "rejectionReason": reason, "rejectedAt": now()}},
    )

    # Store notification in database
    await col_notifications().insert_one({
        "userId": uid,
        "type": "account_rejected",
        "title": "❌ Account Not Approved",
        "body": f"Reason: {reason}",
        "data": {"path": "/register"},
        "read": False,
        "createdAt": now(),
    })

    # Send push notification
    tokens_docs = await col_fcm_tokens().find({"userId": uid}).to_list(20)
    tokens = [t["token"] for t in tokens_docs]
    if tokens:
        await send_to_tokens(
            tokens,
            title="❌ Account Not Approved",
            body=f"Reason: {reason}",
            data={"type": "account_rejected", "path": "/register"},
        )
    return {"message": "User rejected"}


@router.patch("/users/{uid}/block")
async def block_user(uid: str, admin=Depends(_require_admin)):
    await col_users().update_one({"_id": oid(uid)}, {"$set": {"status": "blocked"}})
    return {"message": "User blocked"}

@router.patch("/users/{uid}/disable")
async def disable_user(uid: str, admin=Depends(_require_admin)):
    await col_users().update_one({"_id": oid(uid)}, {"$set": {"status": "disabled"}})
    return {"message": "User disabled"}

@router.patch("/users/{uid}/enable")
async def enable_user(uid: str, admin=Depends(_require_admin)):
    await col_users().update_one({"_id": oid(uid)}, {"$set": {"status": "approved"}})
    return {"message": "User enabled"}


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


# ── Community posting schedule ─────────────────────────────────────────────────

DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
DEFAULT_EMAILS = [
    "vikash.jangid.eps@gmail.com",
    "bhavya_joshi@eplanetsoft.com",
    "rishabh_swami@eplanetsoft.com",
    "badal_varshney@eplanetsoft.com",
    "priyanka_kumawat@eplanetsoft.com",
    None,
    None,
]

@router.get("/community-schedule")
async def get_community_schedule(admin=Depends(_require_admin)):
    docs = {d["weekday"]: d for d in await col_community_schedule().find({}).to_list(10)}
    # reminder time stored at weekday=-1
    time_doc = await col_community_schedule().find_one({"weekday": -1})
    reminder_hour   = time_doc["hour"]   if time_doc else 4
    reminder_minute = time_doc["minute"] if time_doc else 45
    result = []
    for i, day in enumerate(DAYS):
        doc = docs.get(i)
        email = doc["email"] if doc else DEFAULT_EMAILS[i]
        user_doc = await col_users().find_one({"email": email}) if email else None
        result.append({
            "weekday": i,
            "day": day,
            "email": email,
            "name": user_doc.get("name") if user_doc else None,
        })
    return {"schedule": result, "reminderHourUTC": reminder_hour, "reminderMinuteUTC": reminder_minute}

class CommunityScheduleEntry(BaseModel):
    weekday: int  # 0=Mon…6=Sun, or -1 for time config
    email: Optional[str] = None
    hour: Optional[int] = None    # UTC hour for reminder (weekday=-1)
    minute: Optional[int] = None  # UTC minute for reminder (weekday=-1)
    muted: Optional[bool] = None  # mute reminder for this day

@router.put("/community-schedule")
async def update_community_schedule(entry: CommunityScheduleEntry, admin=Depends(_require_admin)):
    if not (-1 <= entry.weekday <= 6):
        raise HTTPException(400, "weekday must be -1–6")
    if entry.weekday == -1:
        # Update reminder time
        await col_community_schedule().update_one(
            {"weekday": -1},
            {"$set": {"weekday": -1, "hour": entry.hour, "minute": entry.minute}},
            upsert=True,
        )
        # Reschedule live APScheduler job
        try:
            from main import scheduler
            scheduler.reschedule_job("community_reminder", trigger="cron",
                                     hour=entry.hour, minute=entry.minute, second=0)
        except Exception:
            pass
    else:
        update_fields = {"weekday": entry.weekday}
        if entry.email is not None or entry.muted is None:
            update_fields["email"] = entry.email
        if entry.muted is not None:
            update_fields["muted"] = entry.muted
        await col_community_schedule().update_one(
            {"weekday": entry.weekday},
            {"$set": update_fields},
            upsert=True,
        )
    return {"ok": True}


# ── Send notification to selected users ────────────────────────────────────────

class TestNotifyPayload(BaseModel):
    user_ids: list  # list of user id strings, or ["all"]
    title: str
    body: str

@router.post("/notify/send-to-users")
async def send_to_selected_users(payload: TestNotifyPayload, admin=Depends(_require_admin)):
    from utils.firebase import send_to_tokens as _send
    if payload.user_ids == ["all"]:
        users = await col_users().find({"status": {"$ne": "rejected"}}).to_list(500)
        user_ids = [str(u["_id"]) for u in users]
    else:
        user_ids = payload.user_ids

    sent = 0
    ts = now()
    for uid in user_ids:
        toks = await col_fcm_tokens().find({"userId": uid}).to_list(10)
        tokens = [t["token"] for t in toks]
        if tokens:
            await _send(tokens, title=payload.title, body=payload.body,
                        data={"type": "manual", "path": "/notifications"})
            sent += len(tokens)
        # Log per-user notification regardless of FCM token (so inbox shows it)
        await col_user_notifications().insert_one({
            "userId":    uid,
            "title":     payload.title,
            "body":      payload.body,
            "type":      "manual",
            "sentBy":    admin["id"],
            "sentByName": admin.get("name", "Admin"),
            "read":      False,
            "createdAt": ts,
        })
    return {"sent": sent, "users": len(user_ids)}


@router.get("/notifications/my")
async def my_notifications(user=Depends(current_user)):
    docs = await col_user_notifications().find(
        {"userId": user["id"]}
    ).sort("createdAt", -1).limit(50).to_list(50)
    result = []
    for d in docs:
        d["id"] = str(d.pop("_id"))
        d["createdAt"] = d["createdAt"].isoformat() if isinstance(d.get("createdAt"), datetime) else str(d.get("createdAt", ""))
        result.append(d)
    return result


@router.patch("/notifications/my/read-all")
async def mark_all_read(user=Depends(current_user)):
    await col_user_notifications().update_many(
        {"userId": user["id"], "read": False},
        {"$set": {"read": True}}
    )
    return {"ok": True}


@router.patch("/notifications/my/{notif_id}/read")
async def mark_one_read(notif_id: str, user=Depends(current_user)):
    from bson import ObjectId
    await col_user_notifications().update_one(
        {"_id": ObjectId(notif_id), "userId": user["id"]},
        {"$set": {"read": True}}
    )
    return {"ok": True}


@router.get("/notifications/my/unread-count")
async def unread_count(user=Depends(current_user)):
    count = await col_user_notifications().count_documents({"userId": user["id"], "read": False})
    return {"count": count}


# ── App Config (maintenance / force update) ───────────────────────────────────

class AppConfigBody(BaseModel):
    maintenance: Optional[bool] = None
    maintenance_message: Optional[str] = None
    force_update: Optional[bool] = None
    force_update_message: Optional[str] = None


@router.get("/app-config/public")
async def get_app_config_public():
    """Public endpoint — called by frontend on every load to check maintenance/update state."""
    doc = await col_app_config().find_one({"_id": "config"})
    if not doc:
        return {"maintenance": False, "force_update": False}
    return {
        "maintenance":          doc.get("maintenance", False),
        "maintenance_message":  doc.get("maintenance_message", "We're currently performing maintenance. We'll be back shortly!"),
        "force_update":         doc.get("force_update", False),
        "force_update_message": doc.get("force_update_message", "A new version is available. Please refresh to get the latest updates!"),
    }


@router.get("/app-config")
async def get_app_config(admin=Depends(_require_admin)):
    doc = await col_app_config().find_one({"_id": "config"})
    if not doc:
        return {"maintenance": False, "maintenance_message": "", "force_update": False, "force_update_message": ""}
    doc.pop("_id", None)
    return doc


@router.put("/app-config")
async def update_app_config(body: AppConfigBody, admin=Depends(_require_admin)):
    doc = await col_app_config().find_one({"_id": "config"}) or {}
    was_maintenance = doc.get("maintenance", False)

    update = {}
    if body.maintenance is not None:
        update["maintenance"] = body.maintenance
    if body.maintenance_message is not None:
        update["maintenance_message"] = body.maintenance_message
    if body.force_update is not None:
        update["force_update"] = body.force_update
    if body.force_update_message is not None:
        update["force_update_message"] = body.force_update_message

    await col_app_config().update_one(
        {"_id": "config"},
        {"$set": update},
        upsert=True,
    )

    # If maintenance just turned OFF → notify all users
    if was_maintenance and body.maintenance is False:
        all_tokens = await col_fcm_tokens().find({}).to_list(1000)
        tokens = list({t["token"] for t in all_tokens})
        if tokens:
            await send_to_tokens(tokens,
                title="✅ We're back online!",
                body="Maintenance is complete. DevQuiz is ready to use!",
                data={"type": "broadcast", "path": "/dashboard"},
            )

    # If force_update just turned ON → notify all users with custom message
    if body.force_update is True and not doc.get("force_update", False):
        msg = body.force_update_message or update.get("force_update_message") or "A new version is available. Please refresh!"
        all_tokens = await col_fcm_tokens().find({}).to_list(1000)
        tokens = list({t["token"] for t in all_tokens})
        if tokens:
            await send_to_tokens(tokens,
                title="🚀 Update Available!",
                body=msg,
                data={"type": "broadcast", "path": "/dashboard"},
            )

    return {"ok": True}


# ── User cleanup ──────────────────────────────────────────────────────────────

@router.get("/users/invalid")
async def list_invalid_users(admin=Depends(_require_admin)):
    """Returns users with no name, no email, or invalid email."""
    docs = await col_users().find({}).to_list(500)
    invalid = []
    for d in docs:
        name  = (d.get("name") or "").strip()
        email = (d.get("email") or "").strip()
        if not name or not email or "@" not in email:
            invalid.append({
                "id":    str(d["_id"]),
                "name":  name or "(no name)",
                "email": email or "(no email)",
                "role":  d.get("role", "user"),
            })
    return invalid


@router.delete("/users/{uid}")
async def delete_user(uid: str, admin=Depends(_require_admin)):
    from bson import ObjectId
    result = await col_users().delete_one({"_id": ObjectId(uid)})
    if result.deleted_count == 0:
        raise HTTPException(404, "User not found")
    return {"ok": True, "deleted": uid}
