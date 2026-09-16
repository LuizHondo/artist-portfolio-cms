## Why

An artwork entry today holds exactly one image, classified by a `size`
(`small`/`medium`/`large`) that only controls its grid width. Multiple
same-size entries visually pack into a row through incidental CSS
grid-packing (`startsRun`), not because they are actually related in the
data — there is no way for an admin to deliberately register a set of images
as one row. This change replaces `size` with an explicit `columns` count
(1-5) and a real one-to-many image relation, so a row's image count and
width are a single, admin-controlled decision instead of an emergent layout
side effect.

## What Changes

- **BREAKING**: `ArtworkEntry.size` (`small`/`medium`/`large`) is removed.
  Replaced by `ArtworkEntry.columns` (integer, 1-5), where column width is
  `100% / columns` (1 = full width, 2 = half each, ... 5 = fifth each).
- **BREAKING**: `ArtworkEntry.imageUrl` / `title` / `description` move off
  the entry and onto a new child, `ArtworkEntryImage` (`entryId`, `position`
  1..columns, `url`, `title`, `description`), so each image in a
  multi-column row gets its own caption. `@@unique([entryId, position])`,
  cascade delete from the parent entry.
- Entry image count SHALL always equal `columns` (min 1, max 5), enforced by
  validation, not a database constraint.
- Nested per-image REST endpoints are added
  (`GET/POST /entries/:entryId/images`,
  `GET/PATCH/DELETE /entries/:entryId/images/:position`) alongside the
  existing whole-artwork save flow, which is extended to reconcile images
  the same way it already reconciles entries.
- Public artwork page rendering replaces the `size` -> grid-span lookup
  (`SPAN`) and the `startsRun` row-packing hack with a direct
  `100% / columns` width per image.
- Admin entry form replaces the size `<select>` with a columns count
  control; image-slot rows appear dynamically as columns increases, and
  reducing columns immediately, destructively truncates any slots beyond
  the new count (their unsaved data is discarded, not preserved for later).
- Existing data migrates losslessly: every current `ArtworkEntry` becomes
  `columns: 1` with its existing `imageUrl`/`title`/`description` moved into
  one `ArtworkEntryImage` at position 1. No attempt is made to re-group
  historical `small`/`medium` entries into multi-column rows.
- Admin artworks list table is unchanged — it already shows only entry
  count, not size, and that remains sufficient.
- Seed data (`src/database/seed.ts`) is updated to the new shape.

## Capabilities

### New Capabilities
- `artwork-entries`: how an artwork's process entries are created, updated,
  and deleted, including each entry's `columns` count and its ordered set
  of 1-5 images. No baseline exists in `openspec/specs/` yet (nothing has
  been archived to date), so this is written as a new capability rather
  than a delta. It supersedes the requirements proposed in the unarchived
  change `add-artwork-entry-size`, whose `size`-based requirements for this
  same capability name are fully replaced by this change.

### Modified Capabilities
(none)

## Impact

- **Schema/migration**: `prisma/schema.prisma` (`ArtworkEntry`, new
  `ArtworkEntryImage`), a new Prisma migration performing the expand
  (add table/column) + backfill (move existing image data) + contract
  (drop `size`/`imageUrl`/`title`/`description` from `ArtworkEntry`).
- **Backend**: `src/shared/schemas.ts` (Zod schemas), `src/modules/artworks/*`
  (service/controller), `src/modules/admin/*` (routes/controller for nested
  image CRUD), `src/database/seed.ts`.
- **Frontend**: `frontend/lib/types.ts`, `frontend/lib/api/admin-artworks.ts`,
  `frontend/components/admin/ArtworkForm.tsx`,
  `frontend/components/artwork/artworkStyles.ts`,
  `frontend/app/artwork/[slug]/page.tsx`.
- **No impact**: `frontend/app/admin/artworks/page.tsx` (list table),
  artwork-level fields (`coverImage`, `title`, `medium`, `year`,
  `featuredPriority`).
