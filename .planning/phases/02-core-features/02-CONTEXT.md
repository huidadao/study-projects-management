# Phase 2: Core Features - Context

**Gathered:** 2026-04-10
**Status:** Ready for planning

<domain>
## Phase Boundary

Full video management, categories, timestamp notes, search, and dashboard UI:
- User can view all saved videos in dashboard
- User can add video by pasting YouTube URL
- User can create, edit, delete categories and assign to videos
- User can add timestamped notes to videos
- User can search videos by title, channel, notes
- Dashboard displays videos with status and categories

</domain>

<decisions>
## Implementation Decisions

### Dashboard Layout
- **D-01:** Grid layout — Videos displayed in a grid of video thumbnails

### Video Card Info
- **D-02:** Full info — Each card shows thumbnail, title, channel, duration, status badge, and category badges

### Timestamp Notes UI
- **D-03:** Modal — Notes accessed via modal that opens with full notes list and add form

### Search UX
- **D-04:** Global bar — Search bar at top of dashboard, filters results in place

### Category Filtering
- **D-05:** Sidebar — Checkbox list in sidebar filters dashboard results

### External Player Handling
- **D-06:** YouTube link opens in new tab with timestamp parameter for notes

### the agent's Discretion
- Exact grid columns (responsive breakpoints)
- Modal styling and animations
- Search debounce timing
- Sidebar toggle behavior (always visible vs collapsible)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Prior Phase
- `.planning/phases/01-foundation/01-CONTEXT.md` — Phase 1 decisions and patterns

### Architecture
- `.planning/research/ARCHITECTURE.md` — Layer architecture patterns
- `.planning/research/STACK.md` — Technology recommendations

</canonical_refs>

  שמה
## Existing Code Insights

### Reusable Assets
- `frontend/src/store/useVideoStore.ts` — Zustand store for videos and categories (to extend)
- `frontend/src/api/client.ts` — Axios client (to extend for search/notes)
- `backend/routers/videos.py` — Video API endpoints
- `backend/routers/categories.py` — Category API endpoints

### Established Patterns
- Zustand store pattern for state management
- Axios client with interceptors for API calls
- SQLModel repositories in backend
- Component structure in src/ directory

### Integration Points
- Dashboard will connect to /videos and /categories endpoints
- Search connects to backend search endpoints (to be created)
- Notes connect to backend notes endpoints (to be created)

</code_context>

<specifics>
## Specific Ideas

- User wants full information on video cards including category badges
- Modal for timestamp notes with add form and list view
- Sidebar checkbox filtering for categories

</specifics>

<deferred>
## Deferred Ideas

- PWA support — future phase
- Channel sync — v2 feature
- Export functionality — v2 feature

</deferred>

---

*Phase: 02-core-features*
*Context gathered: 2026-04-10*
