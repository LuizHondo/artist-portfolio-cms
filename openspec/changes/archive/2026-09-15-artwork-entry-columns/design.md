## Context

See proposal.md - Why. Today `ArtworkEntry` has `imageUrl`, `title`,
`description`, and `size: String @default("medium")` (SQLite has no native
enum, so `size` is a plain column validated only by
`ArtworkEntrySchema` in `src/shared/schemas.ts`). The public artwork page
(`frontend/app/artwork/[slug]/page.tsx`) maps `size` to a 12-column CSS
grid span via a `SPAN` lookup in `frontend/components/artwork/artworkStyles.ts`,
and special-cases runs of consecutive `small` entries (`startsRun`) so they
visually pack 3-to-a-row. That packing is coincidental — nothing in the data
groups those entries together. The admin form (`ArtworkForm.tsx`) reconciles
entries against `originalEntries` by id (create/update/delete) on save, with
no transaction and no batch endpoint.

## Goals / Non-Goals

**Goals:**
- Make row image count and width an explicit, admin-set decision (`columns`,
  1-5) instead of an emergent effect of matching sizes.
- Store per-image title/description so a multi-image row can caption each
  image individually.
- Preserve all existing entry data through the schema change with no manual
  re-authoring required.

**Non-Goals:**
- Reordering or re-grouping historical `small`/`medium` entries into
  multi-column rows — migration is 1-to-1 (see Migration Plan).
- Changing artwork-level fields, the admin artworks list table, or the
  overall page layout beyond how one entry's images are sized.
- Supporting images per column beyond 1 (e.g. a 2-column entry with 4
  images) — that was considered and explicitly rejected during scoping in
  favor of columns directly bounding image count.

## Decisions

**Child table (`ArtworkEntryImage`) over a JSON column on `ArtworkEntry`.**
Per-image `title`/`description` requires structured, queryable records.
SQLite/Prisma can't validate or partially update a JSON blob's shape, and it
would break the existing pattern of app-validated scalar columns (as `size`
already was). A child table keeps images individually addressable,
consistent with how the rest of the schema models one-to-many relations.

```
ArtworkEntry
  id, artworkId, columns (Int, 1-5), displayOrder, createdAt, updatedAt
  images: ArtworkEntryImage[]

ArtworkEntryImage
  id, entryId (FK, onDelete: Cascade), position (Int, 1..columns),
  url, title, description
  @@unique([entryId, position])
```

`position` is addressed via the generated composite key `entryId_position`
for per-item routes. No DB `CHECK` constraint bounds `columns` or
`position` — consistent with the existing `size` column, bounds are
enforced by Zod (`z.array(imageSchema).min(1).max(5)`, plus an app-level
check that `images.length === columns`) and checked before writing.

**Columns range 1-5, width = 100% / columns.** Chosen over keeping the
three fixed tiers (small/medium/large) because the requirement is now
"N images share this row evenly," not "pick from named sizes." This
subsumes small/medium/large as columns 3/2/1 respectively and adds 4 and 5
without inventing new named tiers.

**Full-form save extended, not replaced.** The existing
`ArtworkForm.tsx` reconciliation (diff entries against `originalEntries` by
id, sequential `createEntry`/`updateEntry`/`deleteEntry` calls, first error
stops the batch) is extended so each entry's payload carries its full
`images` array; the backend replaces an entry's images wholesale on update
(`deleteMany` + `create` inside the entry's own transaction) rather than
diffing image-by-image, since images have no independent identity the admin
form needs to preserve across a save (unlike entries, which persist ids
across edits). Per-position nested routes are added alongside this for
future/direct API use but the admin form continues to use the whole-artwork
save path.

**Destructive column-decrease is form-local, not a soft-delete.** Reducing
`columns` from 3 to 1 while editing removes slots 2 and 3 from the
in-browser form state immediately; nothing is sent to the backend until
Save, and Save then persists whatever the final `images` array looks like.
No separate "restore" affordance — this matches the requirement that
increasing columns again starts those slots empty.

**Rendering: replace `SPAN` + `startsRun` with direct width division.**
Since grouping is now real (one entry's `images` are meant to sit together),
the page no longer needs to guess run boundaries from adjacent entries'
sizes. Each entry renders its own `images.length` (== `columns`) images at
`100% / columns` width in sequence, removing the cross-entry `startsRun`
logic entirely.

## Risks / Trade-offs

- **[Risk]** Migration touches every existing `ArtworkEntry` row and drops
  columns (`size`, `imageUrl`, `title`, `description`) from that table →
  **Mitigation**: sequenced as expand (add `columns` + `ArtworkEntryImage`
  table) → backfill (copy each entry's existing image data into one
  `ArtworkEntryImage` row, set `columns = 1`) → verify → contract (drop the
  old columns) as separate migration steps, so the backfill can be verified
  before the old data is removed. See Migration Plan.
- **[Risk]** Public API responses change shape (`size`/`imageUrl` fields
  disappear, `columns`/`images` appear), breaking any external consumer of
  the artworks API → **Mitigation**: this is a portfolio CMS with one known
  frontend consumer in this same repo, updated in this change; documented
  as a **BREAKING** change in the proposal.
- **[Risk]** Whole-array image replacement on update (`deleteMany` +
  `create`) means a partial failure mid-request could leave an entry
  temporarily without images → **Mitigation**: wrap the entry's image
  replacement in a single Prisma `$transaction` so it is all-or-nothing.

## Migration Plan

1. **Expand**: add `ArtworkEntryImage` table and `ArtworkEntry.columns`
   (nullable or defaulted temporarily) via Prisma migration; old
   `size`/`imageUrl`/`title`/`description` columns remain in place.
2. **Backfill**: for every existing `ArtworkEntry`, set `columns = 1` and
   create one `ArtworkEntryImage` at `position = 1` copying that entry's
   `imageUrl`/`title`/`description`.
3. **Verify**: confirm every `ArtworkEntry` has `columns = 1` and exactly
   one associated `ArtworkEntryImage` whose fields match the original
   entry's data (per the "Existing entries remain valid after migration"
   spec requirement) before proceeding.
4. **Contract**: drop `size`, `imageUrl`, `title`, `description` from
   `ArtworkEntry` and make `columns` required (`NOT NULL`), in a follow-up
   migration once step 3 is confirmed.
5. **Rollback**: steps 1-3 are additive and reversible (drop the new table
   and column). Step 4 is destructive — do not run it until the application
   code reading/writing the new shape has been verified against the
   backfilled data; rolling back after step 4 requires restoring from a
   pre-contraction backup, not fully reversing the migration.

## Open Questions

None — the material decisions (column range, storage shape, image
captioning granularity, migration data mapping, and admin form truncation
behavior) were resolved during exploration and are captured above.
