Analyze this codebase and generate a documentation knowledge base in a `docs/` folder plus a `CLAUDE.md` router at the repo root. These docs will be the context Claude loads on every future task — they must be requirements-first (WHAT the product does and WHY), with code references as a secondary layer.

## What to generate

### 1. `CLAUDE.md` (repo root) — the router

Under 80 lines. Contains:
- What this product is (2-3 sentences)
- Tech stack (one line)
- **How to look up any topic:**
```
  ## Finding the right docs
  ALWAYS start with docs/manifest.yaml before reading any other doc.
  Match your task to a topic by id, description, or tags.
  Load only the docs and source_paths listed under that topic.
  Never load the full /docs folder — use the manifest to target.
```
- Hard rules extracted from the codebase (things Claude must never do)
- Pointer to the three commands: `/sync-docs`, `/check-rules`, `/review-change`
- The workflow:
```
  For any task:
  1. Read docs/manifest.yaml
  2. Find the matching topic(s) by id, description, or tags
  3. Load only the docs and source_paths listed for that topic
  4. Then act
```

### 2. `docs/manifest.yaml`

**This is the most important navigation file in the entire system.**
Generated LAST, after every other doc exists.
Every topic that has a doc must appear here.
Claude must consult this file before loading any other doc.

Format exactly as follows:

```yaml
# [App name] Documentation Manifest
# Topic index mapping features/domains to doc files and source code paths
# Used by AI agents to find relevant documentation for any task

topics:

  - id: [feature-slug]
    description: "[One sentence — what this topic covers]"
    docs:
      - docs/features/[feature].md
      - docs/business-rules/[domain]-rules.md
      - docs/api/[domain]-api.md
    source_paths:
      - src/[relevant-folder]/
      - src/[specific-file].ts
    tags: [tag1, tag2, tag3, natural-language-phrases, error-messages-user-might-quote]
```

Rules for the manifest:
- **id** — kebab-case, unique, matches the feature slug used in docs/features/
- **description** — one sentence that would match a developer's natural query ("I need to change how dark mode works" → matches id: dark-mode)
- **docs** — every doc file relevant to this topic, in reading order (feature spec first, then business-rules, then api)
- **source_paths** — every source file or folder Claude would need to read to work on this topic. Be exhaustive — include models, services, components, config files, tests
- **tags** — this is the search surface. Include:
  - Technical terms (function names, component names, model names)
  - User-facing terms (what a user would call this feature)
  - Error messages or symptoms ("user can't log in" → auth tags)
  - Related concepts (even if not the primary topic)
  - Status values, enum names, constants related to this domain

Topics to always include:
- One topic per major feature (maps to a docs/features/ file)
- `architecture` — maps to docs/architecture/
- `data-model` — maps to docs/architecture/data-model.md + all model files
- `glossary` — maps to docs/glossary.md
- `ui-widgets` — shared components with no dedicated feature doc (docs: [] is valid)
- `utilities` — utility services and helpers (docs: [] is valid)

### 3. `docs/00_overview.md`

The first read in any session. Covers:
- What the app does (user-facing, 2-3 sentences)
- Who uses it (roles)
- Tech stack with versions
- Folder structure of `src/` with one-line purpose per top-level folder
- Entry points (main routes, root component, build commands)
- External services and APIs

### 4. `docs/glossary.md`

Domain terms used in the codebase: entity names, status enums, route names,
business concepts, role names, constants. Define each ONCE here.
Every other doc references the glossary instead of re-explaining terms.

Format per term:
```
**TermName** — One-sentence definition. Source: `path/to/where-defined.ts`
```

### 5. `docs/architecture/data-model.md`

Database/state schema. Entities, fields, relationships (1:1, 1:N, M:N),
key indexes. Only here — never repeated in other docs.

### 6. `docs/business-rules/[domain]-rules.md`

Extract every business rule from the code: validation schemas, guards,
middleware, conditional logic, status transitions, permission checks.

Format each rule:
```
**Rule:** [Constraint, stated as something Claude must respect]
**Source:** `path/file.ts:line`
**Enforcement:** [How it's checked — validation, guard, middleware]
```

Group by domain (one file per domain). Single source of truth —
no other doc restates rules, they link here.

### 7. `docs/features/[feature-name].md` — one per major feature

**Order matters: requirements first, code second.**

```markdown
---
title: [Feature name]
description: [One-line]
domain: [domain]
related_docs:
  - docs/business-rules/[domain]-rules.md
tags: [keyword1, keyword2]
---

# [Feature name]

## What it does
[2-3 sentences. User-facing summary, not technical.]

## Functional & business requirements

### User-facing requirements
- A [role] must be able to [action] [constraint].

### Business constraints
- [Non-technical rule baked into the product]. [NEEDS CONFIRMATION] if not certain.

### Acceptance criteria
- [ ] [Testable condition that defines "working correctly"]

### Edge cases with business impact
- [What happens to the user when X fails]

### Open questions / assumptions
- [ ] [Business assumption embedded in code that isn't obvious] [NEEDS CONFIRMATION]

## User roles involved
[Table: role | what they can do | what they can't]

## Business rules
→ See `docs/business-rules/[domain]-rules.md`. Do NOT restate rules here.

## Key source files
| File | Purpose | Key functions |
|------|---------|---------------|

## Related features
- `docs/features/[other].md`
```

### 8. `docs/workflows/[workflow-name].md` — major user flows

Step-by-step with state transitions, which service/component handles each
step, error cases. Link to business-rules for rule details. No restatement.

### 9. `docs/api/[domain]-api.md` — if applicable

Per endpoint: method, path, auth required, request/response shape,
middleware, which service handles it. Link to business-rules, no restatement.

## Hard rules — read before generating

- **Conciseness is critical.** Every token costs context window. Short
  sentences. No filler. No introductions.
- **Single source of truth.** Each fact in exactly one file:
  - Entity schemas → `data-model.md` only
  - Business rules → `business-rules/[domain]-rules.md` only
  - API details → `api/[domain]-api.md` only
  - Glossary terms → `glossary.md` only
  - Feature docs link to these — never restate them
- **Requirements first, code second.** Feature docs lead with what the
  product must do. Code refs are a secondary section.
- **Flag uncertainty.** Mark inferred requirements `[NEEDS CONFIRMATION]`.
  Surfacing a guess beats omission.
- **Write for Claude in future sessions, not humans reading sequentially.**
  Be specific: actual file paths, function names, enum values, status strings.
- **One concept per file.** Split sub-features into separate docs.
- **Cross-link with relative paths.** `docs/features/foo.md` not
  `/docs/features/foo.md`.

## After generating docs — flag skill candidates

Review the codebase for two types of skill candidates.
Do NOT generate skill files — list them so the team can write them.

### General best-practice skills
Content that applies to any project on this stack (React patterns, 
performance principles, anti-patterns). Output:

| Content | Suggested skill file |
|---------|----------------------|
| [e.g. useState vs useRef] | .claude/skills/react-patterns.md |

### Howto skills (highest ROI)
Architectural patterns requiring multiple coordinated steps. Look for:
- Registration patterns (adding to an index, config, or registry to activate)
- Factory patterns (createX functions with a specific invocation sequence)
- Integration patterns (schedulers, queues, event buses, external services)
- Scaffold patterns (new feature, route, service — touching 3+ files in order)

Output:

| Pattern | Evidence found | Suggested skill file |
|---------|---------------|----------------------|
| [e.g. Create a background job] | src/jobs/, scheduler.config.ts | .claude/skills/howto/create-job.md |

These are suggestions only. The team writes howto skills — they contain
tribal knowledge (common mistakes, silent failures) not visible in code.

## Generation order

1. Scan full project: routes, models/types, services, components,
   validation schemas, middleware, guards, tests, config files
2. Generate `CLAUDE.md` — under 80 lines, manifest lookup as first instruction
3. Generate `docs/00_overview.md`
4. Generate `docs/glossary.md`
5. Generate `docs/architecture/data-model.md`
6. Generate `docs/business-rules/*.md`
7. Generate `docs/features/*.md`
8. Generate `docs/workflows/*.md`
9. Generate `docs/api/*.md` if applicable
10. Generate `docs/manifest.yaml` LAST — indexes everything written above,
    every doc file must appear in at least one topic entry

Start by reading: `package.json` (or equivalent), top-level folders in
`src/`, routing config, any existing README. Then proceed in order above.