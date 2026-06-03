import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Sending form to Google Sheet');

    // Get credentials from environment variables (kept secure on server)
    const googleWebAppUrl = process.env.GOOGLE_LEADS_WEB_APP_URL;
    const googleSecret = process.env.GOOGLE_LEADS_SECRET;

    if (!googleWebAppUrl || !googleSecret) {
      console.error('Missing Google Apps Script configuration');
      return NextResponse.json(
        { success: false, error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Send data to Google Apps Script
    const response = await fetch(googleWebAppUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        secret: googleSecret,
        fullName: body.fullName || '',
        email: body.email || '',
        phone: body.phone || '',
        currentCountry: body.currentCountry || '',
        preferredLanguage: body.preferredLanguage || '',
        serviceNeeded: body.serviceNeeded || '',
        shortCaseDescription: body.shortCaseDescription || '',
      }),
    });

    if (!response.ok) {
      console.error('Form sending failed:', response.status);
      return NextResponse.json(
        { success: false, error: 'Failed to save lead' },
        { status: 500 }
      );
    }

    console.log('Form sent successfully');
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { success: false, error: 'Something went wrong' },
      { status: 500 }
    );
  }
}
