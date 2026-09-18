import type { Tag } from "../types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getTags(): Promise<Tag[]> {
	const res = await fetch(`${API_URL}/tags`, { cache: "no-store" });
	if (!res.ok) throw new Error(`Request to /tags failed with ${res.status}`);
	const { data } = await res.json();
	return data;
}
