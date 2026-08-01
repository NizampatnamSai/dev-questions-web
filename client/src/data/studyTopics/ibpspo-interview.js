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

  // ── HR / PERSONAL (continued) ──────────────────────────────────────────────────
  {
    id: "ibpspo-int-hr-strengthweakness",
    category: "ibpspo-interview",
    topic: "HR / Personal",
    title: "Strengths, Weaknesses & Self-Awareness Questions",
    difficulty: "Intermediate",
    summary:
      "Answering the most predictable question in the interview without sounding rehearsed or evasive.",
    explanation:
      "The panel is not collecting a list of adjectives. They are testing whether you can assess yourself honestly and whether you have acted on what you found.\n\n" +
      "STRENGTHS — THE RULE\n" +
      "Name two, at most three, and EVIDENCE each with a specific incident. 'I am hardworking' is worthless. 'I coordinated a team of six for our final-year project and we were the only group to submit ahead of the deadline' is a strength with proof.\n" +
      "Choose strengths relevant to a PO's actual work: composure under pressure, accuracy with numbers, clarity in explaining things, willingness to take responsibility, adaptability to new places.\n\n" +
      "WEAKNESSES — WHERE MOST CANDIDATES FAIL\n" +
      "Two failure modes, both fatal:\n" +
      "1. The disguised boast — 'I work too hard', 'I am a perfectionist'. Panels have heard this thousands of times and read it as evasion.\n" +
      "2. The disqualifying admission — 'I am bad with numbers', 'I lose my temper'. Never name a weakness that is core to the role.\n" +
      "The correct shape: a REAL but non-disqualifying weakness, plus the concrete step you took, plus the evidence that it improved. 'I used to hesitate to speak in groups. I joined our college debate club in my third year, and by the final year I was presenting our project to external examiners. I am still more comfortable preparing before I speak than improvising, but I no longer avoid it.'\n" +
      "That answer is honest, shows action, and shows measured self-assessment — exactly what is being scored.\n\n" +
      "RELATED QUESTIONS TO PREPARE THE SAME WAY\n" +
      "- 'What is your biggest failure and what did you learn?'\n" +
      "- 'Tell us about a time you were criticised.'\n" +
      "- 'What would your friends say is your worst quality?'\n" +
      "All follow one structure: situation, your action, outcome, learning. Prepare three real incidents from your life and you can answer every variant.\n\n" +
      "TONE\n" +
      "Be matter-of-fact. Neither apologise for a weakness nor perform humility. Confidence in a bank interview reads as calm factual description of yourself, not as enthusiasm.",
    code: "Strength = claim + SPECIFIC evidence\n  weak : 'I am hardworking'\n  good : 'I coordinated a team of six; we submitted first'\n\nWeakness — avoid both traps:\n  disguised boast     'I am a perfectionist'      X\n  disqualifying       'I am bad with numbers'     X\n\nCorrect shape:\n  real weakness -> action taken -> evidence of change\n  -> honest note on where you still are\n\nPrepare THREE real incidents; they cover:\n  biggest failure | being criticised | a conflict\n  | a success | working under pressure\n\nStructure every behavioural answer as:\n  Situation -> Action -> Outcome -> Learning\n\nTone: factual and calm, not apologetic or performed.",
    interviewQuestion:
      "What is your greatest weakness, and what have you specifically done about it?",
  },
  {
    id: "ibpspo-int-hr-whythisbank",
    category: "ibpspo-interview",
    topic: "HR / Personal",
    title: "Why Banking, Why a PO & Why This Bank",
    difficulty: "Advanced",
    summary:
      "Demonstrating a considered choice rather than a default one — the question that decides many interviews.",
    explanation:
      "The panel's real concern is attrition. Officers who joined without conviction leave within two years, and the interview exists partly to filter them out.\n\n" +
      "WHY BANKING\n" +
      "Give reasons specific to banking that would not apply to any other government job. Strong angles:\n" +
      "- The sector sits at the centre of economic policy, so the work connects directly to national priorities such as financial inclusion and credit growth.\n" +
      "- The role combines analysis with people-facing work, which suits how you like to work.\n" +
      "- Rapid digital transformation makes it a technically interesting sector, not a static one.\n" +
      "Avoid: job security, salary, and 'it is a respectable job'. These are honest but signal exactly the default choice they are screening for.\n\n" +
      "WHY A PROBATIONARY OFFICER SPECIFICALLY\n" +
      "Show that you understand what the job IS. A PO rotates through branch operations, credit appraisal, customer relationship management and administration during probation, and takes on managerial responsibility early. Say that the breadth and the early responsibility are what attract you. Candidates who cannot describe the role are exposed instantly here.\n\n" +
      "WHY THIS BANK\n" +
      "If you have a bank in mind, know three concrete things: its size or reach, one recent initiative, and something about its history or focus. Connect one of them to yourself.\n" +
      "If you are appearing through a common recruitment process where allocation is not your choice, say so honestly and pivot: state that you would serve wherever allotted and explain what you would bring in any of them. Inventing a preference you cannot justify is worse than admitting the process decides.\n\n" +
      "THE FOLLOW-UP TO EXPECT\n" +
      "'If a private bank offered you more money tomorrow, would you leave?' Answer with the trade-off named honestly: the public sector's reach into underserved areas and the breadth of a PO's role matter to you more than the differential. Do not claim money is irrelevant to you — panels find that implausible.\n\n" +
      "PREPARATION\n" +
      "Write your answer out once, then reduce it to three bullet points and speak from those. A memorised paragraph delivered verbatim is obvious and is marked down for exactly that reason.",
    code: "Panel's real question: will you STAY?\n\nWhy banking — use sector-specific reasons:\n  central to economic policy / financial inclusion\n  analysis + people-facing work combined\n  fast digital transformation\n  AVOID: security, salary, 'respectable job'\n\nWhy PO — show you know the role:\n  rotation through branch ops, credit appraisal,\n  relationship management; early managerial charge\n\nWhy this bank — know THREE concrete facts:\n  reach/size | a recent initiative | history or focus\n  no choice in allocation? say so honestly and pivot\n\nExpect: 'private bank offers more money — you leave?'\n  name the trade-off honestly; never claim money\n  is irrelevant to you\n\nPrepare 3 bullets, not a memorised paragraph.",
    interviewQuestion:
      "Why do you want to be a Probationary Officer rather than a clerk or a specialist officer, and what does a PO actually do during probation?",
  },
  {
    id: "ibpspo-int-hr-goals",
    category: "ibpspo-interview",
    topic: "HR / Personal",
    title: "Career Goals, Relocation & Commitment Questions",
    difficulty: "Intermediate",
    summary:
      "Handling questions about your long-term plan, rural postings and competing exam attempts.",
    explanation:
      "These questions all probe one thing: will you actually take the job, stay in it, and go where you are sent.\n\n" +
      "LONG-TERM GOALS\n" +
      "Frame growth WITHIN banking. A credible answer names the near term and the direction: master branch operations and credit appraisal in the first few years, then move towards a specialisation such as credit, rural banking or digital transformation, and take on branch leadership in time.\n" +
      "Avoid two extremes: 'I want to be Chairman' sounds unserious, and 'I have not thought about it' sounds uncommitted. Also avoid naming goals outside banking.\n\n" +
      "ARE YOU PREPARING FOR OTHER EXAMS?\n" +
      "If you are, be honest — the panel usually already suspects it from your profile, and being caught out is far more damaging than the admission. The recoverable answer states that banking is your considered choice now and explains why, without claiming you have never sat another exam. Denying an obvious parallel attempt is the single most common way candidates lose credibility.\n\n" +
      "RURAL POSTING AND RELOCATION\n" +
      "Expect it, and answer without hedging. A PO will be posted to rural or semi-urban branches, and reluctance here is disqualifying.\n" +
      "The strong version goes beyond 'yes I am willing': explain that rural branches are where financial inclusion actually happens, that you will handle KCC lending, self-help groups and Jan Dhan accounts directly, and that this gives more real banking exposure than a metro branch would in the same period. That converts a compliance answer into an enthusiasm answer.\n\n" +
      "FAMILY AND PERSONAL CONSTRAINTS\n" +
      "If asked whether your family supports relocation, answer plainly that they do. If there is a genuine constraint, state it factually without making it the panel's problem to solve.\n\n" +
      "'WHAT IF YOU ARE NOT SELECTED?'\n" +
      "The answer that works: you would seek feedback, identify the gap, and reattempt, while continuing to build relevant skills in the meantime. Never say you would give up, and never say you would be devastated.",
    code: "All these questions test: will you TAKE it, STAY,\nand GO where sent?\n\nLong-term goals — inside banking, with direction:\n  near term: branch ops + credit appraisal\n  then: specialise (credit / rural / digital)\n  then: branch leadership\n  avoid 'I want to be Chairman' and 'not thought about it'\n\nOther exams: be HONEST. Being caught denying an\nobvious parallel attempt destroys credibility.\n\nRural posting — never hedge. Strong version:\n  rural = where financial inclusion actually happens\n  KCC, SHGs, Jan Dhan handled directly\n  more real exposure than a metro branch\n\n'If not selected?' -> seek feedback, close the gap,\nreattempt, keep building skills. Never 'I'd give up'.",
    interviewQuestion:
      "You are from a metro city. Would you be willing to serve in a remote rural branch for three years, and what would you expect to learn there?",
  },

  // ── BANKING CONCEPTS (continued) ───────────────────────────────────────────────
  {
    id: "ibpspo-int-bank-accountskyc",
    category: "ibpspo-interview",
    topic: "Banking Concepts",
    title: "Types of Accounts, KYC & Customer Onboarding",
    difficulty: "Basic",
    summary:
      "The day-one operational knowledge a PO is assumed to have at the counter.",
    explanation:
      "Panels test whether you understand the products you would actually be handling from your first week.\n\n" +
      "DEPOSIT ACCOUNTS\n" +
      "- Savings account: for individuals, interest-bearing, with restrictions on transaction frequency.\n" +
      "- Current account: for businesses, no interest, unrestricted transactions, overdraft facility available.\n" +
      "- Fixed deposit: a lump sum locked for a fixed tenure at a fixed rate, with a penalty for premature withdrawal.\n" +
      "- Recurring deposit: a fixed sum deposited monthly for a set period.\n" +
      "- BSBDA (Basic Savings Bank Deposit Account): the zero-minimum-balance account underpinning financial inclusion, with limited free services.\n" +
      "- NRE and NRO accounts for non-residents. The key distinction: NRE holds foreign earnings, is fully repatriable and its interest is tax-free in India; NRO holds income earned in India, with limited repatriation and taxable interest. This distinction is asked constantly.\n\n" +
      "KYC — KNOW YOUR CUSTOMER\n" +
      "Mandated by the RBI under PML Act obligations. Three components: customer identification, customer due diligence, and ongoing monitoring of transactions.\n" +
      "Officially Valid Documents establish identity and address. Periodic re-KYC is required, with frequency depending on the customer's risk classification — high, medium or low risk.\n" +
      "Purpose: preventing money laundering, terrorist financing, benami accounts and identity fraud. If asked 'why does KYC matter', answer with the risk it prevents, not the paperwork it requires.\n\n" +
      "AML AND SUSPICIOUS TRANSACTIONS\n" +
      "Banks report prescribed cash transactions and any suspicious transaction to the Financial Intelligence Unit (FIU-IND). A PO is expected to recognise red flags: transaction patterns inconsistent with the stated profile, structured deposits just under reporting thresholds, and sudden high-value activity in a dormant account.\n\n" +
      "PRACTICAL FRAMING\n" +
      "Interviewers often ask you to explain a product to a customer rather than define it. Practise saying each of these in one plain sentence with no jargon — that is what is actually being scored.",
    code: "Deposits:\n  savings   individuals, interest, limited transactions\n  current   business, NO interest, unlimited, OD available\n  FD        lump sum, fixed tenure, premature penalty\n  RD        fixed monthly instalments\n  BSBDA     zero balance, inclusion account\n\nNRE vs NRO   <- asked constantly\n  NRE  foreign earnings | fully repatriable | tax-free interest\n  NRO  Indian income    | limited repatriation | taxable\n\nKYC = identification + due diligence + ongoing monitoring\n  OVDs establish identity/address\n  re-KYC frequency by risk: high / medium / low\n  purpose: AML, terror financing, benami, identity fraud\n\nAML red flags: profile mismatch, structuring just under\nthresholds, sudden activity in a dormant account\n  -> reported to FIU-IND\n\nPractise explaining each in ONE jargon-free sentence.",
    interviewQuestion:
      "A customer asks why you need documents again when they have banked with you for ten years. How do you explain re-KYC?",
  },
  {
    id: "ibpspo-int-bank-digital",
    category: "ibpspo-interview",
    topic: "Banking Concepts",
    title: "Digital Banking: UPI, NEFT, RTGS & Payment Systems",
    difficulty: "Intermediate",
    summary:
      "The payment rails a PO explains daily, and the fraud risks that come with them.",
    explanation:
      "India's payment infrastructure is a point of national pride and a guaranteed interview topic.\n\n" +
      "THE TRANSFER MECHANISMS\n" +
      "- NEFT: settles in batches, no minimum or maximum prescribed by the RBI, available round the clock.\n" +
      "- RTGS: real-time gross settlement, used for HIGH-VALUE transfers with a prescribed minimum, settled individually and immediately rather than batched.\n" +
      "- IMPS: instant interbank transfer through NPCI, available 24x7, including on holidays.\n" +
      "- UPI: instant transfer built on IMPS rails using a Virtual Payment Address, so no account number or IFSC is shared. Operated by NPCI.\n" +
      "The distinction most often asked: RTGS is real-time and gross (each transaction settled individually), while NEFT is deferred and net (settled in batches).\n\n" +
      "NPCI AND ITS PRODUCTS\n" +
      "The National Payments Corporation of India runs UPI, IMPS, RuPay, NACH, AePS (Aadhaar-enabled Payment System, which allows withdrawals using biometrics — crucial for rural inclusion), BHIM, and FASTag. If you are asked which body owns UPI, the answer is NPCI, not the RBI.\n\n" +
      "WHY UPI MATTERS\n" +
      "Interoperable across banks and apps, near-zero cost to users, works on feature phones through UPI 123Pay, and has become a template other countries are adopting. Being able to say why it succeeded — interoperability plus zero merchant cost plus a simple addressing layer — marks you out from candidates who only list features.\n\n" +
      "FRAUD AND CUSTOMER PROTECTION\n" +
      "Know the common frauds: phishing links, vishing calls impersonating bank staff, SIM swap, QR-code scams where the victim is made to SCAN to receive money (scanning only ever SENDS money — a point you should be able to explain to a customer), and remote-access app installations.\n" +
      "Know the customer's position: under the RBI's limited-liability framework, a customer who reports an unauthorised electronic transaction promptly bears reduced or zero liability, with liability rising the longer the delay. Report through the bank first, then the Banking Ombudsman under the RBI's integrated scheme if unresolved, and the national cybercrime helpline for fraud.\n\n" +
      "AS A PO\n" +
      "You will be expected to counsel customers on safety: never share OTP, PIN or CVV; bank staff never ask for them; verify before scanning any QR code.",
    code: "Transfers:\n  NEFT  batch (deferred NET) settlement, 24x7\n  RTGS  real time GROSS, high value, prescribed minimum\n  IMPS  instant interbank via NPCI, 24x7\n  UPI   instant, VPA-based (no account number shared)\n\n  Most-asked: RTGS = real-time + gross\n              NEFT = deferred + net (batched)\n\nNPCI owns: UPI, IMPS, RuPay, NACH, AePS, BHIM, FASTag\n  (UPI is NPCI's, not the RBI's)\n\nWhy UPI worked: interoperability + zero user cost +\n  simple addressing + UPI 123Pay for feature phones\n\nFraud: phishing, vishing, SIM swap, QR scams,\n  remote-access apps\n  KEY LINE: scanning a QR only ever SENDS money\n\nLimited liability: report promptly -> reduced/zero\n  liability; it rises with delay\nEscalation: bank -> Banking Ombudsman (RBI scheme)",
    interviewQuestion:
      "A customer was told to scan a QR code to receive a refund and lost money. Explain what actually happened and what the bank's liability position is.",
  },
  {
    id: "ibpspo-int-bank-credit",
    category: "ibpspo-interview",
    topic: "Banking Concepts",
    title: "Credit Appraisal, CIBIL & Negotiable Instruments",
    difficulty: "Advanced",
    summary:
      "How a bank decides to lend, and the cheque and instrument rules a PO applies at the counter.",
    explanation:
      "CREDIT APPRAISAL — THE FIVE Cs\n" +
      "The standard framework for judging a borrower, and a very common interview prompt:\n" +
      "- Character: repayment history and integrity, read largely from the credit report.\n" +
      "- Capacity: income and cash flow relative to the proposed instalment.\n" +
      "- Capital: the borrower's own stake in the venture.\n" +
      "- Collateral: security available if repayment fails.\n" +
      "- Conditions: the purpose of the loan and the state of the sector and economy.\n" +
      "If asked 'how would you decide on a loan application', walk through these five in order. It shows structured thinking rather than instinct.\n\n" +
      "CREDIT INFORMATION\n" +
      "CIBIL and other credit bureaus maintain repayment histories and produce a score, broadly in a 300-900 range, where higher is better. A score reflects repayment discipline, credit utilisation, the mix of secured and unsecured credit, and the number of recent enquiries. A high score does not by itself guarantee sanction — capacity still governs.\n\n" +
      "NEGOTIABLE INSTRUMENTS\n" +
      "Governed by the Negotiable Instruments Act 1881. The three instruments are the promissory note, the bill of exchange and the cheque.\n" +
      "Cheque essentials a PO applies daily:\n" +
      "- Validity is three months from the date of issue.\n" +
      "- A post-dated cheque cannot be paid before its date; a stale cheque is one presented after validity expires.\n" +
      "- Crossing: a general crossing means it must be paid into an account rather than over the counter; 'account payee' restricts it to the named payee's account.\n" +
      "- Endorsement transfers the instrument; a bearer cheque passes by delivery.\n" +
      "- Dishonour for insufficient funds attracts penal consequences under section 138 of the Act — worth knowing by name.\n\n" +
      "NPA LINKAGE\n" +
      "Appraisal quality determines asset quality later. If a panel asks how to reduce NPAs, the strong answer starts before sanction — rigorous appraisal, end-use monitoring, and early identification through the SMA classification — rather than jumping straight to recovery mechanisms.\n\n" +
      "AS A PO\n" +
      "You may be asked to reconcile lending targets with prudence. The answer they want: targets never justify diluting appraisal, because a bad loan costs the bank far more than a missed target.",
    code: "Five Cs of credit:\n  Character  repayment history, integrity\n  Capacity   income / cash flow vs instalment\n  Capital    borrower's own stake\n  Collateral security if repayment fails\n  Conditions purpose, sector and economy\n\nCredit score: ~300-900, higher is better\n  driven by repayment record, utilisation, credit mix,\n  recent enquiries — but capacity still governs sanction\n\nNegotiable Instruments Act 1881:\n  promissory note | bill of exchange | cheque\n  cheque validity: 3 months from date\n  post-dated: not payable before the date\n  general crossing -> into an account only\n  account payee   -> named payee's account only\n  dishonour for insufficient funds -> section 138\n\nReducing NPAs starts BEFORE sanction:\n  appraisal -> end-use monitoring -> SMA early warning\n  (recovery is the last resort, not the answer)",
    interviewQuestion:
      "A customer with an excellent credit score applies for a business loan, but their cash flow barely covers the EMI. Would you sanction it, and on what basis?",
  },

  // ── SITUATIONAL SCENARIOS (continued) ──────────────────────────────────────────
  {
    id: "ibpspo-int-sit-fraudethics",
    category: "ibpspo-interview",
    topic: "Situational Scenarios",
    title: "Ethical Dilemmas: Fraud, Pressure & Improper Instructions",
    difficulty: "Advanced",
    summary:
      "Scenarios testing integrity — including when the pressure comes from your own senior.",
    explanation:
      "These are the highest-stakes situational questions. The panel is checking whether you will protect the bank's interest when it is uncomfortable to do so.\n\n" +
      "THE ANSWER STRUCTURE THAT WORKS\n" +
      "1. State the principle briefly — rules and the bank's interest come first.\n" +
      "2. Describe the graded action you would take, starting with the least confrontational.\n" +
      "3. Name the escalation path if it is not resolved.\n" +
      "4. Avoid both extremes: neither blind compliance nor dramatic confrontation.\n\n" +
      "SCENARIO: A SENIOR ASKS YOU TO BYPASS A PROCEDURE\n" +
      "Do not say 'I would refuse and report him.' Do not say 'I would comply since he is senior.' The graded answer: politely seek the reason, since there may be a legitimate approval you are unaware of; request the instruction in writing or over email; if it remains irregular, decline courteously and escalate to the branch head or the compliance channel.\n" +
      "Asking for the instruction in writing is the specific detail that marks a mature answer, because it resolves most such situations without a confrontation.\n\n" +
      "SCENARIO: YOU SUSPECT A CUSTOMER OF FRAUD\n" +
      "Do not accuse. Complete the transaction only if it is within the rules, record your observations, and report through the internal suspicious transaction process — the decision belongs to the designated officer and the FIU, not to you at the counter. Confidentiality matters: tipping off the customer is itself a violation.\n\n" +
      "SCENARIO: YOU MADE THE MISTAKE\n" +
      "Own it immediately and completely. Report it to your senior at once, contain the damage, correct the record, and note what control would prevent a recurrence. Panels rate a candidate who reports their own error far above one who describes managing it quietly. Concealing an error is treated as the more serious offence in banking, and saying that explicitly earns you marks.\n\n" +
      "SCENARIO: TARGET PRESSURE\n" +
      "Asked to mis-sell an insurance product to meet a target, the answer is that mis-selling creates a complaint, a reversal and reputational damage that outweigh the target, and that you would instead identify customers for whom the product genuinely fits, and raise the target's feasibility with your manager.\n\n" +
      "THE UNDERLYING TEST\n" +
      "Every one of these asks: do you understand that a bank runs on trust and that a PO is custodian of public money? Say that in one line and the specific answer follows naturally.",
    code: "Answer structure:\n  1. principle (rules + bank's interest)\n  2. graded action, least confrontational first\n  3. escalation path\n  4. neither blind compliance nor confrontation\n\nSenior asks you to bypass a procedure:\n  ask the reason -> request it IN WRITING ->\n  decline courteously -> escalate to branch head/compliance\n  ('in writing' is the detail that marks maturity)\n\nSuspected customer fraud:\n  do NOT accuse | do NOT tip off (a violation)\n  record observations -> internal STR process -> FIU\n\nYour own mistake:\n  report immediately, contain, correct, add a control\n  concealment is the MORE serious offence\n\nTarget pressure / mis-selling:\n  complaint + reversal + reputation > the target\n  find genuine fits, raise feasibility with the manager\n\nUnderlying line: a PO is a custodian of public money.",
    interviewQuestion:
      "Your branch manager asks you to process a loan disbursement before one mandatory document is received, promising it will arrive tomorrow. What do you do?",
  },
  {
    id: "ibpspo-int-sit-operations",
    category: "ibpspo-interview",
    topic: "Situational Scenarios",
    title: "Branch Operations Under Pressure",
    difficulty: "Intermediate",
    summary:
      "Crowd management, system failures, staff conflict and the practical crises of a working branch.",
    explanation:
      "These test judgement and prioritisation rather than ethics. The panel wants to see that you would act rather than freeze, and that you would think about the queue as well as the person in front of you.\n\n" +
      "SCENARIO: THE SERVER IS DOWN AND THE BRANCH IS FULL\n" +
      "Announce the situation to the whole hall immediately rather than letting people discover it one at a time — uncertainty is what turns a queue into a crowd. Give a realistic estimate, not a hopeful one. Identify what can still be done offline or manually, prioritise urgent cases such as medical or travel needs, and escalate to IT with a clear description. Keep updating the hall even when there is nothing new; silence is read as indifference.\n\n" +
      "SCENARIO: A LONG QUEUE WITH AN ELDERLY OR DISABLED CUSTOMER WAITING\n" +
      "Senior citizens and differently-abled customers are entitled to priority service. Act on it, and explain briefly to the queue so it is seen as policy rather than favouritism.\n\n" +
      "SCENARIO: A COLLEAGUE IS NOT COOPERATING\n" +
      "Speak to them directly and privately first, framed around the work rather than the person. Understand whether there is a workload or personal reason. Involve the manager only if it continues to affect service. Never escalate before speaking to the colleague, and never discuss it with other staff.\n\n" +
      "SCENARIO: A CUSTOMER DEMANDS SOMETHING THE RULES FORBID\n" +
      "Explain the rule and, crucially, the REASON behind it. Then offer the nearest legitimate alternative. 'It is not allowed' closes the conversation and produces a complaint; 'here is why, and here is what we can do' resolves most cases.\n\n" +
      "SCENARIO: CASH SHORTAGE AT DAY END\n" +
      "Recount, check the vouchers and the system entries, and report to the manager immediately regardless of the amount. Never make it up from your own pocket to avoid a report — that is a serious disciplinary matter, and panels sometimes probe this specifically.\n\n" +
      "THE GENERAL PATTERN\n" +
      "Acknowledge, communicate, act within your authority, escalate what is beyond it, and follow up. State that sequence and then apply it to the specific scenario — it works for every operational situation they can pose.",
    code: "General pattern for ANY operational scenario:\n  acknowledge -> communicate -> act within authority\n  -> escalate beyond it -> follow up\n\nServer down, hall full:\n  announce to EVERYONE at once (uncertainty -> crowd)\n  realistic estimate | do what is possible offline\n  prioritise urgent cases | escalate to IT\n  keep updating even with no news\n\nPriority service: senior citizens and differently-abled\n  -> act on it AND explain to the queue\n\nColleague conflict:\n  private, direct, about the WORK first\n  manager only if service is affected\n  never discuss with other staff\n\nCustomer demands a rule-breach:\n  explain the rule + the REASON + the nearest alternative\n\nCash short at day end:\n  recount, check vouchers, report IMMEDIATELY\n  NEVER cover it from your own pocket",
    interviewQuestion:
      "It is 3 pm on a pension day, your system has been down for 40 minutes and the hall is full of elderly customers. Walk us through exactly what you do.",
  },

  // ── CURRENT AFFAIRS & ECONOMY ──────────────────────────────────────────────────
  {
    id: "ibpspo-int-ca-preparation",
    category: "ibpspo-interview",
    topic: "Current Affairs & Economy",
    title: "How to Prepare Current Affairs for the Interview",
    difficulty: "Intermediate",
    summary:
      "What to follow, how far back to go, and how to answer when you genuinely do not know.",
    explanation:
      "The interview tests awareness differently from the written exam. Panels rarely want a date — they want to know whether you follow the sector and can reason about it.\n\n" +
      "WHAT TO COVER\n" +
      "- Banking and RBI developments over the last six months: policy decisions, regulatory changes, major mergers or licences.\n" +
      "- The most recent Union Budget and Economic Survey, at the level of themes and major allocations rather than every figure.\n" +
      "- Current policy rates and the latest inflation and growth prints. Know the direction and the approximate level; panels forgive a rounding error but not ignorance of the direction.\n" +
      "- Major national and international events with an economic dimension.\n" +
      "- Anything in the news about the specific bank you are interviewing for.\n\n" +
      "HOW TO FOLLOW IT\n" +
      "One national daily's business pages daily, plus the RBI's own press releases for policy. A monthly current-affairs compilation is useful for consolidation but should not be your only source — panels can tell when knowledge is compiled rather than followed, because compiled knowledge collapses at the first follow-up question.\n\n" +
      "YOUR OWN BACKGROUND\n" +
      "Be ready for questions on your home state and district: its major industry, crops, a notable feature, its district collector or chief minister. Also on your academic subject — a graduate in any discipline can be asked to connect it to banking, and being unable to discuss your OWN degree is the worst impression available.\n\n" +
      "WHEN YOU DO NOT KNOW\n" +
      "Say so, briefly and without apology: 'I am not sure of that, sir. I have not followed that development closely.' Then stop.\n" +
      "Do not guess, do not bluff, and do not pad the silence — a wrong confident answer costs far more than an admitted gap, and panels routinely follow up on an invented answer specifically to expose it. Admitting one gap cleanly and answering the next question well leaves a better impression than a shaky answer to both.\n\n" +
      "OPINION QUESTIONS\n" +
      "'What do you think about digital currency?' calls for a balanced answer: state the case each way, then give your view with a reason. Panels are testing balance, not allegiance. Avoid political positions entirely — comment on the economic dimension of a policy, never on the party behind it.",
    code: "Cover:\n  banking/RBI last 6 months | latest Budget + Economic Survey\n  current policy rates, inflation and growth (direction + level)\n  major national/international economic events\n  news about the specific bank you are facing\n\nSources: a daily business page + RBI press releases\n  compilations consolidate; they cannot replace following\n  (compiled knowledge fails at the first follow-up)\n\nAlso prepare: your home state/district, your degree subject\n  being unable to discuss your OWN degree is the worst look\n\nDon't know? -> say so briefly, then STOP\n  no guessing, no bluffing, no padding\n  an invented answer invites a targeted follow-up\n\nOpinion questions: both sides, then your view with a reason\n  economic dimension only — never the politics",
    interviewQuestion:
      "What is your view on the RBI's most recent monetary policy decision, and how would it affect lending at a branch like the one you would join?",
  },
];
