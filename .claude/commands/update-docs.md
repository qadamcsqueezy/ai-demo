---
description: Reconcile docs with confirmed code changes. Only run this after /sync-docs has identified drift and a human has confirmed the changes were intentional.
argument-hint: <feature-slug>
---

You are updating docs to reflect confirmed changes in: $ARGUMENTS

## Before you start

Check: was `/sync-docs $ARGUMENTS` run recently and did a human confirm the drift was intentional?

If there is no recent drift report in this conversation, STOP and say:

> Run `/sync-docs $ARGUMENTS` first. This command only reconciles confirmed drift — it does not detect it.

## Step 1 — Load the drift report

Read the most recent `/sync-docs` output for $ARGUMENTS from this conversation.

Collect every item marked ⚠️ or 🔴 that has been confirmed intentional by the human.

Ignore any item the human has not explicitly confirmed. Do NOT update docs for unconfirmed drift — even if you think the change was intentional.

## Step 2 — Load the docs to update

From `docs/manifest.yaml`, load the docs mapped to $ARGUMENTS:
- `docs/features/[feature-slug].md`
- `docs/business-rules/[domain]-rules.md` (if a rule changed)
- `docs/conventions/[concern].md` (if a convention changed)
- `docs/glossary.md` (if a new term appeared)

Do NOT load anything not in the manifest entry. Do NOT update `CLAUDE.md` unless a hard rule changed.

## Step 3 — Update each doc

For each confirmed drift item, make the minimal edit that brings the doc in line with the code.

**Minimal means:**
- Change the specific sentence or bullet that is wrong
- Add a new bullet if new behavior was added
- Remove a bullet if behavior was removed
- Do NOT rewrite surrounding content
- Do NOT improve wording, fix formatting, or expand explanations while you're here
- Do NOT change sections unrelated to the confirmed drift

**Per doc type:**

### Feature spec (`docs/features/[slug].md`)

- Update `## Behavior` to reflect what the code now does
- Update `## Acceptance criteria` if any criterion no longer applies or a new one is needed
- Update `## Edge cases` if a failure path changed
- Remove `[NEEDS CONFIRMATION]` tags on any assumption that is now confirmed
- Add new `[NEEDS CONFIRMATION]` tags on any new assumption introduced by the change

### Business rules (`docs/business-rules/[domain]-rules.md`)

- If a rule was strengthened: update the constraint statement and source line reference
- If a rule was weakened or removed: mark it explicitly as `[REMOVED — intentional, confirmed YYYY-MM-DD]` rather than deleting it silently. Deletions should be visible in git diff.
- If a new rule was added: add a new entry in the correct domain group using the standard format:

```
**Rule:** [Constraint, stated as something Claude must respect]
**Source:** `path/file.ts:line`
**Enforcement:** [How it's checked]
```

### Conventions (`docs/conventions/[concern].md`)

- If a pattern changed: update the example file path and description
- If a new pattern was introduced: add it under the relevant section
- If an old pattern was deprecated: mark it `[DEPRECATED — use X instead]`, don't delete

### Glossary (`docs/glossary.md`)

- If a term was renamed: update the entry, add a note `[Previously: OldName]`
- If a new term appears: add it in alphabetical order
- If a term was removed from the codebase: mark it `[REMOVED]`, don't delete

## Step 4 — Update the manifest

After all docs are updated, update `docs/manifest.yaml`:

- If new source files are now relevant to this feature: add them to the `sources` list
- If new docs were created: add them to the `docs` list
- If new concepts are now covered: add tags
- Do NOT remove existing sources or tags unless they are completely gone from the codebase

## Step 5 — Output a change summary

After making all edits, output this summary:

---

### Update summary: $ARGUMENTS

**Drift items reconciled:** [N]
**Drift items skipped (not confirmed):** [N] — list them

**Docs updated:**
- `docs/features/[slug].md` — [what changed, one line]
- `docs/business-rules/[domain]-rules.md` — [what changed, one line]
- [etc.]

**Docs NOT updated (no confirmed drift):**
- [list any docs that had drift flagged but not confirmed]

**New [NEEDS CONFIRMATION] tags added:**
- [list any new assumptions surfaced by this change]

**Manifest updated:** [yes / no — what changed]

---

Next step: run `/review-change $ARGUMENTS` to verify the updated docs and code are consistent before opening the PR.

---

## Rules

- Never update a doc for unconfirmed drift. If the human hasn't said "yes that was intentional", skip it and list it in the skipped section.
- Never delete content from docs. Use deprecation markers and removal notes instead. Silent deletions are invisible in review.
- Never improve docs opportunistically. The scope of this command is the confirmed drift items only. Scope creep in doc updates is how docs drift in the other direction.
- Never update `CLAUDE.md` hard rules without explicit human instruction, even if the code changed something that looks like a hard rule.
- If a confirmed change introduces a new `[NEEDS CONFIRMATION]` assumption, surface it — don't silently bake new assumptions into the docs.
- If two drift items conflict with each other (e.g. a rule was both strengthened and the feature spec says it was removed), STOP and ask the human to clarify before proceeding.