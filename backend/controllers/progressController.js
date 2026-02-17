import Progress from '../models/Progress.js';
import DailyProgress from '../models/DailyProgress.js';
import Submission from '../models/Submission.js';
import Sheet from '../models/Sheet.js';
import User from '../models/User.js';
import { asyncHandler, AppError } from '../utils/errorHandler.js';

// XP values for different difficulties
const XP_VALUES = {
    easy: 10,
    medium: 25,
    hard: 50
};

/**
 * @desc    Get user progress for a sheet
 * @route   GET /api/progress/:sheetSlug
 * @access  Private
 */
export const getProgress = asyncHandler(async (req, res, next) => {
    const { sheetSlug } = req.params;
    const userId = req.user._id;

    const progress = await Progress.findOne({ user: userId, sheetSlug });

    if (!progress) {
        return res.status(200).json({
            success: true,
            data: {
                sheetSlug,
                solvedQuestions: {},
                solvedCount: 0
            }
        });
    }

    // Convert Map to object
    const solvedQuestions = {};
    if (progress.solvedQuestions) {
        progress.solvedQuestions.forEach((value, key) => {
            solvedQuestions[key] = value;
        });
    }

    res.status(200).json({
        success: true,
        data: {
            sheetSlug,
            solvedQuestions,
            solvedCount: progress.solvedCount
        }
    });
});

/**
 * @desc    Get all progress for user
 * @route   GET /api/progress
 * @access  Private
 */
export const getAllProgress = asyncHandler(async (req, res, next) => {
    const userId = req.user._id;

    const allProgress = await Progress.find({ user: userId });

    // Convert to expected format
    const progressData = {};
    allProgress.forEach(p => {
        const solved = {};
        if (p.solvedQuestions) {
            p.solvedQuestions.forEach((value, key) => {
                solved[key] = value;
            });
        }
        progressData[p.sheetSlug] = solved;
    });

    res.status(200).json({
        success: true,
        data: progressData
    });
});

/**
 * @desc    Update progress (mark question as solved/unsolved)
 * @route   POST /api/progress/:sheetSlug
 * @access  Private
 */
export const updateProgress = asyncHandler(async (req, res, next) => {
    const { sheetSlug } = req.params;
    const { questionId, solved, difficulty = 'medium', questionTitle } = req.body;
    const userId = req.user._id;

    // Find or create sheet reference
    let sheet = await Sheet.findOne({ slug: sheetSlug });
    if (!sheet) {
        // For legacy/static sheets, create a placeholder
        sheet = { _id: null, slug: sheetSlug };
    }

    // Find or create progress
    let progress = await Progress.findOne({ user: userId, sheetSlug });
    
    if (!progress) {
        progress = new Progress({
            user: userId,
            sheet: sheet._id,
            sheetSlug
        });
    }

    // Check previous state
    const wasSolved = progress.solvedQuestions?.get(String(questionId)) || false;

    // Update solved status
    progress.solvedQuestions.set(String(questionId), solved);
    progress.lastActivityAt = new Date();

    // Calculate XP
    const difficultyLower = difficulty.toLowerCase();
    const xpAmount = XP_VALUES[difficultyLower] || 10;

    // Update user XP and daily progress
    const user = await User.findById(userId);

    if (solved && !wasSolved) {
        // Marking as solved - add XP
        user.gamification.totalXP += xpAmount;
        await DailyProgress.increment(userId, difficulty, xpAmount);

        // Create submission record
        await Submission.create({
            user: userId,
            questionId,
            questionTitle: questionTitle || `Question ${questionId}`,
            sheetSlug,
            status: 'solved',
            difficulty,
            xpEarned: xpAmount
        });

        // Check for badges
        await checkAndAwardBadges(user);
    } else if (!solved && wasSolved) {
        // Unmarking as solved - remove XP
        user.gamification.totalXP = Math.max(0, user.gamification.totalXP - xpAmount);
        await DailyProgress.decrement(userId, difficulty, xpAmount);
    }

    await user.save();
    await progress.save();

    // Get updated stats
    const streak = await DailyProgress.calculateStreak(userId);

    res.status(200).json({
        success: true,
        data: {
            questionId,
            solved,
            solvedCount: progress.solvedCount,
            xpEarned: solved && !wasSolved ? xpAmount : 0,
            totalXP: user.gamification.totalXP,
            level: user.gamification.level,
            streak
        }
    });
});

/**
 * @desc    Sync all progress (bulk update)
 * @route   POST /api/progress/sync
 * @access  Private
 */
export const syncProgress = asyncHandler(async (req, res, next) => {
    const { progress: progressData, dailyProgress } = req.body;
    const userId = req.user._id;

    // Sync sheet progress
    if (progressData && typeof progressData === 'object') {
        for (const [sheetSlug, solved] of Object.entries(progressData)) {
            let progress = await Progress.findOne({ user: userId, sheetSlug });
            
            if (!progress) {
                progress = new Progress({
                    user: userId,
                    sheet: null,
                    sheetSlug
                });
            }

            // Update solved questions
            if (solved && typeof solved === 'object') {
                for (const [questionId, isSolved] of Object.entries(solved)) {
                    progress.solvedQuestions.set(questionId, isSolved);
                }
            }

            await progress.save();
        }
    }

    // Sync daily progress
    if (dailyProgress && typeof dailyProgress === 'object') {
        for (const [date, count] of Object.entries(dailyProgress)) {
            if (typeof count === 'number' && count > 0) {
                await DailyProgress.findOneAndUpdate(
                    { user: userId, date },
                    { $set: { count } },
                    { upsert: true }
                );
            }
        }
    }

    res.status(200).json({
        success: true,
        message: 'Progress synced successfully'
    });
});

/**
 * @desc    Get daily progress
 * @route   GET /api/progress/daily
 * @access  Private
 */
export const getDailyProgress = asyncHandler(async (req, res, next) => {
    const userId = req.user._id;
    const { startDate, endDate } = req.query;

    const start = startDate || `${new Date().getFullYear()}-01-01`;
    const end = endDate || new Date().toISOString().split('T')[0];

    const dailyData = await DailyProgress.getRange(userId, start, end);

    // Convert to object format
    const progress = {};
    dailyData.forEach(dp => {
        progress[dp.date] = dp.count;
    });

    res.status(200).json({
        success: true,
        data: progress
    });
});

/**
 * @desc    Export progress as CSV
 * @route   GET /api/progress/export
 * @access  Private
 */
export const exportProgress = asyncHandler(async (req, res, next) => {
    const userId = req.user._id;

    const submissions = await Submission.find({ user: userId })
        .sort({ createdAt: -1 });

    // Generate CSV
    const headers = ['Date', 'Question', 'Sheet', 'Difficulty', 'Status', 'XP Earned'];
    const rows = submissions.map(s => [
        s.createdAt.toISOString().split('T')[0],
        s.questionTitle,
        s.sheetSlug,
        s.difficulty,
        s.status,
        s.xpEarned
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=codearena-progress.csv');
    res.send(csv);
});

// Helper function to check and award badges
async function checkAndAwardBadges(user) {
    const badges = user.gamification.badges || [];
    const newBadges = [];

    // Get total solved count
    const allProgress = await Progress.find({ user: user._id });
    let totalSolved = 0;
    allProgress.forEach(p => {
        totalSolved += p.solvedCount;
    });

    // Get streak
    const streak = await DailyProgress.calculateStreak(user._id);

    // Badge definitions
    const badgeChecks = [
        { id: 'first_blood', condition: totalSolved >= 1 },
        { id: 'novice_coder', condition: totalSolved >= 10 },
        { id: 'first_50', condition: totalSolved >= 50 },
        { id: 'streak_master', condition: streak >= 7 },
        { id: 'coding_master', condition: user.gamification.level >= 10 },
        { id: 'century', condition: totalSolved >= 100 },
        { id: 'two_hundred', condition: totalSolved >= 200 },
        { id: 'streak_god', condition: streak >= 30 }
    ];

    badgeChecks.forEach(({ id, condition }) => {
        if (condition && !badges.includes(id)) {
            newBadges.push(id);
        }
    });

    if (newBadges.length > 0) {
        user.gamification.badges = [...badges, ...newBadges];
        user.gamification.achievements.push(
            ...newBadges.map(id => ({ id, unlockedAt: new Date() }))
        );
    }
}
