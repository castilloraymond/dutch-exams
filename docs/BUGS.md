# Bug Tracker

Ongoing bug tracker for passinburgering.com. Detailed original report: [BUG_REPORT.md](../BUG_REPORT.md) (Feb 5, 2026).

**Status values:** `Open` · `In Progress` · `Needs Triage` · `Stale` · `Won't Fix` · `Fixed`

## Open Bugs

### My Reports (owner-reported via bug widget)

| # | Bug | Location | Reported | Status | Notes |
|---|-----|----------|----------|--------|-------|

### Needs Triage (reported via bug widget)

| # | Bug | Location | Reported | Status | Notes |
|---|-----|----------|----------|--------|-------|

### Critical

| # | Bug | Location | Reported | Status | Notes |
|---|-----|----------|----------|--------|-------|
| 1 | Login/Signup pages return 404 | `/login`, `/signup` | Unknown | Open | Blocks user registration |
| 2 | Trial Lezen questions missing reading passages | `/try/lezen` | Unknown | Open | Questions shown without passage context. Full mock at `/learn/lezen/mock/` works fine |

### High

| # | Bug | Location | Reported | Status | Notes |
|---|-----|----------|----------|--------|-------|
| 3 | Spreken image not loading in trial | `/try/spreken` | Unknown | Open | Shows alt text only ("Persoon eet een gezonde salade...") |
| 4 | Inconsistent "Coming Soon" labels | Homepage vs `/try` | Unknown | Open | Homepage says Coming Soon for Schrijven/Spreken, but /try has them available |

### Medium

| # | Bug | Location | Reported | Status | Notes |
|---|-----|----------|----------|--------|-------|
| 5 | Question count mismatch (10 vs 9) | `/try` Lezen | Unknown | Open | Card says 10 questions, quiz shows "Question X of 9" |
| 6 | Spreken skips Part 1 | `/try/spreken` | Unknown | Open | Immediately shows "Part 2" with no Part 1 |
| 7 | Footer links broken (href="#") | All pages | Unknown | Open | Privacy, Terms, Contact link to "#" |
| 8 | "View Pricing" button shows no prices | Footer CTA | Unknown | Open | Scrolls to #modules section, not pricing |

### Low / UX

| # | Bug | Location | Reported | Status | Notes |
|---|-----|----------|----------|--------|-------|
| 9 | Writing uses self-assessment only | `/try/schrijven` | Unknown | Open | No actual evaluation of writing quality |
| 10 | No homepage nav from assessments | `/try/*` | Unknown | Open | Missing logo/home link in assessment header |

### Security — Deferred (requires infrastructure)

| # | Issue | Location | Reported | Status | Notes |
|---|-------|----------|----------|--------|-------|
| 11 | In-memory rate limiter resets on each serverless invocation | `lib/rate-limit.ts` | Unknown | Open | Replace with Upstash Redis for Vercel. Current limiter still prevents rapid bursts within a single instance. |
| 12 | No server-side route protection in middleware | `middleware.ts` | Unknown | Open | Content is static JSON (not sensitive) and API routes already check auth. Low real-world risk but should be added for defense-in-depth. |

## Fixed Bugs

| # | Bug | Reported | Fixed | Commit |
|---|-----|----------|-------|--------|
| - | Lezen passage text missing + timer reset after idle | Unknown | Feb 2026 | af34cc4 |
| - | Route logged-in users to /learn from Start Practice | Unknown | Feb 2026 | c9ca821 |

## Report a New Bug

Copy this template and add a row to the appropriate severity table above:

```
### [Next #]: Brief description
- **Severity:** Critical / High / Medium / Low
- **Location:** `/route/path`
- **Steps to reproduce:**
  1. Step 1
  2. Step 2
  3. Observe...
- **Expected:** What should happen
- **Actual:** What actually happens
- **Notes:** Any additional context
```
