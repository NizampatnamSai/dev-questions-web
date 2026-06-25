import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import api from "../api/axios";
import QuestionCard from "../components/QuestionCard";
import { useAuth } from "../context/AuthContext";
import ConfirmModal from "../components/ConfirmModal";
import useConfirm from "../hooks/useConfirm";

export default function Bookmarks() {
  const { confirm, confirmProps } = useConfirm();
  const { user } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const isAdmin = user?.role === "admin" || user?.role === "sub_admin";

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
    const toastId = toast.loading("Updating bookmark...");

    try {
      await api.post(`/questions/${q.id}/bookmark`);

      setQuestions((qs) => qs.filter((x) => x.id !== q.id));

      toast.success("Removed from bookmarks", {
        id: toastId,
      });
    } catch (err) {
      toast.error("Failed to update bookmark", {
        id: toastId,
      });
    }
  };

  const toggleUpvote = async (q) => {
    try {
      const { data } = await api.post(`/questions/${q.id}/upvote`);
      setQuestions((qs) =>
        qs.map((x) => (x.id === q.id ? { ...x, ...data } : x)),
      );
    } catch {
      toast.error("Failed to upvote");
    }
  };

  const toggleHighlight = async (q) => {
    try {
      const { data } = await api.post(`/questions/${q.id}/highlight`);
      setQuestions((qs) =>
        qs.map((x) => (x.id === q.id ? { ...x, ...data } : x)),
      );
    } catch {
      toast.error("Failed to highlight");
    }
  };

  const adminDelete = (q) => {
    confirm({
      title: "Delete this question?",
      message: `"${q.question.slice(0, 60)}…" — The author will be notified.`,
      confirmLabel: "Delete",
      onConfirm: async () => {
        try {
          await api.delete(`/questions/${q.id}`);
          setQuestions((qs) => qs.filter((x) => x.id !== q.id));
          toast.success("Question deleted");
        } catch {
          toast.error("Failed to delete");
        }
      },
    });
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-6"
      >
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
            🔖 Bookmarks
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Questions you've saved for later.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="glass-card p-5 space-y-3 animate-pulse">
                <div className="flex gap-2">
                  <div className="h-4 w-20 bg-slate-200 dark:bg-slate-700 rounded-full" />
                  <div className="h-4 w-14 bg-slate-200 dark:bg-slate-700 rounded-full" />
                </div>
                <div className="space-y-1.5">
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full" />
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-5/6" />
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
                </div>
                <div className="flex gap-3 pt-1">
                  <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-14" />
                  <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-14" />
                </div>
              </div>
            ))}
          </div>
        ) : questions.length === 0 ? (
          <p className="text-sm text-slate-400">
            No bookmarks yet. Save questions from the Community feed!
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AnimatePresence>
              {questions.map((q) => (
                <QuestionCard
                  key={q.id}
                  q={q}
                  onUpvote={toggleUpvote}
                  onHighlight={toggleHighlight}
                  onBookmark={toggleBookmark}
                  onDelete={isAdmin ? adminDelete : undefined}
                  isAdmin={isAdmin}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </motion.div>
      <ConfirmModal {...confirmProps} />
    </>
  );
}
