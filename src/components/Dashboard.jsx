import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllProgress } from "../utils/storage";
import { getDailyProgress } from "../utils/dailyProgress";

const SummaryCard = ({ title, value }) => (
  <div className="bg-white dark:bg-gray-800 shadow p-4 rounded">
    <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
    <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
  </div>
);

const Dashboard = () => {
  const [progress, setProgress] = useState({});
  const [daily, setDaily] = useState({});
  const [dark, setDark] = useState(
    localStorage.getItem("theme") === "dark"
  );

  /* ------------------ THEME ------------------ */
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  /* ------------------ LOAD DATA ------------------ */
  useEffect(() => {
    const load = () => {
      setProgress(getAllProgress());
      setDaily(getDailyProgress());
    };
    load();
    window.addEventListener("progressUpdated", load);
    window.addEventListener("storage", load);
    return () => {
      window.removeEventListener("progressUpdated", load);
      window.removeEventListener("storage", load);
    };
  }, []);

  /* ------------------ TOTAL SOLVED ------------------ */
  const totalSolved = Object.values(progress).reduce((acc, sheet) => {
    return acc + Object.values(sheet || {}).filter(Boolean).length;
  }, 0);

  /* ------------------ TODAY SOLVED ------------------ */
  const todayKey = new Date().toISOString().split("T")[0];
  const todaySolved = daily[todayKey] || 0;

  /* ------------------ LAST 7 DAYS GRAPH ------------------ */
  const last7Days = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split("T")[0];
    return { day: key.slice(5), value: daily[key] || 0 };
  }).reverse();

  /* ------------------ SHEET COMPLETION ------------------ */
  const sheetStats = Object.entries(progress).map(([key, sheet]) => {
    const solved = Object.values(sheet || {}).filter(Boolean).length;
    const total = Object.keys(sheet || {}).length || 1;
    const percent = Math.round((solved / total) * 100);
    return { key, solved, total, percent };
  });

  return (
    <div className="p-6 min-h-screen bg-gray-100 dark:bg-gray-900">
      
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          📊 Dashboard
        </h1>
        <button
          onClick={() => setDark(!dark)}
          className="px-4 py-2 rounded bg-gray-800 text-white"
        >
          {dark ? "☀ Light Mode" : "🌙 Dark Mode"}
        </button>
      </div>

      {/* SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <SummaryCard title="Total Solved" value={totalSolved} />
        <SummaryCard title="Solved Today" value={todaySolved} />
        <SummaryCard title="Active Sheets" value={sheetStats.length} />
      </div>

      {/* DAILY GRAPH */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded mb-6">
        <h2 className="font-semibold mb-3 text-gray-900 dark:text-white">
          📈 Last 7 Days Progress
        </h2>
        <div className="flex items-end gap-3 h-32">
          {last7Days.map((d) => (
            <div key={d.day} className="flex flex-col items-center">
              <div
                className="bg-green-500 w-6 rounded"
                style={{ height: `${d.value * 20}px` }}
              />
              <span className="text-xs mt-1 text-gray-500">{d.day}</span>
            </div>
          ))}
        </div>
      </div>

      {/* SHEET COMPLETION */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded mb-6">
        <h2 className="font-semibold mb-3 text-gray-900 dark:text-white">
          🏆 Sheet Completion
        </h2>
        {sheetStats.length === 0 ? (
          <p className="text-sm text-gray-500">No progress yet</p>
        ) : (
          sheetStats.map((s) => (
            <div key={s.key} className="mb-3">
              <div className="flex justify-between">
                <span className="capitalize text-gray-900 dark:text-white">
                  {s.key}
                </span>
                <span>
                  {s.percent === 100 && "🔥 "}
                  {s.solved}/{s.total}
                </span>
              </div>
              <div className="w-full bg-gray-200 h-2 rounded mt-1">
                <div
                  className="bg-green-500 h-2 rounded"
                  style={{ width: `${s.percent}%` }}
                />
              </div>
            </div>
          ))
        )}
      </div>

      {/* COMPANY SHEETS */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded">
        <h2 className="font-semibold mb-3 text-gray-900 dark:text-white">
          🏢 Company-wise Sheets
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {["FAANG", "Google", "Amazon", "Microsoft"].map((c) => (
            <div
              key={c}
              className="border p-3 rounded text-center dark:border-gray-700"
            >
              <p className="font-semibold">{c}</p>
              <p className="text-xs text-gray-500">Coming Soon</p>
            </div>
          ))}
        </div>
      </div>

      {/* LINKS */}
      <div className="mt-6">
        <Link to="/sheet/striver" className="text-blue-500 block">
          → Striver DSA Sheet
        </Link>
        <Link to="/sheet/love-babbar" className="text-blue-500 block">
          → Love Babbar Sheet
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
