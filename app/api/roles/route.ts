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
    const { label, icon, slug, order } = body;

    if (!label || !icon) {
      return NextResponse.json(
        { error: 'Missing required fields: label, icon' },
        { status: 400 }
      );
    }

    // Generate slug from label if not provided
    const finalSlug = slug || label.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

    // Check if slug already exists for this user
    const existingRoles = await storage.getRoles(session.user.id);
    if (existingRoles.some(r => r.slug === finalSlug)) {
      return NextResponse.json(
        { error: 'A role with this URL name already exists. Please choose a different name.' },
        { status: 409 }
      );
    }

    // Calculate order - either provided or next available
    const finalOrder = order !== undefined ? order : (existingRoles.length > 0
      ? Math.max(...existingRoles.map(r => r.order)) + 1
      : 1);

    const newRole: Role = {
      id: `${session.user.id}-${Date.now()}`,
      label,
      icon,
      slug: finalSlug,
      order: finalOrder,
    };

    await storage.saveRole(session.user.id, newRole);

    return NextResponse.json({ role: newRole }, { status: 201 });
  } catch (error) {
    console.error('POST /api/roles error:', error);

    // Check for unique constraint violation
    if (error instanceof Error && error.message.includes('unique constraint')) {
      return NextResponse.json(
        { error: 'A role with this URL name already exists.' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create role' },
      { status: 500 }
    );
  }
}
