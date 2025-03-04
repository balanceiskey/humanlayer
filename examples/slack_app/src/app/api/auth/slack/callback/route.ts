import { NextRequest, NextResponse } from 'next/server';
import { installer } from '@/lib/slack';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  
  // Get the base URL (with override if available)
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL_OVERRIDE || process.env.NEXT_PUBLIC_APP_URL;
  
  // Error handling for the OAuth callback
  const error = searchParams.get('error');
  if (error) {
    console.error('Slack OAuth error:', error);
    return NextResponse.redirect(new URL(`/auth/error?error=${error}`, baseUrl));
  }
  
  if (!code) {
    return NextResponse.redirect(new URL('/auth/error?error=missing_code', baseUrl));
  }
  
  try {
    console.log('Processing OAuth callback with code:', code.substring(0, 10) + '...');
    
    // Complete the OAuth flow by exchanging the code for tokens
    const redirectUri = `${baseUrl}/api/auth/slack/callback`;
    console.log('Using redirect URI:', redirectUri);
    
    // Exchange the code for tokens directly with Slack API
    const clientId = process.env.SLACK_CLIENT_ID;
    const clientSecret = process.env.SLACK_CLIENT_SECRET;
    
    // Make the API request to Slack
    const response = await fetch('https://slack.com/api/oauth.v2.access', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: clientId!,
        client_secret: clientSecret!,
        redirect_uri: redirectUri,
      }),
    });
    
    const data = await response.json();
    console.log('Slack OAuth response:', {
      ok: data.ok,
      team: data.team?.id ? { id: data.team.id, name: data.team.name } : 'No team info',
      error: data.error || 'none',
    });
    
    if (!data.ok) {
      console.error('Slack API error:', data.error);
      return NextResponse.redirect(new URL(`/auth/error?error=slack_api_error&details=${data.error}`, baseUrl));
    }
    
    // Successfully authenticated with Slack!
    // In a real application, you would store the tokens in a database
    console.log('Authentication successful!');
    console.log('Access token received for team:', data.team?.name || 'Unknown team');
    
    // Store tokens securely (this is just for demonstration)
    // In production, you would store these in a database
    if (data.team?.id) {
      console.log(`Tokens for team ${data.team.id} would be stored in a database`);
    }
    
    // Redirect to success page
    return NextResponse.redirect(new URL('/auth/success', baseUrl));
  } catch (error: any) {
    console.error('Error handling Slack callback:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      stack: error.stack,
    });
    
    // Determine error type for better user feedback
    let errorType = 'installation_failed';
    if (error.message?.includes('state_validation_failed')) {
      errorType = 'invalid_state';
    } else if (error.message?.includes('Could not determine installation key')) {
      errorType = 'missing_team_info';
    }
    
    return NextResponse.redirect(new URL(`/auth/error?error=${errorType}`, baseUrl));
  }
}
