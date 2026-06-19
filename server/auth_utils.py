import os
import bcrypt
from datetime import datetime, timedelta
from jose import JWTError, jwt

SECRET = os.getenv("JWT_SECRET", "devquiz_super_secret_change_me")
ALGO   = "HS256"


def hash_password(pw: str) -> str:
    return bcrypt.hashpw(pw[:72].encode(), bcrypt.gensalt()).decode()


def verify_password(plain: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(plain[:72].encode(), hashed.encode())
    except Exception:
        return False


def create_token(user_id: str) -> str:
    return jwt.encode(
        {"id": str(user_id), "exp": datetime.utcnow() + timedelta(days=7)},
        SECRET, algorithm=ALGO,
    )


def decode_token(token: str) -> str:
    payload = jwt.decode(token, SECRET, algorithms=[ALGO])
    return str(payload["id"])
