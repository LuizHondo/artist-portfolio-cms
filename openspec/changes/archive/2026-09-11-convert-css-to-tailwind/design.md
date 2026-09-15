## Context

The frontend is Vite + React 18 + TypeScript (`frontend/`), built with `tsc && vite build`, no existing PostCSS config. Styling today is 5 plain CSS files (~1,013 lines) imported per-component (see proposal.md). The user specified exact package versions to install: `tailwindcss@^4.3.0` and `@tailwindcss/postcss@^4.3.0` — the PostCSS-plugin integration path, not Tailwind's dedicated `@tailwindcss/vite` plugin. Tailwind v4 has no `tailwind.config.js`/`content` globs step; it auto-detects template files and is configured via CSS `@theme`.

## Goals / Non-Goals

**Goals:**
- Wire Tailwind v4 into the existing Vite build via PostCSS only (per the requested package set), with no visual regressions.
- Replace all 5 CSS files with Tailwind utility classes in JSX, keeping current colors, spacing, radii, shadows, and the single 768px responsive breakpoint.
- Consolidate the repeated brand gradient (`#667eea` → `#764ba2`) into one reusable Tailwind theme token pair instead of repeating the hex pair in every gradient utility.

**Non-Goals:**
- No visual redesign, no new components, no design-token system beyond the brand colors.
- No `tailwind.config.js` (not needed for v4's CSS-first config) and no `@tailwindcss/vite` plugin (not requested).
- No CSS-in-JS or component library adoption.

## Decisions

- **PostCSS plugin over Vite plugin**: add `frontend/postcss.config.js` with `plugins: { '@tailwindcss/postcss': {} }`, matching the exact packages the user specified. Vite already runs PostCSS on every processed file automatically, so no `vite.config.ts` change is needed. Alternative considered: `@tailwindcss/vite` (Tailwind's recommended Vite integration) — not used since it wasn't the package set requested.
- **CSS-first `@theme` config, no `tailwind.config.js`**: `frontend/src/index.css` becomes `@import "tailwindcss";` plus an `@theme` block defining `--color-brand-from: #667eea;` and `--color-brand-to: #764ba2;`. This turns every current `linear-gradient(135deg, #667eea 0%, #764ba2 100%)` occurrence into `bg-gradient-to-br from-brand-from to-brand-to`, matching Tailwind v4's convention (theme keys become utility values automatically) without a separate config file.
- **Preserve only non-redundant global resets**: Tailwind's Preflight (bundled with `@import "tailwindcss"`) already zeroes margins and sets `box-sizing: border-box`. Only rules Preflight doesn't cover — the custom system-font stack and `html, body, #root { height: 100% }` — are kept, moved into an `@layer base` block in `index.css`. The current heading/paragraph resets (`font-weight`, `line-height`) are dropped because Preflight already neutralizes them and every heading gets an explicit Tailwind text utility at its call site.
- **Direct one-to-one class translation, file by file**: convert `Layout.css` → `Layout.tsx`, `HomePage.css` → `HomePage.tsx`, `ArtworkPage.css` → `ArtworkPage.tsx`, `Admin.css` → each of its 4 consumers, in that order, deleting each `.css` file and its import immediately after its consumer(s) are converted and visually checked. Alternative considered: convert everything then delete all CSS at once — rejected, since a mid-migration diff would be harder to bisect if a page regresses.
- **`md:` breakpoint reuse**: Tailwind's default `md` breakpoint is `768px`, which exactly matches every `@media (max-width: 768px)` block in the current CSS. Note the current rules are max-width (mobile override under 768px) while Tailwind's `md:` is min-width (desktop override at/above 768px) — so the conversion inverts each rule: write the mobile-first (unprefixed) utility as today's `@media` value and the `md:`-prefixed utility as today's base (desktop) value.

## Risks / Trade-offs

- [Manual JSX-by-JSX conversion drifts visually from the current design] → Mitigate by converting and comparing one page/component at a time against the running dev server before deleting its source `.css` file, per the migration plan above.
- [Arbitrary values still needed for a few one-off numbers (e.g. `min-height: calc(100vh - 200px)`, `max-height: 400px`) that don't map to Tailwind's default scale] → Use Tailwind's bracket arbitrary-value syntax (`min-h-[calc(100vh-200px)]`) inline rather than inventing new theme tokens for single-use values.
- [`box-shadow: 0 0 0 4px white, 0 0 0 6px #667eea` on `.marker-circle` is a multi-layer shadow with no direct Tailwind utility] → Express as an arbitrary `shadow-[...]` value carrying the same two layers.

## Migration Plan

1. Install `tailwindcss@^4.3.0` and `@tailwindcss/postcss@^4.3.0` into `frontend/package.json` devDependencies; add `frontend/postcss.config.js`.
2. Rewrite `frontend/src/index.css` to the Tailwind import + `@theme` + trimmed `@layer base` (see Decisions). Run `npm run dev` in `frontend/` and confirm the app still renders (Tailwind with zero utility classes yet applied should look like today's reset, minus per-element typography).
3. Convert `Layout.tsx`/`Layout.css`, then `HomePage.tsx`/`HomePage.css`, then `ArtworkPage.tsx`/`ArtworkPage.css`, then the 4 admin pages sharing `Admin.css`, checking each in the browser before deleting its `.css` file and import.
4. Delete `Layout.css`, `HomePage.css`, `ArtworkPage.css`, `Admin.css` once their last consumer is converted.
5. Rollback: since each step is an isolated commit-sized unit (one file pair at a time) with the old `.css` file removed only after conversion, reverting any single step to plain CSS is a single-file `git checkout` of that step's commit — no cross-file rollback coordination needed.
