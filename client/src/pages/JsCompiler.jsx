import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const EXAMPLES = [
  {
    label: "Array methods",
    code: `const nums = [1, 2, 3, 4, 5];

const doubled  = nums.map(n => n * 2);
const evens    = nums.filter(n => n % 2 === 0);
const sum      = nums.reduce((acc, n) => acc + n, 0);

console.log("Original:", nums);
console.log("Doubled:", doubled);
console.log("Evens:", evens);
console.log("Sum:", sum);`,
  },
  {
    label: "Async / Await",
    code: `async function fetchData() {
  return new Promise(resolve =>
    setTimeout(() => resolve({ user: "John", score: 95 }), 500)
  );
}

async function main() {
  console.log("Fetching...");
  const data = await fetchData();
  console.log("Got:", data);
  console.log("Score:", data.score);
}

main();`,
  },
  {
    label: "Classes",
    code: `class Animal {
  constructor(name, sound) {
    this.name = name;
    this.sound = sound;
  }
  speak() {
    return \`\${this.name} says \${this.sound}!\`;
  }
}

class Dog extends Animal {
  constructor(name) {
    super(name, "Woof");
  }
  fetch(item) {
    return \`\${this.name} fetches the \${item}!\`;
  }
}

const dog = new Dog("Rex");
console.log(dog.speak());
console.log(dog.fetch("ball"));`,
  },
  {
    label: "Destructuring",
    code: `const user = { name: "Alice", age: 25, role: "admin" };

// Object destructuring
const { name, age, role = "user" } = user;
console.log(name, age, role);

// Array destructuring
const [first, second, ...rest] = [10, 20, 30, 40, 50];
console.log("First:", first);
console.log("Rest:", rest);

// Swap variables
let a = 1, b = 2;
[a, b] = [b, a];
console.log("Swapped:", a, b);`,
  },
  {
    label: "Promises",
    code: `const p1 = Promise.resolve("Fast");
const p2 = new Promise(r => setTimeout(() => r("Slow"), 300));
const p3 = Promise.reject("Error");

Promise.allSettled([p1, p2, p3]).then(results => {
  results.forEach(r => {
    if (r.status === "fulfilled") {
      console.log("✅", r.value);
    } else {
      console.log("❌", r.reason);
    }
  });
});`,
  },
];

function formatOutput(val) {
  if (val === null) return "null";
  if (val === undefined) return "undefined";
  if (typeof val === "object") return JSON.stringify(val, null, 2);
  return String(val);
}

export default function JsCompiler() {
  const [code, setCode]       = useState(EXAMPLES[0].code);
  const [output, setOutput]   = useState([]);
  const [hasRun, setHasRun]   = useState(false);
  const [running, setRunning] = useState(false);
  const outputRef             = useRef(null);

  function run() {
    if (!code.trim() || running) return;
    setRunning(true);
    const logs = [];

    const origLog  = console.log;
    const origErr  = console.error;
    const origWarn = console.warn;
    const origInfo = console.info;

    try {
      console.log  = (...a) => logs.push({ type: "log",  text: a.map(formatOutput).join(" ") });
      console.error= (...a) => logs.push({ type: "error",text: a.map(formatOutput).join(" ") });
      console.warn = (...a) => logs.push({ type: "warn", text: a.map(formatOutput).join(" ") });
      console.info = (...a) => logs.push({ type: "info", text: a.map(formatOutput).join(" ") });

      const fn  = new Function(code);
      const ret = fn();

      // handle promise return (async functions)
      if (ret && typeof ret.then === "function") {
        ret
          .then(v => {
            if (v !== undefined) logs.push({ type: "return", text: formatOutput(v) });
          })
          .catch(e => logs.push({ type: "error", text: String(e) }))
          .finally(() => {
            setOutput(logs.length ? logs : [{ type: "info", text: "(no output)" }]);
            setHasRun(true);
            setRunning(false);
            setTimeout(() => outputRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
          });
        return; // don't fall through to finally
      }

      if (ret !== undefined) logs.push({ type: "return", text: formatOutput(ret) });
    } catch (e) {
      logs.push({ type: "error", text: String(e) });
    } finally {
      console.log  = origLog;
      console.error= origErr;
      console.warn = origWarn;
      console.info = origInfo;
    }

    setOutput(logs.length ? logs : [{ type: "info", text: "(no output)" }]);
    setHasRun(true);
    setRunning(false);
    setTimeout(() => outputRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  }

  function clearAll() { setCode(""); setOutput([]); setHasRun(false); }

  const lineCount = code.split("\n").length;

  const LOG_STYLE = {
    log:    "text-emerald-400",
    error:  "text-red-400",
    warn:   "text-yellow-400",
    info:   "text-sky-400",
    return: "text-indigo-300",
  };
  const LOG_PREFIX = { log: "▸", error: "✖", warn: "⚠", info: "ℹ", return: "→" };

  return (
    <div className="min-h-screen px-4 py-8 max-w-5xl mx-auto space-y-6 text-slate-800 dark:text-white">

      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <span>⚡</span> JavaScript Compiler
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Write and run JavaScript instantly — no install needed
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={clearAll}
            className="px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            🗑 Clear
          </button>
          <button onClick={run} disabled={!code.trim() || running}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm font-bold rounded-xl transition-colors flex items-center gap-2">
            {running ? <><span className="animate-spin">⟳</span> Running…</> : "▶ Run Code"}
          </button>
        </div>
      </div>

      {/* Examples */}
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Quick Examples</p>
        <div className="flex gap-2 flex-wrap">
          {EXAMPLES.map(ex => (
            <button key={ex.label} onClick={() => { setCode(ex.code); setOutput([]); setHasRun(false); }}
              className="text-xs px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:border-indigo-300 dark:hover:border-indigo-600 hover:text-indigo-600 dark:hover:text-indigo-300 transition-colors">
              {ex.label}
            </button>
          ))}
        </div>
      </div>

      {/* Editor + Output */}
      <div className="grid lg:grid-cols-2 gap-4">

        {/* Editor */}
        <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm">
          {/* Editor header */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-400" />
              <span className="w-3 h-3 rounded-full bg-yellow-400" />
              <span className="w-3 h-3 rounded-full bg-green-400" />
              <span className="ml-3 text-xs text-slate-500 dark:text-slate-400 font-mono">script.js</span>
            </div>
            <span className="text-[10px] text-slate-400">{lineCount} line{lineCount !== 1 ? "s" : ""}</span>
          </div>
          {/* Textarea */}
          <div className="relative bg-[#0d1117]">
            <textarea
              value={code}
              onChange={e => setCode(e.target.value)}
              onKeyDown={e => {
                if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) { e.preventDefault(); run(); }
                // Tab support
                if (e.key === "Tab") {
                  e.preventDefault();
                  const s = e.target.selectionStart;
                  const newCode = code.slice(0, s) + "  " + code.slice(e.target.selectionEnd);
                  setCode(newCode);
                  setTimeout(() => e.target.setSelectionRange(s + 2, s + 2), 0);
                }
              }}
              spellCheck={false}
              className="w-full min-h-[400px] p-4 bg-transparent text-emerald-300 font-mono text-sm leading-relaxed outline-none resize-none placeholder-slate-600"
              placeholder="// Write your JavaScript here…"
            />
          </div>
          <div className="px-4 py-2 bg-[#0d1117] border-t border-slate-800 flex items-center justify-between">
            <span className="text-[10px] text-slate-600 font-mono">Ctrl+Enter / Cmd+Enter to run · Tab to indent</span>
            <button onClick={run} disabled={!code.trim() || running}
              className="text-xs px-3 py-1 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white rounded-lg font-bold transition-colors">
              ▶ Run
            </button>
          </div>
        </div>

        {/* Output */}
        <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col">
          <div className="flex items-center justify-between px-4 py-2.5 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-400" />
              <span className="w-3 h-3 rounded-full bg-yellow-400" />
              <span className="w-3 h-3 rounded-full bg-green-400" />
              <span className="ml-3 text-xs text-slate-500 dark:text-slate-400 font-mono">output</span>
            </div>
            {output.length > 0 && (
              <button onClick={() => setOutput([])} className="text-[10px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                clear output
              </button>
            )}
          </div>

          <div ref={outputRef} className="flex-1 bg-[#0d1117] p-4 font-mono text-sm min-h-[400px] overflow-y-auto">
            <AnimatePresence mode="wait">
              {!hasRun ? (
                <motion.div key="placeholder" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center h-64 text-slate-600 text-center space-y-2">
                  <span className="text-4xl">⚡</span>
                  <p className="text-sm">Click <span className="text-indigo-400 font-bold">▶ Run Code</span> to execute</p>
                  <p className="text-xs text-slate-700">Output will appear here</p>
                </motion.div>
              ) : (
                <motion.div key="output" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-1">
                  {output.map((line, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className={`flex gap-2 leading-relaxed ${LOG_STYLE[line.type] || "text-slate-300"}`}>
                      <span className="opacity-50 flex-shrink-0 w-4">{LOG_PREFIX[line.type]}</span>
                      <pre className="whitespace-pre-wrap break-all flex-1">{line.text}</pre>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          ["⌨️", "Ctrl+Enter", "Run code on Windows / Android"],
          ["⌘", "Cmd+Enter", "Run code on Mac / iOS"],
          ["⇥", "Tab key", "Indent with 2 spaces"],
          ["🔄", "Async support", "async/await and Promises work"],
        ].map(([icon, title, desc]) => (
          <div key={title} className="glass-card p-3 text-center">
            <div className="text-xl mb-1">{icon}</div>
            <p className="text-xs font-bold text-slate-700 dark:text-slate-200">{title}</p>
            <p className="text-[10px] text-slate-400 mt-0.5">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
