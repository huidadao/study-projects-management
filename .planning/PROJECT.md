# Project: YouTube Learning Tracker

## Core Value

Track YouTube video learning progress with hierarchical category management and visual dashboard.

## Context

- **Purpose**: Track YouTube learning videos by category tree structure
- **Users**: Individual learner tracking self-study from YouTube
- **Current State**: Greenfield — no existing codebase

## Features

### Required Capabilities

1. **Category Tree Management**
   - Parent categories (unique names)
   - Child categories (unique within parent)
   - Tree UI: expand/collapse child categories on click
   - Full CRUD for categories

2. **Video Tracking**
   - Store YouTube video metadata (title, URL, watched status)
   - Associate videos with categories
   - Display videos in card grid format

3. **Dashboard**
   - Category-wise learning progress chart
   - Video cards in grid layout
   - Overall progress visualization

### Technical Stack

- **Backend**: FastAPI + SQLite + SQLModel
- **Frontend**: React + Vite + TypeScript + Tailwind CSS + Zustand
- **Icons**: Lucide React

---

## Requirements

### Active

- [ ] Category tree with parent/child structure
- [ ] Expandable/collapsible tree UI
- [ ] Category CRUD
- [ ] Video CRUD with category association
- [ ] Dashboard with progress chart
- [ ] Video card grid display

### Out of Scope

- [ ] User authentication
- [ ] Video playback (embedded)
- [ ] Search/filter functionality
- [ ] Data export

---

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| SQLite | Single user, local-first | Pending |
| Zustand | Lightweight state | Pending |
| Tree UI | Natural category hierarchy | Pending |

---

*Last updated: 2026-04-12 after initialization*