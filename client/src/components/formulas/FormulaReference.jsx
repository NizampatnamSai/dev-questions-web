import { useMemo, useState } from "react";
import {
  ALPHABET_SECTIONS, OPPOSITE_PAIRS, ALPHABET_SHORTCUTS, ALPHABET_TOTAL,
  FRACTIONS, FRACTION_DENOMINATORS, FRACTION_RULES,
  SQUARES, CUBES, FOURTH_POWERS, POWER_SHORTCUTS, REFERENCE_NAV,
} from "../../data/formula-reference.js";
import { useBookmarks } from "../../hooks/useBookmarks.js";
import RefTable, { RuleList } from "./RefTable.jsx";
import QuickQuiz from "./QuickQuiz.jsx";
import { Toolbar, CategoryNav, EmptyState, useReveal, BOOKMARK_KEY, Answer, BookmarkButton, CopyButton } from "./shared.jsx";

// "Quick Reference" sub-tab of Formulas & Rules: alphabet positions,
// fraction ↔ percentage, squares, cubes and fourth powers — with search,
// bookmarks, copy, revision mode and a quick quiz.

/**
 * Search semantics. One character matches exactly (so "a" finds the letter A,
 * not every row containing an "a"); two or more characters match any search
 * token that starts with the query ("12" → 12, 12.5%, 121, 1296).
 */
function rowMatches(row, q) {
  if (!q) return true;
  const tokens = row.search.map((s) => String(s).toLowerCase());
  if (q.length === 1) return tokens.some((t) => t === q);
  return tokens.some((t) => t === q || t.startsWith(q) || t === `${q}%`);
}

const ruleMatches = (it, q) => !q || `${it.name} ${it.formula} ${it.note || ""}`.toLowerCase().includes(q);

function SectionHeading({ id, title, children }) {
  return (
    <div id={id} tabIndex={-1} className="scroll-mt-24 space-y-1 pt-2 focus:outline-none">
      <h3 id={`${id}-h`} className="text-xl font-bold text-slate-800 dark:text-slate-100">{title}</h3>
      {children && <p className="text-sm text-slate-500 dark:text-slate-400">{children}</p>}
    </div>
  );
}

export default function FormulaReference() {
  const [query, setQuery] = useState("");
  const [revision, setRevision] = useState(false);
  const [onlyBookmarks, setOnlyBookmarks] = useState(false);
  const [denominator, setDenominator] = useState("all");
  const [quiz, setQuiz] = useState(false);
  const bookmarks = useBookmarks(BOOKMARK_KEY);
  const reveal = useReveal();

  const q = query.trim().toLowerCase();
  const keep = (row) => rowMatches(row, q) && (!onlyBookmarks || bookmarks.has(row.id));
  const keepRule = (it) => ruleMatches(it, q) && (!onlyBookmarks || bookmarks.has(it.id));

  const view = useMemo(() => {
    const alpha = ALPHABET_SECTIONS.map((s) => ({ s, rows: s.rows.filter(keep) }));
    const fracRows = FRACTIONS.rows.filter((r) => keep(r) && (denominator === "all" || String(r.denominator) === denominator));
    return {
      alpha,
      alphaRules: ALPHABET_SHORTCUTS.filter(keepRule),
      pairs: OPPOSITE_PAIRS.filter((p) => (!q || p.pair.toLowerCase().includes(q) || p.hook?.toLowerCase().includes(q)) && (!onlyBookmarks || bookmarks.has(p.id))),
      fracRows,
      fracRules: FRACTION_RULES.filter(keepRule),
      squares: SQUARES.rows.filter(keep),
      cubes: CUBES.rows.filter(keep),
      fourth: FOURTH_POWERS.rows.filter(keep),
      powerRules: POWER_SHORTCUTS.filter(keepRule),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, onlyBookmarks, bookmarks.ids, denominator]);

  const counts = {
    "ref-alphabet": view.alpha.reduce((n, a) => n + a.rows.length, 0) + view.alphaRules.length + view.pairs.length,
    "ref-fractions": view.fracRows.length + view.fracRules.length,
    "ref-squares": view.squares.length + view.powerRules.length,
    "ref-cubes": view.cubes.length,
    "ref-fourth": view.fourth.length,
  };
  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  const common = { revision, reveal, bookmarks };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Quick Reference</h2>
        <p className="text-sm text-slate-500">Values worth knowing instantly — alphabet positions, fractions, squares, cubes and fourth powers.</p>
      </div>

      <div className="sticky top-0 z-20 -mx-2 px-2 py-2 bg-slate-50/90 dark:bg-slate-950/90 backdrop-blur space-y-2 rounded-2xl">
        <Toolbar
          query={query}
          setQuery={setQuery}
          placeholder="Search a letter, number, fraction or % — e.g. M, 17, 3/8, 37.5"
          revision={revision}
          setRevision={(v) => { setRevision(v); reveal.reset(); }}
          onlyBookmarks={onlyBookmarks}
          setOnlyBookmarks={setOnlyBookmarks}
          bookmarkCount={bookmarks.count}
          revealedCount={reveal.count}
          onHideAgain={reveal.reset}
          extra={
            <button
              type="button"
              onClick={() => setQuiz(true)}
              className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900 hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            >
              ⚡ Quick quiz
            </button>
          }
        />
        <CategoryNav items={REFERENCE_NAV.map((n) => ({ ...n, count: q || onlyBookmarks ? counts[n.id] : undefined, disabled: counts[n.id] === 0 }))} />
      </div>

      {revision && (
        <p className="text-[12px] text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/30 rounded-xl px-3 py-2" role="status">
          Revision mode: answers are hidden. Say each one out loud, then press <strong>Show</strong> to check.
        </p>
      )}

      {total === 0 && (
        <EmptyState>
          {onlyBookmarks && !bookmarks.count ? "No bookmarks yet — tap ☆ on any value to save it here." : `Nothing matches “${query}”.`}
        </EmptyState>
      )}

      {/* 1. Alphabet */}
      {counts["ref-alphabet"] > 0 && (
        <section className="space-y-4" aria-labelledby="ref-alphabet-h">
          <SectionHeading id="ref-alphabet" title="🔤 Alphabet Positions">
            A = 1 … Z = 26. Reverse position = 27 − position; opposite letters always add up to 27. A to Z sums to {ALPHABET_TOTAL}.
          </SectionHeading>
          <div className="grid md:grid-cols-2 gap-4 items-start">
            {view.alpha.map(({ s, rows }) => <RefTable key={s.id} section={s} rows={rows} dense {...common} />)}
          </div>
          {view.pairs.length > 0 && (
            <div className="glass-card rounded-3xl border border-slate-200 dark:border-slate-800 p-4 space-y-2">
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">Opposite pairs</h4>
              <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                {view.pairs.map((p) => (
                  <li key={p.id} className="flex items-center justify-between gap-1 rounded-xl bg-slate-50 dark:bg-slate-900/50 px-3 py-2">
                    <div className="min-w-0">
                      <p className="font-mono font-bold text-slate-800 dark:text-slate-100">{p.pair}</p>
                      <p className="text-[10.5px] text-slate-500 dark:text-slate-400 truncate">
                        <Answer value={`${p.positions} · ${p.hook}`} hidden={revision} revealed={reveal.isRevealed(p.id)} onReveal={() => reveal.reveal(p.id)} label={`pair ${p.pair}`} />
                      </p>
                    </div>
                    <span className="flex-shrink-0 flex">
                      <CopyButton text={`${p.pair} (${p.positions})`} label={p.pair} />
                      <BookmarkButton on={bookmarks.has(p.id)} onToggle={() => bookmarks.toggle(p.id)} label={p.pair} />
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <RuleList title="Alphabet shortcuts" items={view.alphaRules} {...common} />
        </section>
      )}

      {/* 2. Fractions */}
      {counts["ref-fractions"] > 0 && (
        <section className="space-y-4" aria-labelledby="ref-fractions-h">
          <SectionHeading id="ref-fractions" title="➗ Important Fractions & Percentage Values">
            Rounded to 2 decimal places. <span className="text-amber-600">●</span> marks the values that come up most in DI.
          </SectionHeading>
          <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Filter fractions by denominator">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mr-1">Denominator</span>
            {["all", ...FRACTION_DENOMINATORS.map(String)].map((d) => (
              <button
                key={d}
                type="button"
                aria-pressed={denominator === d}
                onClick={() => setDenominator(d)}
                className={`text-xs font-semibold px-2.5 py-1 rounded-lg transition focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
                  denominator === d ? "bg-amber-500 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                {d === "all" ? "All" : `/${d}`}
              </button>
            ))}
          </div>
          <div className="grid lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] gap-4 items-start">
            <RefTable section={FRACTIONS} rows={view.fracRows} {...common} />
            <RuleList title="Conversions & shortcuts" items={view.fracRules} {...common} />
          </div>
        </section>
      )}

      {/* 3–5. Powers */}
      {(counts["ref-squares"] > 0 || counts["ref-cubes"] > 0 || counts["ref-fourth"] > 0) && (
        <section className="space-y-4" aria-label="Powers">
          <div className="grid md:grid-cols-3 gap-4 items-start">
            {view.squares.length > 0 && (
              <div className="space-y-3">
                <SectionHeading id="ref-squares" title="Squares" />
                <RefTable section={SQUARES} rows={view.squares} dense {...common} />
              </div>
            )}
            {view.cubes.length > 0 && (
              <div className="space-y-3">
                <SectionHeading id="ref-cubes" title="Cubes" />
                <RefTable section={CUBES} rows={view.cubes} dense {...common} />
              </div>
            )}
            {view.fourth.length > 0 && (
              <div className="space-y-3">
                <SectionHeading id="ref-fourth" title="Fourth Powers" />
                <RefTable section={FOURTH_POWERS} rows={view.fourth} dense {...common} />
              </div>
            )}
          </div>
          <RuleList title="Power shortcuts" items={view.powerRules} {...common} />
        </section>
      )}

      {quiz && <QuickQuiz onClose={() => setQuiz(false)} />}
    </div>
  );
}
