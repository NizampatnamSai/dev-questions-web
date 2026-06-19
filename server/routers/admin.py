import bcrypt
from datetime import datetime
from typing import Optional
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from db_mongo import col_users, col_fcm_tokens, col_notifications, sid, oid, now
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
    if body.role not in ("user", "admin"):
        raise HTTPException(400, "role must be user or admin")
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
        if body.role not in ("user", "admin"): raise HTTPException(400, "Invalid role")
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
    if not await col_users().find_one({"_id": oid(uid)}):
        raise HTTPException(404, "User not found")
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
    title:   str
    body:    str
    user_id: Optional[str] = None


@router.post("/notify")
async def send_notification(nb: NotifyBody, admin=Depends(_require_admin)):
    target_name = None
    if nb.user_id:
        rows = await col_fcm_tokens().find({"userId": nb.user_id}).to_list(length=100)
        # Resolve user name for the log
        try:
            u = await col_users().find_one({"_id": oid(nb.user_id)})
            target_name = u.get("name") if u else nb.user_id
        except Exception:
            target_name = nb.user_id
    else:
        rows = await col_fcm_tokens().find({}).to_list(length=1000)
    tokens = [r["token"] for r in rows]
    sent   = await send_to_tokens(tokens, nb.title, nb.body, {})
    await col_notifications().insert_one({
        "title":      nb.title,
        "body":       nb.body,
        "sentBy":     admin["id"],
        "sentByName": admin.get("name", "Admin"),
        "target":     "user" if nb.user_id else "all",
        "targetName": target_name,
        "sentCount":  sent,
        "createdAt":  now(),
    })
    # Keep only the latest 100 log entries to avoid storage bloat
    col = col_notifications()
    total = await col.count_documents({})
    if total > 100:
        oldest = await col.find({}).sort("createdAt", 1).limit(total - 100).to_list(length=total - 100)
        ids = [d["_id"] for d in oldest]
        await col.delete_many({"_id": {"$in": ids}})
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
