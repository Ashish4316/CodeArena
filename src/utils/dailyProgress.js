export const getTodayKey = () => {
  return new Date().toISOString().split("T")[0];
};

export const getDailyProgress = () => {
  return JSON.parse(localStorage.getItem("dailyProgress") || "{}");
};

export const incrementDailyProgress = () => {
  const today = getTodayKey();
  const data = getDailyProgress();

  data[today] = (data[today] || 0) + 1;
  localStorage.setItem("dailyProgress", JSON.stringify(data));
};
