---
title: "Testing Conventions"
description: "Current test coverage status and guidance"
domain: conventions
tags: [testing, coverage, jest, vitest]
---

# Testing Conventions

## Current state

No test files exist in the codebase. No testing framework is installed (`package.json` has no jest, vitest, testing-library, or cypress dependency).

[NEEDS CONFIRMATION — intentional omission or planned addition?]

## What should be tested when added

Based on the codebase structure, priority order:

1. **`generateIssueIdFromState()`** (`src/store/slices/issuesSlice.ts:18`) — pure function, easy to unit test. Critical: year rollover, empty array, gaps in sequence.
2. **`selectFilteredIssues`** — pure memoized selector. Test each filter dimension independently and in combination.
3. **`validateForm()`** in `IssueForm` — currently inline, would need extraction to test independently.
4. **IndexedDB thunks** — `loadIssues`, `addIssue`. Requires mocking `idb` or using a fake IndexedDB.

## Recommended stack (if added)

Vitest (matches Vite setup), `@testing-library/react`, `@testing-library/user-event`. For IndexedDB: `fake-indexeddb`.
