// Auto-generated — 264 topics across 7 technologies
export const STUDY_CATEGORIES = [
  { id: "html",        label: "HTML",         icon: "\ud83c\udf10", color: "#e34c26", sources: [{ label: "W3Schools",       url: "https://www.w3schools.com/html/" }, { label: "MDN",             url: "https://developer.mozilla.org/en-US/docs/Web/HTML" }] },
  { id: "css",         label: "CSS",          icon: "\ud83c\udfa8", color: "#264de4", sources: [{ label: "W3Schools",       url: "https://www.w3schools.com/css/" },  { label: "MDN",             url: "https://developer.mozilla.org/en-US/docs/Web/CSS" }] },
  { id: "javascript",  label: "JavaScript",   icon: "\u26a1",        color: "#f7df1e", sources: [{ label: "MDN",             url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript" }, { label: "javascript.info", url: "https://javascript.info/" }] },
  { id: "typescript",  label: "TypeScript",   icon: "\ud83d\udd37", color: "#3178c6", sources: [{ label: "TypeScript Docs", url: "https://www.typescriptlang.org/docs/" }, { label: "W3Schools",    url: "https://www.w3schools.com/typescript/" }] },
  { id: "react",       label: "React",        icon: "\u269b\ufe0f", color: "#61dafb", sources: [{ label: "React Docs",      url: "https://react.dev/" }, { label: "W3Schools",               url: "https://www.w3schools.com/react/" }] },
  { id: "reactnative", label: "React Native", icon: "\ud83d\udcf1", color: "#0fa5e9", sources: [{ label: "RN Docs",         url: "https://reactnative.dev/docs/getting-started" }, { label: "Expo Docs",    url: "https://docs.expo.dev/" }] },
  { id: "nextjs",      label: "Next.js",      icon: "\u25b2",        color: "#000000", sources: [{ label: "Next.js Docs",    url: "https://nextjs.org/docs" }, { label: "Learn Next.js",          url: "https://nextjs.org/learn" }] },
  { id: "git",         label: "Git & GitHub", icon: "🐙",             color: "#f05032", sources: [{ label: "W3Schools",       url: "https://www.w3schools.com/git/" }, { label: "Git Docs",         url: "https://git-scm.com/doc" }] },
];

export const STUDY_TOPICS = [
  {
    id: "html-doctype-html5",
    category: "html",
    topic: "Document Structure",
    title: "DOCTYPE & HTML5",
    difficulty: "Basic",
    summary: `DOCTYPE declaration tells browser the HTML version`,
    explanation: `Browser enters quirks mode — mimics old IE5/Netscape rendering. Box model and layout differ.`,
    code: `<!DOCTYPE html>
<html lang='en'>
<head><meta charset='UTF-8'><meta name='viewport' content='width=device-width,initial-scale=1'></head>
<body></body>
</html>`,
    interviewQuestion: `What happens if you omit <!DOCTYPE html>?`,
  },
  {
    id: "html-head-vs-body",
    category: "html",
    topic: "Document Structure",
    title: "head vs body",
    difficulty: "Basic",
    summary: `<head> metadata vs <body> content`,
    explanation: `<link rel=stylesheet> and <script> without defer/async block rendering. Meta charset must be in first 1024 bytes.`,
    code: `<head>
  <meta charset='UTF-8'>
  <link rel='stylesheet' href='style.css'><!-- blocks -->
  <script defer src='app.js'></script><!-- doesn't block -->
</head>`,
    interviewQuestion: `What in <head> blocks rendering?`,
  },
  {
    id: "html-semantic-elements",
    category: "html",
    topic: "Semantics",
    title: "Semantic elements",
    difficulty: "Basic",
    summary: `article, section, nav, aside, header, footer, main`,
    explanation: `Screen readers, SEO crawlers, default browser styling, and code readability all benefit.`,
    code: `<main>
  <article>
    <header><h1>Title</h1></header>
    <section>Body</section>
  </article>
  <aside>Sidebar</aside>
</main>`,
    interviewQuestion: `Why use semantics instead of divs?`,
  },
  {
    id: "html-heading-hierarchy",
    category: "html",
    topic: "Semantics",
    title: "Heading hierarchy",
    difficulty: "Basic",
    summary: `h1-h6 represent document outline`,
    explanation: `Technically yes in HTML5 with sectioning elements, but screen readers and SEO tools still prefer a single h1 per page. Maintain logical order without skipping levels.`,
    code: `<!-- One h1, logical hierarchy -->
<h1>Page Title</h1>
  <h2>Section</h2>
    <h3>Subsection</h3>`,
    interviewQuestion: `Can you have multiple h1 tags?`,
  },
  {
    id: "html-figure-figcaption",
    category: "html",
    topic: "Semantics",
    title: "figure & figcaption",
    difficulty: "Basic",
    summary: `Groups media with caption`,
    explanation: `alt describes the image for screen readers when image fails to load. figcaption is visible supplementary info. They can have different content.`,
    code: `<figure>
  <img src='chart.png' alt='Bar chart showing Q4 revenue by region'>
  <figcaption>Figure 1: Q4 Revenue Breakdown</figcaption>
</figure>`,
    interviewQuestion: `When should alt and figcaption overlap?`,
  },
  {
    id: "html-details-summary",
    category: "html",
    topic: "Semantics",
    title: "details & summary",
    difficulty: "Basic",
    summary: `Native disclosure widget — no JS needed`,
    explanation: `Yes — native HTML, keyboard accessible, no JavaScript. Limited styling control is the main drawback.`,
    code: `<details>
  <summary>Show answer</summary>
  <p>The answer is 42.</p>
</details>`,
    interviewQuestion: `Does details/summary work for accordions?`,
  },
  {
    id: "html-dialog-element",
    category: "html",
    topic: "Semantics",
    title: "dialog element",
    difficulty: "Intermediate",
    summary: `Native modal dialog — no JS library needed`,
    explanation: `dialog element handles focus trapping, aria-modal, Escape key to close, and role=dialog automatically. Use showModal() not open attribute for modal behaviour.`,
    code: `<dialog id='modal'>
  <h2>Confirm Delete</h2>
  <p>Are you sure?</p>
  <button onclick='modal.close()'>Cancel</button>
  <button>Delete</button>
</dialog>
<button onclick='modal.showModal()'>Open</button>`,
    interviewQuestion: `What makes dialog accessible?`,
  },
  {
    id: "html-form-elements",
    category: "html",
    topic: "Forms",
    title: "Form elements",
    difficulty: "Basic",
    summary: `input, select, textarea, button, label, fieldset`,
    explanation: `id links to <label for='id'>. name is submitted with form data (the key in POST body). Both needed for accessible, functional forms.`,
    code: `<form method='POST' action='/submit'>
  <fieldset>
    <legend>Personal Info</legend>
    <label for='name'>Name</label>
    <input id='name' name='name' required>
  </fieldset>
  <button type='submit'>Send</button>
</form>`,
    interviewQuestion: `What is the difference between name and id on inputs?`,
  },
  {
    id: "html-input-types",
    category: "html",
    topic: "Forms",
    title: "Input types",
    difficulty: "Basic",
    summary: `text, email, number, date, range, file, checkbox, radio, password`,
    explanation: `No — input.value is always a string. Use input.valueAsNumber for a numeric value. Also: empty input gives NaN.`,
    code: `<input type='email' autocomplete='email'>
<input type='date' min='2024-01-01'>
<input type='range' min='0' max='100' step='5'>
<input type='file' accept='image/*' multiple>`,
    interviewQuestion: `Does type=number always return a number in JS?`,
  },
  {
    id: "html-validation",
    category: "html",
    topic: "Forms",
    title: "Validation",
    difficulty: "Intermediate",
    summary: `required, pattern, min, max, minlength, maxlength, novalidate`,
    explanation: `When form has novalidate attribute, input has formnovalidate, or form is submitted via JavaScript (form.submit()). Always validate server-side.`,
    code: `<input type='email' required autocomplete='email'
  pattern='.+@company\\.com' title='Must be company email'>
<!-- Custom validation message -->
<input id='pass' oninvalid="this.setCustomValidity('8+ chars required')">
`,
    interviewQuestion: `When does HTML validation NOT fire?`,
  },
  {
    id: "html-aria-roles",
    category: "html",
    topic: "Accessibility",
    title: "ARIA roles",
    difficulty: "Intermediate",
    summary: `role, aria-label, aria-labelledby, aria-describedby`,
    explanation: `Don't use ARIA if native HTML element provides the semantics. A <button> is better than <div role='button'>. Native elements are accessible by default.`,
    code: `<button aria-label='Close dialog' aria-expanded='false'>
  <svg aria-hidden='true'><!-- icon --></svg>
</button>
<!-- aria-live for dynamic content -->
<div role='status' aria-live='polite' aria-atomic='true'>
  3 results found
</div>`,
    interviewQuestion: `First rule of ARIA?`,
  },
  {
    id: "html-tabindex",
    category: "html",
    topic: "Accessibility",
    title: "tabindex",
    difficulty: "Intermediate",
    summary: `Keyboard focus order control`,
    explanation: `0: adds to natural tab order at DOM position. -1: focusable via JS only, removed from tab flow. Positive values (1, 2...) create explicit order — generally avoid, causes confusion.`,
    code: `<div tabindex='0' role='button' onkeydown='handleKey(event)'>
  Keyboard focusable
</div>
<!-- Focus programmatically -->
<div tabindex='-1' id='modal-content'>
  <script>document.getElementById('modal-content').focus();</script>
</div>`,
    interviewQuestion: `What does tabindex=0 vs tabindex=-1 do?`,
  },
  {
    id: "html-alt-text",
    category: "html",
    topic: "Accessibility",
    title: "alt text",
    difficulty: "Basic",
    summary: `Image descriptions for screen readers`,
    explanation: `Decorative images (icons beside text that already explains them, visual separators). Never omit alt entirely — assistive tech reads the filename.`,
    code: `<img src='logo.svg' alt='Acme Corp'> <!-- meaningful -->
<img src='divider.png' alt=''>        <!-- decorative -->
<img src='btn-icon.svg' alt=''>       <!-- button text explains it -->
<button><img src='send.svg' alt=''>Send</button>`,
    interviewQuestion: `When should alt be empty?`,
  },
  {
    id: "html-skip-navigation",
    category: "html",
    topic: "Accessibility",
    title: "Skip navigation",
    difficulty: "Intermediate",
    summary: `Allow keyboard users to skip repetitive nav`,
    explanation: `Screen reader users can jump to landmarks. Keyboard-only users without AT still tab through every nav link. Skip link gives them a shortcut. Often hidden until focused.`,
    code: `<a href='#main-content' class='skip-link'>Skip to main content</a>
<nav>... many links ...</nav>
<main id='main-content'>...</main>`,
    interviewQuestion: `Why is skip nav needed if there's a nav landmark?`,
  },
  {
    id: "html-meta-tags",
    category: "html",
    topic: "Metadata",
    title: "meta tags",
    difficulty: "Basic",
    summary: `charset, viewport, description, og:, twitter:`,
    explanation: `Tells search crawlers not to index the page. Also: nofollow (don't follow links), noarchive (no cached copy).`,
    code: `<meta charset='UTF-8'>
<meta name='viewport' content='width=device-width, initial-scale=1'>
<meta name='description' content='Max 155 char description'>
<meta property='og:title' content='Page Title'>
<meta name='robots' content='noindex,nofollow'>`,
    interviewQuestion: `What does content='noindex' do?`,
  },
  {
    id: "html-resource-hints",
    category: "html",
    topic: "Performance",
    title: "Resource hints",
    difficulty: "Intermediate",
    summary: `preload, prefetch, preconnect, dns-prefetch`,
    explanation: `preload: high priority, needed NOW for current page. prefetch: low priority, likely needed on NEXT page. Wrong preload wastes mobile bandwidth.`,
    code: `<link rel='preconnect' href='https://fonts.googleapis.com'>
<link rel='preload' href='hero.webp' as='image'>
<link rel='preload' href='font.woff2' as='font' crossorigin>
<link rel='prefetch' href='/next-page.js'>`,
    interviewQuestion: `Difference between preload and prefetch?`,
  },
  {
    id: "html-script-loading",
    category: "html",
    topic: "Performance",
    title: "Script loading",
    difficulty: "Intermediate",
    summary: `defer, async, type=module`,
    explanation: `Module scripts are deferred by default, executed in order after DOM parse. They have their own scope (no global pollution) and use strict mode automatically.`,
    code: `<script defer src='a.js'></script>   <!-- order preserved -->
<script async src='analytics.js'></script> <!-- independent -->
<script type='module' src='app.js'></script> <!-- deferred + scoped -->`,
    interviewQuestion: `What does type=module do to script execution?`,
  },
  {
    id: "html-picture-element",
    category: "html",
    topic: "Media",
    title: "picture element",
    difficulty: "Intermediate",
    summary: `Art direction and format negotiation`,
    explanation: `Evaluates top-to-bottom, picks first where media matches AND type is supported. Order matters — put modern formats first.`,
    code: `<picture>
  <source media='(min-width:800px)' srcset='hero-lg.avif' type='image/avif'>
  <source media='(min-width:800px)' srcset='hero-lg.jpg'>
  <img src='hero-sm.jpg' alt='Hero' width='800' height='400'>
</picture>`,
    interviewQuestion: `How does browser choose which source to use?`,
  },
  {
    id: "html-canvas",
    category: "html",
    topic: "Media",
    title: "Canvas",
    difficulty: "Intermediate",
    summary: `Bitmap drawing API — scriptable 2D/3D graphics`,
    explanation: `Canvas: pixel manipulation, games, real-time data viz, large number of objects. SVG: scalable diagrams, interactive charts, icons, accessibility matters. SVG is DOM-based; Canvas is immediate-mode.`,
    code: `const ctx = document.querySelector('canvas').getContext('2d');
ctx.fillStyle = '#6366F1';
ctx.fillRect(10, 10, 100, 50);
ctx.beginPath();
ctx.arc(75, 75, 50, 0, Math.PI * 2);
ctx.fill();`,
    interviewQuestion: `When to use canvas vs SVG?`,
  },
  {
    id: "html-svg-inline",
    category: "html",
    topic: "Media",
    title: "SVG inline",
    difficulty: "Intermediate",
    summary: `Scalable Vector Graphics embedded in HTML`,
    explanation: `Inline SVG: styleable with CSS, animatable, accessible (add title/desc), no extra HTTP request. img src: cached separately, can't style internals.`,
    code: `<svg viewBox='0 0 24 24' width='24' height='24' aria-hidden='true'>
  <title>Home</title>
  <path d='M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z' fill='currentColor'/>
</svg>`,
    interviewQuestion: `Advantage of inline SVG over img src?`,
  },
  {
    id: "html-accessible-tables",
    category: "html",
    topic: "Tables",
    title: "Accessible tables",
    difficulty: "Intermediate",
    summary: `thead, tbody, th scope, caption`,
    explanation: `scope='col' links header to column; scope='row' links to row. Without scope, screen readers may not correctly associate headers with data.`,
    code: `<table>
  <caption>Monthly Sales</caption>
  <thead><tr>
    <th scope='col'>Month</th>
    <th scope='col'>Revenue</th>
  </tr></thead>
  <tbody><tr>
    <th scope='row'>January</th><td>$10k</td>
  </tr></tbody>
</table>`,
    interviewQuestion: `What does scope attribute on th do?`,
  },
  {
    id: "html-custom-elements",
    category: "html",
    topic: "Web Components",
    title: "Custom elements",
    difficulty: "Advanced",
    summary: `Define reusable HTML elements with JS`,
    explanation: `Autonomous: extends HTMLElement, used as <my-btn>. Customized built-in: extends HTMLButtonElement, used as <button is='my-btn'>. Safari doesn't support customized built-in.`,
    code: `class MyCard extends HTMLElement {
  static observedAttributes = ['title'];
  connectedCallback() { this.render(); }
  attributeChangedCallback() { this.render(); }
  render() {
    this.innerHTML = \`<div class='card'><h2>\${this.getAttribute('title')}</h2><slot></slot></div>\`;
  }
}
customElements.define('my-card', MyCard);`,
    interviewQuestion: `What is the difference between autonomous and customized built-in elements?`,
  },
  {
    id: "html-shadow-dom",
    category: "html",
    topic: "Web Components",
    title: "Shadow DOM",
    difficulty: "Advanced",
    summary: `Encapsulated DOM subtree`,
    explanation: `Allows external CSS to style specific parts of a shadow DOM element that are exposed via part='name' attribute. The controlled escape hatch from encapsulation.`,
    code: `<!-- Inside shadow DOM -->
<button part='button'>Click</button>

/* External CSS */
my-btn::part(button) {
  background: #6366F1;
  color: white;
}`,
    interviewQuestion: `What is the ::part() pseudo-element?`,
  },
  {
    id: "html-void-elements",
    category: "html",
    topic: "Tricky",
    title: "Void elements",
    difficulty: "Tricky",
    summary: `Self-closing: br, img, input, hr, meta, link`,
    explanation: `In HTML (not XHTML), only void elements self-close. <script/> is treated as an open tag — all following content becomes script content.`,
    code: `<!-- CORRECT void elements -->
<br><img src='x.jpg' alt=''><input><hr><meta><link>
<!-- WRONG -- breaks page -->
<script src='app.js'/>
<!-- CORRECT -->
<script src='app.js'></script>`,
    interviewQuestion: `Why can't you self-close a script tag?`,
  },
  {
    id: "html-boolean-attributes",
    category: "html",
    topic: "Tricky",
    title: "Boolean attributes",
    difficulty: "Tricky",
    summary: `Presence means true regardless of value`,
    explanation: `No! Any value of disabled (including 'false', '0') disables the element. Remove the attribute entirely to enable.`,
    code: `<input disabled>        <!-- disabled -->
<input disabled='false'><!-- STILL disabled! -->
<input>                 <!-- enabled -->`,
    interviewQuestion: `Does disabled='false' enable the input?`,
  },
  {
    id: "html-inline-vs-block-containment",
    category: "html",
    topic: "Tricky",
    title: "Inline vs block containment",
    difficulty: "Tricky",
    summary: `Block elements can't be inside inline elements`,
    explanation: `HTML5 allows <a> to wrap block elements (transparent content model). But <a> inside <p> wrapping a div is still invalid — browser auto-corrects the DOM.`,
    code: `<!-- HTML5 valid: a wraps block elements -->
<a href='/'>
  <div class='card'>...</div>
</a>
<!-- Invalid: div inside p -->
<p><div>text</div></p>
<!-- DOM becomes: <p></p><div>text</div><p></p> -->`,
    interviewQuestion: `What happens with <a> wrapping block elements?`,
  },
  {
    id: "html-rel-noopener",
    category: "html",
    topic: "Tricky",
    title: "rel=noopener",
    difficulty: "Tricky",
    summary: `Security for target=_blank links`,
    explanation: `New tab gets window.opener reference — malicious page can redirect your page (reverse tabnapping). noopener severs the reference. Modern browsers auto-add noopener for _blank but add it explicitly for older browser support.`,
    code: `<a href='https://external.com'
   target='_blank'
   rel='noopener noreferrer'>External Link</a>`,
    interviewQuestion: `Why does target=_blank without noopener create a security risk?`,
  },
  {
    id: "html-data-attributes",
    category: "html",
    topic: "Tricky",
    title: "data attributes",
    difficulty: "Basic",
    summary: `Custom data storage on elements`,
    explanation: `Yes via attribute selectors and content property. Don't use them for visible content — use real text nodes for accessibility.`,
    code: `<div data-user-id='42' data-role='admin' data-state='active'></div>

/* CSS */
[data-state='active'] { outline: 2px solid green; }

// JS
el.dataset.userId;       // '42'
el.dataset.role = 'user'; // set
del el.dataset.role;     // remove`,
    interviewQuestion: `Are data attributes accessible in CSS?`,
  },
  {
    id: "html-time-element",
    category: "html",
    topic: "Semantics",
    title: "time element",
    difficulty: "Basic",
    summary: `Machine-readable date/time with human text`,
    explanation: `Machine-parseable datetime attribute enables calendar apps, search engines, screen readers, and microformats to extract dates reliably.`,
    code: `<time datetime='2024-12-25'>Christmas Day</time>
<time datetime='2024-12-25T09:00:00Z'>Dec 25 at 9am UTC</time>`,
    interviewQuestion: `Why use <time> instead of plain text for dates?`,
  },
  {
    id: "html-address-element",
    category: "html",
    topic: "Semantics",
    title: "address element",
    difficulty: "Basic",
    summary: `Contact information for nearest article/body ancestor`,
    explanation: `Not necessarily — it's for contact info of the author/owner of the nearest article or body. Physical address is one use case but also: email, phone, social.`,
    code: `<footer>
  <address>
    Written by <a href='mailto:author@dev.com'>Author</a>.
    Visit at <a href='https://devquiz.app'>DevQuiz</a>.
  </address>
</footer>`,
    interviewQuestion: `Is <address> for postal addresses?`,
  },
  {
    id: "html-srcset-sizes",
    category: "html",
    topic: "Semantics",
    title: "srcset & sizes",
    difficulty: "Intermediate",
    summary: `Responsive images with multiple resolutions`,
    explanation: `w (width descriptor): browser picks based on layout size × device DPR. x (pixel density): only considers device DPR, not layout. Use w descriptors with sizes for full responsive control.`,
    code: `<img
  src='img-400.jpg'
  srcset='img-400.jpg 400w, img-800.jpg 800w, img-1200.jpg 1200w'
  sizes='(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 33vw'
  alt='Responsive image'
  loading='lazy'
  decoding='async'
>`,
    interviewQuestion: `What is the difference between srcset with w descriptors vs x descriptors?`,
  },
  {
    id: "html-loading-lazy",
    category: "html",
    topic: "Performance",
    title: "loading=lazy",
    difficulty: "Basic",
    summary: `Native browser lazy loading for images and iframes`,
    explanation: `Supported in all modern browsers (Chrome 76+, Firefox 75+, Safari 15.4+). Add a JS polyfill or use Intersection Observer for older Safari. Always set explicit width/height to prevent CLS.`,
    code: `<img src='photo.jpg' alt='...' loading='lazy' decoding='async'
  width='800' height='600'>
<iframe src='video-embed.html' loading='lazy'></iframe>`,
    interviewQuestion: `Does loading=lazy work on all browsers?`,
  },
  {
    id: "html-contenteditable-pitfalls",
    category: "html",
    topic: "Tricky",
    title: "contenteditable pitfalls",
    difficulty: "Tricky",
    summary: `Browser differences in contenteditable behaviour`,
    explanation: `Chrome: <div>. Firefox: <br>. Safari: <br> or <div>. Use execCommand (deprecated) or intercept keydown and normalise. Better: use a rich text library (Tiptap, Slate, Quill).`,
    code: `// Normalise Enter to paragraph
el.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    e.preventDefault();
    document.execCommand('insertLineBreak'); // deprecated but works
    // Or: insert a <p> programmatically
  }
});`,
    interviewQuestion: `What HTML does Enter insert in contenteditable across browsers?`,
  },
  {
    id: "css-box-sizing",
    category: "css",
    topic: "Box Model",
    title: "box-sizing",
    difficulty: "Basic",
    summary: `content-box vs border-box`,
    explanation: `In content-box, padding and border add to declared width. border-box includes them — width is the total size. Far more intuitive for layouts.`,
    code: `*, *::before, *::after { box-sizing: border-box; }`,
    interviewQuestion: `Why is border-box almost always better?`,
  },
  {
    id: "css-margin-collapsing",
    category: "css",
    topic: "Box Model",
    title: "Margin collapsing",
    difficulty: "Tricky",
    summary: `Adjacent vertical margins merge to larger value`,
    explanation: `Yes. Flex/grid containers never collapse margins. Absolute/fixed positioned elements don't collapse. Block formatting context (overflow != visible) prevents collapse with parent.`,
    code: `/* These collapse to 20px, not 30px */
.a { margin-bottom: 20px; }
.b { margin-top: 10px; }
/* No collapse: flex, grid, overflow:hidden, padding on parent */
.flex { display: flex; }`,
    interviewQuestion: `Does flexbox prevent margin collapse?`,
  },
  {
    id: "css-outline-vs-border",
    category: "css",
    topic: "Box Model",
    title: "Outline vs border",
    difficulty: "Basic",
    summary: `Outline doesn't affect layout; border does`,
    explanation: `Removing outline removes keyboard focus visibility. Use custom outline styles, never remove without replacement. outline-offset adds space between outline and element.`,
    code: `/* Good focus style */
:focus-visible {
  outline: 2px solid #6366F1;
  outline-offset: 2px;
}
/* Remove for mouse only -- keeps keyboard visible */
:focus:not(:focus-visible) { outline: none; }`,
    interviewQuestion: `Why use outline for focus styles instead of outline:none?`,
  },
  {
    id: "css-specificity-calculation",
    category: "css",
    topic: "Specificity",
    title: "Specificity calculation",
    difficulty: "Intermediate",
    summary: `(id, class/attr/pseudo, element) tuple`,
    explanation: `ID always wins — IDs are (1,0,0) and no number of classes (0,1,0) can exceed an ID.`,
    code: `/* (1,0,0) -- ID */
#nav { color: red; }
/* (0,100,0) -- 100 classes -- STILL loses */
.a.b.c.d.e.f.g.h { color: blue; }
/* (0,0,0,1) -- always wins */
.x { color: green !important; }`,
    interviewQuestion: `Which wins: 1 ID or 100 classes?`,
  },
  {
    id: "css-cascade-layers",
    category: "css",
    topic: "Specificity",
    title: "Cascade layers",
    difficulty: "Advanced",
    summary: `@layer controls cascade order without specificity fights`,
    explanation: `Third-party CSS specificity battles. Define layers in order: @layer reset, base, theme, utilities — later layers always win regardless of specificity.`,
    code: `@layer reset, base, components, utilities;
@layer reset { * { margin: 0; padding: 0; } }
@layer base { body { font-family: sans-serif; } }
@layer utilities { .mt-4 { margin-top: 1rem; } }`,
    interviewQuestion: `What problem do cascade layers solve?`,
  },
  {
    id: "css-flexbox",
    category: "css",
    topic: "Layout",
    title: "Flexbox",
    difficulty: "Intermediate",
    summary: `1D layout — flex-direction, flex-wrap, justify-content, align-items`,
    explanation: `flex:1 = flex: 1 1 0 (basis 0 — share space proportionally). flex:auto = flex: 1 1 auto (basis = content size). flex:1 is usually what you want for equal columns.`,
    code: `/* Equal columns regardless of content */
.parent { display: flex; }
.child { flex: 1; }
/* Don't shrink below content */
.no-shrink { flex-shrink: 0; }
/* Center anything */
.center { display: flex; place-items: center; }`,
    interviewQuestion: `What does flex:1 vs flex:auto mean?`,
  },
  {
    id: "css-grid",
    category: "css",
    topic: "Layout",
    title: "Grid",
    difficulty: "Intermediate",
    summary: `2D layout — grid-template-columns/rows, grid-area`,
    explanation: `auto-fill: creates as many tracks as fit, leaving empty columns. auto-fit: collapses empty tracks — items stretch to fill. Use auto-fit for responsive cards.`,
    code: `/* Responsive cards -- no breakpoints needed */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}
/* Named areas */
.layout {
  grid-template-areas:
    'header header'
    'sidebar main'
    'footer footer';
}`,
    interviewQuestion: `What is the difference between auto-fill and auto-fit?`,
  },
  {
    id: "css-grid-subgrid",
    category: "css",
    topic: "Layout",
    title: "Grid subgrid",
    difficulty: "Advanced",
    summary: `Child grids inherit parent track sizes`,
    explanation: `Card grids where inner elements (title, body, footer) need to align across cards — without subgrid each card is an independent grid.`,
    code: `/* Parent grid */
.cards { display: grid; grid-template-columns: repeat(3, 1fr); }
/* Child uses parent tracks */
.card {
  display: grid;
  grid-template-rows: subgrid; /* inherits row tracks */
  grid-row: span 3;
}`,
    interviewQuestion: `When do you need subgrid?`,
  },
  {
    id: "css-positioning",
    category: "css",
    topic: "Layout",
    title: "Positioning",
    difficulty: "Intermediate",
    summary: `static, relative, absolute, fixed, sticky`,
    explanation: `Nearest ancestor with position != static (or with transform/filter/will-change). If none, it's the initial containing block (viewport).`,
    code: `/* Relative = containing block for absolute child */
.parent { position: relative; }
.child  { position: absolute; top: 0; right: 0; }
/* Sticky stops at its scroll container edge */
.header {
  position: sticky;
  top: 0;
  z-index: 10;
}`,
    interviewQuestion: `What is a containing block for absolute positioning?`,
  },
  {
    id: "css-stacking-context",
    category: "css",
    topic: "Layout",
    title: "Stacking context",
    difficulty: "Tricky",
    summary: `Determines z-index scope`,
    explanation: `position+z-index, opacity<1, transform, filter, will-change, isolation:isolate, contain:layout|paint. Child z-index is relative to its stacking context — can't exceed parent's stack.`,
    code: `/* isolation:isolate creates context without visual side effects */
.modal-container { isolation: isolate; }
.modal { z-index: 100; } /* relative to .modal-container only */`,
    interviewQuestion: `What creates a new stacking context?`,
  },
  {
    id: "css-pseudo-classes",
    category: "css",
    topic: "Selectors",
    title: "Pseudo-classes",
    difficulty: "Intermediate",
    summary: `:hover, :focus, :nth-child, :is, :where, :has, :not`,
    explanation: `focus: any focus (click, keyboard, JS). focus-visible: only when browser decides focus ring is helpful (mainly keyboard/programmatic). Avoids showing ring for mouse clicks.`,
    code: `/* Show ring for keyboard -- not mouse click */
:focus-visible { outline: 2px solid #6366F1; }
:focus:not(:focus-visible) { outline: none; }
/* Parent selector */
.form:has(:invalid) .submit { opacity: 0.5; }`,
    interviewQuestion: `What is :focus-visible vs :focus?`,
  },
  {
    id: "css-nth-child-formulas",
    category: "css",
    topic: "Selectors",
    title: "nth-child formulas",
    difficulty: "Intermediate",
    summary: `an+b syntax for repeating patterns`,
    explanation: `Odd children (1,3,5...). 2n = even. 3n = every third. 4n+1 = 1,5,9... -n+3 = first 3 items.`,
    code: `/* Striped table */
tr:nth-child(even) { background: #f8fafc; }
/* First 3 items */
li:nth-child(-n+3) { font-weight: bold; }
/* Every 4th starting from 1 */
.item:nth-child(4n+1) { grid-column: 1; }`,
    interviewQuestion: `What does :nth-child(2n+1) select?`,
  },
  {
    id: "css-custom-properties",
    category: "css",
    topic: "Typography",
    title: "Custom properties",
    difficulty: "Intermediate",
    summary: `--var-name / var() — CSS variables`,
    explanation: `Yes, they inherit and cascade like normal properties. Set on :root for global scope. Override per component. Unlike preprocessor variables, they're live at runtime.`,
    code: `  :root {
  --color-primary: #6366F1;
  --radius: 0.5rem;
  --spacing: 1rem;
}
.dark { --color-primary: #818CF8; }
.btn {
  background: var(--color-primary);
  border-radius: var(--radius);
}`,
    interviewQuestion: `Do CSS custom properties cascade and inherit?`,
  },
  {
    id: "css-fluid-typography",
    category: "css",
    topic: "Typography",
    title: "Fluid typography",
    difficulty: "Advanced",
    summary: `clamp() for responsive text without breakpoints`,
    explanation: `clamp(min, preferred, max) — returns preferred unless below min or above max. Use viewport units as preferred for fluid scaling.`,
    code: `html { font-size: clamp(14px, 1rem + 0.5vw, 18px); }
h1   { font-size: clamp(1.5rem, 5vw, 3rem); }
/* Fluid spacing */
.section { padding: clamp(1rem, 5vw, 4rem); }`,
    interviewQuestion: `What are the three arguments to clamp()?`,
  },
  {
    id: "css-font-face",
    category: "css",
    topic: "Typography",
    title: "@font-face",
    difficulty: "Intermediate",
    summary: `Load custom fonts`,
    explanation: `font-display controls font loading behaviour: swap (FOUT — show fallback then swap), optional (use if cached, skip otherwise for performance), block (invisible text until font loads — bad UX).`,
    code: `@font-face {
  font-family: 'Inter';
  src: url('inter.woff2') format('woff2');
  font-weight: 100 900; /* variable font range */
  font-display: swap;
}`,
    interviewQuestion: `What is font-display and why does it matter?`,
  },
  {
    id: "css-transitions",
    category: "css",
    topic: "Animation",
    title: "Transitions",
    difficulty: "Basic",
    summary: `Smooth property changes on state change`,
    explanation: `Properties that trigger layout reflow: width, height, top, left, margin, padding. Use transform and opacity — GPU-composited, never trigger layout.`,
    code: `/* BAD: reflow per frame */
.bad  { transition: width 0.3s, margin 0.3s; }
/* GOOD: GPU composited */
.good { transition: transform 0.3s, opacity 0.3s; }
.good:hover { transform: translateX(10px); opacity: 0.8; }`,
    interviewQuestion: `Which properties kill GPU performance?`,
  },
  {
    id: "css-keyframes",
    category: "css",
    topic: "Animation",
    title: "@keyframes",
    difficulty: "Intermediate",
    summary: `Define multi-step animations`,
    explanation: `forwards: keeps last keyframe state after animation ends. backwards: applies first keyframe during delay. both: both forwards and backwards.`,
    code: `@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}
.appear {
  animation: fadeIn 0.4s ease-out both;
}`,
    interviewQuestion: `What is animation-fill-mode?`,
  },
  {
    id: "css-will-change",
    category: "css",
    topic: "Animation",
    title: "will-change",
    difficulty: "Advanced",
    summary: `Hint browser to promote element to compositor layer`,
    explanation: `will-change costs GPU memory per element. Applying to too many elements starves the GPU. Add it just before animation (JS), remove after. Don't put in CSS by default.`,
    code: `// Apply just before animation starts
el.style.willChange = 'transform';
animation.play();
animation.onfinish = () => { el.style.willChange = 'auto'; };`,
    interviewQuestion: `When is will-change harmful?`,
  },
  {
    id: "css-media-queries",
    category: "css",
    topic: "Responsive",
    title: "Media queries",
    difficulty: "Basic",
    summary: `Apply styles based on viewport/feature conditions`,
    explanation: `min-width = mobile-first (start small, scale up). max-width = desktop-first. Mobile-first produces leaner CSS and is recommended practice.`,
    code: `/* Mobile first */
.nav { flex-direction: column; }
@media (min-width: 768px)  { .nav { flex-direction: row; } }
@media (min-width: 1024px) { .nav { max-width: 1280px; margin: auto; } }`,
    interviewQuestion: `What is the difference between min-width and max-width?`,
  },
  {
    id: "css-container-queries",
    category: "css",
    topic: "Responsive",
    title: "Container queries",
    difficulty: "Advanced",
    summary: `Style based on container size, not viewport`,
    explanation: `Reusable components in different contexts — a card in sidebar vs main content sees different space. Media query sees viewport; container query sees parent size.`,
    code: `@container (min-width: 600px) {
  .card { display: grid; grid-template-columns: 1fr 2fr; }
}
.card-wrapper {
  container-type: inline-size;
  container-name: card;
}`,
    interviewQuestion: `When do container queries outperform media queries?`,
  },
  {
    id: "css-scroll-snap",
    category: "css",
    topic: "Responsive",
    title: "Scroll snap",
    difficulty: "Intermediate",
    summary: `Snap scrolling to specific positions`,
    explanation: `scroll-snap-type defines axis (x/y/both) and strictness (mandatory/proximity). mandatory always snaps; proximity snaps when close enough.`,
    code: `/* Horizontal slider */
.slider {
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
}
.slide {
  flex: 0 0 100%;
  scroll-snap-align: start;
}`,
    interviewQuestion: `What is scroll-snap-type?`,
  },
  {
    id: "css-has-parent-selector",
    category: "css",
    topic: "Modern CSS",
    title: ":has() parent selector",
    difficulty: "Advanced",
    summary: `Select parent based on children`,
    explanation: `:has() takes the specificity of its most specific argument. :has(.child) = class specificity (0,1,0). :has(#child) = ID specificity (1,0,0).`,
    code: `/* Card with image has no padding */
.card:has(img) { padding: 0; }
/* Label next to invalid input */
label:has(+ input:invalid) { color: red; }
/* Nav with open dropdown */
.nav:has(.dropdown[open]) { background: #1e293b; }`,
    interviewQuestion: `What is the specificity of :has()?`,
  },
  {
    id: "css-css-nesting",
    category: "css",
    topic: "Modern CSS",
    title: "CSS Nesting",
    difficulty: "Advanced",
    summary: `Native nesting without preprocessors (2023+)`,
    explanation: `& refers to the parent selector, just like Sass &. Without &, nested rules are treated as descendant selectors.`,
    code: `/* Native CSS nesting */
.card {
  padding: 1rem;
  &:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
  & .title { font-size: 1.25rem; }
  @media (min-width: 768px) { padding: 2rem; }
}`,
    interviewQuestion: `What is the & selector in CSS nesting?`,
  },
  {
    id: "css-inherit-vs-initial-vs-unset-vs-revert",
    category: "css",
    topic: "Tricky",
    title: "inherit vs initial vs unset vs revert",
    difficulty: "Tricky",
    summary: `CSS-wide keyword values`,
    explanation: `Rolls back all properties to browser's default stylesheet (user-agent styles). Useful for resetting a component completely to native browser appearance.`,
    code: `/* Reset to browser defaults */
.native-button { all: revert; }
/* Smart unset: inherit if inheritable, initial if not */
.clean { color: unset; border: unset; }`,
    interviewQuestion: `What does all:revert do?`,
  },
  {
    id: "css-css-logical-properties",
    category: "css",
    topic: "Tricky",
    title: "CSS logical properties",
    difficulty: "Advanced",
    summary: `Inline/block instead of directional top/left`,
    explanation: `Adapts to writing direction automatically. In RTL layouts, margin-inline-start is on the right — no [dir=rtl] overrides needed.`,
    code: `/* Adapts to RTL automatically */
.item {
  margin-inline-start: 1rem;  /* left in LTR, right in RTL */
  padding-block: 0.5rem;       /* top and bottom */
  border-inline-end: 1px solid;
}`,
    interviewQuestion: `Why use margin-inline-start instead of margin-left?`,
  },
  {
    id: "css-specificity-of-where-vs-is-vs-not",
    category: "css",
    topic: "Tricky",
    title: "Specificity of :where vs :is vs :not",
    difficulty: "Tricky",
    summary: `Different specificity for similar selectors`,
    explanation: `Zero — always. :is() takes specificity of its most specific argument. :not() also takes specificity of its argument.`,
    code: `/* Specificity 0 -- easy to override */
:where(h1,h2,h3) { margin: 0; }
/* Specificity of h1 = (0,0,1) */
:is(h1,h2,h3) { margin: 0; }
/* Specificity = (1,0,0) from #id */
:not(#id) { color: red; }`,
    interviewQuestion: `What's the specificity of :where()?`,
  },
  {
    id: "css-critical-css",
    category: "css",
    topic: "Performance",
    title: "Critical CSS",
    difficulty: "Advanced",
    summary: `Inline above-fold CSS to eliminate render blocking`,
    explanation: `<link rel=preload as=style onload='this.rel="stylesheet"'> loads CSS without blocking, switches to stylesheet when ready. Always include <noscript> fallback.`,
    code: `<style>/* critical CSS inlined */</style>
<link rel='preload' href='full.css' as='style'
  onload='this.onload=null;this.rel="stylesheet"'>
<noscript><link rel='stylesheet' href='full.css'></noscript>`,
    interviewQuestion: `What is the preload trick for stylesheets?`,
  },
  {
    id: "css-contain-property",
    category: "css",
    topic: "Performance",
    title: "Contain property",
    difficulty: "Advanced",
    summary: `Limit style/layout recalculation scope`,
    explanation: `contain:layout prevents child layout from affecting parent layout. contain:paint creates new stacking context and clips at border. contain:strict = layout + paint + size.`,
    code: `/* Dashboard widget: recalculate only when widget changes */
.widget {
  contain: layout paint;
  /* Child changes don't trigger parent reflow */
}`,
    interviewQuestion: `What is CSS containment?`,
  },
  {
    id: "css-view-transitions-api",
    category: "css",
    topic: "Modern CSS",
    title: "View Transitions API",
    difficulty: "Advanced",
    summary: `Animated page transitions with CSS — no JS framework`,
    explanation: `Browser-native page transition animations. Capture before/after states, animate between them with CSS. Works for SPA navigation and (Chrome 126+) cross-document navigation.`,
    code: `// Trigger transition
document.startViewTransition(() => {
  updateDOM(); // synchronous DOM update
});
/* CSS */
::view-transition-old(root) { animation: slide-out 0.3s ease; }
::view-transition-new(root) { animation: slide-in 0.3s ease; }
/* Named transitions */
.hero { view-transition-name: hero; }`,
    interviewQuestion: `What is the View Transitions API?`,
  },
  {
    id: "css-layer-with-tailwind",
    category: "css",
    topic: "Modern CSS",
    title: "@layer with Tailwind",
    difficulty: "Advanced",
    summary: `Cascade layers for utility-first CSS control`,
    explanation: `Wrap base/component styles in lower-priority layers. Tailwind v4 uses @layer natively.`,
    code: `/* Ensure utilities always win */
@layer base, components, utilities;
@layer base { body { font-family: sans-serif; } }
@layer components {
  .btn { padding: 0.5rem 1rem; border-radius: 0.5rem; }
}
/* Tailwind utilities are in @layer utilities -- always override */`,
    interviewQuestion: `How do you prevent Tailwind utilities from losing to component CSS?`,
  },
  {
    id: "css-color-mix-oklch",
    category: "css",
    topic: "Modern CSS",
    title: "color-mix() & oklch",
    difficulty: "Advanced",
    summary: `Modern CSS color functions`,
    explanation: `oklch (lightness, chroma, hue) is perceptually uniform — same numeric lightness means same perceived brightness across hues. HSL is not perceptually uniform — blue at 50% L looks darker than yellow at 50% L.`,
    code: `  :root {
  --primary: oklch(55% 0.2 264); /* indigo */
  /* Generate tints automatically */
  --primary-light: oklch(from var(--primary) calc(l + 20%) c h);
  --primary-dark:  oklch(from var(--primary) calc(l - 20%) c h);
}
/* Mix colors */
.overlay { background: color-mix(in oklch, #6366F1 70%, transparent); }`,
    interviewQuestion: `Why use oklch over hsl?`,
  },
  {
    id: "css-aspect-ratio",
    category: "css",
    topic: "Modern CSS",
    title: "aspect-ratio",
    difficulty: "Basic",
    summary: `Maintain element proportions without padding hacks`,
    explanation: `Padding-top hack: padding-top: 56.25% (for 16:9) on a relative container with absolute positioned content. aspect-ratio eliminates this completely.`,
    code: `/* 16:9 video container */
.video-wrapper { aspect-ratio: 16 / 9; width: 100%; }
/* Square avatar */
.avatar { width: 3rem; aspect-ratio: 1; border-radius: 50%; }
/* Intrinsic if content taller */
.card { aspect-ratio: 4 / 3 auto; }`,
    interviewQuestion: `What did we use before aspect-ratio?`,
  },
  {
    id: "css-css-anchoring",
    category: "css",
    topic: "Modern CSS",
    title: "CSS Anchoring",
    difficulty: "Advanced",
    summary: `Position elements relative to another element (CSS Anchor Positioning)`,
    explanation: `Positioning tooltips/popovers relative to their trigger — previously required JS to calculate coordinates. Now purely declarative CSS.`,
    code: `/* Chrome 125+ */
.trigger { anchor-name: --btn; }
.tooltip {
  position: absolute;
  position-anchor: --btn;
  bottom: calc(anchor(top) + 8px);
  left: anchor(center);
  transform: translateX(-50%);
}`,
    interviewQuestion: `What problem does CSS Anchor Positioning solve?`,
  },
  {
    id: "javascript-for-loop",
    category: "javascript",
    topic: "Loops",
    title: "for loop",
    difficulty: "Basic",
    summary: `Classic iteration with init, condition, increment`,
    explanation: `break exits the loop entirely. continue skips the current iteration and moves to the next. Both work in for, while, do-while, and for...of.`,
    code: `for (let i = 0; i < 5; i++) {
  if (i === 2) continue; // skip 2
  if (i === 4) break;    // stop at 4
  console.log(i); // 0 1 3
}`,
    interviewQuestion: `What is the difference between break and continue?`,
  },
  {
    id: "javascript-for-of",
    category: "javascript",
    topic: "Loops",
    title: "for...of",
    difficulty: "Basic",
    summary: `Iterate over iterables: arrays, strings, Maps, Sets`,
    explanation: `Plain objects — they are not iterable by default. Use for...in for keys, or Object.entries() with for...of. for...of works on anything with [Symbol.iterator].`,
    code: `for (const char of 'hello') console.log(char); // h e l l o
for (const [k, v] of new Map([['a',1]])) console.log(k, v);
for (const item of new Set([1,2,2,3])) console.log(item); // 1 2 3`,
    interviewQuestion: `What can you NOT iterate with for...of?`,
  },
  {
    id: "javascript-for-in",
    category: "javascript",
    topic: "Loops",
    title: "for...in",
    difficulty: "Tricky",
    summary: `Iterate over enumerable string keys of an object`,
    explanation: `It iterates prototype chain keys too, and key order isn't guaranteed for numeric indices in all engines. Use for...of or forEach for arrays.`,
    code: `const obj = { a: 1, b: 2 };
for (const key in obj) {
  if (Object.hasOwn(obj, key)) // skip prototype props
    console.log(key, obj[key]);
}`,
    interviewQuestion: `Why is for...in dangerous on arrays?`,
  },
  {
    id: "javascript-while-do-while",
    category: "javascript",
    topic: "Loops",
    title: "while & do-while",
    difficulty: "Basic",
    summary: `Condition-first vs body-first loops`,
    explanation: `When the body must execute at least once — e.g., prompt user until valid input, game loop, retry logic.`,
    code: `let i = 0;
while (i < 3) { console.log(i); i++; }

let input;
do {
  input = getInput();
} while (!isValid(input)); // always runs once`,
    interviewQuestion: `When does do-while make more sense than while?`,
  },
  {
    id: "javascript-foreach",
    category: "javascript",
    topic: "Loops",
    title: "forEach",
    difficulty: "Basic",
    summary: `Array method — iterate with callback`,
    explanation: `No. return inside forEach only exits the callback, not the loop. You cannot break out early. Use for...of if you need break/return, or .some() for early exit.`,
    code: `[1,2,3].forEach((n, index, arr) => {
  console.log(n, index);
  return; // only exits callback, loop continues
});
// Early exit trick
[1,2,3].some(n => { console.log(n); return n === 2; }); // stops at 2`,
    interviewQuestion: `Does forEach respect return or break?`,
  },
  {
    id: "javascript-switch-statement",
    category: "javascript",
    topic: "Control Flow",
    title: "switch statement",
    difficulty: "Basic",
    summary: `Multi-branch conditional on a single value`,
    explanation: `Without break, execution continues into the next case. Intentional fall-through shares code between cases. Accidental fall-through is a common bug.`,
    code: `switch (status) {
  case 'loading':
  case 'pending': // fall-through -- same handler
    showSpinner();
    break;
  case 'done':
    showData();
    break;
  default:
    showError();
}`,
    interviewQuestion: `What is fall-through in switch?`,
  },
  {
    id: "javascript-ternary-operator",
    category: "javascript",
    topic: "Control Flow",
    title: "Ternary operator",
    difficulty: "Basic",
    summary: `condition ? valueIfTrue : valueIfFalse`,
    explanation: `Technically yes, but deeply nested ternaries are hard to read. Prefer if/else or early return for complex logic.`,
    code: `const role = isAdmin ? 'admin' : isEditor ? 'editor' : 'viewer';
// Cleaner with if/else for > 2 branches`,
    interviewQuestion: `Can you nest ternaries?`,
  },
  {
    id: "javascript-try-catch-finally",
    category: "javascript",
    topic: "Control Flow",
    title: "try/catch/finally",
    difficulty: "Intermediate",
    summary: `Error handling in synchronous and async code`,
    explanation: `Yes. finally always runs — after try, catch, or even after return. The return value from finally overrides a return in try/catch.`,
    code: `async function load() {
  try {
    const data = await fetchData();
    return data;
  } catch (err) {
    if (err instanceof NetworkError) retry();
    else throw err; // re-throw unknown errors
  } finally {
    setLoading(false); // always runs
  }
}`,
    interviewQuestion: `Does finally run even after return in try?`,
  },
  {
    id: "javascript-optional-chaining-nullish",
    category: "javascript",
    topic: "Control Flow",
    title: "Optional chaining & nullish",
    difficulty: "Intermediate",
    summary: `?. and ?? for safe property access`,
    explanation: `?. short-circuits if value is null/undefined (returns undefined). ?? provides fallback for null/undefined only. Combine them: obj?.value ?? 'default'.`,
    code: `const street = user?.address?.street ?? 'No address';
const len = str?.trim()?.length ?? 0;
// Safe method call
const res = obj?.method?.() ?? [];`,
    interviewQuestion: `What is the difference between ?. and ??`,
  },
  {
    id: "javascript-map",
    category: "javascript",
    topic: "Arrays",
    title: "map",
    difficulty: "Basic",
    summary: `Transform each element, return new array`,
    explanation: `Yes. map, filter, reduce skip holes (empty slots) in sparse arrays. forEach also skips them. Array.from does not — fills with undefined.`,
    code: `const nums = [1, 2, 3];
const doubled = nums.map(n => n * 2); // [2, 4, 6]
// With index
const indexed = nums.map((n, i) => ({ index: i, value: n }));`,
    interviewQuestion: `Does map skip empty slots in sparse arrays?`,
  },
  {
    id: "javascript-filter",
    category: "javascript",
    topic: "Arrays",
    title: "filter",
    difficulty: "Basic",
    summary: `Keep elements passing predicate, return new array`,
    explanation: `Empty array [] — never null or undefined. Safe to chain.`,
    code: `const evens = [1,2,3,4].filter(n => n % 2 === 0); // [2,4]
const active = users.filter(u => u.active && u.role === 'admin');`,
    interviewQuestion: `What does filter return if nothing matches?`,
  },
  {
    id: "javascript-reduce",
    category: "javascript",
    topic: "Arrays",
    title: "reduce",
    difficulty: "Intermediate",
    summary: `Accumulate array into single value`,
    explanation: `TypeError: Reduce of empty array with no initial value. Always provide an initial value for safety.`,
    code: `const sum = [1,2,3].reduce((acc, n) => acc + n, 0); // 6
// Group by
const grouped = users.reduce((acc, u) => {
  (acc[u.role] ??= []).push(u);
  return acc;
}, {});`,
    interviewQuestion: `What happens if you call reduce on empty array without initial value?`,
  },
  {
    id: "javascript-find-findindex",
    category: "javascript",
    topic: "Arrays",
    title: "find & findIndex",
    difficulty: "Basic",
    summary: `Find first matching element/index`,
    explanation: `undefined. findIndex returns -1. Different from filter which returns [].`,
    code: `const user = users.find(u => u.id === 42); // or undefined
const idx = users.findIndex(u => u.id === 42); // or -1
const found = users.findLast(u => u.active); // from end (ES2023)`,
    interviewQuestion: `What does find return if nothing matches?`,
  },
  {
    id: "javascript-some-every",
    category: "javascript",
    topic: "Arrays",
    title: "some & every",
    difficulty: "Basic",
    summary: `Check if any/all elements match predicate`,
    explanation: `No. Both return boolean and stop early — some stops at first true, every stops at first false.`,
    code: `const hasAdmin = users.some(u => u.role === 'admin');
const allActive = users.every(u => u.active);
// Equivalent: !users.some(u => !u.active)`,
    interviewQuestion: `Does some or every mutate the array?`,
  },
  {
    id: "javascript-flat-flatmap",
    category: "javascript",
    topic: "Arrays",
    title: "flat & flatMap",
    difficulty: "Intermediate",
    summary: `Flatten nested arrays`,
    explanation: `Number of levels to flatten. flat() defaults to 1. flat(Infinity) fully flattens.`,
    code: `[[1,2],[3,[4,5]]].flat();    // [1,2,3,[4,5]]
[[1,2],[3,[4,5]]].flat(2);   // [1,2,3,4,5]
// flatMap = map then flat(1)
[1,2,3].flatMap(n => [n, n*2]); // [1,2,2,4,3,6]`,
    interviewQuestion: `What is the depth parameter in flat()?`,
  },
  {
    id: "javascript-sort",
    category: "javascript",
    topic: "Arrays",
    title: "sort",
    difficulty: "Tricky",
    summary: `Sort array in-place`,
    explanation: `Default sort converts elements to strings and sorts lexicographically. [10,9,2].sort() = [10,2,9]! Always provide a comparator for numbers.`,
    code: `// WRONG: lexicographic
[10, 2, 9].sort(); // [10, 2, 9]
// CORRECT: numeric
[10, 2, 9].sort((a, b) => a - b); // [2, 9, 10]
// Stable sort (guaranteed ES2019+)
users.sort((a, b) => a.name.localeCompare(b.name));`,
    interviewQuestion: `What is the default sort order and its pitfall?`,
  },
  {
    id: "javascript-splice-vs-slice",
    category: "javascript",
    topic: "Arrays",
    title: "splice vs slice",
    difficulty: "Tricky",
    summary: `Mutating vs non-mutating array operations`,
    explanation: `splice mutates in-place (returns removed elements). slice returns new array without mutating.`,
    code: `const arr = [1,2,3,4,5];
arr.splice(1, 2);       // removes 2 elements at index 1; arr = [1,4,5]
arr.splice(1, 0, 'a');  // insert 'a' at index 1
const copy = arr.slice(1, 3); // [4,5] -- no mutation`,
    interviewQuestion: `Which one mutates the original array?`,
  },
  {
    id: "javascript-array-from-array-of",
    category: "javascript",
    topic: "Arrays",
    title: "Array.from & Array.of",
    difficulty: "Intermediate",
    summary: `Create arrays from iterables and arguments`,
    explanation: `Array.from({length: N}, (_, i) => i) creates [0,1,...,N-1]. Array(N).fill(0) creates N zeros. Never use new Array(N) for values — creates sparse array.`,
    code: `Array.from('hello');           // ['h','e','l','l','o']
Array.from({length:5},(_,i)=>i); // [0,1,2,3,4]
Array.from(new Set([1,2,2]));  // [1,2]
Array.of(1,2,3);               // [1,2,3]`,
    interviewQuestion: `How do you create an array of N items?`,
  },
  {
    id: "javascript-includes-vs-indexof",
    category: "javascript",
    topic: "Arrays",
    title: "includes vs indexOf",
    difficulty: "Basic",
    summary: `Check membership`,
    explanation: `indexOf uses strict equality — can't find NaN (NaN !== NaN). includes uses SameValueZero — correctly finds NaN.`,
    code: `[1,NaN,3].includes(NaN);    // true
[1,NaN,3].indexOf(NaN);     // -1 (bug!)
[1,2,3].includes(2);         // true
[1,2,3].indexOf(2);          // 1 (index)`,
    interviewQuestion: `Why use includes instead of indexOf for NaN?`,
  },
  {
    id: "javascript-object-methods",
    category: "javascript",
    topic: "Objects",
    title: "Object methods",
    difficulty: "Basic",
    summary: `Create, assign, freeze, keys`,
    explanation: `freeze: no add, no delete, no modify. seal: no add, no delete, but CAN modify existing values. Both are shallow — nested objects are not frozen/sealed.`,
    code: `const cfg = Object.freeze({ db: 'mongo', port: 27017 });
cfg.port = 9999; // silently ignored (TypeError in strict mode)

const obj = Object.seal({ x: 1 });
obj.x = 2;   // allowed
obj.y = 3;   // silently ignored`,
    interviewQuestion: `What is Object.freeze vs Object.seal?`,
  },
  {
    id: "javascript-getters-setters",
    category: "javascript",
    topic: "Objects",
    title: "Getters & Setters",
    difficulty: "Intermediate",
    summary: `Computed properties with get/set`,
    explanation: `Getters look like properties — good for computed values derived from other properties (fullName from firstName+lastName). Setters add validation on assignment.`,
    code: `const user = {
  _name: 'Alice',
  get name() { return this._name.toUpperCase(); },
  set name(v) {
    if (typeof v !== 'string') throw TypeError();
    this._name = v.trim();
  }
};
user.name; // 'ALICE'
user.name = ' Bob '; // trimmed to 'Bob'`,
    interviewQuestion: `When would you use a getter instead of a method?`,
  },
  {
    id: "javascript-destructuring",
    category: "javascript",
    topic: "Objects",
    title: "Destructuring",
    difficulty: "Intermediate",
    summary: `Extract values from objects/arrays`,
    explanation: `Use colon: { oldName: newName } = obj. Combine with default: { name: displayName = 'Guest' } = user.`,
    code: `const { name: displayName = 'Guest', age = 0 } = user;
const [first, , third, ...rest] = arr;
// Nested
const { address: { city, zip } } = user;
// Function params
function draw({ x = 0, y = 0, color = 'black' } = {}) {}`,
    interviewQuestion: `How do you rename during destructuring?`,
  },
  {
    id: "javascript-spread-rest",
    category: "javascript",
    topic: "Objects",
    title: "Spread & Rest",
    difficulty: "Basic",
    summary: `... operator for expand and collect`,
    explanation: `No. Spread only copies own enumerable properties. Class instances lose their methods when spread into plain object.`,
    code: `const merged = { ...defaults, ...overrides };
const clone = { ...original }; // shallow copy
function sum(...nums) { return nums.reduce((a,n) => a+n, 0); }
sum(1, 2, 3, 4); // 10`,
    interviewQuestion: `Does spread copy prototype methods?`,
  },
  {
    id: "javascript-classes",
    category: "javascript",
    topic: "Objects",
    title: "Classes",
    difficulty: "Intermediate",
    summary: `ES6 class syntax over prototype`,
    explanation: `Yes, always. class body is always strict mode regardless of 'use strict'. Also: class declarations are NOT hoisted like function declarations (TDZ applies).`,
    code: `class Animal {
  #name; // private field
  constructor(name) { this.#name = name; }
  get name() { return this.#name; }
  speak() { return \`\${this.#name} makes a sound\`; }
  static create(name) { return new Animal(name); }
}
class Dog extends Animal {
  speak() { return super.speak() + ' (woof)'; }
}`,
    interviewQuestion: `Are class bodies in strict mode?`,
  },
  {
    id: "javascript-private-class-fields",
    category: "javascript",
    topic: "Objects",
    title: "Private class fields",
    difficulty: "Advanced",
    summary: `# prefix fields only accessible inside class body`,
    explanation: `Use #field in obj (ergonomic brand check, ES2022). Returns true if obj is an instance with that private field.`,
    code: `class Circle {
  #radius;
  constructor(r) { this.#radius = r; }
  get area() { return Math.PI * this.#radius ** 2; }
  static isCircle(obj) { return #radius in obj; }
}
Circle.isCircle(new Circle(5)); // true`,
    interviewQuestion: `Can you check if an object has a private field?`,
  },
  {
    id: "javascript-call-apply-bind",
    category: "javascript",
    topic: "Functions",
    title: "call, apply, bind",
    difficulty: "Intermediate",
    summary: `Explicitly set 'this' context`,
    explanation: `call passes arguments individually. apply passes as array. bind returns new function with 'this' bound — doesn't call immediately.`,
    code: `function greet(greeting, punct) {
  return \`\${greeting}, \${this.name}\${punct}\`;
}
const user = { name: 'Alice' };
greet.call(user, 'Hello', '!');   // call: individual args
greet.apply(user, ['Hi', '?']);    // apply: array args
const hi = greet.bind(user, 'Hi'); // bind: partial application
hi('!'); // 'Hi, Alice!'`,
    interviewQuestion: `What is the difference between call and apply?`,
  },
  {
    id: "javascript-iife",
    category: "javascript",
    topic: "Functions",
    title: "IIFE",
    difficulty: "Basic",
    summary: `Immediately Invoked Function Expression — creates isolated scope`,
    explanation: `ES modules have their own scope — no need for IIFE to avoid polluting global. Still useful for async in top-level environments without module support.`,
    code: `(function() {
  var private = 'not global';
})();
// Arrow IIFE
(() => {
  const data = init();
  render(data);
})();
// Async IIFE
(async () => {
  const data = await fetchData();
})();`,
    interviewQuestion: `Why are IIFEs less common in modern JS?`,
  },
  {
    id: "javascript-currying",
    category: "javascript",
    topic: "Functions",
    title: "Currying",
    difficulty: "Advanced",
    summary: `Transform f(a,b,c) into f(a)(b)(c)`,
    explanation: `Partial application: fix some arguments, return function needing the rest. Currying: each call takes exactly one argument. Related but distinct.`,
    code: `const curry = fn => {
  const arity = fn.length;
  return function curried(...args) {
    if (args.length >= arity) return fn(...args);
    return (...more) => curried(...args, ...more);
  };
};
const add = curry((a, b, c) => a + b + c);
add(1)(2)(3); // 6
add(1, 2)(3); // 6`,
    interviewQuestion: `What is partial application vs currying?`,
  },
  {
    id: "javascript-debounce-throttle",
    category: "javascript",
    topic: "Functions",
    title: "Debounce & Throttle",
    difficulty: "Advanced",
    summary: `Limit rate of function calls`,
    explanation: `Debounce: waits for pause in calls, fires once after (search input). Throttle: fires at most once per interval regardless of how many calls (scroll handler).`,
    code: `function debounce(fn, ms) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}
function throttle(fn, ms) {
  let last = 0;
  return (...args) => {
    const now = Date.now();
    if (now - last >= ms) { last = now; fn(...args); }
  };
}`,
    interviewQuestion: `What is the difference between debounce and throttle?`,
  },
  {
    id: "javascript-memoization",
    category: "javascript",
    topic: "Functions",
    title: "Memoization",
    difficulty: "Advanced",
    summary: `Cache function results by input`,
    explanation: `When function has side effects or depends on external state. The cache returns old value even if external state changed.`,
    code: `function memoize(fn) {
  const cache = new Map();
  return function(...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}
const fib = memoize(n => n <= 1 ? n : fib(n-1) + fib(n-2));`,
    interviewQuestion: `When does memoization cause bugs?`,
  },
  {
    id: "javascript-string-methods",
    category: "javascript",
    topic: "Strings",
    title: "String methods",
    difficulty: "Basic",
    summary: `Common built-in string operations`,
    explanation: `Yes. Negative indices count from the end. substr is deprecated — use slice or substring.`,
    code: `'hello world'.includes('world');  // true
'hello'.startsWith('hel');        // true
'  hi  '.trim();                  // 'hi'
'a,b,c'.split(',');               // ['a','b','c']
'hello'.slice(-3);                // 'llo'
'ha'.repeat(3);                   // 'hahaha'
'abc'.padStart(5, '0');           // '00abc'`,
    interviewQuestion: `Does slice work on negative indices?`,
  },
  {
    id: "javascript-template-literals",
    category: "javascript",
    topic: "Strings",
    title: "Template literals",
    difficulty: "Basic",
    summary: `Backtick strings with interpolation and multi-line`,
    explanation: `A function called with parts of a template literal. Used by libraries like styled-components, graphql, sql for safe interpolation.`,
    code: `const name = 'World';
\`Hello \${name}!\`; // interpolation
// Multi-line
const html = \`
  <div>
    <p>\${content}</p>
  </div>
\`;
// Tagged template
function sql(strings, ...values) {
  return strings.reduce((q, s, i) => q + s + (values[i] ?? ''), '');
}
sql\`SELECT * FROM users WHERE id = \${userId}\`;`,
    interviewQuestion: `What are tagged template literals?`,
  },
  {
    id: "javascript-regular-expressions",
    category: "javascript",
    topic: "Strings",
    title: "Regular Expressions",
    difficulty: "Intermediate",
    summary: `Pattern matching with RegExp`,
    explanation: `RegExp.test(str) returns boolean. String.match(regex) returns array of matches or null. Use /g flag for all matches.`,
    code: `const emailRe = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
emailRe.test('a@b.com'); // true

'hello world'.match(/\\w+/g); // ['hello', 'world']
'foo bar baz'.replace(/\\b\\w/g, c => c.toUpperCase()); // 'Foo Bar Baz'
// Named groups
const { year, month } = '2024-01'.match(/(?<year>\\d{4})-(?<month>\\d{2})/).groups;`,
    interviewQuestion: `What is the difference between test and match?`,
  },
  {
    id: "javascript-map-2",
    category: "javascript",
    topic: "Data Structures",
    title: "Map",
    difficulty: "Intermediate",
    summary: `Key-value pairs with any key type`,
    explanation: `Map: any key type (objects, functions), maintains insertion order, has .size, no prototype pollution, better performance for frequent add/delete.`,
    code: `const map = new Map();
map.set('key', 'value');
map.set({id:1}, 'obj key'); // objects as keys!
map.get('key');    // 'value'
map.has('key');    // true
map.size;          // 2
// Iterate
for (const [k, v] of map) console.log(k, v);`,
    interviewQuestion: `When to use Map over plain object?`,
  },
  {
    id: "javascript-set",
    category: "javascript",
    topic: "Data Structures",
    title: "Set",
    difficulty: "Intermediate",
    summary: `Collection of unique values`,
    explanation: `Use filter + has: [...setA].filter(x => setB.has(x)). ES2025 adds Set.prototype.intersection() natively.`,
    code: `const set = new Set([1, 2, 2, 3]); // {1, 2, 3}
set.add(4); set.delete(2);
set.has(3); // true
set.size;   // 3
// Remove duplicates from array
const unique = [...new Set(arr)];
// Union
const union = new Set([...setA, ...setB]);`,
    interviewQuestion: `How do you find the intersection of two Sets?`,
  },
  {
    id: "javascript-weakmap-weakset",
    category: "javascript",
    topic: "Data Structures",
    title: "WeakMap & WeakSet",
    difficulty: "Advanced",
    summary: `Weak references — entries garbage-collected when key unreachable`,
    explanation: `Storing private data per object instance without preventing GC. Caching computed results per DOM node. Cannot be iterated — no memory leak risk.`,
    code: `const metadata = new WeakMap();
function process(obj) {
  if (metadata.has(obj)) return metadata.get(obj);
  const result = expensiveCompute(obj);
  metadata.set(obj, result);
  return result;
}
// When obj is garbage collected, entry is removed automatically`,
    interviewQuestion: `When would you use WeakMap?`,
  },
  {
    id: "javascript-symbol",
    category: "javascript",
    topic: "Data Structures",
    title: "Symbol",
    difficulty: "Advanced",
    summary: `Unique, immutable primitive values`,
    explanation: `Customize built-in JS behaviour: Symbol.iterator makes object iterable, Symbol.toPrimitive controls coercion, Symbol.hasInstance controls instanceof.`,
    code: `const id = Symbol('id');
const id2 = Symbol('id');
id === id2; // false -- always unique
// Well-known Symbol
class Range {
  constructor(from, to) { this.from = from; this.to = to; }
  [Symbol.iterator]() {
    let cur = this.from;
    return { next: () => cur <= this.to ? { value: cur++, done: false } : { done: true } };
  }
}
[...new Range(1,4)]; // [1,2,3,4]`,
    interviewQuestion: `What are well-known Symbols used for?`,
  },
  {
    id: "javascript-event-handling",
    category: "javascript",
    topic: "Browser",
    title: "Event handling",
    difficulty: "Intermediate",
    summary: `addEventListener, event delegation`,
    explanation: `Attach one listener to parent instead of many to children. Handles dynamically added elements. Memory efficient for lists.`,
    code: `// Instead of one listener per item:
document.querySelector('#list').addEventListener('click', e => {
  const item = e.target.closest('li');
  if (!item) return;
  console.log(item.dataset.id);
});
// e.stopPropagation() -- stop bubbling
// e.preventDefault() -- prevent default action`,
    interviewQuestion: `What is event delegation and why use it?`,
  },
  {
    id: "javascript-fetch-api",
    category: "javascript",
    topic: "Browser",
    title: "Fetch API",
    difficulty: "Intermediate",
    summary: `Modern HTTP requests`,
    explanation: `No! fetch only rejects on network failure. A 404 or 500 resolves with ok:false. Always check res.ok or res.status.`,
    code: `async function fetchUser(id) {
  const res = await fetch(\`/api/users/\${id}\`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json',
               'Authorization': \`Bearer \${token}\` }
  });
  if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
  return res.json();
}`,
    interviewQuestion: `Does fetch reject on 4xx/5xx responses?`,
  },
  {
    id: "javascript-localstorage-sessionstorage",
    category: "javascript",
    topic: "Browser",
    title: "localStorage & sessionStorage",
    difficulty: "Basic",
    summary: `Browser key-value storage`,
    explanation: `localStorage persists until explicitly cleared. sessionStorage cleared when tab closes. Both: 5-10MB, string values only, synchronous (can block UI).`,
    code: `localStorage.setItem('key', JSON.stringify(obj));
const data = JSON.parse(localStorage.getItem('key'));
localStorage.removeItem('key');
localStorage.clear();
// sessionStorage: same API but tab-scoped
sessionStorage.setItem('temp', 'value');`,
    interviewQuestion: `What is the difference between localStorage and sessionStorage?`,
  },
  {
    id: "javascript-intersectionobserver",
    category: "javascript",
    topic: "Browser",
    title: "IntersectionObserver",
    difficulty: "Advanced",
    summary: `Observe when element enters/exits viewport`,
    explanation: `Lazy loading images, infinite scroll, analytics (element viewed), triggering animations on scroll — without scroll event listeners (which cause jank).`,
    code: `const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.src = entry.target.dataset.src; // lazy load
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('img[data-src]').forEach(img => observer.observe(img));`,
    interviewQuestion: `What is IntersectionObserver used for?`,
  },
  {
    id: "javascript-mutationobserver",
    category: "javascript",
    topic: "Browser",
    title: "MutationObserver",
    difficulty: "Advanced",
    summary: `Watch DOM for changes`,
    explanation: `Third-party widgets injecting content, monitoring dynamic content for accessibility, implementing undo for DOM changes.`,
    code: `const observer = new MutationObserver(mutations => {
  mutations.forEach(m => {
    m.addedNodes.forEach(node => console.log('Added:', node));
  });
});
observer.observe(document.body, {
  childList: true,
  subtree: true,
  attributes: true
});
observer.disconnect(); // stop observing`,
    interviewQuestion: `When do you need MutationObserver?`,
  },
  {
    id: "javascript-json",
    category: "javascript",
    topic: "Utilities",
    title: "JSON",
    difficulty: "Basic",
    summary: `Serialize/deserialize JavaScript values`,
    explanation: `undefined, functions, and Symbols are omitted from objects and become null in arrays. Use replacer parameter to handle them.`,
    code: `JSON.stringify({ a: 1, b: undefined, c: () => {} }); // '{"a":1}'
JSON.stringify([1, undefined, 3]);                    // '[1,null,3]'
// Pretty print
JSON.stringify(obj, null, 2);
// Replacer
JSON.stringify(obj, (key, val) => val instanceof Date ? val.toISOString() : val);`,
    interviewQuestion: `What values does JSON.stringify lose?`,
  },
  {
    id: "javascript-date",
    category: "javascript",
    topic: "Utilities",
    title: "Date",
    difficulty: "Basic",
    summary: `Built-in date/time handling`,
    explanation: `Date string parsing is implementation-dependent for formats other than ISO 8601. 'Jan 1 2024' may differ across browsers. Always use ISO 8601 (YYYY-MM-DD) or a library like date-fns.`,
    code: `const now = new Date();
now.toISOString();        // '2024-01-15T10:30:00.000Z'
Date.now();               // milliseconds since epoch
new Date(2024, 0, 15);   // Jan 15 2024 (month is 0-indexed!)
const diff = dateB - dateA; // milliseconds`,
    interviewQuestion: `Why is Date.parse unreliable?`,
  },
  {
    id: "javascript-math",
    category: "javascript",
    topic: "Utilities",
    title: "Math",
    difficulty: "Basic",
    summary: `Mathematical functions`,
    explanation: `round: nearest integer (0.5 rounds up). floor: always down. ceil: always up. trunc: removes decimal (toward zero — different from floor for negatives).`,
    code: `Math.round(4.5);  // 5
Math.round(-4.5); // -4 (rounds toward +infinity)
Math.floor(-4.1); // -5
Math.trunc(-4.9); // -4 (just removes decimal)
Math.max(...arr); // spread for array
Math.random();    // [0, 1)
(Math.random() * (max-min) + min) | 0; // random int`,
    interviewQuestion: `What is the difference between Math.round, floor, ceil, and trunc?`,
  },
  {
    id: "javascript-error-types",
    category: "javascript",
    topic: "Error Handling",
    title: "Error types",
    difficulty: "Intermediate",
    summary: `TypeError, RangeError, ReferenceError, SyntaxError, URIError`,
    explanation: `When callers need to distinguish your error from generic ones programmatically — catch (e) { if (e instanceof ValidationError) ... }. Include extra fields for context.`,
    code: `class AppError extends Error {
  constructor(message, statusCode, code) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.code = code;
  }
}
try {
  throw new AppError('Not found', 404, 'USER_NOT_FOUND');
} catch (e) {
  if (e instanceof AppError) console.log(e.statusCode);
  else throw e; // re-throw unknown errors
}`,
    interviewQuestion: `When should you create custom Error classes?`,
  },
  {
    id: "javascript-module-pattern",
    category: "javascript",
    topic: "Design Patterns",
    title: "Module pattern",
    difficulty: "Intermediate",
    summary: `Encapsulate code and expose public API`,
    explanation: `Define everything privately, return an object exposing only public parts. Predecessor to ES modules.`,
    code: `const Counter = (() => {
  let count = 0; // private
  const increment = () => ++count;
  const reset = () => { count = 0; };
  return { increment, reset, getCount: () => count }; // public
})();
Counter.increment(); Counter.increment();
Counter.getCount(); // 2`,
    interviewQuestion: `What is the revealing module pattern?`,
  },
  {
    id: "javascript-observer-pattern",
    category: "javascript",
    topic: "Design Patterns",
    title: "Observer pattern",
    difficulty: "Advanced",
    summary: `Pub/Sub — decouple emitters from listeners`,
    explanation: `Maintains a map of event→listeners. emit iterates and calls each. on/off add/remove. Node.js, React Native DeviceEventEmitter, and browser EventTarget all use this pattern.`,
    code: `class EventEmitter {
  #events = new Map();
  on(event, fn) {
    (this.#events.get(event) ?? this.#events.set(event, []).get(event)).push(fn);
    return () => this.off(event, fn);
  }
  off(event, fn) { this.#events.set(event, (this.#events.get(event) ?? []).filter(f => f !== fn)); }
  emit(event, ...args) { (this.#events.get(event) ?? []).forEach(fn => fn(...args)); }
}`,
    interviewQuestion: `How does EventEmitter implement Observer?`,
  },
  {
    id: "javascript-factory-pattern",
    category: "javascript",
    topic: "Design Patterns",
    title: "Factory pattern",
    difficulty: "Intermediate",
    summary: `Create objects without specifying exact class`,
    explanation: `When creation logic is complex, when subclass to create depends on input, or when you want to hide implementation details.`,
    code: `function createUser(role) {
  const base = { id: crypto.randomUUID(), role };
  switch (role) {
    case 'admin': return { ...base, permissions: ['read','write','delete'], level: 'high' };
    case 'editor': return { ...base, permissions: ['read','write'], level: 'mid' };
    default: return { ...base, permissions: ['read'], level: 'low' };
  }
}`,
    interviewQuestion: `When to use Factory over constructor?`,
  },
  {
    id: "javascript-singleton-pattern",
    category: "javascript",
    topic: "Design Patterns",
    title: "Singleton pattern",
    difficulty: "Intermediate",
    summary: `One instance per application`,
    explanation: `Often yes — creates hidden global state, makes testing hard (shared state between tests). Acceptable for: logger, DB connection pool, config object. Use dependency injection instead where possible.`,
    code: `class Database {
  static #instance = null;
  #connection;
  static getInstance() {
    Database.#instance ??= new Database();
    return Database.#instance;
  }
  connect(url) { this.#connection = createConnection(url); }
}
// Always same instance
Database.getInstance() === Database.getInstance(); // true`,
    interviewQuestion: `Is Singleton an antipattern?`,
  },
  {
    id: "javascript-strategy-pattern",
    category: "javascript",
    topic: "Design Patterns",
    title: "Strategy pattern",
    difficulty: "Advanced",
    summary: `Select algorithm at runtime`,
    explanation: `Sorting strategies, payment processors, authentication methods, validation rules.`,
    code: `const validators = {
  email: v => /^[^@]+@[^@]+$/.test(v),
  phone: v => /^\\d{10}$/.test(v),
  username: v => v.length >= 3 && /^[a-z0-9_]+$/i.test(v),
};
function validate(value, strategy) {
  const fn = validators[strategy];
  if (!fn) throw new Error(\`Unknown strategy: \${strategy}\`);
  return fn(value);
}
validate('test@mail.com', 'email'); // true`,
    interviewQuestion: `Real-world JS example of Strategy?`,
  },
  {
    id: "javascript-pure-functions-immutability",
    category: "javascript",
    topic: "Functional",
    title: "Pure functions & immutability",
    difficulty: "Intermediate",
    summary: `No side effects, same input → same output`,
    explanation: `Predictability, easier debugging, enables time-travel debugging, React/Redux state comparison (===) works correctly, prevents shared mutable state bugs.`,
    code: `// Mutable -- bad
const addItem = (arr, item) => { arr.push(item); return arr; };
// Immutable -- good
const addItem = (arr, item) => [...arr, item];
const updateUser = (user, changes) => ({ ...user, ...changes });
const removeById = (arr, id) => arr.filter(x => x.id !== id);`,
    interviewQuestion: `Why prefer immutability in JS?`,
  },
  {
    id: "javascript-composition-pipe",
    category: "javascript",
    topic: "Functional",
    title: "Composition & pipe",
    difficulty: "Advanced",
    summary: `Combine functions: output of one feeds next`,
    explanation: `compose: right-to-left (mathematical). pipe: left-to-right (more readable for data transformation pipelines).`,
    code: `const pipe = (...fns) => x => fns.reduce((v, f) => f(v), x);
const compose = (...fns) => x => fns.reduceRight((v, f) => f(v), x);

const processUser = pipe(
  user => ({ ...user, name: user.name.trim() }),
  user => ({ ...user, email: user.email.toLowerCase() }),
  user => ({ ...user, slug: user.name.replace(/\\s+/g, '-') }),
);
processUser({ name: ' Alice ', email: 'ALICE@MAIL.COM' });`,
    interviewQuestion: `What is the difference between compose and pipe?`,
  },
  {
    id: "javascript-web-workers",
    category: "javascript",
    topic: "Browser APIs",
    title: "Web Workers",
    difficulty: "Advanced",
    summary: `Run JS in background thread — no DOM access`,
    explanation: `Functions, DOM nodes, class instances with methods. Transferable objects (ArrayBuffer, OffscreenCanvas) are transferred (moved, not copied) — the original is neutered.`,
    code: `// worker.js
self.onmessage = ({ data }) => {
  const result = expensiveCalculation(data);
  self.postMessage(result);
};
// main.js
const worker = new Worker('worker.js');
worker.postMessage(largeArray);
worker.onmessage = ({ data }) => setResults(data);
worker.terminate(); // clean up`,
    interviewQuestion: `What data can you NOT pass to a Web Worker?`,
  },
  {
    id: "javascript-websockets",
    category: "javascript",
    topic: "Browser APIs",
    title: "WebSockets",
    difficulty: "Intermediate",
    summary: `Full-duplex real-time communication`,
    explanation: `WebSocket: bidirectional, binary + text, must manage reconnection. SSE: unidirectional (server→client only), text only, auto-reconnects, simpler. Use SSE for live feeds; WebSocket for chat/games.`,
    code: `const ws = new WebSocket('wss://api.devquiz.app/ws');
ws.onopen    = () => ws.send(JSON.stringify({ type: 'subscribe', channel: 'quiz' }));
ws.onmessage = ({ data }) => dispatch(handleMessage(JSON.parse(data)));
ws.onerror   = (err) => console.error('WS error', err);
ws.onclose   = () => setTimeout(reconnect, 1000); // auto-reconnect`,
    interviewQuestion: `What is the difference between WebSocket and Server-Sent Events?`,
  },
  {
    id: "javascript-service-workers",
    category: "javascript",
    topic: "Browser APIs",
    title: "Service Workers",
    difficulty: "Advanced",
    summary: `Proxy between browser and network — enables PWA`,
    explanation: `Install → Activate → Fetch intercept. New SW waits in 'waiting' state while old SW controls open pages. skipWaiting() + clients.claim() force immediate takeover.`,
    code: `// sw.js
const CACHE = 'v1';
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(['/','index.html','app.js'])));
});
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => cached ?? fetch(e.request))
  );
});`,
    interviewQuestion: `What is the lifecycle of a Service Worker?`,
  },
  {
    id: "javascript-js-performance",
    category: "javascript",
    topic: "Performance",
    title: "JS Performance",
    difficulty: "Advanced",
    summary: `Profiling, memory, rendering optimization`,
    explanation: `Detached DOM nodes held in closures, forgotten event listeners, setInterval not cleared, cache with no eviction, WeakRef alternatives not used.`,
    code: `// Profile with Performance API
performance.mark('start');
heavyOperation();
performance.mark('end');
performance.measure('heavy', 'start', 'end');
console.log(performance.getEntriesByName('heavy')[0].duration);
// Avoid: memory leak from detached node
let el = document.getElementById('btn');
const handler = () => {};
el.addEventListener('click', handler);
// FIX: remove listener before removing element
el.removeEventListener('click', handler);`,
    interviewQuestion: `What causes memory leaks in browser JS?`,
  },
  {
    id: "javascript-xss-injection",
    category: "javascript",
    topic: "Security",
    title: "XSS & Injection",
    difficulty: "Tricky",
    summary: `Cross-site scripting and injection attacks`,
    explanation: `Never use innerHTML/dangerouslySetInnerHTML with user input. Use textContent for plain text. Sanitize with DOMPurify if HTML is needed. Set CSP headers.`,
    code: `// VULNERABLE
element.innerHTML = userInput;
// SAFE
element.textContent = userInput;
// If HTML is required (rich text)
import DOMPurify from 'dompurify';
element.innerHTML = DOMPurify.sanitize(userInput, {
  ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a'],
  ALLOWED_ATTR: ['href'],
});`,
    interviewQuestion: `How do you prevent XSS in vanilla JS?`,
  },
  {
    id: "javascript-cors",
    category: "javascript",
    topic: "Security",
    title: "CORS",
    difficulty: "Intermediate",
    summary: `Cross-Origin Resource Sharing — browser security policy`,
    explanation: `No. CORS is a browser-enforced policy — browsers respect it, servers don't. A Node.js script or curl ignores CORS headers and can call your API freely. Real protection: auth tokens, rate limiting.`,
    code: `// Server (Express)
app.use(cors({
  origin: ['https://devquiz.app', 'http://localhost:5173'],
  credentials: true, // allow cookies
  methods: ['GET','POST','PUT','DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
// Preflight (OPTIONS) is handled automatically by cors()`,
    interviewQuestion: `Does CORS protect your API from server-to-server requests?`,
  },
  {
    id: "javascript-promise-combinators",
    category: "javascript",
    topic: "Async",
    title: "Promise combinators",
    difficulty: "Advanced",
    summary: `all, allSettled, any, race`,
    explanation: `race: resolves/rejects with first settled (either fulfilled or rejected). any: resolves with first FULFILLED, ignores rejections, only rejects if ALL reject.`,
    code: `// Race: first settled wins (including errors)
const result = await Promise.race([fetch(primary), timeout(5000)]);

// Any: first success wins, ignores failures
const fastest = await Promise.any([fetchFromCDN1(url), fetchFromCDN2(url)]);

// All: all must succeed
const [user, posts] = await Promise.all([fetchUser(id), fetchPosts(id)]);

// AllSettled: wait for all, get status of each
const results = await Promise.allSettled([p1, p2, p3]);`,
    interviewQuestion: `When do you use Promise.any vs Promise.race?`,
  },
  {
    id: "typescript-basic-types",
    category: "typescript",
    topic: "Types",
    title: "Basic types",
    difficulty: "Basic",
    summary: `string, number, boolean, null, undefined, symbol, bigint`,
    explanation: `any disables all type checking — unsafe. unknown requires type narrowing before use — safe. Use unknown for values you don't know the type of (API responses). Never use any if avoidable.`,
    code: `let a: any = 'hello';
a.toFixed(); // no error -- runtime crash!
let b: unknown = 'hello';
if (typeof b === 'string') b.toUpperCase(); // safe`,
    interviewQuestion: `What is the difference between unknown and any?`,
  },
  {
    id: "typescript-union-intersection",
    category: "typescript",
    topic: "Types",
    title: "Union & Intersection",
    difficulty: "Intermediate",
    summary: `| and & type operators`,
    explanation: `Union where each variant has a common literal type field (discriminant). TypeScript narrows type in switch/if blocks.`,
    code: `type Shape =
  | { kind: 'circle';    radius: number }
  | { kind: 'rect'; width: number; height: number };
function area(s: Shape) {
  switch (s.kind) {
    case 'circle': return Math.PI * s.radius ** 2;
    case 'rect':   return s.width * s.height;
  }
}`,
    interviewQuestion: `What is a discriminated union?`,
  },
  {
    id: "typescript-interface-vs-type-alias",
    category: "typescript",
    topic: "Types",
    title: "Interface vs Type alias",
    difficulty: "Tricky",
    summary: `Both describe object shapes — subtle differences`,
    explanation: `Interface: extendable (declaration merging), better error messages, prefer for public API. Type: required for unions, intersections, tuples, mapped types, computed types. In practice: either works for objects.`,
    code: `interface User { name: string; }
interface User { age: number; } // merges! User = {name, age}

type ID = string | number; // union -- can't use interface
type Readonly<T> = { readonly [K in keyof T]: T[K] }; // mapped -- can't use interface`,
    interviewQuestion: `When should you use interface over type?`,
  },
  {
    id: "typescript-enums",
    category: "typescript",
    topic: "Types",
    title: "Enums",
    difficulty: "Intermediate",
    summary: `Named constants: const enum, numeric, string`,
    explanation: `Regular enums generate runtime JavaScript (IIFE). const enums are inlined at compile time — no runtime code. Numeric enums allow reverse mapping (Direction[0] === 'Up') which can be surprising.`,
    code: `// Numeric enum (generates runtime code)
enum Direction { Up, Down, Left, Right }
Direction.Up;    // 0
Direction[0];    // 'Up' (reverse mapping)
// Const enum (no runtime code)
const enum Status { Active = 'ACTIVE', Inactive = 'INACTIVE' }
// String literal union (preferred by many)
type Status = 'ACTIVE' | 'INACTIVE';`,
    interviewQuestion: `What is the problem with regular enums?`,
  },
  {
    id: "typescript-generics",
    category: "typescript",
    topic: "Types",
    title: "Generics",
    difficulty: "Intermediate",
    summary: `Type parameters for reusable type-safe code`,
    explanation: `extends limits which types can be passed. T extends keyof U means T must be a key of U.`,
    code: `function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}
function first<T>(arr: T[]): T | undefined { return arr[0]; }
// Generic with default
function createState<T = string>(initial: T) { return { value: initial }; }`,
    interviewQuestion: `What is generic constraint with extends?`,
  },
  {
    id: "typescript-utility-types",
    category: "typescript",
    topic: "Types",
    title: "Utility types",
    difficulty: "Intermediate",
    summary: `Partial, Required, Readonly, Pick, Omit, Record, ReturnType, Parameters`,
    explanation: `Combine Pick/Omit with Partial: type PartialSome<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>`,
    code: `type User = { id: number; name: string; email: string; role: string };
type Draft      = Partial<User>;                      // all optional
type ViewUser   = Readonly<Pick<User, 'id' | 'name'>>; // readonly subset
type UpdateUser = Omit<User, 'id'>;                    // no id
type UserMap    = Record<string, User>;                 // string-keyed map`,
    interviewQuestion: `How do you make some fields optional and rest required?`,
  },
  {
    id: "typescript-template-literal-types",
    category: "typescript",
    topic: "Types",
    title: "Template literal types",
    difficulty: "Advanced",
    summary: `String manipulation at type level`,
    explanation: `Template literal types distribute over unions automatically: type AB = \`\${A}\${B}\` creates all A×B combinations.`,
    code: `type Side    = 'top' | 'bottom' | 'left' | 'right';
type Padding = \`padding-\${Side}\`;
// 'padding-top' | 'padding-bottom' | 'padding-left' | 'padding-right'
type EventHandler<T extends string> = \`on\${Capitalize<T>}\`;
type ClickHandler = EventHandler<'click'>; // 'onClick'`,
    interviewQuestion: `How do you create all combinations of two unions?`,
  },
  {
    id: "typescript-conditional-types",
    category: "typescript",
    topic: "Types",
    title: "Conditional types",
    difficulty: "Advanced",
    summary: `T extends U ? X : Y`,
    explanation: `infer declares a type variable to extract/capture a type within a conditional type.`,
    code: `type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;
type Awaited<T>    = T extends Promise<infer R> ? Awaited<R> : T;
type UnpackArray<T> = T extends Array<infer Item> ? Item : T;
type Flatten<T> = T extends Array<infer I> ? Flatten<I> : T;`,
    interviewQuestion: `What is the infer keyword?`,
  },
  {
    id: "typescript-mapped-types",
    category: "typescript",
    topic: "Types",
    title: "Mapped types",
    difficulty: "Advanced",
    summary: `Transform all properties of a type`,
    explanation: `?: adds optional; -?: removes optional (makes required). -readonly removes readonly.`,
    code: `type Mutable<T>  = { -readonly [K in keyof T]: T[K] };
type Required<T> = { [K in keyof T]-?: T[K] };
type Nullable<T> = { [K in keyof T]: T[K] | null };
// Key remapping (as clause)
type Getters<T>  = { [K in keyof T as \`get\${Capitalize<string & K>}\`]: () => T[K] };`,
    interviewQuestion: `What's the difference between -? and ? in mapped types?`,
  },
  {
    id: "typescript-type-guards",
    category: "typescript",
    topic: "Narrowing",
    title: "Type guards",
    difficulty: "Intermediate",
    summary: `Narrow union types at runtime`,
    explanation: `Function return type written as 'param is Type'. When function returns true, TS narrows param to that type in the calling scope.`,
    code: `function isString(x: unknown): x is string {
  return typeof x === 'string';
}
function isUser(x: unknown): x is User {
  return typeof x === 'object' && x !== null && 'id' in x;
}
// Assertion function
function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}`,
    interviewQuestion: `What is a type predicate?`,
  },
  {
    id: "typescript-satisfies-operator",
    category: "typescript",
    topic: "Types",
    title: "Satisfies operator",
    difficulty: "Advanced",
    summary: `Validate type without widening (TS 4.9+)`,
    explanation: `Annotation widens the type to the declared type. satisfies validates but keeps the literal/inferred type — you get both type safety and exact inference.`,
    code: `const palette = {
  red:   [255, 0, 0],
  green: '#00ff00',
} satisfies Record<string, string | number[]>;
// Without satisfies: palette.red would be string | number[]
// With satisfies:    palette.red is number[] (exact type kept)
palette.red.map(n => n); // works -- knows it's number[]`,
    interviewQuestion: `What is the difference between : annotation and satisfies?`,
  },
  {
    id: "typescript-tsconfig-json",
    category: "typescript",
    topic: "Config",
    title: "tsconfig.json",
    difficulty: "Intermediate",
    summary: `TypeScript compiler configuration`,
    explanation: `strict enables: strictNullChecks, strictFunctionTypes, strictBindCallApply, noImplicitAny, noImplicitThis, alwaysStrict, useUnknownInCatchVariables.`,
    code: `{
  "compilerOptions": {
    "strict": true,
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "baseUrl": ".",
    "paths": { "@/*": ["./src/*"] },
    "noUncheckedIndexedAccess": true
  }
}`,
    interviewQuestion: `What does strict flag enable?`,
  },
  {
    id: "typescript-never-type",
    category: "typescript",
    topic: "Types",
    title: "never type",
    difficulty: "Tricky",
    summary: `Bottom type — value that never exists`,
    explanation: `Exhaustiveness checking in switch — if you handle all cases, the default branch has type never. Adding a new union member without handling it causes a compile error.`,
    code: `type Shape = 'circle' | 'square';
function process(s: Shape) {
  switch (s) {
    case 'circle': return 'round';
    case 'square': return 'boxy';
    default:
      const _check: never = s; // Error if new case added
      throw new Error('Unknown shape');
  }
}`,
    interviewQuestion: `What practical use does never have?`,
  },
  {
    id: "typescript-declaration-merging",
    category: "typescript",
    topic: "Types",
    title: "Declaration merging",
    difficulty: "Advanced",
    summary: `Multiple declarations of same name merge`,
    explanation: `Add properties to an existing module's types without modifying the source. Used to extend third-party library types.`,
    code: `// Add custom property to Express Request
declare module 'express' {
  interface Request {
    user?: { id: string; role: string };
  }
}
// Augment Window
declare global {
  interface Window {
    analytics: Analytics;
  }
}`,
    interviewQuestion: `What is module augmentation?`,
  },
  {
    id: "typescript-const-assertion",
    category: "typescript",
    topic: "Types",
    title: "const assertion",
    difficulty: "Intermediate",
    summary: `as const makes values readonly literal types`,
    explanation: `All values become their literal types (readonly). 'hello' stays 'hello' not string. Numbers stay as literal numbers. Enables type-safe config objects.`,
    code: `const ROLES = ['admin', 'editor', 'viewer'] as const;
type Role = typeof ROLES[number]; // 'admin' | 'editor' | 'viewer'

const CONFIG = { env: 'production', port: 3000 } as const;
type Env = typeof CONFIG['env']; // 'production' not string`,
    interviewQuestion: `What does 'as const' do to an object?`,
  },
  {
    id: "typescript-structural-typing",
    category: "typescript",
    topic: "Types",
    title: "Structural typing",
    difficulty: "Tricky",
    summary: `TypeScript uses shape, not name for type compatibility`,
    explanation: `Yes — structural typing. If the class has all required properties/methods, it's compatible even without 'implements'.`,
    code: `interface Printable { print(): void; }
class Document {
  print() { console.log(this.content); }
  content = 'hello';
}
const p: Printable = new Document(); // Works! Structural match`,
    interviewQuestion: `Can you assign a class instance to an interface it doesn't implement?`,
  },
  {
    id: "typescript-excess-property-checks",
    category: "typescript",
    topic: "Types",
    title: "Excess property checks",
    difficulty: "Tricky",
    summary: `Extra properties rejected on object literals only`,
    explanation: `Object literals get 'freshness' checking — excess properties rejected. Assigning via variable bypasses this as variable is checked only for structural compatibility.`,
    code: `type Point = { x: number; y: number };
const p: Point = { x: 1, y: 2, z: 3 }; // Error: excess 'z'
const obj = { x: 1, y: 2, z: 3 };
const p2: Point = obj; // OK: structural check only`,
    interviewQuestion: `Why does TS reject extra props on object literals but not variables?`,
  },
  {
    id: "typescript-function-overloads",
    category: "typescript",
    topic: "Types",
    title: "Function overloads",
    difficulty: "Advanced",
    summary: `Multiple call signatures for same function`,
    explanation: `Implementation signature is internal — not callable directly. Overload signatures define the public API. Common pitfall: making implementation signature too broad.`,
    code: `function format(val: string): string;
function format(val: number, decimals?: number): string;
function format(val: string | number, decimals = 2): string {
  if (typeof val === 'string') return val.trim();
  return val.toFixed(decimals);
}
format('hello');   // uses first overload
format(3.14159, 2); // uses second overload`,
    interviewQuestion: `Why do overload signatures differ from implementation signature?`,
  },
  {
    id: "typescript-decorators-stage-3",
    category: "typescript",
    topic: "Patterns",
    title: "Decorators (Stage 3)",
    difficulty: "Advanced",
    summary: `Class/method/property metadata`,
    explanation: `TS 5.0 implements Stage 3 TC39 proposal — different API from experimentalDecorators. Not backward compatible. Stage 3: context object, return value replaces method, no reflect-metadata needed.`,
    code: `// TS 5.0+ Stage 3
function log(_target: unknown, ctx: ClassMethodDecoratorContext) {
  const name = String(ctx.name);
  return function(this: unknown, ...args: unknown[]) {
    console.log(\`\${name}(\${args})\`);
    return (ctx as any).value.apply(this, args);
  };
}
class API {
  @log async fetchUser(id: number) { return db.get(id); }
}`,
    interviewQuestion: `What changed in TS 5.0 decorators vs legacy?`,
  },
  {
    id: "typescript-zod-runtime-validation",
    category: "typescript",
    topic: "Types",
    title: "Zod runtime validation",
    difficulty: "Intermediate",
    summary: `Schema validation that derives TypeScript types`,
    explanation: `TS types are compile-time only — erased at runtime. Zod validates at runtime AND infers TS types. Use for API responses, form data, env variables.`,
    code: `import { z } from 'zod';
const UserSchema = z.object({
  id:    z.string().uuid(),
  name:  z.string().min(1).max(100),
  email: z.string().email(),
  age:   z.number().int().min(0).optional(),
});
type User = z.infer<typeof UserSchema>; // TS type from schema
const result = UserSchema.safeParse(apiResponse);
if (result.success) { const user: User = result.data; }`,
    interviewQuestion: `How does Zod differ from TypeScript types?`,
  },
  {
    id: "typescript-type-narrowing-patterns",
    category: "typescript",
    topic: "Types",
    title: "Type narrowing patterns",
    difficulty: "Advanced",
    summary: `instanceof, typeof, in, discriminated unions, assertion functions`,
    explanation: `'prop' in obj narrows to types that have that property. Works for distinguishing union members without a discriminant field.`,
    code: `function handleResponse(res: SuccessResponse | ErrorResponse) {
  if ('data' in res) {
    console.log(res.data); // SuccessResponse
  } else {
    console.error(res.error); // ErrorResponse
  }
}
// instanceof narrowing
function handle(e: unknown) {
  if (e instanceof ValidationError) showValidation(e.fields);
  else if (e instanceof NetworkError) showRetry();
  else throw e;
}`,
    interviewQuestion: `What is the in operator used for in TS narrowing?`,
  },
  {
    id: "typescript-builder-pattern-with-types",
    category: "typescript",
    topic: "Patterns",
    title: "Builder pattern with types",
    difficulty: "Advanced",
    summary: `Fluent API for constructing complex objects type-safely`,
    explanation: `Use phantom types — track which fields have been set as type parameters. The build() method is only available when all required types are set.`,
    code: `class QueryBuilder<TTable extends string = never, TFields extends string = never> {
  #table = '';
  #fields: string[] = [];
  from<T extends string>(table: T): QueryBuilder<T, TFields> {
    this.#table = table;
    return this as any;
  }
  select<F extends string>(...fields: F[]): QueryBuilder<TTable, F> {
    this.#fields = fields;
    return this as any;
  }
  build(this: QueryBuilder<string, string>) {
    return \`SELECT \${this.#fields.join(',')} FROM \${this.#table}\`;
  }
}
new QueryBuilder().from('users').select('id','name').build();`,
    interviewQuestion: `How do you enforce required fields at the type level with Builder?`,
  },
  {
    id: "typescript-path-aliases",
    category: "typescript",
    topic: "Config",
    title: "Path aliases",
    difficulty: "Basic",
    summary: `Resolve @/ imports to src/ directory`,
    explanation: `Two places: tsconfig.json paths (for TS type checking) and vite.config.ts resolve.alias (for bundler resolution). Both required.`,
    code: `// tsconfig.json
{ "compilerOptions": { "paths": { "@/*": ["./src/*"] } } }
// vite.config.ts
import path from 'path';
export default defineConfig({
  resolve: { alias: { '@': path.resolve(__dirname, 'src') } },
});
// Usage
import { Button } from '@/components/Button';`,
    interviewQuestion: `How do you set up path aliases in TS + Vite?`,
  },
  {
    id: "typescript-discriminated-unions-with-exhaustive-check",
    category: "typescript",
    topic: "Types",
    title: "Discriminated unions with exhaustive check",
    difficulty: "Tricky",
    summary: `Ensure all union cases are handled`,
    explanation: `TypeScript will error at the never assignment if a new union member is added and not handled in the switch. Automated exhaustiveness checking at compile time.`,
    code: `type Notification =
  | { type: 'email'; to: string }
  | { type: 'sms';   phone: string }
  | { type: 'push';  deviceId: string };
function send(n: Notification) {
  switch (n.type) {
    case 'email': sendEmail(n.to); break;
    case 'sms':   sendSMS(n.phone); break;
    case 'push':  sendPush(n.deviceId); break;
    default:
      const _: never = n; // compile error if new type added
  }
}`,
    interviewQuestion: `Why combine discriminated unions with never?`,
  },
  {
    id: "react-jsx",
    category: "react",
    topic: "Core",
    title: "JSX",
    difficulty: "Basic",
    summary: `Syntactic sugar over React.createElement`,
    explanation: `No — new JSX transform auto-imports jsx runtime. But still import React to use React.useState etc.`,
    code: `// New JSX transform (React 17+)
const el = <div className='box'>Hello</div>;
// Compiles to:
import { jsx as _jsx } from 'react/jsx-runtime';
const el = _jsx('div', { className: 'box', children: 'Hello' });`,
    interviewQuestion: `Do you still need to import React in React 17+?`,
  },
  {
    id: "react-usestate",
    category: "react",
    topic: "Hooks",
    title: "useState",
    difficulty: "Basic",
    summary: `Mutable state in function components`,
    explanation: `Replaces. Use functional update with spread for objects: setState(prev => ({...prev, field: val})).`,
    code: `const [user, setUser] = useState({ name: '', age: 0 });
// WRONG -- loses age
setUser({ name: 'Alice' });
// CORRECT
setUser(prev => ({ ...prev, name: 'Alice' }));
// Lazy init for expensive default
const [data, setData] = useState(() => JSON.parse(localStorage.getItem('data') ?? 'null'));`,
    interviewQuestion: `Does setState merge or replace state?`,
  },
  {
    id: "react-useeffect",
    category: "react",
    topic: "Hooks",
    title: "useEffect",
    difficulty: "Intermediate",
    summary: `Run side effects after render`,
    explanation: `All values from component scope used inside useEffect must be in deps. Omitting causes stale closures. ESLint exhaustive-deps enforces this.`,
    code: `// Mount only
useEffect(() => { subscribe(); return () => unsubscribe(); }, []);
// On userId change
useEffect(() => { fetchUser(userId); }, [userId]);
// No array = every render (rarely needed)
useEffect(() => { document.title = title; });`,
    interviewQuestion: `What is the dependency array contract?`,
  },
  {
    id: "react-useref",
    category: "react",
    topic: "Hooks",
    title: "useRef",
    difficulty: "Intermediate",
    summary: `Mutable ref that persists across renders without causing re-render`,
    explanation: `useRef for: DOM elements, previous values, timers, external instances — anything that doesn't need to trigger UI update. useState for anything that should update UI.`,
    code: `const inputRef = useRef<HTMLInputElement>(null);
const countRef  = useRef(0); // track without re-render
const prevCount = useRef(count);

useEffect(() => { prevCount.current = count; });

<input ref={inputRef} />
<button onClick={() => inputRef.current?.focus()}>Focus</button>`,
    interviewQuestion: `useRef vs useState — when to use each?`,
  },
  {
    id: "react-usememo-usecallback",
    category: "react",
    topic: "Hooks",
    title: "useMemo & useCallback",
    difficulty: "Intermediate",
    summary: `Memoize expensive values and stable callbacks`,
    explanation: `(1) Expensive computation >1ms. (2) Reference equality matters (object/array passed to memoized child). Premature memoization adds overhead.`,
    code: `const filtered = useMemo(
  () => items.filter(i => i.active && i.tag === tag),
  [items, tag]
);
const handleSelect = useCallback(
  (id: string) => onSelect(id),
  [onSelect] // stable ref for memo'd children
);`,
    interviewQuestion: `When does memoization actually help?`,
  },
  {
    id: "react-usereducer",
    category: "react",
    topic: "Hooks",
    title: "useReducer",
    difficulty: "Intermediate",
    summary: `Complex state with reducer pattern`,
    explanation: `When state transitions are complex, multiple handlers share similar logic, or next state depends on previous. dispatch is stable — pass it instead of multiple callbacks.`,
    code: `type Action = { type: 'inc' } | { type: 'dec' } | { type: 'set'; value: number };
function reducer(state: number, action: Action): number {
  switch (action.type) {
    case 'inc': return state + 1;
    case 'dec': return state - 1;
    case 'set': return action.value;
  }
}
const [count, dispatch] = useReducer(reducer, 0);`,
    interviewQuestion: `When to choose useReducer over multiple useStates?`,
  },
  {
    id: "react-usecontext",
    category: "react",
    topic: "Hooks",
    title: "useContext",
    difficulty: "Intermediate",
    summary: `Consume context without prop drilling`,
    explanation: `Yes — every consumer re-renders when context value changes, even if they only use an unchanged part. Split contexts by update frequency or use selector pattern.`,
    code: `const ThemeCtx = createContext<Theme>('light');
const UserCtx  = createContext<User | null>(null);
// Split by frequency: theme rarely changes, user might
function useTheme() { return useContext(ThemeCtx); }
function useUser()  { return useContext(UserCtx); }`,
    interviewQuestion: `Does useContext cause all consumers to re-render on change?`,
  },
  {
    id: "react-useid",
    category: "react",
    topic: "Hooks",
    title: "useId",
    difficulty: "Basic",
    summary: `Generate stable unique IDs for accessibility (React 18)`,
    explanation: `Math.random() differs between server and client — causes hydration mismatch. useId generates consistent IDs from component tree position.`,
    code: `function TextField({ label }: { label: string }) {
  const id = useId();
  return (
    <>
      <label htmlFor={id}>{label}</label>
      <input id={id} />
    </>
  );
}`,
    interviewQuestion: `Why not use Math.random() for accessibility IDs?`,
  },
  {
    id: "react-useimperativehandle-forwardref",
    category: "react",
    topic: "Hooks",
    title: "useImperativeHandle & forwardRef",
    difficulty: "Advanced",
    summary: `Expose imperative methods from child to parent`,
    explanation: `When parent needs to call methods on child (focus, scroll, validate) — not for sharing state. Prefer props/callbacks when possible.`,
    code: `const Input = forwardRef<{ focus(): void }, Props>((props, ref) => {
  const inputRef = useRef<HTMLInputElement>(null);
  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current?.focus()
  }));
  return <input ref={inputRef} {...props} />;
});
// Parent:
const ref = useRef<{ focus(): void }>(null);
<Input ref={ref} />
ref.current?.focus();`,
    interviewQuestion: `When to use useImperativeHandle?`,
  },
  {
    id: "react-custom-hooks",
    category: "react",
    topic: "Hooks",
    title: "Custom hooks",
    difficulty: "Intermediate",
    summary: `Extract reusable stateful logic`,
    explanation: `Yes — ESLint react-hooks plugin validates rules-of-hooks based on the 'use' prefix. Without it, hooks inside won't be checked.`,
    code: `function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try { return JSON.parse(localStorage.getItem(key)!) ?? initial; }
    catch { return initial; }
  });
  const set = useCallback((v: T) => {
    setValue(v);
    localStorage.setItem(key, JSON.stringify(v));
  }, [key]);
  return [value, set] as const;
}`,
    interviewQuestion: `Must custom hooks start with 'use'?`,
  },
  {
    id: "react-react-memo",
    category: "react",
    topic: "Performance",
    title: "React.memo",
    difficulty: "Intermediate",
    summary: `Skip re-render if props unchanged`,
    explanation: `No — shallow comparison by reference. Objects/arrays passed as new literals each render bypass memo. Pass custom compareFn as second arg for deep comparison.`,
    code: `const Card = React.memo(
  ({ user }: { user: User }) => <div>{user.name}</div>,
  (prev, next) => prev.user.id === next.user.id
);
// BROKEN: new object every render -- memo useless
<Card user={{ name: 'Alice' }} />`,
    interviewQuestion: `Does React.memo do deep comparison?`,
  },
  {
    id: "react-reconciliation-keys",
    category: "react",
    topic: "Performance",
    title: "Reconciliation & keys",
    difficulty: "Advanced",
    summary: `React's diffing algorithm for list updates`,
    explanation: `Index keys cause React to reuse DOM nodes incorrectly on reorder/filter. Component state (input values, scroll position) becomes misassigned. Use IDs.`,
    code: `// BAD: index key -- state mismatch on reorder
{items.map((item, i) => <Input key={i} value={item.value} />)}
// GOOD: stable unique key
{items.map(item => <Input key={item.id} value={item.value} />)}`,
    interviewQuestion: `Why must keys be stable and not array index?`,
  },
  {
    id: "react-lazy-loading",
    category: "react",
    topic: "Performance",
    title: "Lazy loading",
    difficulty: "Intermediate",
    summary: `Code split with React.lazy + Suspense`,
    explanation: `Shown while the lazy component's chunk is being downloaded. After the first load it's cached — Suspense only shows on first load or when a new chunk is needed.`,
    code: `const Dashboard = React.lazy(() => import('./Dashboard'));
const Settings  = React.lazy(() => import('./Settings'));

<ErrorBoundary>
  <Suspense fallback={<PageSpinner />}>
    <Routes>
      <Route path='/dashboard' element={<Dashboard />} />
      <Route path='/settings'  element={<Settings />} />
    </Routes>
  </Suspense>
</ErrorBoundary>`,
    interviewQuestion: `What is the purpose of Suspense fallback?`,
  },
  {
    id: "react-error-boundaries",
    category: "react",
    topic: "Patterns",
    title: "Error Boundaries",
    difficulty: "Advanced",
    summary: `Catch JS errors in component tree`,
    explanation: `They require componentDidCatch and getDerivedStateFromError class lifecycle methods. Use react-error-boundary library for function component API.`,
    code: `import { ErrorBoundary } from 'react-error-boundary';

<ErrorBoundary
  fallbackRender={({ error, resetErrorBoundary }) => (
    <div>
      <p>Error: {error.message}</p>
      <button onClick={resetErrorBoundary}>Retry</button>
    </div>
  )}
  onError={(error, info) => logError(error, info)}
>
  <App />
</ErrorBoundary>`,
    interviewQuestion: `Why can't function components be error boundaries?`,
  },
  {
    id: "react-portals",
    category: "react",
    topic: "Patterns",
    title: "Portals",
    difficulty: "Advanced",
    summary: `Render into a different DOM node`,
    explanation: `Event bubbling follows the React component tree, not the DOM tree. A click inside a portal bubbles up through React parents even though DOM-wise it's outside.`,
    code: `function Modal({ onClose, children }: Props) {
  return createPortal(
    <div className='overlay' onClick={onClose}>
      <div className='modal' onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>,
    document.getElementById('portal-root')!
  );
}`,
    interviewQuestion: `How do events work with portals?`,
  },
  {
    id: "react-compound-components",
    category: "react",
    topic: "Patterns",
    title: "Compound components",
    difficulty: "Advanced",
    summary: `Components sharing implicit state via context`,
    explanation: `API flexibility — consumers control layout and composition rather than configuring everything through props.`,
    code: `const TabsCtx = createContext<{ active: number; setActive: (n: number) => void } | null>(null);
function Tabs({ children }: { children: ReactNode }) {
  const [active, setActive] = useState(0);
  return <TabsCtx.Provider value={{ active, setActive }}>{children}</TabsCtx.Provider>;
}
Tabs.Tab = function({ index, children }: { index: number; children: ReactNode }) {
  const ctx = useContext(TabsCtx)!;
  return <button aria-selected={ctx.active === index} onClick={() => ctx.setActive(index)}>{children}</button>;
};`,
    interviewQuestion: `What problem do compound components solve?`,
  },
  {
    id: "react-render-props",
    category: "react",
    topic: "Patterns",
    title: "Render props",
    difficulty: "Intermediate",
    summary: `Pass function as prop to share behaviour`,
    explanation: `Less common — custom hooks replaced most render prop use cases. Still useful for headless UI libraries (Downshift, react-table) where consumer fully controls rendering.`,
    code: `// Render prop
function DataFetcher<T>({ url, render }: { url: string; render: (data: T) => ReactNode }) {
  const [data, setData] = useState<T | null>(null);
  useEffect(() => { fetch(url).then(r => r.json()).then(setData); }, [url]);
  return data ? render(data) : <Spinner />;
}
<DataFetcher url='/api/users' render={users => <UserList users={users} />} />`,
    interviewQuestion: `Are render props still used in modern React?`,
  },
  {
    id: "react-higher-order-components",
    category: "react",
    topic: "Patterns",
    title: "Higher-Order Components",
    difficulty: "Intermediate",
    summary: `HOC wraps component to add behaviour`,
    explanation: `Custom hooks for reusing stateful logic (preferred). HOC for cross-cutting concerns that need to wrap JSX (legacy code, some libraries). HOCs add wrapper divs and complicate DevTools.`,
    code: `function withAuth<P>(Component: ComponentType<P>) {
  return function AuthGuard(props: P) {
    const { user } = useAuth();
    if (!user) return <Navigate to='/login' />;
    return <Component {...props} />;
  };
}
const ProtectedPage = withAuth(Dashboard);`,
    interviewQuestion: `HOC vs custom hook — which to use?`,
  },
  {
    id: "react-usetransition",
    category: "react",
    topic: "Concurrent",
    title: "useTransition",
    difficulty: "Advanced",
    summary: `Mark state updates as non-urgent (React 18)`,
    explanation: `A boolean true while deferred update is pending. Use to show loading indicator without blocking the input from updating.`,
    code: `const [query, setQuery] = useState('');
const [results, setResults] = useState([]);
const [isPending, startTransition] = useTransition();

function handleSearch(q: string) {
  setQuery(q); // urgent: update input
  startTransition(() => {
    setResults(filter(items, q)); // non-urgent: can be interrupted
  });
}`,
    interviewQuestion: `What does isPending give you?`,
  },
  {
    id: "react-usedeferredvalue",
    category: "react",
    topic: "Concurrent",
    title: "useDeferredValue",
    difficulty: "Advanced",
    summary: `Defer a value until browser is idle`,
    explanation: `useTransition: you control which update is deferred (wrap setState). useDeferredValue: you defer a value you receive as prop/context — useful when you don't own the state setter.`,
    code: `const deferredQuery = useDeferredValue(query);
// deferredQuery lags behind query
// Show stale content while new results compute
<div style={{ opacity: deferredQuery !== query ? 0.5 : 1 }}>
  <Results query={deferredQuery} />
</div>`,
    interviewQuestion: `useTransition vs useDeferredValue?`,
  },
  {
    id: "react-batching-react-18",
    category: "react",
    topic: "Tricky",
    title: "Batching (React 18)",
    difficulty: "Tricky",
    summary: `All state updates batched in React 18`,
    explanation: `React 17: batching only in React event handlers. React 18: automatic batching everywhere — setTimeout, promises, native events. Use flushSync() to opt out.`,
    code: `// React 18: both updates = 1 re-render
setTimeout(() => {
  setA(1);
  setB(2); // batched!
}, 0);
// Opt out:
import { flushSync } from 'react-dom';
flushSync(() => setA(1)); // immediate re-render
flushSync(() => setB(2)); // another re-render`,
    interviewQuestion: `What changed about batching in React 18?`,
  },
  {
    id: "react-stale-closures",
    category: "react",
    topic: "Tricky",
    title: "Stale closures",
    difficulty: "Tricky",
    summary: `Event handlers capture outdated state values`,
    explanation: `Functional setState: setState(prev => prev + 1). useRef to track latest: ref.current = state, read ref.current in handler.`,
    code: `// BUG: count always 0 in handler
useEffect(() => {
  window.addEventListener('click', () => {
    console.log(count); // stale!
    setCount(count + 1); // BUG: always 1
  });
}, []);
// FIX 1: functional update
setCount(c => c + 1);
// FIX 2: ref
const countRef = useRef(count);
countRef.current = count;
// Use countRef.current in handler`,
    interviewQuestion: `How do you fix stale state in event handlers?`,
  },
  {
    id: "react-strictmode-double-invoke",
    category: "react",
    topic: "Tricky",
    title: "StrictMode double-invoke",
    difficulty: "Tricky",
    summary: `React 18 StrictMode mounts/unmounts/remounts in dev`,
    explanation: `StrictMode intentionally remounts to surface missing cleanup. If effect has side effects that aren't cleaned up, you'll see doubled API calls. Fix: add proper cleanup.`,
    code: `useEffect(() => {
  const sub = eventBus.subscribe(handler);
  return () => sub.unsubscribe(); // REQUIRED cleanup
}, []);
// Only in development -- production mounts once`,
    interviewQuestion: `Why does useEffect run twice in development?`,
  },
  {
    id: "react-reconciliation-object-identity",
    category: "react",
    topic: "Tricky",
    title: "Reconciliation & object identity",
    difficulty: "Tricky",
    summary: `New object references cause unnecessary re-renders`,
    explanation: `Every render creates a new object — reference changes even if values are same. useMemo/useCallback to stabilize references.`,
    code: `// Re-renders Card every time even with React.memo
<Card style={{ color: 'red' }} onClick={() => handleClick(id)} />
// Stable:
const style    = useMemo(() => ({ color: 'red' }), []);
const onClick  = useCallback(() => handleClick(id), [id]);
<Card style={style} onClick={onClick} />`,
    interviewQuestion: `Why does passing object literals as props break memo?`,
  },
  {
    id: "react-react-testing-library",
    category: "react",
    topic: "Testing",
    title: "React Testing Library",
    difficulty: "Intermediate",
    summary: `Test components as users interact — not implementation`,
    explanation: `Test behaviour, not implementation. Query by accessible role/text/label (as a user would), not by class names or component internals. Encourages accessible code.`,
    code: `import { render, screen, fireEvent, waitFor } from '@testing-library/react';
test('submits form with user data', async () => {
  render(<LoginForm onLogin={mockFn} />);
  fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'a@b.com' } });
  fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'pass' } });
  fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
  await waitFor(() => expect(mockFn).toHaveBeenCalledWith('a@b.com', 'pass'));
});`,
    interviewQuestion: `What is the guiding principle of RTL?`,
  },
  {
    id: "react-mocking-in-react-tests",
    category: "react",
    topic: "Testing",
    title: "Mocking in React tests",
    difficulty: "Intermediate",
    summary: `Mock API calls, modules, timers`,
    explanation: `Use global.fetch = jest.fn() or MSW (Mock Service Worker) — MSW intercepts at network level, works in both tests and browser.`,
    code: `// MSW setup
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
const server = setupServer(
  http.get('/api/user', () => HttpResponse.json({ name: 'Alice' })),
);
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());`,
    interviewQuestion: `How do you mock fetch in React tests?`,
  },
  {
    id: "react-react-query-tanstack-query",
    category: "react",
    topic: "State",
    title: "React Query / TanStack Query",
    difficulty: "Intermediate",
    summary: `Server state management: caching, refetching, mutations`,
    explanation: `How long data is considered fresh. During staleTime, no refetch happens. After staleTime, data is 'stale' — still shown but refetched in background on window focus or remount.`,
    code: `import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
const { data, isLoading } = useQuery({
  queryKey: ['user', userId],
  queryFn:  () => fetchUser(userId),
  staleTime: 60_000, // fresh for 1 min
  gcTime:    5 * 60_000, // removed from cache after 5 min
});
const qc = useQueryClient();
const mut = useMutation({ mutationFn: updateUser, onSuccess: () => qc.invalidateQueries(['user']) });`,
    interviewQuestion: `What does staleTime control?`,
  },
  {
    id: "react-jotai-recoil",
    category: "react",
    topic: "State",
    title: "Jotai & Recoil",
    difficulty: "Advanced",
    summary: `Atomic state management`,
    explanation: `Atoms are independent — components only subscribe to atoms they use. No need for selectors to prevent re-renders. Easy to derive state with computed atoms.`,
    code: `import { atom, useAtom } from 'jotai';
const countAtom  = atom(0);
const doubleAtom = atom(get => get(countAtom) * 2); // derived

function Counter() {
  const [count, setCount] = useAtom(countAtom);
  const [double] = useAtom(doubleAtom);
  return <button onClick={() => setCount(c => c + 1)}>{count} x2={double}</button>;
}`,
    interviewQuestion: `What is the advantage of atomic state over a single store?`,
  },
  {
    id: "react-react-hook-form",
    category: "react",
    topic: "Forms",
    title: "React Hook Form",
    difficulty: "Intermediate",
    summary: `Performant forms with minimal re-renders`,
    explanation: `Uncontrolled by default — uses refs, not state. Only re-renders on actual errors or on submit. Formik re-renders on every keystroke (controlled inputs).`,
    code: `import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(schema),
});
<form onSubmit={handleSubmit(onSubmit)}>
  <input {...register('email')} />
  {errors.email && <span>{errors.email.message}</span>}
  <button type='submit'>Submit</button>
</form>`,
    interviewQuestion: `Why is RHF faster than controlled inputs?`,
  },
  {
    id: "react-useoptimistic-react-19",
    category: "react",
    topic: "Patterns",
    title: "useOptimistic (React 19)",
    difficulty: "Advanced",
    summary: `Optimistic UI updates during async transitions`,
    explanation: `The optimistic state is automatically reverted to the previous value. React handles the rollback when the action's Promise rejects.`,
    code: `import { useOptimistic, useTransition } from 'react';
const [optimisticLikes, addOptimisticLike] = useOptimistic(
  likes,
  (state, newLike) => [...state, newLike]
);
async function handleLike() {
  addOptimisticLike({ id: 'temp', userId }); // immediate UI update
  await likePost(postId); // actual server call
  // On failure: auto-reverts optimisticLikes
}`,
    interviewQuestion: `What happens when the server call fails with useOptimistic?`,
  },
  {
    id: "react-use-hook",
    category: "react",
    topic: "React 19",
    title: "use() hook",
    difficulty: "Advanced",
    summary: `Read resources (Promises, Context) in render`,
    explanation: `use() can be called conditionally (unlike other hooks). Works with Promises — suspends the component until Promise resolves. Works with Context — same as useContext but callable anywhere.`,
    code: `import { use } from 'react';
// Read context conditionally
if (darkMode) {
  const theme = use(ThemeContext); // OK -- use() is conditional-safe
}
// Unwrap promise (suspends until resolved)
function UserProfile({ userPromise }) {
  const user = use(userPromise); // suspends, then renders
  return <div>{user.name}</div>;
}`,
    interviewQuestion: `What makes use() different from useContext and await?`,
  },
  {
    id: "react-react-accessibility",
    category: "react",
    topic: "Accessibility",
    title: "React Accessibility",
    difficulty: "Intermediate",
    summary: `aria-* props, role, keyboard navigation, focus management`,
    explanation: `On modal open: save last focused element, move focus into modal. Intercept Tab/Shift+Tab to cycle through focusable elements inside modal. On close: restore focus to saved element.`,
    code: `function useFocusTrap(ref: RefObject<HTMLElement>, active: boolean) {
  useEffect(() => {
    if (!active) return;
    const el = ref.current;
    const focusable = el?.querySelectorAll('button,input,[tabindex]:not([tabindex="-1"])');
    const first = focusable?.[0] as HTMLElement;
    const last  = focusable?.[focusable.length-1] as HTMLElement;
    first?.focus();
    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      if (e.shiftKey ? document.activeElement === first : document.activeElement === last) {
        e.preventDefault();
        (e.shiftKey ? last : first).focus();
      }
    };
    el?.addEventListener('keydown', handleTab);
    return () => el?.removeEventListener('keydown', handleTab);
  }, [active]);
}`,
    interviewQuestion: `How do you implement a focus trap in a modal?`,
  },
  {
    id: "react-fiber-architecture",
    category: "react",
    topic: "Internals",
    title: "Fiber architecture",
    difficulty: "Advanced",
    summary: `React's internal reconciliation engine`,
    explanation: `Old reconciler: synchronous, recursive — once started, couldn't be interrupted. Fiber: work broken into units, interruptible, prioritizable. Enables concurrent features (useTransition, Suspense streaming).`,
    code: `// Fiber = linked list of work units
// Each component = a fiber node with:
// - type (function/class/element)
// - key
// - stateNode (DOM/class instance)
// - child/sibling/return (tree pointers)
// - pendingProps / memoizedProps
// - pendingState
// - effectTag (insert/update/delete)
// Work loop can yield between fiber units`,
    interviewQuestion: `What problem did Fiber solve over the old stack reconciler?`,
  },
  {
    id: "react-react-18-root-api",
    category: "react",
    topic: "Tricky",
    title: "React 18 root API",
    difficulty: "Tricky",
    summary: `createRoot vs ReactDOM.render`,
    explanation: `createRoot enables concurrent mode — all React 18 features (automatic batching, useTransition, Suspense streaming) require it. ReactDOM.render uses legacy mode — no concurrent features.`,
    code: `// React 18
import { createRoot } from 'react-dom/client';
const root = createRoot(document.getElementById('root'));
root.render(<App />);
// Hydration (SSR)
import { hydrateRoot } from 'react-dom/client';
const root = hydrateRoot(document.getElementById('root'), <App />);`,
    interviewQuestion: `Why must you use createRoot for React 18 features?`,
  },
  {
    id: "reactnative-core-components",
    category: "reactnative",
    topic: "Core",
    title: "Core components",
    difficulty: "Basic",
    summary: `View, Text, TextInput, ScrollView, FlatList, Image, Pressable`,
    explanation: `ScrollView renders all children at once — terrible for long lists. FlatList virtualizes — only renders visible items. Use FlatList for >20 items.`,
    code: `<FlatList
  data={items}
  keyExtractor={item => item.id}
  renderItem={({ item }) => <Row item={item} />}
  initialNumToRender={10}
  maxToRenderPerBatch={5}
  windowSize={5}
/>`,
    interviewQuestion: `When to use ScrollView vs FlatList?`,
  },
  {
    id: "reactnative-stylesheet",
    category: "reactnative",
    topic: "Core",
    title: "StyleSheet",
    difficulty: "Basic",
    summary: `JS object styling — camelCase, no units`,
    explanation: `Validates in dev, serializes style IDs across the JS-Native bridge instead of full objects — less data transfer. Styles are registered once and cached.`,
    code: `const s = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title:     { fontSize: 20, fontWeight: '700', color: '#0f172a' },
  // No 'px' — values are dp (density-independent pixels)
});`,
    interviewQuestion: `Why StyleSheet.create over plain objects?`,
  },
  {
    id: "reactnative-flexbox-in-rn",
    category: "reactnative",
    topic: "Core",
    title: "Flexbox in RN",
    difficulty: "Intermediate",
    summary: `Same as web Flexbox but different defaults`,
    explanation: `flexDirection defaults to 'column'. flex:1 fills available space. No display:grid — Flexbox is the only layout system. No shorthand like 1rem — numeric dp values only.`,
    code: `<View style={{ flex:1, flexDirection:'row', gap:8, flexWrap:'wrap' }}>
  <View style={{ flex:1, minWidth:120 }} />
  <View style={{ flex:2, minWidth:200 }} />
</View>`,
    interviewQuestion: `Key differences from web Flexbox?`,
  },
  {
    id: "reactnative-pressable",
    category: "reactnative",
    topic: "Core",
    title: "Pressable",
    difficulty: "Intermediate",
    summary: `Flexible touch handler replacing TouchableOpacity`,
    explanation: `Pressable is more flexible: render prop for pressed state, hitSlop, unstable_pressDelay. TouchableOpacity is simpler but Pressable is preferred in new code.`,
    code: `<Pressable
  onPress={handlePress}
  onLongPress={handleLong}
  hitSlop={8}
  style={({ pressed }) => ([
    s.btn,
    pressed && { opacity: 0.7 }
  ])}
>
  {({ pressed }) => <Text>{pressed ? 'Holding...' : 'Press me'}</Text>}
</Pressable>`,
    interviewQuestion: `Pressable vs TouchableOpacity?`,
  },
  {
    id: "reactnative-safeareaview",
    category: "reactnative",
    topic: "Core",
    title: "SafeAreaView",
    difficulty: "Basic",
    summary: `Avoids notch, status bar, home indicator`,
    explanation: `Device dimensions and inset sizes vary significantly across models and platforms. SafeAreaView and the useSafeAreaInsets hook from react-native-safe-area-context handle all cases.`,
    code: `import { SafeAreaView } from 'react-native-safe-area-context';
// or for fine-grained:
import { useSafeAreaInsets } from 'react-native-safe-area-context';
function Screen() {
  const insets = useSafeAreaInsets();
  return <View style={{ paddingTop: insets.top }}>...</View>;
}`,
    interviewQuestion: `Why not just add padding manually?`,
  },
  {
    id: "reactnative-modal",
    category: "reactnative",
    topic: "Core",
    title: "Modal",
    difficulty: "Basic",
    summary: `Overlay modal dialog`,
    explanation: `transparent:true makes background transparent — you see the content behind. Use a semi-opaque View inside for overlay effect. Without it, Modal has an opaque background.`,
    code: `<Modal visible={show} transparent animationType='fade' onRequestClose={onClose}>
  <Pressable style={s.overlay} onPress={onClose}>
    <View style={s.sheet}>
      <Text>Modal content</Text>
      <Button title='Close' onPress={onClose} />
    </View>
  </Pressable>
</Modal>`,
    interviewQuestion: `What is the transparent prop on Modal?`,
  },
  {
    id: "reactnative-react-navigation",
    category: "reactnative",
    topic: "Navigation",
    title: "React Navigation",
    difficulty: "Intermediate",
    summary: `Stack, Tab, Drawer navigators`,
    explanation: `navigate: go to screen (no duplicate if already in stack). push: always adds new instance. replace: swap current screen. goBack: go to previous.`,
    code: `// Setup
const Stack = createNativeStackNavigator();
// Usage in screen
navigation.navigate('Profile', { userId: 42 });
navigation.push('Profile', { userId: 43 }); // new instance
navigation.replace('Home'); // replace current
navigation.goBack();
navigation.popTo('Dashboard'); // pop to specific screen`,
    interviewQuestion: `navigate vs push vs replace?`,
  },
  {
    id: "reactnative-passing-params",
    category: "reactnative",
    topic: "Navigation",
    title: "Passing params",
    difficulty: "Intermediate",
    summary: `Pass data between screens`,
    explanation: `Define RootStackParamList type and use it with useNavigation<NavigationProp<...>> and useRoute<RouteProp<...>>.`,
    code: `type RootStack = {
  Home: undefined;
  Profile: { userId: number; readOnly?: boolean };
};
// In screen:
const route = useRoute<RouteProp<RootStack, 'Profile'>>();
const { userId } = route.params;
const nav = useNavigation<NativeStackNavigationProp<RootStack>>();`,
    interviewQuestion: `How do you type navigation params?`,
  },
  {
    id: "reactnative-deep-linking",
    category: "reactnative",
    topic: "Navigation",
    title: "Deep linking",
    difficulty: "Advanced",
    summary: `URL schemes and universal links`,
    explanation: `URL scheme (myapp://): any app can claim it. Universal link (https://): verified via AASA file on server — can't be spoofed, works as web URL too.`,
    code: `// app.json
{ "expo": { "scheme": "devquiz",
  "intentFilters": [{
    "action": "VIEW",
    "data": [{ "scheme": "https", "host": "devquiz.app" }],
    "category": ["BROWSABLE", "DEFAULT"]
  }] } }
// Linking.getInitialURL() for cold start
// Linking.addEventListener for warm start`,
    interviewQuestion: `URL scheme vs universal link?`,
  },
  {
    id: "reactnative-flatlist-optimization",
    category: "reactnative",
    topic: "Performance",
    title: "FlatList optimization",
    difficulty: "Advanced",
    summary: `Virtualized list tuning`,
    explanation: `Pre-computes item positions — enables scrollToIndex without rendering all intermediary items. Required for scrollToIndex and scrollToOffset to work reliably on large lists.`,
    code: `<FlatList
  data={data}
  getItemLayout={(_, index) => ({ length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index })}
  removeClippedSubviews
  maxToRenderPerBatch={10}
  updateCellsBatchingPeriod={50}
  windowSize={5}
  keyExtractor={item => item.id}
/>`,
    interviewQuestion: `What is getItemLayout and when is it required?`,
  },
  {
    id: "reactnative-animations-animated-api",
    category: "reactnative",
    topic: "Performance",
    title: "Animations \u2014 Animated API",
    difficulty: "Intermediate",
    summary: `Declarative animations on JS thread`,
    explanation: `useNativeDriver:true runs animation on native UI thread — never drops frames. Only works for transform and opacity. For other properties (width, backgroundColor) must use JS thread.`,
    code: `const anim = useRef(new Animated.Value(0)).current;
Animated.spring(anim, {
  toValue: 1,
  useNativeDriver: true, // ALWAYS use if possible
  bounciness: 8,
}).start();
<Animated.View style={{ opacity: anim, transform: [{ scale: anim }] }} />`,
    interviewQuestion: `When to use useNativeDriver?`,
  },
  {
    id: "reactnative-reanimated-3",
    category: "reactnative",
    topic: "Performance",
    title: "Reanimated 3",
    difficulty: "Advanced",
    summary: `UI-thread animations with worklets`,
    explanation: `A JS function marked with 'worklet' that runs on the UI thread. Shared values bridge JS↔UI without going through the bridge.`,
    code: `import { useSharedValue, useAnimatedStyle, withSpring, withTiming } from 'react-native-reanimated';

const offset = useSharedValue(0);
const animStyle = useAnimatedStyle(() => ({
  transform: [{ translateX: offset.value }]
}));
// Trigger from JS thread
offset.value = withSpring(100);
<Animated.View style={animStyle} />`,
    interviewQuestion: `What is a worklet?`,
  },
  {
    id: "reactnative-hermes-engine",
    category: "reactnative",
    topic: "Performance",
    title: "Hermes engine",
    difficulty: "Intermediate",
    summary: `Optimised JS engine for React Native`,
    explanation: `Precompiled bytecode (faster cold start), lower memory, built-in debugging. Default since RN 0.70. Disadvantage: slightly behind V8 on some language features (mostly caught up).`,
    code: `// android/app/build.gradle
project.ext.react = [
  enableHermes: true // default since 0.70
]
// iOS: Podfile
use_hermes!`,
    interviewQuestion: `Hermes advantages?`,
  },
  {
    id: "reactnative-platform-specific",
    category: "reactnative",
    topic: "Platform",
    title: "Platform-specific",
    difficulty: "Intermediate",
    summary: `Platform.OS and file extensions`,
    explanation: `Platform.select: runtime conditional — both platforms bundled. File extensions (.ios.tsx/.android.tsx): build-time resolution — smaller bundle, true separation.`,
    code: `// Runtime: both platforms in bundle
const shadow = Platform.select({
  ios:     { shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 4 },
  android: { elevation: 4 }
});
// Build-time: separate files
// Button.ios.tsx
// Button.android.tsx
import Button from './Button'; // Metro picks correct file`,
    interviewQuestion: `Platform.select vs file extensions?`,
  },
  {
    id: "reactnative-permissions",
    category: "reactnative",
    topic: "Platform",
    title: "Permissions",
    difficulty: "Intermediate",
    summary: `Request device permissions at runtime`,
    explanation: `iOS: must declare in Info.plist AND request at runtime. Android: declare in AndroidManifest.xml AND request at runtime for dangerous permissions (camera, location, contacts).`,
    code: `import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';

async function requestCamera() {
  const result = await request(
    Platform.OS === 'ios'
      ? PERMISSIONS.IOS.CAMERA
      : PERMISSIONS.ANDROID.CAMERA
  );
  return result === RESULTS.GRANTED;
}`,
    interviewQuestion: `Why do permissions differ between iOS and Android?`,
  },
  {
    id: "reactnative-linking-app-state",
    category: "reactnative",
    topic: "Platform",
    title: "Linking & App State",
    difficulty: "Intermediate",
    summary: `Open URLs and track app lifecycle`,
    explanation: `active: foreground. background: minimized/home screen. inactive: iOS only — transitioning between states (call comes in).`,
    code: `import { AppState, Linking } from 'react-native';
useEffect(() => {
  const sub = AppState.addEventListener('change', state => {
    if (state === 'active') refreshData();
  });
  return () => sub.remove();
}, []);
// Open URL
await Linking.openURL('https://devquiz.app');
await Linking.openSettings(); // device settings`,
    interviewQuestion: `AppState values?`,
  },
  {
    id: "reactnative-asyncstorage",
    category: "reactnative",
    topic: "Storage",
    title: "AsyncStorage",
    difficulty: "Intermediate",
    summary: `Async key-value storage`,
    explanation: `Not encrypted, ~6MB Android default, async only, no querying. For encryption: expo-secure-store. For large data: expo-sqlite or WatermelonDB.`,
    code: `import AsyncStorage from '@react-native-async-storage/async-storage';
try {
  await AsyncStorage.setItem('user', JSON.stringify(user));
  const raw = await AsyncStorage.getItem('user');
  const data = raw ? JSON.parse(raw) : null;
  await AsyncStorage.multiRemove(['user', 'token']);
} catch (e) { console.error('Storage error:', e); }`,
    interviewQuestion: `AsyncStorage limitations?`,
  },
  {
    id: "reactnative-keyboardavoidingview",
    category: "reactnative",
    topic: "Tricky",
    title: "KeyboardAvoidingView",
    difficulty: "Tricky",
    summary: `Layout adjustment when keyboard appears`,
    explanation: `Android resizes window via windowSoftInputMode=adjustResize — KAV often not needed. iOS overlays keyboard without resize — KAV required with behavior='padding'.`,
    code: `<KeyboardAvoidingView
  style={{ flex: 1 }}
  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
  keyboardVerticalOffset={Platform.OS === 'ios' ? 88 : 0}
>
  <ScrollView keyboardShouldPersistTaps='handled'>
    <TextInput ... />
  </ScrollView>
</KeyboardAvoidingView>`,
    interviewQuestion: `Why does KAV behave differently on iOS vs Android?`,
  },
  {
    id: "reactnative-bridge-new-architecture",
    category: "reactnative",
    topic: "Tricky",
    title: "Bridge & New Architecture",
    difficulty: "Advanced",
    summary: `JS↔Native communication`,
    explanation: `Fabric: synchronous layout, concurrent features. TurboModules: JSI-based direct C++ calls (no serialization). Codegen: type-safe native bridge. Default in RN 0.76+.`,
    code: `// Check new arch
import { TurboModuleRegistry } from 'react-native';
const native = TurboModuleRegistry.getEnforcing<Spec>('MyModule');
// JSI: synchronous call
native.syncMethod(); // no bridge roundtrip`,
    interviewQuestion: `New Architecture: what changed?`,
  },
  {
    id: "reactnative-metro-bundler-quirks",
    category: "reactnative",
    topic: "Tricky",
    title: "Metro bundler quirks",
    difficulty: "Intermediate",
    summary: `RN bundler — not Webpack`,
    explanation: `No tree shaking (bundles everything imported). Different module resolution. Limited plugin ecosystem. But: very fast incremental builds, built-in HMR, supports iOS/Android simultaneously.`,
    code: `// metro.config.js
const { getDefaultConfig } = require('@react-native/metro-config');
module.exports = (() => {
  const config = getDefaultConfig(__dirname);
  config.resolver.sourceExts.push('cjs');
  config.transformer.babelTransformerPath =
    require.resolve('react-native-svg-transformer');
  return config;
})();`,
    interviewQuestion: `Metro limitations vs Webpack?`,
  },
  {
    id: "reactnative-image-caching",
    category: "reactnative",
    topic: "Tricky",
    title: "Image caching",
    difficulty: "Tricky",
    summary: `Image loading and caching in React Native`,
    explanation: `No built-in memory cache for <Image> from remote URLs. Use FastImage (react-native-fast-image) which uses SDWebImage (iOS) and Glide (Android) with proper disk+memory caching.`,
    code: `import FastImage from 'react-native-fast-image';
<FastImage
  source={{
    uri: user.avatar,
    priority: FastImage.priority.high,
    cache: FastImage.cacheControl.immutable
  }}
  style={{ width: 48, height: 48, borderRadius: 24 }}
  resizeMode={FastImage.resizeMode.cover}
/>`,
    interviewQuestion: `Why do images flicker on re-render?`,
  },
  {
    id: "reactnative-js-thread",
    category: "reactnative",
    topic: "Threads",
    title: "JS Thread",
    difficulty: "Advanced",
    summary: `Single JavaScript thread — runs React render, business logic, animations`,
    explanation: `Heavy synchronous computations, large JSON.parse, synchronous native module calls, unoptimised re-renders. Offload with InteractionManager, requestAnimationFrame, or a background worker (JSI Worklet / react-native-workers).`,
    code: `// Defer work until animations settle
import { InteractionManager } from 'react-native';
useEffect(() => {
  const task = InteractionManager.runAfterInteractions(() => {
    heavyDataProcessing(); // runs after animation completes
  });
  return () => task.cancel();
}, []);`,
    interviewQuestion: `What blocks the JS thread and causes jank?`,
  },
  {
    id: "reactnative-ui-thread-main-thread",
    category: "reactnative",
    topic: "Threads",
    title: "UI Thread (Main Thread)",
    difficulty: "Advanced",
    summary: `Native UI rendering thread — handles layout, drawing, touch events`,
    explanation: `UI thread is native (ObjC/Java). JS state lives on the JS thread. Communication happens via the bridge (old arch) or JSI shared values (new arch). Reanimated worklets run ON the UI thread — that's why they're jank-free.`,
    code: `// Reanimated: runs directly on UI thread
function worklet() {
  'worklet';
  return Math.sqrt(sharedValue.value * 2); // no bridge roundtrip
}
// useAnimatedStyle callbacks are worklets automatically`,
    interviewQuestion: `Why must you never call setState from the UI thread directly?`,
  },
  {
    id: "reactnative-native-shadow-thread",
    category: "reactnative",
    topic: "Threads",
    title: "Native/Shadow Thread",
    difficulty: "Advanced",
    summary: `Background thread for layout calculation (Yoga engine)`,
    explanation: `Separate C++ thread running Yoga (Flexbox) layout engine. Computes layout before committing to UI thread. In Fabric (new arch), layout can happen synchronously on the UI thread — eliminates a thread hop.`,
    code: `// No code needed -- happens automatically
// Old Arch: JS → Bridge → Shadow Thread (Yoga) → UI Thread
// New Arch: JS → JSI → Fabric (sync layout on UI thread)`,
    interviewQuestion: `What is the Shadow Thread (Yoga)?`,
  },
  {
    id: "reactnative-interactionmanager",
    category: "reactnative",
    topic: "Threads",
    title: "InteractionManager",
    difficulty: "Intermediate",
    summary: `Schedule work after animations complete`,
    explanation: `setTimeout(0) may interrupt an ongoing animation — runs at next event loop tick regardless. InteractionManager waits until ALL registered interactions (animations, transitions) have completed.`,
    code: `InteractionManager.runAfterInteractions(() => {
  // Safe to run expensive work -- all animations done
  setData(processLargeDataset(raw));
});
// Register custom interaction
const handle = InteractionManager.createInteractionHandle();
InteractionManager.clearInteractionHandle(handle);`,
    interviewQuestion: `What is the difference between InteractionManager and setTimeout(fn, 0)?`,
  },
  {
    id: "reactnative-fcm-setup-android",
    category: "reactnative",
    topic: "Push Notifications",
    title: "FCM Setup (Android)",
    difficulty: "Intermediate",
    summary: `Firebase Cloud Messaging for Android push`,
    explanation: `google-services.json in android/app/, @react-native-firebase/app + /messaging packages, classpath 'com.google.gms:google-services' in android/build.gradle, apply plugin in android/app/build.gradle.`,
    code: `// Install
npx expo install @react-native-firebase/app @react-native-firebase/messaging
// Request permission
async function requestPermission() {
  const authStatus = await messaging().requestPermission();
  return authStatus === messaging.AuthorizationStatus.AUTHORIZED
      || authStatus === messaging.AuthorizationStatus.PROVISIONAL;
}
// Get token
const token = await messaging().getToken();`,
    interviewQuestion: `What files are needed for FCM on Android?`,
  },
  {
    id: "reactnative-apns-setup-ios",
    category: "reactnative",
    topic: "Push Notifications",
    title: "APNs Setup (iOS)",
    difficulty: "Advanced",
    summary: `Apple Push Notification service for iOS`,
    explanation: `Push Notifications entitlement + Background Modes → Remote notifications in Xcode. Also need APNs key (.p8) or certificate in Firebase/backend.`,
    code: `// AppDelegate.m -- register for remote notifications
[application registerForRemoteNotifications];
// React Native Firebase handles this automatically
// Foreground handler
messaging().onMessage(async remoteMessage => {
  // Show local notification while app is in foreground
  PushNotification.localNotification({
    title: remoteMessage.notification.title,
    message: remoteMessage.notification.body,
  });
});`,
    interviewQuestion: `What iOS capabilities must be enabled for push?`,
  },
  {
    id: "reactnative-background-quit-state",
    category: "reactnative",
    topic: "Push Notifications",
    title: "Background & Quit state",
    difficulty: "Advanced",
    summary: `Handling notifications when app is backgrounded or killed`,
    explanation: `onMessage: foreground only. onNotificationOpenedApp: app in background, user taps notification (app comes to foreground). getInitialNotification: app was QUIT, user taps — call in useEffect on mount to handle cold start.`,
    code: `useEffect(() => {
  // App opened from QUIT state by notification
  messaging().getInitialNotification().then(msg => {
    if (msg) navigate(msg.data.screen);
  });
  // App in BACKGROUND, user taps
  const unsub = messaging().onNotificationOpenedApp(msg => {
    navigate(msg.data.screen);
  });
  return unsub;
}, []);`,
    interviewQuestion: `What is the difference between onMessage, onNotificationOpenedApp, and getInitialNotification?`,
  },
  {
    id: "reactnative-local-notifications",
    category: "reactnative",
    topic: "Push Notifications",
    title: "Local Notifications",
    difficulty: "Intermediate",
    summary: `Show notifications triggered by app logic (not server)`,
    explanation: `Reminders, alarms, download complete, offline events — anything the app triggers itself without a server. Use expo-notifications or notifee library.`,
    code: `import notifee, { AndroidImportance } from '@notifee/react-native';
async function showNotification(title: string, body: string) {
  const channelId = await notifee.createChannel({
    id: 'default', name: 'Default', importance: AndroidImportance.HIGH,
  });
  await notifee.displayNotification({
    title, body, android: { channelId, pressAction: { id: 'default' } },
  });
}`,
    interviewQuestion: `When do you need local notifications?`,
  },
  {
    id: "reactnative-notification-channels-android",
    category: "reactnative",
    topic: "Push Notifications",
    title: "Notification channels (Android)",
    difficulty: "Intermediate",
    summary: `Android 8+ requires notification channels`,
    explanation: `On Android 8+, notifications without a valid channel are silently dropped. Each channel has its own sound, vibration, importance, and can be customised by the user in Settings.`,
    code: `// Create channel once on app start
await notifee.createChannel({
  id: 'orders',
  name: 'Order Updates',
  importance: AndroidImportance.HIGH,
  sound: 'default',
  vibration: true,
});
// User can override channel settings in Android Settings`,
    interviewQuestion: `What happens if you don't create a notification channel?`,
  },
  {
    id: "reactnative-expo-notifications",
    category: "reactnative",
    topic: "Push Notifications",
    title: "Expo Notifications",
    difficulty: "Intermediate",
    summary: `Managed workflow push notifications`,
    explanation: `Expo push token (ExponentPushToken[...]) routes through Expo's push service which forwards to FCM/APNs. Useful for managed workflow. For bare workflow, use FCM/APNs tokens directly for full control.`,
    code: `import * as Notifications from 'expo-notifications';
async function registerForPush() {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') return null;
  const token = (await Notifications.getExpoPushTokenAsync({
    projectId: Constants.expoConfig.extra.eas.projectId,
  })).data;
  return token; // send to your backend
}`,
    interviewQuestion: `Expo push token vs FCM/APNs token?`,
  },
  {
    id: "reactnative-react-native-gesture-handler",
    category: "reactnative",
    topic: "Gestures",
    title: "react-native-gesture-handler",
    difficulty: "Intermediate",
    summary: `Native-thread gesture recognition replacing JS touch system`,
    explanation: `Built-in touches go JS thread → recognizer → UI thread (laggy). Gesture Handler runs entirely on UI thread — responds at 60/120fps even when JS thread is busy.`,
    code: `import { GestureDetector, Gesture } from 'react-native-gesture-handler';
const tap = Gesture.Tap()
  .numberOfTaps(2)
  .onEnd(() => { runOnJS(handleDoubleTap)(); });
const pinch = Gesture.Pinch()
  .onUpdate(e => { scale.value = savedScale.value * e.scale; });
const composed = Gesture.Simultaneous(tap, pinch);
<GestureDetector gesture={composed}><Animated.View style={animStyle} /></GestureDetector>`,
    interviewQuestion: `Why use Gesture Handler instead of built-in Touchable?`,
  },
  {
    id: "reactnative-swipe-to-dismiss",
    category: "reactnative",
    topic: "Gestures",
    title: "Swipe to dismiss",
    difficulty: "Advanced",
    summary: `Pan gesture + Reanimated for sheet/card dismissal`,
    explanation: `Use activeOffsetX or activeOffsetY on the pan gesture to define threshold before activation, so vertical scroll still works until horizontal swipe is clearly intended.`,
    code: `const pan = Gesture.Pan()
  .activeOffsetX([-10, 10]) // activate only on horizontal
  .onUpdate(e => { translateX.value = e.translationX; })
  .onEnd(e => {
    if (Math.abs(e.translationX) > 100) {
      translateX.value = withTiming(500, {}, () => runOnJS(onDismiss)());
    } else {
      translateX.value = withSpring(0);
    }
  });`,
    interviewQuestion: `How do you prevent child ScrollView from consuming the swipe gesture?`,
  },
  {
    id: "reactnative-jest-react-native-testing-library",
    category: "reactnative",
    topic: "Testing",
    title: "Jest + React Native Testing Library",
    difficulty: "Intermediate",
    summary: `Unit/integration testing for RN components`,
    explanation: `getBy: throws if not found. queryBy: returns null if not found (use for asserting absence). findBy: async version with retry — waits for element to appear.`,
    code: `import { render, fireEvent, waitFor } from '@testing-library/react-native';
test('shows user name after load', async () => {
  const { getByText, queryByTestId } = render(<UserCard userId='1' />);
  expect(queryByTestId('skeleton')).toBeTruthy();
  await waitFor(() => getByText('Alice'));
  expect(queryByTestId('skeleton')).toBeNull();
  fireEvent.press(getByText('Follow'));
});`,
    interviewQuestion: `What is the difference between getBy and queryBy?`,
  },
  {
    id: "reactnative-mocking-native-modules",
    category: "reactnative",
    topic: "Testing",
    title: "Mocking native modules",
    difficulty: "Advanced",
    summary: `Mock modules that rely on native code`,
    explanation: `Jest runs in Node — no native runtime. Mock the module to return predictable values. Use jest.mock() at top of test file or in __mocks__ folder.`,
    code: `// __mocks__/@react-native-async-storage/async-storage.js
const store = {};
export default {
  setItem: jest.fn((k, v) => Promise.resolve((store[k] = v))),
  getItem: jest.fn(k => Promise.resolve(store[k] ?? null)),
  removeItem: jest.fn(k => Promise.resolve(delete store[k])),
  clear: jest.fn(() => Promise.resolve(Object.keys(store).forEach(k => delete store[k]))),
};`,
    interviewQuestion: `Why do native modules fail in Jest?`,
  },
  {
    id: "reactnative-detox-e2e-testing",
    category: "reactnative",
    topic: "Testing",
    title: "Detox E2E testing",
    difficulty: "Advanced",
    summary: `End-to-end testing on real device/simulator`,
    explanation: `Grey box: Detox synchronizes with app's internal state (knows when animations, network, async ops are idle) before running assertions. Unlike Appium (black box), no arbitrary sleeps needed.`,
    code: `// detox.config.js
module.exports = { testRunner: 'jest', apps: { 'ios.debug': {
  type: 'ios.app', binaryPath: 'ios/build/app.app',
  build: 'xcodebuild ...',
}}};
// test.e2e.js
describe('Login', () => {
  it('should log in successfully', async () => {
    await element(by.id('email')).typeText('user@test.com');
    await element(by.id('password')).typeText('password');
    await element(by.id('login-btn')).tap();
    await expect(element(by.id('dashboard'))).toBeVisible();
  });
});`,
    interviewQuestion: `What is Detox's grey box testing approach?`,
  },
  {
    id: "reactnative-writing-a-native-module",
    category: "reactnative",
    topic: "Native Modules",
    title: "Writing a Native Module",
    difficulty: "Advanced",
    summary: `Bridge JS to platform native code (ObjC/Swift/Java/Kotlin)`,
    explanation: `When no JS library exists: hardware sensors, DRM, Bluetooth, biometrics, custom camera pipelines, calling existing native SDK.`,
    code: `// iOS: RCTCalendarModule.m
@implementation RCTCalendarModule
RCT_EXPORT_MODULE();
RCT_EXPORT_METHOD(createEvent:(NSString *)title
  resolver:(RCTPromiseResolveBlock)resolve
  rejecter:(RCTPromiseRejectBlock)reject) {
  NSNumber *eventId = [self createEventWithTitle:title];
  if (eventId) resolve(eventId);
  else reject(@"E_CREATE", @"Failed", nil);
}
@end
// JS
import { NativeModules } from 'react-native';
await NativeModules.CalendarModule.createEvent('Meeting');`,
    interviewQuestion: `When do you need a custom native module?`,
  },
  {
    id: "reactnative-turbomodules-new-arch",
    category: "reactnative",
    topic: "Native Modules",
    title: "TurboModules (New Arch)",
    difficulty: "Advanced",
    summary: `JSI-based native modules — type-safe, synchronous`,
    explanation: `Legacy: async bridge, JSON serialization, no type safety at boundary. TurboModules: JSI direct C++ call, Codegen generates type-safe spec from TypeScript, can be synchronous.`,
    code: `// NativeCalendarModule.ts (Codegen spec)
import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';
export interface Spec extends TurboModule {
  createEvent(title: string): Promise<number>;
}
export default TurboModuleRegistry.getEnforcing<Spec>('CalendarModule');`,
    interviewQuestion: `How does TurboModules differ from legacy Native Modules?`,
  },
  {
    id: "reactnative-redux-toolkit",
    category: "reactnative",
    topic: "State Management",
    title: "Redux Toolkit",
    difficulty: "Intermediate",
    summary: `Opinionated Redux: createSlice, createAsyncThunk, RTK Query`,
    explanation: `Action creators and reducer combined. Immer is built-in — you can write mutating code (obj.count++) and it produces immutable state.`,
    code: `import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
const fetchUser = createAsyncThunk('user/fetch', async (id: string) =>
  (await fetch(\`/api/users/\${id}\`)).json()
);
const userSlice = createSlice({
  name: 'user',
  initialState: { data: null, status: 'idle' },
  reducers: { logout: state => { state.data = null; } },
  extraReducers: b => {
    b.addCase(fetchUser.pending,   s => { s.status = 'loading'; })
     .addCase(fetchUser.fulfilled, (s, a) => { s.data = a.payload; s.status = 'done'; });
  },
});`,
    interviewQuestion: `What does createSlice generate?`,
  },
  {
    id: "reactnative-zustand",
    category: "reactnative",
    topic: "State Management",
    title: "Zustand",
    difficulty: "Intermediate",
    summary: `Minimal state management — no boilerplate`,
    explanation: `Zustand for simpler apps/teams — no actions, reducers, dispatching. Redux Toolkit for large teams — explicit patterns, DevTools, RTK Query for caching.`,
    code: `import { create } from 'zustand';
import { persist } from 'zustand/middleware';
interface AuthStore {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}
const useAuth = create<AuthStore>()(persist(
  set => ({
    user: null,
    login: (user) => set({ user }),
    logout: () => set({ user: null }),
  }),
  { name: 'auth-storage', storage: AsyncStorage }
));`,
    interviewQuestion: `Zustand vs Redux — when to choose Zustand?`,
  },
  {
    id: "reactnative-context-vs-state-manager",
    category: "reactnative",
    topic: "State Management",
    title: "Context vs State Manager",
    difficulty: "Tricky",
    summary: `When to use React Context vs external state library`,
    explanation: `All consumers re-render on any context value change. For frequently-updated state (counters, form values), use Zustand/Redux — they support selectors (only re-render when selected slice changes).`,
    code: `// Context: fine for theme, locale, auth (infrequent updates)
// Zustand: use selector to prevent unnecessary re-renders
const userName = useAuthStore(state => state.user?.name);
// Only re-renders when user.name changes -- not on unrelated store updates`,
    interviewQuestion: `What is the main perf problem with Context?`,
  },
  {
    id: "reactnative-codepush-eas-update",
    category: "reactnative",
    topic: "Deployment",
    title: "CodePush / EAS Update",
    difficulty: "Advanced",
    summary: `Over-the-air JS bundle updates without app store`,
    explanation: `Can update: JS/TS code, images, assets bundled with app. Cannot update: native code (Swift/Kotlin/Java), new native modules, Gradle/Podfile changes — these require a new app store release.`,
    code: `// @microsoft/react-native-code-push
import CodePush from 'react-native-code-push';
const App = () => <RootNavigator />;
export default CodePush({
  checkFrequency: CodePush.CheckFrequency.ON_APP_RESUME,
  installMode: CodePush.InstallMode.ON_NEXT_RESUME,
})(App);
// EAS Update (Expo)
npx eas update --branch production --message 'Fix login crash'`,
    interviewQuestion: `What can CodePush update and what can't it?`,
  },
  {
    id: "reactnative-app-signing-release",
    category: "reactnative",
    topic: "Deployment",
    title: "App signing & release",
    difficulty: "Advanced",
    summary: `Android keystore, iOS provisioning profiles & certificates`,
    explanation: `Losing the keystore file. Google Play requires the SAME keystore for all updates — if lost, you must publish as a new app. Back it up in multiple secure locations.`,
    code: `# Android: generate keystore
keytool -genkey -v -keystore my-release-key.jks
  -alias my-key-alias -keyalg RSA -keysize 2048
# gradle.properties (keep out of git)
KEYSTORE_FILE=my-release-key.jks
KEY_ALIAS=my-key-alias
KEY_PASSWORD=...
# iOS: managed by Xcode / EAS credentials`,
    interviewQuestion: `What is the most common release mistake for Android?`,
  },
  {
    id: "reactnative-eas-build",
    category: "reactnative",
    topic: "Deployment",
    title: "EAS Build",
    difficulty: "Intermediate",
    summary: `Expo Application Services cloud builds`,
    explanation: `EAS Build: reproducible environment, no Xcode/Android Studio needed on dev machine, easy CI. Local: faster iteration, easier debugging native issues, required for custom build configs EAS doesn't support.`,
    code: `# eas.json
{
  "build": {
    "development": { "developmentClient": true, "distribution": "internal" },
    "production": { "android": { "buildType": "apk" }, "ios": { "simulator": false } }
  }
}
# Build
eas build --platform android --profile production`,
    interviewQuestion: `EAS Build vs local build?`,
  },
  {
    id: "reactnative-flipper-debugging",
    category: "reactnative",
    topic: "Performance",
    title: "Flipper debugging",
    difficulty: "Intermediate",
    summary: `Meta's debugging tool for React Native apps`,
    explanation: `Network requests, React DevTools, Redux state, database (SQLite, AsyncStorage), layout inspector, crash logs, custom plugins. Essential for RN debugging.`,
    code: `// Enable in debug builds (default in RN 0.62+)
// Packages: flipper-plugin-network, flipper-plugin-react-query
// Custom plugin:
const flipperClient = require('react-native-flipper');
flipperClient.addPlugin({
  getId: () => 'MyPlugin',
  onConnect: conn => conn.send('data', { key: 'value' }),
  onDisconnect: () => {},
});`,
    interviewQuestion: `What can you inspect with Flipper?`,
  },
  {
    id: "reactnative-js-bundle-optimization",
    category: "reactnative",
    topic: "Performance",
    title: "JS bundle optimization",
    difficulty: "Advanced",
    summary: `Reduce bundle size for faster startup`,
    explanation: `Use --bundle-output and source-map-explorer to visualize. Lazy require() large libraries. Avoid barrel imports (import * from). Use dynamic imports with React.lazy (Fabric only).`,
    code: `# Analyze bundle
npx react-native bundle --platform android --dev false
  --entry-file index.js --bundle-output output.js
npx source-map-explorer output.js output.js.map

// Lazy require inside function
function openPDF(path) {
  const PDFLib = require('@react-native-pdf/pdflib'); // loaded on demand
  PDFLib.open(path);
}`,
    interviewQuestion: `How do you measure and reduce RN bundle size?`,
  },
  {
    id: "reactnative-memory-profiling",
    category: "reactnative",
    topic: "Performance",
    title: "Memory profiling",
    difficulty: "Advanced",
    summary: `Detect memory leaks in React Native apps`,
    explanation: `Event listeners not removed, subscriptions not unsubscribed, timers not cleared, closures holding large data, JS references to unmounted components.`,
    code: `// Always clean up in useEffect
useEffect(() => {
  const subscription = DeviceEventEmitter.addListener('event', handler);
  const interval = setInterval(poll, 5000);
  const ws = new WebSocket(url);
  return () => {
    subscription.remove();
    clearInterval(interval);
    ws.close();
  };
}, []);`,
    interviewQuestion: `Common memory leak causes in RN?`,
  },
  {
    id: "reactnative-netinfo",
    category: "reactnative",
    topic: "Offline",
    title: "NetInfo",
    difficulty: "Basic",
    summary: `Detect network connectivity state`,
    explanation: `No — NetInfo detects local connectivity (WiFi/cellular connected), not actual internet access. A user connected to a captive portal shows as connected but can't reach your API.`,
    code: `import NetInfo from '@react-native-community/netinfo';
// One-time check
const state = await NetInfo.fetch();
console.log(state.isConnected, state.type); // 'wifi'|'cellular'|'none'
// Subscribe to changes
const unsub = NetInfo.addEventListener(state => {
  dispatch(setOnline(state.isConnected));
});
return () => unsub();`,
    interviewQuestion: `Does NetInfo guarantee the user can reach YOUR server?`,
  },
  {
    id: "reactnative-offline-first-strategy",
    category: "reactnative",
    topic: "Offline",
    title: "Offline-first strategy",
    difficulty: "Advanced",
    summary: `Queue mutations and sync when online`,
    explanation: `Update UI immediately before server confirms — better UX on slow connections. Roll back on failure. React Query / Redux Toolkit Query support optimistic updates.`,
    code: `// Optimistic update with React Query
const mutation = useMutation({
  mutationFn: (newPost) => api.createPost(newPost),
  onMutate: async (newPost) => {
    await queryClient.cancelQueries(['posts']);
    const previous = queryClient.getQueryData(['posts']);
    queryClient.setQueryData(['posts'], old => [newPost, ...old]);
    return { previous }; // rollback context
  },
  onError: (err, _, context) => {
    queryClient.setQueryData(['posts'], context.previous); // rollback
  },
});`,
    interviewQuestion: `What is optimistic UI in a mobile context?`,
  },
  {
    id: "reactnative-rn-accessibility",
    category: "reactnative",
    topic: "Accessibility",
    title: "RN Accessibility",
    difficulty: "Intermediate",
    summary: `accessible, accessibilityLabel, accessibilityRole, accessibilityHint`,
    explanation: `Tells screen reader (VoiceOver/TalkBack) what kind of element this is — button, link, header, image, etc. Changes how the reader announces and interacts with it.`,
    code: `<TouchableOpacity
  accessible
  accessibilityRole='button'
  accessibilityLabel='Send message'
  accessibilityHint='Double tap to send your message'
  onPress={send}
>
  <Image source={sendIcon} />
</TouchableOpacity>
// Check VoiceOver: Settings > Accessibility > VoiceOver
// Check TalkBack: Settings > Accessibility > TalkBack`,
    interviewQuestion: `What is accessibilityRole?`,
  },
  {
    id: "reactnative-expo-vs-bare-workflow",
    category: "reactnative",
    topic: "Expo",
    title: "Expo vs Bare workflow",
    difficulty: "Basic",
    summary: `Managed vs ejected React Native`,
    explanation: `When you need: custom native modules not available in Expo SDK, specific native config, advanced build customisation, or the Expo SDK doesn't support a required native feature yet.`,
    code: `# Check if expo module exists before ejecting
npx expo install expo-camera expo-location expo-notifications
# If not available:
npx expo prebuild  # generates native ios/ android/ folders
# Then use bare workflow -- still uses Expo packages`,
    interviewQuestion: `When should you eject from Expo managed workflow?`,
  },
  {
    id: "reactnative-expo-router",
    category: "reactnative",
    topic: "Expo",
    title: "Expo Router",
    difficulty: "Intermediate",
    summary: `File-based routing for React Native (like Next.js)`,
    explanation: `Automatic — file structure defines URL scheme. /app/profile/[id].tsx maps to myapp://profile/123 automatically with expo-router's Link handling.`,
    code: `// app/(tabs)/index.tsx  -> /
// app/(tabs)/profile/[id].tsx -> /profile/123
import { Link, useLocalSearchParams } from 'expo-router';
const { id } = useLocalSearchParams();
<Link href={{ pathname: '/profile/[id]', params: { id: user.id } }}>
  View Profile
</Link>`,
    interviewQuestion: `How does Expo Router handle deep links?`,
  },
  {
    id: "nextjs-ssr-vs-ssg-vs-isr-vs-csr",
    category: "nextjs",
    topic: "Rendering",
    title: "SSR vs SSG vs ISR vs CSR",
    difficulty: "Basic",
    summary: `Four rendering strategies`,
    explanation: `ISR: static HTML built at build time, regenerated in background after revalidate seconds. Best for semi-static content. Combines SSG speed with near-real-time data.`,
    code: `// App Router: fetch with revalidate = ISR
const data = await fetch(url, { next: { revalidate: 60 } }).then(r => r.json());
// Force static
export const dynamic = 'force-static';
// Force dynamic (SSR)
export const dynamic = 'force-dynamic';`,
    interviewQuestion: `What is ISR?`,
  },
  {
    id: "nextjs-server-components",
    category: "nextjs",
    topic: "Rendering",
    title: "Server Components",
    difficulty: "Advanced",
    summary: `React Server Components — run on server, no client JS`,
    explanation: `No. Add 'use client' for hooks. Server Components can import Client Components. Client Components cannot import Server Components directly (pass as children/props instead).`,
    code: `// Default: Server Component
async function UserList() {
  const users = await db.query('SELECT * FROM users');
  return <ul>{users.map(u => <li key={u.id}>{u.name}</li>)}</ul>;
}
// Client Component
'use client';
function Counter() {
  const [n, setN] = useState(0);
  return <button onClick={() => setN(n+1)}>{n}</button>;
}`,
    interviewQuestion: `Can Server Components use hooks?`,
  },
  {
    id: "nextjs-streaming-suspense",
    category: "nextjs",
    topic: "Rendering",
    title: "Streaming & Suspense",
    difficulty: "Advanced",
    summary: `Progressive HTML streaming from server`,
    explanation: `First byte arrives immediately. Important content (hero, nav) renders without waiting for slow data fetches. Slow sections (recommendations, related posts) stream in separately.`,
    code: `// loading.tsx auto-creates Suspense boundary
export default function Loading() { return <PageSkeleton />; }
// Manual Suspense for granular control
<>
  <Hero />  {/* immediate */}
  <Suspense fallback={<RecoSkeleton />}>
    <Recommendations /> {/* streams separately */}
  </Suspense>
</>`,
    interviewQuestion: `How does streaming improve LCP?`,
  },
  {
    id: "nextjs-app-router-file-conventions",
    category: "nextjs",
    topic: "Routing",
    title: "App Router file conventions",
    difficulty: "Intermediate",
    summary: `page, layout, template, loading, error, not-found`,
    explanation: `layout: persistent state preserved on navigation (doesn't remount). template: creates new instance per navigation (remounts). Use template for animations or per-route state reset.`,
    code: `app/
  layout.tsx       -- root shell (persistent)
  page.tsx         -- /
  dashboard/
    layout.tsx     -- sidebar (persistent)
    loading.tsx    -- Suspense fallback
    error.tsx      -- Error boundary
    not-found.tsx  -- 404 for segment
    page.tsx       -- /dashboard`,
    interviewQuestion: `layout vs template?`,
  },
  {
    id: "nextjs-dynamic-routes",
    category: "nextjs",
    topic: "Routing",
    title: "Dynamic routes",
    difficulty: "Intermediate",
    summary: `[param], [...slug], [[...slug]] segments`,
    explanation: `[...slug]: required — route only matches if segment has value. [[...slug]]: optional — also matches the segment without any slug (e.g., /blog matches app/blog/[[...slug]]/page.tsx).`,
    code: `// app/blog/[slug]/page.tsx
export default function Post({ params }: { params: { slug: string } }) {}
// app/docs/[...path]/page.tsx  -- /docs/a/b/c
export default function Doc({ params }: { params: { path: string[] } }) {}`,
    interviewQuestion: `Difference between [...slug] and [[...slug]]?`,
  },
  {
    id: "nextjs-route-groups",
    category: "nextjs",
    topic: "Routing",
    title: "Route groups",
    difficulty: "Intermediate",
    summary: `(folder) groups routes without affecting URL`,
    explanation: `Organize routes without URL segments: different layouts for auth vs app, separate loading/error states per group.`,
    code: `app/
  (marketing)/
    layout.tsx  -- marketing layout (no header)
    page.tsx    -- /
    about/page.tsx  -- /about
  (app)/
    layout.tsx  -- app shell with sidebar
    dashboard/page.tsx  -- /dashboard`,
    interviewQuestion: `What are route groups used for?`,
  },
  {
    id: "nextjs-middleware",
    category: "nextjs",
    topic: "Routing",
    title: "Middleware",
    difficulty: "Advanced",
    summary: `Run code at the edge before request`,
    explanation: `No Node.js APIs (fs, database drivers) — runs in Edge runtime. No JSX. Size limit on imports. Use for: auth redirects, geolocation headers, A/B testing, rate limiting.`,
    code: `// middleware.ts (root)
import { NextResponse } from 'next/server';
import { verifyJWT } from '@/lib/auth';
export function middleware(req) {
  const token = req.cookies.get('token')?.value;
  if (!token && req.nextUrl.pathname.startsWith('/app')) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
}
export const config = { matcher: ['/app/:path*'] };`,
    interviewQuestion: `What can middleware NOT do?`,
  },
  {
    id: "nextjs-route-handlers",
    category: "nextjs",
    topic: "Data",
    title: "Route handlers",
    difficulty: "Intermediate",
    summary: `API routes in App Router`,
    explanation: `GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS. GET is cached by default; mutation methods are not. Add dynamic = 'force-dynamic' to opt GET out of cache.`,
    code: `// app/api/posts/route.ts
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get('page') ?? 1);
  return NextResponse.json(await getPosts(page));
}
export async function POST(req: NextRequest) {
  const body = await req.json();
  const post = await createPost(body);
  return NextResponse.json(post, { status: 201 });
}`,
    interviewQuestion: `What HTTP methods are supported?`,
  },
  {
    id: "nextjs-server-actions",
    category: "nextjs",
    topic: "Data",
    title: "Server Actions",
    difficulty: "Advanced",
    summary: `Async server functions called from client`,
    explanation: `Yes — Next.js adds origin checking and a unique action ID per action. Can't be called from arbitrary origins.`,
    code: `'use server';
async function deletePost(formData: FormData) {
  const id = formData.get('id') as string;
  await db.posts.delete(id);
  revalidatePath('/posts');
}
// With useActionState (React 19)
const [state, action, pending] = useActionState(createPost, null);`,
    interviewQuestion: `Are Server Actions CSRF-safe?`,
  },
  {
    id: "nextjs-caching-layers",
    category: "nextjs",
    topic: "Data",
    title: "Caching layers",
    difficulty: "Advanced",
    summary: `Request memoization, Data cache, Full Route Cache, Router Cache`,
    explanation: `revalidatePath('/posts') invalidates Full Route Cache for that path. revalidateTag('posts') invalidates all fetches tagged with 'posts'. Both run inside Server Actions or Route Handlers only.`,
    code: `// Tag fetches
await fetch(url, { next: { tags: ['posts'] } });
// Bust by tag
import { revalidateTag, revalidatePath } from 'next/cache';
revalidateTag('posts'); // all tagged fetches
revalidatePath('/posts'); // full route cache`,
    interviewQuestion: `How do you bust the Data cache after a mutation?`,
  },
  {
    id: "nextjs-image-optimization",
    category: "nextjs",
    topic: "Performance",
    title: "Image optimization",
    difficulty: "Intermediate",
    summary: `next/image — lazy loading, sizing, format conversion`,
    explanation: `Adds <link rel=preload> and disables lazy loading. Use for LCP (above-fold) images only. All other images are lazy by default.`,
    code: `import Image from 'next/image';
<Image
  src='/hero.jpg'
  alt='Hero'
  width={1200}
  height={600}
  priority  // LCP image -- preload
  sizes='(max-width:768px) 100vw, 50vw'
  quality={85}
/>`,
    interviewQuestion: `What does priority do?`,
  },
  {
    id: "nextjs-font-optimization",
    category: "nextjs",
    topic: "Performance",
    title: "Font optimization",
    difficulty: "Intermediate",
    summary: `next/font — self-hosted, zero CLS`,
    explanation: `Generates CSS size-adjust and ascent-override to match fallback font metrics exactly. Self-hosts at build time — no external requests during page load.`,
    code: `import { Inter, JetBrains_Mono } from 'next/font/google';
const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const mono  = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });
export default function RootLayout({ children }) {
  return <html className={\`\${inter.variable} \${mono.variable}\`}>{children}</html>;
}`,
    interviewQuestion: `How does next/font prevent layout shift?`,
  },
  {
    id: "nextjs-script-optimization",
    category: "nextjs",
    topic: "Performance",
    title: "Script optimization",
    difficulty: "Intermediate",
    summary: `next/script with loading strategies`,
    explanation: `beforeInteractive: blocks page (critical scripts only). afterInteractive: after hydration (analytics). lazyOnload: when browser is idle (chat widgets, non-critical).`,
    code: `import Script from 'next/script';
// Analytics: after hydration
<Script src='analytics.js' strategy='afterInteractive' />
// Chat widget: idle time
<Script src='chat.js' strategy='lazyOnload' onLoad={() => initChat()} />`,
    interviewQuestion: `What is the difference between beforeInteractive, afterInteractive, and lazyOnload?`,
  },
  {
    id: "nextjs-metadata-api",
    category: "nextjs",
    topic: "SEO",
    title: "Metadata API",
    difficulty: "Intermediate",
    summary: `Export metadata object or generateMetadata function`,
    explanation: `Export async generateMetadata function from page.tsx. It receives params — use it to fetch data for title, description, og tags.`,
    code: `// Static metadata
export const metadata = {
  title: 'DevQuiz',
  description: 'Practice coding interview questions',
  openGraph: { images: ['/og.png'] },
};
// Dynamic metadata
export async function generateMetadata({ params }) {
  const post = await getPost(params.slug);
  return { title: post.title, description: post.excerpt };
}`,
    interviewQuestion: `How do you generate dynamic metadata?`,
  },
  {
    id: "nextjs-parallel-routes",
    category: "nextjs",
    topic: "Advanced",
    title: "Parallel routes",
    difficulty: "Advanced",
    summary: `Render multiple pages in same layout (@slot)`,
    explanation: `Dashboards with independent sections, modals that show inline with background page, tabs that navigate independently.`,
    code: `app/
  layout.tsx  -- renders {children} {analytics} {team}
  @analytics/
    page.tsx   -- /dashboard/analytics slot
  @team/
    page.tsx   -- /dashboard/team slot
  page.tsx     -- main content`,
    interviewQuestion: `When do you use parallel routes?`,
  },
  {
    id: "nextjs-intercepting-routes",
    category: "nextjs",
    topic: "Advanced",
    title: "Intercepting routes",
    difficulty: "Advanced",
    summary: `Show route in modal while keeping background`,
    explanation: `(.) same level, (..) one level up, (...) root. When intercepted route is navigated via Link, shows as modal. Direct URL navigation shows full page.`,
    code: `app/
  @modal/
    (.)photo/[id]/page.tsx  -- intercepted: modal
  photo/[id]/page.tsx        -- direct: full page
  page.tsx
  layout.tsx  -- renders {children} {modal}`,
    interviewQuestion: `How do intercepting routes work?`,
  },
  {
    id: "nextjs-use-client-boundary",
    category: "nextjs",
    topic: "Tricky",
    title: "use client boundary",
    difficulty: "Tricky",
    summary: `'use client' marks Client Component boundary`,
    explanation: `Yes — all imports in a 'use client' file become Client Components. But children/props can still be Server Components — they're passed through, not imported.`,
    code: `// ClientWrapper.tsx
'use client';
function Drawer({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return <div>{open && children}</div>;
}
// page.tsx (Server)
<Drawer>
  <ServerDataComponent /> {/* server-rendered */}
</Drawer>`,
    interviewQuestion: `Does 'use client' make ALL imports client-side?`,
  },
  {
    id: "nextjs-environment-variables",
    category: "nextjs",
    topic: "Tricky",
    title: "Environment variables",
    difficulty: "Intermediate",
    summary: `Server vs client env var exposure`,
    explanation: `Only NEXT_PUBLIC_ vars are bundled to client. Others are server-only. Warning: if you pass a server env var as prop to a Client Component, it leaks to the client bundle.`,
    code: `# .env.local
DATABASE_URL=postgres://...   # server only
NEXT_PUBLIC_API=https://...   # client + server
// Usage
process.env.DATABASE_URL       // server only
process.env.NEXT_PUBLIC_API    // anywhere`,
    interviewQuestion: `Why does NEXT_PUBLIC_ prefix matter?`,
  },
  {
    id: "nextjs-generatestaticparams",
    category: "nextjs",
    topic: "Tricky",
    title: "generateStaticParams",
    difficulty: "Intermediate",
    summary: `Pre-build dynamic route pages at build time`,
    explanation: `dynamicParams=true (default): generate on demand. dynamicParams=false: 404 for unknown slugs.`,
    code: `export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map(p => ({ slug: p.slug }));
}
export const dynamicParams = false; // 404 unknown
export const revalidate = 3600;     // regenerate hourly`,
    interviewQuestion: `What happens to paths not in generateStaticParams?`,
  },
  {
    id: "nextjs-next-config-js",
    category: "nextjs",
    topic: "Config",
    title: "next.config.js",
    difficulty: "Intermediate",
    summary: `Configure Next.js build and runtime`,
    explanation: `rewrites: proxy a URL to another path (URL stays same). redirects: send browser to new URL (URL changes, 301/302). Rewrites good for API proxying.`,
    code: `// next.config.ts
import type { NextConfig } from 'next';
const config: NextConfig = {
  images: { remotePatterns: [{ hostname: 'cdn.devquiz.app' }] },
  async rewrites() {
    return [{ source: '/api/:path*', destination: 'https://api.devquiz.app/:path*' }];
  },
  async redirects() {
    return [{ source: '/old', destination: '/new', permanent: true }];
  },
};
export default config;`,
    interviewQuestion: `What are rewrites vs redirects?`,
  },
  {
    id: "nextjs-nextauth-auth-js",
    category: "nextjs",
    topic: "Auth",
    title: "NextAuth / Auth.js",
    difficulty: "Intermediate",
    summary: `Authentication framework for Next.js`,
    explanation: `By default: JWTs (stateless — no DB needed). Can switch to database sessions (Prisma/Drizzle adapter) for revoking sessions server-side. JWT session stored in HTTP-only cookie.`,
    code: `// app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth';
import GitHub from 'next-auth/providers/github';
const { handlers, auth } = NextAuth({
  providers: [GitHub],
  callbacks: {
    session: ({ session, token }) => ({ ...session, userId: token.sub }),
  },
});
export const { GET, POST } = handlers;
// In Server Component:
const session = await auth();`,
    interviewQuestion: `How does Auth.js handle session storage?`,
  },
  {
    id: "nextjs-protecting-routes",
    category: "nextjs",
    topic: "Auth",
    title: "Protecting routes",
    difficulty: "Intermediate",
    summary: `Middleware-based auth guards`,
    explanation: `Use middleware (edge runtime) to check token and redirect. For server components, call auth() at the top and redirect(). For client components, useSession() from next-auth/react.`,
    code: `// middleware.ts
export { auth as middleware } from '@/auth';
export const config = { matcher: ['/dashboard/:path*', '/api/user/:path*'] };
// Server Component auth check
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
async function DashboardPage() {
  const session = await auth();
  if (!session) redirect('/login');
  return <Dashboard user={session.user} />;
}`,
    interviewQuestion: `How do you protect pages in App Router without a HOC?`,
  },
  {
    id: "nextjs-next-js-testing",
    category: "nextjs",
    topic: "Testing",
    title: "Next.js Testing",
    difficulty: "Intermediate",
    summary: `Jest + React Testing Library for App Router`,
    explanation: `Server Components are async functions — render them and await. For components with fetch, mock global.fetch. Use next/jest config for transforms.`,
    code: `// jest.config.ts
const config = require('next/jest');
module.exports = config({ dir: './' })({
  testEnvironment: 'jsdom',
});
// Test Server Component
it('renders posts', async () => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true, json: async () => [{ id: 1, title: 'Post' }]
  });
  const jsx = await PostsList();
  const { getByText } = render(jsx);
  expect(getByText('Post')).toBeTruthy();
});`,
    interviewQuestion: `How do you test Server Components?`,
  },
  {
    id: "nextjs-vercel-deployment",
    category: "nextjs",
    topic: "Deployment",
    title: "Vercel deployment",
    difficulty: "Basic",
    summary: `Deploying Next.js to Vercel`,
    explanation: `Serverless: full Node.js runtime, runs per-region, cold starts. Edge: V8 isolates, runs globally close to user, instant cold start, no Node.js APIs. Edge is faster for auth middleware and A/B testing; Serverless for DB queries.`,
    code: `// Use Edge runtime for fast middleware
export const runtime = 'edge'; // in route.ts or page.tsx
// Vercel-specific features
// ISR: fetch with revalidate
// Edge Config: ultra-low-latency key-value
import { get } from '@vercel/edge-config';
const featureFlag = await get('enableNewUI');`,
    interviewQuestion: `What is the difference between Vercel Edge and Serverless functions?`,
  },
  {
    id: "nextjs-internationalisation",
    category: "nextjs",
    topic: "i18n",
    title: "Internationalisation",
    difficulty: "Intermediate",
    summary: `Multiple language support in Next.js`,
    explanation: `Use locale-based routing: app/[locale]/layout.tsx. Detect preferred locale in middleware. next-intl or next-i18next libraries handle message loading and formatting.`,
    code: `// middleware.ts -- detect and redirect to locale
import { match } from '@formatjs/intl-localematcher';
export function middleware(req) {
  const locale = match(acceptedLanguages, ['en','hi','es'], 'en');
  req.nextUrl.pathname = \`/\${locale}\${req.nextUrl.pathname}\`;
  return NextResponse.redirect(req.nextUrl);
}
// app/[locale]/layout.tsx
export default async function Layout({ children, params }) {
  const { locale } = await params;
  const messages = await import(\`../../messages/\${locale}.json\`);
  return <NextIntlClientProvider locale={locale} messages={messages.default}>{children}</NextIntlClientProvider>;
}`,
    interviewQuestion: `How do you implement i18n in App Router?`,
  },
  {
    id: "nextjs-error-tsx-global-error-tsx",
    category: "nextjs",
    topic: "Error Handling",
    title: "error.tsx & global-error.tsx",
    difficulty: "Intermediate",
    summary: `Error boundaries in App Router`,
    explanation: `error.tsx: handles errors in the segment — layout still renders. global-error.tsx: handles errors in root layout — must include <html>/<body>, replaces entire page.`,
    code: `// app/dashboard/error.tsx
'use client';
export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div>
      <h2>Dashboard error: {error.message}</h2>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
// app/global-error.tsx
'use client';
export default function GlobalError({ error, reset }) {
  return <html><body><h1>Fatal error</h1><button onClick={reset}>Reload</button></body></html>;
}`,
    interviewQuestion: `What is the difference between error.tsx and global-error.tsx?`,
  },
  {
    id: "nextjs-next-js-security-headers",
    category: "nextjs",
    topic: "Security",
    title: "Next.js Security headers",
    difficulty: "Advanced",
    summary: `Set security headers via next.config`,
    explanation: `CSP tells browser which sources are allowed for scripts, styles, images, etc. Prevents XSS — even if attacker injects a <script>, CSP blocks execution if src not whitelisted.`,
    code: `// next.config.ts
const securityHeaders = [
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Content-Security-Policy',
    value: "default-src 'self'; script-src 'self' 'nonce-{nonce}'" },
];
async headers() { return [{ source: '/(.*)', headers: securityHeaders }]; }`,
    interviewQuestion: `What is Content-Security-Policy and why is it important?`,
  },
  {
    id: "nextjs-bundle-analysis",
    category: "nextjs",
    topic: "Performance",
    title: "Bundle analysis",
    difficulty: "Intermediate",
    summary: `Analyse and reduce Next.js bundle size`,
    explanation: `Install, wrap next.config with withBundleAnalyzer, set ANALYZE=true at build time. Opens a treemap of your client + server bundles — identify large dependencies.`,
    code: `npm i @next/bundle-analyzer
// next.config.ts
const withAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});
module.exports = withAnalyzer(nextConfig);
// Run
ANALYZE=true npm run build`,
    interviewQuestion: `How do you use @next/bundle-analyzer?`,
  },

  // ── Git & GitHub ──────────────────────────────────────────────────────────
  {
    id: "git-init-basics",
    category: "git",
    topic: "Basics",
    title: "git init, add, commit",
    difficulty: "Basic",
    summary: "Three-step workflow: track files with add, snapshot with commit, share with push",
    explanation: `Git has three areas: Working Directory (your files), Staging Area (what will be committed), and Repository (.git folder).

git init — creates a new .git directory and starts tracking the folder as a repository.
git add <file> — moves changes from Working Directory to Staging Area. Use git add . to stage everything.
git commit -m "message" — takes a snapshot of the Staging Area and saves it to the Repository with a message.

Every commit gets a unique SHA hash. You can always go back to any commit using git checkout <hash> or git reset.`,
    code: `# Start a repo
git init

# Stage a file
git add README.md

# Stage everything
git add .

# Commit with message
git commit -m "feat: initial commit"

# See commit history
git log --oneline`,
    interviewQuestion: "What is the difference between git add and git commit?",
  },
  {
    id: "git-branching",
    category: "git",
    topic: "Branching",
    title: "Branches & Merging",
    difficulty: "Basic",
    summary: "Branches are lightweight pointers to commits — create, switch, and merge without copying files",
    explanation: `A branch is just a named pointer to a commit. HEAD points to the current branch.

git branch <name> — creates a new branch at the current commit.
git checkout <name> or git switch <name> — moves HEAD to that branch.
git checkout -b <name> — shortcut: create + switch.
git merge <branch> — merges the target branch into the current branch.

Fast-forward merge: if current branch has no new commits, Git just moves the pointer forward — no merge commit.
Three-way merge: if both branches diverged, Git creates a merge commit combining both histories.

Always pull before merging to avoid conflicts.`,
    code: `# Create and switch to feature branch
git checkout -b feature/login

# Or newer syntax
git switch -c feature/login

# List all branches
git branch -a

# Merge feature into main
git checkout main
git merge feature/login

# Delete branch after merge
git branch -d feature/login`,
    interviewQuestion: "What is the difference between a fast-forward merge and a three-way merge?",
  },
  {
    id: "git-remote",
    category: "git",
    topic: "Remote",
    title: "Remote, fetch, pull, push",
    difficulty: "Basic",
    summary: "Remote repos live on a server — push sends your commits, pull fetches + merges them",
    explanation: `git remote add origin <url> — links your local repo to a remote URL (called 'origin' by convention).
git push origin <branch> — sends local commits to the remote branch.
git fetch — downloads remote changes WITHOUT merging them. Safe to run anytime.
git pull — fetch + merge in one step. Can cause conflicts if local branch diverged.
git pull --rebase — fetch + rebase instead of merge, keeping a cleaner linear history.

git push -u origin main sets the upstream tracking so future git push / git pull work without arguments.`,
    code: `# Link to GitHub remote
git remote add origin https://github.com/user/repo.git

# Push for first time (sets upstream)
git push -u origin main

# Subsequent pushes
git push

# Fetch without merging
git fetch origin

# Pull (fetch + merge)
git pull origin main

# Pull with rebase (cleaner history)
git pull --rebase origin main`,
    interviewQuestion: "What is the difference between git fetch and git pull?",
  },
  {
    id: "git-stash",
    category: "git",
    topic: "Stash",
    title: "git stash",
    difficulty: "Intermediate",
    summary: "Stash saves uncommitted work temporarily so you can switch branches without losing changes",
    explanation: `git stash — saves all uncommitted changes (tracked files only) to a stash stack and reverts Working Directory to HEAD.
git stash pop — applies the latest stash and removes it from the stack.
git stash apply — applies the latest stash but keeps it in the stack.
git stash list — shows all stashes (stash@{0} is newest).
git stash drop stash@{0} — removes a specific stash.
git stash push -u — also stashes untracked files.
git stash push -m "WIP: login form" — name the stash for clarity.

Common use case: you're mid-feature and need to hotfix main. Stash your changes, fix the bug, push, then pop stash to resume.`,
    code: `# Save uncommitted work
git stash

# Include untracked files
git stash push -u -m "WIP: login form"

# List stashes
git stash list
# stash@{0}: WIP: login form
# stash@{1}: On main: quick fix

# Apply newest stash
git stash pop

# Apply specific stash
git stash apply stash@{1}

# Clear all stashes
git stash clear`,
    interviewQuestion: "When would you use git stash instead of committing?",
  },
  {
    id: "git-rebase",
    category: "git",
    topic: "Rebase",
    title: "git rebase & interactive rebase",
    difficulty: "Advanced",
    summary: "Rebase replays commits on top of another branch — cleaner history than merge but rewrites SHAs",
    explanation: `git rebase <base> — takes all commits from your current branch that diverged from <base> and re-applies them one by one on top of <base>.

Result: linear history instead of a merge commit.
Caveat: rewrites SHA hashes — never rebase commits already pushed to a shared branch.

Interactive rebase (git rebase -i HEAD~N) lets you:
• pick — keep the commit
• squash / fixup — combine multiple commits into one
• reword — change the commit message
• drop — delete a commit
• edit — stop and amend a commit

git rebase --abort cancels a rebase in progress.
git rebase --continue after resolving conflicts to proceed.`,
    code: `# Rebase feature onto latest main
git checkout feature/login
git rebase main

# Interactive rebase: clean up last 3 commits
git rebase -i HEAD~3

# In the editor:
# pick abc1234 add login form
# squash def5678 fix typo
# reword ghi9012 add validation

# After conflict during rebase:
git add resolved-file.js
git rebase --continue

# Abort rebase
git rebase --abort`,
    interviewQuestion: "What is the difference between git merge and git rebase? When would you choose each?",
  },
  {
    id: "git-reset-revert",
    category: "git",
    topic: "Undoing",
    title: "reset, revert, restore",
    difficulty: "Intermediate",
    summary: "reset rewrites history, revert adds an undo commit — revert is safe for shared branches",
    explanation: `Three ways to undo in Git:

git restore <file> — discards unstaged changes in Working Directory (safe, can't undo).
git reset HEAD <file> — unstages a file (moves from Staging back to Working Directory).
git reset --soft HEAD~1 — moves HEAD back 1 commit, keeps changes staged.
git reset --mixed HEAD~1 — (default) moves HEAD back, keeps changes unstaged.
git reset --hard HEAD~1 — moves HEAD back and DELETES changes. Irreversible.

git revert <hash> — creates a new commit that undoes the changes from <hash>. Doesn't rewrite history — safe for shared branches.

Rule: use reset for local, unshared commits. Use revert for commits already on remote/shared branch.`,
    code: `# Discard uncommitted file change
git restore src/App.js

# Unstage a file
git reset HEAD src/App.js

# Undo last commit, keep changes staged
git reset --soft HEAD~1

# Undo last commit, keep changes unstaged
git reset --mixed HEAD~1

# Undo last commit, DELETE changes (dangerous!)
git reset --hard HEAD~1

# Safe undo: creates a new "undo" commit
git revert abc1234`,
    interviewQuestion: "What is the difference between git reset --hard and git revert?",
  },
  {
    id: "git-cherry-pick",
    category: "git",
    topic: "Advanced",
    title: "cherry-pick",
    difficulty: "Advanced",
    summary: "cherry-pick copies a specific commit from another branch without merging the whole branch",
    explanation: `git cherry-pick <hash> — applies the changes from the specified commit onto your current branch as a new commit (new SHA).

Use cases:
• Backport a bugfix from main to a release branch without bringing along unfinished features.
• Pull a single commit from a colleague's feature branch before it's merged.

git cherry-pick <hash1>..<hash2> — applies a range of commits.
git cherry-pick --no-commit <hash> — applies changes to Working Directory without committing (lets you review first).

Conflicts are resolved the same way as merge conflicts.`,
    code: `# Pick one commit from another branch
git cherry-pick abc1234

# Pick a range of commits
git cherry-pick abc1234^..def5678

# Apply without committing
git cherry-pick --no-commit abc1234

# After resolving conflict
git add resolved.js
git cherry-pick --continue`,
    interviewQuestion: "When would you use git cherry-pick instead of merging or rebasing?",
  },
  {
    id: "git-worktree",
    category: "git",
    topic: "Advanced",
    title: "git worktree — work on 2 branches at once",
    difficulty: "Advanced",
    summary: "git worktree creates a second working directory linked to the same repo, so you can have two branches checked out simultaneously",
    explanation: `git worktree lets you check out multiple branches of the same repo into separate folders at the same time — without stashing or switching.

This is perfect when you:
• Need to hotfix main while still developing a feature branch
• Want to run tests on one branch while writing code on another
• Are reviewing a PR without disturbing your current state

git worktree add ../hotfix main — creates folder ../hotfix with main checked out.
You can cd into it and work normally — git add, commit, push — it's fully independent.
git worktree list — shows all linked worktrees.
git worktree remove ../hotfix — removes the worktree folder and its link.

The .git folder is shared, so history and objects are shared. You cannot check out the same branch in two worktrees simultaneously.`,
    code: `# Linked worktree on a new branch
git worktree add ../feature-b feature/new-nav

# Linked worktree on existing branch
git worktree add ../hotfix hotfix/crash-fix

# List all worktrees
git worktree list
# /Users/me/myproject  abc1234 [main]
# /Users/me/hotfix     def5678 [hotfix/crash-fix]

# Work in the second worktree
cd ../hotfix
git add .
git commit -m "fix: crash on empty state"
git push origin hotfix/crash-fix

# Back in main worktree
cd ../myproject
git merge hotfix/crash-fix

# Remove when done
git worktree remove ../hotfix`,
    interviewQuestion: "What is git worktree and when would you use it instead of git stash?",
  },
  {
    id: "git-github-pr",
    category: "git",
    topic: "GitHub",
    title: "Pull Requests & Code Review",
    difficulty: "Basic",
    summary: "A Pull Request proposes merging your branch — the place for code review, discussion, and CI checks before merging",
    explanation: `A Pull Request (PR) on GitHub is a request to merge one branch into another. It's the standard collaboration workflow:

1. Create a feature branch locally: git checkout -b feature/dark-mode
2. Make commits, push: git push -u origin feature/dark-mode
3. Open a PR on GitHub — compare your branch against main (or another target)
4. Teammates review the code, leave comments, request changes
5. CI/CD runs automated tests and checks
6. Once approved, merge the PR — squash, merge commit, or rebase

Best practices:
• Keep PRs small and focused — easier to review
• Write a clear description explaining WHAT and WHY
• Respond to every review comment (resolve or discuss)
• Never force-push to a PR branch in review (rewrites history reviewers already read)
• Delete the branch after merging`,
    code: `# 1. Create feature branch
git checkout -b feature/dark-mode

# 2. Make commits
git add .
git commit -m "feat: add dark mode toggle"

# 3. Push branch to GitHub
git push -u origin feature/dark-mode

# 4. GitHub CLI: open PR from terminal
gh pr create --title "feat: dark mode" --body "Adds dark mode toggle to settings"

# 5. View PR status
gh pr status

# 6. After approval, merge via CLI
gh pr merge --squash

# Or via GitHub UI: click "Merge pull request"`,
    interviewQuestion: "What makes a good Pull Request? What do you look for in code review?",
  },
  {
    id: "git-github-actions",
    category: "git",
    topic: "GitHub",
    title: "GitHub Actions — CI/CD",
    difficulty: "Intermediate",
    summary: "GitHub Actions runs automated workflows (test, build, deploy) on events like push or PR open",
    explanation: `GitHub Actions lets you automate workflows directly in your repository. A workflow is a YAML file in .github/workflows/.

Key concepts:
• trigger (on:) — what event starts the workflow: push, pull_request, schedule, workflow_dispatch
• job — a group of steps that run on one runner (Ubuntu, macOS, Windows)
• step — a single command or Action
• Action — a reusable step from the marketplace (actions/checkout, actions/setup-node)

Common CI pipeline: on every PR, checkout code → install deps → run tests → run lint → build. If any step fails, the PR is blocked.

Secrets (API keys etc.) are stored in repo Settings → Secrets and accessed as env variables: \${{ secrets.MY_KEY }}.`,
    code: `# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main]
  pull_request:

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - run: npm ci
      - run: npm test
      - run: npm run build

  deploy:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci && npm run build
      - run: npx netlify-cli deploy --prod --dir=dist
        env:
          NETLIFY_AUTH_TOKEN: \${{ secrets.NETLIFY_AUTH_TOKEN }}`,
    interviewQuestion: "How does GitHub Actions differ from other CI tools? What is a workflow trigger?",
  },
  {
    id: "git-conflict-resolution",
    category: "git",
    topic: "Conflicts",
    title: "Resolving Merge Conflicts",
    difficulty: "Intermediate",
    summary: "Conflicts happen when two branches change the same line — Git marks them with <<<<<<<, =======, >>>>>>>",
    explanation: `A merge conflict occurs when two branches modified the same part of a file. Git can't auto-merge, so it marks the conflict:

<<<<<<< HEAD
your version
=======
their version
>>>>>>> feature/login

To resolve:
1. Open the file and decide which version to keep (or combine them)
2. Delete the conflict markers (<<<<<<, =======, >>>>>>>)
3. git add <file> to mark it resolved
4. git commit to finish the merge (or git rebase --continue for rebase)

Tools: VS Code has a built-in merge editor. git mergetool opens a 3-way diff. GitHub's web editor works for simple conflicts.

Prevent conflicts: keep PRs small, pull main frequently, communicate with teammates about shared files.`,
    code: `# After git merge or git pull causes conflict:
# Open the file — you'll see:
# <<<<<<< HEAD
# color: red;
# =======
# color: blue;
# >>>>>>> feature/brand-colors

# Edit to resolve (keep both? pick one?)
# color: blue; /* use brand color */

# Stage resolved file
git add src/styles.css

# Complete the merge
git commit

# Or for rebase:
git rebase --continue

# See all conflicted files
git diff --name-only --diff-filter=U`,
    interviewQuestion: "Walk me through how you would resolve a merge conflict.",
  },

  // ── Git extra topics ──────────────────────────────────────────────────────
  {
    id: "git-log-history",
    category: "git",
    topic: "History",
    title: "Reading Git Log & History",
    difficulty: "Basic",
    summary: "git log shows the commit history. Use flags to format and filter it.",
    explanation: `git log is your time machine — it lists every commit on the current branch.

Useful flags:
- --oneline: compact one-line view
- --graph: ASCII branch/merge diagram
- --all: show all branches
- --author="name": filter by author
- --since="2 weeks ago": filter by date
- --grep="fix": search commit messages
- -p: show diff for each commit
- --stat: show files changed per commit

git show <hash>: view a specific commit's diff and metadata.

git log --oneline --graph --all is the most useful combination — shows the full repo topology at a glance.`,
    code: `git log --oneline
# a1b2c3d fix: login redirect
# e4f5g6h feat: add dashboard

git log --oneline --graph --all

git log --author="Alice" --since="1 week ago"

git log -p --follow src/auth.js   # history of one file

git show a1b2c3d   # full diff of one commit`,
    interviewQuestion: "How do you find which commit introduced a specific bug using git log?",
  },
  {
    id: "git-diff",
    category: "git",
    topic: "Inspection",
    title: "git diff — Comparing Changes",
    difficulty: "Basic",
    summary: "git diff compares working directory, staging area, and commits to show what changed.",
    explanation: `git diff shows changes that haven't been staged yet (working directory vs. staging area).

Key variants:
- git diff: unstaged changes
- git diff --staged (or --cached): staged changes vs. last commit
- git diff HEAD: all uncommitted changes (staged + unstaged)
- git diff branch1..branch2: difference between two branches
- git diff <hash1> <hash2>: compare two commits
- git diff HEAD~3: compare with 3 commits ago

Reading a diff:
- Lines starting with + are additions (green)
- Lines starting with - are deletions (red)
- @@ -10,7 +10,8 @@ shows line numbers affected

Use git diff --name-only to just see which files changed without the full diff.`,
    code: `# See unstaged changes
git diff

# See staged changes (ready to commit)
git diff --staged

# Compare main vs feature branch
git diff main..feature/login

# Only show filenames
git diff --name-only HEAD~1`,
    interviewQuestion: "What is the difference between git diff and git diff --staged?",
  },
  {
    id: "git-tag",
    category: "git",
    topic: "Tags",
    title: "Git Tags & Releases",
    difficulty: "Basic",
    summary: "Tags mark specific commits as releases or milestones. Lightweight and annotated tags.",
    explanation: `Tags are pointers to specific commits — most commonly used to mark release versions (v1.0.0).

Lightweight tag: just a name pointing to a commit, no extra info.
Annotated tag: stored as a full Git object with tagger name, date, and message — preferred for releases.

Commands:
- git tag v1.0.0: create a lightweight tag
- git tag -a v1.0.0 -m "First release": annotated tag
- git tag: list all tags
- git show v1.0.0: show tag details
- git push origin v1.0.0: push a specific tag (tags don't push by default)
- git push origin --tags: push all tags
- git tag -d v1.0.0: delete local tag
- git push origin :refs/tags/v1.0.0: delete remote tag

Semantic versioning: MAJOR.MINOR.PATCH — bump MAJOR for breaking changes, MINOR for new features, PATCH for bug fixes.`,
    code: `# Create annotated tag
git tag -a v1.2.0 -m "Add dark mode + bug fixes"

# List tags
git tag

# Push tag to remote
git push origin v1.2.0

# Tag a past commit
git tag -a v1.1.0 a1b2c3d -m "Previous release"

# Delete and re-push
git tag -d v1.2.0
git push origin :refs/tags/v1.2.0`,
    interviewQuestion: "What is the difference between a lightweight tag and an annotated tag in Git?",
  },
  {
    id: "git-bisect",
    category: "git",
    topic: "Debugging",
    title: "git bisect — Binary Search for Bugs",
    difficulty: "Advanced",
    summary: "git bisect does a binary search through commit history to find which commit introduced a bug.",
    explanation: `git bisect is a powerful debugging tool. Instead of checking commits one by one, it uses binary search — O(log n) — to find the bad commit.

How it works:
1. git bisect start
2. git bisect bad: mark current commit as broken
3. git bisect good <hash>: mark a known-good commit
4. Git checks out the midpoint — you test it
5. git bisect good or git bisect bad based on result
6. Repeat until Git identifies the exact commit
7. git bisect reset to return to HEAD

You can also automate it with a test script:
git bisect run npm test
Git will run your script and automatically mark commits good/bad based on exit code (0 = good, non-zero = bad).`,
    code: `git bisect start
git bisect bad          # current HEAD is broken
git bisect good v1.0.0  # this tag was working

# Git checks out midpoint
# → test your app
git bisect good   # or bad

# When done:
git bisect reset

# Automated with a script:
git bisect start
git bisect bad HEAD
git bisect good v1.0.0
git bisect run npm test`,
    interviewQuestion: "How would you use git bisect to find which commit introduced a regression?",
  },
  {
    id: "git-blame",
    category: "git",
    topic: "Inspection",
    title: "git blame — Line-by-Line History",
    difficulty: "Basic",
    summary: "git blame shows who last modified each line of a file and when.",
    explanation: `git blame annotates every line of a file with the commit hash, author, and date that last changed it.

Common uses:
- Find who wrote a confusing piece of code
- See when a line was last changed
- Track down the origin of a bug

git blame <file>: annotate whole file
git blame -L 10,25 <file>: only lines 10-25
git blame -w: ignore whitespace changes
git blame -C: detect lines moved from other files

In VS Code, the GitLens extension provides inline blame on every line automatically.

Note: blame shows the last editor of a line — if someone reformatted code, they'll show up even if they didn't change the logic. Use git log -p to see the full history of a line.`,
    code: `# Annotate whole file
git blame src/auth.js

# Only specific lines
git blame -L 42,60 src/auth.js

# Ignore whitespace
git blame -w src/auth.js

# See full history of a specific function
git log -p -S "function login" src/auth.js`,
    interviewQuestion: "When would you use git blame and what are its limitations?",
  },
  {
    id: "git-stash-advanced",
    category: "git",
    topic: "Stash",
    title: "git stash — Advanced Usage",
    difficulty: "Intermediate",
    summary: "Stash multiple entries, apply selectively, include untracked files, and create branches from stashes.",
    explanation: `Beyond git stash / git stash pop, there are powerful advanced options:

Multiple stashes:
- git stash list: see all stashes (stash@{0}, stash@{1}, …)
- git stash apply stash@{2}: apply a specific stash without removing it
- git stash drop stash@{2}: delete a specific stash
- git stash clear: delete all stashes

Naming stashes:
- git stash push -m "WIP: login form": give a stash a description

Include untracked files:
- git stash push -u: stash untracked files too
- git stash push -a: stash everything including .gitignore'd files

Partial stash:
- git stash push -p: interactively choose which hunks to stash

Create a branch from a stash:
- git stash branch feature/wip stash@{0}: creates a new branch and applies the stash`,
    code: `# Named stash
git stash push -m "half-done auth refactor"

# List all stashes
git stash list
# stash@{0}: On main: half-done auth refactor
# stash@{1}: WIP on feature/login

# Apply specific stash
git stash apply stash@{1}

# Stash including new (untracked) files
git stash push -u

# Partial stash — pick hunks interactively
git stash push -p

# Turn stash into a branch
git stash branch fix/auth stash@{0}`,
    interviewQuestion: "How would you stash only specific files or hunks in Git?",
  },
  {
    id: "git-interactive-rebase",
    category: "git",
    topic: "Rebase",
    title: "Interactive Rebase — Rewriting History",
    difficulty: "Advanced",
    summary: "git rebase -i lets you squash, reorder, edit, or drop commits before merging.",
    explanation: `Interactive rebase (git rebase -i) opens an editor listing recent commits. You can rewrite history before pushing.

Actions per commit:
- pick: keep as-is (default)
- reword: keep commit but edit the message
- edit: pause and amend files + message
- squash (s): melt into the previous commit, combine messages
- fixup (f): like squash but discard this commit's message
- drop (d): delete the commit entirely
- reorder: just move lines up/down to reorder commits

Common workflow:
git rebase -i HEAD~5 (last 5 commits)

Use cases:
- Clean up "WIP" commits before a PR
- Squash 10 tiny commits into 1 meaningful one
- Fix a typo in an old commit message
- Remove a accidentally committed file

Never rebase commits that have already been pushed to a shared branch — it rewrites SHA hashes and causes conflicts for teammates.`,
    code: `# Rewrite last 4 commits
git rebase -i HEAD~4

# Editor opens:
# pick a1b2c3d feat: add login
# pick e4f5g6h fix: typo
# pick h7i8j9k WIP
# pick l1m2n3o WIP 2

# Change to:
# pick a1b2c3d feat: add login
# squash e4f5g6h fix: typo
# fixup h7i8j9k WIP
# fixup l1m2n3o WIP 2

# Result: 1 clean commit with combined message

# Abort if things go wrong
git rebase --abort`,
    interviewQuestion: "What is the difference between squash and fixup in interactive rebase?",
  },
  {
    id: "git-reflog",
    category: "git",
    topic: "Recovery",
    title: "git reflog — Recovering Lost Commits",
    difficulty: "Intermediate",
    summary: "reflog records every HEAD movement. Use it to recover from accidental resets or dropped commits.",
    explanation: `The reflog (reference log) tracks every change to HEAD — commits, checkouts, resets, rebases — kept for 90 days by default.

This is your safety net. Even after git reset --hard or a bad rebase, commits aren't immediately deleted — reflog can find them.

Commands:
- git reflog: show all HEAD movements with relative times
- git reflog show branch-name: show movements for a specific branch
- git checkout HEAD@{3}: go back to what HEAD was 3 steps ago
- git reset --hard HEAD@{2}: restore branch to a previous state

Recovery workflow:
1. git reflog to find the hash before the mistake
2. git checkout <hash> to inspect it
3. git branch recovery <hash> to create a branch there
4. Or git reset --hard <hash> to restore the current branch

Objects stay in reflog for 90 days, then git gc can collect them.`,
    code: `git reflog
# 1a2b3c4 HEAD@{0}: reset: moving to HEAD~1
# 5d6e7f8 HEAD@{1}: commit: feat: payment flow
# 9g0h1i2 HEAD@{2}: commit: fix: cart total

# Oh no — accidentally reset past an important commit!
# Recover it:
git checkout 5d6e7f8        # inspect
git branch recovery/payment 5d6e7f8  # save it
git switch main
git merge recovery/payment`,
    interviewQuestion: "How would you recover a commit that was lost after git reset --hard?",
  },
  {
    id: "git-fetch-pull",
    category: "git",
    topic: "Remote",
    title: "git fetch vs git pull",
    difficulty: "Basic",
    summary: "fetch downloads changes without merging; pull = fetch + merge (or rebase). Know the difference.",
    explanation: `Both commands download changes from a remote, but they behave differently:

git fetch:
- Downloads commits, branches, and tags from remote
- Does NOT change your working directory or current branch
- Updates origin/main but leaves your local main untouched
- Safe — you can inspect before integrating

git pull:
- Equivalent to git fetch + git merge (by default)
- Immediately merges remote changes into your current branch
- Can cause merge commits if you have local commits
- git pull --rebase: fetches then rebases instead of merging (cleaner history)

Best practice:
Use git fetch first, inspect with git log origin/main, then git merge or git rebase origin/main yourself. This gives you full control.

git pull origin main is fine for simple cases but can surprise you with merge commits.`,
    code: `# Download without touching your branch
git fetch origin

# See what's new on remote main
git log origin/main --oneline

# Merge after reviewing
git merge origin/main

# OR: pull and rebase in one step
git pull --rebase origin main

# Set rebase as default for all pulls
git config --global pull.rebase true`,
    interviewQuestion: "What is the difference between git fetch and git pull? When would you use each?",
  },
  {
    id: "git-hooks",
    category: "git",
    topic: "Automation",
    title: "Git Hooks — Automate Git Events",
    difficulty: "Intermediate",
    summary: "Git hooks are scripts that run automatically at key Git events (commit, push, merge).",
    explanation: `Git hooks are shell scripts stored in .git/hooks/ that fire at specific Git lifecycle events.

Common hooks:
- pre-commit: runs before a commit is created. Use to run linters, formatters, or tests. Exit non-zero to abort the commit.
- commit-msg: validates the commit message format (e.g., enforce Conventional Commits)
- pre-push: runs before git push — use to run full test suite
- post-merge: runs after a successful merge — use to npm install if package.json changed
- prepare-commit-msg: prepopulates the commit message editor

Sharing hooks:
.git/hooks/ is not committed to the repo. To share hooks:
- Use husky (npm package) — hooks live in .husky/ and are committed
- Use lint-staged with husky to only lint staged files

Tools like Prettier, ESLint, and type-checkers are commonly run as pre-commit hooks to enforce standards automatically.`,
    code: `# .husky/pre-commit
#!/bin/sh
npx lint-staged

# package.json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.css": ["prettier --write"]
  }
}

# Setup husky in a project:
npm install --save-dev husky lint-staged
npx husky init
echo "npx lint-staged" > .husky/pre-commit`,
    interviewQuestion: "How would you enforce that all commits follow the Conventional Commits format using Git hooks?",
  },
  {
    id: "git-submodules",
    category: "git",
    topic: "Advanced",
    title: "Git Submodules",
    difficulty: "Advanced",
    summary: "Submodules let you embed one Git repo inside another, pinned to a specific commit.",
    explanation: `A submodule is a pointer from one Git repo to a specific commit in another repo. The inner repo is tracked as a dependency.

When to use:
- Shared component libraries across multiple projects
- Vendoring third-party repos you want to pin to a specific version
- Monorepo alternatives

Key commands:
- git submodule add <url>: add a submodule
- git submodule init + git submodule update: initialize after cloning
- git clone --recurse-submodules <url>: clone with all submodules
- git submodule update --remote: pull latest from submodule's remote

Gotchas:
- Submodules are pinned to a commit, not a branch — you must manually update them
- Forgetting git submodule update after pulling is a common mistake
- Deleting a submodule requires editing .gitmodules, .git/config, and running git rm

Many teams prefer monorepos with workspaces (npm/yarn/pnpm) or package managers over submodules.`,
    code: `# Add a submodule
git submodule add https://github.com/org/shared-ui components/shared-ui

# Clone a repo that has submodules
git clone --recurse-submodules https://github.com/org/myapp

# If you already cloned without --recurse-submodules
git submodule init
git submodule update

# Update submodule to latest
git submodule update --remote components/shared-ui

# See submodule status
git submodule status`,
    interviewQuestion: "What are Git submodules and what problems can they cause?",
  },
  {
    id: "git-squash-merge",
    category: "git",
    topic: "Merging",
    title: "Merge Strategies — Squash, Rebase, Merge Commit",
    difficulty: "Intermediate",
    summary: "Three ways to integrate a branch: merge commit, squash merge, rebase merge. Each has different history implications.",
    explanation: `When merging a PR/branch, you choose a strategy:

1. Merge Commit (--no-ff):
- Creates a merge commit tying both histories together
- Preserves full feature branch history
- History can get noisy with many branches
- git merge --no-ff feature/login

2. Squash Merge:
- Combines all feature commits into one commit on main
- Clean linear history, but loses granular commit history
- git merge --squash feature/login → then commit
- GitHub "Squash and merge" button does this

3. Rebase Merge:
- Replays feature commits on top of main — no merge commit
- Clean linear history, preserves individual commits
- git rebase main, then fast-forward merge
- GitHub "Rebase and merge" button

Which to use:
- Teams wanting clean history → squash or rebase
- Teams wanting full audit trail → merge commit
- Most teams use squash for features, merge commits for releases`,
    code: `# Standard merge commit
git merge --no-ff feature/login

# Squash merge (manually)
git merge --squash feature/login
git commit -m "feat: add login page"

# Rebase then fast-forward
git checkout feature/login
git rebase main
git checkout main
git merge feature/login   # fast-forward`,
    interviewQuestion: "What is the difference between squash merge, rebase merge, and a merge commit?",
  },
  {
    id: "git-gitignore",
    category: "git",
    topic: "Config",
    title: ".gitignore — Excluding Files",
    difficulty: "Basic",
    summary: ".gitignore tells Git which files and folders to never track. Patterns use glob syntax.",
    explanation: `The .gitignore file lists patterns for files Git should ignore. Ignored files don't appear in git status and can't be accidentally committed.

Pattern syntax:
- node_modules/: ignore a folder and all its contents
- *.log: ignore all .log files
- !important.log: un-ignore a specific file (exception)
- /dist: only ignore dist at root level
- **/*.test.js: ignore in any subdirectory
- # comment: comments start with #

Common things to ignore:
- node_modules/, .venv/, __pycache__/
- .env, .env.local (secrets!)
- dist/, build/, .next/
- .DS_Store (macOS), Thumbs.db (Windows)
- IDE files: .vscode/, .idea/

If a file was already tracked before being added to .gitignore, it keeps being tracked. Fix with:
git rm --cached <file>

Global gitignore (for IDE/OS files):
git config --global core.excludesFile ~/.gitignore_global`,
    code: `# .gitignore
node_modules/
.env
.env.local
dist/
build/
.next/
.DS_Store
*.log
coverage/
.vscode/settings.json

# Un-track a file that was already committed
git rm --cached .env
echo ".env" >> .gitignore
git commit -m "chore: stop tracking .env"

# Check why a file is ignored
git check-ignore -v .env`,
    interviewQuestion: "How do you stop tracking a file that was already committed to Git?",
  },
  {
    id: "git-alias",
    category: "git",
    topic: "Config",
    title: "Git Aliases & Config",
    difficulty: "Basic",
    summary: "Create short aliases for long Git commands. Store in ~/.gitconfig for global use.",
    explanation: `Git aliases let you create shortcuts for frequently used commands.

Set globally via git config --global alias.<name> '<command>'

Useful aliases:
- git st → git status
- git co → git checkout
- git br → git branch
- git lg → pretty git log
- git undo → undo last commit but keep changes staged

The .gitconfig file (at ~/.gitconfig) stores all global config: identity, aliases, default branch name, pull behavior, etc.

Important config options:
- user.name / user.email: identity for commits
- core.editor: default editor (nvim, code --wait, nano)
- init.defaultBranch: default branch name (main)
- pull.rebase: use rebase for pulls by default
- push.autoSetupRemote: automatically set upstream on push`,
    code: `# Set up identity
git config --global user.name "Alice"
git config --global user.email "alice@example.com"

# Useful aliases
git config --global alias.st status
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.lg "log --oneline --graph --all"
git config --global alias.undo "reset --soft HEAD~1"

# Use alias
git lg
git undo   # undo last commit, keep changes

# Set VS Code as editor
git config --global core.editor "code --wait"

# Auto-set upstream on push
git config --global push.autoSetupRemote true`,
    interviewQuestion: "How do you create a Git alias, and what aliases do you find most useful?",
  },
  {
    id: "git-fork-workflow",
    category: "git",
    topic: "GitHub",
    title: "Fork & Pull Request Workflow",
    difficulty: "Intermediate",
    summary: "The standard open-source workflow: fork a repo, make changes on a branch, open a PR back to upstream.",
    explanation: `The fork & PR workflow is how open source contribution works on GitHub:

1. Fork: create your own copy of the upstream repo on GitHub
2. Clone your fork locally
3. Add upstream remote to stay in sync
4. Create a feature branch
5. Make commits on your branch
6. Push to your fork
7. Open a Pull Request from your fork/branch → upstream/main

Keeping your fork in sync:
git fetch upstream → git merge upstream/main or git rebase upstream/main

In company repos (not open source), you usually just branch directly on the main repo — no fork needed.

PR best practices:
- One feature / bug fix per PR
- Write a clear description with context and screenshots
- Keep PRs small (< 400 lines diff)
- Respond to review comments promptly
- Squash trivial WIP commits before merging`,
    code: `# Fork on GitHub, then:
git clone https://github.com/YOUR_USERNAME/project.git
cd project

# Add upstream
git remote add upstream https://github.com/ORIGINAL/project.git

# Sync with upstream
git fetch upstream
git rebase upstream/main

# Create branch for your change
git checkout -b fix/broken-link

# Make changes, commit
git commit -m "fix: correct broken docs link"

# Push to your fork
git push origin fix/broken-link

# Open PR on GitHub: your-fork/fix/broken-link → original/main`,
    interviewQuestion: "Walk me through the fork and pull request workflow for contributing to an open source project.",
  },
  {
    id: "git-protected-branches",
    category: "git",
    topic: "GitHub",
    title: "Branch Protection & Code Review",
    difficulty: "Intermediate",
    summary: "GitHub branch protection rules enforce PR reviews, CI checks, and prevent force-pushes to main.",
    explanation: `Branch protection rules (GitHub Settings → Branches → Add rule) enforce quality gates on important branches.

Common protections on main/master:
- Require pull request before merging: no direct pushes
- Require N approving reviews: at least 1-2 reviewers must approve
- Require status checks to pass: CI (tests, lint, build) must be green
- Require branches to be up to date: branch must be current with main
- Restrict who can push: only specific teams/users
- Do not allow bypassing: even admins follow the rules

Code review etiquette:
- Reviewers: be specific ("line 42: this O(n²) loop will hurt with large datasets"), not just "looks good"
- Authors: don't take feedback personally, explain your reasoning
- Use "suggestion" blocks on GitHub to propose exact code changes
- Resolve conversations before merging

CODEOWNERS file: automatically request reviews from specific teams based on which files changed.`,
    code: `# CODEOWNERS file (in root or .github/)
# Format: path  owner(s)

# Everything → backend team
*           @org/backend-team

# Frontend files → frontend team
*.jsx       @org/frontend-team
*.tsx       @org/frontend-team
src/        @org/frontend-team

# Specific file → lead engineer
src/auth/   @alice @bob

# Docs → anyone on docs team
docs/       @org/docs-team`,
    interviewQuestion: "What are branch protection rules and why are they important in a team environment?",
  },
  {
    id: "git-ci-cd-basics",
    category: "git",
    topic: "CI/CD",
    title: "CI/CD with Git — Pipelines on Push",
    difficulty: "Intermediate",
    summary: "CI runs tests on every push/PR. CD deploys automatically when main is green. Git events trigger pipelines.",
    explanation: `Continuous Integration (CI): automatically run tests, linting, and builds on every push and PR.
Continuous Deployment (CD): automatically deploy to staging or production when CI passes on main.

Git events that trigger pipelines:
- push to any branch → run tests
- pull_request → run tests + post results as PR check
- push to main → deploy to production
- tag push (v*) → create a release

Popular CI/CD platforms:
- GitHub Actions (built into GitHub, YAML in .github/workflows/)
- Vercel / Netlify (auto-deploy on push, preview URLs on PRs)
- CircleCI, Jenkins, GitLab CI

The workflow on a healthy team:
1. Developer pushes a branch
2. CI runs tests → green/red shows on PR
3. Reviewer approves + CI is green
4. Merge to main
5. CD deploys main to production automatically

Feature flags separate deployment from release — code ships to prod but is hidden behind a flag until ready.`,
    code: `# .github/workflows/ci.yml
name: CI
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run lint
      - run: npm test`,
    interviewQuestion: "What is the difference between Continuous Integration and Continuous Deployment?",
  },
  {
    id: "git-conventional-commits",
    category: "git",
    topic: "Workflow",
    title: "Conventional Commits",
    difficulty: "Basic",
    summary: "A commit message standard: type(scope): description. Powers changelogs, semantic versioning, and tooling.",
    explanation: `Conventional Commits is a specification for structured commit messages that humans and tools can parse.

Format: <type>(<scope>): <short description>

Common types:
- feat: a new feature (triggers MINOR version bump)
- fix: a bug fix (triggers PATCH version bump)
- docs: documentation only
- style: formatting, no logic change
- refactor: code change without new feature or bug fix
- test: adding or fixing tests
- chore: build process, dependency updates
- perf: performance improvement
- ci: CI/CD changes
- BREAKING CHANGE: (in footer) triggers MAJOR version bump

Benefits:
- Auto-generate changelogs (semantic-release, conventional-changelog)
- Auto-bump semantic version based on commit types
- Easier to scan history — type at a glance tells you what a commit does
- Works well with commit-msg hooks to enforce format

Tools: commitizen (interactive commit helper), @commitlint/cli (enforcer)`,
    code: `# Good conventional commits:
git commit -m "feat(auth): add Google OAuth login"
git commit -m "fix(cart): prevent double-submit on checkout"
git commit -m "docs(readme): add setup instructions"
git commit -m "refactor(api): extract fetch logic to useApi hook"
git commit -m "test(auth): add unit tests for token refresh"
git commit -m "chore(deps): bump react to 19.0.0"

# Breaking change:
git commit -m "feat(api)!: rename /users to /accounts

BREAKING CHANGE: /users endpoint removed, use /accounts"`,
    interviewQuestion: "What are Conventional Commits and how do they help automate versioning?",
  },
  {
    id: "git-mono-repo",
    category: "git",
    topic: "Architecture",
    title: "Monorepo vs Polyrepo",
    difficulty: "Intermediate",
    summary: "Monorepo = all projects in one Git repo. Polyrepo = one repo per project. Each has distinct trade-offs.",
    explanation: `Monorepo: all code (frontend, backend, mobile, shared libs) lives in one Git repository.

Pros of monorepo:
- Shared code / type definitions in one place — no versioning pain
- Atomic commits across multiple packages
- Single CI pipeline, consistent tooling
- Easy refactoring across packages
- Used by Google, Meta, Microsoft, Vercel

Cons of monorepo:
- Git history gets large — git clone is slow
- CI must be smart (only test what changed)
- Need tools: Turborepo, Nx, Bazel for caching/orchestration

Polyrepo: each service/app is its own repo.

Pros: independent release cycles, smaller repos, clear ownership.
Cons: shared code versioning headache, harder to make cross-repo changes, duplicated tooling config.

Most modern teams use monorepos with workspace tools (pnpm workspaces, npm workspaces, Turborepo).`,
    code: `# Typical monorepo structure
apps/
  web/          # Next.js
  mobile/       # React Native
  api/          # Express or FastAPI
packages/
  ui/           # Shared component library
  types/        # Shared TypeScript types
  utils/        # Shared utilities
turbo.json      # Turborepo pipeline
package.json    # Root workspace config

# package.json (root)
{
  "workspaces": ["apps/*", "packages/*"]
}

# Run all tests across packages
npx turbo run test

# Only rebuild what changed
npx turbo run build --filter=[HEAD^1]`,
    interviewQuestion: "What are the trade-offs between a monorepo and a polyrepo architecture?",
  },
];

