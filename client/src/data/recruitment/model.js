// Recruitment tracker — data model.
//
// The project is plain JS, so the "types" live here as JSDoc typedefs plus the
// enum objects every other module imports. Keep enum KEYS stable: they are
// persisted in the server copy of the dataset (server/data/govt-exams.json) and
// in the user's saved profile.
//
// ── The one rule the whole dataset follows ─────────────────────────────────
// Every number that could mislead carries a provenance tag:
//   OFFICIAL      — published in the recruiter's own notification for that cycle
//   HISTORICAL    — official, but from an EARLIER cycle (shown for reference)
//   ESTIMATED     — derived or reported by secondary sources; never official
//   NOT_ANNOUNCED — the recruiter has not published it; the UI says so
// A null value with no provenance renders as "Not announced". Nothing is
// guessed to fill a cell.

/** @typedef {"OFFICIAL"|"HISTORICAL"|"ESTIMATED"|"NOT_ANNOUNCED"} Provenance */

/**
 * A figure that carries where it came from.
 * @typedef {Object} Figure
 * @property {number|null} value
 * @property {number} [max]            upper end when the figure is a range
 * @property {Provenance} provenance
 * @property {string} [note]           basis, source or caveat shown on hover / in details
 */

/**
 * @typedef {Object} PatternSection
 * @property {string} subject
 * @property {number|null} questions   null = not published / not verified
 * @property {number|null} marks
 * @property {number|null} minutes     null = composite timing (see pattern.totalMinutes)
 * @property {string} [note]
 */

/**
 * @typedef {Object} StagePattern
 * @property {string} stage            "Prelims" | "Mains" | "Phase I" | ...
 * @property {PatternSection[]} sections
 * @property {number|null} totalQuestions
 * @property {number|null} totalMarks
 * @property {number|null} totalMinutes
 * @property {boolean|null} sectionalTiming
 * @property {string} negative         e.g. "¼ of the marks for the question"
 * @property {string} [sectionalCutoff]
 * @property {string} [overallCutoff]
 * @property {boolean} [qualifyingOnly] marks not counted in the final merit
 * @property {string} [note]
 */

/**
 * @typedef {Object} SyllabusSubject
 * @property {string} subject
 * @property {string} [questions]      e.g. "≈10–15 Qs" — typical spread, not official
 * @property {{topic:string, sub?:string[]}[]} topics
 */

/**
 * @typedef {Object} Cycle
 * @property {string} id
 * @property {number} year              recruitment year shown in the table (2026 / 2027)
 * @property {string} label             e.g. "CRP PO/MT-XVI (2026–27)"
 * @property {keyof typeof STATUS} status
 * @property {boolean} [statusVerified] false = inferred from the timeline, not confirmed
 * @property {string} [statusNote]
 * @property {Figure} vacancies
 * @property {Object<string, {unit?:string, value:number|null, provenance:Provenance, note?:string}>} [states]
 *           keyed by state name (see TRACKED_STATES); omitted for All-India / bank-wise recruitments
 * @property {Object} [categoryVacancies] {general, obc, sc, st, ews, provenance, note}
 * @property {{start?:string, end?:string, provenance:Provenance, note?:string}} application
 * @property {{text:string, provenance:Provenance}} [examDates]
 * @property {{url:string, label:string}|null} notificationLink
 * @property {{url:string, label:string}|null} applyLink
 * @property {{level:"High"|"Medium"|"Low", basis:string}} [forecast]  only for expected cycles
 * @property {{name:string, url:string}[]} [sources]
 */

export const TABS = {
  po: { id: "po", label: "PO / Officer Jobs", short: "PO / Officer", icon: "🏦", accent: "amber" },
  clerk: { id: "clerk", label: "Clerk Jobs", short: "Clerk", icon: "🧾", accent: "sky" },
  other: { id: "other", label: "Other Government & PSU Jobs", short: "Other Jobs", icon: "🏛️", accent: "violet" },
};

export const STATUS = {
  APPLICATION_OPEN: { label: "Application Open", order: 0, cls: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300" },
  NOTIFICATION_RELEASED: { label: "Notification Released", order: 1, cls: "bg-teal-100 text-teal-800 dark:bg-teal-900/50 dark:text-teal-300" },
  EXAM_SCHEDULED: { label: "Exam Scheduled", order: 2, cls: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300" },
  RESULT_AWAITED: { label: "Result Awaited", order: 3, cls: "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300" },
  UPCOMING: { label: "Upcoming", order: 4, cls: "bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300" },
  EXPECTED_2027: { label: "Expected 2027", order: 5, cls: "bg-violet-100 text-violet-800 dark:bg-violet-900/50 dark:text-violet-300" },
  RECRUITMENT_COMPLETED: { label: "Recruitment Completed", order: 6, cls: "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300" },
};

// Statuses that mean "the recruiter has NOT announced this cycle". The UI
// must never present these with official-looking figures.
export const UNANNOUNCED_STATUSES = new Set(["UPCOMING", "EXPECTED_2027"]);

export const ELIGIBILITY = {
  ELIGIBLE: { label: "Eligible", order: 0, cls: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300", dot: "●" },
  LIKELY: { label: "Likely Eligible – Verify Notification", short: "Likely – verify", order: 1, cls: "bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300", dot: "◐" },
  NOT_CONFIRMED: { label: "Eligibility Not Confirmed", short: "Not confirmed", order: 2, cls: "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300", dot: "○" },
  NOT_ELIGIBLE: { label: "Not Eligible", order: 3, cls: "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300", dot: "✕" },
};

export const PROVENANCE = {
  OFFICIAL: { label: "Official", cls: "text-emerald-700 dark:text-emerald-400", tip: "Published in the recruiter's notification for this cycle (as reported — verify against the PDF)." },
  HISTORICAL: { label: "Historical", cls: "text-sky-700 dark:text-sky-400", tip: "Official figure from an earlier cycle — reference only, not this cycle's number." },
  ESTIMATED: { label: "Estimated", cls: "text-amber-700 dark:text-amber-400", tip: "Derived or reported by secondary sources. Not an official figure." },
  NOT_ANNOUNCED: { label: "Not announced", cls: "text-violet-700 dark:text-violet-400", tip: "The recruiter has not published this." },
};

// States whose vacancy figures the tracker shows, in column order. Adding a
// state here adds it to the table, cards and detail view; the cycle data then
// needs a `states["<name>"]` entry wherever a figure is published.
export const TRACKED_STATES = [
  { name: "Rajasthan", short: "RJ" },
  { name: "Andhra Pradesh", short: "AP" },
];

export const VACANCY_SCOPE = {
  ALL_INDIA: "All India merit",
  BANK_WISE: "Bank-wise",
  STATE_WISE: "State-wise",
  RRB_WISE: "RRB / state-wise",
  OFFICE_WISE: "Office / zone-wise",
};

export const POST_TYPE = {
  BANK_OFFICER: "Bank Officer",
  REGULATOR_OFFICER: "Regulator / DFI Officer",
  INSURANCE_OFFICER: "Insurance Officer",
  CLERK: "Clerk / Assistant",
  INSURANCE_ASSISTANT: "Insurance Assistant",
  GOVT_OFFICER: "Govt. Social-Security Officer",
};

// Small constructors so the data files stay readable. They only shape
// objects; they never fill in a value that was not given.
export const official = (value, note, max) => ({ value, provenance: "OFFICIAL", ...(max != null && { max }), ...(note && { note }) });
export const historical = (value, note, max) => ({ value, provenance: "HISTORICAL", ...(max != null && { max }), ...(note && { note }) });
export const estimated = (value, max, note) => ({ value, provenance: "ESTIMATED", ...(max != null && { max }), ...(note && { note }) });
export const notAnnounced = (note) => ({ value: null, provenance: "NOT_ANNOUNCED", ...(note && { note }) });

export const SCHEMA_VERSION = 2;
