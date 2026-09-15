import { Paper } from '@/lib/design/shared';
import { getArtworks } from '@/lib/api/artworks';
import { Hero } from '@/components/home/Hero';
import { Gallery } from '@/components/home/Gallery';
import { SiteFooter } from '@/components/SiteFooter';
import { homeV1Styles as s } from '@/components/home/homeStyles';

export default async function HomePage() {
  const artworks = await getArtworks();

  // Hero slideshow leads with priority-1 artworks, then priority-2, in the
  // same createdAt-desc order the backend already returns — matches the
  // design's artworksByPriority(1) + artworksByPriority(2) concat.
  const slides = artworks
    .filter((a) => a.featuredPriority === 1 || a.featuredPriority === 2)
    .sort((a, b) => a.featuredPriority - b.featuredPriority)
    .map((a) => a.coverImage)
    .slice(0, 5);

  return (
    <Paper style={s.page}>
      <Hero slides={slides} />
      <Gallery artworks={artworks} />
      <SiteFooter />
    </Paper>
  );
}
