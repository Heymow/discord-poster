const express = require('express');
const { exec } = require('child_process');
const app = express();
app.use(express.json());
const router = express.Router();

const basicAuth = require('basic-auth');

// Set username and password
const USERNAME = process.env.USERNAME
const PASSWORD = process.env.PASSWORD

// Auth middleware
function auth(req, res, next) {
    const user = basicAuth(req);
    if (!user || user.name !== USERNAME || user.pass !== PASSWORD) {
        res.set('WWW-Authenticate', 'Basic realm="Suno Automation"');
        return res.status(401).send('Access denied');
    }
    next();
}

router.post('/post', (req, res) => {
    console.log("🚀 Discord trigger received");

    // Optionally get dynamic message
    const message = req.body.message || undefined;

    exec(`node ./routes/discord.js "${message.replace(/"/g, '\\"')}"`, (err, stdout, stderr) => {
        if (err) {
            console.error(`❌ Error: ${err}`);
            return res.status(500).send("Error running Discord posting script.");
        }
        console.log(stdout);
        res.send("✅ Song posted successfully to Discord Channels!");
    });
});

router.post('/save', (req, res) => {
    console.log("🚀 Google trigger received");

    // Optionally get dynamic message
    const message = req.body.message || undefined;

    exec(`node ./routes/google.js "${message.replace(/"/g, '\\"')}"`, (err, stdout, stderr) => {
        if (err) {
            console.error(`❌ Error: ${err}`);
            return res.status(500).send("Error running Google Sheets posting script.");
        }
        console.log(stdout);
        res.send("✅ Song posted successfully to Google Sheets!");
    });
});

const PORT = process.env.PORT | 3000;
app.listen(PORT, () => {
    console.log(`🟢 Server listening at http://localhost:${PORT}/trigger`);
});
