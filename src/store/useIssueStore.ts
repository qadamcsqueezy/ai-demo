import { create } from 'zustand';
import type { Issue, NewIssue } from '../types';
import { getAllIssues, addIssue as addIssueToDb } from '../db/indexedDb';
import { getInitialMockData } from '../data/mockData';

interface IssueStore {
  issues: Issue[];
  isLoading: boolean;

  loadIssues: () => Promise<void>;
  addIssue: (issue: NewIssue) => Promise<void>;
  getIssueById: (id: string) => Issue | undefined;
  generateIssueId: () => string;
}

export const useIssueStore = create<IssueStore>((set, get) => ({
  issues: [],
  isLoading: true,

  loadIssues: async () => {
    set({ isLoading: true });
    try {
      let issues = await getAllIssues();

      // If no issues exist, add mock data
      if (issues.length === 0) {
        const mockData = getInitialMockData();
        for (const issue of mockData) {
          await addIssueToDb(issue);
        }
        issues = mockData;
      }

      // Sort by reportedAt descending (newest first)
      issues.sort((a, b) => new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime());

      set({ issues, isLoading: false });
    } catch (error) {
      console.error('Error loading issues:', error);
      set({ isLoading: false });
    }
  },

  addIssue: async (newIssue: NewIssue) => {
    const id = get().generateIssueId();
    const issue: Issue = {
      ...newIssue,
      id,
      status: 'reported',
      reportedAt: new Date().toISOString(),
    };

    await addIssueToDb(issue);

    set((state) => ({
      issues: [issue, ...state.issues],
    }));
  },

  getIssueById: (id: string) => {
    return get().issues.find((issue) => issue.id === id);
  },

  generateIssueId: () => {
    const year = new Date().getFullYear();
    const issues = get().issues;

    // Find the highest issue number for this year
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
  },
}));
