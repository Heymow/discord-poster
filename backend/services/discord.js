const urls = require("../discord_channels/channel-urls");
const discord = {};

discord.typeLikeHuman = async (page, selector, text) => {
  // This function simulates human typing by typing each character with a random delay
  const el = await page.$(selector);
  try {
    for (let char of text) {
      await el.type(char);
      const delay = 30 + Math.random() * 50;
      await page.waitForTimeout(delay);
    }
  } catch (err) {
    console.error(`❌ Error typing in ${selector}:`, err.message);
    throw err;
  }
};

discord.postMessageToChannel = async (page, message, isEveryone) => {
  // This function handles the writing and sending of messages to a Discord channel
  try {
    // Attendre que le textbox soit disponible
    console.log("⏱️ Waiting for textbox...");
    await page.waitForSelector('[role="textbox"]', {
      state: "visible",
      timeout: 20000,
    });
    console.log("⌨️ Found textbox");

    // Attendre que la page soit interactive
    await page.waitForLoadState("domcontentloaded");

    const fullMessage = isEveryone ? `@everyone ${message}` : message;
    console.log(`📝 Final message to send: "${fullMessage}"`);

    // Sélectionner le textbox et vérifier qu'il est prêt
    const textbox = await page.$('[role="textbox"]');
    await textbox.focus();

    // Taper le message avec simulation humaine
    await discord.typeLikeHuman(page, '[role="textbox"]', fullMessage);
    console.log("✅ Message typed.");

    // Vérifier que le message est bien présent dans le textbox
    const textContent = await textbox.textContent();
    if (!textContent || !textContent.includes(message.substring(0, 20))) {
      console.log("⚠️ Message may not be fully typed, retrying...");
      await page.fill('[role="textbox"]', fullMessage);
    }

    // Envoyer le message
    await page.keyboard.press("Enter");
    console.log("✅ Enter key pressed.");

    // Attendre que le message apparaisse dans le chat
    // Discord montre un petit indicateur de "message envoyé" qu'on peut détecter
    try {
      // On attend de voir soit notre propre message dans le chat
      // soit le bouton de confirmation @everyone
      await Promise.race([
        page.waitForFunction(
          () => {
            // Rechercher notre message dans les derniers messages du chat
            const messages = document.querySelectorAll(
              '[class*="messageContent"]'
            );
            const lastMessages = Array.from(messages).slice(-5);
            return lastMessages.some((msg) =>
              msg.textContent.includes("suno.com/song/")
            );
          },
          { timeout: 5000 }
        ),
        page.waitForSelector('[role="button"] >> text=Send Now', {
          timeout: 3000,
        }),
      ]);
    } catch (e) {
      console.log("⚠️ Could not detect message sent, but continuing...");
    }

    // Gérer la confirmation @everyone si nécessaire
    await discord.handleEveryoneConfirmation(page);

    console.log("✅ Message sent.");
  } catch (err) {
    console.error(`❌ Could not post message:`, err.message);
    throw err;
  }
};

discord.navigateToUrl = async (page, url) => {
  // This function handles the navigation to a specific URL
  try {
    console.log(`⏱️ Navigating to ${url}...`);

    // Naviguer vers l'URL avec attente intelligente
    const response = await page.goto(url, {
      waitUntil: "networkidle",
      timeout: 60000,
    });

    // Vérifier que la navigation a réussi
    if (!response || !response.ok()) {
      console.error(
        `❌ Failed to navigate to ${url}: HTTP ${
          response?.status() || "unknown"
        }`
      );
      return false;
    }

    // Attendre que Discord soit chargé - on cherche des éléments spécifiques à l'interface
    await Promise.race([
      page
        .waitForSelector('[role="textbox"]', { timeout: 15000 })
        .catch(() => {}),
      page
        .waitForSelector('[class*="chatContent"]', { timeout: 15000 })
        .catch(() => {}),
      page
        .waitForSelector('[class*="messageContent"]', { timeout: 15000 })
        .catch(() => {}),
    ]);

    console.log(`✅ Navigated to ${url}`);
    return true; // Indicate success
  } catch (err) {
    console.error(`❌ Failed to navigate to ${url}:`, err.message);
    return false; // Indicate failure
  }
};

discord.handleEveryoneConfirmation = async (page) => {
  // This function handles the confirmation popup for @everyone tag
  try {
    // Attendre la boîte de dialogue spécifiquement
    const confirmButton = await page.waitForSelector(
      '[role="button"] >> text=Send Now',
      {
        timeout: 3000,
        state: "visible",
      }
    );

    if (confirmButton) {
      // Attendre que le bouton soit cliquable
      await confirmButton.waitForElementState("stable");
      await confirmButton.click();
      console.log("🔔 Clicked @everyone confirmation");

      // Attendre que la boîte de dialogue disparaisse
      await page
        .waitForSelector('[role="button"] >> text=Send Now', {
          state: "detached",
          timeout: 3000,
        })
        .catch(() => {});
    }
  } catch (popupErr) {
    console.log("ℹ️ No @everyone confirmation needed");
  }
};

discord.getChannelsList = (postType) => {
  // This function returns the list of channels based on the post type
  switch (postType) {
    case "Suno link":
      return urls.SHOWCASE_URLS;
    case "Playlist link":
      return urls.PLAYLIST_URLS;
    case "YouTube link":
      return urls.YOUTUBE_URLS;
    case "Spotify link":
      return urls.SPOTIFY_URLS;
    case "SoundCloud link":
      return urls.SOUNDCLOUD_URLS;
    case "Instagram link":
      return urls.INSTAGRAM_URLS;
    case "Twitter link":
      return urls.TWITTER_URLS;
    case "Facebook link":
      return urls.FACEBOOK_URLS;
    case "TikTok link":
      return urls.TIKTOK_URLS;
    case "Riffusion link":
      return urls.RIFFUSION_URLS;
    default:
      console.error(`❌ Unknown post type: ${postType}`);
      return null;
  }
};

module.exports = discord;
