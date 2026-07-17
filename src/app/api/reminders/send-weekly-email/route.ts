import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { Lead } from '@/lib/types';

export const runtime = 'nodejs';

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

type WeeklySummaryData = {
  highPriorityLeads: Lead[];
  stalLeads: Lead[];
  totalLeads: number;
  conversions: number;
  weekSummary: {
    newLeads: number;
    contacted: number;
    converted: number;
  };
};

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!resend) {
      return NextResponse.json(
        { error: 'Email service is not configured.' },
        { status: 503 }
      );
    }

    const { summaryData, recipientEmail } = await request.json() as {
      summaryData: WeeklySummaryData;
      recipientEmail: string;
    };

    const emailContent = generateEmailHTML(summaryData);

    const result = await resend.emails.send({
      from: process.env.RESEND_FROM || 'PLUCO <noreply@plucogroup.com>',
      to: recipientEmail,
      subject: `📊 Weekly Lead Summary - ${new Date().toLocaleDateString()}`,
      html: emailContent,
    });

    return NextResponse.json({
      success: true,
      message: 'Weekly summary email sent',
      result
    });
  } catch (error) {
    console.error('Error sending weekly email:', error);
    return NextResponse.json(
      { error: 'Failed to send email', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

function generateEmailHTML(data: WeeklySummaryData): string {
  const { highPriorityLeads, stalLeads, totalLeads, weekSummary } = data;

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #1E2430 0%, #2D3E50 100%); color: white; padding: 30px; border-radius: 8px; margin-bottom: 20px; }
          .header h1 { margin: 0; font-size: 24px; }
          .header p { margin: 5px 0 0 0; opacity: 0.9; }
          .section { background: #f8f9fa; padding: 20px; margin-bottom: 20px; border-radius: 8px; border-left: 4px solid #C9A35A; }
          .section h2 { margin-top: 0; color: #1E2430; font-size: 18px; }
          .stat-box { display: inline-block; background: white; padding: 15px; margin: 10px 5px 10px 0; border-radius: 6px; text-align: center; min-width: 100px; }
          .stat-number { font-size: 28px; font-weight: bold; color: #C9A35A; }
          .stat-label { font-size: 12px; color: #5E6470; margin-top: 5px; }
          .lead-item { background: white; padding: 12px; margin: 10px 0; border-radius: 6px; border-left: 3px solid #C9A35A; }
          .lead-name { font-weight: bold; color: #1E2430; }
          .lead-details { font-size: 13px; color: #5E6470; margin-top: 5px; }
          .priority-high { color: #DC2626; font-weight: bold; }
          .priority-medium { color: #92400E; font-weight: bold; }
          .priority-low { color: #15803D; font-weight: bold; }
          .button { display: inline-block; background: #C9A35A; color: #071C3C; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 10px 0; }
          .empty-state { color: #94A3B8; text-align: center; padding: 20px; }
          .footer { text-align: center; color: #5E6470; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #E5E7EB; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📊 Weekly Lead Summary</h1>
            <p>Your PLUCO CRM Weekly Report</p>
          </div>

          <!-- Key Metrics -->
          <div class="section">
            <h2>📈 This Week's Overview</h2>
            <div>
              <div class="stat-box">
                <div class="stat-number">${weekSummary.newLeads}</div>
                <div class="stat-label">New Leads</div>
              </div>
              <div class="stat-box">
                <div class="stat-number">${weekSummary.contacted}</div>
                <div class="stat-label">Contacted</div>
              </div>
              <div class="stat-box">
                <div class="stat-number">${weekSummary.converted}</div>
                <div class="stat-label">Conversions</div>
              </div>
              <div class="stat-box">
                <div class="stat-number">${totalLeads}</div>
                <div class="stat-label">Total Leads</div>
              </div>
            </div>
          </div>

          <!-- High Priority Leads -->
          ${highPriorityLeads.length > 0 ? `
          <div class="section">
            <h2>🔥 High Priority Leads (Waiting for Outreach)</h2>
            <p>These leads need immediate attention:</p>
            ${highPriorityLeads.map((lead: Lead) => `
              <div class="lead-item">
                <div class="lead-name">${lead.fullName}</div>
                <div class="lead-details">
                  <strong>Service:</strong> ${lead.serviceInterest} |
                  <strong>Priority Score:</strong> <span class="priority-high">${lead.priorityScore}/100</span><br>
                  <strong>Email:</strong> ${lead.email}<br>
                  <strong>Phone:</strong> ${lead.phone || 'N/A'}<br>
                  <strong>Added:</strong> ${new Date(lead.createdAt).toLocaleDateString()}
                </div>
              </div>
            `).join('')}
            <a href="http://localhost:3000/admin/dashboard/leads" class="button">View All Leads →</a>
          </div>
          ` : `
          <div class="section">
            <div class="empty-state">✅ All high-priority leads are up to date!</div>
          </div>
          `}

          <!-- Stale Leads -->
          ${stalLeads.length > 0 ? `
          <div class="section">
            <h2>⏰ Follow-up Needed (Not contacted for 7+ days)</h2>
            <p>These leads need a follow-up message:</p>
            ${stalLeads.map((lead: Lead) => `
              <div class="lead-item">
                <div class="lead-name">${lead.fullName}</div>
                <div class="lead-details">
                  <strong>Service:</strong> ${lead.serviceInterest} |
                  <strong>Score:</strong> <span class="priority-${lead.priorityLevel.toLowerCase()}">${lead.priorityScore}/100</span><br>
                  <strong>Email:</strong> ${lead.email}<br>
                  <strong>Last Activity:</strong> ${new Date(lead.updatedAt || lead.createdAt).toLocaleDateString()}
                </div>
              </div>
            `).join('')}
            <a href="http://localhost:3000/admin/dashboard/leads" class="button">Send Follow-up Messages →</a>
          </div>
          ` : `
          <div class="section">
            <div class="empty-state">✅ No stale leads - great job staying on top of follow-ups!</div>
          </div>
          `}

          <!-- Quick Action -->
          <div class="section" style="text-align: center;">
            <h2>💡 Quick Actions</h2>
            <p>
              <a href="http://localhost:3000/admin/dashboard/leads" class="button">Go to Lead Dashboard</a>
            </p>
          </div>

          <div class="footer">
            <p>This is an automated weekly summary from PLUCO CRM</p>
            <p>Generated: ${new Date().toLocaleString()}</p>
          </div>
        </div>
      </body>
    </html>
  `;
}
