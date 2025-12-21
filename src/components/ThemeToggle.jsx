import { toggleTheme } from "../utils/theme";

const ThemeToggle = () => {
  return (
    <button
      onClick={toggleTheme}
      className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700"
    >
      🌙 / ☀️
    </button>
  );
};

export default ThemeToggle;
