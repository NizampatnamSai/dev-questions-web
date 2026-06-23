import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

// ============================================================================
// FLASHCARD SYSTEM - Spaced Repetition Learning
// ============================================================================
function FlashcardMode() {
  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [difficulty, setDifficulty] = useState("all");
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState("javascript");

  const loadCards = async () => {
    setLoading(true);
    try {
      const { data } = await api.post("/study/generate-flashcards", {
        category,
        count: 20,
        difficulty,
      });
      setCards(data.cards || []);
      setCurrentIndex(0);
      setFlipped(false);
    } catch {
      toast.error("Failed to load flashcards");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCards();
  }, [category, difficulty]);

  const currentCard = cards[currentIndex];
  const progress = cards.length ? Math.round((currentIndex / cards.length) * 100) : 0;

  const handleRate = async (rating) => {
    try {
      await api.post(`/study/flashcards/${currentCard.id}/rate`, { rating });
      if (currentIndex < cards.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setFlipped(false);
      } else {
        toast.success("Flashcard session complete!");
        loadCards();
      }
    } catch {
      toast.error("Failed to save rating");
    }
  };

  if (loading) return <div className="text-center py-12">Loading flashcards...</div>;
  if (!currentCard) return <div className="text-center py-12">No cards available</div>;

  return (
    <div className="space-y-6">
      {/* Category & Difficulty Selector */}
      <div className="flex gap-4 flex-wrap">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
        >
          <option value="javascript">JavaScript</option>
          <option value="react">React</option>
          <option value="nodejs">Node.js</option>
          <option value="dsa">DSA</option>
        </select>
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
        >
          <option value="all">All Levels</option>
          <option value="basic">Basic</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Progress</span>
          <span>{currentIndex + 1} / {cards.length}</span>
        </div>
        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
          <div
            className="h-full bg-indigo-600 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Flashcard */}
      <motion.div
        onClick={() => setFlipped(!flipped)}
        className="min-h-64 cursor-pointer rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 p-8 flex items-center justify-center border-2 border-indigo-200 dark:border-indigo-700"
        layoutId="card"
      >
        <div className="text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
            {flipped ? "Answer" : "Question"} • Click to flip
          </p>
          <p className="text-lg font-semibold text-slate-800 dark:text-slate-100">
            {flipped ? currentCard.answer : currentCard.question}
          </p>
          <p className="text-xs text-slate-400 mt-4">
            {flipped ? "✓ Tap to reveal" : "→ Tap to see answer"}
          </p>
        </div>
      </motion.div>

      {/* Rating Buttons (Spaced Repetition) */}
      {flipped && (
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => handleRate(1)}
            className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
          >
            🔴 Hard (1 day)
          </button>
          <button
            onClick={() => handleRate(2)}
            className="px-4 py-2 rounded-lg bg-yellow-500 text-white hover:bg-yellow-600"
          >
            🟡 Medium (3 days)
          </button>
          <button
            onClick={() => handleRate(3)}
            className="px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600"
          >
            🟢 Easy (7 days)
          </button>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 30-DAY DSA CHALLENGE - Daily AI-Generated Unique Questions
// ============================================================================
function DSAChallenge30Days() {
  const { user } = useAuth();
  const [currentDay, setCurrentDay] = useState(1);
  const [dailyQuestion, setDailyQuestion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submittedAnswer, setSubmittedAnswer] = useState("");
  const [completed, setCompleted] = useState(false);
  const [streak, setStreak] = useState(0);

  const loadDailyQuestion = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/study/dsa-challenge/daily", {
        params: { day: currentDay }
      });
      setDailyQuestion(data.question);
      setCompleted(data.completed || false);
      setStreak(data.streak || 0);
    } catch {
      toast.error("Failed to load today's challenge");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDailyQuestion();
  }, [currentDay]);

  const submitAnswer = async () => {
    if (!submittedAnswer.trim()) {
      toast.error("Please provide an answer");
      return;
    }

    try {
      const { data } = await api.post("/study/dsa-challenge/submit", {
        day: currentDay,
        answer: submittedAnswer,
        questionId: dailyQuestion.id,
      });

      if (data.correct) {
        toast.success("✅ Correct! Moving to next day...");
        setCompleted(true);
        setStreak(data.streak);
        setTimeout(() => {
          if (currentDay < 30) setCurrentDay(currentDay + 1);
        }, 2000);
      } else {
        toast.error("❌ Incorrect. Try again or view solution.");
      }
    } catch {
      toast.error("Failed to submit answer");
    }
  };

  if (loading) return <div className="text-center py-12">Loading today's challenge...</div>;
  if (!dailyQuestion) return <div className="text-center py-12">No challenge available</div>;

  return (
    <div className="space-y-6">
      {/* Header with Day Progress */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">🔥 30-Day DSA Challenge</h2>
          <div className="text-right">
            <div className="text-3xl font-bold text-orange-500">{streak}</div>
            <div className="text-sm text-slate-500">Day Streak</div>
          </div>
        </div>

        {/* Progress for all 30 days */}
        <div className="grid grid-cols-10 gap-2">
          {Array.from({ length: 30 }).map((_, day) => (
            <div
              key={day + 1}
              onClick={() => setCurrentDay(day + 1)}
              className={`aspect-square rounded-lg flex items-center justify-center text-xs font-bold cursor-pointer transition-all ${
                day + 1 < currentDay
                  ? "bg-green-500 text-white"
                  : day + 1 === currentDay
                  ? "bg-indigo-600 text-white ring-2 ring-indigo-400"
                  : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400"
              }`}
            >
              {day + 1}
            </div>
          ))}
        </div>
      </div>

      {/* Question Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-8 space-y-4"
      >
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">
            Day {currentDay}: {dailyQuestion.title}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Difficulty: <span className="font-semibold">{dailyQuestion.difficulty}</span>
          </p>
        </div>

        <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4 space-y-3">
          <p className="text-slate-700 dark:text-slate-200 whitespace-pre-wrap">
            {dailyQuestion.description}
          </p>

          {dailyQuestion.examples && (
            <div className="space-y-2">
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">Examples:</p>
              <pre className="bg-slate-100 dark:bg-slate-800 p-3 rounded text-xs overflow-x-auto">
                {dailyQuestion.examples}
              </pre>
            </div>
          )}
        </div>

        {!completed ? (
          <div className="space-y-3">
            <textarea
              value={submittedAnswer}
              onChange={(e) => setSubmittedAnswer(e.target.value)}
              placeholder="Write your solution here... (code or explanation)"
              className="w-full h-32 p-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
            />
            <button
              onClick={submitAnswer}
              className="w-full px-4 py-3 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-500 transition-colors"
            >
              Submit Answer
            </button>
          </div>
        ) : (
          <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
            <p className="text-green-700 dark:text-green-300 font-semibold">✅ Challenge Completed!</p>
            {currentDay < 30 && (
              <p className="text-sm text-green-600 dark:text-green-400 mt-2">
                Next challenge unlocks tomorrow →
              </p>
            )}
          </div>
        )}
      </motion.div>

      {/* Solution Section */}
      {dailyQuestion.solution && (
        <details className="glass-card p-4 cursor-pointer">
          <summary className="font-semibold text-slate-700 dark:text-slate-300">
            📝 View Solution
          </summary>
          <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
            <pre className="bg-slate-100 dark:bg-slate-800 p-4 rounded text-sm overflow-x-auto">
              {dailyQuestion.solution}
            </pre>
          </div>
        </details>
      )}
    </div>
  );
}

// ============================================================================
// DAILY AI CHALLENGE - Quick Daily Question
// ============================================================================
function DailyAIChallenge() {
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [attempted, setAttempted] = useState(false);
  const [category, setCategory] = useState("mixed");

  const loadChallenge = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/study/daily-challenge", {
        params: { category }
      });
      setQuestion(data);
      setAttempted(false);
    } catch {
      toast.error("Failed to load daily challenge");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadChallenge();
  }, [category]);

  if (loading) return <div className="text-center py-12">Loading challenge...</div>;
  if (!question) return <div className="text-center py-12">No challenge available</div>;

  return (
    <div className="space-y-6">
      <div className="flex gap-3">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
        >
          <option value="mixed">All Categories</option>
          <option value="javascript">JavaScript</option>
          <option value="react">React</option>
          <option value="dsa">DSA</option>
        </select>
        <button
          onClick={loadChallenge}
          className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500"
        >
          🔄 Get New Challenge
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card p-8 space-y-6"
      >
        <div>
          <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">
            {question.title}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Category: {question.category} • Difficulty: {question.difficulty}
          </p>
        </div>

        <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-6 space-y-4">
          <p className="text-slate-700 dark:text-slate-200 leading-relaxed">
            {question.description}
          </p>

          {question.code && (
            <pre className="bg-slate-800 text-slate-100 p-4 rounded overflow-x-auto text-sm">
              {question.code}
            </pre>
          )}
        </div>

        <div className="space-y-3">
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
            Choose the correct answer:
          </p>
          <div className="space-y-2">
            {question.options?.map((option, i) => (
              <button
                key={i}
                onClick={() => {
                  setAttempted(true);
                  if (i === question.correctIndex) {
                    toast.success("✅ Correct!");
                  } else {
                    toast.error("❌ Incorrect. Try again!");
                  }
                }}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                  attempted
                    ? i === question.correctIndex
                      ? "bg-green-50 dark:bg-green-900/20 border-green-500"
                      : "border-slate-200 dark:border-slate-700"
                    : "border-slate-200 dark:border-slate-700 hover:border-indigo-400"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {attempted && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <p className="text-sm text-blue-700 dark:text-blue-300 leading-relaxed">
              💡 <strong>Explanation:</strong> {question.explanation}
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}

// ============================================================================
// MAIN ADVANCED STUDY HUB
// ============================================================================
export default function AdvancedStudyHub() {
  const [mode, setMode] = useState("daily"); // daily, flashcard, dsa30

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
          🧠 Advanced Study Hub
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">
          AI-generated unique questions • No duplicates • Spaced repetition
        </p>
      </div>

      {/* Mode Selector */}
      <div className="flex gap-2 flex-wrap">
        {[
          { id: "daily", label: "📅 Daily Challenge", icon: "Daily AI questions" },
          { id: "flashcard", label: "🎴 Flashcards", icon: "Spaced repetition" },
          { id: "dsa30", label: "🔥 30-Day DSA", icon: "Complete challenge" },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setMode(item.id)}
            className={`px-4 py-3 rounded-lg font-medium transition-all ${
              mode === item.id
                ? "bg-indigo-600 text-white shadow-lg"
                : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
            }`}
          >
            {item.label}
            <div className="text-xs mt-0.5 opacity-75">{item.icon}</div>
          </button>
        ))}
      </div>

      {/* Mode Content */}
      <AnimatePresence mode="wait">
        {mode === "daily" && (
          <motion.div key="daily" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <DailyAIChallenge />
          </motion.div>
        )}
        {mode === "flashcard" && (
          <motion.div key="flashcard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <FlashcardMode />
          </motion.div>
        )}
        {mode === "dsa30" && (
          <motion.div key="dsa30" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <DSAChallenge30Days />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
