# Roadmap: YouTube Video Study Manager

## Overview

A local-first web application for organizing YouTube learning videos with custom categories, timestamped notes, and study scheduling. Built with Vue.js + TypeScript + SQLite (sql.js).

**Phases:** 3 | **Granularity:** Coarse | **Coverage:** 33/33 requirements

## Phases

- [ ] **Phase 1: Foundation** - Project setup, SQLite database, and repository layer
- [ ] **Phase 2: Core Features** - Video CRUD, categories, dashboard, search, timestamp notes
- [ ] **Phase 3: Study Schedule** - Watch scheduling and progress tracking

## Phase Details

### Phase 1: Foundation
**Goal**: Project scaffolding with SQLite database, repository layer, and basic UI skeleton
**Depends on**: Nothing (first phase)
**Requirements**: VID-01, VID-02, CAT-01, CAT-02, CAT-03
**Success Criteria** (what must be TRUE):
  1. User can run `npm run dev` and see the app load in browser
  2. SQLite database initializes and persists data across sessions
  3. Video repository can create, read, update, delete videos
  4. Category repository can create and list categories
**Plans**: TBD

### Phase 2: Core Features
**Goal**: Full video management, categories, timestamp notes, search, and dashboard UI
**Depends on**: Phase 1
**Requirements**: VID-03, VID-04, VID-05, VID-06, VID-07, CAT-04, CAT-05, CAT-06, NOTE-01, NOTE-02, NOTE-03, NOTE-04, NOTE-05, SCH-01, SCH-02, SCH-03, SCH-04, DASH-01, DASH-02, DASH-03, DASH-05
**Success Criteria** (what must be TRUE):
  1. User can view all saved videos in dashboard with thumbnails and metadata
  2. User can add video by pasting YouTube URL and see metadata auto-populated
  3. User can create, edit, delete categories and assign to videos
  4. User can filter video list by category
  5. User can add timestamped notes to videos and click to open at that time
  6. User can search videos by title, channel, and note content
**Plans**: TBD

### Phase 3: Study Schedule
**Goal**: Watch scheduling, progress tracking, and schedule-aware dashboard
**Depends on**: Phase 2
**Requirements**: SCH-05, SCH-06, SCH-07, SCH-08, SCH-09, DASH-04
**Success Criteria** (what must be TRUE):
  1. User can schedule a video to watch on a specific date/time
  2. User can view list of scheduled videos
  3. User can mark scheduled video as completed or reschedule
  4. Dashboard shows upcoming scheduled videos
**Plans**: TBD

## Progress

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation | 0/2 | Not started | - |
| 2. Core Features | 0/3 | Not started | - |
| 3. Study Schedule | 0/2 | Not started | - |

---

*Roadmap created: 2026-04-10*
*Granularity: Coarse (3 phases)*