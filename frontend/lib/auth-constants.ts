// Split out from lib/auth.ts (which is 'use client') so proxy.ts — an Edge
// module outside the React Server Components graph — can import it without
// crossing a client-boundary, which silently breaks the value there.
export const AUTH_COOKIE_NAME = "auth_token";
