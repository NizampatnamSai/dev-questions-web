import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import api from "../api/axios";
import AnswerBlock from "../components/AnswerBlock";

const CATEGORIES = ["HTML/CSS", "JavaScript", "React", "Next.js", "React Native"];
const LEVELS = ["Low", "Medium", "High"];

export default function TimedChallenge() {
  const [step, setStep]       = useState("setup");
  const [formData, setFormData] = useState({ category: "JavaScript", difficulty: "Medium", questions_count: 5 });
  const [challenge, setChallenge] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ]  = useState(0);
  const [revealed, setRevealed]  = useState(false);
  const [timeLeft, setTimeLeft]  = useState(0);
  const [score, setScore]        = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const qStartTime = useRef(null);

  // Countdown timer
  useEffect(() => {
    if (step !== "active" || timeLeft <= 0) return;
    const id = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(id);
  }, [step, timeLeft]);

  // Auto-finish when time runs out
  useEffect(() => {
    if (step === "active" && timeLeft === 0) {
      handleFinish();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, step]);

  const startChallenge = async () => {
    try {
      // Start challenge session
      const { data: session } = await api.post("/challenge/challenges/start", formData);
      // Fetch matching questions
      const { data: qsData } = await api.get("/questions/community", {
        params: {
          category: formData.category,
          level: formData.difficulty,
          limit: formData.questions_count,
          page: 1,
        },
      });
      const qs = qsData?.items || qsData || [];
      if (!qs || qs.length === 0) {
        toast.error("No questions found for this category/difficulty. Try different settings.");
        return;
      }
      setChallenge(session);
      setQuestions(qs.slice(0, formData.questions_count));
      setCurrentQ(0);
      setRevealed(false);
      setTimeLeft(session.time_limit);
      qStartTime.current = Date.now();
      setStep("active");
    } catch {
      toast.error("Failed to start challenge");
    }
  };

  const handleReveal = () => setRevealed(true);

  const handleNext = async () => {
    if (submitting) return;
    setSubmitting(true);
    const elapsed = Math.floor((Date.now() - qStartTime.current) / 1000);
    const q = questions[currentQ];
    try {
      await api.post(`/challenge/challenges/${challenge.challenge_id}/submit`, {
        question_id: q.id,
        answer: "reviewed",
        time_taken: elapsed,
      });
    } catch { /* non-fatal */ }
    setSubmitting(false);

    if (currentQ + 1 >= questions.length) {
      handleFinish();
    } else {
      setCurrentQ(i => i + 1);
      setRevealed(false);
      qStartTime.current = Date.now();
    }
  };

  const handleFinish = async () => {
    if (!challenge || step === "completed") return;
    setStep("completed");
    try {
      const { data } = await api.post(`/challenge/challenges/${challenge.challenge_id}/finish`);
      setScore(data);
    } catch {
      setScore({ score: 0, message: "Challenge complete!", answers: currentQ, time_taken: 0 });
    }
  };

  const reset = () => {
    setStep("setup"); setChallenge(null); setQuestions([]);
    setCurrentQ(0); setRevealed(false); setScore(null);
  };

  const pct = questions.length ? Math.round(((currentQ) / questions.length) * 100) : 0;
  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const urgent = timeLeft > 0 && timeLeft <= 30;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">⏱️ Timed Challenge</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Review questions against the clock. Track your speed.</p>
      </div>

      {/* Setup */}
      {step === "setup" && (
        <div className="glass-card p-8 max-w-md mx-auto space-y-6">
          <div>
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">Category</label>
            <select value={formData.category}
              onChange={e => setFormData(p => ({ ...p, category: e.target.value }))}
              className="w-full mt-2 input-light">
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">Difficulty</label>
            <select value={formData.difficulty}
              onChange={e => setFormData(p => ({ ...p, difficulty: e.target.value }))}
              className="w-full mt-2 input-light">
              {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">Questions</label>
            <select value={formData.questions_count}
              onChange={e => setFormData(p => ({ ...p, questions_count: parseInt(e.target.value) }))}
              className="w-full mt-2 input-light">
              {[3, 5, 10].map(n => <option key={n} value={n}>{n} questions (~{n} min)</option>)}
            </select>
          </div>
          <button onClick={startChallenge}
            className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 text-white font-semibold hover:shadow-lg transition-all">
            Start Challenge 🚀
          </button>
        </div>
      )}

      {/* Active */}
      {step === "active" && questions.length > 0 && (
        <div className="max-w-2xl mx-auto space-y-4">
          {/* Header bar */}
          <div className="glass-card p-4 flex items-center gap-4">
            <div className="flex-1">
              <div className="flex justify-between text-xs text-slate-500 mb-1">
                <span>Question {currentQ + 1} of {questions.length}</span>
                <span>{pct}% done</span>
              </div>
              <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 rounded-full transition-all duration-300" style={{ width: `${pct}%` }} />
              </div>
            </div>
            <div className={`text-2xl font-bold tabular-nums min-w-[56px] text-center transition-colors ${urgent ? "text-red-500 animate-pulse" : "text-indigo-600 dark:text-indigo-400"}`}>
              {mins}:{String(secs).padStart(2, "0")}
            </div>
          </div>

          {/* Question card */}
          <AnimatePresence mode="wait">
            <motion.div key={currentQ}
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              className="glass-card p-6 space-y-4">
              <div className="flex gap-2 flex-wrap">
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 border border-slate-200 dark:border-white/10">
                  {questions[currentQ]?.category}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-700/40">
                  {questions[currentQ]?.level}
                </span>
              </div>
              <p className="font-semibold text-slate-800 dark:text-slate-100 leading-snug text-lg">
                {questions[currentQ]?.question}
              </p>

              {!revealed ? (
                <button onClick={handleReveal}
                  className="w-full py-2.5 rounded-xl border-2 border-dashed border-indigo-300 dark:border-indigo-600 text-indigo-600 dark:text-indigo-400 text-sm font-medium hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors">
                  Reveal Answer ▼
                </button>
              ) : (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="overflow-hidden">
                  <div className="bg-slate-50 dark:bg-white/5 rounded-xl p-4">
                    <AnswerBlock text={questions[currentQ]?.answer} questionType={questions[currentQ]?.type} />
                  </div>
                </motion.div>
              )}

              <div className="flex gap-3 pt-2">
                <button onClick={handleNext} disabled={submitting}
                  className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-colors disabled:opacity-60">
                  {currentQ + 1 >= questions.length ? "Finish ✓" : "Next →"}
                </button>
                <button onClick={handleFinish}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 text-sm hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                  End Early
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      {/* Completed */}
      {step === "completed" && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-10 max-w-md mx-auto text-center space-y-6">
          {score ? (
            <>
              <div className="text-6xl font-bold text-indigo-600 dark:text-indigo-400">{score.score}</div>
              <p className="text-xl font-semibold text-slate-800 dark:text-slate-100">{score.message}</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-xl">
                  <div className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">{score.answers}</div>
                  <div className="text-xs text-slate-500 mt-1">Questions done</div>
                </div>
                <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-xl">
                  <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">{score.time_taken}s</div>
                  <div className="text-xs text-slate-500 mt-1">Total time</div>
                </div>
              </div>
            </>
          ) : (
            <p className="text-slate-500">Calculating score…</p>
          )}
          <button onClick={reset}
            className="w-full px-4 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-500 transition-colors">
            Try Again 🔄
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}
