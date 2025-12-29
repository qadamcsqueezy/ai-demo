import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import { generateIssueIdFromState } from '../slices/issuesSlice';

// Base selectors
export const selectIssues = (state: RootState) => state.issues.issues;
export const selectIsLoading = (state: RootState) => state.issues.isLoading;

// Memoized selector for getIssueById
export const selectIssueById = createSelector(
  [selectIssues, (_state: RootState, issueId: string) => issueId],
  (issues, issueId) => issues.find((issue) => issue.id === issueId)
);

// Selector for generating next issue ID
export const selectNextIssueId = createSelector(
  [selectIssues],
  (issues) => generateIssueIdFromState(issues)
);
