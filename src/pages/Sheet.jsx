import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { striverSheet } from "../data/striverSheet";
import { loveBabberSheet } from "../data/loveBabberSheet";
import QuestionCard from "../components/QuestionCard";
import { getProgress } from "../utils/storage";
import {
  getTotalQuestions,
  getCompletionPercent,
} from "../utils/progressUtils";

const Sheet = () => {
  const { sheetName = "" } = useParams();
  const key = sheetName.replace(/-/g, "").toLowerCase();

  // expose sheet key for QuestionCard
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

  const [progressState, setProgressState] = useState({});

  useEffect(() => {
    setProgressState(getProgress(key));
  }, [key]);

  useEffect(() => {
    const update = () => setProgressState(getProgress(key));
    window.addEventListener("progressUpdated", update);
    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener("progressUpdated", update);
      window.removeEventListener("storage", update);
    };
  }, [key]);

  const total = getTotalQuestions(data);
  const solved = Object.values(progressState).filter(Boolean).length;
  const percent = getCompletionPercent(data, key);

  return (
    <div className="p-6">
      {/* Progress */}
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
