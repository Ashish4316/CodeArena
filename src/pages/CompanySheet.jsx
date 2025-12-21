import { faangSheet } from "../data/fangSheet";
import QuestionCard from "../components/QuestionCard";

const CompanySheet = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">🏢 FAANG Sheet</h1>

      {faangSheet.map((topic) => (
        <div key={topic.id} className="mb-6">
          <h2 className="font-semibold">{topic.topic}</h2>
          {topic.questions.map((q) => (
            <QuestionCard key={q.id} question={q} />
          ))}
        </div>
      ))}
    </div>
  );
};

export default CompanySheet;
