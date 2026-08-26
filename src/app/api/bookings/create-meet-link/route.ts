import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://www.plucogroup.com';

function generateMeetLink(): string {
  const characters = 'abcdefghijklmnopqrstuvwxyz';
  let result = '';
  for (let i = 0; i < 10; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return `https://meet.google.com/${result}`;
}

export async function POST(req: NextRequest) {
  try {
    const { bookingId, clientEmail, clientName, consultantEmail, consultantName, consultantUid, scheduledAt, title } = await req.json();

    if (!bookingId || !clientEmail || !consultantEmail) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!resend) {
      throw new Error('Email service not configured');
    }

    // Generate meet link
    const meetLink = generateMeetLink();

    // Update booking with meet link
    await updateDoc(doc(db, 'consultation_bookings', bookingId), {
      meetingLink: meetLink,
      meetingLinkCreatedAt: new Date().toISOString(),
      meetingLinkCreatedBy: consultantUid
    });

    const scheduledDate = new Date(scheduledAt);

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
    .detail-box { background-color: #f3f4f6; padding: 15px; border-left: 4px solid #C9A35A; border-radius: 4px; margin: 15px 0; }
    .detail-item { margin: 8px 0; }
    .detail-label { font-weight: bold; color: #071C3C; }
    .warning { background-color: #FEF3C7; border-left: 4px solid #F59E0B; padding: 15px; margin: 15px 0; border-radius: 4px; }
    .warning-text { color: #92400E; font-size: 13px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Your Google Meet Link</h1>
    </div>
    <div class="content">
      <p>Hello ${clientName},</p>

      <p>Your consultant, <strong>${consultantName}</strong>, has created a Google Meet link for your consultation.</p>

      <div class="detail-box">
        <p style="margin-top: 0;"><strong>Meeting Details:</strong></p>
        <div class="detail-item">
          <span class="detail-label">Topic:</span> ${title}
        </div>
        <div class="detail-item">
          <span class="detail-label">Date & Time:</span> ${scheduledDate.toLocaleDateString()} at ${scheduledDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
        <div class="detail-item">
          <span class="detail-label">Consultant:</span> ${consultantName}
        </div>
      </div>

      <p style="text-align: center; margin-top: 30px;">
        <a href="${meetLink}" class="button">Join Google Meet</a>
      </p>

      <p style="text-align: center; font-size: 14px; color: #5E6470; margin-top: 15px;">
        Or copy this link: <br>
        <code style="background-color: #f3f4f6; padding: 8px 12px; border-radius: 4px; display: inline-block; margin-top: 8px;">
          ${meetLink}
        </code>
      </p>

      <div class="warning">
        <p class="warning-text" style="margin: 0;">
          <strong>⚠️ Important:</strong> This consultation is taking place through PLUCO GROUP platform.
          Please join at the scheduled time. If you have any issues, contact info@plucogroup.com
        </p>
      </div>

      <p style="margin-top: 30px; font-size: 13px; color: #666;">
        If you need to reschedule or cancel, please use your PLUCO GROUP dashboard.
      </p>
    </div>
    <div class="footer">
      <p>&copy; 2024 PLUCO GROUP. All rights reserved.</p>
      <p>This consultation is monitored for quality and compliance purposes.</p>
    </div>
  </div>
</body>
</html>
    `;

    const textContent = `
Your Google Meet Link

Hello ${clientName},

Your consultant, ${consultantName}, has created a Google Meet link for your consultation.

Meeting Details:
- Topic: ${title}
- Date & Time: ${scheduledDate.toLocaleDateString()} at ${scheduledDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
- Consultant: ${consultantName}

Join Google Meet:
${meetLink}

Or copy this link if the button doesn't work:
${meetLink}

IMPORTANT: This consultation is taking place through PLUCO GROUP platform.
Please join at the scheduled time. If you have any issues, contact info@plucogroup.com

If you need to reschedule or cancel, please use your PLUCO GROUP dashboard.

---
© 2024 PLUCO GROUP
This consultation is monitored for quality and compliance purposes.
    `;

    // Send email to client with meet link
    const emailResult = await resend.emails.send({
      from: process.env.RESEND_FROM || 'PLUCO GROUP <noreply@plucogroup.com>',
      to: clientEmail,
      subject: `Google Meet Link for Your Consultation with ${consultantName}`,
      html: htmlContent,
      text: textContent,
    });

    if (emailResult.error) {
      console.error('Resend email error:', emailResult.error);
      throw new Error(`Failed to send email: ${emailResult.error.message}`);
    }

    // Log activity
    try {
      await fetch(`${process.env.NEXT_PUBLIC_APP_URL || APP_URL}/api/consultants/log-activity`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          consultantUid,
          consultantEmail,
          consultantName,
          bookingId,
          clientUid: undefined,
          clientEmail,
          clientName,
          actionType: 'meeting_sent',
          details: {
            meetLink,
            title,
            scheduledAt
          }
        })
      });
    } catch (logErr) {
      console.warn('Failed to log activity:', logErr);
    }

    console.log('Meet link sent to:', clientEmail, 'Link:', meetLink);

    return NextResponse.json({
      success: true,
      meetLink,
      message: 'Google Meet link created and sent to client'
    });
  } catch (error: any) {
    console.error('=== CREATE MEET LINK ERROR ===');
    console.error('Error:', error.message);

    return NextResponse.json(
      {
        success: false,
        error: error.message
      },
      { status: 500 }
    );
  }
}
