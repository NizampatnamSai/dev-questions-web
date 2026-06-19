import os
from fastapi import Header, HTTPException, status
from jose import JWTError, jwt
from db import get_db

JWT_SECRET = os.getenv("JWT_SECRET", "devquiz_super_secret_change_me")
ALGORITHM = "HS256"

def get_current_user(authorization: str = Header(default="")):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Not authenticated",
    )
    if not authorization.startswith("Bearer "):
        raise credentials_exception
    token = authorization[7:]
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[ALGORITHM])
        user_id: int = payload.get("id")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    conn = get_db()
    user = conn.execute("SELECT * FROM users WHERE id = ?", (user_id,)).fetchone()
    conn.close()
    if not user:
        raise credentials_exception
    return dict(user)

def require_admin(current_user: dict):
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin only")
