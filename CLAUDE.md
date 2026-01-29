# CLAUDE.md

## Project Overview

Dutch Inburgering Prep — the ultimate resource for passing the Dutch Inburgering exams. A Duolingo-style Next.js web app with interactive exercises across reading, listening, and Dutch society knowledge modules.

## Commands

- `npm run dev` — Start development server (http://localhost:3000)
- `npm run build` — Production build
- `npm start` — Run production server
- `npm run lint` — Run ESLint

## Architecture

- **Framework:** Next.js 16 (App Router), React 19, TypeScript 5
- **Styling:** Tailwind CSS 4 + shadcn/ui (Radix UI primitives)
- **State:** localStorage via `useSyncExternalStore` hook, optional Supabase cloud sync
- **Content:** Static JSON files in `/content/` imported at build time via `/lib/content.ts`
- **All exercise/module pages are client components** (`"use client"`)

## Modules

| Module | Route | Content |
|--------|-------|---------|
| Lezen (Reading) | `/learn`, `/learn/[passageId]` | 5 passages, 25 questions |
| KNM (Society) | `/learn/knm`, `/learn/knm/[topicId]` | 8 topics, 96 questions |
| Luisteren (Listening) | `/learn/luisteren`, `/learn/luisteren/[exerciseId]` | 5 exercises, 20 questions |

Planned: Schrijven (Writing), Spreken (Speaking)

## Key Patterns

- Questions use a shared `Question` interface: `{ id, text, options, correctIndex, explanation? }`
- Questions are shuffled per session using Fisher-Yates in `useMemo`
- Progress stored per exercise ID in `PassageProgress` objects (completed, correctAnswers, totalQuestions, lastAttempt)
- Audio uses Web Speech Synthesis API at 0.85x speed (nl-NL)
- Results threshold: 60% to pass
- Content loaded via centralized functions in `/lib/content.ts`

## File Conventions

- Exercise content: `/content/<module>/` as JSON
- Each module index: `/content/<module>/index.json`
- UI components: `/components/ui/` (shadcn primitives)
- Feature components: `/components/` (AudioPlayer, QuestionView, ResultsSummary, etc.)
- Hooks: `/hooks/` (useProgress, usePassage)

## Environment Variables (Optional)

- `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase anonymous key

# CLAUDE.md

Behavioral guidelines to reduce common LLM coding mistakes. Merge with project-specific instructions as needed.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.