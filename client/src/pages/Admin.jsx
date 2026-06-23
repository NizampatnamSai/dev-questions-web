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

  const regularUsers  = users.filter(u => u.role !== "admin");
  const activeSchedules = schedules
    .filter(s => s.userId)
    .map(s => {
      const u = users.find(u => u.id === s.userId);
      const pad = n => String(n).padStart(2, "0");
      const timeStr = `${pad(s.hour)}:${pad(s.minute ?? 0)}`;
      // Convert UTC to IST for display
      const [hh, mm] = timeStr.split(":").map(Number);
      const istMin = (hh * 60 + (mm || 0) + 330) % (24 * 60);
      const istH = Math.floor(istMin / 60);
      const istM = istMin % 60;
      const istStr = `${pad(istH)}:${pad(istM)} IST`;
      return { ...s, userName: u?.name || s.userId, istStr };
    })
    .sort((a, b) => {
      const days = ["monday","tuesday","wednesday","thursday","friday","saturday","sunday"];
      return days.indexOf(a.day) - days.indexOf(b.day) || a.hour - b.hour;
    });

  const [showSummary, setShowSummary] = useState(true);

  return (
    <div className="glass-card overflow-hidden">
      <div className="px-4 py-3 border-b border-black/5 dark:border-white/10 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">🔔 Push Reminder Schedule</p>
          <p className="text-xs text-slate-400 mt-0.5">Set a weekly nudge for each user — they'll get a push notification to keep their streak alive</p>
        </div>
        <button onClick={() => setShowSummary(v => !v)} className="text-xs px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-700/40 font-medium">
          {showSummary ? "Hide Summary" : `📋 Active (${activeSchedules.length})`}
        </button>
      </div>

      {/* Active schedules summary */}
      {showSummary && !loading && (
        <div className="px-4 py-3 border-b border-black/5 dark:border-white/10 bg-slate-50 dark:bg-slate-800/40">
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
            Active Schedules ({activeSchedules.length})
          </p>
          {activeSchedules.length === 0 ? (
            <p className="text-xs text-slate-400">No schedules set yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {activeSchedules.map(s => (
                <div key={s.userId} className="flex items-center gap-2 bg-white dark:bg-slate-800 rounded-xl px-3 py-2 border border-slate-200 dark:border-slate-700">
                  <div className="w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-xs font-bold text-indigo-600 dark:text-indigo-300 flex-shrink-0">
                    {s.userName?.[0]?.toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 truncate">{s.userName}</p>
                    <p className="text-xs text-slate-400 capitalize">{s.day} · {s.istStr}</p>
                    {s.message && <p className="text-[10px] text-slate-400 truncate mt-0.5">"{s.message}"</p>}
                  </div>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${s.enabled !== false ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400" : "bg-slate-100 dark:bg-slate-700 text-slate-400"}`}>
                    {s.enabled !== false ? "ON" : "OFF"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

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

const DAYS_LABELS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

// Convert UTC h:m → IST display string
function utcToIst(h, m) {
  const totalMin = h * 60 + m + 330;
  const hh = Math.floor(totalMin / 60) % 24;
  const mm  = totalMin % 60;
  const ampm = hh >= 12 ? "PM" : "AM";
  const h12  = hh % 12 || 12;
  return `${h12}:${String(mm).padStart(2,"0")} ${ampm} IST`;
}
// Convert IST h:m (24h) → UTC
function istToUtc(h, m) {
  const totalMin = h * 60 + m - 330 + 24 * 60;
  return { hour: Math.floor(totalMin / 60) % 24, minute: totalMin % 60 };
}

function AutoPostModal({ user: targetUser, onClose }) {
  const CATEGORIES = ["HTML/CSS", "JavaScript", "React", "Next.js", "React Native"];
  const TYPES      = ["Technical", "Coding"];
  const LEVELS     = ["Low", "Medium", "High"];
  const [category, setCategory] = useState("");
  const [type, setType]         = useState("");
  const [level, setLevel]       = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading]   = useState(false);
  const [posting, setPosting]   = useState(null);

  const fetchSuggestions = async () => {
    setLoading(true);
    try {
      const params = {};
      if (category) params.category = category;
      if (type)     params.type     = type;
      if (level)    params.level    = level;
      const { data } = await api.get("/questions/admin/random-suggestions", { params });
      setSuggestions(data);
    } catch { toast.error("Failed to fetch suggestions"); }
    finally { setLoading(false); }
  };

  const post = async (q) => {
    setPosting(q.id);
    try {
      await api.post("/questions/admin/auto-post", {
        question_id: q.id,
        on_behalf_of_user_id: targetUser.id,
      });
      toast.success(`Posted on behalf of ${targetUser.name}!`);
      onClose();
    } catch { toast.error("Failed to post"); }
    finally { setPosting(null); }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg p-6 space-y-4"
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-bold text-slate-800 dark:text-slate-100">🤖 Auto Post for {targetUser.name}</p>
            <p className="text-xs text-slate-400 mt-0.5">Select filters → pick a question → posts as "Admin on behalf of {targetUser.name}"</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-xl">✕</button>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <select value={category} onChange={e => setCategory(e.target.value)} className="input-light text-xs !py-1.5">
            <option value="">Any Category</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={type} onChange={e => setType(e.target.value)} className="input-light text-xs !py-1.5">
            <option value="">Any Type</option>
            {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <select value={level} onChange={e => setLevel(e.target.value)} className="input-light text-xs !py-1.5">
            <option value="">Any Level</option>
            {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
        <button onClick={fetchSuggestions} disabled={loading}
          className="w-full py-2 rounded-xl bg-indigo-500 text-white text-sm font-semibold hover:bg-indigo-600 disabled:opacity-60 transition-colors">
          {loading ? "Fetching…" : "🎲 Get 5 Random Questions"}
        </button>
        {suggestions.length > 0 && (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {suggestions.map(q => (
              <div key={q.id} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <div className="flex-1 min-w-0">
                  <div className="flex gap-1.5 mb-1 flex-wrap">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-medium">{q.category}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 font-medium">{q.level} · {q.type}</span>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-snug line-clamp-2">{q.question}</p>
                </div>
                <button onClick={() => post(q)} disabled={posting === q.id}
                  className="text-xs px-3 py-1.5 rounded-lg bg-indigo-500 text-white font-semibold flex-shrink-0 hover:bg-indigo-600 disabled:opacity-50 transition-colors">
                  {posting === q.id ? "…" : "Post"}
                </button>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}

function CommunityScheduleEditor({ users }) {
  const [schedule, setSchedule]     = useState([]);
  const [saving, setSaving]         = useState(null);
  const [reminderUtcH, setReminderUtcH] = useState(4);
  const [reminderUtcM, setReminderUtcM] = useState(45);
  const [timeInput, setTimeInput]   = useState("10:15"); // IST
  const [autoPostTarget, setAutoPostTarget] = useState(null);

  useEffect(() => {
    api.get("/admin/community-schedule").then(r => {
      setSchedule(r.data.schedule ?? r.data);
      const h = r.data.reminderHourUTC ?? 4;
      const m = r.data.reminderMinuteUTC ?? 45;
      setReminderUtcH(h);
      setReminderUtcM(m);
      // Convert UTC → IST for display
      const istMin = (h * 60 + m + 330) % (24 * 60);
      const ih = Math.floor(istMin / 60), im = istMin % 60;
      setTimeInput(`${String(ih).padStart(2,"0")}:${String(im).padStart(2,"0")}`);
    }).catch(() => {});
  }, []);

  const save = async (weekday, email) => {
    setSaving(weekday);
    try {
      await api.put("/admin/community-schedule", { weekday, email: email || null });
      setSchedule(prev => {
        const exists = prev.find(d => d.weekday === weekday);
        if (exists) return prev.map(d => d.weekday === weekday ? { ...d, email: email || null } : d);
        return [...prev, { weekday, email: email || null, muted: false }];
      });
      toast.success("Saved");
    } catch { toast.error("Failed to save"); }
    finally { setSaving(null); }
  };

  const toggleMute = async (weekday, currentMuted) => {
    try {
      await api.put("/admin/community-schedule", { weekday, muted: !currentMuted });
      setSchedule(prev => prev.map(d => d.weekday === weekday ? { ...d, muted: !currentMuted } : d));
      toast.success(currentMuted ? "Notifications re-enabled" : "Notifications muted for this day");
    } catch { toast.error("Failed"); }
  };

  const saveTime = async () => {
    const [ih, im] = timeInput.split(":").map(Number);
    if (isNaN(ih) || isNaN(im)) return toast.error("Invalid time");
    const { hour, minute } = istToUtc(ih, im);
    setSaving("time");
    try {
      await api.put("/admin/community-schedule", { weekday: -1, hour, minute });
      setReminderUtcH(hour); setReminderUtcM(minute);
      toast.success(`Reminder set to ${utcToIst(hour, minute)}`);
    } catch { toast.error("Failed to save time"); }
    finally { setSaving(null); }
  };

  const regularUsers = users.filter(u => u.role !== "admin");

  return (
    <>
    <div className="glass-card overflow-hidden">
      <div className="px-4 pt-4 pb-3 border-b border-black/5 dark:border-white/10 space-y-3">
        <div>
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">📅 Community Posting Schedule</p>
          <p className="text-xs text-slate-400 mt-0.5">Set who can post each day. A reminder notification fires at the time below.</p>
        </div>
        {/* Reminder time row */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 whitespace-nowrap">⏰ Daily reminder time (IST)</span>
          <input
            type="time"
            value={timeInput}
            onChange={e => setTimeInput(e.target.value)}
            className="input-light !py-1 !px-2 text-sm"
            style={{ width: 120 }}
          />
          <span className="text-xs text-slate-400">
            = {reminderUtcH.toString().padStart(2,"0")}:{(reminderUtcM||0).toString().padStart(2,"0")} UTC
          </span>
          <button
            onClick={saveTime}
            disabled={saving === "time"}
            className="text-xs px-3 py-1.5 rounded-lg bg-indigo-500 text-white font-semibold disabled:opacity-50 transition-colors hover:bg-indigo-600"
          >
            {saving === "time" ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
      <div className="divide-y divide-black/5 dark:divide-white/5">
        {DAYS_LABELS.map((day, i) => {
          const entry = schedule.find(d => d.weekday === i);
          const currentEmail = entry?.email || "";
          return (
            <div key={i} className="flex items-center gap-3 px-4 py-3">
              <div className="w-24 flex-shrink-0">
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{day}</p>
              </div>
              <select
                value={currentEmail}
                onChange={e => save(i, e.target.value)}
                disabled={saving === i}
                className="input-light flex-1 !py-1.5 text-sm"
              >
                <option value="">— Closed —</option>
                {i === 5 && <option value="ADMIN_ONLY">Admin only</option>}
                {regularUsers.map(u => (
                  <option key={u.id} value={u.email}>{u.name} ({u.email})</option>
                ))}
              </select>
              {saving === i && <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin flex-shrink-0" />}
              {entry?.name && (
                <span className="text-xs text-indigo-500 font-medium flex-shrink-0 hidden sm:block">{entry.name}</span>
              )}
              {currentEmail && currentEmail !== "ADMIN_ONLY" && (() => {
                const u = regularUsers.find(u => u.email === currentEmail);
                const isMuted = entry?.muted;
                return u ? (
                  <>
                  <button onClick={() => setAutoPostTarget(u)}
                    className="text-xs px-2.5 py-1 rounded-lg border border-purple-300/50 text-purple-500 hover:bg-purple-50 dark:hover:bg-purple-500/10 flex-shrink-0 transition-colors"
                    title="Auto-post a question on behalf of this user">
                    🤖 Auto
                  </button>
                  <button onClick={() => toggleMute(i, isMuted)}
                    className={`text-xs px-2.5 py-1 rounded-lg border flex-shrink-0 transition-colors ${
                      isMuted
                        ? "border-green-300/50 text-green-500 hover:bg-green-50 dark:hover:bg-green-500/10"
                        : "border-slate-300/50 text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                    }`}
                    title={isMuted ? "Re-enable notification for this day" : "Mute notification (user resigned/left)"}>
                    {isMuted ? "🔈 Unmute" : "🔇 Mute"}
                  </button>
                  </>
                ) : null;
              })()}
            </div>
          );
        })}
      </div>
    </div>
    {autoPostTarget && <AutoPostModal user={autoPostTarget} onClose={() => setAutoPostTarget(null)} />}
    </>
  );
}

function TestNotifyPanel({ users }) {
  const [title, setTitle]         = useState("👋 Hello from Admin");
  const [body, setBody]           = useState("");
  const [selectedIds, setSelected] = useState(["all"]);
  const [sending, setSending]     = useState(false);
  const [schedMode, setSchedMode] = useState(false); // false = send now, true = scheduled
  const [schedTime, setSchedTime] = useState("");    // local datetime-local value

  const regularUsers = users.filter(u => u.role !== "admin");

  const toggle = (id) => {
    if (id === "all") { setSelected(["all"]); return; }
    setSelected(prev => {
      const without = prev.filter(x => x !== "all" && x !== id);
      return prev.includes(id) ? without : [...without, id];
    });
  };

  const send = async () => {
    if (!title.trim()) return toast.error("Title is required");
    if (selectedIds.length === 0) return toast.error("Select at least one user");
    if (schedMode && !schedTime) return toast.error("Pick a scheduled time");
    setSending(true);
    try {
      const payload = {
        user_ids: selectedIds.includes("all") ? ["all"] : selectedIds,
        title: title.trim(),
        body: body.trim() || title.trim(),
      };
      if (schedMode && schedTime) {
        // Convert local datetime to ISO UTC
        payload.schedule_at = new Date(schedTime).toISOString();
      }
      const { data } = await api.post("/admin/notify/send-to-users", payload);
      if (schedMode) {
        toast.success(`Scheduled for ${new Date(schedTime).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}`);
      } else {
        toast.success(`Sent to ${data.users} user(s) · ${data.sent} device(s)`);
      }
    } catch { toast.error("Failed to send"); }
    finally { setSending(false); }
  };

  // Min datetime = now
  const minDateTime = new Date(Date.now() + 60000).toISOString().slice(0, 16);

  return (
    <div className="glass-card overflow-hidden">
      <div className="px-4 py-3 border-b border-black/5 dark:border-white/10 flex items-center justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">🧪 Send Notification</p>
          <p className="text-xs text-slate-400 mt-0.5">Push to specific users or everyone — now or scheduled</p>
        </div>
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5">
          <button onClick={() => setSchedMode(false)}
            className={`text-xs px-2.5 py-1 rounded-md font-semibold transition-colors ${!schedMode ? "bg-white dark:bg-slate-700 text-indigo-600 shadow-sm" : "text-slate-500"}`}>
            ▶ Now
          </button>
          <button onClick={() => setSchedMode(true)}
            className={`text-xs px-2.5 py-1 rounded-md font-semibold transition-colors ${schedMode ? "bg-white dark:bg-slate-700 text-indigo-600 shadow-sm" : "text-slate-500"}`}>
            ⏰ Schedule
          </button>
        </div>
      </div>
      <div className="p-4 space-y-4">
        {/* Title + body */}
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 block">Title</label>
            <input value={title} onChange={e => setTitle(e.target.value)} className="input-light w-full text-sm" placeholder="Notification title" />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 block">Body (optional)</label>
            <input value={body} onChange={e => setBody(e.target.value)} className="input-light w-full text-sm" placeholder="Notification body…" />
          </div>
        </div>

        {/* Timer picker */}
        {schedMode && (
          <div>
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 block">📅 Send at (your local time)</label>
            <input
              type="datetime-local"
              value={schedTime}
              min={minDateTime}
              onChange={e => setSchedTime(e.target.value)}
              className="input-light w-full text-sm"
            />
            {schedTime && (
              <p className="text-[10px] text-slate-400 mt-1">
                = {new Date(schedTime).toISOString().replace("T", " ").slice(0, 16)} UTC
              </p>
            )}
          </div>
        )}

        {/* User selector */}
        <div>
          <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 block">Send to</label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => toggle("all")}
              className={`text-xs px-3 py-1.5 rounded-full border font-semibold transition-colors ${
                selectedIds.includes("all")
                  ? "bg-indigo-500 text-white border-indigo-500"
                  : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-indigo-400"
              }`}
            >
              All Users
            </button>
            {regularUsers.map(u => (
              <button
                key={u.id}
                onClick={() => toggle(u.id)}
                className={`text-xs px-3 py-1.5 rounded-full border font-semibold transition-colors ${
                  selectedIds.includes(u.id) && !selectedIds.includes("all")
                    ? "bg-indigo-500 text-white border-indigo-500"
                    : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-indigo-400"
                }`}
              >
                {u.name}
              </button>
            ))}
          </div>
          <p className="text-[10px] text-slate-400 mt-1.5">
            {selectedIds.includes("all") ? "Will send to all users" : `${selectedIds.length} user(s) selected`}
          </p>
        </div>

        <button
          onClick={send}
          disabled={sending}
          className="btn-primary w-full disabled:opacity-60 text-sm"
        >
          {sending ? "Sending…" : schedMode ? "⏰ Schedule Notification" : "▶ Send Now"}
        </button>
      </div>
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

function AppConfigPanel() {
  const [config, setConfig] = useState({ maintenance: false, maintenance_message: "", force_update: false, force_update_message: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get("/admin/app-config").then(({ data }) => setConfig(data)).catch(() => {});
  }, []);

  const save = async (patch) => {
    setSaving(true);
    try {
      await api.put("/admin/app-config", patch);
      setConfig(c => ({ ...c, ...patch }));
      toast.success("Saved");
    } catch { toast.error("Failed"); }
    setSaving(false);
  };

  return (
    <div className="glass-card p-6 space-y-6">
      <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">⚙️ App Control</h2>

      {/* Maintenance Mode */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-slate-700 dark:text-slate-200">🔧 Maintenance Mode</p>
            <p className="text-xs text-slate-400 mt-0.5">All users (except admins) will see a maintenance page. A push notification is sent when you turn it back on.</p>
          </div>
          <button
            onClick={() => save({ maintenance: !config.maintenance, maintenance_message: config.maintenance_message })}
            disabled={saving}
            className={`relative w-12 h-6 rounded-full transition-colors ${config.maintenance ? "bg-red-500" : "bg-slate-300 dark:bg-slate-600"}`}
          >
            <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${config.maintenance ? "translate-x-6" : ""}`} />
          </button>
        </div>
        <textarea
          value={config.maintenance_message}
          onChange={e => setConfig(c => ({ ...c, maintenance_message: e.target.value }))}
          onBlur={() => save({ maintenance_message: config.maintenance_message })}
          placeholder="Maintenance message shown to users…"
          rows={2}
          className="w-full text-sm px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 outline-none focus:border-indigo-400 text-slate-700 dark:text-slate-200 placeholder:text-slate-400 resize-none"
        />
        {config.maintenance && (
          <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
            ⚠️ Maintenance mode is ON — users cannot access the app
          </div>
        )}
      </div>

      <div className="border-t border-black/5 dark:border-white/10" />

      {/* Force Update */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-slate-700 dark:text-slate-200">🚀 Force Update Banner</p>
            <p className="text-xs text-slate-400 mt-0.5">Shows a banner on web and sends a push notification prompting users to refresh / update the app.</p>
          </div>
          <button
            onClick={() => save({ force_update: !config.force_update, force_update_message: config.force_update_message })}
            disabled={saving}
            className={`relative w-12 h-6 rounded-full transition-colors ${config.force_update ? "bg-indigo-500" : "bg-slate-300 dark:bg-slate-600"}`}
          >
            <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${config.force_update ? "translate-x-6" : ""}`} />
          </button>
        </div>
        <textarea
          value={config.force_update_message}
          onChange={e => setConfig(c => ({ ...c, force_update_message: e.target.value }))}
          onBlur={() => save({ force_update_message: config.force_update_message })}
          placeholder="e.g. New content added! Please refresh to get the latest updates."
          rows={2}
          className="w-full text-sm px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 outline-none focus:border-indigo-400 text-slate-700 dark:text-slate-200 placeholder:text-slate-400 resize-none"
        />
        {config.force_update && (
          <div className="text-xs text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 rounded-lg px-3 py-2">
            🚀 Update banner is showing to all users
          </div>
        )}
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

  const [invalidUsers, setInvalidUsers] = useState([]);
  const [invalidLoading, setInvalidLoading] = useState(false);
  const [invalidDeleteTarget, setInvalidDeleteTarget] = useState(null);

  const loadInvalidUsers = async () => {
    setInvalidLoading(true);
    try { const { data } = await api.get("/admin/users/invalid"); setInvalidUsers(data); }
    catch {} finally { setInvalidLoading(false); }
  };

  const deleteInvalidUser = async (uid) => {
    try {
      await api.delete(`/admin/users/${uid}`);
      setInvalidUsers(p => p.filter(u => u.id !== uid));
      toast.success("User deleted");
    } catch { toast.error("Failed to delete"); }
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
      setUsers(prev => prev.filter(x => x.id !== rejectTarget.id));
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

  const toggleDisable = async (u) => {
    const isDisabled = u.status === "disabled";
    const action = isDisabled ? "enable" : "disable";
    if (!isDisabled && !window.confirm(`Disable ${u.name}? They will be immediately logged out and treated as a guest.`)) return;
    try {
      await api.patch(`/admin/users/${u.id}/${action}`);
      setUsers(prev => prev.map(x => x.id === u.id ? { ...x, status: isDisabled ? "approved" : "disabled" } : x));
      toast.success(isDisabled ? "User re-enabled" : "User disabled");
    } catch { toast.error("Failed"); }
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
                          {u.role !== "admin" && u.id !== me?.id && (<>
                            <button
                              onClick={() => toggleDisable(u)}
                              className={`text-xs px-2.5 py-1 rounded-lg border transition-colors ${
                                u.status === "disabled"
                                  ? "border-green-300/50 text-green-500 hover:bg-green-50 dark:hover:bg-green-500/10"
                                  : "border-amber-300/50 text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-500/10"
                              }`}
                              title={u.status === "disabled" ? "Re-enable user" : "Disable user (guest mode)"}
                            >
                              {u.status === "disabled" ? "✅ Enable" : "🚫 Disable"}
                            </button>
                            <button
                              onClick={() => setDeleteTarget(u)}
                              className="text-xs px-2.5 py-1 rounded-lg border border-red-300/50 text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                            >
                              🗑
                            </button>
                          </>)}
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

      {/* Invalid / Orphaned Users */}
      <div className="glass-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">🧹 Invalid Users</h2>
            <p className="text-xs text-slate-400 mt-0.5">Users with no name or invalid email (show as "Unknown" in Leaderboard)</p>
          </div>
          <button onClick={loadInvalidUsers} disabled={invalidLoading}
            className="text-xs px-3 py-1.5 bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/15 rounded-lg text-slate-600 dark:text-slate-300 transition-colors">
            {invalidLoading ? "Loading…" : "🔍 Check Now"}
          </button>
        </div>
        {invalidUsers.length > 0 ? (
          <div className="space-y-2">
            {invalidUsers.map(u => (
              <div key={u.id} className="flex items-center justify-between px-4 py-2.5 bg-red-500/5 border border-red-500/20 rounded-xl">
                <div>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{u.name}</p>
                  <p className="text-xs text-slate-400">{u.email} · {u.role}</p>
                </div>
                <button onClick={() => setInvalidDeleteTarget(u)}
                  className="text-xs px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg border border-red-500/30 transition-colors">
                  🗑️ Delete
                </button>
              </div>
            ))}
          </div>
        ) : invalidUsers.length === 0 && !invalidLoading ? (
          <p className="text-xs text-slate-400 italic">Click "Check Now" to scan for invalid users.</p>
        ) : null}
      </div>

      {/* Community Posting Schedule */}
      <CommunityScheduleEditor users={users} />

      {/* Weekly Notification Schedules */}
      <WeeklySchedules users={users} usersLoading={loading} />

      {/* Test / Send Notifications */}
      <TestNotifyPanel users={users} />

      {/* Notification Logs */}
      <NotifyLogs logs={logs} loading={logsLoading} />

      {/* App Config */}
      <AppConfigPanel />

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

      <ConfirmModal
        open={!!invalidDeleteTarget}
        title={`Delete "${invalidDeleteTarget?.name}"?`}
        message={`Email: ${invalidDeleteTarget?.email}. This account will be permanently removed.`}
        confirmLabel="Delete"
        onConfirm={() => { deleteInvalidUser(invalidDeleteTarget.id); setInvalidDeleteTarget(null); }}
        onCancel={() => setInvalidDeleteTarget(null)}
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
