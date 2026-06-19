const express = require("express");
const db = require("../db");
const { requireAuth } = require("../middleware/auth");
const { generateQuestions, generateAnswer } = require("../utils/ollama");

const router = express.Router();

const CATEGORIES = ["HTML/CSS", "JavaScript", "React", "Next.js", "React Native"];
const LEVELS = ["Low", "Medium", "High"];
const TYPES = ["Technical", "Coding"];

function serializeQuestion(row, currentUserId) {
  const upvoteCount = db
    .prepare("SELECT COUNT(*) AS c FROM upvotes WHERE question_id = ?")
    .get(row.id).c;
  const isUpvoted = currentUserId
    ? !!db.prepare("SELECT 1 FROM upvotes WHERE question_id = ? AND user_id = ?").get(row.id, currentUserId)
    : false;
  const isBookmarked = currentUserId
    ? !!db.prepare("SELECT 1 FROM bookmarks WHERE question_id = ? AND user_id = ?").get(row.id, currentUserId)
    : false;
  const author = db.prepare("SELECT id, name FROM users WHERE id = ?").get(row.user_id);

  return {
    id: row.id,
    category: row.category,
    level: row.level,
    type: row.type || "Technical",
    question: row.question,
    answer: row.answer,
    hints: JSON.parse(row.hints || "[]"),
    tags: JSON.parse(row.tags || "[]"),
    status: row.status,
    createdAt: row.created_at,
    author: author ? { id: author.id, name: author.name } : null,
    upvoteCount,
    isUpvoted,
    isBookmarked,
  };
}

const AI_DAILY_LIMIT = Number(process.env.AI_DAILY_LIMIT) || 10;

function todayUTC() {
  return new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
}

function getUsage(userId) {
  const row = db
    .prepare("SELECT questions_generated FROM ai_usage WHERE user_id = ? AND date = ?")
    .get(userId, todayUTC());
  return row ? row.questions_generated : 0;
}

function incrementUsage(userId, count) {
  db.prepare(`
    INSERT INTO ai_usage (user_id, date, questions_generated)
    VALUES (?, ?, ?)
    ON CONFLICT(user_id, date) DO UPDATE SET questions_generated = questions_generated + ?
  `).run(userId, todayUTC(), count, count);
}

// ---------- AI usage status ----------
router.get("/generate/usage", requireAuth, (req, res) => {
  const used = getUsage(req.user.id);
  res.json({ used, limit: AI_DAILY_LIMIT, remaining: Math.max(0, AI_DAILY_LIMIT - used) });
});

// ---------- AI generation (preview only, not saved) ----------
router.post("/generate", requireAuth, async (req, res) => {
  const { category, level, type = "Technical", count } = req.body;

  if (!CATEGORIES.includes(category)) {
    return res.status(400).json({ message: `category must be one of ${CATEGORIES.join(", ")}` });
  }
  if (!LEVELS.includes(level)) {
    return res.status(400).json({ message: `level must be one of ${LEVELS.join(", ")}` });
  }
  if (!TYPES.includes(type)) {
    return res.status(400).json({ message: `type must be one of ${TYPES.join(", ")}` });
  }
  const n = Number(count);
  if (![1, 3, 5, 10].includes(n)) {
    return res.status(400).json({ message: "count must be one of 1, 3, 5, 10" });
  }

  // LIMIT TEMPORARILY DISABLED
  // const used = getUsage(req.user.id);
  // const remaining = AI_DAILY_LIMIT - used;
  // if (remaining <= 0) return res.status(429).json({ message: `Daily AI limit reached.`, used, limit: AI_DAILY_LIMIT, remaining: 0 });
  // const allowedCount = Math.min(n, remaining);
  // if (result.source !== "fallback") incrementUsage(req.user.id, allowedCount);

  const result = await generateQuestions(category, level, type, n);
  res.json(result);
});

// ---------- AI: generate answer for a user-written question ----------
router.post("/generate/answer", requireAuth, async (req, res) => {
  const { question, category, level, type = "Technical" } = req.body;

  if (!question || question.trim().length < 10) {
    return res.status(400).json({ message: "question must be at least 10 characters" });
  }
  if (!CATEGORIES.includes(category)) {
    return res.status(400).json({ message: `category must be one of ${CATEGORIES.join(", ")}` });
  }
  if (!LEVELS.includes(level)) {
    return res.status(400).json({ message: `level must be one of ${LEVELS.join(", ")}` });
  }
  if (!TYPES.includes(type)) {
    return res.status(400).json({ message: `type must be one of ${TYPES.join(", ")}` });
  }

  // LIMIT TEMPORARILY DISABLED
  // const used = getUsage(req.user.id);
  // const remaining = AI_DAILY_LIMIT - used;
  // if (remaining <= 0) return res.status(429).json({ message: `Daily AI limit reached.`, used, limit: AI_DAILY_LIMIT, remaining: 0 });
  // if (result.source !== "fallback") incrementUsage(req.user.id, 1);

  const result = await generateAnswer(question.trim(), category, level, type);
  res.json(result);
});

// ---------- Community feed (public, published only) ----------
router.get("/community", (req, res) => {
  const { category, level, type, tag, search } = req.query;
  const currentUserId = req.headers["x-user-id"] ? Number(req.headers["x-user-id"]) : null;

  let rows = db
    .prepare("SELECT * FROM questions WHERE status = 'published' ORDER BY created_at DESC")
    .all();

  if (category) rows = rows.filter((r) => r.category === category);
  if (level) rows = rows.filter((r) => r.level === level);
  if (type) rows = rows.filter((r) => r.type === type);
  if (tag) rows = rows.filter((r) => JSON.parse(r.tags || "[]").includes(tag));
  if (search) {
    const s = search.toLowerCase();
    rows = rows.filter(
      (r) => r.question.toLowerCase().includes(s) || r.answer.toLowerCase().includes(s)
    );
  }

  res.json(rows.map((r) => serializeQuestion(r, currentUserId)));
});

// ---------- My questions ----------
router.get("/mine", requireAuth, (req, res) => {
  const rows = db
    .prepare("SELECT * FROM questions WHERE user_id = ? ORDER BY created_at DESC")
    .all(req.user.id);
  res.json(rows.map((r) => serializeQuestion(r, req.user.id)));
});

// ---------- Bookmarks ----------
router.get("/bookmarks", requireAuth, (req, res) => {
  const rows = db
    .prepare(
      `SELECT q.* FROM questions q
       JOIN bookmarks b ON b.question_id = q.id
       WHERE b.user_id = ? ORDER BY b.id DESC`
    )
    .all(req.user.id);
  res.json(rows.map((r) => serializeQuestion(r, req.user.id)));
});

// ---------- Create (post a question, draft or published) ----------
router.post("/", requireAuth, (req, res) => {
  const {
    category,
    level,
    type = "Technical",
    question,
    answer,
    hints = [],
    tags = [],
    status = "published",
  } = req.body;

  if (!CATEGORIES.includes(category)) {
    return res.status(400).json({ message: `category must be one of ${CATEGORIES.join(", ")}` });
  }
  if (!LEVELS.includes(level)) {
    return res.status(400).json({ message: `level must be one of ${LEVELS.join(", ")}` });
  }
  if (!TYPES.includes(type)) {
    return res.status(400).json({ message: `type must be one of ${TYPES.join(", ")}` });
  }
  if (!question || !answer) {
    return res.status(400).json({ message: "question and answer are required" });
  }

  const result = db
    .prepare(
      `INSERT INTO questions (user_id, category, level, type, question, answer, hints, tags, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      req.user.id,
      category,
      level,
      type,
      question,
      answer,
      JSON.stringify(hints),
      JSON.stringify(tags),
      status === "draft" ? "draft" : "published"
    );

  const row = db.prepare("SELECT * FROM questions WHERE id = ?").get(result.lastInsertRowid);
  res.status(201).json(serializeQuestion(row, req.user.id));
});

// ---------- Update ----------
router.put("/:id", requireAuth, (req, res) => {
  const row = db.prepare("SELECT * FROM questions WHERE id = ?").get(req.params.id);
  if (!row) return res.status(404).json({ message: "Question not found" });
  if (row.user_id !== req.user.id && req.user.role !== "admin") {
    return res.status(403).json({ message: "Not allowed to edit this question" });
  }

  const {
    category = row.category,
    level = row.level,
    type = row.type || "Technical",
    question = row.question,
    answer = row.answer,
    hints,
    tags,
    status = row.status,
  } = req.body;

  db.prepare(
    `UPDATE questions SET category = ?, level = ?, type = ?, question = ?, answer = ?, hints = ?, tags = ?, status = ?
     WHERE id = ?`
  ).run(
    category,
    level,
    type,
    question,
    answer,
    JSON.stringify(hints ?? JSON.parse(row.hints || "[]")),
    JSON.stringify(tags ?? JSON.parse(row.tags || "[]")),
    status,
    row.id
  );

  const updated = db.prepare("SELECT * FROM questions WHERE id = ?").get(row.id);
  res.json(serializeQuestion(updated, req.user.id));
});

// ---------- Delete ----------
router.delete("/:id", requireAuth, (req, res) => {
  const row = db.prepare("SELECT * FROM questions WHERE id = ?").get(req.params.id);
  if (!row) return res.status(404).json({ message: "Question not found" });
  if (row.user_id !== req.user.id && req.user.role !== "admin") {
    return res.status(403).json({ message: "Not allowed to delete this question" });
  }
  db.prepare("DELETE FROM questions WHERE id = ?").run(row.id);
  res.json({ message: "Deleted" });
});

// ---------- Upvote toggle ----------
router.post("/:id/upvote", requireAuth, (req, res) => {
  const row = db.prepare("SELECT * FROM questions WHERE id = ?").get(req.params.id);
  if (!row) return res.status(404).json({ message: "Question not found" });

  const existing = db
    .prepare("SELECT * FROM upvotes WHERE question_id = ? AND user_id = ?")
    .get(row.id, req.user.id);

  if (existing) {
    db.prepare("DELETE FROM upvotes WHERE id = ?").run(existing.id);
  } else {
    db.prepare("INSERT INTO upvotes (question_id, user_id) VALUES (?, ?)").run(row.id, req.user.id);
  }

  res.json(serializeQuestion(row, req.user.id));
});

// ---------- Bookmark toggle ----------
router.post("/:id/bookmark", requireAuth, (req, res) => {
  const row = db.prepare("SELECT * FROM questions WHERE id = ?").get(req.params.id);
  if (!row) return res.status(404).json({ message: "Question not found" });

  const existing = db
    .prepare("SELECT * FROM bookmarks WHERE question_id = ? AND user_id = ?")
    .get(row.id, req.user.id);

  if (existing) {
    db.prepare("DELETE FROM bookmarks WHERE id = ?").run(existing.id);
  } else {
    db.prepare("INSERT INTO bookmarks (question_id, user_id) VALUES (?, ?)").run(row.id, req.user.id);
  }

  res.json(serializeQuestion(row, req.user.id));
});

module.exports = router;
