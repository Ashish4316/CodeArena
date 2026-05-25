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
  const raw = localStorage.getItem(storageKey);
  const all = (raw && raw !== "null") ? (JSON.parse(raw) || {}) : {};
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
  const raw = localStorage.getItem(storageKey);
  const all = (raw && raw !== "null") ? (JSON.parse(raw) || {}) : {};
  all[sheetKey] = sheetProgress || {};
  localStorage.setItem(storageKey, JSON.stringify(all));
};

export const getAllProgress = () => {
  const storageKey = getUserKey("progress");
  const raw = localStorage.getItem(storageKey);
  return (raw && raw !== "null") ? (JSON.parse(raw) || {}) : {};
};

export const getDailyStats = () => {
  const all = getAllProgress();
  let totalSolved = 0;
  Object.values(all).forEach((sheetObj) => {
    totalSolved += Object.values(sheetObj || {}).filter(Boolean).length;
  });

  const dailyKey = getUserKey("dailyProgress");
  const dailyRaw = localStorage.getItem(dailyKey);
  const daily = (dailyRaw && dailyRaw !== "null") ? (JSON.parse(dailyRaw) || {}) : {};

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
 * Merge temporary (guest) data into user-specific storage, then clean up temp keys.
 * This preserves progress made before the user logged in / registered.
 */
export const initializeUserStorage = (userId) => {
  // Set current user first so getUserKey() resolves correctly
  setCurrentUserId(userId);

  // Find all _temp_ keys
  const tempKeys = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('_temp_')) {
      tempKeys.push(key);
    }
  }

  // Merge each temp key into the corresponding user key
  tempKeys.forEach(tempKey => {
    const baseKey = tempKey.replace('_temp_', '');
    const userKey = `user_${userId}_${baseKey}`;

    try {
      const rawTemp = localStorage.getItem(tempKey);
      const tempData = (rawTemp && rawTemp !== "null") ? (JSON.parse(rawTemp) || {}) : {};
      const rawUser = localStorage.getItem(userKey);
      const userData = (rawUser && rawUser !== "null") ? (JSON.parse(rawUser) || {}) : {};

      // Deep merge: for progress, merge sheet-level objects
      if (baseKey === 'progress') {
        Object.keys(tempData).forEach(sheetKey => {
          if (!userData[sheetKey]) {
            userData[sheetKey] = {};
          }
          // Only add new solved marks, don't overwrite existing
          Object.keys(tempData[sheetKey] || {}).forEach(qId => {
            if (tempData[sheetKey][qId] && !userData[sheetKey][qId]) {
              userData[sheetKey][qId] = true;
            }
          });
        });
      } else {
        // For other keys (dailyProgress, notes, etc.), merge at top level
        Object.keys(tempData).forEach(k => {
          if (userData[k] === undefined) {
            userData[k] = tempData[k];
          }
        });
      }

      localStorage.setItem(userKey, JSON.stringify(userData));
    } catch (e) {
      console.warn(`[Storage] Failed to merge temp key ${tempKey}:`, e);
    }

    // Remove temp key after merge
    localStorage.removeItem(tempKey);
  });

  if (tempKeys.length > 0) {
    console.log(`[Storage] Merged ${tempKeys.length} guest data key(s) into user storage`);
    // Notify components that progress data changed
    window.dispatchEvent(new Event("progressUpdated"));
  }
};

