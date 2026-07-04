// 30 build tools topics for Study Hub.
export default [
  {
    id: "buildtools-webpack-fundamentals",
    category: "buildtools",
    topic: "Webpack",
    title: "What is Webpack and how does it work?",
    difficulty: "Basic",
    summary:
      "Webpack is a static module bundler that builds a dependency graph from an entry point and emits optimized bundles.",
    explanation:
      "Webpack starts at one or more entry files, parses import/require statements to build a dependency graph, then bundles everything into output files. It treats every file (JS, CSS, images) as a module. Loaders transform non-JS files into modules Webpack can process, while plugins hook into the build lifecycle to perform broader tasks like minification or asset injection. The core config revolves around entry, output, module.rules, and plugins. Webpack's flexibility made it the default choice for complex apps needing fine-grained control over bundling.",
    code: "// webpack.config.js\nconst path = require('path');\n\nmodule.exports = {\n  mode: 'production',\n  entry: './src/index.js',\n  output: {\n    filename: 'bundle.[contenthash].js',\n    path: path.resolve(__dirname, 'dist'),\n    clean: true,\n  },\n  module: {\n    rules: [\n      { test: /\\.js$/, exclude: /node_modules/, use: 'babel-loader' },\n      { test: /\\.css$/, use: ['style-loader', 'css-loader'] },\n    ],\n  },\n};",
    interviewQuestion: "Explain the core concepts of Webpack: entry, output, loaders, and plugins.",
  },
  {
    id: "buildtools-webpack-loaders-plugins",
    category: "buildtools",
    topic: "Webpack",
    title: "Difference between loaders and plugins",
    difficulty: "Intermediate",
    summary:
      "Loaders transform individual files before they become modules; plugins tap into the entire compilation lifecycle.",
    explanation:
      "Loaders operate at the module level and run in a pipeline, transforming file contents (e.g. transpiling TS to JS, converting SCSS to CSS) via a test regex and a use array evaluated right-to-left. Plugins are more powerful — they hook into Webpack's compiler lifecycle events (compile, emit, done) via the tapable plugin system, enabling tasks loaders can't do, like generating an HTML file, extracting CSS into separate files, or cleaning the output directory. A loader answers 'how do I read this file type?' while a plugin answers 'what else should happen during the build?'.",
    code: "// webpack.config.js\nconst HtmlWebpackPlugin = require('html-webpack-plugin');\nconst MiniCssExtractPlugin = require('mini-css-extract-plugin');\n\nmodule.exports = {\n  module: {\n    rules: [\n      {\n        test: /\\.css$/,\n        use: [MiniCssExtractPlugin.loader, 'css-loader'],\n      },\n    ],\n  },\n  plugins: [\n    new HtmlWebpackPlugin({ template: './src/index.html' }),\n    new MiniCssExtractPlugin({ filename: '[name].[contenthash].css' }),\n  ],\n};",
    interviewQuestion: "How would you extract CSS into a separate file instead of injecting it via JS in Webpack?",
  },
  {
    id: "buildtools-vite-fundamentals",
    category: "buildtools",
    topic: "Vite",
    title: "How does Vite achieve fast dev server startup?",
    difficulty: "Basic",
    summary:
      "Vite serves source files over native ES modules in dev, avoiding full bundling, and uses esbuild for dependency pre-bundling.",
    explanation:
      "Instead of bundling the entire app before serving (like Webpack), Vite's dev server leverages native browser ESM support — it transforms and serves files on demand as the browser requests them. Dependencies from node_modules are pre-bundled once with esbuild (written in Go, 10-100x faster than JS-based bundlers) into single ESM files to reduce network requests and handle CommonJS interop. This means dev server startup is near-instant regardless of app size, since Vite doesn't need to crawl and bundle the whole graph upfront. For production, Vite switches to Rollup for optimized, tree-shaken bundles.",
    code: "// vite.config.js\nimport { defineConfig } from 'vite';\nimport react from '@vitejs/plugin-react';\n\nexport default defineConfig({\n  plugins: [react()],\n  server: {\n    port: 5173,\n    open: true,\n  },\n  optimizeDeps: {\n    include: ['lodash-es'],\n  },\n});",
    interviewQuestion: "Why is Vite's dev server startup so much faster than Webpack's for large apps?",
  },
  {
    id: "buildtools-vite-vs-webpack",
    category: "buildtools",
    topic: "Vite",
    title: "Vite vs Webpack: when to choose which?",
    difficulty: "Intermediate",
    summary:
      "Vite favors speed and simplicity via native ESM and esbuild/Rollup; Webpack favors maximal configurability and ecosystem maturity.",
    explanation:
      "Vite's dev experience is dramatically faster because it avoids bundling during development, while Webpack bundles everything upfront, causing slower startup as apps grow. Webpack has a longer track record, a vast loader/plugin ecosystem, and finer-grained control useful for complex legacy setups (module federation, custom chunking strategies). Vite's production build uses Rollup, which produces smaller, more tree-shaken bundles for typical apps with less configuration. Migration from Webpack to Vite can require replacing loader-based transforms with Vite plugins, and some Webpack-specific features (like certain module federation setups) may need workarounds.",
    code: "// Rough feature comparison expressed as config intent\n\n// Webpack: explicit control over every transform\nmodule.exports = {\n  module: { rules: [/* loaders for every file type */] },\n};\n\n// Vite: convention-based, minimal config\nexport default {\n  plugins: [/* framework plugin handles most transforms */],\n};",
    interviewQuestion: "You're starting a new SPA in 2026 — would you pick Vite or Webpack, and why?",
  },
  {
    id: "buildtools-rollup-basics",
    category: "buildtools",
    topic: "Rollup",
    title: "What makes Rollup well-suited for libraries?",
    difficulty: "Basic",
    summary:
      "Rollup produces flat, tree-shaken ES module bundles, making it ideal for publishing libraries rather than large apps.",
    explanation:
      "Rollup was built around ES modules from the start, which gives it very effective static analysis for tree shaking — it can determine exactly which exports are used and eliminate the rest, producing lean output. It supports multiple output formats (ESM, CJS, UMD, IIFE) from a single source, which is essential for libraries that need to support both bundler consumers and script-tag usage. Unlike Webpack's runtime module wrapper overhead, Rollup's flat bundle output reads almost like hand-written code, which reduces bundle size for small-to-medium packages. Many popular libraries (React, Vue, D3) use Rollup for their build.",
    code: "// rollup.config.js\nimport resolve from '@rollup/plugin-node-resolve';\nimport commonjs from '@rollup/plugin-commonjs';\n\nexport default {\n  input: 'src/index.js',\n  output: [\n    { file: 'dist/bundle.cjs.js', format: 'cjs' },\n    { file: 'dist/bundle.esm.js', format: 'esm' },\n  ],\n  plugins: [resolve(), commonjs()],\n  external: ['react', 'react-dom'],\n};",
    interviewQuestion: "Why would you choose Rollup over Webpack when publishing an npm package?",
  },
  {
    id: "buildtools-esbuild",
    category: "buildtools",
    topic: "esbuild",
    title: "Why is esbuild so much faster than JS-based bundlers?",
    difficulty: "Intermediate",
    summary:
      "esbuild is written in Go, uses parallelized multi-core processing, and avoids costly abstractions found in JS bundlers.",
    explanation:
      "esbuild compiles to native machine code (Go) instead of running on the single-threaded, garbage-collected JS runtime, giving it a huge baseline speed advantage. It parses, transforms, and prints code with hand-optimized algorithms and shares work across CPU cores via goroutines, whereas most JS bundlers process serially or add worker-pool overhead. It does its own bundling, minification, and TS/JSX transpilation in one pass rather than chaining many separate loader transforms. The tradeoff is a less pluggable architecture — esbuild's plugin API is simpler and it lacks some advanced features like fine-grained code splitting heuristics found in mature bundlers, which is why tools like Vite use esbuild for dev/pre-bundling but Rollup for the final production build.",
    code: "// build.js\nrequire('esbuild').build({\n  entryPoints: ['src/index.tsx'],\n  bundle: true,\n  minify: true,\n  sourcemap: true,\n  target: ['chrome100', 'firefox100'],\n  outfile: 'dist/bundle.js',\n}).catch(() => process.exit(1));",
    interviewQuestion: "What architectural choices let esbuild outperform Webpack/Babel-based pipelines by 10-100x?",
  },
  {
    id: "buildtools-babel-fundamentals",
    category: "buildtools",
    topic: "Babel",
    title: "What problem does Babel solve?",
    difficulty: "Basic",
    summary:
      "Babel transpiles modern JavaScript syntax into backward-compatible versions so code runs on older browsers/environments.",
    explanation:
      "Babel parses source code into an AST (Abstract Syntax Tree), applies a series of transform plugins to that tree, and generates equivalent code targeting older JS specs. This lets developers write with the latest syntax (optional chaining, async/await, JSX) while shipping code compatible with target environments defined in Browserslist. Babel itself doesn't bundle files — it's typically used alongside Webpack (via babel-loader) or standalone via the CLI. Its plugin architecture means each syntax feature (e.g. class properties, decorators) is handled by an independent, composable plugin.",
    code: "// babel.config.json\n{\n  \"presets\": [\n    [\"@babel/preset-env\", { \"targets\": \"> 0.25%, not dead\" }],\n    \"@babel/preset-react\"\n  ],\n  \"plugins\": [\"@babel/plugin-transform-runtime\"]\n}",
    interviewQuestion: "How does Babel transform modern JS syntax into code that runs on older browsers?",
  },
  {
    id: "buildtools-babel-presets-plugins",
    category: "buildtools",
    topic: "Babel",
    title: "Babel presets vs plugins",
    difficulty: "Intermediate",
    summary:
      "A plugin implements one syntax transform; a preset is a curated, ordered bundle of plugins for a common use case.",
    explanation:
      "Each Babel plugin targets a specific transform, e.g. @babel/plugin-transform-arrow-functions converts arrow functions to regular functions. Manually listing dozens of plugins is tedious, so presets like @babel/preset-env bundle the right set of plugins based on target environments, and @babel/preset-react/@babel/preset-typescript handle JSX/TS syntax. Plugins run before presets, and both run in the order listed except presets are applied in reverse order. preset-env also supports 'useBuiltIns' to auto-inject core-js polyfills based on actual usage rather than blanket-including everything, which keeps bundles smaller.",
    code: "// babel.config.js\nmodule.exports = {\n  presets: [\n    ['@babel/preset-env', {\n      useBuiltIns: 'usage',\n      corejs: 3,\n    }],\n  ],\n  plugins: [\n    '@babel/plugin-proposal-decorators',\n    '@babel/plugin-transform-class-properties',\n  ],\n};",
    interviewQuestion: "In what order do Babel plugins and presets execute, and why does that matter?",
  },
  {
    id: "buildtools-module-bundling-concepts",
    category: "buildtools",
    topic: "Bundling Concepts",
    title: "How does a bundler resolve and merge modules?",
    difficulty: "Intermediate",
    summary:
      "Bundlers build a dependency graph from entry points, resolve each import to a file, then wrap and concatenate modules into one or more output files.",
    explanation:
      "Starting from entry points, the bundler's resolver walks import/require statements, using Node's module resolution algorithm (checking node_modules, package.json 'main'/'exports' fields, file extensions) to map each specifier to an actual file. Each resolved module is parsed and wrapped in a function scope to avoid global namespace collisions, then given a unique module ID. At runtime, a small bootstrap/runtime script implements a require() function that looks up modules by ID and caches their exports, so re-importing the same module doesn't re-execute it. Circular dependencies are handled by returning a partially-populated exports object at the time of the circular reference.",
    code: "// Simplified bundler runtime concept\nconst modules = {\n  './a.js': function (module, exports, require) {\n    const b = require('./b.js');\n    module.exports = b.value + 1;\n  },\n  './b.js': function (module, exports) {\n    module.exports = { value: 41 };\n  },\n};\n\nfunction __require(id) {\n  const module = { exports: {} };\n  modules[id](module, module.exports, __require);\n  return module.exports;\n}",
    interviewQuestion: "Conceptually, how does a bundler turn many CommonJS/ESM files into one runnable bundle?",
  },
  {
    id: "buildtools-tree-shaking-bundlers",
    category: "buildtools",
    topic: "Optimization",
    title: "How does tree shaking eliminate dead code?",
    difficulty: "Intermediate",
    summary:
      "Tree shaking relies on ES module static structure to detect and remove exports that are never imported anywhere.",
    explanation:
      "Because ES module imports/exports are static (not conditional or dynamic like CommonJS require), bundlers can analyze the module graph at build time to determine exactly which exported bindings are actually used. Unused exports are marked as 'dead' and eliminated during minification, along with any code only reachable through them. This requires all involved code to be authored (or shipped) as ESM — a CommonJS dependency in the chain breaks static analysis and disables tree shaking for that subtree. Bundlers also need 'sideEffects' metadata in package.json to safely drop modules that have no side effects when unused, since JS allows top-level code with side effects that must be preserved even if exports are unused.",
    code: "// utils.js -- only add() is imported elsewhere\nexport function add(a, b) { return a + b; }\nexport function subtract(a, b) { return a - b; }\n\n// package.json\n{\n  \"name\": \"my-lib\",\n  \"sideEffects\": false\n}\n\n// main.js\nimport { add } from './utils.js';\nconsole.log(add(2, 3));\n// subtract() is dropped from the production bundle",
    interviewQuestion: "Why does tree shaking work reliably with ESM but not with CommonJS?",
  },
  {
    id: "buildtools-code-splitting-configuration",
    category: "buildtools",
    topic: "Optimization",
    title: "How do you configure code splitting in Webpack?",
    difficulty: "Advanced",
    summary:
      "Code splitting breaks a bundle into smaller chunks loaded on demand, using dynamic import() and splitChunks configuration.",
    explanation:
      "Dynamic import() statements create split points — Webpack automatically emits a separate chunk for that module and its unique dependencies, loaded lazily at runtime (e.g. for route-based lazy loading). The optimization.splitChunks setting controls how shared vendor code is extracted into common chunks to avoid duplicating dependencies across multiple entry bundles, based on rules like minSize, maxSize, and cacheGroups. Proper chunking reduces initial load time by only shipping what's needed for the first render, while keeping vendor code (which changes rarely) in a separately cacheable file so app-code updates don't invalidate the vendor cache.",
    code: "// webpack.config.js\nmodule.exports = {\n  optimization: {\n    splitChunks: {\n      chunks: 'all',\n      cacheGroups: {\n        vendor: {\n          test: /[\\\\/]node_modules[\\\\/]/,\n          name: 'vendors',\n          priority: -10,\n        },\n      },\n    },\n  },\n};\n\n// In app code:\nconst Chart = React.lazy(() => import('./Chart'));",
    interviewQuestion: "How would you set up route-based code splitting and shared vendor chunking in Webpack?",
  },
  {
    id: "buildtools-source-maps",
    category: "buildtools",
    topic: "Debugging",
    title: "What are source maps and how do they work?",
    difficulty: "Basic",
    summary:
      "Source maps are files that map minified/transpiled output positions back to original source locations for debugging.",
    explanation:
      "When code is bundled, transpiled, and minified, the shipped output bears little resemblance to the original source. A source map (typically a .map JSON file) contains a mapping table (using VLQ-encoded 'mappings') that lets browser devtools translate a line/column in the generated file back to the exact line/column in the original source file. This allows setting breakpoints and reading stack traces in your original TypeScript/JSX rather than minified bundle code. Different devtool settings (eval, cheap-module-source-map, hidden-source-map) trade off build speed, rebuild speed, and map accuracy — production builds often use hidden-source-map to upload maps to an error-tracking service without exposing them publicly.",
    code: "// webpack.config.js\nmodule.exports = {\n  mode: 'production',\n  devtool: 'hidden-source-map', // maps generated but not linked publicly\n};\n\n// Or for fast local dev\nmodule.exports = {\n  mode: 'development',\n  devtool: 'eval-cheap-module-source-map',\n};",
    interviewQuestion: "What's the tradeoff between different Webpack devtool source map options for dev vs production?",
  },
  {
    id: "buildtools-hot-module-replacement",
    category: "buildtools",
    topic: "Dev Server",
    title: "How does Hot Module Replacement preserve state?",
    difficulty: "Advanced",
    summary:
      "HMR swaps updated modules in a running app at runtime without a full reload, preserving application state where accept handlers exist.",
    explanation:
      "The dev server watches files and, on change, recompiles only the affected module(s), pushing the update to the browser over a WebSocket connection instead of reloading the page. The HMR runtime in the browser calls module.hot.accept() handlers registered by the module (or its parent) to swap in the new implementation. Framework integrations like React Fast Refresh build on HMR primitives but add component-aware logic — they preserve component state for edits to render logic but reset state when a component's type signature changes. If no accept handler exists up the module tree, HMR falls back to a full page reload, since it can't safely determine how to reconcile state.",
    code: "// webpack.config.js\nmodule.exports = {\n  devServer: { hot: true },\n};\n\n// module.js -- manual HMR API usage\nif (module.hot) {\n  module.hot.accept('./reducer.js', () => {\n    store.replaceReducer(require('./reducer.js').default);\n  });\n}",
    interviewQuestion: "How does HMR decide whether to hot-swap a module versus triggering a full page reload?",
  },
  {
    id: "buildtools-bundle-analysis-tools",
    category: "buildtools",
    topic: "Optimization",
    title: "How do you find what's bloating your bundle?",
    difficulty: "Intermediate",
    summary:
      "Bundle analyzer tools visualize module sizes within your output bundles, exposing large or duplicated dependencies.",
    explanation:
      "Tools like webpack-bundle-analyzer parse the compilation stats and render an interactive treemap showing each module's contribution to bundle size, making it easy to spot an accidentally-included large library (e.g. moment.js with all locales) or duplicate versions of the same package pulled in by different dependencies. source-map-explorer does similar analysis but works from source maps against the actual shipped file, useful when you don't control the build config directly. Common findings include importing an entire library instead of a specific function (import _ from 'lodash' vs import debounce from 'lodash/debounce'), missing tree shaking due to CJS modules, or multiple major versions of the same dependency being bundled separately.",
    code: "// webpack.config.js\nconst { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');\n\nmodule.exports = {\n  plugins: [\n    new BundleAnalyzerPlugin({\n      analyzerMode: 'static',\n      openAnalyzer: false,\n      reportFilename: 'bundle-report.html',\n    }),\n  ],\n};",
    interviewQuestion: "Walk me through how you'd diagnose and fix an unexpectedly large production bundle.",
  },
  {
    id: "buildtools-postcss",
    category: "buildtools",
    topic: "CSS Tooling",
    title: "What is PostCSS and how does it differ from a preprocessor?",
    difficulty: "Basic",
    summary:
      "PostCSS is a CSS transformation engine driven by a plugin pipeline, used for things like autoprefixing, nesting, and future-syntax support.",
    explanation:
      "Unlike Sass/Less, which are complete preprocessing languages with their own syntax and compiler, PostCSS parses standard(ish) CSS into an AST and lets you compose transforms from an ecosystem of independent plugins — autoprefixer adds vendor prefixes based on Browserslist targets, postcss-preset-env lets you use future CSS syntax today, and postcss-import inlines @import statements. Because it's plugin-based rather than monolithic, teams pick exactly the transforms they need instead of accepting an entire preprocessor's feature set. PostCSS is commonly layered after Sass compilation in a pipeline, or used standalone with Tailwind CSS, which itself is a PostCSS plugin.",
    code: "// postcss.config.js\nmodule.exports = {\n  plugins: [\n    require('postcss-import'),\n    require('tailwindcss'),\n    require('autoprefixer'),\n    require('postcss-preset-env')({ stage: 1 }),\n  ],\n};",
    interviewQuestion: "How does PostCSS's plugin architecture differ from using Sass as your CSS preprocessor?",
  },
  {
    id: "buildtools-eslint-configuration",
    category: "buildtools",
    topic: "Linting",
    title: "How does ESLint's flat config system work?",
    difficulty: "Intermediate",
    summary:
      "ESLint uses rules organized into shareable configs, applied via a config file that composes parser options, plugins, and rule overrides.",
    explanation:
      "ESLint statically analyzes code against an AST to flag patterns violating configured rules, ranging from stylistic (no-unused-vars) to correctness-related (no-undef, react-hooks/exhaustive-deps). Since v9, the flat config format (eslint.config.js, an array of config objects) replaced the older .eslintrc cascading file format, making config resolution more explicit and predictable — each object specifies files it applies to, plugins, and rules, and arrays are merged in order rather than resolved by directory hierarchy. Shareable configs (eslint-config-airbnb, plugin:react/recommended) bundle sane rule defaults; teams typically extend one and override a handful of rules. Autofixable rules can be applied automatically via --fix.",
    code: "// eslint.config.js (flat config)\nimport js from '@eslint/js';\nimport react from 'eslint-plugin-react';\n\nexport default [\n  js.configs.recommended,\n  {\n    files: ['**/*.{js,jsx}'],\n    plugins: { react },\n    rules: {\n      'react/prop-types': 'off',\n      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],\n    },\n  },\n];",
    interviewQuestion: "What changed with ESLint's flat config compared to the legacy .eslintrc format?",
  },
  {
    id: "buildtools-prettier-configuration",
    category: "buildtools",
    topic: "Formatting",
    title: "How should Prettier and ESLint coexist?",
    difficulty: "Basic",
    summary:
      "Prettier handles code formatting (whitespace, quotes, line length); ESLint handles code quality — overlapping style rules should be disabled in ESLint.",
    explanation:
      "Prettier is an opinionated formatter with very few options by design, re-printing code according to a fixed style rather than flagging violations. ESLint, meanwhile, can also enforce stylistic rules, which creates conflicts if both tools disagree on formatting. The standard fix is eslint-config-prettier, which disables all ESLint rules that could conflict with Prettier's formatting, letting ESLint focus purely on correctness/quality rules while Prettier owns formatting. Running Prettier via a pre-commit hook (lint-staged + husky) or editor-on-save keeps formatting consistent without needing PR review comments about style.",
    code: "// .prettierrc.json\n{\n  \"semi\": true,\n  \"singleQuote\": true,\n  \"trailingComma\": \"es5\",\n  \"printWidth\": 80\n}\n\n// eslint.config.js\nimport prettierConfig from 'eslint-config-prettier';\n\nexport default [\n  // ...other configs\n  prettierConfig, // disables conflicting stylistic rules\n];",
    interviewQuestion: "Why do teams pair eslint-config-prettier with Prettier instead of relying on ESLint alone?",
  },
  {
    id: "buildtools-monorepo-tools",
    category: "buildtools",
    topic: "Monorepo",
    title: "How do Turborepo and Nx speed up monorepo builds?",
    difficulty: "Advanced",
    summary:
      "Both tools use task graphs and caching (local + remote) to skip re-running unchanged tasks and parallelize across packages.",
    explanation:
      "Monorepo build tools model your workspace as a dependency graph of packages and tasks (build, test, lint) with declared dependencies (e.g. 'build depends on the build of dependencies'). They compute a hash of each task's inputs (source files, deps, env vars) and skip execution entirely if that hash was already computed before, restoring cached output instead — this can apply locally or via a remote cache shared across CI runs and teammates' machines. Turborepo is lighter-weight and pipeline-config-driven (turbo.json), commonly paired with npm/pnpm/yarn workspaces, while Nx offers a more full-featured plugin ecosystem, code generators, and a project graph visualizer, often used in larger enterprise monorepos. Both dramatically cut CI time by avoiding redundant rebuilds of packages that haven't changed.",
    code: "// turbo.json\n{\n  \"$schema\": \"https://turbo.build/schema.json\",\n  \"pipeline\": {\n    \"build\": {\n      \"dependsOn\": [\"^build\"],\n      \"outputs\": [\"dist/**\"]\n    },\n    \"test\": {\n      \"dependsOn\": [\"build\"],\n      \"outputs\": []\n    }\n  }\n}",
    interviewQuestion: "How does Turborepo know it's safe to skip re-running a task and use the cache instead?",
  },
  {
    id: "buildtools-package-managers",
    category: "buildtools",
    topic: "Package Managers",
    title: "npm vs yarn vs pnpm: how do they differ?",
    difficulty: "Intermediate",
    summary:
      "npm and yarn traditionally flatten node_modules; pnpm uses a content-addressable global store with symlinks to save disk space and enforce stricter resolution.",
    explanation:
      "npm and classic Yarn hoist dependencies into a flattened node_modules tree, which can lead to phantom dependencies (accessing a package not declared in your own package.json but hoisted there by another dependency). pnpm instead stores every package version once in a global content-addressable store and links it into each project's node_modules via hard links/symlinks, creating a strict, non-flat structure that prevents phantom access while saving significant disk space across projects. Yarn Berry (v2+) introduced Plug'n'Play, which skips node_modules entirely and resolves packages from a single zip-based cache, though it caused compatibility friction with tools expecting a real node_modules folder. Performance-wise, pnpm is generally fastest for installs due to hard-linking, and npm has closed much of the historical speed gap with yarn classic.",
    code: "# npm\nnpm install\nnpm ci  # clean install from lockfile, used in CI\n\n# yarn classic\nyarn install --frozen-lockfile\n\n# pnpm\npnpm install --frozen-lockfile\npnpm store status  # inspect the shared content-addressable store",
    interviewQuestion: "What is a 'phantom dependency' and how does pnpm's node_modules structure prevent it?",
  },
  {
    id: "buildtools-lockfiles-deep-dive",
    category: "buildtools",
    topic: "Package Managers",
    title: "Why are lockfiles essential for reproducible builds?",
    difficulty: "Intermediate",
    summary:
      "Lockfiles pin the exact resolved version and integrity hash of every dependency (including transitive ones) so installs are deterministic across machines.",
    explanation:
      "A package.json specifies version ranges (^1.2.0), which alone don't guarantee the same versions get installed at different times, since new matching versions may publish. The lockfile (package-lock.json, yarn.lock, pnpm-lock.yaml) records the exact resolved version, download URL, and an integrity hash (SHA-512) for every package in the full dependency tree, ensuring npm ci / yarn install --frozen-lockfile produce byte-identical node_modules on any machine or CI run. Committing the lockfile to version control is essential for reproducibility; deleting or regenerating it can silently bump transitive dependencies and introduce breaking changes or vulnerabilities. Lockfile diffs in PRs are also a useful security signal — an unexpected large diff for a small code change warrants review.",
    code: "// package-lock.json (excerpt)\n{\n  \"packages\": {\n    \"node_modules/lodash\": {\n      \"version\": \"4.17.21\",\n      \"resolved\": \"https://registry.npmjs.org/lodash/-/lodash-4.17.21.tgz\",\n      \"integrity\": \"sha512-v2kDEe57lecTulaDIuNTPy3Ry4/GadJd8f4dfPk5tPqCMqdZKcU5cJPZFfHZq2CqSGqZO5tD8LU0mnDkAzeC8w==\"\n    }\n  }\n}",
    interviewQuestion: "What breaks if a lockfile is deleted and regenerated right before a production deploy?",
  },
  {
    id: "buildtools-environment-based-builds",
    category: "buildtools",
    topic: "Build Configuration",
    title: "How do you manage environment-specific builds?",
    difficulty: "Intermediate",
    summary:
      "Environment-based builds inject different config/env variables (API URLs, feature flags) per target (dev/staging/prod) at build time.",
    explanation:
      "Most bundlers support replacing global identifiers like process.env.NODE_ENV or import.meta.env with static values at build time via define/DefinePlugin, which also enables dead-code elimination of environment-specific branches (e.g. if (process.env.NODE_ENV !== 'production') blocks get stripped entirely in prod builds). Tools like Vite load .env, .env.production, .env.development files automatically based on the mode, exposing only variables prefixed with VITE_ (or similar) to client code to avoid leaking server secrets into the bundle. It's critical to distinguish build-time env vars (baked into the bundle, requiring a rebuild to change) from runtime-injected config (read from a server endpoint or global at page load), since the former can't be changed without redeploying.",
    code: "// vite.config.js\nimport { defineConfig, loadEnv } from 'vite';\n\nexport default defineConfig(({ mode }) => {\n  const env = loadEnv(mode, process.cwd(), '');\n  return {\n    define: {\n      __API_URL__: JSON.stringify(env.VITE_API_URL),\n    },\n  };\n});\n\n// .env.production\n// VITE_API_URL=https://api.example.com",
    interviewQuestion: "What's the difference between a build-time environment variable and a runtime-configured one, and why does it matter for Docker deployments?",
  },
  {
    id: "buildtools-asset-optimization-pipelines",
    category: "buildtools",
    topic: "Optimization",
    title: "How do build tools optimize images and static assets?",
    difficulty: "Intermediate",
    summary:
      "Asset pipelines compress images, inline small files as data URIs, and fingerprint filenames for long-term caching.",
    explanation:
      "Modern bundlers treat imported assets (images, fonts, SVGs) as modules, applying transforms such as lossless/lossy compression (via imagemin, sharp), format conversion (PNG to WebP/AVIF), and responsive srcset generation. A common size threshold rule inlines small assets (e.g. under 4-8kb) as base64 data URIs to avoid extra HTTP requests, while larger files are emitted as separate files with content-hashed names (logo.a1b2c3.png) enabling aggressive cache-control headers since the filename changes whenever content does. SVGs are often handled specially — imported as optimized static files or as React components via SVGR. Getting this pipeline right significantly affects Largest Contentful Paint and overall page weight.",
    code: "// vite.config.js -- built-in asset handling\nexport default {\n  build: {\n    assetsInlineLimit: 4096, // inline files < 4kb as base64\n  },\n};\n\n// Webpack equivalent using asset modules\nmodule.exports = {\n  module: {\n    rules: [\n      {\n        test: /\\.(png|jpg|svg)$/,\n        type: 'asset',\n        parser: { dataUrlCondition: { maxSize: 4 * 1024 } },\n      },\n    ],\n  },\n};",
    interviewQuestion: "What's the tradeoff of inlining small images as base64 versus always emitting separate files?",
  },
  {
    id: "buildtools-swc-compiler",
    category: "buildtools",
    topic: "SWC",
    title: "What is SWC and where does it fit vs Babel?",
    difficulty: "Intermediate",
    summary:
      "SWC is a Rust-based JS/TS compiler offering Babel-compatible transforms at drastically higher speed, used internally by Next.js and others.",
    explanation:
      "SWC (Speedy Web Compiler) parses, transforms, and generates JavaScript/TypeScript using Rust, giving it native-code performance similar to esbuild's Go advantage over pure-JS tools like Babel. It supports plugin-based transforms conceptually similar to Babel (and even provides a Babel-config compatibility layer for easier migration), covering TS stripping, JSX, decorators, and minification (via its bundled terser-equivalent). Next.js replaced Babel with SWC by default for both compilation and minification, citing multi-second-to-sub-second build time improvements on large codebases. The main tradeoff versus Babel is a smaller (though rapidly growing) plugin ecosystem, since Babel's massive plugin library has 8+ years of community coverage for edge-case syntax transforms.",
    code: "// .swcrc\n{\n  \"jsc\": {\n    \"parser\": { \"syntax\": \"typescript\", \"tsx\": true },\n    \"target\": \"es2020\",\n    \"transform\": { \"react\": { \"runtime\": \"automatic\" } }\n  },\n  \"minify\": true\n}",
    interviewQuestion: "Why did Next.js switch its default compiler from Babel to SWC, and what did teams give up in doing so?",
  },
  {
    id: "buildtools-parcel-bundler",
    category: "buildtools",
    topic: "Parcel",
    title: "What is Parcel's 'zero configuration' approach?",
    difficulty: "Basic",
    summary:
      "Parcel automatically infers transforms and dependencies from file extensions and content, requiring little to no config file.",
    explanation:
      "Unlike Webpack, which requires explicit loader rules for every file type, Parcel ships with built-in transformers for common formats (JS, TS, JSX, CSS, HTML, images) and automatically detects which Babel/PostCSS/TypeScript config to apply based on files present in the project, so most projects need zero bundler config to get started. It uses a multi-core, worker-based architecture with a persistent filesystem cache for fast rebuilds, and has built-in support for code splitting and HMR out of the box. Parcel is a good fit for smaller projects or prototypes where the setup overhead of Webpack isn't worth it, though it offers less fine-grained control for advanced/custom build pipelines.",
    code: "// package.json\n{\n  \"scripts\": {\n    \"start\": \"parcel src/index.html\",\n    \"build\": \"parcel build src/index.html\"\n  }\n}\n\n// No parcel.config needed for standard JS/CSS/HTML --\n// Parcel infers transforms from file extensions automatically.",
    interviewQuestion: "How does Parcel achieve 'zero config' bundling compared to Webpack's explicit loader setup?",
  },
  {
    id: "buildtools-module-federation",
    category: "buildtools",
    topic: "Micro-frontends",
    title: "How does Webpack Module Federation enable micro-frontends?",
    difficulty: "Advanced",
    summary:
      "Module Federation lets separately built and deployed applications dynamically share code at runtime by exposing and consuming remote modules.",
    explanation:
      "Each application declares itself as a 'host' (consumer), a 'remote' (exposer), or both, listing which local modules it exposes and which remote modules it wants to consume, typically pointing to a remoteEntry.js manifest served by the remote app. At runtime, the host fetches the remote's entry file, which registers the remote's exposed modules and shared dependency versions in a shared scope, allowing the host to dynamically import components from a completely separately deployed and versioned application. Shared dependencies (react, react-dom) are deduplicated via version negotiation — if compatible versions are already loaded, the remote reuses them instead of loading a duplicate copy. This enables independently deployable micro-frontends without npm-publishing every shared component, at the cost of added runtime complexity and versioning coordination.",
    code: "// webpack.config.js (remote app, 'shop')\nconst { ModuleFederationPlugin } = require('webpack').container;\n\nmodule.exports = {\n  plugins: [\n    new ModuleFederationPlugin({\n      name: 'shop',\n      filename: 'remoteEntry.js',\n      exposes: { './ProductList': './src/ProductList' },\n      shared: ['react', 'react-dom'],\n    }),\n  ],\n};\n\n// host app consumes it dynamically:\n// const ProductList = React.lazy(() => import('shop/ProductList'));",
    interviewQuestion: "How does Module Federation avoid loading duplicate copies of React across host and remote apps?",
  },
  {
    id: "buildtools-ci-build-caching",
    category: "buildtools",
    topic: "CI/CD",
    title: "How do you effectively cache builds in CI?",
    difficulty: "Advanced",
    summary:
      "CI build caching persists dependency installs and build outputs between runs keyed by lockfile/content hashes, avoiding redundant work.",
    explanation:
      "The most common CI cache targets are the package manager's store (node_modules or pnpm's content-addressable store) keyed by a hash of the lockfile, and bundler-level caches (Webpack's persistent cache, Next.js's .next/cache) keyed by source content hashes, restored before the build step runs. A cache hit on the dependency install step alone can cut minutes off every CI run, while bundler caches speed up incremental compilation similarly to local dev rebuilds. Remote caching (Turborepo, Nx Cloud) takes this further by sharing build/test task outputs across the whole team and CI, not just within a single pipeline's cache scope. Cache keys must be precise — too broad and you risk stale/incorrect artifacts; too narrow and you get frequent unnecessary cache misses; a good practice is to always include a fallback restore-key for partial hits.",
    code: "# .github/workflows/ci.yml (excerpt)\n- uses: actions/setup-node@v4\n  with:\n    node-version: 20\n    cache: 'pnpm'\n\n- name: Cache Next.js build\n  uses: actions/cache@v4\n  with:\n    path: .next/cache\n    key: nextjs-${{ hashFiles('pnpm-lock.yaml') }}-${{ hashFiles('**/*.js','**/*.tsx') }}\n    restore-keys: |\n      nextjs-${{ hashFiles('pnpm-lock.yaml') }}-",
    interviewQuestion: "What would you cache in a CI pipeline to cut a 10-minute build down significantly, and how would you key that cache?",
  },
  {
    id: "buildtools-tree-shaking-pitfalls",
    category: "buildtools",
    topic: "Optimization",
    title: "Why does tree shaking sometimes silently fail?",
    difficulty: "Tricky",
    summary:
      "Tree shaking breaks down with CommonJS interop, missing sideEffects flags, re-export barrels, and Babel transforming ESM to CJS before bundling.",
    explanation:
      "A frequent surprise is that Babel's @babel/preset-env, if configured with modules: 'commonjs' (or left at its default 'auto' in some setups), converts your ESM import/export syntax into CommonJS require/module.exports before Webpack ever sees it — since Webpack's tree shaking depends on recognizing static ESM syntax, this silently disables it project-wide even though your source code looks like ESM. Barrel files (index.js that re-export everything from a folder) also hurt tree shaking in practice, because bundlers often can't prove that importing one named export doesn't trigger side effects from evaluating sibling modules in the same barrel, especially without a correct 'sideEffects' field. A package.json missing 'sideEffects: false' (or incorrectly set to true when it should list specific side-effectful files) causes bundlers to conservatively keep code that's actually dead, since removing it could theoretically break intentional side effects like polyfills or CSS imports.",
    code: "// BAD: preset-env config disables tree shaking\n// babel.config.js\nmodule.exports = {\n  presets: [['@babel/preset-env', { modules: 'commonjs' }]],\n};\n\n// GOOD: let Webpack handle ESM, Babel only strips types/JSX\nmodule.exports = {\n  presets: [['@babel/preset-env', { modules: false }]],\n};\n\n// package.json -- also required for barrel-file tree shaking\n{\n  \"sideEffects\": [\"*.css\"]\n}",
    interviewQuestion: "You added a Babel-transpiled dependency and tree shaking stopped working for your whole bundle — what's the likely cause?",
  },
  {
    id: "buildtools-build-performance-optimization",
    category: "buildtools",
    topic: "Performance",
    title: "How do you diagnose and fix slow build times?",
    difficulty: "Advanced",
    summary:
      "Slow builds are usually fixed via persistent caching, parallelization, narrower loader scopes, and offloading heavy transforms to faster native tools.",
    explanation:
      "Start by profiling — Webpack's speed-measure-webpack-plugin or built-in --profile flag shows which loaders/plugins consume the most time. Common wins include narrowing loader 'include'/'exclude' scopes so babel-loader doesn't process node_modules, enabling Webpack's persistent filesystem cache (cache: { type: 'filesystem' }) so unchanged modules skip re-transformation entirely, using thread-loader or parallel workers to spread transform work across CPU cores, and replacing slower JS-based tools (Babel, Terser) with Rust/Go equivalents (SWC, esbuild) for transpilation and minification. For monorepos, incremental/affected-only builds (Nx, Turborepo) and remote caching prevent rebuilding unchanged packages. TypeScript's isolatedModules plus transpile-only mode (skipping full type-checking during the build, running tsc --noEmit separately/in parallel) is another common speedup since type-checking is often the slowest single step.",
    code: "// webpack.config.js -- practical speed wins\nmodule.exports = {\n  cache: { type: 'filesystem' },\n  module: {\n    rules: [\n      {\n        test: /\\.tsx?$/,\n        exclude: /node_modules/,\n        use: [\n          { loader: 'thread-loader', options: { workers: 4 } },\n          { loader: 'esbuild-loader', options: { target: 'es2020' } },\n        ],\n      },\n    ],\n  },\n};",
    interviewQuestion: "A team's Webpack build takes 8 minutes. Walk through how you'd profile it and what levers you'd pull to speed it up.",
  },
  {
    id: "buildtools-polyfilling-strategies",
    category: "buildtools",
    topic: "Compatibility",
    title: "What's the difference between polyfilling globally vs usage-based?",
    difficulty: "Tricky",
    summary:
      "Global polyfilling (importing core-js wholesale) bloats bundles; usage-based polyfilling only ships polyfills for features actually used, detected via static analysis.",
    explanation:
      "The naive approach — import 'core-js/stable' at the app entry — includes polyfills for every ES feature regardless of whether your code or target browsers need them, adding significant dead weight. Babel's preset-env with useBuiltIns: 'usage' instead statically scans your code for feature usage (e.g. Array.prototype.flat, Promise) and injects only the necessary core-js imports per file, cross-referenced against your Browserslist targets so browsers that already support a feature natively get no polyfill for it at all. A subtler pitfall: usage-based detection only sees your own source code, not your dependencies' polyfill needs, so a node_modules package using a newer feature without shipping its own polyfill can break on old browsers even though your app's polyfills look complete. Modern strategy increasingly favors differential serving (separate modern/legacy bundles via <script type='module'> vs nomodule) over blanket polyfilling, since most users' browsers need zero polyfills at all.",
    code: "// babel.config.js\nmodule.exports = {\n  presets: [\n    ['@babel/preset-env', {\n      useBuiltIns: 'usage',\n      corejs: { version: 3, proposals: true },\n      targets: '> 0.5%, not dead',\n    }],\n  ],\n};\n\n// Differential serving in HTML\n// <script type=\"module\" src=\"modern.js\"></script>\n// <script nomodule src=\"legacy.js\"></script>",
    interviewQuestion: "Your app uses useBuiltIns: 'usage' but still crashes on an old browser due to a missing polyfill — what's the likely gap?",
  },
  {
    id: "buildtools-browserslist-configuration",
    category: "buildtools",
    topic: "Compatibility",
    title: "How does Browserslist coordinate tooling across a project?",
    difficulty: "Intermediate",
    summary:
      "Browserslist is a shared config (query string or .browserslistrc) that Babel, Autoprefixer, and other tools read to decide what compatibility work to do.",
    explanation:
      "Rather than configuring target browsers separately in Babel, PostCSS, and ESLint, Browserslist provides one shared source of truth — a query like '> 0.5%, last 2 versions, not dead' — that all Browserslist-aware tools query via the caniuse-lite database to determine actual browser support percentages. This ensures Autoprefixer adds vendor prefixes for exactly the same browser set that preset-env transpiles/polyfills for, avoiding mismatches where CSS is prefixed for browsers JS doesn't actually support (or vice versa). Browserslist supports separate queries per environment (e.g. a stricter 'production' query and a looser 'development' query targeting only the latest Chrome for faster local builds). The underlying caniuse-lite data can go stale, so running npx browserslist@latest --update-db periodically keeps support percentages accurate.",
    code: "// package.json\n{\n  \"browserslist\": {\n    \"production\": [\">0.5%\", \"not dead\", \"not op_mini all\"],\n    \"development\": [\"last 1 chrome version\", \"last 1 firefox version\"]\n  }\n}\n\n// Check what browsers a query resolves to:\n// npx browserslist \">0.5%, not dead\"",
    interviewQuestion: "Why would you centralize browser targets in a Browserslist config instead of setting them separately in Babel and PostCSS?",
  },
];
