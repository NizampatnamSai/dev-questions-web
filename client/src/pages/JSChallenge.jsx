import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api/axios";
import toast from "react-hot-toast";

const STATUS_STYLE = {
  got_it:  "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-700",
  missed:  "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 border-red-200 dark:border-red-700",
  current: "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border-indigo-300 dark:border-indigo-600",
  locked:  "bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700",
  skipped: "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-700",
};
const STATUS_LABEL = { got_it:"✓ Got it", missed:"✗ Missed", current:"Today", locked:"🔒 Locked", skipped:"– Skipped" };

function CodeBlock({ code }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="relative mt-3">
      <pre className="bg-slate-900 rounded-xl p-4 text-xs text-green-300 overflow-x-auto leading-relaxed font-mono whitespace-pre-wrap">
        {code}
      </pre>
      <button
        onClick={() => { navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
        className="absolute top-2 right-2 text-[10px] px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 transition"
      >
        {copied ? "✓ Copied" : "Copy"}
      </button>
    </div>
  );
}

function renderContent(text) {
  const codeBlockRegex = /```[\w]*\n([\s\S]*?)```/g;
  const parts = [];
  let lastIndex = 0;
  let match;
  while ((match = codeBlockRegex.exec(text)) !== null) {
    if (match.index > lastIndex) parts.push(<span key={lastIndex} className="whitespace-pre-wrap">{text.slice(lastIndex, match.index)}</span>);
    parts.push(<CodeBlock key={match.index} code={match[1].trim()} />);
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) parts.push(<span key={lastIndex} className="whitespace-pre-wrap">{text.slice(lastIndex)}</span>);
  return parts;
}

export default function JSChallenge() {
  const [status, setStatus]     = useState(null);
  const [today, setToday]       = useState(null);
  const [history, setHistory]   = useState([]);
  const [view, setView]         = useState("today"); // "today" | "history"
  const [loading, setLoading]   = useState(true);
  const [answering, setAnswering] = useState(false);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => { loadAll(); }, []);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [s, h] = await Promise.all([
        api.get("/challenge/status"),
        api.get("/challenge/history").catch(() => ({ data: { history: [] } })),
      ]);
      setStatus(s.data);
      setHistory(h.data.history || []);
      if (s.data.joined) {
        const t = await api.get("/challenge/today");
        setToday(t.data);
      }
    } catch {}
    setLoading(false);
  };

  const join = async () => {
    try {
      await api.post("/challenge/join");
      toast.success("🎉 Welcome to the 30-Day JS Challenge!");
      loadAll();
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to join");
    }
  };

  const answer = async (result) => {
    setAnswering(true);
    try {
      const { data } = await api.post("/challenge/answer", { result });
      setToday(prev => ({ ...prev, answered: true, result, answer: data.answer }));
      setHistory(prev => prev.map(h => h.day === data.day ? { ...h, status: result } : h));
      toast.success(result === "got_it" ? "🎉 Marked as Got it!" : "📝 Marked as Missed — review the answer!");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Error");
    }
    setAnswering(false);
  };

  const toggleOpt = async () => {
    const { data } = await api.post("/challenge/opt-toggle");
    setStatus(prev => ({ ...prev, optedIn: data.optedIn }));
    toast.success(data.optedIn ? "🔔 Notifications enabled" : "🔕 Notifications disabled");
  };

  if (loading) return (
    <div className="space-y-4 max-w-2xl">
      {[1,2,3].map(i => <div key={i} className="glass-card p-6 animate-pulse h-24" />)}
    </div>
  );

  if (!status?.joined) return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl space-y-6">
      <div className="glass-card p-8 text-center space-y-4">
        <div className="text-6xl">🧩</div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">30-Day JS Challenge</h1>
        <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">
          One advanced JavaScript question per working day. Track your progress, reveal answers, and level up your JS skills over 30 days.
        </p>
        <div className="flex flex-wrap justify-center gap-3 text-sm">
          {["30 advanced questions", "Mon–Sat", "10 AM reminder", "Self-paced per user"].map(t => (
            <span key={t} className="px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-700 text-xs font-medium">{t}</span>
          ))}
        </div>
        <button onClick={join} className="btn-primary px-8 py-3 rounded-xl font-semibold">
          🚀 Start My Challenge
        </button>
      </div>
    </motion.div>
  );

  const gotCount  = history.filter(h => h.status === "got_it").length;
  const missCount = history.filter(h => h.status === "missed").length;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl space-y-5">
      {/* Header */}
      <div className="glass-card p-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="text-3xl">🧩</div>
            <div>
              <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">30-Day JS Challenge</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">Day {status.currentDay} of 30</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={toggleOpt} className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition ${status.optedIn ? "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-200 dark:border-green-700" : "bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700"}`}>
              {status.optedIn ? "🔔 Notifs ON" : "🔕 Notifs OFF"}
            </button>
          </div>
        </div>
        {/* Progress bar */}
        <div className="mt-4 space-y-1">
          <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>✓ {gotCount} got it · ✗ {missCount} missed</span>
            <span>{Math.round(((gotCount + missCount) / 30) * 100)}% complete</span>
          </div>
          <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full flex">
              <div className="bg-green-500 transition-all" style={{ width: `${(gotCount / 30) * 100}%` }} />
              <div className="bg-red-400 transition-all" style={{ width: `${(missCount / 30) * 100}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Tab toggle */}
      <div className="flex gap-2">
        {["today", "history"].map(v => (
          <button key={v} onClick={() => setView(v)} className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${view === v ? "bg-indigo-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"}`}>
            {v === "today" ? "📋 Today's Question" : "📅 History"}
          </button>
        ))}
      </div>

      {/* Today's question */}
      {view === "today" && today && (
        <motion.div key="today" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="glass-card p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-500 uppercase tracking-wider">Day {today.day} / 30</span>
              {today.answered && (
                <span className={`text-xs px-2.5 py-1 rounded-full border font-semibold ${today.result === "got_it" ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200" : "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 border-red-200"}`}>
                  {today.result === "got_it" ? "✓ Got it" : "✗ Missed"}
                </span>
              )}
            </div>
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">{today.title}</h2>
            <div className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {renderContent(today.question)}
            </div>

            {!today.answered && (
              <div className="space-y-3">
                <button onClick={() => setShowHint(v => !v)} className="text-xs text-amber-500 hover:text-amber-400 transition underline">
                  {showHint ? "Hide hint" : "💡 Show hint"}
                </button>
                <AnimatePresence>
                  {showHint && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/40 rounded-xl p-3 text-sm text-amber-700 dark:text-amber-300">
                        💡 {today.hint}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                <div className="flex gap-2 pt-1">
                  <button onClick={() => answer("got_it")} disabled={answering} className="flex-1 py-2.5 rounded-xl bg-green-500 hover:bg-green-600 text-white font-semibold text-sm transition disabled:opacity-50">
                    ✓ Got it
                  </button>
                  <button onClick={() => answer("missed")} disabled={answering} className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold text-sm transition disabled:opacity-50">
                    ✗ Missed — show answer
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Answer reveal */}
          {today.answered && today.answer && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-5 space-y-2 border border-indigo-200 dark:border-indigo-700/40">
              <p className="text-xs font-bold text-indigo-500 uppercase tracking-wider">Answer</p>
              <div className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                {renderContent(today.answer)}
              </div>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* History */}
      {view === "history" && (
        <motion.div key="history" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {history.map(h => (
            <div key={h.day} className={`glass-card p-3 border rounded-xl text-sm transition ${STATUS_STYLE[h.status] || STATUS_STYLE.locked}`}>
              <p className="font-bold text-xs mb-1">Day {h.day}</p>
              <p className="font-medium text-xs truncate mb-1">{h.title}</p>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${STATUS_STYLE[h.status]}`}>
                {STATUS_LABEL[h.status] || h.status}
              </span>
            </div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}
