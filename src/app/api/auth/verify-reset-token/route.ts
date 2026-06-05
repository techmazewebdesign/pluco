import { NextRequest, NextResponse } from 'next/server';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      );
    }

    // Hash the token to look it up
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const tokenRef = doc(db, 'password_reset_tokens', tokenHash);
    const tokenSnap = await getDoc(tokenRef);

    if (!tokenSnap.exists()) {
      return NextResponse.json(
        { error: 'Reset link not found' },
        { status: 400 }
      );
    }

    const tokenData = tokenSnap.data();

    // Check if token is expired
    if (new Date(tokenData.expiresAt) < new Date()) {
      return NextResponse.json(
        { error: 'Reset link has expired' },
        { status: 400 }
      );
    }

    // Check if token already used
    if (tokenData.used) {
      return NextResponse.json(
        { error: 'This link has already been used' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      email: tokenData.email,
    });
  } catch (error: any) {
    console.error('Error verifying reset token:', error);

    return NextResponse.json(
      {
        error: 'Error verifying reset token',
      },
      { status: 500 }
    );
  }
}
