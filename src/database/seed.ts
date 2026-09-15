import { PrismaClient } from '@prisma/client';
import bcryptjs from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

const tags = [
  { name: 'Character Design', slug: 'character-design' },
  { name: 'Creature Design', slug: 'creature-design' },
  { name: 'Concept Art', slug: 'concept-art' },
  { name: 'Environment Art', slug: 'environment-art' },
  { name: 'Illustration', slug: 'illustration' },
  { name: 'Portrait', slug: 'portrait' },
  { name: 'Digital Painting', slug: 'digital-painting' },
  { name: 'Comic Art', slug: 'comic-art' },
  { name: 'Prop Design', slug: 'prop-design' },
  { name: 'Animation', slug: 'animation' },
  { name: 'Storyboarding', slug: 'storyboarding' },
  { name: 'Game Art', slug: 'game-art' },
];

const artworks = [
  {
    title: 'Gatástrofe!', slug: 'gatastrofe', yearCreated: 2025, medium: 'Illustration', featuredPriority: 1,
    summary: 'Animation, storyboards, visual development, and lettering for a collaborative board-game project.',
    coverImage: 'https://cdnb.artstation.com/p/assets/images/images/092/343/887/large/raul-barbosa-behance-1-png.webp?1759364978',
    tagSlugs: ['illustration', 'animation', 'storyboarding', 'concept-art'],
  },
  {
    title: 'Eremita - Creature Design Exploration - Pantheon Challenge', slug: 'eremita-creature-design', yearCreated: 2025, medium: 'Concept Art', featuredPriority: 2,
    summary: 'A creature design exercise blending biology, horror, and visual storytelling.',
    coverImage: 'https://cdna.artstation.com/p/assets/images/images/089/064/358/large/raul-barbosa-01-apresent.webp?1749944139',
    tagSlugs: ['creature-design', 'concept-art', 'digital-painting', 'game-art'],
  },
  {
    title: 'Flashback - concept scene', slug: 'flashback-concept-scene', yearCreated: 2025, medium: 'Concept Art', featuredPriority: 3,
    summary: 'A concept scene with environment design, Maya blocking, and prop exploration.',
    coverImage: 'https://cdnb.artstation.com/p/assets/images/images/090/410/385/large/raul-barbosa-001-teste.jpg?1753838174',
    tagSlugs: ['concept-art', 'environment-art', 'prop-design'],
  },
  {
    title: 'I hate when this happens...', slug: 'i-hate-when-this-happens', yearCreated: 2025, medium: 'Illustration', featuredPriority: 0,
    summary: 'A digital illustration built around a sudden, expressive moment.',
    coverImage: 'https://cdna.artstation.com/p/assets/images/images/090/410/240/large/raul-barbosa-25-04-05-impact-02-insta03-jpg.jpg?1753837499',
    tagSlugs: ['illustration', 'digital-painting'],
  },
  {
    title: 'Love is for all', slug: 'love-is-for-all', yearCreated: 2025, medium: 'Illustration', featuredPriority: 0,
    summary: 'A collaborative illustration created with Sam Trioni.',
    coverImage: 'https://cdnb.artstation.com/p/assets/images/images/090/406/809/large/raul-barbosa-25-06-12-02-final-9.jpg?1753828187',
    tagSlugs: ['illustration', 'digital-painting'],
  },
  {
    title: 'vGen Challenge - March Theme: Parade', slug: 'vgen-parade-challenge', yearCreated: 2025, medium: 'Illustration', featuredPriority: 0,
    summary: "A vibrant illustration created for vGen's March challenge and selected among the winners.",
    coverImage: 'https://cdnb.artstation.com/p/assets/images/images/090/595/625/large/raul-barbosa-25-03-24-vgenmarchchallenge.jpg?1754335681',
    tagSlugs: ['illustration', 'digital-painting'],
  },
  {
    title: 'Portraits', slug: 'portraits', yearCreated: 2025, medium: 'Portrait', featuredPriority: 0,
    summary: 'A collection of digital portraits.',
    coverImage: 'https://cdnb.artstation.com/p/assets/images/images/090/407/363/large/raul-barbosa-25-05-28-portrait-1.jpg?1753828489',
    tagSlugs: ['portrait', 'illustration', 'digital-painting'],
  },
  {
    title: 'Trio', slug: 'trio', yearCreated: 2022, medium: 'Illustration', featuredPriority: 0,
    summary: 'A character illustration series exploring emo, funk, and punk styles.',
    coverImage: 'https://cdnb.artstation.com/p/assets/images/images/047/765/563/large/raul-barbosa-curthair.jpg?1648401052',
    tagSlugs: ['illustration', 'character-design'],
  },
  {
    title: 'two face', slug: 'two-face', yearCreated: 2022, medium: 'Illustration', featuredPriority: 0,
    summary: 'A stylized digital character portrait.',
    coverImage: 'https://cdna.artstation.com/p/assets/images/images/042/959/990/large/rbn-duas-caras.jpg?1635906032',
    tagSlugs: ['illustration', 'character-design'],
  },
  {
    title: 'Um retrato ae', slug: 'um-retrato-ae', yearCreated: 2022, medium: 'Portrait', featuredPriority: 0,
    summary: 'A stylized portrait study made in Photoshop.',
    coverImage: 'https://cdnb.artstation.com/p/assets/images/images/045/671/959/large/rbn-asset.jpg?1643253616',
    tagSlugs: ['portrait', 'illustration', 'digital-painting'],
  },
  {
    title: 'Creativity', slug: 'creativity', yearCreated: 2022, medium: 'Illustration', featuredPriority: 0,
    summary: 'A digital sketch exploring the idea of creativity.',
    coverImage: 'https://cdnb.artstation.com/p/assets/images/images/042/960/233/large/rbn-sketch038.jpg?1635906837',
    tagSlugs: ['illustration', 'digital-painting'],
  },
  {
    title: 'TOXICO', slug: 'toxico', yearCreated: 2022, medium: 'Illustration', featuredPriority: 0,
    summary: 'A stylized digital illustration.',
    coverImage: 'https://cdna.artstation.com/p/assets/images/images/042/960/214/large/rbn-sketch021.jpg?1635906753',
    tagSlugs: ['illustration', 'digital-painting'],
  },
  {
    title: 'A simple girl', slug: 'a-simple-girl', yearCreated: 2021, medium: 'Illustration', featuredPriority: 0,
    summary: 'A character portrait with a warm, expressive mood.',
    coverImage: 'https://cdnb.artstation.com/p/assets/images/images/042/960/161/large/rbn-moca-com-luz-dentro-da-cabeca.jpg?1635906597',
    tagSlugs: ['illustration', 'character-design'],
  },
  {
    title: 'Super... MAN!!', slug: 'super-man', yearCreated: 2021, medium: 'Illustration', featuredPriority: 0,
    summary: 'A stylized superhero illustration.',
    coverImage: 'https://cdnb.artstation.com/p/assets/images/images/042/960/255/large/rbn-superman.jpg?1635906949',
    tagSlugs: ['illustration', 'character-design', 'comic-art'],
  },
  {
    title: 'Happy Birthday', slug: 'happy-birthday', yearCreated: 2021, medium: 'Illustration', featuredPriority: 0,
    summary: 'A celebratory digital illustration.',
    coverImage: 'https://cdnb.artstation.com/p/assets/images/images/042/960/141/large/rbn-happy-years.jpg?1635906517',
    tagSlugs: ['illustration', 'digital-painting'],
  },
  {
    title: 'Tired man', slug: 'tired-man', yearCreated: 2021, medium: 'Illustration', featuredPriority: 0,
    summary: 'A moody stylized character illustration.',
    coverImage: 'https://cdnb.artstation.com/p/assets/images/images/042/960/177/large/rbn-noite-clara.jpg?1635906651',
    tagSlugs: ['illustration', 'character-design'],
  },
];

async function main() {
  console.log('Starting database seed...');

  await prisma.artworkTag.deleteMany({});
  await prisma.artworkEntry.deleteMany({});
  await prisma.artwork.deleteMany({});
  await prisma.tag.deleteMany({});
  await prisma.adminUser.deleteMany({});

  await prisma.tag.createMany({ data: tags });
  const hashedPassword = await bcryptjs.hash(process.env.ADMIN_PASSWORD || 'change_me', 10);
  await prisma.adminUser.create({
    data: {
      email: process.env.ADMIN_EMAIL || 'admin@raulbarbosa.com',
      password: hashedPassword,
    },
  });

  for (const artwork of artworks) {
    const { tagSlugs, ...artworkData } = artwork;
    const createdArtwork = await prisma.artwork.create({ data: artworkData });

    for (const tagSlug of tagSlugs) {
      const tag = await prisma.tag.findUnique({ where: { slug: tagSlug } });
      if (tag) {
        await prisma.artworkTag.create({ data: { artworkId: createdArtwork.id, tagId: tag.id } });
      }
    }

    await prisma.artworkEntry.create({
      data: {
        artworkId: createdArtwork.id,
        title: 'Featured image',
        imageUrl: createdArtwork.coverImage,
        description: createdArtwork.summary,
        size: artwork.featuredPriority === 1 ? 'large' : 'medium',
        displayOrder: 1,
      },
    });

    console.log(`Created artwork: ${createdArtwork.title}`);
  }

  console.log(`Database seed completed with ${artworks.length} ArtStation artworks.`);
}

main()
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
