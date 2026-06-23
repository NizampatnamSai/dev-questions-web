from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from routers.auth import current_user
from utils.ai import GROQ_API_KEY, GROQ_URL, GROQ_MODEL, GROQ_MODEL_FALLBACK
import httpx

router = APIRouter()

SYSTEM_PROMPT = (
    "You are a knowledgeable, friendly AI assistant embedded in DevQuiz — a developer learning platform. "
    "Answer any question clearly and concisely. For technical topics, use examples. "
    "For conceptual questions, give a structured explanation. "
    "Format your answer in plain text with clear paragraphs. "
    "Use numbered or bulleted lists where helpful. Keep answers focused and practical."
)

class AskBody(BaseModel):
    question: str

async def _groq_ask(question: str) -> str:
    if not GROQ_API_KEY:
        raise HTTPException(503, "AI service not configured")
    headers = {"Authorization": f"Bearer {GROQ_API_KEY}"}
    payload = {
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user",   "content": question},
        ],
        "temperature": 0.7,
        "max_tokens": 1024,
    }
    async with httpx.AsyncClient(timeout=30) as c:
        r = await c.post(GROQ_URL, headers=headers, json={**payload, "model": GROQ_MODEL})
        if r.status_code == 429:
            r = await c.post(GROQ_URL, headers=headers, json={**payload, "model": GROQ_MODEL_FALLBACK})
        r.raise_for_status()
    return r.json()["choices"][0]["message"]["content"].strip()


@router.post("/ask")
async def ask(body: AskBody, _user=Depends(current_user)):
    q = body.question.strip()
    if not q:
        raise HTTPException(400, "Question is required")
    if len(q) > 2000:
        raise HTTPException(400, "Question too long (max 2000 chars)")
    answer = await _groq_ask(q)
    return {"answer": answer}
