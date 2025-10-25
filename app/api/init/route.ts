import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/lib/storage-adapter';

// GET /api/init - Initialize database (production only)
export async function GET(request: NextRequest) {
  try {
    // Only allow in production with POSTGRES_URL
    if (!process.env.POSTGRES_URL) {
      return NextResponse.json(
        { error: 'This endpoint is only available in production' },
        { status: 400 }
      );
    }

    await storage.initialize();

    return NextResponse.json({
      success: true,
      message: 'Database initialized successfully'
    });
  } catch (error) {
    console.error('GET /api/init error:', error);
    return NextResponse.json(
      { error: 'Failed to initialize database', details: (error as Error).message },
      { status: 500 }
    );
  }
}
