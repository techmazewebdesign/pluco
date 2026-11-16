import { NextRequest, NextResponse } from 'next/server';
import { Anthropic } from '@anthropic-ai/sdk';
import { getChatbotAnswer } from '@/lib/chatbotAnswers';

const MODEL = 'claude-haiku-4-5-20251001';
const SYSTEM_PROMPT = `You are Pluco Assistant. Answer frequently asked questions about Pluco Group's services: European residency, second citizenship planning, US investment immigration, banking documentation, company registration, property purchase, international contracts and cross-border disputes.
Give concise general information. Do not promise approvals, provide individual legal advice, or request sensitive documents. Refer visitors to a private inquiry for an individual assessment.`;

type Turn = { role: 'user' | 'assistant'; content: string };

function isTurn(value: unknown): value is Turn {
  if (!value || typeof value !== 'object') return false;
  const turn = value as Partial<Turn>;
  return (turn.role === 'user' || turn.role === 'assistant') && typeof turn.content === 'string' && !!turn.content.trim();
}

let providerRetryAt = 0;

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const rawMessage = body?.message || body?.userMessage || body?.text || body?.prompt;
  if (typeof rawMessage !== 'string' || !rawMessage.trim() || rawMessage.length > 2000) {
    return NextResponse.json({ success: false, errorType: 'INVALID_MESSAGE' }, { status: 400 });
  }

  const message = rawMessage.trim();
  const history: Turn[] = Array.isArray(body.history)
    ? body.history.slice(-8).filter(isTurn).map((turn: Turn) => ({ role: turn.role, content: turn.content.trim().slice(0, 2000) }))
    : [];
  const persian = /[\u0600-\u06ff]/u.test(message) || body.locale === 'fa';
  const sessionId = typeof body.sessionId === 'string' ? body.sessionId.slice(0, 150) : 'unknown';
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (apiKey && Date.now() >= providerRetryAt) {
    try {
      const anthropic = new Anthropic({ apiKey, timeout: 5500, maxRetries: 0 });
      const response = await anthropic.messages.create({
        model: MODEL,
        max_tokens: 500,
        temperature: 0.3,
        system: SYSTEM_PROMPT + (persian ? '\nAnswer in Persian.' : '\nAnswer in English.'),
        messages: [...history, { role: 'user', content: message }],
      });
      const assistantMessage = response.content.flatMap(block => block.type === 'text' ? [block.text] : []).join('\n').trim();
      if (assistantMessage) return NextResponse.json({ success: true, assistantMessage, sessionId, status: 'success' });
    } catch (error) {
      const status = error instanceof Anthropic.APIError ? error.status : undefined;
      const outOfCredits = error instanceof Error && /credit balance|billing_error/i.test(error.message);
      providerRetryAt = Date.now() + (outOfCredits || status === 401 || status === 402 ? 5 * 60_000 : 30_000);
      console.warn('[Pluco Assistant] Using FAQ fallback', { status, outOfCredits });
    }
  }

  const previousQuestion = history.findLast(turn => turn.role === 'user')?.content || '';
  const assistantMessage = getChatbotAnswer(message, previousQuestion, persian);
  return NextResponse.json({ success: true, assistantMessage, sessionId, status: 'success' });
}
