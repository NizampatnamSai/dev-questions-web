from fastapi import APIRouter, Depends, HTTPException
from db_mongo import col_user_profiles, col_users, sid, oid, now
from deps import current_user

router = APIRouter()

BADGES = {
    "first_post": {"name": "First Post", "icon": "📝", "description": "Posted your first question"},
    "first_answer": {"name": "First Answer", "icon": "✍️", "description": "Posted your first answer"},
    "community_star": {"name": "Community Star", "icon": "⭐", "description": "Got 10 upvotes"},
    "knowledge_seeker": {"name": "Knowledge Seeker", "icon": "📚", "description": "Read 25 different questions"},
    "helpful": {"name": "Helpful", "icon": "🤝", "description": "Had 5 answers marked helpful"},
    "streak_week": {"name": "Weekly Streak", "icon": "🔥", "description": "Logged in 7 days in a row"},
    "streak_month": {"name": "Monthly Streak", "icon": "🔥🔥", "description": "Logged in 30 days in a row"},
    "level_5": {"name": "Level 5", "icon": "🎯", "description": "Reached level 5"},
    "level_10": {"name": "Level 10", "icon": "🏆", "description": "Reached level 10"},
    "speed_typist": {"name": "Speed Typist", "icon": "⌨️", "description": "Completed all 3 Typing Race snippets in one day"},
    "sudoku_solver": {"name": "Sudoku Solver", "icon": "🧩", "description": "Solved your first Mini Sudoku"},
}

POINTS_MAP = {
    "question_posted": 50,
    "answer_posted": 30,
    "upvote_received": 10,
    "comment_posted": 5,
    "daily_login": 20,
    "typing_race_snippet": 15,
    "sudoku_solved": 15,
}


def get_level_from_points(points: int) -> int:
    """Calculate user level based on points"""
    return max(1, min(20, (points // 100) + 1))


@router.get("/profile/badges")
async def get_badges(user=Depends(current_user)):
    """Get user's badges"""
    profile = await col_user_profiles().find_one({"userId": user["id"]}) or {}
    badges = profile.get("badges", [])

    return {
        "badges": badges,
        "total": len(badges),
        "available": list(BADGES.keys()),
    }


@router.get("/profile/my/stats")
async def get_user_stats(user=Depends(current_user)):
    """Get user stats and progress"""
    profile = await col_user_profiles().find_one({"userId": user["id"]}) or {}

    points = profile.get("points", 0)
    level = get_level_from_points(points)
    badges = profile.get("badges", [])
    streak = profile.get("streak", 0)

    # Points to next level
    current_level_points = (level - 1) * 100
    next_level_points = level * 100
    progress = ((points - current_level_points) / 100) * 100

    return {
        "level": level,
        "points": points,
        "progress": round(min(100, progress)),
        "nextLevelPoints": next_level_points,
        "badges": len(badges),
        "streak": streak,
        "stats": profile.get("stats", {}),
    }


async def award_points(user_id: str, points: int) -> dict:
    """Shared points-awarding logic — used by POST /profile/add-points/{action}
    below, and called directly (no HTTP round-trip) by other routers that
    want to grant points, e.g. Typing Race and Mini Sudoku on a win."""
    profile = await col_user_profiles().find_one({"userId": user_id}) or {}

    old_level = get_level_from_points(profile.get("points", 0))
    new_points = profile.get("points", 0) + points
    new_level = get_level_from_points(new_points)

    # Check for level up badge
    badges = profile.get("badges", [])
    if new_level != old_level:
        if new_level == 5 and "level_5" not in badges:
            badges.append("level_5")
        elif new_level == 10 and "level_10" not in badges:
            badges.append("level_10")

    await col_user_profiles().update_one(
        {"userId": user_id},
        {"$set": {
            "points": new_points,
            "badges": badges,
            "updatedAt": now(),
        }},
        upsert=True
    )

    return {"points": new_points, "level": new_level, "leveledUp": new_level != old_level}


async def award_badge(user_id: str, badge_id: str) -> bool:
    """Shared badge-awarding logic — returns True if the badge was newly
    awarded (False if the user already had it), used by callers that want
    to know whether to show a "New badge!" toast."""
    profile = await col_user_profiles().find_one({"userId": user_id}) or {}
    badges = profile.get("badges", [])
    if badge_id in badges:
        return False
    badges.append(badge_id)
    await col_user_profiles().update_one(
        {"userId": user_id},
        {"$set": {"badges": badges, "updatedAt": now()}},
        upsert=True,
    )
    return True


@router.post("/profile/add-points/{action}")
async def add_points(action: str, user=Depends(current_user)):
    """Add points for actions (internal use)"""
    if action not in POINTS_MAP:
        raise HTTPException(400, "Invalid action")
    return await award_points(user["id"], POINTS_MAP[action])


@router.post("/profile/add-badge/{target_user_id}/{badge_id}")
async def add_badge(target_user_id: str, badge_id: str, admin=Depends(current_user)):
    """Admin-only: award a badge to a specific user. Was previously reachable
    by any logged-in user to self-award any badge (no role check + always
    targeted the caller's own profile) — now requires admin and takes an
    explicit target so it actually matches its own docstring intent."""
    if admin.get("role") not in ("admin", "sub_admin"):
        raise HTTPException(403, "Admin only")
    if badge_id not in BADGES:
        raise HTTPException(400, "Invalid badge")

    profile = await col_user_profiles().find_one({"userId": target_user_id}) or {}
    badges = profile.get("badges", [])

    if badge_id not in badges:
        badges.append(badge_id)
        await col_user_profiles().update_one(
            {"userId": target_user_id},
            {"$set": {"badges": badges, "updatedAt": now()}},
            upsert=True
        )
        return {"message": f"Badge '{BADGES[badge_id]['name']}' awarded!", "badge": badge_id}

    return {"message": "Badge already owned"}


@router.get("/leaderboard/badges")
async def badges_leaderboard():
    """Get leaderboard of users with most badges"""
    profiles = await col_user_profiles().find({}).sort("badges", -1).limit(50).to_list(50)

    result = []
    for profile in profiles:
        user = await col_users().find_one({"_id": oid(profile["userId"])})
        if user:
            result.append({
                "name": user.get("name"),
                "badges_count": len(profile.get("badges", [])),
                "level": profile.get("level", 1),
                "points": profile.get("points", 0),
            })

    return result
