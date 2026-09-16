import Link from 'next/link';
import { getFeatured } from '@/lib/api/artworks';
import { CONTACT_EMAIL, enabledSocials } from '@/lib/social-links';
import { COLORS } from '@/lib/theme';

const footerStyles = {
  wrap: { background: COLORS.black, color: COLORS.white, containerType: 'inline-size', overflow: 'hidden', padding: '120px 0 0' },
  top: {
    display: 'grid',
    gridTemplateColumns: 'minmax(0,1.15fr) minmax(0,1fr)',
    gap: 64,
    padding: '0 clamp(24px,4cqw,64px)',
    alignItems: 'start',
  },
  ctaLabel: {
    fontFamily: '"IBM Plex Sans", "Helvetica Neue", sans-serif',
    fontSize: 11,
    letterSpacing: '0.24em',
    textTransform: 'uppercase' as const,
    color: 'rgba(255,255,255,0.5)',
    margin: '0 0 24px',
  },
  ctaLink: {
    display: 'block',
    fontFamily: '"Gambetta", "Hoefler Text", Georgia, serif',
    fontWeight: 500,
    fontStyle: 'italic' as const,
    fontSize: 'clamp(36px,5.4cqw,82px)',
    lineHeight: 0.94,
    letterSpacing: '-0.018em',
    color: COLORS.white,
    textDecoration: 'none',
    margin: 0,
  },
  ctaMail: {
    display: 'inline-block',
    marginTop: 26,
    fontFamily: '"IBM Plex Sans", "Helvetica Neue", sans-serif',
    fontSize: 13,
    letterSpacing: '0.06em',
    color: 'rgba(255,255,255,0.62)',
    textDecoration: 'none',
    borderBottom: '1px solid rgba(255,255,255,0.3)',
    paddingBottom: 2,
  },
  cols: { display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0,1fr))', gap: 32, paddingTop: 10 },
  colHead: {
    fontFamily: '"IBM Plex Sans", "Helvetica Neue", sans-serif',
    fontSize: 10,
    letterSpacing: '0.22em',
    textTransform: 'uppercase' as const,
    color: 'rgba(255,255,255,0.4)',
    margin: '0 0 16px',
  },
  colList: { display: 'flex', flexDirection: 'column' as const, gap: 9, margin: 0, padding: 0, listStyle: 'none' },
  colItem: {
    fontFamily: '"Gambetta", "Hoefler Text", Georgia, serif',
    fontSize: 17,
    fontWeight: 400,
    letterSpacing: 0,
    color: 'rgba(255,255,255,0.82)',
    textDecoration: 'none',
    cursor: 'pointer',
    background: 'none',
    border: 0,
    padding: 0,
    textAlign: 'left' as const,
  },
  gap: { height: 'clamp(120px,14cqw,220px)' },
  markRow: { padding: '0 0 clamp(18px,2cqw,34px)' },
  mark: {
    fontFamily: '"Gambetta", "Hoefler Text", Georgia, serif',
    fontSize: '15.4cqw',
    lineHeight: 0.78,
    letterSpacing: '-0.018em',
    fontWeight: 500,
    whiteSpace: 'nowrap' as const,
    margin: 0,
    width: '108cqw',
    marginLeft: '-4cqw',
    textAlign: 'center' as const,
    color: COLORS.white,
  },
  legal: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    justifyContent: 'space-between',
    gap: 16,
    padding: '0 clamp(24px,4cqw,64px) 34px',
    fontFamily: '"IBM Plex Sans", "Helvetica Neue", sans-serif',
    fontSize: 11,
    letterSpacing: '0.18em',
    textTransform: 'uppercase' as const,
    color: 'rgba(255,255,255,0.38)',
  },
};

export async function SiteFooter() {
  const featured = await getFeatured().catch(() => []);
  const latest = featured[0];

  return (
    <footer style={footerStyles.wrap}>
      <div style={footerStyles.top}>
        <div>
          <p style={footerStyles.ctaLabel}>Commissions open — 2026</p>
          <a href={`mailto:${CONTACT_EMAIL}`} style={footerStyles.ctaLink}>
            Let&rsquo;s make
            <br />
            something
          </a>
          <a href={`mailto:${CONTACT_EMAIL}`} style={footerStyles.ctaMail}>
            {CONTACT_EMAIL}
          </a>
        </div>
        <div style={footerStyles.cols}>
          <div>
            <p style={footerStyles.colHead}>Index</p>
            <ul style={footerStyles.colList}>
              <li>
                <Link href="/" style={footerStyles.colItem}>
                  Work
                </Link>
              </li>
              {latest && (
                <li>
                  <Link href={`/artwork/${latest.slug}`} style={footerStyles.colItem}>
                    Latest project
                  </Link>
                </li>
              )}
              <li>
                <Link href="/about" style={footerStyles.colItem}>
                  About
                </Link>
              </li>
              <li>
                <Link href="/links" style={footerStyles.colItem}>
                  Links
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p style={footerStyles.colHead}>Elsewhere</p>
            <ul style={footerStyles.colList}>
              {enabledSocials.map((s) => (
                <li key={s.key}>
                  <a href={s.url} target="_blank" rel="noreferrer" style={footerStyles.colItem}>
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p style={footerStyles.colHead}>Studio</p>
            <ul style={footerStyles.colList}>
              <li>
                <span style={footerStyles.colItem}>São Paulo, BR</span>
              </li>
              <li>
                <span style={footerStyles.colItem}>Illustration · Concept</span>
              </li>
              <li>
                <span style={footerStyles.colItem}>Character · Visual dev</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div style={footerStyles.gap} />

      <div style={footerStyles.markRow}>
        <div style={footerStyles.mark}>Raul Barbosa</div>
      </div>
      <div style={footerStyles.legal}>
        <span>© 2026 Raul Barbosa</span>
        <span>All artwork by the artist</span>
      </div>
    </footer>
  );
}
