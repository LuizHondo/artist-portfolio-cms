import type { About } from "../types";
import { fetchJson } from "./artworks";

export async function getAbout(): Promise<About> {
	const { data } = await fetchJson<{ data: About }>("/about");
	return data;
}
