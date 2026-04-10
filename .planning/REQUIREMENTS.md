# Requirements: YouTube Video Study Manager

**Defined:** 2026-04-10
**Core Value:** Users can systematically organize their YouTube learning resources, track what they've watched, and schedule study sessions around video content.

## v1 Requirements

### Video Management

- [ ] **VID-01**: User can add a video by pasting YouTube URL
- [ ] **VID-02**: System fetches and stores video metadata (title, channel, duration, thumbnail URL, publish date)
- [ ] **VID-03**: User can view list of all saved videos in dashboard
- [ ] **VID-04**: User can edit video metadata (title, notes)
- [ ] **VID-05**: User can delete a video from the collection
- [ ] **VID-06**: User can mark video as watched/unwatched
- [ ] **VID-07**: User can open video in external YouTube player

### Category System

- [ ] **CAT-01**: User can create custom categories
- [ ] **CAT-02**: User can assign major category to a video
- [ ] **CAT-03**: User can assign minor category to a video
- [ ] **CAT-04**: User can edit category names
- [ ] **CAT-05**: User can delete categories
- [ ] **CAT-06**: User can filter video list by category

### Timestamp Notes (Mid-viewpoints)

- [ ] **NOTE-01**: User can add a note with timestamp to a video
- [ ] **NOTE-02**: User can view all notes for a video
- [ ] **NOTE-03**: User can edit note content and timestamp
- [ ] **NOTE-04**: User can delete a note
- [ ] **NOTE-05**: User can click note to open video at that timestamp (external player)

### Search

- [ ] **SCH-01**: User can search videos by title
- [ ] **SCH-02**: User can search videos by channel name
- [ ] **SCH-03**: User can search notes by content
- [ ] **SCH-04**: Search results display matching videos with context

### Study Schedule

- [ ] **SCH-05**: User can schedule a video to watch on a specific date/time
- [ ] **SCH-06**: User can view scheduled videos in a list
- [ ] **SCH-07**: User can mark scheduled video as completed
- [ ] **SCH-08**: User can reschedule a video
- [ ] **SCH-09**: User can remove a video from schedule

### Dashboard

- [ ] **DASH-01**: Dashboard displays all videos with thumbnail, title, channel
- [ ] **DASH-02**: Dashboard shows video watch status (watched/unwatched)
- [ ] **DASH-03**: Dashboard shows category badges for each video
- [ ] **DASH-04**: Dashboard shows upcoming scheduled videos
- [ ] **DASH-05**: Dashboard has quick-add form for new videos

## v2 Requirements

### Channel Sync

- **CHAN-01**: User can add YouTube channel by URL
- **CHAN-02**: System fetches all videos from channel
- **CHAN-03**: User can sync new videos from subscribed channels

### Export

- **EXPT-01**: User can export notes as Markdown
- **EXPT-02**: User can export video list to CSV

### Advanced Search

- **SRCH-05**: User can search by date range
- **SRCH-06**: User can filter by watch status

## Out of Scope

| Feature | Reason |
|---------|--------|
| Real-time video playback inside app | PROJECT.md specifies opening external player |
| Cloud sync / account requirement | Local SQLite storage only |
| Algorithmic recommendations | Users explicitly escape YouTube algorithm |
| Social features | Single user study tool |
| Offline video download | Storage costs, may violate YouTube ToS |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| VID-01: Add video by URL | Phase 1 | Pending |
| VID-02: Fetch metadata | Phase 1 | Pending |
| VID-03: View video list | Phase 2 | Pending |
| VID-04: Edit video metadata | Phase 2 | Pending |
| VID-05: Delete video | Phase 2 | Pending |
| VID-06: Mark watched/unwatched | Phase 2 | Pending |
| VID-07: Open in external player | Phase 2 | Pending |
| CAT-01: Create categories | Phase 1 | Pending |
| CAT-02: Assign major category | Phase 1 | Pending |
| CAT-03: Assign minor category | Phase 1 | Pending |
| CAT-04: Edit category | Phase 2 | Pending |
| CAT-05: Delete category | Phase 2 | Pending |
| CAT-06: Filter by category | Phase 2 | Pending |
| NOTE-01: Add timestamp note | Phase 2 | Pending |
| NOTE-02: View notes for video | Phase 2 | Pending |
| NOTE-03: Edit note | Phase 2 | Pending |
| NOTE-04: Delete note | Phase 2 | Pending |
| NOTE-05: Click note to open video | Phase 2 | Pending |
| SCH-01: Search by title | Phase 2 | Pending |
| SCH-02: Search by channel | Phase 2 | Pending |
| SCH-03: Search notes | Phase 2 | Pending |
| SCH-04: Display search results | Phase 2 | Pending |
| SCH-05: Schedule video | Phase 3 | Pending |
| SCH-06: View scheduled videos | Phase 3 | Pending |
| SCH-07: Mark scheduled completed | Phase 3 | Pending |
| SCH-08: Reschedule video | Phase 3 | Pending |
| SCH-09: Remove from schedule | Phase 3 | Pending |
| DASH-01: Display video list | Phase 2 | Pending |
| DASH-02: Show watch status | Phase 2 | Pending |
| DASH-03: Show category badges | Phase 2 | Pending |
| DASH-04: Show scheduled videos | Phase 3 | Pending |
| DASH-05: Quick-add form | Phase 2 | Pending |

**Coverage:**
- v1 requirements: 33 total
- Mapped to phases: 33
- Unmapped: 0 ✓

---
*Requirements defined: 2026-04-10*
*Last updated: 2026-04-10 after roadmap creation*