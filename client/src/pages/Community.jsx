import { useEffect, useState, useCallback, useRef, memo } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import api from "../api/axios";
import QuestionCard from "../components/QuestionCard";

const CATEGORIES = ["HTML/CSS", "JavaScript", "React", "Next.js", "React Native"];
const LEVELS     = ["Low", "Medium", "High"];
const TYPES      = ["Technical", "Coding"];
const PAGE_SIZE  = 20;

// Memoized card — only re-renders when this specific question changes
const MemoCard = memo(({ q, onUpvote, onHighlight, onBookmark }) => (
  <QuestionCard q={q} onUpvote={onUpvote} onHighlight={onHighlight} onBookmark={onBookmark} />
), (prev, next) => (
  prev.q.id            === next.q.id &&
  prev.q.upvoteCount   === next.q.upvoteCount &&
  prev.q.isUpvoted     === next.q.isUpvoted &&
  prev.q.isBookmarked  === next.q.isBookmarked &&
  prev.q.isHighlighted === next.q.isHighlighted &&
  prev.q.highlightCount === next.q.highlightCount &&
  prev.q.commentCount  === next.q.commentCount
));

export default function Community() {
  const [allQuestions, setAllQuestions] = useState([]);
  const [visible, setVisible]           = useState(PAGE_SIZE);
  const [loading, setLoading]           = useState(true);
  const [category, setCategory]         = useState("");
  const [level, setLevel]               = useState("");
  const [type, setType]                 = useState("");
  const [search, setSearch]             = useState("");
  const searchTimer                     = useRef(null);
  const loaderRef                       = useRef(null);

  const load = useCallback(async (params = {}) => {
    setLoading(true);
    setVisible(PAGE_SIZE);
    try {
      const { data } = await api.get("/questions/community", { params });
      setAllQuestions(data);
    } catch {
      toast.error("Failed to load community feed");
    } finally {
      setLoading(false);
    }
  }, []);

  // Reload when filters change
  useEffect(() => {
    const params = {};
    if (category) params.category = category;
    if (level)    params.level    = level;
    if (type)     params.type     = type;
    if (search)   params.search   = search;
    load(params);
  }, [category, level, type]); // eslint-disable-line

  // Debounced search
  useEffect(() => {
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      const params = {};
      if (category) params.category = category;
      if (level)    params.level    = level;
      if (type)     params.type     = type;
      if (search)   params.search   = search;
      load(params);
    }, 400);
    return () => clearTimeout(searchTimer.current);
  }, [search]); // eslint-disable-line

  // Infinite scroll via IntersectionObserver
  useEffect(() => {
    const el = loaderRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(v => v + PAGE_SIZE); },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [allQuestions]);

  const updateQ = useCallback((updated) =>
    setAllQuestions(qs => qs.map(x => x.id === updated.id ? { ...x, ...updated } : x))
  , []);

  const toggleUpvote = useCallback(async (q) => {
    try {
      const { data } = await api.post(`/questions/${q.id}/upvote`);
      updateQ(data);
    } catch { toast.error("Please log in to upvote"); }
  }, [updateQ]);

  const toggleBookmark = useCallback(async (q) => {
    try {
      const { data } = await api.post(`/questions/${q.id}/bookmark`);
      updateQ(data);
      toast.success(data.isBookmarked ? "Saved to bookmarks" : "Removed from bookmarks");
    } catch { toast.error("Please log in to bookmark"); }
  }, [updateQ]);

  const toggleHighlight = useCallback(async (q) => {
    try {
      const { data } = await api.post(`/questions/${q.id}/highlight`);
      updateQ(data);
    } catch { toast.error("Please log in to highlight"); }
  }, [updateQ]);

  const displayed = allQuestions.slice(0, visible);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">🌍 Community Feed</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Browse questions posted by the DevQuiz community.
        </p>
      </div>

      {/* Filters */}
      <div className="glass-card p-4 flex flex-col sm:flex-row gap-3 flex-wrap">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search questions..."
          className="input-light flex-1 min-w-[200px] !py-2"
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="input-light !w-auto !py-2">
          <option value="">All Categories</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={level} onChange={(e) => setLevel(e.target.value)} className="input-light !w-auto !py-2">
          <option value="">All Levels</option>
          {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
        </select>
        <select value={type} onChange={(e) => setType(e.target.value)} className="input-light !w-auto !py-2">
          <option value="">All Types</option>
          {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      {/* Count */}
      {!loading && allQuestions.length > 0 && (
        <p className="text-xs text-slate-400">
          Showing {Math.min(visible, allQuestions.length)} of {allQuestions.length} questions
        </p>
      )}

      {/* List */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="glass-card p-5 animate-pulse space-y-3">
              <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/3" />
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full" />
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-4/5" />
            </div>
          ))}
        </div>
      ) : allQuestions.length === 0 ? (
        <p className="text-sm text-slate-400">No questions found.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {displayed.map((q) => (
              <MemoCard
                key={q.id}
                q={q}
                onUpvote={toggleUpvote}
                onHighlight={toggleHighlight}
                onBookmark={toggleBookmark}
              />
            ))}
          </div>
          {/* Infinite scroll trigger */}
          {visible < allQuestions.length && (
            <div ref={loaderRef} className="flex justify-center py-6">
              <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
          {visible >= allQuestions.length && allQuestions.length > PAGE_SIZE && (
            <p className="text-center text-xs text-slate-400 py-4">All {allQuestions.length} questions loaded</p>
          )}
        </>
      )}
    </motion.div>
  );
}
