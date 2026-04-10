# Phase 1: Foundation - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-10
**Phase:** 01-foundation
**Areas discussed:** Repository pattern, Project structure, Database schema, SQLite persistence, Architecture

---

## Repository Pattern

| Option | Description | Selected |
|--------|------------|----------|
| Single repository | Video and Category in one repository — simpler for Phase 1 | |
| Separate repos | Separate repositories for each entity — better as app grows, more code upfront | ✓ |

**User's choice:** Separate repos

---

## Project Structure

| Option | Description | Selected |
|--------|------------|----------|
| Feature-grouped | src/ui, src/data, src/core, src/lib | ✓ |

**User's choice:** Feature-grouped structure

---

## Stack

| Option | Description | Selected |
|--------|------------|----------|
| Keep Vue.js | Vue 3 + Vite + TypeScript + sql.js | |
| Use React | React 19 + Vite + TypeScript + Tailwind | ✓ |

**User's choice:** React stack

---

## Architecture Change (Post-initial)

| Option | Description | Selected |
|--------|------------|----------|
| Single frontend | React only (original plan) | |
| Backend + Frontend | FastAPI backend + React frontend in separate directories | ✓ |

**User's choice:** Separate /backend (FastAPI) and /frontend (React) directories
**Notes:** User requested backend/frontend separation after initial discuss

---

## Database Schema

| Option | Description | Selected |
|--------|------------|----------|
| Simple schema | videos, categories, video_categories tables | ✓ |
| Extended schema | Additional fields for search, notes | |

**User's choice:** Simple schema

---

## SQLite Persistence (Updated for backend architecture)

| Option | Description | Selected |
|--------|------------|----------|
| On every write | Auto-save after every database write | ✓ |
| Periodic | Batch save | |

**User's choice:** On every write (now handled by FastAPI backend)

---

## the agent's Discretion

- Exact file structure within /backend/
- Exact file structure within /frontend/
- API endpoint conventions (RESTful)
- Component naming patterns

## Deferred Ideas

- PWA support — future phase
- Channel sync — v2 feature
- Export functionality — v2 feature