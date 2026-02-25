# CLAUDE.md — Project Memory & Session Rules

## Rules for Claude Code

### 1. Token Efficiency
- NEVER re-read files that are already documented below unless I explicitly ask you to
- When I ask you to change something, go DIRECTLY to the relevant file(s) listed in the High-Impact Files table
- If you need to explore, check this document first before scanning the codebase
- Prefer targeted edits (str_replace) over rewriting entire files

### 2. Translate My Requests
- I'm not a developer by training. When I describe something in plain English, do the following:
  - First, confirm what you think I mean in technical terms (1-2 sentences max)
  - Then do the work
  - If my request is ambiguous, ask me a SPECIFIC multiple-choice question rather than an open-ended one
  - Example: Instead of "What do you want to change?" ask "Do you want to (A) change the button color, (B) change what happens when the button is clicked, or (C) something else?"

### 3. Communication
- Tell me which file(s) you plan to edit BEFORE making changes
- If the task touches more than 3 files, give me a quick plan first
- Only update CLAUDE.md when you discover a NEW gotcha or pattern that affects future work — don't log routine changes (that's what git commits are for)

---

## Project Overview

Dutch Inburgering Prep — the ultimate resource for passing the Dutch Inburgering exams. A Duolingo-style Next.js web app with interactive exercises across reading, listening, and Dutch society knowledge modules. Also has an Expo React Native mobile app under `/mobile/`.

## Commands

- `npm run dev` — Start development server (http://localhost:3000)
- `npm run build` — Production build
- `npm start` — Run production server
- `npm run lint` — Run ESLint

## Architecture

- **Framework:** Next.js 16 (App Router), React 19, TypeScript 5
- **Styling:** Tailwind CSS 4 + shadcn/ui (Radix UI primitives) + CSS custom properties design system
- **State:** localStorage via `useSyncExternalStore` hook, optional Supabase cloud sync
- **Content:** Static JSON files in `/content/` imported at build time via `/lib/content.ts`
- **Auth:** Supabase Auth (email/password + Google OAuth) via `contexts/AuthContext.tsx`
- **Blog:** Markdown files in `/content/blog/` parsed by `lib/blog.ts` (gray-matter + marked + DOMPurify)
- **Mobile:** Expo React Native app in `/mobile/` sharing content structure from `/content/`
- **All exercise/module pages are client components** (`"use client"`)

> **Full file tree, data flow diagrams, module dependencies, and design tokens:** See `docs/ARCHITECTURE.md`

## High-Impact Files (imported by many)

| File | Imported By | What It Provides |
|------|-------------|-----------------|
| `lib/types.ts` | 25+ files | All TypeScript interfaces (Question, Passage, UserProgress, etc.) |
| `lib/content.ts` | 20+ files | All content getter functions — central content hub |
| `contexts/AuthContext.tsx` | 17+ files | `AuthProvider`, `useAuth()` hook |
| `hooks/useProgress.ts` | 16+ files (web + mobile) | Progress read/write hooks |
| `lib/utils.ts` | 12+ files | `cn()` classname helper, `formatTime()`, `isPassing()` |
| `hooks/useExamState.ts` | 7 files | Exam state machine (question nav, answers, timer) |
| `components/ExamLayout.tsx` | 7 files | Shared exam page layout |
| `components/ExamHeader.tsx` | 6 files | Exam top bar |
| `components/ContentPanel.tsx` | 6 files | Passage/content display |
| `components/QuestionGrid.tsx` | 6 files | Question navigation grid |
| `components/ResultsSummary.tsx` | 6 files | Exam results display |
| `components/landing/LandingFooter.tsx` | 8+ files | Reused footer on many pages |
| `lib/progress.ts` | 2 files (hooks) | Raw localStorage progress CRUD |

## Modules

| Module | Route | Content |
|--------|-------|---------|
| Lezen (Reading) | `/learn/lezen/exam`, `/learn/lezen/select`, `/learn/lezen/mock/[examId]` | 10 passages, 4 mock exams |
| KNM (Society) | `/learn/knm/exam`, `/learn/knm/select`, `/learn/knm/mock/[examId]` | 8 topics, 4 mock exams |
| Luisteren (Listening) | `/learn/luisteren/exam`, `/learn/luisteren/select`, `/learn/luisteren/mock/[examId]` | 10 exercises, 6 mock exams |
| Schrijven (Writing) | `/learn/schrijven`, `/learn/schrijven/[taskId]`, `/learn/schrijven/select`, `/learn/schrijven/mock/[examId]` | 8 tasks + mock exams |
| Spreken (Speaking) | `/learn/spreken`, `/learn/spreken/[taskId]`, `/learn/spreken/select`, `/learn/spreken/mock/[examId]` | 12 tasks + mock exams |

## Key Patterns

- Questions use a shared `Question` interface in `lib/types.ts`: `{ id, text, options, correctIndex, explanation?, explanationEn?, image? }`
- Questions are shuffled per session using Fisher-Yates in `useMemo`
- Progress stored per exercise ID in `PassageProgress` objects (completed, correctAnswers, totalQuestions, lastAttempt)
- Audio uses Azure TTS via `hooks/useAzureTTS.ts` and `app/api/tts/route.ts`, fallback to Web Speech Synthesis API at 0.85x speed (nl-NL)
- Results threshold: 60% to pass
- Content loaded via centralized functions in `lib/content.ts` — every content JSON is statically imported, then exposed via getter functions
- Exam flow pattern: select page -> exam/mock page -> ExamLayout + useExamState -> ResultsSummary
- All exam pages share: ExamHeader, ExamLayout, ContentPanel, QuestionGrid, ExamBottomNav, ResultsSummary
- Writing/Speaking use self-assessment rubrics instead of auto-grading

## Environment Variables (Optional)

- `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase anonymous key
- `LOOPS_API_KEY` — Loops CRM API key (server-side only, used in `lib/loops.ts`)
- `AZURE_TTS_KEY` — Azure Speech Services API key (used in `app/api/tts/route.ts` and `scripts/generate-audio-azure.ts`)
- `AZURE_TTS_REGION` — Azure Speech Services region (defaults to `westeurope`)
- `STRIPE_SECRET_KEY` — Stripe secret key (used in `app/api/stripe/`)
- `STRIPE_PRICE_ID` — Stripe price ID for checkout
- `STRIPE_WEBHOOK_SECRET` — Stripe webhook signing secret
- `SUPABASE_SERVICE_ROLE_KEY` — Supabase service-role key (used by `lib/supabase-admin.ts` for Stripe webhook)

## Git Workflow

Three permanent worktrees for parallel work sessions:

| Worktree | Directory | Branch prefix | Use for |
|---|---|---|---|
| Main | `inburgering-app` | — | Reference only, don't work here |
| Features | `inburgering-app-features` | `features/` | New features |
| Bug fixes | `inburgering-app-bug-fix` | `fix/` | Bug fixes |
| Marketing | `inburgering-app-mktg` | `mktg/` | Content & marketing |

**Starting a task:** Tell Claude "start working on [thing]" — Claude will:
1. Check the worktree is clean and up-to-date with main
2. Create a branch with the right prefix
3. Push the branch immediately

**Finishing a task:** Tell Claude "ship it" or "commit and create a PR" — Claude will:
1. Commit, push, and create a PR
2. After you merge on GitHub, tell Claude "PR merged, clean up" — Claude resets the worktree

**If something looks wrong:** Tell Claude "check git health" — Claude will diagnose and fix.

No manual git commands needed. Claude handles all git operations. See `docs/WORKTREE-WORKFLOW.md` for parallel session guidance and conflict avoidance.

---

## Active Gotchas

Current issues that will bite you if you don't know about them. Max 5 items — remove when resolved.

1. **Build error:** `npm run build` fails on `/learn/knm/exam` (Next.js 16 InvariantError). `npx tsc --noEmit` passes clean. Not blocking dev work.
2. **Blog HTML in markdown:** Blog posts use `div` and `span` with classes (`.stat-box`, `.takeaway-box`, `.tip-box`, `.warning-box`) inside markdown files. DOMPurify allows these. Don't strip them.

---

## Known Issues & Tech Debt

### PLACEHOLDER Content (not real data)
- `components/landing/Testimonials.tsx` — All testimonials are placeholder
- `components/landing/TrustStats.tsx` — All stats are placeholder values
- `components/landing/Pricing.tsx` — All pricing and features are placeholder
- `components/landing/FinalCTA.tsx` — Stat is placeholder
- `components/landing/HowItWorks.tsx` — Question count is placeholder
- `components/landing/LandingHero.tsx` — Badge stat, social proof, score stat, streak stat all placeholder

### Architecture Notes
- `lib/content.ts` is a monolith — statically imports every single content JSON file (100+ imports). Any new content file must be added here manually.
- The mobile app (`/mobile/`) has its own copies of `hooks/`, `lib/`, and `constants/` rather than sharing with web — changes must be made in both places
- No test files exist anywhere in the codebase
- Blog uses `isomorphic-dompurify` for sanitization — adds bundle weight

### Existing Bug Tracker
- See `docs/BUGS.md` for tracked bugs

---

# Behavioral Guidelines

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
- "Add validation" -> "Write tests for invalid inputs, then make them pass"
- "Fix the bug" -> "Write a test that reproduces it, then make it pass"
- "Refactor X" -> "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] -> verify: [check]
2. [Step] -> verify: [check]
3. [Step] -> verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.
