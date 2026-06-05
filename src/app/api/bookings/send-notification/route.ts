import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { doc, getDoc, addDoc, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://www.plucogroup.com';

export async function POST(req: NextRequest) {
  try {
    const { consultantUid, consultantEmail, consultantName, clientName, clientEmail, bookingDetails } = await req.json();

    if (!resend) {
      throw new Error('Email service not configured');
    }

    // Get consultant details for personalization
    let consultantPhone = '';
    try {
      const agentRef = doc(db, 'agents', consultantEmail.toLowerCase());
      const agentSnap = await getDoc(agentRef);
      if (agentSnap.exists()) {
        consultantPhone = agentSnap.data().personalEmail || agentSnap.data().email || '';
      }
    } catch (err) {
      console.log('Could not fetch consultant details:', err);
    }

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
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>New Consultation Booking Request</h1>
    </div>
    <div class="content">
      <p>Hello ${consultantName},</p>

      <p>Great news! You have received a new consultation booking request.</p>

      <div class="detail-box">
        <p style="margin-top: 0;"><strong>Booking Details:</strong></p>
        <div class="detail-item">
          <span class="detail-label">Client Name:</span> ${clientName}
        </div>
        <div class="detail-item">
          <span class="detail-label">Client Email:</span> ${clientEmail}
        </div>
        <div class="detail-item">
          <span class="detail-label">Date & Time:</span> ${new Date(bookingDetails.scheduledAt).toLocaleString()}
        </div>
        <div class="detail-item">
          <span class="detail-label">Duration:</span> ${bookingDetails.duration} minutes
        </div>
        <div class="detail-item">
          <span class="detail-label">Meeting Platform:</span> ${bookingDetails.meetingPlatform}
        </div>
        ${bookingDetails.title ? `<div class="detail-item">
          <span class="detail-label">Title:</span> ${bookingDetails.title}
        </div>` : ''}
        ${bookingDetails.description ? `<div class="detail-item">
          <span class="detail-label">Description:</span> ${bookingDetails.description}
        </div>` : ''}
      </div>

      <p><strong>Next Steps:</strong></p>
      <ul>
        <li>Review the booking details in your consultant dashboard</li>
        <li>Confirm or decline the booking request</li>
        <li>Prepare your meeting materials</li>
        <li>Contact the client if you need additional information</li>
      </ul>

      <a href="${APP_URL}/consultant/dashboard" class="button">View Booking in Dashboard</a>

      <p style="margin-top: 30px; font-size: 14px;">
        <strong>Quick Actions:</strong><br>
        You can confirm this booking directly from your consultant dashboard.
      </p>

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
New Consultation Booking Request

Hello ${consultantName},

You have received a new consultation booking request.

Booking Details:
- Client Name: ${clientName}
- Client Email: ${clientEmail}
- Date & Time: ${new Date(bookingDetails.scheduledAt).toLocaleString()}
- Duration: ${bookingDetails.duration} minutes
- Meeting Platform: ${bookingDetails.meetingPlatform}
${bookingDetails.title ? `- Title: ${bookingDetails.title}` : ''}
${bookingDetails.description ? `- Description: ${bookingDetails.description}` : ''}

Next Steps:
1. Review the booking details in your consultant dashboard
2. Confirm or decline the booking request
3. Prepare your meeting materials
4. Contact the client if you need additional information

View your dashboard: ${APP_URL}/consultant/dashboard

If you have any questions, contact: support@plucogroup.com

---
© 2024 PLUCO GROUP
    `;

    // Send email to consultant
    const emailResult = await resend.emails.send({
      from: process.env.RESEND_FROM || 'PLUCO GROUP <noreply@plucogroup.com>',
      to: consultantEmail,
      subject: `New Booking Request from ${clientName}`,
      html: htmlContent,
      text: textContent,
    });

    if (emailResult.error) {
      console.error('Resend email error:', emailResult.error);
      throw new Error(`Failed to send email: ${emailResult.error.message}`);
    }

    console.log('Booking notification email sent to:', consultantEmail, 'Message ID:', emailResult.data?.id);

    // Also create an in-app notification
    try {
      const inAppNotificationRef = collection(db, 'notifications');
      await addDoc(inAppNotificationRef, {
        recipientUid: consultantUid,
        recipientEmail: consultantEmail.toLowerCase(),
        type: 'booking_request',
        title: `New Booking Request from ${clientName}`,
        message: `You have received a new consultation booking request from ${clientName}. Date: ${new Date(bookingDetails.scheduledAt).toLocaleDateString()}`,
        link: `${APP_URL}/consultant/dashboard`,
        data: {
          clientName,
          clientEmail,
          bookingDetails
        },
        read: false,
        createdAt: new Date().toISOString()
      });
    } catch (notifErr) {
      console.warn('Failed to create in-app notification:', notifErr);
    }

    return NextResponse.json({
      success: true,
      message: 'Booking notification email and in-app notification sent to consultant',
    });
  } catch (error: any) {
    console.error('=== BOOKING NOTIFICATION ERROR ===');
    console.error('Error:', error.message);

    // Don't fail the booking if email fails
    return NextResponse.json(
      {
        success: false,
        message: 'Booking created but failed to send notification email',
        error: error.message,
      },
      { status: 500 }
    );
  }
}
