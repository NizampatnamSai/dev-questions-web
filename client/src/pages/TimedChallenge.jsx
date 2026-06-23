import { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import api from "../api/axios";

const CATEGORIES = ["HTML/CSS", "JavaScript", "React", "Next.js", "React Native"];
const LEVELS = ["Low", "Medium", "High"];

export default function TimedChallenge() {
  const [step, setStep] = useState("setup"); // setup, active, completed
  const [formData, setFormData] = useState({ category: "JavaScript", difficulty: "Medium", questions_count: 5 });
  const [challenge, setChallenge] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [score, setScore] = useState(null);

  const startChallenge = async () => {
    try {
      const { data } = await api.post("/challenge/challenges/start", formData);
      setChallenge(data);
      setTimeLeft(data.time_limit);
      setStep("active");
      toast.success(`Challenge started! ${data.time_limit}s to answer ${data.questions}`);
    } catch {
      toast.error("Failed to start challenge");
    }
  };

  const finishChallenge = async () => {
    try {
      const { data } = await api.post(`/challenge/challenges/${challenge.challenge_id}/finish`);
      setScore(data);
      setStep("completed");
    } catch {
      toast.error("Failed to finish challenge");
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">⏱️ Timed Challenge</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Test your speed and accuracy</p>
      </div>

      {step === "setup" && (
        <div className="glass-card p-8 max-w-md mx-auto space-y-6">
          <div>
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              className="w-full mt-2 px-4 py-2 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">Difficulty</label>
            <select
              value={formData.difficulty}
              onChange={(e) => setFormData(prev => ({ ...prev, difficulty: e.target.value }))}
              className="w-full mt-2 px-4 py-2 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {LEVELS.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">Questions</label>
            <select
              value={formData.questions_count}
              onChange={(e) => setFormData(prev => ({ ...prev, questions_count: parseInt(e.target.value) }))}
              className="w-full mt-2 px-4 py-2 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {[3, 5, 10].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">~{formData.questions_count} min to complete</p>
          </div>

          <button
            onClick={startChallenge}
            className="w-full px-4 py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-cyan-600 text-white font-semibold hover:shadow-lg transition-all"
          >
            Start Challenge 🚀
          </button>
        </div>
      )}

      {step === "active" && challenge && (
        <div className="glass-card p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Challenge in Progress</h2>
            <div className={`text-3xl font-bold ${timeLeft < 60 ? "text-red-600" : "text-indigo-600"}`}>
              {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, "0")}
            </div>
          </div>

          <div className="bg-slate-100 dark:bg-slate-800 p-6 rounded-lg text-center space-y-4">
            <p className="text-slate-600 dark:text-slate-300">Challenge UI would load questions here</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Questions: {challenge.questions}</p>
          </div>

          <button
            onClick={finishChallenge}
            className="w-full px-4 py-2 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-500 transition-colors"
          >
            Finish Challenge
          </button>
        </div>
      )}

      {step === "completed" && score && (
        <div className="glass-card p-8 space-y-6 text-center">
          <div className="text-6xl font-bold text-indigo-600 dark:text-indigo-400">{score.score}</div>
          <p className="text-xl font-semibold text-slate-800 dark:text-slate-100">{score.message}</p>

          <div className="grid grid-cols-3 gap-4 py-4">
            <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg">
              <div className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">{score.answers}</div>
              <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">Answered</div>
            </div>
            <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg">
              <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">{Math.round(score.time_taken / 60)}s</div>
              <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">Time</div>
            </div>
            <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg">
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">+{score.score}</div>
              <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">Points</div>
            </div>
          </div>

          <button
            onClick={() => {
              setStep("setup");
              setChallenge(null);
              setScore(null);
            }}
            className="w-full px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-500 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}
    </motion.div>
  );
}
