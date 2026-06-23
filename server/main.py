import os
from dotenv import load_dotenv
load_dotenv()

from datetime import datetime, timezone
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from db_mongo import init_mongo, col_notify_schedules
from scheduler_tasks import fire_scheduled_notifications, fire_challenge_notifications, fire_workboard_notifications
from routers import auth, questions, stats, admin, comments, study
from routers import challenge, workboard

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
    scheduler.add_job(fire_scheduled_notifications,    "cron", second=0)
    # 10:00 AM IST = 04:30 UTC  (Mon-Sat, skip even Saturdays checked inside)
    scheduler.add_job(fire_challenge_notifications,    "cron", hour=4, minute=30, second=0)
    # 9:30 AM IST  = 04:00 UTC
    scheduler.add_job(fire_workboard_notifications,    "cron", hour=4, minute=0,  second=0)
    scheduler.start()


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


@app.get("/")
def root():
    return {"status": "DevQuiz API running"}
