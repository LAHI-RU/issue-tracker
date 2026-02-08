const STORAGE_KEY = "theme"; // "light" | "dark"

export function getInitialTheme() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === "light" || saved === "dark") return saved;

  // fallback to system
  const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)")?.matches;
  return prefersDark ? "dark" : "light";
}

export function applyTheme(theme) {
  const root = document.documentElement;
  if (theme === "dark") root.classList.add("dark");
  else root.classList.remove("dark");
}

export function saveTheme(theme) {
  localStorage.setItem(STORAGE_KEY, theme);
}

export function toggleTheme(current) {
  return current === "dark" ? "light" : "dark";
}
