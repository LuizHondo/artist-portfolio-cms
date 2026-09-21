# Raul Barbosa Neto — Portfolio CMS

Portfolio site + admin CMS for Raul Barbosa Neto (illustrator, 3D sculptor, animator).

- **Backend**: Express + Prisma (SQLite), `src/`
- **Frontend**: Next.js 16 (App Router) + React 19, `frontend/`

## Getting started

```bash
# backend
npm install
cp .env.example .env
npm run db:migrate
npm run db:seed
npm run dev          # http://localhost:3000

# frontend (separate terminal)
cd frontend
npm install
cp .env.example .env
npm run dev           # http://localhost:3001
```

`.env` (backend):
```
DATABASE_URL="file:./dev.db"
PORT=3000
JWT_SECRET=...
ADMIN_EMAIL=admin@raulbarbosa.com
ADMIN_PASSWORD=...
```

`frontend/.env`:
```
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

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

## Structure

```
src/
  app.ts                    Express app, route mounting, error handling
  database/{client,seed}.ts Prisma client singleton + seed script
  modules/{artworks,tags,admin,about}/  controller + service + routes per domain
  shared/{auth,schemas}.ts  JWT/bcrypt helpers, Zod schemas
prisma/schema.prisma

frontend/
  app/                       Next.js routes: home, artworks, artwork/[slug], about, admin/*
  components/                UI + admin form components
  lib/api/                   fetch wrappers per resource
  lib/design/, lib/theme.ts  shared styling
```

## Scripts

Backend: `npm run dev|build|start|db:migrate|db:seed|db:reset|test`
Frontend: `npm run dev|build|start|lint`

## Deploy

```bash
npm run build && npx prisma migrate deploy && NODE_ENV=production npm start
cd frontend && npm run build && npm start
```

Swap `DATABASE_URL` for a production Postgres/MySQL URL if moving off SQLite, and set a strong `JWT_SECRET`.

---
Developed by Luiz Hondo. MIT.
