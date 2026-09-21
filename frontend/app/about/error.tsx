"use client";

export default function AboutError({ reset }: { reset: () => void }) {
	return (
		<div style={{ padding: 56, textAlign: "center" }}>
			<p>Couldn&apos;t load the About page right now.</p>
			<button type="button" onClick={reset}>
				Try again
			</button>
		</div>
	);
}
