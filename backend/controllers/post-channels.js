const { chromium } = require("playwright");
const urls = require("../discord_channels/channel-urls");
const {
  typeLikeHuman,
  navigateToUrl,
  handleEveryoneConfirmation,
  postMessageToChannel,
} = require("../services/discord");
const { getChannelsList } = require("../services/discord");

async function postToChannels(message, postType = "Suno link") {
  console.log(
    `📩 Posting ${postType} to Channels called with message:`,
    message
  );

  const browser = await chromium.launch({ headless: false });
  try {
    const context = await browser.newContext({
      storageState: "discord-session.json",
    });

    // Création d'un seul onglet pour toutes les URLs
    const page = await context.newPage();

    // Process URLs one by one
    const channelsList = getChannelsList(postType);
    if (!channelsList) return;

    let successCount = 0;
    let failCount = 0;

    for (const url of channelsList) {
      console.log(
        `\n📬 Processing channel ${successCount + failCount + 1}/${
          channelsList.size || channelsList.length
        }: ${url}`
      );

      try {
        // S'assurer que toute activité précédente est terminée
        await page.waitForLoadState("networkidle");

        const isEveryone = urls.EVERYONE_CHANNELS.has(url);
        isEveryone && console.log(`🔍 Channel accepts @everyone tag`);

        console.log(`⏱️ Navigating to ${url}...`);
        const navigated = await navigateToUrl(page, url);

        if (!navigated) {
          console.log(`❌ Navigation failed, skipping channel`);
          failCount++;
          continue;
        }

        // Attendre explicitement que la page soit complètement chargée
        console.log(`⏱️ Waiting for page to be fully loaded...`);
        await page.waitForLoadState("networkidle", { timeout: 30000 });
        await page.waitForLoadState("domcontentloaded");

        // Attendre encore un moment pour être sûr
        await page.waitForTimeout(2000);

        // Post the message
        console.log(`⏱️ Posting message...`);
        await postMessageToChannel(page, message, isEveryone);

        // Success!
        console.log(`✅ Successfully posted to channel`);
        successCount++;

        // Add delay between posts (augmenter à 5-10 secondes)
        const delay = 5000 + Math.random() * 5000;
        console.log(
          `⏱️ Waiting ${Math.round(delay / 1000)} seconds before next post...`
        );
        await page.waitForTimeout(delay);
      } catch (err) {
        console.error(`❌ Failed posting to ${url}: ${err.message}`);
        failCount++;
        // Attendre un peu avant de continuer en cas d'erreur
        await page.waitForTimeout(3000);
      }
    }

    // Fermer la page à la fin du traitement de toutes les URLs
    await page.close();

    console.log(
      `\n📊 Summary: Posted to ${successCount} channels, failed on ${failCount} channels`
    );
  } catch (err) {
    console.error("❌ Error:", err);
    throw err;
  } finally {
    await browser.close();
  }
}

module.exports = async function postToDiscordChannels(message, _postType) {
  await postToChannels(message, _postType);
};
