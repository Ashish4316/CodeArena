import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getUserProfile } from "../utils/userProfile";
import { fetchLeetCodeStats, getPlatformUrls } from "../utils/portfolioApi";

const Portfolio = () => {
    const { currentUser } = useAuth();
    const [profile, setProfile] = useState(null);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadPortfolioData = async () => {
            try {
                if (currentUser?.uid) {
                    const userProfile = await getUserProfile(currentUser.uid);
                    setProfile(userProfile);

                    if (userProfile?.leetcode) {
                        const lcStats = await fetchLeetCodeStats(userProfile.leetcode);
                        if (lcStats.status === "success") {
                            setStats(lcStats);
                        }
                    }
                }
            } catch (err) {
                console.error("Error loading portfolio:", err);
                setError("Failed to load portfolio data.");
            } finally {
                setLoading(false);
            }
        };

        loadPortfolioData();
    }, [currentUser]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Building your portfolio...</p>
                </div>
            </div>
        );
    }

    const platforms = profile ? getPlatformUrls(profile) : {};

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-950 dark:via-slate-900 dark:to-indigo-950 py-12 px-6 relative overflow-hidden">
            {/* Background Animated Effects */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-blue-400/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-1/4 -right-20 w-[500px] h-[500px] bg-purple-400/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header Section */}
                <div className="mb-12 flex flex-col md:flex-row items-center justify-between gap-8 animate-fadeIn">
                    <div className="flex items-center gap-8">
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
                            <div className="relative w-32 h-32 rounded-3xl bg-gray-900 flex items-center justify-center text-white text-5xl font-bold border border-white/10 overflow-hidden shadow-2xl">
                                {currentUser.email ? currentUser.email[0].toUpperCase() : "U"}
                                <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-purple-500/20" />
                            </div>
                        </div>
                        <div>
                            <h1 className="text-5xl font-black bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-100 dark:to-purple-100 bg-clip-text text-transparent mb-2">
                                {profile?.name || "Anonymous Coder"}
                            </h1>
                            <p className="text-xl text-gray-600 dark:text-gray-400 font-medium">
                                Full Stack Developer & Competitive Programmer
                            </p>
                            <div className="flex gap-3 mt-4">
                                {platforms.github && (
                                    <a href={platforms.github} target="_blank" rel="noopener noreferrer" className="p-2 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:scale-110 transition-transform">🐙</a>
                                )}
                                {platforms.leetcode && (
                                    <a href={platforms.leetcode} target="_blank" rel="noopener noreferrer" className="p-2 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:scale-110 transition-transform">👤</a>
                                )}
                                {platforms.codeforces && (
                                    <a href={platforms.codeforces} target="_blank" rel="noopener noreferrer" className="p-2 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:scale-110 transition-transform">📊</a>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <Link to="/profile" className="px-6 py-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md text-gray-700 dark:text-white font-bold rounded-2xl border border-white/20 dark:border-gray-700 shadow-xl hover:bg-white dark:hover:bg-gray-700 transition-all">
                            Update Profile 👤
                        </Link>
                        <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-2xl shadow-xl shadow-blue-500/20 hover:scale-105 active:scale-95 transition-all">
                            Share Portfolio 🔗
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                    {/* Main LeetCode Stats */}
                    <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <StatsCard
                            title="Total Solved"
                            value={stats?.totalSolved || 0}
                            subtitle={`out of ${stats?.totalQuestions || 0}`}
                            icon="🎯"
                            gradient="from-blue-600 to-blue-400"
                            delay="0.1s"
                        />
                        <StatsCard
                            title="Acceptance Rate"
                            value={`${stats?.acceptanceRate || 0}%`}
                            subtitle="Efficiency"
                            icon="🔥"
                            gradient="from-amber-600 to-amber-400"
                            delay="0.2s"
                        />
                        <StatsCard
                            title="Global Ranking"
                            value={stats?.ranking ? stats.ranking.toLocaleString() : "N/A"}
                            subtitle="Worldwide"
                            icon="🌍"
                            gradient="from-purple-600 to-purple-400"
                            delay="0.3s"
                        />

                        {/* Difficulty Breakdown */}
                        <div className="md:col-span-3 bg-white/60 dark:bg-gray-900/60 backdrop-blur-2xl p-8 rounded-[2rem] border border-white/20 dark:border-gray-800 shadow-2xl animate-fadeIn" style={{ animationDelay: '0.4s' }}>
                            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                                <span className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl">🧩</span>
                                Difficulty Breakdown
                            </h2>
                            <div className="space-y-8">
                                <DifficultyBar
                                    label="Easy"
                                    solved={stats?.easySolved || 0}
                                    total={stats ? Math.round(stats.totalQuestions * 0.25) : 0}
                                    color="bg-emerald-500"
                                />
                                <DifficultyBar
                                    label="Medium"
                                    solved={stats?.mediumSolved || 0}
                                    total={stats ? Math.round(stats.totalQuestions * 0.5) : 0}
                                    color="bg-amber-500"
                                />
                                <DifficultyBar
                                    label="Hard"
                                    solved={stats?.hardSolved || 0}
                                    total={stats ? Math.round(stats.totalQuestions * 0.25) : 0}
                                    color="bg-rose-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Side Info Cards */}
                    <div className="space-y-8">
                        <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-[2rem] text-white shadow-2xl relative overflow-hidden group animate-fadeIn" style={{ animationDelay: '0.5s' }}>
                            <div className="absolute top-0 right-0 p-8 opacity-10 text-8xl transition-transform group-hover:scale-110 group-hover:rotate-12">🏆</div>
                            <h3 className="text-xl font-bold mb-2">Contest Rating</h3>
                            <p className="text-4xl font-black mb-4">Coming Soon</p>
                            <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                                <div className="w-1/2 h-full bg-gradient-to-r from-blue-400 to-purple-400 animate-pulse" />
                            </div>
                            <p className="mt-4 text-gray-400 text-sm italic">Aggregate ratings across all platforms</p>
                        </div>

                        <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-2xl p-8 rounded-[2rem] border border-white/20 dark:border-gray-800 shadow-2xl animate-fadeIn" style={{ animationDelay: '0.6s' }}>
                            <h3 className="text-xl font-bold mb-6">Social Proof</h3>
                            <div className="space-y-4">
                                <SocialProofItem label="GitHub Stars" value="42" icon="⭐" />
                                <SocialProofItem label="Contributions" value={stats?.contributionPoints || 0} icon="✨" />
                                <SocialProofItem label="Reputation" value={stats?.reputation || 0} icon="🤝" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Platform Integration Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-fadeIn" style={{ animationDelay: '0.7s' }}>
                    <PlatformIntegrationCard name="LeetCode" icon="⚡" status={profile?.leetcode ? "Connected" : "Not Linked"} color="border-amber-400/30" />
                    <PlatformIntegrationCard name="GitHub" icon="🐙" status={profile?.github ? "Connected" : "Not Linked"} color="border-gray-400/30" />
                    <PlatformIntegrationCard name="CodeForces" icon="📉" status={profile?.codeforces ? "Connected" : "Not Linked"} color="border-blue-400/30" />
                    <PlatformIntegrationCard name="Codolio" icon="💼" status={profile?.codolio ? "Connected" : "Not Linked"} color="border-purple-400/30" />
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out forwards;
        }
      `}} />
        </div>
    );
};

/* ===== SUB-COMPONENTS ===== */

const StatsCard = ({ title, value, subtitle, icon, gradient, delay }) => (
    <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-2xl p-8 rounded-[2rem] border border-white/20 dark:border-gray-800 shadow-2xl group hover:scale-[1.02] transition-all duration-300 animate-fadeIn" style={{ animationDelay: delay }}>
        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white text-2xl shadow-lg mb-6 group-hover:rotate-6 transition-transform`}>
            {icon}
        </div>
        <h3 className="text-gray-500 dark:text-gray-400 font-semibold mb-1 uppercase tracking-wider text-sm">{title}</h3>
        <p className="text-4xl font-black text-gray-900 dark:text-white mb-2">{value}</p>
        <p className="text-gray-400 dark:text-gray-500 text-sm font-medium">{subtitle}</p>
    </div>
);

const DifficultyBar = ({ label, solved, total, color }) => {
    const percentage = Math.min(100, Math.round((solved / total) * 100)) || 0;
    return (
        <div>
            <div className="flex justify-between items-end mb-3">
                <div>
                    <span className="text-sm font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">{label}</span>
                    <p className="text-xl font-black text-gray-900 dark:text-white mt-1">{solved} <span className="text-gray-400 font-medium text-sm">/ {total}</span></p>
                </div>
                <span className="text-xl font-black text-gray-900 dark:text-white">{percentage}%</span>
            </div>
            <div className="w-full h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden shadow-inner">
                <div
                    className={`h-full ${color} rounded-full transition-all duration-1000 ease-out shadow-lg`}
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
};

const SocialProofItem = ({ label, value, icon }) => (
    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700/50">
        <div className="flex items-center gap-3">
            <span className="text-xl">{icon}</span>
            <span className="font-semibold text-gray-700 dark:text-gray-300">{label}</span>
        </div>
        <span className="font-black text-blue-600 dark:text-blue-400 text-lg">{value}</span>
    </div>
);

const PlatformIntegrationCard = ({ name, icon, status, color }) => (
    <div className={`p-6 bg-white/40 dark:bg-gray-900/40 backdrop-blur-md rounded-2xl border ${color} flex items-center gap-4 group hover:bg-white dark:hover:bg-gray-800 transition-all`}>
        <div className="text-3xl group-hover:scale-110 transition-transform">{icon}</div>
        <div>
            <h4 className="font-bold text-gray-900 dark:text-white">{name}</h4>
            <p className={`text-xs font-semibold ${status === "Connected" ? "text-emerald-500" : "text-gray-400 uppercase"}`}>
                {status}
            </p>
        </div>
    </div>
);

export default Portfolio;
