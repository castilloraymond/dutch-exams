## PRD #1: Passinburgering.com

### Overview

| Field | Value |
|-------|-------|
| **Status** | Live, entering beta |
| **Type** | B2C SaaS |
| **Target Launch** | Paid version Q1 2025 |
| **Build Complexity** | Medium (already built) |
| **Revenue Potential** | €2-5K MRR at scale |

### Problem Statement

Expats in the Netherlands must pass the civic integration exam (inburgering) to obtain permanent residency or citizenship. The exam is computer-based, but most preparation materials are books or generic online courses. There's no realistic simulation of the actual exam experience.

**The pain:**
- High-income expats (30% ruling) risk losing tax benefits if they fail
- Exam format is unfamiliar — computer-based with specific UI
- Stakes are high, anxiety is real
- Existing prep options don't simulate the real experience

### Target User

**Primary:** High-income expats in NL benefiting from 30% ruling
- Age: 28-45
- Income: €70K+
- Origin: Often tech workers, consultants, corporate transfers
- Motivation: Citizenship/permanent residency, protecting tax benefits
- Willingness to pay: High (stakes are high, money isn't the issue)

**Secondary:** All expats required to pass inburgering
- Broader market, more price-sensitive
- Larger volume, lower ARPU

### Core Value Proposition

"Practice the inburgering exam exactly like the real thing — computer-based, timed, with instant feedback."

### MVP Features (Current State)

- [ ] Computer-based practice tests mimicking real exam UI
- [ ] Timed sessions matching actual exam conditions
- [ ] Question bank covering all exam components
- [ ] Progress tracking
- [ ] Instant feedback and explanations

### Features for Paid Version

- [ ] Full question bank (not just samples)
- [ ] Multiple complete practice exams
- [ ] Performance analytics (weak areas, improvement over time)
- [ ] Exam-day simulation mode (full length, timed, no retakes)
- [ ] Mobile-responsive (study on commute)

### Success Metrics

| Metric | Target (90 days) | Target (12 months) |
|--------|------------------|-------------------|
| Beta testers | 20-30 | — |
| Paying customers | 50 | 500 |
| MRR | €500 | €3,000 |
| Conversion rate (trial → paid) | 10% | 15% |
| NPS | 40+ | 50+ |

### Revenue Model Options

**Option A: One-Time Purchase**
- €39-59 for full access
- Pros: Simple, high conversion
- Cons: No recurring revenue, need constant new customers

**Option B: Subscription**
- €12-15/month
- Pros: Recurring revenue, predictable
- Cons: Exam prep is finite (people pass and leave)

**Option C: Tiered**
- Free: 1 practice test
- €29: Full access for 3 months
- €49: Full access for 6 months + guarantee (free extension if you fail)

**Recommendation:** Option C — captures urgency, the "guarantee" reduces purchase anxiety, time-limited creates urgency without subscription fatigue for a finite use case.

### Distribution Strategy

**Owned:**
- SEO content: "inburgering exam tips," "civic integration test practice," etc.
- Email list from free tier users

**Earned:**
- Reddit: r/Netherlands, r/Amsterdam, r/expats
- Facebook groups: Expats in Amsterdam, Internationals in NL, 30% Ruling groups
- Internations forums
- Expat blogs (guest posts, reviews)

**Partnerships:**
- Immigration lawyers (referral fees)
- Relocation companies
- Dutch language schools
- HR departments at international companies

### Key Questions to Answer

1. **Pricing validation:** What's the max people will pay? Survey beta testers. Test €39 vs €59 vs €79.

2. **Exam component focus:** Which parts of the exam do people struggle with most? Double down on those in marketing.

3. **Guarantee mechanics:** If offering a "pass or free extension" guarantee, what's the expected redemption rate? Can you afford it?

4. **Competitive landscape:** Who else is doing this? What's their pricing? Where are they weak?

5. **Content licensing:** Are your questions original? Any IP risk from using official exam materials?

6. **Seasonality:** Is there an exam registration cycle? When do most people prepare?

### Technical Considerations

- **Stack:** Whatever you've built — keep it simple
- **Payments:** Stripe or Lemon Squeezy (handles EU VAT)
- **Auth:** Supabase or Clerk
- **Analytics:** Plausible + Hotjar for user behavior
- **Email:** Resend or Loops for transactional + marketing

### Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Small market | Medium | High | Expand to other expat products (audience compounding) |
| Competitors copy | Medium | Medium | Build brand, community, SEO moat early |
| Exam format changes | Low | High | Monitor official sources, build update process |
| Low conversion | Medium | High | Strong free tier → paid funnel, testimonials |

### 30-Day Action Plan

| Week | Actions |
|------|---------|
| 1 | Complete beta testing, collect 10+ feedback responses |
| 2 | Implement payment system, fix critical bugs |
| 3 | Write 3 SEO articles, post in 5 communities |
| 4 | Launch paid version, email beta users, track conversions |

---
