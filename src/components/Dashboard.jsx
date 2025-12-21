import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllProgress } from "../utils/storage";
import { getDailyProgress } from "../utils/dailyProgress";
import DailyGraph from "./DailyGraph";
const SummaryCard = ({ title, value, className }) => (
  <div className={`bg-white shadow p-4 rounded ${className || ""}`}>
    <h3 className="text-sm text-gray-500">{title}</h3>
    <div className="text-2xl font-bold mt-1">{value}</div>
  </div>
);

const Dashboard = ({ compact = false }) => {
  const [progress, setProgress] = useState(() => getAllProgress());
  const [daily, setDaily] = useState(() => getDailyProgress());

  useEffect(() => {
    const handle = () => {
      setProgress(getAllProgress());
      setDaily(getDailyProgress());
    };
    window.addEventListener("storage", handle);
    window.addEventListener("progressUpdated", handle);
    return () => {
      window.removeEventListener("storage", handle);
      window.removeEventListener("progressUpdated", handle);
    };
  }, []);

  // compute totals
  const totalSolved = Object.values(progress).reduce((acc, sheet) => {
    return acc + Object.values(sheet || {}).filter(Boolean).length;
  }, 0);

  const todayKey = new Date().toISOString().split("T")[0];
  const todaySolved = (daily && daily[todayKey]) || 0;

  // simple streak: number of non-zero days in daily progress
  const streak = Object.values(daily || {}).filter((n) => n > 0).length;

  // per-sheet breakdown
  const sheets = Object.keys(progress || {});

  if (compact) {
    // small card used on Home page
    return (
      <div className="p-4 border rounded mb-6">
        <h2 className="text-lg font-bold mb-2">📊 Progress</h2>
        <div className="flex gap-4">
          <SummaryCard title="Solved Today" value={todaySolved} />
          <SummaryCard title="Total Solved" value={totalSolved} />
          <SummaryCard title="Streak" value={`${streak} days`} />
        </div>
      </div>
    );
  }

  // full dashboard view
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">📊 Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <SummaryCard title="Total Solved" value={totalSolved} />
        <SummaryCard title="Solved Today" value={todaySolved} />
        <SummaryCard title="Streak" value={`${streak} days`} />
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Per-sheet progress</h2>
        {sheets.length === 0 ? (
          <p className="text-sm text-gray-500">No progress recorded yet.</p>
        ) : (
          sheets.map((sheetKey) => {
            const sheet = progress[sheetKey] || {};
            const solved = Object.values(sheet).filter(Boolean).length;
            const total = Object.keys(sheet).length || 0;
            const percent = total === 0 ? 0 : Math.round((solved / total) * 100);
            return (
              <div key={sheetKey} className="mb-3 p-3 border rounded">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-lg">{sheetKey}</div>
                    <div className="text-sm text-gray-500">
                      {solved} / {total} solved ({percent}%)
                    </div>
                  </div>
                  <Link
                    to={`/sheet/${
                      sheetKey === "lovebabbar" ? "love-babbar" : sheetKey
                    }`}
                    className="text-blue-600"
                  >
                    Open
                  </Link>
                </div>
                <div className="w-full bg-gray-200 h-2 rounded mt-3">
                  <div
                    className="bg-green-500 h-2 rounded"
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="bg-gray-100 p-4 rounded">
        <h2 className="text-xl font-semibold mb-2">Quick Links</h2>
        <Link className="block text-blue-600 mb-1" to="/sheet/striver">
          → Striver DSA Sheet
        </Link>
        <Link className="block text-blue-600" to="/sheet/love-babbar">
          → Love Babbar Sheet
        </Link>
      </div>
      <DailyGraph />
    </div>
  );
};

export default Dashboard;
