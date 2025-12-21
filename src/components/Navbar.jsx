import { Link, NavLink } from "react-router-dom";

const Navbar = () => {
  const linkClass = ({ isActive }) =>
    isActive
      ? "text-blue-600 font-semibold"
      : "text-gray-700 hover:text-blue-600";

  return (
    <nav className="flex justify-between items-center px-6 py-4 border-b">
      <h1 className="text-xl font-bold">CodeArena</h1>

      <div className="space-x-6">
        <NavLink to="/" className={linkClass}>
          Home
        </NavLink>
        <NavLink to="/sheet/striver" className={linkClass}>
          Sheets
        </NavLink>
        <NavLink to="/dashboard" className={linkClass}>
          Dashboard
        </NavLink>
      </div>
    </nav>
  );
};

export default Navbar;
