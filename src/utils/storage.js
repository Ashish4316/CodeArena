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
