import { useState } from "react";
import toast from "react-hot-toast";

// Small controls shared by the Quick Reference tables and the formula library.

export const BOOKMARK_KEY = "ibpsPo.formulaBookmarks";

export async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    toast.success("Copied", { id: "formula-copy", duration: 1200 });
  } catch {
    toast.error("Couldn't copy — select the text instead", { id: "formula-copy" });
  }
}

const iconBtn =
  "inline-flex items-center justify-center w-7 h-7 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400";

export function CopyButton({ text, label }) {
  return (
    <button type="button" onClick={() => copyText(text)} className={iconBtn} title="Copy" aria-label={`Copy ${label || text}`}>
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
        <rect x="9" y="9" width="11" height="11" rx="2" />
        <path d="M5 15V5a2 2 0 0 1 2-2h10" />
      </svg>
    </button>
  );
}

export function BookmarkButton({ on, onToggle, label }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={on}
      aria-label={`${on ? "Remove bookmark" : "Bookmark"}: ${label}`}
      title={on ? "Remove bookmark" : "Bookmark"}
      className={`${iconBtn} ${on ? "!text-amber-500" : ""}`}
    >
      <span aria-hidden="true" className="text-[15px] leading-none">{on ? "★" : "☆"}</span>
    </button>
  );
}

/**
 * A value that revision mode hides. Hidden values become a "Show" button;
 * revealing one does not reveal the rest. `revealed` is lifted so a panel can
 * offer "hide all again".
 */
export function Answer({ value, hidden, revealed, onReveal, className = "", label }) {
  if (hidden && !revealed) {
    return (
      <button
        type="button"
        onClick={onReveal}
        aria-label={`Reveal ${label || "answer"}`}
        className="inline-block min-w-[3.5rem] px-2 py-0.5 rounded-md bg-slate-200/80 dark:bg-slate-700/80 text-[11px] font-bold text-slate-500 dark:text-slate-300 hover:bg-amber-100 dark:hover:bg-amber-900/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
      >
        Show
      </button>
    );
  }
  return <span className={className}>{value}</span>;
}

/** Revealed-set state for revision mode. */
export function useReveal() {
  const [revealed, setRevealed] = useState(() => new Set());
  return {
    isRevealed: (id) => revealed.has(id),
    reveal: (id) => setRevealed((s) => new Set(s).add(id)),
    reset: () => setRevealed(new Set()),
    count: revealed.size,
  };
}

/** Search + revision + bookmarks-only controls, used by both panels. */
export function Toolbar({ query, setQuery, placeholder, revision, setRevision, onlyBookmarks, setOnlyBookmarks, bookmarkCount, revealedCount, onHideAgain, extra }) {
  const pill = (active) =>
    `inline-flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl border transition focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
      active
        ? "bg-amber-500 border-amber-500 text-white"
        : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-amber-300"
    }`;
  return (
    <div className="flex flex-col md:flex-row gap-2">
      <label className="relative flex-1">
        <span className="sr-only">{placeholder}</span>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full text-sm pl-9 pr-3 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-amber-400 focus:outline-none"
        />
        <span aria-hidden="true" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">⌕</span>
      </label>
      <div className="flex flex-wrap gap-2">
        <button type="button" aria-pressed={revision} onClick={() => setRevision(!revision)} className={pill(revision)} title="Hide answers and test your recall">
          🙈 Revision mode
        </button>
        {revision && revealedCount > 0 && (
          <button type="button" onClick={onHideAgain} className={pill(false)}>
            ↺ Hide {revealedCount} again
          </button>
        )}
        <button type="button" aria-pressed={onlyBookmarks} onClick={() => setOnlyBookmarks(!onlyBookmarks)} className={pill(onlyBookmarks)}>
          ★ Bookmarked{bookmarkCount ? ` (${bookmarkCount})` : ""}
        </button>
        {extra}
      </div>
    </div>
  );
}

export function EmptyState({ children }) {
  return (
    <div className="glass-card rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 p-8 text-center text-sm text-slate-500 dark:text-slate-400">
      {children}
    </div>
  );
}

/** Horizontal category chips that scroll to a section. */
export function CategoryNav({ items, label = "Jump to section" }) {
  const go = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    el.focus({ preventScroll: true });
  };
  return (
    <nav aria-label={label} className="flex gap-2 overflow-x-auto scrollbar-thin pb-1 -mx-1 px-1">
      {items.map((it) => (
        <button
          key={it.id}
          type="button"
          onClick={() => go(it.id)}
          disabled={it.disabled}
          className="flex-shrink-0 whitespace-nowrap text-xs font-semibold px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-amber-100 dark:hover:bg-amber-900/40 hover:text-amber-800 dark:hover:text-amber-200 disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
        >
          {it.label}
          {it.count != null && <span className="ml-1 text-[10px] text-slate-400">{it.count}</span>}
        </button>
      ))}
    </nav>
  );
}
