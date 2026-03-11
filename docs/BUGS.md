# Bug Tracker

Ongoing bug tracker for passinburgering.com. Detailed original report: [BUG_REPORT.md](../BUG_REPORT.md) (Feb 5, 2026).

**Status values:** `Open` · `In Progress` · `Won't Fix` · `Fixed`

> **Widget-reported bugs** are now tracked as [GitHub Issues](https://github.com/castilloraymond/dutch-exams/issues?q=label%3Abug).

## Open Bugs

### Security — Deferred (requires infrastructure)

| # | Issue | Location | Reported | Status | Notes |
|---|-------|----------|----------|--------|-------|
| 11 | In-memory rate limiter resets on each serverless invocation | `lib/rate-limit.ts` | Unknown | Open | Replace with Upstash Redis for Vercel. Current limiter still prevents rapid bursts within a single instance. |
| 12 | No server-side route protection in middleware | `middleware.ts` | Unknown | Open | Content is static JSON (not sensitive) and API routes already check auth. Low real-world risk but should be added for defense-in-depth. |

## Fixed Bugs

| # | Bug | Reported | Fixed | Notes |
|---|-----|----------|-------|-------|
| 1 | Login/Signup pages return 404 | Unknown | Mar 2026 | Redirects added in `next.config.ts` |
| 2 | Trial Lezen questions missing reading passages | Unknown | Mar 2026 | Passages load correctly in free preview |
| 4 | Inconsistent "Coming Soon" labels | Unknown | Mar 2026 | No "Coming Soon" labels exist in current code |
| 5 | Question count mismatch (10 vs 9) | Unknown | Mar 2026 | Index and content both show correct count |
| 6 | Spreken skips Part 1 | Unknown | Mar 2026 | Task correctly has `partNumber: 1` |
| 7 | Footer links broken (href="#") | Unknown | Mar 2026 | Links go to `/privacy`, `/terms`, `/contact` |
| 8 | "View Pricing" shows no prices | Unknown | Mar 2026 | `/upgrade` page has full pricing |
| 10 | No homepage nav from assessments | Unknown | Mar 2026 | Added back arrow to ExamHeader on `/try/*` exams |
| - | Lezen passage text missing + timer reset after idle | Unknown | Feb 2026 | Commit af34cc4 |
| - | Route logged-in users to /learn from Start Practice | Unknown | Feb 2026 | Commit c9ca821 |

## Won't Fix

| # | Bug | Notes |
|---|-----|-------|
| 3 | Spreken image not loading in trial | Free task (`part1-homework`) has no images by design |
| 9 | Writing uses self-assessment only | By design — rubric-based self-assessment per CLAUDE.md |

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
