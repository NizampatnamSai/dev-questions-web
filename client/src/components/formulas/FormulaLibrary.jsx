import { useMemo, useState } from "react";
import { useBookmarks } from "../../hooks/useBookmarks.js";
import { Toolbar, EmptyState, useReveal, BOOKMARK_KEY, Answer, BookmarkButton, CopyButton } from "./shared.jsx";

// Formula / rule library for the Quant and Reasoning sub-tabs. Renders the
// existing { group, important?, items: [{ name, formula, note? }] } data with
// search, category filtering, copy, bookmarks and revision mode.
//
// `categories` (optional) is a list of { id, label, groups: [groupName] }. A
// category whose groups hold no items renders a "coming soon" card, so adding
// a category before its content is safe.

const itemId = (group, name) => `f:${group}:${name}`;

export default function FormulaLibrary({ groups, categories, title, subtitle, searchPlaceholder }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [revision, setRevision] = useState(false);
  const [onlyBookmarks, setOnlyBookmarks] = useState(false);
  const bookmarks = useBookmarks(BOOKMARK_KEY);
  const reveal = useReveal();
  const q = query.trim().toLowerCase();

  const byName = useMemo(() => new Map(groups.map((g) => [g.group, g])), [groups]);
  const activeCat = categories?.find((c) => c.id === category);

  // Groups in scope for the chosen category, in the category's order.
  const scoped = activeCat ? activeCat.groups.map((n) => byName.get(n)).filter(Boolean) : groups;

  const visible = scoped
    .map((g) => ({
      ...g,
      items: g.items.filter((it) => {
        if (onlyBookmarks && !bookmarks.has(itemId(g.group, it.name))) return false;
        if (!q) return true;
        return `${g.group} ${it.name} ${it.formula} ${it.note || ""}`.toLowerCase().includes(q);
      }),
    }))
    .filter((g) => g.items.length);

  const catCount = (c) => c.groups.reduce((n, name) => n + (byName.get(name)?.items.length || 0), 0);
  const comingSoon = activeCat && catCount(activeCat) === 0;

  return (
    <div className="space-y-6">
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{title}</h2>
        <p className="text-sm text-slate-500">{subtitle}</p>
      </div>

      <div className="sticky top-0 z-20 -mx-2 px-2 py-2 bg-slate-50/90 dark:bg-slate-950/90 backdrop-blur space-y-2 rounded-2xl">
        <Toolbar
          query={query}
          setQuery={setQuery}
          placeholder={searchPlaceholder}
          revision={revision}
          setRevision={(v) => { setRevision(v); reveal.reset(); }}
          onlyBookmarks={onlyBookmarks}
          setOnlyBookmarks={setOnlyBookmarks}
          bookmarkCount={bookmarks.count}
          revealedCount={reveal.count}
          onHideAgain={reveal.reset}
        />
        {categories && (
          <div className="flex gap-2 overflow-x-auto scrollbar-thin pb-1 -mx-1 px-1" role="group" aria-label="Formula categories">
            {[{ id: "all", label: "All topics" }, ...categories].map((c) => {
              const on = category === c.id;
              const n = c.id === "all" ? null : catCount(c);
              return (
                <button
                  key={c.id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setCategory(c.id)}
                  className={`flex-shrink-0 whitespace-nowrap text-xs font-semibold px-3 py-1.5 rounded-full transition focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
                    on ? "bg-amber-500 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-amber-100 dark:hover:bg-amber-900/40"
                  }`}
                >
                  {c.label}
                  {n != null && <span className={`ml-1 text-[10px] ${on ? "text-white/80" : "text-slate-400"}`}>{n || "soon"}</span>}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {revision && (
        <p className="text-[12px] text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/30 rounded-xl px-3 py-2" role="status">
          Revision mode: formulas are hidden. Recall each one, then press <strong>Show</strong>.
        </p>
      )}

      {comingSoon ? (
        <EmptyState>
          <span className="block text-base font-bold text-slate-700 dark:text-slate-200">{activeCat.label}</span>
          Formulas for this topic are coming soon.
        </EmptyState>
      ) : visible.length === 0 ? (
        <EmptyState>
          {onlyBookmarks && !bookmarks.count ? "No bookmarks yet — tap ☆ on any formula to save it here." : `Nothing matches “${query}”${activeCat ? ` in ${activeCat.label}` : ""}.`}
        </EmptyState>
      ) : (
        <div className="grid md:grid-cols-2 gap-4 items-start">
          {visible.map((g) => (
            <div
              key={g.group}
              className={`glass-card rounded-3xl border overflow-hidden ${
                g.important ? "border-amber-400 dark:border-amber-500 ring-1 ring-amber-400/30" : "border-slate-200 dark:border-slate-800"
              }`}
            >
              <div
                className={`px-5 py-3 border-b flex items-center justify-between gap-2 ${
                  g.important ? "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800" : "bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800"
                }`}
              >
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                  {g.group}
                  {g.important && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-500 text-white uppercase tracking-wider whitespace-nowrap">★ Important</span>
                  )}
                </h3>
                <span className="text-[10px] text-slate-400 font-semibold">{g.items.length}</span>
              </div>
              <ul className="divide-y divide-slate-100 dark:divide-slate-800/70">
                {g.items.map((it) => {
                  const id = itemId(g.group, it.name);
                  return (
                    <li key={it.name} className="px-5 py-3 flex items-start gap-2">
                      <div className="flex-1 min-w-0 space-y-1">
                        <p className="text-xs font-bold text-slate-700 dark:text-slate-200">{it.name}</p>
                        <p className="text-sm font-mono text-amber-700 dark:text-amber-300 break-words">
                          <Answer value={it.formula} hidden={revision} revealed={reveal.isRevealed(id)} onReveal={() => reveal.reveal(id)} label={it.name} />
                        </p>
                        {it.note && (!revision || reveal.isRevealed(id)) && <p className="text-[11px] text-slate-500 dark:text-slate-400">{it.note}</p>}
                      </div>
                      <div className="flex-shrink-0 flex">
                        <CopyButton text={`${it.name}: ${it.formula}`} label={it.name} />
                        <BookmarkButton on={bookmarks.has(id)} onToggle={() => bookmarks.toggle(id)} label={it.name} />
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
