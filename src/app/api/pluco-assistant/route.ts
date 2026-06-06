import { NextRequest, NextResponse } from 'next/server';
import { Anthropic } from '@anthropic-ai/sdk';

// Initialize at module level
const API_KEY = process.env.ANTHROPIC_API_KEY || '';

console.log('[Pluco Assistant API] Module loaded');
console.log('[Pluco Assistant API] ANTHROPIC_API_KEY exists:', API_KEY ? 'YES' : 'NO');
console.log('[Pluco Assistant API] API Key length:', API_KEY ? `${API_KEY.length} chars` : 'N/A');

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

  console.log(`\n========================================`);
  console.log(`[Pluco Assistant API] [${requestId}] ===== REQUEST RECEIVED =====`);
  console.log(`[Pluco Assistant API] [${requestId}] Route: /api/pluco-assistant`);
  console.log(`[Pluco Assistant API] [${requestId}] Method: ${request.method}`);

  try {
    // Parse request body
    console.log(`[Pluco Assistant API] [${requestId}] Parsing request body...`);
    const body = await request.json();
    const { message, sessionId } = body;

    console.log(`[Pluco Assistant API] [${requestId}] Message: "${message?.substring(0, 50)}${message?.length > 50 ? '...' : ''}"`);
    console.log(`[Pluco Assistant API] [${requestId}] Session ID: ${sessionId}`);

    // Validate input
    if (!message || typeof message !== 'string') {
      console.error(`[Pluco Assistant API] [${requestId}] ERROR: Invalid message`);
      return NextResponse.json(
        {
          error: 'Invalid message',
          routeReached: true,
          envKeyExists: false,
        },
        { status: 400 }
      );
    }

    // Check API key
    console.log(`[Pluco Assistant API] [${requestId}] Checking ANTHROPIC_API_KEY...`);
    const keyExists = API_KEY && API_KEY.length > 0;
    console.log(`[Pluco Assistant API] [${requestId}] ANTHROPIC_API_KEY exists: ${keyExists ? 'YES' : 'NO'}`);

    if (!keyExists) {
      console.error(`[Pluco Assistant API] [${requestId}] CRITICAL ERROR: API key is missing!`);
      console.error(`[Pluco Assistant API] [${requestId}] Check: process.env.ANTHROPIC_API_KEY in Vercel settings`);
      return NextResponse.json(
        {
          error: 'API key not configured',
          errorType: 'MISSING_API_KEY',
          routeReached: true,
          envKeyExists: false,
          debug: 'ANTHROPIC_API_KEY environment variable is not set in Vercel',
        },
        { status: 503 }
      );
    }

    // Call Anthropic API
    console.log(`[Pluco Assistant API] [${requestId}] ===== CALLING ANTHROPIC =====`);
    console.log(`[Pluco Assistant API] [${requestId}] Model: claude-3-5-haiku-20241022`);
    console.log(`[Pluco Assistant API] [${requestId}] Max tokens: 500`);

    const response = await anthropic.messages.create({
      model: 'claude-3-5-haiku-20241022',
      max_tokens: 500,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: message,
        },
      ],
    });

    // Extract response text
    console.log(`[Pluco Assistant API] [${requestId}] ===== ANTHROPIC RESPONSE SUCCESS =====`);
    console.log(`[Pluco Assistant API] [${requestId}] Status: ${response.stop_reason}`);
    console.log(`[Pluco Assistant API] [${requestId}] Tokens used: ${response.usage?.output_tokens || 0}`);
    console.log(`[Pluco Assistant API] [${requestId}] Response type: ${response.content[0]?.type}`);

    const textContent = response.content[0];
    if (textContent.type !== 'text') {
      throw new Error(`Expected text response, got ${textContent.type}`);
    }

    const assistantMessage = textContent.text;
    console.log(`[Pluco Assistant API] [${requestId}] Message length: ${assistantMessage.length} chars`);
    console.log(`[Pluco Assistant API] [${requestId}] Message preview: "${assistantMessage.substring(0, 80)}..."`);

    const elapsedTime = Date.now() - startTime;
    console.log(`[Pluco Assistant API] [${requestId}] Total time: ${elapsedTime}ms`);
    console.log(`[Pluco Assistant API] [${requestId}] ===== SENDING RESPONSE TO FRONTEND =====\n`);

    return NextResponse.json(
      {
        assistantMessage,
        sessionId,
        status: 'success',
        routeReached: true,
        envKeyExists: true,
        modelUsed: 'claude-3-5-haiku-20241022',
        tokensUsed: response.usage?.output_tokens || 0,
      },
      { status: 200 }
    );
  } catch (error: any) {
    const elapsedTime = Date.now() - startTime;
    console.error(`\n========================================`);
    console.error(`[Pluco Assistant API] [${requestId}] ===== ERROR OCCURRED =====`);
    console.error(`[Pluco Assistant API] [${requestId}] Error message: ${error?.message}`);
    console.error(`[Pluco Assistant API] [${requestId}] Error type: ${error?.type || error?.constructor?.name}`);
    console.error(`[Pluco Assistant API] [${requestId}] Error status: ${error?.status || 'N/A'}`);
    console.error(`[Pluco Assistant API] [${requestId}] Error code: ${error?.code || 'N/A'}`);
    console.error(`[Pluco Assistant API] [${requestId}] Time elapsed: ${elapsedTime}ms`);

    // Diagnose error
    let errorType = 'UNKNOWN_ERROR';
    let userMessage = 'An unexpected error occurred';
    let statusCode = 500;

    if (error?.code === 'invalid_api_key') {
      errorType = 'INVALID_API_KEY';
      userMessage = 'API authentication failed. Please contact support.';
      console.error(`[Pluco Assistant API] [${requestId}] DIAGNOSIS: Anthropic API key is invalid or expired`);
      statusCode = 401;
    } else if (error?.code === 'invalid_request_error') {
      errorType = 'INVALID_REQUEST';
      userMessage = 'Invalid request to AI service. Try a different question.';
      console.error(`[Pluco Assistant API] [${requestId}] DIAGNOSIS: Request format issue`);
      statusCode = 400;
    } else if (error?.code === 'model_not_found') {
      errorType = 'MODEL_NOT_FOUND';
      userMessage = 'AI model not available.';
      console.error(`[Pluco Assistant API] [${requestId}] DIAGNOSIS: Claude model name is incorrect`);
      statusCode = 404;
    } else if (error?.code === 'insufficient_quota') {
      errorType = 'BILLING_ISSUE';
      userMessage = 'API quota exceeded. Our team is working on this.';
      console.error(`[Pluco Assistant API] [${requestId}] DIAGNOSIS: Anthropic account has no credits`);
      statusCode = 429;
    } else if (error?.message?.includes('timeout')) {
      errorType = 'TIMEOUT';
      userMessage = 'Request timed out. Please try again.';
      console.error(`[Pluco Assistant API] [${requestId}] DIAGNOSIS: Network timeout calling Anthropic`);
      statusCode = 504;
    } else if (error?.message?.includes('network')) {
      errorType = 'NETWORK_ERROR';
      userMessage = 'Network error. Please try again.';
      console.error(`[Pluco Assistant API] [${requestId}] DIAGNOSIS: Network connectivity issue`);
      statusCode = 503;
    } else {
      console.error(`[Pluco Assistant API] [${requestId}] DIAGNOSIS: Unknown error type`);
      console.error(`[Pluco Assistant API] [${requestId}] Full error:`, JSON.stringify(error, null, 2));
    }

    console.error(`[Pluco Assistant API] [${requestId}] ===== RETURNING ERROR RESPONSE =====\n`);

    return NextResponse.json(
      {
        error: userMessage,
        errorType,
        routeReached: true,
        envKeyExists: API_KEY ? true : false,
        debug: `Error calling Anthropic: ${error?.message}`,
      },
      { status: statusCode }
    );
  }
}
