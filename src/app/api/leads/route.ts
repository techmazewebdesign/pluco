import { NextRequest, NextResponse } from 'next/server';

interface LeadData {
  fullName: string;
  email: string;
  phone?: string;
  currentCountry?: string;
  preferredLanguage?: string;
  serviceNeeded?: string;
  urgency?: string;
  familyMembers?: string;
  numberOfFamilyMembers?: string;
  preferredContactMethod?: string;
  shortCaseDescription?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as LeadData;

    // Validate required fields
    if (!body.fullName || !body.email || !body.serviceNeeded) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: fullName, email, serviceNeeded' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Get environment variables (server-side only)
    const webAppUrl = process.env.GOOGLE_LEADS_WEB_APP_URL;
    const secret = process.env.GOOGLE_LEADS_SECRET;

    if (!webAppUrl || !secret) {
      console.error('Missing Google Apps Script configuration');
      return NextResponse.json(
        { success: false, error: 'Configuration error' },
        { status: 500 }
      );
    }

    // Prepare payload for Google Apps Script
    const payload = {
      secret,
      fullName: body.fullName,
      email: body.email,
      phone: body.phone || '',
      currentCountry: body.currentCountry || '',
      preferredLanguage: body.preferredLanguage || '',
      serviceNeeded: body.serviceNeeded,
      urgency: body.urgency || '',
      familyMembers: body.familyMembers || '',
      numberOfFamilyMembers: body.numberOfFamilyMembers || '',
      preferredContactMethod: body.preferredContactMethod || '',
      shortCaseDescription: body.shortCaseDescription || '',
    };

    // Send to Google Apps Script Web App
    const response = await fetch(webAppUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error(`Google Apps Script error: ${response.status}`);
      return NextResponse.json(
        { success: false, error: 'Failed to process lead' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { success: false, error: 'An error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
