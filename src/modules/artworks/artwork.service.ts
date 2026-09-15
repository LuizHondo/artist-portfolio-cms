import prisma from '../../database/client.js';
import { CreateArtworkInput, UpdateArtworkInput, ArtworkEntryInput } from '../../shared/schemas.js';
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
        entries: true,
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
        entries: true,
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
        title: data.title,
        description: data.description,
        imageUrl: data.imageUrl,
        size: data.size,
        displayOrder: data.displayOrder,
      },
    });
  }

  // Update process entry
  async updateEntry(id: string, data: Partial<ArtworkEntryInput>) {
    const entry = await prisma.artworkEntry.findUnique({ where: { id } });
    if (!entry) {
      throw new Error('Entry not found');
    }

    return prisma.artworkEntry.update({
      where: { id },
      data,
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
