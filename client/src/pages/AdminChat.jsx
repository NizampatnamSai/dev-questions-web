import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import RichTextEditor, { isRichTextEmpty } from "../components/RichTextEditor";
import RichTextView from "../components/RichTextView";

const _apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000/api";
const WS_BASE = _apiUrl
  .replace(/^http:/, "ws:")
  .replace(/^https:/, "wss:")
  .replace(/\/api$/, "");

function Avatar({ name, avatar, size = "w-9 h-9" }) {
  if (avatar) {
    return <img src={avatar} alt={name} className={`${size} rounded-full object-cover flex-shrink-0`} />;
  }
  return (
    <div className={`${size} rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
      {name?.[0]?.toUpperCase() || "?"}
    </div>
  );
}

export default function AdminChat() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin" || user?.role === "sub_admin";

  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeChatId, setActiveChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [composerHtml, setComposerHtml] = useState("");
  const [sending, setSending] = useState(false);
  const [pendingImageUrl, setPendingImageUrl] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [blurOn, setBlurOn] = useState(() => localStorage.getItem("devquiz_chat_blur") === "true");
  const [showUserPicker, setShowUserPicker] = useState(false);
  const [pickerUsers, setPickerUsers] = useState([]);
  const [pickerSearch, setPickerSearch] = useState("");
  const wsRef = useRef(null);
  const bottomRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("devquiz_chat_blur", String(blurOn));
  }, [blurOn]);

  const loadConversations = async () => {
    try {
      const { data } = await api.get("/admin-chat/conversations");
      setConversations(data);
    } catch {
      toast.error("Failed to load conversations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConversations();
    connectWS();
    return () => wsRef.current?.close();
  }, []);

  const connectWS = () => {
    const token = encodeURIComponent(localStorage.getItem("devquiz_token") || "");
    const ws = new WebSocket(`${WS_BASE}/api/admin-chat/ws?token=${token}`);
    ws.onmessage = (e) => {
      try {
        const msg = JSON.parse(e.data);
        if (msg.type === "new_message") {
          setActiveChatId((currentActiveId) => {
            if (msg.chatId === currentActiveId) {
              setMessages((prev) =>
                prev.some((m) => m.id === msg.message.id) ? prev : [...prev, msg.message],
              );
            }
            return currentActiveId;
          });
          loadConversations();
        }
      } catch {}
    };
    ws.onclose = () => setTimeout(connectWS, 3000);
    wsRef.current = ws;
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const openChat = async (chatId) => {
    setActiveChatId(chatId);
    setMessages([]);
    try {
      const { data } = await api.get(`/admin-chat/${chatId}/messages`);
      setMessages(data);
      loadConversations(); // refresh unread counts now that we've read them
    } catch {
      toast.error("Failed to load messages");
    }
  };

  const openUserPicker = async () => {
    try {
      const { data } = await api.get("/admin-chat/users");
      setPickerUsers(data);
      setShowUserPicker(true);
    } catch {
      toast.error("Failed to load users");
    }
  };

  const startChat = async (targetUserId) => {
    try {
      const { data } = await api.post("/admin-chat/start", { userId: targetUserId });
      setShowUserPicker(false);
      setPickerSearch("");
      await loadConversations();
      openChat(data.id);
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to start chat");
    }
  };

  const pickImage = async (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) { toast.error("Please select an image file"); return; }
    if (file.size > 5 * 1024 * 1024) { toast.error("Image must be under 5MB"); return; }
    setUploadingImage(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const { data } = await api.post("/uploads/image", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setPendingImageUrl(data.url);
    } catch {
      toast.error("Failed to upload image");
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const send = async () => {
    if (isRichTextEmpty(composerHtml) && !pendingImageUrl) return;
    setSending(true);
    try {
      const { data } = await api.post(`/admin-chat/${activeChatId}/messages`, {
        html: composerHtml,
        imageUrl: pendingImageUrl,
      });
      setMessages((prev) => [...prev, data]);
      setComposerHtml("");
      setPendingImageUrl(null);
      loadConversations();
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to send");
    } finally {
      setSending(false);
    }
  };

  const activeChat = conversations.find((c) => c.id === activeChatId);
  const filteredPickerUsers = pickerUsers.filter(
    (u) => `${u.name} ${u.email}`.toLowerCase().includes(pickerSearch.toLowerCase()),
  );

  if (loading) {
    return <div className="text-center py-20 text-slate-400">Loading…</div>;
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-4">
      {/* Conversation list */}
      <div className="w-full sm:w-72 flex-shrink-0 glass-card p-0 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-black/5 dark:border-white/10 flex items-center justify-between flex-shrink-0">
          <div>
            <h1 className="font-bold text-slate-800 dark:text-slate-100">💬 Messages</h1>
            <p className="text-[11px] text-slate-400">
              {isAdmin ? "Only you can start new chats" : "An admin will message you here"}
            </p>
          </div>
          {isAdmin && (
            <button
              onClick={openUserPicker}
              className="w-8 h-8 flex-shrink-0 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center transition-colors"
              title="Start a new chat"
            >
              +
            </button>
          )}
        </div>
        <div className={`flex-1 overflow-y-auto ${activeChatId ? "hidden sm:block" : ""}`}>
          {conversations.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-10 px-4">
              {isAdmin ? "No conversations yet — tap + to message a user." : "No messages yet."}
            </p>
          ) : (
            conversations.map((c) => (
              <button
                key={c.id}
                onClick={() => openChat(c.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-white/5 transition-colors border-b border-black/5 dark:border-white/5 ${
                  activeChatId === c.id ? "bg-indigo-50 dark:bg-indigo-500/10" : ""
                }`}
              >
                <Avatar name={c.otherUserName} avatar={c.otherUserAvatar} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 truncate">{c.otherUserName}</p>
                    {c.unreadCount > 0 && (
                      <span className="text-[10px] bg-indigo-600 text-white rounded-full px-1.5 py-0.5 flex-shrink-0">{c.unreadCount}</span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 truncate">{c.lastMessagePreview || "…"}</p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Thread */}
      <div className={`flex-1 glass-card p-0 flex flex-col overflow-hidden ${!activeChatId ? "hidden sm:flex" : ""}`}>
        {!activeChatId ? (
          <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">
            Select a conversation
          </div>
        ) : (
          <>
            <div className="p-3 border-b border-black/5 dark:border-white/10 flex items-center gap-3 flex-shrink-0">
              <button onClick={() => setActiveChatId(null)} className="sm:hidden text-slate-400">←</button>
              <Avatar name={activeChat?.otherUserName} avatar={activeChat?.otherUserAvatar} size="w-8 h-8" />
              <p className="font-semibold text-sm text-slate-700 dark:text-slate-200 flex-1">{activeChat?.otherUserName}</p>
              <button
                onClick={() => setBlurOn((v) => !v)}
                title="Blur message content for privacy — hover a bubble to reveal"
                className={`text-xs px-2.5 py-1 rounded-full font-semibold transition-colors ${
                  blurOn ? "bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300" : "bg-slate-100 dark:bg-white/10 text-slate-400"
                }`}
              >
                {blurOn ? "🙈 Blur: On" : "👁 Blur: Off"}
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((m) => {
                const mine = m.senderId === user?.id;
                return (
                  <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`group max-w-[75%] rounded-2xl px-3.5 py-2.5 text-sm ${
                        mine ? "bg-indigo-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200"
                      } ${blurOn ? "blur-sm hover:blur-none transition-[filter]" : ""}`}
                    >
                      {m.imageUrl && (
                        <img src={m.imageUrl} alt="attachment" className="rounded-lg max-w-full mb-1.5" />
                      )}
                      {m.html && <RichTextView html={m.html} />}
                      <p className={`text-[10px] mt-1 ${mine ? "text-indigo-200" : "text-slate-400"}`}>
                        {new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>
                );
              })}
              <div ref={bottomRef} />
            </div>

            <div className="p-3 border-t border-black/5 dark:border-white/10 flex-shrink-0 space-y-2">
              {pendingImageUrl && (
                <div className="relative inline-block">
                  <img src={pendingImageUrl} alt="pending" className="h-16 rounded-lg border border-slate-200 dark:border-white/10" />
                  <button
                    onClick={() => setPendingImageUrl(null)}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-black/70 text-white text-xs flex items-center justify-center"
                  >
                    ✕
                  </button>
                </div>
              )}
              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <RichTextEditor value={composerHtml} onChange={setComposerHtml} placeholder="Type a message…" />
                </div>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => pickImage(e.target.files?.[0])} />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingImage}
                  title="Attach an image"
                  className="w-10 h-10 flex-shrink-0 rounded-full bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-400 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-white/15 transition-colors disabled:opacity-50"
                >
                  {uploadingImage ? <span className="w-4 h-4 border-2 border-current/40 border-t-current rounded-full animate-spin" /> : "📎"}
                </button>
                <button
                  onClick={send}
                  disabled={sending || (isRichTextEmpty(composerHtml) && !pendingImageUrl)}
                  className="w-10 h-10 flex-shrink-0 rounded-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white flex items-center justify-center transition-colors"
                >
                  {sending
                    ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    : <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7"/></svg>}
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* New chat — user picker (admin only) */}
      <AnimatePresence>
        {showUserPicker && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowUserPicker(false)}
              className="fixed inset-0 bg-black/50 z-40"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="glass-card w-full max-w-sm max-h-[70vh] flex flex-col p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="font-bold text-slate-800 dark:text-slate-100">Start a chat</h2>
                  <button onClick={() => setShowUserPicker(false)} className="text-slate-400 text-xl leading-none">✕</button>
                </div>
                <input
                  value={pickerSearch}
                  onChange={(e) => setPickerSearch(e.target.value)}
                  placeholder="Search users…"
                  autoFocus
                  className="input-light"
                />
                <div className="flex-1 overflow-y-auto -mx-4 px-4">
                  {filteredPickerUsers.map((u) => (
                    <button
                      key={u.id}
                      onClick={() => startChat(u.id)}
                      className="w-full flex items-center gap-3 py-2.5 hover:bg-slate-50 dark:hover:bg-white/5 rounded-lg px-2 transition-colors text-left"
                    >
                      <Avatar name={u.name} size="w-8 h-8" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">{u.name}</p>
                        <p className="text-xs text-slate-400 truncate">{u.email}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
