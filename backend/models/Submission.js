import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    questionId: {
        type: String,
        required: true
    },
    questionTitle: {
        type: String,
        required: true
    },
    sheetSlug: {
        type: String,
        required: true
    },
    // Submission details
    status: {
        type: String,
        enum: ['solved', 'attempted', 'revisit'],
        default: 'solved'
    },
    difficulty: {
        type: String,
        enum: ['Easy', 'Medium', 'Hard'],
        default: 'Medium'
    },
    // XP earned for this submission
    xpEarned: {
        type: Number,
        default: 0
    },
    // Time spent (optional)
    timeSpent: {
        type: Number, // in minutes
        default: 0
    },
    // Notes about the submission
    notes: String,
    // Solution approach
    approach: String
}, {
    timestamps: true
});

// Indexes
submissionSchema.index({ user: 1, questionId: 1 });
submissionSchema.index({ user: 1, sheetSlug: 1 });
submissionSchema.index({ user: 1, createdAt: -1 });
submissionSchema.index({ user: 1, status: 1 });

const Submission = mongoose.model('Submission', submissionSchema);

export default Submission;
