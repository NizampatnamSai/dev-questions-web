import { useState, useEffect, useRef, Fragment } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import RichTextEditor, { isRichTextEmpty } from "../components/RichTextEditor";
import RichTextView from "../components/RichTextView";
import { useClickOutside } from "../hooks/useClickOutside";
import { fmtDateTime, fmtDateDivider, dayKey } from "../utils/time";

const _apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000/api";
const WS_BASE = _apiUrl
  .replace(/^http:/, "ws:")
  .replace(/^https:/, "wss:")
  .replace(/\/api$/, "");

const MAX_IMAGES_PER_MESSAGE = 6; // matches server/routers/admin_chat.py
const MIN_SUMMARIZE_WORDS = 25; // matches server/routers/admin_chat.py — hides the button on short messages that would just 400
const REACTION_EMOJIS = ["👍", "❤️", "😂", "🎉", "😮", "👀"]; // matches server/routers/admin_chat.py

function stripHtmlForSearch(html) {
  if (!html) return "";
  // A real (detached, never-rendered) element decodes entities correctly —
  // a regex can strip tags but not reliably handle &nbsp;/&amp;/etc.
  const el = document.createElement("div");
  el.innerHTML = html;
  return el.textContent || "";
}

// Mirrors _preview_text() in routers/admin_chat.py — used to patch the
// conversation list's preview text directly from a WS "new_message" payload
// instead of firing a REST refetch just to learn what the server already
// told us.
function derivePreview(message) {
  // A code-block message's stripped text IS the raw code — same special
  // case as images, so it doesn't dump literal code into the chat list.
  if ((message.html || "").includes("<pre")) return "💻 Code snippet";
  const text = stripHtmlForSearch(message.html).trim();
  if (text) return text.slice(0, 80);
  const n = (message.imageUrls || []).length;
  if (n > 1) return `📷 ${n} Images`;
  if (n === 1) return "📷 Image";
  return "";
}

// Unsent-composer drafts, per chat — localStorage rather than server-side so
// switching screens (or closing the tab entirely) never loses what you were
// typing. Never touched while editing an existing message (that temporarily
// loads the target message's content into the same composer state).
const DRAFT_KEY_PREFIX = "devquiz_chat_draft_";

function loadDraft(chatId) {
  try {
    const raw = localStorage.getItem(DRAFT_KEY_PREFIX + chatId);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveDraft(chatId, html, imageUrls) {
  try {
    if (isRichTextEmpty(html) && imageUrls.length === 0) {
      localStorage.removeItem(DRAFT_KEY_PREFIX + chatId);
    } else {
      localStorage.setItem(DRAFT_KEY_PREFIX + chatId, JSON.stringify({ html, imageUrls }));
    }
  } catch {}
}

const URL_TEST_RE = /https?:\/\/[^\s<]+/;
const URL_MATCH_RE = /https?:\/\/[^\s<]+/g;

// Quill's own "link" toolbar button already wraps text the user explicitly
// marked as a link — this only catches plain pasted/typed URLs that never
// went through that button. Walks text nodes via a detached DOM (not a
// regex over the raw HTML string) specifically so it can skip anything
// already inside an <a>, avoiding double-wrapping.
function linkifyHtml(html) {
  if (!html || !URL_TEST_RE.test(html)) return html;
  const container = document.createElement("div");
  container.innerHTML = html;
  const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, {
    acceptNode: (node) =>
      node.parentElement?.closest("a") || !URL_TEST_RE.test(node.textContent)
        ? NodeFilter.FILTER_SKIP
        : NodeFilter.FILTER_ACCEPT,
  });
  const textNodes = [];
  let n;
  while ((n = walker.nextNode())) textNodes.push(n);
  for (const node of textNodes) {
    const text = node.textContent;
    const frag = document.createDocumentFragment();
    let lastIndex = 0;
    let match;
    URL_MATCH_RE.lastIndex = 0;
    while ((match = URL_MATCH_RE.exec(text))) {
      if (match.index > lastIndex) frag.appendChild(document.createTextNode(text.slice(lastIndex, match.index)));
      const a = document.createElement("a");
      a.href = match[0];
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.textContent = match[0];
      frag.appendChild(a);
      lastIndex = match.index + match[0].length;
    }
    if (lastIndex < text.length) frag.appendChild(document.createTextNode(text.slice(lastIndex)));
    node.parentNode.replaceChild(frag, node);
  }
  return container.innerHTML;
}

// Wraps @Name occurrences (matched against actual group participant names,
// not a bare "@" regex) in a highlighted span — same detect-in-text-nodes
// approach as linkifyHtml, applied separately since it needs a different
// per-chat name list rather than a fixed pattern.
function highlightMentions(html, participantNames) {
  const names = participantNames ? Object.values(participantNames).filter(Boolean) : [];
  if (!html || !names.length) return html;
  const escaped = [...names].sort((a, b) => b.length - a.length).map((n) => n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const mentionRe = new RegExp(`@(${escaped.join("|")})\\b`, "g");

  const container = document.createElement("div");
  container.innerHTML = html;
  const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, {
    acceptNode: (node) => {
      mentionRe.lastIndex = 0;
      return mentionRe.test(node.textContent) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
    },
  });
  const textNodes = [];
  let n;
  while ((n = walker.nextNode())) textNodes.push(n);
  for (const node of textNodes) {
    const text = node.textContent;
    const frag = document.createDocumentFragment();
    let lastIndex = 0;
    let match;
    mentionRe.lastIndex = 0;
    while ((match = mentionRe.exec(text))) {
      if (match.index > lastIndex) frag.appendChild(document.createTextNode(text.slice(lastIndex, match.index)));
      const span = document.createElement("span");
      span.className = "mention";
      span.textContent = match[0];
      frag.appendChild(span);
      lastIndex = match.index + match[0].length;
    }
    if (lastIndex < text.length) frag.appendChild(document.createTextNode(text.slice(lastIndex)));
    node.parentNode.replaceChild(frag, node);
  }
  return container.innerHTML;
}

// green = online now (or active in the last 5 min), yellow = away (up to an
// hour), red = offline beyond that or never seen. The server only ever sends
// the raw `online` flag + `lastActiveAt` timestamp — computed here, purely
// client-side, so keeping this fresh over time never needs to re-poll the
// server (a live WS "presence" event still updates the raw inputs instantly
// for genuine online/offline transitions).
const PRESENCE_COLOR = {
  online: "bg-emerald-500",
  away: "bg-amber-400",
  offline: "bg-slate-400 dark:bg-slate-500",
};

function computePresence(online, lastActiveAt) {
  if (online) return "online";
  if (!lastActiveAt) return "offline";
  const elapsed = (Date.now() - new Date(lastActiveAt).getTime()) / 1000;
  if (elapsed < 300) return "online";
  if (elapsed < 3600) return "away";
  return "offline";
}

// Only rendered on your own sent messages (WhatsApp-style — you don't see
// ticks on messages from others). deliveredCount/readCount/totalRecipients
// come from the server (_recipient_status in routers/admin_chat.py); a DM's
// totalRecipients is always 1, a group's can be N.
function MessageStatus({ m, isGroup }) {
  if (m.totalRecipients == null || m.totalRecipients === 0) return null;
  if (isGroup) {
    const seenGroup = m.readCount > 0;
    const label = seenGroup ? `Seen ${m.readCount}/${m.totalRecipients}` : m.deliveredCount > 0 ? `Delivered ${m.deliveredCount}/${m.totalRecipients}` : "Sent";
    return <span className={`text-[9px] font-medium ${seenGroup ? "text-emerald-300" : "text-indigo-200"}`}>{label}</span>;
  }
  const seen = m.readCount >= m.totalRecipients;
  // Seen always implies delivered — you can't read something that never
  // arrived — so the glyph must never show a single tick once it's seen,
  // even if deliveredCount happens to be stale/behind readCount.
  const delivered = seen || m.deliveredCount >= m.totalRecipients;
  // A blue "seen" tick (WhatsApp's convention) barely reads against a bubble
  // that's already indigo — swapped to emerald so it actually stands out,
  // and unseen ticks stay the same dim indigo-200 as the rest of the meta text.
  return (
    <span title={seen ? "Seen" : delivered ? "Delivered" : "Sent"} className={seen ? "text-emerald-300 font-bold" : "text-indigo-200"}>
      {delivered ? "✓✓" : "✓"}
    </span>
  );
}

// A reaction chip that lazily fetches "who reacted" on hover instead of
// resolving names eagerly on every message fetch — same pattern as
// Community's QuestionCard.jsx reaction chips.
function ReactionChip({ emoji, count, mine, onClick, fetchReactors }) {
  const [tooltip, setTooltip] = useState(null); // null | "loading" | string[]
  const timerRef = useRef(null);

  const handleEnter = () => {
    timerRef.current = setTimeout(async () => {
      setTooltip("loading");
      try {
        setTooltip(await fetchReactors(emoji));
      } catch {
        setTooltip(null);
      }
    }, 250);
  };
  const handleLeave = () => {
    clearTimeout(timerRef.current);
    setTooltip(null);
  };

  return (
    <div className="relative inline-block" onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
      <button
        onClick={onClick}
        className={`text-[11px] px-1.5 py-0.5 rounded-full border transition-colors ${
          mine
            ? "bg-indigo-100 dark:bg-indigo-500/20 border-indigo-300 dark:border-indigo-500/40"
            : "bg-slate-100 dark:bg-white/5 border-transparent hover:border-slate-300 dark:hover:border-white/20"
        }`}
      >
        {emoji} {count}
      </button>
      {tooltip && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2.5 py-1 rounded-lg bg-slate-900 dark:bg-slate-700 text-white text-[11px] whitespace-nowrap shadow-lg z-20">
          {tooltip === "loading" ? "…" : tooltip.length ? tooltip.join(", ") : "No one yet"}
        </div>
      )}
    </div>
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
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [scheduledFor, setScheduledFor] = useState("");
  const [scheduling, setScheduling] = useState(false);
  const [scheduledMessages, setScheduledMessages] = useState([]);
  const [showScheduledPanel, setShowScheduledPanel] = useState(false);
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
  const [summarizingMessageId, setSummarizingMessageId] = useState(null);
  const [summaryPopover, setSummaryPopover] = useState(null); // {messageId, text} | null
  const [reactionPickerFor, setReactionPickerFor] = useState(null); // messageId | null
  const [draftsByChat, setDraftsByChat] = useState({}); // { chatId: previewText } — drives the sidebar's "Draft: ..." row
  const [lightboxImage, setLightboxImage] = useState(null); // image url currently shown full-size, or null
  const [showMentionPicker, setShowMentionPicker] = useState(false);
  const [mentionQuery, setMentionQuery] = useState(null); // text typed after "@" while inline-triggered, or null when not in a mention-typing session
  const mentionStartIndexRef = useRef(null); // Quill text index of the "@" that triggered the current mention session — null when the picker was opened via the button instead of typing
  const mentionPickerRef = useRef(null);
  const composerQuillRef = useRef(null); // set once by RichTextEditor's onReady — needed to insert mentions at the cursor via Quill's own API
  const wsRef = useRef(null);
  const bottomRef = useRef(null);
  const fileInputRef = useRef(null);
  const activeChatIdRef = useRef(null);
  const activeChatRef = useRef(null);
  const messageRefs = useRef({});
  const messagesContainerRef = useRef(null);
  const dateDividerRefs = useRef({}); // dayKey -> {el, label}
  const [floatingDateLabel, setFloatingDateLabel] = useState(null);

  useEffect(() => { activeChatIdRef.current = activeChatId; }, [activeChatId]);

  useEffect(() => {
    if (!lightboxImage) return;
    const handler = (e) => e.key === "Escape" && setLightboxImage(null);
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [lightboxImage]);

  useClickOutside(
    mentionPickerRef,
    () => {
      setShowMentionPicker(false);
      setMentionQuery(null);
      mentionStartIndexRef.current = null;
    },
    showMentionPicker,
  );

  useEffect(() => {
    localStorage.setItem("devquiz_chat_blur", String(blurOn));
  }, [blurOn]);

  // Not saved while editing an existing message — that temporarily loads the
  // target message's own content into this same composer state, which isn't
  // a draft of a new message.
  useEffect(() => {
    if (!activeChatId || editingMessageId) return;
    saveDraft(activeChatId, composerHtml, pendingImageUrls);
    const preview = stripHtmlForSearch(composerHtml).trim();
    const hasDraft = !!preview || pendingImageUrls.length > 0;
    setDraftsByChat((prev) => {
      if (!hasDraft) {
        if (!(activeChatId in prev)) return prev;
        const next = { ...prev };
        delete next[activeChatId];
        return next;
      }
      const draftPreview = composerHtml.includes("<pre")
        ? "💻 Code snippet"
        : preview ? preview.slice(0, 80) : "📷 Image";
      return prev[activeChatId] === draftPreview ? prev : { ...prev, [activeChatId]: draftPreview };
    });
  }, [activeChatId, editingMessageId, composerHtml, pendingImageUrls]);

  // Picks up drafts saved in an earlier session (page reload, or navigated
  // away and back) — the save-effect above only updates drafts for chats
  // touched THIS session, so without this, an old draft would sit correctly
  // in localStorage but never show up in the sidebar until you happened to
  // reopen that exact chat.
  useEffect(() => {
    const found = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key || !key.startsWith(DRAFT_KEY_PREFIX)) continue;
      const draft = loadDraft(key.slice(DRAFT_KEY_PREFIX.length));
      if (!draft) continue;
      const preview = stripHtmlForSearch(draft.html || "").trim();
      if (!preview && !(draft.imageUrls || []).length) continue;
      found[key.slice(DRAFT_KEY_PREFIX.length)] = (draft.html || "").includes("<pre")
        ? "💻 Code snippet"
        : preview ? preview.slice(0, 80) : "📷 Image";
    }
    setDraftsByChat(found);
  }, []);

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
  // yellow -> red at 1 hour) even with no new messages or events at all —
  // this used to be a server poll (GET /conversations every 60s, for as
  // long as anyone had Messages open), which is real recurring load on a
  // free-tier server for zero new information most of the time. Now it's
  // just a local re-render tick — computePresence() re-evaluates against
  // the current clock on every tick, no network involved.
  const [, setPresenceTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setPresenceTick((t) => t + 1), 30000);
    return () => clearInterval(id);
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
    // Guards against orphaning a previous connection if this ever fires
    // again without a clean unmount in between (observed in dev under Vite's
    // Fast Refresh: editing this file can force a remount without running
    // the old effect's cleanup, leaking a duplicate connection every time).
    // Clearing onclose first stops the stale socket from also scheduling
    // its own redundant reconnect.
    if (wsRef.current) {
      wsRef.current.onclose = null;
      wsRef.current.close();
    }
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
              // Sent over the already-open socket itself rather than a
              // separate REST call — this fires on every incoming message,
              // so it's the highest-frequency client action in the whole
              // page and the clearest case for using the connection that's
              // already there.
              if (ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({ type: "mark_read", chatId: msg.chatId }));
              }
            }
            return currentActiveId;
          });
          // Patch the sidebar entry directly from the WS payload — a REST
          // refetch here was pure overhead for the common case (a message in
          // a conversation we already have loaded). Only falls back to a
          // real fetch for a chat we've genuinely never seen before (e.g.
          // just got added to a new group), since there's nothing local to patch.
          setConversations((prev) => {
            if (!prev.some((c) => c.id === msg.chatId)) {
              loadConversations();
              return prev;
            }
            return prev
              .map((c) =>
                c.id === msg.chatId
                  ? {
                      ...c,
                      lastMessageAt: msg.message.createdAt,
                      lastMessagePreview: derivePreview(msg.message),
                      unreadCount: msg.chatId === activeChatIdRef.current ? c.unreadCount : (c.unreadCount || 0) + 1,
                    }
                  : c,
              )
              .sort((a, b) => (b.lastMessageAt || "").localeCompare(a.lastMessageAt || ""));
          });
        } else if (msg.type === "read_receipt") {
          // The broadcast already carries fresh per-message delivered/read
          // counts (see _mark_delivered_and_read in admin_chat.py) — patch
          // them directly instead of a REST refetch.
          if (msg.chatId === activeChatIdRef.current && msg.statuses) {
            setMessages((prev) => prev.map((m) => (msg.statuses[m.id] ? { ...m, ...msg.statuses[m.id] } : m)));
          }
        } else if (msg.type === "edit_message") {
          setActiveChatId((currentActiveId) => {
            if (msg.chatId === currentActiveId) {
              setMessages((prev) => prev.map((m) => (m.id === msg.message.id ? msg.message : m)));
            }
            return currentActiveId;
          });
          // No sidebar patch here on purpose: editing an older message
          // doesn't change the preview (the backend only updates it when
          // the edited message was the latest one), and if it WAS the
          // latest, the mismatch self-corrects within the next 60s poll —
          // not worth a REST round-trip on every edit to find out which case it is.
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
        } else if (msg.type === "react_message") {
          if (msg.chatId === activeChatIdRef.current) {
            setMessages((prev) =>
              prev.map((m) => (m.id === msg.messageId ? { ...m, reactions: msg.reactions } : m)),
            );
          }
        } else if (msg.type === "presence") {
          // Both directions patch locally now — computePresence() derives
          // the color from these two raw fields, so there's nothing a
          // refetch would tell us that we don't already know. lastActiveAt
          // is bumped to now on every transition (mirrors the server doing
          // the same thing on both WS connect and disconnect), so the
          // away/offline decay always starts counting from the right moment.
          const nowIso = new Date().toISOString();
          setConversations((prev) =>
            prev.map((c) =>
              c.otherUserId === msg.userId ? { ...c, otherUserOnline: msg.online, otherUserLastActiveAt: nowIso } : c,
            ),
          );
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
    // cause as the earlier Dev Life Assistant chatbot page-shift bug).
    if (isNearBottom) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);

  // Recompute the floating date pill whenever the message list changes —
  // covers opening a chat, a new message arriving, and switching chats.
  // rAF lets the new dividers' ref callbacks commit first.
  useEffect(() => {
    const raf = requestAnimationFrame(() => updateFloatingDateLabel());
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);

  // Drives the floating "Today"/"Monday, 13 July" pill — computed from
  // scroll position directly rather than via CSS `position: sticky`. Sticky
  // needs every single flex ancestor between it and the scrolling container
  // to have min-h-0 (a notoriously easy-to-miss flexbox gotcha, and this
  // page nests several levels deep: AppLayout > main > PageWrapper > this
  // component's own row/column wrappers > the Thread panel > this list) —
  // one missed level anywhere in that chain silently breaks it with no
  // console warning. Computing it from scroll position + each divider's
  // measured offsetTop sidesteps the whole fragile chain entirely.
  const updateFloatingDateLabel = () => {
    const el = messagesContainerRef.current;
    if (!el) return;
    // isConnected filters out entries left behind by a previous chat's
    // dividers whose DOM nodes have since been removed (e.g. after
    // switching chats) — a detached node's getBoundingClientRect() would
    // otherwise resolve to all-zeros and could wrongly look "at the top".
    const entries = Object.values(dateDividerRefs.current).filter((d) => d.el?.isConnected);
    if (!entries.length) return setFloatingDateLabel(null);
    // Barely scrolled (or not at all) — the very first in-flow divider is
    // already sitting right at the top of the list on its own, so showing
    // the floating pill too would just stack a duplicate label on top of it.
    if (el.scrollTop <= 20) return setFloatingDateLabel(null);
    // getBoundingClientRect (viewport-relative, always reflects the current
    // scroll position) rather than offsetTop — offsetTop is measured
    // relative to the nearest POSITIONED ancestor, which here is a wrapper
    // div ABOVE the scrolling container, not the scrolling container
    // itself, so it doesn't move as you scroll and can't be compared
    // against scrollTop directly.
    const containerTop = el.getBoundingClientRect().top;
    let current = null;
    for (const d of entries) {
      if (d.el.getBoundingClientRect().top - containerTop <= 4) current = d;
      else break;
    }
    setFloatingDateLabel(current ? current.label : entries[0].label);
  };

  const handleMessagesScroll = () => {
    const el = messagesContainerRef.current;
    if (!el) return;
    setIsNearBottom(el.scrollHeight - el.scrollTop - el.clientHeight < 80);
    updateFloatingDateLabel();
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

  const copyMessage = async (m) => {
    const text = stripHtmlForSearch(m.html).trim() || (m.imageUrls?.length ? m.imageUrls.join("\n") : "");
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard");
    } catch {
      toast.error("Couldn't copy — your browser blocked clipboard access");
    }
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

  const toggleReaction = async (messageId, emoji) => {
    setReactionPickerFor(null);
    // Optimistic: flip it locally right away rather than waiting on the
    // round trip — a reaction that only appears after a network response
    // (or worse, after the OTHER side's WS event echoes back) reads as
    // "broken", not "a bit slow". Reverted on failure below.
    let prevMessages;
    setMessages((prev) => {
      prevMessages = prev;
      return prev.map((m) => {
        if (m.id !== messageId) return m;
        const alreadyMine = m.myReactions?.includes(emoji);
        const reactions = { ...(m.reactions || {}) };
        const nextCount = (reactions[emoji] || 0) + (alreadyMine ? -1 : 1);
        if (nextCount > 0) reactions[emoji] = nextCount;
        else delete reactions[emoji];
        const myReactions = alreadyMine
          ? (m.myReactions || []).filter((e) => e !== emoji)
          : [...(m.myReactions || []), emoji];
        return { ...m, reactions, myReactions };
      });
    });
    try {
      const { data } = await api.post(`/admin-chat/${activeChatId}/messages/${messageId}/react`, { emoji });
      setMessages((prev) =>
        prev.map((m) => (m.id === messageId ? { ...m, reactions: data.reactions, myReactions: data.myReactions } : m)),
      );
    } catch (err) {
      setMessages(prevMessages);
      toast.error(err.response?.data?.detail || "Failed to react");
    }
  };

  const toggleMute = async (chatId, isMuted) => {
    try {
      if (isMuted) {
        await api.delete(`/admin-chat/${chatId}/mute`);
      } else {
        await api.post(`/admin-chat/${chatId}/mute`);
      }
      setConversations((prev) => prev.map((c) => (c.id === chatId ? { ...c, mutedByMe: !isMuted } : c)));
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to update mute");
    }
  };

  const summarizeMessage = async (messageId) => {
    setSummarizingMessageId(messageId);
    try {
      const { data } = await api.post(`/admin-chat/${activeChatId}/messages/${messageId}/summarize`);
      setSummaryPopover({ messageId, text: data.summary });
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to summarize");
    } finally {
      setSummarizingMessageId(null);
    }
  };

  const openChat = async (chatId) => {
    setActiveChatId(chatId);
    setMessages([]);
    setEditingMessageId(null);
    const draft = loadDraft(chatId);
    setComposerHtml(draft?.html || "");
    setPendingImageUrls(draft?.imageUrls || []);
    setRenamingGroup(false);
    setIsNearBottom(true);
    setChatSearchOpen(false);
    setChatSearchQuery("");
    setSummaryPopover(null);
    setShowScheduledPanel(false);
    setScheduledMessages([]);
    loadScheduledMessages(chatId);
    setLoadingMessages(true);
    try {
      const { data } = await api.get(`/admin-chat/${chatId}/messages`);
      setMessages(data);
      // Fetching a chat's messages already marks them read server-side —
      // zero the sidebar's unread badge locally instead of a full
      // GET /conversations just to learn the number we already know is 0.
      setConversations((prev) => prev.map((c) => (c.id === chatId ? { ...c, unreadCount: 0 } : c)));
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
      // Same fix as startChat: POST /group's response already has everything
      // the header needs (type/groupName), it just was never added to
      // `conversations` — splice it in now instead of leaving activeChat
      // undefined until the next background refresh.
      setConversations((prev) =>
        prev.some((c) => c.id === data.id)
          ? prev
          : [{ ...data, unreadCount: 0, pinnedMessageIds: [], mutedByMe: false }, ...prev],
      );
      loadConversations();
      await openChat(data.id);
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
      // POST /start only returns the raw chat doc (adminId/userId/userName…),
      // not the otherUserName/otherUserAvatar fields the sidebar/header read —
      // those only exist on GET /conversations' aggregated shape. Without this,
      // a brand-new chat wasn't in `conversations` at all yet, so the header
      // rendered Avatar with no name → the "?" placeholder — until the next
      // background loadConversations() (tab visibility change), which could be
      // minutes away. Splice in an optimistic entry using data the picker
      // already has, then reconcile for real in the background.
      setConversations((prev) => {
        if (prev.some((c) => c.id === data.id)) return prev;
        const picked = pickerUsers.find((u) => u.id === targetUserId);
        return [
          {
            id: data.id,
            type: "dm",
            otherUserId: targetUserId,
            otherUserName: picked?.isSelf ? "Self (Me) — Notes to myself" : picked?.name || data.userName,
            otherUserAvatar: picked?.avatar || null,
            otherUserOnline: picked?.online || false,
            otherUserLastActiveAt: picked?.lastActiveAt || null,
            lastMessageAt: data.lastMessageAt,
            lastMessagePreview: data.lastMessagePreview || "",
            unreadCount: 0,
            pinnedMessageIds: [],
            mutedByMe: false,
          },
          ...prev,
        ];
      });
      loadConversations(); // reconcile with the canonical shape in the background — not awaited, so it doesn't add to the wait
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

  // Message notifications link straight to /messages?chatId=&messageId= (see
  // send_message() in admin_chat.py) — open that exact conversation and
  // scroll to the exact message instead of just landing on the bare list.
  // Not admin-gated: any participant (not just whoever can start a chat)
  // should be able to follow a notification into an existing conversation.
  useEffect(() => {
    const chatId = searchParams.get("chatId");
    const messageId = searchParams.get("messageId");
    if (chatId) {
      openChat(chatId).then(() => {
        if (messageId) setTimeout(() => jumpToMessage(messageId), 300);
      });
      setSearchParams({}, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

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

  const downloadImage = async (url) => {
    try {
      // Fetched as a blob rather than a plain <a download> — the download
      // attribute is silently ignored for cross-origin links (these are
      // served from Cloudinary), so without this it just opens the image
      // in a new tab instead of actually downloading it.
      const res = await fetch(url, { mode: "cors" });
      if (!res.ok) throw new Error("fetch failed");
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = url.split("/").pop().split("?")[0] || "image.jpg";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(blobUrl);
    } catch {
      toast.error("Couldn't download — opening in a new tab instead");
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  const insertMention = (name) => {
    // Detected and highlighted later purely by matching "@Name" text against
    // the group's actual participant names (see highlightMentions above),
    // not a special blot, so this stays plain text the user can freely edit.
    const quill = composerQuillRef.current;
    const startIndex = mentionStartIndexRef.current;
    if (startIndex != null && quill) {
      // Triggered by typing "@query" inline — replace exactly that span at
      // the cursor via Quill's own API so the controlled composerHtml state
      // (which flows through Quill's text-change -> onChange) stays in sync,
      // rather than appending blind and losing the user's cursor position.
      const sel = quill.getSelection();
      const endIndex = sel ? sel.index : startIndex;
      quill.deleteText(startIndex, Math.max(0, endIndex - startIndex), "user");
      quill.insertText(startIndex, `@${name} `, "user");
      quill.setSelection(startIndex + name.length + 2, 0, "user");
    } else {
      // Opened via the "@" button with no typed query — same append-only
      // tradeoff Notes.jsx's own "AI Write" makes when adding generated text.
      setComposerHtml((prev) => (isRichTextEmpty(prev) ? "" : prev) + `@${name}&nbsp;`);
    }
    setShowMentionPicker(false);
    setMentionQuery(null);
    mentionStartIndexRef.current = null;
  };

  // Fires once RichTextEditor's underlying Quill instance is ready, giving us
  // direct access to detect "@" as it's typed (not just via the picker
  // button) and to know exactly where the cursor is for insertion.
  const handleComposerReady = (quill) => {
    if (!quill) return;
    composerQuillRef.current = quill;
    quill.on("text-change", () => {
      // quill.getSelection() reads the native browser Selection, which lags
      // one tick behind the "text-change" event that just fired (most
      // visible on the very first character typed into an empty editor —
      // getSelection() still reports the pre-keystroke cursor position).
      // Deferring to a microtask lets the browser's selection catch up first.
      setTimeout(() => {
        if (activeChatRef.current?.type !== "group") return; // only groups have anyone to mention
        const sel = quill.getSelection();
        if (!sel) return;
        const textBeforeCursor = quill.getText(0, sel.index);
        const match = textBeforeCursor.match(/(?:^|\s)@(\w*)$/);
        if (match) {
          mentionStartIndexRef.current = sel.index - match[1].length - 1;
          setMentionQuery(match[1]);
          setShowMentionPicker(true);
        } else if (mentionStartIndexRef.current != null) {
          mentionStartIndexRef.current = null;
          setMentionQuery(null);
          setShowMentionPicker(false);
        }
      }, 0);
    });
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
        // Mirrors the backend's own rule (routers/admin_chat.py) — only the
        // latest message's edit changes the sidebar preview.
        if (messages[messages.length - 1]?.id === data.id) {
          const preview = derivePreview(data);
          setConversations((prev) => prev.map((c) => (c.id === activeChatId ? { ...c, lastMessagePreview: preview } : c)));
        }
        setEditingMessageId(null);
        setComposerHtml("");
        setPendingImageUrls([]);
      } else {
        const { data } = await api.post(`/admin-chat/${activeChatId}/messages`, {
          html: composerHtml,
          imageUrls: pendingImageUrls,
        });
        setMessages((prev) => [...prev, data]);
        setComposerHtml("");
        setPendingImageUrls([]);
        setIsNearBottom(true); // always snap to your own just-sent message
        // Already have everything needed to patch the sidebar locally — no
        // need for a full GET /conversations just to learn what we just sent.
        const preview = derivePreview(data);
        setConversations((prev) =>
          prev
            .map((c) => (c.id === activeChatId ? { ...c, lastMessageAt: data.createdAt, lastMessagePreview: preview } : c))
            .sort((a, b) => (b.lastMessageAt || "").localeCompare(a.lastMessageAt || "")),
        );
      }
    } catch (err) {
      toast.error(err.response?.data?.detail || (editingMessageId ? "Failed to save edit" : "Failed to send"));
    } finally {
      setSending(false);
    }
  };

  const loadScheduledMessages = (chatId) => {
    if (!chatId) return;
    api.get(`/admin-chat/${chatId}/messages/scheduled/list`)
      .then(({ data }) => setScheduledMessages(data))
      .catch(() => {});
  };

  const scheduleMessage = async () => {
    if (isRichTextEmpty(composerHtml) && pendingImageUrls.length === 0) return;
    if (!scheduledFor) return toast.error("Pick a date and time");
    const iso = new Date(scheduledFor).toISOString();
    if (new Date(iso) <= new Date()) return toast.error("Scheduled time must be in the future");
    setScheduling(true);
    try {
      await api.post(`/admin-chat/${activeChatId}/messages/schedule`, {
        html: composerHtml,
        imageUrls: pendingImageUrls,
        scheduledFor: iso,
      });
      toast.success("Message scheduled");
      setComposerHtml("");
      setPendingImageUrls([]);
      setScheduleOpen(false);
      setScheduledFor("");
      loadScheduledMessages(activeChatId);
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to schedule message");
    } finally {
      setScheduling(false);
    }
  };

  const cancelScheduledMessage = async (id) => {
    try {
      await api.delete(`/admin-chat/${activeChatId}/messages/scheduled/${id}`);
      setScheduledMessages((prev) => prev.filter((m) => m.id !== id));
      toast.success("Scheduled message canceled");
    } catch {
      toast.error("Failed to cancel");
    }
  };

  const activeChat = conversations.find((c) => c.id === activeChatId);
  useEffect(() => { activeChatRef.current = activeChat; }, [activeChat]);
  const activeChatPresence =
    activeChat && activeChat.type !== "group" ? computePresence(activeChat.otherUserOnline, activeChat.otherUserLastActiveAt) : null;
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
    <div className="flex-1 min-h-0 flex gap-4">
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
              <div
                key={c.id}
                onClick={() => openChat(c.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && openChat(c.id)}
                className={`group/row w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-white/5 transition-colors border-b border-black/5 dark:border-white/5 cursor-pointer ${
                  activeChatId === c.id ? "bg-indigo-50 dark:bg-indigo-500/10" : ""
                }`}
              >
                {c.type === "group" ? <GroupAvatar /> : <Avatar name={c.otherUserName} avatar={c.otherUserAvatar} presence={computePresence(c.otherUserOnline, c.otherUserLastActiveAt)} />}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 truncate flex items-center gap-1">
                      {c.type === "group" ? c.groupName : c.otherUserName}
                      {c.mutedByMe && <span title="Muted" className="text-slate-400 text-xs flex-shrink-0">🔕</span>}
                    </p>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {/* Toggle mute right from the sidebar, no need to open
                          the chat first — dimmed-but-visible on mobile (no
                          hover state there), hover-revealed on desktop. */}
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleMute(c.id, c.mutedByMe); }}
                        title={c.mutedByMe ? "Unmute notifications" : "Mute notifications"}
                        className="w-5 h-5 rounded-full flex items-center justify-center text-[11px] opacity-60 sm:opacity-0 sm:group-hover/row:opacity-100 hover:bg-slate-200 dark:hover:bg-white/10 transition-opacity"
                      >
                        {c.mutedByMe ? "🔕" : "🔔"}
                      </button>
                      {c.unreadCount > 0 && (
                        <span className={`text-[10px] rounded-full px-1.5 py-0.5 text-white ${c.mutedByMe ? "bg-slate-400 dark:bg-slate-600" : "bg-indigo-600"}`}>
                          {c.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-xs truncate">
                    {draftsByChat[c.id] ? (
                      <span className="text-amber-600 dark:text-amber-400 font-medium">📝 Draft: {draftsByChat[c.id]}</span>
                    ) : (
                      <span className="text-slate-400">
                        {c.type === "group" && <span>{c.onlineCount}/{c.participantCount} online · </span>}
                        {c.lastMessagePreview || "…"}
                      </span>
                    )}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Thread */}
      <div className={`flex-1 min-h-0 glass-card p-0 flex flex-col overflow-hidden ${!activeChatId ? "hidden sm:flex" : ""}`}>
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
                <Avatar name={activeChat?.otherUserName} avatar={activeChat?.otherUserAvatar} presence={activeChatPresence} size="w-8 h-8" />
              )}
              <div className="flex-1 min-w-0">
                {renamingGroup ? (
                  <div className="flex items-center gap-1.5">
                    <input
                      value={groupRenameInput}
                      onChange={(e) => setGroupRenameInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && saveGroupName()}
                      autoFocus
                      // autoComplete="off" alone doesn't work — Chrome
                      // deliberately ignores it for fields it thinks look
                      // autofill-worthy. "new-password" is the actual
                      // reliable trick (Chrome treats it as "don't touch",
                      // and doesn't trigger the password-suggestion UI since
                      // this isn't type="password"), paired with a name
                      // Chrome has no saved values for.
                      autoComplete="new-password"
                      name="group-rename-no-autofill"
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
                      activeChatPresence && (
                        <p className="text-[10px] text-slate-400">
                          {activeChatPresence === "online" ? "Online" : activeChatPresence === "away" ? "Away" : "Offline"}
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
              {activeChat && (
                <button
                  onClick={() => toggleMute(activeChat.id, activeChat.mutedByMe)}
                  title={activeChat.mutedByMe ? "Unmute notifications for this chat" : "Mute notifications for this chat"}
                  className={`text-sm flex-shrink-0 transition-colors ${activeChat.mutedByMe ? "text-amber-500" : "text-slate-400 hover:text-indigo-500"}`}
                >
                  {activeChat.mutedByMe ? "🔕" : "🔔"}
                </button>
              )}
              {scheduledMessages.length > 0 && (
                <button
                  onClick={() => setShowScheduledPanel((v) => !v)}
                  title="Pending scheduled messages"
                  className={`text-xs px-2.5 py-1 rounded-full font-semibold transition-colors whitespace-nowrap ${
                    showScheduledPanel ? "bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400" : "bg-slate-100 dark:bg-white/10 text-slate-400"
                  }`}
                >
                  🕒 {scheduledMessages.length}
                </button>
              )}
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

            {showScheduledPanel && scheduledMessages.length > 0 && (
              <div className="px-3 py-2 border-b border-black/5 dark:border-white/10 space-y-1.5 flex-shrink-0">
                {scheduledMessages.map((m) => (
                  <div key={m.id} className="flex items-center justify-between gap-2 text-xs bg-amber-50 dark:bg-amber-500/10 rounded-lg px-2.5 py-1.5">
                    <div className="min-w-0">
                      <p className="truncate text-slate-700 dark:text-slate-200">{stripHtmlForSearch(m.html) || "📷 Image"}</p>
                      <p className="text-[10px] text-amber-600 dark:text-amber-400">Sends {fmtDateTime(m.scheduledFor)}</p>
                    </div>
                    <button
                      onClick={() => cancelScheduledMessage(m.id)}
                      className="text-[10px] px-2 py-1 rounded-lg border border-red-300 dark:border-red-500/40 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 flex-shrink-0"
                    >
                      Cancel
                    </button>
                  </div>
                ))}
              </div>
            )}

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
                      <span className="truncate">{pm ? derivePreview(pm) || "Pinned message" : "Pinned message"}</span>
                    </button>
                  );
                })}
              </div>
            )}

            <div className="relative flex-1 min-h-0">
              {/* Floating "Today"/"Monday, 13 July" pill — WhatsApp-style,
                  always shows whichever day's messages are currently at the
                  top of the visible scroll area. pointer-events-none so it
                  never blocks clicking a message underneath it. */}
              {floatingDateLabel && (
                <div className="absolute top-2 left-0 right-0 z-10 flex justify-center pointer-events-none">
                  <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm px-3 py-1 rounded-full whitespace-nowrap shadow-md border border-black/5 dark:border-white/10">
                    {floatingDateLabel}
                  </span>
                </div>
              )}
              <div ref={messagesContainerRef} onScroll={handleMessagesScroll} className="h-full overflow-y-auto p-4 space-y-3">
                {loadingMessages ? (
                  <div className="flex-1 h-full flex items-center justify-center text-slate-400 gap-2 text-sm">
                    <span className="w-4 h-4 border-2 border-slate-300 dark:border-slate-600 border-t-indigo-500 rounded-full animate-spin" />
                    Loading messages…
                  </div>
                ) : (
                  messages.map((m, i) => {
                    const mine = m.senderId === user?.id;
                    const isGroup = activeChat?.type === "group";
                    const images = m.imageUrls || (m.imageUrl ? [m.imageUrl] : []);
                    const isPinned = activeChat?.pinnedMessageIds?.includes(m.id);
                    const canSummarize = stripHtmlForSearch(m.html).trim().split(/\s+/).filter(Boolean).length >= MIN_SUMMARIZE_WORDS;
                    const prevMsg = messages[i - 1];
                    const showDateDivider = !prevMsg || dayKey(m.createdAt) !== dayKey(prevMsg.createdAt);
                    return (
                      <Fragment key={m.id}>
                      {showDateDivider && (
                        // Plain in-flow marker of where the day changes —
                        // the actual "pinned while scrolling" effect is a
                        // separate floating pill (see updateFloatingDateLabel)
                        // computed from scroll position, not CSS `sticky`.
                        <div
                          ref={(el) => {
                            const label = fmtDateDivider(m.createdAt);
                            if (el) dateDividerRefs.current[dayKey(m.createdAt)] = { el, label };
                          }}
                          className="flex justify-center py-2"
                        >
                          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-white/10 px-3 py-1 rounded-full whitespace-nowrap shadow-sm">
                            {fmtDateDivider(m.createdAt)}
                          </span>
                        </div>
                      )}
                      <div
                        ref={(el) => { if (el) messageRefs.current[m.id] = el; }}
                        className={`group flex items-center gap-1.5 ${mine ? "justify-end" : "justify-start"}`}
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
                                  <div key={i} className="relative group/img">
                                    <img
                                      src={url}
                                      alt="attachment"
                                      onClick={() => setLightboxImage(url)}
                                      className="rounded-lg w-full object-cover max-h-48 cursor-zoom-in"
                                    />
                                    <button
                                      onClick={() => downloadImage(url)}
                                      title="Download image"
                                      className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center opacity-70 sm:opacity-0 sm:group-hover/img:opacity-100 transition-opacity text-xs"
                                    >
                                      ⬇
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}
                            {m.html && (
                              <RichTextView
                                html={linkifyHtml(highlightMentions(m.html, isGroup ? activeChat?.participantNames : null))}
                                className={mine ? "on-tint" : ""}
                              />
                            )}
                            <p className={`text-[10px] mt-1 flex items-center gap-1 ${mine ? "text-indigo-200" : "text-slate-400"}`}>
                              {isPinned && <span title="Pinned">📌</span>}
                              {/* Always IST regardless of the viewer's own device timezone —
                                  same convention as every other timestamp in the app
                                  (WorkBoard/Community reminders are all IST-scheduled). */}
                              {new Date(m.createdAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit", hour12: true, timeZone: "Asia/Kolkata" })}
                              {m.editedAt && " · edited"}
                              {mine && <MessageStatus m={m} isGroup={isGroup} />}
                            </p>
                          </div>
                          {m.reactions && Object.keys(m.reactions).length > 0 && (
                            <div className={`flex flex-wrap gap-1 mt-1 ${mine ? "justify-end" : "justify-start"}`}>
                              {Object.entries(m.reactions).map(([emoji, count]) => (
                                <ReactionChip
                                  key={emoji}
                                  emoji={emoji}
                                  count={count}
                                  mine={m.myReactions?.includes(emoji)}
                                  onClick={() => toggleReaction(m.id, emoji)}
                                  fetchReactors={async (e) => {
                                    const { data } = await api.get(`/admin-chat/${activeChatId}/messages/${m.id}/reactors`, { params: { emoji: e } });
                                    return data.map((u) => u.name);
                                  }}
                                />
                              ))}
                            </div>
                          )}
                          {reactionPickerFor === m.id && (
                            <div className={`flex items-center gap-1 mt-1 bg-white dark:bg-slate-800 border border-black/10 dark:border-white/10 rounded-full px-2 py-1 shadow-lg w-fit ${mine ? "self-end" : "self-start"}`}>
                              {REACTION_EMOJIS.map((emoji) => (
                                <button
                                  key={emoji}
                                  onClick={() => toggleReaction(m.id, emoji)}
                                  className="text-base hover:scale-125 transition-transform"
                                >
                                  {emoji}
                                </button>
                              ))}
                              <button onClick={() => setReactionPickerFor(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs ml-0.5">
                                ✕
                              </button>
                            </div>
                          )}
                          {summaryPopover?.messageId === m.id && (
                            <div className="mt-1 text-xs bg-violet-50 dark:bg-violet-500/10 border border-violet-200 dark:border-violet-500/20 rounded-xl px-3 py-2 space-y-1">
                              <div className="flex items-center justify-between gap-2">
                                <span className="font-semibold text-violet-600 dark:text-violet-300">🤖 Summary</span>
                                <button onClick={() => setSummaryPopover(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 leading-none">
                                  ✕
                                </button>
                              </div>
                              <p className="text-slate-600 dark:text-slate-300">{summaryPopover.text}</p>
                            </div>
                          )}
                        </div>
                        {/* Touch devices have no hover state — hover-only actions would be
                            permanently invisible on mobile, so they're always shown (dimmed)
                            below the sm: breakpoint and hover-revealed on larger screens. */}
                        <div className="opacity-60 sm:opacity-0 sm:group-hover:opacity-100 focus-within:opacity-100 flex items-center gap-1.5 transition-opacity flex-shrink-0">
                          {(m.html || m.imageUrls?.length > 0) && (
                            <button
                              onClick={() => copyMessage(m)}
                              title="Copy message"
                              className="text-slate-400 hover:text-indigo-500"
                            >
                              📋
                            </button>
                          )}
                          <button
                            onClick={() => setReactionPickerFor((cur) => (cur === m.id ? null : m.id))}
                            title="React"
                            className={reactionPickerFor === m.id ? "text-indigo-500" : "text-slate-400 hover:text-indigo-500"}
                          >
                            😊
                          </button>
                          <button
                            onClick={() => togglePin(m.id, isPinned)}
                            title={isPinned ? "Unpin" : "Pin"}
                            className={isPinned ? "text-amber-500" : "text-slate-400 hover:text-amber-500"}
                          >
                            📌
                          </button>
                          {canSummarize && (
                            <button
                              onClick={() => summarizeMessage(m.id)}
                              disabled={summarizingMessageId === m.id}
                              title="Summarize with AI"
                              className="text-slate-400 hover:text-violet-500 disabled:opacity-50"
                            >
                              {summarizingMessageId === m.id ? (
                                <span className="inline-block w-3 h-3 border-2 border-current/40 border-t-current rounded-full animate-spin" />
                              ) : (
                                "🤖"
                              )}
                            </button>
                          )}
                          {mine && m.canEdit && (
                            <button onClick={() => startEdit(m)} title="Edit message" className="text-slate-400 hover:text-indigo-500">
                              ✏️
                            </button>
                          )}
                        </div>
                      </div>
                      </Fragment>
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
                    onReady={handleComposerReady}
                    compact
                    spellCheck={false}
                  />
                </div>
                {activeChat?.type === "group" && (
                  <div ref={mentionPickerRef} className="relative">
                    <button
                      onClick={() => {
                        mentionStartIndexRef.current = null; // button-triggered: append-only, not tied to a typed "@"
                        setMentionQuery((q) => (showMentionPicker ? null : ""));
                        setShowMentionPicker((v) => !v);
                      }}
                      title="Mention someone"
                      className={`w-10 h-10 flex-shrink-0 rounded-full flex items-center justify-center transition-colors ${
                        showMentionPicker
                          ? "bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300"
                          : "bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/15"
                      }`}
                    >
                      @
                    </button>
                    {showMentionPicker && (
                      <div className="absolute bottom-12 right-0 w-56 max-h-56 overflow-y-auto glass-card p-2 space-y-0.5 z-10">
                        {Object.entries(activeChat.participantNames || {})
                          .filter(([id]) => id !== user?.id)
                          .filter(([, name]) => !mentionQuery || name.toLowerCase().includes(mentionQuery.toLowerCase())).length === 0 ? (
                          <p className="text-xs text-slate-400 text-center py-2">No matching members</p>
                        ) : (
                          Object.entries(activeChat.participantNames || {})
                            .filter(([id]) => id !== user?.id)
                            .filter(([, name]) => !mentionQuery || name.toLowerCase().includes(mentionQuery.toLowerCase()))
                            .map(([id, name]) => (
                              <button
                                key={id}
                                onClick={() => insertMention(name)}
                                className="w-full text-left text-sm px-2 py-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-white/5 truncate"
                              >
                                {name}
                              </button>
                            ))
                        )}
                      </div>
                    )}
                  </div>
                )}
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
                {!editingMessageId && (
                  <div className="relative">
                    <button
                      onClick={() => setScheduleOpen((v) => !v)}
                      disabled={isRichTextEmpty(composerHtml) && pendingImageUrls.length === 0}
                      title="Schedule for later"
                      className={`w-10 h-10 flex-shrink-0 rounded-full flex items-center justify-center transition-colors disabled:opacity-40 ${
                        scheduleOpen
                          ? "bg-amber-500 text-white"
                          : "bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/15"
                      }`}
                    >
                      🕒
                    </button>
                    {scheduleOpen && (
                      <div className="absolute bottom-full right-0 mb-2 w-64 bg-white dark:bg-slate-800 border border-black/10 dark:border-white/10 rounded-xl shadow-xl p-3 space-y-2 z-20">
                        <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">Send at…</p>
                        <input
                          type="datetime-local"
                          value={scheduledFor}
                          onChange={(e) => setScheduledFor(e.target.value)}
                          min={new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16)}
                          className="w-full text-sm px-2 py-1.5 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => setScheduleOpen(false)}
                            className="flex-1 text-xs py-1.5 rounded-lg border border-slate-200 dark:border-white/10 text-slate-500 hover:bg-slate-50 dark:hover:bg-white/5"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={scheduleMessage}
                            disabled={scheduling}
                            className="flex-1 text-xs py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-semibold disabled:opacity-50"
                          >
                            {scheduling ? "Scheduling…" : "Schedule"}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
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
                        <Avatar name={u.name} avatar={u.avatar} presence={computePresence(u.online, u.lastActiveAt)} size="w-8 h-8" />
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
                  autoComplete="new-password"
                  name="group-create-no-autofill"
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
                        <Avatar name={u.name} avatar={u.avatar} presence={computePresence(u.online, u.lastActiveAt)} size="w-8 h-8" />
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

      {/* Image lightbox */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setLightboxImage(null)}
            className="fixed inset-0 bg-black/90 z-[60] flex items-center justify-center p-4 cursor-zoom-out"
          >
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-lg"
              title="Close"
            >
              ✕
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); downloadImage(lightboxImage); }}
              className="absolute top-4 right-16 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
              title="Download image"
            >
              ⬇
            </button>
            <img
              src={lightboxImage}
              alt="attachment full size"
              onClick={(e) => e.stopPropagation()}
              className="max-w-full max-h-full object-contain rounded-lg cursor-default"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
