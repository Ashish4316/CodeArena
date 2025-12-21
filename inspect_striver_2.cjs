const fs = require('fs');
const json = JSON.parse(fs.readFileSync('temp_striver_data.json', 'utf8'));
const data = json.data;

console.log("Check 1: data.sections?", !!data.sections);
console.log("Check 2: data.sheet.sections?", !!(data.sheet && data.sheet.sections));

// Mapping 0
const m = data.mappings[0];
console.log("Mapping 0 Keys:", Object.keys(m));
console.log("Question Obj:", JSON.stringify(m.questionId, null, 2));
