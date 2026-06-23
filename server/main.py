import os
from dotenv import load_dotenv
load_dotenv()

from datetime import datetime, timezone
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from db_mongo import init_mongo, col_notify_schedules, col_community_schedule
from scheduler_tasks import fire_scheduled_notifications, fire_challenge_notifications, fire_workboard_notifications, fire_community_reminder
from routers import auth, questions, stats, admin, comments, study
from routers import challenge, workboard, ask

app = FastAPI(title="DevQuiz API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5175", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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

    # ── Startup diagnostics ───────────────────────────────────────────────────
    sched_count = await col_notify_schedules().count_documents({})
    enabled_count = await col_notify_schedules().count_documents({"enabled": {"$ne": False}})
    print(f"[startup] notify_schedules: {sched_count} total, {enabled_count} enabled", flush=True)
    if sched_count > 0:
        docs = await col_notify_schedules().find({}).to_list(100)
        for d in docs:
            print(f"[startup]   → {d.get('userName','?')} | {d.get('day')} {d.get('hour'):02d}:{d.get('minute',0):02d} UTC | enabled={d.get('enabled')}", flush=True)
    else:
        print("[startup] ⚠️  No notification schedules found — add them via Admin → Weekly Schedules", flush=True)

    # ── Community reminder time ───────────────────────────────────────────────
    time_doc  = await col_community_schedule().find_one({"weekday": -1})
    cr_hour   = time_doc["hour"]   if time_doc else 4
    cr_minute = time_doc["minute"] if time_doc else 45
    print(f"[startup] community_reminder scheduled at {cr_hour:02d}:{cr_minute:02d} UTC ({cr_hour+5}:{(cr_minute+30)%60:02d} IST approx)", flush=True)

    scheduler.add_job(fire_scheduled_notifications,    "cron", second=0)
    scheduler.add_job(fire_challenge_notifications,    "cron", hour=4, minute=30, second=0)
    scheduler.add_job(fire_workboard_notifications,    "cron", hour=4, minute=0,  second=0)
    scheduler.add_job(fire_community_reminder, "cron", hour=cr_hour, minute=cr_minute, second=0, id="community_reminder")
    scheduler.start()
    print("[startup] ✅ Scheduler started with all jobs", flush=True)


@app.on_event("shutdown")
async def shutdown():
    scheduler.shutdown(wait=False)


@app.get("/health")
async def health():
    return {"status": "ok", "time": datetime.now(timezone.utc).isoformat()}

app.include_router(auth.router,      prefix="/api/auth")
app.include_router(questions.router, prefix="/api/questions")
app.include_router(stats.router,     prefix="/api/stats")
app.include_router(admin.router,     prefix="/api/admin")
app.include_router(comments.router,  prefix="/api/questions")
app.include_router(study.router,      prefix="/api/study")
app.include_router(challenge.router,  prefix="/api/challenge")
app.include_router(workboard.router,  prefix="/api/workboard")
app.include_router(ask.router,        prefix="/api/ai")


@app.get("/")
def root():
    return {"status": "DevQuiz API running"}
