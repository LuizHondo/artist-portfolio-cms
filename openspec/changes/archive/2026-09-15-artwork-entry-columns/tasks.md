## 1. Schema expand

- [x] 1.1 Add `ArtworkEntryImage` model to `prisma/schema.prisma` (`id`, `entryId` FK with `onDelete: Cascade`, `position` Int, `url`, `title`, `description`, `@@unique([entryId, position])`) and a nullable `columns` Int on `ArtworkEntry`; generate the migration and verify `prisma migrate dev` applies cleanly against a copy of the current dev database without touching existing `size`/`imageUrl`/`title`/`description` columns
- [x] 1.2 Run `prisma generate` and verify the generated client exposes `ArtworkEntry.images` and the `entryId_position` composite key

## 2. Backfill and verify

- [x] 2.1 Write a one-off backfill script that, for every existing `ArtworkEntry`, sets `columns = 1` and creates one `ArtworkEntryImage` at `position = 1` copying that entry's `imageUrl`/`title`/`description`; run it against dev data and verify every entry ends up with `columns = 1` and exactly one matching image
- [x] 2.2 Verify no `ArtworkEntry` is left with `columns IS NULL` after the backfill, matching the "Existing entries remain valid after migration" spec requirement

## 3. Schema contract

- [x] 3.1 Add a follow-up migration dropping `size`, `imageUrl`, `title`, `description` from `ArtworkEntry` and making `columns` `NOT NULL`; verify the migration only runs after 2.1/2.2 pass and that `prisma migrate dev` applies without error

## 4. Backend validation and services

- [x] 4.1 Replace `size` in `ArtworkEntrySchema` (`src/shared/schemas.ts`) with `columns: z.number().int().min(1).max(5)` and an `images: z.array(imageSchema).min(1).max(5)` field, where `imageSchema` requires `url` (`.url()`), `title`, `description`; add a refinement rejecting the payload when `images.length !== columns`; verify with unit tests covering: missing `columns`, `columns` out of 1-5 range, image count mismatch, empty images array, incomplete image
- [x] 4.2 Update `ArtworkService.createEntry`/`updateEntry` (`src/modules/artworks/artwork.service.ts` or equivalent) to create/replace an entry's images: on create, nested-create the `images` array with sequential `position`; on update, replace images via `deleteMany` + `create` inside a single `$transaction`; verify with a test that updating an entry with fewer images than before leaves exactly the new count in storage
- [x] 4.3 Add nested per-image routes (`GET/POST /admin/entries/:entryId/images`, `GET/PATCH/DELETE /admin/entries/:entryId/images/:position`) to `admin.routes.ts`/`admin.controller.ts`, with `:position` validated via `z.coerce.number().int().min(1).max(5)`; on delete, renumber remaining images' positions (decrement those after the deleted position) inside a `$transaction` to keep positions contiguous; map Prisma `P2025` to 404 and `P2002` to 409; verify with a test that deletes a middle position and confirms the remaining images are renumbered 1..N-1
- [x] 4.4 Ensure entry read paths (public and admin) return `images` ordered by `position asc`; verify with a test fetching an artwork with a 3-column entry and asserting image order matches the stored positions

## 5. Seed data

- [x] 5.1 Update `src/database/seed.ts` to seed entries using `columns`/`images` instead of `size`/`imageUrl`; verify `npm run seed` (or equivalent) completes and the resulting entries pass the schema from 4.1

## 6. Public rendering

- [x] 6.1 Remove the `SPAN` lookup and `startsRun` row-packing logic from `frontend/components/artwork/artworkStyles.ts` and `frontend/app/artwork/[slug]/page.tsx`; replace with a per-entry render that maps each entry's `images` to elements at `100% / columns` width; verify visually in the browser that a 1/2/3/4/5-column entry renders at full/half/third/quarter/fifth width respectively
- [x] 6.2 Update `frontend/lib/types.ts` `ArtworkEntry` type to drop `imageUrl`/`title`/`description`/`size` and add `columns: number` and `images: { url: string; title: string; description: string }[]`

## 7. Admin form

- [x] 7.1 Replace the `size` `<select>` in `frontend/components/admin/ArtworkForm.tsx` with a `columns` count control (1-5); verify selecting each value updates local state
- [x] 7.2 Render image-slot rows (url/title/description fields) dynamically based on `columns` — row N visible only when `columns >= N`; verify in the browser that increasing columns adds rows and decreasing columns immediately removes rows beyond the new count, discarding their in-progress values
- [x] 7.3 Update `handleSubmit`'s entry reconciliation (`entryFieldsChanged`, create/update/delete against `originalEntries`) to compare and submit the full `images` array per entry instead of `size`/`imageUrl`; verify by editing an existing entry's column count and images, saving, and confirming the persisted entry matches the form state
- [x] 7.4 Update `frontend/lib/api/admin-artworks.ts` `createEntry`/`updateEntry` types (`Partial<ArtworkEntry>`) to match the new `ArtworkEntry` shape from 6.2

## 8. End-to-end verification

- [x] 8.1 Manually create a new artwork with a 1-column, a 2-column, and a 3-column entry in the admin UI, save, and verify the public artwork page renders each at full/half/third width with correct per-image captions
- [x] 8.2 Manually open an artwork migrated from the old model and verify its entry renders as a single full-width image with its original title/description intact
