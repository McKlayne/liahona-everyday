import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { storage } from '@/lib/storage-adapter';

// DELETE /api/roles/[id] - Delete a role
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await storage.deleteRole(session.user.id, params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/roles/[id] error:', error);
    return NextResponse.json(
      { error: 'Failed to delete role' },
      { status: 500 }
    );
  }
}

// PUT /api/roles/[id] - Update a role
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const roles = await storage.getRoles(session.user.id);
    const role = roles.find(r => r.id === params.id);

    if (!role) {
      return NextResponse.json(
        { error: 'Role not found' },
        { status: 404 }
      );
    }

    const updatedRole = {
      ...role,
      ...body,
      id: params.id, // Ensure ID doesn't change
    };

    await storage.saveRole(session.user.id, updatedRole);

    return NextResponse.json({ role: updatedRole });
  } catch (error) {
    console.error('PUT /api/roles/[id] error:', error);
    return NextResponse.json(
      { error: 'Failed to update role' },
      { status: 500 }
    );
  }
}
