# Production Audit: passinburgering.com

**Date:** 2026-02-10
**Status:** Complete
**Auditor:** Automated + Manual Code Review

---

## Executive Summary

The app is **not production-ready**. There are 5 critical blockers, 12 high-priority issues, and ~30 medium/low improvements needed before a confident public launch. The biggest risks are: broken content references that crash user flows, security holes in the API layer, and incomplete data sync logic.

---

## Issue Index

Issues are numbered sequentially and grouped by category. Each has a priority tier and effort size.

**Priority tiers:**
- **P0 — Blocks production launch.** Users will hit these immediately.
- **P1 — Degrades user experience.** Hurts credibility or causes confusion.
- **P2 — Nice to have.** Polish, optimization, future-proofing.

---

## Category 1: Content & Data Integrity

| # | Issue | Priority | Effort | PRD |
|---|-------|----------|--------|-----|
| 1 | **Passage file IDs don't match filenames.** `bij-de-dokter.json` has id `advertentie-cursus-nederlands`, etc. Content lookup returns wrong passages or crashes. | P0 | S | PRD-03 |
| 2 | **5 passages referenced in index.json don't exist** (`tips-om-goed-te-leren`, `brief-van-de-gemeente`, `advertentie-cursus-nederlands`, `artikel-fietsen-in-nederland`, `huisregels-appartementencomplex`). Lezen module partially broken. | P0 | M | PRD-03 |
| 3 | **Quick assessment (lezen) references non-existent question IDs** (`tips-q1`, `huis-q1`, `brief-q2`, etc.). Trial lezen broken. | P0 | S | PRD-03 |
| 4 | **Progress sync drops writing & speaking data.** `POST /api/progress` only saves `passageProgress`, ignoring `writingProgress` and `speakingProgress`. Cloud sync loses data. | P0 | S | PRD-04 |
| 5 | **Retake scoring bug.** `updatePassageProgress()` in `lib/progress.ts` doesn't update correctness when user re-answers a question. Scores can't improve on retakes. | P0 | S | PRD-04 |
| 6 | **Blog posts are stubs.** All 3 blog posts contain only placeholder text ("Detailed content coming soon..."). Embarrassing if customers find them. | P1 | M | PRD-08 |
| 7 | **Sitemap only includes ~50% of content.** 13 exercises/tasks missing from `app/sitemap.ts`. Hurts SEO discoverability. | P1 | S | PRD-07 |
| 8 | **OG image (`/og-image.png`) doesn't exist.** Social media sharing shows broken image. | P1 | XS | PRD-07 |
| 9 | **Blog metadata inconsistency.** `knm-exam-2026-new-format.md` has title referencing 2025 but slug says 2026. | P1 | XS | PRD-08 |
| 10 | **No data migration strategy for localStorage.** Schema changes break all existing users' saved progress. No versioning. | P2 | M | — |

---

## Category 2: Security

| # | Issue | Priority | Effort | PRD |
|---|-------|----------|--------|-----|
| 11 | **API progress endpoint has no auth.** `GET /api/progress?email=X` returns anyone's progress. Data breach via email guessing. | P0 | M | PRD-05 |
| 12 | **Open redirect in auth callback.** `/auth/callback` and login/signup forms accept `redirect` param with only `startsWith("/")` check. Allows `//evil.com` bypasses. | P1 | S | PRD-05 |
| 13 | **No rate limiting on any API endpoint.** `/api/progress`, `/api/feedback`, `/api/subscribe`, `/api/exam-results` can all be spammed. | P1 | M | PRD-05 |
| 14 | **XSS via blog posts.** `dangerouslySetInnerHTML` renders blog HTML without sanitization. If blog content is ever user-editable, XSS possible. | P1 | S | PRD-05 |
| 15 | **Feedback API stores unsanitized user_agent/screen_size.** Stored XSS risk if displayed in admin UI. | P2 | XS | PRD-05 |
| 16 | **Exam results API missing score validation.** Accepts negative scores or scores > totalQuestions. | P1 | XS | PRD-05 |
| 17 | **Email validation too weak** in subscribe endpoint. Regex accepts `a@b.c`. | P2 | XS | PRD-05 |
| 18 | **OAuth redirect URL includes user-controlled `redirectTo`** in `AuthContext.tsx` without validation. | P1 | S | PRD-05 |

---

## Category 3: Bugs (Logic Errors)

| # | Issue | Priority | Effort | PRD |
|---|-------|----------|--------|-----|
| 19 | **Login/Signup 404s.** Known bug (BUGS.md): `/login` and `/signup` return 404. Routes are at `/auth/login` and `/auth/signup` but links point wrong. | P0 | XS | PRD-03 |
| 20 | **Footer links are `href="#"`.** Known bug: footer navigation links don't go anywhere. | P1 | XS | PRD-06 |
| 21 | **"View Pricing" button shows no prices.** Known bug: pricing CTA has no pricing page or content. | P1 | S | PRD-06 |
| 22 | **Spreken skips Part 1.** Known bug: speaking module doesn't show Part 1 content properly. | P1 | S | PRD-06 |
| 23 | **Question count mismatch (10 vs 9).** Known bug: exam says 10 questions but only has 9. | P1 | XS | PRD-06 |
| 24 | **Keyboard event listeners leak.** `ExamQuestionPanel` creates new `handleKeyDown` function each render; cleanup uses different reference. Handlers accumulate. | P1 | S | PRD-06 |
| 25 | **`useSyncExternalStore` triggers on ANY localStorage change**, not just progress keys. Unnecessary re-renders across app. | P2 | S | — |

---

## Category 4: UX / UI

| # | Issue | Priority | Effort | PRD |
|---|-------|----------|--------|-----|
| 26 | **No error recovery UI on exam data load failure.** Generic "Error loading exams" with no retry button. Users stuck. | P1 | S | PRD-06 |
| 27 | **Image load failures show blank space.** Spreken task images hide on error with no fallback or message. | P1 | S | PRD-06 |
| 28 | **Recording auto-stop is silent.** When recording reaches max duration, it stops without notifying the user. | P2 | XS | — |
| 29 | **FAQ accordion `max-h-96` truncates long answers** on mobile. Content gets cut off. | P2 | XS | — |
| 30 | **FeedbackWidget has fixed `w-80`** that overflows on phones < 320px wide. | P2 | XS | — |
| 31 | **Inconsistent "Coming Soon" labels.** Known bug: some modules show coming soon inconsistently. | P1 | XS | PRD-06 |
| 32 | **No homepage nav from assessments.** Known bug: no way to get back to homepage from quick assessment flow. | P1 | XS | PRD-06 |

---

## Category 5: Production Readiness

| # | Issue | Priority | Effort | PRD |
|---|-------|----------|--------|-----|
| 33 | **`lang="en"` hardcoded** but app serves Dutch content. Should be `"en"` for English-speaking users or dynamically set. | P1 | XS | PRD-07 |
| 34 | **Favicon uses single PNG for all sizes** (192x192 and 512x512). Blurry on high-DPI screens. | P2 | S | PRD-07 |
| 35 | **No Content Security Policy headers.** | P2 | S | — |
| 36 | **GoogleAnalytics component exists** but needs verification it's properly configured for production. | P2 | XS | PRD-07 |
| 37 | **JSON-LD structured data not validated** against actual page content. | P2 | S | PRD-07 |

---

## Category 6: Performance

| # | Issue | Priority | Effort | PRD |
|---|-------|----------|--------|-----|
| 38 | **`buildQuestionMap()` runs at import time**, loading ALL questions into memory. No lazy loading or code splitting. | P2 | M | — |
| 39 | **Profile page arrays recreated every render** (`LEZEN_IDS`, `KNM_IDS`, etc.). Missing `useMemo`. | P2 | XS | — |
| 40 | **Blog uses synchronous file reads** (`readFileSync`) with O(n) lookup per post. No index/cache. | P2 | S | — |
| 41 | **Exam results GET doesn't paginate.** Returns all results with no limit. | P2 | S | — |

---

## Category 7: Code Quality

| # | Issue | Priority | Effort | PRD |
|---|-------|----------|--------|-----|
| 42 | **110+ manual imports in `lib/content.ts`** for JSON files. Brittle, hard to maintain. | P2 | M | — |
| 43 | **Excessive `as unknown as Type` casts** in content.ts. Suggests JSON shapes don't match interfaces. | P2 | S | — |
| 44 | **Magic numbers everywhere** (exam times: "35 minuten", "45 minuten"). No constants file. | P2 | XS | — |
| 45 | **`Set<string>` for bookmarks is non-serializable.** Will break if ever persisted. | P2 | XS | — |
| 46 | **No input validation library** (Zod/Yup). All API validation is manual string checks. | P2 | M | — |
| 47 | **Async function `syncToCloud()` doesn't await** — returns immediately, caller can't detect failure. | P1 | S | PRD-04 |

---

## Category 8: Accessibility

| # | Issue | Priority | Effort | PRD |
|---|-------|----------|--------|-----|
| 48 | **Missing ARIA labels** on icon-only buttons (ExamBottomNav grid button, QuestionGrid close). | P1 | XS | PRD-06 |
| 49 | **Keyboard shortcuts not announced** to screen readers. | P2 | S | — |
| 50 | **Potential color contrast failures** on landing page (Testimonials, TrustStats sections). | P2 | S | — |

---

## PRD Assignment Summary

| PRD | Title | Issues Covered | Effort |
|-----|-------|---------------|--------|
| PRD-03 | Fix broken content references & navigation | #1, #2, #3, #19 | M |
| PRD-04 | Fix progress tracking & cloud sync | #4, #5, #47 | M |
| PRD-05 | Security hardening | #11, #12, #13, #14, #15, #16, #17, #18 | L |
| PRD-06 | Bug fixes & UX polish bundle | #20, #21, #22, #23, #24, #26, #27, #31, #32, #48 | M |
| PRD-07 | SEO & production readiness | #7, #8, #33, #34, #36, #37 | S |
| PRD-08 | Blog content & metadata | #6, #9 | M |

*PRD-01 and PRD-02 already exist in docs/prds/.*
