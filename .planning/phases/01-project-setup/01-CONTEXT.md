# Phase 1: Project Setup - Context

**Gathered:** 2026-04-12
**Status:** Ready for planning

<domain>
## Phase Boundary

Initialize FastAPI backend and React frontend with proper scaffolding — both projects run and can communicate.

</domain>

<decisions>
## Implementation Decisions

### Project Structure
- **D-01:** Monorepo structure — `backend/` and `frontend/` directories in root
- **D-02:** Backend runs on port 8000 (FastAPI default)
- **D-03:** Frontend runs on port 5173 (Vite default)

### Backend Stack
- FastAPI with SQLModel + Pydantic v2
- SQLite database (`data.db` in backend/)
- CORS enabled for frontend origin

### Frontend Stack
- React + Vite + TypeScript
- Tailwind CSS for styling
- Zustand for state management
- Lucide React for icons

### the agent's Discretion
- Database file location (default: backend/data.db)
- Tailwind config (default: standard setup)
- Component structure (standard React patterns)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project
- `.planning/PROJECT.md` — Project vision and core value
- `.planning/REQUIREMENTS.md` — v1 requirements and traceability
- `.planning/ROADMAP.md` — Phase overview and success criteria

### Frontend Design
- `PAGE-DESIGN.md` — Airtable-inspired design system

[If no external specs: "No external specs — requirements fully captured in decisions above"]

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- None yet — greenfield project

### Established Patterns
- None yet — project being scaffolded

### Integration Points
- Backend API on port 8000
- Frontend on port 5173
- CORS for cross-origin communication

</code_context>

<specifics>
## Specific Ideas

No specific requirements — open to standard approaches.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 01-project-setup*
*Context gathered: 2026-04-12*