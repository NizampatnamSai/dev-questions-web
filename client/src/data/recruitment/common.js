// Shared wording and constructors for the exam definitions.
//
// Only TEXT that is genuinely identical across recruiters lives here (GoI age
// relaxations, nationality clause, the salary caveat). Anything a recruiter
// sets for itself — percentage bars, age windows, cut-off dates — is passed in
// per exam, never defaulted.

export const RELAX_OTHER =
  "SC/ST +5 years · PwBD +10 years (GEN/EWS), +13 (OBC), +15 (SC/ST) · Ex-servicemen and 1984-riot / J&K-domicile relaxations as per GoI rules";

export const NATIONALITY =
  "Citizen of India — or subject of Nepal/Bhutan, a Tibetan refugee settled before 1 Jan 1962, or a person of Indian origin migrated from specified countries, subject to an eligibility certificate.";

export const SALARY_CAVEAT =
  "Actual in-hand varies with posting centre (HRA / city allowance or leased accommodation), the quarterly or half-yearly DA revision, NPS and income-tax deductions, and any pay revision that takes effect during the cycle.";

// Deduction model used where a recruiter publishes gross but not in-hand.
// Stated once so every derived in-hand figure is computed the same way.
export const DEDUCTION_MODEL =
  "Estimated deductions = employee NPS contribution (10% of Basic + DA) + professional tax + union / welfare / group-insurance recoveries. Under the new tax regime (FY 2025-26 onward) taxable income up to ₹12 lakh attracts no tax after rebate, so income tax is ~nil below roughly ₹1.06 lakh gross a month and rises above it.";

/**
 * Eligibility record. Every field is passed explicitly; `confirmed: false`
 * marks criteria that could not be verified from a notification.
 */
export function eligibility({
  qualification,
  degrees = ["Any graduate (B.A., B.Sc., B.Com., B.Tech/B.E., etc.)"],
  minPct = null, // { general: 60, reserved: 55, note }
  age, // { min, max, cutoff: "YYYY-MM-DD"|null, basis }
  obcRelax = 3,
  experience = "Not required",
  finalYear,
  btech, // { verdict: "YES"|"CONDITIONAL"|"NO", note }
  flags = {},
  confirmed = true,
  notes,
}) {
  return {
    qualification,
    degrees,
    minPct,
    age,
    obcRelax,
    otherRelax: RELAX_OTHER,
    experience,
    nationality: NATIONALITY,
    finalYear,
    btech,
    flags: {
      requiresBankExperience: false,
      requiresMbaOrCa: false,
      gateBased: false,
      eeeTechnical: false,
      contract: false,
      upsc: false,
      ...flags,
    },
    confirmed,
    ...(notes && { notes }),
  };
}

export const BTECH_YES = (extra = "") => ({
  verdict: "YES",
  note: `B.Tech EEE is accepted — the post is open to graduates in any discipline. IT work experience is neither required nor a bar.${extra ? " " + extra : ""}`,
});
