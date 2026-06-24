import { useEffect, useState, useCallback, useRef, memo, useMemo } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import api from "../api/axios";
import QuestionCard from "../components/QuestionCard";
import { useAuth } from "../context/AuthContext";
import ConfirmModal from "../components/ConfirmModal";
import useConfirm from "../hooks/useConfirm";

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

const MemoCard = memo(({ q, onUpvote, onHighlight, onBookmark, onDelete, isAdmin }) => (
  <QuestionCard q={q} onUpvote={onUpvote} onHighlight={onHighlight} onBookmark={onBookmark} onDelete={onDelete} isAdmin={isAdmin} />
), (prev, next) => (
  prev.q.id             === next.q.id &&
  prev.q.upvoteCount    === next.q.upvoteCount &&
  prev.q.isUpvoted      === next.q.isUpvoted &&
  prev.q.isBookmarked   === next.q.isBookmarked &&
  prev.q.isHighlighted  === next.q.isHighlighted &&
  prev.q.highlightCount === next.q.highlightCount &&
  prev.q.commentCount   === next.q.commentCount &&
  prev.isAdmin          === next.isAdmin
));

export default function Community() {
  const { confirm, confirmProps } = useConfirm();
  const { user } = useAuth();
  const [todayPoster, setTodayPoster] = useState(null);
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

  useEffect(() => { filtersRef.current = { category, level, type, search }; }, [category, level, type, search]);

  useEffect(() => {
    api.get("/questions/community-today").then(r => setTodayPoster(r.data)).catch(() => {});
  }, []);

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
    const timer = setTimeout(() => load(buildParams()), 100);
    return () => clearTimeout(timer);
  }, [category, level, type, load]);

  // Debounced search
  useEffect(() => {
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      load(buildParams());
    }, 500);
    return () => clearTimeout(searchTimer.current);
  }, [search, load]);

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

  const isGuest = user?.isGuest;

  const toggleUpvote   = useCallback(async (q) => {
    if (isGuest) {
      toast.error("Create an account to upvote questions", { icon: "🔒" });
      return;
    }
    try { const { data } = await api.post(`/questions/${q.id}/upvote`);   updateQ(data); }
    catch (err) { toast.error(err.response?.data?.detail || "Failed to upvote"); }
  }, [updateQ, isGuest]);

  const toggleBookmark = useCallback(async (q) => {
    if (isGuest) {
      toast.error("Create an account to bookmark questions", { icon: "🔒" });
      return;
    }
    try {
      const { data } = await api.post(`/questions/${q.id}/bookmark`); updateQ(data);
      toast.success(data.isBookmarked ? "Saved to bookmarks" : "Removed from bookmarks");
    } catch (err) { toast.error(err.response?.data?.detail || "Failed to bookmark"); }
  }, [updateQ, isGuest]);

  const toggleHighlight = useCallback(async (q) => {
    if (isGuest) {
      toast.error("Create an account to highlight questions", { icon: "🔒" });
      return;
    }
    try { const { data } = await api.post(`/questions/${q.id}/highlight`); updateQ(data); }
    catch (err) { toast.error(err.response?.data?.detail || "Failed to highlight"); }
  }, [updateQ, isGuest]);

  const isAdmin = user?.role === "admin" || user?.role === "sub_admin";

  const adminDelete = useCallback((q) => {
    confirm({
      title: `Delete this question?`,
      message: `"${q.question.slice(0, 60)}…" — The author will be notified.`,
      confirmLabel: "Delete",
      onConfirm: async () => {
        try {
          await api.delete(`/questions/${q.id}`);
          setQuestions(qs => qs.filter(x => x.id !== q.id));
          toast.success("Question deleted");
        } catch { toast.error("Failed to delete"); }
      },
    });
  }, [confirm]);

  return (
    <>
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">🌍 Community Feed</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Browse questions posted by the DevQuiz community.</p>
      </div>

      {/* Daily poster banner */}
      {todayPoster && (
        <div className="space-y-2">
          <div className={`rounded-xl px-4 py-3 text-sm font-medium flex items-center gap-2 ${
            todayPoster.allowed
              ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-700/40"
              : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700"
          }`}>
            {todayPoster.allowed ? (
              <>
                <span>📅</span>
                <span>
                  Today's post: <strong>{todayPoster.allowedName}</strong>
                  {user && user.email === todayPoster.allowedEmail
                    ? " — that's you! 🎉"
                    : ""}
                </span>
              </>
            ) : (
              <><span>🚫</span><span>Community is closed today — no posts scheduled.</span></>
            )}
          </div>
          {todayPoster.myDay && !isAdmin && (() => {
            // Both backend and frontend use Monday-first ordering (0=Mon…6=Sun),
            // but JS getDay() is 0=Sun…6=Sat, so map accordingly.
            const DAYS      = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
            const JS_DAY_OF = [1,2,3,4,5,6,0]; // JS getDay() value for each backend index
            const bIdx = DAYS.indexOf(todayPoster.myDay);
            if (bIdx === -1) return null;
            const myJsDay  = JS_DAY_OF[bIdx];
            const todayJs  = new Date().getDay();
            const daysUntil = (myJsDay - todayJs + 7) % 7;
            const label = daysUntil === 0
              ? "Today is your posting day! 🎉"
              : daysUntil === 1
              ? "Tomorrow is your posting day 📅"
              : `Your posting day is ${todayPoster.myDay} (in ${daysUntil} days) 📅`;
            return (
              <div className="rounded-xl px-4 py-2.5 text-xs font-medium flex items-center gap-2 bg-cyan-50 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-700/40">
                <span>🗓️</span><span>{label}</span>
              </div>
            );
          })()}
        </div>
      )}

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
              <MemoCard key={q.id} q={q} onUpvote={toggleUpvote} onHighlight={toggleHighlight} onBookmark={toggleBookmark} onDelete={isAdmin ? adminDelete : undefined} isAdmin={isAdmin} />
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
    <ConfirmModal {...confirmProps} />
    </>
  );
}
