// Previous-year cut-offs for IBPS PO and IBPS RRB PO (Officer Scale I).
//
// THE THING TO KNOW FIRST: only ONE of these two exams has a state-wise
// cut-off. IBPS PO is a single national exam — IBPS publishes category-wise
// and sectional cut-offs and nothing else, so there is no "Andhra Pradesh
// IBPS PO cut-off" to show and any site quoting one has invented it. IBPS RRB
// is recruited bank by bank, and its banks are regional, so RRB cut-offs
// genuinely are released per state and per category.
//
// PROVENANCE: IBPS does not keep an archive of past cut-offs on ibps.in, so
// every figure below is as reported by coaching aggregators. Each RRB row
// records how many independent sources agreed on it, because they do not
// always agree — where they conflict, or where only one carries the number,
// the UI says so rather than presenting a lone claim as settled fact.

// ── IBPS PO — category-wise, national ────────────────────────────────────────
export const PO_CUTOFFS = {
  note:
    "IBPS PO is a national exam. IBPS releases category-wise and sectional cut-offs only — " +
    "there is no state-wise IBPS PO cut-off, for Andhra Pradesh or anywhere else.",
  prelimsOutOf: 100,
  mainsOutOf: 225,          // 200 objective + 25 descriptive
  finalOutOf: 100,          // Mains 80% + Interview 20%, normalised
  years: [
    { year: 2025, prelims: { ur: 49.21, obc: 49.21, ews: 49.21, sc: 45.96, st: 40.96 },
      mains: { ur: 75.75, obc: 75.75, ews: 72.50, sc: 59.00, st: 51.75 },
      final: { ur: 46.11, obc: 44.04, ews: 43.64, sc: 38.53, st: 36.73 } },
    { year: 2024, prelims: { ur: 48.50, obc: 48.50, ews: 48.50, sc: 48.00, st: 41.00 },
      mains: { ur: 66.50, obc: 66.00, ews: 64.75, sc: 54.25, st: 47.50 },
      final: { ur: 42.69, obc: 40.18, ews: 39.93, sc: 35.91, st: 33.69 } },
    { year: 2023, prelims: { ur: 54.25, obc: 54.25, ews: 54.25, sc: 49.50, st: 43.00 },
      mains: { ur: 63.00, obc: 62.25, ews: 61.00, sc: 50.25, st: 41.00 },
      final: { ur: 41.13, obc: 38.69, ews: 38.71, sc: 34.73, st: 31.93 } },
    { year: 2022, prelims: { ur: 49.75, obc: 49.75, ews: 49.75, sc: 46.75, st: 40.75 },
      mains: { ur: 71.25, obc: 69.75, ews: 70.50, sc: 59.25, st: 53.25 },
      final: { ur: 43.47, obc: 41.38, ews: 41.76, sc: 38.02, st: 36.24 } },
    // 2021 is reported only for the General category by every source checked.
    { year: 2021, prelims: { ur: 50.50, obc: null, ews: null, sc: null, st: null },
      mains: { ur: 80.75, obc: null, ews: null, sc: null, st: null },
      final: { ur: 46.67, obc: null, ews: null, sc: null, st: null } },
  ],
};

// ── IBPS RRB PO (Officer Scale I) — by state ────────────────────────────────
// Keyed by state because RRB recruitment IS state-wise: separate vacancies,
// separate cut-offs, and since 2025 even separate sectional groups. Adding a
// state means adding an entry here — nothing in the UI is per-state.
export const RRB_STATES = {
  ap: {
    key: "ap",
    state: "Andhra Pradesh",
    bank: "Andhra Pradesh Grameena Bank",
    sectionalGroup: "group1",
    sectionalGroupSources: 1,
    vacancy2026: { po: 400, clerk: 900 },
    years: [
      {
        year: 2025,
        prelims: { ur: 56.75, obc: 56.75, ews: null, sc: null, st: null },
        mains: null,
        sources: 1,
        caveat:
          "Only one aggregator carries a 2025 Andhra Pradesh prelims figure; three others show it as " +
          "not available. Treat 56.75 as unconfirmed. No Mains cut-off has been reported for the state.",
      },
      {
        year: 2024,
        prelims: { ur: 40.00, obc: null, ews: 40.00, sc: null, st: null },
        mains: { ur: 58.06, obc: 58.06, ews: 58.06, sc: 58.06, st: 54.50 },
        sources: 3,
        caveat:
          "Three sources agree. Note that UR, OBC, EWS and SC are all quoted at the same 58.06 — " +
          "possible when a state has few vacancies, but also the shape a copy-paste error takes. " +
          "Read the SC figure with caution.",
      },
      {
        year: 2023,
        prelims: { ur: 39.00, obc: 39.00, ews: 39.00, sc: null, st: null },
        mains: { ur: 64.00, obc: 64.00, ews: 64.00, sc: 64.00, st: 59.06 },
        sources: 3,
        caveat:
          "Mains agreed by three sources; on prelims one source leaves General blank while two give 39. " +
          "The same four-categories-identical pattern appears here as in 2024.",
      },
      {
        year: 2022,
        prelims: { ur: 53.50, obc: 53.50, ews: 53.50, sc: null, st: null },
        mains: null,
        sources: 2,
        caveat: "Two sources agree on prelims. No Andhra Pradesh Mains figure is reported for 2022.",
      },
      {
        year: 2021,
        prelims: null,
        mains: { ur: 68.20, obc: 56.08, ews: 55.82, sc: 54.38, st: 53.98 },
        sources: 1,
        caveat:
          "A single source carries 2021, but it is the only year with a fully differentiated " +
          "category spread, which is what a real cut-off table looks like. No prelims figure found.",
      },
    ],
    vacancyNote:
      "Andhra Pradesh's four rural banks — Andhra Pragathi Grameena Bank, Chaitanya Godavari " +
      "Grameena Bank, Saptagiri Grameena Bank and Andhra Pradesh Grameena Vikas Bank — merged into " +
      "a single Andhra Pradesh Grameena Bank on 1 May 2025 under the 'One State, One RRB' policy, " +
      "sponsored by Union Bank of India and headquartered at Amaravati. That merger is the likeliest " +
      "reason 2025 state figures are thin. For CRP RRB XV (2026) the state carries 400 Officer " +
      "Scale I posts and 900 Office Assistant posts — the largest Officer Scale I intake of any state.",
  },

  rj: {
    key: "rj",
    state: "Rajasthan",
    bank: "Rajasthan Gramin Bank",
    sectionalGroup: "group3",
    sectionalGroupSources: 2,
    vacancy2026: { po: 250, clerk: 225 },
    years: [
      {
        year: 2025,
        prelims: { ur: 55.25, obc: null, ews: 55.25, sc: null, st: null },
        mains: { ur: 74.63, obc: 74.63, ews: 74.63, sc: 61.13, st: 56.69 },
        final: { ur: 52.78, obc: 50.08, ews: 49.75, sc: 42.20, st: 41.38 },
        sources: 3,
        caveat: "Three sources agree on both stages. The most complete year Rajasthan has.",
      },
      {
        year: 2024,
        prelims: { ur: 49.00, obc: 49.00, ews: null, sc: null, st: null },
        mains: { ur: 71.13, obc: 71.13, ews: 71.13, sc: 60.81, st: 56.38 },
        final: { ur: 50.35, obc: 48.22, ews: 47.92, sc: 41.32, st: 40.95 },
        sources: 3,
        caveat:
          "Prelims and Mains agree across three sources. The FINAL figures are taken from the one " +
          "source that distinguishes 2024 from 2023 — another simply repeats its 2023 row.",
      },
      {
        year: 2023,
        prelims: { ur: 54.50, obc: null, ews: null, sc: null, st: null },
        mains: { ur: 75.63, obc: 75.63, ews: 75.63, sc: 62.06, st: 59.75 },
        final: { ur: 51.25, obc: 48.25, ews: 48.45, sc: 41.28, st: 39.90 },
        sources: 3,
        caveat:
          "Mains agreed by three sources. On Prelims a second figure of 49.75 is reported, but one " +
          "source calls it OBC and another calls it EWS — so it is left out rather than guessed.",
      },
      {
        year: 2022,
        prelims: { ur: 60.25, obc: 60.25, ews: 60.25, sc: null, st: null },
        mains: { ur: 96.94, obc: 96.94, ews: 96.94, sc: 81.56, st: 78.56 },
        final: { ur: 60.42, obc: 57.50, ews: 57.08, sc: 48.88, st: 48.65 },
        sources: 2,
        caveat:
          "Two sources agree. A third has the Mains row column-shifted (General 81.56, ST 96.94), " +
          "which is not a plausible cut-off shape, so it was discarded. 2022 was by far the hardest " +
          "year on record for the state.",
      },
    ],
    vacancyNote:
      "Rajasthan's two rural banks — Baroda Rajasthan Kshetriya Gramin Bank and Rajasthan Marudhara " +
      "Gramin Bank — were merged into a single Rajasthan Gramin Bank under the 'One State, One RRB' " +
      "policy. For CRP RRB XV (2026) the state carries 250 Officer Scale I posts and 225 Office " +
      "Assistant posts. Note how much tighter that is than Andhra Pradesh's 400 — and Rajasthan's " +
      "cut-offs run far higher as a result.",
  },
};

export const RRB_STATE_KEYS = Object.keys(RRB_STATES);

// Shared shape for every state's tables.
export const RRB_SCALE = { prelimsOutOf: 80, mainsOutOf: 200, finalOutOf: 100 };

// Kept so anything importing the original Andhra-only export still works.
export const RRB_AP_CUTOFFS = { ...RRB_SCALE, ...RRB_STATES.ap };

// ── Expected cut-off, per state ─────────────────────────────────────────────
// DERIVED from the year tables above, never typed in: an "expected" column
// written by hand becomes a second set of numbers that stops agreeing with the
// history the moment a year is corrected.
//
// No exam board publishes an expected cut-off. This is arithmetic on past years,
// and RRB years swing hard — Rajasthan Mains ran 96.94 in 2022 and 71.13 in
// 2024. It is a target band, not a prediction.
const CATS = ["ur", "obc", "ews", "sc", "st"];

function project(years, stage, buffer) {
  const out = {};
  for (const cat of CATS) {
    const pts = years
      .map((y) => ({ year: y.year, v: y[stage]?.[cat] }))
      .filter((x) => typeof x.v === "number");
    if (!pts.length) {
      out[cat] = null;                    // no history — say so, do not invent
      continue;
    }
    const vals = pts.map((x) => x.v).sort((a, b) => a - b);
    const mean = vals.reduce((a, b) => a + b, 0) / vals.length;
    const mid = Math.floor(vals.length / 2);
    const median = vals.length % 2 ? vals[mid] : (vals[mid - 1] + vals[mid]) / 2;
    out[cat] = {
      n: vals.length,
      years: pts.map((x) => x.year).sort((a, b) => b - a),
      low: vals[0],
      high: vals[vals.length - 1],
      mean: Math.round(mean * 100) / 100,
      median: Math.round(median * 100) / 100,
      // Aim above the worst year seen, not at the average — an easier paper
      // pushes the cut-off up, and the average is the score that gets you
      // rejected in half the cycles.
      target: Math.round((vals[vals.length - 1] + buffer) * 100) / 100,
    };
  }
  return out;
}

const STATE_CAVEATS = {
  ap: [
    "Sample sizes are tiny — three or four years per category, and none at all for Prelims SC and ST.",
    "The 2025 Prelims figure (56.75) rests on a single source that three others contradict. It widens the " +
      "Prelims band considerably; without it the range would be 39–53.50.",
    "2026 is the first cycle after the four Andhra Pradesh RRBs merged into one bank on 1 May 2025, and the " +
      "state carries 400 Officer Scale I posts — the largest of any state. A bigger single-bank intake tends " +
      "to LOWER the cut-off, so treat the upper end of these bands as cautious.",
  ],
  rj: [
    "Rajasthan has the fuller record of the two states — four consecutive years with both stages, and every " +
      "core year confirmed by at least two sources.",
    "2022 is an outlier at the top: Mains 96.94 against 71–76 in the three years since. Including it pushes " +
      "the target up; the three recent years alone would suggest roughly 84.",
    "Rajasthan carries 250 Officer Scale I posts for 2026 against Andhra Pradesh's 400, and its cut-offs run " +
      "20-30 marks higher on Mains. Fewer seats in a state with a large applicant pool is exactly why.",
  ],
};

const SHARED_CAVEATS = [
  "Prelims is qualifying only — clearing it comfortably is worth more than maximising. Mains is 80% of the " +
    "final merit.",
];

export const RRB_EXPECTED = Object.fromEntries(
  Object.values(RRB_STATES).map((st) => [
    st.key,
    {
      key: st.key,
      state: st.state,
      cycle: "CRP RRB XV (2026)",
      prelimsOutOf: RRB_SCALE.prelimsOutOf,
      mainsOutOf: RRB_SCALE.mainsOutOf,
      prelims: project(st.years, "prelims", 5),
      mains: project(st.years, "mains", 8),
      method:
        "Low and high are the lowest and highest figures actually reported for " + st.state + " in the years " +
        "listed. Target adds a margin over the highest — 5 marks on the 80-mark Prelims and 8 on the " +
        "200-mark Mains — because an easier paper raises the cut-off, and aiming at the average is aiming at " +
        "the score that fails in half the cycles.",
      caveats: [...(STATE_CAVEATS[st.key] || []), ...SHARED_CAVEATS],
    },
  ])
);

// Kept so anything importing the original Andhra-only export still works.
export const RRB_AP_EXPECTED = RRB_EXPECTED.ap;

// ── Sectional cut-offs, RRB PO ──────────────────────────────────────────────
// You must clear EVERY section as well as the overall mark. Each row is
// [reserved, general] where reserved = SC/ST/OBC/PwBD and general = EWS/General
// — IBPS uses those two bands for sectional marks, not the five used overall.
//
// 2025 was the first year IBPS split these by STATE GROUP, and the groups differ
// sharply: Group 1 (incl. Andhra Pradesh) is the strictest, Group 3 (incl.
// Rajasthan) the mildest. 2022-2024 applied one set to all states.
export const RRB_SECTIONAL_SECTIONS = [
  { key: "reasoning", name: "Reasoning" },
  { key: "quant", name: "Quantitative Aptitude" },
  { key: "ga", name: "General Awareness" },
  { key: "english", name: "English Language", pair: "Hindi" },
  { key: "hindi", name: "Hindi Language", pair: "English" },
  { key: "computer", name: "Computer Knowledge" },
];

export const RRB_SECTIONAL_GROUPS = {
  group1: { label: "Group 1 — Tamil Nadu, Telangana, Andhra Pradesh*", sources: 2 },
  group2: { label: "Group 2 — Assam, Gujarat, HP, J&K, Karnataka, Maharashtra, Tripura, UP, Uttarakhand, West Bengal", sources: 1 },
  group3: { label: "Group 3 — Bihar, Chhattisgarh, Haryana, Kerala, Jharkhand, MP, Odisha, Punjab, Rajasthan and others", sources: 2 },
};

const SECTIONAL_MAINS = {
  2022: { scope: "All states", sources: 1, all: {
    reasoning: [16, 18.5], quant: [5.75, 8.5], ga: [1, 2.5], english: [5.75, 9.5], hindi: [10.25, 13.25], computer: [3.5, 6] } },
  2023: { scope: "All states", sources: 4, all: {
    reasoning: [6.75, 10], quant: [2.75, 4.75], ga: [1, 2], english: [3, 6.75], hindi: [2.5, 5.75], computer: [2.75, 5.5] } },
  2024: { scope: "All states", sources: 1, all: {
    reasoning: [3.75, 6], quant: [3.5, 5.5], ga: [1, 1.75], english: [7.5, 11], hindi: [11.25, 14.25], computer: [4.25, 7] } },
  2025: { scope: "By state group", sources: 2,
    group1: { reasoning: [9.75, 12.25], quant: [8.25, 10.5], ga: [6, 8.5], english: [14.75, 18.25], hindi: [13.25, 16.25], computer: [7.5, 10.25] },
    group2: { reasoning: [8.5, 11], quant: [7.25, 9.25], ga: [5, 7.25], english: [13, 16.5], hindi: [11.75, 14.75], computer: [6.25, 9] },
    group3: { reasoning: [7.25, 9.75], quant: [6, 8.25], ga: [3.75, 6], english: [11.25, 14.75], hindi: [10.25, 13.25], computer: [4.75, 7.5] } },
};

// Same rule as the overall projection: aim above the highest year on record.
// The margin is 2 on a 40-mark section, capped at 40.
const SECTION_MARGIN = 2;

function projectSections(group) {
  const years = Object.keys(SECTIONAL_MAINS).map(Number).sort((a, b) => a - b);
  const valueFor = (y, key, bi) => {
    const row = SECTIONAL_MAINS[y];
    return (row.all || row[group])[key][bi];
  };
  const out = {};
  for (const { key } of RRB_SECTIONAL_SECTIONS) {
    out[key] = {};
    ["reserved", "general"].forEach((band, bi) => {
      const vals = years.map((y) => valueFor(y, key, bi));
      const high = Math.max(...vals);
      out[key][band] = {
        byYear: Object.fromEntries(years.map((y, i) => [y, vals[i]])),
        low: Math.min(...vals),
        high,
        mean: Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 100) / 100,
        latest: vals[vals.length - 1],
        target: Math.min(40, Math.round((high + SECTION_MARGIN) * 100) / 100),
      };
    });
  }
  return { years, rows: out };
}

export const RRB_SECTIONAL = {
  outOf: 40,
  bands: { reserved: "SC / ST / OBC / PwBD", general: "General / EWS" },
  groups: RRB_SECTIONAL_GROUPS,
  // One projection per group; a state picks its own via sectionalGroup.
  byGroup: Object.fromEntries(Object.keys(RRB_SECTIONAL_GROUPS).map((g) => [g, projectSections(g)])),
  mainsScopes: Object.fromEntries(
    Object.entries(SECTIONAL_MAINS).map(([y, v]) => [y, { scope: v.scope, sources: v.sources }])
  ),
  prelims: {
    published: false,
    estimate: [
      { key: "reasoning", name: "Reasoning Ability", range: [9, 11] },
      { key: "quant", name: "Quantitative Aptitude", range: [8, 10] },
    ],
    source: "Practicemock's expected range for 2026",
    note:
      "IBPS shows Prelims sectional marks on your scorecard, but none of the eight sources checked publishes " +
      "past Prelims sectional cut-offs, so there is no history to project from. This is one site's estimate, " +
      "not a figure derived from previous years.",
  },
  caveats: [
    "2025 was the first year IBPS split sectional cut-offs by state group, and the groups differ a lot — " +
      "Group 1 General needed 18.25 in English where Group 3 needed 14.75. The pre-2025 rows applied to " +
      "every state alike, so they understate what a Group 1 state now needs.",
    "English and Hindi are alternatives — you sit ONE, and only that section's cut-off applies to you.",
    "A sectional cut-off is a floor, not a target: clearing every section still fails you if the total is " +
      "short. Plan to the overall cut-off; use these only to spot a section you could fail outright.",
  ],
};

export const CUTOFF_READING = [
  {
    title: "Prelims is only a gate in RRB — in PO it is not even that",
    body:
      "For RRB PO the prelims score is qualifying and is discarded once you clear it. For IBPS PO " +
      "the prelims score is also discarded — the merit list is Mains and Interview at 80 : 20. " +
      "In both exams, clearing comfortably is worth more than maximising.",
  },
  {
    title: "Why RRB cut-offs swing so much year to year",
    body:
      "Andhra Pradesh prelims ran at 53.50 in 2022, then 39 in 2023 and 40 in 2024. That is a paper " +
      "difficulty and vacancy-count effect, not a trend you can extrapolate. A state with more " +
      "vacancies in a given year has a lower cut-off, which is why the figure moves with the " +
      "notification rather than with the candidate pool.",
  },
  {
    title: "Sectional cut-offs still apply",
    body:
      "Both exams require you to clear each section as well as the overall mark. The numbers on this " +
      "page are overall cut-offs — clearing the total while failing one section still ends the attempt.",
  },
  {
    title: "Treat every figure here as indicative",
    body:
      "IBPS does not publish an archive of past cut-offs, so all of these come from coaching " +
      "aggregators reading their own scorecards. Where sources disagree the table says so. Use them " +
      "to set a target band, never as a precise threshold.",
  },
];
