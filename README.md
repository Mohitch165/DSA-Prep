# DSA Mastery Tracker

A modern interactive dashboard for tracking your DSA interview prep progress.

## Stack

- **React 18** + **TypeScript** + **Vite**
- **Tailwind CSS** with custom dark theme
- **localStorage** for offline-first persistence

## Quick start

```bash
cd /DSAPrep/dsa-tracker
npm install
npm run dev
```

## Features

- **Dashboard** — total solved, weekly count, Blind 75 progress, donut chart, phase progress, pattern progress, 7-day activity heatmap
- **Problems** — 350+ problems with multi-filter (company, pattern, phase, difficulty, status, frequency slider, Blind 75 toggle), sortable columns, inline status updates, per-problem notes
- **Roadmap** — GSAP scroll-triggered phase reveals with live progress bars per week
- **Patterns** — 28 patterns with progress per pattern, click to filter
- **Companies** — 39 companies grouped by tier, click to filter

## Data persistence

Progress saved to `localStorage` key `dsa_progress_v1`. Use the **Export** button in Dashboard for a JSON backup.

## File structure

```
src/
├── App.tsx
├── main.tsx
├── index.css
├── types.ts
├── lib/
│   ├── utils.ts
│   └── stats.ts
├── hooks/
│   └── useProgress.ts
├── data/
│   └── problems.ts
└── components/
    ├── Header.tsx
    ├── Dashboard.tsx
    ├── Problems.tsx
    ├── Roadmap.tsx
    ├── Patterns.tsx
    ├── Companies.tsx
    ├── NotesModal.tsx
    └── ui/   (shadcn-style primitives)
```

Drop a star if you find it helpful!
