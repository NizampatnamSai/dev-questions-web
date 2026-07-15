import random
from datetime import datetime, timezone, timedelta
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from bson import ObjectId
from db_mongo import col_game_scores, col_sudoku_scores, col_sudoku_sessions, col_user_profiles, col_users
from deps import current_user, is_locked_out
from routers.gamification import award_points, award_badge, POINTS_MAP

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


async def _update_daily_streak(user_id: str, field_prefix: str, today_str: str) -> int:
    """Generic 'played today, extend the streak' updater — increments if the
    last qualifying day was yesterday, resets to 1 on a gap, no-ops if
    already updated today (safe to call on every submit, not just the
    day's first). Shared by Typing Race and Mini Sudoku with different
    field_prefix values so the two streaks track independently — deliberately
    separate from the existing generic login-streak field on the profile,
    which is a different metric (days logged in, not days a game was played)."""
    from datetime import date as _date, timedelta as _timedelta
    last_key, streak_key = f"{field_prefix}LastDate", f"{field_prefix}Streak"
    profile = await col_user_profiles().find_one({"userId": user_id}) or {}
    last_date = profile.get(last_key)
    streak = profile.get(streak_key, 0)
    if last_date == today_str:
        return streak
    yesterday = (_date.fromisoformat(today_str) - _timedelta(days=1)).isoformat()
    new_streak = streak + 1 if last_date == yesterday else 1
    await col_user_profiles().update_one(
        {"userId": user_id},
        {"$set": {last_key: today_str, streak_key: new_streak}},
        upsert=True,
    )
    return new_streak


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

    points_result = await award_points(user["id"], POINTS_MAP["typing_race_snippet"])
    streak = await _update_daily_streak(user["id"], "typingRace", date_str)
    new_badge = None
    if done_count >= SNIPPETS_PER_DAY:
        if await award_badge(user["id"], "speed_typist"):
            new_badge = "speed_typist"

    return {
        "wpm": wpm, "doneCount": done_count, "total": SNIPPETS_PER_DAY,
        "pointsEarned": POINTS_MAP["typing_race_snippet"], "totalPoints": points_result["points"],
        "newBadge": new_badge, "streak": streak,
    }


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
        "streak": profiles.get(user["id"], {}).get("typingRaceStreak", 0),
        "roster": ranked + in_progress + not_played,
    }


# ── Mini Sudoku — a second, lighter game, unlimited plays. Pick a size
# (6x6, 7x7, or 8x8) each time, solve it, submit — no daily cap, no "one
# shot". Each puzzle is freshly random per attempt (not a shared daily seed
# like Typing Race, since "n plays a day" means there's no single fixed
# puzzle to share): the puzzle+solution are generated once when you hit
# Start and stored server-side against a short-lived session id, so
# validating your submission never depends on re-deriving anything from
# "today's date" at submit time — the earlier date-seeded design had a real
# bug where a submission straddling midnight IST got checked against a
# DIFFERENT day's puzzle than the one actually solved, rejecting correct
# answers. Ranked daily by cumulative marks across every puzzle solved that
# day (bigger grids are worth more, faster solves earn a bonus) rather than
# by a single time, since users can play as many as they want.

SUDOKU_SIZES = (6, 7, 8, 9)

# Box dims per size — (box_h, box_w) or None for no box constraint at all.
# 7 is prime, so a 7x7 grid has no clean rectangular box subdivision; it's
# played as a pure Latin square (unique digit per row/column only, no box
# rule) rather than forcing a nonstandard box shape onto it. 9 is the
# classic/standard Sudoku size, with the usual 3x3 boxes.
SUDOKU_BOX_DIMS = {6: (2, 3), 7: None, 8: (2, 4), 9: (3, 3)}
SUDOKU_CLUE_RATIO = {6: 0.50, 7: 0.49, 8: 0.47, 9: 0.45}  # fraction of cells pre-filled

# Marks formula: base points for the size, scaled by how your time compares
# to a "par" time for that size — at par you get exactly the base amount,
# faster earns up to 1.5x, slower decays down to a 0.4x floor (still
# rewards finishing a big grid slowly over not finishing a small one).
SUDOKU_BASE_POINTS = {6: 100, 7: 160, 8: 220, 9: 280}
SUDOKU_PAR_SECONDS = {6: 90, 7: 150, 8: 240, 9: 360}
SUDOKU_MAX_TIME_MS = 2 * 60 * 60 * 1000  # 2h sanity cap, not a real limit


def _sudoku_score(size: int, time_ms: int) -> int:
    seconds = max(time_ms / 1000, 1)
    multiplier = max(0.4, min(1.5, SUDOKU_PAR_SECONDS[size] / seconds))
    return round(SUDOKU_BASE_POINTS[size] * multiplier)


def _sudoku_valid(grid: list[list[int]], size: int, box_dims, row: int, col: int, num: int) -> bool:
    if num in grid[row]:
        return False
    if num in (grid[r][col] for r in range(size)):
        return False
    if box_dims:
        box_h, box_w = box_dims
        box_row, box_col = (row // box_h) * box_h, (col // box_w) * box_w
        for r in range(box_row, box_row + box_h):
            for c in range(box_col, box_col + box_w):
                if grid[r][c] == num:
                    return False
    return True


def _generate_sudoku_solution(size: int, box_dims, rng: random.Random) -> list[list[int]]:
    grid = [[0] * size for _ in range(size)]

    def backtrack(pos: int) -> bool:
        if pos == size * size:
            return True
        row, col = divmod(pos, size)
        nums = list(range(1, size + 1))
        rng.shuffle(nums)
        for num in nums:
            if _sudoku_valid(grid, size, box_dims, row, col, num):
                grid[row][col] = num
                if backtrack(pos + 1):
                    return True
                grid[row][col] = 0
        return False

    backtrack(0)
    return grid


def _generate_sudoku_puzzle(size: int) -> tuple[list[list[int]], list[list[int]]]:
    """Returns (puzzle, solution) for a brand-new, genuinely random attempt —
    unseeded (real randomness), unlike Typing Race's date-seeded snippets,
    since there's no "same puzzle for everyone today" requirement here."""
    box_dims = SUDOKU_BOX_DIMS[size]
    rng = random.Random()
    solution = _generate_sudoku_solution(size, box_dims, rng)
    all_cells = [(r, c) for r in range(size) for c in range(size)]
    rng.shuffle(all_cells)
    clue_count = round(size * size * SUDOKU_CLUE_RATIO[size])
    keep = set(all_cells[:clue_count])
    puzzle = [
        [solution[r][c] if (r, c) in keep else 0 for c in range(size)]
        for r in range(size)
    ]
    return puzzle, solution


class SudokuStartBody(BaseModel):
    size: int


@router.post("/sudoku/start")
async def start_sudoku(body: SudokuStartBody, user=Depends(current_user)):
    if body.size not in SUDOKU_SIZES:
        raise HTTPException(400, f"size must be one of {SUDOKU_SIZES}")

    puzzle, solution = _generate_sudoku_puzzle(body.size)
    result = await col_sudoku_sessions().insert_one({
        "userId": user["id"],
        "size": body.size,
        "solution": solution,
        "createdAt": datetime.now(timezone.utc),
    })
    return {"sessionId": str(result.inserted_id), "size": body.size, "puzzle": puzzle}


class SudokuSubmitBody(BaseModel):
    sessionId: str
    grid: list[list[int]]
    timeMs: int


@router.post("/sudoku/submit")
async def submit_sudoku(body: SudokuSubmitBody, user=Depends(current_user)):
    try:
        session = await col_sudoku_sessions().find_one({"_id": ObjectId(body.sessionId)})
    except Exception:
        session = None
    if not session:
        raise HTTPException(404, "Session not found or already submitted")
    if session["userId"] != user["id"]:
        raise HTTPException(403, "Not your session")

    size = session["size"]
    if len(body.grid) != size or any(len(row) != size for row in body.grid):
        raise HTTPException(400, "Invalid grid shape")
    if body.timeMs <= 0 or body.timeMs > SUDOKU_MAX_TIME_MS:
        raise HTTPException(400, "Invalid time")

    if body.grid != session["solution"]:
        # Session stays alive on a wrong submission (client already gates
        # Submit on full+valid grid, so this only happens via tampering or a
        # genuine mistake slipping past client validation) — no partial
        # credit, no scored "wrong" attempt, just try again on the same puzzle.
        raise HTTPException(400, "That's not quite right — keep trying")

    score = _sudoku_score(size, body.timeMs)
    date_str = ist_today()
    profile = await col_user_profiles().find_one({"userId": user["id"]}) or {}
    await col_sudoku_scores().insert_one({
        "userId": user["id"],
        "userName": user.get("name", "Unknown"),
        "avatar": profile.get("avatar_url"),
        "date": date_str,
        "size": size,
        "timeMs": body.timeMs,
        "score": score,
        "createdAt": datetime.now(timezone.utc),
    })
    # One-time use — solved sessions can't be resubmitted for extra marks.
    await col_sudoku_sessions().delete_one({"_id": session["_id"]})

    points_result = await award_points(user["id"], POINTS_MAP["sudoku_solved"])
    streak = await _update_daily_streak(user["id"], "sudoku", date_str)
    solved_before = await col_sudoku_scores().count_documents({"userId": user["id"]})
    new_badge = None
    if solved_before <= 1:  # this insert was their first-ever solve
        if await award_badge(user["id"], "sudoku_solver"):
            new_badge = "sudoku_solver"

    return {
        "score": score, "timeMs": body.timeMs, "size": size,
        "pointsEarned": POINTS_MAP["sudoku_solved"], "totalPoints": points_result["points"],
        "newBadge": new_badge, "streak": streak,
    }


@router.get("/sudoku/board")
async def sudoku_board(user=Depends(current_user)):
    """Today's roster, ranked by cumulative marks across however many
    puzzles each user has solved today — not a single fixed puzzle/time,
    since play count is unlimited and size is the player's own choice."""
    date_str = ist_today()
    users = [u for u in await col_users().find({}).to_list(2000) if _is_active_user(u)]
    profiles = {p["userId"]: p for p in await col_user_profiles().find({}).to_list(2000)}

    pipeline = [
        {"$match": {"date": date_str}},
        {"$group": {
            "_id": "$userId",
            "userName": {"$first": "$userName"},
            "avatar": {"$first": "$avatar"},
            "totalScore": {"$sum": "$score"},
            "puzzlesPlayed": {"$sum": 1},
            "bestTimeMs": {"$min": "$timeMs"},
        }},
    ]
    agg = {d["_id"]: d for d in await col_sudoku_scores().aggregate(pipeline).to_list(2000)}

    ranked, not_played = [], []
    for u in users:
        uid = str(u["_id"])
        profile = profiles.get(uid, {})
        row = {"userId": uid, "userName": u.get("name", "Unknown"), "avatar": profile.get("avatar_url")}
        entry = agg.get(uid)
        if entry:
            row.update({
                "status": "ranked",
                "totalScore": entry["totalScore"],
                "puzzlesPlayed": entry["puzzlesPlayed"],
                "bestTimeMs": entry["bestTimeMs"],
            })
            ranked.append(row)
        else:
            row["status"] = "not_played"
            not_played.append(row)

    ranked.sort(key=lambda r: r["totalScore"], reverse=True)
    for i, r in enumerate(ranked):
        r["rank"] = i + 1

    my_entry = agg.get(user["id"])
    return {
        "date": date_str,
        "sizes": SUDOKU_SIZES,
        "myToday": {
            "totalScore": my_entry["totalScore"] if my_entry else 0,
            "puzzlesPlayed": my_entry["puzzlesPlayed"] if my_entry else 0,
        },
        "streak": profiles.get(user["id"], {}).get("sudokuStreak", 0),
        "roster": ranked + not_played,
    }
