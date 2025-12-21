import React, { useMemo } from "react";
import { getDailyProgress } from "../utils/dailyProgress";

const ContributionCalendar = () => {
  const dailyProgress = getDailyProgress();

  // Get last 12 months of data
  const months = useMemo(() => {
    const data = [];
    const today = new Date();
    
    for (let i = 11; i >= 0; i--) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      data.push({
        month: date.toLocaleString("default", { month: "short" }),
        year: date.getFullYear(),
        weeks: getWeeksInMonth(date)
      });
    }
    
    return data;
  }, []);

  function getWeeksInMonth(date) {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const weeks = [];
    
    let currentWeek = [];
    let dayCount = 0;
    
    // Add empty cells for days before month starts
    for (let i = 0; i < firstDay.getDay(); i++) {
      currentWeek.push(null);
      dayCount++;
    }
    
    // Add days of month
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      const count = dailyProgress[dateStr] || 0;
      currentWeek.push({ day, date: dateStr, count });
      dayCount++;
      
      if (dayCount % 7 === 0) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    }
    
    // Add remaining empty cells
    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push(null);
      }
      weeks.push(currentWeek);
    }
    
    return weeks;
  }

  const getColor = (count) => {
    if (!count || count === 0) return "var(--bg-tertiary)";
    if (count === 1) return "#86efac";
    if (count <= 3) return "#4ade80";
    if (count <= 5) return "#22c55e";
    return "#15803d";
  };

  return (
    <div className="w-full overflow-auto">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
        <span>🔥</span> Contribution Heatmap (GitHub Style)
      </h2>

      <div className="flex gap-8 min-w-max pb-4">
        {months.map((month, monthIdx) => (
          <div key={monthIdx} className="flex flex-col items-center">
            <div className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3 h-6">
              {month.month}
            </div>
            
            <div className="flex flex-col gap-1">
              {month.weeks.map((week, weekIdx) => (
                <div key={weekIdx} className="flex gap-1">
                  {week.map((day, dayIdx) => {
                    const bgColor = day 
                      ? {
                          0: "bg-gray-200 dark:bg-slate-700",
                          1: "bg-green-200 dark:bg-green-900/40",
                          2: "bg-green-400 dark:bg-green-800/60",
                          3: "bg-green-500 dark:bg-green-700",
                          4: "bg-green-600 dark:bg-green-800"
                        }[Math.min(day.count, 4)]
                      : "bg-transparent";

                    return (
                      <div
                        key={dayIdx}
                        title={day ? `${day.day}: ${day.count} solved` : ""}
                        className={`w-5 h-5 rounded transition-all duration-200 cursor-pointer border ${
                          day 
                            ? `${bgColor} border-green-300 dark:border-green-600 hover:scale-125 hover:shadow-lg` 
                            : "border-transparent"
                        }`}
                      >
                        {day && day.count > 0 && (
                          <div className="w-full h-full flex items-center justify-center text-xs font-bold opacity-0 hover:opacity-100 transition-opacity text-gray-900 dark:text-white">
                            {day.count < 10 ? day.count : "9+"}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-slate-700 flex gap-2 sm:gap-4 items-center flex-wrap text-sm text-gray-600 dark:text-gray-400">
        <span className="font-medium">Less</span>
        <div className="flex gap-1">
          {[
            { bg: "bg-gray-200 dark:bg-slate-700", label: "0" },
            { bg: "bg-green-200 dark:bg-green-900/40", label: "1" },
            { bg: "bg-green-400 dark:bg-green-800/60", label: "2" },
            { bg: "bg-green-500 dark:bg-green-700", label: "3" },
            { bg: "bg-green-600 dark:bg-green-800", label: "4+" }
          ].map((item, i) => (
            <div
              key={i}
              className={`w-4 h-4 rounded border border-green-300 dark:border-green-600 ${item.bg} hover:scale-110 transition-transform cursor-help`}
              title={`${item.label} problems`}
            />
          ))}
        </div>
        <span className="font-medium">More</span>
      </div>
    </div>
  );
};

export default ContributionCalendar;
