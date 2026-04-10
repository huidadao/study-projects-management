# Architecture Patterns

**Domain:** YouTube Video Study Manager
**Project:** YouTube Video Study Manager
**Researched:** 2026-04-10

## Recommended Architecture

The YouTube Video Study Manager follows a **local-first, single-page application architecture** optimized for personal video collection management. This differs fundamentally from YouTube's massive-scale distributed system—the focus here is on efficient local data management rather than video hosting and streaming.

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                             │
│  ┌─────────────────┐    ┌─────────────────┐                  │
│  │   Web Browser   │    │  Mobile Device   │                  │
│  │   (PWA Mode)    │    │   (Responsive)  │                  │
│  └────────┬────────┘    └────────┬────────┘                  │
└───────────┼───────────────────────┼──────────────────────────────┘
            │                       │
            ▼                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                      UI LAYER (React)                            │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐                │
│  │ Dashboard  │  │   Video    │  │  Schedule  │                │
│  │    View    │  │   Detail   │  │   View     │                │
│  └────────────┘  └────────────┘  └────────────┘                │
│              │              │              │                      │
│              └──────────────┼──────────────┘                      │
│                             ▼                                   │
│                    ┌────────────────┐                         │
│                    │   Components    │                         │
│                    │  (VideoCard,    │                         │
│                    │  CategoryTag,   │                         │
│                    │  TimestampList) │                         │
│                    └────────────────┘                         │
└─────────────────────────────────────────────────────────────────┘
            │
            ▼
┌─────────────────────────────────────────────────────────────────┐
│                   STATE LAYER                                   │
│  ┌────────────────┐  ┌────────────────┐                      │
│  │  Global Store  │  │  View State     │                      │
│  │   (Zustand)    │  │  (React)       │                      │
│  └────────────────┘  └────────────────┘                      │
└─────────────────────────────────────────────────────────────────┘
            │
            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    SERVICE LAYER                                 │
│  ┌────────────────┐  ┌────────────────┐  ┌──────────────┐ │
│  │ VideoService   │  │CategoryService│  │ScheduleServ │ │
│  │ - addVideo()   │  │ - setCategory()│  │- addSession()│ │
│  │ - searchVideos│  │ - getCategories│  │- getProgress│ │
│  │ - updateMeta()│  │                │  │              │ │
│  └────────────────┘  └────────────────┘  └──────────────┘ │
│              │              │              │                       │
│              └──────────────┼──────────────┘                       │
│                             ▼                                    │
│                    ┌────────────────┐                           │
│                    │  TimestampService│                          │
│                    │  - addNote()     │                          │
│                    │  - getNotes()    │                          │
│                    └────────────────┘                           │
└─────────────────────────────────────────────────────────────────┘
            │
            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    DATA LAYER                                    │
│  ┌────────────────┐  ┌────────────────┐                      │
│  │  SQLite DB    │  │   Repository   │                      │
│  │  (better-sqlite│  │   (Data       │                      │
│  │   / sql.js)   │  │    Access)     │                      │
│  └────────────────┘  └────────────────┘                      │
│                             │                                    │
│                             ▼                                    │
│                    ┌────────────────┐                           │
│                    │  Migrations    │                           │
│                    └────────────────┘                           │
└─────────────────────────────────────────────────────────────────┘
```

### Component Boundaries

| Component | Responsibility | Communicates With |
|-----------|---------------|-------------------|
| **Dashboard View** | Display video collection, search, filtering | VideoService, CategoryService |
| **Video Detail View** | Show video metadata, timestamp notes, editing | VideoService, TimestampService, ScheduleService |
| **Schedule View** | Manage study sessions, track progress | ScheduleService |
| **VideoService** | CRUD operations for videos, YouTube URL parsing | Repository |
| **CategoryService** | Manage major/minor categories | Repository |
| **TimestampService** | Handle mid-viewpoint notes | Repository |
| **ScheduleService** | Manage watch sessions and progress | Repository |
| **Repository** | Database operations, query building | SQLite Database |
| **SQLite Database** | Data persistence | File System (web: IndexedDB/OPFS) |

### Data Flow

```
User Action
     │
     ▼
┌────────────────┐
│  React View    │ ◄── Render & Event Handling
└───────┬────────┘
        │ dispatch action / call service
        ▼
┌────────────────┐
│ Service Layer  │ ◄── Business Logic
└───────┬────────┘
        │ call repository method
        ▼
┌────────────────┐
│  Repository    │ ◄── SQL Query Execution
└───────┬────────┘
        │ execute query
        ▼
┌────────────────┐
│ SQLite Database │ ◄── Data Persistence
└───────┬────────┘
        │ return result
        ▼
┌────────────────┐
│  React View    │ ◄── Update State & Re-render
└────────────────┘
```

## Patterns to Follow

### Pattern 1: Local-First with SQLite

**What:** Store all data locally in SQLite instead of making API calls to a server. The app works offline by default.

**When:** Primary architecture for personal productivity tools where user owns their data.

**Implementation:**

```typescript
// Web: sql.js with IndexedDB persistence
import initSqlJs from 'sql.js';

const SQL = await initSqlJs({
  locateFile: file => `https://sql.js.org/dist/${file}`
});

const db = new SQL.Database();

// Store in IndexedDB for persistence
async function saveDatabase() {
  const data = db.export();
  const buffer = new Uint8Array(data);
  await IndexedDB.put('youtubestudy', 'database', buffer);
}
```

**Why appropriate:** PROJECT.md specifies SQLite for local storage, local-first aligns with privacy and simplicity goals.

### Pattern 2: Repository Pattern for Data Access

**What:** Abstract database operations behind repository interfaces, keeping business logic separate from data access.

**When:** Any application with persistent storage.

**Implementation:**

```typescript
// repository/VideoRepository.ts
export class VideoRepository {
  constructor(private db: Database) {}

  async findById(id: string): Promise<Video | null> {
    const stmt = this.db.prepare('SELECT * FROM videos WHERE id = ?');
    stmt.bind([id]);
    if (stmt.step()) {
      return videoFromRow(stmt.getAsObject());
    }
    return null;
  }

  async search(query: string): Promise<Video[]> {
    const stmt = this.db.prepare(`
      SELECT * FROM videos 
      WHERE title LIKE ? OR description LIKE ?
      ORDER BY added_at DESC
    `);
    stmt.bind([`%${query}%`, `%${query}%`]);
    // ... iterate results
  }
}
```

**Why appropriate:** Clean separation enables easier testing, migration, and future sync layer addition.

### Pattern 3: Optimistic UI Updates

**What:** Update UI immediately on user action, then persist to database. If persistence fails, revert and show error.

**When:** Local-first apps where writes are fast (no network round-trip).

**Implementation:**

```typescript
// In React component
const handleAddVideo = async (videoData: VideoInput) => {
  // Optimistic update
  const tempId = crypto.randomUUID();
  addVideo({ ...videoData, id: tempId }); // Update UI immediately

  try {
    // Persist to SQLite
    await videoRepository.create(videoData);
  } catch (error) {
    // Revert on failure
    removeVideo(tempId);
    showError('Failed to save video');
  }
};
```

**Why appropriate:** Local writes are fast, UI feels instant, failure handling is straightforward.

### Pattern 4: Service Layer Pattern

**What:** Business logic encapsulated in services that coordinate between UI and data layers.

**When:** Application grows beyond simple CRUD operations.

**Implementation:**

```typescript
// services/VideoService.ts
export class VideoService {
  constructor(
    private videoRepo: VideoRepository,
    private categoryRepo: CategoryRepository
  ) {}

  async addVideo(input: VideoInput): Promise<Video> {
    // Parse YouTube URL to extract ID
    const youtubeId = this.parseYouTubeUrl(input.url);

    // Check for duplicate
    const existing = await this.videoRepo.findByYoutubeId(youtubeId);
    if (existing) {
      throw new Error('Video already in collection');
    }

    // Set default category if not specified
    if (!input.categoryId) {
      const defaultCategory = await this.categoryRepo.findDefault();
      input.categoryId = defaultCategory.id;
    }

    // Create video
    return this.videoRepo.create({
      ...input,
      youtubeId,
      addedAt: new Date().toISOString()
    });
  }
}
```

**Why appropriate:** Complex operations like YouTube URL parsing, duplicate detection, and default category assignment belong in service layer.

## Anti-Patterns to Avoid

### Anti-Pattern 1: Direct Database Calls in UI Components

**What:** Calling SQLite directly inside React components.

**Why bad:** Violates separation of concerns, makes testing difficult, bloats components.

**Instead:** Use service layer, components only receive data and dispatch actions.

### Anti-Pattern 2: Storing Full YouTube API Responses

**What:** Caching complete video metadata from YouTube API for every video.

**Why bad:** Unnecessary storage bloat, data becomes stale, privacy concerns.

**Instead:** Store only user-curated data (title, notes, categories). Fetch fresh metadata only when needed.

### Anti-Pattern 3: Single Large Table for Everything

**What:** Putting all data in one database table.

**Why bad:** Poor query performance, difficult schema evolution, no data integrity.

**Instead:** Normalize with separate tables for videos, categories, timestamps, schedules, proper foreign keys.

## Scalability Considerations

| Concern | At 100 Videos | At 1,000 Videos | At 10,000 Videos |
|---------|--------------|----------------|-----------------|
| **Storage** | SQLite file ~1MB | SQLite file ~10MB | SQLite file ~100MB |
| **Search** | LIKE query acceptable | Full-text search (FTS5) | Add indexed columns |
| **Categories** | Simple enum or table | Separate table with ordering | Separate table with ordering |
| **Rendering** | Standard React rendering | Virtual list for video grid | Virtual list, pagination |
| **Notes** | Individual timestamp rows | Consider partitioning | Archive old notes |

**Note:** YouTube Video Study Manager use case (personal learning collection) typically ranges from 10-500 videos. SQLite handles this comfortably without special optimization.

## Suggested Build Order

Based on dependencies between components:

```
Phase 1: Foundation
├── Set up React project with TypeScript
├── Configure SQLite (better-sqlite3/sql.js)
├── Create database schema and migrations
└── Implement Repository base layer

Phase 2: Core Features
├── Implement VideoRepository
├── Build VideoService
├── Create Dashboard UI (video list, search)
└── Implement Video add/edit flow

Phase 3: Organization
├── Implement CategoryRepository/Service
├── Build category management UI
├── Add category filtering to Dashboard
└── Implement custom categories (major/minor)

Phase 4: Deep Features
├── Implement TimestampService
├── Add timestamp notes to Video Detail
├── Build timestamp timeline UI
└── Add timestamp search/filter

Phase 5: Scheduling
├── Implement ScheduleRepository/Service
├── Build Schedule view
├── Add progress tracking
└── Create study session features

Phase 6: Polish
├── Add offline/PWA support
├── Mobile responsive design
├── Performance optimization
└── Data export/backup
```

## Data Model (Schema)

```sql
-- Videos table
CREATE TABLE videos (
  id TEXT PRIMARY KEY,
  youtube_id TEXT UNIQUE,
  url TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  duration_seconds INTEGER,
  category_id TEXT REFERENCES categories(id),
  is_major INTEGER DEFAULT 0,
  added_at TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- Categories table
CREATE TABLE categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  color TEXT,
  sort_order INTEGER DEFAULT 0,
  is_default INTEGER DEFAULT 0,
  created_at TEXT NOT NULL
);

-- Timestamps (mid-viewpoint notes)
CREATE TABLE timestamps (
  id TEXT PRIMARY KEY,
  video_id TEXT NOT NULL REFERENCES videos(id),
  seconds INTEGER NOT NULL,
  note TEXT NOT NULL,
  created_at TEXT NOT NULL
);

-- Study schedules
CREATE TABLE schedules (
  id TEXT PRIMARY KEY,
  video_id TEXT NOT NULL REFERENCES videos(id),
  scheduled_at TEXT NOT NULL,
  completed_at TEXT,
  status TEXT DEFAULT 'pending',
  created_at TEXT NOT NULL
);

-- Full-text search (optional, for Phase 4+)
CREATE VIRTUAL TABLE videos_fts USING fts5(
  title, description, note=fts5_notes, content=videos, content_rowid=rowid
);
```

## Sources

- [YouTube System Design - Grokking](https://grokkingthesystemdesign.com/guides/youtube-system-design/) — HIGH: Official system design guide, authoritative
- [Design YouTube - System Design Sandbox](https://www.systemdesignsandbox.com/learn/design-youtube) — HIGH: Component interaction patterns
- [Local-First Architecture - Expo](https://docs.expo.io/guides/local-first/) — HIGH: Modern local-first patterns for web/mobile
- [sql.js + IndexedDB: Offline-First Web App](https://recca0120.github.io/en/2026/03/05/sql-js-offline-web-app/) — MEDIUM: Web SQLite implementation
- [Practical Guide to Local-First - TechUpgradeNow](https://techupgradenow.com/the-practical-guide-to-building-a-local-first-software-architecture/) — MEDIUM: Architecture patterns
- [LiveStore: SQLite-based data layer](https://expo.dev/blog/local-first-application-development-with-livestore) — HIGH: Modern local-first tooling
- [Foldergram - Local-first gallery](https://foldergram.github.io/) — MEDIUM: Real-world local-first app pattern