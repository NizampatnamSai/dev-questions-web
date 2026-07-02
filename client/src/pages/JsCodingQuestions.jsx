import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

// Graduated tiers from Easy through Hard — keys must match server DIFFICULTY_LEVELS.
const DIFFICULTIES = [
  { key: "easy", label: "Easy" },
  { key: "medium", label: "Medium" },
  { key: "medium-plus", label: "Medium+" },
  { key: "hard-minus", label: "Hard−" },
  { key: "hard", label: "Hard" },
  { key: "hard-plus", label: "Hard+" },
];

const DEFAULT_CODE = "function solve(...args) {\n  \n}";

function difficultyLabel(key) {
  return DIFFICULTIES.find((d) => d.key === key)?.label ?? key;
}

// Default behavior: ramp difficulty up as the user gets through more questions
// today (roughly 2-3 questions per tier against the default 15/day limit).
// The moment someone drags the slider themselves, we stop auto-adjusting and
// just respect their explicit pick from then on — same as before this feature.
function autoDifficultyFor(used) {
  const tier = Math.min(Math.floor((used || 0) / 3), DIFFICULTIES.length - 1);
  return DIFFICULTIES[tier].key;
}

function UsageMeter({ usage }) {
  if (!usage) return null;
  const pct = Math.min(100, (usage.used / usage.limit) * 100);
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <span>Coding questions used today</span>
        <span className={usage.remaining === 0 ? "text-red-400 font-semibold" : ""}>
          {usage.used} / {usage.limit}
        </span>
      </div>
      <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${
            usage.remaining === 0 ? "bg-red-500" : pct > 70 ? "bg-amber-400" : "bg-cyan-500"
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
      {usage.remaining === 0 && (
        <p className="text-xs text-red-400">Daily limit reached — resets at midnight UTC.</p>
      )}
      {usage.remaining > 0 && usage.remaining <= 3 && (
        <p className="text-xs text-amber-400">Only {usage.remaining} question{usage.remaining !== 1 ? "s" : ""} left today.</p>
      )}
    </div>
  );
}

function AdminBonusButtons({ onAdd, adding }) {
  return (
    <div className="flex items-center gap-2 mt-2">
      <span className="text-[11px] text-slate-400">👑 Admin: bump my own daily limit</span>
      {[5, 10, 15].map((n) => (
        <button
          key={n}
          onClick={() => onAdd(n)}
          disabled={adding}
          className="text-[11px] px-2 py-0.5 rounded-full font-semibold bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 disabled:opacity-50 transition"
        >
          +{n}
        </button>
      ))}
    </div>
  );
}

function ResultRow({ r, i }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -4 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: i * 0.04 }}
      className={`flex items-start gap-2 leading-relaxed ${r.passed ? "text-emerald-400" : "text-red-400"}`}
    >
      <span className="opacity-70 flex-shrink-0 w-4">{r.passed ? "✓" : "✖"}</span>
      <pre className="whitespace-pre-wrap break-all flex-1 text-xs">
        Test {i + 1}: solve({r.input.map((a) => JSON.stringify(a)).join(", ")})
        {"\n"}  expected {JSON.stringify(r.expected)} {r.passed ? "→ got that" : `→ got ${r.error ? `error: ${r.error}` : JSON.stringify(r.actual)}`}
      </pre>
    </motion.div>
  );
}

const TABS = [
  { id: "description", label: "📄 Description" },
  { id: "testcases", label: "🧪 Test Cases" },
  { id: "result", label: "📊 Result" },
];

export default function JsCodingQuestions() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin" || user?.role === "sub_admin";
  const [difficulty, setDifficulty] = useState("easy");
  const [autoDifficulty, setAutoDifficulty] = useState(true);
  const [usage, setUsage] = useState(null);
  const [addingBonus, setAddingBonus] = useState(false);
  const [question, setQuestion] = useState(null);
  const [code, setCode] = useState(DEFAULT_CODE);
  const [generating, setGenerating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [results, setResults] = useState(null);
  const [score, setScore] = useState(null);
  const [modelAnswer, setModelAnswer] = useState(null);
  const [revealing, setRevealing] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [history, setHistory] = useState(null);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [openingId, setOpeningId] = useState(null);
  const [setupOpen, setSetupOpen] = useState(true);
  const [tab, setTab] = useState("description");
  const [viewingFromHistory, setViewingFromHistory] = useState(false);

  const loadUsage = async () => {
    try {
      const { data } = await api.get("/study/coding/usage");
      setUsage(data);
    } catch { /* silent */ }
  };

  useEffect(() => { loadUsage(); }, []);

  // Keep the slider in sync with progress while in auto mode — recomputed
  // whenever today's usage count changes (e.g. right after generating one).
  useEffect(() => {
    if (autoDifficulty && usage) {
      setDifficulty(autoDifficultyFor(usage.used));
    }
  }, [autoDifficulty, usage]);

  const addBonus = async (amount) => {
    setAddingBonus(true);
    try {
      const { data } = await api.post("/study/coding/usage/bonus", { amount });
      setUsage(data);
      toast.success(`+${amount} added to today's limit`);
    } catch (e) {
      toast.error(e.response?.data?.detail || "Failed to add bonus");
    } finally {
      setAddingBonus(false);
    }
  };

  const generate = async () => {
    setGenerating(true);
    setQuestion(null);
    setResults(null);
    setScore(null);
    setModelAnswer(null);
    try {
      const { data } = await api.post("/study/coding/generate", { difficulty });
      setQuestion(data);
      setCode(DEFAULT_CODE);
      setTab("description");
      setSetupOpen(false);
      setViewingFromHistory(false);
      await loadUsage();
    } catch (e) {
      toast.error(e.response?.data?.detail || "Failed to generate question");
    } finally {
      setGenerating(false);
    }
  };

  const runTests = async () => {
    if (!question || !code.trim()) return;
    setSubmitting(true);
    try {
      const { data } = await api.post(`/study/coding/${question.id}/submit`, { code });
      setResults(data.results);
      setScore({ passed: data.passed, total: data.total, score: data.score });
      setTab("result");
    } catch (e) {
      toast.error(e.response?.data?.detail || "Failed to run tests");
    } finally {
      setSubmitting(false);
    }
  };

  const reveal = async () => {
    if (!question) return;
    setRevealing(true);
    try {
      const { data } = await api.post(`/study/coding/${question.id}/reveal`);
      setModelAnswer(data.modelAnswer);
    } catch (e) {
      toast.error(e.response?.data?.detail || "Submit an attempt first");
    } finally {
      setRevealing(false);
    }
  };

  const toggleHistory = async () => {
    const opening = !historyOpen;
    setHistoryOpen(opening);
    if (opening && !history) {
      setLoadingHistory(true);
      try {
        const { data } = await api.get("/study/coding/history");
        setHistory(data);
      } catch {
        toast.error("Failed to load history");
      } finally {
        setLoadingHistory(false);
      }
    }
  };

  const openPast = async (id) => {
    setOpeningId(id);
    try {
      const { data } = await api.get(`/study/coding/${id}`);
      setQuestion({ id: data.id, title: data.title, description: data.description, difficulty: data.difficulty, testCases: data.testCases });
      setCode(data.submission?.code || DEFAULT_CODE);
      setResults(data.submission?.results || null);
      setScore(data.submission ? { passed: data.submission.results.filter((r) => r.passed).length, total: data.submission.results.length, score: data.submission.score } : null);
      setModelAnswer(data.modelAnswer || null);
      setHistoryOpen(false);
      setSetupOpen(false);
      setTab("description");
      setViewingFromHistory(true);
    } catch {
      toast.error("Failed to open question");
    } finally {
      setOpeningId(null);
    }
  };

  // Closes the currently-open history question and reopens the History list —
  // distinct from "New Question", which starts a fresh generation instead.
  const backToHistory = () => {
    setQuestion(null);
    setResults(null);
    setScore(null);
    setModelAnswer(null);
    setViewingFromHistory(false);
    setHistoryOpen(true);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <span>💻</span> JS Coding Questions
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-0.5">
            Unique AI-generated problems • Real test cases • Mid-to-hard difficulty
          </p>
        </div>
        <div className="flex gap-2">
          {viewingFromHistory && (
            <button
              onClick={backToHistory}
              className="px-4 py-2 rounded-xl text-sm font-medium border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
            >
              ← Back to History
            </button>
          )}
          {question && !setupOpen && (
            <button
              onClick={() => setSetupOpen(true)}
              className="px-4 py-2 rounded-xl text-sm font-medium border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
            >
              ✨ New Question
            </button>
          )}
          <button
            onClick={toggleHistory}
            className="px-4 py-2 rounded-xl text-sm font-medium border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
          >
            📜 History
          </button>
        </div>
      </div>

      {/* History panel */}
      {historyOpen && (
        <div className="glass-card p-5 space-y-2">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Past questions</p>
          {loadingHistory ? (
            <p className="text-sm text-slate-400">Loading…</p>
          ) : !history?.length ? (
            <p className="text-sm text-slate-400">No questions generated yet.</p>
          ) : (
            <div className="space-y-1.5">
              {history.map((h) => (
                <button
                  key={h.id}
                  onClick={() => openPast(h.id)}
                  disabled={openingId === h.id}
                  className="w-full flex items-center justify-between gap-3 text-left px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition disabled:opacity-50"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">{h.title}</p>
                    <p className="text-xs text-slate-400">{difficultyLabel(h.difficulty)} • {h.date}</p>
                  </div>
                  {h.attempted ? (
                    <span className={`text-xs font-bold flex-shrink-0 ${h.score === 100 ? "text-emerald-500" : h.score >= 50 ? "text-amber-500" : "text-red-500"}`}>
                      {h.score}%
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400 flex-shrink-0">Not attempted</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Setup — full card before a question exists, collapsible bar after */}
      {setupOpen && (
        <div className="glass-card p-5 space-y-4">
          <UsageMeter usage={usage} />
          {isAdmin && <AdminBonusButtons onAdd={addBonus} adding={addingBonus} />}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Difficulty: <span className="text-indigo-500 font-bold">{difficultyLabel(difficulty)}</span>
              </label>
              {autoDifficulty ? (
                <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
                  🌱 Auto — gets harder as you go
                </span>
              ) : (
                <button
                  onClick={() => setAutoDifficulty(true)}
                  className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/20 transition"
                >
                  ↺ Back to auto
                </button>
              )}
            </div>
            <input
              type="range"
              min={0}
              max={DIFFICULTIES.length - 1}
              step={1}
              value={DIFFICULTIES.findIndex((d) => d.key === difficulty)}
              onChange={(e) => {
                setAutoDifficulty(false);
                setDifficulty(DIFFICULTIES[Number(e.target.value)].key);
              }}
              className="w-full accent-indigo-500"
            />
            <div className="flex justify-between text-xs text-slate-400 mt-1">
              {DIFFICULTIES.map((d) => <span key={d.key}>{d.label}</span>)}
            </div>
          </div>
          <button
            onClick={generate}
            disabled={generating || (usage && usage.remaining === 0)}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded-xl font-bold text-white transition-all"
          >
            {generating ? "Generating…" : "✨ Generate Question"}
          </button>
        </div>
      )}

      {/* Split-pane workspace: Problem (left) / Code (right) — hidden while the
          setup panel is open, so an old question doesn't linger below it */}
      <AnimatePresence>
        {question && !setupOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid lg:grid-cols-2 gap-4"
            style={{ minHeight: "min(75vh, 640px)" }}
          >
            {/* Left: Problem panel */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col overflow-hidden bg-white dark:bg-slate-900">
              <div className="flex items-center justify-between px-4 py-2.5 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex-wrap gap-2">
                <div className="flex gap-1">
                  {TABS.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setTab(t.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                        tab === t.id
                          ? "bg-indigo-600 text-white"
                          : "text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 font-semibold">
                  {difficultyLabel(question.difficulty)}
                </span>
              </div>

              <div className="flex-1 overflow-y-auto p-5">
                {tab === "description" && (
                  <div className="space-y-3">
                    <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">{question.title}</h2>
                    <p className="text-sm text-slate-600 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">{question.description}</p>
                    {question.testCases[0] && (
                      <div className="rounded-xl border border-indigo-200 dark:border-indigo-900/40 bg-indigo-50 dark:bg-indigo-950/30 p-3 space-y-1">
                        <p className="text-xs font-semibold text-indigo-500 uppercase tracking-wide">Example</p>
                        <code className="text-xs text-slate-700 dark:text-slate-200 block">
                          Input: solve({question.testCases[0].input.map((a) => JSON.stringify(a)).join(", ")})
                        </code>
                        <code className="text-xs text-emerald-600 dark:text-emerald-400 block">
                          Output: {JSON.stringify(question.testCases[0].expected)}
                        </code>
                      </div>
                    )}
                  </div>
                )}

                {tab === "testcases" && (
                  <div className="space-y-1.5">
                    {question.testCases.map((tc, i) => (
                      <div key={i} className="px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 space-y-1">
                        <div className="flex items-center justify-between gap-3 text-xs">
                          <code className="text-slate-600 dark:text-slate-300">
                            solve({tc.input.map((a) => JSON.stringify(a)).join(", ")})
                          </code>
                          <code className="text-emerald-600 dark:text-emerald-400 flex-shrink-0">
                            → {JSON.stringify(tc.expected)}
                          </code>
                        </div>
                        {tc.explanation && (
                          <p className="text-[11px] text-slate-400 dark:text-slate-500 leading-relaxed">
                            💡 {tc.explanation}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {tab === "result" && (
                  <div className="space-y-4">
                    {!results ? (
                      <p className="text-sm text-slate-400">Run your code to see results here.</p>
                    ) : (
                      <>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-slate-400 font-mono">test results</span>
                          <span className={`text-sm font-bold ${score.score === 100 ? "text-emerald-500" : score.score >= 50 ? "text-amber-500" : "text-red-500"}`}>
                            {score.passed}/{score.total} passed — {score.score}%
                          </span>
                        </div>
                        <div className="bg-[#0d1117] rounded-xl p-4 font-mono text-sm space-y-2">
                          {results.map((r, i) => <ResultRow key={i} r={r} i={i} />)}
                        </div>
                        <div>
                          {!modelAnswer ? (
                            <button
                              onClick={reveal}
                              disabled={revealing}
                              className="text-sm font-semibold text-indigo-500 hover:text-indigo-600 disabled:opacity-50"
                            >
                              {revealing ? "Loading…" : "🤖 Reveal AI Answer"}
                            </button>
                          ) : (
                            <div className="space-y-2">
                              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">AI Model Answer</p>
                              <pre className="text-xs bg-[#0d1117] text-emerald-300 rounded-lg p-3 overflow-x-auto whitespace-pre-wrap">{modelAnswer}</pre>
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Right: Code panel */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2.5 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-red-400" />
                  <span className="w-3 h-3 rounded-full bg-yellow-400" />
                  <span className="w-3 h-3 rounded-full bg-green-400" />
                  <span className="ml-3 text-xs text-slate-500 dark:text-slate-400 font-mono">solution.js</span>
                </div>
                <button
                  onClick={runTests}
                  disabled={submitting || !code.trim()}
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold rounded-lg transition-colors"
                >
                  {submitting ? "Running…" : "▶ Run Tests"}
                </button>
              </div>
              <div className="bg-[#0d1117] flex-1">
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Tab") {
                      e.preventDefault();
                      const s = e.target.selectionStart;
                      setCode(code.slice(0, s) + "  " + code.slice(e.target.selectionEnd));
                      setTimeout(() => e.target.setSelectionRange(s + 2, s + 2), 0);
                    }
                  }}
                  spellCheck={false}
                  className="w-full h-full min-h-[320px] p-4 bg-transparent text-emerald-300 font-mono text-sm leading-relaxed outline-none resize-none"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
