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

const about = {
  tagline: 'Illustrator · Character Design · Concept Art',
  bio: [
    "What's up — I'm a Brazilian illustrator passionate about coffee, cats, and beautifully designed books.",
    'With a background in Animation Design, I focus on the conceptual side of projects — ideation, planning, and visual development. I love stories where a single frame holds enough light, shadow, and acting to make you stop and look closer.',
    'Available for commissions, concept work, and the occasional cover.',
  ],
  heroImage: 'https://res.cloudinary.com/zlzpa4n4/image/upload/v1789745247/profileRaul.png',
  disciplines: ['Illustration', 'Character Design', 'Concept Art', 'Storyboard', 'Environment Design', 'Visual Development'],
  colophon: [
    { key: 'Tools', value: 'Procreate · Photoshop · pencil' },
    { key: 'Clients', value: 'vGen · Editora Aleph · Folha' },
    { key: 'Awards', value: 'vGen Wings 2026 · Honorable Mention' },
    { key: 'Speaks', value: 'Portuguese · English' },
    { key: 'Lives', value: 'Curitiba, with two cats' },
  ],
};

const artworks = [
  {
    title: "Don't mess with the wings", slug: 'dont-mess-with-the-wings', yearCreated: 2026, medium: 'Illustration', featuredPriority: 0,
    summary: "Don't mess with the wings is a art I made to show how people can be harmful to each other, I really enjoyed making it",
    coverImage: 'https://res.cloudinary.com/zlzpa4n4/image/upload/v1789502391/Dont_mess_with__the_wings_final.jpg',
    tagSlugs: ['concept-art', 'illustration', 'digital-painting'],
    entries: [
      {
        columns: 3,
        displayOrder: 1,
        images: [
          { position: 1, url: 'https://res.cloudinary.com/zlzpa4n4/image/upload/v1789502395/Dont_mess_with__the_wings_sketch_1.png', title: 'This is the first sketch', description: "Don't mess with the wings is a art I made to show how people can be harmful to each other, I really enjoyed making it this is the first sketch" },
          { position: 2, url: 'https://res.cloudinary.com/zlzpa4n4/image/upload/v1789502398/Dont_mess_with__the_wings_sketch_2.jpg', title: 'This is the second', description: "Don't mess with the wings is a art I made to show how people can be harmful to each other, I really enjoyed making it this is the second sketch" },
          { position: 3, url: 'https://res.cloudinary.com/zlzpa4n4/image/upload/v1789502401/Dont_mess_with__the_wings_sketch_3.png', title: "That's the third", description: "Don't mess with the wings is a art I made to show how people can be harmful to each other, I really enjoyed making it this is the third sketch" },
        ],
      },
    ],
  },
  {
    title: 'Samured', slug: 'samured', yearCreated: 2024, medium: 'Illustration', featuredPriority: 1,
    summary: 'This is a design I liked and thought it would work for a female character and I love so deeply',
    coverImage: 'https://res.cloudinary.com/zlzpa4n4/image/upload/v1789502523/Samured_final.jpg',
    tagSlugs: ['character-design', 'illustration', 'digital-painting'],
    entries: [
      {
        columns: 1,
        displayOrder: 1,
        images: [
          { position: 1, url: 'https://res.cloudinary.com/zlzpa4n4/image/upload/v1789502522/Samured_sketch_1.png', title: 'Sketching', description: "This is one of the best sketched I've done, it looks very similar to the final piece" },
        ],
      },
    ],
  },
  {
    title: 'Holocene', slug: 'holocene', yearCreated: 2026, medium: 'Illustration', featuredPriority: 2,
    summary: 'This is the character from a game I like called Zero Parades, it is the younger version of the lad',
    coverImage: 'https://res.cloudinary.com/zlzpa4n4/image/upload/v1789502405/Holocene_final.png',
    tagSlugs: ['character-design', 'illustration'],
    entries: [
      {
        columns: 2,
        displayOrder: 1,
        images: [
          { position: 1, url: 'https://res.cloudinary.com/zlzpa4n4/image/upload/v1789502412/Holocene_sketch_2.png', title: 'Sketch', description: 'This is the first sketch I made without restrains, I really enjoyed it' },
          { position: 2, url: 'https://res.cloudinary.com/zlzpa4n4/image/upload/v1789502408/Holocene_sketch_1.png', title: 'Final b/w', description: 'Thisi it the black and white version of the final drawing, It is finalized, just doesn\'t have values' },
        ],
      },
    ],
  },
  {
    title: 'Red Ritual', slug: 'red-ritual', yearCreated: 2026, medium: 'Illustration', featuredPriority: 3,
    summary: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    coverImage: 'https://res.cloudinary.com/zlzpa4n4/image/upload/v1789502435/Red_Ritual_final.jpg',
    tagSlugs: ['concept-art', 'illustration'],
    entries: [
      {
        columns: 2,
        displayOrder: 1,
        images: [
          { position: 1, url: 'https://res.cloudinary.com/zlzpa4n4/image/upload/v1789502442/Red_Ritual_sketch_1.png', title: 'Sketch 1 ', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.' },
          { position: 2, url: 'https://res.cloudinary.com/zlzpa4n4/image/upload/v1789502522/Red_Ritual_sketch_2.png', title: 'Sketch 2', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.' },
        ],
      },
      {
        columns: 1,
        displayOrder: 1,
        images: [
          { position: 1, url: 'https://res.cloudinary.com/zlzpa4n4/image/upload/v1789502439/Red_Ritual_Process.gif', title: 'Process', description: 'This is the whole processThis is the whole processThis is the whole processThis is the whole processThis is the whole processThis is the whole processThis is the whole processThis is the whole processThis is the whole process' },
        ],
      },
    ],
  },
  {
    title: 'Sprouting Death', slug: 'sprouting-death', yearCreated: 2026, medium: 'Illustration', featuredPriority: 3,
    summary: 'Sprouting DeathSprouting DeathSprouting DeathSprouting DeathSprouting Death',
    coverImage: 'https://res.cloudinary.com/zlzpa4n4/image/upload/v1789502523/Sprouting_Death_final.jpg',
    tagSlugs: ['character-design', 'concept-art', 'illustration'],
    entries: [
      {
        columns: 3,
        displayOrder: 1,
        images: [
          { position: 1, url: 'https://res.cloudinary.com/zlzpa4n4/image/upload/v1789502522/Sprouting_Death_sketch_2.png', title: 'Sketch 1', description: 'SketchSketchSketchSketchSketchSketchSketchSketchSketchSketchSketch' },
          { position: 2, url: 'https://res.cloudinary.com/zlzpa4n4/image/upload/v1789502522/Sprouting_Death_sketch_4.jpg', title: 'Sketch 2', description: 'SketchSketchSketchSketchSketchSketchSketchSketchSketchSketchSketchSketchSketchSketchSketchSketchSketchSketchSketchSketchSketchSketchSketchSketchSketch' },
          { position: 3, url: 'https://res.cloudinary.com/zlzpa4n4/image/upload/v1789502522/Sprouting_Death_sketch_3.png', title: 'Sketch 3', description: 'SketchSketchSketchSketchSketchSketchSketchSketchSketchSketchSketchSketchSketchSketchSketchSketch' },
        ],
      },
      {
        columns: 1,
        displayOrder: 2,
        images: [
          { position: 1, url: 'https://res.cloudinary.com/zlzpa4n4/image/upload/v1789502523/Sprouting_Death_sketch_1.png', title: 'Sketch/Idea', description: 'Sketch/IdeaSketch/IdeaSketch/IdeaSketch/IdeaSketch/IdeaSketch/IdeaSketch/IdeaSketch/IdeaSketch/IdeaSketch/IdeaSketch/IdeaSketch/Idea' },
        ],
      },
    ],
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

  await prisma.about.upsert({
    where: { id: 'singleton' },
    create: {
      id: 'singleton',
      tagline: about.tagline,
      bio: JSON.stringify(about.bio),
      heroImage: about.heroImage,
      disciplines: JSON.stringify(about.disciplines),
      colophon: JSON.stringify(about.colophon),
    },
    update: {},
  });

  for (const artwork of artworks) {
    const { tagSlugs, entries, ...artworkData } = artwork;
    const createdArtwork = await prisma.artwork.create({ data: artworkData });

    for (const tagSlug of tagSlugs) {
      const tag = await prisma.tag.findUnique({ where: { slug: tagSlug } });
      if (tag) {
        await prisma.artworkTag.create({ data: { artworkId: createdArtwork.id, tagId: tag.id } });
      }
    }

    for (const entry of entries) {
      await prisma.artworkEntry.create({
        data: {
          artworkId: createdArtwork.id,
          columns: entry.columns,
          displayOrder: entry.displayOrder,
          images: { create: entry.images },
        },
      });
    }

    console.log(`Created artwork: ${createdArtwork.title}`);
  }

  console.log(`Database seed completed with ${artworks.length} artworks.`);
}

main()
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
