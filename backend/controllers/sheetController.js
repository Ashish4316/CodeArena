import Sheet from '../models/Sheet.js';
import Progress from '../models/Progress.js';
import { asyncHandler, AppError } from '../utils/errorHandler.js';

/**
 * @desc    Get all sheets
 * @route   GET /api/sheets
 * @access  Public
 */
export const getSheets = asyncHandler(async (req, res, next) => {
    const { type, page = 1, limit = 20 } = req.query;

    const query = { isActive: true };

    // Filter by type
    if (type === 'official') {
        query.type = 'official';
    } else if (type === 'custom') {
        query.type = 'custom';
        query.isPublic = true;
    }

    // If user is authenticated, include their private custom sheets
    if (req.user && type !== 'official') {
        query.$or = [
            { type: 'official' },
            { type: 'custom', isPublic: true },
            { type: 'custom', createdBy: req.user._id }
        ];
        delete query.type;
        delete query.isPublic;
    }

    const sheets = await Sheet.find(query)
        .select('name slug description icon color gradient image type totalQuestions createdBy')
        .sort({ type: 1, createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(parseInt(limit))
        .populate('createdBy', 'name email');

    const total = await Sheet.countDocuments(query);

    res.status(200).json({
        success: true,
        data: sheets,
        pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            pages: Math.ceil(total / limit)
        }
    });
});

/**
 * @desc    Get single sheet by slug
 * @route   GET /api/sheets/:slug
 * @access  Public
 */
export const getSheet = asyncHandler(async (req, res, next) => {
    const { slug } = req.params;

    const sheet = await Sheet.findOne({ slug, isActive: true })
        .populate('createdBy', 'name email');

    if (!sheet) {
        return next(new AppError('Sheet not found', 404));
    }

    // Check access for private custom sheets
    if (sheet.type === 'custom' && !sheet.isPublic) {
        if (!req.user || (sheet.createdBy._id.toString() !== req.user._id.toString() && req.user.role !== 'admin')) {
            return next(new AppError('Not authorized to access this sheet', 403));
        }
    }

    res.status(200).json({
        success: true,
        data: sheet
    });
});

/**
 * @desc    Create custom sheet
 * @route   POST /api/sheets
 * @access  Private
 */
export const createSheet = asyncHandler(async (req, res, next) => {
    const { name, description, icon, color, gradient, topics, isPublic } = req.body;

    // Generate unique slug
    let slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    slug = `custom-${slug}-${Date.now()}`;

    const sheet = await Sheet.create({
        name,
        slug,
        description,
        icon,
        color,
        gradient,
        type: 'custom',
        createdBy: req.user._id,
        isPublic: isPublic || false,
        topics: topics || []
    });

    res.status(201).json({
        success: true,
        data: sheet
    });
});

/**
 * @desc    Update custom sheet
 * @route   PUT /api/sheets/:slug
 * @access  Private
 */
export const updateSheet = asyncHandler(async (req, res, next) => {
    const { slug } = req.params;

    let sheet = await Sheet.findOne({ slug });

    if (!sheet) {
        return next(new AppError('Sheet not found', 404));
    }

    // Check ownership
    if (sheet.type !== 'custom') {
        return next(new AppError('Cannot modify official sheets', 403));
    }

    if (sheet.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return next(new AppError('Not authorized to modify this sheet', 403));
    }

    const allowedUpdates = ['name', 'description', 'icon', 'color', 'gradient', 'topics', 'isPublic'];
    const updates = {};

    allowedUpdates.forEach(field => {
        if (req.body[field] !== undefined) {
            updates[field] = req.body[field];
        }
    });

    sheet = await Sheet.findOneAndUpdate({ slug }, updates, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        data: sheet
    });
});

/**
 * @desc    Delete custom sheet
 * @route   DELETE /api/sheets/:slug
 * @access  Private
 */
export const deleteSheet = asyncHandler(async (req, res, next) => {
    const { slug } = req.params;

    const sheet = await Sheet.findOne({ slug });

    if (!sheet) {
        return next(new AppError('Sheet not found', 404));
    }

    // Check ownership
    if (sheet.type !== 'custom') {
        return next(new AppError('Cannot delete official sheets', 403));
    }

    if (sheet.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return next(new AppError('Not authorized to delete this sheet', 403));
    }

    // Soft delete
    sheet.isActive = false;
    await sheet.save();

    res.status(200).json({
        success: true,
        data: {}
    });
});

/**
 * @desc    Get sheet statistics
 * @route   GET /api/sheets/:slug/stats
 * @access  Public
 */
export const getSheetStats = asyncHandler(async (req, res, next) => {
    const { slug } = req.params;

    const sheet = await Sheet.findOne({ slug, isActive: true });

    if (!sheet) {
        return next(new AppError('Sheet not found', 404));
    }

    // Get total users who have progress on this sheet
    const totalUsers = await Progress.countDocuments({ sheetSlug: slug });

    // Get average completion
    const avgCompletion = await Progress.aggregate([
        { $match: { sheetSlug: slug } },
        { $group: { _id: null, avgSolved: { $avg: '$solvedCount' } } }
    ]);

    // Get difficulty distribution
    let easyCount = 0, mediumCount = 0, hardCount = 0;
    sheet.topics.forEach(topic => {
        topic.questions.forEach(q => {
            if (q.difficulty === 'Easy') easyCount++;
            else if (q.difficulty === 'Medium') mediumCount++;
            else if (q.difficulty === 'Hard') hardCount++;
        });
    });

    res.status(200).json({
        success: true,
        data: {
            totalQuestions: sheet.totalQuestions,
            totalTopics: sheet.topics.length,
            totalUsers,
            avgCompletion: avgCompletion[0]?.avgSolved || 0,
            difficulty: {
                easy: easyCount,
                medium: mediumCount,
                hard: hardCount
            }
        }
    });
});

/**
 * @desc    Search sheets
 * @route   GET /api/sheets/search
 * @access  Public
 */
export const searchSheets = asyncHandler(async (req, res, next) => {
    const { q, limit = 10 } = req.query;

    if (!q) {
        return next(new AppError('Search query is required', 400));
    }

    const sheets = await Sheet.find({
        isActive: true,
        $or: [
            { name: { $regex: q, $options: 'i' } },
            { description: { $regex: q, $options: 'i' } }
        ]
    })
        .select('name slug description icon totalQuestions')
        .limit(parseInt(limit));

    res.status(200).json({
        success: true,
        data: sheets
    });
});
