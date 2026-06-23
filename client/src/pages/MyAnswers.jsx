import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import api from "../api/axios";
import ConfirmModal from "../components/ConfirmModal";

const LEVEL_COLOR = {
  High:   "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  Medium: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  Low:    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
};

function Skeleton() {
  return (
    <div className="glass-card p-5 animate-pulse space-y-3">
      <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/4" />
      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full" />
      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
      <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
    </div>
  );
}

export default function MyAnswers() {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState("");
  const [expanded, setExpanded] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    api.get("/questions/my-answers/all")
      .then(({ data }) => setAnswers(data))
      .catch(() => toast.error("Failed to load"))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await api.delete(`/questions/${deleteTarget.questionId}`);
      setAnswers(as => as.filter(a => a.questionId !== deleteTarget.questionId));
      toast.success("Answer deleted");
    } catch {
      toast.error("Failed to delete");
    } finally {
      setDeleteTarget(null);
    }
  };

  const filtered = answers.filter(a =>
    !search || a.question.toLowerCase().includes(search.toLowerCase()) || a.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">📝 My Answers</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">All questions you've saved an answer for.</p>
      </div>

      <div className="flex items-center gap-3">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search questions…"
          className="input-light flex-1 !py-2 text-sm"
        />
        {!loading && (
          <span className="text-xs text-slate-400 whitespace-nowrap">{filtered.length} question{filtered.length !== 1 ? "s" : ""}</span>
        )}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => <Skeleton key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass-card p-12 text-center space-y-3">
          <p className="text-4xl">📭</p>
          <p className="text-slate-500 dark:text-slate-400 font-medium">
            {search ? "No matches found." : "No saved answers yet."}
          </p>
          {!search && (
            <p className="text-sm text-slate-400">Open any question and write your answer to save it here.</p>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(a => (
            <div key={a.questionId} className="glass-card overflow-hidden">
              <div
                className="p-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-white/5 transition"
                onClick={() => setExpanded(e => e === a.questionId ? null : a.questionId)}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0 space-y-1.5">
                    <div className="flex gap-1.5 flex-wrap">
                      <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">{a.category}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${LEVEL_COLOR[a.level] ?? LEVEL_COLOR.Low}`}>{a.level}</span>
                      {a.count > 1 && (
                        <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">{a.count} versions</span>
                      )}
                    </div>
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 leading-snug line-clamp-2">{a.question}</p>
                    <p className="text-xs text-slate-400">
                      Saved {new Date(a.savedAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
                    </p>
                  </div>
                  <span className="text-slate-400 text-xs mt-1 flex-shrink-0">{expanded === a.questionId ? "▲" : "▼"}</span>
                </div>
              </div>

              {expanded === a.questionId && (
                <div className="px-4 pb-4 space-y-3 border-t border-slate-100 dark:border-white/10 pt-3">
                  <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Your latest answer</p>
                  <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed bg-slate-50 dark:bg-slate-800/60 rounded-xl p-3 border border-slate-200 dark:border-slate-700">
                    {a.latestAnswer}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/question/${a.questionId}`)}
                      className="text-xs px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-700/40 font-medium hover:bg-indigo-100 dark:hover:bg-indigo-800/40 transition"
                    >
                      Open question →
                    </button>
                    <button
                      onClick={() => setDeleteTarget(a)}
                      className="text-xs px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-700/40 font-medium hover:bg-red-100 dark:hover:bg-red-800/40 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <ConfirmModal
        open={!!deleteTarget}
        title="Delete answer?"
        message="This answer will be permanently removed."
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </motion.div>
  );
}
