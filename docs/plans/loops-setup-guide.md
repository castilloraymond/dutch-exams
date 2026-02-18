# Loops Email Setup — Implementation Plan

Step-by-step guide to finish the Loops CRM onboarding drip campaign. The code is already deployed — this covers the manual dashboard configuration.

---

## Phase 1: Account & API Key (5 min)

### Step 1 — Create Loops account
1. Go to [loops.so](https://loops.so) and sign up with your email
2. Confirm your email address
3. During onboarding, you can skip or fill in basics — doesn't matter much

### Step 2 — Get your API key
1. In the Loops dashboard: **Settings → API Keys**
2. Click "Generate" to create a new key
3. Copy the key

### Step 3 — Add the key to your project
1. Open `.env.local` in your project root
2. Add this line:
   ```
   LOOPS_API_KEY=paste_your_key_here
   ```
3. Restart your dev server (`npm run dev`) so it picks up the new env var

---

## Phase 2: Contact Properties (5 min)

### Step 4 — Create 5 custom contact properties

Go to **Audience → Contact Properties** (or Settings → Contact Properties). Create each one:

| # | Property Name | Type | Notes |
|---|--------------|------|-------|
| 1 | `firstName` | String | May already exist as a default |
| 2 | `signupDate` | Date | ISO date string |
| 3 | `quickAssessmentCompleted` | Boolean | Defaults to `false` on signup |
| 4 | `weakestModule` | String | Values: `knm`, `lezen`, `luisteren` |
| 5 | `exercisesCompleted` | Number | Starts at `0`, increments per exercise |

---

## Phase 3: Email Templates (20–30 min)

### Step 5 — Create 6 email templates

Go to **Emails → New Email** for each. Copy the content from `docs/plans/crm-email-templates.md` in your project. Use Loops' drag-and-drop editor or the code editor.

For merge tags, use `{{firstName}}`, `{{weakestModule}}`, `{{exercisesCompleted}}` — Loops will auto-populate these from contact properties.

For links, set a reusable variable or hardcode `https://passinburgering.com` as your base URL.

| # | Internal Name | Subject Line |
|---|--------------|-------------|
| 1 | `Day 0 — Welcome` | Your inburgering prep starts now |
| 2 | `Day 1 — QA Done` | Here's where to start |
| 3 | `Day 1 — No QA` | Here's where to start |
| 4 | `Day 3 — Educational` | 3 things most people get wrong about the inburgering exam |
| 5 | `Day 7 — Active` | Your first week check-in |
| 6 | `Day 7 — Inactive` | Your first week check-in |

**Tip:** Send yourself a test of each email before moving on. Check that merge tags render and links work.

---

## Phase 4: Build the Loop (10 min)

### Step 6 — Create the drip sequence

Go to **Loops → New Loop**.

1. **Trigger:** Set to Event → `user_signed_up`
2. **Email 1 (immediate):** Add action → Send Email → select `Day 0 — Welcome`
3. **Wait 24 hours**
4. **Branch on quick assessment:**
   - Add a condition split: `quickAssessmentCompleted` equals `true`
   - **True path →** Send Email → `Day 1 — QA Done`
   - **False path →** Send Email → `Day 1 — No QA`
5. **Wait 48 more hours** (both branches merge back)
6. **Email 3:** Send Email → `Day 3 — Educational`
7. **Wait 96 more hours**
8. **Branch on activity:**
   - Add a condition split: `exercisesCompleted` greater than `0`
   - **True path →** Send Email → `Day 7 — Active`
   - **False path →** Send Email → `Day 7 — Inactive`

---

## Phase 5: Test End-to-End (10 min)

### Step 7 — Test with a real signup

1. Start your dev server with the API key set
2. Sign up with a test email (use a `+` alias like `you+test1@gmail.com`)
3. Check the Loops dashboard → **Audience** — verify the contact appeared with `firstName`, `signupDate`, `quickAssessmentCompleted: false`, `exercisesCompleted: 0`
4. Complete a quick assessment → refresh the contact in Loops → verify `quickAssessmentCompleted: true` and `weakestModule` is set
5. Complete one exercise/exam → verify `exercisesCompleted: 1`
6. In the Loop editor, use **Send Test** to trigger each email to yourself and verify they look right

### Step 8 — Activate the Loop

Once everything checks out, toggle the Loop to **Active**. Every new signup will now enter the drip automatically.

---

## Reference Files

- **Email content:** `docs/plans/crm-email-templates.md`
- **Server-side SDK wrapper:** `lib/loops.ts`
- **Client event API route:** `app/api/loops/events/route.ts`
- **Signup event trigger:** `app/auth/callback/route.ts`
- **Quick assessment event:** `app/try/[module]/results/page.tsx`
- **Exercise completion event:** `hooks/useProgress.ts`
