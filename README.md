# Raul Barbosa Neto — Portfolio CMS (backend)

Backend API for Raul Barbosa Neto's portfolio site + admin CMS (illustrator, 3D sculptor, animator).

- **Backend**: Express + Prisma (SQLite), `src/` (this repo)
- **Frontend**: Next.js 16 (App Router) + React 19 — separate repo, [artist-portfolio](https://github.com/LuizHondo/artist-portfolio)

## Getting started

```bash
npm install
cp .env.example .env
npm run db:migrate
npm run db:seed
npm run dev          # http://localhost:3000
```

`.env`:
```
DATABASE_URL="file:./dev.db"
PORT=3000
JWT_SECRET=...
ADMIN_EMAIL=admin@raulbarbosa.com
ADMIN_PASSWORD=...
```

See the frontend repo for its own setup (`NEXT_PUBLIC_API_URL=http://localhost:3000/api`).

## Data model (`prisma/schema.prisma`)

- **Artwork** — title, slug, summary, coverImage, medium, yearCreated, `featuredPriority` (0 = unfeatured, 1 = hero, 2–3 = featured grid tiers)
- **ArtworkEntry** — a row in an artwork's process timeline; has `columns` (1–5) and belongs to an Artwork
- **ArtworkEntryImage** — one image within an entry row (`position` 1..columns, url, title, description); count must equal `entry.columns`
- **Tag** / **ArtworkTag** — system-defined tags, many-to-many with Artwork (admin cannot create/edit/delete tags)
- **About** — singleton row (tagline, bio paragraphs, heroImage, disciplines, colophon) backing the About page
- **AdminUser** — email + bcrypt password hash

## API (`/api`, see `src/modules/*/*.routes.ts`)

Public:
```
GET  /artworks               list (optional ?tag=slug)
GET  /artworks/featured
GET  /artworks/:slug
GET  /tags
GET  /tags/:slug
GET  /about
```

Admin (`Authorization: Bearer <jwt>`, 7-day token from login):
```
POST   /admin/login
GET    /admin/profile
POST   /admin/change-password
PUT    /admin/about

POST   /admin/artworks
PUT    /admin/artworks/:id
DELETE /admin/artworks/:id

POST   /admin/artworks/:id/entries
PUT    /admin/entries/:id
DELETE /admin/entries/:id

GET    /admin/entries/:entryId/images
POST   /admin/entries/:entryId/images
GET    /admin/entries/:entryId/images/:position
PATCH  /admin/entries/:entryId/images/:position
DELETE /admin/entries/:entryId/images/:position
```

Validation via Zod (`src/shared/schemas.ts`). Responses are `{ success, data }` / `{ error }`.

## How it works

**Request flow**: each domain (`artworks`, `tags`, `admin`, `about`) follows `routes → controller → service`, service does the Prisma calls. A global error handler in `app.ts` catches anything a controller doesn't handle itself.

**Auth**: login issues a JWT (7-day expiry, `{id, email}`, signed with `JWT_SECRET`). `authMiddleware` reads `Authorization: Bearer <token>` and attaches `req.admin`. Every `/admin/*` route except `/admin/login` requires it — single admin account, no roles.

**`featuredPriority`** is the only thing driving artwork placement: `0` = gallery-only, `1` = hero slot, `2`/`3` = featured grid tiers. Just an int the admin sets, no separate featured table.

**Entry/image invariant**: an `ArtworkEntry` is one row of the process timeline with a `columns` count (1–5); it must have exactly that many `ArtworkEntryImage` rows, each with a unique `position` (1..columns). `deleteImage` re-numbers the remaining images after a delete so positions stay contiguous — the frontend renders by position within the row.

**About** is a singleton row (`id` always `"singleton"`); `getAbout()` find-or-creates it from defaults on first read instead of needing a seed migration.

**Tags** are system-controlled — no admin CRUD route exists for them, only reads plus `tagIds` on artwork create/update.

## Structure

```
src/
  app.ts                    Express app, route mounting, error handling
  database/{client,seed}.ts Prisma client singleton + seed script
  modules/{artworks,tags,admin,about}/  controller + service + routes per domain
  shared/{auth,schemas}.ts  JWT/bcrypt helpers, Zod schemas
prisma/schema.prisma
```

## Scripts

`npm run dev|build|start|db:migrate|db:seed|db:reset|test`

## Deploy

```bash
npm run build && npx prisma migrate deploy && NODE_ENV=production npm start
```

Swap `DATABASE_URL` for a production Postgres/MySQL URL if moving off SQLite, and set a strong `JWT_SECRET`.

---
Developed by Luiz Hondo. MIT.
