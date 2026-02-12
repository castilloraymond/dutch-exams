# Redesign & Migration Brief: passinburgering.com

## Context

I'm redesigning passinburgering.com — a Dutch inburgering exam prep platform for expats. I have a new landing page design mockup (attached as `passinburgering-landing-page.html`) that establishes the new visual direction. This is a **full site migration** — the new design system should be applied across the entire site, not just the landing page.

## Design Direction

The mockup establishes:
- **Font**: Plus Jakarta Sans (single font, weights 400–800)
- **Color palette**: Warm cream background (#FDFBF7), dark ink (#1a1a2e), orange accent (#E8632B), green for success (#2D8F5E), blue for info (#3B6BCC)
- **Style**: Clean, modern, generous whitespace, pill-shaped buttons, soft border-radius (16px cards, 100px buttons), subtle shadows, scroll-reveal animations
- **Tone**: Premium but approachable — targeting high-income expat professionals
- **Layout patterns**: Single-column hero with product mockup, card-based feature grids, trust stats bar, testimonial cards, single pricing card

## Your Task

Migrate the existing site to match this new design system. But **before you write any code**, I need you to ask me detailed questions to ensure a proper migration. Specifically, ask me about:

### 1. Codebase & Stack
- What framework/stack is the current site built with? (Next.js, plain HTML, Astro, etc.)
- What's the CSS approach? (Tailwind, CSS modules, styled-components, plain CSS, etc.)
- Is there a component library in use?
- What's the folder structure?
- Is there a deployment pipeline I should be aware of?

### 2. Existing Pages & Routes
- What pages/routes currently exist beyond the landing page?
- Are there authenticated/logged-in pages (dashboard, practice tests, settings)?
- Which pages are public vs. behind auth?
- Are there any pages I should NOT touch?

### 3. Design System Migration Scope
- Should I create a shared design system (CSS variables, component library) that all pages inherit from?
- Are there existing UI components (buttons, cards, modals, forms) that need restyling?
- Should I preserve any existing design elements or is this a clean slate?
- How should I handle the responsive breakpoints — match the mockup's approach or keep existing ones?

### 4. Content & Copy
- Should I use the exact copy from the mockup or is the current site's copy preferred for certain sections?
- Are the stats in the mockup real (2,400+ expats, 94% pass rate) or placeholders I should flag?
- Are the testimonials real or placeholder?
- What's the actual pricing?

### 5. Functionality & Interactions
- Are there existing interactive elements (quiz components, progress trackers, forms) that need to keep working?
- Is there a free practice test flow that the CTA buttons should link to?
- Are there any third-party integrations (analytics, payment, auth) I need to preserve?
- Should the scroll-reveal animations from the mockup be implemented, and if so, should I use CSS-only or a library like Framer Motion / GSAP?

### 6. Assets & Media
- Are there existing images, icons, or illustrations to keep?
- The mockup uses Font Awesome — should I stick with that or switch to something else (Lucide, Heroicons)?
- Is there a logo/brand mark beyond the text logo in the mockup?

### 7. Migration Strategy
- Should I migrate page-by-page or do a big-bang replacement?
- Is there a staging/preview environment I can deploy to for review?
- Should I keep the old design accessible on a branch for rollback?
- What's the priority order? (e.g., landing page first, then dashboard, then practice pages)

### 8. SEO & Performance
- Are there existing meta tags, OG images, or structured data I should preserve?
- Any specific performance targets (Core Web Vitals, lighthouse score)?
- Is there existing analytics tracking (events, goals) that must survive the migration?

## How to Proceed

1. **Ask all questions first** — gather my answers before touching any code
2. **Audit the existing codebase** — read through the current files, understand the structure
3. **Propose a migration plan** — outline the order of changes, what gets created/modified/deleted
4. **Get my approval on the plan** — then execute
5. **Migrate incrementally** — commit after each meaningful chunk so we can review progress
6. **Flag decisions** — whenever you face an ambiguous design or UX choice not covered by the mockup, ask me rather than guessing

## Reference File

The design mockup is: `passinburgering-landing-page.html`
Read it thoroughly — it's the source of truth for the visual direction.
