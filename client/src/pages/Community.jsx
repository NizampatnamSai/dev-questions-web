import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import api from "../api/axios";
import QuestionCard from "../components/QuestionCard";

const CATEGORIES = ["HTML/CSS", "JavaScript", "React", "Next.js", "React Native"];
const LEVELS = ["Low", "Medium", "High"];
const TYPES = ["Technical", "Coding"];

export default function Community() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("");
  const [level, setLevel] = useState("");
  const [type, setType] = useState("");
  const [search, setSearch] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const params = {};
      if (category) params.category = category;
      if (level) params.level = level;
      if (type) params.type = type;
      if (search) params.search = search;
      const { data } = await api.get("/questions/community", { params });
      setQuestions(data);
    } catch {
      toast.error("Failed to load community feed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, level, type]);

  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const toggleUpvote = async (q) => {
    try {
      const { data } = await api.post(`/questions/${q.id}/upvote`);
      setQuestions((qs) => qs.map((x) => (x.id === q.id ? { ...x, ...data } : x)));
    } catch {
      toast.error("Please log in to upvote");
    }
  };

  const toggleBookmark = async (q) => {
    try {
      const { data } = await api.post(`/questions/${q.id}/bookmark`);
      setQuestions((qs) => qs.map((x) => (x.id === q.id ? { ...x, ...data } : x)));
      toast.success(data.isBookmarked ? "Saved to bookmarks" : "Removed from bookmarks");
    } catch {
      toast.error("Please log in to bookmark");
    }
  };

  const toggleHighlight = async (q) => {
    try {
      const { data } = await api.post(`/questions/${q.id}/highlight`);
      setQuestions((qs) => qs.map((x) => (x.id === q.id ? { ...x, ...data } : x)));
    } catch {
      toast.error("Please log in to highlight");
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">🌍 Community Feed</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Browse questions posted by the DevQuiz community.
        </p>
      </div>

      <div className="glass-card p-4 flex flex-col sm:flex-row gap-3 flex-wrap">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search questions..."
          className="input-light flex-1 min-w-[200px] !py-2"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="input-light !w-auto !py-2"
        >
          <option value="">All Categories</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select
          value={level}
          onChange={(e) => setLevel(e.target.value)}
          className="input-light !w-auto !py-2"
        >
          <option value="">All Levels</option>
          {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
        </select>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="input-light !w-auto !py-2"
        >
          <option value="">All Types</option>
          {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      {loading ? (
        <p className="text-sm text-slate-400">Loading...</p>
      ) : questions.length === 0 ? (
        <p className="text-sm text-slate-400">No questions found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AnimatePresence>
            {questions.map((q) => (
              <QuestionCard key={q.id} q={q} onUpvote={toggleUpvote} onHighlight={toggleHighlight} onBookmark={toggleBookmark} />
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}
