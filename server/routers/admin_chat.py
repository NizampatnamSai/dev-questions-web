"""Private admin <-> user messaging. Only an admin/sub_admin can START a
conversation (POST /start) — there is no user-to-user chat and no way for a
regular user to initiate one. Once a conversation exists, the target user can
reply freely within it. Real-time delivery via a per-user WebSocket (same
JWT-token-auth pattern as workboard.py/admin.py's notification socket — never
trust a raw user_id query param), plus a push + in-app notification on every
message so the other side finds out even while offline."""
import re
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, WebSocket, WebSocketDisconnect
from pydantic import BaseModel
from db_mongo import (
    col_admin_chats, col_admin_chat_messages, col_users, col_user_profiles,
    col_fcm_tokens, col_user_notifications, sid, oid, now,
)
from deps import current_user
from auth_utils import decode_token
from utils.firebase import send_to_tokens

router = APIRouter()


def _is_admin(user) -> bool:
    return user.get("role") in ("admin", "sub_admin")


async def _get_chat_or_403(chat_id: str, user: dict) -> dict:
    chat = await col_admin_chats().find_one({"_id": oid(chat_id)})
    if not chat:
        raise HTTPException(404, "Conversation not found")
    if user["id"] not in (chat["adminId"], chat["userId"]):
        raise HTTPException(403, "Not a participant in this conversation")
    return chat


def _strip_html(html: str) -> str:
    return re.sub(r"<[^>]+>", "", html or "").strip()


# ── WebSocket (real-time delivery) ──────────────────────────────────────────

class ChatConnectionManager:
    def __init__(self):
        self.connections: dict[str, list[WebSocket]] = {}

    async def connect(self, user_id: str, ws: WebSocket):
        await ws.accept()
        self.connections.setdefault(user_id, []).append(ws)

    def disconnect(self, user_id: str, ws: WebSocket):
        conns = self.connections.get(user_id, [])
        if ws in conns:
            conns.remove(ws)

    async def send_to_user(self, user_id: str, data: dict):
        for ws in list(self.connections.get(user_id, [])):
            try:
                await ws.send_json(data)
            except Exception:
                self.disconnect(user_id, ws)


manager = ChatConnectionManager()


@router.websocket("/ws")
async def admin_chat_ws(ws: WebSocket, token: str = None):
    user_id = None
    if token:
        try:
            user_id = decode_token(token)
        except Exception:
            user_id = None
    if not user_id:
        await ws.close(code=4001)
        return
    await manager.connect(user_id, ws)
    try:
        while True:
            await ws.receive_text()  # keep-alive
    except WebSocketDisconnect:
        manager.disconnect(user_id, ws)


# ── Start / list conversations ──────────────────────────────────────────────

class StartChatBody(BaseModel):
    userId: str


@router.post("/start")
async def start_chat(body: StartChatBody, admin=Depends(current_user)):
    if not _is_admin(admin):
        raise HTTPException(403, "Admin only — users cannot start conversations")
    if body.userId == admin["id"]:
        raise HTTPException(400, "Cannot start a chat with yourself")
    target = await col_users().find_one({"_id": oid(body.userId)})
    if not target:
        raise HTTPException(404, "User not found")

    existing = await col_admin_chats().find_one({"adminId": admin["id"], "userId": body.userId})
    if existing:
        return sid(existing)

    doc = {
        "adminId": admin["id"],
        "adminName": admin.get("name", "Admin"),
        "userId": body.userId,
        "userName": target.get("name", "User"),
        "createdAt": now(),
        "lastMessageAt": now(),
        "lastMessagePreview": "",
    }
    result = await col_admin_chats().insert_one(doc)
    created = await col_admin_chats().find_one({"_id": result.inserted_id})
    return sid(created)


@router.get("/conversations")
async def list_conversations(user=Depends(current_user)):
    if _is_admin(user):
        docs = await col_admin_chats().find({"adminId": user["id"]}).sort("lastMessageAt", -1).to_list(200)
    else:
        docs = await col_admin_chats().find({"userId": user["id"]}).sort("lastMessageAt", -1).to_list(200)

    chat_ids = [str(d["_id"]) for d in docs]
    unread_by_chat = {}
    if chat_ids:
        pipeline = [
            {"$match": {"chatId": {"$in": chat_ids}, "senderId": {"$ne": user["id"]}, "readBy": {"$ne": user["id"]}}},
            {"$group": {"_id": "$chatId", "count": {"$sum": 1}}},
        ]
        rows = [r async for r in col_admin_chat_messages().aggregate(pipeline)]
        unread_by_chat = {r["_id"]: r["count"] for r in rows}

    other_ids = [d["userId"] if _is_admin(user) else d["adminId"] for d in docs]
    profiles = await col_user_profiles().find({"userId": {"$in": other_ids}}).to_list(length=len(other_ids) or 1)
    avatar_by_id = {p["userId"]: p.get("avatar_url") for p in profiles}

    result = []
    for d in docs:
        chat_id = str(d["_id"])
        other_id = d["userId"] if _is_admin(user) else d["adminId"]
        other_name = d["userName"] if _is_admin(user) else d["adminName"]
        result.append({
            "id": chat_id,
            "otherUserId": other_id,
            "otherUserName": other_name,
            "otherUserAvatar": avatar_by_id.get(other_id),
            "lastMessageAt": d.get("lastMessageAt").isoformat() if d.get("lastMessageAt") else None,
            "lastMessagePreview": d.get("lastMessagePreview", ""),
            "unreadCount": unread_by_chat.get(chat_id, 0),
        })
    return result


@router.get("/users")
async def list_users_for_new_chat(admin=Depends(current_user)):
    """Admin-only: user picker for starting a new conversation."""
    if not _is_admin(admin):
        raise HTTPException(403, "Admin only")
    docs = await col_users().find(
        {"status": {"$ne": "rejected"}, "_id": {"$ne": oid(admin["id"])}}
    ).sort("name", 1).to_list(500)
    return [{"id": str(d["_id"]), "name": d.get("name", ""), "email": d.get("email", "")} for d in docs]


# ── Messages ─────────────────────────────────────────────────────────────────

@router.get("/{chat_id}/messages")
async def get_messages(chat_id: str, user=Depends(current_user)):
    await _get_chat_or_403(chat_id, user)
    docs = await col_admin_chat_messages().find({"chatId": chat_id}).sort("createdAt", 1).to_list(500)
    await col_admin_chat_messages().update_many(
        {"chatId": chat_id, "senderId": {"$ne": user["id"]}, "readBy": {"$ne": user["id"]}},
        {"$addToSet": {"readBy": user["id"]}},
    )
    return [sid(d) for d in docs]


class SendMessageBody(BaseModel):
    html: str = ""
    imageUrl: Optional[str] = None


@router.post("/{chat_id}/messages")
async def send_message(chat_id: str, body: SendMessageBody, user=Depends(current_user)):
    chat = await _get_chat_or_403(chat_id, user)
    text = _strip_html(body.html)
    if not text and not body.imageUrl:
        raise HTTPException(400, "Message cannot be empty")
    if len(body.html) > 10000:
        raise HTTPException(400, "Message too long")

    msg_doc = {
        "chatId": chat_id,
        "senderId": user["id"],
        "senderName": user.get("name", "Unknown"),
        "html": body.html,
        "imageUrl": body.imageUrl,
        "createdAt": now(),
        "readBy": [user["id"]],
    }
    result = await col_admin_chat_messages().insert_one(msg_doc)
    created = sid(await col_admin_chat_messages().find_one({"_id": result.inserted_id}))

    preview = text[:80] if text else "📷 Image"
    await col_admin_chats().update_one(
        {"_id": oid(chat_id)},
        {"$set": {"lastMessageAt": now(), "lastMessagePreview": preview}},
    )

    other_id = chat["userId"] if user["id"] == chat["adminId"] else chat["adminId"]

    await manager.send_to_user(other_id, {"type": "new_message", "chatId": chat_id, "message": created})

    await col_user_notifications().insert_one({
        "userId": other_id,
        "title": f"💬 {user.get('name', 'Someone')} sent you a message",
        "body": preview,
        "type": "admin_chat",
        "path": "/messages",
        "read": False,
        "createdAt": now(),
    })
    token_docs = await col_fcm_tokens().find({"userId": other_id}).to_list(10)
    tokens = [t["token"] for t in token_docs]
    if tokens:
        await send_to_tokens(
            tokens,
            title=f"💬 {user.get('name', 'Someone')} sent you a message",
            body=preview,
            data={"type": "admin_chat", "path": "/messages"},
        )

    return created
