export const initTheme = () => {
  const saved = localStorage.getItem("theme") || "light";
  document.documentElement.classList.toggle("dark", saved === "dark");
};

export const toggleTheme = () => {
  const isDark = document.documentElement.classList.toggle("dark");
  localStorage.setItem("theme", isDark ? "dark" : "light");
};
