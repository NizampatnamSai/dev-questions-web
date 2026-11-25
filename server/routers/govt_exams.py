"""Government / PSU / banking exam tracker data.

The client ships a bundled copy so the tab renders instantly and offline. This
router serves the server copy (server/data/govt-exams.json, written by
scripts/export-recruitment-data.mjs) with any verified online updates merged on
top, and runs the online check that produces those updates.

  GET  /api/govt-exams                 dataset + stored online updates
  POST /api/govt-exams/refresh         start (or join) an online check
  GET  /api/govt-exams/refresh/status  progress / result of the latest check

The online check is rate-limited: a new one starts at most every COOLDOWN for
regular users, so many people pressing Refresh cannot run up the Groq bill.
Admins can force a check. See utils/govt_exam_refresh.py for the trust rules.
"""
import json
from datetime import timedelta, timezone
from pathlib import Path

from fastapi import APIRouter, Depends, HTTPException, Response
from pydantic import BaseModel

from deps import current_user
from utils import govt_exam_refresh as refresh

router = APIRouter(tags=["govt-exams"])

DATA = Path(__file__).resolve().parent.parent / "data" / "govt-exams.json"
COOLDOWN = timedelta(hours=6)

# Re-read the file when it changes on disk, so editing it (or re-running the
# export script) takes effect without restarting the server.
_cache: dict = {"mtime": None, "data": None}


def _load() -> dict:
    mtime = DATA.stat().st_mtime
    if _cache["mtime"] != mtime:
        with DATA.open(encoding="utf-8") as fh:
            _cache["data"] = json.load(fh)
        _cache["mtime"] = mtime
    return _cache["data"]


def _run_summary(run: dict | None) -> dict | None:
    if not run:
        return None
    out = {k: v for k, v in run.items() if k != "_id"}
    out["id"] = run["_id"]
    for k in ("startedAt", "finishedAt", "updatedAt"):
        if out.get(k):
            out[k] = out[k].isoformat()
    return out


@router.get("")
@router.get("/")
async def list_govt_exams(response: Response):
    """Every tracked exam, with verified online updates applied."""
    try:
        base = _load()
    except FileNotFoundError:
        # The client falls back to its bundled copy on any non-200.
        raise HTTPException(503, "Exam tracker data unavailable")
    try:
        overrides = await refresh.load_overrides()
        last = await refresh.latest_successful_run()
    except Exception:
        overrides, last = {}, None  # DB hiccup: serve the base file rather than fail
    data = refresh.merge(base, overrides)
    response.headers["Cache-Control"] = "no-store"
    return {
        **data,
        "source": "api",
        "onlineCheck": {
            "lastCheckedAt": last["finishedAt"].isoformat() if last and last.get("finishedAt") else None,
            "updatedCycles": len(overrides),
        },
    }


class RefreshBody(BaseModel):
    force: bool = False


@router.post("/refresh")
async def start_refresh(body: RefreshBody, user: dict = Depends(current_user)):
    """Start an online check, or report the one already running / recently done."""
    if refresh.is_running():
        return {"started": False, "reason": "running", "run": _run_summary(await refresh.latest_run())}

    is_admin = user.get("role") in ("admin", "sub_admin")
    last = await refresh.latest_successful_run()
    if last and last.get("finishedAt") and not (body.force and is_admin):
        finished = last["finishedAt"]
        if finished.tzinfo is None:
            finished = finished.replace(tzinfo=timezone.utc)
        next_at = finished + COOLDOWN
        if refresh.now() < next_at:
            return {
                "started": False, "reason": "cooldown", "nextAllowedAt": next_at.isoformat(),
                "canForce": is_admin, "run": _run_summary(last),
            }

    try:
        base = _load()
    except FileNotFoundError:
        raise HTTPException(503, "Exam tracker data unavailable")
    run = await refresh.start_run(base, user)
    return {"started": True, "run": _run_summary(run)}


@router.get("/refresh/status")
async def refresh_status(_: dict = Depends(current_user)):
    return {"running": refresh.is_running(), "run": _run_summary(await refresh.latest_run())}
