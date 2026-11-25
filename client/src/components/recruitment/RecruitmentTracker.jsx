import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import api from "../../api/axios";
import bundled from "../../data/recruitment/index.js";
import { TABS, UNANNOUNCED_STATUSES, SCHEMA_VERSION } from "../../data/recruitment/model.js";
import {
  buildRows, enrichRows, matchesFilters, matchesSearch, sortRows, summarise, inr, fmtDate, DEFAULT_FILTERS,
} from "../../utils/recruitment.js";
import { RecruitmentTable, RecruitmentCards } from "./RecruitmentTable.jsx";
import RecruitmentFilters from "./RecruitmentFilters.jsx";
import RecruitmentDetail from "./RecruitmentDetail.jsx";
import { Collapsible, ProvenanceLegend, Pill, Count } from "./ui.jsx";
import OnlineCheckPanel from "./OnlineCheckPanel.jsx";
import { useOnlineCheck } from "./useOnlineCheck.js";

// Government & Banking Jobs Tracker — one page, three tabs.
//
// Data: the bundled dataset renders immediately (and offline); /api/govt-exams
// is then asked for a newer copy so figures can be corrected server-side
// without a frontend release. A server copy with a different schemaVersion is
// ignored rather than half-rendered.

const TAB_IDS = Object.keys(TABS);
const DOB_KEY = "recruitmentTracker.dob";
const TAB_KEY = "recruitmentTracker.tab";

const TAB_STYLE = {
  po: { on: "bg-amber-500 text-white border-amber-500 shadow-amber-500/20", off: "hover:border-amber-300 dark:hover:border-amber-700", ring: "focus-visible:ring-amber-400" },
  clerk: { on: "bg-sky-600 text-white border-sky-600 shadow-sky-600/20", off: "hover:border-sky-300 dark:hover:border-sky-700", ring: "focus-visible:ring-sky-400" },
  other: { on: "bg-violet-600 text-white border-violet-600 shadow-violet-600/20", off: "hover:border-violet-300 dark:hover:border-violet-700", ring: "focus-visible:ring-violet-400" },
};

const DESC_FIRST = new Set(["vacancies", "state", "inHand", "gross", "ctc", "overlap", "stages"]);
const SORT_LABEL = {
  rank: "rank", name: "name", org: "organization", vacancies: "total vacancies", state: "RJ + AP vacancies",
  inHand: "in-hand", gross: "gross", ctc: "annual CTC", stages: "number of stages", overlap: "PO overlap",
  year: "year", status: "status", dates: "application date", eligibility: "eligibility",
};

const readLocal = (k, fallback) => {
  try { return localStorage.getItem(k) ?? fallback; } catch { return fallback; }
};
const writeLocal = (k, v) => {
  try { v ? localStorage.setItem(k, v) : localStorage.removeItem(k); } catch { /* private mode */ }
};

function Stat({ label, value, hint }) {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/60 dark:bg-slate-900/30 p-3.5">
      <p className="text-xl md:text-2xl font-bold text-slate-800 dark:text-slate-100 tabular-nums">{value}</p>
      <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-0.5">{label}</p>
      {hint && <p className="text-[10.5px] text-slate-400 dark:text-slate-500 mt-0.5">{hint}</p>}
    </div>
  );
}

export default function RecruitmentTracker({ onOpenMockTest }) {
  const [data, setData] = useState(bundled);
  const [source, setSource] = useState("bundled"); // bundled | live
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [tab, setTab] = useState(() => (TAB_IDS.includes(readLocal(TAB_KEY)) ? readLocal(TAB_KEY) : "po"));
  const [dob, setDob] = useState(() => readLocal(DOB_KEY, ""));
  const [q, setQ] = useState("");
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [sort, setSort] = useState({ key: "rank", dir: "asc" });
  const [openKey, setOpenKey] = useState(null);
  const tabRefs = useRef({});

  // Pull the server copy (base data + verified online updates).
  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: fresh } = await api.get("/govt-exams");
      if (fresh?.schemaVersion === SCHEMA_VERSION && fresh.exams?.length) {
        setData(fresh);
        setSource("live");
      } else {
        // Reachable but an older / different shape — keep the bundle.
        setSource("bundled");
        setError("The server copy is in an older format — showing the bundled data.");
      }
    } catch {
      setError("Couldn't reach the server — showing the bundled data, which may be out of date.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);
  // Refresh = run (or join) the online check; it reloads the data when done.
  const online = useOnlineCheck(loadData);
  const checking = online.phase === "starting" || online.phase === "running";
  useEffect(() => writeLocal(TAB_KEY, tab), [tab]);
  useEffect(() => writeLocal(DOB_KEY, dob), [dob]);

  const profile = data.profile;
  const allRows = useMemo(() => enrichRows(buildRows(data), profile, dob || null, TAB_IDS), [data, profile, dob]);
  const summary = useMemo(() => summarise(allRows), [allRows]);

  const tabRows = useMemo(() => allRows.filter((r) => r.tabs.includes(tab)), [allRows, tab]);
  const searchCounts = useMemo(
    () => Object.fromEntries(TAB_IDS.map((t) => [t, allRows.filter((r) => r.tabs.includes(t) && matchesSearch(r, q)).length])),
    [allRows, q]
  );
  const visible = useMemo(() => {
    const filtered = tabRows.filter((r) => matchesSearch(r, q) && matchesFilters(r, filters, profile.targetInHand));
    return sortRows(filtered, sort.key, sort.dir, tab);
  }, [tabRows, q, filters, sort, tab, profile.targetInHand]);

  const forecast = useMemo(
    () => [...new Map(allRows.filter((r) => UNANNOUNCED_STATUSES.has(r.cycle.status)).map((r) => [r.key, r])).values()]
      .sort((a, b) => ({ High: 0, Medium: 1, Low: 2 }[a.cycle.forecast?.level] ?? 3) - ({ High: 0, Medium: 1, Low: 2 }[b.cycle.forecast?.level] ?? 3) || a.exam.name.localeCompare(b.exam.name)),
    [allRows]
  );

  const openRow = allRows.find((r) => r.key === openKey) || null;
  const siblings = openRow ? allRows.filter((r) => r.exam.id === openRow.exam.id).sort((a, b) => a.cycle.year - b.cycle.year) : [];

  const onSort = (key) =>
    setSort((s) => (s.key === key ? { key, dir: s.dir === "asc" ? "desc" : "asc" } : { key, dir: DESC_FIRST.has(key) ? "desc" : "asc" }));

  const switchTab = (t) => {
    setTab(t);
    setFilters(DEFAULT_FILTERS); // option lists differ per tab
  };

  const onTabKey = (e) => {
    const i = TAB_IDS.indexOf(tab);
    let next = null;
    if (e.key === "ArrowRight") next = TAB_IDS[(i + 1) % TAB_IDS.length];
    if (e.key === "ArrowLeft") next = TAB_IDS[(i - 1 + TAB_IDS.length) % TAB_IDS.length];
    if (e.key === "Home") next = TAB_IDS[0];
    if (e.key === "End") next = TAB_IDS[TAB_IDS.length - 1];
    if (next) {
      e.preventDefault();
      switchTab(next);
      tabRefs.current[next]?.focus();
    }
  };

  const otherTabHits = TAB_IDS.filter((t) => t !== tab && q.trim() && searchCounts[t] > 0);
  const closeDetail = useCallback(() => setOpenKey(null), []);

  if (!data?.exams?.length) {
    return (
      <div role="alert" className="bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-3xl p-8 text-center space-y-3">
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Recruitment data could not be loaded.</p>
        <button type="button" onClick={loadData} className="text-xs font-semibold px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700">Retry</button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header + summary */}
      <section className="bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-3xl p-5 md:p-7 space-y-5" aria-labelledby="rt-title">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-1 min-w-0">
            <h2 id="rt-title" className="text-xl md:text-2xl font-bold text-slate-800 dark:text-slate-100">Government &amp; Banking Jobs Tracker</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Explore eligible government, banking and PSU recruitment opportunities.</p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Pill
              cls={source === "live" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300" : "bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300"}
              title={source === "live" ? "Fetched from the server" : "Using the copy bundled with the app"}
            >
              {source === "live" ? "Live data" : "Bundled data"} · updated {fmtDate(data.updated)}
            </Pill>
            <button
              type="button"
              onClick={() => online.start(false)}
              disabled={checking}
              title="Check the recruiters online for new notifications and updates"
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 disabled:opacity-50 inline-flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
            >
              <span aria-hidden="true" className={checking ? "inline-block animate-spin" : ""}>↻</span>
              {checking ? "Checking online…" : "Refresh"}
            </button>
          </div>
        </div>

        <div aria-live="polite" className="empty:hidden">
          {error && <p className="text-[12px] text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 rounded-xl px-3 py-2">{error}</p>}
        </div>

        <OnlineCheckPanel
          phase={online.phase}
          run={online.run}
          info={online.info}
          onForce={() => online.start(true)}
          onDismiss={online.dismiss}
          lastCheckedAt={data.onlineCheck?.lastCheckedAt}
        />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Stat label="Total recruitments" value={summary.total} hint={`${summary.examsCount} exams · 2026 & 2027 cycles`} />
          <Stat label="Currently open applications" value={summary.open} hint={summary.open === 0 ? `None open as of ${fmtDate(data.updated)}` : undefined} />
          <Stat label="Expected 2027 recruitments" value={summary.expected2027} hint="Forecast — not announced" />
          <Stat label="Avg. expected in-hand" value={summary.avgInHand ? `≈${inr(summary.avgInHand)}` : "—"} hint={`Estimate · ${summary.avgInHandBasis} exams with a figure`} />
        </div>

        {/* Profile */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/40 p-4 space-y-3">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div className="space-y-1.5 min-w-0">
              <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Eligibility is matched against your profile</p>
              <div className="flex flex-wrap gap-1.5">
                {[profile.qualification, `Graduation ≈${profile.graduationPct}%`, profile.experience, profile.category, `${profile.state} (location) · tracking ${(profile.preferredStates || [profile.state]).join(" & ")}`, `Current ${profile.currentSalary}`, `Target ₹${profile.targetInHand.toLocaleString("en-IN")}+ in-hand`].map((t) => (
                  <span key={t} className="text-[11px] px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">{t}</span>
                ))}
              </div>
            </div>
            <label className="flex flex-col gap-1 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Date of birth (for age checks)
              <input
                type="date"
                value={dob}
                max={data.updated}
                onChange={(e) => setDob(e.target.value)}
                className="text-[13px] font-semibold normal-case tracking-normal px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-indigo-400 focus:outline-none [color-scheme:light] dark:[color-scheme:dark]"
              />
            </label>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            {dob ? "Age is checked against each cycle's cut-off date, with the +3-year OBC-NCL relaxation." : "Add your date of birth to check age limits — until then, age is shown as 'verify'."}{" "}
            Stored only in this browser. Preferences: {profile.preferences.join(" · ")}.
          </p>
        </div>
      </section>

      {/* Tabs */}
      <div role="tablist" aria-label="Job categories" className="grid grid-cols-1 sm:grid-cols-3 gap-2" onKeyDown={onTabKey}>
        {TAB_IDS.map((t) => {
          const active = t === tab;
          const meta = TABS[t];
          const total = allRows.filter((r) => r.tabs.includes(t)).length;
          return (
            <button
              key={t}
              ref={(el) => { tabRefs.current[t] = el; }}
              role="tab"
              id={`rt-tab-${t}`}
              aria-selected={active}
              aria-controls={`rt-panel-${t}`}
              tabIndex={active ? 0 : -1}
              onClick={() => switchTab(t)}
              className={`flex items-center justify-between gap-2 px-4 py-3 rounded-2xl border-2 text-left transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 ${TAB_STYLE[t].ring} ${
                active ? `${TAB_STYLE[t].on} shadow-lg` : `bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 ${TAB_STYLE[t].off}`
              }`}
            >
              <span className="flex items-center gap-2 min-w-0">
                <span aria-hidden="true" className="text-lg">{meta.icon}</span>
                <span className="text-sm font-bold truncate">{meta.label}</span>
              </span>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full tabular-nums ${active ? "bg-white/25" : "bg-slate-100 dark:bg-slate-700"}`}>
                {q.trim() ? `${searchCounts[t]}/${total}` : total}
              </span>
            </button>
          );
        })}
      </div>

      {/* Panel */}
      <section id={`rt-panel-${tab}`} role="tabpanel" aria-labelledby={`rt-tab-${tab}`} className="space-y-4">
        <div className="bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-3xl p-4 md:p-5 space-y-3">
          <div className="flex flex-col sm:flex-row gap-2">
            <label className="relative flex-1">
              <span className="sr-only">Search recruitments in all tabs</span>
              <input
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search all recruitments — e.g. SBI, LIC AAO, RBI, insurance…"
                className="w-full text-[13px] pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              />
              <span aria-hidden="true" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">⌕</span>
            </label>
          </div>
          <RecruitmentFilters key={tab} rows={tabRows} filters={filters} setFilters={setFilters} />
          <ProvenanceLegend />
        </div>

        <p className="text-[12px] text-slate-500 dark:text-slate-400" aria-live="polite">
          Showing <strong className="text-slate-700 dark:text-slate-200">{visible.length}</strong> of {tabRows.length} in {TABS[tab].label}
          {sort.key !== "rank" && <> · sorted by {SORT_LABEL[sort.key] || sort.key} ({sort.dir === "desc" ? "high → low" : "low → high"}) <button type="button" className="text-indigo-600 dark:text-indigo-300 hover:underline" onClick={() => setSort({ key: "rank", dir: "asc" })}>reset to rank</button></>}
          {otherTabHits.length > 0 && (
            <>
              {" "}· also matches in{" "}
              {otherTabHits.map((t, i) => (
                <span key={t}>
                  {i > 0 && ", "}
                  <button type="button" onClick={() => switchTab(t)} className="font-semibold text-indigo-600 dark:text-indigo-300 hover:underline">
                    {TABS[t].short} ({searchCounts[t]})
                  </button>
                </span>
              ))}
            </>
          )}
        </p>

        {/* Mobile sort */}
        <div className="lg:hidden flex items-center gap-2">
          <label htmlFor="rt-mobile-sort" className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Sort</label>
          <select
            id="rt-mobile-sort"
            value={`${sort.key}:${sort.dir}`}
            onChange={(e) => { const [key, dir] = e.target.value.split(":"); setSort({ key, dir }); }}
            className="text-[12px] font-semibold px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 [color-scheme:light] dark:[color-scheme:dark]"
          >
            <option value="rank:asc">Priority rank</option>
            <option value="inHand:desc">In-hand (high → low)</option>
            <option value="vacancies:desc">Vacancies (high → low)</option>
            <option value="overlap:desc">PO overlap (high → low)</option>
            <option value="year:asc">Year</option>
            <option value="status:asc">Status</option>
            <option value="name:asc">Name (A–Z)</option>
          </select>
        </div>

        {loading && source === "bundled" && !error && (
          <p className="text-[11.5px] text-slate-400 inline-flex items-center gap-2" role="status">
            <span className="w-3 h-3 rounded-full border-2 border-slate-300 border-t-indigo-500 animate-spin" aria-hidden="true" />
            Checking the server for newer figures…
          </p>
        )}

        {visible.length === 0 ? (
          <div className="bg-white dark:bg-slate-800/80 border border-dashed border-slate-300 dark:border-slate-700 rounded-3xl p-10 text-center space-y-2">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">No recruitments match{q.trim() ? ` “${q.trim()}”` : ""} with these filters.</p>
            <p className="text-[12px] text-slate-500 dark:text-slate-400">Try clearing a filter{otherTabHits.length ? " or check the other tabs" : ""}.</p>
            <button type="button" onClick={() => { setFilters(DEFAULT_FILTERS); setQ(""); }} className="text-xs font-semibold px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400">
              Clear search &amp; filters
            </button>
          </div>
        ) : (
          <>
            <RecruitmentTable rows={visible} tab={tab} sort={sort} onSort={onSort} onOpen={(r) => setOpenKey(r.key)} />
            <RecruitmentCards rows={visible} tab={tab} onOpen={(r) => setOpenKey(r.key)} />
          </>
        )}

        <p className="text-[11px] text-slate-400 dark:text-slate-500">
          Rank = priority score out of 100: estimated in-hand (40), eligibility (30), IBPS PO overlap (15), and whether the cycle can still be applied for (15). Hover a rank for its breakdown.
          {tab === "clerk" && " Every clerk / assistant post here pays below your ₹60,000 in-hand target — they are listed as fallbacks and flagged on each row."}
        </p>
      </section>

      {/* 2027 forecast */}
      <section className="bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-3xl p-5 md:p-7 space-y-4" aria-labelledby="rt-forecast">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="space-y-1">
            <h3 id="rt-forecast" className="text-lg font-bold text-slate-800 dark:text-slate-100">2027 recruitment forecast</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Expected cycles inferred from each recruiter's history. Vacancy estimates are simply the range of recent official totals — not a prediction.</p>
          </div>
          <Pill cls="bg-violet-100 text-violet-800 dark:bg-violet-900/50 dark:text-violet-300">Expected — not officially announced</Pill>
        </div>
        <div className="relative overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-700">
          <table className="w-full text-left min-w-[640px]">
            <caption className="sr-only">Expected recruitments with confidence and historical basis</caption>
            <thead className="bg-slate-50 dark:bg-slate-900/40">
              <tr className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <th scope="col" className="px-4 py-2">Recruitment</th>
                <th scope="col" className="px-4 py-2">Confidence</th>
                <th scope="col" className="px-4 py-2">Historical basis</th>
                <th scope="col" className="px-4 py-2">Est. vacancies</th>
                <th scope="col" className="px-4 py-2">Last vacancies</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {forecast.map((r) => {
                const last = r.exam.history?.[r.exam.history.length - 1];
                const lvl = r.cycle.forecast?.level;
                return (
                  <tr key={r.key} className="align-top">
                    <td className="px-4 py-2.5">
                      <button type="button" onClick={() => setOpenKey(r.key)} className="text-left text-[12.5px] font-semibold text-slate-800 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-indigo-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 rounded">
                        {r.exam.name}
                      </button>
                      <span className="block text-[10.5px] text-slate-500 dark:text-slate-400">{r.cycle.label}</span>
                    </td>
                    <td className="px-4 py-2.5">
                      <Pill cls={lvl === "High" ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300" : lvl === "Medium" ? "bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300" : "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300"}>{lvl || "—"}</Pill>
                    </td>
                    <td className="px-4 py-2.5 text-[12px] text-slate-600 dark:text-slate-300">{r.cycle.forecast?.basis}</td>
                    <td className="px-4 py-2.5 text-[12px] font-semibold whitespace-nowrap"><Count fig={r.cycle.vacancies} estimate={r.vacancyEstimate} compact /></td>
                    <td className="px-4 py-2.5 text-[12px] text-slate-600 dark:text-slate-300 whitespace-nowrap">
                      {last ? <>{last.vacancies.value?.toLocaleString("en-IN")} <span className="text-[10px] text-sky-700 dark:text-sky-400 font-bold uppercase">({last.year})</span></> : "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Excluded */}
      <Collapsible title="Recruitments left out by your preferences" subtitle={`${data.excluded?.length || 0} categories — so the omissions are visible`}>
        <ul className="space-y-2">
          {(data.excluded || []).map((x) => (
            <li key={x.name} className="text-[12.5px]">
              <span className="font-semibold text-slate-800 dark:text-slate-100">{x.name}</span>{" "}
              <Pill cls="bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">{x.rule}</Pill>
              <span className="block text-slate-500 dark:text-slate-400">{x.reason}</span>
            </li>
          ))}
        </ul>
      </Collapsible>

      <p className="text-[11px] text-slate-400 dark:text-slate-500 leading-relaxed">{data.researchNote} Nothing on this page is an official recruitment notice.</p>

      {openRow && (
        <RecruitmentDetail
          row={openRow}
          siblings={siblings}
          onSelect={(r) => setOpenKey(r.key)}
          onClose={closeDetail}
          onOpenMockTest={onOpenMockTest}
        />
      )}
    </div>
  );
}
