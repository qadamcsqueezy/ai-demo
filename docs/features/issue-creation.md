---
title: Issue Creation
description: Form flow for reporting a new city infrastructure issue
domain: issues
related_docs:
  - docs/business-rules/issue-rules.md
  - docs/architecture/data-model.md
tags: [create, report, form, IssueForm, addIssue, NewIssue, validation]
---

# Issue Creation

## What it does

Citizens fill in a four-field form (type, severity, location via map click, description) and submit. The app generates an ID, timestamps the issue, sets status to `reported`, persists to IndexedDB, updates Redux state, and redirects to the list.

## Functional & business requirements

### User-facing requirements

- A citizen must be able to select an issue type from a fixed dropdown.
- A citizen must be able to select severity via radio-style buttons.
- A citizen must be able to pick a location by clicking on an interactive Leaflet map.
- A citizen must be able to write a free-text description.
- The form must display the auto-generated ID (read-only) before submission.
- Submitting with any field missing must show inline field-level error messages.
- On success, the app must redirect to `/issues`.

### Business constraints

- All four fields are required — no partial submissions. → `docs/business-rules/issue-rules.md`
- Status is always `reported` on creation. → `docs/business-rules/issue-rules.md`
- ID is always auto-generated. → `docs/business-rules/issue-rules.md`

### Acceptance criteria

- [ ] Form renders with a read-only preview ID matching the next `ISS-YYYY-NNN` value
- [ ] Submitting empty form shows errors on all four fields
- [ ] Valid submission creates issue in IndexedDB and prepends to Redux state
- [ ] Redirect to `/issues` after successful submit
- [ ] Cancel button navigates back to `/issues` without creating an issue
- [ ] Submit button shows "Reporting..." and is disabled during async thunk

### Edge cases with business impact

- If `addIssue` thunk rejects, `isSubmitting` is reset but no error is shown to the user — form stays open. [NEEDS CONFIRMATION: should an error toast appear?]
- If the user refreshes mid-form, all input is lost (no draft persistence).

## User roles

| Role    | Can do               | Cannot do                           |
| ------- | -------------------- | ----------------------------------- |
| Citizen | Fill and submit form | Edit existing issues, change status |

## Business rules

→ See `docs/business-rules/issue-rules.md`

## Key source files

| File                                     | Purpose                 | Key functions/components               |
| ---------------------------------------- | ----------------------- | -------------------------------------- |
| `src/pages/CreateIssue.tsx`              | Route shell             | `CreateIssue` page                     |
| `src/components/issues/IssueForm.tsx`    | Form logic + validation | `IssueForm`, `validateForm`            |
| `src/components/issues/IssueMap.tsx`     | Map picker              | `InteractiveMap`                       |
| `src/store/slices/issuesSlice.ts`        | Thunk + ID gen          | `addIssue`, `generateIssueIdFromState` |
| `src/store/selectors/issuesSelectors.ts` | Preview ID              | `selectNextIssueId`                    |
| `src/data/constants.ts`                  | Form option lists       | `ISSUE_TYPES`, `SEVERITIES`            |
| `src/types/index.ts`                     | Types                   | `NewIssue`, `IssueType`, `Severity`    |

## Related features

- `docs/features/map.md` — InteractiveMap behavior
- `docs/features/issue-filtering.md` — list the issue lands in after creation
