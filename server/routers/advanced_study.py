import json
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from db_mongo import col_users, col_ai_questions, col_flashcards, col_dsa_challenge, oid, sid, now
from deps import current_user
from utils.groq_service import generate_unique_questions, generate_flashcard_questions
from utils.deduplication import check_question_duplicate, hash_question

router = APIRouter()

# ============================================================================
# MODELS
# ============================================================================

class FlashcardRequest(BaseModel):
    category: str
    count: int = 20
    difficulty: str = "all"

class DSAAnswerSubmit(BaseModel):
    day: int
    answer: str
    questionId: str

class DailyChallengeQuery(BaseModel):
    category: str = "mixed"

# ============================================================================
# FLASHCARD ENDPOINTS - Spaced Repetition Learning
# ============================================================================

@router.post("/study/generate-flashcards")
async def generate_flashcards(req: FlashcardRequest, user=Depends(current_user)):
    """Generate unique flashcard questions with spaced repetition"""
    try:
        # Get user's previous flashcard questions to avoid duplicates
        user_id = str(user["_id"])
        previous_questions = await col_flashcards.find(
            {"userId": user_id}
        ).to_list(1000)

        previous_texts = {q.get("questionText", "") for q in previous_questions}

        # Generate new unique questions
        cards_data = await generate_flashcard_questions(
            category=req.category,
            count=req.count,
            difficulty=req.difficulty,
            exclude_texts=previous_texts
        )

        # Store in database
        cards = []
        for card in cards_data:
            card_doc = {
                "userId": user_id,
                "category": req.category,
                "difficulty": req.difficulty,
                "questionText": card["question"],
                "answerText": card["answer"],
                "explanation": card.get("explanation", ""),
                "questionHash": hash_question(card["question"]),
                "nextReview": now(),
                "interval": 1,
                "ease": 2.5,
                "reviews": 0,
                "createdAt": now()
            }
            result = await col_flashcards.insert_one(card_doc)
            card_doc["id"] = str(result.inserted_id)
            cards.append(card_doc)

        return {
            "cards": [
                {
                    "id": c["id"],
                    "question": c["questionText"],
                    "answer": c["answerText"],
                    "explanation": c.get("explanation", "")
                } for c in cards
            ]
        }
    except Exception as e:
        raise HTTPException(500, f"Failed to generate flashcards: {str(e)}")


@router.post("/study/flashcards/{card_id}/rate")
async def rate_flashcard(card_id: str, rating: int, user=Depends(current_user)):
    """
    Rate flashcard difficulty (Spaced Repetition Algorithm)
    Rating: 1=Hard (1 day), 2=Medium (3 days), 3=Easy (7 days)
    Uses SM-2 algorithm for optimal spacing
    """
    try:
        card = await col_flashcards.find_one({"_id": oid(card_id)})
        if not card:
            raise HTTPException(404, "Flashcard not found")

        # SM-2 Spaced Repetition Algorithm
        if rating == 1:  # Hard
            interval = 1
            ease = max(1.3, card.get("ease", 2.5) - 0.2)
        elif rating == 2:  # Medium
            interval = 3
            ease = card.get("ease", 2.5)
        else:  # Easy (3)
            interval = card.get("interval", 1) * card.get("ease", 2.5)
            ease = min(2.5, card.get("ease", 2.5) + 0.1)

        # Update card
        await col_flashcards.update_one(
            {"_id": oid(card_id)},
            {"$set": {
                "nextReview": now() + timedelta(days=interval),
                "interval": interval,
                "ease": ease,
                "reviews": card.get("reviews", 0) + 1,
                "lastReviewedAt": now()
            }}
        )

        return {"success": True, "nextReviewIn": f"{interval} day(s)"}
    except Exception as e:
        raise HTTPException(500, f"Failed to rate flashcard: {str(e)}")

# ============================================================================
# 30-DAY DSA CHALLENGE
# ============================================================================

@router.get("/study/dsa-challenge/daily")
async def get_daily_dsa_challenge(day: int, user=Depends(current_user)):
    """Get the daily DSA challenge question (unique, no repeats)"""
    try:
        user_id = str(user["_id"])

        # Check if user already completed this day
        completion = await col_dsa_challenge.find_one({
            "userId": user_id,
            "day": day
        })

        if completion:
            return {
                "question": completion["question"],
                "completed": True,
                "streak": await get_user_dsa_streak(user_id)
            }

        # Generate unique question for this day
        existing_day_questions = await col_dsa_challenge.find({
            "day": day
        }).to_list(1000)

        exclude_hashes = {q.get("questionHash", "") for q in existing_day_questions}

        question_data = await generate_dsa_question(
            day=day,
            exclude_hashes=exclude_hashes
        )

        return {
            "question": {
                "id": f"dsa_day_{day}",
                "title": question_data["title"],
                "description": question_data["description"],
                "difficulty": question_data["difficulty"],
                "examples": question_data.get("examples", ""),
                "solution": None  # Hidden until completed
            },
            "completed": False,
            "streak": await get_user_dsa_streak(user_id)
        }
    except Exception as e:
        raise HTTPException(500, f"Failed to load DSA challenge: {str(e)}")


@router.post("/study/dsa-challenge/submit")
async def submit_dsa_answer(req: DSAAnswerSubmit, user=Depends(current_user)):
    """Submit answer to DSA challenge"""
    try:
        user_id = str(user["_id"])

        # Get the question
        question = await col_dsa_challenge.find_one({
            "userId": user_id,
            "day": req.day
        })

        # Verify answer (in real app, would use AI to grade)
        is_correct = await verify_dsa_answer(
            req.answer,
            question.get("expectedAnswer", ""),
            question.get("gradingCriteria", [])
        )

        # Store submission
        await col_dsa_challenge.update_one(
            {"_id": oid(question["_id"])} if question else {"userId": user_id, "day": req.day},
            {"$set": {
                "submittedAnswer": req.answer,
                "correct": is_correct,
                "submittedAt": now()
            }},
            upsert=True
        )

        # Update streak
        streak = await get_user_dsa_streak(user_id) if is_correct else 0

        return {
            "correct": is_correct,
            "streak": streak,
            "message": "Great job!" if is_correct else "Try again or view the solution."
        }
    except Exception as e:
        raise HTTPException(500, f"Failed to submit answer: {str(e)}")

# ============================================================================
# DAILY AI CHALLENGE - Quick Daily Question
# ============================================================================

@router.get("/study/daily-challenge")
async def get_daily_challenge(category: str = "mixed", user=Depends(current_user)):
    """Get today's unique daily challenge (no duplicates)"""
    try:
        user_id = str(user["_id"])
        today = now().date()

        # Check if user already got today's challenge
        existing = await col_ai_questions.find_one({
            "userId": user_id,
            "type": "daily",
            "date": today
        })

        if existing:
            return format_question_response(existing)

        # Get all questions asked to this user to avoid duplicates
        user_questions = await col_ai_questions.find({
            "userId": user_id
        }).to_list(5000)

        exclude_hashes = {q.get("questionHash", "") for q in user_questions}

        # Generate new unique question
        question_data = await generate_daily_challenge(
            category=category,
            exclude_hashes=exclude_hashes
        )

        # Store in database
        doc = {
            "userId": user_id,
            "type": "daily",
            "date": today,
            "category": category,
            "title": question_data["title"],
            "description": question_data["description"],
            "difficulty": question_data["difficulty"],
            "code": question_data.get("code", ""),
            "options": question_data.get("options", []),
            "correctIndex": question_data.get("correctIndex", 0),
            "explanation": question_data.get("explanation", ""),
            "questionHash": hash_question(question_data["title"]),
            "createdAt": now()
        }
        await col_ai_questions.insert_one(doc)

        return format_question_response(doc)
    except Exception as e:
        raise HTTPException(500, f"Failed to generate daily challenge: {str(e)}")

# ============================================================================
# HELPER FUNCTIONS
# ============================================================================

async def get_user_dsa_streak(user_id: str) -> int:
    """Calculate current DSA challenge streak"""
    completions = await col_dsa_challenge.find({
        "userId": user_id,
        "correct": True
    }).sort("day", -1).to_list(100)

    if not completions:
        return 0

    streak = 0
    expected_day = max([c.get("day", 0) for c in completions])

    for completion in completions:
        if completion.get("day") == expected_day:
            streak += 1
            expected_day -= 1
        else:
            break

    return streak


async def generate_dsa_question(day: int, exclude_hashes: set) -> dict:
    """Generate unique DSA question for specific day using Groq AI"""
    difficulty_map = {
        1: "Easy", 2: "Easy", 3: "Medium", 4: "Medium", 5: "Medium",
        6: "Hard", 7: "Hard", 8: "Hard", 9: "Hard", 10: "Hard",
        11: "Expert", 12: "Expert", 13: "Expert", 14: "Expert", 15: "Expert",
        16: "Expert", 17: "Expert", 18: "Expert", 19: "Expert", 20: "Expert",
        21: "Expert", 22: "Expert", 23: "Expert", 24: "Expert", 25: "Expert",
        26: "Expert", 27: "Expert", 28: "Expert", 29: "Expert", 30: "Expert"
    }

    difficulty = difficulty_map.get(day, "Hard")

    # Call Groq API to generate unique question
    prompt = f"""Generate a unique LeetCode-style DSA problem for Day {day} of a 30-day challenge.
    Difficulty: {difficulty}

    IMPORTANT: Make this problem UNIQUE - different from any standard LeetCode problems.

    Return JSON:
    {{
        "title": "Problem title",
        "description": "Detailed problem description",
        "examples": "Input/Output examples",
        "expectedAnswer": "Expected solution approach",
        "gradingCriteria": ["criterion1", "criterion2"]
    }}"""

    from utils.groq_service import call_groq_api
    response = await call_groq_api(prompt)

    try:
        question_data = json.loads(response)
        question_data["difficulty"] = difficulty
        question_data["day"] = day
        return question_data
    except:
        # Fallback if JSON parsing fails
        return {
            "title": f"Day {day}: DSA Challenge",
            "description": response,
            "difficulty": difficulty,
            "examples": "",
            "day": day
        }


async def generate_daily_challenge(category: str, exclude_hashes: set) -> dict:
    """Generate unique daily challenge question"""
    from utils.groq_service import call_groq_api

    prompt = f"""Generate a quick {category} coding challenge question (5-10 min solve time).

    IMPORTANT: Generate a UNIQUE and ORIGINAL question - not from standard resources.

    Include multiple choice options.
    Return JSON:
    {{
        "title": "Question title",
        "description": "Question description",
        "category": "{category}",
        "difficulty": "Easy|Medium|Hard",
        "code": "Optional code snippet",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "correctIndex": 0,
        "explanation": "Why this is correct"
    }}"""

    response = await call_groq_api(prompt)

    try:
        return json.loads(response)
    except:
        return {
            "title": "Daily Challenge",
            "description": response,
            "category": category,
            "difficulty": "Medium",
            "options": ["Option A", "Option B", "Option C", "Option D"],
            "correctIndex": 0,
            "explanation": "Check the explanation"
        }


async def verify_dsa_answer(submitted: str, expected: str, criteria: list) -> bool:
    """Verify DSA answer using AI"""
    from utils.groq_service import call_groq_api

    prompt = f"""
    Compare this submitted answer against the expected solution.

    Submitted: {submitted}
    Expected approach: {expected}

    Grading criteria: {json.dumps(criteria)}

    Respond with ONLY "true" or "false" - is this answer correct?
    """

    response = await call_groq_api(prompt)
    return "true" in response.lower()


def format_question_response(doc: dict) -> dict:
    """Format question document for API response"""
    return {
        "id": str(doc.get("_id", "")),
        "title": doc.get("title", ""),
        "description": doc.get("description", ""),
        "category": doc.get("category", ""),
        "difficulty": doc.get("difficulty", ""),
        "code": doc.get("code", ""),
        "options": doc.get("options", []),
        "correctIndex": doc.get("correctIndex", 0),
        "explanation": doc.get("explanation", "")
    }
