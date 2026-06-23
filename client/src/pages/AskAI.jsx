import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api/axios";

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

function AnswerBlock({ text }) {
  const lines = text.split("\n");
  return (
    <div className="space-y-2 text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
      {lines.map((line, i) => {
        if (!line.trim()) return <div key={i} className="h-1" />;
        // Numbered list item
        if (/^\d+\.\s/.test(line)) {
          return (
            <div key={i} className="flex gap-2">
              <span className="text-indigo-500 dark:text-cyan-400 font-semibold flex-shrink-0 w-5">{line.match(/^\d+/)[0]}.</span>
              <span>{line.replace(/^\d+\.\s/, "")}</span>
            </div>
          );
        }
        // Bullet
        if (/^[-•*]\s/.test(line)) {
          return (
            <div key={i} className="flex gap-2">
              <span className="text-indigo-400 dark:text-cyan-500 flex-shrink-0 mt-0.5">•</span>
              <span>{line.replace(/^[-•*]\s/, "")}</span>
            </div>
          );
        }
        // Bold heading (markdown **text**)
        if (/^\*\*.*\*\*/.test(line)) {
          return <p key={i} className="font-semibold text-slate-800 dark:text-white">{line.replace(/\*\*/g, "")}</p>;
        }
        return <p key={i}>{line}</p>;
      })}
    </div>
  );
}

function Message({ msg }) {
  const isUser = msg.role === "user";
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""}`}
    >
      {/* Avatar */}
      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0 mt-0.5 ${
        isUser
          ? "bg-indigo-500 text-white"
          : "bg-gradient-to-br from-cyan-400 to-purple-500 text-white"
      }`}>
        {isUser ? "👤" : "🤖"}
      </div>

      {/* Bubble */}
      <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${
        isUser
          ? "bg-indigo-500 text-white text-sm rounded-tr-sm"
          : "bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-tl-sm"
      }`}>
        {isUser
          ? <p className="text-sm leading-relaxed">{msg.text}</p>
          : <AnswerBlock text={msg.text} />
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
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-500"
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
          />
        ))}
      </div>
    </div>
  );
}

export default function AskAI() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = async (text) => {
    const q = (text || input).trim();
    if (!q || loading) return;
    setInput("");
    setMessages(m => [...m, { role: "user", text: q }]);
    setLoading(true);
    try {
      const { data } = await api.post("/ai/ask", { question: q });
      setMessages(m => [...m, { role: "ai", text: data.answer }]);
    } catch (err) {
      const msg = err.response?.data?.detail || "AI failed to respond. Try again.";
      setMessages(m => [...m, { role: "ai", text: `⚠️ ${msg}` }]);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  };

  const isEmpty = messages.length === 0;

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] md:h-[calc(100vh-6rem)] max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-4 flex-shrink-0">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">🤖 Ask AI</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Ask anything — Python internals, how Claude works, JS concepts, system design…</p>
      </div>

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto space-y-4 pb-4 pr-1">
        {isEmpty && !loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 pt-4">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest text-center">Try asking…</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {SUGGESTIONS.map((s, i) => (
                <button
                  key={i}
                  onClick={() => send(s)}
                  className="text-left text-sm px-4 py-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 hover:border-indigo-200 dark:hover:border-indigo-500/30 hover:text-indigo-600 dark:hover:text-cyan-300 transition-all"
                >
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
        {messages.length > 0 && (
          <button
            onClick={() => setMessages([])}
            className="mt-2 text-[11px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
          >
            Clear conversation
          </button>
        )}
      </div>
    </div>
  );
}
