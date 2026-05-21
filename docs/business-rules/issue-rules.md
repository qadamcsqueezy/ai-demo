---
title: "Issue Business Rules"
description: "All constraints on issue creation, validation, ID generation, and status"
domain: issues
tags: [business-rules, validation, id, status, issue, constraints]
---

# Issue Business Rules

Single source of truth. Feature docs link here; they do not restate rules.

---

## Creation rules

**Rule:** All four fields (`type`, `severity`, `description`, `location`) are required to submit a new issue.
**Source:** `src/components/issues/IssueForm.tsx:36`
**Enforcement:** `validateForm()` runs on submit; returns `false` and sets field errors if any are missing.

**Rule:** `description` must be non-empty after whitespace trim.
**Source:** `src/components/issues/IssueForm.tsx:44`
**Enforcement:** `!formData.description.trim()` check in `validateForm()`.

**Rule:** `location` must be explicitly selected via map click; it cannot be null.
**Source:** `src/components/issues/IssueForm.tsx:48`
**Enforcement:** `!formData.location` check in `validateForm()`.

**Rule:** New issues always start with `status: 'reported'`. No other status may be set at creation.
**Source:** `src/store/slices/issuesSlice.ts:72`
**Enforcement:** Hard-coded in `addIssue` thunk: `status: 'reported'`.

**Rule:** `reportedAt` is set to `new Date().toISOString()` at creation inside the thunk; the form never provides it.
**Source:** `src/store/slices/issuesSlice.ts:75`
**Enforcement:** `NewIssue` type omits `reportedAt`; value set in thunk.

**Rule:** `description` is trimmed before saving: `formData.description.trim()`.
**Source:** `src/components/issues/IssueForm.tsx:67`
**Enforcement:** Applied in `handleSubmit` before dispatching.

---

## ID generation rules

**Rule:** Issue IDs follow the format `ISS-YYYY-###` where `YYYY` is the current year and `###` is a zero-padded 3-digit integer.
**Source:** `src/store/slices/issuesSlice.ts:18`
**Enforcement:** `generateIssueIdFromState()` constructs the ID.

**Rule:** The sequential counter is derived from existing IDs with the current year prefix — takes `max + 1`. Resets each calendar year.
**Source:** `src/store/slices/issuesSlice.ts:22`
**Enforcement:** Filters IDs by `ISS-{year}-` prefix, parses the numeric part, returns `max + 1` or `1` if none exist.

**Rule:** ID generation reads current Redux state (not IndexedDB) to avoid async round-trips.
**Source:** `src/store/slices/issuesSlice.ts:69`
**Enforcement:** `getState()` called inside the thunk.

---

## Status rules

**Rule:** Valid statuses are `"reported"`, `"in_progress"`, `"resolved"`, `"closed"`.
**Source:** `src/types/index.ts:11`

**Rule:** No status transitions are enforced in code — status updates are not implemented. [NEEDS CONFIRMATION — no update UI exists]

---

## Filtering rules

**Rule:** Search matches on `id` or `description` (case-insensitive, substring match after trim).
**Source:** `src/store/selectors/issuesSelectors.ts:36`
**Enforcement:** Applied in `selectFilteredIssues` selector.

**Rule:** Type, status, and severity filters are additive within each dimension (OR within group). Multiple active dimensions are AND-combined.
**Source:** `src/store/selectors/issuesSelectors.ts:46`
**Enforcement:** Sequential `.filter()` calls in `selectFilteredIssues`.

**Rule:** Filters are stored in URL search params, not Redux. Params: `search`, `types` (comma-separated), `statuses` (comma-separated), `severities` (comma-separated).
**Source:** `src/components/issues/FilterBar.tsx:16`
**Enforcement:** `setSearchParams` on every filter change.

---

## Persistence rules

**Rule:** Issues are persisted to IndexedDB immediately on creation (before Redux state update).
**Source:** `src/store/slices/issuesSlice.ts:78`
**Enforcement:** `await addIssueToDb(issue)` in `addIssue` thunk before returning.

**Rule:** On first app load, if IndexedDB is empty, five mock issues are seeded automatically.
**Source:** `src/store/slices/issuesSlice.ts:45`
**Enforcement:** `if (issues.length === 0)` check in `loadIssues` thunk.

**Rule:** `addIssue` in IndexedDB uses `db.put` (upsert) — will silently overwrite an existing record with the same ID.
**Source:** `src/db/indexedDb.ts:43`
**Enforcement:** None — caller must ensure unique ID.
