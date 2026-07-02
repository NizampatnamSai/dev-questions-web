import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import toast from "react-hot-toast";
import api from "../api/axios";
import { fmtDateTime } from "../utils/time";
import ConfirmModal from "../components/ConfirmModal";
import useConfirm from "../hooks/useConfirm";
import { TASK_STATUSES, statusMeta } from "../utils/taskStatus";
import RichTextEditor from "../components/RichTextEditor";
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

export function DescriptionPreview({ text, onView }) {
  const ref = useRef(null);
  const [overflow, setOverflow] = useState(false);

  useLayoutEffect(() => {
    if (ref.current) {
      setOverflow(ref.current.scrollHeight > ref.current.clientHeight + 2);
    }
  }, [text]);

  if (!text) return null;

  return (
    <div className="">
      <RichTextView
        html={text}
        className="text-sm text-slate-600 dark:text-slate-300 break-words leading-6 line-clamp-3"
        forwardedRef={ref}
      />

      {overflow && (
        <button
          onClick={onView}
          className="mt-1 text-xs font-medium text-indigo-500 hover:text-indigo-600"
        >
          View More →
        </button>
      )}
    </div>
  );
}

export default function AdminTasks() {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [viewTask, setViewTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [expanded, setExpanded] = useState(null);
  const [comments, setComments] = useState({});
  const [newComment, setNewComment] = useState({});
  const [filter, setFilter] = useState("all"); // all | todo | started | testing | completed
  const [moving, setMoving] = useState({});
  const [saving, setSaving] = useState(false);
  const { confirm, confirmProps } = useConfirm();

  // Form state
  const [form, setForm] = useState({
    title: "",
    description: "",
    assigneeIds: [],
    priority: "medium",
    dueDate: "",
  });

  useEffect(() => {
    loadTasks();
    loadUsers();
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

  const loadUsers = async () => {
    try {
      const { data } = await api.get("/admin/users");
      setUsers(
        data.filter((u) => u.role !== "admin" && u.role !== "sub_admin"),
      );
    } catch {}
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

  const openCreate = () => {
    setEditTask(null);
    setForm({
      title: "",
      description: "",
      assigneeIds: [],
      priority: "medium",
      dueDate: "",
    });
    setShowForm(true);
  };

  const openEdit = (task) => {
    setEditTask(task);
    setForm({
      title: task.title,
      description: task.description || "",
      assigneeIds: task.assignees.map((a) => a.id),
      priority: task.priority,
      dueDate: task.dueDate || "",
    });
    setShowForm(true);
  };

  const submitForm = async () => {
    if (!form.title.trim()) return toast.error("Title is required");
    if (!form.assigneeIds.length)
      return toast.error("Select at least one user");
    setSaving(true);
    try {
      if (editTask) {
        const { data } = await api.patch(`/tasks/${editTask.id}`, form);
        setTasks((prev) => prev.map((t) => (t.id === editTask.id ? data : t)));
        toast.success("Task updated");
      } else {
        const { data } = await api.post("/tasks", form);
        setTasks((prev) => [data, ...prev]);
        toast.success("Task created & users notified");
      }
      setShowForm(false);
    } catch (e) {
      toast.error(e.response?.data?.detail || "Failed to save task");
    } finally {
      setSaving(false);
    }
  };

  const deleteTask = (task) => {
    confirm({
      title: "Delete this task?",
      message: `"${task.title}" will be permanently removed for all assignees.`,
      confirmLabel: "Delete",
      onConfirm: async () => {
        try {
          await api.delete(`/tasks/${task.id}`);
          setTasks((prev) => prev.filter((t) => t.id !== task.id));
          toast.success("Deleted");
        } catch {
          toast.error("Failed to delete task");
        }
      },
    });
  };

  const toggleAssignee = (uid) => {
    setForm((f) => ({
      ...f,
      assigneeIds: f.assigneeIds.includes(uid)
        ? f.assigneeIds.filter((id) => id !== uid)
        : [...f.assigneeIds, uid],
    }));
  };

  const postComment = async (taskId) => {
    const text = (newComment[taskId] || "").trim();
    if (!text) return;
    try {
      const { data } = await api.post(`/tasks/${taskId}/comments`, { text });
      setComments((prev) => ({
        ...prev,
        [taskId]: [...(prev[taskId] || []), data],
      }));
      setNewComment((prev) => ({ ...prev, [taskId]: "" }));
    } catch {
      toast.error("Failed to post comment");
    }
  };

  const deleteComment = async (taskId, commentId) => {
    await api.delete(`/tasks/${taskId}/comments/${commentId}`);
    setComments((prev) => ({
      ...prev,
      [taskId]: (prev[taskId] || []).filter((c) => c.id !== commentId),
    }));
  };

  const moveTask = async (task, status) => {
    if (moving[task.id] || status === task.status) return;
    setMoving((prev) => ({ ...prev, [task.id]: true }));
    try {
      const { data } = await api.patch(`/tasks/${task.id}/status`, { status });
      setTasks((prev) => prev.map((t) => (t.id === task.id ? data : t)));
      if (viewTask?.id === task.id) setViewTask(data);
    } catch {
      toast.error("Failed to move task");
    } finally {
      setMoving((prev) => ({ ...prev, [task.id]: false }));
    }
  };

  const filtered =
    filter === "all" ? tasks : tasks.filter((t) => t.status === filter);

  useEffect(() => {
    if (!viewTask) return;

    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = original;
    };
  }, [viewTask]);

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold gradient-text">📋 Task Manager</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Create and assign tasks to team members
          </p>
        </div>
        <button onClick={openCreate} className="btn-primary">
          + New Task
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {[{ key: "all", label: "All", icon: "" }, ...TASK_STATUSES].map(
          (s) => (
            <button
              key={s.key}
              onClick={() => setFilter(s.key)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${filter === s.key ? "bg-indigo-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"}`}
            >
              {s.icon ? `${s.icon} ` : ""}
              {s.label}
              <span className="ml-1.5 text-xs opacity-60">
                {s.key === "all"
                  ? tasks.length
                  : tasks.filter((t) => t.status === s.key).length}
              </span>
            </button>
          ),
        )}
      </div>

      {/* Task board */}
      {loading ? (
        <div className="grid md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="glass-card p-5 h-40 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          No tasks yet. Create one above.
        </div>
      ) : (
        <div
          className={
            filter === "all"
              ? "grid md:grid-cols-4 gap-4 items-start"
              : "space-y-3"
          }
        >
          {(filter === "all" ? TASK_STATUSES : [statusMeta(filter)]).map(
            (col) => {
              const colTasks = filtered.filter((t) => t.status === col.key);
              return (
                <div
                  key={col.key}
                  className={
                    filter === "all"
                      ? `rounded-2xl border p-3 space-y-3 ${col.column}`
                      : "space-y-3"
                  }
                >
                  {filter === "all" && (
                    <div className="flex items-center gap-2 px-1">
                      <span className={`w-2 h-2 rounded-full ${col.dot}`} />
                      <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                        {col.icon} {col.label}
                      </h3>
                      <span className="text-xs text-slate-400">
                        {colTasks.length}
                      </span>
                    </div>
                  )}

                  {colTasks.length === 0 && filter === "all" && (
                    <p className="text-xs text-slate-400 px-1">No tasks</p>
                  )}

                  {colTasks.map((task) => (
                    <div key={task.id} className="glass-card overflow-hidden">
                      <div className="p-4">
                        {/* Fixed-height content block — description/title overflow is
                            handled by DescriptionPreview's own "View More", so every
                            card stays the same height regardless of content length. */}
                        <div className="h-[142px] overflow-hidden">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span
                              className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${PRIORITY_STYLE[task.priority]}`}
                            >
                              {task.priority}
                            </span>
                            {filter !== "all" && (
                              <span
                                className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${statusMeta(task.status).badge}`}
                              >
                                {statusMeta(task.status).icon}{" "}
                                {statusMeta(task.status).label}
                              </span>
                            )}
                            {task.dueDate && (
                              <span className="text-[11px] text-slate-400">
                                📅 {task.dueDate}
                              </span>
                            )}
                          </div>
                          <h3
                            onClick={() => setViewTask(task)}
                            className="mt-1 font-semibold text-slate-800 dark:text-slate-100 cursor-pointer hover:text-indigo-500 transition line-clamp-1"
                          >
                            {task.title}
                          </h3>
                          {task.description && (
                            <DescriptionPreview
                              text={task.description}
                              onView={() => setViewTask(task)}
                            />
                          )}
                        </div>

                        {/* Assignees */}
                        <div className="flex items-center gap-1.5 mt-2">
                          <div className="flex -space-x-1 flex-shrink-0">
                            {task.assignees.map((a) => (
                              <div key={a.id} title={a.name}>
                                <Avatar
                                  name={a.name}
                                  avatar={a.avatar}
                                  size="w-6 h-6"
                                />
                              </div>
                            ))}
                          </div>
                          <span className="text-xs text-slate-500 truncate">
                            {task.assignees.map((a) => a.name).join(", ")}
                          </span>
                        </div>

                        {task.completedBy?.length > 0 && (
                          <p className="text-xs text-emerald-500 mt-1">
                            ✓ {task.completedBy.length}/
                            {task.assignees.length} completed
                          </p>
                        )}

                        {/* Move pills */}
                        <div className="flex items-center gap-1 flex-wrap mt-3">
                          {TASK_STATUSES.map((s) => (
                            <button
                              key={s.key}
                              disabled={
                                moving[task.id] || s.key === task.status
                              }
                              onClick={() => moveTask(task, s.key)}
                              title={s.label}
                              className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium transition whitespace-nowrap ${
                                s.key === task.status
                                  ? `${s.badge} cursor-default`
                                  : "bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600"
                              }`}
                            >
                              {s.icon} {s.label}
                            </button>
                          ))}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-slate-100 dark:border-white/5">
                          <div className="flex items-center gap-0.5">
                            <button
                              onClick={() => setViewTask(task)}
                              title="View"
                              className="w-7 h-7 flex items-center justify-center rounded-lg text-sm text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                            >
                              👁
                            </button>
                            <button
                              onClick={() => toggleExpand(task.id)}
                              title="Comments"
                              className={`w-7 h-7 flex items-center justify-center rounded-lg text-sm transition ${expanded === task.id ? "bg-slate-100 dark:bg-slate-700 text-indigo-500" : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"}`}
                            >
                              💬
                            </button>
                            <button
                              onClick={() => openEdit(task)}
                              title="Edit"
                              className="w-7 h-7 flex items-center justify-center rounded-lg text-sm text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition"
                            >
                              ✏️
                            </button>
                            <button
                              onClick={() => deleteTask(task)}
                              title="Delete"
                              className="w-7 h-7 flex items-center justify-center rounded-lg text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
                            >
                              🗑
                            </button>
                          </div>
                          <span
                            className="text-[10px] text-slate-400 flex-shrink-0"
                            title={`Created at: ${fmtDateTime(task.createdAt)}`}
                          >
                            {fmtDateTime(task.createdAt)}
                          </span>
                        </div>
                      </div>

                      {/* Comments panel */}
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
                                Comments
                              </p>
                              {(comments[task.id] || []).length === 0 && (
                                <p className="text-xs text-slate-400">
                                  No comments yet.
                                </p>
                              )}
                              {(comments[task.id] || []).map((c) => (
                                <div key={c.id} className="flex gap-2.5">
                                  <Avatar
                                    name={c.userName}
                                    avatar={c.avatar}
                                    size="w-7 h-7"
                                  />
                                  <div className="flex-1 bg-slate-50 dark:bg-slate-800/60 rounded-xl px-3 py-2">
                                    <div className="flex items-center justify-between gap-2">
                                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                                        {c.userName}
                                        {c.isAdmin && (
                                          <span className="ml-1 text-[10px] bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300 px-1.5 rounded-full">
                                            Admin
                                          </span>
                                        )}
                                      </span>
                                      <div className="flex items-center gap-2">
                                        <span className="text-[10px] text-slate-400">
                                          {fmtDateTime(c.createdAt)}
                                        </span>
                                        <button
                                          onClick={() =>
                                            deleteComment(task.id, c.id)
                                          }
                                          className="text-[10px] text-red-400 hover:underline"
                                        >
                                          del
                                        </button>
                                      </div>
                                    </div>
                                    <p className="text-sm text-slate-600 dark:text-slate-300 mt-0.5">
                                      {c.text}
                                    </p>
                                  </div>
                                </div>
                              ))}
                              <div className="flex gap-2">
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
                                  placeholder="Add a comment…"
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
                  ))}
                </div>
              );
            },
          )}
        </div>
      )}

      {/* View modal */}

      {viewTask &&
        createPortal(
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-40"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={() => setViewTask(null)}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div
                onClick={(e) => e.stopPropagation()}
                className="glass-card w-full max-w-3xl max-h-[90vh] overflow-y-auto"
              >
                <div className="sticky top-0 bg-white dark:bg-slate-900 border-b border-black/5 dark:border-white/10 px-6 py-4 flex justify-between items-center">
                  <h2 className="font-bold text-xl">{viewTask.title}</h2>

                  <button
                    onClick={() => setViewTask(null)}
                    className="text-xl text-slate-400 hover:text-slate-600"
                  >
                    ✕
                  </button>
                </div>

                <div className="p-6 space-y-6">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${PRIORITY_STYLE[viewTask.priority]}`}
                    >
                      {viewTask.priority}
                    </span>

                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${statusMeta(viewTask.status).badge}`}
                    >
                      {statusMeta(viewTask.status).icon}{" "}
                      {statusMeta(viewTask.status).label}
                    </span>

                    {viewTask.dueDate && (
                      <span className="text-xs text-slate-500">
                        📅 {viewTask.dueDate}
                      </span>
                    )}

                    <div className="text-sm flex items-center gap-2 text-slate-500 ">
                      <p>Created on {fmtDateTime(viewTask.createdAt)}</p>

                      {viewTask.completedBy?.length > 0 && (
                        <p className="text-emerald-500">
                          ✓ {viewTask.completedBy.length}/
                          {viewTask.assignees.length} completed
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <p className="font-semibold mb-2">Assigned To</p>

                    <div className="flex flex-wrap items-center gap-4">
                      {viewTask.assignees.map((a) => (
                        <div key={a.id} className="flex items-center gap-3">
                          <Avatar name={a.name} avatar={a.avatar} />

                          <span>{a.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {viewTask.description && (
                    <div>
                      <p className="font-semibold mb-2">Description</p>

                      <RichTextView
                        html={viewTask.description}
                        className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 break-words leading-7 text-sm"
                      />
                    </div>
                  )}

                  <div>
                    <p className="font-semibold mb-2">Move to</p>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {TASK_STATUSES.map((s) => (
                        <button
                          key={s.key}
                          disabled={
                            moving[viewTask.id] || s.key === viewTask.status
                          }
                          onClick={() => moveTask(viewTask, s.key)}
                          className={`text-xs px-3 py-1.5 rounded-full font-medium transition ${
                            s.key === viewTask.status
                              ? `${s.badge} cursor-default`
                              : "bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600"
                          }`}
                        >
                          {s.icon} {s.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="border-t border-black/5 dark:border-white/10 p-4 flex justify-end gap-2">
                  <button
                    onClick={() => {
                      setViewTask(null);
                      toggleExpand(viewTask.id);
                    }}
                    className="btn-secondary"
                  >
                    Comments
                  </button>

                  <button
                    onClick={() => {
                      openEdit(viewTask);
                      setViewTask(null);
                    }}
                    className="btn-primary"
                  >
                    Edit Task
                  </button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>,
          document.body,
        )}

      {/* Create / Edit modal */}
      <AnimatePresence>
        {showForm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowForm(false)}
              className="fixed inset-0 bg-black/40 z-40"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="glass-card w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-5">
                <div className="flex items-center justify-between">
                  <h2 className="font-bold text-lg text-slate-800 dark:text-slate-100">
                    {editTask ? "Edit Task" : "New Task"}
                  </h2>
                  <button
                    onClick={() => setShowForm(false)}
                    className="text-slate-400 hover:text-slate-600 text-xl"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-500 mb-1 block">
                      Title *
                    </label>
                    <input
                      value={form.title}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, title: e.target.value }))
                      }
                      placeholder="Task title"
                      className="input-light"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-500 mb-1 block">
                      Description
                    </label>
                    <RichTextEditor
                      value={form.description}
                      onChange={(html) =>
                        setForm((f) => ({ ...f, description: html }))
                      }
                      placeholder="Task description…"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-500 mb-1 block">
                        Priority
                      </label>
                      <select
                        value={form.priority}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, priority: e.target.value }))
                        }
                        className="input-light"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-500 mb-1 block">
                        Due Date
                      </label>
                      <input
                        type="date"
                        value={form.dueDate}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, dueDate: e.target.value }))
                        }
                        className="input-light"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-500 mb-2 block">
                      Assign to *{" "}
                      <span className="text-slate-400 font-normal">
                        ({form.assigneeIds.length} selected)
                      </span>
                    </label>
                    <div className="max-h-48 overflow-y-auto space-y-1.5 border border-slate-200 dark:border-slate-700 rounded-xl p-2">
                      {users.map((u) => (
                        <label
                          key={u.id}
                          className="flex items-center gap-3 px-2 py-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={form.assigneeIds.includes(u.id)}
                            onChange={() => toggleAssignee(u.id)}
                            className="rounded accent-indigo-600"
                          />
                          <span className="text-sm text-slate-700 dark:text-slate-200">
                            {u.name}
                          </span>
                          <span className="text-xs text-slate-400 ml-auto">
                            {u.email}
                          </span>
                        </label>
                      ))}
                      {users.length === 0 && (
                        <p className="text-xs text-slate-400 p-2">
                          No users found
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => setShowForm(false)}
                    disabled={saving}
                    className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={submitForm}
                    disabled={saving}
                    className="flex-1 btn-primary flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {saving && (
                      <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    )}
                    {saving
                      ? "Saving..."
                      : editTask
                        ? "Save Changes"
                        : "Create & Notify"}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <ConfirmModal {...confirmProps} />
    </div>
  );
}
