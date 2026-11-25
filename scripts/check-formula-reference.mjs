// Verifies the generated quick-reference tables (client/src/data/formula-reference.js)
// against independently written expected values. Run after editing that file:
//
//   node scripts/check-formula-reference.mjs
//
// Exits non-zero on any mismatch.
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const R = await import(resolve(root, "client/src/data/formula-reference.js"));

const failures = [];
const expect = (label, got, want) => {
  if (String(got) !== String(want)) failures.push(`${label}: got ${got}, expected ${want}`);
};

// ── alphabet ──
const alpha = [...R.ALPHABET_SECTIONS[0].rows, ...R.ALPHABET_SECTIONS[1].rows];
expect("alphabet count", alpha.length, 26);
"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").forEach((L, i) => {
  const row = alpha[i];
  expect(`${L} letter`, row.letter, L);
  expect(`${L} position`, row.position, i + 1);
  expect(`${L} reverse`, row.reverse, 26 - i);
  expect(`${L} opposite`, row.opposite, "ZYXWVUTSRQPONMLKJIHGFEDCBA"[i]);
});
expect("A–M split", R.ALPHABET_SECTIONS[0].rows.map((r) => r.letter).join(""), "ABCDEFGHIJKLM");
expect("A–Z sum", R.ALPHABET_TOTAL, 351);
for (const p of R.OPPOSITE_PAIRS) {
  const [a, b] = p.pair.split("–");
  expect(`pair ${p.pair} sums to 27`, a.charCodeAt(0) - 64 + (b.charCodeAt(0) - 64), 27);
  // The hook must actually contain both letters, in order.
  const re = new RegExp(`${a}.*${b}`, "i");
  if (p.hook && !re.test(p.hook)) failures.push(`hook "${p.hook}" does not spell ${a}…${b}`);
}

// ── fractions (expected values from the spec, typed independently) ──
const FRACTIONS_EXPECTED = {
  "1/2": "50%", "1/3": "33.33%", "2/3": "66.67%", "1/4": "25%", "3/4": "75%",
  "1/5": "20%", "2/5": "40%", "3/5": "60%", "4/5": "80%", "1/6": "16.67%", "5/6": "83.33%",
  "1/7": "14.29%", "2/7": "28.57%", "3/7": "42.86%", "4/7": "57.14%", "5/7": "71.43%", "6/7": "85.71%",
  "1/8": "12.5%", "3/8": "37.5%", "5/8": "62.5%", "7/8": "87.5%",
  "1/9": "11.11%", "2/9": "22.22%", "4/9": "44.44%", "5/9": "55.56%", "7/9": "77.78%", "8/9": "88.89%",
  "1/10": "10%", "1/11": "9.09%", "1/12": "8.33%", "1/16": "6.25%", "1/20": "5%", "1/25": "4%",
  "1/40": "2.5%", "1/50": "2%", "1/100": "1%",
};
expect("fraction count", R.FRACTIONS.rows.length, Object.keys(FRACTIONS_EXPECTED).length);
for (const row of R.FRACTIONS.rows) {
  expect(`${row.fraction} %`, row.percent, FRACTIONS_EXPECTED[row.fraction]);
  // Exact mixed number must equal 100·n/d.
  const [n, d] = row.fraction.split("/").map(Number);
  if (row.exact !== "—") {
    const m = row.exact.replace("%", "").match(/^(\d+) (\d+)\/(\d+)$/);
    if (!m) failures.push(`${row.fraction} exact "${row.exact}" unparsable`);
    else if (Math.abs(+m[1] + m[2] / m[3] - (100 * n) / d) > 1e-9) failures.push(`${row.fraction} exact ${row.exact} wrong`);
  } else if ((10000 * n) % d !== 0) failures.push(`${row.fraction} has no exact form but its percentage recurs`);
  if (row.exact !== "—" && (10000 * n) % d === 0) failures.push(`${row.fraction} shows a redundant exact form`);
  if (Math.abs(Number(row.decimal) - n / d) > 0.00005) failures.push(`${row.fraction} decimal ${row.decimal} wrong`);
}

// ── powers (spec tables) ──
const SQ = [1, 4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144, 169, 196, 225, 256, 289, 324, 361, 400, 441, 484, 529, 576, 625];
const CU = [1, 8, 27, 64, 125, 216, 343, 512, 729, 1000, 1331, 1728, 2197, 2744];
const P4 = [1, 16, 81, 256, 625, 1296, 2401, 4096, 6561];
for (const [name, section, want] of [["square", R.SQUARES, SQ], ["cube", R.CUBES, CU], ["fourth", R.FOURTH_POWERS, P4]]) {
  expect(`${name} count`, section.rows.length, want.length);
  section.rows.forEach((r, i) => expect(`${r.n} ${name}`, r.raw, want[i]));
}

// ── quiz answers must be the table values ──
for (const [key, topic] of Object.entries(R.QUIZ_TOPICS)) {
  if (!topic.items.length) failures.push(`quiz ${key} empty`);
  for (const it of topic.items) {
    const pool = R.QUIZ_ANSWER_POOLS[it.kind];
    if (!pool?.includes(it.a)) failures.push(`quiz ${it.id}: answer ${it.a} not in pool ${it.kind}`);
  }
}

if (failures.length) {
  console.error(`✗ ${failures.length} problem(s):\n  ` + failures.join("\n  "));
  process.exit(1);
}
const n = alpha.length + R.FRACTIONS.rows.length + R.SQUARES.rows.length + R.CUBES.rows.length + R.FOURTH_POWERS.rows.length;
console.log(`✓ All ${n} reference values verified (26 letters, ${R.FRACTIONS.rows.length} fractions, ${R.SQUARES.rows.length} squares, ${R.CUBES.rows.length} cubes, ${R.FOURTH_POWERS.rows.length} fourth powers).`);
