export const getProgress = (sheetKey) => {
  const all = JSON.parse(localStorage.getItem("progress")) || {};
  if (!sheetKey) return all;
  return all[sheetKey] || {};
};

export const saveProgress = (sheetKey, sheetProgress) => {
  if (!sheetKey) {
    // overwrite whole progress object
    localStorage.setItem("progress", JSON.stringify(sheetProgress || {}));
    return;
  }
  const all = JSON.parse(localStorage.getItem("progress")) || {};
  all[sheetKey] = sheetProgress || {};
  localStorage.setItem("progress", JSON.stringify(all));
};

export const getAllProgress = () => {
  return JSON.parse(localStorage.getItem("progress")) || {};
};

export const getDailyStats = () => {
  const all = getAllProgress();
  let totalSolved = 0;
  Object.values(all).forEach((sheetObj) => {
    totalSolved += Object.values(sheetObj || {}).filter(Boolean).length;
  });

  const daily = JSON.parse(localStorage.getItem("dailyProgress") || "{}");

  return {
    totalSolved,
    daily,
  };
};
