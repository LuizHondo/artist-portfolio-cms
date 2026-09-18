import { homeV1Styles as hs } from "@/components/home/homeStyles";
import { PublicNav } from "@/components/PublicNav";
import { SiteFooter } from "@/components/SiteFooter";
import { getAbout } from "@/lib/api/about";
import { Icon, Paper } from "@/lib/design/shared";
import { CONTACT_EMAIL, enabledSocials } from "@/lib/social-links";
import { COLORS } from "@/lib/theme";

const s = {
	page: {
		width: "100%",
		maxWidth: 1440,
		margin: "0 auto",
		color: COLORS.ink,
		fontFamily: '"Newsreader", Georgia, serif',
	},
	hero: {
		display: "grid",
		gridTemplateColumns: "1fr 1fr",
		gap: 0,
		minHeight: 720,
	},
	heroImg: {
		width: "100%",
		height: "100%",
		objectFit: "cover" as const,
		display: "block",
	},
	heroRight: {
		padding: "72px 64px 72px",
		display: "flex",
		flexDirection: "column" as const,
		justifyContent: "center",
	},
	bigName: {
		fontFamily: '"Permanent Marker", cursive',
		fontSize: 88,
		lineHeight: 0.88,
		margin: 0,
		letterSpacing: "-0.018em",
	},
	bigTag: {
		fontFamily: '"IBM Plex Sans", "Helvetica Neue", sans-serif',
		fontSize: 12,
		letterSpacing: "0.2em",
		textTransform: "uppercase" as const,
		fontWeight: 600,
		opacity: 0.65,
		marginTop: 22,
	},
	bio: { marginTop: 36, fontSize: 19, lineHeight: 1.65, maxWidth: 540 },
	bioP: { marginBottom: 20 },
	body: {
		display: "grid",
		gridTemplateColumns: "1.4fr 1fr",
		gap: 64,
		padding: "96px 56px",
		borderTop: "1px solid rgba(26,23,20,0.12)",
	},
	h2: {
		fontFamily: '"Permanent Marker", cursive',
		fontSize: 36,
		margin: "0 0 28px",
		lineHeight: 1,
		letterSpacing: "-0.012em",
	},
	skills: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 32px" },
	skillRow: {
		display: "flex",
		alignItems: "baseline",
		justifyContent: "space-between",
		padding: "10px 0",
		borderBottom: "1px dotted rgba(26,23,20,0.25)",
	},
	skillName: {
		fontFamily: '"Permanent Marker", cursive',
		fontSize: 19,
		fontWeight: 400,
	},
	skillNum: {
		fontFamily: '"IBM Plex Sans", "Helvetica Neue", sans-serif',
		fontSize: 10,
		letterSpacing: "0.14em",
		opacity: 0.45,
	},
	colophon: { fontSize: 17, lineHeight: 1.65 },
	colophonRow: {
		display: "grid",
		gridTemplateColumns: "120px 1fr",
		padding: "10px 0",
		borderBottom: "1px solid rgba(26,23,20,0.12)",
	},
	colKey: {
		fontFamily: '"IBM Plex Sans", "Helvetica Neue", sans-serif',
		fontSize: 11,
		letterSpacing: "0.15em",
		opacity: 0.55,
		textTransform: "uppercase" as const,
	},
	colVal: {
		fontFamily: '"Permanent Marker", cursive',
		fontSize: 17,
		fontWeight: 400,
	},
	cta: {
		padding: "64px 56px 96px",
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center",
		borderTop: "1px solid rgba(26,23,20,0.12)",
	},
	ctaText: {
		fontFamily: '"Permanent Marker", cursive',
		fontSize: 44,
		margin: 0,
		letterSpacing: "-0.014em",
	},
	ctaBtns: { display: "flex", gap: 12 },
	btnDark: {
		display: "inline-flex",
		alignItems: "center",
		gap: 12,
		padding: "14px 26px",
		background: COLORS.ink,
		color: COLORS.cream,
		border: "none",
		fontFamily: '"IBM Plex Sans", "Helvetica Neue", sans-serif',
		fontSize: 11,
		letterSpacing: "0.18em",
		textTransform: "uppercase" as const,
		fontWeight: 700,
		cursor: "pointer",
	},
	socialChip: {
		display: "inline-flex",
		alignItems: "center",
		gap: 8,
		padding: "10px 14px",
		border: "1px solid rgba(26,23,20,0.3)",
		color: COLORS.ink,
		textDecoration: "none",
		fontFamily: '"IBM Plex Sans", "Helvetica Neue", sans-serif',
		fontSize: 12,
		letterSpacing: "0.12em",
		textTransform: "uppercase" as const,
		fontWeight: 600,
	},
	mailChip: {
		display: "inline-flex",
		alignItems: "center",
		gap: 8,
		padding: "10px 14px",
		background: COLORS.ink,
		color: COLORS.cream,
		textDecoration: "none",
		fontFamily: '"IBM Plex Sans", "Helvetica Neue", sans-serif',
		fontSize: 12,
		letterSpacing: "0.08em",
		fontWeight: 600,
	},
};

export default async function AboutPage() {
	const about = await getAbout();

	return (
		<Paper style={s.page}>
			<PublicNav active="About" variant="bar" />

			<div style={{ padding: "56px 56px 0" }}>
				<div style={hs.sectionHead}>
					<h2 style={hs.sectionTitle}>About</h2>
					<div style={hs.sectionSub}>Curitiba, Brazil · est. 2000</div>
				</div>
			</div>

			<section style={s.hero}>
				{/* biome-ignore lint/performance/noImgElement: admin-entered URL, arbitrary hosts */}
				<img src={about.heroImage} alt="Raul" style={s.heroImg} />
				<div style={s.heroRight}>
					<h1 style={s.bigName}>Raul Barbosa</h1>
					<div style={s.bigTag}>{about.tagline}</div>
					<div style={s.bio}>
						{about.bio.map((paragraph) => (
							<p key={paragraph} style={s.bioP}>
								{paragraph}
							</p>
						))}
					</div>

					<div
						style={{
							marginTop: 36,
							paddingTop: 24,
							borderTop: "1px solid rgba(26,23,20,0.18)",
						}}
					>
						<div
							style={{
								fontFamily: '"IBM Plex Sans", "Helvetica Neue", sans-serif',
								fontSize: 11,
								letterSpacing: "0.18em",
								opacity: 0.55,
								marginBottom: 14,
								textTransform: "uppercase",
							}}
						>
							Find me elsewhere
						</div>
						<div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
							{enabledSocials.map((social) => (
								<a
									key={social.key}
									href={social.url}
									target="_blank"
									rel="noreferrer"
									style={s.socialChip}
									title={social.url}
								>
									<Icon name={social.key} size={16} />
									<span>{social.label}</span>
								</a>
							))}
							<a href={`mailto:${CONTACT_EMAIL}`} style={s.mailChip}>
								<Icon name="mail" size={16} />
								<span>{CONTACT_EMAIL}</span>
							</a>
						</div>
					</div>
				</div>
			</section>

			<section style={s.body}>
				<div>
					<h2 style={s.h2}>Disciplines</h2>
					<div style={s.skills}>
						{about.disciplines.map((skill, i) => (
							<div key={skill} style={s.skillRow}>
								<span style={s.skillName}>{skill}</span>
								<span style={s.skillNum}>0{i + 1}</span>
							</div>
						))}
					</div>
				</div>

				<div>
					<h2 style={s.h2}>Colophon</h2>
					<div style={s.colophon}>
						{about.colophon.map((row) => (
							<div key={row.key} style={s.colophonRow}>
								<span style={s.colKey}>{row.key}</span>
								<span style={s.colVal}>{row.value}</span>
							</div>
						))}
					</div>
				</div>
			</section>

			<section style={s.cta}>
				<h3 style={s.ctaText}>Want the long version?</h3>
				<div style={s.ctaBtns}>
					<a
						href={`mailto:${CONTACT_EMAIL}`}
						style={{ ...s.btnDark, textDecoration: "none" }}
					>
						Get in touch <Icon name="arrow" size={14} color={COLORS.cream} />
					</a>
				</div>
			</section>

			<SiteFooter />
		</Paper>
	);
}
