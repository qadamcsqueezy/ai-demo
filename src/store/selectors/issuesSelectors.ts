import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import type { IssueType, Status, Severity } from '../../types';
import { generateIssueIdFromState } from '../slices/issuesSlice';

export interface FilterParams {
  searchText?: string;
  types?: IssueType[];
  statuses?: Status[];
  severities?: Severity[];
}

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

// Selector for filtered issues based on URL params
export const selectFilteredIssues = createSelector(
  [selectIssues, (_state: RootState, filters: FilterParams) => filters],
  (issues, filters) => {
    let filtered = issues;

    // Filter by search text (ID and description)
    if (filters.searchText && filters.searchText.trim()) {
      const search = filters.searchText.toLowerCase().trim();
      filtered = filtered.filter(
        (issue) =>
          issue.id.toLowerCase().includes(search) ||
          issue.description.toLowerCase().includes(search)
      );
    }

    // Filter by types
    if (filters.types && filters.types.length > 0) {
      filtered = filtered.filter((issue) => filters.types!.includes(issue.type));
    }

    // Filter by statuses
    if (filters.statuses && filters.statuses.length > 0) {
      filtered = filtered.filter((issue) => filters.statuses!.includes(issue.status));
    }

    // Filter by severities
    if (filters.severities && filters.severities.length > 0) {
      filtered = filtered.filter((issue) => filters.severities!.includes(issue.severity));
    }

    return filtered;
  }
);

// Selector for filter statistics
export const selectFilterStats = createSelector(
  [selectIssues, (_state: RootState, filters: FilterParams) => filters],
  (allIssues, filters) => {
    const hasActiveFilters =
      (filters.searchText && filters.searchText.trim().length > 0) ||
      (filters.types && filters.types.length > 0) ||
      (filters.statuses && filters.statuses.length > 0) ||
      (filters.severities && filters.severities.length > 0);

    return {
      total: allIssues.length,
      hasActiveFilters,
    };
  }
);
