# Implementation Plan: New Exam Categories

## Executive Summary

Adding KNM, Lezen, Schrijven, and Luisteren categories to your inburgering app, prioritized by **ease and cost of implementation**.

---

## Priority Order (Easiest → Hardest)

| Priority | Category | Effort | Cost | Time Estimate |
|----------|----------|--------|------|---------------|
| 1️⃣ | **KNM** | Low | Free | 1-2 days |
| 2️⃣ | **Lezen** (expand) | Low | Free | 1 day |
| 3️⃣ | **Luisteren** | Medium | Free-Low | 3-5 days |
| 4️⃣ | **Schrijven** | High | Medium | 1-2 weeks |

---

## 1️⃣ KNM (Kennis van de Nederlandse Maatschappij) — EASIEST

### Why First?
- **Same question format** as your existing Lezen module (multiple choice)
- **Abundant free content** available
- **No media required** (text-only questions)
- Your existing `Question` interface works perfectly

### Data Sources (Free)

| Source | Content | Format | License |
|--------|---------|--------|---------|
| [Open-KNM.org](https://open-knm.org/en) | Summaries, vocabulary, practice Q's | Web (scrapeable) | Open-source |
| [Quizlet KNM Sets](https://quizlet.com/nl/717825763/knm-dutch-inburgering-flash-cards/) | 100+ flashcard Q&A pairs | Web/API | Check ToS |
| [Brainscape KNM](https://www.brainscape.com/flashcards/knm-14196191/packs/21635321) | 341 flashcards | Web | Check ToS |
| [GitHub: sonambhatnagar/inburgering](https://github.com/sonambhatnagar/inburgering) | PDFs with questions | PDF | Unlicensed |
| [DUO Official Practice](https://www.inburgeren.nl/en/taking-the-integration-exam/practicing.jsp) | 3 official mock exams | Downloadable | Government |

### Implementation Steps

1. **Create KNM content structure:**
   ```
   /content/knm/
   ├── index.json
   └── topics/
       ├── werk-en-inkomen.json
       ├── wonen.json
       ├── gezondheid.json
       ├── geschiedenis.json
       └── ...
   ```

2. **Extend types (minimal change):**
   ```typescript
   // Add to types.ts
   export interface KNMTopic {
     id: string;
     title: string;
     titleEn: string;  // English translation
     questions: Question[];  // Reuse existing!
   }
   ```

3. **Create 8 topic JSON files** with 10-15 questions each (total ~100 questions)

4. **Add new page:** `/app/knm/[topicId]/page.tsx` (copy from Lezen, minor tweaks)

### Content Strategy
- Start with **Open-KNM.org** summaries → convert to questions
- Scrape/manually enter **Quizlet** flashcards (Q→question, A→correct answer, generate distractors)
- Use official DUO practice exams for validation

### Estimated Effort: **8-16 hours**

---

## 2️⃣ Lezen (Reading) — EXPAND EXISTING

### Why Second?
- **Already implemented!** Just need more content
- Same JSON structure, same components
- Add A2 difficulty level

### Data Sources

| Source | Content | Format |
|--------|---------|--------|
| [Ad Appel Oefenexamens](https://www.adappel.nl/oefenexamens) | Free A1/A2/B1 practice texts | Web |
| [DUO Practice Exams](https://www.inburgeren.nl/en/taking-the-integration-exam/practicing.jsp) | Official reading passages | Downloadable |
| [NT2 TaalMenu](https://nt2taalmenu.nl/) | A1-A2 reading exercises | Web |

### Implementation Steps

1. **Extend difficulty type:**
   ```typescript
   difficulty: "A0" | "A1" | "A2"
   ```

2. **Add 5-10 new passages** at A2 level

3. **Add difficulty filter** to the passages list page

### Estimated Effort: **4-8 hours**

---

## 3️⃣ Luisteren (Listening) — MEDIUM EFFORT

### Why Third?
- Requires **audio playback** (new component)
- Need to source/host audio files
- But still multiple choice questions

### Technical Requirements

1. **New `AudioQuestion` component:**
   ```typescript
   interface AudioQuestion extends Question {
     audioUrl: string;
     audioTranscript?: string;  // For accessibility
     playCount?: number;  // Limit replays like real exam
   }
   ```

2. **Audio player component** with:
   - Play/pause controls
   - Replay limit (exam allows 2 plays)
   - Progress indicator

3. **Audio hosting:** Use Supabase Storage (free tier: 1GB)

### Data Sources

| Source | Content | Notes |
|--------|---------|-------|
| [DUO Practice Luisteren](https://www.inburgeren.nl/en/taking-the-integration-exam/practicing.jsp) | Official audio + questions | Best quality |
| YouTube channels (transcribe) | Dutch conversation videos | Requires processing |
| AI-generated audio | Text-to-speech Dutch | Low cost, unlimited |

### Content Strategy Options

**Option A: Use Official DUO Audio (Recommended)**
- Download official practice exam audio
- Transcribe and create question sets
- Cost: Free, highest authenticity

**Option B: AI Text-to-Speech**
- Write dialogue scripts
- Generate audio with Dutch TTS (Google Cloud, Azure, ElevenLabs)
- Cost: ~$0.01-0.10 per audio clip
- Pro: Unlimited content generation

### Implementation Steps

1. Create `/components/AudioPlayer.tsx`
2. Extend types for audio questions
3. Create `/content/luisteren/` structure
4. Add `/app/luisteren/[exerciseId]/page.tsx`
5. Set up Supabase Storage for audio files

### Estimated Effort: **20-40 hours**

---

## 4️⃣ Schrijven (Writing) — HARDEST

### Why Last?
- **Requires free-text input** (not multiple choice)
- **Needs evaluation logic** (AI or manual)
- Most complex UX (typing interface)
- Real exam is on paper, so digital simulation is different

### Technical Challenges

1. **Input handling:** Rich text editor or simple textarea
2. **Evaluation:** How to score written Dutch?
   - AI evaluation (GPT/Claude API) — costs money per submission
   - Keyword matching — cheap but inaccurate
   - Self-evaluation with model answer — free but less useful

### Data Sources

| Source | Content |
|--------|---------|
| [Inburgering.org Writing Guide](https://inburgering.org/exam-info/writing-exam-guide) | Task types, scoring criteria |
| DUO Practice Schrijven | Official writing prompts |

### Implementation Options

**Option A: Self-Check Model (Cheapest)**
```typescript
interface WritingExercise {
  id: string;
  prompt: string;
  promptType: "email" | "form" | "note";
  modelAnswer: string;
  checkpoints: string[];  // Key points to include
}
```
- User writes response
- Show model answer for comparison
- User self-evaluates against checkpoints
- Cost: Free

**Option B: AI Evaluation (Best UX, Costs Money)**
- Send user response to Claude/GPT API
- Return feedback on grammar, completeness, appropriateness
- Cost: ~$0.01-0.05 per evaluation

**Option C: Keyword Scoring (Middle Ground)**
- Check for required keywords/phrases
- Basic grammar checking with existing libraries
- Cost: Free, but limited accuracy

### Estimated Effort: **40-80 hours**

---

## Recommended Implementation Roadmap

### Phase 1: Quick Wins (Week 1)
- [ ] Add KNM module with 50-100 questions (8 topics)
- [ ] Expand Lezen to A2 level (5 new passages)

### Phase 2: Audio Support (Week 2-3)
- [ ] Build AudioPlayer component
- [ ] Add 10-15 Luisteren exercises
- [ ] Set up Supabase Storage

### Phase 3: Writing (Week 4+)
- [ ] Implement Schrijven with self-check model
- [ ] Add 10 writing prompts across task types
- [ ] (Optional) Add AI evaluation as premium feature

---

## Content Licensing Notes

| Source | Can Use? | Notes |
|--------|----------|-------|
| DUO/Inburgeren.nl | ✅ Yes | Government content, public domain |
| Open-KNM.org | ✅ Yes | Open source |
| Quizlet | ⚠️ Check | User-generated, check ToS for scraping |
| YouTube | ⚠️ Check | Fair use for educational, don't redistribute |
| Brainscape | ⚠️ Check | Similar to Quizlet |

### Safest Approach
1. Use official DUO materials (free, legal)
2. Create original questions based on KNM curriculum topics
3. For audio: use DUO materials or generate with TTS

---

## File Structure Proposal

```
/content/
├── lezen/
│   ├── index.json
│   └── passages/
│       └── *.json (existing + new A2)
├── knm/
│   ├── index.json
│   └── topics/
│       ├── werk-en-inkomen.json
│       ├── wonen.json
│       ├── gezondheid.json
│       └── ...
├── luisteren/
│   ├── index.json
│   └── exercises/
│       └── *.json (with audioUrl references)
└── schrijven/
    ├── index.json
    └── prompts/
        └── *.json
```

---

## Quick Start: KNM Questions Template

```json
{
  "id": "werk-en-inkomen",
  "title": "Werk en Inkomen",
  "titleEn": "Work and Income",
  "questions": [
    {
      "id": "wi-1",
      "text": "Wat is het minimumloon in Nederland bedoeld voor?",
      "options": [
        "Alleen voor mensen met een vast contract",
        "Alle werknemers van 21 jaar en ouder",
        "Alleen voor Nederlandse staatsburgers",
        "Mensen die parttime werken"
      ],
      "correctIndex": 1,
      "explanation": "Het minimumloon geldt voor alle werknemers van 21 jaar en ouder, ongeacht nationaliteit of contracttype."
    }
  ]
}
```

---

## Next Steps

1. **Confirm priority order** — Do you agree with KNM first?
2. **Choose content sources** — Which do you want to use?
3. **Decide on Schrijven approach** — Self-check vs AI evaluation?
4. **I can start implementing** — Which module should I build first?
