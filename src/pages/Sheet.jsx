import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { striverSheet } from "../data/striverSheet";
import { striverA2ZSheet } from "../data/striverA2ZSheet";
import { loveBabberSheet } from "../data/loveBabberSheet";
// import { companySheet } from "../data/companySheet"; // Not used here directly yet
import { leaderboard } from "../data/leaderboard";
import QuestionCard from "../components/QuestionCard";
import StreakCalendar from "../components/StreakCalendar";
import { getProgress } from "../utils/storage";
import { exportCSV } from "../utils/exportProgress";

const Sheet = () => {
  const { sheetName = "" } = useParams();
  const key = sheetName.replace(/-/g, "").toLowerCase();

  /* expose sheet key globally for QuestionCard */
  useEffect(() => {
    document.body.dataset.sheetKey = key;
    return () => delete document.body.dataset.sheetKey;
  }, [key]);

  /* choose sheet data */
  let data = striverSheet;
  if (key.includes("babbar")) data = loveBabberSheet;
  else if (key.includes("a2z")) data = striverA2ZSheet;

  /* progress + filters */
  const [progress, setProgress] = useState({});
  const [search, setSearch] = useState("");
  const [showSolved, setShowSolved] = useState("all"); // all | solved | unsolved

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

  /* progress calculations */
  const allQuestions = data.flatMap((t) => t.questions);
  const solvedCount = Object.values(progress).filter(Boolean).length;
  const percent = allQuestions.length === 0 ? 0 : Math.round((solvedCount / allQuestions.length) * 100);

  /* filter logic */
  const isVisible = (q) => {
    const title = (q.title || "").toString();
    if (!title.toLowerCase().includes(search.toLowerCase())) return false;
    if (showSolved === "solved") return progress[q.id];
    if (showSolved === "unsolved") return !progress[q.id];
    return true;
  };

  return (
    <div className="bg-bg-secondary min-h-[calc(100vh-3.5rem)] py-8">
      <div className="container-tight">

        {/* ================= HEADER ================= */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-text-primary capitalize">
                  {sheetName.replace(/-/g, " ")} Sheet
                </h1>
                <span className="px-2 py-0.5 rounded text-xs font-semibold bg-accent-subtle text-accent border border-blue-100">
                  {solvedCount} / {allQuestions.length}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full md:w-64 h-2 bg-border rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent transition-all duration-500 ease-out"
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>

            <button
              onClick={() => exportCSV(key, progress)}
              className="btn btn-secondary text-xs"
            >
              <span>📤</span> Export CSV
            </button>
          </div>

          {/* ================= FILTERS ================= */}
          <div className="ui-card p-3 flex flex-col sm:flex-row gap-3">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search questions..."
              className="flex-1 px-3 py-2 bg-bg-tertiary border border-transparent focus:border-accent rounded-md text-sm outline-none transition-all"
            />
            <div className="flex gap-2">
              {["all", "solved", "unsolved"].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setShowSolved(filter)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${showSolved === filter
                    ? "bg-accent text-white"
                    : "bg-bg-tertiary text-text-secondary hover:text-text-primary"
                    }`}
                >
                  {filter === "all" ? "All" : filter === "solved" ? "Solved" : "Unsolved"}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ================= QUESTIONS LIST ================= */}
          <div className="lg:col-span-2 space-y-6">
            {data.map((topic) => {
              const visibleQuestions = topic.questions.filter(isVisible);
              if (visibleQuestions.length === 0) return null;

              return (
                <div key={topic.id} className="ui-card p-5">
                  <h2 className="text-lg font-bold text-text-primary mb-4 pb-2 border-b border-border">
                    {topic.topic}
                  </h2>
                  <div className="space-y-3">
                    {visibleQuestions.map((q) => (
                      <QuestionCard key={q.id} question={q} compact={true} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* ================= SIDEBAR ================= */}
          <div className="space-y-6 h-fit">

            {/* Streak */}
            <div className="ui-card p-5">
              <h2 className="text-sm font-bold text-text-primary mb-4 flex items-center gap-2">
                <span>🔥</span> Streak
              </h2>
              <StreakCalendar />
            </div>

            {/* Leaderboard */}
            <div className="ui-card p-5">
              <h2 className="text-sm font-bold text-text-primary mb-4 flex items-center gap-2">
                <span>🏆</span> Leaderboard
              </h2>
              <div className="space-y-3">
                {leaderboard.slice(0, 5).map((u, idx) => (
                  <div key={idx} className="flex justify-between items-center text-sm">
                    <span className="text-text-secondary">#{idx + 1} {u.name}</span>
                    <span className="font-semibold text-accent">{u.solved}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default Sheet;
