import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getUserProfile, updateUserProfile } from "../utils/userProfile";

const Profile = () => {
    const { currentUser } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });
    const [handles, setHandles] = useState({
        leetcode: "",
        github: "",
        codeforces: "",
        codolio: "",
        name: "",
    });

    useEffect(() => {
        const loadProfile = async () => {
            if (currentUser?.uid) {
                const profile = await getUserProfile(currentUser.uid);
                if (profile) {
                    setHandles({
                        leetcode: profile.leetcode || "",
                        github: profile.github || "",
                        codeforces: profile.codeforces || "",
                        codolio: profile.codolio || "",
                        name: profile.name || "",
                    });
                }
            }
            setLoading(false);
        };
        loadProfile();
    }, [currentUser]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage({ type: "", text: "" });

        const success = await updateUserProfile(currentUser.uid, handles);

        if (success) {
            setMessage({ type: "success", text: "Profile updated successfully! ✨" });
        } else {
            setMessage({ type: "error", text: "Failed to update profile. Please try again." });
        }
        setSaving(false);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-950 dark:via-slate-900 dark:to-indigo-950 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute top-1/4 -left-20 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-purple-400/10 rounded-full blur-3xl animate-pulse" />
            </div>

            <div className="max-w-3xl mx-auto relative z-10">
                <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-800 p-8 sm:p-10">
                    <div className="flex items-center gap-6 mb-10">
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                            {currentUser.email ? currentUser.email[0].toUpperCase() : "U"}
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">Your Profile</h1>
                            <p className="text-gray-500 dark:text-gray-400">{currentUser.email}</p>
                        </div>
                    </div>

                    {message.text && (
                        <div className={`mb-8 p-4 rounded-xl text-sm font-medium ${message.type === "success"
                                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
                                : "bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-400 border border-rose-200 dark:border-rose-800"
                            }`}>
                            {message.text}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">Display Name</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                                    placeholder="Your name"
                                    value={handles.name}
                                    onChange={(e) => setHandles({ ...handles, name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">LeetCode Username</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">👤</span>
                                    <input
                                        type="text"
                                        className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                                        placeholder="leetcode_user"
                                        value={handles.leetcode}
                                        onChange={(e) => setHandles({ ...handles, leetcode: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">GitHub Username</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🐙</span>
                                    <input
                                        type="text"
                                        className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                                        placeholder="github_user"
                                        value={handles.github}
                                        onChange={(e) => setHandles({ ...handles, github: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">CodeForces Handle</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">📊</span>
                                    <input
                                        type="text"
                                        className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                                        placeholder="cf_handle"
                                        value={handles.codeforces}
                                        onChange={(e) => setHandles({ ...handles, codeforces: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">Codolio Profile</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">💼</span>
                                    <input
                                        type="text"
                                        className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                                        placeholder="codolio_id"
                                        value={handles.codolio}
                                        onChange={(e) => setHandles({ ...handles, codolio: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-6">
                            <button
                                type="submit"
                                disabled={saving}
                                className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-2xl shadow-xl hover:shadow-blue-500/20 hover:scale-[1.02] active:scale-95 transition-all duration-300 disabled:opacity-50"
                            >
                                {saving ? "Updating Profile..." : "Save Changes ✨"}
                            </button>
                        </div>
                    </form>

                    <div className="mt-12 p-6 bg-blue-50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-800/30">
                        <h3 className="font-bold text-blue-900 dark:text-blue-200 mb-2 flex items-center gap-2">
                            <span>💡</span> Tip
                        </h3>
                        <p className="text-sm text-blue-700 dark:text-blue-300 leading-relaxed">
                            Adding your handles allows CodeArena to generate your personal coding portfolio and track your achievements across different platforms.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
