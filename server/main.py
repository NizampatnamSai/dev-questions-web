import os
from dotenv import load_dotenv
load_dotenv()

from datetime import datetime, timezone
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from db_mongo import init_mongo, col_notify_schedules, col_community_schedule, col_app_config
from scheduler_tasks import fire_scheduled_notifications, fire_challenge_notifications, fire_workboard_notifications, fire_community_reminder
from routers import auth, questions, stats, admin, comments, study
from routers import challenge, workboard, ask, feedback, profile, discussion, difficulty, gamification, timed_challenge, advanced_study

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

    # WorkBoard reminder: read saved time from DB (default 9:30 IST = 4:00 UTC)
    wb_doc  = await col_app_config().find_one({"_id": "config"}) if True else {}
    wb_time = (wb_doc or {}).get("wb_reminder_time", "09:30")
    try:
        wb_h_ist, wb_m_ist = [int(x) for x in wb_time.split(":")]
        total_utc = wb_h_ist * 60 + wb_m_ist - 330
        wb_h_utc = (total_utc // 60) % 24
        wb_m_utc = total_utc % 60
    except Exception:
        wb_h_utc, wb_m_utc = 4, 0
    print(f"[startup] workboard_reminder scheduled at {wb_h_utc:02d}:{wb_m_utc:02d} UTC ({wb_time} IST)", flush=True)

    scheduler.add_job(fire_scheduled_notifications,    "cron", second=0)
    scheduler.add_job(fire_challenge_notifications,    "cron", hour=4, minute=30, second=0)
    scheduler.add_job(fire_workboard_notifications,    "cron", hour=wb_h_utc, minute=wb_m_utc, second=0, id="workboard_reminder")
    scheduler.add_job(fire_community_reminder, "cron", hour=cr_hour, minute=cr_minute, second=0, id="community_reminder")
    scheduler.start()
    print("[startup] ✅ Scheduler started with all jobs", flush=True)


@app.on_event("shutdown")
async def shutdown():
    scheduler.shutdown(wait=False)


@app.get("/health")
async def health():
    return {"status": "ok", "time": datetime.now(timezone.utc).isoformat()}

app.include_router(auth.router,              prefix="/api/auth")
app.include_router(questions.router,         prefix="/api/questions")
app.include_router(stats.router,             prefix="/api/stats")
app.include_router(admin.router,             prefix="/api/admin")
app.include_router(comments.router,          prefix="/api/questions")
app.include_router(study.router,             prefix="/api/study")
app.include_router(advanced_study.router,    prefix="/api/study")
app.include_router(challenge.router,         prefix="/api/challenge")
app.include_router(workboard.router,         prefix="/api/workboard")
app.include_router(ask.router,               prefix="/api/ai")
app.include_router(feedback.router,          prefix="/api/feedback")
app.include_router(profile.router,           prefix="/api/profile")
app.include_router(discussion.router,        prefix="/api/discussion")
app.include_router(difficulty.router,        prefix="/api/difficulty")
app.include_router(gamification.router,      prefix="/api/gamification")
app.include_router(timed_challenge.router,   prefix="/api/challenge")


@app.get("/")
def root():
    return {"status": "DevQuiz API running"}
