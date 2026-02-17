/**
 * User-Isolated Storage Utility
 * All data is stored per-user using userId prefix
 */

// Get current user ID from localStorage (set by AuthContext)
const getCurrentUserId = () => {
  return localStorage.getItem("currentUserId") || null;
};

// Build user-specific storage key
const getUserKey = (baseKey) => {
  const userId = getCurrentUserId();
  if (!userId) {
    console.warn(`[Storage] No user logged in, using temporary storage for: ${baseKey}`);
    return `_temp_${baseKey}`;
  }
  return `user_${userId}_${baseKey}`;
};

export const getProgress = (sheetKey) => {
  const storageKey = getUserKey("progress");
  const all = JSON.parse(localStorage.getItem(storageKey)) || {};
  if (!sheetKey) return all;
  return all[sheetKey] || {};
};

export const saveProgress = (sheetKey, sheetProgress) => {
  const storageKey = getUserKey("progress");
  if (!sheetKey) {
    // overwrite whole progress object
    localStorage.setItem(storageKey, JSON.stringify(sheetProgress || {}));
    return;
  }
  const all = JSON.parse(localStorage.getItem(storageKey)) || {};
  all[sheetKey] = sheetProgress || {};
  localStorage.setItem(storageKey, JSON.stringify(all));
};

export const getAllProgress = () => {
  const storageKey = getUserKey("progress");
  return JSON.parse(localStorage.getItem(storageKey)) || {};
};

export const getDailyStats = () => {
  const all = getAllProgress();
  let totalSolved = 0;
  Object.values(all).forEach((sheetObj) => {
    totalSolved += Object.values(sheetObj || {}).filter(Boolean).length;
  });

  const dailyKey = getUserKey("dailyProgress");
  const daily = JSON.parse(localStorage.getItem(dailyKey) || "{}");

  return {
    totalSolved,
    daily,
  };
};

/**
 * Clear all data for current user (called on logout)
 */
export const clearUserData = () => {
  const userId = getCurrentUserId();
  if (!userId) return;
  
  // Remove all user-specific keys
  const keysToRemove = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(`user_${userId}_`)) {
      keysToRemove.push(key);
    }
  }
  keysToRemove.forEach(key => localStorage.removeItem(key));
  
  // Also clear temp data
  const tempKeys = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('_temp_')) {
      tempKeys.push(key);
    }
  }
  tempKeys.forEach(key => localStorage.removeItem(key));
};

/**
 * Set current user ID (called on login)
 */
export const setCurrentUserId = (userId) => {
  if (userId) {
    localStorage.setItem("currentUserId", userId);
  } else {
    localStorage.removeItem("currentUserId");
  }
};

/**
 * Clear temporary data and set up for new user
 */
export const initializeUserStorage = (userId) => {
  // Clear any temp data from anonymous sessions
  const tempKeys = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('_temp_')) {
      tempKeys.push(key);
    }
  }
  tempKeys.forEach(key => localStorage.removeItem(key));
  
  // Set current user
  setCurrentUserId(userId);
};
