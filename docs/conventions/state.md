# State Management Conventions

## Structure

- Single Redux store (`src/store/store.ts`), one slice: `issues` (`src/store/slices/issuesSlice.ts`)
- Typed hooks only: `useAppDispatch` / `useAppSelector` from `src/store/hooks.ts` — never raw `useDispatch`/`useSelector`
- Selectors in `src/store/selectors/issuesSelectors.ts` — memoized with `createSelector`

## Slices

- All async work via `createAsyncThunk`; reducers are synchronous only
- `issuesSlice` has no synchronous reducers — all state mutations happen in `extraReducers`
- `isLoading` is true while `loadIssues.pending`; false on fulfilled or rejected

## Thunks

| Thunk        | Trigger                                                   | What it does                                                                                 |
| ------------ | --------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| `loadIssues` | `IssuesList` mount, `IssueDetails` mount (if state empty) | Reads IndexedDB; seeds mock data if empty; sorts newest-first; sets state                    |
| `addIssue`   | `IssueForm` submit                                        | Generates ID from current state, builds full `Issue`, writes to IndexedDB, prepends to state |

## Selectors

| Selector               | Input                 | Output                        |
| ---------------------- | --------------------- | ----------------------------- |
| `selectIssues`         | state                 | `Issue[]`                     |
| `selectIsLoading`      | state                 | `boolean`                     |
| `selectIssueById`      | state, id             | `Issue \| undefined`          |
| `selectNextIssueId`    | state                 | next `ISS-YYYY-NNN` string    |
| `selectFilteredIssues` | state, `FilterParams` | filtered `Issue[]`            |
| `selectFilterStats`    | state, `FilterParams` | `{ total, hasActiveFilters }` |

## Filter state

Filters are NOT in Redux. They live in URL search params. Components read them with `useSearchParams`, pass as arguments to memoized selectors.

## Rules

- Never pass filter state into Redux — URL params are the source of truth for filters
- Always use `generateIssueIdFromState(state.issues.issues)` inside the `addIssue` thunk — reads live state via `getState()`
- New issues prepend to state array (`[payload, ...state.issues]`) to preserve sort order without re-sorting
