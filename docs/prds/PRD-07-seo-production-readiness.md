# PRD-07: SEO & Production Readiness

**Status:** Draft
**Effort:** S (Small)
**Branch:** feature/seo-production-readiness
**Date:** 2026-02-10

---

## Problem & Goal

The inburgering exam prep app has multiple SEO and production readiness issues that undermine its visibility to search engines and reduce the quality of social sharing. Critical assets are missing, metadata is misconfigured, and approximately 50% of exercise content is not indexed in the sitemap.

**Goal:** Ensure the app is fully indexed, properly configured for search engines and social platforms, and ready for production deployment.

---

## Success Criteria

1. **Sitemap completeness:** All 13 missing exercises/tasks added to `app/sitemap.ts`. Verify luisteren, schrijven, and spreken exercises are present.
2. **Social sharing:** OG image (`/og-image.png`) created and deployed. OpenGraph tags properly render on social platforms.
3. **Language tag:** `html lang` attribute corrected to `lang="nl"` in `app/layout.tsx` to match Dutch content.
4. **Favicon:** High-DPI favicon assets created (192x192 and 512x512 PNG files with proper resolution).
5. **Analytics & structured data:** GoogleAnalytics component verified as properly configured. JSON-LD structured data validated against page content using schema.org validator.
6. **Production checklist:** All lighthouse SEO scores ≥ 95. No broken meta tags. No missing manifest entries.

---

## Content & File Changes

| File | Change | Notes |
|------|--------|-------|
| `app/sitemap.ts` | Add 13 missing routes | 5 luisteren, 4 schrijven, 4 spreken exercises |
| `app/layout.tsx` (line 79) | Remove `lang="en"` hardcoded; set `lang="nl"` | App serves Dutch learning content |
| `public/og-image.png` | Create new file | 1200x630px recommended. Social sharing asset. |
| `app/manifest.ts` | Update favicon sizes | Reference separate 192x192 and 512x512 PNG files |
| `public/favicon-192.png` | Create new file | High-DPI version for mobile |
| `public/favicon-512.png` | Create new file | High-DPI version for high-res devices |
| `components/GoogleAnalytics.tsx` | Verify configuration | Confirm GA4 ID and event tracking enabled |
| `components/JsonLd.tsx` | Validate schema | Test against schema.org validator; ensure `@context` and type properties match page content |

---

## CC Handoff

**Prompt for next contributor:**

```
PRD-07 involves fixing SEO and production readiness issues in the inburgering exam prep app.

REQUIREMENTS:
1. Add 13 missing exercise/task routes to app/sitemap.ts:
   - Luisteren: in-de-supermarkt, in-de-trein, bij-het-uitzendbureau, een-afspraak-maken, op-school
   - Schrijven: complaint-webshop, form-gp-registration, message-teacher-absence, note-neighbor
   - Spreken: part1-daily-routine, part2-market, part3-transport, part4-kitchen
2. Change lang="en" to lang="nl" in app/layout.tsx line 79.
3. Create OG image (1200x630px PNG) and place at public/og-image.png for social sharing.
4. Create high-DPI favicon assets: public/favicon-192.png and public/favicon-512.png.
5. Update app/manifest.ts to reference the new favicon sizes.
6. Verify GoogleAnalytics.tsx is properly configured with GA4.
7. Validate JSON-LD in components/JsonLd.tsx against schema.org.

KEY FILES:
- app/sitemap.ts
- app/layout.tsx
- app/manifest.ts
- public/ (og-image.png, favicon-192.png, favicon-512.png)
- components/GoogleAnalytics.tsx
- components/JsonLd.tsx

NON-GOALS:
- Content writing or restructuring
- Paid search or ad campaign setup
- Analytics dashboard customization

SUCCESS CRITERIA:
- Sitemap includes all 13 exercises
- Social sharing works (OG tags render correctly)
- Language tag is nl for Dutch content
- Favicon renders sharp on all devices
- Lighthouse SEO score ≥ 95
- All manifest entries are valid
```

---

## Open Questions

- Should JSON-LD schema include pricing information or certification details?
- Is Google Search Console already linked to the GA4 property?
