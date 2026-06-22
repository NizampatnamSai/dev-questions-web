from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from db_mongo import col_users, col_fcm_tokens, sid, now
from auth_utils import hash_password, verify_password, create_token
from deps import current_user
from utils.firebase import send_to_tokens

router = APIRouter()


def _pub(u: dict) -> dict:
    return {"id": u["id"], "name": u["name"], "email": u["email"], "role": u["role"]}


class LoginBody(BaseModel):
    email: str
    password: str


class RegisterBody(BaseModel):
    name:     str
    email:    str
    password: str


@router.post("/login")
async def login(body: LoginBody):
    doc = await col_users().find_one({"email": body.email.lower().strip()})
    if not doc or not verify_password(body.password, doc["password"]):
        raise HTTPException(401, "Invalid email or password")
    status = doc.get("status", "approved")
    if status == "pending":
        raise HTTPException(403, "Your account is pending admin approval. You'll be notified once approved.")
    if status == "blocked":
        raise HTTPException(403, "Your account has been blocked. Please contact the admin.")
    user = sid(doc)
    return {"token": create_token(user["id"]), "user": _pub(user)}


@router.post("/register")
async def register(body: RegisterBody):
    if len(body.password) < 6:
        raise HTTPException(400, "Password must be at least 6 characters")
    email = body.email.lower().strip()
    if await col_users().find_one({"email": email}):
        raise HTTPException(409, "Email already registered")
    result = await col_users().insert_one({
        "name":       body.name.strip(),
        "email":      email,
        "password":   hash_password(body.password),
        "role":       "user",
        "status":     "pending",
        "dailyLimit": 10,
        "createdAt":  now(),
    })
    # notify all admins via push
    admins = await col_users().find({"role": {"$in": ["admin", "sub_admin"]}}).to_list(50)
    for admin in admins:
        tokens_docs = await col_fcm_tokens().find({"userId": str(admin["_id"])}).to_list(20)
        tokens = [t["token"] for t in tokens_docs]
        if tokens:
            await send_to_tokens(
                tokens,
                title="👤 New User Registration",
                body=f"{body.name.strip()} ({email}) is requesting access.",
                data={"type": "new_registration"},
            )
    return {"pending": True, "message": "Registration submitted. You'll be notified once an admin approves your account."}


@router.get("/me")
async def me(user=Depends(current_user)):
    return {"user": _pub(user)}
