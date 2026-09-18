import { Paper } from '@/lib/design/shared';
import { getArtworks } from '@/lib/api/artworks';
import { Gallery } from '@/components/gallery/Gallery';
import { PublicNav } from '@/components/PublicNav';
import { SiteFooter } from '@/components/SiteFooter';
import { homeV1Styles as s } from '@/components/home/homeStyles';

export default async function GalleryPage() {
  const artworks = await getArtworks();

  return (
    <Paper style={s.page}>
      <PublicNav active="Gallery" variant="bar" />
      <Gallery artworks={artworks} />
      <SiteFooter />
    </Paper>
  );
}
