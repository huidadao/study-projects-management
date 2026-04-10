# Phase 3: Study Schedule - Context

**Gathered:** 2026-04-10
**Status:** Ready for planning

<domain>
## Phase Boundary

Watch scheduling, progress tracking, and schedule-aware dashboard.

</domain>

<decisions>
## Implementation Decisions

### Scheduling Model — D-01
- Use same SQLite database (not separate table) — keeps operations simple
- Store schedule data in dedicated table within existing database

### Scheduling Type — D-02
- Supports one-time scheduling for single viewing
- Supports recurring schedules for repetitive study

### Recurring Patterns — D-03
- Daily recurring — repeats every day until marked complete
- Weekly recurring (future extension)
- Custom N-day intervals (future extension)

### Dashboard Integration — D-04
- Dedicated "Upcoming" section at top of dashboard
- Video cards displayed in a scheduled list below the main grid
- Sort by scheduled date ascending

### Progress Tracking — D-05
- Manual mark: User clicks "Mark Complete" button
- Completion history stored: timestamp of each completion
- When recurring completes: schedule next occurrence, log completion

### the agent's Discretion
- Frontend component structure: separate UpcomingSchedule component or integrate into Dashboard
- Specific date picker component: native HTML date input vs custom calendar
- Recurring pattern storage format in database

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Backend Patterns
- `backend/models/video.py` — existing Video model structure
- `backend/routers/videos.py` — video API patterns

### Frontend Patterns
- `frontend/src/components/Dashboard.tsx` — existing dashboard structure
- `frontend/src/store/useVideoStore.ts` — existing Zustand store

No external specs — requirements fully captured in decisions above.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- Video model in `backend/models/video.py` — extend with schedule fields
- Dashboard component in `frontend/src/components/Dashboard.tsx` — add upcoming section
- useVideoStore in `frontend/src/store/useVideoStore.ts` — add schedule actions

### Established Patterns
- SQLite + SQLModel for backend storage
- Zustand for frontend state management
- RESTful API with FastAPI routers

### Integration Points
- New `/api/schedules` endpoint or extend `/api/videos` with schedule query params
- Dashboard fetches scheduled videos on load

</code_context>

<specifics>
## Specific Ideas

No specific requirements — open to standard approaches.

</specifics>

<deferred>
## Deferred Ideas

### Future extensions (mentioned but not in scope)
- Weekly recurring pattern
- Custom N-day interval for recurring
- Auto-progress when watched toggle used

</deferred>

---

*Phase: 03-study-schedule*
*Context gathered: 2026-04-10*