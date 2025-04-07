const { GoogleSpreadsheet } = require('google-spreadsheet');
const creds = require(`./${process.env.SERVICE_ACCOUNT_KEY}`); // 👈 service account key
const SHEET_ID = process.env.SHEET_ID; // 👈 Google Sheet ID

function extractSunoIdFromMessage(message) {
    const match = message.match(/suno\.com\/song\/([a-f0-9\-]{36})/i);
    return match ? match[1] : null;
}

async function fetchSongAnalysis(songId) {
    const url = `${process.env.SUNOAPI_URL}${songId}`;
    const res = await fetch(url);
    return await res.json();
}

async function appendToSheet(song) {
    const doc = new GoogleSpreadsheet(SHEET_ID);
    await doc.useServiceAccountAuth({
        client_email: creds.client_email,
        private_key: creds.private_key.replace(/\\n/g, '\n')
    });

    await doc.loadInfo();

    const sheet = doc.sheetsByIndex[0];

    await sheet.addRow({
        Title: song.title,
        Link: `https://suno.com/song/${song.id}`,
        Tags: song.metadata.tags,
        Prompt: song.metadata.prompt,
        Image: song.image_url,
        Video: song.video_url,
        CreatedAt: song.created_at,
    });

    console.log(`✅ Saved song "${song.title}" to sheet.`);
}

module.exports = async function analyzeAndSave(message) {
    const songId = extractSunoIdFromMessage(message);
    if (!songId) return console.log("❌ No song ID found.");

    const song = await fetchSongAnalysis(songId);
    if (!song || !song.title) return console.log("❌ Failed to fetch song data.");

    await appendToSheet(song);
};