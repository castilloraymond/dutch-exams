# Product PRD Template

Copy this template for new features. Fill in only the sections required by your effort size (see Effort Guide below). Delete unused sections or leave them as `N/A`.

---

```markdown
# PRD-[NN]: [Feature Name]

## Meta

| Field    | Value                                 |
|----------|---------------------------------------|
| PRD ID   | PRD-[NN]                              |
| Status   | Draft / Ready / In Progress / Done    |
| Effort   | XS / S / M / L / XL                  |
| Date     | YYYY-MM-DD                            |
| Branch   | feature/[branch-name]                 |

## Effort Guide

Fill the sections marked for your effort size. Smaller efforts skip more sections.

| Section                | XS | S  | M  | L  | XL |
|------------------------|----|----|----|----|-----|
| Problem & Goal         | ✅ | ✅ | ✅ | ✅ | ✅ |
| User Story             |    | ✅ | ✅ | ✅ | ✅ |
| Requirements (FR-IDs)  |    | ✅ | ✅ | ✅ | ✅ |
| Non-Goals              |    |    | ✅ | ✅ | ✅ |
| Content & File Changes |    |    | ✅ | ✅ | ✅ |
| Data & State           |    |    |    | ✅ | ✅ |
| UI Notes               |    |    |    | ✅ | ✅ |
| Success Criteria       |    | ✅ | ✅ | ✅ | ✅ |
| Open Questions         |    |    | ✅ | ✅ | ✅ |
| CC Handoff             | ✅ | ✅ | ✅ | ✅ | ✅ |

**Sizing reference:**
- **XS** — Typo fix, copy change, single-line config. ~30 min.
- **S** — Small UI tweak, add a content file, simple component change. ~1–3 hours.
- **M** — New page, new content module, multi-file feature. ~3–8 hours.
- **L** — Cross-cutting feature (new module + content + state + UI). ~1–3 days.
- **XL** — Architectural change, new integration, multi-module feature. ~3–5 days. Run `/spec-interview` first.

---

## Problem & Goal

**Problem:** What's broken, missing, or suboptimal? Who is affected?

> [Describe the problem in 2–3 sentences. Be specific about who experiences it and how.]

**Goal:** What does success look like?

> [1–2 sentences. Measurable if possible.]

---

## User Story

As a **[user type]**, I want **[action]**, so that **[outcome/benefit]**.

---

## Requirements

Number each requirement with an FR-ID. These IDs flow into specs and CC session prompts for traceability.

| ID    | Requirement                                    | Priority      |
|-------|------------------------------------------------|---------------|
| FR-1  | [Functional requirement]                       | Must have     |
| FR-2  | [Functional requirement]                       | Must have     |
| FR-3  | [Functional requirement]                       | Should have   |
| FR-4  | [Functional requirement]                       | Nice to have  |

---

## Non-Goals

What this PRD does NOT cover. Be explicit — this prevents scope creep.

- NOT: [thing that might seem related but is out of scope]
- NOT: [future enhancement to build separately]
- NOT: [adjacent feature request]

---

## Content & File Changes

What JSON, markdown, component, or config files need to change?

| File / Path                        | Change type       | Description                    |
|------------------------------------|-------------------|--------------------------------|
| `content/[module]/[file].json`     | New / Modified    | [What changes]                 |
| `app/learn/[route]/page.tsx`       | New / Modified    | [What changes]                 |
| `components/[Component].tsx`       | New / Modified    | [What changes]                 |
| `content/[module]/index.json`      | Modified          | [Add entry for new content]    |

---

## Data & State

### localStorage Shape

What progress or state data does this feature store? Follow the existing `PassageProgress` pattern.

```typescript
// Key: [feature]-progress-[id]
{
  completed: boolean;
  correctAnswers: number;
  totalQuestions: number;
  lastAttempt: string; // ISO date
}
```

### Supabase Sync

Does this feature need cloud sync? If yes, describe the shape. If no, write "localStorage only."

> [localStorage only / Describe sync requirements]

---

## UI Notes

### Components to Reuse

List existing components from `/components/` and `/components/ui/` that this feature should use.

- `QuestionView` — [how it's used here]
- `ResultsSummary` — [how it's used here]
- `AudioPlayer` — [if applicable]

### Interaction Description

Describe the user flow in 3–5 steps. No wireframes needed — just the sequence.

1. User navigates to [route]
2. User sees [what]
3. User interacts by [action]
4. System responds with [behavior]
5. On completion, [what happens]

---

## Success Criteria

Testable checklist. Every item should be verifiable by running the app.

- [ ] [Specific, testable criterion]
- [ ] [Specific, testable criterion]
- [ ] [Specific, testable criterion]
- [ ] `npm run build` passes
- [ ] No console errors on the new/modified pages

---

## Open Questions

Resolve these before coding. If any are blocking, flag them in the CC Handoff.

| #  | Question                                     | Decision | Decided by |
|----|----------------------------------------------|----------|------------|
| 1  | [Unresolved question]                        | TBD      |            |
| 2  | [Unresolved question]                        | TBD      |            |

---

## CC Handoff

### When to Run `/spec-interview` First

Run `/spec-interview` before coding if:
- Effort is **L or XL**
- The feature introduces a new data pattern or component architecture
- There are 5+ FR-IDs
- Open Questions has unresolved items that affect implementation

### Claude Code Session Prompt

Copy-paste this into a Claude Code session to start implementation:

> Implement PRD-[NN]: [Feature Name].
>
> **Requirements:**
> - FR-1: [requirement]
> - FR-2: [requirement]
> - FR-3: [requirement]
>
> **Key files:**
> - [file path] — [what to do]
> - [file path] — [what to do]
>
> **Non-goals:** [list non-goals so CC doesn't over-build]
>
> **Success criteria:** [paste from above]
>
> Follow existing patterns in the codebase. Check CLAUDE.md for conventions.
```

---

## Quick Reference

### PRD ID Format
Sequential: `PRD-01`, `PRD-02`, etc. Check `docs/prds/` for the latest number.

### Status Values
`Draft` → `Ready` (approved, no open questions) → `In Progress` (being built) → `Done`

### Workflow
```
PRD (this template)
  ↓ defines what & why
/spec-interview (for L/XL effort)
  ↓ defines how
Claude Code session (CC Handoff prompt)
  ↓ builds it
PR review → merge
```
