import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import api from "../api/axios";

const GRADE_COLOR = {
  Excellent: "text-emerald-500",
  Good:      "text-blue-500",
  Partial:   "text-amber-500",
  Poor:      "text-red-500",
};
const GRADE_BG = {
  Excellent: "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800",
  Good:      "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800",
  Partial:   "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800",
  Poor:      "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800",
};
const LEVEL_COLOR = {
  High:   "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  Medium: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  Low:    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
};

function ScoreRing({ score }) {
  const r = 28, circ = 2 * Math.PI * r;
  const color = score >= 80 ? "#22c55e" : score >= 60 ? "#3b82f6" : score >= 40 ? "#eab308" : "#ef4444";
  return (
    <svg width="72" height="72" viewBox="0 0 72 72">
      <circle cx="36" cy="36" r={r} fill="none" stroke="#e2e8f020" strokeWidth="6" />
      <circle cx="36" cy="36" r={r} fill="none" stroke={color} strokeWidth="6"
        strokeDasharray={`${(score / 100) * circ} ${circ}`}
        strokeLinecap="round" transform="rotate(-90 36 36)"
        style={{ transition: "stroke-dasharray 0.8s ease" }} />
      <text x="36" y="40" textAnchor="middle" fontSize="14" fontWeight="bold" fill={color}>{score}</text>
    </svg>
  );
}

export default function QuestionDetail() {
  const { id }    = useParams();
  const navigate  = useNavigate();
  const [q, setQ] = useState(null);
  const [loading, setLoading] = useState(true);

  // Show Answer panel
  const [showAnswer, setShowAnswer] = useState(false);

  // AI Checker
  const [userAnswer, setUserAnswer] = useState("");
  const [checking, setChecking]     = useState(false);
  const [result, setResult]         = useState(null);

  // My saved answers
  const [myAnswers, setMyAnswers]     = useState([]);
  const [savingAns, setSavingAns]     = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [draftAnswer, setDraftAnswer] = useState("");

  useEffect(() => {
    api.get(`/questions/${id}`)
      .then(({ data }) => setQ(data))
      .catch(() => toast.error("Question not found"))
      .finally(() => setLoading(false));
    api.get(`/questions/${id}/my-answer`)
      .then(({ data }) => { setMyAnswers(data); if (data.length) setShowHistory(true); })
      .catch(() => {});
  }, [id]);

  const saveMyAnswer = async () => {
    if (!draftAnswer.trim()) return toast.error("Write something first");
    setSavingAns(true);
    try {
      const { data } = await api.post(`/questions/${id}/my-answer`, { answer: draftAnswer.trim() });
      setMyAnswers(prev => [{ id: data.id, answer: draftAnswer.trim(), savedAt: data.savedAt }, ...prev]);
      setDraftAnswer("");
      setShowHistory(true);
      toast.success("Answer saved!");
    } catch { toast.error("Failed to save"); }
    finally { setSavingAns(false); }
  };

  const deleteMyAnswer = async (aid) => {
    try {
      await api.delete(`/questions/${id}/my-answer/${aid}`);
      setMyAnswers(prev => prev.filter(a => a.id !== aid));
      toast.success("Deleted");
    } catch { toast.error("Failed to delete"); }
  };

  const checkWithAI = async () => {
    const textToCheck = userAnswer.trim() || draftAnswer.trim();
    if (!textToCheck) return toast.error("Write your answer first");
    setChecking(true);
    setResult(null);
    try {
      const { data } = await api.post(`/questions/${id}/check-answer`, { user_answer: textToCheck });
      setResult(data);
    } catch { toast.error("AI checker failed, try again"); }
    finally { setChecking(false); }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied!");
  };

  if (loading) return (
    <div className="space-y-4 animate-pulse max-w-3xl mx-auto">
      <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-1/3" />
      <div className="glass-card p-6 space-y-3">
        {[...Array(3)].map((_, i) => <div key={i} className="h-4 bg-slate-200 dark:bg-slate-700 rounded" style={{ width: `${90 - i*15}%` }} />)}
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
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto space-y-5">

      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition">
          ←
        </button>
        <div className="flex gap-1.5 flex-wrap">
          <span className="text-xs px-2.5 py-1 rounded-full font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">{q.category}</span>
          <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${LEVEL_COLOR[q.level] ?? LEVEL_COLOR.Low}`}>{q.level}</span>
          <span className="text-xs px-2.5 py-1 rounded-full font-semibold bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">{q.type}</span>
        </div>
        <button onClick={copyLink} className="ml-auto text-xs text-slate-400 hover:text-indigo-500 transition flex items-center gap-1 px-2.5 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
          🔗 Share
        </button>
      </div>

      {/* Question card */}
      <div className="glass-card p-6 space-y-5">
        <p className="text-lg font-semibold text-slate-800 dark:text-slate-100 leading-relaxed">{q.question}</p>
        <div className="flex items-center gap-3 text-xs text-slate-400">
          <span>by <span className="font-medium text-slate-500 dark:text-slate-400">{q.author?.name ?? "Unknown"}</span></span>
          <span className="text-slate-300 dark:text-slate-600">·</span>
          <span>⬆ {q.upvoteCount}</span>
          <span>💬 {q.commentCount}</span>
          <span>★ {q.highlightCount}</span>
          {myAnswers.length > 0 && (
            <span className="ml-auto text-emerald-500 font-semibold">✓ You answered ({myAnswers.length})</span>
          )}
        </div>

        {q.hints?.length > 0 && (
          <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/60 rounded-xl p-4">
            <p className="text-xs font-bold text-indigo-500 mb-2 uppercase tracking-wider">💡 Hints</p>
            <ul className="space-y-1.5">
              {q.hints.map((h, i) => <li key={i} className="text-sm text-slate-600 dark:text-slate-300 flex gap-2"><span className="text-indigo-400">•</span>{h}</li>)}
            </ul>
          </div>
        )}
      </div>

      {/* Write & Save My Answer */}
      <div className="glass-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            ✏️ My Answer
            {myAnswers.length > 0 && (
              <span className="text-xs bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full font-semibold">
                {myAnswers.length} saved
              </span>
            )}
          </h2>
          {myAnswers.length > 0 && (
            <button onClick={() => setShowHistory(v => !v)}
              className="text-xs text-slate-400 hover:text-indigo-500 transition">
              {showHistory ? "▲ Hide history" : "▼ Show history"}
            </button>
          )}
        </div>

        <textarea
          value={draftAnswer}
          onChange={e => setDraftAnswer(e.target.value)}
          placeholder="Write your answer here…"
          rows={4}
          className="input-light w-full resize-none text-sm"
        />

        {/* Action row: Save + Show Answer + Check with AI */}
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={saveMyAnswer}
            disabled={savingAns || !draftAnswer.trim()}
            className="flex-1 py-2.5 rounded-xl border border-emerald-300 dark:border-emerald-700 text-emerald-600 dark:text-emerald-400 text-sm font-semibold hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition disabled:opacity-40"
          >
            {savingAns ? "Saving…" : "💾 Save Answer"}
          </button>
          <button
            onClick={() => setShowAnswer(v => !v)}
            className="flex-1 py-2.5 rounded-xl border border-dashed border-indigo-300 dark:border-indigo-700 text-indigo-500 text-sm font-semibold hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition"
          >
            {showAnswer ? "▲ Hide Answer" : "▼ Show Answer"}
          </button>
          <button
            onClick={checkWithAI}
            disabled={checking || (!draftAnswer.trim() && !userAnswer.trim())}
            className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm font-semibold hover:opacity-90 transition disabled:opacity-40"
          >
            {checking ? "⏳ Evaluating…" : "🎯 Check with AI"}
          </button>
        </div>

        {/* AI result */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`border rounded-2xl p-5 space-y-4 ${GRADE_BG[result.grade] ?? GRADE_BG.Poor}`}
            >
              <div className="flex items-center gap-4">
                <ScoreRing score={result.score} />
                <div>
                  <p className={`text-2xl font-black ${GRADE_COLOR[result.grade]}`}>{result.grade}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{result.score}/100 · AI Score</p>
                </div>
                <button onClick={() => setResult(null)} className="ml-auto text-slate-300 dark:text-slate-600 hover:text-slate-500 text-lg leading-none">✕</button>
              </div>
              <p className="text-sm text-slate-700 dark:text-slate-300">{result.feedback}</p>
              {result.strengths?.length > 0 && (
                <div>
                  <p className="text-xs font-bold text-emerald-600 mb-1.5 uppercase tracking-wider">✅ Strengths</p>
                  <ul className="space-y-1">
                    {result.strengths.map((s, i) => <li key={i} className="text-sm text-slate-600 dark:text-slate-300 flex gap-2"><span className="text-emerald-400">•</span>{s}</li>)}
                  </ul>
                </div>
              )}
              {result.missed?.length > 0 && (
                <div>
                  <p className="text-xs font-bold text-red-500 mb-1.5 uppercase tracking-wider">❌ Missed Points</p>
                  <ul className="space-y-1">
                    {result.missed.map((m, i) => <li key={i} className="text-sm text-slate-600 dark:text-slate-300 flex gap-2"><span className="text-red-400">•</span>{m}</li>)}
                  </ul>
                </div>
              )}
              {!showAnswer && (
                <button onClick={() => setShowAnswer(true)} className="text-xs text-indigo-500 hover:underline">See ideal answer ↓</button>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Ideal Answer panel */}
        <AnimatePresence>
          {showAnswer && q.answer && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              className="rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-900/20 p-5 space-y-2"
            >
              <p className="text-xs font-bold text-indigo-500 uppercase tracking-wider">💡 Ideal Answer</p>
              <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">{q.answer}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Saved answer history */}
        <AnimatePresence>
          {showHistory && myAnswers.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="space-y-3 border-t border-slate-100 dark:border-white/10 pt-4"
            >
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Your saved answers</p>
              {myAnswers.map((a, i) => (
                <div key={a.id} className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-4 space-y-2 border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs text-slate-400">#{i + 1} · {new Date(a.savedAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setDraftAnswer(a.answer)}
                        className="text-xs text-indigo-500 hover:underline"
                      >Edit</button>
                      <button
                        onClick={() => deleteMyAnswer(a.id)}
                        className="text-xs text-red-400 hover:underline"
                      >Delete</button>
                    </div>
                  </div>
                  <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">{a.answer}</p>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </motion.div>
  );
}
