In all interactions and commit messages be extremely concise and sacrifice grammar for the sake of concision

# IMPORTANT
Whenever you change something in the tech stack make sure that you update the "Tech Stack" section in the CLAUDE.MD file

# CLAUDE.md

City Issue Reporter: browser-only React app for reporting/tracking city infrastructure problems (potholes, streetlights, graffiti, etc.). No backend — data lives in IndexedDB. Centered on Rabat, Morocco.

**Tech Stack**: React 19, TypeScript, Vite 7, React Router 7, Redux Toolkit 2 / React Redux 9, IndexedDB (idb 8), Leaflet 1.9, Tailwind CSS 4, ESLint 9

## Commands
```bash
npm run dev      # dev server with HMR
npm run build    # tsc then vite build
npm run lint     # eslint
npm run preview  # preview prod build
```

## Navigation by task
| Touching… | Read first |
|-----------|-----------|
| Issue entity fields / types | `docs/architecture/data-model.md` |
| Redux store / selectors / thunks | `docs/conventions/state.md` |
| Forms, validation | `docs/conventions/forms.md` |
| Components, file placement | `docs/conventions/components.md` |
| Tailwind classes, badge colors | `docs/conventions/styling.md` |
| Issue creation flow | `docs/features/issue-creation.md` |
| Issue list + filtering | `docs/features/issue-filtering.md` |
| Issue detail view | `docs/features/issue-detail.md` |
| Map behavior | `docs/features/map.md` |
| Business constraints (ID format, status enum, validation) | `docs/business-rules/issue-rules.md` |
| Reporting / create flow step-by-step | `docs/workflows/report-issue.md` |
| Domain terms / enum values | `docs/glossary.md` |

## Workflow
For any change: read `docs/00_overview.md` + the relevant feature spec + relevant conventions FIRST.

## Hard rules
- Never add new `IssueType`, `Severity`, or `Status` values without updating `src/types/index.ts`, `src/data/constants.ts` (all three maps), and `docs/glossary.md`
- Never bypass `validateForm()` in `IssueForm.tsx` — all four fields are required
- Never store issues outside IndexedDB (`city-issues-db` v1, store `issues`)
- Never generate IDs manually — always use `generateIssueIdFromState()` from `src/store/slices/issuesSlice.ts`
- New issues always get `status: 'reported'` — never set another status on creation
- Keep issues sorted newest-first in Redux state; prepend on `addIssue.fulfilled`
- Never restate business rules in feature docs — link to `docs/business-rules/issue-rules.md`
- Never restate entity schema outside `docs/architecture/data-model.md`

## Skill pointers
- `/sync-docs` — re-scan src and update affected doc files
- `/lint-conventions` — check component/state/styling conventions against code
- `/review-change` — verify a change satisfies acceptance criteria in the relevant feature doc
