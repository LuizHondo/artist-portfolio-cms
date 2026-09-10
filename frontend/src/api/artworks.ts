import client from './client';

export interface ArtworkEntry {
  id: string;
  title: string;
  imageUrl: string;
  description: string;
  displayOrder: number;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface Artwork {
  id: string;
  title: string;
  slug: string;
  summary: string;
  coverImage: string;
  featuredPriority: number;
  medium: string;
  yearCreated: number;
  entries: ArtworkEntry[];
  artworkTags: Array<{ tag: Tag }>;
}

export const artworksApi = {
  // Public endpoints
  getAll: (tag?: string) =>
    client.get<{ success: boolean; count: number; data: Artwork[] }>('/artworks', {
      params: tag ? { tag } : undefined,
    }),

  getFeatured: () =>
    client.get<{ success: boolean; count: number; data: Artwork[] }>('/artworks/featured'),

  getBySlug: (slug: string) =>
    client.get<{ success: boolean; data: Artwork }>(`/artworks/${slug}`),

  // Admin endpoints
  create: (data: Partial<Artwork>) =>
    client.post<{ success: boolean; data: Artwork }>('/admin/artworks', data),

  update: (id: string, data: Partial<Artwork>) =>
    client.put<{ success: boolean; data: Artwork }>(`/admin/artworks/${id}`, data),

  delete: (id: string) =>
    client.delete<{ success: boolean; message: string }>(`/admin/artworks/${id}`),

  createEntry: (artworkId: string, data: Partial<ArtworkEntry>) =>
    client.post<{ success: boolean; data: ArtworkEntry }>(
      `/admin/artworks/${artworkId}/entries`,
      data
    ),

  updateEntry: (entryId: string, data: Partial<ArtworkEntry>) =>
    client.put<{ success: boolean; data: ArtworkEntry }>(`/admin/entries/${entryId}`, data),

  deleteEntry: (entryId: string) =>
    client.delete<{ success: boolean; message: string }>(`/admin/entries/${entryId}`),
};
