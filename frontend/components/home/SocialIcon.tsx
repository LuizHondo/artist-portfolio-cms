"use client";

import gsap from "gsap";
import { useRef } from "react";
import { Icon } from "@/lib/design/shared";
import { COLORS } from "@/lib/theme";

// Visual hover: cream fill wipes in behind the icon, the icon inverts to ink,
// and a soft glow blooms outward. Uses gsap (already a project dependency)
// instead of a new hover-effects library.
export function SocialIcon({
	socialKey,
	url,
	size = 14,
	style,
}: {
	socialKey: string;
	url: string;
	size?: number;
	style?: React.CSSProperties;
}) {
	const wrapRef = useRef<HTMLAnchorElement>(null);
	const fillRef = useRef<HTMLSpanElement>(null);
	const iconRef = useRef<HTMLSpanElement>(null);

	const onEnter = () => {
		gsap.killTweensOf([fillRef.current, iconRef.current, wrapRef.current]);
		gsap.to(fillRef.current, {
			scale: 1,
			duration: 0.45,
			ease: "power3.out",
		});
		gsap.to(iconRef.current, {
			color: COLORS.ink,
			duration: 0.3,
			ease: "power2.out",
		});
		gsap.to(wrapRef.current, {
			boxShadow: `0 0 18px 2px ${COLORS.cream}80`,
			duration: 0.45,
			ease: "power3.out",
		});
	};

	const onLeave = () => {
		gsap.killTweensOf([fillRef.current, iconRef.current, wrapRef.current]);
		gsap.to(fillRef.current, {
			scale: 0,
			duration: 0.35,
			ease: "power3.in",
		});
		gsap.to(iconRef.current, {
			color: COLORS.cream,
			duration: 0.3,
			ease: "power2.in",
		});
		gsap.to(wrapRef.current, {
			boxShadow: "0 0 0px 0px rgba(0,0,0,0)",
			duration: 0.35,
			ease: "power3.in",
		});
	};

	return (
		<a
			ref={wrapRef}
			href={url}
			target="_blank"
			rel="noreferrer"
			title={url}
			style={{
				...style,
				textDecoration: "none",
				position: "relative",
				overflow: "hidden",
			}}
			onMouseEnter={onEnter}
			onMouseLeave={onLeave}
		>
			<span
				ref={fillRef}
				style={{
					position: "absolute",
					inset: 0,
					background: COLORS.cream,
					borderRadius: "inherit",
					transform: "scale(0)",
					transformOrigin: "center",
				}}
			/>
			<span
				ref={iconRef}
				style={{
					position: "relative",
					display: "flex",
					color: COLORS.cream,
				}}
			>
				<Icon name={socialKey} size={size} color="currentColor" />
			</span>
		</a>
	);
}
