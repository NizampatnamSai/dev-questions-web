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

// ── IBPS RRB PO (Officer Scale I) — Andhra Pradesh, state-wise ───────────────
export const RRB_AP_CUTOFFS = {
  state: "Andhra Pradesh",
  prelimsOutOf: 80,
  mainsOutOf: 200,
  finalOutOf: 100,          // Mains 80 : Interview 20
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
    "reason 2025 state figures are thin. For the CRP RRB XV (2026) cycle the state carries roughly " +
    "400 Officer Scale I vacancies.",
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
