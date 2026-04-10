# YouTube Video Study Manager

## What This Is

A web + mobile application for tracking YouTube videos and managing study schedules based on video viewing. Users can organize videos by custom categories (major/minor), add timestamp notes at specific points, schedule watch times, and track progress. Data stored locally in SQLite.

## Core Value

Users can systematically organize their YouTube learning resources, track what they've watched, and schedule study sessions around video content.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Track YouTube videos (manual entry + channel sync)
- [ ] Classify videos by custom major/minor categories
- [ ] Add timestamp notes ("mid-viewpoints")
- [ ] Search videos in collection
- [ ] Edit video metadata and notes history
- [ ] Dashboard with video list and collection management
- [ ] Study schedule: plan watch times + track progress

### Out of Scope

- [Real-time YouTube streaming/playback] — Opens external player
- [Social features] — Single user app
- [Cloud sync] — Local SQLite only
- [Offline video download] — Play from YouTube directly

## Context

- User wants to organize learning videos from YouTube
- Backend (FastAPI) + Frontend (React) architecture
- Need both web and mobile access

## Architecture

- **Backend**: FastAPI (Python) in /backend directory
- **Frontend**: React 19 + Vite + TypeScript in /frontend directory
- **Storage**: SQLite database (via backend API)

## Constraints

- **Platform**: Web app + mobile-friendly (responsive/PWA)
- **Data Source**: Manual URL entry + YouTube channel sync

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| FastAPI backend | Python web API with SQLite | — Pending |
| React frontend | User preference | — Pending |
| Separate /backend and /frontend | Clear separation of concerns | — Pending |
| Custom categories | User-defined major/minor | — Pending |

---
*Last updated: 2026-04-10 after initialization*

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state