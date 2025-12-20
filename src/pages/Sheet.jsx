import { striverSheet } from "../data/striverSheet";

const Sheet = () => {
  return (
    <div>
      <h1>Striver DSA Sheet</h1>

      {striverSheet.map((section) => (
        <div key={section.id}>
          <h2>{section.topic}</h2>

          <ul>
            {section.questions.map((q) => (
              <li key={q.id}>
                {q.title} ❌
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default Sheet;

