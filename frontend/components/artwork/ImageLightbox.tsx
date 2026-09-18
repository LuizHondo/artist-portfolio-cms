"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";
import { Icon } from "@/lib/design/shared";

/**
 * Wraps a region of the artwork page and opens any <img> clicked inside it in a
 * full-screen dialog. Delegation means the server component keeps rendering
 * plain <img> tags — no per-image wiring — and the effect below promotes them to
 * focusable buttons so keyboard users get the same affordance.
 */
export function ImageLightbox({ children }: { children: ReactNode }) {
	const zoneRef = useRef<HTMLDivElement>(null);
	const dialogRef = useRef<HTMLDialogElement>(null);
	const [shot, setShot] = useState<{ src: string; alt: string } | null>(null);

	useEffect(() => {
		for (const img of zoneRef.current?.querySelectorAll("img") ?? []) {
			img.tabIndex = 0;
			img.setAttribute("role", "button");
		}
	}, []);

	const open = (img: HTMLImageElement) => {
		setShot({ src: img.currentSrc || img.src, alt: img.alt });
		dialogRef.current?.showModal();
	};

	return (
		<>
			{/* biome-ignore lint/a11y/noStaticElementInteractions: delegation target for the images inside, which the effect above makes focusable buttons */}
			<div
				ref={zoneRef}
				className="lightbox-zone"
				style={{ display: "contents" }}
				onClick={(e) => {
					const img = (e.target as HTMLElement).closest("img");
					if (img) open(img);
				}}
				onKeyDown={(e) => {
					if (e.key !== "Enter" && e.key !== " ") return;
					const img = (e.target as HTMLElement).closest("img");
					if (!img) return;
					e.preventDefault();
					open(img);
				}}
			>
				{children}
			</div>

			{/* biome-ignore lint/a11y/useKeyWithClickEvents: backdrop click-to-close; Esc and the close button cover keyboards */}
			<dialog
				ref={dialogRef}
				className="lightbox"
				aria-label={shot ? `${shot.alt} — enlarged` : undefined}
				onClick={(e) => {
					if (e.target === dialogRef.current) dialogRef.current.close();
				}}
				onClose={() => setShot(null)}
			>
				{shot && (
					// biome-ignore lint/performance/noImgElement: arbitrary admin-entered URL
					<img src={shot.src} alt={shot.alt} className="lightbox-img" />
				)}
				<button
					type="button"
					className="lightbox-close"
					aria-label="Close image"
					onClick={() => dialogRef.current?.close()}
				>
					<Icon name="close" size={18} />
				</button>
			</dialog>
		</>
	);
}
