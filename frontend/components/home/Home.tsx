"use client";

import Link from "next/link";
import { PlaceholderImg } from "@/lib/design/shared";
import { COLORS } from "@/lib/theme";
import type { Artwork } from "@/lib/types";
import { useIsMobile } from "@/lib/useIsMobile";
import { homeV1Styles as s } from "./homeStyles";
import ParallaxCarousel from "./ParallaxCarousel";

export function Home({ artworks }: { artworks: Artwork[] }) {
	const isMobile = useIsMobile();

	// featuredPriority drives placement: 0 never appears, 1 leads, 2 mid,
	// 3 gets the archive rail.
	const shown = artworks.filter((a) => a.featuredPriority > 0);
	const tier = (p: number) => shown.filter((a) => a.featuredPriority === p);
	const t1 = tier(1);
	const t2 = tier(2);
	const t3 = tier(3);
	const years = shown.map((a) => a.yearCreated);

	return (
		<section
			id="gallery"
			style={{ ...s.section, ...(isMobile ? { padding: "56px 20px" } : {}) }}
		>
			<div style={s.sectionHead}>
				<h2 style={s.sectionTitle}>Featured Works</h2>
				{shown.length > 0 && (
					<div style={s.sectionSub}>
						{Math.min(...years)} — {Math.max(...years)} · {shown.length}{" "}
						artworks
					</div>
				)}
			</div>

			{t1.length > 0 && (
				<>
					<div style={s.tierHead}>
						<span style={s.tierLabel}>Featured</span>
						<span style={s.tierNote}>priority 01</span>
					</div>
					<div
						style={{
							...s.tier1Grid,
							...(isMobile ? { gridTemplateColumns: "1fr", gap: 36 } : {}),
						}}
					>
						{t1.map((a) => (
							<Link
								key={a.id}
								href={`/artwork/${a.slug}`}
								style={s.card}
								className="gallery-card"
							>
								<PlaceholderImg src={a.coverImage} ratio="4/3" />
								<div className="gallery-overlay" style={s.cardOverlay}>
									<h3
										style={{
											...s.cardTitle,
											fontSize: 26,
											color: COLORS.cream,
										}}
									>
										{a.title}
									</h3>
									<div style={s.cardOverlayMeta}>
										{a.yearCreated} · {a.medium}
									</div>
									<p style={s.cardOverlaySummary}>{a.summary}</p>
								</div>
							</Link>
						))}
					</div>
				</>
			)}

			{t2.length > 0 && (
				<>
					<div style={s.tierHead}>
						<span style={s.tierLabel}>Also worth a look</span>
						<span style={s.tierNote}>priority 02</span>
					</div>
					<div
						style={{
							...s.tier2Grid,
							...(isMobile ? { gridTemplateColumns: "1fr", gap: 24 } : {}),
						}}
					>
						{t2.map((a) => (
							<Link
								key={a.id}
								href={`/artwork/${a.slug}`}
								style={s.card}
								className="gallery-card"
							>
								<PlaceholderImg src={a.coverImage} ratio="1/1" />
								<div className="gallery-overlay" style={s.cardOverlay}>
									<h3
										style={{
											...s.cardTitle,
											fontSize: 18,
											color: COLORS.cream,
										}}
									>
										{a.title}
									</h3>
									<div style={s.cardOverlayMeta}>
										{a.yearCreated} · {a.medium}
									</div>
								</div>
							</Link>
						))}
					</div>
				</>
			)}

			{t3.length > 0 && (
				<>
					<div style={s.tierHead}>
						<span style={s.tierLabel}>Archive</span>
						<span style={s.tierNote}>priority 03</span>
					</div>
					<div
						style={{
							width: "100%",
							height: isMobile ? 320 : 420,
							background: COLORS.background,
						}}
					>
						<ParallaxCarousel
							images={t3.slice(0, 10).map((a) => a.coverImage)}
							items={t3.slice(0, 10).map((a) => ({
								href: `/artwork/${a.slug}`,
								content: (
									<div
										className="gallery-overlay"
										style={{
											...s.cardOverlay,
											alignItems: "center",
											textAlign: "center",
										}}
									>
										<h3
											style={{
												...s.cardTitle,
												fontSize: 15,
												color: COLORS.cream,
											}}
										>
											{a.title}
										</h3>
										<div style={s.cardOverlayMeta}>{a.yearCreated}</div>
									</div>
								),
							}))}
							imageWidth={isMobile ? 190 : 260}
							imageHeight={isMobile ? 250 : 340}
							gap={isMobile ? 20 : 32}
							parallaxIntensity={0.50}
							borderRadius={0}
							loop
							autoplaySpeed={100}
						/>
					</div>
					<div style={{ textAlign: "center", marginTop: 16 }}>
						<Link
							href="/artworks"
							style={{ ...s.tierNote, textDecoration: "underline" }}
						>
							Browse the full archive
						</Link>
					</div>
				</>
			)}

			{t1.length + t2.length + t3.length === 0 && (
				<div style={s.empty}>Nothing here yet.</div>
			)}
		</section>
	);
}
