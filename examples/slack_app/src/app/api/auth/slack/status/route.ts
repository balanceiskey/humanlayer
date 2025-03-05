import { NextRequest, NextResponse } from 'next/server';
import { getToken } from '@/lib/token-store';

export async function GET(request: NextRequest) {
  const token = await getToken();
  
  if (token) {
    // Return token info but not the actual tokens for security
    return NextResponse.json({
      hasToken: true,
      teamId: token.teamId,
      teamName: token.teamName,
      botUserId: token.botUserId,
      channelId: token.channelId
    });
  } else {
    return NextResponse.json({
      hasToken: false
    });
  }
}
