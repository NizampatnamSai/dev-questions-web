import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axios";

const CATEGORIES = ["HTML/CSS", "JavaScript", "React", "Next.js", "React Native", "Python", "Python Backend", "Python AI/ML", "Python Data Analysis"];
const LEVELS     = ["Low", "Medium", "High"];
const TIME_OPTS  = [
  { label: "No Limit", value: 0 },
  { label: "30s",      value: 30 },
  { label: "60s",      value: 60 },
  { label: "90s",      value: 90 },
  { label: "2 min",    value: 120 },
];

const GRADE_COLOR = { Excellent: "#22c55e", Good: "#3b82f6", Partial: "#eab308", Poor: "#ef4444" };

function ScoreRing({ score, size = 80 }) {
  const r = (size / 2) - 8;
  const circ = 2 * Math.PI * r;
  const color = score >= 80 ? "#22c55e" : score >= 60 ? "#3b82f6" : score >= 40 ? "#eab308" : "#ef4444";
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#e2e8f0" strokeWidth="7" />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="7"
        strokeDasharray={`${(score/100)*circ} ${circ}`} strokeLinecap="round"
        transform={`rotate(-90 ${size/2} ${size/2})`} />
      <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle"
        fontSize={size * 0.22} fontWeight="bold" fill="currentColor">{score}</text>
    </svg>
  );
}

// ── Countdown Timer ────────────────────────────────────────────────────────────
function Timer({ seconds, onExpire }) {
  const [left, setLeft] = useState(seconds);
  const ref = useRef(null);

  useEffect(() => {
    setLeft(seconds);
    ref.current = setInterval(() => {
      setLeft(prev => {
        if (prev <= 1) {
          clearInterval(ref.current);
          onExpire();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(ref.current);
  }, [seconds]);

  const pct = (left / seconds) * 100;
  const color = left > seconds * 0.5 ? "#22c55e" : left > seconds * 0.25 ? "#eab308" : "#ef4444";
  const r = 16;
  const circ = 2 * Math.PI * r;

  return (
    <div className="flex items-center gap-2">
      <svg width={40} height={40} viewBox="0 0 40 40">
        <circle cx={20} cy={20} r={r} fill="none" stroke="#e2e8f020" strokeWidth="4" />
        <circle cx={20} cy={20} r={r} fill="none" stroke={color} strokeWidth="4"
          strokeDasharray={`${(pct/100)*circ} ${circ}`} strokeLinecap="round"
          transform="rotate(-90 20 20)" style={{ transition: "stroke-dasharray 1s linear, stroke 0.5s" }} />
        <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle"
          fontSize="11" fontWeight="bold" fill={color}>{left}</text>
      </svg>
      <span className="text-xs font-semibold" style={{ color }}>
        {left > 0 ? `${left}s left` : "Time's up!"}
      </span>
    </div>
  );
}

// ── Setup screen ───────────────────────────────────────────────────────────────
function QuizSetup({ onStart }) {
  const [categories, setCategories] = useState([]);
  const [level, setLevel]           = useState("");
  const [count, setCount]       = useState(10);
  const [timeLimit, setTimeLimit] = useState(60);

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="max-w-md mx-auto space-y-6">
      <div className="text-center space-y-2">
        <div className="text-5xl">🧠</div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Quiz Mode</h1>
        <p className="text-sm text-slate-500">Test yourself with random interview questions</p>
      </div>

      <div className="glass-card p-6 space-y-4">
        <div>
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 block">
            Category {categories.length > 0 && <span className="text-indigo-400 normal-case font-normal">({categories.length} selected)</span>}
          </label>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setCategories([])}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition ${categories.length === 0 ? "bg-indigo-500 border-indigo-500 text-white" : "border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:border-indigo-400 hover:text-indigo-500"}`}>
              All
            </button>
            {CATEGORIES.map(c => (
              <button key={c}
                onClick={() => setCategories(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c])}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition ${categories.includes(c) ? "bg-indigo-500 border-indigo-500 text-white" : "border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:border-indigo-400 hover:text-indigo-500"}`}>
                {c}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 block">Difficulty</label>
          <div className="flex flex-wrap gap-2">
            {["", ...LEVELS].map(l => (
              <button key={l} onClick={() => setLevel(l)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition ${level === l ? "bg-indigo-500 border-indigo-500 text-white" : "border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:border-indigo-400 hover:text-indigo-500"}`}>
                {l || "All"}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1 block">
            Questions: <span className="text-indigo-500 font-bold">{count}</span>
          </label>
          <input type="range" min={5} max={20} step={5} value={count}
            onChange={e => setCount(Number(e.target.value))}
            className="w-full accent-indigo-500" />
          <div className="flex justify-between text-xs text-slate-400 mt-1">
            <span>5</span><span>10</span><span>15</span><span>20</span>
          </div>
        </div>

        {/* Time per question */}
        <div>
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 block">
            ⏱ Time per Question
          </label>
          <div className="flex gap-2 flex-wrap">
            {TIME_OPTS.map(opt => (
              <button key={opt.value}
                onClick={() => setTimeLimit(opt.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                  timeLimit === opt.value
                    ? "bg-indigo-500 border-indigo-500 text-white"
                    : "border-slate-200 dark:border-slate-700 text-slate-500 hover:border-indigo-400 hover:text-indigo-400"
                }`}>
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => onStart({ category: categories.join(","), level, count, timeLimit })}
          className="btn-primary w-full text-base py-3 mt-2"
        >
          Start Quiz →
        </button>
      </div>
    </motion.div>
  );
}

// ── Quiz card ──────────────────────────────────────────────────────────────────
function QuizCard({ q, index, total, timeLimit, onAnswer }) {
  const [showAnswer, setShowAnswer]     = useState(false);
  const [showIdeal, setShowIdeal]       = useState(false);
  const [userAnswer, setUserAnswer]     = useState("");
  const [checking, setChecking]         = useState(false);
  const [result, setResult]             = useState(null);
  const [mode, setMode]                 = useState("ai");
  const [timedOut, setTimedOut]         = useState(false);
  const timerKey = `${q.id}-${index}`;

  const handleExpire = useCallback(() => {
    setTimedOut(true);
    toast("⏰ Time's up! Moving on...", { icon: "⏰" });
    setTimeout(() => onAnswer({ qid: q.id, rating: "timeout", score: 0 }), 1200);
  }, [q.id, onAnswer]);

  const selfRate = (rating) => onAnswer({ qid: q.id, rating, score: rating === "correct" ? 100 : rating === "partial" ? 50 : 0 });

  const checkWithAI = async () => {
    if (!userAnswer.trim()) return toast.error("Write your answer first");
    setChecking(true);
    try {
      const { data } = await api.post(`/questions/${q.id}/check-answer`, { user_answer: userAnswer });
      setResult(data);
    } catch { toast.error("AI check failed"); }
    finally { setChecking(false); }
  };

  return (
    <motion.div key={q.id} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}
      className="space-y-4 max-w-2xl mx-auto">

      {/* Progress + timer row */}
      <div className="flex items-center gap-3">
        <div className="flex-1 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
          <div className="bg-indigo-500 h-2 rounded-full transition-all" style={{ width: `${(index / total) * 100}%` }} />
        </div>
        <span className="text-xs text-slate-400 font-medium">{index + 1} / {total}</span>
        {timeLimit > 0 && !timedOut && !result && !showAnswer && (
          <Timer key={timerKey} seconds={timeLimit} onExpire={handleExpire} />
        )}
      </div>

      {/* Badges */}
      <div className="flex gap-2 flex-wrap">
        <span className="badge">{q.category}</span>
        <span className={`badge ${q.level === "High" ? "badge-red" : q.level === "Medium" ? "badge-yellow" : "badge-green"}`}>{q.level}</span>
        <span className="badge">{q.type}</span>
      </div>

      {/* Question */}
      <div className="glass-card p-6">
        <p className="text-lg font-semibold text-slate-800 dark:text-slate-100 leading-relaxed">{q.question}</p>
        {q.hints?.length > 0 && (
          <div className="mt-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-3">
            <p className="text-xs font-semibold text-indigo-500 mb-1">💡 Hints</p>
            {q.hints.map((h, i) => <p key={i} className="text-sm text-slate-600 dark:text-slate-300">• {h}</p>)}
          </div>
        )}
      </div>

      {/* Mode tabs */}
      <div className="flex gap-2">
        <button onClick={() => { setMode("self"); setResult(null); }}
          className={`flex-1 py-2 rounded-xl text-sm font-medium transition ${mode === "self" ? "bg-indigo-500 text-white" : "glass-card text-slate-500 hover:text-slate-700"}`}>
          🙋 Self Rate
        </button>
        <button onClick={() => { setMode("ai"); setShowAnswer(false); }}
          className={`flex-1 py-2 rounded-xl text-sm font-medium transition ${mode === "ai" ? "bg-indigo-500 text-white" : "glass-card text-slate-500 hover:text-slate-700"}`}>
          🤖 AI Check
        </button>
      </div>

      {/* Self-rate mode */}
      {mode === "self" && (
        <div className="glass-card p-5 space-y-4">
          <button onClick={() => setShowAnswer(v => !v)}
            className="w-full py-2 rounded-xl border border-dashed border-indigo-300 dark:border-indigo-700 text-indigo-500 text-sm hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition">
            {showAnswer ? "Hide Answer ▲" : "Reveal Answer ▼"}
          </button>
          <AnimatePresence>
            {showAnswer && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-4 text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                  {q.answer}
                </div>
                <p className="text-xs text-slate-400 mt-3 mb-2 font-medium">How did you do?</p>
                <div className="flex gap-2">
                  <button onClick={() => selfRate("correct")} className="flex-1 py-2 rounded-xl bg-green-500 text-white text-sm font-semibold hover:bg-green-600 transition">✅ Got it</button>
                  <button onClick={() => selfRate("partial")} className="flex-1 py-2 rounded-xl bg-yellow-500 text-white text-sm font-semibold hover:bg-yellow-600 transition">⚡ Partial</button>
                  <button onClick={() => selfRate("wrong")}   className="flex-1 py-2 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition">❌ Missed</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          {!showAnswer && (
            <button onClick={() => selfRate("skip")} className="w-full text-xs text-slate-400 hover:text-slate-600 transition">Skip →</button>
          )}
        </div>
      )}

      {/* AI check mode */}
      {mode === "ai" && (
        <div className="glass-card p-5 space-y-4">
          {!result ? (
            <>
              <textarea value={userAnswer} onChange={e => setUserAnswer(e.target.value)}
                placeholder="Type your answer as if in a real interview..."
                rows={4} className="input-light w-full resize-none text-sm" />
              <div className="flex gap-2">
                <button onClick={checkWithAI} disabled={checking} className="flex-1 btn-primary disabled:opacity-60">
                  {checking ? "⏳ Evaluating..." : "🎯 Check Answer"}
                </button>
                <button onClick={() => selfRate("skip")} className="text-xs text-slate-400 hover:text-slate-600 px-3">Skip</button>
              </div>
            </>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              {/* Score + grade */}
              <div className="flex items-center gap-4">
                <ScoreRing score={result.score} size={72} />
                <div>
                  <p className="font-bold text-xl" style={{ color: GRADE_COLOR[result.grade] }}>{result.grade}</p>
                  <p className="text-sm text-slate-500">{result.score}/100</p>
                </div>
              </div>

              {/* Feedback */}
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{result.feedback}</p>

              {/* Strengths */}
              {result.strengths?.length > 0 && (
                <div className="bg-green-50 dark:bg-green-900/10 rounded-xl p-3">
                  <p className="text-xs font-bold text-green-600 mb-2">✅ What you got right</p>
                  {result.strengths.map((s, i) => (
                    <p key={i} className="text-sm text-slate-700 dark:text-slate-300">• {s}</p>
                  ))}
                </div>
              )}

              {/* Missed points */}
              {result.missed?.length > 0 && (
                <div className="bg-red-50 dark:bg-red-900/10 rounded-xl p-3">
                  <p className="text-xs font-bold text-red-500 mb-2">❌ Key points you missed</p>
                  {result.missed.map((m, i) => (
                    <p key={i} className="text-sm text-slate-700 dark:text-slate-300">• {m}</p>
                  ))}
                </div>
              )}

              {/* Ideal answer toggle */}
              <div className="border border-dashed border-indigo-300 dark:border-indigo-700 rounded-xl overflow-hidden">
                <button
                  onClick={() => setShowIdeal(v => !v)}
                  className="w-full flex items-center justify-between px-4 py-2.5 text-sm font-semibold text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition">
                  <span>📖 See Ideal Answer</span>
                  <span>{showIdeal ? "▲" : "▼"}</span>
                </button>
                <AnimatePresence>
                  {showIdeal && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <div className="px-4 pb-4 pt-1 text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed bg-indigo-50/50 dark:bg-indigo-900/10">
                        {q.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button onClick={() => onAnswer({ qid: q.id, rating: "ai", score: result.score, grade: result.grade })}
                className="btn-primary w-full">Next Question →</button>
            </motion.div>
          )}
        </div>
      )}
    </motion.div>
  );
}

// ── Results screen ─────────────────────────────────────────────────────────────
function QuizResults({ answers, total, onRestart, onExit }) {
  const avg     = Math.round(answers.reduce((s, a) => s + (a.score ?? 0), 0) / (answers.length || 1));
  const got     = answers.filter(a => a.score >= 80).length;
  const partial = answers.filter(a => a.score >= 40 && a.score < 80).length;
  const missed  = answers.filter(a => a.score < 40).length;

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md mx-auto space-y-6 text-center">
      <div className="text-5xl">{avg >= 80 ? "🏆" : avg >= 60 ? "🎉" : avg >= 40 ? "📚" : "💪"}</div>
      <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Quiz Complete!</h2>

      <div className="flex justify-center">
        <ScoreRing score={avg} size={120} />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="glass-card p-4">
          <p className="text-2xl font-bold text-green-500">{got}</p>
          <p className="text-xs text-slate-500">Got it</p>
        </div>
        <div className="glass-card p-4">
          <p className="text-2xl font-bold text-yellow-500">{partial}</p>
          <p className="text-xs text-slate-500">Partial</p>
        </div>
        <div className="glass-card p-4">
          <p className="text-2xl font-bold text-red-500">{missed}</p>
          <p className="text-xs text-slate-500">Missed</p>
        </div>
      </div>

      <p className="text-sm text-slate-500">
        {avg >= 80 ? "Excellent work! You're well prepared." :
         avg >= 60 ? "Good effort! Review the missed topics." :
         avg >= 40 ? "Keep practicing, you're getting there." :
         "Don't give up! Review the answers and try again."}
      </p>

      <div className="flex gap-3">
        <button onClick={onRestart} className="flex-1 btn-primary">🔄 Try Again</button>
        <button onClick={onExit}    className="flex-1 glass-card py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-500 transition">Exit</button>
      </div>
    </motion.div>
  );
}

// ── Main Quiz page ─────────────────────────────────────────────────────────────
export default function Quiz() {
  const navigate = useNavigate();
  const [phase, setPhase]         = useState("setup");
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent]     = useState(0);
  const [answers, setAnswers]     = useState([]);
  const [loading, setLoading]     = useState(false);
  const [timeLimit, setTimeLimit] = useState(60);

  const startQuiz = async ({ category, level, count, timeLimit: tl }) => {
    setLoading(true);
    setTimeLimit(tl);
    try {
      const params = { count };
      if (category) params.category = category;
      if (level)    params.level    = level;
      const { data } = await api.get("/questions/quiz/random", { params });
      if (!data.length) return toast.error("No questions found for these filters");
      setQuestions(data);
      setAnswers([]);
      setCurrent(0);
      setPhase("playing");
    } catch { toast.error("Failed to load quiz"); }
    finally { setLoading(false); }
  };

  const handleAnswer = useCallback((ans) => {
    setAnswers(prev => [...prev, ans]);
    setCurrent(c => {
      if (c + 1 >= questions.length) setPhase("results");
      return c + 1;
    });
  }, [questions.length]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="text-center space-y-3">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-slate-400 text-sm">Loading questions...</p>
      </div>
    </div>
  );

  return (
    <div className="py-4">
      <AnimatePresence mode="wait">
        {phase === "setup" && <QuizSetup key="setup" onStart={startQuiz} />}
        {phase === "playing" && questions[current] && (
          <QuizCard
            key={questions[current].id}
            q={questions[current]}
            index={current}
            total={questions.length}
            timeLimit={timeLimit}
            onAnswer={handleAnswer}
          />
        )}
        {phase === "results" && (
          <QuizResults
            key="results"
            answers={answers}
            total={questions.length}
            onRestart={() => setPhase("setup")}
            onExit={() => navigate("/dashboard")}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
