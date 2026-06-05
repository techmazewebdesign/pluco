import { NextRequest, NextResponse } from 'next/server';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Lead } from '@/lib/types';
import { Resend } from 'resend';

export const runtime = 'nodejs';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET(request: NextRequest) {
  try {
    // Verify cron secret token (optional security)
    const cronSecret = request.headers.get('authorization');
    const expectedSecret = process.env.CRON_SECRET || 'default-secret';

    // For testing, allow requests without secret
    // In production, you'd verify the secret
    if (cronSecret && !cronSecret.includes(expectedSecret)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get admin emails (send to both)
    const adminEmails = ['info@plucogroup.com', 'desivo.de@gmail.com'];

    // Get all leads
    const leadsSnap = await getDocs(collection(db, 'leads'));
    const allLeads: (Lead & { id: string })[] = leadsSnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data() as any
    }));

    // Filter high-priority leads not yet contacted
    const highPriorityLeads = allLeads.filter(
      lead => lead.priorityLevel === 'High' && lead.status === 'New'
    );

    // Filter stale leads (not updated for 7+ days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const stalLeads = allLeads.filter(lead => {
      const lastUpdate = new Date(lead.updatedAt || lead.createdAt);
      return lead.status === 'New' && lastUpdate < sevenDaysAgo;
    });

    // Calculate week summary (last 7 days)
    const sevenDaysAgoTime = new Date();
    sevenDaysAgoTime.setDate(sevenDaysAgoTime.getDate() - 7);

    const newLeadsThisWeek = allLeads.filter(lead => {
      const createdDate = new Date(lead.createdAt);
      return createdDate > sevenDaysAgoTime;
    }).length;

    const contactedLeads = allLeads.filter(lead => lead.status === 'Contacted').length;
    const conversions = allLeads.filter(lead => lead.status === 'Converted').length;

    const summaryData = {
      highPriorityLeads,
      stalLeads,
      totalLeads: allLeads.length,
      conversions,
      weekSummary: {
        newLeads: newLeadsThisWeek,
        contacted: contactedLeads,
        converted: conversions
      }
    };

    // Generate email HTML
    const emailHTML = generateEmailHTML(summaryData);

    // Send email to both recipients
    const results = await Promise.all(
      adminEmails.map(email =>
        resend.emails.send({
          from: process.env.RESEND_FROM || 'PLUCO <noreply@plucogroup.com>',
          to: email,
          subject: `📊 Weekly Lead Summary - ${new Date().toLocaleDateString()}`,
          html: emailHTML,
        })
      )
    );

    return NextResponse.json({
      success: true,
      message: `Weekly summary email sent to ${adminEmails.join(', ')}`,
      stats: summaryData,
      results
    });
  } catch (error) {
    console.error('Cron job error:', error);
    return NextResponse.json(
      {
        error: 'Cron job failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

function generateEmailHTML(data: any): string {
  const { highPriorityLeads, stalLeads, totalLeads, conversions, weekSummary } = data;

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
            <p>Your PLUCO CRM Weekly Report - ${new Date().toLocaleDateString()}</p>
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
            <p>These ${highPriorityLeads.length} lead(s) need immediate attention:</p>
            ${highPriorityLeads.slice(0, 5).map((lead: Lead & { id: string }) => `
              <div class="lead-item">
                <div class="lead-name">${lead.fullName}</div>
                <div class="lead-details">
                  <strong>Service:</strong> ${lead.serviceInterest} |
                  <strong>Score:</strong> <span class="priority-high">${lead.priorityScore}/100</span><br>
                  <strong>Email:</strong> ${lead.email}<br>
                  <strong>Phone:</strong> ${lead.phone || 'N/A'}<br>
                  <strong>Added:</strong> ${new Date(lead.createdAt).toLocaleDateString()}
                </div>
              </div>
            `).join('')}
            ${highPriorityLeads.length > 5 ? `<p style="color: #5E6470; font-size: 12px;">... and ${highPriorityLeads.length - 5} more</p>` : ''}
            <a href="https://yoursite.com/admin/dashboard/leads" class="button">View All Leads →</a>
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
            <p>These ${stalLeads.length} lead(s) need a follow-up:</p>
            ${stalLeads.slice(0, 5).map((lead: Lead & { id: string }) => `
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
            ${stalLeads.length > 5 ? `<p style="color: #5E6470; font-size: 12px;">... and ${stalLeads.length - 5} more</p>` : ''}
            <a href="https://yoursite.com/admin/dashboard/leads" class="button">Send Follow-up Messages →</a>
          </div>
          ` : `
          <div class="section">
            <div class="empty-state">✅ No stale leads - great job staying on top of follow-ups!</div>
          </div>
          `}

          <div class="footer">
            <p>This is an automated weekly summary from PLUCO CRM</p>
            <p>Generated: ${new Date().toLocaleString()}</p>
          </div>
        </div>
      </body>
    </html>
  `;
}
