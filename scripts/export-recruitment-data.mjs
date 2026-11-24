// Writes the recruitment tracker dataset (client/src/data/recruitment) to
// server/data/govt-exams.json, which /api/govt-exams serves. Run after editing
// the dataset so the server copy and the bundled copy match:
//
//   node scripts/export-recruitment-data.mjs
//
// The client only accepts a server copy whose schemaVersion matches its own,
// so an out-of-date server file degrades to the bundled data, never to a
// half-rendered page.
import { writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const { default: dataset } = await import(resolve(root, "client/src/data/recruitment/index.js"));
const out = resolve(root, "server/data/govt-exams.json");
writeFileSync(out, JSON.stringify(dataset, null, 1) + "\n");
console.log(`Wrote ${dataset.exams.length} exams (schema v${dataset.schemaVersion}, updated ${dataset.updated}) → ${out}`);
