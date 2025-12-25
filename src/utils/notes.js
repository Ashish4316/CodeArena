// Notes Storage Utility
// Stores notes per question in localStorage

const NOTES_KEY = "codearena_notes";

/**
 * Get all notes from localStorage
 * @returns {Object} Object mapping questionId to note text
 */
export const getAllNotes = () => {
    try {
        const stored = localStorage.getItem(NOTES_KEY);
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
    if (noteText.trim()) {
        notes[questionId] = noteText;
    } else {
        delete notes[questionId]; // Remove empty notes
    }
    localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
    window.dispatchEvent(new Event("notesUpdated"));
};

/**
 * Delete note for a specific question
 * @param {string} questionId 
 */
export const deleteNote = (questionId) => {
    const notes = getAllNotes();
    delete notes[questionId];
    localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
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
