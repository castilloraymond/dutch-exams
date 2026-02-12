# PRD-05: Security Hardening

**Date:** 2026-02-10
**Status:** Draft
**Branch:** feature/security-hardening
**Effort:** L

---

## Problem & Goal

The inburgering exam prep app has critical security vulnerabilities that expose user data, allow unauthorized access, and create attack vectors:

1. **Unauthenticated Progress API** – `GET /api/progress?email=X` returns anyone's exam progress without authentication. Attackers can enumerate emails and access sensitive data.
2. **Open Redirect Vulnerabilities** – `/auth/callback`, login/signup forms use weak `startsWith("/")` check allowing `//evil.com` attacks.
3. **No Rate Limiting** – All API endpoints lack rate limiting, enabling brute force, DoS, and abuse.
4. **Blog XSS via `dangerouslySetInnerHTML`** – Blog posts render unsanitized HTML, allowing stored XSS attacks.
5. **Stored XSS via Feedback API** – `user_agent` and `screen_size` fields stored unsanitized; if displayed in admin UI, trigger XSS.
6. **Score Validation Missing** – Exam results API accepts invalid scores (negative or > totalQuestions).
7. **Weak Email Validation** – Subscribe endpoint uses weak regex, accepts malformed emails.
8. **OAuth Redirect Injection** – `AuthContext.tsx` includes user-controlled `redirectTo` without validation.

**Goal:** Implement defense-in-depth security measures across authentication, API endpoints, and data handling to prevent data breaches, unauthorized access, and injection attacks.

---

## User Story

As a student using the inburgering app,
I want my progress data, personal information, and exam results to be protected,
So that my privacy is guaranteed and my data cannot be accessed by unauthorized parties.

As a system administrator,
I want all API endpoints to be rate-limited and validated,
So that the system is resilient against abuse, brute force attacks, and malicious input.

---

## Requirements

### Authentication & Authorization

- [ ] Add authentication middleware to `GET /api/progress`
  - Verify user is authenticated via JWT or session
  - Allow users to view only their own progress
  - Return 401 for unauthenticated requests
  - Return 403 for cross-user access attempts
  - Log all unauthorized access attempts
- [ ] Implement session/JWT validation in `middleware.ts`
  - Check auth header on all `/api/*` endpoints
  - Attach `userId` or `email` to request context
  - Reject requests with invalid/expired tokens
- [ ] Add auth guards to all user data endpoints (`/api/feedback`, `/api/exam-results`)
  - Verify requester is the user whose data is being accessed
  - Return 403 for unauthorized cross-user access

### Redirect Validation

- [ ] Replace `startsWith("/")` with strict URL validation in:
  - `app/auth/callback/route.ts`
  - `components/auth/LoginForm.tsx`
  - `components/auth/SignupForm.tsx`
  - `contexts/AuthContext.tsx`
- [ ] Use allowlist of safe redirect paths: `/learn`, `/dashboard`, `/dashboard/progress`, `/quick-assessment`, `/upgrade`
- [ ] Reject any URL with `://` (protocol) or `//` (protocol-relative)
- [ ] Reject `javascript:`, `data:`, `vbscript:` URLs
- [ ] Default redirect to `/dashboard` if URL validation fails
- [ ] Add unit tests for redirect validation edge cases

### API Rate Limiting

- [ ] Integrate rate limiting middleware (e.g., `express-rate-limit` or similar)
- [ ] Apply rate limits to all endpoints:
  - `/api/progress` – 30 requests per 15 min per user
  - `/api/feedback` – 10 requests per 15 min per user
  - `/api/subscribe` – 5 requests per hour per IP
  - `/api/exam-results` – 50 requests per hour per user
- [ ] Use IP + user ID (if authenticated) as rate limit key
- [ ] Return 429 (Too Many Requests) with Retry-After header
- [ ] Log rate limit violations for abuse monitoring

### Input Validation & Sanitization

#### Email Validation
- [ ] Replace weak regex in `/api/subscribe` with RFC 5322 compliant validation
  - Use library like `email-validator` or zod `email()`
  - Reject emails with invalid TLDs, missing @, etc.
  - Validate domain exists via DNS lookup (optional but recommended)

#### Score Validation
- [ ] Add strict validation in `/api/exam-results`:
  - Score must be non-negative integer
  - Score must be ≤ totalQuestions (from request or config)
  - totalQuestions must be positive integer
  - Add schema validation with zod/joi
  - Return 400 Bad Request for invalid scores
  - Log suspicious score attempts

#### User Agent & Screen Size Sanitization
- [ ] In `/api/feedback/route.ts`:
  - Strip/sanitize user_agent field (remove control chars, limit length to 500)
  - Validate screen_size format (e.g., `"1920x1080"`)
  - Use allowlist for user_agent prefixes if possible
  - Escape all fields before storing in DB (parameterized queries)
  - If displayed in admin UI, use `.textContent` (never `.innerHTML`)

### XSS Prevention

#### Blog Content Sanitization
- [ ] In `app/blog/[slug]/page.tsx`:
  - Remove `dangerouslySetInnerHTML`
  - Parse blog HTML safely using `DOMPurify` or `sanitize-html`
  - Allowlist safe HTML tags: `<p>`, `<strong>`, `<em>`, `<ul>`, `<li>`, `<a>`, `<h1>-<h6>`, `<code>`, `<pre>`
  - Block scripts, event handlers, `<iframe>`, `<object>`, etc.
  - Validate `href` attributes (reject `javascript:`, `data:`)
  - Add CSP header to restrict inline script execution
  - Add unit tests for malicious payloads

#### Admin Dashboard XSS Protection
- [ ] When displaying feedback data in admin UI:
  - Use `.textContent` for user_agent, screen_size, message fields
  - Never use `.innerHTML` or `dangerouslySetInnerHTML`
  - Encode all user-supplied fields in HTML context
  - Add Content Security Policy (CSP) headers

### OAuth Redirect Security

- [ ] In `contexts/AuthContext.tsx`:
  - Validate `redirectTo` param against allowlist before OAuth redirect
  - Remove or sanitize user-controlled redirect parameters
  - Store redirect target in session/state, not URL query
  - Verify redirect target after OAuth callback completes
  - Default to `/dashboard` if no valid redirect

---

## Data & State

### API Response Models (with validation)

```
GET /api/progress?email=user@example.com
Response (authenticated only):
{
  userId: "uuid",
  email: "user@example.com",
  progress: {
    lezen: { completed: 3, total: 5 },
    luisteren: { completed: 2, total: 4 },
    spreken: { completed: 1, total: 3 },
    schrijven: { completed: 2, total: 3 }
  },
  lastUpdated: "2026-02-10T10:30:00Z"
}

POST /api/exam-results (with validation)
{
  moduleId: "lezen",
  score: 8,  // Must be integer, >= 0, <= totalQuestions
  totalQuestions: 10,  // Must be positive
  timestamp: "2026-02-10T10:30:00Z"
}

POST /api/feedback (sanitized)
{
  message: "Good app",  // Sanitized
  user_agent: "Mozilla/5.0...",  // Stripped control chars, max 500
  screen_size: "1920x1080",  // Validated format
  rating: 5
}

POST /api/subscribe (with strong email validation)
{
  email: "user@example.com",  // RFC 5322 validated
  preferences: { newsletter: true }
}
```

### Rate Limit Headers

```
HTTP 429 Response:
Retry-After: 60
X-RateLimit-Limit: 30
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1644494400
```

### Session/JWT Structure (if applicable)

```
JWT payload:
{
  userId: "uuid",
  email: "user@example.com",
  exp: 1644494400,
  iat: 1644408000,
  tokenType: "access"
}
```

---

## UI Notes

- Add "rate limit exceeded" error UI if user hits 429
- Display "Unauthorized" error if accessing another user's progress
- Show validation error for weak emails in subscribe form
- No visible changes needed for blog XSS fix (sanitization is transparent)
- OAuth redirect should be silent (no user interaction needed)
- Admin dashboard should display feedback safely (no raw HTML rendering)

---

## Non-Goals

- Do not implement 2FA or passwordless auth (out of scope)
- Do not add new auth methods (OAuth, SAML, etc.) beyond existing
- Do not refactor database schema
- Do not modify password hashing (assume correct implementation)
- Do not add IP-based blocking/geofencing

---

## Success Criteria

- [ ] `GET /api/progress` returns 401 without authentication
- [ ] `GET /api/progress` returns 403 when user tries to access another user's data
- [ ] All redirect URLs validated; `//evil.com` and `javascript:` URLs rejected
- [ ] All API endpoints return 429 after rate limit exceeded
- [ ] Email validation rejects: `user@`, `@example`, `user..name@example.com`, invalid TLDs
- [ ] Exam scores: negative, > totalQuestions, non-integer values all rejected with 400
- [ ] Blog renders safely without XSS (no `dangerouslySetInnerHTML`)
- [ ] Feedback data sanitized; no control characters or malicious scripts in DB
- [ ] Admin dashboard displays feedback using `.textContent`, not `.innerHTML`
- [ ] Rate limit middleware logs violations with timestamp, IP, user ID
- [ ] OWASP Top 10 (A1-A6) vulnerabilities addressed and tested
- [ ] Security tests cover: auth bypass, redirect injection, rate limit bypass, XSS payloads, invalid input

---

## Content & File Changes

### Files to Audit/Modify

| File | Change Type | Security Impact | Notes |
|------|------------|-----------------|-------|
| `app/api/progress/route.ts` | Add auth middleware | HIGH – Data breach | Verify JWT/session, return 401/403 |
| `app/api/feedback/route.ts` | Sanitize inputs, add auth | MEDIUM – Stored XSS | Strip control chars, validate user_agent/screen_size |
| `app/api/subscribe/route.ts` | Strong email validation, rate limit | LOW-MEDIUM | Use RFC 5322 validation, add rate limit |
| `app/api/exam-results/route.ts` | Score validation, add auth | MEDIUM – Data integrity | Validate score range, add auth check |
| `app/auth/callback/route.ts` | Redirect validation | HIGH – Open redirect | Use allowlist, reject protocols |
| `components/auth/LoginForm.tsx` | Redirect validation | HIGH – Open redirect | Use allowlist for redirectTo param |
| `components/auth/SignupForm.tsx` | Redirect validation | HIGH – Open redirect | Use allowlist for redirectTo param |
| `contexts/AuthContext.tsx` | OAuth redirect validation | HIGH – Open redirect | Validate redirectTo before OAuth |
| `app/blog/[slug]/page.tsx` | Remove dangerouslySetInnerHTML, add sanitization | HIGH – Stored XSS | Use DOMPurify, allowlist safe tags |
| `middleware.ts` | Add JWT/session validation | HIGH – Auth enforcement | Check auth headers on all /api/* routes |
| `lib/rate-limit.ts` (new) | Rate limiting middleware | MEDIUM – DoS prevention | Integrate rate-limit library |
| `lib/validators.ts` (new or extend) | Input validation helpers | MEDIUM – Injection prevention | Email, URL, score validators |

### New Files to Create

- `lib/rate-limit.ts` – Rate limiting middleware with configurable limits
- `lib/redirect-validator.ts` – Redirect URL validation utility
- `lib/sanitizers.ts` – Sanitization functions for user input
- `__tests__/security.test.ts` – Security-focused unit tests

---

## Open Questions

- [ ] Should rate limits be per-user (authenticated) or per-IP (unauthenticated)?
- [ ] Is rate-limit data stored in Redis or in-memory? (Redis recommended for distributed)
- [ ] Should we implement CSRF protection? (needed if using cookies)
- [ ] Should OAuth redirect URL validation allow external domains for enterprise SSO?
- [ ] Should we add request signing/HMAC verification for API calls?
- [ ] Is there an admin UI displaying feedback? If so, needs sanitization testing.
- [ ] Should sensitive audit logs (rate limits, auth failures) be sent to external monitoring?

---

## CC Handoff

**To:** Code Completion / Security Engineer
**Prompt:**

```
Implement comprehensive security hardening for the inburgering exam app to prevent data breaches, unauthorized access, and injection attacks.

REQUIREMENTS:

1. AUTHENTICATION & AUTHORIZATION:
   - Add JWT/session validation middleware to ALL /api/* endpoints
   - GET /api/progress must require authentication and verify user owns the progress data
   - Return 401 for missing/invalid auth, 403 for unauthorized cross-user access
   - Update /api/feedback and /api/exam-results to check user ownership
   - Log all unauthorized access attempts

2. REDIRECT VALIDATION (prevents open redirect attacks):
   - Replace weak startsWith("/") checks with strict allowlist validation
   - Safe redirect paths ONLY: /learn, /dashboard, /dashboard/progress, /quick-assessment, /upgrade
   - REJECT: URLs with :// or //, javascript:, data:, vbscript:
   - Default to /dashboard if validation fails
   - Fix in: app/auth/callback/route.ts, LoginForm.tsx, SignupForm.tsx, AuthContext.tsx
   - Add unit tests for redirect edge cases

3. RATE LIMITING (prevents brute force, DoS):
   - Add rate limit middleware to:
     * /api/progress: 30 req/15min per user
     * /api/feedback: 10 req/15min per user
     * /api/subscribe: 5 req/hour per IP
     * /api/exam-results: 50 req/hour per user
   - Return 429 with Retry-After header
   - Log violations with timestamp, IP, user ID

4. INPUT VALIDATION & SANITIZATION:
   - Email validation (app/api/subscribe/route.ts):
     * Use RFC 5322 compliant validator (email-validator lib or zod)
     * Reject: missing @, invalid TLD, control chars

   - Score validation (app/api/exam-results/route.ts):
     * Score must be non-negative integer
     * Score must be <= totalQuestions
     * totalQuestions must be positive
     * Return 400 for invalid scores

   - User Agent/Screen Size sanitization (app/api/feedback/route.ts):
     * Strip control chars from user_agent (max 500 chars)
     * Validate screen_size format (e.g., "1920x1080")
     * Use parameterized DB queries

5. XSS PREVENTION:
   - Blog sanitization (app/blog/[slug]/page.tsx):
     * Remove dangerouslySetInnerHTML
     * Use DOMPurify to sanitize HTML content
     * Allowlist tags: <p>, <strong>, <em>, <ul>, <li>, <a>, <h1-h6>, <code>, <pre>
     * Block: scripts, event handlers, <iframe>, <object>
     * Validate href attributes (reject javascript:, data:)
     * Add tests for XSS payloads

   - Admin feedback display:
     * Use .textContent for user_agent, screen_size, message (never .innerHTML)
     * Encode all user fields in HTML context

6. OAUTH REDIRECT SECURITY (contexts/AuthContext.tsx):
   - Validate redirectTo param against allowlist before OAuth redirect
   - Store redirect target in session/state, not URL query
   - Verify redirect after callback completes
   - Default to /dashboard if invalid

KEY FILES TO MODIFY:
- app/api/progress/route.ts
- app/api/feedback/route.ts
- app/api/subscribe/route.ts
- app/api/exam-results/route.ts
- app/auth/callback/route.ts
- components/auth/LoginForm.tsx
- components/auth/SignupForm.tsx
- contexts/AuthContext.tsx
- app/blog/[slug]/page.tsx
- middleware.ts

NEW FILES TO CREATE:
- lib/rate-limit.ts (middleware)
- lib/redirect-validator.ts (validation utility)
- lib/sanitizers.ts (sanitization utilities)
- __tests__/security.test.ts (security tests)

NON-GOALS:
- Don't implement 2FA, new auth methods, passwordless auth
- Don't refactor database schema or password hashing
- Don't add IP blocking/geofencing

SUCCESS CRITERIA:
- All API endpoints require authentication and enforce user ownership
- Open redirect vulnerabilities eliminated (allowlist validation)
- Rate limits enforced; 429 returned after limit exceeded
- Emails rejected: user@, @example, invalid TLD, control chars
- Exam scores: negative, >totalQuestions, non-integer all return 400
- Blog renders safely (no dangerouslySetInnerHTML)
- Feedback sanitized (no control chars, stored XSS prevented)
- Rate limit violations logged
- OWASP Top 10 (A1-A6) addressed
- Security tests pass for auth bypass, redirect injection, XSS, invalid input
```

---
