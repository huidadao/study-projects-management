---
phase: 02-core-features
plan: 04
status: completed
started: 2026-04-10
updated: 2026-04-10
---

## Summary

**Gap:** Video creation failed with "Error binding parameter 1: type 'HttpUrl' is not supported"

**Root Cause:** Pydantic's `HttpUrl` type cannot be bound directly to SQLite — the database expects a string.

**Fix:** Use `model_dump(mode='json')` instead of `model_dump()` — the `mode='json'` parameter converts `HttpUrl` to a string URL.

**Verification:** POST `/api/videos` now accepts `HttpUrl` and stores as string.

### Artifacts
- `backend/routers/videos.py` — Video creation with proper type conversion

---
## Self-Check: PASSED