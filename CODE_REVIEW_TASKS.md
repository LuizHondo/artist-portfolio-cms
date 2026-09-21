# Code review tasks (from /code-review high)

- [ ] **PublicNav.tsx:122** — restore mobile hamburger menu + `@media (max-width: 760px)` collapse (deleted, nav row now always full-width on phones)
- [ ] **app/about/page.tsx:164** — wrap `await getAbout()` in try/catch (or add error.tsx) so backend outage doesn't hard-crash the About page
- [ ] **about.service.ts:54** — change `getAbout()` from `upsert` to a plain read; public GET shouldn't write on every hit
- [ ] **admin/page.tsx:10** — include featuredPriority 0 (default) artworks in a dashboard tier, or add an "unfeatured" bucket
- [ ] **MorphSlider.jsx:653** — restore `tabIndex={0}` on carousel stage so ArrowLeft/ArrowRight keyboard nav works again
- [ ] **ArtworkForm.tsx:150** — compute `newEntry.displayOrder` from existing entries (max + 1) instead of hardcoding 1
- [ ] **ImageLightbox.tsx:17** — add deps to the tabIndex/role effect (or a `key` on the component in artwork/[slug]/page.tsx) so it reruns on artwork change
- [ ] **schemas.ts:7** — enforce uniqueness on bio/colophon entries, or switch the About page's React keys to index-based
- [ ] **artwork/[slug]/page.tsx:19** — run `getBySlug` + `getArtworks` via `Promise.all`
- [ ] **lib/design/shared.tsx:31** — drop the visibilitychange listener/state added just to silence the ViewTransition warning

## Cut for cap (lower severity)
- [ ] **lib/api/about.ts:6** — reuse `fetchJson<T>()` from `lib/api/artworks.ts` instead of duplicating fetch/res.ok/res.json
- [ ] **admin/page.tsx:56** — memoize the 3x `artworks.filter()` per render (low priority, negligible in practice)
