---
title: "Issue Detail"
description: "Read-only view of a single issue with static map"
domain: issues
related_docs:
  - docs/business-rules/issue-rules.md
  - docs/features/map.md
tags: [issue, detail, view, read-only, map]
---

# Issue Detail

## What it does
Displays all fields of a single issue: type/status/severity badges, reported date, description, and a non-interactive map centered on the issue location. Navigation back to the list is available.

## Functional & business requirements

### User-facing requirements
- A user must be able to view a single issue by navigating to `/issues/:id`.
- A user must see the issue's type, status, and severity as colored badges.
- A user must see the reported date formatted as "Wednesday, January 15, 2025".
- A user must see the full description (no truncation, preserving newlines via `whitespace-pre-wrap`).
- A user must see a static (non-interactive) map centered on the issue location at zoom level 15.
- A user must see the coordinates and address (if available) below the map.
- A user must see a "Not found" screen if the issue ID doesn't exist.
- A user must be able to navigate back to the list.

### Business constraints
- The detail view is read-only — no editing or status change UI exists. [NEEDS CONFIRMATION — future requirement?]
- If the store is empty when the user lands directly on a detail URL, `loadIssues()` is dispatched automatically.

### Acceptance criteria
- [ ] `/issues/ISS-2025-001` renders the issue with id `ISS-2025-001`
- [ ] Date displays in full format (weekday, month, day, year)
- [ ] Static map renders centered on issue coordinates at zoom 15 with a marker
- [ ] Navigating directly to a detail URL (cold load) correctly loads the issue
- [ ] Unknown ID shows "Issue not found" state with Back button
- [ ] Loading state shows "Loading issue details..." while thunk is in-flight

### Edge cases with business impact
- Direct URL navigation: `IssueDetails` dispatches `loadIssues()` if `issues.length === 0`. If issues exist in Redux (navigated from list), no re-fetch occurs.
- `StaticMap` has all interactions disabled (`dragging: false`, `zoomControl: false`, `scrollWheelZoom: false`, `doubleClickZoom: false`, `touchZoom: false`).

### Open questions / assumptions
- [ ] Should there be a way to update issue status from the detail page? [NEEDS CONFIRMATION]

## User roles
| Role | Can do | Cannot do |
|------|--------|-----------|
| Any visitor | View issue details | Edit any field |

## Business rules
→ See `docs/business-rules/issue-rules.md`. Do NOT restate here.

## Key source files
| File | Purpose | Key functions |
|------|---------|---------------|
| `src/pages/IssueDetails.tsx` | Route component, data load guard, render | `formatDate` |
| `src/store/selectors/issuesSelectors.ts` | Issue lookup | `selectIssueById` |
| `src/components/issues/IssueMap.tsx` | Static map display | `StaticMap` |
| `src/components/issues/StatusBadge.tsx` | Badge rendering | `StatusBadge`, `SeverityBadge`, `TypeBadge` |

## Related features
- `docs/features/map.md`
- `docs/features/issue-filtering.md`
