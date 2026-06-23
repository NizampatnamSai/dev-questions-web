import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api/axios";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const _apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000/api";
const WS_BASE = _apiUrl.replace(/^http:/, "ws:").replace(/^https:/, "wss:").replace(/\/api$/, "");

function timeAgo(iso) {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  return `${Math.floor(diff / 3600)}h ago`;
}

function canStillEdit(postedAt) {
  return (Date.now() - new Date(postedAt).getTime()) < 30 * 60 * 1000;
}

export default function WorkBoard() {
  const { user } = useAuth();
  const [status, setStatus]       = useState(null); // "none"|"pending"|"active"
  const [posts, setPosts]         = useState([]);
  const [missing, setMissing]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [message, setMessage]     = useState("");
  const [posting, setPosting]     = useState(false);
  const [editId, setEditId]       = useState(null);
  const [editMsg, setEditMsg]     = useState("");
  const [editSaving, setEditSaving] = useState(false);
  const [pendingMembers, setPending] = useState([]);
  const [exportDate, setExportDate] = useState("");
  const wsRef = useRef(null);
  const bottomRef = useRef(null);

  const myPost = posts.find(p => p.userId === user?.id);

  useEffect(() => {
    loadStatus();
    return () => wsRef.current?.close();
  }, []);

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

  const loadBoard = async () => {
    const [postsRes, missingRes] = await Promise.all([
      api.get("/workboard/posts"),
      api.get("/workboard/missing-today"),
    ]);
    setPosts(postsRes.data);
    setMissing(missingRes.data);
  };

  const connectWS = () => {
    const token = localStorage.getItem("devquiz_token");
    const ws = new WebSocket(`${WS_BASE}/api/workboard/ws`);
    ws.onmessage = (e) => {
      try {
        const { type, post } = JSON.parse(e.data);
        if (type === "new_post") {
          setPosts(prev => {
            if (prev.find(p => p.id === post.id)) return prev;
            return [...prev, post];
          });
          setMissing(prev => prev.filter(m => m.userId !== post.userId));
        }
        if (type === "edit_post") {
          setPosts(prev => prev.map(p => p.id === post.id ? { ...p, message: post.message } : p));
        }
      } catch {}
    };
    ws.onclose = () => setTimeout(connectWS, 3000);
    wsRef.current = ws;
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [posts]);

  const join = async () => {
    try {
      await api.post("/workboard/join");
      toast.success("Join request sent! Waiting for admin approval.");
      setStatus("pending");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Error");
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
      .then(r => r.blob())
      .then(blob => {
        const objUrl = URL.createObjectURL(blob);
        a.href = objUrl;
        a.click();
        URL.revokeObjectURL(objUrl);
      })
      .catch(() => toast.error("Export failed"));
  };

  const approveMember = async (uid) => {
    await api.patch(`/workboard/members/${uid}/approve`);
    setPending(prev => prev.filter(m => m.userId !== uid));
    toast.success("Approved!");
  };

  const rejectMember = async (uid) => {
    await api.patch(`/workboard/members/${uid}/reject`);
    setPending(prev => prev.filter(m => m.userId !== uid));
  };

  if (loading) return (
    <div className="space-y-3 max-w-2xl">
      {[1,2,3].map(i => <div key={i} className="glass-card p-5 animate-pulse h-16" />)}
    </div>
  );

  const isAdmin = user?.role === "admin" || user?.role === "sub_admin";

  return (
    <div className="max-w-2xl space-y-5">
      {/* Header */}
      <div className="glass-card p-5">
        <div className="flex items-center gap-3">
          <div className="text-3xl">📋</div>
          <div>
            <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">Daily Work Board</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Mon–Sat standups · 9:30 AM reminder · 30-min edit window</p>
          </div>
        </div>
      </div>

      {/* Admin: pending join requests */}
      {isAdmin && pendingMembers.length > 0 && (
        <div className="glass-card p-4 space-y-2 border border-amber-200 dark:border-amber-700/40">
          <p className="text-xs font-bold text-amber-600 uppercase tracking-wider">Pending Join Requests ({pendingMembers.length})</p>
          {pendingMembers.map(m => (
            <div key={m.id || m.userId} className="flex items-center justify-between text-sm">
              <span className="text-slate-700 dark:text-slate-300">{m.userName} <span className="text-slate-400 text-xs">{m.userEmail}</span></span>
              <div className="flex gap-2">
                <button onClick={() => approveMember(m.userId)} className="px-3 py-1 rounded-lg bg-green-500 hover:bg-green-600 text-white text-xs font-semibold">✓ Approve</button>
                <button onClick={() => rejectMember(m.userId)} className="px-3 py-1 rounded-lg bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 text-xs font-semibold">✕ Reject</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Admin export */}
      {isAdmin && (
        <div className="glass-card p-4 space-y-3 border border-indigo-200 dark:border-indigo-700/40">
          <p className="text-xs font-bold text-indigo-500 uppercase tracking-wider">📤 Export Posts (CSV)</p>
          <div className="flex flex-wrap gap-2 items-center">
            <input
              type="date"
              value={exportDate}
              onChange={e => setExportDate(e.target.value)}
              className="input-light text-sm px-3 py-1.5 rounded-lg"
            />
            <button onClick={() => exportPosts("date")} className="px-3 py-1.5 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-semibold hover:bg-indigo-200 dark:hover:bg-indigo-900/50 transition">
              {exportDate ? "Export Selected Day" : "Export Today"}
            </button>
            <button onClick={() => exportPosts("all")} className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition">
              Export All
            </button>
          </div>
        </div>
      )}

      {/* Not joined */}
      {status === "none" && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-8 text-center space-y-4">
          <div className="text-5xl">👥</div>
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Join the Daily Work Board</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Post your daily standup update each working day. See what your teammates are working on. Get notified when someone posts.
          </p>
          <ul className="text-left text-sm text-slate-500 dark:text-slate-400 max-w-xs mx-auto space-y-1">
            {["One post per day", "Edit within 30 minutes", "9:30 AM reminder", "Real-time updates"].map(t => (
              <li key={t} className="flex items-center gap-2"><span className="text-indigo-500">•</span>{t}</li>
            ))}
          </ul>
          <button onClick={join} className="btn-primary px-8 py-2.5 rounded-xl font-semibold">
            Request to Join
          </button>
        </motion.div>
      )}

      {/* Pending approval */}
      {status === "pending" && (
        <div className="glass-card p-8 text-center space-y-3">
          <div className="text-4xl">⏳</div>
          <h2 className="text-base font-semibold text-slate-700 dark:text-slate-200">Awaiting Admin Approval</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">You'll get a notification once approved.</p>
        </div>
      )}

      {/* Active board */}
      {status === "active" && (
        <>
          {/* Posts feed */}
          <div className="glass-card divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden">
            {posts.length === 0 && (
              <div className="p-8 text-center text-slate-400 dark:text-slate-500 text-sm">
                No posts today yet. Be the first! 👋
              </div>
            )}
            <AnimatePresence initial={false}>
              {posts.map(post => (
                <motion.div key={post.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="p-4 space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-xs font-bold text-indigo-600 dark:text-indigo-300">
                        {post.userName?.[0]?.toUpperCase() || "?"}
                      </div>
                      <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{post.userName}</span>
                      {post.userId === user?.id && <span className="text-xs text-indigo-400">(you)</span>}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400">{timeAgo(post.postedAt)}</span>
                      {post.userId === user?.id && canStillEdit(post.postedAt) && (
                        <button onClick={() => startEdit(post)} className="text-xs text-indigo-400 hover:text-indigo-500 transition underline">edit</button>
                      )}
                    </div>
                  </div>
                  {editId === post.id ? (
                    <div className="flex gap-2 mt-2">
                      <input
                        value={editMsg}
                        onChange={e => setEditMsg(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && saveEdit()}
                        className="flex-1 input-light text-sm px-3 py-1.5 rounded-lg"
                        autoFocus
                      />
                      <button onClick={saveEdit} disabled={editSaving} className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold disabled:opacity-50">Save</button>
                      <button onClick={() => setEditId(null)} className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 text-xs">Cancel</button>
                    </div>
                  ) : (
                    <p className="text-sm text-slate-600 dark:text-slate-300 ml-9 leading-relaxed">{post.message}</p>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
            <div ref={bottomRef} />
          </div>

          {/* Post input */}
          {!myPost ? (
            <div className="glass-card p-4">
              <div className="flex gap-2">
                <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-sm font-bold text-indigo-600 dark:text-indigo-300 flex-shrink-0">
                  {user?.name?.[0]?.toUpperCase() || "?"}
                </div>
                <div className="flex-1 flex gap-2">
                  <input
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && !e.shiftKey && submitPost()}
                    placeholder="What are you working on today?"
                    className="flex-1 input-light text-sm px-3 py-2 rounded-xl"
                    maxLength={500}
                  />
                  <button onClick={submitPost} disabled={posting || !message.trim()} className="btn-primary px-4 py-2 rounded-xl text-sm font-semibold disabled:opacity-50">
                    {posting ? "…" : "Post"}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-xs text-slate-400 dark:text-slate-500 py-1">
              ✓ You've posted today
              {canStillEdit(myPost.postedAt) && <span className="ml-1">· edit window open</span>}
            </div>
          )}

          {/* Who hasn't posted */}
          {missing.length > 0 && (
            <div className="glass-card p-4 space-y-2">
              <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Hasn't posted today ({missing.length})</p>
              <div className="flex flex-wrap gap-2">
                {missing.map(m => (
                  <span key={m.userId} className="text-xs px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                    {m.userName}
                  </span>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
