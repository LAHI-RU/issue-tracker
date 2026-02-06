import { getToken, clearToken } from "./token";

const BASE = import.meta.env.VITE_API_BASE_URL;

export async function apiFetch(path, { method = "GET", body, signal } = {}) {
  const headers = { "Content-Type": "application/json" };

  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    signal
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    // Auto logout on invalid token
    if (res.status === 401) clearToken();

    const err = new Error(data?.error?.message || "Request failed");
    err.status = res.status;
    err.code = data?.error?.code;
    err.details = data?.error?.details;
    throw err;
  }

  return data;
}
