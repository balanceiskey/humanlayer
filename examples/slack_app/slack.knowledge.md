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
- `channels:join` - Join public channels (needed for test message functionality)

### Common Errors

- `invalid_scope` error: This occurs when requesting scopes that are not enabled in your Slack app settings. Make sure all scopes used in the code are also added in the Slack app configuration.
- `access_denied` error: This can happen when a user denies permission or when the requested scopes are not enabled for the app.
- `Could not determine installation key` error: This happens when the Slack OAuth response doesn't include team or enterprise information. Always provide a fallback key in the installation store.
- `No installation found for key: default` error: This occurs when trying to fetch an installation before it's been stored. The OAuth flow requires storing the installation first.
- `not_in_channel` error: This happens when a bot tries to post to a channel it hasn't been invited to. The bot needs to join the channel first using `conversations.join` API.

### Next.js App Router Integration

- When using Next.js App Router, the `@slack/oauth` library's `handleCallback` method doesn't work properly because it expects Express-style request/response objects
- For more reliable integration, directly use the Slack API's `oauth.v2.access` endpoint to exchange the code for tokens
- The `InstallProvider` from `@slack/oauth` doesn't expose a direct `storeInstallation` method - it's only available through the installation store callbacks
- For simplicity in demo applications, you can skip the installation storage and just use the tokens directly
- Always provide the same `redirectUri` in both the authorization URL generation and the token exchange

### Token Storage in Next.js

- In-memory token storage in Next.js App Router may not persist between requests due to serverless functions
- Each route handler or server action may run in a separate instance with its own memory space
- For development, we use a hybrid approach:
  1. Server-side in-memory storage for the initial OAuth flow
  2. Client-side localStorage for persistence between page loads
  3. API endpoints to synchronize between client and server state
- In production, use a database or other persistent storage mechanism
- Add comprehensive logging to debug token storage issues

### Client-Side Token Management

- The success page fetches token information from the server and stores it in localStorage
- The home page checks both server-side token status and client-side localStorage
- Client-side JavaScript enhances the UI based on localStorage token status
- API endpoints for token operations:
  - `/api/auth/slack/status` - Get current token status
  - `/api/auth/slack/test` - Test if the token is valid
  - `/api/auth/slack/clear` - Clear the token

### Hydration Issues

- When using both server-side rendering and client-side localStorage, hydration mismatches can occur
- To prevent this, use data attributes to indicate server-rendered state
- Wait for DOMContentLoaded before running client-side localStorage checks
- Only update the DOM if the server didn't already render the connected state
- For React components, use a mounted state to avoid hydration mismatches
- Use the useEffect hook to set the mounted state when the component is mounted
- Only render client-side components after they're mounted

### Security Considerations

- Never store access tokens in localStorage in production environments
- Access tokens in localStorage are accessible to any JavaScript running on the page, including third-party scripts
- For direct API testing, tokens won't be available when making requests outside the browser context
- Better alternatives for token storage:
  1. HttpOnly cookies (not accessible to JavaScript)
  2. Server-side session storage with a session ID in cookies
  3. Database storage with proper encryption
- When testing API endpoints directly (e.g., with curl), you'll need to pass the token in the request or use cookie-based authentication

### API Testing

- When testing API endpoints directly (with curl, Postman, etc.), in-memory tokens and localStorage tokens are not available
- For direct API testing, either:
  1. Pass the token in the request body: `{"token": "xoxb-your-token-here"}`
  2. Use a cookie-based approach where the token is sent with every request
  3. Implement a session-based system with a session ID in cookies and tokens stored server-side
- Remember that serverless functions run in isolated environments, so in-memory data is not shared between invocations

### Redirect Handling

- When using HTML-based redirects instead of NextResponse.redirect(), server-side token persistence between requests can be lost
- This happens because each API route handler runs in its own serverless function instance
- To ensure token persistence with HTML redirects, store the token directly in localStorage before redirecting
- For reliable token storage during OAuth flows, use a dedicated callback page that:
  1. Receives the token as a URL parameter
  2. Stores it in localStorage using client-side JavaScript
  3. Redirects to the success page after storage is complete
- This approach ensures the token is stored before any further navigation happens

### Slack Bot Channel Access

- Slack bots can only post messages to channels they've been invited to or have joined
- When testing a connection, first check if the bot is already a member of any channels
- If not, try to join a channel using the `conversations.join` API (requires `channels:join` scope)
- Preferred channels to join are #general or #random, as they exist in most workspaces
- If the bot can't join any channel, it won't be able to post test messages
- Always handle the `not_in_channel` error gracefully in your UI
