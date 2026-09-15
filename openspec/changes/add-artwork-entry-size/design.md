## Context

`ArtworkEntry` (table `artwork_entries`) currently has no size-related field.
The DB is SQLite via Prisma, which has no native enum support, so any
constrained-value field must be a `String` column validated at the
application layer (the codebase already does this for `featuredPriority`,
which is a plain `Int` rather than an enum). See proposal.md for motivation.

Separately, `ArtworkForm.tsx`'s entry management (`handleAddEntry`,
`handleRemoveEntry`) only mutates local React state; `handleSubmit` never
calls `artworksApi.createEntry` / `updateEntry` / `deleteEntry`. Entries are
effectively unpersisted through the admin UI today (only `seed.ts` writes
real entry rows). This has to be fixed for `size` to be settable/updatable in
practice, since there is otherwise no working path to create or edit an
entry at all.

## Goals / Non-Goals

**Goals:**
- Add a required, updatable `size` field to `ArtworkEntry`.
- Make the admin UI's entry add/edit/remove actually persist to the backend.

**Non-Goals:**
- No change to how `size` affects rendering on the public `ArtworkPage` — it
  is stored and settable only; visual use comes in a later change.
- No optimistic UI, autosave, or per-row save actions — entry changes are
  batched into the artwork form's existing single Save action.
- No change to `artwork.service.ts` / `artwork.controller.ts` request
  handling beyond what the schema change already requires — they pass
  through validated input unchanged.

## Decisions

**`size` as `String` with Zod enum validation, not a Prisma enum.**
Prisma's SQLite provider does not support the `enum` schema type. A `String`
column with `z.enum(['small', 'medium', 'large'])` validation in
`ArtworkEntrySchema` matches the existing `featuredPriority` precedent and
keeps the constraint enforced at the same layer as the rest of the input
validation.

**Schema-level DB default of `"medium"`, but no default in the create-time
Zod schema.**
The Prisma column is `size String @default("medium")` so the migration can
add a `NOT NULL` column to the existing `artwork_entries` table without a
separate backfill script — existing rows (including seed data) get
`"medium"` automatically. `ArtworkEntrySchema`'s `size` field has no
`.default()`, so `POST /api/admin/artworks/:id/entries` still rejects a
request that omits `size`; the DB default only ever protects rows written
outside that path.

**Update schema reuses `ArtworkEntrySchema.partial()` (existing pattern).**
`updateEntry` already validates with `ArtworkEntrySchema.partial()` in
`artwork.controller.ts`. No new schema is needed: a partial update that
includes `size` is still constrained to the same three values because
`.partial()` keeps each field's own validator, only making presence optional.

**Entry reconciliation happens client-side in `ArtworkForm.tsx`, not as a new
backend "sync" endpoint.**
On Save, the form diffs its current entry list against the entries loaded
from the server (tracked by presence/absence of `id`):
- entry without `id` → `createEntry`
- entry with `id` present in both loaded and current lists, with changed
  fields → `updateEntry`
- entry with `id` present in loaded list but absent from current list →
  `deleteEntry`

For a brand-new artwork (no `id` yet at all), the form first awaits
`artworksApi.create(...)` to obtain the new artwork id, then issues
`createEntry` calls for each staged entry. This avoids adding a batch/sync
endpoint for what is, in practice, a low-volume admin-only form (a handful of
entries per artwork), matching the app's existing one-request-per-action
style throughout `artwork.service.ts`.

**Existing entries become inline-editable; no separate edit view.**
The entries list in `ArtworkForm.tsx` gains editable fields (including a
required size selector) per row instead of only a Remove button, consistent
with everything else on this form being edited inline before a single Save.

## Risks / Trade-offs

- **[Risk]** Reconciliation issues several sequential requests per Save
  (create/update/delete per changed entry, plus the artwork request itself)
  with no transaction — a failure partway through leaves some entries saved
  and others not. → **Mitigation**: acceptable for a single-admin internal
  tool at current entry volumes; surface the first error and stop rather than
  silently continuing, so the admin knows to retry. Not solved by this change
  if stronger atomicity is later required.
- **[Risk]** The required-`size` validation is a breaking API change for any
  other caller of `POST /api/admin/artworks/:id/entries`. → **Mitigation**:
  this is an admin-only internal endpoint with a single frontend caller,
  updated in the same change.

## Migration Plan

1. Add `size String @default("medium")` to `ArtworkEntry` in
   `prisma/schema.prisma`; generate the migration. The default backfills
   existing rows; no manual data migration step is needed.
2. Update `ArtworkEntrySchema` to require `size` as
   `z.enum(['small', 'medium', 'large'])` (no `.default()`).
3. Update `src/database/seed.ts` entries to include an explicit `size` (seed
   data should exercise more than one value).
4. Update `ArtworkEntry` in `frontend/src/api/artworks.ts` to include
   `size: 'small' | 'medium' | 'large'`.
5. Update `ArtworkForm.tsx`: add the size selector to new-entry input, add
   inline edit fields (including size) to existing entries, and implement the
   reconciliation described above in `handleSubmit`.

Rollback: revert the migration (drop column) and the corresponding schema/UI
changes; no data beyond the new column is affected.
