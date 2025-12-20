import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { striverSheet } from "../data/striverSheet";
import { loveBabberSheet } from "../data/loveBabberSheet";
import QuestionCard from "../components/QuestionCard";
import { getProgress } from "../utils/storage";

const Sheet = () => {
  const params = useParams();
  const sheetName = params.sheetName || "";

  const key = sheetName ? sheetName.replace(/-/g, "").toLowerCase() : "";

  const data =
    key === "striver"
      ? striverSheet
      : key === "lovebabbar"
      ? loveBabberSheet
      : [];

  // keep progress in state so UI updates when it changes
  const [progressState, setProgressState] = useState(() => getProgress());

  useEffect(() => {
    const handleUpdate = () => setProgressState(getProgress());
    window.addEventListener("progressUpdated", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("progressUpdated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  // debug info
  console.log("Sheet page debug:", { sheetName, key, dataLength: data.length, data });

  const totalQuestions = data.reduce(
    (acc, topic) => acc + (topic.questions ? topic.questions.length : 0),
    0
  );

  const solvedCount = Object.values(progressState).filter(Boolean).length;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">
        {sheetName ? sheetName.toUpperCase() : "DSA"} DSA Sheet
      </h1>

      <p className="mb-4">
        Progress: {solvedCount} / {totalQuestions} solved
      </p>

      {data.length === 0 ? (
        <div>
          <p>No sheet found.</p>
          <pre style={{ whiteSpace: "pre-wrap", background: "#f8f8f8", padding: 8 }}>
            {JSON.stringify({ sheetName, key, totalQuestions }, null, 2)}
          </pre>
        </div>
      ) : (
        data.map((topic) => (
          <div key={topic.id} className="mb-6">
            <h2 className="text-xl font-semibold mb-2">{topic.topic}</h2>

            {topic.questions.map((q) => (
              <QuestionCard key={q.id} question={q} />
            ))}
          </div>
        ))
      )}
    </div>
  );
};

export default Sheet;
