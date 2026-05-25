import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { saveCustomSheet } from "../utils/customSheets";

const CreateSheet = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [questions, setQuestions] = useState([
        { title: "", link: "", difficulty: "Easy" }
    ]);

    const addQuestion = () => {
        setQuestions([...questions, { title: "", link: "", difficulty: "Easy" }]);
    };

    const removeQuestion = (index) => {
        if (questions.length === 1) return;
        const newQ = [...questions];
        newQ.splice(index, 1);
        setQuestions(newQ);
    };

    const updateQuestion = (index, field, value) => {
        const newQ = [...questions];
        newQ[index][field] = value;
        setQuestions(newQ);
    };

    const handleSave = () => {
        if (!title.trim()) {
            alert("Please enter a sheet title");
            return;
        }

        const validQuestions = questions.filter(q => q.title.trim() !== "");
        if (validQuestions.length === 0) {
            alert("Please add at least one question with a title");
            return;
        }

        // Transform to match existing data structure
        const newSheet = {
            id: "custom-" + Date.now(),
            title,
            desc,
            count: validQuestions.length,
            color: "bg-purple-600", // Default color for custom sheets
            topic: title,
            questions: validQuestions.map((q, idx) => ({
                id: idx + 1,
                title: q.title,
                difficulty: q.difficulty,
                leetcodeLink: q.link.includes('leetcode') ? q.link : null,
                gfgLink: q.link.includes('geeksforgeeks') ? q.link : null,
                youtubeLink: null, // Could add this later
                customLink: (!q.link.includes('leetcode') && !q.link.includes('geeksforgeeks')) ? q.link : null
            }))
        };

        // We need to wrap it in the structure expected by Sheet.jsx (array of topics)
        // For custom sheets, we'll treat the whole sheet as one big topic for now
        // Or we will store the raw sheet metadata and reconstruct it in Sheet.jsx
        // Let's store the metadata + data combined.

        // Actually, Sheet.jsx expects an ARRAY of topics.
        // So let's save it as:
        const sheetData = {
            id: "custom-" + Date.now(),
            title,
            desc,
            color: "bg-purple-600",
            data: [
                {
                    id: 1,
                    topic: "All Questions",
                    questions: validQuestions.map((q, idx) => ({
                        id: idx + 1,
                        title: q.title,
                        difficulty: q.difficulty,
                        leetcodeLink: q.link.includes('leetcode') ? q.link : null,
                        gfgLink: q.link.includes('geeksforgeeks') ? q.link : null,
                        customLink: (!q.link.includes('leetcode') && !q.link.includes('geeksforgeeks')) ? q.link : null
                    }))
                }
            ]
        };

        saveCustomSheet(sheetData);
        navigate("/sheets");
    };

    return (
        <div className="bg-bg-secondary min-h-[calc(100vh-3.5rem)] py-8">
            <div className="container-tight max-w-3xl">
                <h1 className="text-2xl font-bold text-text-primary mb-6">Create New Sheet</h1>

                <div className="ui-card p-6 space-y-6">
                    {/* Metadata */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1">Sheet Title</label>
                            <input
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                className="w-full px-3 py-2 bg-bg-tertiary border border-transparent focus:border-accent rounded-md text-sm outline-none"
                                placeholder="e.g., My Favorite Patterns"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1">Description</label>
                            <textarea
                                value={desc}
                                onChange={e => setDesc(e.target.value)}
                                className="w-full px-3 py-2 bg-bg-tertiary border border-transparent focus:border-accent rounded-md text-sm outline-none h-20 resize-none"
                                placeholder="Briefly describe this collection..."
                            />
                        </div>
                    </div>

                    <hr className="border-border" />

                    {/* Questions */}
                    <div>
                        <h2 className="text-lg font-bold text-text-primary mb-4">Questions</h2>
                        <div className="space-y-4">
                            {questions.map((q, idx) => (
                                <div key={idx} className="flex gap-3 items-start p-3 bg-bg-tertiary/50 rounded-lg group">
                                    <div className="flex-1 space-y-2">
                                        <div className="flex gap-2">
                                            <input
                                                value={q.title}
                                                onChange={e => updateQuestion(idx, 'title', e.target.value)}
                                                placeholder="Question Title"
                                                className="flex-1 px-3 py-1.5 bg-white dark:bg-slate-800 border border-border rounded text-sm"
                                            />
                                            <select
                                                value={q.difficulty}
                                                onChange={e => updateQuestion(idx, 'difficulty', e.target.value)}
                                                className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-border rounded text-sm w-28"
                                            >
                                                <option>Easy</option>
                                                <option>Medium</option>
                                                <option>Hard</option>
                                            </select>
                                        </div>
                                        <input
                                            value={q.link}
                                            onChange={e => updateQuestion(idx, 'link', e.target.value)}
                                            placeholder="Question Link (LeetCode, GFG, etc.)"
                                            className="w-full px-3 py-1.5 bg-white dark:bg-slate-800 border border-border rounded text-sm font-mono text-xs"
                                        />
                                    </div>
                                    <button
                                        onClick={() => removeQuestion(idx)}
                                        className="p-2 text-text-secondary hover:text-red-500 opacity-50 group-hover:opacity-100 transition-opacity"
                                        title="Remove Question"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={addQuestion}
                            className="mt-4 w-full py-2 border-2 border-dashed border-border rounded-lg text-text-secondary hover:text-accent hover:border-accent transition-colors text-sm font-medium"
                        >
                            + Add Another Question
                        </button>
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <button
                            onClick={() => navigate("/sheets")}
                            className="px-4 py-2 rounded-md text-sm font-medium text-text-secondary hover:bg-bg-tertiary transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="px-6 py-2 rounded-md text-sm font-medium bg-accent text-white hover:bg-accent-hover transition-colors shadow-sm"
                        >
                            Save Sheet
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default CreateSheet;
