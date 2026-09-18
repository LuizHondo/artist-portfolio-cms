import { Home } from "@/components/home/Home";
import { homeV1Styles as s } from "@/components/home/homeStyles";
import { PublicNav } from "@/components/PublicNav";
import { SiteFooter } from "@/components/SiteFooter";
import { getArtworks } from "@/lib/api/artworks";
import { Paper } from "@/lib/design/shared";

export default async function HomePage() {
	const artworks = await getArtworks();

	return (
		<Paper style={s.page}>
			<PublicNav active="Home" variant="bar" />
			<Home artworks={artworks} />
			<SiteFooter />
		</Paper>
	);
}
