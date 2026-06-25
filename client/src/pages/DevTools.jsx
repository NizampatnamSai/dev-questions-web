import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { motion, AnimatePresence } from "framer-motion";
import { STUDY_CATEGORIES, STUDY_TOPICS } from "../data/studyGuide";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
// ── Dev Tools Panel ──────────────────────────────────────────────────────────
const DEV_TOOLS = [
  {
    id: "ts",
    icon: "🔷",
    label: "TS Adder",
    desc: "Add TypeScript types to JS code",
    endpoint: "/study/ts-add",
    inputPlaceholder: "Paste JavaScript code here…",
    btnLabel: "Add TypeScript →",
    resultLabel: "TypeScript Output",
  },
  {
    id: "errors",
    icon: "🐛",
    label: "Error Finder",
    desc: "Find bugs and errors in any code",
    endpoint: "/study/find-errors",
    inputPlaceholder: "Paste any code snippet here…",
    btnLabel: "Find Errors →",
    resultLabel: "Errors Found",
  },
  {
    id: "breaks",
    icon: "💥",
    label: "Break Finder",
    desc: "Find code that could break at runtime",
    endpoint: "/study/find-breaks",
    inputPlaceholder: "Paste code to check for risk areas…",
    btnLabel: "Find Break Risks →",
    resultLabel: "Risk Report",
  },
  {
    id: "js",
    icon: "⚡",
    label: "JS Compiler",
    desc: "Run JavaScript code instantly in-browser",
    endpoint: null,
    inputPlaceholder: 'console.log("Hello World!");\n// Write any JavaScript…',
    btnLabel: "Run Code ▶",
    resultLabel: "Output",
  },
];
function DevTools() {
  const [searchParams] = useSearchParams();
  const toolParam = searchParams.get("tool");
  const [open, setOpen] = useState(!!toolParam);
  // const [tool, setTool] = useState(toolParam || "ts");
  const [code, setCode] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const tool = toolParam || "ts";
  const isMac =
    typeof navigator !== "undefined" &&
    /Mac|iPhone|iPad/.test(navigator.platform);
  const panelRef = useRef(null);

  useEffect(() => {
    if (toolParam) {
      setOpen(true);
      setTimeout(
        () =>
          panelRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          }),
        200,
      );
    }
  }, [toolParam]);

  const cur = DEV_TOOLS.find((t) => t.id === tool);

  function switchTool(id) {
    navigate(`?tool=${id}`, { replace: true });
    setCode("");
    setResult(null);
  }

  async function run() {
    if (!code.trim() || loading) return;
    if (cur.id === "js") {
      const logs = [];
      const origLog = console.log,
        origErr = console.error,
        origWarn = console.warn;
      try {
        console.log = (...a) =>
          logs.push(
            "📋 " +
              a
                .map((x) =>
                  typeof x === "object"
                    ? JSON.stringify(x, null, 2)
                    : String(x),
                )
                .join(" "),
          );
        console.error = (...a) => logs.push("❌ " + a.join(" "));
        console.warn = (...a) => logs.push("⚠️ " + a.join(" "));
        // new Function gives a fresh scope each run — avoids "already declared" errors
        const fn = new Function(code);
        const ret = fn();
        if (ret !== undefined)
          logs.push(
            "→ " +
              (typeof ret === "object"
                ? JSON.stringify(ret, null, 2)
                : String(ret)),
          );
        setResult({ ok: true, text: logs.join("\n") || "(no output)" });
      } catch (e) {
        setResult({ ok: false, text: String(e) });
      } finally {
        console.log = origLog;
        console.error = origErr;
        console.warn = origWarn;
      }
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const { data } = await api.post(cur.endpoint, { code });
      setResult({ ok: true, text: data.result });
    } catch {
      setResult({ ok: false, text: "AI unavailable. Please try again." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      ref={panelRef}
      className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/60 overflow-hidden"
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-slate-50 dark:hover:bg-slate-700/40 transition-colors"
      >
        <span className="text-xl">🛠️</span>
        <div className="flex-1">
          <p className="font-bold text-sm text-slate-800 dark:text-slate-100">
            Dev Tools
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            TS Adder · Error Finder · Break Finder · JS Compiler
          </p>
        </div>
        <span className="text-slate-400 text-xs">{open ? "▲" : "▼"}</span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-3 border-t border-slate-100 dark:border-slate-700 pt-3">
              {/* Tool tabs */}
              <div className="flex gap-1.5 flex-wrap">
                {DEV_TOOLS.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => switchTool(t.id)}
                    className={`text-xs px-3 py-1.5 rounded-full font-semibold transition-colors ${tool === t.id ? "bg-indigo-600 text-white" : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"}`}
                  >
                    {t.icon} {t.label}
                  </button>
                ))}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {cur.desc}
              </p>

              {/* Code input */}
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && e.metaKey && run()}
                placeholder={cur.inputPlaceholder}
                rows={8}
                className="w-full text-sm px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 resize-none font-mono"
              />

              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-400">
                    {isMac ? "⌘" : "Ctrl"} + Enter to run
                  </span>
                  {cur.id === "js" && (
                    <button
                      onClick={() => navigate("/js-compiler")}
                      className="text-xs px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-700 hover:bg-indigo-100 dark:hover:bg-indigo-800/60 transition-colors font-medium"
                    >
                      ↗ Full Compiler
                    </button>
                  )}
                </div>
                <button
                  onClick={run}
                  disabled={!code.trim() || loading}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white text-sm font-semibold rounded-xl transition-colors"
                >
                  {loading ? (
                    <>
                      <span className="animate-spin inline-block">⟳</span>{" "}
                      Processing…
                    </>
                  ) : (
                    cur.btnLabel
                  )}
                </button>
              </div>

              {/* Result */}
              <AnimatePresence>
                {result && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="rounded-xl overflow-hidden border border-slate-700"
                  >
                    {/* Terminal header bar */}
                    <div className="flex items-center justify-between px-4 py-2 bg-slate-800">
                      <div className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-full bg-red-500/80" />
                        <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
                        <span className="w-3 h-3 rounded-full bg-green-500/80" />
                        <span className="ml-2 text-[10px] text-slate-400 font-mono">
                          {cur.resultLabel}
                        </span>
                      </div>
                      {cur.id === "ts" && result.ok && (
                        <button
                          onClick={() =>
                            navigator.clipboard.writeText(result.text)
                          }
                          className="text-[10px] px-2 py-0.5 rounded bg-slate-700 hover:bg-slate-600 text-slate-300 transition-colors"
                        >
                          📋 Copy
                        </button>
                      )}
                    </div>
                    <pre
                      className={`text-xs p-4 overflow-x-auto whitespace-pre-wrap leading-relaxed font-mono bg-[#0d1117] ${result.ok ? "text-emerald-400" : "text-red-400"}`}
                    >
                      {result.text || "(no output)"}
                    </pre>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default DevTools;
