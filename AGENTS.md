# AGENTS.md — AI Agent Guidelines

Guidelines for AI agents (Claude Code, Copilot, Cursor, etc.) working on this repository.

## Repository Context

This is a **frontend-only React + TypeScript** satirical web app. It generates humorous standup meeting notes with a retro CRT terminal look. There is no backend, no database, no authentication, and no API calls.

## Before Making Changes

1. Read the relevant source files before editing
2. Run `npm run typecheck` and `npm run lint` after changes
3. Run `npm run build` to verify the production build succeeds

## Coding Conventions

- **Language**: TypeScript with strict mode
- **Components**: Functional components with hooks only
- **Styling**: Tailwind CSS utility classes; custom CSS only in `src/index.css` for animations
- **State**: Plain `useState` — do not introduce state management libraries
- **No class components**, no HOCs, no render props
- **Exports**: Default exports for components, named exports for utilities and data

## Project Boundaries

- This is a humor/satire project — maintain the comedic tone in any new content
- Do not remove or "fix" intentionally satirical text (e.g., "SOUND BUSY. DO NOTHING.")
- The CRT aesthetic is intentional — do not replace it with modern UI patterns
- `@supabase/supabase-js` is an unused dependency — do not write Supabase integration code unless explicitly asked

## File Organization

```
src/
├── components/   # React components (.tsx)
├── data/         # Static data and content arrays (.ts)
├── utils/        # Pure utility functions (.ts)
├── App.tsx       # Root component
├── main.tsx      # Entry point
└── index.css     # Global styles and animations
```

## Adding New Standup Content

To add new standup phrases, edit `src/data/standup-data.ts`:
- Add entries to `YESTERDAY`, `TODAY`, or `BLOCKERS` arrays
- Keep the satirical corporate tone consistent
- New moods go in the `MOODS` array with an emoji, label, and color

## Common Tasks

| Task | How |
|------|-----|
| Add a standup phrase | Edit `src/data/standup-data.ts` |
| Modify visual effects | Edit `src/components/CrtOverlay.tsx` or `src/index.css` |
| Change layout/branding | Edit `src/App.tsx` |
| Add a new component | Create in `src/components/`, import in `App.tsx` |
| Add a utility function | Create in `src/utils/`, use named exports |
