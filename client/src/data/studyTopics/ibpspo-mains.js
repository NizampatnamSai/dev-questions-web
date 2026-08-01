export default [
  // ── REASONING & COMPUTER APTITUDE ──────────────────────────────────────────────
  {
    id: "ibpspo-main-reason-inputoutput",
    category: "ibpspo-mains",
    topic: "Reasoning & Computer Aptitude",
    title: "Input-Output Machine Arrangement",
    difficulty: "Advanced",
    summary: "Deciphering step-by-step alphanumeric rearrangement rules of a mathematical sorting machine.",
    explanation:
      "A word/number arrangement machine rearranges inputs according to a specific logic in each step until a final output is obtained. Let's analyze the rules:\n\n" +
      "Example Input: triangle 45 38 galaxy 93 puzzle 27 velocity rhythm 84\n" +
      "- Rule for Numbers: Alternately pick the highest/lowest numbers, decrease them by a rule (e.g., subtracting or adding values), and shift them to the front.\n" +
      "- Rule for Words: Words are rearranged alphabetically by their first letters or lengths, sorted at the right end with vowel swaps or adjustments.\n" +
      "For example, 'galaxy' becomes 'aaglxy' (vowels sorted first or alphabetical ordering of all letters).\n\n" +
      "By carefully tracking the changes in each step (Step I to V), you can find the position of any word or number in the final arrangement.",
    code: "Input: shadow 74 19 magnet 52 forest 68 bridge whistle 31\n\nStep I:  88 shadow 74... aaglxy\nStep II: 87 88 shadow... eulpzz\nStep III: 40 87 88... hhmrty\nStep IV: 41 40 87 88... aeiglnrt\nStep V:  22 41 40 87 88 shadow...",
    interviewQuestion: "Based on the machine input logic, which element is 5th to the right of the second least number in Step V?",
  },
  {
    id: "ibpspo-main-reason-circular",
    category: "ibpspo-mains",
    topic: "Reasoning & Computer Aptitude",
    title: "Circular Arrangement with Card Numbers",
    difficulty: "Tricky",
    summary: "Seating arrangement of 8 persons in a circle, combined with number puzzles.",
    explanation:
      "This question combines seating arrangement with logic numbers:\n\n" +
      "- Seating: 8 persons (A to H) face the center in a circle.\n" +
      "- Numbers: Each person holds a card with a unique number from 2 to 9.\n" +
      "- Constraint: The difference between card numbers of adjacent persons is more than 1 (no adjacent numbers are consecutive).\n\n" +
      "Key parsing steps:\n" +
      "1. 'C sits sixth to the right of the person whose card number is prime.'\n" +
      "2. 'Two persons sit between the person who sits second to the right of C, and G.'\n" +
      "3. Solve the adjacent difference conditions: If A has 6, neighbors cannot have 5 or 7.\n" +
      "By building a circular diagram and labeling the positions 1-8 along with card values, you reconcile all conditions.",
    code: "Circular Layout (Clockwise):\nPos 1: A (Card 9) | Pos 2: H (Card 5) | Pos 3: G (Card 3)\nPos 4: E (Card 7) | Pos 5: B (Card 6) | Pos 6: D (Card 2)\nPos 7: C (Card 4) | Pos 8: F (Card 8)\n\nCheck Constraint: Differences between neighbors are > 1:\n- A(9) and H(5): Diff 4\n- H(5) and G(3): Diff 2\n- G(3) and E(7): Diff 4",
    interviewQuestion: "What is the sum of the card numbers of C, G and H based on the circular arrangement?",
  },

  // ── DATA ANALYSIS & INTERPRETATION ──────────────────────────────────────────────
  {
    id: "ibpspo-main-di-table",
    category: "ibpspo-mains",
    topic: "Data Analysis & Interpretation",
    title: "Table DI: Missing Profit & Stock Ratios",
    difficulty: "Advanced",
    summary: "Interpreting complex tabular data with algebraic variables representing missing quantities.",
    explanation:
      "Tabular DI in Mains often uses algebraic variables (P, Z, X) instead of direct numbers. You must form equations using notes at the bottom:\n\n" +
      "Example Table:\n" +
      "- Company C: Manufactured = 900, Sold = 648, Unsold = 3X.\n" +
      "Since Unsold = Manufactured - Sold:\n" +
      "900 - 648 = 252 => 3X = 252 => X = 84.\n\n" +
      "- Note: 'Total cars unsold by D is 1/3 of total cars sold by D.'\n" +
      "If Sold by D = 2Z + 132, then Unsold = (2Z + 132) / 3 = P/3 + 150.\n\n" +
      "- Note: 'Total cars sold by all companies = 3552.'\n" +
      "Using this, sum the sold quantities of A, B, C, D to solve for Z and P. This resolves the entire dataset.",
    code: "Company C:\nUnsold = 900 - 648 = 252\n3X = 252 => X = 84\n\nTotal Sold = 3552\nSold(A) + Sold(B) + Sold(C) + Sold(D) = 3552\nZ + (8/7)*X + 648 + (2Z + 132) = 3552\nSubstitute X = 84:\nZ + 96 + 648 + 2Z + 132 = 3552\n3Z + 876 = 3552 => 3Z = 2676 => Z = 892.",
    interviewQuestion: "If the total number of cars sold by all companies is 3552, find the value of Z and X.",
  },

  // ── GENERAL/ECONOMY/BANKING AWARENESS ───────────────────────────────────────────
  {
    id: "ibpspo-main-bank-vision2025",
    category: "ibpspo-mains",
    topic: "General/Economy/Banking Awareness",
    title: "RBI Payments Vision 2025 Document",
    difficulty: "Basic",
    summary: "Core pillars and goals set by the RBI for guiding payment systems in India.",
    explanation:
      "The Reserve Bank of India (RBI) published its 'Payments Vision 2025' document outlining the roadmap for secure and efficient digital payments.\n\n" +
      "It is built on 5 key anchor points (referred to as the 5 'Is'):\n" +
      "1. Integrity: Enhancing security and reducing fraud in digital payments.\n" +
      "2. Innovation: Encouraging new fintech and payment modes.\n" +
      "3. Institutionalisation: Enhancing regulatory frameworks.\n" +
      "4. Infrastructure: Scaling processing capabilities and backup nodes.\n" +
      "5. Internationalisation: Taking Indian payment systems (like UPI) global.\n\n" +
      "This document also revised transaction limits, such as raising UPI 123Pay limits to Rs. 10,000 and UPI Lite wallet limits to Rs. 5,000.",
    code: "RBI Payments Vision 2025:\n5 Pillars: Integrity, Innovation, Institutionalisation, Infrastructure, Internationalisation\n\nUPI Limit Revisions:\n- UPI 123Pay: Raised to Rs. 10,000\n- UPI Lite: Wallet limit raised to Rs. 5,000",
    interviewQuestion: "Which of the following is NOT one of the 5 anchor points listed in the RBI Payments Vision 2025?",
  },
  {
    id: "ibpspo-main-bank-cooperative",
    category: "ibpspo-mains",
    topic: "General/Economy/Banking Awareness",
    title: "Regulatory Framework for Cooperative Banks",
    difficulty: "Intermediate",
    summary: "Capital adequacy norms and tiered regulation of Urban Cooperative Banks (UCBs) by the RBI.",
    explanation:
      "The RBI implements a four-tiered regulatory framework for Urban Cooperative Banks (UCBs) based on deposit sizes:\n\n" +
      "- Tier 1 UCBs: Deposits up to Rs. 100 crore. They must maintain a minimum Capital to Risk-Weighted Assets Ratio (CRAR) of 9%.\n" +
      "- Tier 2, 3, and 4 UCBs: Deposits above Rs. 100 crore. They must maintain a minimum CRAR of 12%.\n\n" +
      "This tiered structure ensures that larger UCBs hold more capital buffers to absorb losses, improving depositors' security while allowing smaller, community-focused banks to operate with lower capital overheads.",
    code: "UCB Regulation:\n- Tier 1: Deposits <= Rs. 100 cr | Minimum CRAR = 9%\n- Tier 2 to 4: Deposits > Rs. 100 cr | Minimum CRAR = 12%\n\nPriority Sector Lending (PSL) requirements:\n- SFBs (Small Finance Banks): 75% of ANBC.",
    interviewQuestion: "What is the minimum Capital Adequacy Ratio (CAR) requirement for Tier 1 and Tier 2-4 UCBs, respectively?",
  },

  // ── ENGLISH LANGUAGE & DESCRIPTIVE ──────────────────────────────────────────────
  {
    id: "ibpspo-main-desc-essay",
    category: "ibpspo-mains",
    topic: "English Language & Descriptive",
    title: "Essay Writing: Digital vs. Physical Banking",
    difficulty: "Basic",
    summary: "Model outline and key points for a descriptive essay on bank digitalization.",
    explanation:
      "Descriptive writing (25 marks) requires clear structure:\n\n" +
      "1. Introduction: Introduce the shift from traditional brick-and-mortar branches to digital apps. State the core thesis (digital banking offers convenience, but physical branches remain essential for trust and complex services).\n" +
      "2. Advantages of Digital Banking: 24/7 availability, transaction speed, financial inclusion (mobile wallets), and reduced overhead costs for banks.\n" +
      "3. The Role of Physical Branches: Human touch, resolving complex issues (loans, wealth management), catering to the elderly or digitally illiterate populations, and building customer relationship trust.\n" +
      "4. The Phygital Model: The modern solution combining both physical presences with digital execution.\n" +
      "5. Conclusion: Summarize arguments, concluding that a hybrid model is the way forward.",
    code: "Essay Outline (Word Count: 250 words):\n- Intro: Tech revolution in banking (30 words)\n- Body 1: Digital benefits (convenience, UPI, reach) (80 words)\n- Body 2: Physical importance (auditing, trust, complex resolutions) (80 words)\n- Conclusion: The hybrid 'Phygital' future (60 words)",
    interviewQuestion: "Draft a descriptive essay (250 words) on 'The Role of Technology in Financial Inclusion in Rural India'.",
  },
  {
    id: "ibpspo-main-desc-letter",
    category: "ibpspo-mains",
    topic: "English Language & Descriptive",
    title: "Letter Writing: Home Loan Rate Revision",
    difficulty: "Basic",
    summary: "Format and key templates for formal letters to bank branch managers.",
    explanation:
      "A formal letter must adhere to the standard format to score maximum marks:\n\n" +
      "- Sender's Address (top left)\n" +
      "- Date\n" +
      "- Receiver's Address (e.g., The Branch Manager, XYZ Bank)\n" +
      "- Subject (clear, single line: 'Request for Revision of Home Loan Interest Rate')\n" +
      "- Salutation (Dear Sir/Madam)\n" +
      "- Body (3 clear paragraphs):\n" +
      "  - Introduction: Reference your loan account number and current interest rate.\n" +
      "  - Context: State that RBI has reduced repo rates, or that you are eligible for lower pricing due to an improved CIBIL score.\n" +
      "  - Request: Ask to link your loan to the current benchmark rate (e.g., EBLR) and adjust your EMI or tenure.\n" +
      "- Complimentary Close (Yours faithfully, Name/Signature)",
    code: "To,\nThe Branch Manager,\nState Bank of India,\nDelhi Branch.\n\nSubject: Revision of Home Loan Interest Rate (A/C No. XXXXXX)\n\nDear Sir/Madam,\n\nI am writing to request a revision of the interest rate on my home loan account...\n\nThanking you,\nYours faithfully,\n[Name]",
    interviewQuestion: "Write a formal letter to the Branch Manager requesting the issuance of a duplicate bank passbook.",
  },

  // ── REASONING & COMPUTER APTITUDE (continued) ──────────────────────────────────
  {
    id: "ibpspo-main-reason-logical",
    category: "ibpspo-mains",
    topic: "Reasoning & Computer Aptitude",
    title: "Logical Reasoning: Assumption, Inference, Argument & Course of Action",
    difficulty: "Advanced",
    summary:
      "The verbal-reasoning block that separates mains from prelims — judging what a statement rests on and what follows from it.",
    explanation:
      "Four related question types, each with a precise test. Confusing them is the main source of error, so learn the definitions exactly.\n\n" +
      "1. ASSUMPTION — what the statement TAKES FOR GRANTED\n" +
      "An assumption is unstated but necessary for the statement to make sense. Use the negation test: negate the proposed assumption; if the statement collapses, it IS an assumption.\n" +
      "Statement: 'Use our courier — your parcel reaches in 24 hours.' Assumption: customers value speed. Negate it — customers do not care about speed — and the advertisement becomes pointless. So it is an assumption.\n\n" +
      "2. INFERENCE — what FOLLOWS from the statement\n" +
      "An inference comes AFTER the statement; an assumption comes before it. An inference must be necessarily true given the text, requiring nothing extra. A restatement is not an inference, and neither is anything needing outside knowledge.\n\n" +
      "3. ARGUMENT — is it STRONG or WEAK?\n" +
      "A strong argument is directly related to the question, addresses the main issue, and is substantial. Weak arguments are: irrelevant, based on individual cases rather than general effect, ambiguous, or simply restate the question. Arguments appealing to emotion or tradition without a practical consequence are weak.\n\n" +
      "4. COURSE OF ACTION — should it be FOLLOWED?\n" +
      "A valid course of action must be practical, must address the actual problem, and must lie within the acting body's power. Reject anything extreme ('ban it entirely'), anything that only punishes without solving, and anything the stated authority could not implement.\n\n" +
      "5. CAUSE AND EFFECT\n" +
      "Two events are given and you classify them: one is the cause of the other, both are effects of a common cause, or they are independent. Chronology alone does not prove causation — the earlier event is not automatically the cause.\n\n" +
      "EXAM APPROACH\n" +
      "Read the question stem FIRST to know which of the five tests applies, then read the statement. Reading the statement first tempts you into applying the wrong test, which is why candidates who know the theory still lose marks here.",
    code: "Assumption : unstated, comes BEFORE, necessary\n  negation test -> negate it; statement collapses? -> assumption\n\nInference  : comes AFTER, necessarily true from the text\n  reject: paraphrase | needs outside info | too strong\n\nArgument   : STRONG if relevant + addresses the main issue\n  WEAK if: individual case, ambiguous, restates question,\n           pure emotion/tradition\n\nCourse of action : practical + solves the problem +\n  within the authority's power\n  reject: extreme bans, punishment-only, unimplementable\n\nCause & effect : cause | common cause | independent\n  earlier != cause (chronology proves nothing)\n\nRead the QUESTION STEM before the statement.",
    interviewQuestion:
      "Statement: 'The bank has decided to keep all rural branches open on Sundays.' Which follows as an assumption, and which as an inference?",
  },
  {
    id: "ibpspo-main-reason-codedineq",
    category: "ibpspo-mains",
    topic: "Reasoning & Computer Aptitude",
    title: "Coded Inequality, Blood Relation & Direction",
    difficulty: "Advanced",
    summary:
      "Mains variants where symbols replace the relationships — decode first, then solve as usual.",
    explanation:
      "Mains hides familiar topics behind a symbol layer. The winning habit is identical in all three: REWRITE the coded statement into plain form in the margin before doing any reasoning. Decoding on the fly is the only reason these feel hard.\n\n" +
      "CODED INEQUALITY\n" +
      "A key defines symbols, for example: 'A @ B' means A is not smaller than B (A >= B); 'A # B' means A is neither greater than nor equal to B (A < B).\n" +
      "Watch the double negatives — 'neither greater than nor equal to' is simply '<', and misreading it inverts the whole chain. Translate the key into symbols once, at the top of your rough sheet, then apply the ordinary chain rules.\n\n" +
      "CODED BLOOD RELATIONS\n" +
      "Expressions like 'P % Q $ R' come with a key such as: '%' means 'is the father of', '$' means 'is the sister of'. Read strictly LEFT TO RIGHT and build the tree incrementally rather than trying to name the final relation directly.\n" +
      "Note that a symbol may be gender-neutral ('is a child of'), which is what produces 'cannot be determined' answers — if gender is never fixed, you cannot say brother versus sister.\n\n" +
      "CODED DIRECTION SENSE\n" +
      "'P & Q' might mean 'P is 5 m north of Q'. Convert each statement into an arrow on a sketch immediately. The set usually ends by asking for a shortest distance, so keep a running total of the north-south and east-west components rather than redrawing at the end.\n\n" +
      "MAINS-LEVEL TWIST\n" +
      "These sets often combine two layers — a coded direction inside a puzzle, or a coded relation attached to a seating arrangement. Solve the outer arrangement FIRST using the position clues, and apply the coded layer only once the positions are fixed. Trying to do both at once creates branches you cannot close.\n\n" +
      "TIME\n" +
      "A coded set of five is worth about 4 minutes. If the key involves three or more symbols with negations, translate the whole key before reading a single statement.",
    code: "Always rewrite the key FIRST:\n  'A @ B' = A is not smaller than B      ->  A >= B\n  'A # B' = A is neither greater than\n            nor equal to B              ->  A <  B\n  'A * B' = A is not greater than B      ->  A <= B\n\nDouble negatives are the trap. Translate once, in the margin.\n\nCoded relations — read LEFT to RIGHT:\n  '%' = is the father of   '$' = is the sister of\n  P % Q $ R  ->  P is father of Q; Q is sister of R\n             ->  P is the father of R\n  gender unspecified anywhere -> 'cannot be determined'\n\nCoded directions: convert to arrows immediately,\nkeep running N-S and E-W totals for the final distance.\n\nCombined sets: fix POSITIONS first, apply the code second.",
    interviewQuestion:
      "If 'P @ Q' means P is not smaller than Q and 'Q # R' means Q is neither greater than nor equal to R, what definitely follows about P and R?",
  },
  {
    id: "ibpspo-main-reason-complexpuzzle",
    category: "ibpspo-mains",
    topic: "Reasoning & Computer Aptitude",
    title: "Complex Puzzles: Multi-Variable & Uncertain Count",
    difficulty: "Tricky",
    summary:
      "Mains puzzles carrying three or more attributes per person, or an unknown number of seats.",
    explanation:
      "Mains puzzles differ from prelims in two ways: more attributes per entity, and deliberately incomplete anchoring.\n\n" +
      "MULTI-VARIABLE PUZZLES\n" +
      "A typical set fixes eight people across floors, plus a salary, plus a city. Build ONE table with a column per attribute — never separate tables, which is what makes cross-attribute clues unusable.\n" +
      "Order of attack: place the attribute with the most absolute clues first (usually the positional one), then layer the others onto the fixed skeleton. Attributes are usually linked only through the positional one, so it must be solved first.\n\n" +
      "UNCERTAIN NUMBER OF PERSONS\n" +
      "'Some persons sit in a row' with no total given. These look impossible but are strictly mechanical:\n" +
      "1. Place the relative blocks from the clues without assuming any total.\n" +
      "2. Use a clue of the form 'as many persons to the left of A as to the right of B' to pin the block inside the row.\n" +
      "3. The minimum possible total is what the blocks force; the question usually asks exactly that.\n" +
      "Never assume the row has 8 people because most puzzles do.\n\n" +
      "MULTIPLE-CASE HANDLING\n" +
      "When a clue leaves two possibilities, draw BOTH cases side by side, labelled Case 1 and Case 2, and carry them forward together. Continue until a later clue contradicts one — then strike it out completely rather than half-abandoning it.\n" +
      "Most mains puzzles are built to generate two or three cases early and eliminate all but one by the fourth or fifth clue. Candidates who refuse to branch get stuck; candidates who branch on paper finish.\n\n" +
      "SELECTION DISCIPLINE\n" +
      "There are typically four or five puzzle sets and time for three. Spend 30 seconds reading all of them and pick by clue quality, not topic familiarity: a set opening with two absolute clues (an extreme end, a fixed floor) will solve far faster than one opening with three relative clues, regardless of type.",
    code: "Multi-variable: ONE table, one column per attribute\n  Person | Floor | Salary | City\n  Solve the POSITIONAL attribute first, then layer.\n\nUncertain count:\n  1. place relative blocks, assume no total\n  2. use 'as many left of A as right of B' to pin it\n  3. answer = the MINIMUM the blocks force\n  Never default to 8 persons.\n\nBranching:\n  clue leaves 2 options -> draw Case 1 AND Case 2\n  carry both forward until one is contradicted\n  then strike it out entirely\n\nSet selection (30 s scan):\n  prefer sets opening with ABSOLUTE clues\n  (extreme end, fixed floor, 'sits opposite')\n  over sets opening with relative clues only.",
    interviewQuestion:
      "In a row of unknown length, only two people sit to the left of P, and as many sit to the right of Q as to the left of P. If three people sit between P and Q, what is the minimum number in the row?",
  },
  {
    id: "ibpspo-main-reason-computer",
    category: "ibpspo-mains",
    topic: "Reasoning & Computer Aptitude",
    title: "Computer Aptitude Fundamentals",
    difficulty: "Basic",
    summary:
      "The computer-awareness questions bundled into the mains reasoning section.",
    explanation:
      "A small but very high-yield block — the questions are recall-based and take seconds each, so never leave them unattempted.\n\n" +
      "HARDWARE AND MEMORY\n" +
      "- Input devices: keyboard, mouse, scanner, MICR reader, barcode scanner. Output: monitor, printer, speaker.\n" +
      "- Primary memory: RAM (volatile, lost on power-off) and ROM (non-volatile). Cache sits between CPU and RAM and is the fastest.\n" +
      "- Secondary storage: HDD, SSD, optical media. Non-volatile but slower.\n" +
      "- Units: 1 byte = 8 bits, 1 KB = 1024 bytes, then MB, GB, TB, PB in the same steps.\n\n" +
      "SOFTWARE\n" +
      "- System software: operating systems (Windows, Linux, Unix), compilers, device drivers.\n" +
      "- Application software: word processors, spreadsheets, browsers.\n" +
      "- A compiler translates an entire program at once; an interpreter translates line by line.\n\n" +
      "NETWORKING AND INTERNET\n" +
      "- LAN, MAN, WAN by geographic scope.\n" +
      "- Topologies: star, bus, ring, mesh.\n" +
      "- Common protocols: HTTP/HTTPS for web, FTP for files, SMTP for sending mail, POP3 and IMAP for receiving.\n" +
      "- IP address identifies a device; a URL identifies a resource.\n\n" +
      "BANKING TECHNOLOGY — MOST LIKELY TO BE ASKED\n" +
      "- Core Banking Solution (CBS) lets a customer bank at any branch rather than only the home branch.\n" +
      "- NEFT settles in batches; RTGS settles in real time and is used for high-value transfers; IMPS and UPI work 24x7 and instantly.\n" +
      "- MICR appears on cheques for automated clearing; IFSC identifies a branch for electronic transfers.\n\n" +
      "SECURITY\n" +
      "Phishing (fraudulent messages), malware, ransomware, firewalls, encryption, two-factor authentication. Expect at least one security question, usually framed around a customer being defrauded.\n\n" +
      "SHORTCUTS\n" +
      "Ctrl+C copy, Ctrl+V paste, Ctrl+X cut, Ctrl+Z undo, Ctrl+Y redo, Ctrl+P print, Ctrl+F find, Ctrl+S save, Alt+Tab switch windows, F5 refresh.",
    code: "Memory:\n  cache > RAM > SSD > HDD    (fast to slow)\n  RAM volatile | ROM non-volatile\n  1 byte = 8 bits ; KB -> MB -> GB -> TB (x1024)\n\nTranslators:\n  compiler = whole program at once\n  interpreter = line by line\n\nProtocols:\n  HTTP/HTTPS web | FTP files\n  SMTP send mail | POP3, IMAP receive mail\n\nBanking tech:\n  CBS  -> bank at any branch\n  NEFT -> batch settlement\n  RTGS -> real time, high value\n  IMPS/UPI -> instant, 24x7\n  MICR -> cheque clearing | IFSC -> identifies branch\n\nShortcuts: Ctrl + C V X Z Y P F S | Alt+Tab | F5",
    interviewQuestion:
      "What is the difference between NEFT and RTGS, and which would a customer use to transfer Rs 5 lakh immediately?",
  },

  // ── DATA ANALYSIS & INTERPRETATION (continued) ─────────────────────────────────
  {
    id: "ibpspo-main-di-caselet",
    category: "ibpspo-mains",
    topic: "Data Analysis & Interpretation",
    title: "Caselet DI & Missing Data Sets",
    difficulty: "Tricky",
    summary:
      "Data hidden inside prose, or tables with blanks that must be derived before any question is answerable.",
    explanation:
      "CASELET DI\n" +
      "The data arrives as a paragraph with no table. This is the highest-scoring mains DI type for anyone willing to spend the first 90 seconds building their own table — and the lowest for anyone who does not.\n" +
      "Method: read the paragraph once and extract every number into a grid of your own design, labelling rows and columns explicitly. Only then look at the questions. Re-reading the paragraph per question is what makes caselets feel impossible.\n" +
      "Where relationships are given rather than values ('the number of male employees in B is twice that in A'), assign a variable and write the relation as an equation immediately.\n\n" +
      "MISSING DI\n" +
      "A table with blank cells, plus footnotes containing the relationships needed to fill them. The blanks are never optional — derive them all before attempting any question.\n" +
      "Typical footnotes: 'Total of all four companies is 3552', 'Unsold equals manufactured minus sold', 'The ratio of A to B is 3 : 4'. Each yields one equation; the number of independent equations always matches the number of blanks in a well-set question, so if you cannot close the system you have missed a footnote.\n\n" +
      "WORKED EXAMPLE\n" +
      "A company manufactured 900 units, sold 648, and the unsold count is given as 3X.\n" +
      "Unsold = 900 - 648 = 252, so 3X = 252 and X = 84. Now every downstream question that uses X is unlocked.\n\n" +
      "DATA SUFFICIENCY IN QUANT\n" +
      "Same discipline as reasoning DS: test each statement alone, never solve fully, and remember that 'sufficient' means a unique numerical answer. A quadratic yielding two positive roots is NOT sufficient unless the context rules one out — for instance, a negative or fractional answer being impossible for a count of people.\n\n" +
      "SET SELECTION\n" +
      "Attempt tables and caselets with clean footnotes before graph-based sets with fine scales. In mains, the deciding factor is how quickly the data becomes usable, not how hard the arithmetic is.",
    code: "Caselet:\n  1. read once, extract EVERY number into your own table\n  2. relationships -> assign variables, write equations\n  3. only then read the questions\n  Never re-read the paragraph per question.\n\nMissing DI:\n  fill ALL blanks before attempting anything\n  each footnote = one equation\n  #independent equations should = #blanks\n  cannot close the system? -> you missed a footnote\n\nWorked:\n  manufactured 900, sold 648, unsold = 3X\n  3X = 900 - 648 = 252  ->  X = 84\n\nData sufficiency:\n  sufficient == exactly ONE numerical answer\n  two valid roots -> insufficient (unless context\n  rules one out: counts cannot be negative/fractional)",
    interviewQuestion:
      "A caselet states that total employees are 1200, the ratio of men to women is 7:5, and 40% of the women are graduates. How many women are non-graduates?",
  },
  {
    id: "ibpspo-main-di-quantitycompare",
    category: "ibpspo-mains",
    topic: "Data Analysis & Interpretation",
    title: "Quantity Comparison & Approximation Under Time",
    difficulty: "Advanced",
    summary:
      "The Quantity I vs Quantity II format, and knowing when approximating is safe.",
    explanation:
      "QUANTITY COMPARISON\n" +
      "Two quantities are defined by separate word problems and you state the relation: Quantity I > II, I < II, I >= II, I <= II, or no relation / they are equal.\n" +
      "Solve each quantity INDEPENDENTLY and fully, then compare. The classic error is stopping early because one looks obviously bigger.\n" +
      "Note that '>=' and '<=' options exist for cases where the two can be equal under some readings — if your two values are exactly equal, the answer is the equality option, not 'no relation'. 'No relation' applies only when the quantities cannot be compared at all, which is rare in this format.\n\n" +
      "WHEN APPROXIMATION IS SAFE\n" +
      "Approximate freely when the options are more than about 5% apart. Compute exactly when:\n" +
      "- Two options are within a few percent of each other.\n" +
      "- The question is a comparison, where a rounding error can flip the direction.\n" +
      "- The answer feeds into a later part of the same set.\n\n" +
      "SPEED TECHNIQUES WORTH DRILLING\n" +
      "- Percentages via fractions: 37.5% is 3/8, 62.5% is 5/8, 16.67% is 1/6.\n" +
      "- Squares up to 30 and cubes up to 15, memorised.\n" +
      "- Multiply by 25 by multiplying by 100 and dividing by 4; by 125 via 1000 divided by 8.\n" +
      "- For comparing two fractions, cross-multiply rather than converting both to decimals.\n\n" +
      "WORKED EXAMPLE\n" +
      "Quantity I: the value of x in 2x^2 - 11x + 12 = 0. Quantity II: the value of y in 3y^2 - 13y + 12 = 0.\n" +
      "Quantity I factors as (2x - 3)(x - 4), giving x = 1.5 or 4. Quantity II factors as (3y - 4)(y - 3), giving y = 4/3 or 3.\n" +
      "Comparing all pairs: 1.5 exceeds 4/3 but is less than 3, so the relation is not consistent across pairs — the answer is 'no relation can be established'. Whenever the root ranges overlap, this is the answer.\n\n" +
      "TIME BUDGET\n" +
      "About 45 seconds per quantity-comparison item. If both quantities need full word-problem solving and neither is short, skip it — mains rewards set selection over stubbornness.",
    code: "Quantity comparison:\n  solve BOTH fully and independently, then compare\n  equal values -> the '>=' or '<=' / equality option\n  'no relation' -> only when root ranges OVERLAP\n\nWorked:\n  I : 2x^2 - 11x + 12 = 0 -> (2x-3)(x-4) -> x = 1.5, 4\n  II: 3y^2 - 13y + 12 = 0 -> (3y-4)(y-3) -> y = 1.33, 3\n  1.5 > 1.33 but 1.5 < 3  ->  ranges overlap\n  => NO RELATION\n\nApproximate when options differ by > ~5%.\nCompute exactly for comparisons and close options.\n\nSpeed:\n  37.5% = 3/8   62.5% = 5/8   16.67% = 1/6\n  x25 -> x100 / 4      x125 -> x1000 / 8\n  compare fractions by CROSS-MULTIPLYING",
    interviewQuestion:
      "Quantity I: SI on Rs 5000 at 8% for 3 years. Quantity II: CI on Rs 5000 at 8% for 2 years. Establish the relation.",
  },

  // ── GENERAL / ECONOMY / BANKING AWARENESS (continued) ──────────────────────────
  {
    id: "ibpspo-main-bank-rbistructure",
    category: "ibpspo-mains",
    topic: "General/Economy/Banking Awareness",
    title: "RBI: Structure, Functions & Monetary Policy Tools",
    difficulty: "Intermediate",
    summary:
      "The central bank's constitution, its roles, and every rate you must be able to define.",
    explanation:
      "The single most examined topic in banking awareness, and the one interviewers open with.\n\n" +
      "STRUCTURE\n" +
      "The RBI was established on 1 April 1935 under the RBI Act 1934, and nationalised in 1949. Its headquarters is in Mumbai. It is run by a Central Board of Directors headed by the Governor, supported by Deputy Governors.\n" +
      "The Monetary Policy Committee (MPC) has six members — three from the RBI including the Governor, and three appointed by the central government. It meets bi-monthly, and the Governor holds a casting vote in a tie.\n\n" +
      "PRINCIPAL FUNCTIONS\n" +
      "Issuing currency (all notes except the one-rupee note, which the Ministry of Finance issues); acting as banker to the government and to banks; the lender of last resort; managing foreign exchange under FEMA; regulating and supervising banks; and controlling credit.\n\n" +
      "THE RATES — LEARN THE DEFINITIONS, VERIFY THE NUMBERS\n" +
      "- Repo rate: the rate at which the RBI lends to commercial banks against securities. Raising it makes borrowing costlier and cools inflation.\n" +
      "- Reverse repo rate: the rate at which the RBI borrows from banks, absorbing liquidity.\n" +
      "- CRR: the share of Net Demand and Time Liabilities held as cash with the RBI. It earns no interest.\n" +
      "- SLR: the share of NDTL that banks must hold themselves in liquid assets such as gold and government securities. It does earn a return.\n" +
      "- MSF: an emergency window above the repo rate for overnight borrowing.\n" +
      "- Bank rate: long-term lending without collateral, generally aligned with the MSF.\n" +
      "Current numerical values change at every policy meeting — memorise the DEFINITIONS here, then check the latest figures from the RBI's own policy statement before your exam.\n\n" +
      "TRANSMISSION LOGIC\n" +
      "A repo cut lowers banks' borrowing cost, so lending rates fall, credit expands and demand rises. A repo hike does the reverse. CRR and SLR act on the quantity of lendable funds rather than the price of them. Interviewers routinely ask you to trace this chain, so be able to state it in one sentence.",
    code: "RBI: est. 1 April 1935 (RBI Act 1934), nationalised 1949\nHQ Mumbai | Central Board headed by the Governor\nMPC: 6 members (3 RBI + 3 government), bi-monthly,\n     Governor has the casting vote\n\nRates — definitions (verify current values):\n  Repo         RBI lends to banks (against securities)\n  Reverse repo RBI borrows from banks (absorbs liquidity)\n  CRR          cash with RBI, earns NO interest\n  SLR          liquid assets held BY the bank, earns return\n  MSF          emergency overnight, above repo\n  Bank rate    long term, no collateral\n\nTransmission:\n  repo down -> lending rates down -> credit up -> demand up\n  CRR/SLR act on QUANTITY of funds, repo on the PRICE\n\nCurrency: RBI issues all notes EXCEPT Re 1 (Ministry of Finance)",
    interviewQuestion:
      "Explain the difference between CRR and SLR, and trace what happens in the economy when the RBI raises the repo rate.",
  },
  {
    id: "ibpspo-main-bank-regulation",
    category: "ibpspo-mains",
    topic: "General/Economy/Banking Awareness",
    title: "Banking Regulation: Basel Norms, PSL & Bank Types",
    difficulty: "Advanced",
    summary:
      "Capital adequacy, priority sector obligations and the classification of Indian banks.",
    explanation:
      "BASEL NORMS\n" +
      "International capital standards from the Basel Committee on Banking Supervision, based at the Bank for International Settlements in Basel.\n" +
      "Basel III rests on three pillars: minimum capital requirements, supervisory review, and market discipline through disclosure. It also introduced the capital conservation buffer, the leverage ratio, and two liquidity standards — the Liquidity Coverage Ratio for short-term stress and the Net Stable Funding Ratio for structural funding.\n" +
      "CRAR (Capital to Risk-Weighted Assets Ratio) is the headline measure. India's requirement is set above the global Basel minimum, so quote India's figure when asked about Indian banks. Tier 1 capital is equity and disclosed reserves — the loss-absorbing core; Tier 2 is supplementary, including subordinated debt and revaluation reserves.\n\n" +
      "PRIORITY SECTOR LENDING\n" +
      "Banks must direct a set share of Adjusted Net Bank Credit to sectors that would otherwise be underserved: agriculture, micro/small/medium enterprises, export credit, education, housing, social infrastructure, renewable energy and weaker sections.\n" +
      "Domestic commercial banks carry a 40% overall target with sub-targets for agriculture and weaker sections; Small Finance Banks carry a substantially higher obligation of 75%. Shortfalls are deposited with NABARD's Rural Infrastructure Development Fund. Priority Sector Lending Certificates let a bank exceeding its target sell the surplus to one falling short.\n\n" +
      "TYPES OF BANKS IN INDIA\n" +
      "- Public sector banks, majority government-owned.\n" +
      "- Private sector banks.\n" +
      "- Foreign banks operating through branches or subsidiaries.\n" +
      "- Regional Rural Banks, jointly held by the centre, a state and a sponsor bank, serving rural credit.\n" +
      "- Cooperative banks, both urban and rural, regulated jointly by the RBI and state registrars.\n" +
      "- Small Finance Banks, which take deposits and lend to underserved segments.\n" +
      "- Payments Banks, which accept deposits up to a prescribed limit per customer and offer remittances, but CANNOT lend or issue credit cards. That lending prohibition is the single most-asked distinguishing fact.\n\n" +
      "DEPOSIT INSURANCE\n" +
      "DICGC, an RBI subsidiary, insures deposits per depositor per bank up to a prescribed limit covering principal and interest together.",
    code: "Basel III pillars:\n  1. minimum capital  2. supervisory review  3. market discipline\n  plus: capital conservation buffer, leverage ratio,\n        LCR (short-term), NSFR (structural funding)\n\n  Tier 1 = equity + disclosed reserves (core, loss-absorbing)\n  Tier 2 = subordinated debt, revaluation reserves\n  India's CRAR requirement sits ABOVE the Basel minimum.\n\nPriority Sector Lending (% of ANBC):\n  domestic commercial banks   40% overall\n  Small Finance Banks         75%\n  shortfall -> RIDF with NABARD\n  PSLC = tradable certificate for surplus/shortfall\n\nPayments Banks: deposits + remittances only\n  CANNOT lend or issue credit cards   <- most asked\n\nDICGC (RBI subsidiary) insures deposits\nper depositor per bank (principal + interest).",
    interviewQuestion:
      "What is the difference between a Small Finance Bank and a Payments Bank, and why can one lend while the other cannot?",
  },
  {
    id: "ibpspo-main-bank-markets",
    category: "ibpspo-mains",
    topic: "General/Economy/Banking Awareness",
    title: "Financial Markets, Regulators & Instruments",
    difficulty: "Advanced",
    summary:
      "Who regulates what, and the money-market and capital-market instruments banks deal in.",
    explanation:
      "THE REGULATORS — KNOW WHICH BODY OWNS WHICH DOMAIN\n" +
      "- RBI: banks, non-banking financial companies, payment systems, monetary policy, foreign exchange.\n" +
      "- SEBI: securities markets, stock exchanges, mutual funds, investor protection.\n" +
      "- IRDAI: insurance, both life and general.\n" +
      "- PFRDA: pensions, including the National Pension System.\n" +
      "- IBBI: insolvency and bankruptcy proceedings under the IBC.\n" +
      "Questions very often present a scenario and ask which regulator applies — that mapping is the whole answer.\n\n" +
      "MONEY MARKET — SHORT TERM, UNDER ONE YEAR\n" +
      "- Treasury Bills: government borrowing, issued at a discount and redeemed at face value, in 91, 182 and 364-day tenors. They carry no coupon.\n" +
      "- Commercial Paper: unsecured short-term borrowing by corporates.\n" +
      "- Certificate of Deposit: a negotiable instrument issued by a bank against a deposit.\n" +
      "- Call money: interbank borrowing for one day.\n\n" +
      "CAPITAL MARKET — LONG TERM\n" +
      "- Equity shares confer ownership and voting rights, with dividends that are not guaranteed.\n" +
      "- Preference shares get a fixed dividend and priority on repayment, but usually no vote.\n" +
      "- Debentures and bonds are debt; holders are creditors, not owners, and are paid before shareholders in a winding-up.\n" +
      "- The primary market is where securities are ISSUED (an IPO or FPO); the secondary market is where they are TRADED. Money reaches the company only in the primary market — a common interview follow-up.\n\n" +
      "OTHER TERMS THAT RECUR\n" +
      "- Mutual funds pool investor money; a Systematic Investment Plan invests fixed sums at regular intervals.\n" +
      "- Derivatives (futures, options) derive value from an underlying asset.\n" +
      "- FDI is a lasting stake in a business; FPI is portfolio investment in securities and is far more volatile — a distinction asked almost every year.\n" +
      "- Demat accounts hold securities electronically, maintained through depositories.\n\n" +
      "PRACTICAL NOTE\n" +
      "For mains, definitions and the regulator mapping carry the marks. For the interview, be ready to explain any instrument to a customer in plain language — panels frequently ask you to 'explain a mutual fund to a farmer'.",
    code: "Regulator map:\n  RBI    banks, NBFCs, payments, forex, monetary policy\n  SEBI   securities, exchanges, mutual funds\n  IRDAI  insurance (life + general)\n  PFRDA  pensions / NPS\n  IBBI   insolvency under the IBC\n\nMoney market (< 1 year):\n  T-Bills  91/182/364 days, issued at a DISCOUNT, no coupon\n  Commercial Paper  corporate, unsecured\n  Certificate of Deposit  bank-issued, negotiable\n  Call money  interbank, overnight\n\nCapital market:\n  equity      ownership + votes, dividend not guaranteed\n  preference  fixed dividend, priority, usually no vote\n  debenture   DEBT - creditor, paid before shareholders\n  primary = issued (company gets the money)\n  secondary = traded (it does not)\n\nFDI = lasting stake | FPI = portfolio, volatile",
    interviewQuestion:
      "A customer asks why a Treasury Bill has no interest rate printed on it. How would you explain how a T-Bill earns a return?",
  },
  {
    id: "ibpspo-main-bank-schemes",
    category: "ibpspo-mains",
    topic: "General/Economy/Banking Awareness",
    title: "Government Schemes & Financial Inclusion",
    difficulty: "Intermediate",
    summary:
      "The flagship inclusion schemes a PO is expected to explain and sell at a branch counter.",
    explanation:
      "These carry marks in mains and come up in almost every interview, because a PO actually administers them.\n\n" +
      "THE INCLUSION BACKBONE\n" +
      "- PMJDY (Jan Dhan Yojana): basic no-frills accounts with zero minimum balance, a RuPay debit card, accident insurance cover and an overdraft facility after satisfactory operation. It is the foundation of the JAM trinity.\n" +
      "- The JAM trinity — Jan Dhan, Aadhaar and Mobile — enables Direct Benefit Transfer, sending subsidies straight to beneficiaries and cutting leakage. Be ready to explain DBT's rationale; it is a standard interview question.\n\n" +
      "SOCIAL SECURITY SCHEMES\n" +
      "- PMJJBY: life insurance cover, renewable annually, for account holders in a defined age band.\n" +
      "- PMSBY: accidental death and disability cover at a very low annual premium.\n" +
      "- Atal Pension Yojana: a guaranteed pension after 60 for subscribers in the unorganised sector, regulated by PFRDA.\n" +
      "Know the shape of each — what it covers, who is eligible, and how a customer enrols. Exact premium and cover figures are periodically revised, so confirm the current numbers close to your exam.\n\n" +
      "CREDIT AND ENTERPRISE\n" +
      "- MUDRA loans for micro-enterprises, in three tiers: Shishu, Kishore and Tarun, in ascending loan size.\n" +
      "- Stand Up India for SC/ST and women entrepreneurs setting up greenfield enterprises.\n" +
      "- Kisan Credit Card for short-term crop credit at concessional rates.\n" +
      "- PM SVANidhi for street vendors' working capital.\n\n" +
      "OTHER RECURRING SCHEMES\n" +
      "Sukanya Samriddhi for a girl child's savings, PM Awas Yojana for housing, PM Fasal Bima Yojana for crop insurance, and the Sovereign Gold Bond as an alternative to holding physical gold.\n\n" +
      "HOW TO STUDY THESE\n" +
      "For each scheme hold four facts: the target beneficiary, the benefit, the eligibility, and the administering ministry or regulator. That structure answers both the mains recall question and the interview follow-up, which is usually 'a customer walks in — which scheme would you offer and why?'",
    code: "For EVERY scheme, hold four facts:\n  beneficiary | benefit | eligibility | administering body\n\nInclusion:\n  PMJDY   zero-balance account, RuPay card, accident\n          cover, overdraft after good conduct\n  JAM     Jan Dhan + Aadhaar + Mobile -> DBT, less leakage\n\nSocial security:\n  PMJJBY  life cover, annually renewable\n  PMSBY   accident death/disability, very low premium\n  APY     guaranteed pension after 60 (PFRDA)\n\nCredit:\n  MUDRA   Shishu -> Kishore -> Tarun (ascending size)\n  Stand Up India  SC/ST + women, greenfield units\n  KCC     short-term crop credit, concessional\n  PM SVANidhi  street vendor working capital\n\nAmounts are revised periodically -> verify current figures.",
    interviewQuestion:
      "A street vendor with no collateral asks for working capital at your branch. Which schemes apply, and what would you check before sanctioning?",
  },
  {
    id: "ibpspo-main-bank-economy",
    category: "ibpspo-mains",
    topic: "General/Economy/Banking Awareness",
    title: "Economic Indicators, Budget & International Bodies",
    difficulty: "Advanced",
    summary:
      "GDP, inflation measures, fiscal terminology and the global institutions banks interact with.",
    explanation:
      "NATIONAL INCOME\n" +
      "- GDP is the value of goods and services produced WITHIN a country's borders. GNP adds net factor income earned abroad.\n" +
      "- Nominal GDP is at current prices; real GDP is adjusted for inflation and is the meaningful growth measure.\n" +
      "- The GDP deflator is the ratio of nominal to real GDP and covers the whole economy, unlike CPI which tracks a fixed consumer basket.\n" +
      "Data is released by the National Statistical Office under MoSPI.\n\n" +
      "INFLATION\n" +
      "- CPI measures retail prices and is the RBI's target measure under the flexible inflation targeting framework, which sets a central target with a tolerance band on either side.\n" +
      "- WPI measures wholesale prices and excludes services.\n" +
      "- Core inflation strips out food and fuel, being the volatile components.\n" +
      "- Demand-pull inflation comes from excess demand; cost-push from rising input costs. Stagflation is high inflation alongside stagnant growth — a favourite interview term.\n\n" +
      "FISCAL TERMS\n" +
      "- Fiscal deficit: total expenditure minus total receipts excluding borrowings. It indicates how much the government must borrow.\n" +
      "- Revenue deficit: revenue expenditure exceeding revenue receipts.\n" +
      "- Primary deficit: fiscal deficit minus interest payments.\n" +
      "- Direct taxes (income tax, corporate tax) fall on the payer; indirect taxes (GST, customs) are passed on. GST is a destination-based consumption tax administered through the GST Council.\n" +
      "The Union Budget is presented on 1 February and passed before the financial year begins on 1 April. The Economic Survey precedes it.\n\n" +
      "INTERNATIONAL INSTITUTIONS\n" +
      "- IMF, Washington DC: balance-of-payments support and surveillance; publishes the World Economic Outlook.\n" +
      "- World Bank, Washington DC: development lending; publishes World Development Report.\n" +
      "- ADB, Manila: Asian development finance.\n" +
      "- WTO, Geneva: trade rules.\n" +
      "- BIS, Basel: the central banks' bank, home of the Basel Committee.\n" +
      "- NDB, Shanghai: the BRICS development bank. AIIB, Beijing: Asian infrastructure.\n\n" +
      "STUDY ADVICE\n" +
      "Definitions and headquarters are stable and worth memorising. Specific growth rates, deficit figures and budget allocations change annually — revise those from a current-affairs source in the last month before the exam rather than from any fixed material.",
    code: "GDP  = produced within the borders\nGNP  = GDP + net factor income from abroad\nreal GDP = inflation-adjusted (the meaningful one)\nGDP deflator = nominal/real, covers the whole economy\n\nInflation:\n  CPI  retail, the RBI's TARGET measure\n  WPI  wholesale, excludes services\n  core CPI minus food and fuel\n  demand-pull | cost-push | stagflation\n\nDeficits:\n  fiscal  = expenditure - receipts (excl. borrowings)\n  revenue = revenue exp - revenue receipts\n  primary = fiscal - interest payments\n\nBudget 1 Feb | FY starts 1 April | Economic Survey precedes\n\nHQs: IMF & World Bank Washington | ADB Manila\n     WTO Geneva | BIS Basel | NDB Shanghai | AIIB Beijing\n\nDefinitions/HQs are stable; FIGURES change yearly.",
    interviewQuestion:
      "What is the difference between fiscal deficit and revenue deficit, and why does a high fiscal deficit concern the RBI?",
  },

  // ── ENGLISH LANGUAGE & DESCRIPTIVE (continued) ─────────────────────────────────
  {
    id: "ibpspo-main-eng-advancedrc",
    category: "ibpspo-mains",
    topic: "English Language & Descriptive",
    title: "Mains-Level Reading Comprehension & Vocabulary in Context",
    difficulty: "Advanced",
    summary:
      "Longer, denser passages with inference-heavy questions and abstract argumentation.",
    explanation:
      "Mains passages are longer than prelims, drawn from serious journalism and policy writing, and weighted towards inference, tone and the author's argument rather than plain retrieval.\n\n" +
      "WHAT CHANGES FROM PRELIMS\n" +
      "- Passages carry an ARGUMENT, not just information. Identify the author's position within the first two paragraphs and note whether they are advocating, criticising or merely surveying.\n" +
      "- Several viewpoints may appear. Track whose opinion each sentence expresses — a claim the author reports is not a claim the author endorses, and mains questions exploit that distinction directly.\n" +
      "- Vocabulary questions use secondary meanings, so context outweighs the dictionary sense.\n\n" +
      "STRUCTURAL READING\n" +
      "Mark each paragraph with its FUNCTION rather than its content: 'sets up the problem', 'gives the counter-view', 'concedes a point', 'concludes'. Function tags answer central-idea, tone and structure questions almost mechanically, and they take no extra time to write.\n\n" +
      "TONE VOCABULARY YOU MUST DISTINGUISH\n" +
      "Critical, sceptical, cynical, laudatory, objective, analytical, satirical, sanguine, sombre, ambivalent. The commonest error is calling an analytical passage 'critical' merely because it discusses a problem. Analysis examines; criticism condemns.\n\n" +
      "INFERENCE DISCIPLINE\n" +
      "The strict rule from prelims applies with more force: the answer must follow necessarily from the text alone. In mains, the wrong options are deliberately made attractive by being true in the real world, or by being a stronger version of what the passage actually says. Compare the QUANTIFIERS — 'some' versus 'most' versus 'all' — as your first elimination step.\n\n" +
      "TIME MANAGEMENT\n" +
      "Mains English allows more time per question than prelims, so a difficult passage is worth engaging with. Even so, do the standalone questions first to bank certain marks before committing to a dense passage.",
    code: "Tag each paragraph by FUNCTION, not content:\n  sets up problem | counter-view | concedes | concludes\n  -> answers central idea, tone and structure questions\n\nTrack WHOSE view each sentence carries.\n  reported claim != the author's claim   <- heavily tested\n\nTone words to keep distinct:\n  analytical (examines)  vs  critical (condemns)\n  sceptical | cynical | laudatory | objective\n  satirical | sanguine | sombre | ambivalent\n\nInference elimination, in order:\n  1. compare QUANTIFIERS (some / most / all)\n  2. reject real-world-true but unstated\n  3. reject stronger-than-the-text\n\nDo standalone questions BEFORE a dense passage.",
    interviewQuestion:
      "A passage says experts 'argue that adoption could plateau', while the author calls policymakers 'nonetheless optimistic'. What is the author's tone towards the experts' view?",
  },
  {
    id: "ibpspo-main-desc-precis",
    category: "ibpspo-mains",
    topic: "English Language & Descriptive",
    title: "Precis Writing & Report/Email Formats",
    difficulty: "Intermediate",
    summary:
      "The descriptive formats beyond essay and letter, with the structures that score.",
    explanation:
      "PRECIS WRITING\n" +
      "Condense a passage to roughly one third of its length while preserving every essential idea.\n" +
      "Rules that are marked strictly:\n" +
      "- Write in your OWN words. Lifting whole sentences loses marks even when accurate.\n" +
      "- Use the third person and past or present tense consistently. Never write 'I' or 'the author says'.\n" +
      "- Include no examples, no illustrations, no repetition and no personal opinion.\n" +
      "- Retain the original's proportions: an idea given a third of the passage should get about a third of the precis.\n" +
      "- Give it a short title.\n" +
      "Method: read twice, underline the key sentence of each paragraph, list those points, then write continuous prose from the list — not from the passage. Count your words and state the count at the end.\n\n" +
      "EMAIL WRITING\n" +
      "Increasingly common in place of a letter. Structure: a clear subject line, a salutation, an opening sentence stating the purpose, one or two short body paragraphs, a request or next step, and a sign-off. Keep it markedly shorter and plainer than a formal letter — email is judged on clarity and brevity, and over-formal phrasing is penalised.\n\n" +
      "REPORT WRITING\n" +
      "Structure: title, introduction stating the purpose and scope, findings organised under sub-headings, analysis, and a conclusion with recommendations. Write impersonally and factually; a report records what was found, not what you feel.\n\n" +
      "WHAT EARNS MARKS ACROSS ALL DESCRIPTIVE FORMATS\n" +
      "Correct format carries substantial weight on its own — a well-structured average answer beats a brilliant unstructured one. Then: relevance to the exact prompt, grammatical accuracy, and a legible, planned answer.\n" +
      "Spend two minutes outlining before writing. In a typed descriptive test there is no way to reorganise a rambling answer once written, and rambling is the commonest reason for a low descriptive score.\n\n" +
      "WORD LIMITS\n" +
      "Respect them. Essays generally run to about 250 words and letters to about 150. Substantially overshooting suggests poor selection and is marked down even when the content is sound.",
    code: "Precis:\n  ~1/3 of the original length\n  OWN words | third person | consistent tense\n  NO examples, repetition or opinion\n  keep the original proportions | give it a title\n  method: underline key sentence per paragraph ->\n          list points -> write from the LIST\n  state the word count at the end\n\nEmail: subject | salutation | purpose | body |\n       request/next step | sign-off        (short, plain)\n\nReport: title | purpose & scope | findings under\n        sub-headings | analysis | recommendations\n        (impersonal, factual)\n\nMark weightage: FORMAT first, then relevance,\nthen grammar. Outline for 2 minutes before writing.\nEssay ~250 words | letter ~150 words.",
    interviewQuestion:
      "Write a precis of a 300-word passage on digital lending risks, and give it an appropriate title.",
  },
];
