# Dutch Inburgering Prep

A Duolingo-style web app helping expats prepare for the Dutch Inburgering exam, starting with reading comprehension (Lezen) exercises.

## Features

- Reading comprehension exercises with Dutch passages
- Multiple choice questions with instant feedback
- Progress tracking saved to localStorage
- Optional cloud backup via email (Supabase)
- Mobile-first responsive design
- A0-A1 difficulty level content

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
├── page.tsx                 # Landing page
├── learn/
│   ├── page.tsx             # Module overview
│   └── [passageId]/
│       └── page.tsx         # Exercise view
├── api/
│   └── progress/
│       └── route.ts         # Cloud sync API
├── layout.tsx
└── globals.css

/components
├── ui/                      # shadcn components
├── PassageCard.tsx
├── QuestionView.tsx
├── ResultsSummary.tsx
└── SaveProgressForm.tsx

/content
├── passages/                # JSON content files
└── index.json

/lib
├── content.ts               # Content loading utilities
├── progress.ts              # Progress management
├── supabase.ts              # Supabase client
├── types.ts                 # TypeScript types
└── utils.ts

/hooks
├── useProgress.ts           # Progress state management
└── usePassage.ts            # Content fetching
```

## Content

The app includes 5 reading passages at A0-A1 level:

1. De Supermarkt - Shopping vocabulary
2. Op het Station - Transportation
3. Bij de Dokter - Healthcare
4. Een Brief - Official letters
5. De Buurt - Neighborhood notices

## Tech Stack

- Next.js 14+ (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui
- Supabase (optional)

## Deploy

Deploy to Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-repo/dutch-inburgering-prep)

## License

MIT
