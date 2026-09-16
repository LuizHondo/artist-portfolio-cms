import { Paper } from '@/lib/design/shared';
import { getArtworks } from '@/lib/api/artworks';
import { Gallery } from '@/components/home/Gallery';
import { PublicNav } from '@/components/PublicNav';
import { SiteFooter } from '@/components/SiteFooter';
import { homeV1Styles as s } from '@/components/home/homeStyles';

export default async function ArtworksPage() {
  const artworks = await getArtworks();

  return (
    <Paper style={s.page}>
      <PublicNav active="Artworks" variant="bar" />
      <Gallery artworks={artworks} />
      <SiteFooter />
    </Paper>
  );
}
