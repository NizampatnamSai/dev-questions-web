from datetime import datetime, timezone, timedelta
from db_mongo import col_notify_schedules, col_fcm_tokens, col_challenge_progress, col_workboard_members, col_user_notifications
from utils.firebase import send_to_tokens


async def _log_user_notification(user_id: str, title: str, body: str, notif_type: str):
    try:
        await col_user_notifications().insert_one({
            "userId": user_id, "title": title, "body": body,
            "type": notif_type, "read": False,
            "createdAt": datetime.now(timezone.utc),
        })
    except Exception:
        pass

MOTIVATION_MESSAGES = [
    "💪 Time to level up! A quick study session now beats cramming later.",
    "🚀 Consistency is your superpower — keep the streak alive!",
    "🎯 One topic a day keeps the interviewer away. Let's go!",
    "⚡ Top engineers never stop learning. Your daily review is ready.",
    "🔥 You're building something great — don't break the chain!",
    "🧠 10 minutes of focused study > 1 hour of distraction. Ready?",
    "🌟 Another day, another concept mastered. Open DevQuiz now!",
]

_msg_index = 0

IST = timezone(timedelta(hours=5, minutes=30))


def _is_even_saturday(dt: datetime) -> bool:
    if dt.weekday() != 5:
        return False
    week_number = (dt.day - 1) // 7 + 1
    return week_number in (2, 4)


def _is_working_day(dt: datetime) -> bool:
    """Mon-Sat, skip even Saturdays (2nd & 4th) and Sundays."""
    if dt.weekday() == 6:        # Sunday
        return False
    return not _is_even_saturday(dt)


async def fire_scheduled_notifications():
    global _msg_index
    now_utc  = datetime.now(timezone.utc)
    day_name = now_utc.strftime("%A").lower()
    hour     = now_utc.hour
    minute   = now_utc.minute

    print(f"[scheduler] tick {day_name} {hour:02d}:{minute:02d} UTC", flush=True)

    or_clause = [{"minute": minute}, {"minute": {"$exists": False}}] if minute == 0 else [{"minute": minute}]

    schedules = await col_notify_schedules().find({
        "day":     day_name,
        "hour":    hour,
        "$or":     or_clause,
        "enabled": {"$ne": False},
    }).to_list(length=500)

    print(f"[scheduler] matched {len(schedules)} schedule(s)", flush=True)

    if not schedules:
        all_docs = await col_notify_schedules().find({}).to_list(100)
        total = len(all_docs)
        print(f"[scheduler] no match — total docs in collection: {total}", flush=True)
        for d in all_docs:
            print(f"[scheduler] stored → userId={d.get('userId')} day={d.get('day')} hour={d.get('hour')} minute={d.get('minute')} enabled={d.get('enabled')} | now={day_name} {hour}:{minute:02d}", flush=True)
        if total == 0:
            print(f"[scheduler] ⚠️  notify_schedules collection is EMPTY — schedules must be re-added in Admin panel", flush=True)

    for sched in schedules:
        uid         = sched["userId"]
        tokens_docs = await col_fcm_tokens().find({"userId": uid}).to_list(length=50)
        tokens      = [t["token"] for t in tokens_docs]
        if not tokens:
            continue
        body = sched.get("message") or MOTIVATION_MESSAGES[_msg_index % len(MOTIVATION_MESSAGES)]
        _msg_index += 1
        await send_to_tokens(
            tokens,
            title="📚 DevQuiz — Study Time!",
            body=body,
            data={"type": "weekly_motivation", "path": "/notifications"},
        )
        await _log_user_notification(uid, "📚 DevQuiz — Study Time!", body, "study_reminder")


async def fire_challenge_notifications():
    """10:00 AM IST daily challenge reminder — Mon-Sat, skip even Saturdays."""
    now_ist = datetime.now(IST)
    if not _is_working_day(now_ist):
        print(f"[challenge] skipping — not a working day ({now_ist.strftime('%A %d')})", flush=True)
        return

    opted_in = await col_challenge_progress().find({"optedIn": True}).to_list(500)
    print(f"[challenge] sending to {len(opted_in)} opted-in users", flush=True)

    for prog in opted_in:
        uid = prog["userId"]
        tokens_docs = await col_fcm_tokens().find({"userId": uid}).to_list(10)
        tokens = [t["token"] for t in tokens_docs]
        if not tokens:
            continue

        # Calculate which day they're on
        from routers.challenge import get_user_day, JS_QUESTIONS
        day = get_user_day(prog["joinedAt"])
        q = JS_QUESTIONS[day - 1]

        # Skip if already answered today
        if any(a["day"] == day for a in prog.get("answers", [])):
            continue

        await send_to_tokens(
            tokens,
            title=f"🧩 Day {day}/30 — JS Challenge",
            body=f"Today: {q['title']}. Tap to solve!",
            data={"type": "js_challenge", "path": "/challenge"},
        )


async def fire_workboard_notifications():
    """9:30 AM IST workboard reminder — Mon-Sat, skip even Saturdays."""
    now_ist = datetime.now(IST)
    if not _is_working_day(now_ist):
        print(f"[workboard] skipping — not a working day ({now_ist.strftime('%A %d')})", flush=True)
        return

    members = await col_workboard_members().find({"status": "active"}).to_list(200)
    print(f"[workboard] sending to {len(members)} active members", flush=True)

    today = now_ist.strftime("%Y-%m-%d")
    from db_mongo import col_workboard_posts
    posted_docs = await col_workboard_posts().find({"date": today}).to_list(200)
    posted_ids = {d["userId"] for d in posted_docs}

    for member in members:
        uid = member["userId"]
        tokens_docs = await col_fcm_tokens().find({"userId": uid}).to_list(10)
        tokens = [t["token"] for t in tokens_docs]
        if not tokens:
            continue
        if uid in posted_ids:
            await send_to_tokens(tokens,
                title="📋 Daily Work Board",
                body="✅ You've posted today! Check what your team is up to.",
                data={"type": "workboard_reminder", "path": "/workboard"},
            )
        else:
            await send_to_tokens(tokens,
                title="📋 Write about today's work",
                body="Share your daily update with the team! 👀",
                data={"type": "workboard_reminder", "path": "/workboard"},
            )


async def fire_community_reminder():
    """Notify today's designated community poster — time configurable from admin."""
    from db_mongo import col_users, col_community_schedule
    now_ist = datetime.now(IST)
    wd = now_ist.weekday()

    DEFAULT_SCHEDULE = {
        0: "vikash.jangid.eps@gmail.com",
        1: "bhavya_joshi@eplanetsoft.com",
        2: "rishabh_swami@eplanetsoft.com",
        3: "badal_varshney@eplanetsoft.com",
        4: "priyanka_kumawat@eplanetsoft.com",
    }

    # Load schedule from DB
    docs = {d["weekday"]: d for d in await col_community_schedule().find({}).to_list(10)}
    email = None
    muted = False
    if wd in docs:
        email = docs[wd].get("email")
        muted = docs[wd].get("muted", False)
    elif wd in DEFAULT_SCHEDULE:
        email = DEFAULT_SCHEDULE[wd]

    if muted:
        print(f"[community_reminder] muted for weekday {wd} — skipping", flush=True)
        return

    if not email and wd not in (5, 6):
        return  # closed
    if wd == 6 and not email:
        return  # Sunday closed unless explicitly set

    if wd == 5 and not email:
        # Odd Saturday — notify admins
        admins = await col_users().find({"role": {"$in": ["admin", "sub_admin"]}}).to_list(10)
        for admin in admins:
            toks = await col_fcm_tokens().find({"userId": str(admin["_id"])}).to_list(10)
            tokens = [t["token"] for t in toks]
            if tokens:
                await send_to_tokens(tokens,
                    title="🌟 It's your day to post!",
                    body="Today is your scheduled day to share on the Community feed.",
                    data={"type": "community_reminder", "path": "/community"},
                )
        return

    user_doc = await col_users().find_one({"email": email})
    if not user_doc:
        return
    uid = str(user_doc["_id"])
    toks = await col_fcm_tokens().find({"userId": uid}).to_list(10)
    tokens = [t["token"] for t in toks]
    if tokens:
        await send_to_tokens(tokens,
            title="🌟 It's your day to post!",
            body="Today is your scheduled day to share on the Community feed.",
            data={"type": "community_reminder", "path": "/notifications"},
        )
    await _log_user_notification(uid, "🌟 It's your day to post!", "Today is your scheduled day to share on the Community feed.", "community_reminder")
