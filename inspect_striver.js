const fs = require('fs');
try {
    const raw = fs.readFileSync('temp_striver_data.json', 'utf8');
    const json = JSON.parse(raw);

    console.log("Root keys:", Object.keys(json));

    // Navigate usually: json.body or json.data
    const root = json.body || json.data || json;

    if (Array.isArray(root)) {
        console.log("Root is Array length:", root.length);
        console.log("Item 0 keys:", Object.keys(root[0]));
    } else {
        console.log("Root body keys:", Object.keys(root));
        // Check for common sheet fields
        if (root.topics) console.log("Found topics array length:", root.topics.length);
        if (root.sheetData) console.log("Found sheetData array length:", root.sheetData.length);

        // Recursively find "questions"
        function findQuestions(obj, path = "") {
            if (!obj || typeof obj !== 'object') return;
            if (Array.isArray(obj)) {
                if (obj.length > 0 && obj[0].title && obj[0].url) { // Candidate for question
                    console.log(`Found questions at ${path} (Length: ${obj.length})`);
                    console.log("Sample Question:", JSON.stringify(obj[0], null, 2));
                    return;
                }
                obj.forEach((item, i) => findQuestions(item, `${path}[${i}]`));
            } else {
                Object.keys(obj).forEach(k => findQuestions(obj[k], `${path}.${k}`));
            }
        }

        // Limit depth search to avoid span
        // Let's just dump specific fields if we find them
    }

    // Let's just log the first level deep structure of 'body'
    console.log("Structure dump:", JSON.stringify(root, (k, v) => {
        if (k === 'questions' || k === 'topics') return `[Array(${v.length})]`;
        if (typeof v === 'string' && v.length > 100) return v.slice(0, 50) + '...';
        return v;
    }, 2).slice(0, 2000));

} catch (e) {
    console.error(e);
}
