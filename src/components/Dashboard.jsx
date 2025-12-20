import { getDailyProgress } from "../utils/dailyProgress";

const Dashboard = () => {
  const daily = getDailyProgress();
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="p-4 border rounded mb-6">
      <h2 className="text-xl font-bold mb-2">📊 Progress Dashboard</h2>

      <p className="mb-1">
        🔥 Today Solved: <b>{daily[today] || 0}</b>
      </p>

      <p className="text-sm text-gray-500">
        Consistency builds strong DSA 💪
      </p>
    </div>
  );
};

export default Dashboard;
