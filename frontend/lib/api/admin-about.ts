import type { About } from "../types";
import client from "./client";

export const adminAboutApi = {
	update: (data: Omit<About, "updatedAt">) =>
		client.put<{ success: boolean; data: About }>("/admin/about", data),
};
