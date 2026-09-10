# Raul Barbosa Neto - Portfolio CMS

A professional portfolio content management system for Raul Barbosa Neto - an illustrator, 3D sculptor, and animator.

## 🎨 Project Overview

This is a full-stack web application featuring:
- **Backend API**: Express.js + Prisma ORM for robust data management
- **Database**: SQLite with 4 tables (artworks, artwork_entries, tags, artwork_tags)
- **Frontend**: React + TypeScript for an intuitive user interface
- **Admin Panel**: Complete CRUD operations for managing artworks and creative process documentation

## 📋 Database Architecture

### Tables

1. **artworks** - Main artwork metadata
   - `id`: Unique identifier
   - `title`: Artwork name
   - `slug`: URL-friendly identifier
   - `summary`: Short description
   - `coverImage`: Thumbnail image URL
   - `featuredPriority`: 0 (not featured), 1 (hero), 2-3 (featured grid)
   - `medium`: Technique used
   - `yearCreated`: Year of creation
   - `createdAt`, `updatedAt`: Timestamps

2. **artwork_entries** - Creative process stages
   - `id`: Entry identifier
   - `artworkId`: References artwork
   - `title`: Stage name (e.g., "Initial Sketch")
   - `imageUrl`: Process image
   - `description`: Stage description
   - `displayOrder`: Sequence order

3. **tags** - System-controlled categorization
   - Pre-defined by system
   - Admin cannot create/edit/delete
   - Examples: "Character Design", "Concept Art", "3D Sculpture"

4. **artwork_tags** - Many-to-many relationship

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone repository
git clone <repo-url>
cd raul-portfolio-cms

# Install dependencies
npm install

# Setup environment
cp .env.example .env
```

### Configuration

Edit `.env`:
```
DATABASE_URL="file:./dev.db"
PORT=3000
JWT_SECRET=your_secure_secret_key
ADMIN_EMAIL=admin@raulbarbosa.com
ADMIN_PASSWORD=your_initial_password
```

### Database Setup

```bash
# Run migrations
npm run db:migrate

# Seed database with tags and admin user
npm run db:seed
```

### Development

```bash
# Start development server
npm run dev

# Server runs on http://localhost:3000
```

## 📚 API Endpoints

### Public Endpoints (No Authentication)

**Artworks**
```
GET  /api/artworks              - List all artworks
GET  /api/artworks/featured      - List featured artworks only
GET  /api/artworks/:slug         - Get single artwork details
GET  /api/artworks?tag=slug      - Filter by tag
```

**Tags**
```
GET  /api/tags                   - List all tags
GET  /api/tags/:slug             - Get single tag
```

### Admin Endpoints (Require JWT Token)

**Authentication**
```
POST /api/admin/login            - Login and get JWT token
```

**Artworks Management**
```
POST   /api/admin/artworks       - Create new artwork
PUT    /api/admin/artworks/:id   - Update artwork
DELETE /api/admin/artworks/:id   - Delete artwork
```

**Process Entries Management**
```
POST   /api/admin/artworks/:id/entries  - Create process entry
PUT    /api/admin/entries/:id           - Update entry
DELETE /api/admin/entries/:id           - Delete entry
```

**Admin Profile**
```
GET  /api/admin/profile          - Get profile (protected)
POST /api/admin/change-password  - Change password (protected)
```

## 📝 Example Requests

### Login
```bash
curl -X POST http://localhost:3000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@raulbarbosa.com",
    "password": "change_me"
  }'
```

### Create Artwork
```bash
curl -X POST http://localhost:3000/api/admin/artworks \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Cyberpunk Samurai",
    "summary": "Character exploration inspired by futuristic Japan.",
    "medium": "Digital Painting",
    "yearCreated": 2026,
    "coverImage": "https://example.com/cover.webp",
    "featuredPriority": 1,
    "tagIds": ["tag_001", "tag_002"]
  }'
```

### Add Process Entry
```bash
curl -X POST http://localhost:3000/api/admin/artworks/{artworkId}/entries \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Initial Sketch",
    "description": "Initial silhouette exploration.",
    "imageUrl": "https://example.com/sketch.webp",
    "displayOrder": 1
  }'
```

## 🏗️ Project Structure

```
raul-portfolio-cms/
├── src/
│   ├── app.ts                    # Express app setup
│   ├── database/
│   │   ├── client.ts             # Prisma client singleton
│   │   └── seed.ts               # Database seeding
│   ├── modules/
│   │   ├── artworks/
│   │   │   ├── artwork.controller.ts
│   │   │   ├── artwork.service.ts
│   │   │   └── artwork.routes.ts
│   │   ├── tags/
│   │   │   ├── tag.controller.ts
│   │   │   ├── tag.service.ts
│   │   │   └── tag.routes.ts
│   │   └── admin/
│   │       ├── admin.controller.ts
│   │       ├── admin.service.ts
│   │       └── admin.routes.ts
│   └── shared/
│       ├── auth.ts               # JWT & password utilities
│       └── schemas.ts            # Zod validation schemas
├── prisma/
│   └── schema.prisma             # Database schema
├── package.json
├── tsconfig.json
└── README.md
```

## 🔒 Authentication

The API uses JWT (JSON Web Tokens) for authentication:

1. Admin logs in via `/api/admin/login`
2. Receives JWT token valid for 7 days
3. Include token in Authorization header: `Bearer YOUR_TOKEN`
4. Protected endpoints verify token before processing

## 📦 Dependencies

### Runtime
- **express**: Web framework
- **@prisma/client**: ORM for database
- **cors**: Cross-Origin Resource Sharing
- **dotenv**: Environment configuration
- **jsonwebtoken**: JWT authentication
- **bcryptjs**: Password hashing
- **zod**: Schema validation

### Development
- **typescript**: Type safety
- **tsx**: TypeScript execution
- **prisma**: Database toolkit

## 🚢 Deployment

### Build for Production

```bash
npm run build
NODE_ENV=production npm start
```

### Database Migration

```bash
npx prisma migrate deploy
```

### Environment Setup for Production

Update `.env` with production values:
- Strong JWT_SECRET
- Production database URL (PostgreSQL, MySQL, etc.)
- Secure admin credentials

## 📖 Frontend

The frontend React application is located in the `frontend/` directory.

```bash
cd frontend
npm install
npm start
```

Features:
- Homepage with featured artworks
- Portfolio gallery with filtering
- Detailed artwork view with creative process timeline
- Admin dashboard for content management
- Image upload functionality
- Responsive design

## 🎯 Key Features

✅ Portfolio Management
- Create, read, update, delete artworks
- Organize by tags and featured priority
- Document creative process with multiple entries

✅ Admin Panel
- Secure authentication
- Full CRUD operations
- Easy image management
- Priority-based featured display

✅ Public API
- RESTful endpoints
- Tag-based filtering
- Fast and cacheable responses

✅ Database Design
- Normalized schema
- Efficient relationships
- Cascading deletes

## 🤝 Contributing

Developed by: Luiz Hondo

## 📄 License

MIT

## 📞 Support

For issues or questions, please contact Luiz Hondo.
