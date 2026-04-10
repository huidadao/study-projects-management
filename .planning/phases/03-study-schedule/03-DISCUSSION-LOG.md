# Phase 3: Study Schedule - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-10
**Phase:** 03-study-schedule
**Areas discussed:** Scheduling model, Dashboard integration, Progress tracking

---

## Scheduling Model

| Option | Description | Selected |
|--------|-------------|----------|
| Same database (SQLite) | Store schedule in SQLite — same database, simple operations | ✓ |
| Separate schedule table | Separate schedule storage — more flexible but adds complexity | |

**User's choice:** Same database (SQLite)
**Notes:** Keep operations simple within existing SQLite database

---

## Scheduling Type

| Option | Description | Selected |
|--------|-------------|----------|
| One-time only | Schedule a video for a specific date — simpler, meets core needs | |
| Recurring support | Can schedule a video to watch multiple times — e.g., weekly review | ✓ |

**User's choice:** Recurring support
**Notes:** Need ability to schedule for daily study routine

---

## Recurring Patterns

| Option | Description | Selected |
|--------|-------------|----------|
| Daily | Schedule repeats every day until completed — good for daily study routine | ✓ |
| Weekly | Schedule repeats every week — e.g., every Monday | |
| Custom (every N days) | Set any interval in days | |

**User's choice:** Daily
**Notes:** For daily study routine

---

## Dashboard Integration

| Option | Description | Selected |
|--------|-------------|----------|
| Dedicated section at top | Scheduled section above the video grid — quick access | ✓ |
| Badges on cards | Badges on video cards — shows next scheduled date | |
| Scheduled first sorting | Sort scheduled first — upcoming at top | |

**User's choice:** Dedicated section at top
**Notes:** Quick access to upcoming scheduled videos

---

## Progress Tracking

| Option | Description | Selected |
|--------|-------------|----------|
| Manual mark only | User manually clicks 'Mark Complete' button — simple, explicit | |
| Auto (watched = completed) | Mark watched = completed — when user toggles watched, updates schedule | |
| Completion history | Keep history of all completions with timestamps | ✓ |

**User's choice:** Completion history
**Notes:** Track each completion with timestamp

---

## the agent's Discretion

- Frontend component structure (separate UpcomingSchedule component vs integrate into Dashboard)
- Specific date picker component (native HTML date input vs custom calendar)
- Recurring pattern storage format in database

## Deferred Ideas

- Weekly recurring pattern — future phase
- Custom N-day interval for recurring — future phase
- Auto-progress when watched toggle used — future phase