import ipaddress
import re
import socket
import time
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
import httpx
from db_mongo import col_snippets, col_fcm_tokens, col_user_notifications, sid, oid, now
from deps import current_user
from utils.firebase import send_to_tokens

router = APIRouter()

MAX_BODY_BYTES = 2 * 1024 * 1024  # 2MB cap on response body we read/return


def _is_admin(user) -> bool:
    return user.get("role") in ("admin", "sub_admin")


# ── API Request Tester (mini-Postman) — server-side proxy ─────────────────────
# A pure client-side fetch() would be blocked by CORS for most third-party
# APIs, so requests go through this proxy instead. Because it accepts an
# arbitrary user-supplied URL, it's guarded against SSRF: the hostname is
# resolved up front and rejected if it points at loopback/private/link-local/
# reserved address space (covers localhost, RFC1918 ranges, and the cloud
# metadata endpoint at 169.254.169.254). Redirects are not auto-followed —
# the caller sees the 3xx and can deliberately resend to the new URL, which
# re-runs this same check.

class FormField(BaseModel):
    key: str
    value: str


class HttpRequestBody(BaseModel):
    method: str = "GET"
    url: str
    headers: dict = {}
    body: str = ""
    bodyType: str = "raw"  # raw | form-data | x-www-form-urlencoded | none
    formFields: List[FormField] = []


def _assert_safe_url(url: str):
    from urllib.parse import urlparse

    parsed = urlparse(url)
    if parsed.scheme not in ("http", "https"):
        raise HTTPException(400, "Only http:// and https:// URLs are allowed")
    if not parsed.hostname:
        raise HTTPException(400, "URL must include a host")
    try:
        resolved = socket.gethostbyname(parsed.hostname)
    except socket.gaierror:
        raise HTTPException(400, f"Could not resolve host: {parsed.hostname}")
    ip = ipaddress.ip_address(resolved)
    if ip.is_loopback or ip.is_private or ip.is_link_local or ip.is_reserved or ip.is_multicast or ip.is_unspecified:
        raise HTTPException(400, "Requests to private/internal/loopback addresses are not allowed")


@router.post("/http-request")
async def proxy_http_request(body: HttpRequestBody):
    """No login required — this tool has no AI involved and the SSRF guard
    below doesn't depend on user identity, so it's safe to expose to guests too."""
    method = body.method.upper()
    if method not in ("GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"):
        raise HTTPException(400, f"Unsupported method: {method}")

    import asyncio
    await asyncio.to_thread(_assert_safe_url, body.url)

    # Body construction — mirrors Postman's body-type tabs. "form-data" is sent
    # as true multipart (each field as a filename-less part, the standard trick
    # for text-only multipart with httpx/requests); "x-www-form-urlencoded" is
    # sent via httpx's `data=` which handles the encoding + Content-Type itself.
    request_kwargs = {"headers": body.headers or {}}
    if method not in ("GET", "HEAD"):
        fields = {f.key: f.value for f in body.formFields if f.key}
        if body.bodyType == "form-data" and fields:
            request_kwargs["files"] = {k: (None, v) for k, v in fields.items()}
        elif body.bodyType == "x-www-form-urlencoded" and fields:
            request_kwargs["data"] = fields
        elif body.bodyType == "raw" and body.body:
            request_kwargs["content"] = body.body.encode()

    start = time.monotonic()
    try:
        async with httpx.AsyncClient(follow_redirects=False, timeout=15) as client:
            resp = await client.request(method, body.url, **request_kwargs)
    except httpx.TimeoutException:
        raise HTTPException(504, "Request timed out (15s limit)")
    except httpx.RequestError as e:
        raise HTTPException(502, f"Request failed: {str(e)}")
    elapsed_ms = round((time.monotonic() - start) * 1000)

    content = resp.content[:MAX_BODY_BYTES]
    truncated = len(resp.content) > MAX_BODY_BYTES
    try:
        text = content.decode("utf-8")
    except UnicodeDecodeError:
        text = content.decode("utf-8", errors="replace")

    return {
        "status": resp.status_code,
        "statusText": resp.reason_phrase,
        "headers": dict(resp.headers),
        "body": text,
        "timeMs": elapsed_ms,
        "sizeBytes": len(resp.content),
        "truncated": truncated,
    }


# ── Mock API Generator ──────────────────────────────────────────────────────
# Deterministic (seeded), zero-AI, zero-dependency fake data for frontend devs
# who need a real HTTP endpoint to point at before the real backend is ready —
# feed this straight into API Tester. Capped count so it can't be abused into
# a large-response generator.

import random as _random

_FIRST_NAMES = ["Aarav", "Vivaan", "Aditya", "Sneha", "Ananya", "Diya", "Ishaan", "Kabir", "Meera", "Riya",
                "James", "Olivia", "Liam", "Emma", "Noah", "Ava", "Mia", "Lucas", "Sofia", "Ethan"]
_LAST_NAMES = ["Sharma", "Verma", "Patel", "Gupta", "Kumar", "Singh", "Reddy", "Nair", "Smith", "Johnson",
               "Brown", "Davis", "Wilson", "Clark", "Lewis"]
_DOMAINS = ["example.com", "mail.com", "testmail.dev", "inbox.io"]
_WORDS = ["velocity", "cluster", "pixel", "vector", "cascade", "orbit", "signal", "matrix", "nimbus", "quartz",
          "delta", "phoenix", "harbor", "beacon", "lattice", "summit", "vertex", "falcon", "atlas", "prism"]
_COMPANIES = ["Nimbus Labs", "Quartz Systems", "Orbit Technologies", "Cascade Software", "Vertex Solutions"]


def _seeded(seed: int) -> _random.Random:
    return _random.Random(seed)


def _mock_user(i: int) -> dict:
    rng = _seeded(i * 7919)
    first, last = rng.choice(_FIRST_NAMES), rng.choice(_LAST_NAMES)
    return {
        "id": i,
        "name": f"{first} {last}",
        "email": f"{first.lower()}.{last.lower()}{i}@{rng.choice(_DOMAINS)}",
        "username": f"{first.lower()}{last.lower()}{rng.randint(10, 99)}",
        "phone": f"+1-{rng.randint(200,999)}-{rng.randint(200,999)}-{rng.randint(1000,9999)}",
        "company": rng.choice(_COMPANIES),
        "isActive": rng.choice([True, True, True, False]),
        "createdAt": f"202{rng.randint(2,5)}-{rng.randint(1,12):02d}-{rng.randint(1,28):02d}",
    }


def _mock_post(i: int) -> dict:
    rng = _seeded(i * 104729)
    title_words = rng.sample(_WORDS, 4)
    return {
        "id": i,
        "userId": rng.randint(1, 10),
        "title": " ".join(title_words).capitalize(),
        "body": " ".join(rng.choices(_WORDS, k=20)),
        "likes": rng.randint(0, 500),
        "published": rng.choice([True, False]),
    }


def _mock_product(i: int) -> dict:
    rng = _seeded(i * 15485863)
    return {
        "id": i,
        "name": f"{rng.choice(_WORDS).capitalize()} {rng.choice(['Pro', 'Lite', 'Max', 'Mini', 'Plus'])}",
        "price": round(rng.uniform(9.99, 299.99), 2),
        "currency": "USD",
        "inStock": rng.choice([True, True, False]),
        "rating": round(rng.uniform(3.0, 5.0), 1),
        "category": rng.choice(["Electronics", "Home", "Books", "Sports", "Toys"]),
    }


def _mock_todo(i: int) -> dict:
    rng = _seeded(i * 32452843)
    return {
        "id": i,
        "userId": rng.randint(1, 10),
        "title": f"{rng.choice(['Fix', 'Review', 'Update', 'Test', 'Deploy'])} {rng.choice(_WORDS)}",
        "completed": rng.choice([True, False]),
        "priority": rng.choice(["low", "medium", "high"]),
    }


def _mock_comment(i: int) -> dict:
    rng = _seeded(i * 49979687)
    first, last = rng.choice(_FIRST_NAMES), rng.choice(_LAST_NAMES)
    return {
        "id": i,
        "postId": rng.randint(1, 20),
        "name": f"{first} {last}",
        "email": f"{first.lower()}.{last.lower()}@{rng.choice(_DOMAINS)}",
        "body": " ".join(rng.choices(_WORDS, k=12)),
    }


def _mock_image(i: int) -> dict:
    rng = _seeded(i * 67867967)
    width, height = rng.choice([(400, 300), (600, 400), (800, 600), (1024, 768)])
    caption_words = rng.sample(_WORDS, 5)
    first, last = rng.choice(_FIRST_NAMES), rng.choice(_LAST_NAMES)
    # picsum.photos: free, no API key, deterministic per seed — same seed always returns the same image
    seed = f"devquiz-{i}"
    return {
        "id": i,
        "url": f"https://picsum.photos/seed/{seed}/{width}/{height}",
        "thumbnailUrl": f"https://picsum.photos/seed/{seed}/150/100",
        "width": width,
        "height": height,
        "title": " ".join(caption_words).capitalize(),
        "caption": " ".join(rng.choices(_WORDS, k=12)),
        "author": f"{first} {last}",
        "likes": rng.randint(0, 2000),
    }


_MOCK_GENERATORS = {
    "users": _mock_user,
    "posts": _mock_post,
    "products": _mock_product,
    "todos": _mock_todo,
    "comments": _mock_comment,
    "images": _mock_image,
}

MAX_MOCK_COUNT = 100


@router.get("/mock/{resource}")
async def mock_api(resource: str, count: int = 10):
    """Live, real HTTP endpoint returning deterministic fake data — no login,
    no AI, safe to hammer since it's pure in-memory generation. Same `resource`
    + `count` always returns the same data (seeded), so it behaves like a
    stable API to build a frontend against."""
    generator = _MOCK_GENERATORS.get(resource)
    if not generator:
        raise HTTPException(404, f"Unknown mock resource '{resource}'. Available: {', '.join(_MOCK_GENERATORS)}")
    count = max(1, min(count, MAX_MOCK_COUNT))
    return {"data": [generator(i) for i in range(1, count + 1)], "count": count, "resource": resource}


# ── Snippet Library ─────────────────────────────────────────────────────────

class SnippetBody(BaseModel):
    title: str
    language: str
    code: str
    description: str = ""
    tags: List[str] = []
    isPublic: bool = False


@router.get("/snippets")
async def list_snippets(
    user=Depends(current_user),
    mine: bool = False,
    language: Optional[str] = None,
    search: Optional[str] = None,
):
    query: dict = {"userId": user["id"]} if mine else {"$or": [{"userId": user["id"]}, {"isPublic": True}]}
    if language:
        query["language"] = language
    if search:
        # re.escape() so user input is matched literally, never interpreted as
        # a live regex pattern — closes a ReDoS vector (e.g. "(a+)+b") and
        # avoids surprising matches from stray regex metacharacters.
        safe_search = re.escape(search)
        query["$and"] = query.get("$and", []) + [{"$or": [
            {"title": {"$regex": safe_search, "$options": "i"}},
            {"tags": {"$regex": safe_search, "$options": "i"}},
        ]}]
    docs = await col_snippets().find(query).sort("createdAt", -1).to_list(300)
    return [sid(d) for d in docs]


@router.get("/snippets/languages")
async def snippet_languages(user=Depends(current_user)):
    langs = await col_snippets().distinct(
        "language", {"$or": [{"userId": user["id"]}, {"isPublic": True}]}
    )
    return sorted(langs)


async def _notify_public_snippet(snippet_id: str, title: str, author: dict):
    """Broadcast to everyone but the author when a snippet becomes public —
    same push + in-app pattern as admin's broadcast notifications."""
    token_docs = await col_fcm_tokens().find({"userId": {"$ne": author["id"]}}).to_list(2000)
    tokens = list({t["token"] for t in token_docs})
    body = f"{author.get('name', 'Someone')} shared a snippet: {title}"
    if tokens:
        await send_to_tokens(tokens, "📚 New public snippet", body, {"type": "snippet", "path": "/snippets"})
    uid_set = {t["userId"] for t in token_docs}
    if uid_set:
        ts = now()
        await col_user_notifications().insert_many([
            {"userId": uid, "title": "📚 New public snippet", "body": body, "type": "snippet",
             "sentBy": author["id"], "sentByName": author.get("name", "Someone"), "read": False, "createdAt": ts}
            for uid in uid_set
        ])


@router.post("/snippets")
async def create_snippet(body: SnippetBody, user=Depends(current_user)):
    if not body.title.strip() or not body.code.strip():
        raise HTTPException(400, "Title and code are required")
    doc = {
        "userId":      user["id"],
        "userName":    user.get("name", "Unknown"),
        "title":       body.title.strip(),
        "language":    body.language.strip().lower() or "text",
        "code":        body.code,
        "description": body.description.strip(),
        "tags":        [t.strip().lower() for t in body.tags if t.strip()],
        "isPublic":    body.isPublic,
        "createdAt":   now(),
        "updatedAt":   now(),
    }
    result = await col_snippets().insert_one(doc)
    doc.pop("_id", None)  # insert_one mutates doc in place, adding a non-JSON-serializable ObjectId
    doc["id"] = str(result.inserted_id)
    if body.isPublic:
        await _notify_public_snippet(doc["id"], doc["title"], user)
    return doc


@router.patch("/snippets/{snippet_id}")
async def update_snippet(snippet_id: str, body: SnippetBody, user=Depends(current_user)):
    existing = await col_snippets().find_one({"_id": oid(snippet_id)})
    if not existing:
        raise HTTPException(404, "Snippet not found")
    if existing["userId"] != user["id"] and not _is_admin(user):
        raise HTTPException(403, "Not your snippet")
    if not body.title.strip() or not body.code.strip():
        raise HTTPException(400, "Title and code are required")
    await col_snippets().update_one(
        {"_id": oid(snippet_id)},
        {"$set": {
            "title":       body.title.strip(),
            "language":    body.language.strip().lower() or "text",
            "code":        body.code,
            "description": body.description.strip(),
            "tags":        [t.strip().lower() for t in body.tags if t.strip()],
            "isPublic":    body.isPublic,
            "updatedAt":   now(),
        }},
    )
    if body.isPublic and not existing.get("isPublic"):
        await _notify_public_snippet(snippet_id, body.title.strip(), user)
    updated = await col_snippets().find_one({"_id": oid(snippet_id)})
    return sid(updated)


@router.delete("/snippets/{snippet_id}")
async def delete_snippet(snippet_id: str, user=Depends(current_user)):
    existing = await col_snippets().find_one({"_id": oid(snippet_id)})
    if not existing:
        raise HTTPException(404, "Snippet not found")
    if existing["userId"] != user["id"] and not _is_admin(user):
        raise HTTPException(403, "Not your snippet")
    await col_snippets().delete_one({"_id": oid(snippet_id)})
    return {"ok": True}
