"""Online check for the Government & Banking Jobs Tracker.

For each tracked exam, ask a web-search-capable model (Groq `openai/gpt-oss-*`
with the built-in `browser_search` tool) what the recruiter has announced for
the exam's open cycles, then pass the answer through DETERMINISTIC rules before
anything is stored. The model finds things; the rules decide what is trusted.

Why the rules exist: in testing the model returned an exam's *original*
vacancy count where we already held the *revised* one, and described an
interview stage that was only on a tentative calendar. So:

  * Statuses only move forward (Expected → Notified → Exam → Result →
    Completed), never back.
  * A cycle is marked notified only with a source on the recruiter's own domain,
    or two independent sources.
  * Vacancies / dates are filled in only where we have NONE, and a vacancy
    count only when the number appears in the quoted evidence.
  * Anything that would change a figure we already hold is NOT applied — it is
    recorded as "needs review" with its sources.
  * Links are accepted only on the recruiter's official domain.
  * Whether applications are open is computed from the dates, not taken from
    the model.

Accepted changes are stored as per-cycle overrides in MongoDB
(`govt_exam_overrides`) and merged over the base JSON by the router; each run
and its change log goes to `govt_exam_refresh_runs`.
"""
from __future__ import annotations

import asyncio
import json
import os
import re
import uuid
from datetime import date, datetime, timezone
from urllib.parse import urlparse

import httpx

from db_mongo import mdb

GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"
MODELS = ["openai/gpt-oss-120b", "openai/gpt-oss-20b"]  # fallback on rate limit
PER_EXAM_TIMEOUT = 90
MAX_RETRIES = 3

STATUSES = {
    "APPLICATION_OPEN", "NOTIFICATION_RELEASED", "EXAM_SCHEDULED",
    "RESULT_AWAITED", "UPCOMING", "EXPECTED_2027", "RECRUITMENT_COMPLETED",
}
# Lifecycle stage of each status. A status may only move to a higher stage.
STAGE = {
    "EXPECTED_2027": 0, "UPCOMING": 0,
    "NOTIFICATION_RELEASED": 1, "APPLICATION_OPEN": 1,
    "EXAM_SCHEDULED": 2, "RESULT_AWAITED": 3, "RECRUITMENT_COMPLETED": 4,
}


def col_overrides():
    return mdb()["govt_exam_overrides"]


def col_runs():
    return mdb()["govt_exam_refresh_runs"]


def now() -> datetime:
    return datetime.now(timezone.utc)


# ── pure helpers (no I/O — unit-testable) ─────────────────────────────────────
def host(url: str | None) -> str:
    try:
        h = (urlparse(url or "").hostname or "").lower()
    except ValueError:
        return ""
    return h[4:] if h.startswith("www.") else h


def official_domain(exam: dict) -> str:
    """Registrable part of the recruiter's site, e.g. 'sbi.bank.in', 'ibps.in'."""
    return host((exam.get("officialSite") or {}).get("url"))


def is_official(url: str | None, exam: dict) -> bool:
    dom = official_domain(exam)
    h = host(url)
    return bool(dom and h and (h == dom or h.endswith("." + dom)))


def number_in_text(n: int, text: str) -> bool:
    """True if n appears in text, with or without Indian/Western digit grouping."""
    # Drop grouping commas only BETWEEN digits ("7,365" / "1,50,374"), then
    # compare whole numbers — so 1500 does not match inside 15000 or 2026 1500.
    ungrouped = re.sub(r"(?<=\d),(?=\d)", "", text or "")
    return str(n) in re.findall(r"\d+", ungrouped)


def parse_date(s) -> date | None:
    if not isinstance(s, str):
        return None
    try:
        return date.fromisoformat(s[:10])
    except ValueError:
        return None


def clean_urls(urls) -> list[str]:
    out = []
    for u in urls or []:
        if isinstance(u, str) and u.startswith(("http://", "https://")) and u not in out:
            out.append(u[:500])
    return out[:6]


def evaluate(exam: dict, cycle: dict, found: dict, today: date) -> tuple[dict, list[dict]]:
    """Apply the trust rules to one cycle's findings.

    Returns (patch, changes). `patch` holds only fields that passed; `changes`
    describes every difference considered — applied or not — for the log.
    """
    patch: dict = {}
    changes: list[dict] = []
    sources = clean_urls(found.get("sources"))
    evidence = str(found.get("evidence") or "")[:400]
    official_src = any(is_official(u, exam) for u in sources)
    independent = len({host(u) for u in sources if host(u)}) >= 2
    trusted = official_src or independent

    def log(field, old, new, applied, reason):
        changes.append({
            "examId": exam["id"], "exam": exam["name"], "cycleId": cycle["id"], "cycle": cycle.get("label"),
            "field": field, "old": old, "new": new, "applied": applied, "reason": reason, "sources": sources,
        })

    old_status = cycle.get("status")
    new_status = found.get("status")
    if new_status not in STATUSES:
        new_status = None

    # 1. Status — forward only; becoming "notified" needs a trusted source.
    if new_status and new_status != old_status and STAGE.get(new_status, -1) > STAGE.get(old_status, -1):
        if not sources:
            log("status", old_status, new_status, False, "No source given")
        elif STAGE[old_status] == 0 and not trusted:
            log("status", old_status, new_status, False, "Notification not confirmed by the official site or two independent sources")
        else:
            patch["status"] = new_status
            patch["statusVerified"] = bool(official_src)
            if evidence:
                patch["statusNote"] = f"Online check {today.isoformat()}: {evidence}"
            log("status", old_status, new_status, True, "Official source" if official_src else "Two independent sources")

    status_after = patch.get("status", old_status)
    notified = STAGE.get(status_after, 0) >= 1

    # 2. Vacancies — fill only when we have none, and only if the number is in the evidence.
    old_vac = (cycle.get("vacancies") or {}).get("value")
    v = found.get("vacancies_total")
    if isinstance(v, (int, float)) and not isinstance(v, bool):
        v = int(v)
        if v <= 0 or v > 200000:
            log("vacancies", old_vac, v, False, "Implausible value")
        elif old_vac is None:
            if not notified:
                log("vacancies", None, v, False, "Cycle not confirmed as notified")
            elif not number_in_text(v, evidence):
                log("vacancies", None, v, False, "Number not found in the quoted evidence")
            else:
                patch["vacancies"] = {
                    "value": v, "provenance": "OFFICIAL",
                    "note": f"Auto-updated by the online check on {today.isoformat()} — verify against the notification.",
                }
                log("vacancies", None, v, True, "Filled a missing figure")
        elif v != old_vac:
            log("vacancies", old_vac, v, False, "Differs from the figure on record — needs review")

    # 3. Application dates — fill missing ones only; sanity-check the year.
    app = dict(cycle.get("application") or {})
    new_app = {}
    for key, fkey in (("start", "application_start"), ("end", "application_end")):
        d = parse_date(found.get(fkey))
        if not d:
            continue
        if not (cycle["year"] - 1 <= d.year <= cycle["year"] + 1):
            log(f"application.{key}", app.get(key), d.isoformat(), False, "Date outside this cycle's years")
        elif not app.get(key):
            if notified:
                new_app[key] = d.isoformat()
                log(f"application.{key}", None, d.isoformat(), True, "Filled a missing date")
            else:
                log(f"application.{key}", None, d.isoformat(), False, "Cycle not confirmed as notified")
        elif app[key] != d.isoformat():
            log(f"application.{key}", app[key], d.isoformat(), False, "Differs from the date on record — needs review")
    if new_app:
        patch["application"] = {**app, **new_app, "provenance": "OFFICIAL"}

    # Open/closed is computed from dates, never taken from the model.
    a = patch.get("application", app)
    start, end = parse_date(a.get("start")), parse_date(a.get("end"))
    if STAGE.get(status_after, 0) == 1 and start and end:
        derived = "APPLICATION_OPEN" if start <= today <= end else "NOTIFICATION_RELEASED"
        if derived != status_after:
            patch["status"] = derived
            log("status", status_after, derived, True, "Derived from the application dates")

    # 4. Exam dates text — fill if missing.
    ed = found.get("exam_dates")
    if notified and isinstance(ed, str) and ed.strip() and not (cycle.get("examDates") or {}).get("text"):
        patch["examDates"] = {"text": ed.strip()[:200], "provenance": "OFFICIAL"}
        log("examDates", None, ed.strip()[:200], True, "Filled missing exam dates")

    # 5. Links — official domain only.
    for field, fkey in (("notificationLink", "notification_url"), ("applyLink", "apply_url")):
        url = found.get(fkey)
        if not isinstance(url, str) or not url.startswith("http"):
            continue
        if not is_official(url, exam):
            continue  # silently ignore third-party links
        current = (cycle.get(field) or {}).get("url")
        if field == "applyLink" and patch.get("status", old_status) != "APPLICATION_OPEN":
            continue
        if url != current:
            patch[field] = {"url": url[:500], "label": host(url)}
            log(field, current, url, True, "Official-domain link")

    if patch:
        prev = cycle.get("sources") or []
        merged = prev + [{"name": host(u), "url": u} for u in sources if u not in {p.get("url") for p in prev}]
        patch["sources"] = merged[:8]
        patch["autoUpdated"] = {"at": now().isoformat(), "evidence": evidence}
    return patch, changes


# ── model call ────────────────────────────────────────────────────────────────
PROMPT = """Today is {today}. You are checking the official recruitment status of one exam for an Indian government-jobs tracker.

Exam: {full} — {org}
Official website: {site}

What the tracker currently records:
{known}

Do at most TWO web searches (and open at most one page) to find what the recruiter has ACTUALLY announced for these cycles. Prefer the official website and the official notification PDF; well-known exam-news sites are acceptable secondary sources.

Rules:
- Report only facts stated by a source. Never infer a stage from a tentative or expected calendar. If unsure, use null.
- "status" must be one of: EXPECTED_2027, UPCOMING, NOTIFICATION_RELEASED, APPLICATION_OPEN, EXAM_SCHEDULED, RESULT_AWAITED, RECRUITMENT_COMPLETED.
- vacancies_total = total posts in the notification (a plain integer), or null.
- Dates as YYYY-MM-DD, or null.
- evidence = a short quote (max 40 words) from a source that contains the key facts, including the vacancy number if you report one.

Reply with JSON only, no prose:
{{"cycles":[{{"cycle_id":"<id from above>","status":null,"vacancies_total":null,"application_start":null,"application_end":null,"exam_dates":null,"notification_url":null,"apply_url":null,"evidence":"","sources":["<url>"]}}]}}"""


def describe(cycle: dict) -> str:
    v = (cycle.get("vacancies") or {}).get("value")
    a = cycle.get("application") or {}
    return (f'- cycle_id "{cycle["id"]}" ({cycle.get("label")}, year {cycle["year"]}): status {cycle.get("status")}; '
            f'vacancies {v if v is not None else "not announced"}; '
            f'applications {a.get("start") or "?"} to {a.get("end") or "?"}')


def extract_json(text: str) -> dict | None:
    if not text:
        return None
    m = re.search(r"\{.*\}", text, re.S)
    if not m:
        return None
    try:
        return json.loads(m.group(0))
    except json.JSONDecodeError:
        return None


async def ask_model(client: httpx.AsyncClient, prompt: str) -> dict:
    key = os.getenv("GROQ_API_KEY")
    if not key:
        raise RuntimeError("GROQ_API_KEY is not set")
    last_err = "no attempt"
    for model in MODELS:
        for attempt in range(MAX_RETRIES):
            r = await client.post(
                GROQ_URL,
                headers={"Authorization": f"Bearer {key}"},
                json={
                    "model": model,
                    "messages": [{"role": "user", "content": prompt}],
                    "tools": [{"type": "browser_search"}],
                    "tool_choice": "required",
                    "reasoning_effort": "low",
                    "max_completion_tokens": 1200,
                    "temperature": 0.1,
                },
                timeout=PER_EXAM_TIMEOUT,
            )
            if r.status_code == 429:
                wait = min(float(r.headers.get("retry-after", "10") or 10), 60)
                last_err = f"rate limited ({model})"
                await asyncio.sleep(wait)
                continue
            if r.status_code >= 400:
                last_err = f"HTTP {r.status_code}: {r.text[:200]}"
                break  # try the next model
            content = r.json()["choices"][0]["message"].get("content") or ""
            data = extract_json(content)
            if data is None:
                last_err = "model reply was not JSON"
                continue
            return data
    raise RuntimeError(last_err)


# ── run orchestration ─────────────────────────────────────────────────────────
_task: asyncio.Task | None = None


def is_running() -> bool:
    return _task is not None and not _task.done()


async def load_overrides() -> dict:
    out = {}
    async for d in col_overrides().find({}):
        out[d["_id"]] = d.get("patch") or {}
    return out


def merge(dataset: dict, overrides: dict) -> dict:
    """Return a copy of the dataset with stored overrides applied per cycle."""
    exams = []
    for e in dataset.get("exams", []):
        cycles = []
        for c in e.get("cycles", []):
            p = overrides.get(f'{e["id"]}:{c["id"]}')
            cycles.append({**c, **p} if p else c)
        exams.append({**e, "cycles": cycles})
    return {**dataset, "exams": exams}


async def _run(run_id: str, dataset: dict) -> None:
    today = date.today()
    exams = dataset.get("exams", [])
    try:
        overrides = await load_overrides()
        merged = merge(dataset, overrides)
        all_changes, errors = [], []
        async with httpx.AsyncClient() as client:
            for i, exam in enumerate(merged["exams"]):
                await col_runs().update_one({"_id": run_id}, {"$set": {"done": i, "current": exam["name"], "updatedAt": now()}})
                targets = [c for c in exam.get("cycles", []) if c.get("status") != "RECRUITMENT_COMPLETED"]
                if not targets:
                    continue
                prompt = PROMPT.format(
                    today=today.isoformat(), full=exam.get("fullName", exam["name"]), org=exam.get("organization", ""),
                    site=(exam.get("officialSite") or {}).get("url", "unknown"), known="\n".join(describe(c) for c in targets),
                )
                try:
                    data = await ask_model(client, prompt)
                except Exception as err:  # one exam failing must not stop the run
                    errors.append({"exam": exam["name"], "error": str(err)[:300]})
                    continue
                by_id = {str(x.get("cycle_id")): x for x in (data.get("cycles") or []) if isinstance(x, dict)}
                for cycle in targets:
                    found = by_id.get(str(cycle["id"]))
                    if not found:
                        continue
                    patch, changes = evaluate(exam, cycle, found, today)
                    all_changes.extend(changes)
                    if patch:
                        key = f'{exam["id"]}:{cycle["id"]}'
                        combined = {**overrides.get(key, {}), **patch}
                        overrides[key] = combined
                        await col_overrides().update_one(
                            {"_id": key}, {"$set": {"patch": combined, "updatedAt": now(), "runId": run_id}}, upsert=True
                        )
        await col_runs().update_one({"_id": run_id}, {"$set": {
            "state": "done", "done": len(exams), "current": None, "finishedAt": now(), "updatedAt": now(),
            "changes": all_changes, "errors": errors,
            "applied": sum(1 for c in all_changes if c["applied"]),
            "review": sum(1 for c in all_changes if not c["applied"]),
        }})
    except Exception as err:
        await col_runs().update_one({"_id": run_id}, {"$set": {
            "state": "failed", "error": str(err)[:500], "finishedAt": now(), "updatedAt": now(),
        }})


async def start_run(dataset: dict, user: dict | None) -> dict:
    global _task
    run_id = uuid.uuid4().hex
    doc = {
        "_id": run_id, "state": "running", "startedAt": now(), "updatedAt": now(),
        "done": 0, "total": len(dataset.get("exams", [])), "current": None,
        "requestedBy": (user or {}).get("email"), "changes": [], "errors": [],
    }
    await col_runs().insert_one(doc)
    _task = asyncio.create_task(_run(run_id, dataset))
    return doc


async def latest_run() -> dict | None:
    doc = await col_runs().find_one({}, sort=[("startedAt", -1)])
    if doc and doc.get("state") == "running" and not is_running():
        # The process restarted mid-run (e.g. a deploy) — the task is gone.
        await col_runs().update_one({"_id": doc["_id"]}, {"$set": {"state": "failed", "error": "Interrupted by a server restart"}})
        doc["state"], doc["error"] = "failed", "Interrupted by a server restart"
    return doc


async def latest_successful_run() -> dict | None:
    return await col_runs().find_one({"state": "done"}, sort=[("startedAt", -1)])
