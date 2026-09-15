-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_artwork_entries" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "artworkId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "size" TEXT NOT NULL DEFAULT 'medium',
    "displayOrder" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "artwork_entries_artworkId_fkey" FOREIGN KEY ("artworkId") REFERENCES "artworks" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_artwork_entries" ("artworkId", "createdAt", "description", "displayOrder", "id", "imageUrl", "title", "updatedAt") SELECT "artworkId", "createdAt", "description", "displayOrder", "id", "imageUrl", "title", "updatedAt" FROM "artwork_entries";
DROP TABLE "artwork_entries";
ALTER TABLE "new_artwork_entries" RENAME TO "artwork_entries";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
