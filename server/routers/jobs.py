"""
Recent tech job listings — sourced from Arbeitnow's free, no-key public job
board API (https://www.arbeitnow.com/api/job-board-api). A real Google Jobs
integration isn't feasible without a paid scraping API (Google has no free
public jobs API), so this is the closest free equivalent: real, live listings,
updated hourly, filtered to the last 7 days and tech-relevant tags.
"""
import time
import httpx
from datetime import datetime, timezone
from fastapi import APIRouter, Depends
from deps import optional_user

router = APIRouter()

ARBEITNOW_URL = "https://www.arbeitnow.com/api/job-board-api"
SEVEN_DAYS_SECONDS = 7 * 24 * 3600

TECH_TAGS = {
    "it", "software development", "internet and software", "information systems",
    "system and network administration", "automation engineering", "engineering",
}

_cache: dict = {"at": 0, "jobs": []}
CACHE_TTL_SECONDS = 20 * 60  # jobs update hourly upstream — 20min cache is plenty fresh


def _normalize(job: dict) -> dict:
    return {
        "title": job.get("title", "Untitled"),
        "company": job.get("company_name", "Unknown"),
        "location": job.get("location") or ("Remote" if job.get("remote") else ""),
        "remote": bool(job.get("remote")),
        "url": job.get("url", ""),
        "tags": job.get("tags", []),
        "postedAt": datetime.fromtimestamp(job["created_at"], tz=timezone.utc).isoformat()
        if job.get("created_at") else None,
    }


async def _fetch_recent_tech_jobs() -> list[dict]:
    now_ts = time.time()
    cutoff = now_ts - SEVEN_DAYS_SECONDS
    jobs: list[dict] = []
    async with httpx.AsyncClient(timeout=15) as c:
        # Results are ordered newest-first upstream, so 2 pages (~200 jobs) is
        # enough to cover a week for a niche (tech) filter without over-fetching.
        for page in (1, 2):
            r = await c.get(ARBEITNOW_URL, params={"page": page})
            r.raise_for_status()
            data = r.json().get("data", [])
            if not data:
                break
            stop = False
            for job in data:
                created = job.get("created_at")
                if created and created < cutoff:
                    stop = True
                    break
                tags_lower = {t.lower() for t in job.get("tags", [])}
                if tags_lower & TECH_TAGS:
                    jobs.append(_normalize(job))
            if stop:
                break
    jobs.sort(key=lambda j: j["postedAt"] or "", reverse=True)
    return jobs


@router.get("/recent")
async def recent_jobs(_user=Depends(optional_user)):
    """Open to guests too — job listings aren't sensitive content."""
    now_ts = time.time()
    if now_ts - _cache["at"] < CACHE_TTL_SECONDS and _cache["jobs"]:
        return {"jobs": _cache["jobs"], "cached": True, "source": "Arbeitnow"}
    try:
        jobs = await _fetch_recent_tech_jobs()
        _cache["at"] = now_ts
        _cache["jobs"] = jobs
        return {"jobs": jobs, "cached": False, "source": "Arbeitnow"}
    except Exception:
        # Serve stale cache on upstream failure rather than an empty page
        return {"jobs": _cache["jobs"], "cached": True, "source": "Arbeitnow", "stale": True}
