import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-gray-900 text-white px-6 py-3 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold">
        CodeArena
      </Link>

      <div className="space-x-4">
        <Link to="/sheet/striver" className="hover:text-green-400">
          Striver Sheet
        </Link>
        <Link to="/sheet/love-babbar" className="hover:text-green-400">
          Love Babbar Sheet
        </Link>
        <Link to="/dashboard" className="hover:text-green-400">
          Dashboard
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
