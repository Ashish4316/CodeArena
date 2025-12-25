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
    <nav className="sticky top-0 z-50 backdrop-blur-lg border-b transition-colors bg-white/90 dark:bg-gray-900/90 border-gray-200/50 dark:border-gray-800/50 shadow-sm">
      <div className="w-full px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white text-base font-bold shadow-lg shadow-blue-500/30 dark:shadow-purple-500/20 transition-transform duration-300 group-hover:scale-110">
              CA
            </div>
            <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-xl rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent transition-all duration-300 group-hover:scale-105">
            CodeArena
          </span>
        </a>

        <div className="flex items-center gap-4 sm:gap-6">
          {/* Desktop Navigation */}
          <div className="hidden sm:flex items-center gap-1">
            {[
              { path: "/", label: "Home" },
              { path: "/sheets", label: "Sheets" },
              { path: "/dashboard", label: "Dashboard" },
            ].map((link) => (
              <a
                key={link.path}
                href={link.path}
                className="relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100/80 dark:hover:bg-gray-800/80 group"
              >
                {link.label}
                <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 group-hover:w-4/5" />
              </a>
            ))}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="relative w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 hover:scale-110 group"
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-amber-400/20 to-blue-400/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="text-xl transition-all duration-300 group-hover:rotate-12">
              {isDark ? "☀️" : "🌙"}
            </span>
          </button>

          {/* User Menu */}
          <div className="relative" ref={menuRef}>
            {currentUser ? (
              <>
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="relative w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 hover:scale-110 group"
                >
                  <div className="absolute -inset-1 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-full blur opacity-70 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white shadow-lg">
                    {currentUser.email ? currentUser.email[0].toUpperCase() : "U"}
                  </div>
                </button>

                {isMenuOpen && (
                  <div className="absolute right-0 mt-3 w-56 rounded-2xl shadow-2xl border py-2 overflow-hidden bg-white/95 dark:bg-gray-900/95 border-gray-200/50 dark:border-gray-800/50 backdrop-blur-xl animate-fadeSlideIn">
                    <div className="px-4 py-3 border-b border-gray-100/50 dark:border-gray-800/50">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                        Signed in as
                      </p>
                      <p className="text-sm font-semibold truncate text-gray-900 dark:text-white" title={currentUser.email}>
                        {currentUser.email}
                      </p>
                    </div>

                    <div className="px-2 py-2">
                      <a
                        href="/profile"
                        className="flex items-center gap-3 px-3 py-2.5 text-sm rounded-xl cursor-pointer transition-all duration-200 text-gray-700 dark:text-gray-300 hover:bg-gray-100/80 dark:hover:bg-gray-800/80 hover:translate-x-1"
                      >
                        <span className="text-base">👤</span>
                        <span>Profile</span>
                      </a>

                      <button
                        onClick={toggleTheme}
                        className="w-full flex items-center justify-between px-3 py-2.5 text-sm rounded-xl cursor-pointer transition-all duration-200 text-gray-700 dark:text-gray-300 hover:bg-gray-100/80 dark:hover:bg-gray-800/80"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-base">{isDark ? "☀️" : "🌙"}</span>
                          <span>Theme</span>
                        </div>
                        <span className="text-xs font-medium px-2 py-1 rounded-lg bg-gray-100 dark:bg-gray-800">
                          {isDark ? "Dark" : "Light"}
                        </span>
                      </button>

                      <div className="my-2 mx-3 border-t border-gray-100/50 dark:border-gray-800/50" />

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-xl cursor-pointer transition-all duration-200 text-red-600 dark:text-red-400 hover:bg-red-50/80 dark:hover:bg-red-900/20 hover:translate-x-1"
                      >
                        <span className="text-base">🚪</span>
                        <span>Log Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="flex items-center gap-3">
                <a
                  href="/login"
                  className="hidden sm:block px-4 py-2 text-sm font-medium transition-all duration-300 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:scale-105"
                >
                  Login
                </a>
                <a
                  href="/register"
                  className="relative px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-sm font-medium rounded-xl transition-all duration-300 hover:scale-105 shadow-lg shadow-blue-500/30 dark:shadow-purple-500/20 group overflow-hidden"
                >
                  <span className="relative z-10">Register</span>
                  <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="sm:hidden absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        <span className="text-xl">☰</span>
      </button>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="sm:hidden px-6 py-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 animate-slideDown">
          <div className="flex flex-col gap-2">
            {[
              { path: "/", label: "Home" },
              { path: "/sheets", label: "Sheets" },
              { path: "/dashboard", label: "Dashboard" },
            ].map((link) => (
              <a
                key={link.path}
                href={link.path}
                className="px-4 py-3 rounded-lg text-sm font-medium transition-colors text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
            {!currentUser && (
              <>
                <a
                  href="/login"
                  className="px-4 py-3 rounded-lg text-sm font-medium transition-colors text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </a>
                <a
                  href="/register"
                  className="px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium rounded-lg text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Register
                </a>
              </>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeSlideIn {
          from { 
            opacity: 0; 
            transform: translateY(-10px) scale(0.95); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0) scale(1); 
          }
        }
        
        @keyframes slideDown {
          from { 
            opacity: 0; 
            transform: translateY(-20px); 
            max-height: 0;
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
            max-height: 300px;
          }
        }
        
        .animate-fadeSlideIn {
          animation: fadeSlideIn 0.2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        
        .animate-slideDown {
          animation: slideDown 0.3s ease-out forwards;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;