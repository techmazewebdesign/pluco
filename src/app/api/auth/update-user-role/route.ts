import { NextRequest, NextResponse } from 'next/server';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function POST(req: NextRequest) {
  try {
    const { email, newRole, adminSecret } = await req.json();

    // Security: Require admin secret
    const expectedSecret = process.env.ADMIN_SECRET;
    if (!expectedSecret || typeof adminSecret !== 'string' || adminSecret !== expectedSecret) {
      return NextResponse.json(
        { error: 'Unauthorized: Invalid admin secret' },
        { status: 401 }
      );
    }

    if (!email || !newRole) {
      return NextResponse.json(
        { error: 'Email and newRole are required' },
        { status: 400 }
      );
    }

    const userEmail = email.toLowerCase();
    const validRoles = ['user', 'admin', 'consultant', 'case_manager', 'customer_service', 'document_reviewer', 'compliance_officer', 'enquiry_handler'];

    if (!validRoles.includes(newRole)) {
      return NextResponse.json(
        { error: `Invalid role. Must be one of: ${validRoles.join(', ')}` },
        { status: 400 }
      );
    }

    // Determine correct collection
    const isAgent = newRole !== 'user' && newRole !== 'client';
    const collectionName = isAgent ? 'agents' : 'users';

    // Get current user data
    const userRef = doc(db, collectionName, userEmail);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      return NextResponse.json(
        { error: `User not found in ${collectionName} collection at ${userEmail}` },
        { status: 404 }
      );
    }

    const currentData = userSnap.data();

    // Update the role
    await updateDoc(userRef, {
      role: newRole,
      updatedAt: new Date().toISOString(),
      updatedBy: 'admin-api',
    });

    return NextResponse.json({
      success: true,
      email: userEmail,
      oldRole: currentData.role,
      newRole: newRole,
      collection: collectionName,
      message: `User role updated from ${currentData.role} to ${newRole}`,
    });
  } catch (error: any) {
    console.error('Error updating user role:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
