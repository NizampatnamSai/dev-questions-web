// Public sector bank recruitment — every cadre, one place.
//
// SCOPE: the three bodies that actually recruit for public sector banks.
// IBPS runs a common written exam on behalf of 11 nationalised banks (PO,
// Clerk, Specialist Officer) and separately for the Regional Rural Banks;
// SBI is not an IBPS participant and recruits on its own; RBI is the central
// bank rather than a PSB, kept here because candidates prepare for it off the
// same syllabus.
//
// DATES ARE ISO, DELIBERATELY. An earlier instinct was to store a "status"
// string per row — "Apply now", "Prelims upcoming". That rots: the page would
// still say "Apply now" in December. Status is derived from these dates at
// render time instead, so the tab keeps telling the truth without anyone
// editing it.
//
// FIGURES: from the recruiters' own notifications as reported by the major
// aggregators, for the 2026 cycle (CRP XVI / CRP RRB XV). IBPS routinely
// revises vacancy counts upward mid-cycle once participating banks finalise
// their numbers, so where a figure was revised both are shown — a candidate
// reading only the launch number underestimates their odds.

export const VACANCY_CYCLE = "2026-27 recruitment cycle (IBPS CRP XVI / CRP RRB XV)";
export const VACANCY_UPDATED = "2026-09-02";

export const VACANCY_GROUPS = [
  {
    id: "ibps",
    body: "IBPS",
    full: "Institute of Banking Personnel Selection",
    blurb:
      "Runs one common exam for 11 public sector banks. You sit a single paper and are allotted a " +
      "bank on merit-cum-preference — you do not apply to banks individually.",
    banks:
      "Bank of Baroda · Bank of India · Bank of Maharashtra · Canara Bank · Central Bank of India · " +
      "Indian Bank · Indian Overseas Bank · Punjab National Bank · Punjab & Sind Bank · UCO Bank · " +
      "Union Bank of India",
    rows: [
      {
        exam: "IBPS PO",
        code: "CRP PO/MT-XVI",
        post: "Probationary Officer / Management Trainee",
        cadre: "Officer (Scale I)",
        announced: 6715,
        revised: 7565,
        apply: { from: "2026-07-01", to: "2026-07-26" },
        stages: [
          { name: "Prelims", date: "2026-08-22", label: "22–23 Aug 2026" },
          { name: "Mains", date: "2026-10-04", label: "4 Oct 2026" },
          { name: "Interview", date: null, label: "After Mains result" },
        ],
        note: "Launched at 6,715 and revised to 7,565 once all 11 banks reported.",
      },
      {
        exam: "IBPS Clerk",
        code: "CRP CSA-XVI",
        post: "Customer Service Associate",
        cadre: "Clerical",
        announced: 11403,
        revised: null,
        apply: { from: "2026-08-01", to: "2026-08-28" },
        stages: [
          { name: "Prelims", date: "2026-10-10", label: "10–11 Oct 2026" },
          { name: "Mains", date: "2026-12-27", label: "27 Dec 2026" },
        ],
        note:
          "The largest single PSB intake of the cycle. No interview — Mains alone decides it. " +
          "Recruitment is state/UT-wise, so you pick a state and compete only within it. " +
          "The application window was extended from 21 to 28 August.",
      },
      {
        exam: "IBPS SO",
        code: "CRP SPL-XVI",
        post: "Specialist Officer (Scale I)",
        cadre: "Officer — specialist",
        announced: 745,
        revised: 1043,
        apply: { from: "2026-08-01", to: "2026-08-21" },
        stages: [
          { name: "Main exam", date: "2026-08-29", label: "29 Aug 2026" },
          { name: "Interview", date: null, label: "After Mains result" },
        ],
        note:
          "Six streams: IT Officer, Agricultural Field Officer, Rajbhasha Adhikari, Law Officer, " +
          "HR/Personnel Officer, Marketing Officer. Each needs its own degree — this is the one " +
          "PSB route that is not open to any graduate. Revised from 745 to 1,043 on 27 Aug 2026.",
      },
    ],
  },
  {
    id: "rrb",
    body: "IBPS RRB",
    full: "Regional Rural Banks — CRP RRB XV",
    blurb:
      "A separate exam from IBPS PO, for the Regional Rural Banks. Recruitment is state-wise, and " +
      "Prelims has no English section. The largest single pool of bank vacancies in the cycle.",
    banks:
      "43 Regional Rural Banks across the states — now one RRB per state following the " +
      "'One State, One RRB' amalgamation of 1 May 2025.",
    rows: [
      {
        exam: "IBPS RRB Clerk",
        code: "Office Assistant (Multipurpose)",
        post: "Office Assistant",
        cadre: "Clerical",
        announced: 8183,
        revised: null,
        apply: { from: "2026-09-01", to: "2026-09-21" },
        stages: [
          { name: "Prelims", date: "2026-12-06", label: "6, 12 & 13 Dec 2026" },
          { name: "Mains", date: "2027-01-30", label: "30 Jan 2027" },
        ],
        note: "No interview. Local-language proficiency is required for the state you apply to.",
      },
      {
        exam: "IBPS RRB PO",
        code: "Officer Scale I",
        post: "Officer Scale I (Probationary Officer)",
        cadre: "Officer (Scale I)",
        announced: 4256,
        revised: null,
        apply: { from: "2026-09-01", to: "2026-09-21" },
        stages: [
          { name: "Prelims", date: "2026-11-21", label: "21–22 Nov 2026" },
          { name: "Mains", date: "2026-12-20", label: "20 Dec 2026" },
          { name: "Interview", date: null, label: "After Mains result" },
        ],
        note:
          "Prelims is qualifying only — the merit list is Mains and Interview at 80 : 20. " +
          "Andhra Pradesh carries roughly 400 of these posts.",
      },
      {
        exam: "IBPS RRB Officer Scale II",
        code: "Scale II — General & Specialist",
        post: "Officer Scale II",
        cadre: "Officer (Scale II)",
        announced: 1047,
        revised: null,
        apply: { from: "2026-09-01", to: "2026-09-21" },
        stages: [
          { name: "Single exam", date: "2026-11-21", label: "Single online exam, Nov 2026" },
          { name: "Interview", date: null, label: "After result" },
        ],
        note:
          "General Banking Officer plus specialists — IT, CA, Law, Treasury, Marketing, " +
          "Agricultural Officer. Needs 2 years' experience; no prelims, one exam then interview.",
      },
      {
        exam: "IBPS RRB Officer Scale III",
        code: "Senior Manager",
        post: "Officer Scale III",
        cadre: "Officer (Scale III)",
        announced: 220,
        revised: null,
        apply: { from: "2026-09-01", to: "2026-09-21" },
        stages: [
          { name: "Single exam", date: "2026-11-21", label: "Single online exam, Nov 2026" },
          { name: "Interview", date: null, label: "After result" },
        ],
        note: "Needs 5 years' officer experience in a bank. The smallest and most senior intake.",
      },
    ],
  },
  {
    id: "sbi",
    body: "SBI",
    full: "State Bank of India",
    blurb:
      "SBI is NOT an IBPS participant — it runs its own recruitment, its own exam and its own " +
      "calendar. A separate application entirely, and the papers run harder than IBPS.",
    banks: "State Bank of India",
    rows: [
      {
        exam: "SBI PO",
        code: "CRPD/PO/2026-27/09",
        post: "Probationary Officer",
        cadre: "Officer (Scale I)",
        announced: 1500,
        revised: null,
        apply: { from: "2026-06-18", to: "2026-07-08" },
        stages: [
          { name: "Prelims", date: "2026-08-01", label: "1–2 Aug 2026" },
          { name: "Mains", date: "2026-09-12", label: "12 Sep 2026" },
          { name: "Psychometric + Interview", date: null, label: "After Mains result" },
        ],
        note:
          "The hardest paper of the lot and the smallest officer intake — roughly one post for " +
          "every five IBPS PO posts. Mains includes a descriptive paper and a group exercise.",
      },
      {
        exam: "SBI Clerk",
        code: "Junior Associate (Customer Support & Sales)",
        post: "Junior Associate",
        cadre: "Clerical",
        announced: 7680,
        revised: 9766,
        apply: { from: "2026-08-11", to: "2026-08-31" },
        stages: [
          { name: "Prelims", date: "2026-09-20", label: "September 2026 (tentative)" },
          { name: "Mains", date: "2026-11-15", label: "November 2026 (tentative)" },
        ],
        note:
          "7,680 regular posts plus backlog, taking the advertised total to 9,766. State-wise, " +
          "no interview, and a local-language test at the end.",
      },
    ],
  },
  {
    id: "rbi",
    body: "RBI",
    full: "Reserve Bank of India",
    blurb:
      "Not a public sector bank — it is the regulator. Included because the syllabus overlaps almost " +
      "entirely with PO preparation, so most candidates sit both.",
    banks: "Reserve Bank of India",
    rows: [
      {
        exam: "RBI Assistant",
        code: "Assistant",
        post: "Assistant",
        cadre: "Clerical",
        announced: 650,
        revised: null,
        apply: { from: "2026-02-10", to: "2026-03-08" },
        stages: [
          { name: "Prelims", date: "2026-04-11", label: "11 Apr 2026" },
          { name: "Mains", date: "2026-06-07", label: "7 Jun 2026" },
          { name: "Language test", date: null, label: "After Mains" },
        ],
        note: "Best pay in the clerical cadre. Prelims + Mains + a local language test, no interview.",
      },
      {
        exam: "RBI Grade B",
        code: "Officer Grade B (DR)",
        post: "Officer Grade B",
        cadre: "Officer",
        announced: 60,
        revised: null,
        apply: { from: "2026-04-15", to: "2026-05-07" },
        stages: [
          { name: "Phase 1", date: "2026-06-13", label: "June 2026" },
          { name: "Phase 2", date: "2026-07-25", label: "25–26 Jul 2026" },
          { name: "Interview", date: null, label: "After Phase 2" },
        ],
        note:
          "The most competitive banking exam in the country — around 60 posts against lakhs of " +
          "applicants. Phase 2 adds Economic & Social Issues and Finance & Management, which are " +
          "not part of any PO syllabus.",
      },
    ],
  },
];

// What the cadres actually mean — the question behind "PO vs Clerk vs SO".
export const CADRE_GUIDE = [
  {
    cadre: "Clerk / Office Assistant / Junior Associate",
    scale: "Clerical cadre",
    body:
      "Front-desk and back-office work: cash, passbooks, account opening, customer service. Entry is " +
      "Prelims + Mains with NO interview, which is why the competition is decided purely on marks. " +
      "Promotion to officer comes through internal exams. The biggest intake every year.",
  },
  {
    cadre: "PO / Officer Scale I / Assistant Manager",
    scale: "JMGS-I",
    body:
      "The generalist officer entry. Two years of probation, then branch operations, credit, and " +
      "eventually branch management. Prelims + Mains + Interview. Any graduate may apply, which is " +
      "why it draws the largest applicant pool relative to posts.",
  },
  {
    cadre: "Specialist Officer (SO)",
    scale: "JMGS-I, specialist",
    body:
      "Officer rank, but hired against a discipline — IT, Law, Agriculture, HR, Marketing, Rajbhasha. " +
      "Needs the matching degree, so the applicant pool is far smaller and the cut-offs lower than PO. " +
      "The overlooked route for anyone with a technical degree.",
  },
  {
    cadre: "Officer Scale II",
    scale: "MMGS-II",
    body:
      "Middle management, entered directly with 2+ years of banking experience. No prelims — one exam " +
      "and an interview. Available in the RRB stream as both General Banking Officer and specialist posts.",
  },
  {
    cadre: "Officer Scale III",
    scale: "MMGS-III",
    body:
      "Senior Manager, requiring 5+ years as a bank officer. The smallest intake, and not an entry " +
      "route — it is a lateral move for serving bankers.",
  },
];

export const VACANCY_NOTES = [
  {
    title: "IBPS revises vacancies upward, often a lot",
    body:
      "IBPS PO launched at 6,715 posts and settled at 7,565; SO went from 745 to 1,043. Participating " +
      "banks report final numbers after the notification, so the launch figure is a floor, not a " +
      "ceiling. Never decide whether to apply based on the opening count.",
  },
  {
    title: "Clerk and RRB are state-wise; PO is not",
    body:
      "IBPS Clerk, SBI Clerk and every RRB post are recruited state by state — you choose one state, " +
      "compete only within it, and usually need the local language. IBPS PO and SBI PO are all-India " +
      "with a single national merit list and no language requirement.",
  },
  {
    title: "You can sit all of them",
    body:
      "IBPS, SBI and RBI run separate applications on separate calendars, and nothing stops you " +
      "entering every one. The syllabus overlap is close to total for Prelims — the differences are " +
      "in Mains, where SBI adds a descriptive paper and RBI Grade B adds Economics and Finance.",
  },
  {
    title: "These figures move — check the notification",
    body:
      "Vacancy counts, dates and windows come from each recruiter's notification and are revised " +
      "during the cycle. Confirm against ibps.in, sbi.bank.in or rbi.org.in before you rely on any " +
      "number here.",
  },
];
