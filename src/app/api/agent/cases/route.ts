import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

const CASES_WEB_APP_URL = process.env.GOOGLE_CASES_WEB_APP_URL;

// GET /api/agent/cases — fetch all cases from Leads CRM sheet
export async function GET() {
  try {
    if (!CASES_WEB_APP_URL) {
      return NextResponse.json(
        { success: false, error: 'Google Cases Sheet is not configured. Set GOOGLE_CASES_WEB_APP_URL in environment variables.' },
        { status: 503 }
      );
    }

    const response = await fetch(CASES_WEB_APP_URL, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Sheet responded with status ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching cases:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch cases from Google Sheet. Check connection.' },
      { status: 500 }
    );
  }
}

// POST /api/agent/cases — update a case status or add a new case
export async function POST(request: NextRequest) {
  try {
    if (!CASES_WEB_APP_URL) {
      return NextResponse.json(
        { success: false, error: 'Google Cases Sheet is not configured.' },
        { status: 503 }
      );
    }

    const body = await request.json();

    const response = await fetch(CASES_WEB_APP_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Sheet responded with status ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating case:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update case in Google Sheet.' },
      { status: 500 }
    );
  }
}
