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
