// 30 networking topics for Study Hub.
export default [
  {
    id: "networking-http1-vs-http2-vs-http3",
    category: "networking",
    difficulty: "Intermediate",
    topic: "HTTP Evolution",
    title: "HTTP/1.1 vs HTTP/2 vs HTTP/3",
    summary:
      "Each HTTP version fixes the previous one's biggest bottleneck: connection reuse, then head-of-line blocking, then TCP itself.",
    explanation:
      "HTTP/1.1 introduced persistent connections and pipelining, but requests on a connection are still processed one at a time (head-of-line blocking at the app layer), which is why browsers opened 6+ parallel TCP connections per host. HTTP/2 introduced binary framing and multiplexing — many requests/responses interleave on a single TCP connection using streams, plus header compression (HPACK) and server push. But HTTP/2 still runs over TCP, so a single lost packet blocks all streams (TCP-level head-of-line blocking). HTTP/3 replaces TCP with QUIC (built on UDP), giving each stream independent loss recovery so one dropped packet only affects its own stream, plus faster connection setup (0-RTT/1-RTT combined with TLS 1.3) and seamless connection migration across network changes.",
    code: "# HTTP/1.1 - 6 parallel TCP connections per host, blocking\nGET /style.css HTTP/1.1\nHost: example.com\nConnection: keep-alive\n\n# HTTP/2 - single TCP connection, multiplexed binary streams\n:method: GET\n:path: /style.css\n:scheme: https\n:authority: example.com\n\n# HTTP/3 - QUIC over UDP, independent stream loss recovery\n$ curl --http3 https://example.com\n* Using HTTP/3\n* Connection state changed (MAX_STREAMS_BIDI updated)\n< HTTP/3 200",
    interviewQuestion:
      "Why does HTTP/2 still suffer from head-of-line blocking even though it multiplexes requests, and how does HTTP/3 solve it?",
  },
  {
    id: "networking-tcp-vs-udp",
    category: "networking",
    difficulty: "Basic",
    topic: "Transport Layer",
    title: "TCP vs UDP",
    summary:
      "TCP is a reliable, ordered, connection-oriented protocol; UDP is a fast, connectionless, best-effort protocol with no guarantees.",
    explanation:
      "TCP (Transmission Control Protocol) establishes a connection via a three-way handshake, guarantees ordered delivery, retransmits lost packets, and applies flow/congestion control — ideal for HTTP, file transfer, and email where correctness matters more than speed. UDP (User Datagram Protocol) simply sends datagrams with no handshake, no ordering guarantee, and no retransmission — the application must handle any reliability it needs. This makes UDP much lower latency, which is why it's used for DNS queries, video streaming, gaming, and VoIP where a dropped packet is better than a delayed one. QUIC (used by HTTP/3) is built on UDP but adds its own reliability and congestion control in user space, getting TCP-like guarantees without TCP's head-of-line blocking.",
    code: "// TCP: connection-oriented, reliable\nconst net = require('net');\nconst client = net.createConnection({ port: 443, host: 'example.com' });\nclient.on('connect', () => console.log('3-way handshake complete'));\n\n// UDP: connectionless, fire-and-forget\nconst dgram = require('dgram');\nconst socket = dgram.createSocket('udp4');\nsocket.send('DNS query bytes', 53, '8.8.8.8');\n// No handshake, no delivery guarantee, no ordering",
    interviewQuestion:
      "Why does DNS mostly use UDP while HTTP traditionally uses TCP, and what happens when a DNS response is too large for UDP?",
  },
  {
    id: "networking-tls-handshake",
    category: "networking",
    difficulty: "Advanced",
    topic: "Security",
    title: "How does the TLS Handshake work?",
    summary:
      "TLS negotiates encryption algorithms, verifies the server's identity via certificate, and derives shared session keys before any app data is sent.",
    explanation:
      "In TLS 1.2, the handshake takes two round trips: ClientHello (supported ciphers, random value) -> ServerHello (chosen cipher, certificate, random value) -> key exchange -> Finished messages on both sides, then encrypted application data flows. TLS 1.3 cut this to one round trip by having the client guess the key exchange parameters in the ClientHello itself, and it removed weak/legacy ciphers, static RSA key exchange, and renegotiation to reduce attack surface. The server's certificate, issued by a trusted CA, proves the server owns the domain's private key, preventing man-in-the-middle impersonation. After the handshake, both sides derive symmetric session keys (via ECDHE) used for fast bulk encryption for the rest of the connection — asymmetric crypto is only used to bootstrap trust, not to encrypt the actual traffic.",
    code: "TLS 1.3 handshake (1-RTT):\n\nClient                                Server\n  ClientHello\n  + key_share, supported_versions  -->\n                                  <--  ServerHello\n                                       + key_share\n                                       {EncryptedExtensions}\n                                       {Certificate}\n                                       {CertificateVerify}\n                                       {Finished}\n  {Finished}                     -->\n  [Application Data]             <-->  [Application Data]\n\n$ openssl s_client -connect example.com:443 -tls1_3",
    interviewQuestion:
      "Walk me through what happens between a browser and a server from the moment you hit Enter on an HTTPS URL to the first byte of the page loading.",
  },
  {
    id: "networking-dns-resolution",
    category: "networking",
    difficulty: "Intermediate",
    topic: "DNS",
    title: "DNS Resolution Process",
    summary:
      "DNS resolves a hostname to an IP address through a chain of caches and authoritative lookups: browser, OS, recursive resolver, root, TLD, then authoritative.",
    explanation:
      "When you type a URL, the browser first checks its own cache, then the OS cache (and hosts file), then queries a recursive resolver (often the ISP's or a public one like 8.8.8.8). If the resolver doesn't have it cached, it asks a root nameserver, which points to the TLD nameserver (e.g. for .com), which points to the authoritative nameserver for the domain, which finally returns the actual IP. Each response carries a TTL controlling how long it can be cached at each layer. Record types matter: A (IPv4), AAAA (IPv6), CNAME (alias to another name), MX (mail server), TXT (arbitrary text, often for verification/SPF), and NS (nameserver delegation). This whole process typically adds tens to hundreds of milliseconds of latency, which is why DNS prefetching and low TTLs vs high TTLs are a real performance/flexibility tradeoff.",
    code: "$ dig example.com +trace\n\n; Root servers respond with TLD nameservers for .com\ncom.  172800  IN  NS  a.gtld-servers.net.\n\n; TLD servers respond with authoritative NS for example.com\nexample.com.  86400  IN  NS  ns1.example-dns.com.\n\n; Authoritative server returns the A record\nexample.com.  300  IN  A  93.184.216.34\n\n$ dig example.com A +short\n93.184.216.34",
    interviewQuestion:
      "What is the full chain of lookups that happens when a DNS resolver has nothing cached, and what does the TTL control at each hop?",
  },
  {
    id: "networking-cdn-fundamentals",
    category: "networking",
    difficulty: "Intermediate",
    topic: "CDN",
    title: "CDN Fundamentals",
    summary:
      "A CDN caches content at edge servers geographically close to users, cutting latency and offloading traffic from the origin server.",
    explanation:
      "A Content Delivery Network is a distributed network of edge/PoP (point of presence) servers that cache static (and sometimes dynamic) content close to end users. DNS or anycast routing sends a user's request to the nearest edge node; on a cache hit the edge serves the response directly without contacting the origin, drastically reducing latency and origin load. On a cache miss the edge fetches from origin, serves the response, and caches it per the Cache-Control/CDN-specific rules for next time. CDNs also provide DDoS mitigation, TLS termination at the edge, image optimization, and edge compute (e.g. Cloudflare Workers, Lambda@Edge) for running logic close to users. Cache invalidation/purging is the classic hard problem — content updates need explicit purges or cache-busting URLs (versioned filenames, query hashes) to avoid serving stale assets.",
    code: "# Cache-Control tells the CDN how long to cache\nCache-Control: public, max-age=31536000, immutable\n\n# Cache-busting via content hash in filename\n<script src=\"/static/app.3f2a91.js\"></script>\n\n# Checking if a CDN served from edge cache\n$ curl -I https://cdn.example.com/logo.png\nHTTP/2 200\ncf-cache-status: HIT\nage: 4213\nx-served-by: cache-lax-kwhp1234-LAX",
    interviewQuestion:
      "How would you design a caching and invalidation strategy for a CDN serving a frequently-updated JS bundle?",
  },
  {
    id: "networking-http-headers-deep-dive",
    category: "networking",
    difficulty: "Basic",
    topic: "HTTP Fundamentals",
    title: "HTTP Headers Deep Dive",
    summary:
      "HTTP headers are key-value metadata that describe the request/response — controlling caching, content type, auth, and connection behavior.",
    explanation:
      "Headers are grouped by purpose: general (Date, Connection), request (Host, User-Agent, Accept, Authorization), response (Server, Set-Cookie, Location), and entity/representation (Content-Type, Content-Length, Content-Encoding). Content negotiation headers like Accept and Accept-Language let a client tell the server what formats/languages it prefers. Security headers like Content-Security-Policy, Strict-Transport-Security, and X-Frame-Options harden responses against XSS and clickjacking. Custom headers are conventionally prefixed with X- (though this is now deprecated in favor of just picking a clear name), and headers are case-insensitive per the HTTP spec. In HTTP/2+, headers are compressed with HPACK/QPACK rather than sent as raw text, but they're conceptually the same key-value pairs.",
    code: "GET /api/users/42 HTTP/1.1\nHost: api.example.com\nAccept: application/json\nAuthorization: Bearer eyJhbGciOi...\nUser-Agent: Mozilla/5.0\nAccept-Encoding: gzip, br\n\nHTTP/1.1 200 OK\nContent-Type: application/json; charset=utf-8\nContent-Length: 128\nCache-Control: private, max-age=60\nStrict-Transport-Security: max-age=63072000\nSet-Cookie: session=abc123; HttpOnly; Secure; SameSite=Strict",
    interviewQuestion:
      "What's the difference between Content-Type and Accept headers, and what happens if a server ignores the Accept header?",
  },
  {
    id: "networking-http-caching-headers",
    category: "networking",
    difficulty: "Advanced",
    topic: "Caching",
    title: "HTTP Caching Headers",
    summary:
      "Cache-Control, ETag, and Last-Modified together decide whether a cached response can be reused, and how to revalidate it cheaply.",
    explanation:
      "Cache-Control is the primary directive: max-age sets freshness lifetime, no-cache means 'revalidate before use' (not 'don't cache'), no-store means never cache at all, and private/public control whether shared caches (CDNs, proxies) may store the response. Once a cached response's max-age expires, the browser doesn't necessarily refetch the whole thing — it can send a conditional request using If-None-Match (with the cached ETag) or If-Modified-Since (with Last-Modified). If the resource hasn't changed, the server responds 304 Not Modified with no body, saving bandwidth while still confirming freshness. ETag is a content hash/fingerprint and is more reliable than Last-Modified (which only has second-level granularity and can miss changes that don't alter mtime). Immutable assets (hashed filenames) should use max-age=31536000, immutable to skip revalidation entirely.",
    code: "# First request\nHTTP/1.1 200 OK\nCache-Control: max-age=3600\nETag: \"33a64df551\"\nLast-Modified: Wed, 01 Jul 2026 10:00:00 GMT\n\n# After max-age expires, browser revalidates\nGET /style.css HTTP/1.1\nIf-None-Match: \"33a64df551\"\nIf-Modified-Since: Wed, 01 Jul 2026 10:00:00 GMT\n\n# Server confirms nothing changed\nHTTP/1.1 304 Not Modified\nCache-Control: max-age=3600",
    interviewQuestion:
      "Explain the difference between Cache-Control: no-cache and Cache-Control: no-store, and how a 304 response fits into revalidation.",
  },
  {
    id: "networking-cors-preflight",
    category: "networking",
    difficulty: "Advanced",
    topic: "Security",
    title: "CORS Preflight Requests",
    summary:
      "Browsers send an OPTIONS preflight before certain cross-origin requests to check whether the server allows them, protecting users from unauthorized cross-site calls.",
    explanation:
      "CORS (Cross-Origin Resource Sharing) is a browser-enforced security mechanism, not a server-side restriction — the server always processes the request, but the browser blocks the JS from reading the response if headers don't permit it. 'Simple requests' (GET/POST/HEAD with a few whitelisted headers and content types like form-encoded) skip the preflight and go straight through, with the browser just checking the Access-Control-Allow-Origin header on the response. Requests with custom headers (e.g. Authorization), non-simple methods (PUT, DELETE, PATCH), or JSON content-type trigger a preflight: the browser sends an OPTIONS request with Access-Control-Request-Method and Access-Control-Request-Headers, and the server must respond with matching Access-Control-Allow-* headers or the browser blocks the actual request. Access-Control-Allow-Credentials must be explicitly 'true' (and Allow-Origin cannot be '*') if the request includes cookies or Authorization headers. Preflight responses can be cached via Access-Control-Max-Age to avoid repeating the OPTIONS round trip on every call.",
    code: "// Actual request from browser JS\nfetch('https://api.example.com/orders', {\n  method: 'PUT',\n  headers: { 'Content-Type': 'application/json', Authorization: 'Bearer xyz' },\n  body: JSON.stringify({ status: 'shipped' })\n});\n\n// Browser auto-sends preflight first:\nOPTIONS /orders HTTP/1.1\nOrigin: https://app.example.com\nAccess-Control-Request-Method: PUT\nAccess-Control-Request-Headers: authorization, content-type\n\n// Server must respond:\nHTTP/1.1 204 No Content\nAccess-Control-Allow-Origin: https://app.example.com\nAccess-Control-Allow-Methods: GET, POST, PUT, DELETE\nAccess-Control-Allow-Headers: authorization, content-type\nAccess-Control-Max-Age: 86400",
    interviewQuestion:
      "Why does a PUT request with a JSON body trigger a CORS preflight but a simple form POST doesn't, and what happens if the preflight fails?",
  },
  {
    id: "networking-websockets-protocol",
    category: "networking",
    difficulty: "Intermediate",
    topic: "Realtime",
    title: "WebSockets Protocol",
    summary:
      "WebSockets upgrade an HTTP connection into a persistent, full-duplex TCP channel allowing both client and server to push messages at any time.",
    explanation:
      "A WebSocket connection starts as a normal HTTP request with an Upgrade: websocket header; if the server supports it, it responds with 101 Switching Protocols and the TCP connection is repurposed for the WebSocket framing protocol instead of HTTP. After that, both sides can send discrete messages (text or binary frames) at any time without the request/response pattern of HTTP — true full-duplex, low-overhead communication ideal for chat, live dashboards, multiplayer games, and collaborative editing. Unlike HTTP polling, there's no repeated header overhead or connection setup per message. The connection stays open until explicitly closed, so servers must handle reconnection logic, heartbeats (ping/pong frames) to detect dead connections, and horizontal scaling concerns since a client is 'stuck' on whichever server instance it connected to (often solved with sticky sessions or a pub/sub backplane like Redis).",
    code: "// Client\nconst ws = new WebSocket('wss://example.com/chat');\nws.onopen = () => ws.send(JSON.stringify({ type: 'join', room: 'lobby' }));\nws.onmessage = (event) => console.log('received:', event.data);\n\n// Handshake (HTTP -> WebSocket upgrade)\nGET /chat HTTP/1.1\nHost: example.com\nUpgrade: websocket\nConnection: Upgrade\nSec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==\nSec-WebSocket-Version: 13\n\nHTTP/1.1 101 Switching Protocols\nUpgrade: websocket\nConnection: Upgrade\nSec-WebSocket-Accept: s3pPLMBiTxaQ9kYGzzhZRbK+xOo=",
    interviewQuestion:
      "How does a WebSocket connection start as HTTP and switch protocols, and what problems arise when scaling WebSocket servers horizontally?",
  },
  {
    id: "networking-server-sent-events",
    category: "networking",
    difficulty: "Intermediate",
    topic: "Realtime",
    title: "Server-Sent Events (SSE)",
    summary:
      "SSE lets a server push a one-way stream of text events to the browser over a single long-lived HTTP connection, using a simple built-in reconnect protocol.",
    explanation:
      "Server-Sent Events use a regular HTTP response with Content-Type: text/event-stream that never closes; the server writes newline-delimited 'data:' events over time and the browser's EventSource API parses them incrementally. It's simpler than WebSockets because it's just HTTP (works through existing proxies/load balancers, no protocol upgrade) and the browser automatically reconnects on drop, replaying from the last received event ID if the server supports it (Last-Event-ID header). The tradeoff is it's one-way only — server to client — so it's a good fit for live notifications, stock tickers, or streaming LLM token output, but not for chat where the client also needs to push data (that requires a WebSocket or a separate POST endpoint alongside SSE). It's also limited by the browser's max concurrent HTTP connections per origin in HTTP/1.1 (mitigated by HTTP/2 multiplexing).",
    code: "// Client\nconst source = new EventSource('/api/notifications');\nsource.onmessage = (e) => console.log('event:', e.data);\nsource.addEventListener('price-update', (e) => updateTicker(e.data));\n\n// Server response (stays open)\nHTTP/1.1 200 OK\nContent-Type: text/event-stream\nCache-Control: no-cache\nConnection: keep-alive\n\ndata: {\"msg\":\"connected\"}\n\nevent: price-update\ndata: {\"symbol\":\"AAPL\",\"price\":193.2}\nid: 42\n\n: heartbeat comment to keep connection alive",
    interviewQuestion:
      "When would you choose Server-Sent Events over WebSockets, and how does automatic reconnection with Last-Event-ID work?",
  },
  {
    id: "networking-long-polling",
    category: "networking",
    difficulty: "Basic",
    topic: "Realtime",
    title: "Long Polling",
    summary:
      "Long polling simulates real-time updates by holding an HTTP request open until the server has new data, then immediately reopening it.",
    explanation:
      "Instead of a client polling every N seconds (wasteful, adds latency), long polling has the client send a request that the server intentionally holds open (not responding) until either new data is available or a timeout is hit. As soon as the client gets a response, it immediately issues another request, creating the illusion of a persistent push channel using plain HTTP request/response semantics. It was the standard technique before WebSockets and SSE existed (and is still used as a fallback, e.g. in Socket.IO), because it works everywhere HTTP works with no special browser API or protocol upgrade. Downsides: higher latency than true push (there's always a small gap while reconnecting), more server resource usage holding connections open, and more overhead per 'message' since each one is a fresh HTTP request/response with full headers.",
    code: "// Simplified long-polling client loop\nasync function poll() {\n  try {\n    const res = await fetch('/api/updates?since=' + lastId, { signal: AbortSignal.timeout(30000) });\n    const data = await res.json();\n    handleUpdate(data);\n    lastId = data.id;\n  } catch (err) {\n    // timeout is expected, just means no new data\n  }\n  poll(); // immediately reopen\n}\npoll();\n\n// Server holds the request until data exists or 30s elapses\napp.get('/api/updates', async (req, res) => {\n  const data = await waitForNewData(req.query.since, 30000);\n  res.json(data || { id: req.query.since });\n});",
    interviewQuestion:
      "How does long polling differ from short polling and WebSockets, and why might you still use it as a fallback today?",
  },
  {
    id: "networking-http-status-codes",
    category: "networking",
    difficulty: "Basic",
    topic: "HTTP Fundamentals",
    title: "HTTP Status Codes Deep Dive",
    summary:
      "Status codes are grouped by first digit — 1xx informational, 2xx success, 3xx redirect, 4xx client error, 5xx server error — each with specific semantics.",
    explanation:
      "2xx: 200 OK is generic success, 201 Created is for successful resource creation (often with a Location header), 204 No Content means success with no body. 3xx: 301 is a permanent redirect (cacheable, changes bookmarks/SEO), 302/307 are temporary redirects (307 explicitly preserves the HTTP method, unlike 302 which browsers historically convert to GET), 304 Not Modified is used for cache revalidation. 4xx: 400 is a malformed request, 401 means unauthenticated (no or invalid credentials), 403 means authenticated but not authorized, 404 means resource not found, 409 is a conflict (e.g. version mismatch), 422 is semantically invalid data, 429 is rate limiting. 5xx: 500 is a generic server error, 502 Bad Gateway means an upstream server gave an invalid response, 503 means the server is temporarily overloaded/down, 504 Gateway Timeout means an upstream didn't respond in time. Mixing these up (like returning 200 with an error body, or 401 vs 403) is a very common API design mistake.",
    code: "HTTP/1.1 201 Created\nLocation: /api/users/551\n\nHTTP/1.1 401 Unauthorized\nWWW-Authenticate: Bearer error=\"invalid_token\"\n\nHTTP/1.1 403 Forbidden\n{\"error\": \"You do not have permission to delete this resource\"}\n\nHTTP/1.1 429 Too Many Requests\nRetry-After: 30\n\nHTTP/1.1 502 Bad Gateway\n{\"error\": \"upstream service unavailable\"}",
    interviewQuestion:
      "What's the practical difference between 401 and 403, and between 502, 503, and 504?",
  },
  {
    id: "networking-rest-vs-graphql-vs-grpc",
    category: "networking",
    difficulty: "Advanced",
    topic: "API Design",
    title: "REST vs GraphQL vs gRPC",
    summary:
      "REST models APIs as resources over HTTP verbs, GraphQL lets clients query exactly the fields they need, and gRPC uses binary protobufs over HTTP/2 for high-performance service-to-service calls.",
    explanation:
      "REST is resource-oriented (GET /users/1, POST /users), relies on HTTP semantics (status codes, caching, verbs), and is simple and widely understood but prone to over-fetching (getting fields you don't need) or under-fetching (needing multiple round trips for nested data). GraphQL exposes a single endpoint with a typed schema; clients specify exactly the fields/relations they want in one query, solving over/under-fetching, but it trades away HTTP-level caching (everything is typically POST to one URL) and adds complexity around query cost analysis, N+1 resolver problems, and schema governance. gRPC uses Protocol Buffers (compact binary serialization) over HTTP/2, generating strongly-typed client/server stubs, and supports streaming (client, server, or bidirectional) — it's fast and efficient, making it the default choice for internal microservice-to-microservice communication, but it's not natively browser-friendly (needs gRPC-Web/a proxy) and isn't human-readable on the wire like JSON.",
    code: "// REST: multiple round trips for nested data\nGET /users/1        -> { id, name }\nGET /users/1/posts  -> [{ id, title }]\n\n// GraphQL: one request, exact fields\nquery {\n  user(id: 1) {\n    name\n    posts { title }\n  }\n}\n\n// gRPC: typed contract (.proto), binary over HTTP/2\nservice UserService {\n  rpc GetUser(GetUserRequest) returns (User);\n  rpc StreamOrders(OrderQuery) returns (stream Order);\n}\nmessage User { int32 id = 1; string name = 2; }",
    interviewQuestion:
      "You're designing an API for both a public-facing web client and internal microservice communication — would you pick the same protocol for both? Why or why not?",
  },
  {
    id: "networking-api-rate-limiting",
    category: "networking",
    difficulty: "Advanced",
    topic: "API Design",
    title: "API Rate Limiting",
    summary:
      "Rate limiting caps how many requests a client can make in a time window, protecting backend resources using strategies like token bucket, sliding window, or fixed window counters.",
    explanation:
      "Fixed window (e.g. 100 requests per minute, reset on the minute boundary) is simple but allows bursts of 2x the limit right at window boundaries. Sliding window log/counter smooths this out by tracking requests over a rolling time frame, at the cost of more memory/computation. Token bucket allows bursts up to a bucket size while enforcing a steady average refill rate — this is the most common algorithm in production (e.g. AWS API Gateway, Stripe) because it tolerates short spikes without punishing normal usage patterns. Leaky bucket enforces a strictly constant outflow rate, smoothing bursts entirely, often used for traffic shaping. Rate limits are typically communicated via response headers (X-RateLimit-Limit/Remaining/Reset) and a 429 status with a Retry-After header when exceeded. In distributed systems, rate limiting state needs a shared store like Redis (with atomic INCR + EXPIRE, or a Lua script) since per-instance in-memory counters don't work across multiple servers.",
    code: "// Token bucket rate limiter using Redis\nasync function allowRequest(userId) {\n  const key = 'rl:' + userId;\n  const [count] = await redis\n    .multi()\n    .incr(key)\n    .expire(key, 60, 'NX')\n    .exec();\n  return count <= 100; // 100 req/min\n}\n\nHTTP/1.1 429 Too Many Requests\nX-RateLimit-Limit: 100\nX-RateLimit-Remaining: 0\nX-RateLimit-Reset: 1751360400\nRetry-After: 42",
    interviewQuestion:
      "Compare token bucket vs fixed window rate limiting — why does token bucket tend to be preferred for public APIs, and how would you implement rate limiting across multiple server instances?",
  },
  {
    id: "networking-load-balancing-basics",
    category: "networking",
    difficulty: "Intermediate",
    topic: "Infrastructure",
    title: "Load Balancing Basics",
    summary:
      "A load balancer distributes incoming traffic across multiple backend servers to improve availability, scalability, and fault tolerance.",
    explanation:
      "Load balancers operate at Layer 4 (transport, routing based on IP/port — fast, protocol-agnostic) or Layer 7 (application, routing based on HTTP content like path/headers/cookies — smarter but more overhead). Common algorithms: round robin (cycle through servers evenly), least connections (send to the server with fewest active connections, better for uneven request durations), IP hash (same client always hits the same server, useful for session affinity without shared session storage), and weighted variants for heterogeneous server capacity. Load balancers also perform health checks, automatically removing unhealthy backends from rotation, and provide a single stable entry point (often with TLS termination) so backend servers can scale horizontally without clients knowing. Sticky sessions (session affinity) are needed when server-side state isn't shared, but they reduce load balancing effectiveness and complicate scaling — the better long-term fix is externalizing session state to Redis or similar.",
    code: "# nginx L7 load balancer config\nupstream backend {\n    least_conn;\n    server 10.0.1.10:3000 weight=3;\n    server 10.0.1.11:3000 weight=1;\n    server 10.0.1.12:3000 backup;\n}\n\nserver {\n    listen 443 ssl;\n    location / {\n        proxy_pass http://backend;\n        proxy_set_header X-Real-IP $remote_addr;\n    }\n}\n\n# health check removes unhealthy nodes automatically",
    interviewQuestion:
      "What's the difference between Layer 4 and Layer 7 load balancing, and when would you use least-connections over round robin?",
  },
  {
    id: "networking-reverse-proxy-vs-forward-proxy",
    category: "networking",
    difficulty: "Intermediate",
    topic: "Infrastructure",
    title: "Reverse Proxy vs Forward Proxy",
    summary:
      "A forward proxy sits in front of clients and hides them from servers; a reverse proxy sits in front of servers and hides them from clients.",
    explanation:
      "A forward proxy acts on behalf of the client — the client explicitly configures it (or it's transparently intercepted) and it forwards requests to arbitrary destination servers, commonly used for corporate content filtering, anonymizing client IPs, or bypassing geo-restrictions. The destination server sees the proxy's IP, not the real client's. A reverse proxy acts on behalf of the server — it sits in front of one or more backend servers and clients talk to it without knowing (or needing to know) which backend actually handled the request. Reverse proxies (nginx, HAProxy, Envoy) commonly handle load balancing, TLS termination, caching, compression, and request routing/rewriting, and they shield backend infrastructure details from the public internet. A CDN edge node is essentially a specialized reverse proxy with caching baked in.",
    code: "# Forward proxy: client configures it explicitly\n# Browser proxy settings -> corporate-proxy.internal:8080 -> internet\n\n# Reverse proxy: nginx in front of app servers\nserver {\n    listen 80;\n    server_name example.com;\n    location / {\n        proxy_pass http://127.0.0.1:4000;  # backend server\n        proxy_set_header Host $host;\n        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;\n    }\n}\n# Client only ever talks to example.com, never sees port 4000",
    interviewQuestion:
      "Give a real-world example of a forward proxy and a reverse proxy, and explain who each one is 'hiding' — the client or the server.",
  },
  {
    id: "networking-keep-alive-connections",
    category: "networking",
    difficulty: "Basic",
    topic: "Connection Management",
    title: "Keep-Alive Connections",
    summary:
      "HTTP Keep-Alive reuses a single TCP connection for multiple requests instead of opening a new connection per request, avoiding repeated handshake overhead.",
    explanation:
      "Before Keep-Alive, HTTP/1.0 opened a brand new TCP connection (plus a TLS handshake for HTTPS) for every single request, which was extremely slow given TCP's connection setup cost. HTTP/1.1 made persistent connections the default via Connection: keep-alive, letting multiple sequential requests reuse the same TCP connection until it's explicitly closed or times out. This avoids repeating the TCP three-way handshake and TLS handshake for every request, cutting latency significantly especially over high-latency networks. Servers configure a keep-alive timeout (how long to hold an idle connection open) and a max request count per connection, balancing resource usage (idle connections still consume memory/file descriptors) against the connection-reuse benefit. HTTP/2 takes this further with true multiplexing over one connection rather than just serial reuse.",
    code: "GET /page1 HTTP/1.1\nHost: example.com\nConnection: keep-alive\n\nHTTP/1.1 200 OK\nConnection: keep-alive\nKeep-Alive: timeout=5, max=1000\n\n# Same TCP connection reused for next request, no new handshake\nGET /page2 HTTP/1.1\nHost: example.com\nConnection: keep-alive\n\n# nginx config\nkeepalive_timeout 65;\nkeepalive_requests 1000;",
    interviewQuestion:
      "What overhead does Keep-Alive save compared to opening a new connection per request, and why does this matter more over HTTPS than plain HTTP?",
  },
  {
    id: "networking-connection-pooling",
    category: "networking",
    difficulty: "Advanced",
    topic: "Connection Management",
    title: "Connection Pooling",
    summary:
      "Connection pooling maintains a reusable set of pre-established connections (to a database, upstream API, etc.) to avoid the cost of creating a new connection for every operation.",
    explanation:
      "Establishing a new TCP (and possibly TLS) connection, and for databases also authenticating and setting session state, is expensive relative to the actual work of a single request. A connection pool keeps a set of already-open connections ready to be checked out, used, and returned rather than torn down, dramatically reducing latency under load. Pools are configured with a min/max size, an idle timeout (close connections unused for too long), and a max lifetime (recycle connections periodically to avoid issues like stale DNS or long-lived connection leaks). Undersized pools cause request queuing/timeouts under load; oversized pools can overwhelm the downstream service (e.g. exceeding a database's max_connections) — sizing is usually driven by Little's Law relating concurrency, throughput, and latency. In serverless/highly concurrent environments, connection pooling gets tricky because each function instance might want its own pool, motivating external poolers like PgBouncer for databases.",
    code: "// Node.js pg connection pool\nconst { Pool } = require('pg');\nconst pool = new Pool({\n  host: 'db.internal',\n  max: 20,              // max connections in pool\n  idleTimeoutMillis: 30000,\n  connectionTimeoutMillis: 2000,\n});\n\n// Checkout, use, auto-return\nconst client = await pool.connect();\ntry {\n  const res = await client.query('SELECT * FROM users WHERE id = $1', [42]);\n} finally {\n  client.release(); // back to the pool, not closed\n}",
    interviewQuestion:
      "How would you size a database connection pool for a service handling 500 requests/sec, and what happens if the pool is too small versus too large?",
  },
  {
    id: "networking-quic-protocol",
    category: "networking",
    difficulty: "Advanced",
    topic: "HTTP Evolution",
    title: "QUIC Protocol",
    summary:
      "QUIC is a UDP-based transport protocol that combines encrypted, reliable, multiplexed streams with fast connection setup, forming the foundation of HTTP/3.",
    explanation:
      "QUIC (Quick UDP Internet Connections) reimplements the reliability and congestion control that TCP provides, but in user space on top of UDP, so it isn't constrained by decades of ossified TCP behavior in OS kernels and middleboxes. It bundles the transport and TLS 1.3 handshake into one exchange, enabling connection establishment in one round trip (or zero, for resumed connections via 0-RTT), versus TCP+TLS's combined multiple round trips. QUIC streams are independently reliable — a lost packet only stalls the stream it belongs to, eliminating the TCP-level head-of-line blocking that plagues HTTP/2. Connections are identified by a Connection ID rather than the traditional IP/port 4-tuple, so QUIC supports seamless connection migration — e.g. switching from WiFi to cellular without dropping the session. The tradeoff is CPU overhead (encryption/reliability logic runs in user space instead of optimized kernel TCP stacks) and some networks/firewalls still throttle or block UDP.",
    code: "$ curl --http3-only -v https://cloudflare-quic.com\n* QUIC connection established in 1-RTT\n* ALPN: h3\n\n# QUIC stream independence (conceptual)\nStream 0: [pkt1][pkt2][LOST][pkt4]  <- stalls only stream 0\nStream 4: [pkt1][pkt2][pkt3][pkt4]  <- unaffected, keeps flowing\n\n# Connection migration: same Connection ID survives network change\nWiFi (192.168.1.5) --> Cellular (10.20.30.1)\nConnection ID: 8f3e9a21... (unchanged)",
    interviewQuestion:
      "Why does QUIC implement its own congestion control and reliability instead of just using TCP, and what does 'connection migration' buy you on mobile networks?",
  },
  {
    id: "networking-ip-addressing-basics",
    category: "networking",
    difficulty: "Basic",
    topic: "IP Fundamentals",
    title: "IP Addressing Basics",
    summary:
      "IP addresses uniquely identify devices on a network — IPv4 uses 32-bit addresses (about 4.3 billion), IPv6 uses 128-bit addresses to solve exhaustion.",
    explanation:
      "IPv4 addresses are written as four decimal octets (e.g. 192.168.1.1), giving roughly 4.3 billion possible addresses — a number the internet has effectively exhausted, which is why NAT (Network Address Translation) lets many private devices share one public IP. Private address ranges (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16) are reserved for internal networks and are not routable on the public internet. IPv6 uses 128-bit addresses written in hextets (e.g. 2001:0db8::8a2e:0370:7334), providing an effectively unlimited address space and eliminating the need for NAT, along with built-in features like stateless address autoconfiguration. Public IPs are globally routable and unique; a device typically has a private IP on its LAN that gets translated to a public IP at the router/gateway for internet traffic.",
    code: "IPv4 private ranges (RFC 1918):\n10.0.0.0    - 10.255.255.255   (10.0.0.0/8)\n172.16.0.0  - 172.31.255.255   (172.16.0.0/12)\n192.168.0.0 - 192.168.255.255  (192.168.0.0/16)\n\n$ ip addr show\ninet 192.168.1.42/24 -- private LAN address\n\n$ curl ifconfig.me\n203.0.113.77 -- public IP after NAT at router\n\nIPv6 example:\n2001:0db8:85a3:0000:0000:8a2e:0370:7334\n-> shortened: 2001:db8:85a3::8a2e:370:7334",
    interviewQuestion:
      "Why can two different home networks both use 192.168.1.5 without conflicting, and what role does NAT play in that?",
  },
  {
    id: "networking-subnetting-basics",
    category: "networking",
    difficulty: "Advanced",
    topic: "IP Fundamentals",
    title: "Subnetting Basics",
    summary:
      "Subnetting splits a network into smaller sub-networks using a subnet mask/CIDR prefix, controlling how many bits identify the network vs the host.",
    explanation:
      "An IP address combined with a subnet mask splits into a network portion and a host portion — CIDR notation like /24 means the first 24 bits are the network, leaving 8 bits (256 addresses, 254 usable after reserving the network and broadcast address) for hosts. Smaller prefixes (e.g. /16) mean fewer network bits and more host addresses per subnet; larger prefixes (e.g. /28) mean more subnets with fewer hosts each. Subnetting is used to logically segment networks for security (isolating a database subnet from a public web subnet), reduce broadcast domain size, and allocate IP ranges efficiently in cloud VPCs (e.g. AWS VPC subnets per availability zone). To find the number of usable hosts in a subnet: 2^(32 - prefix) - 2 (subtracting network and broadcast addresses); e.g. a /24 gives 2^8 - 2 = 254 usable hosts.",
    code: "10.0.0.0/24  -> 256 addresses (254 usable hosts)\n  Network:   10.0.0.0\n  Broadcast: 10.0.0.255\n  Usable:    10.0.0.1 - 10.0.0.254\n\n# Splitting a /24 into four /26 subnets\n10.0.0.0/26   -> 10.0.0.0   - 10.0.0.63   (62 usable)\n10.0.0.64/26  -> 10.0.0.64  - 10.0.0.127  (62 usable)\n10.0.0.128/26 -> 10.0.0.128 - 10.0.0.191  (62 usable)\n10.0.0.192/26 -> 10.0.0.192 - 10.0.0.255  (62 usable)\n\n# AWS VPC example: separate subnets per tier\npublic-subnet-1a:  10.0.1.0/24\nprivate-subnet-1a: 10.0.2.0/24",
    interviewQuestion:
      "Given a /24 network, how would you subnet it into 4 equally-sized subnets, and how many usable host addresses would each have?",
  },
  {
    id: "networking-latency-vs-bandwidth",
    category: "networking",
    difficulty: "Intermediate",
    topic: "Performance",
    title: "Latency vs Bandwidth",
    summary:
      "Latency is how long a single piece of data takes to travel; bandwidth is how much data can flow per second — high bandwidth doesn't fix high latency.",
    explanation:
      "Latency (usually measured in milliseconds, often as round-trip time / RTT) is the delay for a packet to travel from source to destination and is bounded by physical distance (speed of light in fiber), routing hops, and processing delays — it can't be improved just by adding more bandwidth, the same way adding more highway lanes doesn't make a single car arrive faster. Bandwidth (measured in bits/bytes per second) is the maximum data throughput a link can carry; it's like the width of a pipe, determining how much data fits through per unit time. A classic analogy: latency is the time for the first byte to arrive, bandwidth is how fast subsequent bytes stream in. This is why a high-bandwidth satellite link can still feel sluggish for interactive apps (high latency, ~600ms+ RTT) while a lower-bandwidth but low-latency connection feels snappier for things like gaming or video calls. Techniques like CDNs, HTTP/2 multiplexing, and connection reuse primarily target reducing the *number* of round trips (latency-bound), while compression and better codecs target bandwidth efficiency.",
    code: "# Measuring latency (RTT)\n$ ping example.com\n64 bytes from 93.184.216.34: icmp_seq=1 ttl=56 time=14.2 ms\n\n# Measuring bandwidth/throughput\n$ speedtest-cli\nDownload: 940.32 Mbit/s\nUpload: 35.11 Mbit/s\nPing: 14.2 ms  <- this is latency, separate metric\n\n# Why bandwidth alone doesn't fix perceived speed:\n# Satellite: 100 Mbps bandwidth, 600ms RTT -> feels slow for API calls\n# Fiber:     50 Mbps bandwidth, 5ms RTT    -> feels fast for API calls",
    interviewQuestion:
      "A user has a 500 Mbps connection but complains a chat app feels laggy — what's the likely culprit, bandwidth or latency, and why?",
  },
  {
    id: "networking-waterfall-analysis",
    category: "networking",
    difficulty: "Intermediate",
    topic: "Performance",
    title: "Network Waterfall Analysis",
    summary:
      "A network waterfall chart (in browser DevTools) visualizes each request's timing phases — DNS, connect, TLS, TTFB, download — to pinpoint page load bottlenecks.",
    explanation:
      "The Network tab's waterfall breaks each request into colored segments: DNS Lookup (resolving hostname), Initial Connection (TCP handshake), SSL/TLS negotiation, Time to First Byte (TTFB — server processing time before it starts responding), and Content Download (transferring the body). Reading a waterfall reveals patterns like: requests queued behind the browser's per-host connection limit (visible as a 'Stalled' phase), render-blocking CSS/JS delaying everything below it, a slow TTFB pointing to backend/database issues rather than network issues, and third-party scripts (analytics, ads) extending the critical path. Key optimization techniques informed by waterfall analysis include preconnect/dns-prefetch hints for early third-party connections, deferring non-critical JS, using HTTP/2 to remove the per-host connection limit bottleneck, and moving slow-loading resources off the critical rendering path. Tools like Lighthouse, WebPageTest, and Chrome DevTools all visualize this waterfall to guide performance work.",
    code: "// Reading resource timing programmatically\nconst [entry] = performance.getEntriesByName('https://api.example.com/data');\nconsole.log({\n  dns: entry.domainLookupEnd - entry.domainLookupStart,\n  tcp: entry.connectEnd - entry.connectStart,\n  tls: entry.connectEnd - entry.secureConnectionStart,\n  ttfb: entry.responseStart - entry.requestStart,\n  download: entry.responseEnd - entry.responseStart,\n});\n\n// DevTools waterfall phases (left to right per request):\n// [Queueing][Stalled][DNS][Connecting][SSL][TTFB][Content Download]",
    interviewQuestion:
      "Looking at a waterfall chart, how would you distinguish a backend performance problem from a network/connection problem?",
  },
  {
    id: "networking-http2-multiplexing",
    category: "networking",
    difficulty: "Tricky",
    topic: "HTTP Evolution",
    title: "HTTP/2 Multiplexing",
    summary:
      "HTTP/2 multiplexing lets many request/response streams share one TCP connection simultaneously, interleaving frames instead of queuing whole requests.",
    explanation:
      "HTTP/2 breaks messages into small binary frames tagged with a stream ID, and frames from different streams can be interleaved on the wire over a single TCP connection — the receiver reassembles frames by stream ID. This removes the old HTTP/1.1 problem of needing 6+ parallel TCP connections per host to get concurrency, reducing connection overhead and improving TLS/TCP efficiency. Streams have priority weights and dependencies, letting the browser hint that, say, the main HTML/CSS should be delivered before a background image. However, multiplexing is exposed at the HTTP layer only — underneath, it's still one TCP byte stream, so if a single TCP segment is lost, TCP's in-order delivery requirement stalls ALL streams until that segment is retransmitted, even though logically the streams are independent. This is exactly the head-of-line blocking problem that motivated HTTP/3/QUIC, which moves multiplexing down into the transport layer so each stream has independent loss recovery.",
    code: "// One TCP connection, interleaved frames from 3 concurrent streams\nStream 1 (HEADERS) -> Stream 3 (HEADERS) -> Stream 1 (DATA)\n-> Stream 5 (HEADERS) -> Stream 3 (DATA) -> Stream 1 (DATA) ...\n\n// Old HTTP/1.1 workaround (no longer needed with H2)\n// Browser opened up to 6 parallel connections per host:\nconnection1: GET /app.js\nconnection2: GET /style.css\nconnection3: GET /logo.png\n\n// H2: all three multiplexed over ONE connection\n$ curl --http2 -v https://example.com  # single TCP session, many streams",
    interviewQuestion:
      "If HTTP/2 multiplexes streams so they're logically independent, why can a single packet loss still stall every request on the connection?",
  },
  {
    id: "networking-compression-gzip-brotli",
    category: "networking",
    difficulty: "Intermediate",
    topic: "Performance",
    title: "Compression (gzip / brotli)",
    summary:
      "HTTP compression shrinks response bodies before sending them over the wire, negotiated via Accept-Encoding and Content-Encoding headers.",
    explanation:
      "The client advertises what compression algorithms it supports in the Accept-Encoding header (e.g. gzip, deflate, br); the server picks one it supports, compresses the body, and marks the response with Content-Encoding so the client knows how to decompress it. Gzip (DEFLATE-based) is universally supported and fast; Brotli, developed by Google, generally achieves 15-25% better compression ratios than gzip especially for text-based assets (HTML/CSS/JS), at the cost of higher compression time — which is why static assets are often pre-compressed at build time with Brotli's max quality, while dynamic responses use faster on-the-fly gzip. Compression is most effective on text-based, repetitive content and provides little to no benefit (or can even hurt) on already-compressed formats like JPEG, PNG, video, or zip files. Beware BREACH/CRIME-style attacks — compressing a response that mixes attacker-controlled input with secrets (like a CSRF token) over TLS can leak information through compressed response size, so sensitive dynamic content sometimes disables compression or adds random padding.",
    code: "GET /app.js HTTP/1.1\nAccept-Encoding: gzip, deflate, br\n\nHTTP/1.1 200 OK\nContent-Encoding: br\nVary: Accept-Encoding\nContent-Length: 42891\n\n# nginx: pre-compress at build, serve brotli or gzip fallback\ngzip on;\ngzip_types text/plain application/javascript text/css;\nbrotli on;\nbrotli_static on;  # serve pre-built .br files if present\n\n$ curl -H 'Accept-Encoding: br' -I https://example.com/app.js\ncontent-encoding: br",
    interviewQuestion:
      "Why might compressing an HTTPS response that includes both user input and a secret token be a security risk, and what's this class of attack called?",
  },
  {
    id: "networking-webrtc-basics",
    category: "networking",
    difficulty: "Tricky",
    topic: "Realtime",
    title: "WebRTC Basics",
    summary:
      "WebRTC enables direct peer-to-peer audio, video, and data connections between browsers, using STUN/TURN servers to punch through NATs.",
    explanation:
      "WebRTC's goal is a direct peer-to-peer connection (avoiding server relay for media, minimizing latency) but most devices sit behind NAT routers that block unsolicited incoming connections, so WebRTC uses ICE (Interactive Connectivity Establishment) to find a viable path: it gathers candidate addresses from STUN servers (which tell a peer its public IP:port as seen from outside its NAT, enabling 'NAT hole punching') and falls back to TURN servers (which relay all traffic when a direct connection truly can't be established, e.g. symmetric NATs) if P2P fails. Before media flows, peers exchange SDP (Session Description Protocol) offer/answer messages describing supported codecs/formats via a signaling channel that WebRTC itself doesn't define — apps typically use WebSockets for this. Once connected, WebRTC carries audio/video over SRTP (encrypted RTP) and can also open low-latency DataChannels for arbitrary data (used in P2P file sharing, multiplayer games) on top of SCTP over DTLS. This makes WebRTC fundamentally different from WebSocket/SSE, which are always client-server, not peer-to-peer.",
    code: "// Simplified WebRTC connection setup\nconst pc = new RTCPeerConnection({\n  iceServers: [\n    { urls: 'stun:stun.l.google.com:19302' },\n    { urls: 'turn:turn.example.com:3478', username: 'u', credential: 'p' },\n  ],\n});\n\n// 1. Create offer, send via signaling server (e.g. WebSocket)\nconst offer = await pc.createOffer();\nawait pc.setLocalDescription(offer);\nsignalingSocket.send(JSON.stringify({ type: 'offer', sdp: offer }));\n\n// 2. ICE candidates gathered and exchanged\npc.onicecandidate = (e) => {\n  if (e.candidate) signalingSocket.send(JSON.stringify({ candidate: e.candidate }));\n};\n\n// 3. Media flows P2P once connected (or via TURN relay as fallback)",
    interviewQuestion:
      "Why does WebRTC need both STUN and TURN servers instead of just one, and what's a scenario where STUN alone fails?",
  },
  {
    id: "networking-content-negotiation",
    category: "networking",
    difficulty: "Intermediate",
    topic: "HTTP Fundamentals",
    title: "Content Negotiation",
    summary:
      "Content negotiation lets a client and server agree on the best representation of a resource — format, language, or encoding — using Accept-* headers.",
    explanation:
      "Server-driven negotiation is the common approach: the client sends Accept (media type, e.g. application/json vs text/html), Accept-Language (e.g. en-US, fr;q=0.8), and Accept-Encoding (gzip, br) headers, each optionally with quality values (q=) indicating preference order, and the server picks the best match it can serve. The server should respond with a Vary header listing which request headers influenced its response (e.g. Vary: Accept-Language) so caches know to store separate versions per header value rather than serving the wrong language to the wrong user. If no acceptable representation exists, the server can respond 406 Not Acceptable. Agent-driven negotiation (less common) has the server return a list of options (300 Multiple Choices) for the client to pick from. A classic real-world use: a REST API returning JSON by default but XML when Accept: application/xml is sent, or a CDN serving Brotli vs gzip based on Accept-Encoding.",
    code: "GET /api/report HTTP/1.1\nAccept: application/json, application/xml;q=0.5\nAccept-Language: fr-CA, fr;q=0.9, en;q=0.5\n\nHTTP/1.1 200 OK\nContent-Type: application/json\nContent-Language: fr-CA\nVary: Accept, Accept-Language\n\n# Without Vary, a CDN might cache the French response\n# and incorrectly serve it to an English-requesting client",
    interviewQuestion:
      "Why is the Vary header critical when a CDN or proxy caches responses that depend on content negotiation, and what breaks if it's missing?",
  },
  {
    id: "networking-idempotency-http-methods",
    category: "networking",
    difficulty: "Tricky",
    topic: "HTTP Fundamentals",
    title: "Idempotency in HTTP Methods",
    summary:
      "An idempotent operation produces the same server state no matter how many times it's repeated — critical for safely retrying requests after network failures.",
    explanation:
      "GET, PUT, DELETE, HEAD, and OPTIONS are defined as idempotent: calling PUT /users/1 with the same body twice leaves the resource in the same final state as calling it once (even though the response might differ, e.g. second DELETE returns 404 instead of 204). POST is NOT idempotent by spec — POST /orders typically creates a new resource each time, so blindly retrying a POST after a timeout can create duplicate orders/charges. This matters enormously for retry logic: it's safe to automatically retry a failed GET or PUT, but retrying a POST requires extra care. The standard solution is an idempotency key: the client generates a unique key (e.g. a UUID) per logical operation and sends it in a header; the server stores results keyed by that value and returns the original response if it sees the same key again instead of re-executing the operation — this is exactly how Stripe's payment API prevents duplicate charges on network retries. Note idempotent does not mean 'safe' (no side effects) — only GET/HEAD/OPTIONS are 'safe'; PUT and DELETE are idempotent but do change state.",
    code: "// Without idempotency key: retry risk\nPOST /charges { amount: 5000 }  // times out, client retries\nPOST /charges { amount: 5000 }  // may create a SECOND charge!\n\n// With idempotency key: safe retry\nPOST /charges\nIdempotency-Key: 6f9c3a2e-6b41-4e2a-9c3a-1f5e7d8b2a10\n{ amount: 5000 }\n\n// Server logic (pseudocode)\nfunction handleCharge(key, body) {\n  if (cache.has(key)) return cache.get(key); // replay original response\n  const result = processCharge(body);\n  cache.set(key, result, { ttl: '24h' });\n  return result;\n}",
    interviewQuestion:
      "Why is it dangerous to blindly retry a failed POST request, and how does an idempotency key make retries safe?",
  },
  {
    id: "networking-api-gateways",
    category: "networking",
    difficulty: "Advanced",
    topic: "Infrastructure",
    title: "API Gateways",
    summary:
      "An API gateway is a single entry point that sits in front of backend services, handling routing, auth, rate limiting, and cross-cutting concerns for microservices.",
    explanation:
      "In a microservices architecture, clients shouldn't need to know about (or directly call) dozens of individual services — an API gateway provides one unified entry point that routes requests to the appropriate backend service, often aggregating multiple backend calls into a single client-facing response (the Backend-for-Frontend pattern). Gateways centralize cross-cutting concerns that would otherwise be duplicated in every service: authentication/authorization (validating JWTs once at the edge), rate limiting, request/response transformation, TLS termination, request logging/tracing, and circuit breaking to protect against cascading failures. Popular implementations include Kong, AWS API Gateway, Envoy, and Apigee. The tradeoff is the gateway becomes a critical single point of failure and potential bottleneck if not scaled properly, and it adds an extra network hop of latency — so gateways are usually kept lightweight (routing/auth logic) rather than embedding business logic, which belongs in the services themselves.",
    code: "# API Gateway routing config (conceptual, e.g. Kong/Envoy style)\nroutes:\n  - path: /api/users/*\n    upstream: user-service:8081\n    plugins: [jwt-auth, rate-limit(100/min)]\n\n  - path: /api/orders/*\n    upstream: order-service:8082\n    plugins: [jwt-auth, rate-limit(50/min), circuit-breaker]\n\n  - path: /api/search/*\n    upstream: search-service:8083\n    plugins: [rate-limit(200/min)]\n\n# Client only ever calls https://api.example.com/*\n# Gateway resolves and forwards to the right internal service",
    interviewQuestion:
      "What responsibilities belong in an API gateway versus in the individual microservices themselves, and what happens if the gateway goes down?",
  },
  {
    id: "networking-circuit-breaker-pattern",
    category: "networking",
    difficulty: "Advanced",
    topic: "Resilience",
    title: "Circuit Breaker Pattern (Networking Angle)",
    summary:
      "A circuit breaker stops sending requests to a failing downstream service after repeated failures, preventing cascading failures and giving the service time to recover.",
    explanation:
      "Modeled after electrical circuit breakers, this pattern wraps outbound network calls with a state machine: Closed (normal operation, requests flow through and failures are counted), Open (after failures exceed a threshold, all requests immediately fail fast WITHOUT hitting the network — protecting both the caller from wasting time on doomed calls and the struggling downstream service from more load), and Half-Open (after a cooldown period, a limited number of test requests are allowed through to check if the service has recovered; success transitions back to Closed, failure returns to Open). This is especially critical in networked microservice architectures because a slow/failing downstream service can otherwise cause thread pool exhaustion, connection pool starvation, and timeout pile-ups in every upstream caller, cascading a single service outage into a system-wide outage. Circuit breakers are typically combined with timeouts, retries with exponential backoff and jitter, and bulkheads (isolating resource pools per dependency) as complementary resilience patterns — libraries like Hystrix, resilience4j, and Polly implement this.",
    code: "// Circuit breaker state machine (pseudocode)\nclass CircuitBreaker {\n  state = 'CLOSED';\n  failureCount = 0;\n  threshold = 5;\n  cooldownMs = 30000;\n\n  async call(fn) {\n    if (this.state === 'OPEN') {\n      if (Date.now() < this.openedAt + this.cooldownMs) {\n        throw new Error('Circuit OPEN - failing fast, not hitting network');\n      }\n      this.state = 'HALF_OPEN';\n    }\n    try {\n      const result = await fn();\n      this.state = 'CLOSED';\n      this.failureCount = 0;\n      return result;\n    } catch (err) {\n      this.failureCount++;\n      if (this.failureCount >= this.threshold) {\n        this.state = 'OPEN';\n        this.openedAt = Date.now();\n      }\n      throw err;\n    }\n  }\n}",
    interviewQuestion:
      "How does a circuit breaker prevent a single failing downstream service from cascading into a system-wide outage, and why is 'fail fast' better than letting every request time out?",
  },
];
