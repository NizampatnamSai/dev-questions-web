"""
MongoDB async database layer using Motor.
Replaces db.py (SQLite). All collections are accessed via helpers below.
"""
import os, json, bcrypt
from pathlib import Path
from datetime import datetime, timezone
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId

MONGO_URL = os.getenv("MONGO_URL", "")
DB_NAME   = os.getenv("MONGO_DB", "devquiz")

# Notes can live on a separate MongoDB deployment (e.g. its own free-tier
# cluster) so the encrypted-notes collections don't eat into the main
# database's storage quota. Same API, same server, just a different
# connection string — falls back to the main database when unset.
NOTES_MONGO_URL = os.getenv("NOTES_MONGO_URL", "")
NOTES_DB_NAME   = os.getenv("NOTES_MONGO_DB", "devquiz_notes")

_client: AsyncIOMotorClient = None
_notes_client: AsyncIOMotorClient = None


def _get_client() -> AsyncIOMotorClient:
    global _client
    if _client is None:
        if not MONGO_URL:
            raise RuntimeError("MONGO_URL env var not set")
        # tz_aware=True — BSON stores datetimes as plain UTC with no timezone
        # metadata, and Motor/PyMongo return NAIVE datetimes (tzinfo=None) by
        # default even though the value IS UTC. FastAPI's jsonable_encoder
        # then serializes a naive datetime with no "Z"/"+00:00" suffix at
        # all, so the browser's `new Date(...)` silently parses it as LOCAL
        # time instead of UTC — e.g. a message sent at 15:18 IST (09:48 UTC)
        # displayed as "09:48" instead of converting to "15:18" IST. This
        # makes every datetime Motor returns timezone-aware (tzinfo=utc)
        # everywhere in the app, so serialization always includes the
        # correct offset and every client parses it unambiguously.
        _client = AsyncIOMotorClient(MONGO_URL, tz_aware=True)
    return _client


def mdb():
    return _get_client()[DB_NAME]


def _get_notes_client() -> AsyncIOMotorClient:
    global _notes_client
    if _notes_client is None:
        _notes_client = AsyncIOMotorClient(NOTES_MONGO_URL, tz_aware=True)
    return _notes_client


def notes_db():
    """Notes' own database if NOTES_MONGO_URL is set, else falls back to the
    main database — same collections, same code, just a different cluster."""
    if NOTES_MONGO_URL:
        return _get_notes_client()[NOTES_DB_NAME]
    return mdb()


# ── Collection shortcuts ──────────────────────────────────────────────────────

def col_users():                return mdb()["users"]
def col_questions():            return mdb()["questions"]
def col_comments():             return mdb()["comments"]
def col_ai_usage():             return mdb()["ai_usage"]
def col_image_gen_usage():      return mdb()["image_gen_usage"]
def col_fcm_tokens():           return mdb()["fcm_tokens"]
def col_notifications():        return mdb()["push_notifications"]
def col_streaks():              return mdb()["streaks"]
def col_progress():             return mdb()["study_progress"]
def col_notify_schedules():     return mdb()["notify_schedules"]
def col_challenge_progress():   return mdb()["challenge_progress"]
def col_workboard_members():    return mdb()["workboard_members"]
def col_workboard_posts():      return mdb()["workboard_posts"]
def col_community_schedule():   return mdb()["community_schedule"]
def col_user_answers():         return mdb()["user_answers"]
def col_user_notifications():   return mdb()["user_notifications"]
def col_app_config():           return mdb()["app_config"]


async def notifications_enabled() -> bool:
    """Single choke point for the admin 'stop/on all notifications' switch —
    checked by both push (FCM) and in-app notification creation, so testing
    new features never spams real users' devices or bells."""
    doc = await col_app_config().find_one({"_id": "config"})
    return (doc or {}).get("notifications_enabled", True)
def col_feedback():             return mdb()["feedback"]
def col_user_profiles():        return mdb()["user_profiles"]
def col_question_ratings():     return mdb()["question_ratings"]
def col_challenges():           return mdb()["challenges"]
def col_ai_questions():         return mdb()["ai_questions"]
def col_dsa_challenge():        return mdb()["dsa_challenge"]
def col_flashcards():           return mdb()["flashcards"]
def col_tasks():                return mdb()["tasks"]
def col_task_comments():        return mdb()["task_comments"]
def col_coding_questions():     return mdb()["coding_questions"]
def col_snippets():             return mdb()["snippets"]
def col_study_reviewed():       return mdb()["study_reviewed"]
def col_coding_limit_bonus():   return mdb()["coding_limit_bonus"]
def col_weak_area_insights():   return mdb()["weak_area_insights"]
def col_voice_transcripts():    return mdb()["voice_transcripts"]
def col_resume_analyses():      return mdb()["resume_analyses"]
def col_notes():                return notes_db()["notes"]
def col_note_keys():            return notes_db()["note_keys"]
def col_meetings():             return mdb()["meetings"]
def col_admin_chats():          return mdb()["admin_chats"]
def col_admin_chat_messages():  return mdb()["admin_chat_messages"]
def col_user_leaves():          return mdb()["user_leaves"]
def col_geocode_cache():        return mdb()["geocode_cache"]


# ── ID helpers ────────────────────────────────────────────────────────────────

def sid(doc: dict) -> dict:
    """Add string 'id' from ObjectId '_id', remove '_id'."""
    if doc and "_id" in doc:
        doc["id"] = str(doc.pop("_id"))
    return doc


def oid(id_str: str) -> ObjectId:
    """Convert string to ObjectId; raises ValueError if invalid."""
    try:
        return ObjectId(id_str)
    except Exception:
        raise ValueError(f"Invalid id: {id_str}")


def now() -> datetime:
    return datetime.now(timezone.utc)


def _hash(pw: str) -> str:
    return bcrypt.hashpw(pw[:72].encode(), bcrypt.gensalt()).decode()


# ── Indexes + seed ────────────────────────────────────────────────────────────

async def init_mongo():
    """Create indexes and seed demo data if DB is empty."""
    db = mdb()

    # Indexes
    await db["users"].create_index("email", unique=True)
    await db["questions"].create_index("status")
    await db["questions"].create_index("userId")
    await db["comments"].create_index("questionId")
    await db["ai_usage"].create_index([("userId", 1), ("date", 1)], unique=True)
    await db["image_gen_usage"].create_index([("userId", 1), ("date", 1)], unique=True)
    await db["fcm_tokens"].create_index([("userId", 1), ("token", 1)], unique=True)
    await db["coding_questions"].create_index([("userId", 1), ("date", 1)])
    await db["snippets"].create_index([("userId", 1), ("createdAt", -1)])
    await db["snippets"].create_index("isPublic")
    await db["study_reviewed"].create_index([("userId", 1), ("topicId", 1)], unique=True)
    await db["coding_limit_bonus"].create_index([("userId", 1), ("date", 1)], unique=True)
    await db["flashcards"].create_index([("userId", 1), ("nextReview", 1)])
    await db["flashcards"].create_index([("userId", 1), ("createdAt", -1)])
    await db["weak_area_insights"].create_index([("userId", 1), ("date", 1)], unique=True)
    await db["voice_transcripts"].create_index([("userId", 1), ("date", 1)])
    await db["resume_analyses"].create_index([("userId", 1), ("date", 1)])
    await db["push_notifications"].create_index([("createdAt", -1)])
    await db["question_ratings"].create_index("questionId")
    await db["tasks"].create_index("assigneeIds")
    await db["tasks"].create_index([("createdAt", -1)])
    await db["task_comments"].create_index("taskId")
    await db["user_profiles"].create_index("userId", unique=True)
    await db["user_answers"].create_index("questionId")
    await db["user_answers"].create_index([("userId", 1), ("questionId", 1)])
    await db["workboard_members"].create_index("userId", unique=True)
    await db["workboard_members"].create_index("status")
    await db["workboard_posts"].create_index([("date", 1)])
    await db["workboard_posts"].create_index([("userId", 1), ("date", 1)])
    await db["user_notifications"].create_index([("userId", 1), ("read", 1)])
    await db["ai_questions"].create_index("userId")
    await db["dsa_challenge"].create_index("userId")

    ndb = notes_db()
    await ndb["notes"].create_index([("userId", 1), ("createdAt", -1)])
    await ndb["note_keys"].create_index("userId", unique=True)
    if NOTES_MONGO_URL:
        print(f"✅ Notes using separate MongoDB ({NOTES_DB_NAME}).")

    await db["meetings"].create_index([("invitedUserIds", 1)])
    await db["meetings"].create_index([("createdBy", 1), ("createdAt", -1)])

    await db["admin_chats"].create_index([("adminId", 1), ("userId", 1)], unique=True)
    await db["admin_chats"].create_index([("userId", 1), ("lastMessageAt", -1)])
    await db["admin_chat_messages"].create_index([("chatId", 1), ("createdAt", 1)])

    await db["user_leaves"].create_index([("userId", 1), ("startDate", 1)])
    await db["user_leaves"].create_index([("startDate", 1), ("endDate", 1)])
    await db["geocode_cache"].create_index("query", unique=True)

    # One-time migration: old 3-stage task status -> new Jira-style 4-stage workflow.
    # Idempotent — only touches docs still on an old value, safe to run every startup.
    status_migration = {"open": "todo", "in_progress": "started", "done": "completed"}
    for old, new in status_migration.items():
        result = await db["tasks"].update_many({"status": old}, {"$set": {"status": new}})
        if result.modified_count:
            print(f"[migration] tasks: {result.modified_count} '{old}' -> '{new}'")

    # Seed only if no users yet
    if await db["users"].count_documents({}) == 0:
        await _seed(db)
    print("✅ MongoDB connected and ready.")


async def _seed(db):
    def mk_user(name, email, pw, role):
        return {
            "name":       name,
            "email":      email,
            "password":   _hash(pw),
            "role":       role,
            "dailyLimit": 25,
            "createdAt":  now(),
        }

    r = await db["users"].insert_many([
        mk_user("Admin",      "admin@devquiz.com", "Admin@123", "admin"),
        mk_user("John Doe",   "john@devquiz.com",  "User@123",  "user"),
        mk_user("Jane Smith", "jane@devquiz.com",  "User@123",  "user"),
    ])
    admin_id, john_id, jane_id = [str(i) for i in r.inserted_ids]
    owners = [admin_id, john_id, jane_id]
    authors = ["Admin", "John Doe", "Jane Smith"]

    fpath = Path(__file__).parent / "data" / "fallbackQuestions.json"
    fallback = json.loads(fpath.read_text())

    docs = []
    i = 0
    types = ["Technical", "Coding"]
    for category, levels in fallback.items():
        for level, qs in levels.items():
            for q in qs:
                from datetime import timedelta
                docs.append({
                    "userId":       owners[i % 3],
                    "authorName":   authors[i % 3],
                    "category":     category,
                    "level":        level,
                    "type":         types[i % 2],
                    "question":     q["question"],
                    "answer":       q["answer"],
                    "hints":        q.get("hints", []),
                    "tags":         q.get("tags", []),
                    "status":       "published",
                    "createdAt":    now() - timedelta(days=i % 30),
                    "upvotes":      [john_id] if i % 3 == 0 else [],
                    "bookmarks":    [john_id] if i % 5 == 0 else [],
                    "highlights":   [],
                    "commentCount": 0,
                })
                i += 1

    if docs:
        await db["questions"].insert_many(docs)
    print(f"✅ Seeded {i} questions + 3 demo users.")
