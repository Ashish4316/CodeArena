
const STORAGE_KEY = "custom_sheets";

export const getCustomSheets = () => {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    } catch (e) {
        console.warn("Failed to separate custom sheets", e);
        return [];
    }
};

export const getCustomSheet = (id) => {
    const sheets = getCustomSheets();
    return sheets.find((s) => s.id === id) || null;
};

export const saveCustomSheet = (sheet) => {
    const sheets = getCustomSheets();
    const existingIndex = sheets.findIndex((s) => s.id === sheet.id);

    if (existingIndex >= 0) {
        sheets[existingIndex] = sheet;
    } else {
        sheets.push(sheet);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(sheets));
    window.dispatchEvent(new Event("customSheetsUpdated"));
};

export const deleteCustomSheet = (id) => {
    const sheets = getCustomSheets().filter((s) => s.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sheets));
    window.dispatchEvent(new Event("customSheetsUpdated"));
};
