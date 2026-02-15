# PRD #9: Passinburgering iOS App

## Overview

| Field                 | Value                                      |
| --------------------- | ------------------------------------------ |
| **Status**            | Planning                                   |
| **Type**              | B2C Native iOS App (iPhone only)           |
| **Target Launch**     | ASAP — targeting Q2 2026                   |
| **Build Complexity**  | Medium-High                                |
| **Revenue Potential** | App Store subscriptions + existing web tier |
| **Platform**          | iOS only (Android deferred)                |
| **Developer Account** | Apple Developer Program ✅                  |

---

## Problem Statement

Passinburgering.com is a fully functional Next.js web app for Dutch civic integration (inburgering) exam preparation. While the web app is mobile-responsive, a native iOS app unlocks critical advantages:

- **Offline access** — Commuters and users with unreliable connectivity can study anywhere
- **Push notifications** — Drive study habit formation through daily reminders and streak nudges
- **Native audio/speech** — Superior recording/playback for Spreken and Luisteren modules
- **App Store discoverability** — A new acquisition channel among "Dutch learning" and "exam prep" app searchers
- **Native UX** — Smoother gestures, haptic feedback, faster navigation
- **Higher perceived value** — Users associate native apps with premium quality, increasing willingness to pay

### Target User

Same as the web app — **high-income expats in the Netherlands** (30% ruling, tech workers, corporate transfers, age 28-45) who need to pass the inburgering exam. Secondary: all expats required to pass the exam.

### Key Insight

Most users practice on their commute (train/tram), at home on the couch, or during downtime at work. A native app optimized for these contexts — with offline support, fast launch, and push-driven engagement — will significantly increase daily study time and retention versus mobile web.

---

## Core Value Proposition

> **"Pass your inburgering exam — study anywhere, even offline, with an app that feels as smooth as Duolingo."**

---

## Scope: MVP vs. Future

### MVP (v1.0) — Ship This First

The MVP mirrors the core web app experience in a native iOS shell, with **in-app subscriptions from day one**.

| Feature | Description | Parity with Web? |
|---------|-------------|:-:|
| **Lezen** (Reading) | 5 passages, 25 questions, A2 difficulty, content panel + MCQs | ✅ |
| **KNM** (Society Knowledge) | 8 topics, 96 questions, MCQs with explanations | ✅ |
| **Luisteren** (Listening) | 5 exercises, 20 questions, audio playback + MCQs | ✅ |
| **Schrijven** (Writing) | 4 tasks (email, form, message, reply), self-assessment only | ✅ |
| **Spreken** (Speaking) | 4 tasks (parts 1-4), audio recording + self-assessment | ✅ |
| **Mock Exams** | Full mock exams per module (Lezen, KNM, Luisteren) | ✅ |
| **Quick Assessment** | Try-before-signup diagnostic for all 5 modules | ✅ |
| **Progress Tracking** | Local persistence + cloud sync via Supabase | ✅ |
| **Auth** | Email/password login + Google Sign-In (Supabase) | ✅ |
| **Exam Results** | Score, pass/fail (60% threshold), answer review | ✅ |
| **In-App Subscriptions** | StoreKit 2, tiered pricing, paywall on premium content | 🆕 |
| **Offline Mode** | All content (JSON + audio) available offline | 🆕 |
| **Push Notifications** | Daily study reminders | 🆕 |

### Parked for Future Updates (v1.x+)

| Feature | Rationale for Deferral |
|---------|----------------------|
| **AI Writing Feedback** (Gemini API) | Adds backend complexity + API costs; ship self-assessment first |
| **AI Speaking Evaluation** (Whisper + Gemini) | Same — high complexity, defer to v1.1+ |
| **Spaced Repetition / Flashcards** | Not yet built on web either; parallel development later |
| **Learning Path / Guided Curriculum** | Content + UX design not finalized yet |
| **Streak / Gamification** (XP, badges, leaderboard) | Nice-to-have; not critical for exam prep |
| **Performance Analytics Dashboard** | Weak-area analysis, improvement trends |
| ~~Stripe / In-App Purchases~~ | **Moved to MVP** — launching with subscriptions from day 1 |
| **iPad Optimization** | iPhone-first; iPad layout second |
| **Dark Mode** | Not on web either; ship light theme first |
| **Widget / Live Activities** | Study streak widget for iOS home screen |
| **Multi-language UI** (Dutch toggle) | English-only UI first (matches web) |
| **Blog / Guide / FAQ** | Static content — web is sufficient for SEO; not needed in-app |
| **Contact / Feedback Form** | Use in-app email compose or web link |

---

## Technical Architecture

### Recommended Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| **Framework** | **React Native (Expo)** | Maximizes code reuse from existing React/TypeScript web app; shared types, hooks, and content loading logic |
| **Language** | TypeScript | Same as web app — 100% type reuse |
| **Navigation** | Expo Router (file-based) | Mirrors Next.js App Router paradigm |
| **UI Components** | React Native + custom components | Port design system tokens; rebuild UI primitives natively |
| **Styling** | NativeWind (Tailwind for RN) | Reuse Tailwind class patterns from web |
| **State** | AsyncStorage + React Context | Replace localStorage → AsyncStorage; same hook patterns |
| **Backend** | Supabase (existing) | No new backend — reuse auth, cloud sync, exam-results APIs |
| **Audio Playback** | expo-av | Native audio player for Luisteren module |
| **Audio Recording** | expo-av | Native recording for Spreken module |
| **Push Notifications** | expo-notifications + Supabase Edge Functions | Daily reminders, streak nudges |
| **Offline Storage** | AsyncStorage + bundled JSON | Pre-bundle all content JSON; cache audio files |
| **Analytics** | expo-firebase-analytics | Reuse GA4 measurement ID |

> [!IMPORTANT]
> **Why React Native over SwiftUI?** The existing web app is React 19 + TypeScript. React Native allows **direct reuse** of:
> - All 40+ TypeScript interfaces from `lib/types.ts`
> - Content loading logic from `lib/content.ts`
> - Progress management hooks (`useProgress`, `useExamState`)
> - Supabase client configuration and auth flow
> - All JSON content files (lezen, knm, luisteren, schrijven, spreken, mock-exams, quick-assessment)
>
> Estimated **30-40% code reuse** from the web codebase.

### Content Strategy

All exam content is static JSON already. For the iOS app:

1. **Bundle JSON at build time** — all `/content/` JSON files ship inside the app binary
2. **Bundle audio at build time** — the `/public/audio/` directory (37 files) is embedded in the app
3. **Content updates** — use EAS Update (Expo) for OTA content pushes without App Store review
4. **No API calls for content** — everything works offline out of the box

### Backend Reuse

The iOS app calls the **same Supabase backend** as the web app:

| API | Purpose | Reuse? |
|-----|---------|:------:|
| Supabase Auth | Login, signup, Google OAuth, password reset | ✅ |
| `POST /api/progress` | Sync progress to cloud | ✅ |
| `GET /api/progress` | Load progress from cloud | ✅ |
| `POST /api/exam-results` | Save exam result | ✅ |
| `GET /api/exam-results` | Fetch exam history | ✅ |
| `POST /api/feedback` | Submit feedback | ✅ |

> [!NOTE]
> API routes currently live in Next.js (`app/api/`). For the iOS app, consider migrating API logic to **Supabase Edge Functions** so both web and iOS share the same backend without depending on the Next.js server. This is not blocking for MVP — the iOS app can call the Vercel-hosted web API directly.

---

## App Structure & Screens

### Navigation Architecture

```
Tab Bar (3 tabs)
├── Practice (Home)
│   ├── Module Dashboard (5 module cards)
│   ├── Lezen
│   │   ├── Exam Select (variant picker)
│   │   ├── Exam (question flow)
│   │   └── Results
│   ├── KNM
│   │   ├── Exam Select
│   │   ├── Exam (question flow)
│   │   └── Results
│   ├── Luisteren
│   │   ├── Exam Select
│   │   ├── Exam (audio + questions)
│   │   └── Results
│   ├── Schrijven
│   │   ├── Task Select
│   │   ├── Task (writing input + self-assessment)
│   │   └── Results
│   └── Spreken
│       ├── Task Select
│       ├── Task (recording + self-assessment)
│       └── Results
├── Quick Test
│   ├── Module Selector
│   ├── Assessment (5 questions per module)
│   └── Results + Signup CTA
└── Profile
    ├── Progress Overview
    ├── Exam History
    ├── Cloud Sync Toggle
    ├── Notification Settings
    └── Account (login/signup/logout)
```

### Screen-by-Screen Spec

#### 1. Practice Tab (Home)

| Element | Spec |
|---------|------|
| **Header** | "Oefenexamens" / "Practice Exams" |
| **Module Cards** | 5 cards: Lezen, KNM, Luisteren, Schrijven, Spreken |
| **Card Content** | Icon, Dutch name, English subtitle, description, progress bar (X/Y completed) |
| **Completed Badge** | Green checkmark when all exams done |
| **Action** | Tap → navigate to module exam select |

#### 2. Exam Select (Lezen, KNM, Luisteren)

| Element | Spec |
|---------|------|
| **Header** | Module name + back navigation |
| **Free Exam Card** | Always available, highlight as "Start here" |
| **Mock Exam Cards** | Show difficulty badge (A1/A2), question count, recommended time |
| **Completion State** | Score badge if previously completed |
| **Difficulty Filter** | A1 / A2 toggle (for modules with multiple difficulties) |

#### 3. Exam Flow (MCQ Modules)

| Element | Spec |
|---------|------|
| **Header Bar** | Module name, question X/Y counter, timer |
| **Content Panel** | Reading passage (Lezen) / Transcript (Luisteren) / none (KNM) — scrollable |
| **Audio Player** | Play/pause, progress bar, speed control (Luisteren only) |
| **Question** | Dutch text + answer options (radio buttons) |
| **Bottom Nav** | Previous / Next / Submit |
| **Question Grid** | Tap to jump to any question; shows answered/bookmarked/unanswered |
| **Bookmark** | Flag questions for review |
| **Exit Warning** | Modal confirmation when leaving mid-exam |

#### 4. Results Screen

| Element | Spec |
|---------|------|
| **Score** | X/Y correct, percentage |
| **Pass/Fail** | Green "Geslaagd" (≥60%) / Red "Niet geslaagd" (<60%) |
| **Answer Review** | Expandable list: question text, your answer, correct answer, explanation |
| **Actions** | "Try Again" / "Back to Module" / "Next Exam" |
| **Suggested Exams** | Up to 3 related mock exams |

#### 5. Schrijven (Writing) Task

| Element | Spec |
|---------|------|
| **Scenario** | Dutch + English context description |
| **Prompt** | Writing instruction |
| **Input** | Free-text textarea or form fields (depending on task type) |
| **Word Count** | Live counter with min/max range |
| **Submit** | → Self-assessment checklist |
| **Self-Assessment** | Criteria checkboxes → reveal model answer |
| **Tips** | Collapsible writing tips section |

#### 6. Spreken (Speaking) Task

| Element | Spec |
|---------|------|
| **Question Display** | Dutch question text + scenario context |
| **Images** | Task-specific images (if applicable) |
| **Record Button** | Large mic button with waveform visualization |
| **Timer** | Recommended duration + soft limit warning |
| **Playback** | Listen to recording after stopping |
| **Self-Assessment** | Criteria checklist → reveal model answer (text + audio) |

#### 7. Quick Test Tab

| Element | Spec |
|---------|------|
| **Intro** | "See where you stand — quick 5-question test per module" |
| **Module Cards** | Lezen, KNM, Luisteren (MCQ), Schrijven and Spreken (preview only) |
| **Assessment Flow** | Same as exam flow but subset of questions |
| **Results** | Score + recommendation + "Sign up to unlock full practice" CTA |

#### 8. Profile Tab

| Element | Spec |
|---------|------|
| **Not Logged In** | Login / Signup CTA |
| **Logged In** | User email, overall progress summary |
| **Progress** | Per-module completion (5 progress bars) |
| **Exam History** | List of past exam results (score, date, module) |
| **Settings** | Push notification toggle, cloud sync toggle |
| **Account** | Change password, sign out, delete account |

---

## Design System (iOS Port)

### Principles

1. **Port, don't reinvent** — use the same design tokens, just adapted for native
2. **iOS-native patterns** — tab bar, push navigation, haptic feedback, safe area insets
3. **Cream + Orange identity** — maintain brand consistency between web and app

### Token Mapping

| Web Token | iOS Value | Usage |
|-----------|-----------|-------|
| `--ink` (#1a1a2e) | `Color.ink` | Primary text, headings |
| `--ink-soft` (#4a4a6a) | `Color.inkSoft` | Secondary text |
| `--ink-muted` (#8888a4) | `Color.inkMuted` | Tertiary text |
| `--cream` (#FDFBF7) | `Color.cream` | Screen backgrounds |
| `--cream-dark` (#F5F1EA) | `Color.creamDark` | Card surfaces |
| `--accent` (#E8632B) | `Color.accent` | CTAs, active states |
| `--accent-glow` (#FF7A3D) | `Color.accentGlow` | Pressed states |
| `--accent-soft` (#FFF0E8) | `Color.accentSoft` | Light backgrounds |
| `--green` (#2D8F5E) | `Color.success` | Pass, correct |
| `--green-soft` (#E8F5EE) | `Color.successSoft` | Success backgrounds |
| `--shadow-card` | iOS shadow | Card elevation |

### Typography

| Style | Web | iOS |
|-------|-----|-----|
| **Font** | Plus Jakarta Sans | Plus Jakarta Sans (custom font bundled) |
| **H1** | 2xl bold | 28pt Bold |
| **H2** | xl bold | 22pt Bold |
| **Body** | base | 17pt Regular |
| **Caption** | sm | 13pt Regular |
| **Subtitle** | xs, ink/40 | 11pt, inkMuted |

### Component Mapping

| Web Component | iOS Equivalent |
|---------------|---------------|
| `ExamLayout` | Stack screen with custom header |
| `ExamHeader` | Custom navigation bar (module + progress + timer) |
| `ExamBottomNav` | Bottom toolbar (Previous / Next / Submit) |
| `ExamCard` | Custom card (TouchableOpacity + shadow) |
| `ExamQuestionPanel` | ScrollView with radio button group |
| `QuestionGrid` | Horizontal scroll or bottom sheet grid |
| `ContentPanel` | ScrollView with styled text |
| `AudioPlayer` | Custom expo-av wrapper with controls |
| `ResultsSummary` | Full-screen results with accordion review |
| `DifficultySelector` | Segmented control (A1/A2) |
| `WritingInput` | TextInput (multiline) with word counter |
| `AudioRecorder` | Custom recorder with animated waveform |
| `FeedbackWidget` | Bottom sheet form |

---

## Offline Architecture

### What's Available Offline

| Content | Storage | Size Estimate |
|---------|---------|:---:|
| All module JSON (lezen, knm, luisteren, schrijven, spreken) | Bundled in app binary | ~500 KB |
| Mock exam JSON | Bundled in app binary | ~200 KB |
| Quick assessment JSON | Bundled in app binary | ~50 KB |
| Audio files (37 files) | Bundled in app binary | ~15 MB |
| User progress | AsyncStorage | <10 KB |

**Total app size estimate:** ~25-35 MB (including app binary, fonts, assets)

### Online-Only Features

| Feature | Why Online |
|---------|-----------|
| Cloud sync (save/load progress) | Requires Supabase |
| Exam result history | Stored in Supabase DB |
| Auth (login/signup) | Requires Supabase Auth |
| Push notification registration | Requires APNS |
| Subscription verification | Requires App Store receipt validation |

### Sync Strategy

1. **Local-first** — All progress written to AsyncStorage immediately
2. **Background sync** — When online, sync progress to Supabase on app foreground
3. **Conflict resolution** — Server wins for exam results; merge for progress (latest timestamp wins)
4. **Offline indicator** — Subtle banner: "Offline mode — progress will sync when connected"

---

## Push Notifications

### MVP Notification Types

| Type | Trigger | Content |
|------|---------|---------|
| **Daily Reminder** | Scheduled at user-set time (default: 19:00) | "Time to practice! You have X modules left to complete." |
| **Streak Nudge** | If no activity for 2 days | "Don't lose your progress! Quick 5-minute practice?" |
| **Exam Completion** | After completing a mock exam | "Great job! You scored X%. Ready for the next one?" |

### Implementation

- Use `expo-notifications` for local scheduling
- Store notification preferences in AsyncStorage
- No server-side push infrastructure needed for MVP (all local notifications)

---

## Success Metrics

| Metric | Target (30 days post-launch) | Target (90 days) |
|--------|:---:|:---:|
| App Store downloads | 200 | 1,000 |
| DAU (Daily Active Users) | 50 | 200 |
| Session duration (avg) | 8 min | 12 min |
| Sessions per week (avg) | 3 | 5 |
| App Store rating | 4.0+ | 4.5+ |
| Crash-free rate | 99%+ | 99.5%+ |
| Offline sessions (% total) | — | Track |
| **Trial → Paid conversion** | **5%** | **10%** |
| **Subscriber MRR** | **€200** | **€1,000** |

---

## App Store Strategy

### Listing

| Field | Content |
|-------|---------|
| **App Name** | Passinburgering — Dutch Exam Prep |
| **Subtitle** | Practice for the inburgering exam |
| **Category** | Education |
| **Keywords** | inburgering, dutch exam, civic integration, netherlands, expat, KNM, lezen, luisteren, schrijven, spreken, A2, citizenship |
| **Description** | Practice all 5 sections of the Dutch inburgering exam: Reading (Lezen), Society Knowledge (KNM), Listening (Luisteren), Writing (Schrijven), and Speaking (Spreken). Realistic mock exams with instant feedback. Study offline on your commute. |
| **Screenshots** | Module dashboard, exam in progress, results screen, listening exercise, writing task |
| **Privacy URL** | https://passinburgering.com/privacy |
| **Support URL** | https://passinburgering.com/contact |

### Pricing (Day-1 Subscriptions)

**Freemium model** — free download, gated premium content behind subscription.

#### Free Tier (No Account Required)

| Access |
|--------|
| Quick Assessment (all 5 modules) |
| 1 free mock exam per module (Lezen, KNM, Luisteren) |
| 1 free Schrijven task + 1 free Spreken task |
| Progress tracking (local only) |

#### Paid Tier (In-App Subscription)

| Plan | Price | Notes |
|------|:-----:|-------|
| **3-Month Access** | €39 (~€13/mo) | Recommended for most users |
| **6-Month Access** | €59 (~€10/mo) | Best value; includes pass guarantee |

> [!WARNING]
> **Apple's 30% cut.** Web pricing is €29/€49. iOS prices are bumped to €39/€59 to cover the App Store commission while maintaining similar net revenue. After Apple's cut: €27.30 and €41.30 net.

#### Paid Tier Unlocks

| Feature |
|---------|
| All mock exams (multiple per module) |
| All Schrijven tasks (4 total) |
| All Spreken tasks (4 total) |
| Cloud progress sync |
| Exam history |
| Priority support |

#### Implementation

- **StoreKit 2** (modern Swift-native API, works with React Native via `react-native-iap` or `expo-iap`)
- **Auto-renewable subscriptions** with 3-month and 6-month periods
- **Receipt validation** — server-side via Supabase Edge Function calling Apple's App Store Server API
- **Paywall screen** — shown when tapping locked content; shows plan comparison + restore purchases
- **Restore Purchases** — required by App Store guidelines; button on paywall + Profile screen
- **Free trial** — consider 7-day free trial on first subscription to boost conversion
- **Grace period** — Apple's billing grace period enabled (16 days for annual, 6 days for monthly/other)

---

## Development Phases

### Phase 1: Foundation (Weeks 1-2)

- [ ] Initialize Expo project with TypeScript
- [ ] Set up Expo Router (file-based navigation)
- [ ] Port design system tokens (colors, typography, shadows)
- [ ] Implement tab bar navigation (Practice / Quick Test / Profile)
- [ ] Bundle all content JSON files
- [ ] Port `lib/types.ts` (direct copy)
- [ ] Port `lib/content.ts` (adapt file loading for RN)
- [ ] Set up AsyncStorage for progress (port `lib/progress.ts`)

### Phase 2: Core Modules (Weeks 3-5)

- [ ] Build Module Dashboard screen (Practice tab)
- [ ] Build Exam Select screen (shared across Lezen/KNM/Luisteren)
- [ ] Build Exam Flow screen (question navigation, answer selection, timer)
- [ ] Build Results screen (score, pass/fail, answer review)
- [ ] Port `useExamState` hook
- [ ] Port `useProgress` hook (AsyncStorage variant)
- [ ] Implement KNM exam flow (questions only, no content panel)
- [ ] Implement Lezen exam flow (content panel + questions)

### Phase 3: Audio Modules (Weeks 5-6)

- [ ] Integrate expo-av for audio playback
- [ ] Build AudioPlayer component (play/pause, progress, speed control)
- [ ] Implement Luisteren exam flow (audio + transcript + questions)
- [ ] Integrate expo-av for audio recording
- [ ] Build AudioRecorder component (waveform, timer, playback)
- [ ] Implement Spreken flow (record + self-assessment + model answer)
- [ ] Bundle audio files in app binary

### Phase 4: Writing + Auth (Weeks 6-7)

- [ ] Build WritingInput component (free-text + form input)
- [ ] Implement Schrijven flow (scenario → write → self-assess → model answer)
- [ ] Set up Supabase auth (email/password + Google Sign-In)
- [ ] Build login/signup/password-reset screens
- [ ] Port AuthContext for React Native

### Phase 5: In-App Subscriptions (Weeks 7-8)

- [ ] Set up App Store Connect products (3-month, 6-month auto-renewable subscriptions)
- [ ] Integrate `react-native-iap` or `expo-iap` with StoreKit 2
- [ ] Build Paywall screen (plan comparison, pricing, CTA)
- [ ] Implement content gating logic (free vs. paid content)
- [ ] Server-side receipt validation (Supabase Edge Function)
- [ ] Restore Purchases flow
- [ ] Subscription status tracking in app state

### Phase 6: Quick Assessment + Cloud Sync (Weeks 8-9)

- [ ] Build Quick Test tab (module selector + mini assessment)
- [ ] Implement Quick Assessment flow (5 questions per module)
- [ ] Results screen with signup CTA
- [ ] Implement cloud progress sync (background sync on foreground)
- [ ] Implement exam result saving/loading

### Phase 7: Offline + Notifications + Polish (Weeks 9-10)

- [ ] Offline indicator UI
- [ ] Test full offline experience
- [ ] Set up expo-notifications (local notifications)
- [ ] Daily reminder scheduling
- [ ] Notification preferences in Profile
- [ ] Exit warning modal for exam flow
- [ ] Error boundary and crash handling
- [ ] Haptic feedback on answer selection, submit, pass/fail

### Phase 8: Testing + Launch (Weeks 10-11)

- [ ] Device testing (iPhone SE, 15, 16 Pro Max — various sizes)
- [ ] Accessibility audit (VoiceOver, Dynamic Type)
- [ ] Performance profiling (launch time, scroll performance)
- [ ] Subscription sandbox testing (purchase, restore, expiry)
- [ ] App Store assets (screenshots, description, keywords)
- [ ] TestFlight beta distribution (select group of testers)
- [ ] Beta feedback collection + bug fixes
- [ ] App Store submission + review

---

## Code Reuse Matrix

| Web File | iOS Reuse | Notes |
|----------|:---------:|-------|
| `lib/types.ts` | 100% | Direct copy — all interfaces |
| `lib/content.ts` | ~70% | Adapt `fs.readFileSync` → bundled JSON imports |
| `lib/utils.ts` | 100% | `cn()` helper — or use NativeWind equivalent |
| `hooks/useProgress.ts` | ~60% | Replace localStorage → AsyncStorage |
| `hooks/useExamState.ts` | ~90% | Pure React state — minimal changes |
| `content/**/*.json` | 100% | All JSON content files — direct bundle |
| `public/audio/*` | 100% | All audio files — bundle in app |
| `lib/supabase.ts` | ~80% | Same client, different storage adapter |
| `contexts/AuthContext.tsx` | ~70% | Same Supabase auth, different redirect handling |
| Components (UI) | ~20% | Logic reusable, markup must be rewritten (div→View, etc.) |

**Estimated overall reuse: 30-40%** — significant savings on types, content, hooks, and business logic.

---

## Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|:---:|:---:|------------|
| App Store rejection | Low | High | Follow Human Interface Guidelines; no web view wrappers |
| Audio recording issues on older iPhones | Medium | Medium | Test on iPhone SE; provide fallback UX |
| Large app size (audio files) | Low | Low | Compress audio; 35MB is well under App Store limits |
| React Native performance on exam flows | Low | Medium | Use FlatList for question grids; memoize heavy renders |
| Content updates require App Store review | Medium | Medium | Use Expo OTA Updates for JSON content; only binary changes need review |
| Low discoverability in App Store | High | Medium | ASO optimization; cross-promote from web; encourage ratings |
| Maintaining two codebases (web + iOS) | High | Medium | Share types + content; consider Expo Web for future convergence |

---

## Decisions Made

| # | Question | Decision |
|---|----------|----------|
| 1 | Apple Developer Account | ✅ Active membership confirmed |
| 2 | Framework | React Native (Expo managed workflow) |
| 3 | Platforms | iOS only — Android deferred to a later phase |
| 4 | Beta Testers | Select group via TestFlight |
| 5 | Launch Timing | ASAP — no seasonal targeting |
| 6 | Monetization | Day-1 subscriptions (€39 / 3-month, €59 / 6-month) |
