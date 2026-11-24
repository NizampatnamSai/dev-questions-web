// Topic library for the recruitment syllabi.
//
// These are building blocks, NOT a common syllabus: every exam in exams-*.js
// composes its own stage-by-stage syllabus from these blocks, adds what only it
// tests (Insurance awareness, ESI, ARD, Finance & Management, Computer Skill
// Test...) and drops what it does not (RRB PO Prelims has no English, LIC AAO
// has no negative marking...). Blocks exist so a correction to, say, the list
// of Reasoning puzzle types lands everywhere at once.
//
// Shape: { topic, sub?: string[] }

const t = (topic, ...sub) => (sub.length ? { topic, sub } : { topic });

// ── Reasoning ────────────────────────────────────────────────────────────────
export const REASONING_CORE = [
  t("Puzzles", "Floor / flat", "Box / stack", "Month / day / year scheduling", "Categorised & comparison puzzles"),
  t("Seating Arrangement", "Linear (single & double row)", "Circular (inside / outside facing)", "Square & rectangular", "Parallel rows"),
  t("Syllogism", "Direct conclusions", "'Only a few' statements", "Possibility cases"),
  t("Inequalities", "Direct", "Coded"),
  t("Coding-Decoding", "Letter & number coding", "Word-sentence coding"),
  t("Blood Relations"),
  t("Direction Sense & Distance"),
  t("Order & Ranking"),
  t("Alphanumeric & Symbol Series"),
];

export const REASONING_MAINS_EXTRA = [
  t("Machine Input–Output"),
  t("Data Sufficiency (reasoning)"),
  t("Logical / Critical Reasoning", "Statement & Assumption", "Course of Action", "Strengthen / Weaken argument", "Cause & Effect", "Inference"),
  t("Decision Making (eligibility-based)"),
  t("High-level & variable-based puzzles"),
];

// ── Quantitative ─────────────────────────────────────────────────────────────
export const QUANT_CORE = [
  t("Simplification & Approximation"),
  t("Number Series", "Missing term", "Wrong term"),
  t("Quadratic Equations"),
  t("Data Interpretation", "Table", "Bar", "Pie", "Line", "Caselet"),
  t("Arithmetic", "Percentage", "Ratio & Proportion", "Average & Ages", "Profit, Loss & Discount", "Simple & Compound Interest", "Partnership", "Time & Work, Pipes & Cisterns", "Speed, Time & Distance, Boats & Trains", "Mixture & Alligation", "Mensuration (basic)"),
];

export const DI_MAINS = [
  t("Advanced Data Interpretation", "Multi-set / mixed graph DI", "Missing-value DI", "Arithmetic & caselet DI", "Radar / funnel / tabular-chart DI"),
  t("Data Sufficiency (quant)"),
  t("Quantity I vs Quantity II comparison"),
  t("Probability"),
  t("Permutation & Combination"),
  t("Arithmetic word problems at Mains difficulty"),
];

// ── English ──────────────────────────────────────────────────────────────────
export const ENGLISH_CORE = [
  t("Reading Comprehension", "Fact-based", "Inference & tone", "Vocabulary in context"),
  t("Cloze Test"),
  t("Error Detection & Sentence Improvement"),
  t("Para Jumbles / Sentence Rearrangement"),
  t("Fillers", "Single", "Double"),
  t("Word Usage / Word Swap / Phrase Replacement"),
];

export const ENGLISH_MAINS_EXTRA = [
  t("Paragraph Completion & Odd Sentence Out"),
  t("Connectors & Sentence Joining"),
  t("Column-based sentence formation"),
];

export const DESCRIPTIVE_ENGLISH = [
  t("Essay writing", "Banking, economy, social and technology themes", "≈250 words, typed"),
  t("Letter writing", "Formal / business / complaint", "Informal (occasionally)"),
];

export const DESCRIPTIVE_ENGLISH_PRECIS = [
  t("Essay writing"),
  t("Précis writing"),
  t("Comprehension (descriptive answers)"),
];

// ── Awareness ────────────────────────────────────────────────────────────────
export const BANKING_AWARENESS = [
  t("Banking Awareness", "RBI functions & monetary policy tools (Repo, CRR, SLR, OMO)", "Types of banks & accounts", "Payment systems — UPI, NEFT, RTGS, IMPS", "NPAs, Basel norms, priority-sector lending", "Financial inclusion schemes"),
  t("Economy", "Union Budget & Economic Survey highlights", "Inflation, GDP, fiscal deficit basics", "Financial regulators — RBI, SEBI, IRDAI, PFRDA"),
  t("Current Affairs (last 6 months)", "Banking & financial news", "Government schemes", "Appointments, awards, summits, sports"),
  t("Static GK", "Capitals & currencies", "Important days", "Headquarters of organisations"),
];

export const INSURANCE_AWARENESS = [
  t("Insurance Awareness", "Principles of insurance (utmost good faith, indemnity, insurable interest, subrogation)", "Life vs general insurance products", "IRDAI regulations & recent circulars", "Government insurance schemes — PMJJBY, PMSBY, PMFBY, Ayushman Bharat", "Reinsurance basics"),
  t("Financial Market Awareness", "Money & capital markets", "SEBI, stock exchanges, mutual funds", "Pension — NPS, APY"),
  t("Current Affairs (last 6 months)", "Insurance & finance news", "Economy & schemes", "General current affairs"),
];

export const COMPUTER_KNOWLEDGE = [
  t("Computer fundamentals", "Generations, hardware & software", "Memory & storage", "Input / output devices"),
  t("Operating systems & file management"),
  t("MS Office — Word, Excel, PowerPoint"),
  t("Internet & networking", "Protocols, IP, DNS", "Network types & topologies"),
  t("Cyber security", "Malware, phishing, firewalls"),
  t("DBMS basics, shortcuts & abbreviations"),
];

// ── Regulator / DFI specialist papers ─────────────────────────────────────────
export const ESI = [
  t("Growth & Development", "Measurement of growth", "Poverty & unemployment", "Sustainable development"),
  t("Indian Economy", "Fiscal & monetary policy", "Inflation", "External sector & BoP"),
  t("Globalisation & international bodies", "IMF, World Bank, WTO, G20"),
  t("Social Structure in India", "Demographics", "Social justice & welfare schemes", "Education & health"),
];

export const FINANCE_MANAGEMENT = [
  t("Finance", "Financial system & markets", "Risk management in banking", "Basel III", "Financial statements & ratios", "Derivatives & forex basics", "FinTech, CBDC"),
  t("Management", "Theories of management & motivation", "Leadership", "Organisational behaviour", "Communication", "HRM & ethics"),
];

export const ARD = [
  t("Agriculture", "Agronomy & cropping systems", "Soil & water conservation", "Agricultural extension", "Animal husbandry, fisheries, forestry", "Agri-finance & marketing"),
  t("Rural Development", "Rural demographics & employment", "Panchayati Raj", "Rural development programmes", "Rural credit & cooperatives"),
];

export const INSURANCE_MANAGEMENT = [
  t("Insurance", "Principles & products", "Underwriting & claims", "Reinsurance", "Insurance regulation — IRDAI Act, Insurance Act 1938"),
  t("Management", "Principles of management", "Organisational behaviour", "Marketing & HR basics"),
];

export const COMMERCE_FINANCE_PAPER = [
  t("Commerce & Accountancy", "Accounting standards & Ind AS basics", "Financial statements", "Cost accounting"),
  t("Management", "Principles, OB, HRM"),
  t("Finance", "Financial markets", "Corporate finance", "Securities markets & regulation"),
  t("Companies Act & Economics basics"),
];

// ── Interview ────────────────────────────────────────────────────────────────
export const INTERVIEW_BANKING = [
  t("Personal & HR", "Introduce yourself", "Why banking after 4 years in software?", "Strengths, weaknesses, career plan", "Why not stay in IT at higher private pay?"),
  t("Banking awareness", "Current repo rate & recent MPC decisions", "NPAs, recovery tools (SARFAESI, IBC)", "Digital banking & UPI", "Priority-sector lending, financial inclusion"),
  t("Current & financial affairs", "Budget highlights", "Economic indicators", "Recent bank mergers / RBI circulars"),
  t("Situational", "Handling an angry customer", "Achieving targets ethically", "Rural posting, transfers"),
  t("Background-based", "EEE graduation fundamentals", "How technology (React, mobile apps) helps banks — digital channels, fraud detection"),
];

export const INTERVIEW_INSURANCE = [
  t("Personal & HR", "Introduce yourself", "Why insurance after IT?", "Career goals"),
  t("Insurance awareness", "Life vs general insurance", "IRDAI role & recent reforms", "Crop / health insurance schemes", "Claims & underwriting basics"),
  t("Current & financial affairs", "Budget, economy, insurance penetration"),
  t("Situational", "Claim disputes, fraud detection, customer service"),
  t("Background-based", "InsurTech, digital claims, data analytics"),
];

export const INTERVIEW_REGULATOR = [
  t("Personal & HR", "Career switch rationale", "Long-term goals in public policy"),
  t("Economy & policy", "Monetary policy transmission", "Inflation targeting", "Fiscal developments"),
  t("Domain", "Regulator's mandate & recent circulars", "Financial stability & supervision"),
  t("Current affairs", "Global & domestic economic events"),
  t("Background-based", "Technology in regulation — RegTech / SupTech, cybersecurity"),
];
