from datetime import datetime, timezone, timedelta
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from db_mongo import col_challenge_progress, col_users, col_fcm_tokens, sid, oid, now
from deps import current_user

router = APIRouter()

# ── 30 Advanced JS Questions ──────────────────────────────────────────────────

JS_QUESTIONS = [
    {
        "day": 1, "title": "Closure & Private State",
        "question": "Write a `makeCounter(start=0)` factory that returns `{ increment, decrement, reset, value }`. The internal count must be inaccessible from outside. Demonstrate that `counter.count` is `undefined`.",
        "answer": "Use a closure. The `count` variable lives in the factory's scope — returned methods reference it via closure but it's never exposed on the returned object.\n\n```js\nfunction makeCounter(start = 0) {\n  let count = start;\n  return {\n    increment: () => ++count,\n    decrement: () => --count,\n    reset:     () => { count = start; },\n    value:     () => count,\n  };\n}\nconst c = makeCounter(10);\nc.increment(); // 11\nconsole.log(c.count); // undefined\n```",
        "hint": "The returned object holds references to inner functions — not to the variable itself.",
    },
    {
        "day": 2, "title": "Event Loop & Microtask Queue",
        "question": "Predict the exact console output order:\n```js\nconsole.log('1');\nsetTimeout(() => console.log('2'), 0);\nPromise.resolve().then(() => console.log('3'));\nqueueMicrotask(() => console.log('4'));\nconsole.log('5');\n```\nExplain WHY each line prints when it does.",
        "answer": "Output: `1 → 5 → 3 → 4 → 2`\n\n- `1` and `5`: synchronous, run immediately.\n- Microtask queue runs before macrotask queue: Promise `.then` (3) and `queueMicrotask` (4) are both microtasks, queued in order.\n- `setTimeout` (2) is a macrotask — it runs after ALL microtasks are drained.",
        "hint": "Microtasks (Promise, queueMicrotask, MutationObserver) always drain before any macrotask (setTimeout, setInterval) fires.",
    },
    {
        "day": 3, "title": "Prototype Chain & Inheritance",
        "question": "Without using `class`, create a `Shape` constructor with `area()` returning 0, then create a `Circle` constructor that inherits from `Shape` and overrides `area()` with πr². Verify `circle instanceof Shape` is `true`.",
        "answer": "```js\nfunction Shape() {}\nShape.prototype.area = () => 0;\n\nfunction Circle(r) {\n  Shape.call(this);\n  this.r = r;\n}\nCircle.prototype = Object.create(Shape.prototype);\nCircle.prototype.constructor = Circle;\nCircle.prototype.area = function() { return Math.PI * this.r ** 2; };\n\nconst c = new Circle(5);\nconsole.log(c.area());          // 78.53...\nconsole.log(c instanceof Shape); // true\n```",
        "hint": "`Object.create(Shape.prototype)` sets the prototype chain without calling Shape's constructor.",
    },
    {
        "day": 4, "title": "Currying & Partial Application",
        "question": "Implement a `curry(fn)` function that converts any multi-argument function into a curried version. `curry(add)(1)(2)(3)` should equal `add(1,2,3)`. It must work for functions of any arity.",
        "answer": "```js\nfunction curry(fn) {\n  return function curried(...args) {\n    if (args.length >= fn.length) {\n      return fn.apply(this, args);\n    }\n    return function(...more) {\n      return curried.apply(this, args.concat(more));\n    };\n  };\n}\n\nconst add = (a, b, c) => a + b + c;\nconst curriedAdd = curry(add);\nconsole.log(curriedAdd(1)(2)(3)); // 6\nconsole.log(curriedAdd(1, 2)(3)); // 6\n```",
        "hint": "Compare `args.length` against `fn.length` (the function's declared arity).",
    },
    {
        "day": 5, "title": "Promise.all vs Promise.allSettled",
        "question": "Write a `fetchAll(urls)` function. If ALL requests succeed, return the data array. If ANY fail, instead of rejecting, return an object `{ succeeded: [...], failed: [...] }` with separate arrays. Use `Promise.allSettled`.",
        "answer": "```js\nasync function fetchAll(urls) {\n  const results = await Promise.allSettled(\n    urls.map(url => fetch(url).then(r => r.json()))\n  );\n  const succeeded = [];\n  const failed = [];\n  results.forEach((r, i) => {\n    if (r.status === 'fulfilled') succeeded.push(r.value);\n    else failed.push({ url: urls[i], reason: r.reason.message });\n  });\n  if (failed.length === 0) return succeeded;\n  return { succeeded, failed };\n}\n```",
        "hint": "`Promise.allSettled` never rejects — each result has `status: 'fulfilled'|'rejected'`.",
    },
    {
        "day": 6, "title": "WeakMap & Memory Management",
        "question": "Explain why `WeakMap` is used for storing private data on objects. Write a pattern where DOM node metadata is stored in a `WeakMap` so it's automatically garbage-collected when the node is removed from the DOM.",
        "answer": "```js\nconst meta = new WeakMap();\n\nfunction attachMeta(node, data) {\n  meta.set(node, data);\n}\nfunction getMeta(node) {\n  return meta.get(node);\n}\n\nconst btn = document.createElement('button');\nattachMeta(btn, { clicks: 0, label: 'Submit' });\n\n// When btn is GC'd (removed from DOM, no other refs),\n// the WeakMap entry is automatically cleaned up.\n// A regular Map would keep btn alive forever (memory leak).\n```\nKey: WeakMap keys are held weakly — they don't prevent garbage collection.",
        "hint": "Regular `Map` holds strong references, preventing GC. `WeakMap` keys are weak — when the key object has no other references, both the key and value are collected.",
    },
    {
        "day": 7, "title": "Generator-based Async Control Flow",
        "question": "Implement a `run(generatorFn)` function that executes a generator, automatically resolving yielded Promises. This is how `async/await` worked before it was native. Demonstrate with a fake `delay` function.",
        "answer": "```js\nfunction run(genFn) {\n  const gen = genFn();\n  function step(val) {\n    const { value, done } = gen.next(val);\n    if (done) return Promise.resolve(value);\n    return Promise.resolve(value).then(step);\n  }\n  return step();\n}\n\nfunction delay(ms) {\n  return new Promise(res => setTimeout(res, ms));\n}\n\nrun(function* () {\n  console.log('start');\n  yield delay(100);\n  console.log('after 100ms');\n  yield delay(100);\n  console.log('done');\n});\n```",
        "hint": "Pass each resolved value back into `gen.next(val)` so the generator resumes with the result.",
    },
    {
        "day": 8, "title": "Proxy & Reflect",
        "question": "Create a `readonly(obj)` function using `Proxy` that throws a `TypeError` on any `set`, `deleteProperty`, or `defineProperty` operation while allowing all reads normally.",
        "answer": "```js\nfunction readonly(obj) {\n  return new Proxy(obj, {\n    set(_, prop) {\n      throw new TypeError(`Cannot set '${prop}' on a readonly object`);\n    },\n    deleteProperty(_, prop) {\n      throw new TypeError(`Cannot delete '${prop}' on a readonly object`);\n    },\n    defineProperty(_, prop) {\n      throw new TypeError(`Cannot define '${prop}' on a readonly object`);\n    },\n    get(target, prop, receiver) {\n      return Reflect.get(target, prop, receiver);\n    },\n  });\n}\n\nconst cfg = readonly({ port: 3000, host: 'localhost' });\nconsole.log(cfg.port); // 3000\ncfg.port = 9000;       // TypeError\n```",
        "hint": "Use `Reflect.get` in the `get` trap so prototype methods and getters still work correctly.",
    },
    {
        "day": 9, "title": "Symbol.iterator & Custom Iterables",
        "question": "Make a `Range` class that is iterable with `for...of`. `new Range(1, 5)` should yield `1, 2, 3, 4, 5`. Also make it work with spread: `[...new Range(1,3)]` → `[1,2,3]`.",
        "answer": "```js\nclass Range {\n  constructor(start, end) {\n    this.start = start;\n    this.end = end;\n  }\n  [Symbol.iterator]() {\n    let current = this.start;\n    const end = this.end;\n    return {\n      next() {\n        if (current <= end) return { value: current++, done: false };\n        return { value: undefined, done: true };\n      }\n    };\n  }\n}\n\nfor (const n of new Range(1, 5)) console.log(n); // 1 2 3 4 5\nconsole.log([...new Range(1, 3)]); // [1, 2, 3]\n```",
        "hint": "Anything with `[Symbol.iterator]()` returning an object with a `next()` method is iterable.",
    },
    {
        "day": 10, "title": "Memoization with Cache Invalidation",
        "question": "Write a `memoize(fn, ttl)` function where cached results expire after `ttl` milliseconds. The cache key should support multiple arguments using JSON.stringify.",
        "answer": "```js\nfunction memoize(fn, ttl = Infinity) {\n  const cache = new Map();\n  return function(...args) {\n    const key = JSON.stringify(args);\n    const hit = cache.get(key);\n    if (hit && Date.now() - hit.time < ttl) return hit.value;\n    const value = fn.apply(this, args);\n    cache.set(key, { value, time: Date.now() });\n    return value;\n  };\n}\n\nconst slowAdd = (a, b) => { /* expensive */ return a + b; };\nconst fastAdd = memoize(slowAdd, 5000);\nfastAdd(1, 2); // computed\nfastAdd(1, 2); // cached (within 5s)\n```",
        "hint": "Store `{ value, time }` and compare `Date.now() - time` against `ttl`.",
    },
    {
        "day": 11, "title": "Debounce vs Throttle",
        "question": "Implement both `debounce(fn, delay)` and `throttle(fn, limit)` from scratch. Explain the exact use case difference: when would you use debounce for a search input vs throttle for a scroll handler?",
        "answer": "```js\nfunction debounce(fn, delay) {\n  let timer;\n  return function(...args) {\n    clearTimeout(timer);\n    timer = setTimeout(() => fn.apply(this, args), delay);\n  };\n}\n\nfunction throttle(fn, limit) {\n  let last = 0;\n  return function(...args) {\n    const now = Date.now();\n    if (now - last >= limit) {\n      last = now;\n      fn.apply(this, args);\n    }\n  };\n}\n```\nDebounce: fire AFTER user stops typing (search input — avoid API call on every keystroke).\nThrottle: fire AT MOST once per interval (scroll handler — cap to 60fps = 16ms).",
        "hint": "Debounce resets the timer on every call. Throttle checks elapsed time.",
    },
    {
        "day": 12, "title": "Tagged Template Literals",
        "question": "Write a `sql` tagged template literal function that sanitizes injected values to prevent SQL injection. It should return `{ query: string, params: any[] }` using parameterized placeholders.",
        "answer": "```js\nfunction sql(strings, ...values) {\n  let query = '';\n  const params = [];\n  strings.forEach((str, i) => {\n    query += str;\n    if (i < values.length) {\n      params.push(values[i]);\n      query += `$${params.length}`; // PostgreSQL-style\n    }\n  });\n  return { query: query.trim(), params };\n}\n\nconst userId = '1; DROP TABLE users;--';\nconst result = sql`SELECT * FROM users WHERE id = ${userId} AND active = ${true}`;\n// { query: 'SELECT * FROM users WHERE id = $1 AND active = $2',\n//   params: ['1; DROP TABLE users;--', true] }\n```",
        "hint": "The tag function receives an array of string segments and the interpolated values separately.",
    },
    {
        "day": 13, "title": "Object.defineProperty & Getters/Setters",
        "question": "Create a `Temperature` object with a `celsius` property. Use `Object.defineProperty` to add a `fahrenheit` getter/setter that automatically converts. Setting fahrenheit should update the internal celsius storage.",
        "answer": "```js\nconst Temperature = {\n  _celsius: 0,\n};\n\nObject.defineProperty(Temperature, 'celsius', {\n  get() { return this._celsius; },\n  set(v) { this._celsius = v; },\n  enumerable: true,\n});\n\nObject.defineProperty(Temperature, 'fahrenheit', {\n  get() { return this._celsius * 9/5 + 32; },\n  set(v) { this._celsius = (v - 32) * 5/9; },\n  enumerable: true,\n});\n\nTemperature.celsius = 100;\nconsole.log(Temperature.fahrenheit); // 212\nTemperature.fahrenheit = 32;\nconsole.log(Temperature.celsius);    // 0\n```",
        "hint": "Store the actual value in a backing `_celsius` property. Getters/setters intercept access.",
    },
    {
        "day": 14, "title": "Async Iterator & for-await-of",
        "question": "Create an async generator `paginate(fetchPage, totalPages)` where `fetchPage(n)` returns a Promise. Use `for await...of` to collect all results. Simulate API pagination.",
        "answer": "```js\nasync function* paginate(fetchPage, totalPages) {\n  for (let page = 1; page <= totalPages; page++) {\n    const data = await fetchPage(page);\n    yield data;\n  }\n}\n\n// Fake API\nconst fakeApi = (page) =>\n  new Promise(res => setTimeout(() => res({ page, items: [page*10, page*10+1] }), 50));\n\n(async () => {\n  const all = [];\n  for await (const result of paginate(fakeApi, 3)) {\n    all.push(...result.items);\n  }\n  console.log(all); // [10,11,20,21,30,31]\n})();\n```",
        "hint": "Async generators use `async function*` and `yield`. Consumed with `for await...of`.",
    },
    {
        "day": 15, "title": "Structural Sharing in Immutable Updates",
        "question": "Without mutating the original, write `updateNested(state, path, value)` where path is an array like `['user', 'address', 'city']`. The function should return a new object with structural sharing — only the changed path is new.",
        "answer": "```js\nfunction updateNested(obj, [key, ...rest], value) {\n  return {\n    ...obj,\n    [key]: rest.length === 0\n      ? value\n      : updateNested(obj[key] ?? {}, rest, value),\n  };\n}\n\nconst state = { user: { name: 'Alice', address: { city: 'Delhi', zip: '110001' } } };\nconst next = updateNested(state, ['user', 'address', 'city'], 'Mumbai');\nconsole.log(next.user.address.city);  // Mumbai\nconsole.log(state.user.address.city); // Delhi (unchanged)\nconsole.log(next.user.name === state.user.name); // true (shared)\n```",
        "hint": "Spread the object at each level, only overwriting the key in the path.",
    },
    {
        "day": 16, "title": "Event Emitter from Scratch",
        "question": "Implement a full `EventEmitter` class with `on(event, handler)`, `off(event, handler)`, `once(event, handler)`, and `emit(event, ...args)`. The `once` handler must auto-remove after first call.",
        "answer": "```js\nclass EventEmitter {\n  #listeners = new Map();\n\n  on(event, fn) {\n    if (!this.#listeners.has(event)) this.#listeners.set(event, new Set());\n    this.#listeners.get(event).add(fn);\n    return this;\n  }\n\n  off(event, fn) {\n    this.#listeners.get(event)?.delete(fn);\n    return this;\n  }\n\n  once(event, fn) {\n    const wrapper = (...args) => { fn(...args); this.off(event, wrapper); };\n    return this.on(event, wrapper);\n  }\n\n  emit(event, ...args) {\n    this.#listeners.get(event)?.forEach(fn => fn(...args));\n    return this;\n  }\n}\n```",
        "hint": "For `once`, wrap the handler in a closure that calls `off` on itself after firing.",
    },
    {
        "day": 17, "title": "Lazy Evaluation with Proxy",
        "question": "Create a `lazy(obj)` function that wraps an object so that method calls are queued but not executed until `.execute()` is called. Useful for building query builder APIs.",
        "answer": "```js\nfunction lazy(obj) {\n  const queue = [];\n  const proxy = new Proxy({}, {\n    get(_, prop) {\n      if (prop === 'execute') {\n        return () => queue.reduce((acc, [method, args]) =>\n          acc[method]?.(...args), obj);\n      }\n      return (...args) => { queue.push([prop, args]); return proxy; };\n    },\n  });\n  return proxy;\n}\n\nconst arr = lazy([3,1,4,1,5]);\nconst result = arr.filter(x => x > 1).map(x => x * 2).execute();\nconsole.log(result); // [6, 8, 10]\n```",
        "hint": "Every method call on the proxy pushes to a queue and returns the proxy for chaining.",
    },
    {
        "day": 18, "title": "Structured Concurrency with Promise.race",
        "question": "Write a `withTimeout(promise, ms)` function that rejects with `TimeoutError` if the promise takes longer than `ms`. Then write `retry(fn, times, delay)` that retries a failing async function up to N times.",
        "answer": "```js\nfunction withTimeout(promise, ms) {\n  const timeout = new Promise((_, reject) =>\n    setTimeout(() => reject(new Error(`Timed out after ${ms}ms`)), ms)\n  );\n  return Promise.race([promise, timeout]);\n}\n\nasync function retry(fn, times = 3, delay = 1000) {\n  for (let i = 0; i < times; i++) {\n    try { return await fn(); }\n    catch (err) {\n      if (i === times - 1) throw err;\n      await new Promise(r => setTimeout(r, delay * (i + 1))); // exp backoff\n    }\n  }\n}\n```",
        "hint": "`Promise.race` resolves/rejects with whichever settles first. Use exponential backoff in retry.",
    },
    {
        "day": 19, "title": "Virtual DOM Diffing (Simplified)",
        "question": "Write a `diff(oldVNode, newVNode)` function that returns an array of patches (replace, update-props, add-child, remove-child). VNodes are plain objects `{ tag, props, children }`. No need to apply patches — just detect them.",
        "answer": "```js\nfunction diff(oldN, newN, patches = []) {\n  if (!oldN) { patches.push({ type: 'ADD', node: newN }); return patches; }\n  if (!newN) { patches.push({ type: 'REMOVE' }); return patches; }\n  if (oldN.tag !== newN.tag || typeof oldN !== typeof newN) {\n    patches.push({ type: 'REPLACE', node: newN }); return patches;\n  }\n  // Prop changes\n  const propChanges = {};\n  const allKeys = new Set([...Object.keys(oldN.props||{}), ...Object.keys(newN.props||{})]);\n  allKeys.forEach(k => {\n    if (oldN.props?.[k] !== newN.props?.[k]) propChanges[k] = newN.props?.[k];\n  });\n  if (Object.keys(propChanges).length) patches.push({ type: 'PROPS', changes: propChanges });\n  // Children\n  const len = Math.max((oldN.children||[]).length, (newN.children||[]).length);\n  for (let i = 0; i < len; i++) diff(oldN.children?.[i], newN.children?.[i], patches);\n  return patches;\n}\n```",
        "hint": "Handle 4 cases: ADD (no old), REMOVE (no new), REPLACE (different tag), UPDATE (same tag, diff props/children).",
    },
    {
        "day": 20, "title": "Reactive State with Pub/Sub",
        "question": "Build a `reactive(obj)` function where setting any property automatically notifies subscribers. Support `watch(key, callback)` to subscribe to specific key changes.",
        "answer": "```js\nfunction reactive(obj) {\n  const subs = {};\n  function watch(key, cb) {\n    (subs[key] = subs[key] || []).push(cb);\n  }\n  const proxy = new Proxy(obj, {\n    set(target, key, value) {\n      const old = target[key];\n      target[key] = value;\n      subs[key]?.forEach(cb => cb(value, old));\n      return true;\n    },\n  });\n  return { proxy, watch };\n}\n\nconst { proxy: state, watch } = reactive({ count: 0 });\nwatch('count', (newVal, oldVal) => console.log(`count: ${oldVal} → ${newVal}`));\nstate.count = 1; // count: 0 → 1\nstate.count = 5; // count: 1 → 5\n```",
        "hint": "Proxy `set` trap + a Map of subscribers per key.",
    },
    {
        "day": 21, "title": "AST Micro-Evaluator",
        "question": "Write an `evaluate(node)` function for a tiny expression AST with node types: `{ type: 'Number', value }`, `{ type: 'BinaryOp', op: '+|-|*|/', left, right }`, `{ type: 'Var', name }` with an `env` object.",
        "answer": "```js\nfunction evaluate(node, env = {}) {\n  switch (node.type) {\n    case 'Number': return node.value;\n    case 'Var':    return env[node.name] ?? (() => { throw new Error(`Undefined: ${node.name}`); })();\n    case 'BinaryOp': {\n      const l = evaluate(node.left, env);\n      const r = evaluate(node.right, env);\n      if (node.op === '+') return l + r;\n      if (node.op === '-') return l - r;\n      if (node.op === '*') return l * r;\n      if (node.op === '/') return l / r;\n      throw new Error(`Unknown op: ${node.op}`);\n    }\n    default: throw new Error(`Unknown node: ${node.type}`);\n  }\n}\n\nconst ast = { type:'BinaryOp', op:'+', left:{type:'Var',name:'x'}, right:{type:'Number',value:2}};\nconsole.log(evaluate(ast, { x: 5 })); // 7\n```",
        "hint": "Recursive pattern: evaluate both sides before applying the operator.",
    },
    {
        "day": 22, "title": "Promise Queue with Concurrency Limit",
        "question": "Implement `pLimit(concurrency)` — a function that limits how many Promises run simultaneously. `pLimit(2)` means at most 2 tasks run at once; others wait in queue.",
        "answer": "```js\nfunction pLimit(concurrency) {\n  let running = 0;\n  const queue = [];\n  function next() {\n    if (running >= concurrency || queue.length === 0) return;\n    running++;\n    const { fn, resolve, reject } = queue.shift();\n    Promise.resolve(fn())\n      .then(resolve, reject)\n      .finally(() => { running--; next(); });\n  }\n  return function limit(fn) {\n    return new Promise((resolve, reject) => {\n      queue.push({ fn, resolve, reject });\n      next();\n    });\n  };\n}\n\nconst limit = pLimit(2);\nconst tasks = [1,2,3,4,5].map(n => limit(() =>\n  new Promise(r => setTimeout(() => r(n), 100))\n));\nPromise.all(tasks).then(console.log); // [1,2,3,4,5]\n```",
        "hint": "Track `running` count. When a task finishes, call `next()` to start the next queued task.",
    },
    {
        "day": 23, "title": "Flatten Deeply Nested Object",
        "question": "Write `flattenObject(obj, separator='.')` that flattens any deeply nested object into a single-level object with dot-separated keys. Arrays should be indexed. Support a custom separator.",
        "answer": "```js\nfunction flattenObject(obj, sep = '.', prefix = '') {\n  return Object.entries(obj).reduce((acc, [k, v]) => {\n    const key = prefix ? `${prefix}${sep}${k}` : k;\n    if (v !== null && typeof v === 'object' && !Array.isArray(v)) {\n      Object.assign(acc, flattenObject(v, sep, key));\n    } else if (Array.isArray(v)) {\n      v.forEach((item, i) => {\n        const arrKey = `${key}${sep}${i}`;\n        if (typeof item === 'object' && item !== null) {\n          Object.assign(acc, flattenObject(item, sep, arrKey));\n        } else { acc[arrKey] = item; }\n      });\n    } else { acc[key] = v; }\n    return acc;\n  }, {});\n}\n\nconsole.log(flattenObject({ a: { b: { c: 1 } }, d: [1, { e: 2 }] }));\n// { 'a.b.c': 1, 'd.0': 1, 'd.1.e': 2 }\n```",
        "hint": "Recurse into plain objects. Arrays: use index as key segment.",
    },
    {
        "day": 24, "title": "Serialisable Deep Clone",
        "question": "Implement `deepClone(value)` that handles: plain objects, arrays, Date, RegExp, Map, Set, and circular references. Do NOT use `JSON.parse(JSON.stringify())` — handle edge cases it misses.",
        "answer": "```js\nfunction deepClone(value, seen = new WeakMap()) {\n  if (value === null || typeof value !== 'object') return value;\n  if (seen.has(value)) return seen.get(value);\n  if (value instanceof Date)   return new Date(value);\n  if (value instanceof RegExp) return new RegExp(value.source, value.flags);\n  if (value instanceof Map) {\n    const m = new Map();\n    seen.set(value, m);\n    value.forEach((v, k) => m.set(deepClone(k, seen), deepClone(v, seen)));\n    return m;\n  }\n  if (value instanceof Set) {\n    const s = new Set();\n    seen.set(value, s);\n    value.forEach(v => s.add(deepClone(v, seen)));\n    return s;\n  }\n  const clone = Array.isArray(value) ? [] : Object.create(Object.getPrototypeOf(value));\n  seen.set(value, clone);\n  for (const key of Reflect.ownKeys(value)) {\n    clone[key] = deepClone(value[key], seen);\n  }\n  return clone;\n}\n```",
        "hint": "Use a `WeakMap` as a `seen` registry to detect circular references.",
    },
    {
        "day": 25, "title": "Functional Pipe & Compose",
        "question": "Implement `pipe(...fns)` and `compose(...fns)`. `pipe` applies functions left-to-right; `compose` right-to-left. Both should support async functions, returning a Promise when any fn is async.",
        "answer": "```js\nconst pipe = (...fns) => (x) =>\n  fns.reduce((v, f) => (v instanceof Promise ? v.then(f) : f(v)), x);\n\nconst compose = (...fns) => pipe(...fns.reverse());\n\n// Sync\nconst double = x => x * 2;\nconst addOne = x => x + 1;\nconsole.log(pipe(double, addOne)(5));    // 11\nconsole.log(compose(double, addOne)(5)); // 12\n\n// Async\nconst asyncDouble = async x => x * 2;\npipe(asyncDouble, addOne)(5).then(console.log); // 11\n```",
        "hint": "Check if the accumulator is a Promise. If yes, chain `.then(f)` instead of calling `f(v)` directly.",
    },
    {
        "day": 26, "title": "ObservableState (mini-Redux)",
        "question": "Build a `createStore(reducer, initialState)` function with `getState()`, `dispatch(action)`, and `subscribe(listener)`. Implement a `combineReducers(reducers)` helper too.",
        "answer": "```js\nfunction createStore(reducer, state) {\n  const listeners = new Set();\n  return {\n    getState: () => state,\n    dispatch(action) {\n      state = reducer(state, action);\n      listeners.forEach(l => l());\n    },\n    subscribe(listener) {\n      listeners.add(listener);\n      return () => listeners.delete(listener);\n    },\n  };\n}\n\nfunction combineReducers(reducers) {\n  return (state = {}, action) =>\n    Object.keys(reducers).reduce((next, key) => {\n      next[key] = reducers[key](state[key], action);\n      return next;\n    }, {});\n}\n\nconst root = combineReducers({\n  count: (s=0, a) => a.type==='INC' ? s+1 : s,\n});\nconst store = createStore(root);\nstore.subscribe(() => console.log(store.getState()));\nstore.dispatch({ type: 'INC' }); // { count: 1 }\n```",
        "hint": "`subscribe` should return an unsubscribe function. `combineReducers` calls each reducer with its slice.",
    },
    {
        "day": 27, "title": "Trie Data Structure",
        "question": "Implement a `Trie` class with `insert(word)`, `search(word)` (exact match), and `startsWith(prefix)`. All must run in O(L) time where L is the word length.",
        "answer": "```js\nclass TrieNode {\n  constructor() {\n    this.children = {};\n    this.isEnd = false;\n  }\n}\n\nclass Trie {\n  constructor() { this.root = new TrieNode(); }\n\n  insert(word) {\n    let node = this.root;\n    for (const ch of word) {\n      node.children[ch] ??= new TrieNode();\n      node = node.children[ch];\n    }\n    node.isEnd = true;\n  }\n\n  #traverse(str) {\n    let node = this.root;\n    for (const ch of str) {\n      if (!node.children[ch]) return null;\n      node = node.children[ch];\n    }\n    return node;\n  }\n\n  search(word)    { return this.#traverse(word)?.isEnd === true; }\n  startsWith(pfx) { return this.#traverse(pfx) !== null; }\n}\n\nconst t = new Trie();\nt.insert('apple');\nconsole.log(t.search('apple'));    // true\nconsole.log(t.startsWith('app'));  // true\nconsole.log(t.search('app'));      // false\n```",
        "hint": "Each node holds a `children` map and an `isEnd` flag. Traverse character by character.",
    },
    {
        "day": 28, "title": "Scheduler with Priority Queue",
        "question": "Build a `PriorityQueue` class and use it to create a task scheduler where tasks with lower priority numbers run first. Support `add(task, priority)` and `runAll()`.",
        "answer": "```js\nclass PriorityQueue {\n  #heap = [];\n  push(item, priority) {\n    this.#heap.push({ item, priority });\n    this.#heap.sort((a, b) => a.priority - b.priority);\n  }\n  pop()     { return this.#heap.shift()?.item; }\n  get size(){ return this.#heap.length; }\n}\n\nclass TaskScheduler {\n  #pq = new PriorityQueue();\n  add(task, priority) { this.#pq.push(task, priority); return this; }\n  async runAll() {\n    const results = [];\n    while (this.#pq.size > 0) results.push(await this.#pq.pop()());\n    return results;\n  }\n}\n\nconst s = new TaskScheduler();\ns.add(() => Promise.resolve('low'),    10)\n .add(() => Promise.resolve('high'),    1)\n .add(() => Promise.resolve('medium'),  5);\ns.runAll().then(console.log); // ['high','medium','low']\n```",
        "hint": "A simple sorted array works for small queues. For O(log n), implement a binary heap.",
    },
    {
        "day": 29, "title": "Function Serialization & Sandboxing",
        "question": "Write a `sandbox(code)` function that evaluates a JS string in an isolated scope — no access to `window`, `document`, `fetch`, or `process`. Return the result. Handle errors gracefully.",
        "answer": "```js\nfunction sandbox(code) {\n  const blocked = { window:undefined, document:undefined, fetch:undefined,\n                    process:undefined, global:undefined, globalThis:undefined };\n  try {\n    const fn = new Function(\n      ...Object.keys(blocked),\n      `'use strict'; return (${code});`\n    );\n    return { result: fn(...Object.values(blocked)), error: null };\n  } catch (e) {\n    return { result: null, error: e.message };\n  }\n}\n\nconsole.log(sandbox('2 + 2'));        // { result: 4, error: null }\nconsole.log(sandbox('window.alert')); // { result: undefined, error: null }\nconsole.log(sandbox('bad syntax }}')); // { result: null, error: '...' }\n```",
        "hint": "Pass blocked globals as parameters named the same — shadowing them in the function scope.",
    },
    {
        "day": 30, "title": "Full Async Pipeline with Error Boundaries",
        "question": "Design a `pipeline(...steps)` that runs async steps in sequence. Each step gets the previous result. If a step throws, the pipeline catches it and calls a `onError(step, error, partialResult)` handler instead of stopping. Return `{ result, errors }` at the end.",
        "answer": "```js\nasync function pipeline(...steps) {\n  const errors = [];\n  let result = undefined;\n  for (let i = 0; i < steps.length; i++) {\n    try {\n      result = await steps[i](result);\n    } catch (err) {\n      errors.push({ step: i, message: err.message });\n      // Continue with last good result\n    }\n  }\n  return { result, errors };\n}\n\n// Example\nconst { result, errors } = await pipeline(\n  () => fetch('/api/user').then(r => r.json()),\n  user => ({ ...user, fullName: `${user.first} ${user.last}` }),\n  user => { throw new Error('Enrichment failed'); },\n  user => ({ ...user, processed: true }),\n);\nconsole.log(result, errors);\n// result has the user from step before failure\n// errors: [{ step: 2, message: 'Enrichment failed' }]\n```",
        "hint": "Wrap each step in try/catch. On error, push to errors array but DON'T update result — carry the last good value forward.",
    },
]


def is_even_saturday(dt: datetime) -> bool:
    if dt.weekday() != 5:
        return False
    week_number = (dt.day - 1) // 7 + 1
    return week_number in (2, 4)


def is_working_day(dt: datetime) -> bool:
    if dt.weekday() == 6:
        return False
    return not is_even_saturday(dt)


IST = timezone(timedelta(hours=5, minutes=30))


def get_ist_now():
    return datetime.now(IST)


# ── Helpers ───────────────────────────────────────────────────────────────────

def get_user_day(joined_at: datetime) -> int:
    """Day number (1-30) for a user based on working days since join."""
    ist_now = get_ist_now()
    ist_join = joined_at.astimezone(IST)
    current = ist_join.date()
    end = ist_now.date()
    working_days = 0
    while current < end:
        dt = datetime.combine(current, datetime.min.time(), tzinfo=IST)
        if is_working_day(dt):
            working_days += 1
        from datetime import timedelta as td
        current += td(days=1)
    day = (working_days % 30) + 1
    return day


# ── Endpoints ─────────────────────────────────────────────────────────────────

@router.get("/status")
async def challenge_status(user=Depends(current_user)):
    prog = await col_challenge_progress().find_one({"userId": user["id"]})
    if not prog:
        return {"joined": False}
    day = get_user_day(prog["joinedAt"])
    return {
        "joined": True,
        "currentDay": day,
        "joinedAt": prog["joinedAt"].isoformat(),
        "optedIn": prog.get("optedIn", True),
    }


@router.post("/join")
async def join_challenge(user=Depends(current_user)):
    existing = await col_challenge_progress().find_one({"userId": user["id"]})
    if existing:
        raise HTTPException(400, "Already joined")
    await col_challenge_progress().insert_one({
        "userId":   user["id"],
        "userName": user.get("name", ""),
        "joinedAt": now(),
        "optedIn":  True,
        "answers":  [],
    })
    return {"message": "Joined! Your 30-day challenge starts today."}


@router.post("/opt-toggle")
async def toggle_opt(user=Depends(current_user)):
    prog = await col_challenge_progress().find_one({"userId": user["id"]})
    if not prog:
        raise HTTPException(404, "Not joined")
    new_val = not prog.get("optedIn", True)
    await col_challenge_progress().update_one(
        {"userId": user["id"]}, {"$set": {"optedIn": new_val}}
    )
    return {"optedIn": new_val}


@router.get("/today")
async def today_question(user=Depends(current_user)):
    prog = await col_challenge_progress().find_one({"userId": user["id"]})
    if not prog:
        raise HTTPException(404, "Not joined")
    day = get_user_day(prog["joinedAt"])
    q = JS_QUESTIONS[day - 1]
    answered = next((a for a in prog.get("answers", []) if a["day"] == day), None)
    return {
        "day": day,
        "title": q["title"],
        "question": q["question"],
        "hint": q["hint"],
        "answered": answered is not None,
        "result": answered.get("result") if answered else None,
        "answer": q["answer"] if answered else None,
    }


class AnswerBody(BaseModel):
    result: str  # "got_it" or "missed"


@router.post("/answer")
async def submit_answer(body: AnswerBody, user=Depends(current_user)):
    if body.result not in ("got_it", "missed"):
        raise HTTPException(400, "result must be 'got_it' or 'missed'")
    prog = await col_challenge_progress().find_one({"userId": user["id"]})
    if not prog:
        raise HTTPException(404, "Not joined")
    day = get_user_day(prog["joinedAt"])
    if any(a["day"] == day for a in prog.get("answers", [])):
        raise HTTPException(400, "Already answered today")
    await col_challenge_progress().update_one(
        {"userId": user["id"]},
        {"$push": {"answers": {"day": day, "result": body.result, "answeredAt": now()}}}
    )
    q = JS_QUESTIONS[day - 1]
    return {"answer": q["answer"], "day": day, "result": body.result}


@router.get("/history")
async def challenge_history(user=Depends(current_user)):
    prog = await col_challenge_progress().find_one({"userId": user["id"]})
    if not prog:
        return {"joined": False, "history": []}
    day = get_user_day(prog["joinedAt"])
    answers_map = {a["day"]: a for a in prog.get("answers", [])}
    history = []
    for q in JS_QUESTIONS:
        d = q["day"]
        a = answers_map.get(d)
        history.append({
            "day": d,
            "title": q["title"],
            "status": a["result"] if a else ("current" if d == day else ("locked" if d > day else "skipped")),
            "answeredAt": a["answeredAt"].isoformat() if a and isinstance(a.get("answeredAt"), datetime) else None,
        })
    return {"joined": True, "currentDay": day, "history": history}
