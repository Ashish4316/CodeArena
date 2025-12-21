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
import { getCustomSheet } from "../utils/customSheets";

const TopicGroup = ({ topic, visibleQuestions, progress }) => {
  const [isOpen, setIsOpen] = useState(false);

  const total = topic.questions.length;
  const solved = topic.questions.reduce((acc, q) => acc + (progress[q.id] ? 1 : 0), 0);

  if (visibleQuestions.length === 0) return null;

  return (
    <div className="ui-card p-5">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-lg font-bold text-text-primary mb-4 pb-2 border-b border-border text-left hover:text-accent transition-colors group"
      >
        <div className="flex items-center gap-3">
          <span>{topic.topic}</span>
          <span className="text-sm font-medium text-text-secondary bg-bg-tertiary px-2 py-0.5 rounded-full">
            {solved} / {total}
          </span>
        </div>
        <span className={`transform transition-transform duration-200 text-text-secondary group-hover:text-accent ${isOpen ? "rotate-180" : ""}`}>
          ▼
        </span>
      </button>

      {isOpen && (
        <div className="space-y-3 animate-in slide-in-from-top-2 duration-200">
          {visibleQuestions.map((q) => (
            <QuestionCard key={q.id} question={q} compact={true} />
          ))}
        </div>
      )}
    </div>
  );
};

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
  let customSheetData = null;

  if (key.includes("babbar")) data = loveBabberSheet;
  else if (key.includes("a2z")) data = striverA2ZSheet;
  else if (key.startsWith("custom")) {
    // Exact match for custom sheet ID typically
    // The route is /sheet/:sheetName, so whatever passed is the key.
    // In CreateSheet we saved id as "custom-" + timestamp.
    // However, url params are usually url-encoded or passed as string.
    // My previous logic in CreateSheet saved ID as "custom-..."
    // SheetList links to `/sheet/${sheet.id}` which is "custom-..."
    // So `sheetName` will be "custom-..."
    // `key` replace hyphens, so it becomes "custom..." (no hyphen if strict replace, but my replace is global hyphen removal).
    // Wait, `sheetName.replace(/-/g, "")` removes hyphens!
    // So "custom-123" becomes "custom123".
    // But `getCustomSheet` expects the original ID "custom-123".

    // PROBLEM: I am mutating the key too early for ID lookup.
    // I should use `sheetName` directly for ID lookup if possible, or be careful.

    // Let's try to look up with `sheetName` first (which has hyphens). 
    const found = getCustomSheet(sheetName);
    if (found) {
      customSheetData = found;
      data = found.data;
    }
  }

  // If data is still default (striver) but URL allows possibility of custom or others,
  // we might show wrong data if not careful. 
  // But strictly, if it doesn't match babbar/a2z/custom, it falls back to striver.
  // We might want to handle "Sheet Not Found" for unknown keys if not striver default.
  // For now this is acceptable behavior for existing sheets.

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
            {data.map((topic) => (
              <TopicGroup
                key={topic.id}
                topic={topic}
                visibleQuestions={topic.questions.filter(isVisible)}
                progress={progress}
              />
            ))}
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
