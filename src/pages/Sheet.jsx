import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { striverSheet } from "../data/striverSheet";
import { loveBabberSheet } from "../data/loveBabberSheet";
import QuestionCard from "../components/QuestionCard";
import { getProgress } from "../utils/storage";
import { getTotalQuestions } from "../utils/progressUtils";
import CompletionBadge from "../components/CompletionBadge";
const Sheet = () => {
  const { sheetName = "" } = useParams();
  const key = sheetName.replace(/-/g, "").toLowerCase();

  // expose sheetKey globally (used by QuestionCard)
  useEffect(() => {
    document.body.dataset.sheetKey = key;
    return () => {
      delete document.body.dataset.sheetKey;
    };
  }, [key]);

  const data =
    key === "striver"
      ? striverSheet
      : key === "lovebabbar"
      ? loveBabberSheet
      : [];

  // 🔥 NEW STATES
  const [search, setSearch] = useState("");
  const [showSolved, setShowSolved] = useState("all"); // all | solved | unsolved
  const [progress, setProgress] = useState({});

  useEffect(() => {
    setProgress(getProgress(key));
    const handler = () => setProgress(getProgress(key));
    window.addEventListener("progressUpdated", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("progressUpdated", handler);
      window.removeEventListener("storage", handler);
    };
  }, [key]);

  const total = getTotalQuestions(data);
  const solvedCount = Object.values(progress).filter(Boolean).length;
  const percent =
    total === 0 ? 0 : Math.round((solvedCount / total) * 100);

  return (
    <div className="p-6">
      {/* Progress Bar */}
      <div className="mb-6">
        <p className="font-medium mb-1">
          Solved {solvedCount} / {total}
        </p>
        <div className="w-full bg-gray-200 h-3 rounded">
          <div
            className="bg-green-500 h-3 rounded transition-all"
            style={{ width: `${percent}%` }}
          />
        </div>
        <p className="text-sm text-gray-500">{percent}% completed</p>
      </div>

      <h1 className="text-2xl font-bold mb-4 flex items-center gap-3">
        {sheetName.toUpperCase()} DSA Sheet
        <CompletionBadge percent={percent} />
      </h1>


      {/* 🔥 SEARCH + FILTER UI */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search questions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded w-full md:w-1/2"
        />

        <select
          value={showSolved}
          onChange={(e) => setShowSolved(e.target.value)}
          className="border p-2 rounded w-full md:w-1/4"
        >
          <option value="all">All</option>
          <option value="solved">Solved</option>
          <option value="unsolved">Unsolved</option>
        </select>
      </div>

      {/* QUESTIONS */}
      {data.map((topic) => {
        const filteredQuestions = topic.questions.filter((q) => {
          const matchesSearch = q.title
            .toLowerCase()
            .includes(search.toLowerCase());

          const isSolved = !!progress[q.id];

          if (showSolved === "solved" && !isSolved) return false;
          if (showSolved === "unsolved" && isSolved) return false;

          return matchesSearch;
        });

        if (filteredQuestions.length === 0) return null;

        return (
          <div key={topic.id} className="mb-6">
            <h2 className="text-xl font-semibold mb-2">{topic.topic}</h2>

            {filteredQuestions.map((q) => (
              <QuestionCard key={q.id} question={q} />
            ))}
          </div>
        );
      })}
    </div>
  );
};

export default Sheet;
