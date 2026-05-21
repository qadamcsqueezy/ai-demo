---
title: "Map Integration"
description: "Leaflet map components — interactive (creation) and static (detail)"
domain: maps
related_docs:
  - docs/features/issue-creation.md
  - docs/features/issue-detail.md
tags: [map, leaflet, location, openstreetmap, interactive, static]
---

# Map Integration

## What it does
Two Leaflet map components handle location UX: `InteractiveMap` lets users click to pin an issue location during creation; `StaticMap` displays a fixed location on the detail page.

## Functional & business requirements

### User-facing requirements
- During issue creation: a user must click anywhere on the map to set the issue location.
- During issue creation: a user must see a marker at the clicked point; re-clicking moves the marker.
- During issue creation: a user must see the selected coordinates displayed below the map.
- On issue detail: a user must see a non-interactive map centered on the issue location with a marker.
- On issue detail: a user must see coordinates (and optional address) below the map.

### Business constraints
- Default center is Rabat, Morocco (`34.0209, -6.8416`) at zoom 13 for creation maps. Detail map centers on the issue location at zoom 15.
- Map tiles served by OpenStreetMap (`https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`). OSM attribution must be displayed (enforced by Leaflet `tileLayer` attribution).
- Only `lat` and `lng` are captured from map click — no reverse geocoding.

### Acceptance criteria
- [ ] `InteractiveMap` renders centered on Rabat at zoom 13 on mount
- [ ] Clicking the map places or moves a marker to the clicked coordinates
- [ ] Clicked coordinates are passed to `onLocationSelect` callback
- [ ] `StaticMap` renders centered on `location.lat/lng` at zoom 15 with all interactions disabled
- [ ] Marker icon renders correctly (Leaflet default icon Vite fix applied)
- [ ] Map container has `z-0` to prevent Leaflet overlapping page dropdowns

### Edge cases with business impact
- **Leaflet Vite icon fix**: Default Leaflet marker icon breaks in Vite builds due to asset URL resolution. Fixed by explicitly importing marker PNG assets and calling `L.icon({...})` with `iconUrl`, `iconRetinaUrl`, `shadowUrl`. This is applied once at module level in `IssueMap.tsx:11` and set as `L.Marker.prototype.options.icon`. Do not remove this.
- **Double-initialization guard**: Both components check `if (!mapRef.current || mapInstanceRef.current) return` in the init effect to prevent creating two map instances in React StrictMode.
- **Cleanup**: Cleanup function calls `map.remove()` and nullifies refs. Without this, navigating back to the form creates a duplicate map on the same DOM node.

### Open questions / assumptions
- [ ] Should `InteractiveMap` support reverse geocoding to populate `address`? Currently not implemented. [NEEDS CONFIRMATION]
- [ ] Should the map default center change based on user location (geolocation API)? [NEEDS CONFIRMATION]

## User roles
| Role | Can do | Cannot do |
|------|--------|-----------|
| Any visitor | Pick location (create), view location (detail) | — |

## Business rules
→ See `docs/business-rules/issue-rules.md` (location required rule). Do NOT restate here.

## Key source files
| File | Purpose | Key functions |
|------|---------|---------------|
| `src/components/issues/IssueMap.tsx` | Both map components | `InteractiveMap`, `StaticMap` |
| `src/data/constants.ts` | Map defaults | `DEFAULT_MAP_CENTER`, `DEFAULT_MAP_ZOOM` |

## Related features
- `docs/features/issue-creation.md`
- `docs/features/issue-detail.md`
