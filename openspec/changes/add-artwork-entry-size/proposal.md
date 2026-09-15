## Why

Artwork process entries (`ArtworkEntry`) have no way to indicate the intended
display size of their image. The admin needs to set this at creation and
change it later, and it must exist before the frontend can use it to size
images. Separately, the admin UI's entry management (add/edit/remove) is not
actually wired to the backend today, so there is no working path for an admin
to set or update entry-level data at all.

## What Changes

- Add a required `size` field (`small` | `medium` | `large`) to `ArtworkEntry`.
- **BREAKING**: `POST /api/admin/artworks/:id/entries` now requires `size` in
  the request body; existing callers omitting it will get a validation error.
- Backfill existing `artwork_entries` rows with `size = "medium"` via the
  Prisma migration (schema-level default; the API still requires the admin to
  choose explicitly on every create).
- Fix the admin entry management flow in `ArtworkForm.tsx` so entries are
  actually persisted:
  - New artwork: create the artwork first, then create each staged entry.
  - Existing artwork: reconcile staged changes against the loaded entries on
    Save — update changed entries, create new ones, delete removed ones.
  - Add an inline edit affordance (including a required size selector) for
    existing entries; today they can only be removed, not edited.
- No frontend rendering/layout changes: the public `ArtworkPage` does not use
  `size` for image styling yet.

## Capabilities

### New Capabilities
- `artwork-entries`: management of artwork process entries (create, update,
  delete, and their fields including the new required `size`), and the admin
  UI flow for persisting them.

### Modified Capabilities
(none — no existing capability specs predate this change)

## Impact

- `prisma/schema.prisma`, new migration under `prisma/migrations/`
- `src/shared/schemas.ts` (`ArtworkEntrySchema`)
- `frontend/src/api/artworks.ts` (`ArtworkEntry` interface)
- `frontend/src/pages/admin/ArtworkForm.tsx` (entry add/edit/remove + save reconciliation)
- `src/database/seed.ts` (seed entries need a `size` value)
- No changes to `artwork.service.ts` / `artwork.controller.ts` request handling
  (they already pass through whatever the schema validates)
