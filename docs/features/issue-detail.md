---
title: Issue Detail
description: Read-only detail view for a single issue
domain: issues
related_docs:
  - docs/business-rules/issue-rules.md
  - docs/architecture/data-model.md
tags:
  [detail, IssueDetails, StaticMap, selectIssueById, issue not found, badges]
---

# Issue Detail

## What it does

Displays all fields of a single issue: type/status/severity badges, reported date, description, and a read-only static map pin. Navigated to by clicking any `IssueCard`. URL: `/issues/:id`.

## Functional & business requirements

### User-facing requirements

- A citizen must see type, status, and severity badges at the top.
- A citizen must see the formatted reported date ("Monday, January 1, 2025").
- A citizen must see the full description (no truncation).
- A citizen must see a static map centered on the issue location with a pin.
- A citizen must see coordinates (and address if present) below the map.
- A "Back to Issues" button must return to `/issues`.

### Business constraints

- Page is read-only — no editing or status changes available from here.
- If issue not found in Redux state (direct URL navigation before load), `loadIssues` is dispatched automatically.

### Acceptance criteria

- [ ] Navigating to `/issues/:id` for a valid ID renders all issue fields
- [ ] Navigating to `/issues/:id` for an unknown ID shows "Issue not found" state with back button
- [ ] Refreshing the page with a valid `:id` re-loads data from IndexedDB and renders correctly
- [ ] StaticMap renders with zoom 15, interaction disabled, pin on issue coordinates
- [ ] Date formatted as "Weekday, Month Day, Year" (en-US locale)

### Edge cases

- If Redux state is empty (direct URL load), `loadIssues` is dispatched; page shows loading state until complete.
- `isLoading` is true on initial load — header shows "Loading..." during this time.

## User roles

| Role    | Can do                | Cannot do                      |
| ------- | --------------------- | ------------------------------ |
| Citizen | View all issue fields | Edit, delete, or change status |

## Business rules

→ See `docs/business-rules/issue-rules.md`

## Key source files

| File                                     | Purpose                | Key functions/components                    |
| ---------------------------------------- | ---------------------- | ------------------------------------------- |
| `src/pages/IssueDetails.tsx`             | Page shell, load guard | `IssueDetails`, `formatDate`                |
| `src/components/issues/IssueMap.tsx`     | Read-only map          | `StaticMap`                                 |
| `src/components/issues/StatusBadge.tsx`  | Enum badges            | `StatusBadge`, `SeverityBadge`, `TypeBadge` |
| `src/store/selectors/issuesSelectors.ts` | Lookup by ID           | `selectIssueById`                           |

## Related features

- `docs/features/map.md` — StaticMap behavior
- `docs/features/issue-filtering.md` — list view issues link from
