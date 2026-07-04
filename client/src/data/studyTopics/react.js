// 79 react topics for Study Hub.
export default [
  {
    id: "react-jsx",
    category: "react",
    topic: "Core",
    title: "JSX",
    difficulty: "Basic",
    summary: "Syntactic sugar over React.createElement",
    explanation:
      "No — new JSX transform auto-imports jsx runtime. But still import React to use React.useState etc.",
    code: "// New JSX transform (React 17+)\nconst el = <div className='box'>Hello</div>;\n// Compiles to:\nimport { jsx as _jsx } from 'react/jsx-runtime';\nconst el = _jsx('div', { className: 'box', children: 'Hello' });",
    interviewQuestion: "Do you still need to import React in React 17+?",
  },
  {
    id: "react-usestate",
    category: "react",
    topic: "Hooks",
    title: "useState",
    difficulty: "Basic",
    summary: "Mutable state in function components",
    explanation:
      "Replaces. Use functional update with spread for objects: setState(prev => ({...prev, field: val})).",
    code: "const [user, setUser] = useState({ name: '', age: 0 });\n// WRONG -- loses age\nsetUser({ name: 'Alice' });\n// CORRECT\nsetUser(prev => ({ ...prev, name: 'Alice' }));\n// Lazy init for expensive default\nconst [data, setData] = useState(() => JSON.parse(localStorage.getItem('data') ?? 'null'));",
    interviewQuestion: "Does setState merge or replace state?",
  },
  {
    id: "react-useeffect",
    category: "react",
    topic: "Hooks",
    title: "useEffect",
    difficulty: "Intermediate",
    summary: "Run side effects after render",
    explanation:
      "All values from component scope used inside useEffect must be in deps. Omitting causes stale closures. ESLint exhaustive-deps enforces this.",
    code: "// Mount only\nuseEffect(() => { subscribe(); return () => unsubscribe(); }, []);\n// On userId change\nuseEffect(() => { fetchUser(userId); }, [userId]);\n// No array = every render (rarely needed)\nuseEffect(() => { document.title = title; });",
    interviewQuestion: "What is the dependency array contract?",
  },
  {
    id: "react-useref",
    category: "react",
    topic: "Hooks",
    title: "useRef",
    difficulty: "Intermediate",
    summary:
      "Mutable ref that persists across renders without causing re-render",
    explanation:
      "useRef for: DOM elements, previous values, timers, external instances — anything that doesn't need to trigger UI update. useState for anything that should update UI.",
    code: "const inputRef = useRef<HTMLInputElement>(null);\nconst countRef  = useRef(0); // track without re-render\nconst prevCount = useRef(count);\n\nuseEffect(() => { prevCount.current = count; });\n\n<input ref={inputRef} />\n<button onClick={() => inputRef.current?.focus()}>Focus</button>",
    interviewQuestion: "useRef vs useState — when to use each?",
  },
  {
    id: "react-usememo-usecallback",
    category: "react",
    topic: "Hooks",
    title: "useMemo & useCallback",
    difficulty: "Intermediate",
    summary: "Memoize expensive values and stable callbacks",
    explanation:
      "(1) Expensive computation >1ms. (2) Reference equality matters (object/array passed to memoized child). Premature memoization adds overhead.",
    code: "const filtered = useMemo(\n  () => items.filter(i => i.active && i.tag === tag),\n  [items, tag]\n);\nconst handleSelect = useCallback(\n  (id: string) => onSelect(id),\n  [onSelect] // stable ref for memo'd children\n);",
    interviewQuestion: "When does memoization actually help?",
  },
  {
    id: "react-usereducer",
    category: "react",
    topic: "Hooks",
    title: "useReducer",
    difficulty: "Intermediate",
    summary: "Complex state with reducer pattern",
    explanation:
      "When state transitions are complex, multiple handlers share similar logic, or next state depends on previous. dispatch is stable — pass it instead of multiple callbacks.",
    code: "type Action = { type: 'inc' } | { type: 'dec' } | { type: 'set'; value: number };\nfunction reducer(state: number, action: Action): number {\n  switch (action.type) {\n    case 'inc': return state + 1;\n    case 'dec': return state - 1;\n    case 'set': return action.value;\n  }\n}\nconst [count, dispatch] = useReducer(reducer, 0);",
    interviewQuestion: "When to choose useReducer over multiple useStates?",
  },
  {
    id: "react-usecontext",
    category: "react",
    topic: "Hooks",
    title: "useContext",
    difficulty: "Intermediate",
    summary: "Consume context without prop drilling",
    explanation:
      "Yes — every consumer re-renders when context value changes, even if they only use an unchanged part. Split contexts by update frequency or use selector pattern.",
    code: "const ThemeCtx = createContext<Theme>('light');\nconst UserCtx  = createContext<User | null>(null);\n// Split by frequency: theme rarely changes, user might\nfunction useTheme() { return useContext(ThemeCtx); }\nfunction useUser()  { return useContext(UserCtx); }",
    interviewQuestion:
      "Does useContext cause all consumers to re-render on change?",
  },
  {
    id: "react-useid",
    category: "react",
    topic: "Hooks",
    title: "useId",
    difficulty: "Basic",
    summary: "Generate stable unique IDs for accessibility (React 18)",
    explanation:
      "Math.random() differs between server and client — causes hydration mismatch. useId generates consistent IDs from component tree position.",
    code: "function TextField({ label }: { label: string }) {\n  const id = useId();\n  return (\n    <>\n      <label htmlFor={id}>{label}</label>\n      <input id={id} />\n    </>\n  );\n}",
    interviewQuestion: "Why not use Math.random() for accessibility IDs?",
  },
  {
    id: "react-useimperativehandle-forwardref",
    category: "react",
    topic: "Hooks",
    title: "useImperativeHandle & forwardRef",
    difficulty: "Advanced",
    summary: "Expose imperative methods from child to parent",
    explanation:
      "When parent needs to call methods on child (focus, scroll, validate) — not for sharing state. Prefer props/callbacks when possible.",
    code: "const Input = forwardRef<{ focus(): void }, Props>((props, ref) => {\n  const inputRef = useRef<HTMLInputElement>(null);\n  useImperativeHandle(ref, () => ({\n    focus: () => inputRef.current?.focus()\n  }));\n  return <input ref={inputRef} {...props} />;\n});\n// Parent:\nconst ref = useRef<{ focus(): void }>(null);\n<Input ref={ref} />\nref.current?.focus();",
    interviewQuestion: "When to use useImperativeHandle?",
  },
  {
    id: "react-custom-hooks",
    category: "react",
    topic: "Hooks",
    title: "Custom hooks",
    difficulty: "Intermediate",
    summary: "Extract reusable stateful logic",
    explanation:
      "Yes — ESLint react-hooks plugin validates rules-of-hooks based on the 'use' prefix. Without it, hooks inside won't be checked.",
    code: "function useLocalStorage<T>(key: string, initial: T) {\n  const [value, setValue] = useState<T>(() => {\n    try { return JSON.parse(localStorage.getItem(key)!) ?? initial; }\n    catch { return initial; }\n  });\n  const set = useCallback((v: T) => {\n    setValue(v);\n    localStorage.setItem(key, JSON.stringify(v));\n  }, [key]);\n  return [value, set] as const;\n}",
    interviewQuestion: "Must custom hooks start with 'use'?",
  },
  {
    id: "react-react-memo",
    category: "react",
    topic: "Performance",
    title: "React.memo",
    difficulty: "Intermediate",
    summary: "Skip re-render if props unchanged",
    explanation:
      "No — shallow comparison by reference. Objects/arrays passed as new literals each render bypass memo. Pass custom compareFn as second arg for deep comparison.",
    code: "const Card = React.memo(\n  ({ user }: { user: User }) => <div>{user.name}</div>,\n  (prev, next) => prev.user.id === next.user.id\n);\n// BROKEN: new object every render -- memo useless\n<Card user={{ name: 'Alice' }} />",
    interviewQuestion: "Does React.memo do deep comparison?",
  },
  {
    id: "react-reconciliation-keys",
    category: "react",
    topic: "Performance",
    title: "Reconciliation & keys",
    difficulty: "Advanced",
    summary: "React's diffing algorithm for list updates",
    explanation:
      "Index keys cause React to reuse DOM nodes incorrectly on reorder/filter. Component state (input values, scroll position) becomes misassigned. Use IDs.",
    code: "// BAD: index key -- state mismatch on reorder\n{items.map((item, i) => <Input key={i} value={item.value} />)}\n// GOOD: stable unique key\n{items.map(item => <Input key={item.id} value={item.value} />)}",
    interviewQuestion: "Why must keys be stable and not array index?",
  },
  {
    id: "react-lazy-loading",
    category: "react",
    topic: "Performance",
    title: "Lazy loading",
    difficulty: "Intermediate",
    summary: "Code split with React.lazy + Suspense",
    explanation:
      "Shown while the lazy component's chunk is being downloaded. After the first load it's cached — Suspense only shows on first load or when a new chunk is needed.",
    code: "const Dashboard = React.lazy(() => import('./Dashboard'));\nconst Settings  = React.lazy(() => import('./Settings'));\n\n<ErrorBoundary>\n  <Suspense fallback={<PageSpinner />}>\n    <Routes>\n      <Route path='/dashboard' element={<Dashboard />} />\n      <Route path='/settings'  element={<Settings />} />\n    </Routes>\n  </Suspense>\n</ErrorBoundary>",
    interviewQuestion: "What is the purpose of Suspense fallback?",
  },
  {
    id: "react-error-boundaries",
    category: "react",
    topic: "Patterns",
    title: "Error Boundaries",
    difficulty: "Advanced",
    summary: "Catch JS errors in component tree",
    explanation:
      "They require componentDidCatch and getDerivedStateFromError class lifecycle methods. Use react-error-boundary library for function component API.",
    code: "import { ErrorBoundary } from 'react-error-boundary';\n\n<ErrorBoundary\n  fallbackRender={({ error, resetErrorBoundary }) => (\n    <div>\n      <p>Error: {error.message}</p>\n      <button onClick={resetErrorBoundary}>Retry</button>\n    </div>\n  )}\n  onError={(error, info) => logError(error, info)}\n>\n  <App />\n</ErrorBoundary>",
    interviewQuestion: "Why can't function components be error boundaries?",
  },
  {
    id: "react-portals",
    category: "react",
    topic: "Patterns",
    title: "Portals",
    difficulty: "Advanced",
    summary: "Render into a different DOM node",
    explanation:
      "Event bubbling follows the React component tree, not the DOM tree. A click inside a portal bubbles up through React parents even though DOM-wise it's outside.",
    code: "function Modal({ onClose, children }: Props) {\n  return createPortal(\n    <div className='overlay' onClick={onClose}>\n      <div className='modal' onClick={e => e.stopPropagation()}>\n        {children}\n      </div>\n    </div>,\n    document.getElementById('portal-root')!\n  );\n}",
    interviewQuestion: "How do events work with portals?",
  },
  {
    id: "react-compound-components",
    category: "react",
    topic: "Patterns",
    title: "Compound components",
    difficulty: "Advanced",
    summary: "Components sharing implicit state via context",
    explanation:
      "API flexibility — consumers control layout and composition rather than configuring everything through props.",
    code: "const TabsCtx = createContext<{ active: number; setActive: (n: number) => void } | null>(null);\nfunction Tabs({ children }: { children: ReactNode }) {\n  const [active, setActive] = useState(0);\n  return <TabsCtx.Provider value={{ active, setActive }}>{children}</TabsCtx.Provider>;\n}\nTabs.Tab = function({ index, children }: { index: number; children: ReactNode }) {\n  const ctx = useContext(TabsCtx)!;\n  return <button aria-selected={ctx.active === index} onClick={() => ctx.setActive(index)}>{children}</button>;\n};",
    interviewQuestion: "What problem do compound components solve?",
  },
  {
    id: "react-render-props",
    category: "react",
    topic: "Patterns",
    title: "Render props",
    difficulty: "Intermediate",
    summary: "Pass function as prop to share behaviour",
    explanation:
      "Less common — custom hooks replaced most render prop use cases. Still useful for headless UI libraries (Downshift, react-table) where consumer fully controls rendering.",
    code: "// Render prop\nfunction DataFetcher<T>({ url, render }: { url: string; render: (data: T) => ReactNode }) {\n  const [data, setData] = useState<T | null>(null);\n  useEffect(() => { fetch(url).then(r => r.json()).then(setData); }, [url]);\n  return data ? render(data) : <Spinner />;\n}\n<DataFetcher url='/api/users' render={users => <UserList users={users} />} />",
    interviewQuestion: "Are render props still used in modern React?",
  },
  {
    id: "react-higher-order-components",
    category: "react",
    topic: "Patterns",
    title: "Higher-Order Components",
    difficulty: "Intermediate",
    summary: "HOC wraps component to add behaviour",
    explanation:
      "Custom hooks for reusing stateful logic (preferred). HOC for cross-cutting concerns that need to wrap JSX (legacy code, some libraries). HOCs add wrapper divs and complicate DevTools.",
    code: "function withAuth<P>(Component: ComponentType<P>) {\n  return function AuthGuard(props: P) {\n    const { user } = useAuth();\n    if (!user) return <Navigate to='/login' />;\n    return <Component {...props} />;\n  };\n}\nconst ProtectedPage = withAuth(Dashboard);",
    interviewQuestion: "HOC vs custom hook — which to use?",
  },
  {
    id: "react-usetransition",
    category: "react",
    topic: "Concurrent",
    title: "useTransition",
    difficulty: "Advanced",
    summary: "Mark state updates as non-urgent (React 18)",
    explanation:
      "A boolean true while deferred update is pending. Use to show loading indicator without blocking the input from updating.",
    code: "const [query, setQuery] = useState('');\nconst [results, setResults] = useState([]);\nconst [isPending, startTransition] = useTransition();\n\nfunction handleSearch(q: string) {\n  setQuery(q); // urgent: update input\n  startTransition(() => {\n    setResults(filter(items, q)); // non-urgent: can be interrupted\n  });\n}",
    interviewQuestion: "What does isPending give you?",
  },
  {
    id: "react-usedeferredvalue",
    category: "react",
    topic: "Concurrent",
    title: "useDeferredValue",
    difficulty: "Advanced",
    summary: "Defer a value until browser is idle",
    explanation:
      "useTransition: you control which update is deferred (wrap setState). useDeferredValue: you defer a value you receive as prop/context — useful when you don't own the state setter.",
    code: "const deferredQuery = useDeferredValue(query);\n// deferredQuery lags behind query\n// Show stale content while new results compute\n<div style={{ opacity: deferredQuery !== query ? 0.5 : 1 }}>\n  <Results query={deferredQuery} />\n</div>",
    interviewQuestion: "useTransition vs useDeferredValue?",
  },
  {
    id: "react-batching-react-18",
    category: "react",
    topic: "Tricky",
    title: "Batching (React 18)",
    difficulty: "Tricky",
    summary: "All state updates batched in React 18",
    explanation:
      "React 17: batching only in React event handlers. React 18: automatic batching everywhere — setTimeout, promises, native events. Use flushSync() to opt out.",
    code: "// React 18: both updates = 1 re-render\nsetTimeout(() => {\n  setA(1);\n  setB(2); // batched!\n}, 0);\n// Opt out:\nimport { flushSync } from 'react-dom';\nflushSync(() => setA(1)); // immediate re-render\nflushSync(() => setB(2)); // another re-render",
    interviewQuestion: "What changed about batching in React 18?",
  },
  {
    id: "react-stale-closures",
    category: "react",
    topic: "Tricky",
    title: "Stale closures",
    difficulty: "Tricky",
    summary: "Event handlers capture outdated state values",
    explanation:
      "Functional setState: setState(prev => prev + 1). useRef to track latest: ref.current = state, read ref.current in handler.",
    code: "// BUG: count always 0 in handler\nuseEffect(() => {\n  window.addEventListener('click', () => {\n    console.log(count); // stale!\n    setCount(count + 1); // BUG: always 1\n  });\n}, []);\n// FIX 1: functional update\nsetCount(c => c + 1);\n// FIX 2: ref\nconst countRef = useRef(count);\ncountRef.current = count;\n// Use countRef.current in handler",
    interviewQuestion: "How do you fix stale state in event handlers?",
  },
  {
    id: "react-strictmode-double-invoke",
    category: "react",
    topic: "Tricky",
    title: "StrictMode double-invoke",
    difficulty: "Tricky",
    summary: "React 18 StrictMode mounts/unmounts/remounts in dev",
    explanation:
      "StrictMode intentionally remounts to surface missing cleanup. If effect has side effects that aren't cleaned up, you'll see doubled API calls. Fix: add proper cleanup.",
    code: "useEffect(() => {\n  const sub = eventBus.subscribe(handler);\n  return () => sub.unsubscribe(); // REQUIRED cleanup\n}, []);\n// Only in development -- production mounts once",
    interviewQuestion: "Why does useEffect run twice in development?",
  },
  {
    id: "react-reconciliation-object-identity",
    category: "react",
    topic: "Tricky",
    title: "Reconciliation & object identity",
    difficulty: "Tricky",
    summary: "New object references cause unnecessary re-renders",
    explanation:
      "Every render creates a new object — reference changes even if values are same. useMemo/useCallback to stabilize references.",
    code: "// Re-renders Card every time even with React.memo\n<Card style={{ color: 'red' }} onClick={() => handleClick(id)} />\n// Stable:\nconst style    = useMemo(() => ({ color: 'red' }), []);\nconst onClick  = useCallback(() => handleClick(id), [id]);\n<Card style={style} onClick={onClick} />",
    interviewQuestion: "Why does passing object literals as props break memo?",
  },
  {
    id: "react-react-testing-library",
    category: "react",
    topic: "Testing",
    title: "React Testing Library",
    difficulty: "Intermediate",
    summary: "Test components as users interact — not implementation",
    explanation:
      "Test behaviour, not implementation. Query by accessible role/text/label (as a user would), not by class names or component internals. Encourages accessible code.",
    code: "import { render, screen, fireEvent, waitFor } from '@testing-library/react';\ntest('submits form with user data', async () => {\n  render(<LoginForm onLogin={mockFn} />);\n  fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'a@b.com' } });\n  fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'pass' } });\n  fireEvent.click(screen.getByRole('button', { name: /sign in/i }));\n  await waitFor(() => expect(mockFn).toHaveBeenCalledWith('a@b.com', 'pass'));\n});",
    interviewQuestion: "What is the guiding principle of RTL?",
  },
  {
    id: "react-mocking-in-react-tests",
    category: "react",
    topic: "Testing",
    title: "Mocking in React tests",
    difficulty: "Intermediate",
    summary: "Mock API calls, modules, timers",
    explanation:
      "Use global.fetch = jest.fn() or MSW (Mock Service Worker) — MSW intercepts at network level, works in both tests and browser.",
    code: "// MSW setup\nimport { http, HttpResponse } from 'msw';\nimport { setupServer } from 'msw/node';\nconst server = setupServer(\n  http.get('/api/user', () => HttpResponse.json({ name: 'Alice' })),\n);\nbeforeAll(() => server.listen());\nafterEach(() => server.resetHandlers());\nafterAll(() => server.close());",
    interviewQuestion: "How do you mock fetch in React tests?",
  },
  {
    id: "react-react-query-tanstack-query",
    category: "react",
    topic: "State",
    title: "React Query / TanStack Query",
    difficulty: "Intermediate",
    summary: "Server state management: caching, refetching, mutations",
    explanation:
      "How long data is considered fresh. During staleTime, no refetch happens. After staleTime, data is 'stale' — still shown but refetched in background on window focus or remount.",
    code: "import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';\nconst { data, isLoading } = useQuery({\n  queryKey: ['user', userId],\n  queryFn:  () => fetchUser(userId),\n  staleTime: 60_000, // fresh for 1 min\n  gcTime:    5 * 60_000, // removed from cache after 5 min\n});\nconst qc = useQueryClient();\nconst mut = useMutation({ mutationFn: updateUser, onSuccess: () => qc.invalidateQueries(['user']) });",
    interviewQuestion: "What does staleTime control?",
  },
  {
    id: "react-jotai-recoil",
    category: "react",
    topic: "State",
    title: "Jotai & Recoil",
    difficulty: "Advanced",
    summary: "Atomic state management",
    explanation:
      "Atoms are independent — components only subscribe to atoms they use. No need for selectors to prevent re-renders. Easy to derive state with computed atoms.",
    code: "import { atom, useAtom } from 'jotai';\nconst countAtom  = atom(0);\nconst doubleAtom = atom(get => get(countAtom) * 2); // derived\n\nfunction Counter() {\n  const [count, setCount] = useAtom(countAtom);\n  const [double] = useAtom(doubleAtom);\n  return <button onClick={() => setCount(c => c + 1)}>{count} x2={double}</button>;\n}",
    interviewQuestion:
      "What is the advantage of atomic state over a single store?",
  },
  {
    id: "react-react-hook-form",
    category: "react",
    topic: "Forms",
    title: "React Hook Form",
    difficulty: "Intermediate",
    summary: "Performant forms with minimal re-renders",
    explanation:
      "Uncontrolled by default — uses refs, not state. Only re-renders on actual errors or on submit. Formik re-renders on every keystroke (controlled inputs).",
    code: "import { useForm } from 'react-hook-form';\nimport { zodResolver } from '@hookform/resolvers/zod';\nconst { register, handleSubmit, formState: { errors } } = useForm({\n  resolver: zodResolver(schema),\n});\n<form onSubmit={handleSubmit(onSubmit)}>\n  <input {...register('email')} />\n  {errors.email && <span>{errors.email.message}</span>}\n  <button type='submit'>Submit</button>\n</form>",
    interviewQuestion: "Why is RHF faster than controlled inputs?",
  },
  {
    id: "react-useoptimistic-react-19",
    category: "react",
    topic: "Patterns",
    title: "useOptimistic (React 19)",
    difficulty: "Advanced",
    summary: "Optimistic UI updates during async transitions",
    explanation:
      "The optimistic state is automatically reverted to the previous value. React handles the rollback when the action's Promise rejects.",
    code: "import { useOptimistic, useTransition } from 'react';\nconst [optimisticLikes, addOptimisticLike] = useOptimistic(\n  likes,\n  (state, newLike) => [...state, newLike]\n);\nasync function handleLike() {\n  addOptimisticLike({ id: 'temp', userId }); // immediate UI update\n  await likePost(postId); // actual server call\n  // On failure: auto-reverts optimisticLikes\n}",
    interviewQuestion:
      "What happens when the server call fails with useOptimistic?",
  },
  {
    id: "react-use-hook",
    category: "react",
    topic: "React 19",
    title: "use() hook",
    difficulty: "Advanced",
    summary: "Read resources (Promises, Context) in render",
    explanation:
      "use() can be called conditionally (unlike other hooks). Works with Promises — suspends the component until Promise resolves. Works with Context — same as useContext but callable anywhere.",
    code: "import { use } from 'react';\n// Read context conditionally\nif (darkMode) {\n  const theme = use(ThemeContext); // OK -- use() is conditional-safe\n}\n// Unwrap promise (suspends until resolved)\nfunction UserProfile({ userPromise }) {\n  const user = use(userPromise); // suspends, then renders\n  return <div>{user.name}</div>;\n}",
    interviewQuestion: "What makes use() different from useContext and await?",
  },
  {
    id: "react-react-accessibility",
    category: "react",
    topic: "Accessibility",
    title: "React Accessibility",
    difficulty: "Intermediate",
    summary: "aria-* props, role, keyboard navigation, focus management",
    explanation:
      "On modal open: save last focused element, move focus into modal. Intercept Tab/Shift+Tab to cycle through focusable elements inside modal. On close: restore focus to saved element.",
    code: "function useFocusTrap(ref: RefObject<HTMLElement>, active: boolean) {\n  useEffect(() => {\n    if (!active) return;\n    const el = ref.current;\n    const focusable = el?.querySelectorAll('button,input,[tabindex]:not([tabindex=\"-1\"])');\n    const first = focusable?.[0] as HTMLElement;\n    const last  = focusable?.[focusable.length-1] as HTMLElement;\n    first?.focus();\n    const handleTab = (e: KeyboardEvent) => {\n      if (e.key !== 'Tab') return;\n      if (e.shiftKey ? document.activeElement === first : document.activeElement === last) {\n        e.preventDefault();\n        (e.shiftKey ? last : first).focus();\n      }\n    };\n    el?.addEventListener('keydown', handleTab);\n    return () => el?.removeEventListener('keydown', handleTab);\n  }, [active]);\n}",
    interviewQuestion: "How do you implement a focus trap in a modal?",
  },
  {
    id: "react-fiber-architecture",
    category: "react",
    topic: "Internals",
    title: "Fiber architecture",
    difficulty: "Advanced",
    summary: "React's internal reconciliation engine",
    explanation:
      "Old reconciler: synchronous, recursive — once started, couldn't be interrupted. Fiber: work broken into units, interruptible, prioritizable. Enables concurrent features (useTransition, Suspense streaming).",
    code: "// Fiber = linked list of work units\n// Each component = a fiber node with:\n// - type (function/class/element)\n// - key\n// - stateNode (DOM/class instance)\n// - child/sibling/return (tree pointers)\n// - pendingProps / memoizedProps\n// - pendingState\n// - effectTag (insert/update/delete)\n// Work loop can yield between fiber units",
    interviewQuestion:
      "What problem did Fiber solve over the old stack reconciler?",
  },
  {
    id: "react-react-18-root-api",
    category: "react",
    topic: "Tricky",
    title: "React 18 root API",
    difficulty: "Tricky",
    summary: "createRoot vs ReactDOM.render",
    explanation:
      "createRoot enables concurrent mode — all React 18 features (automatic batching, useTransition, Suspense streaming) require it. ReactDOM.render uses legacy mode — no concurrent features.",
    code: "// React 18\nimport { createRoot } from 'react-dom/client';\nconst root = createRoot(document.getElementById('root'));\nroot.render(<App />);\n// Hydration (SSR)\nimport { hydrateRoot } from 'react-dom/client';\nconst root = hydrateRoot(document.getElementById('root'), <App />);",
    interviewQuestion: "Why must you use createRoot for React 18 features?",
  },
  {
    id: "react-controlled-vs-uncontrolled",
    category: "react",
    difficulty: "Basic",
    topic: "Forms",
    title:
      "What is the difference between controlled and uncontrolled components?",
    summary:
      "Controlled components have their form state driven by React via value/onChange, while uncontrolled components manage their own state internally and are accessed via refs.",
    explanation:
      "A controlled component's input value is always derived from React state, so every keystroke triggers a state update and re-render, giving you a single source of truth. An uncontrolled component stores its value in the DOM itself, and you read it on demand with a ref (e.g. inputRef.current.value). Controlled components make validation, conditional disabling, and formatting straightforward but can be verbose for large forms. Uncontrolled components are simpler and more performant for basic use cases like file inputs, which can only be uncontrolled. Libraries like React Hook Form lean on uncontrolled inputs plus refs to minimize re-renders.",
    code: 'function NameForm() {\n  // Controlled\n  const [name, setName] = React.useState(\'\');\n\n  // Uncontrolled\n  const emailRef = React.useRef(null);\n\n  const handleSubmit = (e) => {\n    e.preventDefault();\n    console.log(name, emailRef.current.value);\n  };\n\n  return (\n    <form onSubmit={handleSubmit}>\n      <input value={name} onChange={(e) => setName(e.target.value)} />\n      <input ref={emailRef} defaultValue="" />\n      <button type="submit">Submit</button>\n    </form>\n  );\n}',
    interviewQuestion:
      "When would you choose an uncontrolled component over a controlled one, and what are the tradeoffs?",
  },
  {
    id: "react-prop-drilling",
    category: "react",
    difficulty: "Basic",
    topic: "State Management",
    title: "What is prop drilling and how can you avoid it?",
    summary:
      "Prop drilling is passing data through multiple layers of components that don't need it themselves, just to reach a deeply nested child.",
    explanation:
      "As component trees grow, passing props through intermediate components that only forward them adds boilerplate and coupling — any change to the shape of the data requires touching every layer in between. Common fixes include the Context API for cross-cutting data like theme or auth, component composition (passing children/render props instead of threading data), or external state managers like Zustand or Redux for complex shared state. The right fix depends on scope: Context works well for low-frequency updates, but overusing it for high-frequency state can cause unnecessary re-renders across all consumers.",
    code: "// Prop drilling\nfunction App() {\n  const user = { name: 'Sai' };\n  return <Page user={user} />;\n}\nfunction Page({ user }) {\n  return <Sidebar user={user} />;\n}\nfunction Sidebar({ user }) {\n  return <UserBadge user={user} />; // only this needs it\n}\n\n// Fixed with composition\nfunction App() {\n  const user = { name: 'Sai' };\n  return (\n    <Page>\n      <Sidebar>\n        <UserBadge user={user} />\n      </Sidebar>\n    </Page>\n  );\n}",
    interviewQuestion:
      "Your team complains that a 'theme' prop is threaded through six components. How would you refactor this, and what tradeoffs would you weigh between Context and composition?",
  },
  {
    id: "react-children-api",
    category: "react",
    difficulty: "Intermediate",
    topic: "Component Patterns",
    title: "How does the React.Children API work and when do you need it?",
    summary:
      "React.Children provides utility methods (map, forEach, count, toArray, only) for safely iterating over the opaque props.children data structure.",
    explanation:
      "props.children can be a single element, an array, a string, or even undefined, so iterating over it directly with Array.prototype methods is unsafe. React.Children.map handles all these cases uniformly and preserves keys correctly when cloning. It's primarily used inside reusable container components — like a Tabs or Accordion component — that need to inspect, wrap, or inject props into each child without knowing in advance how many children will be passed. React.Children.toArray is also useful for flattening nested fragments while auto-generating stable keys. In modern React, this pattern is often replaced by explicit array props or context, but it still appears heavily in component libraries.",
    code: 'function Tabs({ children, activeIndex }) {\n  return (\n    <div className="tabs">\n      {React.Children.map(children, (child, index) =>\n        React.cloneElement(child, {\n          isActive: index === activeIndex,\n        })\n      )}\n    </div>\n  );\n}\n\nfunction Tab({ isActive, label }) {\n  return <div style={{ fontWeight: isActive ? \'bold\' : \'normal\' }}>{label}</div>;\n}\n\n// <Tabs activeIndex={0}>\n//   <Tab label="One" />\n//   <Tab label="Two" />\n// </Tabs>',
    interviewQuestion:
      "Why can't you just call children.map() directly in a component, and what does React.Children.map do differently?",
  },
  {
    id: "react-cloneelement",
    category: "react",
    difficulty: "Intermediate",
    topic: "Component Patterns",
    title: "What does React.cloneElement do and what are its pitfalls?",
    summary:
      "cloneElement creates a copy of a React element with new or merged props, commonly used to inject extra props into children passed via composition.",
    explanation:
      "cloneElement(element, newProps, children) returns a new element with the same type and key as the original but with newProps shallowly merged over the existing props. It's often paired with React.Children.map inside components like Tabs, Accordion, or form wrappers that need to inject shared state (like isActive or a ref) into whichever children the consumer passes. The main pitfalls: it creates implicit coupling because the parent assumes something about the child's prop API, it doesn't work well with custom components that don't accept the injected prop, and overusing it makes component trees harder to trace. Many teams prefer explicit render props or context for the same use case because it's more discoverable.",
    code: 'function RadioGroup({ children, value, onChange }) {\n  return React.Children.map(children, (child) =>\n    React.cloneElement(child, {\n      checked: child.props.value === value,\n      onChange: () => onChange(child.props.value),\n    })\n  );\n}\n\nfunction Radio({ checked, onChange, label }) {\n  return (\n    <label>\n      <input type="radio" checked={checked} onChange={onChange} /> {label}\n    </label>\n  );\n}',
    interviewQuestion:
      "What's the downside of using cloneElement to inject props into children, and what alternative patterns solve the same problem more explicitly?",
  },
  {
    id: "react-context-rerender-pitfalls",
    category: "react",
    difficulty: "Advanced",
    topic: "Performance",
    title:
      "Why does every Context consumer re-render when the provider's value changes?",
    summary:
      "React Context re-renders every component calling useContext whenever the provider's value prop changes identity, regardless of whether that consumer uses the changed part of the value.",
    explanation:
      "Context is not a selective subscription system — when a Provider re-renders with a new value reference, React re-renders all descendants that call useContext(MyContext), even if they only destructure a field that didn't change. This becomes a performance problem when a single context bundles unrelated, frequently-changing state (e.g. both 'user' and 'notificationCount') because every consumer re-renders on any change. Common fixes: split contexts by concern so unrelated updates don't cascade, memoize the value object passed to the Provider with useMemo, or move to a selector-based external store (Zustand, Redux with useSelector, or useSyncExternalStore) that only re-renders components subscribed to the specific slice that changed.",
    code: "// Problem: one context, unrelated fields\nconst AppContext = React.createContext();\nfunction AppProvider({ children }) {\n  const [user, setUser] = React.useState(null);\n  const [count, setCount] = React.useState(0);\n  // New object every render -> all consumers re-render\n  const value = { user, setUser, count, setCount };\n  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;\n}\n\n// Fix: memoize and/or split contexts\nfunction AppProvider({ children }) {\n  const [user, setUser] = React.useState(null);\n  const [count, setCount] = React.useState(0);\n  const value = React.useMemo(() => ({ user, setUser, count, setCount }), [user, count]);\n  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;\n}",
    interviewQuestion:
      "A component that only reads `theme` from a shared context re-renders every time an unrelated `cartItems` value updates in the same context. How do you diagnose and fix this?",
  },
  {
    id: "react-usesyncexternalstore",
    category: "react",
    difficulty: "Advanced",
    topic: "Hooks",
    title: "What problem does useSyncExternalStore solve?",
    summary:
      "useSyncExternalStore lets React components safely subscribe to external (non-React) state sources like browser APIs or third-party stores without tearing under concurrent rendering.",
    explanation:
      "Before React 18, subscribing to external stores with useEffect + useState could cause 'tearing' — different parts of the UI showing inconsistent snapshots of the same external state during concurrent rendering, because effects run after render. useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot) is a purpose-built hook that guarantees the returned snapshot is consistent across a single render pass, even with concurrent features like useTransition. It's the mechanism libraries like Redux, Zustand, and Jotai use internally to bind their stores to React. You rarely call it directly in app code, but it's essential for building custom store integrations or subscribing to browser APIs like window.innerWidth or navigator.onLine.",
    code: "function subscribe(callback) {\n  window.addEventListener('online', callback);\n  window.addEventListener('offline', callback);\n  return () => {\n    window.removeEventListener('online', callback);\n    window.removeEventListener('offline', callback);\n  };\n}\n\nfunction useOnlineStatus() {\n  return React.useSyncExternalStore(\n    subscribe,\n    () => navigator.onLine,\n    () => true // server snapshot\n  );\n}\n\nfunction StatusBadge() {\n  const isOnline = useOnlineStatus();\n  return <span>{isOnline ? 'Online' : 'Offline'}</span>;\n}",
    interviewQuestion:
      "Why is useSyncExternalStore preferred over useEffect + useState for subscribing to an external store like Redux under React 18's concurrent rendering?",
  },
  {
    id: "react-uselayouteffect-vs-useeffect",
    category: "react",
    difficulty: "Intermediate",
    topic: "Hooks",
    title: "What is the difference between useLayoutEffect and useEffect?",
    summary:
      "useEffect runs asynchronously after the browser paints, while useLayoutEffect runs synchronously after DOM mutations but before the browser paints.",
    explanation:
      "Both hooks let you run side effects after render, but their timing differs: useEffect is scheduled after the paint, so the user may briefly see the pre-effect UI, which is fine for data fetching, subscriptions, or logging. useLayoutEffect fires synchronously right after React commits DOM changes but before the browser paints, blocking the paint until it finishes — use it when you need to measure or mutate the DOM (e.g. reading an element's size and adjusting layout) to avoid a visible flicker. Overusing useLayoutEffect can hurt performance since it blocks painting, so it should be reserved for genuine layout-measurement cases. On the server, useLayoutEffect warns because there's no DOM to measure, so libraries often fall back to useEffect during SSR.",
    code: 'function Tooltip({ targetRef, text }) {\n  const [style, setStyle] = React.useState({});\n\n  React.useLayoutEffect(() => {\n    const rect = targetRef.current.getBoundingClientRect();\n    // Measure and position before paint to avoid flicker\n    setStyle({ top: rect.bottom, left: rect.left });\n  }, [targetRef]);\n\n  return <div className="tooltip" style={style}>{text}</div>;\n}',
    interviewQuestion:
      "You notice a brief flicker when a tooltip repositions itself based on a measured DOM element. Would you use useEffect or useLayoutEffect to fix it, and why?",
  },
  {
    id: "react-virtual-dom-diffing",
    category: "react",
    difficulty: "Basic",
    topic: "Core Concepts",
    title:
      "How does React's virtual DOM diffing algorithm work at a high level?",
    summary:
      "React builds a lightweight in-memory tree of elements on each render and compares it to the previous tree using heuristics to compute the minimal set of real DOM updates.",
    explanation:
      "Rather than diffing arbitrary trees (an O(n^3) problem in the general case), React uses a heuristic O(n) algorithm based on two assumptions: elements of different types produce different trees (so React tears down and rebuilds rather than diffing deeply across type changes), and elements can be identified with a stable key to match children across renders. When comparing two elements of the same type, React keeps the underlying DOM node and only updates changed attributes; when types differ, it unmounts the old subtree and mounts a new one. For lists, keys let React match items by identity rather than by index, minimizing unnecessary unmount/remount cycles when items are reordered, inserted, or removed.",
    code: '// Same type -> React updates attributes in place\n<div className="a" />\n<div className="b" /> // DOM node reused, className updated\n\n// Different type -> React unmounts old, mounts new\n<div />\n<span /> // old div removed, new span created\n\n// Keys guide list reconciliation\n{items.map((item) => (\n  <li key={item.id}>{item.label}</li>\n))}',
    interviewQuestion:
      "Why is React's diffing algorithm described as O(n) instead of the theoretically correct O(n^3), and what assumptions make that possible?",
  },
  {
    id: "react-index-as-key-pitfalls",
    category: "react",
    difficulty: "Intermediate",
    topic: "Reconciliation",
    title: "Why is using array index as a key problematic?",
    summary:
      "Using the array index as a React key can cause incorrect reconciliation when list items are reordered, inserted, or deleted, leading to stale UI state or unnecessary DOM churn.",
    explanation:
      "React uses keys to match elements between renders so it can decide whether to update, move, or recreate a DOM node and its associated component state. If you use the index as the key and the list order changes (e.g. an item is deleted from the middle), React matches each position's old key to the new key, causing it to think the wrong items changed — this can mix up local component state (like input values or checkbox state) between rows, and it defeats memoization optimizations. Index keys are acceptable only when the list is static, never reordered, and has no per-item local state. The correct fix is to use a stable, unique identifier from the data itself, like a database id.",
    code: "// Buggy: index as key\nfunction TodoList({ todos }) {\n  return todos.map((todo, index) => (\n    <TodoItem key={index} todo={todo} /> // reordering breaks state\n  ));\n}\n\n// Correct: stable id as key\nfunction TodoList({ todos }) {\n  return todos.map((todo) => (\n    <TodoItem key={todo.id} todo={todo} />\n  ));\n}",
    interviewQuestion:
      "A checklist with checkboxes shows the wrong items checked after you delete a row from the middle of the list. What's the likely cause and how do you fix it?",
  },
  {
    id: "react-code-splitting-lazy-suspense",
    category: "react",
    difficulty: "Intermediate",
    topic: "Performance",
    title: "How do React.lazy and Suspense enable code splitting?",
    summary:
      "React.lazy lets you dynamically import a component so its code is fetched only when needed, and Suspense lets you show a fallback UI while that chunk loads.",
    explanation:
      "React.lazy(() => import('./Component')) returns a component that, on first render, triggers a dynamic import and suspends rendering until the module resolves. Wrapping it in a <Suspense fallback={...}> boundary tells React what to show while waiting, avoiding blank screens or errors. This is the primary mechanism for route-based or feature-based code splitting in React apps, reducing the initial bundle size so users only download the JavaScript for the screens they actually visit. It's commonly combined with a router (e.g. lazy-loading route components) and should be paired with an error boundary to handle chunk-load failures gracefully, especially after a new deployment invalidates old chunk URLs.",
    code: "const Settings = React.lazy(() => import('./Settings'));\n\nfunction App() {\n  const [showSettings, setShowSettings] = React.useState(false);\n  return (\n    <div>\n      <button onClick={() => setShowSettings(true)}>Open Settings</button>\n      <React.Suspense fallback={<Spinner />}>\n        {showSettings && <Settings />}\n      </React.Suspense>\n    </div>\n  );\n}",
    interviewQuestion:
      "How would you split a large dashboard app so each route's code only loads when the user navigates to it, and what happens if the fetch for a lazy chunk fails?",
  },
  {
    id: "react-ssr-hydration-mismatch",
    category: "react",
    difficulty: "Advanced",
    topic: "Server-Side Rendering",
    title: "What causes a hydration mismatch in server-rendered React apps?",
    summary:
      "A hydration mismatch happens when the HTML React generates on the client during hydration differs from the HTML the server sent, forcing React to discard and re-render the mismatched DOM.",
    explanation:
      "During SSR, the server renders components to an HTML string, which is sent to the browser and displayed immediately. React then 'hydrates' that markup on the client by attaching event listeners and reconciling it with what the client-side render would produce — it assumes the two match exactly. Mismatches commonly come from using browser-only APIs (window, localStorage) during render, rendering time-sensitive or locale-sensitive values (Date.now(), Math.random(), timezone-dependent formatting) differently on server vs client, or conditionally rendering based on typeof window. React 18 warns in the console and re-renders the affected subtree on the client, which can cause a visible flash and hurts performance since the SSR benefit is lost for that part of the tree. Fixes include deferring browser-only rendering to useEffect, using suppressHydrationWarning sparingly for known-safe cases, or ensuring server and client compute the same initial value.",
    code: "// Problematic: differs between server and client\nfunction Timestamp() {\n  return <span>{new Date().toLocaleTimeString()}</span>;\n}\n\n// Fixed: render static/neutral value first, update after mount\nfunction Timestamp() {\n  const [time, setTime] = React.useState(null);\n  React.useEffect(() => {\n    setTime(new Date().toLocaleTimeString());\n  }, []);\n  return <span>{time ?? '--:--:--'}</span>;\n}",
    interviewQuestion:
      "Your Next.js app logs a hydration mismatch warning for a component that renders `new Date()`. Explain why this happens and how you'd fix it.",
  },
  {
    id: "react-devtools-profiler",
    category: "react",
    difficulty: "Intermediate",
    topic: "Tooling",
    title:
      "How do you use the React DevTools Profiler to diagnose performance issues?",
    summary:
      "The Profiler tab in React DevTools records render timings per component per commit, helping you identify which components render too often or take too long.",
    explanation:
      "The Profiler lets you record a session of interactions and then inspect a flame graph or ranked chart showing how long each component took to render in each commit, plus why it rendered (props changed, state changed, parent re-rendered, or context changed) when the 'Record why each component rendered' option is enabled. This is the standard tool for finding unnecessary re-renders — for example, a child re-rendering purely because its parent passed a new inline function or object reference each time, which memoization (React.memo, useMemo, useCallback) can fix. The Profiler API also exposes a programmatic <Profiler id onRender> component for capturing timing data in production-like conditions or automated performance budgets.",
    code: "import { Profiler } from 'react';\n\nfunction onRenderCallback(id, phase, actualDuration) {\n  console.log(`${id} (${phase}) took ${actualDuration.toFixed(2)}ms`);\n}\n\nfunction App() {\n  return (\n    <Profiler id=\"Dashboard\" onRender={onRenderCallback}>\n      <Dashboard />\n    </Profiler>\n  );\n}",
    interviewQuestion:
      "You suspect a list component re-renders too often. Walk through how you'd use the React DevTools Profiler to confirm this and identify the root cause.",
  },
  {
    id: "react-redux-vs-context",
    category: "react",
    difficulty: "Intermediate",
    topic: "State Management",
    title: "Redux vs Context API: when should you reach for each?",
    summary:
      "Context is a built-in dependency-injection mechanism for passing data through the tree, while Redux is a full state-management library with a single store, middleware, and selective subscriptions.",
    explanation:
      "Context solves prop drilling for relatively static or infrequently changing data (theme, auth user, locale) but has no built-in mechanism for selective re-rendering — every consumer re-renders on any value change unless you manually split contexts or memoize. Redux (especially with Redux Toolkit) provides a centralized store, predictable update patterns via reducers/actions, middleware for side effects (thunks, sagas), time-travel debugging, and — critically — useSelector subscriptions that only re-render a component when the specific selected slice changes, which scales much better for large, frequently-updated state. The rule of thumb: use Context for simple, low-frequency shared values and composition; reach for Redux (or Zustand/Jotai) when you have complex, high-frequency, cross-cutting state, need middleware, or want strong devtools support.",
    code: "// Context: simple, infrequent updates\nconst ThemeContext = React.createContext('light');\n\n// Redux Toolkit: complex, frequent, selective updates\nimport { createSlice, configureStore } from '@reduxjs/toolkit';\n\nconst cartSlice = createSlice({\n  name: 'cart',\n  initialState: { items: [] },\n  reducers: {\n    addItem: (state, action) => { state.items.push(action.payload); },\n  },\n});\n\nconst store = configureStore({ reducer: { cart: cartSlice.reducer } });\n// useSelector(state => state.cart.items) only re-renders on items change",
    interviewQuestion:
      "Your app's Context-based cart state causes the entire product listing page to re-render on every quantity change. Would you fix this within Context or migrate to Redux/Zustand? Justify your answer.",
  },
  {
    id: "react-usecallback-dependency-pitfalls",
    category: "react",
    difficulty: "Tricky",
    topic: "Performance",
    title: "What are common dependency array pitfalls with useCallback?",
    summary:
      "useCallback only preserves referential stability when its dependency array is correct and stable itself; missing or unstable dependencies lead to stale closures or the memoization never actually helping.",
    explanation:
      "A common mistake is omitting a value used inside the callback from the dependency array to 'stop it from changing' — this creates a stale closure that captures an old value indefinitely. The opposite mistake is passing a new object or function as a dependency on every render (e.g. an inline options object), which defeats memoization because the dependency itself is never referentially equal across renders, so useCallback returns a new function every time anyway. Another subtlety: memoizing a callback with useCallback only helps performance if it's actually used in a way that matters, like being passed to a React.memo child or as a dependency of another hook — otherwise it just adds overhead. The fix is usually to stabilize dependencies with useMemo/useRef, use the functional form of setState to avoid needing state as a dependency, or use an eslint-plugin-react-hooks exhaustive-deps rule to catch mistakes.",
    code: "// Stale closure bug: `count` is frozen at 0\nfunction Counter() {\n  const [count, setCount] = React.useState(0);\n  const logCount = React.useCallback(() => {\n    console.log(count); // stale unless count is in deps\n  }, []); // missing dependency\n\n  // Fix 1: include dependency\n  const logCountFixed = React.useCallback(() => {\n    console.log(count);\n  }, [count]);\n\n  // Fix 2: avoid needing the dependency via functional update\n  const increment = React.useCallback(() => {\n    setCount((c) => c + 1);\n  }, []);\n}",
    interviewQuestion:
      "A useCallback-wrapped click handler always logs the initial state value even after several clicks. What's happening and how do you fix it?",
  },
  {
    id: "react-event-pooling-legacy",
    category: "react",
    difficulty: "Advanced",
    topic: "Core Concepts",
    title:
      "What was event pooling in legacy React, and how did React 17+ change it?",
    summary:
      "Before React 17, SyntheticEvent objects were pooled and nulled out after the event handler ran, so accessing event properties asynchronously threw errors; React 17 removed pooling entirely.",
    explanation:
      "In React 16 and earlier, React reused a single SyntheticEvent object across events for performance, resetting all its fields to null immediately after the synchronous handler finished. This meant code that stashed the event and read its properties later (e.g. inside a setTimeout or after an await) would see null values unless you called event.persist() to opt the event out of pooling. React 17 removed event pooling entirely because modern JavaScript engines made the optimization largely unnecessary, and it was a frequent source of confusing bugs. As of React 17+, SyntheticEvent objects behave like normal objects you can reference asynchronously without calling persist(), and event.persist() is now a no-op kept only for backward compatibility.",
    code: "// React 16 and earlier: required persist() for async access\nfunction handleClick(e) {\n  e.persist(); // needed pre-17\n  setTimeout(() => {\n    console.log(e.target.value); // would be null without persist()\n  }, 1000);\n}\n\n// React 17+: works without persist()\nfunction handleClick(e) {\n  setTimeout(() => {\n    console.log(e.target.value); // safe, no pooling\n  }, 1000);\n}",
    interviewQuestion:
      "In an older React 16 codebase, a developer reads event.target.value inside a setTimeout and gets null. What's causing that, and how would this differ in React 18?",
  },
  {
    id: "react-forwardref-with-generics",
    category: "react",
    difficulty: "Advanced",
    topic: "TypeScript",
    title:
      "How do you type a forwardRef component with generics in TypeScript?",
    summary:
      "forwardRef's TypeScript typing doesn't support generic components out of the box, requiring a cast or a wrapper helper to preserve generic type parameters through the ref forwarding.",
    explanation:
      "React.forwardRef<Ref, Props> is defined in a way that erases generic type parameters on the component — if your component is generic over T (like a reusable List<T>), TypeScript will infer T as unknown at the call site once wrapped in forwardRef, because forwardRef's signature isn't itself generic-aware. The common workaround is to cast the result back to a generic function type, or to write a small typed helper function that re-declares forwardRef with the correct generic signature. This is a well-known TypeScript/React friction point, and some teams avoid it by not making ref-forwarding components generic, or by using a render-prop/function-child pattern instead.",
    code: "type ListProps<T> = {\n  items: T[];\n  renderItem: (item: T) => React.ReactNode;\n};\n\nfunction ListInner<T>(\n  { items, renderItem }: ListProps<T>,\n  ref: React.ForwardedRef<HTMLUListElement>\n) {\n  return (\n    <ul ref={ref}>\n      {items.map((item, i) => <li key={i}>{renderItem(item)}</li>)}\n    </ul>\n  );\n}\n\n// Cast to preserve generics through forwardRef\nconst List = React.forwardRef(ListInner) as <T>(\n  props: ListProps<T> & { ref?: React.ForwardedRef<HTMLUListElement> }\n) => React.ReactElement;",
    interviewQuestion:
      "You have a generic `List<T>` component that needs to forward a ref to its root element, but TypeScript collapses `T` to `unknown` once you wrap it in forwardRef. How do you fix the typing?",
  },
  {
    id: "react-strictmode-purpose",
    category: "react",
    difficulty: "Basic",
    topic: "Core Concepts",
    title: "What is the purpose of React.StrictMode?",
    summary:
      "StrictMode is a development-only wrapper that helps surface unsafe lifecycles, side effects, and deprecated APIs by adding extra checks and warnings, without rendering any visible UI.",
    explanation:
      "Wrapping part of your tree in <React.StrictMode> opts that subtree into additional development-only checks: it warns about legacy APIs (like string refs or findDOMNode), detects unexpected side effects by intentionally double-invoking component render functions, state updater functions, and certain lifecycle methods, and (in React 18) double-invokes effect setup/cleanup on mount to help you catch effects that aren't properly cleaned up. None of this runs in production builds, so it has zero runtime cost for end users — it exists purely to catch bugs early, especially ones related to impure rendering or missing cleanup that would otherwise only surface under concurrent rendering or Suspense.",
    code: "import { StrictMode } from 'react';\nimport { createRoot } from 'react-dom/client';\n\nconst root = createRoot(document.getElementById('root'));\nroot.render(\n  <StrictMode>\n    <App />\n  </StrictMode>\n);\n\n// In dev, StrictMode double-invokes render and effect setup/cleanup\n// to help surface impure renders and missing effect cleanup.",
    interviewQuestion:
      "A teammate notices their useEffect runs twice on mount only in development and asks if that's a bug. How do you explain what's happening and why it's intentional?",
  },
  {
    id: "react-form-validation-patterns",
    category: "react",
    difficulty: "Intermediate",
    topic: "Forms",
    title: "What are common patterns for form validation in React?",
    summary:
      "Form validation in React ranges from manual state-driven validation on change/blur/submit to schema-based validation with libraries like Zod or Yup, often paired with React Hook Form.",
    explanation:
      "The simplest pattern is manual: track field values and an errors object in state, validate on blur or submit, and derive error messages from custom functions. This gets unwieldy as forms grow, so many teams pair a form library (React Hook Form, Formik) with a schema validation library (Zod, Yup) so validation rules are declarative and reusable, and can be shared between client and server (e.g. validating an API payload with the same Zod schema). Key UX considerations: validating on blur rather than on every keystroke avoids annoying users while typing, but re-validating on change after a field has been touched gives fast feedback once an error is fixed; submit-time validation should always run as a final gate regardless of per-field timing, since programmatic changes or paste events can bypass blur handlers.",
    code: "import { z } from 'zod';\nimport { useForm } from 'react-hook-form';\nimport { zodResolver } from '@hookform/resolvers/zod';\n\nconst schema = z.object({\n  email: z.string().email('Invalid email'),\n  age: z.number().min(18, 'Must be 18+'),\n});\n\nfunction SignupForm() {\n  const { register, handleSubmit, formState: { errors } } = useForm({\n    resolver: zodResolver(schema),\n  });\n\n  return (\n    <form onSubmit={handleSubmit((data) => console.log(data))}>\n      <input {...register('email')} />\n      {errors.email && <p>{errors.email.message}</p>}\n      <button type=\"submit\">Sign up</button>\n    </form>\n  );\n}",
    interviewQuestion:
      "How would you design validation timing (on change, on blur, on submit) for a signup form to balance responsiveness with not annoying the user while they type?",
  },
  {
    id: "react-router-v6-basics",
    category: "react",
    difficulty: "Intermediate",
    topic: "Routing",
    title:
      "What are the key concepts in React Router v6 (nested routes, loaders)?",
    summary:
      "React Router v6 introduced nested route configuration with relative paths, an <Outlet> for rendering child routes, and data APIs like loaders and actions for fetching data before render.",
    explanation:
      "In v6, routes are typically declared as a nested object/JSX tree, and child routes render inside a parent's <Outlet /> rather than requiring exact/switch matching logic. Relative paths and relative <Link to> resolution make deeply nested route trees much simpler to reason about than v5. The newer data APIs — createBrowserRouter with loader and action functions per route — let you fetch data before a route renders (avoiding loading waterfalls and render-then-fetch spinners) and handle mutations declaratively via <Form>, with useLoaderData and useActionData hooks to access the results in the component. Error boundaries can also be scoped per route via errorElement, so a failure in a nested route doesn't crash the whole app.",
    code: "import { createBrowserRouter, RouterProvider, Outlet, useLoaderData } from 'react-router-dom';\n\nconst router = createBrowserRouter([\n  {\n    path: '/dashboard',\n    element: <DashboardLayout />,\n    children: [\n      {\n        path: 'projects/:id',\n        loader: ({ params }) => fetch(`/api/projects/${params.id}`),\n        element: <ProjectDetail />,\n      },\n    ],\n  },\n]);\n\nfunction DashboardLayout() {\n  return (\n    <div>\n      <Sidebar />\n      <Outlet />\n    </div>\n  );\n}\n\nfunction ProjectDetail() {\n  const project = useLoaderData();\n  return <h1>{project.name}</h1>;\n}",
    interviewQuestion:
      "How do React Router v6 loaders improve on the classic pattern of fetching data inside a useEffect after the route component mounts?",
  },
  {
    id: "react-testing-hooks-renderhook",
    category: "react",
    difficulty: "Intermediate",
    topic: "Testing",
    title: "How do you test a custom hook in isolation using renderHook?",
    summary:
      "renderHook from React Testing Library mounts a custom hook inside a minimal test component, giving you access to its return value and a way to trigger re-renders via act().",
    explanation:
      "Custom hooks can't be called outside a component, so testing them directly requires a harness — renderHook internally renders a throwaway component that calls your hook and exposes the return value via result.current. State updates triggered from the test (like calling a function returned by the hook) must be wrapped in act() so React flushes updates before assertions run; renderHook's rerender function lets you simulate the hook being called again with new arguments, and unmount lets you verify cleanup logic (like removing event listeners) runs correctly. This approach is preferred over testing hooks only indirectly through full components because it isolates the hook's logic from unrelated UI rendering concerns, making failures easier to pinpoint.",
    code: "import { renderHook, act } from '@testing-library/react';\n\nfunction useCounter(initial = 0) {\n  const [count, setCount] = React.useState(initial);\n  const increment = () => setCount((c) => c + 1);\n  return { count, increment };\n}\n\ntest('increments the counter', () => {\n  const { result } = renderHook(() => useCounter(5));\n\n  expect(result.current.count).toBe(5);\n\n  act(() => {\n    result.current.increment();\n  });\n\n  expect(result.current.count).toBe(6);\n});",
    interviewQuestion:
      "Why do you need to wrap state-updating calls in act() when testing a custom hook with renderHook, and what happens if you forget?",
  },
  {
    id: "react-usefetch-custom-hook",
    category: "react",
    difficulty: "Basic",
    topic: "Custom Hooks",
    title: "How do you build a reusable useFetch custom hook?",
    summary:
      "A custom hook that encapsulates loading, data, and error state for network requests behind a single reusable function.",
    explanation:
      "A useFetch hook wraps useEffect and useState to manage the lifecycle of an async request: loading, data, and error. It typically re-runs when the URL or dependencies change, and should cancel or ignore stale responses using a flag or AbortController to avoid race conditions. Returning an object like { data, loading, error } gives consumers a consistent shape. Because hooks are just functions that call other hooks, useFetch composes cleanly with useState and useEffect without violating the rules of hooks. This pattern reduces duplication across components that each need their own fetch/loading/error boilerplate.",
    code: "function useFetch(url) {\n  const [state, setState] = useState({ data: null, loading: true, error: null });\n\n  useEffect(() => {\n    let ignore = false;\n    setState({ data: null, loading: true, error: null });\n    fetch(url)\n      .then((res) => res.json())\n      .then((data) => { if (!ignore) setState({ data, loading: false, error: null }); })\n      .catch((error) => { if (!ignore) setState({ data: null, loading: false, error }); });\n    return () => { ignore = true; };\n  }, [url]);\n\n  return state;\n}\n\nfunction UserProfile({ id }) {\n  const { data, loading, error } = useFetch(`/api/users/${id}`);\n  if (loading) return <p>Loading...</p>;\n  if (error) return <p>Error: {error.message}</p>;\n  return <p>{data.name}</p>;\n}",
    interviewQuestion:
      "Walk me through designing a useFetch hook. How do you prevent it from setting state after the component unmounts or after a newer request has started?",
  },
  {
    id: "react-usedebounce-custom-hook",
    category: "react",
    difficulty: "Intermediate",
    topic: "Custom Hooks",
    title: "How do you build a useDebounce custom hook?",
    summary:
      "A hook that delays updating a value until the input has stopped changing for a specified time, useful for search inputs.",
    explanation:
      "useDebounce keeps an internal state value that only updates after a timer elapses without the source value changing again. Inside a useEffect, a setTimeout is scheduled every time the input value changes, and the cleanup function clears the previous timeout before scheduling a new one. This means only the last change within the delay window actually triggers a state update. It is commonly used to avoid firing an API call on every keystroke in a search box, deferring the expensive work until the user pauses typing.",
    code: "function useDebounce(value, delay = 300) {\n  const [debounced, setDebounced] = useState(value);\n\n  useEffect(() => {\n    const timer = setTimeout(() => setDebounced(value), delay);\n    return () => clearTimeout(timer);\n  }, [value, delay]);\n\n  return debounced;\n}\n\nfunction SearchBox() {\n  const [query, setQuery] = useState('');\n  const debouncedQuery = useDebounce(query, 400);\n\n  useEffect(() => {\n    if (debouncedQuery) console.log('Searching for', debouncedQuery);\n  }, [debouncedQuery]);\n\n  return <input value={query} onChange={(e) => setQuery(e.target.value)} />;\n}",
    interviewQuestion:
      "How would you implement debouncing in React with a custom hook, and why does the cleanup function inside useEffect matter here?",
  },
  {
    id: "react-useprevious-custom-hook",
    category: "react",
    difficulty: "Intermediate",
    topic: "Custom Hooks",
    title:
      "How do you build a usePrevious hook to track a value across renders?",
    summary:
      "A hook that stores the value a piece of state or props held during the previous render, using a ref.",
    explanation:
      "usePrevious relies on the fact that refs persist across renders without triggering re-renders when mutated. A useEffect runs after each render and updates ref.current to the latest value, but because effects run after the render commits, ref.current still holds the prior render value during the render phase itself. This makes it possible to compare current vs previous props or state, for example to detect a specific transition or to avoid running logic on the initial mount. It is a common building block for animations, transition detection, and diffing UI logic.",
    code: "function usePrevious(value) {\n  const ref = useRef();\n  useEffect(() => {\n    ref.current = value;\n  });\n  return ref.current;\n}\n\nfunction Counter({ count }) {\n  const prevCount = usePrevious(count);\n  return (\n    <p>\n      Now: {count}, Before: {prevCount === undefined ? 'N/A' : prevCount}\n    </p>\n  );\n}",
    interviewQuestion:
      "Explain how usePrevious works internally. Why does ref.current still hold the old value during the render phase even though the effect already ran on mount?",
  },
  {
    id: "react-uselocalstorage-custom-hook",
    category: "react",
    difficulty: "Intermediate",
    topic: "Custom Hooks",
    title:
      "How do you build a useLocalStorage hook that syncs state with localStorage?",
    summary:
      "A hook that behaves like useState but persists its value to localStorage and rehydrates it on mount.",
    explanation:
      "useLocalStorage lazily initializes state by reading from localStorage on first render, falling back to a default if nothing is stored or parsing fails. Every time the state setter is called, a useEffect (or the setter itself) writes the serialized value back to localStorage. Using the lazy initializer form of useState avoids reading from localStorage on every render. Edge cases include handling JSON parse errors, syncing across browser tabs via the storage event, and avoiding localStorage access during server-side rendering where window is undefined.",
    code: "function useLocalStorage(key, defaultValue) {\n  const [value, setValue] = useState(() => {\n    try {\n      const stored = window.localStorage.getItem(key);\n      return stored ? JSON.parse(stored) : defaultValue;\n    } catch {\n      return defaultValue;\n    }\n  });\n\n  useEffect(() => {\n    window.localStorage.setItem(key, JSON.stringify(value));\n  }, [key, value]);\n\n  return [value, setValue];\n}\n\nfunction ThemeToggle() {\n  const [theme, setTheme] = useLocalStorage('theme', 'light');\n  return (\n    <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>\n      Current theme: {theme}\n    </button>\n  );\n}",
    interviewQuestion:
      "How would you implement a useLocalStorage hook, and what problems can arise if you read localStorage during server-side rendering?",
  },
  {
    id: "react-server-components-vs-client",
    category: "react",
    difficulty: "Advanced",
    topic: "React Server Components",
    title:
      "What is the mental model for React Server Components vs Client Components?",
    summary:
      "Server Components render on the server with zero client-side JS shipped for them, while Client Components hydrate and run in the browser for interactivity.",
    explanation:
      'Server Components (RSC) execute only on the server, can access backend resources like databases directly, and never ship their JavaScript to the browser, which reduces bundle size. Client Components are the traditional React components marked with a "use client" directive, and they run in the browser, support hooks like useState, and handle interactivity and event handlers. Server Components can render Client Components and pass serializable props to them, but Client Components cannot import Server Components directly (though they can receive them as children). This model shifts data fetching closer to the source and keeps interactive-only logic in the client bundle, but it requires a framework like Next.js App Router with proper RSC support since RSC is not just plain React running in Node.',
    code: "// ServerComponent.jsx (no directive = Server Component by default in RSC frameworks)\nasync function ProductList() {\n  const products = await db.query('SELECT * FROM products');\n  return (\n    <ul>\n      {products.map((p) => (\n        <li key={p.id}>\n          {p.name} <AddToCartButton productId={p.id} />\n        </li>\n      ))}\n    </ul>\n  );\n}\n\n// AddToCartButton.jsx\n'use client';\nfunction AddToCartButton({ productId }) {\n  const [added, setAdded] = useState(false);\n  return <button onClick={() => setAdded(true)}>{added ? 'Added' : 'Add'}</button>;\n}",
    interviewQuestion:
      "What is the difference between a Server Component and a Client Component, and why can a Server Component render a Client Component but not vice versa?",
  },
  {
    id: "react-suspense-data-fetching",
    category: "react",
    difficulty: "Advanced",
    topic: "Suspense",
    title: "How does Suspense work for data fetching?",
    summary:
      'Suspense lets a component "pause" rendering while it waits for data, showing a fallback UI until a promise resolves.',
    explanation:
      "Suspense for data fetching works by having a component throw a promise during render when data is not yet available; React catches that thrown promise, shows the nearest Suspense fallback, and re-renders the component once the promise resolves. This requires a data-fetching mechanism built for Suspense, such as React Query with suspense mode, Relay, or the React 19 use() hook combined with a cache, rather than a plain fetch call inside useEffect. The benefit is declarative loading states composed at the tree level instead of prop-drilled loading flags, and it enables patterns like streaming SSR where different parts of the page resolve independently.",
    code: "const resource = fetchUserSuspense(userId); // returns { read() }\n\nfunction UserDetails() {\n  const user = resource.read(); // throws a promise if not ready\n  return <h2>{user.name}</h2>;\n}\n\nfunction App() {\n  return (\n    <Suspense fallback={<p>Loading user...</p>}>\n      <UserDetails />\n    </Suspense>\n  );\n}",
    interviewQuestion:
      'Explain how Suspense knows when to show a fallback versus the actual content. What does a component need to do to "suspend"?',
  },
  {
    id: "react-use-hook-react-19",
    category: "react",
    difficulty: "Advanced",
    topic: "React 19",
    title: "What does the use() hook do in React 19?",
    summary:
      "use() lets you read the value of a promise or context during render, and it can suspend the component until the promise resolves.",
    explanation:
      "Unlike other hooks, use() can be called conditionally and inside loops, because it is not a traditional hook bound by the rules-of-hooks ordering constraint in the same way. When passed a promise, it integrates with Suspense: if the promise is pending, the component suspends and the nearest Suspense boundary shows its fallback; if it rejects, the nearest error boundary catches it. When passed a Context object, use(Context) behaves like useContext but can be called conditionally. It is commonly paired with Server Components or a caching data layer since calling use() with a new promise on every render would cause an infinite loop of refetching.",
    code: "function Comments({ commentsPromise }) {\n  // Suspends until commentsPromise resolves; caught by nearest Suspense boundary\n  const comments = use(commentsPromise);\n  return (\n    <ul>\n      {comments.map((c) => <li key={c.id}>{c.text}</li>)}\n    </ul>\n  );\n}\n\nfunction Page({ commentsPromise }) {\n  return (\n    <Suspense fallback={<p>Loading comments...</p>}>\n      <Comments commentsPromise={commentsPromise} />\n    </Suspense>\n  );\n}",
    interviewQuestion:
      "How does the use() hook differ from other hooks in terms of the rules of hooks, and what happens if you pass it a freshly created promise on every render?",
  },
  {
    id: "react-compiler-auto-memoization",
    category: "react",
    difficulty: "Advanced",
    topic: "React Compiler",
    title:
      "What problem does the React Compiler solve with automatic memoization?",
    summary:
      "The React Compiler analyzes component code at build time and automatically inserts memoization, removing the need for manual useMemo, useCallback, and React.memo in most cases.",
    explanation:
      "The React Compiler is a build-time tool that understands React semantics and the rules of React (like immutability of props and state) to automatically memoize values, functions, and JSX so that components skip unnecessary re-renders and re-computations without the developer manually wrapping everything in useMemo or useCallback. It works by statically analyzing dependencies the way a developer would, then generating equivalent memoized code, effectively doing what React.memo/useMemo/useCallback do today but correctly and exhaustively. This reduces bugs caused by missing or incorrect dependency arrays, but it requires code to follow the Rules of React (no mutating props/state, no impure render logic) to produce correct optimizations, and it does not replace the need to understand memoization concepts entirely since escape hatches and edge cases still exist.",
    code: "// Without the compiler, a developer must remember this manually:\nconst filtered = useMemo(() => items.filter((i) => i.active), [items]);\nconst handleClick = useCallback(() => onSelect(filtered[0]), [filtered, onSelect]);\n\n// With the React Compiler enabled, plain code is automatically optimized:\nfunction ItemList({ items, onSelect }) {\n  const filtered = items.filter((i) => i.active); // compiler memoizes this\n  const handleClick = () => onSelect(filtered[0]); // compiler memoizes this too\n  return <button onClick={handleClick}>{filtered.length} active</button>;\n}",
    interviewQuestion:
      "What does the React Compiler do, and why does it require code to follow the Rules of React in order to optimize correctly?",
  },
  {
    id: "react-useactionstate-react-19",
    category: "react",
    difficulty: "Advanced",
    topic: "React 19",
    title:
      "What is useActionState and how does it simplify form state management?",
    summary:
      "useActionState is a React 19 hook that manages state derived from a form action, tracking the pending status and the latest returned result automatically.",
    explanation:
      "useActionState takes an action function and an initial state, and returns a wrapped action, the current state, and a pending boolean. When the wrapped action is used as a form action or called directly, React tracks the in-flight submission, automatically sets pending to true while it runs, and updates state with whatever the action function returns. This removes the need to manually manage useState for form errors/results and a separate isSubmitting flag with try/catch/finally. It integrates with the broader React 19 Actions model, including automatic form reset and works well alongside useOptimistic for instant UI feedback before the server responds.",
    code: "async function updateName(prevState, formData) {\n  const name = formData.get('name');\n  if (!name) return { error: 'Name is required' };\n  await saveName(name);\n  return { error: null, success: true };\n}\n\nfunction NameForm() {\n  const [state, formAction, isPending] = useActionState(updateName, { error: null });\n\n  return (\n    <form action={formAction}>\n      <input name=\"name\" />\n      <button disabled={isPending}>{isPending ? 'Saving...' : 'Save'}</button>\n      {state.error && <p role=\"alert\">{state.error}</p>}\n    </form>\n  );\n}",
    interviewQuestion:
      "How does useActionState differ from manually tracking form submission state with useState and try/catch/finally?",
  },
  {
    id: "react-optimistic-ui-without-libraries",
    category: "react",
    difficulty: "Advanced",
    topic: "Optimistic UI",
    title: "How do you build optimistic UI updates without a library?",
    summary:
      "Optimistic UI immediately updates the interface to reflect an expected outcome before the server confirms it, then reconciles or rolls back once the real response arrives.",
    explanation:
      'Without a library, optimistic updates are typically implemented by storing a "confirmed" state plus a locally applied pending change, updating the UI instantly on user action, firing the async request, and either merging the real server response on success or reverting the local change on failure. React 19\'s useOptimistic hook formalizes this pattern by taking a base state and a reducer-like function that merges a pending optimistic value, automatically reverting once the underlying state updates or the transition finishes. The core tradeoff is that the UI can briefly show data that turns out to be wrong if the request fails, so a clear rollback and user-facing error message is essential.',
    code: "function TodoList({ todos, addTodo }) {\n  const [optimisticTodos, addOptimisticTodo] = useOptimistic(\n    todos,\n    (state, newTodo) => [...state, { ...newTodo, pending: true }]\n  );\n\n  async function handleAdd(formData) {\n    const title = formData.get('title');\n    addOptimisticTodo({ id: Math.random(), title });\n    await addTodo(title); // reverts to real state (or shows error) once done\n  }\n\n  return (\n    <form action={handleAdd}>\n      <input name=\"title\" />\n      <ul>\n        {optimisticTodos.map((t) => (\n          <li key={t.id} style={{ opacity: t.pending ? 0.5 : 1 }}>{t.title}</li>\n        ))}\n      </ul>\n    </form>\n  );\n}",
    interviewQuestion:
      'How would you implement an optimistic update for a "like" button without any external library, and what happens if the server request fails?',
  },
  {
    id: "react-context-usereducer-mini-state-manager",
    category: "react",
    difficulty: "Intermediate",
    topic: "State Management",
    title: "How do you combine Context and useReducer as a mini state manager?",
    summary:
      "Pairing useReducer for centralized state transitions with Context for distribution creates a lightweight Redux-like store without external dependencies.",
    explanation:
      "useReducer centralizes state updates into a single reducer function that handles dispatched actions predictably, similar to Redux. Wrapping that reducer's state and dispatch function in a Context Provider lets any descendant component read state or dispatch actions without prop drilling. This pattern is often split into two contexts (one for state, one for dispatch) so that components only consuming dispatch do not re-render when state changes. It is a good middle ground for medium-complexity apps that need predictable state transitions but do not want the overhead of Redux Toolkit, though it lacks built-in features like middleware, devtools time-travel, or selector-based render optimization out of the box.",
    code: "const CartStateContext = createContext(null);\nconst CartDispatchContext = createContext(null);\n\nfunction cartReducer(state, action) {\n  switch (action.type) {\n    case 'ADD_ITEM':\n      return { ...state, items: [...state.items, action.item] };\n    case 'CLEAR':\n      return { ...state, items: [] };\n    default:\n      return state;\n  }\n}\n\nfunction CartProvider({ children }) {\n  const [state, dispatch] = useReducer(cartReducer, { items: [] });\n  return (\n    <CartStateContext.Provider value={state}>\n      <CartDispatchContext.Provider value={dispatch}>\n        {children}\n      </CartDispatchContext.Provider>\n    </CartStateContext.Provider>\n  );\n}\n\nfunction useCart() {\n  return [useContext(CartStateContext), useContext(CartDispatchContext)];\n}",
    interviewQuestion:
      "Why would you split a Context + useReducer store into separate state and dispatch contexts instead of one combined context?",
  },
  {
    id: "react-memo-comparison-function-pitfalls",
    category: "react",
    difficulty: "Tricky",
    topic: "Performance",
    title:
      "What pitfalls exist when writing a custom comparison function for React.memo?",
    summary:
      "A custom areEqual function passed to React.memo can silently cause stale UI or wasted renders if it compares props incorrectly.",
    explanation:
      "React.memo accepts an optional second argument, a function that receives prevProps and nextProps and returns true if the props are equal (meaning skip the re-render). A common mistake is inverting the boolean logic compared to shouldComponentUpdate, since memo's comparator returns true to SKIP rendering, the opposite convention from shouldComponentUpdate which returns true to render. Another pitfall is doing a shallow comparison that misses deeply nested changes, causing the component to not update when it should (a stale UI bug that is hard to trace). Comparators can also become a performance liability themselves if they do expensive deep equality checks on large objects, sometimes costing more than just re-rendering would have.",
    code: "const Row = React.memo(\n  function Row({ user }) {\n    return <div>{user.name} - {user.status}</div>;\n  },\n  (prevProps, nextProps) => {\n    // BUG: only compares id, so a status change is missed and UI goes stale\n    return prevProps.user.id === nextProps.user.id;\n  }\n);\n\n// Correct: compare every field that affects rendering\nconst FixedRow = React.memo(\n  Row,\n  (prev, next) => prev.user.id === next.user.id && prev.user.status === next.user.status\n);",
    interviewQuestion:
      "What does the return value of a React.memo comparison function mean, and how could a buggy comparator cause a component to display stale data?",
  },
  {
    id: "react-useeffect-cleanup-timing",
    category: "react",
    difficulty: "Intermediate",
    topic: "useEffect",
    title: "When exactly does the useEffect cleanup function run?",
    summary:
      "The cleanup function returned from useEffect runs before the component re-runs the effect on a dependency change, and again on unmount.",
    explanation:
      "React runs the cleanup function from the previous effect invocation right before running the next effect (when dependencies change) and also when the component unmounts. This means cleanup and the new effect run in tight succession on updates: cleanup(prevDeps) then effect(nextDeps). Understanding this timing matters for things like event listeners, subscriptions, and timers, where forgetting cleanup leads to duplicate listeners or memory leaks. In React 18 Strict Mode during development, React intentionally runs mount, cleanup, and mount again once extra to help surface effects that are not properly idempotent or cleaned up.",
    code: "function ChatRoom({ roomId }) {\n  useEffect(() => {\n    const connection = createConnection(roomId);\n    connection.connect();\n    console.log('Connected to', roomId);\n\n    return () => {\n      connection.disconnect();\n      console.log('Disconnected from', roomId);\n    };\n  }, [roomId]);\n\n  return <p>Room: {roomId}</p>;\n}\n// Switching roomId logs: Disconnected from A -> Connected to B`,\n    interviewQuestion: 'Explain the order of operations when a useEffect dependency changes: when does cleanup run relative to the next effect execution?',\n  },\n  {\n    id: 'react-useeffect-async-callback-antipattern',\n    category: 'react',\n    difficulty: 'Tricky',\n    topic: 'useEffect',\n    title: 'Why can't the useEffect callback itself be an async function?',\n    summary: 'useEffect expects its callback to return either nothing or a cleanup function, but an async function always returns a Promise, which breaks that contract.',\n    explanation: 'If you mark the function passed to useEffect as async, it implicitly returns a Promise instead of undefined or a cleanup function, and React will either ignore it or, in development, warn that an effect returned something other than a function or undefined. The correct pattern is to define an async function inside the effect and immediately invoke it (or call a named async helper), while the effect callback itself stays synchronous and returns the real cleanup function. This preserves the ability to return a proper cleanup callback and avoids React trying to treat a Promise as cleanup logic.',\n    code: `useEffect(() => {\n  // WRONG: async effect callback returns a Promise, not a cleanup function\n  // async () => { const data = await fetchData(); setData(data); }\n\n  // CORRECT: define and invoke an async function inside\n  let ignore = false;\n  async function load() {\n    const res = await fetch('/api/data');\n    const data = await res.json();\n    if (!ignore) setData(data);\n  }\n  load();\n\n  return () => { ignore = true; };\n}, []);`,\n    interviewQuestion: 'Why does React not allow the useEffect callback to be declared async, and what pattern do you use instead to perform async work inside an effect?',\n  },\n  {\n    id: 'react-race-conditions-data-fetching-effects',\n    category: 'react',\n    difficulty: 'Advanced',\n    topic: 'useEffect',\n    title: 'How do race conditions happen in data-fetching useEffects, and how do you prevent them?',\n    summary: 'When a dependency changes quickly, an earlier fetch can resolve after a later one, overwriting fresh data with stale results unless guarded against.',\n    explanation: 'If a component fetches data based on a prop like a search query or an id, and that prop changes before the previous request finishes, both requests race to call setState. Network timing is not guaranteed to match request order, so the older, slower request can resolve last and overwrite the UI with outdated data. The standard fix is to track a per-effect \"ignore\" flag or an incrementing request id set in the cleanup function, so that when a newer effect run's cleanup fires, it marks the old request as stale and its resolution is ignored. AbortController is a more robust alternative because it actually cancels the underlying network request instead of just ignoring its result.',\n    code: `function SearchResults({ query }) {\n  const [results, setResults] = useState([]);\n\n  useEffect(() => {\n    let ignore = false;\n    fetch(\\`/api/search?q=\\${query}\\`)\n      .then((res) => res.json())\n      .then((data) => {\n        if (!ignore) setResults(data); // skipped if a newer effect already ran\n      });\n    return () => { ignore = true; };\n  }, [query]);\n\n  return <ul>{results.map((r) => <li key={r.id}>{r.title}</li>)}</ul>;\n}`,\n    interviewQuestion: 'Describe a scenario where a data-fetching useEffect produces a race condition, and explain two different ways to guard against it.',\n  },\n  {\n    id: 'react-abortcontroller-in-useeffect',\n    category: 'react',\n    difficulty: 'Advanced',\n    topic: 'useEffect',\n    title: 'How do you use AbortController inside a useEffect to cancel in-flight requests?',\n    summary: 'AbortController lets you actually cancel a pending fetch request when a component unmounts or dependencies change, rather than just ignoring its result.',\n    explanation: 'AbortController exposes a signal that can be passed to fetch, and calling controller.abort() causes the fetch promise to reject with an AbortError. Inside useEffect, you create a new AbortController for each run, pass its signal to fetch, and call abort() in the cleanup function. This is more efficient than an \"ignore\" boolean flag because it stops the actual network request and any downstream work, saving bandwidth and server load, rather than letting the request complete uselessly in the background. You typically need to catch and specifically ignore AbortError in the promise chain so it does not get treated as a real error and surfaced to the user.',\n    code: `function UserDetails({ userId }) {\n  const [user, setUser] = useState(null);\n\n  useEffect(() => {\n    const controller = new AbortController();\n\n    fetch(\\`/api/users/\\${userId}\\`, { signal: controller.signal })\n      .then((res) => res.json())\n      .then(setUser)\n      .catch((err) => {\n        if (err.name !== 'AbortError') console.error(err);\n      });\n\n    return () => controller.abort();\n  }, [userId]);\n\n  return user ? <p>{user.name}</p> : <p>Loading...</p>;\n}`,\n    interviewQuestion: 'Why is using AbortController generally preferable to a boolean \"ignore\" flag when canceling requests in useEffect?',\n  },\n  {\n    id: 'react-key-reconciliation-reorder-vs-insert',\n    category: 'react',\n    difficulty: 'Advanced',\n    topic: 'Reconciliation',\n    title: 'How does React's key-based reconciliation differ between sibling reordering and insertion?',\n    summary: 'Stable keys let React match list items across renders by identity rather than position, so reordering moves existing DOM nodes and state, while insertion only creates new ones.',\n    explanation: 'When a list re-renders, React uses the key prop to match new elements to previous elements regardless of their index. If two items swap positions but keep the same keys, React recognizes them as the same logical elements and simply reorders the corresponding DOM nodes and their associated component state, rather than destroying and recreating them. If a new item is inserted with a new unique key, React creates a fresh component instance only for that key while leaving siblings with unchanged keys untouched, preserving their internal state like scroll position, input focus, or animation state. This is why array index keys break under reordering or insertion at the start/middle of a list: the index-based key gets reassigned to a different logical item, causing React to reuse the wrong DOM node and state.',\n    code: `function List({ items }) {\n  // items: [{ id: 'a', text: 'Apple' }, { id: 'b', text: 'Banana' }]\n  return (\n    <ul>\n      {items.map((item) => (\n        // Stable id key: reordering \"a\" and \"b\" moves DOM nodes, preserves state\n        <ListItem key={item.id} text={item.text} />\n      ))}\n    </ul>\n  );\n}\n\nfunction ListItem({ text }) {\n  const [expanded, setExpanded] = useState(false); // survives reordering with stable keys\n  return <li onClick={() => setExpanded((e) => !e)}>{text} {expanded && '(expanded)'}</li>;\n}`,\n    interviewQuestion: 'If you reorder items in a list with stable unique keys, does React recreate the DOM nodes? What changes if you insert a new item at the beginning of the list?',\n  },\n  {\n    id: 'react-dangerously-set-innerhtml-xss',\n    category: 'react',\n    difficulty: 'Intermediate',\n    topic: 'Security',\n    title: 'What is dangerouslySetInnerHTML and what XSS risk does it introduce?',\n    summary: 'dangerouslySetInnerHTML lets you inject raw HTML into the DOM, bypassing React's automatic escaping and opening the door to cross-site scripting if the content is not sanitized.',\n    explanation: 'By default, React escapes all values rendered in JSX, converting characters like < and > into safe entities so user-provided strings cannot inject executable markup. dangerouslySetInnerHTML opts out of that protection by setting the DOM element's innerHTML directly from a raw HTML string, which means any script tags, event handler attributes, or malicious markup in that string will be parsed and can execute in the user's browser. It is intended for narrow cases like rendering sanitized rich text from a trusted CMS or markdown renderer, and any untrusted or user-generated content must be run through a sanitization library such as DOMPurify before being passed in. The API name itself is a deliberate signal that this bypasses React's built-in safety net.',\n    code: `import DOMPurify from 'dompurify';\n\nfunction RichTextBlock({ html }) {\n  const clean = DOMPurify.sanitize(html);\n  return <div dangerouslySetInnerHTML={{ __html: clean }} />;\n}\n\n// Never do this with unsanitized user input:\n// <div dangerouslySetInnerHTML={{ __html: userComment }} />\n// A comment like <img src=x onerror=\"stealCookies()\"> would execute",
    interviewQuestion:
      "What does dangerouslySetInnerHTML bypass in React's default rendering behavior, and how would you safely render HTML that comes from user input?",
  },
  {
    id: "react-refs-as-mutable-instance-variables",
    category: "react",
    difficulty: "Basic",
    topic: "Refs",
    title:
      "How can refs be used as mutable instance variables instead of just DOM references?",
    summary:
      "A ref created with useRef can hold any mutable value across renders without triggering re-renders, functioning like an instance variable in a class component.",
    explanation:
      "useRef returns a plain object with a .current property that persists for the lifetime of the component and can be mutated directly without causing a re-render, unlike useState. This makes it useful for storing values that need to survive across renders but should never drive UI updates on their own, such as a timer id, a previous value for comparison, a WebSocket connection instance, a render count, or a flag to prevent duplicate effect execution. The tradeoff is that reading ref.current during render is unreliable for producing consistent UI, since mutating a ref does not schedule a re-render, so any value that should be reflected visually must live in state instead.",
    code: "function Stopwatch() {\n  const [elapsed, setElapsed] = useState(0);\n  const intervalRef = useRef(null); // instance-variable-like storage\n\n  function start() {\n    if (intervalRef.current !== null) return; // guard against duplicate intervals\n    intervalRef.current = setInterval(() => setElapsed((e) => e + 1), 1000);\n  }\n\n  function stop() {\n    clearInterval(intervalRef.current);\n    intervalRef.current = null;\n  }\n\n  return (\n    <div>\n      <p>{elapsed}s</p>\n      <button onClick={start}>Start</button>\n      <button onClick={stop}>Stop</button>\n    </div>\n  );\n}",
    interviewQuestion:
      "How is storing a value in a ref different from storing it in state, and why would you choose a ref for something like a timer id or previous value?",
  },
  {
    id: "react-profiler-api-programmatic",
    category: "react",
    difficulty: "Advanced",
    topic: "Performance",
    title:
      "How do you use the React Profiler API programmatically to measure render performance?",
    summary:
      "The <Profiler> component wraps part of the tree and calls an onRender callback with timing data every time that subtree commits, enabling automated performance measurement in code rather than only in DevTools.",
    explanation:
      'React exposes a <Profiler id="..." onRender={callback}> component that measures how long a subtree takes to render on each commit, distinguishing between the initial mount and subsequent updates. The onRender callback receives arguments including the phase ("mount" or "update"), actualDuration (time spent rendering the committed update), and baseDuration (estimated time to render the subtree without memoization), which can be logged, sent to analytics, or asserted on in performance tests. This is useful for catching performance regressions in CI or for building internal dashboards, as opposed to the DevTools Profiler which is primarily an interactive, manual-use tool during development.',
    code: 'function onRenderCallback(id, phase, actualDuration, baseDuration) {\n  if (actualDuration > 16) {\n    console.warn(`Slow render in "${id}" (${phase}): ${actualDuration.toFixed(2)}ms`);\n  }\n}\n\nfunction App() {\n  return (\n    <Profiler id="Dashboard" onRender={onRenderCallback}>\n      <Dashboard />\n    </Profiler>\n  );\n}',
    interviewQuestion:
      "What information does the onRender callback of the React Profiler component give you, and how could you use it to catch performance regressions automatically?",
  },
  {
    id: "react-inline-function-props-not-always-bad",
    category: "react",
    difficulty: "Tricky",
    topic: "Performance",
    title: "Why aren't inline function props always a performance problem?",
    summary:
      "Passing a new arrow function as a prop on every render only matters for performance if it defeats a memoized child's shallow prop comparison and that child's re-render is actually expensive.",
    explanation:
      "It is a common myth that inline functions like onClick={() => doThing()} are inherently bad for performance. Creating a new function on every render is cheap in JavaScript; the real cost only appears when that new function reference is passed to a child wrapped in React.memo, since the changed reference defeats memo's shallow comparison and forces a re-render of that child. Even then, the re-render is only a genuine problem if the child's render work is non-trivial. For plain DOM elements like a <button>, inline handlers cause no meaningful overhead because there is no memoization being defeated. Reaching for useCallback everywhere \"just in case\" adds its own overhead (dependency array comparisons, memory for retained closures) and can be premature optimization without profiling data showing an actual bottleneck.",
    code: "// Fine: plain DOM element, no memoized child depends on referential stability\nfunction Button({ label, onSave }) {\n  return <button onClick={() => onSave(label)}>{label}</button>;\n}\n\n// Matters: ExpensiveList is memoized, so a new onSelect reference each render\n// defeats memo and forces a full re-render of a genuinely expensive subtree\nconst ExpensiveList = React.memo(function ExpensiveList({ items, onSelect }) {\n  // heavy rendering logic here\n  return <>{items.map((i) => <Row key={i.id} item={i} onSelect={onSelect} />)}</>;\n});\n\nfunction Parent({ items }) {\n  const handleSelect = useCallback((id) => console.log(id), []); // worth memoizing here\n  return <ExpensiveList items={items} onSelect={handleSelect} />;\n}",
    interviewQuestion:
      "Is passing an inline arrow function as a prop always a performance issue? Under what specific condition does it actually matter?",
  },
  {
    id: "react-memo-usecallback-combo-pitfalls",
    category: "react",
    difficulty: "Tricky",
    topic: "Performance",
    title: "What pitfalls arise when combining React.memo with useCallback?",
    summary:
      "React.memo only prevents re-renders when every prop is referentially stable, so forgetting to memoize even one callback or object prop silently defeats the optimization.",
    explanation:
      "React.memo performs a shallow comparison of all props, so wrapping a child in memo but only wrapping some of its function props in useCallback (while leaving one inline, or passing a new object/array literal each render) still causes re-renders on every parent update, making the memoization effectively useless while adding complexity. Another pitfall is an incomplete or incorrect dependency array on useCallback, which keeps the function reference stable but causes it to close over stale state or props (a stale closure bug), trading a performance win for a correctness bug. Overusing this combo throughout a codebase where children are cheap to render can also add net overhead from the memoization bookkeeping itself, so it is best applied selectively where profiling shows real re-render cost.",
    code: "const Child = React.memo(function Child({ onClick, config }) {\n  console.log('Child rendered');\n  return <button onClick={onClick}>{config.label}</button>;\n});\n\nfunction Parent({ count }) {\n  const handleClick = useCallback(() => console.log(count), [count]); // stable per count\n  // BUG: config is a new object literal every render, defeating memo anyway\n  const config = { label: 'Click me' };\n\n  return <Child onClick={handleClick} config={config} />;\n}",
    interviewQuestion:
      "You wrapped a child component in React.memo and its onClick prop in useCallback, but it still re-renders every time. What else could be causing that?",
  },
  {
    id: "react-testing-user-event-interactions",
    category: "react",
    difficulty: "Intermediate",
    topic: "Testing",
    title:
      "How does @testing-library/user-event improve on fireEvent for testing interactions?",
    summary:
      "@testing-library/user-event simulates full user interaction sequences (like real key presses and pointer events) rather than dispatching a single synthetic DOM event, producing more realistic tests.",
    explanation:
      "fireEvent dispatches a single low-level DOM event directly, such as a click or change event, which can skip intermediate browser behavior like focus changes, hover states, or the sequence of keydown/keypress/input/keyup events that a real keystroke triggers. @testing-library/user-event simulates these interactions more faithfully by firing the full sequence of events a browser would produce, and its API is async, requiring await userEvent.click(element) or await userEvent.type(input, \"text\"), which better mirrors real user timing and catches bugs that only manifest with realistic event sequences, such as components relying on onKeyDown or focus/blur handlers. It is the recommended default for interaction testing in React Testing Library's own documentation, with fireEvent reserved for firing low-level or synthetic events that user-event doesn't model.",
    code: "import { render, screen } from '@testing-library/react';\nimport userEvent from '@testing-library/user-event';\n\ntest('submits the form when the user types and clicks', async () => {\n  const user = userEvent.setup();\n  render(<LoginForm onSubmit={mockSubmit} />);\n\n  await user.type(screen.getByLabelText(/username/i), 'sneha');\n  await user.click(screen.getByRole('button', { name: /log in/i }));\n\n  expect(mockSubmit).toHaveBeenCalledWith({ username: 'sneha' });\n});",
    interviewQuestion:
      "Why does React Testing Library recommend @testing-library/user-event over fireEvent for most interaction tests?",
  },
  {
    id: "react-msw-mock-service-worker-testing",
    category: "react",
    difficulty: "Intermediate",
    topic: "Testing",
    title:
      "What is MSW (Mock Service Worker) and why is it preferred for mocking API calls in tests?",
    summary:
      "MSW intercepts actual network requests at the network layer (via a service worker in the browser or request interception in Node) so components can be tested using their real fetch/axios code without manual mocking.",
    explanation:
      "Instead of mocking the fetch function or axios module directly, MSW defines request handlers that intercept outgoing HTTP requests based on URL and method, returning mock responses as if a real server handled them. This means the component and any data-fetching library under test run their actual network code unmodified, which produces higher-fidelity tests that catch bugs in request construction, headers, or response parsing that module-level mocks would hide. It also lets the same mock handlers be reused across unit tests, integration tests, and even local development or Storybook, avoiding duplicated and drifting mock logic scattered across the codebase.",
    code: "import { http, HttpResponse } from 'msw';\nimport { setupServer } from 'msw/node';\nimport { render, screen, waitFor } from '@testing-library/react';\n\nconst server = setupServer(\n  http.get('/api/user', () => HttpResponse.json({ name: 'Sneha' }))\n);\n\nbeforeAll(() => server.listen());\nafterEach(() => server.resetHandlers());\nafterAll(() => server.close());\n\ntest('renders fetched user name', async () => {\n  render(<UserProfile />);\n  await waitFor(() => expect(screen.getByText('Sneha')).toBeInTheDocument());\n});",
    interviewQuestion:
      "How does MSW differ from mocking the fetch function directly with jest.mock, and why might that difference matter for test reliability?",
  },
  {
    id: "react-focus-management-in-modals",
    category: "react",
    difficulty: "Tricky",
    topic: "Accessibility",
    title:
      "How do you manage focus correctly when opening and closing a modal?",
    summary:
      "Accessible modals move keyboard focus into the dialog when it opens, trap focus within it while open, and return focus to the triggering element when it closes.",
    explanation:
      'When a modal opens, focus should move to the modal itself or its first focusable element so screen reader and keyboard users are not left interacting with background content that is now visually hidden. While open, focus should be trapped inside the modal, meaning Tab and Shift+Tab cycle only through focusable elements inside it rather than escaping to the page behind it, typically enforced with a focus trap utility or by intercepting keydown events. When the modal closes, focus must be programmatically returned to the element that originally triggered it (commonly stored in a ref before opening), otherwise keyboard focus can end up reset to the top of the document, disorienting the user. The dialog should also use role="dialog" and aria-modal="true" so assistive technology understands its semantics.',
    code: 'function Modal({ isOpen, onClose, children }) {\n  const dialogRef = useRef(null);\n  const triggerRef = useRef(document.activeElement);\n\n  useEffect(() => {\n    if (isOpen) {\n      dialogRef.current?.focus();\n    } else {\n      triggerRef.current?.focus(); // return focus to the opener on close\n    }\n  }, [isOpen]);\n\n  if (!isOpen) return null;\n  return (\n    <div role="dialog" aria-modal="true" ref={dialogRef} tabIndex={-1} onKeyDown={(e) => {\n      if (e.key === \'Escape\') onClose();\n    }}>\n      {children}\n    </div>\n  );\n}',
    interviewQuestion:
      "What three focus-related behaviors does an accessible modal need to implement, and what happens for keyboard users if you skip returning focus on close?",
  },
  {
    id: "react-aria-live-regions-dynamic-content",
    category: "react",
    difficulty: "Intermediate",
    topic: "Accessibility",
    title:
      "How do ARIA live regions announce dynamic content changes to screen readers?",
    summary:
      "An element marked with aria-live tells assistive technology to announce content changes inside it automatically, even when focus is elsewhere on the page.",
    explanation:
      'By default, screen readers only announce content that receives focus or is part of the initial page read-through, so dynamically injected content like a toast notification, form validation error, or live search result count would be silently missed. Adding aria-live="polite" to a container tells the screen reader to announce updates to that region\'s content after the user\'s current activity finishes, while aria-live="assertive" interrupts immediately for urgent messages like errors. The element must exist in the DOM before the content changes (screen readers watch a live region for mutations), so a common bug is conditionally rendering the live region itself rather than keeping it mounted and just changing its text content.',
    code: 'function StatusMessage({ message }) {\n  // Kept mounted at all times; only its text content changes\n  return (\n    <div aria-live="polite" role="status" className="sr-only-visible">\n      {message}\n    </div>\n  );\n}\n\nfunction SearchResults({ results, loading }) {\n  const status = loading ? \'Searching...\' : \\`\\${results.length} results found\\`;\n  return (\n    <>\n      <StatusMessage message={status} />\n      <ul>{results.map((r) => <li key={r.id}>{r.title}</li>)}</ul>\n    </>\n  );\n}',
    interviewQuestion:
      'Why won\'t a screen reader announce a dynamically added toast notification unless it uses aria-live, and what is the difference between "polite" and "assertive"?',
  },
  {
    id: "react-usetransition-vs-debounce-search",
    category: "react",
    difficulty: "Advanced",
    topic: "Concurrent Features",
    title:
      "useTransition vs debouncing: which should you use for a search input?",
    summary:
      "useTransition keeps the input responsive by deprioritizing the expensive re-render on every keystroke, while debouncing delays even starting the work until typing pauses.",
    explanation:
      "Debouncing a search input delays firing the expensive operation (like an API call or heavy filtering) until the user stops typing for a set delay, which reduces the number of times the work runs but means results only start appearing after that delay. useTransition instead lets every keystroke update the input immediately (as a synchronous, high-priority update) while marking the resulting expensive list re-render as a low-priority transition that React can interrupt or delay if the user keeps typing, so intermediate results can still render without ever blocking the input field. In practice, these solve different problems and can be combined: debounce network requests to avoid hammering an API, while using useTransition (or useDeferredValue) to keep local rendering of large lists from janking the input, regardless of network timing.",
    code: "function SearchBox({ allItems }) {\n  const [query, setQuery] = useState('');\n  const [isPending, startTransition] = useTransition();\n  const [results, setResults] = useState(allItems);\n\n  function handleChange(e) {\n    setQuery(e.target.value); // urgent: input stays responsive immediately\n    startTransition(() => {\n      setResults(allItems.filter((i) => i.includes(e.target.value))); // low priority\n    });\n  }\n\n  return (\n    <>\n      <input value={query} onChange={handleChange} />\n      {isPending && <span>Updating...</span>}\n      <ul>{results.map((r) => <li key={r}>{r}</li>)}</ul>\n    </>\n  );\n}",
    interviewQuestion:
      "For a search-as-you-type feature, when would you reach for useTransition instead of debouncing, and can the two be used together?",
  },
  {
    id: "react-error-boundary-limitations",
    category: "react",
    difficulty: "Advanced",
    topic: "Error Boundaries",
    title: "What are the limitations of React error boundaries?",
    summary:
      "Error boundaries only catch errors thrown during rendering, in lifecycle methods, and in constructors of the tree below them — they do not catch errors in event handlers, async code, SSR, or errors in the boundary itself.",
    explanation:
      "Error boundaries (class components implementing static getDerivedStateFromError or componentDidCatch) are explicitly scoped to render-phase errors in their child tree. They do not catch errors thrown inside event handlers (like an onClick callback throwing), because those run outside React's render cycle and must be handled with a normal try/catch. They also do not catch errors in asynchronous code such as setTimeout callbacks or promise rejections inside useEffect, errors during server-side rendering, or errors thrown by the error boundary's own render method. For event handler and async errors, the common pattern is a local try/catch that sets error state, which can then be surfaced with a manual \"throw during render\" trick to hand it off to an error boundary if desired.",
    code: "class ErrorBoundary extends React.Component {\n  state = { hasError: false };\n  static getDerivedStateFromError() { return { hasError: true }; }\n  componentDidCatch(error, info) { logErrorToService(error, info); }\n  render() {\n    return this.state.hasError ? <p>Something went wrong.</p> : this.props.children;\n  }\n}\n\nfunction Button() {\n  function handleClick() {\n    try {\n      riskyOperation(); // NOT caught by an error boundary; must try/catch locally\n    } catch (err) {\n      console.error(err);\n    }\n  }\n  return <button onClick={handleClick}>Click</button>;\n}",
    interviewQuestion:
      "Name three categories of errors that a React error boundary will not catch, and explain how you would handle each.",
  },
  {
    id: "react-zustand-vs-redux-toolkit",
    category: "react",
    difficulty: "Intermediate",
    topic: "State Management",
    title:
      "What are the tradeoffs between Zustand and Redux Toolkit for state management?",
    summary:
      "Zustand offers a minimal, boilerplate-free API built on hooks with no required providers, while Redux Toolkit provides a more structured, convention-heavy architecture with stronger tooling and middleware ecosystem.",
    explanation:
      "Zustand stores are created with a single create() call that defines state and actions together in a plain function, consumed via a hook with built-in selector support so components only re-render when their selected slice changes, and it requires no Context Provider wrapping the app. Redux Toolkit enforces a more opinionated structure with slices, reducers, and actions generated via createSlice, immutable updates powered by Immer under the hood, and integrates with Redux DevTools for action-by-action time-travel debugging, plus a rich middleware ecosystem (thunks, sagas, RTK Query) suited to large teams needing consistency and traceability. Zustand tends to win for small-to-medium apps or teams wanting less ceremony, while Redux Toolkit tends to win for large codebases where strict conventions, powerful devtools, and a mature middleware ecosystem justify the extra structure.",
    code: "// Zustand: minimal store, no provider needed\nimport { create } from 'zustand';\n\nconst useCartStore = create((set) => ({\n  items: [],\n  addItem: (item) => set((state) => ({ items: [...state.items, item] })),\n}));\n\nfunction CartButton() {\n  const addItem = useCartStore((state) => state.addItem); // selector avoids extra re-renders\n  return <button onClick={() => addItem({ id: 1 })}>Add</button>;\n}\n\n// Redux Toolkit: slice-based, requires <Provider store={store}>\nconst cartSlice = createSlice({\n  name: 'cart',\n  initialState: { items: [] },\n  reducers: { addItem: (state, action) => { state.items.push(action.payload); } },\n});",
    interviewQuestion:
      "When would you choose Zustand over Redux Toolkit for a new project, and what capabilities would you be giving up?",
  },
  {
    id: "react-colocate-vs-lift-state-decision",
    category: "react",
    difficulty: "Basic",
    topic: "State Management",
    title:
      "How do you decide between colocating state locally and lifting it up?",
    summary:
      "State should live in the lowest common component that actually needs it — colocate it as deep as possible, and only lift it to a shared ancestor when multiple components must read or coordinate on that same state.",
    explanation:
      'The default heuristic is to keep state as close as possible to where it is used, since colocated state minimizes re-render scope (only that subtree re-renders on change) and keeps components easier to reason about in isolation. State should be lifted to the nearest common ancestor only when two or more sibling components need to share or synchronize the same value, such as a filter control and a list that both depend on the same search term. Lifting state too eagerly "just in case" causes unnecessary prop drilling and widens the re-render blast radius to the shared parent and all its children, while failing to lift state when needed leads to duplicated, out-of-sync copies of the same logical value. This decision should be revisited as the component tree evolves rather than decided once upfront.',
    code: "// Over-lifted: isOpen only used by Accordion, no reason for Page to own it\nfunction Page() {\n  const [isOpen, setIsOpen] = useState(false); // unnecessary lift\n  return <Accordion isOpen={isOpen} setIsOpen={setIsOpen} />;\n}\n\n// Correctly colocated\nfunction Accordion() {\n  const [isOpen, setIsOpen] = useState(false); // stays local, no one else needs it\n  return (\n    <div>\n      <button onClick={() => setIsOpen((o) => !o)}>Toggle</button>\n      {isOpen && <p>Details...</p>}\n    </div>\n  );\n}\n\n// Correctly lifted: both SearchBox and ResultsList need the same query\nfunction SearchPage() {\n  const [query, setQuery] = useState('');\n  return (\n    <>\n      <SearchBox query={query} onChange={setQuery} />\n      <ResultsList query={query} />\n    </>\n  );\n}",
    interviewQuestion:
      "What signal tells you it is time to lift state up rather than keep it colocated in a single component?",
  },
{
    id: "react-pure-components-memo-vs-purecomponent",
    category: "react",
    difficulty: "Basic",
    topic: "Performance",
    title: "React.memo vs PureComponent",
    summary: "Both skip re-renders on shallow-equal props, but one is for function components and one for classes.",
    explanation:
      "PureComponent is a class base class that implements shouldComponentUpdate with a shallow prop and state comparison. React.memo is the function-component equivalent, but it only shallow-compares props -- state and context updates inside the component still trigger re-renders normally. Neither does a deep comparison, so passing new object or array literals as props defeats both. React.memo also accepts an optional custom comparator as a second argument, which PureComponent does not support directly.",
    code: "class OldList extends React.PureComponent {\n  render() {\n    return <ul>{this.props.items.map(i => <li key={i}>{i}</li>)}</ul>;\n  }\n}\n\nconst NewList = React.memo(function NewList({ items }) {\n  return <ul>{items.map(i => <li key={i}>{i}</li>)}</ul>;\n});\n// Both skip re-render if `items` is the SAME reference",
    interviewQuestion: "What is the functional equivalent of PureComponent, and what does it actually compare?",
  },
  {
    id: "react-component-composition-patterns",
    category: "react",
    difficulty: "Intermediate",
    topic: "Patterns",
    title: "Component Composition Patterns",
    summary: "Building UI by combining small, focused components instead of configuring one large component with props.",
    explanation:
      "Composition favors passing components as children or props over adding more configuration flags to a single component. Instead of a Card component with isHeaderVisible, headerText, footerButtons, etc., you build Card as a shell that accepts arbitrary children, letting callers compose Card.Header, Card.Body, and Card.Footer as needed. This reduces prop explosion, keeps components decoupled from their content, and mirrors how HTML itself composes elements. It is the foundation behind compound components and slot-like patterns.",
    code: "function Card({ children }) {\n  return <div className='card'>{children}</div>;\n}\n\n// Composition instead of config props\nfunction Profile() {\n  return (\n    <Card>\n      <Avatar url='/me.png' />\n      <UserName>Sneha</UserName>\n      <FollowButton />\n    </Card>\n  );\n}",
    interviewQuestion: "Why is composition often preferred over adding more configuration props to a component?",
  },
  {
    id: "react-state-colocation",
    category: "react",
    difficulty: "Intermediate",
    topic: "State Management",
    title: "State Colocation",
    summary: "Keep state as close as possible to where it is used, only lifting it up when actually shared.",
    explanation:
      "State colocation means declaring state in the component that needs it rather than defaulting to a top-level store or a common ancestor. Over-lifting state causes unrelated components to re-render whenever that state changes, and makes components harder to reuse in isolation. The rule of thumb is to lift state only as far up the tree as the nearest common consumer requires, and no further. This is distinct from choosing between local state and a reducer/context, which is about state shape rather than placement.",
    code: "// Bad: search input state lives in the top-level App,\n// causing the whole page to re-render on each keystroke\nfunction App() {\n  const [query, setQuery] = useState('');\n  return (\n    <>\n      <ExpensiveDashboard />\n      <SearchBox query={query} onChange={setQuery} />\n    </>\n  );\n}\n\n// Good: state colocated inside SearchBox itself\nfunction SearchBox() {\n  const [query, setQuery] = useState('');\n  return <input value={query} onChange={e => setQuery(e.target.value)} />;\n}",
    interviewQuestion: "What performance problem does over-lifting state into a common ancestor cause?",
  },
  {
    id: "react-slot-pattern",
    category: "react",
    difficulty: "Intermediate",
    topic: "Patterns",
    title: "Slot Pattern in React",
    summary: "Exposing named 'slots' via props so a parent component can inject arbitrary content into specific regions.",
    explanation:
      "React has no built-in named-slot syntax like Vue or Web Components, so the pattern is emulated by accepting components or JSX as regular props alongside children -- e.g. header, footer, actions -- rather than a single children slot. Each slot prop is just a React node that gets rendered in a fixed layout position, giving the flexibility of composition while preserving a predictable structural skeleton. This differs from generic composition because the wrapper component still controls the layout, only the content of each region is externally supplied.",
    code: "function Modal({ header, children, footer }) {\n  return (\n    <div className='modal'>\n      <div className='modal-header'>{header}</div>\n      <div className='modal-body'>{children}</div>\n      <div className='modal-footer'>{footer}</div>\n    </div>\n  );\n}\n\n<Modal\n  header={<h2>Delete item?</h2>}\n  footer={<Button onClick={confirm}>Confirm</Button>}\n>\n  This action cannot be undone.\n</Modal>;",
    interviewQuestion: "How would you let a parent inject content into multiple distinct regions of a child component, not just `children`?",
  },
  {
    id: "react-race-conditions-data-fetching",
    category: "react",
    difficulty: "Advanced",
    topic: "Data Fetching",
    title: "Race Conditions in Data Fetching",
    summary: "When a fast-changing dependency triggers overlapping requests, an older response can resolve after a newer one and overwrite it with stale data.",
    explanation:
      "A classic example is a search box: typing 'r', then 're', then 'rea' fires three requests, but if the response for 'r' resolves last (due to network variance), the UI ends up showing results for 'r' even though the input reads 'rea'. The fix is to ignore responses that no longer correspond to the latest request, either with a boolean 'ignore' flag captured in the effect's closure, an AbortController, or a request id/token comparison. Libraries like React Query and SWR handle this internally by keying caches on the query parameters and discarding out-of-date responses automatically.",
    code: "useEffect(() => {\n  let ignore = false;\n  fetchResults(query).then(data => {\n    if (!ignore) setResults(data);\n  });\n  return () => { ignore = true; };\n}, [query]);\n// Without `ignore`, an older slow response could\n// overwrite the results of a newer, faster one",
    interviewQuestion: "How can a stale network response overwrite fresher data in the UI, and how do you prevent it?",
  },
  {
    id: "react-fetch-cancellation-patterns",
    category: "react",
    difficulty: "Intermediate",
    topic: "Data Fetching",
    title: "Fetch Cancellation Patterns",
    summary: "Aborting in-flight requests when a component unmounts or dependencies change, using AbortController.",
    explanation:
      "The fetch API accepts a signal from an AbortController; calling controller.abort() rejects the pending fetch promise with an AbortError, which you typically ignore rather than treat as a real error. In React, the idiomatic place to wire this up is the useEffect cleanup function, which runs both on unmount and before the effect re-runs due to a dependency change. This avoids setting state on an unmounted component and, combined with server-side support, can actually save bandwidth by canceling requests that are no longer needed.",
    code: "useEffect(() => {\n  const controller = new AbortController();\n  fetch(`/api/user/${id}`, { signal: controller.signal })\n    .then(res => res.json())\n    .then(setUser)\n    .catch(err => {\n      if (err.name !== 'AbortError') setError(err);\n    });\n  return () => controller.abort();\n}, [id]);",
    interviewQuestion: "How do you cancel a fetch request when a component unmounts, and why does it matter?",
  },
  {
    id: "react-infinite-scroll-implementation",
    category: "react",
    difficulty: "Intermediate",
    topic: "Performance",
    title: "Infinite Scroll Implementation",
    summary: "Loading more data automatically as the user scrolls near the bottom of a list, typically using IntersectionObserver.",
    explanation:
      "The common approach places a sentinel element at the end of the rendered list and observes it with IntersectionObserver; when it enters the viewport, the next page of data is fetched and appended. This is preferred over scroll-event listeners because IntersectionObserver is asynchronous and does not run on the main thread on every scroll tick, avoiding jank. Key edge cases are avoiding duplicate fetches while a request is already in flight, handling the 'no more pages' end state, and combining with virtualization for very large lists so the DOM node count does not grow unbounded.",
    code: "function useInfiniteScroll(loadMore, hasMore) {\n  const sentinelRef = useRef(null);\n  useEffect(() => {\n    if (!hasMore) return;\n    const observer = new IntersectionObserver(([entry]) => {\n      if (entry.isIntersecting) loadMore();\n    });\n    if (sentinelRef.current) observer.observe(sentinelRef.current);\n    return () => observer.disconnect();\n  }, [loadMore, hasMore]);\n  return sentinelRef;\n}\n// <div ref={sentinelRef} /> placed after the last list item",
    interviewQuestion: "Why is IntersectionObserver generally preferred over scroll event listeners for infinite scroll?",
  },
  {
    id: "react-window-list-virtualization-concepts",
    category: "react",
    difficulty: "Intermediate",
    topic: "Performance",
    title: "Window/List Virtualization Concepts",
    summary: "Rendering only the DOM nodes currently visible in a scrollable list, instead of every item, to keep large lists fast.",
    explanation:
      "Virtualization tracks the scroll offset and item dimensions to compute which subset of items falls within (plus a small overscan buffer around) the visible viewport, rendering only those into the DOM while using padding or absolute positioning to preserve correct total scroll height. This keeps DOM node count roughly constant regardless of list length, which matters because thousands of real DOM nodes cause slow layout, painting, and memory usage. The tradeoff is added complexity: variable-height items, dynamic measurement, keyboard navigation, and accessibility all become harder than with a naive rendered-in-full list.",
    code: "// Simplified concept, not a full implementation\nfunction VirtualList({ items, itemHeight, containerHeight }) {\n  const [scrollTop, setScrollTop] = useState(0);\n  const startIndex = Math.floor(scrollTop / itemHeight);\n  const visibleCount = Math.ceil(containerHeight / itemHeight);\n  const visibleItems = items.slice(startIndex, startIndex + visibleCount);\n  return (\n    <div style={{ height: containerHeight, overflowY: 'auto' }}\n         onScroll={e => setScrollTop(e.target.scrollTop)}>\n      <div style={{ height: items.length * itemHeight, position: 'relative' }}>\n        {visibleItems.map((item, i) => (\n          <div key={startIndex + i}\n               style={{ position: 'absolute', top: (startIndex + i) * itemHeight }}>\n            {item}\n          </div>\n        ))}\n      </div>\n    </div>\n  );\n}",
    interviewQuestion: "Conceptually, how does list virtualization keep rendering fast for a list of 100,000 items?",
  },
  {
    id: "react-window-library-usage",
    category: "react",
    difficulty: "Intermediate",
    topic: "Performance",
    title: "react-window Library Usage",
    summary: "A lightweight virtualization library providing FixedSizeList, VariableSizeList, and grid variants for rendering large lists efficiently.",
    explanation:
      "react-window is the modern, minimal successor to react-virtualized, focused on a small bundle size and a narrow API surface: FixedSizeList for uniform row heights, VariableSizeList when row sizes differ, and Fixed/VariableSizeGrid for two-dimensional data. Each list requires an explicit height, width, itemCount, and itemSize, and renders items via a render-prop child function that receives index and style -- the style object must be applied to the row's root element because it carries the computed absolute positioning. It intentionally omits built-in infinite loading, which is instead composed via the companion react-window-infinite-loader package.",
    code: "import { FixedSizeList as List } from 'react-window';\n\nfunction Row({ index, style }) {\n  return <div style={style}>Row {index}</div>;\n}\n\nfunction Example() {\n  return (\n    <List height={400} width={300} itemCount={10000} itemSize={35}>\n      {Row}\n    </List>\n  );\n}",
    interviewQuestion: "In react-window, why must the `style` prop passed to each row be applied to the rendered element?",
  },
  {
    id: "react-virtualized-vs-react-window",
    category: "react",
    difficulty: "Basic",
    topic: "Performance",
    title: "react-virtualized vs react-window",
    summary: "react-window is a smaller, simpler rewrite of react-virtualized by the same author, trading some features for bundle size and performance.",
    explanation:
      "react-virtualized came first and has a large feature set -- Masonry, ArrowKeyStepper, CellMeasurer, sortable tables -- but ships a much larger bundle and has a more complex API. react-window was built later by the same author (Brian Vaughn) as a leaner alternative covering the 90% use case (lists and grids) with a fraction of the code size, at the cost of dropping rarer components and requiring separate add-on packages for things like infinite loading or dynamic size measurement. For new projects, react-window (or newer alternatives like @tanstack/react-virtual) is generally recommended unless a specific react-virtualized-only feature is needed.",
    code: "// react-virtualized: more features, bigger bundle\nimport { List, CellMeasurer, Masonry } from 'react-virtualized';\n\n// react-window: minimal core, add-ons as needed\nimport { FixedSizeList } from 'react-window';\nimport InfiniteLoader from 'react-window-infinite-loader';\n// react-window ~ 6-7kb gzipped vs react-virtualized ~ 30kb+",
    interviewQuestion: "Why would a new project choose react-window over react-virtualized today?",
  },
  {
    id: "react-memoization-strategy-decision-making",
    category: "react",
    difficulty: "Advanced",
    topic: "Performance",
    title: "Memoization Strategy: When to memo vs Not",
    summary: "React.memo, useMemo, and useCallback all have a real cost, so they should be applied where profiling shows a measurable win, not by default.",
    explanation:
      "Every memoization adds a comparison cost and memory overhead on every render, so wrapping cheap components or trivial computations in memo/useMemo can make things slower, not faster. Good candidates are components that render often with the same props and are themselves expensive to render (large lists, charts, heavy trees), or computations that are genuinely costly (sorting/filtering large arrays). A common trap is memoizing a component whose props include an inline object, array, or function literal created fresh each render -- the memoization never hits because the reference changes every time, so the callback or object must also be memoized with useCallback/useMemo for the optimization to take effect at all.",
    code: "// Wasteful: trivial computation, unnecessary memo overhead\nconst total = useMemo(() => a + b, [a, b]);\n\n// Worthwhile: expensive computation on a large dataset\nconst sorted = useMemo(\n  () => hugeArray.slice().sort(compareFn),\n  [hugeArray, compareFn]\n);\n\n// Memo defeated: new object literal every render\n<ExpensiveChild config={{ theme: 'dark' }} />; // memo never hits\nconst config = useMemo(() => ({ theme: 'dark' }), []); // now it can",
    interviewQuestion: "What conditions justify reaching for useMemo or React.memo, and when can they actively hurt performance?",
  },
  {
    id: "react-bundle-analysis",
    category: "react",
    difficulty: "Intermediate",
    topic: "Build & Tooling",
    title: "Bundle Analysis for React Apps",
    summary: "Inspecting the production JS bundle's composition to find oversized dependencies and opportunities for code-splitting.",
    explanation:
      "Tools like source-map-explorer, webpack-bundle-analyzer, or Vite's rollup-plugin-visualizer parse the build output and its source maps to produce a treemap showing how much each module and dependency contributes to final bundle size. This surfaces problems like accidentally bundling an entire icon library instead of individual icons, duplicate versions of the same dependency, or moment.js-style libraries with huge locale data. The typical remediation steps are dynamic import() for route-level code splitting, replacing heavy dependencies with lighter alternatives, and verifying tree shaking is actually eliminating unused exports.",
    code: "// vite.config.js\nimport { visualizer } from 'rollup-plugin-visualizer';\n\nexport default {\n  plugins: [\n    visualizer({ open: true, gzipSize: true, brotliSize: true }),\n  ],\n};\n// npm run build then inspect the generated treemap HTML report",
    interviewQuestion: "How would you find out which dependency is responsible for an unexpectedly large production bundle?",
  },
  {
    id: "react-tree-shaking",
    category: "react",
    difficulty: "Intermediate",
    topic: "Build & Tooling",
    title: "Tree Shaking in React Apps",
    summary: "A bundler optimization that removes unused exports from the final bundle, relying on ES module static import/export analysis.",
    explanation:
      "Tree shaking works because ES modules have a statically analyzable import/export graph, letting bundlers like Rollup or webpack determine which exports are never referenced and drop them along with their dependencies. It breaks down with CommonJS (require/module.exports is dynamic and can't be statically analyzed), with side-effectful modules unless marked sideEffects: false in package.json, and with barrel files (index.js re-exporting everything) if the bundler can't prove individual re-exports are unused. In React apps, importing a single named export from a large utility or icon library only benefits from tree shaking if that library is authored and packaged as ESM with proper sideEffects metadata.",
    code: "// utils.js\nexport function used() { return 1; }\nexport function unused() { return 2; } // dropped by tree shaking\n\n// app.js\nimport { used } from './utils.js';\nconsole.log(used());\n\n// package.json of a library -- enables safe tree shaking\n{ \"sideEffects\": false }",
    interviewQuestion: "Why does tree shaking generally fail for CommonJS modules but work for ES modules?",
  },
  {
    id: "react-offscreen-activity-component",
    category: "react",
    difficulty: "Advanced",
    topic: "React 19+",
    title: "Offscreen API / Activity Component",
    summary: "An experimental React primitive for hiding a subtree while keeping its state and DOM alive, so it can be shown again instantly without remounting.",
    explanation:
      "The Activity component (evolved from the earlier experimental Offscreen API) lets you mark a subtree as 'hidden' rather than unmounting it -- React detaches it from the visible DOM and pauses its effects, but preserves component state and avoids the cost of re-creating DOM nodes and re-fetching data when it's shown again. This is aimed at use cases like tab panels, back/forward navigation caching, or pre-rendering the next likely screen so switching feels instant. It is distinct from CSS display:none because React also deprioritizes rendering work in hidden Activity subtrees, and distinct from simple conditional rendering because state and DOM are retained rather than destroyed.",
    code: "import { unstable_Activity as Activity } from 'react';\n\nfunction Tabs({ activeTab }) {\n  return (\n    <>\n      <Activity mode={activeTab === 'posts' ? 'visible' : 'hidden'}>\n        <PostsTab />\n      </Activity>\n      <Activity mode={activeTab === 'profile' ? 'visible' : 'hidden'}>\n        <ProfileTab />\n      </Activity>\n    </>\n  );\n}\n// Switching tabs preserves scroll position and form state",
    interviewQuestion: "How does hiding a subtree with Activity differ from simply not rendering it at all?",
  },
  {
    id: "react-cache-api-react-19",
    category: "react",
    difficulty: "Advanced",
    topic: "React 19+",
    title: "React Cache API (React 19 cache())",
    summary: "A React 19 utility that memoizes the result of a function per-request on the server, deduplicating identical calls during a single render pass.",
    explanation:
      "cache() wraps a function -- typically a data-fetching function -- so that calling it multiple times with the same arguments during one server render returns the cached result instead of re-executing the work, which is especially useful when multiple components in a tree independently need the same data (e.g. both a layout and a page component fetching the current user). It is scoped per server request, not global or persistent across requests, and is intended for use in React Server Components frameworks like Next.js's App Router rather than in client components. It is conceptually similar to request memoization patterns developers used to hand-roll with a Map keyed by arguments.",
    code: "import { cache } from 'react';\n\nconst getUser = cache(async (id) => {\n  const res = await fetch(`/api/users/${id}`);\n  return res.json();\n});\n\n// Both calls during the same render dedupe to one fetch\nasync function Layout({ userId }) {\n  const user = await getUser(userId);\n  return <Header user={user} />;\n}\nasync function Page({ userId }) {\n  const user = await getUser(userId); // cache hit, no new fetch\n  return <Profile user={user} />;\n}",
    interviewQuestion: "What problem does React's cache() function solve when multiple components need the same server data?",
  },
  {
    id: "react-error-recovery-patterns-beyond-boundaries",
    category: "react",
    difficulty: "Advanced",
    topic: "Error Handling",
    title: "Error Recovery Patterns Beyond Error Boundaries",
    summary: "Error boundaries only catch render-phase errors in descendants; real apps also need retry UIs, reset keys, and graceful degradation for async and event-handler errors.",
    explanation:
      "Error boundaries do not catch errors in event handlers, async code, server-side rendering, or errors thrown in the boundary itself, so those need explicit try/catch plus local error state instead. A common pattern pairs an error boundary with a 'resetKeys' prop (as in react-error-boundary) so that when key data like a route param changes, the boundary automatically resets and retries rendering the children instead of staying stuck on the last error. Beyond boundaries, resilient apps also use retry-with-backoff for flaky network calls, fallback UI for partial failures (show what loaded, mark what didn't), and reporting errors to a monitoring service like Sentry from both boundaries and manual catch blocks.",
    code: "import { ErrorBoundary } from 'react-error-boundary';\n\nfunction Fallback({ error, resetErrorBoundary }) {\n  return (\n    <div>\n      <p>Something went wrong: {error.message}</p>\n      <button onClick={resetErrorBoundary}>Retry</button>\n    </div>\n  );\n}\n\n<ErrorBoundary FallbackComponent={Fallback} resetKeys={[userId]}>\n  <UserProfile userId={userId} />\n</ErrorBoundary>;\n// resetKeys change -> boundary auto-resets and retries render",
    interviewQuestion: "What kinds of errors do error boundaries NOT catch, and how do you handle recovery for those?",
  },
  {
    id: "react-hydration-strategies-overview",
    category: "react",
    difficulty: "Advanced",
    topic: "SSR",
    title: "Hydration Strategies Overview",
    summary: "Different approaches to attaching interactivity to server-rendered HTML, ranging from all-at-once hydration to progressive and islands-based strategies.",
    explanation:
      "Classic full hydration walks the entire component tree and attaches event listeners in one synchronous pass, which for large apps delays interactivity even though the HTML is already visible -- this gap is sometimes called the 'uncanny valley' where the page looks ready but clicks do nothing. Alternative strategies address this: progressive hydration hydrates parts of the tree as they're needed (e.g. on viewport entry or interaction), islands architecture (Astro, Qwik-style) ships zero JS for static parts and only hydrates isolated interactive 'islands', and resumability (Qwik) skips hydration entirely by serializing enough state to resume execution on interaction. React's own concurrent renderer plus Suspense-driven streaming SSR is React's answer to selective/progressive hydration.",
    code: "// Conceptual comparison, not literal APIs\n// 1. Full hydration: hydrateRoot(document, <App />) -- all at once\n// 2. Streaming + Suspense: renderToPipeableStream lets React\n//    hydrate chunks as they arrive, prioritizing visible content\n// 3. Islands: only <Counter /> ships JS; surrounding\n//    static content stays plain HTML with no hydration cost",
    interviewQuestion: "What problem does the 'uncanny valley' of hydration refer to, and what strategies mitigate it?",
  },
  {
    id: "react-progressive-selective-hydration",
    category: "react",
    difficulty: "Advanced",
    topic: "SSR",
    title: "Progressive/Selective Hydration",
    summary: "React 18's streaming SSR hydrates Suspense boundaries independently and prioritizes hydrating whatever the user interacts with first.",
    explanation:
      "With renderToPipeableStream and Suspense boundaries around slower data-dependent sections, React can send the fast parts of the HTML immediately while streaming in the slower parts as they become ready, and each Suspense boundary hydrates independently as its JS and data arrive rather than waiting for the whole tree. If a user clicks or types inside a part of the page that hasn't hydrated yet, React 18 detects that interaction and prioritizes hydrating that boundary first, ahead of other pending boundaries, so the section the user actually cares about becomes interactive sooner. This requires wrapping slow subtrees in Suspense with a fallback and lazy-loading their client bundles.",
    code: "import { Suspense } from 'react';\n\nfunction ProductPage() {\n  return (\n    <>\n      <Header />\n      <Suspense fallback={<ReviewsSkeleton />}>\n        <Reviews />       {/* hydrates independently, streamed in */}\n      </Suspense>\n      <Suspense fallback={<RecsSkeleton />}>\n        <Recommendations /> {/* clicking here hydrates it first */}\n      </Suspense>\n    </>\n  );\n}",
    interviewQuestion: "How does React 18 decide which Suspense boundary to hydrate first when multiple are still pending?",
  },
  {
    id: "react-resource-preloading-apis",
    category: "react",
    difficulty: "Intermediate",
    topic: "Performance",
    title: "Resource Preloading APIs (preload/preinit)",
    summary: "React 19 APIs from react-dom that let components hint the browser to fetch or execute critical resources earlier, before they're actually rendered.",
    explanation:
      "preload(href, options) tells the browser to start fetching a resource (font, stylesheet, script, image) without executing or applying it yet, useful when you know a resource will be needed soon but aren't ready to use it. preinit(href, options) goes further -- it fetches AND immediately evaluates/applies the resource, appropriate for scripts or stylesheets you want active right away. Both are safe to call during render, are deduplicated by React across multiple calls with the same URL, and work by inserting the appropriate <link> or <script> tags into the document head, effectively giving imperative control over browser resource hints from within component code instead of hand-managing <head> tags.",
    code: "import { preload, preinit } from 'react-dom';\n\nfunction VideoPlayer({ posterUrl, playerScriptUrl }) {\n  // Fetch the poster image early, don't need it applied yet\n  preload(posterUrl, { as: 'image' });\n  // Fetch AND execute the player script immediately\n  preinit(playerScriptUrl, { as: 'script' });\n\n  return <div className='video-player' />;\n}",
    interviewQuestion: "What is the difference between react-dom's preload and preinit functions?",
  },
  {
    id: "react-view-transitions-api",
    category: "react",
    difficulty: "Tricky",
    topic: "React 19+",
    title: "View Transitions API with React",
    summary: "The browser's View Transitions API animates between two DOM states; React exposes a <ViewTransition> component (experimental) to trigger these transitions declaratively around state and route changes.",
    explanation:
      "The native document.startViewTransition(callback) API snapshots the current DOM, runs the callback to mutate the DOM to its new state, then cross-fades or animates between the two snapshots using CSS, all without a JS animation library. React's experimental <ViewTransition> component integrates this with React's rendering so that transitions triggered by state updates, Suspense reveals, or navigation are automatically wrapped in a view transition, and named transitions can be matched across elements (e.g. an image morphing from a list thumbnail to a detail-page hero) using a shared view-transition-name. It's tricky in interviews because it requires understanding both the underlying browser API's snapshot/animate model and how React batches the DOM mutation inside its own commit phase.",
    code: "import { unstable_ViewTransition as ViewTransition } from 'react';\n\nfunction Gallery({ selectedId }) {\n  return (\n    <ViewTransition>\n      {selectedId\n        ? <DetailImage id={selectedId} />\n        : <ThumbnailGrid />}\n    </ViewTransition>\n  );\n}\n// CSS: ::view-transition-old(root), ::view-transition-new(root)\n// control the cross-fade/animation styling",
    interviewQuestion: "How does the View Transitions API animate between two UI states without a JavaScript animation library, and how does React integrate with it?",
  },
];
