from datetime import datetime, timezone
from fastapi import Header, HTTPException, status
from jose import JWTError
from auth_utils import decode_token
from db_mongo import col_users, oid, sid


def is_locked_out(doc: dict) -> bool:
    """True for a permanent admin-disable OR an active scheduled disable
    (disabledUntil in the future). Once disabledUntil passes, access is
    restored automatically — no admin action needed."""
    if doc.get("status") == "disabled":
        return True
    until = doc.get("disabledUntil")
    if until:
        if until.tzinfo is None:
            until = until.replace(tzinfo=timezone.utc)
        if until > datetime.now(timezone.utc):
            return True
    return False


async def current_user(authorization: str = Header(default="")) -> dict:
    if not authorization.startswith("Bearer "):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Not authenticated")
    try:
        user_id = decode_token(authorization[7:])
    except (JWTError, KeyError, ValueError):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid token")
    doc = await col_users().find_one({"_id": oid(user_id)})
    if not doc:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "User not found")
    if is_locked_out(doc):
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Account disabled")
    return sid(doc)


async def optional_user(authorization: str = Header(default="")) -> dict | None:
    """Like current_user, but returns None instead of raising when there's no
    (or an invalid) token — for endpoints that allow guests, e.g. feedback."""
    if not authorization.startswith("Bearer "):
        return None
    try:
        user_id = decode_token(authorization[7:])
    except (JWTError, KeyError, ValueError):
        return None
    doc = await col_users().find_one({"_id": oid(user_id)})
    if not doc or is_locked_out(doc):
        return None
    return sid(doc)
