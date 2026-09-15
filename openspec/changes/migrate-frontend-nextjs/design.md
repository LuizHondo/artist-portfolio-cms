## Context

`frontend/` is a Vite + React 18 SPA: react-router-dom for client routing,
zustand (+ localStorage) for admin auth state, axios for all API calls
(public and admin), plain CSS/Tailwind-in-progress for styling. The backend
(`src/**`, Express + Prisma + SQLite) is untouched by this change and keeps
serving `/api/artworks`, `/api/tags`, `/api/admin/*` exactly as today,
defaulting to port 3000 (`.env` → `PORT=3000`).

The design source (Claude Design canvas "Raul Portfolio") ships its pages as
`.jsx` files with large inline `style={{...}}` objects (no CSS classes,
no Tailwind) and its own in-file fake data (`data.jsx`) standing in for the
backend. `.gitignore` already excludes `.next/`, suggesting a Next.js move
was anticipated. See proposal.md for why this change is happening and what
capabilities it introduces.

## Goals / Non-Goals

**Goals:**
- Reproduce the design's *live* prototype pixel-for-pixel: Home (`home-v1`),
  Artwork detail (`project-v2`), About, Links, and the shared `SiteFooter`.
- Wire those pages to the real backend instead of the design's fake data.
- Port the admin console's existing behavior with minimal risk, no new
  visual design.
- Resolve the Next.js/Express dev-port collision without touching the
  backend.

**Non-Goals:**
- Do not implement `home-v2` or `project-v1` — the design canvas's unused
  alternate explorations (confirmed unused: `app.jsx`'s `ROUTES` and
  `DesignCanvas` "live" wiring only reference `HomeV1` and `ProjectV2`).
- Do not implement the design canvas/tweaks-panel/mode-switch machinery
  (`design-canvas.jsx`, `tweaks-panel.jsx`, `ModeSwitch` in `app.jsx`) — that
  is design-authoring tooling, not production UI.
- No backend, schema, or migration changes (see proposal.md — entry sizing
  and social links are both handled without touching the backend).
- No new visual design for the admin console.

## Decisions

**Next.js App Router with Server Components for public pages, Client
Components for admin.**
Public pages (`/`, `/artwork/[slug]`, `/about`, `/links`) are Server
Components that `fetch()` the backend directly at request time — no client
loading state, no waterfall, matches how the design's static mockup reads
(everything present on first paint). Admin pages stay Client Components
since they're inherently interactive (forms, staged edits, auth-gated
navigation) and already assume a JWT + `Authorization` header client flow.
*Alternative considered*: make everything client-rendered like today's SPA —
rejected, it throws away the main benefit of moving to Next.js (fast,
server-rendered public pages) for no gain.

**Fetch public data with `cache: 'no-store'`.**
Content changes whenever the admin edits it, at unpredictable times, on a
low-traffic personal portfolio site. Always-fresh `fetch` calls are simpler
than wiring up on-demand revalidation (`revalidatePath`/tags) for a
capability this proposal doesn't require. *Alternative*: ISR with tag-based
revalidation triggered from the admin's save actions — rejected as
unnecessary complexity for current traffic/update patterns; revisit only if
staleness or backend load becomes a real problem.

**Keep the JWT in a plain (non-httpOnly) cookie, same client-driven auth
flow as today.**
Login still calls `POST /api/admin/login` directly from the browser via
axios and gets a JWT back; the client sets it as a cookie (replacing
`localStorage.setItem`) so Next.js middleware can read it server-side to
gate `/admin/**` routes, while admin mutations keep sending it as
`Authorization: Bearer <token>` exactly like today. *Alternative
considered*: a Next.js API route that proxies login and sets an httpOnly
session cookie — rejected as unnecessary new backend-adjacent surface for a
"port as-is" scope; it would also require introducing server-side session
handling the backend doesn't have today.

**Drop zustand for a small custom `useAuth` hook.**
Auth state is "is there a valid-looking token cookie, and who's the admin"
— a `useState` + cookie read/write pair covers it without a state library.
*Alternative*: keep zustand — rejected, one small piece of client state
doesn't need a dependency once react-router's need for it (persisted store
across route changes outside React tree) goes away with App Router.

**Port design `.jsx` files to `.tsx` largely as-is (inline `style={{}}`
objects), not rewritten as Tailwind utility classes.**
The design's pixel values, gradients, and layout math live in those style
objects; hand-translating hundreds of values into Tailwind class names risks
visual drift from the approved mockup for no functional benefit. Tailwind 4
is still installed (per the requested stack) and used for global resets,
`@theme` font tokens, and the admin console's utility-class styling.
*Alternative*: full Tailwind rewrite of the public pages — rejected, higher
risk for a purely cosmetic-format change.

**Plain `<img>`, not `next/image`, for artwork/cover images.**
`coverImage` and entry `imageUrl` are arbitrary URLs the admin enters (no
fixed set of domains), which is exactly the case `next/image`'s
`remotePatterns` allowlist doesn't fit well without either an overly broad
wildcard or ongoing maintenance. The design's own mockups also use plain
`<img>`. *Alternative*: `next/image` with a wildcard `remotePatterns` —
rejected as effectively disabling the optimization/safety `next/image`
exists for.

**Single `NEXT_PUBLIC_API_URL` env var for the backend base URL**, read by
both Server Components (`fetch`) and Client Components (admin axios calls),
replacing `VITE_API_URL`. One value for both call sites since the API is
public (no secret to protect by hiding it from the client bundle).

**Next.js dev server on port 3001; Express backend stays on 3000.**
`frontend/package.json`'s `dev` script becomes `next dev -p 3001`. The
backend's `.env`/default (`PORT=3000`) is untouched — resolving the
collision entirely on the new project's side keeps this change scoped to
the frontend, per proposal.md's Impact section.

**Route mapping** (design route → App Router path):
| Design | Route |
|---|---|
| `home` | `/` |
| `artwork:<slug>` | `/artwork/[slug]` |
| `about` | `/about` |
| `links` | `/links` |
| (new) | `/admin/login`, `/admin`, `/admin/artworks`, `/admin/artworks/new`, `/admin/artworks/[slug]/edit` |

## Risks / Trade-offs

- **Non-httpOnly cookie for the JWT** is readable by any script on the page
  (same exposure `localStorage` already had today) → not a regression, but
  also not a hardening; acceptable because it matches current risk exactly
  and this proposal is scoped to a framework port, not an auth hardening
  effort.
- **`cache: 'no-store'` means every public-page request hits the backend** →
  acceptable at current traffic; if it becomes a problem, revisit with
  tag-based revalidation from admin save actions rather than defaulting to
  it now.
- **Porting inline-style `.jsx` to `.tsx` by hand** risks transcription
  errors (a mistyped hex value, a dropped style key) → mitigated by tasks.md
  keeping one artwork with entries of every size (`small`/`medium`/`large`)
  in the seed data so every layout branch gets exercised visually during
  implementation.
- **Discarding the uncommitted Tailwind-4 CSS migration already in
  `frontend/`** → that work is superseded, not lost information: the
  Tailwind config choices it made (e.g. `@theme` tokens in `index.css`) can
  still inform the new project's global styles if useful, but the proposal
  treats it as replaced, not merged.

## Migration Plan

No backend data migration. This is a frontend-only cutover:
1. Scaffold the new Next.js app (fresh `frontend/` contents), verified
   against the already-running Express backend (no backend downtime needed).
2. Build out public pages first (no auth dependency), then admin.
3. Remove the old Vite app's files once the new app covers every route the
   old one served.
4. No production deploy pipeline exists in this repo today (no CI config,
   Dockerfile, or hosting config found) — hosting/deploy setup for the new
   Next.js app is out of scope for this change and left to however the site
   is currently deployed manually.

Rollback: revert the commit(s); the backend is never touched, so there is no
data-level rollback concern.
