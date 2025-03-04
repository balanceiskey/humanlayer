import { NextRequest, NextResponse } from 'next/server';
import { getSlackAuthUrl } from '@/lib/slack';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const teamId = searchParams.get('teamId') || undefined;

  try {
    const authUrl = await getSlackAuthUrl(teamId);
    console.log('authUrl', authUrl);
    return NextResponse.json({ authUrl });
  } catch (error) {
    console.error('Error generating Slack auth URL:', error);
    return NextResponse.json(
      { error: 'Failed to generate authentication URL' },
      { status: 500 }
    );
  }
}
