import { NextRequest, NextResponse } from 'next/server';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const RESEND_API_KEY = process.env.RESEND_API_KEY;

function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    if (!RESEND_API_KEY) {
      return NextResponse.json(
        { error: 'Email service not configured' },
        { status: 500 }
      );
    }

    // Get the verification record to get userId
    const verificationRef = doc(db, 'email_verifications', email);
    const verificationDoc = await getDoc(verificationRef);

    if (!verificationDoc.exists()) {
      return NextResponse.json(
        { error: 'Verification record not found' },
        { status: 404 }
      );
    }

    const { userId } = verificationDoc.data();

    // Generate new code
    const code = generateCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // Update verification code
    await setDoc(verificationRef, {
      email,
      userId,
      code,
      expiresAt: expiresAt.toISOString(),
      createdAt: new Date().toISOString(),
    });

    // Send email
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'noreply@plucogroup.com',
        to: email,
        subject: 'PLUCO GROUP – Verify Your Email Address (Resent)',
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
                  <p style="color: #999; margin-top: 5px;">Email Verification (Resent)</p>
                </div>

                <p style="color: #333;">Hello,</p>
                <p style="color: #666;">Here is your new verification code:</p>

                <div class="code-box">
                  <div class="code">${code}</div>
                  <p style="color: #999; margin: 10px 0 0 0; font-size: 12px;">This code expires in 10 minutes</p>
                </div>

                <p style="color: #666;">If you did not request this, please ignore this email.</p>

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

    if (!response.ok) {
      const error = await response.json();
      console.error('Resend API error:', error);
      return NextResponse.json(
        { error: 'Failed to resend verification email' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Verification email resent',
    });
  } catch (error) {
    console.error('Resend verification error:', error);
    return NextResponse.json(
      { error: 'Failed to resend verification email' },
      { status: 500 }
    );
  }
}
