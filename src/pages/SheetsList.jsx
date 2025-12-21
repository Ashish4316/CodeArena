import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCustomSheets, deleteCustomSheet } from "../utils/customSheets";

const SheetsList = () => {
    const [customSheets, setCustomSheets] = useState([]);

    useEffect(() => {
        setCustomSheets(getCustomSheets());

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
            color: "bg-blue-600",
            link: "/sheet/striver-sde"
        },
        {
            id: "striver-a2z",
            title: "Striver's A2Z Sheet",
            desc: "Complete roadmap to master DSA from basics to advanced topics.",
            count: "450+",
            color: "bg-green-600",
            link: "/sheet/striver-a2z"
        },
        {
            id: "lovebabbar",
            title: "Love Babbar 450",
            desc: "Comprehensive list of 450 questions for in-depth practice.",
            count: "450+",
            color: "bg-rose-600",
            link: "/sheet/love-babbar"
        },
        {
            id: "faang",
            title: "FAANG Company Sets",
            desc: "Targeted questions asked in Amazon, Google, Microsoft, etc.",
            count: "500+",
            color: "bg-amber-600",
            link: "/company/faang"
        }
    ];

    return (
        <div className="bg-bg-secondary min-h-[calc(100vh-3.5rem)] py-8">
            <div className="container-tight">
                <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-text-primary mb-2">DSA Sheets</h1>
                        <p className="text-text-secondary max-w-2xl">
                            Select a curated sheet to start your preparation. Track your progress and analyze your consistency.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {/* Create New Card */}
                    <Link
                        to="/sheets/create"
                        className="ui-card p-5 group hover:-translate-y-1 flex flex-col items-center justify-center text-center border-2 border-dashed border-border hover:border-accent transition-all min-h-[220px]"
                    >
                        <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent text-2xl font-bold mb-3 group-hover:scale-110 transition-transform">
                            +
                        </div>
                        <h3 className="text-lg font-bold text-text-primary mb-1 group-hover:text-accent transition-colors">
                            Create Custom Sheet
                        </h3>
                        <p className="text-sm text-text-secondary">
                            Build your own collection of questions
                        </p>
                    </Link>

                    {/* Custom Sheets */}
                    {customSheets.map((sheet) => (
                        <Link
                            key={sheet.id}
                            to={`/sheet/${sheet.id}`}
                            className="ui-card p-5 group hover:-translate-y-1 block relative"
                        >
                            <button
                                onClick={(e) => handleDelete(e, sheet.id)}
                                className="absolute top-3 right-3 p-1.5 text-text-secondary hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                title="Delete Sheet"
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
                            </button>

                            <div className="flex justify-between items-start mb-4">
                                <div className={`w-10 h-10 rounded-lg ${sheet.color || "bg-purple-600"} flex items-center justify-center text-white text-lg font-bold shadow-sm`}>
                                    {sheet.title.charAt(0).toUpperCase()}
                                </div>
                                <span className="px-2 py-1 bg-bg-tertiary rounded text-xs font-semibold text-text-secondary">
                                    {sheet.count} Qs
                                </span>
                            </div>

                            <h3 className="text-lg font-bold text-text-primary mb-2 group-hover:text-accent transition-colors">
                                {sheet.title}
                            </h3>
                            <p className="text-sm text-text-secondary leading-relaxed mb-4 line-clamp-2">
                                {sheet.desc || "No description provided."}
                            </p>

                            <div className="text-sm font-medium text-accent flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 duration-300">
                                Start Solving <span>→</span>
                            </div>
                        </Link>
                    ))}

                    {/* Static Sheets */}
                    {staticSheets.map((sheet) => (
                        <Link
                            key={sheet.id}
                            to={sheet.link}
                            className="ui-card p-5 group hover:-translate-y-1 block"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className={`w-10 h-10 rounded-lg ${sheet.color} flex items-center justify-center text-white text-lg font-bold shadow-sm`}>
                                    {sheet.title.charAt(0)}
                                </div>
                                <span className="px-2 py-1 bg-bg-tertiary rounded text-xs font-semibold text-text-secondary">
                                    {sheet.count} Qs
                                </span>
                            </div>

                            <h3 className="text-lg font-bold text-text-primary mb-2 group-hover:text-accent transition-colors">
                                {sheet.title}
                            </h3>
                            <p className="text-sm text-text-secondary leading-relaxed mb-4">
                                {sheet.desc}
                            </p>

                            <div className="text-sm font-medium text-accent flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 duration-300">
                                Start Solving <span>→</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SheetsList;
