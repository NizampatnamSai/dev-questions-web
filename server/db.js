const path = require("path");
const Database = require("better-sqlite3");
const bcrypt = require("bcryptjs");

const db = new Database(path.join(__dirname, "db.sqlite"));
db.pragma("journal_mode = WAL");

// ---------- Schema ----------
db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS questions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  category TEXT NOT NULL,
  level TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'Technical',
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  hints TEXT NOT NULL DEFAULT '[]',
  tags TEXT NOT NULL DEFAULT '[]',
  status TEXT NOT NULL DEFAULT 'draft',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS upvotes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  question_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  UNIQUE(question_id, user_id),
  FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS bookmarks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  question_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  UNIQUE(question_id, user_id),
  FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
`);

// ---------- AI usage tracking ----------
db.exec(`
CREATE TABLE IF NOT EXISTS ai_usage (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  date TEXT NOT NULL,
  questions_generated INTEGER NOT NULL DEFAULT 0,
  UNIQUE(user_id, date),
  FOREIGN KEY (user_id) REFERENCES users(id)
);
`);

// ---------- Migrations (for DBs created before a column existed) ----------
const questionColumns = db.prepare("PRAGMA table_info(questions)").all().map((c) => c.name);
if (!questionColumns.includes("type")) {
  db.exec("ALTER TABLE questions ADD COLUMN type TEXT NOT NULL DEFAULT 'Technical'");
}

// ---------- Seed ----------
const userCount = db.prepare("SELECT COUNT(*) AS c FROM users").get().c;

if (userCount === 0) {
  const insertUser = db.prepare(
    "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)"
  );
  const hash = (pw) => bcrypt.hashSync(pw, 10);

  const adminId = insertUser.run("Admin", "admin@devquiz.com", hash("Admin@123"), "admin").lastInsertRowid;
  const johnId = insertUser.run("John Doe", "john@devquiz.com", hash("User@123"), "user").lastInsertRowid;
  const janeId = insertUser.run("Jane Smith", "jane@devquiz.com", hash("User@123"), "user").lastInsertRowid;

  const insertQuestion = db.prepare(`
    INSERT INTO questions (user_id, category, level, type, question, answer, hints, tags, status, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now', ?))
  `);

  const fallback = require("./data/fallbackQuestions.json");
  const owners = [adminId, johnId, janeId];
  const types = ["Technical", "Coding"];
  let i = 0;

  for (const category of Object.keys(fallback)) {
    for (const level of Object.keys(fallback[category])) {
      for (const q of fallback[category][level]) {
        const owner = owners[i % owners.length];
        const type = types[i % types.length];
        // spread fake creation dates over the last 30 days for a realistic feed
        const offset = `-${i % 30} days`;
        insertQuestion.run(
          owner,
          category,
          level,
          type,
          q.question,
          q.answer,
          JSON.stringify(q.hints || []),
          JSON.stringify(q.tags || []),
          "published",
          offset
        );
        i++;
      }
    }
  }

  // sprinkle a few sample upvotes/bookmarks so dashboards aren't empty
  const allQuestionIds = db.prepare("SELECT id FROM questions").all().map((r) => r.id);
  const insertUpvote = db.prepare(
    "INSERT OR IGNORE INTO upvotes (question_id, user_id) VALUES (?, ?)"
  );
  const insertBookmark = db.prepare(
    "INSERT OR IGNORE INTO bookmarks (question_id, user_id) VALUES (?, ?)"
  );
  allQuestionIds.forEach((qid, idx) => {
    if (idx % 3 === 0) insertUpvote.run(qid, johnId);
    if (idx % 4 === 0) insertUpvote.run(qid, janeId);
    if (idx % 5 === 0) insertBookmark.run(qid, johnId);
    if (idx % 7 === 0) insertBookmark.run(qid, janeId);
  });

  console.log(`Seeded ${userCount === 0 ? i : 0} questions and 3 users.`);
}

module.exports = db;
