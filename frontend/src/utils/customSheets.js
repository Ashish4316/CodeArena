/**
 * User-Isolated Custom Sheets Storage Utility
 */

// Get current user ID from localStorage
const getCurrentUserId = () => {
    return localStorage.getItem("currentUserId") || null;
};

// Build user-specific storage key
const getStorageKey = () => {
    const userId = getCurrentUserId();
    if (!userId) {
        return "_temp_custom_sheets";
    }
    return `user_${userId}_custom_sheets`;
};

export const getCustomSheets = () => {
    try {
        const key = getStorageKey();
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : [];
    } catch (e) {
        console.warn("Failed to parse custom sheets", e);
        return [];
    }
};

export const getCustomSheet = (id) => {
    const sheets = getCustomSheets();
    return sheets.find((s) => s.id === id) || null;
};

export const saveCustomSheet = (sheet) => {
    const sheets = getCustomSheets();
    const key = getStorageKey();
    const existingIndex = sheets.findIndex((s) => s.id === sheet.id);

    if (existingIndex >= 0) {
        sheets[existingIndex] = sheet;
    } else {
        sheets.push(sheet);
    }

    localStorage.setItem(key, JSON.stringify(sheets));
    window.dispatchEvent(new Event("customSheetsUpdated"));
};

export const deleteCustomSheet = (id) => {
    const key = getStorageKey();
    const sheets = getCustomSheets().filter((s) => s.id !== id);
    localStorage.setItem(key, JSON.stringify(sheets));
    window.dispatchEvent(new Event("customSheetsUpdated"));
};
