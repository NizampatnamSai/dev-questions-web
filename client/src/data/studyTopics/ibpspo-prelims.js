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
  {
    id: "ibpspo-pre-reason-leftright",
    category: "ibpspo-prelims",
    topic: "Reasoning Ability",
    title: "The Left/Right Rule: Whose Perspective Counts",
    difficulty: "Basic",
    summary:
      "The single convention that decides every seating puzzle: 'left/right of X' is always read from X's own facing direction.",
    explanation:
      "This is the most-failed concept in the whole reasoning section, and it is worth more marks than any single formula. Learn it once, apply it everywhere.\n\n" +
      "THE UNIVERSAL RULE\n" +
      "Whenever a clue says 'to the left of X' or 'to the right of X', it is read from X's OWN facing direction — never from your view of the page.\n\n" +
      "Why: if you face north, your right hand points east. On a page drawn map-style (north up, east right), your right = the page's right. But if you face south, your right hand points west — the page's LEFT. So the page only agrees with you when you happen to face north.\n\n" +
      "WHAT THIS GIVES YOU, TYPE BY TYPE\n" +
      "1. Linear row, everyone faces north: person's left = page-left, right = page-right. Page and person agree. This is the easy case.\n" +
      "2. Linear row, everyone faces south: fully reversed. Person's right = page-left.\n" +
      "3. Linear row, MIXED directions: apply each person's own direction individually. A south-facer's 'left' is page-right even though the north-facer sitting beside them has 'left' as page-left. This is the trap.\n" +
      "4. Circular, all facing CENTRE: clockwise (as you view it) = each person's LEFT; anticlockwise = each person's RIGHT.\n" +
      "5. Circular, all facing OUTWARD: exactly reversed — clockwise = right, anticlockwise = left.\n" +
      "6. Double/parallel rows: apply the rule per row. The north-facing row reads normally; the south-facing row reads reversed.\n\n" +
      "THE ONE EXCEPTION — 'EXTREME END'\n" +
      "'Extreme left end' and 'extreme right end' of a row are ABSOLUTE — the physical end of the row as drawn, no perspective involved. Same for 'opposite', 'between', 'adjacent/immediate neighbour' and 'third from the end': these are position facts, not direction facts, so facing never affects them.\n\n" +
      "So facing direction governs left/right clues ONLY. It never moves anybody's seat.\n\n" +
      "EXAM DISCIPLINE\n" +
      "Before you count a single seat, write the facing letter (N or S) above every position. Then, for each left/right clue, look up that person's letter first and decide the page-direction before you count. Most lost marks here are not conceptual — they are people who knew the rule but counted before checking the letter.",
    code: "Reading a left/right clue — decision order:\n1. Who is the reference person X?\n2. Which way does X face?\n3. N-facer -> X's right = page-right (+), X's left = page-left (-)\n   S-facer -> X's right = page-left (-), X's left = page-right (+)\n4. Only now, count.\n\nCircular (positions numbered 1..8 clockwise):\n  Facing centre : left = +1 clockwise | right = -1 anticlockwise\n  Facing outward: left = -1 anticlockwise | right = +1 clockwise\n\nAbsolute (facing is irrelevant):\n  extreme left end | extreme right end | opposite\n  between | immediate neighbour | Nth from the end",
    interviewQuestion:
      "In a row drawn left-to-right, P sits at position 4 and faces south. Who occupies the seat 'second to the left of P' — position 2 or position 6?",
  },
  {
    id: "ibpspo-pre-reason-mixedrow",
    category: "ibpspo-prelims",
    topic: "Reasoning Ability",
    title: "Linear Seating: Mixed Facing Directions",
    difficulty: "Tricky",
    summary:
      "Single row where each person independently faces north or south — the hardest row variant in prelims.",
    explanation:
      "Here every person has their own facing direction, so the left/right rule has to be applied person by person. Directions are usually given up front or fixed early; if a position clue depends on a facing you have not established yet, resolve the facing first or that clue is unusable.\n\n" +
      "WORKED EXAMPLE\n" +
      "Six persons A-F sit in a row. A, C and E face north; B, D and F face south.\n" +
      "(i) C sits at the extreme left end.\n" +
      "(ii) A sits immediately to the right of C.\n" +
      "(iii) F sits second to the right of A.\n" +
      "(iv) B sits immediately to the right of F.\n" +
      "(v) D sits at the extreme right end.\n" +
      "(vi) E sits immediately to the right of D.\n\n" +
      "SOLVING IT\n" +
      "Number the six page positions 1-6, left to right.\n" +
      "(i) is absolute -> C at 1.\n" +
      "(ii) C faces north, so C's right is page-right -> A at 2.\n" +
      "(iii) A faces north, so two seats page-right -> F at 4.\n" +
      "(iv) F faces SOUTH, so F's right is page-LEFT -> B at 3. (Read this page-right and you would put B at 5 and the puzzle would collapse.)\n" +
      "(v) is absolute -> D at 6.\n" +
      "(vi) D faces SOUTH, so D's right is page-LEFT -> E at 5.\n\n" +
      "FINAL: C(N) A(N) B(S) F(S) E(N) D(S) at positions 1-6.\n\n" +
      "Now answer anything asked. 'Second to the left of E': E is at 5 and faces north, so left is page-left -> position 3 -> B. 'Third to the right of C': C at 1 faces north -> position 4 -> F.\n\n" +
      "TRAP TO NOTE\n" +
      "Clues (iii) and (iv) both say 'to the right of', one step apart, yet they move in opposite page-directions because A faces north and F faces south. Nothing signals this in the wording — only the direction table does. Always place the direction letters before you place people.",
    code: "Position :  1     2     3     4     5     6\nPerson   :  C     A     B     F     E     D\nFacing   :  N     N     S     S     N     S\n\nClue check:\n(i)   C extreme left (absolute)          -> 1  OK\n(ii)  A imm. right of C (C=N, page +1)  -> 2  OK\n(iii) F 2nd right of A (A=N, page +2)   -> 4  OK\n(iv)  B imm. right of F (F=S, page -1)  -> 3  OK\n(v)   D extreme right (absolute)        -> 6  OK\n(vi)  E imm. right of D (D=S, page -1)  -> 5  OK\n\nSame words, opposite page-moves: (iii) went +2, (iv) went -1.",
    interviewQuestion:
      "In the arrangement C(N) A(N) B(S) F(S) E(N) D(S), who sits second to the right of B?",
  },
  {
    id: "ibpspo-pre-reason-circular",
    category: "ibpspo-prelims",
    topic: "Reasoning Ability",
    title: "Circular Seating: Facing Centre & Facing Outward",
    difficulty: "Advanced",
    summary:
      "Arranging people around a round table, where clockwise/anticlockwise maps to left/right depending on facing.",
    explanation:
      "A circle has no fixed ends, so there is no absolute frame to anchor to — which is exactly why left/right must come from the person's own body. Fix the mapping once:\n\n" +
      "FACING CENTRE (the common case): moving clockwise as you look at the diagram = each person's LEFT. Anticlockwise = each person's RIGHT.\n" +
      "FACING OUTWARD: the mirror image — clockwise = RIGHT, anticlockwise = LEFT.\n\n" +
      "For n people evenly spaced, 'sits opposite' means n/2 positions away (only meaningful for even n).\n\n" +
      "WORKED EXAMPLE\n" +
      "Eight persons A-H sit around a circular table facing the centre.\n" +
      "(i) B sits immediately to the left of A.\n" +
      "(ii) C sits second to the left of A.\n" +
      "(iii) D sits opposite H.\n" +
      "(iv) E sits immediately to the left of D.\n" +
      "(v) F sits second to the left of D.\n" +
      "(vi) G sits between F and H.\n\n" +
      "SOLVING IT\n" +
      "Number the seats 1-8 clockwise and park A at 1. Facing centre, so 'left' means +1 clockwise.\n" +
      "(i) B at 2. (ii) C at 3. Only H is left to face D across the table; place D at 4, which puts H at 8 by (iii). (iv) E at 5. (v) F at 6. (vi) G sits between F(6) and H(8) -> G at 7.\n\n" +
      "FINAL clockwise: A B C D E F G H at 1-8.\n\n" +
      "ANSWERING\n" +
      "'Third to the right of B': B is at 2, right = anticlockwise = subtract. 2-3 = -1, and -1 + 8 = 7 -> G. Walk it to confirm: anticlockwise from B gives A(1), H(8), G(7). Third is G.\n\n" +
      "MIXED-FACING CIRCLES\n" +
      "Some sets have a few people facing outward. Do not treat this as a different puzzle — just apply the outward mapping to those individuals only, exactly as you do in a mixed-direction row. Mark each seat with 'in' or 'out' before counting.\n\n" +
      "PRACTICAL TIP\n" +
      "Always number the seats and convert every clue to arithmetic on those numbers, wrapping with mod n. Counting round a hand-drawn circle by eye is where errors creep in under time pressure.",
    code: "Seats 1..8 clockwise, all facing centre:\n  1=A  2=B  3=C  4=D  5=E  6=F  7=G  8=H\n\nFacing CENTRE : left = +1 (clockwise), right = -1 (anticlockwise)\nFacing OUTWARD: left = -1, right = +1\nOpposite (n=8): +4 (or -4, same seat)\n\nWorked: 3rd to the RIGHT of B\n  B = seat 2, facing centre -> right = anticlockwise = -3\n  2 - 3 = -1  ->  -1 + 8 = 7  ->  G\n  Check by walking: A(1), H(8), G(7).  3rd = G",
    interviewQuestion:
      "Eight people sit facing the centre in clockwise order A-H. Who sits fourth to the left of C, and who sits opposite E?",
  },
  {
    id: "ibpspo-pre-reason-doublerow",
    category: "ibpspo-prelims",
    topic: "Reasoning Ability",
    title: "Double Row (Parallel) Seating",
    difficulty: "Advanced",
    summary:
      "Two facing rows, one north-facing and one south-facing, linked by 'sits opposite' column clues.",
    explanation:
      "Two rows sit facing each other. The row that faces north is drawn below; the row that faces south is drawn above it, so that each column pairs one person from each row. 'Sits opposite' always means same column.\n\n" +
      "Apply the left/right rule PER ROW:\n" +
      "- North-facing row: left/right read normally off the page.\n" +
      "- South-facing row: left/right reversed on the page.\n" +
      "'Extreme left/right end' stays absolute for both rows — it is the physical end as drawn.\n\n" +
      "WORKED EXAMPLE\n" +
      "P, Q, R, S sit in Row 1 facing north. W, X, Y, Z sit in Row 2 facing south. Each Row 1 member faces exactly one Row 2 member.\n" +
      "(i) Q sits at the extreme left end of Row 1.\n" +
      "(ii) P sits immediately to the right of Q.\n" +
      "(iii) R sits at the extreme right end of Row 1.\n" +
      "(iv) W sits exactly opposite P.\n" +
      "(v) Y sits immediately to the right of W.\n" +
      "(vi) X sits at the extreme right end of Row 2.\n\n" +
      "SOLVING IT\n" +
      "Label the four columns 1-4 left to right on the page.\n" +
      "(i) absolute -> Q in column 1. (ii) Q faces north so right is page-right -> P in column 2. (iii) absolute -> R in column 4, leaving S in column 3. Row 1 is done: Q P S R.\n" +
      "(iv) opposite is same column -> W in column 2.\n" +
      "(v) W faces SOUTH, so W's right is page-LEFT -> Y in column 1. Reading this page-right would send Y to column 3 and break the puzzle.\n" +
      "(vi) absolute -> X in column 4, leaving Z in column 3. Row 2 is done: Y W Z X.\n\n" +
      "ANSWERING\n" +
      "'Who sits opposite S?' S is in column 3, so Z. 'Who sits second to the right of X?' X faces south, so right is page-left: column 4 - 2 = column 2 -> W.\n\n" +
      "THE CLASSIC OBJECTION\n" +
      "Students often protest that clue (vi) cannot put X at the extreme right because the south-facing row's 'right' is flipped. It can — 'extreme end' is absolute and never flips. Only the relational left/right clues, (v) here, use the row's perspective.",
    code: "                col1   col2   col3   col4\nRow 2 (South)  :   Y      W      Z      X\nRow 1 (North)  :   Q      P      S      R\n(same column = sits opposite)\n\nRow 1 faces N -> right = page-right (+)\nRow 2 faces S -> right = page-left  (-)\n\n(ii) P imm. right of Q  (Q=N, +1) -> col 2   OK\n(v)  Y imm. right of W  (W=S, -1) -> col 1   OK\n(vi) X extreme right (absolute)   -> col 4   OK\n\nQ: 2nd to the right of X -> X=S -> 4 - 2 = col 2 -> W",
    interviewQuestion:
      "Row 1 faces north as Q-P-S-R and Row 2 faces south as Y-W-Z-X. Who sits immediately to the left of Z, and who faces R?",
  },
  {
    id: "ibpspo-pre-reason-floorbox",
    category: "ibpspo-prelims",
    topic: "Reasoning Ability",
    title: "Floor & Box (Stack) Puzzles",
    difficulty: "Intermediate",
    summary:
      "Vertical arrangements where 'above/below' replaces left/right — no facing direction involved at all.",
    explanation:
      "Floors are numbered from the bottom (floor 1 lowest) and boxes stack the same way. Because these are vertical, facing direction plays no part: above and below are absolute. That makes them the most mechanical puzzle type and the fastest marks in the set — attempt them first.\n\n" +
      "READING THE CLUE LANGUAGE PRECISELY\n" +
      "- 'Only two persons live between D and E' -> exactly 2 floors strictly in between, so the gap between their floor numbers is 3.\n" +
      "- 'D lives immediately above C' -> D = C + 1.\n" +
      "- 'At least three persons live above F' -> F is on floor 5 or lower in an 8-floor building.\n" +
      "- 'As many persons above A as below B' -> set up the count equation, do not guess.\n\n" +
      "WORKED EXAMPLE\n" +
      "Eight persons A-H live on floors 1 (lowest) to 8.\n" +
      "(i) D lives on the lowest floor.\n" +
      "(ii) G lives on the topmost floor.\n" +
      "(iii) B lives immediately below G.\n" +
      "(iv) Only two persons live between D and E.\n" +
      "(v) F lives immediately below E.\n" +
      "(vi) C lives immediately above D.\n" +
      "(vii) A lives immediately below H.\n\n" +
      "SOLVING IT\n" +
      "(i) D = 1. (ii) G = 8. (iii) B = 7.\n" +
      "(iv) Two persons strictly between floor 1 and E means floors 2 and 3 are occupied by others, so E = 4.\n" +
      "(v) F = 3. (vi) C = 2.\n" +
      "Floors 5 and 6 remain, and (vii) needs A directly under H -> A = 5, H = 6.\n\n" +
      "FINAL, top down: G(8) B(7) H(6) A(5) E(4) F(3) C(2) D(1).\n" +
      "'How many persons live between F and B?' F is 3 and B is 7, so floors 4, 5, 6 -> three persons.\n\n" +
      "STRATEGY\n" +
      "Start from whichever clue fixes an absolute floor (lowest, topmost, exact number). Block clues like (v) and (vii) lock two people into a rigid pair that can slide as a unit — place them last, once the count of free floors forces the position.",
    code: "Floor  Person\n  8      G     <- topmost (ii)\n  7      B     <- immediately below G (iii)\n  6      H     |\n  5      A     | A immediately below H (vii)\n  4      E     <- two persons between D and E (iv)\n  3      F     <- immediately below E (v)\n  2      C     <- immediately above D (vi)\n  1      D     <- lowest (i)\n\nGap arithmetic:\n  'exactly k persons between X and Y'  ->  |X - Y| = k + 1\n  'immediately above'                  ->  X = Y + 1\n\nBetween F(3) and B(7): floors 4,5,6 -> 3 persons",
    interviewQuestion:
      "Eight boxes are stacked 1 (bottom) to 8. Only three boxes lie between P and Q, and P is immediately above R which is at position 2. Where are P and Q?",
  },
  {
    id: "ibpspo-pre-reason-syllogism",
    category: "ibpspo-prelims",
    topic: "Reasoning Ability",
    title: "Syllogism: 'Only a few', Possibility & Definite Conclusions",
    difficulty: "Advanced",
    summary:
      "Deriving what must follow from given statements using Venn logic and the valid combination table.",
    explanation:
      "Treat statements as absolutely true even if absurd in real life, then ask: is the conclusion forced in EVERY valid diagram?\n\n" +
      "DECODING THE STATEMENT FORMS\n" +
      "- 'All A are B' -> A sits entirely inside B.\n" +
      "- 'Some A are B' -> the circles overlap.\n" +
      "- 'No A is B' -> the circles are fully separate.\n" +
      "- 'Only a few A are B' -> split it into TWO facts: Some A are B, AND Some A are not B. (It also rules out 'All A are B'.)\n" +
      "- 'Only A are B' -> reverse it: All B are A.\n\n" +
      "THE COMBINATION TABLE (memorise this)\n" +
      "  All + All = All        |  All + No = No\n" +
      "  Some + All = Some      |  Some + No = Some not\n" +
      "  All + Some = NO CONCLUSION   <- the trap\n" +
      "  Some + Some = NO CONCLUSION\n" +
      "The middle term must be the subject of the second statement for a chain to be valid. 'All A are B + Some B are C' gives nothing about A and C, because the overlap between B and C might sit entirely outside A.\n\n" +
      "DEFINITE vs POSSIBILITY WORDING\n" +
      "This decides the whole question:\n" +
      "- A plainly worded conclusion ('Some X are Y') must hold in EVERY valid diagram. One counter-diagram kills it.\n" +
      "- A possibility conclusion ('Some X being Y is a possibility', 'X can be Y') only needs ONE valid diagram where it is true. And note: anything definitely true is automatically possible too.\n\n" +
      "WORKED EXAMPLE\n" +
      "Statements: Only a few chairs are tables. All tables are sofas.\n" +
      "Conclusion I: Some sofas are chairs.\n" +
      "Decode: 'Only a few chairs are tables' gives Some chairs are tables. Chain with 'All tables are sofas': Some + All = Some, so Some chairs are sofas. A 'some' statement always converts, so Some sofas are chairs. This is forced in every diagram — the chairs that are tables must be inside sofas. Conclusion I FOLLOWS.\n" +
      "This is the valid Some+All chain; do not confuse it with the invalid All+Some form in the table above.\n\n" +
      "EITHER-OR CASE\n" +
      "If two conclusions both fail individually but together cover every possibility and cannot both be false (typically 'Some A are B' and 'No A is B', or a >= / < pair), mark 'either I or II follows'. Check this only after both have failed on their own.",
    code: "Decoding:\n  Only a few A are B  ->  Some A are B  +  Some A are not B\n  Only A are B        ->  All B are A\n\nValid chains (middle term must link):\n  Some A are B + All B are C  ->  Some A are C   VALID\n  All A are B  + All B are C  ->  All A are C    VALID\n  All A are B  + No B is C    ->  No A is C      VALID\n  All A are B  + Some B are C ->  nothing        INVALID\n  Some A are B + Some B are C ->  nothing        INVALID\n\nTest to apply:\n  plain conclusion      -> must be true in EVERY diagram\n  possibility conclusion-> true in ANY ONE diagram is enough",
    interviewQuestion:
      "Statements: Only a few pens are books. All books are papers. No paper is a bag. Do these follow — I. Some pens are papers. II. No book is a bag.",
  },
  {
    id: "ibpspo-pre-reason-inequality",
    category: "ibpspo-prelims",
    topic: "Reasoning Ability",
    title: "Inequalities: Direct, Coded & the Either-Or Case",
    difficulty: "Intermediate",
    summary:
      "Chaining comparison symbols to decide which conclusions are definitely true — reliable, fast marks.",
    explanation:
      "Five nearly-free marks per paper if you are disciplined. A conclusion is valid only when an UNBROKEN chain of symbols all pointing the SAME way connects the two letters.\n\n" +
      "THE CORE RULES\n" +
      "1. Same direction throughout -> combine. A > B > C gives A > C.\n" +
      "2. Direction changes anywhere -> no relation. A > B < C says nothing about A and C.\n" +
      "3. The weakest link decides the symbol. A > B >= C gives A > C (strict wins over 'or equal' only if a strict sign appears anywhere in the chain). A >= B >= C gives A >= C.\n" +
      "4. '=' passes the relation straight through. A > B = C gives A > C.\n\n" +
      "PRIORITY ORDER: > and < are stronger than >= and <=, which are stronger than =.\n\n" +
      "THE EITHER-OR CASE\n" +
      "When both conclusions concern the SAME pair of letters and both individually fail, check whether together they exhaust every possibility. If yes, the answer is 'either I or II follows'.\n" +
      "The two classic complementary pairs are:\n" +
      "- 'A > B' and 'A <= B'\n" +
      "- 'A >= B' and 'A < B'\n" +
      "Together each pair covers all cases and cannot both be true, so exactly one must hold. Note that 'A > B' and 'A < B' are NOT complementary — A = B satisfies neither.\n\n" +
      "WORKED EXAMPLE\n" +
      "Statement: P >= Q > R = S <= T\n" +
      "Conclusion I: P > R. Chain P >= Q > R is all one direction and contains a strict >, so P > R is TRUE.\n" +
      "Conclusion II: T > S. The chain gives S <= T, which allows T > S or T = S, so it is not definite — FALSE. But 'T >= S' would have been true.\n" +
      "Conclusion III: P > S. R = S passes through, so P > R = S gives P > S, TRUE.\n\n" +
      "CODED INEQUALITIES\n" +
      "Mains-style sets replace symbols with letters or symbols, e.g. 'A @ B' means A is not smaller than B (A >= B). Rewrite every coded statement into plain symbols FIRST, in the margin, then solve exactly as above. Every error in this type comes from decoding on the fly instead of rewriting.",
    code: "Chain rules:\n  A > B > C     ->  A > C        (same direction)\n  A > B >= C    ->  A > C        (strict sign present)\n  A >= B >= C   ->  A >= C\n  A > B = C     ->  A > C        ('=' passes through)\n  A > B < C     ->  NO RELATION  (direction flips)\n\nComplementary (either-or) pairs:\n  (A > B)  and  (A <= B)     <- exactly one must be true\n  (A >= B) and  (A < B)      <- exactly one must be true\n  (A > B)  and  (A < B)      <- NOT complementary (A = B fits neither)\n\nExample: P >= Q > R = S <= T\n  P > R  TRUE   | T > S  FALSE (T >= S is true)\n  P > S  TRUE   | P > T  no relation",
    interviewQuestion:
      "Given A <= B < C = D >= E, decide which follow: I. C > A  II. D > B  III. D >= A",
  },
  {
    id: "ibpspo-pre-reason-bloodrelations",
    category: "ibpspo-prelims",
    topic: "Reasoning Ability",
    title: "Blood Relations & Coded Relations",
    difficulty: "Intermediate",
    summary:
      "Building family trees from statements, including symbol-coded and puzzle-embedded variants.",
    explanation:
      "Draw a tree. Never try to hold a family in your head — every error in this topic comes from skipping the diagram.\n\n" +
      "NOTATION THAT KEEPS YOU HONEST\n" +
      "Use + for male, - for female, a horizontal double line for a married couple, and a vertical line downward for a child. Same generation goes on the same horizontal level. If a person's gender is never stated, leave it unmarked — a huge share of 'cannot be determined' answers hinge on exactly that.\n\n" +
      "THE STANDARD DECODE\n" +
      "Read these phrases from the inside out, one clause at a time:\n" +
      "- 'the only daughter of my mother' = the speaker herself, IF the speaker is female and has no sisters.\n" +
      "- 'the only son of my grandfather' = the speaker's father (or an uncle, if not unique — check the wording).\n" +
      "- 'my father's only brother' = paternal uncle.\n" +
      "- 'my mother's brother's father' = maternal grandfather.\n\n" +
      "WORKED EXAMPLE\n" +
      "Pointing to a man, a woman said, 'His mother is the only daughter of my mother.'\n" +
      "Work inward: 'the only daughter of my mother' is the woman speaking. So the man's mother is the woman herself, which makes the woman his MOTHER. The common wrong answer is 'aunt' — that would need the phrase to be 'my mother's daughter' with a sister existing, which 'only daughter' explicitly rules out.\n\n" +
      "CODED RELATIONS\n" +
      "Symbol sets define operators, e.g. 'P + Q' means P is the father of Q, 'P - Q' means P is the mother of Q, 'P x Q' means P is the brother of Q. Expressions are read LEFT TO RIGHT.\n" +
      "So to express 'P is the grandfather of Q', you need P as father of some middle person R who is a parent of Q: 'P + R + Q' or 'P + R - Q' both work, since either a son or a daughter of P still makes P the grandfather.\n\n" +
      "GENERATION SHORTCUT\n" +
      "Count generation levels rather than naming relations. Two levels up on the father's side is a paternal grandparent; one level up and sideways is an uncle or aunt. This alone answers most 'how is X related to Y' questions in seconds.",
    code: "Symbols:\n  +  male     -  female     ==  married     |  child of\n\nGrandfather chain (read left to right):\n  P + R  ->  P is father of R\n  R - Q  ->  R is mother of Q\n  P + R - Q  =>  P is the grandfather of Q     VALID\n  P + R + Q  =>  also grandfather (via a son)   VALID\n  P x R + Q  =>  P is the UNCLE of Q (brother, not parent)\n\n'His mother is the only daughter of my mother'\n  only daughter of my mother = the speaker (female, no sisters)\n  => speaker IS his mother  ->  answer: Mother",
    interviewQuestion:
      "If 'A - B' means A is the mother of B and 'A + B' means A is the father of B, what does 'P + Q - R' make P to R?",
  },
  {
    id: "ibpspo-pre-reason-direction",
    category: "ibpspo-prelims",
    topic: "Reasoning Ability",
    title: "Direction Sense & Distance",
    difficulty: "Basic",
    summary:
      "Tracking movement across turns and computing net displacement with Pythagoras.",
    explanation:
      "Always draw with north up, east right, south down, west left, and keep to a rough scale so the geometry stays readable.\n\n" +
      "TURN LOGIC\n" +
      "A left turn rotates you 90 degrees anticlockwise; a right turn rotates you 90 degrees clockwise. The result depends entirely on your CURRENT heading, not on the page:\n" +
      "- Facing north, turn left -> west. Facing north, turn right -> east.\n" +
      "- Facing south, turn left -> east. Facing south, turn right -> west. (Same reversal as seating puzzles — it is the same underlying idea.)\n" +
      "- Facing east, turn left -> north; turn right -> south.\n" +
      "- Facing west, turn left -> south; turn right -> north.\n\n" +
      "SHORTEST DISTANCE\n" +
      "Net displacement is never the sum of the walked distances. Add up the north-south moves as one signed total and the east-west moves as another, then apply Pythagoras to those two totals only.\n\n" +
      "WORKED EXAMPLE\n" +
      "A man walks 10 m north, then 6 m east, then 2 m south, then 2 m east. How far is he from the start?\n" +
      "Vertical: +10 north then -2 south = 8 m north.\n" +
      "Horizontal: 6 + 2 = 8 m east.\n" +
      "Shortest distance = sqrt(8^2 + 8^2) = sqrt(128) = 8*sqrt(2), about 11.3 m, in the north-east direction.\n\n" +
      "TRIPLES WORTH KNOWING\n" +
      "Papers overwhelmingly use 3-4-5, 6-8-10, 5-12-13, 8-15-17 and 9-12-15. If your two totals match one of these, write the answer without computing a square root.\n\n" +
      "SHADOW QUESTIONS\n" +
      "Early morning sun is in the EAST, so shadows fall to the WEST; in the evening the sun is in the west and shadows fall east. At noon the shadow is negligible. If a question says a person's shadow fell to their left in the morning, they face north.",
    code: "Turning from a heading:\n  Heading  Left-turn  Right-turn\n  North      West       East\n  South      East       West\n  East       North      South\n  West       South      North\n\nNet displacement:\n  10 N, 6 E, 2 S, 2 E\n  N-S: +10 - 2 = 8 north\n  E-W: +6 + 2 = 8 east\n  distance = sqrt(8^2 + 8^2) = 8*sqrt(2) ~ 11.3 m, north-east\n\nTriples to spot instantly:\n  3-4-5 | 6-8-10 | 5-12-13 | 8-15-17 | 9-12-15",
    interviewQuestion:
      "A walks 15 m south, turns left and walks 20 m, turns left again and walks 15 m. How far and in which direction is A from the starting point?",
  },
  {
    id: "ibpspo-pre-reason-ranking",
    category: "ibpspo-prelims",
    topic: "Reasoning Ability",
    title: "Order, Ranking & Position Counting",
    difficulty: "Basic",
    summary:
      "Converting rank-from-left / rank-from-right statements into totals without double counting.",
    explanation:
      "Every question here reduces to one formula and the discipline not to double-count the person you are measuring.\n\n" +
      "THE CORE FORMULA\n" +
      "Total = (rank from left) + (rank from right) - 1\n" +
      "The -1 exists because the person themselves is counted once from each side. Forgetting it is the single most common error in this topic.\n\n" +
      "THE OTHER TWO PATTERNS\n" +
      "1. Persons strictly BETWEEN two people whose positions from the same end are known: difference of positions - 1. If A is 7th from the left and B is 12th from the left, the number between them is 12 - 7 - 1 = 4.\n" +
      "2. Positions given from OPPOSITE ends with an overlap: if A is 10th from the left and B is 12th from the right in a row of 18, then A is at 10 and B is at 18 - 12 + 1 = 7. So B stands to A's left, and the number between them is 10 - 7 - 1 = 2.\n\n" +
      "WORKED EXAMPLE\n" +
      "In a class, Rahul is 12th from the top and 18th from the bottom. How many students are in the class?\n" +
      "Total = 12 + 18 - 1 = 29.\n\n" +
      "SECOND WORKED EXAMPLE\n" +
      "In a row of 40, A is 15th from the left. What is A's rank from the right?\n" +
      "Rank from right = 40 - 15 + 1 = 26.\n\n" +
      "WATCH THE WORDING\n" +
      "'Rank 5th from the left' includes that person; 'there are 5 persons to the left' does NOT — that puts them 6th. Papers deliberately alternate between the two phrasings inside a single question set, so read each statement as if you have not seen the previous one.\n\n" +
      "INTERCHANGE PROBLEMS\n" +
      "When two people swap places and new ranks are given, the row length is unchanged. Write both people's old and new positions from the SAME end and solve the resulting small equation — never mix ends mid-working.",
    code: "Core formulas:\n  Total          = left rank + right rank - 1\n  Rank from right = Total - left rank + 1\n  Between (same end)     = |p1 - p2| - 1\n  Between (opposite ends, overlapping) = convert both to one end first\n\nExamples:\n  12th from top, 18th from bottom -> 12 + 18 - 1 = 29 students\n  Row of 40, 15th from left       -> 40 - 15 + 1 = 26th from right\n  A=7th left, B=12th left         -> 12 - 7 - 1 = 4 between\n\nPhrasing trap:\n  '5th from the left'          -> position 5\n  'five persons to the left'   -> position 6",
    interviewQuestion:
      "In a row of children, Sita is 9th from the left and Gita is 8th from the right. If they swap and Sita becomes 15th from the left, how many children are in the row?",
  },
  {
    id: "ibpspo-pre-reason-coding",
    category: "ibpspo-prelims",
    topic: "Reasoning Ability",
    title: "Coding-Decoding: Letter Shift, New Pattern & Conditional",
    difficulty: "Intermediate",
    summary:
      "Cracking the rule that maps words to codes — shifts, positional values and symbol-based new-pattern sets.",
    explanation:
      "Know the alphabet positions cold: A=1 ... Z=26. The EJOTY trick anchors you — E=5, J=10, O=15, T=20, Y=25 — so any letter can be located within two steps. Also memorise the opposite pairs (A-Z, B-Y, C-X ...), where the two positions always sum to 27.\n\n" +
      "TYPE 1 — LETTER SHIFT\n" +
      "Each letter moves a fixed number of places. Compare the first letters to find the shift, then verify on a second letter before trusting it. If CAT becomes DBU, every letter moved +1. Shifts may also alternate (+1, -1, +1, -1) or grow (+1, +2, +3), so always check at least three letters.\n\n" +
      "TYPE 2 — NEW PATTERN / MESSAGE CODING\n" +
      "Several sentences are given with their codes, words scrambled. Find a word appearing in two sentences and the code common to both — that pairing is forced. Cross out matched pairs and repeat. Two sentences sharing exactly one word give you that word's code immediately.\n\n" +
      "TYPE 3 — CONDITIONAL / SYMBOL CODING\n" +
      "A table maps letters or digits to symbols, plus override conditions such as 'if the first and last elements are both consonants, swap their codes' or 'if a vowel is followed by a digit, code both as #'. Apply base codes FIRST, then test the conditions in the order printed. Conditions are checked against the ORIGINAL string, not against your partly-coded version — this is where most marks are lost.\n\n" +
      "WORKED EXAMPLE\n" +
      "If in a code MONDAY is written as NPOEBZ, how is FRIDAY written?\n" +
      "M->N, O->P, N->O: each letter shifts +1. Applying +1 to FRIDAY: F->G, R->S, I->J, D->E, A->B, Y->Z, giving GSJEBZ.\n\n" +
      "SPEED HABIT\n" +
      "Write the alphabet with its numbers along the top of your rough sheet once at the start of the section. Every coding, series and alphabet-test question then becomes lookup rather than counting.",
    code: "Anchors:  A=1  E=5  J=10  O=15  T=20  Y=25  Z=26\nOpposite pair rule: position(X) + position(opposite) = 27\n  A-Z  B-Y  C-X  D-W  E-V  ...  M-N\n\nShift example:\n  MONDAY -> NPOEBZ   (each letter +1)\n  FRIDAY -> GSJEBZ\n\nNew-pattern method:\n  'pen is blue'  -> 'ka lo mi'\n  'pen is red'   -> 'lo ka zo'\n  common words: pen, is | common codes: ka, lo\n  => 'blue' = mi and 'red' = zo (forced, no guessing)\n\nConditional coding: apply base codes, then test\nconditions against the ORIGINAL string, in printed order.",
    interviewQuestion:
      "In a certain code, TEACHER is written as VGCEJGT. How would STUDENT be written in the same code?",
  },
  {
    id: "ibpspo-pre-reason-alphanumeric",
    category: "ibpspo-prelims",
    topic: "Reasoning Ability",
    title: "Alphanumeric Series & Alphabet Tests",
    difficulty: "Basic",
    summary:
      "Scanning a mixed string of letters, digits and symbols against positional conditions.",
    explanation:
      "A random sequence of letters, digits and symbols is given, followed by questions about elements meeting a condition. These are pure scanning marks — no reasoning required, only care.\n\n" +
      "THE FOUR RECURRING QUESTION SHAPES\n" +
      "1. 'How many digits are immediately preceded by a letter and immediately followed by a symbol?' — read the pattern as a three-element window and slide it along once, left to right.\n" +
      "2. 'Which element is 5th to the right of the 12th from the left?' — combine to a single index instead of counting twice: 12 + 5 = the 17th from the left.\n" +
      "3. 'Which element is 4th to the left of the 7th from the right?' — again combine: 7 + 4 = the 11th from the right.\n" +
      "4. 'How many letters are there between the 3rd from the left and the 5th from the right?' — convert both to positions from the same end first.\n\n" +
      "THE ONE RULE THAT MATTERS\n" +
      "'Immediately preceded by' means the element comes BEFORE it in the string, to its left. 'Immediately followed by' means to its right. Roughly half of all lost marks in this topic are simply preceded/followed read backwards, so underline the two words in the question before scanning.\n\n" +
      "ALPHABET TESTS\n" +
      "Related quick types worth drilling:\n" +
      "- Letters between two given letters: |position difference| - 1.\n" +
      "- Nth letter from the left of the alphabet: direct position. From the right: 27 - n.\n" +
      "- 'Which letter is 5th to the right of the 12th letter from the left?' -> 12 + 5 = 17th letter = Q.\n" +
      "- Word formation: 'how many meaningful English words can be formed from the letters D, E, R, O' — try common patterns systematically (DOER, REDO, RODE, DORE) rather than at random, and count each distinct word once.\n\n" +
      "TIME BUDGET\n" +
      "Never spend more than 25-30 seconds on one of these. If a scan is not resolving, mark it and move on; the puzzle sets carry far more marks per minute.",
    code: "Index combining (do the arithmetic, do not count twice):\n  Nth to the RIGHT of Mth from the LEFT   ->  (M + N)th from the left\n  Nth to the LEFT  of Mth from the RIGHT  ->  (M + N)th from the right\n  Nth to the LEFT  of Mth from the LEFT   ->  (M - N)th from the left\n  Nth to the RIGHT of Mth from the RIGHT  ->  (M - N)th from the right\n\nAlphabet:\n  letters strictly between X and Y = |pos(X) - pos(Y)| - 1\n  nth letter from the right        = 27 - n\n\nWindow scanning for 'letter-digit-symbol':\n  slide a 3-wide window once, left to right; never rescan\n\nPRECEDED = to the LEFT   |   FOLLOWED = to the RIGHT",
    interviewQuestion:
      "In the series R 4 % K 9 M @ 2 P # 7 J, how many digits are immediately preceded by a letter and immediately followed by a symbol?",
  },
  {
    id: "ibpspo-pre-reason-datasufficiency",
    category: "ibpspo-prelims",
    topic: "Reasoning Ability",
    title: "Data Sufficiency in Reasoning",
    difficulty: "Advanced",
    summary:
      "Judging whether given statements are enough to answer — without ever computing the answer itself.",
    explanation:
      "You are asked whether the data SUFFICES, not what the answer is. Solving fully is wasted time and actively causes errors, because knowing the answer makes an insufficient statement feel sufficient.\n\n" +
      "THE STANDARD OPTION SET\n" +
      "(a) Statement I alone is sufficient, II alone is not.\n" +
      "(b) Statement II alone is sufficient, I alone is not.\n" +
      "(c) Either statement alone is sufficient.\n" +
      "(d) Both together are still not sufficient.\n" +
      "(e) Both together are needed (neither alone works).\n" +
      "Read the option order printed in your paper — banks do shuffle it between (d) and (e).\n\n" +
      "METHOD\n" +
      "1. Test statement I completely ALONE. Deliberately forget II exists — contamination between statements is the classic trap.\n" +
      "2. Test statement II completely alone.\n" +
      "3. Only if both fail individually, test them together.\n" +
      "4. 'Sufficient' means it yields exactly ONE answer. If two arrangements both survive, it is insufficient, however close they look.\n\n" +
      "WORKED EXAMPLE\n" +
      "Question: Who sits at the extreme left end of a row of five (A-E, all facing north)?\n" +
      "Statement I: A sits second to the right of B, and C sits at an extreme end.\n" +
      "Statement II: D sits immediately to the left of A, and B is not at any end.\n" +
      "I alone: B could be at position 1 or 2, so A is at 3 or 4, and C could be at either end. More than one layout survives -> insufficient.\n" +
      "II alone: places D and A as a block but leaves the block free to slide -> insufficient.\n" +
      "Together: B is not at an end, so from I, B is at 2 and A at 4; then from II, D is at 3; C must take an end, and position 1 is free -> C at 1. A unique answer emerges, so the answer is (e), both statements needed.\n\n" +
      "THE DISCIPLINE\n" +
      "Stop the moment sufficiency is decided. Do not finish the arrangement to satisfy your curiosity — in a timed paper that habit costs a full question elsewhere.",
    code: "Procedure:\n  1. I alone?     (pretend II does not exist)\n  2. II alone?    (pretend I does not exist)\n  3. Both together, ONLY if both failed alone\n  4. Sufficient == exactly ONE possible answer\n\nMapping to options:\n  I works, II fails            -> (a)\n  II works, I fails            -> (b)\n  each works separately        -> (c)\n  both fail even together      -> (d)\n  both needed jointly          -> (e)\n\nMost common error: carrying a fact from\nstatement I into your test of statement II.",
    interviewQuestion:
      "Is P the mother of Q? I. Q is the daughter of R, and R is married to P. II. P has two children, and Q is the youngest. Which statement(s) suffice?",
  },
  {
    id: "ibpspo-pre-reason-oddanalogy",
    category: "ibpspo-prelims",
    topic: "Reasoning Ability",
    title: "Odd One Out, Analogy & Classification",
    difficulty: "Basic",
    summary:
      "Spotting the shared rule behind four items and the one that breaks it.",
    explanation:
      "Four of five items share a property; find it and eliminate the exception. Work through candidate rules in a fixed order rather than staring at the options.\n\n" +
      "RULE CHECKLIST FOR LETTER GROUPS\n" +
      "1. Constant gap between consecutive letters. BDFH has gaps of +2, +2, +2; MOQS and PRTV are the same; WYAC also works if you wrap Z round to A. HJLO has gaps +2, +2, +3 — so HJLO is the odd one.\n" +
      "2. Positional sum, or first-plus-last summing to a constant.\n" +
      "3. Vowel/consonant composition.\n" +
      "4. Reversal or mirror relationship (opposite pairs summing to 27).\n\n" +
      "RULE CHECKLIST FOR NUMBERS\n" +
      "Prime or composite; perfect square or cube; divisibility by a common factor; digit sum; difference between consecutive terms; one more or one less than a square.\n\n" +
      "ANALOGY FORM 'A : B :: C : ?'\n" +
      "Name the relationship between A and B in words BEFORE looking at the options — 'is a part of', 'is the tool of', 'is the young of', 'is the place where'. Then apply that exact sentence to C. Reading the options first is what drags you toward a plausible but wrong pairing.\n" +
      "Preserve the ORDER of the relationship too: 'Doctor : Hospital' is worker-to-workplace, so the answer must be worker-to-workplace, not workplace-to-worker.\n\n" +
      "WORKED EXAMPLE\n" +
      "Find the odd one: (a) BDFH (b) MOQS (c) PRTV (d) WYAC (e) HJLO.\n" +
      "Gaps: BDFH +2+2+2; MOQS +2+2+2; PRTV +2+2+2; WYAC +2+2+2 wrapping past Z; HJLO +2+2+3. Answer: HJLO.\n\n" +
      "CAUTION\n" +
      "If two different rules each isolate a different item, you have found a coincidence, not the intended rule. Prefer the simplest rule that fits four items exactly — exam setters do not build layered classifications at prelims level.",
    code: "Letter-group checklist, in order:\n  1. constant gap?      BDFH = +2,+2,+2\n  2. wrap past Z?       WYAC = W,Y,A,C = +2,+2,+2  (valid)\n  3. positional sum?\n  4. vowel/consonant shape?\n\nWorked: (a) BDFH (b) MOQS (c) PRTV (d) WYAC (e) HJLO\n  HJLO = +2, +2, +3   <- breaks the pattern  -> ODD\n\nNumber checklist:\n  prime | perfect square | perfect cube\n  common divisor | digit sum | square +/- 1\n\nAnalogy: state the relation as a SENTENCE first,\nthen apply it to the third term, keeping the order.",
    interviewQuestion:
      "Find the odd one out: (a) 124 (b) 217 (c) 342 (d) 511 (e) 728 — and state the rule you used.",
  },

  // ── QUANTITATIVE APTITUDE (continued) ─────────────────────────────────────────
  {
    id: "ibpspo-pre-quant-numberseries",
    category: "ibpspo-prelims",
    topic: "Quantitative Aptitude",
    title: "Number Series: Missing & Wrong Term",
    difficulty: "Intermediate",
    summary:
      "Identifying the generating rule of a sequence to supply a missing term or spot the intruder.",
    explanation:
      "Five near-guaranteed marks. Work through a fixed diagnostic order instead of staring at the numbers.\n\n" +
      "STEP 1 — DIFFERENCES\n" +
      "Write the gaps between consecutive terms. If the gaps are constant it is arithmetic. If the gaps themselves form a pattern (2, 4, 6, 8 or 1, 4, 9, 16) take the second differences.\n\n" +
      "STEP 2 — RATIOS\n" +
      "If terms grow fast, divide each by the previous. A constant ratio is geometric. A changing ratio may still be systematic: x2, x3, x4 or x1.5, x2, x2.5.\n\n" +
      "STEP 3 — THE STANDARD FAMILIES\n" +
      "- Squares and cubes, often offset: 3, 8, 15, 24, 35 is n^2 - 1. And 2, 9, 28, 65 is n^3 + 1.\n" +
      "- Multiply-and-add: each term = previous x k + c. For 5, 11, 23, 47, 95 the rule is x2 + 1.\n" +
      "- Prime-based: 2, 3, 5, 7, 11, 13.\n" +
      "- Alternating series: two independent sequences interleaved. Check odd-indexed and even-indexed terms separately whenever nothing else fits.\n" +
      "- Sum of the two previous terms (Fibonacci-like).\n\n" +
      "WORKED EXAMPLE — MISSING TERM\n" +
      "Find the missing term: 7, 9, 13, 21, 37, ?\n" +
      "Differences: 2, 4, 8, 16 — each doubles. The next difference is 32, so the answer is 37 + 32 = 69.\n\n" +
      "WORKED EXAMPLE — WRONG TERM\n" +
      "Find the wrong term: 4, 5, 12, 39, 160, 805\n" +
      "Test x1+1, x2+2, x3+3, ...: 4x1+1 = 5, 5x2+2 = 12, 12x3+3 = 39, 39x4+4 = 160, 160x5+5 = 805. Every term fits, so nothing is wrong here — which is exactly the check to run before declaring a term wrong. If instead 39 had been printed as 40, the chain would break at that single point and 40 would be the intruder.\n\n" +
      "EXAM TACTIC\n" +
      "For 'wrong term' questions, verify the rule on the FIRST three terms and then push it forward. The intruder is usually the one term that breaks an otherwise clean chain — do not rebuild the rule around it.",
    code: "Diagnostic order:\n  1. differences         -> constant? patterned?\n  2. second differences\n  3. ratios              -> constant? x2, x3, x4?\n  4. squares/cubes +/- k\n  5. prev x k + c\n  6. alternating (split odd/even positions)\n\nWorked:\n  7, 9, 13, 21, 37, ?\n  diffs: 2, 4, 8, 16  (doubling) -> next 32\n  answer = 37 + 32 = 69\n\n  4, 5, 12, 39, 160, 805\n  x1+1, x2+2, x3+3, x4+4, x5+5  -> chain is consistent\n\nCommon offsets:\n  n^2 - 1 : 3, 8, 15, 24, 35\n  n^3 + 1 : 2, 9, 28, 65, 126",
    interviewQuestion:
      "Find the wrong term in the series: 6, 12, 21, 33, 49, 66, 87.",
  },
  {
    id: "ibpspo-pre-quant-percentage",
    category: "ibpspo-prelims",
    topic: "Quantitative Aptitude",
    title: "Percentages & Fraction Conversions",
    difficulty: "Basic",
    summary:
      "The foundation for DI, profit-loss and interest — convert percentages to fractions to kill long multiplication.",
    explanation:
      "Percentage is the highest-leverage topic in the section because DI, profit and loss, interest and mixtures all sit on top of it. The single biggest speed gain is memorising the fraction table so that 37.5% of 640 becomes 3/8 of 640 = 240 mentally.\n\n" +
      "FRACTION TABLE TO MEMORISE\n" +
      "1/2 = 50%, 1/3 = 33.33%, 1/4 = 25%, 1/5 = 20%, 1/6 = 16.67%, 1/7 = 14.28%, 1/8 = 12.5%, 1/9 = 11.11%, 1/10 = 10%, 1/11 = 9.09%, 1/12 = 8.33%, 1/16 = 6.25%, 1/20 = 5%.\n" +
      "Multiples follow at once: 3/8 = 37.5%, 5/6 = 83.33%, 2/7 = 28.57%.\n\n" +
      "SUCCESSIVE CHANGE\n" +
      "Two consecutive changes of a% and b% are NOT a + b. Net change = a + b + (a*b/100), with decreases entered as negatives.\n" +
      "A 20% rise then a 20% fall gives 20 - 20 - 400/100 = -4%, a net 4% LOSS. This is the most-tested trap in the topic.\n\n" +
      "PERCENTAGE-TO-RATIO CONVERSIONS\n" +
      "- 'A is 25% more than B' -> A : B = 5 : 4.\n" +
      "- 'A is 20% less than B' -> A : B = 4 : 5.\n" +
      "- 'A is x% more than B' means B is x/(100 + x) x 100 percent LESS than A. So if A is 25% more than B, B is 20% less than A — the two percentages are never equal, and papers exploit that constantly.\n\n" +
      "WORKED EXAMPLE\n" +
      "The price of an item rises 25%. By what percentage must consumption fall to keep expenditure unchanged?\n" +
      "Required fall = 25/(100 + 25) x 100 = 20%.\n\n" +
      "SECOND WORKED EXAMPLE\n" +
      "36% of 450 + 12^2 = ?\n" +
      "36% = 9/25, so 450 x 9/25 = 162. Then 162 + 144 = 306.",
    code: "Fraction table (memorise):\n  1/2=50%    1/3=33.33%   1/4=25%     1/5=20%\n  1/6=16.67% 1/7=14.28%   1/8=12.5%   1/9=11.11%\n  1/11=9.09% 1/12=8.33%   1/16=6.25%  1/20=5%\n\nSuccessive change:\n  net% = a + b + (a*b/100)     (decrease -> negative)\n  +20% then -20% = 20 - 20 - 4 = -4%   (net LOSS)\n\nMore/less conversions:\n  A is x% more than B -> B is [x/(100+x)]*100 % less than A\n  A is x% less than B -> B is [x/(100-x)]*100 % more than A\n  +25% price -> 20% consumption cut keeps spend flat\n\n36% of 450 = (9/25)*450 = 162",
    interviewQuestion:
      "If the price of sugar increases by 20%, by what percent must a family reduce consumption so the monthly sugar bill stays the same?",
  },
  {
    id: "ibpspo-pre-quant-ratio",
    category: "ibpspo-prelims",
    topic: "Quantitative Aptitude",
    title: "Ratio, Proportion & Partnership",
    difficulty: "Intermediate",
    summary:
      "Splitting quantities in given ratios and dividing profit by capital-time products.",
    explanation:
      "Ratios compare quantities of the same kind. The essential move is to introduce a common multiplier: if A : B = 3 : 5, write A = 3x and B = 5x, then translate every other condition into an equation in x.\n\n" +
      "CORE OPERATIONS\n" +
      "- Combining chains: if A : B = 2 : 3 and B : C = 4 : 5, scale B to a common value 12. A : B = 8 : 12 and B : C = 12 : 15, so A : B : C = 8 : 12 : 15.\n" +
      "- Dividing an amount: to split Rs 6000 in the ratio 2 : 3 : 5, the total is 10 parts, one part is 600, giving 1200, 1800 and 3000.\n\n" +
      "WORKED EXAMPLE\n" +
      "Two numbers are in the ratio 3 : 4. If 6 is added to each, the ratio becomes 4 : 5. Find the numbers.\n" +
      "Let them be 3x and 4x. Then (3x + 6)/(4x + 6) = 4/5, so 15x + 30 = 16x + 24, giving x = 6. The numbers are 18 and 24.\n\n" +
      "PARTNERSHIP\n" +
      "Profit is divided in the ratio of capital MULTIPLIED BY time invested, not capital alone.\n" +
      "- Simple partnership: everyone invests for the same period, so profit splits by capital.\n" +
      "- Compound partnership: periods differ, so use capital x months for each partner.\n" +
      "A sleeping partner receives a share by capital only; a working partner may additionally draw a salary or a percentage off the top, which is deducted BEFORE the remainder is divided.\n\n" +
      "PARTNERSHIP WORKED EXAMPLE\n" +
      "A invests Rs 12000 for 12 months, B invests Rs 18000 for 8 months. Divide a profit of Rs 5000.\n" +
      "A's weight = 12000 x 12 = 144000. B's weight = 18000 x 8 = 144000. The ratio is 1 : 1, so each receives Rs 2500 — a result that looks wrong until you notice the products match, which is precisely why examiners choose such numbers.",
    code: "Common multiplier:\n  A : B = 3 : 5  ->  A = 3x, B = 5x\n\nChaining:\n  A:B = 2:3, B:C = 4:5\n  scale B to 12 -> A:B = 8:12, B:C = 12:15\n  => A:B:C = 8:12:15\n\nWorked:\n  (3x+6)/(4x+6) = 4/5 -> 15x+30 = 16x+24 -> x = 6\n  numbers = 18 and 24\n\nPartnership:\n  share ratio = capital x time  (NOT capital alone)\n  A: 12000 x 12 = 144000\n  B: 18000 x  8 = 144000   -> 1 : 1\n  profit 5000 -> Rs 2500 each\n\nWorking partner's salary is deducted BEFORE division.",
    interviewQuestion:
      "A starts a business with Rs 25000. After 4 months B joins with Rs 30000. If the annual profit is Rs 19000, what is B's share?",
  },
  {
    id: "ibpspo-pre-quant-average",
    category: "ibpspo-prelims",
    topic: "Quantitative Aptitude",
    title: "Averages & Problems on Ages",
    difficulty: "Basic",
    summary:
      "Working with means, replacement effects and age relationships across time.",
    explanation:
      "Average = total sum / number of items. Almost every question is solved faster by working with the SUM than with the average itself.\n\n" +
      "THE REPLACEMENT SHORTCUT\n" +
      "When one member of a group is replaced and the average shifts, the change in the total equals (number of members) x (change in average). If the average weight of 8 people rises by 2.5 kg when a 60 kg person is replaced, the total rose by 8 x 2.5 = 20 kg, so the newcomer weighs 60 + 20 = 80 kg. No individual weights are ever needed.\n\n" +
      "AVERAGE OF CONSECUTIVE NUMBERS\n" +
      "For any evenly spaced set, the average is simply (first + last)/2. The average of the first n natural numbers is (n + 1)/2.\n\n" +
      "COMBINING GROUPS\n" +
      "Weighted average = (n1 x a1 + n2 x a2) / (n1 + n2). The result always lies between the two averages, closer to the larger group — a useful sanity check on your answer.\n\n" +
      "AGES — THE ONE RULE\n" +
      "Every person ages at the same rate, so a difference between two ages NEVER changes. Ratios change, differences do not. Use that as your anchor.\n" +
      "Set present ages using the ratio's multiplier, then add or subtract years for past and future conditions.\n\n" +
      "AGE WORKED EXAMPLE\n" +
      "The present ages of A and B are in the ratio 4 : 5. Five years ago the ratio was 3 : 4. Find their present ages.\n" +
      "Let the ages be 4x and 5x. Then (4x - 5)/(5x - 5) = 3/4, so 16x - 20 = 15x - 15, giving x = 5. Present ages are 20 and 25.\n" +
      "Check with the invariant: the difference is 5 now and was 5 five years ago (15 and 20). Consistent.\n\n" +
      "COMMON ERROR\n" +
      "Applying the 'years ago' adjustment to only one person. Both ages must move by the same amount, always.",
    code: "Average = sum / count      (work with the SUM)\n\nReplacement:\n  change in total = count x change in average\n  8 people, avg +2.5 kg, 60 kg leaves\n  -> total +20 -> newcomer = 80 kg\n\nEvenly spaced set:\n  average = (first + last) / 2\n  first n naturals -> (n+1)/2\n\nWeighted:\n  (n1*a1 + n2*a2) / (n1 + n2)\n\nAges — difference is INVARIANT:\n  4x, 5x now;  (4x-5)/(5x-5) = 3/4\n  16x - 20 = 15x - 15 -> x = 5 -> 20 and 25\n  check: 25-20 = 5 = 20-15  OK",
    interviewQuestion:
      "The average age of 30 students is 14 years. When the teacher's age is included, the average rises by 1 year. What is the teacher's age?",
  },
  {
    id: "ibpspo-pre-quant-profitloss",
    category: "ibpspo-prelims",
    topic: "Quantitative Aptitude",
    title: "Profit, Loss & Discount",
    difficulty: "Intermediate",
    summary:
      "Relating cost price, marked price, discount and selling price — the most frequent arithmetic topic.",
    explanation:
      "Fix the four quantities: Cost Price (CP), Marked Price (MP, the label price), Discount (a percentage off MP) and Selling Price (SP, what is actually paid).\n\n" +
      "CORE RELATIONS\n" +
      "- Profit% = (SP - CP)/CP x 100. The denominator is ALWAYS CP unless the question explicitly says otherwise.\n" +
      "- SP = CP x (100 + profit%)/100.\n" +
      "- SP = MP x (100 - discount%)/100.\n\n" +
      "THE STANDARD CHAIN\n" +
      "Most questions mark up from CP and then discount off MP. Take CP = 100, apply the markup, then the discount, and read the profit straight off.\n\n" +
      "WORKED EXAMPLE\n" +
      "A shopkeeper marks an article 40% above cost and allows a 10% discount. Find the profit percent.\n" +
      "Take CP = 100. Then MP = 140, and SP = 140 x 0.9 = 126. Profit = 26 on a cost of 100, so 26%.\n" +
      "Note it is NOT 40 - 10 = 30 — this is successive percentage change again: 40 - 10 - (40 x 10/100) = 26%.\n\n" +
      "DISHONEST DEALER\n" +
      "A trader selling at cost price but using a short weight still profits:\n" +
      "Gain% = (error / (true value - error)) x 100.\n" +
      "Using a 900 g weight for a kilogram gives 100/900 x 100 = 11.11% gain.\n\n" +
      "TWO ARTICLES AT THE SAME PRICE\n" +
      "If two items sell for the same price, one at x% profit and the other at x% loss, the overall result is ALWAYS a loss of (x/10)^2 percent. At 10% each way the net is a 1% loss. Never answer 'no profit no loss' here.\n\n" +
      "SUCCESSIVE DISCOUNTS\n" +
      "Two discounts of a% and b% are equivalent to a single discount of a + b - (a*b/100). Discounts of 20% and 10% equal a single 28%, not 30%.",
    code: "Definitions:\n  Profit% = (SP - CP)/CP * 100     (denominator = CP)\n  SP = CP * (100 + p)/100\n  SP = MP * (100 - d)/100\n\nMarkup then discount (take CP = 100):\n  CP 100 -> MP 140 -> SP = 140 * 0.9 = 126\n  profit = 26%      (NOT 40 - 10 = 30)\n\nSuccessive discounts:\n  single equivalent = a + b - (a*b/100)\n  20% and 10%  ->  28%\n\nFalse weight:\n  gain% = error/(true - error) * 100\n  900 g per kg -> 100/900 * 100 = 11.11%\n\nSame SP, +x% and -x%:\n  ALWAYS a loss of (x/10)^2 percent",
    interviewQuestion:
      "An article marked at Rs 800 is sold after two successive discounts of 25% and 10%. If the cost price was Rs 500, find the profit percent.",
  },
  {
    id: "ibpspo-pre-quant-interest",
    category: "ibpspo-prelims",
    topic: "Quantitative Aptitude",
    title: "Simple & Compound Interest",
    difficulty: "Intermediate",
    summary:
      "Bank-relevant interest computation and the shortcuts that avoid raising numbers to powers.",
    explanation:
      "The most banking-relevant arithmetic topic, and one interviewers also probe.\n\n" +
      "SIMPLE INTEREST\n" +
      "SI = P x R x T / 100, where the interest is the same every year. Amount = P + SI.\n\n" +
      "COMPOUND INTEREST\n" +
      "Amount = P x (1 + R/100)^T, and CI = Amount - P. Interest earns interest, so CI always exceeds SI beyond the first year.\n" +
      "For half-yearly compounding, halve the rate and double the time. For quarterly, quarter the rate and quadruple the time.\n\n" +
      "THE SHORTCUTS THAT SAVE THE MOST TIME\n" +
      "1. Difference for 2 years: CI - SI = P x (R/100)^2. This one line replaces the entire power computation and appears almost every year.\n" +
      "2. Difference for 3 years: CI - SI = P x R^2 x (300 + R) / 10^6.\n" +
      "3. For 2 years, CI = SI + (interest on the first year's interest).\n\n" +
      "WORKED EXAMPLE\n" +
      "The difference between CI and SI on a sum for 2 years at 10% per annum is Rs 50. Find the sum.\n" +
      "Using P x (R/100)^2 = 50: P x (0.1)^2 = 50, so P x 0.01 = 50 and P = Rs 5000.\n\n" +
      "SECOND WORKED EXAMPLE\n" +
      "Find CI on Rs 8000 at 10% for 2 years.\n" +
      "Amount = 8000 x 1.1 x 1.1 = 9680, so CI = Rs 1680. Cross-check: SI would be 1600, and the difference 80 equals 8000 x 0.01 as the shortcut predicts.\n\n" +
      "DOUBLING\n" +
      "Under SI, a sum doubles when R x T = 100. Under CI, use the rule of 72: the doubling time is approximately 72/R years.\n\n" +
      "INSTALMENTS\n" +
      "When a debt is cleared in equal annual instalments, each instalment's PRESENT value is instalment / (1 + R/100)^n for the n-th year. Sum these present values and set equal to the borrowed principal.",
    code: "SI = P*R*T/100\nCI: Amount = P*(1 + R/100)^T ,  CI = Amount - P\n\nCompounding frequency:\n  half-yearly -> R/2, T*2\n  quarterly   -> R/4, T*4\n\nShortcuts:\n  2 years: CI - SI = P*(R/100)^2\n  3 years: CI - SI = P*R^2*(300 + R)/10^6\n\nWorked:\n  diff = 50, R = 10%, 2 yrs\n  P*(0.1)^2 = 50 -> P*0.01 = 50 -> P = 5000\n\n  P=8000, R=10%, T=2\n  A = 8000*1.1*1.1 = 9680 -> CI = 1680\n  SI = 1600, diff 80 = 8000*0.01  OK\n\nDoubling: SI when R*T = 100 | CI approx 72/R years",
    interviewQuestion:
      "A sum amounts to Rs 6050 in 2 years and Rs 6655 in 3 years under compound interest. Find the rate and the principal.",
  },
  {
    id: "ibpspo-pre-quant-tsd",
    category: "ibpspo-prelims",
    topic: "Quantitative Aptitude",
    title: "Time, Speed, Distance & Trains",
    difficulty: "Intermediate",
    summary:
      "Motion problems including relative speed, train crossings and average speed.",
    explanation:
      "Distance = Speed x Time. Convert units before anything else: multiply km/h by 5/18 to get m/s, and m/s by 18/5 to get km/h.\n\n" +
      "INVERSE PROPORTION\n" +
      "Over a fixed distance, speed and time are inversely proportional. If the speed ratio is 3 : 4, the time ratio is 4 : 3. This converts most word problems into one line.\n\n" +
      "AVERAGE SPEED\n" +
      "For equal DISTANCES at speeds a and b, the average is the harmonic mean 2ab/(a + b) — never (a + b)/2. Travelling at 40 and 60 km/h over equal distances averages 48 km/h, not 50. For equal TIMES, the plain arithmetic mean is correct.\n\n" +
      "RELATIVE SPEED\n" +
      "- Opposite directions: add the speeds.\n" +
      "- Same direction: subtract them.\n\n" +
      "TRAINS — WHAT DISTANCE TO USE\n" +
      "- Crossing a pole or a person: distance = the train's own length.\n" +
      "- Crossing a platform or bridge: distance = train length + platform length.\n" +
      "- Two trains crossing each other: distance = the sum of both lengths, at the relative speed.\n\n" +
      "WORKED EXAMPLE\n" +
      "A 240 m train travelling at 72 km/h crosses a 360 m platform. How long does it take?\n" +
      "Speed = 72 x 5/18 = 20 m/s. Distance = 240 + 360 = 600 m. Time = 600/20 = 30 seconds.\n\n" +
      "SECOND WORKED EXAMPLE\n" +
      "A man covers a distance at 10 km/h and returns at 15 km/h. Find his average speed.\n" +
      "Equal distances, so average = 2 x 10 x 15/(10 + 15) = 300/25 = 12 km/h.\n\n" +
      "LATE-EARLY PROBLEMS\n" +
      "'Walking at 5 km/h he is 10 minutes late, at 6 km/h he is 5 minutes early.' Convert both delays to hours, set the distance equal for both journeys, and solve — the time DIFFERENCE between the two cases is the sum of the late and early margins, 15 minutes here.",
    code: "Conversions:  km/h -> m/s  x 5/18   |   m/s -> km/h  x 18/5\n\nFixed distance: speed ratio a:b  ->  time ratio b:a\n\nAverage speed:\n  equal distances -> 2ab/(a+b)   (harmonic)\n  equal times     -> (a+b)/2     (arithmetic)\n  10 and 15 km/h  -> 300/25 = 12 km/h\n\nRelative speed:\n  opposite -> a + b     |    same direction -> a - b\n\nTrains, distance to use:\n  pole/person       -> train length\n  platform/bridge   -> train + platform\n  two trains        -> sum of lengths\n\nWorked: 240 m train, 72 km/h, 360 m platform\n  20 m/s ; 600 m ; 600/20 = 30 s",
    interviewQuestion:
      "Two trains of lengths 150 m and 200 m run in opposite directions at 54 km/h and 36 km/h. How long do they take to cross each other completely?",
  },
  {
    id: "ibpspo-pre-quant-boatspipes",
    category: "ibpspo-prelims",
    topic: "Quantitative Aptitude",
    title: "Boats & Streams, Pipes & Cisterns",
    difficulty: "Intermediate",
    summary:
      "Two topics built on the same add-and-subtract-the-rates idea as time and work.",
    explanation:
      "BOATS AND STREAMS\n" +
      "Let b be the boat's speed in still water and s the stream's speed.\n" +
      "- Downstream speed = b + s (the current helps).\n" +
      "- Upstream speed = b - s (the current opposes).\n" +
      "Invert these to recover the two unknowns:\n" +
      "- b = (downstream + upstream)/2\n" +
      "- s = (downstream - upstream)/2\n\n" +
      "WORKED EXAMPLE\n" +
      "A boat covers 36 km downstream in 3 hours and the same 36 km upstream in 4 hours. Find the speed in still water and the stream speed.\n" +
      "Downstream = 36/3 = 12 km/h. Upstream = 36/4 = 9 km/h.\n" +
      "b = (12 + 9)/2 = 10.5 km/h, and s = (12 - 9)/2 = 1.5 km/h.\n\n" +
      "PIPES AND CISTERNS\n" +
      "Identical to time and work, except outlet pipes have NEGATIVE rates.\n" +
      "- A pipe filling a tank in x hours contributes 1/x per hour.\n" +
      "- An emptying pipe contributes -1/y per hour.\n" +
      "- Working together: add all the rates, then invert the total to get the time.\n\n" +
      "PIPES WORKED EXAMPLE\n" +
      "Pipe A fills a tank in 12 hours, pipe B in 15 hours, and outlet C empties it in 10 hours. All three are opened together.\n" +
      "Combined rate = 1/12 + 1/15 - 1/10. Using an LCM of 60: 5/60 + 4/60 - 6/60 = 3/60 = 1/20.\n" +
      "The tank fills in 20 hours.\n\n" +
      "THE LCM TECHNIQUE\n" +
      "Instead of fractions, set total capacity = LCM of the given times. Here LCM(12, 15, 10) = 60 units, so A does 5 units/hour, B does 4, and C removes 6, netting 3 units/hour and giving 60/3 = 20 hours. This avoids fraction arithmetic entirely and is far faster under exam pressure.\n\n" +
      "TRAP\n" +
      "If the outlet is stronger than the inlets, the net rate is negative and the tank never fills — the correct answer is that it empties, not a negative time.",
    code: "Boats:\n  downstream = b + s      upstream = b - s\n  b = (down + up)/2       s = (down - up)/2\n\n  36 km in 3 h down -> 12 km/h\n  36 km in 4 h up   ->  9 km/h\n  b = 10.5 km/h ,  s = 1.5 km/h\n\nPipes (LCM method):\n  A = 12 h, B = 15 h, C empties in 10 h\n  capacity = LCM(12,15,10) = 60 units\n  A = +5/h , B = +4/h , C = -6/h\n  net = +3 units/h  ->  60/3 = 20 hours\n\nOutlet pipes carry a NEGATIVE rate.\nNet negative -> the tank empties, not 'negative time'.",
    interviewQuestion:
      "A boat takes 6 hours to travel 48 km downstream and 8 hours to return. Find the speed of the boat in still water and of the current.",
  },
  {
    id: "ibpspo-pre-quant-mixture",
    category: "ibpspo-prelims",
    topic: "Quantitative Aptitude",
    title: "Mixture & Alligation",
    difficulty: "Advanced",
    summary:
      "The alligation rule for blending two quantities at different rates, and repeated-replacement problems.",
    explanation:
      "Alligation finds the ratio in which two ingredients at different prices or concentrations must be mixed to reach a target mean.\n\n" +
      "THE RULE\n" +
      "(quantity of cheaper) : (quantity of dearer) = (dearer - mean) : (mean - cheaper)\n" +
      "Each difference is taken diagonally across the mean, and both must come out positive — if one is negative, your mean does not lie between the two rates and the question has been misread.\n\n" +
      "WORKED EXAMPLE\n" +
      "In what ratio must rice at Rs 30/kg be mixed with rice at Rs 45/kg to obtain a mixture worth Rs 35/kg?\n" +
      "Cheaper : Dearer = (45 - 35) : (35 - 30) = 10 : 5 = 2 : 1.\n\n" +
      "REPEATED REPLACEMENT\n" +
      "When x units are drawn from a container of capacity V and replaced with water, repeated n times, the pure liquid remaining is:\n" +
      "V x (1 - x/V)^n\n\n" +
      "REPLACEMENT WORKED EXAMPLE\n" +
      "A 40-litre vessel of pure milk has 8 litres removed and replaced with water, twice.\n" +
      "Milk left = 40 x (1 - 8/40)^2 = 40 x (0.8)^2 = 40 x 0.64 = 25.6 litres, so 14.4 litres is water.\n\n" +
      "ALLIGATION BEYOND PRICES\n" +
      "The same rule works for any weighted average: mixing two salary groups to a mean salary, two speed segments to an average speed, two interest rates to a blended yield. Whenever a question gives you two rates and a resulting average and asks for a ratio, reach for alligation rather than setting up equations.\n\n" +
      "SANITY CHECK\n" +
      "The mean must always lie strictly between the two rates, and the larger share belongs to the ingredient whose rate is CLOSER to the mean. In the worked example the mean 35 is nearer to 30, and indeed the cheaper rice takes the larger share, 2 parts to 1.",
    code: "Alligation:\n         cheaper(c)          dearer(d)\n                  \\        /\n                   mean(m)\n                  /        \\\n            (d - m)        (m - c)\n\n  cheaper : dearer = (d - m) : (m - c)\n\nWorked: c=30, d=45, m=35\n  (45-35) : (35-30) = 10 : 5 = 2 : 1\n\nRepeated replacement:\n  pure left = V * (1 - x/V)^n\n  V=40, x=8, n=2 -> 40*(0.8)^2 = 25.6 L milk\n                    water = 14.4 L\n\nCheck: mean lies between c and d, and the\ningredient nearer the mean takes the bigger share.",
    interviewQuestion:
      "In what ratio must water be mixed with milk costing Rs 60 per litre so that by selling the mixture at Rs 60 per litre the dealer gains 25%?",
  },
  {
    id: "ibpspo-pre-quant-mensuration",
    category: "ibpspo-prelims",
    topic: "Quantitative Aptitude",
    title: "Mensuration: Areas, Volumes & Surface Areas",
    difficulty: "Intermediate",
    summary:
      "Formula-driven marks on 2D areas and 3D solids — the fastest questions in the section if the formulas are automatic.",
    explanation:
      "Pure recall. There is nothing to derive under exam conditions, so the entire topic reduces to whether the formulas are instant.\n\n" +
      "2D AREAS AND PERIMETERS\n" +
      "- Rectangle: area l x b, perimeter 2(l + b), diagonal sqrt(l^2 + b^2).\n" +
      "- Square: area a^2, perimeter 4a, diagonal a x sqrt(2).\n" +
      "- Triangle: area 1/2 x base x height. For an equilateral triangle, area = (sqrt(3)/4) x a^2.\n" +
      "- Circle: area pi x r^2, circumference 2 x pi x r.\n" +
      "- Parallelogram: base x height. Rhombus: 1/2 x d1 x d2. Trapezium: 1/2 x (sum of parallel sides) x height.\n\n" +
      "3D SOLIDS\n" +
      "- Cuboid: volume lbh, total surface area 2(lb + bh + hl), diagonal sqrt(l^2 + b^2 + h^2).\n" +
      "- Cube: volume a^3, TSA 6a^2, diagonal a x sqrt(3).\n" +
      "- Cylinder: volume pi r^2 h, curved surface 2 pi r h, total surface 2 pi r (r + h).\n" +
      "- Cone: volume 1/3 pi r^2 h, curved surface pi r l where the slant l = sqrt(r^2 + h^2).\n" +
      "- Sphere: volume 4/3 pi r^3, surface 4 pi r^2. Hemisphere: volume 2/3 pi r^3, total surface 3 pi r^2.\n\n" +
      "WORKED EXAMPLE\n" +
      "A cylindrical tank of radius 7 m and height 10 m is filled with water. Find its volume.\n" +
      "Volume = pi r^2 h = (22/7) x 49 x 10 = 1540 cubic metres. Choosing r as a multiple of 7 lets 22/7 cancel exactly, which is why examiners nearly always do so — if your radius is a multiple of 7, use 22/7 rather than 3.14.\n\n" +
      "SCALING RULE\n" +
      "If every linear dimension is multiplied by k, areas scale by k^2 and volumes by k^3. Doubling a sphere's radius multiplies its volume by 8, not by 2. Questions asking for the percentage change in volume after a percentage change in radius are testing exactly this.",
    code: "2D:\n  rectangle  A = l*b        P = 2(l+b)   d = sqrt(l^2+b^2)\n  square     A = a^2        d = a*sqrt(2)\n  triangle   A = (1/2)*b*h\n  equilateral A = (sqrt3/4)*a^2\n  circle     A = pi*r^2     C = 2*pi*r\n  rhombus    A = (1/2)*d1*d2\n  trapezium  A = (1/2)*(a+b)*h\n\n3D:\n  cuboid    V = lbh        TSA = 2(lb+bh+hl)\n  cube      V = a^3        TSA = 6a^2\n  cylinder  V = pi r^2 h   CSA = 2 pi r h\n  cone      V = (1/3)pi r^2 h   CSA = pi r l, l = sqrt(r^2+h^2)\n  sphere    V = (4/3)pi r^3     SA = 4 pi r^2\n\nScaling: linear xk -> area xk^2 -> volume xk^3\nUse 22/7 whenever r is a multiple of 7.",
    interviewQuestion:
      "The radius of a sphere is increased by 50%. By what percentage does its volume increase?",
  },
  {
    id: "ibpspo-pre-quant-probability",
    category: "ibpspo-prelims",
    topic: "Quantitative Aptitude",
    title: "Permutation, Combination & Probability",
    difficulty: "Advanced",
    summary:
      "Counting arrangements versus selections, and converting counts into probabilities.",
    explanation:
      "ONE QUESTION DECIDES EVERYTHING\n" +
      "Does order matter? If yes, it is a permutation. If no, it is a combination.\n" +
      "- Permutation: nPr = n!/(n - r)!  — arranging, ranking, seating, forming numbers or words.\n" +
      "- Combination: nCr = n!/(r! x (n - r)!)  — selecting, choosing a committee, drawing balls.\n\n" +
      "USEFUL IDENTITIES\n" +
      "nC0 = nCn = 1, nC1 = n, and nCr = nC(n - r). That last one saves real time: 10C7 is just 10C3 = 120.\n\n" +
      "PROBABILITY\n" +
      "P(E) = favourable outcomes / total outcomes, always between 0 and 1.\n" +
      "- P(not E) = 1 - P(E). Use this whenever the question says 'at least one' — computing the complement is nearly always shorter.\n" +
      "- Mutually exclusive events: P(A or B) = P(A) + P(B).\n" +
      "- Independent events: P(A and B) = P(A) x P(B).\n" +
      "- General addition rule: P(A or B) = P(A) + P(B) - P(A and B).\n\n" +
      "WORKED EXAMPLE\n" +
      "A bag holds 5 red and 4 blue balls. Two are drawn at random. Find the probability that both are red.\n" +
      "Total ways = 9C2 = 36. Favourable = 5C2 = 10. Probability = 10/36 = 5/18.\n\n" +
      "SECOND WORKED EXAMPLE\n" +
      "From the same bag, find the probability of at least one blue.\n" +
      "Complement of 'at least one blue' is 'both red', which is 5/18. So the answer is 1 - 5/18 = 13/18. Counting the cases directly would take three separate computations.\n\n" +
      "STANDARD TOTALS TO KNOW\n" +
      "A single die has 6 outcomes and two dice have 36. A pack of cards holds 52: 26 red and 26 black, four suits of 13 each, 12 face cards and 4 aces. These come up nearly every year, so do not recompute them.",
    code: "Order matters?  yes -> nPr = n!/(n-r)!\n                no  -> nCr = n!/(r!(n-r)!)\n\nIdentities:\n  nC0 = nCn = 1 ,  nC1 = n ,  nCr = nC(n-r)\n  10C7 = 10C3 = 120\n\nProbability:\n  P(E) = favourable / total\n  P(not E) = 1 - P(E)          <- use for 'at least one'\n  exclusive : P(A or B) = P(A) + P(B)\n  independent: P(A and B) = P(A) * P(B)\n\nWorked: 5 red, 4 blue, draw 2\n  total = 9C2 = 36 ,  both red = 5C2 = 10  -> 5/18\n  at least one blue = 1 - 5/18 = 13/18\n\nKnow: 2 dice = 36 outcomes | deck = 52 cards,\n4 aces, 12 face cards, 13 per suit",
    interviewQuestion:
      "A box contains 6 white and 4 black balls. Three are drawn at random. What is the probability that exactly two are white?",
  },
  {
    id: "ibpspo-pre-quant-di",
    category: "ibpspo-prelims",
    topic: "Quantitative Aptitude",
    title: "Data Interpretation: Table, Bar, Line, Pie & Caselet",
    difficulty: "Advanced",
    summary:
      "The largest single block of quant marks — reading charts accurately and computing under time pressure.",
    explanation:
      "Two or three DI sets carry 10-15 of the 35 quant marks. Accuracy in reading the chart matters more than calculation speed.\n\n" +
      "THE FORMATS\n" +
      "- Table: exact values, the most reliable and the fastest to attempt.\n" +
      "- Bar and line graphs: read against the axis scale — check whether the axis starts at zero and whether values are in thousands or lakhs.\n" +
      "- Pie chart: shares of a whole, given either in percentages or in degrees. Convert with 360 degrees = 100%, so 1% = 3.6 degrees.\n" +
      "- Caselet: data buried in a paragraph. Extract it into your own table FIRST; never attempt a caselet by re-reading the paragraph per question.\n" +
      "- Missing DI: some cells are blank and must be derived from footnotes before any question can be answered.\n\n" +
      "METHOD\n" +
      "1. Spend 20-30 seconds reading headers, units and footnotes before touching a question. Most DI errors are unit errors, not arithmetic errors.\n" +
      "2. Scan all five questions and do the easy ones first — sums and single-value lookups before ratios and percentage changes.\n" +
      "3. Use approximation when the options are far apart, and exact values only when they are close.\n\n" +
      "WORKED EXAMPLE\n" +
      "A table gives employees by department: HR 45 male / 30 female, IT 80/40, Sales 60/50.\n" +
      "- Total employees = 45 + 30 + 80 + 40 + 60 + 50 = 305.\n" +
      "- Females in IT and Sales together = 40 + 50 = 90, which as a share of 305 is 90/305 = 29.5%.\n" +
      "- Ratio of HR males to Sales females = 45 : 50 = 9 : 10.\n\n" +
      "PERCENTAGE CHANGE\n" +
      "Change% = (new - old)/old x 100. The denominator is always the OLD value. A rise from 40 to 50 is a 25% increase, while a fall from 50 to 40 is a 20% decrease — the same gap, different percentages, and DI sets test that asymmetry deliberately.\n\n" +
      "TIME DISCIPLINE\n" +
      "Budget about 4 minutes per five-question set. If the third question in a set is dragging, leave it and take the remaining two — questions within a set are independent.",
    code: "Formats: table | bar | line | pie | caselet | missing\n\nPie: 360 deg = 100%  ->  1% = 3.6 deg\n\nPercentage change = (new - old)/old * 100   (old = denominator)\n  40 -> 50 is +25%      50 -> 40 is -20%   (asymmetric)\n\nWorked table:\n  Dept    M    F\n  HR     45   30\n  IT     80   40\n  Sales  60   50\n  total = 305\n  F(IT+Sales) = 90 -> 90/305 = 29.5%\n  HR male : Sales female = 45:50 = 9:10\n\nOrder of attack: lookups -> sums -> ratios -> % change\nBudget ~4 min per 5-question set.",
    interviewQuestion:
      "A pie chart shows a company's expenses, with salaries occupying 108 degrees. If total expenditure is Rs 45 lakh, what is spent on salaries?",
  },

  // ── ENGLISH LANGUAGE (continued) ──────────────────────────────────────────────
  {
    id: "ibpspo-pre-eng-rc",
    category: "ibpspo-prelims",
    topic: "English Language",
    title: "Reading Comprehension Strategy",
    difficulty: "Advanced",
    summary:
      "The largest English block — reading for structure and answering only from the passage.",
    explanation:
      "Roughly 8-10 of the 30 English marks come from one or two passages, usually on economy, banking, environment or social policy.\n\n" +
      "THE ORDER THAT WORKS\n" +
      "1. Skim the questions first, but only to note their TYPE — do not memorise them.\n" +
      "2. Read the passage once at normal speed, marking the main idea of each paragraph in two or three words in the margin.\n" +
      "3. Answer factual and vocabulary questions first, then inference, then tone and title last.\n\n" +
      "QUESTION TYPES AND WHAT THEY DEMAND\n" +
      "- Factual/detail: the answer is stated in the passage. Locate the line and match it. Never rely on memory of what you read.\n" +
      "- Inference: not stated, but must follow necessarily from what is stated. If it needs any outside knowledge, it is wrong.\n" +
      "- Vocabulary in context: substitute each option into the sentence and read it back. The dictionary meaning matters less than the fit.\n" +
      "- Tone: critical, optimistic, analytical, neutral, sarcastic. Judge from adjectives and adverbs, not the subject matter.\n" +
      "- Central idea/title: must cover the WHOLE passage, not one striking paragraph.\n\n" +
      "THE GOLDEN RULE\n" +
      "Answer only from the passage. Your own knowledge of banking or economics is a liability here — the commonest wrong answer is factually true in the real world but never stated in the text.\n\n" +
      "ELIMINATION SIGNALS\n" +
      "Options containing absolute words such as 'always', 'never', 'all', 'only' and 'must' are usually wrong, because passages hedge. Options that are true but too NARROW are the classic trap on central-idea questions.\n\n" +
      "TIME\n" +
      "Budget 6-7 minutes for a full passage set. If the topic is unfamiliar and dense, do the standalone grammar and vocabulary questions first and come back — never open the section with a hard passage.",
    code: "Attack order:\n  1. skim question TYPES (not content)\n  2. read once, tag each paragraph in 2-3 words\n  3. factual -> vocabulary -> inference -> tone -> title\n\nAnswer ONLY from the passage.\nOutside knowledge = the most common trap.\n\nEliminate options that:\n  - use absolutes: always / never / all / only / must\n  - are true but cover just ONE paragraph (title questions)\n  - are real-world true but never stated\n\nBudget: 6-7 min per passage set.",
    interviewQuestion:
      "A passage argues renewable adoption 'could plateau' unless storage costs fall. What is the closest meaning of 'plateau' here — accelerate, level off, or decline sharply?",
  },
  {
    id: "ibpspo-pre-eng-clozetest",
    category: "ibpspo-prelims",
    topic: "English Language",
    title: "Cloze Test & Fillers",
    difficulty: "Intermediate",
    summary:
      "Restoring blanked words in a passage or sentence using grammar, collocation and logical flow.",
    explanation:
      "A cloze test is a paragraph with blanks; fillers are standalone sentences with one or two gaps. Both are decided by the same three checks.\n\n" +
      "THE THREE CHECKS, IN ORDER\n" +
      "1. GRAMMAR — what part of speech does the slot need? A blank after 'the' needs a noun or adjective; one after 'has been' needs a participle. This alone kills two options most of the time.\n" +
      "2. COLLOCATION — which word habitually pairs with the neighbours? We 'take a decision', 'make an effort', 'pose a threat', 'meet a deadline', 'draw a conclusion'. Collocation is a memory item, so read editorials to build it.\n" +
      "3. LOGIC — does the sentence contrast, add or explain? The connector before the blank tells you the direction.\n\n" +
      "DIRECTION MARKERS\n" +
      "- Contrast: but, however, although, yet, nevertheless, despite, on the contrary.\n" +
      "- Continuation: and, moreover, furthermore, in addition, similarly.\n" +
      "- Cause and effect: because, since, therefore, consequently, as a result, hence.\n" +
      "A contrast marker means the blank must REVERSE the earlier idea; a continuation marker means it must extend it. Reading the marker is faster than weighing the options.\n\n" +
      "DOUBLE FILLERS\n" +
      "Both blanks must work. Test the blank you are more confident about first and eliminate whole options on that basis, rather than evaluating every pair.\n\n" +
      "WORKED EXAMPLE\n" +
      "'Despite the heavy rainfall, the farmers managed to ____ a good harvest this season.'\n" +
      "'Despite' signals contrast, so the outcome must be positive against the odds. 'Discard', 'waste', 'neglect' and 'abandon' are all negative. 'Reap' both collocates with 'harvest' and carries the positive sense — the answer.\n\n" +
      "METHOD\n" +
      "In a full cloze passage, read the whole paragraph before filling anything. The first blank is often only decidable from a sentence that comes later.",
    code: "Three checks, in order:\n  1. grammar     -> what part of speech fits?\n  2. collocation -> which word pairs naturally?\n  3. logic       -> contrast, addition or cause?\n\nDirection markers:\n  contrast : but, however, although, yet, despite\n  add      : moreover, furthermore, similarly, and\n  cause    : because, since, therefore, hence\n\nCollocations worth memorising:\n  take a decision | make an effort | pose a threat\n  meet a deadline | draw a conclusion | reap a harvest\n\nWorked:\n  'Despite heavy rainfall, farmers managed to ___ a good harvest.'\n  despite -> contrast -> positive outcome needed\n  reap (collocates + positive)  ->  ANSWER\n\nRead the WHOLE paragraph before filling any blank.",
    interviewQuestion:
      "Fill both blanks: 'The committee decided to ____ the meeting ____ further notice due to unforeseen circumstances.'",
  },
  {
    id: "ibpspo-pre-eng-parajumbles",
    category: "ibpspo-prelims",
    topic: "English Language",
    title: "Para Jumbles & Sentence Rearrangement",
    difficulty: "Intermediate",
    summary:
      "Restoring the logical order of shuffled sentences by finding the opener and linking pairs.",
    explanation:
      "Four to six shuffled sentences must be reordered. The reliable route is to find the opening sentence and then chain forced pairs.\n\n" +
      "IDENTIFYING THE OPENER\n" +
      "The first sentence introduces the subject with a full noun phrase and depends on nothing before it. It will NOT contain: pronouns without an antecedent (it, they, this, these, such), connectors (however, therefore, moreover, also), or comparatives referring back (the former, the latter, another).\n" +
      "Sentences that begin with a time frame — 'Over the last decade...', 'In 1991...' — are very often the opener.\n\n" +
      "FINDING MANDATORY PAIRS\n" +
      "This is where the marks are. Look for:\n" +
      "- A noun introduced in one sentence and replaced by a pronoun in another. The full noun must come first.\n" +
      "- Cause followed by effect.\n" +
      "- A general claim followed by its example or elaboration.\n" +
      "- Chronological order of events.\n" +
      "Once a pair is certain, eliminate every option that separates them. Two confirmed pairs usually settle the whole question without reading further.\n\n" +
      "WORKED EXAMPLE\n" +
      "(A) This shift has forced traditional retailers to rethink their business strategies.\n" +
      "(B) Over the last decade, e-commerce has fundamentally changed how consumers shop.\n" +
      "(C) Many are now investing heavily in online platforms to stay competitive.\n" +
      "(D) Convenience, variety, and competitive pricing have driven this transformation.\n" +
      "(B) opens: it has a time frame and introduces the subject with no back-reference. (D) explains what drove it, referring to 'this transformation'. (A) states the consequence, 'this shift'. (C) elaborates on 'Many' — meaning those retailers, so it must follow (A).\n" +
      "Order: B, D, A, C. The third sentence is (A).\n\n" +
      "VERIFY BEFORE MARKING\n" +
      "Read your final order straight through once. If a pronoun appears before the noun it refers to, the order is wrong regardless of how good the individual links looked.",
    code: "Opener test — the first sentence has NO:\n  dangling pronoun (it, they, this, such)\n  connector (however, therefore, moreover)\n  back-reference (the former, another)\nOften carries a time frame: 'Over the last decade...'\n\nMandatory pair signals:\n  full noun  ->  pronoun         (noun first)\n  cause      ->  effect\n  claim      ->  example\n  earlier    ->  later event\n\nWorked: A/B/C/D above\n  B (opens, time frame + subject)\n  D ('this transformation' -> refers to B)\n  A ('this shift' -> consequence)\n  C ('Many' -> the retailers in A)\n  => B D A C ; third sentence = A\n\nFinal check: no pronoun before its noun.",
    interviewQuestion:
      "Rearrange: (A) It also reduced processing time significantly. (B) The bank introduced a new digital onboarding system. (C) Customers reported far higher satisfaction as a result. Which sentence comes first?",
  },
  {
    id: "ibpspo-pre-eng-errorspotting",
    category: "ibpspo-prelims",
    topic: "English Language",
    title: "Error Spotting: The High-Frequency Rules",
    difficulty: "Advanced",
    summary:
      "The specific grammar rules banks test repeatedly, and how to scan for them.",
    explanation:
      "Errors are not random — a small set of rules is recycled every year. Scan for these in order rather than reading for what 'sounds wrong'.\n\n" +
      "1. SUBJECT-VERB AGREEMENT\n" +
      "- 'Neither of', 'each of', 'every one of', 'one of' take a SINGULAR verb. 'Neither of the candidates WAS prepared', not 'were prepared'.\n" +
      "- Words between the subject and verb do not change the number: 'The list of items IS on the desk.'\n" +
      "- Collective nouns are singular when acting as one unit: 'The committee HAS decided.'\n" +
      "- 'A number of' takes a plural verb; 'the number of' takes a singular one.\n\n" +
      "2. PREPOSITION PAIRINGS\n" +
      "Fixed and untranslatable: discuss (no 'about'), comprise (no 'of'), married TO, superior TO, capable OF, deprived OF, familiar WITH, comply WITH, insist ON, prefer X TO Y.\n\n" +
      "3. ARTICLES\n" +
      "'A' or 'an' is decided by SOUND, not spelling: an hour, an MBA, a university, a one-rupee coin.\n\n" +
      "4. TENSE CONSISTENCY\n" +
      "'Since' and 'for' with a period take the present perfect continuous: 'He HAS BEEN working here since 2019.' After 'if' in a second conditional, use 'were' for all persons.\n\n" +
      "5. PARALLELISM\n" +
      "Items in a list must share a form: 'She enjoys hiking, swimming and exploring', not '...and to explore'.\n\n" +
      "6. REDUNDANCY\n" +
      "Banks test these hard: 'return back', 'repeat again', 'revert back', 'cope up with', 'discuss about', 'more better', 'reason is because'. All are wrong.\n\n" +
      "WORKED EXAMPLE\n" +
      "'Neither of the candidates (A)/ were prepared (B)/ to answer questions (C)/ about the budget. (D)'\n" +
      "'Neither of' is singular, so 'were' must be 'was'. The error is in part (B).\n\n" +
      "SCANNING METHOD\n" +
      "Find the main verb, then find its true subject, and check agreement first. That single check catches roughly a third of all planted errors.",
    code: "Singular subjects (take a singular verb):\n  neither of | each of | every one of | one of\n  collective nouns acting as a unit\n  'the number of'      ('a number of' -> plural)\n\nFixed prepositions:\n  discuss X (no about)   comprise X (no of)\n  married to | superior to | capable of\n  deprived of | comply with | insist on | prefer X to Y\n\nArticles follow SOUND:\n  an hour, an MBA, a university, a one-rupee coin\n\nRedundancy (all wrong):\n  return back | repeat again | revert back\n  cope up with | discuss about | more better\n\nWorked: 'Neither of the candidates WERE prepared'\n  neither of -> singular -> WAS   ->  error in (B)",
    interviewQuestion:
      "Spot the error: 'The ambassador (A)/ said the reports have (B)/ being examined carefully by his staff (C)/ before making comments (D).'",
  },
  {
    id: "ibpspo-pre-eng-sentenceimprovement",
    category: "ibpspo-prelims",
    topic: "English Language",
    title: "Sentence Improvement & Word Swap",
    difficulty: "Intermediate",
    summary:
      "Replacing an underlined segment, or swapping two misplaced words to restore sense.",
    explanation:
      "SENTENCE IMPROVEMENT\n" +
      "Part of a sentence is underlined and you choose the best replacement. 'No improvement' is a real option and is the correct answer more often than candidates expect — do not force a change.\n" +
      "Judge on: grammatical correctness first, then concision, then idiom. Between two grammatically correct options, the SHORTER one is almost always intended.\n\n" +
      "WORD SWAP — THE NEWER FORMAT\n" +
      "A sentence contains two words that have been interchanged, making it nonsensical. You must identify the pair.\n" +
      "Method: read the sentence and find the word that clearly does not belong in its slot. Then look for the other slot where THAT word would fit. The two positions identify the pair.\n" +
      "Example: 'The manager decided to postpone the resignation and submit the meeting.' You postpone a MEETING and submit a RESIGNATION, so those two nouns are swapped.\n\n" +
      "WORD USAGE\n" +
      "A word is given with several sentences, and you pick the ones where it is used correctly. Check the part of speech in each sentence — the same word often works as a noun in one and fails as a verb in another.\n\n" +
      "PHRASE REPLACEMENT PITFALLS\n" +
      "- Changing the tense unnecessarily. If the rest of the sentence is past tense, the replacement must stay past.\n" +
      "- Options that fix the flagged error but introduce a new one elsewhere in the segment. Read the full replacement inside the sentence, never in isolation.\n" +
      "- Options that alter the MEANING. The task is to correct the grammar, not to improve the argument.\n\n" +
      "WORKED EXAMPLE\n" +
      "'Her ____ approach to problem-solving impressed the entire team during the crisis.'\n" +
      "'Impressed' requires a positive quality. 'Careless', 'chaotic', 'reckless' and 'indifferent' are all negative, leaving 'methodical' — which also collocates naturally with 'approach'.",
    code: "Sentence improvement — judge in this order:\n  1. grammatical correctness\n  2. concision (shorter wins between two correct options)\n  3. idiom / collocation\n  'No improvement' is often the right answer.\n\nWord swap method:\n  1. find the word that cannot belong in its slot\n  2. find the slot where THAT word does belong\n  3. those two positions are the swapped pair\n\n  'postpone the resignation and submit the meeting'\n  -> postpone a MEETING, submit a RESIGNATION\n\nPitfalls:\n  - replacement changes the tense unnecessarily\n  - fixes one error, introduces another\n  - alters the MEANING rather than the grammar",
    interviewQuestion:
      "Identify the swapped pair: 'The bank sanctioned the customer after verifying the loan documents of the applicant.'",
  },
  {
    id: "ibpspo-pre-eng-vocabulary",
    category: "ibpspo-prelims",
    topic: "English Language",
    title: "Vocabulary: Synonyms, Antonyms & Idioms",
    difficulty: "Basic",
    summary:
      "Building the word stock that cloze, RC and word-usage questions all depend on.",
    explanation:
      "Vocabulary is not a separate topic so much as the input to every other English question. A weak word stock caps your score no matter how good your grammar is.\n\n" +
      "HOW TO BUILD IT EFFICIENTLY\n" +
      "Read one editorial daily from a national paper and note every unfamiliar word WITH the sentence it appeared in. Context-learned words survive; isolated word lists do not. Twenty minutes a day for a month is worth more than any 1000-word PDF.\n\n" +
      "ROOT WORDS THAT UNLOCK CLUSTERS\n" +
      "- 'bene' good: benefit, benevolent, benign, beneficiary.\n" +
      "- 'mal' bad: malpractice, malign, malfunction, malicious.\n" +
      "- 'cred' believe: credible, credentials, incredulous, accreditation.\n" +
      "- 'fid' faith: fidelity, confide, bona fide, infidel.\n" +
      "- 'ject' throw: reject, project, inject, conjecture.\n" +
      "Recognising a root lets you eliminate options for words you have never met.\n\n" +
      "BANKING-CONTEXT VOCABULARY WORTH KNOWING\n" +
      "Austerity, liquidity, moratorium, amortise, collateral, default, insolvency, remittance, volatility, mitigate, curb, surge, plummet, buoyant, stagnant, subdued.\n" +
      "These recur in RC passages on the economy every single year.\n\n" +
      "IDIOMS FREQUENTLY TESTED\n" +
      "- 'Turn a blind eye' — deliberately ignore.\n" +
      "- 'Call it a day' — stop working.\n" +
      "- 'In the red' — running a loss. 'In the black' — profitable.\n" +
      "- 'Cut corners' — do something cheaply and badly.\n" +
      "- 'Bite the bullet' — accept something unpleasant.\n" +
      "- 'A blessing in disguise' — a hidden benefit.\n\n" +
      "IN THE EXAM\n" +
      "For a synonym question about an unfamiliar word, use the sentence's tone: if the surrounding sentence is negative, the word is almost certainly negative, which usually eliminates three options immediately.",
    code: "Roots that unlock clusters:\n  bene (good)  : benefit, benevolent, benign\n  mal  (bad)   : malpractice, malign, malicious\n  cred (believe): credible, credentials, incredulous\n  fid  (faith) : fidelity, confide, bona fide\n  ject (throw) : reject, project, conjecture\n\nBanking/economy words seen every year:\n  austerity, liquidity, moratorium, collateral,\n  insolvency, remittance, volatility, mitigate,\n  curb, surge, plummet, buoyant, subdued\n\nIdioms:\n  turn a blind eye = ignore deliberately\n  in the red = at a loss | in the black = profitable\n  cut corners = do cheaply and badly\n  bite the bullet = accept something unpleasant\n\nUnknown word? Match the TONE of the sentence first.",
    interviewQuestion:
      "Give the closest synonym and one antonym for 'buoyant' as it would be used in a sentence about market sentiment.",
  },
  {
    id: "ibpspo-pre-eng-paracompletion",
    category: "ibpspo-prelims",
    topic: "English Language",
    title: "Para Completion & Sentence Inference",
    difficulty: "Advanced",
    summary:
      "Choosing the sentence that correctly ends a paragraph, or the inference that safely follows from it.",
    explanation:
      "PARA COMPLETION\n" +
      "A short paragraph is given with the final sentence missing. The correct ending must CONTINUE the paragraph's direction of thought and match its scope.\n\n" +
      "The three failure modes to eliminate:\n" +
      "1. Too broad — introduces a new topic the paragraph never raised.\n" +
      "2. Too narrow — restates one detail rather than closing the argument.\n" +
      "3. Contradictory — reverses the paragraph's stance, unless the final sentence explicitly begins with a contrast marker.\n" +
      "Watch the last stated sentence closely: if it raises a problem, the ending usually offers a consequence or resolution; if it makes a claim, the ending usually supplies support.\n\n" +
      "SENTENCE INFERENCE\n" +
      "A statement is given and you choose what can be INFERRED. The test is strict: the inference must be necessarily true given the statement, using no outside information.\n" +
      "- Rejected: anything requiring a further assumption, however reasonable.\n" +
      "- Rejected: a restatement of the given sentence in different words. That is a paraphrase, not an inference.\n" +
      "- Rejected: an extreme version of the statement. If the text says 'many', an option saying 'all' fails.\n\n" +
      "WORKED EXAMPLE\n" +
      "Statement: 'Despite a sharp rise in digital transactions, cash withdrawals from ATMs have not declined in rural districts.'\n" +
      "Valid inference: digital adoption and cash usage are currently coexisting in rural areas.\n" +
      "Invalid: 'rural customers distrust digital payments' — plausible, but it needs a cause the statement never gives.\n\n" +
      "THE HABIT THAT SCORES\n" +
      "For every option, ask 'could this be false while the passage stays true?' If yes, it is not an inference. This single question resolves nearly every one of these items, and it is faster than comparing options against each other.",
    code: "Para completion — reject endings that are:\n  too broad       (new topic)\n  too narrow      (restates one detail)\n  contradictory   (unless a contrast marker is present)\n\nRead the LAST given sentence:\n  raises a problem -> ending gives consequence/resolution\n  makes a claim    -> ending gives support\n\nInference test (strict):\n  must be NECESSARILY true from the text alone\n  reject: needs an extra assumption\n  reject: mere paraphrase of the statement\n  reject: stronger than the text (many -> all)\n\nThe deciding question for every option:\n  'Could this be FALSE while the passage stays TRUE?'\n  yes -> it is not an inference.",
    interviewQuestion:
      "Statement: 'Although the bank expanded to 200 new branches, its operating profit fell this year.' Which inference is safe — that expansion caused the fall, or that expansion did not prevent the fall?",
  },
  {
    id: "ibpspo-pre-eng-matchcolumn",
    category: "ibpspo-prelims",
    topic: "English Language",
    title: "Match the Column & Sentence Pairs",
    difficulty: "Intermediate",
    summary:
      "Joining sentence halves across two columns to form grammatically and logically sound sentences.",
    explanation:
      "Two columns of sentence fragments are given and you must join a fragment from column I to one from column II so the result is both grammatical and meaningful. Often more than one pairing is valid, and the question asks how many combinations work.\n\n" +
      "METHOD\n" +
      "1. Read every fragment in column I and note what each one REQUIRES to complete it — a verb, an object, a clause.\n" +
      "2. Check grammar first. Does the tense agree? Does a singular subject meet a singular verb? Does a preposition at the end of column I match the start of column II?\n" +
      "3. Only then check meaning. A grammatically valid join that says something absurd is still wrong.\n" +
      "4. Do not assume one-to-one matching. In this format a single column I fragment may legitimately pair with two different column II fragments, and the answer is the COUNT.\n\n" +
      "STRUCTURAL SIGNALS THAT DECIDE THE JOIN\n" +
      "- A fragment ending in 'that' needs a full clause after it, not a phrase.\n" +
      "- A fragment ending in a preposition ('depends on', 'resulted in') needs a noun or gerund next, never an infinitive.\n" +
      "- A fragment starting with 'which' or 'who' must attach to the noun immediately before it.\n" +
      "- A fragment beginning with a participle ('Having completed...') requires the subject of the following clause to be the one performing that action — otherwise it is a dangling modifier.\n\n" +
      "WORKED EXAMPLE\n" +
      "Column I: 'The rise in non-performing assets has resulted in'\n" +
      "Column II options: (a) 'tighter lending norms across the sector.' (b) 'banks to tighten their lending norms.'\n" +
      "'Resulted in' takes a noun or gerund, so (a) is correct. Option (b) needs 'led banks to tighten', a different verb pattern — a very commonly tested distinction.\n\n" +
      "EXAM NOTE\n" +
      "Verify each candidate join by reading the full sentence aloud in your head, start to finish. Judging from the junction alone is what produces wrong counts.",
    code: "Order of checks:  grammar  ->  meaning\n\nStructural requirements:\n  ends in 'that'          -> needs a full CLAUSE\n  ends in a preposition   -> needs a NOUN or GERUND\n    (resulted in / depends on / capable of)\n  starts 'which' / 'who'  -> attaches to the noun before it\n  starts with participle  -> the following subject must be\n                             the one doing that action\n\nWorked:\n  I : 'The rise in NPAs has resulted in'\n  a : 'tighter lending norms...'        NOUN     OK\n  b : 'banks to tighten their norms'    INFINITIVE  wrong\n      ('led banks to tighten' would be correct)\n\nPairings need NOT be one-to-one; the answer is a COUNT.\nAlways read the joined sentence end to end.",
    interviewQuestion:
      "Which column II fragments correctly complete 'The committee recommended that' — (a) 'the proposal be reviewed again.' or (b) 'reviewing the proposal again.'?",
  },
];
