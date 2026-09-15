import Link from 'next/link';

// Shared Home / Artworks / About nav, matching home-v1.jsx's NavV1 link set
// and active-state logic. Each live page (home-v1, project-v2, about) styles
// its own nav bar differently in the source design — home's floats
// transparent over the hero, project/about render a static bordered bar —
// so this component is parameterized by `variant` to reproduce each
// pixel-for-pixel instead of forcing one look onto all three.
const links = [
  { label: 'Home', href: '/' },
  { label: 'Artworks', href: '/#gallery' },
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
};
const logoScript = {
  fontFamily: '"Gambetta", "Hoefler Text", Georgia, serif',
  fontStyle: 'italic' as const,
  fontWeight: 500,
  fontSize: 20,
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
      color: '#f6f4ef',
    },
    link: { cursor: 'pointer', opacity: 0.85, textDecoration: 'none', color: 'inherit' },
    linkActive: {
      color: '#fff',
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
      padding: '24px 64px',
      borderBottom: '1px solid rgba(26,23,20,0.25)',
      color: '#1a1714',
    },
    link: { cursor: 'pointer', textDecoration: 'none', color: 'inherit' },
    linkActive: { color: '#c4442a' },
  },
  // about.jsx: static bordered bar, slightly lighter border
  barLight: {
    nav: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '20px 56px',
      borderBottom: '1px solid rgba(26,23,20,0.12)',
      color: '#1a1714',
    },
    link: { cursor: 'pointer', opacity: 0.85, textDecoration: 'none', color: 'inherit' },
    linkActive: { color: '#c4442a', borderBottom: '1px solid #c4442a', paddingBottom: 2, opacity: 1 },
  },
};

export function PublicNav({ active, variant, locked = false }: { active: Active; variant: keyof typeof variants; locked?: boolean }) {
  const v = variants[variant];
  return (
    <nav style={{ ...v.nav, opacity: locked ? 0 : 1, pointerEvents: locked ? 'none' : 'auto', transition: 'opacity .8s' }} aria-hidden={locked}>
      <Link href="/" style={logoWrap} tabIndex={locked ? -1 : undefined}>
        <span style={logoScript}>Raul Barbosa</span>Illustrator &amp; Animator
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
