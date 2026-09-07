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
      "Data Sufficiency",
      "Machine Input-Output (Mains)",
      "Statement & Assumption / Conclusion / Argument (Mains)",
    ],
  },
  {
    section: "Quantitative / Numerical Ability",
    stage: "Prelims & Mains",
    topics: [
      "Data Interpretation — table, bar, pie, line, caselet, missing DI",
      "Simplification and Approximation",
      "Number Series — missing term and wrong term",
      "Quadratic Equations",
      "Percentage, Ratio & Proportion, Average, Ages",
      "Profit & Loss, Discount, Partnership",
      "Simple and Compound Interest",
      "Time & Work, Pipes & Cisterns",
      "Time, Speed & Distance, Boats & Streams, Trains",
      "Mixture & Alligation",
      "Mensuration, Permutation & Combination, Probability (mainly Mains)",
      "Data Sufficiency and Quantity Comparison (Mains)",
    ],
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
