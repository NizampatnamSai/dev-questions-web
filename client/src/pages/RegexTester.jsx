import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

const FLAGS = [
  { key: "g", label: "g", title: "Global — find all matches" },
  { key: "i", label: "i", title: "Ignore case" },
  { key: "m", label: "m", title: "Multiline — ^ and $ match line boundaries" },
  { key: "s", label: "s", title: "Dotall — . matches newlines" },
  { key: "u", label: "u", title: "Unicode" },
  { key: "y", label: "y", title: "Sticky" },
];

const PRESETS = [
  { label: "Email", pattern: "[\\w.+-]+@[\\w-]+\\.[\\w.-]+" },
  { label: "URL", pattern: "https?:\\/\\/[\\w.-]+(?:\\.[\\w.-]+)+[\\w\\-._~:/?#[\\]@!$&'()*+,;=]*" },
  { label: "IPv4", pattern: "\\b(?:\\d{1,3}\\.){3}\\d{1,3}\\b" },
  { label: "Phone (US)", pattern: "\\(?\\d{3}\\)?[-.\\s]?\\d{3}[-.\\s]?\\d{4}" },
  { label: "Hex color", pattern: "#(?:[0-9a-fA-F]{3}){1,2}\\b" },
  { label: "Date (YYYY-MM-DD)", pattern: "\\d{4}-\\d{2}-\\d{2}" },
  { label: "Whitespace", pattern: "\\s+" },
  { label: "Integer", pattern: "-?\\d+" },
];

export default function RegexTester() {
  const [pattern, setPattern] = useState("[\\w.+-]+@[\\w-]+\\.[\\w.-]+");
  const [flags, setFlags] = useState({ g: true, i: false, m: false, s: false, u: false, y: false });
  const [testStr, setTestStr] = useState(
    "Reach us at support@devquiz.com or sales@devquiz.com for help.",
  );
  const [mode, setMode] = useState("match"); // match | replace
  const [replacement, setReplacement] = useState("[EMAIL]");

  const flagStr = useMemo(
    () => Object.entries(flags).filter(([, v]) => v).map(([k]) => k).join(""),
    [flags],
  );

  const { regex, error } = useMemo(() => {
    if (!pattern) return { regex: null, error: "" };
    try {
      return { regex: new RegExp(pattern, flagStr), error: "" };
    } catch (e) {
      return { regex: null, error: e.message };
    }
  }, [pattern, flagStr]);

  const matches = useMemo(() => {
    if (!regex || !testStr) return [];
    if (!flagStr.includes("g")) {
      const m = testStr.match(regex);
      return m ? [m] : [];
    }
    return [...testStr.matchAll(regex)];
  }, [regex, testStr, flagStr]);

  const replaced = useMemo(() => {
    if (!regex || mode !== "replace") return "";
    try {
      return testStr.replace(regex, replacement);
    } catch {
      return "";
    }
  }, [regex, testStr, replacement, mode]);

  const highlighted = useMemo(() => {
    if (!regex || !testStr || error) return [{ text: testStr, hit: false }];
    const parts = [];
    let lastIndex = 0;
    for (const m of matches) {
      if (m.index == null) continue;
      if (m.index > lastIndex) parts.push({ text: testStr.slice(lastIndex, m.index), hit: false });
      parts.push({ text: m[0], hit: true });
      lastIndex = m.index + (m[0].length || 1);
    }
    if (lastIndex < testStr.length) parts.push({ text: testStr.slice(lastIndex), hit: false });
    return parts.length ? parts : [{ text: testStr, hit: false }];
  }, [regex, testStr, matches, error]);

  const toggleFlag = (k) => setFlags((f) => ({ ...f, [k]: !f[k] }));

  const copy = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied");
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
          🧬 Regex Tester
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Test, debug, and preview matches for regular expressions in real time.
        </p>
      </div>

      {/* Presets */}
      <div className="flex flex-wrap gap-2">
        {PRESETS.map((p) => (
          <button
            key={p.label}
            onClick={() => setPattern(p.pattern)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/20 transition-colors"
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Pattern input */}
      <div className="glass-card p-4 space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-mono text-lg">/</span>
          <input
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            placeholder="Enter regex pattern…"
            spellCheck={false}
            className="flex-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/60 text-slate-700 dark:text-slate-200 font-mono text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <span className="text-slate-400 font-mono text-lg">/{flagStr}</span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {FLAGS.map((f) => (
            <button
              key={f.key}
              title={f.title}
              onClick={() => toggleFlag(f.key)}
              className={`w-8 h-8 rounded-lg text-xs font-mono font-bold transition-colors ${
                flags[f.key]
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/20"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {error && (
          <div className="text-xs text-red-500 bg-red-50 dark:bg-red-500/10 p-2.5 rounded-lg border border-red-200 dark:border-red-500/20 font-mono">
            ✗ {error}
          </div>
        )}
      </div>

      {/* Mode toggle */}
      <div className="flex gap-2">
        {[
          { key: "match", label: "🔍 Match" },
          { key: "replace", label: "🔁 Replace" },
        ].map((m) => (
          <button
            key={m.key}
            onClick={() => setMode(m.key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              mode === m.key
                ? "bg-indigo-600 text-white shadow"
                : "bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/20"
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Test string + highlight preview */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wide">
            Test String
          </label>
          <textarea
            value={testStr}
            onChange={(e) => setTestStr(e.target.value)}
            spellCheck={false}
            className="w-full h-40 p-4 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/60 text-slate-700 dark:text-slate-200 font-mono text-sm outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          />
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wide">
            Highlighted
          </label>
          <div className="w-full min-h-[6rem] p-4 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900/40 font-mono text-sm whitespace-pre-wrap break-words leading-relaxed">
            {highlighted.map((part, i) =>
              part.hit ? (
                <mark
                  key={i}
                  className="bg-amber-300/60 dark:bg-amber-400/30 text-slate-900 dark:text-amber-100 rounded px-0.5"
                >
                  {part.text}
                </mark>
              ) : (
                <span key={i}>{part.text}</span>
              ),
            )}
          </div>

          {mode === "replace" && (
            <>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wide">
                Replacement (use $1, $2… for groups)
              </label>
              <input
                value={replacement}
                onChange={(e) => setReplacement(e.target.value)}
                spellCheck={false}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/60 text-slate-700 dark:text-slate-200 font-mono text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wide">
                  Result
                </label>
                <button
                  onClick={() => copy(replaced)}
                  className="text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/20"
                >
                  📋 Copy
                </button>
              </div>
              <textarea
                value={replaced}
                readOnly
                spellCheck={false}
                className="w-full h-24 p-4 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900/40 text-slate-700 dark:text-slate-200 font-mono text-sm outline-none resize-none"
              />
            </>
          )}
        </div>

        {/* Match list */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wide">
              Matches ({matches.length})
            </label>
          </div>
          <div className="h-[26rem] overflow-y-auto rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/60 divide-y divide-slate-100 dark:divide-white/5">
            {matches.length === 0 ? (
              <div className="p-6 text-center text-sm text-slate-400">
                No matches yet
              </div>
            ) : (
              matches.map((m, i) => (
                <div key={i} className="p-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-semibold text-indigo-500">
                      "{m[0]}"
                    </span>
                    <span className="text-[10px] text-slate-400">
                      at index {m.index}
                    </span>
                  </div>
                  {m.length > 1 && (
                    <div className="mt-1.5 space-y-0.5">
                      {Array.from(m).slice(1).map((g, gi) => (
                        <div key={gi} className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                          Group {gi + 1}: {g === undefined ? <span className="italic">undefined</span> : `"${g}"`}
                        </div>
                      ))}
                    </div>
                  )}
                  {m.groups && Object.keys(m.groups).length > 0 && (
                    <div className="mt-1.5 space-y-0.5">
                      {Object.entries(m.groups).map(([name, val]) => (
                        <div key={name} className="text-xs text-emerald-600 dark:text-emerald-400 font-mono">
                          {name}: "{val}"
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
