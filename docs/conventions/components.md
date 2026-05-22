# Component Conventions

## File placement

```
src/components/
  common/       — generic UI primitives reused across features (Button)
  layout/       — page-level chrome (Header)
  issues/       — issue-domain components (IssueCard, IssueForm, IssueMap, FilterBar, StatusBadge)
src/pages/      — route-level components (one per route)
```

## Rules

- Pages are thin shells: they handle routing concerns (params, navigation, `useEffect` for data loading) and compose components
- Domain logic lives in components, not pages
- Named exports only — no default exports from component files (pages use default exports via `App.tsx` imports, but the components themselves use named exports)
- Each component file exports only components; no business logic utilities

## Component inventory

| Component             | Location                 | Props                                                                               |
| --------------------- | ------------------------ | ----------------------------------------------------------------------------------- |
| `Button`              | `common/Button.tsx`      | `variant?: primary\|secondary\|outline`, `size?: sm\|md\|lg`, all HTML button attrs |
| `Header`              | `layout/Header.tsx`      | `title: string`, `showBackButton?: boolean`, `rightAction?: ReactNode`              |
| `IssueCard`           | `issues/IssueCard.tsx`   | `issue: Issue`                                                                      |
| `IssueForm`           | `issues/IssueForm.tsx`   | none (reads/dispatches Redux internally)                                            |
| `InteractiveMap`      | `issues/IssueMap.tsx`    | `onLocationSelect: (loc) => void`, `selectedLocation?: Location\|null`              |
| `StaticMap`           | `issues/IssueMap.tsx`    | `location: Location`                                                                |
| `FilterBar`           | `issues/FilterBar.tsx`   | none (reads/writes URL params internally)                                           |
| `StatusBadge`         | `issues/StatusBadge.tsx` | `status: Status`                                                                    |
| `SeverityBadge`       | `issues/StatusBadge.tsx` | `severity: Severity`                                                                |
| `TypeBadge`           | `issues/StatusBadge.tsx` | `type: IssueType`                                                                   |
| `MultiSelectDropdown` | `issues/FilterBar.tsx`   | `label`, `options`, `selectedValues`, `onToggle` (internal, not exported)           |

## Leaflet maps

- Always initialized in `useEffect` with empty deps `[]`; guard against double-init with `if (mapInstanceRef.current) return`
- Always cleaned up on unmount: `map.remove()`, refs set to `null`
- Default marker icon patched once at module level in `IssueMap.tsx`
