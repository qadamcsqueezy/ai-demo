---
title: "Issue Filtering"
description: "Search and multi-select filter controls on the issues list"
domain: issues
related_docs:
  - docs/business-rules/issue-rules.md
  - docs/conventions/state.md
tags: [filtering, search, list, url-params, filter-bar]
---

# Issue Filtering

## What it does
The issues list exposes a FilterBar with a text search and three multi-select dropdowns (Type, Status, Severity). Filters are persisted in URL search params so they survive page refresh and can be shared via URL. The result count is displayed above the list.

## Functional & business requirements

### User-facing requirements
- A user must be able to search issues by ID or description text (case-insensitive, substring).
- A user must be able to filter by one or more `IssueType` values via a multi-select dropdown.
- A user must be able to filter by one or more `Status` values.
- A user must be able to filter by one or more `Severity` values.
- A user must see how many issues match: "Showing X of Y issues" when filters are active, or "X issues reported" when no filters.
- A user must be able to clear all filters with a single "Clear all" button (visible only when filters are active).
- A user must be able to close a dropdown by clicking outside it.

### Business constraints
- Filters are OR within a dimension, AND across dimensions — e.g., (type=pothole OR broken_streetlight) AND (status=reported). See `docs/business-rules/issue-rules.md`.
- Filter state is URL-only — not in Redux. URL params: `search`, `types`, `statuses`, `severities`.
- The FilterBar is only shown when `allIssues.length > 0` (empty state hides it).

### Acceptance criteria
- [ ] Typing in search box updates URL `?search=` param and filters list in real time
- [ ] Selecting a type in the dropdown adds it to `?types=` param (comma-separated)
- [ ] Deselecting removes it from the param; empty param is removed from URL
- [ ] Active dropdown button shows count: "Type (2)"
- [ ] Active dropdown has blue border (`border-blue-500`)
- [ ] "Clear all" button appears only when at least one filter is active
- [ ] "Clear all" resets URL to no params and shows full list
- [ ] "No issues match your filters" message shown when filtered result is empty
- [ ] URL with filter params can be shared and will restore the same filter state

### Edge cases with business impact
- If a URL has a `types` param with an unrecognized value, it passes through without error (no validation on parse). It simply won't match any issues.

### Open questions / assumptions
- [ ] Should filters persist across navigation? Currently navigating to `/issues/create` and back clears filters if the URL changes. [NEEDS CONFIRMATION]

## User roles
| Role | Can do | Cannot do |
|------|--------|-----------|
| Any visitor | Use all filters | Save filter presets |

## Business rules
→ See `docs/business-rules/issue-rules.md` (filtering rules section). Do NOT restate here.

## Key source files
| File | Purpose | Key functions |
|------|---------|---------------|
| `src/components/issues/FilterBar.tsx` | Filter UI, URL param read/write | `buildURLParams`, `handleToggleType`, `handleSearchChange` |
| `src/store/selectors/issuesSelectors.ts` | Filtered result computation | `selectFilteredIssues`, `selectFilterStats` |
| `src/pages/IssuesList.tsx` | Wires URL params → FilterParams → selectors | `parseArrayParam` |

## Related features
- `docs/features/issue-creation.md`
- `docs/features/issue-detail.md`
