const express = require("express");
const router = express.Router();
const analyzeAndSave = require("../controllers/analyzeAndSave");

router.post('/save', async (req, res) => {
    // This function handles the analysis and saving of song data to Google Sheets
    // It extracts the song ID from the message, fetches the song data from the Suno API,and appends the data to a Google Sheet.
    console.log("🚀 Google Forms trigger received");
    const message = req.body.message || undefined;

    try {
        await analyzeAndSave(message);
        res.send("✅ Song saved successfully to Google Forms!");
    } catch (err) {
        console.error(`❌ Error: ${err}`);
        res.status(500).send("Error running Discord posting script.");
    }
});

module.exports = router;