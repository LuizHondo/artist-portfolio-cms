import Link from 'next/link';
import { COLORS } from '@/lib/theme';
import { LogoMark } from '@/components/LogoMark';

// Shared Home / Artworks / About nav, matching home-v1.jsx's NavV1 link set
// and active-state logic. Home floats transparent over the hero (`hero`);
// every other page uses the artwork pages' static bordered bar (`bar`).
const links = [
  { label: 'Home', href: '/home' },
  { label: 'Artworks', href: '/artworks' },
  { label: 'About', href: '/about' },
] as const;

type Active = (typeof links)[number]['label'];

const logoWrap = {
  fontFamily: '"IBM Plex Sans", "Helvetica Neue", sans-serif',
  fontSize: 13,
  letterSpacing: '0.2em',
  textTransform: 'uppercase' as const,
  fontWeight: 700,
  cursor: 'pointer',
  overflow: 'hidden',
};
const logoScript = {
  fontFamily: '"Permanent Marker", cursive',
  fontSize: 64,
  letterSpacing: 0,
  textTransform: 'none' as const,
  marginRight: 12,
};
const navLinksRow = {
  display: 'flex',
  gap: 26,
  fontFamily: '"IBM Plex Sans", "Helvetica Neue", sans-serif',
  fontSize: 12,
  letterSpacing: '0.16em',
  textTransform: 'uppercase' as const,
  fontWeight: 600,
};

const variants = {
  // home-v1.jsx: absolute over the hero, cream text
  hero: {
    nav: {
      position: 'absolute' as const,
      top: 0,
      left: 0,
      right: 0,
      zIndex: 5,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '24px 56px',
      color: COLORS.cream,
    },
    link: { cursor: 'pointer', opacity: 0.85, textDecoration: 'none', color: 'inherit' },
    linkActive: {
      color: COLORS.white,
      borderBottom: '1px solid rgba(255,255,255,0.7)',
      paddingBottom: 3,
      opacity: 1,
    },
  },
  // project-v2.jsx: static bordered bar, ink text
  bar: {
    nav: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '12px 24px',
      borderBottom: '1px solid rgba(26,23,20,0.25)',
      color: COLORS.ink,
    },
    link: { cursor: 'pointer', textDecoration: 'none', color: 'inherit' },
    linkActive: { color: COLORS.accent },
  },
};

export function PublicNav({ active, variant, locked = false }: { active?: Active; variant: keyof typeof variants; locked?: boolean }) {
  const v = variants[variant];
  return (
    <nav style={{ ...v.nav, opacity: locked ? 0 : 1, pointerEvents: locked ? 'none' : 'auto', transition: 'opacity .8s' }} aria-hidden={locked}>
      <Link
        href="/home"
        className="logo-link"
        style={{ ...logoWrap, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',gap:24 }}
        tabIndex={locked ? -1 : undefined}
      >
        <LogoMark size={100} />
        <span className="logo-wordmark">
          <span style={logoScript}>Raul Barbosa</span>
        </span>
      </Link>
      <div style={navLinksRow}>
        {links.map((l) => (
          <Link key={l.label} href={l.href} tabIndex={locked ? -1 : undefined} style={{ ...v.link, ...(l.label === active ? v.linkActive : {}) }}>
            {l.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
