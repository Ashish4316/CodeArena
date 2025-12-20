// src/pages/Sheet.jsx
import { useParams } from "react-router-dom";
import { striverSheet } from "../data/striverSheet";
import { loveBabberSheet } from "../data/loveBabberSheet";
import QuestionCard from "../components/QuestionCard";

const Sheet = () => {
  const params = useParams();

  const rawName = params.sheetName || "";
  const fallbackName =
    typeof window !== "undefined"
      ? window.location.pathname.split("/").pop()
      : "";

  const sheetKey = (rawName || fallbackName || "")
    .toString()
    .replace(/-/g, "")
    .toLowerCase();

  const data =
    sheetKey === "striver"
      ? striverSheet
      : sheetKey === "lovebabbar"
      ? loveBabberSheet
      : [];

  const displayName = rawName || fallbackName || "DSA";

  return (
    <div>
      <h1>{displayName ? displayName.toUpperCase() : "DSA"} DSA Sheet</h1>

      {data.length === 0 ? (
        <p>No sheet found.</p>
      ) : (
        data.map((topic) => (
          <div key={topic.id} style={{ marginBottom: 16 }}>
            <h2>{topic.topic}</h2>
            <ul>
              {topic.questions.map((q) => (
                <QuestionCard key={q.id} question={q} />
                ))}

            </ul>
          </div>
        ))
      )}
    </div>
  );
};

export default Sheet;
