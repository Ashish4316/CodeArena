import React, { useEffect, useState } from "react";
import { getBadges, BADGES } from "../utils/gamification";

const Achievements = () => {
    const [earnedBadgeIds, setEarnedBadgeIds] = useState(getBadges());

    const updateBadges = () => {
        setEarnedBadgeIds(getBadges());
    };

    useEffect(() => {
        updateBadges();
        window.addEventListener("gamificationUpdated", updateBadges);
        return () => window.removeEventListener("gamificationUpdated", updateBadges);
    }, []);

    return (
        <div className="ui-card p-6 h-full">
            <h3 className="text-sm font-bold text-text-primary mb-6 flex items-center gap-2">
                <span>🏆</span> Unlockable Achievements
            </h3>

            <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
                {BADGES.map((badge) => {
                    const isEarned = earnedBadgeIds.includes(badge.id);
                    return (
                        <div
                            key={badge.id}
                            className={`
                                relative flex flex-col items-center p-3 rounded-2xl border transition-all duration-300 group
                                ${isEarned
                                    ? "bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-blue-900/20 border-blue-200 dark:border-blue-900/50 shadow-md transform hover:-translate-y-1"
                                    : "bg-gray-50 dark:bg-gray-900/40 border-gray-100 dark:border-gray-800 opacity-50 grayscale hover:grayscale-0"
                                }
                            `}
                        >
                            <div className={`
                                text-3xl mb-2 transition-transform duration-300 group-hover:scale-125
                                ${isEarned ? "drop-shadow-md" : ""}
                            `}>
                                {badge.icon}
                            </div>
                            <span className={`text-[10px] font-bold text-center leading-tight ${isEarned ? "text-blue-700 dark:text-blue-300" : "text-text-tertiary"}`}>
                                {badge.title}
                            </span>

                            {!isEarned && (
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/5 dark:bg-black/20 rounded-2xl backdrop-blur-[1px]">
                                    <div className="bg-white dark:bg-gray-800 px-2 py-1 rounded shadow-lg text-[9px] font-bold">LOCKED</div>
                                </div>
                            )}

                            {/* Tooltip */}
                            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 whitespace-nowrap shadow-xl border border-gray-700">
                                {badge.desc}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Achievements;
