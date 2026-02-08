import { apiFetch } from "./api";

export function fetchIssueStats({ signal } = {}) {
  return apiFetch("/issues/stats", { signal });
}

export function fetchIssuesList({ q, status, priority, severity, page = 1, limit = 10, sort = "newest", signal } = {}) {
  const params = new URLSearchParams();

  if (q) params.set("q", q);
  if (status) params.set("status", status);
  if (priority) params.set("priority", priority);
  if (severity) params.set("severity", severity);

  params.set("page", String(page));
  params.set("limit", String(limit));
  params.set("sort", sort);

  const qs = params.toString();
  return apiFetch(`/issues?${qs}`, { signal });
}

export function fetchIssueById(id, { signal } = {}) {
  return apiFetch(`/issues/${id}`, { signal });
}

export function updateIssueStatus(id, status) {
  return apiFetch(`/issues/${id}/status`, {
    method: "PATCH",
    body: { status }
  });
}

export function createIssue(payload) {
  return apiFetch("/issues", { method: "POST", body: payload });
}

export function updateIssue(id, payload) {
  return apiFetch(`/issues/${id}`, { method: "PATCH", body: payload });
}

export function deleteIssue(id) {
  return apiFetch(`/issues/${id}`, { method: "DELETE" });
}

export async function fetchIssues(params) {
  // If you already have a function, call it here.
  // Otherwise implement minimal list call:
  const qs = new URLSearchParams();

  if (params?.q) qs.set("q", params.q);
  if (params?.status) qs.set("status", params.status);
  if (params?.priority) qs.set("priority", params.priority);
  if (params?.severity) qs.set("severity", params.severity);
  if (params?.sort) qs.set("sort", params.sort);
  if (params?.page) qs.set("page", String(params.page));
  if (params?.limit) qs.set("limit", String(params.limit));

  // support AbortController cancellation via apiFetch
  return listIssues(`?${qs.toString()}`, params?.signal);
}

// --- helper using your existing apiFetch ---
// If you already have apiFetch imported and functions defined, keep them.


async function listIssues(queryString, signal) {
  return apiFetch(`/issues${queryString}`, { signal });
}

