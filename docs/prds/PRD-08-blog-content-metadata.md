# PRD-08: Blog Content & Metadata Fixes

**Status:** Draft
**Effort:** M (Medium)
**Branch:** feature/blog-content-metadata-fixes
**Date:** 2026-02-10

---

## Problem & Goal

All three blog posts are publicly accessible stubs with placeholder text ("Detailed content coming soon..."), creating a poor user experience and damaging credibility. Additionally, metadata is inconsistent across blog files, with date misalignments and conflicting version references that confuse readers and harm SEO.

**Goal:** Complete blog post content with high-quality, original material aligned with the inburgering exam audience, and standardize all metadata to ensure consistency, accuracy, and SEO effectiveness.

---

## User Story

As a prospective inburgering exam candidate, I want to read comprehensive, credible blog guides that help me understand exam requirements and preparation strategies, so I can make informed decisions about my preparation and feel confident in the app's expertise.

---

## Requirements

### Content Requirements
1. **Complete three blog posts** with detailed, original content (minimum 800 words each):
   - `content/blog/inburgering-exam-guide-professionals-2026.md` — Comprehensive guide for professionals preparing for the inburgering exam with focus on workplace communication, cultural integration, and exam format.
   - `content/blog/inburgering-kennismigranten-30-percent-ruling.md` — Detailed guide for highly skilled migrants (kennismigranten) leveraging the 30% ruling and inburgering requirements.
   - `content/blog/knm-exam-2026-new-format.md` — Guide covering the 2026 KNM exam format changes, schedule, and preparation strategies.

2. **Content quality standards:**
   - Original, well-researched material (no AI-generated filler)
   - Include practical tips, timeline information, and resource links
   - Optimize for target keywords: "inburgering exam 2026," "KNM exam," "30% ruling," "Dutch integration," "inburgering preparation"
   - Include real examples and case scenarios where appropriate
   - Add internal links to relevant exercises in the app

3. **Metadata standardization:**
   - **Title:** Clear, keyword-rich (50-60 characters ideal)
   - **Description:** Concise summary (150-160 characters). Match slug intent.
   - **Date:** Use ISO 8601 format (YYYY-MM-DD). Set to publication date or latest update.
   - **Author:** Consistent author field across all posts
   - **Tags:** Use consistent, controlled vocabulary (max 5 tags per post)
   - **Slug:** Lowercase, hyphenated, matches title intent

### Metadata Fix Requirements
1. **Fix `knm-exam-2026-new-format.md`:**
   - Update title from "2025" reference to "2026 New Format"
   - Update description to reference "2026" and remove "July 2025" mention
   - Verify date field is "2026-02-10"
   - Ensure slug remains "knm-exam-2026-new-format"

2. **Audit all three blog files:**
   - Verify date consistency (all should reflect 2026-02-10 or publication date)
   - Confirm slug-to-title alignment
   - Validate frontmatter YAML structure
   - Check for missing or malformed metadata fields

3. **Blog listing & routing:**
   - Verify `app/blog/page.tsx` displays all three posts with updated metadata
   - Test `app/blog/[slug]/page.tsx` renders correct content for each slug
   - Confirm `lib/blog.ts` correctly parses metadata and content

---

## Non-Goals

- Redesigning the blog layout or UI components
- Creating an editorial calendar or scheduling system
- Implementing blog comments or user engagement features
- Migrating blog content to a headless CMS (out of scope for this PRD)
- Implementing multi-language blog support (Dutch only for now)

---

## Success Criteria

1. **Content completion:** All three blog posts contain minimum 800 words of original, high-quality content with no placeholder text.
2. **Metadata consistency:** All frontmatter fields match template structure. Dates, descriptions, and titles are aligned with slug and content.
3. **SEO validation:** Blog posts render correctly with OpenGraph tags, JSON-LD schema, and meta descriptions visible in page source.
4. **Rendering verification:** All three blog posts render without errors on production. Links are functional. Internal cross-links work.
5. **Lighthouse audit:** Blog listing page and individual blog post pages achieve SEO score ≥ 95 and readability ≥ 85.
6. **Frontmatter structure:** All three files follow consistent YAML frontmatter format per `lib/blog.ts` parsing logic.

---

## Content & File Changes

| File | Change | Notes |
|------|--------|-------|
| `content/blog/inburgering-exam-guide-professionals-2026.md` | Complete with full content | 800+ words, professional audience focus |
| `content/blog/inburgering-kennismigranten-30-percent-ruling.md` | Complete with full content | 800+ words, kennismigranten + 30% ruling focus |
| `content/blog/knm-exam-2026-new-format.md` | Complete with full content; fix metadata | Title/date/description updated to 2026; 800+ words |
| `app/blog/page.tsx` | Verify rendering logic | Confirm metadata displays correctly in listing |
| `app/blog/[slug]/page.tsx` | Verify routing logic | Confirm individual posts render without errors |
| `lib/blog.ts` | Verify parsing logic | Ensure metadata extraction matches frontmatter structure |

---

## Open Questions

1. Should blog posts include video embeds or is text + images sufficient?
2. Are there existing brand guidelines or tone of voice standards for blog content?
3. Should blog posts link to external resources (e.g., official gov.nl pages) or remain self-contained?
4. Is there a preferred blog posting cadence or content calendar for future posts?
5. Should blog posts include reader engagement calls-to-action (CTAs) directing to specific exercises?

---

## CC Handoff

**Prompt for next contributor:**

```
PRD-08 involves completing blog content and fixing metadata inconsistencies in the inburgering exam prep app.

REQUIREMENTS:

CONTENT:
1. Complete three blog posts with 800+ words of original, high-quality content:
   - inburgering-exam-guide-professionals-2026.md (professionals, workplace communication focus)
   - inburgering-kennismigranten-30-percent-ruling.md (highly skilled migrants, 30% ruling)
   - knm-exam-2026-new-format.md (2026 KNM exam format and changes)
2. Include practical tips, timelines, examples, and internal app links.
3. Optimize for keywords: "inburgering exam 2026," "KNM exam," "30% ruling," "Dutch integration"

METADATA FIXES:
1. Fix knm-exam-2026-new-format.md:
   - Update title to reference 2026, not 2025
   - Update description to remove "July 2025"
   - Verify date is 2026-02-10
2. Standardize all blog frontmatter:
   - Titles: 50-60 characters, keyword-rich
   - Descriptions: 150-160 characters, match slug
   - Dates: ISO 8601 format
   - Slugs: lowercase, hyphenated, title-aligned
   - Tags: controlled vocabulary, max 5 per post
3. Verify app/blog/page.tsx and app/blog/[slug]/page.tsx render correctly
4. Test lib/blog.ts metadata parsing

KEY FILES:
- content/blog/inburgering-exam-guide-professionals-2026.md
- content/blog/inburgering-kennismigranten-30-percent-ruling.md
- content/blog/knm-exam-2026-new-format.md
- app/blog/page.tsx
- app/blog/[slug]/page.tsx
- lib/blog.ts

NON-GOALS:
- UI/layout redesign
- Editorial calendar or scheduling
- Comments or engagement features
- CMS migration
- Multi-language support

SUCCESS CRITERIA:
- All blog posts contain 800+ words with no placeholder text
- All metadata is consistent, accurate, and aligned
- Blog posts render without errors
- All OpenGraph and JSON-LD tags are present and valid
- Lighthouse SEO ≥ 95, readability ≥ 85
- Frontmatter follows consistent YAML structure
```
