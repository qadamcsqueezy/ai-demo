---
title: "Data Model"
description: "Single source of truth for entity schema and persistence"
domain: architecture
tags: [data-model, schema, indexeddb, redux, state, issue, location]
---

# Data Model

## Core entity: `Issue`

Source: `src/types/index.ts:19`

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `id` | `string` | yes | Auto-generated. Format: `ISS-YYYY-###`. See glossary. |
| `type` | `IssueType` | yes | Enum — 6 values. See glossary. |
| `description` | `string` | yes | Free text. Trimmed before save. |
| `location` | `Location` | yes | `{ lat, lng, address? }` |
| `severity` | `Severity` | yes | Enum — 4 values. See glossary. |
| `status` | `Status` | yes | Enum — 4 values. Always `"reported"` on creation. |
| `reportedAt` | `string` | yes | ISO 8601 timestamp, set at creation. Never mutated. |

### `Location` sub-object

Source: `src/types/index.ts:13`

| Field | Type | Required |
|-------|------|----------|
| `lat` | `number` | yes |
| `lng` | `number` | yes |
| `address` | `string` | no |

`address` is only populated in mock seed data; the interactive map sets only `lat`/`lng`.

### `NewIssue` (creation input)

Source: `src/types/index.ts:29`

`Omit<Issue, 'id' | 'status' | 'reportedAt'>` — consumer provides `type`, `description`, `location`, `severity`.

---

## Persistence: IndexedDB

- **Database**: `city-issues-db` version `1`
- **Object store**: `issues`, keyPath = `id`
- **Singleton**: one `IDBPDatabase` instance cached in `dbInstance` variable
- Source: `src/db/indexedDb.ts`

### CRUD operations

| Function | Signature | Notes |
|----------|-----------|-------|
| `getDB()` | `() => Promise<IDBPDatabase>` | Opens or returns cached DB |
| `getAllIssues()` | `() => Promise<Issue[]>` | Returns unsorted array |
| `getIssueById(id)` | `(string) => Promise<Issue \| undefined>` | |
| `addIssue(issue)` | `(Issue) => Promise<string>` | Uses `db.put` — upsert |
| `updateIssue(issue)` | `(Issue) => Promise<void>` | Uses `db.put` |
| `deleteIssue(id)` | `(string) => Promise<void>` | |
| `getIssueCount()` | `() => Promise<number>` | |
| `clearAllIssues()` | `() => Promise<void>` | Dangerous — no confirmation guard |

Note: `addIssue` and `updateIssue` both call `db.put` — they are equivalent at DB level.

---

## Client state: Redux

Source: `src/store/slices/issuesSlice.ts`, `src/store/store.ts`

### `RootState` shape

```
{
  issues: {
    issues: Issue[]     // sorted newest-first by reportedAt
    isLoading: boolean  // true during loadIssues thunk
  }
}
```

### Sort invariant
`issues` array is always sorted descending by `reportedAt`. Enforced in two places:
1. `loadIssues.fulfilled` — sorts before setting state
2. `addIssue.fulfilled` — prepends new issue (newest goes first)

---

## Relationships

This app has no relational data. There is exactly one entity (`Issue`) with no foreign keys.

---

## Seed / mock data

Source: `src/data/mockData.ts:getInitialMockData()`

Five hardcoded issues covering all `IssueType` values. Auto-written to IndexedDB by `loadIssues` thunk when `getAllIssues()` returns empty array. IDs use `ISS-2024-00x` prefix (hardcoded year, not current year).
