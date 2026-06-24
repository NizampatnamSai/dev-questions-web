import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import api from "../api/axios";
import { fmtDateTime } from "../utils/time";

const PRIORITY_STYLE = {
  high:   "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  medium: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  low:    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
};
const STATUS_STYLE = {
  open:        "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300",
  in_progress: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  done:        "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
};

function Avatar({ name, avatar, size = "w-7 h-7" }) {
  if (avatar) return <img src={avatar} alt={name} className={`${size} rounded-full object-cover flex-shrink-0`} />;
  return (
    <div className={`${size} rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-xs font-bold text-indigo-600 dark:text-indigo-300 flex-shrink-0`}>
      {name?.[0]?.toUpperCase() || "?"}
    </div>
  );
}

export default function AdminTasks() {
  const [tasks, setTasks]       = useState([]);
  const [users, setUsers]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [expanded, setExpanded] = useState(null);
  const [comments, setComments] = useState({});
  const [newComment, setNewComment] = useState({});
  const [filter, setFilter]     = useState("all"); // all | open | in_progress | done

  // Form state
  const [form, setForm] = useState({
    title: "", description: "", assigneeIds: [], priority: "medium", dueDate: ""
  });

  useEffect(() => {
    loadTasks();
    loadUsers();
  }, []);

  const loadTasks = async () => {
    try {
      const { data } = await api.get("/tasks");
      setTasks(data);
    } catch { toast.error("Failed to load tasks"); }
    finally { setLoading(false); }
  };

  const loadUsers = async () => {
    try {
      const { data } = await api.get("/admin/users");
      setUsers(data.filter(u => u.role !== "admin" && u.role !== "sub_admin"));
    } catch {}
  };

  const loadComments = async (taskId) => {
    try {
      const { data } = await api.get(`/tasks/${taskId}/comments`);
      setComments(prev => ({ ...prev, [taskId]: data }));
    } catch {}
  };

  const toggleExpand = (taskId) => {
    if (expanded === taskId) { setExpanded(null); return; }
    setExpanded(taskId);
    loadComments(taskId);
  };

  const openCreate = () => {
    setEditTask(null);
    setForm({ title: "", description: "", assigneeIds: [], priority: "medium", dueDate: "" });
    setShowForm(true);
  };

  const openEdit = (task) => {
    setEditTask(task);
    setForm({
      title: task.title,
      description: task.description || "",
      assigneeIds: task.assignees.map(a => a.id),
      priority: task.priority,
      dueDate: task.dueDate || "",
    });
    setShowForm(true);
  };

  const submitForm = async () => {
    if (!form.title.trim()) return toast.error("Title is required");
    if (!form.assigneeIds.length) return toast.error("Select at least one user");
    try {
      if (editTask) {
        const { data } = await api.patch(`/tasks/${editTask.id}`, form);
        setTasks(prev => prev.map(t => t.id === editTask.id ? data : t));
        toast.success("Task updated");
      } else {
        const { data } = await api.post("/tasks", form);
        setTasks(prev => [data, ...prev]);
        toast.success("Task created & users notified");
      }
      setShowForm(false);
    } catch (e) {
      toast.error(e.response?.data?.detail || "Failed to save task");
    }
  };

  const deleteTask = async (taskId) => {
    if (!window.confirm("Delete this task?")) return;
    await api.delete(`/tasks/${taskId}`);
    setTasks(prev => prev.filter(t => t.id !== taskId));
    toast.success("Deleted");
  };

  const toggleAssignee = (uid) => {
    setForm(f => ({
      ...f,
      assigneeIds: f.assigneeIds.includes(uid)
        ? f.assigneeIds.filter(id => id !== uid)
        : [...f.assigneeIds, uid],
    }));
  };

  const postComment = async (taskId) => {
    const text = (newComment[taskId] || "").trim();
    if (!text) return;
    try {
      const { data } = await api.post(`/tasks/${taskId}/comments`, { text });
      setComments(prev => ({ ...prev, [taskId]: [...(prev[taskId] || []), data] }));
      setNewComment(prev => ({ ...prev, [taskId]: "" }));
    } catch { toast.error("Failed to post comment"); }
  };

  const deleteComment = async (taskId, commentId) => {
    await api.delete(`/tasks/${taskId}/comments/${commentId}`);
    setComments(prev => ({
      ...prev,
      [taskId]: (prev[taskId] || []).filter(c => c.id !== commentId),
    }));
  };

  const filtered = filter === "all" ? tasks : tasks.filter(t => t.status === filter);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold gradient-text">📋 Task Manager</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Create and assign tasks to team members</p>
        </div>
        <button onClick={openCreate} className="btn-primary">
          + New Task
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {[["all","All"],["open","Open"],["in_progress","In Progress"],["done","Done"]].map(([val, label]) => (
          <button key={val} onClick={() => setFilter(val)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${filter === val ? "bg-indigo-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"}`}>
            {label}
            <span className="ml-1.5 text-xs opacity-60">
              {val === "all" ? tasks.length : tasks.filter(t => t.status === val).length}
            </span>
          </button>
        ))}
      </div>

      {/* Task list */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => <div key={i} className="glass-card p-5 h-20 animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-400">No tasks yet. Create one above.</div>
      ) : (
        <div className="space-y-3">
          {filtered.map(task => (
            <div key={task.id} className="glass-card overflow-hidden">
              <div className="p-5">
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${PRIORITY_STYLE[task.priority]}`}>
                        {task.priority}
                      </span>
                      <span className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${STATUS_STYLE[task.status]}`}>
                        {task.status.replace("_", " ")}
                      </span>
                      {task.dueDate && (
                        <span className="text-[11px] text-slate-400">📅 {task.dueDate}</span>
                      )}
                    </div>
                    <h3 className="font-semibold text-slate-800 dark:text-slate-100">{task.title}</h3>
                    {task.description && (
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{task.description}</p>
                    )}
                    {/* Assignees */}
                    <div className="flex items-center gap-1.5 mt-3">
                      <span className="text-xs text-slate-400">Assigned to:</span>
                      <div className="flex -space-x-1">
                        {task.assignees.map(a => (
                          <div key={a.id} title={a.name}>
                            <Avatar name={a.name} avatar={a.avatar} size="w-6 h-6" />
                          </div>
                        ))}
                      </div>
                      <span className="text-xs text-slate-500">{task.assignees.map(a => a.name).join(", ")}</span>
                    </div>
                    {task.completedBy?.length > 0 && (
                      <p className="text-xs text-emerald-500 mt-1">
                        ✓ {task.completedBy.length}/{task.assignees.length} completed
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button onClick={() => toggleExpand(task.id)}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition">
                      {expanded === task.id ? "▲ Hide" : "▼ Comments"}
                    </button>
                    <button onClick={() => openEdit(task)}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 transition">
                      Edit
                    </button>
                    <button onClick={() => deleteTask(task.id)}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-100 transition">
                      Delete
                    </button>
                  </div>
                </div>
                <p className="text-xs text-slate-400 mt-2">
                  Created by {task.createdByName} · {fmtDateTime(task.createdAt)}
                </p>
              </div>

              {/* Comments panel */}
              <AnimatePresence>
                {expanded === task.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
                    className="overflow-hidden border-t border-slate-100 dark:border-white/10"
                  >
                    <div className="p-4 space-y-3">
                      <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Comments</p>
                      {(comments[task.id] || []).length === 0 && (
                        <p className="text-xs text-slate-400">No comments yet.</p>
                      )}
                      {(comments[task.id] || []).map(c => (
                        <div key={c.id} className="flex gap-2.5">
                          <Avatar name={c.userName} avatar={c.avatar} size="w-7 h-7" />
                          <div className="flex-1 bg-slate-50 dark:bg-slate-800/60 rounded-xl px-3 py-2">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                                {c.userName}
                                {c.isAdmin && <span className="ml-1 text-[10px] bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300 px-1.5 rounded-full">Admin</span>}
                              </span>
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] text-slate-400">{fmtDateTime(c.createdAt)}</span>
                                <button onClick={() => deleteComment(task.id, c.id)} className="text-[10px] text-red-400 hover:underline">del</button>
                              </div>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-300 mt-0.5">{c.text}</p>
                          </div>
                        </div>
                      ))}
                      <div className="flex gap-2">
                        <input
                          value={newComment[task.id] || ""}
                          onChange={e => setNewComment(prev => ({ ...prev, [task.id]: e.target.value }))}
                          onKeyDown={e => e.key === "Enter" && postComment(task.id)}
                          placeholder="Add a comment…"
                          className="flex-1 input-light text-sm py-2"
                        />
                        <button onClick={() => postComment(task.id)} className="btn-primary px-4 py-2">Send</button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit modal */}
      <AnimatePresence>
        {showForm && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowForm(false)}
              className="fixed inset-0 bg-black/40 z-40" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="glass-card w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 space-y-5">
                <div className="flex items-center justify-between">
                  <h2 className="font-bold text-lg text-slate-800 dark:text-slate-100">
                    {editTask ? "Edit Task" : "New Task"}
                  </h2>
                  <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600 text-xl">✕</button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-500 mb-1 block">Title *</label>
                    <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                      placeholder="Task title" className="input-light" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-500 mb-1 block">Description</label>
                    <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                      placeholder="Task description…" rows={3} className="input-light resize-none" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-500 mb-1 block">Priority</label>
                      <select value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}
                        className="input-light">
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-500 mb-1 block">Due Date</label>
                      <input type="date" value={form.dueDate} onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))}
                        className="input-light" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-500 mb-2 block">
                      Assign to * <span className="text-slate-400 font-normal">({form.assigneeIds.length} selected)</span>
                    </label>
                    <div className="max-h-48 overflow-y-auto space-y-1.5 border border-slate-200 dark:border-slate-700 rounded-xl p-2">
                      {users.map(u => (
                        <label key={u.id} className="flex items-center gap-3 px-2 py-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer">
                          <input type="checkbox" checked={form.assigneeIds.includes(u.id)}
                            onChange={() => toggleAssignee(u.id)}
                            className="rounded accent-indigo-600" />
                          <span className="text-sm text-slate-700 dark:text-slate-200">{u.name}</span>
                          <span className="text-xs text-slate-400 ml-auto">{u.email}</span>
                        </label>
                      ))}
                      {users.length === 0 && <p className="text-xs text-slate-400 p-2">No users found</p>}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-1">
                  <button onClick={() => setShowForm(false)}
                    className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition">
                    Cancel
                  </button>
                  <button onClick={submitForm} className="flex-1 btn-primary">
                    {editTask ? "Save Changes" : "Create & Notify"}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
