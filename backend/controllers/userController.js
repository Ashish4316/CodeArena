import User from '../models/User.js';
import Progress from '../models/Progress.js';
import DailyProgress from '../models/DailyProgress.js';
import Submission from '../models/Submission.js';
import { asyncHandler, AppError } from '../utils/errorHandler.js';

/**
 * @desc    Get user profile
 * @route   GET /api/users/profile
 * @access  Private
 */
export const getProfile = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user._id);

    res.status(200).json({
        success: true,
        data: user.getPublicProfile()
    });
});

/**
 * @desc    Update user profile
 * @route   PUT /api/users/profile
 * @access  Private
 */
export const updateProfile = asyncHandler(async (req, res, next) => {
    const allowedFields = ['name', 'handles', 'avatar'];
    const updates = {};

    allowedFields.forEach(field => {
        if (req.body[field] !== undefined) {
            updates[field] = req.body[field];
        }
    });

    const user = await User.findByIdAndUpdate(
        req.user._id,
        updates,
        { new: true, runValidators: true }
    );

    res.status(200).json({
        success: true,
        data: user.getPublicProfile()
    });
});

/**
 * @desc    Get user stats (dashboard)
 * @route   GET /api/users/stats
 * @access  Private
 */
export const getUserStats = asyncHandler(async (req, res, next) => {
    const userId = req.user._id;

    // Get all progress
    const progress = await Progress.find({ user: userId });

    // Calculate total solved
    let totalSolved = 0;
    const sheetStats = [];

    progress.forEach(p => {
        const solved = p.solvedCount;
        totalSolved += solved;
        sheetStats.push({
            sheetSlug: p.sheetSlug,
            solved: solved
        });
    });

    // Get today's progress
    const today = new Date().toISOString().split('T')[0];
    const todayProgress = await DailyProgress.findOne({ user: userId, date: today });
    const todaySolved = todayProgress ? todayProgress.count : 0;

    // Calculate streak
    const streak = await DailyProgress.calculateStreak(userId);

    // Get gamification stats
    const user = await User.findById(userId);
    const gamification = user.gamification;

    res.status(200).json({
        success: true,
        data: {
            totalSolved,
            todaySolved,
            streak,
            sheets: sheetStats,
            gamification: {
                totalXP: gamification.totalXP,
                level: gamification.level,
                currentLevelXP: gamification.totalXP % 100,
                xpForNextLevel: 100,
                badges: gamification.badges
            }
        }
    });
});

/**
 * @desc    Get daily progress calendar data
 * @route   GET /api/users/calendar
 * @access  Private
 */
export const getCalendarData = asyncHandler(async (req, res, next) => {
    const userId = req.user._id;
    const { year } = req.query;

    const startDate = year ? `${year}-01-01` : `${new Date().getFullYear()}-01-01`;
    const endDate = year ? `${year}-12-31` : `${new Date().getFullYear()}-12-31`;

    const dailyProgress = await DailyProgress.getRange(userId, startDate, endDate);

    // Convert to calendar format
    const calendar = {};
    dailyProgress.forEach(dp => {
        calendar[dp.date] = dp.count;
    });

    res.status(200).json({
        success: true,
        data: {
            calendar,
            totalActiveDays: dailyProgress.length
        }
    });
});

/**
 * @desc    Get user achievements
 * @route   GET /api/users/achievements
 * @access  Private
 */
export const getAchievements = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user._id);

    res.status(200).json({
        success: true,
        data: {
            badges: user.gamification.badges,
            achievements: user.gamification.achievements
        }
    });
});

/**
 * @desc    Get submission history
 * @route   GET /api/users/submissions
 * @access  Private
 */
export const getSubmissions = asyncHandler(async (req, res, next) => {
    const { page = 1, limit = 20, sheetSlug, status } = req.query;

    const query = { user: req.user._id };
    if (sheetSlug) query.sheetSlug = sheetSlug;
    if (status) query.status = status;

    const submissions = await Submission.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(parseInt(limit));

    const total = await Submission.countDocuments(query);

    res.status(200).json({
        success: true,
        data: submissions,
        pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            pages: Math.ceil(total / limit)
        }
    });
});

/**
 * @desc    Get leaderboard
 * @route   GET /api/users/leaderboard
 * @access  Public
 */
export const getLeaderboard = asyncHandler(async (req, res, next) => {
    const { limit = 50 } = req.query;

    const users = await User.find({ isActive: true })
        .select('name email gamification createdAt')
        .sort({ 'gamification.totalXP': -1 })
        .limit(parseInt(limit));

    const leaderboard = users.map((user, index) => ({
        rank: index + 1,
        id: user._id,
        name: user.name || 'Anonymous',
        email: user.email,
        xp: user.gamification.totalXP,
        level: user.gamification.level,
        badges: user.gamification.badges.length
    }));

    res.status(200).json({
        success: true,
        data: leaderboard
    });
});

/**
 * @desc    Get all users (Admin only)
 * @route   GET /api/users
 * @access  Private/Admin
 */
export const getAllUsers = asyncHandler(async (req, res, next) => {
    const { page = 1, limit = 20, search } = req.query;

    const query = {};
    if (search) {
        query.$or = [
            { name: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } }
        ];
    }

    const users = await User.find(query)
        .select('-password')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(parseInt(limit));

    const total = await User.countDocuments(query);

    res.status(200).json({
        success: true,
        data: users,
        pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            pages: Math.ceil(total / limit)
        }
    });
});

/**
 * @desc    Update user role (Admin only)
 * @route   PUT /api/users/:id/role
 * @access  Private/Admin
 */
export const updateUserRole = asyncHandler(async (req, res, next) => {
    const { role } = req.body;

    if (!['user', 'admin'].includes(role)) {
        return next(new AppError('Invalid role', 400));
    }

    const user = await User.findByIdAndUpdate(
        req.params.id,
        { role },
        { new: true }
    );

    if (!user) {
        return next(new AppError('User not found', 404));
    }

    res.status(200).json({
        success: true,
        data: user.getPublicProfile()
    });
});
