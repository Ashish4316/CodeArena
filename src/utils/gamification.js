import { getProgress } from "./storage";
import { getDailyProgress, calcStreak } from "./dailyProgress";

/**
 * User-Isolated Gamification Utility
 */

// Get current user ID from localStorage
const getCurrentUserId = () => {
    return localStorage.getItem("currentUserId") || null;
};

// Build user-specific storage key
const getUserKey = (baseKey) => {
    const userId = getCurrentUserId();
    if (!userId) {
        return `_temp_${baseKey}`;
    }
    return `user_${userId}_${baseKey}`;
};

const getGamificationKey = () => getUserKey("gamification_stats");
const getBadgesKey = () => getUserKey("user_badges");

// XP Values
export const XP_VALUES = {
    easy: 10,
    medium: 25,
    hard: 50
};

// Level Info
export const getLevelInfo = (totalXP) => {
    const level = Math.floor(totalXP / 100) + 1;
    const currentLevelStartXP = (level - 1) * 100;

    return {
        level,
        currentLevelXP: totalXP - currentLevelStartXP,
        xpForNextLevel: 100,
        progress: ((totalXP - currentLevelStartXP) / 100) * 100
    };
};

export const getGamificationStats = () => {
    try {
        const key = getGamificationKey();
        const stats = JSON.parse(localStorage.getItem(key) || '{"totalXP": 0}');
        return {
            ...stats,
            ...getLevelInfo(stats.totalXP)
        };
    } catch (e) {
        return { totalXP: 0, level: 1, currentLevelXP: 0, xpForNextLevel: 100, progress: 0 };
    }
};

export const addXP = (amount) => {
    const stats = getGamificationStats();
    const oldLevel = stats.level;
    const key = getGamificationKey();

    stats.totalXP += amount;
    localStorage.setItem(key, JSON.stringify({ totalXP: stats.totalXP }));

    const newInfo = getLevelInfo(stats.totalXP);

    // Dispatch event for UI updates
    window.dispatchEvent(new Event("gamificationUpdated"));

    return {
        addedXP: amount,
        newTotalXP: stats.totalXP,
        levelUp: newInfo.level > oldLevel,
        newLevel: newInfo.level
    };
};

// --- BADGES SYSTEM ---

const getTotalSolved = (progress) => {
    let count = 0;
    if (!progress) return 0;
    Object.values(progress).forEach(sheet => {
        if (sheet) {
            count += Object.values(sheet).filter(Boolean).length;
        }
    });
    return count;
};

export const BADGES = [
    { id: "first_blood", icon: "⚔️", title: "First Blood", desc: "Solve your first problem", condition: (p, s) => getTotalSolved(p) >= 1 },
    { id: "novice_coder", icon: "🌱", title: "Novice Coder", desc: "Solve 10 problems", condition: (p, s) => getTotalSolved(p) >= 10 },
    { id: "first_50", icon: "🎖️", title: "First 50", desc: "Solve 50 problems", condition: (p, s) => getTotalSolved(p) >= 50 },
    { id: "streak_master", icon: "🔥", title: "Streak Master", desc: "Maintain a 7-day streak", condition: (p, streak) => streak >= 7 },
    {
        id: "topic_expert", icon: "🎓", title: "Topic Expert", desc: "Master a specific topic (First 20 Qs in a sheet)", condition: (p, s) => {
            return Object.values(p || {}).some(sheet => Object.values(sheet).filter(Boolean).length >= 20);
        }
    },
    {
        id: "coding_master", icon: "👑", title: "Coding Master", desc: "Reach Level 10", condition: (p, s) => {
            const stats = getGamificationStats();
            return stats.level >= 10;
        }
    }
];

export const getBadges = () => {
    try {
        const key = getBadgesKey();
        return JSON.parse(localStorage.getItem(key) || "[]");
    } catch {
        return [];
    }
};

export const checkNewBadges = () => {
    const currentBadges = getBadges();
    const progress = getProgress();
    const daily = getDailyProgress();
    const streak = calcStreak(daily);
    const key = getBadgesKey();

    const earned = [];

    BADGES.forEach(badge => {
        if (!currentBadges.includes(badge.id)) {
            if (badge.condition(progress, streak)) {
                earned.push(badge.id);
            }
        }
    });

    if (earned.length > 0) {
        const newBadges = [...currentBadges, ...earned];
        localStorage.setItem(key, JSON.stringify(newBadges));
        window.dispatchEvent(new Event("gamificationUpdated"));
        return earned.map(id => BADGES.find(b => b.id === id));
    }

    return [];
};

// Weekly Challenges
export const getWeeklyChallenges = () => {
    return [
        { id: 1, title: "Solve 5 Hard Problems", desc: "Master the difficult ones", target: 5, reward: 200, type: "hard_count" },
        { id: 2, title: "7-Day Streak", desc: "Consistency is key", target: 7, reward: 500, type: "streak" }
    ];
};
