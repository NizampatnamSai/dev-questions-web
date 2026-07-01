import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

// ─── Tree View ────────────────────────────────────────────────────────────────
function ValueChip({ value }) {
  const t = typeof value;
  if (value === null)
    return <span className="text-slate-400 italic">null</span>;
  if (t === "boolean")
    return (
      <span className={value ? "text-green-500" : "text-red-400"}>
        {String(value)}
      </span>
    );
  if (t === "number") return <span className="text-amber-500">{value}</span>;
  if (t === "string")
    return <span className="text-emerald-500">"{value}"</span>;
  return null;
}

function TreeNode({ k, value, depth = 0 }) {
  const [open, setOpen] = useState(depth < 2);
  const isObj = value !== null && typeof value === "object";
  const isArr = Array.isArray(value);
  const childCount = isObj ? Object.keys(value).length : 0;

  const indent = depth * 16;

  if (!isObj) {
    return (
      <div
        className="flex items-center gap-1.5 py-0.5 text-sm"
        style={{ paddingLeft: indent + 8 }}
      >
        {k !== undefined && (
          <span className="text-indigo-400 dark:text-indigo-300 font-medium">
            {k}
          </span>
        )}
        {k !== undefined && <span className="text-slate-400">:</span>}
        <ValueChip value={value} />
      </div>
    );
  }

  const bracket = isArr ? ["[", "]"] : ["{", "}"];
  const entries = isArr ? value.map((v, i) => [i, v]) : Object.entries(value);

  return (
    <div style={{ paddingLeft: indent }}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 py-0.5 text-sm w-full text-left hover:bg-black/5 dark:hover:bg-white/5 rounded px-1 transition-colors group"
      >
        <span className="text-slate-400 w-3 flex-shrink-0 select-none">
          {open ? "▾" : "▸"}
        </span>
        {k !== undefined && (
          <span className="text-indigo-400 dark:text-indigo-300 font-medium">
            {k}
          </span>
        )}
        {k !== undefined && <span className="text-slate-400">:</span>}
        <span className="text-slate-500">{bracket[0]}</span>
        {!open && (
          <>
            <span className="text-slate-400 text-xs">
              {childCount} {isArr ? "items" : "keys"}
            </span>
            <span className="text-slate-500">{bracket[1]}</span>
          </>
        )}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="overflow-hidden border-l border-slate-200 dark:border-white/10 ml-3"
          >
            {entries.map(([ek, ev]) => (
              <TreeNode key={String(ek)} k={ek} value={ev} depth={depth + 1} />
            ))}
            <div
              className="py-0.5 text-sm text-slate-500"
              style={{ paddingLeft: 8 }}
            >
              {bracket[1]}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function JsonParser() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [parsed, setParsed] = useState(null);
  const [error, setError] = useState("");
  const [mode, setMode] = useState("format"); // format | minify | validate
  const [view, setView] = useState("text"); // text | tree

  function parseJsonFragment(text) {
    let wrapped = `{${text.trim()}}`;

    // Remove commas before closing } or ]
    while (wrapped !== (wrapped = wrapped.replace(/,\s*([}\]])/g, "$1"))) {}

    return JSON.parse(wrapped);
  }

  // function parseJsObject(text) {
  //   let js = text;

  //   js = js.replace(/([{,]\s*)([a-zA-Z_$][\w$]*)\s*:/g, '$1"$2":');

  //   js = js.replace(/'/g, '"');

  //   return JSON.parse(js);
  // }

  function looksLikeJsonFragment(text) {
    const t = text.trim();

    return (
      t.startsWith('"') &&
      t.includes('":') &&
      (t.includes("{") || t.includes("[") || t.includes(","))
    );
  }

  function smartValue(value) {
    value = value.trim();

    // quoted string
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      return value.slice(1, -1);
    }

    if (value === "true") return true;
    if (value === "false") return false;
    if (value === "null") return null;

    if (/^-?\d+(\.\d+)?$/.test(value)) {
      return Number(value);
    }

    // JSON / Arrays
    if (
      (value.startsWith("{") && value.endsWith("}")) ||
      (value.startsWith("[") && value.endsWith("]"))
    ) {
      try {
        return JSON.parse(value);
      } catch {}
    }

    return value;
  }

  function parseQueryString(text) {
    const params = new URLSearchParams(text);

    const obj = {};

    for (const [key, value] of params.entries()) {
      obj[key] = smartValue(value);
    }

    if (!Object.keys(obj).length) {
      throw new Error("Not query params");
    }

    return obj;
  }

  function parsePairs(text) {
    const lines = text
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);

    const obj = {};

    let i = 0;

    while (i < lines.length) {
      // Format:
      // key
      // :
      // value
      if (lines[i + 1] === ":") {
        obj[lines[i]] = smartValue(lines[i + 2]);

        i += 3;
        continue;
      }

      // Format:
      // key: value
      if (lines[i].includes(":")) {
        const idx = lines[i].indexOf(":");

        const key = lines[i].slice(0, idx).trim();
        const value = lines[i].slice(idx + 1).trim();

        obj[key] = smartValue(value);

        i++;
        continue;
      }

      // Format:
      // key
      // value
      if (i + 1 < lines.length) {
        obj[lines[i]] = smartValue(lines[i + 1]);

        i += 2;
        continue;
      }

      throw new Error("Unsupported format");
    }

    return obj;
  }

  const parseInput = (text) => {
    text = text.trim();

    // Valid JSON
    if (text.startsWith("{") || text.startsWith("[")) {
      return JSON.parse(text);
    }

    // JSON body copied from DevTools
    if (looksLikeJsonFragment(text)) {
      return parseJsonFragment(text);
    }

    if (text.includes("=")) {
      return parseQueryString(text);
    }

    return parsePairs(text);
    // try {
    //   return parseJsObject(text);
    // } catch {}

    throw new Error("Unsupported input format");
  };

  const runParse = useCallback(
    (raw = input, m = mode) => {
      setError("");
      setOutput("");
      setParsed(null);
      if (!raw.trim()) {
        toast.error("Enter JSON first");
        return;
      }
      try {
        const obj = parseInput(raw);
        setParsed(obj);
        if (m === "validate") {
          setOutput("✓ Valid JSON");
          toast.success("Valid JSON");
        } else if (m === "minify") {
          setOutput(JSON.stringify(obj));
          toast.success("Minified");
        } else {
          setOutput(JSON.stringify(obj, null, 2));
          toast.success("Formatted");
        }
      } catch (e) {
        setError(e.message);
        toast.error("Invalid JSON");
      }
    },
    [input, mode],
  );

  const handleModeChange = (m) => {
    setMode(m);
    if (parsed) runParse(input, m);
  };

  const loadSample = () => {
    const sample = JSON.stringify(
      {
        id: 1,
        name: "DevQuiz",
        active: true,
        score: 9.5,
        tags: ["react", "javascript"],
        meta: null,
        user: { email: "user@example.com", role: "admin" },
      },
      null,
      2,
    );
    setInput(sample);
    runParse(sample, mode);
  };

  const paste = async () => {
    try {
      const t = await navigator.clipboard.readText();
      setInput(t);
      toast.success("Pasted");
    } catch {
      toast.error("Cannot read clipboard");
    }
  };

  const copy = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied");
  };

  const keyCount =
    parsed !== null && typeof parsed === "object" && parsed !== null
      ? Object.keys(parsed).length
      : null;
  const charCount = output.length;

  const clearAll = () => {
    setInput("");
    setOutput("");
    setParsed(null);
    setError("");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
          🔍 JSON Parser & Formatter
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Validate, format, minify, and explore JSON as an interactive tree.
        </p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 items-center">
        {[
          { key: "format", label: "📐 Format" },
          { key: "minify", label: "🗜️ Minify" },
          { key: "validate", label: "✓ Validate" },
        ].map((m) => (
          <button
            key={m.key}
            onClick={() => handleModeChange(m.key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              mode === m.key
                ? "bg-indigo-600 text-white shadow"
                : "bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/20"
            }`}
          >
            {m.label}
          </button>
        ))}
        <div className="ml-auto flex gap-2">
          <button
            onClick={clearAll}
            className="px-3 py-1.5 rounded-lg text-xs
    bg-red-50
    dark:bg-red-500/10
    text-red-500
    hover:bg-red-100
    dark:hover:bg-red-500/20"
          >
            🗑 Clear
          </button>
          <button
            onClick={loadSample}
            className="px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/20 transition-colors"
          >
            Sample
          </button>
          <button
            onClick={paste}
            className="px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/20 transition-colors"
          >
            📋 Paste
          </button>
        </div>
      </div>

      {/* Main layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wide">
              Input JSON
            </label>
          </div>
          <textarea
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setError("");
            }}
            onKeyDown={(e) => {
              if ((e.metaKey || e.ctrlKey) && e.key === "Enter") runParse();
            }}
            placeholder={'{\n  "key": "value"\n}'}
            spellCheck={false}
            className="w-full h-72 p-4 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/60 text-slate-700 dark:text-slate-200 font-mono text-sm outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          />
          {error && (
            <div className="text-xs text-red-500 bg-red-50 dark:bg-red-500/10 p-3 rounded-xl border border-red-200 dark:border-red-500/20 font-mono">
              ✗ {error}
            </div>
          )}
          <button
            onClick={() => runParse()}
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-colors"
          >
            ⚡ Parse <span className="opacity-50 text-xs ml-1">⌘↵</span>
          </button>
        </div>

        {/* Output */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex gap-2 items-center">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wide">
                Output
              </label>
              {parsed !== null && (
                <div className="flex gap-1">
                  {["text", "tree"].map((v) => (
                    <button
                      key={v}
                      onClick={() => setView(v)}
                      className={`px-2 py-0.5 rounded text-[10px] font-medium transition-colors ${
                        view === v
                          ? "bg-indigo-600 text-white"
                          : "bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-400"
                      }`}
                    >
                      {v === "text" ? "📄 Text" : "🌲 Tree"}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {output && (
              <div className="flex gap-2 items-center">
                {keyCount !== null && (
                  <span className="text-[10px] text-slate-400">
                    {keyCount} keys
                  </span>
                )}
                <span className="text-[10px] text-slate-400">
                  {charCount} chars
                </span>
                <button
                  onClick={() =>
                    copy(
                      parsed !== null
                        ? JSON.stringify(parsed, null, 2)
                        : output,
                    )
                  }
                  className="text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/20"
                >
                  📋 Copy
                </button>
              </div>
            )}
          </div>

          {parsed !== null && view === "tree" ? (
            <div className="h-72 overflow-auto rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/60 p-3 font-mono text-xs">
              <TreeNode value={parsed} depth={0} />
            </div>
          ) : (
            <textarea
              value={output}
              readOnly
              placeholder="Output will appear here…"
              spellCheck={false}
              className="w-full h-72 p-4 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900/40 text-slate-700 dark:text-slate-200 font-mono text-sm outline-none resize-none"
            />
          )}

          {/* Stats row when parsed */}
          {parsed !== null && (
            <div className="grid grid-cols-3 gap-2">
              {[
                {
                  label: "Type",
                  val: Array.isArray(parsed)
                    ? "Array"
                    : typeof parsed === "object" && parsed
                      ? "Object"
                      : typeof parsed,
                },
                { label: "Size", val: JSON.stringify(parsed).length + " B" },
                {
                  label: "Depth",
                  val: (() => {
                    const d = (v, n = 0) =>
                      v && typeof v === "object"
                        ? Math.max(...Object.values(v).map((c) => d(c, n + 1)))
                        : n;
                    return d(parsed);
                  })(),
                },
              ].map((s) => (
                <div key={s.label} className="glass-card px-3 py-2 text-center">
                  <p className="text-[10px] text-slate-400 uppercase tracking-wide">
                    {s.label}
                  </p>
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-200 mt-0.5">
                    {s.val}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
