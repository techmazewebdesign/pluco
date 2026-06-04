import { NextRequest, NextResponse } from 'next/server';
import { createUserWithEmailAndPassword, sendEmailVerification, signOut } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

export async function POST(req: NextRequest) {
  try {
    console.log('=== SIGNUP WITH EMAIL VERIFICATION ===');
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    console.log('Creating user with email:', email);

    // Create user with Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
    const user = userCredential.user;
    console.log('User created with UID:', user.uid);

    // Update profile name
    console.log('Sending verification email...');
    await sendEmailVerification(user);
    console.log('Verification email sent');

    // Create Firestore profile
    console.log('Creating Firestore profile');
    const clientRef = doc(db, 'clients', user.uid);
    await setDoc(clientRef, {
      uid: user.uid,
      name: name.trim(),
      email: email.trim(),
      emailVerified: false,
      preferredLanguage: 'en',
      createdAt: new Date().toISOString(),
    });

    // Sign out user - they must verify email before logging in
    console.log('Signing out user');
    await signOut(auth);

    return NextResponse.json({
      success: true,
      message: 'Account created. Verification email sent.',
      email: user.email,
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
