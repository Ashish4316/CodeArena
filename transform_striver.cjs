const https = require('https');
const fs = require('fs');

const sheets = [
    {
        url: 'https://node.codolio.com/api/question-tracker/v2/sheet/get-sheet-data-by-slug/striver-sde-sheet',
        output: 'src/data/striverSheet.js',
        varName: 'striverSheet'
    },
    {
        url: 'https://node.codolio.com/api/question-tracker/v2/sheet/get-sheet-data-by-slug/strivers-a2z-dsa-sheet',
        output: 'src/data/striverA2ZSheet.js',
        varName: 'striverA2ZSheet'
    }
];

sheets.forEach(sheet => {
    console.log(`Fetching data from ${sheet.url}...`);

    https.get(sheet.url, (res) => {
        let data = '';

        res.on('data', (chunk) => {
            data += chunk;
        });

        res.on('end', () => {
            try {
                const json = JSON.parse(data);
                processData(json, sheet);
            } catch (e) {
                console.error(`Error parsing JSON for ${sheet.varName}:`, e.message);
            }
        });

    }).on('error', (err) => {
        console.error(`Error fetching data for ${sheet.varName}:`, err.message);
    });
});

function processData(json, sheetConfig) {
    if (!json.data || !json.data.mappings) {
        console.error(`Invalid JSON structure for ${sheetConfig.varName}: missing data.mappings`);
        return;
    }

    const mappings = json.data.mappings;
    const groups = {};
    let qIdCounter = 1;

    mappings.forEach(m => {
        const topic = m.topic || "Uncategorized";
        if (!groups[topic]) groups[topic] = [];

        const q = m.questionId;
        if (!q) return;

        let leetcode = null;
        let gfg = null;

        // Extract links
        const url = q.problemUrl || "";
        if (url.includes('leetcode.com')) leetcode = url;
        else if (url.includes('geeksforgeeks.org') || url.includes('practice.geeksforgeeks.org')) gfg = url;

        if (!leetcode && !gfg && q.platform === 'leetcode') leetcode = url;

        // Add to group
        groups[topic].push({
            id: qIdCounter++,
            title: m.title || q.name,
            difficulty: m.difficulty || q.difficulty || "Medium",
            leetcodeLink: leetcode,
            gfgLink: gfg,
            youtubeLink: m.resource
        });
    });

    // Order groups based on appearance in mappings
    const orderedGroups = [];
    const seenTopics = new Set();
    mappings.forEach(m => {
        const t = m.topic || "Uncategorized";
        if (!seenTopics.has(t)) {
            seenTopics.add(t);
            orderedGroups.push({
                id: seenTopics.size,
                topic: t,
                questions: groups[t]
            });
        }
    });

    const content = `export const ${sheetConfig.varName} = ${JSON.stringify(orderedGroups, null, 2)};\n\nexport default ${sheetConfig.varName};`;

    fs.writeFileSync(sheetConfig.output, content);
    console.log(`Successfully wrote ${orderedGroups.length} topics and ${qIdCounter - 1} questions to ${sheetConfig.output}`);
}
