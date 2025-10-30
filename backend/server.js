require("dotenv").config();
const express = require("express");
const app = express();
app.use(express.json());
const discordRoutes = require("./routes/discord.js");
const googleRoutes = require("./routes/google.js");

const basicAuth = require("basic-auth");

// Set username and password
const USERNAME = process.env.SUNOAPI_USERNAME;
const PASSWORD = process.env.SUNOAPI_PASSWORD;

// Auth middleware
function auth(req, res, next) {
  const user = basicAuth(req);
  if (!user || user.name !== USERNAME || user.pass !== PASSWORD) {
    res.set("WWW-Authenticate", 'Basic realm="Suno Automation"');
    return res.status(401).send("Access denied");
  }
  next();
}

app.use(discordRoutes, auth);
app.use(googleRoutes, auth);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🟢 Server listening at http://localhost:${PORT}/post`);
  console.log(`🟢 Server listening at http://localhost:${PORT}/save`);
});
