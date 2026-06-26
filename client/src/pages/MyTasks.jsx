import { createPortal } from "react-dom";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { fmtDateTime } from "../utils/time";

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

export default function MyTasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [comments, setComments] = useState({});
  const [newComment, setNewComment] = useState({});
  const [updating, setUpdating] = useState({});
  const [filter, setFilter] = useState("all");
  const [confirmModal, setConfirmModal] = useState({
    open: false,
    taskId: null,
    status: null,
  });

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
    if (expanded === taskId) {
      setExpanded(null);
      return;
    }
    setExpanded(taskId);
    loadComments(taskId);
  };

  const setStatus = async (taskId, status) => {
    setUpdating((prev) => ({ ...prev, [taskId]: true }));

    const toastId = toast.loading(
      status === "done" ? "Notifying admin..." : "Updating task...",
    );

    try {
      const { data } = await api.patch(`/tasks/${taskId}/status`, { status });

      setTasks((prev) => prev.map((t) => (t.id === taskId ? data : t)));

      toast.success(
        status === "done"
          ? "Task marked as completed. Admin has been notified. 🎉"
          : "Task status updated.",
        { id: toastId },
      );
    } catch {
      toast.error("Failed to update task.", {
        id: toastId,
      });
    } finally {
      setUpdating((prev) => ({ ...prev, [taskId]: false }));
    }
  };

  const postComment = async (taskId) => {
    const text = (newComment[taskId] || "").trim();
    if (!text) return;

    const toastId = toast.loading("Posting comment...");

    try {
      const { data } = await api.post(`/tasks/${taskId}/comments`, { text });

      setComments((prev) => ({
        ...prev,
        [taskId]: [...(prev[taskId] || []), data],
      }));

      setNewComment((prev) => ({
        ...prev,
        [taskId]: "",
      }));

      toast.success("Comment posted successfully! 💬", {
        id: toastId,
      });
    } catch {
      toast.error("Failed to post comment.", {
        id: toastId,
      });
    }
  };

  const deleteComment = async (taskId, commentId) => {
    await api.delete(`/tasks/${taskId}/comments/${commentId}`);
    setComments((prev) => ({
      ...prev,
      [taskId]: (prev[taskId] || []).filter((c) => c.id !== commentId),
    }));
  };

  const myId = user?.id;
  const filtered =
    filter === "all"
      ? tasks
      : filter === "done"
        ? tasks.filter((t) => t.completedBy?.includes(myId))
        : tasks.filter(
            (t) =>
              !t.completedBy?.includes(myId) &&
              (filter === "all" || t.status === filter),
          );

  const pending = tasks.filter((t) => !t.completedBy?.includes(myId)).length;

  useEffect(() => {
    if (!confirmModal.open) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setConfirmModal({
          open: false,
          taskId: null,
          status: null,
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [confirmModal.open]);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold gradient-text">📋 My Tasks</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          {pending > 0
            ? `${pending} task${pending > 1 ? "s" : ""} pending`
            : "All caught up! 🎉"}
        </p>
      </div>

      {/* Filter */}
      <div className="flex gap-2 flex-wrap">
        {[
          ["all", "All"],
          ["open", "Open"],
          ["in_progress", "In Progress"],
          ["done", "Completed"],
        ].map(([val, label]) => (
          <button
            key={val}
            onClick={() => setFilter(val)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${filter === val ? "bg-indigo-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"}`}
          >
            {label}
          </button>
        ))}
      </div>

      {confirmModal.open &&
        createPortal(
          <div
            onClick={() =>
              setConfirmModal({
                open: false,
                taskId: null,
                status: null,
              })
            }
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-[90%] sm:max-w-md rounded-xl bg-white dark:bg-slate-900 p-6 shadow-xl"
            >
              <h3 className="text-lg font-semibold">
                {confirmModal.status === "done"
                  ? "Mark task as completed?"
                  : "Reopen task?"}
              </h3>

              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                {confirmModal.status === "done"
                  ? "The admin will be notified that you've completed this task. Are you sure you want to continue?"
                  : "This task will be marked as pending again. Continue?"}
              </p>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() =>
                    setConfirmModal({
                      open: false,
                      taskId: null,
                      status: null,
                    })
                  }
                  className="rounded-lg border px-4 py-1 text-sm"
                >
                  Cancel
                </button>

                <button
                  onClick={() => {
                    const { taskId, status } = confirmModal;

                    setConfirmModal({
                      open: false,
                      taskId: null,
                      status: null,
                    });

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

      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="glass-card p-5 h-24 animate-pulse" />
          ))}
        </div>
      ) : tasks.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          No tasks assigned to you yet.
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((task) => {
            const iDone = task.completedBy?.includes(myId);
            const canToggleDone =
              task.status === "in_progress" || task.status === "done";
            return (
              <div
                key={task.id}
                className={`glass-card overflow-hidden transition-opacity ${iDone ? "opacity-70" : ""}`}
              >
                <div className="p-5">
                  <div className="w-full flex justify-between gap-3">
                    <div className="flex items-center gap-1">
                      {/* Checkbox */}
                      <button
                        onClick={() => {
                          if (updating[task.id]) return;

                          if (task.status === "open") {
                            toast.error(
                              "Start the task before marking it as completed.",
                            );
                            return;
                          }

                          setConfirmModal({
                            open: true,
                            taskId: task.id,
                            status: iDone ? "open" : "done",
                          });
                        }}
                        disabled={updating[task.id]}
                        className={`mt-0.5 w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${iDone ? "bg-emerald-500 border-emerald-500 text-white" : "border-slate-300 dark:border-slate-600 hover:border-emerald-400"}`}
                      >
                        {iDone && <span className="text-xs">✓</span>}
                      </button>

                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${PRIORITY_STYLE[task.priority]}`}
                        >
                          {task.priority}
                        </span>
                        {task.dueDate && (
                          <span className="text-[11px] text-slate-400">
                            📅 Due {task.dueDate}
                          </span>
                        )}
                        {iDone && (
                          <span className="text-[11px] text-emerald-500 font-semibold">
                            ✅ Done
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Status toggle */}
                    <div className="flex gap-1 flex-shrink-0">
                      {!iDone && task.status !== "in_progress" && (
                        <button
                          onClick={() => setStatus(task.id, "in_progress")}
                          className="text-xs px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 transition font-medium"
                        >
                          Start
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0 mt-1">
                    <h3
                      className={`font-semibold text-slate-800 dark:text-slate-100 ${iDone ? "line-through opacity-60" : ""}`}
                    >
                      {task.title}
                    </h3>
                    {task.description && (
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        {task.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between gap-3 mt-2 flex-wrap">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="text-xs text-slate-400">
                          From {task.createdByName}
                        </span>
                        <span className="text-xs text-slate-300 dark:text-slate-600">
                          ·
                        </span>
                        <span className="text-xs text-slate-400">
                          {fmtDateTime(task.createdAt)}
                        </span>
                        {task.assignees.length > 1 && (
                          <>
                            <span className="text-xs text-slate-300 dark:text-slate-600">
                              ·
                            </span>
                            <div className="flex items-center gap-1">
                              <div className="flex -space-x-1">
                                {task.assignees.slice(0, 4).map((a) => (
                                  <div key={a.id} title={a.name}>
                                    <Avatar
                                      name={a.name}
                                      avatar={a.avatar}
                                      size="w-5 h-5"
                                    />
                                  </div>
                                ))}
                              </div>
                              <span className="text-xs text-slate-400">
                                {task.assignees.length} assigned
                              </span>
                            </div>
                          </>
                        )}
                      </div>

                      <button
                        onClick={() => toggleExpand(task.id)}
                        className="text-xs px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition"
                      >
                        {expanded === task.id ? "▲ Hide" : "▼ Comments"}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Comments */}
                <AnimatePresence>
                  {expanded === task.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden border-t border-slate-100 dark:border-white/10"
                    >
                      <div className="p-4 space-y-3">
                        <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                          Discussion
                        </p>
                        {(comments[task.id] || []).length === 0 && (
                          <p className="text-xs text-slate-400">
                            No comments yet. Be the first!
                          </p>
                        )}
                        {(comments[task.id] || []).map((c) => (
                          <div
                            key={c.id}
                            className={`flex gap-2.5 ${c.userId === myId ? "flex-row-reverse" : ""}`}
                          >
                            <Avatar
                              name={c.userName}
                              avatar={c.avatar}
                              size="w-7 h-7"
                            />
                            <div
                              className={`max-w-[75%] rounded-2xl px-3 py-2 ${c.userId === myId ? "bg-indigo-600 text-white rounded-tr-sm" : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-tl-sm"}`}
                            >
                              <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                                <span className="text-xs font-semibold opacity-80">
                                  {c.userId === myId ? "You" : c.userName}
                                </span>
                                {c.isAdmin && (
                                  <span className="text-[10px] bg-white/20 px-1.5 rounded-full">
                                    Admin
                                  </span>
                                )}
                                <span className="text-[10px] opacity-50">
                                  {fmtDateTime(c.createdAt)}
                                </span>
                                {c.userId === myId && (
                                  <button
                                    onClick={() => deleteComment(task.id, c.id)}
                                    className="text-[10px] opacity-50 hover:opacity-100 ml-auto"
                                  >
                                    ✕
                                  </button>
                                )}
                              </div>
                              <p className="text-sm">{c.text}</p>
                            </div>
                          </div>
                        ))}
                        <div className="flex gap-2 pt-1">
                          <input
                            value={newComment[task.id] || ""}
                            onChange={(e) =>
                              setNewComment((prev) => ({
                                ...prev,
                                [task.id]: e.target.value,
                              }))
                            }
                            onKeyDown={(e) =>
                              e.key === "Enter" && postComment(task.id)
                            }
                            placeholder="Type a message…"
                            className="flex-1 input-light text-sm py-2"
                          />
                          <button
                            onClick={() => postComment(task.id)}
                            className="btn-primary px-4 py-2"
                          >
                            Send
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
