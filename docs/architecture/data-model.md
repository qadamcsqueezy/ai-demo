# Data Model

## Issue entity

Single entity in the system. No relationships between issues.

| Field         | Type        | Description                                     |
| ------------- | ----------- | ----------------------------------------------- |
| `id`          | `string`    | `ISS-YYYY-NNN` format, auto-generated           |
| `type`        | `IssueType` | Category enum — see glossary                    |
| `description` | `string`    | Free text, trimmed before save, non-empty       |
| `location`    | `Location`  | `{ lat, lng, address? }` — WGS-84               |
| `severity`    | `Severity`  | `low \| medium \| high \| critical`             |
| `status`      | `Status`    | `reported \| in_progress \| resolved \| closed` |
| `reportedAt`  | `string`    | ISO 8601 timestamp, set at creation             |

Source: `src/types/index.ts:19-27`

## Location sub-object

| Field     | Type     | Required |
| --------- | -------- | -------- |
| `lat`     | `number` | yes      |
| `lng`     | `number` | yes      |
| `address` | `string` | no       |

Source: `src/types/index.ts:13-17`

## NewIssue (form input shape)

`Omit<Issue, 'id' | 'status' | 'reportedAt'>` — submitted to the `addIssue` thunk. The thunk augments with `id`, `status: 'reported'`, `reportedAt`.

Source: `src/types/index.ts:29`

## Persistence

- Storage: IndexedDB, database `city-issues-db`, version `1`
- Object store: `issues`, keyPath `id` (string)
- No indexes defined
- Single singleton `dbInstance` (module-level) shared across all calls

Source: `src/db/indexedDb.ts`

## Redux state shape

```ts
{
  issues: {
    issues: Issue[];   // sorted newest-first by reportedAt
    isLoading: boolean;
  }
}
```

Source: `src/store/slices/issuesSlice.ts:7-15`, `src/store/store.ts`

## ID format

`ISS-{currentYear}-{zero-padded-3-digit-sequence}`

Sequence = max of existing year-matched IDs + 1, or 1 if none exist.
Year is re-evaluated on each creation — issues from prior years don't affect the counter for the current year.

Source: `generateIssueIdFromState()` in `src/store/slices/issuesSlice.ts:18-35`
