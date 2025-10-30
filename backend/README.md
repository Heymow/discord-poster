# discord-poster — backend

Small backend service for posting messages to Discord via webhooks. This README documents how to run the backend locally, required environment variables, Docker usage, and available endpoints.

## Features

- Receives HTTP requests and posts messages to Discord webhooks
- Lightweight Express (Node) service
- Configurable via environment variables

## Requirements

- Node.js 18+ (recommended)
- npm or pnpm
- Optional: Docker & Docker Compose

## Quick start (local)

1. Install dependencies

```bash
cd backend
npm install
```

2. Create a .env file (see Environment variables below)

3. Start the server

```bash
npm run dev
```

The server listens on the port configured with PORT (default 3000).

## Environment variables

Create a .env file in the backend directory or set these in your environment:

- PORT - port to listen on (default: 3000)
- LOG_LEVEL - optional logging level (default: info)

If your service uses other env vars (e.g., for secrets), add them here.

## Docker

Build and run with Docker (from the repo root):

```bash
docker build -t discord-poster-backend ./backend
docker run -e PORT=3000 -p 3000:3000 discord-poster-backend
```

Or use docker-compose if provided in the repository.

## API

- POST /post
  - Description: forward a message to a configured Discord webhook
  - Body: JSON payload expected by the service. Example:

```json
{
  "webhook_url": "https://discord.com/api/webhooks/ID/TOKEN",
  "content": "Hello from discord-poster"
}
```

- Health endpoints: GET /health or GET /healthz (if implemented)

Adjust this section to match the actual routes implemented in your backend.

## Contributing

PRs and issues welcome. If you change the API or env vars, update this README accordingly.

## License

Specify the project license here (e.g., MIT).