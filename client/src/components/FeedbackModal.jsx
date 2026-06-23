import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import api from "../api/axios";
import ConfirmModal from "./ConfirmModal";

export default function FeedbackModal({ open, onClose }) {
  const [type, setType] = useState("feature");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    if (!title.trim() || !message.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    setSubmitting(true);
    try {
      await api.post("/feedback", {
        type,
        title: title.trim(),
        message: message.trim(),
        rating,
      });
      toast.success("Thank you for your feedback! 💙");
      resetForm();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to submit feedback");
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setType("feature");
    setTitle("");
    setMessage("");
    setRating(5);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="glass-card w-full max-w-md rounded-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
              <div>
                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">💭 Send Feedback</h2>
                <p className="text-xs text-slate-400 mt-1">Help us improve DevQuiz with your thoughts</p>
              </div>

              {/* Type selector */}
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-200">Feedback Type</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {[
                    { id: "bug", label: "🐛 Bug", emoji: "🐛" },
                    { id: "feature", label: "✨ Feature", emoji: "✨" },
                    { id: "improvement", label: "💡 Improvement", emoji: "💡" },
                    { id: "other", label: "💬 Other", emoji: "💬" },
                  ].map(t => (
                    <button
                      key={t.id}
                      onClick={() => setType(t.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        type === t.id
                          ? "bg-indigo-600 text-white"
                          : "bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/20"
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Rating */}
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-200">How satisfied are you?</label>
                <div className="flex gap-2 mt-2">
                  {[1, 2, 3, 4, 5].map(r => (
                    <button
                      key={r}
                      onClick={() => setRating(r)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                        rating === r
                          ? "bg-yellow-500 text-white"
                          : "bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/20"
                      }`}
                    >
                      {"⭐".repeat(r)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-200">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="Brief summary..."
                  className="w-full mt-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Message */}
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-200">Details</label>
                <textarea
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="Tell us more..."
                  rows={4}
                  className="w-full mt-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-sm outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-2 rounded-lg border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 text-sm font-medium hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={submit}
                  disabled={submitting}
                  className="flex-1 px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-500 disabled:opacity-60 transition-colors"
                >
                  {submitting ? "Sending…" : "Send Feedback"}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
