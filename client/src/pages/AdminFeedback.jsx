import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import api from "../api/axios";

const TYPE_COLORS = {
  bug: "bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-300",
  feature: "bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300",
  improvement: "bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300",
  other: "bg-slate-100 dark:bg-slate-500/10 text-slate-700 dark:text-slate-300",
};

function FeedbackCard({ feedback, onRead, onDelete }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`glass-card p-5 space-y-3 ${feedback.read ? "opacity-60" : ""}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${TYPE_COLORS[feedback.type] || TYPE_COLORS.other}`}>
              {feedback.type.toUpperCase()}
            </span>
            <span className="text-xs text-slate-400">
              {feedback.userName} • {new Date(feedback.createdAt).toLocaleDateString()}
            </span>
          </div>
          <h3 className="font-semibold text-slate-800 dark:text-slate-100 mt-1 leading-snug">
            {feedback.title}
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed whitespace-pre-wrap">
            {feedback.message}
          </p>
          <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
            <span>Rating: {"⭐".repeat(feedback.rating)}</span>
            <span>{feedback.userEmail}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {!feedback.read && (
            <button
              onClick={() => onRead(feedback.id)}
              className="px-2 py-1 rounded-lg text-xs font-medium bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-200 dark:hover:bg-indigo-500/30 transition-colors"
            >
              Mark Read
            </button>
          )}
          <button
            onClick={() => onDelete(feedback.id)}
            className="px-2 py-1 rounded-lg text-xs font-medium bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-500/30 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function AdminFeedback() {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    loadFeedback();
  }, []);

  const loadFeedback = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/feedback/admin/all");
      setFeedback(data);
    } catch {
      toast.error("Failed to load feedback");
    } finally {
      setLoading(false);
    }
  };

  const handleRead = async (id) => {
    try {
      await api.patch(`/feedback/admin/${id}/read`);
      setFeedback(f => f.map(item => item.id === id ? { ...item, read: true } : item));
    } catch {
      toast.error("Failed to update feedback");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this feedback?")) return;
    try {
      await api.delete(`/feedback/admin/${id}`);
      setFeedback(f => f.filter(item => item.id !== id));
      toast.success("Deleted");
    } catch {
      toast.error("Failed to delete");
    }
  };

  const filtered = feedback.filter(f =>
    filter === "all" ? true :
    filter === "unread" ? !f.read :
    f.type === filter
  );

  const unreadCount = feedback.filter(f => !f.read).length;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">💬 User Feedback</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          {unreadCount > 0 && <span className="text-amber-600 dark:text-amber-400 font-semibold">{unreadCount} unread • </span>}
          {feedback.length} total
        </p>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {[
          { id: "all", label: "All" },
          { id: "unread", label: `Unread (${unreadCount})` },
          { id: "bug", label: "🐛 Bugs" },
          { id: "feature", label: "✨ Features" },
          { id: "improvement", label: "💡 Improvements" },
          { id: "other", label: "💬 Other" },
        ].map(f => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              filter === f.id
                ? "bg-indigo-600 text-white"
                : "bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/20"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Feedback list */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="glass-card p-5 h-32 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-slate-400">
          <p className="text-4xl mb-2">📭</p>
          <p className="font-medium">No feedback found</p>
        </div>
      ) : (
        <AnimatePresence initial={false}>
          <div className="space-y-3">
            {filtered.map(f => (
              <FeedbackCard
                key={f.id}
                feedback={f}
                onRead={handleRead}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </AnimatePresence>
      )}
    </motion.div>
  );
}
