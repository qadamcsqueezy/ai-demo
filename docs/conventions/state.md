---
title: "State Management Conventions"
description: "Redux Toolkit patterns, selector usage, thunk patterns, and what lives where"
domain: conventions
tags: [redux, state, selectors, thunks, hooks, indexeddb]
---

# State Management Conventions

## What lives where

| State type | Location | Why |
|------------|----------|-----|
| Issue list + loading flag | Redux (`IssuesState`) | Shared across pages |
| Filter values | URL search params | Shareable/bookmarkable, not persisted to Redux |
| Form local state | `useState` in `IssueForm` | Not shared, ephemeral |
| Map instances/markers | `useRef` in `IssueMap` | DOM refs, not serializable |

**Never put filter state in Redux.** The filter is derived by reading `useSearchParams()` and selecting with `selectFilteredIssues`.

## Typed hooks

Always use `useAppDispatch` and `useAppSelector` from `src/store/hooks.ts`. Never import raw `useDispatch`/`useSelector` from `react-redux` in components.

## Async thunks

Both thunks live in `src/store/slices/issuesSlice.ts`.

| Thunk | Purpose | IndexedDB op |
|-------|---------|-------------|
| `loadIssues()` | Load all issues; seed mock if empty; sort | `getAllIssues()`, `addIssue()` (seed only) |
| `addIssue(newIssue: NewIssue)` | Generate ID, set defaults, persist | `addIssue()` |

**`loadIssues` guard**: `IssueDetails` only dispatches if `issues.length === 0` — avoids redundant reload if navigating from list. `IssuesList` always dispatches on mount.

## Selectors

Source: `src/store/selectors/issuesSelectors.ts`

| Selector | Args | Returns |
|----------|------|---------|
| `selectIssues` | state | `Issue[]` |
| `selectIsLoading` | state | `boolean` |
| `selectIssueById` | state, `id: string` | `Issue \| undefined` |
| `selectNextIssueId` | state | `string` |
| `selectFilteredIssues` | state, `FilterParams` | `Issue[]` |
| `selectFilterStats` | state, `FilterParams` | `{ total: number; hasActiveFilters: boolean }` |

All multi-arg selectors use `createSelector` for memoization. Always pass `FilterParams` object constructed from URL params, not from Redux.

## ID generation

`generateIssueIdFromState(issues: Issue[]): string` — pure function, exported from slice for use in selectors. Scans existing IDs for current year, takes `max + 1`. Zero-pads to 3 digits.

## State sort invariant

The `issues` array in Redux is always sorted newest-first by `reportedAt`. Maintained by:
1. `loadIssues.fulfilled` — calls `.sort()` before setting
2. `addIssue.fulfilled` — prepends: `[action.payload, ...state.issues]`

Never sort in selectors or components — rely on this invariant.

## Error handling

Thunks use `rejectWithValue(string)` and `console.error`. No error state is stored in Redux — components do not display thunk errors. [NEEDS CONFIRMATION — no error UI exists]
