import os, json
from pathlib import Path
import httpx

OLLAMA_URL  = os.getenv("OLLAMA_URL",  "http://localhost:11434/api/generate")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "llama3")
GROQ_API_KEY        = os.getenv("GROQ_API_KEY", "")
GROQ_URL            = "https://api.groq.com/openai/v1/chat/completions"
GROQ_MODEL          = os.getenv("GROQ_MODEL",          "llama-3.3-70b-versatile")
GROQ_MODEL_FALLBACK = os.getenv("GROQ_MODEL_FALLBACK", "llama-3.1-8b-instant")

_fallback: dict = {}


def _load_fallback() -> dict:
    global _fallback
    if not _fallback:
        p = Path(__file__).parent.parent / "data" / "fallbackQuestions.json"
        _fallback = json.loads(p.read_text())
    return _fallback


def _extract_array(text: str) -> list:
    s, e = text.find("["), text.rfind("]")
    if s == -1 or e == -1:
        raise ValueError("No JSON array in response")
    return json.loads(text[s:e+1])


def _extract_object(text: str) -> dict:
    s, e = text.find("{"), text.rfind("}")
    if s == -1 or e == -1:
        raise ValueError("No JSON object in response")
    return json.loads(text[s:e+1])


def _normalize(raw: list, count: int, q_type: str) -> list:
    if not isinstance(raw, list) or not raw:
        raise ValueError("Empty array from model")
    return [
        {
            "question": q.get("question", ""),
            "answer":   q.get("answer",   ""),
            "hints":    q.get("hints",    []) if isinstance(q.get("hints"),  list) else [],
            "tags":     q.get("tags",     []) if isinstance(q.get("tags"),   list) else [],
            "type":     q_type,
        }
        for q in raw[:count]
    ]


def _fallback_questions(category: str, level: str, count: int) -> list:
    pool = _load_fallback().get(category, {}).get(level, [])
    if not pool:
        return []
    return [pool[i % len(pool)] for i in range(min(count, len(pool)))]


# ── prompts ──────────────────────────────────────────────────────────────────

def _gen_prompt(category: str, level: str, q_type: str, count: int) -> str:
    if q_type == "Coding":
        instruction = (
            "Each question must involve writing, reading, or debugging actual code.\n"
            "- For bug-fix questions: include the BUGGY code in the 'question' field as plain text (\\n for newlines).\n"
            "- The 'answer' field must have the CORRECT code first (plain text, \\n for newlines), then a brief explanation after a blank line.\n"
        )
    else:
        instruction = (
            "Each question should be conceptual/theory — no code-writing required.\n"
            "- The 'answer' should be a clear prose explanation.\n"
        )
    return (
        f"Generate {count} {level} level {category} interview questions for a frontend developer.\n"
        f"Question type: {q_type}.\n{instruction}\n"
        "Return ONLY a raw JSON array (no markdown, no code fences):\n"
        '[{"question":"...","answer":"...","hints":["h1","h2"],"tags":["t1","t2"]}]'
    )


def _answer_prompt(question: str, category: str, level: str, q_type: str) -> str:
    if q_type == "Coding":
        instruction = "The answer must have the complete working code first (plain text, \\n for newlines), then a brief explanation after a blank line."
    else:
        instruction = "The answer should be a clear, detailed prose explanation."
    return (
        f"You are a senior frontend developer and interviewer.\n\n"
        f'A user wrote this {level} {category} question (type: {q_type}):\n"{question}"\n\n'
        "1. Write a thorough correct answer.\n"
        "2. Write 2-3 short hints (guide without giving away).\n"
        "3. Write 3-5 relevant lowercase tags.\n\n"
        f"{instruction}\n\n"
        "Return ONLY a raw JSON object (no markdown):\n"
        '{"answer":"...","hints":["h1","h2"],"tags":["t1","t2"]}'
    )


# ── Ollama ───────────────────────────────────────────────────────────────────

async def _ollama_generate(prompt: str, count: int, q_type: str) -> list:
    async with httpx.AsyncClient(timeout=60) as c:
        r = await c.post(OLLAMA_URL, json={"model": OLLAMA_MODEL, "prompt": prompt, "stream": False, "format": "json"})
        r.raise_for_status()
        return _normalize(_extract_array(r.json()["response"]), count, q_type)


async def _ollama_answer(prompt: str) -> dict:
    async with httpx.AsyncClient(timeout=60) as c:
        r = await c.post(OLLAMA_URL, json={"model": OLLAMA_MODEL, "prompt": prompt, "stream": False, "format": "json"})
        r.raise_for_status()
        obj = json.loads(r.json()["response"])
        if not obj.get("answer"):
            raise ValueError("No answer from Ollama")
        return obj


# ── Groq ─────────────────────────────────────────────────────────────────────

def _is_rate_limited(r: httpx.Response) -> bool:
    return r.status_code == 429 or (r.status_code == 413 and "rate" in r.text.lower())


async def _groq_call(payload: dict) -> httpx.Response:
    """Try primary model; fall back to smaller model on rate-limit (429)."""
    if not GROQ_API_KEY:
        raise ValueError("GROQ_API_KEY not set")
    headers = {"Authorization": f"Bearer {GROQ_API_KEY}"}
    async with httpx.AsyncClient(timeout=30) as c:
        r = await c.post(GROQ_URL, headers=headers, json={**payload, "model": GROQ_MODEL})
        if _is_rate_limited(r):
            r = await c.post(GROQ_URL, headers=headers, json={**payload, "model": GROQ_MODEL_FALLBACK})
        r.raise_for_status()
        return r


async def _groq_generate(prompt: str, count: int, q_type: str) -> list:
    r = await _groq_call({
        "messages": [
            {"role": "system", "content": "Output only raw JSON arrays, no markdown, no commentary."},
            {"role": "user",   "content": prompt},
        ],
        "temperature": 0.7,
    })
    content = r.json()["choices"][0]["message"]["content"]
    return _normalize(_extract_array(content), count, q_type)


async def _groq_answer(prompt: str) -> dict:
    r = await _groq_call({
        "messages": [
            {"role": "system", "content": "Output only raw JSON objects, no markdown, no commentary."},
            {"role": "user",   "content": prompt},
        ],
        "temperature": 0.6,
    })
    content = r.json()["choices"][0]["message"]["content"]
    obj = _extract_object(content)
    if not obj.get("answer"):
        raise ValueError("No answer from Groq")
    return obj


# ── AI text action prompts ────────────────────────────────────────────────────

_ACTION_SYSTEM = {
    "improve":   "Output only a single plain-text interview question. No markdown, no JSON, no explanation.",
    "summarize": "Output only a concise plain-text summary (2-4 sentences). No markdown, no JSON.",
    "correct":   "Output only the corrected plain-text version with no commentary, no markdown, no JSON.",
    "explain":   "Output only a plain-text explanation in simple terms (3-5 sentences). No markdown, no JSON.",
}

def _action_prompt(action: str, text: str) -> str:
    prompts = {
        "improve": (
            "You are an expert frontend interview question writer.\n"
            "The user has given you either a topic or a poorly-written question.\n"
            f'Input: "{text}"\n\n'
            "Return ONLY a single well-written interview question ending with a question mark. No extra text."
        ),
        "summarize": (
            "Summarize the following text in 2-4 concise sentences suitable for a developer audience.\n\n"
            f'Text: "{text}"\n\n'
            "Return ONLY the summary as plain text."
        ),
        "correct": (
            "Correct the grammar, clarity, and technical accuracy of the following text.\n"
            "Keep the meaning the same. Return ONLY the corrected text with no explanation.\n\n"
            f'Text: "{text}"'
        ),
        "explain": (
            "Explain the following concept or question in simple, beginner-friendly terms in 3-5 sentences.\n\n"
            f'Text: "{text}"\n\n'
            "Return ONLY the explanation as plain text."
        ),
    }
    return prompts.get(action, prompts["improve"])


async def _groq_text_action(prompt: str, action: str) -> str:
    system = _ACTION_SYSTEM.get(action, _ACTION_SYSTEM["improve"])
    r = await _groq_call({
        "messages": [
            {"role": "system", "content": system},
            {"role": "user",   "content": prompt},
        ],
        "temperature": 0.6,
        "max_tokens": 400,
    })
    return r.json()["choices"][0]["message"]["content"].strip().strip('"').strip()


async def _ollama_text_action(prompt: str) -> str:
    async with httpx.AsyncClient(timeout=30) as c:
        r = await c.post(OLLAMA_URL, json={"model": OLLAMA_MODEL, "prompt": prompt, "stream": False})
        r.raise_for_status()
        return r.json()["response"].strip().strip('"').strip()


# Keep old names for backward compat
def _helper_prompt(user_input: str) -> str:
    return _action_prompt("improve", user_input)

async def _groq_helper(prompt: str) -> str:
    return await _groq_text_action(prompt, "improve")

async def _ollama_helper(prompt: str) -> str:
    return await _ollama_text_action(prompt)


# ── Public API ────────────────────────────────────────────────────────────────

async def generate_questions(category: str, level: str, q_type: str, count: int) -> dict:
    prompt = _gen_prompt(category, level, q_type, count)
    try:
        return {"source": "ollama", "questions": await _ollama_generate(prompt, count, q_type)}
    except Exception as e1:
        try:
            return {"source": "groq", "questions": await _groq_generate(prompt, count, q_type)}
        except Exception as e2:
            qs = _fallback_questions(category, level, count)
            return {
                "source": "fallback",
                "error": f"ollama: {e1}; groq: {e2}",
                "questions": [{**q, "type": q_type} for q in qs],
            }


async def ai_text_helper(user_input: str) -> str:
    """Returns a single corrected/written question as plain text."""
    return await ai_text_action("improve", user_input)


async def ai_text_action(action: str, text: str) -> str:
    """
    Perform a text action on the given input.
    action: "improve" | "summarize" | "correct" | "explain"
    Returns plain text result.
    """
    prompt = _action_prompt(action, text)
    try:
        return await _ollama_text_action(prompt)
    except Exception:
        try:
            return await _groq_text_action(prompt, action)
        except Exception:
            return text  # fallback: return input unchanged


async def generate_answer(question: str, category: str, level: str, q_type: str) -> dict:
    prompt = _answer_prompt(question, category, level, q_type)
    try:
        return {"source": "ollama", **(await _ollama_answer(prompt))}
    except Exception as e1:
        try:
            return {"source": "groq", **(await _groq_answer(prompt))}
        except Exception as e2:
            return {"source": "fallback", "error": f"ollama: {e1}; groq: {e2}", "answer": "", "hints": [], "tags": []}
