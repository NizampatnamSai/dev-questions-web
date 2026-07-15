import os
from dotenv import load_dotenv
load_dotenv()

from datetime import datetime, timezone
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from db_mongo import init_mongo, col_notify_schedules, col_community_schedule, col_app_config
from scheduler_tasks import fire_scheduled_notifications, fire_challenge_notifications, fire_workboard_notifications, fire_workboard_afternoon_reminder, fire_community_reminder, fire_task_due_date_reminders, fire_typing_race_reminder, fire_sudoku_reminder, fire_weekly_digest, fire_scheduled_tasks, fire_scheduled_messages
from routers import auth, questions, stats, admin, comments, study
from routers import challenge, workboard, ask, feedback, profile, discussion, difficulty, gamification, timed_challenge, advanced_study, tasks, coding_questions, dev_tools, resume, notes, project_chat, jobs, meetings, uploads, admin_chat, leaves, travel, game

app = FastAPI(title="Dev Life API")

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
    cr_hour   = time_doc["hour"]   if time_doc else 9   # default 3:00 PM IST
    cr_minute = time_doc["minute"] if time_doc else 30
    cr_total_ist = (cr_hour * 60 + cr_minute + 330) % (24 * 60)  # was dropping the minute-carry into the hour (e.g. 9:30 UTC printed as "14:00 IST" instead of 15:00)
    print(f"[startup] community_reminder scheduled at {cr_hour:02d}:{cr_minute:02d} UTC ({cr_total_ist // 60:02d}:{cr_total_ist % 60:02d} IST)", flush=True)

    # WorkBoard reminder: read saved time from DB (default 15:00 IST = 9:30 UTC)
    wb_doc  = await col_app_config().find_one({"_id": "config"}) if True else {}
    wb_time = (wb_doc or {}).get("wb_reminder_time", "15:00")
    try:
        wb_h_ist, wb_m_ist = [int(x) for x in wb_time.split(":")]
        total_utc = wb_h_ist * 60 + wb_m_ist - 330
        wb_h_utc = (total_utc // 60) % 24
        wb_m_utc = total_utc % 60
    except Exception:
        wb_h_utc, wb_m_utc = 9, 30
    print(f"[startup] workboard_reminder scheduled at {wb_h_utc:02d}:{wb_m_utc:02d} UTC ({wb_time} IST)", flush=True)

    # Afternoon catch-up reminder — also admin-configurable (App Config), same conversion as above.
    wb_pm_time = (wb_doc or {}).get("wb_afternoon_reminder_time", "15:00")
    try:
        wb_pm_h_ist, wb_pm_m_ist = [int(x) for x in wb_pm_time.split(":")]
        total_pm_utc = wb_pm_h_ist * 60 + wb_pm_m_ist - 330
        wb_pm_h_utc = (total_pm_utc // 60) % 24
        wb_pm_m_utc = total_pm_utc % 60
    except Exception:
        wb_pm_h_utc, wb_pm_m_utc = 9, 30
    print(f"[startup] workboard_afternoon_reminder scheduled at {wb_pm_h_utc:02d}:{wb_pm_m_utc:02d} UTC ({wb_pm_time} IST)", flush=True)

    # Task due-date reminder: admin-configurable, default 17:00 IST (5pm)
    task_due_time = (wb_doc or {}).get("task_due_reminder_time", "17:00")
    try:
        td_h_ist, td_m_ist = [int(x) for x in task_due_time.split(":")]
        total_td_utc = td_h_ist * 60 + td_m_ist - 330
        td_h_utc = (total_td_utc // 60) % 24
        td_m_utc = total_td_utc % 60
    except Exception:
        td_h_utc, td_m_utc = 11, 30
    print(f"[startup] task_due_reminder scheduled at {td_h_utc:02d}:{td_m_utc:02d} UTC ({task_due_time} IST)", flush=True)

    # Typing Race daily play reminder: admin-configurable, default 11:00 IST
    tr_time = (wb_doc or {}).get("typing_race_reminder_time", "11:00")
    try:
        tr_h_ist, tr_m_ist = [int(x) for x in tr_time.split(":")]
        total_tr_utc = tr_h_ist * 60 + tr_m_ist - 330
        tr_h_utc = (total_tr_utc // 60) % 24
        tr_m_utc = total_tr_utc % 60
    except Exception:
        tr_h_utc, tr_m_utc = 5, 30
    print(f"[startup] typing_race_reminder scheduled at {tr_h_utc:02d}:{tr_m_utc:02d} UTC ({tr_time} IST)", flush=True)

    # Mini Sudoku daily play reminder: admin-configurable, default 11:00 IST
    sd_time = (wb_doc or {}).get("sudoku_reminder_time", "11:00")
    try:
        sd_h_ist, sd_m_ist = [int(x) for x in sd_time.split(":")]
        total_sd_utc = sd_h_ist * 60 + sd_m_ist - 330
        sd_h_utc = (total_sd_utc // 60) % 24
        sd_m_utc = total_sd_utc % 60
    except Exception:
        sd_h_utc, sd_m_utc = 5, 30
    print(f"[startup] sudoku_reminder scheduled at {sd_h_utc:02d}:{sd_m_utc:02d} UTC ({sd_time} IST)", flush=True)

    # Weekly digest (Typing Race + Sudoku activity summary): admin-configurable, default 09:00 IST on Monday
    wd_time = (wb_doc or {}).get("weekly_digest_time", "09:00")
    try:
        wd_h_ist, wd_m_ist = [int(x) for x in wd_time.split(":")]
        total_wd_utc = wd_h_ist * 60 + wd_m_ist - 330
        wd_h_utc = (total_wd_utc // 60) % 24
        wd_m_utc = total_wd_utc % 60
    except Exception:
        wd_h_utc, wd_m_utc = 3, 30
    print(f"[startup] weekly_digest scheduled at Mon {wd_h_utc:02d}:{wd_m_utc:02d} UTC ({wd_time} IST)", flush=True)

    scheduler.add_job(fire_scheduled_notifications,    "cron", second=0)
    scheduler.add_job(fire_challenge_notifications,    "cron", hour=4, minute=30, second=0)
    scheduler.add_job(fire_workboard_notifications,    "cron", hour=wb_h_utc, minute=wb_m_utc, second=0, id="workboard_reminder")
    scheduler.add_job(fire_workboard_afternoon_reminder, "cron", hour=wb_pm_h_utc, minute=wb_pm_m_utc, second=0, id="workboard_afternoon_reminder")
    scheduler.add_job(fire_community_reminder, "cron", hour=cr_hour, minute=cr_minute, second=0, id="community_reminder")
    scheduler.add_job(fire_task_due_date_reminders, "cron", hour=td_h_utc, minute=td_m_utc, second=0, id="task_due_reminder")
    scheduler.add_job(fire_typing_race_reminder, "cron", hour=tr_h_utc, minute=tr_m_utc, second=0, id="typing_race_reminder")
    scheduler.add_job(fire_sudoku_reminder, "cron", hour=sd_h_utc, minute=sd_m_utc, second=0, id="sudoku_reminder")
    scheduler.add_job(fire_weekly_digest, "cron", day_of_week="mon", hour=wd_h_utc, minute=wd_m_utc, second=0, id="weekly_digest")
    scheduler.add_job(fire_scheduled_tasks, "cron", second=0, id="scheduled_tasks")
    scheduler.add_job(fire_scheduled_messages, "cron", second=0, id="scheduled_messages")
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
app.include_router(tasks.router,             prefix="/api/tasks")
app.include_router(coding_questions.router,  prefix="/api/study")
app.include_router(dev_tools.router,         prefix="/api/dev-tools")
app.include_router(resume.router,            prefix="/api/resume")
app.include_router(notes.router,             prefix="/api/notes")
app.include_router(project_chat.router,      prefix="/api/project-chat")
app.include_router(jobs.router,              prefix="/api/jobs")
app.include_router(meetings.router,          prefix="/api/meetings")
app.include_router(uploads.router,           prefix="/api/uploads")
app.include_router(admin_chat.router,        prefix="/api/admin-chat")
app.include_router(leaves.router,            prefix="/api/leaves")
app.include_router(travel.router,            prefix="/api/travel")
app.include_router(game.router,              prefix="/api/game")


@app.get("/")
def root():
    return {"status": "Dev Life API running"}
