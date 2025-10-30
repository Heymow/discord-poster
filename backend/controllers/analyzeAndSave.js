const appendToSheet = require('../services/googleSheets'); // import the Google Sheets service
const { extractSunoIdFromMessage, fetchSongAnalysis } = require('../services/sunoAPI'); // import the functions related to Suno API

module.exports = async function analyzeAndSave(message) {
    // This function handles the analysis and saving of song data to Google Sheets

    // Extract the song ID from the message
    // The message is expected to be in the format: "https://suno.ai/song/<song_id>"
    const songId = extractSunoIdFromMessage(message);
    if (!songId) return console.log("❌ No song ID found.");

    // Fetch the song data from the Suno API
    const song = await fetchSongAnalysis(songId);
    if (!song || !song.title) return console.log("❌ Failed to fetch song data.");

    // Append the song data to the Google Sheet
    await appendToSheet(song);
};