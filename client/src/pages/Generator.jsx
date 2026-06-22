import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import api from "../api/axios";
import AnswerBlock from "../components/AnswerBlock";

const CATEGORIES = ["HTML/CSS", "JavaScript", "React", "Next.js", "React Native"];
const LEVELS = ["Low", "Medium", "High"];
const TYPES = ["Technical", "Coding"];
const COUNTS = [1, 3, 5, 10];

// ─── Shared selector ────────────────────────────────────────────────────────
function Selector({ label, options, value, onChange, multi = false, wide = false }) {
  const isSelected = (o) => multi ? value.includes(o) : value === o;
  const handleClick = (o) => {
    if (!multi) { onChange(o); return; }
    onChange(isSelected(o) ? value.filter(x => x !== o) : [...value, o]);
  };
  return (
    <div>
      <label className="text-xs font-medium text-slate-500 dark:text-slate-400">
        {label}{multi && value.length > 0 && <span className="ml-1.5 text-indigo-500">({value.length} selected)</span>}
      </label>
      <div className="flex flex-wrap gap-2 mt-2">
        {options.map((o) => (
          <button
            key={o}
            onClick={() => handleClick(o)}
            className={`${wide ? "px-4" : "px-3"} py-1.5 rounded-full text-sm border transition ${
              isSelected(o)
                ? "bg-indigo-600 text-white border-indigo-600 font-medium"
                : "border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/10"
            }`}
          >
            {o === "Technical" ? "🧩 Technical" : o === "Coding" ? "💻 Coding" : o}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Usage meter ─────────────────────────────────────────────────────────────
function UsageMeter({ usage }) {
  if (!usage) return null;
  const pct = Math.min(100, (usage.used / usage.limit) * 100);
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <span>AI questions used today</span>
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
        <p className="text-xs text-amber-400">Only {usage.remaining} AI question{usage.remaining !== 1 ? "s" : ""} left today.</p>
      )}
    </div>
  );
}

// ─── Preview card ─────────────────────────────────────────────────────────────
function PreviewCard({ q, idx, onUpdate, onPost, editingIndex, setEditingIndex, isPosting }) {
  return (
    <motion.div
      key={idx}
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-5 space-y-3"
    >
      {editingIndex === idx ? (
        <>
          <textarea
            value={q.question}
            onChange={(e) => onUpdate(idx, { question: e.target.value })}
            className="input-light text-sm resize-none"
            rows={3}
          />
          <textarea
            value={q.answer}
            onChange={(e) => onUpdate(idx, { answer: e.target.value })}
            className="input-light text-sm font-mono resize-none"
            rows={5}
            placeholder="Answer"
          />
          <input
            value={q.tags?.join(", ")}
            onChange={(e) =>
              onUpdate(idx, { tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean) })
            }
            className="input-light text-sm"
            placeholder="Tags (comma separated)"
          />
          <button
            onClick={() => setEditingIndex(null)}
            className="text-xs px-3 py-1.5 rounded-full bg-cyan-500 text-slate-900 font-medium"
          >
            Done editing
          </button>
        </>
      ) : (
        <>
          <span className="text-[11px] self-start px-2 py-0.5 rounded-md bg-purple-100 text-purple-700 dark:bg-purple-500/15 dark:text-purple-300 font-medium border border-purple-200 dark:border-purple-500/30">
            {q.type === "Coding" ? "💻 Coding" : "🧩 Technical"}
          </span>
          <p className="font-semibold leading-snug text-slate-800 dark:text-slate-100">{q.question}</p>
          <button
            onClick={() => onUpdate(idx, { revealed: !q.revealed })}
            className="text-xs text-indigo-600 dark:text-cyan-300 font-medium self-start hover:underline"
          >
            {q.revealed ? "Hide answer ▲" : "Reveal answer ▼"}
          </button>
          <AnimatePresence initial={false}>
            {q.revealed && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.22, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-xl p-3 space-y-2">
                  <AnswerBlock text={q.answer} questionType={q.type} />
                  {q.hints?.length > 0 && (
                    <ul className="mt-1 text-xs text-slate-600 dark:text-slate-400 list-disc list-inside space-y-0.5">
                      {q.hints.map((h, i) => <li key={i}>{h}</li>)}
                    </ul>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          {q.tags?.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {q.tags.map((t, i) => (
                <span key={i} className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-300 border border-slate-200 dark:border-white/10">
                  #{t}
                </span>
              ))}
            </div>
          )}
        </>
      )}
      <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-white/10">
        <button
          onClick={() => setEditingIndex(editingIndex === idx ? null : idx)}
          className="text-xs px-3 py-1.5 rounded-full border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/10"
        >
          ✏️ Edit
        </button>
        <button
          onClick={() => onPost(idx, "draft")}
          disabled={!!isPosting}
          className="text-xs px-3 py-1.5 rounded-full border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/10 disabled:opacity-50 flex items-center gap-1"
        >
          {isPosting === "draft" ? <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg> : "💾"} Save Draft
        </button>
        <button
          onClick={() => onPost(idx, "published")}
          disabled={!!isPosting}
          className="ml-auto text-xs px-4 py-1.5 rounded-full bg-cyan-500 text-slate-900 font-semibold hover:bg-cyan-400 disabled:opacity-60 flex items-center gap-1.5"
        >
          {isPosting === "published" ? <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg> : "📤"} {isPosting === "published" ? "Posting…" : "Post to Community"}
        </button>
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
export default function Generator() {
  const [mode, setMode] = useState("ai"); // "ai" | "own" | "helper"

  // shared
  const [category, setCategory] = useState([]);
  const [level, setLevel] = useState(LEVELS[0]);
  const [type, setType] = useState(TYPES[0]);
  const [usage, setUsage] = useState(null);
  const [dailyPost, setDailyPost] = useState(null);
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [source, setSource] = useState(null);

  // ai-generate mode
  const [count, setCount] = useState(3);

  // write-your-own mode
  const [ownQuestion, setOwnQuestion] = useState("");
  const [charCount, setCharCount] = useState(0);

  // ai-helper / text-tools mode
  const [helperInput, setHelperInput] = useState("");
  const [helperAction, setHelperAction] = useState("improve");
  const [helperResult, setHelperResult] = useState("");
  const [helperLoading, setHelperLoading] = useState(false);

  useEffect(() => {
    api.get("/questions/generate/usage").then(({ data }) => setUsage(data)).catch(() => {});
    api.get("/questions/daily-status").then(({ data }) => setDailyPost(data)).catch(() => {});
  }, []);

  const syncUsage = (data) => {
    if (data.used !== undefined) setUsage({ used: data.used, limit: data.limit, remaining: data.remaining });
  };

  const handleLimitError = (err) => {
    if (err.response?.status === 429) {
      toast.error(err.response.data.message, { duration: 6000 });
      setUsage({ used: err.response.data.used, limit: err.response.data.limit, remaining: 0 });
    } else {
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };

  // ── Mode: AI Generate ──────────────────────────────────────────────────────
  const generateAI = async () => {
    setLoading(true);
    setQuestions([]);
    try {
      const { data } = await api.post("/questions/generate", { category: category.length === 1 ? category[0] : category.length > 1 ? category.join(",") : "", level, type, count });
      setQuestions(data.questions.map((q) => ({ ...q, revealed: false })));
      setSource(data.source);
      syncUsage(data);
      if (data.source === "fallback") {
        toast("Showing sample questions — AI is temporarily offline", { icon: "⚠️", duration: 6000 });
      } else {
        toast.success("Questions generated!");
      }
    } catch (err) {
      handleLimitError(err);
    } finally {
      setLoading(false);
    }
  };

  // ── Mode: Write Your Own ───────────────────────────────────────────────────
  const generateOwnAnswer = async () => {
    if (ownQuestion.trim().length < 10) {
      toast.error("Please write a question of at least 10 characters.");
      return;
    }
    setLoading(true);
    setQuestions([]);
    try {
      const { data } = await api.post("/questions/generate/answer", {
        question: ownQuestion.trim(),
        category: category.length > 0 ? category[0] : CATEGORIES[0],
        level,
        type,
      });
      if (data.source === "fallback" || !data.answer) {
        toast.error("AI couldn't generate an answer. Check your question or try again.");
        return;
      }
      setQuestions([{ question: ownQuestion.trim(), answer: data.answer, hints: data.hints || [], tags: data.tags || [], type, revealed: false }]);
      setSource(data.source);
      syncUsage(data);
      toast.success("Answer generated!");
    } catch (err) {
      handleLimitError(err);
    } finally {
      setLoading(false);
    }
  };

  const updateQuestion = (idx, patch) =>
    setQuestions((qs) => qs.map((q, i) => (i === idx ? { ...q, ...patch } : q)));

  const [posting, setPosting] = useState({});

  const postQuestion = async (idx, status) => {
    const q = questions[idx];
    setPosting(p => ({ ...p, [idx]: status }));
    try {
      const cat = category.length > 0 ? category[0] : CATEGORIES[0];
      await api.post("/questions", { category: cat, level, type, question: q.question, answer: q.answer, hints: q.hints, tags: q.tags, status });
      toast.success(status === "draft" ? "Saved as draft" : "Posted to community!");
      setQuestions((qs) => qs.filter((_, i) => i !== idx));
      api.get("/questions/daily-status").then(({ data }) => setDailyPost(data)).catch(() => {});
    } catch (err) {
      const detail = err.response?.data?.detail || err.response?.data?.message || "Failed to post";
      if (err.response?.status === 429) toast.error(detail, { duration: 8000 });
      else toast.error(detail);
    } finally {
      setPosting(p => { const n = { ...p }; delete n[idx]; return n; });
    }
  };

  // AI text tools
  const runHelper = async () => {
    if (!helperInput.trim()) return;
    setHelperLoading(true);
    setHelperResult("");
    try {
      const { data } = await api.post("/questions/ai-helper", { input: helperInput.trim(), action: helperAction });
      setHelperResult(data.result || data.question || "");
    } catch {
      toast.error("AI helper failed. Try again.");
    } finally {
      setHelperLoading(false);
    }
  };

  const useHelperResult = () => {
    setOwnQuestion(helperResult);
    setMode("own");
    setHelperResult("");
    setHelperInput("");
    toast.success("Question copied to Write mode — generate an answer or post it!");
  };

  const isLimited = usage?.remaining === 0;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">✨ AI Question Generator</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Generate questions with AI or write your own and let AI craft the answer.
        </p>
      </div>

      {/* Daily post limit banner */}
      {!dailyPost && (
        <div className="h-12 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />
      )}
      {dailyPost && (
        <div className={`flex items-center gap-3 p-3 rounded-xl border text-sm ${
          dailyPost.remaining === 0
            ? "border-red-300/50 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400"
            : dailyPost.remaining <= 3
            ? "border-amber-300/50 bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400"
            : "border-green-300/50 bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400"
        }`}>
          <span className="text-base">{dailyPost.remaining === 0 ? "🚫" : "📝"}</span>
          <span>
            <strong>Daily posts:</strong> {dailyPost.used} / {dailyPost.limit} used
            {dailyPost.remaining === 0
              ? " — limit reached, contact admin to increase"
              : ` — ${dailyPost.remaining} remaining today`}
          </span>
        </div>
      )}

      {/* Mode toggle */}
      <div className="flex gap-1 p-1 rounded-xl bg-slate-200/70 dark:bg-white/5 w-fit flex-wrap">
        {[
          { key: "ai",     label: "🤖 AI Generate" },
          { key: "own",    label: "✍️ Write Your Own" },
          { key: "helper", label: "🛠️ AI Text Tools" },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => { setMode(key); setQuestions([]); setSource(null); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              mode === key
                ? "bg-white dark:bg-white/15 shadow text-slate-900 dark:text-white"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="glass-card p-6 space-y-5">
        {/* Shared selectors — hidden in helper mode */}
        {mode !== "helper" && (
          <>
            <Selector label="Category" options={CATEGORIES} value={category} onChange={setCategory} multi />
            <Selector label="Level" options={LEVELS} value={level} onChange={setLevel} />
            <Selector label="Question Type" options={TYPES} value={type} onChange={setType} />
          </>
        )}

        {/* AI Generate extras */}
        {mode === "ai" && (
          <div>
            <label className="text-xs font-medium text-slate-500 dark:text-slate-400">Count</label>
            <div className="flex flex-wrap gap-2 mt-2">
              {COUNTS.map((n) => (
                <button
                  key={n}
                  onClick={() => setCount(n)}
                  className={`w-10 h-10 rounded-full text-sm border transition ${
                    count === n
                      ? "bg-indigo-600 text-white border-indigo-600 font-medium"
                      : "border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/10"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Write Your Own textarea */}
        {mode === "own" && (
          <div>
            <label className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Your Question
            </label>
            <div className="relative mt-2">
              <textarea
                value={ownQuestion}
                onChange={(e) => { setOwnQuestion(e.target.value); setCharCount(e.target.value.length); }}
                rows={6}
                placeholder={`Write your question here...\n\nExample:\nCreate a function that accepts a string and returns it with all spaces replaced by %20.`}
                className="input-light text-sm leading-relaxed resize-none"
              />
              <span className="absolute bottom-3 right-3 text-[11px] text-slate-500">
                {charCount} chars
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5">
              Be as detailed as you like — constraints, examples, edge cases all help AI write a better answer.
            </p>
          </div>
        )}

        {/* AI Text Tools mode */}
        {mode === "helper" && (
          <div className="space-y-4">
            {/* Action selector */}
            <div>
              <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2 block">Choose action</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { key: "improve",   icon: "✏️", label: "Improve",   desc: "Write or fix a question" },
                  { key: "summarize", icon: "📝", label: "Summarize", desc: "Condense into 2-4 sentences" },
                  { key: "correct",   icon: "🔧", label: "Correct",   desc: "Fix grammar & clarity" },
                  { key: "explain",   icon: "💡", label: "Explain",   desc: "Simplify for beginners" },
                ].map(({ key, icon, label, desc }) => (
                  <button
                    key={key}
                    onClick={() => { setHelperAction(key); setHelperResult(""); }}
                    className={`flex flex-col items-start gap-0.5 p-3 rounded-xl border text-left transition ${
                      helperAction === key
                        ? "border-indigo-400 dark:border-indigo-500 bg-indigo-50 dark:bg-indigo-500/15"
                        : "border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5"
                    }`}
                  >
                    <span className="text-lg">{icon}</span>
                    <span className={`text-sm font-semibold ${helperAction === key ? "text-indigo-600 dark:text-indigo-300" : "text-slate-700 dark:text-slate-200"}`}>{label}</span>
                    <span className="text-[10px] text-slate-400 leading-tight">{desc}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-500 dark:text-slate-400">
                {helperAction === "improve"   && "Topic or rough question"}
                {helperAction === "summarize" && "Text to summarize"}
                {helperAction === "correct"   && "Text to correct"}
                {helperAction === "explain"   && "Concept or question to explain"}
              </label>
              <textarea
                value={helperInput}
                onChange={e => setHelperInput(e.target.value)}
                rows={4}
                placeholder={
                  helperAction === "improve"   ? "e.g. write a question about describing for loop in JS" :
                  helperAction === "summarize" ? "Paste any question, answer, or paragraph here…" :
                  helperAction === "correct"   ? "What is difference of var let const? Explain event bubling." :
                  "e.g. What is closure? / Explain useEffect hook…"
                }
                className="input-light text-sm leading-relaxed resize-none mt-2"
                maxLength={2000}
              />
              <p className="text-xs text-slate-400 mt-1">{helperInput.length}/2000</p>
            </div>

            <button
              onClick={runHelper}
              disabled={helperLoading || !helperInput.trim()}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-500 text-white font-semibold text-sm hover:opacity-90 transition disabled:opacity-50"
            >
              {helperLoading ? "✨ Thinking…" : `✨ ${helperAction === "improve" ? "Write / Fix Question" : helperAction.charAt(0).toUpperCase() + helperAction.slice(1)}`}
            </button>

            <AnimatePresence>
              {helperResult && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="p-4 rounded-xl border border-indigo-200 dark:border-indigo-500/30 bg-indigo-50 dark:bg-indigo-500/10 space-y-3"
                >
                  <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-300 uppercase tracking-wide">
                    {helperAction === "improve" ? "AI Question" : helperAction === "summarize" ? "Summary" : helperAction === "correct" ? "Corrected" : "Explanation"}
                  </p>
                  <p className="text-sm text-slate-800 dark:text-slate-100 leading-relaxed whitespace-pre-wrap">{helperResult}</p>
                  <div className="flex gap-2 flex-wrap">
                    {helperAction === "improve" && (
                      <button
                        onClick={useHelperResult}
                        className="text-xs px-4 py-2 rounded-xl bg-indigo-500 text-white font-semibold hover:bg-indigo-600 transition"
                      >
                        ✅ Use this → Write Your Own
                      </button>
                    )}
                    <button
                      onClick={() => navigator.clipboard?.writeText(helperResult).then(() => toast.success("Copied!"))}
                      className="text-xs px-4 py-2 rounded-xl border border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/10 transition"
                    >
                      📋 Copy
                    </button>
                    <button
                      onClick={() => { setHelperResult(""); }}
                      className="text-xs px-4 py-2 rounded-xl border border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/10 transition"
                    >
                      ✕ Clear
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {mode !== "helper" && (
          <>
            <UsageMeter usage={usage} />
            <button
              onClick={mode === "ai" ? generateAI : generateOwnAnswer}
              disabled={loading || isLimited}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold text-sm hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? mode === "own" ? "Generating answer…" : "Generating…"
                : isLimited
                ? "🚫 Daily AI Limit Reached"
                : mode === "own"
                ? "🧠 Generate Answer with AI"
                : "🚀 Generate Questions"}
            </button>
            {source === "fallback" && (
              <p className="text-xs text-amber-400">
                ⚠️ AI unavailable — <code className="bg-black/30 px-1 rounded">ollama serve</code> or set GROQ_API_KEY.
              </p>
            )}
          </>
        )}
      </div>

      {/* Preview */}
      <AnimatePresence>
        {questions.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
            <h2 className="font-semibold">Preview ({questions.length})</h2>
            {questions.map((q, idx) => (
              <PreviewCard
                key={idx}
                q={q}
                idx={idx}
                onUpdate={updateQuestion}
                onPost={postQuestion}
                editingIndex={editingIndex}
                setEditingIndex={setEditingIndex}
                isPosting={posting[idx]}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
