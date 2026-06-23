import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import ConfirmModal from "../components/ConfirmModal";

const ROLES = ["user", "sub_admin", "admin"];

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
  const [showPw, setShowPw] = useState(false);
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
        <div className="relative">
          <input
            value={form.password}
            onChange={e => set("password", e.target.value)}
            type={showPw ? "text" : "password"}
            className="input-light !pr-10"
            placeholder={isCreate ? "Min 6 chars" : "Leave blank to keep current"}
          />
          <button
            type="button"
            onClick={() => setShowPw(p => !p)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            tabIndex={-1}
          >
            {showPw ? "🙈" : "👁"}
          </button>
        </div>
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
  const [title,    setTitle]   = useState("");
  const [body,     setBody]    = useState("");
  const [target,   setTarget]  = useState("all"); // "all" | "pick"
  const [selected, setSelected] = useState(new Set());
  const [search,   setSearch]  = useState("");
  const [sending,  setSending] = useState(false);

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const toggle = (id) => setSelected(s => {
    const n = new Set(s);
    n.has(id) ? n.delete(id) : n.add(id);
    return n;
  });

  const toggleAll = () => {
    if (selected.size === filtered.length) setSelected(new Set());
    else setSelected(new Set(filtered.map(u => u.id)));
  };

  const send = async (e) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return toast.error("Title and message required");
    if (target === "pick" && selected.size === 0) return toast.error("Select at least one user");
    setSending(true);
    try {
      const payload = { title: title.trim(), body: body.trim() };
      if (target === "pick") payload.user_ids = [...selected];
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92 }}
        className="glass-card w-full max-w-lg p-6 space-y-4 shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">🔔 Send Push Notification</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xl leading-none">✕</button>
        </div>

        <form onSubmit={send} className="space-y-4">
          {/* Target toggle */}
          <div>
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 block">Send To</label>
            <div className="flex gap-2">
              {[["all","🌍 All Users"],["pick","👥 Choose Users"]].map(([val, label]) => (
                <button key={val} type="button" onClick={() => setTarget(val)}
                  className={`flex-1 py-2 rounded-xl text-sm font-semibold border transition-colors ${
                    target === val
                      ? "bg-indigo-500 border-indigo-500 text-white"
                      : "border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:border-indigo-400"
                  }`}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* User picker */}
          {target === "pick" && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <input
                  value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Search users…"
                  className="input-light !py-1.5 !text-xs flex-1 mr-2"
                />
                <button type="button" onClick={toggleAll}
                  className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 whitespace-nowrap transition-colors">
                  {selected.size === filtered.length && filtered.length > 0 ? "Deselect all" : "Select all"}
                </button>
              </div>
              <div className="max-h-44 overflow-y-auto rounded-xl border border-slate-200 dark:border-white/10 divide-y divide-slate-100 dark:divide-white/5">
                {filtered.length === 0 && (
                  <p className="text-xs text-slate-400 text-center py-4">No users found</p>
                )}
                {filtered.map(u => (
                  <label key={u.id} className="flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 dark:hover:bg-white/5 cursor-pointer transition-colors">
                    <input type="checkbox" checked={selected.has(u.id)} onChange={() => toggle(u.id)}
                      className="rounded accent-indigo-500 w-4 h-4 flex-shrink-0" />
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
                      {u.name?.split(" ").map(w => w[0]).join("").slice(0,2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">{u.name}</p>
                      <p className="text-[10px] text-slate-400 truncate">{u.email}</p>
                    </div>
                  </label>
                ))}
              </div>
              {selected.size > 0 && (
                <p className="text-xs text-indigo-500 dark:text-indigo-400 font-medium">{selected.size} user{selected.size !== 1 ? "s" : ""} selected</p>
              )}
            </div>
          )}

          {/* Title + message */}
          <div>
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 block">Title</label>
            <input value={title} onChange={e => setTitle(e.target.value)} className="input-light w-full" placeholder="Notification title…" maxLength={100} />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 block">Message</label>
            <textarea value={body} onChange={e => setBody(e.target.value)} className="input-light w-full resize-none" rows={3} placeholder="Write your message…" maxLength={300} />
            <p className="text-[10px] text-slate-400 mt-1 text-right">{body.length}/300</p>
          </div>

          <div className="flex gap-2 pt-1">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-sm text-slate-500 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={sending} className="flex-1 btn-primary py-2.5 disabled:opacity-60">
              {sending ? "Sending…" : `📤 Send${target === "pick" && selected.size > 0 ? ` (${selected.size})` : ""}`}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

const DAYS = ["monday","tuesday","wednesday","thursday","friday","saturday","sunday"];
const DAY_LABEL = { monday:"Mon",tuesday:"Tue",wednesday:"Wed",thursday:"Thu",friday:"Fri",saturday:"Sat",sunday:"Sun" };

// Convert UTC HH:MM → IST display string and vice-versa
function toIST(utcHour, utcMin = 0) {
  const totalMins = utcHour * 60 + utcMin + 330; // IST = UTC + 5:30
  const h = Math.floor(totalMins / 60) % 24;
  const m = totalMins % 60;
  const ampm = h >= 12 ? "PM" : "AM";
  const h12  = h % 12 || 12;
  return `${h12}:${String(m).padStart(2, "0")} ${ampm} IST`;
}

// Convert a "HH:MM" UTC string to IST display
function utcTimeToIST(utcTime) {
  const [h, m] = utcTime.split(":").map(Number);
  return toIST(h, m);
}

// "HH:MM" UTC string → { hour, minute }
function parseUtcTime(utcTime) {
  const [h, m] = (utcTime || "10:00").split(":").map(Number);
  return { hour: h, minute: m || 0 };
}

function ScheduleRow({ u, saved, onSave, onRemove }) {
  const [draft, setDraft] = useState({
    day:     saved.day     || "monday",
    hour:    saved.hour    ?? 10,
    minute:  saved.minute  ?? 0,
    message: saved.message || "",
  });
  const [saving, setSaving] = useState(false);
  const hasSchedule = !!saved.userId;

  // keep draft in sync if parent reloads saved data
  useEffect(() => {
    setDraft({
      day:     saved.day     || "monday",
      hour:    saved.hour    ?? 10,
      minute:  saved.minute  ?? 0,
      message: saved.message || "",
    });
  }, [saved.day, saved.hour, saved.minute, saved.message, saved.userId]);

  const isDirty = hasSchedule && (
    draft.day !== (saved.day || "monday") ||
    draft.hour !== (saved.hour ?? 10) ||
    draft.minute !== (saved.minute ?? 0) ||
    draft.message !== (saved.message || "")
  );

  const handleSave = async () => {
    setSaving(true);
    await onSave(u.id, draft);
    setSaving(false);
  };

  return (
    <div className="flex flex-wrap items-center gap-3 px-4 py-3 hover:bg-black/2 dark:hover:bg-white/2">
      <div className="w-36 min-w-0">
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 truncate">{u.name}</p>
        <p className="text-[10px] text-slate-400 truncate">{u.email}</p>
      </div>
      <select value={draft.day} onChange={e => setDraft(d => ({ ...d, day: e.target.value }))}
        className="input-light !py-1.5 !text-xs !w-auto">
        {DAYS.map(d => <option key={d} value={d}>{DAY_LABEL[d]}</option>)}
      </select>
      <div className="flex items-center gap-1.5">
        <select value={draft.hour} onChange={e => setDraft(d => ({ ...d, hour: parseInt(e.target.value) }))}
          className="input-light !py-1 !text-xs !w-[68px]">
          {Array.from({ length: 24 }, (_, h) => (
            <option key={h} value={h}>{String(h).padStart(2, "0")}</option>
          ))}
        </select>
        <span className="text-slate-400 font-bold text-sm leading-none select-none">:</span>
        <select value={draft.minute} onChange={e => setDraft(d => ({ ...d, minute: parseInt(e.target.value) }))}
          className="input-light !py-1 !text-xs !w-[68px]">
          {Array.from({ length: 60 }, (_, m) => (
            <option key={m} value={m}>{String(m).padStart(2, "0")}</option>
          ))}
        </select>
        <span className="text-[10px] text-slate-400 font-medium leading-none">UTC</span>
        <span className="text-[10px] text-indigo-500 dark:text-indigo-400 font-semibold leading-none whitespace-nowrap">
          = {toIST(draft.hour, draft.minute)}
        </span>
      </div>
      <input
        value={draft.message}
        onChange={e => setDraft(d => ({ ...d, message: e.target.value }))}
        placeholder="Custom message (optional)"
        className="input-light !py-1.5 !text-xs flex-1 min-w-[160px]"
      />
      <div className="flex gap-2">
        {hasSchedule ? (
          <>
            {isDirty && (
              <button onClick={handleSave} disabled={saving}
                className="text-xs px-2.5 py-1.5 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-700 hover:bg-indigo-200 dark:hover:bg-indigo-800/40 font-semibold transition-colors">
                {saving ? "…" : "💾 Save"}
              </button>
            )}
            <button onClick={() => onRemove(u.id)}
              className="text-xs px-2.5 py-1.5 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-700 hover:bg-red-200 dark:hover:bg-red-800/40 transition-colors">
              Remove
            </button>
          </>
        ) : (
          <button onClick={handleSave} disabled={saving}
            className="text-xs px-2.5 py-1.5 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-700 hover:bg-green-200 dark:hover:bg-green-800/40 transition-colors">
            {saving ? "…" : "Enable"}
          </button>
        )}
      </div>
    </div>
  );
}

function WeeklySchedules({ users, usersLoading }) {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    api.get("/admin/schedules").then(r => setSchedules(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const getSchedule = (uid) => schedules.find(s => s.userId === uid) || {};

  const save = async (uid, draft) => {
    const cur = getSchedule(uid);
    const payload = { user_id: uid, day: draft.day, hour: draft.hour, minute: draft.minute, message: draft.message || null, enabled: true };
    try {
      await api.put("/admin/schedules", payload);
      setSchedules(prev => {
        const idx = prev.findIndex(s => s.userId === uid);
        const updated = { ...cur, ...payload, userId: uid };
        return idx >= 0 ? prev.map((s, i) => i === idx ? updated : s) : [...prev, updated];
      });
      toast.success("Schedule saved");
    } catch { toast.error("Failed to save"); }
  };

  const remove = async (uid) => {
    try {
      await api.delete(`/admin/schedules/${uid}`);
      setSchedules(prev => prev.filter(s => s.userId !== uid));
      toast.success("Schedule removed");
    } catch { toast.error("Failed to remove"); }
  };

  const regularUsers = users.filter(u => u.role !== "admin");

  return (
    <div className="glass-card overflow-hidden">
      <div className="px-4 py-3 border-b border-black/5 dark:border-white/10 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">🔔 Push Reminder Schedule</p>
          <p className="text-xs text-slate-400 mt-0.5">Set a weekly nudge for each user — they'll get a push notification to keep their streak alive</p>
        </div>
      </div>
      {loading || usersLoading ? (
        <div className="p-4 space-y-3">
          {[1,2,3,4].map(i => (
            <div key={i} className="flex items-center gap-3 animate-pulse">
              <div className="w-36 space-y-1.5">
                <div className="h-3.5 bg-slate-200 dark:bg-slate-700 rounded w-24" />
                <div className="h-2.5 bg-slate-200 dark:bg-slate-700 rounded w-32" />
              </div>
              <div className="h-8 w-24 bg-slate-200 dark:bg-slate-700 rounded-lg" />
              <div className="h-8 w-48 bg-slate-200 dark:bg-slate-700 rounded-lg" />
              <div className="h-8 flex-1 bg-slate-200 dark:bg-slate-700 rounded-lg" />
              <div className="h-8 w-16 bg-slate-200 dark:bg-slate-700 rounded-lg" />
            </div>
          ))}
        </div>
      ) : (
        <div className="divide-y divide-black/5 dark:divide-white/5">
          {regularUsers.map(u => (
            <ScheduleRow key={u.id} u={u} saved={getSchedule(u.id)} onSave={save} onRemove={remove} />
          ))}
          {regularUsers.length === 0 && (
            <p className="text-sm text-slate-400 text-center py-8">No users yet.</p>
          )}
        </div>
      )}
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
  const { user: me } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
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

  const [pendingUsers, setPendingUsers] = useState([]);
  const [rejectTarget, setRejectTarget] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectLoading, setRejectLoading] = useState(false);

  useEffect(() => {
    load();
    loadLogs();
    api.get("/admin/pending-users").then(r => setPendingUsers(r.data)).catch(() => {});
  }, []);

  const approveUser = async (u) => {
    await api.patch(`/admin/users/${u.id}/approve`);
    setPendingUsers(p => p.filter(x => x.id !== u.id));
    setUsers(prev => prev.map(x => x.id === u.id ? { ...x, status: "approved" } : x));
    toast.success(`${u.name} approved`);
  };

  const openReject = (u) => { setRejectTarget(u); setRejectReason(""); };

  const confirmReject = async () => {
    if (!rejectReason.trim()) { toast.error("Please enter a rejection reason"); return; }
    setRejectLoading(true);
    try {
      await api.patch(`/admin/users/${rejectTarget.id}/reject`, { reason: rejectReason.trim() });
      setPendingUsers(p => p.filter(x => x.id !== rejectTarget.id));
      toast.success(`${rejectTarget.name} rejected`);
      setRejectTarget(null);
    } catch {
      toast.error("Failed to reject user");
    } finally {
      setRejectLoading(false);
    }
  };

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

  const deleteUser = async () => {
    if (!deleteTarget) return;
    try {
      await api.delete(`/admin/users/${deleteTarget.id}`);
      setUsers(u => u.filter(x => x.id !== deleteTarget.id));
      toast.success("User deleted");
      setDeleteTarget(null);
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
          { label: "Admins",      value: users.filter(u => u.role === "admin").length,     icon: "👑" },
          { label: "Sub-Admins",  value: users.filter(u => u.role === "sub_admin").length, icon: "🔑" },
          { label: "Users",       value: users.filter(u => u.role === "user").length,       icon: "👤" },
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

      {/* Pending approvals */}
      {pendingUsers.length > 0 && (
        <div className="glass-card overflow-hidden border border-amber-300/30 dark:border-amber-500/20">
          <div className="px-4 py-3 border-b border-amber-200/30 dark:border-amber-500/20 flex items-center gap-2">
            <span className="text-base">⏳</span>
            <p className="text-sm font-semibold text-amber-700 dark:text-amber-400">Pending Approvals ({pendingUsers.length})</p>
          </div>
          <div className="divide-y divide-black/5 dark:divide-white/5">
            {pendingUsers.map(u => (
              <div key={u.id} className="flex flex-wrap items-center gap-3 px-4 py-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {u.name?.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 truncate">{u.name}</p>
                  <p className="text-xs text-slate-400 truncate">{u.email}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => approveUser(u)}
                    className="text-xs px-3 py-1.5 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-700 hover:bg-green-200 dark:hover:bg-green-800/40 font-semibold transition-colors">
                    ✓ Approve
                  </button>
                  <button onClick={() => openReject(u)}
                    className="text-xs px-3 py-1.5 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-700 hover:bg-red-200 dark:hover:bg-red-800/40 font-semibold transition-colors">
                    ✕ Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Users table */}
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
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-black/5 dark:border-white/10 animate-pulse">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-700" />
                        <div className="space-y-1.5">
                          <div className="h-3 w-28 bg-slate-200 dark:bg-slate-700 rounded" />
                          <div className="h-2.5 w-36 bg-slate-200 dark:bg-slate-700 rounded" />
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3"><div className="h-6 w-16 bg-slate-200 dark:bg-slate-700 rounded-full" /></td>
                    <td className="px-4 py-3"><div className="h-8 w-24 bg-slate-200 dark:bg-slate-700 rounded-lg" /></td>
                    <td className="px-4 py-3"><div className="h-3 w-8 bg-slate-200 dark:bg-slate-700 rounded" /></td>
                    <td className="px-4 py-3"><div className="h-3 w-20 bg-slate-200 dark:bg-slate-700 rounded" /></td>
                    <td className="px-4 py-3"><div className="h-8 w-20 bg-slate-200 dark:bg-slate-700 rounded-lg" /></td>
                  </tr>
                ))
              ) : (
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
                          u.role === "admin"     ? "bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300" :
                          u.role === "sub_admin" ? "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300" :
                                                   "bg-slate-100 text-slate-600 dark:bg-slate-500/20 dark:text-slate-300"
                        }`}>
                          {u.role === "admin" ? "👑 Admin" : u.role === "sub_admin" ? "🔑 Sub-Admin" : "👤 User"}
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
                          {u.role !== "admin" && u.id !== me?.id && (
                            <button
                              onClick={() => setDeleteTarget(u)}
                              className="text-xs px-2.5 py-1 rounded-lg border border-red-300/50 text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                            >
                              🗑
                            </button>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Weekly Notification Schedules */}
      <WeeklySchedules users={users} usersLoading={loading} />

      {/* Manual trigger */}
      <div className="glass-card px-4 py-3 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">🧪 Test Scheduled Notifications</p>
          <p className="text-xs text-slate-400 mt-0.5">Fires right now for any schedule matching the current UTC day + time</p>
        </div>
        <button
          onClick={async () => {
            try {
              await api.post("/admin/schedules/trigger-now");
              toast.success("Trigger fired — check notification logs");
            } catch { toast.error("Failed to trigger"); }
          }}
          className="text-xs px-3 py-2 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-700 hover:bg-indigo-200 dark:hover:bg-indigo-800/40 font-semibold transition-colors whitespace-nowrap"
        >
          ▶ Trigger Now
        </button>
      </div>

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

      <ConfirmModal
        open={!!deleteTarget}
        title={`Delete "${deleteTarget?.name}"?`}
        message="Their questions will remain. This action cannot be undone."
        confirmLabel="Delete User"
        onConfirm={deleteUser}
        onCancel={() => setDeleteTarget(null)}
      />

      {/* Reject user modal */}
      <AnimatePresence>
        {rejectTarget && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setRejectTarget(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="glass-card w-full max-w-sm p-6 space-y-4"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-lg flex-shrink-0">❌</div>
                <div>
                  <p className="font-bold text-slate-800 dark:text-slate-100">Reject "{rejectTarget?.name}"?</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">A push notification with your reason will be sent to the user.</p>
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 block">Reason <span className="text-red-400">*</span></label>
                <textarea
                  rows={3}
                  value={rejectReason}
                  onChange={e => setRejectReason(e.target.value)}
                  placeholder="e.g. Incomplete profile, duplicate account, not eligible…"
                  className="input-light w-full resize-none text-sm"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button onClick={() => setRejectTarget(null)} className="px-4 py-2 text-sm rounded-xl border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                  Cancel
                </button>
                <button
                  onClick={confirmReject}
                  disabled={rejectLoading || !rejectReason.trim()}
                  className="px-4 py-2 text-sm rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold transition-colors disabled:opacity-50"
                >
                  {rejectLoading ? "Rejecting…" : "❌ Reject & Notify"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
