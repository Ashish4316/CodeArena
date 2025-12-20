export const getProgress = () => {
  const data = localStorage.getItem("codearena-progress");
  return data ? JSON.parse(data) : {};
};

export const saveProgress = (progress) => {
  localStorage.setItem(
    "codearena-progress",
    JSON.stringify(progress)
  );
};
