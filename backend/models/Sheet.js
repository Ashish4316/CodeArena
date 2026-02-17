import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Question title is required'],
        trim: true
    },
    difficulty: {
        type: String,
        enum: ['Easy', 'Medium', 'Hard'],
        default: 'Medium'
    },
    leetcodeLink: String,
    gfgLink: String,
    youtubeLink: String,
    customLink: String,
    tags: [String],
    companies: [String],
    order: {
        type: Number,
        default: 0
    }
});

const topicSchema = new mongoose.Schema({
    topic: {
        type: String,
        required: [true, 'Topic name is required'],
        trim: true
    },
    questions: [questionSchema],
    order: {
        type: Number,
        default: 0
    }
});

const sheetSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Sheet name is required'],
        trim: true
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    description: {
        type: String,
        trim: true
    },
    icon: {
        type: String,
        default: '📘'
    },
    color: {
        type: String,
        default: 'blue'
    },
    gradient: {
        type: String,
        default: 'from-blue-500 to-cyan-500'
    },
    image: String,
    // Type: 'official' for Striver, Love Babbar, etc. | 'custom' for user-created
    type: {
        type: String,
        enum: ['official', 'custom'],
        default: 'official'
    },
    // For custom sheets - who created it
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    // Visibility for custom sheets
    isPublic: {
        type: Boolean,
        default: false
    },
    topics: [topicSchema],
    // Stats
    totalQuestions: {
        type: Number,
        default: 0
    },
    // Metadata
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes (slug already indexed by unique: true)
sheetSchema.index({ type: 1 });
sheetSchema.index({ createdBy: 1 });
sheetSchema.index({ isPublic: 1 });

// Pre-save middleware to calculate total questions
sheetSchema.pre('save', function(next) {
    this.totalQuestions = this.topics.reduce((total, topic) => {
        return total + (topic.questions ? topic.questions.length : 0);
    }, 0);
    next();
});

// Generate slug from name if not provided
sheetSchema.pre('save', function(next) {
    if (!this.slug) {
        this.slug = this.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    }
    next();
});

const Sheet = mongoose.model('Sheet', sheetSchema);

export default Sheet;
