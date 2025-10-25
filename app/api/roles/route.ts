import { NextRequest, NextResponse } from 'next/server';
import { serverStorage } from '@/lib/serverStorage';
import { Role } from '@/lib/types';

// GET /api/roles - Get all roles
export async function GET(request: NextRequest) {
  try {
    const roles = serverStorage.getRoles();
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
    const body = await request.json();
    const { label, icon, slug } = body;

    if (!label || !icon) {
      return NextResponse.json(
        { error: 'Missing required fields: label, icon' },
        { status: 400 }
      );
    }

    const newRole: Role = {
      id: Date.now().toString(),
      label,
      icon,
      slug: slug || label.toLowerCase().replace(/\s+/g, '-'),
      order: Date.now(),
    };

    serverStorage.saveRole(newRole);

    return NextResponse.json({ role: newRole }, { status: 201 });
  } catch (error) {
    console.error('POST /api/roles error:', error);
    return NextResponse.json(
      { error: 'Failed to create role' },
      { status: 500 }
    );
  }
}
