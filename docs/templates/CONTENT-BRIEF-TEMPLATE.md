# Content Brief Template

Use this template for blog posts, email campaigns, and content series. Copy the relevant section, fill in the blanks, and hand off to the [playbook system prompt](../marketing/passinburgering-playbook.md) for generation. Apply the [Writing Style Guide](../marketing/WRITING-STYLE-GUIDE.md) to all output.

---

## Mode A: Single Post Brief

Copy this section for each blog post or standalone piece.

```markdown
# Content Brief: CB-[NN]

## Meta

| Field            | Value                          |
|------------------|--------------------------------|
| Brief ID         | CB-[NN]                        |
| Status           | Draft / Ready / In Progress / Published |
| Target publish   | YYYY-MM-DD                     |
| Playbook mode    | BLOG / UPDATE / EMAIL          |
| Author           | PassInBurgering                |

## SEO Target

| Field              | Value                                    |
|--------------------|------------------------------------------|
| Primary keyword    | [exact keyword phrase]                   |
| Search intent      | Informational / Transactional / Navigational |
| Competition        | Low / Medium / High                      |
| Secondary keywords | [keyword 2], [keyword 3], [keyword 4]   |
| Word count target  | [1,500–2,500 standard / 3,000+ pillar / 800–1,200 news / 1,000–1,500 FAQ] |

## Content Angle

What makes this post different from the top 3 results for this keyword? How does it serve the kennismigrant audience specifically?

> [1–3 sentences describing the unique angle and why a busy professional would click]

## Outline

Write H2-level sections. Use question-based headers where possible (4–7 sections).

1. **H2: [Section title]** — [1-sentence description of what this covers]
2. **H2: [Section title]** — [1-sentence description]
3. **H2: [Section title]** — [1-sentence description]
4. **H2: [Section title]** — [1-sentence description]
5. **H2: FAQ — [Topic] Questions Answered** — [3–5 FAQ items for schema]

## Internal Links

| Link to                              | Anchor text idea          | Direction    |
|--------------------------------------|---------------------------|--------------|
| /learn/knm                           | [relevant anchor]         | From this post |
| /blog/[existing-post-slug]           | [relevant anchor]         | From this post |
| [New post should link FROM these →]  | [anchor]                  | To this post |

## CTA Strategy

| Field         | Value                                                    |
|---------------|----------------------------------------------------------|
| Primary CTA   | [What action? e.g., "Try a KNM practice set"]           |
| Placement     | [After which H2 section? + end of post]                  |
| Link target   | [e.g., /learn/knm, /learn, /]                            |
| Framing       | [Efficiency gain, not freebie. 1 sentence.]              |

## Frontmatter (pre-filled)

Paste this into the markdown file. Matches `BlogPostMeta` in `lib/blog.ts`.

---
title: "[55–60 chars. Primary keyword near front. Year if relevant.]"
slug: "[url-slug-with-dashes]"
description: "[150–155 chars. Primary keyword + value prop.]"
date: "YYYY-MM-DD"
author: "PassInBurgering"
keywords: ["primary keyword", "secondary keyword", "long-tail variant"]
---

## CC Session Prompt

Copy-paste this into Claude to generate the post via the playbook system prompt:

> BLOG: [Topic description — include primary keyword, target audience angle, and any specific points to cover from the outline above]
```

---

## Mode B: Campaign Brief

Use this for multi-piece content campaigns (e.g., a 4-post SEO cluster, a launch sequence, a seasonal push).

```markdown
# Campaign Brief: CAMP-[NN]

## Campaign Meta

| Field       | Value                                    |
|-------------|------------------------------------------|
| Campaign ID | CAMP-[NN]                                |
| Theme       | [Campaign theme, e.g., "KNM 2025 Format Changes"] |
| Duration    | [Start date] — [End date]                |
| Goal        | [Specific outcome, e.g., "Rank top 3 for 'KNM exam 2026'"] |
| Status      | Planning / In Progress / Complete        |

## Content Pieces

| #  | Type     | Title / Topic                     | Primary Keyword         | Status  | Brief ID |
|----|----------|-----------------------------------|-------------------------|---------|----------|
| 1  | Pillar   | [Comprehensive guide topic]       | [keyword]               | Draft   | CB-[NN]  |
| 2  | Standard | [Supporting topic]                | [keyword]               | -       | CB-[NN]  |
| 3  | Standard | [Supporting topic]                | [keyword]               | -       | CB-[NN]  |
| 4  | FAQ      | [Question cluster topic]          | [keyword]               | -       | CB-[NN]  |
| 5  | Social   | [Distribution post]               | -                       | -       | -        |

## Internal Linking Strategy

**Pillar page:** Piece #[N] — the comprehensive post that other pieces link to.

**Cluster model:**
- Piece #[N] links to → Pillar
- Piece #[N] links to → Pillar + Piece #[N]
- Pillar links to → all supporting pieces

**Existing posts to connect:**
- /blog/[slug] — add link to Piece #[N]
- /blog/[slug] — add link to Pillar

## Distribution Plan

| Channel       | Piece(s)       | Playbook Mode  | Timing              |
|---------------|----------------|----------------|---------------------|
| Blog          | #1, #2, #3, #4 | BLOG / UPDATE  | [Publish cadence]   |
| Reddit        | #1, #3         | REDDIT         | 1 week after publish |
| LinkedIn      | #1             | SOCIAL         | Same day as publish  |
| Instagram     | #2, #4         | SOCIAL         | 2 days after publish |
| Email         | #1             | EMAIL          | [If applicable]      |

## Success Metrics

| Metric                          | Target         | Measured at    |
|---------------------------------|----------------|----------------|
| Organic impressions (30 days)   | [number]       | Search Console |
| Avg. position for primary KW    | Top [N]        | Search Console |
| Blog pageviews (30 days)        | [number]       | GA4            |
| Internal link clicks            | [number]       | GA4            |
| [Custom metric]                 | [target]       | [source]       |
```

---

## Quick Reference

### Brief ID Format
- Single posts: `CB-01`, `CB-02`, etc.
- Campaigns: `CAMP-01`, `CAMP-02`, etc.

### Playbook Modes Available
`BLOG` · `REDDIT` · `FORUM` · `SOCIAL` · `KEYWORDS` · `UPDATE` · `EMAIL`

See [playbook system prompt](../marketing/passinburgering-playbook.md) for mode details.

### Quality Checklist

Before publishing any content generated from a brief:

- [ ] Ran through all 3 humanizer filters ([Writing Style Guide](../marketing/WRITING-STYLE-GUIDE.md))
- [ ] Checked banned words list — no AI slop
- [ ] Verified all exam facts (costs, scores, dates, format details)
- [ ] Frontmatter matches `BlogPostMeta` format exactly
- [ ] SEO checklist passed (see style guide)
- [ ] Internal links added in both directions
- [ ] CTA is natural, framed as efficiency gain
