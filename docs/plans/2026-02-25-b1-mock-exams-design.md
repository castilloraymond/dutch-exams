# B1 Mock Exams Expansion — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add 3 more B1 mock exams per module (b1-exam-3 through b1-exam-5), bringing total to 5 B1 exams per module. All free preview. Azure TTS for Luisteren audio.

**Architecture:** Create 15 new content JSON files following existing B1 exam structure exactly. Register them in index.json files and lib/content.ts. Update Azure TTS script for new Luisteren audio generation.

**Tech Stack:** JSON content files, TypeScript (lib/content.ts), Azure TTS (scripts/generate-audio-azure.ts)

---

## Task 1: Create Lezen B1 Exams 3-5

**Files:**
- Create: `content/mock-exams/lezen/b1-exam-3.json`
- Create: `content/mock-exams/lezen/b1-exam-4.json`
- Create: `content/mock-exams/lezen/b1-exam-5.json`

**Structure per file:** Match existing `b1-exam-1.json` exactly:
- ID: `lezen-b1-{3,4,5}`
- Title: `Lezen B1 - Oefenexamen {3,4,5}`
- 5 passages, 5 questions each (25 total), 4-option MC
- `difficulty: "B1"`, `questionCount: 25`, `recommendedTime: "45 min"`
- Each question has `explanation` (Dutch) + `explanationEn` (English)
- Passage IDs: `b1-{N}-p{1-5}`, Question IDs: `b1-{N}-q{1-25}`
- Content types: letter, article, brochure, notice

**Themes:**
- Exam 3: Tax letters, consumer rights, refugee support, school notices, rental contracts
- Exam 4: Pension correspondence, environmental policy, childcare subsidy, neighborhood disputes, work safety
- Exam 5: Immigration procedures, education system, volunteer orgs, energy bills, healthcare complaints

---

## Task 2: Create KNM B1 Exams 3-5

**Files:**
- Create: `content/mock-exams/knm/b1-exam-3.json`
- Create: `content/mock-exams/knm/b1-exam-4.json`
- Create: `content/mock-exams/knm/b1-exam-5.json`

**Structure per file:** Match existing `b1-exam-1.json`:
- ID: `knm-b1-{3,4,5}`
- Title: `KNM B1 - Oefenexamen {3,4,5}`
- 50 questions, 4-option MC, flat `questions` array
- `difficulty: "B1"`, `questionCount: 50`, `recommendedTime: "40 min"`
- Question IDs: `knm-b1-{N}-q{1-50}`
- Each question has `explanation` + `explanationEn`

**Themes:**
- Exam 3: Education, childcare, cultural integration, political system, media
- Exam 4: Housing market, environment, transportation, DigiD, consumer protection
- Exam 5: Immigration law, pension system, civic participation, Dutch history, taxes

---

## Task 3: Create Luisteren B1 Exams 3-5

**Files:**
- Create: `content/mock-exams/luisteren/b1-exam-3.json`
- Create: `content/mock-exams/luisteren/b1-exam-4.json`
- Create: `content/mock-exams/luisteren/b1-exam-5.json`

**Structure per file:** Match existing `b1-exam-1.json`:
- ID: `luisteren-b1-{3,4,5}`
- Title: `Luisteren B1 - Oefenexamen {3,4,5}`
- 5 transcripts, 5 questions each (25 total)
- `difficulty: "B1"`, `questionCount: 25`, `recommendedTime: "60 min"`
- Transcript IDs: `l-b1-{N}-t{1-5}`, Question IDs: `l-b1-{N}-q{1-25}`
- `audioFile: "/audio/luisteren/mock/l-b1-{N}-t{M}.mp3"`
- Transcripts use `Speaker: text` dialogue format for Azure TTS parsing
- Each question has `explanation` (Dutch only — matches existing B1 luisteren pattern)

**Themes:**
- Exam 3: Parent-teacher conference, tax office call, job training, pharmacy visit, community sports
- Exam 4: Real estate showing, town hall debate, workplace mediation, bank appointment, driving theory
- Exam 5: Immigration lawyer, hospital discharge, union meeting, neighborhood watch, school enrollment

---

## Task 4: Create Schrijven B1 Exams 3-5

**Files:**
- Create: `content/mock-exams/schrijven/b1-exam-3.json`
- Create: `content/mock-exams/schrijven/b1-exam-4.json`
- Create: `content/mock-exams/schrijven/b1-exam-5.json`

**Structure per file:** Match existing `b1-exam-1.json`:
- ID: `schrijven-b1-{3,4,5}`
- Title: `Schrijven B1 - Oefenexamen {3,4,5}`
- 3 writing tasks, `taskType: "free-text"`
- `difficulty: "B1"`, `questionCount: 3`, `recommendedTime: "30 min"`, `isFreePreview: true`
- Question IDs: `schrijven-b1-{N}-q{1-3}`
- Each task: scenario/scenarioEn, prompt/promptEn, wordRange, selfAssessmentCriteria, modelAnswer
- Top-level tips array + selfAssessmentCriteria array

**Themes:**
- Exam 3: Complaint to landlord, request to school, email about schedule change
- Exam 4: Appeal to tax office, cancellation letter, email about noise
- Exam 5: Letter to immigration office, complaint about transport, project update email

---

## Task 5: Create Spreken B1 Exams 3-5

**Files:**
- Create: `content/mock-exams/spreken/b1-exam-3.json`
- Create: `content/mock-exams/spreken/b1-exam-4.json`
- Create: `content/mock-exams/spreken/b1-exam-5.json`

**Structure per file:** Match existing `b1-exam-1.json`:
- ID: `spreken-b1-{3,4,5}`
- Title: `Spreken B1 - Oefenexamen {3,4,5}`
- 4 parts: Personal (1) + 1-picture (2) + 2-picture (3) + 3-picture (4)
- `difficulty: "B1"`, `questionCount: 4`, `recommendedTime: "15 min"`, `isFreePreview: true`
- Question IDs: `spreken-b1-{N}-q{1-4}`
- Each part: questionNl/questionEn, questionParts, personStatement/personStatementNl (part1), images (parts 2-4)
- modelAnswer with transcript/transcriptNl
- Part 4 has `sequencingWordsRequired: true`
- Top-level tips + selfAssessmentCriteria arrays

**Themes:**
- Exam 3: Education/learning (classroom, school vs online, student routine)
- Exam 4: Health/lifestyle (gym, healthy vs fast food, cooking steps)
- Exam 5: Travel/transport (train station, bike vs car, vacation planning)

---

## Task 6: Update Index Files + lib/content.ts

**Files:**
- Modify: `content/mock-exams/lezen/index.json` — add 3 entries
- Modify: `content/mock-exams/knm/index.json` — add 3 entries
- Modify: `content/mock-exams/luisteren/index.json` — add 3 entries
- Modify: `content/mock-exams/schrijven/index.json` — add 3 entries
- Modify: `content/mock-exams/spreken/index.json` — add 3 entries
- Modify: `lib/content.ts` — 15 new imports + 15 registry entries in mockExams object

**Import pattern (add after existing B1 imports for each module):**
```typescript
import lezenB1Exam3 from "@/content/mock-exams/lezen/b1-exam-3.json";
import lezenB1Exam4 from "@/content/mock-exams/lezen/b1-exam-4.json";
import lezenB1Exam5 from "@/content/mock-exams/lezen/b1-exam-5.json";
// Same for knm, luisteren, schrijven, spreken
```

**Registry pattern (add after existing B1 entries):**
```typescript
"lezen-b1-3": lezenB1Exam3 as unknown as MockExam,
"lezen-b1-4": lezenB1Exam4 as unknown as MockExam,
"lezen-b1-5": lezenB1Exam5 as unknown as MockExam,
// Same for knm, luisteren, schrijven, spreken
```

---

## Task 7: Update Azure TTS Script + Generate Audio

**Files:**
- Modify: `scripts/generate-audio-azure.ts` line 462-468 — add `"b1-exam-3", "b1-exam-4", "b1-exam-5"` to mockExamIds array
- Add any new speaker names from Luisteren transcripts to VOICE_MAP and PITCH_MAP

**Run:** `npm run generate-audio:azure`
**Expected:** 15 new MP3 files in `public/audio/luisteren/mock/` (l-b1-{3,4,5}-t{1-5}.mp3)

---

## Task 8: Verify + Commit

- Run `npm run dev` and verify select pages show 5 B1 exams per module
- Spot-check one exam route per module works
- Commit all changes
