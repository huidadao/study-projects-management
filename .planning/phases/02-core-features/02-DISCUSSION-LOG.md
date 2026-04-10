# Phase 2: Core Features - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-10
**Phase:** 2-core-features
**Areas discussed:** Dashboard layout, Video card info, Timestamp notes UI, Search UX, Category filtering, External player handling

---

## Dashboard layout

| Option | Description | Selected |
|--------|-------------|----------|
| Cards | Consistent look with existing patterns, existing Card component reusable | |
| List | Simple list with title and channel, no Card wrapper | |
| Grid | Grid of video thumbnails, compact display | ✓ |

**User's choice:** Grid

---

## Video card info

| Option | Description | Selected |
|--------|-------------|----------|
| Full info | All details — thumbnail, title, channel, duration, status badge, category badges | ✓ |
| Minimal | Thumbnail and title only, hover for details | |
| Text-only | Title and channel only, no thumbnails | |

**User's choice:** Full info (Recommended)

---

## Timestamp notes UI

| Option | Description | Selected |
|--------|-------------|----------|
| Expandable | Expandable section below video card or modal when clicking notes icon | |
| Modal | Modal opens with full notes list and add form | ✓ |
| Separate page | Separate page route for notes view | |

**User's choice:** Modal

---

## Search UX

| Option | Description | Selected |
|--------|-------------|----------|
| Global bar | Search bar at top of dashboard, filters results in place | ✓ |
| Per-section | Each section (videos, categories) has its own search | |
| Separate page | Separate search page with advanced filters | |

**User's choice:** Global bar (Recommended)

---

## Category filtering

| Option | Description | Selected |
|--------|-------------|----------|
| Sidebar | Sidebar with checkbox list, filters dashboard results | ✓ |
| Dropdown | Dropdown menu in header, quick filter switch | |
| Tag pills | Clickable tag pills, toggles active filters | |

**User's choice:** Sidebar (Recommended)

---

## External player handling

| Option | Description | Selected |
|--------|-------------|----------|
| New tab with timestamp | Opens YouTube link in new tab with timestamp param for notes | ✓ |
| Copy link | Copy YouTube link to clipboard | |
| In-app | Embedded player (if possible) | |

**User's choice:** New tab with timestamp

---

## the agent's Discretion

- Exact grid columns (responsive breakpoints)
- Modal styling and animations
- Search debounce timing
- Sidebar toggle behavior (always visible vs collapsible)

---

## Deferred Ideas

- PWA support — future phase
- Channel sync — v2 feature
- Export functionality — v2 feature
