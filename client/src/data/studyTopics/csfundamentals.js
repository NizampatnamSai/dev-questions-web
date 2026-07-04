// 30 Computer Science Fundamentals topics for Study Hub (classic DSA / CS interview prep).
export default [
  {
    id: "csfundamentals-big-o-notation",
    category: "csfundamentals",
    difficulty: "Basic",
    topic: "Complexity Analysis",
    title: "What is Big O Notation?",
    summary:
      "Big O describes how an algorithm's runtime or memory usage grows as the input size grows, ignoring constants and lower-order terms.",
    explanation:
      "Big O gives an upper bound on growth rate as input size n approaches infinity, letting you compare algorithms independent of hardware or language. Common classes from fastest to slowest growth are O(1), O(log n), O(n), O(n log n), O(n^2), O(2^n), and O(n!). When analyzing code, you drop constants and non-dominant terms because they matter less and less as n grows large, so O(2n + 100) simplifies to O(n). Interviewers use Big O to see whether a candidate understands the cost tradeoffs of a solution, not just whether it produces the correct output.",
    code: "function hasDuplicate(arr) {\n  // O(n^2) time: nested loop compares every pair\n  for (let i = 0; i < arr.length; i++) {\n    for (let j = i + 1; j < arr.length; j++) {\n      if (arr[i] === arr[j]) return true;\n    }\n  }\n  return false;\n}\n\nfunction hasDuplicateFast(arr) {\n  // O(n) time, O(n) space: single pass with a Set\n  const seen = new Set();\n  for (const val of arr) {\n    if (seen.has(val)) return true;\n    seen.add(val);\n  }\n  return false;\n}",
    interviewQuestion:
      "What is the time complexity of your solution, and can you rewrite it to trade space for a faster runtime?",
  },
  {
    id: "csfundamentals-time-space-complexity",
    category: "csfundamentals",
    difficulty: "Basic",
    topic: "Complexity Analysis",
    title: "Time Complexity vs Space Complexity",
    summary:
      "Time complexity measures how runtime scales with input size; space complexity measures how much extra memory an algorithm needs beyond the input.",
    explanation:
      "Time complexity counts the number of basic operations performed as a function of input size n, while space complexity counts the extra (auxiliary) memory allocated, not including the input itself. There is often a tradeoff between the two: memoization in dynamic programming speeds up runtime by spending extra space to cache results, while an in-place sort like heapsort saves space at the cost of being harder to implement than an out-of-place merge sort. Recursive algorithms also have an implicit space cost from the call stack, which is easy to forget when reasoning about space complexity. A good interview answer states both complexities and explains the reasoning, not just the final Big O class.",
    code: "// Fibonacci: naive recursion vs memoized\nfunction fibNaive(n) {\n  // Time: O(2^n), Space: O(n) call stack\n  if (n <= 1) return n;\n  return fibNaive(n - 1) + fibNaive(n - 2);\n}\n\nfunction fibMemo(n, cache = {}) {\n  // Time: O(n), Space: O(n) for cache + call stack\n  if (n <= 1) return n;\n  if (cache[n] !== undefined) return cache[n];\n  cache[n] = fibMemo(n - 1, cache) + fibMemo(n - 2, cache);\n  return cache[n];\n}",
    interviewQuestion:
      "Your recursive solution is O(n) time but you're worried about stack depth on large inputs — how would you convert it to an iterative version to reduce space complexity?",
  },
  {
    id: "csfundamentals-arrays-dynamic-arrays",
    category: "csfundamentals",
    difficulty: "Basic",
    topic: "Data Structures",
    title: "Arrays vs Dynamic Arrays",
    summary:
      "A static array has a fixed size with O(1) indexed access, while a dynamic array (like JS arrays) resizes itself automatically as elements are added.",
    explanation:
      "A plain array allocates a fixed contiguous block of memory, giving O(1) random access via pointer arithmetic but requiring a full reallocation to grow. A dynamic array, such as a JavaScript array, Python list, or Java ArrayList, wraps a fixed-size backing array and, once full, allocates a new array (typically double the size) and copies all elements over. This doubling strategy gives amortized O(1) append time even though any single append that triggers a resize costs O(n). Insertion or deletion at the front or middle of either type is O(n) because all subsequent elements must shift.",
    code: "class DynamicArray {\n  constructor() {\n    this.capacity = 2;\n    this.length = 0;\n    this.data = new Array(this.capacity);\n  }\n  push(value) {\n    if (this.length === this.capacity) {\n      this.capacity *= 2; // amortized O(1) growth\n      const resized = new Array(this.capacity);\n      for (let i = 0; i < this.length; i++) resized[i] = this.data[i];\n      this.data = resized;\n    }\n    this.data[this.length] = value;\n    this.length++;\n  }\n}",
    interviewQuestion:
      "Why is appending to a dynamic array considered amortized O(1) even though resizing is O(n)?",
  },
  {
    id: "csfundamentals-linked-lists",
    category: "csfundamentals",
    difficulty: "Basic",
    topic: "Data Structures",
    title: "How do Linked Lists work?",
    summary:
      "A linked list stores elements as nodes, each pointing to the next, giving O(1) insertion/deletion at known positions but O(n) access by index.",
    explanation:
      "Unlike arrays, linked list nodes are not stored contiguously in memory; each node holds a value and a pointer (or two, for doubly linked lists) to neighboring nodes. This means inserting or removing a node only requires updating a few pointers, an O(1) operation once you have a reference to the location, but finding that location takes O(n) since there is no random access. Singly linked lists only traverse forward, while doubly linked lists add a previous pointer to allow backward traversal and O(1) removal given just a node reference. Linked lists are the backbone of implementations like LRU caches, adjacency lists for graphs, and the underlying structure of some queue and deque implementations.",
    code: "class ListNode {\n  constructor(val) {\n    this.val = val;\n    this.next = null;\n  }\n}\n\nfunction reverseList(head) {\n  let prev = null;\n  let curr = head;\n  while (curr !== null) {\n    const next = curr.next;\n    curr.next = prev;\n    prev = curr;\n    curr = next;\n  }\n  return prev; // new head\n}",
    interviewQuestion:
      "Can you reverse a singly linked list in place, and what is the time and space complexity of your approach?",
  },
  {
    id: "csfundamentals-stacks",
    category: "csfundamentals",
    difficulty: "Basic",
    topic: "Data Structures",
    title: "What is a Stack and when is it used?",
    summary:
      "A stack is a LIFO (last-in, first-out) structure supporting O(1) push and pop operations at one end.",
    explanation:
      "Stacks only expose two main operations, push and pop, both at the same end (the top), which makes them ideal for tracking nested or reversible state. Function call frames are managed on a call stack, which is why deep recursion causes a stack overflow. Stacks are also used to check balanced parentheses, implement undo/redo functionality, evaluate postfix expressions, and perform depth-first search iteratively. Because insertion and removal happen at the same end, no shifting of other elements is needed, keeping both operations O(1).",
    code: "function isBalanced(str) {\n  const stack = [];\n  const pairs = { ')': '(', ']': '[', '}': '{' };\n  for (const ch of str) {\n    if (ch === '(' || ch === '[' || ch === '{') {\n      stack.push(ch);\n    } else if (ch in pairs) {\n      if (stack.pop() !== pairs[ch]) return false;\n    }\n  }\n  return stack.length === 0;\n}",
    interviewQuestion:
      "How would you use a stack to check whether an expression has balanced parentheses, and what edge cases would you test?",
  },
  {
    id: "csfundamentals-queues",
    category: "csfundamentals",
    difficulty: "Basic",
    topic: "Data Structures",
    title: "What is a Queue and how does it differ from a Stack?",
    summary:
      "A queue is a FIFO (first-in, first-out) structure where elements are added at the rear and removed from the front.",
    explanation:
      "Unlike a stack's LIFO order, a queue processes elements in the order they arrived, which naturally models task scheduling, print queues, and breadth-first search. A naive array-backed queue has O(n) dequeue cost if you shift elements after removing from the front, so real implementations use a circular buffer or a linked list to get O(1) enqueue and dequeue. A deque (double-ended queue) generalizes this by allowing insertion and removal at both ends, and is often used to implement both stacks and queues, plus sliding window algorithms. Priority queues are a variant where elements are dequeued by priority rather than arrival order, typically backed by a heap.",
    code: "class Queue {\n  constructor() {\n    this.items = {};\n    this.head = 0;\n    this.tail = 0;\n  }\n  enqueue(val) {\n    this.items[this.tail] = val;\n    this.tail++;\n  }\n  dequeue() {\n    if (this.head === this.tail) return undefined;\n    const val = this.items[this.head];\n    delete this.items[this.head];\n    this.head++;\n    return val;\n  }\n}",
    interviewQuestion:
      "Why does using array.shift() to dequeue give O(n) performance, and how would you implement a queue with O(1) enqueue and dequeue?",
  },
  {
    id: "csfundamentals-hash-tables",
    category: "csfundamentals",
    difficulty: "Intermediate",
    topic: "Data Structures",
    title: "How do Hash Tables achieve O(1) lookup?",
    summary:
      "A hash table maps keys to array indices using a hash function, giving average O(1) insert, delete, and lookup at the cost of no ordering.",
    explanation:
      "A hash function converts a key into an integer index into a backing array; a good hash function distributes keys uniformly to minimize collisions. When two keys hash to the same index, collisions are resolved either via chaining, storing a linked list or small array at that index, or via open addressing, probing for the next free slot. Average-case operations are O(1), but a poorly distributed hash function or too many collisions degrades performance toward O(n) in the worst case, which is why load factor is tracked and the table is resized (rehashed) once it crosses a threshold. JavaScript objects and Maps, Python dicts, and Java HashMaps are all hash table implementations under the hood.",
    code: "class HashMap {\n  constructor(size = 16) {\n    this.buckets = Array.from({ length: size }, () => []);\n  }\n  hash(key) {\n    let sum = 0;\n    for (const ch of String(key)) sum += ch.charCodeAt(0);\n    return sum % this.buckets.length;\n  }\n  set(key, value) {\n    const bucket = this.buckets[this.hash(key)];\n    const existing = bucket.find((pair) => pair[0] === key);\n    if (existing) existing[1] = value;\n    else bucket.push([key, value]);\n  }\n  get(key) {\n    const bucket = this.buckets[this.hash(key)];\n    const pair = bucket.find((p) => p[0] === key);\n    return pair ? pair[1] : undefined;\n  }\n}",
    interviewQuestion:
      "What happens when two different keys hash to the same bucket, and how does chaining handle that collision?",
  },
  {
    id: "csfundamentals-binary-trees",
    category: "csfundamentals",
    difficulty: "Intermediate",
    topic: "Trees",
    title: "Binary Trees and Traversal Orders",
    summary:
      "A binary tree is a hierarchical structure where each node has at most two children, and it can be traversed in-order, pre-order, post-order, or level-order.",
    explanation:
      "Each node in a binary tree holds a value plus references to a left and right child, forming a recursive structure that is naturally processed with recursive algorithms. Pre-order (root, left, right) is useful for copying a tree, in-order (left, root, right) visits nodes in sorted order for a binary search tree, and post-order (left, right, root) is used when children must be processed before the parent, such as deleting a tree or evaluating an expression tree. Level-order traversal visits nodes breadth-first using a queue rather than recursion, layer by layer. Tree height directly determines the worst-case complexity of many operations, so balanced trees matter for keeping operations close to O(log n).",
    code: "class TreeNode {\n  constructor(val, left = null, right = null) {\n    this.val = val;\n    this.left = left;\n    this.right = right;\n  }\n}\n\nfunction inOrder(node, result = []) {\n  if (!node) return result;\n  inOrder(node.left, result);\n  result.push(node.val);\n  inOrder(node.right, result);\n  return result;\n}",
    interviewQuestion:
      "How would you traverse a binary tree level by level (breadth-first) instead of using recursion, and why does that require a queue instead of a stack?",
  },
  {
    id: "csfundamentals-binary-search-trees",
    category: "csfundamentals",
    difficulty: "Intermediate",
    topic: "Trees",
    title: "How does a Binary Search Tree maintain order?",
    summary:
      "A BST keeps every left subtree smaller and every right subtree larger than its root, enabling O(log n) search, insert, and delete when balanced.",
    explanation:
      "The BST invariant, left child less than parent, right child greater than parent, applied recursively, means an in-order traversal always yields values in sorted order. Search, insertion, and deletion all follow the same pattern of comparing against the current node and recursing left or right, which costs O(h) where h is the tree's height. In a balanced tree, h is O(log n), but in the worst case, such as inserting already-sorted data into a plain BST, the tree degenerates into a linked list with O(n) height. This is why self-balancing variants like AVL trees and red-black trees exist, rebalancing after every insert or delete to guarantee O(log n) height.",
    code: "function insert(node, val) {\n  if (!node) return { val, left: null, right: null };\n  if (val < node.val) node.left = insert(node.left, val);\n  else if (val > node.val) node.right = insert(node.right, val);\n  return node;\n}\n\nfunction search(node, target) {\n  if (!node) return false;\n  if (node.val === target) return true;\n  return target < node.val\n    ? search(node.left, target)\n    : search(node.right, target);\n}",
    interviewQuestion:
      "What input causes a binary search tree to degrade to O(n) operations, and how do self-balancing trees like AVL or red-black trees prevent that?",
  },
  {
    id: "csfundamentals-heaps-priority-queues",
    category: "csfundamentals",
    difficulty: "Intermediate",
    topic: "Trees",
    title: "Heaps and Priority Queues",
    summary:
      "A heap is a complete binary tree stored as an array where every parent is smaller (min-heap) or larger (max-heap) than its children, giving O(log n) insert and O(1) peek.",
    explanation:
      "Because a heap is a complete binary tree, it can be stored compactly in an array with no pointers: for index i, children live at 2i+1 and 2i+2, and the parent lives at floor((i-1)/2). Inserting a value appends it to the end and bubbles it up (sift-up) until the heap property is restored, while removing the root swaps it with the last element, removes it, then sifts down, both O(log n). A priority queue is the abstract data type that a heap efficiently implements, always giving O(1) access to the minimum or maximum element. Heaps power algorithms like Dijkstra's shortest path, heapsort, and the classic top-K elements interview problem.",
    code: "class MinHeap {\n  constructor() { this.heap = []; }\n  push(val) {\n    this.heap.push(val);\n    let i = this.heap.length - 1;\n    while (i > 0) {\n      const parent = Math.floor((i - 1) / 2);\n      if (this.heap[parent] <= this.heap[i]) break;\n      [this.heap[parent], this.heap[i]] = [this.heap[i], this.heap[parent]];\n      i = parent;\n    }\n  }\n  peek() { return this.heap[0]; }\n}",
    interviewQuestion:
      "How would you find the k largest elements in an array efficiently using a heap, and what is the resulting time complexity?",
  },
  {
    id: "csfundamentals-graphs-fundamentals",
    category: "csfundamentals",
    difficulty: "Intermediate",
    topic: "Graphs",
    title: "Graph Representations: Adjacency List vs Matrix",
    summary:
      "Graphs model nodes and connections; adjacency lists are space-efficient for sparse graphs while adjacency matrices give O(1) edge lookup for dense graphs.",
    explanation:
      "An adjacency list stores, for each node, a list of its neighbors, using O(V + E) space, which is efficient when the graph is sparse (few edges relative to nodes). An adjacency matrix uses a V by V grid where cell [i][j] indicates whether an edge exists, costing O(V^2) space but giving O(1) edge existence checks, which is preferable for dense graphs or when edge lookups dominate. Graphs can be directed or undirected, and weighted or unweighted, which changes how algorithms like shortest path are implemented. Trees, linked lists, and even the DOM are all special cases of graphs with additional constraints, like no cycles.",
    code: "// Adjacency list (sparse, space-efficient)\nconst graph = {\n  A: ['B', 'C'],\n  B: ['A', 'D'],\n  C: ['A'],\n  D: ['B'],\n};\n\n// Adjacency matrix (dense, O(1) edge lookup)\nconst nodes = ['A', 'B', 'C', 'D'];\nconst matrix = [\n  [0, 1, 1, 0],\n  [1, 0, 0, 1],\n  [1, 0, 0, 0],\n  [0, 1, 0, 0],\n];",
    interviewQuestion:
      "Given a graph with a million nodes but very few edges per node, would you choose an adjacency list or matrix, and why?",
  },
  {
    id: "csfundamentals-graph-traversal-bfs-dfs",
    category: "csfundamentals",
    difficulty: "Intermediate",
    topic: "Graphs",
    title: "Graph Traversal: BFS vs DFS",
    summary:
      "BFS explores level by level using a queue and finds shortest paths in unweighted graphs; DFS explores as deep as possible using a stack or recursion.",
    explanation:
      "Breadth-first search visits all neighbors at the current depth before moving deeper, using a queue and a visited set to avoid revisiting nodes, which makes it the correct choice for finding the shortest path in an unweighted graph. Depth-first search follows one branch as far as it can go before backtracking, implemented with either explicit recursion (using the call stack) or an explicit stack, and is well suited for problems like detecting cycles, topological sorting, or exploring all paths. Both traversals run in O(V + E) time since each node and edge is visited a constant number of times. The choice between them often comes down to what the problem asks: shortest path or level information favors BFS, while exhaustive exploration or backtracking favors DFS.",
    code: "function bfs(graph, start) {\n  const visited = new Set([start]);\n  const queue = [start];\n  const order = [];\n  while (queue.length) {\n    const node = queue.shift();\n    order.push(node);\n    for (const neighbor of graph[node]) {\n      if (!visited.has(neighbor)) {\n        visited.add(neighbor);\n        queue.push(neighbor);\n      }\n    }\n  }\n  return order;\n}",
    interviewQuestion:
      "Why does BFS guarantee the shortest path in an unweighted graph while DFS does not, and how would you reconstruct that path?",
  },
  {
    id: "csfundamentals-sorting-algorithms-overview",
    category: "csfundamentals",
    difficulty: "Intermediate",
    topic: "Algorithms",
    title: "Comparing Sorting Algorithms",
    summary:
      "Different sorting algorithms trade off time complexity, space complexity, and stability, making the best choice dependent on data size and constraints.",
    explanation:
      "Simple comparison sorts like bubble, insertion, and selection sort run in O(n^2) but insertion sort is efficient on nearly-sorted data. Merge sort guarantees O(n log n) time and is stable, but needs O(n) auxiliary space, while quicksort is typically faster in practice with O(n log n) average time and O(log n) space, but degrades to O(n^2) on adversarial input without good pivot selection, and is not stable. Heapsort guarantees O(n log n) time with O(1) extra space but is not stable and has poor cache locality. Non-comparison sorts like counting sort and radix sort can achieve O(n + k) time when the data has bounded range, beating the O(n log n) lower bound that applies to comparison-based sorts.",
    code: "function quickSort(arr) {\n  if (arr.length <= 1) return arr;\n  const pivot = arr[Math.floor(arr.length / 2)];\n  const left = arr.filter((x) => x < pivot);\n  const mid = arr.filter((x) => x === pivot);\n  const right = arr.filter((x) => x > pivot);\n  return [...quickSort(left), ...mid, ...quickSort(right)];\n}",
    interviewQuestion:
      "When would you prefer merge sort over quicksort even though quicksort is often faster in practice?",
  },
  {
    id: "csfundamentals-searching-algorithms",
    category: "csfundamentals",
    difficulty: "Basic",
    topic: "Algorithms",
    title: "Linear Search vs Binary Search",
    summary:
      "Linear search checks every element in O(n) time and works on unsorted data, while binary search halves the search space each step in O(log n) but requires sorted data.",
    explanation:
      "Linear search simply scans from the start until it finds a match or reaches the end, making no assumptions about ordering, so it works on any collection but scales poorly. Binary search exploits sorted order by comparing the target to the middle element and discarding half the remaining search space each iteration, giving O(log n) time, but it requires random access (an array, not a linked list) and the data must already be sorted. Binary search variants can also find the first or last occurrence of a value, or the insertion point for a value not present, by adjusting how the search boundaries move on a tie. A common interview trap is off-by-one errors in the boundary updates, so writing a clean invariant, such as 'search within [low, high] inclusive', helps avoid bugs.",
    code: "function binarySearch(arr, target) {\n  let low = 0;\n  let high = arr.length - 1;\n  while (low <= high) {\n    const mid = Math.floor((low + high) / 2);\n    if (arr[mid] === target) return mid;\n    if (arr[mid] < target) low = mid + 1;\n    else high = mid - 1;\n  }\n  return -1;\n}",
    interviewQuestion:
      "How would you modify binary search to find the first occurrence of a target value in a sorted array with duplicates?",
  },
  {
    id: "csfundamentals-recursion-fundamentals",
    category: "csfundamentals",
    difficulty: "Basic",
    topic: "Algorithms",
    title: "How does Recursion Work?",
    summary:
      "Recursion solves a problem by having a function call itself on smaller subproblems until it reaches a base case that stops the recursion.",
    explanation:
      "Every correct recursive function needs a base case that terminates the recursion and a recursive case that reduces the problem toward that base case; without both, you get infinite recursion and a stack overflow. Each call adds a new frame to the call stack holding its local variables and return address, so recursion has an implicit O(depth) space cost that iterative solutions avoid. Some languages optimize tail-recursive calls (where the recursive call is the last operation) into a loop via tail call optimization, but JavaScript engines generally do not guarantee this despite it being in the ES6 spec. Recursion shines for naturally recursive structures like trees and graphs, and for divide-and-conquer algorithms, but deeply recursive solutions on large flat inputs (like a huge array) can be safer as loops.",
    code: "function factorial(n) {\n  if (n <= 1) return 1; // base case\n  return n * factorial(n - 1); // recursive case\n}\n\n// Same logic, iterative, avoids stack growth\nfunction factorialIter(n) {\n  let result = 1;\n  for (let i = 2; i <= n; i++) result *= i;\n  return result;\n}",
    interviewQuestion:
      "What is the base case and recursive case in your solution, and what happens if the base case is missing or unreachable?",
  },
  {
    id: "csfundamentals-dynamic-programming-basics",
    category: "csfundamentals",
    difficulty: "Advanced",
    topic: "Algorithms",
    title: "Dynamic Programming: Memoization vs Tabulation",
    summary:
      "Dynamic programming solves problems with overlapping subproblems and optimal substructure by caching results, either top-down (memoization) or bottom-up (tabulation).",
    explanation:
      "A problem is a DP candidate when it has overlapping subproblems, meaning the same subproblem is solved repeatedly, and optimal substructure, meaning the optimal solution can be built from optimal solutions to subproblems. Memoization is a top-down approach: write the natural recursive solution, then cache each subproblem's result the first time it is computed so future calls with the same input return instantly. Tabulation is a bottom-up approach: build a table iteratively starting from the smallest subproblems up to the final answer, which avoids recursion overhead and stack depth issues entirely. Memoization is often easier to derive from a brute-force recursive solution, while tabulation is usually more space-optimizable, since you can often discard old rows once they're no longer needed.",
    code: "// Coin change: fewest coins to make amount, bottom-up DP\nfunction coinChange(coins, amount) {\n  const dp = new Array(amount + 1).fill(Infinity);\n  dp[0] = 0;\n  for (let a = 1; a <= amount; a++) {\n    for (const coin of coins) {\n      if (coin <= a) dp[a] = Math.min(dp[a], dp[a - coin] + 1);\n    }\n  }\n  return dp[amount] === Infinity ? -1 : dp[amount];\n}",
    interviewQuestion:
      "How would you identify that a problem can be solved with dynamic programming, and how would you go from a brute-force recursive solution to a memoized one?",
  },
  {
    id: "csfundamentals-greedy-algorithms",
    category: "csfundamentals",
    difficulty: "Intermediate",
    topic: "Algorithms",
    title: "What makes an Algorithm Greedy?",
    summary:
      "A greedy algorithm builds a solution by always making the locally optimal choice at each step, which only produces a globally optimal result for problems with the greedy-choice property.",
    explanation:
      "Greedy algorithms never reconsider previous choices, which makes them fast, often O(n log n) after sorting, but they only guarantee correctness when the problem exhibits both the greedy-choice property (a locally optimal choice leads to a globally optimal solution) and optimal substructure. Classic correct examples include Dijkstra's shortest path (on non-negative weights), Kruskal's and Prim's minimum spanning tree algorithms, and the activity/interval scheduling problem of picking the maximum number of non-overlapping intervals. A classic counterexample is the coin change problem with arbitrary denominations, where greedily picking the largest coin can fail, unlike dynamic programming which explores all options. Proving a greedy algorithm correct usually requires an exchange argument showing that any optimal solution can be transformed into the greedy solution without making it worse.",
    code: "// Activity selection: max number of non-overlapping intervals\nfunction maxActivities(intervals) {\n  intervals.sort((a, b) => a[1] - b[1]); // sort by end time\n  let count = 0;\n  let lastEnd = -Infinity;\n  for (const [start, end] of intervals) {\n    if (start >= lastEnd) {\n      count++;\n      lastEnd = end;\n    }\n  }\n  return count;\n}",
    interviewQuestion:
      "Can you give an example where a greedy approach fails to find the optimal solution, and explain why dynamic programming would succeed there instead?",
  },
  {
    id: "csfundamentals-divide-and-conquer",
    category: "csfundamentals",
    difficulty: "Intermediate",
    topic: "Algorithms",
    title: "Divide and Conquer Strategy",
    summary:
      "Divide and conquer breaks a problem into independent subproblems, solves each recursively, then combines their results into the final answer.",
    explanation:
      "The three steps are divide (split the input into smaller pieces), conquer (recursively solve each piece, with a base case for the smallest size), and combine (merge the subproblem results into the overall solution). Merge sort divides the array in half, recursively sorts each half, then merges the two sorted halves in linear time; quicksort divides via a pivot and mostly does its work during the divide step rather than the combine step. The Master Theorem gives a formula for the time complexity of divide-and-conquer recurrences of the form T(n) = a*T(n/b) + f(n), which is how you derive that merge sort is O(n log n). Divide and conquer differs from dynamic programming in that its subproblems are typically independent and non-overlapping, so there's no need to cache results.",
    code: "function mergeSort(arr) {\n  if (arr.length <= 1) return arr;\n  const mid = Math.floor(arr.length / 2);\n  const left = mergeSort(arr.slice(0, mid));\n  const right = mergeSort(arr.slice(mid));\n  const result = [];\n  let i = 0, j = 0;\n  while (i < left.length && j < right.length) {\n    result.push(left[i] <= right[j] ? left[i++] : right[j++]);\n  }\n  return [...result, ...left.slice(i), ...right.slice(j)];\n}",
    interviewQuestion:
      "How does the Master Theorem help you derive that merge sort runs in O(n log n), and how would the recurrence change for a 3-way merge sort?",
  },
  {
    id: "csfundamentals-trie-data-structure",
    category: "csfundamentals",
    difficulty: "Advanced",
    topic: "Data Structures",
    title: "What is a Trie and when should you use one?",
    summary:
      "A trie (prefix tree) stores strings character by character in a tree, enabling fast prefix search and autocomplete in O(L) time where L is the string length.",
    explanation:
      "Each node in a trie represents a character and holds children for possible next characters, plus a flag marking whether a complete word ends at that node. Searching for a word or checking a prefix only takes O(L) time, independent of how many words are stored, because you just walk down L levels of the tree following matching characters. This makes tries ideal for autocomplete, spell checkers, and IP routing tables, beating a hash set when you need prefix queries since a hash set can only do exact-match lookups in O(1). The tradeoff is memory: a trie can use significantly more space than a hash set because of the per-character node overhead, though this can be mitigated with a compressed trie (radix tree).",
    code: "class TrieNode {\n  constructor() {\n    this.children = {};\n    this.isEnd = false;\n  }\n}\n\nclass Trie {\n  constructor() { this.root = new TrieNode(); }\n  insert(word) {\n    let node = this.root;\n    for (const ch of word) {\n      if (!node.children[ch]) node.children[ch] = new TrieNode();\n      node = node.children[ch];\n    }\n    node.isEnd = true;\n  }\n  startsWith(prefix) {\n    let node = this.root;\n    for (const ch of prefix) {\n      if (!node.children[ch]) return false;\n      node = node.children[ch];\n    }\n    return true;\n  }\n}",
    interviewQuestion:
      "Why is a trie better suited than a hash set for implementing autocomplete, and what is the time complexity of a prefix search?",
  },
  {
    id: "csfundamentals-union-find-disjoint-set",
    category: "csfundamentals",
    difficulty: "Advanced",
    topic: "Data Structures",
    title: "Union-Find (Disjoint Set Union)",
    summary:
      "Union-Find tracks a collection of disjoint sets, supporting near O(1) union and find operations using path compression and union by rank.",
    explanation:
      "Each element starts in its own set, represented as a tree where each node points to a parent, and the root of the tree is the set's representative. The find operation walks up parent pointers to the root, while union merges two sets by attaching one root under the other. Two optimizations make this nearly constant time in practice: path compression, which flattens the tree during find by pointing every visited node directly to the root, and union by rank/size, which always attaches the smaller tree under the larger one to keep trees shallow. Combined, these give an amortized time complexity of O(alpha(n)) per operation, where alpha is the inverse Ackermann function, effectively constant for any realistic input size. Union-Find is the standard tool for Kruskal's minimum spanning tree algorithm and for detecting cycles in an undirected graph.",
    code: "class UnionFind {\n  constructor(n) {\n    this.parent = Array.from({ length: n }, (_, i) => i);\n    this.rank = new Array(n).fill(0);\n  }\n  find(x) {\n    if (this.parent[x] !== x) this.parent[x] = this.find(this.parent[x]); // path compression\n    return this.parent[x];\n  }\n  union(a, b) {\n    const rootA = this.find(a);\n    const rootB = this.find(b);\n    if (rootA === rootB) return;\n    if (this.rank[rootA] < this.rank[rootB]) this.parent[rootA] = rootB;\n    else if (this.rank[rootA] > this.rank[rootB]) this.parent[rootB] = rootA;\n    else { this.parent[rootB] = rootA; this.rank[rootA]++; }\n  }\n}",
    interviewQuestion:
      "How would you use Union-Find to detect whether adding an edge creates a cycle in an undirected graph, and why is path compression important?",
  },
  {
    id: "csfundamentals-sliding-window-technique",
    category: "csfundamentals",
    difficulty: "Intermediate",
    topic: "Techniques",
    title: "Sliding Window Technique",
    summary:
      "Sliding window maintains a subrange of a sequence and expands or shrinks it incrementally, avoiding the O(n^2) or worse cost of recomputing from scratch for every subarray.",
    explanation:
      "Instead of recomputing a sum, count, or condition for every possible subarray or substring, sliding window keeps a running window defined by two pointers and updates its state incrementally as the window's edges move, turning many O(n^2) brute-force problems into O(n). A fixed-size window slides both pointers together by one each step, useful for problems like the maximum sum of any k consecutive elements. A variable-size window grows the right pointer to include more elements and shrinks the left pointer when a constraint is violated, useful for problems like the longest substring without repeating characters. The key insight is that expanding or shrinking the window only requires updating the state for the one element entering or leaving, not recomputing over the whole window.",
    code: "function longestUniqueSubstring(s) {\n  const seen = new Map();\n  let left = 0;\n  let maxLen = 0;\n  for (let right = 0; right < s.length; right++) {\n    const ch = s[right];\n    if (seen.has(ch) && seen.get(ch) >= left) {\n      left = seen.get(ch) + 1; // shrink window past the duplicate\n    }\n    seen.set(ch, right);\n    maxLen = Math.max(maxLen, right - left + 1);\n  }\n  return maxLen;\n}",
    interviewQuestion:
      "How would you find the length of the longest substring without repeating characters in O(n) time using sliding window?",
  },
  {
    id: "csfundamentals-two-pointer-technique",
    category: "csfundamentals",
    difficulty: "Basic",
    topic: "Techniques",
    title: "Two Pointer Technique",
    summary:
      "Two pointer uses two indices moving through a sorted or structured sequence to solve problems in O(n) time instead of O(n^2) nested loops.",
    explanation:
      "The classic setup places one pointer at the start and one at the end of a sorted array, moving them toward each other based on a comparison, such as in the two-sum-sorted or container-with-most-water problems. Another variant moves both pointers in the same direction at different speeds, like the fast and slow pointer technique used to detect a cycle in a linked list (Floyd's algorithm) or to find the middle of a list in one pass. The technique works because sorted order (or a similar monotonic property) lets you eliminate a large portion of the search space with each comparison, rather than checking every pair. It's a space-efficient alternative to using a hash set when the input can be sorted or is already ordered.",
    code: "function twoSumSorted(arr, target) {\n  let left = 0;\n  let right = arr.length - 1;\n  while (left < right) {\n    const sum = arr[left] + arr[right];\n    if (sum === target) return [left, right];\n    if (sum < target) left++;\n    else right--;\n  }\n  return [-1, -1];\n}",
    interviewQuestion:
      "How does Floyd's cycle detection algorithm use two pointers moving at different speeds to detect a cycle in a linked list?",
  },
  {
    id: "csfundamentals-backtracking",
    category: "csfundamentals",
    difficulty: "Advanced",
    topic: "Algorithms",
    title: "How does Backtracking work?",
    summary:
      "Backtracking explores all candidate solutions incrementally, abandoning (pruning) a path as soon as it can't lead to a valid solution, then undoing the last choice and trying another.",
    explanation:
      "Backtracking builds a solution piece by piece using recursion, and after each recursive call returns, it undoes (backtracks) the choice it made so the next candidate can be tried cleanly, which is the key difference from plain brute-force recursion. Pruning is what makes backtracking practical: as soon as a partial solution violates a constraint, the algorithm abandons that branch immediately rather than continuing to build on top of it, which can turn an exponential search into something tractable in practice. Classic backtracking problems include N-Queens, generating permutations or combinations, Sudoku solvers, and subset-sum style problems. The time complexity is usually exponential in the worst case, but effective pruning (constraint propagation) dramatically reduces the explored search space compared to trying every possibility blindly.",
    code: "function permute(nums) {\n  const result = [];\n  function backtrack(path, remaining) {\n    if (remaining.length === 0) {\n      result.push([...path]);\n      return;\n    }\n    for (let i = 0; i < remaining.length; i++) {\n      path.push(remaining[i]);\n      const rest = remaining.slice(0, i).concat(remaining.slice(i + 1));\n      backtrack(path, rest);\n      path.pop(); // undo choice\n    }\n  }\n  backtrack([], nums);\n  return result;\n}",
    interviewQuestion:
      "In the N-Queens problem, how would you prune invalid branches early instead of generating every full board and checking it afterward?",
  },
  {
    id: "csfundamentals-bit-manipulation-basics",
    category: "csfundamentals",
    difficulty: "Intermediate",
    topic: "Techniques",
    title: "Bit Manipulation Basics",
    summary:
      "Bit manipulation uses operators like AND, OR, XOR, NOT, and shifts to solve problems with O(1) space and very fast constant-time operations.",
    explanation:
      "AND (&) is used to check or clear specific bits, OR (|) to set bits, XOR (^) to toggle bits or find a difference (a value XORed with itself is 0, which is why XOR finds the single non-duplicate number in an array), and NOT (~) to flip all bits. Left shift (<<) multiplies by powers of two and right shift (>>) divides by powers of two, both much faster than actual multiplication/division on some hardware. A common trick, n & (n - 1), clears the lowest set bit, which is used to count set bits (Hamming weight) or check if a number is a power of two (a power of two has exactly one set bit, so n & (n - 1) === 0). Bit manipulation is popular in interviews for problems involving flags, sets of booleans packed into an integer, or finding unique/missing numbers in O(1) extra space.",
    code: "function singleNumber(nums) {\n  // XOR cancels out pairs, leaving the number that appears once\n  return nums.reduce((acc, n) => acc ^ n, 0);\n}\n\nfunction isPowerOfTwo(n) {\n  return n > 0 && (n & (n - 1)) === 0;\n}\n\nfunction countSetBits(n) {\n  let count = 0;\n  while (n) {\n    n &= (n - 1); // clears lowest set bit\n    count++;\n  }\n  return count;\n}",
    interviewQuestion:
      "Every number in an array appears twice except one — how would you find that number in O(n) time and O(1) space using bit manipulation?",
  },
  {
    id: "csfundamentals-memory-stack-vs-heap",
    category: "csfundamentals",
    difficulty: "Intermediate",
    topic: "Systems",
    title: "Memory: Stack vs Heap",
    summary:
      "The stack stores fixed-size, short-lived data like function frames and primitives with automatic cleanup, while the heap stores dynamically allocated data that persists until explicitly freed or garbage collected.",
    explanation:
      "The call stack grows and shrinks automatically as functions are called and return, storing local variables, primitives, and return addresses, and its size is fixed at thread creation, which is why deep recursion causes a stack overflow. The heap is a much larger pool of memory used for objects and data whose size or lifetime isn't known at compile time, allocated on demand and either manually freed (in languages like C) or reclaimed automatically by a garbage collector (in JavaScript, Java, Python). Stack allocation is extremely fast, just moving a pointer, while heap allocation is slower because the allocator must find a suitably sized free block and track it for later cleanup. In JavaScript specifically, primitives (numbers, strings, booleans) are typically handled on the stack while objects, arrays, and functions live on the heap with the variable holding a reference to that heap location.",
    code: "function stackExample() {\n  let x = 5; // primitive, stack\n  let y = x; // copied by value\n  y = 10;\n  console.log(x); // 5, unaffected\n}\n\nfunction heapExample() {\n  let obj1 = { count: 5 }; // object, heap\n  let obj2 = obj1; // reference copied\n  obj2.count = 10;\n  console.log(obj1.count); // 10, same object mutated\n}",
    interviewQuestion:
      "Why does mutating an object through one variable affect another variable pointing to the same object, but reassigning a primitive does not?",
  },
  {
    id: "csfundamentals-compilers-vs-interpreters",
    category: "csfundamentals",
    difficulty: "Intermediate",
    topic: "Systems",
    title: "Compilers vs Interpreters",
    summary:
      "A compiler translates entire source code into machine code (or bytecode) ahead of time before execution, while an interpreter executes source code directly, line by line, at runtime.",
    explanation:
      "Compiled languages like C and Rust are translated fully into native machine code before the program runs, giving very fast execution but requiring a separate build step and platform-specific binaries. Interpreted languages like plain Python or Ruby read and execute source code line by line at runtime without a separate build step, which is more flexible but generally slower since translation overhead happens during execution. Most modern languages blur this line: Java compiles to portable bytecode which the JVM then interprets or JIT-compiles, and JavaScript engines like V8 parse to bytecode and use a Just-In-Time (JIT) compiler that identifies 'hot' frequently executed code and compiles it down to optimized machine code on the fly. This hybrid approach gives interpreted-language flexibility (no separate build step for the developer) with much of compiled-language performance for the code paths that matter most.",
    code: "// Conceptual difference:\n\n// Compiled (C-like): full translation ahead of time\n// source.c -> [compiler] -> source.exe -> run directly on CPU\n\n// Interpreted (classic): translated and executed line by line\n// source.py -> [interpreter reads line, executes, reads next line...]\n\n// JIT (V8/JavaScript): hybrid\n// source.js -> [parser] -> bytecode -> interpreter runs it\n//                                    -> profiler flags hot functions\n//                                    -> [JIT compiler] -> optimized machine code",
    interviewQuestion:
      "How does a JIT compiler like V8 combine the benefits of interpretation and compilation, and what happens when a JIT's optimistic optimization assumption turns out to be wrong (deoptimization)?",
  },
  {
    id: "csfundamentals-os-basics-processes-threads",
    category: "csfundamentals",
    difficulty: "Intermediate",
    topic: "Systems",
    title: "Operating System Basics: Processes vs Threads",
    summary:
      "A process is an independent running program with its own memory space, while threads are lightweight units of execution within a process that share that same memory space.",
    explanation:
      "Each process gets its own isolated virtual address space, file handles, and resources managed by the OS, so a crash in one process generally can't corrupt another process's memory, but this isolation makes inter-process communication (IPC) relatively expensive, requiring mechanisms like pipes, sockets, or shared memory. Threads within the same process share that process's memory and resources, making context switching between threads and communication between them much cheaper than between processes, but this shared state also means one thread's bug (like corrupting shared data) can crash the whole process. The OS scheduler decides which process or thread runs on the CPU at any moment, giving the illusion of many things happening simultaneously even on a single core through fast context switching. Node.js famously runs JavaScript on a single thread but achieves concurrency for I/O through an event loop plus a background thread pool (libuv) for tasks like file system access.",
    code: "// Conceptual: process isolation vs thread sharing\n\n// Process A                     Process B\n// [Memory: heap, stack]         [Memory: heap, stack] (isolated)\n//   Thread 1 --\\\n//   Thread 2 ---> share the SAME heap/stack space within Process A\n//   Thread 3 --/\n\n// Node.js: single JS thread + libuv thread pool for I/O\nconst fs = require('fs');\nfs.readFile('data.txt', () => {\n  console.log('Handled off the main thread by libuv, callback runs on main thread');\n});",
    interviewQuestion:
      "Why is spawning a new thread generally cheaper than spawning a new process, and what is the tradeoff in terms of safety?",
  },
  {
    id: "csfundamentals-concurrency-vs-parallelism",
    category: "csfundamentals",
    difficulty: "Advanced",
    topic: "Systems",
    title: "Concurrency vs Parallelism",
    summary:
      "Concurrency is about structuring a program to deal with multiple tasks making progress over overlapping time periods; parallelism is about literally executing multiple tasks at the exact same instant on multiple cores.",
    explanation:
      "Concurrency is a design property: a single CPU core can be 'concurrent' by rapidly switching between tasks (time-slicing), giving the illusion that they progress together even though only one instruction executes at a time. Parallelism requires actual multiple execution units, like multiple CPU cores or machines, physically running computations at the same instant, so parallelism is a subset of concurrent execution but not the other way around. JavaScript's single-threaded event loop achieves concurrency for I/O-bound work (network requests, timers) without parallelism, since only one piece of JS code runs at a time, whereas Web Workers or Node's worker_threads/cluster module provide true parallelism by running code on separate OS threads or processes. A useful mental model: concurrency is about dealing with lots of things at once (structure), while parallelism is about doing lots of things at once (execution).",
    code: "// Concurrency without parallelism: single-threaded event loop\nconsole.log('start');\nsetTimeout(() => console.log('timer done'), 0);\nPromise.resolve().then(() => console.log('microtask'));\nconsole.log('end');\n// Order: start, end, microtask, timer done — all on ONE thread\n\n// True parallelism: separate threads doing CPU work simultaneously\nconst { Worker } = require('worker_threads');\nnew Worker('./cpuHeavyTask.js'); // runs on a different OS thread, truly concurrent execution",
    interviewQuestion:
      "Can a single-core CPU achieve concurrency? Can it achieve parallelism? Explain the distinction with a concrete example.",
  },
  {
    id: "csfundamentals-deadlocks-in-os",
    category: "csfundamentals",
    difficulty: "Tricky",
    topic: "Systems",
    title: "What causes a Deadlock and how do you prevent one?",
    summary:
      "A deadlock happens when two or more processes/threads each hold a resource the other needs and wait forever, with none able to proceed.",
    explanation:
      "A deadlock requires four conditions to hold simultaneously, known as the Coffman conditions: mutual exclusion (resources can't be shared), hold and wait (a process holds one resource while waiting for another), no preemption (resources can't be forcibly taken away), and circular wait (a cycle of processes each waiting on the next). Breaking any single one of these conditions prevents deadlock, which is why common solutions include always acquiring locks in a fixed global order (eliminates circular wait), using lock timeouts so a thread gives up and retries instead of waiting forever (relaxes hold and wait), or using a resource allocation graph / Banker's Algorithm to only grant requests that keep the system in a safe state. In practice, most real-world systems avoid deadlock through careful lock ordering conventions and by keeping critical sections small, rather than through formal deadlock-avoidance algorithms, since those add significant runtime overhead.",
    code: "// Classic deadlock: two threads acquire locks in opposite order\n// Thread 1:                    Thread 2:\n// lock(A);                     lock(B);\n// lock(B); // waits for B      lock(A); // waits for A  -> deadlock\n\n// Fix: always acquire locks in the same global order\nfunction transfer(accountA, accountB, amount) {\n  const [first, second] = accountA.id < accountB.id\n    ? [accountA, accountB]\n    : [accountB, accountA];\n  lock(first);\n  lock(second);\n  // ... perform transfer safely, no circular wait possible\n  unlock(second);\n  unlock(first);\n}",
    interviewQuestion:
      "What are the four necessary conditions for a deadlock to occur, and which one does enforcing a global lock ordering break?",
  },
  {
    id: "csfundamentals-networking-osi-model",
    category: "csfundamentals",
    difficulty: "Basic",
    topic: "Systems",
    title: "Computer Networking Basics: The OSI Model",
    summary:
      "The OSI model breaks network communication into 7 layers, from physical signals up to application data, standardizing how each layer's protocols interact with the ones above and below it.",
    explanation:
      "From bottom to top: Physical (raw bits over a medium like cables or radio), Data Link (frames between directly connected devices, e.g. Ethernet, MAC addresses), Network (routing packets across networks using IP addresses), Transport (end-to-end delivery guarantees via TCP or UDP, including ports), Session (managing connections/sessions between applications), Presentation (data formatting, encryption, compression, e.g. TLS conceptually sits here), and Application (the protocols apps actually use, like HTTP, DNS, FTP). In practice, the real-world TCP/IP model collapses this into four layers (Link, Internet, Transport, Application) and most engineers reason in those terms, but the OSI model remains a useful shared vocabulary for describing exactly where in the stack a problem or protocol lives. For example, a switch operates at Layer 2, a router at Layer 3, and a load balancer might operate at Layer 4 (routing by IP/port) or Layer 7 (routing by HTTP headers/path).",
    code: "// OSI layers, top to bottom, with a familiar example at each\n// 7. Application  - HTTP request: GET /api/users\n// 6. Presentation  - TLS encryption/decryption of that request\n// 5. Session       - maintaining the TCP session/connection state\n// 4. Transport     - TCP segments, port 443, reliable delivery\n// 3. Network       - IP packets routed via router hops (IP addresses)\n// 2. Data Link     - Ethernet frames between adjacent devices (MAC)\n// 1. Physical      - electrical/optical/radio signals on the wire",
    interviewQuestion:
      "At which OSI layer does a Layer 7 load balancer operate compared to a Layer 4 load balancer, and what routing decisions can each make that the other cannot?",
  },
];
