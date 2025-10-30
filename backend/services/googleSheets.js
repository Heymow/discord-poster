const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');
const creds = require(`../auth/${process.env.SERVICE_ACCOUNT_KEY}`); // service account key
const SHEET_ID = process.env.SHEET_ID; // Google Sheet ID

module.exports = async function appendToSheet(song) {
    // This function appends song data to a Google Sheet using the Google Sheets API

    // Check if the song object is valid
    if (!song || !song.title) {
        console.log("❌ Invalid song data. Cannot append to sheet.");
        return;
    }
    // Check if the SHEET_ID is defined
    if (!SHEET_ID) {
        console.log("❌ SHEET_ID environment variable is not defined.");
        return;
    }
    // Check if the service account credentials are defined
    if (!creds) {
        console.log("❌ Service account credentials are not defined.");
        return;
    }
    // Check if the service account credentials are valid
    if (!creds.client_email || !creds.private_key) {
        console.log("❌ Service account credentials are invalid.");
        return;
    }

    // Authenticate using the service account credentials
    const serviceAccountAuth = new JWT({
        email: creds.client_email,
        key: creds.private_key.replace(/\\n/g, '\n'), // Ensure proper formatting of the private key
        scopes: [
            'https://www.googleapis.com/auth/spreadsheets',
        ],
    });

    // Initialize the Google Spreadsheet
    const doc = new GoogleSpreadsheet(SHEET_ID, serviceAccountAuth);

    // Load the spreadsheet information
    try {
        await doc.loadInfo();
    }
    catch (err) {
        console.error(`❌ Error loading spreadsheet: ${err.message}`);
        return;
    }

    // Access the first sheet in the spreadsheet
    const sheet = doc.sheetsByIndex[0];

    // Add a new row to the sheet
    try {
        await sheet.addRow({
            Title: song.title,
            Link: `https://suno.com/song/${song.id}`,
            Tags: song.metadata.tags,
            Prompt: song.metadata.prompt,
            Image: song.image_url,
            Video: song.video_url,
            CreatedAt: song.created_at,
        });
    }
    catch (err) {
        console.error(`❌ Error appending to sheet: ${err.message}`);
        return;
    }

    console.log(`✅ Saved song "${song.title}" to sheet.`);
}