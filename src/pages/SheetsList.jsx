import React from "react";
import { Link } from "react-router-dom";

const SheetsList = () => {
    const sheets = [
        {
            id: "striver",
            title: "Striver's SDE Sheet",
            desc: "The most popular DSA sheet. 180+ questions covering all major topics.",
            count: "180+",
            color: "bg-blue-600",
            link: "/sheet/striver"
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
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-text-primary mb-2">DSA Sheets</h1>
                    <p className="text-text-secondary max-w-2xl">
                        Select a curated sheet to start your preparation. Track your progress and analyze your consistency.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {sheets.map((sheet) => (
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
