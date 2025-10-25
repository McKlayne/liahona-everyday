import { NextRequest, NextResponse } from 'next/server';
import { serverStorage } from '@/lib/serverStorage';

// GET /api/topics/[id] - Get a specific topic
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const topics = serverStorage.getTopics();
    const topic = topics.find(t => t.id === params.id);

    if (!topic) {
      return NextResponse.json(
        { error: 'Topic not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ topic });
  } catch (error) {
    console.error('GET /api/topics/[id] error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch topic' },
      { status: 500 }
    );
  }
}

// PUT /api/topics/[id] - Update a topic
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const topics = serverStorage.getTopics();
    const topicIndex = topics.findIndex(t => t.id === params.id);

    if (topicIndex === -1) {
      return NextResponse.json(
        { error: 'Topic not found' },
        { status: 404 }
      );
    }

    const updatedTopic = {
      ...topics[topicIndex],
      ...body,
      id: params.id, // Ensure ID doesn't change
    };

    serverStorage.saveTopic(updatedTopic);

    return NextResponse.json({ topic: updatedTopic });
  } catch (error) {
    console.error('PUT /api/topics/[id] error:', error);
    return NextResponse.json(
      { error: 'Failed to update topic' },
      { status: 500 }
    );
  }
}

// DELETE /api/topics/[id] - Delete a topic
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    serverStorage.deleteTopic(params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/topics/[id] error:', error);
    return NextResponse.json(
      { error: 'Failed to delete topic' },
      { status: 500 }
    );
  }
}
