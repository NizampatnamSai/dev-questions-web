import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { QUIZ_TOPICS, QUIZ_ANSWER_POOLS } from "../../data/formula-reference.js";

// Quick recall quiz over the reference tables: 10 multiple-choice questions
// from the chosen topics. Wrong options come from values of the same kind that
// sit next to the answer (13² → 144 / 196, not 4 / 625), so the quiz tests
// recall rather than elimination.

const ROUND = 10;

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function makeQuestion(item) {
  const pool = QUIZ_ANSWER_POOLS[item.kind];
  const at = pool.indexOf(item.a);
  const near = pool
    .map((v, i) => ({ v, d: Math.abs(i - at) }))
    .filter((x) => x.v !== item.a)
    .sort((x, y) => x.d - y.d)
    .slice(0, 6)
    .map((x) => x.v);
  const options = shuffle([item.a, ...shuffle([...new Set(near)]).slice(0, 3)]);
  return { ...item, options };
}

function buildRound(topicIds) {
  const items = topicIds.flatMap((t) => QUIZ_TOPICS[t].items);
  return shuffle(items).slice(0, ROUND).map(makeQuestion);
}

export default function QuickQuiz({ onClose }) {
  const [topics, setTopics] = useState(Object.keys(QUIZ_TOPICS));
  const [round, setRound] = useState(null); // null = choosing topics
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState({}); // question index → option
  const closeRef = useRef(null);

  useEffect(() => {
    const prev = document.activeElement;
    closeRef.current?.focus();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
      prev?.focus?.();
    };
  }, []);

  const start = (ids = topics) => {
    setRound(buildRound(ids));
    setI(0);
    setPicked({});
  };

  const q = round?.[i];
  const answered = q && picked[i] != null;
  const done = round && i >= round.length;
  const score = useMemo(() => (round ? round.filter((qq, k) => picked[k] === qq.a).length : 0), [round, picked]);
  const missed = round ? round.filter((qq, k) => picked[k] != null && picked[k] !== qq.a) : [];

  const choose = useCallback((opt) => { if (!answered) setPicked((p) => ({ ...p, [i]: opt })); }, [answered, i]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") return onClose();
      if (!q) return;
      if (!answered && /^[1-4]$/.test(e.key)) choose(q.options[Number(e.key) - 1]);
      else if (answered && (e.key === "Enter" || e.key === "ArrowRight")) setI((n) => n + 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [q, answered, choose, onClose]);

  const retryMissed = () => {
    setRound(shuffle(missed).map((m) => makeQuestion(m)));
    setI(0);
    setPicked({});
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6" role="dialog" aria-modal="true" aria-labelledby="qq-title">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div className="relative w-full sm:max-w-lg max-h-[92vh] overflow-y-auto bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl border border-slate-200 dark:border-slate-700 shadow-2xl">
        <div className="flex items-center justify-between gap-3 px-5 py-3 border-b border-slate-200 dark:border-slate-700">
          <h3 id="qq-title" className="text-sm font-bold text-slate-800 dark:text-slate-100">⚡ Quick quiz</h3>
          <button ref={closeRef} type="button" onClick={onClose} className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400">
            Close
          </button>
        </div>

        <div className="p-5 space-y-4">
          {!round && (
            <>
              <p className="text-sm text-slate-600 dark:text-slate-300">{ROUND} questions, four options each. Pick what to practise:</p>
              <div className="grid grid-cols-2 gap-2" role="group" aria-label="Quiz topics">
                {Object.entries(QUIZ_TOPICS).map(([id, t]) => {
                  const on = topics.includes(id);
                  return (
                    <button
                      key={id}
                      type="button"
                      aria-pressed={on}
                      onClick={() => setTopics((ts) => (on ? ts.filter((x) => x !== id) : [...ts, id]))}
                      className={`text-sm font-semibold px-3 py-2.5 rounded-xl border-2 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
                        on ? "border-amber-500 bg-amber-50 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200" : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
                      }`}
                    >
                      {on ? "✓ " : ""}{t.label}
                    </button>
                  );
                })}
              </div>
              <button
                type="button"
                disabled={!topics.length}
                onClick={() => start()}
                className="w-full text-sm font-bold py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white disabled:opacity-40 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              >
                Start
              </button>
            </>
          )}

          {q && !done && (
            <>
              <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <span>Question {i + 1} / {round.length}</span>
                <span>Score {score}</span>
              </div>
              <div className="h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div className="h-full bg-amber-500 transition-all" style={{ width: `${(i / round.length) * 100}%` }} />
              </div>
              <p className="text-xl font-bold text-slate-800 dark:text-slate-100 text-center py-3 font-mono">{q.q}</p>
              <div className="grid grid-cols-2 gap-2">
                {q.options.map((opt, k) => {
                  const isAns = opt === q.a;
                  const isPick = picked[i] === opt;
                  const cls = !answered
                    ? "border-slate-200 dark:border-slate-700 hover:border-amber-400 text-slate-700 dark:text-slate-200"
                    : isAns
                    ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-200"
                    : isPick
                    ? "border-red-500 bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-200"
                    : "border-slate-200 dark:border-slate-700 text-slate-400";
                  return (
                    <button
                      key={opt}
                      type="button"
                      disabled={answered}
                      onClick={() => choose(opt)}
                      className={`relative text-base font-bold font-mono py-3 rounded-xl border-2 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${cls}`}
                    >
                      <span className="absolute left-2 top-1 text-[10px] font-sans text-slate-400">{k + 1}</span>
                      {opt}
                    </button>
                  );
                })}
              </div>
              <div aria-live="polite" className="min-h-[1.5rem] text-center text-sm font-semibold">
                {answered && (picked[i] === q.a ? <span className="text-emerald-600">✓ Correct</span> : <span className="text-red-600">✕ Answer: {q.a}</span>)}
              </div>
              {answered && (
                <button type="button" onClick={() => setI((n) => n + 1)} className="w-full text-sm font-bold py-3 rounded-xl bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400">
                  {i + 1 < round.length ? "Next →" : "See score"}
                </button>
              )}
              <p className="text-[11px] text-slate-400 text-center">Keys 1–4 to answer · Enter for next · Esc to close</p>
            </>
          )}

          {done && (
            <div className="space-y-4 text-center">
              <p className="text-4xl font-black text-slate-800 dark:text-slate-100 tabular-nums">{score}/{round.length}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {score === round.length ? "Perfect round." : score >= round.length * 0.8 ? "Nearly there — review the misses below." : "Worth another pass with revision mode on."}
              </p>
              {missed.length > 0 && (
                <ul className="text-left text-sm space-y-1 rounded-2xl bg-slate-50 dark:bg-slate-800/60 p-3">
                  {missed.map((m) => (
                    <li key={m.id} className="font-mono"><span className="text-slate-500">{m.q}</span> <strong className="text-amber-700 dark:text-amber-300">{m.a}</strong></li>
                  ))}
                </ul>
              )}
              <div className="flex flex-col sm:flex-row gap-2">
                {missed.length > 0 && (
                  <button type="button" onClick={retryMissed} className="flex-1 text-sm font-bold py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white">
                    Retry the {missed.length} missed
                  </button>
                )}
                <button type="button" onClick={() => start()} className="flex-1 text-sm font-bold py-3 rounded-xl bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900">
                  New round
                </button>
                <button type="button" onClick={() => setRound(null)} className="flex-1 text-sm font-bold py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  Change topics
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
