import random
from datetime import datetime, timezone, timedelta
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from deps import current_user
from utils.ai import _groq_call, _ollama_text_action, GROQ_MODEL
from db_mongo import col_streaks, col_progress, now

router = APIRouter()


# ── AI helper ─────────────────────────────────────────────────────────────────

async def _groq_plain(system: str, user: str, max_tokens: int = 500) -> str:
    r = await _groq_call({
        "messages": [
            {"role": "system", "content": system},
            {"role": "user",   "content": user},
        ],
        "temperature": 0.5,
        "max_tokens": max_tokens,
    })
    return r.json()["choices"][0]["message"]["content"].strip()


# ── Summarise ──────────────────────────────────────────────────────────────────

class SummariseReq(BaseModel):
    title: str
    topic: str
    summary: str
    explanation: str
    code: str | None = None


@router.post("/summarise")
async def ai_summarise(req: SummariseReq, _=Depends(current_user)):
    system = (
        "You are a senior developer mentor. "
        "Give a concise, clear summary of the given topic for a developer preparing for interviews. "
        "Use plain English. Keep it under 120 words. No markdown, no bullet points."
    )
    user = (
        f"Topic: {req.topic} — {req.title}\n\n"
        f"Key concept: {req.summary}\n\n"
        f"Explanation: {req.explanation}\n\n"
        + (f"Code context:\n{req.code}" if req.code else "")
        + "\n\nSummarise this clearly for interview revision."
    )
    try:
        text = await _groq_plain(system, user, 300)
    except Exception:
        try:
            text = await _ollama_text_action(user)
        except Exception:
            text = req.summary
    return {"summary": text}


# ── Ask AI ────────────────────────────────────────────────────────────────────

class AskReq(BaseModel):
    title: str
    topic: str
    explanation: str
    code: str | None = None
    question: str


@router.post("/ask")
async def ai_ask(req: AskReq, _=Depends(current_user)):
    system = (
        "You are a senior developer mentor answering developer interview questions. "
        "Be concise, accurate, and practical. Max 200 words. No markdown headers. "
        "Use plain English. You may use short code examples inline."
    )
    user = (
        f"Topic context: {req.topic} — {req.title}\n"
        f"Explanation: {req.explanation}\n"
        + (f"Code: {req.code}\n" if req.code else "")
        + f"\nDeveloper's question: {req.question}\n\nAnswer concisely."
    )
    try:
        text = await _groq_plain(system, user, 400)
    except Exception:
        try:
            text = await _ollama_text_action(user)
        except Exception:
            text = "Sorry, AI is unavailable right now. Please try again."
    return {"answer": text}


# ── AI Explain (paste anything) ───────────────────────────────────────────────

class ExplainReq(BaseModel):
    text: str


@router.post("/explain")
async def ai_explain(req: ExplainReq, _=Depends(current_user)):
    if not req.text.strip():
        return {"explanation": ""}
    system = (
        "You are a senior JavaScript / frontend developer mentor. "
        "A developer has pasted code, an error, or a concept they don't understand. "
        "Explain it clearly in plain English using this structure:\n"
        "1. WHAT IT IS — one sentence saying what this is\n"
        "2. HOW IT WORKS — explain step by step in simple terms\n"
        "3. REAL-WORLD USE — one practical example of when/why you'd use it\n"
        "4. INTERVIEW ANGLE — the tricky thing interviewers test about this\n\n"
        "Keep each section short (2-4 sentences). No markdown symbols like ** or ##. "
        "Write section titles in CAPS followed by a dash."
    )
    user = f"Explain this to me:\n\n{req.text.strip()}"
    try:
        text = await _groq_plain(system, user, 600)
    except Exception:
        try:
            text = await _ollama_text_action(user)
        except Exception:
            text = "AI is unavailable right now. Please try again."
    return {"explanation": text}


# ── Challenge AI Expand ───────────────────────────────────────────────────────

class ChallengeExpandReq(BaseModel):
    title:    str
    topic:    str
    category: str
    summary:  str

@router.post("/challenge/expand")
async def challenge_expand(req: ChallengeExpandReq, _=Depends(current_user)):
    system = (
        "You are a senior developer mentor explaining a technical concept to a developer preparing for interviews. "
        "Given a concept title and a one-line summary, produce a rich explanation in this EXACT JSON format:\n"
        '{"how_it_works": "...", "example": "...", "interview_angle": "...", "key_points": ["...", "...", "..."]}\n'
        "Rules:\n"
        "- how_it_works: 2-3 sentences explaining the mechanism clearly\n"
        "- example: one concrete real-world code example or scenario (short, practical)\n"
        "- interview_angle: the tricky edge case or gotcha interviewers love to test\n"
        "- key_points: exactly 3 short bullet strings (no bullet symbols)\n"
        "Respond ONLY with valid JSON. No markdown, no extra text."
    )
    user = f"Category: {req.category}\nTopic: {req.topic}\nTitle: {req.title}\nSummary: {req.summary}"
    import json as _json
    try:
        raw = await _groq_plain(system, user, 500)
        # Extract JSON from response
        start = raw.find("{")
        end   = raw.rfind("}") + 1
        data  = _json.loads(raw[start:end]) if start != -1 else {}
        return data
    except Exception:
        try:
            raw = await _ollama_text_action(user)
            start = raw.find("{"); end = raw.rfind("}") + 1
            data  = _json.loads(raw[start:end]) if start != -1 else {}
            return data
        except Exception:
            return {"how_it_works": "AI is unavailable right now.", "example": "", "interview_angle": "", "key_points": []}


# ── TypeScript Adder ──────────────────────────────────────────────────────────

class CodeReq(BaseModel):
    code: str

@router.post("/ts-add")
async def ts_add(req: CodeReq, _=Depends(current_user)):
    if not req.code.strip():
        return {"result": ""}
    system = (
        "You are a TypeScript expert. The user will give you JavaScript code. "
        "Your job is to convert it to fully typed TypeScript. Rules:\n"
        "- Add proper type annotations to all variables, parameters, and return types\n"
        "- Use interfaces or type aliases for object shapes\n"
        "- Replace 'any' with specific types wherever possible\n"
        "- Use generics where appropriate\n"
        "- Add 'readonly' where data should not be mutated\n"
        "- Output ONLY the converted TypeScript code, no explanation, no markdown fences.\n"
        "If the code is already TypeScript, improve the types."
    )
    try:
        result = await _groq_plain(system, req.code.strip(), 1200)
    except Exception:
        result = "AI unavailable. Please try again."
    return {"result": result}


# ── Error Finder ───────────────────────────────────────────────────────────────

@router.post("/find-errors")
async def find_errors(req: CodeReq, _=Depends(current_user)):
    if not req.code.strip():
        return {"result": ""}
    system = (
        "You are a code reviewer specializing in JavaScript, TypeScript, React, and Node.js. "
        "Analyze the code the user provides and find actual bugs and errors. Structure your response as:\n\n"
        "ERRORS FOUND — list each bug with:\n"
        "  Line/area: [where it is]\n"
        "  Problem: [what is wrong]\n"
        "  Fix: [the corrected code snippet]\n\n"
        "If no errors exist, say 'NO ERRORS FOUND — Code looks correct.' "
        "Focus on: syntax errors, logic bugs, undefined variables, wrong types, async issues, "
        "off-by-one errors, null/undefined dereferences. Do NOT use markdown symbols like ** or ##."
    )
    try:
        result = await _groq_plain(system, req.code.strip(), 800)
    except Exception:
        result = "AI unavailable. Please try again."
    return {"result": result}


# ── Potential Break Finder ─────────────────────────────────────────────────────

@router.post("/find-breaks")
async def find_breaks(req: CodeReq, _=Depends(current_user)):
    if not req.code.strip():
        return {"result": ""}
    system = (
        "You are a senior software engineer doing a defensive code review. "
        "The user provides code. Your job is to find parts that COULD break at runtime "
        "under certain conditions — even if the code has no obvious syntax errors. Look for:\n"
        "- Uncaught exceptions / missing try-catch\n"
        "- Edge cases (empty arrays, null/undefined inputs, zero division)\n"
        "- Race conditions or unhandled promise rejections\n"
        "- Memory leaks (uncleared timers/listeners)\n"
        "- Incorrect assumptions about data shape\n"
        "- Performance bottlenecks that could timeout\n\n"
        "Structure: For each issue write:\n"
        "RISK [severity: High/Medium/Low]: [what could break]\n"
        "SCENARIO: [what input or condition triggers it]\n"
        "FIX: [how to prevent it]\n\n"
        "If the code is solid, say 'NO BREAK RISKS FOUND.' Do NOT use ** or ## markdown."
    )
    try:
        result = await _groq_plain(system, req.code.strip(), 800)
    except Exception:
        result = "AI unavailable. Please try again."
    return {"result": result}


# ── Mock Interview ────────────────────────────────────────────────────────────

class MockStartReq(BaseModel):
    category: str | None = None
    difficulty: str | None = None
    count: int = 7


class MockEvalReq(BaseModel):
    question: str
    topic: str
    title: str
    explanation: str
    user_answer: str


@router.post("/mock/start")
async def mock_start(req: MockStartReq, user=Depends(current_user)):
    """Return a set of interview questions from study topics."""
    from data.study_topics import STUDY_TOPICS
    pool = STUDY_TOPICS
    if req.category:
        cats = [c.strip() for c in req.category.split(",") if c.strip()]
        if cats:
            pool = [t for t in pool if t["category"] in cats]
    if req.difficulty:
        pool = [t for t in pool if t["difficulty"] == req.difficulty]
    count = max(3, min(req.count, 15))
    selected = random.sample(pool, min(count, len(pool)))
    questions = [
        {
            "id": t["id"],
            "category": t["category"],
            "topic": t["topic"],
            "title": t["title"],
            "difficulty": t["difficulty"],
            "question": t["interviewQuestion"],
            "hint": t["summary"],
        }
        for t in selected
    ]
    return {"questions": questions, "total": len(questions)}


@router.post("/mock/evaluate")
async def mock_evaluate(req: MockEvalReq, _=Depends(current_user)):
    """AI scores the user's answer 1-10 with feedback."""
    system = (
        "You are a senior developer interviewer evaluating a candidate's answer. "
        "Score the answer from 1 to 10 and give specific, constructive feedback. "
        "Respond in this EXACT format (no extra text):\n"
        "SCORE: <number>\n"
        "WHAT YOU GOT RIGHT: <1-2 sentences>\n"
        "WHAT YOU MISSED: <1-2 sentences of key points missing>\n"
        "MODEL ANSWER: <the ideal concise answer in 2-4 sentences>"
    )
    user = (
        f"Topic: {req.topic} — {req.title}\n"
        f"Interview question: {req.question}\n"
        f"Reference explanation: {req.explanation}\n\n"
        f"Candidate's answer: {req.user_answer or '(no answer given)'}\n\n"
        "Score and provide feedback."
    )
    try:
        raw = await _groq_plain(system, user, 400)
    except Exception:
        try:
            raw = await _ollama_text_action(user)
        except Exception:
            raw = "SCORE: 0\nWHAT YOU GOT RIGHT: AI unavailable\nWHAT YOU MISSED: AI unavailable\nMODEL ANSWER: AI unavailable"

    score = 0
    right = missed = model = ""
    for line in raw.splitlines():
        if line.startswith("SCORE:"):
            try:
                score = int(line.split(":")[1].strip().split()[0])
            except Exception:
                score = 5
        elif line.startswith("WHAT YOU GOT RIGHT:"):
            right = line.split(":", 1)[1].strip()
        elif line.startswith("WHAT YOU MISSED:"):
            missed = line.split(":", 1)[1].strip()
        elif line.startswith("MODEL ANSWER:"):
            model = line.split(":", 1)[1].strip()
    return {"score": score, "right": right, "missed": missed, "model_answer": model}


# ── Flashcard progress ────────────────────────────────────────────────────────

class FlashProgressReq(BaseModel):
    topic_id: str
    result: str  # "know" | "review"


@router.post("/flash/progress")
async def flash_progress(req: FlashProgressReq, user=Depends(current_user)):
    await col_progress().update_one(
        {"userId": user["id"], "topicId": req.topic_id},
        {"$set": {"result": req.result, "updatedAt": now()}},
        upsert=True,
    )
    return {"ok": True}


@router.get("/flash/progress")
async def get_flash_progress(user=Depends(current_user)):
    docs = await col_progress().find({"userId": user["id"]}).to_list(length=2000)
    return {d["topicId"]: d["result"] for d in docs}


# ── Weak areas ─────────────────────────────────────────────────────────────────

@router.get("/weak-areas")
async def weak_areas(user=Depends(current_user)):
    docs = await col_progress().find({"userId": user["id"]}).to_list(length=2000)
    from data.study_topics import STUDY_TOPICS

    by_cat: dict[str, dict] = {}
    for t in STUDY_TOPICS:
        cat = t["category"]
        if cat not in by_cat:
            by_cat[cat] = {"total": 0, "know": 0, "review": 0, "unseen": 0}
        by_cat[cat]["total"] += 1

    progress_map = {d["topicId"]: d["result"] for d in docs}
    for t in STUDY_TOPICS:
        cat = t["category"]
        result = progress_map.get(t["id"], "unseen")
        by_cat[cat][result] = by_cat[cat].get(result, 0) + 1

    result = []
    for cat, data in by_cat.items():
        total = data["total"]
        know = data.get("know", 0)
        review = data.get("review", 0)
        unseen = total - know - review
        score = round((know / total) * 100) if total else 0
        result.append({
            "category": cat,
            "total": total,
            "know": know,
            "review": review,
            "unseen": unseen,
            "score": score,
        })

    result.sort(key=lambda x: x["score"])
    return {"areas": result}


# ── Daily Streak + Challenge ──────────────────────────────────────────────────

@router.get("/streak")
async def get_streak(user=Depends(current_user)):
    doc = await col_streaks().find_one({"userId": user["id"]})
    if not doc:
        return {"streak": 0, "lastActive": None, "todayDone": False, "challenge": _daily_challenge()}
    today = datetime.now(timezone.utc).date()
    last = doc.get("lastActive")
    if last:
        last_date = last.date() if hasattr(last, "date") else datetime.fromisoformat(str(last)).date()
        today_done = last_date == today
        streak = doc.get("streak", 0)
        if last_date < today - timedelta(days=1):
            streak = 0
    else:
        today_done = False
        streak = 0
    return {
        "streak": streak,
        "lastActive": doc.get("lastActive"),
        "todayDone": today_done,
        "challenge": _daily_challenge(),
    }


@router.post("/streak/complete")
async def complete_streak(user=Depends(current_user)):
    today = datetime.now(timezone.utc).date()
    doc = await col_streaks().find_one({"userId": user["id"]})
    streak = 1
    if doc:
        last = doc.get("lastActive")
        if last:
            last_date = last.date() if hasattr(last, "date") else datetime.fromisoformat(str(last)).date()
            if last_date == today:
                return {"streak": doc.get("streak", 1), "message": "Already completed today"}
            if last_date == today - timedelta(days=1):
                streak = doc.get("streak", 0) + 1
    await col_streaks().update_one(
        {"userId": user["id"]},
        {"$set": {"streak": streak, "lastActive": now()}},
        upsert=True,
    )
    return {"streak": streak, "message": f"Day {streak} complete! 🔥"}


def _daily_challenge():
    from data.study_topics import STUDY_TOPICS
    today = datetime.now(timezone.utc).date()
    seed = today.year * 10000 + today.month * 100 + today.day
    random.seed(seed)
    topic = random.choice(STUDY_TOPICS)
    random.seed()
    return {
        "id": topic["id"],
        "category": topic["category"],
        "topic": topic["topic"],
        "title": topic["title"],
        "difficulty": topic["difficulty"],
        "question": topic["interviewQuestion"],
        "summary": topic["summary"],
    }
