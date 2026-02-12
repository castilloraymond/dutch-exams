# Production Roadmap: passinburgering.com

**Date:** 2026-02-10
**Goal:** Ship a production-quality site that won't embarrass us in front of paying customers.

---

## Phased Implementation Plan

### Phase 1: Critical Fixes (Must fix before any public traffic)

**Timeline:** 3–5 days
**Mantra:** "If a user hits this, they'll leave and never come back."

| Order | PRD | Title | Effort | What it fixes |
|-------|-----|-------|--------|---------------|
| 1 | PRD-03 | Fix broken content references & navigation | M | Lezen module partially broken, quick assessment crashes, login/signup 404s. Users can't access core features. |
| 2 | PRD-04 | Fix progress tracking & cloud sync | M | Cloud sync drops writing/speaking data, retake scores don't improve, sync errors silent. Users lose work. |
| 3 | PRD-05 | Security hardening | L | Anyone can read anyone's progress via email, open redirect vulnerabilities, no rate limiting, XSS vectors. |

**Exit criteria for Phase 1:**
- All content references resolve correctly (no 404s in lezen, quick assessment, auth)
- Progress sync round-trips all module data (passages + writing + speaking)
- Retaking a question updates the score
- API endpoints require authentication where appropriate
- All redirect parameters validated against allowlist
- Rate limiting active on all public API endpoints
- `npm run build` passes with zero errors

---

### Phase 2: UX Quality for Launch (Fix before marketing push)

**Timeline:** 3–5 days (can overlap with Phase 1 on separate branches)
**Mantra:** "A paying customer should never feel confused or stuck."

| Order | PRD | Title | Effort | What it fixes |
|-------|-----|-------|--------|---------------|
| 4 | PRD-06 | Bug fixes & UX polish bundle | M | 10 known bugs: broken footer, missing pricing, Part 1 skip, keyboard leaks, missing error recovery, no image fallbacks, a11y gaps. |
| 5 | PRD-07 | SEO & production readiness | S | Incomplete sitemap (50% of content missing), broken OG image, wrong lang tag, favicon quality. |
| 6 | PRD-08 | Blog content & metadata | M | 3 blog posts are placeholder stubs. Metadata year mismatches. Embarrassing if discovered. |

**Exit criteria for Phase 2:**
- Footer links all navigate to real pages
- Pricing page has content (or "View Pricing" CTA removed)
- Spreken shows all 4 parts including Part 1
- No keyboard event listener leaks in exam sessions
- All exam pages have retry UI on load failure
- Image failures show fallback, not blank space
- Sitemap covers 100% of published content
- OG image renders correctly in social media previews
- All 3 blog posts have real content (800+ words each)
- `npm run build` passes, no console errors on any page

---

### Phase 3: Polish & Optimization (Post-launch improvements)

**Timeline:** Ongoing, 1–2 weeks
**Mantra:** "Make it faster, cleaner, more robust."

These items don't have PRDs yet. Create PRDs as needed when prioritized.

| Priority | Issue # | What | Effort |
|----------|---------|------|--------|
| P2 | #10 | Add localStorage versioning/migration strategy | M |
| P2 | #25 | Filter `useSyncExternalStore` to only progress keys | S |
| P2 | #35 | Add Content Security Policy headers | S |
| P2 | #38 | Lazy-load question map instead of importing all at boot | M |
| P2 | #39 | Memoize profile page arrays | XS |
| P2 | #40 | Index blog posts at build time instead of O(n) lookup | S |
| P2 | #41 | Paginate exam results API | S |
| P2 | #42 | Replace 110+ manual imports with dynamic content loading | M |
| P2 | #43 | Fix JSON/TypeScript type mismatches in content.ts | S |
| P2 | #44 | Extract magic numbers to constants file | XS |
| P2 | #45 | Make bookmarks serializable (Set → Record) | XS |
| P2 | #46 | Add Zod schema validation to all API endpoints | M |
| P2 | #49 | Announce keyboard shortcuts to screen readers | S |
| P2 | #50 | Fix color contrast on landing page sections | S |
| P2 | #29 | Fix FAQ accordion max-height truncation on mobile | XS |
| P2 | #30 | Fix FeedbackWidget overflow on narrow phones | XS |

---

## Dependency Map

```
Phase 1 (blocking)
├── PRD-03 (content fixes) ← Start here, unblocks testing of other modules
├── PRD-04 (progress sync) ← Can run in parallel with PRD-03
└── PRD-05 (security) ← Depends on PRD-04 being done (auth patterns affect API)

Phase 2 (launch quality)
├── PRD-06 (bug fixes) ← Can start during Phase 1 on separate branch
├── PRD-07 (SEO) ← Independent, can run anytime
└── PRD-08 (blog content) ← Independent, can run anytime

Phase 3 (polish)
└── All items independent, pick based on available time
```

---

## Recommended Work Order

For a single developer working sequentially:

1. **PRD-03** first — fixes the most visible breakage (content crashes)
2. **PRD-04** second — fixes data integrity (progress tracking)
3. **PRD-06** third — quick wins that make the app feel solid
4. **PRD-05** fourth — security hardening (most complex, benefits from stable codebase)
5. **PRD-07** fifth — SEO prep for launch
6. **PRD-08** sixth — blog content (can be done by non-engineer)

For two developers working in parallel:

- **Dev A:** PRD-03 → PRD-04 → PRD-05
- **Dev B:** PRD-06 → PRD-07 → PRD-08

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Content fixes break existing progress data | Medium | High | Test with sample localStorage data before deploying |
| Security changes break auth flow | Medium | High | Test full signup → login → sync → logout flow |
| Blog writing takes longer than expected | High | Low | Can launch without blog; hide blog link if needed |
| Rate limiting blocks legitimate users | Low | Medium | Start with generous limits (100 req/min), tighten later |
