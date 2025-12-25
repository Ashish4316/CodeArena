import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllProgress } from "../utils/storage";
import { getDailyProgress } from "../utils/dailyProgress";
import GamificationStats from "./GamificationStats";
import Achievements from "./Achievements";

const SummaryCard = ({ title, value, icon }) => {
  return (
    <div className="ui-card p-4 flex items-center justify-between">
      <div>
        <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-1">{title}</p>
        <p className="text-3xl font-bold text-text-primary">{value}</p>
      </div>
      <div className="text-2xl opacity-80">{icon}</div>
    </div>
  );
};

const Dashboard = () => {
  const [progress, setProgress] = useState({});
  const [daily, setDaily] = useState({});

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

  const totalSolved = Object.values(progress).reduce((acc, sheet) => {
    return acc + Object.values(sheet || {}).filter(Boolean).length;
  }, 0);

  const last7Days = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split("T")[0];
    return { day: key.slice(5), value: daily[key] || 0 };
  }).reverse();

  const sheetStats = Object.entries(progress).map(([key, sheet]) => {
    const solved = Object.values(sheet || {}).filter(Boolean).length;
    const total = Object.keys(sheet || {}).length || 1;
    const percent = Math.round((solved / total) * 100);
    return { key, solved, total, percent };
  });

  return (
    <div className="bg-bg-secondary min-h-[calc(100vh-3.5rem)] py-6">
      <div className="container-tight">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-text-primary">Dashboard</h1>
          <p className="text-sm text-text-secondary">Overview of your activity</p>
        </div>

        {/* Summary Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <SummaryCard title="Total Solved" value={totalSolved} icon="📝" />
          <SummaryCard title="Today" value={daily[new Date().toISOString().split("T")[0]] || 0} icon="🔥" />
          <SummaryCard title="Active Sheets" value={Object.keys(progress).length} icon="📚" />
        </div>

        {/* Gamification Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-1">
            <GamificationStats />
          </div>
          <div className="lg:col-span-2">
            <Achievements />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Main Chart Area */}
          <div className="lg:col-span-2 space-y-6">
            <div className="ui-card p-5">
              <h2 className="text-sm font-bold text-text-primary mb-4">Activity (Last 7 Days)</h2>
              <div className="flex items-end h-32 gap-2">
                {last7Days.map((d) => (
                  <div key={d.day} className="flex-1 flex flex-col items-center gap-1 group">
                    <div className="w-full bg-accent/10 rounded-t-sm h-full relative flex items-end overflow-hidden">
                      <div
                        className="w-full bg-accent transition-all duration-500 rounded-t-sm group-hover:bg-accent-hover"
                        style={{ height: d.value > 0 ? `${Math.min(d.value * 20, 100)}%` : "4px" }}
                      />
                    </div>
                    <span className="text-[10px] uppercase font-bold text-text-tertiary">{d.day}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="ui-card p-5">
              <h2 className="text-sm font-bold text-text-primary mb-3">Recommended Sheets</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Link to="/sheet/striver-sde" className="p-3 rounded-md bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 hover:border-blue-500 dark:hover:border-blue-400 transition-all flex items-center gap-3 group">
                  <span className="text-2xl group-hover:scale-110 transition-transform duration-200">📘</span>
                  <div>
                    <span className="block text-sm font-bold text-text-primary">Striver SDE Sheet</span>
                    <span className="text-xs text-text-secondary">Top 190+ Questions</span>
                  </div>
                </Link>
                <Link to="/sheet/striver-a2z" className="p-3 rounded-md bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 hover:border-green-500 dark:hover:border-green-400 transition-all flex items-center gap-3 group">
                  <span className="text-2xl group-hover:scale-110 transition-transform duration-200">📗</span>
                  <div>
                    <span className="block text-sm font-bold text-text-primary">Striver A2Z Sheet</span>
                    <span className="text-xs text-text-secondary">Complete DSA Roadmap</span>
                  </div>
                </Link>
              </div>
            </div>

            <div className="ui-card p-5">
              <h2 className="text-sm font-bold text-text-primary mb-3">Quick Actions</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Link to="/company/faang" className="p-3 rounded-md bg-bg-tertiary hover:bg-white border border-transparent hover:border-border transition-all flex items-center gap-3">
                  <span className="text-xl">🏢</span>
                  <span className="text-sm font-medium text-text-primary">Company Sets</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Sidebar Area: Progress */}
          <div className="ui-card p-5 h-fit">
            <h2 className="text-sm font-bold text-text-primary mb-4">Sheet Progress</h2>
            {sheetStats.length === 0 ? (
              <p className="text-sm text-text-secondary">No active sheets.</p>
            ) : (
              <div className="space-y-4">
                {sheetStats.map((s) => (
                  <div key={s.key}>
                    <div className="flex justify-between items-center mb-1 text-xs">
                      <span className="font-semibold capitalize text-text-primary">{s.key}</span>
                      <span className="font-bold text-accent">{s.percent}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-bg-tertiary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-accent rounded-full"
                        style={{ width: `${s.percent}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};

export default Dashboard;
