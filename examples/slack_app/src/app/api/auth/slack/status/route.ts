import { NextRequest, NextResponse } from 'next/server';
import { getToken } from '@/lib/token-store';

export async function GET(request: NextRequest) {
  const token = getToken();
  
  if (token) {
    // Return token info but not the actual token for security
    return NextResponse.json({
      hasToken: true,
      accessToken: token.accessToken, // Only sent to client during initial setup
      teamId: token.teamId,
      teamName: token.teamName,
      botUserId: token.botUserId
    });
  } else {
    return NextResponse.json({
      hasToken: false
    });
  }
}
