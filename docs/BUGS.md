# Bug Tracker

Ongoing bug tracker for passinburgering.com. Detailed original report: [BUG_REPORT.md](../BUG_REPORT.md) (Feb 5, 2026).

## Open Bugs

### Critical

| # | Bug | Location | Status | Notes |
|---|-----|----------|--------|-------|
| 1 | Login/Signup pages return 404 | `/login`, `/signup` | Open | Blocks user registration |
| 2 | Trial Lezen questions missing reading passages | `/try/lezen` | Open | Questions shown without passage context. Full mock at `/learn/lezen/mock/` works fine |

### High

| # | Bug | Location | Status | Notes |
|---|-----|----------|--------|-------|
| 3 | Spreken image not loading in trial | `/try/spreken` | Open | Shows alt text only ("Persoon eet een gezonde salade...") |
| 4 | Inconsistent "Coming Soon" labels | Homepage vs `/try` | Open | Homepage says Coming Soon for Schrijven/Spreken, but /try has them available |

### Medium

| # | Bug | Location | Status | Notes |
|---|-----|----------|--------|-------|
| 5 | Question count mismatch (10 vs 9) | `/try` Lezen | Open | Card says 10 questions, quiz shows "Question X of 9" |
| 6 | Spreken skips Part 1 | `/try/spreken` | Open | Immediately shows "Part 2" with no Part 1 |
| 7 | Footer links broken (href="#") | All pages | Open | Privacy, Terms, Contact link to "#" |
| 8 | "View Pricing" button shows no prices | Footer CTA | Open | Scrolls to #modules section, not pricing |

### Low / UX

| # | Bug | Location | Status | Notes |
|---|-----|----------|--------|-------|
| 9 | Writing uses self-assessment only | `/try/schrijven` | Open | No actual evaluation of writing quality |
| 10 | No homepage nav from assessments | `/try/*` | Open | Missing logo/home link in assessment header |

## Fixed Bugs

| # | Bug | Fixed Date | Commit |
|---|-----|------------|--------|
| - | Lezen passage text missing + timer reset after idle | Feb 2026 | af34cc4 |
| - | Route logged-in users to /learn from Start Practice | Feb 2026 | c9ca821 |

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
