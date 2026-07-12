import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { getAdminDb } from '@/lib/firebase-admin';

async function sendToGoogleSheets(data: any) {
  try {
    if (!process.env.GOOGLE_LEADS_WEB_APP_URL) {
      console.log('Google Leads Web App URL not configured');
      return;
    }

    // Send data without requiring secret first
    const payload = {
      fullName: data.fullName || '',
      email: data.email || '',
      phone: data.phone || '',
      nationality: data.nationality || '',
      country: data.country || '',
      language: data.language || '',
      service: data.service || '',
      familyMembers: data.familyMembers || '',
      numFamilyMembers: data.numFamilyMembers || '',
      urgency: data.urgency || '',
      preferredContact: data.preferredContact || '',
      description: data.description || '',
      timestamp: new Date().toLocaleString('en-GB', { timeZone: 'Europe/Warsaw' }),
    };

    // Include secret if configured
    if (process.env.GOOGLE_LEADS_SECRET) {
      (payload as any).secret = process.env.GOOGLE_LEADS_SECRET;
    }

    const response = await fetch(process.env.GOOGLE_LEADS_WEB_APP_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Response status ${response.status}`);
    }

    const result = await response.json();
    console.log('✓ Data sent to Google Sheets:', result);
  } catch (error) {
    console.error('✗ Error sending to Google Sheets:', error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      fullName, email, phone, nationality, country,
      familyMembers, numFamilyMembers, service, language, description, urgency, preferredContact,
      consultantId, consultantName, status, firstName, lastName, preferredDate, preferredTime,
      consent, packageInterest, locale, sourcePage,
    } = body;

    // Extract first and last name if not provided separately
    const names = fullName ? fullName.split(' ') : [];
    const firstNameValue = firstName || (names[0] || '');
    const lastNameValue = lastName || (names.slice(1).join(' ') || '');

    // Required-field validation
    const missing: string[] = [];
    if (!firstNameValue) missing.push('firstName');
    if (!lastNameValue) missing.push('lastName');
    if (!email) missing.push('email');
    if (!service) missing.push('service');
    if (!description) missing.push('description');
    if (!consent) missing.push('consent');
    if (missing.length) {
      return NextResponse.json(
        { success: false, error: `Missing required field(s): ${missing.join(', ')}` },
        { status: 400 }
      );
    }

    // Save enquiry to Firestore via Admin SDK (server-side credentials, bypasses client security rules)
    const enquiryData = {
      firstName: firstNameValue,
      lastName: lastNameValue,
      email,
      phone,
      company: body.company || '',
      service,
      description,
      packageInterest: packageInterest || null,
      nationality,
      country,
      language,
      familyMembers,
      numFamilyMembers,
      urgency,
      preferredContactMethod: preferredContact,
      preferredDate,
      preferredTime,
      consent: !!consent,
      locale: locale || null,
      sourcePage: sourcePage || null,
      consultantId: consultantId || null,
      consultantName: consultantName || null,
      status: status || (consultantId ? 'assigned' : 'pending'),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      const db = getAdminDb();
      const bookingRef = await db.collection('bookings').add({
        ...enquiryData,
        clientName: `${firstNameValue} ${lastNameValue}`,
        clientEmail: email,
        clientPhone: phone,
        countryOfResidence: country,
        message: description,
        preferredLanguage: language,
        preferredContactMethod: preferredContact,
        source: consultantId ? 'consultant_book_now' : 'private_enquiry',
      });
      console.log('✓ Booking saved to Firestore:', bookingRef.id);
    } catch (dbErr) {
      console.error('✗ Error saving booking to Firestore:', dbErr);
      if (process.env.NODE_ENV === 'production') {
        return NextResponse.json(
          { success: false, error: 'Server misconfiguration: unable to save enquiry.' },
          { status: 500 }
        );
      }
      console.log('[dev] Enquiry (not persisted, Firestore unavailable):', enquiryData);
    }

    const isFarsi = language === 'Farsi / Persian' || language === 'فارسی' || locale === 'fa';
    const timestamp = new Date().toLocaleString('en-GB', { timeZone: 'Europe/Warsaw' });
    const fromAddress = process.env.RESEND_FROM || 'PLUCO GROUP <noreply@plucogroup.com>';
    const toAddress = process.env.PRIVATE_ENQUIRY_TO_EMAIL || 'info@plucogroup.com';

    if (!process.env.RESEND_API_KEY) {
      console.log('Resend API key not configured — enquiry logged instead of emailed:', enquiryData);
      if (process.env.NODE_ENV === 'production') {
        return NextResponse.json(
          { success: false, error: 'Server misconfiguration: email service not configured.' },
          { status: 500 }
        );
      }
      return NextResponse.json({ success: true, dev: true });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    // ── 0. Send to Google Sheets ────────────────────────────────────
    await sendToGoogleSheets({
      fullName, email, phone, nationality, country, familyMembers, numFamilyMembers,
      service, language, description, urgency, preferredContact,
    });

    // ── 1. Notification to PLUCO GROUP ──────────────────────────────
    await resend.emails.send({
      from: fromAddress,
      to: toAddress,
      subject: `New Private Enquiry — ${service || 'General'}`,
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
                ['Package Interest', packageInterest || '—'],
                ['Preferred Language', language || '—'],
                ['Urgency', urgency || '—'],
                ['Preferred Contact Method', preferredContact || '—'],
                ['Locale', locale || '—'],
                ['Source Page', sourcePage || '—'],
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
