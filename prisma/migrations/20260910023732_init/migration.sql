-- CreateTable
CREATE TABLE "artworks" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "coverImage" TEXT NOT NULL,
    "featuredPriority" INTEGER NOT NULL DEFAULT 0,
    "medium" TEXT NOT NULL,
    "yearCreated" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "artwork_entries" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "artworkId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "displayOrder" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "artwork_entries_artworkId_fkey" FOREIGN KEY ("artworkId") REFERENCES "artworks" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "tags" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "artwork_tags" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "artworkId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,
    CONSTRAINT "artwork_tags_artworkId_fkey" FOREIGN KEY ("artworkId") REFERENCES "artworks" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "artwork_tags_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "tags" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "admin_users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "artworks_slug_key" ON "artworks"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "tags_name_key" ON "tags"("name");

-- CreateIndex
CREATE UNIQUE INDEX "tags_slug_key" ON "tags"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "artwork_tags_artworkId_tagId_key" ON "artwork_tags"("artworkId", "tagId");

-- CreateIndex
CREATE UNIQUE INDEX "admin_users_email_key" ON "admin_users"("email");
