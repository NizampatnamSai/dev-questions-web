import json
import httpx
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from utils.ai import GROQ_API_KEY, GROQ_URL, GROQ_MODEL, GROQ_MODEL_FALLBACK, with_reasoning
from utils.project_knowledge import build_system_prompt, PROJECT_SUMMARY, ROUTES, BEHIND_THE_SCENES, PYTHON_ARCHITECTURE
from deps import optional_user

router = APIRouter()

SYSTEM_PROMPT = build_system_prompt()
VALID_PATHS = set(ROUTES.keys())


class ChatBody(BaseModel):
    message: str


async def _groq_chat(message: str) -> dict:
    if not GROQ_API_KEY:
        raise HTTPException(503, "AI service not configured")
    headers = {"Authorization": f"Bearer {GROQ_API_KEY}"}
    payload = {
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": message},
        ],
        "temperature": 0.3,
        "max_tokens": 500,
    }
    async with httpx.AsyncClient(timeout=30) as c:
        r = await c.post(GROQ_URL, headers=headers, json=with_reasoning({**payload, "model": GROQ_MODEL}))
        if r.status_code == 429:
            r = await c.post(GROQ_URL, headers=headers, json=with_reasoning({**payload, "model": GROQ_MODEL_FALLBACK}))
        r.raise_for_status()
    raw = r.json()["choices"][0]["message"]["content"].strip()
    if "```" in raw:
        raw = raw.split("```")[1]
        if raw.startswith("json"):
            raw = raw[4:]
    s, e = raw.find("{"), raw.rfind("}")
    if s == -1 or e == -1:
        return {"reply": raw.strip(), "navigateTo": None}
    try:
        obj = json.loads(raw[s:e + 1])
    except ValueError:
        return {"reply": raw.strip(), "navigateTo": None}
    nav = obj.get("navigateTo")
    if nav and nav not in VALID_PATHS:
        nav = None  # never trust the model to invent a route that doesn't exist
    return {"reply": obj.get("reply", "").strip() or "Sorry, I couldn't come up with an answer.", "navigateTo": nav}


@router.post("/ask")
async def ask_project_chat(body: ChatBody, _user=Depends(optional_user)):
    """Open to guests too — this is a product-tour assistant, not a privileged feature."""
    q = body.message.strip()
    if not q:
        raise HTTPException(400, "Message is required")
    if len(q) > 500:
        raise HTTPException(400, "Message too long (max 500 chars)")
    return await _groq_chat(q)


@router.get("/knowledge")
async def get_knowledge():
    """Powers the Admin 'Features & Docs' page — same source the chatbot uses,
    so the two can never drift out of sync."""
    return {
        "summary": PROJECT_SUMMARY,
        "routes": [
            {"path": path, "label": r["label"], "description": r["desc"], "audience": r["audience"], "python": r["python"]}
            for path, r in ROUTES.items()
        ],
        "behindTheScenes": BEHIND_THE_SCENES,
        "pythonArchitecture": PYTHON_ARCHITECTURE,
    }
