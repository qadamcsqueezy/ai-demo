---
description: Check a code change against the team's engineering rules and best practices. Reports violations with file:line references and fix suggestions. Run before committing.
argument-hint: <file-path | glob | leave empty to check git diff>
---

You are running a rules check on: $ARGUMENTS

## Step 1 — Identify what to check

**If $ARGUMENTS is a file path or glob** (e.g. `src/components/ThemeToggle.tsx`):
- Read the specified file(s) directly

**If $ARGUMENTS is empty**:
- Run `git diff HEAD` to get the current uncommitted changes
- Check only the changed lines and their immediate context
- If no diff is available, ask the developer which file to check

## Step 2 — Load the rules

Read in this order:
1. CLAUDE.md hard rules section — these are non-negotiable blockers
2. `docs/business-rules/` — domain constraints relevant to the changed files
   (use `docs/manifest.yaml` to find which business-rules file applies)

The rules below are built into this command and always apply regardless.

---

## The rules

### NAMING

**Rule N1 — No ambiguous names**
Variables, functions, and components must declare what they are and what they do.
- Boolean values must use `is`, `are`, or `should` prefixes
  - ✅ `isVisible`, `areItemsLoaded`, `shouldRedirect`
  - ❌ `visible`, `loaded`, `redirect`
- Functions that return something must be named for what they return
  - ✅ `getUserById`, `parseToAPIFormat`, `formatFrenchDate`
  - ❌ `getData`, `parseData`, `handle`
- Functions that manipulate data must describe the transformation
  - ✅ `addUniqueId`, `normalizeUserList`
  - ❌ `updateUsers`, `processData`

**Rule N2 — No magic strings or numbers**
All hardcoded values must be extracted to a named constant.
- ✅ `if (age < MAX_AGE)`
- ❌ `if (age < 65)`
Constants belong in a dedicated constants file, not inline.

---

### CODE STRUCTURE

**Rule S1 — Single responsibility**
Each function or component does one thing. If you can describe what it does
and you need the word "and", it has more than one responsibility.
Flag any function or component that:
- Fetches data AND transforms it AND renders UI
- Handles form state AND validation AND submission AND error display

**Rule S2 — No excessive nesting**
Maximum 2 levels of nested conditionals. Use early returns instead.
```js
// ❌ bad
function getAgeStatus(age) {
  if (age) {
    if (age > 60) { return 'old' } else { return 'young' }
  } else return ''
}

// ✅ good
function getAgeStatus(age) {
  if (!age) return ''
  return age > 60 ? 'old' : 'young'
}
```

**Rule S3 — No duplicated logic**
If the same logic appears more than twice, it must be extracted to a
named function in `/helpers`, `/utils`, or `/lib`.
Flag any copy-pasted blocks, repeated array transformations, or
duplicated validation logic.

**Rule S4 — No component defined inside another component**
Components defined inside other components:
- Cannot be unit tested in isolation
- Cause performance issues (re-created on every parent render)
- Bloat the parent component
```jsx
// ❌ bad — ShowContentPopup defined inside App
export default function App(props) {
  const showContentPopup = () => <Popup>{props.content}</Popup>
  return <div>{showContentPopup()}</div>
}

// ✅ good — separate component, separate file
const ShowContentPopup = ({ content }) => <Popup>{content}</Popup>
export default function App(props) {
  return <div><ShowContentPopup content={props.content} /></div>
}
```

**Rule S5 — No direct function invocation of components**
React components must be invoked as JSX, never as functions.
Direct invocation merges the parent and child into one component tree,
causing unexpected re-renders and hook violations.
```jsx
// ❌ bad
return <>{EmailField()}</>

// ✅ good
return <><EmailField /></>
```
This is a blocker — it can cause `rendered more hooks than during the
previous render` crashes in conditional rendering.

---

### REACT PATTERNS

**Rule R1 — useState vs useRef**
Do not use `useState` for values that do not affect the rendered output.
If a value is only used for internal tracking and doesn't need to trigger
a re-render, use `useRef`.
```jsx
// ❌ bad — causes unnecessary re-render
const [hasBeenInitialized, setHasBeenInitialized] = useState(false)

// ✅ good — no re-render
const hasBeenInitialized = useRef(false)
// access via hasBeenInitialized.current
```
If state requires complex logic or multiple interacting values, use
`useReducer` instead of multiple `useState` calls.

**Rule R2 — No useEffect for data fetching**
Data fetching must use the project's server state library (TanStack Query
or equivalent — check `docs/conventions/state.md`).
`useEffect` for fetching is a known source of race conditions, stale
closures, and missing loading/error states.
```jsx
// ❌ bad
useEffect(() => { fetch('/api/users').then(setUsers) }, [])

// ✅ good
const { data: users } = useQuery({ queryKey: ['users'], queryFn: fetchUsers })
```

**Rule R3 — Memoization must be justified**
`React.memo`, `useMemo`, and `useCallback` are not free.
Only apply them when:
- The component's rendering is measurably expensive
- Props are stable and rarely change
- A large dataset or complex calculation is being recomputed on every render
Do NOT wrap everything in memo as a default. Flag unjustified memoization.

**Rule R4 — Immutable state updates**
State must never be mutated directly. For deeply nested state,
use an immutability helper (Immer, Immutable.js) rather than
manually spreading multiple levels.
```js
// ❌ bad — deeply nested manual spread, error-prone
return { ...state, todos: state.todos.map(t =>
  t.id === id ? { ...t, reviewers: t.reviewers.map(r =>
    r.id === rid ? { ...r, name: newName } : r
  )} : t
)}

// ✅ good — Immer/Immutable.js setIn
return setIn(state, ['todos', todoIndex, 'reviewers', reviewerIndex, 'name'], newName)
```

---

### STATE MANAGEMENT

**Rule SM1 — No Redux for simple state**
Redux is not mandatory. Use it only when the problem genuinely requires it:
global state that many components need, complex async flows, time-travel debugging.
For simpler needs, prefer: Zustand, React Context (sparingly), or TanStack Query
for server state. Check `docs/conventions/state.md` for the project decision.

**Rule SM2 — No React Context as primary state management in React Native**
Context as the main state solution in React Native significantly impacts
performance. Use a dedicated state management library instead.

---

### PERFORMANCE

**Rule P1 — Code-split large or rarely-used components**
Components that are not needed on initial load are candidates for
`React.lazy` / dynamic import:
- Rendered only after a user interaction (modal, drawer, basket)
- Used by a small subset of users
- Significantly large in bundle size
Flag any large component import that is not lazy-loaded but is only
rendered conditionally.

**Rule P2 — Prefer native data layer in React Native**
Avoid fetching data through JavaScript bridges when a native API is available.
Retrieve data directly from the native layer to minimize latency.

---

### DEPENDENCIES

**Rule D1 — No new dependency without review**
Adding a package requires:
- Checking health and credibility via snyk.io/advisor
- Using exact version pinning: `yarn add -E <package>`
- Not upgrading immediately — allow new versions time to circulate
- Reviewing the changelog before any upgrade
- Using `--ignore-scripts` when installing: `yarn add -E <package> --ignore-scripts`

Flag any `package.json` change that adds or upgrades a dependency
without evidence of the above steps.

---

### API DESIGN (if the change touches API routes or endpoints)

**Rule A1 — URLs use nouns, not verbs**
- ✅ `GET /users`, `DELETE /orders/:id`
- ❌ `GET /getUsers`, `POST /deleteOrder`

**Rule A2 — HTTP methods define the operation**
Use standard methods for CRUD:
- GET — read
- POST — create
- PUT/PATCH — update
- DELETE — remove

**Rule A3 — Consistent response codes**
- 2xx for success
- 4xx for client errors (with a concise, non-stack-trace message)
- 5xx for server errors
Never return a 200 with an error object inside.

**Rule A4 — Use query/path parameters to limit response scope**
Avoid returning unbounded collections. Use pagination, limit, or filters.
- ✅ `GET /photos?location=boston&limit=10`
- ❌ `GET /photos` returning 10,000 records

---

### ERROR HANDLING

**Rule E1 — No unhandled errors**
All async operations must have error handling.
All user inputs must be validated before use.
Never display raw stack traces, database errors, or internal error codes
to the user — these are security vulnerabilities.
In React, use Error Boundaries for components that may throw.

---

## Step 3 — Output the rules report

Use exactly this format.

---

### Rules check: $ARGUMENTS

**Files checked:** [list]
**Rules applied:** [list rule IDs checked — omit rules irrelevant to file type]

---

#### ✅ Passing

[One line per passing rule — keep brief]

---

#### ⚠️ Violations

For each violation:

```
VIOLATION
Rule:       [Rule ID] — [Rule name]
File:       path/to/file.tsx (line N)
Found:      [exact code snippet that violates the rule]
Problem:    [one sentence — why this violates the rule]
Fix:        [concrete fix — show the corrected code if the fix is short]
Severity:   blocker | warning
```

---

#### 🔴 Blockers

Violations that must be fixed before this code is committed:
- Rule S5 (direct component invocation) — can cause hook crashes
- Rule E1 (unhandled errors in auth or payment flows)
- Any CLAUDE.md hard rule violation
- Any business rule violation

Everything else is a warning — fix it, but it won't block the commit.

---

**Summary**
- Files checked: [N]
- Rules checked: [N]
- Violations: [N] ([N] blockers, [N] warnings)
- Status: ✅ clean | ⚠️ warnings — fix before PR | 🔴 blocked — fix before commit

---

## Rules for this command

- **Quote the exact line.** Every violation must reference the specific file and line number. No vague descriptions.
- **Show the fix.** For every violation, provide a corrected version of the code, not just a description of what's wrong.
- **Don't flag what isn't there.** Only check rules relevant to the file type. Don't apply React rules to a utility function that has no JSX.
- **Severity is binary.** Blocker or warning. Don't invent a third category.
- **Don't rewrite the whole file.** Flag violations. The developer makes the fix.
- **If a rule cannot be determined** from static analysis alone (e.g. whether memoization is justified requires runtime profiling), note it as "needs runtime verification" rather than flagging it as a violation.
````