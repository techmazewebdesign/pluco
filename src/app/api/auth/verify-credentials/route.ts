import { NextRequest, NextResponse } from 'next/server';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export async function POST(req: NextRequest) {
  try {
    console.log('=== VERIFY CREDENTIALS API ===');
    console.log('Request method:', req.method);

    const body = await req.json();
    console.log('Request body received:', { email: body.email, hasPassword: !!body.password });

    const { email, password } = body;

    if (!email || !password) {
      console.error('Missing email or password');
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    console.log('Attempting to sign in with email:', email);

    try {
      // Verify credentials
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
      console.log('Sign in successful for user:', userCredential.user.uid);

      // Get the user UID for verification
      const uid = userCredential.user.uid;

      // Sign them out immediately (they'll sign in again after OTP verification)
      console.log('Signing out user after credential verification');
      await auth.signOut();

      const responseData = {
        success: true,
        message: 'Credentials verified',
        email: userCredential.user.email || email,
        uid,
      };

      console.log('Returning success response');
      return NextResponse.json(responseData);
    } catch (authError: any) {
      console.error('Firebase auth error:', {
        code: authError.code,
        message: authError.message,
      });

      let message = 'Invalid email or password';

      if (authError.code === 'auth/user-not-found') {
        message = 'Account not found. Please check your email or sign up.';
      } else if (authError.code === 'auth/wrong-password') {
        message = 'Invalid email or password';
      } else if (authError.code === 'auth/user-disabled') {
        message = 'Account has been disabled. Please contact support.';
      } else if (authError.code === 'auth/too-many-requests') {
        message = 'Too many login attempts. Please try again later.';
      } else if (authError.code === 'auth/invalid-email') {
        message = 'Invalid email address';
      } else if (authError.code === 'auth/network-request-failed') {
        message = 'Network error. Please check your internet connection.';
      }

      console.error('Returning error:', message);
      return NextResponse.json(
        { error: message },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('=== VERIFY CREDENTIALS ERROR ===');
    console.error('Error details:', error);
    return NextResponse.json(
      { error: 'Failed to verify credentials. Please try again.' },
      { status: 500 }
    );
  }
}
