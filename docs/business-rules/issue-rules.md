# Issue Business Rules

## Creation rules

**Rule:** All four fields (type, severity, description, location) are required to submit.
**Source:** `src/components/issues/IssueForm.tsx:36-54`
**Enforcement:** `validateForm()` — client-side, blocks `handleSubmit` if any field missing.

---

**Rule:** `description` must be non-empty after trimming whitespace.
**Source:** `src/components/issues/IssueForm.tsx:43-45`
**Enforcement:** `validateForm()` checks `!formData.description.trim()`.

---

**Rule:** New issues always get `status: 'reported'` — no other status is valid at creation.
**Source:** `src/store/slices/issuesSlice.ts:72`
**Enforcement:** Hardcoded in `addIssue` thunk; `NewIssue` type excludes `status`.

---

**Rule:** `reportedAt` is always set to `new Date().toISOString()` at creation by the thunk — never provided by the form.
**Source:** `src/store/slices/issuesSlice.ts:73`
**Enforcement:** `NewIssue` type excludes `reportedAt`.

---

**Rule:** IDs must be generated via `generateIssueIdFromState(issues)` — never hardcoded or manually constructed.
**Source:** `src/store/slices/issuesSlice.ts:18-35`
**Enforcement:** `addIssue` thunk calls `generateIssueIdFromState(state.issues.issues)` with current Redux state.

---

**Rule:** ID format is `ISS-{year}-{NNN}` where NNN is zero-padded to 3 digits, derived from `Math.max(...existingNumbers) + 1` for the current year.
**Source:** `src/store/slices/issuesSlice.ts:18-35`
**Enforcement:** `generateIssueIdFromState()` pure function.

## Storage rules

**Rule:** Issues must be stored only in IndexedDB, database `city-issues-db`, version 1, object store `issues`.
**Source:** `src/db/indexedDb.ts:5-7`
**Enforcement:** All persistence goes through `src/db/indexedDb.ts` functions.

---

**Rule:** IndexedDB uses `id` as keyPath — `db.put()` upserts by id.
**Source:** `src/db/indexedDb.ts:23`
**Enforcement:** Object store created with `{ keyPath: 'id' }`.

## Sort order

**Rule:** Issues in Redux state are always sorted newest-first (`reportedAt` descending).
**Source:** `src/store/slices/issuesSlice.ts:54`, `:111`
**Enforcement:** `loadIssues.fulfilled` sorts the full array; `addIssue.fulfilled` prepends the new issue (`[action.payload, ...state.issues]`).

## Filtering rules

**Rule:** Search matches against `id` and `description` fields only (case-insensitive, trimmed).
**Source:** `src/store/selectors/issuesSelectors.ts:36-43`
**Enforcement:** `selectFilteredIssues` memoized selector.

---

**Rule:** Type, status, and severity filters are additive within a dimension (OR logic per dimension), AND across dimensions.
**Source:** `src/store/selectors/issuesSelectors.ts:45-57`
**Enforcement:** `selectFilteredIssues` — each dimension uses `Array.includes`.

---

**Rule:** Filters are stored in URL search params, not in Redux. Params: `search`, `types`, `statuses`, `severities` (comma-separated arrays).
**Source:** `src/components/issues/FilterBar.tsx:99-106`, `src/pages/IssuesList.tsx:29-34`
**Enforcement:** `FilterBar` writes params via `setSearchParams`; `IssuesList` reads and passes to selectors.

## Enum constraints

**Rule:** Valid `IssueType` values: `pothole`, `broken_streetlight`, `graffiti`, `illegal_dumping`, `damaged_sign`, `other`.
**Source:** `src/types/index.ts:1-7`

**Rule:** Valid `Severity` values: `low`, `medium`, `high`, `critical`.
**Source:** `src/types/index.ts:9`

**Rule:** Valid `Status` values: `reported`, `in_progress`, `resolved`, `closed`.
**Source:** `src/types/index.ts:11`

**Rule:** Adding any new enum value requires updating `src/types/index.ts`, all three color maps in `src/data/constants.ts`, and `docs/glossary.md`.
**Source:** convention enforced by TypeScript exhaustiveness (Record types over enums).

## Seed / mock data

**Rule:** When IndexedDB store is empty on `loadIssues`, 5 mock issues are auto-inserted via `getInitialMockData()`.
**Source:** `src/store/slices/issuesSlice.ts:44-49`
**Enforcement:** `loadIssues` thunk checks `issues.length === 0`.
