"use client";

import Link from "next/link";
import { useState } from "react";
import { LogoMark } from "@/components/LogoMark";
import { COLORS } from "@/lib/theme";

// Shared Home / Artworks / About nav, matching home-v1.jsx's NavV1 link set
// and active-state logic. Home floats transparent over the hero (`hero`);
// every other page uses the artwork pages' static bordered bar (`bar`).
const links = [
	{ label: "Home", href: "/home" },
	{ label: "Artworks", href: "/artworks" },
	{ label: "About", href: "/about" },
] as const;

type Active = (typeof links)[number]["label"];

const logoWrap = {
	fontFamily: '"IBM Plex Sans", "Helvetica Neue", sans-serif',
	fontSize: 13,
	letterSpacing: "0.2em",
	textTransform: "uppercase" as const,
	fontWeight: 700,
	cursor: "pointer",
	overflow: "hidden",
};
const logoScript = {
	fontFamily: '"Permanent Marker", cursive',
	fontSize: 64,
	letterSpacing: 0,
	textTransform: "none" as const,
	marginRight: 12,
};
const navLinksRow = {
	display: "flex",
	gap: 26,
	fontFamily: '"IBM Plex Sans", "Helvetica Neue", sans-serif',
	fontSize: 12,
	letterSpacing: "0.16em",
	textTransform: "uppercase" as const,
	fontWeight: 600,
};

const variants = {
	// home-v1.jsx: absolute over the hero, cream text
	hero: {
		nav: {
			position: "absolute" as const,
			top: 0,
			left: 0,
			right: 0,
			zIndex: 5,
			display: "flex",
			alignItems: "center",
			justifyContent: "space-between",
			padding: "24px 56px",
			color: COLORS.cream,
		},
		link: {
			cursor: "pointer",
			opacity: 0.85,
			textDecoration: "none",
			color: "inherit",
		},
		linkActive: {
			color: COLORS.white,
			borderBottom: "1px solid rgba(255,255,255,0.7)",
			paddingBottom: 3,
			opacity: 1,
		},
	},
	// project-v2.jsx: static bordered bar, ink text
	bar: {
		nav: {
			display: "flex",
			alignItems: "center",
			justifyContent: "space-between",
			padding: "12px 24px",
			borderBottom: "1px solid rgba(26,23,20,0.25)",
			color: COLORS.ink,
		},
		link: { cursor: "pointer", textDecoration: "none", color: "inherit" },
		linkActive: { color: COLORS.accent },
	},
};

export function PublicNav({
	active,
	variant,
	locked = false,
}: {
	active?: Active;
	variant: keyof typeof variants;
	locked?: boolean;
}) {
	const v = variants[variant];
	const [menuOpen, setMenuOpen] = useState(false);
	return (
		<nav
			style={{
				...v.nav,
				position: "relative",
				opacity: locked ? 0 : 1,
				pointerEvents: locked ? "none" : "auto",
				transition: "opacity .8s",
			}}
			aria-hidden={locked}
		>
			<Link
				href="/home"
				className="logo-link"
				style={{
					...logoWrap,
					display: "inline-flex",
					alignItems: "center",
					justifyContent: "center",
					gap: 24,
				}}
				tabIndex={locked ? -1 : undefined}
			>
				<LogoMark size={100} />
				<span className="logo-wordmark">
					<span style={logoScript}>Raul Barbosa</span>
				</span>
			</Link>
			<div className="nav-links-row" style={navLinksRow}>
				{links.map((l) => (
					<Link
						key={l.label}
						href={l.href}
						tabIndex={locked ? -1 : undefined}
						style={{ ...v.link, ...(l.label === active ? v.linkActive : {}) }}
					>
						{l.label}
					</Link>
				))}
			</div>

			<button
				type="button"
				className="nav-burger"
				aria-label={menuOpen ? "Close menu" : "Open menu"}
				aria-expanded={menuOpen}
				onClick={() => setMenuOpen((o) => !o)}
				style={{
					background: "none",
					border: "none",
					color: "inherit",
					cursor: "pointer",
					padding: 8,
				}}
			>
				<svg
					width="20"
					height="20"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="1.5"
					strokeLinecap="round"
					aria-hidden="true"
				>
					{menuOpen ? (
						<path d="M5 5 L19 19 M19 5 L5 19" />
					) : (
						<path d="M4 7 H20 M4 12 H20 M4 17 H20" />
					)}
				</svg>
			</button>

			{menuOpen && (
				<div
					className="nav-mobile-menu"
					style={{
						position: "absolute",
						top: "100%",
						left: 0,
						right: 0,
						flexDirection: "column",
						background: variant === "hero" ? COLORS.ink : COLORS.background,
						color: variant === "hero" ? COLORS.cream : COLORS.ink,
					}}
				>
					{links.map((l) => (
						<Link
							key={l.label}
							href={l.href}
							onClick={() => setMenuOpen(false)}
							style={{
								padding: "16px 24px",
								textDecoration: "none",
								color: l.label === active ? COLORS.accent : "inherit",
								fontFamily: '"IBM Plex Sans", "Helvetica Neue", sans-serif',
								fontSize: 13,
								letterSpacing: "0.14em",
								textTransform: "uppercase" as const,
								fontWeight: 600,
							}}
						>
							{l.label}
						</Link>
					))}
				</div>
			)}
		</nav>
	);
}
