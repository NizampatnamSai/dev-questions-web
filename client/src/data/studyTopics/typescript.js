// 67 typescript topics for Study Hub.
export default [
  {
    id: "typescript-basic-types",
    category: "typescript",
    topic: "Types",
    title: "Basic types",
    difficulty: "Basic",
    summary: "string, number, boolean, null, undefined, symbol, bigint",
    explanation:
      "any disables all type checking — unsafe. unknown requires type narrowing before use — safe. Use unknown for values you don't know the type of (API responses). Never use any if avoidable.",
    code: "let a: any = 'hello';\na.toFixed(); // no error -- runtime crash!\nlet b: unknown = 'hello';\nif (typeof b === 'string') b.toUpperCase(); // safe",
    interviewQuestion: "What is the difference between unknown and any?",
  },
  {
    id: "typescript-union-intersection",
    category: "typescript",
    topic: "Types",
    title: "Union & Intersection",
    difficulty: "Intermediate",
    summary: "| and & type operators",
    explanation:
      "Union where each variant has a common literal type field (discriminant). TypeScript narrows type in switch/if blocks.",
    code: "type Shape =\n  | { kind: 'circle';    radius: number }\n  | { kind: 'rect'; width: number; height: number };\nfunction area(s: Shape) {\n  switch (s.kind) {\n    case 'circle': return Math.PI * s.radius ** 2;\n    case 'rect':   return s.width * s.height;\n  }\n}",
    interviewQuestion: "What is a discriminated union?",
  },
  {
    id: "typescript-interface-vs-type-alias",
    category: "typescript",
    topic: "Types",
    title: "Interface vs Type alias",
    difficulty: "Tricky",
    summary: "Both describe object shapes — subtle differences",
    explanation:
      "Interface: extendable (declaration merging), better error messages, prefer for public API. Type: required for unions, intersections, tuples, mapped types, computed types. In practice: either works for objects.",
    code: "interface User { name: string; }\ninterface User { age: number; } // merges! User = {name, age}\n\ntype ID = string | number; // union -- can't use interface\ntype Readonly<T> = { readonly [K in keyof T]: T[K] }; // mapped -- can't use interface",
    interviewQuestion: "When should you use interface over type?",
    comparison: {
      vs: "Type alias",
      rows: [
        { aspect: "Declaration merging", a: "yes — two interfaces with the same name merge automatically", b: "no — duplicate type names are a compile error" },
        { aspect: "Can express", a: "object/class shapes only", b: "unions, tuples, mapped types, primitives — anything" },
        { aspect: "Error messages", a: "generally clearer, since the name is preserved", b: "can show the fully expanded shape, which gets noisy for complex types" },
      ],
      takeaway: "Prefer interface for public object/class shapes (extendable, clean errors). Reach for type when you need a union, tuple, or mapped type — interface literally can't express those.",
    },
  },
  {
    id: "typescript-enums",
    category: "typescript",
    topic: "Types",
    title: "Enums",
    difficulty: "Intermediate",
    summary: "Named constants: const enum, numeric, string",
    explanation:
      "Regular enums generate runtime JavaScript (IIFE). const enums are inlined at compile time — no runtime code. Numeric enums allow reverse mapping (Direction[0] === 'Up') which can be surprising.",
    code: "// Numeric enum (generates runtime code)\nenum Direction { Up, Down, Left, Right }\nDirection.Up;    // 0\nDirection[0];    // 'Up' (reverse mapping)\n// Const enum (no runtime code)\nconst enum Status { Active = 'ACTIVE', Inactive = 'INACTIVE' }\n// String literal union (preferred by many)\ntype Status = 'ACTIVE' | 'INACTIVE';",
    interviewQuestion: "What is the problem with regular enums?",
  },
  {
    id: "typescript-generics",
    category: "typescript",
    topic: "Types",
    title: "Generics",
    difficulty: "Intermediate",
    summary: "Type parameters for reusable type-safe code",
    explanation:
      "extends limits which types can be passed. T extends keyof U means T must be a key of U.",
    code: "function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {\n  return obj[key];\n}\nfunction first<T>(arr: T[]): T | undefined { return arr[0]; }\n// Generic with default\nfunction createState<T = string>(initial: T) { return { value: initial }; }",
    interviewQuestion: "What is generic constraint with extends?",
  },
  {
    id: "typescript-utility-types",
    category: "typescript",
    topic: "Types",
    title: "Utility types",
    difficulty: "Intermediate",
    summary:
      "Partial, Required, Readonly, Pick, Omit, Record, ReturnType, Parameters",
    explanation:
      "Combine Pick/Omit with Partial: type PartialSome<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>",
    code: "type User = { id: number; name: string; email: string; role: string };\ntype Draft      = Partial<User>;                      // all optional\ntype ViewUser   = Readonly<Pick<User, 'id' | 'name'>>; // readonly subset\ntype UpdateUser = Omit<User, 'id'>;                    // no id\ntype UserMap    = Record<string, User>;                 // string-keyed map",
    interviewQuestion:
      "How do you make some fields optional and rest required?",
  },
  {
    id: "typescript-template-literal-types",
    category: "typescript",
    topic: "Types",
    title: "Template literal types",
    difficulty: "Advanced",
    summary: "String manipulation at type level",
    explanation:
      "Template literal types distribute over unions automatically: type AB = `${A}${B}` creates all A×B combinations.",
    code: "type Side    = 'top' | 'bottom' | 'left' | 'right';\ntype Padding = `padding-${Side}`;\n// 'padding-top' | 'padding-bottom' | 'padding-left' | 'padding-right'\ntype EventHandler<T extends string> = `on${Capitalize<T>}`;\ntype ClickHandler = EventHandler<'click'>; // 'onClick'",
    interviewQuestion: "How do you create all combinations of two unions?",
  },
  {
    id: "typescript-conditional-types",
    category: "typescript",
    topic: "Types",
    title: "Conditional types",
    difficulty: "Advanced",
    summary: "T extends U ? X : Y",
    explanation:
      "infer declares a type variable to extract/capture a type within a conditional type.",
    code: "type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;\ntype Awaited<T>    = T extends Promise<infer R> ? Awaited<R> : T;\ntype UnpackArray<T> = T extends Array<infer Item> ? Item : T;\ntype Flatten<T> = T extends Array<infer I> ? Flatten<I> : T;",
    interviewQuestion: "What is the infer keyword?",
  },
  {
    id: "typescript-mapped-types",
    category: "typescript",
    topic: "Types",
    title: "Mapped types",
    difficulty: "Advanced",
    summary: "Transform all properties of a type",
    explanation:
      "?: adds optional; -?: removes optional (makes required). -readonly removes readonly.",
    code: "type Mutable<T>  = { -readonly [K in keyof T]: T[K] };\ntype Required<T> = { [K in keyof T]-?: T[K] };\ntype Nullable<T> = { [K in keyof T]: T[K] | null };\n// Key remapping (as clause)\ntype Getters<T>  = { [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K] };",
    interviewQuestion:
      "What's the difference between -? and ? in mapped types?",
  },
  {
    id: "typescript-type-guards",
    category: "typescript",
    topic: "Narrowing",
    title: "Type guards",
    difficulty: "Intermediate",
    summary: "Narrow union types at runtime",
    explanation:
      "Function return type written as 'param is Type'. When function returns true, TS narrows param to that type in the calling scope.",
    code: "function isString(x: unknown): x is string {\n  return typeof x === 'string';\n}\nfunction isUser(x: unknown): x is User {\n  return typeof x === 'object' && x !== null && 'id' in x;\n}\n// Assertion function\nfunction assert(cond: unknown, msg: string): asserts cond {\n  if (!cond) throw new Error(msg);\n}",
    interviewQuestion: "What is a type predicate?",
  },
  {
    id: "typescript-satisfies-operator",
    category: "typescript",
    topic: "Types",
    title: "Satisfies operator",
    difficulty: "Advanced",
    summary: "Validate type without widening (TS 4.9+)",
    explanation:
      "Annotation widens the type to the declared type. satisfies validates but keeps the literal/inferred type — you get both type safety and exact inference.",
    code: "const palette = {\n  red:   [255, 0, 0],\n  green: '#00ff00',\n} satisfies Record<string, string | number[]>;\n// Without satisfies: palette.red would be string | number[]\n// With satisfies:    palette.red is number[] (exact type kept)\npalette.red.map(n => n); // works -- knows it's number[]",
    interviewQuestion:
      "What is the difference between : annotation and satisfies?",
  },
  {
    id: "typescript-tsconfig-json",
    category: "typescript",
    topic: "Config",
    title: "tsconfig.json",
    difficulty: "Intermediate",
    summary: "TypeScript compiler configuration",
    explanation:
      "strict enables: strictNullChecks, strictFunctionTypes, strictBindCallApply, noImplicitAny, noImplicitThis, alwaysStrict, useUnknownInCatchVariables.",
    code: '{\n  "compilerOptions": {\n    "strict": true,\n    "target": "ES2020",\n    "module": "ESNext",\n    "moduleResolution": "bundler",\n    "jsx": "react-jsx",\n    "baseUrl": ".",\n    "paths": { "@/*": ["./src/*"] },\n    "noUncheckedIndexedAccess": true\n  }\n}',
    interviewQuestion: "What does strict flag enable?",
  },
  {
    id: "typescript-never-type",
    category: "typescript",
    topic: "Types",
    title: "never type",
    difficulty: "Tricky",
    summary: "Bottom type — value that never exists",
    explanation:
      "Exhaustiveness checking in switch — if you handle all cases, the default branch has type never. Adding a new union member without handling it causes a compile error.",
    code: "type Shape = 'circle' | 'square';\nfunction process(s: Shape) {\n  switch (s) {\n    case 'circle': return 'round';\n    case 'square': return 'boxy';\n    default:\n      const _check: never = s; // Error if new case added\n      throw new Error('Unknown shape');\n  }\n}",
    interviewQuestion: "What practical use does never have?",
  },
  {
    id: "typescript-declaration-merging",
    category: "typescript",
    topic: "Types",
    title: "Declaration merging",
    difficulty: "Advanced",
    summary: "Multiple declarations of same name merge",
    explanation:
      "Add properties to an existing module's types without modifying the source. Used to extend third-party library types.",
    code: "// Add custom property to Express Request\ndeclare module 'express' {\n  interface Request {\n    user?: { id: string; role: string };\n  }\n}\n// Augment Window\ndeclare global {\n  interface Window {\n    analytics: Analytics;\n  }\n}",
    interviewQuestion: "What is module augmentation?",
  },
  {
    id: "typescript-const-assertion",
    category: "typescript",
    topic: "Types",
    title: "const assertion",
    difficulty: "Intermediate",
    summary: "as const makes values readonly literal types",
    explanation:
      "All values become their literal types (readonly). 'hello' stays 'hello' not string. Numbers stay as literal numbers. Enables type-safe config objects.",
    code: "const ROLES = ['admin', 'editor', 'viewer'] as const;\ntype Role = typeof ROLES[number]; // 'admin' | 'editor' | 'viewer'\n\nconst CONFIG = { env: 'production', port: 3000 } as const;\ntype Env = typeof CONFIG['env']; // 'production' not string",
    interviewQuestion: "What does 'as const' do to an object?",
  },
  {
    id: "typescript-structural-typing",
    category: "typescript",
    topic: "Types",
    title: "Structural typing",
    difficulty: "Tricky",
    summary: "TypeScript uses shape, not name for type compatibility",
    explanation:
      "Yes — structural typing. If the class has all required properties/methods, it's compatible even without 'implements'.",
    code: "interface Printable { print(): void; }\nclass Document {\n  print() { console.log(this.content); }\n  content = 'hello';\n}\nconst p: Printable = new Document(); // Works! Structural match",
    interviewQuestion:
      "Can you assign a class instance to an interface it doesn't implement?",
  },
  {
    id: "typescript-excess-property-checks",
    category: "typescript",
    topic: "Types",
    title: "Excess property checks",
    difficulty: "Tricky",
    summary: "Extra properties rejected on object literals only",
    explanation:
      "Object literals get 'freshness' checking — excess properties rejected. Assigning via variable bypasses this as variable is checked only for structural compatibility.",
    code: "type Point = { x: number; y: number };\nconst p: Point = { x: 1, y: 2, z: 3 }; // Error: excess 'z'\nconst obj = { x: 1, y: 2, z: 3 };\nconst p2: Point = obj; // OK: structural check only",
    interviewQuestion:
      "Why does TS reject extra props on object literals but not variables?",
  },
  {
    id: "typescript-function-overloads",
    category: "typescript",
    topic: "Types",
    title: "Function overloads",
    difficulty: "Advanced",
    summary: "Multiple call signatures for same function",
    explanation:
      "Implementation signature is internal — not callable directly. Overload signatures define the public API. Common pitfall: making implementation signature too broad.",
    code: "function format(val: string): string;\nfunction format(val: number, decimals?: number): string;\nfunction format(val: string | number, decimals = 2): string {\n  if (typeof val === 'string') return val.trim();\n  return val.toFixed(decimals);\n}\nformat('hello');   // uses first overload\nformat(3.14159, 2); // uses second overload",
    interviewQuestion:
      "Why do overload signatures differ from implementation signature?",
  },
  {
    id: "typescript-decorators-stage-3",
    category: "typescript",
    topic: "Patterns",
    title: "Decorators (Stage 3)",
    difficulty: "Advanced",
    summary: "Class/method/property metadata",
    explanation:
      "TS 5.0 implements Stage 3 TC39 proposal — different API from experimentalDecorators. Not backward compatible. Stage 3: context object, return value replaces method, no reflect-metadata needed.",
    code: "// TS 5.0+ Stage 3\nfunction log(_target: unknown, ctx: ClassMethodDecoratorContext) {\n  const name = String(ctx.name);\n  return function(this: unknown, ...args: unknown[]) {\n    console.log(`${name}(${args})`);\n    return (ctx as any).value.apply(this, args);\n  };\n}\nclass API {\n  @log async fetchUser(id: number) { return db.get(id); }\n}",
    interviewQuestion: "What changed in TS 5.0 decorators vs legacy?",
  },
  {
    id: "typescript-zod-runtime-validation",
    category: "typescript",
    topic: "Types",
    title: "Zod runtime validation",
    difficulty: "Intermediate",
    summary: "Schema validation that derives TypeScript types",
    explanation:
      "TS types are compile-time only — erased at runtime. Zod validates at runtime AND infers TS types. Use for API responses, form data, env variables.",
    code: "import { z } from 'zod';\nconst UserSchema = z.object({\n  id:    z.string().uuid(),\n  name:  z.string().min(1).max(100),\n  email: z.string().email(),\n  age:   z.number().int().min(0).optional(),\n});\ntype User = z.infer<typeof UserSchema>; // TS type from schema\nconst result = UserSchema.safeParse(apiResponse);\nif (result.success) { const user: User = result.data; }",
    interviewQuestion: "How does Zod differ from TypeScript types?",
  },
  {
    id: "typescript-type-narrowing-patterns",
    category: "typescript",
    topic: "Types",
    title: "Type narrowing patterns",
    difficulty: "Advanced",
    summary:
      "instanceof, typeof, in, discriminated unions, assertion functions",
    explanation:
      "'prop' in obj narrows to types that have that property. Works for distinguishing union members without a discriminant field.",
    code: "function handleResponse(res: SuccessResponse | ErrorResponse) {\n  if ('data' in res) {\n    console.log(res.data); // SuccessResponse\n  } else {\n    console.error(res.error); // ErrorResponse\n  }\n}\n// instanceof narrowing\nfunction handle(e: unknown) {\n  if (e instanceof ValidationError) showValidation(e.fields);\n  else if (e instanceof NetworkError) showRetry();\n  else throw e;\n}",
    interviewQuestion: "What is the in operator used for in TS narrowing?",
  },
  {
    id: "typescript-builder-pattern-with-types",
    category: "typescript",
    topic: "Patterns",
    title: "Builder pattern with types",
    difficulty: "Advanced",
    summary: "Fluent API for constructing complex objects type-safely",
    explanation:
      "Use phantom types — track which fields have been set as type parameters. The build() method is only available when all required types are set.",
    code: "class QueryBuilder<TTable extends string = never, TFields extends string = never> {\n  #table = '';\n  #fields: string[] = [];\n  from<T extends string>(table: T): QueryBuilder<T, TFields> {\n    this.#table = table;\n    return this as any;\n  }\n  select<F extends string>(...fields: F[]): QueryBuilder<TTable, F> {\n    this.#fields = fields;\n    return this as any;\n  }\n  build(this: QueryBuilder<string, string>) {\n    return `SELECT ${this.#fields.join(',')} FROM ${this.#table}`;\n  }\n}\nnew QueryBuilder().from('users').select('id','name').build();",
    interviewQuestion:
      "How do you enforce required fields at the type level with Builder?",
  },
  {
    id: "typescript-path-aliases",
    category: "typescript",
    topic: "Config",
    title: "Path aliases",
    difficulty: "Basic",
    summary: "Resolve @/ imports to src/ directory",
    explanation:
      "Two places: tsconfig.json paths (for TS type checking) and vite.config.ts resolve.alias (for bundler resolution). Both required.",
    code: "// tsconfig.json\n{ \"compilerOptions\": { \"paths\": { \"@/*\": [\"./src/*\"] } } }\n// vite.config.ts\nimport path from 'path';\nexport default defineConfig({\n  resolve: { alias: { '@': path.resolve(__dirname, 'src') } },\n});\n// Usage\nimport { Button } from '@/components/Button';",
    interviewQuestion: "How do you set up path aliases in TS + Vite?",
  },
  {
    id: "typescript-discriminated-unions-with-exhaustive-check",
    category: "typescript",
    topic: "Types",
    title: "Discriminated unions with exhaustive check",
    difficulty: "Tricky",
    summary: "Ensure all union cases are handled",
    explanation:
      "TypeScript will error at the never assignment if a new union member is added and not handled in the switch. Automated exhaustiveness checking at compile time.",
    code: "type Notification =\n  | { type: 'email'; to: string }\n  | { type: 'sms';   phone: string }\n  | { type: 'push';  deviceId: string };\nfunction send(n: Notification) {\n  switch (n.type) {\n    case 'email': sendEmail(n.to); break;\n    case 'sms':   sendSMS(n.phone); break;\n    case 'push':  sendPush(n.deviceId); break;\n    default:\n      const _: never = n; // compile error if new type added\n  }\n}",
    interviewQuestion: "Why combine discriminated unions with never?",
  },
  {
    id: "typescript-index-signatures",
    category: "typescript",
    difficulty: "Basic",
    topic: "Object Types",
    title: "What are index signatures in TypeScript?",
    summary:
      "Index signatures let you type objects whose exact property names aren't known ahead of time, but whose value types are consistent.",
    explanation:
      "An index signature is written as `[key: string]: ValueType` inside an object or interface type, and tells TypeScript that any property accessed on that object (using a string, number, or symbol key) will have the given value type. They're useful for dictionary-like structures such as lookup tables or config maps. Numeric index signatures must have a value type that is compatible with the string index signature, since JS numeric keys are coerced to strings internally. Index signatures trade away some safety, since TypeScript can't verify that a given key actually exists at runtime unless `noUncheckedIndexedAccess` is enabled.",
    code: 'interface StringMap {\n  [key: string]: number;\n}\n\nconst scores: StringMap = {\n  alice: 90,\n  bob: 85,\n};\n\nscores.carol = 78; // allowed, matches index signature\n\n// With noUncheckedIndexedAccess, this would be `number | undefined`\nconst value = scores["dave"];\nconsole.log(value);',
    interviewQuestion:
      "How do index signatures work in TypeScript, and what risk do they introduce if `noUncheckedIndexedAccess` is not enabled?",
  },
  {
    id: "typescript-readonly-and-readonly-utility",
    category: "typescript",
    difficulty: "Basic",
    topic: "Object Types",
    title: "What does readonly mean and how does Readonly<T> work?",
    summary:
      "The readonly modifier prevents reassignment of a property after initialization, and Readonly<T> applies it to every property of a type.",
    explanation:
      "Marking a property `readonly` means it can only be assigned once, typically at declaration or inside a constructor, and any later assignment produces a compile-time error. This is a compile-time-only guarantee — it does not freeze the object at runtime, so tools like Object.freeze are still needed for true runtime immutability. The built-in `Readonly<T>` utility type maps over every property of `T` and adds the `readonly` modifier, which is handy for returning defensive copies of data from functions. Note that readonly is shallow: a readonly array or object property can still have its own nested properties mutated unless those are also marked readonly.",
    code: "interface Point {\n  readonly x: number;\n  readonly y: number;\n}\n\nconst p: Point = { x: 1, y: 2 };\n// p.x = 5; // Error: Cannot assign to 'x' because it is a read-only property\n\ntype ReadonlyPoint = Readonly<Point>; // same effect, generic version\n\nfunction freezeConfig<T>(config: T): Readonly<T> {\n  return config;\n}\n\nconst cfg = freezeConfig({ retries: 3 });\n// cfg.retries = 5; // Error",
    interviewQuestion:
      "Does the readonly modifier provide runtime immutability? What's the difference between readonly and Object.freeze?",
  },
  {
    id: "typescript-tuple-types",
    category: "typescript",
    difficulty: "Basic",
    topic: "Object Types",
    title: "What are tuple types and how do they differ from arrays?",
    summary:
      "Tuples are fixed-length arrays where each position has a specific, known type, unlike regular arrays which are typed uniformly.",
    explanation:
      "A tuple type like `[string, number]` describes an array with exactly two elements, where the first must be a string and the second a number, giving position-aware type checking that a plain `Array<string | number>` cannot provide. Tuples support optional elements with `?` and rest elements with `...` for variable-length trailing types, and TypeScript 4.0+ allows labeled tuple elements for better readability in tooltips. They're commonly used to type function return values that pack multiple pieces of data, such as the `useState` hook in React which returns a `[value, setter]` tuple. Because arrays are mutable in JS, tuples can technically still be pushed to unless marked `readonly`, which breaks the fixed-length guarantee at runtime.",
    code: 'type NameAge = [name: string, age: number];\n\nfunction createUser(): NameAge {\n  return ["Alice", 30];\n}\n\nconst [name, age] = createUser();\n\ntype Coordinates = [x: number, y: number, z?: number];\nconst c1: Coordinates = [1, 2];\nconst c2: Coordinates = [1, 2, 3];\n\ntype StringsThenNumbers = [string, ...number[]];\nconst mix: StringsThenNumbers = ["a", 1, 2, 3];',
    interviewQuestion:
      "How would you type a function that returns a pair of values with different types, similar to React's useState?",
  },
  {
    id: "typescript-keyof-operator",
    category: "typescript",
    difficulty: "Intermediate",
    topic: "Advanced Types",
    title: "What does the keyof operator do?",
    summary:
      "keyof takes an object type and produces a union of its property names as string (or numeric/symbol) literal types.",
    explanation:
      "`keyof T` produces a union type of all the keys of `T`, which is extremely useful for writing generic functions that need to reference a property name safely, such as a type-safe `getProperty` function. When applied to types with index signatures, `keyof` returns the index type (e.g. `string` or `number`) rather than literal keys. `keyof` is frequently combined with generic constraints (`K extends keyof T`) so that a function can only accept keys that actually exist on the object, catching typos at compile time instead of runtime. It pairs naturally with indexed access types (`T[K]`) to describe the value type that corresponds to a given key.",
    code: 'interface Person {\n  name: string;\n  age: number;\n}\n\ntype PersonKeys = keyof Person; // "name" | "age"\n\nfunction getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {\n  return obj[key];\n}\n\nconst person: Person = { name: "Bob", age: 25 };\nconst age = getProperty(person, "age"); // number\n// getProperty(person, "email"); // Error: not assignable to keyof Person',
    interviewQuestion:
      "Write a generic, type-safe getProperty function using keyof that prevents accessing nonexistent object keys.",
  },
  {
    id: "typescript-typeof-type-queries",
    category: "typescript",
    difficulty: "Intermediate",
    topic: "Advanced Types",
    title: "What is the typeof type operator used for?",
    summary:
      "In a type position, typeof extracts the static type of a variable or constant, letting you derive types from existing values instead of duplicating them.",
    explanation:
      "TypeScript's `typeof` operator has two meanings depending on context: in an expression position it's the familiar JS runtime operator, but in a type position (e.g. `type T = typeof someValue`) it asks the compiler for the statically inferred type of that value. This is powerful for keeping types in sync with implementation — for example, deriving a union type from the keys of a runtime config object, or typing a variable identically to another without re-declaring the shape. It's often combined with `keyof` (`keyof typeof obj`) to get a union of an object's literal key names. A common pitfall is that `typeof` on a `let` variable gives the widened type, while `const` with a literal gives a narrower, more precise type.",
    code: 'const colors = {\n  red: "#ff0000",\n  green: "#00ff00",\n  blue: "#0000ff",\n} as const;\n\ntype ColorName = keyof typeof colors; // "red" | "green" | "blue"\n\nfunction getColor(name: ColorName): string {\n  return colors[name];\n}\n\nconst config = { retries: 3, timeout: 1000 };\ntype Config = typeof config; // { retries: number; timeout: number }',
    interviewQuestion:
      "How would you derive a union type of valid keys directly from an existing const object, without manually writing the union?",
  },
  {
    id: "typescript-infer-keyword",
    category: "typescript",
    difficulty: "Advanced",
    topic: "Conditional Types",
    title: "How does the infer keyword work in conditional types?",
    summary:
      "infer lets a conditional type capture and name a subpart of a type being matched, so it can be reused in the true branch.",
    explanation:
      "`infer` can only be used inside the `extends` clause of a conditional type, and it declares a new type variable that TypeScript will attempt to infer by pattern-matching against the checked type. This is the mechanism behind many built-in utility types, such as `ReturnType<T>` (`T extends (...args: any[]) => infer R ? R : never`) and `Parameters<T>`, which extract pieces of a function signature. It's especially powerful for unwrapping generic wrappers, like pulling the resolved type out of a `Promise<T>` or the element type out of an array. When a conditional type is applied to a union, it distributes over each member of the union (distributive conditional types), which can be avoided by wrapping the checked type in a tuple like `[T]`.",
    code: 'type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;\n\ntype A = UnwrapPromise<Promise<string>>; // string\ntype B = UnwrapPromise<number>; // number\n\ntype ElementType<T> = T extends (infer U)[] ? U : never;\ntype Item = ElementType<string[]>; // string\n\ntype MyReturnType<T> = T extends (...args: any[]) => infer R ? R : never;\nfunction greet() { return "hi"; }\ntype Greeting = MyReturnType<typeof greet>; // string',
    interviewQuestion:
      "How is the built-in ReturnType<T> utility implemented under the hood using infer?",
  },
  {
    id: "typescript-recursive-types",
    category: "typescript",
    difficulty: "Advanced",
    topic: "Advanced Types",
    title: "How do you define recursive types in TypeScript?",
    summary:
      "A recursive type refers to itself in its own definition, which is essential for modeling nested structures like JSON, trees, or linked lists.",
    explanation:
      "TypeScript allows type aliases (and interfaces) to reference themselves, enabling types for arbitrarily nested data such as JSON values, recursive tree/linked-list structures, or deeply nested form data. Interfaces support direct self-reference easily; type aliases can too, as long as the recursion appears inside an object, array, or union member rather than directly at the top level (a bare `type T = T` is illegal). Recursive conditional types (often paired with `infer`) can walk through nested generics, but the compiler enforces a recursion depth limit to prevent infinite loops, so extremely deep recursive types can hit 'Type instantiation is excessively deep' errors. Recursive types are the standard way to type things like a generic `DeepPartial<T>` or `DeepReadonly<T>` utility.",
    code: 'type Json =\n  | string\n  | number\n  | boolean\n  | null\n  | Json[]\n  | { [key: string]: Json };\n\nconst data: Json = {\n  name: "Alice",\n  tags: ["admin", "user"],\n  meta: { active: true, nested: { count: 1 } },\n};\n\ninterface TreeNode<T> {\n  value: T;\n  children: TreeNode<T>[];\n}\n\nconst tree: TreeNode<number> = {\n  value: 1,\n  children: [{ value: 2, children: [] }],\n};',
    interviewQuestion:
      "How would you write a TypeScript type to represent arbitrary JSON data, including nested objects and arrays?",
  },
  {
    id: "typescript-abstract-classes-vs-interfaces",
    category: "typescript",
    difficulty: "Intermediate",
    topic: "OOP",
    title: "Abstract classes vs interfaces: when do you use each?",
    summary:
      "Abstract classes can provide shared implementation and enforce a constructor contract, while interfaces are purely structural and compiled away entirely.",
    explanation:
      "An abstract class can declare abstract methods that subclasses must implement, but it can also provide concrete methods and shared state (fields), unlike an interface which only describes shape and has zero runtime footprint. Abstract classes cannot be instantiated directly, and using `abstract` on a method forces every concrete subclass to supply an implementation, which is useful for template-method patterns. Interfaces support multiple inheritance-like composition (a class can implement many interfaces but extend only one class), while abstract classes are limited to single inheritance due to JS's prototype chain. Choose an abstract class when you need to share actual code or enforce a constructor/field contract, and an interface when you only need to describe a shape that multiple unrelated classes or objects might satisfy.",
    code: 'abstract class Shape {\n  abstract area(): number;\n\n  describe(): string {\n    return `This shape has area ${this.area()}`;\n  }\n}\n\nclass Circle extends Shape {\n  constructor(private radius: number) {\n    super();\n  }\n  area(): number {\n    return Math.PI * this.radius ** 2;\n  }\n}\n\ninterface Drawable {\n  draw(): void;\n}\n\nclass Square extends Shape implements Drawable {\n  constructor(private side: number) { super(); }\n  area(): number { return this.side ** 2; }\n  draw(): void { console.log("Drawing square"); }\n}',
    interviewQuestion:
      "When would you choose an abstract class over an interface in TypeScript, given that both can describe a contract?",
  },
  {
    id: "typescript-generic-constraints",
    category: "typescript",
    difficulty: "Intermediate",
    topic: "Generics",
    title: "How do generic constraints with extends work?",
    summary:
      "Generic constraints use `extends` to restrict a type parameter to types that have a certain shape, enabling safe access to specific properties or methods.",
    explanation:
      "By default a generic type parameter `T` can be anything, which means the compiler won't let you access any properties on values of type `T`. Adding a constraint like `<T extends { length: number }>` tells TypeScript that whatever `T` ends up being, it must have at least a `length` property, so the function body can safely read `.length`. Constraints are commonly combined with `keyof` (`K extends keyof T`) to restrict one type parameter based on another, which is the foundation of type-safe property accessors. Multiple constraints can be combined using intersection types, and default type parameters (`<T = string>`) can be combined with constraints for ergonomic generic APIs.",
    code: 'interface HasLength {\n  length: number;\n}\n\nfunction logLength<T extends HasLength>(item: T): T {\n  console.log(item.length);\n  return item;\n}\n\nlogLength("hello"); // strings have .length\nlogLength([1, 2, 3]); // arrays have .length\n// logLength(42); // Error: number doesn\'t have .length\n\nfunction merge<T extends object, U extends object>(a: T, b: U): T & U {\n  return { ...a, ...b };\n}',
    interviewQuestion:
      "Why would `function logLength<T>(item: T) { return item.length; }` fail to compile, and how do you fix it with a constraint?",
  },
  {
    id: "typescript-variance-covariance-contravariance",
    category: "typescript",
    difficulty: "Tricky",
    topic: "Advanced Types",
    title: "What are covariance and contravariance in TypeScript?",
    summary:
      "Variance describes how subtyping between compound types (like arrays or functions) relates to subtyping of their component types, and it determines when one generic type can safely substitute for another.",
    explanation:
      "A type is covariant in a position if subtyping is preserved in the same direction — e.g. `Dog[]` is assignable to `Animal[]` because arrays are covariant in their element type. Function parameters are contravariant in a sound type system: a function that accepts `Animal` can be used where a function accepting `Dog` is expected, because it can handle at least as much as required, though TypeScript's default (non-strict) behavior actually allows unsound bivariant method parameter checks for practical reasons. Enabling `strictFunctionTypes` makes standalone function type parameters properly contravariant (stricter checking), while method shorthand syntax remains bivariant for compatibility with common OOP override patterns. Understanding variance explains why `(dog: Dog) => void` is NOT assignable to `(animal: Animal) => void` under strict mode, even though it feels intuitive — the parameter direction is flipped compared to return types.",
    code: 'class Animal { name = "animal"; }\nclass Dog extends Animal { breed = "dog"; }\n\n// Covariance: Dog[] is a subtype of Animal[]\nconst dogs: Dog[] = [new Dog()];\nconst animals: Animal[] = dogs; // OK, arrays are covariant\n\n// Contravariance with strictFunctionTypes enabled:\ntype AnimalHandler = (a: Animal) => void;\ntype DogHandler = (d: Dog) => void;\n\nlet handleAnimal: AnimalHandler = (a) => console.log(a.name);\nlet handleDog: DogHandler = handleAnimal; // OK: can handle any Animal, including Dog\n\n// handleAnimal = (d: Dog) => console.log(d.breed); // Error under strictFunctionTypes',
    interviewQuestion:
      "Why does TypeScript reject assigning a function that only accepts a subtype (Dog) to a variable typed to accept the supertype (Animal), when strictFunctionTypes is enabled?",
  },
  {
    id: "typescript-module-augmentation",
    category: "typescript",
    difficulty: "Advanced",
    topic: "Modules",
    title: "How does module augmentation work?",
    summary:
      "Module augmentation lets you add new members to an existing module's exported types from outside that module, commonly used to extend third-party library types.",
    explanation:
      "Using `declare module \"module-name\" { ... }` in a `.d.ts` (or any file with an import/export making it a module) reopens an already-declared module and merges additional declarations into it, which is how libraries like Express or Redux allow consumers to extend their core types (e.g. adding custom properties to `Request`). This relies on TypeScript's declaration merging rules — interfaces with the same name in the same module scope merge their members rather than conflicting. Augmentation must target the exact module specifier string used in imports, and the augmenting file needs at least one top-level `import` or `export` to be treated as a module rather than a global script. It's the standard pattern for typing global libraries attached to `window`, or for adding fields to a third-party interface without forking the library.",
    code: '// express.d.ts\nimport "express";\n\ndeclare module "express" {\n  interface Request {\n    userId?: string;\n  }\n}\n\n// usage.ts\nimport { Request, Response } from "express";\n\nfunction handler(req: Request, res: Response) {\n  console.log(req.userId); // now type-checked, no error\n  res.send("ok");\n}',
    interviewQuestion:
      "How would you add a custom `userId` field to Express's Request type without modifying the library's own type definitions?",
  },
  {
    id: "typescript-namespaces-vs-modules",
    category: "typescript",
    difficulty: "Intermediate",
    topic: "Modules",
    title: "Namespaces vs ES modules: what's the difference?",
    summary:
      "Namespaces are a TypeScript-specific way to group code under a single global name, while ES modules use file-based import/export and are the modern standard.",
    explanation:
      "Namespaces (formerly called 'internal modules') use the `namespace` keyword to group related code and avoid global naming collisions, compiling down to nested objects assigned to a shared global variable, which predates ES modules being widely supported. ES modules, in contrast, use `import`/`export` syntax, are file-scoped by default, support static analysis and tree-shaking by bundlers, and are the standard used across the modern JS ecosystem including Node.js and bundler tooling. Namespaces still have a legitimate niche today for organizing large ambient type declarations (like typing a big global library with many nested APIs) or in projects without a module bundler, but for application code, ES modules are strongly preferred since they enable better tooling, dead-code elimination, and interop with the broader JS ecosystem. Mixing namespaces with modules is possible but generally discouraged as it complicates the mental model of scoping.",
    code: '// Namespace style (legacy, still used for typing large global APIs)\nnamespace Validation {\n  export interface Validator {\n    isValid(value: string): boolean;\n  }\n  export class EmailValidator implements Validator {\n    isValid(value: string): boolean {\n      return value.includes("@");\n    }\n  }\n}\nconst v = new Validation.EmailValidator();\n\n// ES module style (modern, preferred)\n// validators.ts\nexport interface Validator {\n  isValid(value: string): boolean;\n}\nexport class EmailValidator implements Validator {\n  isValid(value: string): boolean {\n    return value.includes("@");\n  }\n}\n// consumer.ts\n// import { EmailValidator } from "./validators";',
    interviewQuestion:
      "In modern TypeScript projects, why are ES modules generally preferred over namespaces, and when might namespaces still be appropriate?",
  },
  {
    id: "typescript-as-const-vs-literal-types",
    category: "typescript",
    difficulty: "Intermediate",
    topic: "Type Inference",
    title: "How does as const differ from explicitly declared literal types?",
    summary:
      "as const infers the narrowest possible literal types for an entire expression and makes it deeply readonly, while manually typed literals only narrow the specific annotation you write.",
    explanation:
      'By default, TypeScript widens literal values in `let`/mutable contexts and even in object literals — `{ status: "active" }` infers `status: string`, not the literal `"active"`. Appending `as const` after an expression tells the compiler to infer the most specific literal type possible for every part of that expression and additionally makes arrays and object properties `readonly`. This differs from manually annotating a single literal type (`const status: "active" = "active"`), which only narrows that one declaration rather than recursively narrowing a nested structure. `as const` is especially useful for defining fixed configuration objects, enum-like string unions derived via `keyof typeof`, or tuple literals that should not be widened to a generic array type.',
    code: '// Without as const — widened\nconst config1 = { env: "production", retries: 3 };\n// type: { env: string; retries: number }\n\n// With as const — deeply narrowed and readonly\nconst config2 = { env: "production", retries: 3 } as const;\n// type: { readonly env: "production"; readonly retries: 3 }\n\nconst directions = ["up", "down", "left", "right"] as const;\ntype Direction = typeof directions[number]; // "up" | "down" | "left" | "right"\n\n// config2.env = "staging"; // Error: readonly property',
    interviewQuestion:
      "What's the practical difference between `const x = { role: 'admin' }` and `const x = { role: 'admin' } as const`, and why does it matter for function calls expecting literal types?",
  },
  {
    id: "typescript-non-null-assertion-operator",
    category: "typescript",
    difficulty: "Basic",
    topic: "Type Assertions",
    title: "What does the non-null assertion operator (!) do?",
    summary:
      "The postfix ! operator tells the compiler to treat a value as definitely not null or undefined, suppressing strict-null-check errors without any runtime check.",
    explanation:
      "When `strictNullChecks` is on, TypeScript tracks `null` and `undefined` as distinct from other types and requires you to narrow them away before use. The non-null assertion operator, written as a trailing `!`, is a compile-time-only assertion that removes `null`/`undefined` from a value's type without performing any actual runtime check — if you're wrong, the code will throw at runtime just like normal JS would. It's commonly used with DOM APIs (`document.getElementById(\"app\")!`) where the developer has external knowledge the compiler lacks, but overusing it defeats the purpose of strict null checking and can hide real bugs. A safer alternative is often explicit narrowing (`if (value) { ... }`) or the optional chaining/nullish coalescing operators (`?.`, `??`) which handle the null case gracefully instead of asserting it away.",
    code: 'function getElement(id: string): HTMLElement {\n  // getElementById returns HTMLElement | null\n  return document.getElementById(id)!; // asserts it\'s never null\n}\n\ninterface User {\n  profile?: { bio: string };\n}\n\nfunction printBio(user: User) {\n  // Unsafe if profile is actually undefined at runtime\n  console.log(user.profile!.bio);\n\n  // Safer alternative:\n  console.log(user.profile?.bio ?? "No bio");\n}',
    interviewQuestion:
      "What's the risk of overusing the non-null assertion operator (!), and what safer alternatives exist?",
  },
  {
    id: "typescript-definite-assignment-assertion",
    category: "typescript",
    difficulty: "Intermediate",
    topic: "Type Assertions",
    title:
      "What is the definite assignment assertion (!) on class properties and variables?",
    summary:
      "The definite assignment assertion tells TypeScript that a property or variable will be assigned before use, even though the compiler can't prove it through direct analysis.",
    explanation:
      "When `strictPropertyInitialization` is enabled, TypeScript requires class properties to either have a default value, be assigned in the constructor, or be marked optional — otherwise it errors that the property has no initializer. Writing `propertyName!: Type` (a `!` right after the identifier, before the colon) tells the compiler to skip that check because the property will definitely be assigned elsewhere, such as in a lifecycle method or dependency-injection setup that the compiler can't statically trace. The same syntax applies to variables declared without initialization, e.g. `let x!: number;`, when you know a subsequent code path (like a loop or callback) will assign it before it's read. This is different from the non-null assertion operator used on expressions — it's applied at the declaration site to bypass initialization checks, and like other assertions, it provides no runtime guarantee, so misuse can lead to genuine undefined-value bugs.",
    code: "class UserService {\n  // Assigned in ngOnInit()/init(), not the constructor\n  private apiClient!: ApiClient;\n\n  init(client: ApiClient) {\n    this.apiClient = client;\n  }\n\n  fetchUser(id: string) {\n    return this.apiClient.get(`/users/${id}`);\n  }\n}\n\nlet config!: { retries: number };\n\nfunction loadConfig() {\n  config = { retries: 3 };\n}\nloadConfig();\nconsole.log(config.retries); // compiler trusts it's assigned",
    interviewQuestion:
      "You have a class property that's initialized in a lifecycle method rather than the constructor, and strictPropertyInitialization is throwing an error. How do you resolve it correctly?",
  },
  {
    id: "typescript-unknown-vs-any",
    category: "typescript",
    difficulty: "Basic",
    topic: "Type System Basics",
    title: "What's the difference between unknown and any?",
    summary:
      "any disables type checking entirely for a value, while unknown is a type-safe counterpart that requires narrowing before you can perform operations on it.",
    explanation:
      "`any` opts a value out of the type system completely — you can call methods on it, access arbitrary properties, or assign it to anything, and TypeScript won't complain, which effectively reintroduces the risks of plain JavaScript. `unknown` is the type-safe alternative: a value of type `unknown` can hold anything (like `any`), but you cannot call methods, access properties, or perform most operations on it until you've narrowed its type using `typeof`, `instanceof`, a type guard, or an assertion. This makes `unknown` the correct choice for representing genuinely unknown external data, such as the result of `JSON.parse` or a caught error in a `catch` block, since it forces callers to validate before use. As a best practice, prefer `unknown` over `any` whenever possible, and reserve `any` for rare cases like gradual migration from JS or deliberately opting out of checking for a specific reason.",
    code: 'function parseJson(text: string): unknown {\n  return JSON.parse(text);\n}\n\nconst data = parseJson(\'{"name":"Alice"}\');\n// data.name; // Error: \'data\' is of type \'unknown\'\n\nif (typeof data === "object" && data !== null && "name" in data) {\n  console.log((data as { name: string }).name); // now safe to use\n}\n\nfunction risky(value: any) {\n  value.foo.bar.baz(); // No compile error, but may crash at runtime\n}',
    interviewQuestion:
      "Why is unknown considered safer than any, and how would you refactor a function that returns any from JSON.parse to use unknown instead?",
    comparison: {
      vs: "any",
      rows: [
        { aspect: "Type checking", a: "fully disabled — TypeScript won't catch any mistakes on this value", b: "fully enforced — you must narrow the type before using it" },
        { aspect: "Calling methods/props", a: "allowed on anything, even if it crashes at runtime", b: "blocked until you narrow via typeof/instanceof/a type guard" },
        { aspect: "Right tool for", a: "rare deliberate opt-outs, or gradual JS→TS migration", b: "genuinely unknown external data — JSON.parse results, caught errors" },
      ],
      takeaway: "Default to unknown for anything from the outside world (API responses, JSON.parse, catch blocks) — it forces validation. Reserve any for rare, deliberate escape hatches.",
    },
  },
  {
    id: "typescript-indexed-access-types",
    category: "typescript",
    difficulty: "Intermediate",
    topic: "Advanced Types",
    title: "What are indexed access types?",
    summary:
      "Indexed access types use T[K] syntax to extract the type of a specific property from another type, similar to how you'd access a value at runtime.",
    explanation:
      'Just as `obj["key"]` retrieves a value at runtime, `T["key"]` at the type level retrieves the type of that property from type `T`, which is useful for deriving sub-types without duplicating definitions. Indexed access also works with unions of keys (`T["a" | "b"]`) to get a union of those properties\' types, and with `keyof T` (`T[keyof T]`) to get a union of all property value types on the object. It\'s especially powerful combined with arrays: `T[number]` extracts the element type of an array or tuple type `T`, which is how you\'d get the union of literal values from a `readonly` tuple created with `as const`. This pattern avoids type duplication and keeps derived types automatically in sync when the source type changes.',
    code: 'interface ApiResponse {\n  data: { id: number; name: string };\n  status: number;\n  errors: string[];\n}\n\ntype ResponseData = ApiResponse["data"]; // { id: number; name: string }\ntype StatusOrErrors = ApiResponse["status" | "errors"]; // number | string[]\n\nconst roles = ["admin", "editor", "viewer"] as const;\ntype Role = typeof roles[number]; // "admin" | "editor" | "viewer"\n\ntype ErrorItem = ApiResponse["errors"][number]; // string',
    interviewQuestion:
      "Given an interface with a nested `data` property, how would you extract just the type of that nested property without redefining it?",
  },
  {
    id: "typescript-template-literal-type-manipulation",
    category: "typescript",
    difficulty: "Advanced",
    topic: "Template Literal Types",
    title:
      "How can you manipulate string literal types with template literal types and intrinsic string manipulation types?",
    summary:
      "Template literal types can combine literal unions to generate new string unions, and TypeScript's built-in Uppercase, Lowercase, Capitalize, and Uncapitalize types transform string literal casing at the type level.",
    explanation:
      'Template literal types let you build new string literal types by interpolating other types into a template, similar to JS template strings but operating purely on types — for example, combining a union of event names with a prefix to generate a union of handler names. When a union type is interpolated into a template literal type, TypeScript distributes over every combination, producing the cross-product of possible strings, which is how you can generate types like `"on:click" | "on:hover"` from `"click" | "hover"`. The compiler also ships intrinsic string manipulation types — `Uppercase<S>`, `Lowercase<S>`, `Capitalize<S>`, and `Uncapitalize<S>` — that transform the casing of string literal types at compile time, useful for generating consistent naming conventions such as event handler prop names from event names. These features are frequently combined with mapped types to auto-generate typed APIs, such as deriving `{ onClick: () => void }` from `{ click: Event }`.',
    code: 'type EventName = "click" | "hover" | "focus";\ntype HandlerName = `on${Capitalize<EventName>}`;\n// "onClick" | "onHover" | "onFocus"\n\ntype CssProperty = "color" | "background";\ntype CssVariable = `--${CssProperty}`;\n// "--color" | "--background"\n\ntype Loud = Uppercase<"hello">; // "HELLO"\ntype Quiet = Lowercase<"HELLO">; // "hello"\n\ntype Handlers = {\n  [K in EventName as `on${Capitalize<K>}`]: (event: K) => void;\n};\n// { onClick: (event: "click") => void; onHover: ...; onFocus: ... }',
    interviewQuestion:
      "Given a union of event names like 'click' | 'hover', how would you generate a union or object type of corresponding handler prop names like 'onClick' | 'onHover' using template literal types?",
  },
  {
    id: "typescript-distributive-conditional-types",
    category: "typescript",
    difficulty: "Advanced",
    topic: "Conditional Types",
    title: "What are distributive conditional types?",
    summary:
      "When a conditional type checks against a naked type parameter and that parameter is a union, TypeScript applies the conditional to each member of the union separately.",
    explanation:
      "Distribution only happens when the checked type is a bare, unwrapped generic parameter (e.g. `T extends U ? X : Y`). If you wrap `T` in a tuple like `[T] extends [U]`, distribution is suppressed and the union is treated as a single type. This behavior underlies utilities like `Exclude` and `Extract`, which rely on the union splitting apart, running the conditional on each member, then re-joining the results. Understanding when distribution triggers versus when it is opted out of is a common source of subtle bugs in generic library code.",
    code: "type ToArray<T> = T extends any ? T[] : never;\n\ntype A = ToArray<string | number>; // string[] | number[]\n\n// Suppressing distribution with a tuple wrapper\ntype ToArrayNonDist<T> = [T] extends [any] ? T[] : never;\ntype B = ToArrayNonDist<string | number>; // (string | number)[]",
    interviewQuestion:
      "Explain why `ToArray<string | number>` produces `string[] | number[]` instead of `(string | number)[]`, and how you would prevent that distribution.",
  },
  {
    id: "typescript-recursive-conditional-accumulator",
    category: "typescript",
    difficulty: "Advanced",
    topic: "Conditional Types",
    title: "How do recursive conditional types with an accumulator work?",
    summary:
      "Recursive conditional types can carry a hidden accumulator type parameter to build up a result across each recursive step, similar to tail recursion in functional programming.",
    explanation:
      "Since TypeScript 4.1+, conditional types can recurse, but naive recursion (like directly recursing on the result) can be inefficient or hit the recursion depth limit. The accumulator pattern threads an extra generic parameter that collects partial results at each step, so the final answer is produced in one pass rather than being rebuilt via nested conditional evaluation. This pattern is used heavily in type-level string manipulation, such as reversing a tuple or joining a tuple of strings into a template literal.",
    code: "type Reverse<T extends unknown[], Acc extends unknown[] = []> =\n  T extends [infer Head, ...infer Rest]\n    ? Reverse<Rest, [Head, ...Acc]>\n    : Acc;\n\ntype R = Reverse<[1, 2, 3]>; // [3, 2, 1]",
    interviewQuestion:
      "Why does the `Reverse<T, Acc>` type use a second generic parameter instead of just recursing on `Reverse<Rest>` and reassembling the array?",
  },
  {
    id: "typescript-branded-nominal-types",
    category: "typescript",
    difficulty: "Advanced",
    topic: "Type System Design",
    title: "What are branded (nominal) types and why use them?",
    summary:
      "Branded types simulate nominal typing in TypeScript’s structurally-typed system by tagging a base type with a unique, unused property so distinct semantic types are not interchangeable even if their shape is identical.",
    explanation:
      "TypeScript uses structural typing, meaning a `UserId` and a `ProductId` that are both plain strings are freely assignable to one another, which can lead to bugs like passing a product ID where a user ID was expected. Branding adds a phantom property (often via an intersection with a unique symbol or literal tag) that exists only at the type level, forcing values to be explicitly cast or constructed through a factory function. This gives compile-time safety similar to nominal typing in languages like Java or C#, without any runtime cost since the brand field never actually exists on real objects.",
    code: "type UserId = string & { readonly __brand: 'UserId' };\ntype ProductId = string & { readonly __brand: 'ProductId' };\n\nfunction toUserId(id: string): UserId {\n  return id as UserId;\n}\n\nfunction getUser(id: UserId) { /* ... */ }\n\nconst pid = 'p-123' as ProductId;\n// getUser(pid); // Error: ProductId not assignable to UserId\ngetUser(toUserId('u-123')); // OK",
    interviewQuestion:
      "How would you prevent two different string-based ID types from being accidentally swapped, given that TypeScript uses structural typing?",
  },
  {
    id: "typescript-this-parameter-typing",
    category: "typescript",
    difficulty: "Intermediate",
    topic: "Functions",
    title: "How does TypeScript type the `this` parameter in functions?",
    summary:
      "TypeScript allows an explicit, fake `this` parameter as the first parameter in a function signature purely for type-checking the calling context, and it is erased at compile time.",
    explanation:
      "Declaring `function foo(this: SomeType, ...)` tells the compiler what `this` must be bound to when the function is called, catching errors where a method is detached from its object and invoked with the wrong context (e.g. as an event handler). It does not add a real parameter to the emitted JavaScript. This is especially useful for callback-heavy APIs and for typing plain functions used with `.call`, `.apply`, or `.bind`. Combined with `noImplicitThis` in tsconfig, it prevents accidental use of an untyped or incorrectly typed `this`.",
    code: "interface Button {\n  label: string;\n  onClick(this: Button, event: Event): void;\n}\n\nfunction handleClick(this: Button, event: Event) {\n  console.log(this.label);\n}\n\nconst btn: Button = { label: 'Save', onClick: handleClick };\nbtn.onClick.call(btn, new Event('click'));",
    interviewQuestion:
      "What does adding a `this: SomeType` first parameter to a function declaration do, and why does it not appear when you call the function?",
  },
  {
    id: "typescript-overload-resolution-order",
    category: "typescript",
    difficulty: "Tricky",
    topic: "Functions",
    title: "How does TypeScript resolve which overload signature to use?",
    summary:
      "TypeScript picks the first overload signature (top to bottom) in the declaration list whose parameters are compatible with the call, not necessarily the most specific one.",
    explanation:
      "Because resolution is order-dependent rather than based on best-fit matching, overload signatures must be listed from most specific to least specific, or a more general overload higher up will shadow a more specific one below it, causing the wrong return type to be inferred. The implementation signature (the one with a body) is not part of the overload set visible to callers and must be compatible with all the public overloads. This is a frequent source of confusing type errors when overloads are declared in the wrong order.",
    code: "function process(input: string): string[];\nfunction process(input: number): number[];\nfunction process(input: string | number): string[] | number[] {\n  return typeof input === 'string' ? input.split('') : [input];\n}\n\nconst a = process('hi'); // string[]\nconst b = process(5);    // number[]\n// Reordering overloads with a looser 'any' signature first\n// would break correct inference for callers.",
    interviewQuestion:
      "If you declare a more general overload signature before a more specific one, what problem can occur, and how does TypeScript choose which overload applies to a given call?",
  },
  {
    id: "typescript-partial-required-from-scratch",
    category: "typescript",
    difficulty: "Intermediate",
    topic: "Utility Types",
    title: "How would you implement Partial and Required from scratch?",
    summary:
      "Partial and Required are mapped types that toggle the optional modifier `?` on every property of an object type using the `+?`/`-?` mapping modifiers.",
    explanation:
      "A mapped type iterates `[K in keyof T]` and can apply modifiers to change optionality (`?`/`-?`) or readonly-ness (`readonly`/`-readonly`) independently for each key. `Partial<T>` adds `?` to every property (making it optional), while `Required<T>` strips `?` using `-?`, forcing every property to be present. These are structural transformations with no runtime behavior; they only affect the type checker. Writing them from scratch demonstrates a solid understanding of mapped type modifier syntax, which also underlies `Readonly<T>` and `Mutable<T>` implementations.",
    code: "type MyPartial<T> = {\n  [K in keyof T]?: T[K];\n};\n\ntype MyRequired<T> = {\n  [K in keyof T]-?: T[K];\n};\n\ninterface User { id: number; name?: string; }\ntype U1 = MyPartial<User>;  // { id?: number; name?: string }\ntype U2 = MyRequired<User>; // { id: number; name: string }",
    interviewQuestion:
      "Write your own version of the built-in `Required<T>` utility type and explain what the `-?` modifier does in a mapped type.",
  },
  {
    id: "typescript-pick-omit-from-scratch",
    category: "typescript",
    difficulty: "Intermediate",
    topic: "Utility Types",
    title: "How would you implement Pick and Omit from scratch?",
    summary:
      "Pick selects a subset of keys from a type using a mapped type constrained with `keyof`, while Omit is built on top of Pick and Exclude to remove specific keys.",
    explanation:
      "`Pick<T, K>` maps only over the keys in `K` (constrained to `keyof T`), copying each property’s type via an indexed access `T[K]`. `Omit<T, K>` is not implemented as a direct mapped type in the standard library; instead it composes `Pick` with `Exclude<keyof T, K>`, first computing the remaining keys by excluding `K` from `keyof T`, then picking exactly those. This composition pattern (deriving one utility from more primitive ones) is idiomatic in TypeScript’s type-level programming and shows how utility types build on each other rather than each being a bespoke implementation.",
    code: "type MyPick<T, K extends keyof T> = {\n  [P in K]: T[P];\n};\n\ntype MyExclude<T, U> = T extends U ? never : T;\n\ntype MyOmit<T, K extends keyof any> = MyPick<T, MyExclude<keyof T, K>>;\n\ninterface User { id: number; name: string; email: string; }\ntype PublicUser = MyOmit<User, 'email'>; // { id: number; name: string }",
    interviewQuestion:
      "Implement `Omit<T, K>` using `Pick` and `Exclude`, and explain why `Omit` is not written as a standalone mapped type in the TypeScript standard library.",
  },
  {
    id: "typescript-record-deep-dive",
    category: "typescript",
    difficulty: "Basic",
    topic: "Utility Types",
    title: "What is Record<K, V> and how does it work under the hood?",
    summary:
      "Record<K, V> constructs an object type whose keys come from K and whose values all have type V, implemented internally as a mapped type over a key union.",
    explanation:
      "Record is defined roughly as `type Record<K extends keyof any, V> = { [P in K]: V }`, where `keyof any` is `string | number | symbol`, the set of all valid property key types. It is commonly used for lookup tables, dictionaries keyed by a union of string literals, or enum-keyed maps. Unlike an index signature (`{ [key: string]: V }`), `Record` with a literal union of keys forces every key in that union to be present, giving exhaustiveness guarantees that a plain index signature does not.",
    code: "type Fruit = 'apple' | 'banana' | 'cherry';\n\nconst prices: Record<Fruit, number> = {\n  apple: 1.5,\n  banana: 0.5,\n  cherry: 3,\n  // omitting a key here is a compile error\n};\n\ntype AnyStringMap = Record<string, unknown>;",
    interviewQuestion:
      "How does `Record<Fruit, number>` differ from `{ [key: string]: number }` when `Fruit` is a union of string literals, in terms of what the compiler enforces?",
  },
  {
    id: "typescript-typed-currying",
    category: "typescript",
    difficulty: "Advanced",
    topic: "Functions",
    title: "How do you type a curried function with generics?",
    summary:
      "A fully typed curry function uses overloads or conditional types over tuple parameter lists to progressively peel off one argument at a time while preserving accurate types for each partial application.",
    explanation:
      "Typing currying well typically requires TypeScript’s variadic tuple types combined with conditional types: given a function’s `Parameters<F>` tuple, you recursively check if calling with one argument leaves a non-empty remaining tuple, and if so return a new curried function typed over the rest, otherwise return the final result type. This is one of the more advanced patterns combining `infer`, tuple spreads, and recursive conditional types, and it demonstrates deep familiarity with type-level function composition beyond what simple generics can express.",
    code: "type Curry<F> = F extends (arg: infer A, ...rest: infer R) => infer Ret\n  ? R extends []\n    ? (arg: A) => Ret\n    : (arg: A) => Curry<(...args: R) => Ret>\n  : never;\n\nfunction curry<F extends (...args: any[]) => any>(fn: F): Curry<F> {\n  return ((...args: any[]) =>\n    args.length >= fn.length\n      ? fn(...args)\n      : (curry as any)(fn.bind(null, ...args))) as Curry<F>;\n}\n\nconst add3 = (a: number, b: number, c: number) => a + b + c;\nconst curried = curry(add3);\nconst result = curried(1)(2)(3); // 6",
    interviewQuestion:
      "How would you write a generic type that types a curried version of an arbitrary function signature, one argument at a time?",
  },
  {
    id: "typescript-type-safe-event-emitter",
    category: "typescript",
    difficulty: "Advanced",
    topic: "Design Patterns",
    title: "How do you build a type-safe event emitter with generics?",
    summary:
      "A type-safe event emitter maps event names to their payload types via a generic events interface, so `on`, `off`, and `emit` are all checked against the correct argument shape for each event.",
    explanation:
      "The core idea is to define a map type like `type Events = { login: { userId: string }; logout: void }` and make the emitter class generic over that map, using `keyof Events` to constrain the event name parameter and indexed access `Events[K]` to type the payload. This prevents bugs like emitting an event with the wrong payload shape or subscribing to a misspelled event name, which is easy to get wrong with a loosely typed `emit(event: string, ...args: any[])` signature. It is a very common real-world pattern in front-end state management and WebSocket wrapper libraries.",
    code: "type EventMap = {\n  login: { userId: string };\n  logout: undefined;\n};\n\nclass TypedEmitter<T extends Record<string, any>> {\n  private listeners: { [K in keyof T]?: Array<(payload: T[K]) => void> } = {};\n\n  on<K extends keyof T>(event: K, cb: (payload: T[K]) => void) {\n    (this.listeners[event] ??= []).push(cb);\n  }\n\n  emit<K extends keyof T>(event: K, payload: T[K]) {\n    this.listeners[event]?.forEach((cb) => cb(payload));\n  }\n}\n\nconst emitter = new TypedEmitter<EventMap>();\nemitter.on('login', (p) => console.log(p.userId));\nemitter.emit('login', { userId: 'u1' });",
    interviewQuestion:
      "Design a generic `EventEmitter` class where `emit` and `on` are type-checked against an event name to payload mapping. What TypeScript feature makes the payload type depend on the event name argument?",
  },
  {
    id: "typescript-typed-redux-reducer",
    category: "typescript",
    difficulty: "Advanced",
    topic: "Design Patterns",
    title:
      "How do you type a Redux-style reducer with discriminated union actions?",
    summary:
      "A type-safe reducer models actions as a discriminated union keyed by a `type` field, letting a switch statement narrow the action payload for each case and enabling exhaustiveness checking.",
    explanation:
      "Each action is a distinct object type with a literal `type` field plus whatever payload fields it needs; the union of all actions becomes the reducer’s second parameter type. Inside a `switch (action.type)`, TypeScript narrows `action` to the specific member matching each `case`, so payload fields are correctly typed without manual casting. Adding a `default: assertNever(action)` branch (where `assertNever` takes a `never` parameter) causes a compile error if a new action variant is added to the union but not handled, giving compile-time exhaustiveness checking that mirrors what `Exclude`/`never` patterns provide elsewhere in the type system.",
    code: "type State = { count: number };\ntype Action =\n  | { type: 'increment'; amount: number }\n  | { type: 'decrement'; amount: number }\n  | { type: 'reset' };\n\nfunction assertNever(x: never): never {\n  throw new Error('Unhandled action: ' + JSON.stringify(x));\n}\n\nfunction reducer(state: State, action: Action): State {\n  switch (action.type) {\n    case 'increment':\n      return { count: state.count + action.amount };\n    case 'decrement':\n      return { count: state.count - action.amount };\n    case 'reset':\n      return { count: 0 };\n    default:\n      return assertNever(action);\n  }\n}",
    interviewQuestion:
      "How would you design action types for a reducer so that adding a new action variant without updating the switch statement causes a compile-time error?",
  },
  {
    id: "typescript-awaited-utility-type",
    category: "typescript",
    difficulty: "Intermediate",
    topic: "Utility Types",
    title: "What does the Awaited<T> utility type do?",
    summary:
      "Awaited<T> recursively unwraps Promise-like types to determine what a value resolves to, mirroring how `await` behaves at runtime, including nested and thenable promises.",
    explanation:
      "Introduced in TypeScript 4.5, `Awaited<T>` is essential for correctly typing `async`/`await` chains and utilities like `Promise.all`. It is implemented as a recursive conditional type that checks if `T` has a `then` method (`T extends PromiseLike<infer U>`), and if so recurses on `U` until a non-promise type is reached, correctly handling promises that resolve to other promises. Before its introduction, TypeScript struggled to correctly type deeply or conditionally nested promises, which caused real bugs in generic async utility functions.",
    code: "type MyAwaited<T> = T extends PromiseLike<infer U> ? MyAwaited<U> : T;\n\ntype A = MyAwaited<Promise<string>>;              // string\ntype B = MyAwaited<Promise<Promise<number>>>;      // number\ntype C = Awaited<ReturnType<typeof fetch>>;         // Response\n\nasync function getValue(): Promise<Promise<boolean>> {\n  return Promise.resolve(true);\n}\ntype D = Awaited<ReturnType<typeof getValue>>; // boolean",
    interviewQuestion:
      "Why is `Awaited<T>` implemented as a recursive conditional type instead of a single-level `T extends Promise<infer U> ? U : T`?",
  },
  {
    id: "typescript-abstract-constructor-type",
    category: "typescript",
    difficulty: "Advanced",
    topic: "Classes",
    title: "What is an abstract constructor type and when do you need it?",
    summary:
      "An abstract constructor type, written as `abstract new (...args) => T`, describes a class reference that cannot be instantiated directly with `new` but can still be extended, which is required for typing mixin functions that accept abstract base classes.",
    explanation:
      'Normally, a constructor type like `new (...args: any[]) => T` implies the class can be directly instantiated, which excludes abstract classes since `new AbstractClass()` is a compile error. Mixin functions that take a base class and return an extended class need to accept both concrete and abstract classes, so TypeScript added the `abstract new (...)` constructor type syntax to represent "a class-like value, possibly abstract." This distinction matters because a mixin typed with a plain (non-abstract) constructor type would reject an abstract class argument even though `class Derived extends Base` works fine with an abstract `Base`.',
    code: "abstract class Shape {\n  abstract area(): number;\n}\n\ntype AbstractCtor<T> = abstract new (...args: any[]) => T;\n\nfunction withLabel<T extends AbstractCtor<Shape>>(Base: T) {\n  return class extends Base {\n    label = 'shape';\n  };\n}\n\nclass Circle extends Shape {\n  constructor(public radius: number) { super(); }\n  area() { return Math.PI * this.radius ** 2; }\n}\n\nconst LabeledCircle = withLabel(Circle);\nconst c = new LabeledCircle(5);",
    interviewQuestion:
      "Why would a mixin function that accepts a class argument fail to accept an abstract class unless its parameter type uses `abstract new (...args: any[]) => T`?",
  },
  {
    id: "typescript-covariant-return-overrides",
    category: "typescript",
    difficulty: "Tricky",
    topic: "Classes",
    title: "What are covariant return types in method overrides?",
    summary:
      "TypeScript allows a subclass to override a method with a return type that is a subtype of the base method’s return type, which is safe because callers expecting the base type can still use the more specific returned value.",
    explanation:
      'This is called covariance: the override’s return type varies "in the same direction" as the subclass relationship. It is sound because any code relying on the base class’s method signature only ever uses members guaranteed by the base return type, and a more specific subtype satisfies that contract. Parameter types, in contrast, are checked bivariantly for methods (or contravariantly under `strictFunctionTypes` for standalone function types), which is a common point of confusion since return types and parameter types are checked with different variance rules in TypeScript.',
    code: "class Animal {}\nclass Dog extends Animal { bark() { return 'woof'; } }\n\nclass AnimalShelter {\n  adopt(): Animal {\n    return new Animal();\n  }\n}\n\nclass DogShelter extends AnimalShelter {\n  // Covariant return: Dog is a subtype of Animal, so this override is valid\n  adopt(): Dog {\n    return new Dog();\n  }\n}\n\nconst shelter: AnimalShelter = new DogShelter();\nconst pet = shelter.adopt(); // typed as Animal, actually a Dog",
    interviewQuestion:
      "Why is it legal for a subclass method to override the base class method with a narrower return type, but not generally legal to widen a parameter type in the same way?",
  },
  {
    id: "typescript-satisfies-vs-annotation-tradeoffs",
    category: "typescript",
    difficulty: "Tricky",
    topic: "Type Inference",
    title:
      "When should you use satisfies instead of a type annotation, and what are the tradeoffs?",
    summary:
      "A type annotation widens an expression to the declared type and loses literal information, while `satisfies` validates the expression against a type without changing its inferred type, preserving narrow literal types for later use.",
    explanation:
      "With `const config: Record<string, number> = {...}`, every property is widened to type `number` and you lose the ability to know exactly which keys exist when indexing later, and autocomplete on `config.foo` becomes just `number`. With `const config = {...} satisfies Record<string, number>`, TypeScript still checks that every value conforms to `number`, but the variable’s inferred type remains the specific literal object type, so `config.apple` is known to exist and callers get full autocomplete plus excess-property and shape checking. The tradeoff is that `satisfies` does not change the declared type of the variable at all -- if you need the variable’s static type to be the broader type (e.g. to assign a different, incompatible literal object to it later), you still want a plain annotation.",
    code: "type Palette = Record<'primary' | 'secondary', string>;\n\n// Annotation: widens to Palette, losing specific keys\nconst a: Palette = { primary: '#000', secondary: '#fff' };\n\n// satisfies: keeps literal type, still validated against Palette\nconst b = { primary: '#000', secondary: '#fff' } satisfies Palette;\n\nb.primary.toUpperCase(); // fully typed as string literal-derived type\n// a.primary is just 'string', b.primary is also checked but object shape is preserved",
    interviewQuestion:
      "Given `const config = { retries: 3, timeout: 1000 } satisfies Options`, why might `config` still retain narrower types than `Options` itself, and why would that matter to a caller?",
  },
  {
    id: "typescript-exhaustiveness-checking-never",
    category: "typescript",
    difficulty: "Intermediate",
    topic: "Type Narrowing",
    title: "How do you implement exhaustiveness checking using the never type?",
    summary:
      "Exhaustiveness checking uses the fact that after all members of a union have been handled in a switch or if-chain, the remaining type narrows to never, so assigning it to a never-typed parameter causes a compile error if a case was missed.",
    explanation:
      "The pattern is to write a small helper function, commonly named `assertNever(x: never): never`, and call it in the `default` case of a switch statement (or the final `else`) over a discriminated union. If every union member has been handled by an earlier case, the type of the value at that point is `never`, which satisfies the parameter type. If a developer later adds a new variant to the union but forgets to add a corresponding case, the value at the default branch will no longer be `never` (it will be the unhandled variant), and TypeScript raises a type error at the `assertNever` call site, catching the omission at compile time rather than at runtime.",
    code: "type Shape =\n  | { kind: 'circle'; radius: number }\n  | { kind: 'square'; side: number }\n  | { kind: 'rectangle'; width: number; height: number };\n\nfunction assertNever(x: never): never {\n  throw new Error('Unexpected shape: ' + JSON.stringify(x));\n}\n\nfunction area(shape: Shape): number {\n  switch (shape.kind) {\n    case 'circle': return Math.PI * shape.radius ** 2;\n    case 'square': return shape.side ** 2;\n    case 'rectangle': return shape.width * shape.height;\n    default: return assertNever(shape); // fails to compile if a case is missing\n  }\n}",
    interviewQuestion:
      "How does calling `assertNever(shape)` in the default branch of a switch statement help catch missing cases at compile time when a new variant is added to a discriminated union?",
  },
  {
    id: "typescript-custom-type-predicates",
    category: "typescript",
    difficulty: "Intermediate",
    topic: "Type Narrowing",
    title: "How do custom type predicates with the is keyword work?",
    summary:
      "A function can declare its return type as `param is SomeType` to tell the compiler that a truthy return means the argument has been narrowed to that specific type, enabling custom runtime checks to participate in type narrowing.",
    explanation:
      "Without a type predicate, a function like `isString(x: unknown): boolean` only tells the compiler the function returns a boolean; it gives no information about `x`’s type afterward, so calling code would still need a manual cast. By writing `isString(x: unknown): x is string`, TypeScript treats any call site like `if (isString(value))` as a narrowing point, refining `value` to `string` inside that branch, just like `typeof` or `instanceof` checks. This is essential for validating data of type `unknown` (such as parsed JSON) and for building reusable narrowing utilities across a codebase, especially for shapes that plain `typeof`/`in` checks cannot express.",
    code: "interface Cat { meow(): void; }\ninterface Dog { bark(): void; }\n\nfunction isCat(animal: Cat | Dog): animal is Cat {\n  return typeof (animal as Cat).meow === 'function';\n}\n\nfunction speak(animal: Cat | Dog) {\n  if (isCat(animal)) {\n    animal.meow(); // narrowed to Cat\n  } else {\n    animal.bark(); // narrowed to Dog\n  }\n}",
    interviewQuestion:
      "What is the difference between a function typed as `(x: unknown) => boolean` and one typed as `(x: unknown) => x is string`, in terms of what the caller’s type checker knows after the call?",
  },
  {
    id: "typescript-switch-narrowing-discriminated-unions",
    category: "typescript",
    difficulty: "Basic",
    topic: "Type Narrowing",
    title:
      "How does narrowing work inside a switch statement over a discriminated union?",
    summary:
      "TypeScript narrows a discriminated union to the matching member type within each case block of a switch statement by comparing the literal value of the common discriminant property.",
    explanation:
      'When a union’s members each have a shared property with distinct literal types (the "discriminant" or "tag"), a `switch (value.tag)` statement lets the compiler match each `case` label against the discriminant’s literal type and narrow `value` accordingly inside that block. This works with `case` labels using `===`-like literal comparison, string enums, or numeric literals, but stops working if the discriminant property is computed at runtime or if fallthrough logic mixes multiple cases in ways the compiler cannot statically reconcile with a single type. Understanding this narrowing behavior is foundational to writing safe, type-driven state machines and API response handlers.',
    code: "type ApiResult =\n  | { status: 'success'; data: string }\n  | { status: 'error'; message: string }\n  | { status: 'loading' };\n\nfunction render(result: ApiResult): string {\n  switch (result.status) {\n    case 'success':\n      return result.data; // narrowed: { status: 'success'; data: string }\n    case 'error':\n      return result.message; // narrowed to the error variant\n    case 'loading':\n      return 'Loading...';\n  }\n}",
    interviewQuestion:
      'Why does `result.data` become accessible only inside the `case "success":` block of the switch statement, and not in the other case blocks?',
  },
  {
    id: "typescript-typed-async-generators",
    category: "typescript",
    difficulty: "Advanced",
    topic: "Async",
    title: "How do you type async generator functions?",
    summary:
      "An async generator function is typed with `AsyncGenerator<YieldType, ReturnType, NextType>`, describing what values it yields asynchronously, what it returns when done, and what type of value can be passed into `.next()`.",
    explanation:
      "Declaring `async function* gen(): AsyncGenerator<T, R, N>` lets TypeScript check `yield` expressions against `T`, the generator’s final `return` value against `R`, and the type passed back in via `iterator.next(value)` against `N`. Consuming such a generator with `for await...of` automatically types the loop variable as `T`. This pattern shows up in streaming APIs, paginated data fetching, and async iterables that produce values over time (e.g. reading chunks from a network stream), and correctly typing all three generic slots avoids `any` leaking into consumer code.",
    code: "async function* fetchPages(url: string): AsyncGenerator<string[], void, unknown> {\n  let page = 1;\n  while (page <= 3) {\n    const items = await Promise.resolve([`item-${page}-a`, `item-${page}-b`]);\n    yield items;\n    page++;\n  }\n}\n\nasync function consume() {\n  for await (const batch of fetchPages('/api/items')) {\n    console.log(batch.length); // batch is typed as string[]\n  }\n}",
    interviewQuestion:
      "What do the three type parameters of `AsyncGenerator<T, TReturn, TNext>` represent, and how does `for await...of` use the first one?",
  },
  {
    id: "typescript-thisparametertype-omitthisparameter",
    category: "typescript",
    difficulty: "Tricky",
    topic: "Utility Types",
    title: "What do ThisParameterType and OmitThisParameter do?",
    summary:
      "ThisParameterType extracts the type of a function’s fake `this` parameter (or unknown if none is declared), while OmitThisParameter produces a version of a function type with that `this` parameter stripped out, matching what `.bind()` returns.",
    explanation:
      "These utilities exist to correctly type functions before and after binding. `ThisParameterType<T>` is implemented as `T extends (this: infer U, ...args: never) => any ? U : unknown`, pulling the `this` type via `infer`. `OmitThisParameter<T>` reconstructs the function type without the `this` parameter, which is exactly the type produced by calling `.bind(...)`, since a bound function no longer requires (or allows) specifying a `this` context. They are used internally by the standard library’s typing of `Function.prototype.bind` and are useful when writing utilities that programmatically transform function types while tracking their calling context.",
    code: "function greet(this: { name: string }, greeting: string) {\n  return `${greeting}, ${this.name}`;\n}\n\ntype ThisType_ = ThisParameterType<typeof greet>; // { name: string }\ntype BoundGreet = OmitThisParameter<typeof greet>; // (greeting: string) => string\n\nconst bound: BoundGreet = greet.bind({ name: 'Ada' });\nbound('Hello'); // no 'this' argument needed or allowed",
    interviewQuestion:
      "After calling `.bind()` on a function that declares a `this` parameter, why does the resulting function type no longer include that `this` parameter, and which utility type models that transformation?",
  },
  {
    id: "typescript-structural-typing-class-pitfalls",
    category: "typescript",
    difficulty: "Tricky",
    topic: "Type System Design",
    title: "What structural typing pitfalls arise with classes specifically?",
    summary:
      "Because TypeScript compares classes structurally rather than nominally, two unrelated classes with identical member shapes are considered assignable to one another, which can silently allow logically incorrect substitutions.",
    explanation:
      "Unlike languages such as Java where class identity determines type compatibility, TypeScript only checks whether the shape (properties and methods) matches, so a `Vector2D` class with `x`/`y` and a `Point` class with `x`/`y` are freely interchangeable even though they represent different concepts. This gets worse with classes that have only public members, since there is nothing to structurally distinguish them; adding a `private` or `protected` member forces nominal-like behavior for that class specifically, because private members are checked by declaration site, not just shape, so two classes with identically named private fields are still incompatible. This is a common trick question: private/protected fields are the main lever for approximating nominal typing at the class level, alongside the branded-type pattern used for plain object/primitive types.",
    code: "class Vector2D { constructor(public x: number, public y: number) {} }\nclass Point { constructor(public x: number, public y: number) {} }\n\nfunction magnitude(v: Vector2D) {\n  return Math.sqrt(v.x ** 2 + v.y ** 2);\n}\n\nmagnitude(new Point(3, 4)); // allowed! structurally identical\n\nclass SecureVector2D {\n  private brand = 'vector';\n  constructor(public x: number, public y: number) {}\n}\nclass SecurePoint {\n  private brand = 'point';\n  constructor(public x: number, public y: number) {}\n}\n// magnitude-like function typed with SecureVector2D would now reject SecurePoint",
    interviewQuestion:
      "Why does adding a `private` field to a class change how TypeScript checks assignability compared to a class with only public fields, even though private fields are erased at runtime?",
  },
  {
    id: "typescript-enum-vs-union-literals-tradeoffs",
    category: "typescript",
    difficulty: "Intermediate",
    topic: "Enums",
    title:
      "What are the tradeoffs between enums and unions of string literals?",
    summary:
      "String literal unions are pure compile-time constructs with zero runtime footprint and simpler structural compatibility, while enums generate real runtime objects and offer namespacing and reverse lookups (for numeric enums) at the cost of extra bundle size and some structural quirks.",
    explanation:
      'A `type Direction = "up" | "down" | "left" | "right"` produces no JavaScript output at all, is trivially serializable to/from JSON, and any string literal matching one of the values is assignable without an explicit enum reference. A `enum Direction { Up, Down, Left, Right }` compiles to an actual object (or, for numeric enums, a bidirectional lookup object), meaning values must be referenced through the enum (`Direction.Up`) for full type safety, and numeric enums allow easy-to-miss bugs since any number is structurally assignable to a numeric enum type. Most modern style guides (including TypeScript’s own team) now favor literal unions or `as const` object maps over enums for new code, reserving enums mainly for cases needing the runtime object or namespacing behavior.',
    code: "// Union of literals: zero runtime cost\ntype Status = 'idle' | 'loading' | 'success' | 'error';\nfunction setStatus(s: Status) {}\nsetStatus('idle'); // works directly with a string literal\n\n// Enum: real object at runtime\nenum StatusEnum { Idle, Loading, Success, Error }\nfunction setStatusEnum(s: StatusEnum) {}\n// setStatusEnum(0) is allowed for numeric enums -- a common footgun\nsetStatusEnum(StatusEnum.Idle);",
    interviewQuestion:
      "Why might a team prefer a string literal union over a TypeScript enum for representing a fixed set of states, and what capability do they give up by doing so?",
  },
  {
    id: "typescript-const-enums-compile-time-only",
    category: "typescript",
    difficulty: "Advanced",
    topic: "Enums",
    title:
      "What makes const enums different, and why are they compile-time only?",
    summary:
      "A const enum is fully inlined at every usage site during compilation and produces no runtime object at all, unlike a regular enum, which trades some flexibility (like iterating over members) for smaller and faster output.",
    explanation:
      "When you write `const enum Direction { Up, Down }`, the compiler replaces every reference such as `Direction.Up` directly with its numeric or string literal value in the emitted code, and no `Direction` object is created, avoiding both the runtime object allocation and an extra property lookup. This inlining is exactly why `const enum` is incompatible with `isolatedModules`: a single-file transpiler cannot inline a value defined in a different file without cross-file information, since it does not have access to the enum’s declared members at compile time. Const enums also cannot be used with computed members or in ways that require the runtime object to exist, such as reverse-mapping a numeric enum value back to its name.",
    code: "const enum Direction {\n  Up,\n  Down,\n  Left,\n  Right,\n}\n\nfunction move(dir: Direction) {\n  if (dir === Direction.Up) console.log('moving up');\n}\n\nmove(Direction.Up);\n// Compiled output inlines the value, e.g.: move(0 /* Up */);\n// No 'Direction' object exists at runtime.",
    interviewQuestion:
      "Why is `const enum` disallowed when the `isolatedModules` compiler flag is enabled, while a regular `enum` is not?",
  },
  {
    id: "typescript-ambient-module-declarations",
    category: "typescript",
    difficulty: "Intermediate",
    topic: "Modules",
    title:
      "How do you write ambient module declarations for untyped npm packages?",
    summary:
      "An ambient module declaration uses `declare module 'package-name'` inside a `.d.ts` file to describe the shape of a JavaScript package that ships no type definitions, letting TypeScript type-check imports from it.",
    explanation:
      "When a package has no bundled types and no corresponding `@types/` package on DefinitelyTyped, importing it normally causes a \"could not find a declaration file\" error. Adding a `.d.ts` file (commonly `global.d.ts` or `<package-name>.d.ts`, included via tsconfig’s `include` or `typeRoots`) with `declare module 'package-name' { export function doThing(x: string): void; }` tells the compiler what the module exports. For a quick, unsafe escape hatch, `declare module 'package-name';` with no body treats every import from that module as `any`, silencing the error entirely at the cost of type safety, which is a common trick worth knowing but should be used sparingly.",
    code: "// types/some-untyped-lib.d.ts\ndeclare module 'some-untyped-lib' {\n  export interface Options {\n    verbose?: boolean;\n  }\n  export function run(options?: Options): Promise<string>;\n  export default function init(name: string): void;\n}\n\n// usage.ts\nimport init, { run } from 'some-untyped-lib';\ninit('app');\nrun({ verbose: true });",
    interviewQuestion:
      "You need to import a third-party JS package with no type definitions and no `@types` package available. What are two ways to make TypeScript accept the import, and what is the tradeoff between them?",
  },
  {
    id: "typescript-function-type-bivariance",
    category: "typescript",
    difficulty: "Tricky",
    topic: "Type System Design",
    title:
      "What is method parameter bivariance and how does strictFunctionTypes affect it?",
    summary:
      "Method shorthand signatures in TypeScript are checked bivariantly for parameter types (allowing both wider and narrower overrides), while standalone function-typed properties are checked contravariantly under strictFunctionTypes, an intentional inconsistency for practical reasons.",
    explanation:
      'Soundly, function parameters should be checked contravariantly: an override’s parameter type should be the same or a supertype of the base parameter type. However, TypeScript historically checked all function parameters bivariantly (accepting either direction) to support common patterns like array method callbacks (e.g. `Array<Animal>.forEach` accepting a callback typed for `Dog`). The `strictFunctionTypes` flag tightens this to proper contravariance, but deliberately only for function types written in the "standalone" syntax (`(x: T) => void`) and not for method shorthand syntax (`method(x: T): void`) declared in interfaces or classes, because enforcing strict contravariance on methods broke too many common, safe-in-practice override patterns in real-world code.',
    code: "interface Animal {}\ninterface Dog extends Animal { bark(): void; }\n\ninterface EventHandler {\n  // Method shorthand: bivariant, even under strictFunctionTypes\n  handle(e: Dog): void;\n}\n\ninterface EventHandlerStrict {\n  // Standalone function property: contravariant under strictFunctionTypes\n  handle: (e: Dog) => void;\n}\n\nconst h1: EventHandler = { handle(e: Animal) { /* allowed */ } };\n// const h2: EventHandlerStrict = { handle: (e: Animal) => {} }; // error under strictFunctionTypes",
    interviewQuestion:
      "Why does `strictFunctionTypes` enforce contravariant parameter checking for `handle: (e: Dog) => void` but not for the equivalent method shorthand `handle(e: Dog): void` in the same interface?",
  },
{
    id: "typescript-declaration-files",
    category: "typescript",
    difficulty: "Intermediate",
    topic: "Declaration Files",
    title: "What are .d.ts declaration files and when do you need them?",
    summary: "Declaration files describe the shape of JavaScript code so TypeScript can type-check code that consumes it without seeing the original source.",
    explanation: "A .d.ts file contains only type information, no runtime code. Libraries published as plain JavaScript ship a matching .d.ts (or one is provided via DefinitelyTyped as @types/pkg) so consumers get autocomplete and type safety. You write your own .d.ts files to describe global variables, non-TS modules (like CSS or image imports), or to hand-author types for an untyped dependency. They can also be auto-generated by tsc using the declaration compiler option when building a library.",
    code: `// global.d.ts
declare global {
  interface Window {
    analytics: {
      track(event: string, props?: Record<string, unknown>): void;
    };
  }
}
export {};

// images.d.ts - lets webpack/vite imports type-check
declare module '*.svg' {
  const src: string;
  export default src;
}

// usage anywhere in the app, no import needed for the ambient part
window.analytics.track('signup_clicked');`,
    interviewQuestion: "What is a .d.ts file for, and how would you add types for an untyped npm package or a non-JS asset import like SVGs?",
  },
  {
    id: "typescript-type-only-imports-export-type",
    category: "typescript",
    difficulty: "Basic",
    topic: "Modules",
    title: "What do 'import type' and 'export type' do?",
    summary: "They mark an import or export as type-only, guaranteeing it is erased at compile time and never emitted as a runtime import.",
    explanation: "Normal imports can be ambiguous: a transpiler like Babel or SWC that processes files independently (without full type information) cannot always tell whether an imported symbol is a type or a value, which can lead to importing something that does not actually exist at runtime. `import type` and `export type` remove that ambiguity by explicitly marking the binding as types-only, so single-file transpilers can safely strip it. This also helps with `isolatedModules` mode and avoids accidental circular runtime imports of things that are only ever used as types.",
    code: `// types.ts
export type User = { id: string; name: string };
export { type Role } from './roles';

// component.ts
import type { User } from './types';
import { type Role, createUser } from './types';

function greet(user: User, role: Role) {
  return createUser(user.name);
}`,
    interviewQuestion: "Why would you use `import type` instead of a regular import, especially in a project that uses Babel or SWC alongside TypeScript?",
  },
  {
    id: "typescript-project-references",
    category: "typescript",
    difficulty: "Advanced",
    topic: "Build & Tooling",
    title: "What are TypeScript Project References and why use them in a monorepo?",
    summary: "Project references let you split a large codebase into smaller projects that reference each other, enabling incremental, dependency-aware builds.",
    explanation: "Each sub-project has its own tsconfig.json with `composite: true` and a `references` array pointing to the projects it depends on. Running `tsc -b` (build mode) then only rebuilds projects whose dependencies actually changed, using .tsbuildinfo files to cache state, which is much faster than re-checking the whole repo. Composite projects must set `declaration: true` and produce isolated, self-contained output because consumers only see the emitted .d.ts files, not the source. This is the standard way to structure monorepos with shared packages (e.g. a `core` package consumed by `web` and `api` packages) while keeping fast, correct incremental builds and enforcing that packages only depend on declared references.",
    code: `// packages/core/tsconfig.json
{
  "compilerOptions": { "composite": true, "declaration": true, "outDir": "dist" },
  "include": ["src"]
}

// packages/web/tsconfig.json
{
  "compilerOptions": { "composite": true, "outDir": "dist" },
  "references": [{ "path": "../core" }],
  "include": ["src"]
}

// build everything in dependency order, incrementally
// $ tsc -b packages/web`,
    interviewQuestion: "How do TypeScript project references improve build performance in a monorepo compared to a single flat tsconfig?",
  },
  {
    id: "typescript-exact-optional-property-types",
    category: "typescript",
    difficulty: "Tricky",
    topic: "tsconfig Flags",
    title: "What does exactOptionalPropertyTypes change about optional properties?",
    summary: "It stops `undefined` from being an implicitly valid value for an optional property, distinguishing 'property is missing' from 'property is present and set to undefined'.",
    explanation: "By default, `prop?: string` behaves like `prop?: string | undefined`, so you can explicitly assign `undefined` to it. With `exactOptionalPropertyTypes: true`, an optional property must either be omitted entirely or assigned an actual string; explicitly setting it to `undefined` becomes a type error unless you write `prop?: string | undefined` yourself. This matters for APIs that use `in` checks or `Object.keys` to detect presence, and for libraries (like some ORMs or form libraries) where 'field not provided' and 'field explicitly cleared' are semantically different operations.",
    code: `// tsconfig: { "exactOptionalPropertyTypes": true }
interface Config {
  timeout?: number;
}

const a: Config = {};                 // OK: property omitted
const b: Config = { timeout: 5000 };  // OK
const c: Config = { timeout: undefined }; // Error: not assignable
                                            // must be number, not undefined

// to explicitly allow undefined, opt in:
interface Config2 {
  timeout?: number | undefined;
}`,
    interviewQuestion: "With exactOptionalPropertyTypes enabled, why does `{ timeout: undefined }` fail to satisfy `{ timeout?: number }`, and when would you want that strictness?",
  },
  {
    id: "typescript-nouncheckedindexedaccess",
    category: "typescript",
    difficulty: "Intermediate",
    topic: "tsconfig Flags",
    title: "What does noUncheckedIndexedAccess do?",
    summary: "It makes indexed access on arrays and index-signature objects include `undefined` in the result type, forcing you to handle missing entries.",
    explanation: "Normally `arr[i]` has the array's element type even though out-of-bounds access returns `undefined` at runtime, which is a common source of null-reference bugs. With `noUncheckedIndexedAccess` enabled, `arr[i]` and `obj[key]` (for index-signature types) are typed as `T | undefined`, so you must narrow before use. This does not affect access via known, literal object properties, only dynamic/index-signature and array indexing, and is one of the higher-value strictness flags for catching real bugs in data-processing code.",
    code: `// tsconfig: { "noUncheckedIndexedAccess": true }
const scores: number[] = [10, 20, 30];
const first = scores[0]; // type: number | undefined

function double(i: number) {
  return scores[i] * 2; // Error: possibly undefined
}

function safeDouble(i: number) {
  const v = scores[i];
  return v === undefined ? 0 : v * 2; // OK after narrowing
}`,
    interviewQuestion: "Why might `arr[0]` be typed as `number | undefined` instead of `number` in a project, and which tsconfig flag causes that?",
  },
  {
    id: "typescript-noimplicitoverride",
    category: "typescript",
    difficulty: "Basic",
    topic: "tsconfig Flags",
    title: "What does noImplicitOverride enforce?",
    summary: "It requires subclass methods that override a base class method to be explicitly marked with the `override` keyword, catching accidental or stale overrides.",
    explanation: "Without this flag, a method in a subclass silently overrides a same-named base method with no compiler check that this was intentional; if the base method is later renamed or removed, the subclass method just becomes a new unrelated method with no error. With `noImplicitOverride: true`, any method that overrides a base class member must use the `override` modifier, and TypeScript will error if you mark something `override` that does not actually exist on the base class. This pairs naturally with the `override` keyword itself (available since TS 4.3) to keep class hierarchies refactor-safe.",
    code: `// tsconfig: { "noImplicitOverride": true }
class Animal {
  makeSound(): string { return '...'; }
}

class Dog extends Animal {
  override makeSound(): string { return 'Woof'; } // OK, explicit

  // speek(): string { return 'x'; } // Error if marked override:
  // typo means it doesn't actually override anything
}`,
    interviewQuestion: "What problem does the `override` keyword combined with `noImplicitOverride` solve when refactoring a class hierarchy?",
  },
  {
    id: "typescript-strictfunctiontypes-flag",
    category: "typescript",
    difficulty: "Advanced",
    topic: "tsconfig Flags",
    title: "How does the strictFunctionTypes flag change function parameter assignability?",
    summary: "It enables contravariant checking of function parameter types for standalone function types, rejecting unsound assignments that bivariant checking used to allow.",
    explanation: "Before this flag (or with it off), TypeScript checked function parameters bivariantly, meaning a function expecting a narrower parameter type could be assigned where a wider one was expected, and vice versa, which is unsound for plain function types. With `strictFunctionTypes: true`, function type parameters are checked contravariantly: a function assigned to a variable of a certain function type must accept parameters at least as general as required, not narrower. This flag deliberately exempts method syntax (shorthand methods in interfaces/classes) to preserve compatibility with common OOP override patterns, so the same unsoundness still exists for methods, only standalone function-typed variables get the stricter contravariant check.",
    code: `// tsconfig: { "strict": true } (implies strictFunctionTypes)
type Handler = (e: MouseEvent) => void;

let handler: Handler;
handler = (e: Event) => {};       // OK: Event is wider than MouseEvent (contravariant, safe)
handler = (e: MouseEvent) => {};  // OK: exact match
// handler = (e: { x: number }) => {}; // Error: too narrow, unsafe if called with plain MouseEvent

// method shorthand is NOT checked this strictly (bivariant escape hatch)
interface Widget {
  onClick(e: MouseEvent): void;
}
const w: Widget = {
  onClick(e: { x: number }) { /* allowed, less safe */ },
};`,
    interviewQuestion: "With strictFunctionTypes on, why is assigning `(e: Event) => void` to a `(e: MouseEvent) => void` variable allowed, but the reverse is an error?",
  },
  {
    id: "typescript-variadic-tuple-types",
    category: "typescript",
    difficulty: "Advanced",
    topic: "Advanced Types",
    title: "What are variadic tuple types and what problems do they solve?",
    summary: "Variadic tuple types let you use spread syntax inside tuple type definitions to combine, prepend, or append tuples generically while preserving each element's specific type.",
    explanation: "Introduced in TS 4.0, a rest element in a tuple type (`[...T]`) can itself be a generic type parameter representing another tuple, letting utilities describe operations like concatenation, currying, or 'drop the first argument' precisely instead of collapsing everything to `any[]`. This is heavily used in typing functions like `Array.prototype.concat`, Redux middleware, or a `curry`/`bind`-style helper where the exact positional types of leading and trailing arguments must be preserved through generic transformations.",
    code: `type Concat<A extends unknown[], B extends unknown[]> = [...A, ...B];

type Combined = Concat<[string, number], [boolean]>;
// [string, number, boolean]

function tail<T extends unknown[]>(arr: readonly [unknown, ...T]): T {
  const [, ...rest] = arr;
  return rest as T;
}

const result = tail([1, 'a', true]); // ['a', boolean] -> ["a", true] typed as [string, boolean]`,
    interviewQuestion: "How would you write a generic type that prepends an argument to an existing tuple of function parameters, and what TypeScript feature makes that possible?",
  },
  {
    id: "typescript-polymorphic-this-types",
    category: "typescript",
    difficulty: "Advanced",
    topic: "Advanced Types",
    title: "What is a polymorphic `this` type and why is it used in fluent/chainable APIs?",
    summary: "Using `this` as a return type lets a method's return type automatically match the actual subclass it was called on, which is essential for chainable builder-style methods that get subclassed.",
    explanation: "If a base class method is annotated to return the concrete class type explicitly (e.g. `Base`), then calling it from a subclass and chaining a subclass-only method afterward would fail to type-check, because the return type is fixed to `Base`. Annotating the return type as `this` instead makes TypeScript substitute the actual calling type at each call site, so `subclassInstance.baseMethod()` returns `Subclass`, preserving the full chain. This is the mechanism behind fluent builders and ORMs where `.where()`, `.select()`, etc. are inherited but must keep returning the most derived type.",
    code: `class QueryBuilder {
  protected filters: string[] = [];
  where(cond: string): this {
    this.filters.push(cond);
    return this;
  }
}

class UserQueryBuilder extends QueryBuilder {
  onlyActive(): this {
    this.filters.push('active = true');
    return this;
  }
}

const q = new UserQueryBuilder()
  .where('age > 18')   // returns UserQueryBuilder, not QueryBuilder
  .onlyActive();        // still available because this was preserved`,
    interviewQuestion: "Why would a chainable builder method return `this` instead of the concrete class name as its return type?",
  },
  {
    id: "typescript-typed-fetch-wrapper",
    category: "typescript",
    difficulty: "Intermediate",
    topic: "Real-World Patterns",
    title: "How do you build a type-safe fetch wrapper in TypeScript?",
    summary: "A typed fetch wrapper generically parameterizes the expected response shape and centralizes error handling, headers, and JSON parsing so callers get inferred types instead of `any`.",
    explanation: "Raw `fetch` returns `Promise<Response>` and `.json()` returns `Promise<any>`, which throws away all type safety at the network boundary. A wrapper function accepts a generic type parameter for the expected payload, performs the request, checks `response.ok`, and casts or validates the parsed JSON to that type before returning it. In production code the cast is often paired with a runtime validator (like zod) so the type assertion is actually backed by a runtime check rather than just trusting the server.",
    code: `async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  });
  if (!res.ok) {
    throw new Error('Request failed: ' + res.status);
  }
  return res.json() as Promise<T>;
}

interface Post { id: number; title: string }

const post = await apiFetch<Post>('/api/posts/1');
console.log(post.title); // fully typed, no 'any'`,
    interviewQuestion: "How would you design a reusable typed fetch helper, and what are the risks of casting the JSON response directly to a generic type?",
  },
  {
    id: "typescript-typed-api-response-handling",
    category: "typescript",
    difficulty: "Intermediate",
    topic: "Real-World Patterns",
    title: "How do you model success and error API responses with discriminated unions?",
    summary: "Modeling an API response as a discriminated union of success and error shapes forces callers to handle both cases explicitly instead of guessing which fields exist.",
    explanation: "Instead of a single loose type with optional `data` and optional `error` fields (which allows invalid states like both or neither being present), you define a union tagged by a `status` or `success` field. TypeScript's control-flow narrowing then lets you check the tag once and get full type safety on the correct branch, and combined with `noUncheckedIndexedAccess`/exhaustiveness checks this eliminates a whole category of 'cannot read property of undefined' bugs when consuming API results. This pattern generalizes well to typed React Query/SWR results or Redux async state.",
    code: `type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string };

async function getUser(id: string): Promise<ApiResponse<{ name: string }>> {
  const res = await fetch('/api/users/' + id);
  if (!res.ok) return { success: false, error: 'Not found' };
  return { success: true, data: await res.json() };
}

const result = await getUser('42');
if (result.success) {
  console.log(result.data.name); // narrowed, data exists
} else {
  console.error(result.error);   // narrowed, error exists
}`,
    interviewQuestion: "Why is a discriminated union preferable to a type with optional `data` and `error` fields when modeling an API response?",
  },
  {
    id: "typescript-generic-repository-pattern",
    category: "typescript",
    difficulty: "Advanced",
    topic: "Real-World Patterns",
    title: "How do you implement a generic Repository pattern in TypeScript?",
    summary: "A generic repository interface abstracts CRUD operations over an entity type, letting you share persistence logic and swap storage implementations without changing calling code.",
    explanation: "You define a generic interface like `Repository<T, ID>` with methods such as `findById`, `findAll`, `save`, and `delete`, then implement it once per storage backend (in-memory, SQL, Mongo). Generic constraints (e.g. requiring an `id` field) keep the abstraction type-safe, and consumers depend only on the interface, which supports dependency injection and easy mocking in tests. This pattern is common in backend services and ORWM-adjacent layers to decouple domain logic from the specific database driver.",
    code: `interface Entity { id: string }

interface Repository<T extends Entity> {
  findById(id: string): Promise<T | undefined>;
  findAll(): Promise<T[]>;
  save(item: T): Promise<T>;
  delete(id: string): Promise<void>;
}

class InMemoryRepository<T extends Entity> implements Repository<T> {
  private store = new Map<string, T>();
  async findById(id: string) { return this.store.get(id); }
  async findAll() { return [...this.store.values()]; }
  async save(item: T) { this.store.set(item.id, item); return item; }
  async delete(id: string) { this.store.delete(id); }
}

interface User extends Entity { name: string }
const userRepo: Repository<User> = new InMemoryRepository<User>();`,
    interviewQuestion: "How would you design a generic Repository interface so the same contract works for both an in-memory implementation in tests and a real database implementation in production?",
  },
  {
    id: "typescript-dependency-injection",
    category: "typescript",
    difficulty: "Advanced",
    topic: "Real-World Patterns",
    title: "How does Dependency Injection work in TypeScript without a heavyweight framework?",
    summary: "Dependency injection means passing a component's dependencies in from outside (via constructor or factory) rather than constructing them internally, and TypeScript interfaces make the contract explicit and swappable.",
    explanation: "By coding against an interface (e.g. `Logger`, `Database`) rather than a concrete class, a service's constructor can accept any implementation that satisfies the interface, including fakes/mocks used in tests. Frameworks like NestJS or InversifyJS add decorator-based containers and reflection metadata (`emitDecoratorMetadata`, `reflect-metadata`) to auto-wire these dependencies, but plain manual/constructor injection needs no framework at all and is often preferred for simpler apps. The key interview point is that DI decouples the 'what' (the interface) from the 'how' (the concrete implementation), improving testability.",
    code: `interface Logger {
  log(msg: string): void;
}

class ConsoleLogger implements Logger {
  log(msg: string) { console.log('[LOG]', msg); }
}

class OrderService {
  constructor(private readonly logger: Logger) {}
  placeOrder(id: string) {
    this.logger.log('Placing order ' + id);
  }
}

// production
const service = new OrderService(new ConsoleLogger());

// test: inject a fake, no framework needed
const fakeLogger: Logger = { log: jest.fn() };
new OrderService(fakeLogger).placeOrder('1');`,
    interviewQuestion: "How would you implement constructor-based dependency injection in TypeScript, and why does coding against an interface rather than a concrete class matter for testing?",
  },
  {
    id: "typescript-swc-vs-tsc-vs-babel",
    category: "typescript",
    difficulty: "Intermediate",
    topic: "Build & Tooling",
    title: "What are the tradeoffs between SWC, tsc, and Babel for compiling TypeScript?",
    summary: "tsc is the only tool that actually type-checks; SWC and Babel are fast single-file transpilers that strip types without verifying them, so most modern setups use SWC/Babel for speed and tsc separately (or in a build step) just for type checking.",
    explanation: "`tsc` compiles and fully type-checks using the whole program's type graph, which is slow on large codebases but catches real type errors. SWC (written in Rust) and Babel (with @babel/preset-typescript) both simply strip type annotations file-by-file without understanding types at all, so they are dramatically faster and better suited for hot-reload dev servers and bundler pipelines, but they cannot catch a type error and treat `enum`/`namespace` features differently (Babel needs the isolatedModules-compatible subset, no const enums with computed members, etc). The common production pattern is: use SWC or Babel for fast builds/transpilation and run `tsc --noEmit` as a separate CI/lint step purely for type checking.",
    code: `// package.json scripts, a typical split
{
  "scripts": {
    "build": "swc src -d dist",       // fast transpile only, no type errors caught
    "typecheck": "tsc --noEmit",       // slow but catches real type errors
    "dev": "vite"                       // vite uses esbuild/swc under the hood
  }
}

// this compiles fine with SWC/Babel (no type info needed)
// but would fail tsc --noEmit:
function add(a: number, b: number) {
  return a + b;
}
add('1', 2); // SWC/Babel: emits JS anyway. tsc: type error, caught in CI`,
    interviewQuestion: "If SWC and Babel don't type-check TypeScript at all, why would a project still choose them over tsc for its build pipeline, and how do teams still catch type errors?",
  },
  {
    id: "typescript-tsup-rollup-library-bundling",
    category: "typescript",
    difficulty: "Intermediate",
    topic: "Build & Tooling",
    title: "How do you bundle a TypeScript library for npm with tsup or Rollup?",
    summary: "Bundling a TS library means producing both ESM and CJS output plus accurate .d.ts declaration files so consumers on any module system get correct types and runtime code.",
    explanation: "Unlike an application, a published library needs to work across different consumer setups: Node CJS require, modern ESM import, and bundler-based apps, so tools like tsup (an esbuild-based zero-config bundler) or Rollup with @rollup/plugin-typescript are used to emit dual `dist/index.js` (CJS) and `dist/index.mjs` (ESM) builds, alongside a `dist/index.d.ts` generated either by tsc or a plugin like rollup-plugin-dts. The package.json then wires this up with `main`, `module`, `types`, and modern `exports` map entries so tooling picks the right file for each environment. tsup favors convention and speed for simple libraries, while Rollup offers finer control over tree-shaking and plugin composition for more complex builds.",
    code: `// tsup.config.ts
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,        // generates dist/index.d.ts
  clean: true,
  sourcemap: true,
});

// package.json
{
  "main": "dist/index.js",
  "module": "dist/index.mjs",
  "types": "dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.mjs",
      "require": "./dist/index.js",
      "types": "./dist/index.d.ts"
    }
  }
}`,
    interviewQuestion: "When publishing a TypeScript library to npm, why do you typically need to emit both CJS and ESM builds, and how do tools like tsup handle generating the .d.ts files alongside them?",
  },
];
