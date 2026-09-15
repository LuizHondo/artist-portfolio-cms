## 1. Data model

- [x] 1.1 Add `size String @default("medium")` to `ArtworkEntry` in `prisma/schema.prisma` and verify `npx prisma migrate dev` generates and applies a migration cleanly against the existing dev DB (existing rows backfilled to `"medium"`)
- [x] 1.2 Update `src/database/seed.ts` entries to include an explicit `size` value (mix of small/medium/large) and verify `npx prisma db seed` (or the project's seed command) runs without error

## 2. Backend validation

- [x] 2.1 Add `size: z.enum(['small', 'medium', 'large'])` (no default) to `ArtworkEntrySchema` in `src/shared/schemas.ts` and verify a unit/manual test: POST an entry without `size` returns a 400 validation error
- [x] 2.2 Verify PUT `/api/admin/entries/:id` with only `{ size: "large" }` in the body updates just the `size` field and leaves other fields unchanged (exercises the existing `.partial()` update path with no code change expected)

## 3. Frontend types and API client

- [x] 3.1 Add `size: 'small' | 'medium' | 'large'` to the `ArtworkEntry` interface in `frontend/src/api/artworks.ts`

## 4. Admin form persistence

- [x] 4.1 Add a required size selector to the "Add New Entry" section in `frontend/src/pages/admin/ArtworkForm.tsx` and verify the Add Entry button is disabled/blocked until a size is chosen
- [x] 4.2 Add inline editable fields (title, description, imageUrl, size) to each existing entry row, replacing the current display-only + Remove-only row, and verify an admin can change an existing entry's size in the UI before saving
- [x] 4.3 Implement Save reconciliation in `handleSubmit`: for a new artwork, create the artwork first then `createEntry` each staged entry; for an existing artwork, diff loaded vs. current entries by `id` presence and call `createEntry`/`updateEntry`/`deleteEntry` per the design's reconciliation rules
- [x] 4.4 Verify end-to-end: create a new artwork with two entries of different sizes, confirm both are persisted (reload the edit page and see them); edit one entry's size and remove the other, save, and confirm the reload reflects exactly that state

## 5. Validation

- [x] 5.1 Run `openspec validate add-artwork-entry-size --strict` and fix any reported issues
