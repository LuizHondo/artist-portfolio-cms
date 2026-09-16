-- AlterTable
ALTER TABLE "artwork_entries" ADD COLUMN "columns" INTEGER;

-- CreateTable
CREATE TABLE "artwork_entry_images" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "entryId" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    CONSTRAINT "artwork_entry_images_entryId_fkey" FOREIGN KEY ("entryId") REFERENCES "artwork_entries" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "artwork_entry_images_entryId_position_key" ON "artwork_entry_images"("entryId", "position");
