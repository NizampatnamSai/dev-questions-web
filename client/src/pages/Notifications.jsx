import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api/axios";

const TYPE_ICON = {
  manual:           "📢",
  broadcast:        "📣",
  study_reminder:   "📚",
  challenge:        "⚡",
  community_reminder:"🌍",
  question_deleted: "🗑️",
  new_question:     "❓",
  comment:          "💬",
};

function fmtDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  const now = new Date();
  const diff = (now - d) / 1000;
  if (diff < 60)   return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  const yesterday = new Date(now); yesterday.setDate(now.getDate() - 1);
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

export default function Notifications() {
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/admin/notifications/my");
      setItems(data);
    } catch { /* ignore */ }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const markAllRead = async () => {
    await api.patch("/admin/notifications/my/read-all").catch(() => {});
    setItems(prev => prev.map(n => ({ ...n, read: true })));
  };

  const markOneRead = async (id) => {
    await api.patch(`/admin/notifications/my/${id}/read`).catch(() => {});
    setItems(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const unread = items.filter(n => !n.read).length;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">🔔 Notifications</h1>
          <p className="text-sm text-slate-500 mt-0.5">{unread > 0 ? `${unread} unread` : "All caught up!"}</p>
        </div>
        {unread > 0 && (
          <button onClick={markAllRead}
            className="text-xs px-3 py-1.5 rounded-lg border border-indigo-300/40 text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors font-medium">
            Mark all read
          </button>
        )}
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 animate-pulse bg-slate-100 dark:bg-slate-800 rounded-xl" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 text-slate-400">
          <div className="text-5xl mb-3">🔕</div>
          <p className="font-medium">No notifications yet</p>
          <p className="text-sm mt-1">You'll see push notifications and study reminders here.</p>
        </div>
      ) : (
        <AnimatePresence initial={false}>
          <div className="space-y-2">
            {items.map((n, i) => (
              <motion.div
                key={n.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className={`flex items-start gap-3 p-4 rounded-xl border transition-all ${
                  n.read
                    ? "glass-card opacity-70"
                    : "bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-700/40"
                }`}
              >
                <div className="text-2xl flex-shrink-0 mt-0.5">{TYPE_ICON[n.type] ?? "🔔"}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-sm font-semibold leading-tight ${n.read ? "text-slate-600 dark:text-slate-300" : "text-slate-800 dark:text-white"}`}>
                      {n.title}
                    </p>
                    <span className="text-[10px] text-slate-400 whitespace-nowrap flex-shrink-0 mt-0.5">{fmtDate(n.createdAt)}</span>
                  </div>
                  {n.body && n.body !== n.title && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">{n.body}</p>
                  )}
                  {n.sentByName && (
                    <p className="text-[10px] text-slate-400 mt-1">From: {n.sentByName}</p>
                  )}
                </div>
                {!n.read && (
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <div className="w-2 h-2 rounded-full bg-indigo-500 mt-1.5" />
                    <button onClick={() => markOneRead(n.id)}
                      className="text-[10px] px-2 py-0.5 rounded-full border border-indigo-300/40 text-indigo-400 hover:bg-indigo-500/10 transition-colors whitespace-nowrap">
                      Mark read
                    </button>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      )}
    </motion.div>
  );
}
