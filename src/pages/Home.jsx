import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold mb-2">CodeArena</h1>
      <p className="text-gray-600 mb-6">
        Structured DSA Practice & Progress Tracking Platform
      </p>

      <div className="space-y-3">
        <Link to="/sheet/striver" className="block text-blue-600 text-lg">
          → Start Striver DSA Sheet
        </Link>

        <Link to="/sheet/love-babbar" className="block text-blue-600 text-lg">
          → Start Love Babbar Sheet
        </Link>

        <Link to="/dashboard" className="block text-green-600 text-lg">
          → View Dashboard
        </Link>
      </div>
    </div>
  );
};

export default Home;


