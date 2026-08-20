import { NextRequest, NextResponse } from 'next/server';
import { getAdminAuth, getAdminDb } from '@/lib/firebase-admin';
import { sendPlucoEmail } from '@/lib/server/plucoMailer';

const SIGNUP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://www.plucogroup.com';

const getRoleDisplay = (role: string): string => {
  const roleMap: { [key: string]: string } = {
    consultant: 'Consultant',
    user: 'Client',
    admin: 'Administrator',
    case_manager: 'Case Manager',
    customer_service: 'Customer Service Representative',
    document_reviewer: 'Document Reviewer',
    compliance_officer: 'Compliance Officer',
    enquiry_handler: 'Enquiry Handler',
  };
  return roleMap[role] || role;
};

export async function POST(req: NextRequest) {
  try {
    const authorization = req.headers.get('authorization');
    if (!authorization?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = await getAdminAuth().verifyIdToken(authorization.slice(7));
    const db = getAdminDb();
    const normalizedEmail = decoded.email?.toLowerCase();
    const profileRefs = [
      db.collection('agents').doc(decoded.uid),
      db.collection('users').doc(decoded.uid),
      ...(normalizedEmail
        ? [
            db.collection('agents').doc(normalizedEmail),
            db.collection('users').doc(normalizedEmail),
          ]
        : []),
    ];

    let isAdmin = decoded.admin === true;
    for (const profileRef of profileRefs) {
      if (isAdmin) break;
      const profile = await profileRef.get();
      const data = profile.data();
      isAdmin = profile.exists && (
        data?.role === 'admin' ||
        data?.isAdmin === true ||
        data?.is_admin === true
      );
    }

    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { email, name, role, invitedBy } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const roleDisplay = getRoleDisplay(role);

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
    .highlight { color: #C9A35A; font-weight: bold; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Welcome to PLUCO GROUP</h1>
    </div>
    <div class="content">
      <p>Hello ${name},</p>

      <p>You have been invited by <strong>${invitedBy}</strong> to join PLUCO GROUP as a <span class="highlight">${roleDisplay}</span>.</p>

      <p>To get started, sign in with the invited Google account by clicking the button below:</p>

      <a href="${SIGNUP_URL}/client-sign-in" class="button">Open Secure Client Portal</a>

      <p style="margin-top: 30px; font-size: 14px;">
        <strong>Next Steps:</strong><br>
        1. Click the button above or visit: <br><code>${SIGNUP_URL}/client-sign-in</code><br>
        2. Choose secure Google sign-in<br>
        3. Use the invited email: <strong>${email}</strong><br>
        4. Start using your ${roleDisplay} dashboard
      </p>

      ${role === 'consultant' ? `
      <p style="margin-top: 20px; padding: 15px; background-color: #fff3cd; border-left: 4px solid #C9A35A; border-radius: 4px;">
        <strong>🎯 As a Consultant:</strong><br>
        After you verify your email, you'll have access to your consultant dashboard where you can:<br>
        • View and manage consultation bookings<br>
        • Set your availability and working hours<br>
        • View client reviews and ratings<br>
        • Access comprehensive training materials
      </p>
      ` : ''}

      <p style="margin-top: 30px; font-size: 13px; color: #666;">
        If you have any questions, please contact us at <strong>support@plucogroup.com</strong>
      </p>
    </div>
    <div class="footer">
      <p>&copy; 2024 PLUCO GROUP. All rights reserved.</p>
      <p>This is an automated email. Please do not reply directly.</p>
    </div>
  </div>
</body>
</html>
    `;

    const textContent = `
Welcome to PLUCO GROUP

Hello ${name},

You have been invited by ${invitedBy} to join PLUCO GROUP as a ${roleDisplay}.

To get started, open the secure client portal:

Visit: ${SIGNUP_URL}/client-sign-in
Email: ${email}
Role: ${roleDisplay}

Sign in with the invited Google account to access your dashboard.

If you have any questions, contact: support@plucogroup.com

---
© 2024 PLUCO GROUP
    `;

    const emailResult = await sendPlucoEmail({
      to: email,
      subject: `Invitation to Join PLUCO GROUP as ${roleDisplay}`,
      html: htmlContent,
      text: textContent,
    });

    console.log('Invitation email sent to:', email, 'Message ID:', emailResult.id);

    return NextResponse.json({
      success: true,
      message: `Invitation email sent to ${email}`,
    });
  } catch (error: unknown) {
    console.error('Error sending invitation email:', error);

    // Even if email fails, don't block user creation
    return NextResponse.json(
      {
        success: false,
        message: 'User created but failed to send invitation email',
        error: error instanceof Error ? error.message : 'Unknown email delivery error',
      },
      { status: 500 }
    );
  }
}
