# Slack Integration Knowledge

## HTTPS Requirements

- Slack requires HTTPS for OAuth callback URLs
- For development, we use ngrok to provide a secure tunnel with HTTPS
- Current ngrok URL: `https://sweet-trusting-caribou.ngrok-free.app`

## Environment Configuration

- `NEXT_PUBLIC_APP_URL` - Base URL for the application (default: http://localhost:3000)
- `NEXT_PUBLIC_APP_URL_OVERRIDE` - Override URL for Slack callbacks (ngrok URL)
- The application uses the override URL if available, otherwise falls back to the default URL

## Slack OAuth Flow

1. User clicks "Add to Slack" button
2. App redirects to Slack authorization page
3. After authorization, Slack redirects to our callback URL
4. Callback handler completes the OAuth flow and stores the installation
5. User is redirected to success or error page

## Important URLs

- OAuth Redirect URL: `https://sweet-trusting-caribou.ngrok-free.app/api/auth/slack/callback`
- This URL must be configured in the Slack app settings under "OAuth & Permissions"

## Slack App Configuration

### Required Scopes

The following OAuth scopes must be added to your Slack app in the "OAuth & Permissions" section:

- `channels:history` - View messages and other content in public channels
- `channels:read` - View basic information about public channels
- `chat:write` - Send messages as the app
- `incoming-webhook` - Post messages to specific channels

### Common Errors

- `invalid_scope` error: This occurs when requesting scopes that are not enabled in your Slack app settings. Make sure all scopes used in the code are also added in the Slack app configuration.
- `access_denied` error: This can happen when a user denies permission or when the requested scopes are not enabled for the app.
- `Could not determine installation key` error: This happens when the Slack OAuth response doesn't include team or enterprise information. Always provide a fallback key in the installation store.
- `No installation found for key: default` error: This occurs when trying to fetch an installation before it's been stored. The OAuth flow requires storing the installation first.

### Next.js App Router Integration

- When using Next.js App Router, the `@slack/oauth` library's `handleCallback` method doesn't work properly because it expects Express-style request/response objects
- For more reliable integration, directly use the Slack API's `oauth.v2.access` endpoint to exchange the code for tokens
- The `InstallProvider` from `@slack/oauth` doesn't expose a direct `storeInstallation` method - it's only available through the installation store callbacks
- For simplicity in demo applications, you can skip the installation storage and just use the tokens directly
- Always provide the same `redirectUri` in both the authorization URL generation and the token exchange
