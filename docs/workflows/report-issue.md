# Workflow: Report an Issue

## Trigger

User clicks "Report New Issue" button on `/issues`.

## Steps

### 1. Navigate to form

- `Button` onClick → `navigate('/issues/create')`
- `CreateIssue` page renders `Header` (with back button) + `IssueForm`

### 2. Form renders

- `IssueForm` reads `selectNextIssueId` from Redux → displays read-only preview ID
- Empty `formData` state: `type: ''`, `severity: ''`, `description: ''`, `location: null`

### 3. User fills fields

| Field       | Interaction                             | State update           |
| ----------- | --------------------------------------- | ---------------------- |
| Issue Type  | `<select>` change                       | `formData.type`        |
| Severity    | radio label click                       | `formData.severity`    |
| Location    | map click → `onLocationSelect` callback | `formData.location`    |
| Description | textarea input                          | `formData.description` |

### 4. Submit

- `handleSubmit` called
- `validateForm()` runs — sets `errors` and returns `false` if any field missing → form shows inline errors, stops here
- `setIsSubmitting(true)` — button disabled, label → "Reporting..."
- `NewIssue` object built: `{ type, severity, description: description.trim(), location }`
- `dispatch(addIssue(newIssue)).unwrap()` called

### 5. addIssue thunk

- `getState()` → reads current `state.issues.issues`
- `generateIssueIdFromState(issues)` → computes next `ISS-YYYY-NNN`
- Builds full `Issue`: adds `id`, `status: 'reported'`, `reportedAt: new Date().toISOString()`
- `addIssueToDb(issue)` → writes to IndexedDB (`city-issues-db`, store `issues`)
- Returns `issue` to Redux

### 6. State update

- `addIssue.fulfilled` reducer: `state.issues = [newIssue, ...state.issues]` (prepend, preserves sort)

### 7. Redirect

- `.unwrap()` resolves → `navigate('/issues')`
- User sees updated list with new issue at top

## Error path

- Thunk rejects → `.unwrap()` throws → `catch` block: `console.error`, `setIsSubmitting(false)`
- Form stays open; no user-visible error message [NEEDS CONFIRMATION]

## Cancel path

- "Cancel" button → `navigate('/issues')` — no issue created, no IndexedDB write

## Business rules applied in this flow

→ See `docs/business-rules/issue-rules.md`
