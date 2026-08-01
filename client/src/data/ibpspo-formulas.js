// Quick-revision sheet for the IBPS PO Prelims syllabus — English usage rules
// and Quantitative Aptitude formulas. Rendered by the "Formulas & Rules" tab in
// IbpsPoPrep.jsx. Kept as plain data so it stays greppable and easy to extend.

export const ENGLISH_RULES = [
  {
    group: "Prepositions — the ones IBPS tests every year",
    rows: [
      { topic: "Reach", rule: "Reach takes **no preposition**", example: "I reached home.", trick: "Reach = direct" },
      { topic: "Arrive", rule: "Arrive **at / in**", example: "Arrive at school / in Delhi", trick: "Small place = at, city/country = in" },
      { topic: "Discuss", rule: "No \"about\"", example: "Discuss the issue", trick: "Discuss already means \"talk about\"" },
      { topic: "Order", rule: "Order **for** food / order **to** do something", example: "Ordered food / In order to study", trick: "Different meanings" },
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
      { name: "Same distance, speeds x and y", formula: "Average speed = 2xy/(x + y)" },
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
        note: "NEVER the average of the two speeds. Add up every leg's distance, add up every leg's time, then divide once — the usual last step of a multi-leg train question.",
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
    items: [
      { name: "Rectangle", formula: "Area = l × b;  Perimeter = 2(l + b);  Diagonal = √(l² + b²)" },
      { name: "Square", formula: "Area = a²;  Perimeter = 4a;  Diagonal = a√2" },
      { name: "Triangle", formula: "Area = ½ × base × height" },
      { name: "Triangle (Heron's)", formula: "√[s(s−a)(s−b)(s−c)],  s = (a+b+c)/2" },
      { name: "Equilateral triangle", formula: "Area = (√3/4)a²;  Height = (√3/2)a" },
      { name: "Circle", formula: "Area = πr²;  Circumference = 2πr" },
      { name: "Sector", formula: "Area = (θ/360)πr²;  Arc = (θ/360)2πr" },
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
      { name: "Divisibility by 3 / 9", formula: "Digit sum divisible by 3 / 9" },
      { name: "Divisibility by 11", formula: "Difference of alternate digit sums divisible by 11" },
      { name: "Algebraic identities", formula: "(a+b)² = a² + 2ab + b²;  a² − b² = (a+b)(a−b);  (a+b)³ = a³ + b³ + 3ab(a+b)" },
    ],
  },
  {
    group: "Quadratic Equations",
    items: [
      { name: "Roots", formula: "x = [−b ± √(b² − 4ac)] / 2a" },
      { name: "Sum & product of roots", formula: "Sum = −b/a;  Product = c/a" },
      { name: "Nature of roots", formula: "D = b² − 4ac.  D > 0 real & distinct, D = 0 equal, D < 0 imaginary" },
      { name: "Exam shortcut", formula: "Factorise, flip the signs, then compare EVERY root of x with every root of y", note: "Answer \"no relation\" whenever the ranges overlap" },
    ],
  },
  {
    group: "Permutation, Combination & Probability",
    items: [
      { name: "Permutation", formula: "ⁿPᵣ = n! / (n − r)!", note: "Order matters" },
      { name: "Combination", formula: "ⁿCᵣ = n! / [r!(n − r)!]", note: "Order does not matter" },
      { name: "Useful identity", formula: "ⁿCᵣ = ⁿC₍ₙ₋ᵣ₎;  ⁿC₀ = ⁿCₙ = 1" },
      { name: "Probability", formula: "P(E) = Favourable outcomes / Total outcomes" },
      { name: "Complement", formula: "P(not E) = 1 − P(E)" },
      { name: "Either A or B", formula: "P(A ∪ B) = P(A) + P(B) − P(A ∩ B)" },
      { name: "Cards & dice", formula: "52 cards: 26 red, 26 black, 4 suits of 13, 12 face cards.  2 dice: 36 outcomes" },
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
