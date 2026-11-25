import { useState } from "react";
import { ExtLink } from "./ui.jsx";

// Progress + result of the online check: a progress bar while it runs, then a
// "What changed" list split into applied updates and findings that were NOT
// applied (and why), with their sources.

const when = (iso) =>
  iso ? new Date(iso).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) : "—";

const hostname = (u) => {
  try { return new URL(u).hostname.replace(/^www\./, ""); } catch { return u; }
};

const fmt = (v) => (v == null || v === "" ? "—" : typeof v === "number" ? v.toLocaleString("en-IN") : String(v).replace(/_/g, " "));

const FIELD = {
  status: "Status", vacancies: "Vacancies", "application.start": "Applications open", "application.end": "Applications close",
  examDates: "Exam dates", notificationLink: "Notification link", applyLink: "Apply link",
};

function ChangeRow({ c }) {
  return (
    <li className="py-2 text-[12.5px]">
      <p className="text-slate-800 dark:text-slate-100">
        <strong>{c.exam}</strong> <span className="text-slate-500">· {c.cycle}</span> — {FIELD[c.field] || c.field}:{" "}
        <span className="line-through text-slate-400">{fmt(c.old)}</span> → <strong>{fmt(c.new)}</strong>
      </p>
      <p className="text-[11px] text-slate-500 dark:text-slate-400">
        {c.reason}
        {c.sources?.length > 0 && (
          <>
            {" · "}
            {c.sources.slice(0, 3).map((u, i) => (
              <span key={u}>{i > 0 && ", "}<ExtLink link={{ url: u, label: hostname(u) }} className="font-normal" /></span>
            ))}
          </>
        )}
      </p>
    </li>
  );
}

export default function OnlineCheckPanel({ phase, run, info, onForce, onDismiss, lastCheckedAt }) {
  const [showReview, setShowReview] = useState(false);
  if (phase === "idle") {
    return lastCheckedAt ? (
      <p className="text-[11.5px] text-slate-500 dark:text-slate-400">Last checked online {when(lastCheckedAt)}. Press Refresh to check again.</p>
    ) : null;
  }

  const box = "rounded-2xl border px-4 py-3 space-y-2";

  if (phase === "starting" || phase === "running") {
    const total = run?.total || 0;
    const done = run?.done || 0;
    const pct = total ? Math.round((done / total) * 100) : 5;
    return (
      <div className={`${box} border-indigo-200 dark:border-indigo-900/60 bg-indigo-50 dark:bg-indigo-950/30`} role="status" aria-live="polite">
        <p className="text-[12.5px] font-semibold text-indigo-900 dark:text-indigo-200">
          Checking online for the latest notifications… {total ? `${done}/${total}` : ""}
          {run?.current && <span className="font-normal"> — {run.current}</span>}
        </p>
        <div className="h-1.5 rounded-full bg-white/70 dark:bg-slate-800 overflow-hidden">
          <div className="h-full bg-indigo-500 transition-all duration-500" style={{ width: `${pct}%` }} />
        </div>
        <p className="text-[11px] text-indigo-900/70 dark:text-indigo-300/70">Takes a few minutes — you can keep using the page. Only verified changes are applied.</p>
      </div>
    );
  }

  if (phase === "cooldown") {
    return (
      <div className={`${box} border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/40`} role="status">
        <p className="text-[12.5px] text-slate-700 dark:text-slate-200">
          Already checked online {when(run?.finishedAt)} — showing the latest data. The next online check opens {when(info.nextAllowedAt)}.
        </p>
        <div className="flex gap-2">
          {info.canForce && (
            <button type="button" onClick={onForce} className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700">
              Check now anyway (admin)
            </button>
          )}
          <button type="button" onClick={onDismiss} className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200">Dismiss</button>
        </div>
      </div>
    );
  }

  if (phase === "unauthenticated") {
    return <p className="text-[12px] text-amber-700 dark:text-amber-400" role="status">Showing the latest saved data. Sign in to run an online check.</p>;
  }

  if (phase === "failed") {
    return (
      <div className={`${box} border-red-200 dark:border-red-900/60 bg-red-50 dark:bg-red-950/30`} role="alert">
        <p className="text-[12.5px] text-red-800 dark:text-red-200">Online check failed: {info.message || run?.error || "unknown error"}. Showing the latest saved data.</p>
        <button type="button" onClick={onDismiss} className="text-xs font-semibold text-red-700 dark:text-red-300 hover:underline">Dismiss</button>
      </div>
    );
  }

  // done
  const changes = run?.changes || [];
  const applied = changes.filter((c) => c.applied);
  const review = changes.filter((c) => !c.applied);
  const errors = run?.errors || [];
  return (
    <div className={`${box} border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/60 dark:bg-emerald-950/20`} role="status" aria-live="polite">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <p className="text-[12.5px] font-semibold text-emerald-900 dark:text-emerald-200">
          Online check finished {when(run?.finishedAt)}: {applied.length ? `${applied.length} update${applied.length > 1 ? "s" : ""} applied` : "no changes found"}
          {review.length > 0 && `, ${review.length} finding${review.length > 1 ? "s" : ""} need review`}
          {errors.length > 0 && `, ${errors.length} exam${errors.length > 1 ? "s" : ""} could not be checked`}.
        </p>
        <button type="button" onClick={onDismiss} className="text-xs font-semibold text-slate-500 hover:underline">Dismiss</button>
      </div>
      {applied.length > 0 && (
        <ul className="divide-y divide-emerald-100 dark:divide-emerald-900/40">
          {applied.map((c, i) => <ChangeRow key={`a${i}`} c={c} />)}
        </ul>
      )}
      {review.length > 0 && (
        <div>
          <button type="button" aria-expanded={showReview} onClick={() => setShowReview((v) => !v)} className="text-[12px] font-semibold text-amber-800 dark:text-amber-300 hover:underline">
            {showReview ? "Hide" : "Show"} {review.length} not applied — verify these yourself
          </button>
          {showReview && (
            <ul className="divide-y divide-amber-100 dark:divide-amber-900/40">
              {review.map((c, i) => <ChangeRow key={`r${i}`} c={c} />)}
            </ul>
          )}
        </div>
      )}
      {errors.length > 0 && (
        <p className="text-[11px] text-slate-500 dark:text-slate-400">Not checked: {errors.map((e) => e.exam).join(", ")} (will be retried next time).</p>
      )}
    </div>
  );
}
