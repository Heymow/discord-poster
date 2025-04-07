const appendToSheet = require('../services/googleSheets'); // import the Google Sheets service
const { extractSunoIdFromMessage, fetchSongAnalysis } = require('../services/sunoAPI'); // import the functions related to Suno API

module.exports = async function analyzeAndSave(message) {
    const songId = extractSunoIdFromMessage(message);
    if (!songId) return console.log("❌ No song ID found.");

    const song = await fetchSongAnalysis(songId);
    if (!song || !song.title) return console.log("❌ Failed to fetch song data.");

    await appendToSheet(song);
};