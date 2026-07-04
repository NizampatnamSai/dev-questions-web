import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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

export default function JsonTreeView({ data }) {
  return <TreeNode value={data} />;
}
