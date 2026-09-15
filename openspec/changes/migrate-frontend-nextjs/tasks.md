## 1. Scaffold the Next.js project

- [x] 1.1 Scaffold a Next.js 16.3 App Router project in a scratch directory (`npx create-next-app@latest --typescript --tailwind --app --eslint`, then pin `next@^16.3.0`, `react@^19.2.0`, `react-dom@^19.2.0`, `tailwindcss@^4.3.0`, `@tailwindcss/postcss@^4.3.0` in `package.json`) and verify `npm run build` succeeds on the bare scaffold
- [x] 1.2 Set `dev` script to `next dev -p 3001` and verify `npm run dev` serves on port 3001 without colliding with the backend's port 3000
- [x] 1.3 Add `NEXT_PUBLIC_API_URL` to `.env.local` (`http://localhost:3000/api`) and a `.env.example` entry, and verify a Server Component `fetch(process.env.NEXT_PUBLIC_API_URL + '/artworks')` returns data from the running backend
- [x] 1.4 Add `next/font/google` for Gambetta and IBM Plex Sans (matching the design's `@import` fonts) and verify both render in a scratch page

## 2. Shared foundations

- [x] 2.1 Port `shared.jsx` (`Paper`, `MarkText`, `Mascot`, `Icon`, `PlaceholderImg`) to `lib/design/shared.tsx` as typed TSX components and verify each icon name (`instagram`, `artstation`, `linkedin`, `behance`, `youtube`, `mail`, `arrow`, `arrow-left`) renders
- [x] 2.2 Create `lib/social-links.ts` with the hardcoded Instagram/ArtStation/LinkedIn/Behance/YouTube URLs and contact email from the design's `TWEAK_DEFAULTS`, and an `enabledSocials` export used by every page that needs the link list
- [x] 2.3 Port `site-footer.jsx` to `components/SiteFooter.tsx`, sourcing socials/email from `lib/social-links.ts` instead of the design's tweak context, and verify it renders identically to the design mockup with real link hrefs
- [x] 2.4 Create a shared public nav component (Home / Artworks / About, matching `home-v1.jsx`'s `NavV1`) used by Home, Artwork detail, and About
- [x] 2.5 Define the `Artwork`/`ArtworkEntry` TypeScript types matching the backend's actual response shape (reuse the existing `frontend/src/api/artworks.ts` interfaces as the source of truth) in `lib/types.ts`
- [x] 2.6 Add a `lib/api/artworks.ts` server-side fetch module (`getArtworks(tag?)`, `getFeatured()`, `getBySlug(slug)`) calling `NEXT_PUBLIC_API_URL` with `cache: 'no-store'`, and verify each function returns real backend data in a scratch script or page

## 3. Public site: Home (`/`)

- [x] 3.1 Port `home-v1.jsx`'s style objects and hero slideshow (crossfade interval, idle screensaver, slideshow dots) into `app/page.tsx` as a Client Component island (hero) inside a Server Component page shell, using `getFeatured()`/`getArtworks()` for real data instead of `ARTWORKS`
- [x] 3.2 Implement the priority-tiered gallery (tier 1 featured pair, tier 2 mid band, tier 3 archive rail) driven by `featuredPriority`, and verify a seeded artwork at each priority (1/2/3) appears in its matching tier and a priority-0 artwork appears nowhere
- [x] 3.3 Implement the medium filter (client-side filter over already-fetched artworks, matching `home-v1.jsx`'s `filter`/`mediums` logic) and verify selecting a filter narrows all three tiers and an unmatched filter shows the empty state
- [x] 3.4 Verify an empty tier (no seeded artwork at that priority) omits that tier's section instead of rendering empty

## 4. Public site: Artwork detail (`/artwork/[slug]`)

- [x] 4.1 Port `project-v2.jsx`'s style objects and layout into `app/artwork/[slug]/page.tsx` as a Server Component using `getBySlug(slug)`, and call Next's `notFound()` for an unknown slug — verify both a valid and an invalid slug
- [x] 4.2 Implement the entry stream with the size mapping from design.md (`small`→small, `medium`→half, `large`→full) replacing the design's 5-tier `SPAN` table with the 3 values the backend actually returns, sorted by `displayOrder`
- [x] 4.3 Seed (or use existing seed data for) one artwork with entries at all three sizes and out-of-sequence `displayOrder` values, and verify the rendered page shows correct widths and ascending order
- [x] 4.4 Implement the related-artworks and contact-card footer sections using real data and `lib/social-links.ts`

## 5. Public site: About (`/about`) and Links (`/links`)

- [x] 5.1 Port `about.jsx` to `app/about/page.tsx`, sourcing bio/skills copy as local constants (no backend model for this) and social links from `lib/social-links.ts`, and verify the page renders with all enabled links visible
- [x] 5.2 Port `links.jsx` to `app/links/page.tsx` sourcing from `lib/social-links.ts`, and verify each rendered link's `href` matches its configured URL

## 6. Admin: auth foundation

- [x] 6.1 Implement `lib/auth.ts`: cookie read/write helpers for the JWT (replacing `zustand`'s persisted store) and a client-side `useAuth()` hook exposing `isAuthenticated`, `admin`, `login()`, `logout()`
- [x] 6.2 Wire `login()` to `POST {NEXT_PUBLIC_API_URL}/admin/login`, storing the returned token in the cookie on success, and verify a correct login authenticates and an incorrect one surfaces an error without setting the cookie
- [x] 6.3 Add `middleware.ts` protecting `/admin/**` except `/admin/login`, redirecting to `/admin/login` when the auth cookie is absent, and verify an unauthenticated request to `/admin/artworks` redirects without any artwork data being fetched
- [x] 6.4 Create an authenticated axios (or fetch) client in `lib/api/client.ts` attaching `Authorization: Bearer <token>` from the cookie, used by every admin mutation

## 7. Admin: dashboard and artwork list

- [x] 7.1 Port `Dashboard.tsx` to `app/admin/page.tsx`: total/featured counts and recent-artworks table via the authenticated client, and verify counts match the backend and the empty-state message shows with zero artworks
- [x] 7.2 Port `Artworks.tsx` to `app/admin/artworks/page.tsx`: full list with edit links and delete (with confirm), and verify a delete removes the row without a full page reload and persists on refresh

## 8. Admin: artwork create/edit form

- [x] 8.1 Port `ArtworkForm.tsx` to `app/admin/artworks/new/page.tsx` and `app/admin/artworks/[slug]/edit/page.tsx` (or a shared form component parameterized by mode), preserving the existing entry-reconciliation logic (create staged entries for a new artwork; diff loaded vs. current entries by id for an existing one) unchanged
- [x] 8.2 Verify creating a new artwork with two staged entries of different sizes persists both entries, visible on reopening the edit page
- [x] 8.3 Verify editing an existing artwork — changing one entry's size and removing another — persists exactly that state on reload, and that adding an entry without a size selected is blocked

## 9. Cleanup and cutover

- [x] 9.1 Replace `frontend/`'s contents with the new Next.js project (remove `vite.config.ts`, old `src/**`, `index.html`, `react-router-dom`/`zustand`/`vite` deps) and verify `npm run build` and `npm run dev` both succeed from `frontend/`
- [x] 9.2 Manually walk every route (`/`, `/artwork/:slug`, `/about`, `/links`, `/admin/login`, `/admin`, `/admin/artworks`, `/admin/artworks/new`, `/admin/artworks/:slug/edit`) against the running backend and confirm no console errors and no broken navigation link
- [x] 9.3 Run `openspec validate migrate-frontend-nextjs --strict` and fix any reported issues
