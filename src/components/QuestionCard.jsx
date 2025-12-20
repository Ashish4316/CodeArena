import React, { useState, useEffect } from "react";
import { getProgress, saveProgress } from "../utils/storage";

const getCurrentSheetKey = () => {
  // try dataset on body (set by Sheet) or fallback to pathname
  const ds = document.body.dataset.sheetKey;
  if (ds) return ds;
  const parts = window.location.pathname.split("/").filter(Boolean);
  const last = parts[parts.length - 1] || "";
  return last.replace(/-/g, "").toLowerCase();
};

const QuestionCard = ({ question }) => {
  if (!question) return null;

  const sheetKey = getCurrentSheetKey();
  const [progressState, setProgressState] = useState(() => getProgress(sheetKey));
  const isSolved = !!progressState[question.id];

  useEffect(() => {
    const handleUpdate = () => setProgressState(getProgress(sheetKey));
    window.addEventListener("storage", handleUpdate);
    window.addEventListener("progressUpdated", handleUpdate);
    return () => {
      window.removeEventListener("storage", handleUpdate);
      window.removeEventListener("progressUpdated", handleUpdate);
    };
  }, [sheetKey]);

  const toggleSolved = () => {
    const updated = {
      ...getProgress(sheetKey),
      [question.id]: !isSolved,
    };
    saveProgress(sheetKey, updated);
    window.dispatchEvent(new Event("progressUpdated"));
  };

  return (
    <div className="border p-4 rounded mb-3 flex justify-between items-center">
      <div>
        <h3 className="font-semibold">{question.title}</h3>
        <p className="text-sm text-gray-500">
          Difficulty: {question.difficulty ?? "Unknown"}
        </p>
      </div>

      <button
        onClick={toggleSolved}
        className={`px-3 py-1 rounded ${
          isSolved ? "bg-green-500 text-white" : "bg-gray-300"
        }`}
      >
        {isSolved ? "Solved" : "Mark Solved"}
      </button>
    </div>
  );
};

export default QuestionCard;
