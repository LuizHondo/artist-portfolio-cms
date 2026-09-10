import { PrismaClient } from '@prisma/client';
import bcryptjs from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing data (for development)
  await prisma.artworkTag.deleteMany({});
  await prisma.artworkEntry.deleteMany({});
  await prisma.artwork.deleteMany({});
  await prisma.tag.deleteMany({});
  await prisma.adminUser.deleteMany({});

  // Create predefined tags (system-controlled)
  const tags = await prisma.tag.createMany({
    data: [
      { name: 'Character Design', slug: 'character-design' },
      { name: 'Concept Art', slug: 'concept-art' },
      { name: 'Environment Art', slug: 'environment-art' },
      { name: 'Illustration', slug: 'illustration' },
      { name: '3D Sculpture', slug: '3d-sculpture' },
      { name: 'Animation', slug: 'animation' },
      { name: 'Digital Painting', slug: 'digital-painting' },
      { name: 'Traditional Art', slug: 'traditional-art' },
      { name: 'Game Art', slug: 'game-art' },
      { name: 'Storyboarding', slug: 'storyboarding' },
    ],
  });

  console.log(`✅ Created ${tags.count} tags`);

  // Create default admin user
  const hashedPassword = await bcryptjs.hash(process.env.ADMIN_PASSWORD || 'change_me', 10);

  const adminUser = await prisma.adminUser.create({
    data: {
      email: process.env.ADMIN_EMAIL || 'admin@raulbarbosa.com',
      password: hashedPassword,
    },
  });

  console.log(`✅ Created admin user: ${adminUser.email}`);

  // Mock artworks data
  const mockArtworks = [
    {
      title: 'Dragon Knight',
      slug: 'dragon-knight',
      summary: 'A powerful dragon-rider character design for fantasy game',
      coverImage: 'https://picsum.photos/600/400?random=1',
      medium: 'Digital Painting',
      yearCreated: 2023,
      tagSlugs: ['character-design', 'game-art', 'digital-painting'],
      featuredPriority: 1,
      entries: [
        {
          title: 'Initial Concept Sketch',
          imageUrl: 'https://picsum.photos/800/600?random=11',
          description: 'First conceptual sketches exploring the dragon-rider relationship and dynamic posing.',
          displayOrder: 1,
        },
        {
          title: 'Character Turnaround',
          imageUrl: 'https://picsum.photos/800/600?random=12',
          description: 'Full 360-degree character turnaround showing all angles and details.',
          displayOrder: 2,
        },
        {
          title: 'Final Color Study',
          imageUrl: 'https://picsum.photos/800/600?random=13',
          description: 'Final color palette and lighting study for the character design.',
          displayOrder: 3,
        },
      ],
    },
    {
      title: 'Enchanted Forest',
      slug: 'enchanted-forest',
      summary: 'A mystical environment concept art piece with magical elements',
      coverImage: 'https://picsum.photos/600/400?random=2',
      medium: 'Digital Painting',
      yearCreated: 2023,
      tagSlugs: ['environment-art', 'concept-art', 'digital-painting'],
      featuredPriority: 2,
      entries: [
        {
          title: 'Mood Board & References',
          imageUrl: 'https://picsum.photos/800/600?random=21',
          description: 'Mood board and reference materials collected for the environment design.',
          displayOrder: 1,
        },
        {
          title: 'Layout Composition',
          imageUrl: 'https://picsum.photos/800/600?random=22',
          description: 'Initial composition and layout studies for the scene.',
          displayOrder: 2,
        },
      ],
    },
    {
      title: 'Crystal Sculpture',
      slug: 'crystal-sculpture',
      summary: 'A 3D sculptural piece exploring crystalline forms and light interaction',
      coverImage: 'https://picsum.photos/600/400?random=3',
      medium: '3D Sculpture',
      yearCreated: 2023,
      tagSlugs: ['3d-sculpture'],
      featuredPriority: 2,
      entries: [
        {
          title: 'Clay Model Iteration 1',
          imageUrl: 'https://picsum.photos/800/600?random=31',
          description: 'First iteration of the crystal structure in digital clay.',
          displayOrder: 1,
        },
        {
          title: 'Rendered Close-up',
          imageUrl: 'https://picsum.photos/800/600?random=32',
          description: 'Detailed render showing light refraction through crystal surfaces.',
          displayOrder: 2,
        },
      ],
    },
    {
      title: 'Animation Loop: Fire Spell',
      slug: 'animation-fire-spell',
      summary: 'A looping animation of a magical fire spell effect',
      coverImage: 'https://picsum.photos/600/400?random=4',
      medium: 'Animation',
      yearCreated: 2023,
      tagSlugs: ['animation', 'game-art'],
      featuredPriority: 0,
      entries: [
        {
          title: 'Keyframe Layout',
          imageUrl: 'https://picsum.photos/800/600?random=41',
          description: 'Keyframe breakdown for the fire spell animation sequence.',
          displayOrder: 1,
        },
      ],
    },
    {
      title: 'Portrait Study: The Mage',
      slug: 'portrait-mage',
      summary: 'Detailed character portrait exploring facial features and expression',
      coverImage: 'https://picsum.photos/600/400?random=5',
      medium: 'Illustration',
      yearCreated: 2024,
      tagSlugs: ['illustration', 'character-design', 'digital-painting'],
      featuredPriority: 0,
      entries: [
        {
          title: 'Sketch Phase',
          imageUrl: 'https://picsum.photos/800/600?random=51',
          description: 'Initial digital sketch establishing proportions and likeness.',
          displayOrder: 1,
        },
        {
          title: 'Render Pass',
          imageUrl: 'https://picsum.photos/800/600?random=52',
          description: 'Rendering and refining details with color and texture.',
          displayOrder: 2,
        },
      ],
    },
    {
      title: 'Ancient Temple Ruins',
      slug: 'temple-ruins',
      summary: 'Environment concept for a mysterious ancient temple',
      coverImage: 'https://picsum.photos/600/400?random=6',
      medium: 'Digital Painting',
      yearCreated: 2024,
      tagSlugs: ['environment-art', 'concept-art', 'game-art'],
      featuredPriority: 0,
      entries: [
        {
          title: 'Architectural Study',
          imageUrl: 'https://picsum.photos/800/600?random=61',
          description: 'Study of ancient architectural elements and structural design.',
          displayOrder: 1,
        },
        {
          title: 'Atmospheric Lighting',
          imageUrl: 'https://picsum.photos/800/600?random=62',
          description: 'Adding atmospheric effects and mood lighting to the scene.',
          displayOrder: 2,
        },
      ],
    },
    {
      title: 'Character Expressions Sheet',
      slug: 'character-expressions',
      summary: 'A comprehensive emotion expression study for character animation',
      coverImage: 'https://picsum.photos/600/400?random=7',
      medium: 'Illustration',
      yearCreated: 2024,
      tagSlugs: ['character-design', 'animation', 'illustration'],
      featuredPriority: 0,
      entries: [
        {
          title: 'Expression Grid',
          imageUrl: 'https://picsum.photos/800/600?random=71',
          description: 'Full grid of facial expressions from neutral to extreme emotions.',
          displayOrder: 1,
        },
      ],
    },
  ];

  // Create artworks with entries
  for (const artwork of mockArtworks) {
    const { entries, tagSlugs, ...artworkData } = artwork;

    const createdArtwork = await prisma.artwork.create({
      data: {
        ...artworkData,
      },
    });

    // Add tags to artwork
    for (const tagSlug of tagSlugs) {
      const tag = await prisma.tag.findUnique({
        where: { slug: tagSlug },
      });
      if (tag) {
        await prisma.artworkTag.create({
          data: {
            artworkId: createdArtwork.id,
            tagId: tag.id,
          },
        });
      }
    }

    // Add artwork entries (process documentation)
    for (const entry of entries) {
      await prisma.artworkEntry.create({
        data: {
          ...entry,
          artworkId: createdArtwork.id,
        },
      });
    }

    console.log(`✅ Created artwork: ${createdArtwork.title}`);
  }

  console.log(`✅ Created ${mockArtworks.length} artworks with process entries`);
  console.log('✨ Database seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
