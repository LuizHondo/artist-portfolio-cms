"use client";

import { useEffect, useState } from "react";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { getAbout } from "@/lib/api/about";
import { adminAboutApi } from "@/lib/api/admin-about";
import type { About } from "@/lib/types";

const inputClass =
	"w-full p-3 border border-[#ddd] rounded-md text-base box-border transition-colors duration-300 focus:outline-none focus:border-indigo-500 focus:shadow-[0_0_0_3px_rgba(102,126,234,0.1)]";
const deleteBtnClass =
	"px-[0.8rem] py-[0.4rem] border-0 rounded cursor-pointer text-[0.9rem] transition-all duration-300 bg-[#dc3545] text-white hover:bg-[#c82333]";
const addBtnClass =
	"px-4 py-2 border-0 rounded cursor-pointer text-[0.9rem] bg-[#28a745] text-white hover:bg-[#218838]";
const moveBtnClass =
	"px-[0.6rem] border border-[#ddd] rounded cursor-pointer text-[0.9rem] bg-white hover:bg-[#f8f9fa] disabled:opacity-30 disabled:cursor-not-allowed";

function move<T>(list: T[], from: number, to: number): T[] {
	const next = [...list];
	const [item] = next.splice(from, 1);
	next.splice(to, 0, item);
	return next;
}

function AboutFormContent() {
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");

	const [tagline, setTagline] = useState("");
	const [heroImage, setHeroImage] = useState("");
	const [bio, setBio] = useState<string[]>([""]);
	const [disciplines, setDisciplines] = useState<string[]>([""]);
	const [colophon, setColophon] = useState<
		Array<{ key: string; value: string }>
	>([{ key: "", value: "" }]);

	useEffect(() => {
		(async () => {
			try {
				const about = await getAbout();
				setTagline(about.tagline);
				setHeroImage(about.heroImage);
				setBio(about.bio);
				setDisciplines(about.disciplines);
				setColophon(about.colophon);
			} catch {
				setError("Failed to load about content");
			} finally {
				setLoading(false);
			}
		})();
	}, []);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setSuccess("");
		setSaving(true);
		try {
			const payload: Omit<About, "updatedAt"> = {
				tagline,
				heroImage,
				bio: bio.filter((p) => p.trim()),
				disciplines: disciplines.filter((d) => d.trim()),
				colophon: colophon.filter((row) => row.key.trim() && row.value.trim()),
			};
			await adminAboutApi.update(payload);
			setSuccess("About page updated!");
		} catch {
			setError("Failed to save about content");
		} finally {
			setSaving(false);
		}
	};

	if (loading)
		return (
			<div style={{ textAlign: "center", padding: "2rem" }}>Loading...</div>
		);

	return (
		<form onSubmit={handleSubmit} className="flex flex-col gap-8">
			<div>
				<label
					htmlFor="tagline"
					className="block mb-2 font-semibold text-[#333]"
				>
					Tagline
				</label>
				<input
					id="tagline"
					className={inputClass}
					value={tagline}
					onChange={(e) => setTagline(e.target.value)}
					required
				/>
			</div>

			<div>
				<label
					htmlFor="heroImage"
					className="block mb-2 font-semibold text-[#333]"
				>
					Hero image URL
				</label>
				<input
					id="heroImage"
					type="url"
					className={inputClass}
					value={heroImage}
					onChange={(e) => setHeroImage(e.target.value)}
					required
				/>
			</div>

			<div>
				<span className="block mb-2 font-semibold text-[#333]">
					Bio paragraphs
				</span>
				<div className="flex flex-col gap-2">
					{bio.map((paragraph, i) => (
						// biome-ignore lint/suspicious/noArrayIndexKey: reordered by index, no stable id
						<div key={i} className="flex gap-2">
							<textarea
								className={inputClass}
								rows={3}
								value={paragraph}
								onChange={(e) =>
									setBio(bio.map((p, idx) => (idx === i ? e.target.value : p)))
								}
							/>
							<button
								type="button"
								className={moveBtnClass}
								disabled={i === 0}
								onClick={() => setBio(move(bio, i, i - 1))}
							>
								↑
							</button>
							<button
								type="button"
								className={moveBtnClass}
								disabled={i === bio.length - 1}
								onClick={() => setBio(move(bio, i, i + 1))}
							>
								↓
							</button>
							<button
								type="button"
								className={deleteBtnClass}
								onClick={() => setBio(bio.filter((_, idx) => idx !== i))}
							>
								Remove
							</button>
						</div>
					))}
				</div>
				<button
					type="button"
					className={`${addBtnClass} mt-2`}
					onClick={() => setBio([...bio, ""])}
				>
					+ Add paragraph
				</button>
			</div>

			<div>
				<span className="block mb-2 font-semibold text-[#333]">
					Disciplines
				</span>
				<div className="flex flex-col gap-2">
					{disciplines.map((skill, i) => (
						// biome-ignore lint/suspicious/noArrayIndexKey: reordered by index, no stable id
						<div key={i} className="flex gap-2">
							<input
								className={inputClass}
								value={skill}
								onChange={(e) =>
									setDisciplines(
										disciplines.map((d, idx) =>
											idx === i ? e.target.value : d,
										),
									)
								}
							/>
							<button
								type="button"
								className={moveBtnClass}
								disabled={i === 0}
								onClick={() => setDisciplines(move(disciplines, i, i - 1))}
							>
								↑
							</button>
							<button
								type="button"
								className={moveBtnClass}
								disabled={i === disciplines.length - 1}
								onClick={() => setDisciplines(move(disciplines, i, i + 1))}
							>
								↓
							</button>
							<button
								type="button"
								className={deleteBtnClass}
								onClick={() =>
									setDisciplines(disciplines.filter((_, idx) => idx !== i))
								}
							>
								Remove
							</button>
						</div>
					))}
				</div>
				<button
					type="button"
					className={`${addBtnClass} mt-2`}
					onClick={() => setDisciplines([...disciplines, ""])}
				>
					+ Add discipline
				</button>
			</div>

			<div>
				<span className="block mb-2 font-semibold text-[#333]">Colophon</span>
				<div className="flex flex-col gap-2">
					{colophon.map((row, i) => (
						// biome-ignore lint/suspicious/noArrayIndexKey: reordered by index, no stable id
						<div key={i} className="flex gap-2">
							<input
								className={inputClass}
								placeholder="Key (e.g. Tools)"
								value={row.key}
								onChange={(e) =>
									setColophon(
										colophon.map((r, idx) =>
											idx === i ? { ...r, key: e.target.value } : r,
										),
									)
								}
							/>
							<input
								className={inputClass}
								placeholder="Value"
								value={row.value}
								onChange={(e) =>
									setColophon(
										colophon.map((r, idx) =>
											idx === i ? { ...r, value: e.target.value } : r,
										),
									)
								}
							/>
							<button
								type="button"
								className={moveBtnClass}
								disabled={i === 0}
								onClick={() => setColophon(move(colophon, i, i - 1))}
							>
								↑
							</button>
							<button
								type="button"
								className={moveBtnClass}
								disabled={i === colophon.length - 1}
								onClick={() => setColophon(move(colophon, i, i + 1))}
							>
								↓
							</button>
							<button
								type="button"
								className={deleteBtnClass}
								onClick={() =>
									setColophon(colophon.filter((_, idx) => idx !== i))
								}
							>
								Remove
							</button>
						</div>
					))}
				</div>
				<button
					type="button"
					className={`${addBtnClass} mt-2`}
					onClick={() => setColophon([...colophon, { key: "", value: "" }])}
				>
					+ Add row
				</button>
			</div>

			{error && <p className="text-[#dc3545]">{error}</p>}
			{success && <p className="text-[#28a745]">{success}</p>}

			<button
				type="submit"
				disabled={saving}
				className="bg-indigo-500 text-white px-6 py-3 rounded-md cursor-pointer text-base transition-all duration-300 hover:bg-[#5568d3] disabled:opacity-50 self-start"
			>
				{saving ? "Saving..." : "Save changes"}
			</button>
		</form>
	);
}

export default function AboutAdminPage() {
	return (
		<AdminGuard>
			<div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-8 min-h-[calc(100vh-200px)]">
				<AdminSidebar />
				<main className="bg-white p-8 rounded-lg shadow-[0_4px_6px_rgba(0,0,0,0.1)]">
					<h1
						className="mt-0 text-[#333] mb-8 text-4xl"
						style={{ fontFamily: '"Permanent Marker", cursive' }}
					>
						Manage About Me
					</h1>
					<AboutFormContent />
				</main>
			</div>
		</AdminGuard>
	);
}
