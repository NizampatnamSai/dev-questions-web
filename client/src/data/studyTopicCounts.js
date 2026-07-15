// Per-category topic counts for Study Hub's header ("1520 topics · 30
// technologies") — kept as a tiny static manifest instead of importing every
// studyTopics/*.js file (~2.3MB combined) just to read .length. Regenerate by
// running this in client/src/data/studyTopics/:
//   for f in *.js; do echo "  $(basename "$f" .js): $(grep -cE "^\s*[\"']?id[\"']?:\s*[\"']" "$f")," ; done
export const STUDY_TOPIC_COUNTS = {
  accessibility: 32,
  aifordevs: 58,
  backend: 89,
  browserinternals: 30,
  buildtools: 30,
  csfundamentals: 30,
  css: 68,
  database: 90,
  designpatterns: 30,
  devops: 30,
  frontendsystemdesign: 30,
  git: 50,
  html: 53,
  javascript: 124,
  networking: 30,
  nextjs: 94,
  nodejs: 39,
  performance: 30,
  pwa: 30,
  pyai: 33,
  pybackend: 37,
  pydata: 35,
  python: 35,
  react: 99,
  reactnative: 111,
  seo: 30,
  softwarearchitecture: 30,
  testing: 30,
  typescript: 82,
  websecurity: 31,
};

export const STUDY_TOPIC_TOTAL = Object.values(STUDY_TOPIC_COUNTS).reduce((a, b) => a + b, 0);
