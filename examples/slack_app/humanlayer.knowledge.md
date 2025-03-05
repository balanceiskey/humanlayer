# HumanLayer Integration Knowledge

## Configuration

- HumanLayer requires an API key to be set in the environment variables
- The API key should be set as `HUMANLAYER_API_KEY` in the `.env.local` file
- For development, you can use the CLI approval method which doesn't require an API key

## Integration Points

- The pizza ordering functionality uses HumanLayer for human approval
- The approval flow is implemented in `src/lib/humanlayer.ts`
- The `requireApproval` function wraps any function to require human approval before execution

## Slack Channel Integration

- The app uses client-provided tokens for Slack integration, not environment variables
- Tokens are stored in localStorage on the client side
- The token and channel ID are passed with each pizza order request
- No incoming webhooks are used - all communication uses the bot token

## Token Management

- Bot tokens are stored in localStorage after OAuth authentication
- The token is passed with each request that needs it
- The server doesn't rely on environment variables for Slack tokens
- Channel IDs are discovered during the test connection process

## Testing the Integration

To test the HumanLayer integration:

1. Set up your `.env.local` file with your HumanLayer API key
2. Connect your Slack workspace to get channel-based approvals
3. Submit a pizza order through the UI
4. Check your Slack channel or CLI for the approval request
5. Approve or deny the request to see the result in the UI

## Common Issues

- If approvals aren't showing up in Slack, check that your Slack token has the correct permissions
- If you're getting authentication errors, verify your HumanLayer API key
- For local development without an API key, the system will fall back to CLI approvals
- If the channel ID is missing, run the "Test Connection" function to discover available channels
