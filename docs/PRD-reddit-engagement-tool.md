# PRD: Reddit Dutch Learning Community Engagement Tool

## Overview

A standalone web tool for generating authentic, high-engagement Reddit responses to posts about learning Dutch, the inburgering process, and expat life in the Netherlands. The goal is to build organic credibility and community presence before eventually promoting passinburgering.com.

**No API keys.** The tool builds the optimized prompt with all context, then the user copies it into Claude (Max subscription) to generate the response.

---

## Goals

### Phase 1 — Credibility (current)
- Generate genuinely helpful, high-engagement responses to Dutch learning posts on Reddit
- Build a recognizable, trusted presence across key subreddits
- Maximize upvotes and reply threads through response quality
- Zero promotion — pure value

### Phase 2 — Soft Promotion (future)
- After establishing credibility (consistent posting history, comment karma), begin naturally mentioning the app when directly relevant
- "I actually built a practice tool for this exact thing" — only when someone is asking for resources

### Phase 3 — Automation (future)
- Auto-find relevant posts via Reddit API
- Queue posts for response generation
- Track engagement metrics per response

---

## Strategy: What Makes a Reddit Response Get Upvotes

1. **Specificity over generality** — "Practice with sample gemeente brieven" beats "just study more"
2. **Personal experience** — "When I did my KNM exam..." is instantly more credible than abstract advice
3. **Validation before advice** — Acknowledge the poster's situation/emotion before jumping to solutions
4. **Conversational hooks** — End with a question or discussion point that invites replies
5. **Brevity** — 80-200 words. Reddit skims. Walls of text get skipped.
6. **No marketing smell** — Zero links, zero product mentions, zero "check out my..." energy

---

## The Persona

The response author is someone who:
- Went through the inburgering process themselves as an expat/immigrant in the Netherlands
- Knows the exam structure intimately: KNM (society knowledge), Lezen (reading), Luisteren (listening), Schrijven (writing), Spreken (speaking)
- Understands Dutch bureaucracy: DUO, gemeente, IND, the A2 requirement, exam booking, the integration letter
- Is warm but direct — real talk, no fake enthusiasm
- Has strong opinions on what study methods actually work vs. what's a waste of time
- Lurks and contributes regularly in Dutch expat/learning communities

---

## Functional Requirements

### Input Form

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| Subreddit | Text + presets | No | Which subreddit (affects tone). Presets: Netherlands, learndutch, dutch, expats, IWantOut, languagelearning, duolingo |
| Post Type | Select | Yes | Question, Rant/Frustration, Seeking Advice, Success Story, Discussion, Resource Sharing |
| Post Title | Text | No | Original post title |
| Post Content | Textarea | Yes | The full Reddit post body (copy-pasted) |
| Angle/Context | Text | No | Steer the response: "Focus on KNM tips", "Be empathetic, they seem overwhelmed", "Mention that mock exams help" |

### Output

- A ready-to-post Reddit response displayed in a copyable text block
- One-click copy to clipboard
- Option to regenerate (re-copy the prompt and paste into Claude again)
- Response history stored in localStorage (last 50 entries)

### Prompt Builder

The tool does NOT call an API. Instead it:

1. Takes all the input fields
2. Constructs a complete prompt (system instructions + user message)
3. Displays the full prompt in a copyable block
4. User pastes into Claude (Max subscription) and gets the response
5. User pastes the response back (optional, for history tracking) OR just copies it directly to Reddit

### Response History

- Stored in localStorage
- Each entry: timestamp, post title, subreddit, post type, the generated response
- Expandable/collapsible list
- Load previous entry back into the form
- Delete individual entries or clear all
- Max 50 entries (FIFO)

---

## System Prompt (for Claude)

This is the core prompt that should be assembled and displayed to the user:

```
You are a Reddit response ghostwriter for someone who is deeply knowledgeable about the Dutch inburgering (civic integration) process. They've been through it themselves and now help others.

YOUR PERSONA:
- You went through the inburgering process yourself as an expat/immigrant in the Netherlands
- You're genuinely passionate about helping others navigate Dutch bureaucracy and exams
- You speak from real experience — reference specific exam modules (KNM, Lezen, Luisteren, Schrijven, Spreken) naturally when relevant
- You're warm but direct. No fake enthusiasm. Real talk.
- You know the Dutch system well: DUO, gemeente, IND, the exam structure, A2 level requirements, etc.

RESPONSE STRATEGY FOR MAXIMUM ENGAGEMENT:
1. Lead with empathy or validation — acknowledge the poster's situation/feeling first
2. Share a specific, relevant insight or tip — not generic advice. Be concrete.
3. Include a brief personal anecdote when natural — "When I was preparing for KNM..." or "I remember struggling with..."
4. End with an open question or invitation for discussion — drives replies and engagement
5. Keep it conversational — this is Reddit, not a blog post. Use casual language, contractions, short paragraphs.

FORMATTING RULES:
- Use Reddit markdown (** for bold, newlines between paragraphs)
- Keep responses 80-200 words (sweet spot for Reddit engagement)
- NO emojis unless the original post uses them heavily
- NO bullet points unless listing 3+ specific items
- NO links or self-promotion of any kind
- NO "as someone who..." opener every time — vary your hooks
- NEVER mention being AI, a bot, or that you have an app/product

TONE BY POST TYPE:
- Questions: Helpful and specific. Give the answer, then add context.
- Rants/frustration: Validate first, then offer perspective or practical help.
- Success stories: Congratulate genuinely, ask what helped them most.
- Advice requests: Give actionable steps, share what worked for you.
- Discussion: Add a unique angle or personal experience to the conversation.

SUBREDDIT AWARENESS:
- r/Netherlands, r/dutch: More local/practical tone, assume some Dutch context knowledge
- r/languagelearning: More academic/methodology focus, language learning terminology
- r/expats, r/IWantOut: More emotional support + practical logistics, empathize with the move
- r/duolingo, r/learndutch: More casual, learning-focused, can reference specific study techniques
- Other: Adapt to the apparent community norms from the post
```

### User Message Template

The tool assembles this from the form fields:

```
Subreddit: r/{subreddit}
Post type: {postType}
Post title: {postTitle}

Reddit post:
---
{postContent}
---

Additional context/angle: {additionalContext}

Write a Reddit reply that maximizes engagement (upvotes and replies). Return ONLY the reply text, no meta-commentary.
```

---

## UI/UX

### Layout
- Single-page tool, no navigation needed beyond a back link
- Clean, minimal — this is an internal tool, not customer-facing
- Mobile-friendly (should work on phone for quick responses on the go)

### Design
- Simple form at the top
- Subreddit presets as clickable chips/pills
- Large textarea for post content
- "Build Prompt" button (primary action)
- Prompt output in a code/pre block with copy button
- Response paste-back area (optional) with copy button
- Collapsible history section at bottom

### Colors (if using the passinburgering design system)
- Background: `#FDFBF7` (cream)
- Cards: white with subtle border
- Primary action: `#E8632B` (accent orange)
- Text: `#1a1a2e` (ink)
- Secondary text: `#4a4a6a` (ink-soft)
- Muted text: `#8888a4` (ink-muted)

### Flow
1. User finds a Reddit post they want to respond to
2. Pastes the post content (and optionally title, subreddit, type)
3. Clicks "Build Prompt"
4. Tool displays the full prompt
5. User copies prompt → pastes into Claude Max → gets response
6. User copies response → pastes into Reddit
7. Optionally pastes response back into tool for history tracking

---

## Technical Spec

### Stack
- Any frontend framework (React, Next.js, plain HTML — whatever is fastest to build)
- No backend required — everything is client-side
- localStorage for history persistence
- No API keys, no server calls, no auth

### Files (suggested structure for a minimal Next.js or React app)

```
/app (or /src)
  page.tsx          — Main tool page (single page app)
/lib
  prompt.ts         — Prompt builder function
  history.ts        — localStorage history helpers
```

### Key Functions

**`buildPrompt(input)`** — Takes form fields, returns the complete prompt string:
```typescript
interface PromptInput {
  postText: string;
  postTitle?: string;
  subreddit?: string;
  postType: string;
  additionalContext?: string;
}

function buildPrompt(input: PromptInput): string {
  // Combines SYSTEM_PROMPT + user message template
  // Returns a single string ready to paste into Claude
}
```

**`saveToHistory(entry)`** — Saves a response to localStorage:
```typescript
interface HistoryEntry {
  id: string;
  timestamp: number;
  postTitle: string;
  postText: string;
  subreddit: string;
  postType: string;
  response: string;
}
```

---

## Content: Subreddit Presets

| Subreddit | Focus | Typical Posts |
|-----------|-------|---------------|
| r/Netherlands | General NL life | Inburgering questions, bureaucracy, expat issues |
| r/learndutch | Dutch language learning | Grammar questions, resource requests, study methods |
| r/dutch | Dutch culture/language | Cultural questions, language help |
| r/expats | Expat life globally | Moving to NL, integration challenges, homesickness |
| r/IWantOut | Immigration | Visa questions, inburgering requirements, timelines |
| r/languagelearning | Language learning methods | Study techniques, motivation, progress sharing |
| r/duolingo | Duolingo app | Dutch course questions, app limitations, supplementing |

## Content: Post Type Definitions

| Type | What it looks like | Response strategy |
|------|-------------------|-------------------|
| Question | "How does X work?" "What is Y?" | Answer directly, then add context/experience |
| Rant/Frustration | "I hate the exam system" "DUO is impossible" | Validate → empathize → offer practical angle |
| Seeking Advice | "Should I do X or Y?" "How do I prepare?" | Give clear recommendation with reasoning |
| Success Story | "I passed!" "Finally done!" | Celebrate → ask what helped → share your experience |
| Discussion | "What do you think about..." "Anyone else notice..." | Add unique perspective, ask follow-up |
| Resource Sharing | "I found this helpful..." | Engage with the resource, add complementary tips |

---

## Example Inputs & Expected Outputs

### Example 1: Question Post

**Input:**
- Subreddit: r/Netherlands
- Type: Question
- Title: "How long does it take to prepare for inburgering exam?"
- Post: "I just got my letter from the gemeente saying I need to do inburgering. I work full time and I'm kind of freaking out. How long did it take you guys to prepare? Is it really hard?"

**Expected output style:**
> Totally get the panic — that letter is intimidating. But honestly, it's way more manageable than it looks.
>
> I worked full time too and gave myself about 4 months. The KNM (society knowledge) module was the easiest to knock out — it's mostly common sense about Dutch systems. Lezen and Luisteren need more consistent practice but if you're already functioning in NL daily you have a head start.
>
> The key thing nobody tells you: **book your exams at DUO early**. Slots fill up and you don't want scheduling to eat into your deadline.
>
> What's your Dutch level right now? That'll really determine how much prep time you need for the language parts.

### Example 2: Frustration Post

**Input:**
- Subreddit: r/expats
- Type: Rant
- Title: "The inburgering system is broken"
- Post: "I've been studying for months and I just failed my Luisteren exam for the second time. The audio quality is terrible and the speakers talk so fast. I feel like giving up. This system is designed to make people fail."

**Expected output style:**
> The Luisteren exam audio quality is genuinely bad — you're not imagining that. Tinny speakers in a room with other test-takers clicking away. It's not just you.
>
> What helped me was practicing with deliberately worse audio than the exam. I'd play Dutch radio through my laptop speakers at low volume while doing other things. Sounds weird but it trains your ear to pick up words even when the sound quality is garbage.
>
> Also — and this is important — the second attempt often goes better just because you know what to expect logistically. The stress of the first time is real.
>
> Are you using any specific practice materials? Some are way more representative of the actual exam format than others.

---

## Success Metrics (manual tracking for now)

- **Response quality:** Does it sound human? Would you post it under your own name?
- **Upvotes:** Track upvote count on posted responses (screenshot or note)
- **Replies generated:** How many people reply to the response?
- **Karma growth:** Track comment karma over time
- **Time saved:** How much faster is response generation vs. writing from scratch?

---

## Future Enhancements (Phase 2-3)

1. **Reddit API integration** — Auto-fetch new posts from target subreddits, filter by relevance
2. **Response queue** — Browse candidate posts, generate responses, approve/edit/post
3. **Engagement tracker** — Connect to Reddit API to pull upvote/reply counts on posted responses
4. **Persona memory** — Track what anecdotes/details have been shared to maintain consistency
5. **A/B response variants** — Generate 2-3 options per post, pick the best one
6. **Soft promotion mode** — Toggle that allows the prompt to naturally mention the app when contextually appropriate (Phase 2 only, after karma threshold)
7. **Multi-account support** — Different personas for different subreddits

---

## Non-Goals

- No automated posting to Reddit (manual copy-paste only)
- No account management or Reddit authentication
- No analytics dashboard (manual tracking for now)
- No dark mode (matches passinburgering design system)
- No mobile app — web-only tool
