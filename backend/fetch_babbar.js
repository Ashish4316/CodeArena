import fs from 'fs';

async function generateSheet() {
    console.log("Fetching Love Babbar 450 DSA Sheet...");
    try {
        const res = await fetch('https://raw.githubusercontent.com/MohitSutharOfficial/DSA-450-Cracker/main/450DSA.json');
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        const rawQuestions = data.Sheet1 || [];

        const topicsMap = new Map();
        let qId = 1;

        for (const item of rawQuestions) {
            const topicName = item["Topic:"]?.trim();
            const title = item["Problem: "]?.trim();
            const url = item["URL"]?.trim() || "";
            
            if (!topicName || !title) continue;

            if (!topicsMap.has(topicName)) {
                topicsMap.set(topicName, []);
            }

            // Simple difficulty estimator based on typical keywords (not perfect, but better than nothing)
            let difficulty = "Medium";
            const lowerTitle = title.toLowerCase();
            if (lowerTitle.includes("reverse") || lowerTitle.includes("minimum") || lowerTitle.includes("maximum") || lowerTitle.includes("sort an array of 0s")) difficulty = "Easy";
            if (lowerTitle.includes("median") || lowerTitle.includes("hard") || lowerTitle.includes("n queen") || lowerTitle.includes("sudoku")) difficulty = "Hard";

            topicsMap.get(topicName).push({
                id: qId++,
                title: title,
                difficulty: difficulty,
                gfgLink: url.includes("geeksforgeeks") ? url : undefined,
                leetcodeLink: url.includes("leetcode") ? url : undefined,
                otherLink: (!url.includes("geeksforgeeks") && !url.includes("leetcode")) ? url : undefined
            });
        }

        const formattedSheet = [];
        let tId = 1;
        for (const [topic, questions] of topicsMap.entries()) {
            formattedSheet.push({
                id: tId++,
                topic: topic,
                questions: questions
            });
        }

        const fileContent = `export const loveBabberSheet = ${JSON.stringify(formattedSheet, null, 2)};\n\nexport default loveBabberSheet;\n`;
        fs.writeFileSync('data/loveBabberSheet.js', fileContent);
        
        console.log(`Successfully parsed ${qId - 1} questions across ${tId - 1} topics.`);
        console.log("Written to data/loveBabberSheet.js");
    } catch (e) {
        console.error("Error:", e);
    }
}

generateSheet();
