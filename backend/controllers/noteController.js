import Note from '../models/Note.js';
import { asyncHandler, AppError } from '../utils/errorHandler.js';

/**
 * @desc    Get all notes for user
 * @route   GET /api/notes
 * @access  Private
 */
export const getNotes = asyncHandler(async (req, res, next) => {
    const { sheetSlug, page = 1, limit = 50 } = req.query;
    const userId = req.user._id;

    const query = { user: userId };
    if (sheetSlug) query.sheetSlug = sheetSlug;

    const notes = await Note.find(query)
        .sort({ updatedAt: -1 })
        .skip((page - 1) * limit)
        .limit(parseInt(limit));

    const total = await Note.countDocuments(query);

    // Convert to object format for frontend compatibility
    const notesObj = {};
    notes.forEach(note => {
        notesObj[note.questionId] = note.content;
    });

    res.status(200).json({
        success: true,
        data: notesObj,
        notes: notes, // Also send full notes for detailed view
        pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            pages: Math.ceil(total / limit)
        }
    });
});

/**
 * @desc    Get note for a specific question
 * @route   GET /api/notes/:questionId
 * @access  Private
 */
export const getNote = asyncHandler(async (req, res, next) => {
    const { questionId } = req.params;
    const { sheetSlug } = req.query;
    const userId = req.user._id;

    const note = await Note.findOne({ 
        user: userId, 
        questionId,
        ...(sheetSlug && { sheetSlug })
    });

    res.status(200).json({
        success: true,
        data: note || { content: '' }
    });
});

/**
 * @desc    Create or update note
 * @route   POST /api/notes
 * @access  Private
 */
export const saveNote = asyncHandler(async (req, res, next) => {
    const { questionId, sheetSlug, content, code, language, tags } = req.body;
    const userId = req.user._id;

    if (!questionId || !sheetSlug) {
        return next(new AppError('questionId and sheetSlug are required', 400));
    }

    // Upsert note
    const note = await Note.findOneAndUpdate(
        { user: userId, questionId, sheetSlug },
        {
            content: content || '',
            code,
            language,
            tags
        },
        { upsert: true, new: true, runValidators: true }
    );

    res.status(200).json({
        success: true,
        data: note
    });
});

/**
 * @desc    Delete note
 * @route   DELETE /api/notes/:questionId
 * @access  Private
 */
export const deleteNote = asyncHandler(async (req, res, next) => {
    const { questionId } = req.params;
    const { sheetSlug } = req.query;
    const userId = req.user._id;

    const note = await Note.findOneAndDelete({
        user: userId,
        questionId,
        ...(sheetSlug && { sheetSlug })
    });

    if (!note) {
        return next(new AppError('Note not found', 404));
    }

    res.status(200).json({
        success: true,
        data: {}
    });
});

/**
 * @desc    Sync all notes (bulk update)
 * @route   POST /api/notes/sync
 * @access  Private
 */
export const syncNotes = asyncHandler(async (req, res, next) => {
    const { notes } = req.body;
    const userId = req.user._id;

    if (!notes || typeof notes !== 'object') {
        return next(new AppError('Invalid notes data', 400));
    }

    const operations = [];

    for (const [questionId, content] of Object.entries(notes)) {
        if (content && content.trim()) {
            operations.push({
                updateOne: {
                    filter: { user: userId, questionId },
                    update: { $set: { content, user: userId, questionId, sheetSlug: 'default' } },
                    upsert: true
                }
            });
        }
    }

    if (operations.length > 0) {
        await Note.bulkWrite(operations);
    }

    res.status(200).json({
        success: true,
        message: `${operations.length} notes synced`
    });
});
