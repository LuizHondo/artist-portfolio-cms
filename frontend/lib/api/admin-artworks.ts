import type { Artwork, ArtworkEntry } from "../types";
import client from "./client";

export const adminArtworksApi = {
	create: (data: Record<string, unknown>) =>
		client.post<{ success: boolean; data: Artwork }>("/admin/artworks", data),

	update: (id: string, data: Record<string, unknown>) =>
		client.put<{ success: boolean; data: Artwork }>(
			`/admin/artworks/${id}`,
			data,
		),

	delete: (id: string) =>
		client.delete<{ success: boolean; message: string }>(
			`/admin/artworks/${id}`,
		),

	createEntry: (artworkId: string, data: Partial<ArtworkEntry>) =>
		client.post<{ success: boolean; data: ArtworkEntry }>(
			`/admin/artworks/${artworkId}/entries`,
			data,
		),

	updateEntry: (entryId: string, data: Partial<ArtworkEntry>) =>
		client.put<{ success: boolean; data: ArtworkEntry }>(
			`/admin/entries/${entryId}`,
			data,
		),

	deleteEntry: (entryId: string) =>
		client.delete<{ success: boolean; message: string }>(
			`/admin/entries/${entryId}`,
		),
};
