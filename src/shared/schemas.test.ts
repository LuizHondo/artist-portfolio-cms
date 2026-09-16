import { ArtworkEntrySchema } from './schemas.js';

const validImage = { url: 'https://example.com/a.png', title: 'A', description: 'desc' };

describe('ArtworkEntrySchema', () => {
  it('accepts a valid entry', () => {
    const result = ArtworkEntrySchema.safeParse({ columns: 2, images: [validImage, validImage], displayOrder: 1 });
    expect(result.success).toBe(true);
  });

  it('rejects missing columns', () => {
    const result = ArtworkEntrySchema.safeParse({ images: [validImage], displayOrder: 1 });
    expect(result.success).toBe(false);
  });

  it('rejects columns out of 1-5 range', () => {
    const result = ArtworkEntrySchema.safeParse({ columns: 6, images: [validImage], displayOrder: 1 });
    expect(result.success).toBe(false);
  });

  it('rejects image count mismatch', () => {
    const result = ArtworkEntrySchema.safeParse({ columns: 2, images: [validImage], displayOrder: 1 });
    expect(result.success).toBe(false);
  });

  it('rejects an empty images array', () => {
    const result = ArtworkEntrySchema.safeParse({ columns: 1, images: [], displayOrder: 1 });
    expect(result.success).toBe(false);
  });

  it('rejects an incomplete image', () => {
    const result = ArtworkEntrySchema.safeParse({
      columns: 1,
      images: [{ url: 'https://example.com/a.png', title: 'A' }],
      displayOrder: 1,
    });
    expect(result.success).toBe(false);
  });
});
