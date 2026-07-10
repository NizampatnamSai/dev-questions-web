// Backend Development — framework-agnostic deep dives on how APIs, servers,
// and backend systems actually work in production, from a basic CRUD
// endpoint to architecture that survives 10k+ requests/sec. Node/Python
// framework-specific material lives in nodejs.js / pybackend.js — this file
// covers the concepts that apply regardless of stack.
export default [
  {
    id: "backend-what-is-an-api",
    category: "backend",
    topic: "API Fundamentals",
    title: "What Actually Happens When You Call an API?",
    difficulty: "Basic",
    summary:
      "An API call is a request-response cycle over HTTP: the client serializes a request, it travels over TCP/IP through DNS resolution and possibly a load balancer, the server parses it, runs handler code, and serializes a response back.",
    explanation:
      "When a client calls `GET /api/users/42`, the browser or HTTP client first resolves the domain to an IP via DNS, opens a TCP connection (with a TLS handshake if HTTPS), and sends an HTTP request line, headers, and optional body. That request may pass through a CDN, a load balancer, and a reverse proxy (like Nginx) before reaching the application server. The server's router matches the path and method to a handler function, which typically validates input, queries a database or cache, transforms the result, and returns a response with a status code, headers, and a body (usually JSON). The whole round trip — DNS, TCP/TLS setup, request, processing, response — is what contributes to latency, which is why connection reuse (keep-alive), caching, and reducing hops matter for performance.",
    code: "GET /api/users/42 HTTP/1.1\nHost: api.example.com\nAuthorization: Bearer eyJhbGciOi...\nAccept: application/json\n\n--- server processes request ---\n\nHTTP/1.1 200 OK\nContent-Type: application/json\nCache-Control: max-age=60\n\n{\n  \"id\": 42,\n  \"name\": \"Alice\",\n  \"email\": \"alice@example.com\"\n}",
    interviewQuestion:
      "Walk through everything that happens between a client calling an API and receiving a response.",
  },
  {
    id: "backend-http-methods-semantics",
    category: "backend",
    topic: "API Fundamentals",
    title: "HTTP Methods and Their Real Semantics",
    difficulty: "Basic",
    summary:
      "GET, POST, PUT, PATCH, and DELETE each carry semantic meaning about safety and idempotency that well-designed APIs must respect, not just use as arbitrary labels.",
    explanation:
      "GET must be safe (no side effects) and idempotent (calling it many times returns the same result without changing state) — this is what allows browsers and CDNs to cache GET responses. POST is neither safe nor idempotent by default: calling it twice can create two resources, which is why payment and order-creation endpoints need idempotency keys. PUT is idempotent — it replaces a resource entirely, so calling it repeatedly with the same body produces the same end state. PATCH applies a partial update and is not guaranteed idempotent unless carefully designed. DELETE is idempotent in principle (deleting an already-deleted resource should still report success, not error). Violating these semantics breaks assumptions that proxies, caches, retry logic, and other engineers make about your API.",
    code: "// Idempotent: safe to retry automatically on network failure\nPUT /api/carts/42/items/7\n{ \"quantity\": 3 }\n\n// NOT idempotent: retrying blindly could double-charge\nPOST /api/payments\n{ \"amount\": 49.99, \"cardToken\": \"tok_abc\" }\n\n// Fix: require an idempotency key so retries are safe\nPOST /api/payments\nIdempotency-Key: 8f14e45f-ceea-4c\n{ \"amount\": 49.99, \"cardToken\": \"tok_abc\" }",
    interviewQuestion:
      "Why is it dangerous for a client to automatically retry a failed POST request, and how do idempotency keys solve it?",
  },
  {
    id: "backend-status-codes-deep-dive",
    category: "backend",
    topic: "API Fundamentals",
    title: "HTTP Status Codes: Beyond 200 and 404",
    difficulty: "Basic",
    summary:
      "Status codes are grouped by first digit (2xx success, 3xx redirect, 4xx client error, 5xx server error) and picking the precise code communicates intent to clients, proxies, and monitoring systems.",
    explanation:
      "201 Created (with a Location header pointing to the new resource) is more informative than a bare 200 after a POST. 204 No Content signals success with no body, common for DELETE. 400 Bad Request means the client sent malformed data; 401 Unauthorized means authentication is missing or invalid; 403 Forbidden means the client is authenticated but not allowed; 404 means the resource doesn't exist; 409 Conflict signals a state clash (like a duplicate unique key); 422 Unprocessable Entity is validation failure on well-formed input; 429 Too Many Requests signals rate limiting and should include a Retry-After header. 500 is an unhandled server error; 502/503/504 usually indicate an upstream/gateway problem rather than your application code. Monitoring dashboards and alerting rules are often built directly on these codes, so using the wrong one silently breaks observability.",
    code: "// Precise status codes make client error handling trivial\nif (!user) return res.status(404).json({ error: \"User not found\" });\nif (!isValid) return res.status(422).json({ error: \"Validation failed\", fields: errors });\nif (isRateLimited) {\n  res.set(\"Retry-After\", \"30\");\n  return res.status(429).json({ error: \"Too many requests\" });\n}\nres.status(201).location(`/api/users/${user.id}`).json(user);",
    interviewQuestion:
      "What's the difference between 401 and 403, and between 400 and 422 — and why does the distinction matter?",
  },
  {
    id: "backend-cors-deep-dive",
    category: "backend",
    topic: "CORS & Security",
    title: "CORS: What It Actually Protects Against",
    difficulty: "Intermediate",
    summary:
      "CORS is a browser-enforced mechanism that restricts which origins can read responses from a cross-origin request — it protects users from malicious sites silently reading data from sites they're logged into, not the server from being called.",
    explanation:
      "The Same-Origin Policy blocks a page on `evil.com` from reading responses to requests it makes to `bank.com` — but the request often still fires. CORS is the server's way of opting into letting specific origins read the response, via the `Access-Control-Allow-Origin` header. 'Simple' requests (GET/POST with basic headers) go straight through with the browser checking the response header afterward; anything else — custom headers, JSON content-type, PUT/DELETE — triggers a 'preflight' OPTIONS request first, where the browser asks permission before sending the real request. `Access-Control-Allow-Credentials: true` is required to send cookies cross-origin, and it can never be combined with a wildcard `*` origin for security reasons — the server must echo back a specific origin. CORS is entirely a browser-side protection; it does nothing to stop server-to-server requests, curl, or Postman, which is a common misconception.",
    code: "// Preflight request (browser-generated, before the real PATCH request)\nOPTIONS /api/users/42 HTTP/1.1\nOrigin: https://app.example.com\nAccess-Control-Request-Method: PATCH\nAccess-Control-Request-Headers: content-type, authorization\n\n// Server's preflight response\nHTTP/1.1 204 No Content\nAccess-Control-Allow-Origin: https://app.example.com\nAccess-Control-Allow-Methods: GET, POST, PATCH, DELETE\nAccess-Control-Allow-Headers: content-type, authorization\nAccess-Control-Allow-Credentials: true\nAccess-Control-Max-Age: 86400",
    interviewQuestion:
      "If CORS is enforced by the browser, why can't a malicious actor just bypass it with curl — and does that mean CORS is pointless?",
  },
  {
    id: "backend-api-authentication-patterns",
    category: "backend",
    topic: "Authentication & Authorization",
    title: "Session Cookies vs JWTs vs API Keys",
    difficulty: "Intermediate",
    summary:
      "Session cookies keep state server-side and are revocable instantly; JWTs are stateless and scale horizontally but are hard to revoke before expiry; API keys identify a calling application, not a human user.",
    explanation:
      "Session-based auth stores a session ID in a cookie, with the actual session data (user ID, roles) kept in a server-side store like Redis. This makes logout and permission changes take effect immediately, but requires a shared session store across server instances. JWTs (JSON Web Tokens) encode claims directly in a signed token the client holds; the server verifies the signature without a database lookup, which scales well horizontally, but revoking a single JWT before its expiry requires an extra mechanism like a blocklist, defeating some of the statelessness benefit. Short-lived access tokens paired with longer-lived refresh tokens is the common compromise. API keys are typically long-lived secrets identifying a service or application (not a specific user session) and are usually paired with rate limiting and scoped permissions rather than full auth flows.",
    code: "// JWT structure: header.payload.signature (base64url each)\n// Payload (decoded, NOT encrypted — never put secrets in a JWT)\n{\n  \"sub\": \"user_42\",\n  \"role\": \"admin\",\n  \"iat\": 1735689600,\n  \"exp\": 1735693200\n}\n\n// Verifying server-side (no DB call needed)\nconst payload = jwt.verify(token, process.env.JWT_SECRET);\nif (payload.role !== \"admin\") throw new ForbiddenError();",
    interviewQuestion:
      "Why is revoking a single JWT before it expires hard, and what are the common ways to work around that limitation?",
  },
  {
    id: "backend-rbac-vs-abac",
    category: "backend",
    topic: "Authentication & Authorization",
    title: "RBAC vs ABAC Authorization Models",
    difficulty: "Intermediate",
    summary:
      "Role-Based Access Control assigns permissions to fixed roles like 'admin' or 'editor'; Attribute-Based Access Control evaluates policies against dynamic attributes of the user, resource, and context.",
    explanation:
      "RBAC is simple to reason about: a user has one or more roles, and each role has a fixed set of permissions — great for coarse-grained access like admin vs regular user. It breaks down for rules like 'a user can edit a document only if they created it or are in the same team,' which needs data, not just a role, to decide. ABAC evaluates policies against attributes — user attributes (department, clearance level), resource attributes (owner, sensitivity), and environmental attributes (time of day, IP range) — enabling fine-grained rules like 'finance staff can approve invoices under $10k during business hours.' Most real systems use a hybrid: RBAC for broad access tiers, with ABAC-style ownership/context checks layered on top for specific resources.",
    code: "// RBAC: role check\nfunction canDeleteUser(actor) {\n  return actor.role === \"admin\";\n}\n\n// ABAC: attribute-based policy\nfunction canEditDocument(actor, doc) {\n  return (\n    doc.ownerId === actor.id ||\n    (actor.teamId === doc.teamId && actor.role !== \"viewer\")\n  );\n}",
    interviewQuestion:
      "Give a permission rule that RBAC alone can't express, and show how ABAC handles it.",
  },
  {
    id: "backend-rate-limiting-algorithms",
    category: "backend",
    topic: "Scaling & Performance",
    title: "Rate Limiting Algorithms: Token Bucket vs Sliding Window",
    difficulty: "Advanced",
    summary:
      "Fixed-window counters are simple but allow bursts at window boundaries; token bucket allows controlled bursts while enforcing an average rate; sliding window log/counter is more accurate but costs more memory.",
    explanation:
      "A fixed window (e.g. 'max 100 requests per minute') resets the counter every minute, which means a client could send 100 requests in the last second of one window and another 100 in the first second of the next — 200 requests in 2 seconds while technically compliant. Token bucket solves this by adding tokens to a bucket at a steady rate; each request consumes a token, and requests are rejected once the bucket is empty, allowing short bursts up to the bucket size while enforcing a long-term average rate. Sliding window log tracks exact timestamps of recent requests for perfect accuracy but uses more memory; sliding window counter approximates it cheaply by weighting the previous and current fixed windows. Redis is the standard place to implement distributed rate limiting since it needs to be consistent across multiple server instances.",
    code: "-- Token bucket in Redis (simplified, using INCR + TTL as a rough limiter)\nlocal key = \"ratelimit:\" .. user_id\nlocal current = redis.call(\"INCR\", key)\nif current == 1 then\n  redis.call(\"EXPIRE\", key, 60)\nend\nif current > 100 then\n  return \"REJECTED\"\nend\nreturn \"ALLOWED\"",
    interviewQuestion:
      "Why does a naive fixed-window rate limiter allow twice the intended request rate at window boundaries, and how does token bucket fix it?",
  },
  {
    id: "backend-caching-layers",
    category: "backend",
    topic: "Scaling & Performance",
    title: "Where to Cache: CDN, Application, and Database Layers",
    difficulty: "Intermediate",
    summary:
      "Caching closer to the user is faster but staler; a CDN caches static/public responses at the edge, an application-layer cache (Redis) caches computed results, and database-layer caching (query cache, buffer pool) speeds up repeated reads.",
    explanation:
      "A CDN caches whole HTTP responses at edge locations near the user, ideal for static assets and public, cacheable API responses controlled via `Cache-Control` headers — it reduces both latency and load on your origin server entirely. An application-layer cache like Redis sits between your API and database, storing computed or frequently-read data (like a user's profile or a rendered page fragment) with an explicit TTL and invalidation strategy — this is where most custom caching logic lives. The database itself also caches: PostgreSQL's buffer pool keeps hot pages in memory, and query results can be cached at the driver or ORM level. The general rule for scaling to high request volume is to avoid hitting the database at all for the same read repeatedly — each cache layer you add removes load from everything behind it, which is exactly what lets a modest number of database instances serve tens of thousands of requests per second.",
    code: "async function getUserProfile(userId) {\n  const cacheKey = `user:${userId}:profile`;\n  const cached = await redis.get(cacheKey);\n  if (cached) return JSON.parse(cached);\n\n  const profile = await db.query(\"SELECT * FROM users WHERE id = $1\", [userId]);\n  await redis.set(cacheKey, JSON.stringify(profile), \"EX\", 300); // 5 min TTL\n  return profile;\n}\n\n// Invalidate on write\nasync function updateUserProfile(userId, data) {\n  await db.query(\"UPDATE users SET ... WHERE id = $1\", [userId]);\n  await redis.del(`user:${userId}:profile`);\n}",
    interviewQuestion:
      "Design a caching strategy for a user profile endpoint that's read 10,000 times/sec but updated rarely.",
  },
  {
    id: "backend-scaling-to-10k-rps",
    category: "backend",
    topic: "Scaling & Performance",
    title: "Architecture Walkthrough: Handling 10,000 Requests/Second",
    difficulty: "Advanced",
    summary:
      "Reaching 10k req/sec reliably comes from horizontal scaling behind a load balancer, aggressive caching to keep the database out of the hot path, async non-blocking I/O, and connection pooling — not from a single bigger server.",
    explanation:
      "Start with a load balancer distributing traffic across multiple stateless application server instances, so you scale horizontally by adding instances rather than hoping one machine gets fast enough. Each instance should use async/non-blocking I/O (Node's event loop, Python's asyncio, or a thread pool sized to the workload) so a slow database call doesn't block other requests. Put a cache (Redis) in front of the database for hot reads, and use a CDN for anything cacheable at the edge. Use connection pooling (like PgBouncer for Postgres) so thousands of application connections don't overwhelm the database's own connection limit. For writes that don't need to be synchronous, push them onto a message queue and process asynchronously rather than making the client wait. Read replicas offload read traffic from the primary database. Finally, everything needs health checks and auto-scaling so the system adds capacity automatically as load increases, and monitoring/alerting so you find bottlenecks before users do.",
    code: "Client\n  → CDN (static/cacheable)\n  → Load Balancer (round-robin / least-connections)\n     → App Server 1 (async, stateless)\n     → App Server 2\n     → App Server N  ← auto-scaled based on CPU/latency\n         → Redis cache (hot reads)\n         → Connection pool (PgBouncer)\n            → Primary DB (writes)\n            → Read Replica 1, 2, 3 (reads)\n         → Message Queue (async writes, emails, jobs)",
    interviewQuestion:
      "A single Node.js server tops out around 1,000-2,000 req/sec for your API. Walk through the architecture changes needed to reliably handle 10,000 req/sec.",
  },
  {
    id: "backend-connection-pooling",
    category: "backend",
    topic: "Scaling & Performance",
    title: "Why Connection Pooling Matters",
    difficulty: "Intermediate",
    summary:
      "Opening a new database connection per request is expensive (TCP handshake, auth, resource allocation on the DB) and databases have hard connection limits — a pool reuses a fixed set of connections across requests.",
    explanation:
      "Every database connection consumes memory and file descriptors on the database server, and most databases cap concurrent connections in the low thousands or less. If each of 50 application server instances opens 20 raw connections per incoming request under load, you can exhaust the database's connection limit almost instantly, causing new connections to be refused entirely. A connection pool maintains a fixed number of already-established, authenticated connections and hands them out to code on request, returning them to the pool when done instead of closing them — eliminating the per-request handshake cost and keeping total connections bounded and predictable. At very high scale, a dedicated pooler like PgBouncer sits between many application instances and the database, multiplexing thousands of application-side connections onto a much smaller number of real database connections.",
    code: "// Without pooling: new connection per request (slow, dangerous at scale)\napp.get(\"/users/:id\", async (req, res) => {\n  const client = new Client(); // new TCP connection + auth every time\n  await client.connect();\n  const result = await client.query(\"SELECT * FROM users WHERE id = $1\", [req.params.id]);\n  await client.end();\n  res.json(result.rows[0]);\n});\n\n// With pooling: connections are reused\nconst pool = new Pool({ max: 20 }); // capped, shared across all requests\napp.get(\"/users/:id\", async (req, res) => {\n  const result = await pool.query(\"SELECT * FROM users WHERE id = $1\", [req.params.id]);\n  res.json(result.rows[0]);\n});",
    interviewQuestion:
      "Your API works fine in testing but starts throwing 'too many connections' errors from the database under production load. What's likely wrong and how do you fix it?",
  },
  {
    id: "backend-microservices-vs-monolith",
    category: "backend",
    topic: "Architecture",
    title: "Monolith vs Microservices: The Real Tradeoff",
    difficulty: "Advanced",
    summary:
      "A monolith is simpler to develop, test, and deploy as one unit but scales and fails as a whole; microservices let teams scale and deploy independently at the cost of network calls, distributed debugging, and operational complexity.",
    explanation:
      "A well-structured monolith is a single deployable application where modules communicate via in-process function calls — no network latency, no partial-failure handling, easy local debugging, and a single deployment pipeline. It struggles when different parts of the system need to scale very differently (a checkout service under heavy load shouldn't force scaling an internal reporting module too), or when many independent teams need to ship without coordinating a single release. Microservices split the system into independently deployable services communicating over the network (HTTP/gRPC/messaging), so each can scale, deploy, and even use a different tech stack independently — but every internal function call becomes a network call that can fail, time out, or be slow, requiring retries, circuit breakers, distributed tracing, and careful API versioning between services. Most successful systems start as a monolith and extract services only when there's a clear, measured reason (team scaling boundary or genuinely different scaling needs), not by default.",
    code: "// Monolith: in-process call, no network involved\nfunction placeOrder(cart) {\n  const total = pricingModule.calculateTotal(cart);\n  inventoryModule.reserveStock(cart.items);\n  return ordersModule.createOrder(cart, total);\n}\n\n// Microservices: same logic, now over the network\nasync function placeOrder(cart) {\n  const total = await pricingService.post(\"/calculate\", cart);\n  await inventoryService.post(\"/reserve\", cart.items); // can fail independently!\n  return ordersService.post(\"/orders\", { cart, total });\n}",
    interviewQuestion:
      "What specific, measurable problem should you have before splitting a monolith into microservices?",
  },
  {
    id: "backend-message-queues-fundamentals",
    category: "backend",
    topic: "Architecture",
    title: "Message Queues: Decoupling with Kafka, RabbitMQ, and SQS",
    difficulty: "Advanced",
    summary:
      "Message queues let a producer hand off work without waiting for it to complete, decoupling services in time and allowing consumers to process at their own pace — essential for async workloads like emails, image processing, or event-driven architectures.",
    explanation:
      "Instead of a service calling another service synchronously and waiting for a response, it publishes a message to a queue or topic and moves on; one or more consumers process messages independently, at their own speed, and can be scaled up or down without the producer knowing or caring. RabbitMQ is a traditional message broker with exchanges routing messages to queues, good for task queues and request/reply patterns. Kafka is a distributed log where messages are appended to partitioned topics and retained for a configurable time, allowing multiple independent consumer groups to replay the same stream — better suited for event streaming and high-throughput pipelines. SQS (AWS) is a simpler managed queue, good for straightforward task offloading without needing Kafka's stream-replay semantics. The tradeoff for all of them is added complexity: messages can be delivered more than once (requiring idempotent consumers), ordering isn't always guaranteed, and debugging a message that got lost or stuck requires queue-specific tooling.",
    code: "// Producer: hand off work instead of blocking the request\napp.post(\"/signup\", async (req, res) => {\n  const user = await createUser(req.body);\n  await queue.publish(\"user.created\", { userId: user.id, email: user.email });\n  res.status(201).json(user); // responds immediately, doesn't wait for email\n});\n\n// Consumer: processes independently, can retry on failure\nqueue.subscribe(\"user.created\", async (msg) => {\n  await sendWelcomeEmail(msg.email); // if this fails, message can be retried\n});",
    interviewQuestion:
      "Your signup endpoint got slow because it sends a welcome email synchronously before responding. How would a message queue fix this, and what new problem does it introduce?",
  },
  {
    id: "backend-circuit-breaker-pattern",
    category: "backend",
    topic: "Architecture",
    title: "Circuit Breakers and Retries with Backoff",
    difficulty: "Advanced",
    summary:
      "A circuit breaker stops calling a failing downstream service after repeated failures, giving it time to recover instead of piling on more requests; retries with exponential backoff avoid hammering a struggling service immediately after a failure.",
    explanation:
      "When a downstream service starts failing or timing out, naive retries from every caller can make things worse — a struggling database gets hit with even more connection attempts right when it needs relief. A circuit breaker tracks failure rates; after a threshold, it 'opens' and fails fast for a cooldown period without even attempting the call, then periodically allows a test request through ('half-open') to check if the dependency has recovered. Combined with exponential backoff (waiting progressively longer between retries: 1s, 2s, 4s, 8s...) and jitter (randomizing the wait slightly so many clients don't retry in lockstep), this prevents cascading failures where one slow service takes down everything that depends on it. This pattern is essential in microservices architectures where a single service being slow can otherwise ripple through the entire call chain.",
    code: "// Simplified circuit breaker states: closed -> open -> half-open -> closed\nclass CircuitBreaker {\n  constructor(threshold = 5, cooldownMs = 30000) {\n    this.failures = 0;\n    this.state = \"closed\";\n    this.threshold = threshold;\n    this.cooldownMs = cooldownMs;\n  }\n  async call(fn) {\n    if (this.state === \"open\") {\n      if (Date.now() < this.openedAt + this.cooldownMs) throw new Error(\"Circuit open\");\n      this.state = \"half-open\";\n    }\n    try {\n      const result = await fn();\n      this.failures = 0;\n      this.state = \"closed\";\n      return result;\n    } catch (err) {\n      this.failures++;\n      if (this.failures >= this.threshold) {\n        this.state = \"open\";\n        this.openedAt = Date.now();\n      }\n      throw err;\n    }\n  }\n}",
    interviewQuestion:
      "A downstream payment service starts timing out. Without a circuit breaker, what cascading failure could occur across your system?",
  },
  {
    id: "backend-api-versioning-strategies",
    category: "backend",
    topic: "API Design",
    title: "API Versioning Strategies",
    difficulty: "Intermediate",
    summary:
      "URL path versioning (/v1/, /v2/) is the simplest and most visible; header-based versioning keeps URLs clean but is less discoverable; whichever approach, breaking changes need a deprecation window, not an instant cutover.",
    explanation:
      "URL path versioning (`/api/v1/users`) is explicit, cache-friendly, and easy for consumers to understand, but means duplicating routes/controllers across versions. Header-based versioning (`Accept: application/vnd.example.v2+json`) keeps URLs stable but is harder to test manually and less visible in logs. Query-parameter versioning (`?version=2`) is simple but easy to forget and pollutes caching keys. Whatever the mechanism, the harder problem is process: breaking changes should be introduced as a new version while the old one keeps working, with clear deprecation notices (often via a `Sunset` or `Deprecation` HTTP header) and a real timeline before the old version is removed, since external clients can't all upgrade instantly. Non-breaking changes (adding a new optional field) generally don't need a new version at all — only removing/renaming fields or changing behavior does.",
    code: "// URL path versioning — simplest, most common for public APIs\nGET /api/v1/users/42   // old shape: { name: \"Alice Smith\" }\nGET /api/v2/users/42   // new shape: { firstName: \"Alice\", lastName: \"Smith\" }\n\n// Signal deprecation before removal\nHTTP/1.1 200 OK\nDeprecation: true\nSunset: Sat, 01 Aug 2026 00:00:00 GMT\nLink: <https://api.example.com/docs/migrate-v2>; rel=\"deprecation\"",
    interviewQuestion:
      "You need to rename a field in your API response. Does that require a new API version? What if you're just adding a new optional field?",
  },
  {
    id: "backend-idempotency-keys",
    category: "backend",
    topic: "API Design",
    title: "Idempotency Keys for Safe Retries",
    difficulty: "Advanced",
    summary:
      "An idempotency key is a client-generated unique ID sent with a non-idempotent request (like a payment) so the server can detect and safely ignore duplicate retries caused by network failures.",
    explanation:
      "If a client calls `POST /payments` and the network times out before the response arrives, the client doesn't know whether the payment succeeded — retrying blindly risks charging twice. With idempotency keys, the client generates a unique key (usually a UUID) per logical operation and sends it in a header; the server stores the key alongside the result of the first successful request. If the same key arrives again, the server returns the stored result instead of re-executing the operation, making the retry safe regardless of how many times it happens. This is standard practice for payment APIs (Stripe popularized the pattern) and any endpoint that creates a resource with real-world side effects. The key must be stored with an expiry (so storage doesn't grow forever) and scoped per-endpoint or per-user to avoid collisions.",
    code: "async function handlePayment(req, res) {\n  const key = req.headers[\"idempotency-key\"];\n  const existing = await db.idempotencyKeys.findOne({ key });\n  if (existing) return res.status(existing.status).json(existing.body);\n\n  const result = await chargeCard(req.body);\n  await db.idempotencyKeys.insertOne({\n    key, status: 201, body: result, createdAt: new Date(),\n  });\n  res.status(201).json(result);\n}",
    interviewQuestion:
      "A client's network drops right after they submit a payment, so they retry. Without idempotency keys, what can go wrong, and how do idempotency keys prevent it?",
  },
  {
    id: "backend-pagination-strategies",
    category: "backend",
    topic: "API Design",
    title: "Offset vs Cursor-Based Pagination",
    difficulty: "Intermediate",
    summary:
      "Offset pagination (page/limit) is simple but degrades in performance on large tables and can skip or duplicate rows if data changes between pages; cursor pagination uses a stable pointer and stays fast and consistent at any depth.",
    explanation:
      "Offset pagination (`?page=500&limit=20`) requires the database to scan and discard the first 9,980 rows before returning the next 20, which gets slower the deeper you paginate on large tables. It's also unstable: if a row is inserted or deleted while a user is paging through results, they can see duplicates or miss items entirely because the 'offset' shifts under them. Cursor-based pagination instead uses a stable reference point — typically the last seen row's sort key (like an ID or timestamp) — and asks for 'the next 20 rows after this cursor,' which the database can serve efficiently via an index regardless of how deep you are, and stays consistent even as data changes, since it's not counting from the start each time. The tradeoff is that cursor pagination can't jump to an arbitrary page number, which is fine for infinite-scroll UIs but awkward for 'jump to page 47' UIs.",
    code: "-- Offset pagination: gets slower as page number grows\nSELECT * FROM posts ORDER BY created_at DESC LIMIT 20 OFFSET 9980;\n\n-- Cursor pagination: fast at any depth, uses the index directly\nSELECT * FROM posts\nWHERE created_at < '2026-06-01T10:00:00Z'  -- the cursor\nORDER BY created_at DESC\nLIMIT 20;",
    interviewQuestion:
      "Why does offset pagination get slower the deeper a user pages, and why might they see a duplicate item while doing so?",
  },
  {
    id: "backend-webhooks-explained",
    category: "backend",
    topic: "API Design",
    title: "Webhooks: Inverting the API Call Direction",
    difficulty: "Intermediate",
    summary:
      "A webhook is your server registering a URL with a third-party service so that service can push an event to you when something happens, instead of you polling their API repeatedly to check for changes.",
    explanation:
      "Polling (repeatedly calling `GET /orders/42/status` every few seconds) wastes requests and adds latency between the event happening and you noticing. Webhooks flip the direction: you register an endpoint URL with the provider (e.g. a payment processor), and when a relevant event occurs (payment succeeded), the provider sends an HTTP POST to your URL with the event data. Your endpoint must respond quickly (ideally under a few seconds) and with a 2xx status to acknowledge receipt — providers typically retry with backoff if they don't get one. Because your endpoint is a public URL that anyone could POST to, webhook payloads should be verified using a signature the provider includes (usually HMAC of the payload with a shared secret), and processing should be idempotent since the same event can be delivered more than once.",
    code: "// Verifying a webhook signature (common HMAC pattern, e.g. Stripe-style)\napp.post(\"/webhooks/payment\", express.raw({ type: \"application/json\" }), (req, res) => {\n  const signature = req.headers[\"x-signature\"];\n  const expected = crypto\n    .createHmac(\"sha256\", process.env.WEBHOOK_SECRET)\n    .update(req.body)\n    .digest(\"hex\");\n\n  if (signature !== expected) return res.status(401).send(\"Invalid signature\");\n\n  const event = JSON.parse(req.body);\n  // process idempotently — this event ID might arrive more than once\n  handleEventOnce(event.id, event);\n  res.status(200).send(\"OK\");\n});",
    interviewQuestion:
      "Why must a webhook handler verify a signature, and why must it be idempotent?",
  },
  {
    id: "backend-graphql-vs-rest",
    category: "backend",
    topic: "API Design",
    title: "GraphQL vs REST: When Each Wins",
    difficulty: "Advanced",
    summary:
      "REST exposes fixed-shape resources per endpoint, which can lead to over-fetching or under-fetching; GraphQL lets clients request exactly the fields they need in one query, at the cost of caching simplicity and query-complexity risk.",
    explanation:
      "A REST endpoint like `GET /users/42` returns a fixed shape, so a mobile client that only needs the user's name still downloads the full object (over-fetching), and a screen needing both user and their recent orders needs two round trips (under-fetching, solved with REST only via ad-hoc 'include' params). GraphQL exposes a single endpoint with a typed schema, and clients specify exactly the fields and nested relations they want in one request, eliminating both problems. The cost: HTTP-level caching (which relies on distinct URLs) doesn't work the same way since everything goes through one endpoint via POST, so caching has to happen at the application/query level instead. A client can also craft an expensive, deeply nested query that's costly to resolve, so servers need query complexity limits and depth limiting. REST remains simpler for straightforward CRUD APIs and public APIs where HTTP caching matters; GraphQL shines for complex, deeply-nested UIs (like a social feed) with many different client shapes (web vs mobile) needing different data from the same backend.",
    code: "# GraphQL: one request, exact fields needed\nquery {\n  user(id: 42) {\n    name\n    recentOrders(limit: 3) {\n      id\n      total\n    }\n  }\n}\n\n# vs REST: two separate requests for the same UI\nGET /users/42\nGET /users/42/orders?limit=3",
    interviewQuestion:
      "Your mobile app and web app need different subsets of the same data on different screens. How does GraphQL help versus building two separate REST endpoints?",
  },
  {
    id: "backend-observability-three-pillars",
    category: "backend",
    topic: "Deployment & Observability",
    title: "The Three Pillars: Logs, Metrics, and Traces",
    difficulty: "Advanced",
    summary:
      "Logs record discrete events with context; metrics are aggregated numeric measurements over time (like request rate or error rate); traces follow a single request's journey across multiple services — together they answer 'what happened,' 'how much/often,' and 'where did it slow down.'",
    explanation:
      "Structured logs (JSON, not plain text) capture what happened at a specific point — an error, a warning, a business event — and are searched/filtered after the fact; they're detailed but expensive to query at scale and easy to over-produce. Metrics are numeric time-series data — request count, p95 latency, error rate, queue depth — cheap to store and graph, ideal for dashboards and alerting ('page me if error rate exceeds 1% for 5 minutes'), but they don't tell you why. Distributed tracing assigns a trace ID to a request as it enters the system and propagates it through every service call, so you can see the full path and timing breakdown across a microservices architecture — essential for finding which of 8 downstream calls is actually causing a slow response. Real production systems need all three: metrics for alerting, traces for finding where in the call chain a problem is, and logs for the detailed 'why' once you've narrowed it down.",
    code: "// A request carries a trace ID through every service it touches\napp.use((req, res, next) => {\n  req.traceId = req.headers[\"x-trace-id\"] || crypto.randomUUID();\n  res.set(\"x-trace-id\", req.traceId);\n  next();\n});\n\n// Structured log includes the trace ID for correlation\nlogger.info({ traceId: req.traceId, event: \"order.created\", orderId, userId });\n\n// Metric: cheap, aggregated, good for alerting\nmetrics.increment(\"orders.created.count\");\nmetrics.timing(\"orders.create.duration_ms\", Date.now() - start);",
    interviewQuestion:
      "A specific endpoint's p95 latency spiked, but you don't know why. Walk through how you'd use metrics, traces, and logs together to find the root cause.",
  },
  {
    id: "backend-health-checks-readiness",
    category: "backend",
    topic: "Deployment & Observability",
    title: "Liveness vs Readiness Health Checks",
    difficulty: "Intermediate",
    summary:
      "A liveness check answers 'is this process alive and should be restarted if not'; a readiness check answers 'is this instance ready to receive traffic right now' — conflating the two causes bad restarts or traffic sent to unready instances.",
    explanation:
      "A liveness probe should only fail if the process is truly stuck or deadlocked and needs a restart — if it fails too eagerly (e.g. because a downstream dependency is temporarily slow), the orchestrator (Kubernetes, load balancer) will restart a perfectly healthy process, which doesn't fix anything and adds churn. A readiness probe should fail whenever the instance genuinely can't serve traffic right now — during startup before it's finished loading config or warming a cache, or if a critical downstream dependency is unreachable — so the load balancer temporarily stops routing traffic to it without killing the process, and resumes automatically once readiness passes again. Getting this distinction wrong is a common production incident: services get restarted in a loop during a transient database blip because liveness (not readiness) was checking the database connection.",
    code: "// Liveness: only fails if the process itself is broken\napp.get(\"/healthz/live\", (req, res) => res.status(200).send(\"OK\"));\n\n// Readiness: fails if dependencies aren't available right now\napp.get(\"/healthz/ready\", async (req, res) => {\n  try {\n    await db.query(\"SELECT 1\");\n    await redis.ping();\n    res.status(200).send(\"READY\");\n  } catch {\n    res.status(503).send(\"NOT READY\"); // stop routing traffic here, don't restart\n  }\n});",
    interviewQuestion:
      "Your service keeps getting restarted whenever the database has a brief network blip, even though the app itself is fine. What's misconfigured?",
  },
  {
    id: "backend-blue-green-canary-deploys",
    category: "backend",
    topic: "Deployment & Observability",
    title: "Blue-Green and Canary Deployments",
    difficulty: "Advanced",
    summary:
      "Blue-green deployment runs two full identical environments and switches traffic all at once with instant rollback; canary deployment gradually shifts a small percentage of traffic to the new version, catching problems before they affect everyone.",
    explanation:
      "Blue-green keeps two complete production environments ('blue' currently live, 'green' being the new version); once green is verified, a router/load balancer switches all traffic to it instantly, and if something's wrong, switching back to blue is just as instant, since blue never stopped running. The cost is running double the infrastructure during the transition. Canary deployment instead routes a small percentage of real traffic (say 5%) to the new version while the rest stays on the old one, watching error rates and latency closely; if the canary looks healthy, traffic is gradually increased to 100%, and if it doesn't, only a small fraction of users were ever affected and rollback is cheap. Canary requires more sophisticated traffic-splitting infrastructure and good automated metrics to make a go/no-go decision, but limits the blast radius of a bad deploy far better than an all-or-nothing switch.",
    code: "# Canary via weighted routing (conceptual, e.g. with a service mesh)\nrouting:\n  - version: v1 (stable)\n    weight: 95\n  - version: v2 (canary)\n    weight: 5\n\n# Watch v2's error rate and latency for N minutes\n# If healthy: shift to 25% -> 50% -> 100%\n# If unhealthy: shift back to 0% immediately, investigate",
    interviewQuestion:
      "What's the key operational tradeoff between blue-green and canary deployments, and when would you pick one over the other?",
  },
  {
    id: "backend-graceful-shutdown",
    category: "backend",
    topic: "Deployment & Observability",
    title: "Graceful Shutdown and Zero-Downtime Deploys",
    difficulty: "Advanced",
    summary:
      "When an instance is being terminated during a deploy or scale-down, it must stop accepting new requests, finish in-flight ones, and close connections cleanly — otherwise deploys drop active user requests.",
    explanation:
      "When an orchestrator sends a termination signal (like SIGTERM) to shut down an old instance during a rolling deploy, the default behavior in many frameworks is to die immediately, which can cut off requests mid-flight and drop database transactions uncleanly. A graceful shutdown handler catches that signal, tells the load balancer/orchestrator this instance is no longer ready (so no new traffic is routed to it), waits for existing in-flight requests to finish (with a timeout, since some might hang), closes database and cache connections cleanly, and only then actually exits. Combined with the orchestrator giving a grace period before force-killing the process, this is what makes rolling deployments actually zero-downtime instead of causing a trickle of failed requests on every deploy.",
    code: "let shuttingDown = false;\nconst server = app.listen(3000);\n\nprocess.on(\"SIGTERM\", async () => {\n  shuttingDown = true; // readiness check starts failing now\n  server.close(() => console.log(\"No longer accepting new connections\"));\n\n  await waitForInFlightRequestsToFinish({ timeoutMs: 25000 });\n  await db.end();\n  await redis.quit();\n  process.exit(0);\n});\n\napp.get(\"/healthz/ready\", (req, res) => {\n  res.status(shuttingDown ? 503 : 200).send();\n});",
    interviewQuestion:
      "Users occasionally see a failed request during your deploys, even though the deploy itself 'succeeds.' What's likely missing?",
  },
  {
    id: "backend-secrets-management",
    category: "backend",
    topic: "Security",
    title: "Secrets Management: Beyond .env Files",
    difficulty: "Intermediate",
    summary:
      "Environment variables in a .env file are fine for local development, but production secrets (DB passwords, API keys, signing keys) need a dedicated secrets manager with access control, rotation, and audit logging.",
    explanation:
      "A `.env` file committed to git or baked into a Docker image is a common source of leaked credentials, since it sits in plaintext wherever the code goes. Dedicated secrets managers (AWS Secrets Manager, HashiCorp Vault, Google Secret Manager) store secrets encrypted at rest, inject them into the application only at runtime (via environment or a mounted file), log every access for auditing, and support automatic rotation without redeploying the application. This matters especially for database credentials and signing keys, where a leaked secret can mean full data compromise, not just a minor bug. A practical middle ground for smaller teams is at minimum: never commit `.env` to git (use `.gitignore` and a `.env.example` template), use different secrets per environment, and restrict who has access to production secrets separately from staging/dev ones.",
    code: "# .gitignore — never commit real secrets\n.env\n.env.local\n.env.production\n\n# .env.example — committed, shows required vars without real values\nDATABASE_URL=\nJWT_SECRET=\nSTRIPE_API_KEY=\n\n# Production: fetched at runtime, not stored in the image\nconst dbPassword = await secretsManager.getSecret(\"prod/db/password\");",
    interviewQuestion:
      "What's wrong with baking production database credentials directly into a Docker image, even if the image is never made public?",
  },
  {
    id: "backend-owasp-api-security-top10",
    category: "backend",
    topic: "Security",
    title: "OWASP API Security: The Most Common Real Vulnerabilities",
    difficulty: "Advanced",
    summary:
      "Broken Object Level Authorization (BOLA) — where an API checks that a user is logged in but not that they own the specific resource they're requesting — is the single most common and most damaging real-world API vulnerability.",
    explanation:
      "BOLA happens when an endpoint like `GET /api/invoices/{id}` checks that the caller has a valid token but never checks that the invoice actually belongs to that caller, letting any authenticated user read or modify any other user's data just by changing the ID in the URL. Related issues include broken authentication (weak token generation, no rate limiting on login), excessive data exposure (returning entire database objects including internal fields the client never needed), lack of rate limiting (allowing brute-force or scraping), and mass assignment (blindly trusting a request body to set fields like `role: admin` because the API bound the whole object to the request). The fix for BOLA specifically is always checking resource ownership/permission at the object level, not just authentication at the endpoint level — 'is this token valid' and 'does this token's owner have access to this specific resource' are two different checks, and skipping the second is what causes most real API breaches.",
    code: "// VULNERABLE: checks authentication, not ownership\napp.get(\"/api/invoices/:id\", authenticate, async (req, res) => {\n  const invoice = await db.invoices.findById(req.params.id);\n  res.json(invoice); // any logged-in user can read ANY invoice by ID\n});\n\n// FIXED: checks object-level ownership too\napp.get(\"/api/invoices/:id\", authenticate, async (req, res) => {\n  const invoice = await db.invoices.findById(req.params.id);\n  if (!invoice || invoice.userId !== req.user.id) {\n    return res.status(404).send(); // 404, not 403 — don't reveal it exists\n  }\n  res.json(invoice);\n});",
    interviewQuestion:
      "What is Broken Object Level Authorization, why is it the most common API vulnerability, and how do you systematically prevent it across an entire API?",
  },
  {
    id: "backend-mass-assignment-vulnerability",
    category: "backend",
    topic: "Security",
    title: "Mass Assignment: When 'Just Bind the Body' Backfires",
    difficulty: "Advanced",
    summary:
      "Mass assignment vulnerabilities occur when an API blindly maps an entire incoming JSON body onto a database model, letting an attacker set fields (like `role` or `isVerified`) that were never meant to be client-writable.",
    explanation:
      "It's convenient to write `User.update(req.body)` and let an ORM map every key in the request body directly onto model fields — until a user sends `{ \"name\": \"Alice\", \"role\": \"admin\" }` on a profile-update endpoint and silently promotes themselves. The fix is an explicit allowlist of which fields a given endpoint is permitted to set from client input, rather than trusting the entire body — schema validation libraries (Zod, Pydantic, Joi) with strict, endpoint-specific schemas naturally enforce this if you define exactly the fields you expect rather than a generic 'any object' type. This is especially dangerous on endpoints that reuse a single generic model schema across create, update, and admin operations without different validation per context.",
    code: "// VULNERABLE: entire request body is trusted\napp.patch(\"/api/profile\", authenticate, async (req, res) => {\n  await db.users.update(req.user.id, req.body); // attacker sends { role: \"admin\" }\n  res.json({ ok: true });\n});\n\n// FIXED: explicit allowlist via a strict schema\nconst ProfileUpdateSchema = z.object({\n  name: z.string().max(100),\n  bio: z.string().max(500).optional(),\n}).strict(); // rejects any extra/unexpected fields\n\napp.patch(\"/api/profile\", authenticate, async (req, res) => {\n  const data = ProfileUpdateSchema.parse(req.body); // role is stripped/rejected\n  await db.users.update(req.user.id, data);\n  res.json({ ok: true });\n});",
    interviewQuestion:
      "A user profile update endpoint lets a user set their own name and bio. How could a mass assignment vulnerability let them make themselves an admin, and how do you prevent it?",
  },
  {
    id: "backend-input-validation-vs-sanitization",
    category: "backend",
    topic: "Security",
    title: "Input Validation vs Sanitization: Different Jobs",
    difficulty: "Intermediate",
    summary:
      "Validation rejects input that doesn't meet expected rules (reject, don't guess); sanitization transforms input to make it safe for a specific context (like escaping HTML) — conflating them leads to either silently-corrupted data or missed attacks.",
    explanation:
      "Validation is a gate: does this email look like an email, is this age a positive integer under 150, is this required field present? If not, reject the request with a clear error — never try to silently 'fix' invalid input, since guessing what the user meant can introduce subtle bugs or security holes. Sanitization is different: it's about neutralizing dangerous content for a specific output context, like escaping `<script>` tags before rendering user content as HTML (preventing XSS), or parameterizing a value before it reaches a SQL query (preventing SQL injection) — sanitization for one context (HTML) doesn't make data safe for a different context (a shell command or a SQL query each need their own escaping). The safest general pattern is: validate strictly at the API boundary, store the raw validated value, and sanitize/escape only at the point of use for a specific output context (HTML template, SQL query, shell command), rather than trying to sanitize everything upfront for contexts you may not use yet.",
    code: "// Validation: reject invalid input outright\nconst schema = z.object({\n  email: z.string().email(),\n  age: z.number().int().min(0).max(150),\n});\nconst data = schema.parse(req.body); // throws if invalid — no guessing\n\n// Sanitization: context-specific, applied at the point of use\nconst safeHtml = escapeHtml(comment.text); // for rendering in HTML\nconst query = \"SELECT * FROM users WHERE id = $1\"; // parameterized, not string-concatenated — the DB driver handles SQL-safety",
    interviewQuestion:
      "Why isn't sanitizing input once at the API boundary enough to prevent both XSS and SQL injection?",
  },
  {
    id: "backend-feature-flags",
    category: "backend",
    topic: "Deployment & Observability",
    title: "Feature Flags: Decoupling Deploy from Release",
    difficulty: "Intermediate",
    summary:
      "A feature flag wraps new code behind a runtime toggle, letting you deploy code to production without activating it — separating 'is this code live' from 'is this feature turned on' so releases become instant and reversible.",
    explanation:
      "Without feature flags, shipping a risky change means the deploy itself is the release — if something's wrong, fixing it requires another deploy (slow) or a rollback (which reverts everything, including unrelated fixes bundled in the same deploy). With a feature flag, the new code path ships disabled by default; turning it on for 1% of users, then 100%, then removing the flag once stable, is just a config change, not a deploy, making rollout and rollback nearly instant. Flags are also how many teams do targeted rollouts (enable for internal staff first, or for users on a specific plan) and A/B testing (route a percentage of users to each variant and compare metrics). The operational cost is flag sprawl — old flags left in the code long after a feature is fully rolled out accumulate as dead complexity and need to be cleaned up deliberately.",
    code: "if (await featureFlags.isEnabled(\"new-checkout-flow\", { userId: user.id })) {\n  return renderNewCheckout(cart);\n}\nreturn renderLegacyCheckout(cart);\n\n// Rollout is a config change, not a deploy:\n// { flag: \"new-checkout-flow\", rolloutPercent: 5 }  → later → { rolloutPercent: 100 }",
    interviewQuestion:
      "Why does a feature flag make a bad release cheaper to fix than a rollback, and what's the maintenance cost of using them heavily?",
  },
  {
    id: "backend-crud-to-production-checklist",
    category: "backend",
    topic: "Architecture",
    title: "From a Basic CRUD API to Production-Ready",
    difficulty: "Intermediate",
    summary:
      "A tutorial CRUD API (routes + a database) is a small fraction of what a production API needs — validation, auth, error handling, logging, rate limiting, and observability are what actually make it operable.",
    explanation:
      "A basic CRUD endpoint — accept JSON, write to a database, return JSON — works for a demo but is missing nearly everything needed for real traffic: input validation (reject malformed data before it reaches the database), authentication and per-resource authorization (not just 'is this user logged in' but 'can this user touch this specific resource'), consistent error responses (a shape the client can reliably parse, not a raw stack trace), structured logging with request correlation IDs, rate limiting to survive abuse or bugs in client code, database connection pooling, health checks for the orchestrator, and metrics/alerting so problems are caught before users report them. None of this is optional at meaningful scale — it's the difference between code that works in a demo and a system that stays up under real, messy traffic with real, sometimes malicious clients.",
    code: "// Tutorial version\napp.post(\"/users\", async (req, res) => {\n  const user = await db.users.create(req.body);\n  res.json(user);\n});\n\n// Production version — same core idea, everything else added\napp.post(\"/users\",\n  rateLimiter,\n  authenticate,\n  validate(CreateUserSchema),\n  async (req, res, next) => {\n    try {\n      const user = await db.users.create(req.validatedBody);\n      logger.info({ traceId: req.traceId, event: \"user.created\", userId: user.id });\n      metrics.increment(\"users.created\");\n      res.status(201).location(`/users/${user.id}`).json(sanitizeForResponse(user));\n    } catch (err) {\n      next(err); // centralized error handler formats a consistent error response\n    }\n  }\n);",
    interviewQuestion:
      "List everything missing between a tutorial CRUD endpoint and one you'd trust in production, and explain why each one matters.",
  },
  {
    id: "backend-load-balancing-algorithms",
    category: "backend",
    topic: "Scaling & Performance",
    title: "Load Balancing Algorithms: Round Robin vs Least Connections",
    difficulty: "Intermediate",
    summary:
      "Round robin distributes requests evenly in sequence regardless of server load; least-connections routes to whichever server currently has the fewest active requests, which handles uneven request durations much better.",
    explanation:
      "Round robin is simple and works well when requests are roughly uniform in cost, but if one request happens to be expensive (a slow report generation) while others are cheap, round robin keeps sending new requests to that same busy server on its next turn regardless, creating hot spots. Least-connections tracks how many requests each backend is currently handling and routes new ones to whichever has the fewest, naturally avoiding servers that are bogged down with slow requests. Weighted variants of either let you account for servers with different capacity (a bigger instance gets proportionally more traffic). IP-hash routing sends the same client consistently to the same backend, useful for session affinity when sessions aren't stored in a shared store, but it can create imbalance if one client generates disproportionate traffic. There's no universally 'best' algorithm — it depends on whether request cost is uniform and whether session stickiness is required.",
    code: "# Round robin (nginx example)\nupstream backend {\n  server app1.internal;\n  server app2.internal;\n  server app3.internal;\n}\n\n# Least connections — better when request durations vary a lot\nupstream backend {\n  least_conn;\n  server app1.internal;\n  server app2.internal;\n  server app3.internal;\n}",
    interviewQuestion:
      "Round robin load balancing is causing uneven load — one server is consistently busier. Why might that happen, and what algorithm would you switch to?",
  },
  {
    id: "backend-database-per-service-pattern",
    category: "backend",
    topic: "Architecture",
    title: "Database-per-Service and Distributed Data Consistency",
    difficulty: "Advanced",
    summary:
      "In microservices, each service typically owns its own database so services can evolve schemas independently — but this means a single business transaction spanning services can no longer rely on a single ACID database transaction.",
    explanation:
      "If Service A and Service B share one database, they're coupled at the schema level even if they're deployed separately, defeating much of the point of microservices. Database-per-service isolates that, but a workflow like 'place an order, reserve inventory, and charge payment' now spans three services with three separate databases, so a normal SQL transaction can't wrap all of it. The Saga pattern handles this by breaking the workflow into a sequence of local transactions, each with a corresponding compensating action to undo it if a later step fails — e.g., if payment fails after inventory was reserved, a compensating 'release inventory' step runs. This trades strong consistency for eventual consistency: for a brief window, the system may be in a state where inventory is reserved but payment hasn't been confirmed, which the design has to explicitly account for rather than assume away.",
    code: "// Saga: each step has a compensating action if a later step fails\nasync function placeOrderSaga(order) {\n  await inventoryService.reserve(order.items);\n  try {\n    await paymentService.charge(order.total);\n  } catch (err) {\n    await inventoryService.release(order.items); // compensating action\n    throw err;\n  }\n  await orderService.confirm(order.id);\n}",
    interviewQuestion:
      "Why can't a workflow spanning three microservices, each with its own database, use a normal database transaction — and what pattern replaces it?",
  },
  {
    id: "backend-async-vs-sync-processing",
    category: "backend",
    topic: "Scaling & Performance",
    title: "Synchronous vs Asynchronous Request Processing",
    difficulty: "Intermediate",
    summary:
      "A synchronous endpoint makes the client wait for the entire operation to finish; an asynchronous endpoint accepts the request, does the slow work in the background, and lets the client poll or get notified when it's done.",
    explanation:
      "Some operations — generating a large report, processing a video upload, running an AI model — can take seconds to minutes, far longer than a client should reasonably hold an open HTTP connection waiting. The synchronous approach blocks the request thread/connection the whole time, which doesn't scale: a handful of slow requests can exhaust available connections or workers and start queuing up unrelated fast requests behind them. The async pattern returns immediately with a 202 Accepted and a job/task ID, does the actual work on a background worker (often via a message queue), and lets the client either poll a status endpoint or receive a webhook/websocket notification when it's done. This keeps the API responsive under load and lets the slow work scale independently (more background workers) from the API layer itself (more request-handling instances).",
    code: "// Synchronous: client waits the whole time — doesn't scale for slow work\napp.post(\"/reports/generate\", async (req, res) => {\n  const report = await generateExpensiveReport(req.body); // could take 2 minutes\n  res.json(report);\n});\n\n// Asynchronous: respond immediately, process in background\napp.post(\"/reports/generate\", async (req, res) => {\n  const jobId = await queue.enqueue(\"generate-report\", req.body);\n  res.status(202).json({ jobId, statusUrl: `/reports/jobs/${jobId}` });\n});\n\napp.get(\"/reports/jobs/:jobId\", async (req, res) => {\n  const job = await queue.getStatus(req.params.jobId);\n  res.json(job); // { status: \"processing\" } or { status: \"done\", resultUrl }\n});",
    interviewQuestion:
      "A report-generation endpoint takes 90 seconds and is timing out for clients. How would you redesign it, and what does the client-side experience become?",
  },
  {
    id: "backend-api-gateway-pattern",
    category: "backend",
    topic: "Architecture",
    title: "The API Gateway Pattern",
    difficulty: "Advanced",
    summary:
      "An API gateway is a single entry point in front of multiple backend services, handling cross-cutting concerns (auth, rate limiting, routing, logging) once instead of duplicating them in every service.",
    explanation:
      "Without a gateway, every microservice needs to independently implement authentication, rate limiting, request logging, and TLS termination, leading to duplicated logic and inconsistent behavior across services. An API gateway sits in front of all of them, terminating client connections, validating auth tokens once, applying rate limits, routing requests to the correct internal service based on path or host, and often aggregating responses from multiple services into one client-facing response (useful for mobile clients that want fewer round trips). It also gives you one place to add caching, request/response transformation, and canary/traffic-splitting logic without touching individual services. The tradeoff is that the gateway becomes a critical piece of infrastructure — if it goes down, everything behind it is unreachable — so it needs to be highly available and kept as simple/fast as possible, since every request pays its latency cost.",
    code: "Client\n  → API Gateway (auth, rate limit, routing, logging — once)\n     → /users/*    → User Service\n     → /orders/*   → Order Service\n     → /payments/* → Payment Service\n\n# Gateway config (conceptual)\nroutes:\n  - path: /api/users/*\n    service: user-service:8080\n    auth: required\n    rateLimit: 100/min",
    interviewQuestion:
      "What cross-cutting concerns does an API gateway let you avoid duplicating across every microservice, and what new single point of failure does it introduce?",
  },
  {
    id: "backend-websockets-at-scale",
    category: "backend",
    topic: "Real-Time Communication",
    title: "WebSockets at Scale: The Sticky Session Problem",
    difficulty: "Advanced",
    summary:
      "A WebSocket is a long-lived, stateful connection to one specific server instance, which breaks the usual stateless-load-balancing model — scaling requires either sticky sessions or a shared pub/sub layer so a message can reach a client connected to a different instance.",
    explanation:
      "Unlike a stateless HTTP request that any server instance can handle, a WebSocket connection is held open to one specific server process for its entire lifetime, so that instance is the only one that can push a message directly to that client. This breaks naive horizontal scaling: if a message needs to reach a user whose WebSocket connection lives on instance B, but the event that triggers it is processed on instance A, instance A has no direct way to deliver it. The standard fix is a shared pub/sub layer (Redis Pub/Sub, or a dedicated system) — every instance subscribes to relevant channels, and when instance A needs to notify a user, it publishes the message; whichever instance actually holds that user's connection (subscribed to the same channel) receives it and forwards it down the socket. Load balancers also need 'sticky sessions' (routing a given client consistently to the same instance) for the WebSocket handshake and any HTTP fallback, since a WebSocket upgrade request must complete against the same server it started with.",
    code: "// Instance A: business logic triggers a notification for user 42\nawait redisPubSub.publish(\"user:42:notify\", JSON.stringify({ type: \"new_message\" }));\n\n// Every instance subscribes and checks if it holds that user's socket\nredisPubSub.subscribe(\"user:*:notify\", (channel, message) => {\n  const userId = channel.split(\":\")[1];\n  const socket = localSocketRegistry.get(userId); // only set if THIS instance holds it\n  if (socket) socket.send(message);\n});",
    interviewQuestion:
      "You have 5 server instances behind a load balancer handling WebSocket connections. A backend job needs to notify a specific user, but doesn't know which instance holds their connection. How do you solve this?",
  },
  {
    id: "backend-server-sent-events-vs-websockets",
    category: "backend",
    topic: "Real-Time Communication",
    title: "Server-Sent Events vs WebSockets vs Long Polling",
    difficulty: "Intermediate",
    summary:
      "WebSockets are full-duplex (both sides send anytime); Server-Sent Events are one-way (server to client only) over plain HTTP with automatic reconnection; long polling simulates real-time updates on top of ordinary request/response when neither is available.",
    explanation:
      "WebSockets provide a true bidirectional channel, necessary for things like chat where both client and server send messages independently and frequently — but they require a protocol upgrade and dedicated infrastructure support (load balancer/proxy configuration) that isn't always available. Server-Sent Events (SSE) work over plain HTTP, are one-directional (server pushes to client only), and have automatic reconnection built into the browser's `EventSource` API, making them a much simpler choice for use cases like live notifications, progress updates, or streaming AI responses where the client doesn't need to send data back over the same channel. Long polling — the client makes a request that the server holds open until there's new data (or a timeout), then immediately re-requests — works with zero special infrastructure over plain HTTP/1.1, at the cost of higher overhead and latency compared to the other two, and is mainly a fallback when neither WebSockets nor SSE are viable.",
    code: "// Server-Sent Events: simple one-way push, built-in browser reconnection\napp.get(\"/events\", (req, res) => {\n  res.set({ \"Content-Type\": \"text/event-stream\", \"Cache-Control\": \"no-cache\" });\n  const interval = setInterval(() => {\n    res.write(`data: ${JSON.stringify({ time: Date.now() })}\\n\\n`);\n  }, 1000);\n  req.on(\"close\", () => clearInterval(interval));\n});\n\n// Client: no manual reconnect logic needed\nconst events = new EventSource(\"/events\");\nevents.onmessage = (e) => console.log(JSON.parse(e.data));",
    interviewQuestion:
      "You need to stream an AI model's response token-by-token to the browser, but the client never needs to send anything back over that same channel. Would you use WebSockets or SSE, and why?",
  },
  {
    id: "backend-grpc-fundamentals",
    category: "backend",
    topic: "API Design",
    title: "gRPC: Binary, Typed RPC Between Services",
    difficulty: "Advanced",
    summary:
      "gRPC uses Protocol Buffers (a compact binary format) and HTTP/2 to define strongly-typed RPC contracts between services, offering much lower overhead and built-in streaming compared to JSON-over-REST for internal service-to-service communication.",
    explanation:
      "A `.proto` file defines service methods and message types in a language-neutral schema, from which code is generated for client and server stubs in many languages — this gives compile-time type safety across service boundaries that hand-written REST/JSON clients don't have. Messages are serialized as compact binary Protocol Buffers rather than verbose JSON text, reducing payload size and parsing cost, and gRPC runs over HTTP/2, enabling multiplexed requests over a single connection and native support for streaming (client streaming, server streaming, or full bidirectional streaming) without the workarounds REST needs for the same thing. The tradeoff is that gRPC is less convenient for public-facing APIs consumed directly by browsers (needs a gRPC-Web proxy) and is harder to inspect/debug ad-hoc compared to human-readable JSON, which is why it's mostly used for internal service-to-service communication rather than public APIs.",
    code: "// user.proto — defines the contract, generates typed clients/servers\nservice UserService {\n  rpc GetUser (GetUserRequest) returns (User);\n  rpc StreamUserUpdates (GetUserRequest) returns (stream UserUpdate); // server streaming\n}\n\nmessage GetUserRequest { string user_id = 1; }\nmessage User { string id = 1; string name = 2; string email = 3; }",
    interviewQuestion:
      "Why would you choose gRPC over REST for internal service-to-service calls, and why is it a worse fit for a public API consumed directly by third-party developers?",
  },
  {
    id: "backend-containerization-docker-basics",
    category: "backend",
    topic: "Deployment & Observability",
    title: "Why Backend Services Are Containerized",
    difficulty: "Intermediate",
    summary:
      "A container packages an application with its exact dependencies and runtime into an isolated, portable unit, solving the 'works on my machine' problem by making the deployment artifact identical everywhere — dev, staging, and production.",
    explanation:
      "Before containers, deploying an application meant ensuring the target server had the right language runtime version, system libraries, and configuration matching what the developer's machine had — a frequent source of environment-specific bugs. A container image bundles the application code, its dependencies, and a minimal filesystem into one artifact built once from a `Dockerfile`, which then runs identically on any machine with a container runtime, regardless of what's installed on the host OS. This also makes horizontal scaling trivial — starting 10 more identical instances is just running 10 more containers from the same image — and enables consistent CI/CD pipelines where the exact same image that passed tests in CI is what gets deployed to production, eliminating an entire class of 'it worked in staging' failures caused by environment drift.",
    code: "# Dockerfile — reproducible build, identical everywhere it runs\nFROM node:20-slim\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci --production\nCOPY . .\nEXPOSE 3000\nCMD [\"node\", \"server.js\"]\n\n# Same image, runs identically on a laptop, CI runner, or production server\ndocker build -t myapi:1.4.0 .\ndocker run -p 3000:3000 myapi:1.4.0",
    interviewQuestion:
      "How do containers eliminate the 'it works on my machine but not in production' class of bugs?",
  },
  {
    id: "backend-kubernetes-basics-for-backend",
    category: "backend",
    topic: "Deployment & Observability",
    title: "Kubernetes Basics for Backend Engineers",
    difficulty: "Advanced",
    summary:
      "Kubernetes orchestrates containers across a cluster of machines, automatically handling scheduling, restarting failed containers, scaling replica count, and rolling out deployments — the operational layer that makes running many containerized services manageable.",
    explanation:
      "A Kubernetes Pod is the smallest deployable unit (usually one container, sometimes a few tightly coupled ones); a Deployment manages a desired number of identical Pod replicas, automatically replacing any that crash or fail health checks, and handles rolling updates by gradually replacing old Pods with new ones without downtime. A Service provides a stable network identity and load-balances traffic across whichever Pods are currently healthy, since individual Pods are ephemeral and get new IPs when recreated. Horizontal Pod Autoscaling automatically adjusts replica count based on CPU/memory usage or custom metrics (like queue depth), which is how backend infrastructure scales up under load and back down when idle without manual intervention. For a backend engineer, the key mental model shift from a single server is: you don't manage individual machines or processes directly — you declare the desired state (how many replicas, what resources, what health checks), and Kubernetes continuously works to make reality match that declaration.",
    code: "# deployment.yaml — declare desired state, Kubernetes maintains it\napiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: user-api\nspec:\n  replicas: 5\n  template:\n    spec:\n      containers:\n        - name: user-api\n          image: myapi:1.4.0\n          readinessProbe:\n            httpGet: { path: /healthz/ready, port: 3000 }\n          resources:\n            requests: { cpu: \"250m\", memory: \"256Mi\" }\n---\n# Autoscale between 5 and 50 replicas based on CPU\napiVersion: autoscaling/v2\nkind: HorizontalPodAutoscaler\nspec:\n  minReplicas: 5\n  maxReplicas: 50\n  metrics:\n    - resource: { name: cpu, target: { averageUtilization: 70 } }",
    interviewQuestion:
      "How does a Kubernetes Deployment ensure your API stays at 5 running instances even if some crash, and how does it perform a zero-downtime rollout of a new version?",
  },
  {
    id: "backend-ci-cd-pipeline-for-backend",
    category: "backend",
    topic: "Deployment & Observability",
    title: "CI/CD Pipeline Anatomy for a Backend Service",
    difficulty: "Intermediate",
    summary:
      "A backend CI/CD pipeline typically runs lint/tests on every push, builds a container image on merge to main, runs it through staging, and deploys to production automatically or with a manual approval gate — turning deployment into a repeatable, low-risk process instead of a manual ritual.",
    explanation:
      "Continuous Integration (CI) runs automated checks — linting, unit tests, integration tests, security scans — on every pull request, catching problems before they merge rather than after they're in production. Continuous Deployment/Delivery (CD) takes a passing build on the main branch, builds an immutable artifact (a container image tagged with a commit hash or version), and moves it through environments — often staging first for smoke tests, then production, either automatically (continuous deployment) or behind a manual approval (continuous delivery). Database migrations need special care in this pipeline, since they can't simply be 'rolled back' the way code can — migrations should be designed to be backward-compatible with the previous code version (see expand-contract pattern) so a mid-deploy rollback of application code doesn't break against an already-migrated database. A good pipeline also includes automatic rollback triggers based on error-rate or latency metrics post-deploy, not just human observation.",
    code: "# .github/workflows/deploy.yml (conceptual)\non:\n  push:\n    branches: [main]\njobs:\n  test:\n    steps:\n      - run: npm ci\n      - run: npm run lint\n      - run: npm test\n  build-and-deploy:\n    needs: test\n    steps:\n      - run: docker build -t myapi:${{ github.sha }} .\n      - run: docker push myregistry/myapi:${{ github.sha }}\n      - run: kubectl set image deployment/user-api user-api=myregistry/myapi:${{ github.sha }}\n      - run: ./scripts/watch-error-rate-and-rollback-if-needed.sh",
    interviewQuestion:
      "Why do database migrations need special handling in a CI/CD pipeline compared to regular application code changes?",
  },
  {
    id: "backend-openapi-swagger-docs",
    category: "backend",
    topic: "API Design",
    title: "API Documentation with OpenAPI/Swagger",
    difficulty: "Intermediate",
    summary:
      "OpenAPI is a machine-readable specification format describing an API's endpoints, parameters, and response shapes — from which interactive documentation, client SDKs, and even server stubs and mock servers can all be generated automatically.",
    explanation:
      "Hand-written API documentation drifts out of sync with the actual implementation almost immediately unless there's a process forcing them to stay aligned. Frameworks like FastAPI generate an OpenAPI spec automatically from the code's type hints and Pydantic models, guaranteeing the docs always match reality; other frameworks require writing the spec by hand or via annotations. Once you have an OpenAPI spec (a YAML/JSON document describing every endpoint, its parameters, request/response schemas, and possible status codes), tools like Swagger UI render it as interactive, testable documentation, and code generators can produce typed client SDKs in many languages directly from it, eliminating manual client-writing and the bugs that come from a hand-written client drifting from the real API shape. Contract-first development flips the usual order: write the OpenAPI spec first, generate server stubs and client code from it, then implement the business logic — useful when frontend and backend teams need to work in parallel against an agreed contract before the real implementation exists.",
    code: "# OpenAPI spec fragment describing one endpoint\npaths:\n  /users/{id}:\n    get:\n      summary: Get a user by ID\n      parameters:\n        - name: id\n          in: path\n          required: true\n          schema: { type: string }\n      responses:\n        '200':\n          content:\n            application/json:\n              schema: { $ref: '#/components/schemas/User' }\n        '404':\n          description: User not found",
    interviewQuestion:
      "Why does auto-generating an OpenAPI spec from code (like FastAPI does) produce more trustworthy documentation than a hand-maintained API doc page?",
  },
  {
    id: "backend-http-caching-headers-deep-dive",
    category: "backend",
    topic: "Scaling & Performance",
    title: "HTTP Caching Headers: Cache-Control, ETag, and Conditional Requests",
    difficulty: "Advanced",
    summary:
      "Cache-Control directives tell clients and CDNs how long a response can be reused; ETags let a client ask 'has this changed since I last saw it' and get a cheap 304 Not Modified instead of re-downloading unchanged data.",
    explanation:
      "`Cache-Control: max-age=300` tells any cache (browser, CDN, proxy) it can reuse this response for 300 seconds without re-asking the server; `no-store` forbids caching entirely (for sensitive data), and `private` vs `public` controls whether shared caches like CDNs may store the response at all versus only the individual browser. An ETag is a hash or version identifier for a specific representation of a resource; on subsequent requests, the client sends `If-None-Match` with the ETag it has, and if the resource hasn't changed, the server responds with a bodyless `304 Not Modified` instead of re-sending the full payload, saving bandwidth while still requiring a round trip to check. `Last-Modified` and `If-Modified-Since` work similarly using a timestamp instead of a hash. Combining a long `max-age` with an ETag-based revalidation strategy gives the best of both: instant cache hits within the max-age window, and cheap validation (not a full re-download) once it expires but the content hasn't actually changed.",
    code: "// Server: send both cache duration and a revalidation token\napp.get(\"/api/products/:id\", (req, res) => {\n  const product = getProduct(req.params.id);\n  const etag = crypto.createHash(\"md5\").update(JSON.stringify(product)).digest(\"hex\");\n\n  if (req.headers[\"if-none-match\"] === etag) {\n    return res.status(304).end(); // client already has the current version\n  }\n  res.set({ \"Cache-Control\": \"public, max-age=60\", ETag: etag });\n  res.json(product);\n});",
    interviewQuestion:
      "What's the difference between a response being cached for max-age=300 versus revalidated with an ETag, and why would you want both together?",
  },
  {
    id: "backend-request-timeouts-bulkheading",
    category: "backend",
    topic: "Scaling & Performance",
    title: "Timeouts and Bulkheading: Containing Failure",
    difficulty: "Advanced",
    summary:
      "Without a timeout, a single slow downstream call can hold a request thread/connection open indefinitely, and without bulkheading (isolating resource pools per dependency), one slow dependency can exhaust resources needed by unrelated healthy requests.",
    explanation:
      "Every outbound call — to a database, another service, a third-party API — needs an explicit timeout; without one, a hung dependency can hold open a connection or thread indefinitely, and if enough requests pile up waiting the same way, the whole service runs out of capacity even though the actual bug is in something else entirely. Bulkheading (named after ship compartments that contain flooding to one section) takes this further by giving each downstream dependency its own isolated resource pool — a separate connection pool or thread pool per dependency — so that if the payment service's calls all hang, they exhaust only the payment-service-specific pool, and requests to unrelated dependencies (like reading the product catalog) keep working normally instead of being starved by the same shared pool. Combined with circuit breakers and sensible timeouts, bulkheading is what prevents 'one slow dependency degrades everything' failures common in interconnected systems.",
    code: "// Without a timeout: a hung downstream call can block forever\nconst data = await fetch(paymentServiceUrl); // no timeout — could hang indefinitely\n\n// With a timeout, bounded worst case\nconst data = await fetch(paymentServiceUrl, { signal: AbortSignal.timeout(3000) });\n\n// Bulkheading: separate pools per dependency\nconst paymentPool = new ConnectionPool({ max: 10 });   // payment service calls\nconst catalogPool = new ConnectionPool({ max: 20 });   // catalog service calls\n// if payment calls all hang, catalog calls are unaffected — separate pool",
    interviewQuestion:
      "One slow third-party API is causing your entire backend to become unresponsive, even for requests that don't touch that API. What two patterns would prevent this?",
  },
  {
    id: "backend-cqrs-pattern",
    category: "backend",
    topic: "Architecture",
    title: "CQRS: Separating Reads from Writes",
    difficulty: "Advanced",
    summary:
      "Command Query Responsibility Segregation splits the write model (optimized for validating and persisting changes) from the read model (optimized for fast, denormalized queries), allowing each to scale and evolve independently instead of forcing one schema to serve both well.",
    explanation:
      "A single normalized schema is good for writes (avoiding duplication, easy to keep consistent) but often requires expensive joins for reads that need denormalized, pre-aggregated views (like a dashboard showing order totals per customer per month). CQRS separates these concerns: commands (writes) go through a model focused on business rules and consistency, while queries (reads) are served from a separate, often denormalized read model kept in sync via events emitted whenever the write model changes. This lets the read side use a completely different, read-optimized data store (like a search index or a flattened cache) without compromising the write side's integrity, and lets the two scale independently — read-heavy workloads scale the read store, write-heavy workloads scale the write store. The cost is eventual consistency between the two (the read model lags slightly behind writes) and added architectural complexity that's only worth it when read and write patterns are genuinely very different and independent scaling is a real need, not a default choice for every service.",
    code: "// Command side: validates and persists, optimized for correctness\nasync function placeOrder(command) {\n  await validateInventory(command.items);\n  const order = await orderWriteDb.insert(command);\n  await eventBus.publish(\"order.placed\", order); // keeps read model in sync\n  return order;\n}\n\n// Read side: denormalized, optimized for fast queries, updated via events\neventBus.subscribe(\"order.placed\", async (order) => {\n  await orderReadDb.upsert({\n    customerId: order.customerId,\n    orderId: order.id,\n    customerName: order.customer.name, // denormalized, avoids a join\n    total: order.total,\n  });\n});",
    interviewQuestion:
      "When does the added complexity of CQRS actually pay off, versus just adding a read replica or a cache in front of a single schema?",
  },
  {
    id: "backend-event-sourcing",
    category: "backend",
    topic: "Architecture",
    title: "Event Sourcing: Storing Changes, Not Just State",
    difficulty: "Advanced",
    summary:
      "Instead of storing only the current state of a record, event sourcing stores every change as an immutable event, and current state is derived by replaying those events — giving a complete audit trail and the ability to reconstruct state at any point in time.",
    explanation:
      "A traditional model overwrites a row's `status` column directly, losing any record of how it got there. Event sourcing instead appends an immutable event for every state change (`OrderPlaced`, `OrderShipped`, `OrderCancelled`), and the current state of an order is computed by replaying all its events in order — which naturally gives a complete, tamper-evident audit log for free, and lets you answer questions like 'what did this order look like on any past date' by replaying events only up to that point. It pairs naturally with CQRS: the event stream is the write model's source of truth, and one or more read models are built by projecting (folding) those events into whatever shape queries need. The tradeoffs are real: replaying a long event history to get current state can get slow without periodic 'snapshots,' the event schema itself needs careful versioning since old events must remain interpretable forever, and it's a significant complexity increase that's usually only justified for domains where the audit trail or point-in-time reconstruction is a genuine business requirement (financial ledgers, inventory systems), not a default architecture choice.",
    code: "// Events are the source of truth, immutable, append-only\nconst events = [\n  { type: \"OrderPlaced\", orderId: 1, items: [...], at: \"2026-07-01T10:00Z\" },\n  { type: \"OrderShipped\", orderId: 1, at: \"2026-07-02T09:00Z\" },\n];\n\n// Current state is DERIVED by replaying events, not stored directly\nfunction getOrderState(events) {\n  return events.reduce((state, e) => {\n    if (e.type === \"OrderPlaced\") return { ...state, status: \"placed\", items: e.items };\n    if (e.type === \"OrderShipped\") return { ...state, status: \"shipped\" };\n    return state;\n  }, {});\n}",
    interviewQuestion:
      "What does event sourcing give you 'for free' that a traditional CRUD model doesn't, and what's the main operational cost of adopting it?",
  },
  {
    id: "backend-distributed-locking-redlock",
    category: "backend",
    topic: "Architecture",
    title: "Distributed Locking: Coordinating Across Multiple Instances",
    difficulty: "Advanced",
    summary:
      "When multiple server instances might try to do the same exclusive work at once (like a scheduled job that should only run on one instance), a distributed lock — often built on Redis — coordinates who gets to proceed, unlike an in-process lock which only works within a single instance.",
    explanation:
      "A normal mutex/lock only prevents concurrent access within a single process; once you have multiple instances of a service running (which is the point of horizontal scaling), you need coordination that spans processes and machines. A common approach is acquiring a lock as a key in Redis with `SET key value NX PX 30000` (set only if it doesn't already exist, with a 30-second expiry) — whichever instance successfully sets the key holds the lock, and the expiry prevents a crashed instance from holding the lock forever. Care is needed: the lock must be released with a check that you still hold it (comparing a unique value, not just deleting blindly) to avoid accidentally releasing a lock someone else has since acquired after your expiry passed, and the expiry duration needs to comfortably exceed the expected work duration or the lock can expire mid-task, letting a second instance start the same work concurrently. The Redlock algorithm extends this to multiple independent Redis nodes for higher fault tolerance, though it has known theoretical edge cases debated in distributed systems literature, and simpler single-Redis locking is sufficient for most non-critical use cases like preventing a duplicate scheduled job run.",
    code: "// Acquire a distributed lock: only succeeds if no one else holds it\nconst lockValue = crypto.randomUUID();\nconst acquired = await redis.set(\"lock:daily-report-job\", lockValue, \"NX\", \"PX\", 30000);\nif (!acquired) return; // another instance already running this job\n\ntry {\n  await runDailyReportJob();\n} finally {\n  // Only release if we still hold it (avoid releasing someone else's lock)\n  const current = await redis.get(\"lock:daily-report-job\");\n  if (current === lockValue) await redis.del(\"lock:daily-report-job\");\n}",
    interviewQuestion:
      "You have a scheduled job running on 5 identical server instances, but it must only execute once per interval, not 5 times. How do you coordinate that?",
  },
  {
    id: "backend-dead-letter-queues",
    category: "backend",
    topic: "Architecture",
    title: "Dead-Letter Queues and Poison Message Handling",
    difficulty: "Advanced",
    summary:
      "A message that consistently fails to process (a 'poison message') can block or endlessly retry a queue if not handled — a dead-letter queue routes it aside after a retry limit so it doesn't stall processing of every message behind it.",
    explanation:
      "If a consumer fails to process a message due to a transient issue (a brief database outage), retrying makes sense. But if a message is malformed or triggers a bug that makes it fail every single time (a 'poison message'), naive infinite retries can block the queue indefinitely — in systems that process messages in order, that one bad message stalls everything behind it forever. A dead-letter queue (DLQ) configuration automatically moves a message aside into a separate queue after it's failed a configured number of retry attempts, letting normal processing continue for everything else while the poison message sits somewhere for manual inspection or automated alerting. This is standard practice in Kafka (via retry topics + a DLQ topic), RabbitMQ (dead-letter exchanges), and SQS (redrive policies), and a production message-processing system without dead-letter handling will eventually get stuck on a message nobody anticipated.",
    code: "// SQS redrive policy (conceptual): after 3 failed attempts, move to DLQ\n{\n  \"RedrivePolicy\": {\n    \"deadLetterTargetArn\": \"arn:aws:sqs:...:orders-dlq\",\n    \"maxReceiveCount\": 3\n  }\n}\n\n// Application still needs to monitor and alert on the DLQ\n// — a message sitting there means something needs a human to look at it\nconsumer.on(\"dlq-message\", (msg) => {\n  logger.error({ event: \"poison_message\", messageId: msg.id, body: msg.body });\n  alerting.notify(\"A message landed in the DLQ and needs investigation\");\n});",
    interviewQuestion:
      "A single malformed message is causing your order-processing queue to stop making progress entirely. What should have been configured to prevent this?",
  },
  {
    id: "backend-exactly-once-vs-at-least-once",
    category: "backend",
    topic: "Architecture",
    title: "Delivery Guarantees: At-Least-Once vs Exactly-Once",
    difficulty: "Advanced",
    summary:
      "Most real-world message systems only guarantee at-least-once delivery (a message might be delivered more than once), so consumers must be idempotent — true exactly-once delivery is extremely hard to guarantee across a network and usually achieved via idempotent processing rather than the transport layer alone.",
    explanation:
      "At-most-once delivery means a message might be lost but never duplicated (fire-and-forget); at-least-once means a message is guaranteed to arrive but might arrive more than once (the consumer processed it, but the acknowledgment back to the broker was lost, so the broker redelivers it, unaware it already succeeded); exactly-once — delivered precisely one time, no more, no less — is the hardest to guarantee because it requires coordinating the message delivery and the side effect of processing it as a single atomic unit across a network, which is fundamentally difficult (this is closely related to why distributed transactions are hard). In practice, most systems (Kafka, SQS, RabbitMQ) provide at-least-once delivery, and 'effective exactly-once' behavior is achieved at the application level by making consumers idempotent — using the message's unique ID to detect and skip a message that's already been processed, so processing it twice has the same effect as processing it once.",
    code: "// At-least-once delivery + idempotent consumer = effectively exactly-once results\nasync function processPaymentEvent(event) {\n  const alreadyProcessed = await db.processedEvents.findOne({ eventId: event.id });\n  if (alreadyProcessed) return; // safe no-op if this event was already handled\n\n  await db.transaction(async (tx) => {\n    await applyPayment(event, tx);\n    await tx.processedEvents.insert({ eventId: event.id, processedAt: new Date() });\n  });\n}",
    interviewQuestion:
      "Your message queue guarantees at-least-once delivery. What does that mean could happen, and how do you make your system behave as if it were exactly-once anyway?",
  },
  {
    id: "backend-backpressure-handling",
    category: "backend",
    topic: "Scaling & Performance",
    title: "Backpressure: What Happens When Producers Outpace Consumers",
    difficulty: "Advanced",
    summary:
      "Backpressure is a strategy for handling the case where data or requests arrive faster than they can be processed — options include buffering (with limits), dropping, or signaling the producer to slow down, but not any of them being handled at all leads to unbounded memory growth and eventual crash.",
    explanation:
      "If a fast producer (a burst of incoming requests, or a fast upstream service) sends data faster than a consumer can process it, and there's no strategy for this, the excess typically piles up in an in-memory buffer or queue that grows unbounded until the process runs out of memory and crashes — a much worse outcome than handling the overload gracefully. Options include bounded buffering (queue up to a limit, then apply one of the strategies below), load shedding (reject or drop excess requests/messages once a threshold is hit, prioritizing keeping the system alive for the requests it can handle), and true backpressure signaling (telling the producer to slow down or pause, which Node.js streams and reactive programming libraries support natively via pause/resume semantics). Message queues naturally provide a form of backpressure by letting messages sit in the queue rather than forcing the consumer to keep up in real time, decoupling the rates entirely as long as the queue itself doesn't grow unbounded either.",
    code: "// Without backpressure: unbounded queue growth under load spikes\nconst queue = [];\nincomingRequests.on(\"data\", (req) => queue.push(req)); // grows forever if producer > consumer\n\n// With backpressure: bounded queue + load shedding once full\nconst MAX_QUEUE = 1000;\nincomingRequests.on(\"data\", (req) => {\n  if (queue.length >= MAX_QUEUE) {\n    return req.reject(503, \"Server overloaded, try again shortly\"); // shed load\n  }\n  queue.push(req);\n});",
    interviewQuestion:
      "Your service's memory usage grows steadily during traffic spikes and eventually crashes. What's the likely missing piece, and what are your options for handling it?",
  },
  {
    id: "backend-sla-slo-sli",
    category: "backend",
    topic: "Deployment & Observability",
    title: "SLA, SLO, and SLI: Defining 'Reliable Enough'",
    difficulty: "Intermediate",
    summary:
      "An SLI is a measured metric (like request success rate); an SLO is an internal target for that metric (99.9% success rate); an SLA is an external, often contractual commitment to customers with consequences for missing it — and no service can be 100% reliable, so the real engineering question is how much unreliability is acceptable.",
    explanation:
      "Service Level Indicators (SLIs) are the actual measurements — request latency, error rate, availability — collected from real traffic. A Service Level Objective (SLO) is an internal target for an SLI, like 'the API should respond successfully 99.9% of the time over a rolling 30-day window,' used to guide engineering priorities: if you're comfortably within the SLO, the team can take more risks (ship faster, experiment); if you're close to breaching it, focus shifts to stability. A Service Level Agreement (SLA) is the external, often contractual promise to customers, usually a looser target than the internal SLO (giving engineering a buffer) with defined consequences — like service credits — for missing it. The 'error budget' derived from an SLO (100% - SLO, e.g. 0.1% for a 99.9% SLO) is the amount of acceptable failure over the period, and teams use it explicitly to balance velocity against reliability rather than pursuing an unrealistic and expensive 100% uptime target.",
    code: "// SLI: measured directly from production traffic\nconst successRate = successfulRequests / totalRequests;\n\n// SLO: internal target derived from business needs\nconst SLO_TARGET = 0.999; // 99.9% success rate over 30 days\n\n// Error budget: how much failure is 'allowed' before it's a problem\nconst errorBudget = (1 - SLO_TARGET) * totalRequestsInPeriod;\n// If errors so far < errorBudget: team can ship riskier changes\n// If errors so far >= errorBudget: freeze risky changes, focus on stability",
    interviewQuestion:
      "Why would a company set an internal SLO stricter than the SLA it promises customers, and how does an 'error budget' change how a team prioritizes work?",
  },
  {
    id: "backend-presigned-url-uploads",
    category: "backend",
    topic: "API Design",
    title: "Direct-to-Storage Uploads with Presigned URLs",
    difficulty: "Advanced",
    summary:
      "Routing large file uploads through your API server wastes its bandwidth and memory on data it doesn't need to touch — a presigned URL lets the client upload directly to object storage (like S3) while your server only handles authorization, not the file bytes.",
    explanation:
      "If a client uploads a large file to your API server, which then re-uploads it to S3, your server is spending memory, CPU, and bandwidth proxying bytes it never actually needs to process — this doesn't scale well for large files or high upload volume. A presigned URL is a time-limited, cryptographically signed URL that grants temporary permission to upload (or download) a specific object directly to/from storage without needing the storage provider's real credentials. The flow is: client asks your API 'I want to upload a file,' your API checks authorization and asks the storage provider for a presigned URL (this is a cheap, fast call, not a file transfer), returns that URL to the client, and the client uploads the actual file bytes directly to storage, completely bypassing your application server. This keeps your API stateless and lightweight regardless of file size or upload volume, while your server retains full control over who's allowed to upload what, since it's the one deciding whether to issue the presigned URL in the first place.",
    code: "// API: doesn't touch the file bytes at all, just authorizes and issues a URL\napp.post(\"/uploads/request\", authenticate, async (req, res) => {\n  const key = `uploads/${req.user.id}/${crypto.randomUUID()}-${req.body.filename}`;\n  const url = await s3.getSignedUrlPromise(\"putObject\", {\n    Bucket: \"my-app-uploads\",\n    Key: key,\n    Expires: 300, // valid for 5 minutes\n    ContentType: req.body.contentType,\n  });\n  res.json({ uploadUrl: url, fileKey: key });\n});\n\n// Client: uploads directly to S3, never touches your API server with the file itself\nawait fetch(uploadUrl, { method: \"PUT\", body: file, headers: { \"Content-Type\": file.type } });",
    interviewQuestion:
      "Why is proxying a large file upload through your own API server before forwarding it to S3 a scalability problem, and how do presigned URLs solve it?",
  },
  {
    id: "backend-service-discovery",
    category: "backend",
    topic: "Architecture",
    title: "Service Discovery: Finding Services in a Dynamic Environment",
    difficulty: "Advanced",
    summary:
      "In an environment where service instances are constantly created and destroyed (autoscaling, deployments), hardcoding IP addresses doesn't work — service discovery lets services find each other's current, live network locations automatically.",
    explanation:
      "In a static environment, one service could call another via a fixed IP or hostname configured once. In a dynamic environment — containers being scheduled onto different hosts, instances scaling up and down, deployments replacing old instances with new ones — those addresses change constantly, so hardcoding them breaks almost immediately. A service registry (Consul, etcd, or Kubernetes's built-in service discovery via DNS) keeps a live, up-to-date list of which instances of a service are currently healthy and where they are; when Service A needs to call Service B, it queries the registry (often just via DNS, abstracting the complexity) to get a current, healthy endpoint rather than a hardcoded address. Kubernetes handles this transparently through its Service abstraction — calling `http://order-service` resolves via internal DNS to whichever healthy Pods currently back that service, with the underlying Pod IPs changing freely underneath without any calling code needing to know or care.",
    code: "// Without service discovery: brittle, breaks when instances change\nconst response = await fetch(\"http://10.0.4.23:8080/orders\"); // hardcoded IP, will break\n\n// With service discovery (Kubernetes DNS-based): resolves to CURRENT healthy instances\nconst response = await fetch(\"http://order-service/orders\");\n// \"order-service\" resolves via cluster DNS to whichever Pods are healthy right now",
    interviewQuestion:
      "Why does hardcoding a downstream service's IP address break in a Kubernetes or autoscaled environment, and what replaces it?",
  },
  {
    id: "backend-chaos-engineering-basics",
    category: "backend",
    topic: "Deployment & Observability",
    title: "Chaos Engineering: Testing Resilience on Purpose",
    difficulty: "Advanced",
    summary:
      "Chaos engineering deliberately injects failures — killing instances, adding network latency, simulating a dependency outage — into a system (ideally production, under controlled conditions) to verify that resilience mechanisms like retries, circuit breakers, and failover actually work before a real failure exposes a gap.",
    explanation:
      "Resilience mechanisms — retries, timeouts, circuit breakers, failover to a replica — are often built based on assumptions about how failures will behave, but those assumptions frequently turn out wrong under real conditions, and the worst time to discover a broken failover process is during an actual outage. Chaos engineering (popularized by Netflix's Chaos Monkey) takes the opposite approach: intentionally and safely inject the kinds of failures you're designed to handle — terminate a random instance, inject artificial network latency between two services, simulate a database becoming unreachable — while carefully monitoring the system's behavior, ideally with the ability to halt the experiment immediately if it causes real user impact. Doing this in a controlled way, starting small (a single non-critical service, low blast radius) and expanding as confidence grows, surfaces real gaps — a circuit breaker that doesn't actually trip, a retry storm that makes an outage worse, a failover that takes far longer than assumed — while the team is prepared and watching, rather than during a real 3am incident.",
    code: "// Conceptual chaos experiment definition\nexperiment:\n  name: \"kill-one-order-service-pod\"\n  hypothesis: \"Killing one pod should cause zero customer-visible errors\"\n  action: terminate_random_pod(service: \"order-service\", count: 1)\n  steadyStateCheck:\n    metric: \"order-service error rate\"\n    threshold: \"< 0.1% for 5 minutes after the action\"\n  rollback: \"abort immediately if error rate exceeds 5%\"",
    interviewQuestion:
      "Why would a company deliberately break things in a controlled way, rather than just trusting that their retries and failover logic work as designed?",
  },
  {
    id: "backend-content-negotiation",
    category: "backend",
    topic: "API Design",
    title: "Content Negotiation: Serving Different Formats from One Endpoint",
    difficulty: "Intermediate",
    summary:
      "Content negotiation lets a single endpoint serve different representations (JSON, XML, CSV) or versions of a resource based on the client's Accept header, rather than needing separate endpoints per format.",
    explanation:
      "Instead of `/api/reports.json` and `/api/reports.csv` as separate endpoints, a single `/api/reports` endpoint can inspect the client's `Accept` header (`Accept: application/json` vs `Accept: text/csv`) and return the appropriate representation of the same underlying resource, keeping the URL structure clean and resource-oriented rather than format-oriented. The same mechanism can be extended for API versioning via custom media types (`Accept: application/vnd.example.v2+json`), and for language negotiation via `Accept-Language`. If a client requests a format the server can't produce, the correct response is `406 Not Acceptable`. In practice, many APIs simplify this by defaulting to JSON always and only adding negotiation for genuinely needed alternate formats, since full content negotiation adds real implementation complexity for a feature most API consumers never use.",
    code: "app.get(\"/api/reports\", (req, res) => {\n  const report = generateReport();\n  res.format({\n    \"application/json\": () => res.json(report),\n    \"text/csv\": () => res.send(toCsv(report)),\n    default: () => res.status(406).send(\"Not Acceptable\"),\n  });\n});\n\n// Client requests JSON\nGET /api/reports\nAccept: application/json\n\n// Same endpoint, client requests CSV instead\nGET /api/reports\nAccept: text/csv",
    interviewQuestion:
      "What's the benefit of using content negotiation via the Accept header instead of just creating separate /reports.json and /reports.csv endpoints?",
  },
  {
    id: "backend-serverless-cold-starts",
    category: "backend",
    topic: "Deployment & Observability",
    title: "Serverless Functions and the Cold Start Problem",
    difficulty: "Advanced",
    summary:
      "Serverless platforms (AWS Lambda, Cloud Functions) scale to zero when idle and spin up a fresh execution environment on demand — the first request to a cold function pays a 'cold start' latency penalty for initializing the runtime, which matters for latency-sensitive APIs.",
    explanation:
      "Serverless functions don't keep a server running continuously — when a function hasn't been invoked recently, the platform tears down its execution environment entirely, so the next request must wait for a new environment to be provisioned, the runtime initialized, and the application code loaded before it can even start processing — this cold start can add anywhere from tens of milliseconds to a few seconds depending on the runtime and package size. Frequently-invoked functions stay 'warm' (environment reused between requests) and avoid this penalty, so cold starts mainly hurt intermittently-used functions or ones with unpredictable traffic spikes. Mitigations include keeping deployment packages small (less to load), choosing faster-starting runtimes (compiled languages generally start faster than ones needing heavy runtime initialization), and 'provisioned concurrency' (paying to keep a minimum number of environments warm at all times) for latency-critical functions where an occasional multi-second delay is unacceptable. This tradeoff — pay only for actual usage, but accept occasional latency spikes — is central to deciding whether serverless fits a given workload.",
    code: "// Cold start impact is invisible in code but very visible in latency graphs:\n// Warm invocation:  ~10-50ms\n// Cold invocation:   500ms - 3000ms+ (runtime init + code load + your handler)\n\n// Mitigation: provisioned concurrency keeps N environments always warm\n// (AWS Lambda conceptual config)\nProvisionedConcurrencyConfig:\n  FunctionName: process-payment\n  ProvisionedConcurrentExecutions: 5   // always-warm capacity, costs more but avoids cold starts",
    interviewQuestion:
      "Your serverless API has great average latency but occasional multi-second spikes for a specific rarely-called endpoint. What's likely happening, and what are your mitigation options?",
  },
  {
    id: "backend-incident-response-postmortems",
    category: "backend",
    topic: "Deployment & Observability",
    title: "Incident Response and Blameless Postmortems",
    difficulty: "Intermediate",
    summary:
      "A good incident response process focuses first on restoring service (mitigate, then investigate), and a blameless postmortem afterward focuses on what about the system allowed the failure to happen, not on blaming whoever was involved — the goal is systemic fixes, not individual blame.",
    explanation:
      "During an active incident, the priority is restoring service as fast as possible — rolling back a bad deploy, failing over to a healthy region, scaling up capacity — even if the root cause isn't understood yet; deep investigation can happen once things are stable again, not while users are actively affected. After the incident, a postmortem document captures a timeline of what happened, what the impact was, and critically, what allowed it to happen and what will prevent recurrence — deliberately blameless, since blaming an individual (who almost always acted reasonably given the information and tools they had) discourages honest reporting in the future and misses the actual systemic issue, like missing monitoring, an easy-to-make mistake the tooling should have prevented, or absent safeguards that let a small error become a big outage. The output should be concrete action items with owners and deadlines — a postmortem that just says 'be more careful' without changing anything about the system has failed at its actual purpose.",
    code: "# Postmortem template (essentials)\n## Summary\nWhat happened, impact (duration, users affected), and current status.\n\n## Timeline\n14:02 - Deploy of v2.3.1 begins\n14:05 - Error rate spikes to 40%\n14:07 - On-call paged\n14:12 - Rollback initiated\n14:15 - Error rate back to normal\n\n## Root Cause\nA missing database index on the new query path caused it to time out under load.\n\n## Action Items (NOT \"be more careful\")\n- [ ] Add index (done)\n- [ ] Add a pre-deploy check for missing indexes on new queries (owner: X, due: Y)\n- [ ] Add alerting on query latency before it becomes an outage (owner: Z, due: W)",
    interviewQuestion:
      "Why do blameless postmortems tend to produce better long-term outcomes than ones that focus on identifying who made the mistake?",
  },
  {
    id: "backend-graphql-dataloader-n-plus-1",
    category: "backend",
    topic: "API Design",
    title: "The GraphQL N+1 Problem and the DataLoader Pattern",
    difficulty: "Advanced",
    summary:
      "A GraphQL query resolving nested fields naively can trigger one database query per item in a list (N+1), even though REST's N+1 problem is often more visible — DataLoader batches and caches these lookups within a single request to collapse them into one query.",
    explanation:
      "A GraphQL query asking for a list of posts and each post's author naturally resolves field-by-field: the resolver for `posts` runs once, but the resolver for each post's `author` field runs independently per post, naively issuing one database query per post — the same N+1 problem seen in REST/ORM contexts, just less obvious because GraphQL's per-field resolver model hides it structurally. DataLoader solves this by batching: within a single request, instead of immediately querying for each author as its resolver runs, DataLoader collects all the requested author IDs during a tick of the event loop, then issues a single batched query (`WHERE id IN (...)`) for all of them at once, and caches results per-request so the same ID is never fetched twice even if referenced by multiple fields. This is essentially transparent to resolver code — each resolver still just calls `authorLoader.load(post.authorId)` as if it were an individual lookup — but the batching happens automatically underneath.",
    code: "const authorLoader = new DataLoader(async (authorIds) => {\n  // Called ONCE per tick with ALL requested IDs batched together\n  const authors = await db.authors.find({ id: { $in: authorIds } });\n  const byId = new Map(authors.map(a => [a.id, a]));\n  return authorIds.map(id => byId.get(id)); // must return in the same order as requested\n});\n\n// Resolver code looks like an individual lookup, but DataLoader batches it\nconst resolvers = {\n  Post: {\n    author: (post) => authorLoader.load(post.authorId),\n  },\n};\n// 100 posts -> 100 .load() calls -> DataLoader issues just 1 batched query",
    interviewQuestion:
      "How does DataLoader turn 100 individual '.load()' calls for different IDs into a single database query, without each resolver needing to know about batching?",
  },
  {
    id: "backend-background-job-patterns",
    category: "backend",
    topic: "Architecture",
    title: "Background Job Patterns: Cron vs Queue-Driven vs Event-Driven",
    difficulty: "Intermediate",
    summary:
      "A cron-scheduled job runs on a fixed time interval regardless of whether there's work to do; a queue-driven worker processes jobs as they're enqueued, scaling naturally with load; an event-driven job reacts immediately to something happening elsewhere in the system.",
    explanation:
      "Cron-style scheduling (`run this every hour`) is simple and predictable, well suited for periodic maintenance tasks like generating a daily report or cleaning up expired records, but it's a poor fit for work that arrives unpredictably, since you either run too often (wasting resources checking for nothing) or not often enough (adding latency between when work becomes available and when it's processed). Queue-driven processing decouples job creation from execution — something enqueues a job the moment it's needed, and one or more workers continuously pull from the queue and process as fast as they can, scaling naturally by adding more workers when the queue backs up. Event-driven jobs react to a specific occurrence (a file uploaded, a webhook received, a database change captured via change streams) and trigger immediately rather than on any kind of schedule or explicit enqueue. Most real backend systems use a mix: cron for periodic maintenance, queues for discrete units of work like sending an email or processing an image, and event-driven triggers for reacting to external or internal events in near-real-time.",
    code: "// Cron: fixed schedule, regardless of whether there's actual work\ncron.schedule(\"0 * * * *\", () => generateHourlyReport()); // every hour, always\n\n// Queue-driven: scales naturally with actual demand\nqueue.subscribe(\"send-email\", async (job) => sendEmail(job.data));\n// enqueue happens the moment a signup occurs — no polling, no fixed schedule\n\n// Event-driven: reacts immediately to something happening\nchangeStream.on(\"change\", (event) => reindexSearchDocument(event.fullDocument));",
    interviewQuestion:
      "Why is a cron job that runs every 5 minutes a worse fit than a queue for processing user-uploaded files as soon as they arrive?",
  },
  {
    id: "backend-mtls-service-to-service-auth",
    category: "backend",
    topic: "Security",
    title: "mTLS: Mutual TLS for Service-to-Service Authentication",
    difficulty: "Advanced",
    summary:
      "Regular TLS only verifies the server's identity to the client; mutual TLS (mTLS) has both sides present certificates, so each service can cryptographically verify the other's identity — the standard way to secure service-to-service traffic in a zero-trust internal network.",
    explanation:
      "When you visit a website over HTTPS, standard TLS proves to your browser that it's really talking to the claimed server, but the server has no cryptographic proof of who the client is beyond whatever application-level auth (like a password) it separately requires. In a microservices environment where dozens of internal services call each other over the network, relying on network location alone ('it came from inside our VPC, so it must be trusted') is a weak security boundary, especially in cloud environments where network boundaries are porous. mTLS requires both sides to present and verify certificates — the calling service proves its identity to the receiving service just as rigorously as the receiving service proves its identity to the caller — so every internal service-to-service call is cryptographically authenticated regardless of network position, forming the basis of a 'zero trust' internal network where no request is trusted just because of where it came from. Service meshes like Istio or Linkerd commonly automate mTLS between all services in a cluster, handling certificate issuance and rotation transparently so individual services don't need to implement it themselves.",
    code: "# Service mesh (conceptual) enforcing mTLS between all internal services\napiVersion: security.istio.io/v1beta1\nkind: PeerAuthentication\nmetadata:\n  name: default\nspec:\n  mtls:\n    mode: STRICT  # every internal call must present a valid, verified certificate\n\n# Without mTLS: any process on the internal network can call payment-service\n# With mTLS: payment-service only accepts calls from services that can prove their identity",
    interviewQuestion:
      "Why is trusting a request just because it 'came from inside the internal network' considered a weak security model, and what does mTLS add on top of that?",
  },
  {
    id: "backend-request-id-correlation",
    category: "backend",
    topic: "Deployment & Observability",
    title: "Request IDs and Correlation Across Logs",
    difficulty: "Intermediate",
    summary:
      "Assigning a unique request ID at the entry point and threading it through every log line, downstream call, and error report lets you reconstruct the complete story of a single request across a distributed system, which is otherwise nearly impossible to piece together from unrelated log lines.",
    explanation:
      "In a system with multiple services and many concurrent requests, log lines from different requests interleave constantly — without a shared identifier, finding all the log lines related to one specific failed request among millions of unrelated ones is nearly impossible. Generating a unique request ID (or accepting one passed in via a header from an upstream caller/gateway) at the very start of request handling, then including it in every subsequent log statement and passing it along in headers to any downstream service calls, means every log line related to that one request — across every service it touched — shares the same identifier, letting you filter your log aggregation tool by that ID and see the complete, chronological story of exactly what happened. This is a small amount of consistent discipline (every log call includes the ID, every outbound call propagates the header) that pays off enormously the first time you need to debug a specific customer's failed request in a system with any meaningful scale or complexity.",
    code: "// Middleware: assign or propagate a request ID at the entry point\napp.use((req, res, next) => {\n  req.requestId = req.headers[\"x-request-id\"] || crypto.randomUUID();\n  res.set(\"x-request-id\", req.requestId);\n  next();\n});\n\n// Every log includes it\nlogger.info({ requestId: req.requestId, event: \"order.created\", orderId });\n\n// Propagate to downstream service calls\nawait fetch(paymentServiceUrl, {\n  headers: { \"x-request-id\": req.requestId }, // now traceable across BOTH services\n});",
    interviewQuestion:
      "A customer reports one specific failed request. Without a request ID, why is finding the relevant log lines across three microservices nearly impossible, and how does a request ID fix it?",
  },
  {
    id: "backend-http2-multiplexing",
    category: "backend",
    topic: "API Fundamentals",
    title: "HTTP/2 Multiplexing: Solving Head-of-Line Blocking",
    difficulty: "Advanced",
    summary:
      "HTTP/1.1 needs multiple TCP connections (or strict queuing) to send concurrent requests since responses must return in order on one connection; HTTP/2 multiplexes many requests and responses over a single connection simultaneously, eliminating that bottleneck at the HTTP layer.",
    explanation:
      "HTTP/1.1 processes requests on a connection sequentially — if request A is slow, request B queued behind it on the same connection has to wait, a problem called head-of-line blocking; browsers worked around this by opening multiple parallel TCP connections to the same server (typically 6), which helps but adds its own overhead (each connection needs its own TCP and TLS handshake). HTTP/2 introduces multiplexing: multiple requests and responses can be in flight simultaneously over a single TCP connection, interleaved as small frames and reassembled at the other end, so one slow request no longer blocks others behind it on the same connection, and the overhead of multiple connections is eliminated. This is largely transparent to application code — you don't write different code for HTTP/2 — but it changes performance characteristics enough that some older HTTP/1.1 optimizations (like concatenating many small files into one bundle to reduce request count) matter less, since making many small requests over HTTP/2 is much cheaper than it was over HTTP/1.1.",
    code: "// HTTP/1.1: needs multiple connections for true concurrency\n// Connection 1: Request A ---- (waiting) ---- Response A\n// Connection 2: Request B -- Response B\n// Connection 3: Request C -- Response C\n\n// HTTP/2: all multiplexed over ONE connection, interleaved as frames\n// Connection 1: [A-frame][B-frame][C-frame][B-frame][A-frame]... all concurrent\n// No connection-per-request needed, no head-of-line blocking at the HTTP layer",
    interviewQuestion:
      "Why did browsers historically open up to 6 parallel connections to the same server under HTTP/1.1, and why does HTTP/2 make that workaround unnecessary?",
  },
  {
    id: "backend-compression-gzip-brotli",
    category: "backend",
    topic: "Scaling & Performance",
    title: "Response Compression: gzip and Brotli",
    difficulty: "Basic",
    summary:
      "Compressing HTTP response bodies (especially JSON and text) before sending them over the network trades a small amount of CPU time on the server for a much smaller payload over the wire, which is almost always a good trade given how much slower networks are than CPUs.",
    explanation:
      "Text-based formats like JSON and HTML compress extremely well since they contain a lot of repeated structure (repeated field names, whitespace, common tokens) — a gzip- or Brotli-compressed JSON response is often 70-90% smaller than the uncompressed version. The client signals which compression algorithms it supports via `Accept-Encoding`, and the server (or more commonly, a reverse proxy/CDN in front of it) compresses the response and marks it with `Content-Encoding`, which the client automatically decompresses transparently. Brotli generally compresses better than gzip at the same speed, and browsers support both widely today. The CPU cost of compressing on the server is usually far cheaper than the time saved transmitting a much smaller payload over the network, especially for users on slower connections, which is why compression should essentially always be enabled for text-based API responses unless there's a specific reason not to (like very low-latency internal services trading over an already-fast network where compression's CPU overhead isn't worth it).",
    code: "// Server: enable compression (many frameworks/proxies do this with one line)\napp.use(compression()); // automatically gzip/brotli-compresses eligible responses\n\n// Request/response headers show it happening\nGET /api/orders\nAccept-Encoding: gzip, br\n\nHTTP/1.1 200 OK\nContent-Encoding: br\nContent-Length: 1204   // vs ~8000 uncompressed for the same JSON",
    interviewQuestion:
      "Why is enabling gzip/Brotli compression on API responses almost always worth the extra CPU cost on the server?",
  },
  {
    id: "backend-dependency-injection-backend",
    category: "backend",
    topic: "Architecture",
    title: "Dependency Injection for Testable Backend Code",
    difficulty: "Intermediate",
    summary:
      "Dependency injection means a function or class receives its dependencies (a database connection, an email sender) from the outside rather than creating them internally, which makes it possible to substitute a fake/mock version in tests without changing the code being tested.",
    explanation:
      "If a function directly creates its own database connection or calls a real email-sending service internally, testing that function means either actually hitting a real database and sending real emails during tests (slow, flaky, has side effects), or resorting to fragile module-mocking tricks. Dependency injection flips this: the function or class accepts its dependencies as parameters (constructor injection) or via a framework's DI container, so tests can pass in a fake database or a mock email sender that doesn't do anything real, letting you test the function's logic in isolation, quickly and deterministically. This also makes swapping real implementations easier in general — switching from one email provider to another means changing what gets injected, not hunting through the codebase for every place the old provider was directly instantiated. Frameworks like FastAPI (via `Depends`) and NestJS bake dependency injection into how routes/services are structured, but the core idea — pass dependencies in, don't reach out and grab them — applies regardless of framework.",
    code: "// Without DI: hard to test without a real email service\nasync function registerUser(email) {\n  const user = await db.users.create({ email });\n  await new SendGridClient().send(email, \"Welcome!\"); // real external call, always\n  return user;\n}\n\n// With DI: the dependency is injected, easy to substitute a fake in tests\nasync function registerUser(email, { db, emailSender }) {\n  const user = await db.users.create({ email });\n  await emailSender.send(email, \"Welcome!\");\n  return user;\n}\n\n// Test: inject a fake, no real email sent, fast and deterministic\nawait registerUser(\"test@test.com\", { db: fakeDb, emailSender: fakeEmailSender });\nexpect(fakeEmailSender.sentTo).toContain(\"test@test.com\");",
    interviewQuestion:
      "Why does directly instantiating a real email-sending client inside a function make that function harder to test, and how does dependency injection fix it?",
  },
  {
    id: "backend-testing-pyramid-backend",
    category: "backend",
    topic: "Architecture",
    title: "The Testing Pyramid Applied to Backend Services",
    difficulty: "Intermediate",
    summary:
      "Unit tests (many, fast, isolated) should form the base, integration tests (fewer, testing real components together like a real database) the middle, and end-to-end tests (fewest, testing the whole system through real APIs) the top — inverting this ratio leads to a slow, flaky test suite.",
    explanation:
      "Unit tests isolate a single function or class, mocking its dependencies, and run in milliseconds — you can have thousands of them and still run the full suite in seconds, making them ideal for testing business logic edge cases exhaustively. Integration tests verify that multiple real components work correctly together — a real (test) database, a real HTTP call to another internal service — catching issues unit tests with mocks can't (like an actual SQL syntax error), but they're slower and more complex to set up. End-to-end tests exercise the entire system through its real, public interface exactly as a user or client would, providing the highest confidence that the system works as a whole, but they're the slowest, most brittle (a UI change or unrelated flaky network can break them), and most expensive to maintain. A healthy test suite has many unit tests, a moderate number of integration tests focused on the riskiest interactions, and only a handful of end-to-end tests covering critical user journeys — an 'inverted pyramid' with mostly slow end-to-end tests and few unit tests leads to a test suite that takes forever to run and is too flaky to trust, which teams eventually just stop running carefully.",
    code: "// Unit test: isolated, fast, mocked dependencies\ntest(\"calculateDiscount applies 10% for orders over $100\", () => {\n  expect(calculateDiscount({ total: 150 })).toBe(15);\n});\n\n// Integration test: real test database, verifies actual query behavior\ntest(\"creating an order with an invalid customer_id fails\", async () => {\n  await expect(db.orders.create({ customerId: 99999 })).rejects.toThrow();\n});\n\n// E2E test: through the real API, exactly like a real client\ntest(\"a full checkout flow succeeds\", async () => {\n  const res = await request(app).post(\"/api/checkout\").send(validCart);\n  expect(res.status).toBe(201);\n});",
    interviewQuestion:
      "Why does a test suite made up mostly of slow end-to-end tests, with very few unit tests, tend to become unreliable and eventually get ignored by the team?",
  },
  {
    id: "backend-api-contract-testing",
    category: "backend",
    topic: "API Design",
    title: "Contract Testing: Verifying Services Agree Without Full Integration Tests",
    difficulty: "Advanced",
    summary:
      "Contract testing (e.g. Pact) verifies that a consumer's expectations of an API and the provider's actual behavior stay in sync, catching breaking changes between independently-deployed services without needing a slow, flaky full end-to-end environment.",
    explanation:
      "In a microservices architecture, a consumer service (like a frontend or another backend service) and a provider service (the API it calls) are often built and deployed by different teams on independent schedules — a change to the provider's response shape can silently break the consumer without either team immediately noticing, since they don't share a codebase or deploy together. Contract testing has the consumer define a 'contract' — the exact requests it will make and the responses it expects — which is then run against the real provider (in CI, without needing the full consumer running) to verify the provider still honors it, and separately the consumer's own tests run against a mock server generated from that same contract. This catches breaking changes at the exact boundary where they'd cause a real integration failure, without needing a slow, often-flaky environment where every service is actually running together end-to-end, and it clearly attributes which side broke the agreement when a contract test fails.",
    code: "// Consumer defines what it expects (a \"contract\")\npact.addInteraction({\n  state: \"a user with id 42 exists\",\n  uponReceiving: \"a request for user 42\",\n  withRequest: { method: \"GET\", path: \"/users/42\" },\n  willRespondWith: {\n    status: 200,\n    body: { id: 42, name: like(\"Alice\"), email: like(\"a@test.com\") },\n  },\n});\n\n// Provider's CI pipeline replays this contract against the REAL provider\n// and fails the build if the actual response no longer matches",
    interviewQuestion:
      "Why is contract testing often preferred over full end-to-end tests for verifying that two independently-deployed microservices are compatible?",
  },
  {
    id: "backend-log-levels-and-sampling",
    category: "backend",
    topic: "Deployment & Observability",
    title: "Log Levels and Sampling: Logging Enough Without Drowning in Noise",
    difficulty: "Intermediate",
    summary:
      "Log levels (debug, info, warn, error) let you control verbosity per environment; at high traffic volumes, sampling (logging only a percentage of routine events) keeps costs and noise manageable while still logging every error at full volume.",
    explanation:
      "Debug-level logs are useful during local development but far too noisy and expensive to keep on in production at full volume; a typical setup runs at `info` level or higher in production, reserving `debug` for temporary, targeted troubleshooting. Even at `info` level, a very high-traffic service logging every single request can generate enormous log volume, driving up log storage/ingestion costs and making it harder to find the signal in the noise. Sampling addresses this: log only a percentage of routine successful requests (say 1-5%) for general visibility into normal traffic patterns, while ensuring every error and warning is logged at 100% regardless of sampling, since those are exactly the events you can't afford to miss. Getting this balance wrong in either direction is costly: too verbose and you can't afford to store or search your logs effectively; too sparse and you're missing exactly the evidence you need when something goes wrong.",
    code: "function logRequest(req, res, durationMs) {\n  const isError = res.statusCode >= 500;\n  const shouldSample = Math.random() < 0.05; // log 5% of routine requests\n\n  if (isError || shouldSample) {\n    logger.info({\n      method: req.method, path: req.path, status: res.statusCode, durationMs,\n      sampled: !isError,\n    });\n  }\n  // Errors are NEVER sampled out — always logged at 100%\n}",
    interviewQuestion:
      "Your production logging bill exploded after traffic doubled, but you still need visibility into normal request patterns. How does sampling let you reduce volume without losing your ability to debug errors?",
  },
  {
    id: "backend-graceful-degradation",
    category: "backend",
    topic: "Scaling & Performance",
    title: "Graceful Degradation: Failing Partially Instead of Completely",
    difficulty: "Advanced",
    summary:
      "When a non-critical dependency fails, a resilient system serves a degraded but still-useful response (cached data, a default value, a hidden feature) instead of failing the entire request — reserving hard failures for when a truly essential dependency is unavailable.",
    explanation:
      "Not every dependency a request touches is equally critical — a product page might call the core database for the essential product details, but also call a recommendations service for 'customers also bought' suggestions. If the recommendations service is slow or down, failing the entire page load because of a non-essential feature is a poor tradeoff; a resilient design instead catches that specific failure, omits or falls back for just that section (a cached/default set of recommendations, or simply hiding that section), and still serves the core page successfully. This requires explicitly identifying which dependencies are truly critical (the request cannot succeed at all without them) versus enhancing-but-optional (the request can still provide real value without them), and wrapping calls to the optional ones with fallback logic rather than letting any failure anywhere propagate into a total failure.",
    code: "async function getProductPage(productId) {\n  const product = await db.products.findById(productId); // critical — let this fail loudly\n\n  let recommendations = [];\n  try {\n    recommendations = await recommendationService.getFor(productId, { timeout: 500 });\n  } catch {\n    recommendations = []; // degrade gracefully — page still works without this\n  }\n\n  return { product, recommendations }; // succeeds even if recommendations failed\n}",
    interviewQuestion:
      "A non-critical 'recommended products' widget occasionally times out and currently takes down the entire product page with it. How would you redesign this to degrade gracefully instead?",
  },
  {
    id: "backend-synthetic-monitoring",
    category: "backend",
    topic: "Deployment & Observability",
    title: "Synthetic Monitoring: Testing Production Like a Real User, Continuously",
    difficulty: "Intermediate",
    summary:
      "Synthetic monitoring runs scripted, simulated user journeys against production on a schedule (from various geographic locations), catching outages and regressions proactively — before real users report them and independent of whether real traffic happens to be hitting the broken path at that moment.",
    explanation:
      "Passive monitoring (error rates, latency metrics from real traffic) only tells you something's wrong once real users are actually experiencing it, and if a broken code path isn't exercised by current traffic (like a checkout flow at 3am when order volume is low), an outage there could go undetected for hours. Synthetic monitoring proactively runs a scripted sequence — log in, search for a product, add to cart, checkout — on a fixed schedule (every few minutes) from geographically distributed locations, treating the checks exactly like automated end-to-end tests running continuously against production, and alerts immediately if any step fails or exceeds a latency threshold, regardless of whether real user traffic happens to be exercising that path right now. This is complementary to real-user monitoring (which tells you about actual user experience and volume) — synthetic checks guarantee coverage of critical paths at a predictable cadence, while real-user monitoring reflects genuine, organic usage patterns.",
    code: "// Synthetic check (conceptual, runs every 5 minutes from multiple regions)\nasync function syntheticCheckoutTest() {\n  const start = Date.now();\n  await login(testAccount);\n  await addToCart(testProductId);\n  const order = await checkout(testPaymentMethod);\n  const duration = Date.now() - start;\n\n  if (!order.success || duration > 5000) {\n    alerting.page(\"Synthetic checkout test failed or exceeded 5s\", { duration, order });\n  }\n}",
    interviewQuestion:
      "Why would a company run continuous automated checkout tests against their own production site, rather than relying only on real user traffic monitoring?",
  },
  {
    id: "backend-multi-region-deployment",
    category: "backend",
    topic: "Scaling & Performance",
    title: "Multi-Region Deployment: Latency, Failover, and Data Consistency",
    difficulty: "Advanced",
    summary:
      "Deploying to multiple geographic regions reduces latency for distant users and provides failover if one region goes down, but introduces genuinely hard problems around keeping data consistent across regions and deciding where writes are authoritative.",
    explanation:
      "A user in Singapore calling a service hosted only in the US pays real, physics-bound network latency for every request; deploying application instances in multiple regions closer to users reduces that latency significantly, and if configured with health-check-based failover, protects against an entire region's infrastructure going down. The hard part is data: if the database is only in one region, application servers in other regions still pay cross-region latency for every database call, defeating much of the benefit; but replicating the database to multiple regions with each accepting writes (multi-master) reintroduces the consistency problems of distributed systems (two regions could accept conflicting writes to the same record simultaneously). Common approaches include a single 'primary' region for writes with read replicas elsewhere (fast local reads, slower cross-region writes), or partitioning data by region (a user's data lives in their nearest region, avoiding cross-region calls for their own data entirely, at the cost of complexity for any cross-region features). There's no configuration that eliminates the CAP theorem tradeoffs — multi-region architecture is fundamentally a set of deliberate tradeoffs based on the specific consistency and latency needs of the application.",
    code: "// Read replica per region: fast local reads, writes go to one primary region\n// US-East (primary): accepts all writes\n// EU-West (replica): fast local reads, writes proxied to US-East (extra latency)\n// AP-Southeast (replica): fast local reads, writes proxied to US-East (extra latency)\n\n// Data partitioned by region: no cross-region calls for a user's own data\n// EU users' data lives entirely in EU-West — fast reads AND writes\n// US users' data lives entirely in US-East — fast reads AND writes\n// Cross-region features (e.g. a global leaderboard) need explicit extra design",
    interviewQuestion:
      "Why doesn't simply deploying application servers to multiple regions automatically make the application fast for users in all those regions?",
  },
  {
    id: "backend-api-sdk-generation",
    category: "backend",
    topic: "API Design",
    title: "Generating Client SDKs from an API Specification",
    difficulty: "Intermediate",
    summary:
      "Instead of every consumer hand-writing HTTP calls and hoping they match the API correctly, generating typed client SDKs directly from an OpenAPI or GraphQL schema guarantees the client code always matches the real API shape and gives consumers autocomplete and compile-time errors on mismatches.",
    explanation:
      "A hand-written API client is prone to drifting from reality — a field gets renamed on the server, and the hand-written client silently keeps sending/expecting the old shape until something breaks at runtime. Generating a client SDK directly from the API's formal specification (an OpenAPI document, or a GraphQL schema) produces typed request/response models and methods that are mechanically guaranteed to match what the API actually accepts and returns, since they're derived from the same source of truth the API itself is built from (or that describes it). This gives consuming developers autocomplete, compile-time type errors when they use a field incorrectly, and confidence that the client and server won't silently drift apart — regenerating the SDK whenever the spec changes (often automated in CI) keeps everything in sync automatically, and is standard practice for any API with more than a handful of external consumers.",
    code: "# Generate a typed TypeScript client directly from the OpenAPI spec\nopenapi-generator generate -i openapi.yaml -g typescript-axios -o ./generated-client\n\n// Generated, always matches the real API — TypeScript catches mismatches at compile time\nimport { UsersApi } from \"./generated-client\";\nconst api = new UsersApi();\nconst user = await api.getUserById(42); // fully typed response, autocomplete works",
    interviewQuestion:
      "Why is a generated API client less likely to break than a hand-written one when the API's response shape changes?",
  },
  {
    id: "backend-zero-downtime-database-connections",
    category: "backend",
    topic: "Deployment & Observability",
    title: "Handling Database Failover Without Dropping Application Connections",
    difficulty: "Advanced",
    summary:
      "When a database primary fails over to a replica (planned maintenance or an actual crash), application connections pointed at the old primary become invalid — the application needs to detect this and reconnect to the new primary automatically, or every in-flight and subsequent request fails until it does.",
    explanation:
      "A database connection pool holds open TCP connections to what it believes is the database's primary instance; if that instance fails and a replica is promoted to take over (automatic failover), the pool's existing connections are now pointing at a dead or read-only instance, and any query attempted on them will fail until the application detects this and re-establishes connections against the new primary's address. Managed database services often provide a stable endpoint/DNS name that automatically points to whichever instance is currently primary, so the application doesn't need custom failover-detection logic — but the connection pool still needs to handle a burst of connection errors during the failover window gracefully (retry with backoff, rather than failing every affected request immediately) rather than assuming any connection error means the whole database is permanently gone. Properly handling this — detecting stale connections, retrying with backoff, and giving the pool time to re-establish healthy connections to the new primary — is what determines whether a failover event causes a brief blip or an extended outage for the application.",
    code: "// Connection pool with retry logic for transient failover errors\nasync function queryWithFailoverRetry(sql, params, retries = 3) {\n  for (let attempt = 0; attempt < retries; attempt++) {\n    try {\n      return await pool.query(sql, params);\n    } catch (err) {\n      if (isConnectionError(err) && attempt < retries - 1) {\n        await sleep(500 * (attempt + 1)); // give failover time to complete\n        continue;\n      }\n      throw err;\n    }\n  }\n}",
    interviewQuestion:
      "During a database failover event, why might requests fail for a short window even though a healthy replica was promoted almost instantly?",
  },
  {
    id: "backend-pii-gdpr-handling",
    category: "backend",
    topic: "Security",
    title: "Handling PII and GDPR-Style Data Requirements in an API",
    difficulty: "Advanced",
    summary:
      "Personally Identifiable Information needs deliberate handling — minimizing what's collected, supporting deletion/export requests, and knowing exactly where it's stored (including in logs and backups) — since 'we'll figure it out later' becomes very expensive once regulations like GDPR apply.",
    explanation:
      "Data protection regulations (GDPR in the EU, similar laws elsewhere) require concrete capabilities: a user must be able to request a full export of their personal data, request deletion ('right to be forgotten'), and be told what data is collected and why. This is much harder to retrofit than to design for from the start — if PII is scattered across many tables, cached in Redis, logged in plaintext application logs, and copied into analytics pipelines, fulfilling a deletion request means finding and removing it everywhere, not just the obvious `users` table. Practical patterns include: minimizing collection (don't store data you don't actually need), tagging which database columns contain PII so deletion/export tooling can find them systematically, being deliberate about NOT logging PII in plaintext application logs (a common accidental leak — logging a full user object that includes email/address), and having a documented, tested process for actually executing a deletion or export request within the regulation's required timeframe. Treating this as an afterthought after the system is already sprawling is where most of the real cost comes from.",
    code: "// Avoid accidentally logging PII\nlogger.info({ event: \"user.login\", userId: user.id }); // good — no PII\nlogger.info({ event: \"user.login\", user }); // bad — logs entire object including email, etc.\n\n// Tag PII columns so deletion tooling can find them systematically\nconst PII_COLUMNS = {\n  users: [\"email\", \"phone\", \"address\", \"full_name\"],\n  orders: [\"shipping_address\"],\n};\n\nasync function deleteUserData(userId) {\n  for (const [table, columns] of Object.entries(PII_COLUMNS)) {\n    await anonymizeOrDelete(table, userId, columns); // systematic, not ad-hoc\n  }\n}",
    interviewQuestion:
      "A user requests deletion of all their personal data under GDPR. Why is this hard to fulfill correctly if PII handling wasn't planned for from the start?",
  },
  {
    id: "backend-protobuf-schema-evolution",
    category: "backend",
    topic: "API Design",
    title: "Protocol Buffers and Backward-Compatible Schema Evolution",
    difficulty: "Advanced",
    summary:
      "Protocol Buffers (used by gRPC) assign a unique number to each field rather than relying on field order or names, which is what allows a schema to evolve — adding new fields or deprecating old ones — without breaking already-deployed clients and servers running different versions.",
    explanation:
      "In a system where clients and servers deploy independently and can temporarily run different versions of a shared schema, backward compatibility is essential — an old client shouldn't break when it receives a message with a new field it doesn't understand, and a new client shouldn't break when talking to an old server that doesn't have a field yet. Protocol Buffers achieve this by identifying fields by number (not name or position) in the wire format — adding a new field with a new, unused number is always safe since old code simply ignores fields it doesn't recognize; removing a field requires reserving its number so it's never accidentally reused with different semantics; and field numbers, once assigned, should never be reused or changed. This numbered-field design is precisely why protobuf-based systems can evolve their schemas over years across many independently-deployed services without requiring synchronized deployments — a property that's much harder to get right with a naively-designed binary format tied to field order.",
    code: "// user.proto — version 1\nmessage User {\n  string id = 1;\n  string name = 2;\n}\n\n// user.proto — version 2: safe addition, old clients simply ignore field 3\nmessage User {\n  string id = 1;\n  string name = 2;\n  string email = 3;      // NEW — old clients/servers unaffected\n  reserved 4;             // a field was removed — number 4 can NEVER be reused\n}",
    interviewQuestion:
      "Why does Protocol Buffers identify fields by number instead of name or position, and how does that specifically enable backward-compatible schema changes?",
  },
  {
    id: "backend-hateoas-explained",
    category: "backend",
    topic: "API Design",
    title: "HATEOAS: Letting the API Guide the Client",
    difficulty: "Advanced",
    summary:
      "HATEOAS (Hypermedia as the Engine of Application State) means API responses include links describing what actions are currently possible from the current state, so clients navigate the API dynamically instead of hardcoding every URL and valid transition ahead of time.",
    explanation:
      "Most 'REST' APIs in practice are really just HTTP+JSON APIs where the client hardcodes every endpoint URL and has to independently know which actions are valid in which states (like knowing an order can only be cancelled while it's still 'pending'). True HATEOAS includes hyperlinks in each response describing what you can do next from the current state — an order response for a pending order includes a `cancel` link, while a shipped order's response omits it entirely, letting the client simply check for the link's presence rather than hardcoding business rules about which states allow cancellation. In principle this decouples clients from needing to know the API's URL structure or state-transition rules ahead of time, similar to how a human browsing a website follows links without knowing the site's URL scheme in advance. In practice, full HATEOAS is uncommon in real-world APIs since it adds real complexity for benefits that matter more for very long-lived, loosely-coupled public APIs than for a typical API with a small number of known clients — most teams build 'RESTful' JSON APIs without going this far, which is a reasonable, pragmatic tradeoff.",
    code: "// Non-HATEOAS: client must already know cancellation is only valid while pending\n{ \"id\": 42, \"status\": \"pending\", \"total\": 99.99 }\n\n// HATEOAS: the response itself tells the client what's currently possible\n{\n  \"id\": 42, \"status\": \"pending\", \"total\": 99.99,\n  \"_links\": {\n    \"self\": { \"href\": \"/orders/42\" },\n    \"cancel\": { \"href\": \"/orders/42/cancel\", \"method\": \"POST\" }\n  }\n}\n// Once shipped, the \"cancel\" link simply disappears from the response —\n// client doesn't need to hardcode the business rule about when cancellation is allowed",
    interviewQuestion:
      "What problem does HATEOAS solve that a typical JSON REST API (with hardcoded client-side URLs) doesn't, and why do most real-world APIs skip it anyway?",
  },
  {
    id: "backend-cost-aware-autoscaling",
    category: "backend",
    topic: "Scaling & Performance",
    title: "Cost-Aware Autoscaling: Performance Isn't Free",
    difficulty: "Intermediate",
    summary:
      "Autoscaling that only optimizes for handling peak load without considering cost can scale up aggressively and never scale back down efficiently — good autoscaling policies balance responsiveness to real load against the real dollar cost of running unnecessary capacity.",
    explanation:
      "It's tempting to configure autoscaling generously — scale up fast and scale down slowly — to guarantee the system never struggles under load, but this can mean paying for significantly more capacity than actually needed most of the time, especially for workloads with a small number of genuine traffic spikes and long periods of low, steady traffic. Effective autoscaling policies scale up quickly enough to handle real spikes without users experiencing degraded performance, but also scale back down promptly once load subsides, rather than leaving excess capacity running 'just in case.' This requires good metrics (not just CPU, but the actual latency/error-rate signals that indicate real user impact), sensible cooldown periods to avoid flapping (rapidly scaling up and down in response to noisy short-term fluctuations), and periodically reviewing whether the baseline (minimum) capacity is still appropriately sized rather than a number chosen once early on and never revisited as traffic patterns change.",
    code: "# Autoscaling policy balancing responsiveness and cost\napiVersion: autoscaling/v2\nkind: HorizontalPodAutoscaler\nspec:\n  minReplicas: 3            # baseline — reviewed periodically, not \"set and forget\"\n  maxReplicas: 50\n  behavior:\n    scaleUp:\n      stabilizationWindowSeconds: 0     # react fast to real spikes\n    scaleDown:\n      stabilizationWindowSeconds: 300   # but don't flap — wait 5 min before scaling down\n  metrics:\n    - resource: { name: cpu, target: { averageUtilization: 70 } }",
    interviewQuestion:
      "Why might an autoscaling policy that scales up aggressively but scales down very conservatively end up costing significantly more than necessary?",
  },
  {
    id: "backend-batch-vs-realtime-processing",
    category: "backend",
    topic: "Architecture",
    title: "Batch Processing vs Real-Time Processing",
    difficulty: "Intermediate",
    summary:
      "Batch processing collects data and processes it periodically in large groups (efficient, but with inherent delay); real-time (stream) processing handles each event as it arrives (low latency, but more complex infrastructure) — the right choice depends on how quickly the result actually needs to be available.",
    explanation:
      "Batch processing — running a nightly job that aggregates the day's transactions into a report — is simple to build and reason about, and processing data in large groups is often more resource-efficient than handling each item individually, but it inherently introduces delay: the report isn't available until the batch job runs. Real-time/stream processing (using tools like Kafka Streams, Flink, or simpler custom event-driven pipelines) processes each event as it arrives, providing up-to-the-second results, but requires more complex infrastructure to handle continuous processing, backpressure, and failure recovery for an always-running pipeline rather than a discrete job that either succeeds or fails as a whole. The decision should be driven by actual business requirements: a daily sales report has no need for real-time processing (batch is simpler and cheaper), while fraud detection needs to flag suspicious transactions within seconds, not hours, which justifies the added complexity of a real-time pipeline. Building real-time infrastructure for a need that would be perfectly served by a nightly batch job is a common form of unnecessary complexity.",
    code: "// Batch: simple, efficient, but delayed until it runs\ncron.schedule(\"0 2 * * *\", async () => {\n  const transactions = await db.transactions.find({ date: yesterday() });\n  const report = aggregateIntoReport(transactions);\n  await saveReport(report);\n}); // report is only as fresh as last night's run\n\n// Real-time: immediate, but needs always-running infrastructure\nkafkaStream.on(\"transaction\", async (event) => {\n  const riskScore = await scoreForFraud(event);\n  if (riskScore > 0.8) await flagForReview(event); // seconds, not hours\n});",
    interviewQuestion:
      "Why would building a real-time streaming pipeline for a daily sales report be unnecessary complexity, while the same approach is justified for fraud detection?",
  },
  {
    id: "backend-config-management-environments",
    category: "backend",
    topic: "Deployment & Observability",
    title: "Configuration Management Across Environments",
    difficulty: "Basic",
    summary:
      "The same application code should run in dev, staging, and production with different configuration (database URLs, feature flags, API keys) injected externally — not hardcoded or branched with if-statements checking the environment name throughout the codebase.",
    explanation:
      "Hardcoding environment-specific values, or worse, scattering `if (env === 'production')` checks throughout business logic, makes the codebase harder to reason about and risks a config mistake being deployed as actual application-behavior differences between environments that should otherwise be identical. The standard pattern (part of the widely-referenced 'twelve-factor app' methodology) is strict separation: the exact same build artifact/container image is deployed to every environment unchanged, and all environment-specific values — database connection strings, API keys, feature flag states, log levels — are injected purely through configuration (environment variables, a config service, mounted secrets) at runtime, never through different code paths or different builds per environment. This guarantees that if something behaves correctly in staging, it's because the actual application logic is identical to production, not because staging quietly runs a different code path — differences are isolated entirely to configuration, which is far easier to audit and reason about than scattered conditional logic.",
    code: "// Bad: environment-specific logic branches scattered through the codebase\nif (process.env.NODE_ENV === \"production\") {\n  await sendRealEmail(user.email);\n} else {\n  console.log(\"Would send email to\", user.email);\n}\n\n// Better: same code path everywhere, behavior differs only via injected config\nconst emailProvider = config.emailProvider; // \"sendgrid\" in prod, \"console-logger\" in dev\nawait emailProvider.send(user.email, message);\n// The APPLICATION LOGIC is identical; only the injected implementation differs",
    interviewQuestion:
      "Why is scattering `if (environment === 'production')` checks throughout business logic riskier than injecting environment-specific behavior purely through configuration?",
  },
  {
    id: "backend-oauth2-flows",
    category: "backend",
    topic: "Authentication & Authorization",
    title: "OAuth2 Flows: Authorization Code vs Client Credentials",
    difficulty: "Advanced",
    summary:
      "The Authorization Code flow lets a user grant a third-party app limited access to their account on another service (like 'Sign in with Google') without ever sharing their password with that app; Client Credentials is for server-to-server access with no user involved at all.",
    explanation:
      "In the Authorization Code flow, a user clicks 'Sign in with Google' on your app, gets redirected to Google to log in and approve the requested permissions, and Google redirects back to your app with a short-lived authorization code — your server then exchanges that code (server-side, using a client secret) for an access token, never seeing the user's Google password at any point. This indirection through the browser and back is what lets the user trust a third-party app with limited, revocable access instead of full credentials. Client Credentials is much simpler: two backend services authenticate directly with each other using a client ID and secret, with no user or browser redirect involved at all — appropriate for machine-to-machine API access where there's no human to log in. Confusing the two (like implementing a user-facing login with Client Credentials) is a common mistake that either doesn't work or bypasses the security benefits OAuth2 is designed to provide.",
    code: "# Authorization Code flow (simplified)\n# 1. Redirect user to provider\nGET https://accounts.google.com/o/oauth2/auth?client_id=...&redirect_uri=...&scope=email&response_type=code\n\n# 2. Provider redirects back with a code\nGET https://yourapp.com/callback?code=AUTH_CODE\n\n# 3. Your SERVER exchanges the code for a token (client secret never exposed to browser)\nPOST https://oauth2.googleapis.com/token\nBody: { code, client_id, client_secret, redirect_uri, grant_type: 'authorization_code' }\n\n# Client Credentials flow (no user at all — service to service)\nPOST https://auth.example.com/token\nBody: { client_id, client_secret, grant_type: 'client_credentials' }",
    interviewQuestion:
      "Why does the Authorization Code flow route through the browser and back to your server, instead of your app just asking the user for their Google password directly?",
  },
  {
    id: "backend-refresh-token-rotation",
    category: "backend",
    topic: "Authentication & Authorization",
    title: "Refresh Token Rotation and Reuse Detection",
    difficulty: "Advanced",
    summary:
      "A refresh token is exchanged for a new short-lived access token without requiring the user to log in again; rotating the refresh token on every use (issuing a new one and invalidating the old) lets the system detect theft — if a stolen, already-used refresh token is presented again, that's a clear signal of compromise.",
    explanation:
      "Short-lived access tokens (minutes to an hour) limit the damage if one leaks, but require a way to get a new one without constant re-login — that's what a longer-lived refresh token is for. Without rotation, a single refresh token could be used repeatedly by both the legitimate user and an attacker who stole it, indistinguishably. With rotation, every time a refresh token is used, it's immediately invalidated and a new one is issued — meaning if the SAME refresh token is ever presented a second time, the server knows something is wrong (either the legitimate client's storage got out of sync, or more likely, an attacker is replaying a stolen token after the real user already rotated past it). A robust implementation responds to detected reuse by invalidating the entire token family (all descendants of that refresh token), forcing a full re-login — treating it as a likely compromise rather than a minor glitch.",
    code: "async function refreshAccessToken(oldRefreshToken) {\n  const stored = await db.refreshTokens.findOne({ token: oldRefreshToken });\n  if (!stored) throw new Error(\"Invalid refresh token\");\n\n  if (stored.used) {\n    // This token was already rotated away — reuse detected, treat as compromised\n    await db.refreshTokens.deleteMany({ familyId: stored.familyId });\n    throw new Error(\"Token reuse detected — all sessions revoked\");\n  }\n\n  await db.refreshTokens.updateOne({ token: oldRefreshToken }, { $set: { used: true } });\n  const newRefreshToken = generateToken();\n  await db.refreshTokens.insertOne({ token: newRefreshToken, familyId: stored.familyId, used: false });\n  return { accessToken: signAccessToken(stored.userId), refreshToken: newRefreshToken };\n}",
    interviewQuestion:
      "How does rotating refresh tokens on every use let a system detect that one has been stolen, when a static, reusable refresh token couldn't?",
  },
  {
    id: "backend-csrf-protection",
    category: "backend",
    topic: "Security",
    title: "CSRF: Why Cookie-Based Auth Needs Extra Protection",
    difficulty: "Advanced",
    summary:
      "Cross-Site Request Forgery tricks a logged-in user's browser into making an unwanted request to your site using their existing session cookie — since the browser automatically attaches cookies to any request to that domain, a malicious site can trigger real actions without ever seeing the user's credentials.",
    explanation:
      "If your app authenticates via a cookie (rather than a token explicitly attached by JavaScript), the browser will automatically include that cookie on ANY request to your domain — including one triggered by a hidden form or image tag on a completely different, malicious website the user happens to have open in another tab. That malicious page can silently submit a form to `yourbank.com/transfer` and the browser attaches the user's real session cookie, making it look like a legitimate authenticated request. The standard defense is a CSRF token: a random value tied to the user's session, embedded in your own forms/pages, that must be included in state-changing requests — a malicious third-party site has no way to read or guess this token (same-origin policy prevents it from reading your page's content), so it can't include a valid one in its forged request. Modern browsers' `SameSite` cookie attribute (set to `Strict` or `Lax`) provides a complementary, simpler defense by refusing to send the cookie on cross-site requests in the first place. Note this is specifically a cookie-auth problem — APIs using a bearer token explicitly attached via JavaScript (not automatically sent by the browser) aren't vulnerable to CSRF in the same way.",
    code: "// Malicious page on evil.com — browser auto-attaches yourbank.com's cookie\n<form action=\"https://yourbank.com/transfer\" method=\"POST\">\n  <input type=\"hidden\" name=\"to\" value=\"attacker-account\">\n  <input type=\"hidden\" name=\"amount\" value=\"10000\">\n</form>\n<script>document.forms[0].submit()</script> <!-- fires automatically -->\n\n// Defense: CSRF token the malicious page has no way to know\n<form action=\"https://yourbank.com/transfer\" method=\"POST\">\n  <input type=\"hidden\" name=\"csrf_token\" value=\"a1b2c3...\"> <!-- tied to the real session -->\n  ...\n</form>\n// Server rejects the request if csrf_token is missing or doesn't match the session\n\n// Complementary defense: cookie flag\nSet-Cookie: session=abc123; SameSite=Strict; HttpOnly; Secure",
    interviewQuestion:
      "Why is a bearer token attached via a JavaScript Authorization header generally not vulnerable to CSRF the way a cookie-based session is?",
  },
  {
    id: "backend-rate-limit-headers",
    category: "backend",
    topic: "API Design",
    title: "Communicating Rate Limits to Clients via Headers",
    difficulty: "Intermediate",
    summary:
      "Returning rate limit status in response headers (limit, remaining, reset time) lets well-behaved clients proactively slow down before hitting 429s, rather than discovering the limit only by being rejected.",
    explanation:
      "Rejecting a request with `429 Too Many Requests` after the fact is necessary but not sufficient — a good API also tells clients where they stand via headers on every response, such as `X-RateLimit-Limit` (the total allowed in the window), `X-RateLimit-Remaining` (how many are left), and `X-RateLimit-Reset` (when the window resets). Well-implemented client libraries read these headers and self-throttle before ever hitting the limit, resulting in smoother behavior for both sides. When a 429 does happen, including a `Retry-After` header (seconds to wait, or a specific timestamp) tells the client exactly how long to back off rather than guessing or retrying immediately and making things worse. This is standard practice on virtually every major public API (GitHub, Stripe, Twitter) specifically because it turns rate limiting from a hard wall clients crash into, into a signal they can react to gracefully.",
    code: "// Every response includes current rate limit status\nHTTP/1.1 200 OK\nX-RateLimit-Limit: 1000\nX-RateLimit-Remaining: 42\nX-RateLimit-Reset: 1735693200\n\n// When actually rate-limited, tell the client exactly how long to wait\nHTTP/1.1 429 Too Many Requests\nRetry-After: 30\n{ \"error\": \"Rate limit exceeded. Try again in 30 seconds.\" }",
    interviewQuestion:
      "Why is it better API design to expose rate limit status via headers on every response, rather than only telling the client when they've already been rejected with a 429?",
  },
  {
    id: "backend-long-polling-mechanics",
    category: "backend",
    topic: "Real-Time Communication",
    title: "Long Polling: How It Actually Works Under the Hood",
    difficulty: "Intermediate",
    summary:
      "In long polling, the server holds an incoming request open (not responding immediately) until either new data is available or a timeout is reached — the client then immediately re-requests, creating the illusion of a push without needing WebSockets or SSE.",
    explanation:
      "A naive polling implementation has the client ask 'anything new?' every few seconds and immediately gets an empty response most of the time, wasting requests and adding latency (up to the polling interval) between an event happening and the client learning about it. Long polling instead has the server NOT respond immediately — it holds the connection open, waiting, and only sends a response once new data actually exists (or a timeout, commonly 30-60 seconds, is hit to avoid connections hanging forever and to work around intermediate proxy/load-balancer timeouts). As soon as the client gets a response (with data, or an empty timeout response), it immediately fires the next long-poll request, creating a continuous near-real-time loop. This works with plain HTTP/1.1 and no special infrastructure, at the cost of holding more open server-side connections/threads than a simple request-response API, and slightly higher latency than a true push mechanism like WebSockets.",
    code: "// Server: don't respond until there's actually something new (or timeout)\napp.get(\"/poll/messages\", async (req, res) => {\n  const timeout = Date.now() + 30_000;\n  while (Date.now() < timeout) {\n    const newMessages = await checkForNewMessages(req.query.since);\n    if (newMessages.length > 0) return res.json({ messages: newMessages });\n    await sleep(1000); // check again shortly, but don't respond yet\n  }\n  res.json({ messages: [] }); // timed out with nothing new — client will re-poll immediately\n});\n\n// Client: immediately re-polls after every response, creating a continuous loop\nasync function pollLoop(since) {\n  const { data } = await fetch(`/poll/messages?since=${since}`);\n  if (data.messages.length) handleNewMessages(data.messages);\n  pollLoop(Date.now()); // right back into another long-poll request\n}",
    interviewQuestion:
      "How does long polling reduce both wasted requests and latency compared to polling every few seconds, without needing WebSockets?",
  },
  {
    id: "backend-api-request-signing-hmac",
    category: "backend",
    topic: "Security",
    title: "API Request Signing with HMAC",
    difficulty: "Advanced",
    summary:
      "Instead of (or in addition to) an API key sent as-is, HMAC request signing has the client compute a cryptographic signature of the request using a shared secret, letting the server verify both authenticity and that the request wasn't tampered with in transit.",
    explanation:
      "A plain API key sent in a header proves the caller knows the key, but says nothing about whether the request body was altered after being sent (if TLS were somehow compromised or misconfigured) and the key itself is a single static secret that, if logged or leaked anywhere along the way, can be reused by anyone who obtains it. HMAC signing has the client compute a hash (like SHA-256) of the request's contents (method, path, body, timestamp) combined with a shared secret, and send that signature alongside the request; the server independently recomputes the same signature and compares. This proves the request came from someone who knows the secret AND that the specific request content wasn't modified in transit, since changing even one byte changes the hash entirely. Including a timestamp in the signed content and rejecting requests with an old timestamp also protects against replay attacks — a captured, valid signed request can't be resent later since its timestamp would now be stale.",
    code: "// Client: sign the request\nconst timestamp = Date.now();\nconst payload = `${method}:${path}:${JSON.stringify(body)}:${timestamp}`;\nconst signature = crypto.createHmac(\"sha256\", API_SECRET).update(payload).digest(\"hex\");\n\nfetch(url, {\n  method, body: JSON.stringify(body),\n  headers: { \"X-Timestamp\": timestamp, \"X-Signature\": signature },\n});\n\n// Server: recompute and compare, also reject stale timestamps (replay protection)\nconst age = Date.now() - Number(req.headers[\"x-timestamp\"]);\nif (age > 5 * 60 * 1000) throw new Error(\"Request expired\");\nconst expected = crypto.createHmac(\"sha256\", API_SECRET)\n  .update(`${req.method}:${req.path}:${JSON.stringify(req.body)}:${req.headers[\"x-timestamp\"]}`)\n  .digest(\"hex\");\nif (expected !== req.headers[\"x-signature\"]) throw new Error(\"Invalid signature\");",
    interviewQuestion:
      "What does HMAC request signing protect against that a plain, static API key sent in a header doesn't?",
  },
  {
    id: "backend-graphql-query-complexity-limits",
    category: "backend",
    topic: "API Design",
    title: "GraphQL Query Complexity and Depth Limiting",
    difficulty: "Advanced",
    summary:
      "Because a GraphQL client can request arbitrarily deep, nested relationships in a single query, an unbounded schema lets a client (accidentally or maliciously) construct a query that's extremely expensive to resolve — complexity and depth limits reject overly expensive queries before execution.",
    explanation:
      "A GraphQL schema that allows querying `user { friends { friends { friends { posts { comments { author { ... } } } } } } }` lets a single client request trigger an enormous, exponentially-expanding amount of backend work, especially if each level requires its own database query (the N+1 problem, compounded across multiple nesting levels). Depth limiting simply rejects queries nested beyond a configured maximum (say, 10 levels). Complexity/cost analysis is more precise: each field in the schema is assigned a 'cost' (a field returning a list of 100 items might cost more than a scalar field), and a query's total cost is computed and checked against a budget before the query is actually executed, rejecting anything over the limit with a clear error rather than letting the server discover the cost the hard way by grinding to a halt. Combined with DataLoader-based batching (solving the N+1 problem itself) and query timeouts, this is how production GraphQL APIs stay resilient against both malicious and accidentally-expensive client queries.",
    code: "# A maliciously (or accidentally) deep query\nquery {\n  user(id: 1) {\n    friends { friends { friends { friends { posts { comments { text } } } } } }\n  }\n}\n\n// Reject before execution based on computed cost\nconst complexity = calculateQueryComplexity(query, schema);\nif (complexity > MAX_ALLOWED_COMPLEXITY) {\n  throw new Error(`Query too complex: ${complexity} (max ${MAX_ALLOWED_COMPLEXITY})`);\n}",
    interviewQuestion:
      "Why is an unbounded GraphQL schema more vulnerable to a single expensive client request than a typical REST API, and how do complexity limits address it?",
  },
  {
    id: "backend-sticky-sessions-vs-stateless",
    category: "backend",
    topic: "Scaling & Performance",
    title: "Sticky Sessions vs Stateless Load Balancing",
    difficulty: "Advanced",
    summary:
      "Sticky sessions route a given client consistently to the same backend instance (needed if that instance holds in-memory session state); a stateless architecture stores session state externally (Redis, a database, or a signed token) so any instance can handle any request — the latter scales and fails over far more gracefully.",
    explanation:
      "If a server keeps session data in its own process memory, the load balancer must route a given user's every request to that SAME instance (sticky sessions, usually via a cookie identifying which backend to route to) — otherwise a different instance won't have that user's session and will treat them as logged out. This works but has real downsides: it defeats even load distribution (some instances can end up more loaded than others if their assigned users are more active), and if that specific instance crashes or is taken down for a deploy, all of its 'stuck' users lose their session entirely. A stateless architecture stores session state somewhere external and shared — Redis (fast, shared cache) or encoded directly in a signed JWT the client holds — so literally any backend instance can handle any request from any user, since none of them hold session state locally. This is what makes horizontal autoscaling and rolling deployments seamless: instances can be added, removed, or replaced freely without any user's session being tied to a specific one.",
    code: "// Sticky sessions: fragile, ties a user to one specific instance\n// Load balancer cookie: \"route-to: instance-3\"\n// If instance-3 crashes, every user pinned to it loses their session\n\n// Stateless: any instance can serve any request\napp.use(session({\n  store: new RedisStore({ client: redisClient }), // shared, not in-process\n  // ...\n}));\n// Instance 1, 2, or 3 — doesn't matter, they all read the same Redis session store",
    interviewQuestion:
      "Why does storing session state in each server's own memory make rolling deployments and autoscaling riskier than storing it in Redis or a signed token?",
  },
  {
    id: "backend-load-testing-methodology",
    category: "backend",
    topic: "Scaling & Performance",
    title: "Load Testing: Finding Limits Before Users Do",
    difficulty: "Intermediate",
    summary:
      "Load testing simulates realistic (and unrealistic, extreme) traffic against a system before it faces real users, revealing the actual breaking point, bottleneck, and failure mode — rather than discovering all three during a real traffic spike.",
    explanation:
      "Tools like k6, Locust, or JMeter simulate many concurrent virtual users hitting an API according to a defined pattern — a steady ramp-up to find the maximum sustainable throughput, a sudden spike to test autoscaling responsiveness, or a sustained high load over time to catch memory leaks or resource exhaustion that only appear after extended operation. The goal isn't just 'does it survive' but specifically: at what request rate does latency start degrading, which specific component becomes the bottleneck first (database connections, CPU, a slow downstream dependency), and does the system fail gracefully (clear errors, graceful degradation) or catastrophically (crashes, cascading failures) once past that point. Running this deliberately, on a schedule or before major launches, turns 'we hope it can handle the traffic' into a measured, known capacity — and often surfaces a bottleneck (a missing index, an unpooled connection, a synchronous call that should be async) that's far cheaper to fix in a controlled test than during a real incident.",
    code: "// k6 load test script (conceptual)\nimport http from 'k6/http';\nimport { check } from 'k6';\n\nexport const options = {\n  stages: [\n    { duration: '2m', target: 100 },   // ramp up to 100 virtual users\n    { duration: '5m', target: 100 },   // sustain\n    { duration: '2m', target: 1000 },  // spike\n    { duration: '2m', target: 0 },     // ramp down\n  ],\n};\n\nexport default function () {\n  const res = http.get('https://api.example.com/products');\n  check(res, { 'status is 200': (r) => r.status === 200, 'latency OK': (r) => r.timings.duration < 500 });\n}",
    interviewQuestion:
      "Why is deliberately running a load test before a product launch more valuable than just monitoring and reacting once real traffic arrives?",
  },
  {
    id: "backend-idempotent-vs-safe-methods",
    category: "backend",
    topic: "API Fundamentals",
    title: "Safe vs Idempotent HTTP Methods: The Precise Difference",
    difficulty: "Intermediate",
    summary:
      "'Safe' means a method has no side effects (GET, HEAD); 'idempotent' means calling it multiple times has the same effect as calling it once (GET, PUT, DELETE) — every safe method is idempotent, but not every idempotent method is safe, and mixing these up leads to real bugs in retry logic.",
    explanation:
      "A safe method doesn't change server state at all — GET should never create, modify, or delete anything, which is precisely what allows browsers, CDNs, and proxies to cache it and prefetch it without worrying about side effects. An idempotent method CAN change state, but calling it once versus many times produces the same end result — PUT (replace this resource with exactly this data) is idempotent because doing it 5 times leaves the resource in the same final state as doing it once; DELETE is idempotent because deleting an already-deleted resource is still 'deleted' either way (even if the second call returns 404 instead of 200, the end state is identical). POST is neither safe nor (by default) idempotent — calling it twice can create two separate resources. This distinction matters enormously for retry logic: it's always safe to automatically retry a GET or PUT that failed due to a network blip, but automatically retrying a POST can cause duplicate side effects (double-charging a payment) unless it's specifically made idempotent via a client-supplied idempotency key.",
    code: "GET    /users/42       -- safe (no side effects) AND idempotent\nPUT    /users/42       -- idempotent, but NOT safe (does change state)\nDELETE /users/42       -- idempotent, but NOT safe\nPOST   /payments       -- NEITHER safe nor idempotent by default — dangerous to retry blindly\n\n// Automatic retry logic can safely retry GET/PUT/DELETE on a network failure\n// It must NOT blindly retry a POST without an idempotency key",
    interviewQuestion:
      "Why is it safe for an HTTP client library to automatically retry a failed PUT request, but not a failed POST request, without additional precautions?",
  },
  {
    id: "backend-graceful-shutdown-signals",
    category: "backend",
    topic: "Deployment & Observability",
    title: "SIGTERM vs SIGKILL: Why Graceful Shutdown Needs Both Understood",
    difficulty: "Advanced",
    summary:
      "SIGTERM politely asks a process to shut down, giving it a chance to finish in-flight work and clean up; SIGKILL forcibly terminates it immediately with no chance to react — orchestrators send SIGTERM first and SIGKILL only after a grace period, so a slow-to-shutdown process gets forcibly killed anyway.",
    explanation:
      "When Kubernetes or another orchestrator wants to stop a container (during a deploy, scale-down, or node maintenance), it sends SIGTERM first — a signal a process can catch and handle, typically by stopping acceptance of new work, finishing in-flight requests, closing database connections cleanly, and then exiting on its own. If the process doesn't exit within a configured grace period (commonly 30 seconds, `terminationGracePeriodSeconds` in Kubernetes), the orchestrator escalates to SIGKILL, which cannot be caught or ignored — the process is terminated immediately, mid-operation, with no cleanup at all. This means a graceful shutdown handler that takes too long (waiting indefinitely for slow in-flight requests, for example) doesn't actually protect against forced termination — it just delays it, and anything still in-flight when SIGKILL arrives is abruptly cut off. Good practice is to have the SIGTERM handler apply its own internal timeout, shorter than the orchestrator's grace period, so it can attempt clean shutdown but still exit voluntarily before being forcibly killed.",
    code: "let shuttingDown = false;\nconst GRACEFUL_TIMEOUT_MS = 25_000; // shorter than Kubernetes' default 30s grace period\n\nprocess.on(\"SIGTERM\", async () => {\n  shuttingDown = true;\n  server.close(); // stop accepting new connections\n\n  const timeout = setTimeout(() => {\n    console.warn(\"Graceful shutdown timed out — forcing exit\");\n    process.exit(1); // exit voluntarily before SIGKILL arrives\n  }, GRACEFUL_TIMEOUT_MS);\n\n  await waitForInFlightRequestsToFinish();\n  clearTimeout(timeout);\n  process.exit(0);\n});\n// If this handler hangs forever, Kubernetes sends SIGKILL after its own grace period anyway",
    interviewQuestion:
      "If a SIGTERM handler waits indefinitely for slow requests to finish before exiting, what actually happens to those requests once the orchestrator's grace period expires?",
  },
  {
    id: "backend-api-mocking-for-frontend-dev",
    category: "backend",
    topic: "API Design",
    title: "API Mocking: Letting Frontend Work Before the Backend Exists",
    difficulty: "Basic",
    summary:
      "A mock API server returns realistic fake responses matching an agreed contract, letting frontend development proceed in parallel with backend implementation instead of blocking on it — exactly what a tool like Dev Life's own Mock API Generator provides.",
    explanation:
      "In a typical project, frontend code needs *something* to call while the real backend endpoint is still being built — without a mock, frontend work either stalls waiting for the backend, or gets built against assumptions that turn out wrong once the real API ships. A mock API serves pre-defined or dynamically-generated fake responses matching the AGREED shape (ideally derived from an OpenAPI spec both sides commit to upfront), so frontend components, loading states, and error handling can all be built and tested against realistic data immediately. Once the real backend endpoint is ready, switching the frontend's base URL from the mock to the real API should require no code changes at all if the contract was followed precisely — which is exactly why agreeing on the response shape (via a spec) before either side starts implementing is more valuable than the mock server itself.",
    code: "// Contract agreed upfront (e.g. via OpenAPI), before either side implements it\n// GET /api/products/:id -> { id, name, price, inStock }\n\n// Mock server returns fake data matching that EXACT shape\napp.get(\"/api/products/:id\", (req, res) => {\n  res.json({ id: req.params.id, name: \"Sample Product\", price: 29.99, inStock: true });\n});\n\n// Frontend built against the mock now works unchanged once pointed at the real API —\n// AS LONG AS the real API's response shape matches what was agreed",
    interviewQuestion:
      "Why does agreeing on the exact response shape (via a spec) before building a mock API matter more than the mock server itself?",
  },
  {
    id: "backend-openapi-contract-first-vs-code-first",
    category: "backend",
    topic: "API Design",
    title: "Contract-First vs Code-First API Design",
    difficulty: "Intermediate",
    summary:
      "Code-first generates the API spec from your implementation (like FastAPI auto-generating OpenAPI docs from Python code); contract-first writes the spec BEFORE any implementation exists, letting frontend and backend teams work in parallel against an agreed shape — each approach has real, different tradeoffs.",
    explanation:
      "Code-first (what FastAPI does by default) is convenient — you write normal application code with type hints, and the framework derives an accurate OpenAPI spec automatically, guaranteeing the docs never drift from the real implementation. The downside: the API's shape is effectively an implementation detail decided by whoever writes the backend code, and frontend teams have to wait for at least a first implementation before they know the exact shape to build against. Contract-first flips this: the team (frontend, backend, and often external API consumers) agrees on and writes the OpenAPI spec FIRST, generates server stubs and client SDKs from it, and only then does the actual backend logic get implemented inside those generated stubs — letting frontend and backend work fully in parallel from day one, and forcing more deliberate API design discussion before code makes decisions by default. Contract-first requires more upfront process and coordination; code-first is faster to get started with but can result in an API shape that reflects backend implementation convenience more than external consumer needs.",
    code: "# Contract-first: write this FIRST, before any implementation\nopenapi: 3.0.0\npaths:\n  /users/{id}:\n    get:\n      responses:\n        '200':\n          content:\n            application/json:\n              schema: { $ref: '#/components/schemas/User' }\n\n# Then generate server stubs AND a mock server from this same spec\n# Frontend builds against the mock; backend fills in the generated stub's logic\n# Both happen in PARALLEL, not sequentially",
    interviewQuestion:
      "What real coordination problem does contract-first API design solve that code-first (like FastAPI's auto-generated docs) doesn't?",
  },
  {
    id: "backend-idempotency-in-payment-systems",
    category: "backend",
    topic: "Architecture",
    title: "Why Payment APIs Are Obsessive About Idempotency",
    difficulty: "Advanced",
    summary:
      "Payment processing is the textbook case for idempotency done right — a network failure during a charge request leaves the client genuinely unable to know if it succeeded, and blindly retrying without an idempotency key risks a real, financially damaging double-charge.",
    explanation:
      "When a client calls a payment API and the connection drops before a response arrives, the request may have succeeded on the server (the charge went through) or failed (never processed) — from the client's perspective, these are indistinguishable, yet the correct next action is completely different (retry vs don't retry). This exact ambiguity is why Stripe and virtually every payment provider requires an idempotency key on charge-creation requests: the client generates a unique key once for a given logical charge attempt and includes it on every retry of that same attempt; the server checks if it's already processed a request with that key and, if so, returns the original result instead of charging again. This shifts responsibility for safety from 'hope the network doesn't fail at the wrong moment' to a concrete, verifiable mechanism — and it's why building a payment integration without understanding and correctly implementing idempotency keys is one of the most common sources of real financial bugs in production systems.",
    code: "// Client generates ONE key per logical charge attempt, reuses it on every retry\nconst idempotencyKey = crypto.randomUUID(); // generated once, stored locally\n\nasync function chargeWithRetry(amount, cardToken, key, attempt = 0) {\n  try {\n    return await api.post(\"/charges\", { amount, cardToken }, {\n      headers: { \"Idempotency-Key\": key },\n    });\n  } catch (err) {\n    if (isNetworkError(err) && attempt < 3) {\n      return chargeWithRetry(amount, cardToken, key, attempt + 1); // SAME key — safe to retry\n    }\n    throw err;\n  }\n}",
    interviewQuestion:
      "A client's payment request times out with no response. Why can't the client simply check 'did it succeed' and decide whether to retry based on that, and how does an idempotency key sidestep the problem entirely?",
  },
];
