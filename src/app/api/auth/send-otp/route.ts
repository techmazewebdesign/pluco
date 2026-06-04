import { NextRequest, NextResponse } from 'next/server';
import { setDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const RESEND_API_KEY = process.env.RESEND_API_KEY;

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: NextRequest) {
  try {
    console.log('=== SEND OTP API ===');

    const body = await req.json();
    const { email } = body;

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

    // Generate 6-digit OTP
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    console.log('Generated OTP:', otp);
    console.log('Storing OTP in Firestore...');

    // Store OTP in Firestore
    const otpRef = doc(db, 'login_otps', email);
    await setDoc(otpRef, {
      email,
      otp,
      expiresAt: expiresAt.toISOString(),
      createdAt: new Date().toISOString(),
    });

    console.log('OTP stored successfully');
    console.log('Sending email via Resend API...');

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

    console.log('Resend API response status:', response.status);

    if (!response.ok) {
      let errorMessage = 'Failed to send OTP email';
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
      message: 'OTP sent to email',
    });
  } catch (error) {
    console.error('=== SEND OTP ERROR ===');
    console.error('Error details:', error);
    return NextResponse.json(
      { error: 'Failed to send OTP email' },
      { status: 500 }
    );
  }
}
