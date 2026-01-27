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
