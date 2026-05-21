---
description: Detect drift between recent code changes and the docs that govern them. Reports only — never rewrites anything.
argument-hint: <file-path | feature-slug | leave empty to use git diff>
---

You are running a docs drift check on: $ARGUMENTS

## Step 1 — Identify what changed

**If $ARGUMENTS is a file path or glob** (e.g. `src/theme/tokens.ts`):
- Read the file and determine which feature(s) and domain(s) it belongs to
- Look up the matching entries in `docs/manifest.yaml` using `source_paths`

**If $ARGUMENTS is a feature slug** (e.g. `dark-mode`):
- Look up the entry in `docs/manifest.yaml` by `id` directly

**If $ARGUMENTS is empty**:
- Run `git diff --name-only HEAD` to find recently changed files
- Map each changed file to its topic via `docs/manifest.yaml`
- If no git diff is available, ask the developer which feature or file to check

## Step 2 — Load the relevant docs

From the manifest entry for each matched topic, read:
1. The feature spec — `docs/features/[slug].md`
2. The relevant business rules — `docs/business-rules/[domain]-rules.md`
3. CLAUDE.md hard rules section

Do NOT load the full `/docs` folder. Only what the manifest maps to this change.

If a changed file has no manifest entry, report it explicitly:
> ⚠️ No manifest entry found for `[file]`. This file is not covered by any topic. Consider running `/update-docs` to add it.

## Step 3 — Compare code vs docs

For each loaded doc, check the following. Be specific — quote the relevant lines from both the code and the doc when flagging drift.

**Feature spec drift**
- Does the code's current behavior match the spec's `## Behavior` or `## Functional requirements` section?
- Has anything new appeared in the code that the spec doesn't mention?
- Has anything the spec describes been removed or changed in the code?
- Do the `## Acceptance criteria` still reflect what the code actually does?
- Have any `[NEEDS CONFIRMATION]` assumptions been resolved in the code without being confirmed in the doc?

**Business rules drift**
- Does the code still enforce every rule listed in the relevant `business-rules/` file?
- Has any validation, guard, or conditional logic changed in a way that weakens or removes a documented rule?
- Has a new constraint appeared in the code that isn't documented anywhere?

**CLAUDE.md hard rules**
- Did the change violate any hard rule listed in CLAUDE.md?
- Examples: added a new dependency without asking, hardcoded a value that should be a token, bypassed a validation

## Step 4 — Output the drift report

Use exactly this format. No prose between sections. One block per drift item.

---

### Drift report: $ARGUMENTS

**Files checked:** [list changed files]
**Docs checked:** [list docs loaded from manifest]
**Manifest coverage:** [complete | gaps — list uncovered files]

---

#### ✅ In sync

[List what still matches — keep this brief, one line per item max]

---

#### ⚠️ Drift detected

For each drift item, use this block:

```
DRIFT
Type:       feature-spec | business-rule | hard-rule
File:       path/to/changed-file.ts (line N)
Doc:        docs/[relevant-doc].md

Spec says:  "[exact quote from the doc]"
Code does:  "[what the code actually does now]"

Intent:     intentional-change | likely-regression | new-undocumented-behavior
Action:     Confirm this was intentional, then run /update-docs [feature-slug]
```

---

#### 🔴 Blockers

List any drift item where:
- A business rule was removed or weakened
- A hard rule from CLAUDE.md was violated
- An acceptance criterion is no longer met by the code

These must be resolved before a PR is opened.

---

**Summary**
- Drift items: [N]
- Blockers: [N]
- Uncovered files: [N]
- Status: ✅ in sync | ⚠️ drift detected — confirmation needed | 🔴 blocked

---

## Rules for this command

- **Never rewrite any doc.** Detection only. Rewriting is `/update-docs`.
- **Never flag formatting or style differences.** Only semantic changes matter.
- **Never invent a rule that isn't in the docs.** If the code does something with no doc coverage, report it as "new undocumented behavior" — not as a violation.
- **Quote the source.** Every drift item must include the exact line from the doc and the exact behavior from the code. No paraphrasing.
- **Distinguish intent.** Label each item as intentional-change, likely-regression, or new-undocumented-behavior based on the nature of the change. Don't guess — if you can't tell, say so.
- **Blockers are a separate category.** Not everything is a blocker. Drift on a feature description is a warning. Drift on a business rule or hard rule is a blocker.
- **If manifest.yaml doesn't exist yet**, tell the developer and stop:
  > `docs/manifest.yaml` not found. Run the docs-gen prompt first to bootstrap /docs.