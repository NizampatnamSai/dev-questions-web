// Auto-generated — 264 topics across 7 technologies
export const STUDY_CATEGORIES = [
  {
    id: "html",
    label: "HTML",
    icon: "\ud83c\udf10",
    color: "#e34c26",
    sources: [
      { label: "W3Schools", url: "https://www.w3schools.com/html/" },
      {
        label: "MDN",
        url: "https://developer.mozilla.org/en-US/docs/Web/HTML",
      },
    ],
  },
  {
    id: "css",
    label: "CSS",
    icon: "\ud83c\udfa8",
    color: "#264de4",
    sources: [
      { label: "W3Schools", url: "https://www.w3schools.com/css/" },
      { label: "MDN", url: "https://developer.mozilla.org/en-US/docs/Web/CSS" },
    ],
  },
  {
    id: "javascript",
    label: "JavaScript",
    icon: "\u26a1",
    color: "#f7df1e",
    sources: [
      {
        label: "MDN",
        url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
      },
      { label: "javascript.info", url: "https://javascript.info/" },
    ],
  },
  {
    id: "typescript",
    label: "TypeScript",
    icon: "\ud83d\udd37",
    color: "#3178c6",
    sources: [
      { label: "TypeScript Docs", url: "https://www.typescriptlang.org/docs/" },
      { label: "W3Schools", url: "https://www.w3schools.com/typescript/" },
    ],
  },
  {
    id: "react",
    label: "React",
    icon: "\u269b\ufe0f",
    color: "#61dafb",
    sources: [
      { label: "React Docs", url: "https://react.dev/" },
      { label: "W3Schools", url: "https://www.w3schools.com/react/" },
    ],
  },
  {
    id: "reactnative",
    label: "React Native",
    icon: "\ud83d\udcf1",
    color: "#0fa5e9",
    sources: [
      { label: "RN Docs", url: "https://reactnative.dev/docs/getting-started" },
      { label: "Expo Docs", url: "https://docs.expo.dev/" },
    ],
  },
  {
    id: "nextjs",
    label: "Next.js",
    icon: "\u25b2",
    color: "#000000",
    sources: [
      { label: "Next.js Docs", url: "https://nextjs.org/docs" },
      { label: "Learn Next.js", url: "https://nextjs.org/learn" },
    ],
  },
  {
    id: "git",
    label: "Git & GitHub",
    icon: "🐙",
    color: "#f05032",
    sources: [
      { label: "W3Schools", url: "https://www.w3schools.com/git/" },
      { label: "Git Docs", url: "https://git-scm.com/doc" },
    ],
  },
  {
    id: "python",
    label: "Python",
    icon: "🐍",
    color: "#3776ab",
    sources: [
      { label: "Python Docs", url: "https://docs.python.org/3/" },
      { label: "W3Schools", url: "https://www.w3schools.com/python/" },
    ],
  },
  {
    id: "pybackend",
    label: "Python Backend",
    icon: "⚙️",
    color: "#009688",
    sources: [
      { label: "FastAPI Docs", url: "https://fastapi.tiangolo.com/" },
      { label: "Django Docs", url: "https://docs.djangoproject.com/" },
    ],
  },
  {
    id: "pyai",
    label: "Python AI/ML",
    icon: "🤖",
    color: "#ff6f00",
    sources: [
      { label: "scikit-learn", url: "https://scikit-learn.org/stable/" },
      { label: "TensorFlow", url: "https://www.tensorflow.org/learn" },
    ],
  },
  {
    id: "pydata",
    label: "Python Data Analysis",
    icon: "📊",
    color: "#1565c0",
    sources: [
      { label: "Pandas Docs", url: "https://pandas.pydata.org/docs/" },
      { label: "Matplotlib", url: "https://matplotlib.org/stable/tutorials/" },
    ],
  },
  {
    id: "nodejs",
    label: "Node.js",
    icon: "🟢",
    color: "#339933",
    sources: [
      { label: "Node.js Docs", url: "https://nodejs.org/en/docs/" },
      { label: "W3Schools", url: "https://www.w3schools.com/nodejs/" },
    ],
  },
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
    summary:
      "Three-step workflow: track files with add, snapshot with commit, share with push",
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
    summary:
      "Branches are lightweight pointers to commits — create, switch, and merge without copying files",
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
    interviewQuestion:
      "What is the difference between a fast-forward merge and a three-way merge?",
  },
  {
    id: "git-remote",
    category: "git",
    topic: "Remote",
    title: "Remote, fetch, pull, push",
    difficulty: "Basic",
    summary:
      "Remote repos live on a server — push sends your commits, pull fetches + merges them",
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
    summary:
      "Stash saves uncommitted work temporarily so you can switch branches without losing changes",
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
    summary:
      "Rebase replays commits on top of another branch — cleaner history than merge but rewrites SHAs",
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
    interviewQuestion:
      "What is the difference between git merge and git rebase? When would you choose each?",
  },
  {
    id: "git-reset-revert",
    category: "git",
    topic: "Undoing",
    title: "reset, revert, restore",
    difficulty: "Intermediate",
    summary:
      "reset rewrites history, revert adds an undo commit — revert is safe for shared branches",
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
    interviewQuestion:
      "What is the difference between git reset --hard and git revert?",
  },
  {
    id: "git-cherry-pick",
    category: "git",
    topic: "Advanced",
    title: "cherry-pick",
    difficulty: "Advanced",
    summary:
      "cherry-pick copies a specific commit from another branch without merging the whole branch",
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
    interviewQuestion:
      "When would you use git cherry-pick instead of merging or rebasing?",
  },
  {
    id: "git-worktree",
    category: "git",
    topic: "Advanced",
    title: "git worktree — work on 2 branches at once",
    difficulty: "Advanced",
    summary:
      "git worktree creates a second working directory linked to the same repo, so you can have two branches checked out simultaneously",
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
    interviewQuestion:
      "What is git worktree and when would you use it instead of git stash?",
  },
  {
    id: "git-github-pr",
    category: "git",
    topic: "GitHub",
    title: "Pull Requests & Code Review",
    difficulty: "Basic",
    summary:
      "A Pull Request proposes merging your branch — the place for code review, discussion, and CI checks before merging",
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
    interviewQuestion:
      "What makes a good Pull Request? What do you look for in code review?",
  },
  {
    id: "git-github-actions",
    category: "git",
    topic: "GitHub",
    title: "GitHub Actions — CI/CD",
    difficulty: "Intermediate",
    summary:
      "GitHub Actions runs automated workflows (test, build, deploy) on events like push or PR open",
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
    interviewQuestion:
      "How does GitHub Actions differ from other CI tools? What is a workflow trigger?",
  },
  {
    id: "git-conflict-resolution",
    category: "git",
    topic: "Conflicts",
    title: "Resolving Merge Conflicts",
    difficulty: "Intermediate",
    summary:
      "Conflicts happen when two branches change the same line — Git marks them with <<<<<<<, =======, >>>>>>>",
    explanation: `A merge conflict occurs when two branches modified the same part of a file. Git can't auto-merge, so it marks the conflict:


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
    interviewQuestion:
      "Walk me through how you would resolve a merge conflict.",
  },

  // ── Git extra topics ──────────────────────────────────────────────────────
  {
    id: "git-log-history",
    category: "git",
    topic: "History",
    title: "Reading Git Log & History",
    difficulty: "Basic",
    summary:
      "git log shows the commit history. Use flags to format and filter it.",
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
    interviewQuestion:
      "How do you find which commit introduced a specific bug using git log?",
  },
  {
    id: "git-diff",
    category: "git",
    topic: "Inspection",
    title: "git diff — Comparing Changes",
    difficulty: "Basic",
    summary:
      "git diff compares working directory, staging area, and commits to show what changed.",
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
    interviewQuestion:
      "What is the difference between git diff and git diff --staged?",
  },
  {
    id: "git-tag",
    category: "git",
    topic: "Tags",
    title: "Git Tags & Releases",
    difficulty: "Basic",
    summary:
      "Tags mark specific commits as releases or milestones. Lightweight and annotated tags.",
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
    interviewQuestion:
      "What is the difference between a lightweight tag and an annotated tag in Git?",
  },
  {
    id: "git-bisect",
    category: "git",
    topic: "Debugging",
    title: "git bisect — Binary Search for Bugs",
    difficulty: "Advanced",
    summary:
      "git bisect does a binary search through commit history to find which commit introduced a bug.",
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
    interviewQuestion:
      "How would you use git bisect to find which commit introduced a regression?",
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
    interviewQuestion:
      "When would you use git blame and what are its limitations?",
  },
  {
    id: "git-stash-advanced",
    category: "git",
    topic: "Stash",
    title: "git stash — Advanced Usage",
    difficulty: "Intermediate",
    summary:
      "Stash multiple entries, apply selectively, include untracked files, and create branches from stashes.",
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
    interviewQuestion:
      "How would you stash only specific files or hunks in Git?",
  },
  {
    id: "git-interactive-rebase",
    category: "git",
    topic: "Rebase",
    title: "Interactive Rebase — Rewriting History",
    difficulty: "Advanced",
    summary:
      "git rebase -i lets you squash, reorder, edit, or drop commits before merging.",
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
    interviewQuestion:
      "What is the difference between squash and fixup in interactive rebase?",
  },
  {
    id: "git-reflog",
    category: "git",
    topic: "Recovery",
    title: "git reflog — Recovering Lost Commits",
    difficulty: "Intermediate",
    summary:
      "reflog records every HEAD movement. Use it to recover from accidental resets or dropped commits.",
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
    interviewQuestion:
      "How would you recover a commit that was lost after git reset --hard?",
  },
  {
    id: "git-fetch-pull",
    category: "git",
    topic: "Remote",
    title: "git fetch vs git pull",
    difficulty: "Basic",
    summary:
      "fetch downloads changes without merging; pull = fetch + merge (or rebase). Know the difference.",
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
    interviewQuestion:
      "What is the difference between git fetch and git pull? When would you use each?",
  },
  {
    id: "git-hooks",
    category: "git",
    topic: "Automation",
    title: "Git Hooks — Automate Git Events",
    difficulty: "Intermediate",
    summary:
      "Git hooks are scripts that run automatically at key Git events (commit, push, merge).",
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
    interviewQuestion:
      "How would you enforce that all commits follow the Conventional Commits format using Git hooks?",
  },
  {
    id: "git-submodules",
    category: "git",
    topic: "Advanced",
    title: "Git Submodules",
    difficulty: "Advanced",
    summary:
      "Submodules let you embed one Git repo inside another, pinned to a specific commit.",
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
    interviewQuestion:
      "What are Git submodules and what problems can they cause?",
  },
  {
    id: "git-squash-merge",
    category: "git",
    topic: "Merging",
    title: "Merge Strategies — Squash, Rebase, Merge Commit",
    difficulty: "Intermediate",
    summary:
      "Three ways to integrate a branch: merge commit, squash merge, rebase merge. Each has different history implications.",
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
    interviewQuestion:
      "What is the difference between squash merge, rebase merge, and a merge commit?",
  },
  {
    id: "git-gitignore",
    category: "git",
    topic: "Config",
    title: ".gitignore — Excluding Files",
    difficulty: "Basic",
    summary:
      ".gitignore tells Git which files and folders to never track. Patterns use glob syntax.",
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
    interviewQuestion:
      "How do you stop tracking a file that was already committed to Git?",
  },
  {
    id: "git-alias",
    category: "git",
    topic: "Config",
    title: "Git Aliases & Config",
    difficulty: "Basic",
    summary:
      "Create short aliases for long Git commands. Store in ~/.gitconfig for global use.",
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
    interviewQuestion:
      "How do you create a Git alias, and what aliases do you find most useful?",
  },
  {
    id: "git-fork-workflow",
    category: "git",
    topic: "GitHub",
    title: "Fork & Pull Request Workflow",
    difficulty: "Intermediate",
    summary:
      "The standard open-source workflow: fork a repo, make changes on a branch, open a PR back to upstream.",
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
    interviewQuestion:
      "Walk me through the fork and pull request workflow for contributing to an open source project.",
  },
  {
    id: "git-protected-branches",
    category: "git",
    topic: "GitHub",
    title: "Branch Protection & Code Review",
    difficulty: "Intermediate",
    summary:
      "GitHub branch protection rules enforce PR reviews, CI checks, and prevent force-pushes to main.",
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
    interviewQuestion:
      "What are branch protection rules and why are they important in a team environment?",
  },
  {
    id: "git-ci-cd-basics",
    category: "git",
    topic: "CI/CD",
    title: "CI/CD with Git — Pipelines on Push",
    difficulty: "Intermediate",
    summary:
      "CI runs tests on every push/PR. CD deploys automatically when main is green. Git events trigger pipelines.",
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
    interviewQuestion:
      "What is the difference between Continuous Integration and Continuous Deployment?",
  },
  {
    id: "git-conventional-commits",
    category: "git",
    topic: "Workflow",
    title: "Conventional Commits",
    difficulty: "Basic",
    summary:
      "A commit message standard: type(scope): description. Powers changelogs, semantic versioning, and tooling.",
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
    interviewQuestion:
      "What are Conventional Commits and how do they help automate versioning?",
  },
  {
    id: "git-mono-repo",
    category: "git",
    topic: "Architecture",
    title: "Monorepo vs Polyrepo",
    difficulty: "Intermediate",
    summary:
      "Monorepo = all projects in one Git repo. Polyrepo = one repo per project. Each has distinct trade-offs.",
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
    interviewQuestion:
      "What are the trade-offs between a monorepo and a polyrepo architecture?",
  },

  // ── Python Core ──────────────────────────────────────────────────────────
  {
    id: "python-basics-datatypes",
    category: "python",
    topic: "Core Python",
    title: "Data Types & Variables",
    difficulty: "Basic",
    summary: "Python has dynamic typing — variables have no declared type",
    explanation:
      "Python's built-in types: int, float, str, bool, list, tuple, set, dict, NoneType. Use type() to inspect. Everything is an object.",
    code: `x = 42          # int
y = 3.14        # float
name = "Alice"  # str
active = True   # bool
nums = [1,2,3]  # list  — mutable
pair = (1,2)    # tuple — immutable
unique = {1,2}  # set   — unordered unique
data = {"a":1}  # dict  — key-value

print(type(x))  # <class 'int'>`,
    interviewQuestion:
      "What is the difference between a list and a tuple in Python?",
  },
  {
    id: "python-comprehensions",
    category: "python",
    topic: "Core Python",
    title: "List & Dict Comprehensions",
    difficulty: "Intermediate",
    summary: "Concise way to build lists, dicts, and sets in one line",
    explanation:
      "Comprehensions are faster than loops because they're optimized at the C level. Use them for simple transformations; avoid nesting more than 2 levels.",
    code: `# List comprehension
squares = [x**2 for x in range(10) if x % 2 == 0]
# [0, 4, 16, 36, 64]

# Dict comprehension
word_len = {w: len(w) for w in ["python","is","great"]}
# {'python': 6, 'is': 2, 'great': 5}

# Set comprehension
uniq_chars = {c.lower() for c in "Hello World" if c != " "}`,
    interviewQuestion:
      "When would you use a generator expression instead of a list comprehension?",
  },
  {
    id: "python-decorators",
    category: "python",
    topic: "Core Python",
    title: "Decorators",
    difficulty: "Advanced",
    summary: "Functions that wrap other functions to add behaviour",
    explanation:
      "A decorator is syntactic sugar for higher-order functions. @functools.wraps preserves the wrapped function's metadata (__name__, __doc__).",
    code: `import functools, time

def timer(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        start = time.perf_counter()
        result = func(*args, **kwargs)
        print(f"{func.__name__} took {time.perf_counter()-start:.4f}s")
        return result
    return wrapper

@timer
def slow():
    time.sleep(0.1)

slow()  # slow took 0.1001s`,
    interviewQuestion: "What does @functools.wraps do and why is it important?",
  },
  {
    id: "python-generators",
    category: "python",
    topic: "Core Python",
    title: "Generators & yield",
    difficulty: "Intermediate",
    summary:
      "Lazy iterators that produce values one at a time — memory efficient",
    explanation:
      "A generator function uses yield instead of return. Execution suspends at each yield and resumes on next(). Great for large data streams.",
    code: `def fibonacci():
    a, b = 0, 1
    while True:
        yield a
        a, b = b, a + b

gen = fibonacci()
print([next(gen) for _ in range(8)])
# [0, 1, 1, 2, 3, 5, 8, 13]

# Generator expression (lazy list comprehension)
evens = (x for x in range(1_000_000) if x % 2 == 0)
print(next(evens))  # 0 — only one value computed`,
    interviewQuestion:
      "What is the memory advantage of a generator over a list?",
  },
  {
    id: "python-oop",
    category: "python",
    topic: "Core Python",
    title: "Classes & OOP",
    difficulty: "Intermediate",
    summary:
      "Python supports full OOP: inheritance, encapsulation, polymorphism",
    explanation:
      "__init__ is the constructor. Use @property for computed attributes. __repr__ for dev-friendly string, __str__ for user-friendly. Single underscore _x = convention-private; double __x = name-mangled.",
    code: `class Animal:
    def __init__(self, name: str):
        self.name = name

    def speak(self) -> str:
        raise NotImplementedError

    def __repr__(self):
        return f"Animal({self.name!r})"

class Dog(Animal):
    def speak(self):
        return f"{self.name} says Woof!"

dog = Dog("Rex")
print(dog.speak())   # Rex says Woof!
print(repr(dog))     # Animal('Rex')`,
    interviewQuestion: "What is the difference between __repr__ and __str__?",
  },

  // ── Python Backend ────────────────────────────────────────────────────────
  {
    id: "pybackend-fastapi-basics",
    category: "pybackend",
    topic: "FastAPI",
    title: "FastAPI Basics",
    difficulty: "Basic",
    summary: "FastAPI is a modern async Python web framework with auto docs",
    explanation:
      "FastAPI uses Python type hints for request validation (via Pydantic) and auto-generates OpenAPI docs at /docs. Runs on Uvicorn (ASGI server).",
    code: `from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class Item(BaseModel):
    name: str
    price: float

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.post("/items")
async def create_item(item: Item):
    return {"name": item.name, "price": item.price}

# Run: uvicorn main:app --reload`,
    interviewQuestion: "What is the difference between FastAPI and Flask?",
  },
  {
    id: "pybackend-fastapi-depends",
    category: "pybackend",
    topic: "FastAPI",
    title: "Dependency Injection",
    difficulty: "Intermediate",
    summary:
      "Depends() injects reusable logic like auth, DB sessions, rate limits",
    explanation:
      "FastAPI's dependency injection system runs dependencies before the route handler. They can be chained, async, and have their own dependencies.",
    code: `from fastapi import Depends, HTTPException, Header

async def verify_token(x_token: str = Header(...)):
    if x_token != "secret":
        raise HTTPException(status_code=401, detail="Bad token")
    return x_token

@app.get("/secure")
async def secure_route(token: str = Depends(verify_token)):
    return {"token": token}`,
    interviewQuestion: "How does FastAPI's Depends() differ from middleware?",
  },
  {
    id: "pybackend-mongodb-motor",
    category: "pybackend",
    topic: "Database",
    title: "MongoDB with Motor (Async)",
    difficulty: "Intermediate",
    summary: "Motor is the async MongoDB driver for Python used with FastAPI",
    explanation:
      "Motor wraps PyMongo for async/await usage. Use AsyncIOMotorClient. Operations like find_one, insert_one, update_one are all awaitable.",
    code: `from motor.motor_asyncio import AsyncIOMotorClient

client = AsyncIOMotorClient("mongodb://localhost:27017")
db = client["mydb"]
col = db["users"]

# Insert
result = await col.insert_one({"name": "Alice", "role": "admin"})

# Find one
user = await col.find_one({"name": "Alice"})

# Update
await col.update_one({"name": "Alice"}, {"$set": {"role": "user"}})

# List
docs = await col.find({}).sort("name", 1).to_list(length=100)`,
    interviewQuestion: "Why use Motor instead of PyMongo in a FastAPI app?",
  },
  {
    id: "pybackend-django-orm",
    category: "pybackend",
    topic: "Django",
    title: "Django ORM Basics",
    difficulty: "Intermediate",
    summary: "Django ORM maps Python classes to database tables",
    explanation:
      "Each Model class maps to a DB table. Fields define columns. QuerySets are lazy — they hit DB only when evaluated. Use select_related() for JOIN, prefetch_related() for M2M.",
    code: `from django.db import models

class User(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

# QuerySet examples
User.objects.all()                    # SELECT *
User.objects.filter(name="Alice")     # WHERE name='Alice'
User.objects.get(id=1)               # single row or raise
User.objects.create(name="Bob", email="b@x.com")
User.objects.filter(id=1).update(name="Alice2")`,
    interviewQuestion:
      "What is the N+1 query problem and how does select_related() solve it?",
  },

  // ── Python AI/ML ──────────────────────────────────────────────────────────
  {
    id: "pyai-numpy-basics",
    category: "pyai",
    topic: "NumPy",
    title: "NumPy Arrays & Operations",
    difficulty: "Basic",
    summary: "NumPy ndarray is the foundation of all Python ML/data libraries",
    explanation:
      "NumPy arrays are contiguous memory blocks of typed values. Vectorized operations (no Python loops) make them 100x faster than lists for numerical work.",
    code: `import numpy as np

a = np.array([1, 2, 3, 4, 5])
b = np.zeros((3, 3))          # 3x3 matrix of zeros
c = np.arange(0, 10, 2)       # [0 2 4 6 8]
d = np.linspace(0, 1, 5)      # [0. 0.25 0.5 0.75 1.]

# Vectorized math — no loops needed
print(a * 2)        # [2 4 6 8 10]
print(a.mean())     # 3.0
print(a.reshape(1, 5))  # [[1 2 3 4 5]]

# Boolean masking
print(a[a > 3])     # [4 5]`,
    interviewQuestion: "What is broadcasting in NumPy?",
  },
  {
    id: "pyai-sklearn-pipeline",
    category: "pyai",
    topic: "scikit-learn",
    title: "ML Pipeline with scikit-learn",
    difficulty: "Intermediate",
    summary: "Pipeline chains preprocessing + model into one reusable object",
    explanation:
      "Pipeline prevents data leakage by fitting transformers only on training data. fit() trains the whole pipe; predict() transforms + predicts in one call.",
    code: `from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.datasets import load_iris

X, y = load_iris(return_X_y=True)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

pipe = Pipeline([
    ("scaler", StandardScaler()),
    ("clf",    LogisticRegression()),
])

pipe.fit(X_train, y_train)
print(pipe.score(X_test, y_test))  # ~0.97`,
    interviewQuestion:
      "Why is it important to fit the scaler only on training data?",
  },
  {
    id: "pyai-openai-api",
    category: "pyai",
    topic: "AI Integration",
    title: "OpenAI / LLM API Integration",
    difficulty: "Intermediate",
    summary: "Call LLM APIs with Python to build AI-powered features",
    explanation:
      "Use the openai SDK (or httpx for other providers). Always stream for long responses. Store API keys in env vars, never in code.",
    code: `from openai import OpenAI
import os

client = OpenAI(api_key=os.environ["OPENAI_API_KEY"])

# Basic completion
response = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[
        {"role": "system",  "content": "You are a helpful assistant."},
        {"role": "user",    "content": "Explain async/await in Python."},
    ],
    temperature=0.7,
)
print(response.choices[0].message.content)

# Streaming
stream = client.chat.completions.create(model="gpt-4o-mini",
    messages=[{"role":"user","content":"Tell me a joke"}], stream=True)
for chunk in stream:
    print(chunk.choices[0].delta.content or "", end="")`,
    interviewQuestion:
      "What is the difference between temperature and top_p in LLM APIs?",
  },
  {
    id: "pyai-langchain-basics",
    category: "pyai",
    topic: "AI Integration",
    title: "LangChain Chains & Prompts",
    difficulty: "Advanced",
    summary: "LangChain simplifies building multi-step LLM applications",
    explanation:
      "LangChain's LCEL (LangChain Expression Language) uses | pipe operator to chain prompts, models, and output parsers. Supports memory, tools, and agents.",
    code: `from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

llm = ChatOpenAI(model="gpt-4o-mini")

prompt = ChatPromptTemplate.from_messages([
    ("system", "You are a Python expert."),
    ("user", "Explain {concept} in simple terms."),
])

chain = prompt | llm | StrOutputParser()

result = chain.invoke({"concept": "decorators"})
print(result)`,
    interviewQuestion:
      "What is RAG (Retrieval-Augmented Generation) and when would you use it?",
  },

  // ── Python Data Analysis ──────────────────────────────────────────────────
  {
    id: "pydata-pandas-basics",
    category: "pydata",
    topic: "Pandas",
    title: "DataFrame Basics",
    difficulty: "Basic",
    summary: "Pandas DataFrame is a 2D table — the Excel of Python",
    explanation:
      "A DataFrame is a dict of Series (columns). Index is the row label. Operations are vectorized. Use .loc[] for label-based, .iloc[] for integer-based access.",
    code: `import pandas as pd

df = pd.DataFrame({
    "name":  ["Alice","Bob","Carol"],
    "score": [95, 82, 88],
    "grade": ["A","B","B"],
})

print(df.head())          # first 5 rows
print(df.describe())      # stats summary
print(df["score"].mean()) # 88.33

# Filtering
top = df[df["score"] >= 88]

# Add column
df["passed"] = df["score"] >= 60

# GroupBy
print(df.groupby("grade")["score"].mean())`,
    interviewQuestion: "What is the difference between .loc[] and .iloc[]?",
  },
  {
    id: "pydata-pandas-cleaning",
    category: "pydata",
    topic: "Pandas",
    title: "Data Cleaning",
    difficulty: "Intermediate",
    summary:
      "Handle missing values, duplicates, and type errors in real datasets",
    explanation:
      "Real data is messy. isnull(), dropna(), fillna() handle NaN. astype() fixes type mismatches. drop_duplicates() removes duplicate rows.",
    code: `import pandas as pd
import numpy as np

df = pd.read_csv("data.csv")

# Check missing values
print(df.isnull().sum())

# Drop rows where ALL columns are NaN
df.dropna(how="all", inplace=True)

# Fill missing numeric with median
df["age"].fillna(df["age"].median(), inplace=True)

# Fix types
df["price"] = pd.to_numeric(df["price"], errors="coerce")

# Remove duplicates
df.drop_duplicates(subset=["email"], keep="first", inplace=True)

# Rename columns
df.rename(columns={"user_name": "username"}, inplace=True)`,
    interviewQuestion: "What is the difference between dropna() and fillna()?",
  },
  {
    id: "pydata-matplotlib",
    category: "pydata",
    topic: "Visualization",
    title: "Matplotlib & Seaborn",
    difficulty: "Basic",
    summary:
      "Matplotlib is the base plotting library; Seaborn adds statistical plots",
    explanation:
      "plt.figure() + plt.subplot() for layout control. Seaborn wraps Matplotlib with better defaults and statistical plot types like heatmap, boxplot, pairplot.",
    code: `import matplotlib.pyplot as plt
import seaborn as sns
import pandas as pd

df = pd.DataFrame({"x": range(10), "y": [i**2 for i in range(10)]})

# Matplotlib
fig, axes = plt.subplots(1, 2, figsize=(10, 4))
axes[0].plot(df["x"], df["y"], marker="o", color="steelblue")
axes[0].set_title("Line Chart")

# Seaborn
sns.barplot(data=df, x="x", y="y", ax=axes[1])
axes[1].set_title("Bar Chart")

plt.tight_layout()
plt.savefig("chart.png", dpi=150)
plt.show()`,
    interviewQuestion: "When would you use Seaborn instead of raw Matplotlib?",
  },
  {
    id: "pydata-eda",
    category: "pydata",
    topic: "EDA",
    title: "Exploratory Data Analysis",
    difficulty: "Intermediate",
    summary:
      "EDA is the first step in any data project — understand before modelling",
    explanation:
      "EDA uncovers patterns, outliers, and relationships. Correlation heatmaps show feature relationships. Box plots reveal outliers. Always check data shape, dtypes, and null counts first.",
    code: `import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt

df = pd.read_csv("titanic.csv")

# 1. Shape & types
print(df.shape, df.dtypes)

# 2. Null summary
print(df.isnull().mean().sort_values(ascending=False))

# 3. Distribution
df["Age"].hist(bins=30)
plt.title("Age Distribution")

# 4. Correlation heatmap
corr = df.select_dtypes("number").corr()
sns.heatmap(corr, annot=True, fmt=".2f", cmap="coolwarm")

# 5. Categorical counts
print(df["Survived"].value_counts(normalize=True))`,
    interviewQuestion:
      "What is the first thing you do when you receive a new dataset?",
  },

  // ── Node.js ────────────────────────────────────────────────────────────────
  {
    id: "nodejs-intro",
    category: "nodejs",
    difficulty: "Basic",
    topic: "Node.js Fundamentals",
    title: "What is Node.js?",
    summary:
      "Node.js is a JavaScript runtime built on Chrome's V8 engine that lets you run JS on the server side.",
    explanation:
      "Node.js uses an event-driven, non-blocking I/O model which makes it lightweight and efficient for data-intensive real-time applications.",
    code: `// hello.js
const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello from Node.js!');
});

server.listen(3000, () => console.log('Server running on port 3000'));`,
    interviewQuestion:
      "What is the difference between Node.js and the browser JavaScript environment?",
  },
  {
    id: "nodejs-modules",
    category: "nodejs",
    difficulty: "Basic",
    topic: "Modules",
    title: "CommonJS vs ES Modules",
    summary:
      "Node.js supports both CommonJS (`require`) and ES Modules (`import/export`).",
    explanation:
      'CommonJS is the default system in Node.js. ES Modules are the standard in modern JS. Use `.mjs` extension or `"type": "module"` in package.json for ESM.',
    code: `// CommonJS
const fs = require('fs');
module.exports = { hello: 'world' };

// ES Modules (package.json: "type": "module")
import fs from 'fs';
export const hello = 'world';`,
    interviewQuestion:
      "When would you use ES Modules over CommonJS in Node.js?",
  },
  {
    id: "nodejs-event-loop",
    category: "nodejs",
    difficulty: "Intermediate",
    topic: "Asynchronous Programming",
    title: "Node.js Event Loop",
    summary:
      "The event loop is what allows Node.js to perform non-blocking I/O operations despite JavaScript being single-threaded.",
    explanation:
      "Phases: timers → pending callbacks → idle/prepare → poll → check (setImmediate) → close callbacks. The poll phase waits for I/O events when the queue is empty.",
    code: `setTimeout(() => console.log('timeout'), 0);
setImmediate(() => console.log('immediate'));
Promise.resolve().then(() => console.log('promise'));
console.log('sync');

// Output: sync → promise → timeout → immediate
// (setImmediate fires in check phase, after poll)`,
    interviewQuestion:
      "What is the difference between `process.nextTick` and `setImmediate`?",
  },
  {
    id: "nodejs-fs",
    category: "nodejs",
    difficulty: "Basic",
    topic: "File System",
    title: "File System (fs module)",
    summary:
      "The `fs` module provides APIs to interact with the file system — read, write, delete, watch files.",
    explanation:
      "Always prefer `fs/promises` (async/await) over the callback-based API. Use `fs.readFileSync` only in CLI scripts, never in servers.",
    code: `import { readFile, writeFile } from 'fs/promises';

// Read
const content = await readFile('data.txt', 'utf-8');
console.log(content);

// Write
await writeFile('output.txt', 'Hello!', 'utf-8');

// Stream large files
import { createReadStream } from 'fs';
createReadStream('large.csv').pipe(process.stdout);`,
    interviewQuestion:
      "What is the difference between `fs.readFile` and `fs.createReadStream`?",
  },
  {
    id: "nodejs-express",
    category: "nodejs",
    difficulty: "Basic",
    topic: "Express.js",
    title: "Express.js Basics",
    summary:
      "Express is the most popular Node.js web framework — minimal, fast, and unopinionated.",
    explanation:
      "Express handles routing, middleware, request/response objects. Middleware functions run in order and must call `next()` to pass control.",
    code: `import express from 'express';
const app = express();

app.use(express.json()); // parse JSON body

app.get('/users', (req, res) => {
  res.json([{ id: 1, name: 'Alice' }]);
});

app.post('/users', (req, res) => {
  const { name } = req.body;
  res.status(201).json({ id: 2, name });
});

// Error middleware (4 args)
app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message });
});

app.listen(3000);`,
    interviewQuestion:
      "How does middleware work in Express and what is the role of `next()`?",
  },
  {
    id: "nodejs-async",
    category: "nodejs",
    difficulty: "Intermediate",
    topic: "Asynchronous Programming",
    title: "Async Patterns in Node.js",
    summary:
      "Node.js handles async through callbacks, Promises, and async/await. Understanding each is essential.",
    explanation:
      "Callback hell → Promises → async/await. `util.promisify` converts callback-based Node APIs to Promises. Always handle rejections.",
    code: `import { promisify } from 'util';
import { exec } from 'child_process';

const execAsync = promisify(exec);

async function getFiles() {
  try {
    const { stdout } = await execAsync('ls -la');
    return stdout.split('\\n');
  } catch (err) {
    console.error('Command failed:', err.message);
    throw err;
  }
}

// Running tasks in parallel
const [users, posts] = await Promise.all([
  fetchUsers(),
  fetchPosts(),
]);`,
    interviewQuestion:
      "How do you convert a callback-based Node.js function to use async/await?",
  },
  {
    id: "nodejs-streams",
    category: "nodejs",
    difficulty: "Advanced",
    topic: "Streams",
    title: "Streams & Piping",
    summary:
      "Streams process data piece by piece without loading it all into memory — essential for large files or network data.",
    explanation:
      "Four types: Readable, Writable, Duplex, Transform. Use `pipe()` or `pipeline()` (preferred — handles errors) to chain streams.",
    code: `import { createReadStream, createWriteStream } from 'fs';
import { createGzip } from 'zlib';
import { pipeline } from 'stream/promises';

// Compress a file using streams — memory-efficient
await pipeline(
  createReadStream('large.log'),
  createGzip(),
  createWriteStream('large.log.gz'),
);
console.log('Compressed!');

// Transform stream — uppercase every chunk
import { Transform } from 'stream';
const upper = new Transform({
  transform(chunk, encoding, callback) {
    callback(null, chunk.toString().toUpperCase());
  },
});`,
    interviewQuestion:
      "Why are streams more memory-efficient than reading an entire file at once?",
  },
  {
    id: "nodejs-env",
    category: "nodejs",
    difficulty: "Basic",
    topic: "Configuration",
    title: "Environment Variables & dotenv",
    summary:
      "Store secrets and config outside your code using environment variables. Never hardcode API keys.",
    explanation:
      "Use `process.env.VAR_NAME` to read env vars. In development, use the `dotenv` package to load a `.env` file. Add `.env` to `.gitignore`.",
    code: `// .env file
// DATABASE_URL=mongodb://localhost:27017/mydb
// JWT_SECRET=supersecret
// PORT=3000

import 'dotenv/config'; // loads .env automatically

const port = process.env.PORT || 3000;
const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) throw new Error('DATABASE_URL is required');

console.log(\`Starting on port \${port}\`);`,
    interviewQuestion:
      "Why should you never commit `.env` files to version control?",
  },
  {
    id: "nodejs-websocket",
    category: "nodejs",
    difficulty: "Advanced",
    topic: "Networking",
    title: "WebSockets with ws",
    summary:
      "WebSockets enable full-duplex, real-time communication between client and server over a single TCP connection.",
    explanation:
      "Unlike HTTP, WebSocket connections stay open. The `ws` package is the most popular Node.js WebSocket library. Socket.IO adds rooms, reconnection, and fallbacks.",
    code: `import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', (socket) => {
  console.log('Client connected');

  socket.on('message', (data) => {
    const msg = data.toString();
    console.log('Received:', msg);
    // Broadcast to all clients
    wss.clients.forEach(client => {
      if (client.readyState === 1) client.send(msg);
    });
  });

  socket.on('close', () => console.log('Client disconnected'));
});`,
    interviewQuestion:
      "What is the difference between WebSockets and HTTP long-polling?",
  },
  {
    id: "nodejs-cluster",
    category: "nodejs",
    difficulty: "Advanced",
    topic: "Performance & Scalability",
    title: "Clustering & Worker Threads",
    summary:
      "Node.js is single-threaded, but you can use `cluster` to fork multiple processes or `worker_threads` for CPU-intensive tasks.",
    explanation:
      "Cluster forks child processes that share a server port — each gets its own event loop. Worker threads share memory (SharedArrayBuffer) and are better for CPU work.",
    code: `import cluster from 'cluster';
import { cpus } from 'os';
import express from 'express';

if (cluster.isPrimary) {
  const numCPUs = cpus().length;
  console.log(\`Primary \${process.pid} — forking \${numCPUs} workers\`);
  for (let i = 0; i < numCPUs; i++) cluster.fork();
  cluster.on('exit', (worker) => {
    console.log(\`Worker \${worker.process.pid} died — restarting\`);
    cluster.fork();
  });
} else {
  const app = express();
  app.get('/', (_, res) => res.send(\`Worker \${process.pid}\`));
  app.listen(3000);
}`,
    interviewQuestion:
      "When would you use `cluster` vs `worker_threads` in Node.js?",
  },

{
    id: "javascript-event-loop-microtasks",
    category: "javascript",
    difficulty: "Advanced",
    topic: "Event Loop & Concurrency",
    title: "How does the JavaScript event loop handle microtasks and macrotasks?",
    summary: "The event loop coordinates the call stack, microtask queue (Promises, queueMicrotask) and macrotask queue (setTimeout, I/O), always draining all microtasks before the next macrotask.",
    explanation: "JavaScript is single-threaded, so the event loop manages how asynchronous callbacks get scheduled onto the call stack. After each synchronous execution block (a macrotask) finishes, the engine fully drains the microtask queue — Promise callbacks, queueMicrotask, MutationObserver callbacks — before rendering or picking up the next macrotask like a setTimeout callback or I/O event. This means microtasks can starve rendering or delay timers if they keep scheduling more microtasks. Understanding this ordering is essential for reasoning about why a Promise.then() runs before a setTimeout(fn, 0), even though both are 'async'. Node.js adds its own phases (timers, I/O callbacks, check, close callbacks) around this same microtask-draining principle.",
    code: "console.log('start');\n\nsetTimeout(() => console.log('timeout'), 0);\n\nPromise.resolve()\n  .then(() => console.log('promise 1'))\n  .then(() => console.log('promise 2'));\n\nqueueMicrotask(() => console.log('microtask'));\n\nconsole.log('end');\n\n// Output:\n// start\n// end\n// promise 1\n// microtask\n// promise 2\n// timeout",
    interviewQuestion: "Given a mix of setTimeout, Promise.then, and queueMicrotask calls, predict the exact console output order and explain why.",
  },
  {
    id: "javascript-closures-deep-dive",
    category: "javascript",
    difficulty: "Intermediate",
    topic: "Closures & Scope",
    title: "What is a closure and how does it retain variable state?",
    summary: "A closure is a function bundled with references to its surrounding lexical scope, letting it access and mutate variables from an outer function even after that function has returned.",
    explanation: "Closures work because JavaScript functions keep a live reference to their enclosing scope's variable environment rather than a snapshot copy. This lets an inner function read and update variables declared in an outer function long after that outer function has finished executing. Closures are the mechanism behind private state, factory functions, and memoization. A classic pitfall is capturing a loop variable declared with var, since var is function-scoped and shared across iterations, whereas let creates a fresh binding per iteration. Closures also have memory implications: any variable referenced by a retained closure cannot be garbage collected until the closure itself is no longer reachable.",
    code: "function makeCounter() {\n  let count = 0;\n  return {\n    increment: () => ++count,\n    reset: () => { count = 0; },\n  };\n}\n\nconst counter = makeCounter();\ncounter.increment();\ncounter.increment();\nconsole.log(counter.increment()); // 3\ncounter.reset();\nconsole.log(counter.increment()); // 1",
    interviewQuestion: "Why does using `var` instead of `let` in a for-loop with setTimeout callbacks cause every callback to log the same final value?",
  },
  {
    id: "javascript-hoisting",
    category: "javascript",
    difficulty: "Basic",
    topic: "Closures & Scope",
    title: "What is hoisting in JavaScript?",
    summary: "Hoisting is the engine's behavior of registering variable and function declarations in memory during the compile phase, before code executes line by line.",
    explanation: "During compilation, function declarations are hoisted entirely — both name and body — so they can be called before their textual definition. `var` declarations are hoisted and initialized to undefined, so referencing them early gives undefined rather than an error. `let` and `const` are also hoisted but remain in the 'temporal dead zone' until their declaration line executes, so accessing them earlier throws a ReferenceError. Function expressions and arrow functions assigned to `let`/`const`/`var` follow the hoisting rules of the variable, not the function, meaning they cannot be called before the assignment line runs.",
    code: "console.log(a); // undefined (var hoisted)\nvar a = 5;\n\ntry {\n  console.log(b); // ReferenceError (TDZ)\n} catch (e) {\n  console.log(e.message);\n}\nlet b = 10;\n\ngreet(); // works, function declarations fully hoisted\nfunction greet() {\n  console.log('hello');\n}",
    interviewQuestion: "What is the difference in hoisting behavior between `var`, `let`, and a function declaration?",
  },
  {
    id: "javascript-prototypal-inheritance",
    category: "javascript",
    difficulty: "Intermediate",
    topic: "Objects & Prototypes",
    title: "How does prototypal inheritance work in JavaScript?",
    summary: "Every object has an internal link to a prototype object, and property lookups walk up this prototype chain until a match is found or the chain ends at null.",
    explanation: "Unlike classical inheritance, JavaScript objects inherit directly from other objects via the internal [[Prototype]] link, accessible through Object.getPrototypeOf() or the deprecated __proto__ accessor. When you access a property, the engine first checks the object's own properties, then walks up the prototype chain. Functions have a `prototype` property used as the [[Prototype]] for instances created with `new`. ES6 classes are syntactic sugar over this same mechanism — `class` and `extends` still produce prototype chains under the hood. Object.create(proto) lets you build a prototype chain explicitly without invoking a constructor.",
    code: "const animal = {\n  speak() {\n    return `${this.name} makes a sound.`;\n  },\n};\n\nconst dog = Object.create(animal);\ndog.name = 'Rex';\nconsole.log(dog.speak()); // Rex makes a sound.\nconsole.log(Object.getPrototypeOf(dog) === animal); // true\nconsole.log(dog.hasOwnProperty('speak')); // false",
    interviewQuestion: "Explain how `Object.create()` differs from using a constructor function with `new` to set up inheritance.",
  },
  {
    id: "javascript-this-binding-rules",
    category: "javascript",
    difficulty: "Intermediate",
    topic: "Functions & Execution Context",
    title: "What determines the value of `this` in JavaScript?",
    summary: "`this` is determined by how a function is called (its call-site), not where it is defined, following a precedence order of new, explicit binding, implicit (object method) binding, and default binding.",
    explanation: "There are four main binding rules, in order of precedence: new binding (this is the newly created object), explicit binding via call/apply/bind, implicit binding where this refers to the object a method was called on, and default binding where this is undefined in strict mode or the global object otherwise. Arrow functions ignore all of these rules and instead lexically inherit `this` from their enclosing scope at definition time, which is why they're commonly used for callbacks inside class methods or event handlers. A frequent bug is detaching a method from its object (e.g., passing `obj.method` as a callback), which loses the implicit binding and causes `this` to become undefined or the global object.",
    code: "const obj = {\n  name: 'Widget',\n  regularFn() { return this.name; },\n  arrowFn: () => { return this?.name; },\n};\n\nconsole.log(obj.regularFn()); // 'Widget'\nconsole.log(obj.arrowFn()); // undefined (lexical this, not obj)\n\nconst detached = obj.regularFn;\nconsole.log(detached()); // undefined/TypeError in strict mode\n\nconsole.log(obj.regularFn.call({ name: 'Rebound' })); // 'Rebound'",
    interviewQuestion: "Why does extracting a method from an object and calling it standalone often break, and how do bind, call, apply, or arrow functions fix it?",
  },
  {
    id: "javascript-generators-iterators",
    category: "javascript",
    difficulty: "Advanced",
    topic: "Generators & Iterators",
    title: "How do generator functions and iterators work?",
    summary: "A generator function (function*) returns an iterator object that can pause and resume execution using `yield`, producing values lazily on demand.",
    explanation: "Calling a generator function doesn't run its body immediately; it returns an iterator whose next() method resumes execution until the next yield, returning an object of the form {value, done}. This lazy, pausable execution model is useful for representing infinite sequences, custom iteration protocols, and cooperative coroutine-like patterns. Any object implementing the iterable protocol via Symbol.iterator can be consumed by for...of, spread syntax, or destructuring. Generators also accept values passed back in via next(value), and yield* delegates iteration to another iterable, making it possible to compose generators.",
    code: "function* idGenerator() {\n  let id = 1;\n  while (true) {\n    const reset = yield id;\n    id = reset ? 1 : id + 1;\n  }\n}\n\nconst gen = idGenerator();\nconsole.log(gen.next().value); // 1\nconsole.log(gen.next().value); // 2\nconsole.log(gen.next(true).value); // 1 (reset)\n\nfunction* range(start, end) {\n  for (let i = start; i <= end; i++) yield i;\n}\nconsole.log([...range(1, 4)]); // [1, 2, 3, 4]",
    interviewQuestion: "How would you implement a custom iterable object (with Symbol.iterator) so it works with for...of and the spread operator?",
  },
  {
    id: "javascript-async-await-error-handling",
    category: "javascript",
    difficulty: "Intermediate",
    topic: "Async & Promises",
    title: "What are the correct patterns for handling errors in async/await code?",
    summary: "Async functions implicitly return rejected promises when they throw, so errors should be caught with try/catch around awaits, or by attaching .catch() to the returned promise, avoiding silent unhandled rejections.",
    explanation: "Because `await` unwraps a promise and re-throws its rejection as a synchronous-looking exception, wrapping awaited calls in try/catch gives the most readable error handling. A common mistake is awaiting inside a loop without individual try/catch blocks, causing one failure to abort the whole loop; Promise.allSettled or per-iteration try/catch avoids that. Another pitfall is forgetting that an async function always returns a promise, so a caller must still await or .catch() it — an uncaught rejection from a fire-and-forget async call becomes an unhandled promise rejection. Wrapping multiple independent awaited calls in Promise.all is preferable to sequential awaits when they don't depend on each other, both for performance and to centralize error handling.",
    code: "async function fetchUser(id) {\n  try {\n    const res = await fetch(`/api/users/${id}`);\n    if (!res.ok) throw new Error(`HTTP ${res.status}`);\n    return await res.json();\n  } catch (err) {\n    console.error('Failed to fetch user:', err.message);\n    throw err; // rethrow so caller can also react\n  }\n}\n\nasync function loadUsers(ids) {\n  const results = await Promise.allSettled(ids.map(fetchUser));\n  return results.filter(r => r.status === 'fulfilled').map(r => r.value);\n}",
    interviewQuestion: "What happens to errors thrown inside an async function if the caller never awaits or catches the returned promise?",
  },
  {
    id: "javascript-tagged-template-literals",
    category: "javascript",
    difficulty: "Advanced",
    topic: "ES2015+ Syntax",
    title: "What are tagged template literals used for?",
    summary: "Tagged templates let a function intercept a template literal's string parts and interpolated values separately, enabling custom processing like sanitization, i18n, or building query builders.",
    explanation: "When a function name precedes a template literal, JavaScript calls that function with an array of the literal's static string segments (with a `.raw` property for unescaped text) as the first argument, followed by each interpolated expression's evaluated value as subsequent arguments. This is the mechanism behind libraries like styled-components for CSS-in-JS and Apollo's gql for GraphQL query parsing. It's also useful for writing an auto-escaping HTML template function to prevent XSS, since the tag function fully controls how interpolated values get inserted into the final string.",
    code: "function safeHTML(strings, ...values) {\n  return strings.reduce((out, str, i) => {\n    const val = values[i - 1];\n    const escaped = String(val).replace(/</g, '&lt;').replace(/>/g, '&gt;');\n    return out + escaped + str;\n  });\n}\n\nconst userInput = '<script>alert(1)</script>';\nconst html = safeHTML`<p>Hello, ${userInput}!</p>`;\nconsole.log(html);\n// <p>Hello, &lt;script&gt;alert(1)&lt;/script&gt;!</p>",
    interviewQuestion: "How would you write a tag function that automatically HTML-escapes interpolated values in a template literal to prevent XSS?",
  },
  {
    id: "javascript-proxy-reflect",
    category: "javascript",
    difficulty: "Advanced",
    topic: "Meta-programming",
    title: "What do Proxy and Reflect enable in JavaScript?",
    summary: "Proxy wraps an object to intercept fundamental operations like get, set, and delete through configurable traps, while Reflect provides matching default implementations of those same operations.",
    explanation: "A Proxy takes a target object and a handler with trap methods (get, set, has, deleteProperty, apply, construct, etc.) that run whenever that operation occurs on the proxy. This enables patterns like validation on property assignment, reactive systems (Vue 3's reactivity is built on Proxy), virtual properties, and access logging. Reflect mirrors the same set of low-level operations as static methods, and is typically used inside a proxy trap to invoke the default behavior after custom logic runs, ensuring correct `this` binding and avoiding subtle bugs versus calling target[prop] directly. Together they replace older, less reliable techniques like Object.defineProperty for whole-object interception.",
    code: "function createValidatedUser(initial) {\n  return new Proxy(initial, {\n    set(target, prop, value) {\n      if (prop === 'age' && (typeof value !== 'number' || value < 0)) {\n        throw new TypeError('age must be a non-negative number');\n      }\n      return Reflect.set(target, prop, value);\n    },\n    get(target, prop) {\n      console.log(`Accessing '${prop}'`);\n      return Reflect.get(target, prop);\n    },\n  });\n}\n\nconst user = createValidatedUser({ name: 'Ana', age: 30 });\nconsole.log(user.name); // logs access, then 'Ana'\nuser.age = -5; // throws TypeError",
    interviewQuestion: "How would you use a Proxy to implement a reactive object that logs every property read and write?",
  },
  {
    id: "javascript-structured-clone",
    category: "javascript",
    difficulty: "Basic",
    topic: "Objects & Data Structures",
    title: "What is structuredClone() and how does it differ from JSON-based deep copying?",
    summary: "structuredClone() is a built-in global function that performs a true deep copy of an object, supporting more data types than JSON.parse(JSON.stringify()) and correctly handling circular references.",
    explanation: "The structured clone algorithm, exposed via the global structuredClone() function, can deep-copy Maps, Sets, Dates, RegExps, typed arrays, ArrayBuffers, and even objects with circular references — all things that break or silently lose data with the classic JSON.stringify/parse trick. It cannot clone functions, DOM nodes, or object prototypes (the clone becomes a plain object losing its class methods), and it will throw on those unsupported types rather than silently dropping them. It's the same algorithm browsers use internally for postMessage and IndexedDB, so it's well-optimized and standardized across environments including modern Node.js.",
    code: "const original = {\n  date: new Date(),\n  set: new Set([1, 2, 3]),\n  nested: { a: 1 },\n};\noriginal.self = original; // circular reference\n\nconst clone = structuredClone(original);\nconsole.log(clone.date instanceof Date); // true\nconsole.log(clone.set instanceof Set); // true\nconsole.log(clone.self === clone); // true, circular ref preserved\nconsole.log(clone !== original); // true, deep copy",
    interviewQuestion: "Why would JSON.parse(JSON.stringify(obj)) fail to correctly clone an object containing a Date, a Map, and a circular reference, and what would you use instead?",
  },
  {
    id: "javascript-abortcontroller",
    category: "javascript",
    difficulty: "Intermediate",
    topic: "Async & Promises",
    title: "How do you cancel an in-flight fetch request with AbortController?",
    summary: "AbortController exposes a signal that can be passed to cancelable async APIs like fetch, letting you abort the operation and have it reject with an AbortError.",
    explanation: "AbortController.signal is an AbortSignal object that starts in a non-aborted state; calling controller.abort() flips it and fires an 'abort' event that any listener (including fetch internally) can react to. This is the standard way to cancel network requests, for example when a user navigates away or types a new search query before the previous request resolves, preventing race conditions between stale and fresh responses. AbortSignal.timeout(ms) is a convenient static method for auto-aborting after a duration, and signals can be composed so a single abort cancels multiple dependent operations.",
    code: "function searchWithCancel(query) {\n  const controller = new AbortController();\n  const promise = fetch(`/api/search?q=${query}`, { signal: controller.signal })\n    .then(res => res.json())\n    .catch(err => {\n      if (err.name === 'AbortError') console.log('Request cancelled');\n      else throw err;\n    });\n  return { promise, cancel: () => controller.abort() };\n}\n\nconst { promise, cancel } = searchWithCancel('react');\ncancel(); // aborts before the fetch resolves",
    interviewQuestion: "How would you cancel a previous in-flight fetch when a user types a new character in a search box, to avoid race conditions between stale and fresh responses?",
  },
  {
    id: "javascript-intl-api",
    category: "javascript",
    difficulty: "Basic",
    topic: "Internationalization",
    title: "What does the Intl API provide for formatting numbers, dates, and text?",
    summary: "The Intl namespace offers locale-aware constructors like Intl.NumberFormat, Intl.DateTimeFormat, and Intl.RelativeTimeFormat for formatting values correctly across languages and regions without external libraries.",
    explanation: "Intl.NumberFormat handles currency, percentage, and unit formatting with correct locale-specific separators and symbols, avoiding manual string manipulation that often breaks for non-US locales. Intl.DateTimeFormat formats dates and times according to locale conventions, and Intl.RelativeTimeFormat produces human-friendly strings like '3 days ago'. Intl.Collator provides locale-aware string comparison for correct sorting of accented or non-Latin text, which the default sort() comparator gets wrong. Because these are built into the engine, they're both more correct and far more performant than hand-rolled or third-party formatting for internationalized UIs.",
    code: "const price = new Intl.NumberFormat('de-DE', {\n  style: 'currency',\n  currency: 'EUR',\n}).format(1234.5);\nconsole.log(price); // '1.234,50 €'\n\nconst date = new Intl.DateTimeFormat('en-US', {\n  dateStyle: 'long',\n}).format(new Date('2026-07-01'));\nconsole.log(date); // 'July 1, 2026'\n\nconst rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });\nconsole.log(rtf.format(-1, 'day')); // 'yesterday'",
    interviewQuestion: "How would you format a price as currency correctly for multiple locales without manually handling separators and symbols?",
  },
  {
    id: "javascript-bigint",
    category: "javascript",
    difficulty: "Basic",
    topic: "Numbers & Data Types",
    title: "What is BigInt and when is it needed?",
    summary: "BigInt is a primitive type for representing integers beyond Number.MAX_SAFE_INTEGER with exact precision, created with an `n` suffix or the BigInt() function.",
    explanation: "Regular JavaScript numbers are IEEE-754 doubles, which lose precision for integers larger than 2^53 - 1 (Number.MAX_SAFE_INTEGER). BigInt stores arbitrary-precision integers exactly, which matters for use cases like cryptography, high-precision timestamps, or working with 64-bit IDs from databases. BigInt values cannot be mixed with regular numbers in arithmetic operations without explicit conversion — attempting `1n + 1` throws a TypeError — and BigInt doesn't support decimals or Math object methods. Comparison operators like < and > work across BigInt and Number, but strict equality (===) treats them as different types even for equal values.",
    code: "const big = 9007199254740993n; // beyond MAX_SAFE_INTEGER\nconsole.log(big + 1n); // 9007199254740994n\n\nconsole.log(Number.MAX_SAFE_INTEGER); // 9007199254740991\nconsole.log(9007199254740992 === 9007199254740993); // true! precision lost\n\ntry {\n  console.log(1n + 1); // TypeError: Cannot mix BigInt and other types\n} catch (e) {\n  console.log(e.message);\n}\nconsole.log(1n == 1); // true (loose equality allowed)",
    interviewQuestion: "Why does `9007199254740992 === 9007199254740993` evaluate to true, and how does BigInt solve that problem?",
  },
  {
    id: "javascript-weakref-finalizationregistry",
    category: "javascript",
    difficulty: "Tricky",
    topic: "Memory & Garbage Collection",
    title: "What do WeakRef and FinalizationRegistry do, and why are they rarely needed?",
    summary: "WeakRef holds a reference to an object without preventing garbage collection, and FinalizationRegistry lets you register a cleanup callback that may run after an object is collected — both are advanced, non-deterministic tools meant for niche caching scenarios.",
    explanation: "A WeakRef wraps an object so that holding the WeakRef doesn't stop the garbage collector from reclaiming the target; calling .deref() returns the object if it's still alive, or undefined if it's been collected. FinalizationRegistry lets you register a callback to run at some unspecified future point after an object becomes unreachable, but the spec explicitly does not guarantee if or when it runs, making it unsuitable for critical cleanup logic like closing file handles. These APIs exist mainly for advanced caching or memory-management libraries; using them for typical application logic is almost always the wrong tool, since GC timing is intentionally left implementation-defined and non-deterministic across engines.",
    code: "let obj = { data: 'large payload' };\nconst ref = new WeakRef(obj);\n\nconst registry = new FinalizationRegistry((heldValue) => {\n  console.log(`Cleaned up: ${heldValue}`);\n});\nregistry.register(obj, 'obj-1');\n\nconsole.log(ref.deref()?.data); // 'large payload' (still alive)\nobj = null; // remove strong reference\n// At some later, unspecified point, GC may collect obj and\n// the registry callback may fire — timing is not guaranteed.",
    interviewQuestion: "Why shouldn't FinalizationRegistry be relied upon for deterministic resource cleanup like closing a database connection?",
  },
  {
    id: "javascript-commonjs-vs-esm",
    category: "javascript",
    difficulty: "Intermediate",
    topic: "Modules",
    title: "What are the key differences between CommonJS and ES Modules?",
    summary: "CommonJS (require/module.exports) loads modules synchronously with mutable, copied exports, while ES Modules (import/export) are statically analyzed, load asynchronously, and export live read-only bindings.",
    explanation: "CommonJS, Node's original module system, resolves require() calls synchronously at runtime and caches the fully-executed module.exports object; you receive a live reference to that object but reassigning a destructured value doesn't reflect changes back into the source module. ES Modules are parsed statically before execution, which enables tree-shaking and top-level await, and their imported bindings are live read-only views tied directly to the exporting module's variables — if the source module updates an exported variable, importers see the new value automatically. Node.js supports both, distinguished by file extension (.cjs vs .mjs) or the 'type' field in package.json, and interop between them has edge cases, particularly around default exports.",
    code: "// CommonJS (math.cjs)\nlet counter = 0;\nfunction increment() { counter++; }\nmodule.exports = { counter, increment }; // counter is copied, frozen at export time\n\n// ES Module (math.mjs)\nexport let counter = 0;\nexport function increment() { counter++; } // live binding\n\n// consumer.mjs\nimport { counter, increment } from './math.mjs';\nincrement();\nconsole.log(counter); // 1 — reflects the live update, unlike CommonJS",
    interviewQuestion: "Why does a value imported from a CommonJS module not update when the source module changes it later, while an ES Module import does?",
  },
  {
    id: "javascript-tree-shaking",
    category: "javascript",
    difficulty: "Advanced",
    topic: "Modules",
    title: "What is tree shaking and what makes code tree-shakeable?",
    summary: "Tree shaking is a bundler optimization that removes unused exports from the final bundle by statically analyzing ES Module import/export graphs, relying on the static, side-effect-predictable nature of ESM syntax.",
    explanation: "Because ES Module imports and exports are declared statically (not conditionally computed at runtime like CommonJS require calls), bundlers such as Rollup or webpack can build a precise dependency graph and eliminate code that's never imported anywhere. Tree shaking breaks down when modules have side effects at the top level (like mutating a global or registering something), since the bundler can't safely assume removal is safe unless the package.json marks itself \"sideEffects\": false or lists exceptions. Writing modules as small, pure, named exports rather than one large default export object, and avoiding re-export barrels that import everything, maximizes what a bundler can actually shake out.",
    code: "// utils.js — tree-shakeable named exports\nexport function add(a, b) { return a + b; }\nexport function subtract(a, b) { return a - b; }\nexport function multiply(a, b) { return a * b; } // never imported anywhere\n\n// app.js\nimport { add } from './utils.js';\nconsole.log(add(2, 3));\n// A bundler analyzing this graph can safely drop `subtract`\n// and `multiply` from the final bundle since they're unused.",
    interviewQuestion: "Why can bundlers tree-shake unused ES Module exports but generally cannot tree-shake unused CommonJS exports?",
  },
  {
    id: "javascript-typeof-vs-instanceof",
    category: "javascript",
    difficulty: "Basic",
    topic: "Types & Type Checking",
    title: "What is the difference between typeof and instanceof?",
    summary: "typeof returns a string naming a value's primitive type and works before checking for undeclared variables, while instanceof tests whether an object's prototype chain includes a given constructor's prototype.",
    explanation: "typeof is best for distinguishing primitives (string, number, boolean, undefined, symbol, bigint) and detecting functions, but it has well-known quirks: typeof null returns 'object' due to a legacy bug, and typeof for any non-function object (arrays, dates, custom classes) also returns 'object', making it useless for distinguishing them. instanceof walks the right-hand operand's prototype chain looking for the left-hand object's [[Prototype]], so it correctly distinguishes Array from Date from a custom class, but it fails across different realms (e.g., iframes) where each has its own separate constructor identity, and it throws or misbehaves on primitives. For robust type checks on arrays specifically, Array.isArray() is preferred over instanceof Array.",
    code: "console.log(typeof null); // 'object' (historical bug)\nconsole.log(typeof undefined); // 'undefined'\nconsole.log(typeof []); // 'object'\nconsole.log(typeof function(){}); // 'function'\n\nconsole.log([] instanceof Array); // true\nconsole.log([] instanceof Object); // true (Array.prototype chains to Object.prototype)\n\nclass Dog {}\nconsole.log(new Dog() instanceof Dog); // true\nconsole.log(typeof new Dog()); // 'object' (not useful here)",
    interviewQuestion: "Why is `typeof null === 'object'`, and how would you reliably check if a value is actually null versus a real object?",
  },
  {
    id: "javascript-shallow-vs-deep-copy",
    category: "javascript",
    difficulty: "Intermediate",
    topic: "Objects & Data Structures",
    title: "What is the difference between a shallow copy and a deep copy?",
    summary: "A shallow copy duplicates only the top-level properties of an object, leaving nested objects shared by reference, while a deep copy recursively duplicates every nested level so no references are shared.",
    explanation: "Techniques like the spread operator, Object.assign(), and Array.prototype.slice() all produce shallow copies: primitive top-level values are duplicated, but any nested object or array is copied by reference, so mutating a nested property through the copy also mutates the original. Deep copying requires recursively cloning every nested structure, which can be done with structuredClone() for most built-in types, a hand-written recursive function, or a library like lodash's cloneDeep for edge cases involving class instances or circular references. Choosing shallow vs deep copy matters a lot in state-management code (e.g., React/Redux), where accidentally sharing nested references can cause subtle bugs where updating 'a copy' silently mutates shared state elsewhere.",
    code: "const original = { name: 'Config', settings: { theme: 'dark' } };\n\nconst shallow = { ...original };\nshallow.settings.theme = 'light'; // mutates nested object\nconsole.log(original.settings.theme); // 'light' — original affected!\n\nconst original2 = { name: 'Config2', settings: { theme: 'dark' } };\nconst deep = structuredClone(original2);\ndeep.settings.theme = 'light';\nconsole.log(original2.settings.theme); // 'dark' — original untouched",
    interviewQuestion: "Why does mutating a nested object inside a spread-copied object (`{ ...original }`) also change the original, and how would you avoid that?",
  },
  {
    id: "javascript-array-like-vs-iterable",
    category: "javascript",
    difficulty: "Tricky",
    topic: "Arrays & Collections",
    title: "What is the difference between an array-like object and an iterable?",
    summary: "An array-like object has a numeric `length` property and indexed elements but no iteration protocol, while an iterable implements Symbol.iterator, enabling for...of and spread — the two categories overlap but aren't identical.",
    explanation: "Array-like objects, such as the `arguments` object or a DOM NodeList in older environments, have integer-indexed properties and a length property but don't natively support for...of, spread, or array methods like map and filter unless converted first. Iterables implement the well-known Symbol.iterator method returning an iterator, which is what for...of, spread syntax, and destructuring rely on — Strings, Maps, Sets, and Arrays are all iterables, while a plain arguments object was historically array-like but not iterable (modern engines have since made arguments iterable too). Array.from() is the standard bridge: it accepts either an array-like or an iterable and produces a true array, which is why it's the go-to conversion utility over the spread operator when you're not sure which kind of collection you're dealing with.",
    code: "function sum() {\n  // arguments is array-like AND iterable in modern engines\n  const args = Array.from(arguments);\n  return args.reduce((a, b) => a + b, 0);\n}\nconsole.log(sum(1, 2, 3)); // 6\n\nconst arrayLike = { 0: 'a', 1: 'b', length: 2 }; // NOT iterable\ntry {\n  [...arrayLike]; // TypeError: arrayLike is not iterable\n} catch (e) {\n  console.log(e.message);\n}\nconsole.log(Array.from(arrayLike)); // ['a', 'b'] — works fine",
    interviewQuestion: "Why does spreading a plain array-like object like `{ 0: 'a', 1: 'b', length: 2 }` throw an error, while `Array.from()` on the same object works?",
  },
  {
    id: "javascript-custom-error-classes",
    category: "javascript",
    difficulty: "Intermediate",
    topic: "Error Handling",
    title: "How do you create and use custom error classes in JavaScript?",
    summary: "Custom error classes extend the built-in Error class to attach domain-specific properties (like an error code or HTTP status) while preserving stack traces and standard error behavior like instanceof checks.",
    explanation: "Extending Error and calling super(message) preserves the native `message`, `stack`, and `name` behavior while letting you add custom fields such as statusCode, cause, or a machine-readable errorCode for programmatic handling. Setting `this.name` to the subclass name fixes generic error output (otherwise it would just print 'Error'). Since ES2022, the built-in Error constructor accepts a second `options` argument with a `cause` property to chain the original error, useful when re-throwing after catching a lower-level failure. Custom error hierarchies let calling code use instanceof to branch on error type (e.g., ValidationError vs NetworkError) instead of parsing message strings, which is fragile and hard to localize.",
    code: "class ValidationError extends Error {\n  constructor(message, field) {\n    super(message);\n    this.name = 'ValidationError';\n    this.field = field;\n  }\n}\n\nfunction validateAge(age) {\n  if (age < 0) {\n    throw new ValidationError('Age cannot be negative', 'age');\n  }\n}\n\ntry {\n  validateAge(-5);\n} catch (err) {\n  if (err instanceof ValidationError) {\n    console.log(`${err.name} on field '${err.field}': ${err.message}`);\n  } else {\n    throw err;\n  }\n}",
    interviewQuestion: "How would you design a custom error class hierarchy so calling code can distinguish a validation error from a network error using instanceof?",
  },

{
    id: "typescript-index-signatures",
    category: "typescript",
    difficulty: "Basic",
    topic: "Object Types",
    title: "What are index signatures in TypeScript?",
    summary: "Index signatures let you type objects whose exact property names aren't known ahead of time, but whose value types are consistent.",
    explanation: "An index signature is written as `[key: string]: ValueType` inside an object or interface type, and tells TypeScript that any property accessed on that object (using a string, number, or symbol key) will have the given value type. They're useful for dictionary-like structures such as lookup tables or config maps. Numeric index signatures must have a value type that is compatible with the string index signature, since JS numeric keys are coerced to strings internally. Index signatures trade away some safety, since TypeScript can't verify that a given key actually exists at runtime unless `noUncheckedIndexedAccess` is enabled.",
    code: "interface StringMap {\n  [key: string]: number;\n}\n\nconst scores: StringMap = {\n  alice: 90,\n  bob: 85,\n};\n\nscores.carol = 78; // allowed, matches index signature\n\n// With noUncheckedIndexedAccess, this would be `number | undefined`\nconst value = scores[\"dave\"];\nconsole.log(value);",
    interviewQuestion: "How do index signatures work in TypeScript, and what risk do they introduce if `noUncheckedIndexedAccess` is not enabled?",
  },
  {
    id: "typescript-readonly-and-readonly-utility",
    category: "typescript",
    difficulty: "Basic",
    topic: "Object Types",
    title: "What does readonly mean and how does Readonly<T> work?",
    summary: "The readonly modifier prevents reassignment of a property after initialization, and Readonly<T> applies it to every property of a type.",
    explanation: "Marking a property `readonly` means it can only be assigned once, typically at declaration or inside a constructor, and any later assignment produces a compile-time error. This is a compile-time-only guarantee — it does not freeze the object at runtime, so tools like Object.freeze are still needed for true runtime immutability. The built-in `Readonly<T>` utility type maps over every property of `T` and adds the `readonly` modifier, which is handy for returning defensive copies of data from functions. Note that readonly is shallow: a readonly array or object property can still have its own nested properties mutated unless those are also marked readonly.",
    code: "interface Point {\n  readonly x: number;\n  readonly y: number;\n}\n\nconst p: Point = { x: 1, y: 2 };\n// p.x = 5; // Error: Cannot assign to 'x' because it is a read-only property\n\ntype ReadonlyPoint = Readonly<Point>; // same effect, generic version\n\nfunction freezeConfig<T>(config: T): Readonly<T> {\n  return config;\n}\n\nconst cfg = freezeConfig({ retries: 3 });\n// cfg.retries = 5; // Error",
    interviewQuestion: "Does the readonly modifier provide runtime immutability? What's the difference between readonly and Object.freeze?",
  },
  {
    id: "typescript-tuple-types",
    category: "typescript",
    difficulty: "Basic",
    topic: "Object Types",
    title: "What are tuple types and how do they differ from arrays?",
    summary: "Tuples are fixed-length arrays where each position has a specific, known type, unlike regular arrays which are typed uniformly.",
    explanation: "A tuple type like `[string, number]` describes an array with exactly two elements, where the first must be a string and the second a number, giving position-aware type checking that a plain `Array<string | number>` cannot provide. Tuples support optional elements with `?` and rest elements with `...` for variable-length trailing types, and TypeScript 4.0+ allows labeled tuple elements for better readability in tooltips. They're commonly used to type function return values that pack multiple pieces of data, such as the `useState` hook in React which returns a `[value, setter]` tuple. Because arrays are mutable in JS, tuples can technically still be pushed to unless marked `readonly`, which breaks the fixed-length guarantee at runtime.",
    code: "type NameAge = [name: string, age: number];\n\nfunction createUser(): NameAge {\n  return [\"Alice\", 30];\n}\n\nconst [name, age] = createUser();\n\ntype Coordinates = [x: number, y: number, z?: number];\nconst c1: Coordinates = [1, 2];\nconst c2: Coordinates = [1, 2, 3];\n\ntype StringsThenNumbers = [string, ...number[]];\nconst mix: StringsThenNumbers = [\"a\", 1, 2, 3];",
    interviewQuestion: "How would you type a function that returns a pair of values with different types, similar to React's useState?",
  },
  {
    id: "typescript-keyof-operator",
    category: "typescript",
    difficulty: "Intermediate",
    topic: "Advanced Types",
    title: "What does the keyof operator do?",
    summary: "keyof takes an object type and produces a union of its property names as string (or numeric/symbol) literal types.",
    explanation: "`keyof T` produces a union type of all the keys of `T`, which is extremely useful for writing generic functions that need to reference a property name safely, such as a type-safe `getProperty` function. When applied to types with index signatures, `keyof` returns the index type (e.g. `string` or `number`) rather than literal keys. `keyof` is frequently combined with generic constraints (`K extends keyof T`) so that a function can only accept keys that actually exist on the object, catching typos at compile time instead of runtime. It pairs naturally with indexed access types (`T[K]`) to describe the value type that corresponds to a given key.",
    code: "interface Person {\n  name: string;\n  age: number;\n}\n\ntype PersonKeys = keyof Person; // \"name\" | \"age\"\n\nfunction getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {\n  return obj[key];\n}\n\nconst person: Person = { name: \"Bob\", age: 25 };\nconst age = getProperty(person, \"age\"); // number\n// getProperty(person, \"email\"); // Error: not assignable to keyof Person",
    interviewQuestion: "Write a generic, type-safe getProperty function using keyof that prevents accessing nonexistent object keys.",
  },
  {
    id: "typescript-typeof-type-queries",
    category: "typescript",
    difficulty: "Intermediate",
    topic: "Advanced Types",
    title: "What is the typeof type operator used for?",
    summary: "In a type position, typeof extracts the static type of a variable or constant, letting you derive types from existing values instead of duplicating them.",
    explanation: "TypeScript's `typeof` operator has two meanings depending on context: in an expression position it's the familiar JS runtime operator, but in a type position (e.g. `type T = typeof someValue`) it asks the compiler for the statically inferred type of that value. This is powerful for keeping types in sync with implementation — for example, deriving a union type from the keys of a runtime config object, or typing a variable identically to another without re-declaring the shape. It's often combined with `keyof` (`keyof typeof obj`) to get a union of an object's literal key names. A common pitfall is that `typeof` on a `let` variable gives the widened type, while `const` with a literal gives a narrower, more precise type.",
    code: "const colors = {\n  red: \"#ff0000\",\n  green: \"#00ff00\",\n  blue: \"#0000ff\",\n} as const;\n\ntype ColorName = keyof typeof colors; // \"red\" | \"green\" | \"blue\"\n\nfunction getColor(name: ColorName): string {\n  return colors[name];\n}\n\nconst config = { retries: 3, timeout: 1000 };\ntype Config = typeof config; // { retries: number; timeout: number }",
    interviewQuestion: "How would you derive a union type of valid keys directly from an existing const object, without manually writing the union?",
  },
  {
    id: "typescript-infer-keyword",
    category: "typescript",
    difficulty: "Advanced",
    topic: "Conditional Types",
    title: "How does the infer keyword work in conditional types?",
    summary: "infer lets a conditional type capture and name a subpart of a type being matched, so it can be reused in the true branch.",
    explanation: "`infer` can only be used inside the `extends` clause of a conditional type, and it declares a new type variable that TypeScript will attempt to infer by pattern-matching against the checked type. This is the mechanism behind many built-in utility types, such as `ReturnType<T>` (`T extends (...args: any[]) => infer R ? R : never`) and `Parameters<T>`, which extract pieces of a function signature. It's especially powerful for unwrapping generic wrappers, like pulling the resolved type out of a `Promise<T>` or the element type out of an array. When a conditional type is applied to a union, it distributes over each member of the union (distributive conditional types), which can be avoided by wrapping the checked type in a tuple like `[T]`.",
    code: "type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;\n\ntype A = UnwrapPromise<Promise<string>>; // string\ntype B = UnwrapPromise<number>; // number\n\ntype ElementType<T> = T extends (infer U)[] ? U : never;\ntype Item = ElementType<string[]>; // string\n\ntype MyReturnType<T> = T extends (...args: any[]) => infer R ? R : never;\nfunction greet() { return \"hi\"; }\ntype Greeting = MyReturnType<typeof greet>; // string",
    interviewQuestion: "How is the built-in ReturnType<T> utility implemented under the hood using infer?",
  },
  {
    id: "typescript-recursive-types",
    category: "typescript",
    difficulty: "Advanced",
    topic: "Advanced Types",
    title: "How do you define recursive types in TypeScript?",
    summary: "A recursive type refers to itself in its own definition, which is essential for modeling nested structures like JSON, trees, or linked lists.",
    explanation: "TypeScript allows type aliases (and interfaces) to reference themselves, enabling types for arbitrarily nested data such as JSON values, recursive tree/linked-list structures, or deeply nested form data. Interfaces support direct self-reference easily; type aliases can too, as long as the recursion appears inside an object, array, or union member rather than directly at the top level (a bare `type T = T` is illegal). Recursive conditional types (often paired with `infer`) can walk through nested generics, but the compiler enforces a recursion depth limit to prevent infinite loops, so extremely deep recursive types can hit 'Type instantiation is excessively deep' errors. Recursive types are the standard way to type things like a generic `DeepPartial<T>` or `DeepReadonly<T>` utility.",
    code: "type Json =\n  | string\n  | number\n  | boolean\n  | null\n  | Json[]\n  | { [key: string]: Json };\n\nconst data: Json = {\n  name: \"Alice\",\n  tags: [\"admin\", \"user\"],\n  meta: { active: true, nested: { count: 1 } },\n};\n\ninterface TreeNode<T> {\n  value: T;\n  children: TreeNode<T>[];\n}\n\nconst tree: TreeNode<number> = {\n  value: 1,\n  children: [{ value: 2, children: [] }],\n};",
    interviewQuestion: "How would you write a TypeScript type to represent arbitrary JSON data, including nested objects and arrays?",
  },
  {
    id: "typescript-abstract-classes-vs-interfaces",
    category: "typescript",
    difficulty: "Intermediate",
    topic: "OOP",
    title: "Abstract classes vs interfaces: when do you use each?",
    summary: "Abstract classes can provide shared implementation and enforce a constructor contract, while interfaces are purely structural and compiled away entirely.",
    explanation: "An abstract class can declare abstract methods that subclasses must implement, but it can also provide concrete methods and shared state (fields), unlike an interface which only describes shape and has zero runtime footprint. Abstract classes cannot be instantiated directly, and using `abstract` on a method forces every concrete subclass to supply an implementation, which is useful for template-method patterns. Interfaces support multiple inheritance-like composition (a class can implement many interfaces but extend only one class), while abstract classes are limited to single inheritance due to JS's prototype chain. Choose an abstract class when you need to share actual code or enforce a constructor/field contract, and an interface when you only need to describe a shape that multiple unrelated classes or objects might satisfy.",
    code: "abstract class Shape {\n  abstract area(): number;\n\n  describe(): string {\n    return `This shape has area ${this.area()}`;\n  }\n}\n\nclass Circle extends Shape {\n  constructor(private radius: number) {\n    super();\n  }\n  area(): number {\n    return Math.PI * this.radius ** 2;\n  }\n}\n\ninterface Drawable {\n  draw(): void;\n}\n\nclass Square extends Shape implements Drawable {\n  constructor(private side: number) { super(); }\n  area(): number { return this.side ** 2; }\n  draw(): void { console.log(\"Drawing square\"); }\n}",
    interviewQuestion: "When would you choose an abstract class over an interface in TypeScript, given that both can describe a contract?",
  },
  {
    id: "typescript-generic-constraints",
    category: "typescript",
    difficulty: "Intermediate",
    topic: "Generics",
    title: "How do generic constraints with extends work?",
    summary: "Generic constraints use `extends` to restrict a type parameter to types that have a certain shape, enabling safe access to specific properties or methods.",
    explanation: "By default a generic type parameter `T` can be anything, which means the compiler won't let you access any properties on values of type `T`. Adding a constraint like `<T extends { length: number }>` tells TypeScript that whatever `T` ends up being, it must have at least a `length` property, so the function body can safely read `.length`. Constraints are commonly combined with `keyof` (`K extends keyof T`) to restrict one type parameter based on another, which is the foundation of type-safe property accessors. Multiple constraints can be combined using intersection types, and default type parameters (`<T = string>`) can be combined with constraints for ergonomic generic APIs.",
    code: "interface HasLength {\n  length: number;\n}\n\nfunction logLength<T extends HasLength>(item: T): T {\n  console.log(item.length);\n  return item;\n}\n\nlogLength(\"hello\"); // strings have .length\nlogLength([1, 2, 3]); // arrays have .length\n// logLength(42); // Error: number doesn't have .length\n\nfunction merge<T extends object, U extends object>(a: T, b: U): T & U {\n  return { ...a, ...b };\n}",
    interviewQuestion: "Why would `function logLength<T>(item: T) { return item.length; }` fail to compile, and how do you fix it with a constraint?",
  },
  {
    id: "typescript-variance-covariance-contravariance",
    category: "typescript",
    difficulty: "Tricky",
    topic: "Advanced Types",
    title: "What are covariance and contravariance in TypeScript?",
    summary: "Variance describes how subtyping between compound types (like arrays or functions) relates to subtyping of their component types, and it determines when one generic type can safely substitute for another.",
    explanation: "A type is covariant in a position if subtyping is preserved in the same direction — e.g. `Dog[]` is assignable to `Animal[]` because arrays are covariant in their element type. Function parameters are contravariant in a sound type system: a function that accepts `Animal` can be used where a function accepting `Dog` is expected, because it can handle at least as much as required, though TypeScript's default (non-strict) behavior actually allows unsound bivariant method parameter checks for practical reasons. Enabling `strictFunctionTypes` makes standalone function type parameters properly contravariant (stricter checking), while method shorthand syntax remains bivariant for compatibility with common OOP override patterns. Understanding variance explains why `(dog: Dog) => void` is NOT assignable to `(animal: Animal) => void` under strict mode, even though it feels intuitive — the parameter direction is flipped compared to return types.",
    code: "class Animal { name = \"animal\"; }\nclass Dog extends Animal { breed = \"dog\"; }\n\n// Covariance: Dog[] is a subtype of Animal[]\nconst dogs: Dog[] = [new Dog()];\nconst animals: Animal[] = dogs; // OK, arrays are covariant\n\n// Contravariance with strictFunctionTypes enabled:\ntype AnimalHandler = (a: Animal) => void;\ntype DogHandler = (d: Dog) => void;\n\nlet handleAnimal: AnimalHandler = (a) => console.log(a.name);\nlet handleDog: DogHandler = handleAnimal; // OK: can handle any Animal, including Dog\n\n// handleAnimal = (d: Dog) => console.log(d.breed); // Error under strictFunctionTypes",
    interviewQuestion: "Why does TypeScript reject assigning a function that only accepts a subtype (Dog) to a variable typed to accept the supertype (Animal), when strictFunctionTypes is enabled?",
  },
  {
    id: "typescript-module-augmentation",
    category: "typescript",
    difficulty: "Advanced",
    topic: "Modules",
    title: "How does module augmentation work?",
    summary: "Module augmentation lets you add new members to an existing module's exported types from outside that module, commonly used to extend third-party library types.",
    explanation: "Using `declare module \"module-name\" { ... }` in a `.d.ts` (or any file with an import/export making it a module) reopens an already-declared module and merges additional declarations into it, which is how libraries like Express or Redux allow consumers to extend their core types (e.g. adding custom properties to `Request`). This relies on TypeScript's declaration merging rules — interfaces with the same name in the same module scope merge their members rather than conflicting. Augmentation must target the exact module specifier string used in imports, and the augmenting file needs at least one top-level `import` or `export` to be treated as a module rather than a global script. It's the standard pattern for typing global libraries attached to `window`, or for adding fields to a third-party interface without forking the library.",
    code: "// express.d.ts\nimport \"express\";\n\ndeclare module \"express\" {\n  interface Request {\n    userId?: string;\n  }\n}\n\n// usage.ts\nimport { Request, Response } from \"express\";\n\nfunction handler(req: Request, res: Response) {\n  console.log(req.userId); // now type-checked, no error\n  res.send(\"ok\");\n}",
    interviewQuestion: "How would you add a custom `userId` field to Express's Request type without modifying the library's own type definitions?",
  },
  {
    id: "typescript-namespaces-vs-modules",
    category: "typescript",
    difficulty: "Intermediate",
    topic: "Modules",
    title: "Namespaces vs ES modules: what's the difference?",
    summary: "Namespaces are a TypeScript-specific way to group code under a single global name, while ES modules use file-based import/export and are the modern standard.",
    explanation: "Namespaces (formerly called 'internal modules') use the `namespace` keyword to group related code and avoid global naming collisions, compiling down to nested objects assigned to a shared global variable, which predates ES modules being widely supported. ES modules, in contrast, use `import`/`export` syntax, are file-scoped by default, support static analysis and tree-shaking by bundlers, and are the standard used across the modern JS ecosystem including Node.js and bundler tooling. Namespaces still have a legitimate niche today for organizing large ambient type declarations (like typing a big global library with many nested APIs) or in projects without a module bundler, but for application code, ES modules are strongly preferred since they enable better tooling, dead-code elimination, and interop with the broader JS ecosystem. Mixing namespaces with modules is possible but generally discouraged as it complicates the mental model of scoping.",
    code: "// Namespace style (legacy, still used for typing large global APIs)\nnamespace Validation {\n  export interface Validator {\n    isValid(value: string): boolean;\n  }\n  export class EmailValidator implements Validator {\n    isValid(value: string): boolean {\n      return value.includes(\"@\");\n    }\n  }\n}\nconst v = new Validation.EmailValidator();\n\n// ES module style (modern, preferred)\n// validators.ts\nexport interface Validator {\n  isValid(value: string): boolean;\n}\nexport class EmailValidator implements Validator {\n  isValid(value: string): boolean {\n    return value.includes(\"@\");\n  }\n}\n// consumer.ts\n// import { EmailValidator } from \"./validators\";",
    interviewQuestion: "In modern TypeScript projects, why are ES modules generally preferred over namespaces, and when might namespaces still be appropriate?",
  },
  {
    id: "typescript-as-const-vs-literal-types",
    category: "typescript",
    difficulty: "Intermediate",
    topic: "Type Inference",
    title: "How does as const differ from explicitly declared literal types?",
    summary: "as const infers the narrowest possible literal types for an entire expression and makes it deeply readonly, while manually typed literals only narrow the specific annotation you write.",
    explanation: "By default, TypeScript widens literal values in `let`/mutable contexts and even in object literals — `{ status: \"active\" }` infers `status: string`, not the literal `\"active\"`. Appending `as const` after an expression tells the compiler to infer the most specific literal type possible for every part of that expression and additionally makes arrays and object properties `readonly`. This differs from manually annotating a single literal type (`const status: \"active\" = \"active\"`), which only narrows that one declaration rather than recursively narrowing a nested structure. `as const` is especially useful for defining fixed configuration objects, enum-like string unions derived via `keyof typeof`, or tuple literals that should not be widened to a generic array type.",
    code: "// Without as const — widened\nconst config1 = { env: \"production\", retries: 3 };\n// type: { env: string; retries: number }\n\n// With as const — deeply narrowed and readonly\nconst config2 = { env: \"production\", retries: 3 } as const;\n// type: { readonly env: \"production\"; readonly retries: 3 }\n\nconst directions = [\"up\", \"down\", \"left\", \"right\"] as const;\ntype Direction = typeof directions[number]; // \"up\" | \"down\" | \"left\" | \"right\"\n\n// config2.env = \"staging\"; // Error: readonly property",
    interviewQuestion: "What's the practical difference between `const x = { role: 'admin' }` and `const x = { role: 'admin' } as const`, and why does it matter for function calls expecting literal types?",
  },
  {
    id: "typescript-non-null-assertion-operator",
    category: "typescript",
    difficulty: "Basic",
    topic: "Type Assertions",
    title: "What does the non-null assertion operator (!) do?",
    summary: "The postfix ! operator tells the compiler to treat a value as definitely not null or undefined, suppressing strict-null-check errors without any runtime check.",
    explanation: "When `strictNullChecks` is on, TypeScript tracks `null` and `undefined` as distinct from other types and requires you to narrow them away before use. The non-null assertion operator, written as a trailing `!`, is a compile-time-only assertion that removes `null`/`undefined` from a value's type without performing any actual runtime check — if you're wrong, the code will throw at runtime just like normal JS would. It's commonly used with DOM APIs (`document.getElementById(\"app\")!`) where the developer has external knowledge the compiler lacks, but overusing it defeats the purpose of strict null checking and can hide real bugs. A safer alternative is often explicit narrowing (`if (value) { ... }`) or the optional chaining/nullish coalescing operators (`?.`, `??`) which handle the null case gracefully instead of asserting it away.",
    code: "function getElement(id: string): HTMLElement {\n  // getElementById returns HTMLElement | null\n  return document.getElementById(id)!; // asserts it's never null\n}\n\ninterface User {\n  profile?: { bio: string };\n}\n\nfunction printBio(user: User) {\n  // Unsafe if profile is actually undefined at runtime\n  console.log(user.profile!.bio);\n\n  // Safer alternative:\n  console.log(user.profile?.bio ?? \"No bio\");\n}",
    interviewQuestion: "What's the risk of overusing the non-null assertion operator (!), and what safer alternatives exist?",
  },
  {
    id: "typescript-definite-assignment-assertion",
    category: "typescript",
    difficulty: "Intermediate",
    topic: "Type Assertions",
    title: "What is the definite assignment assertion (!) on class properties and variables?",
    summary: "The definite assignment assertion tells TypeScript that a property or variable will be assigned before use, even though the compiler can't prove it through direct analysis.",
    explanation: "When `strictPropertyInitialization` is enabled, TypeScript requires class properties to either have a default value, be assigned in the constructor, or be marked optional — otherwise it errors that the property has no initializer. Writing `propertyName!: Type` (a `!` right after the identifier, before the colon) tells the compiler to skip that check because the property will definitely be assigned elsewhere, such as in a lifecycle method or dependency-injection setup that the compiler can't statically trace. The same syntax applies to variables declared without initialization, e.g. `let x!: number;`, when you know a subsequent code path (like a loop or callback) will assign it before it's read. This is different from the non-null assertion operator used on expressions — it's applied at the declaration site to bypass initialization checks, and like other assertions, it provides no runtime guarantee, so misuse can lead to genuine undefined-value bugs.",
    code: "class UserService {\n  // Assigned in ngOnInit()/init(), not the constructor\n  private apiClient!: ApiClient;\n\n  init(client: ApiClient) {\n    this.apiClient = client;\n  }\n\n  fetchUser(id: string) {\n    return this.apiClient.get(`/users/${id}`);\n  }\n}\n\nlet config!: { retries: number };\n\nfunction loadConfig() {\n  config = { retries: 3 };\n}\nloadConfig();\nconsole.log(config.retries); // compiler trusts it's assigned",
    interviewQuestion: "You have a class property that's initialized in a lifecycle method rather than the constructor, and strictPropertyInitialization is throwing an error. How do you resolve it correctly?",
  },
  {
    id: "typescript-unknown-vs-any",
    category: "typescript",
    difficulty: "Basic",
    topic: "Type System Basics",
    title: "What's the difference between unknown and any?",
    summary: "any disables type checking entirely for a value, while unknown is a type-safe counterpart that requires narrowing before you can perform operations on it.",
    explanation: "`any` opts a value out of the type system completely — you can call methods on it, access arbitrary properties, or assign it to anything, and TypeScript won't complain, which effectively reintroduces the risks of plain JavaScript. `unknown` is the type-safe alternative: a value of type `unknown` can hold anything (like `any`), but you cannot call methods, access properties, or perform most operations on it until you've narrowed its type using `typeof`, `instanceof`, a type guard, or an assertion. This makes `unknown` the correct choice for representing genuinely unknown external data, such as the result of `JSON.parse` or a caught error in a `catch` block, since it forces callers to validate before use. As a best practice, prefer `unknown` over `any` whenever possible, and reserve `any` for rare cases like gradual migration from JS or deliberately opting out of checking for a specific reason.",
    code: "function parseJson(text: string): unknown {\n  return JSON.parse(text);\n}\n\nconst data = parseJson('{\"name\":\"Alice\"}');\n// data.name; // Error: 'data' is of type 'unknown'\n\nif (typeof data === \"object\" && data !== null && \"name\" in data) {\n  console.log((data as { name: string }).name); // now safe to use\n}\n\nfunction risky(value: any) {\n  value.foo.bar.baz(); // No compile error, but may crash at runtime\n}",
    interviewQuestion: "Why is unknown considered safer than any, and how would you refactor a function that returns any from JSON.parse to use unknown instead?",
  },
  {
    id: "typescript-indexed-access-types",
    category: "typescript",
    difficulty: "Intermediate",
    topic: "Advanced Types",
    title: "What are indexed access types?",
    summary: "Indexed access types use T[K] syntax to extract the type of a specific property from another type, similar to how you'd access a value at runtime.",
    explanation: "Just as `obj[\"key\"]` retrieves a value at runtime, `T[\"key\"]` at the type level retrieves the type of that property from type `T`, which is useful for deriving sub-types without duplicating definitions. Indexed access also works with unions of keys (`T[\"a\" | \"b\"]`) to get a union of those properties' types, and with `keyof T` (`T[keyof T]`) to get a union of all property value types on the object. It's especially powerful combined with arrays: `T[number]` extracts the element type of an array or tuple type `T`, which is how you'd get the union of literal values from a `readonly` tuple created with `as const`. This pattern avoids type duplication and keeps derived types automatically in sync when the source type changes.",
    code: "interface ApiResponse {\n  data: { id: number; name: string };\n  status: number;\n  errors: string[];\n}\n\ntype ResponseData = ApiResponse[\"data\"]; // { id: number; name: string }\ntype StatusOrErrors = ApiResponse[\"status\" | \"errors\"]; // number | string[]\n\nconst roles = [\"admin\", \"editor\", \"viewer\"] as const;\ntype Role = typeof roles[number]; // \"admin\" | \"editor\" | \"viewer\"\n\ntype ErrorItem = ApiResponse[\"errors\"][number]; // string",
    interviewQuestion: "Given an interface with a nested `data` property, how would you extract just the type of that nested property without redefining it?",
  },
  {
    id: "typescript-template-literal-type-manipulation",
    category: "typescript",
    difficulty: "Advanced",
    topic: "Template Literal Types",
    title: "How can you manipulate string literal types with template literal types and intrinsic string manipulation types?",
    summary: "Template literal types can combine literal unions to generate new string unions, and TypeScript's built-in Uppercase, Lowercase, Capitalize, and Uncapitalize types transform string literal casing at the type level.",
    explanation: "Template literal types let you build new string literal types by interpolating other types into a template, similar to JS template strings but operating purely on types — for example, combining a union of event names with a prefix to generate a union of handler names. When a union type is interpolated into a template literal type, TypeScript distributes over every combination, producing the cross-product of possible strings, which is how you can generate types like `\"on:click\" | \"on:hover\"` from `\"click\" | \"hover\"`. The compiler also ships intrinsic string manipulation types — `Uppercase<S>`, `Lowercase<S>`, `Capitalize<S>`, and `Uncapitalize<S>` — that transform the casing of string literal types at compile time, useful for generating consistent naming conventions such as event handler prop names from event names. These features are frequently combined with mapped types to auto-generate typed APIs, such as deriving `{ onClick: () => void }` from `{ click: Event }`.",
    code: "type EventName = \"click\" | \"hover\" | \"focus\";\ntype HandlerName = `on${Capitalize<EventName>}`;\n// \"onClick\" | \"onHover\" | \"onFocus\"\n\ntype CssProperty = \"color\" | \"background\";\ntype CssVariable = `--${CssProperty}`;\n// \"--color\" | \"--background\"\n\ntype Loud = Uppercase<\"hello\">; // \"HELLO\"\ntype Quiet = Lowercase<\"HELLO\">; // \"hello\"\n\ntype Handlers = {\n  [K in EventName as `on${Capitalize<K>}`]: (event: K) => void;\n};\n// { onClick: (event: \"click\") => void; onHover: ...; onFocus: ... }",
    interviewQuestion: "Given a union of event names like 'click' | 'hover', how would you generate a union or object type of corresponding handler prop names like 'onClick' | 'onHover' using template literal types?",
  },

{
    id: "react-controlled-vs-uncontrolled",
    category: "react",
    difficulty: "Basic",
    topic: "Forms",
    title: "What is the difference between controlled and uncontrolled components?",
    summary: "Controlled components have their form state driven by React via value/onChange, while uncontrolled components manage their own state internally and are accessed via refs.",
    explanation: "A controlled component's input value is always derived from React state, so every keystroke triggers a state update and re-render, giving you a single source of truth. An uncontrolled component stores its value in the DOM itself, and you read it on demand with a ref (e.g. inputRef.current.value). Controlled components make validation, conditional disabling, and formatting straightforward but can be verbose for large forms. Uncontrolled components are simpler and more performant for basic use cases like file inputs, which can only be uncontrolled. Libraries like React Hook Form lean on uncontrolled inputs plus refs to minimize re-renders.",
    code: "function NameForm() {\n  // Controlled\n  const [name, setName] = React.useState('');\n\n  // Uncontrolled\n  const emailRef = React.useRef(null);\n\n  const handleSubmit = (e) => {\n    e.preventDefault();\n    console.log(name, emailRef.current.value);\n  };\n\n  return (\n    <form onSubmit={handleSubmit}>\n      <input value={name} onChange={(e) => setName(e.target.value)} />\n      <input ref={emailRef} defaultValue=\"\" />\n      <button type=\"submit\">Submit</button>\n    </form>\n  );\n}",
    interviewQuestion: "When would you choose an uncontrolled component over a controlled one, and what are the tradeoffs?",
  },
  {
    id: "react-prop-drilling",
    category: "react",
    difficulty: "Basic",
    topic: "State Management",
    title: "What is prop drilling and how can you avoid it?",
    summary: "Prop drilling is passing data through multiple layers of components that don't need it themselves, just to reach a deeply nested child.",
    explanation: "As component trees grow, passing props through intermediate components that only forward them adds boilerplate and coupling — any change to the shape of the data requires touching every layer in between. Common fixes include the Context API for cross-cutting data like theme or auth, component composition (passing children/render props instead of threading data), or external state managers like Zustand or Redux for complex shared state. The right fix depends on scope: Context works well for low-frequency updates, but overusing it for high-frequency state can cause unnecessary re-renders across all consumers.",
    code: "// Prop drilling\nfunction App() {\n  const user = { name: 'Sai' };\n  return <Page user={user} />;\n}\nfunction Page({ user }) {\n  return <Sidebar user={user} />;\n}\nfunction Sidebar({ user }) {\n  return <UserBadge user={user} />; // only this needs it\n}\n\n// Fixed with composition\nfunction App() {\n  const user = { name: 'Sai' };\n  return (\n    <Page>\n      <Sidebar>\n        <UserBadge user={user} />\n      </Sidebar>\n    </Page>\n  );\n}",
    interviewQuestion: "Your team complains that a 'theme' prop is threaded through six components. How would you refactor this, and what tradeoffs would you weigh between Context and composition?",
  },
  {
    id: "react-children-api",
    category: "react",
    difficulty: "Intermediate",
    topic: "Component Patterns",
    title: "How does the React.Children API work and when do you need it?",
    summary: "React.Children provides utility methods (map, forEach, count, toArray, only) for safely iterating over the opaque props.children data structure.",
    explanation: "props.children can be a single element, an array, a string, or even undefined, so iterating over it directly with Array.prototype methods is unsafe. React.Children.map handles all these cases uniformly and preserves keys correctly when cloning. It's primarily used inside reusable container components — like a Tabs or Accordion component — that need to inspect, wrap, or inject props into each child without knowing in advance how many children will be passed. React.Children.toArray is also useful for flattening nested fragments while auto-generating stable keys. In modern React, this pattern is often replaced by explicit array props or context, but it still appears heavily in component libraries.",
    code: "function Tabs({ children, activeIndex }) {\n  return (\n    <div className=\"tabs\">\n      {React.Children.map(children, (child, index) =>\n        React.cloneElement(child, {\n          isActive: index === activeIndex,\n        })\n      )}\n    </div>\n  );\n}\n\nfunction Tab({ isActive, label }) {\n  return <div style={{ fontWeight: isActive ? 'bold' : 'normal' }}>{label}</div>;\n}\n\n// <Tabs activeIndex={0}>\n//   <Tab label=\"One\" />\n//   <Tab label=\"Two\" />\n// </Tabs>",
    interviewQuestion: "Why can't you just call children.map() directly in a component, and what does React.Children.map do differently?",
  },
  {
    id: "react-cloneelement",
    category: "react",
    difficulty: "Intermediate",
    topic: "Component Patterns",
    title: "What does React.cloneElement do and what are its pitfalls?",
    summary: "cloneElement creates a copy of a React element with new or merged props, commonly used to inject extra props into children passed via composition.",
    explanation: "cloneElement(element, newProps, children) returns a new element with the same type and key as the original but with newProps shallowly merged over the existing props. It's often paired with React.Children.map inside components like Tabs, Accordion, or form wrappers that need to inject shared state (like isActive or a ref) into whichever children the consumer passes. The main pitfalls: it creates implicit coupling because the parent assumes something about the child's prop API, it doesn't work well with custom components that don't accept the injected prop, and overusing it makes component trees harder to trace. Many teams prefer explicit render props or context for the same use case because it's more discoverable.",
    code: "function RadioGroup({ children, value, onChange }) {\n  return React.Children.map(children, (child) =>\n    React.cloneElement(child, {\n      checked: child.props.value === value,\n      onChange: () => onChange(child.props.value),\n    })\n  );\n}\n\nfunction Radio({ checked, onChange, label }) {\n  return (\n    <label>\n      <input type=\"radio\" checked={checked} onChange={onChange} /> {label}\n    </label>\n  );\n}",
    interviewQuestion: "What's the downside of using cloneElement to inject props into children, and what alternative patterns solve the same problem more explicitly?",
  },
  {
    id: "react-context-rerender-pitfalls",
    category: "react",
    difficulty: "Advanced",
    topic: "Performance",
    title: "Why does every Context consumer re-render when the provider's value changes?",
    summary: "React Context re-renders every component calling useContext whenever the provider's value prop changes identity, regardless of whether that consumer uses the changed part of the value.",
    explanation: "Context is not a selective subscription system — when a Provider re-renders with a new value reference, React re-renders all descendants that call useContext(MyContext), even if they only destructure a field that didn't change. This becomes a performance problem when a single context bundles unrelated, frequently-changing state (e.g. both 'user' and 'notificationCount') because every consumer re-renders on any change. Common fixes: split contexts by concern so unrelated updates don't cascade, memoize the value object passed to the Provider with useMemo, or move to a selector-based external store (Zustand, Redux with useSelector, or useSyncExternalStore) that only re-renders components subscribed to the specific slice that changed.",
    code: "// Problem: one context, unrelated fields\nconst AppContext = React.createContext();\nfunction AppProvider({ children }) {\n  const [user, setUser] = React.useState(null);\n  const [count, setCount] = React.useState(0);\n  // New object every render -> all consumers re-render\n  const value = { user, setUser, count, setCount };\n  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;\n}\n\n// Fix: memoize and/or split contexts\nfunction AppProvider({ children }) {\n  const [user, setUser] = React.useState(null);\n  const [count, setCount] = React.useState(0);\n  const value = React.useMemo(() => ({ user, setUser, count, setCount }), [user, count]);\n  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;\n}",
    interviewQuestion: "A component that only reads `theme` from a shared context re-renders every time an unrelated `cartItems` value updates in the same context. How do you diagnose and fix this?",
  },
  {
    id: "react-usesyncexternalstore",
    category: "react",
    difficulty: "Advanced",
    topic: "Hooks",
    title: "What problem does useSyncExternalStore solve?",
    summary: "useSyncExternalStore lets React components safely subscribe to external (non-React) state sources like browser APIs or third-party stores without tearing under concurrent rendering.",
    explanation: "Before React 18, subscribing to external stores with useEffect + useState could cause 'tearing' — different parts of the UI showing inconsistent snapshots of the same external state during concurrent rendering, because effects run after render. useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot) is a purpose-built hook that guarantees the returned snapshot is consistent across a single render pass, even with concurrent features like useTransition. It's the mechanism libraries like Redux, Zustand, and Jotai use internally to bind their stores to React. You rarely call it directly in app code, but it's essential for building custom store integrations or subscribing to browser APIs like window.innerWidth or navigator.onLine.",
    code: "function subscribe(callback) {\n  window.addEventListener('online', callback);\n  window.addEventListener('offline', callback);\n  return () => {\n    window.removeEventListener('online', callback);\n    window.removeEventListener('offline', callback);\n  };\n}\n\nfunction useOnlineStatus() {\n  return React.useSyncExternalStore(\n    subscribe,\n    () => navigator.onLine,\n    () => true // server snapshot\n  );\n}\n\nfunction StatusBadge() {\n  const isOnline = useOnlineStatus();\n  return <span>{isOnline ? 'Online' : 'Offline'}</span>;\n}",
    interviewQuestion: "Why is useSyncExternalStore preferred over useEffect + useState for subscribing to an external store like Redux under React 18's concurrent rendering?",
  },
  {
    id: "react-uselayouteffect-vs-useeffect",
    category: "react",
    difficulty: "Intermediate",
    topic: "Hooks",
    title: "What is the difference between useLayoutEffect and useEffect?",
    summary: "useEffect runs asynchronously after the browser paints, while useLayoutEffect runs synchronously after DOM mutations but before the browser paints.",
    explanation: "Both hooks let you run side effects after render, but their timing differs: useEffect is scheduled after the paint, so the user may briefly see the pre-effect UI, which is fine for data fetching, subscriptions, or logging. useLayoutEffect fires synchronously right after React commits DOM changes but before the browser paints, blocking the paint until it finishes — use it when you need to measure or mutate the DOM (e.g. reading an element's size and adjusting layout) to avoid a visible flicker. Overusing useLayoutEffect can hurt performance since it blocks painting, so it should be reserved for genuine layout-measurement cases. On the server, useLayoutEffect warns because there's no DOM to measure, so libraries often fall back to useEffect during SSR.",
    code: "function Tooltip({ targetRef, text }) {\n  const [style, setStyle] = React.useState({});\n\n  React.useLayoutEffect(() => {\n    const rect = targetRef.current.getBoundingClientRect();\n    // Measure and position before paint to avoid flicker\n    setStyle({ top: rect.bottom, left: rect.left });\n  }, [targetRef]);\n\n  return <div className=\"tooltip\" style={style}>{text}</div>;\n}",
    interviewQuestion: "You notice a brief flicker when a tooltip repositions itself based on a measured DOM element. Would you use useEffect or useLayoutEffect to fix it, and why?",
  },
  {
    id: "react-virtual-dom-diffing",
    category: "react",
    difficulty: "Basic",
    topic: "Core Concepts",
    title: "How does React's virtual DOM diffing algorithm work at a high level?",
    summary: "React builds a lightweight in-memory tree of elements on each render and compares it to the previous tree using heuristics to compute the minimal set of real DOM updates.",
    explanation: "Rather than diffing arbitrary trees (an O(n^3) problem in the general case), React uses a heuristic O(n) algorithm based on two assumptions: elements of different types produce different trees (so React tears down and rebuilds rather than diffing deeply across type changes), and elements can be identified with a stable key to match children across renders. When comparing two elements of the same type, React keeps the underlying DOM node and only updates changed attributes; when types differ, it unmounts the old subtree and mounts a new one. For lists, keys let React match items by identity rather than by index, minimizing unnecessary unmount/remount cycles when items are reordered, inserted, or removed.",
    code: "// Same type -> React updates attributes in place\n<div className=\"a\" />\n<div className=\"b\" /> // DOM node reused, className updated\n\n// Different type -> React unmounts old, mounts new\n<div />\n<span /> // old div removed, new span created\n\n// Keys guide list reconciliation\n{items.map((item) => (\n  <li key={item.id}>{item.label}</li>\n))}",
    interviewQuestion: "Why is React's diffing algorithm described as O(n) instead of the theoretically correct O(n^3), and what assumptions make that possible?",
  },
  {
    id: "react-index-as-key-pitfalls",
    category: "react",
    difficulty: "Intermediate",
    topic: "Reconciliation",
    title: "Why is using array index as a key problematic?",
    summary: "Using the array index as a React key can cause incorrect reconciliation when list items are reordered, inserted, or deleted, leading to stale UI state or unnecessary DOM churn.",
    explanation: "React uses keys to match elements between renders so it can decide whether to update, move, or recreate a DOM node and its associated component state. If you use the index as the key and the list order changes (e.g. an item is deleted from the middle), React matches each position's old key to the new key, causing it to think the wrong items changed — this can mix up local component state (like input values or checkbox state) between rows, and it defeats memoization optimizations. Index keys are acceptable only when the list is static, never reordered, and has no per-item local state. The correct fix is to use a stable, unique identifier from the data itself, like a database id.",
    code: "// Buggy: index as key\nfunction TodoList({ todos }) {\n  return todos.map((todo, index) => (\n    <TodoItem key={index} todo={todo} /> // reordering breaks state\n  ));\n}\n\n// Correct: stable id as key\nfunction TodoList({ todos }) {\n  return todos.map((todo) => (\n    <TodoItem key={todo.id} todo={todo} />\n  ));\n}",
    interviewQuestion: "A checklist with checkboxes shows the wrong items checked after you delete a row from the middle of the list. What's the likely cause and how do you fix it?",
  },
  {
    id: "react-code-splitting-lazy-suspense",
    category: "react",
    difficulty: "Intermediate",
    topic: "Performance",
    title: "How do React.lazy and Suspense enable code splitting?",
    summary: "React.lazy lets you dynamically import a component so its code is fetched only when needed, and Suspense lets you show a fallback UI while that chunk loads.",
    explanation: "React.lazy(() => import('./Component')) returns a component that, on first render, triggers a dynamic import and suspends rendering until the module resolves. Wrapping it in a <Suspense fallback={...}> boundary tells React what to show while waiting, avoiding blank screens or errors. This is the primary mechanism for route-based or feature-based code splitting in React apps, reducing the initial bundle size so users only download the JavaScript for the screens they actually visit. It's commonly combined with a router (e.g. lazy-loading route components) and should be paired with an error boundary to handle chunk-load failures gracefully, especially after a new deployment invalidates old chunk URLs.",
    code: "const Settings = React.lazy(() => import('./Settings'));\n\nfunction App() {\n  const [showSettings, setShowSettings] = React.useState(false);\n  return (\n    <div>\n      <button onClick={() => setShowSettings(true)}>Open Settings</button>\n      <React.Suspense fallback={<Spinner />}>\n        {showSettings && <Settings />}\n      </React.Suspense>\n    </div>\n  );\n}",
    interviewQuestion: "How would you split a large dashboard app so each route's code only loads when the user navigates to it, and what happens if the fetch for a lazy chunk fails?",
  },
  {
    id: "react-ssr-hydration-mismatch",
    category: "react",
    difficulty: "Advanced",
    topic: "Server-Side Rendering",
    title: "What causes a hydration mismatch in server-rendered React apps?",
    summary: "A hydration mismatch happens when the HTML React generates on the client during hydration differs from the HTML the server sent, forcing React to discard and re-render the mismatched DOM.",
    explanation: "During SSR, the server renders components to an HTML string, which is sent to the browser and displayed immediately. React then 'hydrates' that markup on the client by attaching event listeners and reconciling it with what the client-side render would produce — it assumes the two match exactly. Mismatches commonly come from using browser-only APIs (window, localStorage) during render, rendering time-sensitive or locale-sensitive values (Date.now(), Math.random(), timezone-dependent formatting) differently on server vs client, or conditionally rendering based on typeof window. React 18 warns in the console and re-renders the affected subtree on the client, which can cause a visible flash and hurts performance since the SSR benefit is lost for that part of the tree. Fixes include deferring browser-only rendering to useEffect, using suppressHydrationWarning sparingly for known-safe cases, or ensuring server and client compute the same initial value.",
    code: "// Problematic: differs between server and client\nfunction Timestamp() {\n  return <span>{new Date().toLocaleTimeString()}</span>;\n}\n\n// Fixed: render static/neutral value first, update after mount\nfunction Timestamp() {\n  const [time, setTime] = React.useState(null);\n  React.useEffect(() => {\n    setTime(new Date().toLocaleTimeString());\n  }, []);\n  return <span>{time ?? '--:--:--'}</span>;\n}",
    interviewQuestion: "Your Next.js app logs a hydration mismatch warning for a component that renders `new Date()`. Explain why this happens and how you'd fix it.",
  },
  {
    id: "react-devtools-profiler",
    category: "react",
    difficulty: "Intermediate",
    topic: "Tooling",
    title: "How do you use the React DevTools Profiler to diagnose performance issues?",
    summary: "The Profiler tab in React DevTools records render timings per component per commit, helping you identify which components render too often or take too long.",
    explanation: "The Profiler lets you record a session of interactions and then inspect a flame graph or ranked chart showing how long each component took to render in each commit, plus why it rendered (props changed, state changed, parent re-rendered, or context changed) when the 'Record why each component rendered' option is enabled. This is the standard tool for finding unnecessary re-renders — for example, a child re-rendering purely because its parent passed a new inline function or object reference each time, which memoization (React.memo, useMemo, useCallback) can fix. The Profiler API also exposes a programmatic <Profiler id onRender> component for capturing timing data in production-like conditions or automated performance budgets.",
    code: "import { Profiler } from 'react';\n\nfunction onRenderCallback(id, phase, actualDuration) {\n  console.log(`${id} (${phase}) took ${actualDuration.toFixed(2)}ms`);\n}\n\nfunction App() {\n  return (\n    <Profiler id=\"Dashboard\" onRender={onRenderCallback}>\n      <Dashboard />\n    </Profiler>\n  );\n}",
    interviewQuestion: "You suspect a list component re-renders too often. Walk through how you'd use the React DevTools Profiler to confirm this and identify the root cause.",
  },
  {
    id: "react-redux-vs-context",
    category: "react",
    difficulty: "Intermediate",
    topic: "State Management",
    title: "Redux vs Context API: when should you reach for each?",
    summary: "Context is a built-in dependency-injection mechanism for passing data through the tree, while Redux is a full state-management library with a single store, middleware, and selective subscriptions.",
    explanation: "Context solves prop drilling for relatively static or infrequently changing data (theme, auth user, locale) but has no built-in mechanism for selective re-rendering — every consumer re-renders on any value change unless you manually split contexts or memoize. Redux (especially with Redux Toolkit) provides a centralized store, predictable update patterns via reducers/actions, middleware for side effects (thunks, sagas), time-travel debugging, and — critically — useSelector subscriptions that only re-render a component when the specific selected slice changes, which scales much better for large, frequently-updated state. The rule of thumb: use Context for simple, low-frequency shared values and composition; reach for Redux (or Zustand/Jotai) when you have complex, high-frequency, cross-cutting state, need middleware, or want strong devtools support.",
    code: "// Context: simple, infrequent updates\nconst ThemeContext = React.createContext('light');\n\n// Redux Toolkit: complex, frequent, selective updates\nimport { createSlice, configureStore } from '@reduxjs/toolkit';\n\nconst cartSlice = createSlice({\n  name: 'cart',\n  initialState: { items: [] },\n  reducers: {\n    addItem: (state, action) => { state.items.push(action.payload); },\n  },\n});\n\nconst store = configureStore({ reducer: { cart: cartSlice.reducer } });\n// useSelector(state => state.cart.items) only re-renders on items change",
    interviewQuestion: "Your app's Context-based cart state causes the entire product listing page to re-render on every quantity change. Would you fix this within Context or migrate to Redux/Zustand? Justify your answer.",
  },
  {
    id: "react-usecallback-dependency-pitfalls",
    category: "react",
    difficulty: "Tricky",
    topic: "Performance",
    title: "What are common dependency array pitfalls with useCallback?",
    summary: "useCallback only preserves referential stability when its dependency array is correct and stable itself; missing or unstable dependencies lead to stale closures or the memoization never actually helping.",
    explanation: "A common mistake is omitting a value used inside the callback from the dependency array to 'stop it from changing' — this creates a stale closure that captures an old value indefinitely. The opposite mistake is passing a new object or function as a dependency on every render (e.g. an inline options object), which defeats memoization because the dependency itself is never referentially equal across renders, so useCallback returns a new function every time anyway. Another subtlety: memoizing a callback with useCallback only helps performance if it's actually used in a way that matters, like being passed to a React.memo child or as a dependency of another hook — otherwise it just adds overhead. The fix is usually to stabilize dependencies with useMemo/useRef, use the functional form of setState to avoid needing state as a dependency, or use an eslint-plugin-react-hooks exhaustive-deps rule to catch mistakes.",
    code: "// Stale closure bug: `count` is frozen at 0\nfunction Counter() {\n  const [count, setCount] = React.useState(0);\n  const logCount = React.useCallback(() => {\n    console.log(count); // stale unless count is in deps\n  }, []); // missing dependency\n\n  // Fix 1: include dependency\n  const logCountFixed = React.useCallback(() => {\n    console.log(count);\n  }, [count]);\n\n  // Fix 2: avoid needing the dependency via functional update\n  const increment = React.useCallback(() => {\n    setCount((c) => c + 1);\n  }, []);\n}",
    interviewQuestion: "A useCallback-wrapped click handler always logs the initial state value even after several clicks. What's happening and how do you fix it?",
  },
  {
    id: "react-event-pooling-legacy",
    category: "react",
    difficulty: "Advanced",
    topic: "Core Concepts",
    title: "What was event pooling in legacy React, and how did React 17+ change it?",
    summary: "Before React 17, SyntheticEvent objects were pooled and nulled out after the event handler ran, so accessing event properties asynchronously threw errors; React 17 removed pooling entirely.",
    explanation: "In React 16 and earlier, React reused a single SyntheticEvent object across events for performance, resetting all its fields to null immediately after the synchronous handler finished. This meant code that stashed the event and read its properties later (e.g. inside a setTimeout or after an await) would see null values unless you called event.persist() to opt the event out of pooling. React 17 removed event pooling entirely because modern JavaScript engines made the optimization largely unnecessary, and it was a frequent source of confusing bugs. As of React 17+, SyntheticEvent objects behave like normal objects you can reference asynchronously without calling persist(), and event.persist() is now a no-op kept only for backward compatibility.",
    code: "// React 16 and earlier: required persist() for async access\nfunction handleClick(e) {\n  e.persist(); // needed pre-17\n  setTimeout(() => {\n    console.log(e.target.value); // would be null without persist()\n  }, 1000);\n}\n\n// React 17+: works without persist()\nfunction handleClick(e) {\n  setTimeout(() => {\n    console.log(e.target.value); // safe, no pooling\n  }, 1000);\n}",
    interviewQuestion: "In an older React 16 codebase, a developer reads event.target.value inside a setTimeout and gets null. What's causing that, and how would this differ in React 18?",
  },
  {
    id: "react-forwardref-with-generics",
    category: "react",
    difficulty: "Advanced",
    topic: "TypeScript",
    title: "How do you type a forwardRef component with generics in TypeScript?",
    summary: "forwardRef's TypeScript typing doesn't support generic components out of the box, requiring a cast or a wrapper helper to preserve generic type parameters through the ref forwarding.",
    explanation: "React.forwardRef<Ref, Props> is defined in a way that erases generic type parameters on the component — if your component is generic over T (like a reusable List<T>), TypeScript will infer T as unknown at the call site once wrapped in forwardRef, because forwardRef's signature isn't itself generic-aware. The common workaround is to cast the result back to a generic function type, or to write a small typed helper function that re-declares forwardRef with the correct generic signature. This is a well-known TypeScript/React friction point, and some teams avoid it by not making ref-forwarding components generic, or by using a render-prop/function-child pattern instead.",
    code: "type ListProps<T> = {\n  items: T[];\n  renderItem: (item: T) => React.ReactNode;\n};\n\nfunction ListInner<T>(\n  { items, renderItem }: ListProps<T>,\n  ref: React.ForwardedRef<HTMLUListElement>\n) {\n  return (\n    <ul ref={ref}>\n      {items.map((item, i) => <li key={i}>{renderItem(item)}</li>)}\n    </ul>\n  );\n}\n\n// Cast to preserve generics through forwardRef\nconst List = React.forwardRef(ListInner) as <T>(\n  props: ListProps<T> & { ref?: React.ForwardedRef<HTMLUListElement> }\n) => React.ReactElement;",
    interviewQuestion: "You have a generic `List<T>` component that needs to forward a ref to its root element, but TypeScript collapses `T` to `unknown` once you wrap it in forwardRef. How do you fix the typing?",
  },
  {
    id: "react-strictmode-purpose",
    category: "react",
    difficulty: "Basic",
    topic: "Core Concepts",
    title: "What is the purpose of React.StrictMode?",
    summary: "StrictMode is a development-only wrapper that helps surface unsafe lifecycles, side effects, and deprecated APIs by adding extra checks and warnings, without rendering any visible UI.",
    explanation: "Wrapping part of your tree in <React.StrictMode> opts that subtree into additional development-only checks: it warns about legacy APIs (like string refs or findDOMNode), detects unexpected side effects by intentionally double-invoking component render functions, state updater functions, and certain lifecycle methods, and (in React 18) double-invokes effect setup/cleanup on mount to help you catch effects that aren't properly cleaned up. None of this runs in production builds, so it has zero runtime cost for end users — it exists purely to catch bugs early, especially ones related to impure rendering or missing cleanup that would otherwise only surface under concurrent rendering or Suspense.",
    code: "import { StrictMode } from 'react';\nimport { createRoot } from 'react-dom/client';\n\nconst root = createRoot(document.getElementById('root'));\nroot.render(\n  <StrictMode>\n    <App />\n  </StrictMode>\n);\n\n// In dev, StrictMode double-invokes render and effect setup/cleanup\n// to help surface impure renders and missing effect cleanup.",
    interviewQuestion: "A teammate notices their useEffect runs twice on mount only in development and asks if that's a bug. How do you explain what's happening and why it's intentional?",
  },
  {
    id: "react-form-validation-patterns",
    category: "react",
    difficulty: "Intermediate",
    topic: "Forms",
    title: "What are common patterns for form validation in React?",
    summary: "Form validation in React ranges from manual state-driven validation on change/blur/submit to schema-based validation with libraries like Zod or Yup, often paired with React Hook Form.",
    explanation: "The simplest pattern is manual: track field values and an errors object in state, validate on blur or submit, and derive error messages from custom functions. This gets unwieldy as forms grow, so many teams pair a form library (React Hook Form, Formik) with a schema validation library (Zod, Yup) so validation rules are declarative and reusable, and can be shared between client and server (e.g. validating an API payload with the same Zod schema). Key UX considerations: validating on blur rather than on every keystroke avoids annoying users while typing, but re-validating on change after a field has been touched gives fast feedback once an error is fixed; submit-time validation should always run as a final gate regardless of per-field timing, since programmatic changes or paste events can bypass blur handlers.",
    code: "import { z } from 'zod';\nimport { useForm } from 'react-hook-form';\nimport { zodResolver } from '@hookform/resolvers/zod';\n\nconst schema = z.object({\n  email: z.string().email('Invalid email'),\n  age: z.number().min(18, 'Must be 18+'),\n});\n\nfunction SignupForm() {\n  const { register, handleSubmit, formState: { errors } } = useForm({\n    resolver: zodResolver(schema),\n  });\n\n  return (\n    <form onSubmit={handleSubmit((data) => console.log(data))}>\n      <input {...register('email')} />\n      {errors.email && <p>{errors.email.message}</p>}\n      <button type=\"submit\">Sign up</button>\n    </form>\n  );\n}",
    interviewQuestion: "How would you design validation timing (on change, on blur, on submit) for a signup form to balance responsiveness with not annoying the user while they type?",
  },
  {
    id: "react-router-v6-basics",
    category: "react",
    difficulty: "Intermediate",
    topic: "Routing",
    title: "What are the key concepts in React Router v6 (nested routes, loaders)?",
    summary: "React Router v6 introduced nested route configuration with relative paths, an <Outlet> for rendering child routes, and data APIs like loaders and actions for fetching data before render.",
    explanation: "In v6, routes are typically declared as a nested object/JSX tree, and child routes render inside a parent's <Outlet /> rather than requiring exact/switch matching logic. Relative paths and relative <Link to> resolution make deeply nested route trees much simpler to reason about than v5. The newer data APIs — createBrowserRouter with loader and action functions per route — let you fetch data before a route renders (avoiding loading waterfalls and render-then-fetch spinners) and handle mutations declaratively via <Form>, with useLoaderData and useActionData hooks to access the results in the component. Error boundaries can also be scoped per route via errorElement, so a failure in a nested route doesn't crash the whole app.",
    code: "import { createBrowserRouter, RouterProvider, Outlet, useLoaderData } from 'react-router-dom';\n\nconst router = createBrowserRouter([\n  {\n    path: '/dashboard',\n    element: <DashboardLayout />,\n    children: [\n      {\n        path: 'projects/:id',\n        loader: ({ params }) => fetch(`/api/projects/${params.id}`),\n        element: <ProjectDetail />,\n      },\n    ],\n  },\n]);\n\nfunction DashboardLayout() {\n  return (\n    <div>\n      <Sidebar />\n      <Outlet />\n    </div>\n  );\n}\n\nfunction ProjectDetail() {\n  const project = useLoaderData();\n  return <h1>{project.name}</h1>;\n}",
    interviewQuestion: "How do React Router v6 loaders improve on the classic pattern of fetching data inside a useEffect after the route component mounts?",
  },
  {
    id: "react-testing-hooks-renderhook",
    category: "react",
    difficulty: "Intermediate",
    topic: "Testing",
    title: "How do you test a custom hook in isolation using renderHook?",
    summary: "renderHook from React Testing Library mounts a custom hook inside a minimal test component, giving you access to its return value and a way to trigger re-renders via act().",
    explanation: "Custom hooks can't be called outside a component, so testing them directly requires a harness — renderHook internally renders a throwaway component that calls your hook and exposes the return value via result.current. State updates triggered from the test (like calling a function returned by the hook) must be wrapped in act() so React flushes updates before assertions run; renderHook's rerender function lets you simulate the hook being called again with new arguments, and unmount lets you verify cleanup logic (like removing event listeners) runs correctly. This approach is preferred over testing hooks only indirectly through full components because it isolates the hook's logic from unrelated UI rendering concerns, making failures easier to pinpoint.",
    code: "import { renderHook, act } from '@testing-library/react';\n\nfunction useCounter(initial = 0) {\n  const [count, setCount] = React.useState(initial);\n  const increment = () => setCount((c) => c + 1);\n  return { count, increment };\n}\n\ntest('increments the counter', () => {\n  const { result } = renderHook(() => useCounter(5));\n\n  expect(result.current.count).toBe(5);\n\n  act(() => {\n    result.current.increment();\n  });\n\n  expect(result.current.count).toBe(6);\n});",
    interviewQuestion: "Why do you need to wrap state-updating calls in act() when testing a custom hook with renderHook, and what happens if you forget?",
  },

{
    id: "reactnative-sectionlist-vs-flatlist",
    category: "reactnative",
    difficulty: "Basic",
    topic: "Lists",
    title: "When should you use SectionList instead of FlatList?",
    summary: "SectionList renders grouped data with sticky section headers, while FlatList renders a single flat list of items.",
    explanation: "SectionList is built on top of VirtualizedList just like FlatList, but it accepts a `sections` prop where each section has its own `data` array and optional header. It's the natural choice for UIs like contact lists grouped by letter, or settings screens grouped by category. FlatList would require you to manually flatten grouped data and inject fake header items, losing the built-in `renderSectionHeader` and `stickySectionHeadersEnabled` behavior. Both share the same virtualization and performance props (windowSize, initialNumToRender, etc.) since they share the same underlying implementation. Choosing SectionList over manually flattening data also keeps your key extraction and header sticky logic simpler and less error-prone.",
    code: "import { SectionList, Text, View } from 'react-native';\n\nconst sections = [\n  { title: 'A', data: ['Alice', 'Adam'] },\n  { title: 'B', data: ['Bob', 'Bella'] },\n];\n\nexport default function ContactList() {\n  return (\n    <SectionList\n      sections={sections}\n      keyExtractor={(item, index) => item + index}\n      renderItem={({ item }) => <Text>{item}</Text>}\n      renderSectionHeader={({ section: { title } }) => (\n        <View><Text style={{ fontWeight: 'bold' }}>{title}</Text></View>\n      )}\n      stickySectionHeadersEnabled\n    />\n  );\n}",
    interviewQuestion: "Why would you choose SectionList over FlatList for a contacts screen grouped alphabetically, and what do they share under the hood?",
  },
  {
    id: "reactnative-splash-screen-app-icon-setup",
    category: "reactnative",
    difficulty: "Basic",
    topic: "Native Configuration",
    title: "How is a splash screen configured natively in React Native?",
    summary: "Splash screens are native launch assets (LaunchScreen.storyboard on iOS, a themed drawable/activity on Android) shown before the JS bundle finishes loading, and are often managed with react-native-bootsplash or Expo's splash config.",
    explanation: "Because the JS engine needs time to initialize and execute your app's entry code, the OS shows a native splash screen immediately at process launch — this can't be a React component since React hasn't rendered anything yet. On iOS this is typically a storyboard or static image set in Xcode; on Android it's a windowBackground drawable applied to the launch theme. Libraries like `react-native-bootsplash` generate these native assets from a single source image and expose a JS API to programmatically hide the splash once your app's initial data/auth check completes, avoiding a flash of blank content between splash and first real screen. A common interview point is distinguishing the *static* native splash (unavoidable, shows instantly) from an *in-JS* loading screen you might render afterward while fetching auth state.",
    code: "import { useEffect, useState } from 'react';\nimport BootSplash from 'react-native-bootsplash';\nimport { View } from 'react-native';\n\nexport default function App() {\n  const [isReady, setIsReady] = useState(false);\n\n  useEffect(() => {\n    async function init() {\n      await loadAuthToken();\n      setIsReady(true);\n      await BootSplash.hide({ fade: true });\n    }\n    init();\n  }, []);\n\n  if (!isReady) return null;\n  return <View>{/* main app */}</View>;\n}",
    interviewQuestion: "Why can't the splash screen itself be a React component, and how would you avoid a flicker between the native splash and your first rendered screen?",
  },
  {
    id: "reactnative-svg-basics",
    category: "reactnative",
    difficulty: "Basic",
    topic: "UI Components",
    title: "How do you render SVGs in React Native?",
    summary: "react-native-svg exposes SVG primitives (Svg, Path, Circle, etc.) as native components, since React Native can't render raw SVG/HTML markup like the web.",
    explanation: "Unlike a browser, React Native has no built-in SVG or HTML rendering engine, so `react-native-svg` provides native-backed components that map to SVG elements and are drawn directly by the platform's rendering layer (CoreGraphics on iOS, a custom canvas view on Android), not by parsing an actual `<svg>` string at runtime. This makes vector icons resolution-independent and themeable via props (fill, stroke) unlike raster PNG icons. For complex static SVG assets exported from design tools, a common workflow is using `react-native-svg-transformer` with Metro so you can `import Logo from './logo.svg'` and use it as a component directly, rather than manually converting markup to JSX.",
    code: "import Svg, { Circle, Path } from 'react-native-svg';\n\nexport default function CheckIcon({ color = '#22c55e', size = 24 }) {\n  return (\n    <Svg width={size} height={size} viewBox=\"0 0 24 24\">\n      <Circle cx=\"12\" cy=\"12\" r=\"10\" fill={color} opacity={0.15} />\n      <Path\n        d=\"M8 12l3 3 5-6\"\n        stroke={color}\n        strokeWidth={2}\n        fill=\"none\"\n        strokeLinecap=\"round\"\n        strokeLinejoin=\"round\"\n      />\n    </Svg>\n  );\n}",
    interviewQuestion: "Why can't you just drop a raw <svg> markup string into a React Native component the way you would in a web app, and what does react-native-svg do differently?",
  },
  {
    id: "reactnative-env-config-react-native-config",
    category: "reactnative",
    difficulty: "Intermediate",
    topic: "Configuration",
    title: "How do you manage environment-specific config (.env) in React Native?",
    summary: "Libraries like react-native-config or babel-plugin-dotenv let you inject build-time environment variables such as API URLs or keys per environment (dev/staging/prod).",
    explanation: "Unlike Node.js, React Native has no native `process.env` support at runtime since the JS bundle is compiled ahead of time, so tools like `react-native-config` read a `.env` file at native build time and expose values through both native build configs (Info.plist, BuildConfig) and a JS module. This allows different API base URLs, feature flags, or keys per scheme/flavor (dev, staging, prod) without hardcoding them in source. A common gotcha is that changing `.env` values requires a full native rebuild (not just a JS reload) because the values get baked into native build artifacts, and secrets in `.env` still ship inside the app bundle, so anything truly sensitive needs server-side handling instead. Interviewers like to check whether candidates understand this is a build-time mechanism, not a secure runtime secret store.",
    code: "// .env.staging\n// API_URL=https://staging.api.example.com\n\n// .env.production\n// API_URL=https://api.example.com\n\nimport Config from 'react-native-config';\nimport { useEffect } from 'react';\n\nexport default function useApiBase() {\n  useEffect(() => {\n    console.log('Using API base:', Config.API_URL);\n  }, []);\n\n  return Config.API_URL;\n}",
    interviewQuestion: "Why does changing a value in .env require a full native rebuild in React Native, and why shouldn't you store real secrets there?",
  },
  {
    id: "reactnative-orientation-handling",
    category: "reactnative",
    difficulty: "Intermediate",
    topic: "Device APIs",
    title: "How do you handle screen orientation changes in React Native?",
    summary: "Orientation can be locked natively per-platform (Info.plist/AndroidManifest) or read/reacted to at runtime via Dimensions or libraries like react-native-orientation-locker.",
    explanation: "By default RN apps support both orientations unless restricted in native config (`UISupportedInterfaceOrientations` on iOS, `android:screenOrientation` or runtime locking on Android). At the JS layer, `Dimensions.get('window')` gives current width/height, but the reliable way to react to orientation changes is subscribing to `Dimensions.addEventListener('change', ...)`, which fires when the layout dimensions actually change after rotation. For per-screen orientation locking (e.g., a video player screen forcing landscape), you typically need a native module like `react-native-orientation-locker` since pure JS can't force the device orientation. A tricky point interviewers probe: comparing width vs height to detect orientation is fragile on tablets/foldables, so checking `orientation` events or using `useWindowDimensions` (which re-renders automatically) is preferred over manual Dimensions polling.",
    code: "import { useWindowDimensions, View, Text } from 'react-native';\n\nexport default function OrientationAwareScreen() {\n  const { width, height } = useWindowDimensions();\n  const isLandscape = width > height;\n\n  return (\n    <View>\n      <Text>{isLandscape ? 'Landscape mode' : 'Portrait mode'}</Text>\n    </View>\n  );\n}",
    interviewQuestion: "Why is comparing Dimensions width and height an unreliable way to detect orientation on tablets, and what hook would you use instead to auto re-render on rotation?",
  },
  {
    id: "reactnative-biometric-auth",
    category: "reactnative",
    difficulty: "Intermediate",
    topic: "Security",
    title: "How do you implement Face ID / Touch ID biometric auth in React Native?",
    summary: "Libraries like react-native-biometrics or expo-local-authentication wrap native biometric APIs (LocalAuthentication on iOS, BiometricPrompt on Android) to authenticate users without a password.",
    explanation: "Biometric auth in RN always delegates to native OS frameworks — Apple's LocalAuthentication/Keychain and Android's BiometricPrompt/Keystore — because raw biometric data never leaves secure hardware enclaves; JS only receives a success/failure result. A robust flow checks `isSensorAvailable` first (device may lack biometrics or have none enrolled), then calls a prompt method, and pairs it with secure storage (Keychain/Keystore-backed, not AsyncStorage) to gate access to a stored token rather than 'authenticating' anything remotely by itself. A key interview nuance: biometric prompt success only proves local device possession/identity, not server-side authentication, so apps typically use it to unlock a securely stored refresh token rather than as a standalone login mechanism.",
    code: "import ReactNativeBiometrics from 'react-native-biometrics';\n\nconst rnBiometrics = new ReactNativeBiometrics();\n\nasync function unlockWithBiometrics() {\n  const { available, biometryType } = await rnBiometrics.isSensorAvailable();\n  if (!available) {\n    throw new Error('Biometrics not available on this device');\n  }\n\n  const { success } = await rnBiometrics.simplePrompt({\n    promptMessage: `Unlock with ${biometryType}`,\n  });\n\n  if (success) {\n    return getTokenFromSecureStorage();\n  }\n  throw new Error('Biometric authentication failed');\n}",
    interviewQuestion: "Does a successful Face ID prompt authenticate a user against your backend? Explain what biometric auth actually proves and how it's typically combined with token storage.",
  },
  {
    id: "reactnative-webview-postmessage-bridge",
    category: "reactnative",
    difficulty: "Intermediate",
    topic: "Native Modules",
    title: "How does the WebView postMessage bridge work in React Native?",
    summary: "react-native-webview lets JS running inside the embedded web page communicate with the RN app via a restricted postMessage-based bridge, not a shared JS context.",
    explanation: "A WebView runs an entirely separate JS engine (the platform's native web renderer) from your RN app's JS thread, so there's no direct function-call access between them — communication only happens through serialized string messages. From the web page side, calling `window.ReactNativeWebView.postMessage(string)` triggers the `onMessage` prop in RN; going the other direction, RN calls `webViewRef.current.postMessage(string)` or injects JavaScript via `injectJavaScript`, which the page can listen for via a `message` event. Because messages are strings, both sides typically JSON.stringify/parse structured payloads, and a common gotcha is that `injectJavaScript` runs once per call rather than persisting a listener, so apps often inject a script at load time that sets up a persistent `document.addEventListener('message', ...)` handler.",
    code: "import { WebView } from 'react-native-webview';\nimport { useRef } from 'react';\n\nexport default function EmbeddedCheckout() {\n  const webViewRef = useRef(null);\n\n  const handleMessage = (event) => {\n    const data = JSON.parse(event.nativeEvent.data);\n    if (data.type === 'CHECKOUT_COMPLETE') {\n      console.log('Order id:', data.orderId);\n    }\n  };\n\n  const sendToWebPage = () => {\n    webViewRef.current?.postMessage(JSON.stringify({ type: 'THEME', value: 'dark' }));\n  };\n\n  return (\n    <WebView\n      ref={webViewRef}\n      source={{ uri: 'https://checkout.example.com' }}\n      onMessage={handleMessage}\n    />\n  );\n}",
    interviewQuestion: "Why can't a WebView directly call a JS function defined in your React Native app, and how does data actually flow between the two contexts?",
  },
  {
    id: "reactnative-dark-mode-appearance-api",
    category: "reactnative",
    difficulty: "Intermediate",
    topic: "UI Components",
    title: "How does React Native detect and respond to system dark mode?",
    summary: "The Appearance API and useColorScheme hook let apps read the OS-level light/dark preference and subscribe to changes, enabling theme-aware styling.",
    explanation: "`Appearance.getColorScheme()` returns the current system preference ('light', 'dark', or null on older OS versions), and `useColorScheme()` is the hook form that automatically re-renders your component when the user toggles system theme, whether from Settings or Control Center on supported OS versions. Building a theme system typically wraps this in a Context provider so the color scheme choice — system, or a manual override the user picks in-app — is available app-wide without prop drilling, and persisted (e.g., via AsyncStorage) if you support manual override. A subtlety for interviews: on iOS, `Appearance` change events only fire while the app is in the foreground for apps not opted into background appearance updates, so a color scheme read at cold start can be stale if the OS theme changed while the app was backgrounded, until the next render/focus.",
    code: "import { useColorScheme, View, Text } from 'react-native';\n\nconst themes = {\n  light: { background: '#fff', text: '#111' },\n  dark: { background: '#111', text: '#fff' },\n};\n\nexport default function ThemedScreen() {\n  const scheme = useColorScheme(); // 'light' | 'dark' | null\n  const theme = themes[scheme ?? 'light'];\n\n  return (\n    <View style={{ flex: 1, backgroundColor: theme.background }}>\n      <Text style={{ color: theme.text }}>Follows system theme</Text>\n    </View>\n  );\n}",
    interviewQuestion: "How would you build an app-wide theme system that supports 'system', 'light', and 'dark' modes, with the user's manual choice persisted across launches?",
  },
  {
    id: "reactnative-virtualizedlist-internals",
    category: "reactnative",
    difficulty: "Advanced",
    topic: "Lists",
    title: "How does VirtualizedList decide what to render?",
    summary: "VirtualizedList maintains a sliding 'window' of rendered items around the current viewport, mounting and unmounting rows as the user scrolls.",
    explanation: "VirtualizedList is the engine behind FlatList and SectionList. It tracks the visible area plus an overscan region controlled by `windowSize` (measured in multiples of the viewport height) and only keeps items within that window mounted. As the user scrolls, it batches updates to add newly-visible cells and prune far-off-screen ones, using `initialNumToRender` for the first paint and `maxToRenderPerBatch`/`updateCellsBatchingPeriod` to throttle how much work happens per frame. Without `getItemLayout`, it must measure each cell's layout asynchronously after render, which can cause jumpy scroll-to-index behavior; providing fixed-height layouts upfront lets it skip measurement entirely. Interviewers often probe whether candidates understand that virtualization trades memory for potential blank-cell flicker during rapid scrolls, and that tuning these props is a real performance lever, not just boilerplate.",
    code: "import { FlatList } from 'react-native';\n\nconst ITEM_HEIGHT = 60;\n\nexport default function TunedList({ data }) {\n  return (\n    <FlatList\n      data={data}\n      keyExtractor={(item) => item.id}\n      renderItem={({ item }) => <Row item={item} />}\n      getItemLayout={(_, index) => ({\n        length: ITEM_HEIGHT,\n        offset: ITEM_HEIGHT * index,\n        index,\n      })}\n      initialNumToRender={10}\n      windowSize={5}\n      maxToRenderPerBatch={10}\n      removeClippedSubviews\n    />\n  );\n}",
    interviewQuestion: "Explain what windowSize and getItemLayout do internally in VirtualizedList, and why omitting getItemLayout can hurt scrollToIndex reliability.",
  },
  {
    id: "reactnative-app-size-optimization",
    category: "reactnative",
    difficulty: "Advanced",
    topic: "Performance",
    title: "How do you reduce React Native app binary size?",
    summary: "App size is reduced via Hermes bytecode precompilation, Android ProGuard/R8 code shrinking, ABI splitting, and stripping unused resources/assets.",
    explanation: "Hermes precompiles JS to bytecode at build time rather than shipping raw JS + a JIT, which both speeds up startup and reduces the JS payload compared to JSC. On Android, enabling ProGuard/R8 (`enableProguardInReleaseBuilds`) strips unused Java/Kotlin code and obfuscates/shrinks the native portion, while enabling `universalApk: false` / ABI splits (armeabi-v7a, arm64-v8a, x86_64) avoids shipping every CPU architecture's native libraries in a single APK — the Play Store's App Bundle format does this automatically per-device. On iOS, App Thinning/App Slicing already serves device-specific asset variants, but bitcode and unused asset catalogs still bloat the initial download if not managed. Beyond build config, the biggest wins are usually application-level: auditing bundled image assets (using WebP, proper resolution buckets), removing unused dependencies that pull in large native SDKs, and lazy-loading rarely-used screens/features instead of bundling everything into app startup.",
    code: "// android/app/build.gradle\n// def enableProguardInReleaseBuilds = true\n// android {\n//   splits {\n//     abi {\n//       enable true\n//       reset()\n//       include 'armeabi-v7a', 'arm64-v8a', 'x86', 'x86_64'\n//       universalApk false\n//     }\n//   }\n// }\n\n// Use WebP instead of large PNGs for illustrations\nimport { Image } from 'react-native';\n\nfunction Illustration() {\n  return <Image source={require('./assets/hero.webp')} style={{ width: 300, height: 200 }} />;\n}",
    interviewQuestion: "What concrete build-level and app-level changes would you make to shrink a bloated React Native release APK, and how does Hermes contribute to that?",
  },
  {
    id: "reactnative-fabric-renderer-overview",
    category: "reactnative",
    difficulty: "Advanced",
    topic: "New Architecture",
    title: "What is Fabric and how does it change React Native's rendering pipeline?",
    summary: "Fabric is React Native's new rendering system that replaces the old asynchronous bridge-based UIManager with a C++ core shared across platforms, enabling synchronous layout and more consistent threading.",
    explanation: "In the legacy architecture, the JS thread computes a shadow tree and sends serialized commands across the async bridge to the native UIManager, which then updates the real view hierarchy — this round-trip is a source of latency and race conditions for things like synchronous measurement. Fabric introduces a C++ implementation of the shadow tree that's shared by both iOS and Android, letting host platforms read layout results more directly and enabling features like synchronous, prioritized updates for high-priority interactions (e.g., text input, gestures) instead of always queuing through the async bridge. Fabric works together with the new JSI-based communication layer (rather than the JSON-serializing bridge) and TurboModules, so native calls avoid the batching/serialization overhead that historically made frequent bridge crossings expensive. For interview purposes, the key point is Fabric replaces *how views get created/updated*, whereas TurboModules replace *how native modules get invoked* — both ride on JSI but solve different parts of the old bridge bottleneck.",
    code: "// No app code changes are required to benefit from Fabric —\n// it's enabled at the native project level.\n// android/gradle.properties\n// newArchEnabled=true\n\n// ios/Podfile invocation\n// RCT_NEW_ARCH_ENABLED=1 bundle exec pod install\n\nimport { View, Text } from 'react-native';\n\n// Existing components render through Fabric transparently\n// once the new architecture is enabled at the native layer.\nexport default function Screen() {\n  return (\n    <View>\n      <Text>Rendered via Fabric's C++ shadow tree</Text>\n    </View>\n  );\n}",
    interviewQuestion: "What specifically does Fabric replace in the old React Native architecture, and how is its role different from TurboModules?",
  },
  {
    id: "reactnative-jsi-basics",
    category: "reactnative",
    difficulty: "Advanced",
    topic: "New Architecture",
    title: "What is JSI and why does it matter for React Native's new architecture?",
    summary: "JSI (JavaScript Interface) is a lightweight C++ API that lets JS code hold direct references to native C++ objects/functions, enabling synchronous calls without the old bridge's JSON serialization.",
    explanation: "The legacy bridge required every native call to be serialized to JSON, queued, and sent asynchronously across threads, which added latency and made synchronous native calls impossible — a real problem for things like measuring layout mid-render. JSI instead exposes native 'Host Objects' directly into the JS runtime (independent of whether that runtime is Hermes, JSC, or V8), so JS can invoke native C++ functions synchronously and pass rich object references instead of stringified payloads. This is the foundation both Fabric (rendering) and TurboModules (native modules) are built on: TurboModules use JSI to lazily create native module bindings on first access (instead of eagerly initializing every module at startup) and call them synchronously when needed. Libraries like Reanimated 2/3 also rely on JSI to run 'worklets' — small JS functions executed directly on the UI thread — which was impossible under the old bridge architecture since crossing the bridge per-frame was too slow for 60fps animations.",
    code: "// Conceptual illustration — JSI bindings are written in C++,\n// but this shows the effect from the JS side: synchronous,\n// no bridge serialization, callable during render/gesture handling.\n\nimport { runOnUI } from 'react-native-reanimated';\n\nfunction useDirectMeasure(animatedRef) {\n  const measure = () => {\n    'worklet';\n    // Executes synchronously on the UI thread via JSI,\n    // no async bridge round-trip required.\n    return measure(animatedRef);\n  };\n  return runOnUI(measure);\n}",
    interviewQuestion: "Why couldn't the old React Native bridge support synchronous native calls, and what does JSI change to make things like Reanimated worklets possible?",
  },
  {
    id: "reactnative-reanimated-worklets",
    category: "reactnative",
    difficulty: "Advanced",
    topic: "Animations",
    title: "What is a 'worklet' in react-native-reanimated?",
    summary: "A worklet is a small JS function marked with 'worklet' that Reanimated's Babel plugin compiles to run directly on the UI thread via JSI, bypassing the JS thread for animation frame updates.",
    explanation: "Normally all JS runs on the single JS thread, and driving animations from there means every frame update has to survive JS thread congestion (e.g., from network responses, list rendering) which causes jank. Reanimated's Babel plugin detects the `'worklet'` directive, serializes the function, and re-creates a runnable copy of it on a separate 'UI thread' JS context accessible via JSI, so gesture handlers and animation callbacks execute at native frame rates independent of what the main JS thread is doing. Worklets have restrictions: they close over variables by value (captured and copied at creation, not live references), can't freely call arbitrary JS-thread-only functions, and require `runOnJS` to safely hand control back to the JS thread (e.g., to call a React state setter or navigate). A classic interview trap: a candidate calls `setState` directly inside a worklet without `runOnJS`, which either errors or silently fails because React state updates must happen on the JS thread.",
    code: "import Animated, { useSharedValue, useAnimatedStyle, withSpring, runOnJS } from 'react-native-reanimated';\nimport { Gesture, GestureDetector } from 'react-native-gesture-handler';\n\nexport default function DraggableBox({ onDropped }) {\n  const translateX = useSharedValue(0);\n\n  const notifyDropped = (x) => onDropped(x); // runs on JS thread\n\n  const pan = Gesture.Pan()\n    .onUpdate((e) => {\n      translateX.value = e.translationX; // runs on UI thread\n    })\n    .onEnd(() => {\n      translateX.value = withSpring(0);\n      runOnJS(notifyDropped)(translateX.value); // hop back to JS thread\n    });\n\n  const style = useAnimatedStyle(() => ({\n    transform: [{ translateX: translateX.value }],\n  }));\n\n  return (\n    <GestureDetector gesture={pan}>\n      <Animated.View style={[{ width: 80, height: 80, backgroundColor: 'tomato' }, style]} />\n    </GestureDetector>\n  );\n}",
    interviewQuestion: "Why would calling a React state setter directly inside a Reanimated worklet be a problem, and how does runOnJS solve it?",
  },
  {
    id: "reactnative-accessibility-screen-reader-specifics",
    category: "reactnative",
    difficulty: "Tricky",
    topic: "Accessibility",
    title: "What are the key differences when supporting VoiceOver vs TalkBack in React Native?",
    summary: "Both screen readers consume the same accessibility props (accessible, accessibilityLabel, accessibilityRole) but differ in gesture navigation, focus announcement timing, and how live regions behave — props alone don't guarantee equivalent behavior.",
    explanation: "React Native exposes a cross-platform accessibility API (`accessible`, `accessibilityLabel`, `accessibilityRole`, `accessibilityState`, `accessibilityHint`) that maps to native accessibility trees — UIAccessibility on iOS for VoiceOver, and the AccessibilityNodeInfo API on Android for TalkBack — but the two screen readers don't behave identically on top of that shared API. VoiceOver reads `accessibilityHint` after a pause and supports the rotor for jumping between headings/links, while TalkBack has no direct hint equivalent and instead relies more heavily on `accessibilityRole` and explicit `accessibilityLabel` ordering. For dynamic content updates (e.g., an error message appearing), you need `AccessibilityInfo.announceForAccessibility()` for live-region-style announcements, whereas iOS often auto-announces focus changes when you programmatically move focus via `accessibilityElementsHidden`/`setAccessibilityFocus`-style refs. The trap most candidates fall into: they add the props, glance at the screen, and declare it 'accessible' — but reading order, focus traps in modals, and announcement timing are behaviors that only reveal themselves when you actually turn on VoiceOver or TalkBack and navigate by swipe, not by visual inspection.",
    code: "import { View, Text, AccessibilityInfo, Pressable } from 'react-native';\nimport { useEffect } from 'react';\n\nfunction ErrorBanner({ message }) {\n  useEffect(() => {\n    if (message) {\n      AccessibilityInfo.announceForAccessibility(message);\n    }\n  }, [message]);\n\n  return (\n    <View accessible accessibilityRole=\"alert\" accessibilityLabel={message}>\n      <Text>{message}</Text>\n    </View>\n  );\n}\n\nfunction SubmitButton({ onPress, disabled }) {\n  return (\n    <Pressable\n      onPress={onPress}\n      disabled={disabled}\n      accessibilityRole=\"button\"\n      accessibilityLabel=\"Submit form\"\n      accessibilityState={{ disabled }}\n    >\n      <Text>Submit</Text>\n    </Pressable>\n  );\n}",
    interviewQuestion: "You added accessibilityLabel to every element and it 'looks right' visually — what screen-reader-specific behaviors could still be broken that visual QA wouldn't catch?",
  },
  {
    id: "reactnative-testing-physical-devices-vs-simulators",
    category: "reactnative",
    difficulty: "Tricky",
    topic: "Testing",
    title: "What behaviors should you always verify on a physical device rather than a simulator?",
    summary: "Simulators/emulators don't accurately represent real performance, camera/biometric hardware, push notification delivery, or memory constraints, so certain classes of bugs only surface on real devices — and it's easy to sign off on a build that 'works' only because it was never tested on real hardware.",
    explanation: "iOS Simulators run x86/ARM binaries directly on your Mac's CPU with effectively unlimited memory and desktop-class performance, so JS thread jank, dropped frames, and memory-pressure crashes that appear on a three-year-old low-end Android phone often don't reproduce at all in an emulator. Hardware-dependent features are also frequently unavailable or faked in simulators: the iOS Simulator has no real camera (uses a static/fake feed), Face ID must be manually 'enrolled' via a menu toggle rather than genuinely testing the flow, and push notifications require either a physical device or workaround tooling since APNs doesn't deliver to simulators without simulated payloads. Additionally, real device testing surfaces platform fragmentation issues — different Android OEM skins altering permission dialogs, notification behavior, or background task killing (e.g., aggressive battery optimization on some Android vendors) — that a single emulator image can't represent. The tricky part interviewers are probing for: a team can ship a build that passed every simulator test and still crash in production on real hardware, because the simulator silently masks exactly the constraints (memory, thermal throttling, real sensors) that expose the bug.",
    code: "// Example: a perf regression that only shows on real devices\nimport { InteractionManager } from 'react-native';\nimport { useEffect, useState } from 'react';\n\nfunction HeavyScreen() {\n  const [ready, setReady] = useState(false);\n\n  useEffect(() => {\n    // On a simulator this feels instant; on a low-end Android\n    // device without InteractionManager gating, this heavy work\n    // would visibly block the transition animation.\n    const task = InteractionManager.runAfterInteractions(() => {\n      setReady(true);\n    });\n    return () => task.cancel();\n  }, []);\n\n  return ready ? <ExpensiveChart /> : <LoadingSpinner />;\n}",
    interviewQuestion: "Give three categories of bugs that reliably reproduce on a real low-end Android phone but not in an emulator, and explain why each is masked in the simulator environment.",
  },

{
    id: "nextjs-pages-vs-app-router-migration",
    category: "nextjs",
    difficulty: "Intermediate",
    topic: "Migration",
    title: "How do you migrate an app from the Pages Router to the App Router?",
    summary: "Next.js supports incremental migration, letting the pages/ and app/ directories coexist while routes are moved over one at a time.",
    explanation: "Because the App Router and Pages Router can run side by side, teams typically migrate route by route, starting with leaf routes that have few dependencies. Shared layout logic in _app.tsx and _document.tsx gets reimplemented as root layout.tsx, data fetching functions like getServerSideProps are replaced with async Server Components, and client-only libraries need 'use client' boundaries. API routes can stay in pages/api or move to app/api route handlers gradually. Common pitfalls include duplicate routing (a page existing in both directories throws a conflict error) and CSS/global style imports that must move to the new root layout.",
    code: "// Before: pages/blog/[slug].tsx\nexport async function getStaticProps({ params }) {\n  const post = await getPost(params.slug);\n  return { props: { post } };\n}\nexport default function Blog({ post }) {\n  return <article>{post.title}</article>;\n}\n\n// After: app/blog/[slug]/page.tsx\nexport default async function Blog({\n  params,\n}: {\n  params: Promise<{ slug: string }>;\n}) {\n  const { slug } = await params;\n  const post = await getPost(slug);\n  return <article>{post.title}</article>;\n}",
    interviewQuestion: "What strategy would you use to migrate a large production Next.js app from the Pages Router to the App Router without downtime?",
  },
  {
    id: "nextjs-legacy-data-fetching-methods",
    category: "nextjs",
    difficulty: "Basic",
    topic: "Data Fetching",
    title: "What are getServerSideProps and getStaticProps used for?",
    summary: "These are Pages Router functions for fetching data at request time (SSR) or build time (SSG) before rendering a page.",
    explanation: "getServerSideProps runs on every request on the server and is used when data must be fresh per-request, such as user-specific dashboards. getStaticProps runs at build time to pre-render static HTML, and can be paired with revalidate for ISR or getStaticPaths for dynamic static routes. Both only exist in the Pages Router; the App Router replaces them with async Server Components and fetch() caching options. Interviewers often ask this to confirm candidates understand legacy codebases they may inherit, even though new projects should use the App Router equivalents.",
    code: "// pages/products/[id].tsx\nexport async function getStaticPaths() {\n  const products = await getAllProductIds();\n  return { paths: products.map((id) => ({ params: { id } })), fallback: 'blocking' };\n}\n\nexport async function getStaticProps({ params }) {\n  const product = await getProduct(params.id);\n  return { props: { product }, revalidate: 60 };\n}\n\nexport default function ProductPage({ product }) {\n  return <h1>{product.name}</h1>;\n}",
    interviewQuestion: "In the Pages Router, when would you choose getServerSideProps over getStaticProps with revalidate?",
  },
  {
    id: "nextjs-revalidatepath-revalidatetag",
    category: "nextjs",
    difficulty: "Advanced",
    topic: "Caching",
    title: "What is the difference between revalidatePath and revalidateTag?",
    summary: "Both purge cached data on-demand in the App Router, but revalidatePath targets a specific route while revalidateTag invalidates all fetches sharing a cache tag.",
    explanation: "revalidatePath(path) clears the Next.js cache for a given route segment (and optionally its layout) so the next visit regenerates fresh HTML and data. revalidateTag(tag) is more granular and cross-cutting: any fetch() call anywhere in the app tagged with next: { tags: ['products'] } gets invalidated together, even if those fetches happen on completely different routes. This makes revalidateTag ideal for shared data like a product used on both a listing page and a detail page. Both functions must be called from a Server Action or Route Handler, not from client components or during rendering.",
    code: "// app/actions.ts\n'use server';\nimport { revalidateTag, revalidatePath } from 'next/cache';\n\nexport async function updateProduct(id: string, data: FormData) {\n  await db.product.update(id, data);\n  revalidateTag('products'); // invalidates every fetch tagged 'products'\n  revalidatePath(`/products/${id}`); // also refresh this specific page\n}\n\n// app/products/[id]/page.tsx\nasync function getProduct(id: string) {\n  const res = await fetch(`https://api.example.com/products/${id}`, {\n    next: { tags: ['products'] },\n  });\n  return res.json();\n}",
    interviewQuestion: "Your product catalog is fetched on both a homepage carousel and a category page. How would you invalidate the cache for that data everywhere at once after an admin edits a product?",
  },
  {
    id: "nextjs-edge-vs-node-runtime",
    category: "nextjs",
    difficulty: "Advanced",
    topic: "Runtime",
    title: "What is the difference between the Edge runtime and the Node.js runtime?",
    summary: "The Edge runtime is a lightweight V8-based environment that runs close to users with fast cold starts but limited APIs, while the Node.js runtime offers full Node compatibility.",
    explanation: "The Edge runtime, used by middleware by default and optionally by route handlers or pages, executes on infrastructure like Vercel's Edge Network, has near-instant cold starts, and supports Web APIs (fetch, Request, Response) but not Node-specific APIs like fs, native modules, or many npm packages that rely on Node internals. The Node.js runtime supports the full Node API surface, longer execution times, and larger memory limits, making it necessary for things like database drivers with native bindings or heavy image processing. You opt into a runtime per route segment with `export const runtime = 'edge' | 'nodejs'`. Choosing wrong causes either build errors (unsupported API on Edge) or unnecessarily slow cold starts (Node when Edge would suffice).",
    code: "// app/api/geo/route.ts\nexport const runtime = 'edge'; // fast, runs near the user\n\nexport async function GET(request: Request) {\n  const country = request.headers.get('x-vercel-ip-country') ?? 'unknown';\n  return Response.json({ country });\n}\n\n// app/api/report/route.ts\nexport const runtime = 'nodejs'; // needs fs / heavy libs\nimport { generatePdfReport } from '@/lib/pdf';\n\nexport async function POST(request: Request) {\n  const buffer = await generatePdfReport(await request.json());\n  return new Response(buffer, { headers: { 'Content-Type': 'application/pdf' } });\n}",
    interviewQuestion: "You have a route handler that uses a native Node PDF-generation library. Why would setting runtime = 'edge' break it, and how would you fix it?",
  },
  {
    id: "nextjs-loading-instant-states",
    category: "nextjs",
    difficulty: "Basic",
    topic: "Routing",
    title: "What does loading.tsx do in the App Router?",
    summary: "loading.tsx defines an instant loading UI that Next.js automatically wraps around a route segment in a React Suspense boundary while its data loads.",
    explanation: "When a loading.tsx file exists in a route segment, Next.js automatically shows it while the corresponding page.tsx (and any async Server Components it renders) are fetching data, without you manually adding a Suspense boundary. It enables instant navigation feedback since the previous page's layout stays interactive while the new segment streams in. This is built on React Suspense, so nested loading.tsx files create nested loading boundaries that only affect their own segment, not parent layouts. It's especially useful for perceived performance on slow data fetches like database queries or third-party API calls.",
    code: "// app/dashboard/loading.tsx\nexport default function Loading() {\n  return (\n    <div className=\"animate-pulse p-4\">\n      <div className=\"h-6 w-1/3 bg-gray-200 rounded mb-2\" />\n      <div className=\"h-4 w-full bg-gray-200 rounded\" />\n    </div>\n  );\n}\n\n// app/dashboard/page.tsx\nexport default async function Dashboard() {\n  const stats = await fetchDashboardStats(); // slow fetch\n  return <StatsPanel stats={stats} />;\n}",
    interviewQuestion: "How does loading.tsx achieve instant loading states without you writing any Suspense boundary code yourself?",
  },
  {
    id: "nextjs-not-found-notfound-fn",
    category: "nextjs",
    difficulty: "Intermediate",
    topic: "Routing",
    title: "How do not-found.tsx and the notFound() function work together?",
    summary: "Calling notFound() inside a Server Component throws a special error that Next.js catches to render the nearest not-found.tsx boundary with a 404 status.",
    explanation: "not-found.tsx is a convention file rendered whenever a route segment is unreachable or when code explicitly calls the notFound() function from next/navigation. Unlike returning null or custom JSX, notFound() correctly sets an HTTP 404 status code, which matters for SEO and correctness. You can nest not-found.tsx files per segment so a missing blog post shows a blog-specific 404 while a missing user profile shows a different one. It differs from the root not-found.tsx, which acts as the catch-all for any unmatched route in the whole app.",
    code: "// app/posts/[slug]/page.tsx\nimport { notFound } from 'next/navigation';\n\nexport default async function PostPage({\n  params,\n}: {\n  params: Promise<{ slug: string }>;\n}) {\n  const { slug } = await params;\n  const post = await getPost(slug);\n  if (!post) notFound();\n  return <article>{post.title}</article>;\n}\n\n// app/posts/[slug]/not-found.tsx\nexport default function PostNotFound() {\n  return <p>Sorry, this post doesn't exist.</p>;\n}",
    interviewQuestion: "Why should you call notFound() instead of just returning a 'Not found' JSX message directly from a page component?",
  },
  {
    id: "nextjs-nested-layouts",
    category: "nextjs",
    difficulty: "Basic",
    topic: "Routing",
    title: "How do nested layouts work in the App Router?",
    summary: "Every folder in app/ can have a layout.tsx that wraps its own page and all nested child segments, composing into a layout hierarchy without re-rendering on navigation.",
    explanation: "Layouts wrap the page content passed as the `children` prop and persist across navigations within the same segment, preserving component state like scroll position or open modals. Nested layouts compose: the root layout.tsx wraps everything, and a layout inside app/dashboard/layout.tsx wraps only dashboard routes, nesting inside the root layout. Because layouts don't re-render when navigating between sibling pages, they're ideal for persistent UI like sidebars or tab bars. Layouts cannot access route params of the page unless declared as dynamic segments themselves, and they cannot use hooks like usePathname without being a Client Component.",
    code: "// app/dashboard/layout.tsx\nexport default function DashboardLayout({\n  children,\n}: {\n  children: React.ReactNode;\n}) {\n  return (\n    <div className=\"flex\">\n      <aside className=\"w-64\">Sidebar</aside>\n      <main className=\"flex-1\">{children}</main>\n    </div>\n  );\n}\n\n// app/dashboard/settings/page.tsx renders inside DashboardLayout's <main>\nexport default function Settings() {\n  return <h1>Settings</h1>;\n}",
    interviewQuestion: "Why do sidebar and navigation components stay mounted (preserving their state) when a user navigates between pages that share a layout?",
  },
  {
    id: "nextjs-template-vs-layout",
    category: "nextjs",
    difficulty: "Tricky",
    topic: "Routing",
    title: "What is the difference between template.tsx and layout.tsx?",
    summary: "layout.tsx persists and preserves state across navigations, while template.tsx re-mounts fresh on every navigation, resetting state and re-running effects.",
    explanation: "Both wrap child segments identically in terms of JSX structure, but React treats them differently: layout.tsx keeps the same component instance across route changes within it, so useState and useEffect don't reset. template.tsx creates a brand-new component instance on every navigation, meaning state resets and effects re-fire, which is useful for enter/exit animations, per-navigation analytics events, or resetting a form when moving between sibling routes. A common tricky interview point is that you can have both a layout.tsx and a template.tsx in the same segment, and the template renders inside the layout as part of its children.",
    code: "// app/onboarding/template.tsx\n'use client';\nimport { useEffect } from 'react';\n\nexport default function OnboardingTemplate({\n  children,\n}: {\n  children: React.ReactNode;\n}) {\n  useEffect(() => {\n    console.log('step mounted'); // fires on every step navigation\n  }, []);\n  return <div className=\"transition-opacity animate-in\">{children}</div>;\n}",
    interviewQuestion: "You want a fade-in animation to replay every time a user moves between wizard steps, but a layout.tsx isn't re-running your useEffect. What convention file solves this, and why?",
  },
  {
    id: "nextjs-cookies-headers-apis",
    category: "nextjs",
    difficulty: "Intermediate",
    topic: "Server APIs",
    title: "How do you read and write cookies with the cookies() function?",
    summary: "cookies() and headers() are async Next.js server-only functions that give Server Components, Server Actions, and Route Handlers access to incoming request cookies and headers.",
    explanation: "cookies() returns a cookie store you can read from anywhere on the server, but you can only call .set() or .delete() from a Server Action or Route Handler, not from a plain Server Component render, because mutating cookies requires being inside a response-producing context. headers() is read-only and gives access to the incoming request's headers, useful for reading things like authorization tokens or user-agent for server-side logic. Both are async functions as of Next.js 15 and must be awaited. Reading cookies() or headers() inside a Server Component also opts that segment out of static rendering, since the response now depends on request-specific data.",
    code: "// app/actions.ts\n'use server';\nimport { cookies } from 'next/headers';\n\nexport async function setTheme(theme: string) {\n  const cookieStore = await cookies();\n  cookieStore.set('theme', theme, { httpOnly: true, path: '/' });\n}\n\n// app/page.tsx\nimport { cookies, headers } from 'next/headers';\n\nexport default async function Page() {\n  const cookieStore = await cookies();\n  const theme = cookieStore.get('theme')?.value ?? 'light';\n  const headerList = await headers();\n  const ua = headerList.get('user-agent');\n  return <div data-theme={theme}>Visiting from: {ua}</div>;\n}",
    interviewQuestion: "Why does calling cookies().set() inside a plain Server Component page render throw an error, while calling it inside a Server Action does not?",
  },
  {
    id: "nextjs-redirect-permanentredirect",
    category: "nextjs",
    difficulty: "Intermediate",
    topic: "Server APIs",
    title: "What is the difference between redirect() and permanentRedirect()?",
    summary: "redirect() issues a temporary (307/303) redirect while permanentRedirect() issues a permanent (308) redirect, and both work by throwing a special Next.js error caught internally.",
    explanation: "redirect() from next/navigation throws an internal NEXT_REDIRECT signal that Next.js intercepts to send a temporary redirect response, appropriate for things like redirecting after form validation or gating unauthenticated users. permanentRedirect() sends a 308 status, telling browsers and search engines to permanently update bookmarks and search index entries, appropriate for canonical URL changes like slug renames. Because both throw internally, calling them inside a try/catch block will incorrectly swallow the redirect unless you re-throw or avoid wrapping them. They can be called in Server Components, Server Actions, and Route Handlers, but not in Client Components (use the useRouter hook there instead).",
    code: "// app/actions.ts\n'use server';\nimport { redirect } from 'next/navigation';\n\nexport async function createPost(formData: FormData) {\n  const post = await db.post.create({ title: formData.get('title') });\n  redirect(`/posts/${post.id}`); // 307, throws internally\n}\n\n// app/old-slug/page.tsx\nimport { permanentRedirect } from 'next/navigation';\n\nexport default async function OldSlugPage() {\n  permanentRedirect('/new-slug'); // 308, SEO-safe permanent move\n}",
    interviewQuestion: "You wrap a call to redirect() inside a try/catch to handle database errors during a Server Action. What bug does this introduce, and why?",
  },
  {
    id: "nextjs-fetch-caching-semantics",
    category: "nextjs",
    difficulty: "Advanced",
    topic: "Data Fetching",
    title: "How does fetch() caching work by default in the App Router?",
    summary: "Next.js extends the native fetch API with caching options, letting you control whether a request is cached indefinitely, revalidated on an interval, or never cached at all.",
    explanation: "By default in recent Next.js versions, fetch requests are not cached (cache: 'no-store' behavior) unless explicitly opted in, though this has changed across versions so it's important to check the version's default. You control caching per-request with `{ cache: 'force-cache' }` for indefinite caching, `{ cache: 'no-store' }` for always-fresh dynamic data, or `{ next: { revalidate: N } }` for time-based ISR-style revalidation on that specific fetch. Tags via `{ next: { tags: [...] } }` let you group fetches for on-demand invalidation with revalidateTag. Using dynamic functions like cookies() or a no-store fetch anywhere in a route forces the whole route to render dynamically at request time instead of being statically generated.",
    code: "// Cached indefinitely until manually revalidated\nconst staticData = await fetch('https://api.example.com/config', {\n  cache: 'force-cache',\n});\n\n// Revalidated at most every 60 seconds (ISR-like)\nconst posts = await fetch('https://api.example.com/posts', {\n  next: { revalidate: 60 },\n});\n\n// Always fresh, fetched on every request\nconst liveStock = await fetch('https://api.example.com/stock', {\n  cache: 'no-store',\n});",
    interviewQuestion: "You have three fetch calls in the same page: one with cache: 'force-cache', one with revalidate: 60, and one with cache: 'no-store'. What rendering strategy does the overall page end up using, and why?",
  },
  {
    id: "nextjs-isr-deep-dive",
    category: "nextjs",
    difficulty: "Advanced",
    topic: "Rendering",
    title: "How does Incremental Static Regeneration actually work under the hood?",
    summary: "ISR serves a cached static page instantly while regenerating a fresh version in the background after the revalidate window expires, so no single user ever waits for a rebuild.",
    explanation: "When a request comes in after the revalidate period has elapsed, Next.js still serves the stale cached HTML immediately (stale-while-revalidate pattern) and kicks off regeneration in the background; only the next request after regeneration completes sees the fresh content. This means ISR pages can briefly serve outdated data but never block on rebuild latency, unlike SSR. For paths not generated at build time, `fallback: 'blocking'` (Pages Router) or dynamicParams behavior (App Router) determines whether an on-demand first request waits for generation or shows a fallback UI. On serverless platforms like Vercel, the regenerated page is persisted to the CDN edge so subsequent requests are served from cache without hitting the origin function again.",
    code: "// app/products/[id]/page.tsx\nexport const revalidate = 3600; // regenerate at most once per hour\n\nexport async function generateStaticParams() {\n  const products = await getTopProductIds();\n  return products.map((id) => ({ id }));\n}\n\nexport default async function ProductPage({\n  params,\n}: {\n  params: Promise<{ id: string }>;\n}) {\n  const { id } = await params;\n  const product = await getProduct(id); // uses the route's revalidate window\n  return <h1>{product.name}</h1>;\n}",
    interviewQuestion: "A user visits an ISR page 90 minutes after its last build with revalidate = 3600. What exact content do they see, and what happens behind the scenes for the next visitor?",
  },
  {
    id: "nextjs-static-vs-dynamic-rendering-decision",
    category: "nextjs",
    difficulty: "Intermediate",
    topic: "Rendering",
    title: "How does Next.js decide whether a route is statically or dynamically rendered?",
    summary: "Next.js statically renders a route at build time by default unless it detects usage of request-specific APIs or uncached data, in which case it switches to dynamic rendering at request time.",
    explanation: "During the build, Next.js analyzes each route segment: if it only uses cacheable fetches and no request-time APIs, it's prerendered as static HTML. Using dynamic functions like cookies(), headers(), or searchParams in a Server Component, or a fetch call marked cache: 'no-store', forces that entire route to opt into dynamic (server-rendered per-request) behavior. You can also force behavior explicitly with `export const dynamic = 'force-static' | 'force-dynamic' | 'auto'` at the segment level. This decision matters for performance and cost since static routes are served from CDN cache while dynamic routes invoke server compute on every request.",
    code: "// app/search/page.tsx\n// Reading searchParams makes this route dynamic automatically\nexport default async function SearchPage({\n  searchParams,\n}: {\n  searchParams: Promise<{ q?: string }>;\n}) {\n  const { q } = await searchParams;\n  const results = await search(q ?? '');\n  return <ResultsList results={results} />;\n}\n\n// Force a route to always be dynamic even without request APIs\nexport const dynamic = 'force-dynamic';",
    interviewQuestion: "You have a marketing page with zero dynamic data usage, but it's still rendering dynamically in production. What Next.js API usage would explain this, and how would you debug it?",
  },
  {
    id: "nextjs-draft-mode-preview",
    category: "nextjs",
    difficulty: "Advanced",
    topic: "Content",
    title: "What is Draft Mode used for in headless CMS setups?",
    summary: "Draft Mode lets editors preview unpublished CMS content on production statically-generated pages by temporarily switching that route to dynamic, uncached rendering.",
    explanation: "Draft Mode is enabled via a Route Handler that calls draftMode().enable(), typically triggered by a secret-protected preview URL from your CMS, and sets a cookie that persists for the browser session. While enabled, pages check draftMode().isEnabled to decide whether to fetch draft/unpublished content from the CMS instead of published content, and Next.js bypasses static caching for that request so changes appear immediately. This is the App Router evolution of the Pages Router's Preview Mode. It's important to validate the secret token in the enable route to prevent unauthorized users from viewing unpublished content.",
    code: "// app/api/draft/route.ts\nimport { draftMode } from 'next/headers';\nimport { redirect } from 'next/navigation';\n\nexport async function GET(request: Request) {\n  const { searchParams } = new URL(request.url);\n  if (searchParams.get('secret') !== process.env.DRAFT_SECRET) {\n    return new Response('Invalid token', { status: 401 });\n  }\n  const draft = await draftMode();\n  draft.enable();\n  redirect(searchParams.get('slug') ?? '/');\n}\n\n// app/posts/[slug]/page.tsx\nimport { draftMode } from 'next/headers';\n\nexport default async function Post({ params }: { params: Promise<{ slug: string }> }) {\n  const { isEnabled } = await draftMode();\n  const post = await getPost((await params).slug, { preview: isEnabled });\n  return <article>{post.title}</article>;\n}",
    interviewQuestion: "How would you let a content editor preview an unpublished CMS article on your statically generated blog without exposing it to the public?",
  },
  {
    id: "nextjs-opengraph-image-generation",
    category: "nextjs",
    difficulty: "Intermediate",
    topic: "Metadata",
    title: "How do you dynamically generate Open Graph images with opengraph-image.tsx?",
    summary: "Next.js can generate per-route OG images at runtime or build time using JSX and the ImageResponse API, avoiding the need to manually design static share images.",
    explanation: "Placing an opengraph-image.tsx (or .jpg/.png) file in a route segment auto-generates the appropriate meta tags and image for social sharing previews. The dynamic version exports a default function that returns an ImageResponse built from JSX and inline styles, similar to writing a tiny React component, which Next.js rasterizes to a PNG using Satori. You can access route params to personalize images, such as rendering a user's name or a blog post's title onto the generated image. The file also supports exporting `size` and `contentType` to control output dimensions, and a twitter-image.tsx sibling file works identically for Twitter card previews.",
    code: "// app/blog/[slug]/opengraph-image.tsx\nimport { ImageResponse } from 'next/og';\n\nexport const size = { width: 1200, height: 630 };\nexport const contentType = 'image/png';\n\nexport default async function Image({ params }: { params: Promise<{ slug: string }> }) {\n  const { slug } = await params;\n  const post = await getPost(slug);\n  return new ImageResponse(\n    (\n      <div style={{ fontSize: 64, background: '#000', color: '#fff', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>\n        {post.title}\n      </div>\n    ),\n    { ...size }\n  );\n}",
    interviewQuestion: "How would you generate a unique social sharing image per blog post that includes the post's title, without maintaining hundreds of static image files?",
  },
  {
    id: "nextjs-sitemap-robots-generation",
    category: "nextjs",
    difficulty: "Basic",
    topic: "Metadata",
    title: "How do you generate sitemap.xml and robots.txt in the App Router?",
    summary: "Next.js supports sitemap.ts and robots.ts convention files that programmatically generate SEO metadata files instead of hand-writing static XML/text files.",
    explanation: "A sitemap.ts file exports a default function returning an array of URL entries with optional lastModified, changeFrequency, and priority fields, and Next.js serves it at /sitemap.xml with the correct content type automatically. This is especially useful for dynamic sites where the sitemap needs to include every blog post or product fetched from a database at build or request time. robots.ts similarly exports rules for crawler access and can reference the generated sitemap URL. Both files can also be static (sitemap.xml, robots.txt placed directly in app/) for simple cases, but the .ts variants are preferred when content is dynamic.",
    code: "// app/sitemap.ts\nimport type { MetadataRoute } from 'next';\n\nexport default async function sitemap(): Promise<MetadataRoute.Sitemap> {\n  const posts = await getAllPosts();\n  const postEntries = posts.map((post) => ({\n    url: `https://example.com/blog/${post.slug}`,\n    lastModified: post.updatedAt,\n    changeFrequency: 'weekly' as const,\n    priority: 0.7,\n  }));\n  return [\n    { url: 'https://example.com', lastModified: new Date(), priority: 1 },\n    ...postEntries,\n  ];\n}\n\n// app/robots.ts\nexport default function robots() {\n  return {\n    rules: { userAgent: '*', allow: '/', disallow: '/admin' },\n    sitemap: 'https://example.com/sitemap.xml',\n  };\n}",
    interviewQuestion: "Your site has thousands of dynamically created product pages. How would you make sure they're all included in your sitemap without manually maintaining an XML file?",
  },
  {
    id: "nextjs-monorepo-turborepo-setup",
    category: "nextjs",
    difficulty: "Advanced",
    topic: "Tooling",
    title: "How do you structure a Next.js app inside a Turborepo monorepo?",
    summary: "Turborepo organizes multiple Next.js apps and shared packages (UI, config, types) in one repository with a task pipeline that caches builds and runs tasks in dependency order.",
    explanation: "A typical layout has an apps/ directory containing one or more Next.js apps and a packages/ directory containing shared code like a UI component library, ESLint config, or TypeScript config, each consumed via workspace references (e.g. \"@repo/ui\": \"workspace:*\") using pnpm or npm workspaces. turbo.json defines a pipeline describing task dependencies, such as build depending on ^build (build all dependencies first), enabling Turborepo to parallelize and cache tasks across the graph, only rebuilding what actually changed. Next.js apps in a monorepo need transpilePackages in next.config.js to compile TypeScript from internal workspace packages that aren't pre-built. This setup is common at companies running multiple Next.js apps (marketing site, dashboard, docs) that share design system code.",
    code: "// turbo.json\n{\n  \"$schema\": \"https://turbo.build/schema.json\",\n  \"pipeline\": {\n    \"build\": { \"dependsOn\": [\"^build\"], \"outputs\": [\".next/**\"] },\n    \"dev\": { \"cache\": false, \"persistent\": true }\n  }\n}\n\n// apps/web/next.config.js\n/** @type {import('next').NextConfig} */\nconst nextConfig = {\n  transpilePackages: ['@repo/ui'],\n};\nmodule.exports = nextConfig;",
    interviewQuestion: "You have three Next.js apps sharing a common design system package in a monorepo. How does Turborepo avoid rebuilding all three every time one line of shared UI code changes?",
  },
  {
    id: "nextjs-api-route-rate-limiting",
    category: "nextjs",
    difficulty: "Advanced",
    topic: "API",
    title: "How do you implement rate limiting on a Next.js Route Handler?",
    summary: "Rate limiting protects API routes from abuse by tracking request counts per identifier (IP, user, or API key) and rejecting requests that exceed a threshold within a time window.",
    explanation: "Since serverless functions are stateless and ephemeral, in-memory counters don't reliably work across invocations or regions, so production rate limiting typically uses an external store like Upstash Redis with a sliding-window or token-bucket algorithm. Middleware is a common place to enforce rate limits globally before a request even reaches a route handler, since it runs on the Edge with low latency. Libraries like @upstash/ratelimit pair with @vercel/kv or Upstash Redis to implement this declaratively. Interviewers care about this because naive in-memory Map-based limiters silently fail to protect anything once an app scales beyond a single server instance.",
    code: "// middleware.ts\nimport { Ratelimit } from '@upstash/ratelimit';\nimport { Redis } from '@upstash/redis';\nimport { NextResponse, type NextRequest } from 'next/server';\n\nconst ratelimit = new Ratelimit({\n  redis: Redis.fromEnv(),\n  limiter: Ratelimit.slidingWindow(10, '10 s'),\n});\n\nexport async function middleware(request: NextRequest) {\n  const ip = request.headers.get('x-forwarded-for') ?? '127.0.0.1';\n  const { success } = await ratelimit.limit(ip);\n  if (!success) {\n    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });\n  }\n  return NextResponse.next();\n}\n\nexport const config = { matcher: '/api/:path*' };",
    interviewQuestion: "Why is a simple in-memory Map used to count requests per IP an unreliable rate limiter for a Next.js app deployed on serverless infrastructure?",
  },
  {
    id: "nextjs-serverless-db-connection-pooling",
    category: "nextjs",
    difficulty: "Tricky",
    topic: "Database",
    title: "Why does database connection pooling behave differently in serverless Next.js deployments?",
    summary: "Each serverless function invocation can spin up a new isolated instance, so naive per-request database connections quickly exhaust a database's max connection limit under load.",
    explanation: "In a traditional long-running Node server, you create one connection pool at startup and reuse it for the app's lifetime. In serverless environments like Vercel functions, each cold-started instance may create its own pool, and with many concurrent invocations you can end up with far more connections than your database allows, causing 'too many connections' errors. Common fixes include using an external connection pooler like PgBouncer or Prisma Accelerate/Data Proxy that sits between your functions and the database, caching the Prisma/DB client instance on the global object to reuse it across warm invocations, and preferring HTTP-based serverless-friendly database drivers (like Neon's or PlanetScale's) that don't hold persistent TCP connections at all. This is a favorite 'gotcha' interview topic because it only manifests under production load, not local dev.",
    code: "// lib/db.ts\nimport { PrismaClient } from '@prisma/client';\n\nconst globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };\n\n// Reuse the client across warm serverless invocations instead of\n// creating a brand-new connection pool on every request.\nexport const prisma =\n  globalForPrisma.prisma ??\n  new PrismaClient({ datasourceUrl: process.env.DATABASE_POOL_URL });\n\nif (process.env.NODE_ENV !== 'production') {\n  globalForPrisma.prisma = prisma;\n}",
    interviewQuestion: "Your Next.js API routes work fine locally but throw 'too many connections' errors in production under traffic spikes. What's the likely cause and how do you fix it?",
  },
  {
    id: "nextjs-web-vitals-monitoring",
    category: "nextjs",
    difficulty: "Intermediate",
    topic: "Performance",
    title: "How do you measure and report Core Web Vitals in a Next.js app?",
    summary: "Next.js exposes a useReportWebVitals hook and built-in analytics integration to capture real-user metrics like LCP, CLS, and INP and send them to a monitoring service.",
    explanation: "The useReportWebVitals hook (App Router) or the exported reportWebVitals function (Pages Router) fires a callback with each metric's name, value, and id as it's measured in the real user's browser, letting you forward that data to an analytics endpoint, Vercel Analytics, or a tool like Google Analytics. Core Web Vitals include LCP (Largest Contentful Paint, loading performance), CLS (Cumulative Layout Shift, visual stability), and INP (Interaction to Next Paint, responsiveness, which replaced FID). Measuring real-user metrics (RUM) matters more than lab data (like Lighthouse) because it reflects actual device and network conditions across your user base. This hook must be used inside a Client Component.",
    code: "// app/components/web-vitals.tsx\n'use client';\nimport { useReportWebVitals } from 'next/web-vitals';\n\nexport function WebVitals() {\n  useReportWebVitals((metric) => {\n    if (metric.name === 'LCP' || metric.name === 'CLS' || metric.name === 'INP') {\n      navigator.sendBeacon(\n        '/api/analytics',\n        JSON.stringify({ name: metric.name, value: metric.value, id: metric.id })\n      );\n    }\n  });\n  return null;\n}\n\n// app/layout.tsx\nimport { WebVitals } from './components/web-vitals';\n\nexport default function RootLayout({ children }: { children: React.ReactNode }) {\n  return (\n    <html lang=\"en\">\n      <body>\n        <WebVitals />\n        {children}\n      </body>\n    </html>\n  );\n}",
    interviewQuestion: "How would you collect real-user Core Web Vitals data from production traffic in a Next.js app rather than relying only on Lighthouse audits in CI?",
  },
  {
    id: "nextjs-on-demand-revalidation-webhook",
    category: "nextjs",
    difficulty: "Advanced",
    topic: "Caching",
    title: "How do you set up on-demand ISR revalidation triggered by a CMS webhook?",
    summary: "A Route Handler can accept a webhook call from a headless CMS on content publish and call revalidatePath or revalidateTag to instantly refresh the corresponding cached page.",
    explanation: "Instead of waiting for a time-based revalidate window to expire, on-demand revalidation lets content updates propagate immediately: the CMS (Contentful, Sanity, etc.) is configured to POST to a Next.js Route Handler whenever content is published, and that handler validates a shared secret before calling revalidatePath(path) or revalidateTag(tag) for the affected content. This pattern combines the performance of static generation with near-real-time freshness, avoiding the tradeoff of picking a short revalidate interval just to reduce staleness. Validating the webhook secret is essential since this endpoint can force expensive regeneration if left open to abuse. It's common to revalidate by tag so a single content change invalidates every page referencing that entry.",
    code: "// app/api/revalidate/route.ts\nimport { revalidateTag } from 'next/cache';\nimport { NextRequest, NextResponse } from 'next/server';\n\nexport async function POST(request: NextRequest) {\n  const secret = request.headers.get('x-webhook-secret');\n  if (secret !== process.env.CMS_WEBHOOK_SECRET) {\n    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 });\n  }\n\n  const body = await request.json();\n  revalidateTag(`post-${body.slug}`);\n\n  return NextResponse.json({ revalidated: true, now: Date.now() });\n}",
    interviewQuestion: "Marketing wants blog edits in the CMS to appear on the live site within seconds, not minutes, without sacrificing static generation. How would you design that with Next.js?",
  },

{
    "id": "javascript-destructuring-edge-cases",
    "category": "javascript",
    "difficulty": "Intermediate",
    "topic": "Destructuring",
    "title": "What are the lesser-known edge cases of destructuring?",
    "summary": "Destructuring supports default values, renaming, nested patterns, and skipping elements, but has subtle pitfalls around undefined vs missing keys.",
    "explanation": "Default values in destructuring only apply when the extracted value is strictly undefined, not when it is null or any other falsy value. Nested destructuring throws a TypeError if an intermediate property is null or undefined, since you cannot destructure from it. Array destructuring can skip elements using empty commas, and you can swap variables in one line without a temp variable. Destructuring also works on function parameters directly, letting you pull named arguments out of an options object with defaults. Combining renaming and defaults together requires the syntax { propName: localName = defaultValue }.",
    "code": "const { a = 10 } = { a: null };\nconsole.log(a); // null, default NOT applied because value is not undefined\n\nconst { b = 20 } = {};\nconsole.log(b); // 20, default applied because key is missing\n\nconst [, second, , fourth] = [1, 2, 3, 4];\nconsole.log(second, fourth); // 2 4\n\nlet x = 1, y = 2;\n[x, y] = [y, x];\nconsole.log(x, y); // 2 1\n\nfunction greet({ name: userName = 'Guest' } = {}) {\n  console.log('Hello ' + userName);\n}\ngreet(); // Hello Guest",
    "interviewQuestion": "Why does `const { a = 5 } = { a: null }` result in `a` being null instead of 5, and how would you write a destructuring pattern that treats both null and undefined as missing?"
  },
  {
    "id": "javascript-polyfill-array-methods",
    "category": "javascript",
    "difficulty": "Advanced",
    "topic": "Polyfills",
    "title": "How would you implement your own Array.prototype.map, filter, and reduce?",
    "summary": "Polyfilling core array methods requires understanding how they iterate, skip holes, and pass the right callback arguments.",
    "explanation": "A correct polyfill for map must call the callback with (element, index, array), respect sparse array holes by skipping indices that were never assigned, and return a new array of the same length. filter similarly iterates but only pushes elements where the callback returns truthy, and must handle an empty result array. reduce is more complex because it needs to support an optional initial value; if omitted, the first array element becomes the accumulator and iteration starts from index 1, throwing a TypeError on an empty array with no initial value. All three methods should use Object.prototype.hasOwnProperty.call to properly skip holes in sparse arrays rather than treating them as undefined.",
    "code": "Array.prototype.myMap = function (callback, thisArg) {\n  const result = [];\n  for (let i = 0; i < this.length; i++) {\n    if (Object.prototype.hasOwnProperty.call(this, i)) {\n      result[i] = callback.call(thisArg, this[i], i, this);\n    }\n  }\n  return result;\n};\n\nArray.prototype.myReduce = function (callback, initialValue) {\n  let acc = initialValue;\n  let startIndex = 0;\n  if (acc === undefined) {\n    if (this.length === 0) throw new TypeError('Reduce of empty array with no initial value');\n    acc = this[0];\n    startIndex = 1;\n  }\n  for (let i = startIndex; i < this.length; i++) {\n    acc = callback(acc, this[i], i, this);\n  }\n  return acc;\n};\n\nconsole.log([1, 2, 3].myMap(n => n * 2)); // [2, 4, 6]\nconsole.log([1, 2, 3].myReduce((a, b) => a + b)); // 6",
    "interviewQuestion": "Implement Array.prototype.reduce from scratch, making sure it correctly handles the case where no initial value is provided and the array is empty."
  },
  {
    "id": "javascript-execution-context-scope-chain",
    "category": "javascript",
    "difficulty": "Advanced",
    "topic": "Execution Context",
    "title": "What is an execution context and how does the scope chain resolve variables?",
    "summary": "An execution context is the environment in which JS code runs, and the scope chain is the ordered list of scopes the engine checks when resolving a variable.",
    "explanation": "Every time a function is invoked, the engine creates a new execution context consisting of a variable environment, a lexical environment, and a reference to the outer environment (its closure). The scope chain is built at function definition time, not call time, because JavaScript uses lexical (static) scoping. When a variable is referenced, the engine looks it up first in the current execution context, then walks up through each outer lexical environment until it reaches the global scope, throwing a ReferenceError if not found anywhere. The call stack holds these execution contexts in order, with the global execution context at the bottom and the currently executing function context on top. Closures work precisely because a returned inner function retains a reference to its defining scopes lexical environment even after the outer function has returned.",
    "code": "function outer() {\n  const outerVar = 'I am outside!';\n  function inner() {\n    const innerVar = 'I am inside!';\n    console.log(innerVar); // resolved in inner's own scope\n    console.log(outerVar); // resolved by walking up the scope chain\n  }\n  return inner;\n}\n\nconst fn = outer();\nfn();\n// Scope chain for inner: inner -> outer -> global\n// Lexical scoping means this chain is fixed by WHERE inner is defined, not where fn() is called",
    "interviewQuestion": "Explain the difference between the call stack and the scope chain, and describe how JavaScript resolves a free variable inside a deeply nested function."
  },
  {
    "id": "javascript-arguments-vs-rest-params",
    "category": "javascript",
    "difficulty": "Intermediate",
    "topic": "Functions",
    "title": "How does the arguments object differ from rest parameters?",
    "summary": "The arguments object is an array-like, non-arrow-function-only construct, while rest parameters are true arrays available in any function and work with arrow functions.",
    "explanation": "The arguments object is available in regular functions and contains all passed arguments regardless of the declared parameters, but it is only array-like, meaning it lacks array methods like map or filter unless converted with Array.from or the spread operator. Arrow functions do not have their own arguments object; referencing arguments inside an arrow function looks it up in the enclosing non-arrow function scope. Rest parameters, declared with ...name as the last parameter, collect only the extra arguments not matched by named parameters into a real Array instance, giving direct access to all array methods. Rest parameters are also more explicit and readable, and they exclude arguments already captured by named parameters, unlike the arguments object which always contains everything passed in.",
    "code": "function regularFn() {\n  console.log(arguments); // Arguments(3) [1, 2, 3]\n  console.log(Array.isArray(arguments)); // false\n}\nregularFn(1, 2, 3);\n\nfunction withRest(first, ...rest) {\n  console.log(first); // 1\n  console.log(rest); // [2, 3] - a real array\n  console.log(Array.isArray(rest)); // true\n}\nwithRest(1, 2, 3);\n\nconst arrowFn = (...args) => {\n  console.log(args); // works fine, rest params supported\n};\narrowFn(1, 2, 3);",
    "interviewQuestion": "Why can you not use the arguments object inside an arrow function to get the arguments passed to that arrow function, and what would you use instead?"
  },
  {
    "id": "javascript-function-hoisting-vs-var-hoisting",
    "category": "javascript",
    "difficulty": "Intermediate",
    "topic": "Hoisting",
    "title": "How does function hoisting differ from var hoisting?",
    "summary": "Function declarations are hoisted with their full body and are callable before their definition line, while var declarations are hoisted but initialized as undefined.",
    "explanation": "During the creation phase of an execution context, function declarations are hoisted completely, meaning both the name and the function body are placed in memory, so you can call the function before its textual position in the code. In contrast, var declarations are hoisted but only the declaration itself is moved up, initialized to undefined; the assignment stays in place, so accessing the variable before the assignment line yields undefined rather than a ReferenceError. Function expressions and arrow functions assigned to a var are not hoisted like declarations, because only the var binding is hoisted, not the function value, so calling them early throws a TypeError since the value is undefined. When a var and a function declaration share the same name, the function declaration generally takes precedence during hoisting.",
    "code": "console.log(typeof hoistedFn); // 'function'\nhoistedFn(); // works fine\nfunction hoistedFn() {\n  console.log('called');\n}\n\nconsole.log(myVar); // undefined, not ReferenceError\nvar myVar = 5;\n\nconsole.log(typeof funcExpr); // 'undefined'\n// funcExpr(); // TypeError: funcExpr is not a function\nvar funcExpr = function () {\n  console.log('expr called');\n};",
    "interviewQuestion": "Why does calling a var-assigned function expression before its definition throw a TypeError, while calling a function declaration before its definition works fine?"
  },
  {
    "id": "javascript-void-operator",
    "category": "javascript",
    "difficulty": "Basic",
    "topic": "Operators",
    "title": "What does the void operator do and when is it used?",
    "summary": "void evaluates an expression and always returns undefined, historically used in href=\"javascript:void(0)\" links to prevent navigation.",
    "explanation": "The void operator takes any expression, evaluates it for its side effects, and always discards the result to return the primitive value undefined. Historically it was popular in anchor tags written as href=\"javascript:void(0)\" to make a link clickable without navigating anywhere, since the void(0) expression evaluates to undefined and produces no page navigation. It is also occasionally used to guarantee a genuine undefined value in older code, protecting against the fact that undefined used to be a reassignable global identifier before ES5 made it non-writable in the global scope. In modern module code, void is sometimes used before an IIFE, as in void function(){}(), to signal to the parser that the following function is an expression rather than a declaration, avoiding the need for wrapping parentheses. Its usage today is mostly a stylistic or legacy pattern rather than a necessity.",
    "code": "console.log(void 0); // undefined\nconsole.log(void 'hello'); // undefined, expression evaluated then discarded\n\n// Legacy pattern (avoid in modern code, use event.preventDefault() instead):\n// <a href=\"javascript:void(0)\">Click</a>\n\n// IIFE parsing trick:\nvoid function initApp() {\n  console.log('app initialized');\n}();\n\nlet sideEffect = 0;\nvoid (sideEffect = 5); // still runs the assignment, expression result discarded\nconsole.log(sideEffect); // 5",
    "interviewQuestion": "Why would a developer write `href=\"javascript:void(0)\"` on a link, and what is a more modern alternative to achieve the same effect?"
  },
  {
    "id": "javascript-isarray-vs-instanceof-array",
    "category": "javascript",
    "difficulty": "Intermediate",
    "topic": "Type Checking",
    "title": "Why is Array.isArray preferred over instanceof Array?",
    "summary": "Array.isArray correctly identifies arrays across different execution contexts like iframes, while instanceof Array fails because prototype chains differ per realm.",
    "explanation": "Each JavaScript realm, such as an iframe or a separate vm context in Node, has its own global object and therefore its own distinct Array constructor and Array.prototype. An array created in one iframe will not be an instanceof the Array constructor from another iframe, because instanceof checks whether the prototype in the constructors prototype property appears in the objects prototype chain, and the prototypes are different objects. Array.isArray, however, uses an internal slot check that identifies array exotic objects regardless of which realm created them, making it reliable across frames and contexts. Array.isArray also correctly returns false for array-like objects such as arguments or NodeLists, and true for arrays created via literals, the Array constructor, or Array.from. For this reason, Array.isArray has been the recommended way to check for arrays since ES5.",
    "code": "// Simulating cross-realm scenario conceptually:\nconst iframeArray = []; // imagine this came from another iframe's context\n\nconsole.log(Array.isArray(iframeArray)); // true, always reliable\nconsole.log(iframeArray instanceof Array); // true in same realm, but FALSE across realms\n\nfunction checkArgs() {\n  console.log(Array.isArray(arguments)); // false, arguments is array-like, not an array\n}\ncheckArgs(1, 2, 3);\n\nconsole.log(Array.isArray(Array.from({ length: 3 }))); // true",
    "interviewQuestion": "Why can `instanceof Array` return false for a genuine array passed from another iframe, and how does Array.isArray avoid that problem?"
  },
  {
    "id": "javascript-object-entries-keys-values-ordering",
    "category": "javascript",
    "difficulty": "Advanced",
    "topic": "Objects",
    "title": "What ordering guarantees do Object.keys, values, and entries provide?",
    "summary": "Own enumerable property enumeration order follows a specific spec-defined rule: integer-like keys first in ascending numeric order, then string keys in insertion order, then symbols.",
    "explanation": "The ECMAScript specification defines a precise ordinary object property enumeration order used by Object.keys, Object.values, Object.entries, JSON.stringify, and for...in for own properties. First come all keys that look like array indices, meaning non-negative integers when converted to and from a string without change, sorted in ascending numeric order regardless of insertion order. Next come all remaining string keys in the exact order they were inserted into the object. Finally, symbol keys are enumerated in their insertion order, though Object.keys, values, and entries skip symbols entirely since they only return string keys. This means numeric-looking keys can surprisingly appear before earlier-inserted string keys, a common source of bugs when objects are used as ordered maps.",
    "code": "const obj = {\n  b: 1,\n  2: 'two',\n  a: 3,\n  1: 'one',\n};\n\nconsole.log(Object.keys(obj));\n// ['1', '2', 'b', 'a'] - integer keys sorted numerically FIRST, then insertion order\n\nconst sym = Symbol('s');\nconst obj2 = { [sym]: 'symbol value', z: 1 };\nconsole.log(Object.keys(obj2)); // ['z'], symbols excluded\nconsole.log(Object.getOwnPropertySymbols(obj2)); // [Symbol(s)]",
    "interviewQuestion": "Given an object with mixed numeric-string keys and alphabetic keys inserted in a specific order, predict the exact output of Object.keys and explain the spec rule behind it."
  },
  {
    "id": "javascript-for-in-prototype-chain-pitfall",
    "category": "javascript",
    "difficulty": "Advanced",
    "topic": "Iteration",
    "title": "Why can for...in loops accidentally iterate over inherited enumerable properties?",
    "summary": "for...in walks the entire prototype chain and includes any enumerable properties found there, unlike for...of which only iterates iterable values.",
    "explanation": "The for...in statement enumerates all enumerable properties of an object, including those inherited via the prototype chain, not just the objects own properties. This becomes a bug source when a library or older code adds enumerable properties to Object.prototype or Array.prototype, since every plain object or array in the program will then show that property in a for...in loop. The conventional defense is to guard the loop body with an Object.prototype.hasOwnProperty.call check, or to prefer Object.keys combined with forEach, which only returns own enumerable string-keyed properties. for...of, by contrast, works entirely differently: it consumes the objects Symbol.iterator protocol and has nothing to do with enumerability or the prototype chain, which is why arrays, strings, Maps, and Sets work with it but plain objects do not unless explicitly made iterable.",
    "code": "Object.prototype.extra = 'polluted'; // bad practice, but illustrates the pitfall\n\nconst obj = { a: 1, b: 2 };\n\nfor (const key in obj) {\n  console.log(key); // 'a', 'b', 'extra' <- inherited property leaks in!\n}\n\nfor (const key in obj) {\n  if (Object.prototype.hasOwnProperty.call(obj, key)) {\n    console.log('own:', key); // 'own: a', 'own: b'\n  }\n}\n\ndelete Object.prototype.extra; // clean up the pollution",
    "interviewQuestion": "If a third-party script adds an enumerable property to Array.prototype, how would that affect a for...in loop over your own array, and how would you defend against it?"
  },
  {
    "id": "javascript-label-statements",
    "category": "javascript",
    "difficulty": "Basic",
    "topic": "Control Flow",
    "title": "What are labeled statements and how do break and continue use them?",
    "summary": "Labels let break and continue target a specific outer loop instead of only the innermost one, useful for escaping nested loops in one step.",
    "explanation": "A label is an identifier followed by a colon placed before a statement, most commonly a loop, which can then be referenced by break label or continue label. Without a label, break and continue only affect the innermost enclosing loop or switch, making it awkward to exit multiple nested loops at once, often requiring a flag variable. With a label, break outerLoop immediately exits the labeled loop entirely, while continue outerLoop skips to the next iteration of that labeled loop rather than the inner one. Labels are rarely used in modern JavaScript because they can hurt readability, and many linters flag them, but they remain valid syntax and occasionally appear in performance-sensitive nested-loop search code. Labels can technically be applied to any statement block, not just loops, though that usage is uncommon.",
    "code": "outerLoop: for (let i = 0; i < 3; i++) {\n  for (let j = 0; j < 3; j++) {\n    if (j === 1) continue outerLoop; // skips to next i, not just next j\n    if (i === 2) break outerLoop; // exits BOTH loops entirely\n    console.log(i, j);\n  }\n}\n// Output: 0 0 / 1 0\n\n// Without labels, you'd need a flag:\nlet found = false;\nfor (let i = 0; i < 3 && !found; i++) {\n  for (let j = 0; j < 3; j++) {\n    if (i === 1 && j === 1) { found = true; break; }\n  }\n}",
    "interviewQuestion": "How would you break out of two nested for loops entirely as soon as a condition is met, using a labeled statement, and why might a code reviewer flag this approach?"
  },
  {
    "id": "javascript-comma-operator",
    "category": "javascript",
    "difficulty": "Basic",
    "topic": "Operators",
    "title": "What does the comma operator do in JavaScript?",
    "summary": "The comma operator evaluates each of its operands left to right and returns the value of the last one, commonly seen in for-loop headers.",
    "explanation": "The comma operator, written as expr1, expr2, evaluates expr1 for its side effects, discards its result, then evaluates expr2 and returns that value as the overall expression result. It is most commonly seen in the update clause of a for loop, where you want to increment or modify multiple variables in a single statement, such as for (let i = 0, j = 10; i < j; i++, j--). It should not be confused with commas used to separate function arguments, array elements, or variable declarations in a single var/let/const statement, which are a different grammatical construct entirely, not the comma operator. Because it can make code harder to read, the comma operator is generally avoided outside of loop headers and certain minified or golfed code.",
    "code": "let x = (1, 2, 3);\nconsole.log(x); // 3, only the last value is kept\n\nfor (let i = 0, j = 10; i < 5; i++, j -= 2) {\n  console.log(i, j);\n}\n// 0 10 / 1 8 / 2 6 / 3 4 / 4 2\n\nfunction example() {\n  let a = 1;\n  return (a += 1, a += 2, a); // evaluates left to right, returns final value\n}\nconsole.log(example()); // 4",
    "interviewQuestion": "What does `let result = (console.log(\"a\"), console.log(\"b\"), 42)` assign to result, and in what order do the side effects run?"
  },
  {
    "id": "javascript-with-statement-why-avoided",
    "category": "javascript",
    "difficulty": "Advanced",
    "topic": "Language History",
    "title": "What does the with statement do and why is it avoided or banned in strict mode?",
    "summary": "with extends the scope chain with an objects properties, but makes variable resolution ambiguous and unoptimizable, so it is forbidden in strict mode.",
    "explanation": "The with statement takes an object and temporarily adds it to the front of the scope chain for the duration of its block, so bare identifiers inside are first looked up as properties of that object before falling back to the normal scope chain. This seemed convenient for reducing repetition when accessing many properties of the same object, but it makes static analysis of code effectively impossible, because the engine cannot know at parse time whether an identifier refers to a property on the with object or an outer variable until runtime. This ambiguity defeats compiler optimizations and creates subtle bugs, such as accidentally shadowing a global variable or a typo silently creating or reading the wrong property. Because of these problems, the with statement is entirely disallowed in strict mode and throws a SyntaxError if used, and its use in non-strict code is universally discouraged by style guides and linters. Destructuring assignment is the modern, safe replacement for the convenience with was meant to provide.",
    "code": "// Non-strict mode only, this throws a SyntaxError in strict mode:\nconst obj = { x: 1, y: 2 };\n\nwith (obj) {\n  console.log(x, y); // 1 2, resolved as obj.x and obj.y\n}\n\n// The ambiguity problem:\nlet x = 'outer';\nwith (obj) {\n  console.log(x); // 1, obj.x SHADOWS the outer x unexpectedly!\n}\n\n// Modern safe replacement:\nconst { x: objX, y: objY } = obj;\nconsole.log(objX, objY); // explicit, no ambiguity",
    "interviewQuestion": "Why is the with statement disallowed in strict mode, and what modern JavaScript feature achieves similar convenience without its downsides?"
  },
  {
    "id": "javascript-strict-mode-differences",
    "category": "javascript",
    "difficulty": "Intermediate",
    "topic": "Strict Mode",
    "title": "What behavioral differences does strict mode introduce compared to sloppy mode?",
    "summary": "Strict mode eliminates silent errors by throwing exceptions for common mistakes, changes this binding, and disables several problematic legacy features.",
    "explanation": "In strict mode, assigning to an undeclared variable throws a ReferenceError instead of silently creating a global variable, and attempting to write to a read-only or non-configurable property throws a TypeError instead of failing silently. Inside a regular function called without a receiver, this is undefined in strict mode rather than defaulting to the global object, which helps catch bugs where a method is accidentally detached from its object. Strict mode also disallows duplicate parameter names, disallows the with statement entirely, and makes eval create its own scope rather than leaking variables into the enclosing scope. ES6 modules and classes are automatically in strict mode without needing the \"use strict\" directive, which is why class methods that lose their this binding become undefined rather than the global object. Strict mode is enabled per-script or per-function by placing the \"use strict\" directive at the top, or automatically within any ES module or class body.",
    "code": "'use strict';\n\nfunction leaky() {\n  undeclaredVar = 5; // ReferenceError in strict mode\n}\n// leaky();\n\nfunction showThis() {\n  console.log(this); // undefined in strict mode when called bare\n}\nshowThis();\n\nconst frozen = Object.freeze({ x: 1 });\n// frozen.x = 2; // TypeError in strict mode, silently fails in sloppy mode\n\nclass AlwaysStrict {\n  method() {\n    'use strict'; // redundant, classes are always strict\n  }\n}",
    "interviewQuestion": "What happens when you assign to an undeclared variable inside a strict-mode function versus a sloppy-mode function, and why does this matter for catching bugs?"
  },
  {
    "id": "javascript-nan-comparison-quirks",
    "category": "javascript",
    "difficulty": "Basic",
    "topic": "Numbers",
    "title": "Why does NaN === NaN evaluate to false, and how do you correctly check for NaN?",
    "summary": "NaN is the only JavaScript value that is not equal to itself under both == and ===, so Number.isNaN or Object.is must be used to detect it reliably.",
    "explanation": "NaN, meaning Not a Number, follows the IEEE 754 floating point standard, which specifies that NaN is unordered and unequal to every value including itself, so NaN === NaN and NaN == NaN both evaluate to false. The global isNaN function coerces its argument to a number first, which causes surprising results like isNaN(\"hello\") returning true because the string cannot be converted to a number and becomes NaN. Number.isNaN, introduced in ES6, does not perform type coercion and only returns true if the argument is literally the NaN value already of type number, making it the safer and recommended check. Object.is(NaN, NaN) also correctly returns true, since Object.is uses the SameValue algorithm which treats NaN as equal to itself, unlike strict equality. Array.prototype.includes also uses SameValueZero internally, so [NaN].includes(NaN) returns true, whereas [NaN].indexOf(NaN) returns -1 because indexOf uses strict equality.",
    "code": "console.log(NaN === NaN); // false\nconsole.log(NaN == NaN); // false\n\nconsole.log(isNaN('hello')); // true, coerces 'hello' to NaN first (misleading!)\nconsole.log(Number.isNaN('hello')); // false, no coercion, 'hello' is not literally NaN\n\nconsole.log(Number.isNaN(NaN)); // true, the correct way\nconsole.log(Object.is(NaN, NaN)); // true\n\nconsole.log([NaN].includes(NaN)); // true, uses SameValueZero\nconsole.log([NaN].indexOf(NaN)); // -1, uses strict equality",
    "interviewQuestion": "Why does `isNaN(\"hello\")` return true while `Number.isNaN(\"hello\")` returns false, and which one should you use to reliably check if a variable holds NaN?"
  },
  {
    "id": "javascript-negative-zero-vs-zero",
    "category": "javascript",
    "difficulty": "Tricky",
    "topic": "Numbers",
    "title": "How does -0 differ from 0 in JavaScript, and when does it matter?",
    "summary": "Negative zero is a distinct IEEE 754 value that is === to positive zero but distinguishable via Object.is or 1/x, which rarely matters but can cause subtle bugs.",
    "explanation": "JavaScript numbers follow IEEE 754 double-precision floating point, which represents zero with a sign bit, producing two distinct bit patterns for positive and negative zero. Despite this, -0 === 0 and -0 == 0 both evaluate to true, and even Math.min(-0, 0) can behave unexpectedly since standard comparison treats them as equal. The values can be distinguished using Object.is(-0, 0), which returns false because Object.is implements the SameValue algorithm that does treat signed zeros as different, or by dividing 1 by the value: 1 / -0 yields -Infinity while 1 / 0 yields Infinity. Negative zero typically arises from multiplying or dividing by a negative number that results in a zero magnitude, such as -1 * 0 or 0 / -1. This distinction rarely matters in typical application code but can affect certain mathematical computations, canvas or graphics calculations, and has caused real bugs in libraries like Redux when using Object.is for state comparison in selectors.",
    "code": "console.log(-0 === 0); // true\nconsole.log(Object.is(-0, 0)); // false, they ARE different\n\nconsole.log(1 / 0); // Infinity\nconsole.log(1 / -0); // -Infinity, reveals the sign\n\nconsole.log(-1 * 0); // -0\nconsole.log(JSON.stringify(-0)); // '0', JSON hides the distinction\n\nconsole.log(Math.sign(-0)); // -0, not -1\nconsole.log([-0].includes(0)); // true, includes uses SameValueZero (treats -0 and 0 as same)",
    "interviewQuestion": "How would you write a function to reliably distinguish -0 from 0, given that both `===` and `==` treat them as equal?"
  },
  {
    "id": "javascript-floating-point-precision",
    "category": "javascript",
    "difficulty": "Intermediate",
    "topic": "Numbers",
    "title": "Why does 0.1 + 0.2 not equal 0.3 in JavaScript?",
    "summary": "JavaScript numbers use IEEE 754 double-precision floats, which cannot exactly represent most decimal fractions, causing small rounding errors in arithmetic.",
    "explanation": "JavaScript has only one number type for non-BigInt values, a 64-bit IEEE 754 double, which represents numbers in binary floating point rather than exact decimal form. Fractions like 0.1 and 0.2 have no exact finite representation in binary, similar to how 1/3 has no exact finite decimal representation, so they are stored as the closest possible approximation. When these approximations are added, the result is a value extremely close to but not exactly 0.3, specifically 0.30000000000000004, which fails a strict equality check against the literal 0.3. The standard workaround is to compare numbers within a small tolerance, often called an epsilon, using Math.abs(a - b) < Number.EPSILON or a custom threshold appropriate to the domain. For financial or precision-critical calculations, the recommended approach is to work in integer cents or use a dedicated arbitrary-precision decimal library rather than relying on floating point arithmetic directly.",
    "code": "console.log(0.1 + 0.2); // 0.30000000000000004\nconsole.log(0.1 + 0.2 === 0.3); // false\n\nfunction nearlyEqual(a, b, epsilon = Number.EPSILON) {\n  return Math.abs(a - b) < epsilon;\n}\nconsole.log(nearlyEqual(0.1 + 0.2, 0.3)); // true\n\n// Safer for money: work in integer cents\nconst priceInCents = 10 + 20; // 30 cents, exact\nconsole.log(priceInCents / 100); // 0.3",
    "interviewQuestion": "Why does `0.1 + 0.2 === 0.3` evaluate to false in JavaScript, and what is the standard pattern for comparing floating point numbers safely?"
  },
  {
    "id": "javascript-sparse-arrays-holes",
    "category": "javascript",
    "difficulty": "Advanced",
    "topic": "Arrays",
    "title": "What are sparse arrays and how do holes affect array method behavior?",
    "summary": "Sparse arrays have missing indices (holes) rather than undefined values, and many array methods like forEach and map skip holes entirely while others do not.",
    "explanation": "A sparse array is created when indices are skipped, such as new Array(3), deleting an element with delete arr[1], or explicitly setting arr.length beyond the current highest index, resulting in slots that have no assigned value at all rather than holding undefined. This is a subtle but important distinction: a hole is the complete absence of a property at that index, detectable via Object.prototype.hasOwnProperty, whereas an explicitly set undefined element does have that key present. Iteration methods like forEach, map, filter, and reduce all skip holes entirely, never invoking the callback for them, while map still preserves the hole in the resulting array. In contrast, more modern constructs like for...of, the spread operator, and Array.from treat holes as if they contained undefined, iterating over every index including holes. This inconsistency is a well-known gotcha, and console output like [1, <2 empty items>, 4] versus [1, undefined, undefined, 4] visually distinguishes holes from explicit undefined values in most environments.",
    "code": "const sparse = [1, , 3]; // hole at index 1\nconsole.log(sparse.length); // 3\nconsole.log(sparse.hasOwnProperty(1)); // false, it's a real hole\n\nsparse.forEach(x => console.log('forEach:', x)); // only logs for index 0 and 2, skips hole\n\nconst mapped = sparse.map(x => x * 2);\nconsole.log(mapped); // [2, <1 empty item>, 6], hole preserved\n\nfor (const val of sparse) {\n  console.log('for...of:', val); // logs 1, undefined, 3 -- treats hole as undefined!\n}\n\nconsole.log([...sparse]); // [1, undefined, 3], spread also fills holes with undefined",
    "interviewQuestion": "Given a sparse array `[1, , 3]`, explain why `forEach` skips the hole entirely but `for...of` and the spread operator treat it as undefined."
  },
  {
    "id": "javascript-string-normalize",
    "category": "javascript",
    "difficulty": "Advanced",
    "topic": "Strings",
    "title": "What does String.prototype.normalize do and why is it needed for string comparison?",
    "summary": "normalize() converts a string to a consistent Unicode normalization form, ensuring visually identical strings built from different code point sequences compare as equal.",
    "explanation": "Unicode allows certain characters, especially accented letters, to be represented in more than one way: as a single precomposed code point, such as e-acute, or as a base character followed by a combining diacritical mark, such as e followed by a combining acute accent. These two representations render identically on screen but are different sequences of code points, so a strict equality check between them returns false even though they look the same to a user. String.prototype.normalize(form) rewrites a string into one of four standard normalization forms: NFC, which composes characters into precomposed form and is the most common default, NFD, which decomposes into base plus combining marks, and NFKC and NFKD which additionally apply compatibility decompositions for things like ligatures or full-width characters. Calling normalize with the same form on both strings before comparing ensures that visually and semantically identical strings compare as equal, which matters for search, form validation, deduplication, and any system that receives text from different input methods or operating systems. This is a common real-world bug source in international applications, particularly for text originating from macOS, which tends to favor NFD, versus Windows or web forms, which tend to favor NFC.",
    "code": "const composed = '\\u00e9'; // 'é' as a single precomposed code point\nconst decomposed = 'e\\u0301'; // 'e' + combining acute accent, renders as 'é'\n\nconsole.log(composed === decomposed); // false! Different code point sequences\nconsole.log(composed.length, decomposed.length); // 1, 2\n\nconsole.log(composed.normalize('NFC') === decomposed.normalize('NFC')); // true\nconsole.log(composed.normalize('NFD') === decomposed.normalize('NFD')); // true\n\n// Real-world use: comparing user search input against stored data\nfunction safeEquals(a, b) {\n  return a.normalize('NFC') === b.normalize('NFC');\n}",
    "interviewQuestion": "Two strings that look visually identical fail a strict equality check when one comes from a macOS text field and the other from a database. What Unicode issue is likely at play, and how would you fix the comparison?"
  },
  {
    "id": "javascript-object-hasown-vs-hasownproperty",
    "category": "javascript",
    "difficulty": "Intermediate",
    "topic": "Objects",
    "title": "Why was Object.hasOwn introduced when Object.prototype.hasOwnProperty already existed?",
    "summary": "Object.hasOwn is a safer static alternative to obj.hasOwnProperty that works correctly even on objects created with Object.create(null) or that have overridden hasOwnProperty.",
    "explanation": "Object.prototype.hasOwnProperty(key) is normally called as obj.hasOwnProperty(key), but this fails if obj was created with Object.create(null), since such an object has no prototype chain at all and therefore does not inherit the hasOwnProperty method, throwing a TypeError when called directly. It also fails or behaves incorrectly if the object defines its own property literally named hasOwnProperty that shadows the inherited method, a subtle and real footgun when working with untrusted or dynamic data shapes. The traditional defensive workaround was to call Object.prototype.hasOwnProperty.call(obj, key), explicitly borrowing the method and setting this to the target object, which works reliably but is verbose and easy to forget. Object.hasOwn(obj, key), introduced in ES2022, is a static method that performs the equivalent safe check without needing the call/borrowing pattern, and it works correctly on null-prototype objects, proxies, and objects with a shadowed hasOwnProperty property. It is now the recommended idiom for checking own-property existence in modern JavaScript.",
    "code": "const nullProtoObj = Object.create(null);\nnullProtoObj.key = 'value';\n\n// nullProtoObj.hasOwnProperty('key'); // TypeError: hasOwnProperty is not a function\n\nconsole.log(Object.hasOwn(nullProtoObj, 'key')); // true, works safely\n\nconst shadowed = { hasOwnProperty: () => 'gotcha!', real: 1 };\nconsole.log(shadowed.hasOwnProperty('real')); // 'gotcha!' -- shadowed, unreliable!\nconsole.log(Object.hasOwn(shadowed, 'real')); // true, correct regardless of shadowing\n\n// Old defensive pattern, now largely replaced by Object.hasOwn:\nconsole.log(Object.prototype.hasOwnProperty.call(shadowed, 'real')); // true",
    "interviewQuestion": "Why would calling `obj.hasOwnProperty(key)` throw a TypeError for an object created with `Object.create(null)`, and how does `Object.hasOwn` avoid this problem?"
  },
  {
    "id": "javascript-structuredclone-limitations",
    "category": "javascript",
    "difficulty": "Advanced",
    "topic": "Cloning",
    "title": "What are the limitations of structuredClone for deep copying objects?",
    "summary": "structuredClone deep-copies most data types including circular references, but cannot clone functions, DOM nodes, class instances with prototype methods, or property accessors.",
    "explanation": "structuredClone implements the structured clone algorithm used internally by the browser for postMessage and IndexedDB, and it correctly deep-copies plain objects, arrays, Maps, Sets, Dates, RegExp, typed arrays, and even objects containing circular references, which JSON.parse(JSON.stringify()) cannot handle at all. However, it explicitly throws a DataCloneError when asked to clone functions, since functions cannot be serialized, and it cannot clone DOM nodes in most contexts, Error objects lose their prototype chain information in some implementations, and class instances lose their prototype, meaning the clone becomes a plain object with the same own properties but without the original classes methods. Getters, setters, and non-enumerable properties are also not preserved, since the algorithm clones the current data values rather than the property descriptors or accessor logic. For objects requiring custom clone behavior, such as class instances that must retain their methods, a manual clone method or a library like lodashs cloneDeep with custom customizer functions remains necessary.",
    "code": "class Point {\n  constructor(x, y) { this.x = x; this.y = y; }\n  distanceFromOrigin() { return Math.sqrt(this.x ** 2 + this.y ** 2); }\n}\n\nconst p = new Point(3, 4);\nconst cloned = structuredClone(p);\nconsole.log(cloned); // { x: 3, y: 4 } -- plain object now\nconsole.log(cloned instanceof Point); // false, lost the class prototype\n// cloned.distanceFromOrigin(); // TypeError: not a function\n\n// Circular references work fine, unlike JSON:\nconst circular = { name: 'a' };\ncircular.self = circular;\nconst clonedCircular = structuredClone(circular);\nconsole.log(clonedCircular.self === clonedCircular); // true\n\n// Functions throw:\n// structuredClone({ fn: () => {} }); // DataCloneError",
    "interviewQuestion": "You use structuredClone to copy an instance of a custom class and find that its methods are gone afterward. Why does this happen, and how would you deep-clone the instance while preserving its class methods?"
  },
  {
    "id": "javascript-promise-any-vs-race",
    "category": "javascript",
    "difficulty": "Intermediate",
    "topic": "Promises",
    "title": "How does Promise.any differ from Promise.race?",
    "summary": "Promise.any resolves with the first fulfilled promise and ignores rejections until all fail, while Promise.race settles with whichever promise finishes first, success or failure.",
    "explanation": "Promise.race(promises) settles as soon as any one of the input promises settles, whether that settlement is a fulfillment or a rejection, meaning if the fastest promise happens to reject, the whole race rejects with that reason even if a slower promise would have succeeded. Promise.any(promises), introduced in ES2021, specifically waits for the first fulfillment and ignores rejections as they come in, only rejecting itself if every single input promise rejects, in which case it rejects with an AggregateError containing all the individual rejection reasons. This makes Promise.any ideal for scenarios like querying multiple redundant mirror servers and wanting the fastest successful response while tolerating some servers being down, whereas Promise.race is better suited for implementing timeouts, racing a real operation against a timer promise that rejects after a deadline. Both differ from Promise.all, which waits for every promise to fulfill and rejects immediately on the first rejection, and Promise.allSettled, which waits for all promises regardless of outcome and never rejects itself.",
    "code": "const slowFail = new Promise((_, reject) => setTimeout(() => reject('fast fail'), 10));\nconst slowSuccess = new Promise((resolve) => setTimeout(() => resolve('slow success'), 50));\n\nPromise.race([slowFail, slowSuccess])\n  .then(console.log)\n  .catch(err => console.log('race rejected:', err)); // 'race rejected: fast fail'\n\nPromise.any([slowFail, slowSuccess])\n  .then(console.log) // 'slow success' -- ignores the earlier rejection!\n  .catch(err => console.log('any rejected:', err));\n\nPromise.any([Promise.reject('a'), Promise.reject('b')])\n  .catch(err => console.log(err instanceof AggregateError, err.errors)); // true ['a','b']",
    "interviewQuestion": "If the fastest of three concurrent promises rejects but a slower one would eventually succeed, what does Promise.race do versus Promise.any, and when would you choose each?"
  },
  {
    "id": "javascript-top-level-await",
    "category": "javascript",
    "difficulty": "Intermediate",
    "topic": "Modules",
    "title": "What is top-level await and what restrictions apply to it?",
    "summary": "Top-level await allows using await outside an async function at the top of an ES module, but it delays the module and its importers until the awaited promise settles.",
    "explanation": "Top-level await, standardized in ES2022, permits the await keyword to be used directly in the top-level scope of an ES module without wrapping it in an async function, which is useful for initializing a module with asynchronous data such as fetching configuration or dynamically importing a dependency based on runtime conditions. It is only available inside ES modules, meaning the file must be loaded with type=\"module\" in the browser or have a .mjs extension or \"type\": \"module\" in package.json in Node, and it is not permitted in CommonJS modules or regular synchronous scripts. A crucial consequence is that any module which imports a module using top-level await will itself wait for that await to resolve before its own top-level code continues executing, since the module graphs evaluation phase becomes asynchronous, which can introduce unexpected loading delays in a deep dependency graph. Top-level await also enables patterns like conditionally importing different polyfills or platform-specific implementations before the rest of the module code runs.",
    "code": "// config.mjs\nconst response = await fetch('https://api.example.com/config');\nconst config = await response.json();\nexport default config;\n\n// main.mjs -- this module's execution is delayed until config.mjs's await resolves\nimport config from './config.mjs';\nconsole.log('config loaded:', config);\n\n// Conditional dynamic import pattern:\nconst strings = await (navigator.language === 'fr'\n  ? import('./lang-fr.mjs')\n  : import('./lang-en.mjs'));",
    "interviewQuestion": "If module A uses top-level await to fetch data, and module B imports module A, how does that affect when module B's own top-level code starts executing?"
  },
  {
    "id": "javascript-microtask-starvation",
    "category": "javascript",
    "difficulty": "Tricky",
    "topic": "Event Loop",
    "title": "What is microtask starvation and how can it freeze an application?",
    "summary": "Microtask starvation occurs when microtasks like resolved promises keep queuing more microtasks, preventing the event loop from ever reaching the next macrotask, freezing rendering and I/O.",
    "explanation": "The JavaScript event loop fully drains the entire microtask queue, which includes resolved Promise callbacks and queueMicrotask calls, after every single synchronous task or macrotask before it is allowed to proceed to the next macrotask, such as a setTimeout callback, an I/O event, or a UI repaint in browsers. If a microtask callback recursively schedules another microtask, for example a promise .then handler that immediately queues a new .then on another already-resolved promise in an infinite loop, the microtask queue never actually empties, meaning the event loop is stuck perpetually draining microtasks and never yields control to render frames, handle user input, or fire timers. This is called microtask starvation, and it is a genuine way to freeze a browser tab or a Node.js process despite the code being technically asynchronous and non-blocking in the traditional single long-running-function sense. The fix is to periodically yield back to the macrotask queue using setTimeout(fn, 0), requestAnimationFrame, or MessageChannel-based scheduling to break up long chains of self-perpetuating microtask work.",
    "code": "// DANGER: this will freeze the page/process, never actually run it unattended\nfunction starve() {\n  Promise.resolve().then(starve); // recursively re-queues a microtask forever\n}\n// starve(); // event loop never reaches setTimeout callbacks or repaints again\n\nsetTimeout(() => console.log('this will NEVER run if starve() is active'), 0);\n\n// The fix: yield to the macrotask queue periodically\nfunction healthyLoop(i = 0) {\n  if (i > 1000000) return;\n  // do some microtask-scale work here\n  setTimeout(() => healthyLoop(i + 1), 0); // yields control back to the event loop\n}",
    "interviewQuestion": "How could a chain of Promise .then() callbacks that keep re-queuing themselves cause a web page to become completely unresponsive, even though no single synchronous function is blocking for long?"
  },
  {
    "id": "javascript-new-keyword-mechanics",
    "category": "javascript",
    "difficulty": "Advanced",
    "topic": "Objects",
    "title": "What exactly happens step by step when you use the new keyword?",
    "summary": "The new operator creates a fresh object linked to the constructors prototype, binds this to it, runs the constructor body, and returns the new object unless the constructor explicitly returns another object.",
    "explanation": "When new Constructor(args) is evaluated, the engine first creates a brand-new, empty plain object. Second, it sets that new objects internal [[Prototype]] link to point to Constructor.prototype, which is why instances created by the same constructor share access to methods defined on that prototype object. Third, the constructor function is invoked with this bound to the newly created object, and the provided arguments are passed in as usual, executing the constructors body which typically assigns properties onto this. Fourth and finally, if the constructor function explicitly returns an object, that returned object becomes the overall result of the new expression instead of the object created in step one, but if the constructor returns a primitive value or nothing, the originally created object from step one is returned regardless. You can replicate this entire process manually using Object.create(Constructor.prototype) followed by Constructor.call(newObj, args), which is essentially what Reflect.construct does internally.",
    "code": "function Person(name) {\n  this.name = name;\n  // implicit: return this; (unless we return an object explicitly)\n}\nPerson.prototype.greet = function () {\n  return `Hi, I'm ${this.name}`;\n};\n\n// Manual step-by-step reimplementation of `new Person('Sai')`:\nfunction myNew(Constructor, ...args) {\n  const obj = Object.create(Constructor.prototype); // step 1 & 2\n  const result = Constructor.apply(obj, args); // step 3\n  return typeof result === 'object' && result !== null ? result : obj; // step 4\n}\n\nconst p1 = new Person('Sai');\nconst p2 = myNew(Person, 'Sai');\nconsole.log(p1.greet(), p2.greet()); // both work identically\nconsole.log(p1 instanceof Person, p2 instanceof Person); // true true\n\nfunction WeirdConstructor() {\n  this.a = 1;\n  return { b: 2 }; // explicit object return overrides the new instance\n}\nconsole.log(new WeirdConstructor()); // { b: 2 }, NOT { a: 1 }",
    "interviewQuestion": "Write a function that manually replicates what the `new` keyword does, and explain what happens if the constructor function explicitly returns an object versus a primitive value."
  },
  {
    "id": "javascript-memory-leaks-closures-detached-dom",
    "category": "javascript",
    "difficulty": "Tricky",
    "topic": "Memory Management",
    "title": "How do closures and detached DOM nodes commonly cause memory leaks in JavaScript?",
    "summary": "Closures that capture large data or DOM references, plus event listeners left attached to removed elements, are two of the most common sources of memory leaks in long-running JS apps.",
    "explanation": "A closure keeps its entire enclosing lexical environment alive for as long as the closure itself is reachable, so if a long-lived closure, such as an event handler attached to a global object or a setInterval callback, incidentally captures a reference to a large object or an entire DOM subtree, that memory cannot be reclaimed even if the rest of the code no longer needs it. A detached DOM node is an element that has been removed from the document tree via removeChild or innerHTML replacement, but is still referenced somewhere in JavaScript, such as in an array cache or, very commonly, inside an event listener closure, which prevents the browsers garbage collector from reclaiming the memory for that entire node subtree despite it no longer being visible or part of the page. The classic fix is to always call removeEventListener before discarding a DOM node when the listener was attached with a named function, or to use patterns like AbortController with a shared signal to cleanly remove many listeners at once, and to explicitly null out large object references held in long-lived closures once they are no longer needed. Modern DevTools memory profilers, specifically heap snapshots, are the standard tool for diagnosing these leaks by searching for detached DOM tree nodes that remain retained in memory.",
    "code": "// LEAK: closure keeps a giant array alive forever via the interval callback\nfunction startLeakyTimer() {\n  const hugeData = new Array(1_000_000).fill('leak');\n  setInterval(() => {\n    console.log(hugeData.length); // closure retains hugeData forever\n  }, 10000);\n}\n\n// LEAK: detached DOM node kept alive by a listener reference in an array\nconst detachedNodes = [];\nfunction attachAndRemove() {\n  const el = document.createElement('div');\n  el.addEventListener('click', () => console.log('clicked'));\n  detachedNodes.push(el); // el is removed from DOM but still referenced here, and by the listener closure\n  document.body.removeChild(el);\n}\n\n// FIX: explicitly clean up references and listeners\nfunction cleanupProperly(el, handler) {\n  el.removeEventListener('click', handler);\n  el = null; // release the reference so GC can reclaim it\n}",
    "interviewQuestion": "A single-page app grows slower over time as users navigate between views, and a heap snapshot shows many detached DOM nodes retained in memory. What are two common coding patterns that cause this, and how would you fix them?"
  },

{
    id: 'typescript-distributive-conditional-types',
    category: 'typescript',
    difficulty: 'Advanced',
    topic: 'Conditional Types',
    title: 'What are distributive conditional types?',
    summary: 'When a conditional type checks against a naked type parameter and that parameter is a union, TypeScript applies the conditional to each member of the union separately.',
    explanation: 'Distribution only happens when the checked type is a bare, unwrapped generic parameter (e.g. `T extends U ? X : Y`). If you wrap `T` in a tuple like `[T] extends [U]`, distribution is suppressed and the union is treated as a single type. This behavior underlies utilities like `Exclude` and `Extract`, which rely on the union splitting apart, running the conditional on each member, then re-joining the results. Understanding when distribution triggers versus when it is opted out of is a common source of subtle bugs in generic library code.',
    code: `type ToArray<T> = T extends any ? T[] : never;

type A = ToArray<string | number>; // string[] | number[]

// Suppressing distribution with a tuple wrapper
type ToArrayNonDist<T> = [T] extends [any] ? T[] : never;
type B = ToArrayNonDist<string | number>; // (string | number)[]`,
    interviewQuestion: 'Explain why `ToArray<string | number>` produces `string[] | number[]` instead of `(string | number)[]`, and how you would prevent that distribution.',
  },
  {
    id: 'typescript-recursive-conditional-accumulator',
    category: 'typescript',
    difficulty: 'Advanced',
    topic: 'Conditional Types',
    title: 'How do recursive conditional types with an accumulator work?',
    summary: 'Recursive conditional types can carry a hidden accumulator type parameter to build up a result across each recursive step, similar to tail recursion in functional programming.',
    explanation: 'Since TypeScript 4.1+, conditional types can recurse, but naive recursion (like directly recursing on the result) can be inefficient or hit the recursion depth limit. The accumulator pattern threads an extra generic parameter that collects partial results at each step, so the final answer is produced in one pass rather than being rebuilt via nested conditional evaluation. This pattern is used heavily in type-level string manipulation, such as reversing a tuple or joining a tuple of strings into a template literal.',
    code: `type Reverse<T extends unknown[], Acc extends unknown[] = []> =
  T extends [infer Head, ...infer Rest]
    ? Reverse<Rest, [Head, ...Acc]>
    : Acc;

type R = Reverse<[1, 2, 3]>; // [3, 2, 1]`,
    interviewQuestion: 'Why does the `Reverse<T, Acc>` type use a second generic parameter instead of just recursing on `Reverse<Rest>` and reassembling the array?',
  },
  {
    id: 'typescript-branded-nominal-types',
    category: 'typescript',
    difficulty: 'Advanced',
    topic: 'Type System Design',
    title: 'What are branded (nominal) types and why use them?',
    summary: 'Branded types simulate nominal typing in TypeScript’s structurally-typed system by tagging a base type with a unique, unused property so distinct semantic types are not interchangeable even if their shape is identical.',
    explanation: 'TypeScript uses structural typing, meaning a `UserId` and a `ProductId` that are both plain strings are freely assignable to one another, which can lead to bugs like passing a product ID where a user ID was expected. Branding adds a phantom property (often via an intersection with a unique symbol or literal tag) that exists only at the type level, forcing values to be explicitly cast or constructed through a factory function. This gives compile-time safety similar to nominal typing in languages like Java or C#, without any runtime cost since the brand field never actually exists on real objects.',
    code: `type UserId = string & { readonly __brand: \'UserId\' };
type ProductId = string & { readonly __brand: \'ProductId\' };

function toUserId(id: string): UserId {
  return id as UserId;
}

function getUser(id: UserId) { /* ... */ }

const pid = \'p-123\' as ProductId;
// getUser(pid); // Error: ProductId not assignable to UserId
getUser(toUserId(\'u-123\')); // OK`,
    interviewQuestion: 'How would you prevent two different string-based ID types from being accidentally swapped, given that TypeScript uses structural typing?',
  },
  {
    id: 'typescript-this-parameter-typing',
    category: 'typescript',
    difficulty: 'Intermediate',
    topic: 'Functions',
    title: 'How does TypeScript type the `this` parameter in functions?',
    summary: 'TypeScript allows an explicit, fake `this` parameter as the first parameter in a function signature purely for type-checking the calling context, and it is erased at compile time.',
    explanation: 'Declaring `function foo(this: SomeType, ...)` tells the compiler what `this` must be bound to when the function is called, catching errors where a method is detached from its object and invoked with the wrong context (e.g. as an event handler). It does not add a real parameter to the emitted JavaScript. This is especially useful for callback-heavy APIs and for typing plain functions used with `.call`, `.apply`, or `.bind`. Combined with `noImplicitThis` in tsconfig, it prevents accidental use of an untyped or incorrectly typed `this`.',
    code: `interface Button {
  label: string;
  onClick(this: Button, event: Event): void;
}

function handleClick(this: Button, event: Event) {
  console.log(this.label);
}

const btn: Button = { label: \'Save\', onClick: handleClick };
btn.onClick.call(btn, new Event(\'click\'));`,
    interviewQuestion: 'What does adding a `this: SomeType` first parameter to a function declaration do, and why does it not appear when you call the function?',
  },
  {
    id: 'typescript-overload-resolution-order',
    category: 'typescript',
    difficulty: 'Tricky',
    topic: 'Functions',
    title: 'How does TypeScript resolve which overload signature to use?',
    summary: 'TypeScript picks the first overload signature (top to bottom) in the declaration list whose parameters are compatible with the call, not necessarily the most specific one.',
    explanation: 'Because resolution is order-dependent rather than based on best-fit matching, overload signatures must be listed from most specific to least specific, or a more general overload higher up will shadow a more specific one below it, causing the wrong return type to be inferred. The implementation signature (the one with a body) is not part of the overload set visible to callers and must be compatible with all the public overloads. This is a frequent source of confusing type errors when overloads are declared in the wrong order.',
    code: `function process(input: string): string[];
function process(input: number): number[];
function process(input: string | number): string[] | number[] {
  return typeof input === \'string\' ? input.split(\'\') : [input];
}

const a = process(\'hi\'); // string[]
const b = process(5);    // number[]
// Reordering overloads with a looser \'any\' signature first
// would break correct inference for callers.`,
    interviewQuestion: 'If you declare a more general overload signature before a more specific one, what problem can occur, and how does TypeScript choose which overload applies to a given call?',
  },
  {
    id: 'typescript-partial-required-from-scratch',
    category: 'typescript',
    difficulty: 'Intermediate',
    topic: 'Utility Types',
    title: 'How would you implement Partial and Required from scratch?',
    summary: 'Partial and Required are mapped types that toggle the optional modifier `?` on every property of an object type using the `+?`/`-?` mapping modifiers.',
    explanation: 'A mapped type iterates `[K in keyof T]` and can apply modifiers to change optionality (`?`/`-?`) or readonly-ness (`readonly`/`-readonly`) independently for each key. `Partial<T>` adds `?` to every property (making it optional), while `Required<T>` strips `?` using `-?`, forcing every property to be present. These are structural transformations with no runtime behavior; they only affect the type checker. Writing them from scratch demonstrates a solid understanding of mapped type modifier syntax, which also underlies `Readonly<T>` and `Mutable<T>` implementations.',
    code: `type MyPartial<T> = {
  [K in keyof T]?: T[K];
};

type MyRequired<T> = {
  [K in keyof T]-?: T[K];
};

interface User { id: number; name?: string; }
type U1 = MyPartial<User>;  // { id?: number; name?: string }
type U2 = MyRequired<User>; // { id: number; name: string }`,
    interviewQuestion: 'Write your own version of the built-in `Required<T>` utility type and explain what the `-?` modifier does in a mapped type.',
  },
  {
    id: 'typescript-pick-omit-from-scratch',
    category: 'typescript',
    difficulty: 'Intermediate',
    topic: 'Utility Types',
    title: 'How would you implement Pick and Omit from scratch?',
    summary: 'Pick selects a subset of keys from a type using a mapped type constrained with `keyof`, while Omit is built on top of Pick and Exclude to remove specific keys.',
    explanation: '`Pick<T, K>` maps only over the keys in `K` (constrained to `keyof T`), copying each property’s type via an indexed access `T[K]`. `Omit<T, K>` is not implemented as a direct mapped type in the standard library; instead it composes `Pick` with `Exclude<keyof T, K>`, first computing the remaining keys by excluding `K` from `keyof T`, then picking exactly those. This composition pattern (deriving one utility from more primitive ones) is idiomatic in TypeScript’s type-level programming and shows how utility types build on each other rather than each being a bespoke implementation.',
    code: `type MyPick<T, K extends keyof T> = {
  [P in K]: T[P];
};

type MyExclude<T, U> = T extends U ? never : T;

type MyOmit<T, K extends keyof any> = MyPick<T, MyExclude<keyof T, K>>;

interface User { id: number; name: string; email: string; }
type PublicUser = MyOmit<User, \'email\'>; // { id: number; name: string }`,
    interviewQuestion: 'Implement `Omit<T, K>` using `Pick` and `Exclude`, and explain why `Omit` is not written as a standalone mapped type in the TypeScript standard library.',
  },
  {
    id: 'typescript-record-deep-dive',
    category: 'typescript',
    difficulty: 'Basic',
    topic: 'Utility Types',
    title: 'What is Record<K, V> and how does it work under the hood?',
    summary: 'Record<K, V> constructs an object type whose keys come from K and whose values all have type V, implemented internally as a mapped type over a key union.',
    explanation: 'Record is defined roughly as `type Record<K extends keyof any, V> = { [P in K]: V }`, where `keyof any` is `string | number | symbol`, the set of all valid property key types. It is commonly used for lookup tables, dictionaries keyed by a union of string literals, or enum-keyed maps. Unlike an index signature (`{ [key: string]: V }`), `Record` with a literal union of keys forces every key in that union to be present, giving exhaustiveness guarantees that a plain index signature does not.',
    code: `type Fruit = \'apple\' | \'banana\' | \'cherry\';

const prices: Record<Fruit, number> = {
  apple: 1.5,
  banana: 0.5,
  cherry: 3,
  // omitting a key here is a compile error
};

type AnyStringMap = Record<string, unknown>;`,
    interviewQuestion: 'How does `Record<Fruit, number>` differ from `{ [key: string]: number }` when `Fruit` is a union of string literals, in terms of what the compiler enforces?',
  },
  {
    id: 'typescript-typed-currying',
    category: 'typescript',
    difficulty: 'Advanced',
    topic: 'Functions',
    title: 'How do you type a curried function with generics?',
    summary: 'A fully typed curry function uses overloads or conditional types over tuple parameter lists to progressively peel off one argument at a time while preserving accurate types for each partial application.',
    explanation: 'Typing currying well typically requires TypeScript’s variadic tuple types combined with conditional types: given a function’s `Parameters<F>` tuple, you recursively check if calling with one argument leaves a non-empty remaining tuple, and if so return a new curried function typed over the rest, otherwise return the final result type. This is one of the more advanced patterns combining `infer`, tuple spreads, and recursive conditional types, and it demonstrates deep familiarity with type-level function composition beyond what simple generics can express.',
    code: `type Curry<F> = F extends (arg: infer A, ...rest: infer R) => infer Ret
  ? R extends []
    ? (arg: A) => Ret
    : (arg: A) => Curry<(...args: R) => Ret>
  : never;

function curry<F extends (...args: any[]) => any>(fn: F): Curry<F> {
  return ((...args: any[]) =>
    args.length >= fn.length
      ? fn(...args)
      : (curry as any)(fn.bind(null, ...args))) as Curry<F>;
}

const add3 = (a: number, b: number, c: number) => a + b + c;
const curried = curry(add3);
const result = curried(1)(2)(3); // 6`,
    interviewQuestion: 'How would you write a generic type that types a curried version of an arbitrary function signature, one argument at a time?',
  },
  {
    id: 'typescript-type-safe-event-emitter',
    category: 'typescript',
    difficulty: 'Advanced',
    topic: 'Design Patterns',
    title: 'How do you build a type-safe event emitter with generics?',
    summary: 'A type-safe event emitter maps event names to their payload types via a generic events interface, so `on`, `off`, and `emit` are all checked against the correct argument shape for each event.',
    explanation: 'The core idea is to define a map type like `type Events = { login: { userId: string }; logout: void }` and make the emitter class generic over that map, using `keyof Events` to constrain the event name parameter and indexed access `Events[K]` to type the payload. This prevents bugs like emitting an event with the wrong payload shape or subscribing to a misspelled event name, which is easy to get wrong with a loosely typed `emit(event: string, ...args: any[])` signature. It is a very common real-world pattern in front-end state management and WebSocket wrapper libraries.',
    code: `type EventMap = {
  login: { userId: string };
  logout: undefined;
};

class TypedEmitter<T extends Record<string, any>> {
  private listeners: { [K in keyof T]?: Array<(payload: T[K]) => void> } = {};

  on<K extends keyof T>(event: K, cb: (payload: T[K]) => void) {
    (this.listeners[event] ??= []).push(cb);
  }

  emit<K extends keyof T>(event: K, payload: T[K]) {
    this.listeners[event]?.forEach((cb) => cb(payload));
  }
}

const emitter = new TypedEmitter<EventMap>();
emitter.on(\'login\', (p) => console.log(p.userId));
emitter.emit(\'login\', { userId: \'u1\' });`,
    interviewQuestion: 'Design a generic `EventEmitter` class where `emit` and `on` are type-checked against an event name to payload mapping. What TypeScript feature makes the payload type depend on the event name argument?',
  },
  {
    id: 'typescript-typed-redux-reducer',
    category: 'typescript',
    difficulty: 'Advanced',
    topic: 'Design Patterns',
    title: 'How do you type a Redux-style reducer with discriminated union actions?',
    summary: 'A type-safe reducer models actions as a discriminated union keyed by a `type` field, letting a switch statement narrow the action payload for each case and enabling exhaustiveness checking.',
    explanation: 'Each action is a distinct object type with a literal `type` field plus whatever payload fields it needs; the union of all actions becomes the reducer’s second parameter type. Inside a `switch (action.type)`, TypeScript narrows `action` to the specific member matching each `case`, so payload fields are correctly typed without manual casting. Adding a `default: assertNever(action)` branch (where `assertNever` takes a `never` parameter) causes a compile error if a new action variant is added to the union but not handled, giving compile-time exhaustiveness checking that mirrors what `Exclude`/`never` patterns provide elsewhere in the type system.',
    code: `type State = { count: number };
type Action =
  | { type: \'increment\'; amount: number }
  | { type: \'decrement\'; amount: number }
  | { type: \'reset\' };

function assertNever(x: never): never {
  throw new Error(\'Unhandled action: \' + JSON.stringify(x));
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case \'increment\':
      return { count: state.count + action.amount };
    case \'decrement\':
      return { count: state.count - action.amount };
    case \'reset\':
      return { count: 0 };
    default:
      return assertNever(action);
  }
}`,
    interviewQuestion: 'How would you design action types for a reducer so that adding a new action variant without updating the switch statement causes a compile-time error?',
  },
  {
    id: 'typescript-awaited-utility-type',
    category: 'typescript',
    difficulty: 'Intermediate',
    topic: 'Utility Types',
    title: 'What does the Awaited<T> utility type do?',
    summary: 'Awaited<T> recursively unwraps Promise-like types to determine what a value resolves to, mirroring how `await` behaves at runtime, including nested and thenable promises.',
    explanation: 'Introduced in TypeScript 4.5, `Awaited<T>` is essential for correctly typing `async`/`await` chains and utilities like `Promise.all`. It is implemented as a recursive conditional type that checks if `T` has a `then` method (`T extends PromiseLike<infer U>`), and if so recurses on `U` until a non-promise type is reached, correctly handling promises that resolve to other promises. Before its introduction, TypeScript struggled to correctly type deeply or conditionally nested promises, which caused real bugs in generic async utility functions.',
    code: `type MyAwaited<T> = T extends PromiseLike<infer U> ? MyAwaited<U> : T;

type A = MyAwaited<Promise<string>>;              // string
type B = MyAwaited<Promise<Promise<number>>>;      // number
type C = Awaited<ReturnType<typeof fetch>>;         // Response

async function getValue(): Promise<Promise<boolean>> {
  return Promise.resolve(true);
}
type D = Awaited<ReturnType<typeof getValue>>; // boolean`,
    interviewQuestion: 'Why is `Awaited<T>` implemented as a recursive conditional type instead of a single-level `T extends Promise<infer U> ? U : T`?',
  },
  {
    id: 'typescript-abstract-constructor-type',
    category: 'typescript',
    difficulty: 'Advanced',
    topic: 'Classes',
    title: 'What is an abstract constructor type and when do you need it?',
    summary: 'An abstract constructor type, written as `abstract new (...args) => T`, describes a class reference that cannot be instantiated directly with `new` but can still be extended, which is required for typing mixin functions that accept abstract base classes.',
    explanation: 'Normally, a constructor type like `new (...args: any[]) => T` implies the class can be directly instantiated, which excludes abstract classes since `new AbstractClass()` is a compile error. Mixin functions that take a base class and return an extended class need to accept both concrete and abstract classes, so TypeScript added the `abstract new (...)` constructor type syntax to represent "a class-like value, possibly abstract." This distinction matters because a mixin typed with a plain (non-abstract) constructor type would reject an abstract class argument even though `class Derived extends Base` works fine with an abstract `Base`.',
    code: `abstract class Shape {
  abstract area(): number;
}

type AbstractCtor<T> = abstract new (...args: any[]) => T;

function withLabel<T extends AbstractCtor<Shape>>(Base: T) {
  return class extends Base {
    label = \'shape\';
  };
}

class Circle extends Shape {
  constructor(public radius: number) { super(); }
  area() { return Math.PI * this.radius ** 2; }
}

const LabeledCircle = withLabel(Circle);
const c = new LabeledCircle(5);`,
    interviewQuestion: 'Why would a mixin function that accepts a class argument fail to accept an abstract class unless its parameter type uses `abstract new (...args: any[]) => T`?',
  },
  {
    id: 'typescript-covariant-return-overrides',
    category: 'typescript',
    difficulty: 'Tricky',
    topic: 'Classes',
    title: 'What are covariant return types in method overrides?',
    summary: 'TypeScript allows a subclass to override a method with a return type that is a subtype of the base method’s return type, which is safe because callers expecting the base type can still use the more specific returned value.',
    explanation: 'This is called covariance: the override’s return type varies "in the same direction" as the subclass relationship. It is sound because any code relying on the base class’s method signature only ever uses members guaranteed by the base return type, and a more specific subtype satisfies that contract. Parameter types, in contrast, are checked bivariantly for methods (or contravariantly under `strictFunctionTypes` for standalone function types), which is a common point of confusion since return types and parameter types are checked with different variance rules in TypeScript.',
    code: `class Animal {}
class Dog extends Animal { bark() { return \'woof\'; } }

class AnimalShelter {
  adopt(): Animal {
    return new Animal();
  }
}

class DogShelter extends AnimalShelter {
  // Covariant return: Dog is a subtype of Animal, so this override is valid
  adopt(): Dog {
    return new Dog();
  }
}

const shelter: AnimalShelter = new DogShelter();
const pet = shelter.adopt(); // typed as Animal, actually a Dog`,
    interviewQuestion: 'Why is it legal for a subclass method to override the base class method with a narrower return type, but not generally legal to widen a parameter type in the same way?',
  },
  {
    id: 'typescript-satisfies-vs-annotation-tradeoffs',
    category: 'typescript',
    difficulty: 'Tricky',
    topic: 'Type Inference',
    title: 'When should you use satisfies instead of a type annotation, and what are the tradeoffs?',
    summary: 'A type annotation widens an expression to the declared type and loses literal information, while `satisfies` validates the expression against a type without changing its inferred type, preserving narrow literal types for later use.',
    explanation: 'With `const config: Record<string, number> = {...}`, every property is widened to type `number` and you lose the ability to know exactly which keys exist when indexing later, and autocomplete on `config.foo` becomes just `number`. With `const config = {...} satisfies Record<string, number>`, TypeScript still checks that every value conforms to `number`, but the variable’s inferred type remains the specific literal object type, so `config.apple` is known to exist and callers get full autocomplete plus excess-property and shape checking. The tradeoff is that `satisfies` does not change the declared type of the variable at all -- if you need the variable’s static type to be the broader type (e.g. to assign a different, incompatible literal object to it later), you still want a plain annotation.',
    code: `type Palette = Record<\'primary\' | \'secondary\', string>;

// Annotation: widens to Palette, losing specific keys
const a: Palette = { primary: \'#000\', secondary: \'#fff\' };

// satisfies: keeps literal type, still validated against Palette
const b = { primary: \'#000\', secondary: \'#fff\' } satisfies Palette;

b.primary.toUpperCase(); // fully typed as string literal-derived type
// a.primary is just \'string\', b.primary is also checked but object shape is preserved`,
    interviewQuestion: 'Given `const config = { retries: 3, timeout: 1000 } satisfies Options`, why might `config` still retain narrower types than `Options` itself, and why would that matter to a caller?',
  },
  {
    id: 'typescript-exhaustiveness-checking-never',
    category: 'typescript',
    difficulty: 'Intermediate',
    topic: 'Type Narrowing',
    title: 'How do you implement exhaustiveness checking using the never type?',
    summary: 'Exhaustiveness checking uses the fact that after all members of a union have been handled in a switch or if-chain, the remaining type narrows to never, so assigning it to a never-typed parameter causes a compile error if a case was missed.',
    explanation: 'The pattern is to write a small helper function, commonly named `assertNever(x: never): never`, and call it in the `default` case of a switch statement (or the final `else`) over a discriminated union. If every union member has been handled by an earlier case, the type of the value at that point is `never`, which satisfies the parameter type. If a developer later adds a new variant to the union but forgets to add a corresponding case, the value at the default branch will no longer be `never` (it will be the unhandled variant), and TypeScript raises a type error at the `assertNever` call site, catching the omission at compile time rather than at runtime.',
    code: `type Shape =
  | { kind: \'circle\'; radius: number }
  | { kind: \'square\'; side: number }
  | { kind: \'rectangle\'; width: number; height: number };

function assertNever(x: never): never {
  throw new Error(\'Unexpected shape: \' + JSON.stringify(x));
}

function area(shape: Shape): number {
  switch (shape.kind) {
    case \'circle\': return Math.PI * shape.radius ** 2;
    case \'square\': return shape.side ** 2;
    case \'rectangle\': return shape.width * shape.height;
    default: return assertNever(shape); // fails to compile if a case is missing
  }
}`,
    interviewQuestion: 'How does calling `assertNever(shape)` in the default branch of a switch statement help catch missing cases at compile time when a new variant is added to a discriminated union?',
  },
  {
    id: 'typescript-custom-type-predicates',
    category: 'typescript',
    difficulty: 'Intermediate',
    topic: 'Type Narrowing',
    title: 'How do custom type predicates with the is keyword work?',
    summary: 'A function can declare its return type as `param is SomeType` to tell the compiler that a truthy return means the argument has been narrowed to that specific type, enabling custom runtime checks to participate in type narrowing.',
    explanation: 'Without a type predicate, a function like `isString(x: unknown): boolean` only tells the compiler the function returns a boolean; it gives no information about `x`’s type afterward, so calling code would still need a manual cast. By writing `isString(x: unknown): x is string`, TypeScript treats any call site like `if (isString(value))` as a narrowing point, refining `value` to `string` inside that branch, just like `typeof` or `instanceof` checks. This is essential for validating data of type `unknown` (such as parsed JSON) and for building reusable narrowing utilities across a codebase, especially for shapes that plain `typeof`/`in` checks cannot express.',
    code: `interface Cat { meow(): void; }
interface Dog { bark(): void; }

function isCat(animal: Cat | Dog): animal is Cat {
  return typeof (animal as Cat).meow === \'function\';
}

function speak(animal: Cat | Dog) {
  if (isCat(animal)) {
    animal.meow(); // narrowed to Cat
  } else {
    animal.bark(); // narrowed to Dog
  }
}`,
    interviewQuestion: 'What is the difference between a function typed as `(x: unknown) => boolean` and one typed as `(x: unknown) => x is string`, in terms of what the caller’s type checker knows after the call?',
  },
  {
    id: 'typescript-switch-narrowing-discriminated-unions',
    category: 'typescript',
    difficulty: 'Basic',
    topic: 'Type Narrowing',
    title: 'How does narrowing work inside a switch statement over a discriminated union?',
    summary: 'TypeScript narrows a discriminated union to the matching member type within each case block of a switch statement by comparing the literal value of the common discriminant property.',
    explanation: 'When a union’s members each have a shared property with distinct literal types (the "discriminant" or "tag"), a `switch (value.tag)` statement lets the compiler match each `case` label against the discriminant’s literal type and narrow `value` accordingly inside that block. This works with `case` labels using `===`-like literal comparison, string enums, or numeric literals, but stops working if the discriminant property is computed at runtime or if fallthrough logic mixes multiple cases in ways the compiler cannot statically reconcile with a single type. Understanding this narrowing behavior is foundational to writing safe, type-driven state machines and API response handlers.',
    code: `type ApiResult =
  | { status: \'success\'; data: string }
  | { status: \'error\'; message: string }
  | { status: \'loading\' };

function render(result: ApiResult): string {
  switch (result.status) {
    case \'success\':
      return result.data; // narrowed: { status: \'success\'; data: string }
    case \'error\':
      return result.message; // narrowed to the error variant
    case \'loading\':
      return \'Loading...\';
  }
}`,
    interviewQuestion: 'Why does `result.data` become accessible only inside the `case "success":` block of the switch statement, and not in the other case blocks?',
  },
  {
    id: 'typescript-typed-async-generators',
    category: 'typescript',
    difficulty: 'Advanced',
    topic: 'Async',
    title: 'How do you type async generator functions?',
    summary: 'An async generator function is typed with `AsyncGenerator<YieldType, ReturnType, NextType>`, describing what values it yields asynchronously, what it returns when done, and what type of value can be passed into `.next()`.',
    explanation: 'Declaring `async function* gen(): AsyncGenerator<T, R, N>` lets TypeScript check `yield` expressions against `T`, the generator’s final `return` value against `R`, and the type passed back in via `iterator.next(value)` against `N`. Consuming such a generator with `for await...of` automatically types the loop variable as `T`. This pattern shows up in streaming APIs, paginated data fetching, and async iterables that produce values over time (e.g. reading chunks from a network stream), and correctly typing all three generic slots avoids `any` leaking into consumer code.',
    code: `async function* fetchPages(url: string): AsyncGenerator<string[], void, unknown> {
  let page = 1;
  while (page <= 3) {
    const items = await Promise.resolve([\`item-\${page}-a\`, \`item-\${page}-b\`]);
    yield items;
    page++;
  }
}

async function consume() {
  for await (const batch of fetchPages(\'/api/items\')) {
    console.log(batch.length); // batch is typed as string[]
  }
}`,
    interviewQuestion: 'What do the three type parameters of `AsyncGenerator<T, TReturn, TNext>` represent, and how does `for await...of` use the first one?',
  },
  {
    id: 'typescript-thisparametertype-omitthisparameter',
    category: 'typescript',
    difficulty: 'Tricky',
    topic: 'Utility Types',
    title: 'What do ThisParameterType and OmitThisParameter do?',
    summary: 'ThisParameterType extracts the type of a function’s fake `this` parameter (or unknown if none is declared), while OmitThisParameter produces a version of a function type with that `this` parameter stripped out, matching what `.bind()` returns.',
    explanation: 'These utilities exist to correctly type functions before and after binding. `ThisParameterType<T>` is implemented as `T extends (this: infer U, ...args: never) => any ? U : unknown`, pulling the `this` type via `infer`. `OmitThisParameter<T>` reconstructs the function type without the `this` parameter, which is exactly the type produced by calling `.bind(...)`, since a bound function no longer requires (or allows) specifying a `this` context. They are used internally by the standard library’s typing of `Function.prototype.bind` and are useful when writing utilities that programmatically transform function types while tracking their calling context.',
    code: `function greet(this: { name: string }, greeting: string) {
  return \`\${greeting}, \${this.name}\`;
}

type ThisType_ = ThisParameterType<typeof greet>; // { name: string }
type BoundGreet = OmitThisParameter<typeof greet>; // (greeting: string) => string

const bound: BoundGreet = greet.bind({ name: \'Ada\' });
bound(\'Hello\'); // no \'this\' argument needed or allowed`,
    interviewQuestion: 'After calling `.bind()` on a function that declares a `this` parameter, why does the resulting function type no longer include that `this` parameter, and which utility type models that transformation?',
  },
  {
    id: 'typescript-structural-typing-class-pitfalls',
    category: 'typescript',
    difficulty: 'Tricky',
    topic: 'Type System Design',
    title: 'What structural typing pitfalls arise with classes specifically?',
    summary: 'Because TypeScript compares classes structurally rather than nominally, two unrelated classes with identical member shapes are considered assignable to one another, which can silently allow logically incorrect substitutions.',
    explanation: 'Unlike languages such as Java where class identity determines type compatibility, TypeScript only checks whether the shape (properties and methods) matches, so a `Vector2D` class with `x`/`y` and a `Point` class with `x`/`y` are freely interchangeable even though they represent different concepts. This gets worse with classes that have only public members, since there is nothing to structurally distinguish them; adding a `private` or `protected` member forces nominal-like behavior for that class specifically, because private members are checked by declaration site, not just shape, so two classes with identically named private fields are still incompatible. This is a common trick question: private/protected fields are the main lever for approximating nominal typing at the class level, alongside the branded-type pattern used for plain object/primitive types.',
    code: `class Vector2D { constructor(public x: number, public y: number) {} }
class Point { constructor(public x: number, public y: number) {} }

function magnitude(v: Vector2D) {
  return Math.sqrt(v.x ** 2 + v.y ** 2);
}

magnitude(new Point(3, 4)); // allowed! structurally identical

class SecureVector2D {
  private brand = \'vector\';
  constructor(public x: number, public y: number) {}
}
class SecurePoint {
  private brand = \'point\';
  constructor(public x: number, public y: number) {}
}
// magnitude-like function typed with SecureVector2D would now reject SecurePoint`,
    interviewQuestion: 'Why does adding a `private` field to a class change how TypeScript checks assignability compared to a class with only public fields, even though private fields are erased at runtime?',
  },
  {
    id: 'typescript-enum-vs-union-literals-tradeoffs',
    category: 'typescript',
    difficulty: 'Intermediate',
    topic: 'Enums',
    title: 'What are the tradeoffs between enums and unions of string literals?',
    summary: 'String literal unions are pure compile-time constructs with zero runtime footprint and simpler structural compatibility, while enums generate real runtime objects and offer namespacing and reverse lookups (for numeric enums) at the cost of extra bundle size and some structural quirks.',
    explanation: 'A `type Direction = "up" | "down" | "left" | "right"` produces no JavaScript output at all, is trivially serializable to/from JSON, and any string literal matching one of the values is assignable without an explicit enum reference. A `enum Direction { Up, Down, Left, Right }` compiles to an actual object (or, for numeric enums, a bidirectional lookup object), meaning values must be referenced through the enum (`Direction.Up`) for full type safety, and numeric enums allow easy-to-miss bugs since any number is structurally assignable to a numeric enum type. Most modern style guides (including TypeScript’s own team) now favor literal unions or `as const` object maps over enums for new code, reserving enums mainly for cases needing the runtime object or namespacing behavior.',
    code: `// Union of literals: zero runtime cost
type Status = \'idle\' | \'loading\' | \'success\' | \'error\';
function setStatus(s: Status) {}
setStatus(\'idle\'); // works directly with a string literal

// Enum: real object at runtime
enum StatusEnum { Idle, Loading, Success, Error }
function setStatusEnum(s: StatusEnum) {}
// setStatusEnum(0) is allowed for numeric enums -- a common footgun
setStatusEnum(StatusEnum.Idle);`,
    interviewQuestion: 'Why might a team prefer a string literal union over a TypeScript enum for representing a fixed set of states, and what capability do they give up by doing so?',
  },
  {
    id: 'typescript-const-enums-compile-time-only',
    category: 'typescript',
    difficulty: 'Advanced',
    topic: 'Enums',
    title: 'What makes const enums different, and why are they compile-time only?',
    summary: 'A const enum is fully inlined at every usage site during compilation and produces no runtime object at all, unlike a regular enum, which trades some flexibility (like iterating over members) for smaller and faster output.',
    explanation: 'When you write `const enum Direction { Up, Down }`, the compiler replaces every reference such as `Direction.Up` directly with its numeric or string literal value in the emitted code, and no `Direction` object is created, avoiding both the runtime object allocation and an extra property lookup. This inlining is exactly why `const enum` is incompatible with `isolatedModules`: a single-file transpiler cannot inline a value defined in a different file without cross-file information, since it does not have access to the enum’s declared members at compile time. Const enums also cannot be used with computed members or in ways that require the runtime object to exist, such as reverse-mapping a numeric enum value back to its name.',
    code: `const enum Direction {
  Up,
  Down,
  Left,
  Right,
}

function move(dir: Direction) {
  if (dir === Direction.Up) console.log(\'moving up\');
}

move(Direction.Up);
// Compiled output inlines the value, e.g.: move(0 /* Up */);
// No \'Direction\' object exists at runtime.`,
    interviewQuestion: 'Why is `const enum` disallowed when the `isolatedModules` compiler flag is enabled, while a regular `enum` is not?',
  },
  {
    id: 'typescript-ambient-module-declarations',
    category: 'typescript',
    difficulty: 'Intermediate',
    topic: 'Modules',
    title: 'How do you write ambient module declarations for untyped npm packages?',
    summary: 'An ambient module declaration uses `declare module \'package-name\'` inside a `.d.ts` file to describe the shape of a JavaScript package that ships no type definitions, letting TypeScript type-check imports from it.',
    explanation: 'When a package has no bundled types and no corresponding `@types/` package on DefinitelyTyped, importing it normally causes a "could not find a declaration file" error. Adding a `.d.ts` file (commonly `global.d.ts` or `<package-name>.d.ts`, included via tsconfig’s `include` or `typeRoots`) with `declare module \'package-name\' { export function doThing(x: string): void; }` tells the compiler what the module exports. For a quick, unsafe escape hatch, `declare module \'package-name\';` with no body treats every import from that module as `any`, silencing the error entirely at the cost of type safety, which is a common trick worth knowing but should be used sparingly.',
    code: `// types/some-untyped-lib.d.ts
declare module \'some-untyped-lib\' {
  export interface Options {
    verbose?: boolean;
  }
  export function run(options?: Options): Promise<string>;
  export default function init(name: string): void;
}

// usage.ts
import init, { run } from \'some-untyped-lib\';
init(\'app\');
run({ verbose: true });`,
    interviewQuestion: 'You need to import a third-party JS package with no type definitions and no `@types` package available. What are two ways to make TypeScript accept the import, and what is the tradeoff between them?',
  },
  {
    id: 'typescript-function-type-bivariance',
    category: 'typescript',
    difficulty: 'Tricky',
    topic: 'Type System Design',
    title: 'What is method parameter bivariance and how does strictFunctionTypes affect it?',
    summary: 'Method shorthand signatures in TypeScript are checked bivariantly for parameter types (allowing both wider and narrower overrides), while standalone function-typed properties are checked contravariantly under strictFunctionTypes, an intentional inconsistency for practical reasons.',
    explanation: 'Soundly, function parameters should be checked contravariantly: an override’s parameter type should be the same or a supertype of the base parameter type. However, TypeScript historically checked all function parameters bivariantly (accepting either direction) to support common patterns like array method callbacks (e.g. `Array<Animal>.forEach` accepting a callback typed for `Dog`). The `strictFunctionTypes` flag tightens this to proper contravariance, but deliberately only for function types written in the "standalone" syntax (`(x: T) => void`) and not for method shorthand syntax (`method(x: T): void`) declared in interfaces or classes, because enforcing strict contravariance on methods broke too many common, safe-in-practice override patterns in real-world code.',
    code: `interface Animal {}
interface Dog extends Animal { bark(): void; }

interface EventHandler {
  // Method shorthand: bivariant, even under strictFunctionTypes
  handle(e: Dog): void;
}

interface EventHandlerStrict {
  // Standalone function property: contravariant under strictFunctionTypes
  handle: (e: Dog) => void;
}

const h1: EventHandler = { handle(e: Animal) { /* allowed */ } };
// const h2: EventHandlerStrict = { handle: (e: Animal) => {} }; // error under strictFunctionTypes`,
    interviewQuestion: 'Why does `strictFunctionTypes` enforce contravariant parameter checking for `handle: (e: Dog) => void` but not for the equivalent method shorthand `handle(e: Dog): void` in the same interface?',
  },

{
    id: 'react-usefetch-custom-hook',
    category: 'react',
    difficulty: 'Basic',
    topic: 'Custom Hooks',
    title: 'How do you build a reusable useFetch custom hook?',
    summary: 'A custom hook that encapsulates loading, data, and error state for network requests behind a single reusable function.',
    explanation: 'A useFetch hook wraps useEffect and useState to manage the lifecycle of an async request: loading, data, and error. It typically re-runs when the URL or dependencies change, and should cancel or ignore stale responses using a flag or AbortController to avoid race conditions. Returning an object like { data, loading, error } gives consumers a consistent shape. Because hooks are just functions that call other hooks, useFetch composes cleanly with useState and useEffect without violating the rules of hooks. This pattern reduces duplication across components that each need their own fetch/loading/error boilerplate.',
    code: `function useFetch(url) {
  const [state, setState] = useState({ data: null, loading: true, error: null });

  useEffect(() => {
    let ignore = false;
    setState({ data: null, loading: true, error: null });
    fetch(url)
      .then((res) => res.json())
      .then((data) => { if (!ignore) setState({ data, loading: false, error: null }); })
      .catch((error) => { if (!ignore) setState({ data: null, loading: false, error }); });
    return () => { ignore = true; };
  }, [url]);

  return state;
}

function UserProfile({ id }) {
  const { data, loading, error } = useFetch(\`/api/users/\${id}\`);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  return <p>{data.name}</p>;
}`,
    interviewQuestion: 'Walk me through designing a useFetch hook. How do you prevent it from setting state after the component unmounts or after a newer request has started?',
  },
  {
    id: 'react-usedebounce-custom-hook',
    category: 'react',
    difficulty: 'Intermediate',
    topic: 'Custom Hooks',
    title: 'How do you build a useDebounce custom hook?',
    summary: 'A hook that delays updating a value until the input has stopped changing for a specified time, useful for search inputs.',
    explanation: 'useDebounce keeps an internal state value that only updates after a timer elapses without the source value changing again. Inside a useEffect, a setTimeout is scheduled every time the input value changes, and the cleanup function clears the previous timeout before scheduling a new one. This means only the last change within the delay window actually triggers a state update. It is commonly used to avoid firing an API call on every keystroke in a search box, deferring the expensive work until the user pauses typing.',
    code: `function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

function SearchBox() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 400);

  useEffect(() => {
    if (debouncedQuery) console.log('Searching for', debouncedQuery);
  }, [debouncedQuery]);

  return <input value={query} onChange={(e) => setQuery(e.target.value)} />;
}`,
    interviewQuestion: 'How would you implement debouncing in React with a custom hook, and why does the cleanup function inside useEffect matter here?',
  },
  {
    id: 'react-useprevious-custom-hook',
    category: 'react',
    difficulty: 'Intermediate',
    topic: 'Custom Hooks',
    title: 'How do you build a usePrevious hook to track a value across renders?',
    summary: 'A hook that stores the value a piece of state or props held during the previous render, using a ref.',
    explanation: 'usePrevious relies on the fact that refs persist across renders without triggering re-renders when mutated. A useEffect runs after each render and updates ref.current to the latest value, but because effects run after the render commits, ref.current still holds the prior render value during the render phase itself. This makes it possible to compare current vs previous props or state, for example to detect a specific transition or to avoid running logic on the initial mount. It is a common building block for animations, transition detection, and diffing UI logic.',
    code: `function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

function Counter({ count }) {
  const prevCount = usePrevious(count);
  return (
    <p>
      Now: {count}, Before: {prevCount === undefined ? 'N/A' : prevCount}
    </p>
  );
}`,
    interviewQuestion: 'Explain how usePrevious works internally. Why does ref.current still hold the old value during the render phase even though the effect already ran on mount?',
  },
  {
    id: 'react-uselocalstorage-custom-hook',
    category: 'react',
    difficulty: 'Intermediate',
    topic: 'Custom Hooks',
    title: 'How do you build a useLocalStorage hook that syncs state with localStorage?',
    summary: 'A hook that behaves like useState but persists its value to localStorage and rehydrates it on mount.',
    explanation: 'useLocalStorage lazily initializes state by reading from localStorage on first render, falling back to a default if nothing is stored or parsing fails. Every time the state setter is called, a useEffect (or the setter itself) writes the serialized value back to localStorage. Using the lazy initializer form of useState avoids reading from localStorage on every render. Edge cases include handling JSON parse errors, syncing across browser tabs via the storage event, and avoiding localStorage access during server-side rendering where window is undefined.',
    code: `function useLocalStorage(key, defaultValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = window.localStorage.getItem(key);
      return stored ? JSON.parse(stored) : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}

function ThemeToggle() {
  const [theme, setTheme] = useLocalStorage('theme', 'light');
  return (
    <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      Current theme: {theme}
    </button>
  );
}`,
    interviewQuestion: 'How would you implement a useLocalStorage hook, and what problems can arise if you read localStorage during server-side rendering?',
  },
  {
    id: 'react-server-components-vs-client',
    category: 'react',
    difficulty: 'Advanced',
    topic: 'React Server Components',
    title: 'What is the mental model for React Server Components vs Client Components?',
    summary: 'Server Components render on the server with zero client-side JS shipped for them, while Client Components hydrate and run in the browser for interactivity.',
    explanation: 'Server Components (RSC) execute only on the server, can access backend resources like databases directly, and never ship their JavaScript to the browser, which reduces bundle size. Client Components are the traditional React components marked with a "use client" directive, and they run in the browser, support hooks like useState, and handle interactivity and event handlers. Server Components can render Client Components and pass serializable props to them, but Client Components cannot import Server Components directly (though they can receive them as children). This model shifts data fetching closer to the source and keeps interactive-only logic in the client bundle, but it requires a framework like Next.js App Router with proper RSC support since RSC is not just plain React running in Node.',
    code: `// ServerComponent.jsx (no directive = Server Component by default in RSC frameworks)
async function ProductList() {
  const products = await db.query('SELECT * FROM products');
  return (
    <ul>
      {products.map((p) => (
        <li key={p.id}>
          {p.name} <AddToCartButton productId={p.id} />
        </li>
      ))}
    </ul>
  );
}

// AddToCartButton.jsx
'use client';
function AddToCartButton({ productId }) {
  const [added, setAdded] = useState(false);
  return <button onClick={() => setAdded(true)}>{added ? 'Added' : 'Add'}</button>;
}`,
    interviewQuestion: 'What is the difference between a Server Component and a Client Component, and why can a Server Component render a Client Component but not vice versa?',
  },
  {
    id: 'react-suspense-data-fetching',
    category: 'react',
    difficulty: 'Advanced',
    topic: 'Suspense',
    title: 'How does Suspense work for data fetching?',
    summary: 'Suspense lets a component "pause" rendering while it waits for data, showing a fallback UI until a promise resolves.',
    explanation: 'Suspense for data fetching works by having a component throw a promise during render when data is not yet available; React catches that thrown promise, shows the nearest Suspense fallback, and re-renders the component once the promise resolves. This requires a data-fetching mechanism built for Suspense, such as React Query with suspense mode, Relay, or the React 19 use() hook combined with a cache, rather than a plain fetch call inside useEffect. The benefit is declarative loading states composed at the tree level instead of prop-drilled loading flags, and it enables patterns like streaming SSR where different parts of the page resolve independently.',
    code: `const resource = fetchUserSuspense(userId); // returns { read() }

function UserDetails() {
  const user = resource.read(); // throws a promise if not ready
  return <h2>{user.name}</h2>;
}

function App() {
  return (
    <Suspense fallback={<p>Loading user...</p>}>
      <UserDetails />
    </Suspense>
  );
}`,
    interviewQuestion: 'Explain how Suspense knows when to show a fallback versus the actual content. What does a component need to do to "suspend"?',
  },
  {
    id: 'react-use-hook-react-19',
    category: 'react',
    difficulty: 'Advanced',
    topic: 'React 19',
    title: 'What does the use() hook do in React 19?',
    summary: 'use() lets you read the value of a promise or context during render, and it can suspend the component until the promise resolves.',
    explanation: 'Unlike other hooks, use() can be called conditionally and inside loops, because it is not a traditional hook bound by the rules-of-hooks ordering constraint in the same way. When passed a promise, it integrates with Suspense: if the promise is pending, the component suspends and the nearest Suspense boundary shows its fallback; if it rejects, the nearest error boundary catches it. When passed a Context object, use(Context) behaves like useContext but can be called conditionally. It is commonly paired with Server Components or a caching data layer since calling use() with a new promise on every render would cause an infinite loop of refetching.',
    code: `function Comments({ commentsPromise }) {
  // Suspends until commentsPromise resolves; caught by nearest Suspense boundary
  const comments = use(commentsPromise);
  return (
    <ul>
      {comments.map((c) => <li key={c.id}>{c.text}</li>)}
    </ul>
  );
}

function Page({ commentsPromise }) {
  return (
    <Suspense fallback={<p>Loading comments...</p>}>
      <Comments commentsPromise={commentsPromise} />
    </Suspense>
  );
}`,
    interviewQuestion: 'How does the use() hook differ from other hooks in terms of the rules of hooks, and what happens if you pass it a freshly created promise on every render?',
  },
  {
    id: 'react-compiler-auto-memoization',
    category: 'react',
    difficulty: 'Advanced',
    topic: 'React Compiler',
    title: 'What problem does the React Compiler solve with automatic memoization?',
    summary: 'The React Compiler analyzes component code at build time and automatically inserts memoization, removing the need for manual useMemo, useCallback, and React.memo in most cases.',
    explanation: 'The React Compiler is a build-time tool that understands React semantics and the rules of React (like immutability of props and state) to automatically memoize values, functions, and JSX so that components skip unnecessary re-renders and re-computations without the developer manually wrapping everything in useMemo or useCallback. It works by statically analyzing dependencies the way a developer would, then generating equivalent memoized code, effectively doing what React.memo/useMemo/useCallback do today but correctly and exhaustively. This reduces bugs caused by missing or incorrect dependency arrays, but it requires code to follow the Rules of React (no mutating props/state, no impure render logic) to produce correct optimizations, and it does not replace the need to understand memoization concepts entirely since escape hatches and edge cases still exist.',
    code: `// Without the compiler, a developer must remember this manually:
const filtered = useMemo(() => items.filter((i) => i.active), [items]);
const handleClick = useCallback(() => onSelect(filtered[0]), [filtered, onSelect]);

// With the React Compiler enabled, plain code is automatically optimized:
function ItemList({ items, onSelect }) {
  const filtered = items.filter((i) => i.active); // compiler memoizes this
  const handleClick = () => onSelect(filtered[0]); // compiler memoizes this too
  return <button onClick={handleClick}>{filtered.length} active</button>;
}`,
    interviewQuestion: 'What does the React Compiler do, and why does it require code to follow the Rules of React in order to optimize correctly?',
  },
  {
    id: 'react-useactionstate-react-19',
    category: 'react',
    difficulty: 'Advanced',
    topic: 'React 19',
    title: 'What is useActionState and how does it simplify form state management?',
    summary: 'useActionState is a React 19 hook that manages state derived from a form action, tracking the pending status and the latest returned result automatically.',
    explanation: 'useActionState takes an action function and an initial state, and returns a wrapped action, the current state, and a pending boolean. When the wrapped action is used as a form action or called directly, React tracks the in-flight submission, automatically sets pending to true while it runs, and updates state with whatever the action function returns. This removes the need to manually manage useState for form errors/results and a separate isSubmitting flag with try/catch/finally. It integrates with the broader React 19 Actions model, including automatic form reset and works well alongside useOptimistic for instant UI feedback before the server responds.',
    code: `async function updateName(prevState, formData) {
  const name = formData.get('name');
  if (!name) return { error: 'Name is required' };
  await saveName(name);
  return { error: null, success: true };
}

function NameForm() {
  const [state, formAction, isPending] = useActionState(updateName, { error: null });

  return (
    <form action={formAction}>
      <input name="name" />
      <button disabled={isPending}>{isPending ? 'Saving...' : 'Save'}</button>
      {state.error && <p role="alert">{state.error}</p>}
    </form>
  );
}`,
    interviewQuestion: 'How does useActionState differ from manually tracking form submission state with useState and try/catch/finally?',
  },
  {
    id: 'react-optimistic-ui-without-libraries',
    category: 'react',
    difficulty: 'Advanced',
    topic: 'Optimistic UI',
    title: 'How do you build optimistic UI updates without a library?',
    summary: 'Optimistic UI immediately updates the interface to reflect an expected outcome before the server confirms it, then reconciles or rolls back once the real response arrives.',
    explanation: 'Without a library, optimistic updates are typically implemented by storing a "confirmed" state plus a locally applied pending change, updating the UI instantly on user action, firing the async request, and either merging the real server response on success or reverting the local change on failure. React 19\'s useOptimistic hook formalizes this pattern by taking a base state and a reducer-like function that merges a pending optimistic value, automatically reverting once the underlying state updates or the transition finishes. The core tradeoff is that the UI can briefly show data that turns out to be wrong if the request fails, so a clear rollback and user-facing error message is essential.',
    code: `function TodoList({ todos, addTodo }) {
  const [optimisticTodos, addOptimisticTodo] = useOptimistic(
    todos,
    (state, newTodo) => [...state, { ...newTodo, pending: true }]
  );

  async function handleAdd(formData) {
    const title = formData.get('title');
    addOptimisticTodo({ id: Math.random(), title });
    await addTodo(title); // reverts to real state (or shows error) once done
  }

  return (
    <form action={handleAdd}>
      <input name="title" />
      <ul>
        {optimisticTodos.map((t) => (
          <li key={t.id} style={{ opacity: t.pending ? 0.5 : 1 }}>{t.title}</li>
        ))}
      </ul>
    </form>
  );
}`,
    interviewQuestion: 'How would you implement an optimistic update for a "like" button without any external library, and what happens if the server request fails?',
  },
  {
    id: 'react-context-usereducer-mini-state-manager',
    category: 'react',
    difficulty: 'Intermediate',
    topic: 'State Management',
    title: 'How do you combine Context and useReducer as a mini state manager?',
    summary: 'Pairing useReducer for centralized state transitions with Context for distribution creates a lightweight Redux-like store without external dependencies.',
    explanation: 'useReducer centralizes state updates into a single reducer function that handles dispatched actions predictably, similar to Redux. Wrapping that reducer\'s state and dispatch function in a Context Provider lets any descendant component read state or dispatch actions without prop drilling. This pattern is often split into two contexts (one for state, one for dispatch) so that components only consuming dispatch do not re-render when state changes. It is a good middle ground for medium-complexity apps that need predictable state transitions but do not want the overhead of Redux Toolkit, though it lacks built-in features like middleware, devtools time-travel, or selector-based render optimization out of the box.',
    code: `const CartStateContext = createContext(null);
const CartDispatchContext = createContext(null);

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM':
      return { ...state, items: [...state.items, action.item] };
    case 'CLEAR':
      return { ...state, items: [] };
    default:
      return state;
  }
}

function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });
  return (
    <CartStateContext.Provider value={state}>
      <CartDispatchContext.Provider value={dispatch}>
        {children}
      </CartDispatchContext.Provider>
    </CartStateContext.Provider>
  );
}

function useCart() {
  return [useContext(CartStateContext), useContext(CartDispatchContext)];
}`,
    interviewQuestion: 'Why would you split a Context + useReducer store into separate state and dispatch contexts instead of one combined context?',
  },
  {
    id: 'react-memo-comparison-function-pitfalls',
    category: 'react',
    difficulty: 'Tricky',
    topic: 'Performance',
    title: 'What pitfalls exist when writing a custom comparison function for React.memo?',
    summary: 'A custom areEqual function passed to React.memo can silently cause stale UI or wasted renders if it compares props incorrectly.',
    explanation: 'React.memo accepts an optional second argument, a function that receives prevProps and nextProps and returns true if the props are equal (meaning skip the re-render). A common mistake is inverting the boolean logic compared to shouldComponentUpdate, since memo\'s comparator returns true to SKIP rendering, the opposite convention from shouldComponentUpdate which returns true to render. Another pitfall is doing a shallow comparison that misses deeply nested changes, causing the component to not update when it should (a stale UI bug that is hard to trace). Comparators can also become a performance liability themselves if they do expensive deep equality checks on large objects, sometimes costing more than just re-rendering would have.',
    code: `const Row = React.memo(
  function Row({ user }) {
    return <div>{user.name} - {user.status}</div>;
  },
  (prevProps, nextProps) => {
    // BUG: only compares id, so a status change is missed and UI goes stale
    return prevProps.user.id === nextProps.user.id;
  }
);

// Correct: compare every field that affects rendering
const FixedRow = React.memo(
  Row,
  (prev, next) => prev.user.id === next.user.id && prev.user.status === next.user.status
);`,
    interviewQuestion: 'What does the return value of a React.memo comparison function mean, and how could a buggy comparator cause a component to display stale data?',
  },
  {
    id: 'react-useeffect-cleanup-timing',
    category: 'react',
    difficulty: 'Intermediate',
    topic: 'useEffect',
    title: 'When exactly does the useEffect cleanup function run?',
    summary: 'The cleanup function returned from useEffect runs before the component re-runs the effect on a dependency change, and again on unmount.',
    explanation: 'React runs the cleanup function from the previous effect invocation right before running the next effect (when dependencies change) and also when the component unmounts. This means cleanup and the new effect run in tight succession on updates: cleanup(prevDeps) then effect(nextDeps). Understanding this timing matters for things like event listeners, subscriptions, and timers, where forgetting cleanup leads to duplicate listeners or memory leaks. In React 18 Strict Mode during development, React intentionally runs mount, cleanup, and mount again once extra to help surface effects that are not properly idempotent or cleaned up.',
    code: `function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(roomId);
    connection.connect();
    console.log('Connected to', roomId);

    return () => {
      connection.disconnect();
      console.log('Disconnected from', roomId);
    };
  }, [roomId]);

  return <p>Room: {roomId}</p>;
}
// Switching roomId logs: Disconnected from A -> Connected to B\`,
    interviewQuestion: 'Explain the order of operations when a useEffect dependency changes: when does cleanup run relative to the next effect execution?',
  },
  {
    id: 'react-useeffect-async-callback-antipattern',
    category: 'react',
    difficulty: 'Tricky',
    topic: 'useEffect',
    title: 'Why can\'t the useEffect callback itself be an async function?',
    summary: 'useEffect expects its callback to return either nothing or a cleanup function, but an async function always returns a Promise, which breaks that contract.',
    explanation: 'If you mark the function passed to useEffect as async, it implicitly returns a Promise instead of undefined or a cleanup function, and React will either ignore it or, in development, warn that an effect returned something other than a function or undefined. The correct pattern is to define an async function inside the effect and immediately invoke it (or call a named async helper), while the effect callback itself stays synchronous and returns the real cleanup function. This preserves the ability to return a proper cleanup callback and avoids React trying to treat a Promise as cleanup logic.',
    code: \`useEffect(() => {
  // WRONG: async effect callback returns a Promise, not a cleanup function
  // async () => { const data = await fetchData(); setData(data); }

  // CORRECT: define and invoke an async function inside
  let ignore = false;
  async function load() {
    const res = await fetch('/api/data');
    const data = await res.json();
    if (!ignore) setData(data);
  }
  load();

  return () => { ignore = true; };
}, []);\`,
    interviewQuestion: 'Why does React not allow the useEffect callback to be declared async, and what pattern do you use instead to perform async work inside an effect?',
  },
  {
    id: 'react-race-conditions-data-fetching-effects',
    category: 'react',
    difficulty: 'Advanced',
    topic: 'useEffect',
    title: 'How do race conditions happen in data-fetching useEffects, and how do you prevent them?',
    summary: 'When a dependency changes quickly, an earlier fetch can resolve after a later one, overwriting fresh data with stale results unless guarded against.',
    explanation: 'If a component fetches data based on a prop like a search query or an id, and that prop changes before the previous request finishes, both requests race to call setState. Network timing is not guaranteed to match request order, so the older, slower request can resolve last and overwrite the UI with outdated data. The standard fix is to track a per-effect "ignore" flag or an incrementing request id set in the cleanup function, so that when a newer effect run\'s cleanup fires, it marks the old request as stale and its resolution is ignored. AbortController is a more robust alternative because it actually cancels the underlying network request instead of just ignoring its result.',
    code: \`function SearchResults({ query }) {
  const [results, setResults] = useState([]);

  useEffect(() => {
    let ignore = false;
    fetch(\\\`/api/search?q=\\\${query}\\\`)
      .then((res) => res.json())
      .then((data) => {
        if (!ignore) setResults(data); // skipped if a newer effect already ran
      });
    return () => { ignore = true; };
  }, [query]);

  return <ul>{results.map((r) => <li key={r.id}>{r.title}</li>)}</ul>;
}\`,
    interviewQuestion: 'Describe a scenario where a data-fetching useEffect produces a race condition, and explain two different ways to guard against it.',
  },
  {
    id: 'react-abortcontroller-in-useeffect',
    category: 'react',
    difficulty: 'Advanced',
    topic: 'useEffect',
    title: 'How do you use AbortController inside a useEffect to cancel in-flight requests?',
    summary: 'AbortController lets you actually cancel a pending fetch request when a component unmounts or dependencies change, rather than just ignoring its result.',
    explanation: 'AbortController exposes a signal that can be passed to fetch, and calling controller.abort() causes the fetch promise to reject with an AbortError. Inside useEffect, you create a new AbortController for each run, pass its signal to fetch, and call abort() in the cleanup function. This is more efficient than an "ignore" boolean flag because it stops the actual network request and any downstream work, saving bandwidth and server load, rather than letting the request complete uselessly in the background. You typically need to catch and specifically ignore AbortError in the promise chain so it does not get treated as a real error and surfaced to the user.',
    code: \`function UserDetails({ userId }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    fetch(\\\`/api/users/\\\${userId}\\\`, { signal: controller.signal })
      .then((res) => res.json())
      .then(setUser)
      .catch((err) => {
        if (err.name !== 'AbortError') console.error(err);
      });

    return () => controller.abort();
  }, [userId]);

  return user ? <p>{user.name}</p> : <p>Loading...</p>;
}\`,
    interviewQuestion: 'Why is using AbortController generally preferable to a boolean "ignore" flag when canceling requests in useEffect?',
  },
  {
    id: 'react-key-reconciliation-reorder-vs-insert',
    category: 'react',
    difficulty: 'Advanced',
    topic: 'Reconciliation',
    title: 'How does React\'s key-based reconciliation differ between sibling reordering and insertion?',
    summary: 'Stable keys let React match list items across renders by identity rather than position, so reordering moves existing DOM nodes and state, while insertion only creates new ones.',
    explanation: 'When a list re-renders, React uses the key prop to match new elements to previous elements regardless of their index. If two items swap positions but keep the same keys, React recognizes them as the same logical elements and simply reorders the corresponding DOM nodes and their associated component state, rather than destroying and recreating them. If a new item is inserted with a new unique key, React creates a fresh component instance only for that key while leaving siblings with unchanged keys untouched, preserving their internal state like scroll position, input focus, or animation state. This is why array index keys break under reordering or insertion at the start/middle of a list: the index-based key gets reassigned to a different logical item, causing React to reuse the wrong DOM node and state.',
    code: \`function List({ items }) {
  // items: [{ id: 'a', text: 'Apple' }, { id: 'b', text: 'Banana' }]
  return (
    <ul>
      {items.map((item) => (
        // Stable id key: reordering "a" and "b" moves DOM nodes, preserves state
        <ListItem key={item.id} text={item.text} />
      ))}
    </ul>
  );
}

function ListItem({ text }) {
  const [expanded, setExpanded] = useState(false); // survives reordering with stable keys
  return <li onClick={() => setExpanded((e) => !e)}>{text} {expanded && '(expanded)'}</li>;
}\`,
    interviewQuestion: 'If you reorder items in a list with stable unique keys, does React recreate the DOM nodes? What changes if you insert a new item at the beginning of the list?',
  },
  {
    id: 'react-dangerously-set-innerhtml-xss',
    category: 'react',
    difficulty: 'Intermediate',
    topic: 'Security',
    title: 'What is dangerouslySetInnerHTML and what XSS risk does it introduce?',
    summary: 'dangerouslySetInnerHTML lets you inject raw HTML into the DOM, bypassing React\'s automatic escaping and opening the door to cross-site scripting if the content is not sanitized.',
    explanation: 'By default, React escapes all values rendered in JSX, converting characters like < and > into safe entities so user-provided strings cannot inject executable markup. dangerouslySetInnerHTML opts out of that protection by setting the DOM element\'s innerHTML directly from a raw HTML string, which means any script tags, event handler attributes, or malicious markup in that string will be parsed and can execute in the user\'s browser. It is intended for narrow cases like rendering sanitized rich text from a trusted CMS or markdown renderer, and any untrusted or user-generated content must be run through a sanitization library such as DOMPurify before being passed in. The API name itself is a deliberate signal that this bypasses React\'s built-in safety net.',
    code: \`import DOMPurify from 'dompurify';

function RichTextBlock({ html }) {
  const clean = DOMPurify.sanitize(html);
  return <div dangerouslySetInnerHTML={{ __html: clean }} />;
}

// Never do this with unsanitized user input:
// <div dangerouslySetInnerHTML={{ __html: userComment }} />
// A comment like <img src=x onerror="stealCookies()"> would execute`,
    interviewQuestion: 'What does dangerouslySetInnerHTML bypass in React\'s default rendering behavior, and how would you safely render HTML that comes from user input?',
  },
  {
    id: 'react-refs-as-mutable-instance-variables',
    category: 'react',
    difficulty: 'Basic',
    topic: 'Refs',
    title: 'How can refs be used as mutable instance variables instead of just DOM references?',
    summary: 'A ref created with useRef can hold any mutable value across renders without triggering re-renders, functioning like an instance variable in a class component.',
    explanation: 'useRef returns a plain object with a .current property that persists for the lifetime of the component and can be mutated directly without causing a re-render, unlike useState. This makes it useful for storing values that need to survive across renders but should never drive UI updates on their own, such as a timer id, a previous value for comparison, a WebSocket connection instance, a render count, or a flag to prevent duplicate effect execution. The tradeoff is that reading ref.current during render is unreliable for producing consistent UI, since mutating a ref does not schedule a re-render, so any value that should be reflected visually must live in state instead.',
    code: `function Stopwatch() {
  const [elapsed, setElapsed] = useState(0);
  const intervalRef = useRef(null); // instance-variable-like storage

  function start() {
    if (intervalRef.current !== null) return; // guard against duplicate intervals
    intervalRef.current = setInterval(() => setElapsed((e) => e + 1), 1000);
  }

  function stop() {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
  }

  return (
    <div>
      <p>{elapsed}s</p>
      <button onClick={start}>Start</button>
      <button onClick={stop}>Stop</button>
    </div>
  );
}`,
    interviewQuestion: 'How is storing a value in a ref different from storing it in state, and why would you choose a ref for something like a timer id or previous value?',
  },
  {
    id: 'react-profiler-api-programmatic',
    category: 'react',
    difficulty: 'Advanced',
    topic: 'Performance',
    title: 'How do you use the React Profiler API programmatically to measure render performance?',
    summary: 'The <Profiler> component wraps part of the tree and calls an onRender callback with timing data every time that subtree commits, enabling automated performance measurement in code rather than only in DevTools.',
    explanation: 'React exposes a <Profiler id="..." onRender={callback}> component that measures how long a subtree takes to render on each commit, distinguishing between the initial mount and subsequent updates. The onRender callback receives arguments including the phase ("mount" or "update"), actualDuration (time spent rendering the committed update), and baseDuration (estimated time to render the subtree without memoization), which can be logged, sent to analytics, or asserted on in performance tests. This is useful for catching performance regressions in CI or for building internal dashboards, as opposed to the DevTools Profiler which is primarily an interactive, manual-use tool during development.',
    code: `function onRenderCallback(id, phase, actualDuration, baseDuration) {
  if (actualDuration > 16) {
    console.warn(\`Slow render in "\${id}" (\${phase}): \${actualDuration.toFixed(2)}ms\`);
  }
}

function App() {
  return (
    <Profiler id="Dashboard" onRender={onRenderCallback}>
      <Dashboard />
    </Profiler>
  );
}`,
    interviewQuestion: 'What information does the onRender callback of the React Profiler component give you, and how could you use it to catch performance regressions automatically?',
  },
  {
    id: 'react-inline-function-props-not-always-bad',
    category: 'react',
    difficulty: 'Tricky',
    topic: 'Performance',
    title: 'Why aren\'t inline function props always a performance problem?',
    summary: 'Passing a new arrow function as a prop on every render only matters for performance if it defeats a memoized child\'s shallow prop comparison and that child\'s re-render is actually expensive.',
    explanation: 'It is a common myth that inline functions like onClick={() => doThing()} are inherently bad for performance. Creating a new function on every render is cheap in JavaScript; the real cost only appears when that new function reference is passed to a child wrapped in React.memo, since the changed reference defeats memo\'s shallow comparison and forces a re-render of that child. Even then, the re-render is only a genuine problem if the child\'s render work is non-trivial. For plain DOM elements like a <button>, inline handlers cause no meaningful overhead because there is no memoization being defeated. Reaching for useCallback everywhere "just in case" adds its own overhead (dependency array comparisons, memory for retained closures) and can be premature optimization without profiling data showing an actual bottleneck.',
    code: `// Fine: plain DOM element, no memoized child depends on referential stability
function Button({ label, onSave }) {
  return <button onClick={() => onSave(label)}>{label}</button>;
}

// Matters: ExpensiveList is memoized, so a new onSelect reference each render
// defeats memo and forces a full re-render of a genuinely expensive subtree
const ExpensiveList = React.memo(function ExpensiveList({ items, onSelect }) {
  // heavy rendering logic here
  return <>{items.map((i) => <Row key={i.id} item={i} onSelect={onSelect} />)}</>;
});

function Parent({ items }) {
  const handleSelect = useCallback((id) => console.log(id), []); // worth memoizing here
  return <ExpensiveList items={items} onSelect={handleSelect} />;
}`,
    interviewQuestion: 'Is passing an inline arrow function as a prop always a performance issue? Under what specific condition does it actually matter?',
  },
  {
    id: 'react-memo-usecallback-combo-pitfalls',
    category: 'react',
    difficulty: 'Tricky',
    topic: 'Performance',
    title: 'What pitfalls arise when combining React.memo with useCallback?',
    summary: 'React.memo only prevents re-renders when every prop is referentially stable, so forgetting to memoize even one callback or object prop silently defeats the optimization.',
    explanation: 'React.memo performs a shallow comparison of all props, so wrapping a child in memo but only wrapping some of its function props in useCallback (while leaving one inline, or passing a new object/array literal each render) still causes re-renders on every parent update, making the memoization effectively useless while adding complexity. Another pitfall is an incomplete or incorrect dependency array on useCallback, which keeps the function reference stable but causes it to close over stale state or props (a stale closure bug), trading a performance win for a correctness bug. Overusing this combo throughout a codebase where children are cheap to render can also add net overhead from the memoization bookkeeping itself, so it is best applied selectively where profiling shows real re-render cost.',
    code: `const Child = React.memo(function Child({ onClick, config }) {
  console.log('Child rendered');
  return <button onClick={onClick}>{config.label}</button>;
});

function Parent({ count }) {
  const handleClick = useCallback(() => console.log(count), [count]); // stable per count
  // BUG: config is a new object literal every render, defeating memo anyway
  const config = { label: 'Click me' };

  return <Child onClick={handleClick} config={config} />;
}`,
    interviewQuestion: 'You wrapped a child component in React.memo and its onClick prop in useCallback, but it still re-renders every time. What else could be causing that?',
  },
  {
    id: 'react-testing-user-event-interactions',
    category: 'react',
    difficulty: 'Intermediate',
    topic: 'Testing',
    title: 'How does @testing-library/user-event improve on fireEvent for testing interactions?',
    summary: '@testing-library/user-event simulates full user interaction sequences (like real key presses and pointer events) rather than dispatching a single synthetic DOM event, producing more realistic tests.',
    explanation: 'fireEvent dispatches a single low-level DOM event directly, such as a click or change event, which can skip intermediate browser behavior like focus changes, hover states, or the sequence of keydown/keypress/input/keyup events that a real keystroke triggers. @testing-library/user-event simulates these interactions more faithfully by firing the full sequence of events a browser would produce, and its API is async, requiring await userEvent.click(element) or await userEvent.type(input, "text"), which better mirrors real user timing and catches bugs that only manifest with realistic event sequences, such as components relying on onKeyDown or focus/blur handlers. It is the recommended default for interaction testing in React Testing Library\'s own documentation, with fireEvent reserved for firing low-level or synthetic events that user-event doesn\'t model.',
    code: `import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

test('submits the form when the user types and clicks', async () => {
  const user = userEvent.setup();
  render(<LoginForm onSubmit={mockSubmit} />);

  await user.type(screen.getByLabelText(/username/i), 'sneha');
  await user.click(screen.getByRole('button', { name: /log in/i }));

  expect(mockSubmit).toHaveBeenCalledWith({ username: 'sneha' });
});`,
    interviewQuestion: 'Why does React Testing Library recommend @testing-library/user-event over fireEvent for most interaction tests?',
  },
  {
    id: 'react-msw-mock-service-worker-testing',
    category: 'react',
    difficulty: 'Intermediate',
    topic: 'Testing',
    title: 'What is MSW (Mock Service Worker) and why is it preferred for mocking API calls in tests?',
    summary: 'MSW intercepts actual network requests at the network layer (via a service worker in the browser or request interception in Node) so components can be tested using their real fetch/axios code without manual mocking.',
    explanation: 'Instead of mocking the fetch function or axios module directly, MSW defines request handlers that intercept outgoing HTTP requests based on URL and method, returning mock responses as if a real server handled them. This means the component and any data-fetching library under test run their actual network code unmodified, which produces higher-fidelity tests that catch bugs in request construction, headers, or response parsing that module-level mocks would hide. It also lets the same mock handlers be reused across unit tests, integration tests, and even local development or Storybook, avoiding duplicated and drifting mock logic scattered across the codebase.',
    code: `import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { render, screen, waitFor } from '@testing-library/react';

const server = setupServer(
  http.get('/api/user', () => HttpResponse.json({ name: 'Sneha' }))
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('renders fetched user name', async () => {
  render(<UserProfile />);
  await waitFor(() => expect(screen.getByText('Sneha')).toBeInTheDocument());
});`,
    interviewQuestion: 'How does MSW differ from mocking the fetch function directly with jest.mock, and why might that difference matter for test reliability?',
  },
  {
    id: 'react-focus-management-in-modals',
    category: 'react',
    difficulty: 'Tricky',
    topic: 'Accessibility',
    title: 'How do you manage focus correctly when opening and closing a modal?',
    summary: 'Accessible modals move keyboard focus into the dialog when it opens, trap focus within it while open, and return focus to the triggering element when it closes.',
    explanation: 'When a modal opens, focus should move to the modal itself or its first focusable element so screen reader and keyboard users are not left interacting with background content that is now visually hidden. While open, focus should be trapped inside the modal, meaning Tab and Shift+Tab cycle only through focusable elements inside it rather than escaping to the page behind it, typically enforced with a focus trap utility or by intercepting keydown events. When the modal closes, focus must be programmatically returned to the element that originally triggered it (commonly stored in a ref before opening), otherwise keyboard focus can end up reset to the top of the document, disorienting the user. The dialog should also use role="dialog" and aria-modal="true" so assistive technology understands its semantics.',
    code: `function Modal({ isOpen, onClose, children }) {
  const dialogRef = useRef(null);
  const triggerRef = useRef(document.activeElement);

  useEffect(() => {
    if (isOpen) {
      dialogRef.current?.focus();
    } else {
      triggerRef.current?.focus(); // return focus to the opener on close
    }
  }, [isOpen]);

  if (!isOpen) return null;
  return (
    <div role="dialog" aria-modal="true" ref={dialogRef} tabIndex={-1} onKeyDown={(e) => {
      if (e.key === 'Escape') onClose();
    }}>
      {children}
    </div>
  );
}`,
    interviewQuestion: 'What three focus-related behaviors does an accessible modal need to implement, and what happens for keyboard users if you skip returning focus on close?',
  },
  {
    id: 'react-aria-live-regions-dynamic-content',
    category: 'react',
    difficulty: 'Intermediate',
    topic: 'Accessibility',
    title: 'How do ARIA live regions announce dynamic content changes to screen readers?',
    summary: 'An element marked with aria-live tells assistive technology to announce content changes inside it automatically, even when focus is elsewhere on the page.',
    explanation: 'By default, screen readers only announce content that receives focus or is part of the initial page read-through, so dynamically injected content like a toast notification, form validation error, or live search result count would be silently missed. Adding aria-live="polite" to a container tells the screen reader to announce updates to that region\'s content after the user\'s current activity finishes, while aria-live="assertive" interrupts immediately for urgent messages like errors. The element must exist in the DOM before the content changes (screen readers watch a live region for mutations), so a common bug is conditionally rendering the live region itself rather than keeping it mounted and just changing its text content.',
    code: `function StatusMessage({ message }) {
  // Kept mounted at all times; only its text content changes
  return (
    <div aria-live="polite" role="status" className="sr-only-visible">
      {message}
    </div>
  );
}

function SearchResults({ results, loading }) {
  const status = loading ? 'Searching...' : \\\`\\\${results.length} results found\\\`;
  return (
    <>
      <StatusMessage message={status} />
      <ul>{results.map((r) => <li key={r.id}>{r.title}</li>)}</ul>
    </>
  );
}`,
    interviewQuestion: 'Why won\'t a screen reader announce a dynamically added toast notification unless it uses aria-live, and what is the difference between "polite" and "assertive"?',
  },
  {
    id: 'react-usetransition-vs-debounce-search',
    category: 'react',
    difficulty: 'Advanced',
    topic: 'Concurrent Features',
    title: 'useTransition vs debouncing: which should you use for a search input?',
    summary: 'useTransition keeps the input responsive by deprioritizing the expensive re-render on every keystroke, while debouncing delays even starting the work until typing pauses.',
    explanation: 'Debouncing a search input delays firing the expensive operation (like an API call or heavy filtering) until the user stops typing for a set delay, which reduces the number of times the work runs but means results only start appearing after that delay. useTransition instead lets every keystroke update the input immediately (as a synchronous, high-priority update) while marking the resulting expensive list re-render as a low-priority transition that React can interrupt or delay if the user keeps typing, so intermediate results can still render without ever blocking the input field. In practice, these solve different problems and can be combined: debounce network requests to avoid hammering an API, while using useTransition (or useDeferredValue) to keep local rendering of large lists from janking the input, regardless of network timing.',
    code: `function SearchBox({ allItems }) {
  const [query, setQuery] = useState('');
  const [isPending, startTransition] = useTransition();
  const [results, setResults] = useState(allItems);

  function handleChange(e) {
    setQuery(e.target.value); // urgent: input stays responsive immediately
    startTransition(() => {
      setResults(allItems.filter((i) => i.includes(e.target.value))); // low priority
    });
  }

  return (
    <>
      <input value={query} onChange={handleChange} />
      {isPending && <span>Updating...</span>}
      <ul>{results.map((r) => <li key={r}>{r}</li>)}</ul>
    </>
  );
}`,
    interviewQuestion: 'For a search-as-you-type feature, when would you reach for useTransition instead of debouncing, and can the two be used together?',
  },
  {
    id: 'react-error-boundary-limitations',
    category: 'react',
    difficulty: 'Advanced',
    topic: 'Error Boundaries',
    title: 'What are the limitations of React error boundaries?',
    summary: 'Error boundaries only catch errors thrown during rendering, in lifecycle methods, and in constructors of the tree below them — they do not catch errors in event handlers, async code, SSR, or errors in the boundary itself.',
    explanation: 'Error boundaries (class components implementing static getDerivedStateFromError or componentDidCatch) are explicitly scoped to render-phase errors in their child tree. They do not catch errors thrown inside event handlers (like an onClick callback throwing), because those run outside React\'s render cycle and must be handled with a normal try/catch. They also do not catch errors in asynchronous code such as setTimeout callbacks or promise rejections inside useEffect, errors during server-side rendering, or errors thrown by the error boundary\'s own render method. For event handler and async errors, the common pattern is a local try/catch that sets error state, which can then be surfaced with a manual "throw during render" trick to hand it off to an error boundary if desired.',
    code: `class ErrorBoundary extends React.Component {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error, info) { logErrorToService(error, info); }
  render() {
    return this.state.hasError ? <p>Something went wrong.</p> : this.props.children;
  }
}

function Button() {
  function handleClick() {
    try {
      riskyOperation(); // NOT caught by an error boundary; must try/catch locally
    } catch (err) {
      console.error(err);
    }
  }
  return <button onClick={handleClick}>Click</button>;
}`,
    interviewQuestion: 'Name three categories of errors that a React error boundary will not catch, and explain how you would handle each.',
  },
  {
    id: 'react-zustand-vs-redux-toolkit',
    category: 'react',
    difficulty: 'Intermediate',
    topic: 'State Management',
    title: 'What are the tradeoffs between Zustand and Redux Toolkit for state management?',
    summary: 'Zustand offers a minimal, boilerplate-free API built on hooks with no required providers, while Redux Toolkit provides a more structured, convention-heavy architecture with stronger tooling and middleware ecosystem.',
    explanation: 'Zustand stores are created with a single create() call that defines state and actions together in a plain function, consumed via a hook with built-in selector support so components only re-render when their selected slice changes, and it requires no Context Provider wrapping the app. Redux Toolkit enforces a more opinionated structure with slices, reducers, and actions generated via createSlice, immutable updates powered by Immer under the hood, and integrates with Redux DevTools for action-by-action time-travel debugging, plus a rich middleware ecosystem (thunks, sagas, RTK Query) suited to large teams needing consistency and traceability. Zustand tends to win for small-to-medium apps or teams wanting less ceremony, while Redux Toolkit tends to win for large codebases where strict conventions, powerful devtools, and a mature middleware ecosystem justify the extra structure.',
    code: `// Zustand: minimal store, no provider needed
import { create } from 'zustand';

const useCartStore = create((set) => ({
  items: [],
  addItem: (item) => set((state) => ({ items: [...state.items, item] })),
}));

function CartButton() {
  const addItem = useCartStore((state) => state.addItem); // selector avoids extra re-renders
  return <button onClick={() => addItem({ id: 1 })}>Add</button>;
}

// Redux Toolkit: slice-based, requires <Provider store={store}>
const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [] },
  reducers: { addItem: (state, action) => { state.items.push(action.payload); } },
});`,
    interviewQuestion: 'When would you choose Zustand over Redux Toolkit for a new project, and what capabilities would you be giving up?',
  },
  {
    id: 'react-colocate-vs-lift-state-decision',
    category: 'react',
    difficulty: 'Basic',
    topic: 'State Management',
    title: 'How do you decide between colocating state locally and lifting it up?',
    summary: 'State should live in the lowest common component that actually needs it — colocate it as deep as possible, and only lift it to a shared ancestor when multiple components must read or coordinate on that same state.',
    explanation: 'The default heuristic is to keep state as close as possible to where it is used, since colocated state minimizes re-render scope (only that subtree re-renders on change) and keeps components easier to reason about in isolation. State should be lifted to the nearest common ancestor only when two or more sibling components need to share or synchronize the same value, such as a filter control and a list that both depend on the same search term. Lifting state too eagerly "just in case" causes unnecessary prop drilling and widens the re-render blast radius to the shared parent and all its children, while failing to lift state when needed leads to duplicated, out-of-sync copies of the same logical value. This decision should be revisited as the component tree evolves rather than decided once upfront.',
    code: `// Over-lifted: isOpen only used by Accordion, no reason for Page to own it
function Page() {
  const [isOpen, setIsOpen] = useState(false); // unnecessary lift
  return <Accordion isOpen={isOpen} setIsOpen={setIsOpen} />;
}

// Correctly colocated
function Accordion() {
  const [isOpen, setIsOpen] = useState(false); // stays local, no one else needs it
  return (
    <div>
      <button onClick={() => setIsOpen((o) => !o)}>Toggle</button>
      {isOpen && <p>Details...</p>}
    </div>
  );
}

// Correctly lifted: both SearchBox and ResultsList need the same query
function SearchPage() {
  const [query, setQuery] = useState('');
  return (
    <>
      <SearchBox query={query} onChange={setQuery} />
      <ResultsList query={query} />
    </>
  );
}`,
    interviewQuestion: 'What signal tells you it is time to lift state up rather than keep it colocated in a single component?',
  },

{
    id: 'reactnative-fast-image-vs-image',
    category: 'reactnative',
    difficulty: 'Intermediate',
    topic: 'Performance',
    title: 'How does react-native-fast-image improve on the built-in Image component?',
    summary: 'react-native-fast-image wraps native image loading libraries (SDWebImage on iOS, Glide on Android) to give aggressive disk/memory caching, priority loading, and fewer flicker/re-download issues than the core Image component.',
    explanation: 'The core RN Image component relies on platform default caching which is inconsistent between iOS and Android and often re-fetches images that should be cached, causing flicker on list scroll. FastImage delegates to native, battle-tested caching libraries (SDWebImage/Glide) that support disk cache TTL control, priority hints (low/normal/high), and preloading via FastImage.preload(). It also exposes explicit cache control values (immutable, web, cacheOnly) so you can decide whether a URL response should be treated as versioned content. The tradeoff is an extra native dependency that must be linked and kept compatible with new architecture; on Fabric, some teams now prefer expo-image which has native Fabric support built in.',
    code: `import FastImage from 'react-native-fast-image';

function Avatar({ uri }) {
  return (
    <FastImage
      style={{ width: 64, height: 64, borderRadius: 32 }}
      source={{
        uri,
        priority: FastImage.priority.high,
        cache: FastImage.cacheControl.immutable,
      }}
      resizeMode={FastImage.resizeMode.cover}
    />
  );
}`,
    interviewQuestion: 'Why might a long FlatList of remote images flicker when scrolling with the core Image component, and how does FastImage address it?',
  },
  {
    id: 'reactnative-mmkv-vs-asyncstorage',
    category: 'reactnative',
    difficulty: 'Advanced',
    topic: 'Storage',
    title: 'Why is react-native-mmkv significantly faster than AsyncStorage?',
    summary: 'MMKV is a synchronous, JSI-backed key-value store using memory-mapped files, avoiding the async bridge round-trips that AsyncStorage requires, making reads/writes roughly 10-30x faster.',
    explanation: 'AsyncStorage on the old architecture serializes every operation across the bridge as a JSON message, and even its new-architecture implementation is still promise-based and involves thread hops. MMKV, built on JSI, exposes synchronous host functions directly callable from JS, backed by memory-mapped files so the OS handles paging efficiently without manual serialization overhead for each call. Because reads are synchronous, MMKV works well for storing things like auth tokens or feature flags that must be read during app startup before the first render. It also supports encryption and multiple named instances, useful for per-user data isolation. The main caveat is it requires a native rebuild (not usable in Expo Go) since it is a native module with JSI bindings.',
    code: `import { MMKV } from 'react-native-mmkv';

const storage = new MMKV({ id: 'user-storage', encryptionKey: 'secret-key' });

storage.set('authToken', 'abc123');
const token = storage.getString('authToken'); // synchronous, no await needed

storage.set('isOnboarded', true);
console.log(storage.getBoolean('isOnboarded'));`,
    interviewQuestion: 'A senior dev suggests replacing AsyncStorage with MMKV for a performance-critical settings screen. What tradeoffs would you raise before agreeing?',
  },
  {
    id: 'reactnative-watermelondb-offline-patterns',
    category: 'reactnative',
    difficulty: 'Advanced',
    topic: 'Offline Database',
    title: 'When would you reach for WatermelonDB or SQLite instead of AsyncStorage/MMKV for offline data?',
    summary: 'WatermelonDB (built on SQLite) is designed for apps with large, relational, frequently-queried datasets that need lazy loading and observable queries, unlike simple key-value stores.',
    explanation: 'AsyncStorage and MMKV are fine for flat key-value data, but once an app needs relational queries, pagination over thousands of records, or reactive UI updates when underlying rows change, a real database is required. WatermelonDB uses SQLite under the hood but adds a lazy-loading layer so records are only materialized into JS objects when accessed, keeping large lists performant. It exposes an Observable-based query API that integrates with React via withObservables, so components re-render automatically when their underlying data changes without manual cache invalidation. Sync is handled via a pull/push protocol you implement against your backend, which is well suited to offline-first apps like note-taking or CRM tools. The cost is a steeper setup (native module, schema migrations, model classes) compared to just writing JSON blobs to MMKV.',
    code: `import { Model } from '@nozbe/watermelondb';
import { field, text } from '@nozbe/watermelondb/decorators';

class Task extends Model {
  static table = 'tasks';
  @text('title') title;
  @field('is_done') isDone;
}

// Reactive query in a component
const tasksObservable = database.get('tasks').query().observe();`,
    interviewQuestion: 'Your app needs to store and query 50,000 offline records with filters and joins. Why would you choose WatermelonDB over AsyncStorage, and what does \'lazy loading\' mean in this context?',
  },
  {
    id: 'reactnative-screens-native-navigation-performance',
    category: 'reactnative',
    difficulty: 'Advanced',
    topic: 'Navigation',
    title: 'What performance problem does react-native-screens solve for React Navigation?',
    summary: 'react-native-screens replaces plain RN Views representing each route with native UIViewController (iOS) / Fragment (Android) screens, enabling the OS to unmount offscreen views and freeing memory/CPU.',
    explanation: 'Without react-native-screens, React Navigation keeps every visited screen mounted as a JS-driven View tree, meaning memory usage grows and background screens still consume rendering resources. react-native-screens wraps each route in a native screen container so the platform can properly manage lifecycle, detaching the native view hierarchy for inactive screens the same way native apps do, which reduces memory pressure and improves transition animation smoothness since transitions run on native UI components. It is required (not optional) as of recent React Navigation versions and enables features like native stack (createNativeStackNavigator) which uses fully native push/pop transitions instead of JS-animated ones. The `enableScreens()` call must run before any navigator renders, typically at the app\'s entry point.',
    code: `import { enableScreens } from 'react-native-screens';
enableScreens();

import { createNativeStackNavigator } from '@react-navigation/native-stack';
const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}`,
    interviewQuestion: 'What\'s the practical difference between createStackNavigator (JS-based) and createNativeStackNavigator, and why does react-native-screens matter for that difference?',
  },
  {
    id: 'reactnative-svg-transformer-setup',
    category: 'reactnative',
    difficulty: 'Intermediate',
    topic: 'Assets',
    title: 'How does react-native-svg-transformer let you import SVGs as React components?',
    summary: 'It hooks into the Metro bundler transform pipeline to convert .svg files into React components at build time, so you can `import Logo from \'./logo.svg\'` and render `<Logo />` directly.',
    explanation: 'By default Metro treats .svg files as opaque assets resolved to a URI, requiring react-native-svg\'s SvgUri or SvgXml to render them at runtime with extra parsing cost. react-native-svg-transformer instead registers a custom Metro transformer that runs SVGR at bundle time, converting the SVG markup into a react-native-svg component tree ahead of time, which is faster at runtime and gives you type-safe props like fill and width directly on the component. Setup requires editing metro.config.js to move svg out of assetExts and into sourceExts, and adding the transformer path. A common pitfall is forgetting to also update a TypeScript declaration file (`declarations.d.ts`) so `import Logo from \'./logo.svg\'` type-checks correctly.',
    code: `// metro.config.js
const { getDefaultConfig } = require('metro-config');

module.exports = (async () => {
  const { assetExts, sourceExts } = (await getDefaultConfig()).resolver;
  return {
    transformer: {
      babelTransformerPath: require.resolve('react-native-svg-transformer'),
    },
    resolver: {
      assetExts: assetExts.filter((ext) => ext !== 'svg'),
      sourceExts: [...sourceExts, 'svg'],
    },
  };
})();

// Usage
import Logo from './assets/logo.svg';
<Logo width={120} height={40} fill="#000" />;`,
    interviewQuestion: 'Why can\'t you just `import Logo from \'./logo.svg\'` and use it as a component in plain React Native without extra configuration?',
  },
  {
    id: 'reactnative-fabric-custom-component',
    category: 'reactnative',
    difficulty: 'Advanced',
    topic: 'New Architecture',
    title: 'What are the steps to build a custom native UI component for Fabric?',
    summary: 'Building a Fabric component requires defining a typed JS spec, generating native scaffolding via codegen, and implementing the native view (ComponentDescriptor, ShadowNode, and platform view classes) that Fabric composes into the shadow tree.',
    explanation: 'Unlike the old architecture where you subclassed RCTViewManager and manually bridged props, Fabric components are defined declaratively with a TypeScript/Flow spec using codegenNativeComponent, which Codegen uses to generate C++ ComponentDescriptors, ShadowNodes, and Props structs at build time. You then implement the native side: on iOS a Fabric-compatible RCTViewComponentView subclass, and on Android a ViewManager plus a corresponding C++ shadow node registration. This gives synchronous layout via Yoga integrated directly into the shadow tree, removing the async view-manager command queue that caused old-arch native views to lag behind gesture-driven UI. The tradeoff is significantly more native boilerplate and a build step dependency on codegen running correctly, which can be fragile across RN version upgrades.',
    code: `// NativeMyComponent.ts - Fabric component spec
import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';
import type { ViewProps } from 'react-native';
import type { Int32 } from 'react-native/Libraries/Types/CodegenTypes';

interface NativeProps extends ViewProps {
  cornerRadius?: Int32;
}

export default codegenNativeComponent<NativeProps>('MyFancyView');`,
    interviewQuestion: 'How does defining a UI component for Fabric differ from writing a RCTViewManager on the old architecture?',
  },
  {
    id: 'reactnative-turbomodule-codegen-walkthrough',
    category: 'reactnative',
    difficulty: 'Advanced',
    topic: 'New Architecture',
    title: 'Walk through the codegen process for a TurboModule',
    summary: 'You write a TypeScript spec extending TurboModule, Codegen parses it at build time to generate native interface code (Java/ObjC/C++), and your native implementation conforms to that generated interface instead of manually bridging types.',
    explanation: 'A TurboModule starts as a `NativeModuleName.ts` spec file exporting an interface extending TurboModuleRegistry\'s TurboModule type, with method signatures using Codegen-supported types only (no arbitrary objects without explicit shape). During the build, the Codegen tool scans specs matching the codegenConfig in package.json and emits generated native scaffolding: Java interfaces on Android, Objective-C protocols on iOS, and shared C++ structures used by JSI to marshal calls without going through the JSON bridge. Your handwritten native class implements the generated interface (e.g., `NativeMyModuleSpec` on Android) and gets registered in a provider so JS can call `TurboModuleRegistry.getEnforcing()` and receive a JSI-backed object with real functions instead of a bridge proxy. This means calls can be synchronous and type-checked, unlike the old NativeModules bridge which always serialized to JSON and was inherently asynchronous.',
    code: `// NativeMyModule.ts
import type { TurboModule } from 'react-native/Libraries/TurboModule/RCTExport';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  multiply(a: number, b: number): number;
}

export default TurboModuleRegistry.getEnforcing<Spec>('MyModule');

// Usage
import MyModule from './NativeMyModule';
console.log(MyModule.multiply(3, 4)); // synchronous JSI call`,
    interviewQuestion: 'Why must TurboModule spec files restrict themselves to Codegen-supported types instead of arbitrary JS objects?',
  },
  {
    id: 'reactnative-config-multi-environment',
    category: 'reactnative',
    difficulty: 'Intermediate',
    topic: 'Build Config',
    title: 'How do you manage dev/staging/prod environments with react-native-config?',
    summary: 'react-native-config reads key-value pairs from .env files at native build time and injects them as native BuildConfig/Info.plist values plus a JS Config object, letting you switch API URLs and secrets per build variant without code changes.',
    explanation: 'The library reads a `.env` file (or environment-specific files like `.env.staging`) and exposes those values both to JS via `import Config from \'react-native-config\'` and natively (Android BuildConfig fields, iOS Info.plist placeholders), which is important because some values like API keys for crash reporting need to be available before JS even loads. Multi-environment setup typically means creating `.env.development`, `.env.staging`, `.env.production` and configuring Android product flavors or iOS schemes/xcconfig files to pick the right file at build time via an ENVFILE environment variable. A common gotcha is that changing a `.env` value requires a full native rebuild, not just a JS reload, because Android/iOS bake the values into native build artifacts at compile time. Secrets checked into `.env` files also should never include production credentials if the repo is public; those should come from CI secret injection instead.',
    code: `// .env.staging
API_URL=https://staging-api.example.com
SENTRY_DSN=https://staging-dsn

// Build command
// ENVFILE=.env.staging react-native run-android

// Usage in JS
import Config from 'react-native-config';

fetch(\`\${Config.API_URL}/users\`);`,
    interviewQuestion: 'Why does changing a value in your .env file require a native rebuild instead of just reloading the JS bundle?',
  },
  {
    id: 'reactnative-codepush-rollback-strategies',
    category: 'reactnative',
    difficulty: 'Advanced',
    topic: 'OTA Updates',
    title: 'What rollback strategies exist for a bad CodePush release?',
    summary: 'CodePush supports automatic rollback on crash detection via checkForUpdate/notifyAppReady, plus manual rollback by promoting a previous release or issuing a rollback deployment, and staged rollout percentages to limit blast radius.',
    explanation: 'The critical safety mechanism is calling `codePush.notifyAppReady()` (or using the HOC\'s automatic behavior) after a new bundle boots successfully; if the app crashes before this call on the first few launches, the native CodePush runtime automatically reverts to the last known-good bundle, preventing a bricked app. For releases that are technically stable but functionally broken, you use the CLI\'s `appcenter codepush rollback` command (or App Center dashboard) to redeploy the previous label as a new release, since CodePush doesn\'t literally undo history — it always moves forward by pointing clients at an earlier package\'s contents. Staged rollout via the `rollout` percentage parameter lets you release to e.g. 20% of users first, monitor crash telemetry, and only promote to 100% once confidence is established, which limits exposure if a broken bundle slips through. It\'s also important to gate rollback detection with a reasonable retry threshold, since a single transient crash unrelated to the update shouldn\'t trigger a full rollback.',
    code: `import codePush from 'react-native-code-push';

function App() {
  useEffect(() => {
    codePush.sync(
      { installMode: codePush.InstallMode.ON_NEXT_RESTART },
      (status) => console.log('CodePush status', status)
    );
  }, []);

  useEffect(() => {
    // Confirms this bundle is good; enables auto-rollback if omitted and app crashes
    codePush.notifyAppReady();
  }, []);

  return <RootNavigator />;
}`,
    interviewQuestion: 'You shipped a CodePush update that causes a crash loop for some users. Walk through how CodePush detects and recovers from this automatically, and what you\'d do manually.',
  },
  {
    id: 'reactnative-ota-version-gating',
    category: 'reactnative',
    difficulty: 'Tricky',
    topic: 'OTA Updates',
    title: 'Why do OTA updates (CodePush/EAS Update) need native binary version gating?',
    summary: 'OTA updates can only ship JS/asset changes, so an update package must be scoped to a matching native binary version — otherwise a JS bundle expecting a native API or module that only exists in a newer app store build will crash.',
    explanation: 'App stores review native binary changes (new native modules, permission entries, SDK bumps), but OTA channels bypass review by only swapping the JS bundle, so if you push JS code that calls a native module method added in binary v1.5 to users still running binary v1.4, it will throw at runtime. Both CodePush and EAS Update solve this with target version constraints — CodePush\'s `--target-binary-version` semver range, and EAS Update\'s channel-to-runtimeVersion mapping — so an update is only served to devices whose native runtime is compatible. `runtimeVersion` in Expo specifically should change whenever you add/modify native code, forcing a fresh binary build and preventing incompatible OTA delivery. Getting this wrong is a classic production incident: a policy of \'runtimeVersion: appVersion\' that isn\'t bumped after a native dependency upgrade will silently serve broken JS to old binaries.',
    code: `// app.json (Expo/EAS Update)
{
  "expo": {
    "runtimeVersion": { "policy": "appVersion" },
    "updates": {
      "url": "https://u.expo.dev/your-project-id"
    }
  }
}

// CodePush equivalent: restrict update to compatible binaries
// appcenter codepush release-react -a Org/App \\
//   --target-binary-version "~1.5.0"`,
    interviewQuestion: 'A user on an old app store build gets a crash right after opening the app following an OTA update push. What\'s the most likely root cause and how do version gating mechanisms prevent it?',
  },
  {
    id: 'reactnative-device-info-common-uses',
    category: 'reactnative',
    difficulty: 'Basic',
    topic: 'Native Modules',
    title: 'What common problems does react-native-device-info solve?',
    summary: 'react-native-device-info exposes native device metadata like model, OS version, unique/installation IDs, battery level, and whether the app is running on an emulator — data JS cannot access on its own.',
    explanation: 'Common uses include feature-flagging behavior based on device tier (e.g., disabling heavy animations on low-end Android devices via `getTotalMemory()`), detecting emulators to skip certain flows during automated testing (`isEmulator()`), and reading app/build metadata like `getVersion()` and `getBuildNumber()` for support tickets or force-update checks. It also provides `getUniqueId()` for a (resettable) install-scoped identifier useful for analytics correlation without relying on advertising IDs, and battery/power state APIs for pausing background work when the device is low on battery. Most methods have both sync and async variants; the sync ones are cached at app start and are cheaper to call repeatedly but won\'t reflect state changes (like battery level) without calling the async version again.',
    code: `import DeviceInfo from 'react-native-device-info';

async function logDeviceContext() {
  const isEmulator = await DeviceInfo.isEmulator();
  const version = DeviceInfo.getVersion();
  const battery = await DeviceInfo.getBatteryLevel();

  console.log({ isEmulator, version, battery });
}`,
    interviewQuestion: 'How would you disable expensive visual effects specifically on low-end Android devices, and what package would you reach for?',
  },
  {
    id: 'reactnative-force-update-flow',
    category: 'reactnative',
    difficulty: 'Intermediate',
    topic: 'App Lifecycle',
    title: 'How do you implement a force-update flow when a minimum app version is required?',
    summary: 'On app start, fetch a minimum-supported-version config from your backend (or a remote config service), compare it to the installed app version via react-native-device-info, and block the UI with an update prompt if the installed version is below the minimum.',
    explanation: 'The pattern is: maintain a remote config endpoint or Firebase Remote Config value like `minSupportedVersion`, fetch it during app bootstrap (ideally with a timeout and cached fallback so a network failure doesn\'t block the whole app), and compare against `DeviceInfo.getVersion()` using a semver comparison library since string comparison ("1.10.0" < "1.9.0") is incorrect. If the installed version is below the minimum, render a full-screen blocking modal with a button linking to the App Store/Play Store listing instead of the normal navigator, and make sure this check can\'t be bypassed by backgrounding/foregrounding the app. A softer \'recommended update\' tier (dismissible, shown periodically) is often paired with the hard block tier so you\'re not always forcing updates for minor issues. This pattern is separate from and complements OTA updates — force-update handles cases where a native rebuild is mandatory and OTA can\'t fix the issue.',
    code: `import semver from 'semver';
import DeviceInfo from 'react-native-device-info';

async function checkForceUpdate() {
  const { minVersion } = await fetch('https://api.example.com/config').then((r) => r.json());
  const current = DeviceInfo.getVersion();

  if (semver.lt(current, minVersion)) {
    return { mustUpdate: true };
  }
  return { mustUpdate: false };
}`,
    interviewQuestion: 'Why can\'t you just do a plain string comparison to check if the installed app version is below a required minimum version?',
  },
  {
    id: 'reactnative-deep-link-testing-uri-scheme',
    category: 'reactnative',
    difficulty: 'Basic',
    topic: 'Deep Linking',
    title: 'How do you test deep links locally with npx uri-scheme?',
    summary: 'npx uri-scheme lets you simulate opening a custom URL scheme link on a running simulator/emulator, so you can verify your app\'s Linking/navigation handling without needing an actual external trigger like an SMS or email link.',
    explanation: 'The command `npx uri-scheme open myapp://profile/42 --ios` (or `--android`) sends an intent/URL open event to the currently booted simulator or emulator exactly as if the OS had routed a real link, which triggers your app\'s `Linking` listener or React Navigation\'s linking config the same way a production deep link would. This is essential for iterating on deep link routes during development since you don\'t need to publish a webpage or send yourself a text message every time you want to test `myapp://checkout?orderId=123`. It only tests custom scheme links, not universal links/App Links (https:// based), which require separate testing via Safari/Chrome or `xcrun simctl openurl` with an https URL and proper AASA/assetlinks verification. A common gotcha is forgetting the app must already be built with the scheme registered in Info.plist/AndroidManifest for the OS to route it to your app at all.',
    code: `# Open a custom scheme deep link on iOS simulator
npx uri-scheme open "myapp://product/123" --ios

# Same on Android emulator
npx uri-scheme open "myapp://product/123" --android

# List all schemes registered by installed apps (iOS)
npx uri-scheme list --ios`,
    interviewQuestion: 'You want to verify your app correctly navigates to a product screen when opened via myapp://product/123, without building a test webpage. How do you do it?',
  },
  {
    id: 'reactnative-universal-links-vs-app-links-setup',
    category: 'reactnative',
    difficulty: 'Advanced',
    topic: 'Deep Linking',
    title: 'What\'s different about setting up iOS Universal Links vs Android App Links?',
    summary: 'Both let https:// URLs open your app directly instead of a browser, but iOS verifies ownership via an apple-app-site-association file plus Associated Domains entitlement, while Android verifies via assetlinks.json plus intent-filter autoVerify, and each has different fallback/debugging behavior.',
    explanation: 'For iOS, you host a signed `apple-app-site-association` (AASA) JSON file at `https://yourdomain.com/.well-known/apple-app-site-association` (no file extension, served with correct content-type, no redirects) listing your app ID and allowed paths, and add the domain under Associated Domains capability with `applinks:yourdomain.com` in your entitlements. Apple fetches and caches this file at install/update time via Apple\'s CDN, so changes can take time to propagate and are hard to debug — Apple provides a validation tool but there\'s no simple "reverify now" button for a specific device. For Android, you host `assetlinks.json` at `/.well-known/assetlinks.json` with your package name and SHA-256 signing cert fingerprint, and add `<intent-filter android:autoVerify="true">` with your host in AndroidManifest.xml; verification happens at install time and can be checked immediately via `adb shell pm get-app-links`. A key behavioral difference: if verification fails, iOS Universal Links silently fall back to opening Safari, while Android historically showed a disambiguation dialog (or also fell back to browser) — both effectively degrade gracefully but debugging why verification failed differs significantly per platform.',
    code: `// iOS entitlements
// com.apple.developer.associated-domains: ["applinks:example.com"]

// Android AndroidManifest.xml
// <intent-filter android:autoVerify="true">
//   <action android:name="android.intent.action.VIEW" />
//   <category android:name="android.intent.category.DEFAULT" />
//   <category android:name="android.intent.category.BROWSABLE" />
//   <data android:scheme="https" android:host="example.com" />
// </intent-filter>

// Verify Android App Links on device
// adb shell pm get-app-links com.example.app`,
    interviewQuestion: 'A universal link works fine on Android but just opens Safari instead of your app on iOS. What are the likely causes and how would you debug it?',
  },
  {
    id: 'reactnative-share-integration',
    category: 'reactnative',
    difficulty: 'Basic',
    topic: 'Native APIs',
    title: 'How do you use React Native\'s Share API (or react-native-share) to share content?',
    summary: 'The core `Share` module opens the native OS share sheet for text/URLs with minimal setup, while react-native-share adds support for sharing images/files, targeting specific apps, and social-media-specific options.',
    explanation: 'React Native ships a built-in `Share.share({ message, url, title })` API that opens the native activity sheet (iOS) or chooser intent (Android) for sharing plain text or a URL, and its promise resolves with the action taken (shared or dismissed) which is useful for analytics. When you need to share binary content like an image or PDF, or want to open a specific app (e.g., share directly to Instagram Stories or WhatsApp), the core API falls short and teams reach for `react-native-share`, which accepts base64 data URLs or file paths and exposes `Share.shareSingle()` for targeting one specific social app\'s package/scheme. A common pitfall on iOS is that sharing a local file requires it to already exist on disk with a `file://` URI (often after downloading a remote asset first), and on Android some file providers require a FileProvider configuration in the manifest to avoid a FileUriExposedException.',
    code: `import { Share } from 'react-native';

async function shareArticle() {
  try {
    const result = await Share.share({
      message: 'Check out this article!',
      url: 'https://example.com/article/42',
      title: 'Great read',
    });
    if (result.action === Share.sharedAction) {
      console.log('Shared successfully');
    }
  } catch (error) {
    console.error(error);
  }
}`,
    interviewQuestion: 'The built-in Share API isn\'t letting you share a downloaded image directly to Instagram Stories. What would you use instead and why?',
  },
  {
    id: 'reactnative-photo-library-permissions-cross-platform',
    category: 'reactnative',
    difficulty: 'Intermediate',
    topic: 'Permissions',
    title: 'How do camera roll / photo library permissions differ between iOS and Android?',
    summary: 'iOS uses a single NSPhotoLibraryUsageDescription permission (with an optional limited-access tier since iOS 14), while Android splits access into READ_MEDIA_IMAGES/READ_MEDIA_VIDEO (API 33+) or READ_EXTERNAL_STORAGE on older versions, plus a Photo Picker that needs no permission at all.',
    explanation: 'On iOS, requesting photo library access triggers a system prompt governed by the `NSPhotoLibraryUsageDescription` Info.plist key, and since iOS 14 users can grant "Limited Access" to only selected photos rather than the whole library, which your app must handle gracefully (e.g., PHPickerViewController respects this automatically). On Android 13+ (API 33), the old blanket `READ_EXTERNAL_STORAGE` permission was split into granular `READ_MEDIA_IMAGES` and `READ_MEDIA_VIDEO`, and Android also introduced a Photo Picker (`ACTION_PICK_IMAGES`) that lets users select photos without granting the app any storage permission at all, similar in spirit to iOS\'s limited access. Libraries like `react-native-permissions` or `expo-image-picker` abstract some of this, but you still need to branch logic by `Platform.Version` to request the correct permission string, since requesting `READ_MEDIA_IMAGES` on an API 32 device or `READ_EXTERNAL_STORAGE` on API 33+ can behave inconsistently or trigger Play Store policy warnings if declared unnecessarily. A frequent interview trap is assuming one permission request covers both platforms identically — it never does.',
    code: `import { PermissionsAndroid, Platform } from 'react-native';

async function requestPhotoPermission() {
  if (Platform.OS === 'android') {
    const permission =
      Platform.Version >= 33
        ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
        : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;
    const granted = await PermissionsAndroid.request(permission);
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  }
  // iOS: handled via Info.plist prompt + a picker library
  return true;
}`,
    interviewQuestion: 'Your photo picker feature works on an Android 12 device but the permission request silently does nothing useful on Android 13. What changed and how do you fix it?',
  },
  {
    id: 'reactnative-websocket-reconnection-strategy',
    category: 'reactnative',
    difficulty: 'Advanced',
    topic: 'Networking',
    title: 'How should a React Native app handle WebSocket reconnection reliably?',
    summary: 'Reliable reconnection needs exponential backoff with jitter, resubscription of channels/state after reconnect, and awareness of app foreground/background and AppState/NetInfo events since mobile connections drop far more often than on web.',
    explanation: 'Mobile networks switch between WiFi/cellular, apps get backgrounded (which can suspend socket activity or have the OS kill the connection), and simply retrying immediately after every drop can hammer the server and drain battery, so production implementations use exponential backoff with jitter (e.g., base 1s, doubling up to a cap like 30s, plus random jitter to avoid thundering herd across many clients reconnecting simultaneously). On reconnect, the client must replay any subscription state (re-join rooms, resend auth) since a new WebSocket connection has no memory of prior subscriptions server-side unless the server itself persists session state keyed by a client ID. Listening to `AppState` to proactively close/reopen sockets on background/foreground transitions, and `NetInfo` to avoid attempting reconnects while offline (retry only once connectivity is confirmed restored), avoids wasted reconnect attempts. A subtle bug to watch for: not cleaning up the old socket\'s event listeners before creating a new one on reconnect, which causes duplicate message handling.',
    code: `function useReliableSocket(url) {
  const wsRef = useRef(null);
  const attemptRef = useRef(0);

  const connect = useCallback(() => {
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => { attemptRef.current = 0; };
    ws.onclose = () => {
      const delay = Math.min(30000, 1000 * 2 ** attemptRef.current) + Math.random() * 500;
      attemptRef.current += 1;
      setTimeout(connect, delay);
    };
  }, [url]);

  useEffect(() => { connect(); return () => wsRef.current?.close(); }, [connect]);
}`,
    interviewQuestion: 'Your chat app\'s WebSocket disconnects every time the phone switches from WiFi to cellular. How would you design the reconnection logic to handle this gracefully?',
  },
  {
    id: 'reactnative-backhandler-android-back-button',
    category: 'reactnative',
    difficulty: 'Intermediate',
    topic: 'Platform APIs',
    title: 'How do you correctly handle the Android hardware/gesture back button with BackHandler?',
    summary: 'BackHandler.addEventListener("hardwareBackPress", handler) lets you intercept the Android back action; returning true consumes it (preventing default exit/pop), and returning false/undefined lets it propagate to the default behavior (usually navigation pop or app exit).',
    explanation: 'The handler you register must return a boolean synchronously: `true` means you\'ve handled the back press yourself (e.g., closing a modal, confirming exit with a dialog) and the system should do nothing further, while `false` lets the event bubble to the next handler or the default OS behavior. A common bug is registering a listener in a component that mounts on every screen without removing it on unmount, causing stale closures to run or multiple handlers to fire; the return value from `addEventListener` in newer RN versions is a subscription object with a `.remove()` method that must be called in a cleanup function. On modern Android (predictive back gesture, Android 13+), the same API still applies but Google is pushing apps toward the AndroidX back-press APIs for smoother gesture animations, which React Navigation integrates automatically — so most apps don\'t need manual BackHandler code except for custom cases like double-tap-to-exit or confirming unsaved changes.',
    code: `import { BackHandler } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

useFocusEffect(
  useCallback(() => {
    const onBackPress = () => {
      if (hasUnsavedChanges) {
        Alert.alert('Discard changes?', '', [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Discard', onPress: () => navigation.goBack() },
        ]);
        return true; // consume the event
      }
      return false; // let default back behavior happen
    };
    const sub = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => sub.remove();
  }, [hasUnsavedChanges])
);`,
    interviewQuestion: 'You need to show a confirmation dialog when the user presses the Android back button on a form with unsaved changes. How do you implement this, and what does the handler\'s return value control?',
  },
  {
    id: 'reactnative-proguard-r8-shrinking-android-release',
    category: 'reactnative',
    difficulty: 'Tricky',
    topic: 'Build Config',
    title: 'What do ProGuard/R8 shrinking rules do for a React Native Android release build, and why do they sometimes break things?',
    summary: 'R8 (ProGuard\'s successor, default in modern Android Gradle Plugin) shrinks, obfuscates, and optimizes Android release bytecode to reduce APK size, but overly aggressive rules can strip classes accessed via reflection — including native modules registered dynamically — causing runtime crashes that only appear in release builds.',
    explanation: 'R8 combines tree-shaking (removing unused classes/methods), obfuscation (renaming classes/fields to shorter names), and bytecode optimization into a single pass, replacing the older separate ProGuard tool, and is enabled by setting `minifyEnabled true` in the release buildType. React Native and many native modules rely on reflection to discover and register native modules/view managers at runtime, and R8\'s static analysis can\'t always see these reflective references, so without correct `-keep` rules in `proguard-rules.pro`, a class needed at runtime gets stripped or renamed and the app crashes with a `ClassNotFoundException` or `NoSuchMethodError` — critically, only in release builds, since debug builds skip minification entirely, making this a classic \'works on my machine, crashes in production\' bug. Most third-party RN libraries ship their own recommended ProGuard rules in their documentation/README that must be manually added (or are auto-included via consumer ProGuard rules bundled in their AAR), and diagnosing a stripped-class crash typically involves reading the R8 mapping.txt file to un-obfuscate a release stack trace. Because R8 runs per-build-variant, a rule that works for one library but conflicts with another\'s `-keep` requirements can require careful ordering/scoping in the rules file.',
    code: `# android/app/proguard-rules.pro
# Keep RN's own bridge classes and third-party native modules from being stripped
-keep class com.facebook.react.** { *; }
-keep class com.facebook.hermes.unicode.** { *; }
-keep class com.yourlib.reactnativesomething.** { *; }

# android/app/build.gradle
buildTypes {
  release {
    minifyEnabled true
    shrinkResources true
    proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
  }
}`,
    interviewQuestion: 'A native module works perfectly in your debug build but throws NoSuchMethodError in the release APK. What\'s the likely cause and how do you fix it?',
  },
  {
    id: 'reactnative-snapshot-testing-native-pitfalls',
    category: 'reactnative',
    difficulty: 'Tricky',
    topic: 'Testing',
    title: 'What pitfalls make snapshot testing risky for React Native components with native dependencies?',
    summary: 'Snapshots of components wrapping native modules or platform-specific rendering often produce noisy, environment-dependent diffs (mocked native values, non-deterministic IDs, platform branches) that make failures meaningless and encourage blind snapshot updates rather than real bug detection.',
    explanation: 'Jest\'s default RN preset mocks most native modules, so a snapshot of a component using, say, `react-native-device-info` or a native date formatter captures whatever the mock returns rather than real device behavior, meaning the snapshot doesn\'t actually validate anything meaningful about production output and can pass even when the real native integration is broken. Snapshots are also brittle across unrelated changes — updating a third-party UI library\'s internal DOM structure, or even a minor RN version bump changing default accessibility props, can produce a huge diff unrelated to the change you actually made, training developers to reflexively run `jest --ci=false -u` without reading the diff, which defeats the test\'s purpose entirely. Non-deterministic values (timestamps, generated IDs, `Math.random()`-based keys) will cause flaky snapshot failures unless explicitly mocked to fixed values before rendering. Because of these issues, many RN teams limit snapshot testing to small, purely presentational components with stable props and rely on RTL\'s interaction/assertion-based tests (checking specific text/roles are present) for anything involving native modules or complex conditional rendering, since those tests fail with an actionable message instead of an opaque diff.',
    code: `// Risky: snapshot depends on native-mocked/non-deterministic values
test('renders profile card', () => {
  const tree = render(<ProfileCard lastSeen={Date.now()} deviceId={DeviceInfo.getUniqueId()} />);
  expect(tree.toJSON()).toMatchSnapshot(); // flaky across runs/mocks
});

// Better: assert specific, stable, user-facing output
test('renders profile card', () => {
  render(<ProfileCard name="Sam" lastSeen={FIXED_TIMESTAMP} />);
  expect(screen.getByText('Sam')).toBeVisible();
});`,
    interviewQuestion: 'A snapshot test keeps failing on every CI run even though nobody touched the related component. What are the likely causes, and why might blindly running the snapshot update flag be dangerous?',
  },

{
    id: 'nextjs-use-action-state-hook',
    category: 'nextjs',
    difficulty: 'Intermediate',
    topic: 'Server Actions',
    title: 'How does useActionState (formerly useFormState) work with Server Actions?',
    summary: 'useActionState lets a client component track the pending state and last returned value of a Server Action across form submissions.',
    explanation: 'useActionState is a React 19 hook (re-exported by Next.js) that wraps a Server Action and returns [state, formAction, isPending]. The action receives the previous state as its first argument, making it easy to return validation errors or success messages and re-render the form with that state. Because it integrates directly with the <form action={formAction}> attribute, it works even before JavaScript hydrates, since the underlying mechanism is still a real form submission. isPending replaces manual loading-state bookkeeping that used to require useState plus useTransition. This pattern is the recommended way to surface server-side validation errors next to form fields in the App Router.',
    code: `'use client';\nimport { useActionState } from 'react';\nimport { submitFeedback } from './actions';\n\nconst initialState = { message: '' };\n\nexport function FeedbackForm() {\n  const [state, formAction, isPending] = useActionState(submitFeedback, initialState);\n  return (\n    <form action={formAction}>\n      <textarea name=\"feedback\" required />\n      {state.message && <p aria-live=\"polite\">{state.message}</p>}\n      <button disabled={isPending}>{isPending ? 'Sending...' : 'Send'}</button>\n    </form>\n  );\n}`,
    interviewQuestion: 'How would you show a server-side validation error inline in a form after submitting a Server Action, and why is useActionState preferable to manual useState here?',
  },
  {
    id: 'nextjs-use-form-status-hook',
    category: 'nextjs',
    difficulty: 'Intermediate',
    topic: 'Server Actions',
    title: 'What does useFormStatus provide and where can it be used?',
    summary: 'useFormStatus reads the pending state of the nearest parent <form> submission without prop drilling, but only inside a component rendered as a descendant of that form.',
    explanation: 'useFormStatus is a React DOM hook designed to let child components like a submit button know whether the enclosing form is currently submitting, without the parent needing to pass a loading prop down manually. It must be called from a component that is rendered inside the <form>, not the same component that renders the <form> itself, because it reads context provided by the form element. It returns pending, data, method, and action. This is commonly used to build a reusable <SubmitButton /> that disables itself and shows a spinner during any form it is placed in, keeping that logic decoupled from the specific action being called.',
    code: `'use client';\nimport { useFormStatus } from 'react-dom';\n\nexport function SubmitButton() {\n  const { pending } = useFormStatus();\n  return (\n    <button type=\"submit\" disabled={pending}>\n      {pending ? 'Saving...' : 'Save'}\n    </button>\n  );\n}\n\n// Usage: <form action={saveAction}><SubmitButton /></form>`,
    interviewQuestion: 'Why does useFormStatus return pending: false if called in the same component that renders the <form> tag?',
  },
  {
    id: 'nextjs-use-optimistic-server-actions',
    category: 'nextjs',
    difficulty: 'Advanced',
    topic: 'Server Actions',
    title: 'How do you build optimistic UI updates with useOptimistic and Server Actions?',
    summary: 'useOptimistic lets you render a predicted UI state immediately while a Server Action is still in flight, then reconciles with the real server response.',
    explanation: 'useOptimistic takes the current state and an update function, returning an optimistic value that can be set synchronously inside a transition before the Server Action resolves. When the form is submitted, you call the optimistic setter with the predicted result (e.g., a new todo item), React renders it immediately, and once the Server Action completes and revalidation occurs, the real data from the server replaces the optimistic value. If the action throws, React automatically reverts to the previous confirmed state on the next render. This pattern is essential for snappy UX in list-based UIs like comments, likes, or todo apps where waiting for a round trip feels sluggish.',
    code: `'use client';\nimport { useOptimistic, useRef } from 'react';\nimport { addTodo } from './actions';\n\nexport function TodoList({ todos }: { todos: string[] }) {\n  const [optimisticTodos, addOptimisticTodo] = useOptimistic(\n    todos,\n    (state, newTodo: string) => [...state, newTodo]\n  );\n  const formRef = useRef<HTMLFormElement>(null);\n\n  return (\n    <form ref={formRef} action={async (formData) => {\n      const text = formData.get('todo') as string;\n      addOptimisticTodo(text);\n      formRef.current?.reset();\n      await addTodo(text);\n    }}>\n      <input name=\"todo\" />\n      <button type=\"submit\">Add</button>\n      <ul>{optimisticTodos.map((t, i) => <li key={i}>{t}</li>)}</ul>\n    </form>\n  );\n}`,
    interviewQuestion: 'What happens to the optimistic state rendered by useOptimistic if the underlying Server Action throws an error?',
  },
  {
    id: 'nextjs-streaming-server-action-responses',
    category: 'nextjs',
    difficulty: 'Tricky',
    topic: 'Server Actions',
    title: 'Can Server Actions stream responses back to the client?',
    summary: 'Server Actions can return async generators or use createStreamableValue-style patterns to progressively send data, though native streaming support is more limited than Route Handlers.',
    explanation: 'A Server Action executes on the server and returns a serialized result over the RSC protocol, so unlike a Route Handler you cannot directly return a ReadableStream from it in the same way. Instead, streaming UX from a Server Action is typically achieved by having the action kick off work and returning quickly, then using Suspense boundaries with a promise passed to a client component, or by using libraries like Vercel AI SDK which wrap streaming primitives around Server Actions using RSC-compatible streamable values. A common gotcha is that Server Actions are not designed for long-lived streaming connections like SSE; for token-by-token LLM output, teams often reach for a Route Handler with a ReadableStream instead, or use the AI SDK abstractions that hide this complexity.',
    code: `// actions.ts\n'use server';\nimport { createStreamableValue } from 'ai/rsc';\n\nexport async function generateStream() {\n  const stream = createStreamableValue('');\n  (async () => {\n    for (const chunk of ['Hello', ' ', 'world']) {\n      stream.update(chunk);\n      await new Promise((r) => setTimeout(r, 200));\n    }\n    stream.done();\n  })();\n  return { output: stream.value };\n}`,
    interviewQuestion: 'Why can\'t a Server Action simply return a ReadableStream like a Route Handler can, and what pattern do libraries like the Vercel AI SDK use instead?',
  },
  {
    id: 'nextjs-partial-prerendering-overview',
    category: 'nextjs',
    difficulty: 'Advanced',
    topic: 'Rendering',
    title: 'What is Partial Prerendering (PPR) in Next.js?',
    summary: 'Partial Prerendering combines a static shell served instantly from the CDN with dynamic, per-request content streamed in via Suspense boundaries, all from a single route.',
    explanation: 'PPR lets a single page have both static and dynamic parts without forcing the whole route into one rendering mode. At build time, Next.js prerenders everything outside Suspense boundaries into a static shell; anything wrapped in Suspense with dynamic data access (cookies, headers, uncached fetch) is left as a hole that gets rendered on the server per request and streamed in. The static shell is served immediately from the edge for a fast first paint, while dynamic content like a personalized cart or user greeting streams in shortly after. This is enabled per-route with the experimental_ppr route config export and requires the App Router with the canary or stable PPR flag depending on the Next.js version.',
    code: `// app/product/[id]/page.tsx\nexport const experimental_ppr = true;\n\nimport { Suspense } from 'react';\nimport { Reviews } from './reviews';\nimport { StaticProductInfo } from './static-info';\n\nexport default function ProductPage({ params }: { params: { id: string } }) {\n  return (\n    <div>\n      <StaticProductInfo id={params.id} />\n      <Suspense fallback={<p>Loading reviews...</p>}>\n        <Reviews id={params.id} />\n      </Suspense>\n    </div>\n  );\n}`,
    interviewQuestion: 'How does Partial Prerendering decide which parts of a page are included in the static shell versus rendered dynamically per request?',
  },
  {
    id: 'nextjs-unstable-cache-api',
    category: 'nextjs',
    difficulty: 'Advanced',
    topic: 'Caching',
    title: 'What does the unstable_cache function do?',
    summary: 'unstable_cache wraps an arbitrary async function, such as a database query, so its result is cached and revalidated using Next.js\'s Data Cache, similar to how fetch is cached automatically.',
    explanation: 'Unlike fetch, which Next.js automatically caches and dedupes, calls to a database client or ORM are not cached by default. unstable_cache(fn, keyParts, options) lets you opt any function into the same persistent Data Cache used by fetch, specifying a cache key and options like revalidate seconds and tags. This makes it possible to apply time-based or tag-based revalidation to non-fetch data sources such as Prisma or Drizzle queries. It is still marked unstable because the API surface may change, but it is widely used in production for caching expensive database reads behind revalidateTag-driven invalidation.',
    code: `import { unstable_cache } from 'next/cache';\nimport { db } from '@/lib/db';\n\nexport const getPopularPosts = unstable_cache(\n  async () => {\n    return db.post.findMany({ orderBy: { views: 'desc' }, take: 10 });\n  },\n  ['popular-posts'],\n  { revalidate: 3600, tags: ['posts'] }\n);`,
    interviewQuestion: 'Why would you wrap a Prisma query in unstable_cache instead of relying on Next.js\'s default fetch caching?',
  },
  {
    id: 'nextjs-tag-based-invalidation-strategy',
    category: 'nextjs',
    difficulty: 'Advanced',
    topic: 'Caching',
    title: 'How do you design a tag-based cache invalidation strategy?',
    summary: 'Tag-based invalidation groups related cached data under shared string tags so a single revalidateTag call can invalidate every cache entry tied to that resource, regardless of which route or fetch produced it.',
    explanation: 'Well-designed tagging assigns tags at the granularity you will actually invalidate at, e.g., post-${id} for a single post and posts for the list view, so updating one post can selectively bust just that post\'s cache and the list without over-invalidating unrelated pages. Tags are attached via the next: { tags: [...] } option on fetch or via the tags option in unstable_cache, and are invalidated with revalidateTag(tag) called from a Server Action or Route Handler, typically triggered by a mutation or an external webhook. A common mistake is using overly broad tags that force full-site cache clears, or overly narrow tags that miss dependent pages, so tagging should mirror the actual data relationships in the app. Combining tags with time-based revalidate as a fallback protects against a missed invalidation event.',
    code: `// lib/data.ts\nexport async function getPost(id: string) {\n  const res = await fetch(\`https://api.example.com/posts/\${id}\`, {\n    next: { tags: [\`post-\${id}\`, 'posts'] },\n  });\n  return res.json();\n}\n\n// app/actions.ts\n'use server';\nimport { revalidateTag } from 'next/cache';\n\nexport async function updatePost(id: string, data: FormData) {\n  await fetch(\`https://api.example.com/posts/\${id}\`, { method: 'PUT', body: data });\n  revalidateTag(\`post-\${id}\`);\n  revalidateTag('posts');\n}`,
    interviewQuestion: 'How would you structure cache tags so that editing a single blog post invalidates that post\'s page without unnecessarily invalidating every other cached page on the site?',
  },
  {
    id: 'nextjs-image-sizes-prop-deep-dive',
    category: 'nextjs',
    difficulty: 'Advanced',
    topic: 'Image Optimization',
    title: 'What does the sizes prop control on next/image and why does it matter for responsive images?',
    summary: 'The sizes prop tells the browser how wide the image will actually be displayed at different viewport widths, so it can pick the most appropriately sized generated image from the srcset instead of always downloading the largest one.',
    explanation: 'When an image uses fill or has responsive layout behavior, next/image generates a srcset of multiple widths, but the browser needs the sizes attribute to know which of those candidate widths corresponds to its rendered slot at the current viewport, since CSS has not been applied yet at request time. Omitting sizes on a fill image causes the browser to default to 100vw, which often downloads a much larger image than necessary on desktop grids. A correct sizes value mirrors your CSS breakpoints, such as declaring the image is 100vw on mobile but 33vw inside a three-column desktop grid. Getting this wrong is a very common performance issue that silently defeats the point of responsive image optimization even though the page looks visually correct.',
    code: `import Image from 'next/image';\n\nexport function ProductCard({ src, alt }: { src: string; alt: string }) {\n  return (\n    <div className=\"relative aspect-square w-full\">\n      <Image\n        src={src}\n        alt={alt}\n        fill\n        sizes=\"(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw\"\n        className=\"object-cover\"\n      />\n    </div>\n  );\n}`,
    interviewQuestion: 'A designer complains that product images look fine but load slowly on desktop. You notice the Image components use fill without a sizes prop. Explain why that causes over-fetching and how you would fix it.',
  },
  {
    id: 'nextjs-static-export-mode-limitations',
    category: 'nextjs',
    difficulty: 'Advanced',
    topic: 'Deployment',
    title: 'What are the limitations of output: "export" (static export mode)?',
    summary: 'Static export mode compiles the entire app into plain HTML/CSS/JS with no Node.js server at runtime, which means it cannot support any feature that requires per-request server logic, such as Server Actions, Route Handlers with dynamic behavior, ISR, or middleware.',
    explanation: 'Setting output: "export" produces a fully static site deployable to any static host like GitHub Pages, S3, or a plain CDN, generating HTML for every route at build time via generateStaticParams and static rendering. Because there is no server process, features that depend on per-request execution are unsupported or restricted: Server Actions cannot run, Route Handlers are limited to ones that can be statically generated (no request-dependent logic), Image Optimization requires an external loader since the default optimizer needs a server, cookies()/headers() cannot be used, and Middleware does not execute at all in the exported output. Dynamic routes still work but every possible path must be enumerable via generateStaticParams at build time since there is no fallback server rendering. This mode suits marketing sites, docs, and fully client-fetched SPAs but is a poor fit for apps needing personalization, authentication gating on the server, or on-demand revalidation.',
    code: `// next.config.js\n/** @type {import('next').NextConfig} */\nmodule.exports = {\n  output: 'export',\n  images: {\n    unoptimized: true, // no built-in optimizer server available\n  },\n};\n\n// Every dynamic route must have generateStaticParams,\n// and Server Actions / Middleware / next/headers are unavailable.`,
    interviewQuestion: 'A team wants to deploy their Next.js app to a plain S3 bucket using output: "export", but the app uses Server Actions for a contact form and middleware for auth redirects. What has to change?',
  },
  {
    id: 'nextjs-dynamic-import-ssr-false',
    category: 'nextjs',
    difficulty: 'Intermediate',
    topic: 'Client Components',
    title: 'When and how do you use next/dynamic with ssr: false?',
    summary: 'next/dynamic with ssr: false skips server-side rendering entirely for a component, deferring it to render only in the browser, which is necessary for code that depends on browser-only globals or heavy client-only libraries.',
    explanation: 'Some libraries, such as charting tools, map widgets, or rich text editors, read from window or document at module load time and will throw during server rendering. Wrapping such a component with dynamic(() => import(...), { ssr: false }) tells Next.js to render nothing (or a placeholder) on the server and only mount the real component client-side after hydration. This is only valid inside a Client Component boundary in the App Router, since ssr: false is not supported when called from a Server Component; if needed there, you must move the dynamic import into a small "use client" wrapper. It is also a useful lever for deliberately deferring non-critical, JS-heavy widgets out of the initial server-rendered payload to improve TTFB and reduce hydration cost.',
    code: `'use client';\nimport dynamic from 'next/dynamic';\n\nconst MapWidget = dynamic(() => import('@/components/map-widget'), {\n  ssr: false,\n  loading: () => <p>Loading map...</p>,\n});\n\nexport function LocationPicker() {\n  return (\n    <div>\n      <h2>Choose a location</h2>\n      <MapWidget />\n    </div>\n  );\n}`,
    interviewQuestion: 'Why does next/dynamic throw an error if you set ssr: false inside a Server Component, and what is the correct way to achieve the same effect there?',
  },
  {
    id: 'nextjs-clerk-auth0-integration-patterns',
    category: 'nextjs',
    difficulty: 'Intermediate',
    topic: 'Authentication',
    title: 'How do third-party auth providers like Clerk or Auth0 integrate with the App Router?',
    summary: 'Providers like Clerk and Auth0 ship middleware, server-side session helpers, and client hooks that plug into Next.js\'s middleware, Server Components, and Route Handlers to manage authentication without you hand-rolling sessions.',
    explanation: 'Clerk, for instance, provides a clerkMiddleware that runs on every matched request to attach the session to the request context and optionally protect routes, plus server helpers like auth() and currentUser() usable directly inside Server Components and Route Handlers without prop drilling. Auth0 follows a similar shape with its Next.js SDK, exposing a handler for the auth routes under app/api/auth/[...auth0]/route.ts and a getSession() helper for server-side reads. The key architectural difference from a hand-rolled solution is that these SDKs handle token refresh, JWT verification, and edge-compatible session reading so middleware can make protect/redirect decisions without a database round trip. Interviewers often probe whether candidates understand that these providers still rely on the same primitives, cookies, middleware, and the Edge runtime, that you would use to build auth manually.',
    code: `// middleware.ts\nimport { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';\n\nconst isProtectedRoute = createRouteMatcher(['/dashboard(.*)']);\n\nexport default clerkMiddleware((auth, req) => {\n  if (isProtectedRoute(req)) auth().protect();\n});\n\nexport const config = {\n  matcher: ['/((?!_next|.*\\\\..*).*)'],\n};`,
    interviewQuestion: 'How does Clerk\'s middleware decide to protect a route at the edge without making a database call on every request?',
  },
  {
    id: 'nextjs-rbac-middleware-route-protection',
    category: 'nextjs',
    difficulty: 'Advanced',
    topic: 'Authentication',
    title: 'How do you implement role-based route protection in middleware?',
    summary: 'Role-based protection reads a role claim from the session token inside middleware and redirects or rewrites the request before the route ever renders, centralizing authorization logic in one place.',
    explanation: 'Because middleware runs on the Edge runtime before a request reaches a page, it is a good place to enforce coarse-grained authorization, such as blocking non-admin users from an /admin section, without paying the cost of rendering the page first. The role is typically read from a signed JWT stored in a cookie, decoded with a lightweight edge-compatible verification library since Node-only crypto APIs are unavailable at the edge. A common pitfall is doing fine-grained, per-resource authorization in middleware; that is better handled deeper in Server Components or Server Actions where you have full database access, while middleware should handle broad role gates and redirects. Matcher config should also be scoped tightly to avoid running this logic on static assets or unrelated routes for performance.',
    code: `import { NextResponse } from 'next/server';\nimport type { NextRequest } from 'next/server';\nimport { jwtVerify } from 'jose';\n\nexport async function middleware(req: NextRequest) {\n  const token = req.cookies.get('session')?.value;\n  if (!token) return NextResponse.redirect(new URL('/login', req.url));\n\n  const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));\n  if (req.nextUrl.pathname.startsWith('/admin') && payload.role !== 'admin') {\n    return NextResponse.redirect(new URL('/unauthorized', req.url));\n  }\n  return NextResponse.next();\n}\n\nexport const config = { matcher: ['/admin/:path*', '/dashboard/:path*'] };`,
    interviewQuestion: 'Why should fine-grained, per-resource authorization checks generally not live in middleware, and where should they live instead?',
  },
  {
    id: 'nextjs-csrf-protection-server-actions',
    category: 'nextjs',
    difficulty: 'Tricky',
    topic: 'Security',
    title: 'How does Next.js protect Server Actions from CSRF, and when do you need extra measures?',
    summary: 'Next.js automatically checks the Origin header against the Host header on every Server Action POST request to reject cross-site form submissions, but this protection has edge cases around proxies and custom domains that developers must configure correctly.',
    explanation: 'Server Actions are invoked via a POST request carrying an encrypted action reference, and Next.js\'s built-in CSRF mitigation compares the request\'s Origin header to the server\'s own Host (and configurable allowed origins) header, rejecting the action if they do not match. This means an attacker\'s site cannot silently trigger your Server Actions via a forged form post from another origin. The main configuration gotcha is deployments behind a reverse proxy or on multiple custom domains, where the Host header seen by Next.js may not match the public-facing origin, requiring the serverActions.allowedOrigins config in next.config.js to explicitly whitelist trusted domains. This built-in check does not replace the need for proper authentication and authorization inside the action itself, since Origin headers can theoretically be stripped by some legacy proxies, so sensitive actions should still verify session identity server-side.',
    code: `// next.config.js\nmodule.exports = {\n  experimental: {\n    serverActions: {\n      allowedOrigins: ['my-app.com', '*.my-app.com', 'staging.my-app.com'],\n    },\n  },\n};`,
    interviewQuestion: 'A Server Action starts failing with a 403 only in staging after you put the app behind a new reverse proxy. What is the likely cause and how do you fix it?',
  },
  {
    id: 'nextjs-rate-limiting-upstash-redis',
    category: 'nextjs',
    difficulty: 'Advanced',
    topic: 'Security',
    title: 'How do you implement rate limiting in Next.js with Upstash Redis?',
    summary: 'Upstash provides an HTTP-based Redis client that works on the Edge runtime, paired with the @upstash/ratelimit library to implement sliding-window or token-bucket rate limits inside middleware or Route Handlers.',
    explanation: 'Traditional Redis clients use TCP connections, which are unavailable in the Edge runtime, so Upstash\'s REST-based client is the standard choice for rate limiting that needs to run in middleware ahead of every request. The Ratelimit class wraps a chosen algorithm, commonly a sliding window, and is keyed by an identifier such as the client IP or authenticated user ID; calling limit(identifier) returns whether the request is allowed plus metadata like remaining requests and reset time useful for setting RateLimit-* response headers. A key design decision is where to enforce the limit: middleware protects all matched routes cheaply at the edge, while per-Route-Handler limiting allows different limits for different endpoints, such as a stricter limit on a login endpoint than on general API reads. Analytics can also be enabled to track abuse patterns via the Upstash dashboard.',
    code: `// lib/rate-limit.ts\nimport { Ratelimit } from '@upstash/ratelimit';\nimport { Redis } from '@upstash/redis';\n\nconst redis = Redis.fromEnv();\nexport const ratelimit = new Ratelimit({\n  redis,\n  limiter: Ratelimit.slidingWindow(10, '10 s'),\n});\n\n// middleware.ts\nimport { ratelimit } from '@/lib/rate-limit';\nimport { NextResponse } from 'next/server';\n\nexport async function middleware(req: Request) {\n  const ip = req.headers.get('x-forwarded-for') ?? 'anonymous';\n  const { success } = await ratelimit.limit(ip);\n  if (!success) return NextResponse.json({ error: 'Too many requests' }, { status: 429 });\n  return NextResponse.next();\n}`,
    interviewQuestion: 'Why can\'t you use a standard TCP-based Redis client for rate limiting inside Next.js middleware, and what does Upstash do differently?',
  },
  {
    id: 'nextjs-trpc-integration-pattern',
    category: 'nextjs',
    difficulty: 'Advanced',
    topic: 'Data Fetching',
    title: 'How does tRPC integrate with Next.js App Router for end-to-end type safety?',
    summary: 'tRPC exposes a single catch-all Route Handler that dispatches to typed procedures, letting the client call server functions with full TypeScript inference and no manual API schema or codegen.',
    explanation: 'The integration mounts tRPC\'s fetch adapter at app/api/trpc/[trpc]/route.ts, which handles all queries and mutations defined in a central appRouter. On the client, React Query hooks generated from that same router give full type inference for inputs and outputs, so a change to a procedure\'s return type immediately surfaces as a type error at every call site. In the App Router, tRPC also supports calling procedures directly from Server Components via a server-side caller, bypassing the network round trip entirely while reusing the same procedure logic and validation, often paired with React Query hydration for prefetching. The main tradeoff versus plain Server Actions is that tRPC adds infrastructure and a learning curve, but it shines in larger apps needing a shared, versioned API layer consumed by multiple clients beyond just the Next.js frontend.',
    code: `// app/api/trpc/[trpc]/route.ts\nimport { fetchRequestHandler } from '@trpc/server/adapters/fetch';\nimport { appRouter } from '@/server/router';\n\nconst handler = (req: Request) =>\n  fetchRequestHandler({\n    endpoint: '/api/trpc',\n    req,\n    router: appRouter,\n    createContext: () => ({}),\n  });\n\nexport { handler as GET, handler as POST };`,
    interviewQuestion: 'What advantage does tRPC give you over calling a typed Server Action directly, and when would you still choose tRPC in an App Router project?',
  },
  {
    id: 'nextjs-isr-stale-while-revalidate-internals',
    category: 'nextjs',
    difficulty: 'Tricky',
    topic: 'Caching',
    title: 'What happens internally during the stale-while-revalidate window in ISR?',
    summary: 'When a revalidate period elapses, Next.js still serves the stale cached page immediately to the next request while triggering a background regeneration, only swapping in the fresh page once that regeneration succeeds.',
    explanation: 'ISR does not block the requesting user on regeneration; instead, the first request after the revalidate window expires is served the existing stale HTML from cache while a single regeneration is kicked off in the background (deduplicated so concurrent requests do not trigger multiple regenerations). Subsequent requests continue receiving the stale version until the new render finishes and is committed to the cache, at which point it atomically replaces the old entry for all future requests. If regeneration fails, for example due to a data source error, Next.js keeps serving the last known good cached version rather than crashing the route, which is an important resilience property to mention in interviews. On Vercel this is implemented using their edge cache plus a background regeneration lambda invocation, while self-hosted deployments rely on the filesystem cache and an internal timer-based mechanism in the Node.js server.',
    code: `// app/blog/[slug]/page.tsx\nexport const revalidate = 60; // seconds\n\nexport default async function BlogPost({ params }: { params: { slug: string } }) {\n  const post = await fetch(\`https://cms.example.com/posts/\${params.slug}\`).then((r) => r.json());\n  return <article><h1>{post.title}</h1><p>{post.body}</p></article>;\n}`,
    interviewQuestion: 'If a request hits a page exactly after its 60-second revalidate window has expired, does that user wait for fresh data, and what happens if the background regeneration fails?',
  },
  {
    id: 'nextjs-standalone-vs-server-output',
    category: 'nextjs',
    difficulty: 'Intermediate',
    topic: 'Deployment',
    title: 'What is the difference between the default build output and output: "standalone"?',
    summary: 'The default Next.js build assumes node_modules will be present at runtime, while output: "standalone" produces a minimal, self-contained server bundle with only the traced dependencies it actually needs, ideal for Docker images.',
    explanation: 'Without standalone output, deploying a Next.js app requires shipping the entire node_modules directory alongside .next, which can be large and slow to copy into a container image. Setting output: "standalone" in next.config.js makes Next.js use its build-time dependency tracing to copy only the files actually required into a .next/standalone directory, including a minimal server.js entry point that can be run directly with node server.js without needing next start or a full node_modules install. Static assets and the public folder still need to be manually copied alongside the standalone output since they are not automatically included in that trace, which is a common Docker deployment mistake. This mode significantly shrinks image size and cold start time, making it the recommended output mode for containerized and self-hosted deployments.',
    code: `// next.config.js\n/** @type {import('next').NextConfig} */\nmodule.exports = {\n  output: 'standalone',\n};\n\n// Dockerfile (relevant excerpt)\n// COPY --from=builder /app/.next/standalone ./\n// COPY --from=builder /app/.next/static ./.next/static\n// COPY --from=builder /app/public ./public\n// CMD [\"node\", \"server.js\"]`,
    interviewQuestion: 'You containerize a Next.js app with output: "standalone" but images and CSS 404 in production. What did the Dockerfile likely forget to copy?',
  },
  {
    id: 'nextjs-headers-in-server-components',
    category: 'nextjs',
    difficulty: 'Intermediate',
    topic: 'Request APIs',
    title: 'How do you read request headers inside a Server Component with next/headers?',
    summary: 'The headers() function from next/headers returns a read-only view of the incoming request headers, accessible in any Server Component, Route Handler, or Server Action, and its use automatically opts a route into dynamic rendering.',
    explanation: 'Calling headers() gives synchronous, read-only access to the current request\'s headers such as user-agent, authorization, or a custom header set by middleware, without needing to pass them down as props from a page. Because header values differ per request, invoking headers() (or cookies()) inside a Server Component forces that route out of static rendering into dynamic rendering at request time, since the response can no longer be safely cached and reused across users. This is a key mental model for interviews: static-vs-dynamic decisions in the App Router are driven by which dynamic APIs are actually called during a render, not by an explicit top-level config alone. In Next.js 15, headers() and cookies() became asynchronous and must be awaited, which is a notable breaking change from Next.js 14\'s synchronous API.',
    code: `// app/api/whoami/route.ts or a Server Component\nimport { headers } from 'next/headers';\n\nexport default async function Page() {\n  const headersList = await headers();\n  const userAgent = headersList.get('user-agent');\n  const country = headersList.get('x-vercel-ip-country');\n\n  return <p>Visiting from {country ?? 'unknown'} using {userAgent}</p>;\n}`,
    interviewQuestion: 'Why does calling headers() inside a page component automatically make that route dynamic even if you never set dynamic = "force-dynamic"?',
  },
  {
    id: 'nextjs-telemetry-opt-out',
    category: 'nextjs',
    difficulty: 'Basic',
    topic: 'Tooling',
    title: 'What does Next.js telemetry collect and how do you disable it?',
    summary: 'Next.js CLI telemetry collects anonymous, aggregated usage data such as which features and config options are used and build performance metrics, and it can be fully disabled with a single CLI command or environment variable.',
    explanation: 'Telemetry is enabled by default starting a fresh Next.js install and gathers completely anonymized data like Next.js version, general machine info, feature flags in use, and build timing, explicitly excluding source code, file paths, environment variables, or any personally identifiable information, per Next.js\'s public documentation. It helps the Next.js team prioritize which features to invest in based on real-world usage patterns. Developers can opt out permanently by running npx next telemetry disable, check current status with npx next telemetry status, or disable it in CI/ephemeral environments by setting the NEXT_TELEMETRY_DISABLED=1 environment variable, which is common practice in company build pipelines for compliance or noise-reduction reasons even though the data collected is not sensitive.',
    code: `# Disable telemetry permanently\nnpx next telemetry disable\n\n# Check current status\nnpx next telemetry status\n\n# Or disable via env var, e.g. in CI\nexport NEXT_TELEMETRY_DISABLED=1`,
    interviewQuestion: 'Does Next.js telemetry ever collect environment variables or source file contents, and how would you disable it in a CI pipeline?',
  },
  {
    id: 'nextjs-rsc-serialization-boundaries',
    category: 'nextjs',
    difficulty: 'Tricky',
    topic: 'Server Components',
    title: 'What can and cannot cross the Server-to-Client Component boundary as props?',
    summary: 'Props passed from a Server Component to a Client Component must be serializable over the RSC wire format, so plain data like strings, numbers, plain objects, arrays, and Server Actions themselves can cross, but things like functions, class instances, Dates as complex objects, Symbols, and React Context cannot.',
    explanation: 'The React Server Components protocol serializes the tree it sends to the client, meaning any prop passed into a Client Component must survive that serialization, which excludes closures/functions (except specially-marked Server Actions, which are serialized as a reference the client can invoke over the network), class instances with methods or prototypes, Map/Set in older versions, and undefined behaving inconsistently in some cases. A common mistake is trying to pass a database client instance, an event handler defined in the Server Component, or a non-plain object like a Mongoose document directly into a Client Component, which throws a serialization error at build or runtime. The correct pattern is to serialize data to plain JSON-like shapes before passing down, or to pass a Server Action reference when you need the client to trigger server-side logic. React Context is also unavailable across the boundary since Server Components have no client-side runtime to subscribe to it, which is why Context providers must themselves be Client Components wrapping the children.',
    code: `// app/page.tsx (Server Component)\nimport { ClientWidget } from './client-widget';\nimport { deletePost } from './actions';\n\nexport default async function Page() {\n  const post = await getPost(); // plain object - OK to pass down\n  return <ClientWidget post={post} onDelete={deletePost} />; // Server Action reference - OK\n}\n\n// This would fail: passing a class instance or function closure\n// <ClientWidget onClick={() => console.log('server closure')} />`,
    interviewQuestion: 'Why can you pass a Server Action as a prop into a Client Component, but not a regular function defined in the Server Component?',
  },
  {
    id: 'nextjs-middleware-matcher-config-patterns',
    category: 'nextjs',
    difficulty: 'Intermediate',
    topic: 'Middleware',
    title: 'What patterns does the middleware matcher config support and why scope it carefully?',
    summary: 'The config.matcher export controls exactly which request paths invoke middleware, supporting exact paths, path parameters, and regex-like negative lookaheads, and scoping it tightly avoids unnecessary edge invocations on static assets.',
    explanation: 'By default, middleware without a matcher runs on every request, including static files and _next internals, which wastes edge invocations and can even break things like image optimization requests if the middleware logic is not careful. The matcher array supports simple path strings with :path* segment wildcards, and more precise regex-based negative lookaheads like /((?!_next/static|_next/image|favicon.ico).*) to exclude framework internals and static assets in one line. Matchers must be statically analyzable at build time, meaning you cannot construct the matcher dynamically from a variable; Next.js parses the config export directly. When multiple concerns need different logic, such as auth on /dashboard but A/B testing on /, the common pattern is to combine broad matching with conditional branching inside the middleware function itself rather than trying to express all logic purely in the matcher.',
    code: `export const config = {\n  matcher: [\n    /*\n     * Match all paths except:\n     * - _next/static, _next/image (static assets)\n     * - favicon.ico\n     * - public folder files with extensions\n     */\n    '/((?!_next/static|_next/image|favicon.ico|.*\\\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',\n  ],\n};`,
    interviewQuestion: 'Why is it important to exclude _next/static and _next/image from the middleware matcher, and what happens to performance if you forget?',
  },
  {
    id: 'nextjs-bundle-size-budgets-ci',
    category: 'nextjs',
    difficulty: 'Advanced',
    topic: 'Performance',
    title: 'How do you enforce bundle size budgets in CI for a Next.js app?',
    summary: 'Bundle size budgets set hard thresholds on JavaScript output per route or overall, enforced in CI using tools like next/bundle-analyzer combined with a size-checking action or a dedicated tool like size-limit or bundlewatch, failing the build if a threshold is exceeded.',
    explanation: 'Without enforcement, bundle size tends to creep upward silently as dependencies are added, degrading Core Web Vitals like LCP and TBT over time in ways that are hard to notice incrementally. A common CI setup runs next build with ANALYZE=true to generate a stats artifact, then a tool like bundlewatch or size-limit compares the compiled output of specific chunks or First Load JS per route against configured limits, failing the pipeline and posting a PR comment with the delta if a budget is breached. Because Next.js splits code per route, budgets are often set per-route rather than as one global number, since a marketing page and a data-heavy dashboard have very different reasonable baselines. Teams typically pair this with periodic manual audits using @next/bundle-analyzer\'s treemap visualization to identify which specific dependency caused a regression when a budget check fails.',
    code: `// next.config.js\nconst withBundleAnalyzer = require('@next/bundle-analyzer')({\n  enabled: process.env.ANALYZE === 'true',\n});\nmodule.exports = withBundleAnalyzer({});\n\n// package.json\n// "scripts": { "analyze": "ANALYZE=true next build" }\n\n// .bundlewatch.config.json\n{\n  "files": [\n    { "path": ".next/static/chunks/pages/**/*.js", "maxSize": "170 kB" }\n  ],\n  "ci": { "trackBranches": ["main"] }\n}`,
    interviewQuestion: 'How would you set up a CI check that fails a pull request if a new dependency pushes a route\'s First Load JS past an agreed budget?',
  },
];
