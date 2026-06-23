import { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

export default function JsonParser() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [mode, setMode] = useState("format"); // format, minify, validate

  const parse = () => {
    setError("");
    setOutput("");
    if (!input.trim()) {
      toast.error("Please enter JSON");
      return;
    }

    try {
      const parsed = JSON.parse(input);

      if (mode === "validate") {
        setOutput("✓ Valid JSON");
        toast.success("Valid JSON");
      } else if (mode === "minify") {
        setOutput(JSON.stringify(parsed));
        toast.success("Minified");
      } else {
        setOutput(JSON.stringify(parsed, null, 2));
        toast.success("Formatted");
      }
    } catch (err) {
      setError(err.message);
      toast.error("Invalid JSON: " + err.message);
    }
  };

  const copyToClipboard = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    toast.success("Copied to clipboard");
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setInput(text);
      toast.success("Pasted from clipboard");
    } catch {
      toast.error("Unable to read clipboard");
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">🔍 JSON Parser & Formatter</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Validate, format, and minify JSON instantly.
        </p>
      </div>

      {/* Mode selector */}
      <div className="flex gap-2 flex-wrap sm:flex-nowrap">
        {[
          { key: "format", label: "📐 Format", desc: "Pretty print JSON" },
          { key: "minify", label: "🗜️ Minify", desc: "Remove whitespace" },
          { key: "validate", label: "✓ Validate", desc: "Check validity" },
        ].map(m => (
          <button
            key={m.key}
            onClick={() => setMode(m.key)}
            title={m.desc}
            className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              mode === m.key
                ? "bg-indigo-600 text-white shadow-lg"
                : "bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/20"
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Editor area */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">Input</label>
            <button
              onClick={handlePaste}
              className="text-xs px-2 py-1 rounded bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-slate-400 hover:bg-slate-300 dark:hover:bg-white/20"
            >
              📋 Paste
            </button>
          </div>
          <textarea
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setError("");
            }}
            placeholder={"{\n  \"key\": \"value\"\n}"}
            className="w-full h-64 sm:h-80 p-4 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-slate-700 dark:text-slate-200 font-mono text-sm outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          />
          {error && (
            <div className="text-xs text-red-500 bg-red-50 dark:bg-red-500/10 p-3 rounded-lg border border-red-200 dark:border-red-500/20">
              <p className="font-semibold mb-1">Error:</p>
              <p>{error}</p>
            </div>
          )}
        </div>

        {/* Output */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">Output</label>
            <button
              onClick={copyToClipboard}
              disabled={!output}
              className="text-xs px-2 py-1 rounded bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-slate-400 hover:bg-slate-300 dark:hover:bg-white/20 disabled:opacity-50"
            >
              📋 Copy
            </button>
          </div>
          <textarea
            value={output}
            readOnly
            placeholder="Output will appear here"
            className="w-full h-64 sm:h-80 p-4 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-700 dark:text-slate-200 font-mono text-sm outline-none resize-none"
          />
        </div>
      </div>

      {/* Parse button */}
      <button
        onClick={parse}
        className="w-full md:w-auto px-8 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-500 transition-colors"
      >
        ⚡ Parse
      </button>

      {/* Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card p-4 rounded-xl">
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1">📐 Format</p>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Pretty-print and properly indent your JSON for better readability.
          </p>
        </div>
        <div className="glass-card p-4 rounded-xl">
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1">🗜️ Minify</p>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Remove all whitespace and newlines to reduce file size.
          </p>
        </div>
        <div className="glass-card p-4 rounded-xl">
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1">✓ Validate</p>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Check if your JSON is valid and get detailed error messages.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
