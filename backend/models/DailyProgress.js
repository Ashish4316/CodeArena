import mongoose from 'mongoose';

const dailyProgressSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: String, // Format: YYYY-MM-DD
        required: true
    },
    count: {
        type: Number,
        default: 0
    },
    // Track XP earned on this day
    xpEarned: {
        type: Number,
        default: 0
    },
    // Detailed breakdown by difficulty
    breakdown: {
        easy: { type: Number, default: 0 },
        medium: { type: Number, default: 0 },
        hard: { type: Number, default: 0 }
    }
}, {
    timestamps: true
});

// Compound unique index
dailyProgressSchema.index({ user: 1, date: 1 }, { unique: true });
dailyProgressSchema.index({ user: 1, date: -1 });

// Static method to increment daily progress
dailyProgressSchema.statics.increment = async function(userId, difficulty = 'medium', xp = 0) {
    const today = new Date().toISOString().split('T')[0];
    const difficultyLower = difficulty.toLowerCase();

    const update = {
        $inc: {
            count: 1,
            xpEarned: xp,
            [`breakdown.${difficultyLower}`]: 1
        }
    };

    return await this.findOneAndUpdate(
        { user: userId, date: today },
        update,
        { upsert: true, new: true }
    );
};

// Static method to decrement daily progress
dailyProgressSchema.statics.decrement = async function(userId, difficulty = 'medium', xp = 0) {
    const today = new Date().toISOString().split('T')[0];
    const difficultyLower = difficulty.toLowerCase();

    const doc = await this.findOne({ user: userId, date: today });
    if (!doc || doc.count <= 0) return doc;

    const update = {
        $inc: {
            count: -1,
            xpEarned: -xp,
            [`breakdown.${difficultyLower}`]: -1
        }
    };

    return await this.findOneAndUpdate(
        { user: userId, date: today },
        update,
        { new: true }
    );
};

// Static method to get user's daily progress for a date range
dailyProgressSchema.statics.getRange = async function(userId, startDate, endDate) {
    return await this.find({
        user: userId,
        date: { $gte: startDate, $lte: endDate }
    }).sort({ date: 1 });
};

// Static method to calculate streak
dailyProgressSchema.statics.calculateStreak = async function(userId) {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    // Get all daily progress sorted by date descending
    const progress = await this.find({ user: userId, count: { $gt: 0 } })
        .sort({ date: -1 })
        .lean();

    if (progress.length === 0) return 0;

    // Check if most recent activity is today or yesterday
    const mostRecent = progress[0].date;
    if (mostRecent !== today && mostRecent !== yesterday) return 0;

    let streak = 1;
    let currentDate = new Date(mostRecent);

    for (let i = 1; i < progress.length; i++) {
        currentDate.setDate(currentDate.getDate() - 1);
        const expectedDate = currentDate.toISOString().split('T')[0];

        if (progress[i].date === expectedDate) {
            streak++;
        } else {
            break;
        }
    }

    return streak;
};

const DailyProgress = mongoose.model('DailyProgress', dailyProgressSchema);

export default DailyProgress;
