from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from db_mongo import col_question_ratings, col_questions, sid, oid, now
from deps import current_user

router = APIRouter()


async def _difficulty_agg(question_id: str) -> dict:
    """Server-side aggregation for a question's ratings — avoids pulling every
    rating document into Python just to sum/count them, which got slower
    forever as a popular question accumulated more ratings (unbounded
    .to_list(None) previously)."""
    pipeline = [
        {"$match": {"questionId": question_id}},
        {"$group": {
            "_id": None,
            "avg": {"$avg": "$difficulty"},
            "count": {"$sum": 1},
            "d1": {"$sum": {"$cond": [{"$eq": ["$difficulty", 1]}, 1, 0]}},
            "d2": {"$sum": {"$cond": [{"$eq": ["$difficulty", 2]}, 1, 0]}},
            "d3": {"$sum": {"$cond": [{"$eq": ["$difficulty", 3]}, 1, 0]}},
            "d4": {"$sum": {"$cond": [{"$eq": ["$difficulty", 4]}, 1, 0]}},
            "d5": {"$sum": {"$cond": [{"$eq": ["$difficulty", 5]}, 1, 0]}},
        }},
    ]
    rows = await col_question_ratings().aggregate(pipeline).to_list(1)
    if not rows:
        return {"avg": 3, "count": 0, "distribution": {}}
    r = rows[0]
    return {
        "avg": r["avg"],
        "count": r["count"],
        "distribution": {"1": r["d1"], "2": r["d2"], "3": r["d3"], "4": r["d4"], "5": r["d5"]},
    }


class DifficultyRating(BaseModel):
    question_id: str
    difficulty: int  # 1-5 scale
    time_taken: int = None  # in minutes


@router.post("/questions/{question_id}/difficulty")
async def rate_difficulty(question_id: str, body: DifficultyRating, user=Depends(current_user)):
    """Rate the difficulty of a question"""
    question = await col_questions().find_one({"_id": oid(question_id)})
    if not question:
        raise HTTPException(404, "Question not found")

    if not (1 <= body.difficulty <= 5):
        raise HTTPException(400, "Difficulty must be between 1 and 5")

    # Check if user already rated this
    existing = await col_question_ratings().find_one({
        "questionId": question_id,
        "userId": user["id"]
    })

    rating_doc = {
        "questionId": question_id,
        "userId": user["id"],
        "difficulty": body.difficulty,
        "time_taken": body.time_taken,
        "createdAt": now() if not existing else existing.get("createdAt", now()),
        "updatedAt": now(),
    }

    if existing:
        await col_question_ratings().update_one(
            {"_id": oid(existing["_id"])},
            {"$set": rating_doc}
        )
    else:
        await col_question_ratings().insert_one(rating_doc)

    # Update question average difficulty — aggregated server-side instead of
    # pulling every rating doc into Python.
    agg = await _difficulty_agg(question_id)
    avg_difficulty = agg["avg"] if agg["count"] else 3
    rating_count = agg["count"]

    await col_questions().update_one(
        {"_id": oid(question_id)},
        {"$set": {"avgDifficulty": round(avg_difficulty, 2), "ratingCount": rating_count}}
    )

    return {"message": "Rating saved", "avgDifficulty": round(avg_difficulty, 2), "ratingCount": rating_count}


@router.get("/questions/{question_id}/difficulty")
async def get_difficulty(question_id: str, user=Depends(current_user)):
    """Get user's difficulty rating for a question"""
    rating = await col_question_ratings().find_one({
        "questionId": question_id,
        "userId": user["id"]
    })

    if not rating:
        return {"difficulty": None, "time_taken": None}

    return {"difficulty": rating.get("difficulty"), "time_taken": rating.get("time_taken")}


@router.get("/questions/difficulty/stats/{question_id}")
async def get_difficulty_stats(question_id: str):
    """Get difficulty statistics for a question"""
    agg = await _difficulty_agg(question_id)
    if not agg["count"]:
        return {"avgDifficulty": 3, "totalRatings": 0, "distribution": {}}

    return {
        "avgDifficulty": round(agg["avg"], 2),
        "totalRatings": agg["count"],
        "distribution": agg["distribution"],
    }
