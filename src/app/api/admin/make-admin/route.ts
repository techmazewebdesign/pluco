import { NextRequest, NextResponse } from 'next/server';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function POST(req: NextRequest) {
  try {
    const { uid, adminSecret } = await req.json();

    // Security check
    if (adminSecret !== process.env.ADMIN_SECRET) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (!uid) {
      return NextResponse.json(
        { error: 'UID is required' },
        { status: 400 }
      );
    }

    console.log('=== MAKING USER ADMIN ===');
    console.log('UID:', uid);

    // Check if user exists in agents collection (by UID)
    let foundIn = null;
    let userData = null;

    const agentRef = doc(db, 'agents', uid);
    const agentSnap = await getDoc(agentRef);

    if (agentSnap.exists()) {
      foundIn = 'agents';
      userData = agentSnap.data();
      console.log('Found in agents collection');
    } else {
      // Check users collection (by UID)
      const userRef = doc(db, 'users', uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        foundIn = 'users';
        userData = userSnap.data();
        console.log('Found in users collection');
      }
    }

    if (!foundIn) {
      console.log('User not found - will create new admin entry');
      // For now, return error if user doesn't exist
      return NextResponse.json(
        { error: `User with UID ${uid} not found. User must exist before making admin.`, debug: 'Create user first via admin dashboard or signup' },
        { status: 404 }
      );
    }

    // If user is in users collection, need to move to agents
    if (foundIn === 'users') {
      // Get user data from users collection
      const userRef = doc(db, 'users', uid);
      const userSnap = await getDoc(userRef);
      const userDoc = userSnap.data();

      // Create in agents collection
      const agentRef = doc(db, 'agents', uid);
      await setDoc(agentRef, {
        ...userDoc,
        role: 'admin',
        active: true,
        updatedAt: new Date().toISOString(),
        updatedBy: 'admin-api',
      });

      console.log('Moved user from users to agents collection and set as admin');
    } else {
      // Update role in agents collection
      const agentRef = doc(db, 'agents', uid);
      await updateDoc(agentRef, {
        role: 'admin',
        active: true,
        updatedAt: new Date().toISOString(),
        updatedBy: 'admin-api',
      });

      console.log('Updated user in agents collection to admin');
    }

    return NextResponse.json({
      success: true,
      message: `User ${uid} is now an admin`,
      uid,
      previousCollection: foundIn,
      newRole: 'admin',
      email: userData?.email,
      name: userData?.name || userData?.displayName,
    });
  } catch (error: any) {
    console.error('=== ERROR MAKING USER ADMIN ===');
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    console.error('Full error:', error);

    let userMessage = 'Failed to make user admin';
    let debugInfo = '';

    if (error.message?.includes('permission')) {
      userMessage = 'Firestore permission denied. Check your Firebase credentials.';
      debugInfo = 'Firestore permission issue - likely credentials problem';
    } else if (error.message?.includes('not found')) {
      userMessage = 'User not found in database';
      debugInfo = 'User UID does not exist in agents or users collection';
    }

    return NextResponse.json(
      {
        error: userMessage,
        debug: process.env.NODE_ENV === 'development' ? debugInfo : undefined,
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
