---
title: "Form Conventions"
description: "Validation, error handling, and submission patterns"
domain: conventions
tags: [forms, validation, errors, submission, react]
---

# Form Conventions

## Single form in codebase

`src/components/issues/IssueForm.tsx` is the only form. It is the canonical pattern to follow for any new form.

## Local state shape

```typescript
const [formData, setFormData] = useState<{
  type: IssueType | '';
  severity: Severity | '';
  description: string;
  location: Location | null;
}>({ type: '', severity: '', description: '', location: null });

const [errors, setErrors] = useState<{
  type?: string;
  severity?: string;
  description?: string;
  location?: string;
}>({});
```

Separate `formData` and `errors` objects. No form library (no react-hook-form, no Formik).

## Validation

All validation in a synchronous `validateForm(): boolean` function. Runs on submit, not on change. Sets all errors at once, returns `false` if any exist.

Required fields: `type`, `severity`, `description` (non-empty after trim), `location` (non-null).

See full rules: `docs/business-rules/issue-rules.md`.

## Submission pattern

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!validateForm()) return;
  setIsSubmitting(true);
  try {
    await dispatch(addIssue(newIssue)).unwrap();
    navigate('/issues');
  } catch {
    setIsSubmitting(false);
  }
};
```

- `.unwrap()` re-throws rejected thunk so `catch` fires on failure
- On success: navigate away (no explicit reset needed)
- On failure: clear `isSubmitting` so user can retry
- No success toast or feedback — just redirect

## Error display

Each field has an adjacent `{errors.field && <p className="mt-1 text-sm text-red-500">{errors.field}</p>}`.

Error border on text inputs/selects: swap `border-gray-300` for `border-red-500` when `errors.field` is set.

## Loading state

`isSubmitting: boolean` in local state. Disables submit and cancel buttons, changes button label to `'Reporting...'`.

## Preview ID

The form shows a read-only preview of the next issue ID via `selectNextIssueId`. It's cosmetic only — actual ID is generated inside the thunk at dispatch time from current state.
