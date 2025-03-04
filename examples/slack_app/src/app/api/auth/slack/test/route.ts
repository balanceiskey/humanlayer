import { NextRequest, NextResponse } from 'next/server';
import { testToken } from '@/lib/token-store';

export async function POST(request: NextRequest) {
  try {
    // Try to get token from request body first
    const body = await request.json().catch(() => ({}));

    if (body.token) {
      // If token is provided in the request, use it for testing
      const result = await testTokenWithValue(body.token);
      return NextResponse.json(result);
    } else {
      // Otherwise, fall back to stored token
      const result = await testToken();
      return NextResponse.json(result);
    }
  } catch (error) {
    return NextResponse.json({
      valid: false,
      error: 'Error testing token: ' + (error instanceof Error ? error.message : String(error))
    });
  }
}

// Function to test a specific token value
async function testTokenWithValue(accessToken: string): Promise<{ valid: boolean; error?: string; messageSent?: boolean; channelName?: string }> {
  if (!accessToken) {
    return { valid: false, error: 'No token provided' };
  }

  try {
    // First, test if the token is valid
    const authResponse = await fetch('https://slack.com/api/auth.test', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    const authData = await authResponse.json();

    if (!authData.ok) {
      return {
        valid: false,
        error: authData.error || 'Unknown Slack API error'
      };
    }

    // If token is valid, try to create a new channel and post a test message
    try {
      // Generate a unique channel name with timestamp
      const timestamp = Math.floor(Date.now() / 1000);
      const channelName = `test-app-${timestamp}`;

      // Create a new channel
      const createChannelResponse = await fetch('https://slack.com/api/conversations.create', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: channelName,
          is_private: false,
        }),
      });

      const createChannelData = await createChannelResponse.json();

      if (!createChannelData.ok) {
        // If we can't create a channel (possibly due to permissions), 
        // fall back to finding an existing channel

        if (createChannelData.error === 'missing_scope' ||
          createChannelData.error === 'not_allowed_token_type' ||
          createChannelData.error === 'restricted_action') {

          console.log('Cannot create channel, falling back to finding a test channel');

          // Get a list of channels
          const channelsResponse = await fetch('https://slack.com/api/conversations.list', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              exclude_archived: true,
              types: 'public_channel'
            }),
          });

          const channelsData = await channelsResponse.json();

          if (!channelsData.ok) {
            return {
              valid: true,
              error: 'Could not fetch channels: ' + (channelsData.error || 'Unknown error'),
              messageSent: false
            };
          }

          const targetChannel = channelsData.channels.find(channel => channel.is_member);

          if (!targetChannel) {
            return {
              valid: true,
              error: 'No channels available to post message and cannot create new channel (be sure to invite the bot to your channel)',
              messageSent: false
            };
          }

          // Post the test message to the existing channel
          const messageResponse = await fetch('https://slack.com/api/chat.postMessage', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              channel: targetChannel.id,
              text: '[TEST MESSAGE] This is a test message from a HumanLayer test Slack application'
            }),
          });

          const messageData = await messageResponse.json();

          if (!messageData.ok) {
            return {
              valid: true,
              error: 'Failed to post message: ' + (messageData.error || 'Unknown error'),
              messageSent: false
            };
          }

          return {
            valid: true,
            messageSent: true,
            channelName: targetChannel.name
          };
        }

        return {
          valid: true,
          error: 'Failed to create test channel: ' + (createChannelData.error || 'Unknown error'),
          messageSent: false
        };
      }

      // Get the channel ID from the response
      const newChannelId = createChannelData.channel.id;
      const newChannelName = createChannelData.channel.name;

      // Post test message to new channel
      const messageResponse = await fetch('https://slack.com/api/chat.postMessage', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          channel: newChannelId,
          text: 'This is a test message from a HumanLayer test Slack application'
        }),
      });

      const messageData = await messageResponse.json();

      if (!messageData.ok) {
        return {
          valid: true,
          error: 'Failed to post message to new channel: ' + (messageData.error || 'Unknown error'),
          messageSent: false,
          channelName: newChannelName
        };
      }

      // Success - token is valid and message was sent to new channel
      return {
        valid: true,
        messageSent: true,
        channelName: newChannelName
      };
    } catch (messageError: any) {
      // Token is valid but message posting failed
      return {
        valid: true,
        error: 'Error posting message: ' + (messageError.message || 'Unknown error'),
        messageSent: false
      };
    }
  } catch (error: any) {
    return {
      valid: false,
      error: error.message || 'Network error testing token',
      messageSent: false
    };
  }
}
