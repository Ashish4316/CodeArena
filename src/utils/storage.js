export const getProgress = () => {
  return JSON.parse(localStorage.getItem("progress")) || {};
};

export const saveProgress = (progress) => {
  localStorage.setItem("progress", JSON.stringify(progress));
};
