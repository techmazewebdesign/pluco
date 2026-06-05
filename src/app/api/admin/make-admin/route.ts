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
      return NextResponse.json(
        { error: `User with UID ${uid} not found in either agents or users collection` },
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
    console.error('Error making user admin:', error);

    return NextResponse.json(
      {
        error: error.message || 'Failed to make user admin',
      },
      { status: 500 }
    );
  }
}
