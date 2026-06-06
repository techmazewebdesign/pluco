import { NextRequest, NextResponse } from 'next/server';
import { Anthropic } from '@anthropic-ai/sdk';

// Initialize at module level
const API_KEY = process.env.ANTHROPIC_API_KEY || '';

console.log('[Pluco Assistant API] Module loaded');
console.log('[Pluco Assistant API] ANTHROPIC_API_KEY exists:', API_KEY ? 'YES' : 'NO');

const anthropic = new Anthropic({
  apiKey: API_KEY,
});

const SYSTEM_PROMPT = `You are Pluco Assistant, a helpful FAQ assistant for Pluco Group consulting services.

Be professional, concise, and helpful in answering questions about:
- EU Residency programs
- Second Citizenship by investment
- US Green Card/EB-5 programs
- Banking & Compliance solutions
- EU Company Registration
- EU Property Purchase
- International Contracts
- Dispute Resolution
- Business Solutions

IMPORTANT: Do not guarantee outcomes. Guide users to book consultations for case-specific advice.`;

export async function POST(request: NextRequest) {
  const requestId = Math.random().toString(36).substring(7);
  const startTime = Date.now();
  const MODEL = 'claude-haiku-4-5-20251001';

  console.log(`\n[Pluco Assistant API] [${requestId}] REQUEST RECEIVED`);
  console.log(`[Pluco Assistant API] [${requestId}] Route: /api/pluco-assistant`);

  try {
    // Parse request body safely with multiple fallbacks
    console.log(`[Pluco Assistant API] [${requestId}] Parsing request body...`);
    const body = await request.json().catch(() => ({}));

    // Try multiple field names for message
    const message = body.message || body.userMessage || body.text || body.prompt || '';

    console.log(`[Pluco Assistant API] [${requestId}] Body keys:`, Object.keys(body).join(', ') || 'EMPTY');
    console.log(`[Pluco Assistant API] [${requestId}] Message found:`, message ? 'YES' : 'NO');
    console.log(`[Pluco Assistant API] [${requestId}] Message length:`, message?.length || 0);

    if (!message || typeof message !== 'string' || message.trim() === '') {
      console.error(`[Pluco Assistant API] [${requestId}] MISSING_MESSAGE: No message in request body`);
      return NextResponse.json(
        {
          success: false,
          errorType: 'MISSING_MESSAGE',
          message: 'No message was received by the assistant API.',
          routeReached: true,
          envKeyExists: !!API_KEY,
          hasMessage: false,
        },
        { status: 400 }
      );
    }

    const sessionId = body.sessionId || 'unknown';
    const history = (body.history || []).filter((msg: any) => msg.role && msg.content);

    console.log(`[Pluco Assistant API] [${requestId}] Message: "${message.substring(0, 50)}${message.length > 50 ? '...' : ''}"`);
    console.log(`[Pluco Assistant API] [${requestId}] Session: ${sessionId}`);
    console.log(`[Pluco Assistant API] [${requestId}] History messages: ${history.length}`);

    // Check API key
    const keyExists = API_KEY && API_KEY.length > 0;
    console.log(`[Pluco Assistant API] [${requestId}] ANTHROPIC_API_KEY exists: ${keyExists ? 'YES' : 'NO'}`);

    if (!keyExists) {
      console.error(`[Pluco Assistant API] [${requestId}] CRITICAL: API key is missing from Vercel environment`);
      return NextResponse.json(
        {
          success: false,
          errorType: 'MISSING_API_KEY',
          message: 'The Anthropic API key is not configured.',
          routeReached: true,
          envKeyExists: false,
          hasMessage: true,
        },
        { status: 503 }
      );
    }

    // Build messages array - only user/assistant roles, no system
    const messages: Array<{ role: 'user' | 'assistant'; content: string }> = [
      ...history.filter((msg: any) => msg.role === 'user' || msg.role === 'assistant'),
      {
        role: 'user' as const,
        content: message.trim(),
      },
    ];

    console.log(`[Pluco Assistant API] [${requestId}] Calling Anthropic...`);
    console.log(`[Pluco Assistant API] [${requestId}] Model: ${MODEL}`);
    console.log(`[Pluco Assistant API] [${requestId}] Messages: ${messages.length}`);

    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 500,
      temperature: 0.3,
      system: SYSTEM_PROMPT,
      messages,
    });

    // Extract response
    console.log(`[Pluco Assistant API] [${requestId}] Anthropic success!`);
    console.log(`[Pluco Assistant API] [${requestId}] Stop reason: ${response.stop_reason}`);
    console.log(`[Pluco Assistant API] [${requestId}] Tokens: ${response.usage?.output_tokens || 0}`);

    const textContent = response.content[0];
    if (!textContent || textContent.type !== 'text') {
      throw new Error(`Invalid response type: ${textContent?.type || 'none'}`);
    }

    const assistantMessage = textContent.text;
    const elapsed = Date.now() - startTime;

    console.log(`[Pluco Assistant API] [${requestId}] Response: ${assistantMessage.length} chars`);
    console.log(`[Pluco Assistant API] [${requestId}] Time: ${elapsed}ms`);
    console.log(`[Pluco Assistant API] [${requestId}] SUCCESS\n`);

    return NextResponse.json(
      {
        success: true,
        assistantMessage,
        sessionId,
        status: 'success',
        routeReached: true,
        envKeyExists: true,
        hasMessage: true,
        modelUsed: MODEL,
        tokensUsed: response.usage?.output_tokens || 0,
      },
      { status: 200 }
    );
  } catch (error: any) {
    const elapsed = Date.now() - startTime;
    console.error(`[Pluco Assistant API] [${requestId}] ERROR: ${error?.message}`);
    console.error(`[Pluco Assistant API] [${requestId}] Type: ${error?.type || error?.code || 'UNKNOWN'}`);
    console.error(`[Pluco Assistant API] [${requestId}] Time: ${elapsed}ms\n`);

    let errorType = 'ANTHROPIC_UNKNOWN_ERROR';
    let statusCode = 500;
    let errorMessage = 'Failed to get response from AI service.';

    if (error?.code === 'invalid_api_key' || error?.status === 401) {
      errorType = 'ANTHROPIC_AUTH_ERROR';
      statusCode = 401;
      errorMessage = 'API authentication failed.';
    } else if (error?.code === 'insufficient_quota' || error?.status === 429) {
      errorType = 'ANTHROPIC_BILLING_ERROR';
      statusCode = 429;
      errorMessage = 'API quota exceeded. Please add credits.';
    } else if (error?.code === 'model_not_found' || error?.status === 404) {
      errorType = 'ANTHROPIC_MODEL_ERROR';
      statusCode = 404;
      errorMessage = `Model ${MODEL} not found. Please contact support.`;
      console.error(`[Pluco Assistant API] [${requestId}] Model not found: ${MODEL}`);
    } else if (error?.status === 500 || error?.status === 502 || error?.status === 503) {
      errorType = 'ANTHROPIC_SERVICE_ERROR';
      statusCode = 503;
      errorMessage = 'AI service temporarily unavailable.';
    }

    return NextResponse.json(
      {
        success: false,
        errorType,
        message: errorMessage,
        routeReached: true,
        envKeyExists: !!API_KEY,
        hasMessage: true,
        modelAttempted: MODEL,
      },
      { status: statusCode }
    );
  }
}
