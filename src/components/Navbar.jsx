import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">CodeArena</h1>

      <div className="space-x-4">
        <Link to="/" className="hover:text-gray-300">
          Home
        </Link>
        <Link to="/dashboard" className="hover:text-gray-300">
          Dashboard
        </Link>
        <Link to="/sheet/striver" className="hover:text-gray-300">
          Striver Sheet
        </Link>
        <Link to="/sheet/love-babbar" className="hover:text-gray-300">
          Love Babbar Sheet
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;

