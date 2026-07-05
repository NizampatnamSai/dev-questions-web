import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axios";
import { CheckboxBox } from "../components/Checkbox";
import { STUDY_TOPICS, STUDY_CATEGORIES } from "../data/studyGuide";

const DIFF_COLORS = {
  Basic: "bg-green-500/20 text-green-400 border-green-500/30",
  Intermediate: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  Advanced: "bg-red-500/20 text-red-400 border-red-500/30",
  Tricky: "bg-purple-500/20 text-purple-400 border-purple-500/30",
};

function SmartFlipCard({ card, onRate, rating }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className="relative w-full" style={{ perspective: 1200 }}>
      <motion.div
        className="relative w-full"
        style={{ transformStyle: "preserve-3d", minHeight: 300 }}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 120 }}
        onClick={() => setFlipped((f) => !f)}
      >
        {/* Front */}
        <div className="absolute inset-0 glass-card rounded-2xl p-6 flex flex-col justify-between cursor-pointer select-none"
          style={{ backfaceVisibility: "hidden" }}>
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500">{card.category}</span>
            {card.difficulty && (
              <span className={`text-xs px-2 py-1 rounded-full border ${DIFF_COLORS[card.difficulty] || "bg-slate-500/20 text-slate-400 border-slate-500/30"}`}>{card.difficulty}</span>
            )}
          </div>
          <div className="text-center flex-1 flex flex-col items-center justify-center gap-4 py-6">
            <div className="text-4xl">🧠</div>
            <p className="text-slate-700 dark:text-slate-200 text-base leading-relaxed">{card.question}</p>
          </div>
          <p className="text-center text-xs text-slate-400">Tap to flip</p>
        </div>

        {/* Back */}
        <div className="absolute inset-0 bg-indigo-50 dark:bg-slate-800 border border-indigo-300/60 dark:border-indigo-500/40 rounded-2xl p-6 flex flex-col justify-between cursor-pointer select-none"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
          <span className="text-xs text-indigo-500 dark:text-indigo-400 font-semibold">Answer</span>
          <div className="flex-1 overflow-y-auto py-4 space-y-3">
            <p className="text-slate-700 dark:text-slate-200 text-sm leading-relaxed font-semibold">{card.answer}</p>
            {card.explanation && (
              <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">{card.explanation}</p>
            )}
          </div>
          <p className="text-center text-xs text-slate-400">Tap to flip back</p>
        </div>
      </motion.div>

      <AnimatePresence>
        {flipped && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="flex gap-2 mt-4" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => { setFlipped(false); onRate(1); }}
              className="flex-1 py-3 bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-400 rounded-xl font-semibold text-sm transition-all">
              😖 Hard
            </button>
            <button onClick={() => { setFlipped(false); onRate(2); }}
              className="flex-1 py-3 bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/40 text-yellow-400 rounded-xl font-semibold text-sm transition-all">
              🙂 Medium
            </button>
            <button onClick={() => { setFlipped(false); onRate(3); }}
              className="flex-1 py-3 bg-green-500/20 hover:bg-green-500/30 border border-green-500/40 text-green-400 rounded-xl font-semibold text-sm transition-all">
              😎 Easy
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

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
  const location = useLocation();
  const preCategory = location.state?.preCategory;
  const [categories, setCategories] = useState(preCategory ? [preCategory] : []);
  const [deck, setDeck] = useState([]);
  const [idx, setIdx] = useState(0);
  const [progress, setProgress] = useState({});
  const [phase, setPhase] = useState("browse"); // browse | session | done
  const [reviewOnly, setReviewOnly] = useState(false);

  const [deckMode, setDeckMode] = useState("topic"); // topic | smart
  const [smartStats, setSmartStats] = useState(null); // { dueCount, totalCount } | null while loading
  const [smartPhase, setSmartPhase] = useState("home"); // home | session | done
  const [smartDeck, setSmartDeck] = useState([]);
  const [smartIdx, setSmartIdx] = useState(0);
  const [smartCategory, setSmartCategory] = useState(STUDY_CATEGORIES[0]?.id || "javascript");
  const [smartDifficulty, setSmartDifficulty] = useState("all");
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    api.get("/study/flash/progress").then(({ data }) => setProgress(data)).catch(() => {});
  }, []);

  useEffect(() => {
    if (deckMode === "smart" && smartPhase === "home") loadSmartStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deckMode, smartPhase]);

  async function loadSmartStats() {
    try {
      const { data } = await api.get("/study/flashcards/due");
      setSmartStats(data);
    } catch {
      setSmartStats({ due: [], dueCount: 0, totalCount: 0 });
    }
  }

  function startSmartReview() {
    if (!smartStats?.due?.length) return;
    setSmartDeck(smartStats.due);
    setSmartIdx(0);
    setSmartPhase("session");
  }

  async function generateSmartCards() {
    setGenerating(true);
    try {
      const { data } = await api.post("/study/generate-flashcards", {
        category: smartCategory,
        count: 15,
        difficulty: smartDifficulty,
      });
      if (!data.cards?.length) {
        toast("Couldn't generate new cards right now — try again shortly.", { icon: "⚠️" });
        return;
      }
      setSmartDeck(data.cards);
      setSmartIdx(0);
      setSmartPhase("session");
    } catch (err) {
      if (err?.response?.status === 429) {
        toast(err.response.data?.detail || "Daily flashcard generation limit reached — try again tomorrow.", { icon: "🚫", duration: 5000 });
      } else {
        toast("Couldn't generate new cards right now — try again shortly.", { icon: "⚠️" });
      }
    } finally {
      setGenerating(false);
    }
  }

  async function rateSmartCard(rating) {
    const card = smartDeck[smartIdx];
    try { await api.post(`/study/flashcards/${card.id}/rate?rating=${rating}`); } catch {}
    if (smartIdx + 1 >= smartDeck.length) {
      setSmartPhase("done"); // stats refetch automatically once user returns to home
    } else {
      setSmartIdx((i) => i + 1);
    }
  }

  function buildDeck(reviewOnlyMode = reviewOnly) {
    let pool = categories.length === 0 ? STUDY_TOPICS : STUDY_TOPICS.filter((t) => categories.includes(t.category));
    if (reviewOnlyMode) pool = pool.filter((t) => progress[t.id] === "review");
    if (pool.length === 0 && reviewOnlyMode) {
      toast("No cards marked 'Need Review' in this category. Mark some cards first!", {
        icon: "🔄",
        duration: 4000,
      });
      return;
    }
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
    <div className="min-h-screen px-4 py-8 max-w-4xl mx-auto text-slate-800 dark:text-white">
      <div className="text-center mb-6">
        <div className="text-6xl mb-3">🃏</div>
        <h1 className="text-3xl font-bold mb-2">Flashcards</h1>
        <p className="text-slate-400 text-sm">
          {deckMode === "topic"
            ? "Flip through topics. Mark what you know — review what you don't."
            : "AI-generated cards with spaced repetition — reviewed cards resurface right when you're about to forget them."}
        </p>
      </div>

      {(phase === "browse" && smartPhase === "home") && (
        <div className="flex gap-2 mb-6 glass-card p-1.5">
          <button onClick={() => setDeckMode("topic")}
            className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${deckMode === "topic" ? "bg-indigo-600 text-white" : "text-slate-500 dark:text-slate-400"}`}>
            📖 Topic Deck
          </button>
          <button onClick={() => setDeckMode("smart")}
            className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${deckMode === "smart" ? "bg-indigo-600 text-white" : "text-slate-500 dark:text-slate-400"}`}>
            🧠 Smart Deck (AI)
          </button>
        </div>
      )}

      {deckMode === "smart" && (
        <AnimatePresence mode="wait">
          {smartPhase === "home" && (
            <motion.div key="smart-home" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="glass-card p-4 text-center">
                  <div className="text-2xl font-black">{smartStats === null ? "…" : smartStats.dueCount}</div>
                  <div className="text-xs text-slate-500">Due for review</div>
                </div>
                <div className="glass-card p-4 text-center">
                  <div className="text-2xl font-black">{smartStats === null ? "…" : smartStats.totalCount}</div>
                  <div className="text-xs text-slate-500">Total smart cards</div>
                </div>
              </div>

              {smartStats?.dueCount > 0 && (
                <button onClick={startSmartReview}
                  className="w-full py-4 mb-4 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold text-lg text-white transition-all">
                  🔁 Review {smartStats.dueCount} Due Card{smartStats.dueCount === 1 ? "" : "s"} →
                </button>
              )}

              <div className="glass-card p-4 space-y-4">
                <div className="font-semibold text-sm">Generate new AI cards</div>
                <div className="flex flex-wrap gap-2">
                  {STUDY_CATEGORIES.slice(0, 13).map((c) => (
                    <button key={c.id} onClick={() => setSmartCategory(c.id)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${smartCategory === c.id ? "bg-indigo-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"}`}>
                      {c.icon} {c.label}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  {["all", "Basic", "Intermediate", "Advanced"].map((d) => (
                    <button key={d} onClick={() => setSmartDifficulty(d)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${smartDifficulty === d ? "bg-indigo-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"}`}>
                      {d === "all" ? "Any difficulty" : d}
                    </button>
                  ))}
                </div>
                <button onClick={generateSmartCards} disabled={generating}
                  className="w-full py-3.5 bg-purple-600 hover:bg-purple-500 disabled:opacity-60 disabled:cursor-not-allowed rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2">
                  {generating ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      Generating 15 cards…
                    </>
                  ) : (
                    "✨ Generate 15 New Cards"
                  )}
                </button>
                <p className="text-xs text-slate-400">Capped at 60 cards/day per account to keep things fast for everyone.</p>
              </div>
            </motion.div>
          )}

          {smartPhase === "session" && smartDeck[smartIdx] && (
            <motion.div key={`smart-card-${smartIdx}`} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}>
              <div className="flex items-center justify-between mb-4">
                <button onClick={() => setSmartPhase("home")} className="text-sm text-slate-400 hover:text-slate-700 dark:hover:text-white">← Back</button>
                <span className="text-sm text-slate-400">{smartIdx + 1} / {smartDeck.length}</span>
                <span className="w-10" />
              </div>
              <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full mb-6">
                <motion.div className="h-full bg-indigo-500 rounded-full" animate={{ width: `${((smartIdx + 1) / smartDeck.length) * 100}%` }} />
              </div>
              <SmartFlipCard card={smartDeck[smartIdx]} onRate={rateSmartCard} />
            </motion.div>
          )}

          {smartPhase === "done" && (
            <motion.div key="smart-done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12 space-y-4">
              <div className="text-7xl mb-2">🎉</div>
              <h2 className="text-3xl font-bold">Deck Complete!</h2>
              <p className="text-slate-400">You've gone through all {smartDeck.length} cards. They'll resurface when due.</p>
              <button onClick={() => setSmartPhase("home")}
                className="py-3 px-6 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold text-white transition-all mx-auto">
                Back to Smart Deck
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {deckMode === "topic" && (
      <AnimatePresence mode="wait">

        {phase === "browse" && (
          <motion.div key="browse" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>

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
              <CheckboxBox checked={reviewOnly} onChange={setReviewOnly} />
              <div>
                <div className="font-semibold text-sm">Review mode</div>
                <div className="text-xs text-slate-400">Only show topics you marked "Need Review" (no unseen cards)</div>
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
          <motion.div key="done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12 space-y-4">
            <div className="text-7xl mb-2">🎉</div>
            <h2 className="text-3xl font-bold">Deck Complete!</h2>
            <p className="text-slate-400">You've gone through all {deck.length} cards.</p>
            <div className="flex flex-col gap-3 max-w-xs mx-auto pt-4">
              <button onClick={() => buildDeck(false)}
                className="py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold text-white transition-all">
                🔁 Start Again (all cards)
              </button>
              <button onClick={() => { setReviewOnly(true); buildDeck(true); }}
                className="py-3 bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-400 rounded-xl font-semibold transition-all">
                😅 Review Weak Cards Only
              </button>
              <button onClick={() => setPhase("browse")}
                className="py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl font-semibold transition-all">
                Change Deck / Category
              </button>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
      )}
    </div>
  );
}
