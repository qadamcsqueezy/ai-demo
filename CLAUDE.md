In all interactions and commit messages be extremely concise and sacrifice grammar for the sake of concision

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A city issue reporting application built with React + TypeScript + Vite. Citizens can report infrastructure issues (potholes, broken streetlights, graffiti, etc.) with location data. Issues are stored locally using IndexedDB for offline-first functionality.

## Development Commands

```bash
# Start development server
npm run dev

# Type-check and build for production
npm run build

# Lint code
npm run lint

# Preview production build
npm run preview
```

## Architecture

### Data Flow

1. **State Management**: Zustand store (`src/store/useIssueStore.ts`) manages issues in memory
2. **Persistence**: IndexedDB (`src/db/indexedDb.ts`) stores issues locally in browser
3. **Initialization**: On first load, mock data is seeded if database is empty

### Key Architectural Patterns

**Issue ID Generation**: Issues use auto-incrementing IDs with format `ISS-{YEAR}-{NUMBER}` (e.g., `ISS-2025-001`). The store's `generateIssueId()` finds the highest number for the current year and increments.

**Offline-First**: All data persists in IndexedDB. The app loads issues from the database on mount via `loadIssues()` in the Zustand store.

**Location Handling**: Issues store lat/lng coordinates and optional address strings. Default map center is Rabat, Morocco (34.0209, -6.8416).

## Core Data Types

Defined in `src/types/index.ts`:

- **IssueType**: `pothole | broken_streetlight | graffiti | illegal_dumping | damaged_sign | other`
- **Severity**: `low | medium | high | critical`
- **Status**: `reported | in_progress | resolved | closed`
- **Issue**: Main entity with id, type, description, location, severity, status, reportedAt
- **NewIssue**: Same as Issue but omits id, status, and reportedAt (auto-generated)

## Tech Stack

- **Frontend**: React 19 with TypeScript
- **Routing**: React Router DOM v7
- **State**: Zustand for global state
- **Storage**: idb (IndexedDB wrapper)
- **Maps**: Leaflet for location selection and visualization
- **Styling**: Tailwind CSS v4 with Vite plugin
- **Build**: Vite with React plugin

## File Structure

- `src/pages/`: Route pages (IssuesList, CreateIssue, IssueDetails)
- `src/components/`: Reusable components organized by domain (issues/, layout/, common/)
- `src/store/`: Zustand store definitions
- `src/db/`: IndexedDB abstraction layer
- `src/data/`: Constants (issue types, severities, statuses) and mock data
- `src/types/`: TypeScript type definitions

## Working with Issues

To add a new issue:
```typescript
const { addIssue } = useIssueStore();
await addIssue({
  type: 'pothole',
  description: 'Large pothole on Main St',
  location: { lat: 34.02, lng: -6.84, address: 'Main St, Rabat' },
  severity: 'high'
});
```

The store automatically assigns id, status ('reported'), and reportedAt timestamp, then persists to IndexedDB.

## Constants and Configuration

All issue type labels, severity levels, status options, and their associated colors are centralized in `src/data/constants.ts`. When adding new issue types or modifying display logic, update these constants.
