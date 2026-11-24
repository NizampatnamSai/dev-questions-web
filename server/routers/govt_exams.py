"""Government / PSU / banking exam tracker data.

Same arrangement as the vacancies router: the client ships a bundled copy so the
tab renders instantly and still works offline, and this endpoint exists so the
dataset can be corrected mid-cycle — a notification drops, a vacancy count is
revised — by editing one file on the server rather than cutting a frontend
release. The Refresh button in the UI hits this.

Unauthenticated and cached: public notification data, identical for every
caller, nothing user-specific.
"""
import json
from pathlib import Path

from fastapi import APIRouter, HTTPException, Response

router = APIRouter(tags=["govt-exams"])

DATA = Path(__file__).resolve().parent.parent / "data" / "govt-exams.json"

_cache: dict | None = None


def _load() -> dict:
    global _cache
    if _cache is None:
        with DATA.open(encoding="utf-8") as fh:
            _cache = json.load(fh)
    return _cache


@router.get("")
@router.get("/")
async def list_govt_exams(response: Response):
    """Every tracked exam, with vacancies, salary, eligibility and schedule."""
    try:
        data = _load()
    except FileNotFoundError:
        # The client falls back to its bundled copy on any non-200, so this
        # degrades to slightly stale data rather than an empty tab.
        raise HTTPException(503, "Exam tracker data unavailable")
    response.headers["Cache-Control"] = "public, max-age=300"
    return {**data, "source": "api"}
