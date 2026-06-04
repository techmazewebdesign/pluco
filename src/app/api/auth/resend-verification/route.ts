import { NextRequest, NextResponse } from 'next/server';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const RESEND_API_KEY = process.env.RESEND_API_KEY;

function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: NextRequest) {
  try {
    console.log('=== RESEND VERIFICATION EMAIL API ===');

    const { email } = await req.json();

    console.log('Email:', email);

    if (!email) {
      console.error('Email is required');
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    if (!RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not set in environment variables');
      console.error('Available env keys:', Object.keys(process.env).filter(k => k.includes('RESEND') || k.includes('MAIL')));
      return NextResponse.json(
        { error: 'Email service not properly configured. RESEND_API_KEY missing.' },
        { status: 500 }
      );
    }

    console.log('RESEND_API_KEY is set, length:', RESEND_API_KEY.length);

    // Get the verification record to get userId
    const verificationRef = doc(db, 'email_verifications', email);
    const verificationDoc = await getDoc(verificationRef);

    if (!verificationDoc.exists()) {
      console.error('Verification record not found for email:', email);
      return NextResponse.json(
        { error: 'Verification record not found' },
        { status: 404 }
      );
    }

    const data = verificationDoc.data();
    const userId = data.userId;

    console.log('Found verification record for user:', userId);

    // Generate new code
    const code = generateCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    console.log('Generated new code:', code);
    console.log('Updating verification code in Firestore...');

    // Update verification code
    await setDoc(verificationRef, {
      email,
      userId,
      code,
      expiresAt: expiresAt.toISOString(),
      createdAt: new Date().toISOString(),
    });

    console.log('Verification code updated successfully');
    console.log('Sending email via Resend API...');

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

    console.log('Resend API response status:', response.status);

    if (!response.ok) {
      let errorMessage = 'Failed to resend verification email';
      try {
        const error = await response.json();
        console.error('Resend API error:', error);
        errorMessage = error.message || error.error || JSON.stringify(error);
      } catch (e) {
        const errorText = await response.text();
        console.error('Resend API error (text):', errorText);
        errorMessage = errorText;
      }
      console.error('Final error message:', errorMessage);
      return NextResponse.json(
        { error: `Failed to send email: ${errorMessage}` },
        { status: 500 }
      );
    }

    console.log('Email sent successfully');

    return NextResponse.json({
      success: true,
      message: 'Verification email resent',
    });
  } catch (error) {
    console.error('=== RESEND VERIFICATION ERROR ===');
    console.error('Error details:', error);
    return NextResponse.json(
      { error: 'Failed to resend verification email' },
      { status: 500 }
    );
  }
}
