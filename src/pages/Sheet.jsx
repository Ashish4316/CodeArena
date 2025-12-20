import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { striverSheet } from "../data/striverSheet";
import { loveBabberSheet } from "../data/loveBabberSheet";
import QuestionCard from "../components/QuestionCard";
import { getProgress } from "../utils/storage";
import {
  getSolvedCount,
  getTotalQuestions,
  getCompletionPercent,
} from "../utils/progressUtils";

const Sheet = () => {
  const { sheetName = "" } = useParams();
  const key = sheetName.replace(/-/g, "").toLowerCase();

  // expose to QuestionCard via body.dataset
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

  // keep progress in state so UI updates when it changes
  // start empty to avoid reading global progress before route param is available
  const [progressState, setProgressState] = useState({});

  // load per-sheet progress after mount / when key changes
  useEffect(() => {
    setProgressState(getProgress(key));
  }, [key]);

  useEffect(() => {
    const handleUpdate = () => setProgressState(getProgress(key));
    window.addEventListener("progressUpdated", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("progressUpdated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, [key]);

  // compute from per-sheet progress
  const total = getTotalQuestions(data);
  const solved = Object.values(progressState).filter(Boolean).length;
  let percent = total === 0 ? 0 : Math.round((solved / total) * 100);
  // clamp to 0-100 to avoid transient >100 values
  percent = Math.max(0, Math.min(100, percent));

  return (
    <div className="p-6">
      {/* Progress Bar */}
      <div className="mb-6">
        <p className="font-medium mb-1">
          Solved {solved} / {total} questions
        </p>
        <div className="w-full bg-gray-200 h-3 rounded">
          <div
            className="bg-green-500 h-3 rounded transition-all"
            style={{ width: `${percent}%` }}
          />
        </div>
        <p className="text-sm text-gray-500 mt-1">{percent}% completed</p>
      </div>

      <h1 className="text-2xl font-bold mb-4">
        {sheetName.toUpperCase()} DSA Sheet
      </h1>

      {data.map((topic) => (
        <div key={topic.id} className="mb-6">
          <h2 className="text-xl font-semibold mb-2">{topic.topic}</h2>
          {topic.questions.map((q) => (
            <QuestionCard key={q.id} question={q} />
          ))}
        </div>
      ))}
    </div>
  );
};

export default Sheet;
