from fastapi import APIRouter, Depends
from db_mongo import col_questions, col_comments, col_users, sid
from deps import current_user

router = APIRouter()


@router.get("/dashboard")
async def dashboard():
    total = await col_questions().count_documents({"status": "published"})

    cat_pipe = [
        {"$match": {"status": "published"}},
        {"$group": {"_id": "$category", "count": {"$sum": 1}}},
    ]
    lvl_pipe = [
        {"$match": {"status": "published"}},
        {"$group": {"_id": "$level", "count": {"$sum": 1}}},
    ]
    typ_pipe = [
        {"$match": {"status": "published"}},
        {"$group": {"_id": "$type", "count": {"$sum": 1}}},
    ]

    by_category = [{"category": d["_id"], "count": d["count"]} async for d in col_questions().aggregate(cat_pipe)]
    by_level    = [{"level":    d["_id"], "count": d["count"]} async for d in col_questions().aggregate(lvl_pipe)]
    by_type     = [{"type":     d["_id"], "count": d["count"]} async for d in col_questions().aggregate(typ_pipe)]

    recent_cursor = col_questions().find({"status": "published"}).sort("createdAt", -1).limit(5)
    recent_docs   = await recent_cursor.to_list(length=5)
    recent = [
        {
            "id":        str(d["_id"]),
            "question":  d.get("question"),
            "category":  d.get("category"),
            "level":     d.get("level"),
            "author":    d.get("authorName", "Unknown"),
            "createdAt": d["createdAt"].isoformat() if hasattr(d.get("createdAt"), "isoformat") else str(d.get("createdAt", "")),
        }
        for d in recent_docs
    ]

    return {
        "totalQuestions": total,
        "communityPosts": total,
        "byCategory":     by_category,
        "byLevel":        by_level,
        "byType":         by_type,
        "recent":         recent,
    }


@router.get("/user")
async def user_stats(user=Depends(current_user)):
    uid = user["id"]

    questions_posted = await col_questions().count_documents({"userId": uid})
    bookmarks        = await col_questions().count_documents({"bookmarks": uid})

    upvotes_received_pipe = [
        {"$match": {"userId": uid}},
        {"$project": {"upvoteCount": {"$size": "$upvotes"}}},
        {"$group": {"_id": None, "total": {"$sum": "$upvoteCount"}}},
    ]
    ur_result = [d async for d in col_questions().aggregate(upvotes_received_pipe)]
    upvotes_received = ur_result[0]["total"] if ur_result else 0

    # Leaderboard rank: position among users by upvotes received
    rank_pipe = [
        {"$project": {"userId": 1, "upvoteCount": {"$size": "$upvotes"}}},
        {"$group": {"_id": "$userId", "total": {"$sum": "$upvoteCount"}}},
        {"$sort": {"total": -1}},
    ]
    all_ranks = [d async for d in col_questions().aggregate(rank_pipe)]
    rank = next((i + 1 for i, r in enumerate(all_ranks) if r["_id"] == uid), None)

    return {
        "questionsPosted": questions_posted,
        "upvotesReceived": upvotes_received,
        "bookmarks":       bookmarks,
        "rank":            rank,
    }


@router.get("/leaderboard")
async def leaderboard():
    pipe = [
        {"$project": {"userId": 1, "upvoteCount": {"$size": "$upvotes"}}},
        {"$group": {"_id": "$userId", "upvotesReceived": {"$sum": "$upvoteCount"}, "questionsPosted": {"$sum": 1}}},
        {"$sort": {"upvotesReceived": -1}},
        {"$limit": 20},
    ]
    rows = [d async for d in col_questions().aggregate(pipe)]

    result = []
    for r in rows:
        uid  = r["_id"]
        udoc = await col_users().find_one({"_id": __import__("bson").ObjectId(uid)}) if uid else None
        role = udoc.get("role", "user") if udoc else "user"
        if role in ("admin", "sub_admin"):
            continue
        result.append({
            "id":              uid,
            "name":            udoc["name"] if udoc else "Unknown",
            "upvotesReceived": r["upvotesReceived"],
            "questionsPosted": r["questionsPosted"],
        })
    return result
