// Recruitment tracker dataset — the single object the UI consumes.
//
// Adding an exam: append an object with the same shape to the right
// exams-*.js file and list the tab(s) it belongs to in `tabs`. Adding a cycle
// (e.g. the 2027 notification drops): edit that exam's `cycles` — replace the
// EXPECTED_2027 entry with the real one and move its figures to OFFICIAL.
//
// After editing, run `node scripts/export-recruitment-data.mjs` so the
// server's /api/govt-exams copy matches the bundle.

import { SCHEMA_VERSION } from "./model.js";
import { PO_EXAMS } from "./exams-po.js";
import { CLERK_EXAMS } from "./exams-clerk.js";
import { OTHER_EXAMS, EXCLUDED } from "./exams-other.js";

export const PROFILE = {
  qualification: "B.Tech — Electrical & Electronics Engineering",
  graduationPct: 60,
  graduationPctApprox: true,
  experience: "4 years software development (React.js, React Native, JavaScript, TypeScript)",
  role: "Frontend Software Developer / Team Lead",
  category: "OBC-NCL",
  state: "Rajasthan",
  preferredStates: ["Rajasthan", "Andhra Pradesh"],
  currentSalary: "≈ ₹8 LPA",
  targetInHand: 60000,
  preferences: [
    "Permanent government / banking / PSU posts only",
    "No contract, GATE-based or EEE-technical roles",
    "No posts requiring CA, MBA or bank experience",
    "No UPSC recruitment",
    "Flag anything paying under ₹60,000 in-hand",
  ],
};

const dataset = {
  schemaVersion: SCHEMA_VERSION,
  updated: "2026-11-24",
  researchNote:
    "Compiled 24 Nov 2026 from recruiter websites and multiple exam-news outlets. Figures tagged Official were reported from the cycle's notification; the notification PDFs themselves should be checked before applying.",
  profile: PROFILE,
  exams: [...PO_EXAMS, ...CLERK_EXAMS, ...OTHER_EXAMS],
  excluded: EXCLUDED,
};

export default dataset;
