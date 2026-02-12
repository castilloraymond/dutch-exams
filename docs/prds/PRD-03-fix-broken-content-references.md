# PRD-03: Fix Broken Content References & Navigation

**Date:** 2026-02-10
**Status:** Draft
**Branch:** feature/fix-broken-content-references
**Effort:** M

---

## Problem & Goal

The inburgering exam prep app has critical data integrity and routing issues that prevent users from accessing content and authentication flows:

1. **Mismatched passage IDs** – Passage files have incorrect internal IDs that don't match their filenames
2. **Missing content references** – 5 passages in `content/index.json` don't exist as files
3. **Broken question mappings** – Quick assessment references question IDs from non-existent passages
4. **Auth routing broken** – Login/Signup links point to wrong routes (404s)

**Goal:** Fix all content references, ID mappings, and navigation routes to ensure users can access passages, complete quick assessments, and authenticate successfully.

---

## User Story

As a student preparing for the inburgering exam,
I want to access all reading passages and complete the quick assessment,
So that I can track my progress and prepare effectively.

As an unauthenticated user,
I want to click login/signup links and reach the auth pages,
So that I can create an account or sign in.

---

## Requirements

### Content ID & File Mapping
- [ ] Audit all 10 passage files and ensure `id` field in JSON matches the file purpose/name
- [ ] Update `content/index.json` to reference only existing passage files
- [ ] Remove or create missing passages referenced in `index.json`:
  - `tips-q1`, `huis-q1`, `brief-q2` (and any others) must map to actual passage files
- [ ] Validate all passage IDs in `lib/content.ts` imports match actual file IDs

### Quick Assessment References
- [ ] Verify all question IDs in `content/quick-assessment/lezen.json` exist in their referenced passages
- [ ] Update question ID mappings if passages were renamed/reorganized
- [ ] Test quick assessment questions load correct passage content

### Auth Route Fixes
- [ ] Find all components/pages linking to `/login` and update to `/auth/login`
- [ ] Find all components/pages linking to `/signup` and update to `/auth/signup`
- [ ] Verify login/signup routes exist and return 200 (not 404)

### Testing
- [ ] All 10 passages load without errors
- [ ] Quick assessment loads and questions reference valid passages
- [ ] Login and signup pages are accessible
- [ ] Content module hydrates correctly on app startup

---

## Non-Goals

- Do not refactor passage content structure (stay with current JSON format)
- Do not add new passages (only fix references to existing ones)
- Do not modify authentication logic, only routing

---

## Success Criteria

- [ ] `content/index.json` references only existing passage files
- [ ] All passage file IDs match their semantic purpose or filename
- [ ] `lib/content.ts` imports and maps all passages without errors
- [ ] `content/quick-assessment/lezen.json` references only valid question IDs from existing passages
- [ ] `/login` redirects or resolves to `/auth/login`
- [ ] `/signup` redirects or resolves to `/auth/signup`
- [ ] App hydrates without content-related errors
- [ ] Quick assessment renders without missing passage warnings

---

## Content & File Changes

### Files to Audit/Modify

| File | Change Type | Notes |
|------|------------|-------|
| `content/index.json` | Verify/Update | Remove references to missing passages, ensure IDs match |
| `content/passages/bij-de-dokter.json` | Update ID | Correct ID from `advertentie-cursus-nederlands` |
| `content/passages/de-buurt.json` | Update ID | Verify or correct internal ID |
| `content/passages/de-supermarkt.json` | Update ID | Verify or correct internal ID |
| `content/passages/een-brief.json` | Update ID | Verify or correct internal ID |
| `content/passages/informatie-bibliotheek.json` | Update ID | Verify or correct internal ID |
| `content/passages/nieuwsbrief-school.json` | Verify | Check ID consistency |
| `content/passages/op-het-station.json` | Verify | Check ID consistency |
| `content/passages/openingstijden-winkelcentrum.json` | Verify | Check ID consistency |
| `content/passages/rooster-taallessen.json` | Verify | Check ID consistency |
| `content/passages/uitnodiging-verjaardagsfeest.json` | Verify | Check ID consistency |
| `content/quick-assessment/lezen.json` | Update/Verify | Ensure all question IDs map to valid passages |
| `lib/content.ts` | Update | Fix passage imports and ID mappings |
| Auth links (components/pages) | Update | Replace `/login` with `/auth/login`, `/signup` with `/auth/signup` |

---

## Open Questions

- [ ] Should passage IDs be semantic (e.g., `bij-de-dokter`) or match filenames exactly?
- [ ] For missing passages in `index.json`, should we create stub files or remove references?
- [ ] Are there other routes besides `/login` and `/signup` that need auth route corrections?
- [ ] Should `lib/content.ts` validate ID matches at runtime or just on build?

---

## CC Handoff

**To:** Code Completion / Developer
**Prompt:**

```
Fix broken content references and navigation in the inburgering exam app.

REQUIREMENTS:
1. Audit all 10 passage files (content/passages/*.json):
   - Ensure each file's internal 'id' field matches its semantic purpose
   - Current issue: bij-de-dokter.json has id 'advertentie-cursus-nederlands' (wrong)
   - Fix 5 passages with mismatched IDs

2. Fix content/index.json:
   - Remove references to 5 non-existent passages
   - Verify remaining references map to actual files
   - Ensure all IDs match passage file IDs

3. Fix quick assessment (content/quick-assessment/lezen.json):
   - Audit all question IDs (tips-q1, huis-q1, brief-q2, etc.)
   - Ensure they reference existing passages
   - Update mappings if passages were renamed

4. Fix auth routes:
   - Find all /login links → update to /auth/login
   - Find all /signup links → update to /auth/signup
   - Verify routes exist and return 200

5. Update lib/content.ts:
   - Fix passage imports
   - Validate ID mappings
   - Test content hydration

KEY FILES:
- content/index.json
- content/passages/*.json (10 files)
- content/quick-assessment/lezen.json
- lib/content.ts
- Any component/page with auth links

NON-GOALS:
- Don't refactor passage JSON structure
- Don't add new passages
- Don't modify auth logic

SUCCESS CRITERIA:
- All passages load without errors
- Quick assessment references valid questions
- Login/signup pages accessible at /auth/login, /auth/signup
- App hydrates without content errors
- No missing passage warnings
```

