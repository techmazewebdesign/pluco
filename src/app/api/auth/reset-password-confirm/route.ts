import { NextRequest, NextResponse } from 'next/server';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { initializeApp, getApps, getApp, cert } from 'firebase-admin/app';
import { getAuth as getAdminAuth } from 'firebase-admin/auth';
import crypto from 'crypto';

// Initialize Firebase Admin if not already initialized
let adminApp: any;
try {
  if (getApps().length === 0) {
    const adminConfig = {
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    };

    adminApp = initializeApp({
      credential: cert(adminConfig as any),
    });
  } else {
    adminApp = getApp();
  }
} catch (error) {
  console.error('Firebase Admin initialization error:', error);
}

export async function POST(req: NextRequest) {
  try {
    const { email, newPassword, token } = await req.json();

    if (!email || !newPassword || !token) {
      return NextResponse.json(
        { error: 'Email, password, and token are required' },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // Hash the token to verify it
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const tokenRef = doc(db, 'password_reset_tokens', tokenHash);
    const tokenSnap = await getDoc(tokenRef);

    if (!tokenSnap.exists()) {
      return NextResponse.json(
        { error: 'Invalid reset token' },
        { status: 400 }
      );
    }

    const tokenData = tokenSnap.data();

    // Verify token hasn't expired
    if (new Date(tokenData.expiresAt) < new Date()) {
      return NextResponse.json(
        { error: 'Reset token has expired' },
        { status: 400 }
      );
    }

    // Verify token hasn't been used
    if (tokenData.used) {
      return NextResponse.json(
        { error: 'This reset token has already been used' },
        { status: 400 }
      );
    }

    // Verify email matches
    if (tokenData.email !== email.toLowerCase()) {
      return NextResponse.json(
        { error: 'Email does not match' },
        { status: 400 }
      );
    }

    // Find the user in Firebase Auth by email
    let uid: string | null = null;

    try {
      const adminAuth = getAdminAuth(adminApp);
      const userRecord = await adminAuth.getUserByEmail(email.toLowerCase());
      uid = userRecord.uid;

      // Update password in Firebase Auth
      await adminAuth.updateUser(uid, {
        password: newPassword,
      });

      console.log('Password updated for user:', email);
    } catch (authError: any) {
      console.error('Firebase Auth error:', authError);

      // If user not found in Auth, it's an error
      if (authError.code === 'auth/user-not-found') {
        return NextResponse.json(
          { error: 'User account not found' },
          { status: 404 }
        );
      }

      throw authError;
    }

    // Mark token as used
    await updateDoc(tokenRef, {
      used: true,
      usedAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: 'Password has been reset successfully',
      email: email,
    });
  } catch (error: any) {
    console.error('Error resetting password:', error);

    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to reset password',
      },
      { status: 500 }
    );
  }
}
