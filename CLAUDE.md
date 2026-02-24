# CLAUDE.md — Project Memory & Session Rules

## Rules for Claude Code

### 1. Token Efficiency
- NEVER re-read files that are already documented below unless I explicitly ask you to
- When I ask you to change something, go DIRECTLY to the relevant file(s) listed in the Architecture Map
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
- **Styling:** Tailwind CSS 4 + shadcn/ui (Radix UI primitives) + CSS custom properties design system (see Design System below)
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

## Architecture Map

```
/
├── app/                          # Next.js App Router pages
│   ├── layout.tsx                # Root layout — font, AuthProvider, FeedbackWidget, JsonLd, GA
│   ├── page.tsx                  # Landing page — assembles all landing/ components
│   ├── globals.css               # Design tokens, utility classes, Tailwind config
│   ├── not-found.tsx             # Custom 404 page
│   ├── robots.ts                 # SEO robots.txt handler
│   ├── sitemap.ts                # SEO sitemap.xml handler
│   ├── manifest.ts               # PWA manifest handler
│   │
│   ├── auth/                     # Auth routes (login, signup, reset, callback)
│   │   ├── login/page.tsx        # Login form page
│   │   ├── signup/page.tsx       # Signup form page
│   │   ├── reset-password/page.tsx
│   │   ├── update-password/page.tsx
│   │   └── callback/route.ts     # OAuth callback handler (server)
│   │
│   ├── learn/                    # Main learning area (protected)
│   │   ├── layout.tsx            # SEO layout wrapper for /learn/*
│   │   ├── loading.tsx           # Loading spinner
│   │   ├── page.tsx              # Module dashboard — shows all 5 modules + progress
│   │   ├── lezen/                # Reading module
│   │   │   ├── layout.tsx        # SEO metadata for lezen
│   │   │   ├── select/page.tsx   # Mock exam selector
│   │   │   ├── exam/page.tsx     # Practice exam (all passages shuffled)
│   │   │   └── mock/[examId]/page.tsx  # Specific mock exam
│   │   ├── knm/                  # KNM (society knowledge) module — same structure
│   │   │   ├── layout.tsx
│   │   │   ├── select/page.tsx
│   │   │   ├── exam/page.tsx
│   │   │   └── mock/[examId]/page.tsx
│   │   ├── luisteren/            # Listening module — same structure
│   │   │   ├── layout.tsx
│   │   │   ├── select/page.tsx
│   │   │   ├── exam/page.tsx
│   │   │   └── mock/[examId]/page.tsx
│   │   ├── schrijven/            # Writing module
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx          # Task list
│   │   │   ├── [taskId]/page.tsx # Individual writing task
│   │   │   ├── select/page.tsx   # Mock exam selector
│   │   │   └── mock/[examId]/page.tsx  # Specific mock exam
│   │   └── spreken/              # Speaking module
│   │       ├── layout.tsx
│   │       ├── page.tsx          # Task list
│   │       ├── [taskId]/page.tsx # Individual speaking task
│   │       ├── select/page.tsx   # Mock exam selector
│   │       └── mock/[examId]/page.tsx  # Specific mock exam
│   │
│   ├── try/                      # Quick assessment / free trial
│   │   ├── layout.tsx            # SEO layout for /try/*
│   │   ├── page.tsx              # Module picker for quick assessment
│   │   ├── [module]/page.tsx     # Quick assessment exam flow
│   │   ├── [module]/results/page.tsx  # Results with upsell
│   │   ├── schrijven/page.tsx    # Quick writing assessment
│   │   └── spreken/page.tsx      # Quick speaking assessment
│   │
│   ├── blog/                     # Blog pages
│   │   ├── page.tsx              # Blog index
│   │   ├── [slug]/page.tsx       # Individual blog post (markdown-rendered)
│   │   └── learning-resources/page.tsx  # Static resources page
│   │
│   ├── api/                      # API routes (server-side)
│   │   ├── progress/route.ts     # Cloud progress sync (Supabase)
│   │   ├── exam-results/route.ts # Save exam results (Supabase)
│   │   ├── feedback/route.ts     # User feedback submission
│   │   ├── subscribe/route.ts    # Email subscription
│   │   ├── tts/route.ts          # Azure Text-to-Speech proxy
│   │   ├── reddit-response/route.ts  # Reddit engagement tool API
│   │   ├── loops/events/route.ts # Loops CRM event relay (client → server)
│   │   └── stripe/               # Stripe payment routes
│   │       ├── checkout/route.ts # Stripe checkout session creation
│   │       └── webhook/route.ts  # Stripe webhook handler
│   │
│   ├── profile/page.tsx          # User profile + progress dashboard
│   ├── upgrade/page.tsx          # Upgrade/pricing page
│   ├── faq/page.tsx              # FAQ with FAQPage schema
│   ├── guide/page.tsx            # Cornerstone content guide
│   ├── contact/page.tsx          # Contact page
│   ├── privacy/page.tsx          # Privacy policy
│   ├── terms/page.tsx            # Terms of service
│   └── tools/reddit/page.tsx     # Reddit engagement tool
│
├── components/                   # React components
│   ├── landing/                  # Landing page sections (barrel-exported via index.ts)
│   │   ├── index.ts              # Barrel exports for all landing components
│   │   ├── LandingNav.tsx        # Fixed glass-blur navbar
│   │   ├── LandingHero.tsx       # Hero section with auth-aware CTA
│   │   ├── TrustStats.tsx        # Social proof stats bar (PLACEHOLDER)
│   │   ├── ProblemSolution.tsx   # Problem/solution section
│   │   ├── HowItWorks.tsx        # 3-step how it works
│   │   ├── WhyUs.tsx             # Features/why us section
│   │   ├── Testimonials.tsx      # User testimonials (PLACEHOLDER)
│   │   ├── Pricing.tsx           # Pricing cards (PLACEHOLDER)
│   │   ├── FAQ.tsx               # Landing FAQ accordion
│   │   ├── BlogPreview.tsx       # Recent blog posts (server component compatible)
│   │   ├── FinalCTA.tsx          # Dark-bg final call to action
│   │   ├── LandingFooter.tsx     # Site footer (reused across many pages)
│   │   └── ScrollRevealInit.tsx  # IntersectionObserver animation wrapper
│   │
│   ├── auth/                     # Auth form components
│   │   ├── index.ts              # Barrel export
│   │   ├── AuthForm.tsx          # Shared auth form wrapper
│   │   ├── LoginForm.tsx         # Login form
│   │   ├── SignupForm.tsx        # Signup form
│   │   ├── ResetPasswordForm.tsx # Password reset form
│   │   └── UpdatePasswordForm.tsx
│   │
│   ├── schrijven/                # Writing module components
│   │   ├── FormInput.tsx         # Form-type question input
│   │   ├── WritingInput.tsx      # Free-text writing input
│   │   ├── WritingResults.tsx    # Writing task results display
│   │   └── SelfAssessment.tsx    # Writing self-assessment rubric
│   │
│   ├── spreken/                  # Speaking module components
│   │   ├── AudioRecorder.tsx     # Mic recording component
│   │   ├── SpeakingPrompt.tsx    # Speaking task prompt display
│   │   ├── SpeakingResults.tsx   # Speaking results display
│   │   └── SpeakingSelfAssessment.tsx  # Speaking self-assessment rubric
│   │
│   ├── ui/                       # shadcn/ui primitives (Radix-based)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── progress.tsx
│   │   └── radio-group.tsx
│   │
│   ├── ExamLayout.tsx            # Shared exam page layout wrapper
│   ├── ExamHeader.tsx            # Exam top bar (timer, progress, title)
│   ├── ExamIntroScreen.tsx       # Exam start screen with audio preview
│   ├── ExamQuestionPanel.tsx     # Question display with radio options
│   ├── ExamBottomNav.tsx         # Exam navigation bar (prev/next/submit)
│   ├── ExamCard.tsx              # Exam selection card on select pages
│   ├── ContentPanel.tsx          # Passage/content display with audio
│   ├── QuestionGrid.tsx          # Question number grid for navigation
│   ├── ResultsSummary.tsx        # Exam results with score breakdown
│   ├── DifficultySelector.tsx    # A1/A2 difficulty filter
│   ├── AudioPlayer.tsx           # Text-to-speech audio player
│   ├── ErrorBoundary.tsx         # React error boundary
│   ├── ExitWarningModal.tsx      # "Are you sure?" modal for exam exit
│   ├── FeedbackWidget.tsx        # Floating feedback button
│   ├── GoogleAnalytics.tsx       # GA4 script component
│   ├── GoogleSignInButton.tsx    # Google OAuth sign-in button
│   ├── JsonLd.tsx                # JSON-LD structured data component
│   └── MockupNote.tsx            # Dev/placeholder notice
│
├── content/                      # All exercise content (static JSON + blog markdown)
│   ├── index.json                # Top-level module index
│   ├── passages/                 # Lezen reading passages (10 JSON files)
│   ├── knm/                      # KNM topics
│   │   ├── index.json
│   │   └── topics/               # 8 topic JSON files
│   ├── luisteren/                # Listening exercises
│   │   ├── index.json
│   │   └── exercises/            # 10 exercise JSON files
│   ├── schrijven/                # Writing tasks
│   │   ├── index.json
│   │   └── tasks/                # 8 task JSON files
│   ├── spreken/                  # Speaking tasks
│   │   ├── index.json
│   │   └── tasks/                # 12 task JSON files (A1 + A2)
│   ├── mock-exams/               # Mock exams per module
│   │   ├── lezen/                # 4 mock exams + index
│   │   ├── knm/                  # 4 mock exams + index
│   │   ├── luisteren/            # 6 mock exams + index
│   │   ├── schrijven/            # Writing mock exams + index
│   │   └── spreken/              # Speaking mock exams + index
│   ├── quick-assessment/         # Quick trial content
│   │   ├── index.json
│   │   ├── knm.json
│   │   ├── lezen.json
│   │   ├── luisteren.json
│   │   ├── schrijven.json
│   │   └── spreken.json
│   └── blog/                     # Blog posts — frontmatter: title, slug, description, date, author, keywords
│       ├── scheduled/            # Pre-written posts for auto-publishing
│       │   └── YYYY-MM-DD-slug.md  # 12 scheduled posts (Feb–May 2026)
│       ├── inburgering-exam-guide-professionals-2026.md
│       ├── inburgering-kennismigranten-30-percent-ruling.md
│       └── knm-exam-2026-new-format.md
│
├── contexts/
│   └── AuthContext.tsx            # Auth provider + useAuth hook (Supabase)
│
├── hooks/
│   ├── useProgress.ts            # Progress read/write (useSyncExternalStore + localStorage)
│   ├── useExamState.ts           # Exam flow state machine (questions, answers, timer)
│   ├── useExitWarning.ts         # Browser beforeunload warning
│   ├── useScrollReveal.ts        # IntersectionObserver for scroll animations
│   ├── useAzureTTS.ts            # Azure Text-to-Speech hook
│   └── useAudioRecorder.ts       # Mic recording hook for spreken
│
├── lib/
│   ├── content.ts                # Central content loader — imports ALL JSON, exports getter functions
│   ├── types.ts                  # All TypeScript interfaces (Question, Passage, Progress, etc.)
│   ├── progress.ts               # localStorage progress read/write utilities
│   ├── blog.ts                   # Blog markdown parser (gray-matter + marked + DOMPurify)
│   ├── utils.ts                  # Utility: cn() for classnames, formatTime(), isPassing()
│   ├── supabase.ts               # Supabase client (admin/general)
│   ├── supabase-browser.ts       # Supabase client for browser/client components
│   ├── supabase-server.ts        # Supabase client for server/API routes
│   ├── supabase-admin.ts         # Supabase service-role client (used by Stripe webhook)
│   ├── loops.ts                  # Loops CRM SDK wrapper (server-side only)
│   ├── rate-limit.ts             # API rate limiting utility
│   └── validate-redirect.ts      # Safe redirect URL validation
│
├── mobile/                       # Expo React Native app
│   ├── app/                      # Expo Router pages
│   │   ├── _layout.tsx           # Root layout
│   │   ├── (tabs)/               # Tab navigation
│   │   │   ├── _layout.tsx       # Tab bar config
│   │   │   ├── index.tsx         # Home/module list
│   │   │   ├── profile.tsx       # Profile screen
│   │   │   └── quicktest.tsx     # Quick assessment
│   │   ├── learn/[module]/       # Learning screens
│   │   │   ├── index.tsx         # Module exam list
│   │   │   └── [examId].tsx      # Exam flow
│   │   └── +not-found.tsx
│   ├── constants/                # Design tokens (Colors, Shadows, Typography)
│   ├── hooks/                    # Mobile-specific hooks (useExamState, useProgress)
│   ├── lib/                      # Mobile-specific lib (content, progress, types, utils)
│   └── package.json
│
├── .github/
│   └── workflows/
│       └── scheduled-publish.yml # Cron: publishes scheduled blog posts every Tuesday
│
├── scripts/
│   ├── generate-audio-azure.ts   # Azure TTS audio generation script
│   └── generate-audio-google.ts  # Google TTS audio generation script
│
├── docs/                         # Documentation
│   ├── ARCHITECTURE.md           # Comprehensive architecture reference
│   ├── BUGS.md                   # Known bugs
│   ├── PRODUCT-ROADMAP.md        # Product roadmap
│   ├── WORKTREE-WORKFLOW.md      # Git worktree workflow guide
│   ├── CONTENT-CALENDAR.md       # Content publishing calendar
│   ├── MARKETING.md              # Marketing strategy
│   ├── marketing/                # Marketing docs
│   │   ├── passinburgering-playbook.md
│   │   └── WRITING-STYLE-GUIDE.md
│   ├── plans/                    # Implementation plans
│   │   └── crm-email-templates.md # Loops drip campaign email content
│   ├── prds/                     # Product requirement docs (PRD-01 through PRD-09)
│   ├── templates/                # Document templates
│   └── README.md
│
├── middleware.ts                  # Next.js middleware (route protection)
├── CLAUDE.md                     # This file
├── package.json
├── tsconfig.json
└── components.json               # shadcn/ui config
```

## File Dependency Map

### High-Impact Files (imported by many)

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

### Module-Level Dependencies

```
Exam pages (lezen/knm/luisteren exam & mock)
  → ExamLayout, ExamHeader, ContentPanel, QuestionGrid, ResultsSummary
  → useExamState, useProgress, useAuth
  → lib/content (getter functions), lib/types

Writing pages (schrijven)
  → schrijven/ components (FormInput, WritingInput, WritingResults, SelfAssessment)
  → useProgress, lib/content, lib/types

Speaking pages (spreken)
  → spreken/ components (AudioRecorder, SpeakingPrompt, SpeakingResults, SpeakingSelfAssessment)
  → useProgress, useAzureTTS, useAudioRecorder, lib/content, lib/types

Landing page (app/page.tsx)
  → components/landing/* (all via barrel import from components/landing/index.ts)
  → components/JsonLd

Auth system
  → contexts/AuthContext.tsx → lib/supabase-browser.ts, lib/validate-redirect.ts
  → components/auth/* → contexts/AuthContext.tsx
  → middleware.ts (route protection, standalone — only imports next/server)
  → app/auth/callback/route.ts → lib/supabase-server.ts, lib/loops.ts

Blog system
  → lib/blog.ts (gray-matter, marked, DOMPurify)
  → app/blog/* pages, components/landing/BlogPreview.tsx, app/sitemap.ts

CRM / Loops drip campaign
  → lib/loops.ts (server-side Loops SDK wrapper)
  → app/api/loops/events/route.ts → lib/loops.ts, lib/rate-limit.ts
  → app/auth/callback/route.ts fires user_signed_up (server-side)
  → app/try/[module]/results/page.tsx fires quick_assessment_completed (via API)
  → hooks/useProgress.ts fires exercise_completed (via API)

API routes
  → lib/supabase-server.ts (progress, exam-results, auth callback)
  → lib/supabase-admin.ts (stripe webhook — service-role client)
  → lib/supabase.ts (feedback, subscribe)
  → lib/loops.ts (loops/events, auth callback)
  → lib/rate-limit.ts (tts, reddit-response, loops/events)

Stripe payments
  → app/api/stripe/checkout/route.ts → creates Stripe checkout sessions
  → app/api/stripe/webhook/route.ts → lib/supabase-admin.ts (elevates user metadata on payment)
```

## Design System

**Fonts:**
- Plus Jakarta Sans (weights 400-800), variable `--font-jakarta` — UI, headings, nav
- Source Serif 4 (weights 400-700), variable `--font-serif` — blog body text (`.prose-navy`)
- No dark mode.

**Tokens** (defined in `app/globals.css` `:root`):

| Category | Token | Value | Usage |
|----------|-------|-------|-------|
| Ink | `--ink` | `#1a1a2e` | Primary text |
| | `--ink-soft` | `#4a4a6a` | Secondary text |
| | `--ink-muted` | `#8888a4` | Tertiary text |
| Cream | `--cream` | `#FDFBF7` | Page background |
| | `--cream-dark` | `#F5F1EA` | Neutral surfaces |
| Accent | `--accent` | `#E8632B` | CTAs, links |
| | `--accent-glow` | `#FF7A3D` | Hover states |
| | `--accent-soft` | `#FFF0E8` | Light orange bg |
| Green | `--green` | `#2D8F5E` | Success |
| | `--green-soft` | `#E8F5EE` | Light green bg |
| Blue | `--blue` | `#3B6BCC` | Info |
| | `--blue-soft` | `#EBF0FA` | Light blue bg |
| Shadow | `--shadow-card` | `0 2px 24px ...` | Card resting |
| | `--shadow-hover` | `0 8px 40px ...` | Card hover |

**CSS utility classes:**
- `landing-card` — white card with `--shadow-card`, hover lift
- `cta-primary` — orange button with glow shadow
- `.reveal` / `.reveal.visible` — scroll-triggered fade-in (IntersectionObserver via `useScrollReveal`)
- `.animate-reveal`, `.animate-reveal-delay-{1-4}` — entrance animations with staggered delays
- `.prose-navy` — blog/long-form content typography (serif body, sans-serif headings)
- `.stat-box` / `.stat-number` / `.stat-label` — prominent stat highlight (white card, orange number)
- `.takeaway-box` — blue-bg key insight box (left blue border)
- `.tip-box` — green-bg pro tip box (left green border)
- `.warning-box` — orange-bg warning box (left orange border)

**Landing page patterns:**
- Backgrounds alternate: cream (default) -> `bg-white` -> cream -> `bg-white` -> ... -> `bg-[var(--ink)]` (FinalCTA)
- Section IDs: `#problem`, `#how`, `#features`, `#testimonials`, `#pricing`
- Anchor links: use native `<a href="#id">` not Next.js `<Link>` (smooth scroll via `html { scroll-behavior: smooth }`)
- Auth-aware CTAs: `LandingHero`, `Pricing`, `FinalCTA`, `LandingNav` use `useAuth()`
- PLACEHOLDER content flagged throughout landing components (stats, testimonials, pricing)

**Full reference:** See `docs/ARCHITECTURE.md` for comprehensive details.

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
