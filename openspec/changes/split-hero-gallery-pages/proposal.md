## Why

Hero and Gallery currently live on one page (`app/page.tsx`): Hero is a full-viewport lockscreen overlay stacked on top of Gallery, and "unlocking" is a client-state toggle, not navigation. The gallery needs to become a real, separate, linkable page (`/artworks`), which breaks that assumption — the overlay can no longer rely on the gallery already being mounted underneath it.

## What Changes

- Extract the lockscreen overlay (MorphSlider, name/socials, "Enter Portfolio Site", idle timer, scroll-lock) out of `Hero.tsx` into a new client component (`ScreensaverGate`) mounted in `app/layout.tsx`, so it persists across route navigation instead of being scoped to one page.
- Add `app/artworks/page.tsx`, moving `Gallery` + `SiteFooter` out of `app/page.tsx`.
- `app/page.tsx` (`/`) becomes the entry gate only: locked on load, "Enter Portfolio Site" unlocks and navigates (`router.push('/artworks')`) instead of just toggling local state.
- Idle-triggered re-lock becomes route-agnostic: once unlocked (from any entry point), the idle timer runs on every route, and firing re-shows the overlay in place without navigating away from the current page.
- Direct/deep links to `/artworks` or `/artwork/[slug]` skip the initial lockscreen (`locked` state initializes from `pathname === '/'` at mount, evaluated once) — only visitors landing on `/` see the gate.
- **BREAKING**: Gallery is no longer reachable via `/#gallery` anchor scroll; it is now `/artworks`, a distinct route.

## Capabilities

### New Capabilities
- `screensaver`: Site-wide lockscreen/idle-relock behavior — initial entry gate on `/`, idle-timeout re-lock on any route, and unlock behavior (click-to-enter with navigation, idle re-lock without navigation).

### Modified Capabilities
(none — `artwork-entries` is unaffected; this change is presentation/navigation only)

## Impact

- `frontend/components/home/Hero.tsx` — overlay JSX/logic moves out; file likely deleted or reduced to nothing once `ScreensaverGate` absorbs its responsibilities.
- `frontend/app/layout.tsx` — gains `<ScreensaverGate>` wrapping `{children}`.
- `frontend/app/page.tsx` — shrinks to the entry-gate route; no longer renders `Gallery`/`SiteFooter`.
- `frontend/app/artworks/page.tsx` — new route, owns `Gallery` + `SiteFooter`.
- Any internal links pointing at `/#gallery` need updating to `/artworks`.
