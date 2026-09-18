// The visible surface at `/` is fully owned by `ScreensaverGate` (mounted in
// layout.tsx), which locks on this route and navigates to /home on
// unlock — this page has no reachable "unlocked and sitting at /" state.
export default function HomePage() {
	return null;
}
