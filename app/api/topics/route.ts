import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { storage } from '@/lib/storage-adapter';
import { Topic } from '@/lib/types';

// GET /api/topics - Get all topics
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const topics = await storage.getTopics(session.user.id);
    return NextResponse.json({ topics });
  } catch (error) {
    console.error('GET /api/topics error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch topics' },
      { status: 500 }
    );
  }
}

// POST /api/topics - Create a new topic
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { title, description, category, roleId, sources } = body;

    if (!title || !description || !category) {
      return NextResponse.json(
        { error: 'Missing required fields: title, description, category' },
        { status: 400 }
      );
    }

    const newTopic: Topic = {
      id: Date.now().toString(),
      title,
      description,
      category,
      roleId,
      createdAt: Date.now(),
      completed: false,
      totalTimeSpent: 0,
      sources: sources || [],
    };

    await storage.saveTopic(session.user.id, newTopic);

    // Initialize default roles for new users (on first topic creation)
    const roles = await storage.getRoles(session.user.id);
    if (roles.length === 0) {
      await storage.initializeUserRoles(session.user.id);
    }

    return NextResponse.json({ topic: newTopic }, { status: 201 });
  } catch (error) {
    console.error('POST /api/topics error:', error);
    return NextResponse.json(
      { error: 'Failed to create topic', details: (error as Error).message },
      { status: 500 }
    );
  }
}
