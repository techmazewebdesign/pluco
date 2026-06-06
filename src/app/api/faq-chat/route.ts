import { NextRequest, NextResponse } from 'next/server';
import { Anthropic } from '@anthropic-ai/sdk';

// Log API key status on startup
const apiKey = process.env.ANTHROPIC_API_KEY;
console.log('[FAQ-Chat API] Initializing Anthropic client...');
console.log('[FAQ-Chat API] API Key exists:', apiKey ? 'YES' : 'NO (MISSING)');
console.log('[FAQ-Chat API] API Key length:', apiKey ? `${apiKey.length} characters` : 'N/A');

const client = new Anthropic({
  apiKey: apiKey,
});

const SYSTEM_PROMPT = `You are Pluco Assistant, a professional FAQ assistant for Pluco Group consulting services.

Your role:
- Provide general information about Pluco Group's services
- Answer questions about: EU Residency, Second Citizenship, US Green Card/EB-5, Banking Compliance, EU Company Registration, EU Property Purchase, International Contracts, Dispute Resolution, Business Solutions
- Be professional, concise, and helpful
- Guide users toward booking consultations or starting private inquiries

CRITICAL SAFETY RULES:
1. NEVER guarantee visa, residency, citizenship, banking, or legal outcomes
2. NEVER say "you will get" or "you will be approved for" any legal status
3. NEVER give specific legal advice - refer to consultation process
4. ALWAYS use safe language like:
   - "This depends on your personal case"
   - "Our team needs to review your documents"
   - "You may be eligible, but a detailed assessment is required"
   - "Contact our team for a case-specific review"
5. If asked about guarantees, outcomes, or legal certainty, say: "We cannot guarantee outcomes. Our team needs to review your complete documents and situation to provide proper guidance. A private consultation would help us understand your case better."
6. If asked about illegal activities, sanctions evasion, document fraud, or other illegal matters: "I cannot assist with that. Our services are fully compliant with all legal requirements."

Service Information:
- EU Residency: Programs for long-term EU residency across different countries
- Second Citizenship: Citizenship by investment or descent programs
- US Green Card/EB-5: Employment-based and investment-based green card programs
- Banking Compliance: Solutions for cross-border banking and financial compliance
- EU Company Registration: Establishing and managing EU-based companies
- EU Property Purchase: Legal guidance for property acquisition in EU countries
- International Contracts: Contract review and negotiation services
- Dispute Resolution: Legal dispute resolution and arbitration
- Business Solutions: Custom solutions for business expansion and structure
- Consultation: Free initial assessment or paid detailed consultation

Response Guidelines:
1. Keep responses concise (2-3 sentences max for quick questions)
2. Ask clarifying follow-up questions to understand their needs
3. Suggest "Start Private Inquiry" or "Book Consultation" when they need case-specific advice
4. Be warm and professional in tone
5. Use Pluco Group's service categories when describing solutions

Example Responses:
- "EU residency requirements vary by country. Could you tell me which country interests you? That will help me explain the specific programs available."
- "While I can't guarantee approval, our team has extensive experience with this type of case. A consultation would help us assess your specific situation and eligibility."
- "Banking compliance depends on your residence country and business structure. Let me understand your situation better - are you looking to open a business account or restructure existing banking arrangements?"`;

export async function POST(request: NextRequest) {
  const requestId = `req_${Date.now()}`;
  console.log(`[FAQ-Chat API] [${requestId}] Incoming request...`);

  try {
    // Parse request
    const { sessionId, userMessage, conversationHistory } = await request.json();
    console.log(`[FAQ-Chat API] [${requestId}] Parsed request: sessionId=${sessionId}, messageLength=${userMessage?.length || 0}`);

    if (!userMessage || typeof userMessage !== 'string') {
      console.error(`[FAQ-Chat API] [${requestId}] Invalid user message:`, userMessage);
      return NextResponse.json(
        { error: 'Invalid user message', errorCode: 'INVALID_MESSAGE' },
        { status: 400 }
      );
    }

    // Check API key
    if (!apiKey) {
      console.error(`[FAQ-Chat API] [${requestId}] CRITICAL: ANTHROPIC_API_KEY is missing from environment variables`);
      return NextResponse.json(
        {
          error: 'AI service not configured',
          errorCode: 'MISSING_API_KEY',
          message: 'The Anthropic API key is not configured. Please contact support.',
        },
        { status: 503 }
      );
    }

    // Build conversation for Claude
    const messages = [
      ...conversationHistory,
      {
        role: 'user' as const,
        content: userMessage,
      },
    ];

    console.log(`[FAQ-Chat API] [${requestId}] Calling Claude API with ${messages.length} messages...`);
    console.log(`[FAQ-Chat API] [${requestId}] Model: claude-3-5-haiku-20241022 (optimized for FAQ, low cost)`);

    // Call Claude API with Haiku model (optimized for FAQ, low cost)
    const response = await client.messages.create({
      model: 'claude-3-5-haiku-20241022',
      max_tokens: 500,
      system: SYSTEM_PROMPT,
      messages,
    });

    console.log(`[FAQ-Chat API] [${requestId}] Claude API response successful`);
    console.log(`[FAQ-Chat API] [${requestId}] Response status: ${response.stop_reason}, tokens used: ${response.usage?.output_tokens || 0}`);

    // Extract text from response
    const assistantMessage = response.content[0];
    if (!assistantMessage) {
      console.error(`[FAQ-Chat API] [${requestId}] Empty response content from Claude`);
      throw new Error('Empty response from Claude API');
    }

    if (assistantMessage.type !== 'text') {
      console.error(`[FAQ-Chat API] [${requestId}] Unexpected response type:`, assistantMessage.type);
      throw new Error(`Unexpected response type from Claude: ${assistantMessage.type}`);
    }

    const responseText = assistantMessage.text;
    console.log(`[FAQ-Chat API] [${requestId}] Assistant response text length: ${responseText.length} characters`);

    return NextResponse.json({
      response: responseText,
      sessionId,
      status: 'success',
    });
  } catch (error: any) {
    // Detailed error logging and diagnosis
    console.error(`[FAQ-Chat API] [${requestId}] ERROR caught:`, error?.message || String(error));
    console.error(`[FAQ-Chat API] [${requestId}] Error code:`, error?.code || error?.status || 'UNKNOWN');
    console.error(`[FAQ-Chat API] [${requestId}] Error type:`, error?.constructor?.name || typeof error);

    // Diagnose the error type
    let errorCode = 'UNKNOWN_ERROR';
    let errorMessage = 'An unexpected error occurred. Please try again.';
    let statusCode = 500;

    if (error?.code === 'invalid_api_key' || error?.status === 401) {
      errorCode = 'INVALID_API_KEY';
      errorMessage = 'API key is invalid or expired. Please contact support.';
      console.error(`[FAQ-Chat API] [${requestId}] DIAGNOSIS: Invalid Anthropic API key`);
      statusCode = 401;
    } else if (error?.code === 'insufficient_quota' || error?.status === 429) {
      errorCode = 'QUOTA_EXCEEDED';
      errorMessage = 'Rate limit exceeded. Please try again in a moment.';
      console.error(`[FAQ-Chat API] [${requestId}] DIAGNOSIS: Anthropic quota/rate limit exceeded`);
      statusCode = 429;
    } else if (error?.code === 'overloaded_error' || error?.status === 529) {
      errorCode = 'SERVICE_OVERLOADED';
      errorMessage = 'Anthropic service is temporarily overloaded. Please try again in a moment.';
      console.error(`[FAQ-Chat API] [${requestId}] DIAGNOSIS: Anthropic service overloaded`);
      statusCode = 503;
    } else if (error?.code === 'model_not_found') {
      errorCode = 'INVALID_MODEL';
      errorMessage = 'The AI model is not available. Please contact support.';
      console.error(`[FAQ-Chat API] [${requestId}] DIAGNOSIS: Claude model not found - check model name`);
      statusCode = 400;
    } else if (error?.code === 'invalid_request_error') {
      errorCode = 'INVALID_REQUEST';
      errorMessage = 'Invalid request to AI service. Please try again.';
      console.error(`[FAQ-Chat API] [${requestId}] DIAGNOSIS: Invalid request to Anthropic API`);
      statusCode = 400;
    } else if (error?.message?.includes('network') || error?.message?.includes('timeout')) {
      errorCode = 'NETWORK_ERROR';
      errorMessage = 'Network error connecting to AI service. Please try again.';
      console.error(`[FAQ-Chat API] [${requestId}] DIAGNOSIS: Network/timeout error`);
      statusCode = 503;
    } else if (!apiKey) {
      errorCode = 'MISSING_API_KEY';
      errorMessage = 'AI service not configured. Please contact support.';
      console.error(`[FAQ-Chat API] [${requestId}] DIAGNOSIS: API key is missing`);
      statusCode = 503;
    } else {
      console.error(`[FAQ-Chat API] [${requestId}] DIAGNOSIS: Unknown error - ${error?.message}`);
    }

    console.log(`[FAQ-Chat API] [${requestId}] Returning error response: ${errorCode} (${statusCode})`);

    return NextResponse.json(
      {
        error: errorMessage,
        errorCode: errorCode,
        status: 'error',
        requestId: requestId,
      },
      { status: statusCode }
    );
  }
}
