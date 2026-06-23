from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from db_mongo import col_question_ratings, col_questions, sid, oid, now
from deps import current_user

router = APIRouter()


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

    # Update question average difficulty
    ratings = await col_question_ratings().find({"questionId": question_id}).to_list(None)
    avg_difficulty = sum(r.get("difficulty", 3) for r in ratings) / len(ratings) if ratings else 3

    await col_questions().update_one(
        {"_id": oid(question_id)},
        {"$set": {"avgDifficulty": round(avg_difficulty, 2), "ratingCount": len(ratings)}}
    )

    return {"message": "Rating saved", "avgDifficulty": round(avg_difficulty, 2), "ratingCount": len(ratings)}


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
    ratings = await col_question_ratings().find({"questionId": question_id}).to_list(None)

    if not ratings:
        return {"avgDifficulty": 3, "totalRatings": 0, "distribution": {}}

    avg = sum(r.get("difficulty", 3) for r in ratings) / len(ratings)
    distribution = {}
    for i in range(1, 6):
        distribution[str(i)] = sum(1 for r in ratings if r.get("difficulty") == i)

    return {
        "avgDifficulty": round(avg, 2),
        "totalRatings": len(ratings),
        "distribution": distribution
    }
