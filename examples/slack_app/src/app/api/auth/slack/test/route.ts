import { NextRequest, NextResponse } from 'next/server';
import { testToken } from '@/lib/token-store';

export async function POST(request: NextRequest) {
  const result = await testToken();
  
  return NextResponse.json(result);
}
