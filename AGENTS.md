<!-- GSD:project-start source:PROJECT.md -->
## Project

**YouTube Video Study Manager**

A web + mobile application for tracking YouTube videos and managing study schedules based on video viewing. Users can organize videos by custom categories (major/minor), add timestamp notes at specific points, schedule watch times, and track progress. Data stored locally in SQLite.

**Core Value:** Users can systematically organize their YouTube learning resources, track what they've watched, and schedule study sessions around video content.

### Constraints

- **Storage**: SQLite database (local)
- **Platform**: Web app + mobile-friendly (responsive/PWA)
- **Data Source**: Manual URL entry + YouTube channel sync
<!-- GSD:project-end -->

<!-- GSD:stack-start source:research/STACK.md -->
## Technology Stack

## Recommended Stack
### Core Technologies
| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| Vue.js | 3.6.x | UI Framework | Single-file components (template + script + style + config in one file) match the mental model for data-driven CRUD apps. Learning curve is gentler than React — faster onboarding for solo/small teams. Vue's reactivity system handles video lists and schedule state without Redux/MobX. Bundle size (~33KB vs ~48KB runtime) matters for mobile web users on slower connections. |
| Vite | 6.x | Build Tool | Standard for modern Vue projects. Instant dev server, optimized production builds with esbuild. Replaces webpack/create-react-app legacy patterns. Simpler config and faster builds. |
| TypeScript | 5.x | Type Safety | Catches type errors at compile time, not runtime. Critical for data models (Video, Category, Timestamp) where runtime bugs cost debugging time. Optional but recommended for maintainability. |
| sql.js | 1.11.x | SQLite-in-Browser | Most mature solution for running SQLite in browser. Compiles SQLite C code to WebAssembly (~1.5MB download, acceptable for web app). Full SQL support (JOINs, aggregates, triggers, transactions) — critical for video categorization queries across multiple tables. Actively maintained (13.5k+ GitHub stars). |
| idb | 8.x | IndexedDB Wrapper | Provides Promise-based API over IndexedDB. Cleaner than raw IndexedDB event-based API. Used for sql.js persistence — serialize database to IndexedDB on every write, load on startup. Simple migration support. |
### Supporting Libraries
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @vueuse/core | 12.x | Vue Composables | useStorage (auto-persist reactive state to localStorage), useDebounceFn (search input throttling), useAsyncState (async data loading). Accelerates common patterns without custom implementation. |
| date-fns | 4.x | Date Formatting | Parse/format study schedule timestamps. Tree-shakeable — import only functions used (format, parse, addMinutes). Lighter than Moment.js (deprecated). |
| lucide-vue-next | 0.468.x | Icons | Clean, consistent SVG icon set. Tree-shakeable (import only icons used). Replaces legacy icon libraries (Font Awesome, etc.). |
### Development Tools
| Tool | Purpose | Notes |
|------|---------|-------|
| Vite | Development server + production build. Configure via vite.config.ts. |
| ESLint + Prettier | Code linting and formatting. Use with eslint-plugin-vue for Vue-specific rules. |
| Vitest | Unit testing. Vitest + Vue Test Utils for component testing. |
| Vue DevTools | Browser extension for Vue component inspection and state debugging. |
## Installation
# Core
# Supporting
# Dev dependencies
## Alternatives Considered
| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| Vue.js 3 | React 19 | React if hiring is frequent or if team has existing React experience. Larger ecosystem (React Router, Radix UI, React Hook Form) but more complex (hooks, context, effects). React Native option if mobile app becomes native later. |
| sql.js | wa-sqlite | Use wa-sqlite if targeting only Chrome 111+ / Edge 111+ and willing to configure COOP/COEP headers on static hosting. OPFS persistence is faster but requires headers that Cloudflare Pages / Netlify don't support easily. |
| sql.js | SQLite Wasm + OPFS | Same as wa-sqlite. Official SQLite Wasm has file system transparency but requires specific headers. Stick with sql.js + IndexedDB for broad compatibility. |
| SQLite | IndexedDB direct | Use raw IndexedDB only if dataset is small (< 1000 records) and queries are simple (no JOINs). This app needs categorized videos with many-to-many relationships — SQL required. |
| Vite | Webpack | Webpack is legacy. Vite is now standard — faster builds, simpler config, better CSS/JSON handling. |
| date-fns | Day.js | Day.js is smaller but Moment.js is deprecated and Day.js API is Moment-like (mutable dates). date-fns uses functional style (immutable, tree-shakeable). Both work. |
## What NOT to Use
| Avoid | Why | Use Instead |
|-------|-----|-------------|
| LocalStorage | Hard 5MB limit, strings only, no queries. Exceeding throws QuotaExceededError. Cannot handle SQLite export (Uint8Array requires encoding). | IndexedDB via idb for persistence layer |
| Moment.js | Deprecated (no active development). Large bundle (~300KB). | date-fns (tree-shakeable, ~70KB) |
| Webpack | Legacy. Slower builds, complex config, larger bundle output. | Vite (built-in, faster) |
| jQuery | Unnecessary for Vue/React apps. Legacy from 2006. | Vue.js (modern reactivity) |
| Redux / MobX | Overkill for single-user local app. Vue's built-in reactivity handles state. | Vue's reactive() + composables |
| Cloud Firestore / DynamoDB | Backend databases. This project requires local-only SQLite. | sql.js in browser |
## Stack Patterns by Variant
- Use Vue 3 + @vueuse/core for useBreakpoints() / useWindowSize()
- Use PWA plugin (vite-plugin-pwa) for offline capability
- Because: Mobile users need lightweight bundles and offline resilience
- Use Electron (via Tauri or electron-builder) to wrap SQLite
- Because: Native file system access is simpler, no browser sandbox limits
- Note: This project is web-first per PROJECT.md constraints
- Use React 19 instead of Vue
- Use @tanstack/react-query instead of VueUse for data fetching
- Because: Familiarity reduces bugs more than framework choice causes them
## Version Compatibility
| Package A | Compatible With | Notes |
|-----------|-----------------|-------|
| vue@^3.6.0 | vite@^6.0.0 | Use @vitejs/plugin-vue for Vue SFC support |
| sql.js@^1.11.0 | vite@^6.0.0 | Copy sql-wasm.wasm to public/wasm/ directory |
| idb@^8.0.0 | sql.js@^1.11.0 | idb wraps IndexedDB for sql.js persistence |
| @vueuse/core@^12.0.0 | vue@^3.6.0 | VueUse requires Vue 3.2+ reactive system |
| typescript@^5.0.0 | vue-tsc@latest | Ensure vue-tsc matches TypeScript major version |
## Source References
- sql.js GitHub: https://github.com/sql-js/sql.js — [HIGH confidence]
- Browser Storage Comparison (2026): https://recca0120.github.io/en/2026/03/06/browser-storage-comparison/ — [HIGH confidence]
- Vue 3 Official Docs: https://vuejs.org/ — [HIGH confidence]
- Vite Official Docs: https://vitejs.dev/ — [HIGH confidence]
- idb Library (Jake Archibald): https://github.com/jakearchibald/idb — [HIGH confidence]
- Frontend Framework Comparison 2026: https://toolboxhubs.com/en/blog/react-vs-vue-vs-svelte-2026 — [MEDIUM confidence]
- Stack Overflow Survey 2025: https://survey.stackoverflow.co/ — [MEDIUM confidence]
<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->
## Conventions

Conventions not yet established. Will populate as patterns emerge during development.
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->
## Architecture

Architecture not yet mapped. Follow existing patterns found in the codebase.
<!-- GSD:architecture-end -->

<!-- GSD:skills-start source:skills/ -->
## Project Skills

No project skills found. Add skills to any of: `.claude/skills/`, `.agents/skills/`, `.cursor/skills/`, or `.github/skills/` with a `SKILL.md` index file.
<!-- GSD:skills-end -->

<!-- GSD:workflow-start source:GSD defaults -->
## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:
- `/gsd-quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd-debug` for investigation and bug fixing
- `/gsd-execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->



<!-- GSD:profile-start -->
## Developer Profile

> Profile not yet configured. Run `/gsd-profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->
