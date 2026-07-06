import base64
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from pydantic import BaseModel
from routers.auth import current_user
from deps import require_ai_enabled
from utils.ai import GROQ_API_KEY, GROQ_URL, GROQ_MODEL, GROQ_MODEL_FALLBACK
from db_mongo import sid, oid, now, col_image_gen_usage
import httpx

# Separate model from GROQ_MODEL — the main text model isn't vision-capable.
# Configurable via env in case Groq's available vision models change again.
import os
GROQ_VISION_MODEL = os.getenv("GROQ_VISION_MODEL", "meta-llama/llama-4-scout-17b-16e-instruct")
MAX_IMAGE_BYTES = 5 * 1024 * 1024  # 5MB, matches the other upload endpoints

# Groq has no image-generation model (verified against the live model list —
# only text/vision/speech). Pollinations.ai is a genuinely free, keyless
# text-to-image API — no signup, no cost, no rate-limit key needed on our end.
# Kept as its own daily counter (image_gen_usage), separate from the existing
# question-generation AI_DAILY_LIMIT, since these are unrelated resources.
IMAGE_GEN_DAILY_LIMIT = int(os.getenv("IMAGE_GEN_DAILY_LIMIT", "10"))

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
async def ask(body: AskBody, _user=Depends(require_ai_enabled)):
    q = body.question.strip()
    if not q:
        raise HTTPException(400, "Question is required")
    if len(q) > 2000:
        raise HTTPException(400, "Question too long (max 2000 chars)")
    answer = await _groq_ask(q)
    return {"answer": answer}


@router.post("/ask-image")
async def ask_image(
    image: UploadFile = File(...),
    question: str = Form(""),
    _user=Depends(require_ai_enabled),
):
    """Upload an image and ask about it — explain it, extract text from it,
    describe a screenshot/diagram/error, etc. The image is sent straight to
    Groq's vision model as a base64 data URL; nothing is stored server-side."""
    if not GROQ_API_KEY:
        raise HTTPException(503, "AI service not configured")
    if not (image.content_type or "").startswith("image/"):
        raise HTTPException(400, "File must be an image")
    data = await image.read()
    if len(data) > MAX_IMAGE_BYTES:
        raise HTTPException(400, "Image must be under 5MB")

    q = question.strip() or "Describe this image in detail. If it contains any text, extract and transcribe it exactly."
    b64 = base64.b64encode(data).decode()
    data_url = f"data:{image.content_type};base64,{b64}"

    headers = {"Authorization": f"Bearer {GROQ_API_KEY}"}
    payload = {
        "model": GROQ_VISION_MODEL,
        "messages": [{
            "role": "user",
            "content": [
                {"type": "text", "text": q},
                {"type": "image_url", "image_url": {"url": data_url}},
            ],
        }],
        "temperature": 0.4,
        "max_tokens": 1024,
    }
    async with httpx.AsyncClient(timeout=30) as c:
        r = await c.post(GROQ_URL, headers=headers, json=payload)
        if r.status_code != 200:
            raise HTTPException(502, "AI vision service is unavailable right now — please try again.")
    answer = r.json()["choices"][0]["message"]["content"].strip()
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


# ── Image generation (Pollinations.ai — free, no key) ──────────────────────────

async def _image_gen_usage_today(uid: str) -> int:
    today = now().strftime("%Y-%m-%d")
    doc = await col_image_gen_usage().find_one({"userId": uid, "date": today})
    return doc.get("count", 0) if doc else 0


@router.get("/generate-image/usage")
async def generate_image_usage(user=Depends(current_user)):
    used = await _image_gen_usage_today(user["id"])
    return {"used": used, "limit": IMAGE_GEN_DAILY_LIMIT, "remaining": max(0, IMAGE_GEN_DAILY_LIMIT - used)}


class ImageGenBody(BaseModel):
    prompt: str


@router.post("/generate-image")
async def generate_image(body: ImageGenBody, user=Depends(require_ai_enabled)):
    prompt = body.prompt.strip()
    if not prompt:
        raise HTTPException(400, "Prompt is required")
    if len(prompt) > 500:
        raise HTTPException(400, "Prompt too long (max 500 chars)")

    uid = user["id"]
    used = await _image_gen_usage_today(uid)
    if used >= IMAGE_GEN_DAILY_LIMIT:
        raise HTTPException(429, f"Daily image generation limit reached ({IMAGE_GEN_DAILY_LIMIT}/day). Try again tomorrow.")

    import urllib.parse
    encoded = urllib.parse.quote(prompt)
    url = f"https://image.pollinations.ai/prompt/{encoded}?width=768&height=768&nologo=true"
    try:
        async with httpx.AsyncClient(timeout=40, follow_redirects=True) as c:
            r = await c.get(url)
            r.raise_for_status()
    except Exception:
        raise HTTPException(502, "Image generation service is unavailable right now — please try again.")

    today = now().strftime("%Y-%m-%d")
    await col_image_gen_usage().update_one(
        {"userId": uid, "date": today},
        {"$inc": {"count": 1}},
        upsert=True,
    )

    b64 = base64.b64encode(r.content).decode()
    content_type = r.headers.get("content-type", "image/jpeg")
    return {"image": f"data:{content_type};base64,{b64}"}
