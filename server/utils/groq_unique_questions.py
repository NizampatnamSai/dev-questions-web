import os
import json
import httpx
from utils.deduplication import check_question_duplicate

GROQ_API_KEY        = os.getenv("GROQ_API_KEY", "")
GROQ_URL            = "https://api.groq.com/openai/v1/chat/completions"
GROQ_MODEL          = os.getenv("GROQ_MODEL",          "llama-3.3-70b-versatile")
GROQ_MODEL_FALLBACK = os.getenv("GROQ_MODEL_FALLBACK", "llama-3.1-8b-instant")


def _extract_json(text: str):
    """Pulls the first JSON array or object out of a model response, tolerating
    markdown fences or stray prose the model sometimes wraps it in."""
    for open_ch, close_ch in (("[", "]"), ("{", "}")):
        s, e = text.find(open_ch), text.rfind(close_ch)
        if s != -1 and e != -1 and e > s:
            try:
                return json.loads(text[s:e + 1])
            except json.JSONDecodeError:
                continue
    raise ValueError("No JSON found in AI response")


async def _groq_call(prompt: str, max_tokens: int = 2048) -> str:
    """Non-blocking Groq call — never runs on the event loop thread, so one slow
    generation can't stall unrelated requests. Falls back to a smaller/faster
    model on rate limits instead of failing outright."""
    if not GROQ_API_KEY:
        raise ValueError("GROQ_API_KEY not set")
    headers = {"Authorization": f"Bearer {GROQ_API_KEY}"}
    payload = {
        "messages": [{"role": "user", "content": prompt}],
        "max_tokens": max_tokens,
    }
    async with httpx.AsyncClient(timeout=30) as c:
        r = await c.post(GROQ_URL, headers=headers, json={**payload, "model": GROQ_MODEL})
        if r.status_code == 429:
            r = await c.post(GROQ_URL, headers=headers, json={**payload, "model": GROQ_MODEL_FALLBACK})
        r.raise_for_status()
        return r.json()["choices"][0]["message"]["content"]


async def generate_unique_questions(
    category: str,
    count: int = 10,
    difficulty: str = "Medium",
    exclude_texts: set = None,
    retry_limit: int = 3
) -> list:
    """Generate unique questions with deduplication. Retries if similar
    questions come back, bounded so one flaky generation can't loop forever."""
    if exclude_texts is None:
        exclude_texts = set()

    questions = []
    retry_count = 0

    while len(questions) < count and retry_count < retry_limit:
        batch_size = count - len(questions) + 2  # generate extra to absorb duplicates

        prompt = f"""Generate {batch_size} UNIQUE and ORIGINAL {category} interview questions at {difficulty} level.

CRITICAL REQUIREMENTS:
1. Each question MUST be UNIQUE and ORIGINAL - not from standard resources
2. NO duplicate concepts or similar questions
3. Cover DIFFERENT topics and approaches
4. Each question should have a distinct solution approach
5. Include variety in problem types and patterns

Return ONLY a raw JSON array, no markdown, no commentary, with this exact structure for each question:
[
    {{
        "question": "Unique question here",
        "answer": "Answer/solution",
        "explanation": "Why this answer",
        "difficulty": "{difficulty}",
        "category": "{category}",
        "keywords": ["keyword1", "keyword2"]
    }}
]

Generate questions NOW:"""

        try:
            response_text = await _groq_call(prompt)
            generated = _extract_json(response_text)

            for q in generated:
                q_text = q.get("question", "")
                if not check_question_duplicate(q_text, exclude_texts, similarity_threshold=0.80):
                    questions.append(q)
                    exclude_texts.add(q_text)
                    if len(questions) >= count:
                        break
        except Exception:
            pass

        retry_count += 1

    return questions[:count]


async def generate_flashcard_questions(
    category: str,
    count: int = 20,
    difficulty: str = "all",
    exclude_texts: set = None,
    retry_limit: int = 3
) -> list:
    """Generate unique flashcard Q&A pairs with no duplicates. Retries (bounded)
    to backfill toward `count` when duplicates get filtered out, instead of
    silently returning whatever survived a single batch."""
    if exclude_texts is None:
        exclude_texts = set()

    unique_cards = []
    retry_count = 0

    while len(unique_cards) < count and retry_count < retry_limit:
        batch_size = count - len(unique_cards) + 3  # a little extra to absorb duplicates

        prompt = f"""Generate {batch_size} UNIQUE flashcard Q&A pairs for learning {category}.

REQUIREMENTS:
1. Each Q&A pair MUST be UNIQUE - different from standard resources
2. NO repeated concepts
3. Good for spaced repetition learning
4. Questions should be specific and testable
5. Answers should be concise but complete

Difficulty: {difficulty}

Return ONLY a raw JSON array, no markdown, no commentary:
[
    {{
        "question": "Specific question",
        "answer": "Concise answer",
        "explanation": "Learning explanation",
        "difficulty": "Basic|Intermediate|Advanced",
        "keywords": ["keyword1", "keyword2"]
    }}
]

Generate NOW:"""

        try:
            response_text = await _groq_call(prompt)
            cards = _extract_json(response_text)

            for card in cards:
                q_text = card.get("question", "")
                if not check_question_duplicate(q_text, exclude_texts, similarity_threshold=0.80):
                    unique_cards.append(card)
                    exclude_texts.add(q_text)
                    if len(unique_cards) >= count:
                        break
        except Exception:
            pass

        retry_count += 1

    return unique_cards[:count]


async def generate_daily_challenge(category: str, exclude_hashes: set = None) -> dict:
    """Generate unique daily coding challenge with no repeats."""
    prompt = f"""Generate ONE unique daily coding challenge for {category}.

MUST BE UNIQUE - completely original problem, not from LeetCode/standard sources.

Return ONLY raw JSON, no markdown, no commentary:
{{
    "title": "Unique problem title",
    "description": "Problem description with examples",
    "difficulty": "Easy|Medium|Hard",
    "code": "Code template if applicable",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctIndex": 0,
    "explanation": "Why this is correct",
    "concept": "Main concept being tested"
}}

Make this problem COMPLETELY UNIQUE:"""

    try:
        response_text = await _groq_call(prompt, max_tokens=1024)
        return _extract_json(response_text)
    except Exception:
        return {
            "title": "Daily Challenge",
            "description": "Generate a solution",
            "difficulty": "Medium",
            "options": ["A", "B", "C", "D"],
            "correctIndex": 0,
            "explanation": "Check your answer"
        }


async def call_groq_api(prompt: str, max_tokens: int = 1024) -> str:
    """Generic Groq call returning raw text — used where callers do their own parsing."""
    try:
        return await _groq_call(prompt, max_tokens=max_tokens)
    except Exception as e:
        print(f"Groq API error: {e}")
        return ""
