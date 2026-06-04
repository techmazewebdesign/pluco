import { NextRequest, NextResponse } from 'next/server';
import { doc, getDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Verify that OTP was verified (check if it was deleted)
    // This is a simple check - in production you might want a more robust method
    const otpRef = doc(db, 'login_otps', email);
    const otpDoc = await getDoc(otpRef);

    if (otpDoc.exists()) {
      // OTP still exists, hasn't been verified
      return NextResponse.json(
        { error: 'OTP not verified' },
        { status: 401 }
      );
    }

    // OTP was verified, create a session token
    const sessionToken = btoa(`${email}:${new Date().getTime()}:${Math.random()}`);

    return NextResponse.json({
      success: true,
      message: 'Login completed',
      email,
      sessionToken,
    });
  } catch (error) {
    console.error('Complete OTP login error:', error);
    return NextResponse.json(
      { error: 'Failed to complete login' },
      { status: 500 }
    );
  }
}
