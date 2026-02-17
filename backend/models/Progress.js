import mongoose from 'mongoose';

const progressSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    sheet: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Sheet',
        required: true
    },
    sheetSlug: {
        type: String,
        required: true
    },
    // Map of questionId to solved status
    solvedQuestions: {
        type: Map,
        of: Boolean,
        default: {}
    },
    // Count of solved questions (for quick queries)
    solvedCount: {
        type: Number,
        default: 0
    },
    // Last activity date
    lastActivityAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Compound unique index
progressSchema.index({ user: 1, sheet: 1 }, { unique: true });
progressSchema.index({ user: 1, sheetSlug: 1 });
progressSchema.index({ user: 1, lastActivityAt: -1 });

// Pre-save middleware to update solved count
progressSchema.pre('save', function(next) {
    if (this.solvedQuestions) {
        let count = 0;
        this.solvedQuestions.forEach((value) => {
            if (value) count++;
        });
        this.solvedCount = count;
    }
    next();
});

// Static method to get or create progress
progressSchema.statics.getOrCreate = async function(userId, sheetId, sheetSlug) {
    let progress = await this.findOne({ user: userId, sheet: sheetId });
    if (!progress) {
        progress = await this.create({
            user: userId,
            sheet: sheetId,
            sheetSlug: sheetSlug
        });
    }
    return progress;
};

const Progress = mongoose.model('Progress', progressSchema);

export default Progress;
