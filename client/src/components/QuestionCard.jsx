import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AnswerBlock from "./AnswerBlock";
import api from "../api/axios";

const CATEGORY_STYLES = {
  "HTML/CSS":     "bg-red-100  text-red-700  border-red-200  dark:bg-red-500/15   dark:text-red-300   dark:border-red-500/30",
  JavaScript:     "bg-amber-100 text-amber-700 border-amber-200 dark:bg-yellow-500/15 dark:text-yellow-300 dark:border-yellow-500/30",
  React:          "bg-cyan-100 text-cyan-800  border-cyan-200 dark:bg-cyan-500/15   dark:text-cyan-300  dark:border-cyan-500/30",
  "Next.js":      "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-500/15 dark:text-slate-300 dark:border-slate-500/30",
  "React Native": "bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-500/15 dark:text-indigo-300 dark:border-indigo-500/30",
};

const LEVEL_STYLES = {
  Low:    "bg-green-100  text-green-700  border-green-200  dark:bg-green-500/15   dark:text-green-300  dark:border-green-500/30",
  Medium: "bg-amber-100  text-amber-700  border-amber-200  dark:bg-amber-500/15   dark:text-amber-300  dark:border-amber-500/30",
  High:   "bg-red-100    text-red-700    border-red-200    dark:bg-red-500/15     dark:text-red-300    dark:border-red-500/30",
};

function initialsOf(name = "?") {
  return name.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();
}

function CommentsSection({ qid }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState("");
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    api.get(`/questions/${qid}/comments`)
      .then(r => setComments(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [qid]);

  const submit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setPosting(true);
    try {
      const { data } = await api.post(`/questions/${qid}/comments`, { text });
      setComments(c => [...c, data]);
      setText("");
    } catch {}
    setPosting(false);
  };

  const del = async (cid) => {
    try {
      await api.delete(`/questions/comments/${cid}`);
      setComments(c => c.filter(x => x.id !== cid));
    } catch {}
  };

  return (
    <div className="border-t border-black/5 dark:border-white/10 pt-3 space-y-2">
      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
        💬 Comments {comments.length > 0 && `(${comments.length})`}
      </p>

      {loading ? (
        <p className="text-xs text-slate-400">Loading…</p>
      ) : comments.length === 0 ? (
        <p className="text-xs text-slate-400 italic">No comments yet. Be the first!</p>
      ) : (
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {comments.map(c => (
            <div key={c.id} className="flex gap-2 group">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 text-[9px] flex items-center justify-center text-white font-bold flex-shrink-0 mt-0.5">
                {initialsOf(c.author?.name || "?")}
              </div>
              <div className="flex-1 bg-slate-50 dark:bg-white/5 rounded-xl px-3 py-2">
                <div className="flex items-center justify-between gap-2 mb-0.5">
                  <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-200">{c.author?.name}</span>
                  <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-[10px] text-slate-400">{new Date(c.createdAt).toLocaleDateString()}</span>
                    <button onClick={() => del(c.id)} className="text-[10px] text-red-400 hover:text-red-500">✕</button>
                  </div>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{c.text}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={submit} className="flex gap-2 mt-2">
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Write a comment…"
          maxLength={1000}
          className="flex-1 text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 outline-none focus:border-indigo-400 dark:focus:border-cyan-400 text-slate-700 dark:text-slate-200 placeholder:text-slate-400"
        />
        <button
          type="submit"
          disabled={posting || !text.trim()}
          className="text-xs px-3 py-2 rounded-xl bg-indigo-500 text-white font-semibold disabled:opacity-40 hover:bg-indigo-600 transition-colors"
        >
          {posting ? "…" : "Post"}
        </button>
      </form>
    </div>
  );
}

export default function QuestionCard({
  q,
  onUpvote,
  onHighlight,
  onBookmark,
  onEdit,
  onDelete,
  showOwnerActions = false,
}) {
  const [revealed, setRevealed] = useState(false);
  const [showComments, setShowComments] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.97, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="glass-card p-5 flex flex-col gap-3 card-hover"
    >
      {/* Badges row */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${CATEGORY_STYLES[q.category] || "bg-slate-500/15 text-slate-300 border-slate-500/30"}`}>
          {q.category}
        </span>
        <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${LEVEL_STYLES[q.level] || ""}`}>
          {q.level}
        </span>
        {q.type && (
          <span className="text-xs px-2.5 py-1 rounded-full border font-medium bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-500/15 dark:text-purple-300 dark:border-purple-500/30">
            {q.type === "Coding" ? "💻 Coding" : "🧩 Technical"}
          </span>
        )}
        {q.status === "draft" && (
          <span className="text-xs px-2.5 py-1 rounded-full border font-medium bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-500/15 dark:text-slate-400 dark:border-slate-500/30">
            Draft
          </span>
        )}
        <span className="ml-auto text-xs text-slate-400">
          {new Date(q.createdAt).toLocaleDateString()}
        </span>
      </div>

      {/* Question text */}
      <p className="font-semibold leading-snug text-slate-800 dark:text-slate-100">{q.question}</p>

      {/* Reveal answer */}
      <button
        onClick={() => setRevealed(r => !r)}
        className="text-xs self-start font-medium text-indigo-600 dark:text-cyan-300 hover:underline"
      >
        {revealed ? "Hide answer ▲" : "Reveal answer ▼"}
      </button>

      <AnimatePresence>
        {revealed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-xl p-3 space-y-2">
              <AnswerBlock text={q.answer} questionType={q.type} />
              {q.hints?.length > 0 && (
                <ul className="mt-1 text-xs text-slate-600 dark:text-slate-400 list-disc list-inside space-y-0.5">
                  {q.hints.map((h, i) => <li key={i}>{h}</li>)}
                </ul>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tags */}
      {q.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {q.tags.map((t, i) => (
            <span key={i} className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-300 border border-slate-200 dark:border-white/10">
              #{t}
            </span>
          ))}
        </div>
      )}

      {/* Action bar */}
      <div className="flex items-center gap-2 pt-2 border-t border-black/5 dark:border-white/10 mt-1 flex-wrap">
        {q.author && (
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 text-[10px] flex items-center justify-center text-white font-bold">
              {initialsOf(q.author.name)}
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400">{q.author.name}</span>
          </div>
        )}

        <div className="ml-auto flex items-center gap-1.5 flex-wrap">
          {/* Upvote */}
          {onUpvote && (
            <button
              onClick={() => onUpvote(q)}
              className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border transition-colors ${
                q.isUpvoted
                  ? "bg-cyan-100 border-cyan-300 text-cyan-700 dark:bg-cyan-500/20 dark:border-cyan-500/40 dark:text-cyan-300"
                  : "border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/10"
              }`}
            >
              ▲ {q.upvoteCount ?? 0}
            </button>
          )}

          {/* Highlight */}
          {onHighlight && (
            <button
              onClick={() => onHighlight(q)}
              className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border transition-colors ${
                q.isHighlighted
                  ? "bg-yellow-100 border-yellow-300 text-yellow-700 dark:bg-yellow-500/20 dark:border-yellow-500/40 dark:text-yellow-300"
                  : "border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/10"
              }`}
              title="Highlight"
            >
              ★ {q.highlightCount ?? 0}
            </button>
          )}

          {/* Comments toggle */}
          <button
            onClick={() => setShowComments(v => !v)}
            className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border transition-colors ${
              showComments
                ? "bg-indigo-100 border-indigo-300 text-indigo-700 dark:bg-indigo-500/20 dark:border-indigo-500/40 dark:text-indigo-300"
                : "border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/10"
            }`}
          >
            💬 {q.commentCount ?? 0}
          </button>

          {/* Bookmark */}
          {onBookmark && (
            <button
              onClick={() => onBookmark(q)}
              className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                q.isBookmarked
                  ? "bg-amber-100 border-amber-300 text-amber-700 dark:bg-amber-500/20 dark:border-amber-500/40 dark:text-amber-400"
                  : "border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/10"
              }`}
            >
              {q.isBookmarked ? "🔖 Saved" : "🔖 Save"}
            </button>
          )}

          {/* Owner actions */}
          {showOwnerActions && (
            <>
              <button onClick={() => onEdit?.(q)} className="text-xs px-2.5 py-1 rounded-full border border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/10">
                ✏️ Edit
              </button>
              <button onClick={() => onDelete?.(q)} className="text-xs px-2.5 py-1 rounded-full border border-red-400/30 text-red-400 hover:bg-red-400/10">
                🗑 Delete
              </button>
            </>
          )}
        </div>
      </div>

      {/* Comments section */}
      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <CommentsSection qid={q.id} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
