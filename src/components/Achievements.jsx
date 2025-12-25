import React, { useEffect, useState } from "react";
import { getBadges, BADGES } from "../utils/gamification";

const Achievements = () => {
    const [earnedBadges, setEarnedBadges] = useState([]);

    useEffect(() => {
        setEarnedBadges(getBadges());

        // Listen for updates
        const update = () => setEarnedBadges(getBadges());
        window.addEventListener("gamificationUpdated", update);
        return () => window.removeEventListener("gamificationUpdated", update);
    }, []);

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <span>🎖️</span> Achievements
                </h2>
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {earnedBadges.length} / {BADGES.length} Unlocked
                </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {BADGES.map((badge) => {
                    const isUnlocked = earnedBadges.includes(badge.id);

                    return (
                        <div
                            key={badge.id}
                            className={`relative group p-4 rounded-xl border transition-all duration-300 ${isUnlocked
                                    ? "bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/10 dark:to-amber-900/10 border-amber-200 dark:border-amber-800/30 hover:shadow-md hover:-translate-y-1"
                                    : "bg-gray-50 dark:bg-gray-900/50 border-gray-100 dark:border-gray-800 opacity-60 grayscale hover:grayscale-0 hover:opacity-100"
                                }`}
                        >
                            <div className={`text-4xl mb-3 ${isUnlocked ? "animate-bounce-subtle" : ""}`}>
                                {badge.icon}
                            </div>
                            <h3 className={`font-bold text-sm mb-1 ${isUnlocked ? "text-gray-900 dark:text-white" : "text-gray-500 dark:text-gray-400"}`}>
                                {badge.title}
                            </h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                                {badge.desc}
                            </p>

                            {/* Lock overlay for locked badges */}
                            {!isUnlocked && (
                                <div className="absolute top-2 right-2 text-gray-300 dark:text-gray-600">
                                    🔒
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Achievements;
