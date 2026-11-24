import { useEffect, useRef } from "react";
import { UNANNOUNCED_STATUSES, VACANCY_SCOPE, ELIGIBILITY } from "../../data/recruitment/model.js";
import { SALARY_CAVEAT, DEDUCTION_MODEL } from "../../data/recruitment/common.js";
import { fmtDate, mid, inr, ageCutoffFor } from "../../utils/recruitment.js";
import { StatusBadge, EligibilityBadge, Money, Count, ExtLink, Collapsible, KV, Pill, Prov } from "./ui.jsx";

// Full detail for one recruitment cycle: sections A–F of the spec. Rendered as
// a right-hand drawer on desktop and a full-height sheet on mobile.

const CONFIDENCE_CLS = {
  High: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300",
  Medium: "bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300",
  Low: "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300",
};

// Syllabus subjects and pattern sections are named independently ("General
// English" vs "General / Financial Awareness"), so match on shared words, not
// on the first word, and pick the best-scoring section.
const words = (s) => s.toLowerCase().split(/[^a-z]+/).filter((w) => w.length > 3);
function bestSection(sections, subject) {
  const want = words(subject);
  let best = null;
  let bestScore = 0;
  for (const sec of sections || []) {
    const have = new Set(words(sec.subject));
    const score = want.filter((w) => have.has(w)).length;
    if (score > bestScore) { best = sec; bestScore = score; }
  }
  return best;
}

const n = (v) => (v == null ? <span className="text-slate-400" title="Not published / not verified">—</span> : v);

function PatternTable({ stage }) {
  const hasMinutes = stage.sections.some((s) => s.minutes != null);
  return (
    <div className="space-y-2">
      <div className="relative overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
        <table className="w-full text-left min-w-[420px]">
          <caption className="sr-only">{stage.stage} exam pattern</caption>
          <thead className="bg-slate-50 dark:bg-slate-800/60">
            <tr className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <th scope="col" className="px-3 py-2">Subject</th>
              <th scope="col" className="px-3 py-2 text-right">Questions</th>
              <th scope="col" className="px-3 py-2 text-right">Marks</th>
              <th scope="col" className="px-3 py-2 text-right">Duration</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-[12.5px] text-slate-700 dark:text-slate-200">
            {stage.sections.map((s) => (
              <tr key={s.subject}>
                <td className="px-3 py-2">
                  {s.subject}
                  {s.note && <span className="block text-[10.5px] text-slate-500 dark:text-slate-400">{s.note}</span>}
                </td>
                <td className="px-3 py-2 text-right tabular-nums">{n(s.questions)}</td>
                <td className="px-3 py-2 text-right tabular-nums">{n(s.marks)}</td>
                <td className="px-3 py-2 text-right tabular-nums">{s.minutes != null ? `${s.minutes} min` : stage.sectionalTiming === false && !hasMinutes ? <span className="text-slate-400">composite</span> : n(null)}</td>
              </tr>
            ))}
            <tr className="font-bold bg-slate-50/60 dark:bg-slate-800/40">
              <td className="px-3 py-2">Total</td>
              <td className="px-3 py-2 text-right tabular-nums">{n(stage.totalQuestions)}</td>
              <td className="px-3 py-2 text-right tabular-nums">{n(stage.totalMarks)}</td>
              <td className="px-3 py-2 text-right tabular-nums">{stage.totalMinutes != null ? `${stage.totalMinutes} min` : n(null)}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <dl className="grid sm:grid-cols-2 gap-x-4 text-[11.5px]">
        <KV k="Sectional timing">{stage.sectionalTiming == null ? "—" : stage.sectionalTiming ? "Yes — each section has its own window" : "No — one composite window"}</KV>
        <KV k="Negative marking">{stage.negative}</KV>
        {stage.sectionalCutoff && <KV k="Sectional cut-off">{stage.sectionalCutoff}</KV>}
        {stage.overallCutoff && <KV k="Overall cut-off">{stage.overallCutoff}</KV>}
        {stage.qualifyingOnly && <KV k="Counts for merit?">No — qualifying only</KV>}
      </dl>
      {stage.note && <p className="text-[11px] text-slate-500 dark:text-slate-400">{stage.note}</p>}
    </div>
  );
}

function TopicList({ topics }) {
  return (
    <ul className="space-y-1">
      {topics.map((t, i) => (
        <li key={`${t.topic}-${i}`} className="text-[12.5px] text-slate-700 dark:text-slate-200">
          <span className="font-semibold">{t.topic}</span>
          {t.sub && <span className="text-slate-500 dark:text-slate-400"> — {t.sub.join(" · ")}</span>}
        </li>
      ))}
    </ul>
  );
}

function SalaryRow({ label, fig, children, strong }) {
  return (
    <tr className={strong ? "font-bold" : ""}>
      <th scope="row" className="px-3 py-2 text-left text-[12px] font-semibold text-slate-600 dark:text-slate-300 align-top w-44">{label}</th>
      <td className="px-3 py-2 text-[12.5px] text-slate-800 dark:text-slate-100">
        {fig !== undefined && <Money fig={fig} full emptyText="Not published" />}
        {children}
        {fig?.note && <span className="block text-[10.5px] font-normal text-slate-500 dark:text-slate-400">{fig.note}</span>}
      </td>
    </tr>
  );
}

export default function RecruitmentDetail({ row, siblings, onSelect, onClose, onOpenMockTest }) {
  const closeRef = useRef(null);
  const { exam, cycle, elig } = row;
  const s = exam.salary;
  const e = exam.eligibility;
  const unannounced = UNANNOUNCED_STATUSES.has(cycle.status);
  const cut = ageCutoffFor(exam, cycle);

  useEffect(() => {
    const prev = document.activeElement;
    closeRef.current?.focus();
    const onKey = (ev) => ev.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      prev?.focus?.();
    };
  }, [onClose]);

  const g = mid(s.gross);
  const annualGross = g != null ? { value: s.gross.value * 12, max: s.gross.max != null ? s.gross.max * 12 : undefined, provenance: s.gross.provenance } : null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true" aria-labelledby="rt-detail-title">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div className="relative w-full sm:max-w-3xl h-full overflow-y-auto bg-white dark:bg-slate-900 sm:border-l border-slate-200 dark:border-slate-700 shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white/95 dark:bg-slate-900/95 backdrop-blur border-b border-slate-200 dark:border-slate-700 px-5 py-4 space-y-2">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{exam.organization}</p>
              <h3 id="rt-detail-title" className="text-lg font-bold text-slate-800 dark:text-slate-100">{exam.name}</h3>
              <p className="text-[12px] text-slate-500 dark:text-slate-400">{cycle.label}</p>
            </div>
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              className="flex-shrink-0 text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
            >
              Close <span className="sr-only">details</span>
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            <StatusBadge cycle={cycle} />
            <EligibilityBadge elig={elig} />
            {row.pay === "below" && <Pill cls="bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300">▼ Below ₹60k in-hand target</Pill>}
          </div>
          {siblings.length > 1 && (
            <div className="flex flex-wrap gap-1.5" role="group" aria-label="Recruitment cycles">
              {siblings.map((sib) => (
                <button
                  key={sib.key}
                  type="button"
                  aria-pressed={sib.key === row.key}
                  onClick={() => onSelect(sib)}
                  className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg transition focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 ${
                    sib.key === row.key
                      ? "bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900"
                      : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                  }`}
                >
                  {sib.cycle.year} · {sib.cycle.label.replace(/\s*\(expected\)/, "")}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="p-5 space-y-3">
          {unannounced && (
            <div className="rounded-2xl border border-violet-200 dark:border-violet-900/60 bg-violet-50 dark:bg-violet-950/30 p-4 space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-bold text-violet-900 dark:text-violet-200">Expected — not officially announced</p>
                {cycle.forecast && <Pill cls={CONFIDENCE_CLS[cycle.forecast.level]}>{cycle.forecast.level} confidence</Pill>}
              </div>
              {cycle.forecast && <p className="text-[12.5px] text-violet-900/80 dark:text-violet-200/80">{cycle.forecast.basis}</p>}
              <p className="text-[11.5px] text-violet-900/70 dark:text-violet-300/70">
                Pattern, syllabus, eligibility and pay below are from the most recent notification. The next notification can change any of them.
              </p>
            </div>
          )}
          {cycle.statusNote && !unannounced && (
            <p className="text-[12px] text-slate-600 dark:text-slate-300 rounded-xl bg-slate-50 dark:bg-slate-800/60 px-3 py-2">
              <strong>Status:</strong> {cycle.statusNote}
              {cycle.statusVerified === false && <span className="text-slate-500"> (inferred from reported dates — not confirmed)</span>}
            </p>
          )}

          {/* A. Overview */}
          <Collapsible title="A. Recruitment overview" defaultOpen>
            <dl>
              <KV k="Full exam name">{exam.fullName}</KV>
              <KV k="Conducting organization">{exam.organization}</KV>
              <KV k="Post">{exam.post}</KV>
              <KV k="Recruitment year">{cycle.year}{unannounced && " (expected)"}</KV>
              <KV k="Total vacancies">
                <Count fig={cycle.vacancies} estimate={row.vacancyEstimate} />
                {cycle.vacancies?.note && <span className="block text-[11px] text-slate-500 dark:text-slate-400">{cycle.vacancies.note}</span>}
                {row.vacancyEstimate && (
                  <span className="block mt-1 text-[11px] text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/30 rounded-lg px-2 py-1">
                    <strong>How this is estimated:</strong> the range of the last {row.vacancyEstimate.basis.length === 1 ? "official figure" : `${row.vacancyEstimate.basis.length} official totals`} —{" "}
                    {row.vacancyEstimate.basis.map((b) => `${b.year}: ${b.value.toLocaleString("en-IN")}${b.max ? `–${b.max.toLocaleString("en-IN")}` : ""}`).join(" · ")}.
                    {row.vacancyEstimate.single && " Based on a single cycle, so treat it as a rough guide."} Not an official number.
                  </span>
                )}
                {!cycle.vacancies?.value && !row.vacancyEstimate && (
                  <span className="block text-[11px] text-slate-500 dark:text-slate-400">No earlier official total on record, so no estimate is shown.</span>
                )}
              </KV>
              <KV k="State-wise vacancies">
                <span className="text-slate-500 dark:text-slate-400">{VACANCY_SCOPE[exam.vacancyScope]}.</span>
                {exam.vacancyScope === "ALL_INDIA" || exam.vacancyScope === "BANK_WISE" ? (
                  <span className="block text-[11px] text-slate-500 dark:text-slate-400">No state-wise split — one national / bank-wise merit list.</span>
                ) : (
                  <ul className="mt-1 space-y-1">
                    {row.states.map((s) => (
                      <li key={s.name}>
                        <span className="font-semibold">{s.name}</span>
                        {s.unit && <span className="text-slate-500 dark:text-slate-400"> ({s.unit})</span>}:{" "}
                        {s.value != null ? <><strong className="tabular-nums">{s.value.toLocaleString("en-IN")}</strong> <Prov p={s.provenance} />{s.year && <span className="text-[11px] text-slate-500"> — {s.year} cycle</span>}</> : <span className="text-violet-600 dark:text-violet-400">not announced</span>}
                        {s.note && <span className="block text-[11px] text-slate-500 dark:text-slate-400">{s.note}</span>}
                      </li>
                    ))}
                  </ul>
                )}
              </KV>
              <KV k="Category distribution">
                {cycle.categoryVacancies ? (
                  <span>
                    General {cycle.categoryVacancies.general} · OBC-NCL {cycle.categoryVacancies.obc} · SC {cycle.categoryVacancies.sc} · ST {cycle.categoryVacancies.st} · EWS {cycle.categoryVacancies.ews}{" "}
                    <Prov p={cycle.categoryVacancies.provenance} note={cycle.categoryVacancies.note} />
                    {cycle.categoryVacancies.note && <span className="block text-[11px] text-slate-500">{cycle.categoryVacancies.note}</span>}
                  </span>
                ) : (
                  <span className="text-slate-500 dark:text-slate-400">Not captured here — see the notification's reservation table.</span>
                )}
              </KV>
              <KV k="Application start">{fmtDate(cycle.application?.start) || "Not announced"}</KV>
              <KV k="Application closing">{fmtDate(cycle.application?.end) || "Not announced"}{cycle.application?.note && <span className="block text-[11px] text-slate-500 dark:text-slate-400">{cycle.application.note}</span>}</KV>
              <KV k="Exam dates">{cycle.examDates?.text || "Not announced"}</KV>
              <KV k="Official notification">{unannounced ? <><ExtLink link={exam.officialSite} /> <span className="text-[11px] text-slate-500">(no notification yet)</span></> : <ExtLink link={cycle.notificationLink} />}</KV>
              <KV k="Application link">{cycle.status === "APPLICATION_OPEN" && cycle.applyLink ? <ExtLink link={cycle.applyLink} /> : <span className="text-slate-500 dark:text-slate-400">{unannounced ? "Not open — no notification yet" : "Application window closed"}</span>}</KV>
            </dl>
            {exam.history?.length > 0 && (
              <div className="mt-3">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">Previous cycles</p>
                <ul className="text-[12px] text-slate-600 dark:text-slate-300 space-y-0.5">
                  {exam.history.map((h) => (
                    <li key={h.year}>{h.year}: <strong className="tabular-nums">{h.vacancies.value?.toLocaleString("en-IN")}</strong> <Prov p="HISTORICAL" /> — {h.vacancies.note}</li>
                  ))}
                </ul>
              </div>
            )}
            {cycle.sources?.length > 0 && (
              <p className="mt-3 text-[11px] text-slate-500 dark:text-slate-400">
                Reported by:{" "}
                {cycle.sources.map((src, i) => (
                  <span key={src.url}>{i > 0 && " · "}<ExtLink link={{ url: src.url, label: src.name }} className="font-normal" /></span>
                ))}
              </p>
            )}
          </Collapsible>

          {/* B. Salary */}
          <Collapsible title="B. Salary details" subtitle={`In-hand: ${s.inHand?.value != null ? `${inr(s.inHand.value)}${s.inHand.max ? `–${inr(s.inHand.max).replace("₹", "")}` : ""} (estimated)` : "not verified"}`}>
            <div className="relative overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
              <table className="w-full">
                <caption className="sr-only">Salary breakdown</caption>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  <SalaryRow label="Basic pay" fig={s.basic} />
                  <SalaryRow label="Pay scale">{s.payScale ? <span className="text-[12px]">{s.payScale}</span> : <span className="text-violet-600 dark:text-violet-400 text-[12px]">Not published / not verified</span>}</SalaryRow>
                  {s.components.map((c) => (
                    <SalaryRow key={c.label} label={c.label}><span className="text-[12px] text-slate-600 dark:text-slate-300">{c.text}</span></SalaryRow>
                  ))}
                  <SalaryRow label="Gross monthly salary" fig={s.gross} strong />
                  <SalaryRow label="Estimated deductions" fig={s.deductions} />
                  <SalaryRow label="Estimated in-hand / month" fig={s.inHand} strong />
                  <SalaryRow label="Annual gross salary">{annualGross ? <Money fig={annualGross} full /> : <span className="text-violet-600 dark:text-violet-400 text-[12px]">Not available</span>}<span className="block text-[10.5px] text-slate-500">Monthly gross × 12.</span></SalaryRow>
                  <SalaryRow label="Approx. annual CTC" fig={s.ctc} />
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-[11.5px] text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/30 rounded-xl px-3 py-2">{SALARY_CAVEAT}</p>
            <p className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">{DEDUCTION_MODEL}</p>
            {s.note && <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">{s.note}</p>}
          </Collapsible>

          {/* C. Eligibility */}
          <Collapsible title="C. Eligibility" subtitle={ELIGIBILITY[elig.status].label} defaultOpen>
            <div className={`rounded-xl p-3 mb-3 border ${e.btech?.verdict === "YES" ? "border-emerald-200 bg-emerald-50 dark:border-emerald-900/60 dark:bg-emerald-950/30" : e.btech?.verdict === "NO" ? "border-red-200 bg-red-50 dark:border-red-900/60 dark:bg-red-950/30" : "border-amber-200 bg-amber-50 dark:border-amber-900/60 dark:bg-amber-950/30"}`}>
              <p className="text-[12px] font-bold text-slate-800 dark:text-slate-100">
                Can a B.Tech graduate with IT work experience apply?{" "}
                {e.btech?.verdict === "YES" ? "Yes." : e.btech?.verdict === "NO" ? "No." : "Yes, subject to a condition."}
              </p>
              <p className="text-[12px] text-slate-700 dark:text-slate-300 mt-0.5">{e.btech?.note}</p>
            </div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">Your profile vs this recruitment</p>
            <ul className="space-y-1 mb-3">
              {elig.reasons.map((r, i) => (
                <li key={i} className="flex gap-2 text-[12.5px]">
                  <span aria-hidden="true" className={r.ok === true ? "text-emerald-600" : r.ok === false ? "text-red-600" : "text-amber-600"}>{r.ok === true ? "✓" : r.ok === false ? "✕" : "!"}</span>
                  <span className="text-slate-700 dark:text-slate-200"><span className="sr-only">{r.ok === true ? "Pass: " : r.ok === false ? "Blocker: " : "Verify: "}</span>{r.text}</span>
                </li>
              ))}
            </ul>
            <dl>
              <KV k="Minimum qualification">{e.qualification}</KV>
              <KV k="Accepted degrees / streams">{e.degrees.join(" · ")}</KV>
              <KV k="Graduation percentage">{e.minPct ? `${e.minPct.general}% (General/OBC)${e.minPct.reserved != null ? `, ${e.minPct.reserved}% (reserved categories)` : ""}` : "No minimum percentage"}{e.minPct?.note && <span className="block text-[11px] text-slate-500 dark:text-slate-400">{e.minPct.note}</span>}</KV>
              <KV k="Age limit">{e.age.min != null ? `${e.age.min}–${e.age.max}` : `Up to ${e.age.max}`} years, {e.age.basis}{cut.kind !== "notified" && <span className="block text-[11px] text-slate-500 dark:text-slate-400">For this cycle, age is checked on {fmtDate(cut.date)} — {cut.basis}</span>}</KV>
              <KV k="OBC-NCL relaxation">+{e.obcRelax} years (upper limit {e.age.max + e.obcRelax})</KV>
              <KV k="Other relaxations">{e.otherRelax}</KV>
              <KV k="Work experience">{e.experience}</KV>
              <KV k="Nationality">{e.nationality}</KV>
              <KV k="Final-year candidates">{e.finalYear || "As per notification"}</KV>
              {e.notes && <KV k="Note">{e.notes}</KV>}
            </dl>
          </Collapsible>

          {/* D. Syllabus */}
          <Collapsible title="D. Detailed syllabus" subtitle={`${exam.syllabus.length} stage${exam.syllabus.length > 1 ? "s" : ""} · ${exam.patternBasis.confidence} confidence`}>
            <p className="text-[11.5px] text-slate-500 dark:text-slate-400 mb-3">
              <strong>Basis:</strong> {exam.patternBasis.text}
            </p>
            <div className="space-y-4">
              {exam.syllabus.map((st) => {
                const p = exam.pattern.find((x) => x.stage.toLowerCase().startsWith(st.stage.toLowerCase()));
                return (
                  <div key={st.stage} className="space-y-2">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h4 className="text-[13px] font-bold text-slate-800 dark:text-slate-100">{st.stage}</h4>
                      {p && (
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 tabular-nums">
                          {p.totalQuestions ?? "—"} Qs · {p.totalMarks ?? "—"} marks · {p.totalMinutes != null ? `${p.totalMinutes} min` : "—"} · Negative: {p.negative}
                        </span>
                      )}
                    </div>
                    {st.subjects.map((sub) => {
                      const sec = bestSection(p?.sections, sub.subject);
                      return (
                        <Collapsible
                          key={sub.subject}
                          level="sub"
                          title={sub.subject}
                          subtitle={sec ? `${sec.questions ?? "—"} Qs · ${sec.marks ?? "—"} marks${sec.minutes != null ? ` · ${sec.minutes} min` : ""}` : undefined}
                        >
                          <TopicList topics={sub.topics} />
                        </Collapsible>
                      );
                    })}
                  </div>
                );
              })}

              <div className="space-y-2">
                <h4 className="text-[13px] font-bold text-slate-800 dark:text-slate-100">Interview</h4>
                {exam.interview.exists ? (
                  <>
                    <dl>
                      <KV k="Interview marks">{exam.interview.marks}</KV>
                      <KV k="Weightage">{exam.interview.weightage}</KV>
                    </dl>
                    <Collapsible level="sub" title="Interview preparation topics">
                      <TopicList topics={exam.interview.topics} />
                    </Collapsible>
                  </>
                ) : (
                  <p className="text-[12.5px] font-semibold text-slate-700 dark:text-slate-200 rounded-xl bg-slate-50 dark:bg-slate-800/60 px-3 py-2">
                    No interview. {exam.interview.weightage}
                  </p>
                )}
                {exam.stages.some((x) => /language|LPT|RLT/i.test(x)) && (
                  <p className="text-[12px] text-slate-600 dark:text-slate-300">
                    Language proficiency test — qualifying; see the pattern section. Document verification follows provisional selection.
                  </p>
                )}
              </div>
            </div>
          </Collapsible>

          {/* E. Pattern */}
          <Collapsible title="E. Exam pattern" subtitle={exam.stages.join(" → ")}>
            {exam.patternBasis.confidence !== "High" && (
              <p className="text-[11.5px] text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/30 rounded-xl px-3 py-2 mb-3">
                {exam.patternBasis.confidence} confidence — {exam.patternBasis.text} A dash means the figure is not published or not verified.
              </p>
            )}
            <div className="space-y-5">
              {exam.pattern.map((st) => (
                <div key={st.stage} className="space-y-2">
                  <h4 className="text-[13px] font-bold text-slate-800 dark:text-slate-100">{st.stage}</h4>
                  <PatternTable stage={st} />
                </div>
              ))}
            </div>
          </Collapsible>

          {/* F. Strategy */}
          <Collapsible title="F. Preparation strategy" subtitle={`~${exam.overlap.pct}% overlap with IBPS PO (estimate)`}>
            <dl>
              <KV k="IBPS PO overlap">~{exam.overlap.pct}% <Prov p="ESTIMATED" /> <span className="block text-[11px] text-slate-500 dark:text-slate-400">{exam.overlap.note}</span></KV>
              <KV k="Common topics">{exam.prep.common.join(" · ")}</KV>
              <KV k="Additional topics">{exam.prep.additional.length ? exam.prep.additional.join(" · ") : "None"}</KV>
              <KV k="Recommended prep time">{exam.prep.time}</KV>
              <KV k="Books / resources">
                <ul className="list-disc pl-4 space-y-0.5">{exam.prep.resources.map((r) => <li key={r}>{r}</li>)}</ul>
              </KV>
              <KV k="Previous-year papers">{exam.prep.pyq}</KV>
              <KV k="Mock tests">
                {exam.prep.mock.note}
                {exam.prep.mock.inApp && onOpenMockTest && (
                  <button
                    type="button"
                    onClick={() => { onClose(); onOpenMockTest(); }}
                    className="mt-1.5 block text-[11.5px] font-semibold px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                  >
                    Open the in-app timed mock
                  </button>
                )}
              </KV>
            </dl>
          </Collapsible>

          <p className="text-[11px] text-slate-400 dark:text-slate-500 leading-relaxed pt-2">
            Always confirm vacancies, dates, eligibility and pay against the official notification before applying. Estimates on this page are planning aids, not official figures.
          </p>
        </div>
      </div>
    </div>
  );
}
