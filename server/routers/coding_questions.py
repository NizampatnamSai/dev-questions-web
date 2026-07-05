from datetime import date
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from db_mongo import col_coding_questions, col_app_config, col_coding_limit_bonus, oid, now
from deps import current_user, require_ai_enabled
from utils.js_sandbox import run_test_cases
from utils.coding_question_service import generate_coding_question, DIFFICULTY_LEVELS
from utils.ai import _groq_call

router = APIRouter()

DEFAULT_DAILY_LIMIT = 15
VALID_DIFFICULTIES = set(DIFFICULTY_LEVELS)


def _is_admin(user) -> bool:
    return user.get("role") in ("admin", "sub_admin")


async def _base_daily_limit() -> int:
    doc = await col_app_config().find_one({"_id": "config"})
    return (doc or {}).get("coding_question_daily_limit", DEFAULT_DAILY_LIMIT)


def _today() -> str:
    return date.today().isoformat()


async def _daily_limit(user_id: str) -> int:
    """Global daily limit plus any self-granted admin bonus for today."""
    base = await _base_daily_limit()
    bonus_doc = await col_coding_limit_bonus().find_one({"userId": user_id, "date": _today()})
    return base + (bonus_doc or {}).get("bonus", 0)


@router.get("/coding/usage")
async def coding_usage(user=Depends(current_user)):
    limit = await _daily_limit(user["id"])
    used = await col_coding_questions().count_documents({"userId": user["id"], "date": _today()})
    return {"used": used, "limit": limit, "remaining": max(0, limit - used)}


class BonusBody(BaseModel):
    amount: int


@router.post("/coding/usage/bonus")
async def add_usage_bonus(body: BonusBody, user=Depends(current_user)):
    """Lets an admin bump up their own daily question limit on the fly,
    without leaving the JS Coding page to change the global config."""
    if not _is_admin(user):
        raise HTTPException(403, "Admins only")
    if body.amount <= 0 or body.amount > 100:
        raise HTTPException(400, "amount must be between 1 and 100")
    await col_coding_limit_bonus().update_one(
        {"userId": user["id"], "date": _today()},
        {"$inc": {"bonus": body.amount}},
        upsert=True,
    )
    limit = await _daily_limit(user["id"])
    used = await col_coding_questions().count_documents({"userId": user["id"], "date": _today()})
    return {"used": used, "limit": limit, "remaining": max(0, limit - used)}


class GenerateBody(BaseModel):
    difficulty: str = "medium"


@router.post("/coding/generate")
async def coding_generate(body: GenerateBody, user=Depends(require_ai_enabled)):
    difficulty = body.difficulty.lower()
    if difficulty not in VALID_DIFFICULTIES:
        raise HTTPException(400, "difficulty must be 'medium' or 'hard'")

    limit = await _daily_limit(user["id"])
    used = await col_coding_questions().count_documents({"userId": user["id"], "date": _today()})
    if used >= limit:
        raise HTTPException(403, f"Daily limit reached ({limit} questions/day)")

    # Avoid repeating titles the user has already seen (any day)
    prior_docs = await col_coding_questions().find(
        {"userId": user["id"]}, {"title": 1}
    ).to_list(500)
    exclude_titles = {d["title"] for d in prior_docs if d.get("title")}

    try:
        q = await generate_coding_question(difficulty, exclude_titles)
    except Exception as e:
        raise HTTPException(503, "AI is unavailable right now. Please try again shortly.") from e

    doc = {
        "userId": user["id"],
        "date": _today(),
        "difficulty": difficulty,
        "title": q["title"],
        "description": q["description"],
        "testCases": q["testCases"],
        "modelAnswer": q["modelAnswer"],
        "createdAt": now(),
        "submission": None,
    }
    result = await col_coding_questions().insert_one(doc)

    # All expected outputs (and a plain-English "why") are shown up front so users
    # understand the test cases before attempting the problem — the actual/passed
    # verdict per case is still only revealed on submit.
    test_cases = [{"input": tc["input"], "expected": tc["expected"], "explanation": tc.get("explanation", "")} for tc in doc["testCases"]]
    return {
        "id": str(result.inserted_id),
        "title": doc["title"],
        "description": doc["description"],
        "difficulty": doc["difficulty"],
        "testCases": test_cases,
    }


class SubmitBody(BaseModel):
    code: str


@router.post("/coding/{qid}/submit")
async def coding_submit(qid: str, body: SubmitBody, user=Depends(current_user)):
    doc = await col_coding_questions().find_one({"_id": oid(qid)})
    if not doc:
        raise HTTPException(404, "Question not found")
    if doc["userId"] != user["id"]:
        raise HTTPException(403, "Not your question")
    if not body.code.strip():
        raise HTTPException(400, "Code cannot be empty")

    results = await run_test_cases(body.code, doc["testCases"])
    passed = sum(1 for r in results if r["passed"])
    total = len(results)
    score = round(100 * passed / total) if total else 0

    submission = {
        "code": body.code,
        "results": results,
        "score": score,
        "submittedAt": now(),
    }
    await col_coding_questions().update_one({"_id": oid(qid)}, {"$set": {"submission": submission}})

    return {"results": results, "score": score, "passed": passed, "total": total}


async def _groq_plain(system: str, user: str, max_tokens: int = 350) -> str:
    r = await _groq_call({
        "messages": [
            {"role": "system", "content": system},
            {"role": "user", "content": user},
        ],
        "temperature": 0.5,
        "max_tokens": max_tokens,
    })
    return r.json()["choices"][0]["message"]["content"].strip()


@router.post("/coding/{qid}/explain")
async def coding_explain(qid: str, user=Depends(require_ai_enabled)):
    """Plain-English walkthrough of why the current submission passed/failed,
    generated once per submission and cached on it — resubmitting different
    code invalidates the cache naturally since submission gets overwritten."""
    doc = await col_coding_questions().find_one({"_id": oid(qid)})
    if not doc:
        raise HTTPException(404, "Question not found")
    if doc["userId"] != user["id"]:
        raise HTTPException(403, "Not your question")
    submission = doc.get("submission")
    if not submission:
        raise HTTPException(400, "Submit an attempt before requesting an explanation")

    if submission.get("explanation"):
        return {"explanation": submission["explanation"], "cached": True}

    results = submission["results"]
    failed = [r for r in results if not r["passed"]]

    if not failed:
        system = (
            "You are a friendly senior engineer reviewing a candidate's PASSING solution. "
            "Write a short note (2-4 sentences, plain English, no markdown) on the overall "
            "approach's time/space complexity and one concrete way it could be made cleaner "
            "or more efficient. If it's already solid, say so briefly."
        )
        user_msg = f"Problem: {doc['title']}\n{doc['description']}\n\nSolution:\n{submission['code']}"
    else:
        cases_desc = "\n".join(
            f"- Input {r['input']}: expected {r['expected']!r}, got "
            f"{('an error: ' + r['error']) if r['error'] else repr(r['actual'])}"
            for r in failed[:4]
        )
        system = (
            "You are a friendly senior engineer helping a candidate debug FAILING test cases. "
            "Write a short explanation (3-5 sentences, plain English, no markdown, no code) of "
            "WHY the code produces the wrong output on these specific cases, and one concrete "
            "hint toward the fix. Do NOT provide the corrected code or the full solution."
        )
        user_msg = (
            f"Problem: {doc['title']}\n{doc['description']}\n\n"
            f"Candidate's code:\n{submission['code']}\n\n"
            f"Failing cases:\n{cases_desc}"
        )

    try:
        explanation = await _groq_plain(system, user_msg)
    except Exception:
        raise HTTPException(503, "AI explanation is unavailable right now — try again shortly.")

    await col_coding_questions().update_one(
        {"_id": oid(qid)}, {"$set": {"submission.explanation": explanation}},
    )
    return {"explanation": explanation, "cached": False}


@router.post("/coding/{qid}/reveal")
async def coding_reveal(qid: str, user=Depends(current_user)):
    doc = await col_coding_questions().find_one({"_id": oid(qid)})
    if not doc:
        raise HTTPException(404, "Question not found")
    if doc["userId"] != user["id"]:
        raise HTTPException(403, "Not your question")
    if not doc.get("submission"):
        raise HTTPException(400, "Submit an attempt before revealing the answer")
    return {"modelAnswer": doc["modelAnswer"]}


@router.get("/coding/history")
async def coding_history(user=Depends(current_user)):
    docs = await col_coding_questions().find(
        {"userId": user["id"]}
    ).sort("createdAt", -1).to_list(200)
    result = []
    for d in docs:
        d["id"] = str(d.pop("_id"))
        sub = d.get("submission")
        result.append({
            "id": d["id"],
            "title": d["title"],
            "difficulty": d["difficulty"],
            "date": d["date"],
            "score": sub["score"] if sub else None,
            "attempted": sub is not None,
        })
    return result


# NOTE: must stay below the static /coding/usage, /coding/generate, /coding/history
# routes — a dynamic {qid} path param would otherwise greedily match those first.
@router.get("/coding/{qid}")
async def coding_detail(qid: str, user=Depends(current_user)):
    """Full detail for a past question — used by the History view to reopen an
    old attempt (question text, all test cases with outputs, your submitted code
    and results, and the model answer if you already revealed it)."""
    doc = await col_coding_questions().find_one({"_id": oid(qid)})
    if not doc:
        raise HTTPException(404, "Question not found")
    if doc["userId"] != user["id"]:
        raise HTTPException(403, "Not your question")

    sub = doc.get("submission")
    return {
        "id": str(doc["_id"]),
        "title": doc["title"],
        "description": doc["description"],
        "difficulty": doc["difficulty"],
        "date": doc["date"],
        "testCases": [{"input": tc["input"], "expected": tc["expected"], "explanation": tc.get("explanation", "")} for tc in doc["testCases"]],
        "submission": {"code": sub["code"], "results": sub["results"], "score": sub["score"], "explanation": sub.get("explanation")} if sub else None,
        "modelAnswer": doc["modelAnswer"] if sub else None,
    }
