import { Link, NavLink } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

const Navbar = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <nav className="sticky top-0 z-40 bg-bg-primary/80 backdrop-blur-md border-b border-border">
      <div className="container-tight h-14 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-white text-lg font-bold">
            CA
          </div>
          <span className="font-semibold text-lg text-text-primary tracking-tight">CodeArena</span>
        </Link>

        {/* Links */}
        <div className="flex items-center gap-6">
          <div className="hidden sm:flex items-center gap-1">
            {[
              { path: "/", label: "Home" },
              { path: "/sheets", label: "Sheets" },
              { path: "/dashboard", label: "Dashboard" },
            ].map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${isActive
                    ? "text-accent bg-accent-subtle"
                    : "text-text-secondary hover:text-text-primary hover:bg-bg-tertiary"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          <button
            onClick={toggleTheme}
            className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-bg-tertiary text-text-secondary transition-colors"
            title="Toggle Theme"
          >
            {isDark ? "☀️" : "🌙"}
          </button>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;