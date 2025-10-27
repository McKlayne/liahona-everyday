import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { createApiKey, getUserApiKeys } from '@/lib/api-keys';

/**
 * GET /api/api-keys - List all API keys for the authenticated user
 */
export async function GET(request: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const apiKeys = await getUserApiKeys(session.user.id);
    return NextResponse.json({ apiKeys });
  } catch (error) {
    console.error('Error fetching API keys:', error);
    return NextResponse.json(
      { error: 'Failed to fetch API keys' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/api-keys - Create a new API key
 * Body: { keyName: string }
 */
export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { keyName } = body;

    if (!keyName || typeof keyName !== 'string' || keyName.trim().length === 0) {
      return NextResponse.json(
        { error: 'Key name is required' },
        { status: 400 }
      );
    }

    const { apiKey, fullKey } = await createApiKey(session.user.id, keyName.trim());

    return NextResponse.json({
      apiKey,
      fullKey, // Only returned once - user must save it!
      message: 'API key created successfully. Save the full key - it will not be shown again.',
    });
  } catch (error) {
    console.error('Error creating API key:', error);
    return NextResponse.json(
      { error: 'Failed to create API key' },
      { status: 500 }
    );
  }
}
