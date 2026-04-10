# Project Research Summary

**Project:** YouTube Video Study Manager
**Domain:** Local-first Personal Knowledge Management Web App
**Researched:** 2026-04-10
**Confidence:** MEDIUM-HIGH

## Executive Summary

The YouTube Video Study Manager is a local-first web application that helps users organize, annotate, and track their YouTube video learning collection. Research across 15+ competing tools reveals a mature market where users expect core features (video library, custom categories, timestamped notes, search) as table stakes, while AI-powered features and advanced organization serve as differentiators.

**Recommended approach:** Build with Vue.js 3 + TypeScript + sql.js for browser-based SQLite storage. This stack delivers the fastest time-to-market for a single-developer or small team, with gentler learning curve than React and full SQL capabilities for complex queries across videos, categories, and timestamps. The local-first architecture—storing data in SQLite via IndexedDB—differentiates from cloud-first competitors and aligns with user preference for local data ownership.

**Key risks:** SQLite write contention under concurrent operations, YouTube API quota exhaustion without monitoring, and query performance degradation at scale. All three are preventable with proper architecture patterns in the foundation phase.

## Key Findings

### Recommended Stack

**Core technologies:**
- **Vue.js 3.6.x** — Single-file components match the mental model for data-driven CRUD apps; gentler onboarding than React; built-in reactivity handles state without Redux/MobX
- **Vite 6.x** — Standard for modern Vue projects; instant dev server, optimized production builds with esbuild
- **TypeScript 5.x** — Catches type errors at compile time; critical for data models (Video, Category, Timestamp) where runtime bugs cost debugging time
- **sql.js 1.11.x** — Most mature solution for SQLite in browser; full SQL support (JOINs, aggregates, transactions) critical for video categorization queries
- **idb 8.x** — Promise-based IndexedDB wrapper; used to persist sql.js database across sessions

**Supporting libraries:** @vueuse/core (auto-persist reactive state), date-fns (date formatting), lucide-vue-next (icons)

### Expected Features

**Must have (table stakes):**
- **Video library/collection** — Central data model; users need to see all saved videos in one place
- **Add video by URL** — Primary entry point; paste YouTube link → video added with metadata
- **Custom categories/folders** — Users organize by topic, course, project; not YouTube's playlists
- **Basic search** — Find specific videos or topics; essential at 50+ videos
- **Timestamped notes** — The signature feature; notes "at 2:45" tied to video moment
- **Mark as watched/unwatched** — Basic progress tracking
- **Dark mode** — Expected by default in 2026

**Should have (competitive):**
- **Dual-pane interface** — Video on one side, notes on the other
- **Watch schedule/calendar** — Study planning with planned watch times
- **Video progress tracking** — Resume where you left off
- **Export to Notion/Obsidian** — Users have "second brains" elsewhere

**Defer (v2+):**
- **AI features** (summaries, chat, transcripts) — High complexity, requires external API
- **Channel subscription sync** — Requires OAuth + polling infrastructure
- **Multi-device sync** — Local-first is a selling point per PROJECT.md

### Architecture Approach

The app follows a **local-first, single-page application architecture** with clear layer separation:

1. **UI Layer** — Vue components (Dashboard View, Video Detail View, Schedule View)
2. **State Layer** — Vue's reactive system with composables
3. **Service Layer** — VideoService, CategoryService, TimestampService, ScheduleService
4. **Data Layer** — Repository pattern over SQLite database

Key patterns: Repository pattern for data access abstraction, Optimistic UI updates for instant feedback, WAL mode for SQLite write performance.

### Critical Pitfalls

1. **Storing full YouTube API responses** — Database bloats to hundreds of MB; define minimal schema (video ID, title, URL, duration, channel, thumbnail, status) only
2. **YouTube API quota exhaustion** — Default 10,000 units/day exhausts quickly; implement quota tracking and caching before shipping sync
3. **SQLite write contention** — Single-writer lock causes UI freezes; use WAL mode, serialize writes, keep transactions short
4. **Query performance without indexes** — Full table scans kill search at 500+ videos; create indexes on query columns, use FTS5
5. **Large collections without virtualization** — DOM renders 500+ items crashes mobile; implement virtual scrolling or pagination

## Implications for Roadmap

Based on research, suggested phase structure:

### Phase 1: Foundation
**Rationale:** All other phases depend on proper database schema, connection strategy, and indexing. Foundation phase prevents pitfalls that are expensive to fix later (pitfalls 1, 3, 4, 7).

**Delivers:**
- Vue + Vite + TypeScript project setup
- SQLite database with proper schema and indexes
- Repository layer (VideoRepository, CategoryRepository)
- Basic UI skeleton (navigation, layout)

**Addresses:**
- Pitfall 1: Minimal data schema design
- Pitfall 3: SQLite connection strategy with WAL mode
- Pitfall 4: Indexes on query columns (url, addedAt, categoryId)
- Pitfall 7: Pagination/virtualization strategy defined

**Research flag:** LOW — Well-documented patterns, no need for deeper research

---

### Phase 2: Core Features
**Rationale:** Core CRUD operations must work before adding organization features. This phase delivers the table stakes that users expect immediately.

**Delivers:**
- VideoService with YouTube URL parsing
- Add video by URL with metadata fetch (minimal data only)
- CategoryService with major/minor categories
- Dashboard UI: video list, search, filtering, category display
- Video add/edit flow

**Addresses:** Table stakes — video library, add video, custom categories, basic search, watch status

**Research flag:** LOW — Standard CRUD patterns

---

### Phase 3: Deep Features
**Rationale:** Timestamped notes are the signature feature. This differentiates from competitors and delivers core value proposition.

**Delivers:**
- TimestampService for mid-viewpoint notes
- Video Detail UI: metadata display, timestamp notes, editing
- Timestamp timeline UI with note navigation
- Click note → open video at timestamp (external player)

**Addresses:** FEATURES.md — timestamped notes, note navigation

**Research flag:** MEDIUM — External player integration needs real-device testing

---

### Phase 4: Scheduling & Progress
**Rationale:** Study schedule and progress tracking complete the MVP. Users need to plan watch times and track completion.

**Delivers:**
- ScheduleService for watch sessions
- Schedule view: calendar, planned sessions
- Progress tracking: watched/unwatched status, completion history
- Study session features

**Addresses:** PROJECT.md requirement — "Study schedule: plan watch times + track progress"

**Research flag:** LOW — Standard calendar/scheduling patterns

---

### Phase 5: Polish & Mobile
**Rationale:** Foundation stable; now optimize for mobile and add export capabilities.

**Delivers:**
- PWA support with offline capability
- Mobile responsive design
- Export to Notion/Obsidian
- Data export/backup
- Performance optimization at scale

**Research flag:** MEDIUM — Mobile storage constraints need real-device testing

---

### Phase Ordering Rationale

- **Foundation-first** prevents critical pitfalls (database bloat, write contention, search performance) that are exponentially harder to fix after data accumulates
- **Core before Deep** — CRUD must work before adding timestamp notes; note-taking builds on video library
- **Scheduling after Notes** — Study schedule uses video metadata and progress; simpler after core is stable
- **Polish last** — Mobile optimization, export, and PWA are nice-to-haves that don't define core value

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 3 (Deep Features):** External player URL formats need real-device testing across iOS, Android, desktop. Only tested assumptions so far.
- **Phase 5 (Polish):** Mobile storage behavior differs from web; need real-device testing with limited storage.

Phases with standard patterns (skip research-phase):
- **Phase 1:** SQLite patterns well-documented; no need for deeper research
- **Phase 2:** Standard CRUD patterns; Vue/Vite ecosystem has established approaches

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Uses well-established libraries with active maintenance; sql.js, Vue 3, Vite all have strong documentation |
| Features | HIGH | Researched 15+ competing products; table stakes and differentiators well-established |
| Architecture | MEDIUM-HIGH | Repository + service layer is standard pattern; local-first with sql.js is proven |
| Pitfalls | MEDIUM | Some pitfalls (quota, external player) require real-device verification; pattern recognition but not tested |

**Overall confidence:** MEDIUM-HIGH

### Gaps to Address

- **External player testing:** Phase 3 requires testing URL launching across real devices (iOS YouTube app, Android, desktop browser). Research flagged this as "assumption-based" — will need device lab or user testing.

- **Mobile storage limits:** Phase 5 requires real mobile device testing with limited storage. Web storage behaves differently from iOS/Android.

- **YouTube API behavior:** Channel sync (deferred to v2) may have undocumented edge cases. Quota behavior is documented but actual threshold usage varies.

---

## Sources

### Primary (HIGH confidence)
- sql.js GitHub — https://github.com/sql-js/sql.js — SQLite in browser implementation
- Vue 3 Official Docs — https://vuejs.org/ — Framework documentation
- Vite Official Docs — https://vitejs.dev/ — Build tool documentation
- idb Library (Jake Archibald) — https://github.com/jakearchibald/idb — IndexedDB wrapper

### Secondary (MEDIUM confidence)
- YNotes feature analysis — Full feature demo reference
- YouTube Data API v3 quota documentation
- Local-first architecture patterns from Expo guide
- Competitive product feature analysis (15+ tools)

### Tertiary (LOW confidence)
- Browser storage comparison 2026 — Needs validation
- Frontend framework comparison 2026 — Community consensus varies

---

*Research completed: 2026-04-10*
*Ready for roadmap: yes*