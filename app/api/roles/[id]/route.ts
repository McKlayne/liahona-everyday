import { NextRequest, NextResponse } from 'next/server';
import { serverStorage } from '@/lib/serverStorage';

// DELETE /api/roles/[id] - Delete a role
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    serverStorage.deleteRole(params.id);
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
    const body = await request.json();
    const roles = serverStorage.getRoles();
    const roleIndex = roles.findIndex(r => r.id === params.id);

    if (roleIndex === -1) {
      return NextResponse.json(
        { error: 'Role not found' },
        { status: 404 }
      );
    }

    const updatedRole = {
      ...roles[roleIndex],
      ...body,
      id: params.id, // Ensure ID doesn't change
    };

    serverStorage.saveRole(updatedRole);

    return NextResponse.json({ role: updatedRole });
  } catch (error) {
    console.error('PUT /api/roles/[id] error:', error);
    return NextResponse.json(
      { error: 'Failed to update role' },
      { status: 500 }
    );
  }
}
