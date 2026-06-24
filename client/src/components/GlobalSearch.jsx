import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const PAGES = [
  { to: "/dashboard",         label: "Dashboard",       icon: "📊", keywords: "home overview" },
  { to: "/workboard",         label: "Work Board",      icon: "📋", keywords: "work tasks daily" },
  { to: "/challenge",         label: "JS Challenge",    icon: "🧩", keywords: "javascript challenge 30 days" },
  { to: "/generate",          label: "AI Generator",    icon: "✨", keywords: "ai generate question" },
  { to: "/quiz",              label: "Quiz Mode",       icon: "🧠", keywords: "quiz test practice" },
  { to: "/study",             label: "Study Hub",       icon: "📚", keywords: "study learn hub" },
  { to: "/mock-interview",    label: "Mock Interview",  icon: "🎯", keywords: "mock interview practice dsa" },
  { to: "/flashcards",        label: "Flashcards",      icon: "🃏", keywords: "flash cards review" },
  { to: "/progress",          label: "My Progress",     icon: "📈", keywords: "progress streak score" },
  { to: "/community",         label: "Community",       icon: "🌍", keywords: "community questions feed" },
  { to: "/my-questions",      label: "My Questions",    icon: "📝", keywords: "my questions posted" },
  { to: "/my-answers",        label: "My Answers",      icon: "✍️", keywords: "my answers" },
  { to: "/bookmarks",         label: "Bookmarks",       icon: "🔖", keywords: "bookmarks saved" },
  { to: "/leaderboard",       label: "Leaderboard",     icon: "🏆", keywords: "leaderboard ranking top" },
  { to: "/js-compiler",       label: "JS Compiler",     icon: "⚡", keywords: "compiler run javascript code" },
  { to: "/json-parser",       label: "JSON Parser",     icon: "🔍", keywords: "json parser formatter minify validate" },
  { to: "/guide",             label: "Project Guide",   icon: "🗺️", keywords: "guide project roadmap" },
  { to: "/ask",               label: "Ask AI",          icon: "🤖", keywords: "ask ai chat gpt claude python general query" },
  { to: "/notifications",     label: "Notifications",   icon: "🔔", keywords: "notifications alerts bell" },
  { to: "/admin",             label: "Admin Panel",     icon: "👑", keywords: "admin panel manage users" },
];

export default function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const results = query.trim()
    ? PAGES.filter(p =>
        `${p.label} ${p.keywords}`.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 6)
    : PAGES.slice(0, 6);

  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen(v => !v);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
    else setQuery("");
  }, [open]);

  const go = (to) => {
    navigate(to);
    setOpen(false);
  };

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/15 text-slate-400 dark:text-slate-400 text-xs transition-all border border-slate-200 dark:border-white/10"
      >
        <span>🔍</span>
        <span className="hidden sm:inline">Search pages…</span>
        <kbd className="hidden sm:inline text-[10px] bg-slate-200 dark:bg-white/10 px-1.5 py-0.5 rounded font-mono">⌘K</kbd>
      </button>

      {/* Modal */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998]"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.15 }}
              className="fixed top-[10%] sm:top-[20%] left-0 right-0 mx-auto w-[calc(100%-32px)] max-w-md z-[9999]"
            >
              <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden">
                <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-100 dark:border-white/10">
                  <span className="text-slate-400">🔍</span>
                  <input
                    ref={inputRef}
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    placeholder="Search pages…"
                    className="flex-1 bg-transparent outline-none text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
                  />
                  <button
                    onClick={() => setOpen(false)}
                    className="text-slate-400 hover:text-slate-200 transition-colors text-xl leading-none px-1"
                    aria-label="Close search"
                  >
                    ✕
                  </button>
                </div>
                <div className="py-1 max-h-60 overflow-y-auto">
                  {results.length === 0 ? (
                    <p className="text-sm text-slate-400 text-center py-6">No pages found</p>
                  ) : (
                    results.map((p) => (
                      <button
                        key={p.to}
                        onClick={() => go(p.to)}
                        className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors text-left"
                      >
                        <span className="text-lg w-7 text-center">{p.icon}</span>
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{p.label}</span>
                      </button>
                    ))
                  )}
                </div>
                <div className="hidden sm:flex px-4 py-2 border-t border-slate-100 dark:border-white/10 text-[10px] text-slate-400 gap-3">
                  <span>↵ to navigate</span>
                  <span>ESC to close</span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
