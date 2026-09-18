import { homeV1Styles as hs } from "@/components/home/homeStyles";
import { PublicNav } from "@/components/PublicNav";
import { SiteFooter } from "@/components/SiteFooter";
import { Icon, Paper } from "@/lib/design/shared";
import { CONTACT_EMAIL, enabledSocials } from "@/lib/social-links";
import { COLORS } from "@/lib/theme";

// No backend model for bio/skills copy (proposal.md) — local constants,
// matching the design canvas's data.jsx RAUL.perfil.
const SKILLS = [
	"Illustration",
	"Character Design",
	"Concept Art",
	"Storyboard",
	"Environment Design",
	"Visual Development",
];

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

export default function AboutPage() {
	return (
		<Paper style={s.page}>
			<PublicNav active="About" variant="bar" />

			<div style={{ padding: "56px 56px 0" }}>
				<div style={hs.sectionHead}>
					<h2 style={hs.sectionTitle}>About</h2>
					<div style={hs.sectionSub}>Curitiba, Brazil · est. 1998</div>
				</div>
			</div>

			<section style={s.hero}>
				{/* biome-ignore lint/performance/noImgElement: static portrait, not from an admin-entered URL */}
				<img
					src="https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=1200&q=70"
					alt="Raul"
					style={s.heroImg}
				/>
				<div style={s.heroRight}>
					<h1 style={s.bigName}>Raul Barbosa</h1>
					<div style={s.bigTag}>
						Illustrator · Character Design · Concept Art
					</div>
					<div style={s.bio}>
						<p style={s.bioP}>
							What&apos;s up — I&apos;m a Brazilian illustrator passionate about
							coffee, cats, and beautifully designed books.
						</p>
						<p style={s.bioP}>
							With a background in Animation Design, I focus on the conceptual
							side of projects — ideation, planning, and visual development. I
							love stories where a single frame holds enough light, shadow, and
							acting to make you stop and look closer.
						</p>
						<p style={s.bioP}>
							Available for commissions, concept work, and the occasional cover.
						</p>
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
						{SKILLS.map((skill, i) => (
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
						<div style={s.colophonRow}>
							<span style={s.colKey}>Tools</span>
							<span style={s.colVal}>Procreate · Photoshop · pencil</span>
						</div>
						<div style={s.colophonRow}>
							<span style={s.colKey}>Clients</span>
							<span style={s.colVal}>vGen · Editora Aleph · Folha</span>
						</div>
						<div style={s.colophonRow}>
							<span style={s.colKey}>Awards</span>
							<span style={s.colVal}>vGen Wings 2026 · Honorable Mention</span>
						</div>
						<div style={s.colophonRow}>
							<span style={s.colKey}>Speaks</span>
							<span style={s.colVal}>Portuguese · English</span>
						</div>
						<div style={s.colophonRow}>
							<span style={s.colKey}>Lives</span>
							<span style={s.colVal}>Curitiba, with two cats</span>
						</div>
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
