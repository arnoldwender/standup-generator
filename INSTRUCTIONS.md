# INSTRUCTIONS.md — Contributor Guide

## Overview

Standup Generator is a satirical web app that creates fake standup meeting notes. It's built with React 18, TypeScript, Vite, and Tailwind CSS. The retro CRT terminal aesthetic is a core part of the design.

## Setup

```bash
git clone https://github.com/arnoldwender/standup-generator.git
cd standup-generator
npm install
npm run dev
```

The dev server starts at `http://localhost:5173` with hot module replacement.

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Build for production (output: `dist/`) |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint across the project |
| `npm run typecheck` | Run TypeScript compiler in check-only mode |

## Contributing Content

The easiest way to contribute is adding new standup phrases in `src/data/standup-data.ts`. The file contains four arrays:

- **YESTERDAY** — Things you "did" yesterday
- **TODAY** — Things you "plan to do" today
- **BLOCKERS** — Things "blocking" your progress
- **MOODS** — Emotional states with emoji, label, and color

All content should maintain the satirical, corporate-humor tone. Examples:

```typescript
// Good — satirical and relatable
"Mass-migrated all legacy spaghetti into modern spaghetti"

// Bad — too literal, not funny
"Worked on the API integration"
```

## Contributing Code

### Component Structure

All components are functional React components using hooks. They live in `src/components/`.

### Styling

- Use Tailwind CSS utility classes for layout, spacing, colors, and typography
- Custom CSS animations go in `src/index.css` using `@keyframes`
- The primary color palette: cyan `#00ffff`, green `#00ff41`, red `#ff0000`, black background

### Type Safety

TypeScript strict mode is enabled. All code must pass:
```bash
npm run typecheck  # No type errors
npm run lint       # No lint errors
npm run build      # Clean production build
```

## Architecture Notes

- **No routing** — This is a single-view application
- **No backend** — All data is client-side in `src/data/`
- **No state management library** — Simple `useState` hooks are sufficient
- **No tests** — The project does not currently have a test suite
- The `@supabase/supabase-js` dependency is present in `package.json` but unused in code
