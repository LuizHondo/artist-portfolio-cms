import type { IconName } from "./design/shared";

// Hardcoded per proposal.md — no backend model or admin UI for these.
// Values match the design canvas's TWEAK_DEFAULTS (app.jsx).
export const CONTACT_EMAIL = "contato.raulneto.art@gmail.com";

export const SOCIAL_LINKS: Array<{
	key: IconName;
	label: string;
	url: string;
	show: boolean;
}> = [
	{ key: "x", label: "X", url: "https://x.com/RaulBN_", show: true },
	{
		key: "bluesky",
		label: "Bluesky",
		url: "https://bsky.app/profile/raulbn.bsky.social",
		show: true,
	},
	{ key: "cara", label: "Cara", url: "https://cara.app/raulbn", show: true },
	{ key: "vgen", label: "vGen", url: "https://vgen.co/RaulBN", show: true },
	{
		key: "artstation",
		label: "ArtStation",
		url: "https://www.artstation.com/raulbn",
		show: true,
	},
];

export const enabledSocials = SOCIAL_LINKS.filter((s) => s.show);
