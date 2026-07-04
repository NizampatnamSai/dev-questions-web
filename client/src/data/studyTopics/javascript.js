// 105 javascript topics for Study Hub.
export default [
  {
    id: "javascript-for-loop",
    category: "javascript",
    topic: "Loops",
    title: "for loop",
    difficulty: "Basic",
    summary: "Classic iteration with init, condition, increment",
    explanation:
      "break exits the loop entirely. continue skips the current iteration and moves to the next. Both work in for, while, do-while, and for...of.",
    code: "for (let i = 0; i < 5; i++) {\n  if (i === 2) continue; // skip 2\n  if (i === 4) break;    // stop at 4\n  console.log(i); // 0 1 3\n}",
    interviewQuestion: "What is the difference between break and continue?",
  },
  {
    id: "javascript-for-of",
    category: "javascript",
    topic: "Loops",
    title: "for...of",
    difficulty: "Basic",
    summary: "Iterate over iterables: arrays, strings, Maps, Sets",
    explanation:
      "Plain objects — they are not iterable by default. Use for...in for keys, or Object.entries() with for...of. for...of works on anything with [Symbol.iterator].",
    code: "for (const char of 'hello') console.log(char); // h e l l o\nfor (const [k, v] of new Map([['a',1]])) console.log(k, v);\nfor (const item of new Set([1,2,2,3])) console.log(item); // 1 2 3",
    interviewQuestion: "What can you NOT iterate with for...of?",
  },
  {
    id: "javascript-for-in",
    category: "javascript",
    topic: "Loops",
    title: "for...in",
    difficulty: "Tricky",
    summary: "Iterate over enumerable string keys of an object",
    explanation:
      "It iterates prototype chain keys too, and key order isn't guaranteed for numeric indices in all engines. Use for...of or forEach for arrays.",
    code: "const obj = { a: 1, b: 2 };\nfor (const key in obj) {\n  if (Object.hasOwn(obj, key)) // skip prototype props\n    console.log(key, obj[key]);\n}",
    interviewQuestion: "Why is for...in dangerous on arrays?",
  },
  {
    id: "javascript-while-do-while",
    category: "javascript",
    topic: "Loops",
    title: "while & do-while",
    difficulty: "Basic",
    summary: "Condition-first vs body-first loops",
    explanation:
      "When the body must execute at least once — e.g., prompt user until valid input, game loop, retry logic.",
    code: "let i = 0;\nwhile (i < 3) { console.log(i); i++; }\n\nlet input;\ndo {\n  input = getInput();\n} while (!isValid(input)); // always runs once",
    interviewQuestion: "When does do-while make more sense than while?",
  },
  {
    id: "javascript-foreach",
    category: "javascript",
    topic: "Loops",
    title: "forEach",
    difficulty: "Basic",
    summary: "Array method — iterate with callback",
    explanation:
      "No. return inside forEach only exits the callback, not the loop. You cannot break out early. Use for...of if you need break/return, or .some() for early exit.",
    code: "[1,2,3].forEach((n, index, arr) => {\n  console.log(n, index);\n  return; // only exits callback, loop continues\n});\n// Early exit trick\n[1,2,3].some(n => { console.log(n); return n === 2; }); // stops at 2",
    interviewQuestion: "Does forEach respect return or break?",
  },
  {
    id: "javascript-switch-statement",
    category: "javascript",
    topic: "Control Flow",
    title: "switch statement",
    difficulty: "Basic",
    summary: "Multi-branch conditional on a single value",
    explanation:
      "Without break, execution continues into the next case. Intentional fall-through shares code between cases. Accidental fall-through is a common bug.",
    code: "switch (status) {\n  case 'loading':\n  case 'pending': // fall-through -- same handler\n    showSpinner();\n    break;\n  case 'done':\n    showData();\n    break;\n  default:\n    showError();\n}",
    interviewQuestion: "What is fall-through in switch?",
  },
  {
    id: "javascript-ternary-operator",
    category: "javascript",
    topic: "Control Flow",
    title: "Ternary operator",
    difficulty: "Basic",
    summary: "condition ? valueIfTrue : valueIfFalse",
    explanation:
      "Technically yes, but deeply nested ternaries are hard to read. Prefer if/else or early return for complex logic.",
    code: "const role = isAdmin ? 'admin' : isEditor ? 'editor' : 'viewer';\n// Cleaner with if/else for > 2 branches",
    interviewQuestion: "Can you nest ternaries?",
  },
  {
    id: "javascript-try-catch-finally",
    category: "javascript",
    topic: "Control Flow",
    title: "try/catch/finally",
    difficulty: "Intermediate",
    summary: "Error handling in synchronous and async code",
    explanation:
      "Yes. finally always runs — after try, catch, or even after return. The return value from finally overrides a return in try/catch.",
    code: "async function load() {\n  try {\n    const data = await fetchData();\n    return data;\n  } catch (err) {\n    if (err instanceof NetworkError) retry();\n    else throw err; // re-throw unknown errors\n  } finally {\n    setLoading(false); // always runs\n  }\n}",
    interviewQuestion: "Does finally run even after return in try?",
  },
  {
    id: "javascript-optional-chaining-nullish",
    category: "javascript",
    topic: "Control Flow",
    title: "Optional chaining & nullish",
    difficulty: "Intermediate",
    summary: "?. and ?? for safe property access",
    explanation:
      "?. short-circuits if value is null/undefined (returns undefined). ?? provides fallback for null/undefined only. Combine them: obj?.value ?? 'default'.",
    code: "const street = user?.address?.street ?? 'No address';\nconst len = str?.trim()?.length ?? 0;\n// Safe method call\nconst res = obj?.method?.() ?? [];",
    interviewQuestion: "What is the difference between ?. and ??",
  },
  {
    id: "javascript-map",
    category: "javascript",
    topic: "Arrays",
    title: "map",
    difficulty: "Basic",
    summary: "Transform each element, return new array",
    explanation:
      "Yes. map, filter, reduce skip holes (empty slots) in sparse arrays. forEach also skips them. Array.from does not — fills with undefined.",
    code: "const nums = [1, 2, 3];\nconst doubled = nums.map(n => n * 2); // [2, 4, 6]\n// With index\nconst indexed = nums.map((n, i) => ({ index: i, value: n }));",
    interviewQuestion: "Does map skip empty slots in sparse arrays?",
  },
  {
    id: "javascript-filter",
    category: "javascript",
    topic: "Arrays",
    title: "filter",
    difficulty: "Basic",
    summary: "Keep elements passing predicate, return new array",
    explanation: "Empty array [] — never null or undefined. Safe to chain.",
    code: "const evens = [1,2,3,4].filter(n => n % 2 === 0); // [2,4]\nconst active = users.filter(u => u.active && u.role === 'admin');",
    interviewQuestion: "What does filter return if nothing matches?",
  },
  {
    id: "javascript-reduce",
    category: "javascript",
    topic: "Arrays",
    title: "reduce",
    difficulty: "Intermediate",
    summary: "Accumulate array into single value",
    explanation:
      "TypeError: Reduce of empty array with no initial value. Always provide an initial value for safety.",
    code: "const sum = [1,2,3].reduce((acc, n) => acc + n, 0); // 6\n// Group by\nconst grouped = users.reduce((acc, u) => {\n  (acc[u.role] ??= []).push(u);\n  return acc;\n}, {});",
    interviewQuestion:
      "What happens if you call reduce on empty array without initial value?",
  },
  {
    id: "javascript-find-findindex",
    category: "javascript",
    topic: "Arrays",
    title: "find & findIndex",
    difficulty: "Basic",
    summary: "Find first matching element/index",
    explanation:
      "undefined. findIndex returns -1. Different from filter which returns [].",
    code: "const user = users.find(u => u.id === 42); // or undefined\nconst idx = users.findIndex(u => u.id === 42); // or -1\nconst found = users.findLast(u => u.active); // from end (ES2023)",
    interviewQuestion: "What does find return if nothing matches?",
  },
  {
    id: "javascript-some-every",
    category: "javascript",
    topic: "Arrays",
    title: "some & every",
    difficulty: "Basic",
    summary: "Check if any/all elements match predicate",
    explanation:
      "No. Both return boolean and stop early — some stops at first true, every stops at first false.",
    code: "const hasAdmin = users.some(u => u.role === 'admin');\nconst allActive = users.every(u => u.active);\n// Equivalent: !users.some(u => !u.active)",
    interviewQuestion: "Does some or every mutate the array?",
  },
  {
    id: "javascript-flat-flatmap",
    category: "javascript",
    topic: "Arrays",
    title: "flat & flatMap",
    difficulty: "Intermediate",
    summary: "Flatten nested arrays",
    explanation:
      "Number of levels to flatten. flat() defaults to 1. flat(Infinity) fully flattens.",
    code: "[[1,2],[3,[4,5]]].flat();    // [1,2,3,[4,5]]\n[[1,2],[3,[4,5]]].flat(2);   // [1,2,3,4,5]\n// flatMap = map then flat(1)\n[1,2,3].flatMap(n => [n, n*2]); // [1,2,2,4,3,6]",
    interviewQuestion: "What is the depth parameter in flat()?",
  },
  {
    id: "javascript-sort",
    category: "javascript",
    topic: "Arrays",
    title: "sort",
    difficulty: "Tricky",
    summary: "Sort array in-place",
    explanation:
      "Default sort converts elements to strings and sorts lexicographically. [10,9,2].sort() = [10,2,9]! Always provide a comparator for numbers.",
    code: "// WRONG: lexicographic\n[10, 2, 9].sort(); // [10, 2, 9]\n// CORRECT: numeric\n[10, 2, 9].sort((a, b) => a - b); // [2, 9, 10]\n// Stable sort (guaranteed ES2019+)\nusers.sort((a, b) => a.name.localeCompare(b.name));",
    interviewQuestion: "What is the default sort order and its pitfall?",
  },
  {
    id: "javascript-splice-vs-slice",
    category: "javascript",
    topic: "Arrays",
    title: "splice vs slice",
    difficulty: "Tricky",
    summary: "Mutating vs non-mutating array operations",
    explanation:
      "splice mutates in-place (returns removed elements). slice returns new array without mutating.",
    code: "const arr = [1,2,3,4,5];\narr.splice(1, 2);       // removes 2 elements at index 1; arr = [1,4,5]\narr.splice(1, 0, 'a');  // insert 'a' at index 1\nconst copy = arr.slice(1, 3); // [4,5] -- no mutation",
    interviewQuestion: "Which one mutates the original array?",
  },
  {
    id: "javascript-array-from-array-of",
    category: "javascript",
    topic: "Arrays",
    title: "Array.from & Array.of",
    difficulty: "Intermediate",
    summary: "Create arrays from iterables and arguments",
    explanation:
      "Array.from({length: N}, (_, i) => i) creates [0,1,...,N-1]. Array(N).fill(0) creates N zeros. Never use new Array(N) for values — creates sparse array.",
    code: "Array.from('hello');           // ['h','e','l','l','o']\nArray.from({length:5},(_,i)=>i); // [0,1,2,3,4]\nArray.from(new Set([1,2,2]));  // [1,2]\nArray.of(1,2,3);               // [1,2,3]",
    interviewQuestion: "How do you create an array of N items?",
  },
  {
    id: "javascript-includes-vs-indexof",
    category: "javascript",
    topic: "Arrays",
    title: "includes vs indexOf",
    difficulty: "Basic",
    summary: "Check membership",
    explanation:
      "indexOf uses strict equality — can't find NaN (NaN !== NaN). includes uses SameValueZero — correctly finds NaN.",
    code: "[1,NaN,3].includes(NaN);    // true\n[1,NaN,3].indexOf(NaN);     // -1 (bug!)\n[1,2,3].includes(2);         // true\n[1,2,3].indexOf(2);          // 1 (index)",
    interviewQuestion: "Why use includes instead of indexOf for NaN?",
  },
  {
    id: "javascript-object-methods",
    category: "javascript",
    topic: "Objects",
    title: "Object methods",
    difficulty: "Basic",
    summary: "Create, assign, freeze, keys",
    explanation:
      "freeze: no add, no delete, no modify. seal: no add, no delete, but CAN modify existing values. Both are shallow — nested objects are not frozen/sealed.",
    code: "const cfg = Object.freeze({ db: 'mongo', port: 27017 });\ncfg.port = 9999; // silently ignored (TypeError in strict mode)\n\nconst obj = Object.seal({ x: 1 });\nobj.x = 2;   // allowed\nobj.y = 3;   // silently ignored",
    interviewQuestion: "What is Object.freeze vs Object.seal?",
  },
  {
    id: "javascript-getters-setters",
    category: "javascript",
    topic: "Objects",
    title: "Getters & Setters",
    difficulty: "Intermediate",
    summary: "Computed properties with get/set",
    explanation:
      "Getters look like properties — good for computed values derived from other properties (fullName from firstName+lastName). Setters add validation on assignment.",
    code: "const user = {\n  _name: 'Alice',\n  get name() { return this._name.toUpperCase(); },\n  set name(v) {\n    if (typeof v !== 'string') throw TypeError();\n    this._name = v.trim();\n  }\n};\nuser.name; // 'ALICE'\nuser.name = ' Bob '; // trimmed to 'Bob'",
    interviewQuestion: "When would you use a getter instead of a method?",
  },
  {
    id: "javascript-destructuring",
    category: "javascript",
    topic: "Objects",
    title: "Destructuring",
    difficulty: "Intermediate",
    summary: "Extract values from objects/arrays",
    explanation:
      "Use colon: { oldName: newName } = obj. Combine with default: { name: displayName = 'Guest' } = user.",
    code: "const { name: displayName = 'Guest', age = 0 } = user;\nconst [first, , third, ...rest] = arr;\n// Nested\nconst { address: { city, zip } } = user;\n// Function params\nfunction draw({ x = 0, y = 0, color = 'black' } = {}) {}",
    interviewQuestion: "How do you rename during destructuring?",
  },
  {
    id: "javascript-spread-rest",
    category: "javascript",
    topic: "Objects",
    title: "Spread & Rest",
    difficulty: "Basic",
    summary: "... operator for expand and collect",
    explanation:
      "No. Spread only copies own enumerable properties. Class instances lose their methods when spread into plain object.",
    code: "const merged = { ...defaults, ...overrides };\nconst clone = { ...original }; // shallow copy\nfunction sum(...nums) { return nums.reduce((a,n) => a+n, 0); }\nsum(1, 2, 3, 4); // 10",
    interviewQuestion: "Does spread copy prototype methods?",
  },
  {
    id: "javascript-classes",
    category: "javascript",
    topic: "Objects",
    title: "Classes",
    difficulty: "Intermediate",
    summary: "ES6 class syntax over prototype",
    explanation:
      "Yes, always. class body is always strict mode regardless of 'use strict'. Also: class declarations are NOT hoisted like function declarations (TDZ applies).",
    code: "class Animal {\n  #name; // private field\n  constructor(name) { this.#name = name; }\n  get name() { return this.#name; }\n  speak() { return `${this.#name} makes a sound`; }\n  static create(name) { return new Animal(name); }\n}\nclass Dog extends Animal {\n  speak() { return super.speak() + ' (woof)'; }\n}",
    interviewQuestion: "Are class bodies in strict mode?",
  },
  {
    id: "javascript-private-class-fields",
    category: "javascript",
    topic: "Objects",
    title: "Private class fields",
    difficulty: "Advanced",
    summary: "# prefix fields only accessible inside class body",
    explanation:
      "Use #field in obj (ergonomic brand check, ES2022). Returns true if obj is an instance with that private field.",
    code: "class Circle {\n  #radius;\n  constructor(r) { this.#radius = r; }\n  get area() { return Math.PI * this.#radius ** 2; }\n  static isCircle(obj) { return #radius in obj; }\n}\nCircle.isCircle(new Circle(5)); // true",
    interviewQuestion: "Can you check if an object has a private field?",
  },
  {
    id: "javascript-call-apply-bind",
    category: "javascript",
    topic: "Functions",
    title: "call, apply, bind",
    difficulty: "Intermediate",
    summary: "Explicitly set 'this' context",
    explanation:
      "call passes arguments individually. apply passes as array. bind returns new function with 'this' bound — doesn't call immediately.",
    code: "function greet(greeting, punct) {\n  return `${greeting}, ${this.name}${punct}`;\n}\nconst user = { name: 'Alice' };\ngreet.call(user, 'Hello', '!');   // call: individual args\ngreet.apply(user, ['Hi', '?']);    // apply: array args\nconst hi = greet.bind(user, 'Hi'); // bind: partial application\nhi('!'); // 'Hi, Alice!'",
    interviewQuestion: "What is the difference between call and apply?",
  },
  {
    id: "javascript-iife",
    category: "javascript",
    topic: "Functions",
    title: "IIFE",
    difficulty: "Basic",
    summary: "Immediately Invoked Function Expression — creates isolated scope",
    explanation:
      "ES modules have their own scope — no need for IIFE to avoid polluting global. Still useful for async in top-level environments without module support.",
    code: "(function() {\n  var private = 'not global';\n})();\n// Arrow IIFE\n(() => {\n  const data = init();\n  render(data);\n})();\n// Async IIFE\n(async () => {\n  const data = await fetchData();\n})();",
    interviewQuestion: "Why are IIFEs less common in modern JS?",
  },
  {
    id: "javascript-currying",
    category: "javascript",
    topic: "Functions",
    title: "Currying",
    difficulty: "Advanced",
    summary: "Transform f(a,b,c) into f(a)(b)(c)",
    explanation:
      "Partial application: fix some arguments, return function needing the rest. Currying: each call takes exactly one argument. Related but distinct.",
    code: "const curry = fn => {\n  const arity = fn.length;\n  return function curried(...args) {\n    if (args.length >= arity) return fn(...args);\n    return (...more) => curried(...args, ...more);\n  };\n};\nconst add = curry((a, b, c) => a + b + c);\nadd(1)(2)(3); // 6\nadd(1, 2)(3); // 6",
    interviewQuestion: "What is partial application vs currying?",
  },
  {
    id: "javascript-debounce-throttle",
    category: "javascript",
    topic: "Functions",
    title: "Debounce & Throttle",
    difficulty: "Advanced",
    summary: "Limit rate of function calls",
    explanation:
      "Debounce: waits for pause in calls, fires once after (search input). Throttle: fires at most once per interval regardless of how many calls (scroll handler).",
    code: "function debounce(fn, ms) {\n  let timer;\n  return (...args) => {\n    clearTimeout(timer);\n    timer = setTimeout(() => fn(...args), ms);\n  };\n}\nfunction throttle(fn, ms) {\n  let last = 0;\n  return (...args) => {\n    const now = Date.now();\n    if (now - last >= ms) { last = now; fn(...args); }\n  };\n}",
    interviewQuestion: "What is the difference between debounce and throttle?",
  },
  {
    id: "javascript-memoization",
    category: "javascript",
    topic: "Functions",
    title: "Memoization",
    difficulty: "Advanced",
    summary: "Cache function results by input",
    explanation:
      "When function has side effects or depends on external state. The cache returns old value even if external state changed.",
    code: "function memoize(fn) {\n  const cache = new Map();\n  return function(...args) {\n    const key = JSON.stringify(args);\n    if (cache.has(key)) return cache.get(key);\n    const result = fn.apply(this, args);\n    cache.set(key, result);\n    return result;\n  };\n}\nconst fib = memoize(n => n <= 1 ? n : fib(n-1) + fib(n-2));",
    interviewQuestion: "When does memoization cause bugs?",
  },
  {
    id: "javascript-string-methods",
    category: "javascript",
    topic: "Strings",
    title: "String methods",
    difficulty: "Basic",
    summary: "Common built-in string operations",
    explanation:
      "Yes. Negative indices count from the end. substr is deprecated — use slice or substring.",
    code: "'hello world'.includes('world');  // true\n'hello'.startsWith('hel');        // true\n'  hi  '.trim();                  // 'hi'\n'a,b,c'.split(',');               // ['a','b','c']\n'hello'.slice(-3);                // 'llo'\n'ha'.repeat(3);                   // 'hahaha'\n'abc'.padStart(5, '0');           // '00abc'",
    interviewQuestion: "Does slice work on negative indices?",
  },
  {
    id: "javascript-template-literals",
    category: "javascript",
    topic: "Strings",
    title: "Template literals",
    difficulty: "Basic",
    summary: "Backtick strings with interpolation and multi-line",
    explanation:
      "A function called with parts of a template literal. Used by libraries like styled-components, graphql, sql for safe interpolation.",
    code: "const name = 'World';\n`Hello ${name}!`; // interpolation\n// Multi-line\nconst html = `\n  <div>\n    <p>${content}</p>\n  </div>\n`;\n// Tagged template\nfunction sql(strings, ...values) {\n  return strings.reduce((q, s, i) => q + s + (values[i] ?? ''), '');\n}\nsql`SELECT * FROM users WHERE id = ${userId}`;",
    interviewQuestion: "What are tagged template literals?",
  },
  {
    id: "javascript-regular-expressions",
    category: "javascript",
    topic: "Strings",
    title: "Regular Expressions",
    difficulty: "Intermediate",
    summary: "Pattern matching with RegExp",
    explanation:
      "RegExp.test(str) returns boolean. String.match(regex) returns array of matches or null. Use /g flag for all matches.",
    code: "const emailRe = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;\nemailRe.test('a@b.com'); // true\n\n'hello world'.match(/\\w+/g); // ['hello', 'world']\n'foo bar baz'.replace(/\\b\\w/g, c => c.toUpperCase()); // 'Foo Bar Baz'\n// Named groups\nconst { year, month } = '2024-01'.match(/(?<year>\\d{4})-(?<month>\\d{2})/).groups;",
    interviewQuestion: "What is the difference between test and match?",
  },
  {
    id: "javascript-map-2",
    category: "javascript",
    topic: "Data Structures",
    title: "Map",
    difficulty: "Intermediate",
    summary: "Key-value pairs with any key type",
    explanation:
      "Map: any key type (objects, functions), maintains insertion order, has .size, no prototype pollution, better performance for frequent add/delete.",
    code: "const map = new Map();\nmap.set('key', 'value');\nmap.set({id:1}, 'obj key'); // objects as keys!\nmap.get('key');    // 'value'\nmap.has('key');    // true\nmap.size;          // 2\n// Iterate\nfor (const [k, v] of map) console.log(k, v);",
    interviewQuestion: "When to use Map over plain object?",
  },
  {
    id: "javascript-set",
    category: "javascript",
    topic: "Data Structures",
    title: "Set",
    difficulty: "Intermediate",
    summary: "Collection of unique values",
    explanation:
      "Use filter + has: [...setA].filter(x => setB.has(x)). ES2025 adds Set.prototype.intersection() natively.",
    code: "const set = new Set([1, 2, 2, 3]); // {1, 2, 3}\nset.add(4); set.delete(2);\nset.has(3); // true\nset.size;   // 3\n// Remove duplicates from array\nconst unique = [...new Set(arr)];\n// Union\nconst union = new Set([...setA, ...setB]);",
    interviewQuestion: "How do you find the intersection of two Sets?",
  },
  {
    id: "javascript-weakmap-weakset",
    category: "javascript",
    topic: "Data Structures",
    title: "WeakMap & WeakSet",
    difficulty: "Advanced",
    summary: "Weak references — entries garbage-collected when key unreachable",
    explanation:
      "Storing private data per object instance without preventing GC. Caching computed results per DOM node. Cannot be iterated — no memory leak risk.",
    code: "const metadata = new WeakMap();\nfunction process(obj) {\n  if (metadata.has(obj)) return metadata.get(obj);\n  const result = expensiveCompute(obj);\n  metadata.set(obj, result);\n  return result;\n}\n// When obj is garbage collected, entry is removed automatically",
    interviewQuestion: "When would you use WeakMap?",
  },
  {
    id: "javascript-symbol",
    category: "javascript",
    topic: "Data Structures",
    title: "Symbol",
    difficulty: "Advanced",
    summary: "Unique, immutable primitive values",
    explanation:
      "Customize built-in JS behaviour: Symbol.iterator makes object iterable, Symbol.toPrimitive controls coercion, Symbol.hasInstance controls instanceof.",
    code: "const id = Symbol('id');\nconst id2 = Symbol('id');\nid === id2; // false -- always unique\n// Well-known Symbol\nclass Range {\n  constructor(from, to) { this.from = from; this.to = to; }\n  [Symbol.iterator]() {\n    let cur = this.from;\n    return { next: () => cur <= this.to ? { value: cur++, done: false } : { done: true } };\n  }\n}\n[...new Range(1,4)]; // [1,2,3,4]",
    interviewQuestion: "What are well-known Symbols used for?",
  },
  {
    id: "javascript-event-handling",
    category: "javascript",
    topic: "Browser",
    title: "Event handling",
    difficulty: "Intermediate",
    summary: "addEventListener, event delegation",
    explanation:
      "Attach one listener to parent instead of many to children. Handles dynamically added elements. Memory efficient for lists.",
    code: "// Instead of one listener per item:\ndocument.querySelector('#list').addEventListener('click', e => {\n  const item = e.target.closest('li');\n  if (!item) return;\n  console.log(item.dataset.id);\n});\n// e.stopPropagation() -- stop bubbling\n// e.preventDefault() -- prevent default action",
    interviewQuestion: "What is event delegation and why use it?",
  },
  {
    id: "javascript-fetch-api",
    category: "javascript",
    topic: "Browser",
    title: "Fetch API",
    difficulty: "Intermediate",
    summary: "Modern HTTP requests",
    explanation:
      "No! fetch only rejects on network failure. A 404 or 500 resolves with ok:false. Always check res.ok or res.status.",
    code: "async function fetchUser(id) {\n  const res = await fetch(`/api/users/${id}`, {\n    method: 'GET',\n    headers: { 'Content-Type': 'application/json',\n               'Authorization': `Bearer ${token}` }\n  });\n  if (!res.ok) throw new Error(`HTTP ${res.status}`);\n  return res.json();\n}",
    interviewQuestion: "Does fetch reject on 4xx/5xx responses?",
  },
  {
    id: "javascript-localstorage-sessionstorage",
    category: "javascript",
    topic: "Browser",
    title: "localStorage & sessionStorage",
    difficulty: "Basic",
    summary: "Browser key-value storage",
    explanation:
      "localStorage persists until explicitly cleared. sessionStorage cleared when tab closes. Both: 5-10MB, string values only, synchronous (can block UI).",
    code: "localStorage.setItem('key', JSON.stringify(obj));\nconst data = JSON.parse(localStorage.getItem('key'));\nlocalStorage.removeItem('key');\nlocalStorage.clear();\n// sessionStorage: same API but tab-scoped\nsessionStorage.setItem('temp', 'value');",
    interviewQuestion:
      "What is the difference between localStorage and sessionStorage?",
  },
  {
    id: "javascript-intersectionobserver",
    category: "javascript",
    topic: "Browser",
    title: "IntersectionObserver",
    difficulty: "Advanced",
    summary: "Observe when element enters/exits viewport",
    explanation:
      "Lazy loading images, infinite scroll, analytics (element viewed), triggering animations on scroll — without scroll event listeners (which cause jank).",
    code: "const observer = new IntersectionObserver((entries) => {\n  entries.forEach(entry => {\n    if (entry.isIntersecting) {\n      entry.target.src = entry.target.dataset.src; // lazy load\n      observer.unobserve(entry.target);\n    }\n  });\n}, { threshold: 0.1 });\ndocument.querySelectorAll('img[data-src]').forEach(img => observer.observe(img));",
    interviewQuestion: "What is IntersectionObserver used for?",
  },
  {
    id: "javascript-mutationobserver",
    category: "javascript",
    topic: "Browser",
    title: "MutationObserver",
    difficulty: "Advanced",
    summary: "Watch DOM for changes",
    explanation:
      "Third-party widgets injecting content, monitoring dynamic content for accessibility, implementing undo for DOM changes.",
    code: "const observer = new MutationObserver(mutations => {\n  mutations.forEach(m => {\n    m.addedNodes.forEach(node => console.log('Added:', node));\n  });\n});\nobserver.observe(document.body, {\n  childList: true,\n  subtree: true,\n  attributes: true\n});\nobserver.disconnect(); // stop observing",
    interviewQuestion: "When do you need MutationObserver?",
  },
  {
    id: "javascript-json",
    category: "javascript",
    topic: "Utilities",
    title: "JSON",
    difficulty: "Basic",
    summary: "Serialize/deserialize JavaScript values",
    explanation:
      "undefined, functions, and Symbols are omitted from objects and become null in arrays. Use replacer parameter to handle them.",
    code: "JSON.stringify({ a: 1, b: undefined, c: () => {} }); // '{\"a\":1}'\nJSON.stringify([1, undefined, 3]);                    // '[1,null,3]'\n// Pretty print\nJSON.stringify(obj, null, 2);\n// Replacer\nJSON.stringify(obj, (key, val) => val instanceof Date ? val.toISOString() : val);",
    interviewQuestion: "What values does JSON.stringify lose?",
  },
  {
    id: "javascript-date",
    category: "javascript",
    topic: "Utilities",
    title: "Date",
    difficulty: "Basic",
    summary: "Built-in date/time handling",
    explanation:
      "Date string parsing is implementation-dependent for formats other than ISO 8601. 'Jan 1 2024' may differ across browsers. Always use ISO 8601 (YYYY-MM-DD) or a library like date-fns.",
    code: "const now = new Date();\nnow.toISOString();        // '2024-01-15T10:30:00.000Z'\nDate.now();               // milliseconds since epoch\nnew Date(2024, 0, 15);   // Jan 15 2024 (month is 0-indexed!)\nconst diff = dateB - dateA; // milliseconds",
    interviewQuestion: "Why is Date.parse unreliable?",
  },
  {
    id: "javascript-math",
    category: "javascript",
    topic: "Utilities",
    title: "Math",
    difficulty: "Basic",
    summary: "Mathematical functions",
    explanation:
      "round: nearest integer (0.5 rounds up). floor: always down. ceil: always up. trunc: removes decimal (toward zero — different from floor for negatives).",
    code: "Math.round(4.5);  // 5\nMath.round(-4.5); // -4 (rounds toward +infinity)\nMath.floor(-4.1); // -5\nMath.trunc(-4.9); // -4 (just removes decimal)\nMath.max(...arr); // spread for array\nMath.random();    // [0, 1)\n(Math.random() * (max-min) + min) | 0; // random int",
    interviewQuestion:
      "What is the difference between Math.round, floor, ceil, and trunc?",
  },
  {
    id: "javascript-error-types",
    category: "javascript",
    topic: "Error Handling",
    title: "Error types",
    difficulty: "Intermediate",
    summary: "TypeError, RangeError, ReferenceError, SyntaxError, URIError",
    explanation:
      "When callers need to distinguish your error from generic ones programmatically — catch (e) { if (e instanceof ValidationError) ... }. Include extra fields for context.",
    code: "class AppError extends Error {\n  constructor(message, statusCode, code) {\n    super(message);\n    this.name = 'AppError';\n    this.statusCode = statusCode;\n    this.code = code;\n  }\n}\ntry {\n  throw new AppError('Not found', 404, 'USER_NOT_FOUND');\n} catch (e) {\n  if (e instanceof AppError) console.log(e.statusCode);\n  else throw e; // re-throw unknown errors\n}",
    interviewQuestion: "When should you create custom Error classes?",
  },
  {
    id: "javascript-module-pattern",
    category: "javascript",
    topic: "Design Patterns",
    title: "Module pattern",
    difficulty: "Intermediate",
    summary: "Encapsulate code and expose public API",
    explanation:
      "Define everything privately, return an object exposing only public parts. Predecessor to ES modules.",
    code: "const Counter = (() => {\n  let count = 0; // private\n  const increment = () => ++count;\n  const reset = () => { count = 0; };\n  return { increment, reset, getCount: () => count }; // public\n})();\nCounter.increment(); Counter.increment();\nCounter.getCount(); // 2",
    interviewQuestion: "What is the revealing module pattern?",
  },
  {
    id: "javascript-observer-pattern",
    category: "javascript",
    topic: "Design Patterns",
    title: "Observer pattern",
    difficulty: "Advanced",
    summary: "Pub/Sub — decouple emitters from listeners",
    explanation:
      "Maintains a map of event→listeners. emit iterates and calls each. on/off add/remove. Node.js, React Native DeviceEventEmitter, and browser EventTarget all use this pattern.",
    code: "class EventEmitter {\n  #events = new Map();\n  on(event, fn) {\n    (this.#events.get(event) ?? this.#events.set(event, []).get(event)).push(fn);\n    return () => this.off(event, fn);\n  }\n  off(event, fn) { this.#events.set(event, (this.#events.get(event) ?? []).filter(f => f !== fn)); }\n  emit(event, ...args) { (this.#events.get(event) ?? []).forEach(fn => fn(...args)); }\n}",
    interviewQuestion: "How does EventEmitter implement Observer?",
  },
  {
    id: "javascript-factory-pattern",
    category: "javascript",
    topic: "Design Patterns",
    title: "Factory pattern",
    difficulty: "Intermediate",
    summary: "Create objects without specifying exact class",
    explanation:
      "When creation logic is complex, when subclass to create depends on input, or when you want to hide implementation details.",
    code: "function createUser(role) {\n  const base = { id: crypto.randomUUID(), role };\n  switch (role) {\n    case 'admin': return { ...base, permissions: ['read','write','delete'], level: 'high' };\n    case 'editor': return { ...base, permissions: ['read','write'], level: 'mid' };\n    default: return { ...base, permissions: ['read'], level: 'low' };\n  }\n}",
    interviewQuestion: "When to use Factory over constructor?",
  },
  {
    id: "javascript-singleton-pattern",
    category: "javascript",
    topic: "Design Patterns",
    title: "Singleton pattern",
    difficulty: "Intermediate",
    summary: "One instance per application",
    explanation:
      "Often yes — creates hidden global state, makes testing hard (shared state between tests). Acceptable for: logger, DB connection pool, config object. Use dependency injection instead where possible.",
    code: "class Database {\n  static #instance = null;\n  #connection;\n  static getInstance() {\n    Database.#instance ??= new Database();\n    return Database.#instance;\n  }\n  connect(url) { this.#connection = createConnection(url); }\n}\n// Always same instance\nDatabase.getInstance() === Database.getInstance(); // true",
    interviewQuestion: "Is Singleton an antipattern?",
  },
  {
    id: "javascript-strategy-pattern",
    category: "javascript",
    topic: "Design Patterns",
    title: "Strategy pattern",
    difficulty: "Advanced",
    summary: "Select algorithm at runtime",
    explanation:
      "Sorting strategies, payment processors, authentication methods, validation rules.",
    code: "const validators = {\n  email: v => /^[^@]+@[^@]+$/.test(v),\n  phone: v => /^\\d{10}$/.test(v),\n  username: v => v.length >= 3 && /^[a-z0-9_]+$/i.test(v),\n};\nfunction validate(value, strategy) {\n  const fn = validators[strategy];\n  if (!fn) throw new Error(`Unknown strategy: ${strategy}`);\n  return fn(value);\n}\nvalidate('test@mail.com', 'email'); // true",
    interviewQuestion: "Real-world JS example of Strategy?",
  },
  {
    id: "javascript-pure-functions-immutability",
    category: "javascript",
    topic: "Functional",
    title: "Pure functions & immutability",
    difficulty: "Intermediate",
    summary: "No side effects, same input → same output",
    explanation:
      "Predictability, easier debugging, enables time-travel debugging, React/Redux state comparison (===) works correctly, prevents shared mutable state bugs.",
    code: "// Mutable -- bad\nconst addItem = (arr, item) => { arr.push(item); return arr; };\n// Immutable -- good\nconst addItem = (arr, item) => [...arr, item];\nconst updateUser = (user, changes) => ({ ...user, ...changes });\nconst removeById = (arr, id) => arr.filter(x => x.id !== id);",
    interviewQuestion: "Why prefer immutability in JS?",
  },
  {
    id: "javascript-composition-pipe",
    category: "javascript",
    topic: "Functional",
    title: "Composition & pipe",
    difficulty: "Advanced",
    summary: "Combine functions: output of one feeds next",
    explanation:
      "compose: right-to-left (mathematical). pipe: left-to-right (more readable for data transformation pipelines).",
    code: "const pipe = (...fns) => x => fns.reduce((v, f) => f(v), x);\nconst compose = (...fns) => x => fns.reduceRight((v, f) => f(v), x);\n\nconst processUser = pipe(\n  user => ({ ...user, name: user.name.trim() }),\n  user => ({ ...user, email: user.email.toLowerCase() }),\n  user => ({ ...user, slug: user.name.replace(/\\s+/g, '-') }),\n);\nprocessUser({ name: ' Alice ', email: 'ALICE@MAIL.COM' });",
    interviewQuestion: "What is the difference between compose and pipe?",
  },
  {
    id: "javascript-web-workers",
    category: "javascript",
    topic: "Browser APIs",
    title: "Web Workers",
    difficulty: "Advanced",
    summary: "Run JS in background thread — no DOM access",
    explanation:
      "Functions, DOM nodes, class instances with methods. Transferable objects (ArrayBuffer, OffscreenCanvas) are transferred (moved, not copied) — the original is neutered.",
    code: "// worker.js\nself.onmessage = ({ data }) => {\n  const result = expensiveCalculation(data);\n  self.postMessage(result);\n};\n// main.js\nconst worker = new Worker('worker.js');\nworker.postMessage(largeArray);\nworker.onmessage = ({ data }) => setResults(data);\nworker.terminate(); // clean up",
    interviewQuestion: "What data can you NOT pass to a Web Worker?",
  },
  {
    id: "javascript-websockets",
    category: "javascript",
    topic: "Browser APIs",
    title: "WebSockets",
    difficulty: "Intermediate",
    summary: "Full-duplex real-time communication",
    explanation:
      "WebSocket: bidirectional, binary + text, must manage reconnection. SSE: unidirectional (server→client only), text only, auto-reconnects, simpler. Use SSE for live feeds; WebSocket for chat/games.",
    code: "const ws = new WebSocket('wss://api.devquiz.app/ws');\nws.onopen    = () => ws.send(JSON.stringify({ type: 'subscribe', channel: 'quiz' }));\nws.onmessage = ({ data }) => dispatch(handleMessage(JSON.parse(data)));\nws.onerror   = (err) => console.error('WS error', err);\nws.onclose   = () => setTimeout(reconnect, 1000); // auto-reconnect",
    interviewQuestion:
      "What is the difference between WebSocket and Server-Sent Events?",
  },
  {
    id: "javascript-service-workers",
    category: "javascript",
    topic: "Browser APIs",
    title: "Service Workers",
    difficulty: "Advanced",
    summary: "Proxy between browser and network — enables PWA",
    explanation:
      "Install → Activate → Fetch intercept. New SW waits in 'waiting' state while old SW controls open pages. skipWaiting() + clients.claim() force immediate takeover.",
    code: "// sw.js\nconst CACHE = 'v1';\nself.addEventListener('install', e => {\n  e.waitUntil(caches.open(CACHE).then(c => c.addAll(['/','index.html','app.js'])));\n});\nself.addEventListener('fetch', e => {\n  e.respondWith(\n    caches.match(e.request).then(cached => cached ?? fetch(e.request))\n  );\n});",
    interviewQuestion: "What is the lifecycle of a Service Worker?",
  },
  {
    id: "javascript-js-performance",
    category: "javascript",
    topic: "Performance",
    title: "JS Performance",
    difficulty: "Advanced",
    summary: "Profiling, memory, rendering optimization",
    explanation:
      "Detached DOM nodes held in closures, forgotten event listeners, setInterval not cleared, cache with no eviction, WeakRef alternatives not used.",
    code: "// Profile with Performance API\nperformance.mark('start');\nheavyOperation();\nperformance.mark('end');\nperformance.measure('heavy', 'start', 'end');\nconsole.log(performance.getEntriesByName('heavy')[0].duration);\n// Avoid: memory leak from detached node\nlet el = document.getElementById('btn');\nconst handler = () => {};\nel.addEventListener('click', handler);\n// FIX: remove listener before removing element\nel.removeEventListener('click', handler);",
    interviewQuestion: "What causes memory leaks in browser JS?",
  },
  {
    id: "javascript-xss-injection",
    category: "javascript",
    topic: "Security",
    title: "XSS & Injection",
    difficulty: "Tricky",
    summary: "Cross-site scripting and injection attacks",
    explanation:
      "Never use innerHTML/dangerouslySetInnerHTML with user input. Use textContent for plain text. Sanitize with DOMPurify if HTML is needed. Set CSP headers.",
    code: "// VULNERABLE\nelement.innerHTML = userInput;\n// SAFE\nelement.textContent = userInput;\n// If HTML is required (rich text)\nimport DOMPurify from 'dompurify';\nelement.innerHTML = DOMPurify.sanitize(userInput, {\n  ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a'],\n  ALLOWED_ATTR: ['href'],\n});",
    interviewQuestion: "How do you prevent XSS in vanilla JS?",
  },
  {
    id: "javascript-cors",
    category: "javascript",
    topic: "Security",
    title: "CORS",
    difficulty: "Intermediate",
    summary: "Cross-Origin Resource Sharing — browser security policy",
    explanation:
      "No. CORS is a browser-enforced policy — browsers respect it, servers don't. A Node.js script or curl ignores CORS headers and can call your API freely. Real protection: auth tokens, rate limiting.",
    code: "// Server (Express)\napp.use(cors({\n  origin: ['https://devquiz.app', 'http://localhost:5173'],\n  credentials: true, // allow cookies\n  methods: ['GET','POST','PUT','DELETE'],\n  allowedHeaders: ['Content-Type', 'Authorization'],\n}));\n// Preflight (OPTIONS) is handled automatically by cors()",
    interviewQuestion:
      "Does CORS protect your API from server-to-server requests?",
  },
  {
    id: "javascript-promise-combinators",
    category: "javascript",
    topic: "Async",
    title: "Promise combinators",
    difficulty: "Advanced",
    summary: "all, allSettled, any, race",
    explanation:
      "race: resolves/rejects with first settled (either fulfilled or rejected). any: resolves with first FULFILLED, ignores rejections, only rejects if ALL reject.",
    code: "// Race: first settled wins (including errors)\nconst result = await Promise.race([fetch(primary), timeout(5000)]);\n\n// Any: first success wins, ignores failures\nconst fastest = await Promise.any([fetchFromCDN1(url), fetchFromCDN2(url)]);\n\n// All: all must succeed\nconst [user, posts] = await Promise.all([fetchUser(id), fetchPosts(id)]);\n\n// AllSettled: wait for all, get status of each\nconst results = await Promise.allSettled([p1, p2, p3]);",
    interviewQuestion: "When do you use Promise.any vs Promise.race?",
  },
  {
    id: "javascript-event-loop-microtasks",
    category: "javascript",
    difficulty: "Advanced",
    topic: "Event Loop & Concurrency",
    title:
      "How does the JavaScript event loop handle microtasks and macrotasks?",
    summary:
      "The event loop coordinates the call stack, microtask queue (Promises, queueMicrotask) and macrotask queue (setTimeout, I/O), always draining all microtasks before the next macrotask.",
    explanation:
      "JavaScript is single-threaded, so the event loop manages how asynchronous callbacks get scheduled onto the call stack. After each synchronous execution block (a macrotask) finishes, the engine fully drains the microtask queue — Promise callbacks, queueMicrotask, MutationObserver callbacks — before rendering or picking up the next macrotask like a setTimeout callback or I/O event. This means microtasks can starve rendering or delay timers if they keep scheduling more microtasks. Understanding this ordering is essential for reasoning about why a Promise.then() runs before a setTimeout(fn, 0), even though both are 'async'. Node.js adds its own phases (timers, I/O callbacks, check, close callbacks) around this same microtask-draining principle.",
    code: "console.log('start');\n\nsetTimeout(() => console.log('timeout'), 0);\n\nPromise.resolve()\n  .then(() => console.log('promise 1'))\n  .then(() => console.log('promise 2'));\n\nqueueMicrotask(() => console.log('microtask'));\n\nconsole.log('end');\n\n// Output:\n// start\n// end\n// promise 1\n// microtask\n// promise 2\n// timeout",
    interviewQuestion:
      "Given a mix of setTimeout, Promise.then, and queueMicrotask calls, predict the exact console output order and explain why.",
  },
  {
    id: "javascript-closures-deep-dive",
    category: "javascript",
    difficulty: "Intermediate",
    topic: "Closures & Scope",
    title: "What is a closure and how does it retain variable state?",
    summary:
      "A closure is a function bundled with references to its surrounding lexical scope, letting it access and mutate variables from an outer function even after that function has returned.",
    explanation:
      "Closures work because JavaScript functions keep a live reference to their enclosing scope's variable environment rather than a snapshot copy. This lets an inner function read and update variables declared in an outer function long after that outer function has finished executing. Closures are the mechanism behind private state, factory functions, and memoization. A classic pitfall is capturing a loop variable declared with var, since var is function-scoped and shared across iterations, whereas let creates a fresh binding per iteration. Closures also have memory implications: any variable referenced by a retained closure cannot be garbage collected until the closure itself is no longer reachable.",
    code: "function makeCounter() {\n  let count = 0;\n  return {\n    increment: () => ++count,\n    reset: () => { count = 0; },\n  };\n}\n\nconst counter = makeCounter();\ncounter.increment();\ncounter.increment();\nconsole.log(counter.increment()); // 3\ncounter.reset();\nconsole.log(counter.increment()); // 1",
    interviewQuestion:
      "Why does using `var` instead of `let` in a for-loop with setTimeout callbacks cause every callback to log the same final value?",
  },
  {
    id: "javascript-hoisting",
    category: "javascript",
    difficulty: "Basic",
    topic: "Closures & Scope",
    title: "What is hoisting in JavaScript?",
    summary:
      "Hoisting is the engine's behavior of registering variable and function declarations in memory during the compile phase, before code executes line by line.",
    explanation:
      "During compilation, function declarations are hoisted entirely — both name and body — so they can be called before their textual definition. `var` declarations are hoisted and initialized to undefined, so referencing them early gives undefined rather than an error. `let` and `const` are also hoisted but remain in the 'temporal dead zone' until their declaration line executes, so accessing them earlier throws a ReferenceError. Function expressions and arrow functions assigned to `let`/`const`/`var` follow the hoisting rules of the variable, not the function, meaning they cannot be called before the assignment line runs.",
    code: "console.log(a); // undefined (var hoisted)\nvar a = 5;\n\ntry {\n  console.log(b); // ReferenceError (TDZ)\n} catch (e) {\n  console.log(e.message);\n}\nlet b = 10;\n\ngreet(); // works, function declarations fully hoisted\nfunction greet() {\n  console.log('hello');\n}",
    interviewQuestion:
      "What is the difference in hoisting behavior between `var`, `let`, and a function declaration?",
  },
  {
    id: "javascript-prototypal-inheritance",
    category: "javascript",
    difficulty: "Intermediate",
    topic: "Objects & Prototypes",
    title: "How does prototypal inheritance work in JavaScript?",
    summary:
      "Every object has an internal link to a prototype object, and property lookups walk up this prototype chain until a match is found or the chain ends at null.",
    explanation:
      "Unlike classical inheritance, JavaScript objects inherit directly from other objects via the internal [[Prototype]] link, accessible through Object.getPrototypeOf() or the deprecated __proto__ accessor. When you access a property, the engine first checks the object's own properties, then walks up the prototype chain. Functions have a `prototype` property used as the [[Prototype]] for instances created with `new`. ES6 classes are syntactic sugar over this same mechanism — `class` and `extends` still produce prototype chains under the hood. Object.create(proto) lets you build a prototype chain explicitly without invoking a constructor.",
    code: "const animal = {\n  speak() {\n    return `${this.name} makes a sound.`;\n  },\n};\n\nconst dog = Object.create(animal);\ndog.name = 'Rex';\nconsole.log(dog.speak()); // Rex makes a sound.\nconsole.log(Object.getPrototypeOf(dog) === animal); // true\nconsole.log(dog.hasOwnProperty('speak')); // false",
    interviewQuestion:
      "Explain how `Object.create()` differs from using a constructor function with `new` to set up inheritance.",
  },
  {
    id: "javascript-this-binding-rules",
    category: "javascript",
    difficulty: "Intermediate",
    topic: "Functions & Execution Context",
    title: "What determines the value of `this` in JavaScript?",
    summary:
      "`this` is determined by how a function is called (its call-site), not where it is defined, following a precedence order of new, explicit binding, implicit (object method) binding, and default binding.",
    explanation:
      "There are four main binding rules, in order of precedence: new binding (this is the newly created object), explicit binding via call/apply/bind, implicit binding where this refers to the object a method was called on, and default binding where this is undefined in strict mode or the global object otherwise. Arrow functions ignore all of these rules and instead lexically inherit `this` from their enclosing scope at definition time, which is why they're commonly used for callbacks inside class methods or event handlers. A frequent bug is detaching a method from its object (e.g., passing `obj.method` as a callback), which loses the implicit binding and causes `this` to become undefined or the global object.",
    code: "const obj = {\n  name: 'Widget',\n  regularFn() { return this.name; },\n  arrowFn: () => { return this?.name; },\n};\n\nconsole.log(obj.regularFn()); // 'Widget'\nconsole.log(obj.arrowFn()); // undefined (lexical this, not obj)\n\nconst detached = obj.regularFn;\nconsole.log(detached()); // undefined/TypeError in strict mode\n\nconsole.log(obj.regularFn.call({ name: 'Rebound' })); // 'Rebound'",
    interviewQuestion:
      "Why does extracting a method from an object and calling it standalone often break, and how do bind, call, apply, or arrow functions fix it?",
  },
  {
    id: "javascript-generators-iterators",
    category: "javascript",
    difficulty: "Advanced",
    topic: "Generators & Iterators",
    title: "How do generator functions and iterators work?",
    summary:
      "A generator function (function*) returns an iterator object that can pause and resume execution using `yield`, producing values lazily on demand.",
    explanation:
      "Calling a generator function doesn't run its body immediately; it returns an iterator whose next() method resumes execution until the next yield, returning an object of the form {value, done}. This lazy, pausable execution model is useful for representing infinite sequences, custom iteration protocols, and cooperative coroutine-like patterns. Any object implementing the iterable protocol via Symbol.iterator can be consumed by for...of, spread syntax, or destructuring. Generators also accept values passed back in via next(value), and yield* delegates iteration to another iterable, making it possible to compose generators.",
    code: "function* idGenerator() {\n  let id = 1;\n  while (true) {\n    const reset = yield id;\n    id = reset ? 1 : id + 1;\n  }\n}\n\nconst gen = idGenerator();\nconsole.log(gen.next().value); // 1\nconsole.log(gen.next().value); // 2\nconsole.log(gen.next(true).value); // 1 (reset)\n\nfunction* range(start, end) {\n  for (let i = start; i <= end; i++) yield i;\n}\nconsole.log([...range(1, 4)]); // [1, 2, 3, 4]",
    interviewQuestion:
      "How would you implement a custom iterable object (with Symbol.iterator) so it works with for...of and the spread operator?",
  },
  {
    id: "javascript-async-await-error-handling",
    category: "javascript",
    difficulty: "Intermediate",
    topic: "Async & Promises",
    title:
      "What are the correct patterns for handling errors in async/await code?",
    summary:
      "Async functions implicitly return rejected promises when they throw, so errors should be caught with try/catch around awaits, or by attaching .catch() to the returned promise, avoiding silent unhandled rejections.",
    explanation:
      "Because `await` unwraps a promise and re-throws its rejection as a synchronous-looking exception, wrapping awaited calls in try/catch gives the most readable error handling. A common mistake is awaiting inside a loop without individual try/catch blocks, causing one failure to abort the whole loop; Promise.allSettled or per-iteration try/catch avoids that. Another pitfall is forgetting that an async function always returns a promise, so a caller must still await or .catch() it — an uncaught rejection from a fire-and-forget async call becomes an unhandled promise rejection. Wrapping multiple independent awaited calls in Promise.all is preferable to sequential awaits when they don't depend on each other, both for performance and to centralize error handling.",
    code: "async function fetchUser(id) {\n  try {\n    const res = await fetch(`/api/users/${id}`);\n    if (!res.ok) throw new Error(`HTTP ${res.status}`);\n    return await res.json();\n  } catch (err) {\n    console.error('Failed to fetch user:', err.message);\n    throw err; // rethrow so caller can also react\n  }\n}\n\nasync function loadUsers(ids) {\n  const results = await Promise.allSettled(ids.map(fetchUser));\n  return results.filter(r => r.status === 'fulfilled').map(r => r.value);\n}",
    interviewQuestion:
      "What happens to errors thrown inside an async function if the caller never awaits or catches the returned promise?",
  },
  {
    id: "javascript-tagged-template-literals",
    category: "javascript",
    difficulty: "Advanced",
    topic: "ES2015+ Syntax",
    title: "What are tagged template literals used for?",
    summary:
      "Tagged templates let a function intercept a template literal's string parts and interpolated values separately, enabling custom processing like sanitization, i18n, or building query builders.",
    explanation:
      "When a function name precedes a template literal, JavaScript calls that function with an array of the literal's static string segments (with a `.raw` property for unescaped text) as the first argument, followed by each interpolated expression's evaluated value as subsequent arguments. This is the mechanism behind libraries like styled-components for CSS-in-JS and Apollo's gql for GraphQL query parsing. It's also useful for writing an auto-escaping HTML template function to prevent XSS, since the tag function fully controls how interpolated values get inserted into the final string.",
    code: "function safeHTML(strings, ...values) {\n  return strings.reduce((out, str, i) => {\n    const val = values[i - 1];\n    const escaped = String(val).replace(/</g, '&lt;').replace(/>/g, '&gt;');\n    return out + escaped + str;\n  });\n}\n\nconst userInput = '<script>alert(1)</script>';\nconst html = safeHTML`<p>Hello, ${userInput}!</p>`;\nconsole.log(html);\n// <p>Hello, &lt;script&gt;alert(1)&lt;/script&gt;!</p>",
    interviewQuestion:
      "How would you write a tag function that automatically HTML-escapes interpolated values in a template literal to prevent XSS?",
  },
  {
    id: "javascript-proxy-reflect",
    category: "javascript",
    difficulty: "Advanced",
    topic: "Meta-programming",
    title: "What do Proxy and Reflect enable in JavaScript?",
    summary:
      "Proxy wraps an object to intercept fundamental operations like get, set, and delete through configurable traps, while Reflect provides matching default implementations of those same operations.",
    explanation:
      "A Proxy takes a target object and a handler with trap methods (get, set, has, deleteProperty, apply, construct, etc.) that run whenever that operation occurs on the proxy. This enables patterns like validation on property assignment, reactive systems (Vue 3's reactivity is built on Proxy), virtual properties, and access logging. Reflect mirrors the same set of low-level operations as static methods, and is typically used inside a proxy trap to invoke the default behavior after custom logic runs, ensuring correct `this` binding and avoiding subtle bugs versus calling target[prop] directly. Together they replace older, less reliable techniques like Object.defineProperty for whole-object interception.",
    code: "function createValidatedUser(initial) {\n  return new Proxy(initial, {\n    set(target, prop, value) {\n      if (prop === 'age' && (typeof value !== 'number' || value < 0)) {\n        throw new TypeError('age must be a non-negative number');\n      }\n      return Reflect.set(target, prop, value);\n    },\n    get(target, prop) {\n      console.log(`Accessing '${prop}'`);\n      return Reflect.get(target, prop);\n    },\n  });\n}\n\nconst user = createValidatedUser({ name: 'Ana', age: 30 });\nconsole.log(user.name); // logs access, then 'Ana'\nuser.age = -5; // throws TypeError",
    interviewQuestion:
      "How would you use a Proxy to implement a reactive object that logs every property read and write?",
  },
  {
    id: "javascript-structured-clone",
    category: "javascript",
    difficulty: "Basic",
    topic: "Objects & Data Structures",
    title:
      "What is structuredClone() and how does it differ from JSON-based deep copying?",
    summary:
      "structuredClone() is a built-in global function that performs a true deep copy of an object, supporting more data types than JSON.parse(JSON.stringify()) and correctly handling circular references.",
    explanation:
      "The structured clone algorithm, exposed via the global structuredClone() function, can deep-copy Maps, Sets, Dates, RegExps, typed arrays, ArrayBuffers, and even objects with circular references — all things that break or silently lose data with the classic JSON.stringify/parse trick. It cannot clone functions, DOM nodes, or object prototypes (the clone becomes a plain object losing its class methods), and it will throw on those unsupported types rather than silently dropping them. It's the same algorithm browsers use internally for postMessage and IndexedDB, so it's well-optimized and standardized across environments including modern Node.js.",
    code: "const original = {\n  date: new Date(),\n  set: new Set([1, 2, 3]),\n  nested: { a: 1 },\n};\noriginal.self = original; // circular reference\n\nconst clone = structuredClone(original);\nconsole.log(clone.date instanceof Date); // true\nconsole.log(clone.set instanceof Set); // true\nconsole.log(clone.self === clone); // true, circular ref preserved\nconsole.log(clone !== original); // true, deep copy",
    interviewQuestion:
      "Why would JSON.parse(JSON.stringify(obj)) fail to correctly clone an object containing a Date, a Map, and a circular reference, and what would you use instead?",
  },
  {
    id: "javascript-abortcontroller",
    category: "javascript",
    difficulty: "Intermediate",
    topic: "Async & Promises",
    title: "How do you cancel an in-flight fetch request with AbortController?",
    summary:
      "AbortController exposes a signal that can be passed to cancelable async APIs like fetch, letting you abort the operation and have it reject with an AbortError.",
    explanation:
      "AbortController.signal is an AbortSignal object that starts in a non-aborted state; calling controller.abort() flips it and fires an 'abort' event that any listener (including fetch internally) can react to. This is the standard way to cancel network requests, for example when a user navigates away or types a new search query before the previous request resolves, preventing race conditions between stale and fresh responses. AbortSignal.timeout(ms) is a convenient static method for auto-aborting after a duration, and signals can be composed so a single abort cancels multiple dependent operations.",
    code: "function searchWithCancel(query) {\n  const controller = new AbortController();\n  const promise = fetch(`/api/search?q=${query}`, { signal: controller.signal })\n    .then(res => res.json())\n    .catch(err => {\n      if (err.name === 'AbortError') console.log('Request cancelled');\n      else throw err;\n    });\n  return { promise, cancel: () => controller.abort() };\n}\n\nconst { promise, cancel } = searchWithCancel('react');\ncancel(); // aborts before the fetch resolves",
    interviewQuestion:
      "How would you cancel a previous in-flight fetch when a user types a new character in a search box, to avoid race conditions between stale and fresh responses?",
  },
  {
    id: "javascript-intl-api",
    category: "javascript",
    difficulty: "Basic",
    topic: "Internationalization",
    title:
      "What does the Intl API provide for formatting numbers, dates, and text?",
    summary:
      "The Intl namespace offers locale-aware constructors like Intl.NumberFormat, Intl.DateTimeFormat, and Intl.RelativeTimeFormat for formatting values correctly across languages and regions without external libraries.",
    explanation:
      "Intl.NumberFormat handles currency, percentage, and unit formatting with correct locale-specific separators and symbols, avoiding manual string manipulation that often breaks for non-US locales. Intl.DateTimeFormat formats dates and times according to locale conventions, and Intl.RelativeTimeFormat produces human-friendly strings like '3 days ago'. Intl.Collator provides locale-aware string comparison for correct sorting of accented or non-Latin text, which the default sort() comparator gets wrong. Because these are built into the engine, they're both more correct and far more performant than hand-rolled or third-party formatting for internationalized UIs.",
    code: "const price = new Intl.NumberFormat('de-DE', {\n  style: 'currency',\n  currency: 'EUR',\n}).format(1234.5);\nconsole.log(price); // '1.234,50 €'\n\nconst date = new Intl.DateTimeFormat('en-US', {\n  dateStyle: 'long',\n}).format(new Date('2026-07-01'));\nconsole.log(date); // 'July 1, 2026'\n\nconst rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });\nconsole.log(rtf.format(-1, 'day')); // 'yesterday'",
    interviewQuestion:
      "How would you format a price as currency correctly for multiple locales without manually handling separators and symbols?",
  },
  {
    id: "javascript-bigint",
    category: "javascript",
    difficulty: "Basic",
    topic: "Numbers & Data Types",
    title: "What is BigInt and when is it needed?",
    summary:
      "BigInt is a primitive type for representing integers beyond Number.MAX_SAFE_INTEGER with exact precision, created with an `n` suffix or the BigInt() function.",
    explanation:
      "Regular JavaScript numbers are IEEE-754 doubles, which lose precision for integers larger than 2^53 - 1 (Number.MAX_SAFE_INTEGER). BigInt stores arbitrary-precision integers exactly, which matters for use cases like cryptography, high-precision timestamps, or working with 64-bit IDs from databases. BigInt values cannot be mixed with regular numbers in arithmetic operations without explicit conversion — attempting `1n + 1` throws a TypeError — and BigInt doesn't support decimals or Math object methods. Comparison operators like < and > work across BigInt and Number, but strict equality (===) treats them as different types even for equal values.",
    code: "const big = 9007199254740993n; // beyond MAX_SAFE_INTEGER\nconsole.log(big + 1n); // 9007199254740994n\n\nconsole.log(Number.MAX_SAFE_INTEGER); // 9007199254740991\nconsole.log(9007199254740992 === 9007199254740993); // true! precision lost\n\ntry {\n  console.log(1n + 1); // TypeError: Cannot mix BigInt and other types\n} catch (e) {\n  console.log(e.message);\n}\nconsole.log(1n == 1); // true (loose equality allowed)",
    interviewQuestion:
      "Why does `9007199254740992 === 9007199254740993` evaluate to true, and how does BigInt solve that problem?",
  },
  {
    id: "javascript-weakref-finalizationregistry",
    category: "javascript",
    difficulty: "Tricky",
    topic: "Memory & Garbage Collection",
    title:
      "What do WeakRef and FinalizationRegistry do, and why are they rarely needed?",
    summary:
      "WeakRef holds a reference to an object without preventing garbage collection, and FinalizationRegistry lets you register a cleanup callback that may run after an object is collected — both are advanced, non-deterministic tools meant for niche caching scenarios.",
    explanation:
      "A WeakRef wraps an object so that holding the WeakRef doesn't stop the garbage collector from reclaiming the target; calling .deref() returns the object if it's still alive, or undefined if it's been collected. FinalizationRegistry lets you register a callback to run at some unspecified future point after an object becomes unreachable, but the spec explicitly does not guarantee if or when it runs, making it unsuitable for critical cleanup logic like closing file handles. These APIs exist mainly for advanced caching or memory-management libraries; using them for typical application logic is almost always the wrong tool, since GC timing is intentionally left implementation-defined and non-deterministic across engines.",
    code: "let obj = { data: 'large payload' };\nconst ref = new WeakRef(obj);\n\nconst registry = new FinalizationRegistry((heldValue) => {\n  console.log(`Cleaned up: ${heldValue}`);\n});\nregistry.register(obj, 'obj-1');\n\nconsole.log(ref.deref()?.data); // 'large payload' (still alive)\nobj = null; // remove strong reference\n// At some later, unspecified point, GC may collect obj and\n// the registry callback may fire — timing is not guaranteed.",
    interviewQuestion:
      "Why shouldn't FinalizationRegistry be relied upon for deterministic resource cleanup like closing a database connection?",
  },
  {
    id: "javascript-commonjs-vs-esm",
    category: "javascript",
    difficulty: "Intermediate",
    topic: "Modules",
    title: "What are the key differences between CommonJS and ES Modules?",
    summary:
      "CommonJS (require/module.exports) loads modules synchronously with mutable, copied exports, while ES Modules (import/export) are statically analyzed, load asynchronously, and export live read-only bindings.",
    explanation:
      "CommonJS, Node's original module system, resolves require() calls synchronously at runtime and caches the fully-executed module.exports object; you receive a live reference to that object but reassigning a destructured value doesn't reflect changes back into the source module. ES Modules are parsed statically before execution, which enables tree-shaking and top-level await, and their imported bindings are live read-only views tied directly to the exporting module's variables — if the source module updates an exported variable, importers see the new value automatically. Node.js supports both, distinguished by file extension (.cjs vs .mjs) or the 'type' field in package.json, and interop between them has edge cases, particularly around default exports.",
    code: "// CommonJS (math.cjs)\nlet counter = 0;\nfunction increment() { counter++; }\nmodule.exports = { counter, increment }; // counter is copied, frozen at export time\n\n// ES Module (math.mjs)\nexport let counter = 0;\nexport function increment() { counter++; } // live binding\n\n// consumer.mjs\nimport { counter, increment } from './math.mjs';\nincrement();\nconsole.log(counter); // 1 — reflects the live update, unlike CommonJS",
    interviewQuestion:
      "Why does a value imported from a CommonJS module not update when the source module changes it later, while an ES Module import does?",
  },
  {
    id: "javascript-tree-shaking",
    category: "javascript",
    difficulty: "Advanced",
    topic: "Modules",
    title: "What is tree shaking and what makes code tree-shakeable?",
    summary:
      "Tree shaking is a bundler optimization that removes unused exports from the final bundle by statically analyzing ES Module import/export graphs, relying on the static, side-effect-predictable nature of ESM syntax.",
    explanation:
      "Because ES Module imports and exports are declared statically (not conditionally computed at runtime like CommonJS require calls), bundlers such as Rollup or webpack can build a precise dependency graph and eliminate code that's never imported anywhere. Tree shaking breaks down when modules have side effects at the top level (like mutating a global or registering something), since the bundler can't safely assume removal is safe unless the package.json marks itself \"sideEffects\": false or lists exceptions. Writing modules as small, pure, named exports rather than one large default export object, and avoiding re-export barrels that import everything, maximizes what a bundler can actually shake out.",
    code: "// utils.js — tree-shakeable named exports\nexport function add(a, b) { return a + b; }\nexport function subtract(a, b) { return a - b; }\nexport function multiply(a, b) { return a * b; } // never imported anywhere\n\n// app.js\nimport { add } from './utils.js';\nconsole.log(add(2, 3));\n// A bundler analyzing this graph can safely drop `subtract`\n// and `multiply` from the final bundle since they're unused.",
    interviewQuestion:
      "Why can bundlers tree-shake unused ES Module exports but generally cannot tree-shake unused CommonJS exports?",
  },
  {
    id: "javascript-typeof-vs-instanceof",
    category: "javascript",
    difficulty: "Basic",
    topic: "Types & Type Checking",
    title: "What is the difference between typeof and instanceof?",
    summary:
      "typeof returns a string naming a value's primitive type and works before checking for undeclared variables, while instanceof tests whether an object's prototype chain includes a given constructor's prototype.",
    explanation:
      "typeof is best for distinguishing primitives (string, number, boolean, undefined, symbol, bigint) and detecting functions, but it has well-known quirks: typeof null returns 'object' due to a legacy bug, and typeof for any non-function object (arrays, dates, custom classes) also returns 'object', making it useless for distinguishing them. instanceof walks the right-hand operand's prototype chain looking for the left-hand object's [[Prototype]], so it correctly distinguishes Array from Date from a custom class, but it fails across different realms (e.g., iframes) where each has its own separate constructor identity, and it throws or misbehaves on primitives. For robust type checks on arrays specifically, Array.isArray() is preferred over instanceof Array.",
    code: "console.log(typeof null); // 'object' (historical bug)\nconsole.log(typeof undefined); // 'undefined'\nconsole.log(typeof []); // 'object'\nconsole.log(typeof function(){}); // 'function'\n\nconsole.log([] instanceof Array); // true\nconsole.log([] instanceof Object); // true (Array.prototype chains to Object.prototype)\n\nclass Dog {}\nconsole.log(new Dog() instanceof Dog); // true\nconsole.log(typeof new Dog()); // 'object' (not useful here)",
    interviewQuestion:
      "Why is `typeof null === 'object'`, and how would you reliably check if a value is actually null versus a real object?",
  },
  {
    id: "javascript-shallow-vs-deep-copy",
    category: "javascript",
    difficulty: "Intermediate",
    topic: "Objects & Data Structures",
    title: "What is the difference between a shallow copy and a deep copy?",
    summary:
      "A shallow copy duplicates only the top-level properties of an object, leaving nested objects shared by reference, while a deep copy recursively duplicates every nested level so no references are shared.",
    explanation:
      "Techniques like the spread operator, Object.assign(), and Array.prototype.slice() all produce shallow copies: primitive top-level values are duplicated, but any nested object or array is copied by reference, so mutating a nested property through the copy also mutates the original. Deep copying requires recursively cloning every nested structure, which can be done with structuredClone() for most built-in types, a hand-written recursive function, or a library like lodash's cloneDeep for edge cases involving class instances or circular references. Choosing shallow vs deep copy matters a lot in state-management code (e.g., React/Redux), where accidentally sharing nested references can cause subtle bugs where updating 'a copy' silently mutates shared state elsewhere.",
    code: "const original = { name: 'Config', settings: { theme: 'dark' } };\n\nconst shallow = { ...original };\nshallow.settings.theme = 'light'; // mutates nested object\nconsole.log(original.settings.theme); // 'light' — original affected!\n\nconst original2 = { name: 'Config2', settings: { theme: 'dark' } };\nconst deep = structuredClone(original2);\ndeep.settings.theme = 'light';\nconsole.log(original2.settings.theme); // 'dark' — original untouched",
    interviewQuestion:
      "Why does mutating a nested object inside a spread-copied object (`{ ...original }`) also change the original, and how would you avoid that?",
  },
  {
    id: "javascript-array-like-vs-iterable",
    category: "javascript",
    difficulty: "Tricky",
    topic: "Arrays & Collections",
    title:
      "What is the difference between an array-like object and an iterable?",
    summary:
      "An array-like object has a numeric `length` property and indexed elements but no iteration protocol, while an iterable implements Symbol.iterator, enabling for...of and spread — the two categories overlap but aren't identical.",
    explanation:
      "Array-like objects, such as the `arguments` object or a DOM NodeList in older environments, have integer-indexed properties and a length property but don't natively support for...of, spread, or array methods like map and filter unless converted first. Iterables implement the well-known Symbol.iterator method returning an iterator, which is what for...of, spread syntax, and destructuring rely on — Strings, Maps, Sets, and Arrays are all iterables, while a plain arguments object was historically array-like but not iterable (modern engines have since made arguments iterable too). Array.from() is the standard bridge: it accepts either an array-like or an iterable and produces a true array, which is why it's the go-to conversion utility over the spread operator when you're not sure which kind of collection you're dealing with.",
    code: "function sum() {\n  // arguments is array-like AND iterable in modern engines\n  const args = Array.from(arguments);\n  return args.reduce((a, b) => a + b, 0);\n}\nconsole.log(sum(1, 2, 3)); // 6\n\nconst arrayLike = { 0: 'a', 1: 'b', length: 2 }; // NOT iterable\ntry {\n  [...arrayLike]; // TypeError: arrayLike is not iterable\n} catch (e) {\n  console.log(e.message);\n}\nconsole.log(Array.from(arrayLike)); // ['a', 'b'] — works fine",
    interviewQuestion:
      "Why does spreading a plain array-like object like `{ 0: 'a', 1: 'b', length: 2 }` throw an error, while `Array.from()` on the same object works?",
  },
  {
    id: "javascript-custom-error-classes",
    category: "javascript",
    difficulty: "Intermediate",
    topic: "Error Handling",
    title: "How do you create and use custom error classes in JavaScript?",
    summary:
      "Custom error classes extend the built-in Error class to attach domain-specific properties (like an error code or HTTP status) while preserving stack traces and standard error behavior like instanceof checks.",
    explanation:
      "Extending Error and calling super(message) preserves the native `message`, `stack`, and `name` behavior while letting you add custom fields such as statusCode, cause, or a machine-readable errorCode for programmatic handling. Setting `this.name` to the subclass name fixes generic error output (otherwise it would just print 'Error'). Since ES2022, the built-in Error constructor accepts a second `options` argument with a `cause` property to chain the original error, useful when re-throwing after catching a lower-level failure. Custom error hierarchies let calling code use instanceof to branch on error type (e.g., ValidationError vs NetworkError) instead of parsing message strings, which is fragile and hard to localize.",
    code: "class ValidationError extends Error {\n  constructor(message, field) {\n    super(message);\n    this.name = 'ValidationError';\n    this.field = field;\n  }\n}\n\nfunction validateAge(age) {\n  if (age < 0) {\n    throw new ValidationError('Age cannot be negative', 'age');\n  }\n}\n\ntry {\n  validateAge(-5);\n} catch (err) {\n  if (err instanceof ValidationError) {\n    console.log(`${err.name} on field '${err.field}': ${err.message}`);\n  } else {\n    throw err;\n  }\n}",
    interviewQuestion:
      "How would you design a custom error class hierarchy so calling code can distinguish a validation error from a network error using instanceof?",
  },
  {
    id: "javascript-destructuring-edge-cases",
    category: "javascript",
    difficulty: "Intermediate",
    topic: "Destructuring",
    title: "What are the lesser-known edge cases of destructuring?",
    summary:
      "Destructuring supports default values, renaming, nested patterns, and skipping elements, but has subtle pitfalls around undefined vs missing keys.",
    explanation:
      "Default values in destructuring only apply when the extracted value is strictly undefined, not when it is null or any other falsy value. Nested destructuring throws a TypeError if an intermediate property is null or undefined, since you cannot destructure from it. Array destructuring can skip elements using empty commas, and you can swap variables in one line without a temp variable. Destructuring also works on function parameters directly, letting you pull named arguments out of an options object with defaults. Combining renaming and defaults together requires the syntax { propName: localName = defaultValue }.",
    code: "const { a = 10 } = { a: null };\nconsole.log(a); // null, default NOT applied because value is not undefined\n\nconst { b = 20 } = {};\nconsole.log(b); // 20, default applied because key is missing\n\nconst [, second, , fourth] = [1, 2, 3, 4];\nconsole.log(second, fourth); // 2 4\n\nlet x = 1, y = 2;\n[x, y] = [y, x];\nconsole.log(x, y); // 2 1\n\nfunction greet({ name: userName = 'Guest' } = {}) {\n  console.log('Hello ' + userName);\n}\ngreet(); // Hello Guest",
    interviewQuestion:
      "Why does `const { a = 5 } = { a: null }` result in `a` being null instead of 5, and how would you write a destructuring pattern that treats both null and undefined as missing?",
  },
  {
    id: "javascript-polyfill-array-methods",
    category: "javascript",
    difficulty: "Advanced",
    topic: "Polyfills",
    title:
      "How would you implement your own Array.prototype.map, filter, and reduce?",
    summary:
      "Polyfilling core array methods requires understanding how they iterate, skip holes, and pass the right callback arguments.",
    explanation:
      "A correct polyfill for map must call the callback with (element, index, array), respect sparse array holes by skipping indices that were never assigned, and return a new array of the same length. filter similarly iterates but only pushes elements where the callback returns truthy, and must handle an empty result array. reduce is more complex because it needs to support an optional initial value; if omitted, the first array element becomes the accumulator and iteration starts from index 1, throwing a TypeError on an empty array with no initial value. All three methods should use Object.prototype.hasOwnProperty.call to properly skip holes in sparse arrays rather than treating them as undefined.",
    code: "Array.prototype.myMap = function (callback, thisArg) {\n  const result = [];\n  for (let i = 0; i < this.length; i++) {\n    if (Object.prototype.hasOwnProperty.call(this, i)) {\n      result[i] = callback.call(thisArg, this[i], i, this);\n    }\n  }\n  return result;\n};\n\nArray.prototype.myReduce = function (callback, initialValue) {\n  let acc = initialValue;\n  let startIndex = 0;\n  if (acc === undefined) {\n    if (this.length === 0) throw new TypeError('Reduce of empty array with no initial value');\n    acc = this[0];\n    startIndex = 1;\n  }\n  for (let i = startIndex; i < this.length; i++) {\n    acc = callback(acc, this[i], i, this);\n  }\n  return acc;\n};\n\nconsole.log([1, 2, 3].myMap(n => n * 2)); // [2, 4, 6]\nconsole.log([1, 2, 3].myReduce((a, b) => a + b)); // 6",
    interviewQuestion:
      "Implement Array.prototype.reduce from scratch, making sure it correctly handles the case where no initial value is provided and the array is empty.",
  },
  {
    id: "javascript-execution-context-scope-chain",
    category: "javascript",
    difficulty: "Advanced",
    topic: "Execution Context",
    title:
      "What is an execution context and how does the scope chain resolve variables?",
    summary:
      "An execution context is the environment in which JS code runs, and the scope chain is the ordered list of scopes the engine checks when resolving a variable.",
    explanation:
      "Every time a function is invoked, the engine creates a new execution context consisting of a variable environment, a lexical environment, and a reference to the outer environment (its closure). The scope chain is built at function definition time, not call time, because JavaScript uses lexical (static) scoping. When a variable is referenced, the engine looks it up first in the current execution context, then walks up through each outer lexical environment until it reaches the global scope, throwing a ReferenceError if not found anywhere. The call stack holds these execution contexts in order, with the global execution context at the bottom and the currently executing function context on top. Closures work precisely because a returned inner function retains a reference to its defining scopes lexical environment even after the outer function has returned.",
    code: "function outer() {\n  const outerVar = 'I am outside!';\n  function inner() {\n    const innerVar = 'I am inside!';\n    console.log(innerVar); // resolved in inner's own scope\n    console.log(outerVar); // resolved by walking up the scope chain\n  }\n  return inner;\n}\n\nconst fn = outer();\nfn();\n// Scope chain for inner: inner -> outer -> global\n// Lexical scoping means this chain is fixed by WHERE inner is defined, not where fn() is called",
    interviewQuestion:
      "Explain the difference between the call stack and the scope chain, and describe how JavaScript resolves a free variable inside a deeply nested function.",
  },
  {
    id: "javascript-arguments-vs-rest-params",
    category: "javascript",
    difficulty: "Intermediate",
    topic: "Functions",
    title: "How does the arguments object differ from rest parameters?",
    summary:
      "The arguments object is an array-like, non-arrow-function-only construct, while rest parameters are true arrays available in any function and work with arrow functions.",
    explanation:
      "The arguments object is available in regular functions and contains all passed arguments regardless of the declared parameters, but it is only array-like, meaning it lacks array methods like map or filter unless converted with Array.from or the spread operator. Arrow functions do not have their own arguments object; referencing arguments inside an arrow function looks it up in the enclosing non-arrow function scope. Rest parameters, declared with ...name as the last parameter, collect only the extra arguments not matched by named parameters into a real Array instance, giving direct access to all array methods. Rest parameters are also more explicit and readable, and they exclude arguments already captured by named parameters, unlike the arguments object which always contains everything passed in.",
    code: "function regularFn() {\n  console.log(arguments); // Arguments(3) [1, 2, 3]\n  console.log(Array.isArray(arguments)); // false\n}\nregularFn(1, 2, 3);\n\nfunction withRest(first, ...rest) {\n  console.log(first); // 1\n  console.log(rest); // [2, 3] - a real array\n  console.log(Array.isArray(rest)); // true\n}\nwithRest(1, 2, 3);\n\nconst arrowFn = (...args) => {\n  console.log(args); // works fine, rest params supported\n};\narrowFn(1, 2, 3);",
    interviewQuestion:
      "Why can you not use the arguments object inside an arrow function to get the arguments passed to that arrow function, and what would you use instead?",
  },
  {
    id: "javascript-function-hoisting-vs-var-hoisting",
    category: "javascript",
    difficulty: "Intermediate",
    topic: "Hoisting",
    title: "How does function hoisting differ from var hoisting?",
    summary:
      "Function declarations are hoisted with their full body and are callable before their definition line, while var declarations are hoisted but initialized as undefined.",
    explanation:
      "During the creation phase of an execution context, function declarations are hoisted completely, meaning both the name and the function body are placed in memory, so you can call the function before its textual position in the code. In contrast, var declarations are hoisted but only the declaration itself is moved up, initialized to undefined; the assignment stays in place, so accessing the variable before the assignment line yields undefined rather than a ReferenceError. Function expressions and arrow functions assigned to a var are not hoisted like declarations, because only the var binding is hoisted, not the function value, so calling them early throws a TypeError since the value is undefined. When a var and a function declaration share the same name, the function declaration generally takes precedence during hoisting.",
    code: "console.log(typeof hoistedFn); // 'function'\nhoistedFn(); // works fine\nfunction hoistedFn() {\n  console.log('called');\n}\n\nconsole.log(myVar); // undefined, not ReferenceError\nvar myVar = 5;\n\nconsole.log(typeof funcExpr); // 'undefined'\n// funcExpr(); // TypeError: funcExpr is not a function\nvar funcExpr = function () {\n  console.log('expr called');\n};",
    interviewQuestion:
      "Why does calling a var-assigned function expression before its definition throw a TypeError, while calling a function declaration before its definition works fine?",
  },
  {
    id: "javascript-void-operator",
    category: "javascript",
    difficulty: "Basic",
    topic: "Operators",
    title: "What does the void operator do and when is it used?",
    summary:
      'void evaluates an expression and always returns undefined, historically used in href="javascript:void(0)" links to prevent navigation.',
    explanation:
      'The void operator takes any expression, evaluates it for its side effects, and always discards the result to return the primitive value undefined. Historically it was popular in anchor tags written as href="javascript:void(0)" to make a link clickable without navigating anywhere, since the void(0) expression evaluates to undefined and produces no page navigation. It is also occasionally used to guarantee a genuine undefined value in older code, protecting against the fact that undefined used to be a reassignable global identifier before ES5 made it non-writable in the global scope. In modern module code, void is sometimes used before an IIFE, as in void function(){}(), to signal to the parser that the following function is an expression rather than a declaration, avoiding the need for wrapping parentheses. Its usage today is mostly a stylistic or legacy pattern rather than a necessity.',
    code: "console.log(void 0); // undefined\nconsole.log(void 'hello'); // undefined, expression evaluated then discarded\n\n// Legacy pattern (avoid in modern code, use event.preventDefault() instead):\n// <a href=\"javascript:void(0)\">Click</a>\n\n// IIFE parsing trick:\nvoid function initApp() {\n  console.log('app initialized');\n}();\n\nlet sideEffect = 0;\nvoid (sideEffect = 5); // still runs the assignment, expression result discarded\nconsole.log(sideEffect); // 5",
    interviewQuestion:
      'Why would a developer write `href="javascript:void(0)"` on a link, and what is a more modern alternative to achieve the same effect?',
  },
  {
    id: "javascript-isarray-vs-instanceof-array",
    category: "javascript",
    difficulty: "Intermediate",
    topic: "Type Checking",
    title: "Why is Array.isArray preferred over instanceof Array?",
    summary:
      "Array.isArray correctly identifies arrays across different execution contexts like iframes, while instanceof Array fails because prototype chains differ per realm.",
    explanation:
      "Each JavaScript realm, such as an iframe or a separate vm context in Node, has its own global object and therefore its own distinct Array constructor and Array.prototype. An array created in one iframe will not be an instanceof the Array constructor from another iframe, because instanceof checks whether the prototype in the constructors prototype property appears in the objects prototype chain, and the prototypes are different objects. Array.isArray, however, uses an internal slot check that identifies array exotic objects regardless of which realm created them, making it reliable across frames and contexts. Array.isArray also correctly returns false for array-like objects such as arguments or NodeLists, and true for arrays created via literals, the Array constructor, or Array.from. For this reason, Array.isArray has been the recommended way to check for arrays since ES5.",
    code: "// Simulating cross-realm scenario conceptually:\nconst iframeArray = []; // imagine this came from another iframe's context\n\nconsole.log(Array.isArray(iframeArray)); // true, always reliable\nconsole.log(iframeArray instanceof Array); // true in same realm, but FALSE across realms\n\nfunction checkArgs() {\n  console.log(Array.isArray(arguments)); // false, arguments is array-like, not an array\n}\ncheckArgs(1, 2, 3);\n\nconsole.log(Array.isArray(Array.from({ length: 3 }))); // true",
    interviewQuestion:
      "Why can `instanceof Array` return false for a genuine array passed from another iframe, and how does Array.isArray avoid that problem?",
  },
  {
    id: "javascript-object-entries-keys-values-ordering",
    category: "javascript",
    difficulty: "Advanced",
    topic: "Objects",
    title:
      "What ordering guarantees do Object.keys, values, and entries provide?",
    summary:
      "Own enumerable property enumeration order follows a specific spec-defined rule: integer-like keys first in ascending numeric order, then string keys in insertion order, then symbols.",
    explanation:
      "The ECMAScript specification defines a precise ordinary object property enumeration order used by Object.keys, Object.values, Object.entries, JSON.stringify, and for...in for own properties. First come all keys that look like array indices, meaning non-negative integers when converted to and from a string without change, sorted in ascending numeric order regardless of insertion order. Next come all remaining string keys in the exact order they were inserted into the object. Finally, symbol keys are enumerated in their insertion order, though Object.keys, values, and entries skip symbols entirely since they only return string keys. This means numeric-looking keys can surprisingly appear before earlier-inserted string keys, a common source of bugs when objects are used as ordered maps.",
    code: "const obj = {\n  b: 1,\n  2: 'two',\n  a: 3,\n  1: 'one',\n};\n\nconsole.log(Object.keys(obj));\n// ['1', '2', 'b', 'a'] - integer keys sorted numerically FIRST, then insertion order\n\nconst sym = Symbol('s');\nconst obj2 = { [sym]: 'symbol value', z: 1 };\nconsole.log(Object.keys(obj2)); // ['z'], symbols excluded\nconsole.log(Object.getOwnPropertySymbols(obj2)); // [Symbol(s)]",
    interviewQuestion:
      "Given an object with mixed numeric-string keys and alphabetic keys inserted in a specific order, predict the exact output of Object.keys and explain the spec rule behind it.",
  },
  {
    id: "javascript-for-in-prototype-chain-pitfall",
    category: "javascript",
    difficulty: "Advanced",
    topic: "Iteration",
    title:
      "Why can for...in loops accidentally iterate over inherited enumerable properties?",
    summary:
      "for...in walks the entire prototype chain and includes any enumerable properties found there, unlike for...of which only iterates iterable values.",
    explanation:
      "The for...in statement enumerates all enumerable properties of an object, including those inherited via the prototype chain, not just the objects own properties. This becomes a bug source when a library or older code adds enumerable properties to Object.prototype or Array.prototype, since every plain object or array in the program will then show that property in a for...in loop. The conventional defense is to guard the loop body with an Object.prototype.hasOwnProperty.call check, or to prefer Object.keys combined with forEach, which only returns own enumerable string-keyed properties. for...of, by contrast, works entirely differently: it consumes the objects Symbol.iterator protocol and has nothing to do with enumerability or the prototype chain, which is why arrays, strings, Maps, and Sets work with it but plain objects do not unless explicitly made iterable.",
    code: "Object.prototype.extra = 'polluted'; // bad practice, but illustrates the pitfall\n\nconst obj = { a: 1, b: 2 };\n\nfor (const key in obj) {\n  console.log(key); // 'a', 'b', 'extra' <- inherited property leaks in!\n}\n\nfor (const key in obj) {\n  if (Object.prototype.hasOwnProperty.call(obj, key)) {\n    console.log('own:', key); // 'own: a', 'own: b'\n  }\n}\n\ndelete Object.prototype.extra; // clean up the pollution",
    interviewQuestion:
      "If a third-party script adds an enumerable property to Array.prototype, how would that affect a for...in loop over your own array, and how would you defend against it?",
  },
  {
    id: "javascript-label-statements",
    category: "javascript",
    difficulty: "Basic",
    topic: "Control Flow",
    title:
      "What are labeled statements and how do break and continue use them?",
    summary:
      "Labels let break and continue target a specific outer loop instead of only the innermost one, useful for escaping nested loops in one step.",
    explanation:
      "A label is an identifier followed by a colon placed before a statement, most commonly a loop, which can then be referenced by break label or continue label. Without a label, break and continue only affect the innermost enclosing loop or switch, making it awkward to exit multiple nested loops at once, often requiring a flag variable. With a label, break outerLoop immediately exits the labeled loop entirely, while continue outerLoop skips to the next iteration of that labeled loop rather than the inner one. Labels are rarely used in modern JavaScript because they can hurt readability, and many linters flag them, but they remain valid syntax and occasionally appear in performance-sensitive nested-loop search code. Labels can technically be applied to any statement block, not just loops, though that usage is uncommon.",
    code: "outerLoop: for (let i = 0; i < 3; i++) {\n  for (let j = 0; j < 3; j++) {\n    if (j === 1) continue outerLoop; // skips to next i, not just next j\n    if (i === 2) break outerLoop; // exits BOTH loops entirely\n    console.log(i, j);\n  }\n}\n// Output: 0 0 / 1 0\n\n// Without labels, you'd need a flag:\nlet found = false;\nfor (let i = 0; i < 3 && !found; i++) {\n  for (let j = 0; j < 3; j++) {\n    if (i === 1 && j === 1) { found = true; break; }\n  }\n}",
    interviewQuestion:
      "How would you break out of two nested for loops entirely as soon as a condition is met, using a labeled statement, and why might a code reviewer flag this approach?",
  },
  {
    id: "javascript-comma-operator",
    category: "javascript",
    difficulty: "Basic",
    topic: "Operators",
    title: "What does the comma operator do in JavaScript?",
    summary:
      "The comma operator evaluates each of its operands left to right and returns the value of the last one, commonly seen in for-loop headers.",
    explanation:
      "The comma operator, written as expr1, expr2, evaluates expr1 for its side effects, discards its result, then evaluates expr2 and returns that value as the overall expression result. It is most commonly seen in the update clause of a for loop, where you want to increment or modify multiple variables in a single statement, such as for (let i = 0, j = 10; i < j; i++, j--). It should not be confused with commas used to separate function arguments, array elements, or variable declarations in a single var/let/const statement, which are a different grammatical construct entirely, not the comma operator. Because it can make code harder to read, the comma operator is generally avoided outside of loop headers and certain minified or golfed code.",
    code: "let x = (1, 2, 3);\nconsole.log(x); // 3, only the last value is kept\n\nfor (let i = 0, j = 10; i < 5; i++, j -= 2) {\n  console.log(i, j);\n}\n// 0 10 / 1 8 / 2 6 / 3 4 / 4 2\n\nfunction example() {\n  let a = 1;\n  return (a += 1, a += 2, a); // evaluates left to right, returns final value\n}\nconsole.log(example()); // 4",
    interviewQuestion:
      'What does `let result = (console.log("a"), console.log("b"), 42)` assign to result, and in what order do the side effects run?',
  },
  {
    id: "javascript-with-statement-why-avoided",
    category: "javascript",
    difficulty: "Advanced",
    topic: "Language History",
    title:
      "What does the with statement do and why is it avoided or banned in strict mode?",
    summary:
      "with extends the scope chain with an objects properties, but makes variable resolution ambiguous and unoptimizable, so it is forbidden in strict mode.",
    explanation:
      "The with statement takes an object and temporarily adds it to the front of the scope chain for the duration of its block, so bare identifiers inside are first looked up as properties of that object before falling back to the normal scope chain. This seemed convenient for reducing repetition when accessing many properties of the same object, but it makes static analysis of code effectively impossible, because the engine cannot know at parse time whether an identifier refers to a property on the with object or an outer variable until runtime. This ambiguity defeats compiler optimizations and creates subtle bugs, such as accidentally shadowing a global variable or a typo silently creating or reading the wrong property. Because of these problems, the with statement is entirely disallowed in strict mode and throws a SyntaxError if used, and its use in non-strict code is universally discouraged by style guides and linters. Destructuring assignment is the modern, safe replacement for the convenience with was meant to provide.",
    code: "// Non-strict mode only, this throws a SyntaxError in strict mode:\nconst obj = { x: 1, y: 2 };\n\nwith (obj) {\n  console.log(x, y); // 1 2, resolved as obj.x and obj.y\n}\n\n// The ambiguity problem:\nlet x = 'outer';\nwith (obj) {\n  console.log(x); // 1, obj.x SHADOWS the outer x unexpectedly!\n}\n\n// Modern safe replacement:\nconst { x: objX, y: objY } = obj;\nconsole.log(objX, objY); // explicit, no ambiguity",
    interviewQuestion:
      "Why is the with statement disallowed in strict mode, and what modern JavaScript feature achieves similar convenience without its downsides?",
  },
  {
    id: "javascript-strict-mode-differences",
    category: "javascript",
    difficulty: "Intermediate",
    topic: "Strict Mode",
    title:
      "What behavioral differences does strict mode introduce compared to sloppy mode?",
    summary:
      "Strict mode eliminates silent errors by throwing exceptions for common mistakes, changes this binding, and disables several problematic legacy features.",
    explanation:
      'In strict mode, assigning to an undeclared variable throws a ReferenceError instead of silently creating a global variable, and attempting to write to a read-only or non-configurable property throws a TypeError instead of failing silently. Inside a regular function called without a receiver, this is undefined in strict mode rather than defaulting to the global object, which helps catch bugs where a method is accidentally detached from its object. Strict mode also disallows duplicate parameter names, disallows the with statement entirely, and makes eval create its own scope rather than leaking variables into the enclosing scope. ES6 modules and classes are automatically in strict mode without needing the "use strict" directive, which is why class methods that lose their this binding become undefined rather than the global object. Strict mode is enabled per-script or per-function by placing the "use strict" directive at the top, or automatically within any ES module or class body.',
    code: "'use strict';\n\nfunction leaky() {\n  undeclaredVar = 5; // ReferenceError in strict mode\n}\n// leaky();\n\nfunction showThis() {\n  console.log(this); // undefined in strict mode when called bare\n}\nshowThis();\n\nconst frozen = Object.freeze({ x: 1 });\n// frozen.x = 2; // TypeError in strict mode, silently fails in sloppy mode\n\nclass AlwaysStrict {\n  method() {\n    'use strict'; // redundant, classes are always strict\n  }\n}",
    interviewQuestion:
      "What happens when you assign to an undeclared variable inside a strict-mode function versus a sloppy-mode function, and why does this matter for catching bugs?",
  },
  {
    id: "javascript-nan-comparison-quirks",
    category: "javascript",
    difficulty: "Basic",
    topic: "Numbers",
    title:
      "Why does NaN === NaN evaluate to false, and how do you correctly check for NaN?",
    summary:
      "NaN is the only JavaScript value that is not equal to itself under both == and ===, so Number.isNaN or Object.is must be used to detect it reliably.",
    explanation:
      'NaN, meaning Not a Number, follows the IEEE 754 floating point standard, which specifies that NaN is unordered and unequal to every value including itself, so NaN === NaN and NaN == NaN both evaluate to false. The global isNaN function coerces its argument to a number first, which causes surprising results like isNaN("hello") returning true because the string cannot be converted to a number and becomes NaN. Number.isNaN, introduced in ES6, does not perform type coercion and only returns true if the argument is literally the NaN value already of type number, making it the safer and recommended check. Object.is(NaN, NaN) also correctly returns true, since Object.is uses the SameValue algorithm which treats NaN as equal to itself, unlike strict equality. Array.prototype.includes also uses SameValueZero internally, so [NaN].includes(NaN) returns true, whereas [NaN].indexOf(NaN) returns -1 because indexOf uses strict equality.',
    code: "console.log(NaN === NaN); // false\nconsole.log(NaN == NaN); // false\n\nconsole.log(isNaN('hello')); // true, coerces 'hello' to NaN first (misleading!)\nconsole.log(Number.isNaN('hello')); // false, no coercion, 'hello' is not literally NaN\n\nconsole.log(Number.isNaN(NaN)); // true, the correct way\nconsole.log(Object.is(NaN, NaN)); // true\n\nconsole.log([NaN].includes(NaN)); // true, uses SameValueZero\nconsole.log([NaN].indexOf(NaN)); // -1, uses strict equality",
    interviewQuestion:
      'Why does `isNaN("hello")` return true while `Number.isNaN("hello")` returns false, and which one should you use to reliably check if a variable holds NaN?',
  },
  {
    id: "javascript-negative-zero-vs-zero",
    category: "javascript",
    difficulty: "Tricky",
    topic: "Numbers",
    title: "How does -0 differ from 0 in JavaScript, and when does it matter?",
    summary:
      "Negative zero is a distinct IEEE 754 value that is === to positive zero but distinguishable via Object.is or 1/x, which rarely matters but can cause subtle bugs.",
    explanation:
      "JavaScript numbers follow IEEE 754 double-precision floating point, which represents zero with a sign bit, producing two distinct bit patterns for positive and negative zero. Despite this, -0 === 0 and -0 == 0 both evaluate to true, and even Math.min(-0, 0) can behave unexpectedly since standard comparison treats them as equal. The values can be distinguished using Object.is(-0, 0), which returns false because Object.is implements the SameValue algorithm that does treat signed zeros as different, or by dividing 1 by the value: 1 / -0 yields -Infinity while 1 / 0 yields Infinity. Negative zero typically arises from multiplying or dividing by a negative number that results in a zero magnitude, such as -1 * 0 or 0 / -1. This distinction rarely matters in typical application code but can affect certain mathematical computations, canvas or graphics calculations, and has caused real bugs in libraries like Redux when using Object.is for state comparison in selectors.",
    code: "console.log(-0 === 0); // true\nconsole.log(Object.is(-0, 0)); // false, they ARE different\n\nconsole.log(1 / 0); // Infinity\nconsole.log(1 / -0); // -Infinity, reveals the sign\n\nconsole.log(-1 * 0); // -0\nconsole.log(JSON.stringify(-0)); // '0', JSON hides the distinction\n\nconsole.log(Math.sign(-0)); // -0, not -1\nconsole.log([-0].includes(0)); // true, includes uses SameValueZero (treats -0 and 0 as same)",
    interviewQuestion:
      "How would you write a function to reliably distinguish -0 from 0, given that both `===` and `==` treat them as equal?",
  },
  {
    id: "javascript-floating-point-precision",
    category: "javascript",
    difficulty: "Intermediate",
    topic: "Numbers",
    title: "Why does 0.1 + 0.2 not equal 0.3 in JavaScript?",
    summary:
      "JavaScript numbers use IEEE 754 double-precision floats, which cannot exactly represent most decimal fractions, causing small rounding errors in arithmetic.",
    explanation:
      "JavaScript has only one number type for non-BigInt values, a 64-bit IEEE 754 double, which represents numbers in binary floating point rather than exact decimal form. Fractions like 0.1 and 0.2 have no exact finite representation in binary, similar to how 1/3 has no exact finite decimal representation, so they are stored as the closest possible approximation. When these approximations are added, the result is a value extremely close to but not exactly 0.3, specifically 0.30000000000000004, which fails a strict equality check against the literal 0.3. The standard workaround is to compare numbers within a small tolerance, often called an epsilon, using Math.abs(a - b) < Number.EPSILON or a custom threshold appropriate to the domain. For financial or precision-critical calculations, the recommended approach is to work in integer cents or use a dedicated arbitrary-precision decimal library rather than relying on floating point arithmetic directly.",
    code: "console.log(0.1 + 0.2); // 0.30000000000000004\nconsole.log(0.1 + 0.2 === 0.3); // false\n\nfunction nearlyEqual(a, b, epsilon = Number.EPSILON) {\n  return Math.abs(a - b) < epsilon;\n}\nconsole.log(nearlyEqual(0.1 + 0.2, 0.3)); // true\n\n// Safer for money: work in integer cents\nconst priceInCents = 10 + 20; // 30 cents, exact\nconsole.log(priceInCents / 100); // 0.3",
    interviewQuestion:
      "Why does `0.1 + 0.2 === 0.3` evaluate to false in JavaScript, and what is the standard pattern for comparing floating point numbers safely?",
  },
  {
    id: "javascript-sparse-arrays-holes",
    category: "javascript",
    difficulty: "Advanced",
    topic: "Arrays",
    title:
      "What are sparse arrays and how do holes affect array method behavior?",
    summary:
      "Sparse arrays have missing indices (holes) rather than undefined values, and many array methods like forEach and map skip holes entirely while others do not.",
    explanation:
      "A sparse array is created when indices are skipped, such as new Array(3), deleting an element with delete arr[1], or explicitly setting arr.length beyond the current highest index, resulting in slots that have no assigned value at all rather than holding undefined. This is a subtle but important distinction: a hole is the complete absence of a property at that index, detectable via Object.prototype.hasOwnProperty, whereas an explicitly set undefined element does have that key present. Iteration methods like forEach, map, filter, and reduce all skip holes entirely, never invoking the callback for them, while map still preserves the hole in the resulting array. In contrast, more modern constructs like for...of, the spread operator, and Array.from treat holes as if they contained undefined, iterating over every index including holes. This inconsistency is a well-known gotcha, and console output like [1, <2 empty items>, 4] versus [1, undefined, undefined, 4] visually distinguishes holes from explicit undefined values in most environments.",
    code: "const sparse = [1, , 3]; // hole at index 1\nconsole.log(sparse.length); // 3\nconsole.log(sparse.hasOwnProperty(1)); // false, it's a real hole\n\nsparse.forEach(x => console.log('forEach:', x)); // only logs for index 0 and 2, skips hole\n\nconst mapped = sparse.map(x => x * 2);\nconsole.log(mapped); // [2, <1 empty item>, 6], hole preserved\n\nfor (const val of sparse) {\n  console.log('for...of:', val); // logs 1, undefined, 3 -- treats hole as undefined!\n}\n\nconsole.log([...sparse]); // [1, undefined, 3], spread also fills holes with undefined",
    interviewQuestion:
      "Given a sparse array `[1, , 3]`, explain why `forEach` skips the hole entirely but `for...of` and the spread operator treat it as undefined.",
  },
  {
    id: "javascript-string-normalize",
    category: "javascript",
    difficulty: "Advanced",
    topic: "Strings",
    title:
      "What does String.prototype.normalize do and why is it needed for string comparison?",
    summary:
      "normalize() converts a string to a consistent Unicode normalization form, ensuring visually identical strings built from different code point sequences compare as equal.",
    explanation:
      "Unicode allows certain characters, especially accented letters, to be represented in more than one way: as a single precomposed code point, such as e-acute, or as a base character followed by a combining diacritical mark, such as e followed by a combining acute accent. These two representations render identically on screen but are different sequences of code points, so a strict equality check between them returns false even though they look the same to a user. String.prototype.normalize(form) rewrites a string into one of four standard normalization forms: NFC, which composes characters into precomposed form and is the most common default, NFD, which decomposes into base plus combining marks, and NFKC and NFKD which additionally apply compatibility decompositions for things like ligatures or full-width characters. Calling normalize with the same form on both strings before comparing ensures that visually and semantically identical strings compare as equal, which matters for search, form validation, deduplication, and any system that receives text from different input methods or operating systems. This is a common real-world bug source in international applications, particularly for text originating from macOS, which tends to favor NFD, versus Windows or web forms, which tend to favor NFC.",
    code: "const composed = '\\u00e9'; // 'é' as a single precomposed code point\nconst decomposed = 'e\\u0301'; // 'e' + combining acute accent, renders as 'é'\n\nconsole.log(composed === decomposed); // false! Different code point sequences\nconsole.log(composed.length, decomposed.length); // 1, 2\n\nconsole.log(composed.normalize('NFC') === decomposed.normalize('NFC')); // true\nconsole.log(composed.normalize('NFD') === decomposed.normalize('NFD')); // true\n\n// Real-world use: comparing user search input against stored data\nfunction safeEquals(a, b) {\n  return a.normalize('NFC') === b.normalize('NFC');\n}",
    interviewQuestion:
      "Two strings that look visually identical fail a strict equality check when one comes from a macOS text field and the other from a database. What Unicode issue is likely at play, and how would you fix the comparison?",
  },
  {
    id: "javascript-object-hasown-vs-hasownproperty",
    category: "javascript",
    difficulty: "Intermediate",
    topic: "Objects",
    title:
      "Why was Object.hasOwn introduced when Object.prototype.hasOwnProperty already existed?",
    summary:
      "Object.hasOwn is a safer static alternative to obj.hasOwnProperty that works correctly even on objects created with Object.create(null) or that have overridden hasOwnProperty.",
    explanation:
      "Object.prototype.hasOwnProperty(key) is normally called as obj.hasOwnProperty(key), but this fails if obj was created with Object.create(null), since such an object has no prototype chain at all and therefore does not inherit the hasOwnProperty method, throwing a TypeError when called directly. It also fails or behaves incorrectly if the object defines its own property literally named hasOwnProperty that shadows the inherited method, a subtle and real footgun when working with untrusted or dynamic data shapes. The traditional defensive workaround was to call Object.prototype.hasOwnProperty.call(obj, key), explicitly borrowing the method and setting this to the target object, which works reliably but is verbose and easy to forget. Object.hasOwn(obj, key), introduced in ES2022, is a static method that performs the equivalent safe check without needing the call/borrowing pattern, and it works correctly on null-prototype objects, proxies, and objects with a shadowed hasOwnProperty property. It is now the recommended idiom for checking own-property existence in modern JavaScript.",
    code: "const nullProtoObj = Object.create(null);\nnullProtoObj.key = 'value';\n\n// nullProtoObj.hasOwnProperty('key'); // TypeError: hasOwnProperty is not a function\n\nconsole.log(Object.hasOwn(nullProtoObj, 'key')); // true, works safely\n\nconst shadowed = { hasOwnProperty: () => 'gotcha!', real: 1 };\nconsole.log(shadowed.hasOwnProperty('real')); // 'gotcha!' -- shadowed, unreliable!\nconsole.log(Object.hasOwn(shadowed, 'real')); // true, correct regardless of shadowing\n\n// Old defensive pattern, now largely replaced by Object.hasOwn:\nconsole.log(Object.prototype.hasOwnProperty.call(shadowed, 'real')); // true",
    interviewQuestion:
      "Why would calling `obj.hasOwnProperty(key)` throw a TypeError for an object created with `Object.create(null)`, and how does `Object.hasOwn` avoid this problem?",
  },
  {
    id: "javascript-structuredclone-limitations",
    category: "javascript",
    difficulty: "Advanced",
    topic: "Cloning",
    title:
      "What are the limitations of structuredClone for deep copying objects?",
    summary:
      "structuredClone deep-copies most data types including circular references, but cannot clone functions, DOM nodes, class instances with prototype methods, or property accessors.",
    explanation:
      "structuredClone implements the structured clone algorithm used internally by the browser for postMessage and IndexedDB, and it correctly deep-copies plain objects, arrays, Maps, Sets, Dates, RegExp, typed arrays, and even objects containing circular references, which JSON.parse(JSON.stringify()) cannot handle at all. However, it explicitly throws a DataCloneError when asked to clone functions, since functions cannot be serialized, and it cannot clone DOM nodes in most contexts, Error objects lose their prototype chain information in some implementations, and class instances lose their prototype, meaning the clone becomes a plain object with the same own properties but without the original classes methods. Getters, setters, and non-enumerable properties are also not preserved, since the algorithm clones the current data values rather than the property descriptors or accessor logic. For objects requiring custom clone behavior, such as class instances that must retain their methods, a manual clone method or a library like lodashs cloneDeep with custom customizer functions remains necessary.",
    code: "class Point {\n  constructor(x, y) { this.x = x; this.y = y; }\n  distanceFromOrigin() { return Math.sqrt(this.x ** 2 + this.y ** 2); }\n}\n\nconst p = new Point(3, 4);\nconst cloned = structuredClone(p);\nconsole.log(cloned); // { x: 3, y: 4 } -- plain object now\nconsole.log(cloned instanceof Point); // false, lost the class prototype\n// cloned.distanceFromOrigin(); // TypeError: not a function\n\n// Circular references work fine, unlike JSON:\nconst circular = { name: 'a' };\ncircular.self = circular;\nconst clonedCircular = structuredClone(circular);\nconsole.log(clonedCircular.self === clonedCircular); // true\n\n// Functions throw:\n// structuredClone({ fn: () => {} }); // DataCloneError",
    interviewQuestion:
      "You use structuredClone to copy an instance of a custom class and find that its methods are gone afterward. Why does this happen, and how would you deep-clone the instance while preserving its class methods?",
  },
  {
    id: "javascript-promise-any-vs-race",
    category: "javascript",
    difficulty: "Intermediate",
    topic: "Promises",
    title: "How does Promise.any differ from Promise.race?",
    summary:
      "Promise.any resolves with the first fulfilled promise and ignores rejections until all fail, while Promise.race settles with whichever promise finishes first, success or failure.",
    explanation:
      "Promise.race(promises) settles as soon as any one of the input promises settles, whether that settlement is a fulfillment or a rejection, meaning if the fastest promise happens to reject, the whole race rejects with that reason even if a slower promise would have succeeded. Promise.any(promises), introduced in ES2021, specifically waits for the first fulfillment and ignores rejections as they come in, only rejecting itself if every single input promise rejects, in which case it rejects with an AggregateError containing all the individual rejection reasons. This makes Promise.any ideal for scenarios like querying multiple redundant mirror servers and wanting the fastest successful response while tolerating some servers being down, whereas Promise.race is better suited for implementing timeouts, racing a real operation against a timer promise that rejects after a deadline. Both differ from Promise.all, which waits for every promise to fulfill and rejects immediately on the first rejection, and Promise.allSettled, which waits for all promises regardless of outcome and never rejects itself.",
    code: "const slowFail = new Promise((_, reject) => setTimeout(() => reject('fast fail'), 10));\nconst slowSuccess = new Promise((resolve) => setTimeout(() => resolve('slow success'), 50));\n\nPromise.race([slowFail, slowSuccess])\n  .then(console.log)\n  .catch(err => console.log('race rejected:', err)); // 'race rejected: fast fail'\n\nPromise.any([slowFail, slowSuccess])\n  .then(console.log) // 'slow success' -- ignores the earlier rejection!\n  .catch(err => console.log('any rejected:', err));\n\nPromise.any([Promise.reject('a'), Promise.reject('b')])\n  .catch(err => console.log(err instanceof AggregateError, err.errors)); // true ['a','b']",
    interviewQuestion:
      "If the fastest of three concurrent promises rejects but a slower one would eventually succeed, what does Promise.race do versus Promise.any, and when would you choose each?",
  },
  {
    id: "javascript-top-level-await",
    category: "javascript",
    difficulty: "Intermediate",
    topic: "Modules",
    title: "What is top-level await and what restrictions apply to it?",
    summary:
      "Top-level await allows using await outside an async function at the top of an ES module, but it delays the module and its importers until the awaited promise settles.",
    explanation:
      'Top-level await, standardized in ES2022, permits the await keyword to be used directly in the top-level scope of an ES module without wrapping it in an async function, which is useful for initializing a module with asynchronous data such as fetching configuration or dynamically importing a dependency based on runtime conditions. It is only available inside ES modules, meaning the file must be loaded with type="module" in the browser or have a .mjs extension or "type": "module" in package.json in Node, and it is not permitted in CommonJS modules or regular synchronous scripts. A crucial consequence is that any module which imports a module using top-level await will itself wait for that await to resolve before its own top-level code continues executing, since the module graphs evaluation phase becomes asynchronous, which can introduce unexpected loading delays in a deep dependency graph. Top-level await also enables patterns like conditionally importing different polyfills or platform-specific implementations before the rest of the module code runs.',
    code: "// config.mjs\nconst response = await fetch('https://api.example.com/config');\nconst config = await response.json();\nexport default config;\n\n// main.mjs -- this module's execution is delayed until config.mjs's await resolves\nimport config from './config.mjs';\nconsole.log('config loaded:', config);\n\n// Conditional dynamic import pattern:\nconst strings = await (navigator.language === 'fr'\n  ? import('./lang-fr.mjs')\n  : import('./lang-en.mjs'));",
    interviewQuestion:
      "If module A uses top-level await to fetch data, and module B imports module A, how does that affect when module B's own top-level code starts executing?",
  },
  {
    id: "javascript-microtask-starvation",
    category: "javascript",
    difficulty: "Tricky",
    topic: "Event Loop",
    title: "What is microtask starvation and how can it freeze an application?",
    summary:
      "Microtask starvation occurs when microtasks like resolved promises keep queuing more microtasks, preventing the event loop from ever reaching the next macrotask, freezing rendering and I/O.",
    explanation:
      "The JavaScript event loop fully drains the entire microtask queue, which includes resolved Promise callbacks and queueMicrotask calls, after every single synchronous task or macrotask before it is allowed to proceed to the next macrotask, such as a setTimeout callback, an I/O event, or a UI repaint in browsers. If a microtask callback recursively schedules another microtask, for example a promise .then handler that immediately queues a new .then on another already-resolved promise in an infinite loop, the microtask queue never actually empties, meaning the event loop is stuck perpetually draining microtasks and never yields control to render frames, handle user input, or fire timers. This is called microtask starvation, and it is a genuine way to freeze a browser tab or a Node.js process despite the code being technically asynchronous and non-blocking in the traditional single long-running-function sense. The fix is to periodically yield back to the macrotask queue using setTimeout(fn, 0), requestAnimationFrame, or MessageChannel-based scheduling to break up long chains of self-perpetuating microtask work.",
    code: "// DANGER: this will freeze the page/process, never actually run it unattended\nfunction starve() {\n  Promise.resolve().then(starve); // recursively re-queues a microtask forever\n}\n// starve(); // event loop never reaches setTimeout callbacks or repaints again\n\nsetTimeout(() => console.log('this will NEVER run if starve() is active'), 0);\n\n// The fix: yield to the macrotask queue periodically\nfunction healthyLoop(i = 0) {\n  if (i > 1000000) return;\n  // do some microtask-scale work here\n  setTimeout(() => healthyLoop(i + 1), 0); // yields control back to the event loop\n}",
    interviewQuestion:
      "How could a chain of Promise .then() callbacks that keep re-queuing themselves cause a web page to become completely unresponsive, even though no single synchronous function is blocking for long?",
  },
  {
    id: "javascript-new-keyword-mechanics",
    category: "javascript",
    difficulty: "Advanced",
    topic: "Objects",
    title: "What exactly happens step by step when you use the new keyword?",
    summary:
      "The new operator creates a fresh object linked to the constructors prototype, binds this to it, runs the constructor body, and returns the new object unless the constructor explicitly returns another object.",
    explanation:
      "When new Constructor(args) is evaluated, the engine first creates a brand-new, empty plain object. Second, it sets that new objects internal [[Prototype]] link to point to Constructor.prototype, which is why instances created by the same constructor share access to methods defined on that prototype object. Third, the constructor function is invoked with this bound to the newly created object, and the provided arguments are passed in as usual, executing the constructors body which typically assigns properties onto this. Fourth and finally, if the constructor function explicitly returns an object, that returned object becomes the overall result of the new expression instead of the object created in step one, but if the constructor returns a primitive value or nothing, the originally created object from step one is returned regardless. You can replicate this entire process manually using Object.create(Constructor.prototype) followed by Constructor.call(newObj, args), which is essentially what Reflect.construct does internally.",
    code: "function Person(name) {\n  this.name = name;\n  // implicit: return this; (unless we return an object explicitly)\n}\nPerson.prototype.greet = function () {\n  return `Hi, I'm ${this.name}`;\n};\n\n// Manual step-by-step reimplementation of `new Person('Sai')`:\nfunction myNew(Constructor, ...args) {\n  const obj = Object.create(Constructor.prototype); // step 1 & 2\n  const result = Constructor.apply(obj, args); // step 3\n  return typeof result === 'object' && result !== null ? result : obj; // step 4\n}\n\nconst p1 = new Person('Sai');\nconst p2 = myNew(Person, 'Sai');\nconsole.log(p1.greet(), p2.greet()); // both work identically\nconsole.log(p1 instanceof Person, p2 instanceof Person); // true true\n\nfunction WeirdConstructor() {\n  this.a = 1;\n  return { b: 2 }; // explicit object return overrides the new instance\n}\nconsole.log(new WeirdConstructor()); // { b: 2 }, NOT { a: 1 }",
    interviewQuestion:
      "Write a function that manually replicates what the `new` keyword does, and explain what happens if the constructor function explicitly returns an object versus a primitive value.",
  },
  {
    id: "javascript-memory-leaks-closures-detached-dom",
    category: "javascript",
    difficulty: "Tricky",
    topic: "Memory Management",
    title:
      "How do closures and detached DOM nodes commonly cause memory leaks in JavaScript?",
    summary:
      "Closures that capture large data or DOM references, plus event listeners left attached to removed elements, are two of the most common sources of memory leaks in long-running JS apps.",
    explanation:
      "A closure keeps its entire enclosing lexical environment alive for as long as the closure itself is reachable, so if a long-lived closure, such as an event handler attached to a global object or a setInterval callback, incidentally captures a reference to a large object or an entire DOM subtree, that memory cannot be reclaimed even if the rest of the code no longer needs it. A detached DOM node is an element that has been removed from the document tree via removeChild or innerHTML replacement, but is still referenced somewhere in JavaScript, such as in an array cache or, very commonly, inside an event listener closure, which prevents the browsers garbage collector from reclaiming the memory for that entire node subtree despite it no longer being visible or part of the page. The classic fix is to always call removeEventListener before discarding a DOM node when the listener was attached with a named function, or to use patterns like AbortController with a shared signal to cleanly remove many listeners at once, and to explicitly null out large object references held in long-lived closures once they are no longer needed. Modern DevTools memory profilers, specifically heap snapshots, are the standard tool for diagnosing these leaks by searching for detached DOM tree nodes that remain retained in memory.",
    code: "// LEAK: closure keeps a giant array alive forever via the interval callback\nfunction startLeakyTimer() {\n  const hugeData = new Array(1_000_000).fill('leak');\n  setInterval(() => {\n    console.log(hugeData.length); // closure retains hugeData forever\n  }, 10000);\n}\n\n// LEAK: detached DOM node kept alive by a listener reference in an array\nconst detachedNodes = [];\nfunction attachAndRemove() {\n  const el = document.createElement('div');\n  el.addEventListener('click', () => console.log('clicked'));\n  detachedNodes.push(el); // el is removed from DOM but still referenced here, and by the listener closure\n  document.body.removeChild(el);\n}\n\n// FIX: explicitly clean up references and listeners\nfunction cleanupProperly(el, handler) {\n  el.removeEventListener('click', handler);\n  el = null; // release the reference so GC can reclaim it\n}",
    interviewQuestion:
      "A single-page app grows slower over time as users navigate between views, and a heap snapshot shows many detached DOM nodes retained in memory. What are two common coding patterns that cause this, and how would you fix them?",
  },
{
    id: "javascript-array-at",
    category: "javascript",
    difficulty: "Basic",
    topic: "Modern Array Methods",
    title: "What does Array.prototype.at() do?",
    summary: "at() returns the element at a given index, supporting negative indices to count from the end of the array.",
    explanation: "Before at(), accessing the last element required arr[arr.length - 1] or arr.slice(-1)[0]. The at() method accepts negative integers to index from the end, so arr.at(-1) returns the last element directly. It works on arrays, strings, and typed arrays. Unlike bracket notation, at() normalizes negative indices internally rather than treating them as string property keys.",
    code: "const arr = [10, 20, 30, 40];\nconsole.log(arr.at(0));\nconsole.log(arr.at(-1));\nconsole.log(arr[arr.length - 1]);\nconsole.log(arr.at(10));\n\nconst str = 'hello';\nconsole.log(str.at(-1));",
    interviewQuestion: "How does Array.prototype.at(-1) differ from arr[arr.length - 1], and why was at() added to the language?",
  },
  {
    id: "javascript-array-findlast-findlastindex",
    category: "javascript",
    difficulty: "Basic",
    topic: "Modern Array Methods",
    title: "How do findLast() and findLastIndex() work?",
    summary: "findLast() and findLastIndex() search an array from the end, returning the first matching element or its index.",
    explanation: "These methods behave like find() and findIndex() but iterate in reverse order, starting from the highest index down to zero. This is useful when you want the most recent match in a list, such as the last error in a log array, without manually reversing the array (which would mutate a copy and cost extra memory). The callback still receives (element, index, array) with the original, non-reversed indices.",
    code: "const logs = [\n  { level: 'info', msg: 'start' },\n  { level: 'error', msg: 'fail 1' },\n  { level: 'info', msg: 'retry' },\n  { level: 'error', msg: 'fail 2' },\n];\n\nconst lastError = logs.findLast(l => l.level === 'error');\nconst lastErrorIndex = logs.findLastIndex(l => l.level === 'error');\n\nconsole.log(lastError.msg);\nconsole.log(lastErrorIndex);",
    interviewQuestion: "When would you reach for findLast() instead of reversing an array and calling find()?",
  },
  {
    id: "javascript-array-tosorted-toreversed",
    category: "javascript",
    difficulty: "Intermediate",
    topic: "Immutable Array Methods",
    title: "What do toSorted() and toReversed() add over sort() and reverse()?",
    summary: "toSorted() and toReversed() return a new sorted or reversed array without mutating the original, unlike sort() and reverse().",
    explanation: "sort() and reverse() mutate the array in place and return a reference to the same array, which is a common source of bugs when other code holds a reference to the original order. toSorted(compareFn) and toReversed() perform a copy first, leaving the source array untouched. This aligns arrays with immutable-by-default patterns favored in React state and Redux reducers, removing the need for [...arr].sort() workarounds.",
    code: "const original = [3, 1, 2];\nconst sorted = original.toSorted();\nconst reversed = original.toReversed();\n\nconsole.log(original);\nconsole.log(sorted);\nconsole.log(reversed);\n\n// old workaround still works too\nconst manualSorted = [...original].sort();\nconsole.log(manualSorted);",
    interviewQuestion: "Why might toSorted() be preferable to sort() when managing React state?",
  },
  {
    id: "javascript-array-tospliced",
    category: "javascript",
    difficulty: "Intermediate",
    topic: "Immutable Array Methods",
    title: "How does toSpliced() differ from splice()?",
    summary: "toSpliced() performs the same insert/remove/replace operation as splice() but returns a new array instead of mutating in place.",
    explanation: "splice() is powerful but mutates the original array and returns only the removed elements, which makes it awkward in immutable-state code. toSpliced(start, deleteCount, ...items) takes the same arguments but leaves the original array untouched and returns the full resulting array. This makes it a direct drop-in for patterns like removing an item from a list stored in component state without needing to spread into a copy first.",
    code: "const todos = ['buy milk', 'walk dog', 'write code'];\n\nconst withoutSecond = todos.toSpliced(1, 1);\nconst withInserted = todos.toSpliced(1, 0, 'call mom');\n\nconsole.log(todos);\nconsole.log(withoutSecond);\nconsole.log(withInserted);",
    interviewQuestion: "How would you remove an item from a todo list stored in React state using toSpliced() instead of splice()?",
  },
  {
    id: "javascript-array-with",
    category: "javascript",
    difficulty: "Intermediate",
    topic: "Immutable Array Methods",
    title: "What does Array.prototype.with() do?",
    summary: "with(index, value) returns a new array with the element at the given index replaced, leaving the original array unchanged.",
    explanation: "Updating a single array element immutably traditionally required spreading and reassigning, like [...arr.slice(0, i), value, ...arr.slice(i + 1)]. The with() method replaces that pattern with a single, readable call that copies the array and swaps in the new value at the given index. Negative indices are supported just like at(). It throws a RangeError if the index is out of bounds, unlike bracket assignment which would silently create sparse entries.",
    code: "const scores = [10, 20, 30];\nconst updated = scores.with(1, 99);\n\nconsole.log(scores);\nconsole.log(updated);\n\ntry {\n  scores.with(10, 1);\n} catch (e) {\n  console.log(e instanceof RangeError);\n}",
    interviewQuestion: "How does arr.with(i, value) improve on manually splicing or spreading to update one element immutably?",
  },
  {
    id: "javascript-import-meta",
    category: "javascript",
    difficulty: "Intermediate",
    topic: "ES Modules",
    title: "What is import.meta used for?",
    summary: "import.meta is a module-scoped object exposing metadata about the current module, such as its URL, and is only valid inside ES modules.",
    explanation: "In browsers and modern Node, import.meta.url gives the absolute URL of the current module file, which is useful for resolving relative asset paths or constructing file URLs without relying on CommonJS globals like __dirname or __filename that don't exist in ESM. Bundlers like Vite also inject extra properties onto import.meta, such as import.meta.env for environment variables and import.meta.hot for hot module replacement. Because it's syntax tied to modules, using import.meta in a plain script or CommonJS file is a SyntaxError.",
    code: "// inside an ES module file\nconsole.log(import.meta.url);\n\n// resolving a sibling asset relative to this module\nconst assetUrl = new URL('./logo.png', import.meta.url);\nconsole.log(assetUrl.href);\n\n// Vite-style env access\n// console.log(import.meta.env.MODE);",
    interviewQuestion: "How would you get the equivalent of __dirname in a native ES module, and what role does import.meta.url play?",
  },
  {
    id: "javascript-abortsignal-timeout-any",
    category: "javascript",
    difficulty: "Advanced",
    topic: "Cancellation & Async Control",
    title: "What do AbortSignal.timeout() and AbortSignal.any() do?",
    summary: "AbortSignal.timeout(ms) creates a signal that auto-aborts after a delay, and AbortSignal.any(signals) combines multiple signals so aborting any one of them aborts the result.",
    explanation: "These are static factory methods on AbortSignal that remove the need to manually wire up an AbortController with setTimeout for timeout-based cancellation. AbortSignal.timeout(ms) returns a signal that fires abort automatically once the timer elapses, ideal for fetch() calls that should give up after N milliseconds. AbortSignal.any([sigA, sigB]) merges several signals into one that aborts as soon as any input signal aborts, letting you race a user-cancel signal against a timeout signal without extra event listener plumbing.",
    code: "async function fetchWithLimits(url, userSignal) {\n  const timeoutSignal = AbortSignal.timeout(5000);\n  const combined = AbortSignal.any([userSignal, timeoutSignal]);\n\n  const res = await fetch(url, { signal: combined });\n  return res.json();\n}\n\nconst controller = new AbortController();\n// fetchWithLimits('/api/data', controller.signal);\n// controller.abort(); // cancels immediately regardless of timeout",
    interviewQuestion: "How would you cancel a fetch request if either a 5-second timeout elapses or the user clicks cancel, using only AbortSignal APIs?",
  },
  {
    id: "javascript-async-iterators-protocol",
    category: "javascript",
    difficulty: "Advanced",
    topic: "Async Iteration",
    title: "What is the async iterator protocol and how does for-await-of use it?",
    summary: "An async iterator is an object with a next() method that returns a Promise resolving to { value, done }, letting for-await-of consume asynchronously produced values one at a time.",
    explanation: "The async iterator protocol mirrors the sync iterator protocol but next() returns a Promise instead of a plain result object, since each value may not be ready immediately. Objects that implement Symbol.asyncIterator can be looped over with for-await-of, which automatically awaits each next() call. This underlies things like async generators, streaming response bodies, and paginated API consumption where each 'next' step involves network or I/O latency.",
    code: "function createAsyncRange(start, end, delay) {\n  return {\n    [Symbol.asyncIterator]() {\n      let current = start;\n      return {\n        next() {\n          return new Promise(resolve => {\n            setTimeout(() => {\n              if (current > end) return resolve({ value: undefined, done: true });\n              resolve({ value: current++, done: false });\n            }, delay);\n          });\n        },\n      };\n    },\n  };\n}\n\nasync function run() {\n  for await (const n of createAsyncRange(1, 3, 100)) {\n    console.log(n);\n  }\n}\nrun();",
    interviewQuestion: "What is the shape of the object returned by an async iterator's next() method, and how does for-await-of consume it?",
  },
  {
    id: "javascript-async-generator-pipelines",
    category: "javascript",
    difficulty: "Advanced",
    topic: "Async Iteration",
    title: "How do you build a data pipeline by chaining async generators?",
    summary: "Async generator functions can be composed together, where each generator consumes the previous one via for-await-of and yields transformed values, forming a lazy async pipeline.",
    explanation: "Because async generators are both async iterators and iterables, you can pass one async generator's output as the input to another, building composable transform stages similar to Unix pipes — each stage pulls the next value only when asked, keeping memory usage low for large or infinite streams. This differs from consuming a single async generator (a more basic use case) because the focus here is on functional composition: filtering, mapping, and batching stages chained together lazily rather than eagerly buffering results in arrays. It's a common pattern for processing paginated API results or streaming file data.",
    code: "async function* source() {\n  for (let i = 1; i <= 5; i++) yield i;\n}\n\nasync function* mapGen(iter, fn) {\n  for await (const val of iter) yield fn(val);\n}\n\nasync function* filterGen(iter, pred) {\n  for await (const val of iter) if (pred(val)) yield val;\n}\n\nasync function run() {\n  const pipeline = filterGen(mapGen(source(), x => x * 2), x => x > 4);\n  for await (const value of pipeline) {\n    console.log(value);\n  }\n}\nrun();",
    interviewQuestion: "How would you compose multiple async generators into a lazy processing pipeline, and why is laziness valuable for large data streams?",
  },
  {
    id: "javascript-promise-withresolvers",
    category: "javascript",
    difficulty: "Intermediate",
    topic: "Promises",
    title: "What problem does Promise.withResolvers() solve?",
    summary: "Promise.withResolvers() returns a { promise, resolve, reject } object, exposing the executor callbacks without needing to capture them from inside a new Promise() constructor.",
    explanation: "Previously, to resolve a promise from outside its executor function, developers had to declare resolve and reject variables, assign them inside new Promise((res, rej) => {...}), and use them later — a pattern sometimes called the 'deferred' pattern. Promise.withResolvers() is a static method that returns all three pieces directly, removing the awkward variable-capture boilerplate and reducing the chance of forgetting to assign the callbacks before the constructor returns.",
    code: "// old deferred pattern\nlet resolveOld, rejectOld;\nconst oldPromise = new Promise((res, rej) => {\n  resolveOld = res;\n  rejectOld = rej;\n});\n\n// new built-in pattern\nconst { promise, resolve, reject } = Promise.withResolvers();\n\nsetTimeout(() => resolve('done'), 100);\npromise.then(console.log);",
    interviewQuestion: "How did developers create a 'deferred' promise before Promise.withResolvers(), and what boilerplate does the new API remove?",
  },
  {
    id: "javascript-reflect-construct-apply",
    category: "javascript",
    difficulty: "Advanced",
    topic: "Reflect API",
    title: "What are Reflect.construct() and Reflect.apply() useful for?",
    summary: "Reflect.construct() lets you invoke a class constructor with a custom prototype target, and Reflect.apply() calls a function with a given this and argument list without spreading manually.",
    explanation: "Reflect.apply(fn, thisArg, argsArray) is a clearer alternative to fn.apply(thisArg, argsArray) that works even if fn's own apply method has been overridden or removed, since it uses the internal call rather than the method lookup. Reflect.construct(TargetClass, args, newTarget) is more powerful: the optional third argument lets you construct an instance of TargetClass but with a different prototype chain, which is exactly how libraries implement subclassing utilities or proxy-based class extension without using the extends keyword directly. This is a distinct use case from Proxy traps, which only intercept operations rather than directly invoking constructors with a custom target.",
    code: "class Animal {\n  constructor(name) { this.name = name; }\n}\nclass Dog {\n  constructor(name) { this.name = name; this.bark = () => 'Woof'; }\n}\n\n// construct an Animal instance but give it Dog.prototype\nconst hybrid = Reflect.construct(Animal, ['Rex'], Dog);\nconsole.log(hybrid.name, hybrid instanceof Dog);\n\nfunction sum(a, b) { return a + b; }\nconsole.log(Reflect.apply(sum, null, [2, 3]));",
    interviewQuestion: "How does the third argument to Reflect.construct() enable custom subclassing behavior that plain 'new' cannot express?",
  },
  {
    id: "javascript-object-defineproperty-descriptors",
    category: "javascript",
    difficulty: "Advanced",
    topic: "Object Internals",
    title: "What are property descriptors and how does Object.defineProperty() use them?",
    summary: "Every object property has a descriptor controlling its value, writability, enumerability, and configurability, and Object.defineProperty() lets you set these explicitly instead of via normal assignment.",
    explanation: "A data descriptor has value, writable, enumerable, and configurable flags, while an accessor descriptor has get/set functions instead of value/writable. Normal property assignment (obj.x = 1) creates a descriptor with all flags true by default, but Object.defineProperty(obj, key, descriptor) lets you create non-enumerable properties (hidden from for-in and Object.keys), non-writable constants, or non-configurable properties that can't be deleted or redefined. This is how built-ins hide internal properties and how libraries implement computed properties without polluting enumeration.",
    code: "const obj = {};\n\nObject.defineProperty(obj, 'id', {\n  value: 42,\n  writable: false,\n  enumerable: false,\n  configurable: false,\n});\n\nobj.id = 100; // silently fails in non-strict mode\nconsole.log(obj.id);\nconsole.log(Object.keys(obj));\nconsole.log(Object.getOwnPropertyDescriptor(obj, 'id'));",
    interviewQuestion: "What happens if you try to reassign a property that was defined with writable: false, and how would you make a property invisible to Object.keys() but still readable?",
  },
  {
    id: "javascript-blob-basics",
    category: "javascript",
    difficulty: "Basic",
    topic: "Binary Data & Files",
    title: "What is a Blob and when do you use one?",
    summary: "A Blob represents immutable, raw binary data with a MIME type, commonly used for handling file contents, downloads, or constructing object URLs.",
    explanation: "Blob (Binary Large Object) instances hold data that may come from files, canvas exports, or in-memory arrays, along with a 'type' property describing the MIME type. Blobs are immutable but slice-able, and they can be converted to text, ArrayBuffer, or a ReadableStream via their instance methods. A common pattern is creating a Blob from generated content (like a CSV string) and turning it into a downloadable link using URL.createObjectURL().",
    code: "const csvContent = 'name,age\\nAlice,30\\nBob,25';\nconst blob = new Blob([csvContent], { type: 'text/csv' });\n\nconsole.log(blob.size, blob.type);\n\nconst url = URL.createObjectURL(blob);\nconst link = document.createElement('a');\nlink.href = url;\nlink.download = 'data.csv';\nlink.click();\nURL.revokeObjectURL(url);",
    interviewQuestion: "How would you let a user download dynamically generated CSV data as a file using a Blob?",
  },
  {
    id: "javascript-file-object",
    category: "javascript",
    difficulty: "Basic",
    topic: "Binary Data & Files",
    title: "How does the File object relate to Blob?",
    summary: "File extends Blob with additional metadata like name and lastModified, and is what you get from file input elements or drag-and-drop events.",
    explanation: "Because File inherits from Blob, every Blob method (text(), arrayBuffer(), slice()) works on File objects too. The extra properties — name, lastModified, and webkitRelativePath — make File suitable for representing actual filesystem entries selected via an <input type='file'> element or a drag-and-drop DataTransfer object. You can also construct a File manually with new File([data], filename, options) when you need to send generated content to an API as if it were a real uploaded file.",
    code: "const input = document.querySelector('input[type=\"file\"]');\ninput.addEventListener('change', async () => {\n  const file = input.files[0];\n  console.log(file.name, file.size, file.type, file.lastModified);\n\n  const text = await file.text();\n  console.log(text.slice(0, 100));\n});\n\n// constructing a File manually\nconst generated = new File(['hello world'], 'note.txt', { type: 'text/plain' });",
    interviewQuestion: "What extra information does a File object carry compared to a plain Blob, and where does that data typically come from?",
  },
  {
    id: "javascript-arraybuffer-typedarray",
    category: "javascript",
    difficulty: "Intermediate",
    topic: "Binary Data & Files",
    title: "How do ArrayBuffer and TypedArrays relate to each other?",
    summary: "An ArrayBuffer is a fixed-length raw memory buffer, and TypedArrays like Uint8Array or Float64Array provide typed, indexable views into that buffer for reading and writing binary data.",
    explanation: "ArrayBuffer itself has no methods for reading or writing individual values — it's just an allocated block of bytes. TypedArrays (Uint8Array, Int16Array, Float32Array, etc.) wrap a buffer and interpret its bytes as a specific numeric type, exposing array-like indexing. Multiple typed array views can share the same underlying buffer, so writing through one view can be observed through another, which matters when parsing binary protocols, WebGL data, or file formats. DataView offers an alternative for reading mixed types with explicit endianness control.",
    code: "const buffer = new ArrayBuffer(4);\nconst view8 = new Uint8Array(buffer);\nconst view32 = new Uint32Array(buffer);\n\nview8[0] = 0xff;\nview8[1] = 0xff;\nview8[2] = 0xff;\nview8[3] = 0xff;\n\nconsole.log(view32[0]); // 4294967295, same bytes viewed as one 32-bit int\n\nconst dv = new DataView(buffer);\nconsole.log(dv.getUint32(0, true)); // little-endian read",
    interviewQuestion: "Why can't you write directly to an ArrayBuffer, and what's the difference between using a TypedArray view versus a DataView to read its bytes?",
  },
  {
    id: "javascript-urlsearchparams",
    category: "javascript",
    difficulty: "Basic",
    topic: "Web Platform Utilities",
    title: "What does URLSearchParams simplify about query strings?",
    summary: "URLSearchParams provides a structured API for reading, building, and encoding URL query strings without manual string splitting or encodeURIComponent calls.",
    explanation: "Instead of manually parsing 'a=1&b=2' with split and decodeURIComponent, URLSearchParams gives get/set/append/delete/has methods and handles percent-encoding automatically. It's iterable, so you can loop over entries with for-of or convert it to an object. It's commonly paired with the URL object (new URL(str).searchParams) or used directly to build a query string for a fetch request.",
    code: "const params = new URLSearchParams('name=Alice&age=30');\nconsole.log(params.get('name'));\nparams.append('city', 'NYC');\nparams.set('age', '31');\n\nfor (const [key, value] of params) {\n  console.log(key, value);\n}\n\nconsole.log(params.toString());\n\nconst url = new URL('https://api.example.com/search');\nurl.searchParams.set('q', 'js interview');\nconsole.log(url.href);",
    interviewQuestion: "How would you build a query string with special characters safely using URLSearchParams instead of manual string concatenation?",
  },
  {
    id: "javascript-formdata",
    category: "javascript",
    difficulty: "Intermediate",
    topic: "Web Platform Utilities",
    title: "When and why do you use FormData with fetch?",
    summary: "FormData represents a set of key/value pairs formatted for multipart form submission, and is the standard way to send files or mixed form fields via fetch without manually building a multipart body.",
    explanation: "FormData can be constructed from an actual <form> element (auto-populating from its inputs) or built manually with append(). When passed as the body of a fetch() request, the browser automatically sets the Content-Type header to multipart/form-data with the correct boundary, which is required for file uploads. Unlike JSON.stringify, FormData natively supports File and Blob values alongside strings, making it the go-to choice for upload forms that mix text fields and file inputs.",
    code: "const form = document.querySelector('form');\nform.addEventListener('submit', async (e) => {\n  e.preventDefault();\n  const formData = new FormData(form);\n  formData.append('extraField', 'added manually');\n\n  const res = await fetch('/api/upload', {\n    method: 'POST',\n    body: formData,\n  });\n  console.log(await res.json());\n});",
    interviewQuestion: "Why would you use FormData instead of JSON.stringify when submitting a form that includes a file upload?",
  },
  {
    id: "javascript-crypto-randomuuid",
    category: "javascript",
    difficulty: "Basic",
    topic: "Web Crypto",
    title: "What does crypto.randomUUID() provide?",
    summary: "crypto.randomUUID() generates a cryptographically random, RFC 4122 version 4 UUID string natively, without needing a third-party library.",
    explanation: "Before this API, generating a UUID meant pulling in a package like uuid or hand-rolling a Math.random-based generator, which is not cryptographically secure and can produce collisions or predictable values. crypto.randomUUID() is available on the global crypto object in browsers and Node, uses a secure random source under the hood, and returns a properly formatted string like 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx' suitable for IDs, tokens, or database keys.",
    code: "const id1 = crypto.randomUUID();\nconst id2 = crypto.randomUUID();\n\nconsole.log(id1);\nconsole.log(id1 === id2);\n\n// common usage: generating unique keys for list items\nconst todos = ['Buy milk', 'Walk dog'].map(text => ({\n  id: crypto.randomUUID(),\n  text,\n}));\nconsole.log(todos);",
    interviewQuestion: "Why is crypto.randomUUID() preferred over a Math.random()-based UUID generator for security-sensitive identifiers?",
  },
  {
    id: "javascript-crypto-subtle-hashing",
    category: "javascript",
    difficulty: "Advanced",
    topic: "Web Crypto",
    title: "How do you hash data with the Web Crypto subtle API?",
    summary: "crypto.subtle exposes low-level cryptographic operations like hashing, encryption, and key generation, all returning Promises and operating on ArrayBuffers rather than plain strings.",
    explanation: "crypto.subtle.digest(algorithm, data) computes a cryptographic hash (e.g. SHA-256) of an ArrayBuffer and resolves to the hash as another ArrayBuffer, which typically needs conversion to a hex or base64 string for display. Because the API works exclusively with binary buffers, strings must first be encoded with TextEncoder. Beyond hashing, crypto.subtle also supports generateKey, encrypt/decrypt, sign/verify, and deriveKey for building things like client-side encryption or password-verification flows, and it's only available in secure contexts (HTTPS or localhost).",
    code: "async function sha256(message) {\n  const data = new TextEncoder().encode(message);\n  const hashBuffer = await crypto.subtle.digest('SHA-256', data);\n  const hashArray = Array.from(new Uint8Array(hashBuffer));\n  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');\n}\n\nsha256('hello world').then(console.log);",
    interviewQuestion: "Why does crypto.subtle.digest() require encoding a string to an ArrayBuffer first, and what does the resulting hash need before it can be displayed as text?",
  },
];
