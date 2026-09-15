export interface ArtworkEntry {
  id: string;
  title: string;
  imageUrl: string;
  description: string;
  size: 'small' | 'medium' | 'large';
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
  createdAt: string;
  entries: ArtworkEntry[];
  artworkTags: Array<{ tag: Tag }>;
}
