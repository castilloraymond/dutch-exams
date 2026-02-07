# Product Roadmap

## What's Live

| Module | Status | Content | Notes |
|--------|--------|---------|-------|
| Lezen (Reading) | Live | 5 passages, 25 questions | |
| KNM (Society) | Live | 8 topics, 96 questions | |
| Luisteren (Listening) | Live | 5 exercises, 20 questions | |
| Schrijven (Writing) | Live | 4 tasks (email, form, message, reply) | Free tier: self-assessment only |
| Spreken (Speaking) | Live | 4 tasks (parts 1-4) | Free tier: self-assessment only |
| Quick Assessment (/try) | Live | Lezen, KNM, Luisteren, Schrijven, Spreken | Try-before-signup diagnostic |
| SEO Pages | Live | /guide, /faq, /blog, sitemap, robots.txt | Structured data, JSON-LD |
| Auth (Supabase) | Live | Login, signup, progress sync | Optional cloud sync |

## High-Priority Ideas

### 1. Learning Path (Guided Curriculum)

**Problem:** The app is currently mock tests only. Users who aren't exam-ready have no structured way to learn the material — they can only test themselves and see what they get wrong.

**Idea:** A guided curriculum that takes users from zero to exam-ready. Not just "test yourself" but "learn this, then test yourself."

Could look like:
- Per-module learning tracks (Lezen track, KNM track, etc.)
- Lessons before tests (read/study material, then quiz)
- Progressive difficulty (A0 → A1 → A2)
- Progress indicators showing how far along the curriculum they are

**Open questions:**
- What does the curriculum structure look like per module?
- How does this interact with free vs. paid tiers?
- Does this replace or supplement mock tests?
- How much content is needed for a meaningful learning path?

### 2. Anki-Style Flashcards with Spaced Repetition (SRS)

**Problem:** KNM facts, Dutch vocabulary, grammar patterns, and writing phrases are memorization-heavy. One-off quizzes don't build long-term retention. Users need spaced repetition.

**Idea:** Flashcard system with spaced repetition for:
- **KNM:** Facts, dates, institutions, procedures
- **Vocabulary:** Dutch words and phrases for reading/listening
- **Schrijven:** Common email phrases, formal expressions, form vocabulary
- **Spreken:** Conversation starters, opinion expressions, descriptive language
- **Grammar:** Verb conjugation, word order, common patterns

Implementation options:
- Build custom SRS engine (SM-2 algorithm or similar)
- Use Anki export format so users can also study in Anki
- Integrate with existing progress tracking

**Open questions:**
- Build custom or integrate with existing SRS tools (Anki export)?
- How much flashcard content is needed for a useful launch?
- Free or Pro feature?
- How does this fit into the Learning Path (idea #1)?

### 3. Affiliate Links / Resources Page

**Problem:** Users need tools beyond exam prep — vocabulary apps, tutors, language schools, official exam info. There's no easy way to find these from the app.

**Idea:** A curated resources page with recommendations and affiliate links where possible:

| Category | Examples | Affiliate potential |
|----------|----------|-------------------|
| Vocabulary apps | Duolingo, Babbel, Memrise | Yes (referral programs) |
| Find a tutor | italki, Preply, Superprof | Yes (affiliate programs) |
| Language schools in NL | Direct links to schools by city | Possible (partnerships) |
| Official resources | DUO/inburgeren.nl, exam booking | No (public service) |
| Study materials | Books, online courses | Yes (Amazon affiliates) |

**Revenue potential:** Affiliate commissions as a secondary revenue stream alongside the main product.

**Open questions:**
- Dedicated /resources page or integrate into existing pages?
- Which affiliate programs are worth joining first?
- Legal requirements for affiliate disclosure in NL/EU?

## Feature Backlog

Quick-capture ideas. Move to "High-Priority" when ready to spec out.

**Monetization & Payments:**
- [ ] Pricing page with Stripe or Lemon Squeezy integration
- [ ] Tiered access: Free / 3-month (€29) / 6-month (€49) — see [PRD](./prds/PRD-01-passinburgering-main.md)
- [ ] Pass guarantee: free extension if user fails exam
- [ ] Email capture / waitlist for Pro features

**AI-Powered Features (Pro tier):**
- [ ] AI writing feedback via Gemini API — see [SCHRIJVEN-SPEC](../SCHRIJVEN-SPEC.md)
- [ ] AI speech evaluation via Whisper + Gemini — see [SPREKEN-SPEC](../SPREKEN-SPEC.md)
- [ ] AI-powered vocabulary suggestions based on weak areas

**Exam Simulation:**
- [ ] Full exam simulation mode (timed, all modules in sequence, no retakes)
- [ ] Exam-day checklist and preparation guide
- [ ] Realistic exam UI that matches the DUO computer interface

**Analytics & Progress:**
- [ ] Performance analytics dashboard (weak areas, improvement trends)
- [ ] Study streak tracking
- [ ] Estimated exam readiness score
- [ ] Recommended study plan based on weak areas

**Content Expansion:**
- [ ] More Lezen passages at A2 difficulty level
- [ ] Expand KNM question bank (target 200+ questions)
- [ ] More Luisteren exercises with varied accents/speakers
- [ ] Additional Schrijven task types
- [ ] Spreken practice with more diverse scenarios

**UX & Platform:**
- [ ] Mobile app (PWA or React Native)
- [ ] Dark mode
- [ ] Dutch/English language toggle for UI
- [ ] Offline mode (service worker for cached content)
- [ ] Gamification (streaks, XP, badges, leaderboard)
- [ ] Community features (forum, study groups)

## Completed Features

- [x] Core 5 modules: Lezen, KNM, Luisteren, Schrijven, Spreken
- [x] Quick assessment flow (/try) — try before signup
- [x] Content doubling across all 5 modules
- [x] Progress tracking via localStorage + optional Supabase cloud sync
- [x] SEO infrastructure: sitemap, robots.txt, metadata, structured data
- [x] FAQ page with 18 Q&As + FAQPage schema
- [x] Guide page (~1500 words cornerstone content) + Article schema
- [x] Blog placeholder at /blog
- [x] Auth: login, signup, Supabase integration
- [x] Footer with internal links for crawl depth

---

**Adding ideas:** Drop new items in the backlog with `- [ ]`. When ready to build, either move to "High-Priority Ideas" with a fuller description, or create a spec in `docs/specs/`.
