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
    "You are a knowledgeable, friendly AI assistant embedded in Dev Life — a developer learning platform. "
    "Answer any question clearly and concisely. For technical topics, use examples. "
    "For conceptual questions, give a structured explanation. "
    "Format your answer in plain text with clear paragraphs. "
    "Use numbered or bulleted lists where helpful. Keep answers focused and practical."
)

class AskBody(BaseModel):
    question: str

async def _groq_ask(question: str, system_prompt: str = SYSTEM_PROMPT, max_tokens: int = 1024) -> str:
    if not GROQ_API_KEY:
        raise HTTPException(503, "AI service not configured")
    headers = {"Authorization": f"Bearer {GROQ_API_KEY}"}
    payload = {
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user",   "content": question},
        ],
        "temperature": 0.7,
        "max_tokens": max_tokens,
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


HUMANIZE_SYSTEM_PROMPT = (
    "You rewrite AI-generated text so it reads like it was written by a person, not a model. "
    "Keep the same meaning, facts, and roughly the same length — don't summarize or add new content. "
    "Vary sentence length and structure, cut generic AI filler and transition words "
    "(e.g. 'Moreover', 'In conclusion', 'It is important to note', 'Furthermore'), remove overly uniform "
    "paragraph structure, and drop unnecessary hedging or repetition. Keep it natural and clear, not overly casual. "
    "Return ONLY the rewritten text — no preamble, no explanation, no quotes around it."
)

# Input length cap for /humanize — matches the word limit shown in the UI.
# Enforced here (not just client-side) since this is a real cost-bearing AI call.
MAX_HUMANIZE_WORDS = 1000


class HumanizeBody(BaseModel):
    text: str


@router.post("/humanize")
async def humanize(body: HumanizeBody, _user=Depends(require_ai_enabled)):
    text = body.text.strip()
    if not text:
        raise HTTPException(400, "Text is required")
    word_count = len(text.split())
    if word_count > MAX_HUMANIZE_WORDS:
        raise HTTPException(400, f"Text too long (max {MAX_HUMANIZE_WORDS} words)")
    if not GROQ_API_KEY:
        raise HTTPException(503, "AI service not configured")

    headers = {"Authorization": f"Bearer {GROQ_API_KEY}"}
    payload = {
        "messages": [
            {"role": "system", "content": HUMANIZE_SYSTEM_PROMPT},
            {"role": "user", "content": text},
        ],
        "temperature": 0.8,
        "max_tokens": 2048,
    }
    async with httpx.AsyncClient(timeout=30) as c:
        r = await c.post(GROQ_URL, headers=headers, json={**payload, "model": GROQ_MODEL})
        if r.status_code == 429:
            r = await c.post(GROQ_URL, headers=headers, json={**payload, "model": GROQ_MODEL_FALLBACK})
        r.raise_for_status()
    result = r.json()["choices"][0]["message"]["content"].strip()
    return {"result": result}


DIAGRAM_SYSTEM_PROMPT = (
    "You turn a plain-English description of a project/system structure into a Mermaid.js "
    "flowchart diagram. Pick 'graph TD' (top-down) unless a left-right layout reads better, then "
    "use 'graph LR'. Group related pieces with Mermaid subgraphs (e.g. 'Frontend', 'Backend', "
    "'Database', 'CI/CD') when the description implies layers or folders. Use short, clear node "
    "labels (e.g. React App, Express API, MongoDB, Redux Store) and label edges with the "
    "relationship where it adds clarity (e.g. -->|REST API| ). "
    "Return ONLY the raw Mermaid code — no markdown code fences, no explanation, no preamble."
)

MAX_DIAGRAM_DESC_LEN = 800


class DiagramBody(BaseModel):
    description: str


def _strip_mermaid_fences(code: str) -> str:
    # Models routinely wrap output in ```mermaid ... ``` despite being told
    # not to — stripped here so the frontend always gets raw diagram syntax.
    code = code.strip()
    if code.startswith("```"):
        code = code.split("\n", 1)[1] if "\n" in code else ""
        if code.endswith("```"):
            code = code.rsplit("```", 1)[0]
    return code.strip()


@router.post("/diagram")
async def generate_diagram(body: DiagramBody, _user=Depends(require_ai_enabled)):
    description = body.description.strip()
    if not description:
        raise HTTPException(400, "Description is required")
    if len(description) > MAX_DIAGRAM_DESC_LEN:
        raise HTTPException(400, f"Description too long (max {MAX_DIAGRAM_DESC_LEN} chars)")
    raw = await _groq_ask(description, system_prompt=DIAGRAM_SYSTEM_PROMPT, max_tokens=1200)
    mermaid_code = _strip_mermaid_fences(raw)
    return {"mermaid": mermaid_code}


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
    ts = now()
    count = len(body.messages)
    if body.chat_id:
        existing = await col_ai_history().find_one({"_id": oid(body.chat_id), "userId": user["id"]})
        # Once a user has manually renamed a chat, every subsequent auto-save
        # (fired on every new message) must NOT silently overwrite it back to
        # an auto-derived "first message" title — only recompute the title
        # here if it's still on the default, non-custom title.
        update = {"messages": body.messages, "messageCount": count, "updatedAt": ts}
        if not (existing or {}).get("isCustomTitle"):
            update["title"] = body.title.strip() or (body.messages[0]["text"][:60] if body.messages else "Chat")
        await col_ai_history().update_one(
            {"_id": oid(body.chat_id), "userId": user["id"]},
            {"$set": update}
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


class RenameChatBody(BaseModel):
    title: str


@router.patch("/history/{chat_id}/title")
async def rename_chat(chat_id: str, body: RenameChatBody, user=Depends(current_user)):
    title = body.title.strip()
    if not title:
        raise HTTPException(400, "Title cannot be empty")
    if len(title) > 100:
        raise HTTPException(400, "Title too long (max 100 chars)")
    result = await col_ai_history().update_one(
        {"_id": oid(chat_id), "userId": user["id"]},
        # isCustomTitle marks this chat as manually renamed — save_chat()
        # checks this flag so future auto-saves (fired on every new message)
        # don't quietly overwrite the rename back to an auto-derived title.
        {"$set": {"title": title, "isCustomTitle": True}},
    )
    if result.matched_count == 0:
        raise HTTPException(404, "Chat not found")
    return {"id": chat_id, "title": title}


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
