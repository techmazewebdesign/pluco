import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    console.log('[API] Contact form submission received');
    const body = await req.json();

    // Get credentials from environment
    const webAppUrl = process.env.GOOGLE_LEADS_WEB_APP_URL;
    const secret = process.env.GOOGLE_LEADS_SECRET;

    if (!webAppUrl || !secret) {
      console.error('[API] Missing environment variables');
      return NextResponse.json({ success: false, error: 'Configuration error' }, { status: 500 });
    }

    console.log('[API] Sending to Google Apps Script');

    const response = await fetch(webAppUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        secret,
        fullName: body.fullName || '',
        email: body.email || '',
        phone: body.phone || '',
        currentCountry: body.currentCountry || '',
        preferredLanguage: body.preferredLanguage || 'English',
        serviceNeeded: body.serviceNeeded || '',
        shortCaseDescription: body.shortCaseDescription || '',
      }),
    });

    if (!response.ok) {
      console.error('[API] Google Apps Script error:', response.status);
      return NextResponse.json({ success: false, error: 'Failed to save' }, { status: 500 });
    }

    console.log('[API] Successfully submitted to Google Apps Script');
    return NextResponse.json({ success: true, message: 'Thank you. Your enquiry has been received. Our team will contact you shortly.' });
  } catch (error) {
    console.error('[API] Error:', error);
    return NextResponse.json({ success: false, error: 'Something went wrong' }, { status: 500 });
  }
}
