# Phase 3: Frontend Core - Context

**Gathered:** 2026-04-12
**Status:** Ready for planning

<domain>
## Phase Boundary

Build category tree UI and video management interface with sidebar navigation and modal forms.

</domain>

<decisions>
## Implementation Decisions

### Layout Structure
- **D-01:** Sidebar layout — Categories in left sidebar (width: ~250px), content area on right
- **D-02:** Fixed sidebar with scrollable category tree
- **D-03:** Main content area shows video grid or dashboard

### Tree Behavior
- **D-04:** Click parent category to expand/collapse children
- **D-05:** Chevron icon (▶/▼) indicates expand state
- **D-06:** Smooth expand/collapse animation (150ms)
- **D-07:** Indent children by ~20px per level

### Form Handling
- **D-08:** Modal forms for create/edit operations
- **D-09:** Centered modal with backdrop overlay
- **D-10:** Form validation with inline error messages
- **D-11:** Confirm dialog for delete operations

### UI Components
- CategorySidebar — left sidebar with tree
- VideoGrid — card grid display
- CategoryModal — create/edit form modal
- VideoModal — video form modal
- ConfirmDialog — delete confirmation

### the_agent's_Discretion
- Exact color scheme (use PAGE-DESIGN.md Airtable system)
- Icon set (Lucide React)
- Animation details

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project
- `.planning/PROJECT.md` — Project vision
- `.planning/REQUIREMENTS.md` — v1 requirements
- `.planning/ROADMAP.md` — Phase 3 requirements

### Backend
- `.planning/phases/02-backend-api/02-CONTEXT.md` — API endpoints
- `backend/main.py` — API route handlers

### Design
- `PAGE-DESIGN.md` — Airtable-inspired design system

### Frontend
- `frontend/src/App.tsx` — React root
- `frontend/src/store/index.ts` — Zustand store
- `frontend/tailwind.config.js` — Tailwind config

</canonical_refs>

#code_context
## Existing Code Insights

### Reusable Assets
- frontend/src/store/index.ts — Zustand store with categories/videos
- frontend/tailwind.config.js — Tailwind with Airtable colors
- frontend/src/App.tsx — Main app component

### Established Patterns
- Tailwind CSS for styling
- Zustand for state
- fetch() for API calls

### Integration Points
- API: http://localhost:8000
- Frontend state syncs with backend via REST API

</code_context>

<specifics>
## Specific Ideas

Based on PAGE-DESIGN.md:
- Deep Navy (#181d26) for primary text
- Airtable Blue (#1b61c9) for CTA
- 12px radius for buttons, 16-24px for cards

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 03-frontend-core*
*Context gathered: 2026-04-12*