## 1. Tooling Setup

- [x] 1.1 In `frontend/`, run `npm install -D tailwindcss@^4.3.0 @tailwindcss/postcss@^4.3.0` and verify both packages appear in `frontend/package.json` devDependencies at those versions.
- [x] 1.2 Create `frontend/postcss.config.js` registering `@tailwindcss/postcss`, and verify `npm run dev` in `frontend/` starts without PostCSS errors.

## 2. Base Styles

- [x] 2.1 Rewrite `frontend/src/index.css` to `@import "tailwindcss";` plus an `@theme` block defining `--color-brand-from: #667eea;` and `--color-brand-to: #764ba2;`, plus an `@layer base` block carrying forward only the font-stack and `html, body, #root { height: 100% }` rules that Tailwind Preflight doesn't already provide (per design.md Decisions).
- [x] 2.2 With no component classes converted yet, run the dev server and verify the page still loads (unstyled-by-Tailwind baseline, no console/build errors).

## 3. Layout Component

- [x] 3.1 Convert `frontend/src/components/Layout.tsx` classes (`navbar`, `navbar-container`, `navbar-brand`, `brand-text`, `nav-items`, `btn-login`/`btn-logout`, `main-content`, `footer`) to Tailwind utilities using the `brand-from`/`brand-to` theme tokens for the gradient, and remove the `import './Layout.css'` line.
- [x] 3.2 Verify in the browser (any page, since Layout wraps all routes): navbar gradient, sticky positioning, nav link hover opacity, and login/logout button hover-invert all match current behavior.
- [x] 3.3 Delete `frontend/src/components/Layout.css`.

## 4. Home Page

- [x] 4.1 Convert `frontend/src/pages/HomePage.tsx` classes (hero section, featured grid/cards, filter tag buttons, portfolio grid/cards, loading state, `fadeIn` animation) to Tailwind utilities, including the `md:` breakpoint inversion described in design.md for the 768px responsive rules, and remove the `import './HomePage.css'` line.
- [x] 4.2 Verify in the browser at desktop and <768px widths: hero layout, featured card overlay gradient text, tag button active/hover state, and portfolio card hover-lift/zoom all match current behavior.
- [x] 4.3 Delete `frontend/src/pages/HomePage.css`.

## 5. Artwork Page

- [x] 5.1 Convert `frontend/src/pages/ArtworkPage.tsx` classes (header/meta, summary section, tag pills, process timeline including the centered `::before` line and left/right alternating layout, entry cards, gallery, error state) to Tailwind utilities, using an arbitrary-value shadow for `.marker-circle`'s double ring, and remove the `import './ArtworkPage.css'` line.
- [x] 5.2 Verify in the browser at desktop and <768px widths: timeline alternation and its mobile single-column fallback, marker circle ring, and error-state styling all match current behavior.
- [x] 5.3 Delete `frontend/src/pages/ArtworkPage.css`.

## 6. Admin Pages

- [x] 6.1 Convert `frontend/src/pages/admin/Login.tsx` classes (`login-container`, `login-form-wrapper`, form groups, `btn-submit` gradient/disabled state) to Tailwind utilities.
- [x] 6.2 Convert `frontend/src/pages/admin/Dashboard.tsx` classes (`admin-dashboard` grid, `admin-sidebar`, `admin-menu` active/hover states, `admin-main`) to Tailwind utilities, including the `md:` breakpoint inversion for the sidebar's mobile flex layout.
- [x] 6.3 Convert `frontend/src/pages/admin/Artworks.tsx` classes (`artworks-table`, row hover, `artwork-actions`, `btn-edit`/`btn-delete`/`btn-new`) to Tailwind utilities.
- [x] 6.4 Convert `frontend/src/pages/admin/ArtworkForm.tsx` classes (`artwork-form`, form groups/inputs/textarea/select focus rings, `form-buttons`, `btn-save`/`btn-cancel`, `alert`/`alert-error`/`alert-success`) to Tailwind utilities.
- [x] 6.5 Remove the `import './Admin.css'` line from all four files above once each is converted.
- [x] 6.6 Verify in the browser at desktop and <768px widths: login form, dashboard sidebar/menu (including mobile horizontal layout), artworks table, and artwork form (including validation alert colors and focus rings) all match current behavior.
- [x] 6.7 Delete `frontend/src/pages/admin/Admin.css`.

## 7. Final Verification

- [x] 7.1 Run `grep -rn "\.css'" frontend/src` and verify it only reports `frontend/src/main.tsx`'s `index.css` import (the sole remaining CSS file).
- [x] 7.2 Run `cd frontend && npm run build` and verify the production build (`tsc && vite build`) completes with no type or build errors.
- [x] 7.3 Walk through every route (`/`, `/artwork/:slug`, `/admin/login`, `/admin`, `/admin/artworks`, `/admin/artworks/new`, `/admin/artworks/:id/edit`) in the built/dev app and confirm no visual regression against the pre-migration design.
