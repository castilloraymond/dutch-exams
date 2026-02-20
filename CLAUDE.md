# CLAUDE.md — Project Memory & Session Rules

## Rules for Claude Code (read this first every session)

### 1. Token Efficiency
- NEVER re-read files that are already documented here or in `docs/ARCHITECTURE.md` unless I explicitly ask you to
- When I ask you to change something, go DIRECTLY to the relevant file(s)
- If you need to explore, check this document and `docs/ARCHITECTURE.md` before scanning the codebase
- Prefer targeted edits (str_replace) over rewriting entire files

### 2. Translate My Requests
- I'm not a developer by training. When I describe something in plain English, do the following:
  - First, confirm what you think I mean in technical terms (1-2 sentences max)
  - Then do the work
  - If my request is ambiguous, ask me a SPECIFIC multiple-choice question rather than an open-ended one
  - Example: Instead of "What do you want to change?" ask "Do you want to (A) change the button color, (B) change what happens when the button is clicked, or (C) something else?"

### 3. After Every Task
- After completing any change, append a brief note to `memory/session-history.md` with:
  - Date
  - What was changed (which files, what the change does)
  - Why (the plain English intent behind the change)
  - Any side effects or things to watch out for
- If you discover something new about the codebase that isn't documented here, add it to the relevant section

### 4. Before Starting Work
- Read this entire CLAUDE.md file first
- Tell me which file(s) you plan to edit BEFORE making changes
- If the task touches more than 3 files, give me a quick plan first

### 5. Continuous Learning
- If you notice I keep asking for similar types of changes, suggest a pattern or shortcut
- If you find repeated code that could be simplified, flag it in Known Issues & Tech Debt
- Track which files I modify most often — these are my "hot files"

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

### Data Flow

```
User interaction → Page component ("use client")
  → useExamState (question navigation, answers)
  → useProgress (read/write localStorage via lib/progress.ts)
  → lib/content.ts (static JSON imports at build time)
  → Content JSON files in /content/
```

Auth flow:
```
AuthProvider (root layout) → useAuth() hook
  → lib/supabase-browser.ts (client-side)
  → lib/supabase-server.ts (API routes, auth callback)
  → middleware.ts (route protection)
```

## Reference Files

For detailed information not needed every session, see:
- **Full directory tree, dependencies, design system, component reference** → `docs/ARCHITECTURE.md`
- **Session history & change log** → `memory/session-history.md`
- **Cross-session learnings** → `memory/MEMORY.md` (auto-loaded)

## Modules

| Module | Route | Content |
|--------|-------|---------|
| Lezen (Reading) | `/learn/lezen/select`, `/learn/lezen/exam`, `/learn/lezen/mock/[examId]` | 10 mock exams (4 A1 + 4 A2 + 2 B1) |
| KNM (Society) | `/learn/knm/select`, `/learn/knm/exam`, `/learn/knm/mock/[examId]` | 10 mock exams (4 A1 + 4 A2 + 2 B1) |
| Luisteren (Listening) | `/learn/luisteren/select`, `/learn/luisteren/exam`, `/learn/luisteren/mock/[examId]` | 14 mock exams (4 A1 + 8 A2 + 2 B1) |
| Schrijven (Writing) | `/learn/schrijven/select`, `/learn/schrijven/mock/[examId]` | 6 mock exams (2 A1 + 2 A2 + 2 B1) |
| Spreken (Speaking) | `/learn/spreken/select`, `/learn/spreken/mock/[examId]` | 6 mock exams (2 A1 + 2 A2 + 2 B1) |

**Total: 46 mock exams across all modules.**

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

## File Conventions

- Exercise content: `/content/<module>/` as JSON
- Each module index: `/content/<module>/index.json`
- Mock exams: `/content/mock-exams/<module>/` with index.json + exam files
- Quick assessment: `/content/quick-assessment/` per-module JSON
- Blog posts: `/content/blog/*.md` with frontmatter (title, slug, description, date, author, keywords) — 13 posts total
- UI components: `/components/ui/` (shadcn primitives — button, card, input, label, progress, radio-group)
- Feature components: `/components/` (AudioPlayer, ExamLayout, ResultsSummary, etc.)
- Module-specific components: `/components/schrijven/`, `/components/spreken/`
- Landing components: `/components/landing/` (barrel-exported via `index.ts`)
- Auth components: `/components/auth/` (barrel-exported via `index.ts`)
- Hooks: `/hooks/` (useProgress, useExamState, useExitWarning, useScrollReveal, useAzureTTS, useAudioRecorder)
- Lib: `/lib/` (content, types, progress, blog, utils, loops, supabase-*, rate-limit, validate-redirect)

## Environment Variables (Optional)

- `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase anonymous key
- `LOOPS_API_KEY` — Loops CRM API key (server-side only, used in `lib/loops.ts`)
- Azure TTS credentials (used in `app/api/tts/route.ts`)

## Git Workflow — Permanent 3-Worktree Setup

Three permanent worktrees, one per work domain. See `docs/WORKTREE-WORKFLOW.md` for full guide.

| Worktree | Prefix | Domain |
|---|---|---|
| `inburgering-app-features` | `features/` | New features |
| `inburgering-app-bug-fix` | `fix/` | Bug fixes |
| `inburgering-app-mktg` | `mktg/` | Marketing & content |

**Key rules:**
- Never work directly on main — always create a branch in the appropriate worktree
- Worktrees sit in detached HEAD between tasks — `git checkout -b <prefix>/name` to start
- Push branches immediately after creating them
- Commit after each meaningful unit of work
- Merge via GitHub PR, never locally

**Start a task:**
```bash
cd ../inburgering-app-features
git checkout -b features/my-feature
# work, commit, push
```

**After merge — reset worktree:**
```bash
git fetch origin && git checkout --detach origin/main
git branch -d features/my-feature
git push origin --delete features/my-feature
```

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
