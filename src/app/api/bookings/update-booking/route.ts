import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { doc, updateDoc, getDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://www.plucogroup.com';

type ActionType = 'cancel' | 'reschedule';

export async function POST(req: NextRequest) {
  try {
    const {
      bookingId,
      action,
      reason,
      performedBy,
      newScheduledAt,
      consultantEmail,
      consultantName,
      clientEmail,
      clientName,
      consultantUid,
      clientUid
    } = await req.json();

    if (!bookingId || !action || !performedBy) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get booking details
    const bookingRef = doc(db, 'consultation_bookings', bookingId);
    const bookingSnap = await getDoc(bookingRef);

    if (!bookingSnap.exists()) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    const bookingData = bookingSnap.data();

    // Update booking
    const updateData: any = {
      updatedAt: new Date().toISOString(),
      updatedBy: performedBy
    };

    if (action === 'cancel') {
      updateData.status = 'cancelled';
      updateData.cancelledReason = reason;
      updateData.cancelledAt = new Date().toISOString();
      updateData.cancelledBy = performedBy;
    } else if (action === 'reschedule') {
      if (!newScheduledAt) {
        return NextResponse.json(
          { error: 'New scheduled time is required for rescheduling' },
          { status: 400 }
        );
      }
      updateData.status = 'rescheduled';
      updateData.previousScheduledAt = bookingData.scheduledAt;
      updateData.scheduledAt = newScheduledAt;
      updateData.rescheduledReason = reason;
      updateData.rescheduledAt = new Date().toISOString();
      updateData.rescheduledBy = performedBy;
    }

    await updateDoc(bookingRef, updateData);

    // Create notification
    const notificationRef = collection(db, 'notifications');
    const recipientEmail = performedBy === 'consultant' ? clientEmail : consultantEmail;
    const recipientUid = performedBy === 'consultant' ? clientUid : consultantUid;

    let notificationTitle = '';
    let notificationMessage = '';
    let notificationData: any = { bookingId, action, reason };

    if (action === 'cancel') {
      notificationTitle = `Consultation Cancelled`;
      notificationMessage = performedBy === 'consultant'
        ? `${consultantName} has cancelled your consultation on ${new Date(bookingData.scheduledAt).toLocaleDateString()}`
        : `Your consultation with ${consultantName} has been cancelled`;
      notificationData.cancelledBy = performedBy;
      notificationData.cancelledReason = reason;
    } else if (action === 'reschedule') {
      notificationTitle = `Consultation Rescheduled`;
      notificationMessage = performedBy === 'consultant'
        ? `${consultantName} has rescheduled your consultation to ${new Date(newScheduledAt).toLocaleDateString()}`
        : `Your consultation with ${consultantName} has been rescheduled to ${new Date(newScheduledAt).toLocaleDateString()}`;
      notificationData.newScheduledAt = newScheduledAt;
      notificationData.previousScheduledAt = bookingData.scheduledAt;
    }

    await addDoc(notificationRef, {
      recipientUid,
      recipientEmail: recipientEmail.toLowerCase(),
      type: action === 'cancel' ? 'booking_cancelled' : 'booking_rescheduled',
      title: notificationTitle,
      message: notificationMessage,
      link: `${APP_URL}/dashboard/bookings/${bookingId}`,
      data: notificationData,
      read: false,
      createdAt: new Date().toISOString()
    });

    // Send email notification
    if (resend) {
      const htmlContent = action === 'cancel'
        ? generateCancellationEmail(performedBy, consultantName, clientName, bookingData, reason)
        : generateRescheduleEmail(performedBy, consultantName, clientName, bookingData, newScheduledAt, reason);

      const textContent = action === 'cancel'
        ? generateCancellationEmailText(performedBy, consultantName, clientName, bookingData, reason)
        : generateRescheduleEmailText(performedBy, consultantName, clientName, bookingData, newScheduledAt, reason);

      await resend.emails.send({
        from: process.env.RESEND_FROM || 'PLUCO GROUP <noreply@plucogroup.com>',
        to: recipientEmail,
        subject: action === 'cancel' ? 'Consultation Cancelled' : 'Consultation Rescheduled',
        html: htmlContent,
        text: textContent,
      });
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
          clientUid,
          clientEmail,
          clientName,
          actionType: action === 'cancel' ? 'meeting_cancelled' : 'meeting_rescheduled',
          details: {
            reason,
            performedBy,
            ...(action === 'reschedule' && { newScheduledAt, previousScheduledAt: bookingData.scheduledAt })
          }
        })
      });
    } catch (logErr) {
      console.warn('Failed to log activity:', logErr);
    }

    return NextResponse.json({
      success: true,
      message: `Booking ${action}ed successfully`,
      booking: updateData
    });
  } catch (error: any) {
    console.error('=== UPDATE BOOKING ERROR ===');
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

function generateCancellationEmail(performedBy: string, consultantName: string, clientName: string, bookingData: any, reason: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #DC2626; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background-color: #f9f9f9; padding: 20px; border: 1px solid #e0e0e0; }
    .detail-box { background-color: #FEE2E2; padding: 15px; border-left: 4px solid #DC2626; border-radius: 4px; margin: 15px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Consultation Cancelled</h1>
    </div>
    <div class="content">
      <p>Hello ${performedBy === 'consultant' ? clientName : consultantName},</p>

      <p>The consultation scheduled for <strong>${new Date(bookingData.scheduledAt).toLocaleDateString()} at ${new Date(bookingData.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</strong> has been cancelled.</p>

      <div class="detail-box">
        <p><strong>Cancelled by:</strong> ${performedBy === 'consultant' ? consultantName : 'Client'}</p>
        ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ''}
      </div>

      <p>If you have any questions, please contact us at support@plucogroup.com or use your PLUCO GROUP dashboard to schedule a new consultation.</p>
    </div>
  </div>
</body>
</html>
  `;
}

function generateRescheduleEmail(performedBy: string, consultantName: string, clientName: string, bookingData: any, newScheduledAt: string, reason: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #F59E0B; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background-color: #f9f9f9; padding: 20px; border: 1px solid #e0e0e0; }
    .detail-box { background-color: #FEF3C7; padding: 15px; border-left: 4px solid #F59E0B; border-radius: 4px; margin: 15px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Consultation Rescheduled</h1>
    </div>
    <div class="content">
      <p>Hello ${performedBy === 'consultant' ? clientName : consultantName},</p>

      <p>Your consultation has been rescheduled.</p>

      <div class="detail-box">
        <p><strong>Previous Date:</strong> ${new Date(bookingData.scheduledAt).toLocaleDateString()} at ${new Date(bookingData.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
        <p><strong>New Date:</strong> ${new Date(newScheduledAt).toLocaleDateString()} at ${new Date(newScheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
        <p><strong>Rescheduled by:</strong> ${performedBy === 'consultant' ? consultantName : 'Client'}</p>
        ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ''}
      </div>

      <p>A new Google Meet link will be sent before the scheduled time. If you have any questions, please contact us.</p>
    </div>
  </div>
</body>
</html>
  `;
}

function generateCancellationEmailText(performedBy: string, consultantName: string, clientName: string, bookingData: any, reason: string): string {
  return `
Consultation Cancelled

Hello ${performedBy === 'consultant' ? clientName : consultantName},

The consultation scheduled for ${new Date(bookingData.scheduledAt).toLocaleDateString()} at ${new Date(bookingData.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} has been cancelled.

Cancelled by: ${performedBy === 'consultant' ? consultantName : 'Client'}
${reason ? `Reason: ${reason}` : ''}

If you have any questions, please contact support@plucogroup.com
  `;
}

function generateRescheduleEmailText(performedBy: string, consultantName: string, clientName: string, bookingData: any, newScheduledAt: string, reason: string): string {
  return `
Consultation Rescheduled

Hello ${performedBy === 'consultant' ? clientName : consultantName},

Your consultation has been rescheduled.

Previous Date: ${new Date(bookingData.scheduledAt).toLocaleDateString()} at ${new Date(bookingData.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
New Date: ${new Date(newScheduledAt).toLocaleDateString()} at ${new Date(newScheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
Rescheduled by: ${performedBy === 'consultant' ? consultantName : 'Client'}
${reason ? `Reason: ${reason}` : ''}

A new Google Meet link will be sent before the scheduled time.
  `;
}
