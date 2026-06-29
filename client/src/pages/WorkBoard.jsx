import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api/axios";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { parseUTC } from "../utils/time";

const _apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

function UserAvatar({ name, avatar, size = "w-7 h-7", textSize = "text-xs" }) {
  if (avatar) {
    return (
      <img
        src={avatar}
        alt={name}
        className={`${size} rounded-full object-cover flex-shrink-0`}
      />
    );
  }
  return (
    <div
      className={`${size} rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center ${textSize} font-bold text-indigo-600 dark:text-indigo-300 flex-shrink-0`}
    >
      {name?.[0]?.toUpperCase() || "?"}
    </div>
  );
}
const WS_BASE = _apiUrl
  .replace(/^http:/, "ws:")
  .replace(/^https:/, "wss:")
  .replace(/\/api$/, "");

function timeAgo(iso) {
  const diff = (Date.now() - parseUTC(iso).getTime()) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  return `${Math.floor(diff / 3600)}h ago`;
}

function canStillEdit(postedAt) {
  return Date.now() - parseUTC(postedAt).getTime() < 30 * 60 * 1000;
}

export default function WorkBoard() {
  const { user, profile } = useAuth();
  const [status, setStatus] = useState(null); // "none"|"pending"|"active"
  // const [posts, setPosts] = useState([]);
  const [todayPosts, setTodayPosts] = useState([]);
  const [historyPosts, setHistoryPosts] = useState([]);
  const [missing, setMissing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [posting, setPosting] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editMsg, setEditMsg] = useState("");
  const [editSaving, setEditSaving] = useState(false);
  const [pendingMembers, setPending] = useState([]);
  const [exportDate, setExportDate] = useState("");
  const [joining, setJoining] = useState(false);
  const [activeUsers, setActiveUsers] = useState([]);
  const [availableDates, setAvailableDates] = useState([]);
  // const [selectedDate, setSelectedDate] = useState(null);
  const [activeTab, setActiveTab] = useState("today"); // "today" | "history"
  const [selectedHistoryDate, setSelectedHistoryDate] = useState(null);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [wbConfig, setWbConfig] = useState({
    edit_window_minutes: 30,
    reminder_time: "09:30",
  });
  const [editingConfig, setEditingConfig] = useState(false);
  const [configDraft, setConfigDraft] = useState({});
  const [savingConfig, setSavingConfig] = useState(false);
  const wsRef = useRef(null);
  const bottomRef = useRef(null);

  // const myPost = posts.find((p) => p.userId === user?.id);
  const myTodayPost = todayPosts.find((p) => p.userId === user?.id);

  useEffect(() => {
    loadStatus();
    // loadActiveUsers();
    loadAvailableDates();
    api
      .get("/workboard/config")
      .then(({ data }) => setWbConfig(data))
      .catch(() => {});
    // No more polling — online count comes via WebSocket
    return () => {
      wsRef.current?.close();
    };
  }, []);

  const openToday = async () => {
    setActiveTab("today");
    setSelectedHistoryDate(null);

    if (!todayPosts.length) {
      setHistoryLoading(true);
      await loadBoard();
      setHistoryLoading(false);
    }
  };

  // const openToday = async () => {
  //   setActiveTab("today");
  //   setSelectedHistoryDate(null);
  //   // setHistoryLoading(true);

  //   // await loadBoard();

  //   // setHistoryLoading(false);
  // };

  const openHistory = () => {
    setActiveTab("history");
  };

  const openConfigEdit = () => {
    setConfigDraft({ ...wbConfig });
    setEditingConfig(true);
  };

  const saveConfig = async () => {
    setSavingConfig(true);
    try {
      const { data } = await api.patch("/workboard/config", {
        reminder_time: configDraft.reminder_time,
        edit_window_minutes: parseInt(configDraft.edit_window_minutes) || 30,
      });
      setWbConfig(data);
      setEditingConfig(false);
      toast.success("Settings saved!");
    } catch {
      toast.error("Failed to save");
    }
    setSavingConfig(false);
  };

  const loadAvailableDates = async () => {
    try {
      const { data } = await api.get("/workboard/dates");
      const todayStr = new Date().toISOString().slice(0, 10);
      setAvailableDates((data || []).filter((item) => item.date !== todayStr));
    } catch {
      // silently fail
    }
  };

  const loadActiveUsers = async () => {
    try {
      const { data } = await api.get("/workboard/active-users");
      setActiveUsers(data || []);
    } catch {
      // silently fail
    }
  };

  const loadStatus = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/workboard/status");
      setStatus(data.status);
      if (data.status === "active") {
        await loadBoard();
        connectWS();
      }
      if (user?.role === "admin" || user?.role === "sub_admin") {
        const { data: pending } = await api.get("/workboard/pending-members");
        setPending(pending);
      }
    } catch {}
    setLoading(false);
  };

  const loadBoard = async (date = null) => {
    try {
      const params = date ? `?date=${date}` : "";
      const postsRes = await api.get(`/workboard/posts${params}`);

      // Only fetch missing if viewing today
      if (!date) {
        setTodayPosts(postsRes.data);
        const missingRes = await api.get("/workboard/missing-today");
        setMissing(missingRes.data);
      } else {
        setHistoryPosts(postsRes.data);
        setMissing([]);
      }

      // setPosts(postsRes.data);
    } catch (err) {
      console.error("Error loading board:", err);
    }
  };

  const handleSelectHistoryDate = async (date) => {
    setSelectedHistoryDate(date);

    setHistoryPosts([]); // remove stale data immediately
    setHistoryLoading(true);

    try {
      await loadBoard(date);
    } finally {
      setHistoryLoading(false);
    }
  };

  // const handleSelectDate = async (date) => {
  //   setSelectedDate(date);
  //   setHistoryLoading(true);
  //   await loadBoard(date);
  //   setHistoryLoading(false);
  // };

  const connectWS = () => {
    const token = localStorage.getItem("devquiz_token");
    const userId = encodeURIComponent(user?.id || "");
    const userName = encodeURIComponent(user?.name || "");
    // const userAvatar = encodeURIComponent(profile?.avatar_url || "");
    const ws = new WebSocket(
      `${WS_BASE}/api/workboard/ws?user_id=${userId}&user_name=${userName}`,
    );
    ws.onmessage = (e) => {
      try {
        const msg = JSON.parse(e.data);
        const { type, post } = msg;
        if (type === "online_count") {
          setActiveUsers(
            (msg.users || []).filter(({ id }) => id && id !== "anonymous"),
          );
        }
        if (type === "new_post") {
          setTodayPosts((prev) => {
            if (prev.find((p) => p.id === post.id)) return prev;
            return [...prev, post];
          });
          setMissing((prev) => prev.filter((m) => m.userId !== post.userId));
        }
        if (type === "edit_post") {
          setTodayPosts((prev) =>
            prev.map((p) =>
              p.id === post.id ? { ...p, message: post.message } : p,
            ),
          );
        }
      } catch {}
    };
    ws.onclose = () => setTimeout(connectWS, 3000);
    wsRef.current = ws;
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [todayPosts]);

  const join = async () => {
    setJoining(true);
    try {
      await api.post("/workboard/join");
      toast.success("Join request sent! Waiting for admin approval.");
      setStatus("pending");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Error");
    } finally {
      setJoining(false);
    }
  };

  const submitPost = async () => {
    if (!message.trim()) return;
    setPosting(true);
    try {
      await api.post("/workboard/posts", { message });
      setMessage("");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to post");
    }
    setPosting(false);
  };

  const startEdit = (post) => {
    setEditId(post.id);
    setEditMsg(post.message);
  };

  const saveEdit = async () => {
    if (!editMsg.trim()) return;
    setEditSaving(true);
    try {
      await api.put(`/workboard/posts/${editId}`, { message: editMsg });
      setEditId(null);
      toast.success("Updated!");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Error");
    }
    setEditSaving(false);
  };

  const exportPosts = (mode) => {
    const token = localStorage.getItem("devquiz_token");
    const base = _apiUrl;
    let url = `${base}/workboard/export`;
    if (mode === "all") url += "?all=true";
    else if (mode === "date" && exportDate) url += `?date=${exportDate}`;
    else url += `?date=${new Date().toISOString().slice(0, 10)}`;
    // trigger download
    const a = document.createElement("a");
    a.href = url;
    a.setAttribute("download", "");
    // pass token via query since it's a direct download link
    fetch(url, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.blob())
      .then((blob) => {
        const objUrl = URL.createObjectURL(blob);
        a.href = objUrl;
        a.click();
        URL.revokeObjectURL(objUrl);
      })
      .catch(() => toast.error("Export failed"));
  };

  const approveMember = async (uid) => {
    await api.patch(`/workboard/members/${uid}/approve`);
    setPending((prev) => prev.filter((m) => m.userId !== uid));
    toast.success("Approved!");
  };

  const rejectMember = async (uid) => {
    await api.patch(`/workboard/members/${uid}/reject`);
    setPending((prev) => prev.filter((m) => m.userId !== uid));
  };

  if (loading)
    return (
      <div className="space-y-3 max-w-2xl glass-card divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-4 animate-pulse">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* Avatar */}
                <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-700" />

                <div className="space-y-2">
                  {/* Name */}
                  <div className="h-3 w-28 rounded bg-slate-200 dark:bg-slate-700" />
                  {/* Message line 1 */}
                  <div className="h-3 w-56 rounded bg-slate-200 dark:bg-slate-700" />
                  {/* Message line 2 */}
                  <div className="h-3 w-40 rounded bg-slate-200 dark:bg-slate-700" />
                </div>
              </div>

              {/* Time */}
              <div className="h-3 w-12 rounded bg-slate-200 dark:bg-slate-700" />
            </div>
          </div>
        ))}
      </div>
    );

  const isAdmin = user?.role === "admin" || user?.role === "sub_admin";

  return (
    <div className="max-w-2xl space-y-5">
      {/* Header */}
      <div className="glass-card p-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="text-3xl">📋</div>
            <div className="min-w-0">
              <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                Daily Work Board
              </h1>
              {editingConfig && isAdmin ? (
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <label className="text-xs text-slate-400">Reminder:</label>
                  <input
                    type="time"
                    value={configDraft.reminder_time || "09:30"}
                    onChange={(e) =>
                      setConfigDraft((d) => ({
                        ...d,
                        reminder_time: e.target.value,
                      }))
                    }
                    className="text-xs px-2 py-1 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-slate-700 dark:text-slate-200 outline-none focus:border-indigo-400"
                  />
                  <label className="text-xs text-slate-400">Edit window:</label>
                  <input
                    type="number"
                    min={5}
                    max={1440}
                    value={configDraft.edit_window_minutes || 30}
                    onChange={(e) =>
                      setConfigDraft((d) => ({
                        ...d,
                        edit_window_minutes: e.target.value,
                      }))
                    }
                    className="text-xs px-2 py-1 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-slate-700 dark:text-slate-200 outline-none focus:border-indigo-400 w-16"
                  />
                  <span className="text-xs text-slate-400">min</span>
                  <button
                    onClick={saveConfig}
                    disabled={savingConfig}
                    className="px-3 py-1 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-500 disabled:opacity-50 transition-colors"
                  >
                    {savingConfig ? "Saving…" : "Save"}
                  </button>
                  <button
                    onClick={() => setEditingConfig(false)}
                    className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-400 text-xs hover:bg-slate-200 dark:hover:bg-white/15 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 mt-0.5">
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Mon–Sat standups · {wbConfig.reminder_time} reminder ·{" "}
                    {wbConfig.edit_window_minutes}-min edit window
                  </p>
                  {isAdmin && (
                    <button
                      onClick={openConfigEdit}
                      className="text-slate-400 hover:text-indigo-500 transition-colors p-0.5 rounded"
                      title="Edit settings"
                    >
                      <svg
                        width="13"
                        height="13"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
          {activeUsers.length > 0 && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 flex-shrink-0">
              <span className="text-xs font-semibold text-green-600 dark:text-green-400">
                👥 {activeUsers.length} online
              </span>
            </div>
          )}
        </div>
      </div>

      {/* View selector: Today vs History */}
      {status === "active" && (
        <div className="flex gap-2 border-b border-slate-200 dark:border-slate-800">
          <button
            onClick={openToday}
            className={`px-4 py-2 text-sm font-semibold transition border-b-2 ${
              activeTab === "today"
                ? "text-indigo-600 dark:text-indigo-400 border-indigo-600 dark:border-indigo-400"
                : "text-slate-500 dark:text-slate-400 border-transparent hover:text-slate-700 dark:hover:text-slate-300"
            }`}
          >
            📅 Today
          </button>
          <button
            onClick={openHistory}
            className={`px-4 py-2 text-sm font-semibold transition border-b-2 ${
              activeTab === "history"
                ? "text-indigo-600 dark:text-indigo-400 border-indigo-600 dark:border-indigo-400"
                : "text-slate-500 dark:text-slate-400 border-transparent hover:text-slate-700 dark:hover:text-slate-300"
            }`}
          >
            📜 History
          </button>
        </div>
      )}

      {/* History date picker */}

      {/* !selectedHistoryDate  */}
      {status === "active" && activeTab === "history" && (
        <div className="glass-card p-4 space-y-3">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            📜 Browse History
          </p>
          {availableDates.length === 0 ? (
            <p className="text-sm text-slate-400">
              No posts history available yet
            </p>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {availableDates.map((item) => (
                <button
                  key={item.date}
                  // onClick={() => handleSelectDate(item.date)}
                  onClick={() => handleSelectHistoryDate(item.date)}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition border border-slate-200 dark:border-slate-800"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                      {new Date(item.date).toLocaleDateString("en-IN", {
                        weekday: "short",
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span>📝 {item.postCount}</span>
                      <span>👥 {item.memberCount}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Active users list */}
      {activeUsers.length > 0 && activeTab === "today" && (
        <div className="glass-card p-4 space-y-2">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Currently Viewing
          </p>
          <div className="flex flex-wrap gap-2">
            {activeUsers.map((u) => (
              <div
                key={u.id || u.userId}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20"
              >
                <UserAvatar
                  name={u.name || u.userName}
                  avatar={u.userAvatar}
                  size="w-6 h-6"
                />
                <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300">
                  {u.name || u.userName}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Admin: pending join requests */}
      {isAdmin && pendingMembers.length > 0 && (
        <div className="glass-card p-4 space-y-2 border border-amber-200 dark:border-amber-700/40">
          <p className="text-xs font-bold text-amber-600 uppercase tracking-wider">
            Pending Join Requests ({pendingMembers.length})
          </p>
          {pendingMembers.map((m) => (
            <div
              key={m.id || m.userId}
              className="flex items-center justify-between text-sm"
            >
              <span className="text-slate-700 dark:text-slate-300">
                {m.userName}{" "}
                <span className="text-slate-400 text-xs">{m.userEmail}</span>
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => approveMember(m.userId)}
                  className="px-3 py-1 rounded-lg bg-green-500 hover:bg-green-600 text-white text-xs font-semibold"
                >
                  ✓ Approve
                </button>
                <button
                  onClick={() => rejectMember(m.userId)}
                  className="px-3 py-1 rounded-lg bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 text-xs font-semibold"
                >
                  ✕ Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Admin export */}
      {isAdmin && (
        <div className="glass-card p-4 space-y-3 border border-indigo-200 dark:border-indigo-700/40">
          <p className="text-xs font-bold text-indigo-500 uppercase tracking-wider">
            📤 Export Posts (CSV)
          </p>
          <div className="flex flex-wrap gap-2 items-center">
            <input
              type="date"
              value={exportDate}
              onChange={(e) => setExportDate(e.target.value)}
              className="input-light text-sm px-3 py-1.5 rounded-lg"
            />
            <button
              onClick={() => exportPosts("date")}
              className="px-3 py-1.5 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-semibold hover:bg-indigo-200 dark:hover:bg-indigo-900/50 transition"
            >
              {exportDate ? "Export Selected Day" : "Export Today"}
            </button>
            <button
              onClick={() => exportPosts("all")}
              className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition"
            >
              Export All
            </button>
          </div>
        </div>
      )}

      {/* Not joined */}
      {status === "none" && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8 text-center space-y-4"
        >
          <div className="text-5xl">👥</div>
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
            Join the Daily Work Board
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Post your daily standup update each working day. See what your
            teammates are working on. Get notified when someone posts.
          </p>
          <ul className="text-left text-sm text-slate-500 dark:text-slate-400 max-w-xs mx-auto space-y-1">
            {[
              "One post per day",
              "Edit within 30 minutes",
              "9:30 AM reminder",
              "Real-time updates",
            ].map((t) => (
              <li key={t} className="flex items-center gap-2">
                <span className="text-indigo-500">•</span>
                {t}
              </li>
            ))}
          </ul>
          <button
            onClick={join}
            disabled={joining}
            className="btn-primary px-8 py-2.5 rounded-xl font-semibold disabled:opacity-60 flex items-center gap-2 mx-auto"
          >
            {joining && (
              <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            )}
            {joining ? "Sending…" : "Request to Join"}
          </button>
        </motion.div>
      )}

      {/* Pending approval */}
      {status === "pending" && (
        <div className="glass-card p-8 text-center space-y-3">
          <div className="text-4xl">⏳</div>
          <h2 className="text-base font-semibold text-slate-700 dark:text-slate-200">
            Awaiting Admin Approval
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            You'll get a notification once approved.
          </p>
        </div>
      )}

      {/* Active board */}
      {status === "active" && activeTab === "today" && (
        <>
          {/* Posts feed */}
          {historyLoading ? (
            <div className="glass-card p-8 text-center">
              <div className="inline-block w-6 h-6 border-3 border-slate-300 dark:border-slate-600 border-t-indigo-600 dark:border-t-indigo-400 rounded-full animate-spin" />
            </div>
          ) : (
            <div className="glass-card divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden">
              {todayPosts.length === 0 && (
                <div className="p-8 text-center text-slate-400 dark:text-slate-500 text-sm">
                  No posts today yet. Be the first! 👋
                </div>
              )}
              <AnimatePresence initial={false}>
                {todayPosts.map((post) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <UserAvatar
                          name={post.userName}
                          avatar={post.userAvatar}
                        />
                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                          {post.userName}
                        </span>
                        {post.userId === user?.id && (
                          <span className="text-xs text-indigo-400">(you)</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400">
                          {timeAgo(post.postedAt)}
                        </span>
                        {activeTab === "today" &&
                          post.userId === user?.id &&
                          canStillEdit(post.postedAt) && (
                            <button
                              onClick={() => startEdit(post)}
                              className="text-xs text-indigo-400 hover:text-indigo-500 transition underline"
                            >
                              edit
                            </button>
                          )}
                      </div>
                    </div>
                    {editId === post.id ? (
                      <div className="flex gap-2 mt-2">
                        <input
                          value={editMsg}
                          onChange={(e) => setEditMsg(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && saveEdit()}
                          className="flex-1 input-light text-sm px-3 py-1.5 rounded-lg"
                          autoFocus
                        />
                        <button
                          onClick={saveEdit}
                          disabled={editSaving}
                          className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold disabled:opacity-50"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditId(null)}
                          className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 text-xs"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <p className="text-sm text-slate-600 dark:text-slate-300 ml-9 leading-relaxed">
                        {post.message}
                      </p>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
              <div ref={bottomRef} />
            </div>
          )}

          {/* Post input */}
          {!myTodayPost && activeTab === "today" && !historyLoading ? (
            <div className="glass-card p-4">
              <div className="flex gap-2">
                <UserAvatar
                  name={user?.name}
                  avatar={profile?.avatar_url}
                  size="w-8 h-8"
                  textSize="text-sm"
                />
                <div className="flex-1 flex gap-2">
                  <div className="relative flex-1">
                    <input
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={(e) =>
                        e.key === "Enter" && !e.shiftKey && submitPost()
                      }
                      placeholder="What are you working on today?"
                      className="w-full input-light text-sm px-3 py-2 pr-8 rounded-xl"
                      maxLength={500}
                    />
                    {message && (
                      <button
                        onClick={() => setMessage("")}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors text-sm"
                        tabIndex={-1}
                      >
                        ✕
                      </button>
                    )}
                  </div>
                  <button
                    onClick={submitPost}
                    disabled={posting || !message.trim()}
                    className="btn-primary px-4 py-2 rounded-xl text-sm font-semibold disabled:opacity-50"
                  >
                    {posting ? "…" : "Post"}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-xs text-slate-400 dark:text-slate-500 py-1">
              ✓ You've posted today
              {myTodayPost && canStillEdit(myTodayPost.postedAt) && (
                <span className="ml-1">· edit window open</span>
              )}
            </div>
          )}

          {/* Who hasn't posted */}
          {missing.length > 0 && (
            <div className="glass-card p-4 space-y-2">
              <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Hasn't posted today ({missing.length})
              </p>
              <div className="flex flex-wrap gap-2">
                {missing.map((m) => (
                  <span
                    key={m.userId}
                    className="text-xs px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                  >
                    {m.userName}
                  </span>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* History view */}
      {status === "active" &&
        activeTab === "history" &&
        selectedHistoryDate && (
          <>
            {/* Date header */}
            <div className="glass-card p-4 bg-gradient-to-r from-indigo-50 to-indigo-100/50 dark:from-indigo-900/20 dark:to-indigo-800/20 border border-indigo-200 dark:border-indigo-700/40">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-indigo-700 dark:text-indigo-300">
                  📜{" "}
                  {new Date(selectedHistoryDate).toLocaleDateString("en-IN", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </h2>
                <button
                  onClick={() => setActiveTab("today")}
                  className="px-3 py-1 rounded-lg bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                >
                  Back to Today
                </button>
              </div>
            </div>

            {/* Posts for selected date */}
            <div className="glass-card divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden">
              {historyLoading ? (
                <div className="glass-card divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="p-4 animate-pulse">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {/* Avatar */}
                          <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-700" />

                          <div className="space-y-2">
                            {/* Name */}
                            <div className="h-3 w-28 rounded bg-slate-200 dark:bg-slate-700" />
                            {/* Message line 1 */}
                            <div className="h-3 w-56 rounded bg-slate-200 dark:bg-slate-700" />
                            {/* Message line 2 */}
                            <div className="h-3 w-40 rounded bg-slate-200 dark:bg-slate-700" />
                          </div>
                        </div>

                        {/* Time */}
                        <div className="h-3 w-12 rounded bg-slate-200 dark:bg-slate-700" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : historyPosts.length === 0 ? (
                <div className="p-8 text-center text-slate-400 dark:text-slate-500 text-sm">
                  No posts on this day
                </div>
              ) : (
                <AnimatePresence initial={false}>
                  {historyPosts.map((post) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <UserAvatar
                            name={post.userName}
                            avatar={post.userAvatar}
                          />
                          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                            {post.userName}
                          </span>
                          {post.userId === user?.id && (
                            <span className="text-xs text-indigo-400">
                              (you)
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-slate-400">
                          {timeAgo(post.postedAt)}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-300 ml-9 leading-relaxed">
                        {post.message}
                      </p>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>
          </>
        )}
    </div>
  );
}
