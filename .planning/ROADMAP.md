# Roadmap: YouTube Video Study Manager

## Overview

A web application for organizing YouTube learning videos with custom categories, timestamped notes, and study scheduling.

- **Backend**: FastAPI (Python) + SQLite in /backend
- **Frontend**: React + Vite + TypeScript in /frontend

**Phases:** 3 | **Granularity:** Coarse | **Coverage:** 33/33 requirements

## Phases

- [ ] **Phase 1: Foundation** - Project setup, SQLite database, and repository layer
- [ ] **Phase 2: Core Features** - Video CRUD, categories, dashboard, search, timestamp notes
- [ ] **Phase 3: Study Schedule** - Watch scheduling and progress tracking

## Phase Details

### Phase 1: Foundation
**Goal**: Project scaffolding — FastAPI backend + React frontend setup
**Depends on**: Nothing (first phase)
**Requirements**: VID-01, VID-02, CAT-01, CAT-02, CAT-03
**Success Criteria** (what must be TRUE):
  1. Backend runs (`uvicorn` in /backend)
  2. Frontend runs (`npm run dev` in /frontend)
  3. SQLite database initializes with tables
  4. Video API endpoints respond
  5. Category API endpoints respond
  6. Frontend connects to backend API
**Plans**: 2 plans

**Plan list:**
- [x] 01-01-PLAN.md — Backend setup (FastAPI + SQLite + models + repositories)
- [x] 01-02-PLAN.md — Frontend setup (React + Vite + TypeScript + Axios + Zustand)

### Phase 2: Core Features
**Goal**: Full video management, categories, timestamp notes, search, and dashboard UI
**Depends on**: Phase 1
**Requirements**: VID-03, VID-04, VID-05, VID-06, VID-07, CAT-04, CAT-05, CAT-06, NOTE-01, NOTE-02, NOTE-03, NOTE-04, NOTE-05, SCH-01, SCH-02, SCH-03, SCH-04, DASH-01, DASH-02, DASH-03, DASH-05
**Success Criteria** (what must be TRUE):
  1. User can view all saved videos in dashboard (via backend API)
  2. User can add video by pasting YouTube URL
  3. User can create, edit, delete categories and assign to videos
  4. User can add timestamped notes to videos
  5. User can search videos by title, channel, notes
  6. Dashboard displays videos with status and categories
**Plans**: 3 plans

**Plan list:**
- [x] 02-01-PLAN.md — Backend API extensions (Notes, Search, Watched Toggle)
- [x] 02-02-PLAN.md — Dashboard UI (Video Grid, SearchBar, CategorySidebar, QuickAdd)
- [ ] 02-03-PLAN.md — Notes Modal with YouTube timestamp integration

### Phase 3: Study Schedule
**Goal**: Watch scheduling, progress tracking, and schedule-aware dashboard
**Depends on**: Phase 2
**Requirements**: SCH-05, SCH-06, SCH-07, SCH-08, SCH-09, DASH-04
**Success Criteria** (what must be TRUE):
  1. User can schedule a video to watch on a specific date/time
  2. User can view list of scheduled videos
  3. User can mark scheduled video as completed
  4. Dashboard shows upcoming scheduled videos
**Plans**: TBD

## Progress

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation | 2/2 | Ready to execute | - |
| 2. Core Features | 0/3 | Ready to execute | - |
| 3. Study Schedule | 0/2 | Not started | - |

---

*Roadmap created: 2026-04-10*
*Granularity: Coarse (3 phases)*