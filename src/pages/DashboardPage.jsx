import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllProgress } from "../utils/storage";
import { getDailyProgress, getTodayKey, calcStreak } from "../utils/dailyProgress";
import ContributionCalendar from "../components/ContributionCalendar";
import GamificationStats from "../components/GamificationStats";
import Achievements from "../components/Achievements";

const DashboardPage = () => {
  const [stats, setStats] = useState({
    totalSolved: 0,
    todaySolved: 0,
    streak: 0,
    sheets: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

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
      const streak = calcStreak(daily || {});

      const sheets = Object.entries(progress).map(([key, sheet]) => {
        const solved = Object.values(sheet || {}).filter(Boolean).length;
        return { name: key, solved };
      });

      setStats({ totalSolved, todaySolved, streak, sheets });
      setIsLoading(false);
    };

    // Simulate loading animation
    setIsLoading(true);
    const timer = setTimeout(() => load(), 500);
    
    window.addEventListener("progressUpdated", load);
    window.addEventListener("storage", load);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("progressUpdated", load);
      window.removeEventListener("storage", load);
    };
  }, []);

  // Track mouse for background effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const storageKeyToRoute = (key) => {
    const k = (key || "").toLowerCase();
    if (k.includes("babbar")) return "love-babbar";
    if (k.includes("a2z")) return "striver-a2z";
    if (k.includes("sde") && k.includes("striver")) return "striver-sde";
    if (k.includes("striver") && k.includes("sde") === false && k.includes("a2z") === false) return "striver";
    if (k.startsWith("love") && k.includes("babbar")) return "love-babbar";
    return key;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-950 dark:via-slate-900 dark:to-indigo-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-950 dark:via-slate-900 dark:to-indigo-950 relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Gradient orbs */}
        <div className="absolute top-20 -left-32 w-96 h-96 bg-blue-400/20 dark:bg-blue-600/10 rounded-full blur-3xl animate-float" />
        <div className="absolute top-1/3 -right-32 w-[500px] h-[500px] bg-purple-400/20 dark:bg-purple-600/10 rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-pink-400/15 dark:bg-pink-600/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        
        {/* Mouse follow glow */}
        <div
          className="absolute w-[400px] h-[400px] bg-gradient-to-r from-blue-400/30 to-purple-400/30 blur-3xl rounded-full transition-all duration-700 ease-out"
          style={{
            left: mousePosition.x / 20 - 200,
            top: mousePosition.y / 20 - 200,
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        {/* Header - Logo removed */}
        <div className="mb-8 sm:mb-12 transition-all duration-700 animate-fadeIn">
          <div className="relative inline-block group">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent mb-2">
              Your Dashboard
            </h1>
            <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-xl rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 mt-4">
            Track your DSA learning journey with beautiful insights
          </p>
        </div>

        {/* Gamification Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 animate-fadeIn" style={{ animationDelay: '100ms' }}>
          <div className="lg:col-span-1">
            <GamificationStats />
          </div>
          <div className="lg:col-span-2">
            <Achievements />
          </div>
        </div>

        {/* Stats Grid - Fixed counters (no animation) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            {
              title: "Total Solved",
              value: stats.totalSolved,
              unit: "problems",
              gradient: "from-blue-600 via-blue-500 to-cyan-500",
              icon: "✓",
              delay: "200ms"
            },
            {
              title: "Today's Progress",
              value: stats.todaySolved,
              unit: "solved",
              gradient: "from-pink-600 via-pink-500 to-rose-500",
              icon: "🔥",
              delay: "300ms"
            },
            {
              title: "Current Streak",
              value: stats.streak,
              unit: "days",
              gradient: "from-cyan-600 via-cyan-500 to-teal-500",
              icon: "⚡",
              delay: "400ms"
            }
          ].map((card, idx) => (
            <div
              key={idx}
              className={`relative group animate-fadeIn hover:scale-[1.02] transition-all duration-300`}
              style={{ animationDelay: card.delay }}
            >
              {/* Glow effect */}
              <div className={`absolute -inset-0.5 bg-gradient-to-br ${card.gradient} rounded-2xl blur opacity-0 group-hover:opacity-60 transition-opacity duration-300`} />
              
              {/* Main card */}
              <div className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl p-6 sm:p-8 shadow-xl border border-white/30 dark:border-gray-700/30 overflow-hidden">
                {/* Animated background */}
                <div className="absolute inset-0 bg-gradient-to-br opacity-10 from-blue-500/30 via-purple-500/30 to-pink-500/30 animate-gradient" />
                
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-4">
                    <p className="text-gray-600 dark:text-gray-300 text-sm font-medium">{card.title}</p>
                    <span className="text-3xl opacity-20 group-hover:opacity-40 group-hover:scale-110 transition-all duration-300">
                      {card.icon}
                    </span>
                  </div>
                  
                  {/* Fixed: Direct value display without animation */}
                  <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-2">
                    {card.value}
                  </h2>
                  
                  <div className="flex items-center justify-between">
                    <p className="text-gray-500 dark:text-gray-400 text-sm">{card.unit}</p>
                    {/* Progress indicator for streak */}
                    {idx === 2 && (
                      <div className="flex items-center gap-2">
                        {[...Array(7)].map((_, i) => (
                          <div
                            key={i}
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${
                              i < stats.streak % 7
                                ? "bg-green-500"
                                : "bg-gray-300 dark:bg-gray-700"
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contribution Calendar */}
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/30 dark:border-gray-700/30 p-6 sm:p-8 mb-8 animate-fadeIn" style={{ animationDelay: '500ms' }}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                <span className="bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
                  Coding Calendar
                </span>
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Your daily coding activity</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Active Days</div>
              <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {Object.keys(getDailyProgress()).length}
              </div>
            </div>
          </div>
          <ContributionCalendar />
        </div>

        {/* Per-Sheet Stats */}
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/30 dark:border-gray-700/30 p-6 sm:p-8 mb-8 animate-fadeIn" style={{ animationDelay: '600ms' }}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              <span className="bg-gradient-to-r from-orange-600 to-amber-600 dark:from-orange-400 dark:to-amber-400 bg-clip-text text-transparent">
                Sheet-wise Progress
              </span>
            </h2>
            <span className="text-sm font-semibold px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
              {stats.sheets.length} sheets
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.sheets.length > 0 ? (
              stats.sheets.map((sheet, idx) => (
                <Link
                  key={idx}
                  to={`/sheet/${storageKeyToRoute(sheet.name)}`}
                  className="group animate-fadeIn"
                  style={{ animationDelay: `${700 + idx * 100}ms` }}
                >
                  <div className="relative bg-gradient-to-br from-gray-50 to-white dark:from-gray-800/50 dark:to-gray-900/50 border border-gray-200/50 dark:border-gray-700/50 rounded-xl p-4 sm:p-6 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1 group-hover:border-blue-400 dark:group-hover:border-blue-500 overflow-hidden">
                    {/* Animated gradient border */}
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    {/* Glowing effect */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="relative z-10">
                      {/* Sheet name with truncation */}
                      <div className="mb-4">
                        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide truncate group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-300">
                          {sheet.name}
                        </p>
                        <div className="w-8 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 group-hover:w-full" />
                      </div>

                      {/* Solved count - Fixed: Direct value */}
                      <p className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300 inline-block">
                        {sheet.solved}
                      </p>

                      {/* Progress bar */}
                      <div className="mt-4">
                        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                          <span>Progress</span>
                          <span>{sheet.solved}</span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-300 ease-out"
                            style={{ width: `${Math.min(100, (sheet.solved / 50) * 100)}%` }}
                          />
                        </div>
                      </div>

                      {/* CTA */}
                      <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <span>View Sheet</span>
                        <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-full text-center py-12 animate-fadeIn">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                  <span className="text-3xl">📝</span>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-2">No progress yet</p>
                <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">Start solving problems to see your stats!</p>
                <Link
                  to="/sheet/striver"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300"
                >
                  <span>Start Practicing</span>
                  <span>→</span>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Call to Action */}
        <div className="relative group animate-fadeIn" style={{ animationDelay: '800ms' }}>
          {/* Glow effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/40 via-purple-600/40 to-pink-600/40 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-600 rounded-3xl p-8 sm:p-12 text-white overflow-hidden">
            {/* Animated background */}
            <div className="absolute inset-0">
              <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/10 rounded-full translate-x-1/2 translate-y-1/2" />
            </div>

            <div className="relative z-10 text-center">
              <div className="mb-6">
                <span className="text-5xl inline-block">💪</span>
                <h3 className="text-2xl sm:text-3xl font-bold mt-4 mb-3">
                  Keep Grinding!
                </h3>
                <p className="text-blue-100/80 max-w-2xl mx-auto">
                  Every problem solved brings you closer to mastering DSA. Your journey is unique—celebrate every small win!
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/sheet/striver"
                  className="group/btn inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-blue-600 hover:text-blue-700 font-bold rounded-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 active:scale-95"
                >
                  <span>Start Practicing</span>
                  <span className="transition-transform group-hover/btn:translate-x-1">→</span>
                </Link>
                <Link
                  to="/sheets"
                  className="group/btn inline-flex items-center justify-center gap-2 px-6 py-3 bg-transparent border-2 border-white/30 hover:border-white text-white font-bold rounded-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 active:scale-95"
                >
                  <span>Explore Sheets</span>
                  <span className="transition-transform group-hover/btn:translate-x-1">↗</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(3deg); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(-3deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 10s ease-in-out infinite;
          animation-delay: 1s;
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out forwards;
          opacity: 0;
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </div>
  );
};

export default DashboardPage;