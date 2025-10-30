const express = require("express");
const router = express.Router();
const postToDiscordChannels = require("../controllers/post-channels");

router.post("/post", async (req, res) => {
  // This route handles the posting of song data to Discord channels
  // It uses the postToDiscordChannels function to send the message to the specified channels
  console.log("🚀 Discord trigger received");
  const message = req.body.message || undefined;
  const postType = req.body.postType || "Suno link";

  try {
    await postToDiscordChannels(message, postType); // Call the function directly
    res.send("✅ Song posted successfully to Discord Channels!");
  } catch (err) {
    console.error(`❌ Error: ${err}`);
    res.status(500).send("Error running Discord posting script.");
  }
});

module.exports = router;
