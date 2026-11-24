// IBPS RRB PO (Officer Scale I) — exam profile, pattern and syllabus.
//
// A DIFFERENT exam from IBPS PO, not a variant of it. The two things that catch
// people out: RRB PO Prelims has NO English section (two sections, not three),
// and its sectional windows are unequal — 25 minutes for Reasoning, 20 for
// Quant, where IBPS PO gives a flat 20/20/20.
//
// Kept as data so the page stays a renderer, and so an exam profile can later
// drive the mock engine (planFor() already runs whatever sections a paper
// contains, with their own timings).

export const RRB_OVERVIEW = {
  fullName: "IBPS RRB Officer Scale I (Probationary Officer)",
  conductedBy: "Institute of Banking Personnel Selection (IBPS)",
  forPost: "Officer Scale I in Regional Rural Banks across India",
  stages: ["Prelims", "Mains", "Interview"],
  note:
    "Prelims is purely qualifying — those marks do NOT count towards the final merit. " +
    "The final list is Mains and Interview combined in an 80 : 20 ratio.",
};

export const RRB_PRELIMS = {
  totalQuestions: 80,
  totalMarks: 80,
  totalMinutes: 45,
  sectionalTiming: true,
  negative: 0.25,
  sections: [
    {
      name: "Reasoning Ability",
      questions: 40,
      marks: 40,
      minutes: 25,
      note: "The larger window — and the section that decides the paper.",
    },
    {
      name: "Numerical Ability (Quantitative Aptitude)",
      questions: 40,
      marks: 40,
      minutes: 20,
      note: "Same 40 questions in 5 fewer minutes. Pace is tighter here than in Reasoning.",
    },
  ],
};

export const RRB_MAINS = {
  totalQuestions: 200,
  totalMarks: 200,
  totalMinutes: 120,
  sectionalTiming: true,
  negative: 0.25,
  sections: [
    { name: "Reasoning", questions: 40, marks: 50, minutes: 30, note: "Highest weight, alongside Quant — 50 marks from 40 questions." },
    { name: "Quantitative Aptitude", questions: 40, marks: 50, minutes: 30, note: "Also 50 marks. These two sections carry half the paper." },
    { name: "General Awareness", questions: 40, marks: 40, minutes: 15, note: "40 questions in 15 minutes — pure recall, no working out. Banking and current affairs dominate." },
    { name: "English OR Hindi Language", questions: 40, marks: 40, minutes: 30, note: "You choose one at the exam. Both carry identical weight." },
    { name: "Computer Knowledge", questions: 40, marks: 20, minutes: 15, note: "Lowest weight in the paper — 40 questions for only 20 marks, so half a mark each." },
  ],
};

export const RRB_SYLLABUS = [
  // The two sections that span BOTH stages are split explicitly. Tagging a topic
  // "(Mains)" inside its own label meant a Prelims candidate had to read every
  // line to work out what they could skip — and Prelims is only 45 minutes, so
  // time spent on Machine Input-Output is time taken from puzzles that will
  // actually appear. `topics` is what both papers set; `mainsOnly` is what
  // Prelims never asks.
  {
    section: "Reasoning Ability",
    stage: "Prelims & Mains",
    topics: [
      "Puzzles — floor, box, scheduling, and category-based",
      "Seating Arrangement — linear, circular, square, parallel rows",
      "Syllogism, including 'Only a few' and possibility conclusions",
      "Inequalities — direct and coded",
      "Coding-Decoding",
      "Blood Relations, Direction Sense, Order & Ranking",
      "Alphanumeric Series and Alphabet Tests",
      "Order & Ranking, Odd one out, Analogy",
    ],
    mainsOnly: [
      "Machine Input-Output",
      "Statement & Assumption / Conclusion / Argument",
      "Data Sufficiency",
      "Critical and Analytical Reasoning",
      "Passage-based Reasoning and Decision Making",
    ],
  },
  {
    section: "Quantitative / Numerical Ability",
    stage: "Prelims & Mains",
    topics: [
      "Data Interpretation — table, bar, pie, line, caselet",
      "Simplification and Approximation",
      "Number Series — missing term and wrong term",
      "Quadratic Equations",
      "Percentage, Ratio & Proportion, Average, Ages",
      "Profit & Loss, Discount, Partnership",
      "Simple and Compound Interest",
      "Time & Work, Pipes & Cisterns",
      "Time, Speed & Distance, Boats & Streams, Trains",
      "Mixture & Alligation",
      "Mensuration — basic area and volume, as arithmetic word problems",
    ],
    mainsOnly: [
      "Data Sufficiency",
      "Quantity I vs Quantity II comparison",
      "Permutation & Combination",
      "Probability",
      "Missing-value DI and multi-set / arithmetic DI",
    ],
    mainsNote:
      "Mensuration does appear in Prelims, but only as a one-step area or volume question inside the " +
      "arithmetic mix — the formula-heavy version belongs to Mains.",
  },
  {
    section: "General Awareness",
    stage: "Mains only",
    topics: [
      "Banking Awareness — RBI functions, monetary policy, bank types",
      "Current Affairs, roughly the last 6 months",
      "Government schemes and financial inclusion",
      "Budget and Economic Survey highlights",
      "Financial and insurance awareness",
      "Static GK — capitals, currencies, important days, organisations",
      "Agriculture and rural banking, given the RRB context",
    ],
  },
  {
    section: "English Language",
    stage: "Mains only (or choose Hindi)",
    topics: [
      "Reading Comprehension",
      "Cloze Test",
      "Para Jumbles and sentence rearrangement",
      "Error Detection and Sentence Improvement",
      "Fillers — single and double",
      "Phrase Replacement and Word Usage",
      "Synonyms, Antonyms, Idioms & Phrases",
    ],
  },
  {
    section: "Hindi Language (विकल्प)",
    stage: "Mains only (or choose English)",
    topics: [
      "गद्यांश (Reading Comprehension)",
      "रिक्त स्थान की पूर्ति (Fillers)",
      "वाक्य क्रम व्यवस्थापन (Para Jumbles)",
      "त्रुटि से सम्बंधित प्रश्न (Error Detection)",
      "वाक्यांश के लिए एक शब्द, मुहावरे और लोकोक्तियाँ",
      "पर्यायवाची एवं विलोम शब्द",
    ],
  },
  {
    section: "Computer Knowledge",
    stage: "Mains only",
    topics: [
      "Computer fundamentals and generations",
      "Hardware, software, memory and storage devices",
      "Operating systems and file management",
      "MS Office — Word, Excel, PowerPoint",
      "Internet, networking and protocols",
      "Computer security — viruses, firewalls, phishing",
      "Keyboard shortcuts and abbreviations",
      "Database and DBMS basics",
    ],
  },
];

// The comparisons that actually change how you prepare, rather than trivia.
export const RRB_VS_IBPS_PO = [
  { point: "Prelims sections", rrb: "2 — Reasoning, Quant", ibps: "3 — English, Quant, Reasoning" },
  { point: "English in Prelims", rrb: "Not tested at all", ibps: "30 questions" },
  { point: "Prelims size", rrb: "80 questions · 80 marks · 45 min", ibps: "100 questions · 100 marks · 60 min" },
  { point: "Sectional windows", rrb: "Unequal — 25 min then 20 min", ibps: "Equal — 20 min each" },
  { point: "Marks per question", rrb: "Flat 1 mark", ibps: "Weighted — 1.00 / 0.86 / 1.14" },
  { point: "Mains sections", rrb: "5, including Computer Knowledge", ibps: "4 plus a Descriptive paper" },
  { point: "Descriptive paper", rrb: "None", ibps: "Essay and Letter, 25 marks" },
  { point: "Language choice", rrb: "English OR Hindi in Mains", ibps: "English only" },
  { point: "Final merit", rrb: "Mains : Interview = 80 : 20", ibps: "Mains : Interview = 80 : 20" },
  { point: "Difficulty", rrb: "Moderate — below SBI/IBPS PO", ibps: "Higher, especially Reasoning" },
];

export const RRB_KEY_FACTS = [
  {
    label: "Prelims marks do not count",
    detail:
      "Prelims is qualifying only. Your final rank comes from Mains (converted to 80) plus Interview (converted to 20). " +
      "Clear the cut-off and move on — there is nothing to gain from a high prelims score.",
  },
  {
    label: "Interview qualifying marks",
    detail: "Interview is out of 100. You must score at least 40% (35% for SC/ST/OBC/PWD) to stay in contention.",
  },
  {
    label: "Sectional cut-offs apply",
    detail:
      "You must clear each section separately as well as the overall cut-off. A strong Reasoning score cannot rescue a failed Quant section.",
  },
  {
    label: "Normalisation",
    detail:
      "Scores are normalised across shifts using the equi-percentile method, so a harder slot is not a disadvantage.",
  },
  {
    label: "Provisional allotment",
    detail:
      "Allotment to a specific RRB is made on a merit-cum-preference basis and is final — a change request cancels your candidature.",
  },
  {
    label: "Computer Knowledge is cheap to score",
    detail:
      "40 questions for 20 marks means half a mark each, so it is the lowest-value section per question — but it is also the fastest to answer and almost pure recall.",
  },
];

export const RRB_STRATEGY = [
  {
    title: "Prelims: Reasoning is where the paper is won",
    body:
      "It carries the same 40 marks as Quant but gets 5 more minutes, and RRB puzzles sit below IBPS PO in difficulty. " +
      "Bank the standalone items first — inequalities, syllogism, blood relations, direction — then take the puzzles.",
  },
  {
    title: "Prelims Quant: 40 questions in 20 minutes",
    body:
      "That is 30 seconds a question, tighter than IBPS PO. Do simplification and approximation first, then one clean DI set, " +
      "then number series. Leave the multi-step arithmetic for last.",
  },
  {
    title: "Skipping English in Prelims changes your plan",
    body:
      "There is no English cushion to fall back on, so a weak Quant or Reasoning section cannot be offset. " +
      "Both sections have to clear their own cut-off.",
  },
  {
    title: "Mains: Reasoning and Quant are half the paper",
    body:
      "50 marks each out of 200. General Awareness is 40 marks in only 15 minutes, so it rewards preparation rather than thinking time — " +
      "you either know it or you move on.",
  },
];

// ── Mains: questions per topic, Reasoning & Quant ─────────────────────────────
// IBPS publishes no topic breakdown. These counts come from coaching-institute
// analyses written the day of each Mains sitting, one granular source per year
// with a second used to cross-check it. The 2026 estimate is COMPUTED below
// from these observations — typing an "expected" column by hand would give a
// second set of numbers that stops agreeing with the table the moment a year is
// corrected.
//
// Where a source contradicted its own total the residual is used instead, and
// the row says so: a 40-question section cannot hold 18 DI + 5 series + 4
// quantity questions AND the "17-20 arithmetic" both 2024 write-ups claimed.
export const RRB_MAINS_TOPIC_YEARS = [2023, 2024, 2025];

export const RRB_MAINS_WEIGHTAGE = {
  sources: {
    2023: "Bankersadda (10 Sep 2023), cross-checked against IBPS Guide — agree within a question per topic",
    2024: "PW (29 Sep 2024, Shift 1). CareerPower lists the same shift with a 5-question Machine Input-Output set, but that makes its own table total 44.5 — the IO count for 2024 is disputed",
    2025: "IBPS Guide (28 Dec 2025, Shift 1), cross-checked against Oliveboard's coarser table (Puzzles 20, DI 18) — consistent",
  },
  reasoning: [
    { topic: "Puzzles & Seating Arrangement", counts: [21, 20, 19], set: 5,
      note: "Four sets of about five. Types seen: linear, parallel-row, square seating, month/date, box, designation, selection, weight-based ranking — nearly always with a second variable." },
    { topic: "Logical / Critical Reasoning", counts: [4, 7.5, 5],
      note: "Statement–assumption, course of action, cause and effect, strengthen/weaken. 2024 was reported as 7–8." },
    { topic: "Machine Input-Output", counts: [5, 0, 5], set: 5, disputed: [2024],
      note: "Comes as one five-question set or not at all. Asked in 2023 and 2025; 2024 is disputed between sources." },
    { topic: "Data Sufficiency", counts: [0, 3, 3],
      note: "Absent in 2023, three questions since. Two-statement format." },
    { topic: "Syllogism", counts: [3, 0, 3],
      note: "Including 'only a few' and possibility conclusions." },
    { topic: "Blood Relation", counts: [1, 3, 3],
      note: "Increasingly passage-based rather than a single one-liner." },
    { topic: "Inequality", counts: [3, 4, 0],
      note: "Direct or conclusion-based. Dropped out in 2025." },
    { topic: "Direction & Distance", counts: [3, 0, 0],
      note: "Only in 2023 — low priority." },
    { topic: "Miscellaneous (series, word / number based)", counts: [0, 2, 2],
      note: "Alphanumeric series, vowel/consonant word tests, number rearrangement." },
  ],
  quant: [
    { topic: "Data Interpretation", counts: [15, 18, 18], set: 5,
      note: "Three or four sets — always a caselet, plus pie, bar+table or missing-value table. 2025 had a single 8-question caselet." },
    { topic: "Arithmetic word problems", counts: [11, 13, 13], residual: [2024],
      note: "Profit & loss, SI/CI, time-work, speed-distance, mixtures, ages, partnership. 2024 is the residual after DI, series and Q1/Q2 — both write-ups claimed '17–20', which cannot fit in 40." },
    { topic: "Number Series", counts: [5, 5, 5], set: 5,
      note: "The steadiest topic in the paper: exactly five every year — missing-term in 2023 and 2025, wrong-term in 2024." },
    { topic: "Quantity I vs Quantity II", counts: [5, 4, 2],
      note: "Falling year on year." },
    { topic: "Data Sufficiency", counts: [0, 0, 2],
      note: "Reappeared in 2025 after two absent years (IBPS Guide logged 3–4 in 2023; Bankersadda logged none)." },
    { topic: "Quadratic Equations", counts: [4, 0, 0],
      note: "Not seen in Mains since 2023 — still a Prelims staple, so not wasted preparation." },
  ],
};

// Recency-weighted mean (2025 counts three times as much as 2023, 2024 twice),
// then apportioned to EXACTLY 40 by largest remainder, so the estimates are
// whole questions that add up to the real section size. Ties in the remainder
// go to whichever topic was bigger most recently — Quadratics and Arithmetic
// tie for 2026's last question, and only one of them appeared in 2025.
function apportion(rows, total = 40) {
  const w = RRB_MAINS_TOPIC_YEARS.map((_, i) => i + 1);          // 1, 2, 3
  const wsum = w.reduce((a, b) => a + b, 0);
  const means = rows.map((r) => r.counts.reduce((a, c, i) => a + c * w[i], 0) / wsum);
  const scale = total / means.reduce((a, b) => a + b, 0);
  // The epsilon matters: a weighted mean of exactly 5 comes out as 4.9999...
  // in floating point, and flooring that silently took a question off Number
  // Series — the one topic asked exactly five times every single year.
  const exact = means.map((m) => m * scale);
  const est = exact.map((x) => Math.floor(x + 1e-9));
  let left = total - est.reduce((a, b) => a + b, 0);
  const recent = (i) => rows[i].counts[rows[i].counts.length - 1];
  // A topic ABSENT from the latest paper keeps its floor but never receives a
  // rounded-up seat. Without this rule the spare question went to Quadratics —
  // unseen in Mains since 2023 — ahead of DI, which was 18 in both later years.
  // Rounding up should favour what IBPS is currently setting, not manufacture a
  // question for a topic it has dropped.
  const order = exact
    .map((x, i) => ({ i, rem: x - Math.floor(x + 1e-9) }))
    .filter((o) => recent(o.i) > 0)
    .sort((a, b) => (Math.abs(b.rem - a.rem) > 1e-9 ? b.rem - a.rem : recent(b.i) - recent(a.i)));
  for (const o of order) { if (left <= 0) break; est[o.i] += 1; left -= 1; }
  return rows.map((r, i) => ({
    ...r,
    low: Math.min(...r.counts),
    high: Math.max(...r.counts),
    askedIn: r.counts.filter((c) => c > 0).length,
    weighted: Math.round(means[i] * 10) / 10,
    estimate: est[i],
  }));
}

export const RRB_MAINS_ESTIMATE = {
  reasoning: apportion(RRB_MAINS_WEIGHTAGE.reasoning),
  quant: apportion(RRB_MAINS_WEIGHTAGE.quant),
};
