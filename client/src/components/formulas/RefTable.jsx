import { Answer, BookmarkButton, CopyButton } from "./shared.jsx";

// Renders any quick-reference section ({ title, blurb, columns, rows }) as a
// responsive table. Columns marked `answer` are hidden in revision mode; every
// row gets copy + bookmark actions. Rows flagged `key` are subtly highlighted.

export default function RefTable({ section, rows, revision, reveal, bookmarks, dense = false }) {
  if (!rows.length) return null;
  const [first, ...rest] = section.columns;
  return (
    <div className="glass-card rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden">
      <div className="px-5 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60">
        <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">{section.title}</h4>
        {section.blurb && <p className="text-[11px] text-slate-500 dark:text-slate-400">{section.blurb}</p>}
      </div>
      <div className="relative overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <caption className="sr-only">{section.title}</caption>
          <thead>
            <tr className="text-[10px] uppercase tracking-wider text-slate-400">
              {section.columns.map((c) => (
                <th key={c.key} scope="col" className={`px-4 py-2 font-bold ${c.align === "right" ? "text-right" : "text-left"}`}>
                  {c.label}
                </th>
              ))}
              <th scope="col" className="px-2 py-2 w-16"><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr
                key={r.id}
                className={`border-t border-slate-100 dark:border-slate-800/70 ${r.key ? "bg-amber-50/60 dark:bg-amber-950/20" : ""} hover:bg-slate-50 dark:hover:bg-slate-900/40`}
              >
                <th scope="row" className={`px-4 ${dense ? "py-1.5" : "py-2"} text-left font-bold font-mono text-slate-800 dark:text-slate-100 whitespace-nowrap`}>
                  {r[first.key]}
                  {r.key && <span className="ml-1.5 text-amber-500 text-[10px]" title="High-frequency value">●</span>}
                </th>
                {rest.map((c) => (
                  <td key={c.key} className={`px-4 ${dense ? "py-1.5" : "py-2"} tabular-nums whitespace-nowrap ${c.align === "right" ? "text-right" : ""} ${c.answer ? "font-semibold text-amber-700 dark:text-amber-300" : "text-slate-600 dark:text-slate-300"}`}>
                    <Answer
                      value={r[c.key]}
                      hidden={revision && c.answer}
                      revealed={reveal.isRevealed(r.id)}
                      onReveal={() => reveal.reveal(r.id)}
                      label={`${c.label} of ${r[first.key]}`}
                    />
                  </td>
                ))}
                <td className="px-2 py-1 text-right whitespace-nowrap">
                  <CopyButton text={r.copy} label={r[first.key]} />
                  <BookmarkButton on={bookmarks.has(r.id)} onToggle={() => bookmarks.toggle(r.id)} label={r.copy} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/** Shortcut / rule cards ({ id, name, formula, note }) with copy + bookmark. */
export function RuleList({ title, items, revision, reveal, bookmarks }) {
  if (!items.length) return null;
  return (
    <div className="glass-card rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden">
      <div className="px-5 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60">
        <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">{title}</h4>
      </div>
      <ul className="divide-y divide-slate-100 dark:divide-slate-800/70">
        {items.map((it) => (
          <li key={it.id} className="px-5 py-3 flex items-start gap-2">
            <div className="flex-1 min-w-0 space-y-0.5">
              <p className="text-xs font-bold text-slate-700 dark:text-slate-200">{it.name}</p>
              <p className="text-sm font-mono text-amber-700 dark:text-amber-300 break-words">
                <Answer value={it.formula} hidden={revision} revealed={reveal.isRevealed(it.id)} onReveal={() => reveal.reveal(it.id)} label={it.name} />
              </p>
              {it.note && (!revision || reveal.isRevealed(it.id)) && <p className="text-[11px] text-slate-500 dark:text-slate-400">{it.note}</p>}
            </div>
            <div className="flex-shrink-0 flex">
              <CopyButton text={`${it.name}: ${it.formula}`} label={it.name} />
              <BookmarkButton on={bookmarks.has(it.id)} onToggle={() => bookmarks.toggle(it.id)} label={it.name} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
