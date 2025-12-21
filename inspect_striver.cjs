const fs = require('fs');
const json = JSON.parse(fs.readFileSync('temp_striver_data.json', 'utf8'));
const data = json.data;

console.log("Sheet Keys:", Object.keys(data.sheet));
if (data.sheet.sections) {
    console.log("Sheet Sections:", JSON.stringify(data.sheet.sections, null, 2).slice(0, 500));
} else {
    console.log("No sections in sheet object.");
}

if (data.mappings && data.mappings.length > 0) {
    console.log("Sample Mapping:", JSON.stringify(data.mappings[0], null, 2));
    // Check if mappings have section info
}
