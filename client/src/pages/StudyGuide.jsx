import { useState, useMemo, useRef, useEffect } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { STUDY_CATEGORIES, STUDY_TOPICS } from "../data/studyGuide";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const DIFF_STYLES = {
  Basic: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
  Intermediate:
    "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",
  Advanced: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  Tricky:
    "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
};

const STORAGE_KEY = "devquiz_reviewed_v2";
function loadReviewed() {
  try {
    return new Set(JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"));
  } catch {
    return new Set();
  }
}
function saveReviewed(set) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]));
}

function AiPanel({ topic, onClose }) {
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
    if (chatRef.current)
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
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
      className="mt-3 rounded-2xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50/60 dark:bg-indigo-950/40 overflow-hidden"
    >
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-indigo-200 dark:border-indigo-800 bg-indigo-100/60 dark:bg-indigo-900/40">
        <span className="text-sm">🤖</span>
        <span className="font-semibold text-sm text-indigo-700 dark:text-indigo-300 flex-1">
          AI Assistant
        </span>
        {[
          ["summary", "✨ Summarise"],
          ["ask", "💬 Ask AI"],
        ].map(([m, l]) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`text-xs px-3 py-1 rounded-full font-medium transition-colors ${mode === m ? "bg-indigo-600 text-white" : "text-indigo-600 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-800"}`}
          >
            {l}
          </button>
        ))}
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 ml-1 text-xl leading-none"
        >
          ×
        </button>
      </div>

      {mode === "summary" && (
        <div className="p-4">
          {loadingSum ? (
            <div className="flex items-center gap-2 text-sm text-indigo-500 animate-pulse">
              <span>⟳</span> Generating AI summary…
            </div>
          ) : (
            <>
              <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">
                {summary}
              </p>
              <button
                onClick={fetchSummary}
                className="mt-3 text-xs text-indigo-500 hover:text-indigo-700 underline"
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
                      ? "bg-indigo-600 text-white"
                      : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
                  }`}
                >
                  {m.role === "ai" && (
                    <span className="text-[10px] text-indigo-500 font-bold block mb-0.5">
                      🤖 AI
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
          <div className="flex gap-2 p-3 border-t border-indigo-200 dark:border-indigo-800">
            <input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && !e.shiftKey && sendQuestion()
              }
              placeholder="Ask about this topic…"
              className="flex-1 text-sm px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <button
              onClick={sendQuestion}
              disabled={!question.trim() || loadingAsk}
              className="px-3 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium disabled:opacity-40 hover:bg-indigo-700 transition-colors"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}

function TopicCard({ topic, reviewed, onToggle, openId, setOpenId }) {
  const open = openId === topic.id;
  const setOpen = (val) => setOpenId(val ? topic.id : null);
  const [tab, setTab] = useState("explanation");
  const [showAi, setShowAi] = useState(false);
  const { user } = useAuth();

  const tabs = [
    { id: "explanation", label: "📖 Explanation" },
    { id: "question", label: "🎯 Interview Q" },
    ...(topic.code ? [{ id: "code", label: "💻 Code" }] : []),
  ];

  return (
    <div
      style={{ cursor: "pointer" }}
      className={`rounded-2xl border transition-all ${reviewed ? "border-indigo-400 dark:border-indigo-500" : "border-slate-200 dark:border-slate-700"} bg-white dark:bg-slate-800/60 overflow-hidden hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-md`}
    >
      <button
        onClick={() => setOpen(!open)}
        style={{ cursor: "pointer" }}
        className="w-full text-left px-4 py-3 flex items-start gap-3"
      >
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-1.5 mb-1">
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${DIFF_STYLES[topic.difficulty]}`}
            >
              {topic.difficulty}
            </span>
            <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wide">
              {topic.topic}
            </span>
            {reviewed && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-300">
                ✓ Reviewed
              </span>
            )}
          </div>
          <p className="font-semibold text-sm text-slate-800 dark:text-slate-100">
            {topic.title}
          </p>
          {/* Key concept always visible — first hook before expanding */}
          <p className="text-xs text-indigo-600 dark:text-indigo-300 font-medium mt-1 line-clamp-1">
            💡 {topic.summary}
          </p>
        </div>
        <span className="text-slate-400 text-xs mt-1 flex-shrink-0">
          {open ? "▲" : "▼"}
        </span>
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
              {/* Key concept highlight box */}
              <div className="bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 rounded-xl p-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 mb-1">
                  Key Concept
                </p>
                <p className="text-sm font-medium text-indigo-700 dark:text-indigo-200 leading-relaxed">
                  {topic.summary}
                </p>
              </div>

              {/* Tabs */}
              <div className="flex gap-1.5 flex-wrap">
                {tabs.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTab(t.id)}
                    style={{ cursor: "pointer" }}
                    className={`text-xs px-3 py-1 rounded-full font-medium transition-colors ${tab === t.id ? "bg-indigo-600 text-white" : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"}`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {tab === "explanation" && (
                <div className="space-y-3">
                  {/* Split long explanations into paragraphs for readability */}
                  {topic.explanation.split(/\n\n+/).map((para, i) => (
                    <p
                      key={i}
                      className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap"
                    >
                      {para.trim()}
                    </p>
                  ))}
                  {/* If code exists, always show a preview */}
                  {topic.code && (
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                        Code Example
                      </p>
                      <pre className="bg-slate-900 dark:bg-black rounded-xl p-3 overflow-x-auto text-xs text-emerald-300 leading-relaxed whitespace-pre">
                        <code>{topic.code}</code>
                      </pre>
                    </div>
                  )}
                </div>
              )}

              {tab === "question" && (
                <div className="space-y-3">
                  <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/50 rounded-xl p-3">
                    <p className="text-xs font-bold text-amber-600 dark:text-amber-400 mb-1.5">
                      🎯 Common Interview Question
                    </p>
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 leading-relaxed">
                      {topic.interviewQuestion}
                    </p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-700 rounded-xl p-3">
                    <p className="text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-wide">
                      💬 Model Answer
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

              {tab === "code" && topic.code && (
                <pre className="bg-slate-900 dark:bg-black rounded-xl p-4 overflow-x-auto text-xs text-emerald-300 leading-relaxed whitespace-pre">
                  <code>{topic.code}</code>
                </pre>
              )}

              <AnimatePresence>
                {showAi && (
                  <AiPanel
                    key="ai"
                    topic={topic}
                    onClose={() => setShowAi(false)}
                  />
                )}
              </AnimatePresence>

              <div className="flex items-center justify-between pt-1 flex-wrap gap-2">
                {!user?.isGuest && (
                  <button
                    style={{ cursor: "pointer" }}
                    onClick={() => setShowAi((v) => !v)}
                    className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full transition-colors ${showAi ? "bg-indigo-600 text-white" : "bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/60"}`}
                  >
                    🤖 {showAi ? "Hide AI" : "AI Help"}
                  </button>
                )}

                <button
                  style={{ cursor: "pointer" }}
                  onClick={() => onToggle(topic.id)}
                  className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${reviewed ? "border-indigo-400 bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300" : "border-slate-300 dark:border-slate-600 text-slate-500 hover:border-indigo-400 hover:text-indigo-600"}`}
                >
                  {reviewed ? "✓ Reviewed" : "Mark Reviewed"}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── AI Explainer ──────────────────────────────────────────────────────────────
function AiExplainer() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]); // [{input, explanation}]

  async function explain() {
    const text = input.trim();
    if (!text || loading) return;
    setLoading(true);
    setResult(null);
    try {
      const { data } = await api.post("/study/explain", { text });
      setResult(data.explanation);
      setHistory((h) =>
        [{ input: text, explanation: data.explanation }, ...h].slice(0, 10),
      );
    } catch {
      setResult("AI is unavailable right now. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const EXAMPLES = [
    "Promise.all vs Promise.allSettled",
    "useEffect cleanup function",
    "const [a, ...rest] = arr",
    "Object.freeze vs Object.seal",
  ];

  return (
    <div className="rounded-2xl border border-violet-200 dark:border-violet-800 bg-gradient-to-br from-violet-50 to-indigo-50 dark:from-violet-950/40 dark:to-indigo-950/40 overflow-hidden">
      {/* Header — always visible */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-3 px-4 py-3.5 text-left"
      >
        <span className="text-xl">🧠</span>
        <div className="flex-1">
          <p className="font-bold text-sm text-violet-700 dark:text-violet-300">
            AI Explainer
          </p>
          <p className="text-xs text-violet-500 dark:text-violet-400">
            Paste any code, concept or error — AI explains it
          </p>
        </div>
        <span className="text-violet-400 text-xs">{open ? "▲" : "▼"}</span>
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
            <div className="px-4 pb-4 space-y-3 border-t border-violet-200 dark:border-violet-800 pt-3">
              {/* Quick examples */}
              <div className="flex gap-1.5 flex-wrap">
                <span className="text-xs text-violet-400 mr-1 self-center">
                  Try:
                </span>
                {EXAMPLES.map((ex) => (
                  <button
                    key={ex}
                    onClick={() => setInput(ex)}
                    className="text-xs px-2.5 py-1 rounded-full bg-violet-100 dark:bg-violet-900/50 text-violet-600 dark:text-violet-300 hover:bg-violet-200 dark:hover:bg-violet-800 transition-colors"
                  >
                    {ex}
                  </button>
                ))}
              </div>

              {/* Input */}
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && e.metaKey && explain()}
                placeholder={
                  "Paste code, an error message, or any concept…\n\nExamples:\n• useCallback(() => ..., [deps])\n• Cannot read properties of undefined\n• What is the event loop?"
                }
                rows={7}
                className="w-full text-sm px-4 py-3 rounded-xl border border-violet-200 dark:border-violet-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder-slate-400 outline-none focus:ring-2 focus:ring-violet-400 resize-none font-mono"
              />

              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  ⌘ + Enter to submit
                </span>
                <button
                  onClick={explain}
                  disabled={!input.trim() || loading}
                  className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 disabled:opacity-40 text-white text-sm font-semibold rounded-xl transition-colors"
                >
                  {loading ? (
                    <>
                      <span className="animate-spin">⟳</span> Explaining…
                    </>
                  ) : (
                    <>✨ Explain This</>
                  )}
                </button>
              </div>

              {/* Result */}
              <AnimatePresence>
                {loading && !result && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-2 text-sm text-violet-500 py-2"
                  >
                    <span className="animate-spin inline-block">⟳</span> AI is
                    analysing…
                  </motion.div>
                )}
                {result && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-xl border border-violet-200 dark:border-violet-700 bg-white dark:bg-slate-900 p-4 space-y-2"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-violet-500 uppercase tracking-wide">
                        🤖 AI Explanation
                      </span>
                      <button
                        onClick={() => {
                          setInput("");
                          setResult(null);
                        }}
                        className="text-xs text-slate-400 hover:text-slate-600"
                      >
                        ✕ Clear
                      </button>
                    </div>
                    <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">
                      {result}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* History */}
              {history.length > 1 && (
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                    Recent
                  </p>
                  {history.slice(1, 4).map((h, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setInput(h.input);
                        setResult(h.explanation);
                      }}
                      className="w-full text-left text-xs px-3 py-2 rounded-lg bg-violet-50 dark:bg-violet-900/30 text-violet-600 dark:text-violet-300 hover:bg-violet-100 dark:hover:bg-violet-900/50 truncate transition-colors"
                    >
                      {h.input.slice(0, 80)}
                      {h.input.length > 80 ? "…" : ""}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function StudyGuide() {
  const location = useLocation();
  const preCategory = location.state?.preCategory;
  const [activeCat, setActiveCat] = useState(preCategory || "html");
  const [activeDiff, setActiveDiff] = useState("All");
  const [search, setSearch] = useState("");
  const [reviewed, setReviewed] = useState(loadReviewed);
  const [openId, setOpenId] = useState(null);

  const toggleReview = (id) =>
    setReviewed((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      saveReviewed(next);
      return next;
    });

  const cat = STUDY_CATEGORIES.find((c) => c.id === activeCat);
  const allInCat = STUDY_TOPICS.filter((t) => t.category === activeCat);

  // Close open card when switching category or filters
  const handleCatChange = (id) => {
    setActiveCat(id);
    setOpenId(null);
  };
  const handleDiffChange = (d) => {
    setActiveDiff(d);
    setOpenId(null);
  };

  const filtered = useMemo(
    () =>
      allInCat.filter((t) => {
        if (activeDiff !== "All" && t.difficulty !== activeDiff) return false;
        const q = search.toLowerCase();
        return (
          !q ||
          t.title.toLowerCase().includes(q) ||
          t.summary.toLowerCase().includes(q) ||
          t.topic.toLowerCase().includes(q)
        );
      }),
    [activeCat, activeDiff, search, allInCat],
  );

  const reviewedCount = allInCat.filter((t) => reviewed.has(t.id)).length;
  const progress = allInCat.length ? reviewedCount / allInCat.length : 0;

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
          📚 Study Hub
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          275 topics · 8 technologies · AI-powered explanations & Q&A
        </p>
      </div>

      {/* AI Explainer */}
      <AiExplainer />

      {/* Dev Tools */}
      {/* <DevTools /> */}

      {/* Category tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {STUDY_CATEGORIES.map((c) => (
          <button
            key={c.id}
            onClick={() => {
              handleCatChange(c.id);
              setSearch("");
              setActiveDiff("All");
            }}
            className={`flex-shrink-0 text-xs font-bold px-3 py-1.5 rounded-full border transition-all ${activeCat === c.id ? "text-white border-transparent" : "bg-transparent border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"}`}
            style={
              activeCat === c.id
                ? { background: c.color === "#ffffff" ? "#334155" : c.color }
                : {}
            }
          >
            {c.icon} {c.label}
          </button>
        ))}
      </div>

      {/* Progress */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/60 p-4">
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {cat?.label} Progress
            </p>
            <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
              {reviewedCount} / {allInCat.length} reviewed
            </p>
          </div>
          <span className="text-2xl font-black text-indigo-500">
            {Math.round(progress * 100)}%
          </span>
        </div>
        <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
          <motion.div
            className="h-2 rounded-full bg-indigo-500"
            animate={{ width: `${progress * 100}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
        {cat?.sources?.length > 0 && (
          <div className="flex items-center gap-2 mt-3 flex-wrap">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              📚 Reliable Sources:
            </span>
            {cat.sources.map((s) => (
              <a
                key={s.url}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-700 hover:bg-indigo-100 dark:hover:bg-indigo-800/60 transition-colors font-medium"
              >
                🔗 {s.label}
              </a>
            ))}
          </div>
        )}
      </div>

      {/* Search + filters */}
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search topics…"
          className="flex-1 text-sm px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <div className="flex gap-1.5 flex-wrap">
          {["All", "Basic", "Intermediate", "Advanced", "Tricky"].map((d) => (
            <button
              key={d}
              onClick={() => handleDiffChange(d)}
              className={`text-xs px-3 py-1.5 rounded-full font-medium border transition-colors whitespace-nowrap ${activeDiff === d ? "bg-indigo-600 text-white border-indigo-600" : "border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:border-indigo-400"}`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      <p className="text-xs text-slate-400">
        Showing{" "}
        <strong className="text-slate-600 dark:text-slate-300">
          {filtered.length}
        </strong>{" "}
        of {allInCat.length} topics
        {activeDiff !== "All" && ` · ${activeDiff}`}
        {search && ` · "${search}"`}
      </p>

      <div className="space-y-2">
        {filtered.map((t) => (
          <TopicCard
            key={t.id}
            topic={t}
            reviewed={reviewed.has(t.id)}
            onToggle={toggleReview}
            openId={openId}
            setOpenId={setOpenId}
          />
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-16 text-slate-400">
            <p className="text-3xl mb-2">🔍</p>
            <p className="text-sm">No topics match your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
