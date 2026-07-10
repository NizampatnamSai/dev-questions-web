import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import toast from "react-hot-toast";

// Maps our own language ids (used across Dev Life for filters/badges) to the
// closest id Prism actually ships a grammar for.
const LANG_ALIAS = {
  text: "plaintext",
  csharp: "csharp",
  cpp: "cpp",
};

export default function CodeCard({ code, language = "javascript", title, maxHeight, className = "" }) {
  const copy = () => {
    navigator.clipboard.writeText(code || "");
    toast.success("Copied");
  };

  return (
    <div className={`rounded-xl overflow-hidden border border-slate-800 bg-[#1e1e1e] ${className}`}>
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#2d2d2d]">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="w-3 h-3 rounded-full bg-[#ff5f56] flex-shrink-0" />
          <span className="w-3 h-3 rounded-full bg-[#ffbd2e] flex-shrink-0" />
          <span className="w-3 h-3 rounded-full bg-[#27c93f] flex-shrink-0" />
          {title && (
            <span className="ml-3 text-[11px] text-slate-400 font-mono truncate">{title}</span>
          )}
        </div>
        <button
          onClick={copy}
          className="text-[10px] px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-slate-300 transition-colors flex-shrink-0"
        >
          📋 Copy
        </button>
      </div>
      <div style={{ overflowX: "auto", ...(maxHeight ? { maxHeight, overflowY: "hidden" } : {}) }}>
        <SyntaxHighlighter
          language={LANG_ALIAS[language] || language}
          style={vscDarkPlus}
          customStyle={{ margin: 0, padding: "1rem", background: "transparent", fontSize: "0.8rem", overflow: "visible" }}
          wrapLongLines={false}
        >
          {code || ""}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}
