import { getDailyProgress, calcStreak } from "../utils/dailyProgress";
import { useState, useEffect } from "react";

const StreakCalendar = () => {
  const [daily, setDaily] = useState({});
  const [currentStreak, setCurrentStreak] = useState(0);

  // Load progress on mount and listen for updates
  useEffect(() => {
    const load = () => {
      const data = getDailyProgress() || {};
      setDaily(data);
      setCurrentStreak(calcStreak(data));
    };
    load();

    // Listen for progress updates
    window.addEventListener("progressUpdated", load);
    window.addEventListener("storage", load);

    return () => {
      window.removeEventListener("progressUpdated", load);
      window.removeEventListener("storage", load);
    };
  }, []);

  // Get today's date key in local YYYY-MM-DD
  const getTodayKey = () => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  // Last 30 days - build with local dates
  const days = [...Array(30)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const key = `${y}-${m}-${day}`;
    return {
      key,
      count: (daily && daily[key]) ? daily[key] : 0,
      date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      isToday: key === getTodayKey()
    };
  });

  const getColor = (count, isToday) => {
    const base = count === 0
      ? "bg-gray-100 dark:bg-gray-800"
      : count === 1
        ? "bg-green-200 dark:bg-green-900/50"
        : count <= 2
          ? "bg-green-400 dark:bg-green-800/70"
          : count <= 4
            ? "bg-green-500 dark:bg-green-700"
            : "bg-green-600 dark:bg-green-600";

    // Add ring for today
    const todayRing = isToday ? " ring-2 ring-blue-500 ring-offset-1 dark:ring-offset-gray-900" : "";

    return `${base}${todayRing}`;
  };

  // Calculate stats
  const todayCount = daily[getTodayKey()] || 0;
  const totalSolved = Object.values(daily || {}).reduce((sum, count) => sum + (Number(count) || 0), 0);
  const maxCount = Math.max(...days.map(d => Number(d.count) || 0), 0);
  const activeDays = days.filter(d => d.count > 0).length;

  return (
    <div className="space-y-4">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Current Streak */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 rounded-xl p-3 border border-amber-200/50 dark:border-amber-700/30">
          <p className="text-xs font-medium text-amber-600 dark:text-amber-400 mb-1">🔥 Current Streak</p>
          <p className="text-2xl font-black text-amber-700 dark:text-amber-300">
            {currentStreak}
            <span className="text-sm font-medium text-amber-500 dark:text-amber-400 ml-1">days</span>
          </p>
        </div>

        {/* Today */}
        <div className="bg-gradient-to-br from-sky-50 to-blue-100 dark:from-sky-900/30 dark:to-blue-900/30 rounded-xl p-3 border border-sky-200/50 dark:border-sky-700/30">
          <p className="text-xs font-medium text-sky-600 dark:text-sky-400 mb-1">📅 Today</p>
          <p className="text-2xl font-black text-sky-700 dark:text-sky-300">
            {todayCount}
            <span className="text-sm font-medium text-sky-500 dark:text-sky-400 ml-1">solved</span>
          </p>
        </div>

        {/* Total Solved */}
        <div className="bg-gradient-to-br from-violet-50 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/30 rounded-xl p-3 border border-violet-200/50 dark:border-violet-700/30">
          <p className="text-xs font-medium text-violet-600 dark:text-violet-400 mb-1">✅ Total Solved</p>
          <p className="text-2xl font-black text-violet-700 dark:text-violet-300">
            {totalSolved}
          </p>
        </div>

        {/* Best Day */}
        <div className="bg-gradient-to-br from-emerald-50 to-green-100 dark:from-emerald-900/30 dark:to-green-900/30 rounded-xl p-3 border border-emerald-200/50 dark:border-emerald-700/30">
          <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 mb-1">🏆 Best Day</p>
          <p className="text-2xl font-black text-emerald-700 dark:text-emerald-300">
            {maxCount}
          </p>
        </div>
      </div>

      {/* Heatmap Grid */}
      <div>
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Last 30 Days</p>
        <div className="flex gap-1 flex-wrap">
          {days.slice().reverse().map((d) => (
            <div
              key={d.key}
              className="group relative"
              title={`${d.date}: ${d.count} solved`}
            >
              <div
                className={`w-5 h-5 rounded-md transition-all duration-200 hover:scale-125 cursor-pointer ${getColor(d.count, d.isToday)}`}
              />
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10 shadow-lg">
                <span className="font-medium">{d.date}</span>
                <span className="text-gray-300 dark:text-gray-400">: {d.count} solved</span>
                {d.isToday && <span className="ml-1 text-blue-400">(Today)</span>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
        <span>Less</span>
        <div className="flex gap-1">
          {[0, 1, 2, 4, 5].map((count) => (
            <div
              key={count}
              className={`w-3 h-3 rounded ${getColor(count, false)}`}
            />
          ))}
        </div>
        <span>More</span>

        <div className="ml-auto flex items-center gap-1">
          <div className="w-3 h-3 rounded ring-2 ring-blue-500 ring-offset-1 dark:ring-offset-gray-900 bg-gray-100 dark:bg-gray-800" />
          <span>Today</span>
        </div>
      </div>
    </div>
  );
};

export default StreakCalendar;
