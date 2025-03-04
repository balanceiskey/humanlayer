'use server'

import { clearToken, getToken, hasToken, testToken } from "@/lib/token-store";

export async function getSlackStatus() {
  const hasStoredToken = hasToken();
  const token = hasStoredToken ? getToken() : null;
  
  console.log('getSlackStatus called, token status:', {
    hasToken: hasStoredToken,
    teamName: token?.teamName || null,
    teamId: token?.teamId || null
  });
  
  return {
    hasToken: hasStoredToken,
    teamName: token?.teamName || null,
    teamId: token?.teamId || null,
  };
}

export async function clearSlackToken() {
  console.log('clearSlackToken called');
  clearToken();
  return { success: true };
}

export async function testSlackToken() {
  console.log('testSlackToken called');
  const result = await testToken();
  console.log('testSlackToken result:', result);
  return result;
}
