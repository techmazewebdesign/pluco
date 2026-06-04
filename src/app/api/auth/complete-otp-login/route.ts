import { NextRequest, NextResponse } from 'next/server';
import { doc, getDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function POST(req: NextRequest) {
  try {
    console.log('=== COMPLETE OTP LOGIN API ===');

    const { email } = await req.json();

    console.log('Email:', email);

    if (!email) {
      console.error('Email is required');
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    console.log('Checking if OTP was verified...');

    // Verify that OTP was verified (check if it was deleted)
    const otpRef = doc(db, 'login_otps', email);
    const otpDoc = await getDoc(otpRef);

    if (otpDoc.exists()) {
      console.error('OTP still exists, not verified yet');
      // OTP still exists, hasn't been verified
      return NextResponse.json(
        { error: 'OTP not verified' },
        { status: 401 }
      );
    }

    console.log('OTP was verified successfully');

    // OTP was verified, create a session token
    const sessionToken = btoa(`${email}:${new Date().getTime()}:${Math.random()}`);

    console.log('Session token created');

    return NextResponse.json({
      success: true,
      message: 'Login completed',
      email,
      sessionToken,
    });
  } catch (error) {
    console.error('=== COMPLETE OTP LOGIN ERROR ===');
    console.error('Error details:', error);
    return NextResponse.json(
      { error: 'Failed to complete login' },
      { status: 500 }
    );
  }
}
