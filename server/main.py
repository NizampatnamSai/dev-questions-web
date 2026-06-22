import os
from dotenv import load_dotenv
load_dotenv()

from datetime import datetime, timezone
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from db_mongo import init_mongo, col_notify_schedules, col_fcm_tokens
from utils.firebase import send_to_tokens
from routers import auth, questions, stats, admin, comments, study

app = FastAPI(title="DevQuiz API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5175", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
    now_utc = datetime.now(timezone.utc)
    day_name = now_utc.strftime("%A").lower()
    hour   = now_utc.hour
    minute = now_utc.minute

    print(f"[scheduler] tick {day_name} {hour:02d}:{minute:02d} UTC", flush=True)

    schedules = await col_notify_schedules().find({
        "day": day_name,
        "hour": hour,
        "$or": [
            {"minute": minute},
            {"minute": {"$exists": False}},  # old docs without minute field
        ] if minute == 0 else [{"minute": minute}],
        "enabled": {"$ne": False},  # treat missing enabled as True
    }).to_list(length=500)

    print(f"[scheduler] matched {len(schedules)} schedule(s)", flush=True)

    if not schedules:
        return

    for sched in schedules:
        uid = sched["userId"]
        tokens_docs = await col_fcm_tokens().find({"userId": uid}).to_list(length=50)
        tokens = [t["token"] for t in tokens_docs]
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


scheduler = AsyncIOScheduler()


@app.on_event("startup")
async def startup():
    await init_mongo()
    # backfill old schedule docs that were saved before the minute field was added
    await col_notify_schedules().update_many(
        {"minute": {"$exists": False}},
        {"$set": {"minute": 0}},
    )
    scheduler.add_job(fire_scheduled_notifications, "cron", second=0)  # runs every minute at :00s
    scheduler.start()


@app.on_event("shutdown")
async def shutdown():
    scheduler.shutdown(wait=False)


app.include_router(auth.router,      prefix="/api/auth")
app.include_router(questions.router, prefix="/api/questions")
app.include_router(stats.router,     prefix="/api/stats")
app.include_router(admin.router,     prefix="/api/admin")
app.include_router(comments.router,  prefix="/api/questions")
app.include_router(study.router,     prefix="/api/study")


@app.get("/")
def root():
    return {"status": "DevQuiz API running"}
