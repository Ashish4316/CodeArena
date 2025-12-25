import React, { useEffect, useState } from "react";
import { getGamificationStats, getBadges, getWeeklyChallenges } from "../utils/gamification";
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
            <div className="ui-card p-6 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-500" />

                <div className="relative z-10">
                    <div className="flex justify-between items-end mb-3">
                        <div>
                            <p className="text-xs font-bold text-text-tertiary uppercase tracking-wider mb-1">Current Level</p>
                            <h2 className="text-4xl font-black text-text-primary flex items-baseline gap-1">
                                <span className="text-blue-600 dark:text-blue-400">Lvl</span>
                                {stats.level}
                            </h2>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-black text-blue-600 dark:text-blue-400">
                                {stats.currentLevelXP} <span className="text-text-tertiary">/</span> {stats.xpForNextLevel} XP
                            </p>
                        </div>
                    </div>

                    <div className="h-2.5 w-full bg-bg-tertiary rounded-full overflow-hidden shadow-inner">
                        <div
                            className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 rounded-full transition-all duration-700 ease-out shadow-[0_0_10px_rgba(59,130,246,0.3)]"
                            style={{ width: `${stats.progress}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Weekly Challenges Preview */}
            <div className="ui-card p-6">
                <h3 className="text-sm font-bold text-text-primary mb-4 flex items-center justify-between">
                    <span>⚡ Weekly Challenges</span>
                    <span className="text-[10px] bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded uppercase">Refresh in 2d</span>
                </h3>
                <div className="space-y-4">
                    {challenges.map(challenge => (
                        <div key={challenge.id} className="group cursor-default">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h4 className="text-sm font-bold text-text-primary group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{challenge.title}</h4>
                                    <p className="text-[11px] text-text-tertiary">{challenge.desc}</p>
                                </div>
                                <span className="text-xs font-bold text-amber-500 bg-amber-50 dark:bg-amber-900/20 px-1.5 py-0.5 rounded leading-none">+{challenge.reward} XP</span>
                            </div>
                            <div className="h-1.5 w-full bg-bg-tertiary rounded-full overflow-hidden">
                                <div className="h-full bg-green-500 rounded-full w-[15%] transition-all duration-500" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default GamificationStats;
