import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
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

const MAX_IMAGES_PER_MESSAGE = 6; // matches server/routers/admin_chat.py

function stripHtmlForSearch(html) {
  if (!html) return "";
  // A real (detached, never-rendered) element decodes entities correctly —
  // a regex can strip tags but not reliably handle &nbsp;/&amp;/etc.
  const el = document.createElement("div");
  el.innerHTML = html;
  return el.textContent || "";
}

// green = online now (or active in the last 5 min), yellow = away (up to an
// hour), red = offline beyond that or never seen. Computed server-side in
// _presence_status() (routers/admin_chat.py) — kept fresh here via WS
// "presence" events plus a light poll, not recomputed client-side.
const PRESENCE_COLOR = {
  online: "bg-emerald-500",
  away: "bg-amber-400",
  offline: "bg-slate-400 dark:bg-slate-500",
};

// Only rendered on your own sent messages (WhatsApp-style — you don't see
// ticks on messages from others). deliveredCount/readCount/totalRecipients
// come from the server (_recipient_status in routers/admin_chat.py); a DM's
// totalRecipients is always 1, a group's can be N.
function MessageStatus({ m, isGroup }) {
  if (m.totalRecipients == null || m.totalRecipients === 0) return null;
  if (isGroup) {
    const label = m.readCount > 0 ? `Seen ${m.readCount}/${m.totalRecipients}` : m.deliveredCount > 0 ? `Delivered ${m.deliveredCount}/${m.totalRecipients}` : "Sent";
    return <span className="text-[9px]">{label}</span>;
  }
  const seen = m.readCount >= m.totalRecipients;
  // Seen always implies delivered — you can't read something that never
  // arrived — so the glyph must never show a single tick once it's seen,
  // even if deliveredCount happens to be stale/behind readCount.
  const delivered = seen || m.deliveredCount >= m.totalRecipients;
  return (
    <span title={seen ? "Seen" : delivered ? "Delivered" : "Sent"} className={seen ? "text-sky-300" : ""}>
      {delivered ? "✓✓" : "✓"}
    </span>
  );
}

function GroupAvatar({ size = "w-9 h-9" }) {
  return (
    <div className={`${size} rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center text-white text-sm flex-shrink-0`}>
      👥
    </div>
  );
}

function Avatar({ name, avatar, size = "w-9 h-9", presence }) {
  const dot = presence && (
    <span
      title={presence === "online" ? "Online" : presence === "away" ? "Away" : "Offline"}
      className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-slate-900 ${PRESENCE_COLOR[presence] || PRESENCE_COLOR.offline}`}
    />
  );
  if (avatar) {
    return (
      <span className={`relative inline-block flex-shrink-0 ${size}`}>
        <img src={avatar} alt={name} className={`${size} rounded-full object-cover`} />
        {dot}
      </span>
    );
  }
  return (
    <span className={`relative inline-block flex-shrink-0 ${size}`}>
      <div className={`${size} rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold`}>
        {name?.[0]?.toUpperCase() || "?"}
      </div>
      {dot}
    </span>
  );
}

export default function AdminChat() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin" || user?.role === "sub_admin";
  const [searchParams, setSearchParams] = useSearchParams();

  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeChatId, setActiveChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [composerHtml, setComposerHtml] = useState("");
  const [sending, setSending] = useState(false);
  const [pendingImageUrls, setPendingImageUrls] = useState([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [blurOn, setBlurOn] = useState(() => localStorage.getItem("devquiz_chat_blur") === "true");
  const [showUserPicker, setShowUserPicker] = useState(false);
  const [pickerUsers, setPickerUsers] = useState([]);
  const [pickerSearch, setPickerSearch] = useState("");
  const [startingChatUserId, setStartingChatUserId] = useState(null);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [editingMessageId, setEditingMessageId] = useState(null); // id of the own message currently being edited, or null
  const [showGroupPicker, setShowGroupPicker] = useState(false);
  const [groupPickerUsers, setGroupPickerUsers] = useState([]);
  const [groupPickerSearch, setGroupPickerSearch] = useState("");
  const [selectedMemberIds, setSelectedMemberIds] = useState([]);
  const [groupNameInput, setGroupNameInput] = useState("");
  const [creatingGroup, setCreatingGroup] = useState(false);
  const [renamingGroup, setRenamingGroup] = useState(false);
  const [groupRenameInput, setGroupRenameInput] = useState("");
  const [savingGroupName, setSavingGroupName] = useState(false);
  const [highlightedMessageId, setHighlightedMessageId] = useState(null);
  const [chatSearchOpen, setChatSearchOpen] = useState(false);
  const [chatSearchQuery, setChatSearchQuery] = useState("");
  const [chatSearchActiveIndex, setChatSearchActiveIndex] = useState(0);
  const [showGlobalSearch, setShowGlobalSearch] = useState(false);
  const [globalSearchQuery, setGlobalSearchQuery] = useState("");
  const [globalSearchResults, setGlobalSearchResults] = useState([]);
  const [globalSearching, setGlobalSearching] = useState(false);
  const [isNearBottom, setIsNearBottom] = useState(true);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateJumpValue, setDateJumpValue] = useState("");
  const wsRef = useRef(null);
  const bottomRef = useRef(null);
  const fileInputRef = useRef(null);
  const activeChatIdRef = useRef(null);
  const messageRefs = useRef({});
  const messagesContainerRef = useRef(null);

  useEffect(() => { activeChatIdRef.current = activeChatId; }, [activeChatId]);

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

  // Silent catch-up fetch for the currently open chat — no spinner, doesn't
  // clear messages first, since this runs in the background rather than
  // from a user click. The WS is push-only with no replay, so anything sent
  // while it was disconnected never arrives on its own; on top of that, a
  // WebSocket with no ping/pong can sit at readyState OPEN for a while after
  // the underlying connection has actually died, so this is also triggered
  // by tab visibility, independent of what the WS thinks its state is.
  const refetchActiveChat = async () => {
    const chatId = activeChatIdRef.current;
    if (!chatId) return;
    try {
      const { data } = await api.get(`/admin-chat/${chatId}/messages`);
      setMessages(data);
    } catch {}
  };

  useEffect(() => {
    loadConversations();
    connectWS();
    return () => wsRef.current?.close();
  }, []);

  // Presence dots move purely with elapsed time (green -> yellow at 5 min,
  // yellow -> red at 1 hour) even with no new messages at all — a light
  // poll is what keeps them from going stale between WS "presence" events.
  useEffect(() => {
    const id = setInterval(loadConversations, 60000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handler = () => {
      if (document.visibilityState === "visible") {
        loadConversations();
        refetchActiveChat();
      }
    };
    document.addEventListener("visibilitychange", handler);
    return () => document.removeEventListener("visibilitychange", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const connectWS = () => {
    const token = encodeURIComponent(localStorage.getItem("devquiz_token") || "");
    const ws = new WebSocket(`${WS_BASE}/api/admin-chat/ws?token=${token}`);
    ws.onopen = () => {
      // Reconnects (network blip, backend restart, mobile OS resuming a
      // suspended tab) are exactly when messages could have been missed.
      loadConversations();
      refetchActiveChat();
    };
    ws.onmessage = (e) => {
      try {
        const msg = JSON.parse(e.data);
        if (msg.type === "new_message") {
          setActiveChatId((currentActiveId) => {
            if (msg.chatId === currentActiveId) {
              setMessages((prev) =>
                prev.some((m) => m.id === msg.message.id) ? prev : [...prev, msg.message],
              );
              // The chat is open right now — mark it read immediately instead
              // of waiting for the next full refetch, so the sender's ticks
              // update live rather than only once this tab reopens the chat.
              api.post(`/admin-chat/${msg.chatId}/read`).catch(() => {});
            }
            return currentActiveId;
          });
          loadConversations();
        } else if (msg.type === "read_receipt") {
          // Someone else just read (and by implication received) one or more
          // of our sent messages — refetch to get accurate delivered/read
          // counts from the server rather than trying to hand-increment
          // aggregate counts the client never separately tracked per-user.
          if (msg.chatId === activeChatIdRef.current) {
            refetchActiveChat();
          }
        } else if (msg.type === "edit_message") {
          setActiveChatId((currentActiveId) => {
            if (msg.chatId === currentActiveId) {
              setMessages((prev) => prev.map((m) => (m.id === msg.message.id ? msg.message : m)));
            }
            return currentActiveId;
          });
          loadConversations();
        } else if (msg.type === "rename_group") {
          setConversations((prev) => prev.map((c) => (c.id === msg.chatId ? { ...c, groupName: msg.name } : c)));
        } else if (msg.type === "pin_message") {
          setConversations((prev) =>
            prev.map((c) =>
              c.id === msg.chatId
                ? { ...c, pinnedMessageIds: [...(c.pinnedMessageIds || []), msg.messageId] }
                : c,
            ),
          );
        } else if (msg.type === "unpin_message") {
          setConversations((prev) =>
            prev.map((c) =>
              c.id === msg.chatId
                ? { ...c, pinnedMessageIds: (c.pinnedMessageIds || []).filter((id) => id !== msg.messageId) }
                : c,
            ),
          );
        } else if (msg.type === "presence") {
          if (msg.online) {
            // Flip the dot to green instantly — no round trip needed for "online".
            setConversations((prev) =>
              prev.map((c) => (c.otherUserId === msg.userId ? { ...c, otherUserPresence: "online" } : c)),
            );
          } else {
            // Just went offline — right after a disconnect the server still
            // computes "online" for a few minutes (grace window), so refetch
            // rather than guessing the exact away/offline color here.
            loadConversations();
          }
        }
      } catch {}
    };
    ws.onclose = () => setTimeout(connectWS, 3000);
    wsRef.current = ws;
  };

  useEffect(() => {
    // Only auto-scroll when the reader was already at the bottom — forcing
    // it on every new message yanked anyone reading older history straight
    // back down. block: "nearest" keeps this confined to the messages list's
    // own scroll container — without it, scrollIntoView() also nudges the
    // outer page scroll position, which is what caused the whole page to
    // shift up 10-25px every time a conversation was opened (same root
    // cause as the earlier DevQuiz Assistant chatbot page-shift bug).
    if (isNearBottom) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);

  const handleMessagesScroll = () => {
    const el = messagesContainerRef.current;
    if (!el) return;
    setIsNearBottom(el.scrollHeight - el.scrollTop - el.clientHeight < 80);
  };

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    setIsNearBottom(true);
  };

  const jumpToMessage = (id) => {
    const el = messageRefs.current[id];
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    setHighlightedMessageId(id);
    setTimeout(() => setHighlightedMessageId((cur) => (cur === id ? null : cur)), 1500);
  };

  const togglePin = async (messageId, isPinned) => {
    try {
      if (isPinned) {
        const { data } = await api.delete(`/admin-chat/${activeChatId}/messages/${messageId}/pin`);
        setConversations((prev) => prev.map((c) => (c.id === activeChatId ? { ...c, pinnedMessageIds: data.pinnedMessageIds } : c)));
      } else {
        const { data } = await api.post(`/admin-chat/${activeChatId}/messages/${messageId}/pin`);
        setConversations((prev) => prev.map((c) => (c.id === activeChatId ? { ...c, pinnedMessageIds: data.pinnedMessageIds } : c)));
      }
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to update pin");
    }
  };

  const openChat = async (chatId) => {
    setActiveChatId(chatId);
    setMessages([]);
    setEditingMessageId(null);
    setComposerHtml("");
    setPendingImageUrls([]);
    setRenamingGroup(false);
    setIsNearBottom(true);
    setChatSearchOpen(false);
    setChatSearchQuery("");
    setLoadingMessages(true);
    try {
      const { data } = await api.get(`/admin-chat/${chatId}/messages`);
      setMessages(data);
      loadConversations(); // refresh unread counts now that we've read them
    } catch {
      toast.error("Failed to load messages");
    } finally {
      setLoadingMessages(false);
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

  const openGroupPicker = async () => {
    try {
      // forGroup skips the "already DMing this admin" exclusion — you might
      // already have a DM with someone and still want them in a group too.
      const { data } = await api.get("/admin-chat/users", { params: { forGroup: true } });
      setGroupPickerUsers(data);
      setSelectedMemberIds([]);
      setGroupNameInput("");
      setGroupPickerSearch("");
      setShowGroupPicker(true);
    } catch {
      toast.error("Failed to load users");
    }
  };

  const toggleMember = (id) => {
    setSelectedMemberIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const createGroup = async () => {
    if (!selectedMemberIds.length) return toast.error("Pick at least one member");
    setCreatingGroup(true);
    try {
      const { data } = await api.post("/admin-chat/group", {
        name: groupNameInput.trim() || null,
        memberIds: selectedMemberIds,
      });
      setShowGroupPicker(false);
      await openChat(data.id); // already refreshes the conversation list itself
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to create group");
    } finally {
      setCreatingGroup(false);
    }
  };

  const startRenameGroup = () => {
    setGroupRenameInput(activeChat?.groupName || "");
    setRenamingGroup(true);
  };

  const saveGroupName = async () => {
    const name = groupRenameInput.trim();
    if (!name) return toast.error("Name cannot be empty");
    setSavingGroupName(true);
    try {
      await api.patch(`/admin-chat/group/${activeChatId}`, { name });
      // The backend broadcast excludes the sender — update our own view directly.
      setConversations((prev) => prev.map((c) => (c.id === activeChatId ? { ...c, groupName: name } : c)));
      setRenamingGroup(false);
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to rename group");
    } finally {
      setSavingGroupName(false);
    }
  };

  const startChat = async (targetUserId) => {
    setStartingChatUserId(targetUserId);
    try {
      const { data } = await api.post("/admin-chat/start", { userId: targetUserId });
      setShowUserPicker(false);
      setPickerSearch("");
      // openChat() already refreshes the conversation list itself after
      // loading messages — a separate loadConversations() call here was a
      // redundant extra round trip serialized before we could even start
      // opening the chat, adding to the 2-3s wait with zero visual feedback.
      await openChat(data.id);
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to start chat");
    } finally {
      setStartingChatUserId(null);
    }
  };

  // Deep-link support — e.g. a "Continue in Messages" button elsewhere (Admin
  // Feedback) links to /messages?userId=... ; /start is idempotent (returns
  // the existing chat if one's already there), so this is safe to call blind.
  useEffect(() => {
    const targetUserId = searchParams.get("userId");
    if (targetUserId && isAdmin) {
      startChat(targetUserId);
      setSearchParams({}, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, isAdmin]);

  const pickImages = async (fileList) => {
    const files = Array.from(fileList || []);
    if (!files.length) return;
    if (pendingImageUrls.length + files.length > MAX_IMAGES_PER_MESSAGE) {
      toast.error(`Up to ${MAX_IMAGES_PER_MESSAGE} images per message`);
      return;
    }
    for (const file of files) {
      if (!file.type.startsWith("image/")) { toast.error("Please select image files only"); return; }
      if (file.size > 5 * 1024 * 1024) { toast.error("Each image must be under 5MB"); return; }
    }
    setUploadingImage(true);
    try {
      const uploaded = await Promise.all(
        files.map(async (file) => {
          const form = new FormData();
          form.append("file", file);
          const { data } = await api.post("/uploads/image", form, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          return data.url;
        }),
      );
      setPendingImageUrls((prev) => [...prev, ...uploaded]);
    } catch {
      toast.error("Failed to upload image");
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removePendingImage = (idx) => {
    setPendingImageUrls((prev) => prev.filter((_, i) => i !== idx));
  };

  const startEdit = (m) => {
    setEditingMessageId(m.id);
    setComposerHtml(m.html || "");
    setPendingImageUrls(m.imageUrls || (m.imageUrl ? [m.imageUrl] : []));
  };

  const cancelEdit = () => {
    setEditingMessageId(null);
    setComposerHtml("");
    setPendingImageUrls([]);
  };

  const send = async () => {
    if (isRichTextEmpty(composerHtml) && pendingImageUrls.length === 0) return;
    setSending(true);
    try {
      if (editingMessageId) {
        const { data } = await api.patch(`/admin-chat/${activeChatId}/messages/${editingMessageId}`, {
          html: composerHtml,
          imageUrls: pendingImageUrls,
        });
        setMessages((prev) => prev.map((m) => (m.id === data.id ? data : m)));
        setEditingMessageId(null);
        setComposerHtml("");
        setPendingImageUrls([]);
        loadConversations();
      } else {
        const { data } = await api.post(`/admin-chat/${activeChatId}/messages`, {
          html: composerHtml,
          imageUrls: pendingImageUrls,
        });
        setMessages((prev) => [...prev, data]);
        setComposerHtml("");
        setPendingImageUrls([]);
        setIsNearBottom(true); // always snap to your own just-sent message
        loadConversations();
      }
    } catch (err) {
      toast.error(err.response?.data?.detail || (editingMessageId ? "Failed to save edit" : "Failed to send"));
    } finally {
      setSending(false);
    }
  };

  const activeChat = conversations.find((c) => c.id === activeChatId);
  const filteredPickerUsers = pickerUsers.filter(
    (u) => `${u.name} ${u.email}`.toLowerCase().includes(pickerSearch.toLowerCase()),
  );

  // In-chat search — the active chat's messages are already fully loaded
  // client-side (get_messages loads up to 500 in one shot), so this is a
  // pure filter, no extra request needed.
  const chatSearchMatches = chatSearchQuery.trim()
    ? messages.filter((m) => stripHtmlForSearch(m.html).toLowerCase().includes(chatSearchQuery.trim().toLowerCase()))
    : [];

  const gotoSearchMatch = (dir) => {
    if (!chatSearchMatches.length) return;
    const next = (chatSearchActiveIndex + dir + chatSearchMatches.length) % chatSearchMatches.length;
    setChatSearchActiveIndex(next);
    jumpToMessage(chatSearchMatches[next].id);
  };

  useEffect(() => {
    if (chatSearchMatches.length) {
      setChatSearchActiveIndex(0);
      jumpToMessage(chatSearchMatches[0].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatSearchQuery]);

  // Global search — debounced against the backend, which scopes results to
  // only the caller's own chats (server/routers/admin_chat.py's /search).
  useEffect(() => {
    if (!showGlobalSearch) return;
    if (!globalSearchQuery.trim()) {
      setGlobalSearchResults([]);
      return;
    }
    setGlobalSearching(true);
    const t = setTimeout(async () => {
      try {
        const { data } = await api.get("/admin-chat/search", { params: { q: globalSearchQuery.trim() } });
        setGlobalSearchResults(data);
      } catch {
        toast.error("Search failed");
      } finally {
        setGlobalSearching(false);
      }
    }, 300);
    return () => clearTimeout(t);
  }, [globalSearchQuery, showGlobalSearch]);

  const openSearchResult = async (result) => {
    setShowGlobalSearch(false);
    setGlobalSearchQuery("");
    setGlobalSearchResults([]);
    await openChat(result.chatId);
    // Refs for the newly-loaded messages attach on the next render — a
    // short delay is the pragmatic way to wait for that commit before
    // scrolling, same idea as elsewhere in this app's WS reconnect flow.
    setTimeout(() => jumpToMessage(result.messageId), 300);
  };

  const jumpToDate = () => {
    if (!dateJumpValue) return;
    const target = messages.find((m) => {
      const d = new Date(m.createdAt).toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" }); // YYYY-MM-DD, IST
      return d === dateJumpValue;
    });
    if (!target) {
      toast.error("No messages on that date");
      return;
    }
    setShowDatePicker(false);
    jumpToMessage(target.id);
  };

  if (loading) {
    return <div className="text-center py-20 text-slate-400">Loading…</div>;
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-4">
      {/* Conversation list — on mobile this whole panel (not just the inner
          list) must hide once a chat is open, otherwise its header keeps
          claiming full width as a flex sibling and squeezes the Thread panel
          down to nothing even though the Thread's own wrapper is visible. */}
      <div className={`w-full sm:w-72 flex-shrink-0 glass-card p-0 flex-col overflow-hidden ${activeChatId ? "hidden sm:flex" : "flex"}`}>
        <div className="p-4 border-b border-black/5 dark:border-white/10 flex items-center justify-between flex-shrink-0">
          <div>
            <h1 className="font-bold text-slate-800 dark:text-slate-100">💬 Messages</h1>
            <p className="text-[11px] text-slate-400">
              {isAdmin ? "Only you can start new chats" : "An admin will message you here"}
            </p>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button
              onClick={() => setShowGlobalSearch(true)}
              className="w-8 h-8 flex-shrink-0 rounded-lg bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/15 text-slate-600 dark:text-slate-300 flex items-center justify-center transition-colors text-sm"
              title="Search all messages"
            >
              🔍
            </button>
            {isAdmin && (
              <>
                <button
                  onClick={openGroupPicker}
                  className="w-8 h-8 flex-shrink-0 rounded-lg bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/15 text-slate-600 dark:text-slate-300 flex items-center justify-center transition-colors text-sm"
                  title="Create a group"
                >
                  👥
                </button>
                <button
                  onClick={openUserPicker}
                  className="w-8 h-8 flex-shrink-0 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center transition-colors"
                  title="Start a new chat"
                >
                  +
                </button>
              </>
            )}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
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
                {c.type === "group" ? <GroupAvatar /> : <Avatar name={c.otherUserName} avatar={c.otherUserAvatar} presence={c.otherUserPresence} />}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 truncate">{c.type === "group" ? c.groupName : c.otherUserName}</p>
                    {c.unreadCount > 0 && (
                      <span className="text-[10px] bg-indigo-600 text-white rounded-full px-1.5 py-0.5 flex-shrink-0">{c.unreadCount}</span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 truncate">
                    {c.type === "group" && <span>{c.onlineCount}/{c.participantCount} online · </span>}
                    {c.lastMessagePreview || "…"}
                  </p>
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
              {activeChat?.type === "group" ? (
                <GroupAvatar size="w-8 h-8" />
              ) : (
                <Avatar name={activeChat?.otherUserName} avatar={activeChat?.otherUserAvatar} presence={activeChat?.otherUserPresence} size="w-8 h-8" />
              )}
              <div className="flex-1 min-w-0">
                {renamingGroup ? (
                  <div className="flex items-center gap-1.5">
                    <input
                      value={groupRenameInput}
                      onChange={(e) => setGroupRenameInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && saveGroupName()}
                      autoFocus
                      className="flex-1 text-sm px-2 py-1 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button onClick={saveGroupName} disabled={savingGroupName} className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold flex-shrink-0">
                      {savingGroupName ? "…" : "Save"}
                    </button>
                    <button onClick={() => setRenamingGroup(false)} className="text-xs text-slate-400 flex-shrink-0">
                      Cancel
                    </button>
                  </div>
                ) : (
                  <>
                    <p className="font-semibold text-sm text-slate-700 dark:text-slate-200 truncate">
                      {activeChat?.type === "group" ? activeChat.groupName : activeChat?.otherUserName}
                    </p>
                    {activeChat?.type === "group" ? (
                      <p className="text-[10px] text-slate-400">
                        {activeChat.participantCount} members · {activeChat.onlineCount} online
                      </p>
                    ) : (
                      activeChat?.otherUserPresence && (
                        <p className="text-[10px] text-slate-400">
                          {activeChat.otherUserPresence === "online" ? "Online" : activeChat.otherUserPresence === "away" ? "Away" : "Offline"}
                        </p>
                      )
                    )}
                  </>
                )}
              </div>
              {isAdmin && activeChat?.type === "group" && !renamingGroup && (
                <button onClick={startRenameGroup} title="Rename group" className="text-slate-400 hover:text-indigo-500 transition-colors flex-shrink-0">
                  ✏️
                </button>
              )}
              <button
                onClick={() => { setChatSearchOpen((v) => !v); setChatSearchQuery(""); }}
                title="Search this conversation"
                className={`text-sm flex-shrink-0 transition-colors ${chatSearchOpen ? "text-indigo-500" : "text-slate-400 hover:text-indigo-500"}`}
              >
                🔍
              </button>
              <button
                onClick={() => { setShowDatePicker((v) => !v); setDateJumpValue(""); }}
                title="Jump to a date"
                className={`text-sm flex-shrink-0 transition-colors ${showDatePicker ? "text-indigo-500" : "text-slate-400 hover:text-indigo-500"}`}
              >
                📅
              </button>
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

            {chatSearchOpen && (
              <div className="px-3 py-2 border-b border-black/5 dark:border-white/10 flex items-center gap-2 flex-shrink-0">
                <input
                  value={chatSearchQuery}
                  onChange={(e) => setChatSearchQuery(e.target.value)}
                  placeholder="Search this conversation…"
                  autoFocus
                  className="flex-1 text-sm px-3 py-1.5 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 outline-none focus:ring-2 focus:ring-indigo-500"
                />
                {chatSearchQuery.trim() && (
                  <span className="text-xs text-slate-400 flex-shrink-0">
                    {chatSearchMatches.length ? `${chatSearchActiveIndex + 1} of ${chatSearchMatches.length}` : "No matches"}
                  </span>
                )}
                <button onClick={() => gotoSearchMatch(-1)} disabled={!chatSearchMatches.length} className="text-slate-400 hover:text-indigo-500 disabled:opacity-30 flex-shrink-0">
                  ↑
                </button>
                <button onClick={() => gotoSearchMatch(1)} disabled={!chatSearchMatches.length} className="text-slate-400 hover:text-indigo-500 disabled:opacity-30 flex-shrink-0">
                  ↓
                </button>
                <button onClick={() => setChatSearchOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex-shrink-0">
                  ✕
                </button>
              </div>
            )}

            {showDatePicker && (
              <div className="px-3 py-2 border-b border-black/5 dark:border-white/10 flex items-center gap-2 flex-shrink-0">
                <input
                  type="date"
                  value={dateJumpValue}
                  onChange={(e) => setDateJumpValue(e.target.value)}
                  autoFocus
                  className="flex-1 text-sm px-3 py-1.5 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  onClick={jumpToDate}
                  disabled={!dateJumpValue}
                  className="text-xs px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold flex-shrink-0"
                >
                  Jump
                </button>
                <button onClick={() => setShowDatePicker(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex-shrink-0">
                  ✕
                </button>
              </div>
            )}

            {activeChat?.pinnedMessageIds?.length > 0 && (
              <div className="px-3 py-1.5 border-b border-black/5 dark:border-white/10 flex-shrink-0 space-y-1">
                {activeChat.pinnedMessageIds.map((pid) => {
                  const pm = messages.find((m) => m.id === pid);
                  return (
                    <button
                      key={pid}
                      onClick={() => jumpToMessage(pid)}
                      className="w-full flex items-center gap-1.5 text-left text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 rounded-lg px-2 py-1 hover:bg-amber-100 dark:hover:bg-amber-500/20 transition-colors"
                    >
                      <span className="flex-shrink-0">📌</span>
                      <span className="truncate">{pm ? stripHtmlForSearch(pm.html).slice(0, 80) || "📷 Image" : "Pinned message"}</span>
                    </button>
                  );
                })}
              </div>
            )}

            <div className="relative flex-1 min-h-0">
              <div ref={messagesContainerRef} onScroll={handleMessagesScroll} className="h-full overflow-y-auto p-4 space-y-3">
                {loadingMessages ? (
                  <div className="flex-1 h-full flex items-center justify-center text-slate-400 gap-2 text-sm">
                    <span className="w-4 h-4 border-2 border-slate-300 dark:border-slate-600 border-t-indigo-500 rounded-full animate-spin" />
                    Loading messages…
                  </div>
                ) : (
                  messages.map((m) => {
                    const mine = m.senderId === user?.id;
                    const isGroup = activeChat?.type === "group";
                    const images = m.imageUrls || (m.imageUrl ? [m.imageUrl] : []);
                    const isPinned = activeChat?.pinnedMessageIds?.includes(m.id);
                    return (
                      <div
                        key={m.id}
                        ref={(el) => { if (el) messageRefs.current[m.id] = el; }}
                        className={`group flex items-start gap-1.5 ${mine ? "justify-end" : "justify-start"}`}
                      >
                        <div className="max-w-[75%] flex flex-col">
                          {/* Disambiguates who sent what in a group — a DM's "other
                              side" is unambiguous, so this only shows for groups. */}
                          {!mine && isGroup && (
                            <p className="text-[10px] font-semibold text-slate-400 mb-0.5 px-1">{m.senderName}</p>
                          )}
                          <div
                            className={`rounded-2xl px-3.5 py-2.5 text-sm transition-shadow ${
                              mine ? "bg-indigo-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200"
                            } ${blurOn ? "blur-sm hover:blur-none transition-[filter]" : ""} ${
                              highlightedMessageId === m.id ? "ring-2 ring-amber-400 ring-offset-2 ring-offset-transparent" : ""
                            }`}
                          >
                            {images.length > 0 && (
                              <div className={`grid gap-1 mb-1.5 ${images.length > 1 ? "grid-cols-2" : "grid-cols-1"}`}>
                                {images.map((url, i) => (
                                  <img key={i} src={url} alt="attachment" className="rounded-lg w-full object-cover max-h-48" />
                                ))}
                              </div>
                            )}
                            {m.html && <RichTextView html={m.html} />}
                            <p className={`text-[10px] mt-1 flex items-center gap-1 ${mine ? "text-indigo-200" : "text-slate-400"}`}>
                              {isPinned && <span title="Pinned">📌</span>}
                              {/* Always IST regardless of the viewer's own device timezone —
                                  same convention as every other timestamp in the app
                                  (WorkBoard/Community reminders are all IST-scheduled). */}
                              {new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Kolkata" })}
                              {m.editedAt && " · edited"}
                              {mine && <MessageStatus m={m} isGroup={isGroup} />}
                            </p>
                          </div>
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 focus-within:opacity-100 flex items-center gap-1.5 mt-2 transition-opacity flex-shrink-0">
                          <button
                            onClick={() => togglePin(m.id, isPinned)}
                            title={isPinned ? "Unpin" : "Pin"}
                            className={isPinned ? "text-amber-500" : "text-slate-400 hover:text-amber-500"}
                          >
                            📌
                          </button>
                          {mine && m.canEdit && (
                            <button onClick={() => startEdit(m)} title="Edit message" className="text-slate-400 hover:text-indigo-500">
                              ✏️
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={bottomRef} />
              </div>
              {!isNearBottom && (
                <button
                  onClick={scrollToBottom}
                  title="Scroll to latest"
                  className="absolute bottom-3 right-3 w-9 h-9 rounded-full bg-slate-800/90 dark:bg-white/90 text-white dark:text-slate-800 shadow-lg flex items-center justify-center hover:scale-105 transition-transform"
                >
                  ↓
                </button>
              )}
            </div>

            <div className="p-3 border-t border-black/5 dark:border-white/10 flex-shrink-0 space-y-2">
              {editingMessageId && (
                <div className="flex items-center justify-between text-xs bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-lg px-3 py-1.5">
                  <span className="text-amber-600 dark:text-amber-400 font-medium">✏️ Editing message</span>
                  <button onClick={cancelEdit} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-medium">
                    Cancel
                  </button>
                </div>
              )}
              {pendingImageUrls.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {pendingImageUrls.map((url, i) => (
                    <div key={i} className="relative inline-block">
                      <img src={url} alt="pending" className="h-16 rounded-lg border border-slate-200 dark:border-white/10" />
                      <button
                        onClick={() => removePendingImage(i)}
                        className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-black/70 text-white text-xs flex items-center justify-center"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <RichTextEditor
                    value={composerHtml}
                    onChange={setComposerHtml}
                    placeholder="Type a message… (Enter to send, Shift+Enter for a new line)"
                    onPasteImage={(file) => pickImages([file])}
                    onEnterSubmit={send}
                    compact
                  />
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => pickImages(e.target.files)}
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingImage || pendingImageUrls.length >= MAX_IMAGES_PER_MESSAGE}
                  title={pendingImageUrls.length >= MAX_IMAGES_PER_MESSAGE ? `Up to ${MAX_IMAGES_PER_MESSAGE} images` : "Attach images"}
                  className={`w-10 h-10 flex-shrink-0 rounded-full flex items-center justify-center transition-colors ${
                    uploadingImage
                      ? "bg-indigo-600" // solid + a white spinner reads clearly, unlike a
                        // muted gray-on-gray spinner further dimmed by disabled:opacity
                      : "bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/15"
                  }`}
                >
                  {uploadingImage ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "📎"}
                </button>
                <button
                  onClick={send}
                  disabled={sending || (isRichTextEmpty(composerHtml) && pendingImageUrls.length === 0)}
                  title={editingMessageId ? "Save edit" : "Send"}
                  className="w-10 h-10 flex-shrink-0 rounded-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white flex items-center justify-center transition-colors"
                >
                  {sending ? (
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  ) : editingMessageId ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7"/></svg>
                  )}
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
                      disabled={!!startingChatUserId}
                      className={`w-full flex items-center gap-3 py-2.5 rounded-lg px-2 transition-colors text-left disabled:opacity-50 disabled:cursor-not-allowed border ${
                        u.isSelf
                          ? "bg-amber-100 dark:bg-amber-500/20 border-amber-300 dark:border-amber-500/40 hover:bg-amber-200 dark:hover:bg-amber-500/30"
                          : "border-transparent hover:bg-slate-50 dark:hover:bg-white/5"
                      }`}
                    >
                      {startingChatUserId === u.id ? (
                        <span className="w-8 h-8 flex-shrink-0 flex items-center justify-center">
                          <span className="w-4 h-4 border-2 border-slate-300 dark:border-slate-600 border-t-indigo-500 rounded-full animate-spin" />
                        </span>
                      ) : (
                        <Avatar name={u.name} avatar={u.avatar} presence={u.presence} size="w-8 h-8" />
                      )}
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">
                          {u.isSelf ? "Self (Me) — Notes to myself" : u.name}
                        </p>
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

      {/* New group modal (admin only) */}
      <AnimatePresence>
        {showGroupPicker && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowGroupPicker(false)}
              className="fixed inset-0 bg-black/50 z-40"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="glass-card w-full max-w-sm max-h-[80vh] flex flex-col p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="font-bold text-slate-800 dark:text-slate-100">👥 New Group</h2>
                  <button onClick={() => setShowGroupPicker(false)} className="text-slate-400 text-xl leading-none">✕</button>
                </div>
                <input
                  value={groupNameInput}
                  onChange={(e) => setGroupNameInput(e.target.value)}
                  placeholder="Group name (optional)"
                  className="input-light"
                />
                <input
                  value={groupPickerSearch}
                  onChange={(e) => setGroupPickerSearch(e.target.value)}
                  placeholder="Search members…"
                  className="input-light"
                />
                <p className="text-[11px] text-slate-400">{selectedMemberIds.length} member{selectedMemberIds.length === 1 ? "" : "s"} selected</p>
                <div className="flex-1 overflow-y-auto -mx-4 px-4">
                  {groupPickerUsers
                    .filter((u) => !u.isSelf) // creator is auto-included, no point letting them pick themselves
                    .filter((u) => `${u.name} ${u.email}`.toLowerCase().includes(groupPickerSearch.toLowerCase()))
                    .map((u) => (
                      <label
                        key={u.id}
                        className="w-full flex items-center gap-3 py-2.5 rounded-lg px-2 transition-colors cursor-pointer hover:bg-slate-50 dark:hover:bg-white/5"
                      >
                        <input
                          type="checkbox"
                          checked={selectedMemberIds.includes(u.id)}
                          onChange={() => toggleMember(u.id)}
                          className="w-4 h-4 rounded accent-indigo-600 flex-shrink-0"
                        />
                        <Avatar name={u.name} avatar={u.avatar} presence={u.presence} size="w-8 h-8" />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">{u.name}</p>
                          <p className="text-xs text-slate-400 truncate">{u.email}</p>
                        </div>
                      </label>
                    ))}
                </div>
                <button
                  onClick={createGroup}
                  disabled={creatingGroup || !selectedMemberIds.length}
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm font-semibold transition-colors"
                >
                  {creatingGroup ? "Creating…" : `Create Group${selectedMemberIds.length ? ` (${selectedMemberIds.length})` : ""}`}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Global search — across every chat the caller is a participant in */}
      <AnimatePresence>
        {showGlobalSearch && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => { setShowGlobalSearch(false); setGlobalSearchQuery(""); setGlobalSearchResults([]); }}
              className="fixed inset-0 bg-black/50 z-40"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="glass-card w-full max-w-md max-h-[75vh] flex flex-col p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="font-bold text-slate-800 dark:text-slate-100">🔍 Search Messages</h2>
                  <button
                    onClick={() => { setShowGlobalSearch(false); setGlobalSearchQuery(""); setGlobalSearchResults([]); }}
                    className="text-slate-400 text-xl leading-none"
                  >
                    ✕
                  </button>
                </div>
                <input
                  value={globalSearchQuery}
                  onChange={(e) => setGlobalSearchQuery(e.target.value)}
                  placeholder="Search across all your conversations…"
                  autoFocus
                  className="input-light"
                />
                <div className="flex-1 overflow-y-auto -mx-4 px-4">
                  {globalSearching ? (
                    <div className="flex items-center justify-center py-8 text-slate-400 gap-2 text-sm">
                      <span className="w-4 h-4 border-2 border-slate-300 dark:border-slate-600 border-t-indigo-500 rounded-full animate-spin" />
                      Searching…
                    </div>
                  ) : globalSearchQuery.trim() && !globalSearchResults.length ? (
                    <p className="text-sm text-slate-400 text-center py-8">No messages found.</p>
                  ) : (
                    globalSearchResults.map((r) => (
                      <button
                        key={r.messageId}
                        onClick={() => openSearchResult(r)}
                        className="w-full text-left py-2.5 px-2 rounded-lg hover:bg-slate-50 dark:hover:bg-white/5 transition-colors border-b border-black/5 dark:border-white/5 last:border-0"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 truncate">
                            {r.chatType === "group" ? "👥 " : ""}{r.chatName}
                          </p>
                          <span className="text-[10px] text-slate-400 flex-shrink-0">
                            {new Date(r.createdAt).toLocaleDateString([], { timeZone: "Asia/Kolkata" })}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 truncate">
                          <span className="font-medium">{r.senderName}:</span> {r.snippet}
                        </p>
                      </button>
                    ))
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
