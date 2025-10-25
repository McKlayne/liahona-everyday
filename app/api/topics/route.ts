import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/lib/storage-adapter';
import { Topic } from '@/lib/types';

// GET /api/topics - Get all topics
export async function GET(request: NextRequest) {
  try {
    const topics = await storage.getTopics();
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

    await storage.saveTopic(newTopic);

    return NextResponse.json({ topic: newTopic }, { status: 201 });
  } catch (error) {
    console.error('POST /api/topics error:', error);
    return NextResponse.json(
      { error: 'Failed to create topic', details: (error as Error).message },
      { status: 500 }
    );
  }
}
