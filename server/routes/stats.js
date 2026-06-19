const express = require("express");
const db = require("../db");

const router = express.Router();

router.get("/dashboard", (req, res) => {
  const totalQuestions = db.prepare("SELECT COUNT(*) AS c FROM questions WHERE status='published'").get().c;

  const byCategory = db
    .prepare(
      "SELECT category, COUNT(*) AS count FROM questions WHERE status='published' GROUP BY category"
    )
    .all();

  const byLevel = db
    .prepare("SELECT level, COUNT(*) AS count FROM questions WHERE status='published' GROUP BY level")
    .all();

  const byType = db
    .prepare("SELECT type, COUNT(*) AS count FROM questions WHERE status='published' GROUP BY type")
    .all();

  const communityPosts = totalQuestions; // all published questions are community posts

  const recent = db
    .prepare(
      `SELECT q.*, u.name AS author_name FROM questions q
       JOIN users u ON u.id = q.user_id
       WHERE q.status = 'published'
       ORDER BY q.created_at DESC LIMIT 8`
    )
    .all()
    .map((r) => ({
      id: r.id,
      category: r.category,
      level: r.level,
      question: r.question,
      author: r.author_name,
      createdAt: r.created_at,
    }));

  res.json({
    totalQuestions,
    byCategory,
    byLevel,
    byType,
    communityPosts,
    recent,
  });
});

router.get("/leaderboard", (req, res) => {
  const rows = db
    .prepare(
      `SELECT u.id, u.name, u.email,
              COUNT(q.id) AS questionCount,
              COALESCE(SUM(
                (SELECT COUNT(*) FROM upvotes up WHERE up.question_id = q.id)
              ), 0) AS totalUpvotes
       FROM users u
       LEFT JOIN questions q ON q.user_id = u.id AND q.status = 'published'
       GROUP BY u.id
       ORDER BY questionCount DESC, totalUpvotes DESC`
    )
    .all();

  res.json(rows);
});

module.exports = router;
