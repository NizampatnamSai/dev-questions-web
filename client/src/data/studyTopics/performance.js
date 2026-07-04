// 30 performance topics for Study Hub.
export default [
  {
    id: "performance-core-web-vitals",
    category: "performance",
    topic: "Core Web Vitals",
    title: "What are Core Web Vitals (LCP, FID, CLS, INP)?",
    difficulty: "Basic",
    summary:
      "Core Web Vitals are Google's standardized metrics for measuring real-world user experience: loading speed, interactivity, and visual stability.",
    explanation:
      "Largest Contentful Paint (LCP) measures loading performance by tracking when the largest visible element renders, and should occur within 2.5 seconds. First Input Delay (FID) measured the time from a user's first interaction to the browser responding, but it has been replaced by Interaction to Next Paint (INP), which measures responsiveness across the entire page lifecycle rather than just the first interaction. Cumulative Layout Shift (CLS) measures visual stability by summing unexpected layout shifts, targeting a score below 0.1. These metrics are field-measurable via the Chrome User Experience Report and directly influence Google search ranking.",
    code: "import { onLCP, onCLS, onINP } from 'web-vitals';\n\nonLCP((metric) => {\n  console.log('LCP:', metric.value);\n  sendToAnalytics(metric);\n});\n\nonCLS((metric) => {\n  console.log('CLS:', metric.value);\n  sendToAnalytics(metric);\n});\n\nonINP((metric) => {\n  console.log('INP:', metric.value);\n  sendToAnalytics(metric);\n});",
    interviewQuestion:
      "What replaced First Input Delay as a Core Web Vital, and why was the change made?",
  },
  {
    id: "performance-lighthouse-audits",
    category: "performance",
    topic: "Auditing Tools",
    title: "How do Lighthouse audits evaluate page performance?",
    difficulty: "Basic",
    summary:
      "Lighthouse is an automated auditing tool that scores pages on performance, accessibility, best practices, and SEO using lab data collected in a controlled environment.",
    explanation:
      "Lighthouse runs a series of audits against a page under simulated network and CPU throttling conditions, producing a performance score weighted from metrics like First Contentful Paint, Speed Index, Largest Contentful Paint, Total Blocking Time, and Cumulative Layout Shift. Because it uses lab data rather than real user data, results can differ from field data reported by tools like the Chrome User Experience Report. Lighthouse also provides actionable diagnostics such as unused JavaScript, render-blocking resources, and oversized images. It is available in Chrome DevTools, as a CLI tool, and integrated into CI pipelines for regression detection.",
    code: "# Run Lighthouse from the CLI against a URL\nnpx lighthouse https://example.com \\\n  --output=json \\\n  --output-path=./report.json \\\n  --chrome-flags=\"--headless\"\n\n# Enforce a performance budget in CI\nnpx lighthouse https://example.com \\\n  --budget-path=./budget.json \\\n  --only-categories=performance",
    interviewQuestion:
      "Why might Lighthouse scores differ from real user metrics collected in the field, and how would you reconcile the two?",
  },
  {
    id: "performance-code-splitting",
    category: "performance",
    topic: "Bundling",
    title: "How does code splitting improve performance?",
    difficulty: "Intermediate",
    summary:
      "Code splitting breaks a single large JavaScript bundle into smaller chunks that load on demand, reducing the amount of code the browser must download and parse upfront.",
    explanation:
      "Bundlers like Webpack, Vite, and Rollup support code splitting via dynamic import() statements, which create separate chunk files loaded only when needed. Route-based splitting loads code for a page only when the user navigates to it, while component-based splitting defers non-critical UI like modals or charts. This reduces initial bundle size, improving Time to Interactive and First Contentful Paint since the browser has less JavaScript to parse and execute on first load. The tradeoff is added complexity around loading states and the risk of waterfall requests if splitting is too granular.",
    code: "// Route-based code splitting with React.lazy\nimport { lazy, Suspense } from 'react';\n\nconst Dashboard = lazy(() => import('./Dashboard'));\nconst Settings = lazy(() => import('./Settings'));\n\nfunction App() {\n  return (\n    <Suspense fallback={<Spinner />}>\n      <Routes>\n        <Route path=\"/dashboard\" element={<Dashboard />} />\n        <Route path=\"/settings\" element={<Settings />} />\n      </Routes>\n    </Suspense>\n  );\n}",
    interviewQuestion:
      "How would you decide the granularity of code splitting in a large single-page application?",
  },
  {
    id: "performance-lazy-loading-strategies",
    category: "performance",
    topic: "Loading Strategies",
    title: "What lazy loading strategies exist for web apps?",
    difficulty: "Intermediate",
    summary:
      "Lazy loading defers loading non-critical resources such as images, components, or routes until they are actually needed, reducing initial page weight.",
    explanation:
      "Common strategies include native lazy loading via the loading=\"lazy\" attribute on images and iframes, viewport-based lazy loading using the IntersectionObserver API for custom components, and route-level lazy loading with dynamic imports in single-page applications. Lazy loading below-the-fold content improves initial load metrics like LCP and Time to Interactive without sacrificing full functionality. A common pitfall is lazy loading the LCP image itself, which delays it and hurts the LCP score. Combining lazy loading with placeholder skeletons or low-quality image previews improves perceived performance while resources load.",
    code: "// IntersectionObserver-based lazy loading for a component\nconst observer = new IntersectionObserver((entries) => {\n  entries.forEach((entry) => {\n    if (entry.isIntersecting) {\n      loadComponent(entry.target);\n      observer.unobserve(entry.target);\n    }\n  });\n}, { rootMargin: '200px' });\n\ndocument.querySelectorAll('.lazy-section').forEach((el) => {\n  observer.observe(el);\n});\n\n// Native image lazy loading\n// <img src=\"chart.png\" loading=\"lazy\" alt=\"Chart\" />",
    interviewQuestion:
      "Why can lazy loading an above-the-fold hero image actually hurt LCP, and how would you avoid that mistake?",
  },
  {
    id: "performance-image-optimization",
    category: "performance",
    topic: "Assets",
    title: "What image optimization techniques reduce page weight?",
    difficulty: "Basic",
    summary:
      "Image optimization reduces file size and improves loading speed through modern formats, responsive sizing, compression, and appropriate delivery methods.",
    explanation:
      "Modern formats like WebP and AVIF offer significantly better compression than JPEG or PNG at equivalent visual quality. The srcset and sizes attributes let the browser choose an appropriately sized image for the viewport instead of downloading a single oversized asset. CDN-based image services can perform on-the-fly resizing, format negotiation, and quality compression based on the requesting device. Additional techniques include lazy loading offscreen images, using low-quality image placeholders (LQIP) or blurred previews for perceived performance, and specifying width and height attributes to prevent layout shift while the image loads.",
    code: "<picture>\n  <source\n    srcset=\"hero-400.avif 400w, hero-800.avif 800w, hero-1200.avif 1200w\"\n    type=\"image/avif\"\n  />\n  <source\n    srcset=\"hero-400.webp 400w, hero-800.webp 800w, hero-1200.webp 1200w\"\n    type=\"image/webp\"\n  />\n  <img\n    src=\"hero-800.jpg\"\n    srcset=\"hero-400.jpg 400w, hero-800.jpg 800w, hero-1200.jpg 1200w\"\n    sizes=\"(max-width: 600px) 400px, 800px\"\n    width=\"800\"\n    height=\"450\"\n    alt=\"Hero banner\"\n  />\n</picture>",
    interviewQuestion:
      "How do width and height attributes on an img tag help Cumulative Layout Shift even before the image loads?",
  },
  {
    id: "performance-critical-css",
    category: "performance",
    topic: "Rendering",
    title: "What is critical CSS and why does it matter?",
    difficulty: "Advanced",
    summary:
      "Critical CSS is the minimal set of styles needed to render above-the-fold content, inlined in the HTML to avoid render-blocking external stylesheet requests.",
    explanation:
      "By default, external stylesheets block rendering until they are downloaded and parsed, delaying First Contentful Paint. Extracting the CSS required for above-the-fold content and inlining it directly in the document head lets the browser paint visible content immediately, while the full stylesheet loads asynchronously in the background using techniques like a preload with an onload handler or the media=\"print\" swap trick. Tools like Critical, Penthouse, or framework-level plugins can automate extraction by rendering the page and recording which rules apply to the initial viewport. The tradeoff is added build complexity and the risk of a flash of unstyled content if the deferred stylesheet load is mishandled.",
    code: "<head>\n  <style>\n    /* Inlined critical CSS for above-the-fold content */\n    body { margin: 0; font-family: sans-serif; }\n    .hero { height: 60vh; background: #111; color: #fff; }\n  </style>\n  <link\n    rel=\"preload\"\n    href=\"/styles/full.css\"\n    as=\"style\"\n    onload=\"this.onload=null;this.rel='stylesheet'\"\n  />\n  <noscript><link rel=\"stylesheet\" href=\"/styles/full.css\" /></noscript>\n</head>",
    interviewQuestion:
      "Walk through how you would automate critical CSS extraction for a server-rendered application with many page templates.",
  },
  {
    id: "performance-resource-hints",
    category: "performance",
    topic: "Resource Hints",
    title: "How do preload, prefetch, and preconnect differ?",
    difficulty: "Intermediate",
    summary:
      "Resource hints tell the browser to prioritize connections or downloads ahead of when they are discovered naturally, reducing latency for critical or future resources.",
    explanation:
      "preload tells the browser to fetch a resource needed for the current navigation with high priority, such as a critical font or hero image, so it is not discovered late by the parser. prefetch fetches a resource likely needed for a future navigation at low priority, useful for anticipating the next page a user will visit. preconnect establishes the DNS, TCP, and TLS handshake to a cross-origin domain ahead of time, saving round trips when a request to that origin is imminent, such as a third-party API or font CDN. Overusing these hints, especially preload, can hurt performance by competing with genuinely critical resources for bandwidth.",
    code: "<head>\n  <!-- Establish early connection to a third-party origin -->\n  <link rel=\"preconnect\" href=\"https://fonts.gstatic.com\" crossorigin />\n\n  <!-- Prioritize a critical font needed immediately -->\n  <link\n    rel=\"preload\"\n    href=\"/fonts/inter-var.woff2\"\n    as=\"font\"\n    type=\"font/woff2\"\n    crossorigin\n  />\n\n  <!-- Hint at a likely next navigation -->\n  <link rel=\"prefetch\" href=\"/checkout.js\" as=\"script\" />\n</head>",
    interviewQuestion:
      "What can go wrong if you preload too many resources on a page, and how would you diagnose it?",
  },
  {
    id: "performance-caching-strategies",
    category: "performance",
    topic: "Caching",
    title: "What caching strategies exist across browser, CDN, and service worker layers?",
    difficulty: "Advanced",
    summary:
      "Effective caching layers content at the browser, CDN, and service worker level using cache-control headers and programmable strategies to minimize redundant network requests.",
    explanation:
      "Browser caching is controlled through HTTP headers like Cache-Control, ETag, and Last-Modified, letting the browser reuse a cached response or revalidate cheaply with a 304 response. CDN caching stores responses at edge nodes close to users, often with longer TTLs for static assets and cache invalidation or versioned URLs for updates. Service workers enable programmable caching strategies such as cache-first for static assets, network-first for frequently changing data, and stale-while-revalidate for a balance of speed and freshness. Combining these layers requires care around cache invalidation, since serving stale content is the most common failure mode of aggressive caching.",
    code: "// Service worker: stale-while-revalidate strategy\nself.addEventListener('fetch', (event) => {\n  event.respondWith(\n    caches.open('v1').then(async (cache) => {\n      const cached = await cache.match(event.request);\n      const networkFetch = fetch(event.request).then((response) => {\n        cache.put(event.request, response.clone());\n        return response;\n      });\n      return cached || networkFetch;\n    })\n  );\n});\n\n// HTTP header for immutable static assets\n// Cache-Control: public, max-age=31536000, immutable",
    interviewQuestion:
      "When would you choose a stale-while-revalidate strategy over cache-first in a service worker, and what risk does it introduce?",
  },
  {
    id: "performance-bundle-size-optimization",
    category: "performance",
    topic: "Bundling",
    title: "How do you optimize JavaScript bundle size?",
    difficulty: "Intermediate",
    summary:
      "Bundle size optimization reduces the amount of JavaScript shipped to the browser through tree shaking, code splitting, dependency auditing, and minification.",
    explanation:
      "Bundle analyzers like webpack-bundle-analyzer or source-map-explorer visualize which modules contribute most to bundle size, often revealing large dependencies pulled in for a small feature. Common wins include replacing heavy libraries with lighter alternatives, importing only the specific functions needed from a package rather than the entire library, enabling tree shaking through ES modules, and code splitting rarely used routes. Minification and compression further reduce transferred bytes, while duplicate dependency detection catches cases where multiple versions of the same package are bundled. Continuous monitoring via CI budgets prevents bundle size from silently regressing over time.",
    code: "// Bad: imports the entire lodash library\nimport _ from 'lodash';\nconst result = _.debounce(fn, 300);\n\n// Good: imports only the needed function\nimport debounce from 'lodash/debounce';\nconst result2 = debounce(fn, 300);\n\n// Analyze bundle composition\n// npx webpack-bundle-analyzer dist/stats.json",
    interviewQuestion:
      "You notice your bundle grew by 200KB after a routine dependency update. How would you track down the cause?",
  },
  {
    id: "performance-tree-shaking",
    category: "performance",
    topic: "Bundling",
    title: "How does tree shaking eliminate dead code?",
    difficulty: "Intermediate",
    summary:
      "Tree shaking removes unused exports from the final bundle by statically analyzing ES module import and export graphs at build time.",
    explanation:
      "Tree shaking relies on the static structure of ES modules, where imports and exports are declared at the top level and can be analyzed without executing code, unlike CommonJS's dynamic require calls. Bundlers like Rollup and Webpack trace which exports are actually referenced and eliminate the rest, marking a module's side-effect-free status via the sideEffects field in package.json to allow more aggressive elimination. Tree shaking fails silently when code has side effects the bundler cannot prove are safe to remove, or when libraries are shipped only as CommonJS. Writing and consuming libraries as ES modules with pure, side-effect-free exports maximizes how much dead code can be eliminated.",
    code: "// math.js - only sum is used elsewhere in the app\nexport function sum(a, b) { return a + b; }\nexport function multiply(a, b) { return a * b; } // eliminated if unused\n\n// package.json hint for bundlers\n// {\n//   \"name\": \"my-lib\",\n//   \"sideEffects\": false\n// }\n\nimport { sum } from './math.js';\nconsole.log(sum(2, 3));",
    interviewQuestion:
      "Why does tree shaking work poorly with CommonJS modules, and what would you look for in a library's package.json to confirm it supports tree shaking?",
  },
  {
    id: "performance-debounce-throttle",
    category: "performance",
    topic: "Event Optimization",
    title: "How do debounce and throttle improve performance for frequent events?",
    difficulty: "Basic",
    summary:
      "Debounce delays execution until a burst of events stops, while throttle limits execution to at most once per fixed interval, both reducing expensive work triggered by high-frequency events.",
    explanation:
      "Debouncing is ideal for events like search-as-you-type or window resize where only the final state matters, since it waits for a pause in activity before running the callback. Throttling suits continuous events like scroll or mouse move where you want periodic updates during the activity, such as updating a progress indicator, rather than waiting for it to stop. Both techniques prevent expensive operations like API calls, layout recalculation, or re-renders from firing on every single event, which can otherwise overwhelm the main thread and cause jank. Choosing the wrong one is a common mistake, such as throttling a search input and firing unnecessary requests on every keystroke interval.",
    code: "function debounce(fn, delay) {\n  let timer;\n  return (...args) => {\n    clearTimeout(timer);\n    timer = setTimeout(() => fn(...args), delay);\n  };\n}\n\nfunction throttle(fn, limit) {\n  let inThrottle = false;\n  return (...args) => {\n    if (!inThrottle) {\n      fn(...args);\n      inThrottle = true;\n      setTimeout(() => (inThrottle = false), limit);\n    }\n  };\n}\n\nwindow.addEventListener('scroll', throttle(updateProgressBar, 100));\nsearchInput.addEventListener('input', debounce(fetchResults, 300));",
    interviewQuestion:
      "Would you use debounce or throttle for an infinite-scroll pagination trigger, and why?",
  },
  {
    id: "performance-virtual-scrolling",
    category: "performance",
    topic: "Rendering",
    title: "How does virtual scrolling handle large lists efficiently?",
    difficulty: "Advanced",
    summary:
      "Virtual scrolling renders only the list items currently visible in the viewport, plus a small buffer, instead of rendering the entire dataset into the DOM at once.",
    explanation:
      "Rendering thousands of DOM nodes for a long list causes slow initial render, high memory usage, and janky scrolling due to layout and paint costs. Virtual scrolling calculates which items fall within the visible viewport based on scroll position and item height, rendering only those elements while using spacer elements or transforms to preserve correct scroll height and position. Libraries like react-window, react-virtualized, and TanStack Virtual implement this pattern, supporting both fixed and variable item heights. The main complexity is handling variable-height items, dynamic content measurement, and maintaining scroll position when items above the viewport change size.",
    code: "import { FixedSizeList } from 'react-window';\n\nfunction Row({ index, style }) {\n  return <div style={style}>Row {index}</div>;\n}\n\nfunction VirtualList({ items }) {\n  return (\n    <FixedSizeList\n      height={600}\n      itemCount={items.length}\n      itemSize={35}\n      width=\"100%\"\n    >\n      {Row}\n    </FixedSizeList>\n  );\n}",
    interviewQuestion:
      "How would you implement virtual scrolling for a list where each item has a different, dynamically measured height?",
  },
  {
    id: "performance-web-workers",
    category: "performance",
    topic: "Concurrency",
    title: "How do Web Workers offload work from the main thread?",
    difficulty: "Advanced",
    summary:
      "Web Workers run JavaScript on a separate background thread, freeing the main thread from expensive computation so the UI stays responsive.",
    explanation:
      "The main thread handles rendering, layout, and user interaction, so any long-running synchronous JavaScript, like parsing large JSON, image processing, or complex calculations, blocks the UI and causes jank or unresponsiveness. Web Workers run in an isolated global scope without DOM access, communicating with the main thread via postMessage and structured cloning of data, or via SharedArrayBuffer for zero-copy shared memory in supported environments. This makes workers ideal for CPU-intensive tasks that do not need direct DOM manipulation. The overhead of message passing and worker startup means workers are best suited for genuinely expensive tasks rather than trivial computations.",
    code: "// main.js\nconst worker = new Worker('worker.js');\nworker.postMessage({ numbers: largeArray });\nworker.onmessage = (event) => {\n  console.log('Result:', event.data.result);\n};\n\n// worker.js\nself.onmessage = (event) => {\n  const { numbers } = event.data;\n  const result = numbers.reduce((sum, n) => sum + heavyCompute(n), 0);\n  self.postMessage({ result });\n};",
    interviewQuestion:
      "What are the tradeoffs of using postMessage versus SharedArrayBuffer for communicating with a Web Worker?",
  },
  {
    id: "performance-memory-leak-detection",
    category: "performance",
    topic: "Profiling",
    title: "How do you detect and diagnose memory leaks in a web app?",
    difficulty: "Advanced",
    summary:
      "Memory leaks occur when objects are unintentionally retained in memory, and are diagnosed using heap snapshots and allocation timelines in browser DevTools.",
    explanation:
      "Common causes include detached DOM nodes still referenced by JavaScript, forgotten event listeners or timers, closures unintentionally capturing large objects, and growing caches without eviction. Chrome DevTools' Memory panel lets you take heap snapshots before and after an action, then compare them to see which object types grew unexpectedly, or use the allocation timeline to watch memory grow in real time. A telltale sign is a sawtooth memory graph that never returns to baseline after garbage collection runs, indicating objects that should have been collected are still reachable. Fixing leaks typically means removing event listeners in cleanup functions, clearing intervals, and nullifying references to detached DOM nodes.",
    code: "// Common leak: listener never removed\nfunction setupWidget() {\n  const handler = () => console.log('resize');\n  window.addEventListener('resize', handler);\n  // missing cleanup allows handler and its closure to leak\n}\n\n// Fixed in a React component\nuseEffect(() => {\n  const handler = () => console.log('resize');\n  window.addEventListener('resize', handler);\n  return () => window.removeEventListener('resize', handler);\n}, []);",
    interviewQuestion:
      "You see a sawtooth pattern in the memory timeline that never returns to baseline. Walk through how you would isolate the leaking object.",
  },
  {
    id: "performance-devtools-profiling",
    category: "performance",
    topic: "Profiling",
    title: "How do you profile runtime performance with Chrome DevTools?",
    difficulty: "Intermediate",
    summary:
      "The DevTools Performance panel records a timeline of scripting, rendering, painting, and idle time, helping identify what is causing jank or slow interactions.",
    explanation:
      "Recording a performance trace captures a flame chart of JavaScript execution alongside rendering phases like style recalculation, layout, and paint, letting you identify long tasks that block the main thread for more than 50 milliseconds. The Bottom-Up and Call Tree views help pinpoint which function calls consume the most time, while the Summary tab breaks down time spent by category. CPU throttling and network throttling simulate lower-end devices and slower connections to reveal performance issues invisible on a developer machine. Combined with the Performance Insights panel or Lighthouse's trace viewer, this data highlights render-blocking work, layout thrashing from repeated forced reflows, and excessive garbage collection pauses.",
    code: "// Programmatically mark and measure custom timings\nperformance.mark('fetch-start');\nawait fetchDashboardData();\nperformance.mark('fetch-end');\nperformance.measure('fetch-duration', 'fetch-start', 'fetch-end');\n\nconst [measure] = performance.getEntriesByName('fetch-duration');\nconsole.log(`Fetch took ${measure.duration}ms`);",
    interviewQuestion:
      "In a DevTools performance trace, how do you distinguish a long task caused by JavaScript execution from one caused by layout thrashing?",
  },
  {
    id: "performance-time-to-interactive",
    category: "performance",
    topic: "Metrics",
    title: "What does Time to Interactive measure?",
    difficulty: "Intermediate",
    summary:
      "Time to Interactive (TTI) measures how long it takes for a page to become fully interactive, meaning it can reliably respond to user input without significant delay.",
    explanation:
      "TTI is calculated by finding the point after First Contentful Paint where the main thread has been quiet, with no long tasks over 50 milliseconds, for at least a 5-second window. A page can appear visually complete via First Contentful Paint or Largest Contentful Paint while still being unresponsive because JavaScript is busy hydrating components or executing heavy initialization code, a scenario TTI is designed to expose. This is especially relevant for hydration-heavy frameworks where the HTML paints quickly but interactivity lags behind due to hydration cost. Reducing TTI typically involves code splitting, deferring non-critical JavaScript, and minimizing main-thread work during page load.",
    code: "// Long task that delays TTI even after visual content is painted\nfunction blockMainThread() {\n  const start = Date.now();\n  while (Date.now() - start < 300) {\n    // synchronous heavy computation blocking the main thread\n  }\n}\n\n// Better: break work into smaller chunks using scheduler\nfunction processInChunks(items, index = 0) {\n  const chunk = items.slice(index, index + 100);\n  chunk.forEach(processItem);\n  if (index + 100 < items.length) {\n    setTimeout(() => processInChunks(items, index + 100), 0);\n  }\n}",
    interviewQuestion:
      "Why can a server-rendered page have a fast First Contentful Paint but a slow Time to Interactive, and how would you fix it?",
  },
  {
    id: "performance-first-contentful-paint",
    category: "performance",
    topic: "Metrics",
    title: "What does First Contentful Paint measure and how do you improve it?",
    difficulty: "Basic",
    summary:
      "First Contentful Paint (FCP) measures the time from navigation start until the browser renders the first piece of DOM content, such as text or an image.",
    explanation:
      "FCP is an early, user-perceived loading milestone that indicates the browser has started rendering something rather than showing a blank page. It is affected by server response time, render-blocking CSS and JavaScript, and the time needed to build the initial DOM and CSSOM. Improving FCP typically involves reducing time to first byte with faster server responses or caching, eliminating or deferring render-blocking resources, and inlining critical CSS so the browser can paint without waiting on external stylesheets. Unlike Largest Contentful Paint, FCP does not require the main content to be visible, just any content, making it a leading indicator rather than a complete picture of perceived load speed.",
    code: "<!-- Render-blocking resource delays FCP -->\n<link rel=\"stylesheet\" href=\"/styles/theme.css\" />\n<script src=\"/vendor/analytics.js\"></script>\n\n<!-- Improved: defer non-critical script, inline critical CSS -->\n<style>/* critical above-the-fold styles */</style>\n<script src=\"/vendor/analytics.js\" defer></script>",
    interviewQuestion:
      "What is the practical difference between First Contentful Paint and Largest Contentful Paint, and why does Google weight LCP more heavily?",
  },
  {
    id: "performance-total-blocking-time",
    category: "performance",
    topic: "Metrics",
    title: "What is Total Blocking Time and why does it matter?",
    difficulty: "Advanced",
    summary:
      "Total Blocking Time (TBT) sums the portion of long tasks between First Contentful Paint and Time to Interactive that exceeds 50 milliseconds, quantifying how unresponsive a page feels during load.",
    explanation:
      "Any main-thread task longer than 50 milliseconds is considered a long task, since the browser cannot respond to user input during that window, and anything beyond the first 50 milliseconds counts as blocking time. TBT sums these blocking portions across all long tasks occurring between FCP and TTI, giving a lab-measurable proxy for real-world interaction responsiveness that correlates strongly with INP. High TBT usually points to large synchronous JavaScript execution during page load, such as heavy component hydration, expensive third-party scripts, or unoptimized event handler setup. Reducing TBT involves breaking up long tasks with techniques like yielding to the main thread via setTimeout or scheduler.yield, code splitting, and deferring non-critical scripts.",
    code: "// A single long task blocking the main thread for 300ms\nfunction renderAllRows(rows) {\n  rows.forEach(renderRow); // synchronous, blocks for 300ms+\n}\n\n// Yielding to the main thread to reduce TBT\nasync function renderAllRowsChunked(rows) {\n  for (let i = 0; i < rows.length; i += 50) {\n    rows.slice(i, i + 50).forEach(renderRow);\n    await new Promise((resolve) => setTimeout(resolve, 0));\n  }\n}",
    interviewQuestion:
      "How does Total Blocking Time relate to Interaction to Next Paint, and why might a page have low TBT but still feel sluggish to real users?",
  },
  {
    id: "performance-render-blocking-resources",
    category: "performance",
    topic: "Rendering",
    title: "What are render-blocking resources and how do you eliminate them?",
    difficulty: "Intermediate",
    summary:
      "Render-blocking resources are CSS and synchronous JavaScript files that the browser must download and process before it can paint the page, delaying first render.",
    explanation:
      "By default, the browser pauses HTML parsing when it encounters a synchronous script tag and blocks rendering entirely until stylesheets referenced in the head are loaded, since CSS can affect layout and the browser must avoid a flash of unstyled content. Common fixes include adding the defer or async attribute to non-critical scripts so they do not block parsing, inlining critical CSS while loading the rest asynchronously, and splitting stylesheets by media query so print or non-matching-viewport styles do not block the initial render. Third-party scripts like analytics or chat widgets are frequent offenders and should generally be deferred or loaded asynchronously since they are rarely critical to initial render.",
    code: "<!-- Blocking: browser must fetch and run before parsing continues -->\n<script src=\"/vendor/chat-widget.js\"></script>\n\n<!-- Non-blocking: parsing continues, executes after DOM is ready -->\n<script src=\"/vendor/chat-widget.js\" defer></script>\n\n<!-- Media-scoped stylesheet does not block initial render -->\n<link rel=\"stylesheet\" href=\"/print.css\" media=\"print\" />",
    interviewQuestion:
      "What is the difference between the async and defer script attributes, and when would each cause a subtle bug if used incorrectly?",
  },
  {
    id: "performance-font-loading-strategies",
    category: "performance",
    topic: "Assets",
    title: "What font loading strategies prevent layout shift and invisible text?",
    difficulty: "Intermediate",
    summary:
      "Font loading strategies control how custom web fonts load and render, balancing avoiding invisible text against avoiding layout shift when the font swaps in.",
    explanation:
      "By default, browsers may hide text until a custom font loads, known as Flash of Invisible Text (FOIT), or render a fallback font first and swap it later, known as Flash of Unstyled Text (FOUT), which can cause layout shift if the fallback and custom font have different metrics. The font-display CSS property controls this behavior, with swap showing fallback text immediately and swapping when ready, and optional giving the browser freedom to skip the swap on slow connections to avoid shift entirely. Preloading font files with rel=\"preload\" reduces the delay before the custom font is available, and using a font-metric-matched fallback via size-adjust or tools like Fontaine minimizes the visual jump between fallback and final font.",
    code: "@font-face {\n  font-family: 'Inter';\n  src: url('/fonts/inter-var.woff2') format('woff2');\n  font-display: swap;\n  font-weight: 100 900;\n}\n\n<link\n  rel=\"preload\"\n  href=\"/fonts/inter-var.woff2\"\n  as=\"font\"\n  type=\"font/woff2\"\n  crossorigin\n/>",
    interviewQuestion:
      "How would you choose between font-display swap and optional for a marketing site versus an app dashboard?",
  },
  {
    id: "performance-http2-benefits",
    category: "performance",
    topic: "Network",
    title: "What performance benefits does HTTP/2 provide over HTTP/1.1?",
    difficulty: "Intermediate",
    summary:
      "HTTP/2 improves performance through multiplexed requests over a single connection, header compression, and server push, reducing the overhead that HTTP/1.1 workarounds like domain sharding tried to solve.",
    explanation:
      "HTTP/1.1 allows only a limited number of parallel connections per domain, historically six in most browsers, leading developers to shard assets across multiple subdomains to increase parallelism, at the cost of extra DNS lookups and connection setup. HTTP/2 multiplexes many requests and responses over a single TCP connection, eliminating head-of-line blocking at the HTTP layer and making domain sharding counterproductive since it fragments connections that could otherwise be reused. HPACK header compression reduces the overhead of repetitive headers across requests, and binary framing replaces the text-based protocol for more efficient parsing. Because HTTP/2 makes many small requests cheaper, bundling strategies shift toward moderate-sized chunks rather than one giant bundle, letting the browser cache and update individual chunks independently.",
    code: "# HTTP/1.1 era optimization (now often counterproductive with HTTP/2)\n# <link rel=\"dns-prefetch\" href=\"//assets1.example.com\">\n# <link rel=\"dns-prefetch\" href=\"//assets2.example.com\">\n\n# HTTP/2: serve all assets from one origin, let multiplexing work\n# <img src=\"https://example.com/img/photo1.jpg\">\n# <img src=\"https://example.com/img/photo2.jpg\">\n\n# Verify protocol version\ncurl -I --http2 https://example.com",
    interviewQuestion:
      "Why does domain sharding, once a common HTTP/1.1 performance technique, often hurt performance under HTTP/2?",
  },
  {
    id: "performance-compression",
    category: "performance",
    topic: "Network",
    title: "How does compression reduce transfer time for web assets?",
    difficulty: "Basic",
    summary:
      "Compression algorithms like Gzip and Brotli reduce the size of text-based assets such as HTML, CSS, and JavaScript before they are sent over the network, cutting transfer time.",
    explanation:
      "Servers compress responses based on the Accept-Encoding request header and mark the response with Content-Encoding, letting the browser transparently decompress the payload before use. Brotli generally achieves better compression ratios than Gzip, especially at higher quality settings, though it can be slower to compress, making it well suited for precompressing static assets at build time rather than compressing dynamically on every request. Compression is most effective on text-based formats and provides little benefit on already-compressed binary formats like JPEG images or video, where it can even increase size slightly. Combining build-time precompression with a CDN that serves the appropriately compressed variant based on client support is a common production setup.",
    code: "# Nginx: enable Brotli and Gzip with fallback\nbrotli on;\nbrotli_types text/plain text/css application/javascript application/json;\n\ngzip on;\ngzip_types text/plain text/css application/javascript application/json;\ngzip_comp_level 6;\n\n# Precompress assets at build time\n# npx brotli-cli compress dist/*.js --quality 11",
    interviewQuestion:
      "Why might precompressing assets at build time with Brotli be preferable to compressing them on the fly for every request?",
  },
  {
    id: "performance-cdn",
    category: "performance",
    topic: "Network",
    title: "How does a CDN improve web performance?",
    difficulty: "Basic",
    summary:
      "A Content Delivery Network caches and serves content from edge servers geographically close to users, reducing latency and offloading traffic from the origin server.",
    explanation:
      "Without a CDN, every request travels to a single origin server, incurring latency proportional to physical distance and risking origin overload during traffic spikes. CDNs cache static assets like images, CSS, JavaScript, and even API responses at edge points of presence worldwide, so requests are served from the nearest location with a fraction of the round-trip time. Modern CDNs also provide features like automatic Brotli compression, HTTP/2 or HTTP/3 support, image optimization on the fly, DDoS protection, and edge computing capabilities that let logic run closer to the user. Cache invalidation strategy, using techniques like versioned filenames or purge APIs, is critical to avoid serving stale content after deployments.",
    code: "<!-- Serve static assets from a CDN with a versioned filename for cache busting -->\n<script src=\"https://cdn.example.com/app.a1b2c3.js\"></script>\n\n<!-- CDN cache-control header set at origin -->\n<!-- Cache-Control: public, max-age=31536000, immutable -->\n\n# Purge a CDN cache after deploy\ncurl -X POST https://api.cdn-provider.com/purge \\\n  -H \"Authorization: Bearer $CDN_TOKEN\" \\\n  -d '{\"urls\": [\"https://cdn.example.com/app.js\"]}'",
    interviewQuestion:
      "How would you design a cache invalidation strategy for CDN-hosted assets that deploy multiple times per day?",
  },
  {
    id: "performance-database-query-optimization",
    category: "performance",
    topic: "Backend Performance",
    title: "What techniques optimize slow database queries?",
    difficulty: "Advanced",
    summary:
      "Query optimization involves indexing frequently queried columns, analyzing execution plans, and restructuring queries to avoid full table scans and unnecessary computation.",
    explanation:
      "The EXPLAIN or EXPLAIN ANALYZE command reveals a query's execution plan, showing whether the database uses an index scan versus a slower sequential scan, and where most of the time is spent. Adding indexes on columns used in WHERE clauses, joins, and ORDER BY can turn a sequential scan into an index scan, but over-indexing slows down writes and increases storage, so indexes should be added based on actual query patterns. Other techniques include avoiding SELECT * to reduce data transfer, using pagination instead of loading entire result sets, denormalizing hot read paths, and rewriting correlated subqueries as joins where possible. Query optimization should be data-driven, guided by slow query logs and execution plan analysis rather than guesswork.",
    code: "-- Before: sequential scan on a large table\nSELECT * FROM orders WHERE customer_email = 'user@example.com';\n\n-- Add an index to support the filter\nCREATE INDEX idx_orders_customer_email ON orders(customer_email);\n\n-- Inspect the query plan\nEXPLAIN ANALYZE\nSELECT id, total, created_at\nFROM orders\nWHERE customer_email = 'user@example.com'\nORDER BY created_at DESC\nLIMIT 20;",
    interviewQuestion:
      "A query that used to be fast has become slow as the table grew to millions of rows. Walk through your diagnostic process.",
  },
  {
    id: "performance-n-plus-one",
    category: "performance",
    topic: "Backend Performance",
    title: "What is the N+1 query problem and how do you fix it?",
    difficulty: "Advanced",
    summary:
      "The N+1 query problem occurs when fetching a list of records triggers one additional query per record to load related data, resulting in N+1 total queries instead of a constant number.",
    explanation:
      "This typically happens with ORMs when lazy-loaded associations are accessed inside a loop, such as fetching 50 blog posts and then querying the author for each post individually inside a loop, producing 51 queries instead of 2. The fix is eager loading, where the ORM fetches related data upfront using a JOIN or a batched IN query, common ORM methods include include, with, or joinedload depending on the framework. Query logging or an APM tool typically surfaces N+1 patterns as a sudden spike in query count proportional to result set size. While eager loading everywhere seems like a safe default, over-fetching unused relations wastes bandwidth, so eager loading should be applied selectively based on what the view actually renders.",
    code: "// N+1 problem: one query per post to fetch its author\nconst posts = await Post.findAll();\nfor (const post of posts) {\n  post.author = await User.findByPk(post.authorId); // N extra queries\n}\n\n// Fixed with eager loading (Sequelize example)\nconst posts2 = await Post.findAll({\n  include: [{ model: User, as: 'author' }],\n});",
    interviewQuestion:
      "How would you detect an N+1 query problem in production without manually reading every code path?",
  },
  {
    id: "performance-server-side-caching-redis",
    category: "performance",
    topic: "Backend Performance",
    title: "How does server-side caching with Redis reduce load and latency?",
    difficulty: "Advanced",
    summary:
      "Redis is an in-memory data store commonly used to cache expensive database query results, session data, or computed values, avoiding repeated work for frequently requested data.",
    explanation:
      "Because Redis stores data in memory, reads and writes complete in sub-millisecond time, far faster than re-executing a complex database query or recomputing an expensive aggregation. A typical pattern is cache-aside, where the application checks Redis first, and on a cache miss queries the database and populates the cache with a time-to-live so stale data expires automatically. Redis also supports data structures like sorted sets and hashes, useful for leaderboards, rate limiting, and session storage beyond simple key-value caching. The main risks are cache stampedes, where many requests miss the cache simultaneously and overwhelm the database, mitigated by locking or request coalescing, and cache invalidation bugs where stale data is served after an underlying update.",
    code: "async function getUserProfile(userId) {\n  const cacheKey = `user:${userId}:profile`;\n  const cached = await redis.get(cacheKey);\n  if (cached) return JSON.parse(cached);\n\n  const profile = await db.query(\n    'SELECT * FROM users WHERE id = $1',\n    [userId]\n  );\n  await redis.set(cacheKey, JSON.stringify(profile), 'EX', 300);\n  return profile;\n}\n\n// Invalidate on update\nasync function updateUserProfile(userId, data) {\n  await db.update(userId, data);\n  await redis.del(`user:${userId}:profile`);\n}",
    interviewQuestion:
      "What is a cache stampede, and what strategies would you use to prevent one when a popular cache key expires?",
  },
  {
    id: "performance-api-response-optimization",
    category: "performance",
    topic: "Backend Performance",
    title: "How do you optimize API response performance?",
    difficulty: "Intermediate",
    summary:
      "API response optimization reduces payload size and processing time through field selection, pagination, compression, and efficient serialization to speed up client-perceived latency.",
    explanation:
      "Returning only the fields a client needs, through techniques like GraphQL field selection or sparse fieldsets in REST, avoids over-fetching data the client discards. Pagination with cursor-based or offset-based limits prevents unbounded response sizes that slow both serialization on the server and parsing on the client. Enabling Gzip or Brotli compression on API responses, batching multiple related requests into one round trip, and using efficient serialization formats reduce both payload size and time spent marshaling data. Server-side response caching for idempotent GET requests, combined with proper HTTP caching headers, avoids recomputation entirely for repeated identical requests.",
    code: "// Over-fetching: returns entire user object with unused fields\napp.get('/api/users/:id', async (req, res) => {\n  const user = await User.findById(req.params.id);\n  res.json(user);\n});\n\n// Optimized: select only needed fields, cache, and paginate related data\napp.get('/api/users/:id', async (req, res) => {\n  const user = await User.findById(req.params.id)\n    .select('id name avatarUrl')\n    .lean();\n  res.set('Cache-Control', 'private, max-age=60');\n  res.json(user);\n});",
    interviewQuestion:
      "A mobile client complains about slow API responses on a poor network. What server-side changes would you prioritize first?",
  },
  {
    id: "performance-perceived-performance",
    category: "performance",
    topic: "UX Performance",
    title: "What techniques improve perceived performance beyond raw load time?",
    difficulty: "Intermediate",
    summary:
      "Perceived performance techniques make an app feel faster to users through skeleton screens, optimistic UI updates, and progressive rendering, even when actual load time is unchanged.",
    explanation:
      "Skeleton screens show a placeholder layout matching the eventual content shape, giving users an immediate sense of progress instead of a blank screen or spinner, which research shows reduces perceived wait time. Optimistic UI updates apply the expected result of an action immediately, such as showing a new comment before the server confirms it, then reconciling or rolling back if the request fails. Progressive rendering, streaming server-rendered HTML in chunks as it becomes ready, lets users start reading or interacting with early content while the rest of the page continues to load. These techniques do not reduce actual network or compute time, but they align with how users subjectively judge speed, which often matters more for satisfaction than raw metrics.",
    code: "// Optimistic UI update for adding a comment\nasync function addComment(text) {\n  const tempComment = { id: 'temp-' + Date.now(), text, pending: true };\n  setComments((prev) => [...prev, tempComment]);\n\n  try {\n    const saved = await api.postComment(text);\n    setComments((prev) =>\n      prev.map((c) => (c.id === tempComment.id ? saved : c))\n    );\n  } catch (err) {\n    setComments((prev) => prev.filter((c) => c.id !== tempComment.id));\n    showError('Failed to post comment');\n  }\n}",
    interviewQuestion:
      "Describe a situation where optimizing perceived performance could backfire, such as an optimistic update that misleads the user.",
  },
  {
    id: "performance-budgets",
    category: "performance",
    topic: "Process",
    title: "What is a performance budget and how do teams enforce it?",
    difficulty: "Intermediate",
    summary:
      "A performance budget sets measurable limits on metrics like bundle size, load time, or request count, preventing gradual performance regression as a codebase grows.",
    explanation:
      "Budgets can be defined on quantity-based metrics like total JavaScript size or number of requests, timing-based metrics like Largest Contentful Paint or Time to Interactive, or rule-based checks like disallowing synchronous scripts. Enforcing budgets in continuous integration, using tools like Lighthouse CI or bundlesize, fails the build when a pull request exceeds the threshold, catching regressions before they reach production rather than after users complain. Budgets should be set based on real target devices and network conditions relevant to the actual user base, such as a mid-tier Android phone on a 4G connection, rather than an arbitrary number. Without automated enforcement, budgets tend to erode over time as small increments from individual features and dependencies stack up unnoticed.",
    code: "// lighthouserc.js - Lighthouse CI performance budget\nmodule.exports = {\n  ci: {\n    assert: {\n      assertions: {\n        'categories:performance': ['error', { minScore: 0.9 }],\n        'total-byte-weight': ['error', { maxNumericValue: 1600000 }],\n        'interactive': ['error', { maxNumericValue: 5000 }],\n      },\n    },\n  },\n};\n\n// Run in CI\n// npx lhci autorun",
    interviewQuestion:
      "How would you set realistic performance budget thresholds for a product with a global user base on varied devices and networks?",
  },
  {
    id: "performance-rail-model",
    category: "performance",
    topic: "Process",
    title: "What is the RAIL performance model?",
    difficulty: "Tricky",
    summary:
      "RAIL is a user-centric performance model that sets specific response time thresholds for Response, Animation, Idle, and Load, based on human perception research.",
    explanation:
      "Response targets processing a user input within 100 milliseconds so the interaction feels immediate, since delays beyond that are perceptible as lag. Animation targets producing each frame within 10 milliseconds to sustain a smooth 60fps experience, accounting for browser overhead that leaves roughly that budget out of the full 16.7 millisecond frame window. Idle time should be used to perform deferred work in chunks under 50 milliseconds so it does not block the main thread if a user interacts unexpectedly, and Load targets delivering a page interactive within 5 seconds on a mid-tier mobile device over a 4G connection, though modern guidance has tightened this significantly. RAIL reframes performance engineering around the structure of user perception and interaction patterns rather than arbitrary technical metrics, making it a useful mental model even though newer metrics like INP and Core Web Vitals now provide more precise, field-measurable equivalents of the same ideas.",
    code: "// Applying RAIL's Idle budget: break deferred work into <50ms chunks\nfunction runIdleWork(tasks) {\n  requestIdleCallback((deadline) => {\n    while (deadline.timeRemaining() > 0 && tasks.length > 0) {\n      const task = tasks.shift();\n      task();\n    }\n    if (tasks.length > 0) {\n      runIdleWork(tasks);\n    }\n  });\n}\n\n// Response budget: input handler should return within 100ms\ninput.addEventListener('click', () => {\n  updateUIImmediately(); // fast visual feedback\n  scheduleHeavyWork();   // deferred to idle time\n});",
    interviewQuestion:
      "RAIL sets a 100ms budget for Response, but a single frame budget for smooth animation is close to 10ms. Explain why these two thresholds differ so much and what each is actually measuring.",
  },
];
