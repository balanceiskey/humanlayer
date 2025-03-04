import { NextRequest, NextResponse } from 'next/server';
import { clearToken } from '@/lib/token-store';

export async function POST(request: NextRequest) {
  clearToken();
  return NextResponse.json({ success: true });
}
