export const STUDY_CATEGORIES = [
  { id: "html",       label: "HTML",          icon: "🌐", color: "#e34c26" },
  { id: "css",        label: "CSS",           icon: "🎨", color: "#264de4" },
  { id: "javascript", label: "JavaScript",    icon: "⚡", color: "#f7df1e" },
  { id: "react",      label: "React",         icon: "⚛️",  color: "#61dafb" },
  { id: "reactnative",label: "React Native",  icon: "📱", color: "#0fa5e9" },
  { id: "nextjs",     label: "Next.js",       icon: "▲",  color: "#fff" },
  { id: "typescript", label: "TypeScript",    icon: "🔷", color: "#3178c6" },
];

export const STUDY_TOPICS = [
  // ─── HTML ────────────────────────────────────────────────────────────────────
  {
    id: "html-semantic",
    category: "html",
    title: "Semantic HTML",
    difficulty: "Basic",
    summary: "Using HTML elements that convey meaning about the content they contain.",
    explanation:
      "Semantic HTML uses elements like <article>, <section>, <nav>, <header>, <footer>, <main>, <aside> to describe the meaning of content, not just how it looks. This improves SEO (search engines understand structure), accessibility (screen readers navigate landmarks), and code readability.\n\nNon-semantic: <div id='nav'> — tells nothing.\nSemantic: <nav> — tells everything.",
    keyPoints: [
      "<main> wraps the primary content — only one per page",
      "<article> = self-contained, shareable content (blog post, card)",
      "<section> = thematic grouping within a page",
      "<aside> = related but not essential content (sidebars, callouts)",
      "<figure> + <figcaption> for images with descriptions",
      "Use <button> for actions, <a> for navigation — never swap them",
    ],
    code: `<!-- Non-semantic (bad) -->
<div class="header">
  <div class="nav">...</div>
</div>

<!-- Semantic (good) -->
<header>
  <nav>
    <ul>
      <li><a href="/about">About</a></li>
    </ul>
  </nav>
</header>

<main>
  <article>
    <h1>Post Title</h1>
    <p>Content...</p>
  </article>
</main>`,
    interviewTip:
      "Interviewers want to know WHY, not just WHAT. Say: semantic HTML improves screen reader navigation via ARIA landmarks, boosts SEO because crawlers weigh semantic tags more heavily, and makes the codebase self-documenting.",
  },
  {
    id: "html-forms",
    category: "html",
    title: "Forms & Accessibility",
    difficulty: "Basic",
    summary: "Building accessible, validated HTML forms correctly.",
    explanation:
      "Forms are one of the most commonly misused HTML features. Key rules: every input needs a <label> (not just placeholder), use the correct input type so mobile shows the right keyboard, use fieldset/legend for grouped inputs, and leverage built-in HTML5 validation before reaching for JS.",
    keyPoints: [
      "Always use <label for='id'> — placeholder is NOT a label",
      "input types: email, tel, number, url, date, password, search",
      "required, minlength, maxlength, pattern for native validation",
      "aria-describedby to link error messages to inputs",
      "novalidate on <form> to control validation manually in JS",
      "autocomplete attribute improves UX and is required for accessibility",
    ],
    code: `<form novalidate>
  <div>
    <label for="email">Email</label>
    <input
      id="email"
      type="email"
      autocomplete="email"
      required
      aria-describedby="email-error"
    />
    <span id="email-error" role="alert"></span>
  </div>

  <fieldset>
    <legend>Preferred contact</legend>
    <label><input type="radio" name="contact" value="email"> Email</label>
    <label><input type="radio" name="contact" value="phone"> Phone</label>
  </fieldset>
</form>`,
    interviewTip:
      "A common trick question: 'What's wrong with using placeholder as a label?' Answer: placeholders disappear on input, have poor color contrast by default, aren't read the same way by screen readers, and don't persist for review before submission.",
  },
  {
    id: "html-meta",
    category: "html",
    title: "Meta Tags & SEO",
    difficulty: "Basic",
    summary: "Head tags that control how pages appear in search engines and social shares.",
    explanation:
      "Meta tags live in <head> and are invisible to users but critical for SEO, social sharing, and browser behavior. The most important ones: charset, viewport (mobile responsiveness), description (search snippet), og:* tags (social cards), and canonical (duplicate content prevention).",
    keyPoints: [
      "charset='UTF-8' should always be first in <head>",
      "viewport meta is required for responsive design",
      "description is shown in Google search results (150–160 chars)",
      "og:title, og:description, og:image control Facebook/Twitter cards",
      "canonical prevents duplicate content penalties",
      "robots meta controls indexing (noindex, nofollow)",
    ],
    code: `<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content="Learn React hooks in 10 minutes." />

  <!-- Open Graph (social sharing) -->
  <meta property="og:title" content="React Hooks Guide" />
  <meta property="og:description" content="Master hooks today." />
  <meta property="og:image" content="https://example.com/og.png" />
  <meta property="og:type" content="article" />

  <!-- Canonical URL -->
  <link rel="canonical" href="https://example.com/react-hooks" />

  <title>React Hooks Guide</title>
</head>`,
    interviewTip:
      "Know the difference: <title> affects browser tab + Google title. og:title affects social share cards. They can and often should be different — og:title can be more clickbait-friendly.",
  },
  {
    id: "html-storage",
    category: "html",
    title: "Web Storage & Cookies",
    difficulty: "Intermediate",
    summary: "localStorage, sessionStorage, and cookies — when to use each.",
    explanation:
      "Three ways to persist data in the browser: localStorage (survives browser close, ~5MB, same origin), sessionStorage (cleared on tab close, ~5MB), cookies (sent with every HTTP request, ~4KB, configurable expiry, can be secured with HttpOnly/Secure flags). Cookies are the only one the server can read.",
    keyPoints: [
      "localStorage: persistent, 5MB, not sent to server, JS only",
      "sessionStorage: tab-scoped, cleared on close, 5MB",
      "cookies: sent with requests, ~4KB, server can set/read",
      "HttpOnly cookie = JS cannot read it (protects from XSS)",
      "Secure cookie = only sent over HTTPS",
      "SameSite=Strict/Lax prevents CSRF attacks",
    ],
    code: `// localStorage
localStorage.setItem('token', 'abc123');
const token = localStorage.getItem('token');
localStorage.removeItem('token');

// sessionStorage
sessionStorage.setItem('draft', JSON.stringify(data));

// Reading cookies
document.cookie = "theme=dark; path=/; max-age=86400; SameSite=Lax";
// For auth tokens — prefer HttpOnly cookies (set by server)
// so JS cannot access them at all (XSS protection)`,
    interviewTip:
      "Auth interview question: 'Where do you store JWTs?' Best answer: HttpOnly cookies (XSS-safe, auto-sent). Acceptable: memory (lost on refresh). Avoid: localStorage (vulnerable to XSS). This shows security awareness.",
  },
  {
    id: "html-accessibility",
    category: "html",
    title: "ARIA & Accessibility",
    difficulty: "Intermediate",
    summary: "Making web content usable by people with disabilities using ARIA attributes.",
    explanation:
      "ARIA (Accessible Rich Internet Applications) extends HTML with attributes that help screen readers understand dynamic content. Rule #1: don't use ARIA if native HTML already provides semantics. Rule #2: all interactive ARIA elements must be keyboard accessible. Rule #3: keep aria-labels short and descriptive.",
    keyPoints: [
      "aria-label: names an element when visible text isn't enough",
      "aria-labelledby: points to another element as the label",
      "aria-describedby: adds supplemental description",
      "aria-hidden='true': removes element from accessibility tree",
      "role='alert': announces dynamic content changes",
      "aria-expanded, aria-selected for interactive components",
      "tabindex='0' makes element keyboard focusable",
    ],
    code: `<!-- Icon button with no visible text -->
<button aria-label="Close dialog">
  <svg aria-hidden="true">...</svg>
</button>

<!-- Loading state -->
<div role="status" aria-live="polite">
  {loading ? 'Loading results...' : ''}
</div>

<!-- Custom accordion -->
<button
  aria-expanded={isOpen}
  aria-controls="section-1"
>
  Toggle Section
</button>
<div id="section-1" hidden={!isOpen}>
  Content here
</div>`,
    interviewTip:
      "Don't just list ARIA attributes. Show you know the hierarchy: 1. Use semantic HTML first. 2. Use CSS to make it visible/hidden. 3. Only then add ARIA. Saying 'ARIA is a last resort' signals experience.",
  },

  // ─── CSS ────────────────────────────────────────────────────────────────────
  {
    id: "css-box-model",
    category: "css",
    title: "Box Model",
    difficulty: "Basic",
    summary: "How every element's size is calculated: content + padding + border + margin.",
    explanation:
      "Every HTML element is a rectangular box. By default (content-box), width/height apply to the content area only — padding and border are added ON TOP. With box-sizing: border-box (the sane default), width includes padding and border. Always set border-box globally.",
    keyPoints: [
      "content-box (default): width = content only",
      "border-box: width = content + padding + border",
      "margin collapses vertically between siblings (not horizontally)",
      "Padding creates space inside the border, margin outside",
      "outline does not affect layout (unlike border)",
      "box-sizing: border-box is now considered best practice",
    ],
    code: `/* Always set this globally */
*, *::before, *::after {
  box-sizing: border-box;
}

.box {
  width: 200px;
  padding: 20px;
  border: 2px solid black;

  /* content-box: actual width = 200 + 40 + 4 = 244px */
  /* border-box:  actual width = 200px exactly */
}

/* Margin collapse example */
.a { margin-bottom: 20px; }
.b { margin-top: 30px; }
/* Gap between them = 30px, NOT 50px */`,
    interviewTip:
      "Margin collapse is a common gotcha. Vertical margins between adjacent block elements collapse to the larger value. Flex and grid children do NOT collapse margins. Being able to explain this precisely signals strong CSS fundamentals.",
  },
  {
    id: "css-flexbox",
    category: "css",
    title: "Flexbox",
    difficulty: "Basic",
    summary: "One-dimensional layout for distributing space along a row or column.",
    explanation:
      "Flexbox is designed for one-axis layouts (either row or column). The parent becomes a flex container, children become flex items. Key concept: the main axis is controlled by flex-direction, the cross axis is perpendicular. justify-content aligns on the main axis, align-items on the cross axis.",
    keyPoints: [
      "justify-content: main axis (row→horizontal, column→vertical)",
      "align-items: cross axis alignment",
      "align-self: override for a single item",
      "flex: 1 means flex-grow:1, flex-shrink:1, flex-basis:0",
      "flex-wrap: wrap allows items to wrap to next line",
      "gap replaces margin hacks between flex items",
      "order property changes visual order without changing DOM",
    ],
    code: `/* Classic centering */
.center {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Navbar pattern */
.nav {
  display: flex;
  align-items: center;
  gap: 16px;
}
.nav .spacer { flex: 1; } /* pushes right items to end */

/* Card grid that fills space evenly */
.cards {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}
.card {
  flex: 1 1 280px; /* grow, shrink, min-width */
  max-width: 400px;
}`,
    interviewTip:
      "Know when NOT to use flexbox: when you need 2D control (use Grid). Common question: 'flex: 1' vs 'flex: auto' — flex:1 uses basis:0% (equal sizing), flex:auto uses basis:auto (size based on content).",
  },
  {
    id: "css-grid",
    category: "css",
    title: "CSS Grid",
    difficulty: "Intermediate",
    summary: "Two-dimensional layout system for rows AND columns simultaneously.",
    explanation:
      "Grid is the only CSS layout system that controls both rows and columns at once. Define tracks with grid-template-columns/rows, then place items with grid-column and grid-row. The fr unit distributes remaining space proportionally. Grid areas let you build page layouts visually.",
    keyPoints: [
      "fr unit: fraction of available space after fixed tracks",
      "repeat(3, 1fr) = 3 equal columns",
      "minmax(200px, 1fr) = min 200px, grows to fill",
      "grid-template-areas for named region layouts",
      "auto-fill vs auto-fit: auto-fit collapses empty tracks",
      "grid-column: 1 / -1 spans full width",
      "subgrid (new): child grid aligns to parent tracks",
    ],
    code: `/* 12-column responsive grid */
.layout {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 24px;
}
.sidebar { grid-column: 1 / 4; }
.content  { grid-column: 4 / 13; }

/* Named areas layout */
.page {
  display: grid;
  grid-template-areas:
    "header header"
    "sidebar main"
    "footer footer";
  grid-template-columns: 260px 1fr;
}
header { grid-area: header; }
aside  { grid-area: sidebar; }
main   { grid-area: main; }

/* Auto-responsive without media queries */
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}`,
    interviewTip:
      "The 'magic' one-liner for responsive grids: `repeat(auto-fit, minmax(280px, 1fr))` — no media queries needed. Interviewers love this. Also know: Grid for layout structure, Flexbox for component-level alignment.",
  },
  {
    id: "css-specificity",
    category: "css",
    title: "Specificity & Cascade",
    difficulty: "Intermediate",
    summary: "How the browser decides which CSS rule wins when multiple rules apply.",
    explanation:
      "Specificity is calculated as (inline, IDs, classes/attrs/pseudos, elements). The higher specificity wins. If equal, last rule in source order wins (cascade). !important overrides all specificity but should be avoided. The :is() and :where() selectors have useful specificity behaviors.",
    keyPoints: [
      "Inline styles: specificity (1,0,0,0) — highest except !important",
      "ID (#id): (0,1,0,0)",
      "Class (.class), [attr], :hover: (0,0,1,0)",
      "Element (div, p): (0,0,0,1)",
      ":where() has 0 specificity — great for resets",
      ":is() takes specificity of its most specific argument",
      "Avoid !important — it breaks the cascade and is hard to override",
    ],
    code: `/* Specificity values: (inline, id, class, element) */
div           /* (0,0,0,1) */
.card         /* (0,0,1,0) */
#main         /* (0,1,0,0) */
div.card      /* (0,0,1,1) */
#main .card p /* (0,1,1,1) */

/* :where() — zero specificity, easy to override */
:where(h1, h2, h3) {
  margin: 0;
}

/* :is() — takes highest specificity of list */
:is(#main, .section) h2 {
  /* specificity of #main = (0,1,0,1) */
}

/* Layer ordering (newer, powerful) */
@layer reset, base, components, utilities;
@layer utilities { color: red; } /* always wins in utilities layer */`,
    interviewTip:
      "Explain the 'specificity war' problem: when you keep adding IDs and !important to override things, the codebase becomes unmaintainable. Modern solution: CSS Layers (@layer) let you define specificity priority by order, not selector complexity.",
  },
  {
    id: "css-animations",
    category: "css",
    title: "Animations & Transitions",
    difficulty: "Intermediate",
    summary: "CSS transitions for state changes, keyframe animations for sequences.",
    explanation:
      "Transitions animate between two states (e.g., hover). Animations use @keyframes for multi-step sequences and can play automatically. For performance, only animate transform and opacity — these run on the GPU compositor thread and never trigger layout/paint.",
    keyPoints: [
      "Only animate transform & opacity for 60fps performance",
      "will-change: transform hints browser to create a composite layer",
      "transition shorthand: property duration timing-function delay",
      "animation: name duration timing fill-mode iteration-count",
      "prefers-reduced-motion media query for accessibility",
      "animation-fill-mode: forwards keeps final keyframe state",
    ],
    code: `/* Transition: simple hover */
.button {
  background: blue;
  transition: background 0.2s ease, transform 0.15s ease;
}
.button:hover {
  background: darkblue;
  transform: translateY(-2px);
}

/* Keyframe animation */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.card {
  animation: fadeInUp 0.4s ease forwards;
}

/* Respect reduced motion */
@media (prefers-reduced-motion: reduce) {
  * { animation-duration: 0.01ms !important; }
}`,
    interviewTip:
      "Performance question: 'Why does animating width cause jank?' Because width changes trigger layout (reflow) → paint → composite — all 3 stages. Animating transform skips to composite only. This is the difference between 60fps and janky animations.",
  },
  {
    id: "css-variables",
    category: "css",
    title: "CSS Custom Properties",
    difficulty: "Intermediate",
    summary: "Variables in CSS that cascade, can be updated with JS, and enable theming.",
    explanation:
      "CSS custom properties (--var-name) are different from preprocessor variables — they cascade through the DOM, can be changed at runtime with JS, and can be scoped to specific elements. This makes them perfect for theming, component-level customization, and dynamic values.",
    keyPoints: [
      "Define on :root for global, on element for scoped",
      "var(--name, fallback) — second argument is the fallback",
      "Can be updated with JS: el.style.setProperty('--color', 'red')",
      "Inherit through the DOM like any CSS property",
      "Can store any value: numbers, colors, calc() expressions",
      "@property registers typed custom properties (new)",
    ],
    code: `/* Theme system */
:root {
  --color-primary: #6366f1;
  --color-bg: #0f172a;
  --spacing-md: 16px;
  --radius: 12px;
}

[data-theme="light"] {
  --color-bg: #ffffff;
  --color-text: #0f172a;
}

.button {
  background: var(--color-primary);
  padding: var(--spacing-md);
  border-radius: var(--radius);
}

/* Update from JS */
document.documentElement.style
  .setProperty('--color-primary', '#8b5cf6');

/* Typed property (newer) */
@property --angle {
  syntax: '<angle>';
  inherits: false;
  initial-value: 0deg;
}`,
    interviewTip:
      "Know the difference from Sass variables: CSS custom properties are dynamic (change at runtime, react to DOM changes). Sass variables are compiled away — gone at runtime. Ask: 'Can Sass variables enable a dark mode toggle without a page reload?' No. CSS variables can.",
  },

  // ─── JavaScript ─────────────────────────────────────────────────────────────
  {
    id: "js-closures",
    category: "javascript",
    title: "Closures",
    difficulty: "Intermediate",
    summary: "A function that remembers variables from its outer scope even after that scope has exited.",
    explanation:
      "A closure is created every time a function is defined. The inner function retains a reference (not a copy) to the variables in its enclosing scope. This is used for data privacy, factory functions, and memoization. It's one of the most tested JavaScript concepts.",
    keyPoints: [
      "Closure = function + its lexical environment",
      "Inner function has access to outer function's variables after outer returns",
      "Variables are captured by reference, not by value",
      "Classic bug: closures in loops capturing `i` (use let or IIFE)",
      "Used for: private variables, currying, memoization, event handlers",
      "Memory: closures keep outer scope alive — potential memory leak",
    ],
    code: `// Factory function using closure
function makeCounter(start = 0) {
  let count = start; // private variable

  return {
    increment: () => ++count,
    decrement: () => --count,
    value: () => count,
  };
}
const counter = makeCounter(10);
counter.increment(); // 11
counter.increment(); // 12
counter.value();     // 12

// Classic loop bug
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100); // prints 3,3,3
}
// Fix with let (block scoped)
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100); // prints 0,1,2
}`,
    interviewTip:
      "Be ready for: 'What does this print?' with loop + setTimeout code. The answer demonstrates you understand closures capture references. Also: React's stale closure problem in useEffect is a direct consequence of closures.",
  },
  {
    id: "js-promises",
    category: "javascript",
    title: "Promises & Async/Await",
    difficulty: "Intermediate",
    summary: "Handling asynchronous operations cleanly without callback hell.",
    explanation:
      "A Promise represents a future value — pending, fulfilled, or rejected. async/await is syntactic sugar over Promises. Key: await doesn't block the thread — it pauses the async function and lets other code run. Always handle rejections with try/catch or .catch().",
    keyPoints: [
      "Promise states: pending → fulfilled or rejected (terminal)",
      "async function always returns a Promise",
      "await can only be used inside async functions (or top-level modules)",
      "Promise.all: all must resolve (one fails = all fail)",
      "Promise.allSettled: waits for all, reports each result",
      "Promise.race: resolves/rejects with the first to settle",
      "Promise.any: resolves with first fulfilled, fails if all reject",
    ],
    code: `// Promise chain
fetch('/api/user')
  .then(res => res.json())
  .then(user => fetch('/api/posts/' + user.id))
  .then(res => res.json())
  .catch(err => console.error(err));

// async/await (cleaner)
async function loadUserPosts(userId) {
  try {
    const userRes = await fetch('/api/user/' + userId);
    const user = await userRes.json();

    const postsRes = await fetch('/api/posts/' + user.id);
    return await postsRes.json();
  } catch (err) {
    console.error('Failed:', err);
    throw err; // re-throw if needed
  }
}

// Parallel requests (not sequential)
const [users, posts] = await Promise.all([
  fetch('/api/users').then(r => r.json()),
  fetch('/api/posts').then(r => r.json()),
]);`,
    interviewTip:
      "Common mistake to highlight: awaiting in a loop (`for...of` with await) makes requests sequential. Use Promise.all() for parallel. Showing you know this difference demonstrates production experience.",
  },
  {
    id: "js-event-loop",
    category: "javascript",
    title: "Event Loop",
    difficulty: "Advanced",
    summary: "How JavaScript handles asynchronous code despite being single-threaded.",
    explanation:
      "JavaScript is single-threaded — one call stack. The event loop monitors the call stack and the task queues. When the call stack is empty, it picks the next task. Microtasks (Promises, queueMicrotask) run before macrotasks (setTimeout, setInterval, I/O). This is why a resolved Promise runs before a setTimeout(fn, 0).",
    keyPoints: [
      "Call stack: where synchronous code runs",
      "Web APIs: handle async operations (setTimeout, fetch) off-thread",
      "Macrotask queue: setTimeout, setInterval, I/O callbacks",
      "Microtask queue: Promise.then, queueMicrotask, MutationObserver",
      "Microtasks drain completely before next macrotask",
      "requestAnimationFrame runs before paint, after macrotasks",
    ],
    code: `console.log('1');                    // sync

setTimeout(() => console.log('2'), 0); // macrotask

Promise.resolve()
  .then(() => console.log('3'));        // microtask

console.log('4');                       // sync

// Output: 1, 4, 3, 2
// Reason:
// Sync runs first: 1, 4
// Microtasks drain: 3
// Macrotasks: 2

// Practical implication
async function example() {
  console.log('a');           // sync
  await Promise.resolve();    // yields to microtask queue
  console.log('b');           // runs after current sync finishes
}
example();
console.log('c');
// Output: a, c, b`,
    interviewTip:
      "This is a senior-level question. Walk through the queues step by step. The key insight: 'async/await is syntactic sugar over Promises, which are microtasks — so await doesn't block but defers to after current synchronous execution completes.'",
  },
  {
    id: "js-prototypes",
    category: "javascript",
    title: "Prototypes & Classes",
    difficulty: "Intermediate",
    summary: "JavaScript's inheritance model — prototype chains under the hood of ES6 classes.",
    explanation:
      "Every JS object has a [[Prototype]] (accessed via __proto__ or Object.getPrototypeOf). When you access a property, JS walks up the chain until it finds it or hits null. ES6 classes are syntactic sugar over this prototype system — they don't introduce a new OOP model.",
    keyPoints: [
      "Object.create(proto) creates object with specified prototype",
      "Class methods live on the prototype, not each instance",
      "Class fields (properties) live on the instance",
      "super() must be called before `this` in constructor",
      "static methods/properties belong to the class, not instances",
      "instanceof checks the prototype chain",
      "hasOwnProperty vs in: own vs inherited properties",
    ],
    code: `class Animal {
  #name; // private field

  constructor(name) {
    this.#name = name;
  }

  speak() {
    return \`\${this.#name} makes a sound\`;
  }

  static create(name) {
    return new Animal(name);
  }
}

class Dog extends Animal {
  #breed;

  constructor(name, breed) {
    super(name); // must be first
    this.#breed = breed;
  }

  speak() {
    return super.speak() + ' (woof!)';
  }
}

const d = new Dog('Rex', 'Labrador');
d.speak(); // 'Rex makes a sound (woof!)'
d instanceof Dog;   // true
d instanceof Animal; // true`,
    interviewTip:
      "Understanding that `class` is sugar over prototypes shows depth. Key point: class methods are on the prototype (shared, efficient). class fields are on the instance (per-object copy). This matters for memory in large lists.",
  },
  {
    id: "js-destructuring",
    category: "javascript",
    title: "Destructuring & Spread",
    difficulty: "Basic",
    summary: "Extracting values from arrays/objects and spreading iterables — modern JS fundamentals.",
    explanation:
      "Destructuring lets you unpack values in a single statement. The spread operator (...) expands iterables. The rest parameter collects remaining items. Together they enable clean function signatures, immutable updates, and elegant data transformation patterns.",
    keyPoints: [
      "Default values in destructuring: const { x = 10 } = obj",
      "Rename while destructuring: const { name: firstName } = user",
      "Nested destructuring for deep objects",
      "Rest element must be last: const [first, ...rest] = arr",
      "Spread creates shallow copies — nested objects are still references",
      "Object spread order matters — last value wins",
    ],
    code: `// Object destructuring with rename + default
const { name: fullName, age = 18, address: { city } } = user;

// Array destructuring
const [first, , third, ...rest] = [1, 2, 3, 4, 5];
// first=1, third=3, rest=[4,5]

// Swap variables
let a = 1, b = 2;
[a, b] = [b, a];

// Function parameters
function greet({ name, role = 'user' } = {}) {
  return \`Hello \${name} (\${role})\`;
}

// Immutable object update (common in Redux)
const updated = { ...user, name: 'New Name', updatedAt: Date.now() };

// Merge arrays
const merged = [...arr1, newItem, ...arr2];

// Remove a key from object
const { password, ...safeUser } = user;`,
    interviewTip:
      "React interviews test this heavily: props destructuring, useState return value destructuring, context. Also: 'what's the difference between spread and Object.assign?' Both do shallow copies, but spread is cleaner syntax and handles getters differently.",
  },
  {
    id: "js-this",
    category: "javascript",
    title: "\"this\" Keyword",
    difficulty: "Advanced",
    summary: "How JavaScript determines what `this` refers to — one of the most confusing JS concepts.",
    explanation:
      "`this` is determined by HOW a function is called, not where it's defined. 4 rules in order: new binding, explicit binding (call/apply/bind), method binding, default binding. Arrow functions have no `this` — they inherit from the enclosing lexical scope. This is why arrow functions solve many callback `this` problems.",
    keyPoints: [
      "Arrow functions: no own `this`, inherits from lexical scope",
      "Method call: obj.method() → this = obj",
      "Standalone call: fn() → this = undefined (strict) or window",
      "call/apply: explicitly set this + pass args",
      "bind: returns new function with locked this",
      "new: creates new object, sets this to it",
      "Class methods lose `this` when passed as callbacks",
    ],
    code: `const obj = {
  name: 'Test',

  // Regular method — this = obj when called as obj.method()
  regular() {
    return this.name;
  },

  // Arrow — this = whatever this was where obj was defined
  arrow: () => this?.name, // undefined in modules/strict

  // Common bug: losing this in callback
  async fetchData() {
    // this.name works here
    setTimeout(function() {
      // this.name — LOST (this = undefined in strict)
    }, 100);

    setTimeout(() => {
      // this.name — WORKS (arrow inherits this)
    }, 100);
  }
};

// bind
const greet = obj.regular.bind(obj);
greet(); // 'Test'

// call/apply
obj.regular.call({ name: 'Other' }); // 'Other'`,
    interviewTip:
      "The interview answer for 'what is this in an arrow function vs regular function' should end with: 'This is exactly why React event handlers and class components use arrow functions or .bind(this) in the constructor — to preserve the component instance as this.'",
  },
  {
    id: "js-modules",
    category: "javascript",
    title: "ES Modules",
    difficulty: "Basic",
    summary: "JavaScript's native module system for splitting code into reusable files.",
    explanation:
      "ES Modules (import/export) are static — imports are analyzed at compile time, enabling tree shaking. CommonJS (require/module.exports) is dynamic and older (Node.js). Named exports let you export multiple things; default export is the main thing a file exports. You can have both.",
    keyPoints: [
      "Named: export const fn = () => {} / import { fn } from './file'",
      "Default: export default fn / import fn from './file'",
      "Re-export: export { fn } from './other' for barrel files",
      "Dynamic import(): returns Promise, enables code splitting",
      "Modules are singletons — same instance across imports",
      "type='module' in script tag enables ES modules in browser",
      "Top-level await works in ES modules",
    ],
    code: `// math.js — named exports
export const add = (a, b) => a + b;
export const PI = 3.14159;

// utils.js — default + named
export default function formatDate(date) { ... }
export const parseDate = (str) => new Date(str);

// main.js
import formatDate, { parseDate } from './utils';
import { add, PI } from './math';
import * as MathUtils from './math'; // namespace import

// Barrel file (index.js)
export { add, PI } from './math';
export { default as formatDate } from './utils';

// Dynamic import (code splitting)
const module = await import('./heavy-module');
// Or in event handler:
button.onclick = async () => {
  const { Chart } = await import('./chart');
  new Chart(data);
};`,
    interviewTip:
      "Tree shaking question: 'Why do named exports enable tree shaking but CJS doesn't?' ES module imports are statically analyzable — bundlers know at build time what's used. CJS require() can be dynamic (require(condition ? 'a' : 'b')), so bundlers can't safely remove unused exports.",
  },

  // ─── React ──────────────────────────────────────────────────────────────────
  {
    id: "react-hooks",
    category: "react",
    title: "Core Hooks",
    difficulty: "Basic",
    summary: "useState, useEffect, useRef, useCallback, useMemo — the hooks you use every day.",
    explanation:
      "Hooks let functional components use state and lifecycle features. Rules: only call hooks at the top level (not inside conditions/loops), only call from React functions. The dependency array of useEffect/useCallback/useMemo controls when they re-run — empty [] = once on mount, omit = every render.",
    keyPoints: [
      "useState: synchronous setter, batched in React 18+",
      "useEffect cleanup: return a function to cancel subscriptions",
      "useRef: mutable box that doesn't trigger re-renders",
      "useCallback: memoize functions (referential stability)",
      "useMemo: memoize computed values",
      "Don't over-memoize — profiling first, optimize second",
      "useId() for generating accessible unique IDs",
    ],
    code: `// useState with functional update (avoids stale closures)
const [count, setCount] = useState(0);
setCount(prev => prev + 1); // always safe

// useEffect with cleanup
useEffect(() => {
  const controller = new AbortController();

  fetch('/api/data', { signal: controller.signal })
    .then(r => r.json())
    .then(setData);

  return () => controller.abort(); // cleanup on unmount
}, [id]); // re-run when id changes

// useRef: DOM access + persisting values
const inputRef = useRef(null);
const timerRef = useRef(null);

// DOM access
inputRef.current?.focus();

// Persist without re-render
timerRef.current = setTimeout(fn, 1000);

// useCallback for stable event handlers
const handleClick = useCallback((id) => {
  dispatch(selectItem(id));
}, [dispatch]); // stable as long as dispatch is stable`,
    interviewTip:
      "Common interview question: 'When does useEffect run?' Answer precisely: after every render where dependencies changed, after the DOM is painted (asynchronous). If you need it before paint: useLayoutEffect. This distinction matters for avoiding flickering.",
  },
  {
    id: "react-rendering",
    category: "react",
    title: "Rendering & Performance",
    difficulty: "Intermediate",
    summary: "How React decides when to re-render and how to optimize it.",
    explanation:
      "React re-renders a component when its state or props change. By default, re-rendering a parent re-renders all children. React.memo prevents re-renders when props haven't changed (shallow comparison). The key insight: unnecessary re-renders are usually fine — React is fast. Profile before optimizing.",
    keyPoints: [
      "React 18 batches all state updates automatically (even in async)",
      "React.memo: shallow props comparison to skip re-render",
      "Keys must be stable IDs — index as key causes bugs with reordering",
      "Concurrent features: useTransition, useDeferredValue for low-priority updates",
      "React DevTools Profiler to find actual bottlenecks",
      "Avoid creating objects/functions in JSX (unstable references)",
      "Context causes all consumers to re-render — split contexts",
    ],
    code: `// React.memo with custom comparator
const PostCard = React.memo(
  ({ post, onLike }) => <div>...</div>,
  (prev, next) =>
    prev.post.id === next.post.id &&
    prev.post.likes === next.post.likes
    // Only re-render if id or likes changed
);

// useTransition: keep UI responsive during heavy updates
const [isPending, startTransition] = useTransition();

function handleSearch(query) {
  setInputValue(query); // immediate
  startTransition(() => {
    setResults(filterLargeList(query)); // deferred
  });
}

// Expensive calculation — only recalculate when list changes
const sortedList = useMemo(
  () => [...items].sort(compareFn),
  [items]
);

// Virtualization for long lists
import { FixedSizeList } from 'react-window';
<FixedSizeList height={600} itemCount={10000} itemSize={50}>
  {({ index, style }) => <Row style={style} item={items[index]} />}
</FixedSizeList>`,
    interviewTip:
      "Senior question: 'How does React 18's Concurrent Mode change rendering?' Key points: React can now interrupt renders, prioritize user interactions, and batch async state updates. This is why useTransition exists — marking updates as low-priority so React can yield to urgent updates.",
  },
  {
    id: "react-context",
    category: "react",
    title: "Context & State Management",
    difficulty: "Intermediate",
    summary: "Sharing state across the tree without prop drilling — and when to reach for external libraries.",
    explanation:
      "Context solves prop drilling for values that need to be global (theme, auth, language). But every Context change re-renders all consumers. For frequently updating state (cart items, live data), use Zustand/Jotai/Redux Toolkit. Rule of thumb: Context for low-frequency global values, dedicated stores for high-frequency state.",
    keyPoints: [
      "createContext → Provider → useContext hook",
      "Context re-renders ALL consumers on value change",
      "Split contexts: AuthContext, ThemeContext, not one giant context",
      "Stable context value: memoize with useMemo to avoid re-renders",
      "Zustand: minimal boilerplate, subscription-based (efficient)",
      "Redux Toolkit: powerful for complex state with DevTools time-travel",
      "Jotai: atomic — only components using changed atoms re-render",
    ],
    code: `// Context with optimized value
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // Memoize to prevent re-renders when parent re-renders
  const value = useMemo(() => ({
    user,
    login: async (credentials) => { /* ... */ setUser(u); },
    logout: () => setUser(null),
  }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
};

// Zustand (when Context isn't enough)
const useStore = create((set) => ({
  count: 0,
  increment: () => set(state => ({ count: state.count + 1 })),
}));
// Only components that read count re-render`,
    interviewTip:
      "When asked 'Context vs Redux', don't just pick one. Say: 'Context is built-in and great for low-frequency values like theme and auth. For frequently updated state across many components, a library like Zustand avoids the performance pitfall of Context re-rendering all consumers.' Show you pick tools for their strengths.",
  },
  {
    id: "react-patterns",
    category: "react",
    title: "Component Patterns",
    difficulty: "Intermediate",
    summary: "Compound components, render props, custom hooks — patterns for reusable components.",
    explanation:
      "Component patterns solve the problem of building flexible, reusable components. Compound components share implicit state via Context. Custom hooks extract logic without JSX. Render props/children-as-function pass rendering control. The best pattern depends on the use case — don't over-engineer.",
    keyPoints: [
      "Custom hooks: extract and reuse stateful logic",
      "Compound components: Tab + TabPanel, Accordion + AccordionItem",
      "Controlled vs uncontrolled: who owns the state?",
      "Forwarding refs with React.forwardRef for component libraries",
      "Children as function (render props) for inversion of control",
      "Headless components: logic only, no UI (Radix, Headless UI)",
    ],
    code: `// Custom hook — reusable fetch logic
function useFetch(url) {
  const [data, setData]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    fetch(url, { signal: controller.signal })
      .then(r => r.json()).then(setData).catch(setError)
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [url]);

  return { data, loading, error };
}

// Compound component pattern
function Tabs({ children, defaultTab }) {
  const [active, setActive] = useState(defaultTab);
  return (
    <TabContext.Provider value={{ active, setActive }}>
      <div className="tabs">{children}</div>
    </TabContext.Provider>
  );
}
Tabs.List = function TabList({ children }) { ... };
Tabs.Panel = function TabPanel({ id, children }) {
  const { active } = useContext(TabContext);
  return active === id ? children : null;
};

// Usage
<Tabs defaultTab="a">
  <Tabs.List>...</Tabs.List>
  <Tabs.Panel id="a">Panel A</Tabs.Panel>
</Tabs>`,
    interviewTip:
      "Custom hooks are the most practical pattern to know. Show you extract logic correctly: the hook manages state and effects, returns data/handlers. The component is pure rendering. This separation makes testing much easier — you can test the hook independently.",
  },

  // ─── React Native ────────────────────────────────────────────────────────────
  {
    id: "rn-core",
    category: "reactnative",
    title: "Core Components",
    difficulty: "Basic",
    summary: "The building blocks: View, Text, Image, ScrollView, FlatList, TextInput.",
    explanation:
      "React Native has no div/p/img — everything maps to native components. View = div (but uses Flexbox by default, direction column). Text must wrap all strings. FlatList efficiently renders large lists with lazy loading. StyleSheet.create is preferred for performance (styles are validated at compile time and shared across renders).",
    keyPoints: [
      "All Views are Flex containers (direction: column by default)",
      "Text components cannot have block-level children — Text only",
      "FlatList: keyExtractor required, data + renderItem",
      "ScrollView loads all content — use FlatList for large lists",
      "SafeAreaView handles notches and status bars",
      "Pressable replaces TouchableOpacity (more flexible hit area)",
      "Image requires explicit width/height unless using flex",
    ],
    code: `import {
  View, Text, FlatList, Pressable,
  StyleSheet, SafeAreaView
} from 'react-native';

export default function App() {
  const data = Array.from({ length: 100 }, (_, i) => ({
    id: String(i),
    title: \`Item \${i}\`,
  }));

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => console.log(item.id)}
            style={({ pressed }) => [
              styles.item,
              pressed && styles.itemPressed,
            ]}
          >
            <Text style={styles.text}>{item.title}</Text>
          </Pressable>
        )}
        ItemSeparatorComponent={() => <View style={styles.sep} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:   { flex: 1 },
  item:        { padding: 16 },
  itemPressed: { opacity: 0.7, backgroundColor: '#f0f0f0' },
  text:        { fontSize: 16 },
  sep:         { height: 1, backgroundColor: '#eee' },
});`,
    interviewTip:
      "FlatList vs ScrollView: always FlatList for dynamic lists. FlatList virtualizes — only renders visible items. ScrollView renders everything at once. For 100+ items, ScrollView causes major performance issues. Know windowSize and initialNumToRender props for tuning.",
  },
  {
    id: "rn-navigation",
    category: "reactnative",
    title: "Navigation (React Navigation)",
    difficulty: "Intermediate",
    summary: "Stack, Tab, and Drawer navigators — how screens connect in React Native apps.",
    explanation:
      "React Navigation is the standard navigation library. Stack navigator pushes/pops screens. Tab navigator shows multiple root-level screens simultaneously. Nesting: tabs inside a stack lets you have global stack screens (like modals, detail pages) accessible from any tab. Params are passed via route.params.",
    keyPoints: [
      "Stack: push/pop with header and back gesture",
      "BottomTab: persistent tab bar with multiple root screens",
      "Drawer: side drawer navigation",
      "navigation.navigate vs navigation.push: push always adds a new screen",
      "route.params for passing data between screens",
      "navigation.setOptions() to update header title/buttons dynamically",
      "Deep linking config maps URLs to screen names",
    ],
    code: `// App structure: tabs inside stack
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Main"
          component={MainTabs}
          options={{ headerShown: false }}
        />
        {/* Accessible from any tab */}
        <Stack.Screen name="Detail" component={DetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Passing & receiving params
navigation.navigate('Detail', { id: '123', title: 'Post' });
const { id, title } = route.params;`,
    interviewTip:
      "Explain why you nest navigators: Tab screens need to be peers (same level in tab bar), but detail screens should appear ON TOP of whatever tab you're in. Nesting Stack → Tabs gives you a global stack layer above the tabs. This architecture question shows you understand navigation deeply.",
  },
  {
    id: "rn-platform",
    category: "reactnative",
    title: "Platform-Specific Code",
    difficulty: "Intermediate",
    summary: "Writing code that behaves differently on iOS and Android.",
    explanation:
      "React Native runs on both platforms but they have different UX conventions, APIs, and behaviors. Platform.OS gives you 'ios' or 'android'. Platform.select() is cleaner for objects. File extensions .ios.js and .android.js let you provide entirely different implementations. StyleSheet.hairlineWidth gives the thinnest native border.",
    keyPoints: [
      "Platform.OS === 'ios' | 'android' | 'web'",
      "Platform.select({ ios: x, android: y, default: z })",
      "File.ios.js and File.android.js — auto-picked by bundler",
      "KeyboardAvoidingView: behavior differs (padding/height/position)",
      "Shadow: iOS uses shadow*, Android uses elevation",
      "StatusBar component for controlling status bar appearance",
      "Haptics, permissions, and some APIs are platform-specific",
    ],
    code: `import { Platform, StyleSheet } from 'react-native';

// Inline check
const isIOS = Platform.OS === 'ios';

// Platform.select
const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },

  // Different keyboard behavior
  container: {
    flex: 1,
  }
});

// KeyboardAvoidingView
<KeyboardAvoidingView
  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
  style={{ flex: 1 }}
>
  <TextInput />
</KeyboardAvoidingView>

// Platform-specific files
// Button.ios.js   → used on iOS
// Button.android.js → used on Android
import Button from './Button'; // auto-picks the right one`,
    interviewTip:
      "Shadow vs elevation is a classic gotcha question. iOS uses 4 shadow properties. Android only has elevation (which also controls z-index stacking order). If a card looks right on one platform and flat on the other, this is why.",
  },

  // ─── Next.js ─────────────────────────────────────────────────────────────────
  {
    id: "nextjs-rendering",
    category: "nextjs",
    title: "Rendering Strategies",
    difficulty: "Intermediate",
    summary: "SSR, SSG, ISR, CSR — when to use each and why it matters.",
    explanation:
      "Next.js lets you choose rendering per page/component. SSG (Static Site Generation) generates HTML at build time — fastest, but stale data. SSR (Server-Side Rendering) generates on each request — fresh data, slower. ISR (Incremental Static Regeneration) = SSG + background revalidation on a schedule. CSR = traditional React (client fetches data).",
    keyPoints: [
      "SSG (generateStaticParams + fetch): build-time HTML, CDN-cached",
      "SSR (no-store fetch or dynamic): per-request, always fresh",
      "ISR: revalidate: 60 in fetch options — regenerates in background",
      "App Router: Server Components by default (no client JS sent)",
      "'use client' directive for interactivity",
      "Partial Prerendering (PPR): static shell + streaming dynamic parts",
      "Route handlers (app/api/route.ts) replace pages/api",
    ],
    code: `// SSG — generated at build, cached by CDN
// app/posts/[id]/page.tsx
export async function generateStaticParams() {
  const posts = await fetch('/api/posts').then(r => r.json());
  return posts.map(p => ({ id: p.id }));
}

async function PostPage({ params }) {
  const post = await fetch(\`/api/posts/\${params.id}\`, {
    next: { revalidate: 3600 } // ISR: regenerate every hour
  }).then(r => r.json());
  return <article>{post.content}</article>;
}

// SSR — run on every request
async function DashboardPage() {
  const data = await fetch('/api/live-data', {
    cache: 'no-store' // never cache = always SSR
  }).then(r => r.json());
  return <Dashboard data={data} />;
}

// Mixed: static shell + client interactivity
// page.tsx (Server Component)
export default function Page() {
  return (
    <main>
      <StaticHeader />       {/* server rendered */}
      <InteractiveChart />   {/* 'use client' component */}
    </main>
  );
}`,
    interviewTip:
      "The key decision framework: 1) Does the page change per user? → SSR or CSR. 2) Is data updated frequently? → ISR with short revalidate. 3) Is it purely static? → SSG. 4) Does it need interactivity? → Client Component. Mixing strategies in the App Router is the modern approach.",
  },
  {
    id: "nextjs-server-components",
    category: "nextjs",
    title: "Server vs Client Components",
    difficulty: "Advanced",
    summary: "The App Router's fundamental split: what runs on server vs client.",
    explanation:
      "Server Components (default in App Router) run on the server, stream HTML, have zero client JS bundle cost, and can directly access databases/files/secrets. Client Components ('use client') run in the browser and have access to state, effects, browser APIs, and event handlers. The mental model: Server = data fetching and layout, Client = interactivity.",
    keyPoints: [
      "Server Components: no useState, no useEffect, no browser APIs",
      "Client Components: can use all hooks, but cannot be async",
      "Server Components can import Client Components (not vice versa)",
      "Pass Server data to Client via props",
      "Only Client Components go in the JS bundle sent to browser",
      "Server Actions: async functions that run on server, called from client",
      "use server / use client are boundary directives, not file-level",
    ],
    code: `// Server Component (default — no directive needed)
// app/products/page.tsx
async function ProductsPage() {
  // Direct DB access — credentials never reach client
  const products = await db.query('SELECT * FROM products');

  return (
    <div>
      {products.map(p => (
        <ProductCard key={p.id} product={p}>
          {/* Client component inside server component — fine */}
          <AddToCartButton productId={p.id} />
        </ProductCard>
      ))}
    </div>
  );
}

// Client Component
'use client';
import { useState } from 'react';

export function AddToCartButton({ productId }) {
  const [added, setAdded] = useState(false);

  return (
    <button onClick={() => setAdded(true)}>
      {added ? 'Added!' : 'Add to Cart'}
    </button>
  );
}

// Server Action (runs on server, called from client)
'use server';
async function addToCart(productId) {
  await db.cart.insert({ productId, userId: session.userId });
  revalidatePath('/cart');
}`,
    interviewTip:
      "The most common interview mistake: 'Server Components are like SSR.' No — SSR renders the entire component tree to HTML per request. Server Components are a component-level primitive — they interleave with Client Components in the same tree, stream independently, and have zero client bundle cost.",
  },
  {
    id: "nextjs-routing",
    category: "nextjs",
    title: "App Router & Routing",
    difficulty: "Intermediate",
    summary: "File-based routing, layouts, loading states, error boundaries, and parallel routes.",
    explanation:
      "The App Router uses the file system as routes. Every folder with a page.tsx defines a route. layout.tsx wraps all children in the segment and persists across navigation. loading.tsx shows during async Server Component data fetching. error.tsx catches errors. Groups (parentheses) organize routes without affecting URLs.",
    keyPoints: [
      "page.tsx: unique UI for a route segment",
      "layout.tsx: shared UI that wraps pages + nested layouts",
      "loading.tsx: Suspense fallback for the segment",
      "error.tsx: error boundary for the segment",
      "not-found.tsx: custom 404 UI",
      "Route groups: (auth) folder — groups routes, no URL segment",
      "Dynamic: [id], Catch-all: [...slug], Optional: [[...slug]]",
      "Parallel routes (@slot): show multiple pages simultaneously",
    ],
    code: `app/
├── layout.tsx          # Root layout (html, body)
├── page.tsx            # / route
├── (marketing)/        # Route group — no URL impact
│   ├── about/page.tsx  # /about
│   └── blog/page.tsx   # /blog
├── (app)/              # Another group
│   ├── layout.tsx      # Shared layout for app routes
│   ├── dashboard/
│   │   ├── page.tsx    # /dashboard
│   │   └── loading.tsx # Loading UI while data fetches
│   └── settings/
│       ├── page.tsx    # /settings
│       └── error.tsx   # Error boundary
├── api/
│   └── users/
│       └── route.ts    # /api/users (GET, POST handlers)

// layout.tsx
export default function Layout({ children }) {
  return (
    <html>
      <body>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}

// route.ts (API)
export async function GET(request) {
  const users = await db.users.findAll();
  return Response.json(users);
}`,
    interviewTip:
      "Layouts are the biggest App Router concept to get right. Key: layouts persist between navigations in the same segment — they don't unmount and remount. This is intentional (preserves state like scroll position, form input). But it means layouts can't access route-specific data without being a Client Component using usePathname.",
  },

  // ─── TypeScript ──────────────────────────────────────────────────────────────
  {
    id: "ts-types-vs-interfaces",
    category: "typescript",
    title: "Types vs Interfaces",
    difficulty: "Basic",
    summary: "When to use type aliases vs interfaces — and the practical differences.",
    explanation:
      "Both define object shapes but with different capabilities. Interfaces support declaration merging (useful for extending third-party types) and are always extendable. Types are more flexible — can represent unions, intersections, tuples, and primitives. Modern preference: types for most things, interfaces for public API contracts.",
    keyPoints: [
      "Interfaces: extendable with extends, support declaration merging",
      "Types: can represent unions (A | B), intersections (A & B), tuples",
      "Declaration merging: define same interface twice to merge them",
      "Both can be used with implements in classes",
      "Type aliases can be used for primitives: type ID = string",
      "Prefer interface for objects that others extend; type for unions",
    ],
    code: `// Interface
interface User {
  id: string;
  name: string;
}
interface User { // declaration merging
  createdAt: Date;
}
// User now has all 3 properties

// Extends interface
interface Admin extends User {
  role: 'admin';
  permissions: string[];
}

// Type alias
type ID = string | number;
type Status = 'active' | 'inactive' | 'banned';

// Intersection
type AdminUser = User & { role: string };

// Tuple
type Pair = [string, number];

// Conditional type (only possible with type)
type IsString<T> = T extends string ? true : false;

// Union of literal types
type Direction = 'north' | 'south' | 'east' | 'west';`,
    interviewTip:
      "The real answer to 'types vs interfaces': they're mostly interchangeable for object shapes. The key difference: interfaces can be declaration-merged (useful when augmenting module types), types support union/intersection syntax. In practice: type for component props (often unions), interface for data models.",
  },
  {
    id: "ts-generics",
    category: "typescript",
    title: "Generics",
    difficulty: "Intermediate",
    summary: "Writing reusable, type-safe functions and components that work with any type.",
    explanation:
      "Generics let you write code that works with multiple types while preserving type safety. The type parameter (T) is like a variable for types — it's inferred from usage or explicitly provided. Constraints (extends) restrict what types T can be. They're used extensively in React (useState<Type>, useRef<HTMLElement>) and utilities.",
    keyPoints: [
      "T is conventional but any letter/word works: TData, TResponse",
      "Constraints: T extends string limits T to string subtypes",
      "Default type: function fn<T = string>() — T defaults to string",
      "Multiple type params: function merge<T, U>(a: T, b: U): T & U",
      "Infer keyword for extracting types from conditional types",
      "Generic React components need special syntax in .tsx files",
    ],
    code: `// Generic function
function identity<T>(value: T): T {
  return value;
}

// Generic with constraint
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

// Generic API response wrapper
interface ApiResponse<T> {
  data: T;
  error: string | null;
  loading: boolean;
}

// Generic hook
function useFetch<T>(url: string): ApiResponse<T> {
  const [data, setData] = useState<T | null>(null);
  // ...
  return { data, error, loading };
}

// Usage
const { data } = useFetch<User[]>('/api/users');
// data is inferred as User[] | null

// Generic React component (.tsx)
function List<T extends { id: string }>({
  items,
  renderItem,
}: {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
}) {
  return <ul>{items.map(item => <li key={item.id}>{renderItem(item)}</li>)}</ul>;
}`,
    interviewTip:
      "Generics question: 'Why use T extends object instead of any?' With T extends object you get: 1) type safety (TS errors on wrong types), 2) IntelliSense/autocomplete in the editor, 3) you constrain T while still being flexible. 'any' throws away all type information.",
  },
  {
    id: "ts-utility-types",
    category: "typescript",
    title: "Utility Types",
    difficulty: "Intermediate",
    summary: "Built-in TypeScript type transformers: Partial, Required, Pick, Omit, Record, and more.",
    explanation:
      "Utility types transform existing types into new ones without code duplication. Instead of redefining a type for every use case, you compose from a single source of truth. This is how TypeScript stays DRY for types. They're used heavily in real codebases for API types, form state, component props.",
    keyPoints: [
      "Partial<T>: all properties optional",
      "Required<T>: all properties required",
      "Readonly<T>: prevents mutation",
      "Pick<T, K>: select subset of properties",
      "Omit<T, K>: exclude properties",
      "Record<K, V>: dictionary/map type",
      "ReturnType<T>: infer return type of function",
      "Parameters<T>: infer function parameter types as tuple",
    ],
    code: `interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  createdAt: Date;
}

// PATCH endpoint — all fields optional
type UpdateUserDto = Partial<Omit<User, 'id' | 'createdAt'>>;

// Safe public user (no password)
type PublicUser = Omit<User, 'password'>;

// Form state
type UserForm = Pick<User, 'name' | 'email' | 'role'>;

// Dictionary
type UserMap = Record<string, User>;
const cache: UserMap = {};

// Extract function types
async function fetchUser(id: string): Promise<User> { ... }
type FetchReturn = Awaited<ReturnType<typeof fetchUser>>; // User
type FetchParams = Parameters<typeof fetchUser>;          // [string]

// Conditional utility types
type NonNullable<T> = T extends null | undefined ? never : T;

// Template literal types
type EventName = \`on\${Capitalize<string>}\`;`,
    interviewTip:
      "A practical example wins: 'We had a User type. For PATCH endpoints we needed all fields optional except id. Instead of copying the type, we used type UpdateDto = Partial<Omit<User, 'id'>>. When User changes, UpdateDto automatically updates.' This shows real-world application.",
  },
  {
    id: "ts-type-guards",
    category: "typescript",
    title: "Type Guards & Narrowing",
    difficulty: "Intermediate",
    summary: "Narrowing union types to specific types at runtime in a type-safe way.",
    explanation:
      "TypeScript narrows types inside conditionals. When you check `typeof x === 'string'`, TS knows x is a string inside that block. For object types, `in` operator and `instanceof` work. For custom narrowing, type predicates (value is Type) let you write your own guards. Discriminated unions are the most powerful pattern.",
    keyPoints: [
      "typeof: 'string' | 'number' | 'boolean' | 'object' | 'function'",
      "instanceof: for class instances",
      "in operator: check if property exists",
      "Type predicate: function guard(x): x is Type",
      "Discriminated union: shared literal property for narrowing",
      "never type: exhaustiveness checking — TS errors if case missed",
      "as const: literal types instead of widened types",
    ],
    code: `// Union type
type ApiResult = { success: true; data: User } | { success: false; error: string };

function handleResult(result: ApiResult) {
  if (result.success) {
    // TS knows: result.data exists here
    console.log(result.data.name);
  } else {
    // TS knows: result.error exists here
    console.error(result.error);
  }
}

// Custom type guard
function isUser(value: unknown): value is User {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'name' in value
  );
}

// Exhaustiveness checking with never
type Shape = Circle | Square | Triangle;

function area(shape: Shape): number {
  switch (shape.kind) {
    case 'circle':   return Math.PI * shape.radius ** 2;
    case 'square':   return shape.size ** 2;
    case 'triangle': return shape.base * shape.height / 2;
    default:
      const _exhaustive: never = shape;
      throw new Error('Unhandled shape: ' + _exhaustive);
  }
}`,
    interviewTip:
      "Discriminated unions + exhaustiveness checking is the pattern that makes TypeScript shine. When you add a new shape to the union, TypeScript immediately errors at the switch statement default case — it forces you to handle the new case. This is compile-time safety that catches bugs before runtime.",
  },
];
