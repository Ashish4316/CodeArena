import fs from 'fs';
import path from 'path';

// Parse a single CSV line robustly
function csvParseLine(text) {
    const result = [];
    let cur = "";
    let inQuotes = false;
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        if (inQuotes) {
            if (char === '"') {
                if (i < text.length - 1 && text[i + 1] === '"') {
                    cur += '"';
                    i++;
                } else {
                    inQuotes = false;
                }
            } else {
                cur += char;
            }
        } else {
            if (char === '"') {
                inQuotes = true;
            } else if (char === ',') {
                result.push(cur);
                cur = "";
            } else {
                cur += char;
            }
        }
    }
    result.push(cur);
    return result;
}

const companies = ["Meta", "Amazon", "Apple", "Netflix", "Google", "Microsoft"];
const baseDir = "C:\\Users\\ASHISH KUMAR YADAV\\CodeArena\\interview-company-wise-problems";

const topics = [];

for (const company of companies) {
    const csvPath = path.join(baseDir, company, "5. All.csv");
    if (!fs.existsSync(csvPath)) {
        console.warn(`CSV not found for ${company}: ${csvPath}`);
        continue;
    }

    const content = fs.readFileSync(csvPath, 'utf8');
    const lines = content.split(/\r?\n/).filter(line => line.trim() !== "");
    
    // Header is usually: Difficulty,Title,Frequency,Acceptance Rate,URL,Tags
    const questions = [];
    
    // Skip header line
    for (let i = 1; i < lines.length; i++) {
        const parts = csvParseLine(lines[i]);
        if (parts.length < 5) continue; // skip bad lines
        
        const difficulty = parts[0];
        const title = parts[1];
        const url = parts[4];
        
        // Sometimes URLs might be missing
        if (!url || !url.startsWith("http")) continue;
        
        const diffMap = { "EASY": "Easy", "MEDIUM": "Medium", "HARD": "Hard" };
        
        questions.push({
            customId: `${company.toLowerCase()}-${i}`,
            title: title,
            difficulty: diffMap[difficulty.toUpperCase()] || "Medium",
            leetcodeLink: url
        });
        
        if (questions.length >= 100) break; // cap at top 100 per company
    }
    
    topics.push({
        topic: company,
        questions: questions
    });
    console.log(`Processed ${questions.length} questions for ${company}`);
}

const finalData = {
    slug: "faang-sheet",
    name: "FAANG Interview Sheet",
    topics: topics
};

const outputContent = `// Automatically generated from the interview-company-wise-problems dataset
export const faangSheet = ${JSON.stringify(finalData, null, 2)};
`;

fs.writeFileSync(path.join(process.cwd(), "data", "faangSheet.js"), outputContent, 'utf8');

console.log("Successfully generated backend/data/faangSheet.js");
