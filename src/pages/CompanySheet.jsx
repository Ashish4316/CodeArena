import React from "react";
import { useLocation, Link } from "react-router-dom";
import { companySheet } from "../data/companySheet";
import QuestionCard from "../components/QuestionCard";

const normalize = (s) => s.toString().replace(/[^a-z0-9]/gi, "").toLowerCase();

const CompanySheet = () => {
  const location = useLocation();
  const parts = location.pathname.split("/").filter(Boolean);
  const key = parts[parts.length - 1] || ""; // expected like 'faang'

  const group = companySheet.find(
    (g) => normalize(g.name) === normalize(key) || normalize(g.name) === normalize(key + "sheet")
  );

  if (!group) {
    return (
      <div className="page-wrapper bg-gray-50 dark:bg-slate-900">
        <div className="container-xl container-base mx-auto px-responsive py-8 sm:py-12">
          <h1 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Company sheet not found</h1>
          <p className="mb-4 text-gray-600 dark:text-gray-400">We couldn't find a company sheet for <b>{key}</b>.</p>
          <p className="text-gray-600 dark:text-gray-400">
            Browse available company sheets:
          </p>
          <ul className="mt-2">
            {companySheet.map((g) => (
              <li key={g.name} className="mb-1">
                <Link to={`/company/${g.name.toLowerCase()}`} className="text-blue-600 dark:text-blue-400 hover:underline">{g.name}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper bg-gray-50 dark:bg-slate-900">
      <div className="container-xl container-base mx-auto px-responsive py-8 sm:py-12">
        <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">{group.name} — Company Sheet</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-8">{group.questions.length} questions</p>

        <div className="space-y-4">
          {group.questions.map((q) => (
            <QuestionCard key={q.id} question={q} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CompanySheet;
