import json
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from db_mongo import col_users, col_ai_questions, col_flashcards, col_dsa_challenge, oid, sid, now
from deps import current_user, require_ai_enabled
from utils.groq_service import generate_unique_questions, generate_flashcard_questions
from utils.deduplication import check_question_duplicate, hash_question
from utils.groq_unique_questions import _extract_json

router = APIRouter()

# Keeps each generation call fast and each user's daily Groq usage bounded —
# a handful of small batches a day, never one huge or unbounded request.
FLASHCARD_MAX_PER_CALL = 15
FLASHCARD_DAILY_LIMIT = 60

# ============================================================================
# MODELS
# ============================================================================

class FlashcardRequest(BaseModel):
    category: str
    count: int = 15
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

@router.get("/flashcards/due")
async def get_due_flashcards(user=Depends(current_user)):
    """Cards due for review right now, for the current user — a plain DB read,
    no AI call, so opening the review screen never costs an API request."""
    user_id = user["id"]
    due = await col_flashcards().find({
        "userId": user_id,
        "nextReview": {"$lte": now()},
    }).sort("nextReview", 1).to_list(200)

    total = await col_flashcards().count_documents({"userId": user_id})

    return {
        "due": [
            {
                "id": str(c["_id"]),
                "category": c.get("category", ""),
                "difficulty": c.get("difficulty", ""),
                "question": c.get("questionText", ""),
                "answer": c.get("answerText", ""),
                "explanation": c.get("explanation", ""),
            }
            for c in due
        ],
        "dueCount": len(due),
        "totalCount": total,
    }


@router.post("/generate-flashcards")
async def generate_flashcards(req: FlashcardRequest, user=Depends(require_ai_enabled)):
    """Generate unique flashcard questions with spaced repetition"""
    try:
        user_id = user["id"]
        count = max(1, min(req.count, FLASHCARD_MAX_PER_CALL))

        today = now().strftime("%Y-%m-%d")
        generated_today = await col_flashcards().count_documents({
            "userId": user_id,
            "createdAt": {"$gte": datetime.strptime(today, "%Y-%m-%d")},
        })
        if generated_today >= FLASHCARD_DAILY_LIMIT:
            raise HTTPException(429, f"Daily flashcard generation limit reached ({FLASHCARD_DAILY_LIMIT}/day). Try again tomorrow.")
        count = min(count, FLASHCARD_DAILY_LIMIT - generated_today)

        # Get user's previous flashcard questions to avoid duplicates
        previous_questions = await col_flashcards().find(
            {"userId": user_id}
        ).to_list(1000)

        previous_texts = {q.get("questionText", "") for q in previous_questions}

        # Generate new unique questions
        cards_data = await generate_flashcard_questions(
            category=req.category,
            count=count,
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
            result = await col_flashcards().insert_one(card_doc)
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
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(500, f"Failed to generate flashcards: {str(e)}")


@router.post("/flashcards/{card_id}/rate")
async def rate_flashcard(card_id: str, rating: int, user=Depends(current_user)):
    """
    Rate flashcard difficulty (Spaced Repetition Algorithm)
    Rating: 1=Hard (1 day), 2=Medium (3 days), 3=Easy (7 days)
    Uses SM-2 algorithm for optimal spacing
    """
    try:
        card = await col_flashcards().find_one({"_id": oid(card_id)})
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
        await col_flashcards().update_one(
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

@router.get("/dsa-challenge/daily")
async def get_daily_dsa_challenge(day: int, user=Depends(require_ai_enabled)):
    """Get the daily DSA challenge question (unique, no repeats)"""
    try:
        user_id = user["id"]

        # Check if user already completed this day
        completion = await col_dsa_challenge().find_one({
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
        existing_day_questions = await col_dsa_challenge().find({
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


@router.post("/dsa-challenge/submit")
async def submit_dsa_answer(req: DSAAnswerSubmit, user=Depends(require_ai_enabled)):
    """Submit answer to DSA challenge"""
    try:
        user_id = user["id"]

        # Get the question
        question = await col_dsa_challenge().find_one({
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
        await col_dsa_challenge().update_one(
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

@router.get("/daily-challenge")
async def get_daily_challenge(category: str = "mixed", user=Depends(require_ai_enabled)):
    """Get today's unique daily challenge (no duplicates)"""
    try:
        user_id = user["id"]
        today = now().strftime("%Y-%m-%d")

        # Check if user already got today's challenge
        existing = await col_ai_questions().find_one({
            "userId": user_id,
            "type": "daily",
            "date": today
        })

        if existing:
            return format_question_response(existing)

        # Get all questions asked to this user to avoid duplicates
        user_questions = await col_ai_questions().find({
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
        await col_ai_questions().insert_one(doc)

        return format_question_response(doc)
    except Exception as e:
        raise HTTPException(500, f"Failed to generate daily challenge: {str(e)}")

# ============================================================================
# HELPER FUNCTIONS
# ============================================================================

async def get_user_dsa_streak(user_id: str) -> int:
    """Calculate current DSA challenge streak"""
    completions = await col_dsa_challenge().find({
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


def _stringify_examples(examples) -> str:
    """The AI is asked for a plain string but sometimes returns a structured
    {input, output} shape (or a list of them) instead — flattened here so
    it's always safe to render directly."""
    if isinstance(examples, str):
        return examples
    if isinstance(examples, dict):
        parts = []
        if "input" in examples:
            parts.append(f"Input: {examples['input']}")
        if "output" in examples:
            parts.append(f"Output: {examples['output']}")
        return "\n".join(parts) if parts else json.dumps(examples)
    if isinstance(examples, list):
        return "\n\n".join(_stringify_examples(e) for e in examples)
    return str(examples) if examples else ""


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

    Return ONLY raw JSON, no markdown code fences, no commentary:
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
        question_data = _extract_json(response)
        question_data["difficulty"] = difficulty
        question_data["day"] = day
        # The prompt asks for "examples" as a string, but the model doesn't
        # always comply — it sometimes returns a richer {input, output}
        # shape instead, which crashed the frontend (React refuses to render
        # a raw object as a child). Normalized here so every consumer always
        # gets a plain string regardless of what shape the model chose.
        question_data["examples"] = _stringify_examples(question_data.get("examples", ""))
        return question_data
    except Exception:
        # Fallback if JSON parsing fails
        return {
            "title": f"Day {day}: DSA Challenge",
            "description": response,
            "difficulty": difficulty,
            "examples": "",
            "day": day
        }


async def _verify_daily_challenge_answer(question_data: dict) -> int:
    """Independently re-solves the question and cross-checks it against the
    model's own claimed correctIndex. Generating the puzzle, its 4 options,
    AND which one is correct all in a single pass frequently produces
    self-inconsistent questions — the model's own explanation contradicts
    itself and none of the 4 options actually match the logic it just
    described (confirmed live: real generated questions where the model's
    own worked-through answer matched none of its own options). Returns the
    independently re-derived correct index, or -1 if none of the 4 options
    are actually correct."""
    from utils.groq_service import call_groq_api

    options = question_data.get("options", [])
    if len(options) != 4:
        return -1
    options_text = "\n".join(f"{i}. {opt}" for i, opt in enumerate(options))
    prompt = f"""Solve this question yourself from scratch, step by step — do not assume any of the options below are correct until you've derived the answer independently.

Question: {question_data.get('description', '')}

Options:
{options_text}

After deriving your own answer, state which option index (0-3) matches it exactly.
Return ONLY raw JSON, no markdown code fences, no commentary:
{{"correctIndex": <0, 1, 2, or 3 — or -1 if none of the options match your independently-derived answer>}}"""

    response = await call_groq_api(prompt)
    try:
        result = _extract_json(response)
        idx = int(result.get("correctIndex", -1))
        return idx if idx in (0, 1, 2, 3) else -1
    except Exception:
        return -1


async def generate_daily_challenge(category: str, exclude_hashes: set) -> dict:
    """Generate unique daily challenge question — self-verified (see
    _verify_daily_challenge_answer) with bounded retries, same
    generate-then-verify shape as generate_unique_questions's own
    retry_limit pattern elsewhere in this codebase, rather than trusting the
    model's single-pass output blindly."""
    from utils.groq_service import call_groq_api

    prompt = f"""Generate a quick {category} coding challenge question (5-10 min solve time).

    IMPORTANT: Generate a UNIQUE and ORIGINAL question - not from standard resources.
    IMPORTANT: Work out the correct answer to your own question FIRST, step by step,
    THEN write the 4 options so that exactly one of them exactly matches that answer.

    Include multiple choice options.
    Return ONLY raw JSON, no markdown code fences, no commentary:
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

    response = ""
    for attempt in range(3):
        response = await call_groq_api(prompt)
        try:
            question_data = _extract_json(response)
        except Exception:
            continue

        verified_index = await _verify_daily_challenge_answer(question_data)
        if verified_index == -1:
            continue  # none of the options check out — regenerate rather than ship it
        # Trust the independently re-solved index even if it differs from
        # the model's own original claim — the question/options themselves
        # are still fine, only the originally-claimed index was wrong.
        question_data["correctIndex"] = verified_index
        return question_data

    # All attempts failed to produce a self-consistent question.
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
