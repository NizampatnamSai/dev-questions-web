from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from db_mongo import col_challenges, col_users, col_user_profiles, sid, oid, now
from deps import current_user
from datetime import datetime, timedelta

router = APIRouter()


class ChallengeStartRequest(BaseModel):
    category: str
    difficulty: str
    questions_count: int = 5


class ChallengeSubmit(BaseModel):
    question_id: str
    answer: str
    time_taken: int  # seconds


@router.post("/challenges/start")
async def start_timed_challenge(body: ChallengeStartRequest, user=Depends(current_user)):
    """Start a timed challenge"""
    challenge_doc = {
        "userId": user["id"],
        "userName": user.get("name", ""),
        "category": body.category,
        "difficulty": body.difficulty,
        "totalQuestions": body.questions_count,
        "startedAt": now(),
        "status": "active",
        "answers": [],
        "totalTime": 0,
        "score": 0,
        "timeLimit": body.questions_count * 60,  # 1 min per question
    }

    result = await col_challenges().insert_one(challenge_doc)

    return {
        "challenge_id": str(result.inserted_id),
        "time_limit": body.questions_count * 60,
        "questions": body.questions_count,
    }


@router.get("/challenges/{challenge_id}")
async def get_challenge(challenge_id: str, user=Depends(current_user)):
    """Get challenge details"""
    challenge = await col_challenges().find_one({"_id": oid(challenge_id)})
    if not challenge:
        raise HTTPException(404, "Challenge not found")

    if challenge["userId"] != user["id"]:
        raise HTTPException(403, "Cannot access this challenge")

    return sid(challenge)


@router.post("/challenges/{challenge_id}/submit")
async def submit_answer(challenge_id: str, body: ChallengeSubmit, user=Depends(current_user)):
    """Submit an answer in timed challenge"""
    challenge = await col_challenges().find_one({"_id": oid(challenge_id)})
    if not challenge:
        raise HTTPException(404, "Challenge not found")

    if challenge["userId"] != user["id"]:
        raise HTTPException(403, "Cannot submit to this challenge")

    if challenge["status"] != "active":
        raise HTTPException(400, "Challenge is no longer active")

    # Add answer to challenge
    answers = challenge.get("answers", [])
    answers.append({
        "question_id": body.question_id,
        "answer": body.answer,
        "time_taken": body.time_taken,
        "submittedAt": now(),
    })

    total_time = sum(a["time_taken"] for a in answers)

    # Check if time limit exceeded
    if total_time >= challenge.get("timeLimit", 300):
        await col_challenges().update_one(
            {"_id": oid(challenge_id)},
            {"$set": {"answers": answers, "totalTime": total_time, "status": "completed", "completedAt": now()}}
        )
        return {"message": "Time limit exceeded, challenge completed", "completed": True}

    await col_challenges().update_one(
        {"_id": oid(challenge_id)},
        {"$set": {"answers": answers, "totalTime": total_time}}
    )

    return {"message": "Answer recorded", "completed": False, "timeLeft": challenge.get("timeLimit") - total_time}


@router.post("/challenges/{challenge_id}/finish")
async def finish_challenge(challenge_id: str, user=Depends(current_user)):
    """Finish a timed challenge"""
    challenge = await col_challenges().find_one({"_id": oid(challenge_id)})
    if not challenge:
        raise HTTPException(404, "Challenge not found")

    if challenge["userId"] != user["id"]:
        raise HTTPException(403, "Cannot finish this challenge")

    # Calculate score based on time
    time_factor = max(0.3, 1 - (challenge.get("totalTime", 0) / challenge.get("timeLimit", 300)))
    answers_count = len(challenge.get("answers", []))
    score = int(answers_count * 10 * time_factor)

    # Update profile points and stats
    profile = await col_user_profiles().find_one({"userId": user["id"]}) or {}
    new_points = profile.get("points", 0) + score
    stats = profile.get("stats", {})
    stats["challenges_completed"] = stats.get("challenges_completed", 0) + 1
    stats["best_challenge_score"] = max(stats.get("best_challenge_score", 0), score)

    await col_user_profiles().update_one(
        {"userId": user["id"]},
        {"$set": {
            "points": new_points,
            "stats": stats,
            "updatedAt": now(),
        }},
        upsert=True
    )

    await col_challenges().update_one(
        {"_id": oid(challenge_id)},
        {"$set": {
            "status": "completed",
            "score": score,
            "completedAt": now(),
        }}
    )

    return {
        "score": score,
        "message": f"Challenge completed! You earned {score} points",
        "answers": len(challenge.get("answers", [])),
        "time_taken": challenge.get("totalTime", 0),
    }


@router.get("/challenges/leaderboard")
async def challenges_leaderboard():
    """Get timed challenges leaderboard"""
    challenges = await col_challenges().find({"status": "completed"}).sort("score", -1).limit(50).to_list(50)

    result = []
    for challenge in challenges:
        user = await col_users().find_one({"_id": oid(challenge["userId"])})
        if user:
            result.append({
                "name": user.get("name"),
                "score": challenge.get("score", 0),
                "category": challenge.get("category"),
                "time_taken": challenge.get("totalTime", 0),
                "questions": len(challenge.get("answers", [])),
                "completed_at": challenge.get("completedAt"),
            })

    return result
