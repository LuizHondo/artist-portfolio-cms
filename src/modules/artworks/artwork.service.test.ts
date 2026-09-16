import prisma from '../../database/client.js';
import artworkService from './artwork.service.js';

async function createArtwork(slug: string) {
  return prisma.artwork.create({
    data: {
      title: slug,
      slug,
      summary: 'A summary long enough',
      coverImage: 'https://example.com/cover.png',
      medium: 'Illustration',
      yearCreated: 2024,
    },
  });
}

const img = (n: number) => ({ url: `https://example.com/${n}.png`, title: `Title ${n}`, description: `Desc ${n}` });

afterAll(async () => {
  await prisma.$disconnect();
});

describe('ArtworkService.updateEntry', () => {
  it('leaves exactly the new image count after reducing columns', async () => {
    const artwork = await createArtwork('update-entry-fewer-images');
    const entry = await artworkService.createEntry(artwork.id, {
      columns: 3,
      images: [img(1), img(2), img(3)],
      displayOrder: 1,
    });

    await artworkService.updateEntry(entry.id, { columns: 1, images: [img(9)] });

    const images = await prisma.artworkEntryImage.findMany({ where: { entryId: entry.id } });
    expect(images).toHaveLength(1);
    expect(images[0].url).toBe(img(9).url);
  });
});

describe('ArtworkService image positions', () => {
  it('renumbers remaining images 1..N-1 after deleting a middle position', async () => {
    const artwork = await createArtwork('delete-middle-image');
    const entry = await artworkService.createEntry(artwork.id, {
      columns: 3,
      images: [img(1), img(2), img(3)],
      displayOrder: 1,
    });

    await artworkService.deleteImage(entry.id, 2);

    const images = await artworkService.listImages(entry.id);
    expect(images.map((i) => i.position)).toEqual([1, 2]);
    expect(images.map((i) => i.url)).toEqual([img(1).url, img(3).url]);
  });
});

describe('ArtworkService.getArtworkBySlug', () => {
  it('returns a 3-column entry with images ordered by position', async () => {
    const artwork = await createArtwork('ordered-images');
    await artworkService.createEntry(artwork.id, {
      columns: 3,
      images: [img(1), img(2), img(3)],
      displayOrder: 1,
    });

    const found = await artworkService.getArtworkBySlug('ordered-images');
    expect(found?.entries[0].images.map((i) => i.position)).toEqual([1, 2, 3]);
    expect(found?.entries[0].images.map((i) => i.url)).toEqual([img(1).url, img(2).url, img(3).url]);
  });
});
