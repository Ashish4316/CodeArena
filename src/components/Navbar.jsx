import { useState, useRef, useEffect } from "react";
import { initTheme, toggleTheme as toggleDarkMode } from "../utils/theme";

const Navbar = () => {
  const [isDark, setIsDark] = useState(() => {
    // Initialize from localStorage or system preference
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem("theme");
      if (saved) return saved === "dark";
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });
  const [currentUser, setCurrentUser] = useState({ email: "user@example.com" });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Initialize theme on mount
  useEffect(() => {
    initTheme();
    // Sync state with actual document class
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggleTheme = () => {
    toggleDarkMode();
    setIsDark(document.documentElement.classList.contains("dark"));
  };

  const logout = () => setCurrentUser(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      setIsMenuOpen(false);
    } catch (error) {
      console.error("Failed to logout", error);
    }
  };

  return (
    <nav className="sticky top-0 z-40 backdrop-blur-md border-b transition-colors bg-white/80 dark:bg-gray-900/80 border-gray-200 dark:border-gray-800">
      <div className="w-full px-4 h-14 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white text-sm font-bold shadow-md">
            CA
          </div>
          <span className="font-semibold text-base tracking-tight text-gray-900 dark:text-white">
            CodeArena
          </span>
        </a>

        <div className="flex items-center gap-3 sm:gap-6">
          <div className="hidden sm:flex items-center gap-1">
            {[
              { path: "/", label: "Home" },
              { path: "/sheets", label: "Sheets" },
              { path: "/dashboard", label: "Dashboard" },
            ].map((link) => (
              <a
                key={link.path}
                href={link.path}
                className="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Theme toggle - always visible */}
          <button
            onClick={toggleTheme}
            className="w-9 h-9 flex items-center justify-center rounded-lg transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 hover:scale-110"
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            <span className="text-lg transition-transform duration-300">
              {isDark ? "☀️" : "🌙"}
            </span>
          </button>

          <div className="relative" ref={menuRef}>
            {currentUser ? (
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="w-8 h-8 rounded-full border flex items-center justify-center text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gradient-to-br from-blue-500 to-purple-600 border-transparent text-white hover:scale-105 shadow-md"
              >
                {currentUser.email ? currentUser.email[0].toUpperCase() : "U"}
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <a
                  href="/login"
                  className="text-sm font-medium transition-colors text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                >
                  Login
                </a>
                <a
                  href="/register"
                  className="px-3 py-1.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-sm font-medium rounded-lg transition-all duration-200 hover:scale-105 shadow-md"
                >
                  Register
                </a>
              </div>
            )}

            {isMenuOpen && currentUser && (
              <div className="absolute right-0 mt-2 w-56 rounded-xl shadow-xl border py-2 overflow-hidden bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 animate-fadeSlideIn">
                <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Signed in as
                  </p>
                  <p className="text-sm font-semibold truncate text-gray-900 dark:text-white" title={currentUser.email}>
                    {currentUser.email}
                  </p>
                </div>

                <div className="px-2 py-2">
                  <a
                    href="/profile"
                    className="block px-3 py-2 text-sm rounded-lg cursor-pointer transition-colors text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    👤 Profile
                  </a>

                  <button
                    onClick={toggleTheme}
                    className="w-full text-left px-3 py-2 text-sm rounded-lg cursor-pointer transition-colors flex items-center justify-between text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <span>🎨 Theme</span>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800">
                      {isDark ? "Dark" : "Light"}
                    </span>
                  </button>

                  <div className="my-2 border-t border-gray-100 dark:border-gray-800" />

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 text-sm rounded-lg cursor-pointer transition-colors text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    🚪 Log Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeSlideIn {
          animation: fadeSlideIn 0.2s ease-out forwards;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;