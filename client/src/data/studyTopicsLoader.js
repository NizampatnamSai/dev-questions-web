// On-demand loader for Study Hub topic content, one category at a time.
// The old barrel (./studyGuide.js) eagerly imports all 30 studyTopics/*.js
// files (~2.3MB combined) into a single STUDY_TOPICS array — fine for
// Flashcards (which genuinely needs cross-category content), but StudyGuide
// only ever renders one category at a time, so importing all 30 up front
// turned its route chunk into a 2.2MB download that had to finish before the
// page could render at all — the actual cause of Study Hub's 4-5s load.
const modules = import.meta.glob("./studyTopics/*.js");

const cache = new Map();

export async function loadTopicsForCategory(categoryId) {
  if (cache.has(categoryId)) return cache.get(categoryId);
  const loader = modules[`./studyTopics/${categoryId}.js`];
  if (!loader) return [];
  const mod = await loader();
  const topics = mod.default || [];
  cache.set(categoryId, topics);
  return topics;
}
