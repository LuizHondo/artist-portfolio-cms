"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth";

// Belt-and-suspenders on top of middleware.ts: middleware only checks that
// the auth cookie is present, so a stale/expired token still redirects here
// once the profile check in useAuth() fails.
export function AdminGuard({ children }: { children: React.ReactNode }) {
	const { isAuthenticated, loading } = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (!loading && !isAuthenticated) {
			router.replace("/admin/login");
		}
	}, [loading, isAuthenticated, router]);

	if (loading || !isAuthenticated) {
		return (
			<div style={{ textAlign: "center", padding: "2rem" }}>Loading...</div>
		);
	}

	return <>{children}</>;
}
