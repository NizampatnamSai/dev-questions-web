// Quick-revision sheet for the IBPS PO Prelims syllabus — English usage rules
// and Quantitative Aptitude formulas. Rendered by the "Formulas & Rules" tab in
// IbpsPoPrep.jsx. Kept as plain data so it stays greppable and easy to extend.

export const ENGLISH_RULES = [
  {
    group: "HAS vs HAVE — 10 rules",
    // `important` puts an IMPORTANT badge on the group; this one decides more
    // Error Spotting marks than any other single agreement rule.
    important: true,
    rows: [
      { topic: "Rule 1 · Singular subject", rule: "Singular subject → **has**", example: "He **has** a car. · Ram **has** gone home. · The boy **has** arrived.", trick: "One person or thing → has" },
      { topic: "Rule 2 · Plural subject", rule: "Plural subject → **have**", example: "They **have** finished. · The boys **have** arrived. · The books **have** been returned.", trick: "More than one → have" },
      { topic: "Rule 3 · I and You", rule: "I and You always take **have**", example: "I **have** · You **have**", trick: "Never \"I has\" or \"you has\" — the one exception to the singular rule" },
      { topic: "Rule 4 · Each / Every / Either / Neither", rule: "All four are singular → **has**", example: "Each student **has** · Every player **has** · Either boy **has** · Neither girl **has**", trick: "They mean \"one at a time\", however many follow" },
      { topic: "Rule 5 · Collective nouns", rule: "Acting as ONE unit → **has**", example: "The team **has** won the match. · The committee **has** submitted its report. · The family **has** moved.", trick: "IBPS prefers HAS for team, committee, family" },
      { topic: "Rule 6 · Collective acting individually", rule: "Members acting separately → **have**", example: "The team **have** changed their jerseys.", trick: "Mostly British English — rare in IBPS, which normally wants has" },
      { topic: "Rule 7 · There is / There are", rule: "Verb follows what comes AFTER \"there\"", example: "There **has** been an accident. · There **have** been many accidents.", trick: "\"There\" is not the subject — look past it" },
      { topic: "Rule 8 · Present perfect", rule: "Subject + **has/have** + V3", example: "He **has** eaten. · They **have** eaten.", trick: "Third form of the verb, never the past tense (not \"has ate\")" },
      { topic: "Rule 9 · One of the …", rule: "\"One of the …\" → **has**", example: "One of the students **has** qualified.", trick: "The verb follows \"one\", not the plural noun after it" },
      { topic: "Rule 10 · Uncountable nouns", rule: "Uncountable → **has**", example: "Water **has** · Information **has** · Furniture **has** · Advice **has** · News **has**", trick: "Never \"informations\" / \"advices\" either" },
      { topic: "Memory trick", rule: "**has** → He, She, It, Ram, Committee, Team", example: "**have** → I, You, We, They", trick: "If you can replace the subject with \"he\" use has; with \"they\" use have" },
    ],
  },
  {
    // A wrong-vs-correct list, because these are recognition errors: the wrong
    // form SOUNDS right, so a rule stated in the abstract does not stick. Nearly
    // all are the same mistake — adding a preposition to a verb that is already
    // transitive.
    group: "Revision Notebook — Wrong ✗ vs Correct ✓",
    important: true,
    rows: [
      { topic: "Discuss", rule: "✗ Discuss **about** → ✓ Discuss", example: "We discussed the issue.", trick: "Discuss already means \"talk about\"" },
      { topic: "Order", rule: "✗ Order **for** → ✓ Order", example: "He ordered food.", trick: "Only the noun takes for: \"an order for 50 units\"" },
      { topic: "Enter", rule: "✗ Enter **into** the room → ✓ Enter the room", example: "She entered the room.", trick: "But \"enter into\" IS correct for agreements: enter into a contract" },
      { topic: "Reach", rule: "✗ Reach **to** → ✓ Reach", example: "I reached home at six.", trick: "Reach = direct, no preposition" },
      { topic: "Return", rule: "✗ Return **back** → ✓ Return", example: "He returned from Delhi.", trick: "\"Back\" is already inside return" },
      { topic: "Repeat", rule: "✗ Repeat **again** → ✓ Repeat", example: "Please repeat the question.", trick: "Same redundancy as return back" },
      { topic: "Cope", rule: "✗ Cope **up** with → ✓ Cope **with**", example: "She coped with the pressure.", trick: "\"Cope up\" is never correct in any sense" },
      { topic: "Comprise", rule: "✗ Comprise **of** → ✓ Comprise", example: "The team comprises five members.", trick: "But: is **composed of** / consists **of**" },
      { topic: "Emphasise", rule: "✗ Emphasise **on** → ✓ Emphasise", example: "He emphasised the need for reform.", trick: "The NOUN takes on: \"laid emphasis on\"" },
      { topic: "Investigate", rule: "✗ Investigate **into** → ✓ Investigate", example: "Police investigated the matter.", trick: "Noun again: \"an investigation into\"" },
      { topic: "Resemble", rule: "✗ Resemble **to** → ✓ Resemble", example: "He resembles his father.", trick: "Also: marry (not marry with), but married **to** as an adjective" },
      { topic: "Accompany", rule: "✗ Accompanied **with** a person → ✓ Accompanied **by**", example: "She was accompanied by her brother.", trick: "**by** a person, **with** a thing" },
      { topic: "Explain", rule: "✗ Explain **me** → ✓ Explain **to me**", example: "Explain the rule to me.", trick: "Same for describe, suggest, announce" },
      { topic: "Attend", rule: "✗ Attend **to** the meeting → ✓ Attend the meeting", example: "He attended the meeting.", trick: "\"Attend to\" is valid but means to look after someone" },
    ],
  },
  {
    group: "Prepositions — the ones IBPS tests every year",
    rows: [
      { topic: "Reach", rule: "Reach takes **no preposition**", example: "I reached home.", trick: "Reach = direct" },
      { topic: "Arrive", rule: "Arrive **at / in**", example: "Arrive at school / in Delhi", trick: "Small place = at, city/country = in" },
      { topic: "Discuss", rule: "No \"about\"", example: "Discuss the issue", trick: "Discuss already means \"talk about\"" },
      { topic: "Order", rule: "VERB takes no preposition; **in order to** = purpose", example: "He ordered food. · **In order to** study, she left early. · (noun) an order **for** 50 units", trick: "Only the NOUN takes \"for\" — the verb never does" },
      { topic: "Married", rule: "Married **to**", example: "Married to Riya", trick: "Relationship → TO" },
      { topic: "Prefer", rule: "Prefer A **to** B", example: "Prefer tea to coffee", trick: "Never \"prefer than\"" },
      { topic: "Senior", rule: "Senior **to**", example: "Senior to me", trick: "Same for junior, superior, inferior" },
      { topic: "Good", rule: "Good **at**", example: "Good at Maths", trick: "Skill → at" },
      { topic: "Capable", rule: "Capable **of**", example: "Capable of solving", trick: "\"Of\" is fixed" },
      { topic: "Different", rule: "Different **from**", example: "Different from mine", trick: "Not \"than\"" },
    ],
  },
  {
    group: "Subject–verb agreement",
    rows: [
      { topic: "Each / Every", rule: "Singular verb", example: "Each student **has**", trick: "Think \"one by one\"" },
      { topic: "Neither / Either", rule: "Singular verb", example: "Neither boy **has**", trick: "Singular subject" },
      { topic: "Either…or / Neither…nor", rule: "Verb agrees with the **nearer** subject", example: "Neither he nor they **are** coming", trick: "Look at the noun just before the verb" },
      { topic: "Collective nouns", rule: "Police, cattle, people, clergy take a **plural** verb", example: "The police **are** investigating", trick: "Appeared in the real 2023 paper" },
      { topic: "\"A number of\" vs \"The number of\"", rule: "A number of → plural; The number of → singular", example: "A number of students **were** … / The number of students **was** …", trick: "\"The\" makes it one figure" },
      { topic: "Distance / money / time", rule: "Treated as one unit → singular", example: "Ten kilometres **is** a long walk", trick: "One quantity, not many" },
    ],
  },
  {
    group: "Uncountable nouns — never take a plural or \"a/an\"",
    rows: [
      { topic: "Furniture", rule: "Uncountable", example: "Furniture **is**", trick: "Never \"are\"" },
      { topic: "News", rule: "Singular", example: "News **is**", trick: "Always singular" },
      { topic: "Advice", rule: "Uncountable", example: "Advice **is**", trick: "Never \"advices\"" },
      { topic: "Information", rule: "Uncountable", example: "Information **is**", trick: "Never \"informations\"" },
      { topic: "Luggage / baggage", rule: "Uncountable", example: "The luggage **is** heavy", trick: "Use \"pieces of luggage\"" },
      { topic: "Equipment / machinery", rule: "Uncountable", example: "The equipment **was** new", trick: "Never \"equipments\"" },
      { topic: "Scenery / stationery", rule: "Uncountable", example: "The scenery **is** beautiful", trick: "Never \"sceneries\"" },
    ],
  },
  {
    group: "High-frequency traps",
    rows: [
      { topic: "Comprise", rule: "No \"of\"", example: "The team comprises five members", trick: "But: is composed **of**" },
      { topic: "Since / For", rule: "Since = point of time; For = period", example: "Since 2020 / For two years", trick: "Since → a date, For → a length" },
      { topic: "Between / Among", rule: "Between = two; Among = more than two", example: "Between you and me / Among the five", trick: "Count the nouns" },
      { topic: "Less / Fewer", rule: "Less = uncountable; Fewer = countable", example: "Less water / Fewer bottles", trick: "Can you count it?" },
      { topic: "Hardly / Scarcely", rule: "Followed by **when**, never \"than\"", example: "Hardly had he left when it rained", trick: "No sooner … **than**" },
      { topic: "Cope", rule: "Cope **with**", example: "Cope with pressure", trick: "Never \"cope up with\"" },
      { topic: "One of the…", rule: "Takes a **plural** noun, **singular** verb", example: "One of the boys **is** absent", trick: "Verb follows \"one\"" },
      { topic: "Both … and", rule: "Never \"both … as well as\"", example: "Both Ram and Shyam", trick: "Pick one structure" },
    ],
  },
];

// Reasoning has no "formulas" as such, but it does have hard rules and fixed
// conventions that decide marks — the direction your left hand points at a
// circular table is not something to re-derive with 20 minutes on the clock.
export const REASONING_RULES = [
  {
    group: "Seating — which way is left?",
    important: true,
    items: [
      { name: "⭐ Facing the CENTRE", formula: "Your LEFT = clockwise · your RIGHT = anticlockwise", note: "The single most common source of a wrecked puzzle. Mark it on the diagram before placing anyone." },
      { name: "⭐ Facing OUTWARD", formula: "Your LEFT = anticlockwise · your RIGHT = clockwise", note: "Exactly reversed. In a mixed-facing puzzle, write each person's facing next to them." },
      { name: "Linear row facing NORTH", formula: "Your left = the viewer's left (west); your right = east" },
      { name: "Linear row facing SOUTH", formula: "Everything flips — your left is the viewer's RIGHT", note: "Two rows facing each other means one row is always reversed." },
      { name: "\"Between\" vs \"exactly between\"", formula: "\"Between\" = anywhere in the gap; \"exactly between\" = the midpoint", note: "\"Immediately\" always means adjacent, no gap." },
    ],
  },
  {
    group: "Order & Ranking",
    items: [
      { name: "Total from both ends", formula: "Total = (position from left) + (position from right) − 1", note: "The −1 is because the person is counted twice." },
      { name: "People between two positions", formula: "|difference of positions| − 1" },
      { name: "Position from the other end", formula: "Position from right = Total − (position from left) + 1" },
    ],
  },
  {
    group: "Alphabet & Alphanumeric Series",
    items: [
      { name: "⭐ EJOTY", formula: "E=5 · J=10 · O=15 · T=20 · Y=25", note: "Count forward or back from the nearest of these instead of reciting from A. The single best time-saver in this topic." },
      { name: "Opposite letter", formula: "Opposite of position n = 27 − n", note: "A↔Z, B↔Y, M↔N. Check: A=1 → 27−1 = 26 = Z." },
      { name: "Positions", formula: "A=1 … M=13, N=14 … Z=26" },
    ],
  },
  {
    group: "Inequalities",
    important: true,
    items: [
      {
        name: "⭐ Golden rule — what ≥ actually lets you conclude",
        formula: "Derived A ≥ B  ⇒  \"A ≥ B\" follows ✓ · \"A > B\" does NOT ✗ · \"A = B\" does NOT ✗",
        note: "Mirror for ≤: only \"A ≤ B\" follows; neither \"A < B\" nor \"A = B\" does. This one rule accounts for most wrong answers in the topic.",
      },
      {
        name: "⭐ The table to memorise",
        formula:
          "A > B ⇒ A ≥ B ✓   ·   A > B ⇒ A = B ✗\n" +
          "A ≥ B ⇒ A > B ✗   ·   A ≥ B ⇒ A = B ✗\n" +
          "A < B ⇒ A ≤ B ✓   ·   A ≤ B ⇒ A < B ✗   ·   A ≤ B ⇒ A = B ✗",
        note: "One pattern behind all seven rows: you may only ever WEAKEN a relation. Strict ⇒ non-strict (> gives ≥, < gives ≤) is the only move that ever follows; going the other way, or extracting = from either, never does.",
      },
      {
        name: "Why — the closed box",
        formula: "A ≥ B is a box holding TWO possibilities: (A > B) OR (A = B)",
        note: "You never learn which one is inside, so you cannot claim either individually. A conclusion \"follows\" only if it is true in EVERY possibility the statements allow.",
      },
      {
        name: "⭐ …and this is exactly the either-or case",
        formula: "Given A ≥ B, the PAIR \"A > B\" and \"A = B\" together cover every possibility ⇒ answer \"either follows\"",
        note: "Individually neither follows; jointly they are exhaustive. Same for ≤ with \"A < B\" and \"A = B\". Recognising the box is what makes either-or obvious instead of a guess.",
      },
      { name: "Either-or — the two conditions", formula: "(1) Both conclusions individually false  AND  (2) they involve the SAME two variables and leave no gap", note: "If either condition fails, the answer is \"neither follows\"." },
      { name: "Chain must be unbroken", formula: "A > B > C ⇒ A > C.  But A > B < C ⇒ NO relation between A and C", note: "The signs must point the same way the whole way along." },
      { name: "Mixing > and ≥", formula: "A > B ≥ C ⇒ A > C  (strict wins)", note: "A ≥ B ≥ C ⇒ A ≥ C, which is why A > C would be wrong there." },
    ],
  },
  {
    group: "Syllogism",
    items: [
      { name: "\"Only a few A are B\"", formula: "⇒ Some A are B (true) AND Some A are NOT B (true)", note: "The second half is what most people miss — it is a definite conclusion, not a possibility." },
      { name: "\"Only A are B\"", formula: "⇒ All B are A", note: "Reverses the direction. Different from \"only a few\"." },
      { name: "Possibility conclusions", formula: "\"Some A can be B\" is TRUE unless the statements make it impossible", note: "Definite conclusions need proof; possibilities only need to be not-contradicted." },
      { name: "No conclusion from two particulars", formula: "Two \"some\" statements alone give no definite conclusion" },
    ],
  },
  {
    group: "Direction Sense",
    items: [
      { name: "Turns", formula: "Right turn = clockwise 90° · Left turn = anticlockwise 90°", note: "Draw it. Never do direction questions in your head." },
      { name: "Shortest distance", formula: "√(net horizontal² + net vertical²)", note: "Pythagoras on the NET displacement, not the path walked. Common triples: 3-4-5, 6-8-10, 5-12-13, 9-12-15." },
      { name: "Facing after turns", formula: "Two left turns or two right turns = you face the opposite direction" },
    ],
  },
  {
    group: "Blood Relations & Coding",
    items: [
      { name: "Work backwards", formula: "Read the sentence from the LAST person to the first", note: "\"A's father's brother's son\" — start at son and walk back." },
      { name: "Generation levels", formula: "Draw +1 / 0 / −1 rows: parents above, siblings level, children below", note: "Symbols: + male, − female, = married couple." },
      { name: "Coding — shared word", formula: "Two coded sentences sharing exactly ONE word give you that word's code immediately", note: "Always start there, then subtract to get the rest." },
      { name: "Letter-shift coding", formula: "Check +1, −1, +2, −2 and reverse-alphabet (27 − n) before anything more exotic" },
    ],
  },
  {
    // Calendar sits in Reasoning, but it is pure arithmetic once you know the
    // odd-days table — which is the whole trick and cannot be worked out in the
    // exam.
    group: "Calendar & Leap Years",
    important: true,
    items: [
      {
        name: "⭐ Leap year test",
        formula: "Divisible by 4 → leap.  BUT a century year (÷100) must also be divisible by 400.",
        note: "2024 leap ✓ · 2000 leap ✓ (÷400) · 1900 NOT leap ✗ · 2100 NOT leap ✗. The century exception is the whole question whenever one appears.",
      },
      { name: "Days in a year", formula: "Ordinary 365 · Leap 366", note: "February is 28 or 29; every other month is fixed." },
      { name: "⭐ Odd days", formula: "Odd days = days ÷ 7, take the REMAINDER.  Ordinary year = 1 · Leap year = 2", note: "365 = 52 weeks + 1, 366 = 52 weeks + 2. Everything in calendar questions reduces to counting odd days." },
      { name: "Odd days in centuries", formula: "100 yrs = 5 · 200 yrs = 3 · 300 yrs = 1 · 400 yrs = 0", note: "Memorise these four. 400 years = 0 means the calendar repeats exactly every 400 years." },
      { name: "Odd days per month", formula: "Jan 3 · Feb 0 (1 if leap) · Mar 3 · Apr 2 · May 3 · Jun 2 · Jul 3 · Aug 3 · Sep 2 · Oct 3 · Nov 2 · Dec 3", note: "31-day months give 3, 30-day give 2 — you can rebuild the row from the month lengths if you forget." },
      { name: "Day codes", formula: "0 = Sunday · 1 = Monday · 2 = Tuesday · 3 = Wednesday · 4 = Thursday · 5 = Friday · 6 = Saturday", note: "Total odd days mod 7 gives the code; count forward from a known reference day." },
      {
        name: "Number of leap years up to n",
        formula: "⌊n/4⌋ − ⌊n/100⌋ + ⌊n/400⌋",
        note: "The three terms are exactly the three parts of the rule. For a range, subtract: count(b) − count(a−1).",
      },
      { name: "When a calendar repeats", formula: "Ordinary year → usually +6 or +11 years · Leap year → +28 years", note: "Always +400 exactly, since 400 years carry 0 odd days." },
    ],
  },
  {
    group: "Clocks",
    important: true,
    items: [
      { name: "Hour hand speed", formula: "0.5° per minute", note: "360° in 12 hours = 30° per hour = 0.5° per minute. The hour hand keeps moving between the hours — that is what 5.5M accounts for below." },
      { name: "Minute hand speed", formula: "6° per minute", note: "360° in 60 minutes." },
      { name: "⭐ Angle between the hands", formula: "θ = |30H − 5.5M|   ·   if θ > 180°, use 360 − θ", note: "H = hour, M = minutes. At 3:40 → |90 − 220| = 130°. At 9:00 → |270 − 0| = 270 → 360 − 270 = 90°." },
      { name: "Relative speed", formula: "6 − 0.5 = 5.5° per minute", note: "The minute hand gains 5.5° on the hour hand every minute — every result below comes from this one number." },
      { name: "Hands coincide (0°)", formula: "Every 65 5/11 minutes · 11 times in 12 hours · 22 times a day", note: "NOT 12 times — between 11 and 12 they meet only at 12." },
      { name: "Hands opposite (180°)", formula: "11 times in 12 hours · 22 times a day" },
      { name: "Hands at a right angle (90°)", formula: "22 times in 12 hours · 44 times a day" },
      { name: "Time for a given angle θ", formula: "M = (30H ∓ θ) / 5.5", note: "Two answers per hour — one before the hands meet and one after." },
      { name: "Fast / slow clock", formula: "Gain or loss per day = (error per given period) scaled to 24 hours", note: "A clock gaining 5 min in 3 days gains 5/3 min a day; set true time and clock time in proportion." },
    ],
  },
  {
    group: "Card-Based Puzzles",
    items: [
      { name: "Deck facts you may need", formula: "52 cards · 4 suits × 13 · Spades ♠ and Clubs ♣ black · Hearts ♥ and Diamonds ♦ red · J, Q, K are face cards", note: "Same counts as the Quant probability sheet — card PUZZLES borrow them without being probability questions." },
      { name: "Usual variables", formula: "Person ↔ suit ↔ card value ↔ seat, all at once", note: "Draw one grid with a column per variable rather than a diagram per clue." },
      { name: "Start from the most restrictive clue", formula: "The clue naming a specific card or an exact position, never a vague \"someone sits between\"" },
    ],
  },
];

export const QUANT_FORMULAS = [
  {
    group: "Percentage",
    items: [
      { name: "Percentage change", formula: "(New − Old) / Old × 100" },
      { name: "A is x% more than B", formula: "B = A × 100/(100 + x)", note: "Reverse direction is NOT the same %" },
      { name: "A is x% less than B", formula: "B = A × 100/(100 − x)" },
      { name: "Successive change of a% and b%", formula: "a + b + ab/100", note: "Use a minus sign for a decrease" },
      { name: "Net effect after equal rise & fall of x%", formula: "− x²/100", note: "Always a net loss" },
      { name: "Useful fractions", formula: "1/2=50%  1/3=33⅓%  1/4=25%  1/5=20%  1/6=16⅔%  1/7=14²⁄₇%  1/8=12½%  1/9=11⅑%  1/11=9¹⁄₁₁%  1/12=8⅓%", note: "Learn these — they convert DI sums into one-step mental maths" },
    ],
  },
  {
    group: "Ratio & Proportion",
    items: [
      { name: "Ratio a : b, total T", formula: "First = T × a/(a+b)" },
      { name: "Compound ratio", formula: "(a:b) × (c:d) = ac : bd" },
      { name: "Duplicate / sub-duplicate", formula: "a² : b²  /  √a : √b" },
      { name: "If a:b = c:d", formula: "ad = bc  (product of extremes = product of means)" },
      { name: "Componendo & dividendo", formula: "(a+b)/(a−b) = (c+d)/(c−d)" },
    ],
  },
  {
    group: "Average",
    items: [
      { name: "Average", formula: "Sum of observations / Number of observations" },
      { name: "First n natural numbers", formula: "(n + 1)/2" },
      { name: "Squares of first n naturals", formula: "(n + 1)(2n + 1)/6" },
      { name: "Consecutive numbers", formula: "(First + Last)/2" },
      { name: "Average speed for equal distances", formula: "2xy/(x + y)", note: "NOT the plain average of the speeds" },
      { name: "New average on replacement", formula: "Change in total / Number of members" },
    ],
  },
  {
    group: "Ages",
    items: [
      { name: "Present ages in ratio a:b, sum S", formula: "Ages = Sa/(a+b), Sb/(a+b)" },
      { name: "t years ago", formula: "Subtract t from EVERY person's age" },
      { name: "Ratio changes over time", formula: "(x + t)/(y + t) = new ratio", note: "The difference between two ages never changes" },
    ],
  },
  {
    group: "Profit, Loss & Discount",
    items: [
      { name: "Profit %", formula: "(SP − CP)/CP × 100" },
      { name: "SP from CP", formula: "SP = CP × (100 + P%)/100" },
      { name: "Discount", formula: "SP = MP × (100 − D%)/100" },
      { name: "MP, discount d%, profit p%", formula: "MP/CP = (100 + p)/(100 − d)" },
      { name: "Two articles at same SP, ±x%", formula: "Net loss = x²/100 %", note: "Always a loss, never a gain" },
      { name: "False weight", formula: "Gain % = (True wt − False wt)/False wt × 100" },
    ],
  },
  {
    group: "Simple & Compound Interest",
    items: [
      { name: "Simple interest", formula: "SI = P × R × T / 100" },
      { name: "Amount (SI)", formula: "A = P(1 + RT/100)" },
      { name: "Compound amount", formula: "A = P(1 + R/100)ᵀ" },
      { name: "Compound interest", formula: "CI = A − P" },
      { name: "Half-yearly compounding", formula: "A = P(1 + R/200)²ᵀ", note: "Quarterly → R/400 and 4T" },
      { name: "CI − SI for 2 years", formula: "P(R/100)²" },
      { name: "CI − SI for 3 years", formula: "P(R/100)² × (300 + R)/100" },
      { name: "Effective 2-year CI rate", formula: "2R + R²/100 %", note: "Turns a CI sum into a percentage sum" },
      { name: "Doubling under CI", formula: "Rate × Time ≈ 72 (rule of 72)" },
    ],
  },
  {
    group: "Time & Work",
    items: [
      { name: "Work rate", formula: "1 day's work = 1/n of the job" },
      { name: "A and B together", formula: "Time = xy/(x + y)" },
      { name: "A, B, C together", formula: "Time = xyz/(xy + yz + zx)" },
      { name: "A and B together, A alone", formula: "B alone = xy/(y − x)", note: "y = A's time, x = together" },
      { name: "Efficiency ↔ time", formula: "Efficiency ∝ 1/Time", note: "Ratio of times = inverse ratio of efficiencies" },
      { name: "M₁D₁H₁/W₁", formula: "M₁D₁H₁/W₁ = M₂D₂H₂/W₂", note: "Men–days–hours–work chain rule" },
      { name: "Wages", formula: "Share ∝ efficiency, i.e. ∝ 1/time" },
    ],
  },
  {
    group: "Pipes & Cisterns",
    items: [
      { name: "Two inlet pipes", formula: "Time = xy/(x + y)" },
      { name: "Inlet x, outlet y", formula: "Time = xy/(y − x)", note: "Outlet work is negative" },
      { name: "Pipe fills in x hrs, leak empties full tank in y", formula: "Time = xy/(y − x)" },
    ],
  },
  {
    group: "Time, Speed & Distance",
    items: [
      { name: "Basic", formula: "Distance = Speed × Time" },
      { name: "Unit conversion", formula: "km/hr × 5/18 = m/s;  m/s × 18/5 = km/hr" },
      {
        name: "⭐ Average speed — the general formula (always works)",
        formula: "Average Speed = (d₁ + d₂ + d₃ + … + dₙ) ÷ (d₁/v₁ + d₂/v₂ + d₃/v₃ + … + dₙ/vₙ)",
        note: "Total Distance ÷ Total Time, written out. Works for ANY number of legs at ANY speeds — every other average-speed shortcut below is just this with a special case substituted in. When unsure, use this and you cannot be wrong.",
      },
      { name: "Same distance, speeds x and y", formula: "Average speed = 2xy/(x + y)", note: "The general formula when d₁ = d₂. A shortcut, not a separate rule." },
      { name: "Constant distance", formula: "Speed ∝ 1/Time", note: "Speed ratio a:b ⇒ time ratio b:a" },
      { name: "Relative speed — same direction", formula: "|x − y|" },
      { name: "Relative speed — opposite direction", formula: "x + y" },
    ],
  },
  {
    group: "Trains",
    items: [
      { name: "Crossing a pole / man standing", formula: "Time = Length of train / Speed", note: "A pole has no length" },
      { name: "Crossing a platform / bridge / tunnel", formula: "Time = (Train + Platform) / Speed" },
      { name: "Crossing a man walking the SAME direction", formula: "Time = Train length / (Train − Man)" },
      { name: "Crossing a man walking the OPPOSITE direction", formula: "Time = Train length / (Train + Man)" },
      { name: "Two trains crossing, same direction", formula: "(L₁ + L₂) / (S₁ − S₂)" },
      { name: "Two trains crossing, opposite direction", formula: "(L₁ + L₂) / (S₁ + S₂)" },
      { name: "Trains cross in a and b sec after meeting", formula: "S₁ : S₂ = √b : √a" },
      {
        name: "Average speed",
        formula: "Average Speed = Total Distance ÷ Total Time",
        note: "NEVER the average of the two speeds. Add up every leg's distance, add up every leg's time, then divide once — the usual last step of a multi-leg train question. See the general n-leg form under Time, Speed & Distance.",
      },
      {
        name: "Average speed — equal distances",
        formula: "2xy / (x + y)",
        note: "Only when the two legs cover the SAME distance (e.g. a return journey). Derived from the rule above.",
      },
      {
        name: "Average speed — equal times",
        formula: "(x + y) / 2",
        note: "The plain average is correct ONLY when the two legs take the same time. Equal distance and equal time are opposite cases — check which the question gives.",
      },
    ],
  },
  {
    group: "Boats & Streams",
    items: [
      { name: "Downstream speed", formula: "D = B + S", note: "B = boat in still water, S = stream" },
      { name: "Upstream speed", formula: "U = B − S" },
      { name: "Speed in still water", formula: "B = (D + U)/2" },
      { name: "Speed of stream", formula: "S = (D − U)/2" },
      { name: "Same distance both ways, total time T", formula: "Distance = T × (B² − S²) / (2B)" },
      { name: "Time upstream = n × time downstream", formula: "B : S = (n + 1) : (n − 1)" },
    ],
  },
  {
    group: "Mixture & Alligation",
    items: [
      { name: "Alligation rule", formula: "Cheaper : Dearer = (d − m) : (m − c)", note: "m = mean price" },
      { name: "Repeated replacement", formula: "Final = Initial × (1 − x/V)ⁿ", note: "x removed each time, n times, V = vessel" },
      { name: "Mixing two ratios", formula: "Work out each component separately, then re-form the ratio" },
    ],
  },
  {
    group: "Partnership",
    items: [
      { name: "Simple partnership", formula: "Profit ∝ Capital" },
      { name: "Different time periods", formula: "Profit ∝ Capital × Time" },
      { name: "Three partners", formula: "P₁ : P₂ : P₃ = C₁T₁ : C₂T₂ : C₃T₃" },
    ],
  },
  {
    group: "Mensuration — 2D",
    important: true,
    items: [
      { name: "⭐ Rectangle", formula: "Area = l × b · Perimeter = 2(l + b) · Diagonal = √(l² + b²)", note: "Given perimeter and area, l and b are the roots of x² − (P/2)x + A = 0. For a FIXED perimeter, the area is largest when it is a square." },
      { name: "⭐ Square", formula: "Area = a² · Perimeter = 4a · Diagonal = a√2", note: "Reverse: a = √Area · a = P/4 · a = d/√2, and Area = d²/2 straight from the diagonal." },
      { name: "⭐ Triangle", formula: "Area = ½ × base × height · Perimeter = a + b + c", note: "For a RIGHT triangle the two legs are the base and height, so Area = ½ × leg₁ × leg₂ — no need to find an altitude." },
      { name: "Right triangle (Pythagoras)", formula: "hypotenuse² = base² + height²", note: "Learn the triples — 3-4-5, 5-12-13, 8-15-17, 7-24-25 — and their multiples (6-8-10, 9-12-15). Spotting one saves the whole calculation." },
      { name: "Triangle (Heron's)", formula: "√[s(s−a)(s−b)(s−c)],  s = (a+b+c)/2", note: "Use when all three sides are known but no height is." },
      { name: "Equilateral triangle", formula: "Area = (√3/4)a² · Height = (√3/2)a · Perimeter = 3a" },
      { name: "Isosceles triangle", formula: "Area = (b/4) × √(4a² − b²)", note: "a = the two equal sides, b = the base." },
      { name: "⭐ Circle", formula: "Area = πr² · Circumference = 2πr · Diameter d = 2r", note: "From the diameter: Area = πd²/4, Circumference = πd. Use π = 22/7 when the radius is a multiple of 7, otherwise 3.14." },
      { name: "Semicircle", formula: "Area = ½πr² · Perimeter = πr + 2r", note: "The perimeter includes the diameter — forgetting the +2r is the standard slip." },
      { name: "Ring (annulus)", formula: "Area = π(R² − r²)", note: "Outer minus inner, e.g. a circular path around a pond." },
      { name: "Sector", formula: "Area = (θ/360)πr²;  Arc = (θ/360)2πr" },
      { name: "⭐ Scaling", formula: "Multiply every length by k → perimeter × k, area × k²", note: "So a 20% rise in side is a 44% rise in area (1.2² = 1.44). Very commonly tested." },
      { name: "Parallelogram", formula: "Area = base × height" },
      { name: "Rhombus", formula: "Area = ½ × d₁ × d₂" },
      { name: "Trapezium", formula: "Area = ½ × (sum of parallel sides) × height" },
    ],
  },
  {
    group: "Mensuration — 3D",
    items: [
      { name: "Cube", formula: "Volume = a³;  TSA = 6a²;  LSA = 4a²;  Diagonal = a√3" },
      { name: "Cuboid", formula: "Volume = lbh;  TSA = 2(lb + bh + hl);  Diagonal = √(l² + b² + h²)" },
      { name: "Cylinder", formula: "Volume = πr²h;  CSA = 2πrh;  TSA = 2πr(r + h)" },
      { name: "Cone", formula: "Volume = ⅓πr²h;  CSA = πrl;  TSA = πr(r + l);  l = √(r² + h²)" },
      { name: "Sphere", formula: "Volume = 4/3 πr³;  Surface area = 4πr²" },
      { name: "Hemisphere", formula: "Volume = ⅔πr³;  CSA = 2πr²;  TSA = 3πr²" },
    ],
  },
  {
    group: "Number System & Simplification",
    items: [
      { name: "Order of operations", formula: "BODMAS — Brackets, Order, Division, Multiplication, Addition, Subtraction" },
      { name: "Sum of first n naturals", formula: "n(n + 1)/2" },
      { name: "Sum of squares", formula: "n(n + 1)(2n + 1)/6" },
      { name: "Sum of cubes", formula: "[n(n + 1)/2]²" },
      { name: "HCF × LCM", formula: "HCF × LCM = product of the two numbers" },
      { name: "Divisibility", formula: "See the Divisibility Rules group below" },
      { name: "Algebraic identities", formula: "(a+b)² = a² + 2ab + b²;  a² − b² = (a+b)(a−b);  (a+b)³ = a³ + b³ + 3ab(a+b)" },
    ],
  },
  {
    // Tested directly, and also as the hidden step in Data Sufficiency ("Is n
    // divisible by 6?" → statement I gives 2, statement II gives 3, neither
    // alone is enough, both together are).
    group: "Divisibility Rules (2–12)",
    important: true,
    items: [
      { name: "By 2", formula: "Last digit is even — 0, 2, 4, 6 or 8" },
      { name: "By 3", formula: "Digit SUM is divisible by 3", note: "471 → 4+7+1 = 12 ✓" },
      { name: "By 4", formula: "Last TWO digits form a number divisible by 4", note: "1316 → 16 ✓. Ignore everything before it." },
      { name: "By 5", formula: "Last digit is 0 or 5" },
      { name: "By 6", formula: "Divisible by 2 AND by 3", note: "Both are needed — 2 alone or 3 alone is not enough. This is the classic Data Sufficiency question." },
      { name: "By 7", formula: "Double the last digit, subtract it from the rest; repeat until you recognise the result", note: "861 → 86 − (2×1) = 84, and 84 = 7×12 ✓.  1073 → 107 − (2×3) = 101, not a multiple of 7 ✗. In the exam plain division is usually quicker — this is for large numbers." },
      { name: "By 8", formula: "Last THREE digits form a number divisible by 8", note: "51216 → 216 = 8×27 ✓" },
      { name: "By 9", formula: "Digit SUM is divisible by 9", note: "4716 → 4+7+1+6 = 18 ✓. Every number divisible by 9 is divisible by 3, but not the reverse." },
      { name: "By 10", formula: "Last digit is 0" },
      { name: "By 11", formula: "(sum of odd-position digits) − (sum of even-position digits) is 0 or divisible by 11", note: "918082 → (9+8+8) − (1+0+2) = 25 − 3 = 22 ✓" },
      { name: "By 12", formula: "Divisible by 3 AND by 4" },
      {
        name: "⭐ Combining two rules — only when CO-PRIME",
        formula: "a | n and b | n ⇒ ab | n  ONLY if HCF(a, b) = 1",
        note: "6 = 2×3 and HCF(2,3)=1, so divisible by 2 and 3 ⇒ divisible by 6 ✓. But 4 and 6 share a factor, so divisible by both gives only LCM(4,6) = 12, NOT 24 — 12 itself is the counter-example.",
      },
    ],
  },
  {
    group: "Quadratic Equations",
    important: true,
    items: [
      {
        name: "⭐ The quadratic formula (universal — always works)",
        formula: "For ax² + bx + c = 0  (a ≠ 0):   x = [−b ± √(b² − 4ac)] / 2a",
        note: "Works for EVERY quadratic, factorisable or not. Factorising is faster when the numbers are friendly, but this never fails — so if a set does not split in ~15 seconds, stop hunting and substitute. The only condition is a ≠ 0; if a = 0 it is a linear equation, x = −c/b.",
      },
      { name: "Reading off a, b, c", formula: "a = coefficient of x²,  b = coefficient of x,  c = the constant", note: "Rearrange to = 0 first, and carry the signs with the numbers — a missing minus is the single commonest error here." },
      { name: "Sum & product of roots", formula: "Sum = −b/a;  Product = c/a", note: "Lets you check your two roots without re-solving." },
      { name: "Nature of roots", formula: "D = b² − 4ac.  D > 0 real & distinct, D = 0 equal, D < 0 imaginary" },
      { name: "Exam shortcut", formula: "Factorise, flip the signs, then compare EVERY root of x with every root of y", note: "Answer \"no relation\" whenever the ranges overlap" },
    ],
  },
  {
    group: "Permutation, Combination & Probability",
    items: [
      { name: "⭐ Which one to use", formula: "Selection → Combination (ⁿCᵣ)   ·   Arrangement → Permutation (ⁿPᵣ)", note: "The whole difference. \"Choose/pick/select a team\" → C. \"Arrange/order/seat/rank/form a word\" → P. Picking the wrong one is the commonest P&C mistake, not the arithmetic." },
      { name: "Permutation", formula: "ⁿPᵣ = n! / (n − r)!", note: "Order matters" },
      { name: "Combination", formula: "ⁿCᵣ = n! / [r!(n − r)!]", note: "Order does not matter" },
      { name: "Relationship", formula: "ⁿPᵣ = ⁿCᵣ × r!", note: "Select first, then arrange the r chosen — which is exactly why P is always the larger." },
      { name: "Useful identity", formula: "ⁿCᵣ = ⁿC₍ₙ₋ᵣ₎;  ⁿC₀ = ⁿCₙ = 1" },
      { name: "Probability", formula: "P(E) = Favourable outcomes / Total outcomes" },
      { name: "Complement", formula: "P(not E) = 1 − P(E)" },
      { name: "Either A or B", formula: "P(A ∪ B) = P(A) + P(B) − P(A ∩ B)" },
      { name: "Dice", formula: "1 die: 6 outcomes.  2 dice: 36 outcomes, sum 7 is the most likely (6 ways)" },
    ],
  },
  {
    // A deck question is unanswerable without these counts, and there is nothing
    // to derive them from under exam pressure — they simply have to be known.
    group: "Playing Cards — memorise these counts",
    important: true,
    items: [
      { name: "Total cards", formula: "52", note: "4 suits × 13 cards" },
      { name: "Suits", formula: "4", note: "Hearts ♥ and Diamonds ♦ are RED; Clubs ♣ and Spades ♠ are BLACK" },
      { name: "Cards per suit", formula: "13", note: "A, 2–10, J, Q, K" },
      { name: "Red / Black", formula: "26 red, 26 black", note: "P(red) = 26/52 = 1/2" },
      { name: "Aces", formula: "4", note: "One per suit. P(Ace) = 4/52 = 1/13" },
      { name: "Kings / Queens / Jacks", formula: "4 each", note: "P(King) = 4/52 = 1/13, same for Queen and Jack" },
      { name: "Face cards", formula: "12  (J, Q, K)", note: "3 per suit × 4 suits. P(face) = 12/52 = 3/13. Aces are NOT face cards — the commonest slip." },
      { name: "Number cards", formula: "36  (2 to 10)", note: "9 per suit × 4. Check: 36 + 12 face + 4 aces = 52" },
      { name: "Honours cards", formula: "16  (A, K, Q, J)", note: "4 per suit. Occasionally asked as 20 if 10s are included — read the question." },
      { name: "Standard probabilities", formula: "P(Ace)=1/13 · P(red)=1/2 · P(face)=3/13 · P(spade)=1/4 · P(red King)=2/52=1/26" },
      { name: "Drawing WITHOUT replacement", formula: "The denominator drops: 52, then 51, then 50 …", note: "P(2 Aces) = 4/52 × 3/51 = 1/221. With replacement it stays 52 throughout." },
    ],
  },
  {
    // Every pattern IBPS has asked, each with a worked example — the previous
    // version described the pattern types in the abstract, which is no use when
    // you are staring at six numbers with 40 seconds left.
    group: "Number Series — every pattern IBPS has asked",
    items: [
      { name: "Pattern 1 · Difference", formula: "5, 8, 12, 17, 23", note: "+3, +4, +5, +6 — the gap grows by 1 each step. Always take differences first." },
      { name: "Pattern 2 · Second difference", formula: "3, 7, 13, 21, 31", note: "+4, +6, +8, +10 → the differences themselves rise by 2. Take differences twice before giving up." },
      { name: "Pattern 3 · Multiplication", formula: "4, 9, 19, 39, 79", note: "×2 + 1 each time. If the numbers roughly double, test ×2 with a small adjustment." },
      { name: "Pattern 4 · ×2 + 3", formula: "5, 13, 29, 61, 125", note: "Growth faster than doubling means a multiplier plus a constant." },
      { name: "Pattern 5 · ×3 − 2", formula: "3, 7, 19, 55, 163", note: "Roughly tripling — test ×3 with a small constant either way." },
      { name: "Pattern 6 · ×0.5", formula: "96, 48, 24, 12, 6", note: "Halving. A falling series is usually ×a fraction, not a subtraction." },
      { name: "Pattern 7 · ×0.8", formula: "125, 100, 80, 64, 51.2", note: "×0.8 — i.e. a 20% fall each step. Decimals appearing late is the giveaway." },
      { name: "Pattern 8 · Fractions", formula: "256, 128, 64, 32", note: "×½ each time. Same family as Pattern 6 — read it as a fraction, not a division." },
      { name: "Pattern 9 · Squares", formula: "25, 36, 49, 64", note: "5², 6², 7², 8². Memorise squares to 30 — you will spot these instantly." },
      { name: "Pattern 10 · Cubes", formula: "8, 27, 64, 125", note: "2³, 3³, 4³, 5³. Memorise cubes to 15." },
      { name: "Pattern 11 · Factorials", formula: "1, 2, 6, 24, 120, 720", note: "1!, 2!, 3!, 4!, 5!, 6! — equivalently ×2, ×3, ×4, ×5, ×6. Very steep growth." },
      { name: "Pattern 12 · Prime numbers", formula: "2, 3, 5, 7, 11, 13, 17", note: "The primes themselves, or added as gaps — 2023's Q35 added +61, +67, +71, +73, +79." },
      { name: "Pattern 13 · Fibonacci", formula: "2, 3, 5, 8, 13, 21", note: "Each term = sum of the previous two. Check this whenever a term looks close to the two before it." },
      { name: "Pattern 14 · Alternate pattern", formula: "2, 5, 4, 9, 8, 17", note: "TWO series interleaved — 2, 4, 8 (×2) and 5, 9, 17 (×2 − 1). Suspect this when the numbers zig-zag." },
      { name: "Pattern 15 · Mixed", formula: "×2 + 1, then −3, then ×3 …", note: "The operation itself rotates. Last resort — only after single-rule patterns fail." },
      { name: "Percentage based", formula: "×10%, ×20%, ×30% … of the previous term", note: "Exactly 2023's Q36 — worth knowing, it is not in the fifteen." },
      { name: "Order of attack", formula: "Differences → second differences → ratios → squares/cubes → alternate → mixed", note: "2023's Q31 only broke on the SECOND difference (±3, −5, +7, −11), so never stop at the first." },
    ],
  },
  {
    group: "Data Interpretation — approach",
    items: [
      { name: "Read the total first", formula: "Note the base figure before touching any question in the set" },
      { name: "Percentage to value", formula: "Value = Total × Percentage/100" },
      { name: "\"What percent more/less\"", formula: "(A − B)/B × 100", note: "The base is whatever follows \"than\"" },
      { name: "Approximation", formula: "Round to the nearest convenient figure — options are far apart by design" },
      { name: "Order of attack", formula: "Do the single-value questions first, leave the multi-step comparisons for the end" },
    ],
  },
];
