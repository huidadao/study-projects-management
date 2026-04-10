# Phase 1: Foundation - Context

**Gathered:** 2026-04-10
**Status:** Ready for planning

<domain>
## Phase Boundary

Project scaffolding with React + TypeScript + SQLite database, repository layer, and basic UI skeleton. This phase establishes the foundation for all subsequent phases — project setup, database initialization, and data access patterns.

</domain>

<decisions>
## Implementation Decisions

### Tech Stack
- **D-01:** React 19 + Vite + TypeScript — User chose React over Vue (based on their preference)
- **D-02:** Tailwind CSS for styling
- **D-03:** Zod for validation
- **D-04:** Axios for HTTP requests
- **D-05:** sql.js (SQLite in browser) + idb (IndexedDB wrapper) for persistence
- **D-06:** React Router for navigation

### Repository Pattern
- **D-07:** Separate repositories for each entity — VideoRepository, CategoryRepository
- Better organization as app grows, though more code upfront

### Project Structure
- **D-08:** Feature-grouped structure: src/ui, src/data, src/core, src/lib

### Database Schema
- **D-09:** Simple schema:
  - videos: id, url, title, channel, duration, thumbnail, watched, created
  - categories: id, name, type (major/minor)
  - video_categories (junction table)

### SQLite Persistence
- **D-10:** Persist to IndexedDB on every write — ensures no data loss, simpler logic

### the agent's Discretion
- Exact component structure within src/ui/
- File naming conventions
- Error boundary handling approach

</decisions>

<specifics>
## Specific Ideas

"No, keep it simple for Phase 1" — user emphasized minimal viable approach.

</specifics>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Stack Research
- `.planning/research/STACK.md` — Technology recommendations, version compatibility

### Architecture
- `.planning/research/ARCHITECTURE.md` — Layer architecture, repository pattern guidance

### Features
- `.planning/research/FEATURES.md` — Table stakes features for Phase 1

### Pitfalls
- `.planning/research/PITFALLS.md` — SQLite pitfalls to avoid

</canonical_refs>

  שמה
## Existing Code Insights

### Reusable Assets
- None yet — this is a greenfield project

### Established Patterns
- None — Phase 1 establishes initial patterns

### Integration Points
- Browser IndexedDB via idb for persistence
- SQL.js for database queries

</code_context>

<deferred>
## Deferred Ideas

- PWA support — future phase (Phase 5 per roadmap)
- Channel sync — v2 feature
- Export functionality — v2 feature

</deferred>

---

*Phase: 01-foundation*
*Context gathered: 2026-04-10*