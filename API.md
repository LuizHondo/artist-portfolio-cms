# API Documentation - Raul Barbosa Neto Portfolio CMS

## Base URL

```
http://localhost:3000/api
```

## Authentication

Protected endpoints require JWT token in Authorization header:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

Tokens are obtained via login endpoint and valid for 7 days.

---

## 📚 Public Endpoints (No Authentication Required)

### Artworks

#### List All Artworks

```
GET /artworks
```

**Query Parameters:**
- `tag` (optional): Filter by tag slug

**Response:**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "id": "art_001",
      "title": "Cyberpunk Samurai",
      "slug": "cyberpunk-samurai",
      "summary": "Character exploration inspired by futuristic Japan.",
      "coverImage": "https://example.com/cover.webp",
      "featuredPriority": 1,
      "medium": "Digital Painting",
      "yearCreated": 2026,
      "entries": [
        {
          "id": "entry_001",
          "title": "Initial Sketch",
          "imageUrl": "https://example.com/sketch.webp",
          "description": "Initial silhouette exploration.",
          "displayOrder": 1
        }
      ],
      "artworkTags": [
        {
          "tag": {
            "id": "tag_001",
            "name": "Character Design",
            "slug": "character-design"
          }
        }
      ]
    }
  ]
}
```

#### Get Featured Artworks Only

```
GET /artworks/featured
```

**Response:** Same as list all artworks (filtered to `featuredPriority > 0`, ordered by priority)

#### Get Single Artwork by Slug

```
GET /artworks/:slug
```

**Example:**
```
GET /artworks/cyberpunk-samurai
```

**Response:**
```json
{
  "success": true,
  "data": { /* single artwork object */ }
}
```

#### Filter Artworks by Tag

```
GET /artworks?tag=character-design
```

**Response:** List of artworks with that tag

---

### Tags

#### List All Tags

```
GET /tags
```

**Response:**
```json
{
  "success": true,
  "count": 10,
  "data": [
    {
      "id": "tag_001",
      "name": "Character Design",
      "slug": "character-design"
    },
    {
      "id": "tag_002",
      "name": "Concept Art",
      "slug": "concept-art"
    }
  ]
}
```

#### Get Single Tag by Slug

```
GET /tags/:slug
```

---

## 🔒 Protected Endpoints (Authentication Required)

### Authentication

#### Admin Login

```
POST /admin/login
```

**Request Body:**
```json
{
  "email": "admin@raulbarbosa.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGc... (JWT token)",
  "admin": {
    "id": "admin_001",
    "email": "admin@raulbarbosa.com"
  }
}
```

#### Get Admin Profile

```
GET /admin/profile
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "admin_001",
    "email": "admin@raulbarbosa.com",
    "createdAt": "2026-08-01T10:00:00Z"
  }
}
```

#### Change Password

```
POST /admin/change-password
```

**Request Body:**
```json
{
  "currentPassword": "old_password",
  "newPassword": "new_password",
  "confirmPassword": "new_password"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

---

### Artwork Management

#### Create Artwork

```
POST /admin/artworks
```

**Request Body:**
```json
{
  "title": "Cyberpunk Samurai",
  "summary": "Character exploration inspired by futuristic Japan.",
  "medium": "Digital Painting",
  "yearCreated": 2026,
  "coverImage": "https://example.com/cover.webp",
  "featuredPriority": 1,
  "tagIds": ["tag_001", "tag_002"]
}
```

**Response:**
```json
{
  "success": true,
  "data": { /* created artwork object */ }
}
```

#### Update Artwork

```
PUT /admin/artworks/:id
```

**Request Body:** (same as create, all fields optional)

**Response:** Updated artwork object

#### Delete Artwork

```
DELETE /admin/artworks/:id
```

**Response:**
```json
{
  "success": true,
  "message": "Artwork deleted successfully"
}
```

---

### Process Entries (Creative Timeline)

#### Create Entry

```
POST /admin/artworks/:artworkId/entries
```

**Request Body:**
```json
{
  "title": "Initial Sketch",
  "description": "Initial silhouette exploration.",
  "imageUrl": "https://example.com/sketch.webp",
  "displayOrder": 1
}
```

**Response:**
```json
{
  "success": true,
  "data": { /* created entry object */ }
}
```

#### Update Entry

```
PUT /admin/entries/:entryId
```

**Request Body:** (same as create, all fields optional)

**Response:** Updated entry object

#### Delete Entry

```
DELETE /admin/entries/:entryId
```

**Response:**
```json
{
  "success": true,
  "message": "Entry deleted successfully"
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Validation error message"
}
```

### 401 Unauthorized
```json
{
  "error": "Missing authorization token"
}
```
or
```json
{
  "error": "Invalid or expired token"
}
```

### 404 Not Found
```json
{
  "error": "Artwork not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal Server Error",
  "timestamp": "2026-09-10T15:30:00Z"
}
```

---

## Rate Limiting

- Public endpoints: 100 requests per 15 minutes
- Protected endpoints: 50 requests per 15 minutes

---

## Best Practices

### Image Management

1. **Supported Formats**: WebP (recommended), JPEG, PNG
2. **Recommended Sizes**:
   - Cover images: 800x600px or larger
   - Entry images: 600x400px or larger
3. **Optimization**: Use WebP for better performance

### Featured Priority System

```
featuredPriority: 0  → Not featured
featuredPriority: 1  → Hero section (large display)
featuredPriority: 2  → Featured grid (medium display)
featuredPriority: 3  → Featured grid (medium display)
```

### Creating Process Entries

Best practice for documenting creative process:

1. **Entry 1**: Initial concept/sketch
2. **Entry 2**: Refinement stage
3. **Entry 3**: Coloring/texturing
4. **Entry 4**: Final result

Order matters! Use `displayOrder` field to control sequence.

---

## Example Workflows

### Complete Artwork Creation Flow

```bash
# 1. Login
curl -X POST http://localhost:3000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@raulbarbosa.com",
    "password": "password"
  }'

# Save the token from response

# 2. Create artwork
curl -X POST http://localhost:3000/api/admin/artworks \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My Artwork",
    "summary": "A great artwork",
    "medium": "Digital",
    "yearCreated": 2026,
    "coverImage": "https://example.com/cover.webp",
    "featuredPriority": 1,
    "tagIds": ["tag_001"]
  }'

# Save the artwork ID from response

# 3. Add process entry
curl -X POST http://localhost:3000/api/admin/artworks/ARTWORK_ID/entries \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Sketch",
    "description": "Initial sketch",
    "imageUrl": "https://example.com/sketch.webp",
    "displayOrder": 1
  }'
```

### Filter by Tag Flow

```bash
# Get all Character Design artworks
curl http://localhost:3000/api/artworks?tag=character-design

# Get just tags for UI
curl http://localhost:3000/api/tags
```

---

## WebSocket Support (Future)

Not currently implemented. Use polling or webhooks for real-time updates.

---

## Rate Limits & Quotas

- Maximum upload size: 50MB
- Maximum artworks: Unlimited
- Maximum entries per artwork: Unlimited
- Token expiry: 7 days

---

## Support

For API issues, check:
1. Authorization header format
2. JSON request body format
3. Required fields in requests
4. Error message details
5. Server logs
