import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	// The repo root (one level up) also has a package-lock.json for the
	// Express backend, which Next.js's workspace-root inference picks up
	// instead of this directory unless pinned explicitly.
	turbopack: {
		root: path.join(__dirname),
	},
};

export default nextConfig;
