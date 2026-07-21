export default [
  // ── HR / PERSONAL QUESTIONS ────────────────────────────────────────────────────
  {
    id: "ibpspo-int-hr-selfintro",
    category: "ibpspo-interview",
    topic: "HR / Personal",
    title: "How to introduce yourself in a bank interview",
    difficulty: "Basic",
    summary: "Creating a concise, professional 90-second summary of your background.",
    explanation:
      "A strong self-introduction should highlight your qualifications, key achievements, and suitability for the PO role. Keep it structured:\n\n" +
      "1. Basic Info: Name, location, and family background (very briefly).\n" +
      "2. Academic Background: Degree, university, and relevant coursework (especially finance, economics, or computer science).\n" +
      "3. Key Strengths/Achievements: Mention skills like leadership, analytical thinking, or public speaking, supported by academic or extra-curricular accomplishments.\n" +
      "4. Connection to Banking: State why your background aligns with banking operations (e.g. data analysis, customer relationship skills).\n\n" +
      "Avoid repeating your resume verbatim. Focus on how your experiences have prepared you for a career as a bank officer.",
    code: "Self-Introduction Structure:\n- Introduction (30s): Name, place, education.\n- Middle (40s): Strengths (team leadership, analytics) + short achievement.\n- Close (20s): Goal to build a career in public sector banking.",
    interviewQuestion: "Introduce yourself to the panel highlighting why you want to join public sector banking.",
  },
  {
    id: "ibpspo-int-hr-engineeringtobanking",
    category: "ibpspo-interview",
    topic: "HR / Personal",
    title: "Why banking after an engineering / science degree?",
    difficulty: "Intermediate",
    summary: "Justifying the transition from a technical background to a banking career.",
    explanation:
      "Interviewers ask this to check if you are genuinely interested in banking or just seeking any job. Frame your answer positively by showing how technical skills benefit modern banking:\n\n" +
      "1. Analytical & Logical Skills: Engineering teaches structured problem-solving, which is critical for risk assessment, loan auditing, and credit analysis.\n" +
      "2. Digital Banking & Fintech: Banks are becoming technology organizations. Your comfort with databases, software systems, and data analytics helps implement digital initiatives (UPI, AI chatbots, security protocols).\n" +
      "3. General Adaptability: Highlighting your ability to learn complex systems quickly, which is essential for mastering banking operations and financial products.",
    code: "Key Transferable Skills:\n- Analytical reasoning (credit scoring)\n- Data literacy (database management, MIS reports)\n- Adaptability & quick learning (RBI circulars, compliance software)",
    interviewQuestion: "Why did you choose to prepare for banking after completing your B.Tech/B.Sc?",
  },

  // ── BANKING CONCEPTS ───────────────────────────────────────────────────────────
  {
    id: "ibpspo-int-bank-npa",
    category: "ibpspo-interview",
    topic: "Banking Concepts",
    title: "Non-Performing Assets (NPAs) & Recovery",
    difficulty: "Advanced",
    summary: "Understanding bad loans, asset classification, and recovery mechanisms in banks.",
    explanation:
      "A Non-Performing Asset (NPA) is a loan or advance where interest or installment of principal remains overdue for a period of 90 days or more.\n\n" +
      "Asset Classification:\n" +
      "1. Sub-standard Assets: Overdue for <= 12 months.\n" +
      "2. Doubtful Assets: Overdue for > 12 months.\n" +
      "3. Loss Assets: Identified as unrecoverable by the bank or auditors.\n\n" +
      "Recovery Mechanisms:\n" +
      "- SARFAESI Act, 2002: Allows banks to auction residential or commercial properties of defaulters without court intervention.\n" +
      "- Insolvency and Bankruptcy Code (IBC): Resolves large corporate defaults.\n" +
      "- Lok Adalats: Resolves small defaults up to Rs. 20 Lakhs.",
    code: "Overdue Timeline:\n- 1 to 90 Days: SMA (Special Mention Account)\n- > 90 Days: Classified as NPA (Non-Performing Asset)\n- > 12 Months: Doubtful Asset",
    interviewQuestion: "What is an NPA, and what steps do banks take to recover outstanding bad loans?",
  },
  {
    id: "ibpspo-int-bank-monetarypolicy",
    category: "ibpspo-interview",
    topic: "Banking Concepts",
    title: "Monetary Policy: Repo Rate, CRR, SLR",
    difficulty: "Advanced",
    summary: "How the RBI manages liquidity, inflation, and money supply in the economy.",
    explanation:
      "The Reserve Bank of India (RBI) uses monetary policy tools to control inflation and maintain economic growth:\n\n" +
      "1. Repo Rate: The rate at which the RBI lends money to commercial banks. Raising the repo rate makes loans expensive, reducing money supply to control inflation.\n" +
      "2. Cash Reserve Ratio (CRR): The percentage of Net Demand and Time Liabilities (NDTL) that commercial banks must keep as cash reserves with the RBI. No interest is earned on CRR.\n" +
      "3. Statutory Liquidity Ratio (SLR): The percentage of NDTL that banks must maintain in safe liquid assets (gold, government securities) themselves. Helps secure depositors' money.",
    code: "Policy Tools:\n- Repo Rate: Direct inflation control lever.\n- CRR: Cash held with RBI (yields 0%).\n- SLR: Liquid assets held by bank (yields interest via government bonds).",
    interviewQuestion: "Explain the difference between CRR and SLR, and what happens when RBI increases the Repo Rate.",
  },

  // ── SITUATIONAL SCENARIOS ──────────────────────────────────────────────────────
  {
    id: "ibpspo-int-sit-angrycustomer",
    category: "ibpspo-interview",
    topic: "Situational Scenarios",
    title: "Handling an Angry Customer at the Branch",
    difficulty: "Intermediate",
    summary: "Resolving customer grievances calmly and maintaining branch reputation.",
    explanation:
      "As a Probationary Officer, you are the face of the branch. When dealing with an upset customer:\n\n" +
      "1. Listen Actively: Let the customer speak without interruption. Often, they just want to be heard.\n" +
      "2. Show Empathy: Acknowledge their problem and apologize for the inconvenience caused (e.g. 'I understand your frustration, sir/ma'am').\n" +
      "3. Analyze the Issue: Investigate the root cause (e.g. server failure, delayed transaction, wrong charge deduction).\n" +
      "4. Provide a Solution: Offer a clear resolution timeline or solve it immediately. If it's a policy constraint, explain it politely.\n" +
      "5. Follow-up: Ensure the customer leaves satisfied and the issue doesn't recur.",
    code: "Action Plan:\n- Listen and calm down the customer.\n- Apologize for the inconvenience.\n- Identify the core problem.\n- Offer immediate support or a clear resolution window.",
    interviewQuestion: "A customer shouts at you at the counter because their pension was not credited. How will you handle the situation?",
  },
];
