---
title: "Styling Conventions"
description: "Tailwind usage, color tokens, badge patterns, responsive patterns"
domain: conventions
tags: [styling, tailwind, colors, badges, tokens, responsive]
---

# Styling Conventions

## Framework

Tailwind CSS v4 via `@tailwindcss/vite` Vite plugin. No `tailwind.config.js` — config is inline via the plugin. Global import in `src/index.css`.

## Color tokens

All semantic colors are defined as `Record<EnumValue, string>` in `src/data/constants.ts`. **Never hardcode badge colors inline** — always look up from these maps:

| Constant | Key type | Usage |
|----------|----------|-------|
| `STATUS_COLORS` | `Status` | `StatusBadge` |
| `SEVERITY_COLORS` | `Severity` | `SeverityBadge` |
| `ISSUE_TYPE_COLORS` | `IssueType` | `TypeBadge` |

Pattern: `className={STATUS_COLORS[status]}` — value is a complete Tailwind string like `'bg-yellow-100 text-yellow-800'`.

## Badge pattern

All badges: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium` + color class. See `src/components/issues/StatusBadge.tsx`.

## Layout

- Max content width: `max-w-4xl mx-auto px-4` on list page, `max-w-2xl mx-auto px-4` on detail/create
- Page shell: `min-h-screen bg-gray-50`
- Cards: `bg-white rounded-lg shadow-sm border border-gray-200`

## Button variants

Source: `src/components/common/Button.tsx`

| Variant | Classes |
|---------|---------|
| `primary` | `bg-blue-600 text-white hover:bg-blue-700` |
| `secondary` | `bg-gray-600 text-white hover:bg-gray-700` |
| `outline` | `border border-gray-300 bg-white text-gray-700 hover:bg-gray-50` |

Sizes: `sm` / `md` (default) / `lg`.

## Form fields

- Border: `border border-gray-300 rounded-lg`
- Focus: `focus:outline-none focus:ring-2 focus:ring-blue-500`
- Error state: replace border with `border-red-500`
- Error message: `text-sm text-red-500 mt-1`

## Maps

Both `InteractiveMap` (`h-64`) and `StaticMap` (`h-48`) use `w-full rounded-lg border border-gray-300 z-0`. The `z-0` prevents Leaflet from overlapping dropdowns.

## Responsive

No breakpoint-specific overrides exist yet. `flex flex-wrap` used on filter row and badge groups for natural wrapping. [NEEDS CONFIRMATION — no explicit mobile design spec found]
