/**
 * API Client - abstraction layer for backend calls.
 * TODO: Connect to external backend (Laravel / FastAPI) when ready.
 * Replace fetch base URL via env: NEXT_PUBLIC_API_URL
 */

const getBaseUrl = () =>
  typeof window !== "undefined"
    ? process.env.NEXT_PUBLIC_BASE_URL || ""
    : process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export async function apiFetch<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const url = `${getBaseUrl()}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    credentials: "same-origin",
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message || `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export function apiPost<T>(path: string, body: unknown): Promise<T> {
  return apiFetch(path, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function apiGet<T>(path: string): Promise<T> {
  return apiFetch(path, { method: "GET" });
}
