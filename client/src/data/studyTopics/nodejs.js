// 10 nodejs topics for Study Hub.
export default [
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
    code: "// hello.js\nconst http = require('http');\n\nconst server = http.createServer((req, res) => {\n  res.writeHead(200, { 'Content-Type': 'text/plain' });\n  res.end('Hello from Node.js!');\n});\n\nserver.listen(3000, () => console.log('Server running on port 3000'));",
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
    code: "// CommonJS\nconst fs = require('fs');\nmodule.exports = { hello: 'world' };\n\n// ES Modules (package.json: \"type\": \"module\")\nimport fs from 'fs';\nexport const hello = 'world';",
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
    code: "setTimeout(() => console.log('timeout'), 0);\nsetImmediate(() => console.log('immediate'));\nPromise.resolve().then(() => console.log('promise'));\nconsole.log('sync');\n\n// Output: sync → promise → timeout → immediate\n// (setImmediate fires in check phase, after poll)",
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
    code: "import { readFile, writeFile } from 'fs/promises';\n\n// Read\nconst content = await readFile('data.txt', 'utf-8');\nconsole.log(content);\n\n// Write\nawait writeFile('output.txt', 'Hello!', 'utf-8');\n\n// Stream large files\nimport { createReadStream } from 'fs';\ncreateReadStream('large.csv').pipe(process.stdout);",
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
    code: "import express from 'express';\nconst app = express();\n\napp.use(express.json()); // parse JSON body\n\napp.get('/users', (req, res) => {\n  res.json([{ id: 1, name: 'Alice' }]);\n});\n\napp.post('/users', (req, res) => {\n  const { name } = req.body;\n  res.status(201).json({ id: 2, name });\n});\n\n// Error middleware (4 args)\napp.use((err, req, res, next) => {\n  res.status(500).json({ error: err.message });\n});\n\napp.listen(3000);",
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
    code: "import { promisify } from 'util';\nimport { exec } from 'child_process';\n\nconst execAsync = promisify(exec);\n\nasync function getFiles() {\n  try {\n    const { stdout } = await execAsync('ls -la');\n    return stdout.split('\\n');\n  } catch (err) {\n    console.error('Command failed:', err.message);\n    throw err;\n  }\n}\n\n// Running tasks in parallel\nconst [users, posts] = await Promise.all([\n  fetchUsers(),\n  fetchPosts(),\n]);",
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
    code: "import { createReadStream, createWriteStream } from 'fs';\nimport { createGzip } from 'zlib';\nimport { pipeline } from 'stream/promises';\n\n// Compress a file using streams — memory-efficient\nawait pipeline(\n  createReadStream('large.log'),\n  createGzip(),\n  createWriteStream('large.log.gz'),\n);\nconsole.log('Compressed!');\n\n// Transform stream — uppercase every chunk\nimport { Transform } from 'stream';\nconst upper = new Transform({\n  transform(chunk, encoding, callback) {\n    callback(null, chunk.toString().toUpperCase());\n  },\n});",
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
    code: "// .env file\n// DATABASE_URL=mongodb://localhost:27017/mydb\n// JWT_SECRET=supersecret\n// PORT=3000\n\nimport 'dotenv/config'; // loads .env automatically\n\nconst port = process.env.PORT || 3000;\nconst dbUrl = process.env.DATABASE_URL;\n\nif (!dbUrl) throw new Error('DATABASE_URL is required');\n\nconsole.log(`Starting on port ${port}`);",
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
    code: "import { WebSocketServer } from 'ws';\n\nconst wss = new WebSocketServer({ port: 8080 });\n\nwss.on('connection', (socket) => {\n  console.log('Client connected');\n\n  socket.on('message', (data) => {\n    const msg = data.toString();\n    console.log('Received:', msg);\n    // Broadcast to all clients\n    wss.clients.forEach(client => {\n      if (client.readyState === 1) client.send(msg);\n    });\n  });\n\n  socket.on('close', () => console.log('Client disconnected'));\n});",
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
    code: "import cluster from 'cluster';\nimport { cpus } from 'os';\nimport express from 'express';\n\nif (cluster.isPrimary) {\n  const numCPUs = cpus().length;\n  console.log(`Primary ${process.pid} — forking ${numCPUs} workers`);\n  for (let i = 0; i < numCPUs; i++) cluster.fork();\n  cluster.on('exit', (worker) => {\n    console.log(`Worker ${worker.process.pid} died — restarting`);\n    cluster.fork();\n  });\n} else {\n  const app = express();\n  app.get('/', (_, res) => res.send(`Worker ${process.pid}`));\n  app.listen(3000);\n}",
    interviewQuestion:
      "When would you use `cluster` vs `worker_threads` in Node.js?",
  },
{
    id: "nodejs-architecture-overview",
    category: "nodejs",
    difficulty: "Basic",
    topic: "Architecture",
    title: "What is Node.js Architecture?",
    summary:
      "Node.js runs JavaScript on a single-threaded event loop backed by libuv's thread pool for I/O, built on Google's V8 engine.",
    explanation:
      "Node.js combines V8 (compiles and executes JS) with libuv (provides the event loop, async I/O, and a thread pool for blocking operations). The main thread never blocks on I/O — it delegates work to the OS or libuv's thread pool and resumes via callbacks/promises when results are ready. This single-threaded, non-blocking model lets Node handle thousands of concurrent connections with low overhead, though CPU-bound work still blocks the main thread.",
    code: "// Node.js architecture in one script\nconst fs = require('fs');\n\nconsole.log('1: start');\n\nfs.readFile(__filename, () => {\n  console.log('3: file read callback (via libuv thread pool)');\n});\n\nsetTimeout(() => console.log('4: timer callback'), 0);\n\nconsole.log('2: end of synchronous code');\n\n// Output order: 1, 2, 4 or 3 depending on timing, but sync code always first",
    interviewQuestion:
      "Explain the high-level architecture of Node.js — what role do V8 and libuv each play?",
  },
  {
    id: "nodejs-v8-engine",
    category: "nodejs",
    difficulty: "Intermediate",
    topic: "Architecture",
    title: "How Does the V8 Engine Work?",
    summary:
      "V8 is Google's open-source JavaScript engine that compiles JS directly to machine code using JIT compilation.",
    explanation:
      "V8 parses JavaScript into an AST, then uses Ignition (a bytecode interpreter) to execute it quickly, profiling hot code paths along the way. Frequently executed functions get optimized by TurboFan, V8's optimizing JIT compiler, into highly efficient machine code. V8 also manages memory via generational garbage collection (young generation 'Scavenger' and old generation 'Mark-Compact'). Node.js embeds V8 and extends it with C++ bindings for filesystem, networking, and other OS-level APIs.",
    code: "// V8 optimizes functions with stable, monomorphic shapes\nfunction add(a, b) {\n  return a + b;\n}\n\n// Monomorphic call site — V8 can optimize this well\nfor (let i = 0; i < 100000; i++) {\n  add(1, 2);\n}\n\n// Polymorphic/megamorphic usage deoptimizes hot functions\nadd('1', 2); // mixing types hurts V8's inline caches\n\n// Inspect V8 heap stats\nconst v8 = require('v8');\nconsole.log(v8.getHeapStatistics());",
    interviewQuestion:
      "What is the difference between V8's Ignition interpreter and TurboFan compiler, and how does that affect performance?",
  },
  {
    id: "nodejs-libuv",
    category: "nodejs",
    difficulty: "Advanced",
    topic: "Architecture",
    title: "What is libuv and How Does It Enable Async I/O?",
    summary:
      "libuv is the C library that gives Node.js its event loop, async file/network I/O, and a thread pool for operations the OS can't do asynchronously.",
    explanation:
      "libuv abstracts platform-specific async mechanisms (epoll on Linux, kqueue on macOS, IOCP on Windows) behind a unified event loop API. Network I/O is handled natively async by the OS, but filesystem operations, DNS lookups, and some crypto functions use libuv's fixed-size thread pool (default 4 threads, configurable via UV_THREADPOOL_SIZE) since most OSes lack true async filesystem APIs. The event loop cycles through phases — timers, pending callbacks, idle/prepare, poll, check, close callbacks — dequeuing completed work and invoking JS callbacks.",
    code: "// libuv's thread pool size affects fs/crypto concurrency\nprocess.env.UV_THREADPOOL_SIZE = 8; // must be set before first use\n\nconst crypto = require('crypto');\nconst start = Date.now();\n\n// These pbkdf2 calls use libuv's thread pool\nfor (let i = 0; i < 4; i++) {\n  crypto.pbkdf2('secret', 'salt', 100000, 64, 'sha512', () => {\n    console.log(`Job ${i} done at ${Date.now() - start}ms`);\n  });\n}\n// With threadpool size 4, all 4 run in parallel; a 5th job would queue",
    interviewQuestion:
      "Why does Node.js need libuv's thread pool if JavaScript itself is single-threaded, and which operations use it?",
  },
  {
    id: "nodejs-event-emitter",
    category: "nodejs",
    difficulty: "Intermediate",
    topic: "Core Patterns",
    title: "How Does the EventEmitter Pattern Work?",
    summary:
      "EventEmitter is the core pub/sub class in Node.js that many built-in modules (streams, HTTP, net) inherit from to implement event-driven APIs.",
    explanation:
      "EventEmitter maintains an internal map of event names to arrays of listener functions. Calling `.emit(name, ...args)` synchronously invokes all registered listeners for that event in registration order. `.on()` adds a persistent listener, `.once()` auto-removes itself after firing, and `.off()`/`removeListener()` unsubscribes. By default a max of 10 listeners per event is allowed as a leak-detection heuristic, adjustable via `setMaxListeners()`. Errors emitted on the special `'error'` event throw if unhandled.",
    code: "const EventEmitter = require('events');\n\nclass OrderService extends EventEmitter {\n  placeOrder(order) {\n    // process order...\n    this.emit('order:placed', order);\n  }\n}\n\nconst orders = new OrderService();\n\norders.once('order:placed', (order) => {\n  console.log('Send confirmation email for', order.id);\n});\n\norders.on('order:placed', (order) => {\n  console.log('Update inventory for', order.id);\n});\n\norders.on('error', (err) => console.error('Order error:', err.message));\n\norders.placeOrder({ id: 42 });",
    interviewQuestion:
      "How does EventEmitter differ from a Promise-based API, and what happens if an 'error' event has no listener?",
  },
  {
    id: "nodejs-process-object",
    category: "nodejs",
    difficulty: "Basic",
    topic: "Core Patterns",
    title: "Working with the process Object",
    summary:
      "The global `process` object exposes information about and control over the currently running Node.js process — env vars, CLI args, and lifecycle hooks.",
    explanation:
      "`process.env` gives access to environment variables as strings, commonly used for configuration and secrets. `process.argv` is an array of command-line arguments, where index 0 is the node binary path and index 1 is the script path — real args start at index 2. `process.exit(code)` immediately terminates the process with the given exit code (0 = success, non-zero = failure), though it's often better to let the event loop drain naturally. `process` also emits events like `'exit'` and `'uncaughtException'` for cleanup and error handling.",
    code: "// script.js run as: node script.js --env=production\nconsole.log(process.argv);\n// ['/usr/bin/node', '/path/script.js', '--env=production']\n\nconst args = process.argv.slice(2);\nconst envArg = args.find((a) => a.startsWith('--env='));\nconst env = envArg ? envArg.split('=')[1] : 'development';\n\nconsole.log('Running in', env, 'mode');\nconsole.log('PORT from env:', process.env.PORT || 3000);\n\nprocess.on('exit', (code) => {\n  console.log(`Process exiting with code ${code}`);\n});\n\nif (!process.env.DATABASE_URL) {\n  console.error('Missing DATABASE_URL');\n  process.exit(1);\n}",
    interviewQuestion:
      "What is the difference between process.argv[0], process.argv[1], and the actual user-supplied arguments?",
  },
  {
    id: "nodejs-buffer-deep-dive",
    category: "nodejs",
    difficulty: "Advanced",
    topic: "Core Patterns",
    title: "Buffer Deep Dive — Working with Binary Data",
    summary:
      "Buffer is Node's class for handling raw binary data outside the V8 heap, essential for file I/O, networking, and streams.",
    explanation:
      "Buffers represent fixed-length sequences of bytes allocated in raw memory outside V8's garbage-collected heap, making them efficient for binary data like file contents or network packets. `Buffer.alloc(n)` creates a zero-filled buffer safely, while the deprecated `Buffer(n)` constructor could expose uninitialized memory — a real security issue in older code. Buffers support encoding/decoding between binary and string representations (utf8, base64, hex) via `.toString(encoding)` and `Buffer.from(str, encoding)`. Since Buffer is a subclass of Uint8Array, it also supports typed-array methods like slicing and iteration.",
    code: "// Safe allocation — zero-filled\nconst buf1 = Buffer.alloc(10);\n\n// From a string, using utf8 encoding by default\nconst buf2 = Buffer.from('Hello Node', 'utf8');\nconsole.log(buf2); // <Buffer 48 65 6c 6c 6f 20 4e 6f 64 65>\nconsole.log(buf2.toString('hex'));\nconsole.log(buf2.toString('base64'));\n\n// Concatenating buffers (e.g. reassembling network chunks)\nconst chunk1 = Buffer.from('foo');\nconst chunk2 = Buffer.from('bar');\nconst combined = Buffer.concat([chunk1, chunk2]);\nconsole.log(combined.toString()); // 'foobar'\n\n// Buffers are mutable, unlike strings\nbuf2[0] = 0x68; // lowercase 'h'\nconsole.log(buf2.toString());",
    interviewQuestion:
      "Why is Buffer.alloc() preferred over the legacy Buffer() constructor, and what security issue does it fix?",
  },
  {
    id: "nodejs-path-module",
    category: "nodejs",
    difficulty: "Basic",
    topic: "Built-in Modules",
    title: "Using the path Module",
    summary:
      "The `path` module provides cross-platform utilities for working with file and directory paths, avoiding manual string concatenation bugs.",
    explanation:
      "`path.join()` combines path segments and normalizes the result (resolving `..` and `.`), while `path.resolve()` builds an absolute path by resolving segments right-to-left against the current working directory. `path.basename()`, `path.dirname()`, and `path.extname()` extract parts of a path, and `path.parse()`/`path.format()` convert between path strings and object representations. Using `path` instead of manual string concatenation avoids bugs from differing separators between POSIX (`/`) and Windows (`\\\\`) systems.",
    code: "const path = require('path');\n\nconsole.log(path.join('/users', 'sneha', '..', 'docs', 'file.txt'));\n// /users/docs/file.txt\n\nconsole.log(path.resolve('src', 'index.js'));\n// /absolute/cwd/src/index.js\n\nconsole.log(path.basename('/foo/bar/baz.txt')); // baz.txt\nconsole.log(path.extname('/foo/bar/baz.txt'));  // .txt\nconsole.log(path.dirname('/foo/bar/baz.txt'));  // /foo/bar\n\nconst parsed = path.parse('/foo/bar/baz.txt');\nconsole.log(parsed);\n// { root: '/', dir: '/foo/bar', base: 'baz.txt', ext: '.txt', name: 'baz' }",
    interviewQuestion:
      "What is the difference between path.join() and path.resolve(), and when would you use one over the other?",
  },
  {
    id: "nodejs-http-module",
    category: "nodejs",
    difficulty: "Intermediate",
    topic: "Built-in Modules",
    title: "Building a Server with the raw http Module",
    summary:
      "The built-in `http` module lets you create HTTP servers and clients without any framework — Express itself is built on top of it.",
    explanation:
      "`http.createServer(callback)` returns a server where the callback fires for every incoming request with `req` (a readable stream with headers/url/method) and `res` (a writable stream you use to set status/headers and send a body). Unlike Express, there's no built-in routing, body parsing, or middleware — you handle raw URL parsing and streaming the request body yourself. Understanding the raw module clarifies what frameworks abstract away: routing tables, JSON parsing, and error-handling middleware chains.",
    code: "const http = require('http');\n\nconst server = http.createServer((req, res) => {\n  if (req.method === 'GET' && req.url === '/health') {\n    res.writeHead(200, { 'Content-Type': 'application/json' });\n    res.end(JSON.stringify({ status: 'ok' }));\n    return;\n  }\n\n  if (req.method === 'POST' && req.url === '/echo') {\n    let body = '';\n    req.on('data', (chunk) => (body += chunk));\n    req.on('end', () => {\n      res.writeHead(200, { 'Content-Type': 'application/json' });\n      res.end(body);\n    });\n    return;\n  }\n\n  res.writeHead(404);\n  res.end('Not found');\n});\n\nserver.listen(3000, () => console.log('Listening on 3000'));",
    interviewQuestion:
      "What does Express add on top of the raw http module, and how would you parse a JSON request body without it?",
  },
  {
    id: "nodejs-url-module",
    category: "nodejs",
    difficulty: "Basic",
    topic: "Built-in Modules",
    title: "Parsing URLs with the url Module",
    summary:
      "The `url` module (and the global `URL` class) parses and constructs URLs into their component parts — protocol, host, pathname, and query string.",
    explanation:
      "Modern Node.js favors the WHATWG-standard `URL` class (also available globally, same as in browsers) over the legacy `url.parse()` API, which is deprecated due to inconsistent handling of malformed URLs. `new URL(str, base)` gives structured access to `.pathname`, `.searchParams` (a URLSearchParams instance for reading/writing query params), `.hostname`, and `.protocol`. `URLSearchParams` itself is iterable and supports `.get()`, `.set()`, `.append()`, and `.getAll()` for repeated keys.",
    code: "const { URL } = require('url');\n\nconst myUrl = new URL('https://api.example.com/users?page=2&limit=10#top');\n\nconsole.log(myUrl.hostname);   // api.example.com\nconsole.log(myUrl.pathname);   // /users\nconsole.log(myUrl.hash);       // #top\n\nconsole.log(myUrl.searchParams.get('page'));  // '2'\nmyUrl.searchParams.set('page', '3');\nmyUrl.searchParams.append('sort', 'asc');\n\nconsole.log(myUrl.toString());\n// https://api.example.com/users?page=3&limit=10&sort=asc#top\n\nfor (const [key, value] of myUrl.searchParams) {\n  console.log(key, value);\n}",
    interviewQuestion:
      "Why is the legacy url.parse() function deprecated, and what should you use instead in modern Node.js?",
  },
  {
    id: "nodejs-crypto-module",
    category: "nodejs",
    difficulty: "Advanced",
    topic: "Built-in Modules",
    title: "Using the crypto Module for Hashing and Encryption",
    summary:
      "The `crypto` module provides cryptographic primitives — hashing, HMAC, symmetric/asymmetric encryption, and secure random values — built on OpenSSL.",
    explanation:
      "`crypto.createHash('sha256')` produces one-way digests useful for checksums, while password storage should instead use a slow, salted algorithm like `scrypt` or `bcrypt` (via a library) to resist brute-force attacks. `crypto.randomBytes()` generates cryptographically secure random values, unlike `Math.random()` which is not safe for security purposes. `createHmac` produces keyed hashes for verifying message integrity (e.g., webhook signature validation), and `createCipheriv`/`createDecipheriv` handle symmetric encryption such as AES-256-GCM.",
    code: "const crypto = require('crypto');\n\n// One-way hash (not for passwords — use scrypt/bcrypt instead)\nconst hash = crypto.createHash('sha256').update('hello').digest('hex');\nconsole.log(hash);\n\n// Secure password hashing with scrypt + salt\nconst salt = crypto.randomBytes(16).toString('hex');\ncrypto.scrypt('myPassword', salt, 64, (err, derivedKey) => {\n  if (err) throw err;\n  console.log('Password hash:', derivedKey.toString('hex'));\n});\n\n// HMAC — verifying a webhook signature\nconst secret = 'webhook_secret';\nconst payload = JSON.stringify({ event: 'payment.success' });\nconst signature = crypto.createHmac('sha256', secret).update(payload).digest('hex');\nconsole.log('X-Signature:', signature);",
    interviewQuestion:
      "Why shouldn't you use crypto.createHash() alone to store user passwords, and what would you use instead?",
  },
  {
    id: "nodejs-child-process",
    category: "nodejs",
    difficulty: "Advanced",
    topic: "Concurrency",
    title: "spawn vs exec vs fork in child_process",
    summary:
      "The `child_process` module lets Node run external commands or other Node scripts in separate OS processes, with spawn, exec, and fork suited to different use cases.",
    explanation:
      "`spawn()` launches a command and streams stdout/stderr as data arrives — ideal for long-running processes or large output since it doesn't buffer everything in memory. `exec()` runs a command through a shell and buffers the entire output into a callback, convenient for short commands but risky with untrusted input due to shell injection and a default output size limit. `fork()` is a specialized spawn for launching another Node.js script as a child process, automatically setting up an IPC channel so parent and child can exchange messages via `.send()`/`process.on('message')` — commonly used to offload CPU-heavy work.",
    code: "const { spawn, exec, fork } = require('child_process');\n\n// spawn — streams output, good for long-running commands\nconst ls = spawn('ls', ['-la']);\nls.stdout.on('data', (data) => console.log(`stdout: ${data}`));\nls.on('close', (code) => console.log(`ls exited with ${code}`));\n\n// exec — buffered output via shell, avoid with untrusted input\nexec('echo $HOME', (err, stdout) => console.log(stdout.trim()));\n\n// fork — IPC-connected Node child process\nconst child = fork('./worker-script.js');\nchild.send({ task: 'heavy-computation', n: 42 });\nchild.on('message', (result) => console.log('Result from child:', result));",
    interviewQuestion:
      "When would you choose spawn() over exec(), and why is exec() risky when passing user input into the command string?",
  },
  {
    id: "nodejs-worker-threads",
    category: "nodejs",
    difficulty: "Advanced",
    topic: "Concurrency",
    title: "Offloading CPU Work with Worker Threads",
    summary:
      "`worker_threads` lets you run JavaScript in parallel threads within the same process, ideal for CPU-intensive work that would otherwise block the event loop.",
    explanation:
      "Unlike `child_process`, worker threads run in the same process and can share memory efficiently via `SharedArrayBuffer`, making them lighter-weight for parallel computation. Each Worker has its own V8 instance and event loop, communicating with the main thread through `postMessage()`/`on('message')`, which structurally clones data (or transfers ownership for typed arrays). Worker threads are the right tool for CPU-bound tasks like image processing or large JSON parsing; for I/O-bound work, Node's async model already handles concurrency without needing threads.",
    code: "// main.js\nconst { Worker } = require('worker_threads');\n\nfunction runWorker(data) {\n  return new Promise((resolve, reject) => {\n    const worker = new Worker('./fib-worker.js', { workerData: data });\n    worker.on('message', resolve);\n    worker.on('error', reject);\n    worker.on('exit', (code) => {\n      if (code !== 0) reject(new Error(`Worker stopped with code ${code}`));\n    });\n  });\n}\n\nrunWorker(40).then((result) => console.log('Fibonacci result:', result));\n\n// fib-worker.js\nconst { parentPort, workerData } = require('worker_threads');\nfunction fib(n) { return n < 2 ? n : fib(n - 1) + fib(n - 2); }\nparentPort.postMessage(fib(workerData));",
    interviewQuestion:
      "How do worker_threads differ from child_process, and what kind of workload justifies using them?",
  },
  {
    id: "nodejs-npm-deep-dive",
    category: "nodejs",
    difficulty: "Intermediate",
    topic: "Tooling & Ecosystem",
    title: "NPM Deep Dive — Scripts and Workspaces",
    summary:
      "NPM is more than a package installer — its scripts and workspaces features power build pipelines and monorepo management.",
    explanation:
      "`npm scripts` defined in `package.json` can be run with `npm run <name>`, and lifecycle scripts like `pre`/`post` hooks (`pretest`, `posttest`) run automatically around a named script. NPM workspaces (since npm 7) let a single repository manage multiple packages under one root `package.json`, hoisting shared dependencies into a single top-level `node_modules` and allowing cross-package commands like `npm run build --workspaces`. Scripts have access to locally installed binaries in `node_modules/.bin` without needing global installs, since npm temporarily prepends that directory to PATH.",
    code: "// package.json (workspace root)\n{\n  \"name\": \"my-monorepo\",\n  \"private\": true,\n  \"workspaces\": [\"packages/*\"],\n  \"scripts\": {\n    \"pretest\": \"npm run lint\",\n    \"test\": \"jest\",\n    \"lint\": \"eslint .\",\n    \"build\": \"npm run build --workspaces --if-present\"\n  }\n}\n\n// Run a script scoped to one workspace package\n// npm run build --workspace=packages/api\n\n// Add a dependency to a specific workspace\n// npm install lodash --workspace=packages/api",
    interviewQuestion:
      "What problem do npm workspaces solve for monorepos, and how do pre/post lifecycle scripts work?",
  },
  {
    id: "nodejs-package-json-deep-dive",
    category: "nodejs",
    difficulty: "Basic",
    topic: "Tooling & Ecosystem",
    title: "package.json Deep Dive",
    summary:
      "`package.json` is the manifest describing a Node project's metadata, dependencies, scripts, and how it should be consumed by other tools.",
    explanation:
      "Beyond `name`, `version`, and `dependencies`, key fields include `main` (CommonJS entry point), `exports` (modern conditional entry points controlling what consumers can import), `type` (`module` for ESM vs default CommonJS), and `engines` (declares required Node/npm versions). `dependencies` are needed at runtime, `devDependencies` only for development/build, and `peerDependencies` declare a version range the consuming project must supply itself (common in plugins/libraries). The `exports` field can also restrict deep imports into a package's internals, improving encapsulation.",
    code: "{\n  \"name\": \"my-api\",\n  \"version\": \"2.1.0\",\n  \"type\": \"module\",\n  \"main\": \"./dist/index.js\",\n  \"exports\": {\n    \".\": \"./dist/index.js\",\n    \"./utils\": \"./dist/utils.js\"\n  },\n  \"engines\": {\n    \"node\": \">=18.0.0\"\n  },\n  \"scripts\": {\n    \"start\": \"node dist/index.js\",\n    \"build\": \"tsc\"\n  },\n  \"dependencies\": {\n    \"express\": \"^4.19.0\"\n  },\n  \"devDependencies\": {\n    \"typescript\": \"^5.4.0\"\n  },\n  \"peerDependencies\": {\n    \"react\": \">=18.0.0\"\n  }\n}",
    interviewQuestion:
      "What is the difference between dependencies, devDependencies, and peerDependencies, and when would you use peerDependencies?",
  },
  {
    id: "nodejs-package-lock-integrity",
    category: "nodejs",
    difficulty: "Intermediate",
    topic: "Tooling & Ecosystem",
    title: "package-lock.json and Lockfile Integrity",
    summary:
      "`package-lock.json` pins the exact dependency tree that was installed, ensuring reproducible builds across machines and CI.",
    explanation:
      "While `package.json` specifies acceptable version ranges (via semver), `package-lock.json` records the precise resolved versions, the dependency tree shape, and an `integrity` hash (SRI format, e.g. sha512) for every package to detect tampering or corruption. Committing the lockfile to version control is essential — without it, two installs at different times could resolve different transitive dependency versions, causing 'works on my machine' bugs. `npm ci` (used in CI/CD) installs strictly from the lockfile and fails fast if `package.json` and the lockfile are out of sync, unlike `npm install` which can update the lockfile.",
    code: "// Excerpt from package-lock.json\n{\n  \"packages\": {\n    \"node_modules/lodash\": {\n      \"version\": \"4.17.21\",\n      \"resolved\": \"https://registry.npmjs.org/lodash/-/lodash-4.17.21.tgz\",\n      \"integrity\": \"sha512-v2kDEe57lecTulaDIuNTPy3Ry4/GQ0k+8SwFRHYb3l9lqAcHVWn8AsMjfMDsGPZ0MfjDbLcQRZQyw0f6WrDf3g==\"\n    }\n  }\n}\n\n// CI pipeline — strict, reproducible install\n// npm ci\n// Fails immediately if package.json and package-lock.json disagree,\n// unlike 'npm install' which would silently update the lockfile.",
    interviewQuestion:
      "Why does npm ci fail when package.json and package-lock.json are out of sync, and why is that useful in CI?",
  },
  {
    id: "nodejs-semantic-versioning",
    category: "nodejs",
    difficulty: "Basic",
    topic: "Tooling & Ecosystem",
    title: "Semantic Versioning and semver Ranges",
    summary:
      "Semantic Versioning (MAJOR.MINOR.PATCH) is the convention npm packages use to signal the impact of a release, and package.json ranges control which updates are auto-accepted.",
    explanation:
      "MAJOR increments for breaking changes, MINOR for backwards-compatible new features, and PATCH for backwards-compatible bug fixes. The caret `^1.2.3` allows updates that don't change the leftmost non-zero digit (so up to but excluding `2.0.0`), while tilde `~1.2.3` only allows patch-level updates (up to but excluding `1.3.0`). Exact versions with no prefix pin a package completely, and ranges can be combined with `||` or space-separated for AND logic — understanding these ranges is critical to reasoning about what `npm install` might actually pull in.",
    code: "{\n  \"dependencies\": {\n    \"express\": \"^4.19.2\",   // allows 4.x.x, not 5.0.0\n    \"lodash\": \"~4.17.21\",   // allows 4.17.x only\n    \"react\": \"18.2.0\",      // exact version, no auto-updates\n    \"chalk\": \">=4.0.0 <6.0.0\" // explicit range\n  }\n}\n\n// Checking what a range resolves to\n// npm info express versions --json\n\n// semver comparison example (using the 'semver' package)\nconst semver = require('semver');\nconsole.log(semver.satisfies('4.19.5', '^4.19.2')); // true\nconsole.log(semver.satisfies('5.0.0', '^4.19.2'));  // false",
    interviewQuestion:
      "What is the difference between a caret (^) and tilde (~) version range in package.json, and what breaking-change risk does each carry?",
  },
  {
    id: "nodejs-error-handling-patterns",
    category: "nodejs",
    difficulty: "Advanced",
    topic: "Core Patterns",
    title: "Error Handling Patterns in Node.js",
    summary:
      "Robust Node apps distinguish operational errors (expected failures like a failed DB query) from programmer errors (bugs), and handle async errors consistently across callbacks, promises, and streams.",
    explanation:
      "Callback-style APIs follow the 'error-first' convention where the first argument is `null` on success or an `Error` on failure — forgetting to check it is a classic bug source. With promises/async-await, wrap awaited calls in try/catch, and always attach a `.catch()` to any floating promise to avoid unhandled rejections. Custom error classes extending `Error` (with fields like `statusCode` or `isOperational`) let centralized error-handling middleware distinguish trusted errors (safe to show a message for) from unexpected ones (log and return a generic 500). Process-level safety nets like `process.on('unhandledRejection')` and `process.on('uncaughtException')` should log and gracefully shut down rather than silently continuing in a corrupted state.",
    code: "class AppError extends Error {\n  constructor(message, statusCode) {\n    super(message);\n    this.statusCode = statusCode;\n    this.isOperational = true;\n    Error.captureStackTrace(this, this.constructor);\n  }\n}\n\nasync function getUser(id) {\n  const user = await db.users.findById(id);\n  if (!user) throw new AppError('User not found', 404);\n  return user;\n}\n\n// Express error-handling middleware (4 args signals error handler)\napp.use((err, req, res, next) => {\n  if (err.isOperational) {\n    return res.status(err.statusCode).json({ error: err.message });\n  }\n  console.error('Unexpected error:', err);\n  res.status(500).json({ error: 'Internal server error' });\n});\n\nprocess.on('unhandledRejection', (reason) => {\n  console.error('Unhandled rejection:', reason);\n  process.exit(1);\n});",
    interviewQuestion:
      "How would you design an error-handling strategy that distinguishes operational errors from programmer errors in a Node API?",
  },
  {
    id: "nodejs-stream-pipeline",
    category: "nodejs",
    difficulty: "Intermediate",
    topic: "Streams Deep Dive",
    title: "Stream Pipeline — Chaining Streams Safely",
    summary:
      "`stream.pipeline()` chains multiple streams together while automatically forwarding errors and cleaning up resources — safer than manual `.pipe()` chains.",
    explanation:
      "Manually chaining `.pipe()` calls doesn't propagate errors between streams, so a failure partway through a chain can leave file descriptors open or leave the process hanging. `pipeline()` (available as a callback API or via `stream/promises` for async/await) forwards errors from any stream in the chain to a single handler and ensures every stream is properly destroyed on completion or failure. It's the recommended way to compose readable, transform, and writable streams, especially for tasks like reading a file, compressing it, and writing the result.",
    code: "import { createReadStream, createWriteStream } from 'fs';\nimport { createGzip } from 'zlib';\nimport { pipeline } from 'stream/promises';\n\ntry {\n  await pipeline(\n    createReadStream('input.txt'),\n    createGzip(),\n    createWriteStream('input.txt.gz'),\n  );\n  console.log('Pipeline succeeded');\n} catch (err) {\n  console.error('Pipeline failed:', err.message);\n  // all streams are automatically destroyed/cleaned up here\n}",
    interviewQuestion:
      "Why is stream.pipeline() preferred over chaining .pipe() calls manually, especially regarding error handling?",
  },
  {
    id: "nodejs-readable-streams",
    category: "nodejs",
    difficulty: "Intermediate",
    topic: "Streams Deep Dive",
    title: "Readable Streams Deep Dive",
    summary:
      "Readable streams model a source of data delivered in chunks, supporting both flowing (event-driven) and paused (pull-based) reading modes.",
    explanation:
      "In flowing mode, data is pushed to consumers automatically via `'data'` events as soon as it's available; in paused mode, you explicitly call `.read()` to pull chunks, giving finer control over timing. Custom readable streams implement a `_read(size)` method that calls `this.push(chunk)` to supply data, and signal end-of-stream by calling `push(null)`. Readable streams also support `'end'`, `'error'`, and `'close'` events, and object mode (`{ objectMode: true }`) allows streaming arbitrary JS values instead of Buffers/strings.",
    code: "const { Readable } = require('stream');\n\nclass CounterStream extends Readable {\n  constructor(max, options) {\n    super(options);\n    this.current = 1;\n    this.max = max;\n  }\n\n  _read() {\n    if (this.current > this.max) {\n      this.push(null); // signal end of stream\n      return;\n    }\n    this.push(`${this.current}\\n`);\n    this.current++;\n  }\n}\n\nconst counter = new CounterStream(5);\ncounter.on('data', (chunk) => process.stdout.write(`Got: ${chunk}`));\ncounter.on('end', () => console.log('Stream finished'));",
    interviewQuestion:
      "What is the difference between flowing mode and paused mode in a Readable stream, and how do you implement a custom Readable?",
  },
  {
    id: "nodejs-writable-streams",
    category: "nodejs",
    difficulty: "Intermediate",
    topic: "Streams Deep Dive",
    title: "Writable Streams Deep Dive",
    summary:
      "Writable streams model a destination for data, accepting chunks via `.write()` and signaling completion via `.end()`.",
    explanation:
      "Custom writable streams implement `_write(chunk, encoding, callback)`, calling `callback()` when the chunk has been fully processed (or `callback(err)` on failure) so the stream knows when it's safe to accept more data. `.write()` returns `false` when the internal buffer exceeds `highWaterMark`, signaling backpressure — the producer should pause until a `'drain'` event fires. `.end([chunk])` optionally writes a final chunk and then closes the stream, after which no more writes are allowed, and a `'finish'` event fires once all data has been flushed.",
    code: "const { Writable } = require('stream');\n\nclass LoggerStream extends Writable {\n  _write(chunk, encoding, callback) {\n    // simulate an async sink, e.g. writing to a database\n    setTimeout(() => {\n      console.log('Logged:', chunk.toString().trim());\n      callback(); // signal ready for next chunk\n    }, 10);\n  }\n}\n\nconst logger = new LoggerStream();\n\nlogger.on('finish', () => console.log('All writes flushed'));\n\nfor (let i = 0; i < 5; i++) {\n  const canContinue = logger.write(`Log entry ${i}\\n`);\n  if (!canContinue) console.log('Backpressure! Buffer is full');\n}\nlogger.end();",
    interviewQuestion:
      "What does it mean when write() returns false on a Writable stream, and what event tells you it's safe to resume writing?",
  },
  {
    id: "nodejs-duplex-streams",
    category: "nodejs",
    difficulty: "Advanced",
    topic: "Streams Deep Dive",
    title: "Duplex Streams — Both Readable and Writable",
    summary:
      "Duplex streams implement both the Readable and Writable interfaces simultaneously, with independent internal buffers for each side — used for things like TCP sockets.",
    explanation:
      "A Duplex stream is not simply a pipe from input to output — its read side and write side operate independently with separate internal buffers, meaning data written in doesn't automatically appear as data read out (that's what Transform streams are for). `net.Socket` is a canonical example: you can write request data and read response data on the same connection concurrently. To build a custom Duplex, you implement both `_read()` and `_write()` just as you would for separate Readable/Writable classes.",
    code: "const { Duplex } = require('stream');\n\nclass EchoDuplex extends Duplex {\n  constructor(options) {\n    super(options);\n    this.queue = [];\n  }\n\n  _write(chunk, encoding, callback) {\n    this.queue.push(chunk); // store for reading later\n    callback();\n  }\n\n  _read() {\n    while (this.queue.length) {\n      if (!this.push(this.queue.shift())) break;\n    }\n  }\n}\n\nconst duplex = new EchoDuplex();\nduplex.on('data', (chunk) => console.log('Read side:', chunk.toString()));\nduplex.write('hello');\nduplex.write('world');\nduplex.end();",
    interviewQuestion:
      "How is a Duplex stream different from a Transform stream, given that both are readable and writable?",
  },
  {
    id: "nodejs-transform-streams",
    category: "nodejs",
    difficulty: "Intermediate",
    topic: "Streams Deep Dive",
    title: "Transform Streams — Modifying Data In-Flight",
    summary:
      "Transform streams are a special Duplex stream where output is computed directly from input, ideal for compression, encryption, or parsing pipelines.",
    explanation:
      "Unlike a generic Duplex stream with independent read/write buffers, a Transform stream's `_transform(chunk, encoding, callback)` method receives written data and calls `this.push(transformedChunk)` to produce corresponding readable output — the two sides are linked. Built-in examples include `zlib.createGzip()` for compression and `crypto.createCipheriv()` for encryption. An optional `_flush(callback)` method lets you push any remaining buffered data right before the stream ends, useful for things like closing out a running checksum.",
    code: "const { Transform } = require('stream');\n\nclass UppercaseTransform extends Transform {\n  _transform(chunk, encoding, callback) {\n    this.push(chunk.toString().toUpperCase());\n    callback();\n  }\n}\n\nprocess.stdin\n  .pipe(new UppercaseTransform())\n  .pipe(process.stdout);\n\n// Real-world example: gzip compression via a built-in Transform\nconst { createGzip } = require('zlib');\nconst fs = require('fs');\nfs.createReadStream('notes.txt')\n  .pipe(createGzip())\n  .pipe(fs.createWriteStream('notes.txt.gz'));",
    interviewQuestion:
      "How does a Transform stream relate to a Duplex stream, and what does the _flush() method let you do?",
  },
  {
    id: "nodejs-backpressure-in-streams",
    category: "nodejs",
    difficulty: "Tricky",
    topic: "Streams Deep Dive",
    title: "Understanding Backpressure in Streams",
    summary:
      "Backpressure happens when data is produced faster than it can be consumed — Node's stream API signals this so producers can slow down and avoid unbounded memory growth.",
    explanation:
      "Every stream has an internal buffer capped by `highWaterMark`; when a Writable's buffer fills up, `.write()` returns `false`, telling the producer to pause and wait for the `'drain'` event before writing more. Ignoring this signal — for example, calling `.write()` in a tight loop without checking the return value — can cause memory to balloon unboundedly, since Node buffers everything you throw at it. `.pipe()` handles backpressure automatically by pausing the source Readable when the destination is overwhelmed and resuming it on `'drain'`, which is one major reason to prefer `pipe()`/`pipeline()` over manually shuttling data between streams.",
    code: "const fs = require('fs');\n\nconst readable = fs.createReadStream('huge-file.log');\nconst writable = fs.createWriteStream('copy.log');\n\n// Manual backpressure handling (pipe() does this automatically)\nreadable.on('data', (chunk) => {\n  const ok = writable.write(chunk);\n  if (!ok) {\n    readable.pause(); // slow down the source\n    writable.once('drain', () => readable.resume());\n  }\n});\n\nreadable.on('end', () => writable.end());\n\n// Simpler and safer: let pipe() manage backpressure for you\n// fs.createReadStream('huge-file.log').pipe(writable);",
    interviewQuestion:
      "What happens if you ignore the return value of writable.write() in a loop, and how does pipe() prevent that problem?",
  },
  {
    id: "nodejs-rest-api-best-practices",
    category: "nodejs",
    difficulty: "Intermediate",
    topic: "API Development",
    title: "REST API Development Best Practices in Node",
    summary:
      "Well-designed Node REST APIs use consistent resource naming, proper HTTP status codes, versioning, and pagination to remain predictable and maintainable.",
    explanation:
      "Resources should be nouns (`/users/:id/orders`), with HTTP verbs conveying the action (GET/POST/PUT/PATCH/DELETE) rather than encoding verbs in the URL. Status codes should be meaningful — 201 for created resources with a `Location` header, 204 for successful deletes with no body, 400 for client validation errors, and 409 for conflicts — rather than always returning 200 with an error flag in the body. Large collections should support pagination (offset/limit or cursor-based) and filtering via query params, and APIs should version explicitly (e.g. `/v1/`) to avoid breaking existing clients when the contract changes.",
    code: "const express = require('express');\nconst router = express.Router();\n\n// GET /v1/users?page=2&limit=20\nrouter.get('/v1/users', async (req, res) => {\n  const page = Number(req.query.page) || 1;\n  const limit = Math.min(Number(req.query.limit) || 20, 100);\n  const users = await db.users.find({}, { skip: (page - 1) * limit, limit });\n  res.status(200).json({ data: users, page, limit });\n});\n\n// POST /v1/users — 201 + Location header on success\nrouter.post('/v1/users', async (req, res) => {\n  const user = await db.users.create(req.body);\n  res.status(201).location(`/v1/users/${user.id}`).json(user);\n});\n\n// DELETE /v1/users/:id — 204 No Content\nrouter.delete('/v1/users/:id', async (req, res) => {\n  await db.users.deleteById(req.params.id);\n  res.status(204).send();\n});",
    interviewQuestion:
      "What status code should a successful POST that creates a resource return, and what header should accompany it?",
  },
  {
    id: "nodejs-jwt-authentication",
    category: "nodejs",
    difficulty: "Intermediate",
    topic: "API Development",
    title: "Authentication with JWT in Node",
    summary:
      "JSON Web Tokens let a Node API verify a user's identity statelessly by cryptographically signing claims that the server can validate without a database lookup.",
    explanation:
      "A JWT consists of a header, payload (claims like `userId` and `exp`), and signature, base64url-encoded and joined by dots; the signature (HMAC or RSA) lets the server detect tampering without storing session state. On login, the server issues a signed access token (typically short-lived, e.g. 15 minutes) and often a longer-lived refresh token to obtain new access tokens without re-authenticating. Middleware validates the token on protected routes by verifying the signature and expiry with the same secret/public key, attaching the decoded payload to `req.user`. Because JWTs can't be easily revoked before expiry, sensitive apps often pair them with a short TTL and a server-side denylist or refresh-token rotation strategy.",
    code: "const jwt = require('jsonwebtoken');\n\nfunction login(req, res) {\n  const user = authenticateUser(req.body); // verify credentials\n  const accessToken = jwt.sign(\n    { userId: user.id, role: user.role },\n    process.env.JWT_SECRET,\n    { expiresIn: '15m' },\n  );\n  res.json({ accessToken });\n}\n\nfunction requireAuth(req, res, next) {\n  const authHeader = req.headers.authorization || '';\n  const token = authHeader.replace('Bearer ', '');\n  try {\n    req.user = jwt.verify(token, process.env.JWT_SECRET);\n    next();\n  } catch (err) {\n    res.status(401).json({ error: 'Invalid or expired token' });\n  }\n}\n\napp.get('/v1/profile', requireAuth, (req, res) => {\n  res.json({ userId: req.user.userId });\n});",
    interviewQuestion:
      "Since JWTs are stateless, how would you handle revoking a compromised token before it naturally expires?",
  },
  {
    id: "nodejs-cors-express",
    category: "nodejs",
    difficulty: "Basic",
    topic: "API Development",
    title: "Understanding CORS in Node/Express",
    summary:
      "CORS (Cross-Origin Resource Sharing) is a browser security mechanism that a Node/Express server must explicitly opt into via response headers to allow requests from other origins.",
    explanation:
      "By default, browsers block frontend JavaScript from reading responses from a different origin (scheme+host+port) than the page itself, unless the server responds with headers like `Access-Control-Allow-Origin`. For 'non-simple' requests (custom headers, methods like PUT/DELETE, or JSON content-type in some cases), the browser first sends a preflight `OPTIONS` request, and the server must respond with `Access-Control-Allow-Methods`/`Access-Control-Allow-Headers` before the real request is sent. The `cors` npm package handles all of this for Express, and allowing `Access-Control-Allow-Origin: *` combined with credentials is explicitly disallowed by browsers for security reasons.",
    code: "const express = require('express');\nconst cors = require('cors');\nconst app = express();\n\n// Restrict to specific trusted origins, with credentials support\napp.use(cors({\n  origin: ['https://app.example.com', 'https://admin.example.com'],\n  methods: ['GET', 'POST', 'PUT', 'DELETE'],\n  credentials: true,\n}));\n\napp.get('/v1/data', (req, res) => {\n  res.json({ message: 'CORS-enabled response' });\n});\n\n// Manual equivalent for a single route, without the cors package\napp.options('/v1/upload', (req, res) => {\n  res.header('Access-Control-Allow-Origin', 'https://app.example.com');\n  res.header('Access-Control-Allow-Methods', 'POST');\n  res.sendStatus(204);\n});",
    interviewQuestion:
      "What triggers a CORS preflight OPTIONS request, and which response headers does the server need to send back?",
  },
  {
    id: "nodejs-request-validation",
    category: "nodejs",
    difficulty: "Intermediate",
    topic: "API Development",
    title: "Request Validation with Zod/Joi",
    summary:
      "Schema validation libraries like Zod and Joi let you declaratively define the expected shape of request data and reject invalid input before it reaches business logic.",
    explanation:
      "Rather than scattering manual `if` checks through route handlers, you define a schema once describing types, required fields, string formats, and constraints, then validate `req.body`/`req.query`/`req.params` against it as middleware. Zod is TypeScript-first and infers static types directly from the schema (`z.infer<typeof schema>`), while Joi is a long-established, framework-agnostic validator with a similarly expressive chainable API. Centralizing validation this way produces consistent 400 error responses, prevents malformed data from reaching the database layer, and documents the API contract in code.",
    code: "const { z } = require('zod');\n\nconst createUserSchema = z.object({\n  email: z.string().email(),\n  age: z.number().int().min(13).max(120),\n  role: z.enum(['admin', 'member']).default('member'),\n});\n\nfunction validateBody(schema) {\n  return (req, res, next) => {\n    const result = schema.safeParse(req.body);\n    if (!result.success) {\n      return res.status(400).json({ errors: result.error.flatten() });\n    }\n    req.body = result.data; // parsed + defaulted\n    next();\n  };\n}\n\napp.post('/v1/users', validateBody(createUserSchema), (req, res) => {\n  res.status(201).json(req.body);\n});",
    interviewQuestion:
      "What are the benefits of schema-based validation with Zod or Joi compared to hand-written if-checks in each route handler?",
  },
  {
    id: "nodejs-pm2-process-manager",
    category: "nodejs",
    difficulty: "Intermediate",
    topic: "Deployment & Ops",
    title: "Managing Production Node Apps with PM2",
    summary:
      "PM2 is a production process manager for Node.js that keeps apps alive, load-balances across CPU cores, and provides zero-downtime restarts.",
    explanation:
      "PM2 runs your app as a managed daemon, automatically restarting it on crashes and optionally on file changes during development. Its cluster mode (`pm2 start app.js -i max`) forks one worker process per CPU core behind an internal load balancer, similar to the built-in `cluster` module but with far less boilerplate. `pm2 reload` performs a zero-downtime restart by replacing workers one at a time so the app never drops connections during a deploy, and `pm2 startup`/`pm2 save` configure the process list to survive server reboots. It also centralizes logs and exposes CPU/memory metrics via `pm2 monit`.",
    code: "// ecosystem.config.js\nmodule.exports = {\n  apps: [\n    {\n      name: 'api',\n      script: './server.js',\n      instances: 'max',       // one worker per CPU core\n      exec_mode: 'cluster',\n      max_memory_restart: '300M',\n      env: {\n        NODE_ENV: 'production',\n        PORT: 3000,\n      },\n    },\n  ],\n};\n\n// CLI usage\n// pm2 start ecosystem.config.js\n// pm2 reload api      -- zero-downtime restart\n// pm2 logs api\n// pm2 monit",
    interviewQuestion:
      "How does PM2's cluster mode achieve zero-downtime deploys, and how does it differ from Node's built-in cluster module?",
  },
  {
    id: "nodejs-performance-optimization",
    category: "nodejs",
    difficulty: "Advanced",
    topic: "Deployment & Ops",
    title: "Node.js Performance Optimization Techniques",
    summary:
      "Optimizing Node performance means profiling first, then addressing event-loop blocking, memory leaks, inefficient async patterns, and unnecessary synchronous work.",
    explanation:
      "Use the built-in `--prof` flag or `clinic.js`/`0x` to profile CPU usage and find hot functions rather than guessing; a common culprit is CPU-bound synchronous code (large JSON.parse, regex backtracking, tight loops) blocking the single-threaded event loop. Memory leaks often come from growing caches, unremoved event listeners, or closures retaining large objects — `node --inspect` with Chrome DevTools' heap snapshot comparison helps pinpoint them. Favor `Promise.all()` for independent async work instead of sequential awaits, use streaming instead of buffering entire files/responses in memory, and offload genuinely CPU-heavy tasks to worker threads or a separate service so the event loop stays responsive.",
    code: "// Bad: sequential awaits serialize independent async work\nasync function getDashboardSlow(userId) {\n  const profile = await fetchProfile(userId);\n  const orders = await fetchOrders(userId);\n  const notifications = await fetchNotifications(userId);\n  return { profile, orders, notifications };\n}\n\n// Good: run independent requests concurrently\nasync function getDashboardFast(userId) {\n  const [profile, orders, notifications] = await Promise.all([\n    fetchProfile(userId),\n    fetchOrders(userId),\n    fetchNotifications(userId),\n  ]);\n  return { profile, orders, notifications };\n}\n\n// Profiling in production-like conditions\n// node --prof server.js\n// node --prof-process isolate-0x*.log > profile.txt",
    interviewQuestion:
      "What tools would you use to diagnose a Node.js memory leak in production, and what are common causes?",
  },
];
