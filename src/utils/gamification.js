import { getProgress } from "./storage";

const GAMIFICATION_KEY = "gamification_stats";
const BADGES_KEY = "user_badges";

// XP Values
export const XP_VALUES = {
    easy: 10,
    medium: 30,
    hard: 50
};

// Level Info
export const getLevelInfo = (totalXP) => {
    let level = Math.floor(totalXP / 100) + 1;
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
        const stats = JSON.parse(localStorage.getItem(GAMIFICATION_KEY) || '{"totalXP": 0}');
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

    stats.totalXP += amount;
    localStorage.setItem(GAMIFICATION_KEY, JSON.stringify({ totalXP: stats.totalXP }));

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
    // progress structure: { "striver-sde": { "q1": true, "q2": true }, ... }
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
    { id: "apprentice", icon: "⚒️", title: "Apprentice", desc: "Solve 50 problems", condition: (p, s) => getTotalSolved(p) >= 50 },
    { id: "streak_master", icon: "🔥", title: "Streak Master", desc: "Reach a 7-day streak", condition: (p, streak) => streak >= 7 },
    { id: "expert", icon: "🦅", title: "Expert", desc: "Solve 100 problems", condition: (p, s) => getTotalSolved(p) >= 100 },
];

export const getBadges = () => {
    try {
        return JSON.parse(localStorage.getItem(BADGES_KEY) || "[]");
    } catch {
        return [];
    }
};

export const checkNewBadges = (streakCount) => {
    const currentBadges = getBadges();
    const progress = getProgress();
    const earned = [];

    BADGES.forEach(badge => {
        if (!currentBadges.includes(badge.id)) {
            if (badge.condition(progress, streakCount)) {
                earned.push(badge.id);
            }
        }
    });

    if (earned.length > 0) {
        const newBadges = [...currentBadges, ...earned];
        localStorage.setItem(BADGES_KEY, JSON.stringify(newBadges));
        window.dispatchEvent(new Event("gamificationUpdated"));
        return earned.map(id => BADGES.find(b => b.id === id));
    }

    return [];
};

// Weekly Challenges (Mock data for MVP, persisted in local storage in real app)
export const getWeeklyChallenges = () => {
    return [
        { id: 1, title: "Warmup Week", desc: "Solve 5 problems", target: 5, reward: 50, type: "count" },
        { id: 2, title: "Consistency", desc: "Reach 3-day streak", target: 3, reward: 100, type: "streak" }
    ];
};
