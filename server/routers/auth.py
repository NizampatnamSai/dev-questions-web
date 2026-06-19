from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from db_mongo import col_users, sid, now
from auth_utils import hash_password, verify_password, create_token
from deps import current_user

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
        "dailyLimit": 10,
        "createdAt":  now(),
    })
    doc = await col_users().find_one({"_id": result.inserted_id})
    user = sid(doc)
    return {"token": create_token(user["id"]), "user": _pub(user)}


@router.get("/me")
async def me(user=Depends(current_user)):
    return {"user": _pub(user)}
