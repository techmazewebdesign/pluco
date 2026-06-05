import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    console.log('Webhook test - Data received:', JSON.stringify(data, null, 2));

    const webhookUrl = process.env.GOOGLE_SHEET_WEBHOOK_URL;

    if (!webhookUrl) {
      return NextResponse.json({ error: 'Webhook URL not configured' }, { status: 400 });
    }

    console.log('Sending to webhook:', webhookUrl);

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const responseText = await response.text();

    console.log('Webhook response status:', response.status);
    console.log('Webhook response text:', responseText);

    return NextResponse.json({
      success: response.ok,
      status: response.status,
      webhookUrl: webhookUrl,
      responseText: responseText,
      dataReceived: data,
    });
  } catch (error) {
    console.error('Test webhook error:', error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    }, { status: 500 });
  }
}
