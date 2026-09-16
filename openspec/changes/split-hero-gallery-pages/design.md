## Context

See proposal.md - Why. Today `Hero.tsx` owns both the lockscreen overlay and the idle timer, scoped to `app/page.tsx` where `Gallery` is already mounted underneath it. Splitting Gallery into `/artworks` removes that "already mounted underneath" guarantee, so the overlay/timer need a home that survives client-side navigation: the root layout, which Next.js does not remount on route changes within the app router.

## Goals / Non-Goals

**Goals:**
- Keep the existing overlay visuals/animation (`MorphSlider`, fade-in, scrim) and idle-timeout value unchanged — this is a relocation of logic, not a redesign.
- Make the entry-gate/idle-relock distinction explicit in code, since today both are the same `locked` boolean with no route awareness.

**Non-Goals:**
- No changes to `Gallery.tsx` internals beyond moving it into a new route file.
- No new navigation chrome (`PublicNav`) behavior beyond what `Hero.tsx` already does when unlocked.
- No persistence of unlock state across a hard reload/new tab (matches current behavior: refreshing `/` always re-locks).

## Decisions

**Overlay lives in `app/layout.tsx` via a new `ScreensaverGate` client component, not per-route.**
Alternative considered: keep the overlay in `app/page.tsx` only, and separately re-implement idle-relock inside `/artworks` and `/artwork/[slug]`. Rejected — duplicates the idle-timer/overlay logic across every route, and any future route would need to remember to add it too. A single layout-level component gives every route the screensaver for free.

**`locked` initializes once from `pathname === '/'`, not derived reactively from the current pathname on every navigation.**
Alternative considered: recompute `locked` from `usePathname()` on every render (e.g., `locked = pathname === '/' && neverUnlocked`). Rejected as unnecessary state — a plain `useState(() => window.location.pathname === '/')` initializer captures the "was this a home-route entry" fact once at mount, and lock/unlock afterward is driven entirely by the click and idle-timer events, matching how `locked` already behaves today (a manually toggled boolean, not a derived value).

**Entering navigates (`router.push('/artworks')`); idle re-lock dismissal does not navigate.**
This asymmetry is intentional (confirmed with user): the entry gate's job is to route you into the site, but the screensaver's job is only to get out of the way of wherever you already were. Implemented as: the Enter button's `onClick` calls both `setLocked(false)` and `router.push`; the idle-timer callback and the overlay's dismiss-on-interaction path call only `setLocked(false)`.

**`app/page.tsx` renders no real content of its own.**
Once unlocked, `/` immediately routes to `/artworks` (Enter always does both actions together), so there's no reachable "unlocked and sitting at `/`" state to design a page body for. `app/page.tsx` can render `null` (the gate in the layout covers the visible surface) or a minimal fallback for no-JS.

## Risks / Trade-offs

- [Idle timer duplicated per hard navigation] If a visitor hard-refreshes on `/artworks` mid-session, `ScreensaverGate` remounts and `locked` re-initializes to `false` (since pathname isn't `/`) — the idle timer restarts, which is fine, but any in-flight countdown is lost. → Acceptable: matches today's behavior where a refresh on the single page also reset all client state.
- [Global mount cost] `ScreensaverGate` and its `MorphSlider` mount on every route now, including ones where the overlay is invisible. → `MorphSlider` already only renders its slides when `locked` is true in the current code path; keep that guard so unlocked routes don't pay for slide rendering, only the (cheap) idle-timer effect.

## Migration Plan

1. Extract overlay JSX + idle-timer + scroll-lock effects from `Hero.tsx` into `ScreensaverGate.tsx`.
2. Mount `ScreensaverGate` in `app/layout.tsx` wrapping `{children}`.
3. Create `app/artworks/page.tsx` with `Gallery` + `SiteFooter` moved from `app/page.tsx`.
4. Reduce `app/page.tsx` to a no-op body.
5. Update any `/#gallery` links (Hero's own Enter buttons move into `ScreensaverGate`; check for other references, e.g. nav links) to point at `/artworks`.
6. Manually verify all four spec scenarios (home gate, deep-link skip x2, idle re-lock in place) since idle timing and cross-route persistence aren't easily unit-tested.

No data migration or rollback concerns — this is a client-side presentational change with no persisted state.
