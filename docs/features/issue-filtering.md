---
title: Issue Filtering
description: Search and multi-select filter controls on the issue list page
domain: issues
related_docs:
  - docs/business-rules/issue-rules.md
tags:
  [
    filter,
    search,
    FilterBar,
    selectFilteredIssues,
    URL params,
    types,
    statuses,
    severities,
  ]
---

# Issue Filtering

## What it does

On the issues list, citizens can narrow results by free-text search (matches ID or description) and/or by multi-select dropdowns for type, status, and severity. Filter state lives in URL params so results are shareable/bookmarkable. Active filter count is shown on each dropdown button.

## Functional & business requirements

### User-facing requirements

- A citizen must be able to type in a search box to filter by issue ID or description text.
- A citizen must be able to select multiple types, statuses, and/or severities via dropdown checkboxes.
- Active filters must be visually indicated (blue border + count on dropdown buttons).
- A "Clear all" button must appear when any filter is active and reset all filters.
- Filtered count ("Showing X of Y issues") must display when filters are active.
- Filter state must survive page reload (stored in URL).

### Business constraints

- Search matches `id` and `description` fields only — not type, status, severity, location.
- Multi-value filters within the same dimension use OR logic; across dimensions use AND.
- Filtering never mutates Redux state — uses memoized selectors.

### Acceptance criteria

- [ ] Typing in search box updates URL `?search=` and narrows the list in real time
- [ ] Selecting a type from the dropdown updates URL `?types=` and filters list
- [ ] Multiple values in same dimension all show (OR)
- [ ] Values across dimensions must all match (AND)
- [ ] "Clear all" removes all params and restores full list
- [ ] Empty filter result shows "No issues match your filters" message
- [ ] Refreshing with filter params in URL re-applies filters

### Edge cases

- If all filters are cleared but `?search=` param remains as empty string, `parseArrayParam` / trim guards return empty — treated as no filter.

## User roles

| Role    | Can do               | Cannot do                                      |
| ------- | -------------------- | ---------------------------------------------- |
| Citizen | Filter/search issues | Save named filters, persist filters beyond URL |

## Business rules

→ See `docs/business-rules/issue-rules.md`

## Key source files

| File                                     | Purpose                               | Key functions/components                                    |
| ---------------------------------------- | ------------------------------------- | ----------------------------------------------------------- |
| `src/components/issues/FilterBar.tsx`    | Filter UI, URL param writes           | `FilterBar`, `MultiSelectDropdown`                          |
| `src/pages/IssuesList.tsx`               | Reads URL params, passes to selectors | `IssuesList`                                                |
| `src/store/selectors/issuesSelectors.ts` | Filtering logic                       | `selectFilteredIssues`, `selectFilterStats`, `FilterParams` |
| `src/data/constants.ts`                  | Dropdown options                      | `ISSUE_TYPES`, `STATUSES`, `SEVERITIES`                     |

## Related features

- `docs/features/issue-creation.md`
- `docs/features/issue-detail.md`
