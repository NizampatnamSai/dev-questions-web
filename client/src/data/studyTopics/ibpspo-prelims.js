export default [
  // ── ENGLISH LANGUAGE ──────────────────────────────────────────────────────────
  {
    id: "ibpspo-pre-eng-connectors",
    category: "ibpspo-prelims",
    topic: "English Language",
    title: "Sentence Connectors & Coherent Paragraphs",
    difficulty: "Intermediate",
    summary:
      "Linking two or more sentences logically using appropriate conjunctions/connectors.",
    explanation:
      "Sentence connectors are words or phrases that join two ideas together. To link sentences (A)-(B) and (B)-(C) without changing the context, we must understand the logical flow:\n\n" +
      "1. Concession/Contrast (although, while, and yet, but): Used when the second statement contrasts with or introduces an obstacle to the first statement.\n" +
      "2. Cause and Effect (because, since, therefore, as a result): Used when one statement provides a reason for another.\n" +
      "3. Addition (moreover, furthermore, in addition): Used to add more information.\n\n" +
      "Example Question:\n" +
      "Link the following three sentences:\n" +
      "(A) The students worked tirelessly on their project, researching extensively.\n" +
      "(B) they faced numerous challenges, such as conflicting schedules.\n" +
      "(C) they managed to submit their work on time, impressing their professor.\n\n" +
      "Option: 'although' links A and B (concession); 'and yet' links B and C (unexpected success despite challenges).\n" +
      "Resulting Sentence: 'Although the students worked tirelessly on their project, they faced numerous challenges, and yet they managed to submit on time.'",
    code: "Sentence A: Students worked tirelessly.\nSentence B: Faced conflicting schedules.\nSentence C: Submitted on time.\n\nLogical Linkers: 'although' / 'while' [A to B] & 'and yet' / 'however' [B to C]\n\nCorrect Connector Pair: (although, and yet)",
    interviewQuestion:
      "Identify the correct connectors to link: (A) The company introduced a new product line... (B) the initial feedback was mixed... (C) they decided to focus on promotional campaigns.",
  },
  {
    id: "ibpspo-pre-eng-phrasalverbs",
    category: "ibpspo-prelims",
    topic: "English Language",
    title: "Phrasal Verbs & Contextual Usage",
    difficulty: "Basic",
    summary:
      "Understanding idiomatic expressions formed by combining verbs with prepositions or adverbs.",
    explanation:
      "Phrasal verbs have meanings different from their individual words. Context determines which verb is appropriate:\n\n" +
      "- 'Break down': Stop functioning/operating (for machines/servers).\n" +
      "- 'Conk out': Suddenly break down or fail (very similar to break down).\n" +
      "- 'Jump in': Enter a conversation or activity quickly to help.\n" +
      "- 'Figure out': Solve or understand a problem.\n" +
      "- 'Hand out': Distribute items.\n" +
      "- 'Build up': Increase or accumulate over time.\n\n" +
      "In banking exams, you are tested on choosing synonymous pairs. For instance, 'broke down' and 'conked out' both describe a server failure and can be used interchangeably in machine failure contexts.",
    code: "1. The main server conked out (failed).\n2. The system broke down (stopped working).\n\nSynonymous Phrasal Verbs: conk out / break down\n\nUsage:\n- 'The IT team jumped in (intervened) to fix the server.'",
    interviewQuestion:
      "Which of the following phrasal verbs has the same meaning as 'broke down' in 'everything broke down when the server conked out'?",
  },
  {
    id: "ibpspo-pre-eng-grammar",
    category: "ibpspo-prelims",
    topic: "English Language",
    title: "Grammar Correction: Infinitives vs Gerunds",
    difficulty: "Intermediate",
    summary:
      "Correcting sentence segments based on standard grammatical structures (e.g. infinitives vs. gerunds, parallel structure).",
    explanation:
      "Common grammatical errors tested in banking exams include:\n\n" +
      "1. Infinitive error: Verbs like 'promise', 'decide', 'plan', 'agree' are followed by 'to + base verb' (infinitive), not 'to + gerund' (e.g., 'promised to improve' instead of 'promised to improving').\n" +
      "2. Parallelism in lists: All items in a series must share the same grammatical form (e.g., 'She enjoys hiking, swimming, and exploring' instead of 'enjoys hiking, swimming, and to explore').\n" +
      "3. Subject-Verb Agreement: Collective nouns are singular if acting as a single unit ('The orchestra has started rehearsing' instead of 'The orchestra have started').\n" +
      "4. Article Usage: 'an' is used before vowel sounds ('an unexpected spike'), and 'a' is used before consonant sounds.",
    code: "Error: ...promised (A) / to improving infrastructure (B) / in rural districts...\nCorrection: 'to improving' -> 'to improve' [promise + to + V1]\n\nError: She enjoys hiking (A) / swimming (B) / and to explore ruins (C)\nCorrection: 'to explore' -> 'exploring' [Gerund parallelism]",
    interviewQuestion:
      "Identify the grammatical error: 'The ambassador (A) said the reports have (B) being examined carefully by his staff (C) before making comments (D).'",
  },

  // ── QUANTITATIVE APTITUDE ──────────────────────────────────────────────────────
  {
    id: "ibpspo-pre-quant-approximations",
    category: "ibpspo-prelims",
    topic: "Quantitative Aptitude",
    title: "Fast Calculation & Approximations",
    difficulty: "Basic",
    summary:
      "Solving complex arithmetic expressions quickly by rounding numbers to their nearest integers.",
    explanation:
      "A key skill in the prelims is rounding numbers off to simplify math. Follow standard rounding rules (0.5 and above round up, below 0.5 round down):\n\n" +
      "Example Problem:\n" +
      "Calculate: 779.23 / 13 + 4.98 + 23 = x% of 60.03\n\n" +
      "Step 1: Round the values:\n" +
      "- 779.23 ≈ 780\n" +
      "- 4.98 ≈ 5\n" +
      "- 60.03 ≈ 60\n\n" +
      "Step 2: Solve the equation:\n" +
      "780 / 13 + 5 + 23 = x% of 60\n" +
      "60 + 5 + 23 = (x / 100) * 60\n" +
      "88 = 0.6 * x\n" +
      "x = 88 / 0.6 = 146.66 ≈ 147.\n\n" +
      "This technique saves crucial time during the 20-minute section limit.",
    code: "Expression: 779.23 / 13 + 4.98 + 23 = x% of 60.03\nRound values: 780 / 13 + 5 + 23 = x% of 60\nSolve: 60 + 5 + 23 = 88\n88 = 0.6 * x => x = 88 * 5 / 3 = 146.66\nApproximate answer: 147",
    interviewQuestion:
      "Find the approximate value of 'x': 39.98% of 249.99 + sqrt(196.04) = x^2 + 55.93",
  },
  {
    id: "ibpspo-pre-quant-quadratic",
    category: "ibpspo-prelims",
    topic: "Quantitative Aptitude",
    title: "Quadratic Equations Comparison",
    difficulty: "Intermediate",
    summary:
      "Solving two quadratic equations and establishing the relationship between variables x and y.",
    explanation:
      "To compare variables x and y, solve both quadratic equations for their roots, then perform a pairwise comparison:\n\n" +
      "Equation I: x^2 - 10x + 24 = 0\n" +
      "Factors of 24 that sum to -10 are -6 and -4. So (x-6)(x-4) = 0 -> x = 4, 6.\n\n" +
      "Equation II: 5y^2 - 16y + 12 = 0\n" +
      "Multiply 5 * 12 = 60. Factors of 60 that sum to -16 are -10 and -6.\n" +
      "5y^2 - 10y - 6y + 12 = 0 -> 5y(y-2) - 6(y-2) = 0 -> y = 1.2, 2.\n\n" +
      "Compare roots:\n" +
      "- x = 4 is greater than y = 1.2, 2.\n" +
      "- x = 6 is greater than y = 1.2, 2.\n" +
      "Result: x > y.",
    code: "Eq 1: x^2 - 10x + 24 = 0 => (x-4)(x-6) = 0 => x = 4, 6\nEq 2: 5y^2 - 16y + 12 = 0 => (5y-6)(y-2) = 0 => y = 1.2, 2\n\nComparison Matrix:\n- x=4 vs y=1.2 (x > y)\n- x=4 vs y=2   (x > y)\n- x=6 vs y=1.2 (x > y)\n- x=6 vs y=2   (x > y)\nResult: x > y",
    interviewQuestion:
      "Establish the relationship between x and y: I. 2x^2 - 9x + 10 = 0 and II. y^2 - 12y + 35 = 0.",
  },
  {
    id: "ibpspo-pre-quant-workrate",
    category: "ibpspo-prelims",
    topic: "Quantitative Aptitude",
    title: "Time, Work & Efficiency",
    difficulty: "Advanced",
    summary:
      "Solving combined work and rate problems using individual worker efficiency fractions.",
    explanation:
      "Let the work done by one man in one day be M, and one woman in one day be W. Establish equations based on the conditions:\n\n" +
      "Condition 1: 7 men and 15 women complete work in 15 days:\n" +
      "Total work = 15 * (7M + 15W) = 1 => 7M + 15W = 1/15.\n\n" +
      "Condition 2: 18 men and 20 women complete work in 8 days:\n" +
      "Total work = 8 * (18M + 20W) = 1 => 18M + 20W = 1/8.\n\n" +
      "Solve this linear system to find W = 1/400 and M = 1/240. This means a man takes 240 days individually, and a woman takes 400 days.\n" +
      "Using these rates, you can solve for any combination of workers and find the time required.",
    code: "Eq 1: 7M + 15W = 1/15  => Multiply by 8: 56M + 120W = 8/15\nEq 2: 18M + 20W = 1/8  => Multiply by 15: 270M + 300W = 15/8\n\nSolving gives W = 1/400 and M = 1/240.\n\nIf X men and 20 women do the work in 10 days:\n10 * (X/240 + 20/400) = 1\nX/240 + 1/20 = 1/10 => X/240 = 1/20 => X = 12.",
    interviewQuestion:
      "If 12 men and 15 women take 10 days to complete a task, and 8 men and 20 women take 12 days, how long will 10 men and 10 women take?",
  },

  // ── REASONING ABILITY ──────────────────────────────────────────────────────────
  {
    id: "ibpspo-pre-reason-linear",
    category: "ibpspo-prelims",
    topic: "Reasoning Ability",
    title: "Linear Seating: North-Facing Rows",
    difficulty: "Advanced",
    summary:
      "Determining seating orders on a single line where some or all participants face North.",
    explanation:
      "For linear seating puzzles, map out positions relative to Left and Right (since they face North, your left is their left, your right is their right):\n\n" +
      "Clues to parse:\n" +
      "1. 'Three persons sit between A and B.' -> B _ _ _ A or A _ _ _ B.\n" +
      "2. 'C sits second to the right of B.' -> B _ C.\n" +
      "3. 'D sits fifth to the left of C.'\n" +
      "4. 'Two persons sit between D and E.'\n" +
      "5. 'As many persons sit to the left of F as to the right of C.'\n\n" +
      "By combining these relative placements on a line grid, you get a unique arrangement:\n" +
      "F - E - (blank) - A - D - (blank) - G - B - (blank) - C\n" +
      "Total number of persons in the row is 10. Once established, you can answer all sub-questions instantly.",
    code: "Linear Layout:\nF  E  [ ]  A  D  [ ]  G  B  [ ]  C\n1  2   3   4  5   6   7  8   9  10\n\nVerification of Clues:\n- 3 persons between A(4) and B(8) -> (5, 6, 7) - True\n- C(10) is 2nd to the right of B(8) - True\n- D(5) is 5th to the left of C(10) - True\n- No one sits to the left of F(1) - True",
    interviewQuestion:
      "Based on the arrangement 'F E [ ] A D [ ] G B [ ] C', who sits third to the left of G?",
  },
  {
    id: "ibpspo-pre-reason-monthdate",
    category: "ibpspo-prelims",
    topic: "Reasoning Ability",
    title: "Month and Date Grid Puzzles",
    difficulty: "Advanced",
    summary:
      "Arranging events or birthdays matching months and distinct dates using calendar logic.",
    explanation:
      "A classic puzzle format involving 3 months (April: 30 days, July: 31 days, September: 30 days) and 2 dates (9th and 26th):\n\n" +
      "Create a 2D table grid:\n" +
      "- April 9, April 26\n" +
      "- July 9, July 26\n" +
      "- September 9, September 26\n\n" +
      "Map out conditions:\n" +
      "- 'D was born immediately before F on an odd date in a month with an even number of days.' -> April has 30 days (even), so D must be April 9. F is April 26.\n" +
      "- 'E was born immediately before C on an even date.' -> E must be July 26, C must be Sept 9.\n" +
      "- Fill in remaining (A on July 9, B on Sept 26).\n" +
      "Complete Solution:\n" +
      "April 9: D | April 26: F | July 9: A | July 26: E | Sept 9: C | Sept 26: B.",
    code: "Grid Representation:\n1. April 9   (30 days, odd date)  -> D\n2. April 26  (30 days, even date) -> F\n3. July 9    (31 days, odd date)  -> A\n4. July 26   (31 days, even date) -> E\n5. Sept 9    (30 days, odd date)  -> C\n6. Sept 26   (30 days, even date) -> B",
    interviewQuestion:
      "Based on the birthday schedule grid, who was born on 9th July?",
  },
];
