# Phase 1: Foundation - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-10
**Phase:** 01-foundation
**Areas discussed:** Repository pattern, Project structure, Database schema, SQLite persistence

---

## Repository Pattern

| Option | Description | Selected |
|--------|------------|----------|
| Single repository | Video and Category in one repository — simpler for Phase 1 | |
| Separate repos | Separate repositories for each entity — better as app grows, more code upfront | ✓ |
| You decide | Agent decides based on requirements | |

**User's choice:** Separate repos
**Notes:** User prefers separation for better organization as app grows

---

## Project Structure

| Option | Description | Selected |
|--------|------------|----------|
| Conventional Vue | src/components, src/composables, src/db, src/types — conventional Vue 3 structure | |
| Feature-grouped | src/ui, src/data, src/core, src/lib — feature-grouped but simpler | |
| You decide | Agent decides based on best practices | |

**User's choice:** react.js, vite, typescript, tailwind CSS, zod, apirouter, axios, context

**Notes:** User specified React stack. Changed from Vue.js (research recommendation) to React based on user preference.

---

## Stack Confirmation

| Option | Description | Selected |
|--------|------------|----------|
| Keep Vue.js | Vue 3 + Vite + TypeScript + sql.js + idb (from research) | |
| Use React | React 19 + Vite + TypeScript + Tailwind + Zod + Axios | ✓ |

**User's choice:** React (user's choice)
**Notes:** User explicitly chose React stack

---

## Database Schema

| Option | Description | Selected |
|--------|------------|----------|
| Simple schema | videos (id, url, title, channel, duration, thumbnail, watched, created), categories (id, name, type), video_categories | ✓ |
| Extended schema | Add additional fields for search, notes, schedule dates, extended metadata | |
| You decide | Agent decides based on requirements | |

**User's choice:** Simple schema
**Notes:** User wants minimal viable approach for Phase 1

---

## SQLite Persistence

| Option | Description | Selected |
|--------|------------|----------|
| On every write | Auto-save after every database write — ensures no data loss, simpler logic | ✓ |
| Periodic | Batch save periodically or on app close — less I/O, more complex | |
| You decide | Agent decides based on best practices | |

**User's choice:** On every write

---

## the agent's Discretion

- Exact component structure within src/ui/
- File naming conventions
- Error boundary handling approach

## Deferred Ideas

- PWA support — future phase (Phase 5 per roadmap)
- Channel sync — v2 feature
- Export functionality — v2 feature