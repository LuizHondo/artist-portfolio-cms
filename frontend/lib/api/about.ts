import type { About } from "../types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getAbout(): Promise<About> {
	const res = await fetch(`${API_URL}/about`, { cache: "no-store" });
	if (!res.ok) throw new Error(`Request to /about failed with ${res.status}`);
	const { data } = await res.json();
	return data;
}
