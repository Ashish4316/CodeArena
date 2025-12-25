export const initTheme = () => {
  const saved = localStorage.getItem("theme");
  if (saved) {
    document.documentElement.classList.toggle("dark", saved === "dark");
    return;
  }
  // No saved preference - set from system pref
  const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  document.documentElement.classList.toggle("dark", prefersDark);
};

export const toggleTheme = () => {
  const isNowDark = !document.documentElement.classList.contains("dark");
  document.documentElement.classList.toggle("dark", isNowDark);
  localStorage.setItem("theme", isNowDark ? "dark" : "light");
  return isNowDark;
};
