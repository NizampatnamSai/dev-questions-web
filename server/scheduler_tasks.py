from datetime import datetime, timezone
from db_mongo import col_notify_schedules, col_fcm_tokens
from utils.firebase import send_to_tokens

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

    # Debug: show all schedules and why they didn't match
    if not schedules:
        all_docs = await col_notify_schedules().find({}).to_list(100)
        for d in all_docs:
            print(f"[scheduler] stored → userId={d.get('userId')} day={d.get('day')} hour={d.get('hour')} minute={d.get('minute')} enabled={d.get('enabled')} | now={day_name} {hour}:{minute:02d}", flush=True)

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
            data={"type": "weekly_motivation"},
        )
