"""
Video meetings — free, no external account needed, embeds Jitsi Meet's public
server (meet.jit.si) rather than a paid SDK (Zoom/Agora/Twilio all require
billing past small free tiers). Only admins can create/schedule a meeting and
choose who's invited; invited users get a notification with a join link.
"""
import secrets
from datetime import datetime
from typing import Optional
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from db_mongo import col_meetings, col_users, col_fcm_tokens, col_notifications, col_user_notifications, oid, sid, now
from deps import current_user, optional_user
from utils.firebase import send_to_tokens

router = APIRouter()

CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"  # no 0/O/1/I — easy to read aloud/type


def _gen_join_code() -> str:
    return "".join(secrets.choice(CODE_ALPHABET) for _ in range(6))


def _require_admin(user=Depends(current_user)):
    if user.get("role") not in ("admin", "sub_admin"):
        raise HTTPException(403, "Admin only")
    return user


def _fmt(doc: dict) -> dict:
    d = sid(doc)
    for k in ("scheduledAt", "createdAt", "endedAt"):
        if isinstance(d.get(k), datetime):
            d[k] = d[k].isoformat()
    return d


class CreateMeetingBody(BaseModel):
    title: str
    scheduledAt: Optional[str] = None  # ISO timestamp; omit/None = starts immediately
    invitedUserIds: list[str] = []


@router.post("")
async def create_meeting(body: CreateMeetingBody, admin=Depends(_require_admin)):
    if not body.title.strip():
        raise HTTPException(400, "Title is required")
    scheduled_at = None
    if body.scheduledAt:
        try:
            scheduled_at = datetime.fromisoformat(body.scheduledAt.replace("Z", "+00:00"))
        except ValueError:
            raise HTTPException(400, "scheduledAt must be a valid ISO timestamp")

    room_name = f"devquiz-{secrets.token_hex(6)}"
    doc = {
        "title": body.title.strip(),
        "roomName": room_name,
        "joinCode": _gen_join_code(),  # lets anyone with the code join, even guests not on the invite list
        "scheduledAt": scheduled_at,
        "invitedUserIds": body.invitedUserIds,
        "createdBy": admin["id"],
        "createdByName": admin.get("name", "Admin"),
        "status": "scheduled" if scheduled_at else "live",
        "createdAt": now(),
        "endedAt": None,
    }
    result = await col_meetings().insert_one(doc)
    meeting = _fmt({**doc, "_id": result.inserted_id})

    # Notify invited users
    if body.invitedUserIds:
        when_text = f"scheduled for {scheduled_at.strftime('%d %b, %H:%M UTC')}" if scheduled_at else "starting now"
        notif_title = "📹 Video Meeting Invite"
        notif_body = f"{admin.get('name','Admin')} invited you to \"{body.title.strip()}\" — {when_text}."
        ts = now()
        await col_user_notifications().insert_many([
            {"userId": uid, "title": notif_title, "body": notif_body, "type": "meeting_invite",
             "sentBy": admin["id"], "sentByName": admin.get("name", "Admin"), "read": False,
             "createdAt": ts, "data": {"meetingId": meeting["id"], "path": "/meetings"}}
            for uid in body.invitedUserIds
        ])
        tokens_docs = []
        for uid in body.invitedUserIds:
            tokens_docs += await col_fcm_tokens().find({"userId": uid}).to_list(20)
        tokens = list({t["token"] for t in tokens_docs})
        if tokens:
            await send_to_tokens(tokens, notif_title, notif_body, {"type": "meeting_invite", "path": "/meetings"})

    return meeting


@router.get("")
async def list_meetings(user=Depends(current_user)):
    is_admin = user.get("role") in ("admin", "sub_admin")
    query = {} if is_admin else {"invitedUserIds": user["id"]}
    docs = await col_meetings().find(query).sort("createdAt", -1).to_list(200)
    return [_fmt(d) for d in docs]


@router.get("/join/{code}")
async def join_by_code(code: str, _user=Depends(optional_user)):
    """Open to guests too — anyone with the code can join, no invite-list check.
    This is the whole point of the code: a way in for people who were never
    added to invitedUserIds (or have no account at all)."""
    doc = await col_meetings().find_one({"joinCode": code.strip().upper()})
    if not doc:
        raise HTTPException(404, "Invalid code — double check it and try again.")
    if doc.get("status") == "ended":
        raise HTTPException(410, "This meeting has ended.")
    return {"id": str(doc["_id"]), "title": doc["title"], "roomName": doc["roomName"], "status": doc["status"]}


@router.get("/{meeting_id}")
async def get_meeting(meeting_id: str, user=Depends(current_user)):
    doc = await col_meetings().find_one({"_id": oid(meeting_id)})
    if not doc:
        raise HTTPException(404, "Meeting not found")
    is_admin = user.get("role") in ("admin", "sub_admin")
    if not is_admin and user["id"] not in doc.get("invitedUserIds", []):
        raise HTTPException(403, "You're not invited to this meeting")
    if doc.get("status") == "ended":
        raise HTTPException(410, "This meeting has ended")
    return _fmt(doc)


@router.patch("/{meeting_id}/end")
async def end_meeting(meeting_id: str, admin=Depends(_require_admin)):
    doc = await col_meetings().find_one({"_id": oid(meeting_id)})
    if not doc:
        raise HTTPException(404, "Meeting not found")
    await col_meetings().update_one({"_id": oid(meeting_id)}, {"$set": {"status": "ended", "endedAt": now()}})
    return {"message": "Meeting ended"}


@router.delete("/{meeting_id}")
async def delete_meeting(meeting_id: str, admin=Depends(_require_admin)):
    result = await col_meetings().delete_one({"_id": oid(meeting_id)})
    if result.deleted_count == 0:
        raise HTTPException(404, "Meeting not found")
    return {"message": "Deleted"}
