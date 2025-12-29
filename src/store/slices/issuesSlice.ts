import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Issue, NewIssue } from '../../types';
import { getAllIssues, addIssue as addIssueToDb } from '../../db/indexedDb';
import { getInitialMockData } from '../../data/mockData';

interface IssuesState {
  issues: Issue[];
  isLoading: boolean;
}

const initialState: IssuesState = {
  issues: [],
  isLoading: true,
};

// Helper function for ID generation (pure function)
export function generateIssueIdFromState(issues: Issue[]): string {
  const year = new Date().getFullYear();
  const yearPrefix = `ISS-${year}-`;

  const existingNumbers = issues
    .filter((issue) => issue.id.startsWith(yearPrefix))
    .map((issue) => {
      const numPart = issue.id.replace(yearPrefix, '');
      return parseInt(numPart, 10);
    })
    .filter((num) => !isNaN(num));

  const nextNumber = existingNumbers.length > 0
    ? Math.max(...existingNumbers) + 1
    : 1;

  return `ISS-${year}-${String(nextNumber).padStart(3, '0')}`;
}

// Async Thunks
export const loadIssues = createAsyncThunk(
  'issues/loadIssues',
  async (_, { rejectWithValue }) => {
    try {
      let issues = await getAllIssues();

      // Auto-populate mock data if empty
      if (issues.length === 0) {
        const mockData = getInitialMockData();
        for (const issue of mockData) {
          await addIssueToDb(issue);
        }
        issues = mockData;
      }

      // Sort by reportedAt descending (newest first)
      issues.sort((a, b) => new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime());

      return issues;
    } catch (error) {
      console.error('Error loading issues:', error);
      return rejectWithValue('Failed to load issues');
    }
  }
);

export const addIssue = createAsyncThunk(
  'issues/addIssue',
  async (newIssue: NewIssue, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { issues: IssuesState };
      const id = generateIssueIdFromState(state.issues.issues);

      const issue: Issue = {
        ...newIssue,
        id,
        status: 'reported',
        reportedAt: new Date().toISOString(),
      };

      await addIssueToDb(issue);
      return issue;
    } catch (error) {
      console.error('Error adding issue:', error);
      return rejectWithValue('Failed to add issue');
    }
  }
);

// Slice
const issuesSlice = createSlice({
  name: 'issues',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // loadIssues
      .addCase(loadIssues.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loadIssues.fulfilled, (state, action: PayloadAction<Issue[]>) => {
        state.issues = action.payload;
        state.isLoading = false;
      })
      .addCase(loadIssues.rejected, (state) => {
        state.isLoading = false;
      })
      // addIssue
      .addCase(addIssue.pending, () => {
        // No state change on pending
      })
      .addCase(addIssue.fulfilled, (state, action: PayloadAction<Issue>) => {
        // Prepend to maintain sort order
        state.issues = [action.payload, ...state.issues];
      })
      .addCase(addIssue.rejected, () => {
        // Error already logged in thunk
      });
  },
});

export default issuesSlice.reducer;
