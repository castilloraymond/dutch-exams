# Dutch Inburgering Prep

The ultimate resource for passing the Dutch Inburgering exams. A Duolingo-style web app that helps expats comprehensively prepare for all sections of the Inburgering exam through interactive exercises with instant feedback and progress tracking.

## Modules

### Lezen (Reading Comprehension)
5 Dutch reading passages at A0–A1 level with multiple-choice questions:
- De Supermarkt — Shopping vocabulary
- Op het Station — Transportation
- Bij de Dokter — Healthcare
- Een Brief — Official letters
- De Buurt — Neighborhood notices

### KNM (Kennis van de Nederlandse Maatschappij)
8 topics covering Dutch society knowledge with 12 questions each (96 total):
- Werk (Work) — Employment law, contracts, minimum wage
- Wonen (Housing) — Rental and housing systems
- Gezondheid (Health) — Dutch healthcare system
- Geschiedenis (History) — Dutch history
- Onderwijs (Education) — Educational system
- Normen en Waarden (Norms & Values) — Dutch culture
- Politiek (Politics) — Government and political system
- Geografie (Geography) — Dutch geography

### Luisteren (Listening Comprehension)
5 audio exercises using browser speech synthesis at 0.85x speed for clarity:
- Bij de Bakker — Bakery transaction
- Op het Gemeentehuis — Municipality office
- Een Telefoongesprek — Phone conversation
- Bij de Huisarts — Doctor's office
- Op het Werk — Workplace scenario

### Planned Modules
- Schrijven (Writing)
- Spreken (Speaking)

## Features

- Multiple-choice questions with instant feedback and explanations
- Randomized question order per session
- Progress tracking saved to localStorage
- Optional cloud backup via email (Supabase)
- Results summary with pass/fail threshold (60%)
- Audio playback via Web Speech Synthesis API (Dutch nl-NL)
- Mobile-first responsive design
- A0–A1 difficulty level content

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

## Optional: Cloud Progress Sync

To enable cloud progress backup:

1. Create a [Supabase](https://supabase.com) project
2. Run the SQL schema in `supabase/schema.sql`
3. Copy `.env.local.example` to `.env.local`
4. Add your Supabase URL and anon key

```bash
cp .env.local.example .env.local
```

## Project Structure

```
/app
├── page.tsx                     # Landing page with module cards
├── layout.tsx
├── globals.css
├── learn/
│   ├── page.tsx                 # Reading passage listing
│   ├── [passageId]/page.tsx     # Individual reading exercise
│   ├── knm/
│   │   ├── page.tsx             # KNM topic selection
│   │   └── [topicId]/page.tsx   # Individual KNM quiz
│   └── luisteren/
│       ├── page.tsx             # Listening exercise listing
│       └── [exerciseId]/page.tsx # Individual listening exercise
└── api/progress/route.ts        # Cloud sync API (POST/GET)

/components
├── ui/                          # shadcn/ui primitives
├── AudioPlayer.tsx              # Speech synthesis player
├── PassageCard.tsx              # Passage card with progress
├── QuestionView.tsx             # Multiple-choice question
├── ResultsSummary.tsx           # End-of-exercise results
└── SaveProgressForm.tsx         # Cloud sync form

/content
├── index.json                   # Lezen module index
├── passages/                    # Reading passage JSON files
├── knm/
│   ├── index.json               # KNM topic index
│   └── topics/                  # KNM topic JSON files
└── luisteren/
    ├── index.json               # Luisteren exercise index
    └── exercises/               # Listening exercise JSON files

/lib
├── content.ts                   # Content loading utilities
├── progress.ts                  # Progress management (localStorage)
├── supabase.ts                  # Supabase client
├── types.ts                     # TypeScript interfaces
└── utils.ts                     # Utilities (shuffle, cn)

/hooks
├── useProgress.ts               # Progress state (useSyncExternalStore)
└── usePassage.ts                # Content fetching with shuffle
```

## Tech Stack

- Next.js 16 (App Router)
- React 19
- TypeScript 5
- Tailwind CSS 4
- shadcn/ui + Radix UI
- Supabase (optional)

## Deploy

Deploy to Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-repo/dutch-inburgering-prep)

## License

MIT
