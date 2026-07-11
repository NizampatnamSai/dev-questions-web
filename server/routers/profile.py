from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from db_mongo import col_users, col_user_profiles, sid, oid, now
from deps import current_user
import os
from datetime import datetime, timezone, timedelta

NOTIFY_MUTE_DURATIONS = {
    "1d": timedelta(days=1),
    "2d": timedelta(days=2),
    "1w": timedelta(weeks=1),
    "permanent": timedelta(days=365 * 100),
}

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
        "notifyMutedUntil": profile.get("notifyMutedUntil"),
    }


@router.patch("/my/notifications-mute")
async def set_notifications_mute(body: dict, user=Depends(current_user)):
    """Snooze all notifications (push + in-app) for this user. duration is one
    of '1d', '2d', '1w', 'permanent', or 'none' to unmute immediately."""
    duration = body.get("duration")
    if duration == "none":
        await col_user_profiles().update_one(
            {"userId": user["id"]},
            {"$unset": {"notifyMutedUntil": ""}},
            upsert=True,
        )
        return {"notifyMutedUntil": None}

    if duration not in NOTIFY_MUTE_DURATIONS:
        raise HTTPException(400, "duration must be one of: 1d, 2d, 1w, permanent, none")

    muted_until = datetime.now(timezone.utc) + NOTIFY_MUTE_DURATIONS[duration]
    await col_user_profiles().update_one(
        {"userId": user["id"]},
        {"$set": {"notifyMutedUntil": muted_until}},
        upsert=True,
    )
    return {"notifyMutedUntil": muted_until.isoformat()}


@router.post("/my/app-version")
async def report_app_version(body: dict, user=Depends(current_user)):
    """Frontend reports its build version (client/vite.config.js __APP_VERSION__)
    on load, so Admin's Force Update panel can show who's still on an old build."""
    version = body.get("version")
    if not version:
        raise HTTPException(400, "version required")
    await col_user_profiles().update_one(
        {"userId": user["id"]},
        {"$set": {"appVersion": version, "appVersionAt": datetime.now(timezone.utc)}},
        upsert=True,
    )
    return {"ok": True}


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
    from auth_utils import hash_password, verify_password

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
