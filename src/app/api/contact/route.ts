import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    console.log('=== [CONTACT API] Form submission received ===');
    const body = await req.json();
    console.log('[CONTACT API] Payload:', {
      fullName: body.fullName,
      email: body.email,
      serviceNeeded: body.serviceNeeded,
    });

    // Validate required fields
    if (!body.fullName?.trim() || !body.email?.trim()) {
      console.error('[CONTACT API] Missing required fields');
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get environment variables
    const webAppUrl = process.env.GOOGLE_LEADS_WEB_APP_URL;
    const secret = process.env.GOOGLE_LEADS_SECRET;
    const resendApiKey = process.env.RESEND_API_KEY;

    console.log('[CONTACT API] Env check:', {
      hasWebAppUrl: !!webAppUrl,
      hasSecret: !!secret,
      hasResendKey: !!resendApiKey,
    });

    if (!webAppUrl || !secret) {
      console.error('[CONTACT API] CRITICAL: Missing Google Apps Script configuration');
      console.error('[CONTACT API] webAppUrl exists:', !!webAppUrl);
      console.error('[CONTACT API] secret exists:', !!secret);
      return NextResponse.json(
        { success: false, error: 'Server configuration error - Google Apps Script not configured' },
        { status: 500 }
      );
    }

    // Step 1: Send to Google Apps Script
    console.log('[CONTACT API] Calling Google Apps Script webhook...');
    const googlePayload = {
      secret,
      fullName: body.fullName.trim(),
      email: body.email.trim(),
      phone: body.phone?.trim() || '',
      currentCountry: body.currentCountry?.trim() || '',
      preferredLanguage: body.preferredLanguage || 'English',
      serviceNeeded: body.serviceNeeded?.trim() || '',
      shortCaseDescription: body.shortCaseDescription?.trim() || '',
    };

    console.log('[CONTACT API] Payload being sent to GAS');

    const gasResponse = await fetch(webAppUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(googlePayload),
    });

    const gasText = await gasResponse.text();
    console.log('[CONTACT API] Google Apps Script response status:', gasResponse.status);
    console.log('[CONTACT API] Google Apps Script response body:', gasText);

    if (!gasResponse.ok) {
      console.error('[CONTACT API] Google Apps Script returned non-200 status');
      // Don't fail here - we'll still try to send email
    } else {
      console.log('[CONTACT API] ✅ Successfully sent to Google Apps Script');
    }

    // Step 2: Send Email Notification using Resend
    if (resendApiKey) {
      console.log('[CONTACT API] Sending email notification...');
      try {
        const emailResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${resendApiKey}`,
          },
          body: JSON.stringify({
            from: 'noreply@plucogroup.com',
            to: 'info@plucogroup.com',
            subject: `New Enquiry from ${body.fullName}`,
            html: `
              <h2>New Contact Form Submission</h2>
              <p><strong>Name:</strong> ${body.fullName}</p>
              <p><strong>Email:</strong> ${body.email}</p>
              <p><strong>Phone:</strong> ${body.phone || 'Not provided'}</p>
              <p><strong>Country:</strong> ${body.currentCountry || 'Not provided'}</p>
              <p><strong>Service:</strong> ${body.serviceNeeded || 'Not specified'}</p>
              <p><strong>Message:</strong></p>
              <p>${body.shortCaseDescription || 'No message provided'}</p>
              <hr>
              <p>Submitted at: ${new Date().toISOString()}</p>
            `,
          }),
        });

        const emailResult = await emailResponse.json();
        console.log('[CONTACT API] Email response status:', emailResponse.status);
        console.log('[CONTACT API] Email result:', emailResult);

        if (emailResponse.ok) {
          console.log('[CONTACT API] ✅ Email sent successfully');
        } else {
          console.error('[CONTACT API] ❌ Email sending failed:', emailResult);
        }
      } catch (emailError) {
        console.error('[CONTACT API] Email sending exception:', emailError);
      }
    } else {
      console.warn('[CONTACT API] Resend API key not configured - email not sent');
    }

    // Return success regardless
    console.log('[CONTACT API] ✅ Contact form processed');
    return NextResponse.json({
      success: true,
      message: 'Thank you. Your enquiry has been received. Our team will contact you shortly.',
    });
  } catch (error) {
    console.error('[CONTACT API] FATAL ERROR:', error);
    return NextResponse.json(
      { success: false, error: 'An error occurred while processing your request' },
      { status: 500 }
    );
  }
}
