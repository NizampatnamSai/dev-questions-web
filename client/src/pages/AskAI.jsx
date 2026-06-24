import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api/axios";
import toast from "react-hot-toast";

const SUGGESTIONS = [
  "Explain how Python works internally",
  "What is Claude AI and how does it work?",
  "How does the JavaScript event loop work?",
  "Explain React's reconciliation algorithm",
  "What is a closure in JavaScript?",
  "How does garbage collection work in V8?",
  "Explain REST vs GraphQL vs gRPC",
  "What is Docker and how does containerization work?",
  "How does HTTPS / TLS encryption work?",
  "Explain async/await vs Promises vs callbacks",
];

// ─── Code block ───────────────────────────────────────────────────────────────
function CodeBlock({ code, lang }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true); toast.success("Copied!");
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <div className="relative my-2 rounded-xl overflow-hidden border border-white/10">
      <div className="flex items-center justify-between px-4 py-1.5 bg-slate-800 text-xs text-slate-400">
        <span>{lang || "code"}</span>
        <button onClick={copy} className="flex items-center gap-1.5 hover:text-white transition-colors">
          {copied ? "✅ Copied" : "📋 Copy"}
        </button>
      </div>
      <pre className="bg-slate-900 text-slate-100 text-xs p-4 overflow-x-auto whitespace-pre-wrap break-words">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function AnswerBlock({ text }) {
  const parts = [];
  const codeRegex = /```(\w*)\n?([\s\S]*?)```/g;
  let last = 0, match;
  while ((match = codeRegex.exec(text)) !== null) {
    if (match.index > last) parts.push({ type: "text", content: text.slice(last, match.index) });
    parts.push({ type: "code", lang: match[1], content: match[2].trim() });
    last = match.index + match[0].length;
  }
  if (last < text.length) parts.push({ type: "text", content: text.slice(last) });

  return (
    <div className="space-y-1 text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
      {parts.map((part, pi) =>
        part.type === "code" ? (
          <CodeBlock key={pi} code={part.content} lang={part.lang} />
        ) : (
          <div key={pi} className="space-y-1">
            {part.content.split("\n").map((line, i) => {
              if (!line.trim()) return <div key={i} className="h-1" />;
              if (/^\d+\.\s/.test(line)) return (
                <div key={i} className="flex gap-2">
                  <span className="text-indigo-500 dark:text-cyan-400 font-semibold flex-shrink-0 w-5">{line.match(/^\d+/)[0]}.</span>
                  <span>{line.replace(/^\d+\.\s/, "")}</span>
                </div>
              );
              if (/^[-•*]\s/.test(line)) return (
                <div key={i} className="flex gap-2">
                  <span className="text-indigo-400 dark:text-cyan-500 flex-shrink-0 mt-0.5">•</span>
                  <span>{line.replace(/^[-•*]\s/, "")}</span>
                </div>
              );
              if (/^\*\*.*\*\*/.test(line)) return (
                <p key={i} className="font-semibold text-slate-800 dark:text-white">{line.replace(/\*\*/g, "")}</p>
              );
              return <p key={i}>{line}</p>;
            })}
          </div>
        )
      )}
    </div>
  );
}

function Message({ msg }) {
  const isUser = msg.role === "user";
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(msg.text).then(() => {
      setCopied(true); toast.success("Copied!");
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""}`}
    >
      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0 mt-0.5 ${
        isUser ? "bg-indigo-500 text-white" : "bg-gradient-to-br from-cyan-400 to-purple-500 text-white"
      }`}>
        {isUser ? "👤" : "🤖"}
      </div>
      <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${
        isUser
          ? "bg-indigo-500 text-white text-sm rounded-tr-sm"
          : "bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-tl-sm"
      }`}>
        {isUser
          ? <p className="text-sm leading-relaxed">{msg.text}</p>
          : <>
              <AnswerBlock text={msg.text} />
              <button onClick={copy} className="mt-2 flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200 transition-colors">
                {copied ? "✅ Copied" : "📋 Copy response"}
              </button>
            </>
        }
      </div>
    </motion.div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex gap-3">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center text-sm flex-shrink-0">🤖</div>
      <div className="bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5">
        {[0, 1, 2].map(i => (
          <motion.div key={i} className="w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-500"
            animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }} />
        ))}
      </div>
    </div>
  );
}

// ─── History item ─────────────────────────────────────────────────────────────
function parseUTC(str) {
  if (!str) return new Date();
  // Normalize "+00:00" or missing Z to proper UTC so browsers parse consistently
  const s = str.replace("+00:00", "Z").replace(/(\.\d+)?$/, (m) => m || "Z");
  const d = new Date(s.endsWith("Z") ? s : s + "Z");
  return isNaN(d) ? new Date(str) : d;
}

function HistoryItem({ chat, active, onSelect, onDelete }) {
  const date = parseUTC(chat.updatedAt);
  const isToday = date.toDateString() === new Date().toDateString();
  const label = isToday
    ? date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : date.toLocaleDateString([], { month: "short", day: "numeric" });

  return (
    <div onClick={() => onSelect(chat)}
      className={`group relative flex items-start gap-2 px-3 py-2.5 rounded-xl cursor-pointer transition-all ${
        active
          ? "bg-indigo-50 dark:bg-indigo-500/15 border border-indigo-200 dark:border-indigo-500/30"
          : "hover:bg-slate-50 dark:hover:bg-white/5 border border-transparent"
      }`}
    >
      <span className="text-base flex-shrink-0 mt-0.5">💬</span>
      <div className="flex-1 min-w-0 pr-4">
        <p className={`text-xs font-medium truncate leading-snug ${active ? "text-indigo-700 dark:text-indigo-300" : "text-slate-700 dark:text-slate-300"}`}>
          {chat.title || "Chat"}
        </p>
        <p className="text-[10px] text-slate-400 mt-0.5">{label} · {chat.messageCount || 0} msgs</p>
      </div>
      <button
        onClick={e => { e.stopPropagation(); onDelete(chat.id); }}
        className="absolute right-2 top-2.5 opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-all text-[10px] leading-none"
        title="Delete"
      >✕</button>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function AskAI() {
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [activeChatId, setActiveChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);       // current chat already saved
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  // Load history on mount
  useEffect(() => {
    api.get("/ai/history").then(({ data }) => setHistory(data)).catch(() => {}).finally(() => setHistoryLoading(false));
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const startNewChat = () => {
    setActiveChatId(null);
    setMessages([]);
    setInput("");
    setIsSaved(false);
    setSidebarOpen(false);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const openChat = async (chat) => {
    setActiveChatId(chat.id);
    setMessages([]);        // clear first to show loading
    setIsSaved(true);
    setSidebarOpen(false);
    try {
      const { data } = await api.get(`/ai/history/${chat.id}`);
      setMessages(data.messages || []);
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    } catch {
      toast.error("Failed to load chat");
      setActiveChatId(null);
    }
  };

  const deleteChat = async (id) => {
    try {
      await api.delete(`/ai/history/${id}`);
      setHistory(h => h.filter(c => c.id !== id));
      if (activeChatId === id) startNewChat();
      toast.success("Deleted");
    } catch { toast.error("Failed to delete"); }
  };

  const deleteAll = async () => {
    if (!window.confirm("Delete all saved chats?")) return;
    try {
      await api.delete("/ai/history");
      setHistory([]);
      startNewChat();
      toast.success("All history cleared");
    } catch { toast.error("Failed"); }
  };

  const saveChat = async () => {
    if (!messages.length) return;
    setSaving(true);
    try {
      const payload = { messages, chat_id: activeChatId || "" };
      const { data } = await api.post("/ai/history", payload);
      const newId = data.id || activeChatId;
      setActiveChatId(newId);
      setIsSaved(true);
      // Refresh history list
      const { data: hist } = await api.get("/ai/history");
      setHistory(hist);
      toast.success("Saved to history!");
    } catch { toast.error("Failed to save"); }
    finally { setSaving(false); }
  };

  const send = async (text) => {
    const q = (text || input).trim();
    if (!q || loading) return;
    setInput("");
    setIsSaved(false); // unsaved after new message
    const updatedMsgs = [...messages, { role: "user", text: q }];
    setMessages(updatedMsgs);
    setLoading(true);
    try {
      const { data } = await api.post("/ai/ask", { question: q });
      setMessages([...updatedMsgs, { role: "ai", text: data.answer }]);
    } catch (err) {
      const msg = err.response?.data?.detail || "AI failed to respond. Try again.";
      setMessages([...updatedMsgs, { role: "ai", text: `⚠️ ${msg}` }]);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  };

  const isEmpty = messages.length === 0;

  // Group by date
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  const grouped = history.reduce((acc, chat) => {
    const d = parseUTC(chat.updatedAt).toDateString();
    const label = d === today ? "Today" : d === yesterday ? "Yesterday"
      : parseUTC(chat.updatedAt).toLocaleDateString([], { month: "short", day: "numeric" });
    (acc[label] = acc[label] || []).push(chat);
    return acc;
  }, {});

  // ── Layout: sidebar + chat side by side ───────────────────────────────────
  return (
    <div className="flex gap-4" style={{ height: "calc(100vh - 10rem)" }}>

      {/* ── Sidebar ── */}
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar panel — always in flow on desktop, off-canvas on mobile */}
      <div className={`
        hidden md:flex flex-col w-56 flex-shrink-0
        border-r border-slate-200 dark:border-white/10
        pr-3
      `}>
        <SidebarContent
          grouped={grouped}
          activeChatId={activeChatId}
          historyLoading={historyLoading}
          onNew={startNewChat}
          onSelect={openChat}
          onDelete={deleteChat}
          onDeleteAll={deleteAll}
        />
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ x: -260 }} animate={{ x: 0 }} exit={{ x: -260 }}
            transition={{ type: "tween", duration: 0.22 }}
            className="fixed top-0 left-0 h-full w-64 z-50 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-white/10 flex flex-col shadow-xl"
          >
            <SidebarContent
              grouped={grouped}
              activeChatId={activeChatId}
              historyLoading={historyLoading}
              onNew={startNewChat}
              onSelect={openChat}
              onDelete={deleteChat}
              onDeleteAll={deleteAll}
              onClose={() => setSidebarOpen(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Chat panel ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="mb-4 flex-shrink-0 flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400 transition-colors flex-shrink-0"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12h18M3 6h18M3 18h18"/>
            </svg>
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">🤖 Ask AI</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 hidden sm:block">Ask anything — Python internals, how Claude works, JS concepts…</p>
          </div>
          {!isEmpty && (
            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Save button — only show when chat has unsaved changes */}
              {!isSaved && (
                <button
                  onClick={saveChat}
                  disabled={saving}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-semibold hover:bg-emerald-200 dark:hover:bg-emerald-500/30 disabled:opacity-50 transition-colors"
                >
                  {saving
                    ? <span className="w-3 h-3 border-2 border-emerald-400/40 border-t-emerald-400 rounded-full animate-spin" />
                    : "💾"
                  }
                  {saving ? "Saving…" : "Save Chat"}
                </button>
              )}
              {isSaved && (
                <span className="text-[11px] text-emerald-500 dark:text-emerald-400 font-medium flex items-center gap-1">✅ Saved</span>
              )}
              <button
                onClick={startNewChat}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 text-xs font-medium hover:bg-slate-200 dark:hover:bg-white/15 transition-colors"
              >
                ✏️ New
              </button>
            </div>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 pb-4 pr-1">
          {isEmpty && !loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 pt-4">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest text-center">Try asking…</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {SUGGESTIONS.map((s, i) => (
                  <button key={i} onClick={() => send(s)}
                    className="text-left text-sm px-4 py-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 hover:border-indigo-200 dark:hover:border-indigo-500/30 hover:text-indigo-600 dark:hover:text-cyan-300 transition-all">
                    {s}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          <AnimatePresence initial={false}>
            {messages.map((msg, i) => <Message key={i} msg={msg} />)}
          </AnimatePresence>
          {loading && <TypingIndicator />}
          <div ref={bottomRef} />
        </div>

        {/* Input bar */}
        <div className="flex-shrink-0 pt-3 border-t border-black/5 dark:border-white/10">
          <div className="flex gap-2 items-end">
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              rows={1}
              placeholder="Ask anything… (Enter to send, Shift+Enter for new line)"
              className="flex-1 resize-none text-sm px-4 py-3 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 outline-none focus:border-indigo-400 dark:focus:border-cyan-400 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 max-h-32 overflow-y-auto"
              style={{ fieldSizing: "content" }}
            />
            <button
              onClick={() => send()}
              disabled={!input.trim() || loading}
              className="p-3 rounded-2xl bg-indigo-500 hover:bg-indigo-600 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex-shrink-0"
            >
              {loading
                ? <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
                : <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7"/></svg>
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Sidebar content (shared desktop + mobile) ────────────────────────────────
function SidebarContent({ grouped, activeChatId, historyLoading, onNew, onSelect, onDelete, onDeleteAll, onClose }) {
  const hasAny = Object.keys(grouped).length > 0;
  return (
    <>
      {/* Header */}
      <div className="p-3 flex-shrink-0 flex items-center gap-2">
        {onClose && (
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 text-slate-400 transition-colors text-sm">✕</button>
        )}
        <button
          onClick={onNew}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-colors"
        >
          ✏️ New Chat
        </button>
      </div>

      <p className="px-3 pb-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider flex-shrink-0">History</p>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-2 space-y-3">
        {historyLoading ? (
          <div className="space-y-2 p-2">
            {[1,2,3].map(i => <div key={i} className="h-10 rounded-xl bg-slate-100 dark:bg-white/5 animate-pulse" />)}
          </div>
        ) : !hasAny ? (
          <p className="text-xs text-slate-400 text-center mt-6 px-3 leading-relaxed">
            No saved chats yet.<br />Ask something and tap <strong>💾 Save Chat</strong>.
          </p>
        ) : (
          Object.entries(grouped).map(([label, items]) => (
            <div key={label}>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-2 mb-1">{label}</p>
              {items.map(chat => (
                <HistoryItem key={chat.id} chat={chat} active={activeChatId === chat.id}
                  onSelect={onSelect} onDelete={onDelete} />
              ))}
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      {hasAny && (
        <div className="p-3 border-t border-slate-200 dark:border-white/10 flex-shrink-0">
          <button onClick={onDeleteAll} className="w-full text-xs text-slate-400 hover:text-red-500 transition-colors py-1">
            🗑 Clear all
          </button>
        </div>
      )}
    </>
  );
}
