import React, { useState, useEffect } from "react";
import { getProgress, saveProgress } from "../utils/storage";

const QuestionCard = ({ question }) => {
  if (!question) return null;

  const [progressState, setProgressState] = useState(getProgress());
  const isSolved = !!progressState[question.id];

  useEffect(() => {
    const handleUpdate = () => setProgressState(getProgress());
    window.addEventListener("storage", handleUpdate);
    window.addEventListener("progressUpdated", handleUpdate);
    return () => {
      window.removeEventListener("storage", handleUpdate);
      window.removeEventListener("progressUpdated", handleUpdate);
    };
  }, []);

  const toggleSolved = () => {
    const updated = {
      ...getProgress(),
      [question.id]: !isSolved,
    };
    saveProgress(updated);
    // notify other components in this window
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
