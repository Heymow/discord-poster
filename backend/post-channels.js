const { chromium } = require('playwright');
const analyzeAndSave = require('./analyzeAndSave');


const CHANNEL_URLS = require('./channel-urls');
const EVERYONE_CHANNELS = new Set(require('./everyone-channels'));


const MESSAGE = process.argv[2] || undefined;

async function typeLikeHuman(page, selector, text) {
    const el = await page.$(selector);
    for (let char of text) {
        await el.type(char);
        const delay = 30 + Math.random() * 50;
        await page.waitForTimeout(delay);
    }
}

(async () => {
    console.log("📩 Received message:", process.argv[2]);
    const browser = await chromium.launch({ headless: false });
    try {
        const context = await browser.newContext({ storageState: 'discord-session.json' });
        const page = await context.newPage();

        await analyzeAndSave(MESSAGE);

        for (const url of CHANNEL_URLS) {
            console.log(`📬 Posting to: ${url}`);
            const isEveryone = EVERYONE_CHANNELS.has(url);
            console.log(`🔍 Channel ${url} is ${isEveryone ? '' : 'NOT '}in EVERYONE_CHANNELS`);

            await page.goto(url, { waitUntil: 'networkidle' });

            try {
                await page.waitForSelector('[role="textbox"]', { timeout: 10000 });
                console.log('⌨️ Found textbox');

                const fullMessage = isEveryone
                    ? `@everyone ${MESSAGE}`
                    : MESSAGE;

                console.log(`📝 Final message to send: "${fullMessage}"`);
                await typeLikeHuman(page, '[role="textbox"]', fullMessage);
                await page.waitForTimeout(1000 + Math.random() * 1000);
                await page.keyboard.press('Enter');
                console.log('✅ Message sent');

                try {
                    const confirmButton = await page.waitForSelector('[role="button"] >> text=Send Now', { timeout: 3000 });
                    if (confirmButton) {
                        await confirmButton.click();
                        console.log('🔔 Clicked @everyone confirmation');
                    }
                } catch (popupErr) {
                    console.log('ℹ️ No @everyone confirmation needed');
                }

            } catch (err) {
                console.log(`❌ Could not post in ${url}:`, err.message);
            }

            await page.waitForTimeout(2000 + Math.random() * 3000);
        }

    } finally {
        await browser.close();
    }
})();