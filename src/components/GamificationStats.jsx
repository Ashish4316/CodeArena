import React, { useEffect, useState } from "react";
import { getGamificationStats, getBadges, getWeeklyChallenges, XP_VALUES } from "../utils/gamification";
import { calcStreak, getDailyProgress } from "../utils/dailyProgress";

const GamificationStats = () => {
    const [stats, setStats] = useState(getGamificationStats());
    const [badges, setBadges] = useState(getBadges());
    const [streak, setStreak] = useState(0);

    const loadData = () => {
        setStats(getGamificationStats());
        setBadges(getBadges());
        const daily = getDailyProgress();
        setStreak(calcStreak(daily));
    };

    useEffect(() => {
        loadData();
        window.addEventListener("gamificationUpdated", loadData);
        window.addEventListener("progressUpdated", loadData);
        return () => {
            window.removeEventListener("gamificationUpdated", loadData);
            window.removeEventListener("progressUpdated", loadData);
        };
    }, []);

    const challenges = getWeeklyChallenges();

    return (
        <div className="space-y-6">
            {/* Level & XP Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm relative overflow-hidden">
                {/* Background Decorative */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />

                <div className="relative z-10">
                    <div className="flex justify-between items-end mb-2">
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Current Level</p>
                            <h2 className="text-3xl font-black text-gray-900 dark:text-white">
                                Level {stats.level}
                            </h2>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-bold text-blue-600 dark:text-blue-400">
                                {stats.currentLevelXP} / {stats.xpForNextLevel} XP
                            </p>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="h-3 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-500 ease-out"
                            style={{ width: `${stats.progress}%` }}
                        />
                    </div>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                        Solve questions to earn XP and level up!
                    </p>
                </div>
            </div>

            {/* Badges Preview */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
                <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <span>🏆</span> Recent Badges
                </h3>
                {badges.length > 0 ? (
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        {badges.slice().reverse().slice(0, 5).map((badgeId) => {
                            // We need badge details, assuming we can get them or store full object.
                            // For MVP, simplified:
                            const iconMaps = {
                                "first_blood": "⚔️", "novice_coder": "🌱", "apprentice": "⚒️",
                                "streak_master": "🔥", "expert": "🦅", "hard_hitter": "💪", "array_master": "📦"
                            };
                            return (
                                <div key={badgeId} className="flex-shrink-0 w-12 h-12 bg-gray-50 dark:bg-gray-700 rounded-xl flex items-center justify-center text-2xl border border-gray-100 dark:border-gray-600" title={badgeId}>
                                    {iconMaps[badgeId] || "🏅"}
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <p className="text-sm text-gray-500 italic">No badges earned yet. Keep solving!</p>
                )}
            </div>

            {/* Weekly Challenges */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
                <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <span>⚡</span> Weekly Challenges
                </h3>
                <div className="space-y-3">
                    {challenges.map(challenge => (
                        <div key={challenge.id} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-100 dark:border-gray-700">
                            <div className="flex justify-between items-start mb-1">
                                <h4 className="font-semibold text-sm text-gray-900 dark:text-white">{challenge.title}</h4>
                                <span className="text-xs font-bold text-amber-500">+{challenge.reward} XP</span>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{challenge.desc}</p>
                            {/* Mock Progress for Challenges */}
                            <div className="h-1.5 w-full bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                                <div className="h-full bg-green-500 rounded-full w-1/3" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default GamificationStats;
