import { NextRequest, NextResponse } from 'next/server';
import { createUserWithEmailAndPassword, sendEmailVerification, signOut } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

export async function POST(req: NextRequest) {
  try {
    console.log('=== SIGNUP WITH EMAIL VERIFICATION ===');
    const { name, email, password, role = 'user' } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    console.log('Creating user with email:', email, 'role:', role);

    // Create user with Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
    const user = userCredential.user;
    console.log('User created with UID:', user.uid);

    // Send verification email
    console.log('Sending verification email...');
    await sendEmailVerification(user);
    console.log('Verification email sent');

    // Create Firestore profile in appropriate collection based on role
    // Use email as document ID for consistency with admin user creation
    const userEmail = email.trim().toLowerCase();
    console.log('Creating Firestore profile in', role === 'consultant' ? 'agents' : 'users', 'collection with email ID:', userEmail);

    if (role === 'consultant') {
      // Create in agents collection for consultants
      const agentRef = doc(db, 'agents', userEmail);
      await setDoc(agentRef, {
        uid: user.uid,
        firebaseUid: user.uid,
        name: name.trim(),
        email: userEmail,
        role: 'consultant',
        active: true,
        status: 'pending',
        emailVerified: false,
        createdAt: new Date().toISOString(),
      });
    } else {
      // Create in users collection for regular users
      const userRef = doc(db, 'users', userEmail);
      await setDoc(userRef, {
        uid: user.uid,
        firebaseUid: user.uid,
        displayName: name.trim(),
        email: userEmail,
        role: 'user',
        status: 'pending',
        emailVerified: false,
        preferredLanguage: 'en',
        createdAt: new Date().toISOString(),
      });
    }

    // Sign out user - they must verify email before logging in
    console.log('Signing out user');
    await signOut(auth);

    return NextResponse.json({
      success: true,
      message: 'Account created. Verification email sent.',
      email: user.email,
      role: role,
    });
  } catch (error: any) {
    console.error('=== SIGNUP ERROR ===');
    console.error('Error:', error);

    if (error.code === 'auth/email-already-in-use') {
      return NextResponse.json(
        { error: 'Email already in use' },
        { status: 400 }
      );
    }

    if (error.code === 'auth/weak-password') {
      return NextResponse.json(
        { error: 'Password is too weak (minimum 6 characters)' },
        { status: 400 }
      );
    }

    if (error.code === 'auth/invalid-email') {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create account' },
      { status: 500 }
    );
  }
}
