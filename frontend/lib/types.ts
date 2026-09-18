export interface ArtworkEntryImage {
	url: string;
	title: string;
	description: string;
}

export interface ArtworkEntry {
	id: string;
	columns: number;
	images: ArtworkEntryImage[];
	displayOrder: number;
}

export interface About {
	tagline: string;
	bio: string[];
	heroImage: string;
	disciplines: string[];
	colophon: Array<{ key: string; value: string }>;
	updatedAt: string;
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
	updatedAt: string;
	entries: ArtworkEntry[];
	artworkTags: Array<{ tag: Tag }>;
}
