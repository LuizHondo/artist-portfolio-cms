import prisma from '../../database/client.js';
import { UpdateAboutInput } from '../../shared/schemas.js';

const SINGLETON_ID = 'singleton';

// Seed matches the previous hardcoded copy on frontend/app/about/page.tsx,
// so the page keeps rendering the same content once wired to this API.
const DEFAULTS = {
  id: SINGLETON_ID,
  tagline: 'Illustrator · Character Design · Concept Art',
  bio: JSON.stringify([
    "What's up — I'm a Brazilian illustrator passionate about coffee, cats, and beautifully designed books.",
    'With a background in Animation Design, I focus on the conceptual side of projects — ideation, planning, and visual development. I love stories where a single frame holds enough light, shadow, and acting to make you stop and look closer.',
    'Available for commissions, concept work, and the occasional cover.',
  ]),
  heroImage: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=1200&q=70',
  disciplines: JSON.stringify([
    'Illustration',
    'Character Design',
    'Concept Art',
    'Storyboard',
    'Environment Design',
    'Visual Development',
  ]),
  colophon: JSON.stringify([
    { key: 'Tools', value: 'Procreate · Photoshop · pencil' },
    { key: 'Clients', value: 'vGen · Editora Aleph · Folha' },
    { key: 'Awards', value: 'vGen Wings 2026 · Honorable Mention' },
    { key: 'Speaks', value: 'Portuguese · English' },
    { key: 'Lives', value: 'Curitiba, with two cats' },
  ]),
};

function toDto(row: {
  tagline: string;
  bio: string;
  heroImage: string;
  disciplines: string;
  colophon: string;
  updatedAt: Date;
}) {
  return {
    tagline: row.tagline,
    bio: JSON.parse(row.bio) as string[],
    heroImage: row.heroImage,
    disciplines: JSON.parse(row.disciplines) as string[],
    colophon: JSON.parse(row.colophon) as Array<{ key: string; value: string }>,
    updatedAt: row.updatedAt,
  };
}

export class AboutService {
  // Get the singleton About row, creating it from defaults on first read.
  async getAbout() {
    const row = await prisma.about.upsert({
      where: { id: SINGLETON_ID },
      update: {},
      create: DEFAULTS,
    });
    return toDto(row);
  }

  async updateAbout(data: UpdateAboutInput) {
    const row = await prisma.about.upsert({
      where: { id: SINGLETON_ID },
      update: {
        tagline: data.tagline,
        bio: JSON.stringify(data.bio),
        heroImage: data.heroImage,
        disciplines: JSON.stringify(data.disciplines),
        colophon: JSON.stringify(data.colophon),
      },
      create: {
        id: SINGLETON_ID,
        tagline: data.tagline,
        bio: JSON.stringify(data.bio),
        heroImage: data.heroImage,
        disciplines: JSON.stringify(data.disciplines),
        colophon: JSON.stringify(data.colophon),
      },
    });
    return toDto(row);
  }
}

export default new AboutService();
