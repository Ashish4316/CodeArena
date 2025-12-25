import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCustomSheets, deleteCustomSheet } from "../utils/customSheets";

const SheetsList = () => {
    const [customSheets, setCustomSheets] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setCustomSheets(getCustomSheets());
        setTimeout(() => setIsLoaded(true), 100);

        const handleUpdate = () => setCustomSheets(getCustomSheets());
        window.addEventListener("customSheetsUpdated", handleUpdate);
        return () => window.removeEventListener("customSheetsUpdated", handleUpdate);
    }, []);

    const handleDelete = (e, id) => {
        e.preventDefault();
        if (window.confirm("Are you sure you want to delete this sheet?")) {
            deleteCustomSheet(id);
        }
    };

    const staticSheets = [
        {
            id: "striver-sde",
            title: "Striver's SDE Sheet",
            desc: "The most popular DSA sheet. 190+ questions covering all major topics.",
            count: "190+",
            gradient: "from-blue-500 to-cyan-500",
            icon: "📘",
            link: "/sheet/striver-sde"
        },
        {
            id: "striver-a2z",
            title: "Striver's A2Z Sheet",
            desc: "Complete roadmap to master DSA from basics to advanced topics.",
            count: "450+",
            gradient: "from-green-500 to-emerald-500",
            icon: "🎯",
            link: "/sheet/striver-a2z"
        },
        {
            id: "lovebabbar",
            title: "Love Babbar 450",
            desc: "Comprehensive list of 450 questions for in-depth practice.",
            count: "450+",
            gradient: "from-rose-500 to-pink-500",
            icon: "💝",
            link: "/sheet/love-babbar"
        },
        {
            id: "faang",
            title: "FAANG Company Sets",
            desc: "Targeted questions asked in Amazon, Google, Microsoft, etc.",
            count: "500+",
            gradient: "from-amber-500 to-orange-500",
            icon: "🏢",
            link: "/company/faang"
        }
    ];

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50/50 to-indigo-100 dark:from-gray-900/40 dark:via-slate-900/20 dark:to-indigo-900/20 relative overflow-hidden">
            {/* Animated Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 -left-32 w-96 h-96 bg-blue-400/20 dark:bg-blue-600/10 rounded-full blur-3xl animate-float" />
                <div className="absolute top-1/3 -right-32 w-[500px] h-[500px] bg-purple-400/20 dark:bg-purple-600/10 rounded-full blur-3xl animate-float-delayed" />
                <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-pink-400/15 dark:bg-pink-600/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Header */}
                <div className={`mb-12 transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'}`}>
                    <div className="text-center max-w-3xl mx-auto">
                        <h1 className="text-4xl md:text-5xl font-black bg-linear-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent mb-4">
                            DSA Sheets Collection
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-400">
                            Select a curated sheet to start your preparation. Track your progress and build consistency.
                        </p>
                    </div>
                </div>

                {/* Sheets Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Create New Card */}
                    <Link
                        to="/sheets/create"
                        className={`group relative bg-white/70 dark:bg-gray-900/20 backdrop-blur-2xl rounded-2xl p-8 shadow-lg border border-white/20 dark:border-gray-700/20 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-purple-300/8 hover:-translate-y-2 min-h-[280px] flex flex-col items-center justify-center ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                        style={{ transitionDelay: '0ms' }}
                    >
                        {/* Gradient border effect */}
                        <div className="absolute inset-0 rounded-2xl bg-linear-to-r from-blue-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-blue-500/12 group-hover:via-purple-500/12 group-hover:to-pink-500/12 transition-all duration-500 pointer-events-none" />

                        <div className="relative z-10 text-center">
                            <div className="w-20 h-20 rounded-2xl bg-linear-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-4xl font-bold shadow-md mb-6 group-hover:scale-105 group-hover:rotate-2 transition-all duration-300 mx-auto">
                                +
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-transparent group-hover:bg-linear-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all">
                                Create Custom Sheet
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                Build your own collection of questions
                            </p>
                        </div>
                    </Link>

                    {/* Custom Sheets */}
                    {customSheets.map((sheet, idx) => (
                        <Link
                            key={sheet.id}
                            to={`/sheet/${sheet.id}`}
                            className={`group relative bg-white/75 dark:bg-gray-900/18 backdrop-blur-2xl rounded-2xl p-6 shadow-md border border-white/20 dark:border-gray-700/16 overflow-hidden transition-all duration-500 hover:shadow-lg hover:shadow-purple-300/8 hover:-translate-y-2 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                            style={{ transitionDelay: `${(idx + 1) * 80}ms` }}
                        >
                            {/* Delete button */}
                            <button
                                onClick={(e) => handleDelete(e, sheet.id)}
                                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg opacity-0 group-hover:opacity-100 transition-all z-10"
                                title="Delete Sheet"
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M3 6h18" />
                                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                </svg>
                            </button>

                            {/* Gradient border effect */}
                            <div className="absolute inset-0 rounded-2xl bg-linear-to-r from-purple-500/0 via-pink-500/0 to-purple-500/0 group-hover:from-${sheet.gradient.replace('from-', '')}/12 group-hover:via-${sheet.gradient.replace('to-', '')}/12 group-hover:to-${sheet.gradient.replace('to-', '')}/12 transition-all duration-500 pointer-events-none" />

                            <div className="relative z-10">
                                {/* Header */}
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`w-14 h-14 rounded-xl bg-linear-to-br ${sheet.gradient || "from-purple-500 to-pink-500"} flex items-center justify-center text-white text-2xl font-semibold shadow-md group-hover:scale-105 group-hover:rotate-2 transition-all duration-300`}>
                                        {sheet.icon || sheet.title.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="px-3 py-1.5 bg-white/90 rounded-full text-xs font-semibold text-gray-700 dark:text-gray-300">
                                        {sheet.count} Qs
                                    </span>
                                </div>

                                {/* Content */}
                                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-200">
                                    {sheet.title}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-4 line-clamp-2">
                                    {sheet.desc || "No description provided."}
                                </p>

                                {/* CTA */}
                                <div className="flex items-center gap-2 text-sm font-semibold text-purple-600 dark:text-purple-400 opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-x-2 group-hover:translate-x-0">
                                    <span>Start Solving</span>
                                    <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </div>
                            </div>
                        </Link>
                    ))}

                    {/* Static Sheets */}
                    {staticSheets.map((sheet, idx) => (
                        <Link
                            key={sheet.id}
                            to={sheet.link}
                            className={`group relative bg-white/75 dark:bg-gray-900/18 backdrop-blur-2xl rounded-2xl p-6 shadow-md border border-white/20 dark:border-gray-700/16 overflow-hidden transition-all duration-500 hover:shadow-lg hover:shadow-purple-300/8 hover:-translate-y-2 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                            style={{ transitionDelay: `${(customSheets.length + idx + 1) * 80}ms` }}
                        >
                            {/* Gradient border effect */}
                            <div className={`absolute inset-0 rounded-2xl bg-linear-to-r from-purple-500/0 via-pink-500/0 to-purple-500/0 group-hover:from-${sheet.gradient.replace('from-', '')}/12 group-hover:via-${sheet.gradient.replace('to-', '')}/12 group-hover:to-${sheet.gradient.replace('to-', '')}/12 transition-all duration-500 pointer-events-none`} />

                            <div className="relative z-10">
                                {/* Header */}
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`w-14 h-14 rounded-xl bg-linear-to-br ${sheet.gradient} flex items-center justify-center text-white text-2xl shadow-md group-hover:scale-105 group-hover:rotate-2 transition-all duration-300`}>
                                        {sheet.icon}
                                    </div>
                                    <span className="px-3 py-1.5 bg-white/90 rounded-full text-xs font-semibold text-gray-700 dark:text-gray-300">
                                        {sheet.count} Qs
                                    </span>
                                </div>

                                {/* Content */}
                                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-200">
                                    {sheet.title}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                                    {sheet.desc}
                                </p>

                                {/* CTA */}
                                <div className={`flex items-center gap-2 text-sm font-semibold bg-linear-to-r ${sheet.gradient} bg-clip-text text-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-x-2 group-hover:translate-x-0`}>
                                    <span>Start Solving</span>
                                    <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M13 7l5 5m0 0l-5 5m5-5H6" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
                                    </svg>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Animations */}
            <style jsx>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0) rotate(0deg); }
                    50% { transform: translateY(-20px) rotate(3deg); }
                }
                @keyframes float-delayed {
                    0%, 100% { transform: translateY(0) rotate(0deg); }
                    50% { transform: translateY(-15px) rotate(-3deg); }
                }
                .animate-float {
                    animation: float 8s ease-in-out infinite;
                }
                .animate-float-delayed {
                    animation: float-delayed 10s ease-in-out infinite;
                    animation-delay: 1s;
                }
            `}</style>
        </div>
    );
};

export default SheetsList;
