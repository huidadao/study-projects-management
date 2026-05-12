# Phase 2: Backend API - Context

**Gathered:** 2026-04-12
**Status:** Ready for planning

<domain>
## Phase Boundary

Implement Category and Video CRUD endpoints with proper validation and error handling.

</domain>

<decisions>
## Implementation Decisions

### API Structure
- **D-01:** Flat route structure with APIRouter:
  - `/categories` — Category endpoints
  - `/videos` — Video endpoints
  - `/dashboard` — Dashboard aggregated data
- **D-02:** RESTful patterns: GET (list/get), POST (create), PUT (update), DELETE (remove)
- **D-03:** Use SQLModel relationships for parent-child category hierarchy

### Data Models
- Category: id, name, parent_id (nullable FK)
- Video: id, title, url, category_id (FK), watched (boolean)

### Validation
- Category names: unique within parent scope
- Video URLs: valid YouTube URL format
- Parent category required for child creation

### Error Handling
- 404 for not found
- 400 for validation errors
- 409 for conflict (duplicate name)

### the agent's Discretion
- Exact endpoint response formats (standard FastAPI patterns)
- Database cascade behavior (SQLModel default)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project
- `.planning/PROJECT.md` — Project vision and core value
- `.planning/REQUIREMENTS.md` — v1 requirements (CAT-01 to CAT-06, VID-01 to VID-05)
- `.planning/ROADMAP.md` — Phase 2 requirements
- `.planning/phases/01-project-setup/01-CONTEXT.md` — Previous decisions

### Design
- `PAGE-DESIGN.md` — Airtable-inspired design system (for frontend later)

</canonical_refs>

#code_context
## Existing Code Insights

### Reusable Assets
- backend/database.py — SQLModel session setup
- backend/models.py — Base class defined

### Established Patterns
- FastAPI app in backend/main.py
- CORS configured for localhost:5173

### Integration Points
- API routes attach to app in backend/main.py
- Database operations via Session from database.py

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

*Phase: 02-backend-api*
*Context gathered: 2026-04-12*