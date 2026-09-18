import { ArtworkForm } from "@/components/admin/ArtworkForm";

export default async function EditArtworkPage({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;
	return <ArtworkForm slug={slug} />;
}
