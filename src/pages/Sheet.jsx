import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { striverSheet } from "../data/striverSheet";
import { loveBabberSheet } from "../data/loveBabberSheet";
import QuestionCard from "../components/QuestionCard";
import { getProgress } from "../utils/storage";

const Sheet = () => {
  const { sheetName = "" } = useParams();
  const key = sheetName.replace(/-/g, "").toLowerCase();

  // expose sheet key globally
  useEffect(() => {
    document.body.dataset.sheetKey = key;
    return () => delete document.body.dataset.sheetKey;
  }, [key]);

  const data =
    key === "striver"
      ? striverSheet
      : key === "lovebabbar"
      ? loveBabberSheet
      : [];

  const [progress, setProgress] = useState({});
  const [search, setSearch] = useState("");
  const [showSolved, setShowSolved] = useState("all"); // all | solved | unsolved

  useEffect(() => {
    setProgress(getProgress(key));
    const h = () => setProgress(getProgress(key));
    window.addEventListener("progressUpdated", h);
    window.addEventListener("storage", h);
    return () => {
      window.removeEventListener("progressUpdated", h);
      window.removeEventListener("storage", h);
    };
  }, [key]);

  const allQuestions = data.flatMap((t) => t.questions);
  const solvedCount = Object.values(progress).filter(Boolean).length;
  const percent =
    allQuestions.length === 0
      ? 0
      : Math.round((solvedCount / allQuestions.length) * 100);

  const badge =
    percent === 100 ? "🔥 Completed" : percent >= 75 ? "🚀 Almost" : "📘 In Progress";

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">
          {sheetName.toUpperCase()} DSA Sheet
        </h1>
        <p className="text-sm text-gray-600">
          {solvedCount}/{allQuestions.length} solved • {percent}% • {badge}
        </p>

        <div className="w-full bg-gray-200 h-3 rounded mt-2">
          <div
            className="bg-green-500 h-3 rounded"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search question..."
          className="border p-2 rounded w-full md:w-1/2"
        />

        <select
          value={showSolved}
          onChange={(e) => setShowSolved(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="all">All</option>
          <option value="solved">Solved</option>
          <option value="unsolved">Unsolved</option>
        </select>
      </div>

      {/* Questions */}
      {data.map((topic) => (
        <div key={topic.id} className="mb-6">
          <h2 className="text-xl font-semibold mb-2">{topic.topic}</h2>

          {topic.questions
            .filter((q) =>
              q.title.toLowerCase().includes(search.toLowerCase())
            )
            .filter((q) => {
              if (showSolved === "solved") return progress[q.id];
              if (showSolved === "unsolved") return !progress[q.id];
              return true;
            })
            .map((q) => (
              <QuestionCard key={q.id} question={q} />
            ))}
        </div>
      ))}
    </div>
  );
};

export default Sheet;
