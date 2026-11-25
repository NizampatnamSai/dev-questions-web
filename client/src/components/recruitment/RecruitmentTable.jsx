import { UNANNOUNCED_STATUSES, VACANCY_SCOPE } from "../../data/recruitment/model.js";
import { fmtDate, mid, inr } from "../../utils/recruitment.js";
import { StatusBadge, EligibilityBadge, Money, Count, ExtLink, Pill, Prov, AutoUpdatedBadge } from "./ui.jsx";

// Recruitment list: a compact sortable table on desktop and stacked cards on
// smaller screens. Both open the same detail drawer via `onOpen(row)`.

// One line per tracked state (RJ, AP). All-India and bank-wise recruitments
// have no state split at all, so they say that once instead of "n/a" twice.
function StateVacancy({ row }) {
  const scope = row.exam.vacancyScope;
  if (scope === "ALL_INDIA" || scope === "BANK_WISE") {
    return (
      <span className="text-[11px] text-slate-500 dark:text-slate-400" title="No state-wise allocation — one national or bank-wise merit list">
        {scope === "ALL_INDIA" ? "All-India merit" : "Bank-wise"} — no state split
      </span>
    );
  }
  return (
    <span className="flex flex-col gap-0.5" title={`${VACANCY_SCOPE[scope]} allocation`}>
      {row.states.map((s) => (
        <span key={s.name} className="inline-flex items-baseline gap-1 whitespace-nowrap" title={[s.unit, s.note].filter(Boolean).join(" — ")}>
          <span className="text-[10px] font-bold text-slate-400 w-5">{s.short}</span>
          {s.value != null ? (
            <>
              <span className="tabular-nums">{s.value.toLocaleString("en-IN")}</span>
              <Prov p={s.provenance} />
              {s.year && <span className="text-[9.5px] text-slate-400">({s.year})</span>}
            </>
          ) : (
            <span className="text-[10.5px] text-violet-600 dark:text-violet-400">Not announced</span>
          )}
        </span>
      ))}
    </span>
  );
}

function AnnualCtc({ exam }) {
  const s = exam.salary;
  if (s.ctc?.value != null) return <Money fig={s.ctc} />;
  const g = mid(s.gross);
  if (g == null) return <span className="text-[11px] font-semibold text-violet-600 dark:text-violet-400">Not announced</span>;
  return (
    <span className="tabular-nums" title="Annual gross (monthly gross × 12) — CTC not published">
      ≈{inr(g * 12)} <span className="text-[9px] font-bold uppercase text-amber-700 dark:text-amber-400">Est. gross</span>
    </span>
  );
}

function AppDates({ cycle }) {
  const a = cycle.application || {};
  if (!a.start && !a.end) {
    return <span className="text-[11px] text-violet-600 dark:text-violet-400" title={a.note}>{UNANNOUNCED_STATUSES.has(cycle.status) ? "Not announced" : "Not captured"}</span>;
  }
  return (
    <span className="text-[11.5px] tabular-nums whitespace-nowrap" title={a.note}>
      {fmtDate(a.start) || "—"} → {fmtDate(a.end) || "—"}
    </span>
  );
}

function ApplyCell({ cycle }) {
  if (cycle.status === "APPLICATION_OPEN" && cycle.applyLink) return <ExtLink link={cycle.applyLink}>Apply</ExtLink>;
  if (UNANNOUNCED_STATUSES.has(cycle.status)) return <span className="text-[11px] text-slate-500 dark:text-slate-400">Not open</span>;
  return <span className="text-[11px] text-slate-500 dark:text-slate-400">Closed</span>;
}

function NotificationCell({ cycle, exam }) {
  if (UNANNOUNCED_STATUSES.has(cycle.status)) {
    return <ExtLink link={exam.officialSite}>Official site</ExtLink>;
  }
  return <ExtLink link={cycle.notificationLink}>Notification</ExtLink>;
}

function PayFlag({ row }) {
  if (row.pay === "below") return <Pill cls="bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300" title="Estimated in-hand is below your ₹60,000 target">▼ Below ₹60k</Pill>;
  if (row.pay === "unknown") return <Pill cls="bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400" title="No reliable in-hand estimate">Pay unverified</Pill>;
  return null;
}

const COLUMNS = [
  { key: "rank", label: "Rank", sort: "rank", cls: "w-12" },
  { key: "name", label: "Recruitment", sort: "name", cls: "min-w-[220px]" },
  { key: "org", label: "Organization", sort: "org" },
  { key: "vacancies", label: "Total Vacancies", sort: "vacancies", num: true },
  { key: "state", label: "State Vacancies (RJ / AP)", sort: "state", cls: "min-w-[130px]" },
  { key: "inHand", label: "Expected In-hand", sort: "inHand", num: true },
  { key: "gross", label: "Gross / month", sort: "gross", num: true },
  { key: "ctc", label: "Annual CTC", sort: "ctc", num: true },
  { key: "stages", label: "Exam Stages", sort: "stages", cls: "min-w-[150px]" },
  { key: "overlap", label: "IBPS PO Overlap", sort: "overlap", num: true },
  { key: "year", label: "Year", sort: "year" },
  { key: "status", label: "Status", sort: "status" },
  { key: "dates", label: "Application Dates", sort: "dates" },
  { key: "notif", label: "Official Notification" },
  { key: "apply", label: "Apply Link" },
];

function SortHeader({ col, sort, onSort }) {
  if (!col.sort) return <span>{col.label}</span>;
  const active = sort.key === col.sort;
  return (
    <button
      type="button"
      onClick={() => onSort(col.sort)}
      className={`inline-flex items-center gap-1 uppercase tracking-wider focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 rounded ${active ? "text-slate-900 dark:text-white" : ""}`}
    >
      {col.label}
      <span aria-hidden="true" className={active ? "" : "opacity-30"}>{active && sort.dir === "desc" ? "▼" : "▲"}</span>
    </button>
  );
}

export function RecruitmentTable({ rows, tab, sort, onSort, onOpen }) {
  return (
    <div className="hidden lg:block bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-3xl overflow-hidden">
      <div className="relative overflow-x-auto">
        <table className="w-full text-left min-w-[1500px]">
          <caption className="sr-only">Recruitments — select a name to open full details. Column headers sort the table.</caption>
          <thead className="bg-slate-50 dark:bg-slate-900/60">
            <tr>
              {COLUMNS.map((c, i) => (
                <th
                  key={c.key}
                  scope="col"
                  aria-sort={c.sort && sort.key === c.sort ? (sort.dir === "desc" ? "descending" : "ascending") : undefined}
                  className={`px-3 py-2.5 text-[9.5px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap ${c.cls || ""} ${
                    i < 2 ? `sticky z-10 bg-slate-50 dark:bg-slate-900 ${i === 0 ? "left-0" : "left-12"}` : ""
                  }`}
                >
                  <SortHeader col={c} sort={sort} onSort={onSort} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {rows.map((row) => {
              const { exam, cycle } = row;
              const expected = UNANNOUNCED_STATUSES.has(cycle.status);
              return (
                <tr key={row.key} className="align-top hover:bg-slate-50/70 dark:hover:bg-slate-900/40 group">
                  <td className="px-3 py-3 text-[13px] font-bold tabular-nums text-slate-500 sticky left-0 bg-white dark:bg-slate-800 group-hover:bg-slate-50 dark:group-hover:bg-slate-900" title={`Priority score ${row.score.total}/100 — pay ${row.score.parts.pay}, eligibility ${row.score.parts.eligibility}, overlap ${row.score.parts.overlap}, timing ${row.score.parts.timing}`}>
                    {row.rank[tab]}
                  </td>
                  <td className="px-3 py-3 sticky left-12 bg-white dark:bg-slate-800 group-hover:bg-slate-50 dark:group-hover:bg-slate-900 shadow-[1px_0_0_0_rgba(148,163,184,0.25)]">
                    <button
                      type="button"
                      onClick={() => onOpen(row)}
                      className="text-left text-[13px] font-bold text-slate-800 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-indigo-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 rounded"
                    >
                      {exam.name}
                    </button>
                    <p className="text-[10.5px] text-slate-500 dark:text-slate-400">{cycle.label}</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      <EligibilityBadge elig={row.elig} short />
                      <PayFlag row={row} />
                      <AutoUpdatedBadge cycle={cycle} />
                    </div>
                  </td>
                  <td className="px-3 py-3 text-[12px] text-slate-600 dark:text-slate-300 whitespace-nowrap" title={exam.organization}>{exam.orgShort}</td>
                  <td className="px-3 py-3 text-[12.5px] font-semibold text-slate-800 dark:text-slate-100"><Count fig={cycle.vacancies} estimate={row.vacancyEstimate} /></td>
                  <td className="px-3 py-3 text-[12px] text-slate-700 dark:text-slate-200"><StateVacancy row={row} /></td>
                  <td className="px-3 py-3 text-[12.5px] font-bold text-emerald-700 dark:text-emerald-300 whitespace-nowrap"><Money fig={exam.salary.inHand} emptyText="Not verified" /></td>
                  <td className="px-3 py-3 text-[12px] text-slate-600 dark:text-slate-300 whitespace-nowrap"><Money fig={exam.salary.gross} emptyText="Not verified" /></td>
                  <td className="px-3 py-3 text-[12px] text-slate-600 dark:text-slate-300 whitespace-nowrap"><AnnualCtc exam={exam} /></td>
                  <td className="px-3 py-3 text-[11px] text-slate-600 dark:text-slate-300">{exam.stages.join(" → ")}</td>
                  <td className="px-3 py-3 text-[12px] tabular-nums text-slate-700 dark:text-slate-200" title={exam.overlap.note}>~{exam.overlap.pct}% <span className="text-[9px] font-bold uppercase text-amber-700 dark:text-amber-400">Est.</span></td>
                  <td className="px-3 py-3 text-[12px] tabular-nums text-slate-700 dark:text-slate-200">{cycle.year}{expected && <span className="block text-[9.5px] font-semibold text-violet-600 dark:text-violet-400">expected</span>}</td>
                  <td className="px-3 py-3"><StatusBadge cycle={cycle} /></td>
                  <td className="px-3 py-3 text-slate-700 dark:text-slate-200"><AppDates cycle={cycle} /></td>
                  <td className="px-3 py-3 text-[11.5px]"><NotificationCell cycle={cycle} exam={exam} /></td>
                  <td className="px-3 py-3 text-[11.5px]"><ApplyCell cycle={cycle} /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function RecruitmentCards({ rows, tab, onOpen }) {
  return (
    <ul className="lg:hidden grid sm:grid-cols-2 gap-3" aria-label="Recruitments">
      {rows.map((row) => {
        const { exam, cycle } = row;
        return (
          <li key={row.key} className="bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-[11px] font-bold text-slate-400 tabular-nums">#{row.rank[tab]} · {exam.orgShort} · {cycle.year}</p>
                <button
                  type="button"
                  onClick={() => onOpen(row)}
                  className="text-left text-[15px] font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 rounded"
                >
                  {exam.name}
                </button>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">{cycle.label}</p>
              </div>
              <StatusBadge cycle={cycle} />
            </div>
            <div className="flex flex-wrap gap-1">
              <EligibilityBadge elig={row.elig} short />
              <PayFlag row={row} />
              <AutoUpdatedBadge cycle={cycle} />
            </div>
            <dl className="grid grid-cols-2 gap-x-3 gap-y-2 text-[12px]">
              <div>
                <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">In-hand / month</dt>
                <dd className="font-bold text-emerald-700 dark:text-emerald-300"><Money fig={exam.salary.inHand} emptyText="Not verified" /></dd>
              </div>
              <div>
                <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Gross / month</dt>
                <dd className="text-slate-700 dark:text-slate-200"><Money fig={exam.salary.gross} emptyText="Not verified" /></dd>
              </div>
              <div>
                <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Vacancies</dt>
                <dd className="font-semibold text-slate-800 dark:text-slate-100"><Count fig={cycle.vacancies} estimate={row.vacancyEstimate} /></dd>
              </div>
              <div>
                <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">State (RJ / AP)</dt>
                <dd className="text-slate-700 dark:text-slate-200"><StateVacancy row={row} /></dd>
              </div>
              <div>
                <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">PO overlap</dt>
                <dd className="text-slate-700 dark:text-slate-200">~{exam.overlap.pct}% <span className="text-[9px] font-bold text-amber-700 dark:text-amber-400">EST.</span></dd>
              </div>
              <div>
                <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Applications</dt>
                <dd className="text-slate-700 dark:text-slate-200"><AppDates cycle={cycle} /></dd>
              </div>
            </dl>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">{exam.stages.join(" → ")}</p>
            <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100 dark:border-slate-700">
              <span className="text-[11.5px] flex gap-3">
                <NotificationCell cycle={cycle} exam={exam} />
                <ApplyCell cycle={cycle} />
              </span>
              <button
                type="button"
                onClick={() => onOpen(row)}
                className="text-[11.5px] font-semibold px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
              >
                Full details
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
