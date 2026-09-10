import prisma from '../../database/client.js';

export class TagService {
  async getAllTags() {
    return prisma.tag.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async getTagBySlug(slug: string) {
    return prisma.tag.findUnique({
      where: { slug },
    });
  }

  async getTagById(id: string) {
    return prisma.tag.findUnique({
      where: { id },
    });
  }
}

export default new TagService();
