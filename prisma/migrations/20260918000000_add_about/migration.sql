-- CreateTable
CREATE TABLE "about" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'singleton',
    "tagline" TEXT NOT NULL,
    "bio" TEXT NOT NULL,
    "heroImage" TEXT NOT NULL,
    "disciplines" TEXT NOT NULL,
    "colophon" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL
);
