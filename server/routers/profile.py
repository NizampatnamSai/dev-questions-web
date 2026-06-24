from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from pydantic import BaseModel
from db_mongo import col_users, col_user_profiles, sid, oid, now
from deps import current_user
import os
from datetime import datetime

router = APIRouter()


class ProfileUpdate(BaseModel):
    name: str = None
    bio: str = None
    avatar_url: str = None
    social_links: dict = None
    website: str = None
    location: str = None


class UserProfileResponse(BaseModel):
    id: str
    name: str
    email: str
    role: str
    bio: str = ""
    avatar_url: str = None
    social_links: dict = {}
    website: str = None
    location: str = None
    level: int = 1
    points: int = 0
    badges: list = []
    createdAt: str
    stats: dict = {}


@router.get("/my/profile")
async def get_my_profile(user=Depends(current_user)):
    """Get current user's profile"""
    profile = await col_user_profiles().find_one({"userId": user["id"]}) or {}

    return {
        "id": user["id"],
        "name": user.get("name", ""),
        "email": user.get("email", ""),
        "role": user.get("role", "user"),
        "bio": profile.get("bio", ""),
        "avatar_url": profile.get("avatar_url"),
        "social_links": profile.get("social_links", {}),
        "website": profile.get("website"),
        "location": profile.get("location"),
        "level": profile.get("level", 1),
        "points": profile.get("points", 0),
        "badges": profile.get("badges", []),
        "createdAt": user.get("createdAt", ""),
        "stats": profile.get("stats", {}),
    }


@router.patch("/my/profile")
async def update_profile(body: ProfileUpdate, user=Depends(current_user)):
    """Update user profile"""
    update_data = {}
    if body.name:
        update_data["name"] = body.name
        await col_users().update_one({"_id": oid(user["id"])}, {"$set": {"name": body.name}})
    if body.bio is not None:
        update_data["bio"] = body.bio
    if body.avatar_url is not None:
        update_data["avatar_url"] = body.avatar_url
    if body.social_links is not None:
        update_data["social_links"] = body.social_links
    if body.website is not None:
        update_data["website"] = body.website
    if body.location is not None:
        update_data["location"] = body.location

    if update_data:
        await col_user_profiles().update_one(
            {"userId": user["id"]},
            {"$set": {**update_data, "updatedAt": now()}},
            upsert=True
        )

    return {"message": "Profile updated", **update_data}


@router.post("/my/change-password")
async def change_password(body: dict, user=Depends(current_user)):
    """Change user password"""
    from utils.auth import hash_password, verify_password

    old_password = body.get("old_password")
    new_password = body.get("new_password")

    if not old_password or not new_password:
        raise HTTPException(400, "Old and new passwords required")

    user_doc = await col_users().find_one({"_id": oid(user["id"])})
    if not verify_password(old_password, user_doc["password"]):
        raise HTTPException(401, "Old password incorrect")

    if len(new_password) < 6:
        raise HTTPException(400, "Password must be at least 6 characters")

    await col_users().update_one(
        {"_id": oid(user["id"])},
        {"$set": {"password": hash_password(new_password)}}
    )

    return {"message": "Password changed successfully"}


@router.get("/leaderboard")
async def leaderboard(limit: int = 50, offset: int = 0):
    """Get user leaderboard by points"""
    profiles = await col_user_profiles().find({}).sort("points", -1).skip(offset).limit(limit).to_list(limit)

    result = []
    for i, profile in enumerate(profiles, 1):
        user = await col_users().find_one({"_id": oid(profile["userId"])})
        if user:
            result.append({
                "rank": i + offset,
                "name": user.get("name"),
                "points": profile.get("points", 0),
                "level": profile.get("level", 1),
                "badges_count": len(profile.get("badges", [])),
                "avatar_url": profile.get("avatar_url"),
            })

    return result


@router.get("/{user_id}")
async def get_user_profile(user_id: str):
    """Get public user profile"""
    user = await col_users().find_one({"_id": oid(user_id)})
    if not user:
        raise HTTPException(404, "User not found")

    profile = await col_user_profiles().find_one({"userId": user_id}) or {}

    return {
        "id": str(user["_id"]),
        "name": user.get("name", ""),
        "email": user.get("email", ""),
        "role": user.get("role", "user"),
        "bio": profile.get("bio", ""),
        "avatar_url": profile.get("avatar_url"),
        "social_links": profile.get("social_links", {}),
        "website": profile.get("website"),
        "location": profile.get("location"),
        "level": profile.get("level", 1),
        "points": profile.get("points", 0),
        "badges": profile.get("badges", []),
        "createdAt": user.get("createdAt", ""),
        "stats": profile.get("stats", {}),
    }
