import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import api from "../api/axios";

const ROLES = ["user", "admin"];

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92 }}
        className="glass-card w-full max-w-md p-6 space-y-4 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">{title}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xl">✕</button>
        </div>
        {children}
      </motion.div>
    </div>
  );
}

function UserForm({ initial = {}, onSave, onClose, isCreate }) {
  const [form, setForm] = useState({
    name:        initial.name        || "",
    email:       initial.email       || "",
    password:    "",
    role:        initial.role        || "user",
    daily_limit: initial.dailyLimit  ?? 10,
  });
  const [saving, setSaving] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    if (isCreate && !form.password) return toast.error("Password required");
    setSaving(true);
    try {
      await onSave(form);
      onClose();
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Failed to save");
    }
    setSaving(false);
  };

  return (
    <form onSubmit={submit} className="space-y-3">
      <div>
        <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 block">Name</label>
        <input value={form.name} onChange={e => set("name", e.target.value)} required className="input-light" placeholder="Full name" />
      </div>
      {isCreate && (
        <div>
          <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 block">Email</label>
          <input value={form.email} onChange={e => set("email", e.target.value)} required type="email" className="input-light" placeholder="email@example.com" />
        </div>
      )}
      <div>
        <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 block">
          {isCreate ? "Password" : "New Password (leave blank to keep)"}
        </label>
        <input value={form.password} onChange={e => set("password", e.target.value)} type="password" className="input-light" placeholder={isCreate ? "Min 6 chars" : "Leave blank to keep current"} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 block">Role</label>
          <select value={form.role} onChange={e => set("role", e.target.value)} className="input-light">
            {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 block">Daily Post Limit</label>
          <input value={form.daily_limit} onChange={e => set("daily_limit", Number(e.target.value))} type="number" min={1} max={999} className="input-light" />
        </div>
      </div>
      <div className="flex gap-2 pt-2">
        <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-sm text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
          Cancel
        </button>
        <button type="submit" disabled={saving} className="flex-1 btn-primary py-2.5">
          {saving ? "Saving…" : isCreate ? "Create User" : "Save Changes"}
        </button>
      </div>
    </form>
  );
}

function NotifyModal({ onClose, users, onSent }) {
  const [title, setTitle]     = useState("");
  const [body,  setBody]      = useState("");
  const [target, setTarget]   = useState("all"); // "all" | "user"
  const [userId, setUserId]   = useState("");
  const [sending, setSending] = useState(false);

  const send = async (e) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return toast.error("Title and message required");
    if (target === "user" && !userId) return toast.error("Select a user");
    setSending(true);
    try {
      const payload = { title: title.trim(), body: body.trim() };
      if (target === "user") payload.user_id = userId;
      const { data } = await api.post("/admin/notify", payload);
      toast.success(`Sent to ${data.sent_count} device(s)`);
      onSent();
      onClose();
    } catch {
      toast.error("Failed to send notification");
    }
    setSending(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92 }}
        className="glass-card w-full max-w-md p-6 space-y-4"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">🔔 Send Push Notification</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xl">✕</button>
        </div>

        <form onSubmit={send} className="space-y-3">
          {/* Target */}
          <div>
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 block">Send To</label>
            <div className="flex gap-2">
              <button type="button" onClick={() => setTarget("all")}
                className={`flex-1 py-2 rounded-xl text-sm font-semibold border transition ${target === "all" ? "bg-indigo-500 border-indigo-500 text-white" : "border-slate-200 dark:border-white/10 text-slate-500 hover:border-indigo-400"}`}>
                🌍 All Users
              </button>
              <button type="button" onClick={() => setTarget("user")}
                className={`flex-1 py-2 rounded-xl text-sm font-semibold border transition ${target === "user" ? "bg-indigo-500 border-indigo-500 text-white" : "border-slate-200 dark:border-white/10 text-slate-500 hover:border-indigo-400"}`}>
                👤 One User
              </button>
            </div>
          </div>
          {target === "user" && (
            <select value={userId} onChange={e => setUserId(e.target.value)} className="input-light w-full">
              <option value="">— Select user —</option>
              {users.map(u => <option key={u.id} value={u.id}>{u.name} ({u.email})</option>)}
            </select>
          )}
          <div>
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 block">Title</label>
            <input value={title} onChange={e => setTitle(e.target.value)} className="input-light w-full" placeholder="Notification title…" maxLength={100} />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 block">Message</label>
            <textarea value={body} onChange={e => setBody(e.target.value)} className="input-light w-full resize-none" rows={3} placeholder="Notification body…" maxLength={300} />
          </div>
          <div className="flex gap-2 pt-1">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-sm text-slate-500 hover:bg-slate-50 dark:hover:bg-white/5 transition">Cancel</button>
            <button type="submit" disabled={sending} className="flex-1 btn-primary py-2.5 disabled:opacity-60">
              {sending ? "Sending…" : "📤 Send"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

function NotifyLogs({ logs, loading }) {
  if (loading) return <p className="text-sm text-slate-400">Loading logs…</p>;
  if (!logs.length) return (
    <div className="glass-card p-8 text-center text-slate-400 text-sm">No notifications sent yet.</div>
  );
  return (
    <div className="glass-card overflow-hidden">
      <div className="px-4 py-3 border-b border-black/5 dark:border-white/10 flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">🔔 Notification Logs</p>
        <p className="text-xs text-slate-400">Last {logs.length} · max 100 stored</p>
      </div>
      <div className="divide-y divide-black/5 dark:divide-white/5 max-h-96 overflow-y-auto">
        {logs.map((h, i) => (
          <div key={h.id ?? i} className="flex items-start gap-3 px-4 py-3 hover:bg-black/2 dark:hover:bg-white/2 transition-colors">
            <span className="text-base mt-0.5">🔔</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 truncate">{h.title}</p>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  h.target === "user"
                    ? "bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300"
                    : "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300"
                }`}>
                  {h.target === "user" ? `👤 ${h.targetName ?? "1 user"}` : "🌍 All"}
                </span>
                <span className="text-[10px] bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300 px-2 py-0.5 rounded-full font-bold">
                  {h.sentCount ?? 0} delivered
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">{h.body}</p>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
                by {h.sentByName ?? "Admin"} · {new Date(h.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Admin() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState("");
  const [showNotify, setShowNotify] = useState(false);
  const [logs, setLogs] = useState([]);
  const [logsLoading, setLogsLoading] = useState(true);

  const loadLogs = async () => {
    setLogsLoading(true);
    api.get("/admin/notify/history").then(r => setLogs(r.data)).catch(() => {}).finally(() => setLogsLoading(false));
  };

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/admin/users");
      setUsers(data);
    } catch {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); loadLogs(); }, []);

  const createUser = async (form) => {
    const { data } = await api.post("/admin/users", form);
    setUsers(u => [data, ...u]);
    toast.success(`User "${data.name}" created`);
  };

  const updateUser = async (form) => {
    const payload = { ...form };
    if (!payload.password) delete payload.password;
    const { data } = await api.put(`/admin/users/${editing.id}`, payload);
    setUsers(u => u.map(x => x.id === editing.id ? { ...x, ...data } : x));
    toast.success("User updated");
  };

  const deleteUser = async (user) => {
    if (!confirm(`Delete "${user.name}"? Their questions will remain.`)) return;
    try {
      await api.delete(`/admin/users/${user.id}`);
      setUsers(u => u.filter(x => x.id !== user.id));
      toast.success("User deleted");
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Failed to delete");
    }
  };

  const setLimit = async (user, limit) => {
    try {
      await api.patch(`/admin/users/${user.id}/limit`, { daily_limit: limit });
      setUsers(u => u.map(x => x.id === user.id ? { ...x, dailyLimit: limit } : x));
      toast.success(`Limit set to ${limit}/day`);
    } catch {
      toast.error("Failed to update limit");
    }
  };

  const filtered = users.filter(u =>
    !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">👑 Admin Panel</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Manage users, roles and daily question limits.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowNotify(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-indigo-200 dark:border-indigo-500/30 text-indigo-600 dark:text-indigo-400 text-sm font-semibold hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors"
          >
            🔔 Send Notification
          </button>
          <button onClick={() => setCreating(true)} className="btn-primary flex items-center gap-2">
            + Create User
          </button>
        </div>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Users",  value: users.length,                              icon: "👥" },
          { label: "Admins",       value: users.filter(u => u.role === "admin").length, icon: "👑" },
          { label: "Regular Users",value: users.filter(u => u.role === "user").length,  icon: "👤" },
          { label: "Total Posts",  value: users.reduce((s, u) => s + (u.questionCount || 0), 0), icon: "📝" },
        ].map(s => (
          <div key={s.label} className="glass-card p-4 flex items-center gap-3">
            <span className="text-2xl">{s.icon}</span>
            <div>
              <p className="text-xl font-bold text-slate-800 dark:text-slate-100">{s.value}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search */}
      <input
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Search by name or email…"
        className="input-light max-w-sm"
      />

      {/* Users table */}
      {loading ? (
        <p className="text-sm text-slate-400">Loading users…</p>
      ) : (
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-black/5 dark:border-white/10 text-left">
                  {["User", "Role", "Daily Limit", "Posts", "Joined", "Actions"].map(h => (
                    <th key={h} className="px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filtered.map(u => (
                    <motion.tr
                      key={u.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="border-b border-black/5 dark:border-white/5 hover:bg-black/2 dark:hover:bg-white/3 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                            {u.name.slice(0,2).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-slate-700 dark:text-slate-200">{u.name}</p>
                            <p className="text-xs text-slate-400">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                          u.role === "admin"
                            ? "bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300"
                            : "bg-slate-100 text-slate-600 dark:bg-slate-500/20 dark:text-slate-300"
                        }`}>
                          {u.role === "admin" ? "👑 Admin" : "👤 User"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <input
                            type="number"
                            defaultValue={u.dailyLimit ?? 10}
                            min={1}
                            max={999}
                            onBlur={e => {
                              const v = Number(e.target.value);
                              if (v !== (u.dailyLimit ?? 10) && v >= 1) setLimit(u, v);
                            }}
                            className="w-16 text-xs px-2 py-1 rounded-lg border border-slate-200 dark:border-white/10 bg-transparent text-slate-700 dark:text-slate-200 outline-none focus:border-indigo-400"
                          />
                          <span className="text-xs text-slate-400">/day</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">{u.questionCount ?? 0}</span>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-400">
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "—"}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => setEditing(u)}
                            className="text-xs px-2.5 py-1 rounded-lg border border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/10 transition-colors"
                          >
                            ✏️ Edit
                          </button>
                          <button
                            onClick={() => deleteUser(u)}
                            className="text-xs px-2.5 py-1 rounded-lg border border-red-300/50 text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                          >
                            🗑
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Notification Logs */}
      <NotifyLogs logs={logs} loading={logsLoading} />

      {/* Modals */}
      <AnimatePresence>
        {creating && (
          <Modal title="Create New User" onClose={() => setCreating(false)}>
            <UserForm isCreate onSave={createUser} onClose={() => setCreating(false)} />
          </Modal>
        )}
        {editing && (
          <Modal title={`Edit — ${editing.name}`} onClose={() => setEditing(null)}>
            <UserForm initial={editing} onSave={updateUser} onClose={() => setEditing(null)} />
          </Modal>
        )}
        {showNotify && (
          <NotifyModal
            onClose={() => setShowNotify(false)}
            users={users}
            onSent={loadLogs}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
