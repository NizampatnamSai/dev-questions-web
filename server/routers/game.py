import random
from datetime import datetime, timezone, timedelta
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from db_mongo import col_game_scores, col_user_profiles, col_users
from deps import current_user, is_locked_out

router = APIRouter()

IST = timezone(timedelta(hours=5, minutes=30))


def _is_active_user(doc: dict) -> bool:
    """Excludes pending signups, blocked/rejected/disabled accounts, and
    anyone under an active scheduled lockout — same status vocabulary
    deps.py's current_user() itself enforces at login, reused here so the
    Typing Race roster/reminders never show or nag a deactivated user."""
    if doc.get("status", "approved") in ("pending", "blocked", "rejected"):
        return False
    return not is_locked_out(doc)


def ist_today() -> str:
    return datetime.now(IST).strftime("%Y-%m-%d")


# A quick, no-setup daily engagement game — 3 fixed snippets a day, the SAME
# 3 for every user (seeded by today's date, so nobody can reroll for an
# easier set), one shot each. Ranked by total time across all 3. Snippets
# live server-side so a client can't alter the reference text it's timed
# against or which 3 it gets.
SNIPPETS = [
    "const sum = (a, b) => a + b;",
    "function isEven(n) { return n % 2 === 0; }",
    "const users = await db.collection('users').find({}).toArray();",
    "for (let i = 0; i < arr.length; i++) { console.log(arr[i]); }",
    "def factorial(n): return 1 if n == 0 else n * factorial(n - 1)",
    "SELECT name, email FROM users WHERE active = true;",
    "app.get('/api/health', (req, res) => res.json({ status: 'ok' }));",
    "const [count, setCount] = useState(0);",
    "class Animal: def __init__(self, name): self.name = name",
    "git commit -m 'fix: resolve race condition in scheduler'",
    "export default function App() { return <div>Hello</div>; }",
    "try { await fetch(url); } catch (err) { console.error(err); }",
    "const debounce = (fn, delay) => { let t; return () => { clearTimeout(t); t = setTimeout(fn, delay); }; };",
    "df = pd.read_csv('data.csv').dropna()",
    "docker run -p 8000:8000 --env-file .env myapp:latest",
]

SNIPPETS_PER_DAY = 3


def _todays_snippets(date_str: str) -> list[str]:
    # Seeded purely by the date string — every user (and every server
    # process/restart) derives the identical 3 snippets for that day,
    # with no state to store.
    return random.Random(date_str).sample(SNIPPETS, SNIPPETS_PER_DAY)


class SubmitBody(BaseModel):
    snippetIndex: int
    timeMs: int
    typed: str


@router.post("/typing-race/submit")
async def submit_typing_race(body: SubmitBody, user=Depends(current_user)):
    if body.snippetIndex < 0 or body.snippetIndex >= SNIPPETS_PER_DAY:
        raise HTTPException(400, "Invalid snippet index")
    if body.timeMs <= 0 or body.timeMs > 10 * 60 * 1000:
        raise HTTPException(400, "Invalid time")

    date_str = ist_today()
    existing = await col_game_scores().find_one({
        "userId": user["id"], "date": date_str, "snippetIndex": body.snippetIndex,
    })
    if existing:
        raise HTTPException(400, "You've already submitted this snippet today")

    snippet = _todays_snippets(date_str)[body.snippetIndex]

    # No partial credit and no "wrong" submissions — the frontend only lets
    # Submit fire on an exact match, and this re-checks it server-side rather
    # than trusting that: a mismatched submission is rejected outright and
    # doesn't consume today's one shot, so it doesn't need to be re-tried
    # via some other path.
    if body.typed != snippet:
        raise HTTPException(400, "Doesn't match the snippet exactly — keep typing")

    words = max(len(snippet.split()), 1)
    minutes = body.timeMs / 60000
    wpm = min(round(words / minutes) if minutes > 0 else 0, 300)  # sanity cap

    profile = await col_user_profiles().find_one({"userId": user["id"]}) or {}
    await col_game_scores().insert_one({
        "userId": user["id"],
        "userName": user.get("name", "Unknown"),
        "avatar": profile.get("avatar_url"),
        "date": date_str,
        "snippetIndex": body.snippetIndex,
        "wpm": wpm,
        "timeMs": body.timeMs,
        "createdAt": datetime.now(timezone.utc),
    })

    done_count = await col_game_scores().count_documents({"userId": user["id"], "date": date_str})
    return {"wpm": wpm, "doneCount": done_count, "total": SNIPPETS_PER_DAY}


@router.get("/typing-race/board")
async def typing_race_board(user=Depends(current_user)):
    """Single combined payload for the page's initial load — today's 3
    snippets, the current user's own progress, and the full team roster —
    replacing what would otherwise be 3 separate round trips for data that's
    all needed on first paint anyway. Same pattern as WorkBoard's own
    GET /board. Only the submit action (a mutation) stays a separate call."""
    date_str = ist_today()
    snippets = _todays_snippets(date_str)

    users = [u for u in await col_users().find({}).to_list(2000) if _is_active_user(u)]
    profiles = {p["userId"]: p for p in await col_user_profiles().find({}).to_list(2000)}
    docs = await col_game_scores().find({"date": date_str}).to_list(2000)

    by_user: dict[str, list[dict]] = {}
    for d in docs:
        by_user.setdefault(d["userId"], []).append(d)

    my_completed = sorted(
        (
            {"index": d["snippetIndex"], "wpm": d["wpm"], "timeMs": d["timeMs"]}
            for d in by_user.get(user["id"], [])
        ),
        key=lambda c: c["index"],
    )

    # Every stored entry is a verified exact match (submit rejects anything
    # else), so completing all 3 always means ranked — no separate
    # "disqualified" bucket needed anymore.
    ranked, in_progress, not_played = [], [], []
    for u in users:
        uid = str(u["_id"])
        profile = profiles.get(uid, {})
        row = {"userId": uid, "userName": u.get("name", "Unknown"), "avatar": profile.get("avatar_url")}
        entries = by_user.get(uid, [])
        if not entries:
            row["status"] = "not_played"
            not_played.append(row)
            continue
        if len(entries) < SNIPPETS_PER_DAY:
            row["status"] = "in_progress"
            row["doneCount"] = len(entries)
            in_progress.append(row)
            continue
        total_time_ms = sum(e["timeMs"] for e in entries)
        avg_wpm = round(sum(e["wpm"] for e in entries) / len(entries))
        row.update({"status": "ranked", "totalTimeMs": total_time_ms, "avgWpm": avg_wpm})
        ranked.append(row)

    ranked.sort(key=lambda r: r["totalTimeMs"])
    for i, r in enumerate(ranked):
        r["rank"] = i + 1

    return {
        "date": date_str,
        "snippets": snippets,
        "completed": my_completed,
        "roster": ranked + in_progress + not_played,
    }
