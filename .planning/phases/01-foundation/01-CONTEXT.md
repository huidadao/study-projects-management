# Phase 1: Foundation - Context

**Gathered:** 2026-04-10
**Status:** Ready for planning

<domain>
## Phase Boundary

Project scaffolding with:
- Backend: FastAPI (Python) + SQLite in /backend
- Frontend: React + Vite + TypeScript in /frontend
- Repository layer in backend
- Basic UI skeleton

This phase establishes the foundation for all subsequent phases — both projects setup, database, and API patterns.

</domain>

<decisions>
## Implementation Decisions

### Tech Stack
- **D-01:** FastAPI (Python) backend with SQLite — API layer
- **D-02:** React 19 + Vite + TypeScript frontend — User requested separation
- **D-03:** Tailwind CSS for frontend styling
- **D-04:** SQLAlchemy for backend ORM
- **D-05:** Pydantic for backend validation

### Repository Pattern (Backend)
- **D-06:** Separate repositories for each entity — VideoRepository, CategoryRepository
- SQLAlchemy models with repository pattern

### Project Structure
- **D-07:** /backend - FastAPI project with repository layer
- **D-08:** /frontend - React project with components

### Database Schema
- **D-09:** Simple schema:
  - videos: id, url, title, channel, duration, thumbnail, watched, created
  - categories: id, name, type (major/minor)
  - video_categories (junction table)
- **D-10:** SQLite database in /backend/data/

### the agent's Discretion
- Exact file structure within /backend/
- Exact file structure within /frontend/
- API endpoint conventions
- Component naming patterns

</decisions>

<specifics>
## Specific Ideas

User requested separate backend (FastAPI) and frontend (React) directories.

</specifics>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Stack
- `.planning/research/STACK.md` — Technology recommendations

### Architecture
- `.planning/research/ARCHITECTURE.md` — Layer architecture patterns

</canonical_refs>

  שמה
## Existing Code Insights

### Reusable Assets
- None yet — greenfield project

### Established Patterns
- None — Phase 1 establishes patterns

### Integration Points
- Frontend calls backend API endpoints
- SQLite via backend API

</code_context>

<deferred>
## Deferred Ideas

- PWA support — future phase
- Channel sync — v2 feature
- Export functionality — v2 feature

</deferred>

---

*Phase: 01-foundation*
*Context gathered: 2026-04-10*