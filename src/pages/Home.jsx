import { Link } from "react-router-dom";
import Dashboard from "../components/Dashboard";

const Home = () => {
  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold mb-2">CodeArena</h1>
      <p className="text-gray-600 mb-6">
        Structured DSA Practice & Progress Tracking Platform
      </p>

      {/* Compact dashboard summary */}
      <Dashboard compact />

      <div className="mt-6 space-y-2">
        <Link to="/sheet/striver" className="block text-blue-600">
          → Start Striver DSA Sheet
        </Link>
        <Link to="/sheet/love-babbar" className="block text-blue-600">
          → Start Love Babbar Sheet
        </Link>
        <Link to="/dashboard" className="block text-green-600 font-semibold">
          → View Full Dashboard
        </Link>
      </div>
    </div>
  );
};

export default Home;

