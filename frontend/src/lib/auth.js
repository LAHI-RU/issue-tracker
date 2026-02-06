import { apiFetch } from "./api";
import { setToken, clearToken, getToken } from "./token";

export async function register({ email, password, name }) {
  const res = await apiFetch("/auth/register", {
    method: "POST",
    body: { email, password, name }
  });

  setToken(res.data.token);
  return res.data.user;
}

export async function login({ email, password }) {
  const res = await apiFetch("/auth/login", {
    method: "POST",
    body: { email, password }
  });

  setToken(res.data.token);
  return res.data.user;
}

export async function me() {
  return apiFetch("/auth/me");
}

export function logout() {
  clearToken();
}

export function isAuthed() {
  return !!getToken();
}
