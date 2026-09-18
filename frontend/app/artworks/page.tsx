import { Artworks } from "@/components/artworks/Artworks";
import { homeV1Styles as s } from "@/components/home/homeStyles";
import { PublicNav } from "@/components/PublicNav";
import { SiteFooter } from "@/components/SiteFooter";
import { getArtworks } from "@/lib/api/artworks";
import { Paper } from "@/lib/design/shared";

export default async function ArtworksPage() {
	const artworks = await getArtworks();

	return (
		<Paper style={s.page}>
			<PublicNav active="Artworks" variant="bar" />
			<Artworks artworks={artworks} />
			<SiteFooter />
		</Paper>
	);
}
