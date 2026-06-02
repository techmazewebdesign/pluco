import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(req: NextRequest) {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const body = await req.json();
    const {
      fullName, email, phone, nationality, country,
      familyMembers, service, language, description,
    } = body;

    const isFarsi = language === 'Farsi / Persian' || language === 'فارسی';
    const timestamp = new Date().toLocaleString('en-GB', { timeZone: 'Europe/Warsaw' });
    const fromAddress = process.env.RESEND_FROM || 'PLUCO GROUP <noreply@plucogroup.com>';

    // ── 1. Notification to PLUCO GROUP ──────────────────────────────
    await resend.emails.send({
      from: fromAddress,
      to: 'info@plucogroup.com',
      subject: `New Client Enquiry – ${fullName} – ${service || 'General'}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
          <div style="background:#071C3C;padding:24px 32px;border-bottom:3px solid #C9A35A">
            <h1 style="color:#C9A35A;margin:0;font-size:20px">New Client Enquiry</h1>
            <p style="color:#CBD5E0;margin:4px 0 0;font-size:13px">PLUCO GROUP Client Portal · ${timestamp} Warsaw</p>
          </div>
          <div style="padding:32px;background:#ffffff">
            <table style="width:100%;border-collapse:collapse;font-size:14px">
              ${[
                ['Full Name', fullName || '—'],
                ['Email', email || '—'],
                ['Phone / WhatsApp', phone || '—'],
                ['Nationality', nationality || '—'],
                ['Country of Residence', country || '—'],
                ['Family Members', familyMembers || '—'],
                ['Preferred Service', service || '—'],
                ['Preferred Language', language || '—'],
              ].map(([l, v]) => `
                <tr>
                  <td style="padding:10px 0;border-bottom:1px solid #F1F5F9;color:#64748B;width:40%">${l}</td>
                  <td style="padding:10px 0;border-bottom:1px solid #F1F5F9;color:#1E2430;font-weight:600">${v}</td>
                </tr>`).join('')}
            </table>
            ${description ? `
              <div style="margin-top:24px;background:#F8F9FA;border-left:4px solid #C9A35A;padding:16px;border-radius:4px">
                <p style="color:#64748B;font-size:12px;margin:0 0 8px;text-transform:uppercase;letter-spacing:.05em">Description</p>
                <p style="color:#1E2430;font-size:14px;margin:0;line-height:1.6">${description}</p>
              </div>` : ''}
          </div>
        </div>`,
    });

    // ── 2. Confirmation to client ────────────────────────────────────
    await resend.emails.send({
      from: fromAddress,
      to: email,
      subject: isFarsi
        ? 'تأیید استعلام شما – PLUCO GROUP'
        : 'Your Enquiry Has Been Received – PLUCO GROUP',
      html: isFarsi ? `
        <div style="font-family:Tahoma,Arial,sans-serif;max-width:600px;margin:0 auto;direction:rtl;text-align:right">
          <div style="background:#071C3C;padding:24px 32px;border-bottom:3px solid #C9A35A">
            <h1 style="color:#C9A35A;margin:0;font-size:20px">استعلام شما دریافت شد</h1>
            <p style="color:#CBD5E0;margin:4px 0 0;font-size:13px">PLUCO GROUP</p>
          </div>
          <div style="padding:32px;background:#fff">
            <p style="color:#1E2430;font-size:15px;line-height:1.7">${fullName} عزیز،</p>
            <p style="color:#374151;font-size:14px;line-height:1.8">استعلام شما با موفقیت دریافت شد. تیم PLUCO GROUP ظرف ۲ روز کاری با شما تماس خواهد گرفت.</p>
            <div style="background:#F8F9FA;border-right:4px solid #C9A35A;padding:16px;border-radius:4px;margin:24px 0">
              <p style="color:#64748B;font-size:12px;margin:0 0 6px">خدمات درخواستی:</p>
              <p style="color:#1E2430;font-size:14px;margin:0;font-weight:600">${service || '—'}</p>
            </div>
            <p style="color:#374151;font-size:14px;line-height:1.8">تمامی اطلاعات شما محرمانه است و تنها برای ارزیابی موضوع شما مورد استفاده قرار می‌گیرد.</p>
            <div style="margin-top:32px;padding:20px;background:#071C3C;border-radius:8px;text-align:center">
              <p style="color:#CBD5E0;font-size:13px;margin:0 0 4px">تماس با ما</p>
              <p style="color:#C9A35A;font-size:14px;margin:0;font-weight:600">info@plucogroup.com</p>
              <p style="color:#94A3B8;font-size:12px;margin:6px 0 0">Ksawerów 3, Warsaw, 02-656, Poland</p>
            </div>
          </div>
        </div>` : `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
          <div style="background:#071C3C;padding:24px 32px;border-bottom:3px solid #C9A35A">
            <h1 style="color:#C9A35A;margin:0;font-size:20px">Enquiry Received</h1>
            <p style="color:#CBD5E0;margin:4px 0 0;font-size:13px">PLUCO GROUP – Private Client Advisory</p>
          </div>
          <div style="padding:32px;background:#fff">
            <p style="color:#1E2430;font-size:15px;line-height:1.7">Dear ${fullName},</p>
            <p style="color:#374151;font-size:14px;line-height:1.8">
              Thank you for contacting PLUCO GROUP. Your enquiry has been received and a member of our team will be in touch within 2 business days.
            </p>
            <div style="background:#F8F9FA;border-left:4px solid #C9A35A;padding:16px;border-radius:4px;margin:24px 0">
              <p style="color:#64748B;font-size:12px;margin:0 0 6px;text-transform:uppercase;letter-spacing:.05em">Service Requested</p>
              <p style="color:#1E2430;font-size:14px;margin:0;font-weight:600">${service || 'General Enquiry'}</p>
            </div>
            <p style="color:#374151;font-size:14px;line-height:1.8">
              All information you have provided is treated as strictly confidential and will only be reviewed for the purpose of assessing your matter.
            </p>
            <div style="margin-top:32px;padding:20px;background:#071C3C;border-radius:8px;text-align:center">
              <p style="color:#CBD5E0;font-size:13px;margin:0 0 4px">Contact</p>
              <p style="color:#C9A35A;font-size:14px;margin:0;font-weight:600">info@plucogroup.com</p>
              <p style="color:#94A3B8;font-size:12px;margin:6px 0 0">Ksawerów 3, Warsaw, 02-656, Poland</p>
            </div>
          </div>
        </div>`,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Enquiry API error:', err);
    return NextResponse.json(
      { success: false, error: String(err) },
      { status: 500 }
    );
  }
}
