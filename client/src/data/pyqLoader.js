// On-demand loader for previous-year paper questions, one paper at a time.
//
// The paper metadata (name, year, section counts) lives in ibpspo-pyq.json and
// is imported statically — it is ~8KB and the cards need it immediately. The
// questions are ~1.2MB across ten papers, which has no business being in the
// route chunk: opening the tab only shows a list, and a candidate sits ONE
// paper. So each paper's questions are fetched when its attempt actually
// starts.
const modules = import.meta.glob("./pyq/*.json");

const cache = new Map();

/**
 * Questions for one paper, with marks/negatives filled in from the caller's
 * SECTION_PLAN so an imported paper only ever has to carry question content.
 * The plan is passed in rather than imported: it lives in IbpsPoPrep.jsx, and
 * importing it here would make the page and its data loader mutually dependent.
 */
export async function loadPaperQuestions(paperId, sectionPlan = []) {
  if (cache.has(paperId)) return cache.get(paperId);
  const loader = modules[`./pyq/${paperId}.json`];
  if (!loader) return [];
  const mod = await loader();
  const questions = (mod.default?.questions || mod.questions || []).map((q, i) => {
    const plan = sectionPlan.find((s) => s.name === q.section);
    return {
      ...q,
      id: q.id || `${paperId}-q${i + 1}`,
      marks: typeof q.marks === "number" ? q.marks : plan ? plan.perQuestion : 1,
      negativeMarks:
        typeof q.negativeMarks === "number" ? q.negativeMarks : plan ? plan.negative : -0.25,
      passage: q.passage ?? null,
      table: q.table ?? null,
    };
  });
  cache.set(paperId, questions);
  return questions;
}
