import React, { useState, useEffect, useRef } from "react";
import { getProgress, saveProgress } from "../utils/storage";
import { incrementDailyProgress, decrementDailyProgress, calcStreak, getDailyProgress } from "../utils/dailyProgress";
import { getNote, saveNote } from "../utils/notes";
import { addXP, checkNewBadges, XP_VALUES } from "../utils/gamification";
import gsap from "gsap";

const getCurrentSheetKey = () => {
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
  const [showNotes, setShowNotes] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [savedNote, setSavedNote] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const isSolved = !!progressState[question.id];
  const cardRef = useRef(null);
  const checkRef = useRef(null);
  const textareaRef = useRef(null);

  // Load note on mount
  useEffect(() => {
    const note = getNote(question.id);
    setNoteText(note);
    setSavedNote(note);
  }, [question.id]);

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

  // Auto-focus textarea when notes open
  useEffect(() => {
    if (showNotes && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [showNotes]);

  const toggleSolved = () => {
    const updated = {
      ...getProgress(sheetKey),
      [question.id]: !isSolved,
    };
    saveProgress(sheetKey, updated);
    if (!isSolved) {
      incrementDailyProgress();

      // Add XP
      const difficulty = (question.difficulty || "medium").toLowerCase();
      const xpAmount = XP_VALUES[difficulty] || 10;
      const { addedXP, newLevel, levelUp } = addXP(xpAmount);

      // Check for badges
      const daily = getDailyProgress();
      const streak = calcStreak(daily);
      const newBadges = checkNewBadges(streak);

      // Dispatch custom event for toast notification
      window.dispatchEvent(new CustomEvent("xpGained", {
        detail: { xp: addedXP, levelUp, newLevel, badges: newBadges }
      }));

    } else {
      // user unmarked a solved question -> decrement today's count
      decrementDailyProgress();
    }
    window.dispatchEvent(new Event("progressUpdated"));
  };

  const handleSaveNote = () => {
    setIsSaving(true);
    saveNote(question.id, noteText);
    setSavedNote(noteText);
    setTimeout(() => setIsSaving(false), 500);
  };

  const hasUnsavedChanges = noteText !== savedNote;

  const difficultyColor = {
    Easy: "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20",
    Medium: "text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20",
    Hard: "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20",
  }[question.difficulty] || "text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/20";

  return (
    <div ref={cardRef} className="group bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl overflow-hidden mb-3 hover:shadow-md dark:hover:shadow-lg transition-all duration-200 hover:border-blue-300 dark:hover:border-blue-500">
      {/* Main content */}
      <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between">
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

            {/* Note indicator */}
            {savedNote && !showNotes && (
              <span className="text-xs text-purple-600 dark:text-purple-400 font-medium flex items-center gap-1">
                📝 Has Notes
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

        {/* Right: Actions */}
        <div className="flex items-center gap-2 mt-2 sm:mt-0">
          {/* Notes toggle button */}
          <button
            onClick={() => setShowNotes(!showNotes)}
            className={`p-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 active:scale-95 text-sm ${showNotes
              ? "bg-purple-500 text-white shadow-md"
              : savedNote
                ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
                : "bg-gray-100 text-gray-600 dark:bg-slate-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/20"
              }`}
            title={showNotes ? "Close notes" : "Add/view notes"}
          >
            📝
          </button>

          {/* Solved button */}
          <button
            onClick={toggleSolved}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 active:scale-95 whitespace-nowrap text-sm ${isSolved
              ? "bg-green-500 hover:bg-green-600 text-white shadow-md dark:bg-green-600 dark:hover:bg-green-700"
              : "bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-gray-100"
              }`}
          >
            {isSolved ? "✓ Solved" : "Mark Solved"}
          </button>
        </div>
      </div>

      {/* Notes section - expandable */}
      <div className={`overflow-hidden transition-all duration-300 ease-out ${showNotes ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-4 pb-4 pt-2 border-t border-gray-100 dark:border-slate-700 bg-gradient-to-b from-purple-50/50 to-white dark:from-purple-900/10 dark:to-slate-800">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-semibold text-purple-700 dark:text-purple-300">📝 Your Notes</span>
            {hasUnsavedChanges && (
              <span className="text-xs text-orange-500 dark:text-orange-400 animate-pulse">• Unsaved changes</span>
            )}
          </div>

          <textarea
            ref={textareaRef}
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="Add your notes, approach, key insights, or reminders here..."
            className="w-full h-24 p-3 text-sm bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg resize-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-gray-100"
          />

          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-gray-400 dark:text-gray-500">
              {noteText.length > 0 ? `${noteText.length} characters` : "No notes yet"}
            </span>

            <div className="flex gap-2">
              {noteText && (
                <button
                  onClick={() => {
                    setNoteText("");
                    saveNote(question.id, "");
                    setSavedNote("");
                  }}
                  className="px-3 py-1.5 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  Clear
                </button>
              )}

              <button
                onClick={handleSaveNote}
                disabled={!hasUnsavedChanges || isSaving}
                className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 ${hasUnsavedChanges && !isSaving
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md hover:shadow-lg hover:scale-105"
                  : "bg-gray-100 dark:bg-slate-700 text-gray-400 cursor-not-allowed"
                  }`}
              >
                {isSaving ? "✓ Saved!" : "Save Note"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
