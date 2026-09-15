import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Paper, MarkText, Icon, PlaceholderImg } from '@/lib/design/shared';
import { getArtworks, getBySlug } from '@/lib/api/artworks';
import { PublicNav } from '@/components/PublicNav';
import { SiteFooter } from '@/components/SiteFooter';
import { CONTACT_EMAIL, enabledSocials } from '@/lib/social-links';
import { ACCENT_COLOR } from '@/lib/theme';
import { projV2Styles as s, SPAN } from '@/components/artwork/artworkStyles';

export default async function ArtworkPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const artwork = await getBySlug(slug);
  if (!artwork) notFound();

  const all = await getArtworks();
  const related = all.filter((x) => x.slug !== artwork.slug && x.featuredPriority > 0).slice(0, 6);
  const plate = String(all.findIndex((x) => x.slug === artwork.slug) + 1).padStart(3, '0');

  return (
    <Paper style={s.page}>
      <PublicNav active="Artworks" variant="bar" />

      <Link href="/" style={s.back}>
        <Icon name="arrow-left" size={16} /> back to all artworks
      </Link>

      <div style={s.titleBlock}>
        <div>
          <div style={s.plateNum}>
            No. {plate} · {artwork.medium.split(' · ')[0].toUpperCase()}
          </div>
          <h1 style={s.bigTitle}>{artwork.title}</h1>
        </div>
        <div style={s.meta}>
          <div style={s.metaRow}>
            <span style={s.metaKey}>Year</span>
            <span>{artwork.yearCreated}</span>
          </div>
          <div style={s.metaRow}>
            <span style={s.metaKey}>Medium</span>
            <span>{artwork.medium}</span>
          </div>
          <div style={s.metaRow}>
            <span style={s.metaKey}>Entries</span>
            <span>{artwork.entries.length}</span>
          </div>
          <div style={s.metaRow}>
            <span style={s.metaKey}>Added</span>
            <span>{new Date(artwork.createdAt).toISOString().slice(0, 10)}</span>
          </div>
        </div>
      </div>

      <div style={s.heroWrap}>
        <div>
          <div style={{ height: 820, background: '#e8e4dc', overflow: 'hidden' }}>
            {/* eslint-disable-next-line @next/next/no-img-element -- arbitrary admin-entered URL */}
            <img src={artwork.coverImage} alt={artwork.title} style={{ ...s.heroPlateImg, height: '100%' }} />
          </div>
          <div style={s.heroCaption}>{artwork.title} — cover</div>
        </div>
      </div>

      <div style={{ padding: '0 64px', maxWidth: 980 }}>
        <p style={{ fontSize: 27, lineHeight: 1.5, letterSpacing: '-0.005em' }}>{artwork.summary}</p>
      </div>

      <div style={s.entriesWrap}>
        {artwork.entries.map((entry, i) => {
          const [span, height] = SPAN[entry.size];
          // A run of consecutive small entries starts its own row, so three
          // smalls read as a three-up instead of filling a previous leftover.
          const startsRun = entry.size === 'small' && artwork.entries[i - 1]?.size !== 'small';
          return (
            <div
              key={entry.id}
              style={{ gridColumn: startsRun ? `1 / span ${span}` : `span ${span}`, alignSelf: 'start' }}
            >
              <div style={{ height, background: '#e8e4dc', overflow: 'hidden' }}>
                {/* eslint-disable-next-line @next/next/no-img-element -- arbitrary admin-entered URL */}
                <img src={entry.imageUrl} alt={entry.title} style={s.entryImg} />
              </div>
              <div style={s.entryTextPad}>
                <div style={s.entryNum}>
                  {String(entry.displayOrder).padStart(2, '0')} · {entry.size.toUpperCase()}
                </div>
                <h3 style={s.entryTitle}>{entry.title}</h3>
                <div style={s.entryDesc}>
                  <MarkText text={entry.description} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <section style={s.finale}>
        <div style={s.finaleRule} />
        <div style={s.finaleSmall}>FIN.</div>
        <h2 style={s.finaleBig}>{artwork.title.toUpperCase()}</h2>
        <div style={s.finaleSmall}>RAUL BARBOSA · 2026</div>
      </section>

      <div style={s.footer}>
        <div>
          <h3 style={s.footTitle}>More from the journal</h3>
          <div style={s.relGrid}>
            {related.map((r) => (
              <Link key={r.slug} href={`/artwork/${r.slug}`} style={s.relCard}>
                <PlaceholderImg src={r.coverImage} ratio="3/4" />
                <div style={s.relCap}>{r.title}</div>
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h3 style={s.footTitle}>Get in touch</h3>
          <div style={s.contact}>
            <div style={{ ...s.contactNote, color: ACCENT_COLOR }}>tea? coffee? a cat photo?</div>
            <div style={s.contactEmail}>
              <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                {CONTACT_EMAIL}
              </a>
            </div>
            <div style={s.socials}>
              {enabledSocials.map((social) => (
                <a
                  key={social.key}
                  href={social.url}
                  target="_blank"
                  rel="noreferrer"
                  style={{ ...s.socialBtn, color: '#1a1714', textDecoration: 'none' }}
                  title={social.url}
                >
                  <Icon name={social.key} size={18} />
                </a>
              ))}
            </div>
            <a href={`mailto:${CONTACT_EMAIL}`} style={{ ...s.contactBtn, background: ACCENT_COLOR }}>
              Let&apos;s talk! <Icon name="arrow" size={14} color="#f6f4ef" />
            </a>
          </div>
        </div>
      </div>

      <SiteFooter />
    </Paper>
  );
}
