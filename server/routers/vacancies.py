"""Government and public-sector vacancy listings.

The client ships a bundled copy of this same JSON so the tab renders instantly
and still works offline. This endpoint exists so the list can be corrected
mid-cycle — vacancy counts get revised, notifications drop, dates move — by
editing one file on the server rather than cutting a frontend release.

Deliberately unauthenticated and cached: it is public notification data, the
same for every caller, and nothing here is user-specific.
"""
import json
from pathlib import Path

from fastapi import APIRouter, HTTPException, Response

router = APIRouter(tags=["vacancies"])

DATA = Path(__file__).resolve().parent.parent / "data" / "vacancies.json"

# Read once at import and keep it. The file is a few KB and changes when someone
# edits it and restarts, so re-reading per request buys nothing.
_cache: dict | None = None


def _load() -> dict:
    global _cache
    if _cache is None:
        with DATA.open(encoding="utf-8") as fh:
            _cache = json.load(fh)
    return _cache


@router.get("")
@router.get("/")
async def list_vacancies(response: Response):
    """Every tracked recruitment, grouped by recruiting body."""
    try:
        data = _load()
    except FileNotFoundError:
        # The client falls back to its bundled copy on any non-200, so a 503
        # here degrades to slightly stale data rather than an empty tab.
        raise HTTPException(503, "Vacancy data unavailable")
    response.headers["Cache-Control"] = "public, max-age=300"
    return {**data, "source": "api"}
