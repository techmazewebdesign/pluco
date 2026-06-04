import { NextRequest, NextResponse } from 'next/server';
import { setDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const RESEND_API_KEY = process.env.RESEND_API_KEY;

function generateOTP(): string {
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
      console.error('RESEND_API_KEY not configured');
      return NextResponse.json(
        { error: 'Email service not configured' },
        { status: 500 }
      );
    }

    // Generate 6-digit OTP
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Store OTP in Firestore
    const otpRef = doc(db, 'login_otps', email);
    await setDoc(otpRef, {
      email,
      otp,
      expiresAt: expiresAt.toISOString(),
      createdAt: new Date().toISOString(),
    });

    // Send email using Resend
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'noreply@plucogroup.com',
        to: email,
        subject: 'PLUCO GROUP – Your Login Code',
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
                  <p style="color: #999; margin-top: 5px;">Your Login Code</p>
                </div>

                <p style="color: #333;">Hello,</p>
                <p style="color: #666;">We received a login request for your PLUCO GROUP account. Please enter the code below to sign in:</p>

                <div class="code-box">
                  <div class="code">${otp}</div>
                  <p style="color: #999; margin: 10px 0 0 0; font-size: 12px;">This code expires in 10 minutes</p>
                </div>

                <p style="color: #666; font-size: 12px;"><strong>Security Tip:</strong> Never share this code with anyone. PLUCO GROUP will never ask for this code.</p>

                <p style="color: #666;">If you did not attempt to sign in, please ignore this email or contact us immediately.</p>

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
        { error: 'Failed to send OTP email' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'OTP sent to email',
    });
  } catch (error) {
    console.error('Send OTP error:', error);
    return NextResponse.json(
      { error: 'Failed to send OTP email' },
      { status: 500 }
    );
  }
}
