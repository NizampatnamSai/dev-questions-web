// Recruitment tracker logic — kept out of the components so it can be read,
// changed and reasoned about on its own: row building, the eligibility
// matcher, priority ranking, filters, sorting and formatting.

import { STATUS, ELIGIBILITY, UNANNOUNCED_STATUSES, TRACKED_STATES } from "../data/recruitment/model.js";

// ── formatting ───────────────────────────────────────────────────────────────
export function inr(n) {
  if (n == null) return null;
  if (n >= 100000) return `₹${(n / 100000).toFixed(2).replace(/\.?0+$/, "")}L`;
  return `₹${Math.round(n).toLocaleString("en-IN")}`;
}

export function inrFull(n) {
  return n == null ? null : `₹${Math.round(n).toLocaleString("en-IN")}`;
}

/** "₹65,000–77,000" style text for a Figure, or null when there is no value. */
export function figureText(fig, { full = false } = {}) {
  if (!fig || fig.value == null) return null;
  const f = full ? inrFull : inr;
  if (fig.max != null && fig.max !== fig.value) return `${f(fig.value)}–${f(fig.max).replace("₹", "")}`;
  return f(fig.value);
}

export function fmtDate(iso) {
  if (!iso) return null;
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

/** Midpoint of a Figure (used for sorting / averaging), or null. */
export function mid(fig) {
  if (!fig || fig.value == null) return null;
  return fig.max != null ? (fig.value + fig.max) / 2 : fig.value;
}

// ── rows ─────────────────────────────────────────────────────────────────────
/** One row per (exam, cycle). A row can belong to more than one tab. */
export function buildRows(dataset) {
  const rows = [];
  for (const exam of dataset.exams || []) {
    for (const cycle of exam.cycles || []) {
      rows.push({ key: `${exam.id}:${cycle.id}`, exam, cycle, tabs: exam.tabs });
    }
  }
  return rows;
}

// ── vacancy estimates ────────────────────────────────────────────────────────
/**
 * Estimated total for a cycle whose vacancies are not announced.
 *
 * Deliberately mechanical so it can be checked: the range (min–max) of the
 * exam's last three official totals before this cycle — its `history` plus any
 * earlier cycle with a published figure. No trend line, no growth factor, and
 * no estimate at all when there is no past figure to base one on.
 * Returns a Figure tagged ESTIMATED, with `basis` listing the inputs, or null.
 */
export function estimateVacancies(exam, cycle) {
  if (cycle.vacancies?.value != null) return null;
  const byYear = new Map();
  for (const h of exam.history || []) {
    if (h.year < cycle.year && h.vacancies?.value != null) byYear.set(h.year, h.vacancies);
  }
  for (const c of exam.cycles || []) {
    // A published cycle wins over a history entry for the same year.
    if (c.year < cycle.year && c.vacancies?.value != null && c.vacancies.provenance === "OFFICIAL") byYear.set(c.year, c.vacancies);
  }
  const recent = [...byYear.entries()].sort((a, b) => a[0] - b[0]).slice(-3);
  if (!recent.length) return null;
  const vals = recent.flatMap(([, f]) => (f.max != null ? [f.value, f.max] : [f.value]));
  const lo = Math.min(...vals);
  const hi = Math.max(...vals);
  const basis = recent.map(([y, f]) => ({ year: y, value: f.value, max: f.max, note: f.note }));
  const list = basis.map((b) => `${b.year}: ${b.value.toLocaleString("en-IN")}${b.max ? `–${b.max.toLocaleString("en-IN")}` : ""}`).join(" · ");
  return {
    value: lo,
    ...(hi !== lo && { max: hi }),
    provenance: "ESTIMATED",
    basis,
    single: recent.length === 1,
    note: `Not announced. Estimate = range of the last ${recent.length === 1 ? "official figure" : `${recent.length} official totals`} (${list}). A planning guide only — the recruiter can notify more or fewer.`,
  };
}

/** Announced total, else the estimate's midpoint — for sorting and range filters. */
export function effectiveVacancies(row) {
  return row.cycle.vacancies?.value ?? mid(row.vacancyEstimate);
}

// ── state vacancies ──────────────────────────────────────────────────────────
/**
 * Per tracked state: this cycle's figure, or — when this cycle has none (an
 * expected cycle, say) — the latest earlier cycle's figure, re-tagged
 * HISTORICAL with its year so it is never mistaken for this cycle's number.
 */
export function stateFigures(exam, cycle) {
  const earlier = (exam.cycles || []).filter((c) => c.year < cycle.year && c.states).sort((a, b) => b.year - a.year);
  return TRACKED_STATES.map(({ name, short }) => {
    const own = cycle.states?.[name];
    if (own?.value != null) return { name, short, ...own };
    const prev = earlier.map((c) => ({ c, f: c.states[name] })).find((x) => x.f?.value != null);
    if (prev) {
      return { name, short, ...prev.f, provenance: "HISTORICAL", year: prev.c.year, note: `${prev.c.year} cycle figure — this cycle's is not announced. ${prev.f.note || ""}`.trim() };
    }
    return { name, short, unit: own?.unit, value: null, provenance: "NOT_ANNOUNCED", note: own?.note };
  });
}

// ── age ──────────────────────────────────────────────────────────────────────
export function ageOn(dobIso, onIso) {
  const dob = new Date(`${dobIso}T00:00:00`);
  const on = new Date(`${onIso}T00:00:00`);
  if (Number.isNaN(dob.getTime()) || Number.isNaN(on.getTime())) return null;
  let age = on.getFullYear() - dob.getFullYear();
  const m = on.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && on.getDate() < dob.getDate())) age -= 1;
  return age;
}

/**
 * The date age is checked on, and how sure we are of it. A cycle that has a
 * published cut-off uses it; a later expected cycle shifts the last known
 * cut-off to its own year (same day and month — recruiters rarely move it);
 * otherwise 1 July of the cycle year is used and flagged as approximate.
 */
export function ageCutoffFor(exam, cycle) {
  const a = exam.eligibility.age || {};
  if (a.cutoff) {
    const known = Number(a.cutoff.slice(0, 4));
    if (known === cycle.year) return { date: a.cutoff, kind: "notified", basis: a.basis };
    return { date: `${cycle.year}${a.cutoff.slice(4)}`, kind: "projected", basis: `projected from the last cycle (${a.basis})` };
  }
  return { date: `${cycle.year}-07-01`, kind: "approx", basis: "approximate — the exact cut-off date is set in each notification" };
}

// ── eligibility ──────────────────────────────────────────────────────────────
const worse = (a, b) => (ELIGIBILITY[a].order >= ELIGIBILITY[b].order ? a : b);

/**
 * Match one cycle against the candidate profile.
 * Returns { status, reasons: [{ ok: boolean|null, text }] } where ok=false is a
 * blocker, ok=null a caveat to verify, ok=true a criterion that passes.
 */
export function evaluateEligibility(exam, cycle, profile, dob) {
  const e = exam.eligibility;
  const reasons = [];
  let status = "ELIGIBLE";

  const block = (text) => { status = "NOT_ELIGIBLE"; reasons.push({ ok: false, text }); };
  const caveat = (text, to = "LIKELY") => { status = worse(status, to); reasons.push({ ok: null, text }); };
  const pass = (text) => reasons.push({ ok: true, text });

  // Preference exclusions — hard stops.
  const f = e.flags || {};
  if (f.contract) block("Contract / non-permanent post — excluded by your preferences.");
  if (f.gateBased) block("Recruitment through GATE — excluded by your preferences.");
  if (f.eeeTechnical) block("Requires EEE-specific technical work — excluded by your preferences.");
  if (f.requiresMbaOrCa) block("Requires an MBA or CA.");
  if (f.requiresBankExperience) block("Requires bank experience.");
  if (f.upsc) block("UPSC recruitment — excluded by your preferences.");

  // Degree.
  if (e.btech?.verdict === "NO") block(e.btech.note);
  else if (e.btech?.verdict === "CONDITIONAL") caveat(e.btech.note);
  else if (e.btech) pass("B.Tech (EEE) accepted — any-discipline graduation.");

  // Graduation percentage. The profile figure is approximate, so meeting a
  // bar exactly is a caveat, not a pass.
  const bar = e.minPct?.general;
  if (bar != null) {
    if (profile.graduationPct < bar) block(`Needs ${bar}% in graduation; yours is ≈${profile.graduationPct}%.`);
    else if (profile.graduationPct === bar && profile.graduationPctApprox) caveat(`Needs ${bar}% in graduation — yours is ≈${profile.graduationPct}%, exactly on the bar. Confirm your aggregate.`);
    else pass(`Graduation ≈${profile.graduationPct}% clears the ${bar}% requirement.`);
  } else {
    pass("No minimum graduation percentage.");
  }

  // Age, with OBC-NCL relaxation.
  const a = e.age || {};
  if (a.max != null) {
    const relax = profile.category === "OBC-NCL" ? e.obcRelax || 0 : 0;
    const limit = a.max + relax;
    const window = `${a.min ?? "—"}–${a.max} years${relax ? ` (+${relax} OBC-NCL = up to ${limit})` : ""}`;
    if (!dob) {
      caveat(`Age limit ${window}. Add your date of birth above to check it.`);
    } else {
      const cut = ageCutoffFor(exam, cycle);
      const age = ageOn(dob, cut.date);
      const when = `on ${fmtDate(cut.date)} (${cut.kind === "notified" ? "notified cut-off" : cut.kind === "projected" ? "projected cut-off" : "approximate"})`;
      if (age == null) caveat("Could not read your date of birth.");
      else if (a.min != null && age < a.min) block(`You would be ${age} ${when} — below the minimum of ${a.min}.`);
      else if (age > limit) {
        // An approximate cut-off can be months out, so being just over is a caveat.
        if (cut.kind !== "notified" && age === limit + 1) caveat(`You would be about ${age} ${when}, just over the ${limit} limit — depends on the exact cut-off date.`);
        else block(`You would be ${age} ${when} — over the ${limit}-year limit (${window}).`);
      } else if (cut.kind !== "notified" && age === limit) {
        caveat(`You would be ${age} ${when} — at the ${limit}-year limit; the exact cut-off date decides it.`);
      } else {
        pass(`Age ${age} ${when} — within ${window}.`);
      }
    }
  }

  if (e.experience && e.experience !== "Not required") caveat(`Experience: ${e.experience}`);

  if (!e.confirmed) caveat("Eligibility criteria could not be verified from a notification.", "NOT_CONFIRMED");
  if (UNANNOUNCED_STATUSES.has(cycle.status) && status === "ELIGIBLE") {
    caveat("This cycle is not notified yet — criteria are from the previous notification.");
  }

  return { status, reasons };
}

// ── salary preference ────────────────────────────────────────────────────────
/** "ok" | "below" | "unknown" against the in-hand target. */
export function salaryFlag(exam, target) {
  const ih = exam.salary.inHand;
  if (!ih || ih.value == null) return "unknown";
  const top = ih.max ?? ih.value;
  return top < target ? "below" : "ok";
}

// ── ranking ──────────────────────────────────────────────────────────────────
// A cycle whose application window has closed can no longer be acted on, so
// it scores near zero here — its expected next cycle ranks above it.
const TIMING_POINTS = {
  APPLICATION_OPEN: 15, NOTIFICATION_RELEASED: 13, UPCOMING: 12, EXPECTED_2027: 10,
  EXAM_SCHEDULED: 2, RESULT_AWAITED: 1, RECRUITMENT_COMPLETED: 0,
};
const ELIG_POINTS = { ELIGIBLE: 30, LIKELY: 22, NOT_CONFIRMED: 10, NOT_ELIGIBLE: 0 };

/**
 * Priority score out of 100: pay (40), eligibility (30), IBPS PO overlap (15),
 * how actionable the cycle is (15). Unknown pay scores a neutral 15 so it
 * neither floats to the top nor sinks below known low pay.
 */
export function scoreRow(row, target) {
  const ih = mid(row.exam.salary.inHand);
  const pay = ih == null ? 15 : Math.min(40, (ih / (target * 2)) * 40) - (ih < target ? 10 : 0);
  const parts = {
    pay: Math.max(0, Math.round(pay)),
    eligibility: ELIG_POINTS[row.elig.status],
    overlap: Math.round((row.exam.overlap?.pct || 0) * 0.15),
    timing: TIMING_POINTS[row.cycle.status] ?? 0,
  };
  return { total: parts.pay + parts.eligibility + parts.overlap + parts.timing, parts };
}

/** Decorate rows with eligibility, salary flag, score, and a per-tab rank. */
export function enrichRows(rows, profile, dob, tabIds) {
  const out = rows.map((row) => {
    const elig = evaluateEligibility(row.exam, row.cycle, profile, dob);
    const withElig = {
      ...row,
      elig,
      pay: salaryFlag(row.exam, profile.targetInHand),
      vacancyEstimate: estimateVacancies(row.exam, row.cycle),
      states: stateFigures(row.exam, row.cycle),
    };
    return { ...withElig, score: scoreRow(withElig, profile.targetInHand), rank: {} };
  });
  for (const tab of tabIds) {
    out
      .filter((r) => r.tabs.includes(tab))
      .sort((a, b) => b.score.total - a.score.total || a.exam.name.localeCompare(b.exam.name))
      .forEach((r, i) => { r.rank[tab] = i + 1; });
  }
  return out;
}

// ── filters ──────────────────────────────────────────────────────────────────
// The default view is the 2027 cycle in every tab — that is the one still
// open to prepare for. "Clear filters" returns here; pick "All years" to see
// the 2026 cycles too.
export const DEFAULT_FILTERS = {
  year: "2027",
  org: "all",
  postType: "all",
  salary: "all",
  vacancy: "all",
  status: "all",
  stages: "all",
  scope: "all",
  overlap: "all",
  eligibility: "all",
};

export function searchHaystack(row) {
  const { exam, cycle } = row;
  return [exam.name, exam.fullName, exam.organization, exam.orgShort, exam.post, cycle.label, exam.category].join(" ").toLowerCase();
}

// Word-prefix match, not substring: "LIC" must not match "pub-lic sector
// banks", and "PO" must not match "corPOration".
const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
export function matchesSearch(row, q) {
  const needle = q.trim().toLowerCase();
  if (!needle) return true;
  const hay = searchHaystack(row);
  return needle.split(/\s+/).every((w) => new RegExp(`(^|[^a-z0-9])${escapeRe(w)}`).test(hay));
}

export function matchesFilters(row, f, target) {
  const { exam, cycle, elig } = row;
  if (f.year !== "all" && String(cycle.year) !== f.year) return false;
  if (f.org !== "all" && exam.orgShort !== f.org) return false;
  if (f.postType !== "all" && exam.postType !== f.postType) return false;
  if (f.status !== "all" && cycle.status !== f.status) return false;
  if (f.eligibility !== "all" && elig.status !== f.eligibility) return false;
  if (f.scope !== "all") {
    const stateWise = ["STATE_WISE", "RRB_WISE", "OFFICE_WISE"].includes(exam.vacancyScope);
    if (f.scope === "state" && !stateWise) return false;
    if (f.scope === "india" && stateWise) return false;
  }
  if (f.stages !== "all") {
    if (f.stages === "interview" && !exam.hasInterview) return false;
    if (f.stages === "no-interview" && exam.hasInterview) return false;
  }
  if (f.salary !== "all") {
    const ih = mid(exam.salary.inHand);
    if (f.salary === "unknown") { if (ih != null) return false; }
    else if (ih == null) return false;
    else if (f.salary === "target" && ih < target) return false;
    else if (f.salary === "100k" && ih < 100000) return false;
    else if (f.salary === "below" && ih >= target) return false;
  }
  if (f.vacancy !== "all") {
    // "Not announced" means no official total; the size bands use the
    // estimate when there is no official figure.
    const v = effectiveVacancies(row);
    if (f.vacancy === "na") { if (cycle.vacancies?.value != null) return false; }
    else if (v == null) return false;
    else if (f.vacancy === "1000" && v < 1000) return false;
    else if (f.vacancy === "100" && (v < 100 || v >= 1000)) return false;
    else if (f.vacancy === "lt100" && v >= 100) return false;
  }
  if (f.overlap !== "all") {
    const p = exam.overlap?.pct ?? 0;
    if (f.overlap === "80" && p < 80) return false;
    if (f.overlap === "60" && (p < 60 || p >= 80)) return false;
    if (f.overlap === "lt60" && p >= 60) return false;
  }
  return true;
}

export const activeFilterCount = (f) => Object.keys(DEFAULT_FILTERS).filter((k) => f[k] !== DEFAULT_FILTERS[k]).length;

// ── sorting ──────────────────────────────────────────────────────────────────
// Missing values always sort last, whichever direction — "Not announced"
// should never masquerade as the smallest vacancy count.
const SORTERS = {
  rank: (r, tab) => r.rank[tab],
  name: (r) => r.exam.name.toLowerCase(),
  org: (r) => r.exam.orgShort.toLowerCase(),
  vacancies: (r) => effectiveVacancies(r) ?? null,
  // Combined figure across tracked states; null when none is known.
  state: (r) => (r.states.some((s) => s.value != null) ? r.states.reduce((sum, s) => sum + (s.value || 0), 0) : null),
  inHand: (r) => mid(r.exam.salary.inHand),
  gross: (r) => mid(r.exam.salary.gross),
  ctc: (r) => r.exam.salary.ctc?.value ?? (mid(r.exam.salary.gross) != null ? mid(r.exam.salary.gross) * 12 : null),
  stages: (r) => r.exam.stages.length,
  overlap: (r) => r.exam.overlap?.pct ?? null,
  year: (r) => r.cycle.year,
  status: (r) => STATUS[r.cycle.status]?.order ?? 99,
  dates: (r) => r.cycle.application?.start ?? null,
  eligibility: (r) => ELIGIBILITY[r.elig.status].order,
};

export function sortRows(rows, key, dir, tab) {
  const get = SORTERS[key] || SORTERS.rank;
  const sign = dir === "desc" ? -1 : 1;
  return [...rows].sort((a, b) => {
    const va = get(a, tab);
    const vb = get(b, tab);
    if (va == null && vb == null) return a.rank[tab] - b.rank[tab];
    if (va == null) return 1;
    if (vb == null) return -1;
    if (va < vb) return -1 * sign;
    if (va > vb) return 1 * sign;
    return a.rank[tab] - b.rank[tab];
  });
}

// ── summary ──────────────────────────────────────────────────────────────────
export function summarise(rows) {
  const unique = [...new Map(rows.map((r) => [r.key, r])).values()];
  const pay = [...new Map(unique.map((r) => [r.exam.id, mid(r.exam.salary.inHand)])).values()].filter((v) => v != null);
  return {
    total: unique.length,
    open: unique.filter((r) => r.cycle.status === "APPLICATION_OPEN").length,
    expected2027: unique.filter((r) => r.cycle.year === 2027 || r.cycle.status === "EXPECTED_2027").length,
    avgInHand: pay.length ? pay.reduce((s, v) => s + v, 0) / pay.length : null,
    avgInHandBasis: pay.length,
    examsCount: new Set(unique.map((r) => r.exam.id)).size,
  };
}
