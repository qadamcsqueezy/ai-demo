# Workflow: Browse Issues

## Trigger

User navigates to `/issues` (app root redirects here).

## Steps

### 1. Page mounts

- `IssuesList` dispatches `loadIssues()` via `useEffect`
- `isLoading` is `true` → renders "Loading issues..." spinner

### 2. loadIssues thunk

- Calls `getAllIssues()` from IndexedDB
- If result is empty → inserts 5 mock issues via `getInitialMockData()` + `addIssueToDb()`
- Sorts all issues by `reportedAt` descending (newest first)
- Returns sorted array

### 3. State update

- `loadIssues.fulfilled` → `state.issues = payload`, `state.isLoading = false`

### 4. List renders

- If `allIssues.length === 0` (shouldn't happen post-seed): empty state with "Report New Issue" CTA
- Otherwise: `FilterBar` + issue count text + list of `IssueCard` components

### 5. Filtering (optional)

- User interacts with `FilterBar` → URL params update (`?search=`, `?types=`, `?statuses=`, `?severities=`)
- `IssuesList` re-reads params, passes to `selectFilteredIssues` + `selectFilterStats`
- List re-renders with filtered results; count text updates

### 6. Navigate to detail

- User clicks an `IssueCard` → `navigate('/issues/:id')`
- → See `docs/workflows/report-issue.md` for create flow from the list

## Business rules applied in this flow

→ See `docs/business-rules/issue-rules.md`
