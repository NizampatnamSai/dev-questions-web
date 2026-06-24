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

_client: AsyncIOMotorClient = None


def _get_client() -> AsyncIOMotorClient:
    global _client
    if _client is None:
        if not MONGO_URL:
            raise RuntimeError("MONGO_URL env var not set")
        _client = AsyncIOMotorClient(MONGO_URL)
    return _client


def mdb():
    return _get_client()[DB_NAME]


# ── Collection shortcuts ──────────────────────────────────────────────────────

def col_users():                return mdb()["users"]
def col_questions():            return mdb()["questions"]
def col_comments():             return mdb()["comments"]
def col_ai_usage():             return mdb()["ai_usage"]
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
def col_feedback():             return mdb()["feedback"]
def col_user_profiles():        return mdb()["user_profiles"]
def col_question_ratings():     return mdb()["question_ratings"]
def col_challenges():           return mdb()["challenges"]
def col_ai_questions():         return mdb()["ai_questions"]
def col_dsa_challenge():        return mdb()["dsa_challenge"]
def col_flashcards():           return mdb()["flashcards"]


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
    await db["fcm_tokens"].create_index([("userId", 1), ("token", 1)], unique=True)

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
