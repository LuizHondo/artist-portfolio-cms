## Why

The current frontend (Vite + React 18 SPA, react-router-dom, zustand, mostly
unstyled/utilitarian pages) does not reflect the editorial/sketchbook visual
design commissioned for the site (Claude Design canvas "Raul Portfolio",
project `7a5388f7-160d-4f80-9fe0-107584a9e6e5`). That design's live prototype
defines the actual public-facing site — an editorial gallery homepage, a
sketchbook-journal artwork detail page, an about page, and a links page — and
needs to become the real frontend, talking to the existing Express/Prisma
backend instead of the design tool's in-file fake data.

## What Changes

- Replace the existing Vite + React 18 + react-router-dom frontend with a new
  Next.js 16.3 (App Router) + React 19.2 + Tailwind 4.3 project. **BREAKING**:
  `frontend/` is fully replaced — its build tooling (Vite), routing
  (react-router-dom), and client global-state library (zustand) are dropped.
- Implement the public site to match the design's *live* prototype (the
  routes actually wired in the canvas's `app.jsx`, not the unused `home-v2`
  and `project-v1` alternates that only exist for side-by-side comparison in
  the design canvas):
  - Home — editorial gallery: hero slideshow, filter-by-medium grid, tiered
    layout driven by `featuredPriority` (1 = featured pair, 2 = mid band, 3 =
    archive rail).
  - Artwork detail — sketchbook-journal layout: cover plate, metadata block,
    an entry stream laid out by each entry's image size, related artworks,
    contact card.
  - About — two-column bio/skills/colophon page.
  - Links — standalone linktree-style page.
  - Shared nav and the brutalist-editorial site footer used across all pages.
- Data fetching moves from the axios + zustand client pattern to Next.js
  server-side fetches against the existing `GET /api/artworks`,
  `/api/artworks/featured`, `/api/artworks/:slug`, and `/api/tags` endpoints
  (no backend API changes).
- Port the admin console (login, dashboard, artwork list, artwork
  create/edit form with entry management) to Next.js routes with the same
  behavior as today, styled with plain Tailwind utility classes — the design
  canvas has no admin mockups, so no new visual design is introduced there.
  Client-side auth (JWT bearer token) is preserved; the zustand store is
  replaced with a lighter mechanism appropriate to Next.js (see design.md).
- Social links (Instagram, ArtStation, LinkedIn, Behance, YouTube) and the
  contact email are hardcoded as frontend constants, matching how the design
  models them — no new backend model or admin UI for editing them.
- Artwork entries keep the existing backend `size` enum
  (`small` | `medium` | `large`, added in the in-flight `add-artwork-entry-size`
  change) with no schema change; the new layout maps it to 3 of the design's
  5 image-size tiers (`small`→small, `medium`→half, `large`→full). `wide` and
  `tall` are not reachable from admin-entered data.
- Supersedes the in-progress, uncommitted Tailwind-4 migration already sitting
  in `frontend/` (working tree has partial CSS→Tailwind conversion) — that
  work is replaced wholesale by the Next.js rewrite rather than built on.

## Capabilities

### New Capabilities
- `public-site`: the marketing/portfolio pages a visitor sees — home gallery,
  artwork detail, about, links, and the shared nav/footer — sourced from the
  live backend data.
- `admin-console`: authenticated CMS pages for managing artworks and their
  process entries (login, dashboard, artwork list, artwork create/edit
  form), functionally equivalent to the current admin UI.

### Modified Capabilities
(none — no existing capability specs predate this change; both areas above
are undocumented today even though `admin-console` behavior itself is not
changing)

## Impact

- `frontend/` — entirely replaced: `package.json`, `vite.config.ts`,
  `index.html`, `tsconfig*.json`, all of `src/**` removed and replaced with a
  Next.js App Router project (new `package.json`, `next.config.*`,
  `app/**`, `postcss.config.js`/Tailwind 4 config).
- New dependencies: `next@^16.3.0`, `react@^19.2.0`, `react-dom@^19.2.0`,
  `tailwindcss@^4.3.0`, `@tailwindcss/postcss@^4.3.0`. Dropped:
  `react-router-dom`, `zustand`, `vite`, `@vitejs/plugin-react`. `axios` is
  reused only where the admin console still needs an imperative client-side
  HTTP call (login, form submits); server-rendered pages use `fetch`.
- Backend (`src/**`, `prisma/schema.prisma`): no changes. Existing
  `/api/artworks`, `/api/tags`, `/api/admin/*` routes are reused as-is.
- Local dev: Next.js's default dev port (3000) collides with the existing
  Express server's default port (3000) — needs a resolution (documented in
  design.md) since both will run locally at once.
- `openspec/changes/add-artwork-entry-size`: this change depends on that
  work's backend/admin pieces already being in place (they are, though
  uncommitted) — no further action on it from here.
