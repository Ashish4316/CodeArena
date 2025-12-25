export const getTodayKey = () => {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

export const getDailyProgress = () => {
  try {
    return JSON.parse(localStorage.getItem("dailyProgress") || "{}");
  } catch {
    return {};
  }
};

export const incrementDailyProgress = () => {
  const today = getTodayKey();
  const data = getDailyProgress();

  data[today] = (data[today] || 0) + 1;
  localStorage.setItem("dailyProgress", JSON.stringify(data));
};

export const decrementDailyProgress = () => {
  const today = getTodayKey();
  const data = getDailyProgress();
  const current = Number(data[today] || 0);
  data[today] = Math.max(0, current - 1);
  // If zero, keep explicitly as 0 so UI reads it, or delete key? keep as 0 for safety
  localStorage.setItem("dailyProgress", JSON.stringify(data));
};

export const calcStreak = (dailyData) => {
  const dates = Object.keys(dailyData).sort();
  if (dates.length === 0) return 0;

  const today = getTodayKey();

  // build yesterday key using local date arithmetic
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yKey = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;

  // Decide starting point for streak
  let currentKey = dates.includes(today) ? today : (dates.includes(yKey) ? yKey : null);
  if (!currentKey) return 0;

  let streak = 1;

  // Parse currentKey into a local Date (avoid new Date('YYYY-MM-DD') which is treated as UTC)
  const [cy, cm, cd] = currentKey.split('-').map(n => parseInt(n, 10));
  let checkDate = new Date(cy, cm - 1, cd);

  while (true) {
    checkDate.setDate(checkDate.getDate() - 1);
    const key = `${checkDate.getFullYear()}-${String(checkDate.getMonth() + 1).padStart(2, '0')}-${String(checkDate.getDate()).padStart(2, '0')}`;
    if (dailyData[key] && dailyData[key] > 0) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
};
