import { NextResponse } from 'next/server';

/**
 * Diagnostic endpoint to verify environment variables in production
 * IMPORTANT: Remove this after debugging is complete for security
 */
export async function GET() {
  return NextResponse.json({
    nodeEnv: process.env.NODE_ENV,
    nextauthUrl: process.env.NEXTAUTH_URL || 'not set',
    hasAuthSecret: !!process.env.AUTH_SECRET,
    hasGoogleClientId: !!process.env.GOOGLE_CLIENT_ID,
    hasGoogleClientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
    googleClientIdPrefix: process.env.GOOGLE_CLIENT_ID
      ? process.env.GOOGLE_CLIENT_ID.substring(0, 20) + '...'
      : 'not set',
    // Show the expected redirect URI
    expectedRedirectUri: process.env.NEXTAUTH_URL
      ? `${process.env.NEXTAUTH_URL}/api/auth/callback/google`
      : 'NEXTAUTH_URL not set',
  });
}
