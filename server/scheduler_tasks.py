from datetime import datetime, date, timezone, timedelta
from db_mongo import col_notify_schedules, col_fcm_tokens, col_challenge_progress, col_workboard_members, col_user_notifications, notifications_enabled
from utils.firebase import send_to_tokens


async def _log_user_notification(user_id: str, title: str, body: str, notif_type: str):
    if not await notifications_enabled():
        return
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
    """Workboard reminder (time set via admin app-config) — Mon-Sat, skip even Saturdays.
    Only nudges members who haven't posted yet today; posters get no notification."""
    now_ist = datetime.now(IST)
    print(f"[workboard] fired at {now_ist.strftime('%A %Y-%m-%d %H:%M')} IST", flush=True)
    if not _is_working_day(now_ist):
        print(f"[workboard] skipping — not a working day ({now_ist.strftime('%A %d')})", flush=True)
        return

    members = await col_workboard_members().find({"status": "active"}).to_list(200)
    print(f"[workboard] {len(members)} active members found", flush=True)

    today = now_ist.strftime("%Y-%m-%d")
    from db_mongo import col_workboard_posts
    from utils.leaves import is_user_on_leave
    posted_docs = await col_workboard_posts().find({"date": today}).to_list(200)
    posted_ids = {d["userId"] for d in posted_docs}

    sent = 0
    skipped_leave = 0
    for member in members:
        uid = member["userId"]
        if uid in posted_ids:
            continue
        if await is_user_on_leave(uid, today):
            skipped_leave += 1
            continue
        tokens_docs = await col_fcm_tokens().find({"userId": uid}).to_list(10)
        tokens = [t["token"] for t in tokens_docs]
        if not tokens:
            print(f"[workboard] no FCM token for userId={uid}", flush=True)
            continue
        sent += 1
        await send_to_tokens(tokens,
            title="📋 Write about today's work",
            body="Share your daily update with the team! 👀",
            data={"type": "workboard_reminder", "path": "/workboard"},
        )
    print(f"[workboard] done — reminded {sent} non-posters (of {len(members)} members, {len(posted_ids)} already posted, {skipped_leave} on leave)", flush=True)


async def fire_workboard_afternoon_reminder():
    """Second, fixed 3pm IST catch-up nudge — distinct from the admin-configurable
    morning reminder above. Same 'only non-posters' logic, later in the day for
    anyone who still hasn't posted by then."""
    now_ist = datetime.now(IST)
    print(f"[workboard-3pm] fired at {now_ist.strftime('%A %Y-%m-%d %H:%M')} IST", flush=True)
    if not _is_working_day(now_ist):
        print(f"[workboard-3pm] skipping — not a working day ({now_ist.strftime('%A %d')})", flush=True)
        return

    members = await col_workboard_members().find({"status": "active"}).to_list(200)
    today = now_ist.strftime("%Y-%m-%d")
    from db_mongo import col_workboard_posts
    from utils.leaves import is_user_on_leave
    posted_docs = await col_workboard_posts().find({"date": today}).to_list(200)
    posted_ids = {d["userId"] for d in posted_docs}

    sent = 0
    skipped_leave = 0
    for member in members:
        uid = member["userId"]
        if uid in posted_ids:
            continue
        if await is_user_on_leave(uid, today):
            skipped_leave += 1
            continue
        tokens_docs = await col_fcm_tokens().find({"userId": uid}).to_list(10)
        tokens = [t["token"] for t in tokens_docs]
        if not tokens:
            continue
        sent += 1
        await send_to_tokens(tokens,
            title="⏰ Still haven't posted today?",
            body="It's 3pm — don't forget to share your work update! 👀",
            data={"type": "workboard_reminder", "path": "/workboard"},
        )
        await _log_user_notification(uid, "⏰ Still haven't posted today?", "It's 3pm — don't forget to share your work update!", "workboard_reminder")
    print(f"[workboard-3pm] done — reminded {sent} non-posters (of {len(members)} members, {len(posted_ids)} already posted, {skipped_leave} on leave)", flush=True)


async def fire_community_reminder():
    """Notify today's designated community poster — time configurable from admin."""
    from db_mongo import col_users, col_community_schedule
    now_ist = datetime.now(IST)
    wd = now_ist.weekday()
    print(f"[community_reminder] fired at {now_ist.strftime('%A %Y-%m-%d %H:%M')} IST, weekday={wd}", flush=True)

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
        print(f"[community_reminder] no user found for email={email}", flush=True)
        return
    uid = str(user_doc["_id"])
    user_name = user_doc.get("name", email)
    today_str = now_ist.strftime("%Y-%m-%d")

    async def _notify_admins(title: str, body: str, notif_type: str):
        admins = await col_users().find({"role": {"$in": ["admin", "sub_admin"]}}).to_list(20)
        admin_ids = [str(a["_id"]) for a in admins]
        if not admin_ids:
            return
        token_docs = await col_fcm_tokens().find({"userId": {"$in": admin_ids}}).to_list(200)
        tokens = [t["token"] for t in token_docs]
        if tokens:
            await send_to_tokens(tokens, title=title, body=body, data={"type": notif_type, "path": "/community"})
        for admin_id in admin_ids:
            await _log_user_notification(admin_id, title, body, notif_type)

    # On leave — skip pinging them entirely; admins already have posting
    # rights on any day (questions.py's create() bypass), so just ask one of
    # them to cover instead of leaving the day's post silently missed.
    from utils.leaves import is_user_on_leave
    if await is_user_on_leave(uid, today_str):
        await _notify_admins(
            "🏖️ Cover for a teammate today",
            f"{user_name} is on leave today — it's their turn to post to Community. Please post on their behalf.",
            "community_reminder_leave",
        )
        print(f"[community_reminder] {user_name} on leave — notified admins to cover", flush=True)
        return

    # Already posted today — nothing to remind about. Same UTC-midnight day
    # boundary questions.py's own daily-post-limit check uses, for consistency.
    from db_mongo import col_questions
    today_start = datetime.combine(date.today(), datetime.min.time()).replace(tzinfo=timezone.utc)
    already_posted = await col_questions().count_documents({"userId": uid, "createdAt": {"$gte": today_start}}) > 0
    if already_posted:
        print(f"[community_reminder] {user_name} already posted today — skipping", flush=True)
        return

    toks = await col_fcm_tokens().find({"userId": uid}).to_list(10)
    tokens = [t["token"] for t in toks]
    if tokens:
        await send_to_tokens(tokens,
            title="🌟 It's your day to post!",
            body="Today is your scheduled day to share on the Community feed.",
            data={"type": "community_reminder", "path": "/notifications"},
        )
        print(f"[community_reminder] sent to {email} ({len(tokens)} token(s))", flush=True)
    else:
        print(f"[community_reminder] no FCM tokens for email={email} uid={uid}", flush=True)
    await _log_user_notification(uid, "🌟 It's your day to post!", "Today is your scheduled day to share on the Community feed.", "community_reminder")

    # CC admins so they know a reminder went out and can follow up if needed.
    await _notify_admins(
        "👀 Community reminder sent",
        f"{user_name} hasn't posted to Community today — a reminder was sent.",
        "community_reminder_admin",
    )
