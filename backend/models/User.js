import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '../config/config.js';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        maxlength: [50, 'Name cannot exceed 50 characters']
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
            'Please provide a valid email'
        ]
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: [6, 'Password must be at least 6 characters'],
        select: false // Don't return password by default
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    avatar: {
        type: String,
        default: null
    },
    // Coding platform handles
    handles: {
        leetcode: { type: String, trim: true },
        github: { type: String, trim: true },
        codeforces: { type: String, trim: true },
        codolio: { type: String, trim: true }
    },
    // Gamification stats
    gamification: {
        totalXP: { type: Number, default: 0 },
        level: { type: Number, default: 1 },
        badges: [{ type: String }],
        achievements: [{
            id: String,
            unlockedAt: { type: Date, default: Date.now }
        }]
    },
    // Account status
    isActive: {
        type: Boolean,
        default: true
    },
    lastLogin: {
        type: Date
    },
    // Firebase UID (for migration from Firebase)
    firebaseUid: {
        type: String,
        sparse: true
    },
    passwordResetToken: String,
    passwordResetExpire: Date
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes for performance (email already indexed by unique: true)
userSchema.index({ 'handles.leetcode': 1 });
userSchema.index({ 'gamification.totalXP': -1 });
userSchema.index({ createdAt: -1 });

// Virtual for total solved problems
userSchema.virtual('totalSolved', {
    ref: 'Progress',
    localField: '_id',
    foreignField: 'user',
    count: true
});

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Update level based on XP
userSchema.pre('save', function(next) {
    if (this.isModified('gamification.totalXP')) {
        this.gamification.level = Math.floor(this.gamification.totalXP / 100) + 1;
    }
    next();
});

// Sign JWT and return
userSchema.methods.getSignedJwtToken = function() {
    return jwt.sign(
        { id: this._id, role: this.role },
        config.jwtSecret,
        { expiresIn: config.jwtExpire }
    );
};

// Match password
userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Get public profile
userSchema.methods.getPublicProfile = function() {
    return {
        id: this._id,
        name: this.name,
        email: this.email,
        avatar: this.avatar,
        handles: this.handles,
        gamification: this.gamification,
        createdAt: this.createdAt
    };
};

const User = mongoose.model('User', userSchema);

export default User;
