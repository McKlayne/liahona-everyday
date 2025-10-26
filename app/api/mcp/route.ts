import { NextRequest, NextResponse } from 'next/server';
import { verifyApiKey } from '@/lib/api-keys';
import { dbStorage } from '@/lib/db/storage';

/**
 * MCP Server endpoint for Claude Desktop integration
 * Authenticates using API keys via LIAHONA_API_KEY header
 */

async function authenticateRequest(request: NextRequest): Promise<string | null> {
  // Check for API key in Authorization header or LIAHONA_API_KEY header
  const authHeader = request.headers.get('authorization');
  const apiKeyHeader = request.headers.get('x-api-key');

  let apiKey: string | null = null;

  if (authHeader?.startsWith('Bearer ')) {
    apiKey = authHeader.substring(7);
  } else if (apiKeyHeader) {
    apiKey = apiKeyHeader;
  }

  if (!apiKey) {
    return null;
  }

  return await verifyApiKey(apiKey);
}

/**
 * GET /api/mcp - Get user data for MCP integration
 */
export async function GET(request: NextRequest) {
  const userId = await authenticateRequest(request);

  if (!userId) {
    return NextResponse.json(
      { error: 'Unauthorized - Invalid or missing API key' },
      { status: 401 }
    );
  }

  try {
    const [roles, topics] = await Promise.all([
      dbStorage.getRoles(userId),
      dbStorage.getTopics(userId),
    ]);

    return NextResponse.json({
      userId,
      roles,
      topics,
      message: 'MCP endpoint active - Use this endpoint with your Liahona Everyday API key',
    });
  } catch (error) {
    console.error('Error fetching MCP data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/mcp - Create or update data via MCP
 * Body can contain: { type: 'topic' | 'role', action: 'create' | 'update', data: {...} }
 */
export async function POST(request: NextRequest) {
  const userId = await authenticateRequest(request);

  if (!userId) {
    return NextResponse.json(
      { error: 'Unauthorized - Invalid or missing API key' },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { type, action, data } = body;

    if (!type || !action || !data) {
      return NextResponse.json(
        { error: 'Missing required fields: type, action, data' },
        { status: 400 }
      );
    }

    if (type === 'topic' && action === 'create') {
      await dbStorage.saveTopic(userId, data);
      return NextResponse.json({ success: true, message: 'Topic created' });
    } else if (type === 'role' && action === 'create') {
      await dbStorage.saveRole(userId, data);
      return NextResponse.json({ success: true, message: 'Role created' });
    } else {
      return NextResponse.json(
        { error: 'Unsupported type or action' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error in MCP POST:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
