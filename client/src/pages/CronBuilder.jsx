import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { CronExpressionParser } from "cron-parser";
import cronstrue from "cronstrue";

const FIELDS = [
  { key: "minute", label: "Minute", placeholder: "*", hint: "0-59" },
  { key: "hour", label: "Hour", placeholder: "*", hint: "0-23" },
  { key: "dom", label: "Day (Month)", placeholder: "*", hint: "1-31" },
  { key: "month", label: "Month", placeholder: "*", hint: "1-12" },
  { key: "dow", label: "Day (Week)", placeholder: "*", hint: "0-6, Sun-Sat" },
];

const PRESETS = [
  { label: "Every minute", expr: "* * * * *" },
  { label: "Every 5 minutes", expr: "*/5 * * * *" },
  { label: "Every 15 minutes", expr: "*/15 * * * *" },
  { label: "Every hour", expr: "0 * * * *" },
  { label: "Daily at 9 AM", expr: "0 9 * * *" },
  { label: "Daily at midnight", expr: "0 0 * * *" },
  { label: "Weekdays at 9 AM", expr: "0 9 * * 1-5" },
  { label: "Weekly (Mon 9 AM)", expr: "0 9 * * 1" },
  { label: "Monthly (1st, midnight)", expr: "0 0 1 * *" },
  { label: "Yearly (Jan 1st)", expr: "0 0 1 1 *" },
];

function partsOf(expr) {
  const p = expr.trim().split(/\s+/);
  return { minute: p[0] || "*", hour: p[1] || "*", dom: p[2] || "*", month: p[3] || "*", dow: p[4] || "*" };
}

export default function CronBuilder() {
  const [expr, setExpr] = useState("0 9 * * 1-5");
  const parts = useMemo(() => partsOf(expr), [expr]);

  const setField = (key, value) => {
    const next = { ...parts, [key]: value || "*" };
    setExpr([next.minute, next.hour, next.dom, next.month, next.dow].join(" "));
  };

  const { description, error } = useMemo(() => {
    try {
      return { description: cronstrue.toString(expr, { throwExceptionOnParseError: true }), error: "" };
    } catch {
      return { description: "", error: "Invalid cron expression" };
    }
  }, [expr]);

  const nextRuns = useMemo(() => {
    if (error) return [];
    try {
      const interval = CronExpressionParser.parse(expr, { currentDate: new Date() });
      const runs = [];
      for (let i = 0; i < 5; i++) runs.push(interval.next().toDate());
      return runs;
    } catch {
      return [];
    }
  }, [expr, error]);

  const copy = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied");
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
          ⏰ Cron Expression Builder
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Build, validate, and preview cron schedules in plain English.
        </p>
      </div>

      {/* Presets */}
      <div className="flex flex-wrap gap-2">
        {PRESETS.map((p) => (
          <button
            key={p.label}
            onClick={() => setExpr(p.expr)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              expr === p.expr
                ? "bg-indigo-600 text-white"
                : "bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/20"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Expression input */}
      <div className="glass-card p-4 space-y-3">
        <div className="flex items-center gap-2">
          <input
            value={expr}
            onChange={(e) => setExpr(e.target.value)}
            spellCheck={false}
            className="flex-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/60 text-slate-700 dark:text-slate-200 font-mono text-lg outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={() => copy(expr)}
            className="px-3 py-2 rounded-lg text-xs font-medium bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/20"
          >
            📋 Copy
          </button>
        </div>

        {/* Per-field breakdown */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {FIELDS.map((f) => (
            <div key={f.key}>
              <label className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                {f.label}
              </label>
              <input
                value={parts[f.key]}
                onChange={(e) => setField(f.key, e.target.value)}
                placeholder={f.placeholder}
                spellCheck={false}
                className="w-full mt-0.5 px-2 py-1.5 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/60 text-slate-700 dark:text-slate-200 font-mono text-sm text-center outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <p className="text-[9px] text-slate-400 mt-0.5 text-center">{f.hint}</p>
            </div>
          ))}
        </div>

        {error ? (
          <div className="text-xs text-red-500 bg-red-50 dark:bg-red-500/10 p-2.5 rounded-lg border border-red-200 dark:border-red-500/20">
            ✗ {error}
          </div>
        ) : (
          <div className="text-sm text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 p-3 rounded-lg border border-indigo-200 dark:border-indigo-500/20 font-medium">
            🗓 {description}
          </div>
        )}
      </div>

      {/* Next runs */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wide">
          Next 5 runs
        </label>
        <div className="glass-card divide-y divide-slate-100 dark:divide-white/5 overflow-hidden">
          {nextRuns.length === 0 ? (
            <div className="p-6 text-center text-sm text-slate-400">
              Fix the expression to preview upcoming runs
            </div>
          ) : (
            nextRuns.map((d, i) => (
              <div key={i} className="p-3 flex items-center justify-between text-sm">
                <span className="text-slate-400 text-xs">#{i + 1}</span>
                <span className="font-mono text-slate-700 dark:text-slate-200">
                  {d.toLocaleString("en-US", {
                    weekday: "short",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </motion.div>
  );
}
