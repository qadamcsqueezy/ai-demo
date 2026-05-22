# City Issue Reporter — Overview

Browser-only app for citizens to report and track city infrastructure problems (potholes, broken streetlights, graffiti, illegal dumping, damaged signs). No backend — all data is stored locally in IndexedDB. Map is centered on Rabat, Morocco.

## Users

Single anonymous role: any citizen visiting the app. No authentication, no roles, no admin panel.

## Tech stack

| Layer        | Library                     | Version |
| ------------ | --------------------------- | ------- |
| UI framework | React                       | 19      |
| Language     | TypeScript                  | ~5.9    |
| Build tool   | Vite                        | 7       |
| Routing      | React Router                | 7       |
| State        | Redux Toolkit / React Redux | 2 / 9   |
| Persistence  | idb (IndexedDB wrapper)     | 8       |
| Maps         | Leaflet                     | 1.9     |
| Styling      | Tailwind CSS                | 4       |
| Linting      | ESLint                      | 9       |

## src/ folder structure

```
src/
  App.tsx              — Route definitions (3 routes)
  main.tsx             — Entry point; mounts Redux Provider + App
  index.css            — Tailwind base import
  types/               — Shared TypeScript types (Issue, IssueType, Severity, Status, Location, NewIssue)
  data/
    constants.ts       — Enum label/color maps, default map center (Rabat)
    mockData.ts        — Seed data auto-loaded when IndexedDB is empty
  db/
    indexedDb.ts       — All IndexedDB operations (getDB, getAllIssues, addIssue, updateIssue, deleteIssue, …)
  store/
    store.ts           — Redux store config
    hooks.ts           — useAppDispatch / useAppSelector typed hooks
    slices/
      issuesSlice.ts   — loadIssues + addIssue thunks, generateIssueIdFromState
    selectors/
      issuesSelectors.ts — selectFilteredIssues, selectIssueById, selectFilterStats, selectNextIssueId
  pages/
    IssuesList.tsx     — /issues route; list + filter UI
    CreateIssue.tsx    — /issues/create route; form shell
    IssueDetails.tsx   — /issues/:id route; detail view
  components/
    common/
      Button.tsx       — Shared button (variant: primary/secondary/outline, size: sm/md/lg)
    layout/
      Header.tsx       — Page header with optional back button and right-action slot
    issues/
      IssueCard.tsx    — Clickable summary card used in list view
      IssueForm.tsx    — Create-issue form with validation
      IssueMap.tsx     — InteractiveMap (click to pin) + StaticMap (read-only display)
      FilterBar.tsx    — Search + multi-select dropdowns; writes to URL params
      StatusBadge.tsx  — StatusBadge, SeverityBadge, TypeBadge colored pill components
```

## Routes

| Path             | Component      | Purpose                  |
| ---------------- | -------------- | ------------------------ |
| `/`              | —              | Redirects to `/issues`   |
| `/issues`        | `IssuesList`   | Browse and filter issues |
| `/issues/create` | `CreateIssue`  | Report a new issue       |
| `/issues/:id`    | `IssueDetails` | View a single issue      |

## Entry points

- Dev: `npm run dev` → Vite HMR server
- Build: `npm run build` → `tsc -b && vite build`
- Entry file: `src/main.tsx`

## External services

- OpenStreetMap tile server (`https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`) — map tiles only, no API key required
- No other external services; no backend, no auth, no analytics
