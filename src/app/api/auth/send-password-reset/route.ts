import { NextRequest, NextResponse } from 'next/server';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import crypto from 'crypto';
import { Resend } from 'resend';

// Initialize Resend if API key is available
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://www.plucogroup.com';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const userEmail = email.trim().toLowerCase();

    console.log('=== PASSWORD RESET REQUEST ===');
    console.log('Email:', userEmail);
    console.log('SMTP_HOST configured:', !!process.env.SMTP_HOST);
    console.log('SMTP_USER configured:', !!process.env.SMTP_USER);
    console.log('SMTP_PASSWORD configured:', !!process.env.SMTP_PASSWORD);

    // Check if user exists in agents or users collection
    let userExists = false;
    let userName = '';

    try {
      console.log('Checking agents collection for:', userEmail);
      // Check agents collection
      const agentRef = doc(db, 'agents', userEmail);
      const agentSnap = await getDoc(agentRef);
      if (agentSnap.exists()) {
        userExists = true;
        userName = agentSnap.data()?.name || agentSnap.data()?.displayName || '';
        console.log('Found user in agents collection');
      }

      // Check users collection
      if (!userExists) {
        console.log('Checking users collection for:', userEmail);
        const userRef = doc(db, 'users', userEmail);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          userExists = true;
          userName = userSnap.data()?.displayName || userSnap.data()?.name || '';
          console.log('Found user in users collection');
        }
      }

      if (!userExists) {
        console.log('User not found in either collection');
      }
    } catch (firestoreError) {
      console.error('Firestore error:', firestoreError);
      throw firestoreError;
    }

    if (!userExists) {
      // For security, still show success message (don't reveal if email exists)
      return NextResponse.json({
        success: true,
        message: 'If an account with this email exists, a password reset link has been sent.',
        email: userEmail,
      });
    }

    // Generate secure reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24 hours

    // Store reset token in Firestore
    const resetTokenRef = doc(db, 'password_reset_tokens', tokenHash);
    await setDoc(resetTokenRef, {
      email: userEmail,
      tokenHash,
      createdAt: new Date().toISOString(),
      expiresAt,
      used: false,
    });

    // Create reset link
    const resetLink = `${APP_URL}/reset-password?token=${resetToken}`;

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #071C3C; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background-color: #f9f9f9; padding: 20px; border: 1px solid #e0e0e0; }
    .footer { background-color: #f0f0f0; padding: 10px; text-align: center; font-size: 12px; color: #666; }
    .button { display: inline-block; padding: 12px 30px; background-color: #C9A35A; color: #071C3C; text-decoration: none; border-radius: 5px; margin-top: 20px; font-weight: bold; }
    .warning { color: #DC2626; margin-top: 20px; font-size: 14px; }
    .code { background-color: #f3f4f6; padding: 10px; border-radius: 4px; font-family: monospace; word-break: break-all; margin-top: 10px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Reset Your Password</h1>
    </div>
    <div class="content">
      <p>Hello ${userName || 'User'},</p>

      <p>We received a request to reset your password. Click the button below to create a new password:</p>

      <a href="${resetLink}" class="button">Reset Password</a>

      <p style="margin-top: 30px; color: #666; font-size: 14px;">
        <strong>Or copy this link:</strong><br>
        <span class="code">${resetLink}</span>
      </p>

      <p style="margin-top: 30px; color: #666; font-size: 14px;">
        <strong>This link expires in 24 hours.</strong>
      </p>

      <div class="warning">
        ⚠️ <strong>Didn't request this?</strong><br>
        If you didn't request a password reset, please ignore this email. Your account is safe. If you have concerns, contact support.
      </div>

      <p style="margin-top: 30px; color: #666; font-size: 14px;">
        Best regards,<br>
        PLUCO GROUP Support Team
      </p>
    </div>
    <div class="footer">
      <p>&copy; 2024 PLUCO GROUP. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
    `;

    const textContent = `
Reset Your Password

Hello ${userName || 'User'},

We received a request to reset your password. Visit the link below to create a new password:

${resetLink}

This link expires in 24 hours.

If you didn't request this, please ignore this email.

---
PLUCO GROUP Support Team
© 2024 PLUCO GROUP
    `;

    // Send email via Resend
    if (!resend) {
      throw new Error('Email service not configured. Please set RESEND_API_KEY environment variable.');
    }

    const emailResult = await resend.emails.send({
      from: process.env.RESEND_FROM || 'PLUCO GROUP <noreply@plucogroup.com>',
      to: userEmail,
      subject: 'Reset Your PLUCO GROUP Password',
      html: htmlContent,
      text: textContent,
    });

    if (emailResult.error) {
      console.error('Resend email error:', emailResult.error);
      throw new Error(`Failed to send email: ${emailResult.error.message}`);
    }

    console.log('Password reset email sent to:', userEmail, 'Message ID:', emailResult.data?.id);

    return NextResponse.json({
      success: true,
      message: 'Password reset link sent to your email',
      email: userEmail,
    });
  } catch (error: any) {
    console.error('=== PASSWORD RESET ERROR ===');
    console.error('Error:', error);
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    console.error('Stack:', error.stack);

    let userMessage = 'Failed to send password reset email';

    if (error.message.includes('SMTP')) {
      userMessage = 'Email service not configured. Please try again later or contact support.';
    } else if (error.message.includes('permission')) {
      userMessage = 'Permission denied. Please contact support.';
    } else if (error.message.includes('Firestore')) {
      userMessage = 'Database error. Please try again later.';
    }

    return NextResponse.json(
      {
        success: false,
        error: userMessage,
        debug: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
