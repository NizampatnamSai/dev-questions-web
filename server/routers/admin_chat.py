"""Private admin <-> user messaging. Only an admin/sub_admin can START a
conversation (POST /start) — there is no user-to-user chat and no way for a
regular user to initiate one. Once a conversation exists, the target user can
reply freely within it. Real-time delivery via a per-user WebSocket (same
JWT-token-auth pattern as workboard.py/admin.py's notification socket — never
trust a raw user_id query param), plus a push + in-app notification on every
message so the other side finds out even while offline."""
import re
import json
import html as html_lib
from datetime import datetime, timezone
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, WebSocket, WebSocketDisconnect
from pydantic import BaseModel
from db_mongo import (
    col_admin_chats, col_admin_chat_messages, col_users, col_user_profiles,
    col_fcm_tokens, col_user_notifications, col_app_config, sid, oid, now,
)
from deps import current_user, require_ai_enabled
from auth_utils import decode_token
from utils.firebase import send_to_tokens
from routers.ask import _groq_ask

router = APIRouter()


def _is_admin(user) -> bool:
    return user.get("role") in ("admin", "sub_admin")


async def _get_edit_window_minutes() -> int:
    doc = await col_app_config().find_one({"_id": "config"}) or {}
    return int(doc.get("chat_edit_window_minutes", 30))


def _can_edit_message(msg: dict, window_minutes: int) -> bool:
    created_at = msg.get("createdAt")
    if not created_at:
        return False
    if created_at.tzinfo is None:
        created_at = created_at.replace(tzinfo=timezone.utc)
    return (now() - created_at).total_seconds() < (window_minutes * 60)


def _is_participant(chat: dict, user_id: str) -> bool:
    if chat.get("type") == "group":
        return user_id in chat.get("participantIds", [])
    return user_id in (chat["adminId"], chat["userId"])


def _other_participant_ids(chat: dict, user_id: str) -> list[str]:
    """Everyone in the chat besides user_id — a 1-element list for a DM, N-1
    for a group. Used for WS fan-out and notifications."""
    if chat.get("type") == "group":
        return [p for p in chat.get("participantIds", []) if p != user_id]
    other = chat["userId"] if user_id == chat["adminId"] else chat["adminId"]
    return [other]


def _recipient_status(msg: dict, other_ids: list[str]) -> dict:
    """Sent/delivered/seen counts for a message, computed against the
    chat's OTHER participants (never the sender). A DM has exactly one
    "other" — the frontend renders that as a single WhatsApp-style tick;
    a group's counts render as "Delivered N · Seen M"."""
    delivered_to = set(msg.get("deliveredTo", []))
    read_by = set(msg.get("readBy", []))
    total = len(other_ids)
    return {
        "deliveredCount": sum(1 for uid in other_ids if uid in delivered_to),
        "readCount": sum(1 for uid in other_ids if uid in read_by),
        "totalRecipients": total,
    }


async def _get_chat_or_403(chat_id: str, user: dict) -> dict:
    chat = await col_admin_chats().find_one({"_id": oid(chat_id)})
    if not chat:
        raise HTTPException(404, "Conversation not found")
    if not _is_participant(chat, user["id"]):
        raise HTTPException(403, "Not a participant in this conversation")
    return chat


def _strip_html(html: str) -> str:
    # Quill inserts literal &nbsp; between/around words — stripping just the
    # tags left those entities showing up as raw "&nbsp;" text in previews
    # (conversation list, push notification body) instead of a plain space.
    return html_lib.unescape(re.sub(r"<[^>]+>", "", html or "")).strip()


# ── WebSocket (real-time delivery) ──────────────────────────────────────────

def _json_default(o):
    # Message docs carry a raw pymongo datetime (sid() only stringifies
    # _id) — Starlette's ws.send_json() calls stdlib json.dumps with no
    # datetime support, so every broadcast that includes a message doc
    # (new_message, edit_message, ...) used to raise inside send_to_user,
    # get swallowed by the broad except below, and silently kill the
    # socket. Serialize to text ourselves with this encoder instead.
    if isinstance(o, datetime):
        return o.isoformat()
    raise TypeError(f"Object of type {type(o).__name__} is not JSON serializable")


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

    def is_online(self, user_id: str) -> bool:
        return bool(self.connections.get(user_id))

    async def send_to_user(self, user_id: str, data: dict):
        text = json.dumps(data, default=_json_default)
        for ws in list(self.connections.get(user_id, [])):
            try:
                await ws.send_text(text)
            except Exception:
                self.disconnect(user_id, ws)

    async def broadcast(self, data: dict, exclude_user_id: str | None = None):
        text = json.dumps(data, default=_json_default)
        for uid, conns in list(self.connections.items()):
            if uid == exclude_user_id:
                continue
            for ws in list(conns):
                try:
                    await ws.send_text(text)
                except Exception:
                    self.disconnect(uid, ws)

    async def broadcast_to_many(self, user_ids: list[str], data: dict, exclude_user_id: str | None = None):
        for uid in user_ids:
            if uid == exclude_user_id:
                continue
            await self.send_to_user(uid, data)


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
    # Presence dots (Messages page) key off both a live WS connection (an
    # instant, unambiguous "online now") and the persisted lastActiveAt on
    # the user doc (for anyone who's away/offline) — broadcasting on
    # connect/disconnect lets everyone else's dot flip live instead of only
    # updating the next time they happen to refetch conversations.
    await col_users().update_one({"_id": oid(user_id)}, {"$set": {"lastActiveAt": now()}})
    await manager.broadcast({"type": "presence", "userId": user_id, "online": True}, exclude_user_id=user_id)
    try:
        while True:
            raw = await ws.receive_text()
            # Client -> server traffic on this socket, beyond the plain
            # keep-alive pings: currently just "I have this chat open and
            # just saw a live message" so read receipts don't need a
            # separate REST call for every incoming message.
            try:
                data = json.loads(raw)
            except (ValueError, TypeError):
                continue
            if data.get("type") == "mark_read":
                chat_id = data.get("chatId")
                if not chat_id:
                    continue
                try:
                    chat = await col_admin_chats().find_one({"_id": oid(chat_id)})
                except ValueError:
                    continue
                if chat and _is_participant(chat, user_id):
                    await _mark_delivered_and_read(chat, chat_id, {"id": user_id})
    except WebSocketDisconnect:
        manager.disconnect(user_id, ws)
        await col_users().update_one({"_id": oid(user_id)}, {"$set": {"lastActiveAt": now()}})
        if not manager.is_online(user_id):
            await manager.broadcast({"type": "presence", "userId": user_id, "online": False}, exclude_user_id=user_id)


# ── Start / list conversations ──────────────────────────────────────────────

class StartChatBody(BaseModel):
    userId: str


@router.post("/start")
async def start_chat(body: StartChatBody, admin=Depends(current_user)):
    if not _is_admin(admin):
        raise HTTPException(403, "Admin only — users cannot start conversations")
    # Self-chat is intentionally allowed — a personal notes/reminders thread,
    # same idea as WhatsApp's "Message Yourself". adminId == userId on the
    # doc; every other code path here (list_conversations, send_message)
    # already resolves "the other side" per-document rather than assuming
    # adminId != userId, so this needs no special-casing beyond allowing it.
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
        "userName": target.get("name", "User") + (" (You)" if body.userId == admin["id"] else ""),
        "createdAt": now(),
        "lastMessageAt": now(),
        "lastMessagePreview": "",
    }
    result = await col_admin_chats().insert_one(doc)
    created = await col_admin_chats().find_one({"_id": result.inserted_id})
    return sid(created)


class CreateGroupBody(BaseModel):
    name: Optional[str] = None
    memberIds: List[str]


@router.post("/group")
async def create_group(body: CreateGroupBody, admin=Depends(current_user)):
    if not _is_admin(admin):
        raise HTTPException(403, "Admin only — users cannot create groups")
    if not body.memberIds:
        raise HTTPException(400, "Pick at least one member")

    # Dedupe while preserving order, always including the creator even if
    # they didn't tick their own row in the picker.
    participant_ids = list(dict.fromkeys([admin["id"], *body.memberIds]))
    member_docs = await col_users().find({"_id": {"$in": [oid(i) for i in participant_ids]}}).to_list(len(participant_ids))
    if len(member_docs) != len(participant_ids):
        raise HTTPException(404, "One or more selected users not found")
    names_by_id = {str(d["_id"]): d.get("name", "User") for d in member_docs}

    group_name = body.name.strip() if body.name and body.name.strip() else None
    if not group_name:
        others = [names_by_id[p] for p in participant_ids if p != admin["id"]]
        group_name = ", ".join(others[:3]) + (f" +{len(others) - 3}" if len(others) > 3 else "") if others else "Group Chat"

    doc = {
        "type": "group",
        "groupName": group_name,
        "participantIds": participant_ids,
        "participantNames": names_by_id,
        "createdBy": admin["id"],
        "createdAt": now(),
        "lastMessageAt": now(),
        "lastMessagePreview": "",
    }
    result = await col_admin_chats().insert_one(doc)
    created = await col_admin_chats().find_one({"_id": result.inserted_id})
    return sid(created)


class RenameGroupBody(BaseModel):
    name: str


@router.patch("/group/{chat_id}")
async def rename_group(chat_id: str, body: RenameGroupBody, user=Depends(current_user)):
    chat = await col_admin_chats().find_one({"_id": oid(chat_id)})
    if not chat or chat.get("type") != "group":
        raise HTTPException(404, "Group not found")
    if not _is_participant(chat, user["id"]):
        raise HTTPException(403, "Not a participant in this group")
    if not _is_admin(user):
        raise HTTPException(403, "Only an admin can rename this group")
    name = body.name.strip()
    if not name:
        raise HTTPException(400, "Name cannot be empty")

    await col_admin_chats().update_one({"_id": oid(chat_id)}, {"$set": {"groupName": name}})

    await manager.broadcast_to_many(
        chat["participantIds"], {"type": "rename_group", "chatId": chat_id, "name": name}, exclude_user_id=user["id"],
    )
    return {"id": chat_id, "groupName": name}


@router.get("/conversations")
async def list_conversations(user=Depends(current_user)):
    # An admin can be on EITHER side of a DM doc — the starter (adminId),
    # or the recipient (userId) if a DIFFERENT admin started a conversation
    # with them (admin-to-admin messaging is allowed, nothing restricts who
    # an admin can message). The old "if I'm an admin, I must be adminId on
    # every one of my chats" assumption meant an admin who only ever
    # RECEIVED admin-to-admin chats never saw them in their own list at all
    # — regular (non-admin) users can only ever be the recipient, so their
    # query stays as just userId. Group docs are matched purely by
    # participantIds membership, same for everyone regardless of role.
    if _is_admin(user):
        docs = await col_admin_chats().find(
            {"$or": [{"adminId": user["id"]}, {"userId": user["id"]}, {"participantIds": user["id"]}]}
        ).sort("lastMessageAt", -1).to_list(200)
    else:
        docs = await col_admin_chats().find(
            {"$or": [{"userId": user["id"]}, {"participantIds": user["id"]}]}
        ).sort("lastMessageAt", -1).to_list(200)

    chat_ids = [str(d["_id"]) for d in docs]
    unread_by_chat = {}
    if chat_ids:
        pipeline = [
            {"$match": {"chatId": {"$in": chat_ids}, "senderId": {"$ne": user["id"]}, "readBy": {"$ne": user["id"]}}},
            {"$group": {"_id": "$chatId", "count": {"$sum": 1}}},
        ]
        rows = [r async for r in col_admin_chat_messages().aggregate(pipeline)]
        unread_by_chat = {r["_id"]: r["count"] for r in rows}

    dm_docs = [d for d in docs if d.get("type") != "group"]
    group_docs = [d for d in docs if d.get("type") == "group"]

    # Per-document, not per-role — same reasoning as above.
    other_ids = [d["userId"] if d["adminId"] == user["id"] else d["adminId"] for d in dm_docs]
    profiles = await col_user_profiles().find({"userId": {"$in": other_ids}}).to_list(length=len(other_ids) or 1)
    avatar_by_id = {p["userId"]: p.get("avatar_url") for p in profiles}
    presence_docs = await col_users().find(
        {"_id": {"$in": [oid(i) for i in set(other_ids)]}}, {"lastActiveAt": 1}
    ).to_list(length=len(other_ids) or 1)
    last_active_by_id = {str(p["_id"]): p.get("lastActiveAt") for p in presence_docs}

    result = []
    for d in dm_docs:
        chat_id = str(d["_id"])
        i_started_it = d["adminId"] == user["id"]
        other_id = d["userId"] if i_started_it else d["adminId"]
        other_name = d["userName"] if i_started_it else d["adminName"]
        result.append({
            "id": chat_id,
            "type": "dm",
            "otherUserId": other_id,
            "otherUserName": other_name,
            "otherUserAvatar": avatar_by_id.get(other_id),
            # Raw online flag + timestamp instead of a precomputed status —
            # the frontend derives online/away/offline itself from elapsed
            # time on a local clock tick, so it never needs to re-poll this
            # endpoint just to notice a dot should turn from green to yellow.
            "otherUserOnline": manager.is_online(other_id),
            "otherUserLastActiveAt": last_active_by_id.get(other_id).isoformat() if last_active_by_id.get(other_id) else None,
            "lastMessageAt": d.get("lastMessageAt").isoformat() if d.get("lastMessageAt") else None,
            "lastMessagePreview": d.get("lastMessagePreview", ""),
            "unreadCount": unread_by_chat.get(chat_id, 0),
            "pinnedMessageIds": d.get("pinnedMessageIds", []),
            "mutedByMe": user["id"] in d.get("mutedBy", []),
        })
    for d in group_docs:
        chat_id = str(d["_id"])
        participant_ids = d.get("participantIds", [])
        online_count = sum(1 for p in participant_ids if manager.is_online(p))
        result.append({
            "id": chat_id,
            "type": "group",
            "groupName": d.get("groupName", "Group Chat"),
            "participantCount": len(participant_ids),
            "onlineCount": online_count,
            "lastMessageAt": d.get("lastMessageAt").isoformat() if d.get("lastMessageAt") else None,
            "lastMessagePreview": d.get("lastMessagePreview", ""),
            "unreadCount": unread_by_chat.get(chat_id, 0),
            "pinnedMessageIds": d.get("pinnedMessageIds", []),
            "mutedByMe": user["id"] in d.get("mutedBy", []),
            # Needed client-side to detect/highlight @mentions in message text.
            "participantNames": d.get("participantNames", {}),
        })

    result.sort(key=lambda c: c["lastMessageAt"] or "", reverse=True)
    return result


@router.get("/users")
async def list_users_for_new_chat(admin=Depends(current_user), forGroup: bool = False):
    """Admin-only: user picker for starting a NEW conversation, or (with
    forGroup=true) for picking members while creating a group. Any user
    (including other admins — there's nothing role-restricted about who an
    admin can message) who already has a DM with this admin is excluded
    here for the DM picker — they belong in the existing conversation list
    on the left, not in the "start a new chat" picker. That exclusion is
    irrelevant for group membership (you might already DM someone and still
    want them in a group too), so forGroup skips it."""
    if not _is_admin(admin):
        raise HTTPException(403, "Admin only")

    already_chatting_with = set()
    if not forGroup:
        # Both self-chats and chats with someone already in progress are
        # excluded once they exist — the resulting doc has adminId == userId
        # == admin["id"] for a self-chat, so it naturally lands in
        # already_chatting_with too and disappears from this picker after
        # the first time, same as any other existing conversation.
        existing_chats = await col_admin_chats().find({"adminId": admin["id"]}).to_list(500)
        already_chatting_with = {c["userId"] for c in existing_chats}

    docs = await col_users().find(
        {"status": {"$ne": "rejected"}}
    ).sort("name", 1).to_list(500)
    docs = [d for d in docs if str(d["_id"]) not in already_chatting_with]

    user_ids = [str(d["_id"]) for d in docs]
    profiles = await col_user_profiles().find({"userId": {"$in": user_ids}}).to_list(length=len(user_ids) or 1)
    avatar_by_id = {p["userId"]: p.get("avatar_url") for p in profiles}

    return [
        {
            "id": str(d["_id"]), "name": d.get("name", ""), "email": d.get("email", ""),
            "avatar": avatar_by_id.get(str(d["_id"])),
            "isSelf": str(d["_id"]) == admin["id"],
            "online": manager.is_online(str(d["_id"])),
            "lastActiveAt": d.get("lastActiveAt").isoformat() if d.get("lastActiveAt") else None,
        }
        for d in docs
    ]


@router.get("/search")
async def search_messages(q: str, user=Depends(current_user)):
    """Global search — every user's own chats only, same visibility rule as
    list_conversations (never searches a chat they aren't a participant
    in)."""
    q = q.strip()
    if not q:
        return []

    if _is_admin(user):
        chat_docs = await col_admin_chats().find(
            {"$or": [{"adminId": user["id"]}, {"userId": user["id"]}, {"participantIds": user["id"]}]}
        ).to_list(200)
    else:
        chat_docs = await col_admin_chats().find(
            {"$or": [{"userId": user["id"]}, {"participantIds": user["id"]}]}
        ).to_list(200)
    if not chat_docs:
        return []
    chats_by_id = {str(d["_id"]): d for d in chat_docs}

    docs = await col_admin_chat_messages().find(
        {"chatId": {"$in": list(chats_by_id.keys())}, "html": {"$regex": re.escape(q), "$options": "i"}}
    ).sort("createdAt", -1).to_list(50)

    results = []
    for d in docs:
        chat = chats_by_id[d["chatId"]]
        if chat.get("type") == "group":
            chat_name = chat.get("groupName", "Group Chat")
        else:
            i_started_it = chat["adminId"] == user["id"]
            chat_name = chat["userName"] if i_started_it else chat["adminName"]
        results.append({
            "chatId": d["chatId"],
            "chatType": chat.get("type", "dm"),
            "chatName": chat_name,
            "messageId": str(d["_id"]),
            "senderName": d.get("senderName", "Unknown"),
            "snippet": _strip_html(d.get("html", ""))[:100],
            "createdAt": d["createdAt"].isoformat() if d.get("createdAt") else None,
        })
    return results


# ── Messages ─────────────────────────────────────────────────────────────────

async def _mark_delivered_and_read(chat: dict, chat_id: str, user: dict) -> list[str]:
    """Marks every message in the chat not sent by `user` as delivered+read
    for them, and notifies the chat's other participants over WS so their
    sent-message ticks update live instead of only refreshing the next time
    they happen to reopen the chat. Returns the ids newly marked (empty if
    nothing changed).

    Matches on readBy OR deliveredTo missing (not just readBy) — messages
    that got readBy set before deliveredTo tracking existed would otherwise
    be permanently stuck: a filter on readBy alone excludes anything already
    marked read, so a doc missing only deliveredTo could never self-heal on
    a later fetch."""
    stale_docs = await col_admin_chat_messages().find(
        {
            "chatId": chat_id,
            "senderId": {"$ne": user["id"]},
            "$or": [{"readBy": {"$ne": user["id"]}}, {"deliveredTo": {"$ne": user["id"]}}],
        }
    ).to_list(500)
    if not stale_docs:
        return []
    await col_admin_chat_messages().update_many(
        {
            "chatId": chat_id,
            "senderId": {"$ne": user["id"]},
            "$or": [{"readBy": {"$ne": user["id"]}}, {"deliveredTo": {"$ne": user["id"]}}],
        },
        {"$addToSet": {"readBy": user["id"], "deliveredTo": user["id"]}},
    )
    message_ids = [str(d["_id"]) for d in stale_docs]
    # Carries the fresh per-message counts in the broadcast itself so the
    # sender's client can patch its local state directly instead of firing a
    # REST refetch just to learn what changed.
    updated_docs = await col_admin_chat_messages().find({"_id": {"$in": [oid(i) for i in message_ids]}}).to_list(500)
    statuses = {
        str(d["_id"]): _recipient_status(d, _other_participant_ids(chat, d["senderId"]))
        for d in updated_docs
    }
    await manager.broadcast_to_many(
        _other_participant_ids(chat, user["id"]),
        {"type": "read_receipt", "chatId": chat_id, "readerId": user["id"], "messageIds": message_ids, "statuses": statuses},
    )
    return message_ids


@router.get("/{chat_id}/messages")
async def get_messages(chat_id: str, user=Depends(current_user)):
    chat = await _get_chat_or_403(chat_id, user)
    docs = await col_admin_chat_messages().find({"chatId": chat_id}).sort("createdAt", 1).to_list(500)
    await _mark_delivered_and_read(chat, chat_id, user)
    window_minutes = await _get_edit_window_minutes()
    result = []
    for d in docs:
        can_edit = d["senderId"] == user["id"] and _can_edit_message(d, window_minutes)
        msg_other_ids = _other_participant_ids(chat, d["senderId"])
        result.append({**sid(d), "canEdit": can_edit, **_recipient_status(d, msg_other_ids)})
    return result


@router.post("/{chat_id}/read")
async def mark_read(chat_id: str, user=Depends(current_user)):
    """Lightweight version of get_messages()'s read-marking side effect, for
    when the chat is already open and a new message arrives live over WS —
    marking it read without re-fetching the full (possibly 500-message)
    history just to flip one flag."""
    chat = await _get_chat_or_403(chat_id, user)
    marked = await _mark_delivered_and_read(chat, chat_id, user)
    return {"markedCount": len(marked)}


MAX_IMAGES_PER_MESSAGE = 6


def _preview_text(html: str, image_count: int) -> str:
    # A Quill code-block message's stripped text IS the raw code, which read
    # as garbage in the conversation list ("import { usePathname } from...")
    # instead of a clean summary — same problem images already had, so this
    # gets the same special-cased treatment ("📷 Image") rather than dumping
    # its literal content.
    if "<pre" in (html or ""):
        return "💻 Code snippet"
    text = _strip_html(html)
    if text:
        return text[:80]
    if image_count > 1:
        return f"📷 {image_count} Images"
    return "📷 Image"


class SendMessageBody(BaseModel):
    html: str = ""
    imageUrls: List[str] = []


@router.post("/{chat_id}/messages")
async def send_message(chat_id: str, body: SendMessageBody, user=Depends(current_user)):
    chat = await _get_chat_or_403(chat_id, user)
    text = _strip_html(body.html)
    if not text and not body.imageUrls:
        raise HTTPException(400, "Message cannot be empty")
    if len(body.html) > 10000:
        raise HTTPException(400, "Message too long")
    if len(body.imageUrls) > MAX_IMAGES_PER_MESSAGE:
        raise HTTPException(400, f"Up to {MAX_IMAGES_PER_MESSAGE} images per message")

    msg_doc = {
        "chatId": chat_id,
        "senderId": user["id"],
        "senderName": user.get("name", "Unknown"),
        "html": body.html,
        "imageUrls": body.imageUrls,
        "createdAt": now(),
        "readBy": [user["id"]],
        "deliveredTo": [],
    }
    result = await col_admin_chat_messages().insert_one(msg_doc)

    other_ids = _other_participant_ids(chat, user["id"])
    # Anyone already connected right now got the WS push instantly below —
    # that IS delivery, no need to wait for them to separately fetch it.
    online_recipient_ids = [uid for uid in other_ids if manager.is_online(uid)]
    if online_recipient_ids:
        await col_admin_chat_messages().update_one(
            {"_id": result.inserted_id},
            {"$addToSet": {"deliveredTo": {"$each": online_recipient_ids}}},
        )

    created = sid(await col_admin_chat_messages().find_one({"_id": result.inserted_id}))
    created["canEdit"] = True  # just sent — obviously still within the edit window
    created.update(_recipient_status(created, other_ids))

    preview = _preview_text(body.html, len(body.imageUrls))
    await col_admin_chats().update_one(
        {"_id": oid(chat_id)},
        {"$set": {"lastMessageAt": now(), "lastMessagePreview": preview}},
    )

    # WS echo goes out to everyone including a self-chat's own id (that's
    # what keeps a second open tab of your own "notes to myself" in sync).
    # Push + in-app notifications are a different story: never page the
    # sender's own devices, whether that's a DM self-chat or — impossible
    # by construction for groups, but kept explicit — themselves in a group.
    await manager.broadcast_to_many(other_ids, {"type": "new_message", "chatId": chat_id, "message": created})

    # Muting only silences push/in-app notifications for whoever muted it —
    # the live WS delivery above already went out to everyone regardless, so
    # a muted chat still updates instantly if you have it open, it just
    # doesn't ping you when you don't.
    muted_by = set(chat.get("mutedBy", []))
    notify_ids = [i for i in other_ids if i != user["id"] and i not in muted_by]
    if notify_ids:
        is_group = chat.get("type") == "group"
        title = (
            f"💬 {user.get('name', 'Someone')} sent a message in {chat.get('groupName', 'a group')}"
            if is_group else f"💬 {user.get('name', 'Someone')} sent you a message"
        )
        # Deep-links straight to the conversation and the exact message,
        # instead of just the bare /messages list — mirrors the ?userId=
        # deep link Admin Feedback already uses to jump into a specific chat.
        deep_link = f"/messages?chatId={chat_id}&messageId={created['id']}"
        await col_user_notifications().insert_many([
            {
                "userId": nid, "title": title, "body": preview, "type": "admin_chat",
                "path": deep_link, "read": False, "createdAt": now(),
            }
            for nid in notify_ids
        ])
        # Batched — one query + one send_to_tokens call for the whole group,
        # not one per recipient (same pattern as tasks.py's create_task).
        token_docs = await col_fcm_tokens().find({"userId": {"$in": notify_ids}}).to_list(length=len(notify_ids) * 5 or 1)
        tokens = list({t["token"] for t in token_docs})
        if tokens:
            await send_to_tokens(tokens, title=title, body=preview, data={"type": "admin_chat", "path": deep_link})

    return created


class EditMessageBody(BaseModel):
    html: str
    imageUrls: List[str] = []


@router.patch("/{chat_id}/messages/{message_id}")
async def edit_message(chat_id: str, message_id: str, body: EditMessageBody, user=Depends(current_user)):
    chat = await _get_chat_or_403(chat_id, user)
    msg = await col_admin_chat_messages().find_one({"_id": oid(message_id), "chatId": chat_id})
    if not msg:
        raise HTTPException(404, "Message not found")
    if msg["senderId"] != user["id"]:
        raise HTTPException(403, "Not your message")

    window_minutes = await _get_edit_window_minutes()
    if not _can_edit_message(msg, window_minutes):
        raise HTTPException(400, f"Edit window ({window_minutes} min) has expired")

    text = _strip_html(body.html)
    # Validated against the NEW submitted imageUrls, not the message's old
    # ones — removing every image and leaving no text must still be treated
    # as an empty message, not silently allowed because the OLD doc had one.
    if not text and not body.imageUrls:
        raise HTTPException(400, "Message cannot be empty")
    if len(body.html) > 10000:
        raise HTTPException(400, "Message too long")
    if len(body.imageUrls) > MAX_IMAGES_PER_MESSAGE:
        raise HTTPException(400, f"Up to {MAX_IMAGES_PER_MESSAGE} images per message")

    await col_admin_chat_messages().update_one(
        {"_id": oid(message_id)},
        {"$set": {"html": body.html, "imageUrls": body.imageUrls, "editedAt": now()}},
    )
    updated = sid(await col_admin_chat_messages().find_one({"_id": oid(message_id)}))
    updated["canEdit"] = _can_edit_message(updated, window_minutes)
    updated.update(_recipient_status(updated, _other_participant_ids(chat, user["id"])))

    # Keep the conversation-list preview in sync, but only if this was the
    # most recent message — editing an older message shouldn't make the list
    # show a summary of something other than the actual latest message.
    latest = await col_admin_chat_messages().find({"chatId": chat_id}).sort("createdAt", -1).to_list(1)
    if latest and str(latest[0]["_id"]) == message_id:
        preview = _preview_text(body.html, len(body.imageUrls))
        await col_admin_chats().update_one({"_id": oid(chat_id)}, {"$set": {"lastMessagePreview": preview}})

    await manager.broadcast_to_many(
        _other_participant_ids(chat, user["id"]), {"type": "edit_message", "chatId": chat_id, "message": updated},
    )

    return updated


MAX_PINNED_PER_CHAT = 5


@router.post("/{chat_id}/messages/{message_id}/pin")
async def pin_message(chat_id: str, message_id: str, user=Depends(current_user)):
    chat = await _get_chat_or_403(chat_id, user)
    msg = await col_admin_chat_messages().find_one({"_id": oid(message_id), "chatId": chat_id})
    if not msg:
        raise HTTPException(404, "Message not found")

    pinned = chat.get("pinnedMessageIds", [])
    if message_id in pinned:
        return {"pinnedMessageIds": pinned}
    if len(pinned) >= MAX_PINNED_PER_CHAT:
        raise HTTPException(400, f"Up to {MAX_PINNED_PER_CHAT} pinned messages per chat — unpin one first")

    await col_admin_chats().update_one({"_id": oid(chat_id)}, {"$addToSet": {"pinnedMessageIds": message_id}})
    updated_ids = pinned + [message_id]

    await manager.broadcast_to_many(
        _other_participant_ids(chat, user["id"]), {"type": "pin_message", "chatId": chat_id, "messageId": message_id},
    )
    return {"pinnedMessageIds": updated_ids}


@router.delete("/{chat_id}/messages/{message_id}/pin")
async def unpin_message(chat_id: str, message_id: str, user=Depends(current_user)):
    chat = await _get_chat_or_403(chat_id, user)

    await col_admin_chats().update_one({"_id": oid(chat_id)}, {"$pull": {"pinnedMessageIds": message_id}})
    updated_ids = [i for i in chat.get("pinnedMessageIds", []) if i != message_id]

    await manager.broadcast_to_many(
        _other_participant_ids(chat, user["id"]), {"type": "unpin_message", "chatId": chat_id, "messageId": message_id},
    )
    return {"pinnedMessageIds": updated_ids}


@router.post("/{chat_id}/mute")
async def mute_chat(chat_id: str, user=Depends(current_user)):
    """Purely per-user, unlike pin — muting only affects what push/in-app
    notifications the caller themselves gets (see send_message's notify_ids
    filtering), so no broadcast to other participants is needed here."""
    await _get_chat_or_403(chat_id, user)
    await col_admin_chats().update_one({"_id": oid(chat_id)}, {"$addToSet": {"mutedBy": user["id"]}})
    return {"muted": True}


@router.delete("/{chat_id}/mute")
async def unmute_chat(chat_id: str, user=Depends(current_user)):
    await _get_chat_or_403(chat_id, user)
    await col_admin_chats().update_one({"_id": oid(chat_id)}, {"$pull": {"mutedBy": user["id"]}})
    return {"muted": False}


SUMMARIZE_SYSTEM_PROMPT = (
    "Summarize the following chat message in 1-2 short, plain sentences that capture "
    "its key point(s). Return ONLY the summary — no preamble, no quotes around it."
)
MIN_SUMMARIZE_WORDS = 25  # short messages don't need summarizing — not worth an AI call


@router.post("/{chat_id}/messages/{message_id}/summarize")
async def summarize_message(chat_id: str, message_id: str, user=Depends(require_ai_enabled)):
    chat = await _get_chat_or_403(chat_id, user)
    msg = await col_admin_chat_messages().find_one({"_id": oid(message_id), "chatId": chat_id})
    if not msg:
        raise HTTPException(404, "Message not found")
    text = _strip_html(msg.get("html", ""))
    if len(text.split()) < MIN_SUMMARIZE_WORDS:
        raise HTTPException(400, "Message is too short to summarize")
    summary = await _groq_ask(text, system_prompt=SUMMARIZE_SYSTEM_PROMPT, max_tokens=150)
    return {"summary": summary}
