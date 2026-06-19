import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import api from "../api/axios";

const GRADE_COLOR = {
  Excellent: "text-green-500",
  Good:      "text-blue-500",
  Partial:   "text-yellow-500",
  Poor:      "text-red-500",
};

const GRADE_BG = {
  Excellent: "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800",
  Good:      "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800",
  Partial:   "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800",
  Poor:      "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800",
};

export default function QuestionDetail() {
  const { id }       = useParams();
  const navigate     = useNavigate();
  const [q, setQ]    = useState(null);
  const [loading, setLoading]     = useState(true);
  const [showAnswer, setShowAnswer] = useState(false);

  // AI Answer Checker
  const [userAnswer, setUserAnswer]   = useState("");
  const [checking, setChecking]       = useState(false);
  const [result, setResult]           = useState(null);
  const [showChecker, setShowChecker] = useState(false);

  useEffect(() => {
    api.get(`/questions/${id}`)
      .then(({ data }) => setQ(data))
      .catch(() => toast.error("Question not found"))
      .finally(() => setLoading(false));
  }, [id]);

  const checkMyAnswer = async () => {
    if (!userAnswer.trim()) return toast.error("Write your answer first");
    setChecking(true);
    setResult(null);
    try {
      const { data } = await api.post(`/questions/${id}/check-answer`, { user_answer: userAnswer });
      setResult(data);
    } catch {
      toast.error("AI checker failed, try again");
    } finally {
      setChecking(false);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied!");
  };

  if (loading) return (
    <div className="space-y-4 animate-pulse max-w-3xl mx-auto">
      <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-1/3" />
      <div className="glass-card p-6 space-y-3">
        <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-full" />
        <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-4/5" />
      </div>
    </div>
  );

  if (!q) return (
    <div className="text-center py-20">
      <p className="text-slate-400 text-lg">Question not found.</p>
      <button onClick={() => navigate(-1)} className="mt-4 btn-primary">Go Back</button>
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="text-slate-400 hover:text-indigo-500 transition text-xl">←</button>
        <div className="flex gap-2 flex-wrap">
          <span className="badge">{q.category}</span>
          <span className={`badge ${q.level === "High" ? "badge-red" : q.level === "Medium" ? "badge-yellow" : "badge-green"}`}>{q.level}</span>
          <span className="badge">{q.type}</span>
        </div>
        <button onClick={copyLink} className="ml-auto text-slate-400 hover:text-indigo-500 transition text-sm flex items-center gap-1">
          🔗 Share
        </button>
      </div>

      {/* Question */}
      <div className="glass-card p-6 space-y-4">
        <p className="text-lg font-semibold text-slate-800 dark:text-slate-100 leading-relaxed">{q.question}</p>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span>by {q.author?.name ?? "Unknown"}</span>
          <span>·</span>
          <span>⬆ {q.upvoteCount} · 💬 {q.commentCount} · ★ {q.highlightCount}</span>
        </div>

        {q.hints?.length > 0 && (
          <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 rounded-xl p-4">
            <p className="text-xs font-semibold text-indigo-500 mb-2">💡 Hints</p>
            <ul className="space-y-1">
              {q.hints.map((h, i) => <li key={i} className="text-sm text-slate-600 dark:text-slate-300">• {h}</li>)}
            </ul>
          </div>
        )}

        {/* Answer toggle */}
        <button
          onClick={() => setShowAnswer(v => !v)}
          className="w-full py-2 rounded-xl border border-dashed border-indigo-300 dark:border-indigo-700 text-indigo-500 text-sm hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition"
        >
          {showAnswer ? "Hide Answer ▲" : "Show Answer ▼"}
        </button>
        <AnimatePresence>
          {showAnswer && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-4 text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap overflow-hidden"
            >
              {q.answer}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* AI Answer Checker */}
      <div className="glass-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-slate-800 dark:text-slate-100">🤖 AI Answer Checker</h2>
          <button
            onClick={() => setShowChecker(v => !v)}
            className="text-xs text-indigo-500 hover:underline"
          >
            {showChecker ? "Hide" : "Try it"}
          </button>
        </div>

        <AnimatePresence>
          {showChecker && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4 overflow-hidden"
            >
              <textarea
                value={userAnswer}
                onChange={e => setUserAnswer(e.target.value)}
                placeholder="Write your answer here as if you were in an interview..."
                rows={5}
                className="input-light w-full resize-none text-sm"
              />
              <button
                onClick={checkMyAnswer}
                disabled={checking}
                className="btn-primary w-full disabled:opacity-60"
              >
                {checking ? "⏳ Evaluating..." : "🎯 Check My Answer"}
              </button>

              <AnimatePresence>
                {result && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`border rounded-2xl p-5 space-y-4 ${GRADE_BG[result.grade] ?? GRADE_BG.Poor}`}
                  >
                    {/* Score */}
                    <div className="flex items-center gap-4">
                      <div className="text-5xl font-black text-slate-800 dark:text-slate-100">{result.score}<span className="text-2xl text-slate-400">/100</span></div>
                      <div>
                        <p className={`text-xl font-bold ${GRADE_COLOR[result.grade]}`}>{result.grade}</p>
                        <p className="text-xs text-slate-500">AI Score</p>
                      </div>
                      {/* Score ring */}
                      <div className="ml-auto">
                        <svg width="60" height="60" viewBox="0 0 60 60">
                          <circle cx="30" cy="30" r="24" fill="none" stroke="#e2e8f0" strokeWidth="6" />
                          <circle
                            cx="30" cy="30" r="24" fill="none"
                            stroke={result.score >= 80 ? "#22c55e" : result.score >= 60 ? "#3b82f6" : result.score >= 40 ? "#eab308" : "#ef4444"}
                            strokeWidth="6"
                            strokeDasharray={`${(result.score / 100) * 150.8} 150.8`}
                            strokeLinecap="round"
                            transform="rotate(-90 30 30)"
                          />
                        </svg>
                      </div>
                    </div>

                    <p className="text-sm text-slate-700 dark:text-slate-300">{result.feedback}</p>

                    {result.strengths?.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-green-600 mb-1">✅ Strengths</p>
                        <ul className="space-y-1">
                          {result.strengths.map((s, i) => <li key={i} className="text-sm text-slate-600 dark:text-slate-300">• {s}</li>)}
                        </ul>
                      </div>
                    )}
                    {result.missed?.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-red-500 mb-1">❌ Missed Points</p>
                        <ul className="space-y-1">
                          {result.missed.map((m, i) => <li key={i} className="text-sm text-slate-600 dark:text-slate-300">• {m}</li>)}
                        </ul>
                      </div>
                    )}

                    <div className="flex gap-2 pt-2">
                      <button onClick={() => { setResult(null); setUserAnswer(""); }} className="text-xs text-slate-400 hover:text-slate-600">Try again</button>
                      {!showAnswer && <button onClick={() => setShowAnswer(true)} className="text-xs text-indigo-500 hover:underline">See ideal answer</button>}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
