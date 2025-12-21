import React, { useState, useEffect, useRef } from "react";
import { getProgress, saveProgress } from "../utils/storage";
import { incrementDailyProgress } from "../utils/dailyProgress";
import gsap from "gsap";

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
  const cardRef = useRef(null);
  const checkRef = useRef(null);

  useEffect(() => {
    const handleUpdate = () => setProgressState(getProgress(sheetKey));
    window.addEventListener("storage", handleUpdate);
    window.addEventListener("progressUpdated", handleUpdate);
    return () => {
      window.removeEventListener("storage", handleUpdate);
      window.removeEventListener("progressUpdated", handleUpdate);
    };
  }, [sheetKey]);

  useEffect(() => {
    if (!cardRef.current) return;
    const el = cardRef.current;
    const tl = gsap.timeline({ paused: true });
    tl.to(el, { y: -6, boxShadow: "0 18px 40px rgba(59,130,246,0.08)", duration: 0.24 });
    const enter = () => tl.play();
    const leave = () => tl.reverse();
    el.addEventListener("mouseenter", enter);
    el.addEventListener("mouseleave", leave);
    return () => {
      el.removeEventListener("mouseenter", enter);
      el.removeEventListener("mouseleave", leave);
      tl.kill();
    };
  }, []);

  useEffect(() => {
    if (!checkRef.current) return;
    if (isSolved) {
      gsap.fromTo(checkRef.current, { scale: 0 }, { scale: 1.05, duration: 0.35, ease: 'bounce.out' });
      const settle = gsap.to(checkRef.current, { scale: 1, duration: 0.18 });
      return () => { settle.kill(); };
    }
  }, [isSolved]);

  const toggleSolved = () => {
    const updated = {
      ...getProgress(sheetKey),
      [question.id]: !isSolved,
    };

    saveProgress(sheetKey, updated);

    if (!isSolved) {
      incrementDailyProgress();
    }

    window.dispatchEvent(new Event("progressUpdated"));
  };

  const difficultyColor = {
    Easy: "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20",
    Medium: "text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20",
    Hard: "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20",
  }[question.difficulty] || "text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/20";

  return (
    <div ref={cardRef} className="group bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-4 mb-3 flex flex-col sm:flex-row sm:items-center justify-between hover:shadow-md dark:hover:shadow-lg transition-all duration-200 hover:border-blue-300 dark:hover:border-blue-500">

      {/* Left: Title & Meta */}
      <div className="flex-1 mb-3 sm:mb-0">
        <h3 className="font-semibold text-gray-900 dark:text-gray-50 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
          {question.title}
        </h3>

        <div className="flex items-center gap-3 mt-2 flex-wrap">
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${difficultyColor}`}>
            {question.difficulty ?? "Unknown"}
          </span>

          {isSolved && (
            <span ref={checkRef} className="text-xs text-green-600 dark:text-green-400 font-medium flex items-center gap-1">
              ✓ Solved
            </span>
          )}

          {/* External Links */}
          <div className="flex items-center gap-2 ml-2 border-l border-gray-200 dark:border-slate-700 pl-3">
            {question.leetcodeLink && (
              <a
                href={question.leetcodeLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 px-2 py-0.5 rounded bg-gray-100 dark:bg-slate-700 hover:bg-orange-50 dark:hover:bg-orange-900/20 text-xs font-medium text-gray-600 dark:text-gray-300 hover:text-orange-500 transition-colors"
                title="Solve on LeetCode"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.173 5.798a1.375 1.375 0 0 0-.013 1.948l.893.893a1.372 1.372 0 0 0 1.961-.006l4.825-4.872c.268-.27.42-.637.425-1.022V.405a.452.452 0 0 0-.817-.46l-1.92 1.52c-.08.062-.176.096-.276.096h-.58a1.374 1.374 0 0 0-.012-2.067L13.483 0zm-2.43 7.828a.514.514 0 0 0-.27.388l-.552 2.65a.514.514 0 0 0 .193.528l2.296 1.488a.514.514 0 0 0 .684-.094l.872-1.096a.514.514 0 0 0 .044-.543l-1.03-2.185a.514.514 0 0 0-.583-.263l-1.654.127zm8.448-1.782l-3.376 2.025a1.374 1.374 0 0 0-.518 1.838l1.792 3.056a1.374 1.374 0 0 0 1.84.524l3.35-2.035a1.374 1.374 0 0 0 .5-1.854l-1.76-3.036a1.374 1.374 0 0 0-1.828-.518zm-14.7.702L1.87 9.176a1.374 1.374 0 0 0 .138 2.067l3.961 3.125a1.374 1.374 0 0 0 1.956-.308l2.91-4.01a1.374 1.374 0 0 0-.154-2.043l-3.95-3.14a1.374 1.374 0 0 0-1.93.31l-.29.412a1.374 1.374 0 0 0 .288 1.97v-.004zM5.996 16.5c-1.39 0-2.52 1.13-2.52 2.52s1.13 2.52 2.52 2.52 2.52-1.13 2.52-2.52-1.13-2.52-2.52-2.52zm11.233-1.638l-1.446 1.15a.514.514 0 0 0-.12.684l.848 1.34a.514.514 0 0 0 .708.156l1.455-1.16a.514.514 0 0 0 .12-.686l-.857-1.332a.514.514 0 0 0-.708-.152z" /></svg>
                LeetCode
              </a>
            )}

            {question.gfgLink && (
              <a
                href={question.gfgLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 px-2 py-0.5 rounded bg-gray-100 dark:bg-slate-700 hover:bg-green-50 dark:hover:bg-green-900/20 text-xs font-medium text-gray-600 dark:text-gray-300 hover:text-green-600 transition-colors"
                title="Solve on GeeksforGeeks"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" /></svg>
                GFG
              </a>
            )}

            {question.youtubeLink && (
              <a
                href={question.youtubeLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 px-2 py-0.5 rounded bg-gray-100 dark:bg-slate-700 hover:bg-red-50 dark:hover:bg-red-900/20 text-xs font-medium text-gray-600 dark:text-gray-300 hover:text-red-500 transition-colors"
                title="Watch Solution"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
                Watch
              </a>
            )}
          </div>

        </div>
      </div>

      {/* Right: Action */}
      <button
        onClick={toggleSolved}
        className={`w-full sm:w-auto mt-2 sm:mt-0 px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 active:scale-95 whitespace-nowrap text-sm ${isSolved
          ? "bg-green-500 hover:bg-green-600 text-white shadow-md dark:bg-green-600 dark:hover:bg-green-700"
          : "bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-gray-100"
          }`}
      >
        {isSolved ? "✓ Solved" : "Mark Solved"}
      </button>
    </div>
  );
};

export default QuestionCard;
