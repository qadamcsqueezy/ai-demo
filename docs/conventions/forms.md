# Form Conventions

## Pattern

Forms use local `useState` for field values and a separate `errors` object. No form library.

## Validation

- `validateForm()` is a local function that builds an errors object and calls `setErrors`
- Returns `boolean` — `handleSubmit` short-circuits if `false`
- All four fields in `IssueForm` are required: `type`, `severity`, `description` (non-empty after trim), `location` (non-null)
- Error messages render as `<p className="mt-1 text-sm text-red-500">` below each field

## Submission

- `handleSubmit` calls `validateForm()` first, then `setIsSubmitting(true)`, then dispatches thunk via `.unwrap()`
- On success: `navigate('/issues')`
- On failure: `setIsSubmitting(false)`, error logged to console — no user-facing error toast currently
- Submit button is `disabled` while `isSubmitting`; label changes to "Reporting..."

## Field types

| Field         | Input element                                                | Options source                             |
| ------------- | ------------------------------------------------------------ | ------------------------------------------ |
| `type`        | `<select>`                                                   | `ISSUE_TYPES` from `src/data/constants.ts` |
| `severity`    | radio-style `<label>` wrapping hidden `<input type="radio">` | `SEVERITIES` from `src/data/constants.ts`  |
| `location`    | `InteractiveMap` click handler                               | user map click                             |
| `description` | `<textarea rows={4}>`                                        | free text                                  |

## Rules

- Never bypass `validateForm()` — all four fields are required
- `description` is trimmed before inclusion in `NewIssue`
- `type` and `severity` are cast from string to their enum types at submit time
- `location` remains `null` until user clicks map; form errors if still null on submit
