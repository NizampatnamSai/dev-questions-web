import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api/axios";
import { STUDY_TOPICS, STUDY_CATEGORIES } from "../data/studyGuide";

const DIFF_COLORS = {
  Basic: "bg-green-500/20 text-green-400 border-green-500/30",
  Intermediate: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  Advanced: "bg-red-500/20 text-red-400 border-red-500/30",
  Tricky: "bg-purple-500/20 text-purple-400 border-purple-500/30",
};

function FlipCard({ topic, onKnow, onReview }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className="relative w-full" style={{ perspective: 1200 }}>
      <motion.div
        className="relative w-full"
        style={{ transformStyle: "preserve-3d", minHeight: 340 }}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 120 }}
        onClick={() => setFlipped((f) => !f)}
      >
        {/* Front */}
        <div className="absolute inset-0 glass-card rounded-2xl p-6 flex flex-col justify-between cursor-pointer select-none"
          style={{ backfaceVisibility: "hidden" }}>
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500">{topic.category} · {topic.topic}</span>
            <span className={`text-xs px-2 py-1 rounded-full border ${DIFF_COLORS[topic.difficulty]}`}>{topic.difficulty}</span>
          </div>
          <div className="text-center flex-1 flex flex-col items-center justify-center gap-4 py-6">
            <div className="text-4xl">❓</div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">{topic.title}</h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">{topic.interviewQuestion}</p>
          </div>
          <p className="text-center text-xs text-slate-400">Tap to flip</p>
        </div>

        {/* Back */}
        <div className="absolute inset-0 bg-indigo-50 dark:bg-slate-800 border border-indigo-300/60 dark:border-indigo-500/40 rounded-2xl p-6 flex flex-col justify-between cursor-pointer select-none"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
          <div className="flex items-center justify-between">
            <span className="text-xs text-indigo-500 dark:text-indigo-400 font-semibold">Answer</span>
            <span className={`text-xs px-2 py-1 rounded-full border ${DIFF_COLORS[topic.difficulty]}`}>{topic.difficulty}</span>
          </div>
          <div className="flex-1 overflow-y-auto py-4 space-y-3">
            <p className="text-slate-700 dark:text-slate-200 text-sm leading-relaxed font-semibold">{topic.summary}</p>
            <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">{topic.explanation?.slice(0, 300)}{topic.explanation?.length > 300 ? "..." : ""}</p>
            {topic.code && (
              <pre className="bg-slate-900 rounded-lg p-3 text-xs text-green-300 overflow-x-auto">{topic.code.slice(0, 200)}</pre>
            )}
          </div>
          <p className="text-center text-xs text-slate-400">Tap to flip back</p>
        </div>
      </motion.div>

      {/* Action buttons — only when flipped */}
      <AnimatePresence>
        {flipped && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="flex gap-3 mt-4" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => { setFlipped(false); onReview(); }}
              className="flex-1 py-3 bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-400 rounded-xl font-semibold text-sm transition-all">
              😅 Need Review
            </button>
            <button onClick={() => { setFlipped(false); onKnow(); }}
              className="flex-1 py-3 bg-green-500/20 hover:bg-green-500/30 border border-green-500/40 text-green-400 rounded-xl font-semibold text-sm transition-all">
              ✅ Got It!
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Flashcards() {
  const [categories, setCategories] = useState([]);
  const [deck, setDeck] = useState([]);
  const [idx, setIdx] = useState(0);
  const [progress, setProgress] = useState({});
  const [phase, setPhase] = useState("browse"); // browse | session | done
  const [reviewOnly, setReviewOnly] = useState(false);

  useEffect(() => {
    api.get("/study/flash/progress").then(({ data }) => setProgress(data)).catch(() => {});
  }, []);

  function buildDeck(reviewOnlyMode = reviewOnly) {
    let pool = categories.length === 0 ? STUDY_TOPICS : STUDY_TOPICS.filter((t) => categories.includes(t.category));
    if (reviewOnlyMode) pool = pool.filter((t) => progress[t.id] === "review" || !progress[t.id]);
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    setDeck(shuffled);
    setIdx(0);
    setPhase("session");
  }

  async function saveProgress(topicId, result) {
    setProgress((prev) => ({ ...prev, [topicId]: result }));
    try { await api.post("/study/flash/progress", { topic_id: topicId, result }); } catch {}
  }

  function handleKnow() {
    saveProgress(deck[idx].id, "know");
    advance();
  }

  function handleReview() {
    saveProgress(deck[idx].id, "review");
    advance();
  }

  function advance() {
    if (idx + 1 >= deck.length) setPhase("done");
    else setIdx((i) => i + 1);
  }

  const knownCount = Object.values(progress).filter((v) => v === "know").length;
  const reviewCount = Object.values(progress).filter((v) => v === "review").length;

  return (
    <div className="min-h-screen px-4 py-8 max-w-2xl mx-auto text-slate-800 dark:text-white">
      <AnimatePresence mode="wait">

        {phase === "browse" && (
          <motion.div key="browse" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="text-center mb-8">
              <div className="text-6xl mb-3">🃏</div>
              <h1 className="text-3xl font-bold mb-2">Flashcards</h1>
              <p className="text-slate-400 text-sm">Flip through topics. Mark what you know — review what you don't.</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {[["📚", STUDY_TOPICS.length, "Total"], ["✅", knownCount, "Know It"], ["🔄", reviewCount, "Review"]].map(([icon, val, label]) => (
                <div key={label} className="glass-card p-3 text-center">
                  <div className="text-xl">{icon}</div>
                  <div className="text-2xl font-black">{val}</div>
                  <div className="text-xs text-slate-500">{label}</div>
                </div>
              ))}
            </div>

            {/* Category picker */}
            <div className="mb-4">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 block mb-2">
                Category {categories.length > 0 && <span className="text-indigo-400 font-normal">({categories.length} selected)</span>}
              </label>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => setCategories([])}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${categories.length === 0 ? "bg-indigo-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"}`}>
                  All
                </button>
                {STUDY_CATEGORIES.map((c) => (
                  <button key={c.id}
                    onClick={() => setCategories(prev => prev.includes(c.id) ? prev.filter(x => x !== c.id) : [...prev, c.id])}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${categories.includes(c.id) ? "bg-indigo-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"}`}>
                    {c.icon} {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Mode toggle */}
            <label className="flex items-center gap-3 glass-card p-4 cursor-pointer mb-6">
              <input type="checkbox" checked={reviewOnly} onChange={(e) => setReviewOnly(e.target.checked)} className="accent-indigo-500 w-4 h-4" />
              <div>
                <div className="font-semibold text-sm">Review mode</div>
                <div className="text-xs text-slate-400">Only show topics marked "Need Review" + unseen</div>
              </div>
            </label>

            <button onClick={() => buildDeck(reviewOnly)}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold text-lg text-white transition-all">
              Start Flashcards →
            </button>
          </motion.div>
        )}

        {phase === "session" && deck[idx] && (
          <motion.div key={`card-${idx}`} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}>
            <div className="flex items-center justify-between mb-4">
              <button onClick={() => setPhase("browse")} className="text-sm text-slate-400 hover:text-slate-700 dark:hover:text-white">← Back</button>
              <span className="text-sm text-slate-400">{idx + 1} / {deck.length}</span>
              <button onClick={() => setPhase("done")} className="text-sm text-slate-500 hover:text-slate-300">Finish</button>
            </div>

            <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full mb-6">
              <motion.div className="h-full bg-indigo-500 rounded-full" animate={{ width: `${((idx + 1) / deck.length) * 100}%` }} />
            </div>

            <FlipCard topic={deck[idx]} onKnow={handleKnow} onReview={handleReview} />
          </motion.div>
        )}

        {phase === "done" && (
          <motion.div key="done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
            <div className="text-7xl mb-4">🎉</div>
            <h2 className="text-3xl font-bold mb-2">Deck Complete!</h2>
            <p className="text-slate-400 mb-8">You've gone through all {deck.length} cards.</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setPhase("browse")} className="px-6 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl font-semibold">
                Change Deck
              </button>
              <button onClick={() => { setReviewOnly(true); buildDeck(true); }}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold">
                Review Weak Cards 🔄
              </button>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
