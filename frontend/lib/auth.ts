"use client";

import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { AUTH_COOKIE_NAME } from "./auth-constants";

export { AUTH_COOKIE_NAME };

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days, matches the backend JWT's expiry

export interface AdminUser {
	id: string;
	email: string;
}

export function getAuthToken(): string | null {
	if (typeof document === "undefined") return null;
	const match = document.cookie.match(
		new RegExp(`(?:^|; )${AUTH_COOKIE_NAME}=([^;]*)`),
	);
	return match ? decodeURIComponent(match[1]) : null;
}

function setAuthToken(token: string) {
	// biome-ignore lint/suspicious/noDocumentCookie: Cookie Store API isn't supported in Safari/Firefox yet
	document.cookie = `${AUTH_COOKIE_NAME}=${encodeURIComponent(token)}; path=/; max-age=${COOKIE_MAX_AGE}`;
}

function clearAuthToken() {
	// biome-ignore lint/suspicious/noDocumentCookie: Cookie Store API isn't supported in Safari/Firefox yet
	document.cookie = `${AUTH_COOKIE_NAME}=; path=/; max-age=0`;
}

export function useAuth() {
	const [admin, setAdmin] = useState<AdminUser | null>(null);
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const token = getAuthToken();
		if (!token) {
			setLoading(false);
			return;
		}
		axios
			.get(`${API_URL}/admin/profile`, {
				headers: { Authorization: `Bearer ${token}` },
			})
			.then((res) => {
				setAdmin(res.data.data);
				setIsAuthenticated(true);
			})
			.catch(() => clearAuthToken())
			.finally(() => setLoading(false));
	}, []);

	const login = useCallback(async (email: string, password: string) => {
		const res = await axios.post(`${API_URL}/admin/login`, { email, password });
		setAuthToken(res.data.token);
		setAdmin(res.data.admin);
		setIsAuthenticated(true);
	}, []);

	const logout = useCallback(() => {
		clearAuthToken();
		setAdmin(null);
		setIsAuthenticated(false);
	}, []);

	return { admin, isAuthenticated, loading, login, logout };
}
