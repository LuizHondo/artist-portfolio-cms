"use client";

import gsap from "gsap";
import { useRef } from "react";
import { COLORS } from "@/lib/theme";

// Visual hover: the button inverts from cream-on-ink to ink-on-cream via a
// wipe, and lifts with a soft shadow. Uses gsap (already a project dependency).
export function EnterButton({
	href,
	onClick,
	style,
	children,
}: {
	href: string;
	onClick: (e: React.MouseEvent<HTMLAnchorElement>) => void;
	style?: React.CSSProperties;
	children: React.ReactNode;
}) {
	const wrapRef = useRef<HTMLAnchorElement>(null);
	const wipeRef = useRef<HTMLSpanElement>(null);
	const labelRef = useRef<HTMLSpanElement>(null);

	const onEnter = () => {
		gsap.killTweensOf([wipeRef.current, labelRef.current, wrapRef.current]);
		gsap.to(wipeRef.current, {
			scaleX: 1,
			duration: 0.35,
			ease: "power3.out",
		});
		gsap.to(labelRef.current, {
			color: COLORS.cream,
			duration: 0.25,
			ease: "power2.out",
		});
		gsap.to(wrapRef.current, {
			y: -2,
			boxShadow: "0 14px 34px rgba(0,0,0,0.38)",
			duration: 0.3,
			ease: "power2.out",
		});
	};

	const onLeave = () => {
		gsap.killTweensOf([wipeRef.current, labelRef.current, wrapRef.current]);
		gsap.to(wipeRef.current, {
			scaleX: 0,
			duration: 0.3,
			ease: "power3.in",
		});
		gsap.to(labelRef.current, {
			color: COLORS.ink,
			duration: 0.25,
			ease: "power2.in",
		});
		gsap.to(wrapRef.current, {
			y: 0,
			boxShadow: (style?.boxShadow as string) || "0 8px 28px rgba(0,0,0,0.28)",
			duration: 0.3,
			ease: "power2.in",
		});
	};

	return (
		<a
			ref={wrapRef}
			href={href}
			style={{ ...style, position: "relative", overflow: "hidden" }}
			onClick={onClick}
			onMouseEnter={onEnter}
			onMouseLeave={onLeave}
		>
			<span
				ref={wipeRef}
				style={{
					position: "absolute",
					inset: 0,
					background: COLORS.ink,
					transform: "scaleX(0)",
					transformOrigin: "left center",
					pointerEvents: "none",
				}}
			/>
			<span ref={labelRef} style={{ position: "relative", color: COLORS.ink }}>
				{children}
			</span>
		</a>
	);
}
