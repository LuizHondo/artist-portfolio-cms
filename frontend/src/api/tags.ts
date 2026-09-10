import client from './client';
import { Tag } from './artworks';

export const tagsApi = {
  getAll: () =>
    client.get<{ success: boolean; count: number; data: Tag[] }>('/tags'),

  getBySlug: (slug: string) =>
    client.get<{ success: boolean; data: Tag }>(`/tags/${slug}`),
};
