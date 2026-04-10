# Feature Landscape

**Domain:** YouTube Video Study Manager
**Researched:** 2026-04-10
**Confidence:** MEDIUM-HIGH

## Executive Summary

Research across 15+ YouTube study and organization tools reveals a mature ecosystem with clear expectations. Users in this space are primarily learners who want to actively organize, annotate, and retain knowledge from video content rather than passively consume.

**Table stakes** require: video library with custom organization, timestamped note-taking, search capability, and watch progress tracking. These are non-negotiable — users abandon apps that lack them.

**Differentiators** cluster around three axes: AI-powered features (summaries, transcripts, chat), cross-platform + cross-content sync, and advanced organization (smart folders, inbox triage, channel sync). Most tools offer at least one AI feature as a premium upsell.

**Anti-features** include algorithmic recommendations, social features, offline downloads, and cloud sync that feels like lock-in. Users explicitly reject "YouTube's algorithm" philosophy and want local-first control.

---

## Table Stakes Features

Must-have features. Missing these = users leave immediately.

| Feature | Why Expected | Complexity | Notes |
|---------|-------------|------------|-------|
| **Video library/collection** | Central to the entire app. Users need to see all saved videos in one place. | Medium | Core data model — videos with metadata |
| **Add video by URL** | Primary entry point. Paste YouTube link → video added. | Low | Fetch metadata via oEmbed or simple parsing |
| **Custom categories/folders** | Users organize by topic, course, project. Not YouTube's playlists. | Medium | Hierarchical or flat tagging — both work |
| **Basic search** | Find specific videos or topics. Essential at 50+ videos. | Low | Title + tags search is MVP-s合格 |
| **Video metadata display** | Title, channel, duration, thumbnail. | Low | Fetch from YouTube API or scraper |
| **Mark as watched/unwatched** | Basic progress tracking. Users need to know what they've seen. | Low | Boolean or percentage states |
| **Timestamped notes** | The signature feature. Notes "at 2:45" tied to video moment. | Medium | Core value-add — distinguishes from bookmarks |
| **Note navigation** | Click note → jump to timestamp in video player. | Medium | Requires timestamp ↔ player integration |
| **Dark mode** | Expected by default in 2026. | Low | Most competing tools have it |

### Table Stakes Rationale

These eight features directly support the core use case described in PROJECT.md: organizing videos with custom categories, adding timestamp notes, and tracking study progress. Every competing product offers the first seven (or equivalent), and dark mode is ubiquitous.

The absence of any single feature would make the app feel incomplete compared to established alternatives. Prioritize shipping these before adding anything new.

---

## Differentiating Features

Competitive advantages. Not expected, but valued strongly when present.

### AI-Powered Features

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| **AI video summaries** | Skip watching entirely for redundant content. Saves hours. | High | Premium feature in most tools (TubeStudy, Fluxer, YNotes) |
| **Auto-transcription** | YouTube captions are unreliable. Whisper-quality is compelling. | High | Only TubeStudy claims "Whisper-grade" accuracy |
| **AI chat with video** | "Ask about the video content" — like having the presenter available. | High | RAG-powered Q&A. Premium in all tools |
| **AI-generated tags/categories** | Don't make users manually organize. Auto-suggest is compelling for power users. | Medium | TubeFlow offers this as Pro feature |

### Advanced Organization

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| **Channel subscription sync** | Import all videos from subscribed channels automatically. Eliminates manual entry. | High | Requires OAuth + polling infrastructure |
| **Inbox/triage system** | New videos → inbox → review, keep, or archive. Like email for video. | Medium | Velty and YTidy specifically market this |
| **Smart folders** | "AI suggests which folder this video belongs in" — power user feature. | Medium | TubeFlow Pro feature |
| **Multi-video playlists** | Group related videos into sequences for systematic learning. | Low | PlayItLater, TubeFlow, PocketTube all have |
| **Smart search** | Search across notes, transcripts, and titles. Not just titles. | Medium | You||Note specifically markets this |
| **Cross-content import** | Import from Spotify, Vimeo, etc. | High | PlayItLater does this — multi-platform |

### Enhanced UX

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| **Dual-pane interface** | Video on one side, notes on the other. No tab switching. | Medium | YNotes flagship feature |
| **Auto-pause when typing** | Type a note → video pauses automatically. Flow-friendly. | Low | You||Note has this |
| **Per-channel playback speed** | Different channels, different optimal speeds. | Low | Unwatched iOS app specifically has this |
| **Export to Notion/Obsidian** | Users have "second brains" elsewhere. Export matters. | Medium | You||Note, TubeStudy, YNotes all support |
| **Focus/Study mode** | Hide YouTube recommendations, comments, shorts. Distraction-free. | Low | YouFocus, TubeStudy have this |
| **Watch schedule/calendar** | "I will watch this video Tuesday at 7pm" — study planning. | Medium | Not common — opportunity |
| **Video progress tracking** | Don't restart at 0:00. Resume where you left off. | Low-Medium | Velty has this |
| **Chapter navigation** | Jump to chapters in video. YouTube supports this natively. | Low | Integrate YouTube chapters API |
| **Screenshot capture** | Visual notes alongside text. | Low | TubeStudy has this |
| **PDF export** | For offline study or printing. | Low | TubeStudy, YNotes have this |

### Platform Features

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| **Mobile app** | iOS/Android. Users want to study on the go. | High | Unwatched for YouTube is iOS-only |
| **PWA support** | "Works on all screen sizes" without native app cost. | Medium | Velty markets this specifically |
| **Offline access** | Download videos for airplane mode. | High | Rarely offered — storage costs |
| **Multi-device sync** | Library across phone + desktop. | High | PlayItLater, TubePocket (cloud backup) |
| **Browser extension** | One-click save from anywhere. | Medium | Most tools either have or roadmap this |

### Community & Social

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| **Public notes sharing** | Share your notes publicly. Build reputation. | Medium | You||Note Pro has public profiles |
| **Collaborative playlists** | Shared study lists. Like course co-ops. | High | Rarely offered — niche need |
| **Highlight sharing** | Share specific timestamped moments. | Low | Glasp does this on YouTube |

---

## Anti-Features

Explicitly avoid building these. Users reject them strongly.

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| **Algorithmic recommendations** | Users explicitly escape YouTube's algorithm. "No algorithmic recommendations" is a selling point for PlayItLater and Velty. | Curated organization only. Users choose what to watch. |
| **Forced cloud accounts** | Some users want local-only. YouGet explicitly markets "no login required." | Local-first with optional sync. Don't require accounts. |
| **Download-to-offline** | Complicates app, costs storage, may violate YouTube ToS. | Stream in-place. Let users use YouTube's offline feature. |
| **Social sharing (default)** | This is a study tool, not social media. Unwanted complexity. | Optional sharing only, off by default. |
| **Ad integration** | Users pay for ad-free experience. Ads would break trust. | Never. Premium or free, but no ads. |
| **Real-time video playback inside app** | Increases complexity, requires licensing, outside core value. | Open in external player. Project.md explicitly says this. |

---

## Feature Dependencies

Understanding what enables what.

```
Video library → Category system → Search/filter → Watch progress → Study schedule

Video player (external) → Timestamped notes → Note navigation → Note export

Video addition → Metadata fetch → Library display

Channel sync → Inbox/triage → Organization → Watch progress

AI summaries → Transcript (prerequisite)
AI chat → Transcript + embeddings (prerequisite)

Notes export → Markdown/docx conversion → Notion/Obsidian sync
```

### Key Dependency Chains

1. **MVP chain:** Video library + category + note-taking + search. These must ship in Phase 1 (or earliest) because everything else builds on them.

2. **AI chain:** Summaries and chat require transcripts first. Plan transcript integration before AI features.

3. **Sync chain:** Import from channels → inbox triage → organization flow. Don't build inbox without understanding import sources.

4. **Export chain:** Timestamps → Markdown → third-party integrations. Build timestamps before export.

---

## MVP Recommendation

Prioritize in this order:

### Must Ship in Phase 1

1. **Video library with custom categories**
   - Why: The core data model. Everything else depends on it.
   - Supports: PROJECT.md requirement "Classify videos by custom major/minor categories"

2. **Add video by URL with metadata fetch**
   - Why: Primary entry point. Manual entry is non-negotiable.
   - Supports: PROJECT.md requirement "Track YouTube videos (manual entry + channel sync)"

3. **Timestamped note-taking per video**
   - Why: The signature differentiator. Key value proposition.
   - Supports: PROJECT.md requirement "Add timestamp notes (mid-viewpoints)"

4. **Search within library**
   - Why: Essential at scale. Users will abandon if they can't find things.
   - Supports: PROJECT.md requirement "Search videos in collection"

5. **Mark as watched/status tracking**
   - Why: Basic progress tracking.
   - Supports: PROJECT.md requirement "Study schedule: plan watch times + track progress"

### Defer to Later Phases

- **AI features (summaries, chat, transcripts)**: High complexity, requires external API, premium opportunity. Defer until core is validated.

- **Channel subscription sync**: Requires OAuth + ongoing polling infrastructure. Defer until MVP validates user interest.

- **Export to Notion/Obsidian**: Nice-to-have but not before users have value.

- **Multi-platform sync**: Local-first is a selling point (PROJECT.md specifies SQLite). Defer if using cloud would add complexity.

- **Study schedule/calendar**: Core value is organization + notes + progress. Schedule can come afterMVP validates.

---

## Competitive Gap Analysis

Opportunities the market isn't serving well:

| Gap | Why Underserved | Opportunity |
|-----|------------------|--------------|
| **Local-first + notes** | Most tools either require accounts (YNotes) or are cloud-only (TubeStudy). YouGet and TubePocket App offer local-only but lack robust note-taking. | Build local-only + timestamp notes like You||Note but without account requirement. |
| **SQLite storage** | Most tools are cloud-first. No competitor explicitly uses SQLite as storage engine. | PROJECT.md's decision to use SQLite is differentiated. |
| **Study schedule + notes combined** | Most tools either do scheduling (Velty) OR notes (You||Note) but not both well. PlayItLater does queue + notes but not "study schedule." | Combine best of organizational tools with best of note-taking tools. |
| **Open external player** | YNotes, TubeStudy integrate the player. But some users prefer their own player with keyboard shortcuts. | Let users choose — open external or use embedded. |

---

## Sources

- [YNotes - My YouTube Notes Organizer](https://projectmanagers.net/ynotes) — Full feature demo
- [You||Note - Take Notes on YouTube Videos](https://younote.dev/) — Note-taking UX benchmark
- [TubeStudy - Turn YouTube into your personal university](https://tubestudy.app/) — AI features reference
- [Velty - Organize your YouTube subscriptions](https://velty.app/) — Channel sync + inbox reference
- [PlayItLater - The Ultimate Watch Later App](https://www.playitlater.net/) — Multi-content + organization
- [YouFocus - Focus modes for YouTube: Study & Work](https://youfocus.site/) — Focus mode reference
- [TubeFlow | AI Powered YouTube Organizer](https://www.tubeflow.ai/) — AI grouping reference
- [Unwatched for YouTube (iOS)](https://apps.apple.com/us/app/unwatched-for-youtube/id6477287463) — Mobile UX reference
- [5 Chrome Extensions for YouTube Productivity in 2025 - TubeMemo](https://www.tubememo.com/blog/5-chrome-extensions-for-youtube-productivity-in-2025) — Extension ecosystem
- [YouGet - Video Saver](https://spark.mwm.ai/en/apps/youget-video-saver/6755301953) — Local-only reference
- [YTidy - YouTube Subscription Organizer](http://ytidy.vercel.app/) — Side panel architecture
- [PocketTube - YouTube Subscription Manager](https://pockettube.io/) — 300K user base feature list