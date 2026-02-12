# Architecture Reference

> Comprehensive reference for the passinburgering codebase. Read this instead of exploring files — it covers every system, route, component, and pattern.

---

## 1. Tech Stack & Versions

| Technology | Version | Purpose |
|-----------|---------|---------|
| Next.js | 16.1.4 | App Router framework |
| React | 19.2.3 | UI library |
| TypeScript | 5.9.3 | Type safety |
| Tailwind CSS | 4 | Utility-first CSS |
| shadcn/ui | (Radix UI) | UI primitives (Label, Progress, RadioGroup, Slot) |
| Supabase | 2.91.1 | Auth, database, cloud sync |
| @supabase/ssr | 0.8.0 | Server-side Supabase helpers |
| lucide-react | 0.563.0 | Icon library |
| marked | 17.0.1 | Markdown → HTML |
| gray-matter | 4.0.3 | Front-matter parsing |
| isomorphic-dompurify | 2.36.0 | HTML sanitization |
| class-variance-authority | 0.7.1 | Component variant styling |
| clsx + tailwind-merge | — | Class name utilities |
| tw-animate-css | 1.4.0 | Animation utilities (dev) |

---

## 2. Project Structure

```
├── app/                    # Next.js App Router
│   ├── layout.tsx          # Root layout (fonts, providers, metadata)
│   ├── page.tsx            # Landing page (11 sections)
│   ├── globals.css         # Design tokens, utility classes, prose styles
│   ├── auth/               # Login, signup, reset, callback
│   ├── blog/               # Blog index + [slug] + learning-resources
│   ├── learn/              # Module dashboard + all 5 modules
│   │   ├── lezen/          # Reading: select, exam, mock/[examId]
│   │   ├── knm/            # Society: select, exam, mock/[examId]
│   │   ├── luisteren/      # Listening: select, exam, mock/[examId]
│   │   ├── schrijven/      # Writing: index + [taskId]
│   │   └── spreken/        # Speaking: index + [taskId]
│   ├── try/                # Quick assessment: [module] + results
│   ├── api/                # Route handlers (exam-results, feedback, progress, subscribe)
│   ├── guide/              # SEO cornerstone content
│   ├── faq/                # FAQ page with schema
│   ├── profile/            # User profile
│   ├── upgrade/            # Subscription page
│   ├── contact/            # Contact form
│   ├── privacy/            # Privacy policy
│   ├── terms/              # Terms of service
│   ├── robots.ts           # SEO robots.txt
│   ├── sitemap.ts          # Dynamic sitemap
│   └── manifest.ts         # PWA manifest
├── components/
│   ├── landing/            # Landing page sections (13 components)
│   ├── ui/                 # shadcn primitives (Button, Card, Label, etc.)
│   ├── auth/               # Auth forms (Login, Signup, Reset, Update)
│   ├── schrijven/          # Writing module components
│   ├── spreken/            # Speaking module components
│   ├── Exam*.tsx           # Exam UI (Layout, Header, BottomNav, Card, etc.)
│   ├── AudioPlayer.tsx     # Listening audio player
│   ├── ContentPanel.tsx    # Passage/transcript display
│   ├── ResultsSummary.tsx  # Exam results
│   ├── FeedbackWidget.tsx  # In-page feedback form
│   ├── GoogleAnalytics.tsx # GA4 script
│   ├── JsonLd.tsx          # JSON-LD schema component
│   └── ErrorBoundary.tsx   # React error boundary
├── content/                # Static JSON content (all modules)
│   ├── lezen/              # Reading passages
│   ├── knm/                # Society topics
│   ├── luisteren/          # Listening exercises
│   ├── schrijven/          # Writing tasks
│   ├── spreken/            # Speaking tasks
│   ├── mock-exams/         # Full mock exams
│   ├── quick-assessment/   # Quick assessment questions
│   └── blog/               # Markdown blog posts
├── contexts/
│   └── AuthContext.tsx      # Auth provider (Supabase)
├── hooks/
│   ├── useProgress.ts      # Progress tracking (localStorage + cloud)
│   ├── useExamState.ts     # Exam navigation state
│   ├── useAudioRecorder.ts # Web Audio recording
│   └── useScrollReveal.ts  # Scroll-triggered animations
├── lib/
│   ├── content.ts          # Content loader (30+ functions)
│   ├── blog.ts             # Blog loader (markdown pipeline)
│   ├── types.ts            # TypeScript type definitions (40+ interfaces)
│   ├── progress.ts         # localStorage helpers
│   ├── supabase.ts         # Supabase client singleton
│   ├── supabase-browser.ts # Browser-side client
│   ├── supabase-server.ts  # Server-side client
│   ├── rate-limit.ts       # In-memory rate limiter
│   ├── validate-redirect.ts # Safe redirect validation
│   └── utils.ts            # Utility helpers
├── public/                 # Static assets (favicons, images, audio)
├── docs/                   # Documentation, PRDs, specs
├── scripts/                # Audio generation scripts (Google, Azure TTS)
├── supabase/               # Database migrations
└── middleware.ts            # Next.js middleware (auth, redirects)
```

---

## 3. Design System

### Font

**Plus Jakarta Sans** — single font, variable `--font-jakarta`, weights 400–800. No dark mode.

### Color Tokens

Defined in `app/globals.css` `:root`:

| Category | Token | Hex | Usage |
|----------|-------|-----|-------|
| **Ink** | `--ink` | `#1a1a2e` | Primary text, headings |
| | `--ink-soft` | `#4a4a6a` | Secondary text, descriptions |
| | `--ink-muted` | `#8888a4` | Tertiary text, placeholders |
| **Cream** | `--cream` | `#FDFBF7` | Page background |
| | `--cream-dark` | `#F5F1EA` | Neutral surfaces, secondary bg |
| **Accent** | `--accent` | `#E8632B` | CTAs, links, active states |
| | `--accent-glow` | `#FF7A3D` | Hover states |
| | `--accent-soft` | `#FFF0E8` | Light orange backgrounds |
| **Green** | `--green` | `#2D8F5E` | Success, correct answers |
| | `--green-soft` | `#E8F5EE` | Light green backgrounds |
| **Blue** | `--blue` | `#3B6BCC` | Info, links |
| | `--blue-soft` | `#EBF0FA` | Light blue backgrounds |
| **Shadow** | `--shadow-card` | `0 2px 24px rgba(26,26,46,0.06)` | Card resting state |
| | `--shadow-hover` | `0 8px 40px rgba(26,26,46,0.10)` | Card hover state |

### CSS Utility Classes

| Class | Purpose | Defined in |
|-------|---------|-----------|
| `.landing-card` | White card with shadow, hover lift effect | `globals.css` |
| `.cta-primary` | Orange CTA button with glow shadow, hover animation | `globals.css` |
| `.reveal` | Scroll-triggered fade-in (opacity 0, translateY 30px) | `globals.css` |
| `.reveal.visible` | Visible state (opacity 1, translateY 0) | `globals.css` |
| `.animate-reveal` | Entrance animation (0.7s ease-out) | `globals.css` |
| `.animate-reveal-delay-{1-4}` | Staggered entrance (0.1s–0.4s delay) | `globals.css` |
| `.prose-navy` | Blog/long-form typography (headings, lists, blockquotes, code) | `globals.css` |

### Scroll Reveal System

- `useScrollReveal` hook uses IntersectionObserver to add `.visible` class to `.reveal` elements
- `ScrollRevealInit` client component initializes the observer on the landing page
- Transition: `all 0.7s cubic-bezier(0.22, 1, 0.36, 1)`

### Background Alternation Pattern (Landing Page)

Sections alternate backgrounds to create visual rhythm:

| Section | Background |
|---------|-----------|
| Hero | cream (default) |
| TrustBar | cream (default) |
| ProblemSection | cream (default) |
| HowItWorks | `bg-white` |
| Features | cream (default) + dark subsection |
| Testimonials | `bg-white` |
| Pricing | cream (default) |
| FAQ | `bg-white` |
| BlogPreview | cream (default) |
| FinalCTA | `bg-[var(--ink)]` (dark) |
| Footer | `bg-[var(--cream)]` |

---

## 4. Routing Map

### Public Pages

| Route | File | Notes |
|-------|------|-------|
| `/` | `app/page.tsx` | Landing page (server component with client sections) |
| `/guide` | `app/guide/page.tsx` | SEO cornerstone (~1500 words) + Article JSON-LD |
| `/faq` | `app/faq/page.tsx` | 18 Q&As + FAQPage JSON-LD |
| `/blog` | `app/blog/page.tsx` | Blog index |
| `/blog/[slug]` | `app/blog/[slug]/page.tsx` | Dynamic blog post + BlogPosting JSON-LD |
| `/blog/learning-resources` | `app/blog/learning-resources/page.tsx` | Static guide page |
| `/contact` | `app/contact/page.tsx` | Contact form |
| `/privacy` | `app/privacy/page.tsx` | Privacy policy (no-index) |
| `/terms` | `app/terms/page.tsx` | Terms of service (no-index) |
| `/upgrade` | `app/upgrade/page.tsx` | Subscription page |

### Quick Assessment (`/try/`)

| Route | File | Notes |
|-------|------|-------|
| `/try` | `app/try/page.tsx` | Module selector |
| `/try/[module]` | `app/try/[module]/page.tsx` | Assessment (lezen, knm, luisteren) |
| `/try/[module]/results` | `app/try/[module]/results/page.tsx` | Results page |
| `/try/schrijven` | `app/try/schrijven/page.tsx` | Writing preview |
| `/try/spreken` | `app/try/spreken/page.tsx` | Speaking preview |

### Learning Modules (`/learn/`)

| Route | File | Notes |
|-------|------|-------|
| `/learn` | `app/learn/page.tsx` | Module dashboard |
| `/learn/lezen/select` | `app/learn/lezen/select/page.tsx` | Exam variant selector |
| `/learn/lezen/exam` | `app/learn/lezen/exam/page.tsx` | Full reading exam |
| `/learn/lezen/mock/[examId]` | `app/learn/lezen/mock/[examId]/page.tsx` | Mock exam |
| `/learn/knm/select` | `app/learn/knm/select/page.tsx` | Exam variant selector |
| `/learn/knm/exam` | `app/learn/knm/exam/page.tsx` | Full KNM exam |
| `/learn/knm/mock/[examId]` | `app/learn/knm/mock/[examId]/page.tsx` | Mock exam |
| `/learn/luisteren/select` | `app/learn/luisteren/select/page.tsx` | Exam variant selector |
| `/learn/luisteren/exam` | `app/learn/luisteren/exam/page.tsx` | Full listening exam |
| `/learn/luisteren/mock/[examId]` | `app/learn/luisteren/mock/[examId]/page.tsx` | Mock exam |
| `/learn/schrijven` | `app/learn/schrijven/page.tsx` | Task selector |
| `/learn/schrijven/[taskId]` | `app/learn/schrijven/[taskId]/page.tsx` | Individual task |
| `/learn/spreken` | `app/learn/spreken/page.tsx` | Task selector (parts 1–4) |
| `/learn/spreken/[taskId]` | `app/learn/spreken/[taskId]/page.tsx` | Individual task |

### Auth Routes

| Route | File | Notes |
|-------|------|-------|
| `/auth/login` | `app/auth/login/page.tsx` | Email/password login |
| `/auth/signup` | `app/auth/signup/page.tsx` | Email/password signup |
| `/auth/reset-password` | `app/auth/reset-password/page.tsx` | Password reset request |
| `/auth/update-password` | `app/auth/update-password/page.tsx` | Password update (recovery) |
| `/auth/callback` | `app/auth/callback/route.ts` | OAuth/email confirmation handler |

### User Pages

| Route | File | Notes |
|-------|------|-------|
| `/profile` | `app/profile/page.tsx` | User profile (auth-protected) |

### API Routes

| Route | File | Methods |
|-------|------|---------|
| `/api/exam-results` | `app/api/exam-results/route.ts` | GET, POST |
| `/api/feedback` | `app/api/feedback/route.ts` | POST |
| `/api/progress` | `app/api/progress/route.ts` | GET, POST |
| `/api/subscribe` | `app/api/subscribe/route.ts` | POST |

### Metadata Routes

| Route | File | Type |
|-------|------|------|
| `/robots.txt` | `app/robots.ts` | MetadataRoute.Robots |
| `/sitemap.xml` | `app/sitemap.ts` | MetadataRoute.Sitemap |
| `/manifest.webmanifest` | `app/manifest.ts` | MetadataRoute.Manifest |

---

## 5. Landing Page Architecture

### Section Order (from `app/page.tsx`)

```
1.  JsonLd (Course schema)
2.  ScrollRevealInit
3.  LandingNav            → components/landing/LandingNav.tsx
4.  LandingHero           → components/landing/LandingHero.tsx
5.  TrustBar              → components/landing/TrustStats.tsx
6.  ProblemSection        → components/landing/ProblemSolution.tsx
7.  HowItWorks            → components/landing/HowItWorks.tsx
8.  Features              → components/landing/WhyUs.tsx
9.  Testimonials          → components/landing/Testimonials.tsx
10. Pricing               → components/landing/Pricing.tsx
11. FAQ                   → components/landing/FAQ.tsx
12. BlogPreview           → components/landing/BlogPreview.tsx
13. FinalCTA              → components/landing/FinalCTA.tsx
14. LandingFooter         → components/landing/LandingFooter.tsx
```

### Section IDs (for anchor links)

| ID | Component | Usage |
|----|-----------|-------|
| `#problem` | ProblemSection | Nav link |
| `#how` | HowItWorks | Nav link |
| `#features` | Features | Nav link |
| `#testimonials` | Testimonials | Nav link |
| `#pricing` | Pricing | Nav link, CTA targets |

Use native `<a href="#id">` for same-page anchor links, not Next.js `<Link>`. Smooth scroll enabled via `html { scroll-behavior: smooth }` in `globals.css`.

### Auth-Aware Components

These components import `useAuth()` and render conditional CTAs:

| Component | Behavior |
|-----------|----------|
| `LandingNav` | Shows profile icon if authenticated, "Log in" link if not |
| `LandingHero` | "Continue practicing" (auth) vs "Start a free trial test" (anon) |
| `Pricing` | Auth-aware pricing display |
| `FinalCTA` | Auth-aware CTA button |

### PLACEHOLDER Content

The following landing components contain `PLACEHOLDER` comments marking content that needs to be replaced with real data:

- **TrustStats** — "2,400+ users", "94% pass rate", "50+ practice exams" (PLACEHOLDER stats)
- **Testimonials** — 3 fictional testimonial quotes and names
- **Pricing** — Feature list and pricing tiers

Search for `PLACEHOLDER` comment across `components/landing/` to find all instances.

---

## 6. Content System

**File:** `lib/content.ts`

All content is loaded from static JSON files in `/content/` at build time. No runtime API calls.

### Exported Functions

#### Lezen (Reading)

| Function | Return Type | Purpose |
|----------|------------|---------|
| `getContentIndex()` | `ContentIndex` | Module metadata |
| `getPassage(id)` | `Passage \| null` | Single passage |
| `getAllPassageIds()` | `string[]` | All passage IDs |
| `getAllPassages()` | `Passage[]` | All passages |
| `getLezenExamQuestions()` | `{ passage, question }[]` | All passage questions for exams |

#### KNM (Society)

| Function | Return Type | Purpose |
|----------|------------|---------|
| `getKNMIndex()` | `KNMIndex` | Module metadata |
| `getKNMTopic(id)` | `KNMTopic \| null` | Single topic |
| `getAllKNMTopics()` | `KNMTopic[]` | All topics |
| `getKNMExamQuestions()` | `{ topic, question }[]` | All KNM questions |

#### Luisteren (Listening)

| Function | Return Type | Purpose |
|----------|------------|---------|
| `getListeningIndex()` | `ListeningIndex` | Module metadata |
| `getListeningExercise(id)` | `ListeningExercise \| null` | Single exercise |
| `getAllListeningExercises()` | `ListeningExercise[]` | All exercises |
| `getLuisterenExamQuestions()` | `{ exercise, question }[]` | All listening questions |

#### Schrijven (Writing)

| Function | Return Type | Purpose |
|----------|------------|---------|
| `getWritingIndex()` | `WritingIndex` | Module metadata |
| `getWritingTask(id)` | `WritingTask \| null` | Single task |
| `getAllWritingTasks()` | `WritingTask[]` | All tasks |
| `getWritingTaskSummaries()` | `WritingTaskSummary[]` | Task list for UI |
| `getFreeWritingTasks()` | `WritingTask[]` | Free preview tasks |

#### Spreken (Speaking)

| Function | Return Type | Purpose |
|----------|------------|---------|
| `getSpeakingIndex()` | `SpeakingIndex` | Module metadata |
| `getSpeakingTask(id)` | `SpeakingTask \| null` | Single task |
| `getAllSpeakingTasks()` | `SpeakingTask[]` | All tasks |
| `getSpeakingTaskSummaries()` | `SpeakingTaskSummary[]` | Task list for UI |
| `getSpeakingTasksByPart(partNumber)` | `SpeakingTask[]` | Tasks for part (1–4) |
| `getFreeSpeakingTasks()` | `SpeakingTask[]` | Free preview tasks |

#### Mock Exams

| Function | Return Type | Purpose |
|----------|------------|---------|
| `getMockExamIndex(module)` | `MockExamIndex \| null` | Exam list by module |
| `getMockExam(examId)` | `MockExam \| null` | Single exam |
| `getAllMockExamIds()` | `string[]` | All exam IDs |
| `getSuggestedExams(currentExamId, completedIds)` | `SuggestedExamInfo[]` | Random suggestions |

#### Quick Assessment

| Function | Return Type | Purpose |
|----------|------------|---------|
| `getQuickAssessmentModules()` | `QuickAssessmentModuleInfo[]` | Module list |
| `getQuickAssessmentQuestions(module)` | `QuickAssessmentQuestion[]` | Questions for module |
| `getQuickAssessmentWritingTask()` | `WritingTask \| null` | Writing preview task |
| `getQuickAssessmentSpeakingTask()` | `SpeakingTask \| null` | Speaking preview task |

### Content Counts

| Module | Content Directory | Items |
|--------|------------------|-------|
| Lezen | `/content/lezen/` | 5 passages, 25 questions |
| KNM | `/content/knm/` | 8 topics, 96 questions |
| Luisteren | `/content/luisteren/` | 5 exercises, 20 questions |
| Schrijven | `/content/schrijven/` | 4 tasks |
| Spreken | `/content/spreken/` | 4 tasks (parts 1–4) |
| Mock Exams | `/content/mock-exams/` | Multiple per module |
| Quick Assessment | `/content/quick-assessment/` | Subset per module |
| Blog | `/content/blog/` | 3 posts (markdown) |

---

## 7. Blog System

**File:** `lib/blog.ts`

### Pipeline

1. Read `.md` files from `/content/blog/`
2. Parse front-matter with `gray-matter`
3. Convert markdown to HTML with `marked`
4. Sanitize HTML with `isomorphic-dompurify`
5. Render with `.prose-navy` class

### Exported Functions

| Function | Return Type | Purpose |
|----------|------------|---------|
| `getAllBlogPosts()` | `BlogPostMeta[]` | All posts, sorted by date (newest first) |
| `getBlogPost(slug)` | `BlogPost \| null` | Single post with HTML content |
| `getAllBlogSlugs()` | `string[]` | All post slugs |

### Front-matter Format

```yaml
---
title: "Post Title"
slug: "post-slug"
description: "Short description for meta tags"
date: "2026-02-10"
author: "Author Name"
keywords: ["keyword1", "keyword2"]
---
```

### Types

```typescript
interface BlogPostMeta {
  title: string;
  slug: string;
  description: string;
  date: string;
  author: string;
  keywords: string[];
}

interface BlogPost extends BlogPostMeta {
  content: string; // Sanitized HTML
}
```

---

## 8. Auth System

**File:** `contexts/AuthContext.tsx`

### AuthContext Shape

```typescript
interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isConfigured: boolean;
  signInWithGoogle(redirectTo?: string): Promise<void>;
  signUp(email: string, password: string, redirectTo?: string): Promise<AuthResult>;
  signInWithPassword(email: string, password: string): Promise<AuthResult>;
  resetPassword(email: string): Promise<AuthResult>;
  updatePassword(password: string): Promise<AuthResult>;
  signOut(): Promise<void>;
}
```

### Usage

```typescript
const { user, loading } = useAuth();
```

### Key Features

- **OAuth:** Google sign-in via Supabase
- **Email/password:** Signup, login, password reset
- **Redirect validation:** `lib/validate-redirect.ts` prevents open redirects
- **Graceful degradation:** `isConfigured` flag — app works without Supabase
- **Auth callback:** `/auth/callback` route handles OAuth code exchange, recovery flow

### Auth Pages

| Page | Purpose | Indexed? |
|------|---------|----------|
| `/auth/login` | Email/password login | No |
| `/auth/signup` | Email/password signup | No |
| `/auth/reset-password` | Request password reset | No |
| `/auth/update-password` | Set new password (recovery) | No |

---

## 9. State Management

### Progress Tracking

**Local:** `lib/progress.ts` + `hooks/useProgress.ts`

- Uses `useSyncExternalStore` for React-safe localStorage reads
- Progress stored per exercise ID as `PassageProgress` objects

```typescript
interface PassageProgress {
  completed: boolean;
  correctAnswers: number;
  totalQuestions: number;
  lastAttempt: string; // ISO date
}

interface UserProgress {
  passageProgress: Record<string, PassageProgress>;
  writingProgress: Record<string, WritingAttempt>;
  speakingProgress: Record<string, SpeakingAttempt>;
}
```

### Cloud Sync (Optional)

- `useProgress` hook provides `syncToCloud` and `loadFromCloud`
- API: `POST /api/progress` (save), `GET /api/progress` (load)
- Requires Supabase auth — stores in `user_progress` table

### Exam State

**Hook:** `useExamState`

Tracks within an exam session: current question index, selected answers, bookmarked questions, time elapsed.

---

## 10. API Routes

### POST /api/exam-results

**Auth:** Required (Supabase user)
**Rate limit:** 50/hour per user

Saves exam result. Validates: score integer, 0 <= score <= totalQuestions, pass threshold 60%.

**Body:** `{ examId, module, difficulty, score, totalQuestions, timeTakenSeconds, answerData }`
**Response:** `{ success: true, result: {...} }`

### GET /api/exam-results

**Auth:** Required
Fetches user's exam history, ordered by `created_at` DESC.

**Response:** `{ results: [...] }`

### POST /api/feedback

**Auth:** None (rate-limited by IP)
**Rate limit:** 10/15min per IP

Submits feedback. Falls back to console log if Supabase not configured.

**Body:** `{ description, feedback_type, page_url, email?, user_agent?, screen_size? }`
**Response:** `{ success: true, message: "..." }`

### POST /api/progress

**Auth:** Required
**Rate limit:** 30/15min per user

Saves/syncs progress to Supabase.

**Body:** `{ progress: { passageProgress, writingProgress, speakingProgress } }`

### GET /api/progress

**Auth:** Required
Fetches saved progress from cloud.

**Response:** `{ progress: {...} }` or `{ progress: null }`

### POST /api/subscribe

**Auth:** None (rate-limited by IP)
**Rate limit:** 5/hour per IP

Newsletter subscription. Validates email (RFC 5321, max 254 chars).

**Body:** `{ email }`
**Response:** `{ success: true, message: "..." }`

### GET /auth/callback

OAuth/email confirmation handler. Exchanges code for session, redirects to `/auth/update-password` for recovery flow, otherwise to `/learn`.

---

## 11. SEO Infrastructure

### Metadata Pattern

- Root layout sets `metadataBase`, `title.template` ("... | passinburgering"), keywords, canonical URL, OG image
- Each page exports its own `metadata` object
- Client component pages use `layout.tsx` wrappers for metadata
- Auth pages: `robots: { index: false, follow: false }`

### robots.ts

```
Allow: /
Disallow: /api/, /auth/, /profile, /audio-test
Sitemap: https://passinburgering.com/sitemap.xml
```

### sitemap.ts

Dynamic sitemap including:
- Static pages (home, guide, faq, blog, contact, privacy, terms)
- Learning module selectors and all dynamic content pages
- Blog posts
- Priorities: 1.0 (home) → 0.9 (guide) → 0.8 (blog, try, faq) → 0.7 (learn modules) → 0.6 (content) → 0.3 (legal)

### manifest.ts (PWA)

- Display: standalone
- Background: `#FDFBF7` (cream)
- Theme: `#1a1a2e` (ink)
- Icons: 192x192, 512x512

### JSON-LD Schemas

| Page | Schema Type | Component |
|------|------------|-----------|
| `/` (home) | Course | `JsonLd` in `app/page.tsx` |
| `/guide` | Article | `JsonLd` in guide page |
| `/faq` | FAQPage | `JsonLd` in FAQ page |
| `/blog/[slug]` | BlogPosting | `JsonLd` in blog post page |

---

## 12. Hooks Reference

| Hook | File | Purpose | Key API |
|------|------|---------|---------|
| `useProgress` | `hooks/useProgress.ts` | Progress tracking (localStorage + cloud sync) | `recordAnswer`, `syncToCloud`, `loadFromCloud`, `saveWritingAttempt`, `saveSpeakingAttempt` |
| `useExamState` | `hooks/useExamState.ts` | Exam navigation state | `selectAnswer`, `toggleBookmark`, `nextQuestion`, `previousQuestion` |
| `useAudioRecorder` | `hooks/useAudioRecorder.ts` | Web Audio API recording | `startRecording`, `stopRecording`, `getWaveform` |
| `useScrollReveal` | `hooks/useScrollReveal.ts` | IntersectionObserver for `.reveal` animations | (Side effect only — no return value) |

---

## 13. Key Components Reference

### Exam Components

| Component | File | Purpose |
|-----------|------|---------|
| `ExamLayout` | `components/ExamLayout.tsx` | Flex layout wrapper for exam pages |
| `ExamHeader` | `components/ExamHeader.tsx` | Top bar (module name, progress, timer) |
| `ExamBottomNav` | `components/ExamBottomNav.tsx` | Navigation (prev, next, submit) |
| `ExamCard` | `components/ExamCard.tsx` | Exam/mock exam selector card |
| `ExamIntroScreen` | `components/ExamIntroScreen.tsx` | Pre-exam instructions + start button |
| `ExamQuestionPanel` | `components/ExamQuestionPanel.tsx` | Question container + answer options |
| `QuestionGrid` | `components/QuestionGrid.tsx` | Grid view for quick question navigation |
| `ExitWarningModal` | `components/ExitWarningModal.tsx` | Confirm exam exit modal |
| `DifficultySelector` | `components/DifficultySelector.tsx` | A1/A2 exam difficulty picker |

### Content & Results

| Component | File | Purpose |
|-----------|------|---------|
| `ContentPanel` | `components/ContentPanel.tsx` | Passage/transcript display |
| `AudioPlayer` | `components/AudioPlayer.tsx` | Listening exercise audio player |
| `ResultsSummary` | `components/ResultsSummary.tsx` | Exam results (score, pass/fail, review) |
| `FeedbackWidget` | `components/FeedbackWidget.tsx` | In-page feedback form |

### Writing Module

| Component | File | Purpose |
|-----------|------|---------|
| `WritingInput` | `components/schrijven/WritingInput.tsx` | Free-text textarea |
| `FormInput` | `components/schrijven/FormInput.tsx` | Form field renderer |
| `WritingResults` | `components/schrijven/WritingResults.tsx` | Model answer + feedback |
| `SelfAssessment` | `components/schrijven/SelfAssessment.tsx` | Self-grading checklist |

### Speaking Module

| Component | File | Purpose |
|-----------|------|---------|
| `AudioRecorder` | `components/spreken/AudioRecorder.tsx` | Record with waveform |
| `SpeakingPrompt` | `components/spreken/SpeakingPrompt.tsx` | Task display + scenario |
| `SpeakingResults` | `components/spreken/SpeakingResults.tsx` | Model answer + feedback |
| `SpeakingSelfAssessment` | `components/spreken/SpeakingSelfAssessment.tsx` | Speaking criteria checklist |

### Auth Components

| Component | File | Purpose |
|-----------|------|---------|
| `AuthForm` | `components/auth/AuthForm.tsx` | Base auth form wrapper |
| `LoginForm` | `components/auth/LoginForm.tsx` | Email/password login |
| `SignupForm` | `components/auth/SignupForm.tsx` | Signup + terms acceptance |
| `ResetPasswordForm` | `components/auth/ResetPasswordForm.tsx` | Password reset request |
| `UpdatePasswordForm` | `components/auth/UpdatePasswordForm.tsx` | Password update (recovery) |

### Utility Components

| Component | File | Purpose |
|-----------|------|---------|
| `JsonLd` | `components/JsonLd.tsx` | `<script type="application/ld+json">` |
| `GoogleAnalytics` | `components/GoogleAnalytics.tsx` | GA4 script injection |
| `GoogleSignInButton` | `components/GoogleSignInButton.tsx` | OAuth button |
| `ErrorBoundary` | `components/ErrorBoundary.tsx` | React error boundary |
| `ScrollRevealInit` | `components/landing/ScrollRevealInit.tsx` | Initialize scroll observer |

---

## 14. Environment Variables

| Variable | Required? | Purpose |
|----------|-----------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Optional | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Optional | Supabase anonymous key |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Optional | Google Analytics 4 measurement ID |

**Note:** The app works fully without any env vars — Supabase features degrade gracefully (auth disabled, progress local-only, feedback/subscribe log to console).

Scripts-only env vars (not used in app runtime):
- `GOOGLE_APPLICATION_CREDENTIALS` — Google Cloud TTS (audio generation script)
- `AZURE_SPEECH_KEY` / `AZURE_SPEECH_REGION` — Azure TTS (audio generation script)

---

## 15. Future Additions

Roadmap items for reference when implementing new features:

| Feature | Scope | Key Files to Touch | Notes |
|---------|-------|-------------------|-------|
| Stripe integration | Payment flow | `Pricing.tsx`, new `app/api/stripe/`, `lib/stripe.ts` | Replace PLACEHOLDER pricing; add webhook handler |
| GDPR cookie consent | Cookie banner + consent | New `components/CookieConsent.tsx`, `GoogleAnalytics.tsx` | Conditional GA4 load; store preference in localStorage |
| Email drip campaigns | Post-signup nurture | `app/api/subscribe/`, integrate Resend/Postmark | Currently saves to Supabase `subscribers` table |
| Replace placeholder content | Real stats, testimonials, pricing | All `components/landing/*` with `PLACEHOLDER` comments | Search for `PLACEHOLDER` across codebase |
| Mobile app (PWA) | Progressive web app | `app/manifest.ts`, service worker, offline support | Manifest exists; needs offline caching strategy |
| A/B testing | Landing experiments | New middleware or Vercel Edge Config | Test CTA copy, pricing, hero layout |
| Multi-language support | Dutch UI option | i18n setup, content translations | Currently English-only UI with Dutch exam content |
| Dashboard/analytics | User progress dashboard | New `/dashboard` route, charts | Profile page exists but is minimal |
| Writing AI grading | Auto-grade schrijven | New API route, OpenAI/Claude integration | Currently self-assessment only |
| Speaking AI evaluation | Auto-evaluate spreken | New API route, speech-to-text + grading | Currently self-assessment only |
| Content expansion | More questions per module | `/content/` JSON files | See content counts in section 6 |
| Fix broken content refs | PRD-03 | `lib/content.ts`, content JSON files | Passage ID mismatches, missing files |
| Fix progress tracking | PRD-04 | `lib/progress.ts`, `app/api/progress/` | Cloud sync bugs, retake scoring |
| Security hardening | PRD-05 | Auth routes, API routes, middleware | Rate limiting, XSS, input validation |
