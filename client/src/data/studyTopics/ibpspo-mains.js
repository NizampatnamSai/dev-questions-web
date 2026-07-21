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
];
