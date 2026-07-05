import { useState, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useClickOutside } from "../hooks/useClickOutside";

// Custom-styled dropdown (Material/Google-select look: floating rounded panel,
// checkmark on the selected row, subtle hover states) replacing the native
// <select>, which renders inconsistently across browsers/OSes and can't be
// styled beyond the trigger itself.
export default function Select({ value, onChange, options, placeholder = "Select…", className = "", disabled = false }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useClickOutside(ref, () => setOpen(false), open);

  const normalized = options.map((o) => (typeof o === "string" ? { value: o, label: o } : o));
  const current = normalized.find((o) => o.value === value);

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-sm font-semibold text-slate-700 dark:text-slate-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className="truncate">{current ? current.label : placeholder}</span>
        <svg
          className={`w-3.5 h-3.5 flex-shrink-0 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.12 }}
            className="absolute z-50 mt-1.5 w-full min-w-max max-h-64 overflow-y-auto rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 shadow-xl py-1"
          >
            {normalized.map((o) => (
              <button
                key={o.value}
                type="button"
                onClick={() => { onChange(o.value); setOpen(false); }}
                className={`w-full flex items-center justify-between gap-3 px-3.5 py-2 text-sm text-left transition-colors ${
                  o.value === value
                    ? "bg-indigo-50 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-300 font-semibold"
                    : "text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/5"
                }`}
              >
                <span className="truncate">{o.label}</span>
                {o.value === value && (
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
