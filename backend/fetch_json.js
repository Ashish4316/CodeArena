import fs from 'fs';

async function tryFetch() {
    const urls = [
        "https://raw.githubusercontent.com/AsishRaju/450-DSA/master/src/data/450DSA.json",
        "https://raw.githubusercontent.com/sahilrajput03/DSA-450/main/450.json",
        "https://raw.githubusercontent.com/mananSoni47/Love-Babbar-450-DSA-Tracker/master/src/data/data.json",
        "https://raw.githubusercontent.com/xypnox/450DSA/master/src/data/data.json"
    ];
    
    for (const url of urls) {
        try {
            console.log("Trying", url);
            const res = await fetch(url);
            if (res.ok) {
                const text = await res.text();
                fs.writeFileSync('temp_450.json', text);
                console.log("Success with", url, "Length:", text.length);
                return;
            }
        } catch (e) {}
    }
    console.log("None worked");
}
tryFetch();
