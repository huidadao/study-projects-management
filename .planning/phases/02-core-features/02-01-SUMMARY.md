---
phase: "02"
plan: "01"
subsystem: "backend"
tags:
  - "api"
  - "notes"
  - "search"
  - "watched"
  - "backend"
dependency_graph:
  requires:
    - "01-01"
    - "01-02"
  provides:
    - "notes-crud"
    - "video-search"
    - "watched-toggle"
  affects:
    - "backend/main.py"
    - "frontend"
tech_stack:
  added:
    - "Note SQLModel"
    - "NoteRepository"
    - "Notes API Router"
    - "Watched Toggle endpoint"
    - "Search endpoint"
  patterns:
    - "Repository pattern with BaseRepository"
    - "CRUD router pattern"
    - "Pydantic validation"
key_files:
  created:
    - "backend/models/note.py"
    - "backend/schemas/note.py"
    - "backend/repositories/note.py"
    - "backend/routers/notes.py"
  modified:
    - "backend/routers/videos.py"
    - "backend/main.py"
decisions:
  - "Reuse repository pattern for Notes"
  - "Search supports title, channel, and notes search types"
  - "Validate timestamp >= 0 and content length <= 1000 chars"
  - "Category filter placeholder for future join table"
metrics:
  duration: "N/A"
  completed: "2026-04-10"
---

# Phase 2 Plan 1: Backend API Extensions Summary

## Overview

**What was built:** Backend API extensions for Notes CRUD, Video Search, and Watched Toggle

**One-liner:** Notes API with timestamp notes for videos, video search endpoint, and watched status toggle

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Create Note model and schema | ac9bdfa | backend/models/note.py, backend/schemas/note.py |
| 2 | Create Notes API router | ac9bdfa | backend/routers/notes.py (new) |
| 3 | Add Search and Watched Toggle | ac9bdfa | backend/routers/videos.py |
| 4 | Category edit/delete | ( preexisting) | backend/routers/categories.py |

## API Endpoints Added

### Notes API (`/api/notes`)

| Method | Endpoint | Description |
|--------|----------|------------|
| GET | `/api/notes` | Get all notes or filter by `?video_id={id}` |
| GET | `/api/notes/{note_id}` | Get single note |
| POST | `/api/notes` | Create timestamp note |
| PUT | `/api/notes/{note_id}` | Update note |
| DELETE | `/api/notes/{note_id}` | Delete note |

### Videos API Extensions (`/api/videos`)

| Method | Endpoint | Description |
|--------|----------|------------|
| PATCH | `/api/videos/{id}/watched` | Toggle watched status (`{"watched": true\|false}`) |
| GET | `/api/videos/search` | Search videos (`?q={query}&type=title\|channel\|notes&limit=100`) |

### Verify Commands

```bash
# Notes API
curl http://localhost:8000/notes?video_id=1
curl -X POST http://localhost:8000/notes -H "Content-Type: application/json" \
  -d '{"video_id":1,"timestamp":120,"content":"test note"}'

# Search
curl "http://localhost:8000/api/videos/search?q=python&type=title"

# Watched toggle
curl -X PATCH http://localhost:8000/api/videos/1/watched \
  -H "Content-Type: application/json" -d '{"watched":true}'
```

## Deviations from Plan

### Auto-fixed Issues

None - plan executed exactly as written.

### Known Limitations

**1. [Placeholder] Category filtering not implemented**
- **Status:** Deferred to SCH-03 (video_categories join table)
- **Impact:** `GET /api/videos?category_id={id}` returns all videos
- **Files:** backend/routers/videos.py (line 22-34)

**2. [Out of Scope] Note cascade on video delete**
- **Status:** Not implemented (T-02-03)
- **Impact:** Orphaned notes if video deleted
- **Resolution:** Handled in future phase

## Threat Flags

| Flag | File | Description |
|------|------|-------------|
| none | - | No new security surface introduced |

## Known Stubs

None.

## Requirements Coverage

| Requirement | Status |
|--------------|--------|
| VID-03: Search videos | ✓ Complete |
| VID-04: Video watched status | ✓ Complete |
| VID-05: Add notes to videos | ✓ Complete |
| VID-06: Edit notes | ✓ Complete |
| VID-07: Delete notes | ✓ Complete |
| NOTE-01: Note model | ✓ Complete |
| NOTE-02: Note CRUD | ✓ Complete |
| NOTE-03: Note timestamps | ✓ Complete |
| NOTE-04: Note validation | ✓ Complete |
| NOTE-05: Note search | ✓ Complete |
| CAT-04: Edit category | ✓ Complete (pre-existing) |
| CAT-05: Delete category | ✓ Complete (pre-existing) |

## Self-Check

- [x] Files exist: backend/models/note.py
- [x] Files exist: backend/schemas/note.py
- [x] Files exist: backend/repositories/note.py
- [x] Files exist: backend/routers/notes.py
- [x] Files modified: backend/routers/videos.py
- [x] Commit exists: ac9bdfa

## Self-Check: PASSED