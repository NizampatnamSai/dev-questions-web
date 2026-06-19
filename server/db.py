import sqlite3, json, bcrypt
from pathlib import Path

DB_PATH = Path(__file__).parent / "db.sqlite"


def _hash(pw: str) -> str:
    return bcrypt.hashpw(pw[:72].encode(), bcrypt.gensalt()).decode()


def get_db() -> sqlite3.Connection:
    conn = sqlite3.connect(str(DB_PATH))
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL")
    conn.execute("PRAGMA foreign_keys=ON")
    return conn


def init_db():
    conn = get_db()
    conn.executescript("""
        CREATE TABLE IF NOT EXISTS users (
            id         INTEGER PRIMARY KEY AUTOINCREMENT,
            name       TEXT NOT NULL,
            email      TEXT UNIQUE NOT NULL,
            password   TEXT NOT NULL,
            role       TEXT NOT NULL DEFAULT 'user',
            created_at TEXT NOT NULL DEFAULT (datetime('now'))
        );

        CREATE TABLE IF NOT EXISTS questions (
            id         INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id    INTEGER NOT NULL,
            category   TEXT NOT NULL,
            level      TEXT NOT NULL,
            type       TEXT NOT NULL DEFAULT 'Technical',
            question   TEXT NOT NULL,
            answer     TEXT NOT NULL,
            hints      TEXT NOT NULL DEFAULT '[]',
            tags       TEXT NOT NULL DEFAULT '[]',
            status     TEXT NOT NULL DEFAULT 'draft',
            created_at TEXT NOT NULL DEFAULT (datetime('now')),
            FOREIGN KEY (user_id) REFERENCES users(id)
        );

        CREATE TABLE IF NOT EXISTS upvotes (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            question_id INTEGER NOT NULL,
            user_id     INTEGER NOT NULL,
            UNIQUE(question_id, user_id),
            FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE,
            FOREIGN KEY (user_id)     REFERENCES users(id)
        );

        CREATE TABLE IF NOT EXISTS bookmarks (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            question_id INTEGER NOT NULL,
            user_id     INTEGER NOT NULL,
            UNIQUE(question_id, user_id),
            FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE,
            FOREIGN KEY (user_id)     REFERENCES users(id)
        );

        CREATE TABLE IF NOT EXISTS ai_usage (
            id                  INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id             INTEGER NOT NULL,
            date                TEXT NOT NULL,
            questions_generated INTEGER NOT NULL DEFAULT 0,
            UNIQUE(user_id, date),
            FOREIGN KEY (user_id) REFERENCES users(id)
        );

        CREATE TABLE IF NOT EXISTS comments (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            question_id INTEGER NOT NULL,
            user_id     INTEGER NOT NULL,
            text        TEXT NOT NULL,
            created_at  TEXT NOT NULL DEFAULT (datetime('now')),
            FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE,
            FOREIGN KEY (user_id)     REFERENCES users(id)
        );

        CREATE TABLE IF NOT EXISTS highlights (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            question_id INTEGER NOT NULL,
            user_id     INTEGER NOT NULL,
            UNIQUE(question_id, user_id),
            FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE,
            FOREIGN KEY (user_id)     REFERENCES users(id)
        );

        CREATE TABLE IF NOT EXISTS fcm_tokens (
            id         INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id    INTEGER NOT NULL,
            token      TEXT NOT NULL,
            platform   TEXT NOT NULL DEFAULT 'android',
            updated_at TEXT NOT NULL DEFAULT (datetime('now')),
            UNIQUE(user_id, token),
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS push_notifications (
            id         INTEGER PRIMARY KEY AUTOINCREMENT,
            title      TEXT NOT NULL,
            body       TEXT NOT NULL,
            sent_by    INTEGER,
            sent_count INTEGER NOT NULL DEFAULT 0,
            created_at TEXT NOT NULL DEFAULT (datetime('now')),
            FOREIGN KEY (sent_by) REFERENCES users(id)
        );
    """)

    # Migrations for existing DBs
    q_cols = [r[1] for r in conn.execute("PRAGMA table_info(questions)").fetchall()]
    if "type" not in q_cols:
        conn.execute("ALTER TABLE questions ADD COLUMN type TEXT NOT NULL DEFAULT 'Technical'")
    u_cols = [r[1] for r in conn.execute("PRAGMA table_info(users)").fetchall()]
    if "daily_limit" not in u_cols:
        conn.execute("ALTER TABLE users ADD COLUMN daily_limit INTEGER NOT NULL DEFAULT 10")
    if "created_by" not in u_cols:
        conn.execute("ALTER TABLE users ADD COLUMN created_by INTEGER")
    conn.commit()

    # Seed only if empty
    if conn.execute("SELECT COUNT(*) FROM users").fetchone()[0] == 0:
        _seed(conn)

    conn.close()


def _seed(conn: sqlite3.Connection):
    def ins_user(name, email, pw, role):
        return conn.execute(
            "INSERT INTO users (name, email, password, role) VALUES (?,?,?,?)",
            (name, email, _hash(pw), role)
        ).lastrowid

    admin_id = ins_user("Admin",      "admin@devquiz.com", "Admin@123", "admin")
    john_id  = ins_user("John Doe",   "john@devquiz.com",  "User@123",  "user")
    jane_id  = ins_user("Jane Smith", "jane@devquiz.com",  "User@123",  "user")

    fpath = Path(__file__).parent / "data" / "fallbackQuestions.json"
    fallback = json.loads(fpath.read_text())

    owners = [admin_id, john_id, jane_id]
    types  = ["Technical", "Coding"]
    i = 0

    for category, levels in fallback.items():
        for level, qs in levels.items():
            for q in qs:
                conn.execute(
                    """INSERT INTO questions
                       (user_id, category, level, type, question, answer, hints, tags, status, created_at)
                       VALUES (?,?,?,?,?,?,?,?,?, datetime('now', ?))""",
                    (
                        owners[i % 3], category, level, types[i % 2],
                        q["question"], q["answer"],
                        json.dumps(q.get("hints", [])),
                        json.dumps(q.get("tags",  [])),
                        "published", f"-{i % 30} days",
                    )
                )
                i += 1

    all_ids = [r[0] for r in conn.execute("SELECT id FROM questions").fetchall()]
    for idx, qid in enumerate(all_ids):
        if idx % 3 == 0: conn.execute("INSERT OR IGNORE INTO upvotes   (question_id, user_id) VALUES (?,?)", (qid, john_id))
        if idx % 4 == 0: conn.execute("INSERT OR IGNORE INTO upvotes   (question_id, user_id) VALUES (?,?)", (qid, jane_id))
        if idx % 5 == 0: conn.execute("INSERT OR IGNORE INTO bookmarks (question_id, user_id) VALUES (?,?)", (qid, john_id))
        if idx % 7 == 0: conn.execute("INSERT OR IGNORE INTO bookmarks (question_id, user_id) VALUES (?,?)", (qid, jane_id))

    conn.commit()
    print(f"✅ Seeded {i} questions + 3 users.")
