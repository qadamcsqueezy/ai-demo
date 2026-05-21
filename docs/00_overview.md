---
title: "App Overview"
description: "First-read orientation for any session"
domain: global
tags: [overview, architecture, stack, routes, entry-points]
---

# City Issue Reporter — Overview

## What it does
Citizens report city infrastructure problems (potholes, broken streetlights, graffiti, illegal dumping, damaged signs) by picking a location on an interactive map and submitting a form. Issues are listed, filterable, and viewable in detail. No login, no backend — fully client-side.

## Who uses it
Single anonymous user role (citizen/reporter). No authentication, no admin panel. [NEEDS CONFIRMATION — no multi-role logic exists in code]

## Tech stack
| Library | Version | Purpose |
|---------|---------|---------|
| React | 19 | UI rendering |
| TypeScript | ~5.9 | Type safety |
| Vite | 7 | Build / HMR |
| React Router | 7 | Client-side routing |
| Redux Toolkit | 2 | Global state |
| React Redux | 9 | React bindings |
| idb | 8 | IndexedDB wrapper |
| Leaflet | 1.9 | Interactive maps |
| Tailwind CSS | 4 | Utility-class styling |
| ESLint | 9 | Linting |

## `src/` folder structure
```
src/
├── App.tsx              # Route definitions (BrowserRouter + Routes)
├── main.tsx             # Entry point — mounts Provider + App
├── index.css            # Global Tailwind import
├── types/               # TypeScript interfaces and enums (Issue, Location, IssueType, etc.)
├── data/                # Constants (colors, ISSUE_TYPES, coords) + mock seed data
├── db/                  # IndexedDB access layer (idb wrapper, CRUD functions)
├── store/               # Redux Toolkit store, slices, selectors, typed hooks
│   ├── store.ts         # configureStore
│   ├── hooks.ts         # useAppDispatch / useAppSelector typed wrappers
│   ├── slices/          # issuesSlice — async thunks + reducers
│   └── selectors/       # Memoized selectors (filter, byId, nextId, stats)
├── pages/               # Route-level components (IssuesList, CreateIssue, IssueDetails)
└── components/
    ├── common/          # Generic UI (Button)
    ├── issues/          # Domain components (IssueCard, IssueForm, IssueMap, FilterBar, StatusBadge)
    └── layout/          # Header
```

## Entry points
| Concern | File |
|---------|------|
| App bootstrap | `src/main.tsx` |
| Route tree | `src/App.tsx` |
| Redux store | `src/store/store.ts` |
| IndexedDB init | `src/db/indexedDb.ts` (lazy singleton on first `getDB()` call) |

## Routes
| Path | Component | Description |
|------|-----------|-------------|
| `/` | — | Redirects to `/issues` |
| `/issues` | `IssuesList` | Paginated list with FilterBar |
| `/issues/create` | `CreateIssue` | New issue form |
| `/issues/:id` | `IssueDetails` | Read-only detail + static map |

## External services
| Service | Usage |
|---------|-------|
| OpenStreetMap tile server (`tile.openstreetmap.org`) | Map tiles for both `InteractiveMap` and `StaticMap` |
| IndexedDB (browser-native) | Sole persistence layer |

No analytics, no authentication services, no REST APIs.
