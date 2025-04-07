const { GoogleSpreadsheet } = require('google-spreadsheet');
const creds = require(`../auth/${process.env.SERVICE_ACCOUNT_KEY}`); // 👈 service account key
const SHEET_ID = process.env.SHEET_ID; // 👈 Google Sheet ID

module.exports = async function appendToSheet(song) {
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