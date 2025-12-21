import { getDailyProgress } from "../utils/dailyProgress";

const StreakCalendar = () => {
  const daily = getDailyProgress();
  
  // Last 30 days
  const days = [...Array(30)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split("T")[0];
    return { 
      key, 
      count: daily[key] || 0,
      date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
    };
  });

  const getColor = (count) => {
    if (count === 0) return "bg-gray-100 dark:bg-slate-700 border border-gray-300 dark:border-slate-600";
    if (count === 1) return "bg-green-200 dark:bg-green-900/40 border border-green-300 dark:border-green-700";
    if (count <= 2) return "bg-green-400 dark:bg-green-800/60 border border-green-500 dark:border-green-600";
    if (count <= 3) return "bg-green-500 dark:bg-green-700 border border-green-600 dark:border-green-600";
    return "bg-green-600 dark:bg-green-800 border border-green-700 dark:border-green-700";
  };

  const maxCount = Math.max(...days.map(d => d.count), 1);
  let currentStreak = 0;
  for (let i = 0; i < days.length; i++) {
    if (days[i].count > 0) currentStreak++;
    else break;
  }

  return (
    <div className="space-y-4">
      {/* Streak Badge */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Last 30 days
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {currentStreak} <span className="text-lg text-gray-500 dark:text-gray-400">day streak</span>
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600 dark:text-gray-400">Highest</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            {maxCount}
          </p>
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="flex gap-1 flex-wrap">
        {days.reverse().map((d, idx) => (
          <div
            key={d.key}
            className="group relative"
            title={`${d.date}: ${d.count} solved`}
          >
            <div
              className={`w-5 h-5 rounded transition-all duration-200 hover:scale-125 cursor-pointer ${getColor(d.count)}`}
            />
            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
              {d.date}: {d.count} solved
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 pt-2">
        <span>Less</span>
        <div className="flex gap-1">
          {[0, 1, 2, 3, 4].map((i) => {
            const counts = [0, 1, 2, 3, 4];
            return (
              <div
                key={i}
                className={`w-3 h-3 rounded ${getColor(counts[i])}`}
              />
            );
          })}
        </div>
        <span>More</span>
      </div>
    </div>
  );
};

export default StreakCalendar;
