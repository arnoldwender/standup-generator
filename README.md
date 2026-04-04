# Standup Generator

> **"SOUND BUSY. DO NOTHING."** — Wender Media Agile Productivity Suite v6.6.6

A satirical, retro-styled standup meeting note generator built with React and TypeScript. Generate hilariously realistic standup updates with a CRT terminal aesthetic.

[![Open in Bolt](https://bolt.new/static/open-in-bolt.svg)](https://bolt.new/~/sb1-khhnsscy)

## Features

- **Randomized standup generation** — Produces yesterday's work, today's plan, blockers, and a mood indicator from a curated pool of satirical entries
- **CRT terminal aesthetic** — Scanlines, vignette, glitch text animations, and a retro beam effect
- **Copy to clipboard** — One-click paste-ready standup format for Slack, Teams, or wherever your standups happen
- **Regenerate on demand** — Keep clicking until it sounds like you
- **Fully typed** — 100% TypeScript with strict mode

## Tech Stack

| Layer       | Technology                        |
| ----------- | --------------------------------- |
| Framework   | React 18                          |
| Language    | TypeScript 5                      |
| Build Tool  | Vite 5                            |
| Styling     | Tailwind CSS 3 + custom CSS       |
| Icons       | Lucide React                      |
| Linting     | ESLint 9 + typescript-eslint      |

## Getting Started

### Prerequisites

- Node.js 18+ (LTS recommended)
- npm 9+

### Installation

```bash
git clone https://github.com/arnoldwender/standup-generator.git
cd standup-generator
npm install
```

### Development

```bash
npm run dev        # Start Vite dev server (http://localhost:5173)
npm run build      # Production build to dist/
npm run preview    # Preview production build locally
npm run lint       # Run ESLint
npm run typecheck  # Run TypeScript type checking
```

## Project Structure

```
standup-generator/
├── src/
│   ├── components/
│   │   ├── CrtOverlay.tsx       # CRT scanline/vignette/beam effects
│   │   ├── StandupCard.tsx      # Reusable card for standup items
│   │   └── StandupOutput.tsx    # Main output display with copy/regenerate
│   ├── data/
│   │   └── standup-data.ts      # Standup phrases, moods, and categories
│   ├── utils/
│   │   └── glitch.ts            # Text glitch animation & random picker
│   ├── App.tsx                  # Main app component
│   ├── main.tsx                 # React entry point
│   ├── index.css                # Tailwind base + custom animations
│   └── vite-env.d.ts            # Vite type declarations
├── index.html                   # HTML entry point
├── package.json                 # Dependencies and scripts
├── vite.config.ts               # Vite configuration
├── tailwind.config.js           # Tailwind CSS configuration
├── tsconfig.json                # TypeScript root config
├── tsconfig.app.json            # App TypeScript config (strict)
├── tsconfig.node.json           # Node TypeScript config
├── eslint.config.js             # ESLint flat config
└── postcss.config.js            # PostCSS plugins (Tailwind + Autoprefixer)
```

## How It Works

1. Click **GENERATE STANDUP**
2. The app randomly selects from pools of 15 satirical entries each for:
   - **Yesterday** — What you "did"
   - **Today** — What you "plan to do"
   - **Blockers** — What's "blocking" you
   - **Mood** — One of 5 emotional states (Fine, Caffeinated, Surviving, Dead Inside, Fully Automated)
3. Copy the paste-ready output to your standup channel

## License

This project is provided as-is for entertainment purposes.
