# Styling Conventions

## Stack

Tailwind CSS 4 (via `@tailwindcss/vite` plugin). No CSS modules, no styled-components. Classes applied inline.

## Badge colors

All badge color mappings live in `src/data/constants.ts` — never hardcode colors in components.

### Status colors (`STATUS_COLORS`)

| Value         | Classes                         |
| ------------- | ------------------------------- |
| `reported`    | `bg-yellow-100 text-yellow-800` |
| `in_progress` | `bg-blue-100 text-blue-800`     |
| `resolved`    | `bg-green-100 text-green-800`   |
| `closed`      | `bg-gray-100 text-gray-800`     |

### Severity colors (`SEVERITY_COLORS`)

| Value      | Classes                         |
| ---------- | ------------------------------- |
| `low`      | `bg-green-100 text-green-800`   |
| `medium`   | `bg-yellow-100 text-yellow-800` |
| `high`     | `bg-orange-100 text-orange-800` |
| `critical` | `bg-red-100 text-red-800`       |

### Issue type colors (`ISSUE_TYPE_COLORS`)

| Value                | Classes                           |
| -------------------- | --------------------------------- |
| `pothole`            | `bg-amber-100 text-amber-800`     |
| `broken_streetlight` | `bg-purple-100 text-purple-800`   |
| `graffiti`           | `bg-pink-100 text-pink-800`       |
| `illegal_dumping`    | `bg-emerald-100 text-emerald-800` |
| `damaged_sign`       | `bg-cyan-100 text-cyan-800`       |
| `other`              | `bg-slate-100 text-slate-800`     |

## Common patterns

- Page backgrounds: `min-h-screen bg-gray-50`
- Cards/panels: `bg-white rounded-lg shadow-sm border border-gray-200 p-4/6`
- Max content width: `max-w-4xl mx-auto px-4` (list), `max-w-2xl mx-auto px-4` (form/detail)
- Active filter indicator: `border-blue-500 text-blue-700` on dropdown buttons
- Error text: `text-sm text-red-500`
- Disabled/read-only inputs: `bg-gray-100 border border-gray-300 text-gray-500`
- Badge pill: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium`

## Rules

- Adding a new enum value requires adding its color to the relevant `Record` in `src/data/constants.ts`
- Never use arbitrary Tailwind values (e.g. `w-[123px]`) without a documented reason
