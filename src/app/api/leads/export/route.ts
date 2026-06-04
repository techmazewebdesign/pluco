import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

interface ExportLeadData {
  fullName: string;
  email: string;
  phone?: string;
  whatsapp?: string;
  country: string;
  nationality?: string;
  serviceInterest: string;
  sourceChannel: string;
  estimatedBudget: string;
  urgency: string;
  priorityScore: number;
  priorityLevel: string;
  status: string;
  aiRecommendedAction?: string;
  createdAt: string;
}

export async function POST(request: NextRequest) {
  try {
    const { leads } = await request.json() as { leads: ExportLeadData[] };

    if (!leads || !Array.isArray(leads) || leads.length === 0) {
      return NextResponse.json(
        { error: 'No leads to export' },
        { status: 400 }
      );
    }

    const webhookUrl = process.env.GOOGLE_SHEET_WEBHOOK_URL;

    if (!webhookUrl) {
      return NextResponse.json(
        {
          error: 'Google Sheet webhook is not configured',
          message: 'GOOGLE_SHEET_WEBHOOK_URL environment variable is not set'
        },
        { status: 400 }
      );
    }

    // Prepare data for webhook
    const payload = {
      timestamp: new Date().toISOString(),
      count: leads.length,
      leads: leads.map(lead => ({
        fullName: lead.fullName,
        email: lead.email,
        phone: lead.phone || '',
        whatsapp: lead.whatsapp || '',
        country: lead.country,
        nationality: lead.nationality || '',
        serviceInterest: lead.serviceInterest,
        sourceChannel: lead.sourceChannel,
        estimatedBudget: lead.estimatedBudget,
        urgency: lead.urgency,
        priorityScore: lead.priorityScore,
        priorityLevel: lead.priorityLevel,
        status: lead.status,
        aiRecommendedAction: lead.aiRecommendedAction || '',
        createdAt: lead.createdAt,
      })),
    };

    // Send to Google Apps Script webhook
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Webhook error:', errorText);
      return NextResponse.json(
        {
          error: 'Failed to export leads to Google Sheet',
          details: errorText
        },
        { status: response.status }
      );
    }

    const result = await response.json();

    return NextResponse.json({
      success: true,
      message: `Successfully exported ${leads.length} lead(s) to Google Sheet`,
      exported: leads.length,
      result: result,
    });
  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json(
      {
        error: 'Failed to export leads',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
