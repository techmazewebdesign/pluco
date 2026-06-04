import { NextRequest, NextResponse } from 'next/server';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

const RESEND_API_KEY = process.env.RESEND_API_KEY;

function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: NextRequest) {
  try {
    console.log('=== SIGNUP API ===');
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    console.log('Creating Firebase user for:', email);

    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
    const userId = userCredential.user.uid;

    console.log('User created with ID:', userId);
    console.log('Setting display name:', name);

    // Set display name
    await updateProfile(userCredential.user, { displayName: name.trim() });

    // Create Firestore client profile with emailVerified: false
    console.log('Creating Firestore client record');
    const clientRef = doc(db, 'clients', userId);
    await setDoc(clientRef, {
      uid: userId,
      name: name.trim(),
      email: email.trim(),
      emailVerified: false,
      preferredLanguage: 'en',
      createdAt: new Date().toISOString(),
    });

    console.log('Client record created');

    // Generate verification code
    const verificationCode = generateVerificationCode();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    console.log('Storing verification code in Firestore');

    // Store verification code
    const verificationRef = doc(db, 'email_verifications', email.trim());
    await setDoc(verificationRef, {
      email: email.trim(),
      userId,
      code: verificationCode,
      expiresAt: expiresAt.toISOString(),
      createdAt: new Date().toISOString(),
    });

    console.log('Verification code stored');
    console.log('Sending verification email');

    // Send verification email
    if (!RESEND_API_KEY) {
      console.error('RESEND_API_KEY not set');
      return NextResponse.json(
        { error: 'Email service not configured' },
        { status: 500 }
      );
    }

    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'noreply@plucogroup.com',
        to: email.trim(),
        subject: 'PLUCO GROUP – Verify Your Email Address',
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <style>
                body { font-family: Arial, sans-serif; background-color: #f8f9fa; }
                .container { max-width: 600px; margin: 0 auto; background-color: white; padding: 40px; border-radius: 8px; }
                .header { text-align: center; margin-bottom: 30px; }
                .code-box { background-color: #f0ede6; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0; }
                .code { font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #071c3c; }
                .footer { font-size: 12px; color: #999; text-align: center; margin-top: 30px; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1 style="color: #071c3c; margin: 0;">PLUCO GROUP</h1>
                  <p style="color: #999; margin-top: 5px;">Verify Your Email Address</p>
                </div>

                <p style="color: #333;">Hello ${name},</p>
                <p style="color: #666;">Thank you for signing up with PLUCO GROUP. Please verify your email address by entering the code below:</p>

                <div class="code-box">
                  <div class="code">${verificationCode}</div>
                  <p style="color: #999; margin: 10px 0 0 0; font-size: 12px;">This code expires in 24 hours</p>
                </div>

                <p style="color: #666;">If you did not create this account, please ignore this email.</p>

                <div class="footer">
                  <p>© 2024 PLUCO GROUP Sp. z o.o. All rights reserved.</p>
                  <p>Warsaw, Poland</p>
                </div>
              </div>
            </body>
          </html>
        `,
      }),
    });

    if (!emailResponse.ok) {
      const errorData = await emailResponse.json();
      console.error('Email sending failed:', errorData);
      return NextResponse.json(
        { error: 'Failed to send verification email' },
        { status: 500 }
      );
    }

    console.log('Verification email sent successfully');

    return NextResponse.json({
      success: true,
      message: 'Account created. Verification email sent.',
      userId,
    });
  } catch (error: any) {
    console.error('=== SIGNUP ERROR ===');
    console.error('Error:', error);

    // Handle Firebase auth errors
    if (error.code === 'auth/email-already-in-use') {
      return NextResponse.json(
        { error: 'Email already in use' },
        { status: 400 }
      );
    }

    if (error.code === 'auth/weak-password') {
      return NextResponse.json(
        { error: 'Password is too weak' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create account' },
      { status: 500 }
    );
  }
}
