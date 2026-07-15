import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import api from "../api/axios";
import toast from "react-hot-toast";
import ConfirmModal from "../components/ConfirmModal";
import useConfirm from "../hooks/useConfirm";
import MermaidDiagram from "../components/MermaidDiagram";

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

const PROMPT_IMPROVER_SUGGESTIONS = [
  "Give me a prompt for ChatGPT to create a React website",
  "Write a prompt for Claude to review my resume",
  "Prompt for an AI to plan a 7-day trip itinerary",
  "Prompt for ChatGPT to write unit tests for my code",
  "Prompt for an AI to explain a topic like I'm 5",
  "Prompt for Claude to refactor messy code",
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

const markdownComponents = {
  code({ className, children, ...props }) {
    const langMatch = /language-(\w+)/.exec(className || "");
    // Fenced code blocks get a language- className from remark; plain inline `code` doesn't.
    if (langMatch) {
      return <CodeBlock code={String(children).replace(/\n$/, "")} lang={langMatch[1]} />;
    }
    return (
      <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-white/10 text-indigo-600 dark:text-cyan-300 text-[0.85em] font-mono" {...props}>
        {children}
      </code>
    );
  },
  // Fenced blocks render CodeBlock (a div) themselves — avoid nesting inside <pre>.
  pre({ children }) {
    return <>{children}</>;
  },
  p({ children }) {
    return <p className="mb-2 last:mb-0">{children}</p>;
  },
  strong({ children }) {
    return <strong className="font-semibold text-slate-800 dark:text-white">{children}</strong>;
  },
  ul({ children }) {
    return <ul className="list-disc pl-5 space-y-1 mb-2">{children}</ul>;
  },
  ol({ children }) {
    return <ol className="list-decimal pl-5 space-y-1 mb-2">{children}</ol>;
  },
  li({ children }) {
    return <li className="pl-1">{children}</li>;
  },
  a({ children, href }) {
    return <a href={href} target="_blank" rel="noopener noreferrer" className="text-indigo-500 dark:text-cyan-400 underline hover:no-underline">{children}</a>;
  },
  blockquote({ children }) {
    return <blockquote className="border-l-2 border-indigo-300 dark:border-cyan-500/50 pl-3 italic text-slate-500 dark:text-slate-400 my-2">{children}</blockquote>;
  },
  table({ children }) {
    return (
      <div className="overflow-x-auto my-2 rounded-lg border border-slate-200 dark:border-white/10">
        <table className="w-full text-xs border-collapse">{children}</table>
      </div>
    );
  },
  thead({ children }) {
    return <thead className="bg-slate-100 dark:bg-white/10">{children}</thead>;
  },
  th({ children }) {
    return <th className="px-3 py-2 text-left font-semibold text-slate-700 dark:text-slate-200 border-b border-slate-200 dark:border-white/10">{children}</th>;
  },
  td({ children }) {
    return <td className="px-3 py-2 border-b border-slate-100 dark:border-white/5 align-top">{children}</td>;
  },
  h1({ children }) { return <h3 className="text-base font-bold mt-3 mb-1.5 text-slate-800 dark:text-white">{children}</h3>; },
  h2({ children }) { return <h3 className="text-base font-bold mt-3 mb-1.5 text-slate-800 dark:text-white">{children}</h3>; },
  h3({ children }) { return <h4 className="text-sm font-bold mt-2 mb-1 text-slate-800 dark:text-white">{children}</h4>; },
  hr() { return <hr className="my-3 border-slate-200 dark:border-white/10" />; },
};

function AnswerBlock({ text }) {
  return (
    <div className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
        {text}
      </ReactMarkdown>
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

function HistoryItem({ chat, active, onSelect, onDelete, onRename }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(chat.title || "");
  const inputRef = useRef(null);

  const date = parseUTC(chat.updatedAt);
  const isToday = date.toDateString() === new Date().toDateString();
  const label = isToday
    ? date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : date.toLocaleDateString([], { month: "short", day: "numeric" });

  const startEdit = (e) => {
    e.stopPropagation();
    setDraft(chat.title || "");
    setEditing(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const commit = () => {
    setEditing(false);
    if (draft.trim() && draft.trim() !== chat.title) onRename(chat.id, draft.trim());
  };

  return (
    <div onClick={() => !editing && onSelect(chat)}
      onDoubleClick={onRename ? startEdit : undefined}
      className={`group relative flex items-start gap-2 px-3 py-2.5 rounded-xl cursor-pointer transition-all ${
        active
          ? "bg-indigo-50 dark:bg-indigo-500/15 border border-indigo-200 dark:border-indigo-500/30"
          : "hover:bg-slate-50 dark:hover:bg-white/5 border border-transparent"
      }`}
    >
      <span className="text-base flex-shrink-0 mt-0.5">💬</span>
      <div className="flex-1 min-w-0 pr-8">
        {editing ? (
          <input
            ref={inputRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => {
              if (e.key === "Enter") { e.preventDefault(); commit(); }
              if (e.key === "Escape") { e.preventDefault(); setEditing(false); }
            }}
            onBlur={commit}
            maxLength={100}
            className="w-full text-xs font-medium bg-white dark:bg-slate-800 border border-indigo-300 dark:border-indigo-500 rounded-lg px-1.5 py-0.5 outline-none text-slate-700 dark:text-slate-200"
          />
        ) : (
          <p className={`text-xs font-medium truncate leading-snug ${active ? "text-indigo-700 dark:text-indigo-300" : "text-slate-700 dark:text-slate-300"}`}>
            {chat.title || "Chat"}
          </p>
        )}
        <p className="text-[10px] text-slate-400 mt-0.5">{label} · {chat.messageCount || 0} msgs</p>
      </div>
      {!editing && (
        <div className="absolute right-2 top-2.5 opacity-0 group-hover:opacity-100 transition-all flex items-center gap-1.5">
          {onRename && (
            <button
              onClick={startEdit}
              className="text-slate-400 hover:text-indigo-500 text-[10px] leading-none"
              title="Rename"
            >✏️</button>
          )}
          <button
            onClick={e => { e.stopPropagation(); onDelete(chat.id); }}
            className="text-slate-400 hover:text-red-500 text-[10px] leading-none"
            title="Delete"
          >✕</button>
        </div>
      )}
    </div>
  );
}

// ─── Image mode ─────────────────────────────────────────────────────────────
// Self-contained: separate upload + preview + answer flow, not part of the
// saved-chat history/message-list architecture the other two modes share.
function ImageAskPanel() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const pickFile = (f) => {
    if (!f) return;
    if (!f.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    if (f.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB");
      return;
    }
    setFile(f);
    setAnswer("");
    setPreviewUrl(URL.createObjectURL(f));
  };

  const clearImage = () => {
    setFile(null);
    setAnswer("");
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const ask = async () => {
    if (!file) {
      toast.error("Choose an image first");
      return;
    }
    setLoading(true);
    setAnswer("");
    try {
      const form = new FormData();
      form.append("image", file);
      form.append("question", question.trim());
      const { data } = await api.post("/ai/ask-image", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setAnswer(data.answer);
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to analyze image");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto px-1">
      <div className="max-w-2xl mx-auto space-y-4 py-4">
        {!previewUrl ? (
          <label className="flex flex-col items-center justify-center gap-3 border-2 border-dashed border-slate-300 dark:border-white/15 rounded-2xl py-16 cursor-pointer hover:border-indigo-400 dark:hover:border-indigo-400 transition-colors">
            <span className="text-4xl">🖼️</span>
            <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">
              Click to upload an image
            </span>
            <span className="text-xs text-slate-400">PNG, JPG, WEBP — up to 5MB</span>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => pickFile(e.target.files?.[0])}
            />
          </label>
        ) : (
          <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10">
            <img src={previewUrl} alt="Selected" className="w-full max-h-96 object-contain bg-slate-50 dark:bg-slate-900" />
            <button
              onClick={clearImage}
              className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-colors"
              title="Remove image"
            >
              ✕
            </button>
          </div>
        )}

        <div className="flex gap-2 items-end">
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), ask())}
            rows={1}
            placeholder="Ask about this image (optional)…"
            className="flex-1 min-w-0 resize-none text-sm px-4 py-3 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 outline-none focus:border-indigo-400 dark:focus:border-cyan-400 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 placeholder:truncate max-h-32 overflow-y-auto"
            style={{ fieldSizing: "content" }}
          />
          <button
            onClick={ask}
            disabled={!file || loading}
            className={`w-11 h-11 flex-shrink-0 flex items-center justify-center rounded-full transition-colors disabled:cursor-not-allowed ${
              file && !loading
                ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm"
                : "bg-slate-100 dark:bg-white/10 text-slate-400 dark:text-slate-500"
            }`}
          >
            {loading
              ? <span className="w-4 h-4 border-2 border-current/40 border-t-current rounded-full animate-spin" />
              : <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7"/></svg>}
          </button>
        </div>

        {answer && (
          <div className="glass-card p-4 text-sm text-slate-700 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">
            {answer}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Create (text-to-image) mode ───────────────────────────────────────────────
// Free via Pollinations.ai (no key, no cost) — Groq has no image-generation
// model. Self-contained, like the Image (understanding) mode above.
function CreateImagePanel() {
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [usage, setUsage] = useState(null);

  const loadUsage = () => {
    api.get("/ai/generate-image/usage").then(({ data }) => setUsage(data)).catch(() => {});
  };
  useEffect(() => { loadUsage(); }, []);

  const generate = async () => {
    const p = prompt.trim();
    if (!p) {
      toast.error("Describe what you want to generate");
      return;
    }
    setLoading(true);
    setImage(null);
    try {
      const { data } = await api.post("/ai/generate-image", { prompt: p });
      setImage(data.image);
      loadUsage();
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to generate image");
    } finally {
      setLoading(false);
    }
  };

  const download = () => {
    const a = document.createElement("a");
    a.href = image;
    a.download = "devquiz-generated.jpg";
    a.click();
  };

  return (
    <div className="flex-1 overflow-y-auto px-1">
      <div className="max-w-2xl mx-auto space-y-4 py-4">
        {usage && (
          <p className="text-xs text-slate-400 text-center">
            {usage.remaining} of {usage.limit} image generations left today
          </p>
        )}

        <div className="flex gap-2 items-center">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), generate())}
            rows={1}
            placeholder="Describe an image to generate…"
            className="flex-1 min-w-0 resize-none text-sm px-4 py-3 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 outline-none focus:border-indigo-400 dark:focus:border-cyan-400 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 max-h-32 overflow-y-auto"
            style={{ fieldSizing: "content" }}
          />
          <button
            onClick={generate}
            disabled={!prompt.trim() || loading || usage?.remaining === 0}
            className={`w-11 h-11 flex-shrink-0 flex items-center justify-center rounded-full transition-colors disabled:cursor-not-allowed ${
              prompt.trim() && !loading && usage?.remaining !== 0
                ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm"
                : "bg-slate-100 dark:bg-white/10 text-slate-400 dark:text-slate-500"
            }`}
          >
            {loading
              ? <span className="w-4 h-4 border-2 border-current/40 border-t-current rounded-full animate-spin" />
              : <span className="text-lg">🎨</span>}
          </button>
        </div>

        {loading && (
          <div className="glass-card p-12 flex flex-col items-center justify-center gap-3 text-slate-400">
            <span className="w-6 h-6 border-2 border-slate-300 dark:border-slate-600 border-t-indigo-500 rounded-full animate-spin" />
            <span className="text-sm">Generating…</span>
          </div>
        )}

        {image && !loading && (
          <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10">
            <img src={image} alt={prompt} className="w-full" />
            <button
              onClick={download}
              className="absolute top-2 right-2 px-3 py-1.5 rounded-lg bg-black/60 hover:bg-black/80 text-white text-xs font-semibold transition-colors"
            >
              ⬇ Download
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Diagram mode ───────────────────────────────────────────────────────────
// Describe a project/system structure in plain English, AI turns it into a
// Mermaid flowchart definition, rendered client-side as an actual diagram —
// same self-contained shape as the Create (text-to-image) mode above.
const DIAGRAM_SUGGESTIONS = [
  "MERN stack project with a Jira-like task board",
  "Microservices architecture with an API gateway and message queue",
  "React app folder structure with Redux",
  "CI/CD pipeline from git push to production deploy",
];

function DiagramPanel() {
  const [description, setDescription] = useState("");
  const [mermaidCode, setMermaidCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  useEffect(() => {
    if (!previewOpen) return;
    const handler = (e) => e.key === "Escape" && setPreviewOpen(false);
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [previewOpen]);

  const generate = async (desc) => {
    const d = (desc ?? description).trim();
    if (!d) {
      toast.error("Describe the project/system structure to diagram");
      return;
    }
    setLoading(true);
    setMermaidCode("");
    try {
      const { data } = await api.post("/ai/diagram", { description: d });
      setMermaidCode(data.mermaid);
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to generate diagram");
    } finally {
      setLoading(false);
    }
  };

  const copyMermaid = async () => {
    try {
      await navigator.clipboard.writeText(mermaidCode);
      toast.success("Mermaid code copied");
    } catch {
      toast.error("Couldn't copy");
    }
  };

  return (
    <div className="flex-1 overflow-y-auto px-1">
      <div className="max-w-2xl mx-auto space-y-4 py-4">
        <div className="flex gap-2 items-center">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), generate())}
            rows={1}
            placeholder="Describe a project structure to diagram… e.g. MERN stack project with Jira-like task board"
            className="flex-1 min-w-0 resize-none text-sm px-4 py-3 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 outline-none focus:border-indigo-400 dark:focus:border-cyan-400 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 max-h-32 overflow-y-auto"
            style={{ fieldSizing: "content" }}
          />
          <button
            onClick={() => generate()}
            disabled={!description.trim() || loading}
            className={`w-11 h-11 flex-shrink-0 flex items-center justify-center rounded-full transition-colors disabled:cursor-not-allowed ${
              description.trim() && !loading
                ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm"
                : "bg-slate-100 dark:bg-white/10 text-slate-400 dark:text-slate-500"
            }`}
          >
            {loading
              ? <span className="w-4 h-4 border-2 border-current/40 border-t-current rounded-full animate-spin" />
              : <span className="text-lg">📐</span>}
          </button>
        </div>

        {!mermaidCode && !loading && (
          <div className="flex flex-wrap gap-2">
            {DIAGRAM_SUGGESTIONS.map((s, i) => (
              <button
                key={i}
                onClick={() => { setDescription(s); generate(s); }}
                className="text-xs px-3 py-1.5 rounded-full bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/20 transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {loading && (
          <div className="glass-card p-12 flex flex-col items-center justify-center gap-3 text-slate-400">
            <span className="w-6 h-6 border-2 border-slate-300 dark:border-slate-600 border-t-indigo-500 rounded-full animate-spin" />
            <span className="text-sm">Drawing the diagram…</span>
          </div>
        )}

        {mermaidCode && !loading && (
          <div className="glass-card p-4 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs text-slate-400">Generated diagram</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setPreviewOpen(true)}
                  className="text-xs text-indigo-500 hover:text-indigo-600 transition-colors"
                >
                  🔍 View full
                </button>
                <button
                  onClick={copyMermaid}
                  className="text-xs text-indigo-500 hover:text-indigo-600 transition-colors"
                >
                  📋 Copy diagram code
                </button>
              </div>
            </div>
            <MermaidDiagram code={mermaidCode} />
          </div>
        )}
      </div>

      {/* Fullscreen diagram preview — same lightbox pattern Messages uses for images */}
      <AnimatePresence>
        {previewOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setPreviewOpen(false)}
            className="fixed inset-0 bg-black/90 z-[60] flex items-center justify-center p-4 cursor-zoom-out"
          >
            <button
              onClick={() => setPreviewOpen(false)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-lg"
              title="Close"
            >
              ✕
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); copyMermaid(); }}
              className="absolute top-4 right-16 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
              title="Copy diagram code"
            >
              📋
            </button>
            <div
              onClick={(e) => e.stopPropagation()}
              className="max-w-full max-h-full overflow-auto bg-white dark:bg-slate-900 rounded-xl p-6 cursor-default"
            >
              <MermaidDiagram code={mermaidCode} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const MAX_HUMANIZE_WORDS = 1000;

function HumanizeAIPanel() {
  const [text, setText] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const overLimit = wordCount > MAX_HUMANIZE_WORDS;

  const humanize = async () => {
    const t = text.trim();
    if (!t) {
      toast.error("Paste some AI-generated text first");
      return;
    }
    if (overLimit) {
      toast.error(`Too long — max ${MAX_HUMANIZE_WORDS} words`);
      return;
    }
    setLoading(true);
    setResult("");
    try {
      const { data } = await api.post("/ai/humanize", { text: t });
      setResult(data.result);
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to humanize text");
    } finally {
      setLoading(false);
    }
  };

  const copy = () => {
    navigator.clipboard.writeText(result);
    toast.success("Copied!");
  };

  return (
    <div className="flex-1 overflow-y-auto px-1">
      <div className="max-w-2xl mx-auto space-y-4 py-4">
        <div className="space-y-1.5">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={8}
            placeholder="Paste an AI-generated response here — I'll rewrite it to sound more natural and human, same meaning, less robotic."
            className="w-full resize-y text-sm px-4 py-3 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 outline-none focus:border-indigo-400 dark:focus:border-cyan-400 text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
          />
          <p className={`text-xs text-right ${overLimit ? "text-red-500 font-semibold" : "text-slate-400"}`}>
            {wordCount} / {MAX_HUMANIZE_WORDS} words
          </p>
        </div>

        <button
          onClick={humanize}
          disabled={!text.trim() || loading || overLimit}
          className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              Humanizing…
            </>
          ) : (
            "🧑 Humanize"
          )}
        </button>

        {result && (
          <div className="glass-card p-4 space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Result</p>
              <button
                onClick={copy}
                className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/20 transition-colors"
              >
                📋 Copy
              </button>
            </div>
            <p className="text-sm text-slate-700 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">{result}</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function AskAI() {
  const { confirm, confirmProps } = useConfirm();
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [activeChatId, setActiveChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [autoSave, setAutoSave] = useState(() => localStorage.getItem("devquiz_ai_autosave") === "true");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mode, setMode] = useState("chat"); // "chat" | "promptImprover" | "image" | "create" | "humanize" | "diagram"
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  // Keep a ref so the auto-save inside async send() always sees the latest chatId
  const activeChatIdRef = useRef(null);

  // Load history on mount
  useEffect(() => {
    api.get("/ai/history").then(({ data }) => setHistory(data)).catch(() => {}).finally(() => setHistoryLoading(false));
  }, []);

  // Auto-scroll when the user sends a message (so they see it + the typing indicator),
  // but NOT when the AI's answer lands — for a long answer that yanks the view straight
  // past it to the bottom, which is disorienting. Reading starts at the top of the reply.
  useEffect(() => {
    const last = messages[messages.length - 1];
    if (last?.role !== "ai") {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading]);

  // Keep ref in sync
  useEffect(() => { activeChatIdRef.current = activeChatId; }, [activeChatId]);

  const toggleAutoSave = () => {
    setAutoSave(prev => {
      const next = !prev;
      localStorage.setItem("devquiz_ai_autosave", String(next));
      toast(next ? "🔄 Auto-save ON" : "Auto-save OFF", { icon: next ? "✅" : "⏸️" });
      return next;
    });
  };

  const startNewChat = () => {
    setActiveChatId(null);
    activeChatIdRef.current = null;
    setMessages([]);
    setInput("");
    setIsSaved(false);
    setSidebarOpen(false);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const openChat = async (chat) => {
    setActiveChatId(chat.id);
    activeChatIdRef.current = chat.id;  // set ref immediately — don't rely on useEffect timing
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

  const renameChat = async (id, title) => {
    const trimmed = title.trim();
    if (!trimmed) return;
    try {
      await api.patch(`/ai/history/${id}/title`, { title: trimmed });
      setHistory(h => h.map(c => (c.id === id ? { ...c, title: trimmed } : c)));
    } catch { toast.error("Failed to rename"); }
  };

  const deleteAll = () => {
    confirm({
      title: "Delete all saved chats?",
      message: "This cannot be undone.",
      confirmLabel: "Clear all",
      onConfirm: async () => {
        try {
          await api.delete("/ai/history");
          setHistory([]);
          startNewChat();
          toast.success("All history cleared");
        } catch { toast.error("Failed"); }
      },
    });
  };

  // Export all saved chats as a single JSON file
  const exportAll = () => {
    if (!history.length) { toast.error("No saved chats to export"); return; }
    const json = JSON.stringify(history, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `devquiz-ai-chats-${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Exported all chats!");
  };

  const saveChat = async (msgsOverride, chatIdOverride, silent = false) => {
    const msgsToSave = msgsOverride ?? messages;
    const chatIdToUse = chatIdOverride ?? activeChatId;
    if (!msgsToSave.length) return;
    if (!silent) setSaving(true);
    try {
      const payload = { messages: msgsToSave, chat_id: chatIdToUse || "" };
      const { data } = await api.post("/ai/history", payload);
      const newId = data.id || chatIdToUse;
      setActiveChatId(newId);
      activeChatIdRef.current = newId;
      setIsSaved(true);
      const { data: hist } = await api.get("/ai/history");
      setHistory(hist);
      if (!silent) toast.success("Saved to history!");
    } catch { if (!silent) toast.error("Failed to save"); }
    finally { if (!silent) setSaving(false); }
  };

  const send = async (text) => {
    const q = (text || input).trim();
    if (!q || loading) return;
    setInput("");
    setIsSaved(false);
    const updatedMsgs = [...messages, { role: "user", text: q }];
    setMessages(updatedMsgs);
    setLoading(true);
    try {
      // Prompt Improver mode: don't answer the request — write a clean,
      // detailed prompt the user can paste into ChatGPT/Claude/etc to get it
      // done there. Wrapped client-side so it reuses the same /ai/ask
      // endpoint and Groq call as regular chat, no backend change needed.
      const question = mode === "promptImprover"
        ? `You are a prompt engineering expert. The user wants a well-written prompt to give another AI assistant (like ChatGPT or Claude) for this goal: "${q}"\n\nWrite ONE clear, detailed, well-structured prompt they can copy and paste directly into that AI to get a great result — include relevant context, constraints, and desired output format where it helps. Return ONLY the prompt itself, no explanation, no meta-commentary, no surrounding quotes.`
        : q;
      const { data } = await api.post("/ai/ask", { question });
      const finalMsgs = [...updatedMsgs, { role: "ai", text: data.answer }];
      setMessages(finalMsgs);
      // Auto-save if enabled — use ref so we always have the latest chatId
      if (autoSave) {
        await saveChat(finalMsgs, activeChatIdRef.current, true);
      }
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
    <>
    <div className="flex-1 min-h-0 flex gap-4">

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
          onRename={renameChat}
          onDeleteAll={deleteAll}
          onExportAll={exportAll}
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
              onRename={renameChat}
              onDeleteAll={deleteAll}
              onExportAll={exportAll}
              onClose={() => setSidebarOpen(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Chat panel ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="mb-4 flex-shrink-0 flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400 transition-colors flex-shrink-0"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12h18M3 6h18M3 18h18"/>
              </svg>
            </button>
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 truncate">🤖 Ask AI</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 hidden sm:block">
                {mode === "promptImprover"
                  ? "Describe what you want, get back a well-written prompt to paste into ChatGPT, Claude, or any other AI."
                  : mode === "image"
                  ? "Upload an image — get an explanation, a description, or the text extracted from it."
                  : mode === "create"
                  ? "Describe an image and generate it — free, with a daily limit."
                  : mode === "humanize"
                  ? "Paste AI-generated text and get back a more natural, human-sounding rewrite."
                  : mode === "diagram"
                  ? "Describe a project/system structure — get back an actual diagram of it."
                  : "Ask anything — Python internals, how Claude works, JS concepts…"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap sm:ml-auto">
          <div className="flex-shrink-0 flex items-center gap-0.5 rounded-lg bg-slate-100 dark:bg-white/10 p-1 overflow-x-auto max-w-full">
            <button
              onClick={() => setMode("chat")}
              className={`flex-shrink-0 text-xs px-2.5 py-1.5 rounded-md font-semibold transition-colors ${mode === "chat" ? "bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm" : "text-slate-500 dark:text-slate-400"}`}
            >
              💬 <span className="hidden sm:inline">Chat</span>
            </button>
            <button
              onClick={() => setMode("promptImprover")}
              title="Turn a rough idea into a clean, detailed prompt for ChatGPT/Claude/etc"
              className={`flex-shrink-0 text-xs px-2.5 py-1.5 rounded-md font-semibold transition-colors ${mode === "promptImprover" ? "bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm" : "text-slate-500 dark:text-slate-400"}`}
            >
              ✨ <span className="hidden sm:inline">Prompt Improver</span>
            </button>
            <button
              onClick={() => setMode("image")}
              title="Upload an image — explain it, describe it, or extract text from it"
              className={`flex-shrink-0 text-xs px-2.5 py-1.5 rounded-md font-semibold transition-colors ${mode === "image" ? "bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm" : "text-slate-500 dark:text-slate-400"}`}
            >
              🖼️ <span className="hidden sm:inline">Image</span>
            </button>
            <button
              onClick={() => setMode("create")}
              title="Generate an image from a text description"
              className={`flex-shrink-0 text-xs px-2.5 py-1.5 rounded-md font-semibold transition-colors ${mode === "create" ? "bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm" : "text-slate-500 dark:text-slate-400"}`}
            >
              🎨 <span className="hidden sm:inline">Create</span>
            </button>
            <button
              onClick={() => setMode("humanize")}
              title="Rewrite AI-generated text to sound more natural and human"
              className={`flex-shrink-0 text-xs px-2.5 py-1.5 rounded-md font-semibold transition-colors ${mode === "humanize" ? "bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm" : "text-slate-500 dark:text-slate-400"}`}
            >
              🧑 <span className="hidden sm:inline">Humanize</span>
            </button>
            <button
              onClick={() => setMode("diagram")}
              title="Describe a project structure — get back an actual diagram"
              className={`flex-shrink-0 text-xs px-2.5 py-1.5 rounded-md font-semibold transition-colors ${mode === "diagram" ? "bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm" : "text-slate-500 dark:text-slate-400"}`}
            >
              📐 <span className="hidden sm:inline">Diagram</span>
            </button>
          </div>
          {!isEmpty && mode !== "image" && mode !== "create" && mode !== "humanize" && mode !== "diagram" && (
            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Auto-save toggle */}
              <button
                onClick={toggleAutoSave}
                title={autoSave ? "Auto-save ON — click to disable" : "Auto-save OFF — click to enable"}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  autoSave
                    ? "bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-500/30"
                    : "bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/15"
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${autoSave ? "bg-indigo-500 animate-pulse" : "bg-slate-400"}`} />
                {autoSave ? "Auto-save" : "Auto-save"}
              </button>

              {/* Manual save — only when not auto-saving and has unsaved changes */}
              {!autoSave && !isSaved && (
                <button
                  onClick={() => saveChat()}
                  disabled={saving}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-semibold hover:bg-emerald-200 dark:hover:bg-emerald-500/30 disabled:opacity-50 transition-colors"
                >
                  {saving ? <span className="w-3 h-3 border-2 border-emerald-400/40 border-t-emerald-400 rounded-full animate-spin" /> : "💾"}
                  {saving ? "Saving…" : "Save Chat"}
                </button>
              )}
              {!autoSave && isSaved && (
                <span className="text-[11px] text-emerald-500 dark:text-emerald-400 font-medium flex items-center gap-1">✅ Saved</span>
              )}

              {/* Delete current chat — only if it's saved */}
              {activeChatId && (
                <button
                  onClick={() => deleteChat(activeChatId)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 text-xs font-medium hover:bg-red-200 dark:hover:bg-red-500/30 transition-colors"
                  title="Delete this chat"
                >
                  🗑
                </button>
              )}

            </div>
          )}
          </div>
        </div>

        {mode === "image" ? (
          <ImageAskPanel />
        ) : mode === "create" ? (
          <CreateImagePanel />
        ) : mode === "humanize" ? (
          <HumanizeAIPanel />
        ) : mode === "diagram" ? (
          <DiagramPanel />
        ) : isEmpty ? (
          /* ── Hero / welcome state — centered, big pill composer ── */
          <div className="flex-1 flex flex-col items-center justify-center px-4">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-2xl space-y-6 text-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold gradient-text">
                  {mode === "promptImprover" ? "✨ Turn your idea into a great prompt" : "🤖 Ask me anything"}
                </h2>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">
                  {mode === "promptImprover"
                    ? "Describe what you want in plain words — get back a clear, detailed prompt to paste into ChatGPT, Claude, or any other AI."
                    : "Python internals, how Claude works, JS concepts — whatever you're curious about."}
                </p>
              </div>

              <div className="flex gap-2 items-center">
                <div className="relative flex-1">
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={handleKey}
                    rows={1}
                    placeholder={mode === "promptImprover" ? "e.g. Give me a prompt for ChatGPT to create a React website… (Enter to send)" : "Ask anything… (Enter to send, Shift+Enter for new line)"}
                    className="w-full resize-none text-sm pl-5 pr-10 py-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 outline-none focus:border-indigo-400 dark:focus:border-cyan-400 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 text-left max-h-32 overflow-y-auto shadow-sm"
                    style={{ fieldSizing: "content" }}
                    autoFocus
                  />
                  {input && (
                    <button
                      onClick={() => { setInput(""); inputRef.current?.focus(); }}
                      title="Clear"
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
                    >
                      ✕
                    </button>
                  )}
                </div>
                <button
                  onClick={() => send()}
                  disabled={!input.trim() || loading}
                  className={`w-11 h-11 flex-shrink-0 flex items-center justify-center rounded-full transition-colors disabled:cursor-not-allowed ${
                    input.trim() && !loading
                      ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm"
                      : "bg-slate-100 dark:bg-white/10 text-slate-400 dark:text-slate-500"
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7"/></svg>
                </button>
              </div>

              <div className="flex flex-wrap justify-center gap-2">
                {(mode === "promptImprover" ? PROMPT_IMPROVER_SUGGESTIONS : SUGGESTIONS).map((s, i) => (
                  <button key={i} onClick={() => send(s)}
                    className="text-xs px-3.5 py-2 rounded-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 hover:border-indigo-200 dark:hover:border-indigo-500/30 hover:text-indigo-600 dark:hover:text-cyan-300 transition-all">
                    {s}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        ) : (
          <>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto space-y-4 pb-4 pr-1">
              <AnimatePresence initial={false}>
                {messages.map((msg, i) => <Message key={i} msg={msg} />)}
              </AnimatePresence>
              {loading && <TypingIndicator />}
              <div ref={bottomRef} />
            </div>

            {/* Input bar */}
            <div className="flex-shrink-0 pt-3 border-t border-black/5 dark:border-white/10">
              <div className="flex gap-2 items-end">
                <div className="relative flex-1">
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={handleKey}
                    rows={1}
                    placeholder={mode === "promptImprover" ? "Describe what you want a prompt for… (Enter to send)" : "Ask anything… (Enter to send, Shift+Enter for new line)"}
                    className="w-full resize-none text-sm pl-4 pr-9 py-3 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 outline-none focus:border-indigo-400 dark:focus:border-cyan-400 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 max-h-32 overflow-y-auto"
                    style={{ fieldSizing: "content" }}
                  />
                  {input && (
                    <button
                      onClick={() => { setInput(""); inputRef.current?.focus(); }}
                      title="Clear"
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
                    >
                      ✕
                    </button>
                  )}
                </div>
                <button
                  onClick={() => send()}
                  disabled={!input.trim() || loading}
                  className={`w-10 h-10 self-end flex-shrink-0 flex items-center justify-center rounded-full transition-colors disabled:cursor-not-allowed ${
                    input.trim() && !loading
                      ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm"
                      : "bg-slate-100 dark:bg-white/10 text-slate-400 dark:text-slate-500"
                  }`}
                >
                  {loading
                    ? <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
                    : <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7"/></svg>
                  }
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
    <ConfirmModal {...confirmProps} />
    </>
  );
}

// ─── Sidebar content (shared desktop + mobile) ────────────────────────────────
function SidebarContent({ grouped, activeChatId, historyLoading, onNew, onSelect, onDelete, onRename, onDeleteAll, onExportAll, onClose }) {
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
                  onSelect={onSelect} onDelete={onDelete} onRename={onRename} />
              ))}
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      {hasAny && (
        <div className="p-3 border-t border-slate-200 dark:border-white/10 flex-shrink-0 space-y-1">
          <button onClick={onExportAll} className="w-full text-xs text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-300 transition-colors py-1">
            📥 Export all as JSON
          </button>
          <button onClick={onDeleteAll} className="w-full text-xs text-slate-400 hover:text-red-500 transition-colors py-1">
            🗑 Clear all
          </button>
        </div>
      )}
    </>
  );
}
