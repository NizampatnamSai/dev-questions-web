import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const CAT_ICONS = {
  html: "🌐", css: "🎨", javascript: "⚡", typescript: "🔷",
  react: "⚛️", reactnative: "📱", nextjs: "▲", git: "🐙", dsa: "🧮",
};
const CAT_LABELS = {
  html: "HTML", css: "CSS", javascript: "JavaScript", typescript: "TypeScript",
  react: "React", reactnative: "React Native", nextjs: "Next.js", git: "Git & GitHub", dsa: "DSA",
};

function ScoreBar({ score }) {
  const color = score >= 70 ? "bg-green-500" : score >= 40 ? "bg-yellow-500" : "bg-red-500";
  return (
    <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
      <motion.div className={`h-full ${color} rounded-full`}
        initial={{ width: 0 }} animate={{ width: `${score}%` }} transition={{ duration: 0.8, ease: "easeOut" }} />
    </div>
  );
}

function AIExplanation({ challenge }) {
  const [expanded, setExpanded]   = useState(null); // null | "loading" | {content}
  const expand = async () => {
    if (expanded && expanded !== "loading") { setExpanded(null); return; }
    setExpanded("loading");
    try {
      const { data } = await api.post("/study/challenge/expand", {
        title: challenge.title,
        topic: challenge.topic,
        category: challenge.category,
        summary: challenge.summary,
      });
      setExpanded(data);
    } catch { setExpanded(null); }
  };
  return (
    <div>
      <button onClick={expand}
        className="text-xs px-3 py-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-500 rounded-lg border border-indigo-500/30 transition-all font-medium">
        {expanded === "loading" ? "⏳ Thinking…" : expanded ? "▲ Less" : "🤖 AI Explain More"}
      </button>
      <AnimatePresence>
        {expanded && expanded !== "loading" && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }} className="overflow-hidden mt-2">
            <div className="text-xs leading-relaxed space-y-2 bg-indigo-500/5 border border-indigo-500/20 rounded-xl p-3">
              {expanded.how_it_works && (
                <div><p className="font-semibold text-indigo-400 mb-0.5">⚙️ How it works</p><p className="text-slate-600 dark:text-slate-300">{expanded.how_it_works}</p></div>
              )}
              {expanded.example && (
                <div><p className="font-semibold text-indigo-400 mb-0.5">💡 Example</p><p className="text-slate-600 dark:text-slate-300">{expanded.example}</p></div>
              )}
              {expanded.interview_angle && (
                <div><p className="font-semibold text-amber-400 mb-0.5">🎯 Interview angle</p><p className="text-slate-600 dark:text-slate-300">{expanded.interview_angle}</p></div>
              )}
              {expanded.key_points && expanded.key_points.length > 0 && (
                <div>
                  <p className="font-semibold text-green-400 mb-0.5">✅ Key points</p>
                  <ul className="list-disc list-inside space-y-0.5">
                    {expanded.key_points.map((p, i) => <li key={i} className="text-slate-600 dark:text-slate-300">{p}</li>)}
                  </ul>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Progress() {
  const [areas, setAreas] = useState([]);
  const [streak, setStreak] = useState(null);
  const [challenge, setChallenge] = useState(null);
  const [loadingAreas, setLoadingAreas] = useState(true);
  const [loadingStreak, setLoadingStreak] = useState(true);
  const [completing, setCompleting] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/study/weak-areas").then(({ data }) => setAreas(data.areas)).catch(() => {}).finally(() => setLoadingAreas(false));
    api.get("/study/streak").then(({ data }) => {
      setStreak(data);
      setChallenge(data.challenge);
    }).catch(() => {}).finally(() => setLoadingStreak(false));
  }, []);

  async function completeChallenge() {
    setCompleting(true);
    try {
      const { data } = await api.post("/study/streak/complete");
      setStreak((prev) => ({ ...prev, streak: data.streak, todayDone: true }));
    } catch {} finally { setCompleting(false); }
  }

  const overallScore = areas.length
    ? Math.round(areas.reduce((a, b) => a + b.score, 0) / areas.length)
    : 0;

  const weakest = [...areas].sort((a, b) => a.score - b.score).slice(0, 3);

  return (
    <div className="min-h-screen px-4 py-8 max-w-4xl mx-auto space-y-8 text-slate-800 dark:text-white">

      {/* ── Streak + Daily Challenge ── */}
      <div className="grid md:grid-cols-2 gap-4">

        {/* Streak card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-lg">Daily Streak 🔥</h2>
            {streak?.todayDone && (
              <span className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded-full border border-green-500/30">Today Done ✓</span>
            )}
          </div>
          {loadingStreak ? (
            <div className="h-20 animate-pulse bg-slate-200 dark:bg-slate-800 rounded-xl" />
          ) : (
            <>
              <div className="text-center py-4">
                <div className="text-6xl font-black text-orange-400">{streak?.streak ?? 0}</div>
                <div className="text-sm text-slate-400 mt-1">
                  {streak?.streak === 0 ? "Start your streak today!" :
                   streak?.streak === 1 ? "Day 1 — keep it going!" :
                   `${streak.streak} days in a row 🔥`}
                </div>
              </div>
              <div className="flex justify-center gap-2 mt-2">
                {Array.from({ length: 7 }).map((_, i) => {
                  const filled = i < (streak?.streak ?? 0) % 7 || (streak?.streak ?? 0) >= 7;
                  return (
                    <div key={i} className={`w-7 h-7 rounded-full flex items-center justify-center text-sm transition-all ${filled ? "bg-orange-500 text-white" : "bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600"}`}>
                      {filled ? "🔥" : "○"}
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </motion.div>

        {/* Daily challenge */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="glass-card p-6">
          <h2 className="font-bold text-lg mb-4">Today's Challenge ⚡</h2>
          {loadingStreak || !challenge ? (
            <div className="h-32 animate-pulse bg-slate-200 dark:bg-slate-800 rounded-xl" />
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xs px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-500 dark:text-slate-400">{CAT_LABELS[challenge.category]}</span>
                <span className="text-xs text-slate-500">{challenge.topic} → {challenge.title}</span>
              </div>
              <p className="text-sm text-slate-800 dark:text-white font-medium">{challenge.question}</p>
              <AnimatePresence initial={false}>
                {showAnswer && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.22, ease: "easeInOut" }}
                    className="overflow-hidden">
                    <div className="text-xs text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-lg p-3 leading-relaxed">
                      {challenge.summary}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div className="flex gap-2">
                <button onClick={() => setShowAnswer((v) => !v)}
                  className="flex-1 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-xs font-semibold transition-all">
                  {showAnswer ? "Hide Answer" : "See Answer"}
                </button>
                {!streak?.todayDone && (
                  <button onClick={completeChallenge} disabled={completing}
                    className="flex-1 py-2 bg-orange-600 hover:bg-orange-500 disabled:opacity-50 rounded-lg text-xs font-bold transition-all">
                    {completing ? "..." : "Mark Done 🔥"}
                  </button>
                )}
              </div>
              {showAnswer && <AIExplanation challenge={challenge} />}
            </div>
          )}
        </motion.div>
      </div>

      {/* ── Overall score ── */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        className="glass-card p-6 text-center">
        <h2 className="font-bold text-lg mb-4">Overall Readiness 📊</h2>
        {loadingAreas ? (
          <div className="h-24 animate-pulse bg-slate-200 dark:bg-slate-800 rounded-xl" />
        ) : (
          <>
            <div className={`text-6xl font-black ${overallScore >= 70 ? "text-green-400" : overallScore >= 40 ? "text-yellow-400" : "text-red-400"}`}>
              {overallScore}%
            </div>
            <p className="text-slate-400 text-sm mt-2">
              {overallScore >= 70 ? "Interview-ready! 🎉 Keep polishing edge cases." :
               overallScore >= 40 ? "Good progress. Focus on weak areas below." :
               "Keep studying! Use Study Hub + Flashcards daily."}
            </p>
          </>
        )}
      </motion.div>

      {/* ── Weak areas ── */}
      {weakest.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6">
          <h2 className="font-bold text-lg mb-1">⚠️ Focus Areas</h2>
          <p className="text-xs text-slate-400 mb-4">These categories need the most attention.</p>
          <div className="space-y-3">
            {weakest.map((a) => (
              <div key={a.category} className="flex items-center gap-3">
                <span className="text-xl w-8">{CAT_ICONS[a.category]}</span>
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium">{CAT_LABELS[a.category]}</span>
                    <span className="text-slate-400">{a.know}/{a.total} known</span>
                  </div>
                  <ScoreBar score={a.score} />
                </div>
                <button onClick={() => navigate("/study", { state: { preCategory: a.category } })}
                  className="text-xs px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg border border-red-500/30 transition-all">
                  Study →
                </button>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* ── All categories ── */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
        <h2 className="font-bold text-lg mb-4">All Categories</h2>
        <div className="grid md:grid-cols-2 gap-3">
          {loadingAreas ? (
            Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="h-24 animate-pulse bg-slate-100 dark:bg-slate-900 rounded-xl" />
            ))
          ) : (
            areas.map((a) => (
              <div key={a.category} className="glass-card p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl">{CAT_ICONS[a.category]}</span>
                  <span className="font-semibold">{CAT_LABELS[a.category]}</span>
                  <span className={`ml-auto text-sm font-bold ${a.score >= 70 ? "text-green-400" : a.score >= 40 ? "text-yellow-400" : "text-red-400"}`}>
                    {a.score}%
                  </span>
                </div>
                <ScoreBar score={a.score} />
                <div className="flex justify-between text-xs text-slate-500 mt-2">
                  <span>✅ {a.know} known</span>
                  <span>🔄 {a.review} review</span>
                  <span>👁️ {a.unseen} unseen</span>
                </div>
              </div>
            ))
          )}
        </div>
      </motion.div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-3 pb-8">
        <button onClick={() => navigate("/flashcards")}
          className="py-4 bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-indigo-400 rounded-xl font-semibold transition-all">
          🃏 Flashcards
        </button>
        <button onClick={() => navigate("/mock-interview")}
          className="py-4 bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-indigo-400 rounded-xl font-semibold transition-all">
          🎯 Mock Interview
        </button>
      </div>
    </div>
  );
}
