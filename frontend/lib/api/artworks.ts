import type { Artwork } from '../types';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function fetchJson<T>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error(`Request to ${path} failed with ${res.status}`);
  }
  return res.json();
}

export async function getArtworks(tag?: string): Promise<Artwork[]> {
  const qs = tag ? `?tag=${encodeURIComponent(tag)}` : '';
  const { data } = await fetchJson<{ data: Artwork[] }>(`/artworks${qs}`);
  return data;
}

export async function getFeatured(): Promise<Artwork[]> {
  const { data } = await fetchJson<{ data: Artwork[] }>('/artworks/featured');
  return data;
}

export async function getBySlug(slug: string): Promise<Artwork | null> {
  const res = await fetch(`${API_URL}/artworks/${slug}`, { cache: 'no-store' });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Request to /artworks/${slug} failed with ${res.status}`);
  const { data } = await res.json();
  return data;
}
