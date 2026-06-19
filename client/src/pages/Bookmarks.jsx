import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import api from "../api/axios";
import QuestionCard from "../components/QuestionCard";

export default function Bookmarks() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/questions/bookmarks");
      setQuestions(data);
    } catch {
      toast.error("Failed to load bookmarks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const toggleBookmark = async (q) => {
    try {
      await api.post(`/questions/${q.id}/bookmark`);
      setQuestions((qs) => qs.filter((x) => x.id !== q.id));
      toast.success("Removed from bookmarks");
    } catch {
      toast.error("Failed to update bookmark");
    }
  };

  const toggleUpvote = async (q) => {
    try {
      const { data } = await api.post(`/questions/${q.id}/upvote`);
      setQuestions((qs) => qs.map((x) => (x.id === q.id ? { ...x, ...data } : x)));
    } catch {
      toast.error("Failed to upvote");
    }
  };

  const toggleHighlight = async (q) => {
    try {
      const { data } = await api.post(`/questions/${q.id}/highlight`);
      setQuestions((qs) => qs.map((x) => (x.id === q.id ? { ...x, ...data } : x)));
    } catch {
      toast.error("Failed to highlight");
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">🔖 Bookmarks</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Questions you've saved for later.</p>
      </div>

      {loading ? (
        <p className="text-sm text-slate-400">Loading...</p>
      ) : questions.length === 0 ? (
        <p className="text-sm text-slate-400">No bookmarks yet. Save questions from the Community feed!</p>
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
