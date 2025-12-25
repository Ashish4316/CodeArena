import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllProgress } from "../utils/storage";
import { getDailyProgress, getTodayKey, calcStreak } from "../utils/dailyProgress";
import ContributionCalendar from "../components/ContributionCalendar";

const DashboardPage = () => {
  const [stats, setStats] = useState({
    totalSolved: 0,
    todaySolved: 0,
    streak: 0,
    sheets: []
  });

  useEffect(() => {
    const load = () => {
      const progress = getAllProgress();
      const daily = getDailyProgress();
      const today = getTodayKey();

      let totalSolved = 0;
      Object.values(progress).forEach((sheetObj) => {
        totalSolved += Object.values(sheetObj || {}).filter(Boolean).length;
      });

      const todaySolved = Number(daily[today] || 0);

      // Use calcStreak to compute streak consistently
      const streak = calcStreak(daily || {});

      const sheets = Object.entries(progress).map(([key, sheet]) => {
        const solved = Object.values(sheet || {}).filter(Boolean).length;
        return { name: key, solved };
      });

      setStats({ totalSolved, todaySolved, streak, sheets });
    };

    load();
    window.addEventListener("progressUpdated", load);
    window.addEventListener("storage", load);
    return () => {
      window.removeEventListener("progressUpdated", load);
      window.removeEventListener("storage", load);
    };
  }, []);

  // Map stored keys back to friendly route names (best-effort)
  const storageKeyToRoute = (key) => {
    const k = (key || "").toLowerCase();
    if (k.includes("babbar")) return "love-babbar";
    if (k.includes("a2z")) return "striver-a2z";
    if (k.includes("sde") && k.includes("striver")) return "striver-sde";
    if (k.includes("striver") && k.includes("sde") === false && k.includes("a2z") === false) return "striver";
    // fallback: try to re-insert a hyphen before known suffixes
    if (k.startsWith("love") && k.includes("babbar")) return "love-babbar";
    // otherwise return key as-is so link still works
    return key;
  };

  return (
    <div className="page-wrapper bg-gray-50 dark:bg-slate-900">
      <div className="container-2xl container-base mx-auto px-responsive py-8 sm:py-12 lg:py-16">
        {/* Header */}
        <div className="mb-10 sm:mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-2">
            📊 Your Dashboard
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Track your DSA learning journey
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Solved Card */}
          <div className="bg-linear-to-br from-blue-600 to-blue-500 rounded-2xl p-6 sm:p-8 text-white shadow-lg hover:shadow-xl transition-shadow duration-200 relative overflow-hidden">
            <div className="absolute -top-8 -right-8 text-9xl opacity-10">✓</div>
            <div className="relative z-10">
              <p className="text-blue-100 text-sm font-medium mb-2">Total Solved</p>
              <h2 className="text-4xl sm:text-5xl font-bold mb-1">{stats.totalSolved}</h2>
              <p className="text-blue-100 text-sm">problems</p>
            </div>
          </div>

          {/* Today Solved Card */}
          <div className="bg-linear-to-br from-pink-600 to-pink-500 rounded-2xl p-6 sm:p-8 text-white shadow-lg hover:shadow-xl transition-shadow duration-200 relative overflow-hidden">
            <div className="absolute -top-8 -right-8 text-9xl opacity-10">🔥</div>
            <div className="relative z-10">
              <p className="text-pink-100 text-sm font-medium mb-2">Today's Progress</p>
              <h2 className="text-4xl sm:text-5xl font-bold mb-1">{stats.todaySolved}</h2>
              <p className="text-pink-100 text-sm">solved</p>
            </div>
          </div>

          {/* Streak Card */}
          <div className="bg-linear-to-br from-cyan-600 to-cyan-500 rounded-2xl p-6 sm:p-8 text-white shadow-lg hover:shadow-xl transition-shadow duration-200 relative overflow-hidden">
            <div className="absolute -top-8 -right-8 text-9xl opacity-10">⚡</div>
            <div className="relative z-10">
              <p className="text-cyan-100 text-sm font-medium mb-2">Current Streak</p>
              <h2 className="text-4xl sm:text-5xl font-bold mb-1">{stats.streak}</h2>
              <p className="text-cyan-100 text-sm">days</p>
            </div>
          </div>
        </div>

        {/* GitHub-like Contribution Calendar */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-700 p-6 sm:p-8 mb-8">
          <ContributionCalendar />
        </div>

        {/* Per-Sheet Stats */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-700 p-6 sm:p-8 mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6">
            📋 Sheet-wise Progress
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.sheets.length > 0 ? (
              stats.sheets.map((sheet, idx) => (
                <Link
                  key={idx}
                  to={`/sheet/${storageKeyToRoute(sheet.name)}`}
                  className="group"
                >
                  <div className="bg-gray-50 dark:bg-slate-700/50 border border-gray-200 dark:border-slate-600 rounded-lg p-4 sm:p-6 cursor-pointer transition-all duration-200 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-lg group-hover:bg-gray-100 dark:group-hover:bg-slate-700">
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-3">
                      {sheet.name}
                    </p>
                    <p className="text-3xl sm:text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                      {sheet.solved}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                      problems solved
                    </p>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">No progress yet. Start solving problems!</p>
              </div>
            )}
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-linear-to-r from-blue-600 to-blue-500 dark:from-blue-500 dark:to-blue-600 rounded-2xl p-8 sm:p-12 text-white text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-white rounded-full translate-x-1/2 translate-y-1/2" />
          </div>
          <div className="relative z-10">
            <h3 className="text-2xl sm:text-3xl font-bold mb-4">
              Keep Grinding! 💪
            </h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Every problem solved brings you closer to mastering DSA. Keep up the momentum!
            </p>
            <Link 
              to="/sheet/striver" 
              className="inline-flex items-center justify-center px-6 py-3 bg-white text-blue-600 hover:bg-blue-50 dark:hover:bg-gray-200 font-semibold rounded-lg transition-all duration-200 hover:shadow-lg active:scale-95"
            >
              Start Practicing →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
