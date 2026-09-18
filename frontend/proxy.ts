import { type NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE_NAME } from "@/lib/auth-constants";

// Next.js 16.3 renamed the middleware.ts/middleware() convention to
// proxy.ts/proxy() (middleware.ts is deprecated and, on this version,
// silently fails to run at all) — this is that same route gate.
export function proxy(request: NextRequest) {
	if (request.nextUrl.pathname === "/admin/login") {
		return NextResponse.next();
	}
	const hasToken = !!request.cookies.get(AUTH_COOKIE_NAME)?.value;
	if (!hasToken) {
		return NextResponse.redirect(new URL("/admin/login", request.url));
	}
	return NextResponse.next();
}

export const config = {
	matcher: ["/admin/:path*"],
};
