"""AI generation of unique JS coding questions with test cases, self-verified
against the same sandbox used to grade users (utils/js_sandbox.py) before ever
being served — so "passed/failed" is always trustworthy."""
import os
import json
import random
import time
import httpx

from utils.js_sandbox import run_test_cases, all_passed
from utils.deduplication import check_question_duplicate

GROQ_API_KEY        = os.getenv("GROQ_API_KEY", "")
GROQ_URL            = "https://api.groq.com/openai/v1/chat/completions"
GROQ_MODEL          = os.getenv("GROQ_MODEL",          "llama-3.3-70b-versatile")
GROQ_MODEL_FALLBACK = os.getenv("GROQ_MODEL_FALLBACK", "llama-3.1-8b-instant")

MAX_GENERATION_ATTEMPTS = 3

# Graduated tiers from Easy through Hard.
DIFFICULTY_LEVELS = ["easy", "medium", "medium-plus", "hard-minus", "hard", "hard-plus"]

DIFFICULTY_DESCRIPTIONS = {
    "easy":        "Easy difficulty — a beginner-friendly problem, straightforward logic, minimal edge cases, solvable with basic loops/conditionals.",
    "medium":      "Medium difficulty — a solid intermediate problem, one clear approach, no tricky edge cases.",
    "medium-plus": "Medium-to-Hard difficulty — intermediate problem with one non-obvious twist or extra edge case to handle.",
    "hard-minus":  "Just below Hard difficulty — requires combining two concepts or a less common technique, but not deeply tricky.",
    "hard":        "Hard difficulty — requires real algorithmic insight, careful edge-case handling, non-trivial time/space complexity thinking.",
    "hard-plus":   "Hard-Advanced difficulty — a genuinely tough interview problem, multiple edge cases, the kind that separates strong candidates.",
}


def _extract_object(text: str) -> dict:
    s, e = text.find("{"), text.rfind("}")
    if s == -1 or e == -1:
        raise ValueError("No JSON object in AI response")
    return json.loads(text[s:e + 1])


async def _groq_call(payload: dict) -> dict:
    if not GROQ_API_KEY:
        raise ValueError("GROQ_API_KEY not set")
    headers = {"Authorization": f"Bearer {GROQ_API_KEY}"}
    async with httpx.AsyncClient(timeout=30) as c:
        r = await c.post(GROQ_URL, headers=headers, json={**payload, "model": GROQ_MODEL})
        if r.status_code == 429:
            r = await c.post(GROQ_URL, headers=headers, json={**payload, "model": GROQ_MODEL_FALLBACK})
        r.raise_for_status()
        return r.json()


def _prompt(difficulty: str, existing: list) -> str:
    seed = random.choice(["unique", "fresh", "distinct", "novel", "original"]) + f"-{int(time.time()) % 9999}"
    avoid = ""
    if existing:
        avoid = "\nDo NOT repeat any of these already-used problems:\n" + "\n".join(f"- {t}" for t in existing[:20]) + "\n"
    difficulty_desc = DIFFICULTY_DESCRIPTIONS.get(difficulty, difficulty)
    return (
        f"[{seed}] Generate ONE original JavaScript coding interview problem.\n"
        f"Difficulty target: {difficulty_desc}\n"
        f"{avoid}\n"
        "STRICT REQUIREMENTS:\n"
        "1. The solution must be a single function named exactly `solve`.\n"
        "2. `solve` takes plain JSON-serializable arguments (numbers, strings, arrays, objects, booleans) and returns a JSON-serializable value.\n"
        "3. Provide 4 to 6 test cases. Each test case's \"input\" is a JSON ARRAY of the arguments to pass to solve(...args), "
        "and \"expected\" is the exact JSON return value.\n"
        "4. Include at least one edge case (empty input, zero, negative, etc.).\n"
        "5. \"modelAnswer\" must be complete, runnable JS defining `function solve(...) { ... }` — no explanation text, no markdown fences.\n"
        "6. Each test case also needs a short \"explanation\": one plain-English sentence walking through *why* that input "
        "produces that expected output (e.g. \"Duplicates are removed left-to-right, so 'aab' keeps the first 'a' and drops the second.\"). "
        "Plain English only — no code, no pseudocode.\n\n"
        "Return ONLY raw JSON in this exact shape:\n"
        "{\n"
        '  "title": "Short problem title",\n'
        '  "description": "Full problem statement, plain text, describe the solve(...) signature clearly",\n'
        f'  "difficulty": "{difficulty}",\n'
        '  "testCases": [{"input": [..args], "expected": <value>, "explanation": "why this input gives this output, in plain English"}, ...],\n'
        '  "modelAnswer": "function solve(...) { ... }"\n'
        "}"
    )


async def _generate_once(difficulty: str, existing_titles: list) -> dict:
    r = await _groq_call({
        "messages": [
            {"role": "system", "content": "You are a senior frontend interviewer writing original JS coding problems. Output ONLY raw JSON, no markdown, no commentary."},
            {"role": "user", "content": _prompt(difficulty, existing_titles)},
        ],
        "temperature": 0.9,
        "top_p": 0.95,
        "max_tokens": 1500,
    })
    content = r["choices"][0]["message"]["content"]
    obj = _extract_object(content)

    if not obj.get("title") or not obj.get("testCases") or not obj.get("modelAnswer"):
        raise ValueError("Incomplete question generated")
    if not isinstance(obj["testCases"], list) or len(obj["testCases"]) < 3:
        raise ValueError("Not enough test cases generated")

    return obj


async def generate_coding_question(difficulty: str, exclude_titles: set = None, exclude_hashes: set = None) -> dict:
    """Generates a question, verifies the AI's own modelAnswer actually passes every
    test case in the sandbox, and retries (bounded) if it doesn't. Raises on repeated
    failure — callers should surface a clear 'AI unavailable' message rather than ever
    serving an unverified question."""
    exclude_titles = exclude_titles or set()
    last_error = None

    for _ in range(MAX_GENERATION_ATTEMPTS):
        try:
            candidate = await _generate_once(difficulty, list(exclude_titles))
            title = candidate["title"]

            if check_question_duplicate(title, exclude_titles, similarity_threshold=0.80):
                exclude_titles.add(title)
                continue

            results = await run_test_cases(candidate["modelAnswer"], candidate["testCases"])
            if not all_passed(results):
                last_error = f"model answer failed self-check: {results}"
                continue

            return candidate
        except Exception as e:
            last_error = str(e)
            continue

    raise RuntimeError(f"Could not generate a verified coding question: {last_error}")
