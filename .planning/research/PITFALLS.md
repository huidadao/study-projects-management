# Pitfalls Research

**Domain:** YouTube Video Study Manager Application
**Researched:** 2026-04-10
**Confidence:** MEDIUM

## Critical Pitfalls

### Pitfall 1: Storing Full YouTube API Responses Instead of Minimal Data

**What goes wrong:**
Database grows excessively large (hundreds of MB to GB) due to storing complete YouTube API responses including full video descriptions, thumbnails, channel metadata, and community post data. This kills mobile performance and causes storage quota issues.

**Why it happens:**
The obvious approach is to store complete API responses for "completeness." Developers fetch video details from YouTube Data API and save everything returned rather than selecting only necessary fields. This feels safer ("more data is better") but destroys performance on mobile devices with limited storage.

**How to avoid:**
Explicitly define a minimal schema storing only: video ID, title, URL, duration, channel name, thumbnail URL, and watch status. Never store full descriptions, complete channel data, or community posts. Fetch fresh data when viewing details rather than caching aggressively.

**Warning signs:**
- Database file growing beyond 50MB for collections under 500 videos
- Mobile app showing storage warnings
- Slow app launch times

**Phase to address:**
Foundation phase — schema design prevents this, not a later fix.

---

### Pitfall 2: YouTube API Quota Exhaustion Without Monitoring

**What goes wrong:**
Channel sync features consume YouTube API quota rapidly (default: 10,000 units/day), causing all sync features to fail. No warning given to user until sync suddenly stops working. Users lose trust in automatic sync.

**Why it happens:**
YouTube Data API v3 has strict quota limits. Each API call costs quota units. Listing videos from a channel costs ~1 unit per call, but fetching details for each video costs more. Without tracking quota usage or implementing smart caching, a channel with 200 videos can exhaust daily quota in minutes.

**How to avoid:**
Implement quota tracking: store daily usage, warn users when approaching limits, use cached data preferentially, and only sync metadata the app actually uses. Document quota costs: channels.list ~100 units, playlistItems.list ~1 unit per 50 items, videos.list ~1 unit per 50 items.

**Warning signs:**
- Sync "stuck" without errors (quota exhausted, not failed)
- No quota warning UI appearing
- Users reporting "sync stopped working"

**Phase to address:**
Channel Integration phase — quota management required before any sync ship.

---

### Pitfall 3: SQLite Write Contention Under Concurrent Writes

**What goes wrong:**
App becomes unresponsive when multiple components write simultaneously: user adds video while sync runs, timestamp notes save, progress updates. SQLite's single-writer lock causes UI freezes of 500ms-2000ms, making the app feel broken.

**Why it happens:**
SQLite allows only one writer at a time. Modern web/mobile apps use async operations. When sync process and user interactions write concurrently, they block each other. Without proper connection management, readers block writers and vice versa.

**How to avoid:**
Use WAL (Write-Ahead Logging) mode, serialize write operations through a single connection/task, keep transactions short (no network calls inside), and use batch inserts for sync operations. Set busy_timeout to allow waiting rather than failing.

**Warning signs:**
- UI freezes when saving during sync
- "Database locked" errors in console
- Write operations taking >200ms consistently

**Phase to address:**
Foundation phase — database connection strategy prevents this early.

---

### Pitfall 4: Query Performance Without Proper Indexes

**What goes wrong:**
Searching videos in larger collections (500+) becomes progressively slower: searches take >1 second, UI appears frozen. What started fast degrades with data growth. Users abandon search.

**Why it happens:**
Common mistake: creating tables without indexes, then adding WHERE and ORDER BY clauses against unindexed columns. Every search requires full table scan. FTS (Full-Text Search) added incorrectly or without proper configuration.

**How to avoid:**
Create indexes on likely query columns: video.url, video.channelId, video.addedAt, note.videoId. For search (title + channel), use SQLite FTS5 with proper configuration BEFORE data grows. Profile real queries to identify missing indexes.

**Warning signs:**
- Search taking >500ms on collections >100 videos
- Slow filtering on category changes
- No EXPLAIN QUERY PLAN verification during QA

**Phase to address:**
Foundation phase — index design prevents this, but testing at 500+ videos catches it.

---

### Pitfall 5: Not Handling Deleted Videos Gracefully

**What goes wrong:**
App shows videos that no longer exist on YouTube (deleted by creator, removed for policy). Users try to watch and get errors. Scheduled watch sessions become frustrating.

**Why it happens:**
No mechanism exists to validate video existence. Video URLs in database may point to deleted content. Without periodic verification, the database becomes a museum of dead links.

**How to avoid:**
On playback attempt, handle 404/410 responses (mark as unavailable, don't delete). Optionally support background verification for "watched" videos, or clearly show "availability unknown" status. Users should never see YouTube's "video unavailable" page.

**Warning signs:**
- Users reporting "video not found" errors in app
- "This video has been removed" appearing in external player
- No visibility into which videos might be unavailable

**Phase to address:**
Playback Integration phase — need error handling for external player responses.

---

### Pitfall 6: Broken External Player Integration Assumptions

**What goes wrong:**
Deep linking to videos fails: URLs don't open in user's preferred app, video start times don't work, and autoplay setting contradicts user intent. The app claims to "open videos" but user experience is broken.

**Why it happens:**
YouTube URL formats have multiple valid representations (youtu.be vs youtube.com, custom URLs, share URLs). Player state (autoplay, start position) requires URL parameters that behave differently across YouTube, YouTube Music, and native apps. Without testing across real scenarios, assumptions break in production.

**How to avoid:**
Support multiple URL formats, test URL launching across YouTube app, YouTube Music, and desktop browsers. Use standard start parameter correctly: t= seconds not ?t= seconds. Test fallback when preferred app isn't installed.

**Warning signs:**
- Different video opens when sharing from app vs opening externally
- Start time parameter ignored
- No test cases covering autoplay scenarios

**Phase to address:**
Playback Integration phase — must test across real environments.

---

### Pitfall 7: Large Collections Without Pagination or Virtualization

**What goes wrong:**
Displaying collections of 500+ videos crashes mobile browser or renders slowly. Users scroll through lists and experience jank, memory warnings, or full app crashes.

**Why it happens:**
Naive rendering loads all videos into DOM. Each video card has thumbnails, metadata, and interactive elements. 500+ DOM elements overwhelms mobile browsers. No pagination or windowed rendering implemented.

**How to avoid:**
Implement virtual scrolling (only render visible items + buffer), or pagination with limit/offset. Lazy-load thumbnails and metadata. Set hard limits for initial load (20-50 items) with "load more" trigger.

**Warning signs:**
- Performance degrading notably above 200 videos
- No virtual scroll or pagination pattern in code
- Mobile testing only with small datasets

**Phase to address:**
UI/Foundation phase — list rendering strategy prevents this early.

---

### Pitfall 8: Ignoring Mobile Storage Constraints

**What goes wrong:**
App doesn't function properly on mobile: can't store enough videos, database operations fail, or app gets terminated by OS for excessive storage usage. What works on web fails on phones.

**Why it happens:**
Mobile devices have limited storage (especially with other apps) and aggressively clear cache. iOS and Android have different storage behaviors. App treating mobile like desktop leads to poor mobile experience. No offline capability considered, but also no data management provided.

**How to avoid:**
Design for mobile-first: use minimal data schema, implement SQLite correctly (mobile-optimized), provide data management UI (delete watched videos, clear cache), and respect storage quotas. Don't assume persistent cache on mobile.

**Warning signs:**
- No "storage used" indicator
- iOS/Android differences ignored in design
- Mobile testing only with simulator

**Phase to address:**
Foundation/Mobile phase — storage strategy requires mobile-specific planning.

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Store full video metadata | Easy implementation | Database bloat, slow queries | Never — violates minimal data principle |
| Skip quota management | Faster initial sync | Features fail in production | Never for sync features |
| Single shared SQLite connection | Simpler code | Performance contention under load | Only in trivial use (<100 videos, no sync) |
| Skip indexing until slow | Faster schema changes | Regressions as data grows | Only in proof-of-concept |
| Embed thumbnails as base64 | Offline guaranteed | Massive database, slow queries | Never — URL reference sufficient |

---

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| YouTube API | Fetching all video details upfront | Fetch minimal data, lazy-load on demand |
| YouTube Data API v3 | Not checking API error responses | Handle quota, deleted video, and permission errors specifically |
| External Player | Assuming YouTube opens in-browser app | Test on actual devices, provide fallback |
| Web + Mobile Storage | Assuming same SQLite access patterns | Handle mobile persistence quirks differently |
| Video URL Formats | Using hardcoded URL patterns | Support multiple valid formats (youtu.be, youtu.be, youtube.com) |

---

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Full table scans on search | Search >500ms at 500+ videos | Index title, channel, category; use FTS5 | At collection size ~500 videos |
| Unoptimized sync batches | Sync time grows non-linearly | Batch with LIMIT, single transaction per batch | At channels with >100 videos |
| Large DOM lists | Mobile browser jank/crash | Virtual scrolling or pagination | Rendering >200 items |
| No image loading optimization | Network waterfall, slow loads | Lazy load, cache in storage, responsive images | With thumbnails enabled by default |

---

## Security Mistakes

| Mistake | Risk | Prevention |
|---------|------|------------|
| Storing YouTube API keys in app | Quota theft, quota exhausted by attackers | Never store keys client-side; use proxy or user-provided |
| Storing user credentials locally | Data theft on device compromise | Use platform secure storage (Keychain), not SQLite for secrets |
| Not encrypting local database | Local data exposure on stolen device | Consider SQLCipher for sensitive users; document limitations |
| Storing video history sensitive to user | Privacy exposure if device compromised | Allow clearing data; encrypt if high sensitivity needed |

The main security consideration: this is a local-only app storing user's video collection and notes. Primary risk is local device access. For most users, standard SQLite (device-encrypted at OS level) is sufficient.

---

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| No visibility into sync failures | User trusts sync works, it doesn't | Clear sync status, error messages, manual retry |
| Category changes apply everywhere | User can't organize by context | Allow per-video-category, not global only |
| Can't reorder study schedule | User can't prioritize | Provide drag-reorder or explicit priority |
| Notes lose timestamp context | Notes appear without video position | Always show video timestamp with notes |
| No "watched" cleanup | Library becomes cluttered | Auto-hide or bulk-remove watched videos |

---

## "Looks Done But Isn't" Checklist

- [ ] **Channel Sync:** Often only syncs new videos — verify existing videos update too
- [ ] **Search:** Often works on small dataset — verify at 500+ videos
- [ ] **External Player:** Often only tested in browser — verify mobile app opening
- [ ] **Offline:** Often assumed to work — verify behavior with no network
- [ ] **Data Migration:** Often forgotten — verify schema upgrades don't lose data
- [ ] **Category Changes:** Often applies immediately — verify undo exists

---

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Quota exhausted | LOW | Wait 24 hours, increase caching, reduce sync scope |
| Database locked/crashed | MEDIUM | Close all connections, restart app, WAL recovery |
| Deleted videos in collection | LOW | Manual remove or "clean unavailable" action |
| Slow search at scale | LOW | Add indexes to existing database via migration |
| Broken sync from API change | MEDIUM | Update to new API version, re-test channel list |

---

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| Minimal data schema | Phase 1: Foundation | Check DB size at 200 videos |
| API quota management | Phase 2: Core Integration | Test at 3+ channels |
| SQLite connection strategy | Phase 1: Foundation | Concurrent write stress test |
| Search indexes | Phase 1: Foundation | EXPLAIN QUERY PLAN on real queries |
| Deleted video handling | Phase 3: Playback | Test with known-deleted video ID |
| External player formats | Phase 3: Playback | Test on iOS, Android, Desktop |
| Large list rendering | Phase 4: UI | Test at 500+ videos on mobile |
| Mobile storage | Phase 1 + Mobile | Test on real device with limited storage |

---

## Sources

- Jellyfin SQLite concurrency issues (GitHub #2181) — real-world write contention patterns
- YouTube Data API v3 quota documentation
- SQLite FTS5 best practices from production experiences
- PowerSync SQLite-on-Web analysis (November 2025)
- iOS secure storage requirements (Appknox, September 2025)

---
*Pitfalls research for: YouTube Video Study Manager*
*Researched: 2026-04-10*