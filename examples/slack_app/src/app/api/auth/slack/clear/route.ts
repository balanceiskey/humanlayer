import { NextRequest, NextResponse } from 'next/server';
import { clearToken } from '@/lib/token-store';

export async function POST(request: NextRequest) {
  const success = await clearToken();
  
  return NextResponse.json({
    success
  });
}
