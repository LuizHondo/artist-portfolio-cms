"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { getArtworks } from "@/lib/api/artworks";
import type { Artwork } from "@/lib/types";

const TIERS = [
	{ priority: 1, label: "Featured 1" },
	{ priority: 2, label: "Featured 2" },
	{ priority: 3, label: "Archive" },
] as const;

function DashboardContent() {
	const [artworks, setArtworks] = useState<Artwork[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		(async () => {
			try {
				setArtworks(await getArtworks());
			} catch (error) {
				console.error("Failed to load dashboard:", error);
			} finally {
				setLoading(false);
			}
		})();
	}, []);

	return (
		<div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-8 min-h-[calc(100vh-200px)]">
			<AdminSidebar />

			<main className="bg-white p-8 rounded-lg shadow-[0_4px_6px_rgba(0,0,0,0.1)]">
				<h1
					className="mt-0 text-[#333] mb-8 text-4xl"
					style={{ fontFamily: '"Permanent Marker", cursive' }}
				>
					Dashboard
				</h1>

				{loading ? (
					<div style={{ textAlign: "center", padding: "2rem" }}>Loading...</div>
				) : (
					<>
						<Link
							href="/admin/artworks/new"
							className="bg-[#28a745] text-white px-6 py-3 rounded-md cursor-pointer text-base mb-6 transition-all duration-300 inline-block hover:bg-[#218838] hover:-translate-y-0.5"
						>
							+ Create New Artwork
						</Link>

						{TIERS.map(({ priority, label }) => {
							const rows = artworks.filter(
								(a) => a.featuredPriority === priority,
							);
							return (
								<section key={priority} className="mb-8">
									<h2 className="text-[#333]">
										{label} ({rows.length})
									</h2>
									{rows.length === 0 ? (
										<p className="text-[#666]">No artworks in this tier.</p>
									) : (
										<table className="w-full border-collapse text-[0.9rem] md:text-base">
											<thead className="bg-[#f8f9fa] border-b-2 border-[#ddd]">
												<tr>
													<th className="p-2 md:p-4 text-left font-semibold text-[#333]" />
													<th className="p-2 md:p-4 text-left font-semibold text-[#333]">
														Title
													</th>
													<th className="p-2 md:p-4 text-left font-semibold text-[#333]">
														Medium
													</th>
													<th className="p-2 md:p-4 text-left font-semibold text-[#333]">
														Year
													</th>
													<th className="p-2 md:p-4 text-left font-semibold text-[#333]">
														Actions
													</th>
												</tr>
											</thead>
											<tbody>
												{rows.map((artwork) => (
													<tr key={artwork.id} className="hover:bg-[#f8f9fa]">
														<td className="p-2 md:p-4 border-b border-[#eee] w-16">
															{artwork.coverImage && (
																// biome-ignore lint/performance/noImgElement: admin thumbnail, no next/image config needed
																<img
																	src={artwork.coverImage}
																	alt={artwork.title}
																	className="w-12 h-12 object-contain bg-[#f8f9fa] rounded"
																/>
															)}
														</td>
														<td className="p-2 md:p-4 border-b border-[#eee]">
															<strong>{artwork.title}</strong>
														</td>
														<td className="p-2 md:p-4 border-b border-[#eee]">
															{artwork.medium}
														</td>
														<td className="p-2 md:p-4 border-b border-[#eee]">
															{artwork.yearCreated}
														</td>
														<td className="p-2 md:p-4 border-b border-[#eee]">
															<Link
																href={`/admin/artworks/${artwork.slug}/edit`}
																className="px-[0.8rem] py-[0.4rem] rounded text-[0.9rem] transition-all duration-300 inline-block bg-indigo-500 text-white hover:bg-[#5568d3]"
															>
																Edit
															</Link>
														</td>
													</tr>
												))}
											</tbody>
										</table>
									)}
								</section>
							);
						})}
					</>
				)}
			</main>
		</div>
	);
}

export default function AdminDashboard() {
	return (
		<AdminGuard>
			<DashboardContent />
		</AdminGuard>
	);
}
