// Percentage ↔ fraction conversion, for RRB PO Quant.
//
// WHY THIS MATTERS IN THIS EXAM: RRB PO Prelims gives 40 Quant questions in 20
// minutes — 30 seconds each — and roughly 18 of the 40 Mains Quant questions are
// Data Interpretation. "Find 62.5% of 4,896" is a long multiplication; "find
// 5/8 of 4,896" is 4,896 ÷ 8 × 5, which is mental. Converting the percentage to
// a fraction first is the single biggest time saver in the section.
//
// EVERY VALUE HERE IS COMPUTED, NOT TYPED. A hand-written conversion sheet is
// exactly the kind of table where one wrong cell teaches a candidate something
// false and is never noticed. These are generated from integer arithmetic, so
// 1/7 comes out as 14 2/7% rather than a rounded 14.28% that does not reconcile.

const gcd = (a, b) => (b ? gcd(b, a % b) : a);

// Vulgar fractions render the mixed part compactly where Unicode has a glyph;
// anything else falls back to "a b/c" rather than a decimal, because the whole
// point is to keep the exact value in front of the candidate.
const VULGAR = {
  "1/2": "½", "1/3": "⅓", "2/3": "⅔", "1/4": "¼", "3/4": "¾",
  "1/5": "⅕", "2/5": "⅖", "3/5": "⅗", "4/5": "⅘",
  "1/6": "⅙", "5/6": "⅚", "1/7": "⅐", "1/8": "⅛", "3/8": "⅜",
  "5/8": "⅝", "7/8": "⅞", "1/9": "⅑", "1/10": "⅒",
};

function mixedPercent(num, den) {
  // percent = 100 * num / den, kept exact as whole + remainder/den
  const total = 100 * num;
  const whole = Math.floor(total / den);
  let rem = total % den;
  if (rem === 0) return { text: `${whole}%`, exact: true };
  const g = gcd(rem, den);
  const rn = rem / g;
  const rd = den / g;
  const frac = VULGAR[`${rn}/${rd}`] || `${rn}/${rd}`;
  const joiner = VULGAR[`${rn}/${rd}`] ? "" : " ";
  return { text: `${whole}${joiner}${frac}%`, exact: false };
}

// Denominators worth knowing by heart. Beyond /16 the fractions stop appearing
// in bank papers often enough to be worth memorising, except /20 and /25 which
// show up in DI percentages.
const DENOMINATORS = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 20, 25];

function buildTable() {
  return DENOMINATORS.map((den) => ({
    den,
    rows: Array.from({ length: den - 1 }, (_, i) => i + 1)
      // only fractions in lowest terms — 2/4 is just 1/2 and repeating it
      // makes the sheet look twice as long as it is
      .filter((num) => gcd(num, den) === 1)
      .map((num) => {
        const p = mixedPercent(num, den);
        return {
          fraction: `${num}/${den}`,
          pretty: VULGAR[`${num}/${den}`] || `${num}/${den}`,
          num,
          den,
          percent: p.text,
          exact: p.exact,
          decimal: Math.round((num / den) * 10000) / 10000,
        };
      }),
  })).filter((g) => g.rows.length);
}

export const PCT_FRACTION_TABLE = buildTable();

// The same idea applied to increases and decreases, which is what DI actually
// asks. "20% more" is ×6/5; "20% less" is ×4/5. Candidates who know these stop
// doing two-step arithmetic on every growth question.
function multiplier(pct, dir) {
  // Multiplier is (100 ± pct)/100, put over 200 so a .5 percentage stays an
  // integer. Writing the numerator as 100 ± 2·pct instead of 200 ± 2·pct made
  // +12.5% come out as 5/8 — the DECREASE factor — which is the kind of error
  // a reference sheet must never ship.
  const n = dir === "up" ? 200 + pct * 2 : 200 - pct * 2;
  const d = 200;
  const g = gcd(Math.abs(n), d);
  return { num: n / g, den: d / g };
}

const CHANGE_PCTS = [5, 10, 12.5, 16.5, 20, 25, 33.5, 37.5, 40, 50, 60, 62.5, 66.5, 75, 80, 100];

export const CHANGE_MULTIPLIERS = CHANGE_PCTS.map((pct) => {
  // .5 here means "and a half", except the recurring ones below, which are
  // handled exactly rather than as 16.5.
  const RECURRING = { 16.5: [1, 6], 33.5: [1, 3], 66.5: [2, 3] };
  if (RECURRING[pct]) {
    const [rn, rd] = RECURRING[pct];
    const upN = rd + rn, downN = rd - rn;
    return {
      label: mixedPercent(rn, rd).text,
      up: `${upN}/${rd}`,
      down: `${downN}/${rd}`,
      note: `${rn}/${rd} of the original`,
    };
  }
  const up = multiplier(pct, "up");
  const down = multiplier(pct, "down");
  return {
    label: `${pct}%`,
    up: `${up.num}/${up.den}`,
    down: `${down.num}/${down.den}`,
    note: null,
  };
});

export const SHORTCUT_EXAMPLES = [
  {
    q: "62.5% of 4,896",
    slow: "4,896 × 62.5 ÷ 100 — a three-line multiplication",
    fast: "62.5% = 5/8 → 4,896 ÷ 8 = 612 → 612 × 5",
    answer: "3,060",
  },
  {
    q: "A value rises from 1,200 to 1,500. Percent increase?",
    slow: "(1,500 − 1,200)/1,200 × 100",
    fast: "1,500/1,200 = 5/4 → the ×5/4 row is +25%",
    answer: "25%",
  },
  {
    q: "Production falls 16⅔% from 4,320",
    slow: "4,320 × 16.666… ÷ 100, then subtract",
    fast: "16⅔% less = ×5/6 → 4,320 ÷ 6 = 720 → 720 × 5",
    answer: "3,600",
  },
  {
    q: "In a pie chart, a sector is 87.5% of 2,048",
    slow: "2,048 × 87.5 ÷ 100",
    fast: "87.5% = 7/8 → 2,048 ÷ 8 = 256 → 256 × 7",
    answer: "1,792",
  },
];

export const SHORTCUT_NOTES = [
  {
    title: "Pick the denominator that divides the number",
    body:
      "The fraction only saves time if the division is clean. DI sets are built from round totals — 1,200, " +
      "2,400, 4,800 — precisely because the setter expects /3, /6, /8 and /12 to come out whole. If the " +
      "division is not clean, the percentage was probably meant to be approximated instead.",
  },
  {
    title: "Learn the /7 row — it is the one that separates people",
    body:
      "1/7 = 14²⁄₇%, 2/7 = 28⁴⁄₇%, 3/7 = 42⁶⁄₇%. Sevenths look ugly, which is why setters use them: a " +
      "candidate who recognises 42⁶⁄₇% as 3/7 finishes in seconds, and one who does not reaches for the " +
      "on-screen calculator they do not have.",
  },
  {
    title: "Go both ways",
    body:
      "The table is as useful in reverse. When a question gives you a ratio — 3 : 5 of a total — reading it " +
      "as 37.5% and 62.5% turns a ratio question into a percentage question, and those are usually easier to " +
      "compare against options.",
  },
  {
    title: "Exact beats rounded",
    body:
      "Where a percentage recurs, this sheet writes 16⅔% rather than 16.67%. In a five-option question the " +
      "rounding error from 16.67% can push you between two adjacent options, especially in Mains where the " +
      "numbers run to four digits.",
  },
];
