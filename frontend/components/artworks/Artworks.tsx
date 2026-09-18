"use client";

import Link from "next/link";
import { useState } from "react";
import { homeV1Styles as s } from "@/components/home/homeStyles";
import { PlaceholderImg } from "@/lib/design/shared";
import { COLORS } from "@/lib/theme";
import type { Artwork } from "@/lib/types";
import { useIsMobile } from "@/lib/useIsMobile";

export function Artworks({ artworks }: { artworks: Artwork[] }) {
	const isMobile = useIsMobile();
	const [filter, setFilter] = useState("All");

	const mediums = [
		"All",
		...Array.from(new Set(artworks.map((a) => a.medium.split(" · ")[0]))),
	];
	const shown = artworks.filter(
		(a) => filter === "All" || a.medium.startsWith(filter),
	);
	const years = artworks.map((a) => a.yearCreated);

	return (
		<section
			style={{ ...s.section, ...(isMobile ? { padding: "56px 20px" } : {}) }}
		>
			<div style={s.sectionHead}>
				<h2 style={s.sectionTitle}>Artworks</h2>
				{artworks.length > 0 && (
					<div style={s.sectionSub}>
						{Math.min(...years)} — {Math.max(...years)} · {artworks.length}{" "}
						artworks
					</div>
				)}
			</div>

			<div style={s.filters}>
				{mediums.map((m) => (
					<button
						key={m}
						type="button"
						onClick={() => setFilter(m)}
						style={{ ...s.filter, ...(m === filter ? s.filterActive : {}) }}
					>
						{m}
					</button>
				))}
			</div>

			<div
				style={{
					...s.tier2Grid,
					marginBottom: 0,
					...(isMobile ? { gridTemplateColumns: "1fr", gap: 24 } : {}),
				}}
			>
				{shown.map((a) => (
					<Link
						key={a.id}
						href={`/artwork/${a.slug}`}
						style={s.card}
						className="gallery-card"
					>
						<PlaceholderImg src={a.coverImage} ratio="1/1" />
						<div className="gallery-overlay" style={s.cardOverlay}>
							<h3 style={{ ...s.cardTitle, fontSize: 18, color: COLORS.cream }}>
								{a.title}
							</h3>
							<div style={s.cardOverlayMeta}>
								{a.yearCreated} · {a.medium}
							</div>
						</div>
					</Link>
				))}
			</div>

			{shown.length === 0 && (
				<div style={s.empty}>Nothing in this medium yet.</div>
			)}
		</section>
	);
}
