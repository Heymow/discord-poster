![Discord Poster logo](./discord-poster-logo.png)

# DISCORD POSTER
A backend tool to post a given text in a list of Discord channels, with your Discord account, with the possibility to specify if the @everyone tag is needed, per channel, and also saving song info to Google Sheets if needed.

---
## Features:
- Extracts your Discord account token locally
- Connects to a customized list of channels
- Automatically detects if an age-verification box appears and clicks it
- Possibility to specify which channels need an @everyone tag
- Multiple channels lists, according to the type of message to send (Suno Link, YouTube Link, Instagram Link, Announcement...)
---
  ## Stack :
  - Javascript
  - Node.js
  - Express
  - Playwright (Chromium)

---

This README documents how to save an authenticated Discord session, configure which Discord channels the backend may post to (based on the provided example file), how to provide Google "concrete" credentials to save songs to a Google Sheet, and the exact request shape the backend expects.

---

## Features

- Receives HTTP requests and posts messages/links to Discord channels
- Helper script (Playwright) to save a logged-in Discord session for reuse
- Channel configuration via a channels file (based on `channel-urls-example.js`)
- Optional: save song info to a Google Sheet using a user-provided "concrete" login file
- Lightweight Node/Express backend, configurable via environment variables

---

## Requirements

- Node.js 18+ (recommended)
- npm or pnpm
- Optional: Docker & Docker Compose
- A Discord account (for running the session save script)
- Optional: A Google "concrete" service account / credentials file if you want to save songs to Google Sheets

---

## Quick start (local)

1. Install dependencies

```bash
cd backend
npm install
```

2. Save an authenticated Discord session (one-time / refresh when needed)

```bash
node save-session.js
```

- This opens a headed Chromium window (Playwright). Log into Discord there.
- After logging in, press ENTER in the terminal.
- The script saves the storage state to `discord-session.json` in the backend directory.
- Treat `discord-session.json` as secret, do not commit it.

3. Configure channels (see "Channel configuration" below)

4. (Optional) Provide Google credentials if you want to save songs to Google Sheets (see "Google Sheet / concret login" below)

5. Start the server

```bash
npm run dev
# or
node server.js
```

Default port: PORT env var (default 5000 if you use .env.example).

---

## Channel configuration: use channel-urls-example.js

This repository includes `channel-urls-example.js`. Use it as the template to create the actual channels file your backend reads (create `channel-urls.js` and copy contents of `channel-urls-example.js` into it). The example demonstrates the data structures (arrays and Sets) the backend expects.

Key points:
- Replace placeholder entries like `"https://discord.com/channels/{serverId}/{channelId}"` with real channel URLs:
  - Format: `https://discord.com/channels/<serverId>/<channelId>`
  - Example: `"https://discord.com/channels/123456789012345678/987654321098765432"`
- Place each channel URL into the appropriate Set for the link types the channel should receive, e.g.:
  - `urls.SHOWCASE_URLS`, `urls.YOUTUBE_URLS`, `urls.SPOTIFY_URLS`, etc.
- If a channel should be posted with an `@everyone` mention, add it to `urls.EVERYONE_CHANNELS` (but also keep it in the typed Sets).

How to copy the example:
```bash
cd backend
cp channel-urls-example.js channel-urls.js
# then edit channel-urls.js to add your real channel URLs
```

Keep `channel-urls.js` private. It contains channel identifiers.

---

## Google Sheet / "concrete" login (optional)

If you want the backend to also save song info (e.g., Suno links) into a Google Sheet, drop your Google credentials file into the `auth/` folder in the backend directory.

- Place the user-provided "concrete" login file (the JSON credentials provided to you by Google) at:
  - `backend/auth/<your-concret-credentials-file>.json`
  - The project .env.example references a `SERVICE_ACCOUNT_KEY` name; by default it points to `concrete-login-2ddbfa0e1bb0.json` (example).
- The backend will look in the `auth/` folder for the credentials file at startup or when it needs to access Google Sheets.
- The credentials file must have the shape and permissions required to write to the target Google Sheet (a service-account JSON supported by your Google Sheets integration).
- Keep this file private and never commit it to source control.
- Ensure the service account or credentials have write access to the Google Sheet (share the sheet with the service account email, or configure OAuth properly).

---

## Environment variables (.env.example)

An example env file is included. Place a `.env` file in the backend directory or export these environment variables in your environment. Example values from `.env.example`:

# Suno API
SUNOAPI_URL='https://api.suno-proxy.click/song/'
SUNOAPI_USERNAME=''
SUNOAPI_PASSWORD=''

# Google Sheets API
SHEET_ID='1FFaCPSrOvCwG_ekeEPmre21Hl9y22bm606A0bBUaCl9'
SERVICE_ACCOUNT_KEY='concrete-login-2ddbfa0e1bb7.json'

PORT=5000

Notes:
- `SHEET_ID` - the Google Spreadsheet ID the backend will write to when Google credentials are present.
- `SERVICE_ACCOUNT_KEY` - filename of the concret/service account JSON credentials you placed in `backend/auth/`. Ensure the filename matches.
- `SUNOAPI_URL`, `SUNOAPI_USERNAME`, and `SUNOAPI_PASSWORD` - configuration for Suno API calls if the backend uses the Suno proxy. You can set any username and password, this is only here to protect your backend from unauthorized users.

---

## Exact JSON body to send

The backend expects a JSON body with at least the message string and the post type. For Suno links the required shape is:

```json
{
  "message": "https://suno.com/s/iJGdNRuk8kzjFgO4",
  "postType": "Suno link"
}
```

Notes:
- `message` - the content to post (a link or text).
- `postType` - a string used by the backend to decide which Set(s) in your `channel-urls.js` to route the message to (e.g., "Suno link", "YouTube", "Spotify", etc.). Make sure the `postType` you send maps to the Sets you configured.

Example curl request:
```bash
curl -X POST http://localhost:5000/post \
  -H "Content-Type: application/json" \
  -d '{
    "message": "https://suno.com/s/iJGdNRuk8kzjFgO4",
    "postType": "Suno link"
  }'
```

Or use Postman / Thunder Client:
- Method: POST
- URL: http://localhost:5000/post
- Body: raw → JSON
  {
    "message": "https://suno.com/s/iJGdNRuk8kzjFgO4",
    "postType": "Suno link"
  }

---

## Routing & behavior (high level)

- The backend reads `channel-urls.js` (or the configured filename) which exposes Sets grouped by link type.
- When it receives a request with a `postType`, it finds the relevant Set(s) for that type and posts the provided message to each channel URL in those Sets.
- If a channel is also in `EVERYONE_CHANNELS`, the backend may add an `@everyone` mention when posting there.
- If Google credentials are present in `auth/` and the backend integration is enabled, a row with the song/link info will be written to the configured Google Sheet (SHEET_ID) using the provided `SERVICE_ACCOUNT_KEY`.

---

## Troubleshooting

- If posting fails:
  - Ensure `discord-session.json` exists and is up-to-date if the backend relies on Playwright session auth.
  - Ensure your `channel-urls.js` contains the exact channel URLs and that the `postType` you send maps to one of the Sets.
  - Check the server logs for errors and request/response details.
  - Confirm channel URLs are correct and your Discord account has permission to post.
- If Google Sheet writes fail:
  - Ensure the credentials file in `backend/auth/` is correct and has write access to the sheet.
  - Ensure your backend config or environment variables specify the target spreadsheet ID and sheet name.
  - Inspect logs for Google API errors (missing scopes, permission denied, invalid credentials).

---

## Security notes

- `discord-session.json` contains authenticated session storage. Treat it as secret.
- `channel-urls.js` contains channel IDs/URLs. Keep it private.
- `auth/` credentials (your concret login file) are sensitive. Do not commit them.
- Rotate or revoke any exposed webhooks, sessions, or credentials if compromised.

---

## Docker

Build and run:
```bash
docker build -t discord-poster-backend ./backend
docker run -e PORT=5000 -p 5000:5000 discord-poster-backend
```

---

## Contributing
PRs and issues welcome.

## License
MIT
