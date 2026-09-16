import prisma from '../../database/client.js';
import { CreateArtworkInput, UpdateArtworkInput, ArtworkEntryInput, UpdateArtworkEntryInput } from '../../shared/schemas.js';
import { Artwork, ArtworkEntry } from '@prisma/client';

export class ArtworkService {
  // Get all artworks with relations
  async getAllArtworks(tag?: string) {
    const where: any = {};

    if (tag) {
      where.artworkTags = {
        some: {
          tag: {
            slug: tag,
          },
        },
      };
    }

    return prisma.artwork.findMany({
      where,
      include: {
        entries: {
          orderBy: { displayOrder: 'asc' },
          include: { images: { orderBy: { position: 'asc' } } },
        },
        artworkTags: {
          include: {
            tag: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Get featured artworks only
  async getFeaturedArtworks() {
    return prisma.artwork.findMany({
      where: {
        featuredPriority: {
          gt: 0,
        },
      },
      include: {
        entries: {
          orderBy: { displayOrder: 'asc' },
          include: { images: { orderBy: { position: 'asc' } } },
        },
        artworkTags: {
          include: {
            tag: true,
          },
        },
      },
      orderBy: { featuredPriority: 'asc' },
    });
  }

  // Get single artwork by slug
  async getArtworkBySlug(slug: string) {
    return prisma.artwork.findUnique({
      where: { slug },
      include: {
        entries: {
          orderBy: { displayOrder: 'asc' },
          include: { images: { orderBy: { position: 'asc' } } },
        },
        artworkTags: {
          include: {
            tag: true,
          },
        },
      },
    });
  }

  // Create new artwork
  async createArtwork(data: CreateArtworkInput) {
    const slug = this.generateSlug(data.title);

    // Check if slug already exists
    const existing = await prisma.artwork.findUnique({ where: { slug } });
    if (existing) {
      throw new Error('Artwork with this title already exists');
    }

    const artwork = await prisma.artwork.create({
      data: {
        title: data.title,
        slug,
        summary: data.summary,
        medium: data.medium,
        yearCreated: data.yearCreated,
        coverImage: data.coverImage,
        featuredPriority: data.featuredPriority || 0,
        artworkTags: {
          create: (data.tagIds || []).map((tagId) => ({
            tag: { connect: { id: tagId } },
          })),
        },
      },
      include: {
        entries: { include: { images: { orderBy: { position: 'asc' } } } },
        artworkTags: {
          include: { tag: true },
        },
      },
    });

    return artwork;
  }

  // Update artwork
  async updateArtwork(id: string, data: UpdateArtworkInput) {
    const artwork = await prisma.artwork.findUnique({ where: { id } });
    if (!artwork) {
      throw new Error('Artwork not found');
    }

    // If title changed, update slug
    let slug = artwork.slug;
    if (data.title && data.title !== artwork.title) {
      slug = this.generateSlug(data.title);
      const slugExists = await prisma.artwork.findUnique({ where: { slug } });
      if (slugExists && slugExists.id !== id) {
        throw new Error('Artwork with this title already exists');
      }
    }

    return prisma.artwork.update({
      where: { id },
      data: {
        title: data.title,
        slug: data.title ? slug : undefined,
        summary: data.summary,
        medium: data.medium,
        yearCreated: data.yearCreated,
        coverImage: data.coverImage,
        featuredPriority: data.featuredPriority,
        artworkTags:
          data.tagIds !== undefined
            ? {
                deleteMany: {},
                create: data.tagIds.map((tagId) => ({
                  tag: { connect: { id: tagId } },
                })),
              }
            : undefined,
      },
      include: {
        entries: { include: { images: { orderBy: { position: 'asc' } } } },
        artworkTags: {
          include: { tag: true },
        },
      },
    });
  }

  // Delete artwork (cascade deletes entries and tags)
  async deleteArtwork(id: string) {
    const artwork = await prisma.artwork.findUnique({ where: { id } });
    if (!artwork) {
      throw new Error('Artwork not found');
    }

    return prisma.artwork.delete({
      where: { id },
    });
  }

  // Create process entry
  async createEntry(artworkId: string, data: ArtworkEntryInput) {
    const artwork = await prisma.artwork.findUnique({ where: { id: artworkId } });
    if (!artwork) {
      throw new Error('Artwork not found');
    }

    return prisma.artworkEntry.create({
      data: {
        artworkId,
        columns: data.columns,
        displayOrder: data.displayOrder,
        images: {
          create: data.images.map((image, index) => ({ ...image, position: index + 1 })),
        },
      },
      include: { images: { orderBy: { position: 'asc' } } },
    });
  }

  // Update process entry
  async updateEntry(id: string, data: UpdateArtworkEntryInput) {
    const entry = await prisma.artworkEntry.findUnique({ where: { id } });
    if (!entry) {
      throw new Error('Entry not found');
    }

    return prisma.$transaction(async (tx) => {
      if (data.images) {
        await tx.artworkEntryImage.deleteMany({ where: { entryId: id } });
      }

      return tx.artworkEntry.update({
        where: { id },
        data: {
          columns: data.columns,
          displayOrder: data.displayOrder,
          images: data.images
            ? { create: data.images.map((image, index) => ({ ...image, position: index + 1 })) }
            : undefined,
        },
        include: { images: { orderBy: { position: 'asc' } } },
      });
    });
  }

  // Delete process entry
  async deleteEntry(id: string) {
    const entry = await prisma.artworkEntry.findUnique({ where: { id } });
    if (!entry) {
      throw new Error('Entry not found');
    }

    return prisma.artworkEntry.delete({
      where: { id },
    });
  }

  // List an entry's images ordered by position
  async listImages(entryId: string) {
    return prisma.artworkEntryImage.findMany({ where: { entryId }, orderBy: { position: 'asc' } });
  }

  // Get one image by entry + position
  async getImage(entryId: string, position: number) {
    return prisma.artworkEntryImage.findUniqueOrThrow({ where: { entryId_position: { entryId, position } } });
  }

  // Add an image at the next available position
  async createImage(entryId: string, data: { url: string; title: string; description: string }) {
    const entry = await prisma.artworkEntry.findUnique({ where: { id: entryId } });
    if (!entry) {
      throw new Error('Entry not found');
    }

    const last = await prisma.artworkEntryImage.findFirst({ where: { entryId }, orderBy: { position: 'desc' } });

    return prisma.artworkEntryImage.create({
      data: { ...data, entryId, position: (last?.position ?? 0) + 1 },
    });
  }

  // Update one image's fields by entry + position
  async updateImage(entryId: string, position: number, data: Partial<{ url: string; title: string; description: string }>) {
    return prisma.artworkEntryImage.update({
      where: { entryId_position: { entryId, position } },
      data,
    });
  }

  // Delete one image and renumber later positions to stay contiguous
  async deleteImage(entryId: string, position: number) {
    return prisma.$transaction(async (tx) => {
      await tx.artworkEntryImage.delete({ where: { entryId_position: { entryId, position } } });

      const rest = await tx.artworkEntryImage.findMany({
        where: { entryId, position: { gt: position } },
        orderBy: { position: 'asc' },
      });

      for (const image of rest) {
        await tx.artworkEntryImage.update({ where: { id: image.id }, data: { position: image.position - 1 } });
      }
    });
  }

  // Helper: Generate URL-friendly slug
  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }
}

export default new ArtworkService();
