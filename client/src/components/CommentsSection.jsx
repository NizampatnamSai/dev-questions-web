import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import ConfirmModal from "./ConfirmModal";
import useConfirm from "../hooks/useConfirm";
import { fmtDate } from "../utils/time";

export default function CommentsSection({ questionId }) {
  const { confirm, confirmProps } = useConfirm();
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadComments();
  }, [questionId]);

  const loadComments = async () => {
    try {
      const { data } = await api.get(`/discussion/questions/${questionId}/comments`);
      setComments(data);
    } catch {
      toast.error("Failed to load comments");
    } finally {
      setLoading(false);
    }
  };

  const submitComment = async () => {
    if (!newComment.trim()) {
      toast.error("Please enter a comment");
      return;
    }

    setSubmitting(true);
    try {
      const { data } = await api.post(`/discussion/questions/${questionId}/comments`, {
        text: newComment,
      });
      setComments(prev => [data, ...prev]);
      setNewComment("");
      toast.success("Comment posted!");
    } catch {
      toast.error("Failed to post comment");
    } finally {
      setSubmitting(false);
    }
  };

  const deleteComment = (commentId) => {
    confirm({
      title: "Delete this comment?",
      message: "This cannot be undone.",
      confirmLabel: "Delete",
      onConfirm: async () => {
        try {
          await api.delete(`/discussion/comments/${commentId}`);
          setComments(prev => prev.filter(c => c.id !== commentId));
          toast.success("Comment deleted");
        } catch { toast.error("Failed to delete comment"); }
      },
    });
  };

  const voteComment = async (commentId) => {
    try {
      const { data } = await api.post(`/discussion/comments/${commentId}/vote`);
      setComments(prev =>
        prev.map(c =>
          c.id === commentId ? { ...c, votes: data.votes, isVoted: data.voted } : c
        )
      );
    } catch {
      toast.error("Failed to vote");
    }
  };

  return (
    <>
    <div className="space-y-6">
      <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">💬 Comments ({comments.length})</h3>

      {/* New Comment */}
      {user && !user.isGuest && (
        <div className="glass-card p-4 space-y-3">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            rows={3}
            className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-sm outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          />
          <button
            onClick={submitComment}
            disabled={submitting || !newComment.trim()}
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-500 disabled:opacity-50 transition-colors"
          >
            {submitting ? "Posting..." : "Post Comment"}
          </button>
        </div>
      )}

      {/* Comments List */}
      {loading ? (
        <div className="text-center py-6 text-slate-400">Loading comments...</div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8 text-slate-400">
          <p>No comments yet. Be the first to comment!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {comments.map((comment) => (
            <motion.div
              key={comment.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-4 space-y-2"
            >
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="font-medium text-slate-800 dark:text-slate-100">{comment.userName}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {fmtDate(comment.createdAt)}
                  </p>
                </div>
                {user && (user.id === comment.userId || user.role === "admin") && (
                  <button
                    onClick={() => deleteComment(comment.id)}
                    className="text-xs text-red-600 dark:text-red-400 hover:underline"
                  >
                    Delete
                  </button>
                )}
              </div>
              <p className="text-slate-700 dark:text-slate-300 text-sm">{comment.text}</p>
              <button
                onClick={() => voteComment(comment.id)}
                className="text-xs text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                👍 {comment.votes || 0}
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
    <ConfirmModal {...confirmProps} />
    </>
  );
}
