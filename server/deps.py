from datetime import datetime, timezone
from fastapi import Depends, Header, HTTPException, status
from jose import JWTError
from auth_utils import decode_token
from db_mongo import col_users, oid, sid


def is_locked_out(doc: dict) -> bool:
    """True for a permanent admin-disable, an active scheduled disable
    (disabledUntil in the future — locked NOW, auto-restores once it
    passes), or a reached auto-disable point (autoDisableAt in the past —
    opposite direction: works fine until then, then locks and STAYS locked,
    no auto-restore, since the intent is 'shut this off going forward')."""
    if doc.get("status") == "disabled":
        return True
    until = doc.get("disabledUntil")
    if until:
        if until.tzinfo is None:
            until = until.replace(tzinfo=timezone.utc)
        if until > datetime.now(timezone.utc):
            return True
    auto_disable_at = doc.get("autoDisableAt")
    if auto_disable_at:
        if auto_disable_at.tzinfo is None:
            auto_disable_at = auto_disable_at.replace(tzinfo=timezone.utc)
        if datetime.now(timezone.utc) >= auto_disable_at:
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


async def guest_gate(user: dict | None = Depends(optional_user)) -> dict | None:
    """Drop-in replacement for Depends(optional_user) on endpoints guests are
    allowed to hit (Dashboard, Community, ...) — once the admin turns Guest
    Mode off, unauthenticated requests to these endpoints get rejected too,
    not just blocked by the frontend's own routing. Frontend-only enforcement
    left a real gap: a guest tab that was already open before the toggle
    flipped kept getting real data back from these APIs with no server-side
    check at all, until the tab happened to refresh its cached config."""
    if user is None:
        from db_mongo import col_app_config
        doc = await col_app_config().find_one({"_id": "config"}) or {}
        if not doc.get("guest_mode_enabled", True):
            msg = doc.get("guest_mode_message") or "Guest mode is temporarily disabled by the admin. Please log in or create an account to continue."
            raise HTTPException(status.HTTP_403_FORBIDDEN, msg)
    return user


async def require_ai_enabled(user: dict = Depends(current_user)) -> dict:
    """Drop-in replacement for Depends(current_user) on any AI-backed
    endpoint — blocks regular users when the admin's global AI on/off switch
    is off, while admin/sub_admin can still pass through to test/manage."""
    if user.get("role") not in ("admin", "sub_admin"):
        from db_mongo import col_app_config
        doc = await col_app_config().find_one({"_id": "config"}) or {}
        if not doc.get("ai_features_enabled", True):
            msg = doc.get("ai_features_message") or "AI features are temporarily disabled by the admin."
            raise HTTPException(status.HTTP_403_FORBIDDEN, msg)
    return user
