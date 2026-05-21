---
title: "Component Conventions"
description: "File structure, naming, prop patterns, and placement rules"
domain: conventions
tags: [components, naming, props, structure, react]
---

# Component Conventions

## File placement

```
src/components/
  common/       # Generic, reusable across features (Button)
  issues/       # Domain-specific to the Issue feature
  layout/       # Structural shell (Header)
src/pages/      # Route-level components — one per route
```

Rule: if a component is only used in one feature, it goes in `components/issues/`. If it's used in two+ features or has no domain coupling, it goes in `components/common/`.

## Naming

- All components: PascalCase, named export (no default exports from component files)
- File name matches primary export name: `IssueCard.tsx` exports `IssueCard`
- Multiple small related components in one file is acceptable: `StatusBadge.tsx` exports `StatusBadge`, `SeverityBadge`, `TypeBadge`; `IssueMap.tsx` exports `InteractiveMap`, `StaticMap`

## Prop patterns

- Props interface defined inline at top of file: `interface IssueCardProps { issue: Issue }`
- Components extending HTML elements spread `...props`: `Button` extends `ButtonHTMLAttributes<HTMLButtonElement>`
- Optional props use `?` in interface; defaults in destructuring: `variant = 'primary'`
- No prop drilling beyond one level — use `useAppSelector` instead

## Page components

Pages own layout shell (`min-h-screen bg-gray-50`), `Header`, and `main` wrapper. They dispatch and select from Redux. They do not contain business logic — delegate to child components and thunks.

Example: `IssuesList.tsx` owns data loading (`dispatch(loadIssues())`), passes issue data down to `IssueCard`.

## Hooks usage

Always use typed hooks from `src/store/hooks.ts`:
- `useAppDispatch()` instead of `useDispatch()`
- `useAppSelector(selector)` instead of `useSelector(selector)`

## Leaflet components

Leaflet maps use `useRef` for the DOM node and `useRef` for the map/marker instances. The map is initialized in a `useEffect` with empty deps (`[]`). Cleanup via `map.remove()` in the effect return. Never re-initialize if `mapInstanceRef.current` is already set.

See `src/components/issues/IssueMap.tsx` for the canonical pattern.
