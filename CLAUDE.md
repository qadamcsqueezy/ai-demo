In all interactions and commit messages be extremely concise and sacrifice grammar for the sake of concision

# IMPORTANT
Whenever you change something in the tech stack make sure that you update the "Tech Stack" section in the CLAUDE.MD file

# CLAUDE.md
This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

City Issue Reporter is a React-based web application for reporting and tracking city infrastructure issues (potholes, broken streetlights, graffiti, etc.). The app runs entirely in the browser with offline support using IndexedDB for data persistence.

**Location Context**: The application is centered on Rabat, Morocco (34.0209, -6.8416) with map integration for issue locations.

## Development Commands

```bash
# Start development server with HMR
npm run dev

# Build for production (runs TypeScript compiler then Vite build)
npm run build

# Run ESLint
npm run lint

# Preview production build
npm run preview
```

## Architecture

### State Management (Redux Toolkit)

The application uses Redux Toolkit for global state management. All issue-related state is managed in `src/store/`:

- **Store**: `src/store/store.ts` - RTK store configuration
- **Slice**: `src/store/slices/issuesSlice.ts` - Issues state, reducers, and async thunks
- **Selectors**: `src/store/selectors/issuesSelectors.ts` - Memoized selectors
- **Hooks**: `src/store/hooks.ts` - Typed Redux hooks

**Key Thunks**:
  - `loadIssues()`: Async thunk that loads from IndexedDB, auto-populates mock data if empty
  - `addIssue()`: Async thunk that creates new issue with auto-generated ID (format: `ISS-YYYY-###`)

**Key Selectors**:
  - `selectIssueById(state, id)`: Retrieves specific issue from state
  - `selectNextIssueId(state)`: Year-based sequential ID generation

**Important**: The store maintains issues sorted by `reportedAt` (newest first). New issues are prepended to maintain sort order.

### Data Persistence (IndexedDB)

All data is stored client-side using the `idb` library wrapper around IndexedDB:

- **Database**: `city-issues-db` (version 1)
- **Object Store**: `issues` with `id` as keyPath
- **Location**: `src/db/indexedDb.ts`
- **Pattern**: Singleton DB instance (`dbInstance`) cached after first access

**Critical**: The store initializes with mock data on first load if the database is empty. This happens automatically in `loadIssues()`.

### Routing Structure

React Router v7 with the following routes:
- `/` → redirects to `/issues`
- `/issues` → Issues list view (`IssuesList.tsx`)
- `/issues/create` → Create new issue form (`CreateIssue.tsx`)
- `/issues/:id` → Issue detail view (`IssueDetails.tsx`)

### Type System

Core types defined in `src/types/index.ts`:

```typescript
IssueType: "pothole" | "broken_streetlight" | "graffiti" | "illegal_dumping" | "damaged_sign" | "other"
Severity: "low" | "medium" | "high" | "critical"
Status: "reported" | "in_progress" | "resolved" | "closed"
```

**Issue Model**:
- Auto-generated `id` (ISS-YYYY-###)

### Map Integration (Leaflet)

The app uses Leaflet for interactive maps:
- Component: `src/components/issues/IssueMap.tsx`
- Default center: Rabat coordinates from `src/data/constants.ts`
- Click-to-select location functionality for issue creation
- Markers display issue locations on list/detail views

### UI Styling

- **Framework**: Tailwind CSS v4 (Vite plugin)
- **Color System**: Semantic colors defined in `src/data/constants.ts`
  - `STATUS_COLORS`: Status-based badge colors
  - `SEVERITY_COLORS`: Severity level colors
  - `ISSUE_TYPE_COLORS`: Issue type categorization colors

## Component Organization

```
src/
├── components/
│   ├── common/       # Reusable UI (Button, etc.)
│   ├── issues/       # Issue-specific (IssueCard, IssueMap, IssueForm, StatusBadge)
│   └── layout/       # Layout components (Header)
├── pages/            # Route components
├── store/            # Redux Toolkit store
│   ├── slices/       # Redux slices
│   ├── selectors/    # Memoized selectors
│   ├── store.ts      # Store configuration
│   └── hooks.ts      # Typed hooks
├── db/               # IndexedDB operations
├── data/             # Constants and mock data
└── types/            # TypeScript definitions
```

## Key Implementation Details

### Issue ID Generation

IDs follow the pattern `ISS-YYYY-###` where:
- `YYYY` is the current year
- `###` is a zero-padded sequential number (resets each year)
- Generation logic scans existing IDs to find the next available number

### Data Flow

1. **Load**: `dispatch(loadIssues())` → `indexedDb.getAllIssues()` → Sort & set state
2. **Create**: Form submission → `dispatch(addIssue())` → `indexedDb.addIssue()` → Prepend to state
3. **Read**: Components access via `useAppSelector()` with selectors

### Initial Data

`src/data/mockData.ts` contains `getInitialMockData()` which generates sample issues. This is automatically loaded on first app initialization when IndexedDB is empty.

## Tech Stack

- **React 19** with TypeScript
- **Vite 7** for build tooling and HMR
- **React Router 7** for client-side routing
- **Redux Toolkit 2** with React Redux 9 for state management
- **IndexedDB** (via `idb` v8) for persistence
- **Leaflet 1.9** for maps
- **Tailwind CSS 4** for styling
- **ESLint 9** with TypeScript ESLint for linting
