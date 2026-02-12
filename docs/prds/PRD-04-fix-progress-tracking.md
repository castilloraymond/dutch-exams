# PRD-04: Fix Progress Tracking & Cloud Sync

**Date:** 2026-02-10
**Status:** Draft
**Branch:** feature/fix-progress-tracking
**Effort:** M

---

## Problem & Goal

The progress tracking system has three critical bugs that cause data loss and incorrect scoring:

1. **Incomplete cloud sync** – `POST /api/progress` only saves `passageProgress`, dropping `writingProgress` and `speakingProgress` data
2. **Retake scoring bug** – `updatePassageProgress()` doesn't recalculate correctness when users re-answer questions, so score improvements aren't recorded
3. **Broken sync callback** – `syncToCloud()` is async but doesn't await, so callers can't detect sync success/failure; users get no error feedback

**Goal:** Fix progress persistence to save all module data, correctly score retakes, and provide reliable sync feedback so users don't lose progress and see accurate scores.

---

## User Story

As a student taking the exam,
I want my progress on reading, writing, and speaking modules to persist,
So that I don't lose data when I close the app or refresh.

As a student retaking a question,
I want my new score to reflect my improvement if I answer correctly,
So that my progress accurately represents my learning.

As a student syncing to the cloud,
I want feedback on whether my progress saved successfully,
So that I know if my data was synced or if there's an error.

---

## Requirements

### Fix Cloud Sync Data Loss (POST /api/progress)
- [ ] Verify `POST /api/progress` (line 29 in `app/api/progress/route.ts`) saves `passageProgress`, `writingProgress`, and `speakingProgress`
- [ ] Update request body parsing to extract all three modules
- [ ] Save all three modules to database/storage instead of just `passageProgress`
- [ ] Verify `GET /api/progress` reconstructs the complete `UserProgress` object with all modules
- [ ] Test full round-trip: save all modules → retrieve → verify shape matches `lib/types.ts`

### Fix Retake Scoring Bug (updatePassageProgress)
- [ ] Review `updatePassageProgress()` in `lib/progress.ts` (lines 66-68)
- [ ] Identify why correctness isn't updated on retakes
- [ ] Implement logic to:
  - Track whether question was answered before
  - Update correctness to true if user answers correctly on retake
  - Recalculate passage-level scores when question correctness changes
- [ ] Preserve attempt count and timestamp data
- [ ] Test: user answers wrong → retakes → answers right → correctness should flip to true

### Fix Sync Callback (syncToCloud)
- [ ] Review `syncToCloud()` in `hooks/useProgress.ts`
- [ ] Add proper await to fetch call
- [ ] Parse response and return success/failure indicator
- [ ] Implement error handling for network/server failures
- [ ] Update callers to:
  - Check return value before proceeding
  - Show user feedback (toast/notification) on sync error
  - Optionally retry sync if it fails
- [ ] Test: trigger sync → verify await works → verify error handling works

### Testing & Validation
- [ ] Unit test: `POST /api/progress` saves all three modules
- [ ] Unit test: `GET /api/progress` returns complete shape
- [ ] Unit test: `updatePassageProgress()` recalculates correctness on retake
- [ ] Integration test: full progress workflow (answer → sync → verify → retake → resync)
- [ ] Verify `UserProgress` interface in `lib/types.ts` matches saved/retrieved shape

---

## Non-Goals

- Do not refactor progress storage layer (use existing DB/storage)
- Do not change the `UserProgress` data structure
- Do not modify scoring algorithm (only fix the retake logic)

---

## Success Criteria

- [ ] `POST /api/progress` saves `passageProgress`, `writingProgress`, and `speakingProgress`
- [ ] `GET /api/progress` returns all three modules
- [ ] Writing and speaking progress no longer drops on sync
- [ ] `updatePassageProgress()` recalculates correctness when user re-answers a question
- [ ] Retake scores reflect correct answers (wrong → right now shows improvement)
- [ ] `syncToCloud()` properly awaits fetch and returns success/failure
- [ ] Callers receive sync status and can show user feedback
- [ ] Network errors are caught and reported to user
- [ ] No data loss on app refresh or cloud sync

---

## Content & File Changes

### Files to Modify

| File | Change Type | Details |
|------|------------|---------|
| `app/api/progress/route.ts` | Fix POST/GET handlers | Save and retrieve all three progress modules |
| `lib/progress.ts` | Fix scoring logic | Update `updatePassageProgress()` to recalculate on retakes |
| `hooks/useProgress.ts` | Fix async/await | Await `syncToCloud()` fetch, add error handling |
| `lib/types.ts` | Verify | Confirm `UserProgress` interface matches saved shape |

### No New Files Required
All fixes are inline code changes within existing files.

---

## Data & State

### UserProgress Structure (Expected)
```typescript
{
  passageProgress: {
    [passageId: string]: {
      attempts: number
      correctness: boolean
      timestamp: number
      answers?: Record<string, any>
    }
  }
  writingProgress: {
    // Writing module data
  }
  speakingProgress: {
    // Speaking module data
  }
}
```

### Bug: Current POST Handler
Currently only saves `passageProgress`; `writingProgress` and `speakingProgress` are dropped.

### Bug: Retake Scoring
When `updatePassageProgress()` is called with a re-answer:
- Current: doesn't update `correctness` field
- Expected: should set `correctness` to true if new answer is correct

### Bug: Sync Callback
Current: `async syncToCloud()` doesn't await fetch, returns undefined
Expected: properly await, catch errors, return boolean or error object

---

## UI Notes

- When sync fails, show toast notification: "Progress sync failed. Please try again."
- When sync succeeds, optionally show brief feedback or silent success
- On retake, show updated score immediately after submit
- If writing/speaking progress drops, user should see all modules restore after fix

---

## Open Questions

- [ ] Should sync retry automatically on failure, or only on user action?
- [ ] Should UI show sync status indicator (syncing/synced/error)?
- [ ] Are there other places that call `updatePassageProgress()` that need updates?
- [ ] Should we add a timestamp to track last successful sync?

---

## CC Handoff

**To:** Code Completion / Developer
**Prompt:**

```
Fix three critical progress tracking bugs in the inburgering exam app.

ISSUE 1: Cloud Sync Data Loss
- File: app/api/progress/route.ts (line 29)
- Bug: POST /api/progress only saves passageProgress, drops writingProgress and speakingProgress
- Fix:
  1. Parse request body to extract all three modules
  2. Save all three to database/storage
  3. Verify GET handler reconstructs complete UserProgress with all modules
- Test: Save progress with all modules → retrieve → verify nothing is dropped

ISSUE 2: Retake Scoring Not Updating
- File: lib/progress.ts (lines 66-68)
- Bug: updatePassageProgress() doesn't update correctness on retakes
- Scenario: User answers wrong (correctness=false) → retakes → answers right → correctness should be true but stays false
- Fix:
  1. Check if question was answered before (attempt history)
  2. If new answer is correct, update correctness to true
  3. Recalculate passage-level scores
- Test: Question wrong → retake correct → verify correctness flips to true

ISSUE 3: Broken Sync Callback
- File: hooks/useProgress.ts
- Bug: syncToCloud() is async but doesn't await fetch; caller can't detect sync status
- Fix:
  1. Properly await the fetch call
  2. Parse response status
  3. Return success/failure indicator
  4. Add error handling for network/server failures
  5. Update callers to check return value
  6. Show user feedback on sync error (toast: "Progress sync failed")
- Test: Trigger sync → verify await works → verify errors are caught and reported

KEY FILES:
- app/api/progress/route.ts — POST handler (incomplete save), GET handler
- lib/progress.ts — updatePassageProgress() scoring logic
- hooks/useProgress.ts — syncToCloud() callback
- lib/types.ts — UserProgress interface (verify shape)

NON-GOALS:
- Don't refactor storage layer
- Don't change UserProgress data structure
- Don't modify overall scoring algorithm

SUCCESS CRITERIA:
- All three progress modules save to cloud
- Retake scores update correctly (wrong → right shows improvement)
- syncToCloud() awaits properly and returns sync status
- Callers receive sync result and show user feedback
- No data loss on refresh or sync
```

