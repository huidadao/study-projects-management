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

### Tech Stack (Backend)
- **D-01:** FastAPI — Web framework
- **D-02:** SQLite — Database
- **D-03:** SQLModel — ORM with BaseModel inheritance
- **D-04:** asyncio — Async support
- **D-05:** APIRoute — Async route handlers
- **D-06:** CORS — Cross-origin resource sharing
- **D-07:** Pydantic — Data validation (BaseModel)
- **D-08:** Middleware — Request/Response logging, Error handling

### Tech Stack (Frontend)
- **D-09:** React — UI framework
- **D-10:** Vite — Build tool
- **D-11:** TypeScript — Type safety
- **D-12:** Axios — HTTP client
- **D-13:** Zod — Validation schema
- **D-14:** Zustand — State management
- **D-15:** React Context — Local state

### Repository Pattern (Backend)
- **D-16:** SQLModel BaseModel inheritance for all models
- **D-17:** Separate repositories — VideoRepository, CategoryRepository
- Repository inherits from base repository class

### MVP Scope
- **D-18:** Minimum viable product for Phase 1:
  - Backend: FastAPI server running with basic CRUD
  - Frontend: Basic UI skeleton connecting to API

### Project Structure
- **D-19:** /backend - FastAPI project
  - main.py (app entry)
  - models/ (SQLModel models)
  - repositories/ (data access)
  - routers/ (API routes)
  - schemas/ (Pydantic schemas)
  - middleware/ (CORS, logging, error)
- **D-20:** /frontend - React project
  - src/components/
  - src/hooks/
  - src/store/ (Zustand)
  - src/api/ (Axios)
  - src/context/

### Database Schema
- **D-21:** Simple schema:
  - videos: id, url, title, channel, duration, thumbnail, watched, created
  - categories: id, name, type (major/minor)
  - video_categories (junction table)
- **D-22:** SQLite database in /backend/data/

### API Endpoints (MVP)
- **D-23:** Videos: GET /videos, POST /videos, PUT /videos/{id}, DELETE /videos/{id}
- **D-24:** Categories: GET /categories, POST /categories, PUT /categories/{id}, DELETE /categories/{id}

### the agent's Discretion
- Exact file structure within /backend/
- Exact file structure within /frontend/
- API endpoint naming conventions
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