// 31 browserinternals topics for Study Hub.
export default [
  {
    id: "browserinternals-rendering-pipeline",
    category: "browserinternals",
    difficulty: "Intermediate",
    topic: "Rendering Pipeline",
    title: "What is the browser rendering pipeline?",
    summary: "The staged process browsers use to turn HTML/CSS into pixels: Parse, Style, Layout, Paint, Composite.",
    explanation:
      "The browser parses HTML into a DOM tree and CSS into a CSSOM, combines them into a render tree, computes the geometry of each box (Layout/Reflow), fills in pixels for each layer (Paint), and finally combines layers on the GPU (Composite). Each stage can be triggered independently by different kinds of changes. Understanding which stage a style change invalidates is key to writing performant UI code. Changes to transform/opacity can skip layout and paint entirely and only trigger composite.",
    code:
      "Parse HTML -> DOM\nParse CSS -> CSSOM\nDOM + CSSOM -> Render Tree\nRender Tree -> Layout (geometry)\nLayout -> Paint (pixels per layer)\nPaint -> Composite (GPU combines layers)",
    interviewQuestion: "Walk me through what happens between receiving an HTML response and pixels appearing on screen.",
  },
  {
    id: "browserinternals-critical-rendering-path",
    category: "browserinternals",
    difficulty: "Intermediate",
    topic: "Rendering Pipeline",
    title: "What is the Critical Rendering Path?",
    summary: "The minimum sequence of steps the browser must complete before first pixels can be painted.",
    explanation:
      "The Critical Rendering Path (CRP) is the set of steps — fetch HTML, build DOM, fetch/parse CSS, build CSSOM, build render tree, layout, paint — needed to render the initial view. CSS is render-blocking by default because the browser cannot build the render tree without CSSOM. Optimizing CRP means minimizing critical resources, minimizing bytes needed, and shortening round trips (e.g. inlining critical CSS, deferring non-critical JS, using media attributes on link tags).",
    code:
      "<!-- Blocks render until CSSOM built -->\n<link rel='stylesheet' href='main.css'>\n\n<!-- Not render blocking for the given media -->\n<link rel='stylesheet' href='print.css' media='print'>\n\n<!-- Blocks parser unless async/defer -->\n<script src='app.js' defer></script>",
    interviewQuestion: "Why does a <link> tag in <head> block rendering, and how would you reduce that blocking time?",
  },
  {
    id: "browserinternals-reflow-vs-repaint",
    category: "browserinternals",
    difficulty: "Intermediate",
    topic: "Rendering Pipeline",
    title: "Reflow vs repaint — what's the difference?",
    summary: "Reflow recalculates layout geometry; repaint just redraws pixels without changing layout.",
    explanation:
      "A reflow (layout) happens when a change affects the geometry of elements — size, position, or content that affects other elements' positions — and it can cascade up and down the tree, making it expensive. A repaint happens when a change affects only visual appearance (color, background, visibility) without affecting layout, which is cheaper. Compositing-only changes (transform, opacity) are cheapest since they skip both layout and paint. Batching DOM reads/writes avoids forcing synchronous reflows.",
    code:
      "// Triggers reflow (geometry changed)\nel.style.width = '200px';\n\n// Triggers repaint only (no geometry change)\nel.style.backgroundColor = 'red';\n\n// Triggers neither layout nor paint — composite only\nel.style.transform = 'translateX(10px)';",
    interviewQuestion: "Which is more expensive, reflow or repaint, and why? Give an example of a style change for each.",
  },
  {
    id: "browserinternals-engines-overview",
    category: "browserinternals",
    difficulty: "Basic",
    topic: "Browser Engines",
    title: "What are the major browser engines?",
    summary: "Blink (Chrome, Edge, Opera), Gecko (Firefox), and WebKit (Safari) are the three main rendering engines.",
    explanation:
      "Blink, developed by Google, powers Chrome, Edge, Opera, and most Chromium-based browsers; it forked from WebKit in 2013. Gecko is Mozilla's engine used in Firefox, known for its own layout and CSS implementation (Servo/Stylo influenced parts of it). WebKit powers Safari and is required for all browsers on iOS due to Apple's App Store policy. Each engine has its own JS engine too: V8 (Blink), SpiderMonkey (Gecko), JavaScriptCore (WebKit) — differences in engine behavior explain many cross-browser quirks.",
    code:
      "Engine    Browser              JS Engine\nBlink     Chrome, Edge, Opera  V8\nGecko     Firefox              SpiderMonkey\nWebKit    Safari, iOS browsers JavaScriptCore",
    interviewQuestion: "Why do all browsers on iOS, including 'Chrome for iOS', ultimately use WebKit?",
  },
  {
    id: "browserinternals-dom-tree-construction",
    category: "browserinternals",
    difficulty: "Basic",
    topic: "Parsing",
    title: "How is the DOM tree constructed?",
    summary: "The HTML parser tokenizes bytes into tokens, then tokens into DOM nodes, incrementally as bytes arrive.",
    explanation:
      "The browser converts raw bytes to characters using the specified encoding, tokenizes the characters per the HTML5 spec state machine (tag open, attribute name, etc.), converts tokens into DOM nodes, and links nodes into a tree reflecting element nesting. This happens incrementally and streaming — the browser doesn't wait for the whole document before starting to build DOM. Synchronous scripts without async/defer pause parsing because they may use document.write to alter the tree.",
    code:
      "Bytes -> Characters (via encoding)\nCharacters -> Tokens (tokenizer/state machine)\nTokens -> Nodes\nNodes -> DOM Tree\n\n<html>\n  <body>\n    <p>Hi</p>   <!-- becomes Element node 'p' with Text child 'Hi' -->\n  </body>\n</html>",
    interviewQuestion: "Why does a <script> tag without async or defer block HTML parsing?",
  },
  {
    id: "browserinternals-cssom-construction",
    category: "browserinternals",
    difficulty: "Basic",
    topic: "Parsing",
    title: "How is the CSSOM constructed?",
    summary: "CSS is tokenized and parsed into a tree of rules with computed specificity and inheritance applied later.",
    explanation:
      "Similar to DOM construction, the CSS parser converts bytes into tokens and builds a CSSOM tree representing style rules and their relationships, including cascade and inheritance information. Unlike HTML parsing, CSSOM construction is not incremental in the sense that the render tree cannot be built until the full CSSOM for render-blocking stylesheets is ready — a partial CSSOM would produce flashes of incorrectly styled content. This is why CSS is render blocking by default.",
    code:
      "body { font-size: 16px; }\np { color: blue; }\nspan { display: none; }\n\n/* CSSOM (conceptual) */\nCSSOM\n  body { font-size:16px }\n    p { font-size:16px (inherited); color: blue }\n      span { display:none }",
    interviewQuestion: "Why is CSSOM construction render-blocking while DOM construction is incremental?",
  },
  {
    id: "browserinternals-render-tree",
    category: "browserinternals",
    difficulty: "Basic",
    topic: "Rendering Pipeline",
    title: "What is the render tree and how does it differ from the DOM?",
    summary: "The render tree contains only visually rendered nodes, combining DOM structure with computed styles.",
    explanation:
      "The render tree is built by combining the DOM and CSSOM: it walks visible DOM nodes and attaches the matched computed style for each. Nodes with display:none, as well as <head>, <script>, and <meta> elements, are excluded entirely (unlike visibility:hidden, which still occupies space and appears in the render tree). Each render tree node knows its content and computed style, which feeds directly into the layout stage.",
    code:
      "<div style='display:none'>Skipped entirely</div>\n<div style='visibility:hidden'>In render tree, takes up space, not painted</div>\n<script>Never in render tree</script>\n\n// Render tree = DOM subset (visible nodes) + matched CSSOM styles",
    interviewQuestion: "Why does display:none exclude an element from the render tree while visibility:hidden does not?",
  },
  {
    id: "browserinternals-layout-thrashing",
    category: "browserinternals",
    difficulty: "Advanced",
    topic: "Performance",
    title: "What is layout thrashing?",
    summary: "Repeatedly interleaving DOM writes and layout-dependent reads forces the browser to recalculate layout synchronously many times.",
    explanation:
      "Layout thrashing (forced synchronous layout) happens when JS reads a layout property (offsetHeight, getBoundingClientRect, etc.) right after writing to the DOM, forcing the browser to flush pending style/layout work immediately instead of batching it before the next paint. Doing this in a loop over many elements causes layout to be recomputed on every iteration, which is extremely slow. The fix is to batch all reads first, then all writes (or use requestAnimationFrame / libraries like FastDOM).",
    code:
      "// BAD: thrashes layout — read then write, repeated per element\nboxes.forEach(box => {\n  const h = box.offsetHeight; // forces layout\n  box.style.height = h * 2 + 'px'; // invalidates layout\n});\n\n// GOOD: batch reads, then batch writes\nconst heights = boxes.map(box => box.offsetHeight);\nboxes.forEach((box, i) => { box.style.height = heights[i] * 2 + 'px'; });",
    interviewQuestion: "You have a loop reading offsetHeight and writing style.height for 500 elements and it's janky. What's happening and how do you fix it?",
  },
  {
    id: "browserinternals-compositing-layers",
    category: "browserinternals",
    difficulty: "Advanced",
    topic: "Rendering Pipeline",
    title: "What are compositing layers?",
    summary: "Layers are separately rendered surfaces the GPU combines together, allowing some animations to skip layout/paint.",
    explanation:
      "The browser can promote certain elements to their own compositor layer (e.g. via transform, will-change, video, or canvas), which are rasterized independently and combined on the GPU during the composite step. Animating transform or opacity on a layer only requires re-compositing, not re-layout or re-paint of the whole page, making it far cheaper. Overusing will-change or creating too many layers, however, wastes memory and can hurt performance ('layer explosion').",
    code:
      "/* Promote to own layer */\n.card {\n  will-change: transform;\n}\n\n/* Cheap animation: composite-only */\n.card:hover {\n  transform: scale(1.05);\n}\n\n/* DevTools: Layers panel shows layer count and reasons for promotion */",
    interviewQuestion: "Why does animating transform perform better than animating top/left, and what's the downside of overusing will-change?",
  },
  {
    id: "browserinternals-gpu-rasterization",
    category: "browserinternals",
    difficulty: "Advanced",
    topic: "Rendering Pipeline",
    title: "What is GPU rasterization?",
    summary: "Rasterization converts vector paint instructions into actual pixel bitmaps, which modern browsers offload to the GPU.",
    explanation:
      "After paint records a list of drawing instructions (paint ops) for each layer, rasterization turns those instructions into actual pixels in a bitmap. Modern browsers use GPU rasterization, splitting layers into tiles and rasterizing tiles in parallel on the GPU, often prioritizing tiles near the viewport. This offloads work from the CPU and allows smoother scrolling and animation, since the compositor thread can composite already-rasterized tiles without going back to the main thread.",
    code:
      "Paint records -> Tiling -> Raster (GPU, tile-based) -> Compositor combines tiles\n\n// chrome://gpu shows whether 'Rasterization' is hardware accelerated\n// DevTools > Rendering > 'Layer borders' visualizes tile boundaries",
    interviewQuestion: "What's the difference between paint and rasterization, and why do browsers tile layers before rasterizing?",
  },
  {
    id: "browserinternals-raf-internals",
    category: "browserinternals",
    difficulty: "Intermediate",
    topic: "Rendering Pipeline",
    title: "How does requestAnimationFrame work internally?",
    summary: "requestAnimationFrame schedules a callback to run right before the next repaint, synced to the display refresh rate.",
    explanation:
      "The browser maintains a queue of rAF callbacks and runs them as part of the rendering pipeline, right before style/layout/paint for the current frame — synced with the monitor's refresh rate (typically 60Hz, so ~16.6ms budget). Callbacks receive a high-resolution timestamp. If the main thread is busy, frames are skipped rather than callbacks queuing up, which naturally throttles animation work when the page can't keep up. rAF also automatically pauses when the tab is backgrounded, unlike setTimeout.",
    code:
      "function animate(timestamp) {\n  const progress = timestamp - start;\n  el.style.transform = `translateX(${Math.min(progress / 10, 300)}px)`;\n  if (progress < 3000) requestAnimationFrame(animate);\n}\nlet start;\nrequestAnimationFrame(t => { start = t; animate(t); });",
    interviewQuestion: "Why is requestAnimationFrame preferred over setTimeout(fn, 16) for animations?",
  },
  {
    id: "browserinternals-request-idle-callback",
    category: "browserinternals",
    difficulty: "Intermediate",
    topic: "Rendering Pipeline",
    title: "What is requestIdleCallback used for?",
    summary: "Schedules low-priority work to run only when the browser has spare idle time within a frame, or after a timeout.",
    explanation:
      "requestIdleCallback lets you defer non-urgent work (analytics, prefetching, background sync) to idle periods so it doesn't compete with rendering-critical tasks. The callback receives a deadline object with timeRemaining(), so you can check how much idle time is left and stop before exceeding the frame budget. It's not run inside animations or on Safari without a polyfill, and has largely been considered for scheduling patterns now partly superseded by the Scheduler API (scheduler.postTask).",
    code:
      "requestIdleCallback((deadline) => {\n  while (deadline.timeRemaining() > 0 && tasks.length) {\n    processTask(tasks.pop());\n  }\n  if (tasks.length) requestIdleCallback(arguments.callee);\n}, { timeout: 2000 });",
    interviewQuestion: "When would you choose requestIdleCallback over setTimeout(fn, 0) for background work?",
  },
  {
    id: "browserinternals-event-loop",
    category: "browserinternals",
    difficulty: "Intermediate",
    topic: "Event Loop",
    title: "How does the browser event loop work?",
    summary: "A single thread repeatedly pulls tasks from a queue, runs them to completion, then drains microtasks and renders.",
    explanation:
      "The event loop is the mechanism that lets a single-threaded JS engine handle async work: it executes one macrotask (e.g. a script, timer callback, or event handler) from the task queue, then fully drains the microtask queue (promises, queueMicrotask), then — if it's time for a frame — runs rAF callbacks, style/layout/paint, before pulling the next macrotask. This ordering is why promise callbacks always run before the next setTimeout, even a 0ms one.",
    code:
      "console.log('1');\nsetTimeout(() => console.log('2'), 0); // macrotask\nPromise.resolve().then(() => console.log('3')); // microtask\nconsole.log('4');\n// Output: 1, 4, 3, 2",
    interviewQuestion: "Why does a Promise.then callback run before a setTimeout(fn, 0) callback, even though both are scheduled at the same time?",
  },
  {
    id: "browserinternals-task-vs-microtask",
    category: "browserinternals",
    difficulty: "Tricky",
    topic: "Event Loop",
    title: "Task queue vs microtask queue — how are they prioritized?",
    summary: "Microtasks (promises) fully drain between every single macrotask, while macrotasks (timers, I/O) run one at a time.",
    explanation:
      "Macrotasks include things like setTimeout callbacks, DOM events, and script execution — the event loop runs exactly one per loop iteration. Microtasks include Promise callbacks, queueMicrotask, and MutationObserver callbacks — after each macrotask, the engine drains the ENTIRE microtask queue, including any new microtasks scheduled during draining, before moving on. This means a chain of recursively-scheduled microtasks can starve rendering and macrotasks indefinitely if it never empties.",
    code:
      "function loop() {\n  Promise.resolve().then(loop); // schedules itself forever\n}\nloop();\n// Starves the event loop: rendering, input handling, and\n// setTimeout callbacks never get a chance to run.",
    interviewQuestion: "What happens if a microtask keeps scheduling more microtasks recursively? Why is this dangerous?",
  },
  {
    id: "browserinternals-process-architecture",
    category: "browserinternals",
    difficulty: "Advanced",
    topic: "Browser Architecture",
    title: "What is the browser's multi-process architecture?",
    summary: "Modern browsers split work across separate OS processes — browser, renderer, GPU, network, and utility — for security and stability.",
    explanation:
      "Chrome's architecture (similar in other Chromium browsers) has a single Browser process controlling UI, tabs, and navigation; multiple Renderer processes (usually one per site instance, sandboxed) that run HTML/CSS/JS; a GPU process for compositing/rasterization; a Network process handling requests; and various utility processes. This isolation means a crash or hang in one tab's renderer doesn't take down the whole browser, and sandboxing renderer processes limits the blast radius of a compromised web page.",
    code:
      "Browser process (UI, tabs, navigation)\n |- Renderer process (tab A, sandboxed, runs Blink + V8)\n |- Renderer process (tab B, sandboxed)\n |- GPU process (compositing, rasterization)\n |- Network process (fetches, caching)\n\n// chrome://process-internals shows live process/frame mapping",
    interviewQuestion: "Why does Chrome use separate OS processes per tab instead of running everything in one process?",
  },
  {
    id: "browserinternals-site-isolation",
    category: "browserinternals",
    difficulty: "Advanced",
    topic: "Browser Architecture",
    title: "What is Site Isolation?",
    summary: "A security feature that ensures each renderer process handles content from at most one site, mitigating Spectre-style attacks.",
    explanation:
      "Site Isolation puts content from different sites (registrable domain + scheme) into separate renderer processes, even for iframes on the same page — so a malicious page embedding an iframe from another site cannot read that site's memory via speculative execution side-channel attacks like Spectre. This was accelerated in Chrome after Spectre/Meltdown were disclosed in 2018. It increases memory usage (more processes) but significantly raises the bar for cross-site data theft, and is why cross-origin iframes get their own process even within a single tab.",
    code:
      "<!-- page on a.com embeds an iframe from b.com -->\n<iframe src='https://b.com/widget'></iframe>\n\n// With Site Isolation:\n// a.com content -> Renderer Process 1\n// b.com iframe   -> Renderer Process 2 (separate, sandboxed)\n// Even though both render in the same tab/page.",
    interviewQuestion: "How does Site Isolation help defend against Spectre-style side-channel attacks in the browser?",
  },
  {
    id: "browserinternals-same-origin-policy",
    category: "browserinternals",
    difficulty: "Intermediate",
    topic: "Security",
    title: "What is the Same-Origin Policy?",
    summary: "A security rule restricting how documents/scripts from one origin can interact with resources from another origin.",
    explanation:
      "Origin is defined as scheme + host + port. SOP prevents a script running on one origin from reading the DOM, cookies, or response bodies of another origin without explicit permission (like CORS headers). It doesn't block all cross-origin activity — you can still send requests and load images/scripts cross-origin (with restrictions), but reading the response is blocked unless the server opts in. SOP is fundamental to preventing malicious sites from stealing data from other origins like your bank's tab.",
    code:
      "// Page at https://app.com fetching https://api.other.com\nfetch('https://api.other.com/data')\n  .then(res => res.json()) // BLOCKED by SOP unless\n  // api.other.com responds with:\n  // Access-Control-Allow-Origin: https://app.com",
    interviewQuestion: "Does the Same-Origin Policy block a cross-origin request from being sent, or just from being read? Why does that distinction matter for CSRF?",
  },
  {
    id: "browserinternals-csp-enforcement",
    category: "browserinternals",
    difficulty: "Advanced",
    topic: "Security",
    title: "How does the browser enforce Content Security Policy?",
    summary: "CSP is a response header that tells the browser which sources of scripts/styles/etc. are allowed to load or execute.",
    explanation:
      "The browser parses the Content-Security-Policy header (or meta tag) sent with a document and enforces it during parsing and resource loading — blocking inline scripts, eval, or scripts from non-whitelisted origins, and reporting violations via a report-uri/report-to endpoint if configured. It's a defense-in-depth layer primarily against XSS: even if an attacker injects a <script> tag, CSP can prevent it from executing if it violates the policy. Nonces or hashes are the modern way to allow specific inline scripts without allowing all inline script execution.",
    code:
      "Content-Security-Policy: default-src 'self'; \\\n  script-src 'self' 'nonce-r4nd0m123'; \\\n  style-src 'self' 'unsafe-inline'; \\\n  report-uri /csp-report\n\n<!-- Allowed: matches nonce -->\n<script nonce='r4nd0m123'>init();</script>\n<!-- Blocked: no nonce, inline script -->\n<script>alert(document.cookie)</script>",
    interviewQuestion: "How would you use CSP to mitigate stored XSS even if user input somehow gets rendered unescaped?",
  },
  {
    id: "browserinternals-http-caching",
    category: "browserinternals",
    difficulty: "Intermediate",
    topic: "Networking",
    title: "How does browser HTTP caching work?",
    summary: "Browsers cache responses per cache-control directives, using freshness checks and validators to avoid re-downloading unchanged resources.",
    explanation:
      "Cache-Control headers (max-age, no-cache, no-store, immutable) tell the browser how long a response is 'fresh' and reusable without hitting the network. Once stale, the browser can send a conditional request using ETag (If-None-Match) or Last-Modified (If-Modified-Since); the server responds 304 Not Modified if unchanged, saving bandwidth while still validating. Combining long max-age with content-hashed filenames (e.g. app.a1b2c3.js) lets you cache aggressively and bust the cache only when content actually changes.",
    code:
      "Cache-Control: max-age=31536000, immutable  // hashed asset, cache forever\nCache-Control: no-cache                        // always revalidate\nCache-Control: no-store                        // never cache (sensitive data)\n\n// Conditional revalidation request:\nGET /app.js HTTP/1.1\nIf-None-Match: \"33a64df\"\n// Server: 304 Not Modified (no body) if unchanged",
    interviewQuestion: "What's the difference between Cache-Control: no-cache and no-store, and when would you use each?",
  },
  {
    id: "browserinternals-preload-prefetch-preconnect",
    category: "browserinternals",
    difficulty: "Intermediate",
    topic: "Networking",
    title: "Preload vs prefetch vs preconnect",
    summary: "Resource hints that tell the browser to fetch or connect early: preload for current-page critical resources, prefetch for future navigation, preconnect for early connection setup.",
    explanation:
      "rel=preload tells the browser to fetch a resource needed for the current page with high priority, without blocking parsing, useful for fonts or hero images discovered late by the parser. rel=prefetch fetches a resource likely needed for a future navigation, at low priority, cached for later use. rel=preconnect performs the DNS lookup, TCP handshake, and TLS negotiation for a cross-origin host ahead of time, saving round trips when the actual request is made. Overusing any of these can waste bandwidth and contend with more important requests.",
    code:
      "<!-- Fetch this font now, high priority, for current page -->\n<link rel='preload' href='/fonts/inter.woff2' as='font' crossorigin>\n\n<!-- Likely needed on next navigation, low priority -->\n<link rel='prefetch' href='/next-page-bundle.js'>\n\n<!-- Warm up connection to a third-party origin -->\n<link rel='preconnect' href='https://api.example.com'>",
    interviewQuestion: "You have a web font that's only discovered via CSS late in the cascade, causing FOIT. How would preload help?",
  },
  {
    id: "browserinternals-devtools-performance-tab",
    category: "browserinternals",
    difficulty: "Intermediate",
    topic: "Tooling",
    title: "How do you use the DevTools Performance tab?",
    summary: "Records a timeline of main-thread activity, layout, paint, and frame rate to diagnose jank and slow scripts.",
    explanation:
      "The Performance panel records a trace of everything happening on the main thread (and other threads) during a period, visualized as a flame chart with categories like Scripting, Rendering, Painting, and idle time. You can spot long tasks (>50ms, shown with a red triangle), forced synchronous layouts (labeled explicitly), and layout shift regions. The Bottom-Up/Call Tree views help find which function is consuming the most self time, and the FPS meter shows dropped frames during animations.",
    code:
      "// DevTools workflow:\n// 1. Performance tab -> Record\n// 2. Interact with page (scroll, click, animate)\n// 3. Stop recording\n// 4. Look for: red-flagged long tasks, 'Forced reflow' warnings,\n//    yellow (scripting) vs purple (rendering) vs green (painting) bands\n// 5. Bottom-Up view -> sort by Self Time to find hot functions",
    interviewQuestion: "A user reports janky scrolling. Walk me through how you'd diagnose the cause using the Performance panel.",
  },
  {
    id: "browserinternals-storage-quotas",
    category: "browserinternals",
    difficulty: "Tricky",
    topic: "Storage",
    title: "How do browser storage quotas work?",
    summary: "Browsers allocate a shared storage bucket per origin across localStorage, IndexedDB, and Cache API, with eviction under pressure.",
    explanation:
      "Modern browsers use a 'storage bucket' quota model, often based on a percentage of available disk space, shared across localStorage, sessionStorage, IndexedDB, and the Cache API for an origin. The navigator.storage.estimate() API reports usage and quota. Storage can be 'best-effort' (subject to eviction under disk pressure, typically LRU across origins) or 'persistent' (opt-in via navigator.storage.persist(), exempted from automatic eviction, though the user/browser can still clear it manually). localStorage itself has a much smaller practical limit (~5-10MB) than IndexedDB.",
    code:
      "const { usage, quota } = await navigator.storage.estimate();\nconsole.log(`Using ${usage} of ${quota} bytes`);\n\nconst granted = await navigator.storage.persist();\nconsole.log('Persisted storage granted:', granted);\n\n// Without persist(), origin's data is eligible for\n// eviction when the browser needs disk space (LRU).",
    interviewQuestion: "Your app uses IndexedDB for offline data and users report it silently getting cleared. What's likely happening and how do you prevent it?",
  },
  {
    id: "browserinternals-cookies-samesite",
    category: "browserinternals",
    difficulty: "Advanced",
    topic: "Storage",
    title: "How do cookies work internally, especially SameSite?",
    summary: "Cookies are small key-value pairs attached to requests per domain/path rules, with SameSite controlling cross-site sending.",
    explanation:
      "Cookies are set via Set-Cookie response headers or document.cookie, scoped by Domain, Path, Secure, and HttpOnly attributes, and the browser automatically attaches matching cookies to subsequent requests. SameSite controls whether a cookie is sent on cross-site requests: Strict never sends cross-site, Lax (the modern default) sends on top-level navigations (like clicking a link) but not on cross-site subresource requests/POSTs, and None sends always but requires Secure. SameSite=Lax as default was a major mitigation for CSRF introduced across browsers around 2020-2021.",
    code:
      "Set-Cookie: session=abc123; Secure; HttpOnly; SameSite=Lax; Path=/\nSet-Cookie: tracking=xyz; Secure; SameSite=None; Partitioned\n\n// SameSite=Strict: never sent cross-site, even clicking a link in from\n//   another site won't include it -- can break OAuth redirect flows\n// SameSite=Lax (default): sent on top-level GET navigation, not on\n//   cross-site <img>, fetch, or POST from another site (CSRF mitigation)",
    interviewQuestion: "How does SameSite=Lax help mitigate CSRF, and why might SameSite=Strict break certain login flows?",
  },
  {
    id: "browserinternals-web-apis-vs-js-engine",
    category: "browserinternals",
    difficulty: "Intermediate",
    topic: "JS Engine",
    title: "Web APIs vs the JS engine — what's the boundary?",
    summary: "The JS engine (e.g. V8) only implements ECMAScript; setTimeout, DOM, and fetch are Web APIs provided by the browser/runtime host.",
    explanation:
      "The ECMAScript spec defines the language itself (syntax, types, closures, promises as a language primitive) but says nothing about the DOM, timers, or networking — those are Web APIs defined by the WHATWG/W3C and implemented by the host environment (the browser, or in Node's case, libuv/Node APIs). The JS engine executes your code and hands off calls like setTimeout or fetch to the browser's C++ implementation, which schedules the actual work and later pushes a callback back onto the JS engine's task/microtask queue. This is why the same JS engine (V8) behaves differently in Chrome vs Node — the surrounding APIs differ.",
    code:
      "// setTimeout is NOT part of JS the language -- it's a Web API\n// (in browsers) or provided by libuv (in Node)\nsetTimeout(() => console.log('from Web API'), 0);\n\n// Promise IS part of the language (ECMA-262) -- implemented\n// directly inside the JS engine (e.g. V8), not the browser shell\nPromise.resolve().then(() => console.log('from JS engine'));",
    interviewQuestion: "Is setTimeout part of JavaScript the language? Where is it actually implemented?",
  },
  {
    id: "browserinternals-v8-pipeline",
    category: "browserinternals",
    difficulty: "Advanced",
    topic: "JS Engine",
    title: "What is the V8 pipeline: parse to bytecode to JIT?",
    summary: "V8 parses JS to an AST, generates bytecode via Ignition, then optimizes hot functions to machine code via TurboFan (JIT).",
    explanation:
      "V8 first does a fast, lazy parse to build an AST, then Ignition (the interpreter) compiles the AST into bytecode and starts executing it immediately for fast startup. While running, V8's profiler tracks which functions are 'hot' (called frequently) and feeds type feedback (inline caches) about the shapes of objects seen. TurboFan, the optimizing JIT compiler, then compiles hot functions into highly optimized machine code based on assumptions from that feedback (e.g. 'this object always has this shape'). If those assumptions are violated later, V8 deoptimizes back to bytecode ('bailout'), which is why polymorphic/megamorphic code is slower.",
    code:
      "JS Source\n  -> Parser -> AST\n  -> Ignition (interpreter) -> Bytecode (executes immediately)\n  -> Profiler notices hot function + collects type feedback\n  -> TurboFan (JIT) -> Optimized machine code\n  -> (if assumption violated) -> Deoptimize back to bytecode",
    interviewQuestion: "What is deoptimization in V8, and what kind of code pattern commonly triggers it?",
  },
  {
    id: "browserinternals-garbage-collection",
    category: "browserinternals",
    difficulty: "Advanced",
    topic: "JS Engine",
    title: "How does garbage collection work in browsers?",
    summary: "V8 uses a generational, mostly-mark-and-sweep collector — a fast Scavenger for short-lived young objects and a concurrent Mark-Sweep-Compact for the old generation.",
    explanation:
      "V8's heap is split into a small young generation (Nursery/Intermediate) and a larger old generation. Most objects die young, so the Scavenger algorithm (a copying collector, Cheney-style) runs frequently and cheaply on the young generation, promoting survivors to old space after surviving a couple of collections. The old generation uses a mark-sweep-compact algorithm, made incremental and mostly concurrent/parallel (running alongside JS execution on helper threads) to minimize the 'stop the world' pauses that would otherwise cause jank. Objects are considered garbage when unreachable from GC roots (global object, active call stacks, closures).",
    code:
      "// Reachability determines collection, not scope exit timing\nfunction makeHandler() {\n  const bigData = new Array(1e6).fill('x'); // captured by closure\n  return () => console.log(bigData.length);\n  // bigData stays alive as long as the returned function is reachable\n}\nconst handler = makeHandler(); // bigData NOT collected while handler exists",
    interviewQuestion: "Why does V8 use a separate, more frequent collection strategy for young objects vs old objects?",
  },
  {
    id: "browserinternals-memory-leaks",
    category: "browserinternals",
    difficulty: "Tricky",
    topic: "JS Engine",
    title: "What causes memory leaks in the browser?",
    summary: "Leaks happen when objects remain reachable via forgotten references even though the app no longer needs them — detached DOM nodes, stray listeners, closures, and growing caches are the classic causes.",
    explanation:
      "Common leak sources: detached DOM nodes still referenced from JS after removal from the tree (so GC can't collect them); event listeners on long-lived objects (e.g. window) that capture large closures and are never removed; timers/intervals that keep firing and holding references; and unbounded caches or arrays that grow forever. Because JS is garbage-collected, there's no 'free()' bug — leaks are always a reachability bug, something is holding a reference longer than intended. DevTools Memory tab (heap snapshots, comparing two snapshots) is the standard tool for finding what's retaining an object via its retainer chain.",
    code:
      "// Leak: listener on window captures a large closure and DOM ref,\n// component removed from DOM but never unmounts the listener\nfunction setup(el) {\n  const bigData = new Array(1e6).fill('leak');\n  window.addEventListener('resize', () => {\n    el.textContent = bigData.length; // el + bigData leak forever\n  });\n}\n// Fix: keep a reference to the handler and removeEventListener on cleanup",
    interviewQuestion: "How would you use Chrome DevTools to confirm a suspected memory leak and identify what's retaining the object?",
  },
  {
    id: "browserinternals-shadow-dom-rendering",
    category: "browserinternals",
    difficulty: "Advanced",
    topic: "Web Components",
    title: "How does Shadow DOM affect rendering?",
    summary: "Shadow DOM attaches an encapsulated, separately-styled DOM subtree to an element, isolating its styles and structure from the main document.",
    explanation:
      "A shadow root creates a boundary: CSS selectors in the outer document don't cross into the shadow tree (and vice versa) unless using specific piercing mechanisms like ::part or CSS custom properties, which inherit through. Internally, the browser still flattens the shadow tree into the 'flat tree' for rendering purposes (combining light DOM slotted content with shadow DOM structure) before layout/paint proceed as normal. Encapsulation is a huge win for component libraries — a <video> element's native controls are themselves implemented using shadow DOM internally.",
    code:
      "class MyCard extends HTMLElement {\n  connectedCallback() {\n    const shadow = this.attachShadow({ mode: 'open' });\n    shadow.innerHTML = `\n      <style>p { color: red; }</style>\n      <p><slot>default text</slot></p>\n    `;\n  }\n}\ncustomElements.define('my-card', MyCard);\n// Outer page's 'p { color: blue }' does NOT leak into the shadow tree",
    interviewQuestion: "Why doesn't a global CSS rule like 'p { color: blue }' affect a <p> inside a shadow root, and how would you intentionally allow theming through the boundary?",
  },
  {
    id: "browserinternals-custom-elements-lifecycle",
    category: "browserinternals",
    difficulty: "Intermediate",
    topic: "Web Components",
    title: "What is the Custom Elements lifecycle?",
    summary: "Custom Elements expose lifecycle callbacks — connectedCallback, disconnectedCallback, attributeChangedCallback, adoptedCallback — invoked by the browser at defined points.",
    explanation:
      "connectedCallback fires when the element is inserted into a document-connected DOM tree (a good place to set up listeners, fetch data, or attach shadow DOM). disconnectedCallback fires on removal, the right place for cleanup like removing listeners to avoid leaks. attributeChangedCallback fires when an attribute listed in the static observedAttributes array changes, letting the element react to markup changes. adoptedCallback fires when the element is moved to a new document via document.adoptNode, which is rare in practice (e.g. moving nodes into an iframe).",
    code:
      "class Counter extends HTMLElement {\n  static get observedAttributes() { return ['count']; }\n  connectedCallback() { this.render(); }\n  disconnectedCallback() { console.log('cleanup listeners here'); }\n  attributeChangedCallback(name, oldVal, newVal) { this.render(); }\n  render() { this.textContent = `Count: ${this.getAttribute('count')}`; }\n}\ncustomElements.define('my-counter', Counter);",
    interviewQuestion: "Why must attributes be listed in observedAttributes for attributeChangedCallback to fire on them?",
  },
  {
    id: "browserinternals-webassembly",
    category: "browserinternals",
    difficulty: "Advanced",
    topic: "WebAssembly",
    title: "How does WebAssembly run in the browser?",
    summary: "Wasm is a portable, sandboxed, near-native-speed binary instruction format that runs alongside JS in the same engine, sharing linear memory.",
    explanation:
      "Wasm modules are compiled ahead of time from languages like C/C++/Rust into a compact binary format, then the browser validates and compiles that binary to machine code (V8 uses Liftoff for fast baseline compilation and TurboFan for optimized tiers, similar to JS's JIT tiers but starting from a lower-level, statically-typed IR so compilation is faster and more predictable). Wasm runs in the same sandboxed process as JS, communicates via JS bindings, and shares a linear memory buffer (ArrayBuffer) that JS can read/write directly. It's used for compute-heavy tasks (codecs, games, image processing, ML inference) where native-like performance matters, not as a full replacement for JS/DOM manipulation.",
    code:
      "// Loading and calling a Wasm module from JS\nconst { instance } = await WebAssembly.instantiateStreaming(\n  fetch('math.wasm')\n);\nconst result = instance.exports.add(2, 3); // calls compiled Wasm function\n\n// Shared linear memory, viewable/writable from JS\nconst mem = new Uint8Array(instance.exports.memory.buffer);\nmem[0] = 42;",
    interviewQuestion: "Why is WebAssembly generally faster and more predictable to compile than JavaScript, even though both can be JIT-compiled?",
  },
];
