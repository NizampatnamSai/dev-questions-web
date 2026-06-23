import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api/axios";

const CATEGORIES = [
  { id: "", label: "All Topics" },
  { id: "dsa", label: "DSA 🧮", badge: "Advanced" },
  { id: "html", label: "HTML" },
  { id: "css", label: "CSS" },
  { id: "javascript", label: "JavaScript" },
  { id: "typescript", label: "TypeScript" },
  { id: "react", label: "React" },
  { id: "reactnative", label: "React Native" },
  { id: "nextjs", label: "Next.js" },
  { id: "git", label: "Git & GitHub" },
];

const DIFFICULTIES = [
  { id: "", label: "All Levels" },
  { id: "Basic", label: "Basic" },
  { id: "Intermediate", label: "Intermediate" },
  { id: "Advanced", label: "Advanced" },
  { id: "Tricky", label: "Tricky" },
];

const SCORE_COLOR = (s) => {
  if (s >= 8) return "text-green-400";
  if (s >= 5) return "text-yellow-400";
  return "text-red-400";
};

const SCORE_BG = (s) => {
  if (s >= 8) return "bg-green-500/20 border-green-500/40";
  if (s >= 5) return "bg-yellow-500/20 border-yellow-500/40";
  return "bg-red-500/20 border-red-500/40";
};

export default function MockInterview() {
  const [phase, setPhase] = useState("setup"); // setup | interview | results
  const [categories, setCategories] = useState([]);
  const [difficulty, setDifficulty] = useState("");
  const [count, setCount] = useState(7);
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [scores, setScores] = useState({});
  const [loadingStart, setLoadingStart] = useState(false);
  const [loadingEval, setLoadingEval] = useState(false);
  const [timer, setTimer] = useState(0);
  const timerRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    if (phase === "interview") {
      timerRef.current = setInterval(() => setTimer((t) => t + 1), 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [phase]);

  const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  async function startInterview() {
    setLoadingStart(true);
    try {
      const category = categories.length === 1 ? categories[0] : categories.length > 1 ? categories.join(",") : "";
      const { data } = await api.post("/study/mock/start", { category, difficulty, count });
      if (!data.questions || data.questions.length === 0) {
        alert("No questions found for the selected filters. Try a different category or difficulty.");
        return;
      }
      setQuestions(data.questions);
      setAnswers({});
      setScores({});
      setCurrent(0);
      setTimer(0);
      setPhase("interview");
    } catch {
      alert("Failed to load questions. Please try again.");
    } finally {
      setLoadingStart(false);
    }
  }

  async function submitAnswer() {
    const q = questions[current];
    const ans = (answers[current] || "").trim();
    // No answer given — score 0 immediately without calling AI
    if (!ans) {
      setScores((prev) => ({
        ...prev,
        [current]: {
          score: 0,
          right: "Nothing, as no answer was provided.",
          missed: "The key points for this question were not addressed.",
          model_answer: q.hint || "",
        },
      }));
      return;
    }
    setLoadingEval(true);
    try {
      const { data } = await api.post("/study/mock/evaluate", {
        question: q.question,
        topic: q.topic,
        title: q.title,
        explanation: q.hint,
        user_answer: ans,
      });
      setScores((prev) => ({ ...prev, [current]: data }));
    } catch {
      setScores((prev) => ({ ...prev, [current]: { score: 0, right: "", missed: "Evaluation failed", model_answer: "" } }));
    } finally {
      setLoadingEval(false);
    }
  }

  async function nextQuestion() {
    if (!scores[current]) await submitAnswer();
    if (current + 1 < questions.length) {
      setCurrent((c) => c + 1);
    } else {
      setPhase("results");
    }
  }

  const avgScore = () => {
    const vals = Object.values(scores).map((s) => s.score);
    if (!vals.length) return 0;
    return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
  };

  const q = questions[current];

  return (
    <div className="min-h-screen px-4 py-8 max-w-4xl mx-auto text-slate-800 dark:text-white">
      <AnimatePresence mode="wait">

        {/* ── Setup ── */}
        {phase === "setup" && (
          <motion.div key="setup" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="text-center mb-10">
              <div className="text-6xl mb-4">🎯</div>
              <h1 className="text-3xl font-bold mb-2">Mock Interview</h1>
              <p className="text-slate-500 dark:text-slate-400">AI-powered interview simulation. Answer questions out loud or in writing — get scored with feedback.</p>
            </div>

            <div className="glass-card p-6 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-600 dark:text-slate-300 mb-2">
                  Category {categories.length > 0 && <span className="text-indigo-400 font-normal">({categories.length} selected)</span>}
                </label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.filter(c => c.id !== "").map((c) => (
                    <button key={c.id}
                      onClick={() => setCategories(prev => prev.includes(c.id) ? prev.filter(x => x !== c.id) : [...prev, c.id])}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 ${categories.includes(c.id) ? "bg-indigo-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"}`}>
                      {c.label}{c.badge && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-red-500/20 text-red-400 font-semibold">{c.badge}</span>}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-slate-400 mt-1.5">Select multiple or none for all topics</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-600 dark:text-slate-300 mb-2">Difficulty</label>
                <div className="flex flex-wrap gap-2">
                  {DIFFICULTIES.map((d) => (
                    <button key={d.id} onClick={() => setDifficulty(d.id)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${difficulty === d.id ? "bg-indigo-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"}`}>
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-600 dark:text-slate-300 mb-2">
                  Number of Questions: <span className="text-indigo-400">{count}</span>
                </label>
                <input type="range" min={3} max={15} value={count} onChange={(e) => setCount(+e.target.value)}
                  className="w-full accent-indigo-500" />
                <div className="flex justify-between text-xs text-slate-400 mt-1"><span>3</span><span>15</span></div>
              </div>

              <button onClick={startInterview} disabled={loadingStart}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded-xl font-bold text-lg text-white transition-all">
                {loadingStart ? "Loading questions..." : "Start Interview →"}
              </button>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-4 text-center">
              {[["🤖", "AI Scoring", "Scored 1-10 with detailed feedback"], ["⏱️", "Timed Session", "Track how long you take per question"], ["📊", "Full Review", "See model answers after each question"]].map(([icon, title, desc]) => (
                <div key={title} className="glass-card p-4">
                  <div className="text-2xl mb-2">{icon}</div>
                  <div className="font-semibold text-sm">{title}</div>
                  <div className="text-xs text-slate-400 mt-1">{desc}</div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── Interview ── */}
        {phase === "interview" && q && (
          <motion.div key={`q-${current}`} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="text-sm text-slate-500 dark:text-slate-400">
                Question <span className="text-slate-800 dark:text-white font-bold">{current + 1}</span> / {questions.length}
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-mono text-indigo-400">{formatTime(timer)}</span>
                <button onClick={() => setPhase("results")} className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">End early</button>
                <button
                  onClick={() => { setPhase("setup"); setQuestions([]); setAnswers({}); setScores({}); setCurrent(0); setTimer(0); }}
                  className="text-xs text-slate-400 hover:text-red-400 dark:hover:text-red-400 transition-colors"
                  title="Restart from setup"
                >
                  ↺ Restart
                </button>
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full mb-6">
              <motion.div className="h-full bg-indigo-500 rounded-full"
                animate={{ width: `${((current + 1) / questions.length) * 100}%` }} />
            </div>

            {/* Question card */}
            <div className="glass-card p-6 mb-4">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-500 dark:text-slate-400">{q.category}</span>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  q.difficulty === "Basic" ? "bg-green-500/20 text-green-500 dark:text-green-400" :
                  q.difficulty === "Intermediate" ? "bg-yellow-500/20 text-yellow-600 dark:text-yellow-400" :
                  q.difficulty === "Advanced" ? "bg-red-500/20 text-red-500 dark:text-red-400" : "bg-purple-500/20 text-purple-500 dark:text-purple-400"}`}>
                  {q.difficulty}
                </span>
                <span className="text-xs text-slate-400">{q.topic} → {q.title}</span>
              </div>
              <p className="text-lg font-semibold text-slate-800 dark:text-white leading-relaxed">{q.question}</p>
            </div>

            {/* Answer */}
            <textarea ref={textRef}
              className="w-full h-40 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 resize-none focus:outline-none focus:border-indigo-500 font-mono text-sm"
              placeholder="Type your answer here... (or leave blank to see the model answer)"
              value={answers[current] || ""}
              onChange={(e) => setAnswers((prev) => ({ ...prev, [current]: e.target.value }))}
            />

            {/* Score result */}
            {scores[current] && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className={`mt-4 rounded-xl border p-4 space-y-3 ${SCORE_BG(scores[current].score)}`}>
                <div className="flex items-center gap-3">
                  <span className={`text-3xl font-black ${SCORE_COLOR(scores[current].score)}`}>{scores[current].score}/10</span>
                  <div>
                    <div className="text-sm font-semibold text-slate-800 dark:text-white">
                      {scores[current].score >= 8 ? "Excellent! 🎉" : scores[current].score >= 5 ? "Good effort 👍" : "Needs work 📚"}
                    </div>
                  </div>
                </div>
                {scores[current].right && (
                  <div><div className="text-xs font-bold text-green-500 dark:text-green-400 mb-1">✅ WHAT YOU GOT RIGHT</div>
                    <p className="text-sm text-slate-700 dark:text-slate-200">{scores[current].right}</p></div>
                )}
                {scores[current].missed && (
                  <div><div className="text-xs font-bold text-red-500 dark:text-red-400 mb-1">❌ WHAT YOU MISSED</div>
                    <p className="text-sm text-slate-700 dark:text-slate-200">{scores[current].missed}</p></div>
                )}
                {scores[current].model_answer && (
                  <div><div className="text-xs font-bold text-indigo-500 dark:text-indigo-400 mb-1">💡 MODEL ANSWER</div>
                    <p className="text-sm text-slate-700 dark:text-slate-200">{scores[current].model_answer}</p></div>
                )}
              </motion.div>
            )}

            <div className="flex gap-3 mt-4">
              {!scores[current] && (
                <button onClick={submitAnswer} disabled={loadingEval}
                  className="flex-1 py-3 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 disabled:opacity-50 rounded-xl font-semibold transition-all">
                  {loadingEval ? "Evaluating..." : "Get AI Feedback"}
                </button>
              )}
              <button onClick={nextQuestion} disabled={loadingEval}
                className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded-xl font-bold text-white transition-all">
                {current + 1 === questions.length ? "See Results →" : "Next Question →"}
              </button>
            </div>
          </motion.div>
        )}

        {/* ── Results ── */}
        {phase === "results" && (
          <motion.div key="results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="text-center mb-8">
              <div className="text-7xl mb-4">{avgScore() >= 8 ? "🏆" : avgScore() >= 5 ? "👍" : "📚"}</div>
              <h2 className="text-3xl font-bold mb-2">Interview Complete!</h2>
              <div className={`text-6xl font-black mt-2 ${SCORE_COLOR(avgScore())}`}>{avgScore()}/10</div>
              <p className="text-slate-500 dark:text-slate-400 mt-2">Average score across {Object.keys(scores).length} evaluated questions</p>
              <p className="text-slate-400 text-sm">Total time: {formatTime(timer)}</p>
            </div>

            <div className="space-y-4 mb-8">
              {questions.map((q, i) => {
                const s = scores[i];
                return (
                  <div key={i} className={`rounded-xl border p-4 ${s ? SCORE_BG(s.score) : "glass-card"}`}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="text-xs text-slate-400 mb-1">{i + 1}. {q.topic} → {q.title}</div>
                        <p className="text-sm text-slate-800 dark:text-white">{q.question}</p>
                        {s?.model_answer && (
                          <p className="text-xs text-slate-400 mt-2 italic">{s.model_answer}</p>
                        )}
                      </div>
                      {s ? (
                        <span className={`text-2xl font-black flex-shrink-0 ${SCORE_COLOR(s.score)}`}>{s.score}</span>
                      ) : (
                        <span className="text-xs text-slate-400">skipped</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex gap-3">
              <button onClick={() => { setPhase("setup"); setQuestions([]); }}
                className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl font-semibold transition-all">
                New Interview
              </button>
              <button onClick={() => { setCurrent(0); setPhase("interview"); setTimer(0); setScores({}); setAnswers({}); }}
                className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold text-white transition-all">
                Retry Same Questions
              </button>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
