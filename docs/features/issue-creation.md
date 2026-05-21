---
title: "Issue Creation"
description: "Form for reporting a new city issue"
domain: issues
related_docs:
  - docs/business-rules/issue-rules.md
  - docs/conventions/forms.md
  - docs/conventions/state.md
  - docs/features/map.md
tags: [issue, creation, form, report, submit]
---

# Issue Creation

## What it does
Citizens fill out a form to report a city infrastructure problem. They choose a type, severity, click a map to pin the location, and describe the issue. On submit, the issue is saved to IndexedDB, added to Redux state, and the user is redirected to the issues list.

## Functional & business requirements

### User-facing requirements
- A user must be able to select one `IssueType` from a dropdown of 6 options.
- A user must be able to select one `Severity` from radio buttons (low / medium / high / critical).
- A user must be able to click on an interactive Leaflet map to set the issue location; the selected coordinates are displayed below the map.
- A user must be able to enter a free-text description.
- A user must be able to see the auto-generated ID preview before submitting.
- A user must not be able to submit unless all four required fields are filled.
- A user must see field-level error messages for each missing field.
- A user must be able to cancel and return to the issues list without saving.

### Business constraints
- All four fields are required — see `docs/business-rules/issue-rules.md`
- New issues always start as `status: 'reported'` — see `docs/business-rules/issue-rules.md`
- `description` is trimmed before save — see `docs/business-rules/issue-rules.md`
- Map only captures `lat`/`lng` — `address` is not populated from interactive map selection [NEEDS CONFIRMATION — reverse geocoding not implemented]

### Acceptance criteria
- [ ] Form renders with Issue ID field (disabled, showing next predicted ID)
- [ ] Submitting with any field empty shows the relevant error message
- [ ] Selecting a map location shows coordinates below map
- [ ] Valid submission redirects to `/issues` and new issue appears at top of list
- [ ] New issue has `status: 'reported'` and `reportedAt` set to current timestamp
- [ ] Cancel returns to `/issues` without creating an issue
- [ ] Submit button shows "Reporting..." and is disabled during async submission

### Edge cases with business impact
- If the thunk throws (IndexedDB failure), `isSubmitting` is reset so the user can retry. No error message is shown. [NEEDS CONFIRMATION — silent failure may confuse users]
- Preview ID shown in the form may be stale if another issue was created in another tab between page load and submit. The actual ID is generated fresh in the thunk from current state.

### Open questions / assumptions
- [ ] Should `address` be populated via reverse geocoding? Currently only `lat`/`lng` are saved. [NEEDS CONFIRMATION]
- [ ] Is there a max length for `description`? No constraint in code. [NEEDS CONFIRMATION]

## User roles
| Role | Can do | Cannot do |
|------|--------|-----------|
| Any visitor | Fill and submit the form | Edit/delete after submission |

## Business rules
→ See `docs/business-rules/issue-rules.md`. Do NOT restate here.

## Key source files
| File | Purpose | Key functions |
|------|---------|---------------|
| `src/pages/CreateIssue.tsx` | Route component, layout shell | — |
| `src/components/issues/IssueForm.tsx` | Form state, validation, submission | `validateForm`, `handleSubmit` |
| `src/store/slices/issuesSlice.ts` | Async thunk, ID generation, DB write | `addIssue`, `generateIssueIdFromState` |
| `src/components/issues/IssueMap.tsx` | Interactive map for location pick | `InteractiveMap` |

## Related features
- `docs/features/map.md`
- `docs/features/issue-filtering.md`
