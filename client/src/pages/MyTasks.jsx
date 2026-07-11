import { createPortal } from "react-dom";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { fmtDateTime } from "../utils/time";
import { TASK_STATUSES, statusMeta } from "../utils/taskStatus";
import { DescriptionPreview } from "./AdminTasks";
import RichTextView from "../components/RichTextView";

const PRIORITY_STYLE = {
  high: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  medium:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  low: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
};

function Avatar({ name, avatar, size = "w-7 h-7" }) {
  if (avatar)
    return (
      <img
        src={avatar}
        alt={name}
        className={`${size} rounded-full object-cover flex-shrink-0`}
      />
    );
  return (
    <div
      className={`${size} rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-xs font-bold text-indigo-600 dark:text-indigo-300 flex-shrink-0`}
    >
      {name?.[0]?.toUpperCase() || "?"}
    </div>
  );
}

function TaskCard({ task, myId, updating, onMove, onView, onToggleExpand, expanded, isAdmin }) {
  const meta = statusMeta(task.status);
  const curIdx = TASK_STATUSES.findIndex((s) => s.key === task.status);
  return (
    <div className="glass-card overflow-hidden">
      <div className="p-4 space-y-2.5">
        {/* Fixed-height content block — description/title overflow is handled by
            DescriptionPreview's own "View More", so every card stays the same
            height regardless of content length. */}
        <div className="h-[134px] overflow-hidden">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${PRIORITY_STYLE[task.priority]}`}>
                {task.priority}
              </span>
              {task.dueDate && (
                <span className="text-[10px] text-slate-400">📅 {task.dueDate}</span>
              )}
            </div>
          </div>

          <h3
            onClick={() => onView(task)}
            className="font-semibold text-sm text-slate-800 dark:text-slate-100 cursor-pointer hover:text-indigo-500 transition line-clamp-1"
          >
            {task.title}
          </h3>

          {task.description && (
            <DescriptionPreview text={task.description} onView={() => onView(task)} />
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <div className="flex -space-x-1">
            {task.assignees.slice(0, 4).map((a) => (
              <div key={a.id} title={a.name}>
                <Avatar name={a.name} avatar={a.avatar} size="w-5 h-5" />
              </div>
            ))}
          </div>
          <span className="text-[10px] text-slate-400">From {task.createdByName}</span>
        </div>

        {/* Move between columns — regular assignees move one stage at a time and
            can't self-mark "completed" (an admin signs off on that); admins have
            full control here too, in case a task is assigned to them directly. */}
        <div className="flex gap-1 flex-wrap pt-1">
          {TASK_STATUSES.map((s, i) => {
            const isCurrent = s.key === task.status;
            const blocked = !isAdmin && !isCurrent && (s.key === "completed" || i > curIdx + 1);
            return (
              <button
                key={s.key}
                onClick={() => onMove(task, s.key)}
                disabled={updating || isCurrent || blocked}
                title={blocked ? (s.key === "completed" ? "Only an admin can mark this completed" : "Move one stage at a time") : s.label}
                className={`text-[10px] px-1.5 py-0.5 rounded-lg font-medium transition whitespace-nowrap ${
                  isCurrent
                    ? `${meta.badge} cursor-default`
                    : blocked
                      ? "bg-slate-50 dark:bg-slate-800/40 text-slate-300 dark:text-slate-600 cursor-not-allowed"
                      : "bg-slate-100 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600"
                }`}
              >
                {s.icon} {s.label}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => onToggleExpand(task.id)}
          className="text-[11px] text-slate-400 hover:text-indigo-500 transition"
        >
          {expanded ? "▲ Hide discussion" : "▼ Discussion"}
        </button>
      </div>
    </div>
  );
}

function DiscussionPanel({ task, comments, newComment, setNewComment, postComment, deleteComment, myId }) {
  return (
    <div className="glass-card p-4 -mt-2 space-y-3 border-t-0 rounded-t-none">
      <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
        Discussion — {task.title}
      </p>
      {(comments[task.id] || []).length === 0 && (
        <p className="text-xs text-slate-400">No comments yet. Be the first!</p>
      )}
      {(comments[task.id] || []).map((c) => (
        <div key={c.id} className={`flex gap-2 ${c.userId === myId ? "flex-row-reverse" : ""}`}>
          <Avatar name={c.userName} avatar={c.avatar} size="w-6 h-6" />
          <div
            className={`max-w-[80%] rounded-2xl px-3 py-1.5 text-xs ${
              c.userId === myId
                ? "bg-indigo-600 text-white rounded-tr-sm"
                : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-tl-sm"
            }`}
          >
            <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
              <span className="font-semibold opacity-80">{c.userId === myId ? "You" : c.userName}</span>
              {c.isAdmin && <span className="text-[9px] bg-white/20 px-1 rounded-full">Admin</span>}
              <span className="text-[9px] opacity-50">{fmtDateTime(c.createdAt)}</span>
              {c.userId === myId && (
                <button onClick={() => deleteComment(task.id, c.id)} className="text-[9px] opacity-50 hover:opacity-100 ml-auto">✕</button>
              )}
            </div>
            <p>{c.text}</p>
          </div>
        </div>
      ))}
      <div className="flex gap-2 pt-1">
        <input
          value={newComment[task.id] || ""}
          onChange={(e) => setNewComment((prev) => ({ ...prev, [task.id]: e.target.value }))}
          onKeyDown={(e) => e.key === "Enter" && postComment(task.id)}
          placeholder="Type a message…"
          className="flex-1 input-light text-xs py-1.5"
        />
        <button onClick={() => postComment(task.id)} className="btn-primary px-3 py-1.5 text-xs">Send</button>
      </div>
    </div>
  );
}

export default function MyTasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [viewTask, setViewTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [comments, setComments] = useState({});
  const [newComment, setNewComment] = useState({});
  const [updating, setUpdating] = useState({});
  const [confirmModal, setConfirmModal] = useState({ open: false, taskId: null, status: null, taskTitle: "" });

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const { data } = await api.get("/tasks");
      setTasks(data);
    } catch {
      toast.error("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  const loadComments = async (taskId) => {
    try {
      const { data } = await api.get(`/tasks/${taskId}/comments`);
      setComments((prev) => ({ ...prev, [taskId]: data }));
    } catch {}
  };

  const toggleExpand = (taskId) => {
    if (expanded === taskId) { setExpanded(null); return; }
    setExpanded(taskId);
    loadComments(taskId);
  };

  const setStatus = async (taskId, status) => {
    setUpdating((prev) => ({ ...prev, [taskId]: true }));
    const toastId = toast.loading(status === "completed" ? "Notifying admin..." : "Updating task...");
    try {
      const { data } = await api.patch(`/tasks/${taskId}/status`, { status });
      setTasks((prev) => prev.map((t) => (t.id === taskId ? data : t)));
      toast.success(
        status === "completed" ? "Task marked as completed. Admin has been notified. 🎉" : "Task moved.",
        { id: toastId },
      );
    } catch {
      toast.error("Failed to update task.", { id: toastId });
    } finally {
      setUpdating((prev) => ({ ...prev, [taskId]: false }));
    }
  };

  // Moving into/out of "completed" is the only transition worth a confirmation —
  // it notifies the admin and tracks per-user completion server-side.
  const handleMove = (task, status) => {
    if (updating[task.id] || status === task.status) return;
    if (status === "completed" || task.status === "completed") {
      setConfirmModal({ open: true, taskId: task.id, status, taskTitle: task.title });
      return;
    }
    setStatus(task.id, status);
  };

  const postComment = async (taskId) => {
    const text = (newComment[taskId] || "").trim();
    if (!text) return;
    const toastId = toast.loading("Posting comment...");
    try {
      const { data } = await api.post(`/tasks/${taskId}/comments`, { text });
      setComments((prev) => ({ ...prev, [taskId]: [...(prev[taskId] || []), data] }));
      setNewComment((prev) => ({ ...prev, [taskId]: "" }));
      toast.success("Comment posted successfully! 💬", { id: toastId });
    } catch {
      toast.error("Failed to post comment.", { id: toastId });
    }
  };

  const deleteComment = async (taskId, commentId) => {
    await api.delete(`/tasks/${taskId}/comments/${commentId}`);
    setComments((prev) => ({ ...prev, [taskId]: (prev[taskId] || []).filter((c) => c.id !== commentId) }));
  };

  const myId = user?.id;
  const isAdmin = user?.role === "admin" || user?.role === "sub_admin";
  const pending = tasks.filter((t) => t.status !== "completed").length;

  useEffect(() => {
    if (!confirmModal.open) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setConfirmModal({ open: false, taskId: null, status: null, taskTitle: "" });
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [confirmModal.open]);

  useEffect(() => {
    if (!viewTask) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = original; };
  }, [viewTask]);

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold gradient-text">📋 My Tasks</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          {pending > 0 ? `${pending} task${pending > 1 ? "s" : ""} pending` : "All caught up! 🎉"}
        </p>
      </div>

      {confirmModal.open &&
        createPortal(
          <div
            onClick={() => setConfirmModal({ open: false, taskId: null, status: null, taskTitle: "" })}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          >
            <div onClick={(e) => e.stopPropagation()} className="w-full max-w-[90%] sm:max-w-md rounded-xl bg-white dark:bg-slate-900 p-6 shadow-xl">
              <h3 className="text-lg font-semibold">
                {confirmModal.status === "completed" ? "Mark task as completed?" : "Reopen this task?"}
              </h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                {confirmModal.status === "completed"
                  ? "The admin will be notified that you've completed this task. Are you sure you want to continue?"
                  : "This will move the task out of Completed. Continue?"}
              </p>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setConfirmModal({ open: false, taskId: null, status: null, taskTitle: "" })}
                  className="rounded-lg border px-4 py-1 text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    const { taskId, status } = confirmModal;
                    setConfirmModal({ open: false, taskId: null, status: null, taskTitle: "" });
                    setStatus(taskId, status);
                  }}
                  className="rounded-lg bg-emerald-600 px-4 py-1 text-white hover:bg-emerald-700 text-sm"
                >
                  Yes, Continue
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}

      {viewTask &&
        createPortal(
          <AnimatePresence>
            <div onClick={() => setViewTask(null)} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                onClick={(e) => e.stopPropagation()}
                className="glass-card w-full max-w-3xl max-h-[90vh] overflow-y-auto"
              >
                <div className="sticky top-0 bg-white dark:bg-slate-900 border-b border-black/5 dark:border-white/10 px-6 py-4 flex items-center justify-between">
                  <h2 className="font-bold text-xl">{viewTask.title}</h2>
                  <button onClick={() => setViewTask(null)} className="text-xl text-slate-400 hover:text-slate-600">✕</button>
                </div>
                <div className="p-6 space-y-6">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold ${PRIORITY_STYLE[viewTask.priority]}`}>
                      {viewTask.priority}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold ${statusMeta(viewTask.status).badge}`}>
                      {statusMeta(viewTask.status).icon} {statusMeta(viewTask.status).label}
                    </span>
                    {viewTask.dueDate && <span className="text-xs text-slate-500">📅 Due {viewTask.dueDate}</span>}
                  </div>
                  {viewTask.description && (
                    <div>
                      <h3 className="font-semibold mb-2">Description</h3>
                      <RichTextView
                        html={viewTask.description}
                        className="rounded-xl bg-slate-50 dark:bg-slate-800 p-4 break-words leading-7 text-sm"
                      />
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold mb-2">Assigned Team</h3>
                    <div className="space-y-2">
                      {viewTask.assignees.map((a) => (
                        <div key={a.id} className="flex items-center gap-3">
                          <Avatar name={a.name} avatar={a.avatar} />
                          <span className={a.id === myId ? "font-semibold text-indigo-500" : ""}>
                            {a.name}{a.id === myId && " (You)"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="text-sm text-slate-500 space-y-1">
                    <p>Created by <strong>{viewTask.createdByName}</strong></p>
                    <p>{fmtDateTime(viewTask.createdAt)}</p>
                  </div>
                </div>
                <div className="border-t border-black/5 dark:border-white/10 p-4 flex justify-end gap-2">
                  <button
                    onClick={() => { toggleExpand(viewTask.id); setViewTask(null); }}
                    className="btn-primary"
                  >
                    Open Discussion
                  </button>
                </div>
              </motion.div>
            </div>
          </AnimatePresence>,
          document.body,
        )}

      {loading ? (
        <div className="grid md:grid-cols-4 gap-4">
          {TASK_STATUSES.map((s) => (
            <div key={s.key} className="glass-card p-4 h-40 animate-pulse" />
          ))}
        </div>
      ) : tasks.length === 0 ? (
        <div className="text-center py-16 text-slate-400">No tasks assigned to you yet.</div>
      ) : (
        <div className="grid md:grid-cols-4 gap-4 items-start">
          {TASK_STATUSES.map((col) => {
            const colTasks = tasks.filter((t) => t.status === col.key);
            return (
              <div key={col.key} className={`rounded-2xl border p-3 space-y-3 ${col.column}`}>
                <div className="flex items-center justify-between px-1">
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${col.dot}`} /> {col.icon} {col.label}
                  </p>
                  <span className="text-xs text-slate-400">{colTasks.length}</span>
                </div>
                <div className="space-y-3">
                  {colTasks.length === 0 && (
                    <p className="text-xs text-slate-400 text-center py-6">Nothing here</p>
                  )}
                  {colTasks.map((task) => (
                    <div key={task.id}>
                      <TaskCard
                        task={task}
                        myId={myId}
                        updating={updating[task.id]}
                        onMove={handleMove}
                        onView={setViewTask}
                        onToggleExpand={toggleExpand}
                        expanded={expanded === task.id}
                        isAdmin={isAdmin}
                      />
                      {expanded === task.id && (
                        <DiscussionPanel
                          task={task}
                          comments={comments}
                          newComment={newComment}
                          setNewComment={setNewComment}
                          postComment={postComment}
                          deleteComment={deleteComment}
                          myId={myId}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
