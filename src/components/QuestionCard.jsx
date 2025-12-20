import { getProgress, saveProgress } from "../utils/storage";

const QuestionCard = ({ question }) => {
  const progress = getProgress();
  const isSolved = progress[question.id];

  const toggleSolved = () => {
    const updated = {
      ...progress,
      [question.id]: !isSolved,
    };
    saveProgress(updated);
    window.location.reload(); // simple & safe
  };

  return (
    <div className="border p-4 rounded mb-3 flex justify-between items-center">
      <div>
        <h3 className="font-semibold">{question.title}</h3>
        <p className="text-sm text-gray-500">
          Difficulty: {question.difficulty}
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
