## 1. Extract ScreensaverGate

- [x] 1.1 Create `frontend/components/ScreensaverGate.tsx` as a client component, moving the overlay JSX (MorphSlider, name/socials block, "Enter Portfolio Site" button, scrim, fade-in) out of `Hero.tsx` verbatim, and verify it renders standalone with a hardcoded `slides` prop
- [x] 1.2 Move the scroll-lock effect (`root`/`body` overflow toggle on `locked`) into `ScreensaverGate` and verify body scroll is disabled while the overlay is shown
- [x] 1.3 Move the idle-timer effect into `ScreensaverGate`, keeping the 5-minute timeout and the same event list (`mousemove`, `mousedown`, `keydown`, `wheel`, `touchstart`), and verify via a shortened timeout in local testing that inactivity re-locks
- [x] 1.4 Initialize `locked` from `useState(() => typeof window !== 'undefined' && window.location.pathname === '/')` (evaluated once, not reactive to later navigation) and verify mounting on `/artworks` starts unlocked while mounting on `/` starts locked

## 2. Wire entry vs. idle-relock behavior

- [x] 2.1 Import `useRouter` from `next/navigation` in `ScreensaverGate` and make the "Enter Portfolio Site" click handler call both `setLocked(false)` and `router.push('/artworks')`, and verify clicking it from `/` navigates to `/artworks` with the overlay gone
- [x] 2.2 Ensure the idle-timer callback and any interaction-based unlock path only call `setLocked(false)` (no navigation), and verify triggering idle re-lock on a non-`/` route and dismissing it leaves the URL and scroll position unchanged

## 3. Mount the gate at the layout level

- [x] 3.1 Add `<ScreensaverGate>{children}</ScreensaverGate>` (or equivalent wrapping) to `frontend/app/layout.tsx` and verify the app still renders on `/`, `/artworks`, and an artwork detail page
- [x] 3.2 Confirm `PublicNav` still renders correctly when unlocked (matches today's "Hero unmounts, nav renders standalone" behavior) and verify nav is visible on `/artworks` after entering from `/`

## 4. Split the routes

- [x] 4.1 Create `frontend/app/artworks/page.tsx` containing the `Gallery` + `SiteFooter` markup currently in `frontend/app/page.tsx`, fetching artworks the same way, and verify `/artworks` renders the gallery when visited directly
- [x] 4.2 Reduce `frontend/app/page.tsx` to a minimal body (no `Gallery`/`SiteFooter`) since the visible surface at `/` is now fully owned by `ScreensaverGate`, and verify `/` no longer renders gallery content once unlocked
- [x] 4.3 Delete `frontend/components/home/Hero.tsx` once its logic has fully moved to `ScreensaverGate`, and verify no remaining imports reference it (`grep -r "components/home/Hero"`)
- [x] 4.4 Update any `href="#gallery"` or `/#gallery` references elsewhere in the app to point at `/artworks`, and verify via grep that no `#gallery` references remain

## 5. Verify against spec scenarios

- [x] 5.1 Manually verify all scenarios in `specs/screensaver/spec.md`: entry gate on `/`, skip on direct `/artworks` and `/artwork/[slug]` visits, Enter navigates to `/artworks`, idle re-lock fires on both `/artworks` and an artwork detail page, dismissing an idle re-lock stays in place
- [x] 5.2 Run the existing test suite (`npm test` in `frontend/`) and verify no regressions from the Hero/Gallery move
