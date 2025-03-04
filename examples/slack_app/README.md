# Slack App Setup Guide

This is a [Next.js](https://nextjs.org) project that provides a step-by-step guide for setting up a new Slack application.

## Getting Started

### Development with Docker

1. Copy the example environment file:
   ```bash
   cp .env.local.example .env.local
   ```

2. Fill in your Slack credentials in the `.env.local` file:
   - SLACK_CLIENT_ID
   - SLACK_CLIENT_SECRET
   - SLACK_SIGNING_SECRET
   - SLACK_BOT_TOKEN
   - SLACK_APP_TOKEN

3. Configure your Slack app:
   - In your Slack app settings, go to "OAuth & Permissions"
   - Add the redirect URL: `https://sweet-trusting-caribou.ngrok-free.app/api/auth/slack/callback`

4. Start the development server with Docker Compose:
   ```bash
   docker-compose up
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the guide.

### Using ngrok for HTTPS

Slack requires HTTPS for callback URLs. We're using ngrok to provide a secure HTTPS URL for local development:

1. The app is configured to use `https://sweet-trusting-caribou.ngrok-free.app` as the public URL
2. Make sure this ngrok tunnel is running and pointing to your local server (port 3000)
3. In your Slack app settings, use `https://sweet-trusting-caribou.ngrok-free.app/api/auth/slack/callback` as the OAuth Redirect URL

### Development without Docker

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the guide.

## Environment Variables

This project uses environment variables for configuration. Create a `.env.local` file based on the `.env.local.example` template and fill in your Slack API credentials.

## Learn More

To learn more about building Slack apps:

- [Slack API Documentation](https://api.slack.com/docs) - learn about Slack API features.
- [Slack Block Kit](https://api.slack.com/block-kit) - build rich message layouts.
- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.
