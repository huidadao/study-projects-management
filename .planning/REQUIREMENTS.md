# Requirements: YouTube Learning Tracker

**Defined:** 2026-04-12
**Core Value:** Track YouTube video learning progress with hierarchical category management and visual dashboard

## v1 Requirements

### Category Management

- [ ] **CAT-01**: User can create parent category (unique name)
- [ ] **CAT-02**: User can create child category under parent (unique within parent)
- [ ] **CAT-03**: User can view all categories in tree structure
- [ ] **CAT-04**: User can expand/collapse child categories on click
- [ ] **CAT-05**: User can edit category name
- [ ] **CAT-06**: User can delete category (cascades to children/videos)

### Video Management

- [ ] **VID-01**: User can add YouTube video with title, URL, category association
- [ ] **VID-02**: User can view videos in card grid format
- [ ] **VID-03**: User can mark video as watched/unwatched
- [ ] **VID-04**: User can edit video details
- [ ] **VID-05**: User can delete video

### Dashboard

- [ ] **DASH-01**: User can view overall learning progress chart by category
- [ ] **DASH-02**: User can view video cards in grid layout on dashboard

### Backend API

- [ ] **API-01**: CRUD endpoints for categories
- [ ] **API-02**: CRUD endpoints for videos
- [ ] **API-03**: GET endpoint for dashboard data

## v2 Requirements

(No v2 requirements defined)

## Out of Scope

| Feature | Reason |
|---------|--------|
| User authentication | Single user, local-first |
| Video playback (embedded) | Use YouTube directly |
| Search/filter | Not in initial scope |
| Data export | Not in initial scope |
| Cloud sync | Local SQLite storage |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| CAT-01 | Phase 1 | Pending |
| CAT-02 | Phase 1 | Pending |
| CAT-03 | Phase 1 | Pending |
| CAT-04 | Phase 1 | Pending |
| CAT-05 | Phase 1 | Pending |
| CAT-06 | Phase 1 | Pending |
| VID-01 | Phase 2 | Pending |
| VID-02 | Phase 2 | Pending |
| VID-03 | Phase 2 | Pending |
| VID-04 | Phase 2 | Pending |
| VID-05 | Phase 2 | Pending |
| DASH-01 | Phase 3 | Pending |
| DASH-02 | Phase 3 | Pending |
| API-01 | Phase 1 | Pending |
| API-02 | Phase 2 | Pending |
| API-03 | Phase 3 | Pending |

**Coverage:**
- v1 requirements: 15 total
- Mapped to phases: 15
- Unmapped: 0 ✓

---
*Requirements defined: 2026-04-12*
*Last updated: 2026-04-12 after initial definition*