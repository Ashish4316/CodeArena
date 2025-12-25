import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { striverSheet } from "../data/striverSheet";
import { striverA2ZSheet } from "../data/striverA2ZSheet";
import { loveBabberSheet } from "../data/loveBabberSheet";
import { leaderboard } from "../data/leaderboard";
import QuestionCard from "../components/QuestionCard";
import StreakCalendar from "../components/StreakCalendar";
import LoadingSpinner from "../components/LoadingSpinner";
import { getProgress } from "../utils/storage";
import { exportCSV } from "../utils/exportProgress";
import { getCustomSheet } from "../utils/customSheets";

/* ===== ANIMATED COUNTER COMPONENT ===== */
/* ===== ANIMATED COUNTER COMPONENT ===== */
const AnimatedCounter = ({ value, duration = 1000 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    const increment = Math.max(1, Math.ceil(end / (duration / 16.67))); // 60fps

    if (start === end) {
      setCount(end);
      return;
    }

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16.67); // 60fps

    return () => clearInterval(timer);
  }, [value, duration]);

  return <span>{count}</span>;
};

/* ===== ANIMATED PROGRESS BAR ===== */
const AnimatedProgressBar = ({ percent, className = "" }) => {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setWidth(percent), 100);
    return () => clearTimeout(timer);
  }, [percent]);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div
        className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full transition-all duration-1000 ease-out relative"
        style={{ width: `${width}%` }}
      >
        {/* Shimmer effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-shimmer" />
      </div>
    </div>
  );
};

/* ===== TOPIC GROUP WITH ANIMATIONS ===== */
const TopicGroup = ({ topic, visibleQuestions, progress, index }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  const total = topic.questions.length;
  const solved = topic.questions.reduce((acc, q) => acc + (progress[q.id] ? 1 : 0), 0);
  const progressPercent = total > 0 ? Math.round((solved / total) * 100) : 0;

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), index * 80);
    return () => clearTimeout(timer);
  }, [index]);

  if (visibleQuestions.length === 0) return null;

  return (
    <div
      ref={ref}
      className={`group/card relative bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/50 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/10 hover:-translate-y-1 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      style={{ transitionDelay: `${index * 50}ms` }}
    >
      {/* Gradient border effect on hover */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-full flex items-center justify-between p-5 text-left hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 dark:hover:from-blue-900/20 dark:hover:to-purple-900/20 transition-all duration-300"
      >
        <div className="flex items-center gap-4 flex-1">
          {/* Topic icon with glow */}
          <div className="relative">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover/card:scale-110 group-hover/card:rotate-3 transition-all duration-300">
              {topic.topic.charAt(0)}
            </div>
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-400 to-purple-500 blur-xl opacity-0 group-hover/card:opacity-50 transition-opacity duration-300" />
          </div>

          <div className="flex flex-col flex-1 min-w-0">
            <span className="text-lg font-bold text-gray-900 dark:text-white group-hover/card:text-transparent group-hover/card:bg-gradient-to-r group-hover/card:from-blue-600 group-hover/card:to-purple-600 group-hover/card:bg-clip-text transition-all duration-300 truncate">
              {topic.topic}
            </span>
            <div className="flex items-center gap-3 mt-2">
              <div className="flex-1 max-w-[180px] h-2 bg-gray-200/80 dark:bg-gray-700/80 rounded-full overflow-hidden shadow-inner">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full transition-all duration-700 ease-out relative overflow-hidden"
                  style={{ width: `${progressPercent}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
                </div>
              </div>
              <span className="text-sm font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {solved}/{total}
              </span>
            </div>
          </div>
        </div>

        {/* Animated chevron */}
        <div className={`ml-4 w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center transition-all duration-300 group-hover/card:bg-gradient-to-r group-hover/card:from-blue-500 group-hover/card:to-purple-500 ${isOpen ? 'rotate-180' : ''}`}>
          <svg className={`w-4 h-4 transition-colors ${isOpen ? 'text-white' : 'text-gray-500 group-hover/card:text-white'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Expandable content with animation */}
      <div className={`overflow-hidden transition-all duration-500 ease-out ${isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="border-t border-gray-200/50 dark:border-gray-700/50 p-4 space-y-2 bg-gradient-to-b from-gray-50/50 to-white/50 dark:from-gray-800/30 dark:to-gray-900/30">
          {visibleQuestions.map((q, qIdx) => (
            <div
              key={q.id}
              className="animate-fadeSlideIn"
              style={{ animationDelay: `${qIdx * 30}ms` }}
            >
              <QuestionCard question={q} compact={true} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ===== MAIN SHEET COMPONENT ===== */
const Sheet = () => {
  const { sheetName = "" } = useParams();
  const key = sheetName.replace(/-/g, "").toLowerCase();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    document.body.dataset.sheetKey = key;

    // Show loading spinner for smooth transition
    setIsInitialLoading(true);
    const loadTimer = setTimeout(() => {
      setIsLoaded(true);
      setIsInitialLoading(false);
    }, 800);

    return () => {
      delete document.body.dataset.sheetKey;
      clearTimeout(loadTimer);
    };
  }, [key]);

  /* choose sheet data */
  let data = striverSheet;
  let customSheetData = null;

  if (key.includes("babbar")) data = loveBabberSheet;
  else if (key.includes("a2z")) data = striverA2ZSheet;
  else if (key.startsWith("custom")) {
    const found = getCustomSheet(sheetName);
    if (found) {
      customSheetData = found;
      data = found.data;
    }
  }

  /* progress + filters */
  const [progress, setProgress] = useState({});
  const [search, setSearch] = useState("");
  const [showSolved, setShowSolved] = useState("all");

  useEffect(() => {
    const load = () => setProgress(getProgress(key));
    load();
    window.addEventListener("progressUpdated", load);
    window.addEventListener("storage", load);
    return () => {
      window.removeEventListener("progressUpdated", load);
      window.removeEventListener("storage", load);
    };
  }, [key]);

  const allQuestions = data.flatMap((t) => t.questions);
  const solvedCount = Object.values(progress).filter(Boolean).length;
  const percent = allQuestions.length === 0 ? 0 : Math.round((solvedCount / allQuestions.length) * 100);

  const isVisible = (q) => {
    const title = (q.title || "").toString();
    if (!title.toLowerCase().includes(search.toLowerCase())) return false;
    if (showSolved === "solved") return progress[q.id];
    if (showSolved === "unsolved") return !progress[q.id];
    return true;
  };

  // Check if topic name matches search
  const isTopicMatch = (topic) => {
    if (!search) return false;
    return topic.topic.toLowerCase().includes(search.toLowerCase());
  };

  // Get visible questions for a topic - if topic matches search, show all its questions
  const getVisibleQuestions = (topic) => {
    if (isTopicMatch(topic)) {
      // Topic name matches - show all questions (still respect solved filter)
      return topic.questions.filter(q => {
        if (showSolved === "solved") return progress[q.id];
        if (showSolved === "unsolved") return !progress[q.id];
        return true;
      });
    }
    // Otherwise filter by question title as usual
    return topic.questions.filter(isVisible);
  };

  // Show loading spinner during initial load
  if (isInitialLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-100 dark:from-gray-950 dark:via-slate-900 dark:to-indigo-950 relative overflow-hidden">
      {/* ===== ANIMATED BACKGROUND ===== */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Gradient orbs */}
        <div className="absolute top-20 -left-32 w-96 h-96 bg-blue-400/20 dark:bg-blue-600/10 rounded-full blur-3xl animate-float" />
        <div className="absolute top-1/3 -right-32 w-[500px] h-[500px] bg-purple-400/20 dark:bg-purple-600/10 rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-pink-400/15 dark:bg-pink-600/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />

        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />

        {/* Floating shapes */}
        <div className="absolute top-1/4 left-1/4 w-20 h-20 border-2 border-blue-200/30 dark:border-blue-800/20 rounded-full animate-float" />
        <div className="absolute top-1/3 right-1/3 w-16 h-16 border-2 border-purple-200/30 dark:border-purple-800/20 rounded-lg rotate-45 animate-float-delayed" />
        <div className="absolute bottom-1/3 right-1/4 w-24 h-24 border-2 border-pink-200/30 dark:border-pink-800/20 rounded-full animate-float" style={{ animationDelay: '1.5s' }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ===== HEADER CARD ===== */}
        <div className={`mb-6 transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'}`}>
          <div className="relative bg-white/60 dark:bg-gray-900/60 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl shadow-purple-500/5 border border-white/30 dark:border-gray-700/30 overflow-hidden">
            {/* Decorative gradient */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

            <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex-1">
                {/* Title with gradient */}
                <div className="flex flex-wrap items-center gap-4 mb-6">
                  <h1 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent capitalize">
                    {sheetName.replace(/-/g, " ")} Sheet
                  </h1>
                  <div className="relative group">
                    <span className="px-4 py-2 rounded-full text-base font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25 group-hover:shadow-xl group-hover:shadow-purple-500/40 transition-all duration-300 group-hover:scale-105 cursor-default">
                      <AnimatedCounter value={solvedCount} /> / {allQuestions.length}
                    </span>
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-300 -z-10" />
                  </div>
                </div>

                {/* Progress section */}
                <div className="flex items-center gap-4">
                  <div className="flex-1 max-w-md h-4 bg-gray-200/80 dark:bg-gray-700/50 rounded-full overflow-hidden shadow-inner backdrop-blur-sm">
                    <AnimatedProgressBar percent={percent} className="h-full" />
                  </div>
                  <span className="text-xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent min-w-[4rem]">
                    {percent}%
                  </span>
                </div>
              </div>

              {/* Export button */}
              <button
                onClick={() => exportCSV(key, progress)}
                className="group relative flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-2xl shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/40 hover:scale-105 active:scale-95 transition-all duration-300 overflow-hidden"
              >
                <span className="relative z-10 text-xl group-hover:animate-bounce">📤</span>
                <span className="relative z-10">Export CSV</span>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
            </div>
          </div>
        </div>

        {/* ===== FILTERS ===== */}
        <div className={`mb-6 transition-all duration-700 delay-100 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'}`}>
          <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-2xl rounded-2xl p-4 shadow-xl border border-white/30 dark:border-gray-700/30 flex flex-col sm:flex-row gap-4">
            {/* Search input */}
            <div className="relative flex-1 group">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg group-focus-within:text-blue-500 transition-colors">🔍</span>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search questions..."
                className="w-full pl-12 pr-4 py-3 bg-gray-100/80 dark:bg-gray-800/80 border-2 border-transparent focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 outline-none transition-all duration-300 hover:bg-gray-50 dark:hover:bg-gray-700/80"
              />
            </div>

            {/* Filter buttons */}
            <div className="flex gap-2">
              {["all", "solved", "unsolved"].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setShowSolved(filter)}
                  className={`relative px-5 py-3 rounded-xl text-sm font-bold transition-all duration-300 overflow-hidden ${showSolved === filter
                    ? "text-white shadow-lg shadow-purple-500/25 scale-105"
                    : "bg-gray-100/80 dark:bg-gray-800/80 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 hover:scale-105"
                    }`}
                >
                  {showSolved === filter && (
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
                  )}
                  <span className="relative z-10">
                    {filter === "all" ? "📋 All" : filter === "solved" ? "✅ Solved" : "⭕ Unsolved"}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ===== MAIN CONTENT ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Questions list */}
          <div className="lg:col-span-2 space-y-4">
            {data.map((topic, idx) => (
              <TopicGroup
                key={topic.id}
                topic={topic}
                index={idx}
                visibleQuestions={getVisibleQuestions(topic)}
                progress={progress}
              />
            ))}
          </div>

          {/* Sidebar */}
          <div className={`space-y-4 lg:sticky lg:top-6 h-fit transition-all duration-700 delay-200 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
            {/* Streak card */}
            <div className="relative bg-white/60 dark:bg-gray-900/60 backdrop-blur-2xl rounded-2xl p-6 shadow-xl border border-white/30 dark:border-gray-700/30 overflow-hidden group hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-500">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700" />
              <h2 className="relative text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                <span className="text-2xl animate-pulse">🔥</span>
                <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">Your Streak</span>
              </h2>
              <StreakCalendar />
            </div>

            {/* Leaderboard card */}
            <div className="relative bg-white/60 dark:bg-gray-900/60 backdrop-blur-2xl rounded-2xl p-6 shadow-xl border border-white/30 dark:border-gray-700/30 overflow-hidden group hover:shadow-2xl hover:shadow-yellow-500/10 transition-all duration-500">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-500/20 to-amber-500/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700" />
              <h2 className="relative text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                <span className="text-2xl">🏆</span>
                <span className="bg-gradient-to-r from-yellow-600 to-amber-600 bg-clip-text text-transparent">Leaderboard</span>
              </h2>
              <div className="space-y-2">
                {leaderboard.slice(0, 5).map((u, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center p-3 rounded-xl hover:bg-gradient-to-r hover:from-gray-100/80 hover:to-gray-50/80 dark:hover:from-gray-800/50 dark:hover:to-gray-700/50 transition-all duration-300 group/item cursor-default"
                    style={{ animationDelay: `${idx * 100}ms` }}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`relative w-8 h-8 flex items-center justify-center rounded-full text-sm font-black shadow-md transition-transform duration-300 group-hover/item:scale-110 ${idx === 0 ? 'bg-gradient-to-br from-yellow-400 to-amber-500 text-yellow-900 shadow-yellow-500/30' :
                        idx === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-400 text-gray-700 shadow-gray-400/30' :
                          idx === 2 ? 'bg-gradient-to-br from-amber-600 to-orange-700 text-white shadow-amber-600/30' :
                            'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                        }`}>
                        {idx + 1}
                      </div>
                      <span className="text-gray-700 dark:text-gray-200 font-semibold group-hover/item:text-blue-600 dark:group-hover/item:text-blue-400 transition-colors">{u.name}</span>
                    </div>
                    <span className="font-black text-lg bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{u.solved}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== CUSTOM ANIMATIONS ===== */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(3deg); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(-3deg); }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 10s ease-in-out infinite;
          animation-delay: 1s;
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        .animate-fadeSlideIn {
          animation: fadeSlideIn 0.4s ease-out forwards;
          opacity: 0;
        }
      `}} />
    </div>
  );
};

export default Sheet;
