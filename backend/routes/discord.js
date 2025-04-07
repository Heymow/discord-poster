
module.exports = async function discordPost(message) {
    const postToDiscordChannels = require('../controllers/post-channels'); // import the postToDiscordChannels function
    // This function handles the posting of song data to Discord channels
    // It uses the postToDiscordChannels function to send the message to the specified channels
    // It also handles errors and logs them to the console.

    try {
        await postToDiscordChannels(message); // Call the postToDiscordChannels function with the message
        console.log("✅ Song posted successfully!");
        res.send("✅ Song posted successfully!");
    } catch (error) {
        console.error(`❌ Error: ${error}`);
        res.status(500).send("Error processing request.");
    }
}