# PRD-06: Bug Fixes & UX Polish Bundle

**Date:** 2026-02-10
**Status:** Draft
**Branch:** feature/bug-fixes-ux-polish
**Effort:** M

---

## Problem & Goal

The inburgering app has a collection of small but impactful bugs and UX issues that degrade user experience and create broken workflows:

1. **Dead footer links** – All footer links are `href="#"` and don't navigate anywhere
2. **Missing pricing page** – "View Pricing" button exists but no pricing content or page
3. **Spreken module skips Part 1** – Module sequence doesn't include Part 1 speaking tasks
4. **Question count mismatch** – Exam claims 10 questions but only has 9 (UI vs. data mismatch)
5. **Keyboard listener leak** – `ExamQuestionPanel` recreates `handleKeyDown` each render, cleanup uses stale reference
6. **No error recovery UI** – Generic error message on exam data load failure with no retry button
7. **Image load failures** – Spreken tasks show blank space when images fail to load (no fallback)
8. **Inconsistent "Coming Soon" labels** – Module UI shows mixed messaging ("Coming Soon", "Coming Soon...", unclear status)
9. **No homepage nav from quick assessment** – Quick assessment flow doesn't navigate back to homepage
10. **Missing ARIA labels** – Icon-only buttons (ExamBottomNav grid button, QuestionGrid close) lack accessibility labels

**Goal:** Ship a bundle of quick wins that improve UX, fix broken navigation, enhance accessibility, and resolve data/UI inconsistencies.

---

## User Story

As a student using the app,
I want all buttons to work and navigate me to the intended pages,
So that I can complete my exam, view pricing, and access all features.

As a student preparing for the spreken module,
I want to see all speaking tasks including Part 1,
So that I can practice all required sections.

As an accessibility user,
I want all buttons (including icon-only buttons) to have clear labels,
So that I can navigate the app using a screen reader.

As a developer,
I want keyboard event listeners to clean up properly,
So that memory isn't leaked with each render cycle.

---

## Requirements

### Footer Navigation Fix
- [ ] In `components/landing/LandingFooter.tsx`:
  - Replace all `href="#"` with actual route paths
  - Determine target pages for: Company, Product, Resources, Legal links
  - If pages don't exist, either create them or remove the links
  - Test all footer links navigate correctly
  - Verify footer links work on both homepage and other pages

### Pricing Page Creation
- [ ] Create `app/upgrade/page.tsx` with pricing content (or update if exists)
  - Display pricing tiers if applicable
  - Show feature comparison
  - Include CTA buttons ("Start Free Trial", "Upgrade", etc.)
- [ ] Update "View Pricing" button to navigate to `/upgrade`
- [ ] If pricing data is dynamic, fetch from API or config

### Spreken Module Part 1
- [ ] In `app/learn/spreken/page.tsx` or spreken module structure:
  - Audit the module sequence (check if Part 1 tasks exist in data)
  - If Part 1 tasks are missing from data files, add them
  - If Part 1 is in data but skipped by code logic, fix the rendering
  - Ensure all parts (1-4 or however many) are displayed
  - Test spreken module loads all parts

### Question Count Consistency
- [ ] Audit exam data for question count mismatches:
  - Find where "10 questions" text is displayed
  - Verify actual question count in exam JSON or API
  - Update UI label to match actual count (or add 9th question)
  - Check if issue is data-side (missing question) or UI-side (wrong label)
  - Test exam displays correct count before and after submission

### Keyboard Listener Leak Fix
- [ ] In `components/ExamQuestionPanel.tsx`:
  - Identify where `handleKeyDown` is defined
  - Move `handleKeyDown` outside of render (use `useCallback` if in React)
  - Add proper cleanup in `useEffect` with dependency array
  - Verify event listener is removed on component unmount
  - Test: keyboard shortcuts work and no memory leak after repeated renders

### Error Recovery UI
- [ ] In `components/ExamCard.tsx` or exam error boundary:
  - Replace generic error message with actionable UI
  - Add "Retry" button that re-fetches exam data
  - Display error details in console for debugging
  - Show user-friendly error message (e.g., "Failed to load exam. Please try again.")
  - Add loading spinner while retrying

### Image Fallback for Spreken
- [ ] In `components/spreken/SpeakingPrompt.tsx` or image component:
  - Detect image load failure (use `onError` handler or Suspense)
  - Display fallback UI: placeholder image, icon, or error text
  - Options: generic mic icon, "Image unavailable" text, gray placeholder box
  - Test: broken image URLs show fallback, not blank space

### Consistent "Coming Soon" Labels
- [ ] Audit all module/feature UI for "Coming Soon" messaging:
  - Standardize text: use "Coming Soon" (no ellipsis) across all components
  - Or use consistent icon + text combo
  - Check: app/learn pages, module cards, feature placeholders
  - Update inconsistent labels to match chosen standard

### Homepage Navigation from Quick Assessment
- [ ] In quick assessment flow (likely in a modal or separate page):
  - Add "Back to Home" or "Done" button after assessment completion
  - Verify link navigates to `/` or `/dashboard`
  - Test: users can exit quick assessment and return to homepage
  - Consider: should it auto-redirect after timeout?

### Accessibility: ARIA Labels on Icon-Only Buttons
- [ ] In `components/ExamBottomNav.tsx`:
  - Find grid/menu icon button (show all questions)
  - Add `aria-label="Show all questions"` or similar
  - Test with screen reader (e.g., NVDA, JAWS)

- [ ] In `components/QuestionGrid.tsx`:
  - Find close button (X icon)
  - Add `aria-label="Close question grid"` or similar
  - Test with screen reader

- [ ] Audit for other icon-only buttons and add labels

---

## Non-Goals

- Do not redesign the app layout or styling
- Do not add new features beyond fixes listed
- Do not refactor core exam logic or data fetching
- Do not change module content or difficulty
- Do not implement analytics or tracking

---

## Success Criteria

- [ ] All footer links navigate to correct pages (no more `href="#"`)
- [ ] `/upgrade` page displays pricing or relevant upgrade content
- [ ] Spreken module displays all parts including Part 1
- [ ] Exam UI displays correct question count (matches actual questions)
- [ ] No console warnings about missing/stale event listeners
- [ ] Exam error state shows "Retry" button and user can recover
- [ ] Spreken image load failure shows fallback (no blank space)
- [ ] All "Coming Soon" labels are consistent across app
- [ ] Quick assessment completion navigates back to homepage
- [ ] Icon-only buttons have `aria-label` attributes
- [ ] Screen reader reads button labels correctly (test with accessibility tool)

---

## Content & File Changes

| File | Change Type | Issue(s) | Notes |
|------|------------|---------|-------|
| `components/landing/LandingFooter.tsx` | Update links | Footer dead links | Replace `#` with actual routes or remove |
| `app/upgrade/page.tsx` | Create or update | Missing pricing page | Add pricing content and CTA |
| `app/learn/spreken/page.tsx` | Fix sequence | Spreken skips Part 1 | Include all parts in module sequence |
| Exam data/UI | Fix count | Question count mismatch | Update label or add missing question |
| `components/ExamQuestionPanel.tsx` | Refactor listeners | Keyboard listener leak | Use `useCallback`, proper cleanup |
| `components/ExamCard.tsx` | Add UI | No error recovery | Add Retry button, loading state |
| `components/spreken/SpeakingPrompt.tsx` | Add fallback | Image load failures | Handle `onError`, show placeholder |
| Various module components | Standardize text | Inconsistent "Coming Soon" | Use consistent labeling |
| Quick assessment flow (modal/page) | Add nav button | No homepage return | Add "Back to Home" button |
| `components/ExamBottomNav.tsx` | Add ARIA | Missing accessibility | Add `aria-label` to grid button |
| `components/QuestionGrid.tsx` | Add ARIA | Missing accessibility | Add `aria-label` to close button |

---

## Open Questions

- [ ] Should the `/upgrade` page be a marketing page or a simple pricing table?
- [ ] For spreken Part 1: does the data exist but not render, or is data actually missing?
- [ ] For question count mismatch: should we add the 9th question or update the UI?
- [ ] Should quick assessment auto-redirect to homepage after completion, or require user action?
- [ ] What image fallback style is preferred: icon, placeholder, text, or gray box?
- [ ] Should "Coming Soon" have a tooltip or additional context (e.g., "Coming Soon - Q2 2026")?

---

## CC Handoff

**To:** Code Completion / Frontend Developer
**Prompt:**

```
Fix 10 small but impactful bugs and UX issues in the inburgering app for better navigation, accessibility, and user experience.

ISSUES TO FIX:

1. FOOTER LINKS (components/landing/LandingFooter.tsx):
   - All footer links use href="#" and don't navigate
   - Replace with actual route paths (e.g., /about, /contact, /terms)
   - Or remove if pages don't exist
   - Test: all footer links navigate correctly

2. MISSING PRICING PAGE (/app/upgrade/page.tsx):
   - "View Pricing" button exists but no pricing content
   - Create or update /upgrade page with pricing tiers/features
   - Add CTA buttons (Start Free Trial, Upgrade, etc.)
   - Update button to navigate to /upgrade

3. SPREKEN MODULE SKIPS PART 1 (app/learn/spreken/page.tsx):
   - Module sequence missing Part 1 speaking tasks
   - Audit: does Part 1 data exist but not render? Or missing from data?
   - If data missing: add Part 1 tasks
   - If code skips it: fix rendering logic
   - Test: all parts (1-4) display

4. QUESTION COUNT MISMATCH:
   - Exam UI says "10 questions" but only 9 exist
   - Find where count is displayed and verify against actual data
   - Either update label or add missing 9th question
   - Test: count matches actual questions

5. KEYBOARD LISTENER LEAK (components/ExamQuestionPanel.tsx):
   - handleKeyDown recreated each render, stale cleanup reference
   - Move handleKeyDown outside render (use useCallback)
   - Add useEffect with proper cleanup and dependencies
   - Test: no console warnings, keyboard shortcuts work

6. NO ERROR RECOVERY (components/ExamCard.tsx):
   - Exam data load failure shows generic error, no retry
   - Add "Retry" button that re-fetches data
   - Show user-friendly error message
   - Add loading state while retrying

7. IMAGE LOAD FAILURES (components/spreken/SpeakingPrompt.tsx):
   - Spreken images show blank space on load failure
   - Add onError handler or Suspense
   - Display fallback: placeholder icon, gray box, or "Image unavailable"
   - Test: broken images show fallback, not blank

8. INCONSISTENT "COMING SOON" LABELS:
   - Modules show mixed "Coming Soon", "Coming Soon...", unclear status
   - Standardize: use "Coming Soon" (no ellipsis) everywhere
   - Or use consistent icon+text combo
   - Audit all module/feature UI

9. NO HOMEPAGE NAV FROM QUICK ASSESSMENT:
   - Quick assessment completes but doesn't navigate back
   - Add "Back to Home" or "Done" button
   - Navigate to / or /dashboard
   - Test: users can exit and return to homepage

10. MISSING ARIA LABELS (accessibility):
    - ExamBottomNav: grid/menu icon button needs aria-label="Show all questions"
    - QuestionGrid: close (X) button needs aria-label="Close question grid"
    - Audit for other icon-only buttons
    - Test with screen reader (NVDA, JAWS)

KEY FILES:
- components/landing/LandingFooter.tsx
- app/upgrade/page.tsx
- app/learn/spreken/page.tsx
- components/ExamQuestionPanel.tsx
- components/ExamCard.tsx
- components/spreken/SpeakingPrompt.tsx
- components/ExamBottomNav.tsx
- components/QuestionGrid.tsx
- Quick assessment flow component(s)

NON-GOALS:
- Don't redesign layout or styling
- Don't add new features
- Don't refactor core exam logic
- Don't change module content

SUCCESS CRITERIA:
- Footer links navigate (no more href="#")
- /upgrade page displays pricing
- Spreken shows all parts including Part 1
- Exam displays correct question count
- No event listener warnings in console
- Exam error shows Retry button
- Spreken images show fallback on load failure
- "Coming Soon" labels consistent
- Quick assessment returns to homepage
- Icon-only buttons have aria-label attributes
- Screen reader reads button labels correctly
```

---
