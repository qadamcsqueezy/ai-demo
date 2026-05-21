---
title: "Report Issue Workflow"
description: "Step-by-step flow for creating and submitting a new issue"
domain: issues
related_docs:
  - docs/features/issue-creation.md
  - docs/business-rules/issue-rules.md
tags: [workflow, report, create, submit, redirect]
---

# Report Issue Workflow

## Overview

User navigates to the create form, fills it out, and submits. Issue is persisted and user lands on the updated list.

## Steps

### 1. Entry
- User clicks "Report New Issue" button on `/issues` (`IssuesList.tsx:49`)
- React Router navigates to `/issues/create`
- `CreateIssue` renders `Header` + `IssueForm`

### 2. Form render
- `IssueForm` mounts; `selectNextIssueId` reads Redux state and displays predicted ID (read-only)
- `InteractiveMap` initializes centered on Rabat (`34.0209, -6.8416`) zoom 13
- All form fields empty; `errors` empty

### 3. User fills fields
| Field | UI element | State update |
|-------|------------|-------------|
| Type | `<select>` | `setFormData({ type })` |
| Severity | Radio buttons | `setFormData({ severity })` |
| Location | Map click | `onLocationSelect` → `setFormData({ location })` |
| Description | `<textarea>` | `setFormData({ description })` |

### 4. Submit attempt
- User clicks "Report Issue" → `handleSubmit` fires
- `validateForm()` runs synchronously
- **If invalid**: error messages rendered per field, submission stops
- **If valid**: proceed to step 5

For validation rules → `docs/business-rules/issue-rules.md`

### 5. Async dispatch
```
dispatch(addIssue(newIssue))
  → generateIssueIdFromState(state.issues.issues)  // compute ID
  → addIssueToDb(issue)                             // write IndexedDB
  → return issue                                    // resolve thunk
```

### 6. Redux state update
- `addIssue.fulfilled` fires
- New issue prepended to `state.issues.issues`: `[newIssue, ...state.issues]`

### 7. Redirect
- `.unwrap()` resolves
- `navigate('/issues')` called
- User lands on list; new issue appears at top

## Error path
- If `addIssueToDb` throws: thunk calls `rejectWithValue('Failed to add issue')`
- `.unwrap()` throws in `handleSubmit`
- `catch` block: `setIsSubmitting(false)` — user can retry
- No error message displayed to user [NEEDS CONFIRMATION]

## State at each stage

| Stage | Redux `issues` | IndexedDB | URL |
|-------|---------------|-----------|-----|
| Before submit | unchanged | unchanged | `/issues/create` |
| Thunk pending | unchanged | unchanged | `/issues/create` |
| IndexedDB written | unchanged | +new issue | `/issues/create` |
| Thunk fulfilled | +new issue (prepended) | +new issue | `/issues` |

## Cancel path
- User clicks "Cancel" → `navigate('/issues')`
- No state changes; IndexedDB unchanged
