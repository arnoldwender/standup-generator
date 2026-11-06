# standup-generator — contributor notes

## Project

- Humour web app by Arnold Wender (React 18 + Vite + Tailwind + Framer Motion). Public repository; the licence in
  `LICENSE` is deliberate.
- Live: <https://standup-generator.netlify.app>. The Netlify site is **not** connected to GitHub: a merge does not
  deploy. Deploy by hand: `npm run build && netlify deploy --prod --dir=dist`.

## Rules

- **No third-party requests.** Only system fonts; never add Google Fonts or other CDN assets.
- **Legal pages** are static files: `public/impressum/index.html` and `public/datenschutz/index.html`, linked from the
  footer in `src/App.tsx` (readable on purpose). If you add a feature that stores data in the browser or contacts a
  third party, update the Datenschutzerklärung in the same change.
- `localStorage` (`standup-total-count`, `standup-achievements`, `standup-start-date`) is written only after a user
  action (generating a standup, unlocking an achievement), never on page load — no `useEffect` that persists state on
  mount.
