
module.exports = async function analyzeAndSave(message) {
    const analyzeAndSave = require("../controllers/analyzeAndSave"); // Import the analyzeAndSave function from the controller
    // This function handles the analysis and saving of song data to Google Sheets
    // It extracts the song ID from the message, fetches the song data from the Suno API,and appends the data to a Google Sheet.
    // It also handles errors and logs them to the console.

    try {
        await analyzeAndSave(message); // Call the analyzeAndSave function with the message
        console.log("✅ Song posted successfully!");
        res.send("✅ Song posted successfully!");
    } catch (error) {
        console.error(`❌ Error: ${error}`);
        res.status(500).send("Error processing request.");
    }
};