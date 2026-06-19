import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { STUDY_CATEGORIES, STUDY_TOPICS } from "../data/studyGuide";

const DIFF_COLOR = {
  Basic:        "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  Intermediate: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  Advanced:     "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

function TopicCard({ topic, reviewed, onToggleReview }) {
  const [open, setOpen] = useState(false);
  const [tab, setTab]   = useState("explanation"); // explanation | code | tip

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`glass-card overflow-hidden border transition-colors ${
        reviewed ? "border-indigo-300/50 dark:border-indigo-500/30" : ""
      }`}
    >
      {/* Header */}
      <button
        className="w-full text-left p-4 flex items-start gap-3"
        onClick={() => setOpen(v => !v)}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${DIFF_COLOR[topic.difficulty]}`}>
              {topic.difficulty}
            </span>
            {reviewed && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                ✓ Reviewed
              </span>
            )}
          </div>
          <p className="font-semibold text-slate-800 dark:text-slate-100 text-sm leading-snug">{topic.title}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">{topic.summary}</p>
        </div>
        <span className="text-slate-400 text-sm mt-0.5 flex-shrink-0">{open ? "▲" : "▼"}</span>
      </button>

      {/* Expanded content */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-3 border-t border-black/5 dark:border-white/10 pt-3">
              {/* Tabs */}
              <div className="flex gap-1">
                {[
                  { id: "explanation", label: "📖 Explanation" },
                  ...(topic.code ? [{ id: "code", label: "💻 Code" }] : []),
                  { id: "tip", label: "🎯 Interview Tip" },
                ].map(t => (
                  <button key={t.id} onClick={() => setTab(t.id)}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition ${
                      tab === t.id
                        ? "bg-indigo-500 text-white"
                        : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5"
                    }`}>
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Explanation */}
              {tab === "explanation" && (
                <div className="space-y-3">
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                    {topic.explanation}
                  </p>
                  {topic.keyPoints?.length > 0 && (
                    <div className="bg-slate-50 dark:bg-white/5 rounded-xl p-3 space-y-1.5">
                      <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">Key Points</p>
                      {topic.keyPoints.map((p, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <span className="text-indigo-500 text-xs mt-0.5 flex-shrink-0">▸</span>
                          <p className="text-sm text-slate-700 dark:text-slate-300">{p}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Code */}
              {tab === "code" && topic.code && (
                <pre className="bg-slate-900 dark:bg-black/40 text-slate-100 rounded-xl p-4 text-xs overflow-x-auto leading-relaxed font-mono whitespace-pre">
                  {topic.code}
                </pre>
              )}

              {/* Interview tip */}
              {tab === "tip" && (
                <div className="bg-amber-50 dark:bg-amber-900/15 border border-amber-200 dark:border-amber-500/20 rounded-xl p-4">
                  <p className="text-xs font-bold text-amber-600 dark:text-amber-400 mb-2">🎯 What Interviewers Are Really Testing</p>
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{topic.interviewTip}</p>
                </div>
              )}

              {/* Mark reviewed */}
              <button
                onClick={() => onToggleReview(topic.id)}
                className={`w-full py-2 rounded-xl text-xs font-semibold border transition ${
                  reviewed
                    ? "border-indigo-300 dark:border-indigo-600 text-indigo-500 bg-indigo-50 dark:bg-indigo-900/20"
                    : "border-slate-200 dark:border-white/10 text-slate-500 hover:border-indigo-300 hover:text-indigo-500"
                }`}
              >
                {reviewed ? "✓ Marked as Reviewed" : "Mark as Reviewed"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function StudyGuide() {
  const [activeCategory, setActiveCategory] = useState("html");
  const [activeDiff, setActiveDiff]         = useState("All");
  const [search, setSearch]                 = useState("");
  const [reviewed, setReviewed]             = useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem("devquiz_reviewed") || "[]")); }
    catch { return new Set(); }
  });

  const toggleReview = (id) => {
    setReviewed(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      localStorage.setItem("devquiz_reviewed", JSON.stringify([...next]));
      return next;
    });
  };

  const category = STUDY_CATEGORIES.find(c => c.id === activeCategory);

  const topics = useMemo(() => {
    return STUDY_TOPICS.filter(t => {
      if (t.category !== activeCategory) return false;
      if (activeDiff !== "All" && t.difficulty !== activeDiff) return false;
      if (search && !t.title.toLowerCase().includes(search.toLowerCase()) &&
          !t.summary.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [activeCategory, activeDiff, search]);

  const categoryTopics = STUDY_TOPICS.filter(t => t.category === activeCategory);
  const reviewedCount  = categoryTopics.filter(t => reviewed.has(t.id)).length;
  const progress       = categoryTopics.length ? Math.round((reviewedCount / categoryTopics.length) * 100) : 0;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">📚 Study Hub</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Core concepts with explanations, code examples & interview tips
        </p>
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 flex-wrap">
        {STUDY_CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => { setActiveCategory(cat.id); setSearch(""); setActiveDiff("All"); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
              activeCategory === cat.id
                ? "border-transparent text-white shadow-md"
                : "border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:border-slate-300"
            }`}
            style={activeCategory === cat.id ? { backgroundColor: cat.color, color: cat.id === "nextjs" ? "#000" : "#fff" } : {}}
          >
            <span>{cat.icon}</span>
            {cat.label}
          </button>
        ))}
      </div>

      {/* Progress + filters */}
      <div className="glass-card p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
              {category?.label} Progress
            </p>
            <p className="text-sm font-bold text-slate-700 dark:text-slate-200 mt-0.5">
              {reviewedCount} / {categoryTopics.length} reviewed
            </p>
          </div>
          <span className="text-2xl font-black text-indigo-500">{progress}%</span>
        </div>
        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
          <motion.div
            className="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2 flex-wrap pt-1">
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search topics…"
            className="input-light text-xs py-1.5 flex-1 min-w-32"
          />
          {["All", "Basic", "Intermediate", "Advanced"].map(d => (
            <button key={d} onClick={() => setActiveDiff(d)}
              className={`text-xs px-3 py-1.5 rounded-lg font-semibold border transition ${
                activeDiff === d
                  ? "bg-indigo-500 border-indigo-500 text-white"
                  : "border-slate-200 dark:border-white/10 text-slate-500 hover:border-indigo-300 hover:text-indigo-500"
              }`}>
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Topics */}
      <div className="space-y-3">
        {topics.length === 0 ? (
          <div className="glass-card p-8 text-center text-slate-400 text-sm">
            No topics match your filters.
          </div>
        ) : (
          topics.map(topic => (
            <TopicCard
              key={topic.id}
              topic={topic}
              reviewed={reviewed.has(topic.id)}
              onToggleReview={toggleReview}
            />
          ))
        )}
      </div>
    </div>
  );
}
