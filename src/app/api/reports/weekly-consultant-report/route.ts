import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const ADMIN_EMAIL = 'info@plucogroup.com';

interface ActivitySummary {
  consultant: string;
  email: string;
  totalMeetingsSent: number;
  totalMeetingsCreated: number;
  totalCancellations: number;
  totalReschedules: number;
  profileUpdates: number;
  activities: any[];
}

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    const expectedSecret = process.env.CRON_SECRET || 'your-secret-key';

    if (authHeader !== `Bearer ${expectedSecret}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (!resend) {
      throw new Error('Email service not configured');
    }

    // Calculate date range for last 7 days
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);

    // Fetch all activities from the past week
    const activitiesSnap = await getDocs(
      query(
        collection(db, 'consultant_activities'),
        orderBy('createdAt', 'desc')
      )
    );

    const allActivities = activitiesSnap.docs
      .map(doc => {
        const data = doc.data();
        return {
          consultantUid: data.consultantUid || '',
          consultantEmail: data.consultantEmail || '',
          consultantName: data.consultantName || '',
          actionType: data.actionType || '',
          bookingId: data.bookingId,
          clientEmail: data.clientEmail,
          clientName: data.clientName,
          details: data.details,
          createdAt: data.createdAt?.toDate?.() || data.createdAt || new Date()
        };
      })
      .filter(a => {
        const actDate = new Date(a.createdAt);
        return actDate >= startDate && actDate <= endDate;
      });

    // Group by consultant
    const consultantMap = new Map<string, ActivitySummary>();

    allActivities.forEach(activity => {
      const key = activity.consultantUid;
      if (!consultantMap.has(key)) {
        consultantMap.set(key, {
          consultant: activity.consultantName,
          email: activity.consultantEmail,
          totalMeetingsSent: 0,
          totalMeetingsCreated: 0,
          totalCancellations: 0,
          totalReschedules: 0,
          profileUpdates: 0,
          activities: []
        });
      }

      const summary = consultantMap.get(key)!;
      summary.activities.push(activity);

      switch (activity.actionType) {
        case 'meeting_sent':
          summary.totalMeetingsSent++;
          break;
        case 'meeting_created':
          summary.totalMeetingsCreated++;
          break;
        case 'meeting_cancelled':
          summary.totalCancellations++;
          break;
        case 'meeting_rescheduled':
          summary.totalReschedules++;
          break;
        case 'profile_updated':
          summary.profileUpdates++;
          break;
      }
    });

    const summaries = Array.from(consultantMap.values());

    const htmlContent = generateReportHTML(summaries, startDate, endDate);
    const textContent = generateReportText(summaries, startDate, endDate);

    // Send email to admin
    const emailResult = await resend.emails.send({
      from: process.env.RESEND_FROM || 'PLUCO GROUP <noreply@plucogroup.com>',
      to: ADMIN_EMAIL,
      subject: `Weekly Consultant Activity Report - ${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()}`,
      html: htmlContent,
      text: textContent,
    });

    if (emailResult.error) {
      console.error('Resend email error:', emailResult.error);
      throw new Error(`Failed to send email: ${emailResult.error.message}`);
    }

    console.log('Weekly report sent to:', ADMIN_EMAIL, 'Message ID:', emailResult.data?.id);

    return NextResponse.json({
      success: true,
      message: 'Weekly report sent successfully',
      summaries: summaries.map(s => ({
        consultant: s.consultant,
        email: s.email,
        stats: {
          totalMeetingsSent: s.totalMeetingsSent,
          totalMeetingsCreated: s.totalMeetingsCreated,
          totalCancellations: s.totalCancellations,
          totalReschedules: s.totalReschedules,
          profileUpdates: s.profileUpdates
        }
      }))
    });
  } catch (error: any) {
    console.error('=== WEEKLY REPORT ERROR ===');
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

function generateReportHTML(summaries: ActivitySummary[], startDate: Date, endDate: Date): string {
  const rows = summaries.map(s => `
    <tr style="border-bottom: 1px solid #E5E7EB;">
      <td style="padding: 12px; text-align: left;">
        <strong style="color: #071C3C;">${s.consultant}</strong><br>
        <span style="color: #5E6470; font-size: 12px;">${s.email}</span>
      </td>
      <td style="padding: 12px; text-align: center; color: #1E2430;">${s.totalMeetingsCreated}</td>
      <td style="padding: 12px; text-align: center; color: #1E2430;">${s.totalMeetingsSent}</td>
      <td style="padding: 12px; text-align: center; color: #DC2626;">${s.totalCancellations}</td>
      <td style="padding: 12px; text-align: center; color: #F59E0B;">${s.totalReschedules}</td>
      <td style="padding: 12px; text-align: center; color: #1E2430;">${s.profileUpdates}</td>
    </tr>
  `).join('');

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; color: #333; }
    .container { max-width: 800px; margin: 0 auto; padding: 20px; }
    .header { background-color: #071C3C; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background-color: #f9f9f9; padding: 20px; border: 1px solid #e0e0e0; }
    .footer { background-color: #f0f0f0; padding: 10px; text-align: center; font-size: 12px; color: #666; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th { background-color: #F3F4F6; padding: 12px; text-align: left; font-weight: bold; color: #071C3C; border-bottom: 2px solid #C9A35A; }
    .summary-box { background-color: #DBEAFE; padding: 15px; border-left: 4px solid #3B82F6; border-radius: 4px; margin: 15px 0; }
    .stat-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin: 15px 0; }
    .stat-item { background-color: #F3F4F6; padding: 15px; border-radius: 4px; text-align: center; }
    .stat-number { font-size: 24px; font-weight: bold; color: #C9A35A; }
    .stat-label { font-size: 12px; color: #5E6470; margin-top: 5px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Weekly Consultant Activity Report</h1>
      <p style="margin: 10px 0 0 0;">${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}</p>
    </div>
    <div class="content">
      <p>Hello Admin,</p>

      <p>Here is your weekly summary of consultant activities on the PLUCO GROUP platform.</p>

      <div class="stat-grid">
        <div class="stat-item">
          <div class="stat-number">${summaries.length}</div>
          <div class="stat-label">Active Consultants</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">${summaries.reduce((sum, s) => sum + s.totalMeetingsSent, 0)}</div>
          <div class="stat-label">Meetings Sent</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">${summaries.reduce((sum, s) => sum + s.totalCancellations, 0)}</div>
          <div class="stat-label">Cancellations</div>
        </div>
      </div>

      <h3 style="color: #071C3C; margin-top: 25px;">Consultant Activity Details</h3>
      <table>
        <thead>
          <tr style="border-bottom: 2px solid #C9A35A;">
            <th>Consultant</th>
            <th>Meetings Created</th>
            <th>Meetings Sent</th>
            <th>Cancellations</th>
            <th>Reschedules</th>
            <th>Profile Updates</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>

      <div class="summary-box">
        <p style="margin: 0;"><strong>Note:</strong> This report includes all activities logged during the specified period. Use the Consultant Activities dashboard for detailed activity logs and filtering options.</p>
      </div>

      <p style="margin-top: 30px; font-size: 13px; color: #666;">
        <strong>Access the full dashboard:</strong> <a href="https://www.plucogroup.com/admin/dashboard/consultant-activities" style="color: #C9A35A;">View Consultant Activities</a>
      </p>
    </div>
    <div class="footer">
      <p>&copy; 2024 PLUCO GROUP. All rights reserved.</p>
      <p>This is an automated report generated weekly.</p>
    </div>
  </div>
</body>
</html>
  `;
}

function generateReportText(summaries: ActivitySummary[], startDate: Date, endDate: Date): string {
  const rows = summaries.map(s => `
${s.consultant} (${s.email})
- Meetings Created: ${s.totalMeetingsCreated}
- Meetings Sent: ${s.totalMeetingsSent}
- Cancellations: ${s.totalCancellations}
- Reschedules: ${s.totalReschedules}
- Profile Updates: ${s.profileUpdates}
  `).join('\n');

  return `
Weekly Consultant Activity Report
${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}

Summary:
- Active Consultants: ${summaries.length}
- Total Meetings Sent: ${summaries.reduce((sum, s) => sum + s.totalMeetingsSent, 0)}
- Total Cancellations: ${summaries.reduce((sum, s) => sum + s.totalCancellations, 0)}

Consultant Activity Details:

${rows}

Access the full dashboard: https://www.plucogroup.com/admin/dashboard/consultant-activities

---
© 2024 PLUCO GROUP
This is an automated report generated weekly.
  `;
}
