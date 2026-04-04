# CLAUDE.md — Claude Code Instructions

This file provides context for Claude Code (claude.ai/code) when working on this repository.

## Project Overview

Standup Generator is a satirical React web app that generates humorous standup meeting notes with a retro CRT terminal aesthetic. It is a frontend-only application with no backend.

## Commands

```bash
npm run dev        # Start dev server (Vite, port 5173)
npm run build      # Production build → dist/
npm run preview    # Preview production build
npm run lint       # ESLint check
npm run typecheck  # TypeScript type checking (tsc --noEmit)
```

Always run `npm run typecheck` and `npm run lint` after making changes to verify correctness.

## Architecture

- **React 18** with TypeScript strict mode, built with **Vite 5**
- **Tailwind CSS 3** for styling + custom CSS animations in `src/index.css`
- No routing — single-page app with one view
- No state management library — simple `useState` hooks
- No backend or API calls — all data is hardcoded in `src/data/standup-data.ts`
- `@supabase/supabase-js` is listed as a dependency but is **not used** in the codebase

## Key Files

| File | Purpose |
|------|---------|
| `src/App.tsx` | Main component — generation logic, layout, glitch title animation |
| `src/components/StandupOutput.tsx` | Renders generated standup with copy/regenerate buttons |
| `src/components/StandupCard.tsx` | Reusable card component for each standup section |
| `src/components/CrtOverlay.tsx` | CRT visual effects (scanlines, vignette, beam) |
| `src/data/standup-data.ts` | All standup phrases: YESTERDAY, TODAY, BLOCKERS, MOODS arrays |
| `src/utils/glitch.ts` | `glitchText()` and `pickRandom()` utility functions |
| `src/index.css` | Tailwind directives + custom keyframe animations |

## Code Style

- TypeScript strict mode with `noUnusedLocals` and `noUnusedParameters` enabled
- Functional React components only (no class components)
- ESLint 9 flat config with React Hooks and React Refresh plugins
- Tailwind utility classes for styling; custom CSS only for animations
- No semicolons are inconsistently used — follow the style of the file you're editing

## Things to Know

- The app's humor is intentional — satirical corporate jargon is a feature, not a bug
- The CRT overlay effects are purely visual (CSS-based), applied via `CrtOverlay.tsx`
- The glitch effect on the title runs every 3.5 seconds via `setInterval`
- The `pickRandom()` utility is generic and used for all random selections
- Clipboard API (`navigator.clipboard.writeText`) is used for copy functionality
- The color scheme is cyan (#00ffff) on black, with green (#00ff41) and red (#ff0000) accents
