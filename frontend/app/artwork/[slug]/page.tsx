import type { CSSProperties } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Paper, MarkText, Icon, PlaceholderImg } from '@/lib/design/shared';
import { getArtworks, getBySlug } from '@/lib/api/artworks';
import { PublicNav } from '@/components/PublicNav';
import { SiteFooter } from '@/components/SiteFooter';
import { CONTACT_EMAIL, enabledSocials } from '@/lib/social-links';
import { COLORS } from '@/lib/theme';
import { projV2Styles as s } from '@/components/artwork/artworkStyles';

export default async function ArtworkPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const artwork = await getBySlug(slug);
  if (!artwork) notFound();

  const all = await getArtworks();
  const related = all.filter((x) => x.slug !== artwork.slug && x.featuredPriority > 0).slice(0, 6);

  return (
    <Paper style={s.page}>
      <PublicNav active="Artworks" variant="bar" />

      <Link href="/artworks" style={s.back} className="px-5 pt-6 md:px-16 md:pt-7">
        <Icon name="arrow-left" size={16} /> back to all artworks
      </Link>

      <div style={s.titleBlock} className="grid-cols-1 gap-6 px-5 py-8 md:grid-cols-[1.4fr_1fr] md:gap-14 md:px-16 md:pt-10 md:pb-12">
        <div>
          <div style={s.plateNum}>{artwork.medium.split(' · ')[0].toUpperCase()}</div>
          <h1 style={s.bigTitle} className="text-[44px] md:text-[104px]">
            {artwork.title}
          </h1>
        </div>
        <div style={s.meta}>
          <div style={s.metaRow}>
            <span style={s.metaKey}>Medium</span>
            <span>{artwork.medium}</span>
          </div>
          <div style={s.metaRow}>
            <span style={s.metaKey}>Tags</span>
            <span>{artwork.artworkTags.map((at) => at.tag.name).join(', ')}</span>
          </div>
          <div style={s.metaRow}>
            <span style={s.metaKey}>Year</span>
            <span>{artwork.yearCreated}</span>
          </div>
        </div>
      </div>

      <div style={s.heroWrap} className="mx-5 pb-10 md:mx-16 md:pb-[60px]">
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element -- arbitrary admin-entered URL */}
          <img src={artwork.coverImage} alt={artwork.title} style={s.heroPlateImg} />
          <div style={s.heroCaption}>{artwork.title} — cover</div>
        </div>
      </div>

      <div className="px-5 md:px-16" style={{ maxWidth: 980 }}>
        <p className="text-[19px] md:text-[27px]" style={{ lineHeight: 1.5, letterSpacing: '-0.005em' }}>
          {artwork.summary}
        </p>
      </div>

      <div style={s.entriesWrap} className="gap-12 px-5 pt-12 pb-8 md:gap-[88px] md:px-16 md:pt-24 md:pb-10">
        {artwork.entries.map((entry) => {
          return (
            <div
              key={entry.id}
              className="grid grid-cols-1 gap-6 md:gap-10 md:[grid-template-columns:repeat(var(--cols),1fr)]"
              style={{ '--cols': entry.columns } as CSSProperties}
            >
              {entry.images.map((image) => (
                <div key={image.url} style={{ minWidth: 0, display: 'flex', flexDirection: 'column' }}>
                  <div style={s.entryTextPad}>
                    <div style={s.entryNum}>
                      {String(entry.displayOrder).padStart(2, '0')} · {entry.columns} COL
                    </div>
                    <h3 style={s.entryTitle}>{image.title}</h3>
                    <div style={s.entryDesc}>
                      <MarkText text={image.description} />
                    </div>
                  </div>
                  {/* eslint-disable-next-line @next/next/no-img-element -- arbitrary admin-entered URL */}
                  <img src={image.url} alt={image.title} style={{ ...s.entryImg, marginTop: 'auto' }} />
                </div>
              ))}
            </div>
          );
        })}
      </div>

      <section style={s.finale} className="px-5 py-16 md:px-16 md:py-[120px]">
        <div style={s.finaleRule} />
        <div style={s.finaleSmall}>FIN.</div>
        <h2 style={s.finaleBig} className="text-[56px] md:text-[176px]">
          {artwork.title.toUpperCase()}
        </h2>
        <div style={s.finaleSmall}>RAUL BARBOSA · 2026</div>
      </section>

      <div style={s.footer} className="grid-cols-1 gap-10 px-5 py-12 md:grid-cols-[1.3fr_1fr] md:gap-14 md:px-16 md:py-24">
        <div>
          <h3 style={s.footTitle}>More from the journal</h3>
          <div style={s.relGrid} className="grid-cols-2 md:grid-cols-3">
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
            <div style={{ ...s.contactNote, color: COLORS.accent }}>tea? coffee? a cat photo?</div>
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
                  style={{ ...s.socialBtn, color: COLORS.ink, textDecoration: 'none' }}
                  title={social.url}
                >
                  <Icon name={social.key} size={18} />
                </a>
              ))}
            </div>
            <a href={`mailto:${CONTACT_EMAIL}`} style={{ ...s.contactBtn, background: COLORS.accent }}>
              Let&apos;s talk! <Icon name="arrow" size={14} color={COLORS.cream} />
            </a>
          </div>
        </div>
      </div>

      <SiteFooter />
    </Paper>
  );
}
