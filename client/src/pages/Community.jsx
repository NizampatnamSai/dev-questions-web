import { useEffect, useState, useCallback, useRef, memo } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import api from "../api/axios";
import QuestionCard from "../components/QuestionCard";

const CATEGORIES = ["HTML/CSS", "JavaScript", "React", "Next.js", "React Native"];
const LEVELS     = ["Low", "Medium", "High"];
const TYPES      = ["Technical", "Coding"];
const PAGE_SIZE  = 15;

function Skeleton() {
  return (
    <div className="glass-card p-5 animate-pulse space-y-3">
      <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/3" />
      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full" />
      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-4/5" />
      <div className="flex gap-3 pt-1">
        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-16" />
        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-16" />
      </div>
    </div>
  );
}

const MemoCard = memo(({ q, onUpvote, onHighlight, onBookmark }) => (
  <QuestionCard q={q} onUpvote={onUpvote} onHighlight={onHighlight} onBookmark={onBookmark} />
), (prev, next) => (
  prev.q.id             === next.q.id &&
  prev.q.upvoteCount    === next.q.upvoteCount &&
  prev.q.isUpvoted      === next.q.isUpvoted &&
  prev.q.isBookmarked   === next.q.isBookmarked &&
  prev.q.isHighlighted  === next.q.isHighlighted &&
  prev.q.highlightCount === next.q.highlightCount &&
  prev.q.commentCount   === next.q.commentCount
));

export default function Community() {
  const [questions, setQuestions] = useState([]);
  const [page, setPage]           = useState(1);
  const [hasMore, setHasMore]     = useState(true);
  const [total, setTotal]         = useState(0);
  const [loading, setLoading]     = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [category, setCategory]   = useState("");
  const [level, setLevel]         = useState("");
  const [type, setType]           = useState("");
  const [search, setSearch]       = useState("");
  const searchTimer               = useRef(null);
  const sentinelRef               = useRef(null);
  const filtersRef                = useRef({ category, level, type, search });

  // Keep filters ref in sync so the IntersectionObserver callback reads fresh values
  useEffect(() => { filtersRef.current = { category, level, type, search }; }, [category, level, type, search]);

  const buildParams = (overrides = {}) => {
    const f = { ...filtersRef.current, ...overrides };
    const p = {};
    if (f.category) p.category = f.category;
    if (f.level)    p.level    = f.level;
    if (f.type)     p.type     = f.type;
    if (f.search)   p.search   = f.search;
    return p;
  };

  // Initial / filter-change load — resets list
  const load = useCallback(async (params = {}) => {
    setLoading(true);
    setQuestions([]);
    setPage(1);
    try {
      const { data } = await api.get("/questions/community", { params: { ...params, page: 1, page_size: PAGE_SIZE } });
      setQuestions(data.items ?? []);
      setTotal(data.total ?? 0);
      setHasMore(data.has_more ?? false);
    } catch {
      toast.error("Failed to load community feed");
    } finally {
      setLoading(false);
    }
  }, []);

  // Load next page
  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    const nextPage = page + 1;
    try {
      const { data } = await api.get("/questions/community", {
        params: { ...buildParams(), page: nextPage, page_size: PAGE_SIZE },
      });
      setQuestions(prev => [...prev, ...(data.items ?? [])]);
      setPage(nextPage);
      setHasMore(data.has_more ?? false);
    } catch {
      toast.error("Failed to load more");
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, hasMore, page]);

  // Reload when filters change
  useEffect(() => {
    load(buildParams());
  }, [category, level, type]); // eslint-disable-line

  // Debounced search
  useEffect(() => {
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      load(buildParams());
    }, 400);
    return () => clearTimeout(searchTimer.current);
  }, [search]); // eslint-disable-line

  // IntersectionObserver — fire loadMore when sentinel enters viewport
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && hasMore && !loadingMore) loadMore(); },
      { rootMargin: "0px", threshold: 1.0 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [loadMore, hasMore, loadingMore]);

  const updateQ = useCallback((updated) =>
    setQuestions(qs => qs.map(x => x.id === updated.id ? { ...x, ...updated } : x))
  , []);

  const toggleUpvote   = useCallback(async (q) => {
    try { const { data } = await api.post(`/questions/${q.id}/upvote`);   updateQ(data); }
    catch { toast.error("Please log in to upvote"); }
  }, [updateQ]);

  const toggleBookmark = useCallback(async (q) => {
    try {
      const { data } = await api.post(`/questions/${q.id}/bookmark`); updateQ(data);
      toast.success(data.isBookmarked ? "Saved to bookmarks" : "Removed from bookmarks");
    } catch { toast.error("Please log in to bookmark"); }
  }, [updateQ]);

  const toggleHighlight = useCallback(async (q) => {
    try { const { data } = await api.post(`/questions/${q.id}/highlight`); updateQ(data); }
    catch { toast.error("Please log in to highlight"); }
  }, [updateQ]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">🌍 Community Feed</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Browse questions posted by the DevQuiz community.</p>
      </div>

      {/* Filters */}
      <div className="glass-card p-4 flex flex-col sm:flex-row gap-3 flex-wrap">
        <input value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search questions…"
          className="input-light flex-1 min-w-[200px] !py-2" />
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

      {!loading && (
        <p className="text-xs text-slate-400">
          Showing <strong className="text-slate-600 dark:text-slate-300">{questions.length}</strong> of {total} questions
        </p>
      )}

      {/* Initial skeleton */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} />)}
        </div>
      ) : questions.length === 0 ? (
        <p className="text-sm text-slate-400 text-center py-12">No questions found.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {questions.map((q) => (
              <MemoCard key={q.id} q={q} onUpvote={toggleUpvote} onHighlight={toggleHighlight} onBookmark={toggleBookmark} />
            ))}
          </div>

          {/* Load more */}
          <div ref={sentinelRef} className="flex flex-col items-center gap-3 py-4">
            {loadingMore && (
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                Loading more…
              </div>
            )}
            {hasMore && !loadingMore && (
              <button
                onClick={loadMore}
                className="px-6 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 text-sm font-medium hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
              >
                Load more ({total - questions.length} remaining)
              </button>
            )}
            {!hasMore && questions.length > 0 && (
              <p className="text-xs text-slate-400">You've seen all {total} questions 🎉</p>
            )}
          </div>
        </>
      )}
    </motion.div>
  );
}
