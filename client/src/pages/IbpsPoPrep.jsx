import { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { loadTopicsForCategory } from "../data/studyTopicsLoader";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import mockTestData from "../data/ibpspo-mock-test.json";

const DIFF_STYLES = {
  Basic: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
  Intermediate: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",
  Advanced: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  Tricky: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
};

function ScoreRing({ score, size = 80 }) {
  const r = (size / 2) - 8;
  const circ = 2 * Math.PI * r;
  const color = score >= 8 ? "#22c55e" : score >= 6 ? "#3b82f6" : score >= 4 ? "#eab308" : "#ef4444";
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#e2e8f0" strokeWidth="7" />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="7"
        strokeDasharray={`${(score/15)*circ} ${circ}`} strokeLinecap="round"
        transform={`rotate(-90 ${size/2} ${size/2})`} />
      <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle"
        className="font-bold text-slate-800 dark:text-slate-100" fontSize={size * 0.22}>{score.toFixed(1)}</text>
    </svg>
  );
}

function AiPanel({ topic, category, onClose }) {
  const [mode, setMode] = useState("summary");
  const [summary, setSummary] = useState("");
  const [loadingSum, setLoadSum] = useState(false);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loadingAsk, setLoadAsk] = useState(false);
  const chatRef = useRef(null);

  useEffect(() => {
    fetchSummary();
  }, []);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  async function fetchSummary() {
    setLoadSum(true);
    try {
      const { data } = await api.post("/study/summarise", {
        title: topic.title,
        topic: topic.topic,
        summary: topic.summary,
        explanation: topic.explanation,
        code: topic.code,
        category: category,
      });
      setSummary(data.summary);
    } catch {
      setSummary("AI summary unavailable. Check your connection or try again.");
    } finally {
      setLoadSum(false);
    }
  }

  async function sendQuestion() {
    const q = question.trim();
    if (!q || loadingAsk) return;
    setMessages((m) => [...m, { role: "user", text: q }]);
    setQuestion("");
    setLoadAsk(true);
    try {
      const { data } = await api.post("/study/ask", {
        title: topic.title,
        topic: topic.topic,
        explanation: topic.explanation,
        code: topic.code,
        question: q,
        category: category,
      });
      setMessages((m) => [...m, { role: "ai", text: data.answer }]);
    } catch {
      setMessages((m) => [
        ...m,
        { role: "ai", text: "AI unavailable right now. Try again." },
      ]);
    } finally {
      setLoadAsk(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 6 }}
      className="mt-3 rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50/40 dark:bg-amber-950/20 overflow-hidden"
    >
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-amber-200 dark:border-amber-800 bg-amber-100/60 dark:bg-amber-900/40">
        <span className="text-sm">🤖</span>
        <span className="font-semibold text-sm text-amber-800 dark:text-amber-300 flex-1">
          IBPS PO AI Assistant
        </span>
        {[
          ["summary", "✨ Summarise"],
          ["ask", "💬 Ask AI"],
        ].map(([m, l]) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`text-xs px-3 py-1 rounded-full font-medium transition-colors ${
              mode === m
                ? "bg-amber-600 text-white"
                : "text-amber-700 dark:text-amber-300 hover:bg-amber-200 dark:hover:bg-amber-800"
            }`}
          >
            {l}
          </button>
        ))}
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 ml-1 text-xl leading-none"
        >
          ×
        </button>
      </div>

      {mode === "summary" && (
        <div className="p-4">
          {loadingSum ? (
            <div className="flex items-center gap-2 text-sm text-amber-600 animate-pulse">
              <span>⟳</span> Generating AI summary…
            </div>
          ) : (
            <>
              <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">
                {summary}
              </p>
              <button
                onClick={fetchSummary}
                className="mt-3 text-xs text-amber-600 dark:text-amber-400 hover:text-amber-800 underline"
              >
                ↻ Regenerate
              </button>
            </>
          )}
        </div>
      )}

      {mode === "ask" && (
        <div className="flex flex-col">
          <div
            ref={chatRef}
            className="overflow-y-auto p-4 space-y-3"
            style={{ maxHeight: 240 }}
          >
            {messages.length === 0 && (
              <p className="text-xs text-slate-400 italic">
                Ask anything about <strong>{topic.title}</strong>…
              </p>
            )}
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[88%] rounded-xl px-3 py-2 text-sm leading-relaxed ${
                    m.role === "user"
                      ? "bg-amber-600 text-white"
                      : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
                  }`}
                >
                  {m.role === "ai" && (
                    <span className="text-[10px] text-amber-500 font-bold block mb-0.5">
                      🤖 AI COACH
                    </span>
                  )}
                  <span className="whitespace-pre-wrap">{m.text}</span>
                </div>
              </div>
            ))}
            {loadingAsk && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-400 animate-pulse">
                  🤖 Thinking…
                </div>
              </div>
            )}
          </div>
          <div className="flex gap-2 p-3 border-t border-amber-200 dark:border-amber-800">
            <input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendQuestion()}
              placeholder="Ask about this topic…"
              className="flex-1 text-sm px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-amber-400"
            />
            <button
              onClick={sendQuestion}
              disabled={!question.trim() || loadingAsk}
              className="px-3 py-2 bg-amber-600 text-white rounded-xl text-sm font-medium disabled:opacity-40 hover:bg-amber-700 transition-colors"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}

function TopicCard({ topic, category, openId, setOpenId }) {
  const open = openId === topic.id;
  const setOpen = (val) => setOpenId(val ? topic.id : null);
  const [tab, setTab] = useState("explanation");
  const [showAi, setShowAi] = useState(false);
  const { user } = useAuth();

  const tabs = [
    { id: "explanation", label: "📖 Concept Details" },
    { id: "question", label: "🎯 Sample Question" },
    ...(topic.code ? [{ id: "code", label: "💻 Formulas / Shortcuts" }] : []),
  ];

  return (
    <div
      className={`rounded-2xl border transition-all ${
        open ? "border-amber-400 dark:border-amber-500 shadow-sm" : "border-slate-200 dark:border-slate-700"
      } bg-white dark:bg-slate-800/60 overflow-hidden hover:border-amber-300 dark:hover:border-amber-600 hover:shadow-md`}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left px-4 py-3.5 flex items-start gap-3"
      >
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${DIFF_STYLES[topic.difficulty]}`}>
              {topic.difficulty}
            </span>
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
              {topic.topic}
            </span>
          </div>
          <p className="font-semibold text-sm text-slate-800 dark:text-slate-100">{topic.title}</p>
          <p className="text-xs text-amber-600 dark:text-amber-300 font-medium mt-1">
            💡 {topic.summary}
          </p>
        </div>
        <span className="text-slate-400 text-xs mt-1 flex-shrink-0">{open ? "▲" : "▼"}</span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 border-t border-slate-100 dark:border-slate-700 pt-3 space-y-3">
              {/* Concept Highlight */}
              <div className="bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/60 rounded-xl p-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-1">
                  Key Concept Summary
                </p>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-200 leading-relaxed">
                  {topic.summary}
                </p>
              </div>

              {/* Tabs selector */}
              <div className="flex gap-1.5 flex-wrap">
                {tabs.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTab(t.id)}
                    className={`text-xs px-3 py-1 rounded-full font-medium transition-colors ${
                      tab === t.id
                        ? "bg-amber-600 text-white"
                        : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Tab: Concept Details */}
              {tab === "explanation" && (
                <div className="space-y-3">
                  {topic.explanation.split(/\n\n+/).map((para, i) => (
                    <p
                      key={i}
                      className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap"
                    >
                      {para.trim()}
                    </p>
                  ))}
                </div>
              )}

              {/* Tab: Sample Question */}
              {tab === "question" && (
                <div className="space-y-3">
                  <div className="bg-amber-50/30 dark:bg-amber-900/10 border border-amber-200/50 dark:border-amber-800/40 rounded-xl p-3">
                    <p className="text-xs font-bold text-amber-600 dark:text-amber-400 mb-1.5">
                      ❓ Exam Question
                    </p>
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 leading-relaxed whitespace-pre-wrap">
                      {topic.interviewQuestion}
                    </p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-700 rounded-xl p-3">
                    <p className="text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-wide">
                      💡 Correct Solution & Logic
                    </p>
                    {topic.explanation.split(/\n\n+/).map((para, i) => (
                      <p
                        key={i}
                        className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-2 whitespace-pre-wrap"
                      >
                        {para.trim()}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab: Formulas / Shortcuts */}
              {tab === "code" && topic.code && (
                <div className="space-y-2">
                  <pre className="bg-slate-900 dark:bg-black rounded-xl p-4 overflow-x-auto text-xs text-amber-300 leading-relaxed whitespace-pre font-mono">
                    {topic.code}
                  </pre>
                </div>
              )}

              <AnimatePresence>
                {showAi && (
                  <AiPanel
                    key="ai"
                    topic={topic}
                    category={category}
                    onClose={() => setShowAi(false)}
                  />
                )}
              </AnimatePresence>

              <div className="flex items-center justify-between pt-1 flex-wrap gap-2">
                {!user?.isGuest && (
                  <button
                    onClick={() => setShowAi((v) => !v)}
                    className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${
                      showAi
                        ? "bg-amber-600 text-white"
                        : "bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/60"
                    }`}
                  >
                    🤖 {showAi ? "Hide AI Coach" : "Ask AI Coach"}
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Mock Interview Evaluation Panel ───────────────────────────────────────────
function MockInterviewCard({ topic }) {
  const [open, setOpen] = useState(false);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  async function reviewAnswer() {
    const text = userAnswer.trim();
    if (!text || loading) return;
    setLoading(true);
    setFeedback(null);
    try {
      const { data } = await api.post("/study/ibps-po/review-interview", {
        question: topic.interviewQuestion,
        modelAnswer: topic.explanation,
        userAnswer: text,
      });
      setFeedback(data);
    } catch {
      setFeedback({
        feedback: "Failed to evaluate your answer. Please try again.",
        score: 0,
        improvements: "Check your internet connection.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className={`rounded-2xl border transition-all ${
        open ? "border-indigo-400 dark:border-indigo-500 shadow-sm" : "border-slate-200 dark:border-slate-700"
      } bg-white dark:bg-slate-800/60 overflow-hidden hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-md`}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left px-4 py-4 flex items-start gap-3"
      >
        <span className="text-xl">🗣️</span>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] text-indigo-500 dark:text-indigo-400 font-bold uppercase tracking-wider mb-1">
            {topic.topic}
          </p>
          <p className="font-semibold text-sm text-slate-800 dark:text-slate-100">
            {topic.interviewQuestion}
          </p>
        </div>
        <span className="text-slate-400 text-xs mt-1 flex-shrink-0">{open ? "▲" : "▼"}</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-slate-100 dark:border-slate-700"
          >
            <div className="p-4 space-y-4">
              <div className="bg-slate-50 dark:bg-slate-900/55 p-3 rounded-xl">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Model Answer / Recommended Outline
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {topic.explanation}
                </p>
              </div>

              {!user?.isGuest && (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide block">
                    Type Your Response for AI Review
                  </label>
                  <textarea
                    rows={4}
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="Type how you would answer this in front of the interview panel..."
                    className="w-full text-sm px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                  />
                  <div className="flex justify-end">
                    <button
                      onClick={reviewAnswer}
                      disabled={!userAnswer.trim() || loading}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      {loading ? "Evaluating..." : "🤖 Review with AI"}
                    </button>
                  </div>
                </div>
              )}

              {feedback && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border border-indigo-200 dark:border-indigo-800 rounded-xl p-4 bg-indigo-50/30 dark:bg-indigo-950/20 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">
                      Panel Evaluation
                    </span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300">
                      Score: {feedback.score}/10
                    </span>
                  </div>
                  <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                    {feedback.feedback}
                  </p>
                  {feedback.improvements && (
                    <div className="border-t border-indigo-200/50 dark:border-indigo-800/50 pt-2">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">
                        Suggestions for Improvement:
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                        {feedback.improvements}
                      </p>
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function IbpsPoPrep() {
  const [activeTab, setActiveTab] = useState("prelims"); // prelims | mains | interview | mocktest
  const [activeSubcat, setActiveSubcat] = useState("All");
  const [activeDiff, setActiveDiff] = useState("All");
  const [search, setSearch] = useState("");
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState(null);

  // ── Mock Test States ────────────────────────────────────────────────────────
  const [generatedQuestions, setGeneratedQuestions] = useState([]); // after AI generates, before exam starts
  const [examQuestions, setExamQuestions] = useState([]);
  const [generating, setGenerating] = useState(false);
  const [examStarted, setExamStarted] = useState(false);
  const [examSubmitted, setExamSubmitted] = useState(false);
  const [examAnswers, setExamAnswers] = useState({});
  const [markedReview, setMarkedReview] = useState(new Set());
  const [visitedSet, setVisitedSet] = useState(new Set());
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(900); // 15 mins for 15 Questions
  const [examSection, setExamSection] = useState("English Language");
  const timerRef = useRef(null);
  // Save/Load states
  const [savedTestId, setSavedTestId] = useState(null); // set when test was pre-saved
  const [savedTests, setSavedTests] = useState([]);
  const [loadingSavedTests, setLoadingSavedTests] = useState(false);
  const [savingTest, setSavingTest] = useState(false);

  // Load study topics on tab change
  useEffect(() => {
    if (activeTab === "mocktest") {
      setLoading(false);
      fetchSavedTests();
      return;
    }
    let cancelled = false;
    setLoading(true);
    setOpenId(null);
    setActiveSubcat("All");
    setActiveDiff("All");
    setSearch("");

    const categoryId = `ibpspo-${activeTab}`;
    loadTopicsForCategory(categoryId).then((data) => {
      if (!cancelled) {
        setTopics(data);
        setLoading(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [activeTab]);

  // Fetch user's saved tests
  const fetchSavedTests = async () => {
    setLoadingSavedTests(true);
    try {
      const { data } = await api.get("/study/ibps-po/mock-tests");
      setSavedTests(data.tests || []);
    } catch {
      setSavedTests([]);
    } finally {
      setLoadingSavedTests(false);
    }
  };

  // Exam Countdown Timer
  useEffect(() => {
    if (examStarted && !examSubmitted) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            submitExam();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [examStarted, examSubmitted]);

  // Step 1: Generate questions (does NOT start the exam yet)
  const generateQuestions = async () => {
    setGenerating(true);
    try {
      const { data } = await api.post("/study/ibps-po/generate-mock", { count: 15 });
      if (data && data.questions && data.questions.length > 0) {
        setGeneratedQuestions(data.questions);
        setSavedTestId(null); // fresh generation, not yet saved
        toast.success(`${data.questions.length} questions generated! Start or save for later.`);
      } else {
        throw new Error("No questions returned");
      }
    } catch (err) {
      toast.error("AI generation failed. Loaded fallback questions.");
      const fallback = mockTestData.questions.slice(0, 15);
      setGeneratedQuestions(fallback);
      setSavedTestId(null);
    } finally {
      setGenerating(false);
    }
  };

  // Step 2a: Begin the exam with generated questions
  const beginExam = (questions) => {
    setExamQuestions(questions);
    setExamAnswers({});
    setMarkedReview(new Set());
    setVisitedSet(new Set([questions[0]?.id]));
    setCurrentQIndex(0);
    setTimeLeft(900);
    setExamSection(questions[0]?.section || "English Language");
    setExamStarted(true);
    setExamSubmitted(false);
  };

  // Step 2b: Save questions for later (without starting)
  const saveTestForLater = async (questions) => {
    setSavingTest(true);
    try {
      const title = `Mock Test — ${new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}`;
      const { data } = await api.post("/study/ibps-po/mock-tests/save", { title, questions });
      setSavedTestId(data.id);
      setGeneratedQuestions([]); // clear preview
      toast.success("Test saved! You can start it anytime from 'My Saved Tests'.");
      fetchSavedTests();
    } catch {
      toast.error("Failed to save test. Please try again.");
    } finally {
      setSavingTest(false);
    }
  };

  // Load a saved test and start it
  const loadAndStartTest = async (testId) => {
    try {
      const { data } = await api.get(`/study/ibps-po/mock-tests/${testId}`);
      setSavedTestId(testId);
      setGeneratedQuestions([]);
      beginExam(data.questions);
      toast.success(`Loaded: ${data.title}`);
    } catch {
      toast.error("Failed to load test.");
    }
  };

  // Delete a saved test
  const deleteSavedTest = async (testId) => {
    try {
      await api.delete(`/study/ibps-po/mock-tests/${testId}`);
      setSavedTests((prev) => prev.filter((t) => t.id !== testId));
      toast.success("Test deleted.");
    } catch {
      toast.error("Failed to delete test.");
    }
  };

  const submitExam = async () => {
    clearInterval(timerRef.current);
    setExamSubmitted(true);
  };

  // After results are calculated, auto-save if not already saved
  const autoSaveAfterSubmit = async (resultsObj) => {
    if (savedTestId) {
      // Already saved — just update with answers + results
      try {
        await api.post(`/study/ibps-po/mock-tests/${savedTestId}/submit`, {
          answers: examAnswers,
          results: resultsObj,
        });
        fetchSavedTests();
      } catch { /* silent */ }
    } else {
      // Auto-save since user actually attempted it
      try {
        const title = `Mock Test — ${new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}`;
        const { data } = await api.post("/study/ibps-po/mock-tests/save", { title, questions: examQuestions });
        const newId = data.id;
        await api.post(`/study/ibps-po/mock-tests/${newId}/submit`, {
          answers: examAnswers,
          results: resultsObj,
        });
        setSavedTestId(newId);
        fetchSavedTests();
        toast.success("Test auto-saved with your results.");
      } catch { /* silent */ }
    }
  };

  const handleSelectOption = (qId, option) => {
    setExamAnswers((prev) => ({ ...prev, [qId]: option }));
  };

  const handleVisited = (qId) => {
    setVisitedSet((prev) => {
      const next = new Set(prev);
      next.add(qId);
      return next;
    });
  };

  const jumpToQuestion = (idx) => {
    const q = examQuestions[idx];
    if (!q) return;
    setCurrentQIndex(idx);
    setExamSection(q.section);
    handleVisited(q.id);
  };

  const saveAndNext = () => {
    if (currentQIndex < examQuestions.length - 1) {
      jumpToQuestion(currentQIndex + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQIndex > 0) {
      jumpToQuestion(currentQIndex - 1);
    }
  };

  const toggleMarkForReview = (qId) => {
    setMarkedReview((prev) => {
      const next = new Set(prev);
      if (next.has(qId)) {
        next.delete(qId);
      } else {
        next.add(qId);
      }
      return next;
    });
  };

  const clearResponse = (qId) => {
    setExamAnswers((prev) => {
      const next = { ...prev };
      delete next[qId];
      return next;
    });
  };

  // Format timer
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Sectionwise filtering of questions for Exam Mode
  const sectionQuestions = useMemo(() => {
    return examQuestions.filter((q) => q.section === examSection);
  }, [examQuestions, examSection]);

  // Calculate results on submission
  const results = useMemo(() => {
    if (!examSubmitted || examQuestions.length === 0) return null;
    let correct = 0;
    let wrong = 0;
    let score = 0;
    const details = examQuestions.map((q) => {
      const studentAns = examAnswers[q.id] || null;
      const isCorrect = studentAns === q.correctAnswer;
      const isSkipped = studentAns === null;
      if (isCorrect) {
        correct++;
        score += 1.0;
      } else if (!isSkipped) {
        wrong++;
        score -= 0.25;
      }
      return {
        ...q,
        studentAnswer: studentAns,
        status: isCorrect ? "Correct" : isSkipped ? "Skipped" : "Wrong",
      };
    });

    const totalAttempted = correct + wrong;
    const accuracy = totalAttempted > 0 ? ((correct / totalAttempted) * 100).toFixed(1) : 0;
    const passThreshold = examQuestions.length * 0.55;
    const cutoffPrediction = score >= passThreshold ? "Likely Qualified" : score >= passThreshold - 1 ? "Likely Borderline" : "Likely Not Qualified";

    const resultsObj = {
      score,
      correct,
      wrong,
      skipped: examQuestions.length - totalAttempted,
      attempted: totalAttempted,
      accuracy,
      cutoffPrediction,
      details,
    };

    return resultsObj;
  }, [examSubmitted, examAnswers, examQuestions]);

  // Auto-save results once after submission (side effect — must not be inside useMemo)
  const autoSaveCalledRef = useRef(false);
  useEffect(() => {
    if (examSubmitted && results && !autoSaveCalledRef.current) {
      autoSaveCalledRef.current = true;
      autoSaveAfterSubmit(results);
    }
    if (!examSubmitted) {
      autoSaveCalledRef.current = false; // reset for next exam
    }
  }, [examSubmitted, results]);

  // Sub-categories lists depending on tab
  const subCategories = useMemo(() => {
    if (activeTab === "prelims") {
      return ["All", "English Language", "Quantitative Aptitude", "Reasoning Ability"];
    } else if (activeTab === "mains") {
      return [
        "All",
        "Reasoning & Computer Aptitude",
        "Data Analysis & Interpretation",
        "General/Economy/Banking Awareness",
        "English Language & Descriptive",
      ];
    } else if (activeTab === "interview") {
      return ["All", "HR / Personal", "Banking Concepts", "Situational Scenarios"];
    }
    return [];
  }, [activeTab]);

  // Filter list of study cards
  const filteredStudyCards = useMemo(() => {
    return topics.filter((t) => {
      if (activeSubcat !== "All" && t.topic !== activeSubcat) return false;
      if (activeDiff !== "All" && t.difficulty !== activeDiff) return false;
      const q = search.toLowerCase().trim();
      return (
        !q ||
        t.title.toLowerCase().includes(q) ||
        t.summary.toLowerCase().includes(q) ||
        t.topic.toLowerCase().includes(q)
      );
    });
  }, [topics, activeSubcat, activeDiff, search]);

  return (
    <div className="space-y-6">
      {/* Header Panel */}
      <div className="bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-3xl p-6 md:p-8 shadow-md relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            🏛️ Competitive Exams
          </div>
          <h1 className="text-2xl md:text-4xl font-black tracking-tight">IBPS PO Preparation</h1>
          <p className="text-sm md:text-base opacity-90 max-w-2xl font-medium">
            Study guide covering Prelims, Mains, and fully simulated timed mock tests with Groq AI review.
          </p>
        </div>
        <div className="absolute right-0 bottom-0 opacity-10 text-[120px] font-bold leading-none pointer-events-none select-none z-0">
          IBPS
        </div>
      </div>

      {/* Main Tabs */}
      {!examStarted && (
        <div className="flex gap-2 border-b border-slate-200 dark:border-slate-800 pb-px">
          {[
            { id: "prelims", label: "📋 Prelims Prep" },
            { id: "mains", label: "🏆 Mains Expert" },
            { id: "interview", label: "🎯 Mock Interview" },
            { id: "mocktest", label: "✍️ Timed Mock Test" },
          ].map((t) => {
            const active = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`flex-1 md:flex-none text-center px-4 py-3 text-sm font-bold border-b-2 transition-all ${
                  active
                    ? "border-amber-500 text-amber-600 dark:text-amber-400"
                    : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </div>
      )}

      {/* Study Sections (Prelims, Mains, Interview) */}
      {activeTab !== "mocktest" && (
        <>
          <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-4 space-y-4">
            <div className="flex gap-2 overflow-x-auto pb-1.5 scrollbar-thin">
              {subCategories.map((subcat) => (
                <button
                  key={subcat}
                  onClick={() => setActiveSubcat(subcat)}
                  className={`text-xs px-3.5 py-1.5 rounded-full font-bold transition-all flex-shrink-0 ${
                    activeSubcat === subcat
                      ? "bg-amber-600 text-white"
                      : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {subcat}
                </button>
              ))}
            </div>

            <div className="flex flex-col md:flex-row gap-3">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search questions or topics..."
                className="flex-1 text-sm px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-amber-400"
              />

              {activeTab !== "interview" && (
                <div className="flex gap-1.5 overflow-x-auto">
                  {["All", "Basic", "Intermediate", "Advanced", "Tricky"].map((d) => (
                    <button
                      key={d}
                      onClick={() => setActiveDiff(d)}
                      className={`text-xs px-3.5 py-2 rounded-xl font-semibold transition-colors ${
                        activeDiff === d
                          ? "bg-slate-800 text-white dark:bg-white dark:text-slate-800"
                          : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-3">
              <span className="w-8 h-8 border-2 border-amber-400/40 border-t-amber-500 rounded-full animate-spin" />
              <p className="text-sm text-slate-500 dark:text-slate-400 animate-pulse font-medium">
                Loading IBPS PO Study Content…
              </p>
            </div>
          ) : filteredStudyCards.length === 0 ? (
            <div className="text-center py-16 bg-slate-50 dark:bg-slate-900/20 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
              <p className="text-lg">🔍</p>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-semibold mt-1">
                No matching questions or topics found
              </p>
              <p className="text-xs text-slate-400 mt-0.5">Try widening your filters or search term</p>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">
                Showing {filteredStudyCards.length} of {topics.length} topics
              </p>
              <div className="grid grid-cols-1 gap-4">
                {filteredStudyCards.map((topic) =>
                  activeTab === "interview" ? (
                    <MockInterviewCard key={topic.id} topic={topic} />
                  ) : (
                    <TopicCard
                      key={topic.id}
                      topic={topic}
                      category={`ibpspo-${activeTab}`}
                      openId={openId}
                      setOpenId={setOpenId}
                    />
                  )
                )}
              </div>
            </div>
          )}
        </>
      )}

      {/* Timed Mock Test Section */}
      {activeTab === "mocktest" && (
        <>
          {/* Pre-Exam rules & trigger — shown when not in active exam */}
          {!examStarted && !examSubmitted && (
            <div className="space-y-6 max-w-3xl mx-auto">
              {/* Main card */}
              <div className="glass-card p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6">
                <div className="text-center space-y-2">
                  <span className="text-5xl">✍️</span>
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Dynamic AI Mock Test</h2>
                  <p className="text-sm text-slate-500">Practice under real-time exam conditions with unique questions generated live by Groq AI</p>
                </div>

                <div className="border-t border-b border-slate-100 dark:border-slate-800 py-4 grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Duration</p>
                    <p className="text-lg font-bold text-slate-800 dark:text-slate-100">15 Mins</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Questions</p>
                    <p className="text-lg font-bold text-slate-800 dark:text-slate-100">15</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Total Marks</p>
                    <p className="text-lg font-bold text-slate-800 dark:text-slate-100">15.0</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Test Instructions:</h3>
                  <ul className="text-xs text-slate-500 dark:text-slate-400 space-y-2 list-disc list-inside">
                    <li>Questions are dynamically generated by Groq AI — every test is unique.</li>
                    <li>Sections: <strong>English (5 Qs), Quant (5 Qs), and Reasoning (5 Qs)</strong>.</li>
                    <li>Marking Scheme: <strong>+1.0</strong> for correct answer, <strong>-0.25</strong> for wrong answer.</li>
                    <li>You can <strong>Save</strong> the generated questions and attempt later, or <strong>Start</strong> immediately.</li>
                    <li>Your results are automatically saved once you submit a test.</li>
                  </ul>
                </div>

                {/* Step 1: Generate button */}
                {generatedQuestions.length === 0 && (
                  <button
                    onClick={generateQuestions}
                    disabled={generating}
                    className="w-full py-3.5 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-bold rounded-2xl shadow-md transition-all text-center flex items-center justify-center gap-2"
                  >
                    {generating ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        🤖 Generating AI Questions...
                      </>
                    ) : (
                      "🤖 Generate Questions"
                    )}
                  </button>
                )}

                {/* Step 2: After generation — Start or Save */}
                {generatedQuestions.length > 0 && (
                  <div className="space-y-3">
                    {/* Preview badge */}
                    <div className="flex items-center gap-3 p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-2xl">
                      <span className="text-2xl">✅</span>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-emerald-700 dark:text-emerald-300">{generatedQuestions.length} unique questions ready!</p>
                        <p className="text-xs text-emerald-600 dark:text-emerald-400">
                          {[...new Set(generatedQuestions.map(q => q.section))].join(" · ")}
                        </p>
                      </div>
                      <button
                        onClick={generateQuestions}
                        disabled={generating}
                        className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
                      >
                        Regenerate
                      </button>
                    </div>

                    {/* CTA buttons */}
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => beginExam(generatedQuestions)}
                        className="py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold rounded-2xl shadow-lg shadow-amber-200/40 dark:shadow-amber-900/30 transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2"
                      >
                        ▶ Start Test Now
                      </button>
                      <button
                        onClick={() => saveTestForLater(generatedQuestions)}
                        disabled={savingTest}
                        className="py-3.5 bg-white dark:bg-slate-800 border-2 border-indigo-300 dark:border-indigo-700 text-indigo-600 dark:text-indigo-300 font-bold rounded-2xl hover:bg-indigo-50 dark:hover:bg-indigo-950/30 transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2"
                      >
                        {savingTest ? <span className="w-4 h-4 border-2 border-indigo-400/40 border-t-indigo-400 rounded-full animate-spin" /> : "💾 Save for Later"}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* My Saved Tests */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">📂 My Saved Tests</h3>
                  {savedTests.length > 0 && (
                    <span className="text-xs text-slate-400 font-medium">{savedTests.length} test{savedTests.length !== 1 ? "s" : ""}</span>
                  )}
                </div>

                {loadingSavedTests && (
                  <div className="flex items-center gap-2 text-slate-400 text-sm py-4 justify-center">
                    <span className="w-4 h-4 border-2 border-slate-300 border-t-slate-500 rounded-full animate-spin" />
                    Loading saved tests...
                  </div>
                )}

                {!loadingSavedTests && savedTests.length === 0 && (
                  <div className="text-center py-8 text-slate-400 text-sm border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl">
                    <p className="text-2xl mb-2">📝</p>
                    <p>No saved tests yet. Generate a test and save it for later!</p>
                  </div>
                )}

                {!loadingSavedTests && savedTests.map((test) => (
                  <div
                    key={test.id}
                    className="flex items-center gap-4 p-4 bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl hover:border-indigo-300 dark:hover:border-indigo-700 transition-all group"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">{test.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          test.status === "attempted"
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                            : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
                        }`}>
                          {test.status === "attempted" ? "✓ Attempted" : "⏳ Saved"}
                        </span>
                        {test.status === "attempted" && test.results && (
                          <span className="text-[10px] text-slate-400 font-medium">
                            Score: {test.results.score?.toFixed(2)} · {test.results.accuracy}% acc
                          </span>
                        )}
                        {test.createdAt && (
                          <span className="text-[10px] text-slate-400">
                            {new Date(test.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => loadAndStartTest(test.id)}
                        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-colors"
                      >
                        {test.status === "attempted" ? "Re-attempt" : "▶ Start"}
                      </button>
                      <button
                        onClick={() => deleteSavedTest(test.id)}
                        className="px-2 py-1.5 bg-red-50 dark:bg-red-950/30 text-red-500 hover:bg-red-100 dark:hover:bg-red-950/50 text-xs font-bold rounded-xl transition-colors"
                      >
                        🗑
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Exam Mode / Active Test Screen */}
          {examStarted && !examSubmitted && (
            <div className="flex flex-col lg:flex-row gap-6 items-start" style={{fontFamily: "'Inter', 'Segoe UI', sans-serif"}}>
              {/* Question Area */}
              <div className="flex-1 w-full space-y-4">
                {/* Exam Sub-Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl">
                  {/* Section Jumper */}
                  <div className="flex gap-1.5 overflow-x-auto">
                    {["English Language", "Quantitative Aptitude", "Reasoning Ability"].map((sec) => (
                      <button
                        key={sec}
                        onClick={() => {
                          const firstQ = examQuestions.find((q) => q.section === sec);
                          if (firstQ) {
                            const idx = examQuestions.indexOf(firstQ);
                            jumpToQuestion(idx);
                          }
                        }}
                        className={`text-xs px-3 py-1.5 rounded-xl font-bold transition-colors whitespace-nowrap ${
                          examSection === sec
                            ? "bg-slate-800 text-white dark:bg-white dark:text-slate-800"
                            : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                        }`}
                      >
                        {sec}
                      </button>
                    ))}
                  </div>

                  {/* Timer Display */}
                  <div className="flex items-center gap-2 text-red-600 dark:text-red-400 font-mono text-lg font-bold">
                    ⏱️ {formatTime(timeLeft)}
                  </div>
                </div>

                {/* Active Question Box */}
                {(() => {
                  const q = examQuestions[currentQIndex];
                  if (!q) return null;
                  return (
                    <div className="bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 space-y-6" style={{fontFamily: "'Inter', 'Segoe UI', sans-serif"}}>
                      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
                        <span style={{fontFamily: "'Inter', sans-serif", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase"}} className="text-slate-400">
                          Question {currentQIndex + 1} of {examQuestions.length}
                        </span>
                        <span style={{fontFamily: "'Inter', sans-serif", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.06em"}} className="text-slate-400 uppercase">
                          Marks: {q.marks} | Neg: {q.negativeMarks}
                        </span>
                      </div>

                      {/* Passage if exists */}
                      {q.passage && (
                        <div style={{fontFamily: "'Georgia', 'Times New Roman', serif", fontSize: "0.9rem", lineHeight: "1.85", letterSpacing: "0.01em"}} className="bg-gradient-to-br from-slate-50 to-blue-50/30 dark:from-slate-900/60 dark:to-blue-950/20 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/60 max-h-64 overflow-y-auto text-slate-700 dark:text-slate-300 shadow-inner">
                          {q.passage}
                        </div>
                      )}

                      {/* Table if exists */}
                      {q.table && (
                        <div className="overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-xl">
                          <table className="min-w-full text-xs text-center border-collapse">
                            <thead>
                              <tr className="bg-slate-100 dark:bg-slate-900/80 text-slate-600 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
                                {q.table.columns.map((col, idx) => (
                                  <th key={idx} className="p-2 border-r border-slate-200 dark:border-slate-700">{col}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {q.table.rows.map((row, idx) => (
                                <tr key={idx} className="border-b border-slate-150 dark:border-slate-800">
                                  {row.map((cell, cidx) => (
                                    <td key={cidx} className="p-2 border-r border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-medium">{cell}</td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}

                      {/* Question Text */}
                      <p style={{fontFamily: "'Inter', 'Segoe UI', sans-serif", fontSize: "1rem", fontWeight: 600, lineHeight: "1.7", letterSpacing: "0.005em"}} className="text-slate-800 dark:text-slate-100 whitespace-pre-wrap">
                        {q.question}
                      </p>

                      {/* Options (Radio buttons) */}
                      <div className="grid grid-cols-1 gap-3">
                        {Object.entries(q.options).map(([key, opt]) => {
                          const selected = examAnswers[q.id] === key;
                          return (
                            <button
                              key={key}
                              onClick={() => handleSelectOption(q.id, key)}
                              style={{fontFamily: "'Inter', 'Segoe UI', sans-serif", fontSize: "0.9rem", letterSpacing: "0.01em", transition: "all 0.18s cubic-bezier(.4,0,.2,1)"}}
                              className={`text-left px-4 py-3.5 rounded-2xl border-2 font-medium flex items-center gap-3.5 ${
                                selected
                                  ? "border-amber-500 bg-amber-50 dark:bg-amber-950/30 text-slate-800 dark:text-amber-100 shadow-md shadow-amber-100/50 dark:shadow-amber-900/20"
                                  : "border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-600 hover:bg-indigo-50/40 dark:hover:bg-indigo-950/20 text-slate-700 dark:text-slate-300"
                              }`}
                            >
                              <span style={{fontFamily: "'Inter', sans-serif", fontSize: "0.75rem", fontWeight: 800, minWidth: "2rem", minHeight: "2rem", transition: "all 0.18s"}} className={`rounded-full border-2 flex items-center justify-center ${
                                selected
                                  ? "border-amber-500 bg-amber-500 text-white shadow-sm"
                                  : "border-slate-300 dark:border-slate-600 text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800"
                              }`}>
                                {key}
                              </span>
                              <span style={{lineHeight: "1.5"}}>{opt}</span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Exam Controls */}
                      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 dark:border-slate-700 pt-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => toggleMarkForReview(q.id)}
                            className={`px-4 py-2 text-xs font-bold rounded-xl transition-colors ${
                              markedReview.has(q.id)
                                ? "bg-purple-600 text-white hover:bg-purple-700"
                                : "bg-purple-100 text-purple-700 dark:bg-purple-950/30 dark:text-purple-300 hover:bg-purple-200"
                            }`}
                          >
                            {markedReview.has(q.id) ? "★ Marked for Review" : "☆ Mark for Review"}
                          </button>
                          <button
                            onClick={() => clearResponse(q.id)}
                            className="px-4 py-2 bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300 hover:bg-slate-250 text-xs font-bold rounded-xl"
                          >
                            Clear Response
                          </button>
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={prevQuestion}
                            disabled={currentQIndex === 0}
                            className="px-4 py-2 bg-slate-100 dark:bg-slate-700 disabled:opacity-40 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl"
                          >
                            ◀ Previous
                          </button>
                          <button
                            onClick={saveAndNext}
                            disabled={currentQIndex === examQuestions.length - 1}
                            className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl"
                          >
                            Save & Next ▶
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Grid palette sidebar — sticky */}
              <div
                style={{
                  position: "sticky",
                  top: "80px",
                  alignSelf: "flex-start",
                  fontFamily: "'Inter', 'Segoe UI', sans-serif",
                }}
                className="w-full lg:w-80 bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-3xl p-5 space-y-5 shadow-xl shadow-slate-200/60 dark:shadow-slate-900/60"
              >
                <div className="text-center">
                  <h3 style={{fontFamily: "'Inter', sans-serif", fontSize: "0.7rem", fontWeight: 800, letterSpacing: "0.12em"}} className="text-slate-700 dark:text-slate-200 uppercase">Question Palette</h3>
                  <p style={{fontSize: "0.68rem"}} className="text-slate-400 mt-0.5">Click numbers to jump directly</p>
                </div>

                {/* 15 Qs Grid */}
                <div className="grid grid-cols-5 gap-2 p-1.5">
                  {examQuestions.map((q, idx) => {
                    const isVisited = visitedSet.has(q.id);
                    const isAnswered = examAnswers[q.id] !== undefined;
                    const isMarked = markedReview.has(q.id);
                    const active = currentQIndex === idx;

                    let bg = "bg-slate-100 dark:bg-slate-700/70 text-slate-500 dark:text-slate-400";
                    if (isAnswered && isMarked) {
                      bg = "bg-purple-600 text-white ring-2 ring-emerald-400";
                    } else if (isMarked) {
                      bg = "bg-purple-600 text-white";
                    } else if (isAnswered) {
                      bg = "bg-emerald-500 text-white";
                    } else if (isVisited) {
                      bg = "bg-red-500 text-white";
                    }

                    return (
                      <button
                        key={q.id}
                        onClick={() => jumpToQuestion(idx)}
                        style={{fontFamily: "'Inter', sans-serif", fontSize: "0.75rem", fontWeight: 700, transition: "all 0.15s cubic-bezier(.4,0,.2,1)", width: "2.25rem", height: "2.25rem"}}
                        className={`rounded-xl flex items-center justify-center ${bg} ${
                          active ? "ring-2 ring-amber-500 ring-offset-2 dark:ring-offset-slate-800 scale-110 shadow-md" : "hover:scale-105"
                        }`}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>

                {/* Palette Legends */}
                <div className="border-t border-slate-100 dark:border-slate-700 pt-3 grid grid-cols-2 gap-2" style={{fontSize: "0.68rem", fontWeight: 600, color: "#94a3b8"}}>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 bg-slate-200 dark:bg-slate-700 rounded inline-block"></span> Not Visited
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 bg-red-500 rounded inline-block"></span> Not Answered
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 bg-emerald-500 rounded inline-block"></span> Answered
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 bg-purple-600 rounded inline-block"></span> Marked
                  </div>
                </div>

                <button
                  onClick={submitExam}
                  style={{fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: "0.82rem", letterSpacing: "0.03em", transition: "all 0.18s"}}
                  className="w-full py-3 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white rounded-2xl shadow-lg shadow-red-200/50 dark:shadow-red-900/30 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 text-center"
                >
                  📥 Submit Mock Test
                </button>
              </div>
            </div>
          )}

          {/* Results Dashboard Post-Submission */}
          {examSubmitted && results && (
            <div className="space-y-6">
              {/* Score summary panel */}
              <div className="bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
                <div className="text-center md:border-r border-slate-150 dark:border-slate-700 py-2 space-y-1">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Overall score</p>
                  <div className="flex items-center justify-center">
                    <ScoreRing score={results.score} size={100} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 col-span-2 md:border-r border-slate-150 dark:border-slate-700 px-2">
                  <div className="text-center">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Correct</p>
                    <p className="text-2xl font-black text-green-600">{results.correct}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Wrong</p>
                    <p className="text-2xl font-black text-red-500">{results.wrong}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Accuracy</p>
                    <p className="text-2xl font-black text-blue-500">{results.accuracy}%</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Attempted</p>
                    <p className="text-2xl font-black text-slate-700 dark:text-slate-300">{results.attempted}/{examQuestions.length}</p>
                  </div>
                </div>

                <div className="text-center py-2 space-y-1.5">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Cutoff Status</p>
                  <p className={`text-lg font-black ${
                    results.cutoffPrediction === "Likely Qualified" ? "text-green-600" : results.cutoffPrediction === "Likely Borderline" ? "text-blue-500" : "text-red-500"
                  }`}>
                    {results.cutoffPrediction}
                  </p>
                  <p className="text-[10px] text-slate-400">Predicted Cutoff: 55% Marks</p>
                </div>
              </div>

              {/* Section wise stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { name: "English Language", target: examQuestions.filter(q => q.section === "English Language").length },
                  { name: "Quantitative Aptitude", target: examQuestions.filter(q => q.section === "Quantitative Aptitude").length },
                  { name: "Reasoning Ability", target: examQuestions.filter(q => q.section === "Reasoning Ability").length },
                ].map((sec) => {
                  const secQuestions = examQuestions.filter((q) => q.section === sec.name);
                  let secCorrect = 0;
                  let secWrong = 0;
                  secQuestions.forEach((q) => {
                    const studentAns = examAnswers[q.id];
                    if (studentAns === q.correctAnswer) secCorrect++;
                    else if (studentAns !== undefined) secWrong++;
                  });
                  const secScore = secCorrect - secWrong * 0.25;

                  return (
                    <div key={sec.name} className="bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4">
                      <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100">{sec.name}</h4>
                      <div className="grid grid-cols-3 gap-2 text-center text-xs">
                        <div>
                          <p className="text-[9px] text-slate-400 font-semibold uppercase">Score</p>
                          <p className="text-base font-black text-slate-800 dark:text-slate-100">{secScore.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-[9px] text-slate-400 font-semibold uppercase">Accuracy</p>
                          <p className="text-base font-black text-blue-500">
                            {secCorrect + secWrong > 0 ? ((secCorrect / (secCorrect + secWrong)) * 100).toFixed(0) : 0}%
                          </p>
                        </div>
                        <div>
                          <p className="text-[9px] text-slate-400 font-semibold uppercase">Questions</p>
                          <p className="text-base font-black text-slate-400">{sec.target}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* AI performance analysis & Recommendations */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* AI Performance Analysis */}
                <div className="bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 space-y-4">
                  <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-700 pb-3">
                    <span className="text-lg">🤖</span>
                    <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 uppercase tracking-wide">AI Performance Analysis</h3>
                  </div>

                  <div className="space-y-3.5">
                    <div>
                      <p className="text-xs font-bold text-green-600 dark:text-green-400 uppercase tracking-wide mb-1">✓ Strong Areas (High Accuracy)</p>
                      <div className="flex flex-wrap gap-1.5">
                        {mockTestData.analytics.topicsAnalysis.strongAreas.map((t, idx) => (
                          <span key={idx} className="text-xs px-2.5 py-1 rounded-lg bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-300 font-semibold border border-green-200/50">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-bold text-red-500 dark:text-red-400 uppercase tracking-wide mb-1">✗ Weak Areas (Revision Needed)</p>
                      <div className="flex flex-wrap gap-1.5">
                        {mockTestData.analytics.topicsAnalysis.weakAreas.map((t, idx) => (
                          <span key={idx} className="text-xs px-2.5 py-1 rounded-lg bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 font-semibold border border-red-200/50">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wide mb-1">⏳ Slow Solving Areas</p>
                      <div className="flex flex-wrap gap-1.5">
                        {mockTestData.analytics.topicsAnalysis.slowSolving.map((t, idx) => (
                          <span key={idx} className="text-xs px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-300 font-semibold border border-amber-200/50">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* AI Study Plan */}
                <div className="bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 space-y-4">
                  <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-700 pb-3">
                    <span className="text-lg">💡</span>
                    <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 uppercase tracking-wide">Personalized AI Recommendations</h3>
                  </div>

                  <div className="space-y-4 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    <div className="flex justify-between border-b border-slate-100 dark:border-slate-700 pb-2">
                      <span className="font-semibold">Suggested Daily Time</span>
                      <span className="font-bold text-amber-600 dark:text-amber-400">{mockTestData.recommendations.suggestedStudyTimeHours} Hours</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 dark:border-slate-700 pb-2">
                      <span className="font-semibold">Next Recommended Mock</span>
                      <span className="font-bold text-indigo-500">{mockTestData.recommendations.nextMockRecommendation}</span>
                    </div>

                    <div>
                      <span className="font-semibold block mb-1">Recommended Revision Order:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {mockTestData.recommendations.revisionOrder.map((t, idx) => (
                          <span key={idx} className="text-xs px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-300 font-semibold">
                            {idx + 1}. {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Review questions panel */}
              <div className="space-y-4">
                <h3 className="font-bold text-base text-slate-800 dark:text-slate-100 uppercase tracking-wide">Review All Questions</h3>
                <div className="space-y-3">
                  {results.details.map((q, idx) => {
                    const correct = q.status === "Correct";
                    const skipped = q.status === "Skipped";
                    return (
                      <div key={q.id} className={`bg-white dark:bg-slate-800/80 border rounded-2xl p-5 space-y-4 ${
                        correct ? "border-green-200" : skipped ? "border-slate-200" : "border-red-200"
                      }`}>
                        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-2.5">
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Question {idx+1} · {q.topic}</span>
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                            correct ? "bg-green-100 text-green-700" : skipped ? "bg-slate-100 text-slate-500" : "bg-red-100 text-red-600"
                          }`}>{q.status}</span>
                        </div>

                        <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{q.question}</p>

                        {/* Options check */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                          {Object.entries(q.options).map(([key, val]) => {
                            const isCorrectAns = q.correctAnswer === key;
                            const isSelected = q.studentAnswer === key;
                            let style = "border-slate-200 text-slate-600 dark:text-slate-300";
                            if (isCorrectAns) style = "border-green-300 bg-green-50/50 dark:bg-green-950/20 text-green-800 dark:text-green-300";
                            else if (isSelected) style = "border-red-300 bg-red-50/50 dark:bg-red-950/20 text-red-700 dark:text-red-300";

                            return (
                              <div key={key} className={`p-2.5 border rounded-lg flex items-center gap-2 ${style}`}>
                                <span className={`w-4 h-4 rounded-full border flex items-center justify-center font-bold text-[9px] ${
                                  isCorrectAns ? "bg-green-500 text-white border-green-500" : isSelected ? "bg-red-500 text-white border-red-500" : "border-slate-300"
                                }`}>{key}</span>
                                <span>{val}</span>
                              </div>
                            );
                          })}
                        </div>

                        {/* Solution / explanation */}
                        <div className="bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                          <p className="font-bold text-[10px] text-indigo-500 uppercase tracking-wider">Explanation / Correct logic:</p>
                          <p className="leading-relaxed whitespace-pre-wrap">{q.explanation}</p>
                          {q.shortcut && (
                            <p className="mt-1"><strong className="text-amber-600">Short Trick: </strong>{q.shortcut}</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <button
                onClick={() => {
                  setExamStarted(false);
                  setExamSubmitted(false);
                }}
                className="w-full py-3.5 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-2xl shadow-md transition-colors text-center"
              >
                ◀ Go back to instructions / Retake Mock Test
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
