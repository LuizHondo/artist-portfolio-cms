## Why

The frontend styles all of its React views with hand-written, per-page CSS files (`index.css`, `Layout.css`, `HomePage.css`, `ArtworkPage.css`, `Admin.css` — ~1,013 lines total) imported directly into components. This duplicates the same brand gradient, card, button, and spacing values across files with no shared source of truth, and every new component requires writing more bespoke CSS. Moving to Tailwind CSS v4 (utility-first, PostCSS-based) removes that duplication and lets styling live next to markup.

## What Changes

- Add `tailwindcss@^4.3.0` and `@tailwindcss/postcss@^4.3.0` as dev dependencies of the `frontend` package.
- Add `frontend/postcss.config.js` wiring `@tailwindcss/postcss` into the Vite build (Tailwind v4 has no `tailwind.config.js`/`content` step — it scans automatically).
- Replace `frontend/src/index.css` global reset with a single `@import "tailwindcss";` entry point, re-expressing the previous global resets (box-sizing, base font stack, `html/body/#root` height, link/heading defaults) as `@layer base` rules so behavior is unchanged.
- Rewrite every component's class-based styling as Tailwind utility classes directly in JSX, matching current visual output pixel-for-pixel (colors, spacing, gradients, shadows, radii, the 768px responsive breakpoint):
  - `frontend/src/components/Layout.tsx` (drops `Layout.css`)
  - `frontend/src/pages/HomePage.tsx` (drops `HomePage.css`)
  - `frontend/src/pages/ArtworkPage.tsx` (drops `ArtworkPage.css`)
  - `frontend/src/pages/admin/Login.tsx`, `Dashboard.tsx`, `Artworks.tsx`, `ArtworkForm.tsx` (drop shared `Admin.css`)
- Delete the now-unused `Layout.css`, `HomePage.css`, `ArtworkPage.css`, `Admin.css` files and their imports.
- The repeated brand gradient (`#667eea` → `#764ba2`) becomes a small set of reusable Tailwind utility combinations (e.g. `bg-gradient-to-br from-[#667eea] to-[#764ba2]`) rather than a new abstraction layer — no theme/config indirection is introduced beyond what Tailwind v4's CSS-based `@theme` needs.
- No visual, layout, or behavioral changes are intended — this is a styling-implementation swap only.

## Capabilities

No spec-level requirements change: this is a pure frontend styling/tooling migration with no intended change in observable application behavior. `skip_specs: true` is set in this change's `.openspec.yaml`.

### New Capabilities
(none)

### Modified Capabilities
(none)

## Impact

- **Dependencies**: adds `tailwindcss`, `@tailwindcss/postcss` to `frontend/package.json` devDependencies. No backend/root `package.json` changes (Tailwind only applies to the Vite frontend).
- **Build**: new `frontend/postcss.config.js`; Vite already runs PostCSS automatically, so no `vite.config.ts` change is required.
- **Code**: all 5 frontend `.css` files (`index.css` rewritten, the other 4 deleted) and all 8 components/pages that import them (`Layout.tsx`, `HomePage.tsx`, `ArtworkPage.tsx`, `Login.tsx`, `Dashboard.tsx`, `Artworks.tsx`, `ArtworkForm.tsx`, plus `main.tsx`'s `index.css` import stays but its contents change).
- **Risk**: manual JSX-by-JSX class conversion risks small visual drift; mitigated by keeping a side-by-side visual check against current rendering as the acceptance bar (see tasks.md).
