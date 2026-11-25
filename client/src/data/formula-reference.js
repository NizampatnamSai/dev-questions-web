// Quick-reference values for the IBPS PO "Formulas & Rules" tab: alphabet
// positions, fraction ↔ percentage, squares, cubes and fourth powers.
//
// Every number here is COMPUTED, not typed — a table of 36 hand-typed
// percentages is exactly where a 42.85 / 42.86 slip creeps in. The only
// hand-written content is the list of which fractions to show and the
// shortcut text. scripts/check-formula-reference.mjs re-derives the values
// independently and checks them against the published tables.
//
// Shape shared by every section, so one table component renders them all:
//   { id, title, blurb, columns: [{ key, label, answer?, align? }], rows: [{ id, ...cells, copy, search }] }
// `answer: true` marks a column that revision mode hides.

// ── helpers ──────────────────────────────────────────────────────────────────
const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));

/** Round to 2 decimals and drop trailing zeros: 50, 33.33, 12.5, 2.5. */
export function round2(x) {
  return String(Math.round(x * 100) / 100);
}

/** 100·n/d as an exact mixed number: "33 1/3", "14 2/7", "12 1/2", "50". */
export function exactPercent(n, d) {
  const whole = Math.floor((100 * n) / d);
  let rem = (100 * n) % d;
  if (rem === 0) return String(whole);
  const g = gcd(rem, d);
  return `${whole} ${rem / g}/${d / g}`;
}

const SUP = { 0: "⁰", 1: "¹", 2: "²", 3: "³", 4: "⁴", 5: "⁵", 6: "⁶", 7: "⁷", 8: "⁸", 9: "⁹" };
export const sup = (n) => String(n).split("").map((c) => SUP[c]).join("");

const LETTERS = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));

// ── 1. Alphabet ──────────────────────────────────────────────────────────────
// Common recall hooks for the opposite pairs. Each pair is checked to sum to 27
// by the verification script; the words are only memory aids.
const OPPOSITE_HOOKS = {
  A: "AZ (A to Z)", B: "BY", C: "CruX", D: "DeW", E: "EVe", F: "FUn", G: "GiT",
  H: "HiS", I: "IRon", J: "JQ (Jack-Queen)", K: "KeeP", L: "LOve", M: "MaN",
};

const alphabetRow = (L) => {
  const pos = L.charCodeAt(0) - 64;
  const opp = LETTERS[26 - pos];
  return {
    id: `alpha:${L}`,
    letter: L,
    position: pos,
    reverse: 27 - pos,
    opposite: opp,
    copy: `${L} = ${pos} (reverse ${27 - pos}, opposite ${opp})`,
    search: [L, String(pos), String(27 - pos), `${L}${opp}`, `${opp}${L}`],
  };
};

const ALPHA_COLUMNS = [
  { key: "letter", label: "Letter" },
  { key: "position", label: "Position", answer: true, align: "right" },
  { key: "reverse", label: "Reverse", answer: true, align: "right" },
  { key: "opposite", label: "Opposite", answer: true },
];

export const ALPHABET_SECTIONS = [
  {
    id: "alpha-am",
    title: "A to M",
    blurb: "Forward position, reverse position (A = 26 … Z = 1) and the opposite letter.",
    columns: ALPHA_COLUMNS,
    rows: LETTERS.slice(0, 13).map(alphabetRow),
  },
  {
    id: "alpha-nz",
    title: "N to Z",
    blurb: "Reverse position = 27 − position, so N (14) reverses to 13.",
    columns: ALPHA_COLUMNS,
    rows: LETTERS.slice(13).map(alphabetRow),
  },
];

export const OPPOSITE_PAIRS = LETTERS.slice(0, 13).map((L) => {
  const pos = L.charCodeAt(0) - 64;
  const opp = LETTERS[26 - pos];
  return { id: `pair:${L}${opp}`, pair: `${L}–${opp}`, positions: `${pos} + ${27 - pos} = 27`, hook: OPPOSITE_HOOKS[L] };
});

export const ALPHABET_TOTAL = (26 * 27) / 2; // 351

export const ALPHABET_SHORTCUTS = [
  { id: "as:ejoty", name: "EJOTY", formula: "E = 5 · J = 10 · O = 15 · T = 20 · Y = 25", note: "Count from the nearest anchor: R = T − 2 = 18." },
  { id: "as:cfilorux", name: "CFILORUX", formula: "C=3 · F=6 · I=9 · L=12 · O=15 · R=18 · U=21 · X=24", note: "Every letter at a multiple of 3." },
  { id: "as:reverse", name: "Reverse position", formula: "Reverse = 27 − position", note: "D = 4 → reverse 23." },
  { id: "as:opposite", name: "Opposite letter", formula: "Opposite of position n is 27 − n", note: "Opposite pairs always sum to 27: H (8) ↔ S (19)." },
  { id: "as:middle", name: "Middle of the alphabet", formula: "M = 13 · N = 14", note: "First half A–M, second half N–Z." },
  { id: "as:vowels", name: "Vowels", formula: "A = 1 · E = 5 · I = 9 · O = 15 · U = 21" },
  { id: "as:sum", name: "Sum A to Z", formula: `1 + 2 + … + 26 = 26 × 27 / 2 = ${ALPHABET_TOTAL}`, note: "Sum of first n letters = n(n + 1)/2." },
];

// ── 2. Fractions ─────────────────────────────────────────────────────────────
// The fractions to show. Values are derived from these pairs.
const FRACTION_PAIRS = [
  [1, 2],
  [1, 3], [2, 3],
  [1, 4], [3, 4],
  [1, 5], [2, 5], [3, 5], [4, 5],
  [1, 6], [5, 6],
  [1, 7], [2, 7], [3, 7], [4, 7], [5, 7], [6, 7],
  [1, 8], [3, 8], [5, 8], [7, 8],
  [1, 9], [2, 9], [4, 9], [5, 9], [7, 9], [8, 9],
  [1, 10], [1, 11], [1, 12], [1, 16], [1, 20], [1, 25], [1, 40], [1, 50], [1, 100],
];

// Values most often needed in DI and percentage sums — highlighted, not hidden.
const KEY_FRACTIONS = new Set(["1/3", "1/6", "1/7", "1/8", "1/9", "1/11", "1/12", "3/8", "5/8"]);

export const FRACTIONS = {
  id: "fractions",
  title: "Fraction → Percentage",
  blurb: "Percentages rounded to 2 decimal places. Where that rounds, the exact column gives the true value as a mixed number.",
  columns: [
    { key: "fraction", label: "Fraction" },
    { key: "percent", label: "Percentage", answer: true, align: "right" },
    { key: "exact", label: "Exact", answer: true, align: "right" },
    { key: "decimal", label: "Decimal", answer: true, align: "right" },
  ],
  rows: FRACTION_PAIRS.map(([n, d]) => {
    const f = `${n}/${d}`;
    const pct = round2((100 * n) / d);
    const exact = exactPercent(n, d);
    return {
      id: `frac:${f}`,
      fraction: f,
      denominator: d,
      percent: `${pct}%`,
      // Only recurring values need an exact form; 12.5% already IS exact.
      exact: (10000 * n) % d === 0 ? "—" : `${exact}%`,
      decimal: String(Math.round((n / d) * 10000) / 10000),
      key: KEY_FRACTIONS.has(f),
      copy: `${f} = ${pct}%`,
      search: [f, `${pct}%`, pct, `1/${d}`],
    };
  }),
};

export const FRACTION_DENOMINATORS = [...new Set(FRACTION_PAIRS.map(([, d]) => d))];

export const FRACTION_RULES = [
  { id: "fr:to-pct", name: "Fraction → percentage", formula: "a/b × 100 %", note: "3/8 × 100 = 37.5%." },
  { id: "fr:from-pct", name: "Percentage → fraction", formula: "p% = p/100, then simplify", note: "37.5% = 37.5/100 = 375/1000 = 3/8." },
  { id: "fr:recurring", name: "Recurring percentages", formula: "33.33% = 1/3 · 16.67% = 1/6 · 11.11% = 1/9 · 9.09% = 1/11", note: "Spot these in options and switch to the fraction." },
  { id: "fr:eighths", name: "Eighths", formula: "x/8 = 12.5 × x %", note: "5/8 = 62.5%." },
  { id: "fr:ninths", name: "Ninths", formula: "x/9 = 11.11 × x %  (x < 9)", note: "4/9 = 44.44%." },
  { id: "fr:sevenths", name: "Sevenths", formula: "1/7 = 14.2857…%, so x/7 ≈ 14.29 × x %", note: "Use the table for exact two-decimal values — multiplying the rounded 14.29 drifts (3 × 14.29 = 42.87, true 42.86)." },
  { id: "fr:more-less", name: "More ↔ less", formula: "If A is 1/n more than B, then B is 1/(n + 1) less than A", note: "25% (1/4) more ⇒ 20% (1/5) less." },
];

// ── 3–5. Powers ──────────────────────────────────────────────────────────────
function powerSection({ id, title, blurb, exponent, from = 1, to }) {
  return {
    id,
    title,
    blurb,
    columns: [
      { key: "expr", label: "Number" },
      { key: "value", label: title.replace(/s$/, ""), answer: true, align: "right" },
    ],
    rows: Array.from({ length: to - from + 1 }, (_, i) => {
      const n = from + i;
      const v = n ** exponent;
      return {
        id: `${id}:${n}`,
        n,
        expr: `${n}${sup(exponent)}`,
        value: v.toLocaleString("en-IN"),
        raw: v,
        copy: `${n}${sup(exponent)} = ${v}`,
        search: [String(n), String(v), `${n}${sup(exponent)}`],
      };
    }),
  };
}

export const SQUARES = powerSection({ id: "squares", title: "Squares", blurb: "1² to 25².", exponent: 2, to: 25 });
export const CUBES = powerSection({ id: "cubes", title: "Cubes", blurb: "1³ to 14³.", exponent: 3, to: 14 });
export const FOURTH_POWERS = powerSection({ id: "fourth", title: "Fourth Powers", blurb: "1⁴ to 9⁴ — note 2⁴ = 4² = 16 and 3⁴ = 9² = 81.", exponent: 4, to: 9 });

export const POWER_SHORTCUTS = [
  { id: "ps:end5", name: "Square of a number ending in 5", formula: "(n5)² = n(n + 1) followed by 25", note: "65² → 6 × 7 = 42 → 4225." },
  { id: "ps:near", name: "Square near a base", formula: "(a ± b)² = a² ± 2ab + b²", note: "49² = 2500 − 100 + 1 = 2401." },
  { id: "ps:50", name: "Squares near 50", formula: "(50 + x)² = (25 + x) hundreds + x²", note: "53² → 28 | 09 → 2809." },
  { id: "ps:never", name: "Not a perfect square", formula: "A perfect square never ends in 2, 3, 7 or 8", note: "Eliminates options instantly." },
  { id: "ps:fourth", name: "Fourth power", formula: "n⁴ = (n²)²", note: "7⁴ = 49² = 2401." },
];

// ── navigation ───────────────────────────────────────────────────────────────
export const REFERENCE_NAV = [
  { id: "ref-alphabet", label: "🔤 Alphabet" },
  { id: "ref-fractions", label: "➗ Fractions" },
  { id: "ref-squares", label: "²  Squares" },
  { id: "ref-cubes", label: "³  Cubes" },
  { id: "ref-fourth", label: "⁴  Fourth powers" },
];

// ── quiz pools ───────────────────────────────────────────────────────────────
// Each item: { q, a, pool } — `pool` is the set distractors are drawn from, so
// wrong options are always plausible values of the same kind.
const allAlpha = [...ALPHABET_SECTIONS[0].rows, ...ALPHABET_SECTIONS[1].rows];
export const QUIZ_TOPICS = {
  alphabet: {
    label: "Alphabet",
    items: [
      ...allAlpha.map((r) => ({ id: `q:pos:${r.letter}`, q: `Position of ${r.letter}?`, a: String(r.position), kind: "num26" })),
      ...allAlpha.map((r) => ({ id: `q:let:${r.position}`, q: `Which letter is at position ${r.position}?`, a: r.letter, kind: "letter" })),
      ...allAlpha.map((r) => ({ id: `q:opp:${r.letter}`, q: `Opposite letter of ${r.letter}?`, a: r.opposite, kind: "letter" })),
      ...allAlpha.map((r) => ({ id: `q:rev:${r.letter}`, q: `Reverse position of ${r.letter}?`, a: String(r.reverse), kind: "num26" })),
    ],
  },
  fractions: {
    label: "Fractions",
    items: FRACTIONS.rows.flatMap((r) => [
      { id: `q:f2p:${r.fraction}`, q: `${r.fraction} as a percentage?`, a: r.percent, kind: "percent" },
      { id: `q:p2f:${r.fraction}`, q: `${r.percent} as a fraction?`, a: r.fraction, kind: "fraction" },
    ]),
  },
  squares: { label: "Squares", items: SQUARES.rows.map((r) => ({ id: `q:sq:${r.n}`, q: `${r.expr} = ?`, a: r.value, kind: "square" })) },
  cubes: { label: "Cubes", items: CUBES.rows.map((r) => ({ id: `q:cu:${r.n}`, q: `${r.expr} = ?`, a: r.value, kind: "cube" })) },
  fourth: { label: "Fourth powers", items: FOURTH_POWERS.rows.map((r) => ({ id: `q:p4:${r.n}`, q: `${r.expr} = ?`, a: r.value, kind: "fourth" })) },
};

// Every possible answer of each kind — distractors are drawn from here.
export const QUIZ_ANSWER_POOLS = {
  num26: Array.from({ length: 26 }, (_, i) => String(i + 1)),
  letter: LETTERS,
  percent: FRACTIONS.rows.map((r) => r.percent),
  fraction: FRACTIONS.rows.map((r) => r.fraction),
  square: SQUARES.rows.map((r) => r.value),
  cube: CUBES.rows.map((r) => r.value),
  fourth: FOURTH_POWERS.rows.map((r) => r.value),
};

// ── Quant formula categories ─────────────────────────────────────────────────
// The category list the Quant sub-tab navigates by, mapped onto the groups in
// ibpspo-formulas.js that hold their formulas. A category whose groups are
// missing or empty renders as a "coming soon" card — add the content to
// QUANT_FORMULAS (or a new group name here) and it appears automatically.
export const QUANT_CATEGORIES = [
  { id: "percentage", label: "Percentage", groups: ["Percentage"] },
  { id: "profit-loss", label: "Profit & Loss", groups: ["Profit, Loss & Discount"] },
  { id: "discount", label: "Discount", groups: ["Profit, Loss & Discount"] },
  { id: "si", label: "Simple Interest", groups: ["Simple & Compound Interest"] },
  { id: "ci", label: "Compound Interest", groups: ["Simple & Compound Interest"] },
  { id: "ratio", label: "Ratio & Proportion", groups: ["Ratio & Proportion"] },
  { id: "average", label: "Average", groups: ["Average"] },
  { id: "partnership", label: "Partnership", groups: ["Partnership"] },
  { id: "mixture", label: "Mixture & Alligation", groups: ["Mixture & Alligation"] },
  { id: "work", label: "Time & Work", groups: ["Time & Work"] },
  { id: "pipes", label: "Pipes & Cisterns", groups: ["Pipes & Cisterns"] },
  { id: "tsd", label: "Time, Speed & Distance", groups: ["Time, Speed & Distance"] },
  { id: "boats", label: "Boats & Streams", groups: ["Boats & Streams"] },
  { id: "trains", label: "Trains", groups: ["Trains"] },
  { id: "ages", label: "Problems on Ages", groups: ["Ages"] },
  { id: "number-system", label: "Number System", groups: ["Number System & Simplification", "Squares & Cubes — memorise these", "Divisibility Rules (2–12)"] },
  { id: "hcf-lcm", label: "HCF & LCM", groups: ["HCF & LCM"] },
  { id: "pnc", label: "Permutation & Combination", groups: ["Permutation, Combination & Probability"] },
  { id: "probability", label: "Probability", groups: ["Permutation, Combination & Probability", "Playing Cards — memorise these counts"] },
  { id: "mensuration", label: "Mensuration", groups: ["Mensuration — 2D", "Mensuration — 3D"] },
  { id: "di", label: "Data Interpretation", groups: ["Data Interpretation — approach"] },
  { id: "quadratic", label: "Quadratic Equations", groups: ["Quadratic Equations"] },
  { id: "series", label: "Number Series", groups: ["Number Series — every pattern IBPS has asked"] },
];
