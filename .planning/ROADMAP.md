# Roadmap: YouTube Learning Tracker

**Defined:** 2026-04-12
**Granularity:** standard

## Phase Overview

| # | Phase | Goal | Requirements |
|---|-------|------|--------------|
| 1 | Project Setup | Initialize FastAPI + React project with scaffolding | SETUP-01, SETUP-02, SETUP-03 |
| 2 | Backend API | Category & Video CRUD endpoints | CAT-01 through CAT-06, VID-01 through VID-05, API-01, API-02 |
| 3 | Frontend Core | Category tree & video management UI | UI-CAT-01 through UI-CAT-05, UI-VID-01 through UI-VID-04 |
| 4 | Dashboard | Progress visualization & dashboard view | DASH-01, DASH-02, API-03, UI-DASH-01, UI-DASH-02 |

---

## Phase 1: Project Setup

**Goal:** Initialize FastAPI backend and React frontend with proper scaffolding

**Requirements:**

- [ ] **SETUP-01**: Initialize FastAPI backend project with SQLModel, Pydantic v2
- [ ] **SETUP-02**: Initialize React + Vite frontend with TypeScript
- [ ] **SETUP-03**: Setup Tailwind CSS and Zustand

**Success Criteria:**

1. FastAPI backend runs locally on port 8000
2. React frontend builds and runs on port 5173
3. Backend and frontend can communicate via CORS

---

## Phase 2: Backend API

**Goal:** Implement Category and Video CRUD endpoints

**Requirements:**

- [ ] **CAT-01**: CRUD endpoints for parent categories (unique names)
- [ ] **CAT-02**: CRUD endpoints for child categories (unique within parent)
- [ ] **CAT-03**: GET all categories with tree structure
- [ ] **CAT-04**: GET category by ID with children
- [ ] **CAT-05**: PUT update category name
- [ ] **CAT-06**: DELETE category (cascade delete children and videos)
- [ ] **VID-01**: CRUD endpoints for videos with category association
- [ ] **VID-02**: GET videos by category
- [ ] **VID-03**: PUT update video watched status
- [ ] **VID-04**: PUT update video details
- [ ] **VID-05**: DELETE video

**Success Criteria:**

1. User can create, read, update, delete categories via API
2. User can create, read, update, delete videos via API
3. Videos can be associated with categories
4. Dashboard API returns aggregated progress data

**Plans:**

- [ ] 02-01-PLAN.md — Category & Video CRUD endpoints with SQLModel relationships

---

## Phase 3: Frontend Core

**Goal:** Category tree UI and video management interface

**Requirements:**

- [ ] **UI-CAT-01**: Display parent categories in sidebar
- [ ] **UI-CAT-02**: Expand/collapse child categories on click
- [ ] **UI-CAT-03**: Add new category form
- [ ] **UI-CAT-04**: Edit category modal
- [ ] **UI-CAT-05**: Delete category with confirmation
- [ ] **UI-VID-01**: Video card grid display
- [ ] **UI-VID-02**: Add video form with category selection
- [ ] **UI-VID-03**: Watched/unwatched toggle
- [ ] **UI-VID-04**: Edit/delete video actions

**Success Criteria:**

1. User can view categories in tree structure with expand/collapse
2. User can add, edit, delete categories via UI
3. User can view videos in card grid format
4. User can add, edit, delete videos with category selection

**Plans:**

- [ ] 03-01-PLAN.md — Category Sidebar with Tree UI and CRUD forms
- [ ] 03-02-PLAN.md — Video Card Grid and Video Management Forms

---

## Phase 4: Dashboard

**Goal:** Progress visualization and dashboard view

**Requirements:**

- [ ] **DASH-01**: Category progress chart (pie/bar chart)
- [ ] **DASH-02**: Video cards grid on dashboard
- [ ] **UI-DASH-01**: Dashboard page layout
- [ ] **UI-DASH-02**: Progress statistics display

**Success Criteria:**

1. User can view overall learning progress by category (chart)
2. User can view video cards on dashboard
3. Progress updates reflect in real-time

**Plans:**

- [ ] 04-01-PLAN.md — Dashboard with stats cards, pie chart, and video grid
- [ ] 04-02-PLAN.md — (spare slot)

---

*Roadmap defined: 2026-04-12*
*Last updated: 2026-04-12 after Phase 4 planning*