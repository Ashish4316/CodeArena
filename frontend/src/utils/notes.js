/**
 * User-Isolated Notes Storage Utility
 * Stores notes per question in localStorage, isolated per user
 */

// Get current user ID from localStorage
const getCurrentUserId = () => {
    return localStorage.getItem("currentUserId") || null;
};

// Build user-specific storage key
const getNotesKey = () => {
    const userId = getCurrentUserId();
    if (!userId) {
        return "_temp_codearena_notes";
    }
    return `user_${userId}_codearena_notes`;
};

/**
 * Get all notes from localStorage
 * @returns {Object} Object mapping questionId to note text
 */
export const getAllNotes = () => {
    try {
        const key = getNotesKey();
        const stored = localStorage.getItem(key);
        return stored ? JSON.parse(stored) : {};
    } catch {
        return {};
    }
};

/**
 * Get note for a specific question
 * @param {string} questionId 
 * @returns {string} Note text or empty string
 */
export const getNote = (questionId) => {
    const notes = getAllNotes();
    return notes[questionId] || "";
};

/**
 * Save note for a specific question
 * @param {string} questionId 
 * @param {string} noteText 
 */
export const saveNote = (questionId, noteText) => {
    const notes = getAllNotes();
    const key = getNotesKey();
    
    if (noteText.trim()) {
        notes[questionId] = noteText;
    } else {
        delete notes[questionId]; // Remove empty notes
    }
    localStorage.setItem(key, JSON.stringify(notes));
    window.dispatchEvent(new Event("notesUpdated"));
};

/**
 * Delete note for a specific question
 * @param {string} questionId 
 */
export const deleteNote = (questionId) => {
    const notes = getAllNotes();
    const key = getNotesKey();
    
    delete notes[questionId];
    localStorage.setItem(key, JSON.stringify(notes));
    window.dispatchEvent(new Event("notesUpdated"));
};

/**
 * Check if a question has a note
 * @param {string} questionId 
 * @returns {boolean}
 */
export const hasNote = (questionId) => {
    return !!getNote(questionId);
};
