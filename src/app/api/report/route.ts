import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(req: NextRequest) {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { type, title, content, createdByName, sentAt } = await req.json();
    const from = process.env.RESEND_FROM || 'PLUCO GROUP <noreply@plucogroup.com>';

    await resend.emails.send({
      from,
      to: 'info@plucogroup.com',
      subject: `[Agent Report] ${title}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:660px;margin:0 auto">
          <div style="background:#071C3C;padding:24px 32px;border-bottom:3px solid #C9A35A">
            <h1 style="color:#C9A35A;margin:0;font-size:18px">Agent Report</h1>
            <p style="color:#CBD5E0;margin:4px 0 0;font-size:13px">PLUCO GROUP Agent Portal · ${new Date(sentAt).toLocaleString('en-GB', { timeZone: 'Europe/Warsaw' })} Warsaw</p>
          </div>
          <div style="padding:32px;background:#fff">
            <table style="width:100%;border-collapse:collapse;font-size:14px;margin-bottom:24px">
              <tr><td style="padding:8px 0;border-bottom:1px solid #F1F5F9;color:#64748B;width:30%">Report Type</td><td style="padding:8px 0;border-bottom:1px solid #F1F5F9;color:#1E2430;font-weight:600">${type.replace(/_/g, ' ').toUpperCase()}</td></tr>
              <tr><td style="padding:8px 0;border-bottom:1px solid #F1F5F9;color:#64748B">Title</td><td style="padding:8px 0;border-bottom:1px solid #F1F5F9;color:#1E2430;font-weight:600">${title}</td></tr>
              <tr><td style="padding:8px 0;border-bottom:1px solid #F1F5F9;color:#64748B">Prepared by</td><td style="padding:8px 0;border-bottom:1px solid #F1F5F9;color:#1E2430;font-weight:600">${createdByName}</td></tr>
            </table>
            <div style="background:#F8F9FA;border-left:4px solid #C9A35A;padding:20px;border-radius:4px">
              <p style="color:#64748B;font-size:11px;margin:0 0 12px;text-transform:uppercase;letter-spacing:.05em">Report Content</p>
              <p style="color:#1E2430;font-size:14px;margin:0;line-height:1.7;white-space:pre-wrap">${content}</p>
            </div>
          </div>
          <div style="padding:16px 32px;background:#F8F9FA;border-top:1px solid #E5E7EB">
            <p style="color:#94A3B8;font-size:11px;margin:0">Sent via PLUCO GROUP Agent Portal · plucogroup.com</p>
          </div>
        </div>`,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Report API error:', err);
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}
