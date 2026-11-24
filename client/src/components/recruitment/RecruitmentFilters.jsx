import { useMemo, useState } from "react";
import Select from "../Select";
import { STATUS, ELIGIBILITY, POST_TYPE } from "../../data/recruitment/model.js";
import { DEFAULT_FILTERS, activeFilterCount } from "../../utils/recruitment.js";

// Filter bar. Option lists for organisation / post type / year are derived from
// the rows in the current tab, so a filter never offers a value that would
// always return nothing.

export default function RecruitmentFilters({ rows, filters, setFilters }) {
  const [open, setOpen] = useState(false);
  const set = (k) => (v) => setFilters((f) => ({ ...f, [k]: v }));
  const count = activeFilterCount(filters);

  const opts = useMemo(() => {
    const uniq = (xs) => [...new Set(xs)];
    return {
      year: uniq(rows.map((r) => String(r.cycle.year))).sort(),
      org: uniq(rows.map((r) => r.exam.orgShort)).sort(),
      postType: uniq(rows.map((r) => r.exam.postType)),
      status: uniq(rows.map((r) => r.cycle.status)).sort((a, b) => STATUS[a].order - STATUS[b].order),
    };
  }, [rows]);

  const controls = [
    { k: "year", label: "Recruitment year", options: [{ value: "all", label: "All years" }, ...opts.year.map((y) => ({ value: y, label: y }))] },
    { k: "org", label: "Organization", options: [{ value: "all", label: "All organizations" }, ...opts.org.map((o) => ({ value: o, label: o }))] },
    { k: "postType", label: "Post type", options: [{ value: "all", label: "All post types" }, ...opts.postType.map((p) => ({ value: p, label: POST_TYPE[p] }))] },
    { k: "salary", label: "In-hand salary", options: [
      { value: "all", label: "Any salary" },
      { value: "target", label: "₹60k+ (your target)" },
      { value: "100k", label: "₹1 lakh+" },
      { value: "below", label: "Below ₹60k" },
      { value: "unknown", label: "Not verified" },
    ] },
    { k: "vacancy", label: "Vacancies", options: [
      { value: "all", label: "Any vacancy count" },
      { value: "1000", label: "1,000+" },
      { value: "100", label: "100–999" },
      { value: "lt100", label: "Under 100" },
      { value: "na", label: "Not announced (estimate shown)" },
    ] },
    { k: "status", label: "Status", options: [{ value: "all", label: "Any status" }, ...opts.status.map((s) => ({ value: s, label: STATUS[s].label }))] },
    { k: "eligibility", label: "Eligibility", options: [{ value: "all", label: "Any eligibility" }, ...Object.entries(ELIGIBILITY).map(([k, v]) => ({ value: k, label: v.label }))] },
    { k: "stages", label: "Exam stages", options: [
      { value: "all", label: "Any stages" },
      { value: "interview", label: "Has interview" },
      { value: "no-interview", label: "No interview" },
    ] },
    { k: "scope", label: "Vacancy scope", options: [
      { value: "all", label: "State-wise & All-India" },
      { value: "state", label: "State / RRB / office-wise" },
      { value: "india", label: "All-India / bank-wise" },
    ] },
    { k: "overlap", label: "IBPS PO overlap", options: [
      { value: "all", label: "Any overlap" },
      { value: "80", label: "80%+" },
      { value: "60", label: "60–79%" },
      { value: "lt60", label: "Under 60%" },
    ] },
  ];

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2 lg:hidden">
        <button
          type="button"
          aria-expanded={open}
          aria-controls="rt-filter-grid"
          onClick={() => setOpen((v) => !v)}
          className="text-xs font-semibold px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
        >
          {open ? "Hide filters" : "Show filters"}{count > 0 && ` (${count})`}
        </button>
      </div>
      <div id="rt-filter-grid" className={`${open ? "grid" : "hidden"} lg:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2`}>
        {controls.map((c) => (
          <div key={c.k} className="space-y-1">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">{c.label}</span>
            <Select value={filters[c.k]} onChange={set(c.k)} options={c.options} ariaLabel={c.label} />
          </div>
        ))}
      </div>
      {count > 0 && (
        <button
          type="button"
          onClick={() => setFilters(DEFAULT_FILTERS)}
          className="text-[11.5px] font-semibold text-indigo-600 dark:text-indigo-300 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 rounded"
        >
          Clear {count} filter{count > 1 ? "s" : ""}
        </button>
      )}
    </div>
  );
}
