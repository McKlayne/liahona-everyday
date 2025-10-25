import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { storage } from '@/lib/storage-adapter';
import { Role } from '@/lib/types';

// GET /api/roles - Get all roles
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Initialize default roles if user has none
    let roles = await storage.getRoles(session.user.id);
    if (roles.length === 0) {
      await storage.initializeUserRoles(session.user.id);
      roles = await storage.getRoles(session.user.id);
    }

    return NextResponse.json({ roles });
  } catch (error) {
    console.error('GET /api/roles error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch roles' },
      { status: 500 }
    );
  }
}

// POST /api/roles - Create a new role
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
    const { label, icon, slug } = body;

    if (!label || !icon) {
      return NextResponse.json(
        { error: 'Missing required fields: label, icon' },
        { status: 400 }
      );
    }

    const newRole: Role = {
      id: `${session.user.id}-${Date.now()}`,
      label,
      icon,
      slug: slug || label.toLowerCase().replace(/\s+/g, '-'),
      order: Date.now(),
    };

    await storage.saveRole(session.user.id, newRole);

    return NextResponse.json({ role: newRole }, { status: 201 });
  } catch (error) {
    console.error('POST /api/roles error:', error);
    return NextResponse.json(
      { error: 'Failed to create role' },
      { status: 500 }
    );
  }
}
