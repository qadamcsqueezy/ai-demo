# Glossary

**Issue** — A single reported city infrastructure problem. The core entity. Source: `src/types/index.ts`

**IssueType** — Enum for the category of problem. Values: `pothole`, `broken_streetlight`, `graffiti`, `illegal_dumping`, `damaged_sign`, `other`. Source: `src/types/index.ts`, labels/colors in `src/data/constants.ts`

**Severity** — How urgent the issue is. Values (ascending): `low`, `medium`, `high`, `critical`. Source: `src/types/index.ts`

**Status** — Lifecycle state of an issue. Values: `reported`, `in_progress`, `resolved`, `closed`. New issues always start at `reported`. Source: `src/types/index.ts`

**Location** — `{ lat: number; lng: number; address?: string }` — WGS-84 coordinates plus optional human-readable address. Source: `src/types/index.ts`

**NewIssue** — `Omit<Issue, 'id' | 'status' | 'reportedAt'>` — shape submitted by the form before the thunk augments it. Source: `src/types/index.ts`

**Issue ID** — Auto-generated string in format `ISS-YYYY-NNN` (e.g. `ISS-2025-003`). Year is current calendar year; NNN is zero-padded sequential integer, max-of-existing + 1. Source: `generateIssueIdFromState()` in `src/store/slices/issuesSlice.ts`

**IndexedDB store** — Database name `city-issues-db`, version 1, object store `issues`, keyPath `id`. Source: `src/db/indexedDb.ts`

**Mock data** — 5 seed issues auto-loaded via `getInitialMockData()` when the IndexedDB store is empty on first load. Source: `src/data/mockData.ts`

**FilterParams** — `{ searchText?, types?, statuses?, severities? }` — runtime filter state. Serialised into URL search params (`?search=&types=&statuses=&severities=`). Source: `src/store/selectors/issuesSelectors.ts`

**InteractiveMap** — Leaflet map component where a user clicks to drop a pin and select a `Location`. Source: `src/components/issues/IssueMap.tsx`

**StaticMap** — Read-only Leaflet map showing a fixed pin; used on detail view. Source: `src/components/issues/IssueMap.tsx`

**DEFAULT_MAP_CENTER** — `{ lat: 34.0209, lng: -6.8416 }` — Rabat, Morocco. Source: `src/data/constants.ts`

**DEFAULT_MAP_ZOOM** — `13`. Source: `src/data/constants.ts`

**StatusBadge / SeverityBadge / TypeBadge** — Colored pill components for displaying enum values. Source: `src/components/issues/StatusBadge.tsx`

**STATUS_COLORS / SEVERITY_COLORS / ISSUE_TYPE_COLORS** — `Record<EnumValue, TailwindClasses>` maps used by badge components. Source: `src/data/constants.ts`
