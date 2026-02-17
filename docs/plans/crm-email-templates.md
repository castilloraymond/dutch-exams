# CRM Onboarding Drip Campaign — Email Templates

Templates for the 4-email onboarding sequence in Loops. Follow the [Writing Style Guide](../marketing/WRITING-STYLE-GUIDE.md) — voice is "senior colleague who already passed the exam."

**From:** PassInBurgering <hello@passinburgering.com>

---

## Email 1 — Day 0: Welcome + Quick Assessment

**Subject:** Your inburgering prep starts now
**Preview text:** Find out where you stand in 2 minutes

**Body:**

Hey {{firstName}},

You just took the first real step toward passing the inburgering exam. Most people put it off for months — you didn't. That already puts you ahead.

Here's the fastest way to figure out where you stand:

**[Take the 2-Minute Quick Assessment]({{siteUrl}}/try)**

It covers KNM, reading, and listening — the three exam components that trip people up the most. You'll see exactly which areas need work and which ones you can spend less time on.

No studying required. Just answer honestly and let the results guide your prep.

Talk soon,
PassInBurgering

P.S. The exams were redesigned in 2025. If you're using old study materials, you're preparing for the wrong test. The Quick Assessment uses the current format.

---

## Email 2 — Day 1: First Practice Session

**Subject:** Here's where to start

### Variant A: Quick assessment completed

**Preview text:** Your results say {{weakestModule}} needs the most work

**Body:**

Hey {{firstName}},

You finished the Quick Assessment — nice. Based on your results, **{{weakestModule}}** is where you scored lowest. That's actually useful info. Most people waste weeks studying what they already know.

Here's your move: do one practice set in {{weakestModule}} today.

**[Start a {{weakestModule}} Practice Set]({{siteUrl}}/learn/{{weakestModule}}/select)**

It takes about 15 minutes. You'll get explanations for every answer — both the ones you got right and the ones you didn't. That's where the real learning happens.

One set a day is enough to build real momentum. You don't need marathon study sessions.

Talk soon,
PassInBurgering

### Variant B: Quick assessment not completed

**Preview text:** Most people start with KNM — here's why

**Body:**

Hey {{firstName}},

Quick tip: most people who pass the inburgering exam start their prep with KNM (Kennis van de Nederlandse Maatschappij). Here's why — it's the section with the most content to cover, but the questions follow predictable patterns once you've seen enough of them.

**[Try a KNM Practice Set]({{siteUrl}}/learn/knm/select)**

15 minutes. You'll get instant feedback on every question with explanations in both Dutch and English.

Not sure where you stand overall? The Quick Assessment takes 2 minutes and tells you which exam sections need the most work.

**[Take the Quick Assessment]({{siteUrl}}/try)**

Talk soon,
PassInBurgering

---

## Email 3 — Day 3: Educational Value

**Subject:** 3 things most people get wrong about the inburgering exam
**Preview text:** Number 2 catches almost everyone off guard

**Body:**

Hey {{firstName}},

After seeing hundreds of practice results, these are the three mistakes that come up over and over:

**1. Studying with pre-2025 materials**
The KNM exam was completely redesigned in July 2025. The reading and listening exams got format changes too. Old practice questions don't match what you'll actually see on test day.

**2. Skipping the speaking exam prep**
The speaking exam dropped multiple choice entirely in March 2025. Every answer is now spoken and recorded. If you haven't practiced out loud, the real exam will feel completely different from what you expected.

**3. Not doing full mock exams**
Individual questions are good for learning. But the real exam has time pressure, and questions are grouped into sets. Mock exams train you for that specific format.

**[Try a Full Mock Exam]({{siteUrl}}/learn/lezen/select)**

We have mock exams for KNM, reading, and listening — all built around the current exam format.

Talk soon,
PassInBurgering

---

## Email 4 — Day 7: Week One Check-In

**Subject:** Your first week check-in

### Variant A: Active (1+ exercises completed)

**Preview text:** You've completed {{exercisesCompleted}} exercises — here's what's next

**Body:**

Hey {{firstName}},

One week in and you've already completed **{{exercisesCompleted}}** exercises. That's more than most people do in their first month of prep.

Here's how to keep the momentum going:

- **Mix it up.** Don't just do KNM or just do reading. Alternate between modules to keep things fresh.
- **Try a mock exam.** If you haven't done one yet, a full mock gives you the closest experience to the real test. Time pressure included.
- **20 minutes a day.** That's genuinely enough. Consistency beats long study sessions every time.

**[Continue Practicing]({{siteUrl}}/learn)**

You're on track. Keep going.

PassInBurgering

### Variant B: Inactive (0 exercises completed)

**Preview text:** 5 minutes is all it takes to get started

**Body:**

Hey {{firstName}},

Getting started is the hardest part. The inburgering exam can feel overwhelming — there's KNM, reading, listening, writing, and speaking. That's a lot.

But here's the thing: you don't need to tackle all of it at once. Start with one question set. Seriously — just one. It takes about 5 minutes.

**[Start Your First Practice Set]({{siteUrl}}/learn/knm/select)**

KNM is a solid starting point. The questions are in Dutch, but you can read the explanations in English. You'll pick up patterns fast.

5 minutes today beats a perfect study plan you never start.

PassInBurgering

---

## Implementation Notes for Loops

### Contact Properties (create in Loops dashboard)

| Property | Type | Description |
|----------|------|-------------|
| `firstName` | string | First name from Supabase user metadata |
| `signupDate` | date | ISO date string of account creation |
| `quickAssessmentCompleted` | boolean | Whether user finished quick assessment |
| `weakestModule` | string | Module with lowest quick assessment score |
| `exercisesCompleted` | number | Total exercises/exams completed |

### Loop Configuration

1. **Trigger:** `user_signed_up` event
2. **Email 1 (Day 0):** Send immediately on trigger
3. **Email 2 (Day 1):** Send 24h after trigger
   - Audience filter: `quickAssessmentCompleted = true` → Variant A
   - Audience filter: `quickAssessmentCompleted = false` → Variant B
4. **Email 3 (Day 3):** Send 72h after trigger
5. **Email 4 (Day 7):** Send 168h after trigger
   - Audience filter: `exercisesCompleted >= 1` → Variant A
   - Audience filter: `exercisesCompleted = 0` → Variant B

### Template Variables

Use `{{firstName}}`, `{{weakestModule}}`, `{{exercisesCompleted}}` as Loops merge tags. Set `{{siteUrl}}` as a constant in Loops (e.g., `https://passinburgering.com`).
