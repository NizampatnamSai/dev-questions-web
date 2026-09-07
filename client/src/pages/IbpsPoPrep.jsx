import { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { loadTopicsForCategory } from "../data/studyTopicsLoader";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import mockTestData from "../data/ibpspo-mock-test.json";
import pyqData from "../data/ibpspo-pyq.json";
import { ENGLISH_RULES, QUANT_FORMULAS, REASONING_RULES } from "../data/ibpspo-formulas";
import {
  RRB_OVERVIEW, RRB_PRELIMS, RRB_MAINS, RRB_SYLLABUS,
  RRB_VS_IBPS_PO, RRB_KEY_FACTS, RRB_STRATEGY,
} from "../data/ibps-rrb-po";
import { PO_CUTOFFS, RRB_AP_CUTOFFS, CUTOFF_READING } from "../data/ibps-cutoffs";
import { CADRE_GUIDE, VACANCY_NOTES } from "../data/bank-vacancies";
import bundledVacancies from "../data/vacancies.json";
import { loadPaperQuestions } from "../data/pyqLoader";
import ConfirmModal from "../components/ConfirmModal";
import useConfirm from "../hooks/useConfirm";

// Official IBPS PO Prelims 2026 pattern: 100 questions / 100 marks / 60 minutes,
// with 20 minutes of sectional timing per section (sections are attempted in
// order and cannot be revisited once their window closes).
// perQuestion = section marks / questions, rounded to 2dp so the three sections
// still total exactly 100. negative = one fourth of that question's own marks,
// which is the IBPS rule (not a flat -0.25 across the paper).
const SECTION_PLAN = [
  { name: "English Language",      questions: 30, marks: 30, seconds: 20 * 60,
    perQuestion: 1.0,  negative: -0.25,  medium: "English",
    topics: "Reading Comprehension, Cloze Test, Para Jumbles, Error Spotting, Sentence Improvement, Fillers, Word Swap" },
  { name: "Quantitative Aptitude", questions: 35, marks: 30, seconds: 20 * 60,
    perQuestion: 0.86, negative: -0.215, medium: "English and Hindi",
    topics: "Data Interpretation, Approximation, Number Series, Quadratic Equations, Arithmetic word problems" },
  { name: "Reasoning Ability",     questions: 35, marks: 40, seconds: 20 * 60,
    perQuestion: 1.14, negative: -0.285, medium: "English and Hindi",
    topics: "Puzzles & Seating Arrangement, Syllogism, Inequalities, Blood Relations, Direction Sense, Coding-Decoding, Order & Ranking" },
];

// IBPS RRB PO Officer Scale I prelims — a DIFFERENT profile, not a variant:
// two sections of 40, no English, unequal windows (25 min then 20), and a flat
// 1 mark with a flat -0.25 rather than IBPS's per-section weighting.
const RRB_SECTION_PLAN = [
  { name: "Reasoning Ability",     questions: 40, marks: 40, seconds: 25 * 60,
    perQuestion: 1.0, negative: -0.25, medium: "English and Hindi",
    topics: "Puzzles & Seating Arrangement, Syllogism, Inequalities, Coding-Decoding, Blood Relations, Direction Sense, Order & Ranking" },
  { name: "Quantitative Aptitude", questions: 40, marks: 40, seconds: 20 * 60,
    perQuestion: 1.0, negative: -0.25, medium: "English and Hindi",
    topics: "Data Interpretation, Simplification, Number Series, Quadratic Equations, Arithmetic word problems" },
];

// One profile per exam. The mock engine reads the ACTIVE profile rather than a
// module-level constant, so a paper carries its own section list, timings and
// marking — an RRB paper run against the IBPS plan would give its two sections
// 20 minutes each and weight the marks wrongly.
// Tabs that render their own static content and have no study-topic module
// behind them. Kept as one list because it is consulted in two places — the
// loader guard and the sub-category strip — and a tab added to only one of them
// renders an empty topic list or a stray filter bar.
const STATIC_TABS = new Set(["pattern", "formulas", "rrb", "cutoffs", "vacancies"]);

const EXAM_PROFILES = {
  ibps: { id: "ibps", label: "IBPS PO", plan: SECTION_PLAN },
  rrb:  { id: "rrb",  label: "IBPS RRB PO", plan: RRB_SECTION_PLAN },
};

// Per-section attack plan. Weights are the typical question counts seen in recent
// IBPS PO Prelims papers, which is what should drive both preparation and the
// order you attempt things in during the 20-minute window.
const SECTION_STRATEGY = {
  "English Language": {
    target: "22–25 attempts at 85%+ accuracy",
    weights: [
      { topic: "Reading Comprehension", qs: "8–10", note: "Highest weight, but slowest. Leave it for last unless the passage is familiar." },
      { topic: "Cloze Test", qs: "5–6", note: "One passage, several blanks. High reward for the time spent." },
      { topic: "Error Spotting / Sentence Improvement", qs: "5", note: "Pure rules. Fastest marks in the section." },
      { topic: "Para Jumble", qs: "4–5", note: "Find the opener and one mandatory pair, then eliminate." },
      { topic: "Fillers & Word Swap", qs: "5", note: "Collocation-driven. Attempt first — often under 30 seconds each." },
    ],
    order: [
      "Fillers and Word Swap first — 3 min",
      "Error Spotting and Sentence Improvement — 4 min",
      "Cloze Test as one block — 4 min",
      "Para Jumble — 3 min",
      "Reading Comprehension last — 6 min",
    ],
    rule: "Never open the section with a dense RC passage. If you burn 8 minutes there and it goes badly, the 20 easy marks behind it are gone.",
  },
  "Quantitative Aptitude": {
    target: "20–24 attempts at 85%+ accuracy",
    weights: [
      { topic: "Data Interpretation", qs: "10–15", note: "Two or three sets. The single biggest block — but pick your set carefully." },
      { topic: "Approximation / Simplification", qs: "5–6", note: "Fastest marks in the paper. Always attempt all of them." },
      { topic: "Number Series", qs: "5", note: "Look at all five. 20-second rule: pattern visible, solve it; not visible, mark it and come back — do not abandon the question, only the attempt." },
      { topic: "Quadratic Equations", qs: "0–5", note: "Mechanical once factorising is fluent." },
      { topic: "Arithmetic word problems", qs: "8–10", note: "Mixed topics. Cherry-pick single-concept ones." },
    ],
    order: [
      "Approximation — 3 min",
      "Quadratic Equations — 2 min",
      "Number Series, 20-second rule on each — 2 min",
      "Cleanest DI set, hard stop at 5 minutes — 5 min",
      "Arithmetic singles you recognise — 5 min",
      "Second DI set, or revisit what you marked — 3 min",
    ],
    rule: "Scan every DI set for 30 seconds before starting one — a tabular set with direct values takes half the time of a caselet with missing figures worth the same marks. Then hold a hard stop: if the chosen set is not finished at 5 minutes, leave it and take the arithmetic. Swap steps 4 and 5 if DI is your weak area — but do not push DI past step 5, because 10–15 marks cannot be recovered in the last three minutes.",
  },
  "Reasoning Ability": {
    target: "24–28 attempts at 90%+ accuracy",
    weights: [
      { topic: "Puzzles & Seating Arrangement", qs: "20–25", note: "Dominates the section. You cannot clear the cut-off by skipping these." },
      { topic: "Inequalities", qs: "3", note: "Near-free marks. Do them first, every time." },
      { topic: "Syllogism", qs: "3", note: "Fast once the combination table is memorised." },
      { topic: "Blood Relations / Direction / Ranking", qs: "4–6", note: "Standalone and quick — bank them before the puzzles." },
      { topic: "Coding-Decoding, Alphanumeric", qs: "2–4", note: "Attempt only if the rule is visible immediately." },
    ],
    order: [
      "Inequalities — 2 min",
      "Syllogism — 2 min",
      "Blood Relations, Direction, Ranking, Coding — 4 min",
      "Easiest puzzle set (most absolute clues) — 4 min",
      "Second puzzle set — 4 min",
      "Third puzzle set only if 4+ min remain — 4 min",
    ],
    rule: "Rank the puzzle sets before solving any: a set opening with two absolute clues (an extreme end, a fixed floor, 'sits opposite') resolves far faster than one built entirely on relative clues.",
  },
};

const EXAM_RULES = [
  { icon: "⏳", title: "The 30-second rule",
    body: "If you cannot see the route to the answer within 30 seconds, leave it and move on. The question will still be there if time remains — your 20 minutes will not be." },
  { icon: "🚫", title: "Never chase sunk cost",
    body: "Three minutes into a puzzle that is not resolving, abandon it. The minutes already spent are gone either way; the only question is whether you spend more." },
  { icon: "🎯", title: "Accuracy over volume",
    body: "With negative marking, four careless wrong answers wipe out a correct one. 22 attempts at 90% beats 30 attempts at 70% in every section." },
  { icon: "🔍", title: "Scan before you start",
    body: "Spend the first 30 seconds of each section reading what is on offer, not answering. Choosing the right set is worth more than solving faster." },
  { icon: "⛔", title: "Watch the clock at the end",
    body: "Do not begin a new puzzle or DI set with under 4 minutes left. A half-solved set scores zero and costs the standalone questions you could have banked." },
  { icon: "✅", title: "Guess only when you have narrowed it",
    body: "A blind guess is negative expected value. Eliminating two options first makes it positive — that is the only time to guess." },
];

// Previous-cycle cut-offs. These are the OVERALL prelims cut-offs out of 100,
// reported category-wise on an all-India basis (state-wise allotment happens
// later, at the final stage). Figures are as widely reported for each cycle —
// always confirm against your own IBPS scorecard, since IBPS revises and
// normalises scores and cut-offs move every year with paper difficulty.
const CUTOFF_CATEGORIES = [
  { key: "gen", label: "General / UR", alias: "OC" },
  { key: "ews", label: "EWS", alias: null },
  { key: "obc", label: "OBC", alias: "BC" },
  { key: "sc", label: "SC", alias: null },
  { key: "st", label: "ST", alias: null },
];

// `disputed` marks cells where the reported figures differ between sources, so
// the number is shown with a dagger rather than as settled fact.
const CUTOFF_HISTORY = [
  { year: "2025", gen: 49.21, ews: 49.21, obc: 49.21, sc: 45.96, st: 40.96, disputed: [] },
  { year: "2024", gen: 48.5,  ews: 48.5,  obc: 48.5,  sc: 48.0,  st: 41.0,  disputed: ["sc", "st"] },
  { year: "2023", gen: 54.25, ews: 54.25, obc: 54.25, sc: 49.0,  st: 43.0,  disputed: ["sc"] },
];

// Indicative only. IBPS applies sectional qualification, but does not publish a
// clean per-section figure each cycle the way it does the overall cut-off, so
// these are coaching-reported estimates rather than confirmed numbers.
const SECTIONAL_CUTOFF_ESTIMATE = {
  "English Language": 13.25,
  "Quantitative Aptitude": 6.25,
  "Reasoning Ability": 9.75,
};

// "8–10" / "20–25" / "5" -> the upper bound, used to scale the weight bars.
function weightUpperBound(w) {
  const nums = String(w.qs).match(/\d+/g);
  return nums ? Math.max(...nums.map(Number)) : 0;
}

// "Approximation — 3 min" -> ["Approximation", "3 min"], so the time budget can
// sit in its own right-hand column instead of trailing the sentence.
function splitStep(step) {
  const i = String(step).lastIndexOf("—");
  if (i === -1) return [step, null];
  return [step.slice(0, i).trim(), step.slice(i + 1).trim()];
}

// Flatten the whole pattern + strategy into one context blob so the Ask-AI panel
// answers from what is actually on this page rather than from general knowledge.
function buildStrategyContext() {
  const pattern = SECTION_PLAN.map(
    (s) => `${s.name}: ${s.questions} questions, ${s.marks} marks, ${s.seconds / 60} min, ` +
           `${s.perQuestion} marks per question, ${s.negative} negative per wrong answer. Topics: ${s.topics}`
  ).join("\n");

  const strategy = Object.entries(SECTION_STRATEGY).map(([name, st]) =>
    `${name} — target ${st.target}\n` +
    `  Topic weight: ${st.weights.map((w) => `${w.topic} (${w.qs} Qs) — ${w.note}`).join("; ")}\n` +
    `  Order of attempt: ${st.order.join(" -> ")}\n` +
    `  Key rule: ${st.rule}`
  ).join("\n\n");

  const rules = EXAM_RULES.map((r) => `${r.title}: ${r.body}`).join("\n");

  const cutoffs = CUTOFF_HISTORY.map(
    (r) => `${r.year} — General/EWS/OBC ${r.gen}, SC ${r.sc ?? "n/a"}, ST ${r.st ?? "n/a"} (out of ${TOTAL_MARKS})`
  ).join("\n");

  return (
    `EXAM PATTERN (total ${TOTAL_QUESTIONS} questions, ${TOTAL_MARKS} marks, ${TOTAL_MINUTES} minutes, ` +
    `sectional timing of ${SECTION_PLAN[0].seconds / 60} minutes per section, attempted in order and not revisitable):\n${pattern}\n\n` +
    `SECTION STRATEGY:\n${strategy}\n\n` +
    `IN-EXAM SELECTION RULES:\n${rules}\n\n` +
    `PREVIOUS-YEAR OVERALL CUT-OFFS:\n${cutoffs}\n` +
    `Note: prelims is qualifying only; sectional figures are indicative, not officially published per cycle.`
  );
}

const SECTION_NAMES = SECTION_PLAN.map((s) => s.name);
// Sections present in a given question set, in official order. Used to scope an
// attempt to what the paper actually contains — see examPlan below.
function planFor(questions, plan = SECTION_PLAN) {
  const present = plan.filter((s) => questions.some((q) => q.section === s.name));
  return present.length ? present : plan;
}
const TOTAL_QUESTIONS = SECTION_PLAN.reduce((n, s) => n + s.questions, 0);
const TOTAL_MARKS = SECTION_PLAN.reduce((n, s) => n + s.marks, 0);
const TOTAL_MINUTES = SECTION_PLAN.reduce((n, s) => n + s.seconds, 0) / 60;

// Real prelims weighting inside each section: Reasoning is dominated by puzzle
// sets and Quant by DI. Picking only by section count would let a paper come out
// as 35 standalone reasoning questions, which is nothing like the actual exam.
const GROUP_QUOTA = {
  "Reasoning Ability": { puzzle: 22, other: 13 },
  "Quantitative Aptitude": { di: 13, other: 22 },
  "English Language": { other: 30 },
};
const PUZZLE_RE = /Seating|Puzzle/i;
const DI_RE = /DI|Data Interpretation|Caselet|Pie Chart/i;
export function groupOf(q) {
  if (q.section === "Reasoning Ability") return PUZZLE_RE.test(q.topic || "") ? "puzzle" : "other";
  if (q.section === "Quantitative Aptitude") return DI_RE.test(q.topic || "") ? "di" : "other";
  return "other";
}

const shuffled = (arr) => {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

// Pick a correctly proportioned paper out of the bundled bank. Slicing the first
// N of a section-ordered file is what previously produced an all-English paper.
function pickFallbackPaper(bank) {
  const out = [];
  SECTION_PLAN.forEach((plan) => {
    const quota = GROUP_QUOTA[plan.name] || { other: plan.questions };
    const taken = [];
    Object.entries(quota).forEach(([group, n]) => {
      const pool = shuffled(bank.filter((q) => q.section === plan.name && groupOf(q) === group));
      taken.push(...pool.slice(0, n));
    });
    // if any group ran short, top up from anything else in the section
    if (taken.length < plan.questions) {
      const rest = shuffled(bank.filter((q) => q.section === plan.name && !taken.includes(q)));
      taken.push(...rest.slice(0, plan.questions - taken.length));
    }
    // Group a set's questions together AND keep the passage-bearing one first —
    // the clues/table live only on the first question of each set.
    taken.sort((a, b) => {
      const t = (a.topic || "").localeCompare(b.topic || "");
      if (t !== 0) return t;
      return (b.passage || b.table ? 1 : 0) - (a.passage || a.table ? 1 : 0);
    });
    out.push(...taken.slice(0, plan.questions));
  });
  return out;
}

// The rules sheet marks the operative word with **…**, because that word IS the
// point of the rule ("married **to**") and a wall of unemphasised text is
// useless to revise from.
function Emphasise({ text }) {
  return (
    <>
      {String(text).split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
        part.startsWith("**") && part.endsWith("**") ? (
          <strong key={i} className="font-bold text-amber-600 dark:text-amber-400">
            {part.slice(2, -2)}
          </strong>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

const DIFF_STYLES = {
  Basic: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
  Intermediate: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",
  Advanced: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  Tricky: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
};

// `max` matters: this was hardcoded to 15 (it began life as a study-topic
// difficulty dial) and then reused for a mock score out of 100, so every result
// drew a full green ring — 17.7 came out as 118% of the circle.
// The label uses fill, not a Tailwind text-* class: those set CSS `color`, which
// an SVG <text> ignores, so the number fell back to black on a dark background.
function ScoreRing({ score, max = 100, size = 80, label }) {
  const r = size / 2 - 8;
  const circ = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(1, max > 0 ? score / max : 0));
  const color = pct >= 0.6 ? "#22c55e" : pct >= 0.45 ? "#3b82f6" : pct >= 0.3 ? "#eab308" : "#ef4444";
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img"
      aria-label={`Score ${score.toFixed(2)} out of ${max}`}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth="7"
        className="stroke-slate-200 dark:stroke-slate-700" />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth="7"
        strokeDasharray={`${pct * circ} ${circ}`} strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`} />
      <text x="50%" y={label ? "44%" : "50%"} dominantBaseline="middle" textAnchor="middle"
        className="fill-slate-800 dark:fill-slate-100 font-bold"
        fontSize={size * 0.24}>{Number.isInteger(score) ? score : score.toFixed(1)}</text>
      {label && (
        <text x="50%" y="64%" dominantBaseline="middle" textAnchor="middle"
          className="fill-slate-400 dark:fill-slate-500 font-semibold" fontSize={size * 0.13}>
          {label}
        </text>
      )}
    </svg>
  );
}

// `seedQuestion` opens the panel straight on the chat tab with that question
// prefilled, so the suggested prompts on the strategy page are one click.
function AiPanel({ topic, category, onClose, seedQuestion = "" }) {
  const [mode, setMode] = useState(seedQuestion ? "ask" : "summary");
  const [summary, setSummary] = useState("");
  const [loadingSum, setLoadSum] = useState(false);
  const [question, setQuestion] = useState(seedQuestion);
  const [messages, setMessages] = useState([]);
  const [loadingAsk, setLoadAsk] = useState(false);
  const chatRef = useRef(null);

  // Only prefetch the summary when the panel actually opens on that tab —
  // opening straight into a seeded question should not burn an AI call.
  useEffect(() => {
    if (mode === "summary" && !summary && !loadingSum) fetchSummary();
  }, [mode]);

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
  const { confirm, confirmProps } = useConfirm();

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
  const [timeLeft, setTimeLeft] = useState(SECTION_PLAN[0].seconds); // remaining time in the CURRENT section
  const [sectionIdx, setSectionIdx] = useState(0);
  // The sections THIS attempt actually runs. A full paper has all three, but a
  // previous-year paper may be single-subject (the 2016–2019 papers are
  // published one subject at a time), and a paper is imported section by
  // section while it is being transcribed. Running the full plan regardless
  // left the missing section's 20-minute window with no questions in it, and
  // sectionBounds' "section not found" fallback then widened navigation to the
  // WHOLE paper — reopening sections that sectional timing had already closed.
  // Which exam the running attempt belongs to. Set when a paper is started;
  // the AI mock stays on the IBPS profile.
  const [examProfile, setExamProfile] = useState("ibps");
  const [mockExam, setMockExam] = useState("ibps");   // which exam the AI mock imitates
  const activePlan = EXAM_PROFILES[examProfile]?.plan || SECTION_PLAN;
  const examPlan = useMemo(() => planFor(examQuestions, activePlan), [examQuestions, activePlan]);
  const examSectionNames = useMemo(() => examPlan.map((s) => s.name), [examPlan]);
  const examSection = examSectionNames[sectionIdx] ?? examSectionNames[0];
  const timerRef = useRef(null);
  // Save/Load states
  const [savedTestId, setSavedTestId] = useState(null); // set when test was pre-saved
  const [savedTests, setSavedTests] = useState([]);
  const [loadingSavedTests, setLoadingSavedTests] = useState(false);
  const [savingTest, setSavingTest] = useState(false);
  const [pausing, setPausing] = useState(false);
  const [testMode, setTestMode] = useState("ai"); // ai | pyq
  const [formulaTab, setFormulaTab] = useState("quant"); // english | quant
  const [loadingPaperId, setLoadingPaperId] = useState(null); // PYQ paper being fetched
  // "all" = the full 60-minute paper; a section name = a 20-minute sectional
  // drill. Applies to both the AI mock and previous-year papers.
  const [examSectionChoice, setExamSectionChoice] = useState("all");
  const [paperTitle, setPaperTitle] = useState(null); // set when a PYQ paper is running
  const [showStrategyAi, setShowStrategyAi] = useState(false);
  const [strategySeed, setStrategySeed] = useState("");
  const [reviewMode, setReviewMode] = useState(false); // reading a finished attempt, not taking it
  const autoSaveCalledRef = useRef(false);

  // Load study topics on tab change
  useEffect(() => {
    if (activeTab === "mocktest") {
      setLoading(false);
      fetchSavedTests();
      return;
    }
    // Only prelims/mains/interview have a study-topic module behind them.
    // "pattern" and "formulas" render static content, so asking the loader for
    // an "ibpspo-formulas" category just resolves to an empty list.
    if (STATIC_TABS.has(activeTab)) {
      setLoading(false);
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

  // Move to the next section (or submit if this was the last one). Sectional
  // timing means a closed section can never be reopened.
  const advanceSection = () => {
    setSectionIdx((prev) => {
      const next = prev + 1;
      if (next >= examPlan.length) {
        submitExam();
        return prev;
      }
      const firstIdx = examQuestions.findIndex((q) => q.section === examSectionNames[next]);
      if (firstIdx !== -1) {
        setCurrentQIndex(firstIdx);
        handleVisited(examQuestions[firstIdx].id);
      }
      setTimeLeft(examPlan[next].seconds);
      toast(`${examSectionNames[next]} — ${formatTime(examPlan[next].seconds)} on the clock.`, { icon: "⏭️" });
      return next;
    });
  };

  // An attempt lives entirely in component state until it is paused or
  // submitted, so a stray back-gesture, tab close or refresh silently threw
  // away a paper someone might be 40 minutes into. The browser's own guard is
  // the only thing that can interrupt a navigation in time.
  useEffect(() => {
    if (!examStarted || examSubmitted) return undefined;
    const warn = (e) => {
      e.preventDefault();
      e.returnValue = ""; // Chrome requires this; the text itself is not shown
      return "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [examStarted, examSubmitted]);

  // Sectional countdown — 20 minutes per section, auto-advancing on expiry
  useEffect(() => {
    if (examStarted && !examSubmitted) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            advanceSection();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [examStarted, examSubmitted, sectionIdx, examQuestions]);

  // Step 1: Generate questions (does NOT start the exam yet)
  const generateQuestions = async () => {
    setGenerating(true);
    // A single-section drill is still an AI mock, but its history entry has to
    // say WHICH section — "Mock Test — 1 Aug" tells you nothing when half your
    // attempts are 20-minute English drills.
    // Which exam shape to generate. RRB is 40+40 across two sections with no
    // English, so the request has to say so — generating the IBPS mix and
    // relabelling it would produce a paper RRB never sets.
    const profile = EXAM_PROFILES[mockExam]?.plan || SECTION_PLAN;
    setExamProfile(mockExam);
    setPaperTitle(
      examSectionChoice === "all"
        ? (mockExam === "rrb" ? "IBPS RRB PO — AI Mock" : null)
        : `${examSectionChoice} — Sectional`,
    );
    try {
      const { data } = await api.post("/study/ibps-po/generate-mock", {
        count: examSectionChoice === "all"
          ? profile.reduce((n, x) => n + x.questions, 0)
          : (profile.find((x) => x.name === examSectionChoice) || { questions: 35 }).questions,
        section: examSectionChoice === "all" ? undefined : examSectionChoice,
        exam: mockExam,
      });
      if (data && data.questions && data.questions.length > 0) {
        setGeneratedQuestions(orderBySection(data.questions));
        setSavedTestId(null); // fresh generation, not yet saved
        toast.success(`${data.questions.length} questions generated! Start or save for later.`);
      } else {
        throw new Error("No questions returned");
      }
    } catch (err) {
      toast.error("AI generation failed. Loaded a paper from the offline bank.");
      // Honour the section choice in the fallback too — asking for a 20-minute
      // English drill and being handed a 60-minute full paper is not a fallback.
      const bank =
        examSectionChoice === "all"
          ? mockTestData.questions
          : mockTestData.questions.filter((q) => q.section === examSectionChoice);
      setGeneratedQuestions(orderBySection(pickFallbackPaper(bank)));
      setSavedTestId(null);
    } finally {
      setGenerating(false);
    }
  };

  // Paper METADATA only — name, year and per-section counts, enough to render
  // the cards. The questions are fetched by loadPaperQuestions when an attempt
  // starts; see pyqLoader.js for why they are not bundled here.
  // Papers now span three exams (IBPS PO, SBI PO, IBPS RRB PO), so the list is
  // filtered rather than shown as one undifferentiated run of 20 cards.
  const [paperExam, setPaperExam] = useState("all");
  const allPyqPapers = useMemo(() => pyqData.papers || [], []);
  const paperExamCounts = useMemo(() => {
    const c = { all: allPyqPapers.length };
    allPyqPapers.forEach((p) => {
      const k = p.id.startsWith("sbipo") ? "sbi" : p.exam || "ibps";
      c[k] = (c[k] || 0) + 1;
    });
    return c;
  }, [allPyqPapers]);
  const pyqPapers = useMemo(
    () =>
      paperExam === "all"
        ? allPyqPapers
        : allPyqPapers.filter(
            (p) => (p.id.startsWith("sbipo") ? "sbi" : p.exam || "ibps") === paperExam,
          ),
    [allPyqPapers, paperExam],
  );

  const startPyqPaper = async (paper) => {
    if (!paper.total) return toast.error("This paper has no questions loaded yet.");
    setLoadingPaperId(paper.id);
    try {
      const paperPlan = EXAM_PROFILES[paper.exam || "ibps"]?.plan || SECTION_PLAN;
      const all = await loadPaperQuestions(paper.id, paperPlan);
      // Sectional drill on a real paper — planFor() then runs it as a single
      // 20-minute section, so the same engine covers both without a second path.
      const questions =
        examSectionChoice === "all" ? all : all.filter((q) => q.section === examSectionChoice);
      if (!questions.length) {
        toast.error(`${paper.name} has no ${examSectionChoice} questions.`);
        return;
      }
      const title = examSectionChoice === "all" ? paper.name : `${paper.name} — ${examSectionChoice}`;
      // Adopt the paper's own exam profile BEFORE beginExam, so its sections get
      // the right windows (RRB is 25 + 20, not 20 + 20) and the right marking.
      setExamProfile(paper.exam || "ibps");
      setSavedTestId(null);
      setGeneratedQuestions([]);
      setPaperTitle(title);
      beginExam(questions);
      toast.success(`Started: ${title}`);
    } catch {
      toast.error("Could not load that paper. Please try again.");
    } finally {
      setLoadingPaperId(null);
    }
  };

  // A PYQ attempt should be identifiable in history, not just "Mock Test — <date>".
  const makeTestTitle = () => {
    const stamp = new Date().toLocaleDateString("en-IN", {
      day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
    });
    return paperTitle ? `${paperTitle} — ${stamp}` : `Mock Test — ${stamp}`;
  };

  // Questions must be grouped by section in the official order, whatever order
  // they arrive in, because sectional timing walks the list front to back.
  // Within a section, keep a SET together — a Data Interpretation or Reading
  // Comprehension set must be consecutive, because its table/passage lives only
  // on the first question. Tests saved before the server-side fix landed still
  // carry interleaved sets, so this repairs them on load too. Stable sort, so
  // anything without a topic keeps its original order.
  const groupSets = (qs) => {
    const order = new Map();
    qs.forEach((q, i) => {
      const key = (q.topic || "").trim().toLowerCase();
      if (!order.has(key)) order.set(key, i); // first appearance wins
    });
    return [...qs].sort((a, b) => {
      const ka = (a.topic || "").trim().toLowerCase();
      const kb = (b.topic || "").trim().toLowerCase();
      if (ka !== kb) return order.get(ka) - order.get(kb);
      const pa = a.passage || a.table ? 0 : 1;
      const pb = b.passage || b.table ? 0 : 1;
      return pa - pb;
    });
  };

  const orderBySection = (questions) =>
    SECTION_NAMES.flatMap((name) => groupSets(questions.filter((q) => q.section === name))).concat(
      questions.filter((q) => !SECTION_NAMES.includes(q.section))
    );

  // Step 2a: Begin the exam. Pass `progress` to resume a paused attempt at the
  // exact question, section and remaining sectional time it was left at.
  const beginExam = (rawQuestions, progress = null) => {
    const questions = orderBySection(rawQuestions);
    // Derived from the local list, not the examPlan memo — setExamQuestions has
    // not flushed yet at this point, so the memo still holds the PREVIOUS
    // attempt's plan.
    const plan = planFor(questions, activePlan);
    setExamQuestions(questions);
    setReviewMode(false);
    autoSaveCalledRef.current = false;
    if (progress) {
      const resumeIdx = Math.min(progress.sectionIdx || 0, plan.length - 1);
      setExamAnswers(progress.answers || {});
      setMarkedReview(new Set(progress.marked || []));
      setVisitedSet(new Set(progress.visited || [questions[0]?.id]));
      setCurrentQIndex(Math.min(progress.currentQIndex || 0, questions.length - 1));
      setSectionIdx(resumeIdx);
      setTimeLeft(progress.timeLeft > 0 ? progress.timeLeft : plan[resumeIdx].seconds);
    } else {
      setExamAnswers({});
      setMarkedReview(new Set());
      setVisitedSet(new Set([questions[0]?.id]));
      setCurrentQIndex(0);
      setSectionIdx(0);
      setTimeLeft(plan[0].seconds);
    }
    setExamStarted(true);
    setExamSubmitted(false);
  };

  // Pause: park the attempt so it can be picked up later. A test generated but
  // never saved has no id yet, so save it first and then attach the progress.
  const pauseExam = async () => {
    clearInterval(timerRef.current);
    setPausing(true);
    try {
      let id = savedTestId;
      if (!id) {
        const title = makeTestTitle();
        const { data } = await api.post("/study/ibps-po/mock-tests/save", { title, questions: examQuestions });
        id = data.id;
        setSavedTestId(id);
      }
      await api.post(`/study/ibps-po/mock-tests/${id}/pause`, {
        answers: examAnswers,
        sectionIdx,
        timeLeft,
        currentQIndex,
        marked: [...markedReview],
        visited: [...visitedSet],
      });
      setExamStarted(false);
      setExamSubmitted(false);
      fetchSavedTests();
      toast.success("Paused. Pick it up from 'My Saved Tests' whenever you're ready.");
    } catch {
      toast.error("Could not pause the test. Your progress is still on screen — try again.");
    } finally {
      setPausing(false);
    }
  };

  // Open a finished attempt read-only, with the answers that were given, so the
  // solutions and explanations can be reviewed.
  const viewSolutions = async (testId) => {
    try {
      const { data } = await api.get(`/study/ibps-po/mock-tests/${testId}`);
      if (!data.questions?.length) return toast.error("This test has no saved questions.");
      autoSaveCalledRef.current = true;   // never re-save a test we are only reading
      setSavedTestId(testId);
      setGeneratedQuestions([]);
      setExamQuestions(orderBySection(data.questions));
      setExamAnswers(data.answers || {});
      setReviewMode(true);
      setExamStarted(true);
      setExamSubmitted(true);
      toast.success("Showing your answers and the full solutions.");
    } catch {
      toast.error("Could not load the solutions.");
    }
  };

  // Step 2b: Save questions for later (without starting)
  const saveTestForLater = async (questions) => {
    setSavingTest(true);
    try {
      const title = makeTestTitle();
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

  // Load a saved test. A paused one resumes where it stopped; anything else
  // starts a clean attempt.
  const loadAndStartTest = async (testId, { resume = false } = {}) => {
    try {
      const { data } = await api.get(`/study/ibps-po/mock-tests/${testId}`);
      setSavedTestId(testId);
      setGeneratedQuestions([]);
      const progress = resume && data.status === "paused" ? data.progress : null;
      beginExam(data.questions, progress);
      toast.success(
        progress
          ? `Resumed: ${data.title} — ${SECTION_NAMES[progress.sectionIdx || 0]}, ${formatTime(progress.timeLeft || 0)} left`
          : `Loaded: ${data.title}`
      );
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
        const title = makeTestTitle();
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

  // Index range of the section currently open. Navigation is confined to it —
  // under sectional timing a candidate cannot wander into another section.
  const sectionBounds = useMemo(() => {
    const first = examQuestions.findIndex((q) => q.section === examSection);
    // Empty range, NOT the whole paper — a section with no questions must not
    // become a doorway back into the sections already closed.
    if (first === -1) return { first: 0, last: -1 };
    let last = first;
    while (last + 1 < examQuestions.length && examQuestions[last + 1].section === examSection) last++;
    return { first, last };
  }, [examQuestions, examSection]);

  const jumpToQuestion = (idx) => {
    const q = examQuestions[idx];
    if (!q || q.section !== examSection) return;
    setCurrentQIndex(idx);
    handleVisited(q.id);
  };

  const saveAndNext = () => {
    if (currentQIndex < sectionBounds.last) {
      jumpToQuestion(currentQIndex + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQIndex > sectionBounds.first) {
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
      // Marks differ per section (English 1.00, Quant 0.86, Reasoning 1.14) and
      // the penalty is one quarter of that question's own marks.
      const qMarks = typeof q.marks === "number" ? q.marks : 1.0;
      const qNeg = typeof q.negativeMarks === "number" ? Math.abs(q.negativeMarks) : qMarks / 4;
      if (isCorrect) {
        correct++;
        score += qMarks;
      } else if (!isSkipped) {
        wrong++;
        score -= qNeg;
      }
      return {
        ...q,
        studentAnswer: studentAns,
        status: isCorrect ? "Correct" : isSkipped ? "Skipped" : "Wrong",
      };
    });

    score = Math.round(score * 100) / 100; // fractional section marks would otherwise trail decimals

    const totalAttempted = correct + wrong;
    const accuracy = totalAttempted > 0 ? ((correct / totalAttempted) * 100).toFixed(1) : 0;
    // Base the cut-off on marks available, not question count — the two differ
    // per section now (Quant is 35 questions for 30 marks).
    const marksAvailable = examQuestions.reduce(
      (sum, q) => sum + (typeof q.marks === "number" ? q.marks : 1.0), 0
    );
    const passThreshold = marksAvailable * 0.55;

    // Section-wise breakdown — IBPS applies sectional cut-offs, so an overall
    // score alone hides the section that actually failed.
    const sectionwise = examSectionNames.map((name) => {
      const qs = details.filter((d) => d.section === name);
      const c = qs.filter((d) => d.status === "Correct").length;
      const w = qs.filter((d) => d.status === "Wrong").length;
      const marks = qs.reduce((sum, d) => {
        const m = typeof d.marks === "number" ? d.marks : 1.0;
        const n = typeof d.negativeMarks === "number" ? Math.abs(d.negativeMarks) : m / 4;
        return d.status === "Correct" ? sum + m : d.status === "Wrong" ? sum - n : sum;
      }, 0);
      return {
        name,
        total: qs.length,
        correct: c,
        wrong: w,
        skipped: qs.length - c - w,
        score: Math.round(marks * 100) / 100,
        accuracy: c + w > 0 ? ((c / (c + w)) * 100).toFixed(1) : "0.0",
      };
    }).filter((s) => s.total > 0);

    // IBPS eliminates on sectional cut-offs FIRST. Judging on the total alone
    // told someone with a strong overall score but a failed Quant section that
    // they had "Likely Qualified" — the one verdict the real exam would not give.
    const failedSections = sectionwise.filter(
      (s) => SECTIONAL_CUTOFF_ESTIMATE[s.name] != null && s.score < SECTIONAL_CUTOFF_ESTIMATE[s.name],
    );
    const cutoffPrediction = failedSections.length
      ? `Below cut-off in ${failedSections.map((s) => s.name.split(" ")[0]).join(", ")}`
      : score >= passThreshold
        ? "Likely Qualified"
        : score >= passThreshold - 2
          ? "Likely Borderline"
          : "Likely Not Qualified";

    const resultsObj = {
      score,
      // Needed by the score ring and the percentage line — a 30-mark English
      // drill must not be drawn against a denominator of 100.
      marksAvailable: Math.round(marksAvailable * 100) / 100,
      sectionwise,
      failedSections: failedSections.map((s) => s.name),
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

  // Auto-save results once after submission (side effect — must not be inside useMemo).
  // Skipped in review mode: reopening an old attempt must never overwrite it.
  useEffect(() => {
    if (reviewMode) return;
    if (examSubmitted && results && !autoSaveCalledRef.current) {
      autoSaveCalledRef.current = true;
      autoSaveAfterSubmit(results);
    }
    if (!examSubmitted) {
      autoSaveCalledRef.current = false; // reset for next exam
    }
  }, [examSubmitted, results, reviewMode]);

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
      return [
        "All",
        "HR / Personal",
        "Banking Concepts",
        "Situational Scenarios",
        "Current Affairs & Economy",
      ];
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
        // Six tabs with flex-1 on a phone gave each ~62px, of which px-4 ate 32 —
        // labels like "🧮 Formulas & Rules" wrapped onto four lines. Scroll the
        // bar horizontally on small screens instead and let each tab keep its
        // natural width.
        <div className="flex gap-2 border-b border-slate-200 dark:border-slate-800 pb-px overflow-x-auto scrollbar-thin">
          {[
            { id: "prelims", label: "📋 Prelims Prep" },
            { id: "mains", label: "🏆 Mains Expert" },
            { id: "interview", label: "🎯 Mock Interview" },
            { id: "mocktest", label: "✍️ Timed Mock Test" },
            { id: "formulas", label: "🧮 Formulas & Rules" },
            { id: "pattern", label: "📊 Exam Pattern" },
            { id: "rrb", label: "🚉 RRB PO" },
            { id: "cutoffs", label: "📉 Cut-offs" },
            { id: "vacancies", label: "🏦 Vacancies" },
          ].map((t) => {
            const active = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`flex-shrink-0 whitespace-nowrap text-center px-4 py-3 text-sm font-bold border-b-2 transition-all ${
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
      {activeTab !== "mocktest" && !STATIC_TABS.has(activeTab) && (
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
              {/* Mode switch — same engine, two sources of questions */}
              <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl">
                {[
                  { id: "ai", label: "🤖 AI Mock Test" },
                  { id: "pyq", label: `📚 Previous Year Papers${pyqPapers.length ? ` (${pyqPapers.length})` : ""}` },
                ].map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setTestMode(m.id)}
                    className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${
                      testMode === m.id
                        ? "bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 shadow-sm"
                        : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>

              {/* Which exam to imitate. The two have different papers entirely —
                  IBPS PO is 100 questions over 3 sections in 60 minutes, RRB PO
                  is 80 over 2 sections in 45 with no English at all. */}
              {testMode === "ai" && (
                <div className="space-y-2">
                  <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">Exam</p>
                  <div className="flex flex-wrap gap-2">
                    {Object.values(EXAM_PROFILES).map((ex) => {
                      const on = mockExam === ex.id;
                      const q = ex.plan.reduce((n, x) => n + x.questions, 0);
                      const mins = ex.plan.reduce((n, x) => n + x.seconds, 0) / 60;
                      return (
                        <button
                          key={ex.id}
                          onClick={() => { setMockExam(ex.id); setExamSectionChoice("all"); }}
                          className={`flex-1 min-w-[160px] px-3 py-2.5 rounded-xl border text-left transition-all ${
                            on
                              ? "border-amber-500 bg-amber-50 dark:bg-amber-900/20"
                              : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                          }`}
                        >
                          <span className={`block text-sm font-bold ${on ? "text-amber-700 dark:text-amber-300" : "text-slate-700 dark:text-slate-200"}`}>
                            {ex.label}
                          </span>
                          <span className="block text-[10px] text-slate-400 mt-0.5">
                            {q} Qs · {ex.plan.length} sections · {mins} min
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Sectional drill picker — applies to BOTH sources. A full paper
                  needs an uninterrupted hour; a single section is 20 minutes and
                  fits into a break, which is the only way most people practise. */}
              <div className="space-y-2">
                <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">
                  What to sit
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    ...(() => {
                      const pl = testMode === "ai" ? (EXAM_PROFILES[mockExam]?.plan || SECTION_PLAN) : SECTION_PLAN;
                      return [{
                        id: "all",
                        label: "Full Paper",
                        meta: `${pl.reduce((n, x) => n + x.questions, 0)} Qs · ${pl.reduce((n, x) => n + x.seconds, 0) / 60} min`,
                      }];
                    })(),
                    ...(testMode === "ai" ? (EXAM_PROFILES[mockExam]?.plan || SECTION_PLAN) : SECTION_PLAN).map((s) => ({
                      id: s.name,
                      label: s.name.replace(" Language", "").replace(" Aptitude", "").replace(" Ability", ""),
                      meta: `${s.questions} Qs · ${s.seconds / 60} min`,
                    })),
                  ].map((opt) => {
                    const on = examSectionChoice === opt.id;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => setExamSectionChoice(opt.id)}
                        className={`flex-1 min-w-[140px] px-3 py-2.5 rounded-xl border text-left transition-all ${
                          on
                            ? "border-amber-500 bg-amber-50 dark:bg-amber-900/20"
                            : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                        }`}
                      >
                        <span className={`block text-sm font-bold ${on ? "text-amber-700 dark:text-amber-300" : "text-slate-700 dark:text-slate-200"}`}>
                          {opt.label}
                        </span>
                        <span className="block text-[10px] text-slate-400 mt-0.5">{opt.meta}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ── Previous Year Papers ─────────────────────────────────── */}
              {testMode === "pyq" && (
                <div className="glass-card p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-5">
                  <div className="text-center space-y-2">
                    <span className="text-5xl">📚</span>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Previous Year Papers</h2>
                    <p className="text-sm text-slate-500">
                      Sat under real conditions — {SECTION_PLAN[0].seconds / 60} minutes per section, attempted in
                      order and not revisitable, with the same pause, history and solutions as the AI mock. A paper
                      covering only some sections runs only those, so its clock is shorter than the full {TOTAL_MINUTES} minutes.
                    </p>
                  </div>

                  {pyqPapers.length === 0 ? (
                    <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-8 text-center space-y-3">
                      <span className="text-3xl">📥</span>
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">No papers loaded yet</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                        Send the question papers over — as PDF, images or plain text — and they will be converted
                        and attached here. Each paper appears as a card below and runs through this same exam engine.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {/* Exam filter — 20 papers across three different exams
                          is unusable as a single flat list. */}
                      <div className="flex flex-wrap gap-2 pb-1">
                        {[
                          { id: "all", label: "All papers" },
                          { id: "ibps", label: "IBPS PO" },
                          { id: "sbi", label: "SBI PO" },
                          { id: "rrb", label: "IBPS RRB PO" },
                        ].filter((f) => paperExamCounts[f.id]).map((f) => (
                          <button
                            key={f.id}
                            onClick={() => setPaperExam(f.id)}
                            className={`text-xs px-3 py-1.5 rounded-full font-bold transition-all border ${
                              paperExam === f.id
                                ? "bg-amber-600 border-amber-600 text-white"
                                : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-amber-400"
                            }`}
                          >
                            {f.label} ({paperExamCounts[f.id]})
                          </button>
                        ))}
                      </div>
                      {pyqPapers.map((p) => {
                        // Only the sections this paper actually has — it runs
                        // exactly those, so the card must advertise exactly those.
                        // Counts come from the index; the questions themselves
                        // are not loaded until Start Paper is pressed.
                        const present = (p.sections || []).reduce((m, s) => ({ ...m, [s.name]: s.count }), {});
                        // What this card will actually run, given the sectional
                        // choice above — not what the paper contains in full.
                        // The paper's own profile — an RRB card must show 25+20
                        // minutes across two sections, not the IBPS 20/20/20.
                        const cardPlan = EXAM_PROFILES[p.exam || "ibps"]?.plan || SECTION_PLAN;
                        const plan = cardPlan.filter(
                          (s) => present[s.name] && (examSectionChoice === "all" || s.name === examSectionChoice),
                        );
                        const runQs = plan.reduce((n, s) => n + present[s.name], 0);
                        const missingSection = examSectionChoice !== "all" && !present[examSectionChoice];
                        const counts = plan.map(
                          (s) => `${present[s.name]} ${s.medium === "English" ? "Eng" : s.name.split(" ")[0]}`
                        );
                        const runMinutes = plan.reduce((n, s) => n + s.seconds, 0) / 60;
                        const complete = p.total === TOTAL_QUESTIONS;
                        const busy = loadingPaperId === p.id;
                        return (
                          <div
                            key={p.id}
                            className="flex flex-wrap items-center gap-4 p-4 bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl"
                          >
                            <div className="flex-1 min-w-0 space-y-1">
                              <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{p.name}</p>
                              <div className="flex flex-wrap items-center gap-2">
                                {p.shift && <span className="text-[10px] text-slate-400">{p.shift}</span>}
                                <span className="text-[10px] text-slate-400">
                                  {runQs} Qs · {counts.join(" / ")} · {runMinutes} min
                                </span>
                                {!complete && (
                                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300 uppercase">
                                    Partial
                                  </span>
                                )}
                                {p.source === "memory-based" && (
                                  <span
                                    className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 uppercase"
                                    title="IBPS does not publish official papers — this is a memory-based reconstruction."
                                  >
                                    Memory-based
                                  </span>
                                )}
                              </div>
                              {p.note && <p className="text-[11px] text-slate-500 dark:text-slate-400">{p.note}</p>}
                            </div>
                            <button
                              onClick={() => startPyqPaper(p)}
                              disabled={busy || loadingPaperId !== null || missingSection}
                              title={missingSection ? `This paper has no ${examSectionChoice} questions` : undefined}
                              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-colors"
                            >
                              {busy ? "Loading…" : missingSection ? "Not in this paper" : examSectionChoice === "all" ? "▶ Start Paper" : `▶ Start ${examSectionChoice.split(" ")[0]}`}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-3">
                    <strong className="text-slate-700 dark:text-slate-200">Note:</strong> IBPS does not publicly
                    release its question papers or answer keys, so anything labelled a previous-year paper — here or
                    anywhere else — is a memory-based reconstruction compiled from candidate recall, not an official
                    document.
                  </p>
                </div>
              )}

              {/* Main card */}
              {testMode === "ai" && (
              <div className="glass-card p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6">
                <div className="text-center space-y-2">
                  <span className="text-5xl">✍️</span>
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Dynamic AI Mock Test</h2>
                  <p className="text-sm text-slate-500">Practice under real-time exam conditions with unique questions generated live by Groq AI</p>
                </div>

                {/* Reflects the sectional choice — showing 100 Qs / 60 min above
                    a button that generates a 30-question English drill would be
                    a lie about what you are about to sit. */}
                {(() => {
                  // Follows the EXAM picker as well as the section picker — this
                  // read from the IBPS constant, so choosing RRB left the card
                  // still advertising 100 Qs / 60 min / 3 sections.
                  const pl = EXAM_PROFILES[mockExam]?.plan || SECTION_PLAN;
                  const chosen = examSectionChoice === "all" ? null : pl.find((s) => s.name === examSectionChoice);
                  const mins = chosen ? chosen.seconds / 60 : pl.reduce((n, x) => n + x.seconds, 0) / 60;
                  const qs = chosen ? chosen.questions : pl.reduce((n, x) => n + x.questions, 0);
                  const marks = chosen ? chosen.marks : pl.reduce((n, x) => n + x.marks, 0);
                  return (
                    <div className="border-t border-b border-slate-100 dark:border-slate-800 py-4 grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Duration</p>
                        <p className="text-lg font-bold text-slate-800 dark:text-slate-100">{mins} Mins</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Questions</p>
                        <p className="text-lg font-bold text-slate-800 dark:text-slate-100">{qs}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                          {chosen ? "Section Marks" : "Total Marks"}
                        </p>
                        <p className="text-lg font-bold text-slate-800 dark:text-slate-100">{marks}</p>
                      </div>
                    </div>
                  );
                })()}

                {/* Official pattern breakdown */}
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="text-slate-400 border-b border-slate-100 dark:border-slate-800">
                        <th className="text-left font-semibold py-2">Section</th>
                        <th className="text-right font-semibold py-2">Qs</th>
                        <th className="text-right font-semibold py-2">Marks</th>
                        <th className="text-right font-semibold py-2">Time</th>
                      </tr>
                    </thead>
                    <tbody className="text-slate-600 dark:text-slate-300">
                      {(EXAM_PROFILES[mockExam]?.plan || SECTION_PLAN).map((s) => (
                        <tr key={s.name} className="border-b border-slate-50 dark:border-slate-800/60">
                          <td className="py-2 font-medium">{s.name}</td>
                          <td className="py-2 text-right">{s.questions}</td>
                          <td className="py-2 text-right">{s.marks}</td>
                          <td className="py-2 text-right">{s.seconds / 60} min</td>
                        </tr>
                      ))}
                      {(() => {
                        const pl = EXAM_PROFILES[mockExam]?.plan || SECTION_PLAN;
                        return (
                          <tr className="font-bold text-slate-800 dark:text-slate-100">
                            <td className="py-2">Total</td>
                            <td className="py-2 text-right">{pl.reduce((n, x) => n + x.questions, 0)}</td>
                            <td className="py-2 text-right">{pl.reduce((n, x) => n + x.marks, 0)}</td>
                            <td className="py-2 text-right">{pl.reduce((n, x) => n + x.seconds, 0) / 60} min</td>
                          </tr>
                        );
                      })()}
                    </tbody>
                  </table>
                </div>

                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Test Instructions:</h3>
                  <ul className="text-xs text-slate-500 dark:text-slate-400 space-y-2 list-disc list-inside">
                    <li>Questions are dynamically generated by Groq AI — every test is unique. If AI is unavailable, a paper is drawn from the offline bank in the same pattern.</li>
                    {/* Derived, not hardcoded — RRB's windows are 25 and 20, and
                        its marking is a flat -0.25 rather than IBPS's per-section
                        values, so stating IBPS numbers here would be wrong. */}
                    {(() => {
                      const pl = EXAM_PROFILES[mockExam]?.plan || SECTION_PLAN;
                      const mins = [...new Set(pl.map((x) => x.seconds / 60))];
                      const timing = mins.length === 1
                        ? `${mins[0]} minutes per section`
                        : pl.map((x) => `${x.name.split(" ")[0]} ${x.seconds / 60} min`).join(", ");
                      const flat = new Set(pl.map((x) => x.negative)).size === 1;
                      const neg = flat
                        ? `a flat ${pl[0].negative} per wrong answer`
                        : `one fourth of the marks that question carries (${pl.map((x) => `${x.name.split(" ")[0]} ${x.negative}`).join(", ")})`;
                      return (
                        <>
                          <li><strong>Sectional timing:</strong> {timing}, attempted in the order above. When a section's time runs out it closes automatically and <strong>cannot be reopened</strong>.</li>
                          <li>Negative marking is {neg}.</li>
                        </>
                      );
                    })()}
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
              )}

              {/* My Saved Tests — shared by both modes */}
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
                            : test.status === "paused"
                            ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                            : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
                        }`}>
                          {test.status === "attempted" ? "✓ Attempted" : test.status === "paused" ? "⏸ Paused" : "⏳ Saved"}
                        </span>
                        {test.status === "paused" && test.progressSummary && (
                          <span className="text-[10px] text-blue-500 font-medium">
                            {/* sectionIdx is an index into THIS attempt's plan, not
                                the global three. A paused Quant-only drill sits at
                                index 0, which read as "English Language" before —
                                so for a sectional test take the name from its title. */}
                            {SECTION_NAMES.find((n) => (test.title || "").includes(n)) ||
                              SECTION_NAMES[test.progressSummary.sectionIdx] ||
                              "In progress"}{" "}
                            · {test.progressSummary.answered} answered
                          </span>
                        )}
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
                    {/* Always visible — these used to appear only on hover, which
                        made them unreachable on touch devices. */}
                    <div className="flex items-center gap-2 flex-wrap justify-end">
                      {test.status === "paused" && (
                        <button
                          onClick={() => loadAndStartTest(test.id, { resume: true })}
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors"
                        >
                          ▶ Continue
                        </button>
                      )}
                      {test.status === "attempted" && (
                        <button
                          onClick={() => viewSolutions(test.id)}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors"
                        >
                          📖 Solutions
                        </button>
                      )}
                      <button
                        onClick={() => loadAndStartTest(test.id)}
                        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-colors"
                      >
                        {test.status === "attempted" ? "Re-attempt" : test.status === "paused" ? "Restart" : "▶ Start"}
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
                  {/* Section status — sectional timing means these are indicators, not jumps */}
                  <div className="flex gap-1.5 overflow-x-auto">
                    {examSectionNames.map((sec, i) => {
                      const state = i < sectionIdx ? "closed" : i === sectionIdx ? "active" : "upcoming";
                      return (
                        <span
                          key={sec}
                          title={
                            state === "closed"
                              ? "This section is closed — sectional timing does not allow returning."
                              : state === "active"
                              ? "Currently open"
                              : "Opens after the current section's 20 minutes end."
                          }
                          className={`text-xs px-3 py-1.5 rounded-xl font-bold whitespace-nowrap ${
                            state === "active"
                              ? "bg-slate-800 text-white dark:bg-white dark:text-slate-800"
                              : state === "closed"
                              ? "bg-slate-100 dark:bg-slate-800 text-slate-400 line-through"
                              : "bg-white dark:bg-slate-800 text-slate-400 border border-dashed border-slate-300 dark:border-slate-700"
                          }`}
                        >
                          {state === "closed" ? "🔒 " : state === "upcoming" ? "🔓 " : ""}
                          {sec}
                        </span>
                      );
                    })}
                  </div>

                  {/* Sectional timer + explicit early exit */}
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex items-center gap-2 font-mono text-lg font-bold ${
                        timeLeft <= 60 ? "text-red-600 dark:text-red-400 animate-pulse" : "text-slate-700 dark:text-slate-200"
                      }`}
                    >
                      ⏱️ {formatTime(timeLeft)}
                      <span className="text-[10px] font-sans font-semibold text-slate-400 uppercase tracking-wider">
                        section {sectionIdx + 1}/{examPlan.length}
                      </span>
                    </div>
                    <button
                      onClick={pauseExam}
                      disabled={pausing}
                      title="Stop the clock and save your progress — resume later from My Saved Tests."
                      className="text-xs px-3 py-1.5 rounded-xl font-bold bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white"
                    >
                      {pausing ? "Saving…" : "⏸ Pause"}
                    </button>
                    <button
                      onClick={() => {
                        const last = sectionIdx === examPlan.length - 1;
                        // Say what is actually being left behind. "This cannot be
                        // undone" does not tell you that 12 questions in the
                        // section you are closing are still blank.
                        const inSec = examQuestions.slice(sectionBounds.first, sectionBounds.last + 1);
                        const blank = inSec.filter((q) => examAnswers[q.id] === undefined).length;
                        const flagged = inSec.filter((q) => markedReview.has(q.id)).length;
                        const tail = [
                          blank ? `${blank} unanswered` : null,
                          flagged ? `${flagged} still marked for review` : null,
                        ].filter(Boolean).join(" and ");
                        confirm({
                          title: last ? "Submit the whole test now?" : `Move on to ${examSectionNames[sectionIdx + 1]}?`,
                          message:
                            (tail ? `${examSection} has ${tail}. ` : "") +
                            (last
                              ? "This cannot be undone."
                              : `You will not be able to return to ${examSection}.`),
                          confirmLabel: last ? "Submit" : "Next Section",
                          onConfirm: advanceSection,
                        });
                      }}
                      className="text-xs px-3 py-1.5 rounded-xl font-bold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600"
                    >
                      {sectionIdx === examPlan.length - 1 ? "Finish ▶" : "Next Section ▶"}
                    </button>
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
                          {examSection} — Question {currentQIndex - sectionBounds.first + 1} of{" "}
                          {sectionBounds.last - sectionBounds.first + 1}
                          <span className="normal-case tracking-normal text-slate-300 dark:text-slate-600">
                            {"  "}({currentQIndex + 1}/{examQuestions.length} overall)
                          </span>
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
                            disabled={currentQIndex <= sectionBounds.first}
                            className="px-4 py-2 bg-slate-100 dark:bg-slate-700 disabled:opacity-40 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl"
                          >
                            ◀ Previous
                          </button>
                          <button
                            onClick={saveAndNext}
                            disabled={currentQIndex >= sectionBounds.last}
                            className="px-5 py-2 bg-amber-600 hover:bg-amber-700 disabled:opacity-40 text-white text-xs font-bold rounded-xl"
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
                  <p style={{fontSize: "0.68rem"}} className="text-slate-400 mt-0.5">
                    {examSection} — {sectionBounds.last - sectionBounds.first + 1} questions
                  </p>
                </div>

                {/* Current section only — closed sections cannot be navigated to */}
                <div className="grid grid-cols-5 gap-2 p-1.5">
                  {examQuestions.slice(sectionBounds.first, sectionBounds.last + 1).map((q, offset) => {
                    const idx = sectionBounds.first + offset;
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
              {/* The only way out used to be a button beneath all 35 solutions,
                  so leaving the results meant scrolling the whole page. This bar
                  sticks to the top of the results view. */}
              <div className="sticky top-0 z-20 -mx-1 px-1 py-2 bg-slate-50/90 dark:bg-slate-950/90 backdrop-blur-sm flex flex-wrap items-center justify-between gap-3">
                <button
                  onClick={() => { setReviewMode(false); setExamStarted(false); setExamSubmitted(false); }}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 text-white text-sm font-bold rounded-xl transition-colors"
                >
                  ← Back to Mock Tests
                </button>
                <div className="flex items-center gap-2">
                  {paperTitle && (
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 truncate max-w-[46vw]">
                      {paperTitle}
                    </span>
                  )}
                  <button
                    onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" })}
                    className="px-3 py-2 border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 text-xs font-bold rounded-xl hover:bg-white dark:hover:bg-slate-800 transition-colors"
                  >
                    Jump to solutions ↓
                  </button>
                </div>
              </div>

              {reviewMode && (
                <div className="flex flex-wrap items-center gap-3 p-4 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-2xl">
                  <span className="text-xl">📖</span>
                  <p className="flex-1 text-sm text-emerald-800 dark:text-emerald-200 font-medium">
                    Reviewing a past attempt — your saved answers are shown against the correct ones below. Nothing here is re-scored or overwritten.
                  </p>
                  <button
                    onClick={() => { setReviewMode(false); setExamStarted(false); setExamSubmitted(false); }}
                    className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 text-xs font-bold rounded-xl"
                  >
                    ← Back to tests
                  </button>
                </div>
              )}
              {/* Score summary panel */}
              <div className="bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
                <div className="text-center md:border-r border-slate-150 dark:border-slate-700 py-2 space-y-1">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Overall score</p>
                  <div className="flex items-center justify-center">
                    {/* Scale to the marks actually available — a sectional drill
                        is out of 30, not 100, so a fixed denominator would
                        under-draw it badly. */}
                    <ScoreRing
                      score={results.score}
                      max={results.marksAvailable || TOTAL_MARKS}
                      size={110}
                      label={`/ ${results.marksAvailable || TOTAL_MARKS}`}
                    />
                  </div>
                  <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                    {((results.score / (results.marksAvailable || TOTAL_MARKS)) * 100).toFixed(1)}% scored
                  </p>
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
                  <p className="text-[10px] text-slate-400">Predicted cutoff: 55% of marks available</p>
                </div>
              </div>

              {/* Section wise stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {(results.sectionwise || []).map((sec) => {
                  const plan = SECTION_PLAN.find((p) => p.name === sec.name);
                  return (
                    <div key={sec.name} className="bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4">
                      <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100">{sec.name}</h4>
                      <div className="grid grid-cols-3 gap-2 text-center text-xs">
                        <div>
                          <p className="text-[9px] text-slate-400 font-semibold uppercase">Score</p>
                          <p className="text-base font-black text-slate-800 dark:text-slate-100">
                            {sec.score.toFixed(2)}
                            <span className="text-[10px] font-bold text-slate-400">/{plan ? plan.marks : sec.total}</span>
                          </p>
                        </div>
                        <div>
                          <p className="text-[9px] text-slate-400 font-semibold uppercase">Accuracy</p>
                          <p className="text-base font-black text-blue-500">{sec.accuracy}%</p>
                        </div>
                        <div>
                          <p className="text-[9px] text-slate-400 font-semibold uppercase">Attempted</p>
                          <p className="text-base font-black text-slate-400">
                            {sec.correct + sec.wrong}/{sec.total}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-3 text-[10px] font-semibold text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800 pt-2">
                        <span className="text-green-600">✓ {sec.correct}</span>
                        <span className="text-red-500">✗ {sec.wrong}</span>
                        <span>— {sec.skipped} skipped</span>
                      </div>
                      {/* IBPS eliminates on SECTIONAL cut-offs — a strong total
                          with one section below its cut-off still fails. The
                          estimates existed only on the Pattern tab, where they
                          could not be compared against an actual score. */}
                      {(() => {
                        const cut = SECTIONAL_CUTOFF_ESTIMATE[sec.name];
                        if (cut == null) return null;
                        const clear = sec.score >= cut;
                        const gap = Math.abs(sec.score - cut).toFixed(2);
                        return (
                          <div
                            className={`flex items-center justify-between gap-2 rounded-xl px-3 py-2 text-[10px] font-bold ${
                              clear
                                ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300"
                                : "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300"
                            }`}
                          >
                            <span>{clear ? "✓ Above sectional cut-off" : "✗ Below sectional cut-off"}</span>
                            <span className="font-mono">
                              {clear ? `+${gap}` : `−${gap}`} vs ~{cut.toFixed(2)}
                            </span>
                          </div>
                        );
                      })()}
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

      {/* ── Exam Pattern ─────────────────────────────────────────────────── */}
      {/* ── Formulas & Rules — quick-revision sheet ─────────────────────────── */}
      {activeTab === "formulas" && (
        <div className="space-y-6 max-w-5xl mx-auto">
          <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl">
            {[
              { id: "english", label: `📘 English (${ENGLISH_RULES.reduce((n, g) => n + g.rows.length, 0)})` },
              { id: "quant", label: `🧮 Quant (${QUANT_FORMULAS.reduce((n, g) => n + g.items.length, 0)})` },
              { id: "reasoning", label: `🧩 Reasoning (${REASONING_RULES.reduce((n, g) => n + g.items.length, 0)})` },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setFormulaTab(t.id)}
                className={`flex-1 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all whitespace-nowrap ${
                  formulaTab === t.id
                    ? "bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 shadow-sm"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {formulaTab === "english" && (
            <div className="space-y-6">
              <div className="text-center space-y-1">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">English</h2>
                <p className="text-sm text-slate-500">
                  Usage rules the English section tests every year. The highlighted word is the whole point of the rule.
                </p>
              </div>
              {ENGLISH_RULES.map((g) => (
                <div
                  key={g.group}
                  className={`glass-card rounded-3xl border overflow-hidden ${
                    g.important
                      ? "border-amber-400 dark:border-amber-500 ring-1 ring-amber-400/30"
                      : "border-slate-200 dark:border-slate-800"
                  }`}
                >
                  <div className={`px-5 py-3 border-b flex items-center gap-2 ${
                    g.important
                      ? "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800"
                      : "bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800"
                  }`}>
                    <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">{g.group}</h3>
                    {g.important && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-500 text-white uppercase tracking-wider">
                        ★ Important
                      </span>
                    )}
                  </div>
                  {/* Four columns is too wide for a phone, so the table scrolls
                      inside its own box rather than the page scrolling sideways. */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[640px]">
                      <thead>
                        <tr className="text-[10px] uppercase tracking-wider text-slate-400">
                          <th className="px-4 py-2 font-bold">Topic</th>
                          <th className="px-4 py-2 font-bold">Rule</th>
                          <th className="px-4 py-2 font-bold">Example</th>
                          <th className="px-4 py-2 font-bold">Trick</th>
                        </tr>
                      </thead>
                      <tbody>
                        {g.rows.map((r) => (
                          <tr key={r.topic} className="border-t border-slate-100 dark:border-slate-800/70 align-top">
                            <td className="px-4 py-3 text-sm font-bold text-slate-800 dark:text-slate-100 whitespace-nowrap">{r.topic}</td>
                            <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300"><Emphasise text={r.rule} /></td>
                            <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300 italic"><Emphasise text={r.example} /></td>
                            <td className="px-4 py-3 text-xs text-slate-500 dark:text-slate-400">{r.trick}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Quant and Reasoning share an identical {group, items:[{name, formula,
              note}]} shape, so one renderer covers both rather than a copy. */}
          {(formulaTab === "quant" || formulaTab === "reasoning") && (
            <div className="space-y-6">
              <div className="text-center space-y-1">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                  {formulaTab === "quant" ? "Quantitative Aptitude" : "Reasoning Ability"}
                </h2>
                <p className="text-sm text-slate-500">
                  {formulaTab === "quant"
                    ? `Every formula the ${SECTION_PLAN[1].name} section can ask for, grouped by topic.`
                    : "Reasoning has no formulas as such, but it has hard rules and fixed conventions that decide marks."}
                </p>
              </div>
              <div className="grid md:grid-cols-2 gap-4 items-start">
                {(formulaTab === "quant" ? QUANT_FORMULAS : REASONING_RULES).map((g) => (
                  <div
                    key={g.group}
                    className={`glass-card rounded-3xl border overflow-hidden ${
                      g.important
                        ? "border-amber-400 dark:border-amber-500 ring-1 ring-amber-400/30"
                        : "border-slate-200 dark:border-slate-800"
                    }`}
                  >
                    <div className={`px-5 py-3 border-b flex items-center justify-between gap-2 ${
                      g.important
                        ? "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800"
                        : "bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800"
                    }`}>
                      <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                        {g.group}
                        {g.important && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-500 text-white uppercase tracking-wider whitespace-nowrap">
                            ★ Important
                          </span>
                        )}
                      </h3>
                      <span className="text-[10px] text-slate-400 font-semibold">{g.items.length}</span>
                    </div>
                    <div className="divide-y divide-slate-100 dark:divide-slate-800/70">
                      {g.items.map((it) => (
                        <div key={it.name} className="px-5 py-3 space-y-1">
                          <p className="text-xs font-bold text-slate-700 dark:text-slate-200">{it.name}</p>
                          <p className="text-sm font-mono text-amber-700 dark:text-amber-300 break-words">{it.formula}</p>
                          {it.note && <p className="text-[11px] text-slate-500 dark:text-slate-400">{it.note}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── IBPS RRB PO (Officer Scale I) ──────────────────────────────────── */}
      {activeTab === "rrb" && (
        <div className="space-y-6 max-w-5xl mx-auto">
          {/* Header */}
          <div className="glass-card rounded-3xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50/60 dark:bg-emerald-950/20 p-6 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-3xl">🚉</span>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{RRB_OVERVIEW.fullName}</h2>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              {RRB_OVERVIEW.forPost} · Conducted by {RRB_OVERVIEW.conductedBy}
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {RRB_OVERVIEW.stages.map((st, i) => (
                <span key={st} className="flex items-center gap-2">
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-white dark:bg-slate-800 border border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300">
                    {i + 1}. {st}
                  </span>
                  {i < RRB_OVERVIEW.stages.length - 1 && <span className="text-slate-400">→</span>}
                </span>
              ))}
            </div>
            <p className="text-[13px] text-emerald-800 dark:text-emerald-200 font-medium pt-1">{RRB_OVERVIEW.note}</p>
          </div>

          {/* Prelims and Mains patterns */}
          {[
            { label: "Prelims", data: RRB_PRELIMS, accent: "amber" },
            { label: "Mains", data: RRB_MAINS, accent: "indigo" },
          ].map(({ label, data }) => (
            <div key={label} className="glass-card rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden">
              <div className="px-5 py-3 bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">{label} — Exam Pattern</h3>
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  {data.totalQuestions} questions · {data.totalMarks} marks · {data.totalMinutes} min
                  {data.sectionalTiming ? " · sectional timing" : ""}
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[560px]">
                  <thead>
                    <tr className="text-[10px] uppercase tracking-wider text-slate-400">
                      <th className="px-4 py-2 font-bold">Section</th>
                      <th className="px-4 py-2 font-bold text-right">Questions</th>
                      <th className="px-4 py-2 font-bold text-right">Marks</th>
                      <th className="px-4 py-2 font-bold text-right">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.sections.map((sec) => (
                      <tr key={sec.name} className="border-t border-slate-100 dark:border-slate-800/70 align-top">
                        <td className="px-4 py-3">
                          <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{sec.name}</p>
                          {sec.note && <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{sec.note}</p>}
                        </td>
                        <td className="px-4 py-3 text-sm text-right font-semibold text-slate-700 dark:text-slate-200">{sec.questions}</td>
                        <td className="px-4 py-3 text-sm text-right font-semibold text-slate-700 dark:text-slate-200">{sec.marks}</td>
                        <td className="px-4 py-3 text-sm text-right font-semibold text-amber-600 dark:text-amber-400 whitespace-nowrap">{sec.minutes} min</td>
                      </tr>
                    ))}
                    <tr className="border-t-2 border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-900/40">
                      <td className="px-4 py-2.5 text-sm font-black text-slate-800 dark:text-slate-100">Total</td>
                      <td className="px-4 py-2.5 text-sm text-right font-black text-slate-800 dark:text-slate-100">{data.totalQuestions}</td>
                      <td className="px-4 py-2.5 text-sm text-right font-black text-slate-800 dark:text-slate-100">{data.totalMarks}</td>
                      <td className="px-4 py-2.5 text-sm text-right font-black text-slate-800 dark:text-slate-100">{data.totalMinutes} min</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="px-5 py-2.5 text-[11px] text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800">
                Negative marking: <strong className="text-red-500">−{data.negative}</strong> for every wrong answer. Unattempted questions carry no penalty.
              </p>
            </div>
          ))}

          {/* How RRB PO differs from IBPS PO */}
          <div className="glass-card rounded-3xl border border-amber-400 dark:border-amber-500 ring-1 ring-amber-400/30 overflow-hidden">
            <div className="px-5 py-3 bg-amber-50 dark:bg-amber-900/20 border-b border-amber-200 dark:border-amber-800 flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">RRB PO vs IBPS PO — what actually differs</h3>
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-500 text-white uppercase tracking-wider">★ Read first</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="text-[10px] uppercase tracking-wider text-slate-400">
                    <th className="px-4 py-2 font-bold">Point</th>
                    <th className="px-4 py-2 font-bold">IBPS RRB PO</th>
                    <th className="px-4 py-2 font-bold">IBPS PO</th>
                  </tr>
                </thead>
                <tbody>
                  {RRB_VS_IBPS_PO.map((row) => (
                    <tr key={row.point} className="border-t border-slate-100 dark:border-slate-800/70">
                      <td className="px-4 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-200">{row.point}</td>
                      <td className="px-4 py-2.5 text-xs text-emerald-700 dark:text-emerald-300 font-medium">{row.rrb}</td>
                      <td className="px-4 py-2.5 text-xs text-slate-500 dark:text-slate-400">{row.ibps}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Syllabus */}
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Syllabus</h3>
            <p className="text-sm text-slate-500">Section by section, with the stage each one appears in.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-4 items-start">
            {RRB_SYLLABUS.map((sec) => (
              <div key={sec.section} className="glass-card rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="px-5 py-3 bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">{sec.section}</h4>
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 uppercase tracking-wider whitespace-nowrap">
                    {sec.stage}
                  </span>
                </div>
                <ul className="p-4 space-y-1.5">
                  {sec.topics.map((t) => (
                    <li key={t} className="flex gap-2 text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed">
                      <span className="text-amber-500 flex-shrink-0">•</span>
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Key facts */}
          <div className="space-y-1 pt-2">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Rules worth knowing</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-4 items-start">
            {RRB_KEY_FACTS.map((f) => (
              <div key={f.label} className="glass-card rounded-2xl border border-slate-200 dark:border-slate-800 p-4 space-y-1">
                <p className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">{f.label}</p>
                <p className="text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed">{f.detail}</p>
              </div>
            ))}
          </div>

          {/* Strategy */}
          <div className="space-y-1 pt-2">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">How to attempt it</h3>
          </div>
          <div className="space-y-3">
            {RRB_STRATEGY.map((s, i) => (
              <div key={s.title} className="glass-card rounded-2xl border border-slate-200 dark:border-slate-800 p-4 flex gap-4">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-slate-800 dark:bg-slate-700 text-white text-xs font-bold flex items-center justify-center">
                  {i + 1}
                </span>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{s.title}</p>
                  <p className="text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed">{s.body}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-3">
            <strong className="text-slate-700 dark:text-slate-200">Note:</strong> this page covers the exam pattern and
            syllabus only. The timed mock tests and previous-year papers elsewhere in this tab are built to the
            <strong> IBPS PO</strong> pattern (3 sections, 100 questions, 60 minutes), which is not the RRB PO shape —
            sitting one is still useful practice for Quant and Reasoning, but the timing and section mix differ.
          </p>
        </div>
      )}

      {activeTab === "vacancies" && <VacancyTab />}

      {activeTab === "cutoffs" && (
        <div className="space-y-6">
          {/* The correction that matters most: there is no state-wise IBPS PO
              cut-off, so the page says that before showing any table. */}
          <div className="bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 md:p-8 space-y-4">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Previous-year cut-offs</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Last five years, Prelims and Mains, for both exams.
              </p>
            </div>
            <div className="rounded-2xl border border-amber-200 dark:border-amber-900/60 bg-amber-50 dark:bg-amber-950/30 p-4 space-y-2">
              <p className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
                State-wise applies to RRB only
              </p>
              <p className="text-[13px] text-amber-900/80 dark:text-amber-200/80 leading-relaxed">
                {PO_CUTOFFS.note} IBPS RRB recruits bank by bank and its banks are regional, so RRB
                cut-offs genuinely are published per state — which is why Andhra Pradesh appears below
                under RRB and not under PO.
              </p>
            </div>
          </div>

          {/* RRB — Andhra Pradesh */}
          <div className="bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 md:p-8 space-y-5">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                IBPS RRB PO (Officer Scale I) — {RRB_AP_CUTOFFS.state}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Prelims out of {RRB_AP_CUTOFFS.prelimsOutOf}, Mains out of {RRB_AP_CUTOFFS.mainsOutOf}.
                A dash means no figure has been reported for the state that year.
              </p>
            </div>
            {RRB_AP_CUTOFFS.years.map((y) => (
              <div key={y.year} className="rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-2">
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-100">{y.year}</span>
                  <span
                    className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider whitespace-nowrap ${
                      y.sources >= 3
                        ? "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300"
                        : y.sources === 2
                        ? "bg-sky-100 dark:bg-sky-900/50 text-sky-700 dark:text-sky-300"
                        : "bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300"
                    }`}
                  >
                    {y.sources === 1 ? "single source" : `${y.sources} sources agree`}
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left min-w-[520px]">
                    <thead className="bg-slate-50/60 dark:bg-slate-900/40">
                      <tr>
                        {["Stage", "General", "OBC", "EWS", "SC", "ST"].map((h) => (
                          <th key={h} className="px-4 py-2 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {[["Prelims", y.prelims], ["Mains", y.mains]].map(([label, row]) => (
                        <tr key={label}>
                          <td className="px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200">{label}</td>
                          {["ur", "obc", "ews", "sc", "st"].map((c) => (
                            <td key={c} className="px-4 py-2.5 text-xs tabular-nums text-slate-600 dark:text-slate-300">
                              {row && row[c] != null ? row[c].toFixed(2) : <span className="text-slate-300 dark:text-slate-600">—</span>}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {y.caveat && (
                  <p className="px-4 py-3 text-[12px] text-slate-500 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800">
                    {y.caveat}
                  </p>
                )}
              </div>
            ))}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/40 p-4 space-y-1">
              <p className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Vacancies</p>
              <p className="text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed">{RRB_AP_CUTOFFS.vacancyNote}</p>
            </div>
          </div>

          {/* IBPS PO — category-wise */}
          <div className="bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 md:p-8 space-y-5">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">IBPS PO — category-wise, all India</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Prelims out of {PO_CUTOFFS.prelimsOutOf}, Mains out of {PO_CUTOFFS.mainsOutOf} (200 objective + 25
                descriptive), Final out of {PO_CUTOFFS.finalOutOf}.
              </p>
            </div>
            {[["Prelims", "prelims"], ["Mains", "mains"], ["Final", "final"]].map(([label, key]) => (
              <div key={key} className="rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-700">
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-100">{label}</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left min-w-[520px]">
                    <thead className="bg-slate-50/60 dark:bg-slate-900/40">
                      <tr>
                        {["Year", "General", "OBC", "EWS", "SC", "ST"].map((h) => (
                          <th key={h} className="px-4 py-2 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {PO_CUTOFFS.years.map((y) => (
                        <tr key={y.year}>
                          <td className="px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200">{y.year}</td>
                          {["ur", "obc", "ews", "sc", "st"].map((c) => (
                            <td key={c} className="px-4 py-2.5 text-xs tabular-nums text-slate-600 dark:text-slate-300">
                              {y[key] && y[key][c] != null ? y[key][c].toFixed(2) : <span className="text-slate-300 dark:text-slate-600">—</span>}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
            <p className="text-[12px] text-slate-500 dark:text-slate-400 leading-relaxed">
              2021 is reported for the General category only by every source checked, so the other columns
              are left blank rather than filled in with a guess.
            </p>
          </div>

          {/* How to read them */}
          <div className="bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 md:p-8 space-y-4">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">How to read these numbers</h3>
            <div className="grid md:grid-cols-2 gap-4 items-start">
              {CUTOFF_READING.map((c) => (
                <div key={c.title} className="rounded-2xl border border-slate-200 dark:border-slate-700 p-4 space-y-1">
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{c.title}</p>
                  <p className="text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed">{c.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "pattern" && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 md:p-8 space-y-6">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                IBPS PO Prelims — Exam Pattern
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {TOTAL_QUESTIONS} questions · {TOTAL_MARKS} marks · {TOTAL_MINUTES} minutes, with{" "}
                {SECTION_PLAN[0].seconds / 60} minutes of sectional timing per section.
              </p>
            </div>

            {/* Marks and timing table */}
            <div className="overflow-x-auto -mx-2 px-2">
              <table className="w-full text-sm border-collapse min-w-[640px]">
                <thead>
                  <tr className="text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-200 dark:border-slate-700">
                    <th className="text-left font-bold py-3 pr-3">Section</th>
                    <th className="text-right font-bold py-3 px-3">Questions</th>
                    <th className="text-right font-bold py-3 px-3">Marks</th>
                    <th className="text-right font-bold py-3 px-3">Marks / Question</th>
                    <th className="text-right font-bold py-3 px-3">Negative / Question</th>
                    <th className="text-right font-bold py-3 px-3">Time</th>
                    <th className="text-left font-bold py-3 pl-3">Medium</th>
                  </tr>
                </thead>
                <tbody className="text-slate-700 dark:text-slate-200">
                  {SECTION_PLAN.map((s) => (
                    <tr key={s.name} className="border-b border-slate-100 dark:border-slate-800">
                      <td className="py-3 pr-3 font-semibold">{s.name}</td>
                      <td className="py-3 px-3 text-right tabular-nums">{s.questions}</td>
                      <td className="py-3 px-3 text-right tabular-nums">{s.marks}</td>
                      <td className="py-3 px-3 text-right tabular-nums font-semibold text-emerald-600 dark:text-emerald-400">
                        +{s.perQuestion.toFixed(2)}
                      </td>
                      <td className="py-3 px-3 text-right tabular-nums font-semibold text-red-500">
                        {s.negative}
                      </td>
                      <td className="py-3 px-3 text-right tabular-nums">{s.seconds / 60} min</td>
                      <td className="py-3 pl-3 text-slate-500 dark:text-slate-400 text-xs">{s.medium}</td>
                    </tr>
                  ))}
                  <tr className="font-black text-slate-900 dark:text-white">
                    <td className="py-3 pr-3">Total</td>
                    <td className="py-3 px-3 text-right tabular-nums">{TOTAL_QUESTIONS}</td>
                    <td className="py-3 px-3 text-right tabular-nums">{TOTAL_MARKS}</td>
                    <td className="py-3 px-3 text-right text-slate-300 dark:text-slate-600">—</td>
                    <td className="py-3 px-3 text-right text-slate-300 dark:text-slate-600">—</td>
                    <td className="py-3 px-3 text-right tabular-nums">{TOTAL_MINUTES} min</td>
                    <td className="py-3 pl-3 text-slate-300 dark:text-slate-600">—</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Marking rules */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  icon: "➕",
                  title: "Marks per question",
                  body: `Marks are not uniform across sections. Each section's marks are divided by its question count — English ${SECTION_PLAN[0].perQuestion.toFixed(2)}, Quant ${SECTION_PLAN[1].perQuestion.toFixed(2)}, Reasoning ${SECTION_PLAN[2].perQuestion.toFixed(2)}. A Reasoning question is worth about a third more than a Quant one.`,
                },
                {
                  icon: "➖",
                  title: "Negative marking",
                  body: "One fourth of the marks carried by that question is deducted for a wrong answer — so it varies by section too. Unattempted questions carry no penalty.",
                },
                {
                  icon: "⏱️",
                  title: "Sectional timing",
                  body: `Each section gets exactly ${SECTION_PLAN[0].seconds / 60} minutes and must be attempted in order. Once a section's window closes you cannot return to it, so unattempted questions there are lost.`,
                },
              ].map((c) => (
                <div key={c.title} className="bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-2">
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-100">
                    {c.icon} {c.title}
                  </p>
                  <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">{c.body}</p>
                </div>
              ))}
            </div>

            {/* Worked marking example */}
            <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-2xl p-4 space-y-2">
              <p className="text-sm font-bold text-amber-800 dark:text-amber-300">How a score is worked out</p>
              <p className="text-xs leading-relaxed text-amber-900/80 dark:text-amber-200/80">
                Say you get 20 English correct with 4 wrong, 18 Quant correct with 6 wrong, and 22 Reasoning correct with 5 wrong.
                English gives {(20 * 1.0).toFixed(2)} − {(4 * 0.25).toFixed(2)} = <strong>{(20 * 1.0 - 4 * 0.25).toFixed(2)}</strong>.
                Quant gives {(18 * 0.86).toFixed(2)} − {(6 * 0.215).toFixed(2)} = <strong>{(18 * 0.86 - 6 * 0.215).toFixed(2)}</strong>.
                Reasoning gives {(22 * 1.14).toFixed(2)} − {(5 * 0.285).toFixed(2)} = <strong>{(22 * 1.14 - 5 * 0.285).toFixed(2)}</strong>.
                Total = <strong>{(20 * 1.0 - 4 * 0.25 + 18 * 0.86 - 6 * 0.215 + 22 * 1.14 - 5 * 0.285).toFixed(2)}</strong> out of {TOTAL_MARKS}.
              </p>
            </div>
          </div>

          {/* Topics per section */}
          <div className="bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 md:p-8 space-y-4">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Syllabus covered in each section</h3>
            <div className="space-y-3">
              {SECTION_PLAN.map((s) => (
                <div key={s.name} className="border-l-2 border-amber-400 pl-4 py-1">
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-100">
                    {s.name}{" "}
                    <span className="text-xs font-medium text-slate-400">
                      · {s.questions} Qs · {s.marks} marks · {s.seconds / 60} min
                    </span>
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{s.topics}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Cut-offs ─────────────────────────────────────────────────── */}
          <div className="bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 md:p-8 space-y-6">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                Previous years' cut-offs
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Overall Prelims cut-off out of {TOTAL_MARKS}, reported category-wise on an all-India basis.
                If you use state terminology: <strong>OC</strong> maps to General/UR and <strong>BC</strong> to OBC.
              </p>
            </div>

            <div className="overflow-x-auto -mx-2 px-2">
              <table className="w-full text-sm border-collapse min-w-[560px]">
                <thead>
                  <tr className="text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-200 dark:border-slate-700">
                    <th className="text-left font-bold py-3 pr-3">Year</th>
                    {CUTOFF_CATEGORIES.map((c) => (
                      <th key={c.key} className="text-right font-bold py-3 px-3">
                        {c.label}
                        {c.alias && (
                          <span className="block font-medium normal-case tracking-normal text-slate-300 dark:text-slate-600">
                            ({c.alias})
                          </span>
                        )}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="text-slate-700 dark:text-slate-200">
                  {CUTOFF_HISTORY.map((row, i) => (
                    <tr key={row.year} className="border-b border-slate-100 dark:border-slate-800">
                      <td className="py-3 pr-3 font-semibold">
                        {row.year}
                        {i === 0 && (
                          <span className="ml-2 text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300">
                            LATEST
                          </span>
                        )}
                      </td>
                      {CUTOFF_CATEGORIES.map((c) => {
                        const disputed = (row.disputed || []).includes(c.key);
                        return (
                          <td key={c.key} className="py-3 px-3 text-right tabular-nums">
                            {row[c.key] === null ? (
                              <span className="text-slate-300 dark:text-slate-600" title="Not confirmed for this cycle">
                                n/a
                              </span>
                            ) : (
                              <span
                                className={disputed ? "text-slate-500 dark:text-slate-400" : ""}
                                title={disputed ? "Reported figures differ between sources — verify on ibps.in" : undefined}
                              >
                                {row[c.key].toFixed(2)}
                                {disputed && <sup className="text-orange-500 font-bold ml-0.5">†</sup>}
                              </span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              <sup className="text-orange-500 font-bold">†</sup> Sources disagree on these cells. The 2024 SC/ST and
              2023 SC figures are reported variously as 48.00/41.00 and 49.00–49.50; the General, EWS and OBC
              figures are consistent across sources. The difference does not change what you should target.
            </p>

            {/* Derived target */}
            {(() => {
              const peak = Math.max(...CUTOFF_HISTORY.map((r) => r.gen));
              return (
                <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900 rounded-2xl p-4 space-y-1.5">
                  <p className="text-sm font-bold text-emerald-800 dark:text-emerald-300">🎯 What to aim for</p>
                  <p className="text-xs leading-relaxed text-emerald-900/80 dark:text-emerald-200/80">
                    The highest General cut-off across these cycles was <strong>{peak.toFixed(2)}</strong>. Target a
                    safe score of <strong>{Math.round(peak + 8)}–{Math.round(peak + 12)}</strong> out of {TOTAL_MARKS} —
                    comfortably clear in a hard year, and a wide margin in an easy one. Chasing the exact cut-off is
                    risky, because an easier paper pushes it upward.
                  </p>
                </div>
              );
            })()}

            {/* Sectional — clearly separated because confidence is lower */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-baseline gap-2">
                <p className="text-sm font-bold text-slate-800 dark:text-slate-100">Sectional cut-offs</p>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300 uppercase tracking-wider">
                  Indicative only
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {SECTION_PLAN.map((s) => (
                  <div key={s.name} className="bg-slate-50 dark:bg-slate-900/40 border border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-4">
                    <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">{s.name}</p>
                    <p className="text-2xl font-black text-slate-700 dark:text-slate-200 tabular-nums mt-1">
                      ~{SECTIONAL_CUTOFF_ESTIMATE[s.name]?.toFixed(2)}
                      <span className="text-xs font-bold text-slate-400"> / {s.marks}</span>
                    </p>
                  </div>
                ))}
              </div>
              <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                You must clear the sectional qualification <em>and</em> the overall cut-off — a strong total cannot
                rescue one weak section. Two caveats though. First, unlike the overall figure, IBPS does not publish
                a clean per-section cut-off each cycle, so these are coaching-reported estimates rather than
                confirmed values. Second, they come from cycles whose section marks were split differently
                (35/35 for Quant and Reasoning rather than the {SECTION_PLAN[1].marks}/{SECTION_PLAN[2].marks} above),
                so the denominators are not strictly comparable. Treat them as a rough floor to stay clear of, never
                as a target.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-1.5">
              <p className="text-xs font-bold text-slate-700 dark:text-slate-200">⚠️ Before you rely on these</p>
              <ul className="text-[11px] text-slate-500 dark:text-slate-400 space-y-1 list-disc list-inside leading-relaxed">
                <li>Cut-offs move every cycle with paper difficulty and vacancy count — an easier paper raises them.</li>
                <li>IBPS normalises scores across shifts, so your raw mock score is not directly comparable.</li>
                <li>These are compiled from published reports, not from an official IBPS release. Confirm against
                    your scorecard and the notification on <strong>ibps.in</strong>.</li>
                <li>Prelims is qualifying only — these marks do not carry into the final merit list.</li>
              </ul>
            </div>
          </div>

          {/* ── Strategy: topic weights + the 20-minute plan ─────────────── */}
          <div className="bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 md:p-8 space-y-6">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                Strategy — what carries weight, and how to spend the 20 minutes
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Question counts below are what recent papers have typically carried. Prepare in proportion to weight, and attempt in order of speed — not in the order the paper prints.
              </p>
            </div>

            {SECTION_PLAN.map((s) => {
              const st = SECTION_STRATEGY[s.name];
              if (!st) return null;
              return (
                <div key={s.name} className="border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden">
                  <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{s.name}</p>
                    <p className="text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                      Realistic target: {st.target}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4 lg:divide-x divide-slate-100 dark:divide-slate-800">
                    {/* topic weights — bars make the proportions readable at a glance,
                        and the fixed-width count column keeps every title left-aligned */}
                    <div className="space-y-3 min-w-0">
                      <div className="flex items-baseline justify-between gap-2">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Topic weight</p>
                        <p className="text-[10px] text-slate-400">of {s.questions} questions</p>
                      </div>
                      {st.weights.map((w) => {
                        const peak = Math.max(...st.weights.map(weightUpperBound));
                        const pct = Math.round((weightUpperBound(w) / peak) * 100);
                        return (
                          <div key={w.topic} className="min-w-0">
                            <div className="flex items-center gap-2.5">
                              <span className="shrink-0 w-11 text-center text-[10px] font-black tabular-nums px-1 py-1 rounded-md bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300">
                                {w.qs}
                              </span>
                              <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 truncate">
                                {w.topic}
                              </p>
                            </div>
                            <div className="pl-[3.375rem] mt-1 space-y-1">
                              <div className="h-1 rounded-full bg-slate-200 dark:bg-slate-700/70 overflow-hidden">
                                <div
                                  className="h-full rounded-full bg-amber-500/80 dark:bg-amber-500/70"
                                  style={{ width: `${pct}%` }}
                                />
                              </div>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">{w.note}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* 20-minute plan — time chips pulled to the right so the
                        minute budget reads as its own column */}
                    <div className="space-y-3 min-w-0 lg:pl-6">
                      <div className="flex items-baseline justify-between gap-2">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Order of attempt</p>
                        <p className="text-[10px] text-slate-400">{s.seconds / 60} min total</p>
                      </div>
                      <ol className="space-y-1.5">
                        {st.order.map((step, i) => {
                          const [label, mins] = splitStep(step);
                          return (
                            <li
                              key={step}
                              className="flex items-center gap-2.5 py-1.5 px-2 rounded-lg odd:bg-slate-50 dark:odd:bg-slate-900/40"
                            >
                              <span className="shrink-0 w-4 h-4 rounded-full bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900 text-[9px] font-black flex items-center justify-center">
                                {i + 1}
                              </span>
                              <span className="flex-1 min-w-0 text-[11px] text-slate-600 dark:text-slate-300 leading-snug">
                                {label}
                              </span>
                              {mins && (
                                <span className="shrink-0 text-[10px] font-bold tabular-nums text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                                  {mins}
                                </span>
                              )}
                            </li>
                          );
                        })}
                      </ol>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed pt-2 border-t border-slate-100 dark:border-slate-800">
                        <strong className="text-slate-700 dark:text-slate-200">Key rule:</strong> {st.rule}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Ask AI about the strategy on this page */}
          <div className="bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 md:p-8 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Ask about this strategy</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Answers are grounded in the pattern, weights, timings and cut-offs on this page — not generic advice.
                </p>
              </div>
              {!showStrategyAi && (
                <button
                  onClick={() => setShowStrategyAi(true)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-colors shrink-0"
                >
                  🤖 Ask AI
                </button>
              )}
            </div>

            {!showStrategyAi && (
              <div className="flex flex-wrap gap-2">
                {[
                  "I keep running out of time in Reasoning. What should I cut?",
                  "Which topics give the most marks per minute?",
                  "Is 22 attempts at 90% accuracy enough to clear the cut-off?",
                  "How do I decide which DI set to attempt first?",
                  "My English is weak. How should I split the 20 minutes?",
                ].map((q) => (
                  <button
                    key={q}
                    onClick={() => { setStrategySeed(q); setShowStrategyAi(true); }}
                    className="text-[11px] px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors text-left"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            {showStrategyAi && (
              <AiPanel
                topic={{
                  id: "ibps-strategy",
                  title: "IBPS PO Prelims — pattern, marking and section strategy",
                  topic: "Exam Strategy",
                  summary: `${TOTAL_QUESTIONS} questions, ${TOTAL_MARKS} marks, ${TOTAL_MINUTES} minutes with ${SECTION_PLAN[0].seconds / 60}-minute sectional timing.`,
                  explanation: buildStrategyContext(),
                  code: null,
                }}
                category="ibpspo-prelims"
                seedQuestion={strategySeed}
                onClose={() => { setShowStrategyAi(false); setStrategySeed(""); }}
              />
            )}
          </div>

          {/* In-exam selection rules */}
          <div className="bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 md:p-8 space-y-4">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Choosing questions wisely</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {EXAM_RULES.map((r) => (
                <div key={r.title} className="bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-1.5">
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-100">{r.icon} {r.title}</p>
                  <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">{r.body}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Preparation plan */}
          <div className="bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 md:p-8 space-y-4">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">How to prepare</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { icon: "📅", title: "Daily",
                  items: ["2 puzzle sets and 1 seating set, timed", "1 DI set plus 10 approximation sums", "1 RC passage and 15 new words in context", "Reread yesterday's mistakes before starting"] },
                { icon: "🗓️", title: "Weekly",
                  items: ["2 full mocks under real sectional timing", "1 sectional test for your weakest section", "Revise formula and combination tables", "Rebuild any puzzle you failed, from scratch"] },
                { icon: "🔬", title: "After every mock",
                  items: ["Classify each error: concept gap, calculation slip, misread, or time pressure", "Only concept gaps need study — the rest need habit changes", "Track attempts and accuracy per section, not just the total", "Note which sets you should have skipped"] },
              ].map((c) => (
                <div key={c.title} className="bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-2">
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{c.icon} {c.title}</p>
                  <ul className="text-[11px] text-slate-500 dark:text-slate-400 space-y-1.5 list-disc list-inside leading-relaxed">
                    {c.items.map((i) => <li key={i}>{i}</li>)}
                  </ul>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-3">
              <strong className="text-slate-700 dark:text-slate-200">The one that matters most:</strong> analysing a mock takes longer than sitting it, and is where the improvement actually comes from. A mock you did not analyse was practice at being slow.
            </p>
          </div>

          {/* Qualification note */}
          <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-2">
            <p className="text-sm font-bold text-slate-800 dark:text-slate-100">📌 Worth remembering</p>
            <ul className="text-xs text-slate-500 dark:text-slate-400 space-y-1.5 list-disc list-inside leading-relaxed">
              <li>Prelims is <strong>qualifying only</strong> — the marks do not carry into the final merit list, which is decided by Mains and the Interview.</li>
              <li>You must clear <strong>both</strong> the sectional cut-offs and the overall cut-off. A strong total cannot rescue one weak section.</li>
              <li>Prelims cut-offs are released <strong>category-wise on an all-India basis</strong>; state-wise vacancies matter at the final allotment stage, not here. See the Cut-offs section above.</li>
              <li>Accuracy beats volume: at roughly one mark a question, four careless wrong answers cancel a correct one.</li>
            </ul>
          </div>

          <button
            onClick={() => setActiveTab("mocktest")}
            className="w-full py-3.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-2xl shadow-md transition-colors text-center"
          >
            ✍️ Take a mock test in this exact pattern
          </button>
        </div>
      )}

      <ConfirmModal {...confirmProps} />
    </div>
  );
}


// ── Vacancies ─────────────────────────────────────────────────────────────────
// Data comes from /api/vacancies so counts can be corrected mid-cycle without a
// frontend release; the bundled JSON is the fallback, so the tab still renders
// fully when the request fails or the user is offline. Status is DERIVED from
// the notification dates rather than stored — a stored "Apply now" string would
// still be claiming that months after the window shut.
const DAY = 86400000;

function vacancyStatus(row, today) {
  const d = (s) => (s ? new Date(`${s}T00:00:00`) : null);
  const from = d(row.apply?.from);
  const to = d(row.apply?.to);
  if (!from && row.confirmed === false) {
    return { tone: "awaited", label: "Notification awaited" };
  }
  if (from && today < from) return { tone: "soon", label: `Opens ${fmtDay(from)}` };
  if (from && to && today <= to) {
    const left = Math.ceil((to - today) / DAY);
    return { tone: "open", label: left <= 1 ? "Closes today" : `Apply now — ${left} days left` };
  }
  const next = (row.stages || []).find((s) => s.date && d(s.date) >= today);
  if (next) {
    const days = Math.ceil((d(next.date) - today) / DAY);
    return {
      tone: days <= 14 ? "imminent" : "upcoming",
      label: days === 0 ? `${next.name} today` : `${next.name} in ${days} day${days === 1 ? "" : "s"}`,
    };
  }
  return (row.stages || []).some((s) => !s.date)
    ? { tone: "done", label: "Exams done — result stage" }
    : { tone: "done", label: "Cycle complete" };
}

function fmtDay(dt) {
  return dt.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

const TONE = {
  open: "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300",
  imminent: "bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300",
  soon: "bg-sky-100 dark:bg-sky-900/50 text-sky-700 dark:text-sky-300",
  awaited: "bg-violet-100 dark:bg-violet-900/50 text-violet-700 dark:text-violet-300",
  upcoming: "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300",
  done: "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500",
};

// The pay bar the user cares about. Parsed from the gross/in-hand string rather
// than stored twice, so the badge can never disagree with the figure shown.
const PO_BAND = 60000;
function clearsBand(pay) {
  const txt = pay?.inHand || pay?.gross || "";
  const nums = String(txt).replace(/,/g, "").match(/\d{4,}/g);
  if (!nums) return null;
  return Math.max(...nums.map(Number)) >= PO_BAND;
}

// Pattern and syllabus live in a shared library keyed by patternId — IBPS PO
// and IBPS SO do not share one, but IBPS Clerk and SBI Clerk do, and RRB Scale
// II and III are identical. Storing them per row would have duplicated the same
// twelve sections across twenty entries.
function ExamPattern({ pattern }) {
  const [open, setOpen] = useState(false);
  if (!pattern) return null;
  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full px-3 py-2 flex items-center justify-between gap-2 bg-slate-50 dark:bg-slate-900/40 hover:bg-slate-100 dark:hover:bg-slate-900/70 transition text-left"
      >
        <span className="text-[12px] font-bold text-slate-700 dark:text-slate-200">
          Exam pattern &amp; syllabus
          <span className="ml-2 font-normal text-slate-500 dark:text-slate-400">{pattern.summary}</span>
        </span>
        <span className="text-slate-400 text-xs flex-shrink-0">{open ? "▲" : "▼"}</span>
      </button>
      {open && (
        <div className="p-3 space-y-4">
          {pattern.merit && (
            <p className="text-[12px] text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg px-3 py-2">
              {pattern.merit}
            </p>
          )}

          {pattern.stages.map((st, i) => (
            <div key={st.name} className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-800 dark:bg-slate-600 text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                  {i + 1}
                </span>
                <span className="text-[13px] font-bold text-slate-800 dark:text-slate-100">{st.name}</span>
                {st.qualifying && (
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 uppercase tracking-wider">
                    qualifying
                  </span>
                )}
                {[st.mode, st.duration, st.total, st.negative && `${st.negative} per wrong`]
                  .filter(Boolean)
                  .map((x) => (
                    <span key={x} className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300">
                      {x}
                    </span>
                  ))}
              </div>
              {st.sections?.length > 0 && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left min-w-[380px]">
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {st.sections.map((sc) => (
                        <tr key={sc.name}>
                          <td className="py-1 pr-3 text-[12px] text-slate-600 dark:text-slate-300">{sc.name}</td>
                          <td className="py-1 px-2 text-[11px] tabular-nums text-slate-500 dark:text-slate-400 whitespace-nowrap w-16">
                            {sc.q != null ? `${sc.q} Q` : ""}
                          </td>
                          <td className="py-1 px-2 text-[11px] tabular-nums text-slate-500 dark:text-slate-400 whitespace-nowrap w-20">
                            {sc.marks != null ? `${sc.marks} marks` : ""}
                          </td>
                          <td className="py-1 pl-2 text-[11px] tabular-nums text-slate-500 dark:text-slate-400 whitespace-nowrap w-16">
                            {sc.time || ""}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {st.note && <p className="text-[11.5px] text-slate-500 dark:text-slate-400 leading-relaxed">{st.note}</p>}
            </div>
          ))}

          <div className="pt-1 space-y-2">
            <p className="text-[12px] font-bold text-slate-700 dark:text-slate-200">Syllabus</p>
            <div className="grid sm:grid-cols-2 gap-2.5 items-start">
              {pattern.syllabus.map((sy) => (
                <div key={sy.section} className="rounded-lg border border-slate-200 dark:border-slate-700 p-2.5 space-y-1">
                  <p className="text-[11.5px] font-bold text-slate-700 dark:text-slate-200">{sy.section}</p>
                  <ul className="space-y-0.5">
                    {sy.topics.map((t) => (
                      <li key={t} className="flex gap-1.5 text-[11.5px] text-slate-600 dark:text-slate-300 leading-relaxed">
                        <span className="text-amber-500 flex-shrink-0">•</span>
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function VacancyTab() {
  const [data, setData] = useState(bundledVacancies);
  const [live, setLive] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [failed, setFailed] = useState(false);
  const [fetchedAt, setFetchedAt] = useState(null);
  // Defaults to ON. The tab exists to answer "what officer-level jobs pay
  // around 60K", and the clerical and Level-4/6 rows drown that out — but they
  // stay one click away rather than being deleted from the data.
  const [onlyPO, setOnlyPO] = useState(true);
  const [sector, setSector] = useState("all");
  const [sortBy, setSortBy] = useState("vacancies");

  const today = useMemo(() => {
    const t = new Date();
    return new Date(t.getFullYear(), t.getMonth(), t.getDate());
  }, []);

  const refresh = async () => {
    setRefreshing(true);
    setFailed(false);
    try {
      const { data: fresh } = await api.get("/vacancies");
      if (fresh?.groups?.length) {
        setData(fresh);
        setLive(true);
        setFetchedAt(new Date());
      } else {
        setFailed(true);   // a 200 with no groups is still unusable
      }
    } catch {
      // Keep whatever is already on screen — the bundled copy is stale, not wrong.
      setFailed(true);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sectors = useMemo(
    () => ["all", ...new Set((data.groups || []).map((g) => g.sector))],
    [data]
  );

  const groups = useMemo(() => {
    const n = (r) => r.revised || r.announced || 0;
    const openRank = (r) => (vacancyStatus(r, today).tone === "open" ? 0 : 1);
    // A window that has ALREADY SHUT is not "closing soon". Without this guard
    // the deadline sort led with OICL AO, whose applications closed in Dec 2025,
    // and buried the RRB block that actually closes this month. Past and
    // not-yet-notified rows share the same sink value.
    const deadline = (r) => {
      const t = r.apply?.to ? new Date(`${r.apply.to}T00:00:00`).getTime() : null;
      return t !== null && t >= today.getTime() ? t : Number.MAX_SAFE_INTEGER;
    };
    const cmp = {
      vacancies: (a, b) => n(b) - n(a),
      open: (a, b) => openRank(a) - openRank(b) || deadline(a) - deadline(b) || n(b) - n(a),
      deadline: (a, b) => deadline(a) - deadline(b) || n(b) - n(a),
      name: (a, b) => a.exam.localeCompare(b.exam),
    }[sortBy];
    return (data.groups || [])
      .filter((g) => sector === "all" || g.sector === sector)
      .map((g) => ({ ...g, rows: g.rows.filter((r) => !onlyPO || clearsBand(r.pay)).sort(cmp) }))
      .filter((g) => g.rows.length)
      // Sorting inside a group is not enough — with "most vacancies" chosen the
      // groups themselves have to lead with the biggest, or the largest row on
      // the page still sits three cards down.
      .sort((a, b) =>
        sortBy === "name"
          ? a.full.localeCompare(b.full)
          : sortBy === "vacancies"
          ? b.rows.reduce((t, r) => t + n(r), 0) - a.rows.reduce((t, r) => t + n(r), 0)
          : sortBy === "deadline"
          ? // Purely by nearest deadline. Ranking open-status first here (as the
            // "open" mode does) made the two modes produce an identical order and
            // would have floated an open-but-later group above one closing sooner.
            Math.min(...a.rows.map(deadline)) - Math.min(...b.rows.map(deadline))
          : Math.min(...a.rows.map(openRank)) - Math.min(...b.rows.map(openRank)) ||
            Math.min(...a.rows.map(deadline)) - Math.min(...b.rows.map(deadline))
      );
  }, [data, sector, onlyPO, sortBy, today]);

  const allRows = (data.groups || []).flatMap((g) => g.rows);
  const shownRows = groups.flatMap((g) => g.rows);
  const count = (r) => r.revised || r.announced || 0;
  const total = shownRows.reduce((n, r) => n + count(r), 0);
  const openNow = shownRows
    .map((r) => ({ r, st: vacancyStatus(r, today) }))
    .filter((x) => x.st.tone === "open");
  const catTotal = (k) => shownRows.reduce((n, r) => n + (r.categories?.[k] || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header + refresh */}
      <div className="bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 md:p-8 space-y-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-1 min-w-0">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              Government &amp; PSU vacancies
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Officer-level entries across banking, insurance, regulators, central government and
              engineering. {data.cycle}.
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span
              className={`text-[9px] font-bold px-2 py-1 rounded-full uppercase tracking-wider ${
                live
                  ? "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300"
                  : "bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400"
              }`}
              title={live ? "Fetched from the server" : "Using the copy bundled with the app"}
            >
              {live ? "Live" : "Bundled"}
            </span>
            <button
              onClick={refresh}
              disabled={refreshing}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 disabled:opacity-50 transition inline-flex items-center gap-1.5"
            >
              <span className={refreshing ? "inline-block animate-spin" : ""}>↻</span>
              {refreshing ? "Refreshing…" : "Refresh"}
            </button>
          </div>
        </div>

        {failed && (
          <p className="text-[12px] text-amber-700 dark:text-amber-400">
            Could not reach the server — showing the bundled list, which may be out of date.
          </p>
        )}

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {sectors.map((s) => (
            <button
              key={s}
              onClick={() => setSector(s)}
              className={`text-[11px] font-semibold px-3 py-1.5 rounded-lg transition ${
                sector === s
                  ? "bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900"
                  : "bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              {s === "all" ? "All sectors" : s}
            </button>
          ))}
          {/* Sort and the pay filter travel together on the right. Two fixes
              over the first version: the select carried a SEMI-TRANSPARENT dark
              background (dark:bg-slate-700/60), and a native <select> hands its
              computed background to the OS popup — the alpha made that popup
              render light while the options kept inheriting light-grey text, so
              the list opened but could not be read. It is opaque now, and
              color-scheme tells the browser to draw the native popup dark,
              which is the only thing that reliably themes the option list.
              Both controls also had ml-auto, which shoved them to opposite
              ends of a wide screen and pushed the button off the card edge. */}
          <div className="flex items-center gap-2 ml-auto flex-shrink-0">
            <label htmlFor="vac-sort" className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Sort
            </label>
            <select
              id="vac-sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-[11px] font-semibold px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-100 border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-indigo-400 focus:outline-none cursor-pointer [color-scheme:light] dark:[color-scheme:dark]"
            >
              {[
                ["vacancies", "Most vacancies"],
                ["open", "Notification open first"],
                ["deadline", "Closing soonest"],
                ["name", "A–Z"],
              ].map(([v, label]) => (
                <option key={v} value={v} className="bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-100">
                  {label}
                </option>
              ))}
            </select>
            <button
              onClick={() => setOnlyPO((v) => !v)}
              className={`text-[11px] font-semibold px-3 py-1.5 rounded-lg transition whitespace-nowrap ${
                onlyPO
                  ? "bg-emerald-600 text-white"
                  : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
              }`}
            >
              ₹60K+ only
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { k: "Posts shown", v: total.toLocaleString("en-IN") },
            { k: "Recruitments", v: `${shownRows.length} of ${allRows.length}` },
            { k: "General (UR) seats", v: catTotal("ur").toLocaleString("en-IN") },
            { k: "OBC seats", v: catTotal("obc").toLocaleString("en-IN") },
          ].map((s) => (
            <div key={s.k} className="rounded-2xl border border-slate-200 dark:border-slate-700 p-3.5 text-center">
              <p className="text-xl font-bold text-slate-800 dark:text-slate-100 tabular-nums">{s.v}</p>
              <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-0.5">{s.k}</p>
            </div>
          ))}
        </div>

        {openNow.length > 0 && (
          <div className="rounded-2xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50 dark:bg-emerald-950/30 p-4 space-y-1.5">
            <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">Open right now</p>
            {openNow.map(({ r, st }) => (
              <p key={r.exam} className="text-[13px] text-emerald-900/80 dark:text-emerald-200/80 leading-relaxed">
                <strong>{r.exam}</strong> — {count(r).toLocaleString("en-IN")} posts · {st.label}
              </p>
            ))}
          </div>
        )}
      </div>

      {groups.length === 0 && (
        <div className="bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-3xl p-8 text-center text-sm text-slate-400">
          Nothing matches these filters.
        </div>
      )}

      {groups.map((g) => {
        const gTotal = g.rows.reduce((n, r) => n + count(r), 0);
        return (
          <div key={g.id} className="bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 md:p-8 space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{g.full}</h3>
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 uppercase tracking-wider">
                    {g.sector}
                  </span>
                </div>
                <p className="text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">{g.blurb}</p>
              </div>
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 uppercase tracking-wider whitespace-nowrap">
                {gTotal.toLocaleString("en-IN")} posts
              </span>
            </div>

            <div className="space-y-3">
              {g.rows.map((r) => {
                const st = vacancyStatus(r, today);
                const band = clearsBand(r.pay);
                return (
                  <div key={r.exam} className="rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                    <div className="px-4 py-3 bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{r.exam}</p>
                          {band && (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300">
                              ₹60K+
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">{r.post} · {r.cadre}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-sm font-bold text-slate-800 dark:text-slate-100 tabular-nums">
                          {r.announced == null && r.revised == null ? "—" : count(r).toLocaleString("en-IN")}
                        </span>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider whitespace-nowrap ${TONE[st.tone]}`}>
                          {st.label}
                        </span>
                      </div>
                    </div>
                    <div className="p-4 space-y-3">
                      {r.confirmed === false && (
                        <p className="text-[12px] font-semibold text-violet-600 dark:text-violet-400">
                          Not yet notified — the figure shown is an expectation or a previous-cycle count, not a published number.
                        </p>
                      )}
                      {r.revised && r.announced !== r.revised && (
                        <p className="text-[12px] text-slate-500 dark:text-slate-400">
                          Announced at {r.announced.toLocaleString("en-IN")}, revised to{" "}
                          <strong className="text-slate-700 dark:text-slate-200">{r.revised.toLocaleString("en-IN")}</strong>.
                        </p>
                      )}
                      {r.pay && (
                        <div className="flex flex-wrap gap-2">
                          {r.pay.level && (
                            <span className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300">
                              {r.pay.level}
                            </span>
                          )}
                          {r.pay.basic && (
                            <span className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300">
                              Basic ₹{r.pay.basic.toLocaleString("en-IN")}
                            </span>
                          )}
                          {r.pay.gross && (
                            <span className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300">
                              Gross {r.pay.gross}
                            </span>
                          )}
                          {r.pay.inHand && (
                            <span className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300">
                              In-hand {r.pay.inHand}
                            </span>
                          )}
                        </div>
                      )}
                      {r.pay?.note && (
                        <p className="text-[11.5px] text-slate-400 dark:text-slate-500">{r.pay.note}</p>
                      )}
                      {r.categories && (
                        <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-3 space-y-2">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <p className="text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                              Category split
                            </p>
                            <span
                              className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                                r.categories.basis === "published"
                                  ? "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300"
                                  : "bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300"
                              }`}
                            >
                              {r.categories.basis === "published" ? "published" : "indicative"}
                            </span>
                          </div>
                          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                            {[
                              ["General (UR)", "ur", true],
                              ["OBC", "obc", true],
                              ["EWS", "ews", false],
                              ["SC", "sc", false],
                              ["ST", "st", false],
                            ].map(([label, key, big]) => (
                              <div
                                key={key}
                                className={`rounded-lg p-2 text-center ${
                                  big
                                    ? "bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20"
                                    : "bg-slate-50 dark:bg-slate-900/40"
                                }`}
                              >
                                <p className={`tabular-nums font-bold ${big ? "text-sm text-indigo-700 dark:text-indigo-300" : "text-[13px] text-slate-700 dark:text-slate-200"}`}>
                                  {r.categories[key].toLocaleString("en-IN")}
                                </p>
                                <p className="text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{label}</p>
                              </div>
                            ))}
                          </div>
                          {r.categories.basis !== "published" && (
                            <p className="text-[11px] text-amber-700 dark:text-amber-400 leading-relaxed">
                              Computed from the standard reservation matrix (SC 15%, ST 7.5%, OBC 27%, EWS 10%) — the
                              recruiter has not published a split for this one. Use it as a rough guide, not a notified figure.
                            </p>
                          )}
                          {r.categories.note && (
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">{r.categories.note}</p>
                          )}
                        </div>
                      )}
                      <div className="flex flex-wrap gap-2">
                        {r.apply?.from && (
                          <span className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300">
                            Apply: {fmtDay(new Date(`${r.apply.from}T00:00:00`))} – {fmtDay(new Date(`${r.apply.to}T00:00:00`))}
                          </span>
                        )}
                        {(r.stages || []).map((s) => (
                          <span key={s.name} className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300">
                            {s.name}: {s.label}
                          </span>
                        ))}
                      </div>
                      {r.note && <p className="text-[12.5px] text-slate-600 dark:text-slate-300 leading-relaxed">{r.note}</p>}
                      <ExamPattern pattern={data.patterns?.[r.patternId]} />
                    </div>
                  </div>
                );
              })}
            </div>
            {g.footer && <p className="text-[11.5px] text-slate-400 dark:text-slate-500 leading-relaxed pt-1">{g.footer}</p>}
          </div>
        );
      })}

      {/* Cadre guide */}
      <div className="bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 md:p-8 space-y-4">
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">What the cadres actually mean</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">PO vs Clerk vs SO vs Scale II — what you would actually be doing.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-4 items-start">
          {CADRE_GUIDE.map((c) => (
            <div key={c.cadre} className="rounded-2xl border border-slate-200 dark:border-slate-700 p-4 space-y-1.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{c.cadre}</p>
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 uppercase tracking-wider whitespace-nowrap">
                  {c.scale}
                </span>
              </div>
              <p className="text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed">{c.body}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div className="bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 md:p-8 space-y-4">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Worth knowing before you apply</h3>
        <div className="grid md:grid-cols-2 gap-4 items-start">
          {VACANCY_NOTES.map((n) => (
            <div key={n.title} className="rounded-2xl border border-slate-200 dark:border-slate-700 p-4 space-y-1">
              <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{n.title}</p>
              <p className="text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed">{n.body}</p>
            </div>
          ))}
        </div>
        <p className="text-[11.5px] text-slate-400 dark:text-slate-500">
          {live && fetchedAt
            ? `Live from the server, fetched ${fetchedAt.toLocaleTimeString("en-IN")}.`
            : `Bundled copy, last reviewed ${fmtDay(new Date(`${data.updated}T00:00:00`))}.`}{" "}
          Always confirm against the recruiter's own notification before you rely on a number.
        </p>
      </div>
    </div>
  );
}
