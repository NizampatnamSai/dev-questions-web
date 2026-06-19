import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import api from "../api/axios";
import QuestionCard from "../components/QuestionCard";

export default function MyQuestions() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/questions/mine");
      setQuestions(data);
    } catch {
      toast.error("Failed to load your questions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const toggleHighlight = async (q) => {
    try {
      const { data } = await api.post(`/questions/${q.id}/highlight`);
      setQuestions((qs) => qs.map((x) => (x.id === q.id ? { ...x, ...data } : x)));
    } catch {
      toast.error("Failed to highlight");
    }
  };

  const handleDelete = async (q) => {
    if (!confirm("Delete this question?")) return;
    try {
      await api.delete(`/questions/${q.id}`);
      setQuestions((qs) => qs.filter((x) => x.id !== q.id));
      toast.success("Deleted");
    } catch {
      toast.error("Failed to delete");
    }
  };

  const saveEdit = async () => {
    try {
      const { data } = await api.put(`/questions/${editing.id}`, editing);
      setQuestions((qs) => qs.map((x) => (x.id === data.id ? data : x)));
      toast.success("Updated");
      setEditing(null);
    } catch {
      toast.error("Failed to update");
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">📝 My Questions</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Manage the questions you've posted — drafts and published.
        </p>
      </div>

      {loading ? (
        <p className="text-sm text-slate-400">Loading...</p>
      ) : questions.length === 0 ? (
        <p className="text-sm text-slate-400">You haven't posted any questions yet. Try the AI Generator!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AnimatePresence>
            {questions.map((q) => (
              <QuestionCard
                key={q.id}
                q={q}
                showOwnerActions
                onHighlight={toggleHighlight}
                onEdit={(item) => setEditing({ ...item })}
                onDelete={handleDelete}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      <AnimatePresence>
        {editing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="glass-card p-6 w-full max-w-lg space-y-3"
            >
              <h2 className="font-semibold text-slate-800 dark:text-slate-100">Edit Question</h2>
              <textarea
                value={editing.question}
                onChange={(e) => setEditing({ ...editing, question: e.target.value })}
                className="input-light text-sm resize-none"
                rows={2}
              />
              <textarea
                value={editing.answer}
                onChange={(e) => setEditing({ ...editing, answer: e.target.value })}
                className="input-light text-sm resize-none"
                rows={3}
              />
              <select
                value={editing.status}
                onChange={(e) => setEditing({ ...editing, status: e.target.value })}
                className="input-light !py-2"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
              <div className="flex gap-2 justify-end pt-2">
                <button
                  onClick={() => setEditing(null)}
                  className="text-xs px-4 py-2 rounded-full border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  onClick={saveEdit}
                  className="text-xs px-4 py-2 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold"
                >
                  Save Changes
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
