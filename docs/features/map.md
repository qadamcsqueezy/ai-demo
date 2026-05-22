---
title: Map
description: Leaflet map components — interactive picker and static display
domain: map
related_docs:
  - docs/features/issue-creation.md
  - docs/features/issue-detail.md
tags:
  [
    map,
    Leaflet,
    InteractiveMap,
    StaticMap,
    location,
    pin,
    marker,
    coordinates,
    OpenStreetMap,
  ]
---

# Map

## What it does

Two Leaflet-based map components: `InteractiveMap` lets users click to drop a pin and capture coordinates during issue creation; `StaticMap` shows a fixed pin on the issue's saved location in the detail view.

## Functional & business requirements

### User-facing requirements

- `InteractiveMap`: map must default to Rabat, Morocco (lat 34.0209, lng -6.8416), zoom 13.
- `InteractiveMap`: clicking the map drops/moves a single marker and emits `{ lat, lng }` via `onLocationSelect`.
- `InteractiveMap`: selected coordinates must display below the map as text.
- `StaticMap`: renders at zoom 15 centered on issue coordinates with all interaction disabled.
- `StaticMap`: displays coordinates below the map; shows address if present.
- Both maps use OpenStreetMap tiles (no API key).

### Business constraints

- Maps are mounted imperatively via `useRef` + `useEffect` — never re-mounted on re-render. Cleanup (`map.remove()`) runs on unmount.
- Leaflet default marker icon is patched at module level to fix Vite asset resolution (`L.Marker.prototype.options.icon`).
- `address` field on `Location` is optional and not captured by the map click — only `lat`/`lng` are set interactively. [NEEDS CONFIRMATION: is address ever populated outside mock data?]

### Acceptance criteria

- [ ] `InteractiveMap` opens centered on Rabat at zoom 13
- [ ] Clicking map moves marker and updates parent form state via `onLocationSelect`
- [ ] Coordinates text updates on each click
- [ ] `StaticMap` renders with no pan/zoom/scroll/click interaction
- [ ] `StaticMap` shows marker at exact `location.lat/lng`
- [ ] Neither map throws on unmount/remount

## Key source files

| File                                 | Purpose               | Key exports                              |
| ------------------------------------ | --------------------- | ---------------------------------------- |
| `src/components/issues/IssueMap.tsx` | Both map components   | `InteractiveMap`, `StaticMap`            |
| `src/data/constants.ts`              | Default center + zoom | `DEFAULT_MAP_CENTER`, `DEFAULT_MAP_ZOOM` |
| `src/types/index.ts`                 | Location type         | `Location`                               |

## Related features

- `docs/features/issue-creation.md` — uses `InteractiveMap`
- `docs/features/issue-detail.md` — uses `StaticMap`
