import { getProgress } from "./storage";

export const getTotalQuestions = (sheet) => {
  return sheet.reduce((acc, topic) => acc + topic.questions.length, 0);
};

export const getSolvedCount = (sheet, sheetKey) => {
  const progress = getProgress(sheetKey);
  let solved = 0;

  sheet.forEach((topic) => {
    topic.questions.forEach((q) => {
      if (progress[q.id]) solved++;
    });
  });

  return solved;
};

export const getCompletionPercent = (sheet, sheetKey) => {
  const total = getTotalQuestions(sheet);
  const solved = getSolvedCount(sheet, sheetKey);
  return total === 0 ? 0 : Math.round((solved / total) * 100);
};
