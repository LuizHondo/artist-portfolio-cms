"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { adminArtworksApi } from "@/lib/api/admin-artworks";
import { getBySlug } from "@/lib/api/artworks";
import { getTags } from "@/lib/api/tags";
import type { ArtworkEntry, ArtworkEntryImage, Tag } from "@/lib/types";

const inputClass =
	"w-full p-3 border border-[#ddd] rounded-md text-base box-border transition-colors duration-300 focus:outline-none focus:border-indigo-500 focus:shadow-[0_0_0_3px_rgba(102,126,234,0.1)]";
const deleteBtnClass =
	"px-[0.8rem] py-[0.4rem] border-0 rounded cursor-pointer text-[0.9rem] transition-all duration-300 bg-[#dc3545] text-white hover:bg-[#c82333]";
const moveBtnClass =
	"px-[0.5rem] py-[0.15rem] border border-[#ddd] rounded cursor-pointer text-[0.85rem] bg-white hover:bg-[#f8f9fa] disabled:opacity-30 disabled:cursor-not-allowed";

const emptyImage: ArtworkEntryImage = { url: "", title: "", description: "" };

const MEDIUM_OPTIONS = [
	"Illustration",
	"Animation",
	"3D Modelling",
	"Painting",
	"Drawing",
	"Photography",
	"Sculpture",
	"Digital Art",
	"Mixed Media",
	"Other",
];

const COLUMN_COUNTS = [1, 2, 3, 4, 5];

// Icon per column count: a 24x16 frame divided into that many strips.
function ColumnsIcon({ n }: { n: number }) {
	const dividers = Array.from(
		{ length: n - 1 },
		(_, i) => 2 + ((i + 1) * 20) / n,
	);
	return (
		<svg width={24} height={16} viewBox="0 0 24 16" aria-hidden="true">
			<rect
				x={2}
				y={2}
				width={20}
				height={12}
				rx={1.5}
				fill="none"
				stroke="currentColor"
				strokeWidth={1.5}
			/>
			{dividers.map((x) => (
				<line
					key={x}
					x1={x}
					y1={2}
					x2={x}
					y2={14}
					stroke="currentColor"
					strokeWidth={1.5}
				/>
			))}
		</svg>
	);
}

function ColumnsPicker({
	value,
	onChange,
}: {
	value: number;
	onChange: (n: number) => void;
}) {
	return (
		<div className="flex gap-1">
			{COLUMN_COUNTS.map((n) => (
				<button
					key={n}
					type="button"
					title={`${n} column${n > 1 ? "s" : ""}`}
					aria-pressed={value === n}
					onClick={() => onChange(n)}
					className="p-2 border border-[#ddd] rounded-md text-[#333] transition-opacity duration-200 hover:bg-[#f8f9fa]"
					style={{ opacity: value === n ? 1 : 0.35 }}
				>
					<ColumnsIcon n={n} />
				</button>
			))}
		</div>
	);
}

function resizeImages(
	images: ArtworkEntryImage[],
	columns: number,
): ArtworkEntryImage[] {
	if (columns <= images.length) return images.slice(0, columns);
	return [
		...images,
		...Array.from({ length: columns - images.length }, () => ({
			...emptyImage,
		})),
	];
}

function entryFieldsChanged(
	a: Partial<ArtworkEntry>,
	b: Partial<ArtworkEntry>,
) {
	return (
		a.columns !== b.columns ||
		JSON.stringify(a.images) !== JSON.stringify(b.images) ||
		a.displayOrder !== b.displayOrder
	);
}

function ArtworkFormContent({ slug }: { slug?: string }) {
	const router = useRouter();
	const isEditing = !!slug;
	const [loading, setLoading] = useState(isEditing);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");
	const [allTags, setAllTags] = useState<Tag[]>([]);
	const [artworkId, setArtworkId] = useState<string | undefined>(undefined);

	const [formData, setFormData] = useState({
		title: "",
		summary: "",
		medium: "",
		yearCreated: new Date().getFullYear(),
		coverImage: "",
		featuredPriority: 0,
		tagIds: [] as string[],
	});

	const [entries, setEntries] = useState<Partial<ArtworkEntry>[]>([]);
	const [originalEntries, setOriginalEntries] = useState<
		Partial<ArtworkEntry>[]
	>([]);
	const [newEntry, setNewEntry] = useState<{
		columns: number;
		images: ArtworkEntryImage[];
		displayOrder: number;
	}>({
		columns: 1,
		images: [{ ...emptyImage }],
		displayOrder: 1,
	});

	useEffect(() => {
		(async () => {
			try {
				setAllTags(await getTags());

				if (isEditing && slug) {
					const artwork = await getBySlug(slug);
					if (!artwork) {
						setError("Artwork not found");
						setLoading(false);
						return;
					}
					setArtworkId(artwork.id);
					setFormData({
						title: artwork.title,
						summary: artwork.summary,
						medium: artwork.medium,
						yearCreated: artwork.yearCreated,
						coverImage: artwork.coverImage,
						featuredPriority: artwork.featuredPriority,
						tagIds: artwork.artworkTags.map((at) => at.tag.id),
					});
					setEntries(artwork.entries);
					setOriginalEntries(artwork.entries);
				}

				setLoading(false);
			} catch {
				setError("Failed to load data");
				setLoading(false);
			}
		})();
	}, [isEditing, slug]);

	const handleFormChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
		>,
	) => {
		const { name, value } = e.target;
		setFormData({
			...formData,
			[name]:
				name === "yearCreated" || name === "featuredPriority"
					? parseInt(value, 10)
					: value,
		});
	};

	const handleTagChange = (tagId: string) => {
		setFormData({
			...formData,
			tagIds: formData.tagIds.includes(tagId)
				? formData.tagIds.filter((t) => t !== tagId)
				: [...formData.tagIds, tagId],
		});
	};

	const newEntryComplete = newEntry.images.every(
		(img) => img.url && img.title && img.description,
	);

	const handleAddEntry = () => {
		if (newEntryComplete) {
			setEntries([...entries, { ...newEntry }]);
			setNewEntry({
				columns: 1,
				images: [{ ...emptyImage }],
				displayOrder: entries.length + 2,
			});
		}
	};

	const handleRemoveEntry = (index: number) => {
		setEntries(entries.filter((_, i) => i !== index));
	};

	const handleEntryColumnsChange = (index: number, columns: number) => {
		setEntries(
			entries.map((entry, i) =>
				i === index
					? {
							...entry,
							columns,
							images: resizeImages(entry.images ?? [], columns),
						}
					: entry,
			),
		);
	};

	const handleMoveEntry = (index: number, direction: -1 | 1) => {
		const sorted = entries
			.map((entry, i) => ({ entry, index: i }))
			.sort(
				(a, b) =>
					(a.entry.displayOrder ?? a.index + 1) -
					(b.entry.displayOrder ?? b.index + 1),
			);
		const pos = sorted.findIndex((s) => s.index === index);
		const swapPos = pos + direction;
		if (swapPos < 0 || swapPos >= sorted.length) return;

		const current = sorted[pos];
		const swap = sorted[swapPos];
		const currentOrder = current.entry.displayOrder ?? pos + 1;
		const swapOrder = swap.entry.displayOrder ?? swapPos + 1;

		setEntries(
			entries.map((entry, i) => {
				if (i === current.index) return { ...entry, displayOrder: swapOrder };
				if (i === swap.index) return { ...entry, displayOrder: currentOrder };
				return entry;
			}),
		);
	};

	const handleEntryImageFieldChange = (
		index: number,
		imageIndex: number,
		field: keyof ArtworkEntryImage,
		value: string,
	) => {
		setEntries(
			entries.map((entry, i) =>
				i === index
					? {
							...entry,
							images: (entry.images ?? []).map((img, j) =>
								j === imageIndex ? { ...img, [field]: value } : img,
							),
						}
					: entry,
			),
		);
	};

	const handleMoveEntryImage = (
		index: number,
		imageIndex: number,
		direction: -1 | 1,
	) => {
		const swapIndex = imageIndex + direction;
		setEntries(
			entries.map((entry, i) => {
				if (i !== index) return entry;
				const images = [...(entry.images ?? [])];
				if (swapIndex < 0 || swapIndex >= images.length) return entry;
				[images[imageIndex], images[swapIndex]] = [
					images[swapIndex],
					images[imageIndex],
				];
				return { ...entry, images };
			}),
		);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setSuccess("");

		try {
			if (isEditing && artworkId) {
				await adminArtworksApi.update(artworkId, formData);

				const originalById = new Map(
					originalEntries
						.filter((entry) => entry.id)
						.map((entry) => [entry.id as string, entry]),
				);
				const currentIds = new Set(
					entries
						.filter((entry) => entry.id)
						.map((entry) => entry.id as string),
				);

				for (const entry of entries) {
					if (!entry.id) {
						await adminArtworksApi.createEntry(artworkId, entry);
					} else {
						const original = originalById.get(entry.id);
						if (original && entryFieldsChanged(original, entry)) {
							await adminArtworksApi.updateEntry(entry.id, entry);
						}
					}
				}

				for (const entryId of originalById.keys()) {
					if (!currentIds.has(entryId)) {
						await adminArtworksApi.deleteEntry(entryId);
					}
				}

				setSuccess("Artwork updated successfully!");
			} else {
				const created = await adminArtworksApi.create(formData);
				const newArtworkId = created.data.data.id;

				for (const entry of entries) {
					await adminArtworksApi.createEntry(newArtworkId, entry);
				}

				setSuccess("Artwork created successfully!");
			}

			setTimeout(() => router.push("/admin/artworks"), 1500);
		} catch (err) {
			setError("Failed to save artwork");
			console.error("Failed to save:", err);
		}
	};

	if (loading) {
		return (
			<div style={{ textAlign: "center", padding: "2rem" }}>Loading...</div>
		);
	}

	return (
		<div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-8 min-h-[calc(100vh-200px)]">
			<AdminSidebar />

			<main className="bg-white p-8 rounded-lg shadow-[0_4px_6px_rgba(0,0,0,0.1)]">
				<h1
					className="mt-0 text-[#333] mb-8 text-4xl"
					style={{ fontFamily: '"Permanent Marker", cursive' }}
				>
					{isEditing ? "Edit Artwork" : "Create New Artwork"}
				</h1>

				{error && (
					<div className="p-4 rounded-md mb-6 font-medium bg-[#f8d7da] text-[#721c24] border border-[#f5c6cb]">
						{error}
					</div>
				)}
				{success && (
					<div className="p-4 rounded-md mb-6 font-medium bg-[#d4edda] text-[#155724] border border-[#c3e6cb]">
						{success}
					</div>
				)}

				<form onSubmit={handleSubmit} className="max-w-[600px]">
					<div className="mb-6">
						<label
							htmlFor="title"
							className="block mb-2 font-medium text-[#333]"
						>
							Title
						</label>
						<input
							type="text"
							id="title"
							name="title"
							value={formData.title}
							onChange={handleFormChange}
							required
							className={inputClass}
						/>
					</div>

					<div className="mb-6">
						<label
							htmlFor="summary"
							className="block mb-2 font-medium text-[#333]"
						>
							Summary
						</label>
						<textarea
							id="summary"
							name="summary"
							value={formData.summary}
							onChange={handleFormChange}
							required
							className={`${inputClass} resize-y min-h-[100px]`}
						/>
					</div>

					<div className="mb-6">
						<label
							htmlFor="medium"
							className="block mb-2 font-medium text-[#333]"
						>
							Medium
						</label>
						<select
							id="medium"
							name="medium"
							value={formData.medium}
							onChange={handleFormChange}
							required
							className={inputClass}
						>
							<option value="" disabled>
								Select a medium
							</option>
							{MEDIUM_OPTIONS.map((m) => (
								<option key={m} value={m}>
									{m}
								</option>
							))}
						</select>
					</div>

					<div className="mb-6">
						<label
							htmlFor="yearCreated"
							className="block mb-2 font-medium text-[#333]"
						>
							Year Created
						</label>
						<input
							type="number"
							id="yearCreated"
							name="yearCreated"
							value={formData.yearCreated}
							onChange={handleFormChange}
							required
							className={inputClass}
						/>
					</div>

					<div className="mb-6">
						<label
							htmlFor="coverImage"
							className="block mb-2 font-medium text-[#333]"
						>
							Cover Image URL
						</label>
						<input
							type="url"
							id="coverImage"
							name="coverImage"
							value={formData.coverImage}
							onChange={handleFormChange}
							required
							className={inputClass}
						/>
					</div>

					<div className="mb-6">
						<label
							htmlFor="featuredPriority"
							className="block mb-2 font-medium text-[#333]"
						>
							Featured Priority
						</label>
						<select
							id="featuredPriority"
							name="featuredPriority"
							value={formData.featuredPriority}
							onChange={handleFormChange}
							className={inputClass}
						>
							<option value="0">Not Featured</option>
							<option value="1">Hero Section (Priority 1)</option>
							<option value="2">Featured Grid (Priority 2)</option>
							<option value="3">Featured Grid (Priority 3)</option>
						</select>
					</div>

					<fieldset className="mb-6 border-0 p-0 m-0">
						<legend className="block mb-2 font-medium text-[#333]">Tags</legend>
						<div
							style={{
								display: "grid",
								gridTemplateColumns: "repeat(2, 1fr)",
								gap: "0.5rem",
							}}
						>
							{allTags.map((tag) => (
								<label
									key={tag.id}
									style={{
										display: "flex",
										alignItems: "center",
										gap: "0.5rem",
									}}
								>
									<input
										type="checkbox"
										checked={formData.tagIds.includes(tag.id)}
										onChange={() => handleTagChange(tag.id)}
									/>
									{tag.name}
								</label>
							))}
						</div>
					</fieldset>

					<hr style={{ margin: "2rem 0" }} />

					<h3>Creative Process Entries</h3>

					{entries.length > 0 && (
						<div style={{ marginBottom: "2rem" }}>
							{entries
								.map((entry, index) => ({ entry, index }))
								.sort(
									(a, b) =>
										(a.entry.displayOrder ?? a.index + 1) -
										(b.entry.displayOrder ?? b.index + 1),
								)
								.map(({ entry, index }, sortedPos, sorted) => (
									<div
										key={entry.id ?? `new-${index}`}
										data-testid={`entry-card-${index}`}
										style={{
											background: "#f8f9fa",
											padding: "1rem",
											borderRadius: "6px",
											marginBottom: "1rem",
										}}
									>
										<div
											style={{
												display: "flex",
												justifyContent: "space-between",
												alignItems: "center",
												marginBottom: "0.75rem",
											}}
										>
											<div
												style={{
													display: "flex",
													alignItems: "center",
													gap: "0.5rem",
												}}
											>
												<button
													type="button"
													onClick={() => handleMoveEntry(index, -1)}
													disabled={sortedPos === 0}
													aria-label="Move up"
													style={{
														background: "none",
														border: "none",
														cursor: sortedPos === 0 ? "not-allowed" : "pointer",
														color: sortedPos === 0 ? "#ccc" : "#28a745",
														fontSize: "1.25rem",
														lineHeight: 1,
														padding: "0.25rem",
													}}
												>
													▲
												</button>
												<button
													type="button"
													onClick={() => handleMoveEntry(index, 1)}
													disabled={sortedPos === sorted.length - 1}
													aria-label="Move down"
													style={{
														background: "none",
														border: "none",
														cursor:
															sortedPos === sorted.length - 1
																? "not-allowed"
																: "pointer",
														color:
															sortedPos === sorted.length - 1
																? "#ccc"
																: "#dc3545",
														fontSize: "1.25rem",
														lineHeight: 1,
														padding: "0.25rem",
													}}
												>
													▼
												</button>
												<p style={{ margin: 0, fontWeight: "bold" }}>
													Entry {sortedPos + 1}
												</p>
											</div>
											<button
												type="button"
												onClick={() => handleRemoveEntry(index)}
												className={deleteBtnClass}
											>
												Remove
											</button>
										</div>

										<div className="mb-4">
											<span className="block mb-2 font-medium text-[#333]">
												Columns
											</span>
											<ColumnsPicker
												value={entry.columns ?? 1}
												onChange={(n) => handleEntryColumnsChange(index, n)}
											/>
										</div>

										{(entry.images ?? []).map((image, imageIndex) => (
											<div
												// biome-ignore lint/suspicious/noArrayIndexKey: images have no stable id, list order is fixed by the form
												key={imageIndex}
												className="flex flex-col md:flex-row md:gap-4"
												style={{
													borderTop:
														imageIndex > 0 ? "1px dashed #ddd" : undefined,
													paddingTop: imageIndex > 0 ? "1rem" : 0,
													marginTop: imageIndex > 0 ? "1rem" : 0,
												}}
											>
												<div className="flex-1 min-w-0">
													<div
														className="flex items-center gap-2"
														style={{ marginBottom: "0.5rem" }}
													>
														<p style={{ fontWeight: 600, margin: 0 }}>
															Image {imageIndex + 1}
														</p>
														<button
															type="button"
															onClick={() =>
																handleMoveEntryImage(index, imageIndex, -1)
															}
															disabled={imageIndex === 0}
															className={moveBtnClass}
														>
															◀
														</button>
														<button
															type="button"
															onClick={() =>
																handleMoveEntryImage(index, imageIndex, 1)
															}
															disabled={
																imageIndex === (entry.images ?? []).length - 1
															}
															className={moveBtnClass}
														>
															▶
														</button>
													</div>

													<div className="mb-4">
														<label className="block mb-2 font-medium text-[#333]">
															Image URL
															<input
																type="url"
																value={image.url}
																onChange={(e) =>
																	handleEntryImageFieldChange(
																		index,
																		imageIndex,
																		"url",
																		e.target.value,
																	)
																}
																className={inputClass}
															/>
														</label>
													</div>

													<div className="mb-4">
														<label className="block mb-2 font-medium text-[#333]">
															Image Title
															<input
																type="text"
																value={image.title}
																onChange={(e) =>
																	handleEntryImageFieldChange(
																		index,
																		imageIndex,
																		"title",
																		e.target.value,
																	)
																}
																className={inputClass}
															/>
														</label>
													</div>

													<div>
														<label className="block mb-2 font-medium text-[#333]">
															Image Description
															<textarea
																value={image.description}
																onChange={(e) =>
																	handleEntryImageFieldChange(
																		index,
																		imageIndex,
																		"description",
																		e.target.value,
																	)
																}
																className={`${inputClass} resize-y min-h-[80px]`}
															/>
														</label>
													</div>
												</div>

												{image.url && (
													<div className="mt-3 md:mt-0 w-full h-48 md:h-auto md:w-40 rounded border border-[#ddd] bg-[#f8f9fa] shrink-0 flex items-center justify-center overflow-hidden">
														{/* biome-ignore lint/performance/noImgElement: preview of an arbitrary external URL, next/image requires domain allowlisting */}
														<img
															src={image.url}
															alt={
																image.title || `Image ${imageIndex + 1} preview`
															}
															className="max-w-full max-h-full object-contain"
														/>
													</div>
												)}
											</div>
										))}
									</div>
								))}
						</div>
					)}

					<div
						style={{
							background: "#f8f9fa",
							padding: "1.5rem",
							borderRadius: "6px",
						}}
					>
						<h4 style={{ marginTop: 0 }}>Add New Entry</h4>

						<div className="mb-6">
							<label
								htmlFor="entry-order"
								className="block mb-2 font-medium text-[#333]"
							>
								Order
							</label>
							<input
								type="number"
								id="entry-order"
								min={1}
								value={newEntry.displayOrder}
								onChange={(e) =>
									setNewEntry({
										...newEntry,
										displayOrder: parseInt(e.target.value, 10) || 1,
									})
								}
								className={inputClass}
							/>
						</div>

						<div className="mb-6">
							<span className="block mb-2 font-medium text-[#333]">
								Columns
							</span>
							<ColumnsPicker
								value={newEntry.columns}
								onChange={(columns) =>
									setNewEntry({
										...newEntry,
										columns,
										images: resizeImages(newEntry.images, columns),
									})
								}
							/>
						</div>

						{newEntry.images.map((image, imageIndex) => (
							<div
								// biome-ignore lint/suspicious/noArrayIndexKey: images have no stable id, list order is fixed by the form
								key={imageIndex}
								style={{
									borderTop: imageIndex > 0 ? "1px dashed #ddd" : undefined,
									paddingTop: imageIndex > 0 ? "1rem" : 0,
									marginTop: imageIndex > 0 ? "1rem" : 0,
								}}
							>
								<p style={{ fontWeight: 600, marginBottom: "0.5rem" }}>
									Image {imageIndex + 1}
								</p>

								<div className="mb-6">
									<label className="block mb-2 font-medium text-[#333]">
										Image URL
										<input
											type="url"
											value={image.url}
											onChange={(e) =>
												setNewEntry({
													...newEntry,
													images: newEntry.images.map((img, i) =>
														i === imageIndex
															? { ...img, url: e.target.value }
															: img,
													),
												})
											}
											className={inputClass}
										/>
									</label>
								</div>

								<div className="mb-6">
									<label className="block mb-2 font-medium text-[#333]">
										Image Title
										<input
											type="text"
											value={image.title}
											onChange={(e) =>
												setNewEntry({
													...newEntry,
													images: newEntry.images.map((img, i) =>
														i === imageIndex
															? { ...img, title: e.target.value }
															: img,
													),
												})
											}
											className={inputClass}
										/>
									</label>
								</div>

								<div className="mb-6">
									<label className="block mb-2 font-medium text-[#333]">
										Image Description
										<textarea
											value={image.description}
											onChange={(e) =>
												setNewEntry({
													...newEntry,
													images: newEntry.images.map((img, i) =>
														i === imageIndex
															? { ...img, description: e.target.value }
															: img,
													),
												})
											}
											className={`${inputClass} resize-y min-h-[100px]`}
										/>
									</label>
								</div>
							</div>
						))}

						{(() => {
							const canAddEntry = newEntryComplete;
							return (
								<button
									type="button"
									onClick={handleAddEntry}
									disabled={!canAddEntry}
									style={{
										background: "#17a2b8",
										color: "white",
										padding: "0.75rem 1.5rem",
										border: "none",
										borderRadius: "6px",
										cursor: canAddEntry ? "pointer" : "not-allowed",
										opacity: canAddEntry ? 1 : 0.6,
									}}
								>
									Add Entry
								</button>
							);
						})()}
					</div>

					<div className="flex flex-col md:flex-row gap-4 mt-8">
						<button
							type="submit"
							className="bg-[#28a745] text-white px-8 py-3 border-0 rounded-md cursor-pointer text-base font-semibold transition-all duration-300 hover:bg-[#218838] hover:-translate-y-0.5 w-full md:w-auto"
						>
							{isEditing ? "Update Artwork" : "Create Artwork"}
						</button>
						<Link
							href="/admin/artworks"
							className="bg-[#6c757d] text-white px-8 py-3 rounded-md cursor-pointer text-base font-semibold transition-all duration-300 inline-block hover:bg-[#5a6268] w-full md:w-auto text-center"
						>
							Cancel
						</Link>
					</div>
				</form>
			</main>
		</div>
	);
}

export function ArtworkForm({ slug }: { slug?: string }) {
	return (
		<AdminGuard>
			<ArtworkFormContent slug={slug} />
		</AdminGuard>
	);
}
