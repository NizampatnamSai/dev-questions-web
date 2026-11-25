import { useId, useState } from "react";
import { STATUS, ELIGIBILITY, PROVENANCE } from "../../data/recruitment/model.js";
import { figureText } from "../../utils/recruitment.js";

// Small presentational pieces shared by the tracker's table, cards and drawer.

export function Pill({ cls, children, title, className = "" }) {
  return (
    <span title={title} className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap ${cls} ${className}`}>
      {children}
    </span>
  );
}

export function StatusBadge({ cycle }) {
  const s = STATUS[cycle.status];
  return (
    <Pill cls={s.cls} title={cycle.statusNote || s.label}>
      {s.label}
      {cycle.statusVerified === false && <span aria-label="status not confirmed">*</span>}
    </Pill>
  );
}

export function EligibilityBadge({ elig, short = false }) {
  const e = ELIGIBILITY[elig.status];
  const why = elig.reasons.filter((r) => r.ok !== true).map((r) => r.text).join(" ");
  return (
    <Pill cls={e.cls} title={why || e.label}>
      <span aria-hidden="true">{e.dot}</span>
      {short && e.short ? e.short : e.label}
    </Pill>
  );
}

/** Marks a cycle changed by the online check — so it is never mistaken for hand-verified data. */
export function AutoUpdatedBadge({ cycle }) {
  if (!cycle?.autoUpdated) return null;
  const at = new Date(cycle.autoUpdated.at);
  const when = Number.isNaN(at.getTime()) ? "" : at.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  return (
    <Pill cls="bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300" title={`Updated by the online check${when ? ` on ${when}` : ""}. ${cycle.autoUpdated.evidence || ""} — verify against the notification.`}>
      🔄 Updated online{when ? ` ${when}` : ""}
    </Pill>
  );
}

/** Provenance marker next to a figure. Colour + text, so it is not colour-only. */
export function Prov({ p, note }) {
  if (!p) return null;
  const meta = PROVENANCE[p];
  const abbr = { OFFICIAL: "Official", HISTORICAL: "Hist.", ESTIMATED: "Est.", NOT_ANNOUNCED: "" }[p];
  if (!abbr) return null;
  return (
    <span className={`text-[9px] font-bold uppercase tracking-wide ${meta.cls}`} title={note ? `${meta.tip} ${note}` : meta.tip}>
      {abbr}
    </span>
  );
}

/** A money Figure with its provenance, or the right "not available" wording. */
export function Money({ fig, full = false, emptyText = "Not announced", className = "" }) {
  const text = figureText(fig, { full });
  if (!text) {
    return (
      <span className={`text-[11px] font-semibold text-violet-600 dark:text-violet-400 ${className}`} title={fig?.note}>
        {fig?.provenance === "ESTIMATED" ? "Not estimated" : emptyText}
      </span>
    );
  }
  return (
    <span className={`inline-flex items-baseline gap-1 tabular-nums ${className}`} title={fig.note}>
      <span>{text}</span>
      <Prov p={fig.provenance} note={fig.note} />
    </span>
  );
}

/**
 * A vacancy count. When the official figure is missing and an `estimate` is
 * given, shows the estimated range — tagged Est. and captioned "not announced"
 * so it can never be read as the recruiter's number.
 */
export function Count({ fig, estimate, compact = false }) {
  if (!fig || fig.value == null) {
    if (estimate?.value != null) {
      const range = `~${estimate.value.toLocaleString("en-IN")}${estimate.max != null ? `–${estimate.max.toLocaleString("en-IN")}` : ""}`;
      return (
        <span className="inline-flex flex-col" title={estimate.note}>
          <span className="inline-flex items-baseline gap-1 tabular-nums whitespace-nowrap text-amber-800 dark:text-amber-300">
            <span>{range}</span>
            <Prov p="ESTIMATED" note={estimate.note} />
          </span>
          {!compact && (
            <span className="text-[9.5px] font-semibold text-violet-600 dark:text-violet-400">
              not announced{estimate.single ? " · 1 past cycle" : ""}
            </span>
          )}
        </span>
      );
    }
    return <span className="text-[11px] font-semibold text-violet-600 dark:text-violet-400" title={fig?.note}>Not announced</span>;
  }
  return (
    <span className="inline-flex items-baseline gap-1 tabular-nums" title={fig.note}>
      <span>{fig.value.toLocaleString("en-IN")}</span>
      <Prov p={fig.provenance} note={fig.note} />
    </span>
  );
}

export function ExtLink({ link, children, className = "" }) {
  if (!link?.url) return null;
  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-1 font-semibold text-indigo-600 dark:text-indigo-300 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 rounded ${className}`}
    >
      {children || link.label}
      <span aria-hidden="true">↗</span>
      <span className="sr-only">(opens in a new tab)</span>
    </a>
  );
}

/** Disclosure panel — a real button with aria-expanded, keyboard-operable. */
export function Collapsible({ title, subtitle, defaultOpen = false, children, level = "section", right }) {
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();
  const isSection = level === "section";
  return (
    <div className={isSection ? "rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden" : "rounded-xl border border-slate-100 dark:border-slate-800"}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((v) => !v)}
        className={`w-full flex items-center justify-between gap-3 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-400 ${
          isSection ? "px-4 py-3 bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800" : "px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800/40"
        }`}
      >
        <span className="min-w-0">
          <span className={`block font-bold text-slate-800 dark:text-slate-100 ${isSection ? "text-sm" : "text-[13px]"}`}>{title}</span>
          {subtitle && <span className="block text-[11px] text-slate-500 dark:text-slate-400">{subtitle}</span>}
        </span>
        <span className="flex items-center gap-2 flex-shrink-0">
          {right}
          <svg className={`w-4 h-4 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>
      <div id={id} hidden={!open} className={isSection ? "p-4" : "px-3 pb-3 pt-1"}>
        {open && children}
      </div>
    </div>
  );
}

export function KV({ k, children }) {
  return (
    <div className="grid grid-cols-[minmax(0,10rem)_1fr] gap-x-3 gap-y-0.5 py-1.5 border-b border-slate-100 dark:border-slate-800 last:border-0">
      <dt className="text-[11.5px] font-semibold text-slate-500 dark:text-slate-400">{k}</dt>
      <dd className="text-[12.5px] text-slate-700 dark:text-slate-200 min-w-0">{children}</dd>
    </div>
  );
}

export function ProvenanceLegend() {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-500 dark:text-slate-400">
      {Object.entries(PROVENANCE).map(([k, v]) => (
        <span key={k} className="inline-flex items-center gap-1.5" title={v.tip}>
          <span className={`font-bold uppercase text-[9.5px] ${v.cls}`}>{v.label}</span>
          <span className="hidden sm:inline">— {v.tip.split(".")[0].toLowerCase()}</span>
        </span>
      ))}
      <span><span className="font-bold">*</span> status inferred from the timeline, not confirmed</span>
    </div>
  );
}
