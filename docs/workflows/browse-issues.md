---
title: "Browse Issues Workflow"
description: "App startup, initial data load, list display, filtering, and navigation to detail"
domain: issues
related_docs:
  - docs/features/issue-filtering.md
  - docs/features/issue-detail.md
  - docs/business-rules/issue-rules.md
tags: [workflow, list, browse, load, filter, navigation]
---

# Browse Issues Workflow

## App startup / initial load

1. `main.tsx` mounts Redux `Provider` wrapping `App`
2. `BrowserRouter` initializes; `/` redirects to `/issues`
3. `IssuesList` mounts; `useEffect` dispatches `loadIssues()`
4. `loadIssues` thunk:
   - Calls `getAllIssues()` from IndexedDB
   - If result is empty: writes 5 mock issues to IndexedDB, uses them as result
   - Sorts by `reportedAt` descending
   - Returns sorted array
5. `loadIssues.fulfilled` sets `state.issues.issues` and `state.isLoading = false`
6. List re-renders with issues

## Loading state
- `isLoading` starts `true`
- `IssuesList` renders "Loading issues..." spinner while `isLoading`
- On `loadIssues.fulfilled` or `loadIssues.rejected`: `isLoading = false`

## Empty state
- If `allIssues.length === 0` after load: "No issues reported yet" + "Report New Issue" button
- In practice: mock seed data prevents this on first launch

## List display
- `FilterBar` renders above the list (only when issues exist)
- `IssueCard` per issue, ordered newest-first
- Clicking a card: `navigate('/issues/${issue.id}')`
- Description truncated to 100 characters in card view

## Filtering flow

1. User interacts with `FilterBar`
2. `FilterBar` calls `setSearchParams(buildURLParams(...))`
3. URL updates (no page reload)
4. `IssuesList` reads new `useSearchParams()` → constructs `FilterParams`
5. `selectFilteredIssues(state, filters)` recomputes (memoized)
6. List re-renders with filtered results
7. Count string updates: "Showing X of Y issues"

For filter rule details → `docs/business-rules/issue-rules.md`

## Detail navigation flow

1. User clicks `IssueCard`
2. `navigate('/issues/${issue.id}')`
3. `IssueDetails` mounts; reads `useParams().id`
4. Checks `issues.length === 0` — if true, dispatches `loadIssues()`
5. `selectIssueById(state, id)` finds issue
6. Renders detail view

## Back navigation
- "Back" button in `Header` calls `navigate(-1)` (browser history back)
- "Back to Issues" button calls `navigate('/issues')` (explicit)
