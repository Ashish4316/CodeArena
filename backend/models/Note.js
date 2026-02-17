import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    questionId: {
        type: String,
        required: true
    },
    sheetSlug: {
        type: String,
        required: true
    },
    content: {
        type: String,
        default: '',
        maxlength: [10000, 'Note cannot exceed 10000 characters']
    },
    // Additional metadata
    code: {
        type: String,
        default: ''
    },
    language: {
        type: String,
        default: 'javascript'
    },
    tags: [String]
}, {
    timestamps: true
});

// Compound unique index
noteSchema.index({ user: 1, questionId: 1, sheetSlug: 1 }, { unique: true });
noteSchema.index({ user: 1, sheetSlug: 1 });

const Note = mongoose.model('Note', noteSchema);

export default Note;
