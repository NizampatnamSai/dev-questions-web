from fastapi import Header, HTTPException, status
from jose import JWTError
from auth_utils import decode_token
from db_mongo import col_users, oid, sid


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
    if doc.get("status") == "disabled":
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Account disabled")
    return sid(doc)
