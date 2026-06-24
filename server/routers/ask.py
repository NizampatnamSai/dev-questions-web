from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from routers.auth import current_user
from utils.ai import GROQ_API_KEY, GROQ_URL, GROQ_MODEL, GROQ_MODEL_FALLBACK
from db_mongo import sid, oid, now
import httpx

def col_ai_history():
    from db_mongo import mdb
    return mdb()["ai_chat_history"]

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


# ── Chat history ──────────────────────────────────────────────────────────────

class SaveChatBody(BaseModel):
    title: str = ""
    messages: list  # [{role, text}]
    chat_id: str = ""  # if set, update existing


@router.get("/history")
async def get_history(user=Depends(current_user)):
    # Return list without heavy messages field for fast loading
    docs = await col_ai_history().find(
        {"userId": user["id"]},
        {"messages": 0}   # exclude messages from list view
    ).sort("updatedAt", -1).to_list(100)
    return [sid(d) for d in docs]


@router.get("/history/{chat_id}")
async def get_single_chat(chat_id: str, user=Depends(current_user)):
    doc = await col_ai_history().find_one({"_id": oid(chat_id), "userId": user["id"]})
    if not doc:
        raise HTTPException(404, "Chat not found")
    return sid(doc)


@router.post("/history")
async def save_chat(body: SaveChatBody, user=Depends(current_user)):
    if not body.messages:
        raise HTTPException(400, "No messages to save")
    title = body.title.strip() or (body.messages[0]["text"][:60] if body.messages else "Chat")
    ts = now()
    count = len(body.messages)
    if body.chat_id:
        await col_ai_history().update_one(
            {"_id": oid(body.chat_id), "userId": user["id"]},
            {"$set": {"messages": body.messages, "title": title, "messageCount": count, "updatedAt": ts}}
        )
        return {"id": body.chat_id, "message": "Updated"}
    else:
        result = await col_ai_history().insert_one({
            "userId": user["id"],
            "title": title,
            "messages": body.messages,
            "messageCount": count,
            "createdAt": ts,
            "updatedAt": ts,
        })
        return {"id": str(result.inserted_id), "message": "Saved"}


@router.delete("/history/{chat_id}")
async def delete_chat(chat_id: str, user=Depends(current_user)):
    await col_ai_history().delete_one({"_id": oid(chat_id), "userId": user["id"]})
    return {"message": "Deleted"}


@router.delete("/history")
async def delete_all_history(user=Depends(current_user)):
    await col_ai_history().delete_many({"userId": user["id"]})
    return {"message": "All history deleted"}
