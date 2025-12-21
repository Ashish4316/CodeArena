import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { striverSheet } from "../data/striverSheet";
import { loveBabberSheet } from "../data/loveBabberSheet";
import QuestionCard from "../components/QuestionCard";
import { getProgress } from "../utils/storage";
import { getTotalQuestions } from "../utils/progressUtils";

const Sheet = () => {
  const { sheetName = "" } = useParams();
  const sheetKey = sheetName.replace(/-/g, "").toLowerCase();

  // expose sheetKey for QuestionCard
  useEffect(() => {
    document.body.dataset.sheetKey = sheetKey;
    return () => delete document.body.dataset.sheetKey;
  }, [sheetKey]);

  const data =
    sheetKey === "striver"
      ? striverSheet
      : sheetKey === "lovebabbar"
      ? loveBabberSheet
      : [];

  const [progress, setProgress] = useState({});
  const [search, setSearch] = useState("");
  const [showSolved, setShowSolved] = useState("all"); // all | solved | unsolved

  useEffect(() => {
    setProgress(getProgress(sheetKey));
  }, [sheetKey]);

  useEffect(() => {
    const update = () => setProgress(getProgress(sheetKey));
    window.addEventListener("progressUpdated", update);
    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener("progressUpdated", update);
      window.removeEventListener("storage", update);
    };
  }, [sheetKey]);

  const total = getTotalQuestions(data);
  const solved = Object.values(progress).filter(Boolean).length;
  const percent = total === 0 ? 0 : Math.round((solved / total) * 100);

  return (
    <div className="p-6">
      {/* Progress */}
      <div className="mb-6">
        <p className="font-medium">
          Solved {solved} / {total}
        </p>
        <div className="w-full bg-gray-200 h-3 rounded">
          <div
            className="bg-green-500 h-3 rounded"
            style={{ width: `${percent}%` }}
          />
        </div>
        <p className="text-sm text-gray-500">{percent}% completed</p>
      </div>

      {/* Search + Filter */}
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
          <option value="all">All Questions</option>
          <option value="solved">Solved</option>
          <option value="unsolved">Unsolved</option>
        </select>
      </div>

      <h1 className="text-2xl font-bold mb-4">
        {sheetName.toUpperCase()} DSA Sheet
      </h1>

      {/* Questions */}
      {data.map((topic) => {
        const filteredQuestions = topic.questions.filter((q) => {
          const matchesSearch = q.title
            .toLowerCase()
            .includes(search.toLowerCase());

          const isSolved = !!progress[q.id];

          const matchesStatus =
            showSolved === "all" ||
            (showSolved === "solved" && isSolved) ||
            (showSolved === "unsolved" && !isSolved);

          return matchesSearch && matchesStatus;
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
