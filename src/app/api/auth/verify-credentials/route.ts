import { NextRequest, NextResponse } from 'next/server';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    try {
      // Verify credentials (this will sign in the user temporarily)
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      // Get the user UID for verification
      const uid = userCredential.user.uid;

      // Sign them out immediately (they'll sign in again after OTP verification)
      await auth.signOut();

      return NextResponse.json({
        success: true,
        message: 'Credentials verified',
        email,
        uid,
      });
    } catch (authError: any) {
      console.error('Auth error:', authError.code);

      let message = 'Invalid email or password';
      if (authError.code === 'auth/user-not-found') {
        message = 'Account not found';
      } else if (authError.code === 'auth/wrong-password') {
        message = 'Invalid email or password';
      } else if (authError.code === 'auth/user-disabled') {
        message = 'Account has been disabled';
      } else if (authError.code === 'auth/too-many-requests') {
        message = 'Too many login attempts. Please try again later.';
      }

      return NextResponse.json(
        { error: message },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Credential verification error:', error);
    return NextResponse.json(
      { error: 'Failed to verify credentials' },
      { status: 500 }
    );
  }
}
