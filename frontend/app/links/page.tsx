import Link from 'next/link';
import { getFeatured } from '@/lib/api/artworks';
import { Icon } from '@/lib/design/shared';
import { CONTACT_EMAIL, enabledSocials } from '@/lib/social-links';
import { COLORS } from '@/lib/theme';

const s = {
  page: {
    width: '100%',
    minHeight: 1000,
    color: COLORS.cream,
    fontFamily: '"Newsreader", Georgia, serif',
    background: COLORS.ink,
    padding: '64px 0 96px',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
  },
  inner: { width: '100%', maxWidth: 480, padding: '0 20px' },
  avatar: {
    width: 140,
    height: 140,
    borderRadius: 999,
    background: COLORS.cream,
    margin: '0 auto 20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    boxShadow: '0 12px 32px rgba(0,0,0,0.4)',
  },
  avatarImg: { width: '100%', height: '100%', objectFit: 'cover' as const, display: 'block' },
  name: {
    fontFamily: '"Gambetta", "Hoefler Text", Georgia, serif',
    fontSize: 52,
    margin: 0,
    textAlign: 'center' as const,
    lineHeight: 1,
    letterSpacing: '-0.014em',
    fontWeight: 500,
  },
  handle: {
    fontFamily: '"IBM Plex Sans", "Helvetica Neue", sans-serif',
    fontSize: 11,
    textTransform: 'uppercase' as const,
    fontWeight: 500,
    letterSpacing: '0.22em',
    opacity: 0.6,
    textAlign: 'center' as const,
    marginTop: 12,
  },
  tag: { fontSize: 18, opacity: 0.75, lineHeight: 1.5, textAlign: 'center' as const, marginTop: 16 },
  rule: { width: 40, height: 1, background: 'rgba(244,236,216,0.4)', margin: '36px auto' },
  btnList: { display: 'flex', flexDirection: 'column' as const, gap: 12 },
  btn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '18px 22px',
    background: 'rgba(244,236,216,0.06)',
    border: '1px solid rgba(244,236,216,0.2)',
    color: COLORS.cream,
    fontFamily: '"Gambetta", "Hoefler Text", Georgia, serif',
    fontSize: 19,
    fontWeight: 500,
    textDecoration: 'none',
  },
  btnLeft: { display: 'flex', alignItems: 'center', gap: 14 },
  btnHandle: { fontFamily: '"IBM Plex Sans", "Helvetica Neue", sans-serif', fontSize: 11, letterSpacing: '0.06em', opacity: 0.55 },
  btnFeatured: { background: COLORS.cream, color: COLORS.ink, border: `1px solid ${COLORS.cream}` },
  foot: {
    marginTop: 56,
    textAlign: 'center' as const,
    fontFamily: '"IBM Plex Sans", "Helvetica Neue", sans-serif',
    fontSize: 10,
    fontWeight: 500,
    letterSpacing: '0.2em',
    opacity: 0.45,
  },
  backToSite: {
    marginTop: 18,
    textAlign: 'center' as const,
    fontFamily: '"IBM Plex Sans", "Helvetica Neue", sans-serif',
    fontSize: 11,
    letterSpacing: '0.18em',
    textTransform: 'uppercase' as const,
    fontWeight: 600,
    textDecoration: 'underline',
    textUnderlineOffset: 4,
    opacity: 0.8,
    display: 'block',
  },
};

function subFor(url: string) {
  try {
    const u = new URL(url);
    return u.pathname === '/' || u.pathname === '' ? u.hostname : u.pathname;
  } catch {
    return url;
  }
}

export default async function LinksPage() {
  const featured = await getFeatured().catch(() => []);
  const latest = featured[0];

  const links = [
    ...(latest
      ? [{ label: 'Latest Project', sub: latest.title, icon: 'arrow' as const, featured: true, href: `/artwork/${latest.slug}` }]
      : []),
    ...enabledSocials.map((social) => ({
      label: social.label,
      sub: subFor(social.url),
      icon: social.key,
      featured: false,
      href: social.url,
    })),
    { label: 'Email', sub: CONTACT_EMAIL, icon: 'mail' as const, featured: false, href: `mailto:${CONTACT_EMAIL}` },
  ];

  return (
    <div style={s.page}>
      <div style={s.inner}>
        <div style={s.avatar}>
          {/* eslint-disable-next-line @next/next/no-img-element -- static portrait */}
          <img src="https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&q=70" alt="Raul" style={s.avatarImg} />
        </div>
        <h1 style={s.name}>Raul Barbosa</h1>
        <div style={s.handle}>@RAULNETO.ART</div>
        <div style={s.tag}>Illustrator · concept art · books, cats &amp; coffee</div>

        <div style={s.rule} />

        <div style={s.btnList}>
          {links.map((l) => {
            const inner = (
              <>
                <div style={s.btnLeft}>
                  <Icon name={l.icon} size={20} color={l.featured ? COLORS.ink : COLORS.cream} />
                  <div>
                    <div>{l.label}</div>
                    <div style={{ ...s.btnHandle, color: l.featured ? 'rgba(26,23,20,0.55)' : 'rgba(244,236,216,0.55)' }}>{l.sub}</div>
                  </div>
                </div>
                <Icon name="arrow" size={16} color={l.featured ? COLORS.ink : COLORS.cream} />
              </>
            );
            const style = { ...s.btn, ...(l.featured ? s.btnFeatured : {}) };
            if (l.href.startsWith('/')) {
              return (
                <Link key={l.label} href={l.href} style={style}>
                  {inner}
                </Link>
              );
            }
            return (
              <a key={l.label} href={l.href} target={l.href.startsWith('mailto:') ? undefined : '_blank'} rel="noreferrer" style={style}>
                {inner}
              </a>
            );
          })}
        </div>

        <Link href="/" style={s.backToSite}>
          ← back to raulneto.art
        </Link>
        <div style={s.foot}>© 2026 RAUL BARBOSA · ALL WORK SHOWN</div>
      </div>
    </div>
  );
}
