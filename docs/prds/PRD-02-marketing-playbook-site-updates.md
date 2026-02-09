# Plan: Make Marketing Playbook Actionable for the Site

## Context

The marketing playbook (`docs/marketing/passinburgering-playbook.md`) repositions the site toward busy professional kennismigranten (30% ruling holders). The current site targets "expats" broadly and leads with "free" messaging. We need to blend the professional/efficiency positioning into the existing site while keeping "Try Free Exam" CTAs, build a blog engine for the SEO content strategy, and add GA4 analytics.

**Approach**: Keep the free-trial hook but layer professional efficiency messaging throughout. Build the simplest blog engine that works with the existing static content pattern.

---

## Phase A: Homepage Copy Updates

All changes are string replacements — no structural/layout changes.

### A1. `components/landing/UrgencyBanner.tsx`
- **Current**: "Exam date approaching? Most expats get results within 2–3 weeks of practice."
- **New**: "The KNM and Spreken exams changed in 2025 — Make sure your prep is up to date."

### A2. `components/landing/LandingHero.tsx`
- Badge: "Made by expats, for expats" → "The fastest way to pass"
- Subtitle: "Practice on the real exam, before the real exam." → "The most efficient inburgering prep for busy professionals. Pass in 30 days studying 20 minutes a day."
- Bullets → "Updated for the 2025 KNM and Spreken exam changes", "Practice anytime — no tutors, no scheduling, no commute", "Know exactly when you're ready with progress tracking"
- Sub-CTA: "See your score instantly" → "20 min/day is all you need"
- Keep CTAs ("Try Free Exam" / "Continue Practice") unchanged

### A3. `components/landing/ProblemSolution.tsx`
- Problem heading: "Apps and tutors won't prepare you for the actual exam" → "Traditional prep wastes your most valuable resource: time"
- Problems → "Group classes designed for beginners waste your time when you're already at A2", "Private tutors cost €30–60/hour and require scheduling around your work", "Outdated study materials don't cover the 2025 KNM and Spreken format changes"
- Solutions → "Exam-focused practice — skip the fluff, practice the actual question types", "Study at midnight, during lunch, or on the train — 20 minutes is enough", "Always up to date — built for the current exam format, not last year's"
- Keep solution heading as-is

### A4. `components/landing/FeatureCards.tsx`
- Section badge: "Complete Exam Coverage" → "Efficient Exam Prep"
- Update "All 5 Modules" description to mention "Updated for 2025 format changes"
- Update "Instant Feedback" description to emphasize speed vs waiting for a tutor

### A5. `components/landing/FinalCTA.tsx`
- "Start practicing for free." → "Start preparing efficiently."
- "Join 2,400+ expats who have already successfully passed..." → "Join 2,400+ professionals who prepared on their own schedule and passed."

### A6. `components/landing/FAQ.tsx` (landing page)
- Update "How long should I practice" answer to include "Most professionals practice 2–4 weeks, 20 minutes per day"
- Add 3 new FAQ items:
  - "I'm on the 30% ruling. Do I need to inburger?" (No, but required for PR/citizenship. A2 under Wi2013.)
  - "What changed about the exams in 2025?" (KNM overhaul July 2025, Spreken format March 2025)
  - "Do I need A2 or B1?" (Most kennismigranten need A2, regardless of when they decide to integrate)

### A7. `components/landing/LandingNav.tsx`
- Add "Blog" link next to "Modules" (both desktop and mobile menu)

---

## Phase B: SEO Metadata Updates

### B1. `app/layout.tsx` — metadata object
- Description: "Free practice exams for the Dutch inburgering exam..." → "The most efficient inburgering exam prep for busy professionals. Practice all 5 modules — KNM, Lezen, Luisteren, Schrijven & Spreken — updated for 2025 exam changes."
- Add keywords: "kennismigrant inburgering", "30% ruling inburgering", "inburgering 2025", "KNM exam 2025", "inburgering permanent residence"
- Update OpenGraph + Twitter descriptions to match
- Update Organization schema description

### B2. `app/faq/page.tsx` — add kennismigrant FAQ entries
- Add 3 new items to `faqItems` array:
  - "I'm a kennismigrant / 30% ruling holder. Do I need to inburger?"
  - "What changed about the KNM exam in July 2025?"
  - "What changed about the Spreken exam in March 2025?"

### B3. `app/sitemap.ts` — add blog routes (after Phase D)
- Import `getAllBlogPosts` from `@/lib/blog`
- Add `/blog` and `/blog/[slug]` entries

---

## Phase C: Google Analytics (GA4)

### C1. Create `components/GoogleAnalytics.tsx`
- Simple component using `next/script` with `strategy="afterInteractive"`
- Reads `NEXT_PUBLIC_GA_MEASUREMENT_ID` env var
- Returns null if env var not set (safe for dev)

### C2. Add `<GoogleAnalytics />` to `app/layout.tsx`
- Render inside `<body>`, before `<AuthProvider>`

### C3. Add env var to `.env.local.example`
- `NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX`

---

## Phase D: Blog Engine

**Design**: Plain `.md` files with YAML frontmatter in `content/blog/`, parsed with `gray-matter` + `marked`. Follows the existing static content pattern.

### D1. Install dependencies
```bash
npm install gray-matter marked
```

### D2. Create `lib/blog.ts`
- `getAllBlogPosts()` → reads `content/blog/*.md`, returns sorted metadata array
- `getBlogPost(slug)` → returns metadata + parsed HTML content
- `getAllBlogSlugs()` → for `generateStaticParams`
- Uses `fs.readFileSync` (server-side only, build-time)
- Pattern follows `lib/content.ts`

### D3. Create `content/blog/` directory + 3 placeholder posts
Frontmatter schema:
```yaml
---
title: "..."
slug: "..."
description: "..."
date: "2026-02-10"
author: "Raymond"
keywords: ["..."]
---
```
Posts (with minimal placeholder body — actual content to be written separately using the playbook's system prompt):
1. `inburgering-exam-guide-professionals-2026.md`
2. `knm-exam-2026-new-format.md`
3. `inburgering-kennismigranten-30-percent-ruling.md`

### D4. Replace `app/blog/page.tsx` (Coming Soon → blog index)
- Server component (no `"use client"`)
- Calls `getAllBlogPosts()`, renders cards with title/description/date
- Links to `/blog/[slug]`
- Keeps existing header pattern (ArrowLeft, sticky header)
- Keeps LandingFooter

### D5. Create `app/blog/[slug]/page.tsx`
- Server component with `generateStaticParams` + `generateMetadata`
- Fetches post via `getBlogPost(slug)`, renders HTML with `dangerouslySetInnerHTML`
- Includes Article JSON-LD schema per post
- OpenGraph metadata per post

### D6. Add blog prose styles to `app/globals.css`
- Custom `.prose-navy` class for rendered markdown (headings, paragraphs, lists, links, tables, blockquotes)
- Matches existing design tokens (--landing-navy, --landing-orange, Source Serif 4 headings, Outfit body)
- No additional dependency needed (skip `@tailwindcss/typography`)

---

## Files Summary

**Modified (12)**:
| File | Change |
|------|--------|
| `components/landing/UrgencyBanner.tsx` | Copy update |
| `components/landing/LandingHero.tsx` | Copy update |
| `components/landing/ProblemSolution.tsx` | Copy update |
| `components/landing/FeatureCards.tsx` | Copy update |
| `components/landing/FinalCTA.tsx` | Copy update |
| `components/landing/FAQ.tsx` | Add 3 FAQ items |
| `components/landing/LandingNav.tsx` | Add Blog link |
| `app/layout.tsx` | Metadata + GA4 |
| `app/faq/page.tsx` | Add 3 FAQ items |
| `app/blog/page.tsx` | Replace Coming Soon |
| `app/sitemap.ts` | Add blog routes |
| `app/globals.css` | Blog prose styles |

**New (5)**:
| File | Purpose |
|------|---------|
| `components/GoogleAnalytics.tsx` | GA4 script |
| `lib/blog.ts` | Blog content loading |
| `app/blog/[slug]/page.tsx` | Blog post page |
| `content/blog/*.md` (3 files) | Placeholder posts |
| `.env.local.example` update | GA4 env var |

**New dependency**: `gray-matter`, `marked`

---

## Verification

1. `npm run build` — ensure no build errors (especially blog `fs` usage working in server components)
2. `npm run dev` — verify:
   - Homepage shows updated copy (professional/efficiency messaging, 2025 changes)
   - "Try Free Exam" CTA still works
   - FAQ on landing page shows new items with correct schema
   - `/faq` page shows new kennismigrant items
   - `/blog` shows post cards (not "Coming Soon")
   - `/blog/[slug]` renders markdown content with correct styling
   - Blog nav link works in both desktop and mobile
   - GA4 script loads when env var is set (check network tab)
3. View page source on `/blog/[slug]` — confirm Article JSON-LD schema
4. Check `/sitemap.xml` — confirm blog URLs are included
