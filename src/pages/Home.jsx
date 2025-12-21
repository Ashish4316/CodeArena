import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-2">CodeArena</h1>
      <p className="mb-6 text-gray-600">
        Structured DSA Practice & Progress Tracking Platform
      </p>

      <div className="space-y-3">
        <Link to="/sheet/striver" className="block text-blue-600">
          → Striver DSA Sheet
        </Link>
        <Link to="/sheet/love-babbar" className="block text-blue-600">
          → Love Babbar DSA Sheet
        </Link>
        <Link to="/dashboard" className="block text-blue-600">
          → View Dashboard
        </Link>
      </div>
    </div>
  );
};

export default Home;


