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
- Prefer local storage (SQLite) for privacy/simplicity
- Need both web and mobile access

## Constraints

- **Storage**: SQLite database (local)
- **Platform**: Web app + mobile-friendly (responsive/PWA)
- **Data Source**: Manual URL entry + YouTube channel sync

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| SQLite for local storage | Simple, no server needed, good for single user | — Pending |
| Web + mobile responsive | Cover both use cases with single codebase | — Pending |
| Custom categories (not YouTube tags) | More flexible for personal organization | — Pending |
| React 19 + Vite + TypeScript | User preference for stack during discuss-phase | — Pending |
| Tailwind CSS + Zod + Axios | User preference during discuss-phase | — Pending |

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