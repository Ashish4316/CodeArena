import { Link } from "react-router-dom";
import Dashboard from "../components/Dashboard";

const Home = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">CodeArena</h1>
      <p className="mb-4">Structured DSA Practice & Progress Tracking</p>

      <Dashboard />

      <div className="space-y-2">
        <Link to="/sheet/striver" className="block text-blue-600">
          Striver DSA Sheet →
        </Link>
        <Link to="/sheet/love-babbar" className="block text-blue-600">
          Love Babbar Sheet →
        </Link>
      </div>
    </div>
  );
};

export default Home;
