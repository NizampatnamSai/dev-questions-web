// 71 nextjs topics for Study Hub.
export default [
  {
    id: "nextjs-ssr-vs-ssg-vs-isr-vs-csr",
    category: "nextjs",
    topic: "Rendering",
    title: "SSR vs SSG vs ISR vs CSR",
    difficulty: "Basic",
    summary: "Four rendering strategies",
    explanation:
      "ISR: static HTML built at build time, regenerated in background after revalidate seconds. Best for semi-static content. Combines SSG speed with near-real-time data.",
    code: "// App Router: fetch with revalidate = ISR\nconst data = await fetch(url, { next: { revalidate: 60 } }).then(r => r.json());\n// Force static\nexport const dynamic = 'force-static';\n// Force dynamic (SSR)\nexport const dynamic = 'force-dynamic';",
    interviewQuestion: "What is ISR?",
  },
  {
    id: "nextjs-server-components",
    category: "nextjs",
    topic: "Rendering",
    title: "Server Components",
    difficulty: "Advanced",
    summary: "React Server Components — run on server, no client JS",
    explanation:
      "No. Add 'use client' for hooks. Server Components can import Client Components. Client Components cannot import Server Components directly (pass as children/props instead).",
    code: "// Default: Server Component\nasync function UserList() {\n  const users = await db.query('SELECT * FROM users');\n  return <ul>{users.map(u => <li key={u.id}>{u.name}</li>)}</ul>;\n}\n// Client Component\n'use client';\nfunction Counter() {\n  const [n, setN] = useState(0);\n  return <button onClick={() => setN(n+1)}>{n}</button>;\n}",
    interviewQuestion: "Can Server Components use hooks?",
  },
  {
    id: "nextjs-streaming-suspense",
    category: "nextjs",
    topic: "Rendering",
    title: "Streaming & Suspense",
    difficulty: "Advanced",
    summary: "Progressive HTML streaming from server",
    explanation:
      "First byte arrives immediately. Important content (hero, nav) renders without waiting for slow data fetches. Slow sections (recommendations, related posts) stream in separately.",
    code: "// loading.tsx auto-creates Suspense boundary\nexport default function Loading() { return <PageSkeleton />; }\n// Manual Suspense for granular control\n<>\n  <Hero />  {/* immediate */}\n  <Suspense fallback={<RecoSkeleton />}>\n    <Recommendations /> {/* streams separately */}\n  </Suspense>\n</>",
    interviewQuestion: "How does streaming improve LCP?",
  },
  {
    id: "nextjs-app-router-file-conventions",
    category: "nextjs",
    topic: "Routing",
    title: "App Router file conventions",
    difficulty: "Intermediate",
    summary: "page, layout, template, loading, error, not-found",
    explanation:
      "layout: persistent state preserved on navigation (doesn't remount). template: creates new instance per navigation (remounts). Use template for animations or per-route state reset.",
    code: "app/\n  layout.tsx       -- root shell (persistent)\n  page.tsx         -- /\n  dashboard/\n    layout.tsx     -- sidebar (persistent)\n    loading.tsx    -- Suspense fallback\n    error.tsx      -- Error boundary\n    not-found.tsx  -- 404 for segment\n    page.tsx       -- /dashboard",
    interviewQuestion: "layout vs template?",
  },
  {
    id: "nextjs-dynamic-routes",
    category: "nextjs",
    topic: "Routing",
    title: "Dynamic routes",
    difficulty: "Intermediate",
    summary: "[param], [...slug], [[...slug]] segments",
    explanation:
      "[...slug]: required — route only matches if segment has value. [[...slug]]: optional — also matches the segment without any slug (e.g., /blog matches app/blog/[[...slug]]/page.tsx).",
    code: "// app/blog/[slug]/page.tsx\nexport default function Post({ params }: { params: { slug: string } }) {}\n// app/docs/[...path]/page.tsx  -- /docs/a/b/c\nexport default function Doc({ params }: { params: { path: string[] } }) {}",
    interviewQuestion: "Difference between [...slug] and [[...slug]]?",
  },
  {
    id: "nextjs-route-groups",
    category: "nextjs",
    topic: "Routing",
    title: "Route groups",
    difficulty: "Intermediate",
    summary: "(folder) groups routes without affecting URL",
    explanation:
      "Organize routes without URL segments: different layouts for auth vs app, separate loading/error states per group.",
    code: "app/\n  (marketing)/\n    layout.tsx  -- marketing layout (no header)\n    page.tsx    -- /\n    about/page.tsx  -- /about\n  (app)/\n    layout.tsx  -- app shell with sidebar\n    dashboard/page.tsx  -- /dashboard",
    interviewQuestion: "What are route groups used for?",
  },
  {
    id: "nextjs-middleware",
    category: "nextjs",
    topic: "Routing",
    title: "Middleware",
    difficulty: "Advanced",
    summary: "Run code at the edge before request",
    explanation:
      "No Node.js APIs (fs, database drivers) — runs in Edge runtime. No JSX. Size limit on imports. Use for: auth redirects, geolocation headers, A/B testing, rate limiting.",
    code: "// middleware.ts (root)\nimport { NextResponse } from 'next/server';\nimport { verifyJWT } from '@/lib/auth';\nexport function middleware(req) {\n  const token = req.cookies.get('token')?.value;\n  if (!token && req.nextUrl.pathname.startsWith('/app')) {\n    return NextResponse.redirect(new URL('/login', req.url));\n  }\n}\nexport const config = { matcher: ['/app/:path*'] };",
    interviewQuestion: "What can middleware NOT do?",
  },
  {
    id: "nextjs-route-handlers",
    category: "nextjs",
    topic: "Data",
    title: "Route handlers",
    difficulty: "Intermediate",
    summary: "API routes in App Router",
    explanation:
      "GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS. GET is cached by default; mutation methods are not. Add dynamic = 'force-dynamic' to opt GET out of cache.",
    code: "// app/api/posts/route.ts\nexport async function GET(req: NextRequest) {\n  const { searchParams } = new URL(req.url);\n  const page = Number(searchParams.get('page') ?? 1);\n  return NextResponse.json(await getPosts(page));\n}\nexport async function POST(req: NextRequest) {\n  const body = await req.json();\n  const post = await createPost(body);\n  return NextResponse.json(post, { status: 201 });\n}",
    interviewQuestion: "What HTTP methods are supported?",
  },
  {
    id: "nextjs-server-actions",
    category: "nextjs",
    topic: "Data",
    title: "Server Actions",
    difficulty: "Advanced",
    summary: "Async server functions called from client",
    explanation:
      "Yes — Next.js adds origin checking and a unique action ID per action. Can't be called from arbitrary origins.",
    code: "'use server';\nasync function deletePost(formData: FormData) {\n  const id = formData.get('id') as string;\n  await db.posts.delete(id);\n  revalidatePath('/posts');\n}\n// With useActionState (React 19)\nconst [state, action, pending] = useActionState(createPost, null);",
    interviewQuestion: "Are Server Actions CSRF-safe?",
  },
  {
    id: "nextjs-caching-layers",
    category: "nextjs",
    topic: "Data",
    title: "Caching layers",
    difficulty: "Advanced",
    summary: "Request memoization, Data cache, Full Route Cache, Router Cache",
    explanation:
      "revalidatePath('/posts') invalidates Full Route Cache for that path. revalidateTag('posts') invalidates all fetches tagged with 'posts'. Both run inside Server Actions or Route Handlers only.",
    code: "// Tag fetches\nawait fetch(url, { next: { tags: ['posts'] } });\n// Bust by tag\nimport { revalidateTag, revalidatePath } from 'next/cache';\nrevalidateTag('posts'); // all tagged fetches\nrevalidatePath('/posts'); // full route cache",
    interviewQuestion: "How do you bust the Data cache after a mutation?",
  },
  {
    id: "nextjs-image-optimization",
    category: "nextjs",
    topic: "Performance",
    title: "Image optimization",
    difficulty: "Intermediate",
    summary: "next/image — lazy loading, sizing, format conversion",
    explanation:
      "Adds <link rel=preload> and disables lazy loading. Use for LCP (above-fold) images only. All other images are lazy by default.",
    code: "import Image from 'next/image';\n<Image\n  src='/hero.jpg'\n  alt='Hero'\n  width={1200}\n  height={600}\n  priority  // LCP image -- preload\n  sizes='(max-width:768px) 100vw, 50vw'\n  quality={85}\n/>",
    interviewQuestion: "What does priority do?",
  },
  {
    id: "nextjs-font-optimization",
    category: "nextjs",
    topic: "Performance",
    title: "Font optimization",
    difficulty: "Intermediate",
    summary: "next/font — self-hosted, zero CLS",
    explanation:
      "Generates CSS size-adjust and ascent-override to match fallback font metrics exactly. Self-hosts at build time — no external requests during page load.",
    code: "import { Inter, JetBrains_Mono } from 'next/font/google';\nconst inter = Inter({ subsets: ['latin'], variable: '--font-sans' });\nconst mono  = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });\nexport default function RootLayout({ children }) {\n  return <html className={`${inter.variable} ${mono.variable}`}>{children}</html>;\n}",
    interviewQuestion: "How does next/font prevent layout shift?",
  },
  {
    id: "nextjs-script-optimization",
    category: "nextjs",
    topic: "Performance",
    title: "Script optimization",
    difficulty: "Intermediate",
    summary: "next/script with loading strategies",
    explanation:
      "beforeInteractive: blocks page (critical scripts only). afterInteractive: after hydration (analytics). lazyOnload: when browser is idle (chat widgets, non-critical).",
    code: "import Script from 'next/script';\n// Analytics: after hydration\n<Script src='analytics.js' strategy='afterInteractive' />\n// Chat widget: idle time\n<Script src='chat.js' strategy='lazyOnload' onLoad={() => initChat()} />",
    interviewQuestion:
      "What is the difference between beforeInteractive, afterInteractive, and lazyOnload?",
  },
  {
    id: "nextjs-metadata-api",
    category: "nextjs",
    topic: "SEO",
    title: "Metadata API",
    difficulty: "Intermediate",
    summary: "Export metadata object or generateMetadata function",
    explanation:
      "Export async generateMetadata function from page.tsx. It receives params — use it to fetch data for title, description, og tags.",
    code: "// Static metadata\nexport const metadata = {\n  title: 'Dev Life',\n  description: 'Practice coding interview questions',\n  openGraph: { images: ['/og.png'] },\n};\n// Dynamic metadata\nexport async function generateMetadata({ params }) {\n  const post = await getPost(params.slug);\n  return { title: post.title, description: post.excerpt };\n}",
    interviewQuestion: "How do you generate dynamic metadata?",
  },
  {
    id: "nextjs-parallel-routes",
    category: "nextjs",
    topic: "Advanced",
    title: "Parallel routes",
    difficulty: "Advanced",
    summary: "Render multiple pages in same layout (@slot)",
    explanation:
      "Dashboards with independent sections, modals that show inline with background page, tabs that navigate independently.",
    code: "app/\n  layout.tsx  -- renders {children} {analytics} {team}\n  @analytics/\n    page.tsx   -- /dashboard/analytics slot\n  @team/\n    page.tsx   -- /dashboard/team slot\n  page.tsx     -- main content",
    interviewQuestion: "When do you use parallel routes?",
  },
  {
    id: "nextjs-intercepting-routes",
    category: "nextjs",
    topic: "Advanced",
    title: "Intercepting routes",
    difficulty: "Advanced",
    summary: "Show route in modal while keeping background",
    explanation:
      "(.) same level, (..) one level up, (...) root. When intercepted route is navigated via Link, shows as modal. Direct URL navigation shows full page.",
    code: "app/\n  @modal/\n    (.)photo/[id]/page.tsx  -- intercepted: modal\n  photo/[id]/page.tsx        -- direct: full page\n  page.tsx\n  layout.tsx  -- renders {children} {modal}",
    interviewQuestion: "How do intercepting routes work?",
  },
  {
    id: "nextjs-use-client-boundary",
    category: "nextjs",
    topic: "Tricky",
    title: "use client boundary",
    difficulty: "Tricky",
    summary: "'use client' marks Client Component boundary",
    explanation:
      "Yes — all imports in a 'use client' file become Client Components. But children/props can still be Server Components — they're passed through, not imported.",
    code: "// ClientWrapper.tsx\n'use client';\nfunction Drawer({ children }: { children: ReactNode }) {\n  const [open, setOpen] = useState(false);\n  return <div>{open && children}</div>;\n}\n// page.tsx (Server)\n<Drawer>\n  <ServerDataComponent /> {/* server-rendered */}\n</Drawer>",
    interviewQuestion: "Does 'use client' make ALL imports client-side?",
  },
  {
    id: "nextjs-environment-variables",
    category: "nextjs",
    topic: "Tricky",
    title: "Environment variables",
    difficulty: "Intermediate",
    summary: "Server vs client env var exposure",
    explanation:
      "Only NEXT_PUBLIC_ vars are bundled to client. Others are server-only. Warning: if you pass a server env var as prop to a Client Component, it leaks to the client bundle.",
    code: "# .env.local\nDATABASE_URL=postgres://...   # server only\nNEXT_PUBLIC_API=https://...   # client + server\n// Usage\nprocess.env.DATABASE_URL       // server only\nprocess.env.NEXT_PUBLIC_API    // anywhere",
    interviewQuestion: "Why does NEXT_PUBLIC_ prefix matter?",
  },
  {
    id: "nextjs-generatestaticparams",
    category: "nextjs",
    topic: "Tricky",
    title: "generateStaticParams",
    difficulty: "Intermediate",
    summary: "Pre-build dynamic route pages at build time",
    explanation:
      "dynamicParams=true (default): generate on demand. dynamicParams=false: 404 for unknown slugs.",
    code: "export async function generateStaticParams() {\n  const posts = await getPosts();\n  return posts.map(p => ({ slug: p.slug }));\n}\nexport const dynamicParams = false; // 404 unknown\nexport const revalidate = 3600;     // regenerate hourly",
    interviewQuestion: "What happens to paths not in generateStaticParams?",
  },
  {
    id: "nextjs-next-config-js",
    category: "nextjs",
    topic: "Config",
    title: "next.config.js",
    difficulty: "Intermediate",
    summary: "Configure Next.js build and runtime",
    explanation:
      "rewrites: proxy a URL to another path (URL stays same). redirects: send browser to new URL (URL changes, 301/302). Rewrites good for API proxying.",
    code: "// next.config.ts\nimport type { NextConfig } from 'next';\nconst config: NextConfig = {\n  images: { remotePatterns: [{ hostname: 'cdn.devquiz.app' }] },\n  async rewrites() {\n    return [{ source: '/api/:path*', destination: 'https://api.devquiz.app/:path*' }];\n  },\n  async redirects() {\n    return [{ source: '/old', destination: '/new', permanent: true }];\n  },\n};\nexport default config;",
    interviewQuestion: "What are rewrites vs redirects?",
  },
  {
    id: "nextjs-nextauth-auth-js",
    category: "nextjs",
    topic: "Auth",
    title: "NextAuth / Auth.js",
    difficulty: "Intermediate",
    summary: "Authentication framework for Next.js",
    explanation:
      "By default: JWTs (stateless — no DB needed). Can switch to database sessions (Prisma/Drizzle adapter) for revoking sessions server-side. JWT session stored in HTTP-only cookie.",
    code: "// app/api/auth/[...nextauth]/route.ts\nimport NextAuth from 'next-auth';\nimport GitHub from 'next-auth/providers/github';\nconst { handlers, auth } = NextAuth({\n  providers: [GitHub],\n  callbacks: {\n    session: ({ session, token }) => ({ ...session, userId: token.sub }),\n  },\n});\nexport const { GET, POST } = handlers;\n// In Server Component:\nconst session = await auth();",
    interviewQuestion: "How does Auth.js handle session storage?",
  },
  {
    id: "nextjs-protecting-routes",
    category: "nextjs",
    topic: "Auth",
    title: "Protecting routes",
    difficulty: "Intermediate",
    summary: "Middleware-based auth guards",
    explanation:
      "Use middleware (edge runtime) to check token and redirect. For server components, call auth() at the top and redirect(). For client components, useSession() from next-auth/react.",
    code: "// middleware.ts\nexport { auth as middleware } from '@/auth';\nexport const config = { matcher: ['/dashboard/:path*', '/api/user/:path*'] };\n// Server Component auth check\nimport { auth } from '@/auth';\nimport { redirect } from 'next/navigation';\nasync function DashboardPage() {\n  const session = await auth();\n  if (!session) redirect('/login');\n  return <Dashboard user={session.user} />;\n}",
    interviewQuestion: "How do you protect pages in App Router without a HOC?",
  },
  {
    id: "nextjs-next-js-testing",
    category: "nextjs",
    topic: "Testing",
    title: "Next.js Testing",
    difficulty: "Intermediate",
    summary: "Jest + React Testing Library for App Router",
    explanation:
      "Server Components are async functions — render them and await. For components with fetch, mock global.fetch. Use next/jest config for transforms.",
    code: "// jest.config.ts\nconst config = require('next/jest');\nmodule.exports = config({ dir: './' })({\n  testEnvironment: 'jsdom',\n});\n// Test Server Component\nit('renders posts', async () => {\n  global.fetch = jest.fn().mockResolvedValue({\n    ok: true, json: async () => [{ id: 1, title: 'Post' }]\n  });\n  const jsx = await PostsList();\n  const { getByText } = render(jsx);\n  expect(getByText('Post')).toBeTruthy();\n});",
    interviewQuestion: "How do you test Server Components?",
  },
  {
    id: "nextjs-vercel-deployment",
    category: "nextjs",
    topic: "Deployment",
    title: "Vercel deployment",
    difficulty: "Basic",
    summary: "Deploying Next.js to Vercel",
    explanation:
      "Serverless: full Node.js runtime, runs per-region, cold starts. Edge: V8 isolates, runs globally close to user, instant cold start, no Node.js APIs. Edge is faster for auth middleware and A/B testing; Serverless for DB queries.",
    code: "// Use Edge runtime for fast middleware\nexport const runtime = 'edge'; // in route.ts or page.tsx\n// Vercel-specific features\n// ISR: fetch with revalidate\n// Edge Config: ultra-low-latency key-value\nimport { get } from '@vercel/edge-config';\nconst featureFlag = await get('enableNewUI');",
    interviewQuestion:
      "What is the difference between Vercel Edge and Serverless functions?",
  },
  {
    id: "nextjs-internationalisation",
    category: "nextjs",
    topic: "i18n",
    title: "Internationalisation",
    difficulty: "Intermediate",
    summary: "Multiple language support in Next.js",
    explanation:
      "Use locale-based routing: app/[locale]/layout.tsx. Detect preferred locale in middleware. next-intl or next-i18next libraries handle message loading and formatting.",
    code: "// middleware.ts -- detect and redirect to locale\nimport { match } from '@formatjs/intl-localematcher';\nexport function middleware(req) {\n  const locale = match(acceptedLanguages, ['en','hi','es'], 'en');\n  req.nextUrl.pathname = `/${locale}${req.nextUrl.pathname}`;\n  return NextResponse.redirect(req.nextUrl);\n}\n// app/[locale]/layout.tsx\nexport default async function Layout({ children, params }) {\n  const { locale } = await params;\n  const messages = await import(`../../messages/${locale}.json`);\n  return <NextIntlClientProvider locale={locale} messages={messages.default}>{children}</NextIntlClientProvider>;\n}",
    interviewQuestion: "How do you implement i18n in App Router?",
  },
  {
    id: "nextjs-error-tsx-global-error-tsx",
    category: "nextjs",
    topic: "Error Handling",
    title: "error.tsx & global-error.tsx",
    difficulty: "Intermediate",
    summary: "Error boundaries in App Router",
    explanation:
      "error.tsx: handles errors in the segment — layout still renders. global-error.tsx: handles errors in root layout — must include <html>/<body>, replaces entire page.",
    code: "// app/dashboard/error.tsx\n'use client';\nexport default function Error({ error, reset }: { error: Error; reset: () => void }) {\n  return (\n    <div>\n      <h2>Dashboard error: {error.message}</h2>\n      <button onClick={reset}>Try again</button>\n    </div>\n  );\n}\n// app/global-error.tsx\n'use client';\nexport default function GlobalError({ error, reset }) {\n  return <html><body><h1>Fatal error</h1><button onClick={reset}>Reload</button></body></html>;\n}",
    interviewQuestion:
      "What is the difference between error.tsx and global-error.tsx?",
  },
  {
    id: "nextjs-next-js-security-headers",
    category: "nextjs",
    topic: "Security",
    title: "Next.js Security headers",
    difficulty: "Advanced",
    summary: "Set security headers via next.config",
    explanation:
      "CSP tells browser which sources are allowed for scripts, styles, images, etc. Prevents XSS — even if attacker injects a <script>, CSP blocks execution if src not whitelisted.",
    code: "// next.config.ts\nconst securityHeaders = [\n  { key: 'X-Frame-Options', value: 'DENY' },\n  { key: 'X-Content-Type-Options', value: 'nosniff' },\n  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },\n  { key: 'Content-Security-Policy',\n    value: \"default-src 'self'; script-src 'self' 'nonce-{nonce}'\" },\n];\nasync headers() { return [{ source: '/(.*)', headers: securityHeaders }]; }",
    interviewQuestion:
      "What is Content-Security-Policy and why is it important?",
  },
  {
    id: "nextjs-bundle-analysis",
    category: "nextjs",
    topic: "Performance",
    title: "Bundle analysis",
    difficulty: "Intermediate",
    summary: "Analyse and reduce Next.js bundle size",
    explanation:
      "Install, wrap next.config with withBundleAnalyzer, set ANALYZE=true at build time. Opens a treemap of your client + server bundles — identify large dependencies.",
    code: "npm i @next/bundle-analyzer\n// next.config.ts\nconst withAnalyzer = require('@next/bundle-analyzer')({\n  enabled: process.env.ANALYZE === 'true',\n});\nmodule.exports = withAnalyzer(nextConfig);\n// Run\nANALYZE=true npm run build",
    interviewQuestion: "How do you use @next/bundle-analyzer?",
  },
  {
    id: "nextjs-pages-vs-app-router-migration",
    category: "nextjs",
    difficulty: "Intermediate",
    topic: "Migration",
    title: "How do you migrate an app from the Pages Router to the App Router?",
    summary:
      "Next.js supports incremental migration, letting the pages/ and app/ directories coexist while routes are moved over one at a time.",
    explanation:
      "Because the App Router and Pages Router can run side by side, teams typically migrate route by route, starting with leaf routes that have few dependencies. Shared layout logic in _app.tsx and _document.tsx gets reimplemented as root layout.tsx, data fetching functions like getServerSideProps are replaced with async Server Components, and client-only libraries need 'use client' boundaries. API routes can stay in pages/api or move to app/api route handlers gradually. Common pitfalls include duplicate routing (a page existing in both directories throws a conflict error) and CSS/global style imports that must move to the new root layout.",
    code: "// Before: pages/blog/[slug].tsx\nexport async function getStaticProps({ params }) {\n  const post = await getPost(params.slug);\n  return { props: { post } };\n}\nexport default function Blog({ post }) {\n  return <article>{post.title}</article>;\n}\n\n// After: app/blog/[slug]/page.tsx\nexport default async function Blog({\n  params,\n}: {\n  params: Promise<{ slug: string }>;\n}) {\n  const { slug } = await params;\n  const post = await getPost(slug);\n  return <article>{post.title}</article>;\n}",
    interviewQuestion:
      "What strategy would you use to migrate a large production Next.js app from the Pages Router to the App Router without downtime?",
  },
  {
    id: "nextjs-legacy-data-fetching-methods",
    category: "nextjs",
    difficulty: "Basic",
    topic: "Data Fetching",
    title: "What are getServerSideProps and getStaticProps used for?",
    summary:
      "These are Pages Router functions for fetching data at request time (SSR) or build time (SSG) before rendering a page.",
    explanation:
      "getServerSideProps runs on every request on the server and is used when data must be fresh per-request, such as user-specific dashboards. getStaticProps runs at build time to pre-render static HTML, and can be paired with revalidate for ISR or getStaticPaths for dynamic static routes. Both only exist in the Pages Router; the App Router replaces them with async Server Components and fetch() caching options. Interviewers often ask this to confirm candidates understand legacy codebases they may inherit, even though new projects should use the App Router equivalents.",
    code: "// pages/products/[id].tsx\nexport async function getStaticPaths() {\n  const products = await getAllProductIds();\n  return { paths: products.map((id) => ({ params: { id } })), fallback: 'blocking' };\n}\n\nexport async function getStaticProps({ params }) {\n  const product = await getProduct(params.id);\n  return { props: { product }, revalidate: 60 };\n}\n\nexport default function ProductPage({ product }) {\n  return <h1>{product.name}</h1>;\n}",
    interviewQuestion:
      "In the Pages Router, when would you choose getServerSideProps over getStaticProps with revalidate?",
  },
  {
    id: "nextjs-revalidatepath-revalidatetag",
    category: "nextjs",
    difficulty: "Advanced",
    topic: "Caching",
    title: "What is the difference between revalidatePath and revalidateTag?",
    summary:
      "Both purge cached data on-demand in the App Router, but revalidatePath targets a specific route while revalidateTag invalidates all fetches sharing a cache tag.",
    explanation:
      "revalidatePath(path) clears the Next.js cache for a given route segment (and optionally its layout) so the next visit regenerates fresh HTML and data. revalidateTag(tag) is more granular and cross-cutting: any fetch() call anywhere in the app tagged with next: { tags: ['products'] } gets invalidated together, even if those fetches happen on completely different routes. This makes revalidateTag ideal for shared data like a product used on both a listing page and a detail page. Both functions must be called from a Server Action or Route Handler, not from client components or during rendering.",
    code: "// app/actions.ts\n'use server';\nimport { revalidateTag, revalidatePath } from 'next/cache';\n\nexport async function updateProduct(id: string, data: FormData) {\n  await db.product.update(id, data);\n  revalidateTag('products'); // invalidates every fetch tagged 'products'\n  revalidatePath(`/products/${id}`); // also refresh this specific page\n}\n\n// app/products/[id]/page.tsx\nasync function getProduct(id: string) {\n  const res = await fetch(`https://api.example.com/products/${id}`, {\n    next: { tags: ['products'] },\n  });\n  return res.json();\n}",
    interviewQuestion:
      "Your product catalog is fetched on both a homepage carousel and a category page. How would you invalidate the cache for that data everywhere at once after an admin edits a product?",
  },
  {
    id: "nextjs-edge-vs-node-runtime",
    category: "nextjs",
    difficulty: "Advanced",
    topic: "Runtime",
    title:
      "What is the difference between the Edge runtime and the Node.js runtime?",
    summary:
      "The Edge runtime is a lightweight V8-based environment that runs close to users with fast cold starts but limited APIs, while the Node.js runtime offers full Node compatibility.",
    explanation:
      "The Edge runtime, used by middleware by default and optionally by route handlers or pages, executes on infrastructure like Vercel's Edge Network, has near-instant cold starts, and supports Web APIs (fetch, Request, Response) but not Node-specific APIs like fs, native modules, or many npm packages that rely on Node internals. The Node.js runtime supports the full Node API surface, longer execution times, and larger memory limits, making it necessary for things like database drivers with native bindings or heavy image processing. You opt into a runtime per route segment with `export const runtime = 'edge' | 'nodejs'`. Choosing wrong causes either build errors (unsupported API on Edge) or unnecessarily slow cold starts (Node when Edge would suffice).",
    code: "// app/api/geo/route.ts\nexport const runtime = 'edge'; // fast, runs near the user\n\nexport async function GET(request: Request) {\n  const country = request.headers.get('x-vercel-ip-country') ?? 'unknown';\n  return Response.json({ country });\n}\n\n// app/api/report/route.ts\nexport const runtime = 'nodejs'; // needs fs / heavy libs\nimport { generatePdfReport } from '@/lib/pdf';\n\nexport async function POST(request: Request) {\n  const buffer = await generatePdfReport(await request.json());\n  return new Response(buffer, { headers: { 'Content-Type': 'application/pdf' } });\n}",
    interviewQuestion:
      "You have a route handler that uses a native Node PDF-generation library. Why would setting runtime = 'edge' break it, and how would you fix it?",
  },
  {
    id: "nextjs-loading-instant-states",
    category: "nextjs",
    difficulty: "Basic",
    topic: "Routing",
    title: "What does loading.tsx do in the App Router?",
    summary:
      "loading.tsx defines an instant loading UI that Next.js automatically wraps around a route segment in a React Suspense boundary while its data loads.",
    explanation:
      "When a loading.tsx file exists in a route segment, Next.js automatically shows it while the corresponding page.tsx (and any async Server Components it renders) are fetching data, without you manually adding a Suspense boundary. It enables instant navigation feedback since the previous page's layout stays interactive while the new segment streams in. This is built on React Suspense, so nested loading.tsx files create nested loading boundaries that only affect their own segment, not parent layouts. It's especially useful for perceived performance on slow data fetches like database queries or third-party API calls.",
    code: '// app/dashboard/loading.tsx\nexport default function Loading() {\n  return (\n    <div className="animate-pulse p-4">\n      <div className="h-6 w-1/3 bg-gray-200 rounded mb-2" />\n      <div className="h-4 w-full bg-gray-200 rounded" />\n    </div>\n  );\n}\n\n// app/dashboard/page.tsx\nexport default async function Dashboard() {\n  const stats = await fetchDashboardStats(); // slow fetch\n  return <StatsPanel stats={stats} />;\n}',
    interviewQuestion:
      "How does loading.tsx achieve instant loading states without you writing any Suspense boundary code yourself?",
  },
  {
    id: "nextjs-not-found-notfound-fn",
    category: "nextjs",
    difficulty: "Intermediate",
    topic: "Routing",
    title: "How do not-found.tsx and the notFound() function work together?",
    summary:
      "Calling notFound() inside a Server Component throws a special error that Next.js catches to render the nearest not-found.tsx boundary with a 404 status.",
    explanation:
      "not-found.tsx is a convention file rendered whenever a route segment is unreachable or when code explicitly calls the notFound() function from next/navigation. Unlike returning null or custom JSX, notFound() correctly sets an HTTP 404 status code, which matters for SEO and correctness. You can nest not-found.tsx files per segment so a missing blog post shows a blog-specific 404 while a missing user profile shows a different one. It differs from the root not-found.tsx, which acts as the catch-all for any unmatched route in the whole app.",
    code: "// app/posts/[slug]/page.tsx\nimport { notFound } from 'next/navigation';\n\nexport default async function PostPage({\n  params,\n}: {\n  params: Promise<{ slug: string }>;\n}) {\n  const { slug } = await params;\n  const post = await getPost(slug);\n  if (!post) notFound();\n  return <article>{post.title}</article>;\n}\n\n// app/posts/[slug]/not-found.tsx\nexport default function PostNotFound() {\n  return <p>Sorry, this post doesn't exist.</p>;\n}",
    interviewQuestion:
      "Why should you call notFound() instead of just returning a 'Not found' JSX message directly from a page component?",
  },
  {
    id: "nextjs-nested-layouts",
    category: "nextjs",
    difficulty: "Basic",
    topic: "Routing",
    title: "How do nested layouts work in the App Router?",
    summary:
      "Every folder in app/ can have a layout.tsx that wraps its own page and all nested child segments, composing into a layout hierarchy without re-rendering on navigation.",
    explanation:
      "Layouts wrap the page content passed as the `children` prop and persist across navigations within the same segment, preserving component state like scroll position or open modals. Nested layouts compose: the root layout.tsx wraps everything, and a layout inside app/dashboard/layout.tsx wraps only dashboard routes, nesting inside the root layout. Because layouts don't re-render when navigating between sibling pages, they're ideal for persistent UI like sidebars or tab bars. Layouts cannot access route params of the page unless declared as dynamic segments themselves, and they cannot use hooks like usePathname without being a Client Component.",
    code: '// app/dashboard/layout.tsx\nexport default function DashboardLayout({\n  children,\n}: {\n  children: React.ReactNode;\n}) {\n  return (\n    <div className="flex">\n      <aside className="w-64">Sidebar</aside>\n      <main className="flex-1">{children}</main>\n    </div>\n  );\n}\n\n// app/dashboard/settings/page.tsx renders inside DashboardLayout\'s <main>\nexport default function Settings() {\n  return <h1>Settings</h1>;\n}',
    interviewQuestion:
      "Why do sidebar and navigation components stay mounted (preserving their state) when a user navigates between pages that share a layout?",
  },
  {
    id: "nextjs-template-vs-layout",
    category: "nextjs",
    difficulty: "Tricky",
    topic: "Routing",
    title: "What is the difference between template.tsx and layout.tsx?",
    summary:
      "layout.tsx persists and preserves state across navigations, while template.tsx re-mounts fresh on every navigation, resetting state and re-running effects.",
    explanation:
      "Both wrap child segments identically in terms of JSX structure, but React treats them differently: layout.tsx keeps the same component instance across route changes within it, so useState and useEffect don't reset. template.tsx creates a brand-new component instance on every navigation, meaning state resets and effects re-fire, which is useful for enter/exit animations, per-navigation analytics events, or resetting a form when moving between sibling routes. A common tricky interview point is that you can have both a layout.tsx and a template.tsx in the same segment, and the template renders inside the layout as part of its children.",
    code: "// app/onboarding/template.tsx\n'use client';\nimport { useEffect } from 'react';\n\nexport default function OnboardingTemplate({\n  children,\n}: {\n  children: React.ReactNode;\n}) {\n  useEffect(() => {\n    console.log('step mounted'); // fires on every step navigation\n  }, []);\n  return <div className=\"transition-opacity animate-in\">{children}</div>;\n}",
    interviewQuestion:
      "You want a fade-in animation to replay every time a user moves between wizard steps, but a layout.tsx isn't re-running your useEffect. What convention file solves this, and why?",
  },
  {
    id: "nextjs-cookies-headers-apis",
    category: "nextjs",
    difficulty: "Intermediate",
    topic: "Server APIs",
    title: "How do you read and write cookies with the cookies() function?",
    summary:
      "cookies() and headers() are async Next.js server-only functions that give Server Components, Server Actions, and Route Handlers access to incoming request cookies and headers.",
    explanation:
      "cookies() returns a cookie store you can read from anywhere on the server, but you can only call .set() or .delete() from a Server Action or Route Handler, not from a plain Server Component render, because mutating cookies requires being inside a response-producing context. headers() is read-only and gives access to the incoming request's headers, useful for reading things like authorization tokens or user-agent for server-side logic. Both are async functions as of Next.js 15 and must be awaited. Reading cookies() or headers() inside a Server Component also opts that segment out of static rendering, since the response now depends on request-specific data.",
    code: "// app/actions.ts\n'use server';\nimport { cookies } from 'next/headers';\n\nexport async function setTheme(theme: string) {\n  const cookieStore = await cookies();\n  cookieStore.set('theme', theme, { httpOnly: true, path: '/' });\n}\n\n// app/page.tsx\nimport { cookies, headers } from 'next/headers';\n\nexport default async function Page() {\n  const cookieStore = await cookies();\n  const theme = cookieStore.get('theme')?.value ?? 'light';\n  const headerList = await headers();\n  const ua = headerList.get('user-agent');\n  return <div data-theme={theme}>Visiting from: {ua}</div>;\n}",
    interviewQuestion:
      "Why does calling cookies().set() inside a plain Server Component page render throw an error, while calling it inside a Server Action does not?",
  },
  {
    id: "nextjs-redirect-permanentredirect",
    category: "nextjs",
    difficulty: "Intermediate",
    topic: "Server APIs",
    title: "What is the difference between redirect() and permanentRedirect()?",
    summary:
      "redirect() issues a temporary (307/303) redirect while permanentRedirect() issues a permanent (308) redirect, and both work by throwing a special Next.js error caught internally.",
    explanation:
      "redirect() from next/navigation throws an internal NEXT_REDIRECT signal that Next.js intercepts to send a temporary redirect response, appropriate for things like redirecting after form validation or gating unauthenticated users. permanentRedirect() sends a 308 status, telling browsers and search engines to permanently update bookmarks and search index entries, appropriate for canonical URL changes like slug renames. Because both throw internally, calling them inside a try/catch block will incorrectly swallow the redirect unless you re-throw or avoid wrapping them. They can be called in Server Components, Server Actions, and Route Handlers, but not in Client Components (use the useRouter hook there instead).",
    code: "// app/actions.ts\n'use server';\nimport { redirect } from 'next/navigation';\n\nexport async function createPost(formData: FormData) {\n  const post = await db.post.create({ title: formData.get('title') });\n  redirect(`/posts/${post.id}`); // 307, throws internally\n}\n\n// app/old-slug/page.tsx\nimport { permanentRedirect } from 'next/navigation';\n\nexport default async function OldSlugPage() {\n  permanentRedirect('/new-slug'); // 308, SEO-safe permanent move\n}",
    interviewQuestion:
      "You wrap a call to redirect() inside a try/catch to handle database errors during a Server Action. What bug does this introduce, and why?",
  },
  {
    id: "nextjs-fetch-caching-semantics",
    category: "nextjs",
    difficulty: "Advanced",
    topic: "Data Fetching",
    title: "How does fetch() caching work by default in the App Router?",
    summary:
      "Next.js extends the native fetch API with caching options, letting you control whether a request is cached indefinitely, revalidated on an interval, or never cached at all.",
    explanation:
      "By default in recent Next.js versions, fetch requests are not cached (cache: 'no-store' behavior) unless explicitly opted in, though this has changed across versions so it's important to check the version's default. You control caching per-request with `{ cache: 'force-cache' }` for indefinite caching, `{ cache: 'no-store' }` for always-fresh dynamic data, or `{ next: { revalidate: N } }` for time-based ISR-style revalidation on that specific fetch. Tags via `{ next: { tags: [...] } }` let you group fetches for on-demand invalidation with revalidateTag. Using dynamic functions like cookies() or a no-store fetch anywhere in a route forces the whole route to render dynamically at request time instead of being statically generated.",
    code: "// Cached indefinitely until manually revalidated\nconst staticData = await fetch('https://api.example.com/config', {\n  cache: 'force-cache',\n});\n\n// Revalidated at most every 60 seconds (ISR-like)\nconst posts = await fetch('https://api.example.com/posts', {\n  next: { revalidate: 60 },\n});\n\n// Always fresh, fetched on every request\nconst liveStock = await fetch('https://api.example.com/stock', {\n  cache: 'no-store',\n});",
    interviewQuestion:
      "You have three fetch calls in the same page: one with cache: 'force-cache', one with revalidate: 60, and one with cache: 'no-store'. What rendering strategy does the overall page end up using, and why?",
  },
  {
    id: "nextjs-isr-deep-dive",
    category: "nextjs",
    difficulty: "Advanced",
    topic: "Rendering",
    title:
      "How does Incremental Static Regeneration actually work under the hood?",
    summary:
      "ISR serves a cached static page instantly while regenerating a fresh version in the background after the revalidate window expires, so no single user ever waits for a rebuild.",
    explanation:
      "When a request comes in after the revalidate period has elapsed, Next.js still serves the stale cached HTML immediately (stale-while-revalidate pattern) and kicks off regeneration in the background; only the next request after regeneration completes sees the fresh content. This means ISR pages can briefly serve outdated data but never block on rebuild latency, unlike SSR. For paths not generated at build time, `fallback: 'blocking'` (Pages Router) or dynamicParams behavior (App Router) determines whether an on-demand first request waits for generation or shows a fallback UI. On serverless platforms like Vercel, the regenerated page is persisted to the CDN edge so subsequent requests are served from cache without hitting the origin function again.",
    code: "// app/products/[id]/page.tsx\nexport const revalidate = 3600; // regenerate at most once per hour\n\nexport async function generateStaticParams() {\n  const products = await getTopProductIds();\n  return products.map((id) => ({ id }));\n}\n\nexport default async function ProductPage({\n  params,\n}: {\n  params: Promise<{ id: string }>;\n}) {\n  const { id } = await params;\n  const product = await getProduct(id); // uses the route's revalidate window\n  return <h1>{product.name}</h1>;\n}",
    interviewQuestion:
      "A user visits an ISR page 90 minutes after its last build with revalidate = 3600. What exact content do they see, and what happens behind the scenes for the next visitor?",
  },
  {
    id: "nextjs-static-vs-dynamic-rendering-decision",
    category: "nextjs",
    difficulty: "Intermediate",
    topic: "Rendering",
    title:
      "How does Next.js decide whether a route is statically or dynamically rendered?",
    summary:
      "Next.js statically renders a route at build time by default unless it detects usage of request-specific APIs or uncached data, in which case it switches to dynamic rendering at request time.",
    explanation:
      "During the build, Next.js analyzes each route segment: if it only uses cacheable fetches and no request-time APIs, it's prerendered as static HTML. Using dynamic functions like cookies(), headers(), or searchParams in a Server Component, or a fetch call marked cache: 'no-store', forces that entire route to opt into dynamic (server-rendered per-request) behavior. You can also force behavior explicitly with `export const dynamic = 'force-static' | 'force-dynamic' | 'auto'` at the segment level. This decision matters for performance and cost since static routes are served from CDN cache while dynamic routes invoke server compute on every request.",
    code: "// app/search/page.tsx\n// Reading searchParams makes this route dynamic automatically\nexport default async function SearchPage({\n  searchParams,\n}: {\n  searchParams: Promise<{ q?: string }>;\n}) {\n  const { q } = await searchParams;\n  const results = await search(q ?? '');\n  return <ResultsList results={results} />;\n}\n\n// Force a route to always be dynamic even without request APIs\nexport const dynamic = 'force-dynamic';",
    interviewQuestion:
      "You have a marketing page with zero dynamic data usage, but it's still rendering dynamically in production. What Next.js API usage would explain this, and how would you debug it?",
  },
  {
    id: "nextjs-draft-mode-preview",
    category: "nextjs",
    difficulty: "Advanced",
    topic: "Content",
    title: "What is Draft Mode used for in headless CMS setups?",
    summary:
      "Draft Mode lets editors preview unpublished CMS content on production statically-generated pages by temporarily switching that route to dynamic, uncached rendering.",
    explanation:
      "Draft Mode is enabled via a Route Handler that calls draftMode().enable(), typically triggered by a secret-protected preview URL from your CMS, and sets a cookie that persists for the browser session. While enabled, pages check draftMode().isEnabled to decide whether to fetch draft/unpublished content from the CMS instead of published content, and Next.js bypasses static caching for that request so changes appear immediately. This is the App Router evolution of the Pages Router's Preview Mode. It's important to validate the secret token in the enable route to prevent unauthorized users from viewing unpublished content.",
    code: "// app/api/draft/route.ts\nimport { draftMode } from 'next/headers';\nimport { redirect } from 'next/navigation';\n\nexport async function GET(request: Request) {\n  const { searchParams } = new URL(request.url);\n  if (searchParams.get('secret') !== process.env.DRAFT_SECRET) {\n    return new Response('Invalid token', { status: 401 });\n  }\n  const draft = await draftMode();\n  draft.enable();\n  redirect(searchParams.get('slug') ?? '/');\n}\n\n// app/posts/[slug]/page.tsx\nimport { draftMode } from 'next/headers';\n\nexport default async function Post({ params }: { params: Promise<{ slug: string }> }) {\n  const { isEnabled } = await draftMode();\n  const post = await getPost((await params).slug, { preview: isEnabled });\n  return <article>{post.title}</article>;\n}",
    interviewQuestion:
      "How would you let a content editor preview an unpublished CMS article on your statically generated blog without exposing it to the public?",
  },
  {
    id: "nextjs-opengraph-image-generation",
    category: "nextjs",
    difficulty: "Intermediate",
    topic: "Metadata",
    title:
      "How do you dynamically generate Open Graph images with opengraph-image.tsx?",
    summary:
      "Next.js can generate per-route OG images at runtime or build time using JSX and the ImageResponse API, avoiding the need to manually design static share images.",
    explanation:
      "Placing an opengraph-image.tsx (or .jpg/.png) file in a route segment auto-generates the appropriate meta tags and image for social sharing previews. The dynamic version exports a default function that returns an ImageResponse built from JSX and inline styles, similar to writing a tiny React component, which Next.js rasterizes to a PNG using Satori. You can access route params to personalize images, such as rendering a user's name or a blog post's title onto the generated image. The file also supports exporting `size` and `contentType` to control output dimensions, and a twitter-image.tsx sibling file works identically for Twitter card previews.",
    code: "// app/blog/[slug]/opengraph-image.tsx\nimport { ImageResponse } from 'next/og';\n\nexport const size = { width: 1200, height: 630 };\nexport const contentType = 'image/png';\n\nexport default async function Image({ params }: { params: Promise<{ slug: string }> }) {\n  const { slug } = await params;\n  const post = await getPost(slug);\n  return new ImageResponse(\n    (\n      <div style={{ fontSize: 64, background: '#000', color: '#fff', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>\n        {post.title}\n      </div>\n    ),\n    { ...size }\n  );\n}",
    interviewQuestion:
      "How would you generate a unique social sharing image per blog post that includes the post's title, without maintaining hundreds of static image files?",
  },
  {
    id: "nextjs-sitemap-robots-generation",
    category: "nextjs",
    difficulty: "Basic",
    topic: "Metadata",
    title: "How do you generate sitemap.xml and robots.txt in the App Router?",
    summary:
      "Next.js supports sitemap.ts and robots.ts convention files that programmatically generate SEO metadata files instead of hand-writing static XML/text files.",
    explanation:
      "A sitemap.ts file exports a default function returning an array of URL entries with optional lastModified, changeFrequency, and priority fields, and Next.js serves it at /sitemap.xml with the correct content type automatically. This is especially useful for dynamic sites where the sitemap needs to include every blog post or product fetched from a database at build or request time. robots.ts similarly exports rules for crawler access and can reference the generated sitemap URL. Both files can also be static (sitemap.xml, robots.txt placed directly in app/) for simple cases, but the .ts variants are preferred when content is dynamic.",
    code: "// app/sitemap.ts\nimport type { MetadataRoute } from 'next';\n\nexport default async function sitemap(): Promise<MetadataRoute.Sitemap> {\n  const posts = await getAllPosts();\n  const postEntries = posts.map((post) => ({\n    url: `https://example.com/blog/${post.slug}`,\n    lastModified: post.updatedAt,\n    changeFrequency: 'weekly' as const,\n    priority: 0.7,\n  }));\n  return [\n    { url: 'https://example.com', lastModified: new Date(), priority: 1 },\n    ...postEntries,\n  ];\n}\n\n// app/robots.ts\nexport default function robots() {\n  return {\n    rules: { userAgent: '*', allow: '/', disallow: '/admin' },\n    sitemap: 'https://example.com/sitemap.xml',\n  };\n}",
    interviewQuestion:
      "Your site has thousands of dynamically created product pages. How would you make sure they're all included in your sitemap without manually maintaining an XML file?",
  },
  {
    id: "nextjs-monorepo-turborepo-setup",
    category: "nextjs",
    difficulty: "Advanced",
    topic: "Tooling",
    title: "How do you structure a Next.js app inside a Turborepo monorepo?",
    summary:
      "Turborepo organizes multiple Next.js apps and shared packages (UI, config, types) in one repository with a task pipeline that caches builds and runs tasks in dependency order.",
    explanation:
      'A typical layout has an apps/ directory containing one or more Next.js apps and a packages/ directory containing shared code like a UI component library, ESLint config, or TypeScript config, each consumed via workspace references (e.g. "@repo/ui": "workspace:*") using pnpm or npm workspaces. turbo.json defines a pipeline describing task dependencies, such as build depending on ^build (build all dependencies first), enabling Turborepo to parallelize and cache tasks across the graph, only rebuilding what actually changed. Next.js apps in a monorepo need transpilePackages in next.config.js to compile TypeScript from internal workspace packages that aren\'t pre-built. This setup is common at companies running multiple Next.js apps (marketing site, dashboard, docs) that share design system code.',
    code: '// turbo.json\n{\n  "$schema": "https://turbo.build/schema.json",\n  "pipeline": {\n    "build": { "dependsOn": ["^build"], "outputs": [".next/**"] },\n    "dev": { "cache": false, "persistent": true }\n  }\n}\n\n// apps/web/next.config.js\n/** @type {import(\'next\').NextConfig} */\nconst nextConfig = {\n  transpilePackages: [\'@repo/ui\'],\n};\nmodule.exports = nextConfig;',
    interviewQuestion:
      "You have three Next.js apps sharing a common design system package in a monorepo. How does Turborepo avoid rebuilding all three every time one line of shared UI code changes?",
  },
  {
    id: "nextjs-api-route-rate-limiting",
    category: "nextjs",
    difficulty: "Advanced",
    topic: "API",
    title: "How do you implement rate limiting on a Next.js Route Handler?",
    summary:
      "Rate limiting protects API routes from abuse by tracking request counts per identifier (IP, user, or API key) and rejecting requests that exceed a threshold within a time window.",
    explanation:
      "Since serverless functions are stateless and ephemeral, in-memory counters don't reliably work across invocations or regions, so production rate limiting typically uses an external store like Upstash Redis with a sliding-window or token-bucket algorithm. Middleware is a common place to enforce rate limits globally before a request even reaches a route handler, since it runs on the Edge with low latency. Libraries like @upstash/ratelimit pair with @vercel/kv or Upstash Redis to implement this declaratively. Interviewers care about this because naive in-memory Map-based limiters silently fail to protect anything once an app scales beyond a single server instance.",
    code: "// middleware.ts\nimport { Ratelimit } from '@upstash/ratelimit';\nimport { Redis } from '@upstash/redis';\nimport { NextResponse, type NextRequest } from 'next/server';\n\nconst ratelimit = new Ratelimit({\n  redis: Redis.fromEnv(),\n  limiter: Ratelimit.slidingWindow(10, '10 s'),\n});\n\nexport async function middleware(request: NextRequest) {\n  const ip = request.headers.get('x-forwarded-for') ?? '127.0.0.1';\n  const { success } = await ratelimit.limit(ip);\n  if (!success) {\n    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });\n  }\n  return NextResponse.next();\n}\n\nexport const config = { matcher: '/api/:path*' };",
    interviewQuestion:
      "Why is a simple in-memory Map used to count requests per IP an unreliable rate limiter for a Next.js app deployed on serverless infrastructure?",
  },
  {
    id: "nextjs-serverless-db-connection-pooling",
    category: "nextjs",
    difficulty: "Tricky",
    topic: "Database",
    title:
      "Why does database connection pooling behave differently in serverless Next.js deployments?",
    summary:
      "Each serverless function invocation can spin up a new isolated instance, so naive per-request database connections quickly exhaust a database's max connection limit under load.",
    explanation:
      "In a traditional long-running Node server, you create one connection pool at startup and reuse it for the app's lifetime. In serverless environments like Vercel functions, each cold-started instance may create its own pool, and with many concurrent invocations you can end up with far more connections than your database allows, causing 'too many connections' errors. Common fixes include using an external connection pooler like PgBouncer or Prisma Accelerate/Data Proxy that sits between your functions and the database, caching the Prisma/DB client instance on the global object to reuse it across warm invocations, and preferring HTTP-based serverless-friendly database drivers (like Neon's or PlanetScale's) that don't hold persistent TCP connections at all. This is a favorite 'gotcha' interview topic because it only manifests under production load, not local dev.",
    code: "// lib/db.ts\nimport { PrismaClient } from '@prisma/client';\n\nconst globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };\n\n// Reuse the client across warm serverless invocations instead of\n// creating a brand-new connection pool on every request.\nexport const prisma =\n  globalForPrisma.prisma ??\n  new PrismaClient({ datasourceUrl: process.env.DATABASE_POOL_URL });\n\nif (process.env.NODE_ENV !== 'production') {\n  globalForPrisma.prisma = prisma;\n}",
    interviewQuestion:
      "Your Next.js API routes work fine locally but throw 'too many connections' errors in production under traffic spikes. What's the likely cause and how do you fix it?",
  },
  {
    id: "nextjs-web-vitals-monitoring",
    category: "nextjs",
    difficulty: "Intermediate",
    topic: "Performance",
    title: "How do you measure and report Core Web Vitals in a Next.js app?",
    summary:
      "Next.js exposes a useReportWebVitals hook and built-in analytics integration to capture real-user metrics like LCP, CLS, and INP and send them to a monitoring service.",
    explanation:
      "The useReportWebVitals hook (App Router) or the exported reportWebVitals function (Pages Router) fires a callback with each metric's name, value, and id as it's measured in the real user's browser, letting you forward that data to an analytics endpoint, Vercel Analytics, or a tool like Google Analytics. Core Web Vitals include LCP (Largest Contentful Paint, loading performance), CLS (Cumulative Layout Shift, visual stability), and INP (Interaction to Next Paint, responsiveness, which replaced FID). Measuring real-user metrics (RUM) matters more than lab data (like Lighthouse) because it reflects actual device and network conditions across your user base. This hook must be used inside a Client Component.",
    code: "// app/components/web-vitals.tsx\n'use client';\nimport { useReportWebVitals } from 'next/web-vitals';\n\nexport function WebVitals() {\n  useReportWebVitals((metric) => {\n    if (metric.name === 'LCP' || metric.name === 'CLS' || metric.name === 'INP') {\n      navigator.sendBeacon(\n        '/api/analytics',\n        JSON.stringify({ name: metric.name, value: metric.value, id: metric.id })\n      );\n    }\n  });\n  return null;\n}\n\n// app/layout.tsx\nimport { WebVitals } from './components/web-vitals';\n\nexport default function RootLayout({ children }: { children: React.ReactNode }) {\n  return (\n    <html lang=\"en\">\n      <body>\n        <WebVitals />\n        {children}\n      </body>\n    </html>\n  );\n}",
    interviewQuestion:
      "How would you collect real-user Core Web Vitals data from production traffic in a Next.js app rather than relying only on Lighthouse audits in CI?",
  },
  {
    id: "nextjs-on-demand-revalidation-webhook",
    category: "nextjs",
    difficulty: "Advanced",
    topic: "Caching",
    title:
      "How do you set up on-demand ISR revalidation triggered by a CMS webhook?",
    summary:
      "A Route Handler can accept a webhook call from a headless CMS on content publish and call revalidatePath or revalidateTag to instantly refresh the corresponding cached page.",
    explanation:
      "Instead of waiting for a time-based revalidate window to expire, on-demand revalidation lets content updates propagate immediately: the CMS (Contentful, Sanity, etc.) is configured to POST to a Next.js Route Handler whenever content is published, and that handler validates a shared secret before calling revalidatePath(path) or revalidateTag(tag) for the affected content. This pattern combines the performance of static generation with near-real-time freshness, avoiding the tradeoff of picking a short revalidate interval just to reduce staleness. Validating the webhook secret is essential since this endpoint can force expensive regeneration if left open to abuse. It's common to revalidate by tag so a single content change invalidates every page referencing that entry.",
    code: "// app/api/revalidate/route.ts\nimport { revalidateTag } from 'next/cache';\nimport { NextRequest, NextResponse } from 'next/server';\n\nexport async function POST(request: NextRequest) {\n  const secret = request.headers.get('x-webhook-secret');\n  if (secret !== process.env.CMS_WEBHOOK_SECRET) {\n    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 });\n  }\n\n  const body = await request.json();\n  revalidateTag(`post-${body.slug}`);\n\n  return NextResponse.json({ revalidated: true, now: Date.now() });\n}",
    interviewQuestion:
      "Marketing wants blog edits in the CMS to appear on the live site within seconds, not minutes, without sacrificing static generation. How would you design that with Next.js?",
  },
  {
    id: "nextjs-use-action-state-hook",
    category: "nextjs",
    difficulty: "Intermediate",
    topic: "Server Actions",
    title:
      "How does useActionState (formerly useFormState) work with Server Actions?",
    summary:
      "useActionState lets a client component track the pending state and last returned value of a Server Action across form submissions.",
    explanation:
      "useActionState is a React 19 hook (re-exported by Next.js) that wraps a Server Action and returns [state, formAction, isPending]. The action receives the previous state as its first argument, making it easy to return validation errors or success messages and re-render the form with that state. Because it integrates directly with the <form action={formAction}> attribute, it works even before JavaScript hydrates, since the underlying mechanism is still a real form submission. isPending replaces manual loading-state bookkeeping that used to require useState plus useTransition. This pattern is the recommended way to surface server-side validation errors next to form fields in the App Router.",
    code: "'use client';\nimport { useActionState } from 'react';\nimport { submitFeedback } from './actions';\n\nconst initialState = { message: '' };\n\nexport function FeedbackForm() {\n  const [state, formAction, isPending] = useActionState(submitFeedback, initialState);\n  return (\n    <form action={formAction}>\n      <textarea name=\"feedback\" required />\n      {state.message && <p aria-live=\"polite\">{state.message}</p>}\n      <button disabled={isPending}>{isPending ? 'Sending...' : 'Send'}</button>\n    </form>\n  );\n}",
    interviewQuestion:
      "How would you show a server-side validation error inline in a form after submitting a Server Action, and why is useActionState preferable to manual useState here?",
  },
  {
    id: "nextjs-use-form-status-hook",
    category: "nextjs",
    difficulty: "Intermediate",
    topic: "Server Actions",
    title: "What does useFormStatus provide and where can it be used?",
    summary:
      "useFormStatus reads the pending state of the nearest parent <form> submission without prop drilling, but only inside a component rendered as a descendant of that form.",
    explanation:
      "useFormStatus is a React DOM hook designed to let child components like a submit button know whether the enclosing form is currently submitting, without the parent needing to pass a loading prop down manually. It must be called from a component that is rendered inside the <form>, not the same component that renders the <form> itself, because it reads context provided by the form element. It returns pending, data, method, and action. This is commonly used to build a reusable <SubmitButton /> that disables itself and shows a spinner during any form it is placed in, keeping that logic decoupled from the specific action being called.",
    code: "'use client';\nimport { useFormStatus } from 'react-dom';\n\nexport function SubmitButton() {\n  const { pending } = useFormStatus();\n  return (\n    <button type=\"submit\" disabled={pending}>\n      {pending ? 'Saving...' : 'Save'}\n    </button>\n  );\n}\n\n// Usage: <form action={saveAction}><SubmitButton /></form>",
    interviewQuestion:
      "Why does useFormStatus return pending: false if called in the same component that renders the <form> tag?",
  },
  {
    id: "nextjs-use-optimistic-server-actions",
    category: "nextjs",
    difficulty: "Advanced",
    topic: "Server Actions",
    title:
      "How do you build optimistic UI updates with useOptimistic and Server Actions?",
    summary:
      "useOptimistic lets you render a predicted UI state immediately while a Server Action is still in flight, then reconciles with the real server response.",
    explanation:
      "useOptimistic takes the current state and an update function, returning an optimistic value that can be set synchronously inside a transition before the Server Action resolves. When the form is submitted, you call the optimistic setter with the predicted result (e.g., a new todo item), React renders it immediately, and once the Server Action completes and revalidation occurs, the real data from the server replaces the optimistic value. If the action throws, React automatically reverts to the previous confirmed state on the next render. This pattern is essential for snappy UX in list-based UIs like comments, likes, or todo apps where waiting for a round trip feels sluggish.",
    code: "'use client';\nimport { useOptimistic, useRef } from 'react';\nimport { addTodo } from './actions';\n\nexport function TodoList({ todos }: { todos: string[] }) {\n  const [optimisticTodos, addOptimisticTodo] = useOptimistic(\n    todos,\n    (state, newTodo: string) => [...state, newTodo]\n  );\n  const formRef = useRef<HTMLFormElement>(null);\n\n  return (\n    <form ref={formRef} action={async (formData) => {\n      const text = formData.get('todo') as string;\n      addOptimisticTodo(text);\n      formRef.current?.reset();\n      await addTodo(text);\n    }}>\n      <input name=\"todo\" />\n      <button type=\"submit\">Add</button>\n      <ul>{optimisticTodos.map((t, i) => <li key={i}>{t}</li>)}</ul>\n    </form>\n  );\n}",
    interviewQuestion:
      "What happens to the optimistic state rendered by useOptimistic if the underlying Server Action throws an error?",
  },
  {
    id: "nextjs-streaming-server-action-responses",
    category: "nextjs",
    difficulty: "Tricky",
    topic: "Server Actions",
    title: "Can Server Actions stream responses back to the client?",
    summary:
      "Server Actions can return async generators or use createStreamableValue-style patterns to progressively send data, though native streaming support is more limited than Route Handlers.",
    explanation:
      "A Server Action executes on the server and returns a serialized result over the RSC protocol, so unlike a Route Handler you cannot directly return a ReadableStream from it in the same way. Instead, streaming UX from a Server Action is typically achieved by having the action kick off work and returning quickly, then using Suspense boundaries with a promise passed to a client component, or by using libraries like Vercel AI SDK which wrap streaming primitives around Server Actions using RSC-compatible streamable values. A common gotcha is that Server Actions are not designed for long-lived streaming connections like SSE; for token-by-token LLM output, teams often reach for a Route Handler with a ReadableStream instead, or use the AI SDK abstractions that hide this complexity.",
    code: "// actions.ts\n'use server';\nimport { createStreamableValue } from 'ai/rsc';\n\nexport async function generateStream() {\n  const stream = createStreamableValue('');\n  (async () => {\n    for (const chunk of ['Hello', ' ', 'world']) {\n      stream.update(chunk);\n      await new Promise((r) => setTimeout(r, 200));\n    }\n    stream.done();\n  })();\n  return { output: stream.value };\n}",
    interviewQuestion:
      "Why can't a Server Action simply return a ReadableStream like a Route Handler can, and what pattern do libraries like the Vercel AI SDK use instead?",
  },
  {
    id: "nextjs-partial-prerendering-overview",
    category: "nextjs",
    difficulty: "Advanced",
    topic: "Rendering",
    title: "What is Partial Prerendering (PPR) in Next.js?",
    summary:
      "Partial Prerendering combines a static shell served instantly from the CDN with dynamic, per-request content streamed in via Suspense boundaries, all from a single route.",
    explanation:
      "PPR lets a single page have both static and dynamic parts without forcing the whole route into one rendering mode. At build time, Next.js prerenders everything outside Suspense boundaries into a static shell; anything wrapped in Suspense with dynamic data access (cookies, headers, uncached fetch) is left as a hole that gets rendered on the server per request and streamed in. The static shell is served immediately from the edge for a fast first paint, while dynamic content like a personalized cart or user greeting streams in shortly after. This is enabled per-route with the experimental_ppr route config export and requires the App Router with the canary or stable PPR flag depending on the Next.js version.",
    code: "// app/product/[id]/page.tsx\nexport const experimental_ppr = true;\n\nimport { Suspense } from 'react';\nimport { Reviews } from './reviews';\nimport { StaticProductInfo } from './static-info';\n\nexport default function ProductPage({ params }: { params: { id: string } }) {\n  return (\n    <div>\n      <StaticProductInfo id={params.id} />\n      <Suspense fallback={<p>Loading reviews...</p>}>\n        <Reviews id={params.id} />\n      </Suspense>\n    </div>\n  );\n}",
    interviewQuestion:
      "How does Partial Prerendering decide which parts of a page are included in the static shell versus rendered dynamically per request?",
  },
  {
    id: "nextjs-unstable-cache-api",
    category: "nextjs",
    difficulty: "Advanced",
    topic: "Caching",
    title: "What does the unstable_cache function do?",
    summary:
      "unstable_cache wraps an arbitrary async function, such as a database query, so its result is cached and revalidated using Next.js's Data Cache, similar to how fetch is cached automatically.",
    explanation:
      "Unlike fetch, which Next.js automatically caches and dedupes, calls to a database client or ORM are not cached by default. unstable_cache(fn, keyParts, options) lets you opt any function into the same persistent Data Cache used by fetch, specifying a cache key and options like revalidate seconds and tags. This makes it possible to apply time-based or tag-based revalidation to non-fetch data sources such as Prisma or Drizzle queries. It is still marked unstable because the API surface may change, but it is widely used in production for caching expensive database reads behind revalidateTag-driven invalidation.",
    code: "import { unstable_cache } from 'next/cache';\nimport { db } from '@/lib/db';\n\nexport const getPopularPosts = unstable_cache(\n  async () => {\n    return db.post.findMany({ orderBy: { views: 'desc' }, take: 10 });\n  },\n  ['popular-posts'],\n  { revalidate: 3600, tags: ['posts'] }\n);",
    interviewQuestion:
      "Why would you wrap a Prisma query in unstable_cache instead of relying on Next.js's default fetch caching?",
  },
  {
    id: "nextjs-tag-based-invalidation-strategy",
    category: "nextjs",
    difficulty: "Advanced",
    topic: "Caching",
    title: "How do you design a tag-based cache invalidation strategy?",
    summary:
      "Tag-based invalidation groups related cached data under shared string tags so a single revalidateTag call can invalidate every cache entry tied to that resource, regardless of which route or fetch produced it.",
    explanation:
      "Well-designed tagging assigns tags at the granularity you will actually invalidate at, e.g., post-${id} for a single post and posts for the list view, so updating one post can selectively bust just that post's cache and the list without over-invalidating unrelated pages. Tags are attached via the next: { tags: [...] } option on fetch or via the tags option in unstable_cache, and are invalidated with revalidateTag(tag) called from a Server Action or Route Handler, typically triggered by a mutation or an external webhook. A common mistake is using overly broad tags that force full-site cache clears, or overly narrow tags that miss dependent pages, so tagging should mirror the actual data relationships in the app. Combining tags with time-based revalidate as a fallback protects against a missed invalidation event.",
    code: "// lib/data.ts\nexport async function getPost(id: string) {\n  const res = await fetch(`https://api.example.com/posts/${id}`, {\n    next: { tags: [`post-${id}`, 'posts'] },\n  });\n  return res.json();\n}\n\n// app/actions.ts\n'use server';\nimport { revalidateTag } from 'next/cache';\n\nexport async function updatePost(id: string, data: FormData) {\n  await fetch(`https://api.example.com/posts/${id}`, { method: 'PUT', body: data });\n  revalidateTag(`post-${id}`);\n  revalidateTag('posts');\n}",
    interviewQuestion:
      "How would you structure cache tags so that editing a single blog post invalidates that post's page without unnecessarily invalidating every other cached page on the site?",
  },
  {
    id: "nextjs-image-sizes-prop-deep-dive",
    category: "nextjs",
    difficulty: "Advanced",
    topic: "Image Optimization",
    title:
      "What does the sizes prop control on next/image and why does it matter for responsive images?",
    summary:
      "The sizes prop tells the browser how wide the image will actually be displayed at different viewport widths, so it can pick the most appropriately sized generated image from the srcset instead of always downloading the largest one.",
    explanation:
      "When an image uses fill or has responsive layout behavior, next/image generates a srcset of multiple widths, but the browser needs the sizes attribute to know which of those candidate widths corresponds to its rendered slot at the current viewport, since CSS has not been applied yet at request time. Omitting sizes on a fill image causes the browser to default to 100vw, which often downloads a much larger image than necessary on desktop grids. A correct sizes value mirrors your CSS breakpoints, such as declaring the image is 100vw on mobile but 33vw inside a three-column desktop grid. Getting this wrong is a very common performance issue that silently defeats the point of responsive image optimization even though the page looks visually correct.",
    code: 'import Image from \'next/image\';\n\nexport function ProductCard({ src, alt }: { src: string; alt: string }) {\n  return (\n    <div className="relative aspect-square w-full">\n      <Image\n        src={src}\n        alt={alt}\n        fill\n        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"\n        className="object-cover"\n      />\n    </div>\n  );\n}',
    interviewQuestion:
      "A designer complains that product images look fine but load slowly on desktop. You notice the Image components use fill without a sizes prop. Explain why that causes over-fetching and how you would fix it.",
  },
  {
    id: "nextjs-static-export-mode-limitations",
    category: "nextjs",
    difficulty: "Advanced",
    topic: "Deployment",
    title: 'What are the limitations of output: "export" (static export mode)?',
    summary:
      "Static export mode compiles the entire app into plain HTML/CSS/JS with no Node.js server at runtime, which means it cannot support any feature that requires per-request server logic, such as Server Actions, Route Handlers with dynamic behavior, ISR, or middleware.",
    explanation:
      'Setting output: "export" produces a fully static site deployable to any static host like GitHub Pages, S3, or a plain CDN, generating HTML for every route at build time via generateStaticParams and static rendering. Because there is no server process, features that depend on per-request execution are unsupported or restricted: Server Actions cannot run, Route Handlers are limited to ones that can be statically generated (no request-dependent logic), Image Optimization requires an external loader since the default optimizer needs a server, cookies()/headers() cannot be used, and Middleware does not execute at all in the exported output. Dynamic routes still work but every possible path must be enumerable via generateStaticParams at build time since there is no fallback server rendering. This mode suits marketing sites, docs, and fully client-fetched SPAs but is a poor fit for apps needing personalization, authentication gating on the server, or on-demand revalidation.',
    code: "// next.config.js\n/** @type {import('next').NextConfig} */\nmodule.exports = {\n  output: 'export',\n  images: {\n    unoptimized: true, // no built-in optimizer server available\n  },\n};\n\n// Every dynamic route must have generateStaticParams,\n// and Server Actions / Middleware / next/headers are unavailable.",
    interviewQuestion:
      'A team wants to deploy their Next.js app to a plain S3 bucket using output: "export", but the app uses Server Actions for a contact form and middleware for auth redirects. What has to change?',
  },
  {
    id: "nextjs-dynamic-import-ssr-false",
    category: "nextjs",
    difficulty: "Intermediate",
    topic: "Client Components",
    title: "When and how do you use next/dynamic with ssr: false?",
    summary:
      "next/dynamic with ssr: false skips server-side rendering entirely for a component, deferring it to render only in the browser, which is necessary for code that depends on browser-only globals or heavy client-only libraries.",
    explanation:
      'Some libraries, such as charting tools, map widgets, or rich text editors, read from window or document at module load time and will throw during server rendering. Wrapping such a component with dynamic(() => import(...), { ssr: false }) tells Next.js to render nothing (or a placeholder) on the server and only mount the real component client-side after hydration. This is only valid inside a Client Component boundary in the App Router, since ssr: false is not supported when called from a Server Component; if needed there, you must move the dynamic import into a small "use client" wrapper. It is also a useful lever for deliberately deferring non-critical, JS-heavy widgets out of the initial server-rendered payload to improve TTFB and reduce hydration cost.',
    code: "'use client';\nimport dynamic from 'next/dynamic';\n\nconst MapWidget = dynamic(() => import('@/components/map-widget'), {\n  ssr: false,\n  loading: () => <p>Loading map...</p>,\n});\n\nexport function LocationPicker() {\n  return (\n    <div>\n      <h2>Choose a location</h2>\n      <MapWidget />\n    </div>\n  );\n}",
    interviewQuestion:
      "Why does next/dynamic throw an error if you set ssr: false inside a Server Component, and what is the correct way to achieve the same effect there?",
  },
  {
    id: "nextjs-clerk-auth0-integration-patterns",
    category: "nextjs",
    difficulty: "Intermediate",
    topic: "Authentication",
    title:
      "How do third-party auth providers like Clerk or Auth0 integrate with the App Router?",
    summary:
      "Providers like Clerk and Auth0 ship middleware, server-side session helpers, and client hooks that plug into Next.js's middleware, Server Components, and Route Handlers to manage authentication without you hand-rolling sessions.",
    explanation:
      "Clerk, for instance, provides a clerkMiddleware that runs on every matched request to attach the session to the request context and optionally protect routes, plus server helpers like auth() and currentUser() usable directly inside Server Components and Route Handlers without prop drilling. Auth0 follows a similar shape with its Next.js SDK, exposing a handler for the auth routes under app/api/auth/[...auth0]/route.ts and a getSession() helper for server-side reads. The key architectural difference from a hand-rolled solution is that these SDKs handle token refresh, JWT verification, and edge-compatible session reading so middleware can make protect/redirect decisions without a database round trip. Interviewers often probe whether candidates understand that these providers still rely on the same primitives, cookies, middleware, and the Edge runtime, that you would use to build auth manually.",
    code: "// middleware.ts\nimport { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';\n\nconst isProtectedRoute = createRouteMatcher(['/dashboard(.*)']);\n\nexport default clerkMiddleware((auth, req) => {\n  if (isProtectedRoute(req)) auth().protect();\n});\n\nexport const config = {\n  matcher: ['/((?!_next|.*\\\\..*).*)'],\n};",
    interviewQuestion:
      "How does Clerk's middleware decide to protect a route at the edge without making a database call on every request?",
  },
  {
    id: "nextjs-rbac-middleware-route-protection",
    category: "nextjs",
    difficulty: "Advanced",
    topic: "Authentication",
    title: "How do you implement role-based route protection in middleware?",
    summary:
      "Role-based protection reads a role claim from the session token inside middleware and redirects or rewrites the request before the route ever renders, centralizing authorization logic in one place.",
    explanation:
      "Because middleware runs on the Edge runtime before a request reaches a page, it is a good place to enforce coarse-grained authorization, such as blocking non-admin users from an /admin section, without paying the cost of rendering the page first. The role is typically read from a signed JWT stored in a cookie, decoded with a lightweight edge-compatible verification library since Node-only crypto APIs are unavailable at the edge. A common pitfall is doing fine-grained, per-resource authorization in middleware; that is better handled deeper in Server Components or Server Actions where you have full database access, while middleware should handle broad role gates and redirects. Matcher config should also be scoped tightly to avoid running this logic on static assets or unrelated routes for performance.",
    code: "import { NextResponse } from 'next/server';\nimport type { NextRequest } from 'next/server';\nimport { jwtVerify } from 'jose';\n\nexport async function middleware(req: NextRequest) {\n  const token = req.cookies.get('session')?.value;\n  if (!token) return NextResponse.redirect(new URL('/login', req.url));\n\n  const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));\n  if (req.nextUrl.pathname.startsWith('/admin') && payload.role !== 'admin') {\n    return NextResponse.redirect(new URL('/unauthorized', req.url));\n  }\n  return NextResponse.next();\n}\n\nexport const config = { matcher: ['/admin/:path*', '/dashboard/:path*'] };",
    interviewQuestion:
      "Why should fine-grained, per-resource authorization checks generally not live in middleware, and where should they live instead?",
  },
  {
    id: "nextjs-csrf-protection-server-actions",
    category: "nextjs",
    difficulty: "Tricky",
    topic: "Security",
    title:
      "How does Next.js protect Server Actions from CSRF, and when do you need extra measures?",
    summary:
      "Next.js automatically checks the Origin header against the Host header on every Server Action POST request to reject cross-site form submissions, but this protection has edge cases around proxies and custom domains that developers must configure correctly.",
    explanation:
      "Server Actions are invoked via a POST request carrying an encrypted action reference, and Next.js's built-in CSRF mitigation compares the request's Origin header to the server's own Host (and configurable allowed origins) header, rejecting the action if they do not match. This means an attacker's site cannot silently trigger your Server Actions via a forged form post from another origin. The main configuration gotcha is deployments behind a reverse proxy or on multiple custom domains, where the Host header seen by Next.js may not match the public-facing origin, requiring the serverActions.allowedOrigins config in next.config.js to explicitly whitelist trusted domains. This built-in check does not replace the need for proper authentication and authorization inside the action itself, since Origin headers can theoretically be stripped by some legacy proxies, so sensitive actions should still verify session identity server-side.",
    code: "// next.config.js\nmodule.exports = {\n  experimental: {\n    serverActions: {\n      allowedOrigins: ['my-app.com', '*.my-app.com', 'staging.my-app.com'],\n    },\n  },\n};",
    interviewQuestion:
      "A Server Action starts failing with a 403 only in staging after you put the app behind a new reverse proxy. What is the likely cause and how do you fix it?",
  },
  {
    id: "nextjs-rate-limiting-upstash-redis",
    category: "nextjs",
    difficulty: "Advanced",
    topic: "Security",
    title: "How do you implement rate limiting in Next.js with Upstash Redis?",
    summary:
      "Upstash provides an HTTP-based Redis client that works on the Edge runtime, paired with the @upstash/ratelimit library to implement sliding-window or token-bucket rate limits inside middleware or Route Handlers.",
    explanation:
      "Traditional Redis clients use TCP connections, which are unavailable in the Edge runtime, so Upstash's REST-based client is the standard choice for rate limiting that needs to run in middleware ahead of every request. The Ratelimit class wraps a chosen algorithm, commonly a sliding window, and is keyed by an identifier such as the client IP or authenticated user ID; calling limit(identifier) returns whether the request is allowed plus metadata like remaining requests and reset time useful for setting RateLimit-* response headers. A key design decision is where to enforce the limit: middleware protects all matched routes cheaply at the edge, while per-Route-Handler limiting allows different limits for different endpoints, such as a stricter limit on a login endpoint than on general API reads. Analytics can also be enabled to track abuse patterns via the Upstash dashboard.",
    code: "// lib/rate-limit.ts\nimport { Ratelimit } from '@upstash/ratelimit';\nimport { Redis } from '@upstash/redis';\n\nconst redis = Redis.fromEnv();\nexport const ratelimit = new Ratelimit({\n  redis,\n  limiter: Ratelimit.slidingWindow(10, '10 s'),\n});\n\n// middleware.ts\nimport { ratelimit } from '@/lib/rate-limit';\nimport { NextResponse } from 'next/server';\n\nexport async function middleware(req: Request) {\n  const ip = req.headers.get('x-forwarded-for') ?? 'anonymous';\n  const { success } = await ratelimit.limit(ip);\n  if (!success) return NextResponse.json({ error: 'Too many requests' }, { status: 429 });\n  return NextResponse.next();\n}",
    interviewQuestion:
      "Why can't you use a standard TCP-based Redis client for rate limiting inside Next.js middleware, and what does Upstash do differently?",
  },
  {
    id: "nextjs-trpc-integration-pattern",
    category: "nextjs",
    difficulty: "Advanced",
    topic: "Data Fetching",
    title:
      "How does tRPC integrate with Next.js App Router for end-to-end type safety?",
    summary:
      "tRPC exposes a single catch-all Route Handler that dispatches to typed procedures, letting the client call server functions with full TypeScript inference and no manual API schema or codegen.",
    explanation:
      "The integration mounts tRPC's fetch adapter at app/api/trpc/[trpc]/route.ts, which handles all queries and mutations defined in a central appRouter. On the client, React Query hooks generated from that same router give full type inference for inputs and outputs, so a change to a procedure's return type immediately surfaces as a type error at every call site. In the App Router, tRPC also supports calling procedures directly from Server Components via a server-side caller, bypassing the network round trip entirely while reusing the same procedure logic and validation, often paired with React Query hydration for prefetching. The main tradeoff versus plain Server Actions is that tRPC adds infrastructure and a learning curve, but it shines in larger apps needing a shared, versioned API layer consumed by multiple clients beyond just the Next.js frontend.",
    code: "// app/api/trpc/[trpc]/route.ts\nimport { fetchRequestHandler } from '@trpc/server/adapters/fetch';\nimport { appRouter } from '@/server/router';\n\nconst handler = (req: Request) =>\n  fetchRequestHandler({\n    endpoint: '/api/trpc',\n    req,\n    router: appRouter,\n    createContext: () => ({}),\n  });\n\nexport { handler as GET, handler as POST };",
    interviewQuestion:
      "What advantage does tRPC give you over calling a typed Server Action directly, and when would you still choose tRPC in an App Router project?",
  },
  {
    id: "nextjs-isr-stale-while-revalidate-internals",
    category: "nextjs",
    difficulty: "Tricky",
    topic: "Caching",
    title:
      "What happens internally during the stale-while-revalidate window in ISR?",
    summary:
      "When a revalidate period elapses, Next.js still serves the stale cached page immediately to the next request while triggering a background regeneration, only swapping in the fresh page once that regeneration succeeds.",
    explanation:
      "ISR does not block the requesting user on regeneration; instead, the first request after the revalidate window expires is served the existing stale HTML from cache while a single regeneration is kicked off in the background (deduplicated so concurrent requests do not trigger multiple regenerations). Subsequent requests continue receiving the stale version until the new render finishes and is committed to the cache, at which point it atomically replaces the old entry for all future requests. If regeneration fails, for example due to a data source error, Next.js keeps serving the last known good cached version rather than crashing the route, which is an important resilience property to mention in interviews. On Vercel this is implemented using their edge cache plus a background regeneration lambda invocation, while self-hosted deployments rely on the filesystem cache and an internal timer-based mechanism in the Node.js server.",
    code: "// app/blog/[slug]/page.tsx\nexport const revalidate = 60; // seconds\n\nexport default async function BlogPost({ params }: { params: { slug: string } }) {\n  const post = await fetch(`https://cms.example.com/posts/${params.slug}`).then((r) => r.json());\n  return <article><h1>{post.title}</h1><p>{post.body}</p></article>;\n}",
    interviewQuestion:
      "If a request hits a page exactly after its 60-second revalidate window has expired, does that user wait for fresh data, and what happens if the background regeneration fails?",
  },
  {
    id: "nextjs-standalone-vs-server-output",
    category: "nextjs",
    difficulty: "Intermediate",
    topic: "Deployment",
    title:
      'What is the difference between the default build output and output: "standalone"?',
    summary:
      'The default Next.js build assumes node_modules will be present at runtime, while output: "standalone" produces a minimal, self-contained server bundle with only the traced dependencies it actually needs, ideal for Docker images.',
    explanation:
      'Without standalone output, deploying a Next.js app requires shipping the entire node_modules directory alongside .next, which can be large and slow to copy into a container image. Setting output: "standalone" in next.config.js makes Next.js use its build-time dependency tracing to copy only the files actually required into a .next/standalone directory, including a minimal server.js entry point that can be run directly with node server.js without needing next start or a full node_modules install. Static assets and the public folder still need to be manually copied alongside the standalone output since they are not automatically included in that trace, which is a common Docker deployment mistake. This mode significantly shrinks image size and cold start time, making it the recommended output mode for containerized and self-hosted deployments.',
    code: "// next.config.js\n/** @type {import('next').NextConfig} */\nmodule.exports = {\n  output: 'standalone',\n};\n\n// Dockerfile (relevant excerpt)\n// COPY --from=builder /app/.next/standalone ./\n// COPY --from=builder /app/.next/static ./.next/static\n// COPY --from=builder /app/public ./public\n// CMD [\"node\", \"server.js\"]",
    interviewQuestion:
      'You containerize a Next.js app with output: "standalone" but images and CSS 404 in production. What did the Dockerfile likely forget to copy?',
  },
  {
    id: "nextjs-headers-in-server-components",
    category: "nextjs",
    difficulty: "Intermediate",
    topic: "Request APIs",
    title:
      "How do you read request headers inside a Server Component with next/headers?",
    summary:
      "The headers() function from next/headers returns a read-only view of the incoming request headers, accessible in any Server Component, Route Handler, or Server Action, and its use automatically opts a route into dynamic rendering.",
    explanation:
      "Calling headers() gives synchronous, read-only access to the current request's headers such as user-agent, authorization, or a custom header set by middleware, without needing to pass them down as props from a page. Because header values differ per request, invoking headers() (or cookies()) inside a Server Component forces that route out of static rendering into dynamic rendering at request time, since the response can no longer be safely cached and reused across users. This is a key mental model for interviews: static-vs-dynamic decisions in the App Router are driven by which dynamic APIs are actually called during a render, not by an explicit top-level config alone. In Next.js 15, headers() and cookies() became asynchronous and must be awaited, which is a notable breaking change from Next.js 14's synchronous API.",
    code: "// app/api/whoami/route.ts or a Server Component\nimport { headers } from 'next/headers';\n\nexport default async function Page() {\n  const headersList = await headers();\n  const userAgent = headersList.get('user-agent');\n  const country = headersList.get('x-vercel-ip-country');\n\n  return <p>Visiting from {country ?? 'unknown'} using {userAgent}</p>;\n}",
    interviewQuestion:
      'Why does calling headers() inside a page component automatically make that route dynamic even if you never set dynamic = "force-dynamic"?',
  },
  {
    id: "nextjs-telemetry-opt-out",
    category: "nextjs",
    difficulty: "Basic",
    topic: "Tooling",
    title: "What does Next.js telemetry collect and how do you disable it?",
    summary:
      "Next.js CLI telemetry collects anonymous, aggregated usage data such as which features and config options are used and build performance metrics, and it can be fully disabled with a single CLI command or environment variable.",
    explanation:
      "Telemetry is enabled by default starting a fresh Next.js install and gathers completely anonymized data like Next.js version, general machine info, feature flags in use, and build timing, explicitly excluding source code, file paths, environment variables, or any personally identifiable information, per Next.js's public documentation. It helps the Next.js team prioritize which features to invest in based on real-world usage patterns. Developers can opt out permanently by running npx next telemetry disable, check current status with npx next telemetry status, or disable it in CI/ephemeral environments by setting the NEXT_TELEMETRY_DISABLED=1 environment variable, which is common practice in company build pipelines for compliance or noise-reduction reasons even though the data collected is not sensitive.",
    code: "# Disable telemetry permanently\nnpx next telemetry disable\n\n# Check current status\nnpx next telemetry status\n\n# Or disable via env var, e.g. in CI\nexport NEXT_TELEMETRY_DISABLED=1",
    interviewQuestion:
      "Does Next.js telemetry ever collect environment variables or source file contents, and how would you disable it in a CI pipeline?",
  },
  {
    id: "nextjs-rsc-serialization-boundaries",
    category: "nextjs",
    difficulty: "Tricky",
    topic: "Server Components",
    title:
      "What can and cannot cross the Server-to-Client Component boundary as props?",
    summary:
      "Props passed from a Server Component to a Client Component must be serializable over the RSC wire format, so plain data like strings, numbers, plain objects, arrays, and Server Actions themselves can cross, but things like functions, class instances, Dates as complex objects, Symbols, and React Context cannot.",
    explanation:
      "The React Server Components protocol serializes the tree it sends to the client, meaning any prop passed into a Client Component must survive that serialization, which excludes closures/functions (except specially-marked Server Actions, which are serialized as a reference the client can invoke over the network), class instances with methods or prototypes, Map/Set in older versions, and undefined behaving inconsistently in some cases. A common mistake is trying to pass a database client instance, an event handler defined in the Server Component, or a non-plain object like a Mongoose document directly into a Client Component, which throws a serialization error at build or runtime. The correct pattern is to serialize data to plain JSON-like shapes before passing down, or to pass a Server Action reference when you need the client to trigger server-side logic. React Context is also unavailable across the boundary since Server Components have no client-side runtime to subscribe to it, which is why Context providers must themselves be Client Components wrapping the children.",
    code: "// app/page.tsx (Server Component)\nimport { ClientWidget } from './client-widget';\nimport { deletePost } from './actions';\n\nexport default async function Page() {\n  const post = await getPost(); // plain object - OK to pass down\n  return <ClientWidget post={post} onDelete={deletePost} />; // Server Action reference - OK\n}\n\n// This would fail: passing a class instance or function closure\n// <ClientWidget onClick={() => console.log('server closure')} />",
    interviewQuestion:
      "Why can you pass a Server Action as a prop into a Client Component, but not a regular function defined in the Server Component?",
  },
  {
    id: "nextjs-middleware-matcher-config-patterns",
    category: "nextjs",
    difficulty: "Intermediate",
    topic: "Middleware",
    title:
      "What patterns does the middleware matcher config support and why scope it carefully?",
    summary:
      "The config.matcher export controls exactly which request paths invoke middleware, supporting exact paths, path parameters, and regex-like negative lookaheads, and scoping it tightly avoids unnecessary edge invocations on static assets.",
    explanation:
      "By default, middleware without a matcher runs on every request, including static files and _next internals, which wastes edge invocations and can even break things like image optimization requests if the middleware logic is not careful. The matcher array supports simple path strings with :path* segment wildcards, and more precise regex-based negative lookaheads like /((?!_next/static|_next/image|favicon.ico).*) to exclude framework internals and static assets in one line. Matchers must be statically analyzable at build time, meaning you cannot construct the matcher dynamically from a variable; Next.js parses the config export directly. When multiple concerns need different logic, such as auth on /dashboard but A/B testing on /, the common pattern is to combine broad matching with conditional branching inside the middleware function itself rather than trying to express all logic purely in the matcher.",
    code: "export const config = {\n  matcher: [\n    /*\n     * Match all paths except:\n     * - _next/static, _next/image (static assets)\n     * - favicon.ico\n     * - public folder files with extensions\n     */\n    '/((?!_next/static|_next/image|favicon.ico|.*\\\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',\n  ],\n};",
    interviewQuestion:
      "Why is it important to exclude _next/static and _next/image from the middleware matcher, and what happens to performance if you forget?",
  },
  {
    id: "nextjs-bundle-size-budgets-ci",
    category: "nextjs",
    difficulty: "Advanced",
    topic: "Performance",
    title: "How do you enforce bundle size budgets in CI for a Next.js app?",
    summary:
      "Bundle size budgets set hard thresholds on JavaScript output per route or overall, enforced in CI using tools like next/bundle-analyzer combined with a size-checking action or a dedicated tool like size-limit or bundlewatch, failing the build if a threshold is exceeded.",
    explanation:
      "Without enforcement, bundle size tends to creep upward silently as dependencies are added, degrading Core Web Vitals like LCP and TBT over time in ways that are hard to notice incrementally. A common CI setup runs next build with ANALYZE=true to generate a stats artifact, then a tool like bundlewatch or size-limit compares the compiled output of specific chunks or First Load JS per route against configured limits, failing the pipeline and posting a PR comment with the delta if a budget is breached. Because Next.js splits code per route, budgets are often set per-route rather than as one global number, since a marketing page and a data-heavy dashboard have very different reasonable baselines. Teams typically pair this with periodic manual audits using @next/bundle-analyzer's treemap visualization to identify which specific dependency caused a regression when a budget check fails.",
    code: '// next.config.js\nconst withBundleAnalyzer = require(\'@next/bundle-analyzer\')({\n  enabled: process.env.ANALYZE === \'true\',\n});\nmodule.exports = withBundleAnalyzer({});\n\n// package.json\n// "scripts": { "analyze": "ANALYZE=true next build" }\n\n// .bundlewatch.config.json\n{\n  "files": [\n    { "path": ".next/static/chunks/pages/**/*.js", "maxSize": "170 kB" }\n  ],\n  "ci": { "trackBranches": ["main"] }\n}',
    interviewQuestion:
      "How would you set up a CI check that fails a pull request if a new dependency pushes a route's First Load JS past an agreed budget?",
  },
{
    id: "nextjs-link-prefetching-deep-dive",
    category: "nextjs",
    topic: "Navigation",
    title: "Link Component Deep Dive: Prefetching Behavior",
    difficulty: "Intermediate",
    summary: "next/link automatically prefetches linked routes when they enter the viewport, speeding up client-side navigation.",
    explanation:
      "For static routes, Link prefetches the full route (including data) in production once the link is visible in the viewport, using low-priority requests. For dynamic routes, only the shared layout down to the first loading.js boundary is prefetched, not the dynamic segment's data. Prefetching is disabled automatically in development and can be turned off per-link with prefetch={false}. Hovering or focusing a link that wasn't already prefetched also triggers a fetch before the click completes.",
    code: "import Link from 'next/link';\n\n// Default: prefetches when link enters viewport (prod only)\n<Link href=\"/blog/my-post\">Read post</Link>\n\n// Disable prefetching for rarely-visited or heavy routes\n<Link href=\"/admin/reports\" prefetch={false}>\n  Reports\n</Link>\n\n// Force full prefetch including dynamic data (Next 15+)\n<Link href={`/products/${id}`} prefetch={true}>\n  {name}\n</Link>",
    interviewQuestion: "How does next/link decide what to prefetch, and why is prefetching skipped in development?",
  },
  {
    id: "nextjs-userouter-hook",
    category: "nextjs",
    topic: "Navigation",
    title: "useRouter() Hook",
    difficulty: "Basic",
    summary: "Client Component hook from next/navigation for imperative navigation like push, replace, back, and refresh.",
    explanation:
      "useRouter must be called inside a Client Component ('use client') and comes from next/navigation in the App Router (not next/router, which is the Pages Router API). It exposes push, replace, back, forward, prefetch, and refresh methods but does not expose the current pathname or query params directly — those come from usePathname and useSearchParams instead. Navigation triggered by router.push does not reload the page; it updates the URL and re-renders only the segments that changed.",
    code: "'use client';\nimport { useRouter } from 'next/navigation';\n\nexport default function SaveButton() {\n  const router = useRouter();\n\n  async function handleSave() {\n    await fetch('/api/save', { method: 'POST' });\n    router.push('/dashboard');\n  }\n\n  return <button onClick={handleSave}>Save</button>;\n}",
    interviewQuestion: "Why does useRouter() from next/navigation not give you the current URL, and what would you use instead?",
  },
  {
    id: "nextjs-usepathname-hook",
    category: "nextjs",
    topic: "Navigation",
    title: "usePathname() Hook",
    difficulty: "Basic",
    summary: "Returns the current URL's pathname as a plain string, without the query string, for use in Client Components.",
    explanation:
      "usePathname is a read-only hook from next/navigation that re-renders the calling component whenever the pathname changes, making it ideal for highlighting active nav links or conditionally rendering UI based on route. It only returns the path segment (e.g. /blog/hello-world), never search params or hash. Because it requires client-side reactivity, it can only be used in Client Components; Server Components should instead read the pathname via headers() with a middleware-injected header if truly needed.",
    code: "'use client';\nimport { usePathname } from 'next/navigation';\nimport Link from 'next/link';\n\nexport default function NavLink({ href, children }) {\n  const pathname = usePathname();\n  const isActive = pathname === href;\n\n  return (\n    <Link href={href} className={isActive ? 'font-bold text-blue-600' : ''}>\n      {children}\n    </Link>\n  );\n}",
    interviewQuestion: "How would you build an active-state navigation link using usePathname, and does it include query strings?",
  },
  {
    id: "nextjs-usesearchparams-hook",
    category: "nextjs",
    topic: "Navigation",
    title: "useSearchParams() Hook",
    difficulty: "Intermediate",
    summary: "Reads the current URL's query string as a read-only URLSearchParams object in a Client Component.",
    explanation:
      "useSearchParams updates as the query string changes and is commonly used for filters, pagination, and search UIs. Because it depends on the URL at request/render time, using it in a component opts that component out of static rendering unless wrapped in a Suspense boundary — Next.js will throw a build error reminding you to add <Suspense> around the consumer during static generation. It only reads params; to update the URL you combine it with useRouter and pathname, constructing a new query string manually.",
    code: "'use client';\nimport { useSearchParams, useRouter, usePathname } from 'next/navigation';\n\nexport default function SortSelect() {\n  const searchParams = useSearchParams();\n  const router = useRouter();\n  const pathname = usePathname();\n\n  function handleChange(value) {\n    const params = new URLSearchParams(searchParams);\n    params.set('sort', value);\n    router.push(`${pathname}?${params.toString()}`);\n  }\n\n  return (\n    <select value={searchParams.get('sort') ?? 'newest'} onChange={e => handleChange(e.target.value)}>\n      <option value=\"newest\">Newest</option>\n      <option value=\"popular\">Popular</option>\n    </select>\n  );\n}",
    interviewQuestion: "Why does Next.js require a Suspense boundary around components that call useSearchParams during static builds?",
  },
  {
    id: "nextjs-useparams-hook",
    category: "nextjs",
    topic: "Navigation",
    title: "useParams() Hook",
    difficulty: "Basic",
    summary: "Reads dynamic route segment values (like [id] or [...slug]) as an object in a Client Component.",
    explanation:
      "useParams returns the current route's dynamic segments merged from every layout and page above the calling component, keyed by segment name. For a catch-all segment like [...slug], the value is an array of strings; for a normal segment like [id], it's a single string. It is the client-side equivalent of the params prop that Server Components and pages receive directly, useful when a deeply nested Client Component needs route info without prop drilling.",
    code: "'use client';\nimport { useParams } from 'next/navigation';\n\n// Route: /shop/[category]/[...filters]\nexport default function BreadcrumbTrail() {\n  const params = useParams();\n  // params = { category: 'shoes', filters: ['men', 'running'] }\n\n  return (\n    <nav>\n      {params.category} / {params.filters?.join(' / ')}\n    </nav>\n  );\n}",
    interviewQuestion: "How does useParams differ from the params prop passed to a page, and when would you reach for the hook instead?",
  },
  {
    id: "nextjs-router-refresh-behavior",
    category: "nextjs",
    topic: "Navigation",
    title: "router.refresh() Behavior",
    difficulty: "Advanced",
    summary: "Re-fetches the current route's Server Component data from the server without losing client state or doing a full page reload.",
    explanation:
      "router.refresh() re-runs Server Components for the current segment tree, re-fetching fresh data (bypassing the router's client-side cache for that page), and merges the resulting RSC payload into the existing page. Crucially, it does not reset useState in Client Components, scroll position, or unmount the whole tree — only the server-rendered parts are refreshed. It's the standard way to reflect a mutation (e.g. after a Server Action or form submit) without a full navigation, and pairs well with startTransition to keep the UI responsive.",
    code: "'use client';\nimport { useRouter } from 'next/navigation';\nimport { useTransition } from 'react';\n\nexport default function DeleteButton({ id }) {\n  const router = useRouter();\n  const [isPending, startTransition] = useTransition();\n\n  async function handleDelete() {\n    await fetch(`/api/items/${id}`, { method: 'DELETE' });\n    startTransition(() => {\n      router.refresh(); // re-fetch server data, keep client state\n    });\n  }\n\n  return <button disabled={isPending} onClick={handleDelete}>Delete</button>;\n}",
    interviewQuestion: "What exactly gets re-executed when you call router.refresh(), and why doesn't it reset local component state?",
  },
  {
    id: "nextjs-redirect-vs-router-push-tradeoffs",
    category: "nextjs",
    topic: "Navigation",
    title: "Redirect vs router.push Tradeoffs",
    difficulty: "Intermediate",
    summary: "redirect() from next/navigation runs on the server during rendering, while router.push runs on the client in response to an event.",
    explanation:
      "redirect() (or permanentRedirect()) is called inside Server Components, Route Handlers, or Server Actions and works by throwing a special NEXT_REDIRECT error that Next.js intercepts to issue the navigation before any HTML is sent — it cannot be caught by a try/catch that swallows errors generically. router.push, by contrast, is a Client Component API triggered imperatively (e.g. after validating a form or a button click) and performs a client-side transition using the Next.js router without a full server round trip. Using redirect() inside a Client Component throws, and using router.push during server rendering is not possible since it depends on browser history APIs.",
    code: "// Server Action: use redirect() — throws NEXT_REDIRECT internally\n'use server';\nimport { redirect } from 'next/navigation';\n\nexport async function createPost(formData) {\n  const post = await db.post.create({ data: { title: formData.get('title') } });\n  redirect(`/posts/${post.id}`); // must NOT be wrapped in try/catch that eats it\n}\n\n// Client Component: use router.push for event-driven navigation\n'use client';\nimport { useRouter } from 'next/navigation';\n\nfunction CancelButton() {\n  const router = useRouter();\n  return <button onClick={() => router.push('/dashboard')}>Cancel</button>;\n}",
    interviewQuestion: "Why can wrapping redirect() in a try/catch block silently break navigation, and when would you use router.push instead?",
  },
  {
    id: "nextjs-navigation-events-loading-indicators",
    category: "nextjs",
    topic: "Navigation",
    title: "Navigation Events / Loading Indicators",
    difficulty: "Tricky",
    summary: "Next.js has no built-in global 'route change start/end' event like Pages Router did; loading UI is instead driven by Suspense boundaries and transitions.",
    explanation:
      "In the Pages Router, Router.events (routeChangeStart, routeChangeComplete) gave a global hook for top-loading bars. The App Router removed this in favor of loading.js boundaries (automatic Suspense) and useTransition's isPending flag for client-triggered navigations. For a global top-of-page progress bar across all navigations (including link clicks and back/forward), teams typically use a library like nprogress wired to pending state, or track navigation via a custom Link wrapper that calls startTransition and exposes isPending through context. As of recent Next.js versions there is also an unstable/experimental onNavigate hook direction, but the stable pattern remains Suspense + useTransition.",
    code: "'use client';\nimport { useState, useTransition, createContext, useContext } from 'react';\nimport { useRouter } from 'next/navigation';\n\nconst NavContext = createContext({ isPending: false });\n\nexport function NavProvider({ children }) {\n  const [isPending, startTransition] = useTransition();\n  return (\n    <NavContext.Provider value={{ isPending, startTransition }}>\n      {isPending && <div className=\"top-progress-bar\" />}\n      {children}\n    </NavContext.Provider>\n  );\n}\n\nexport function useNavPending() {\n  return useContext(NavContext).isPending;\n}",
    interviewQuestion: "Since the App Router removed Router.events, how would you implement a global top-loading progress bar for navigations?",
  },
  {
    id: "nextjs-dynamic-metadata-generation",
    category: "nextjs",
    topic: "Metadata & SEO",
    title: "Dynamic Metadata Generation (generateMetadata)",
    difficulty: "Intermediate",
    summary: "An async function exported from a page or layout that computes metadata (title, description, OG tags) at request or build time using route params and fetched data.",
    explanation:
      "generateMetadata receives the same params and searchParams as the page component, plus a parent argument to access and extend metadata resolved by parent segments. Because it runs before the page renders, Next.js deduplicates any fetch() calls shared between generateMetadata and the page component itself, so fetching the same resource in both doesn't double the network cost. Metadata from nested segments is merged, with child values overriding parent ones except for arrays like openGraph.images which extend rather than replace by default depending on the field.",
    code: "export async function generateMetadata({ params }, parent) {\n  const post = await getPost(params.slug); // deduped with page's own fetch\n  const previousImages = (await parent).openGraph?.images || [];\n\n  return {\n    title: `${post.title} | My Blog`,\n    description: post.excerpt,\n    openGraph: {\n      images: [post.coverImage, ...previousImages],\n    },\n  };\n}\n\nexport default async function PostPage({ params }) {\n  const post = await getPost(params.slug); // same fetch, deduped\n  return <article>{post.title}</article>;\n}",
    interviewQuestion: "If both generateMetadata and the page component call the same fetch(), does the data get requested twice? Why or why not?",
  },
  {
    id: "nextjs-dynamic-og-image-per-post",
    category: "nextjs",
    topic: "Metadata & SEO",
    title: "Open Graph Image Generation Details: Per-Post Dynamic Images with ImageResponse",
    difficulty: "Advanced",
    summary: "Generating a unique, on-brand Open Graph image per blog post or product using an opengraph-image.tsx route that renders JSX to a PNG at request time via ImageResponse.",
    explanation:
      "Beyond a single static OG image, dynamic routes can define opengraph-image.tsx inside the segment folder, which receives the same params as the page and returns an ImageResponse built from JSX/CSS (using Satori under the hood, not a real browser, so only a constrained CSS subset is supported — flexbox layouts work, grid does not). The route is automatically wired into the page's metadata as og:image and twitter:image, and results are cached per the route's segment config unless marked dynamic. You can pull the post title, author avatar, and category color from the CMS at generation time to produce a unique card per URL instead of one generic image for the whole site.",
    code: "// app/blog/[slug]/opengraph-image.tsx\nimport { ImageResponse } from 'next/og';\n\nexport const size = { width: 1200, height: 630 };\nexport const contentType = 'image/png';\n\nexport default async function Image({ params }) {\n  const post = await getPost(params.slug);\n\n  return new ImageResponse(\n    (\n      <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', background: '#0f172a', color: 'white', padding: 80, justifyContent: 'center' }}>\n        <div style={{ fontSize: 24, color: '#38bdf8' }}>{post.category}</div>\n        <div style={{ fontSize: 64, fontWeight: 700 }}>{post.title}</div>\n      </div>\n    ),\n    { ...size }\n  );\n}",
    interviewQuestion: "How would you generate a unique Open Graph image per blog post instead of reusing one static image, and what rendering engine limitations should you watch for?",
  },
  {
    id: "nextjs-twitter-card-images",
    category: "nextjs",
    topic: "Metadata & SEO",
    title: "Twitter Card Images",
    difficulty: "Basic",
    summary: "Twitter/X reads its own twitter card metadata, which Next.js can auto-populate from openGraph fields or configure separately via twitter-image files.",
    explanation:
      "If a twitter object isn't explicitly set in metadata, Next.js falls back to the openGraph values for card image, title, and description, so many apps never configure twitter separately. To use a distinct crop or aspect ratio for Twitter's 'summary_large_image' card, add a twitter-image.tsx (or static twitter-image.png) file alongside opengraph-image, or set metadata.twitter explicitly with card: 'summary_large_image'. Twitter card debugging is stricter about caching than Facebook's, so during testing you often need to use the Card Validator to force a re-crawl since old previews persist.",
    code: "// app/blog/[slug]/twitter-image.tsx\nimport { ImageResponse } from 'next/og';\n\nexport const size = { width: 1200, height: 675 }; // 16:9 for summary_large_image\nexport const contentType = 'image/png';\n\nexport default async function TwitterImage({ params }) {\n  const post = await getPost(params.slug);\n  return new ImageResponse(\n    <div style={{ display: 'flex', width: '100%', height: '100%', background: '#111', color: '#fff', alignItems: 'center', justifyContent: 'center', fontSize: 56 }}>\n      {post.title}\n    </div>,\n    { ...size }\n  );\n}\n\n// Or declaratively:\nexport const metadata = {\n  twitter: { card: 'summary_large_image', title: 'My Blog' },\n};",
    interviewQuestion: "If you don't configure a twitter metadata object at all, what image will Twitter/X show when your link is shared, and why?",
  },
  {
    id: "nextjs-web-app-manifest",
    category: "nextjs",
    topic: "Metadata & SEO",
    title: "Web App Manifest (manifest.json)",
    difficulty: "Basic",
    summary: "A manifest.ts (or static manifest.json) file in the app directory describes the app for PWA installability — name, icons, theme colors, and display mode.",
    explanation:
      "Next.js supports a special app/manifest.ts file that exports a function returning a MetadataRoute.Manifest object; Next.js automatically serves it at /manifest.webmanifest and links it in the document head, so no manual <link rel='manifest'> tag is needed. Fields like display: 'standalone' control whether the installed app hides browser chrome, and icons should include multiple sizes (including a maskable purpose icon for Android adaptive icons). This is what enables the browser's 'Add to Home Screen' / install prompt on supported devices.",
    code: "// app/manifest.ts\nimport type { MetadataRoute } from 'next';\n\nexport default function manifest(): MetadataRoute.Manifest {\n  return {\n    name: 'Dev Life Study Hub',\n    short_name: 'Dev Life',\n    description: 'Interview prep and study tracker',\n    start_url: '/',\n    display: 'standalone',\n    background_color: '#0f172a',\n    theme_color: '#0f172a',\n    icons: [\n      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },\n      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },\n    ],\n  };\n}",
    interviewQuestion: "How does app/manifest.ts get exposed to the browser, and what's the purpose of a 'maskable' icon?",
  },
  {
    id: "nextjs-lazy-loading-components-ux",
    category: "nextjs",
    topic: "Performance",
    title: "Lazy Loading Components: Beyond Bundle Size",
    difficulty: "Intermediate",
    summary: "Deferring a component's load until it's actually needed — on interaction, scroll-into-view, or condition — to cut initial JS and defer non-critical work.",
    explanation:
      "While next/dynamic is the mechanism, 'lazy loading' as an interview topic is really about the decision of what to defer and when: below-the-fold widgets, modals that open on click, admin-only panels behind a role check, or heavy third-party embeds (maps, charts, video players) are prime candidates. A common mistake is lazy-loading something needed for the initial paint, which just adds a waterfall (spinner then content) instead of saving anything meaningful — the win only materializes when the deferred code truly isn't needed immediately. Pair lazy-loaded UI with a lightweight, correctly-sized placeholder to avoid layout shift.",
    code: "'use client';\nimport dynamic from 'next/dynamic';\nimport { useState } from 'react';\n\n// Only loaded once the user actually opens the modal\nconst ImageEditorModal = dynamic(() => import('./ImageEditorModal'), {\n  loading: () => <div className=\"modal-skeleton\" />,\n});\n\nexport default function Gallery() {\n  const [open, setOpen] = useState(false);\n  return (\n    <>\n      <button onClick={() => setOpen(true)}>Edit image</button>\n      {open && <ImageEditorModal onClose={() => setOpen(false)} />}\n    </>\n  );\n}",
    interviewQuestion: "When does lazy loading a component actually hurt perceived performance instead of helping it?",
  },
  {
    id: "nextjs-suspense-dynamic-imports-combo",
    category: "nextjs",
    topic: "Performance",
    title: "Suspense + Dynamic Imports Combo",
    difficulty: "Advanced",
    summary: "Combining next/dynamic (or React.lazy) with a Suspense boundary lets you stream in code-split UI with fine-grained fallback control instead of a single top-level loading state.",
    explanation:
      "next/dynamic's built-in loading option works for simple cases, but wrapping a dynamically imported component in your own <Suspense> boundary gives you more control: you can share one fallback across multiple lazy children, coordinate multiple independent boundaries at different granularities, or use ssr: false together with Suspense so a client-only widget (like a chart requiring window) doesn't block the rest of the server-rendered page. In the App Router, when a dynamic import resolves inside a Server Component tree, Suspense also enables streaming — the shell ships immediately and the lazy chunk's HTML streams in when ready, rather than the whole route waiting on it.",
    code: "import { Suspense } from 'react';\nimport dynamic from 'next/dynamic';\n\nconst RevenueChart = dynamic(() => import('./RevenueChart'), { ssr: false });\nconst ActivityFeed = dynamic(() => import('./ActivityFeed'));\n\nexport default function Dashboard() {\n  return (\n    <div>\n      <h1>Dashboard</h1>\n      <Suspense fallback={<ChartSkeleton />}>\n        <RevenueChart />\n      </Suspense>\n      <Suspense fallback={<FeedSkeleton />}>\n        <ActivityFeed />\n      </Suspense>\n    </div>\n  );\n}",
    interviewQuestion: "Why would you wrap a next/dynamic component in your own Suspense boundary instead of relying solely on its loading option?",
  },
  {
    id: "nextjs-code-splitting-strategies",
    category: "nextjs",
    topic: "Performance",
    title: "Code Splitting Strategies",
    difficulty: "Advanced",
    summary: "Next.js automatically splits code per route, but deliberate strategies (route-based, component-based, and library-based splitting) further shrink what ships to each visitor.",
    explanation:
      "Route-based splitting is automatic in both routers — each page/route segment gets its own chunk so visiting one page doesn't download another's code. Component-based splitting via next/dynamic targets heavy, conditionally-rendered UI (modals, editors, charts). Library-based splitting targets large dependencies used in only part of the app — for example dynamically importing a rich-text editor or a PDF library only on the admin page that uses it, or using per-component imports (import debounce from 'lodash/debounce') instead of importing the entire library to let tree-shaking drop unused code. Analyzing the actual output with @next/bundle-analyzer is the way to verify a splitting strategy is working rather than assuming it.",
    code: "// Library-based: import only what's needed, not the whole barrel\nimport debounce from 'lodash/debounce'; // not: import { debounce } from 'lodash'\n\n// Component-based: split a heavy editor out of the main bundle\nconst RichTextEditor = dynamic(() => import('@/components/RichTextEditor'), {\n  ssr: false,\n  loading: () => <p>Loading editor...</p>,\n});\n\n// Verify with:\n// ANALYZE=true next build   (with @next/bundle-analyzer configured)",
    interviewQuestion: "Beyond automatic route-based splitting, what deliberate steps would you take to reduce a page's JavaScript payload?",
  },
  {
    id: "nextjs-server-only-package",
    category: "nextjs",
    topic: "Server/Client Boundaries",
    title: "Server-only Package (server-only)",
    difficulty: "Intermediate",
    summary: "Importing the server-only package at the top of a module causes a build error if that module is ever imported into client-bundled code, guarding against leaking secrets.",
    explanation:
      "server-only is a zero-runtime-code package published by Vercel; importing it does nothing at runtime but its package.json is configured so bundlers throw a build-time error if the module (or anything importing it) ends up in a client bundle. This is the recommended way to hard-fence modules that read process.env secrets, use Node-only APIs, or query a database directly, preventing an accidental 'use client' component from importing it and silently bundling credentials into client JS. Without it, such a mistake can compile successfully and only surface as a runtime error or, worse, a leaked secret in the browser.",
    code: "// lib/db.ts\nimport 'server-only';\nimport { Pool } from 'pg';\n\nconst pool = new Pool({ connectionString: process.env.DATABASE_URL });\n\nexport async function getUserById(id: string) {\n  const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [id]);\n  return rows[0];\n}\n\n// If a Client Component ever does: import { getUserById } from '@/lib/db'\n// -> build fails: \"You're importing a component that needs server-only...\"",
    interviewQuestion: "What does importing the server-only package actually do at runtime, and what problem is it protecting you from?",
  },
  {
    id: "nextjs-client-only-package",
    category: "nextjs",
    topic: "Server/Client Boundaries",
    title: "Client-only Package (client-only)",
    difficulty: "Intermediate",
    summary: "The counterpart to server-only — importing client-only causes a build error if a module reaches server-side rendering, guarding code that depends on browser globals.",
    explanation:
      "Modules that touch window, document, localStorage, or other browser-only APIs at module scope will crash during server rendering unless guarded. Importing 'client-only' at the top of such a module makes the bundler fail the build if that module is ever pulled into a server-rendered path, catching the mistake at build time instead of a confusing 'window is not defined' runtime error. It's typically used in small utility modules (analytics wrappers, feature-detection helpers) that are meant to be imported only from Client Components, as an extra safety net beyond the 'use client' directive which only marks components, not arbitrary utility files.",
    code: "// lib/analytics-client.ts\nimport 'client-only';\n\nexport function trackEvent(name: string, props?: Record<string, unknown>) {\n  window.analytics?.track(name, props); // relies on browser global\n}\n\n// If a Server Component tries: import { trackEvent } from '@/lib/analytics-client'\n// -> build fails instead of throwing \"window is not defined\" at request time",
    interviewQuestion: "How does the client-only package differ from adding 'use client' at the top of a file, and when would you use it instead?",
  },
  {
    id: "nextjs-instrumentation-hook-overview",
    category: "nextjs",
    topic: "Observability",
    title: "Instrumentation Hook Overview",
    difficulty: "Advanced",
    summary: "A stable Next.js feature that lets you run setup code once when the server process starts, before any request is handled — the standard place to wire up observability tooling.",
    explanation:
      "The instrumentation hook is exposed via a register() function in instrumentation.ts at the project root, invoked exactly once per server runtime instance (separately for nodejs and edge runtimes, distinguishable via process.env.NEXT_RUNTIME). It's designed for side-effectful startup work — initializing tracing SDKs, connecting long-lived clients, setting up global error reporting — that shouldn't run on every request or be duplicated across route modules. It became stable (no longer needing an experimental flag) in Next.js 15, and is distinct from middleware, which runs per-request rather than per-process-startup.",
    code: "// instrumentation.ts (project root)\nexport async function register() {\n  if (process.env.NEXT_RUNTIME === 'nodejs') {\n    const { initTracing } = await import('./lib/tracing');\n    await initTracing();\n  }\n\n  if (process.env.NEXT_RUNTIME === 'edge') {\n    // lightweight setup only — edge runtime has fewer Node APIs available\n  }\n}",
    interviewQuestion: "How often does the instrumentation.ts register() function run, and why is it distinct from middleware?",
  },
  {
    id: "nextjs-instrumentation-ts-file",
    category: "nextjs",
    topic: "Observability",
    title: "instrumentation.ts File: Structure and Gotchas",
    difficulty: "Intermediate",
    summary: "The concrete file conventions, placement rules, and common mistakes when adding instrumentation.ts to a Next.js project.",
    explanation:
      "instrumentation.ts must live at the project root (same level as next.config.js), or inside src/ if that's where the app directory lives — placing it inside app/ does nothing. Only the register export is recognized; other exports are ignored. A frequent gotcha is importing Node-only packages (like a full OpenTelemetry SDK) at the top level unconditionally, which breaks the edge runtime build since that file is also evaluated in edge contexts — the fix is to dynamically import Node-specific code inside the NEXT_RUNTIME === 'nodejs' branch as shown in the hook overview. Another gotcha is expecting register() to run per-request; it does not, so per-request instrumentation still belongs in middleware or route handlers.",
    code: "// PROJECT ROOT/instrumentation.ts  (NOT inside app/)\nexport async function register() {\n  console.log('Server instrumentation booting, runtime =', process.env.NEXT_RUNTIME);\n}\n\n// next.config.js\n/** @type {import('next').NextConfig} */\nconst nextConfig = {\n  // instrumentationHook was experimental pre-v15; stable by default in v15+\n};\nmodule.exports = nextConfig;",
    interviewQuestion: "Where exactly must instrumentation.ts be placed for Next.js to pick it up, and what breaks if you unconditionally import Node-only packages at its top level?",
  },
  {
    id: "nextjs-opentelemetry-integration",
    category: "nextjs",
    topic: "Observability",
    title: "OpenTelemetry Integration",
    difficulty: "Advanced",
    summary: "Next.js has built-in OpenTelemetry support for tracing Server Components, Route Handlers, and fetch calls, wired up via instrumentation.ts and @vercel/otel.",
    explanation:
      "Next.js automatically creates spans for key operations (rendering a route, executing a Route Handler, fetch requests) when OpenTelemetry is registered, tagged with useful attributes like the HTTP method and route path. The simplest setup uses the @vercel/otel package inside instrumentation.ts's register() function, which configures a NodeSDK with sensible defaults and lets you plug in any OTLP-compatible exporter (Jaeger, Honeycomb, Datadog, Grafana Tempo). For custom spans around business logic (e.g. a slow third-party API call), you use the standard @opentelemetry/api trace.getTracer() API directly inside Server Components or Route Handlers — Next.js's auto-instrumentation and manual spans compose in the same trace.",
    code: "// instrumentation.ts\nimport { registerOTel } from '@vercel/otel';\n\nexport function register() {\n  registerOTel({ serviceName: 'devquiz-web' });\n}\n\n// Manual span inside a Route Handler\nimport { trace } from '@opentelemetry/api';\n\nexport async function GET(request: Request) {\n  const tracer = trace.getTracer('devquiz');\n  return tracer.startActiveSpan('fetch-external-pricing', async (span) => {\n    const data = await fetch('https://pricing.example.com/api').then(r => r.json());\n    span.end();\n    return Response.json(data);\n  });\n}",
    interviewQuestion: "How does Next.js's built-in OpenTelemetry auto-instrumentation relate to manual spans you create yourself, and where do you register the exporter?",
  },
  {
    id: "nextjs-server-timing-api",
    category: "nextjs",
    topic: "Observability",
    title: "Server Timing API",
    difficulty: "Tricky",
    summary: "The Server-Timing response header surfaces backend performance metrics (e.g. cache hit/miss, DB query duration) directly in browser DevTools' Network panel.",
    explanation:
      "Next.js automatically emits Server-Timing entries for its own internal operations (like fetch cache status) when running with tracing enabled, visible under the Timing tab of a request in DevTools. You can append your own custom entries from a Route Handler or middleware by manually setting the Server-Timing header with the format 'name;dur=123;desc=\"description\"', letting you correlate a slow page load with a specific slow database query or third-party call without needing a separate observability dashboard for quick debugging. This is a lightweight, no-extra-infra way to get some of what full tracing (OpenTelemetry) gives you, but it's not aggregated or stored anywhere — it's purely a per-request, in-browser debugging signal.",
    code: "export async function GET(request: Request) {\n  const start = performance.now();\n  const data = await db.query('SELECT * FROM products LIMIT 20');\n  const dbDuration = performance.now() - start;\n\n  return Response.json(data, {\n    headers: {\n      'Server-Timing': `db;dur=${dbDuration.toFixed(1)};desc=\"Product query\"`,\n    },\n  });\n}\n\n// Visible in Chrome DevTools -> Network -> select request -> Timing tab",
    interviewQuestion: "How would you use the Server-Timing header to help a frontend engineer diagnose whether a slow page load is a database issue or a rendering issue?",
  },
  {
    id: "nextjs-bundle-splitting-strategies",
    category: "nextjs",
    topic: "Performance",
    title: "Bundle Splitting Strategies (Webpack/Turbopack Internals)",
    difficulty: "Tricky",
    summary: "How Next.js's underlying bundler groups modules into chunks — framework, commons, shared, and per-route — and when to intervene with custom splitChunks config.",
    explanation:
      "By default Next.js's webpack config (via splitChunks) separates a stable 'framework' chunk (React, ReactDOM) that rarely changes and caches well long-term, a 'commons' chunk for code shared across many pages, and per-route chunks for page-specific code, balancing cache hit rate against duplicate code across chunks. Turbopack (used with next dev --turbo and increasingly for builds) takes a different, more granular incremental-compilation approach but aims for equivalent output characteristics. Most teams should not hand-tune splitChunks — the defaults are well-tuned — but it becomes relevant when a huge dependency (e.g. a charting library) is pulled into the shared commons chunk because it's used on 3+ pages, bloating every page's initial load even where the chart isn't rendered yet; the fix is usually dynamic import at the usage site rather than webpack config surgery.",
    code: "// next.config.js — rarely needed, but for advanced cases:\n/** @type {import('next').NextConfig} */\nconst nextConfig = {\n  webpack(config) {\n    config.optimization.splitChunks.cacheGroups.charting = {\n      test: /[\\\\/]node_modules[\\\\/](recharts|d3)[\\\\/]/,\n      name: 'charting-vendor',\n      chunks: 'all',\n      priority: 20,\n    };\n    return config;\n  },\n};\nmodule.exports = nextConfig;\n\n// Usually the simpler fix: dynamic import at the call site instead\n// const Chart = dynamic(() => import('recharts').then(m => m.LineChart));",
    interviewQuestion: "A rarely-used charting library is inflating every page's initial JS bundle. Would you fix this with custom webpack splitChunks config or a different approach, and why?",
  },
  {
    id: "nextjs-react-compiler-integration",
    category: "nextjs",
    topic: "Performance",
    title: "React Compiler in Next.js",
    difficulty: "Advanced",
    summary: "React Compiler automatically memoizes components and values at build time, reducing the need for manual useMemo/useCallback/React.memo, and is opt-in via next.config.js.",
    explanation:
      "React Compiler analyzes component code and inserts memoization automatically based on data-flow analysis, aiming to give React apps 'automatic' re-render optimization without developers hand-placing useMemo and useCallback everywhere. In Next.js it's enabled by installing babel-plugin-react-compiler and setting experimental.reactCompiler: true in next.config.js; because it runs as a Babel plugin it currently opts the project out of some SWC-only fast-path optimizations, so build times can increase, and it should be enabled incrementally with the eslint-plugin-react-compiler rule to catch code that violates the Rules of React (which the compiler depends on to memoize safely). It doesn't replace all manual memoization use cases — some, like referential stability for external effect dependencies, may still need explicit handling.",
    code: "// next.config.js\n/** @type {import('next').NextConfig} */\nconst nextConfig = {\n  experimental: {\n    reactCompiler: true,\n  },\n};\nmodule.exports = nextConfig;\n\n// Component no longer needs manual memoization —\n// the compiler infers stable references automatically:\nfunction ProductList({ products, query }) {\n  const filtered = products.filter(p => p.name.includes(query)); // auto-memoized\n  return <ul>{filtered.map(p => <li key={p.id}>{p.name}</li>)}</ul>;\n}",
    interviewQuestion: "What tradeoff do you accept when enabling React Compiler in a Next.js project, and what tool would you use to catch code that isn't compiler-safe before shipping it?",
  },
];
